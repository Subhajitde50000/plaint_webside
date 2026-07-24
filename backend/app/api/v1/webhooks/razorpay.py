import hmac
import hashlib
import json
from fastapi import APIRouter, Request, HTTPException, Depends, BackgroundTasks
from sqlalchemy.orm import Session

from app.database import get_db
from app.config import settings
from app.models.order import Order, OrderStatusHistory, Refund
from app.services.payment_service import PaymentService

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

        if order and order.status in {"cancelled_by_customer", "cancelled_by_admin", "refund_pending"}:
            # A late gateway capture must never revive a cancelled order or
            # deduct stock again. Move it directly into the refund branch.
            order.payment_status = "paid"
            order.razorpay_payment_id = payment["id"]
            gateway_refund_id = None
            try:
                gateway_refund_id = PaymentService().create_refund(
                    payment_id=payment["id"], amount_paise=int(float(order.total) * 100),
                    notes={"order_number": order.order_number, "reason": "Payment captured after cancellation"},
                ).get("id")
            except Exception:
                gateway_refund_id = None
            order.status = "refunded" if gateway_refund_id else "refund_pending"
            if gateway_refund_id:
                order.payment_status = "refunded"
            db.add(Refund(
                order_id=order.id, amount=order.total, reason="Payment captured after cancellation",
                type="full", gateway_refund_id=gateway_refund_id,
                status="processed" if gateway_refund_id else "pending",
            ))
            db.add(OrderStatusHistory(
                order_id=order.id, status=order.status,
                description="Refund completed after late payment" if gateway_refund_id else "Refund processing after late payment",
            ))
            db.commit()
        elif order and order.payment_status != "paid":
            order.payment_status = "paid"
            order.status = "payment_verified"
            order.razorpay_payment_id = payment["id"]
            db.add(OrderStatusHistory(
                order_id=order.id,
                status="payment_verified",
                description="Payment captured via Razorpay webhook",
            ))

            # ── Synchronously deduct inventory ──────────────────────────────
            from app.models.inventory import Inventory, InventoryHistory
            # Stock is committed at ORDER_ACCEPTED by admin, not payment capture.
            for item in ():
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
            order.status = "payment_failed"
            # The gateway order is backed by a provisional order reservation.
            # Release it immediately when payment fails so stock is sellable again.
            from app.models.inventory import Inventory
            for item in order.items:
                inv = db.query(Inventory).filter(Inventory.variant_id == item.variant_id).with_for_update().first()
                if inv:
                    inv.reserved = max(0, inv.reserved - item.quantity)
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
                order.status = "refunded"
                order.payment_status = "refunded"
                db.add(OrderStatusHistory(
                    order_id=order.id,
                    status="refunded",
                    description="Refund completed via Razorpay webhook",
                ))
                db.commit()

    return {"status": "ok"}
