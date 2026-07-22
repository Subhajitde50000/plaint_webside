import hmac
import hashlib
import json
from fastapi import APIRouter, Request, HTTPException, Depends, BackgroundTasks
from sqlalchemy.orm import Session

from app.database import get_db
from app.config import settings
from app.models.order import Order, OrderStatusHistory

router = APIRouter(prefix="/webhooks/razorpay", tags=["Webhooks"])


@router.post("/")
async def razorpay_webhook(
    request: Request,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    body = await request.body()
    signature = request.headers.get("X-Razorpay-Signature", "")

    # HMAC-SHA256 signature verification
    expected = hmac.new(
        settings.RAZORPAY_WEBHOOK_SECRET.encode(),
        body,
        hashlib.sha256,
    ).hexdigest()

    if not hmac.compare_digest(expected, signature):
        raise HTTPException(status_code=400, detail="Invalid webhook signature.")

    payload = json.loads(body)
    event = payload.get("event")

    if event == "payment.captured":
        payment = payload["payload"]["payment"]["entity"]
        rp_order_id = payment.get("order_id")

        order = db.query(Order).filter(
            Order.razorpay_order_id == rp_order_id
        ).first()

        if order and order.payment_status != "paid":
            order.payment_status = "paid"
            order.status = "payment_confirmed"
            order.razorpay_payment_id = payment["id"]
            db.add(OrderStatusHistory(
                order_id=order.id,
                status="payment_confirmed",
                description="Payment captured via Razorpay webhook",
            ))

            # ── Synchronously deduct inventory ──────────────────────────────
            from app.models.inventory import Inventory, InventoryHistory
            for item in order.items:
                inv = db.query(Inventory).filter(
                    Inventory.variant_id == item.variant_id
                ).with_for_update().first()
                if inv:
                    already_deducted = db.query(InventoryHistory).filter(
                        InventoryHistory.reference_id == order.order_number,
                        InventoryHistory.variant_id == item.variant_id,
                        InventoryHistory.type == "sale",
                    ).first()
                    if not already_deducted:
                        inv.reserved = max(0, inv.reserved - item.quantity)
                        inv.quantity = max(0, inv.quantity - item.quantity)
                        db.add(InventoryHistory(
                            variant_id=item.variant_id,
                            type="sale",
                            quantity_change=-item.quantity,
                            quantity_before=inv.quantity + item.quantity,
                            quantity_after=inv.quantity,
                            reason=f"Order {order.order_number} payment confirmed (webhook)",
                            reference_id=order.order_number,
                        ))

            db.commit()

            from app.tasks.order_tasks import post_payment_tasks
            try:
                background_tasks.add_task(post_payment_tasks.delay, order.id)
            except Exception:
                pass

    elif event == "payment.failed":
        payment = payload["payload"]["payment"]["entity"]
        rp_order_id = payment.get("order_id")
        order = db.query(Order).filter(
            Order.razorpay_order_id == rp_order_id
        ).first()
        if order:
            order.payment_status = "failed"
            db.add(OrderStatusHistory(
                order_id=order.id,
                status="payment_failed",
                description=f"Payment failed: {payment.get('error_description', '')}",
            ))
            db.commit()

    elif event == "refund.created":
        refund_data = payload["payload"]["refund"]["entity"]
        order = db.query(Order).filter(
            Order.razorpay_payment_id == refund_data.get("payment_id")
        ).first()
        if order:
            from app.models.order import Refund
            refund = db.query(Refund).filter(
                Refund.order_id == order.id,
                Refund.status == "pending",
            ).first()
            if refund:
                refund.status = "processed"
                refund.gateway_refund_id = refund_data["id"]
                db.commit()

    return {"status": "ok"}
