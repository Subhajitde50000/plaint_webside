from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.database import get_db
from app.dependencies import require_ops_or_above, require_support_or_above, get_current_admin
from app.models.order import Order, OrderStatusHistory, OrderNote, Refund
from app.models.admin import AdminUser
from app.schemas.order import (
    UpdateFulfillmentRequest, AdminOrderNoteRequest, CancelOrderRequest, RefundRequest
)
from app.utils.pagination import paginate
from app.services.payment_service import PaymentService
from app.tasks.order_tasks import (
    release_inventory_on_cancel, send_fulfillment_notification
)

router = APIRouter(prefix="/admin/orders", tags=["Admin - Orders"])


@router.get("/")
async def list_orders(
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_support_or_above),
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=100),
    status: Optional[str] = None,
    payment_status: Optional[str] = None,
    search: Optional[str] = None,
):
    query = db.query(Order)
    if status:
        query = query.filter(Order.status == status)
    if payment_status:
        query = query.filter(Order.payment_status == payment_status)
    if search:
        query = query.filter(Order.order_number.ilike(f"%{search}%"))
    query = query.order_by(Order.created_at.desc())
    result = paginate(query, page, page_size)
    result["items"] = [
        {
            "uuid": o.uuid,
            "order_number": o.order_number,
            "total": str(o.total),
            "status": o.status,
            "payment_status": o.payment_status,
            "fulfillment_status": o.fulfillment_status,
            "created_at": o.created_at.isoformat(),
            "items_count": len(o.items),
        }
        for o in result["items"]
    ]
    return result


@router.get("/{order_uuid}")
async def get_order(
    order_uuid: str,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_support_or_above),
):
    order = db.query(Order).filter(Order.uuid == order_uuid).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")
    return order


@router.post("/{order_uuid}/fulfill")
async def fulfill_order(
    order_uuid: str,
    payload: UpdateFulfillmentRequest,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_ops_or_above),
):
    order = db.query(Order).filter(Order.uuid == order_uuid).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")

    order.shipping_carrier = payload.carrier
    order.tracking_number = payload.tracking_number
    order.tracking_url = payload.tracking_url
    order.status = "dispatched"
    order.fulfillment_status = "fulfilled"
    db.add(OrderStatusHistory(
        order_id=order.id,
        status="dispatched",
        description=f"Dispatched via {payload.carrier}. AWB: {payload.tracking_number}",
        admin_id=admin.id,
    ))
    db.commit()

    if payload.notify_customer:
        send_fulfillment_notification.delay(order.id)

    return {"message": "Order fulfilled and customer notified."}


@router.post("/{order_uuid}/cancel")
async def admin_cancel_order(
    order_uuid: str,
    payload: CancelOrderRequest,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_ops_or_above),
):
    order = db.query(Order).filter(Order.uuid == order_uuid).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")
    if order.status in ("delivered", "cancelled"):
        raise HTTPException(status_code=400, detail=f"Cannot cancel order in '{order.status}' state.")

    order.status = "cancelled"
    order.cancelled_at = datetime.now(timezone.utc)
    order.cancel_reason = payload.reason
    order.cancelled_by = "admin"
    db.add(OrderStatusHistory(
        order_id=order.id,
        status="cancelled",
        description=f"Admin cancelled: {payload.reason}",
        admin_id=admin.id,
    ))
    db.commit()
    release_inventory_on_cancel.delay(order.id)
    return {"message": "Order cancelled."}


@router.post("/{order_uuid}/refund")
async def create_refund(
    order_uuid: str,
    payload: RefundRequest,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_ops_or_above),
):
    order = db.query(Order).filter(Order.uuid == order_uuid).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")
    if not order.razorpay_payment_id:
        raise HTTPException(status_code=400, detail="No payment ID found for this order.")

    payment_svc = PaymentService()
    try:
        rp_refund = payment_svc.create_refund(
            payment_id=order.razorpay_payment_id,
            amount_paise=int(float(payload.amount) * 100),
            notes={"order_number": order.order_number, "reason": payload.reason or ""},
        )
        gateway_refund_id = rp_refund.get("id")
    except Exception:
        gateway_refund_id = None

    db.add(Refund(
        order_id=order.id,
        admin_id=admin.id,
        amount=payload.amount,
        reason=payload.reason,
        type=payload.type,
        gateway_refund_id=gateway_refund_id,
        status="processed" if gateway_refund_id else "pending",
    ))
    db.commit()
    return {"message": "Refund initiated.", "gateway_refund_id": gateway_refund_id}


@router.post("/{order_uuid}/notes")
async def add_order_note(
    order_uuid: str,
    payload: AdminOrderNoteRequest,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_support_or_above),
):
    order = db.query(Order).filter(Order.uuid == order_uuid).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")
    note = OrderNote(
        order_id=order.id,
        admin_id=admin.id,
        note=payload.note,
        is_internal=payload.is_internal,
    )
    db.add(note)
    db.commit()
    return {"message": "Note added."}
