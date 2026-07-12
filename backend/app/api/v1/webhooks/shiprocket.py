from fastapi import APIRouter, Request, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.order import Order, OrderStatusHistory

router = APIRouter(prefix="/webhooks/shiprocket", tags=["Webhooks"])

STATUS_MAP = {
    "PICKUP PENDING": "processing",
    "PICKUP SCHEDULED": "processing",
    "PICKED UP": "dispatched",
    "IN TRANSIT": "in_transit",
    "OUT FOR DELIVERY": "out_for_delivery",
    "DELIVERED": "delivered",
    "DELIVERY FAILED": "delivery_attempted",
    "UNDELIVERED": "delivery_attempted",
    "RTO INITIATED": "return_in_transit",
    "RTO DELIVERED": "return_received",
}

@router.post("/")
async def shiprocket_webhook(
    request: Request,
    db: Session = Depends(get_db),
):
    payload = await request.json()
    awb = payload.get("awb")
    sr_status = payload.get("current_status", "")
    location = payload.get("location", "")

    if not awb:
        return {"status": "ignored"}

    order = db.query(Order).filter(Order.awb_code == awb).first()
    if not order:
        return {"status": "not_found"}

    new_status = STATUS_MAP.get(sr_status.upper())
    if new_status and order.status != new_status:
        order.status = new_status
        if new_status == "delivered":
            from datetime import datetime, timezone
            order.delivered_at = datetime.now(timezone.utc)

        db.add(OrderStatusHistory(
            order_id=order.id,
            status=new_status,
            location=location,
            description=f"Shiprocket: {sr_status}",
        ))
        db.commit()

    return {"status": "ok"}