from fastapi import APIRouter, Request, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
import hmac, hashlib, json
from app.database import get_db
from app.config import settings
from app.models.order import Order, OrderStatusHistory
from fastapi import Depends

router = APIRouter(prefix="/webhooks/razorpay", tags=["Webhooks"])

@router.post("/")
async def razorpay_webhook(
    request: Request,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    body = await request.body()
    signature = request.headers.get("X-Razorpay-Signature", "")

    # Verify webhook signature
    expected = hmac.new(
        settings.RAZORPAY_WEBHOOK_SECRET.encode(),
        body,
        hashlib.sha256
    ).hexdigest()

    if not hmac.compare_digest(expected, signature):
        raise HTTPException(status_code=400, detail="Invalid webhook signature.")

    payload = json.loads(body)
    event = payload.get("event")

    if event == "payment.captured":
        payment = payload["payload"]["payment"]["entity"]
        order_id = payment.get("order_id")

        order = db.query(Order).filter(
            Order.razorpay_order_id == order_id
        ).first()

        if order and order.payment_status != "paid":
            order.payment_status = "paid"
            order.status = "payment_confirmed"
            order.razorpay_payment_id = payment["id"]
            db.add(OrderStatusHistory(
                order_id=order.id,
                status="payment_confirmed",
                description="Payment captured via Razorpay webhook"
            ))
            db.commit()

            from app.tasks.order_tasks import post_payment_tasks
            background_tasks.add_task(post_payment_tasks.delay, order.id)

    elif event == "refund.created":
        refund_data = payload["payload"]["refund"]["entity"]
        order = db.query(Order).filter(
            Order.razorpay_payment_id == refund_data.get("payment_id")
        ).first()
        if order:
            from app.models.order import Refund
            refund = db.query(Refund).filter(
                Refund.order_id == order.id,
                Refund.status == "pending"
            ).first()
            if refund:
                refund.status = "processed"
                refund.gateway_refund_id = refund_data["id"]
                db.commit()

    return {"status": "ok"}