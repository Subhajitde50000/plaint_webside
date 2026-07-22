from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.database import get_db
from app.dependencies import require_ops_or_above, require_support_or_above, get_current_admin
from app.models.order import Order, OrderStatusHistory, OrderNote, Refund, OrderTag
from app.models.admin import AdminUser
from app.models.user import User
from app.models.address import Address
from app.schemas.order import (
    UpdateFulfillmentRequest, AdminOrderNoteRequest, CancelOrderRequest, RefundRequest,
    AdminOrderListResponse, AdminOrderDetailResponse, UpdateTrackingRequest,
    AssignCourierRequest, AddTagRequest
)
from app.utils.pagination import paginate
from app.services.payment_service import PaymentService
from app.tasks.order_tasks import (
    release_inventory_on_cancel, send_fulfillment_notification
)

router = APIRouter(prefix="/admin/orders", tags=["Admin - Orders"])


@router.get("/", response_model=AdminOrderListResponse)
async def list_orders(
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_support_or_above),
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=100),
    status: Optional[str] = None,
    payment_status: Optional[str] = None,
    fulfillment_status: Optional[str] = None,
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
    city: Optional[str] = None,
    tag: Optional[str] = None,
    q: Optional[str] = None,
    sort: str = "newest",
):
    query = db.query(Order)
    
    # Apply filters
    if status:
        query = query.filter(Order.status == status)
    if payment_status:
        query = query.filter(Order.payment_status == payment_status)
    if fulfillment_status:
        query = query.filter(Order.fulfillment_status == fulfillment_status)
        
    if date_from:
        try:
            dt_from = datetime.fromisoformat(date_from.replace("Z", "+00:00"))
            query = query.filter(Order.created_at >= dt_from)
        except ValueError:
            pass
    if date_to:
        try:
            dt_to = datetime.fromisoformat(date_to.replace("Z", "+00:00"))
            query = query.filter(Order.created_at <= dt_to)
        except ValueError:
            pass
            
    if city:
        query = query.join(Order.shipping_address).filter(Address.city.ilike(f"%{city}%"))
        
    if tag:
        query = query.join(Order.tags).filter(OrderTag.tag == tag)
        
    if q:
        query = query.outerjoin(Order.user).outerjoin(Order.shipping_address)
        query = query.filter(
            (Order.order_number.ilike(f"%{q}%")) |
            (Order.guest_email.ilike(f"%{q}%")) |
            (User.email.ilike(f"%{q}%")) |
            (User.first_name.ilike(f"%{q}%")) |
            (User.last_name.ilike(f"%{q}%")) |
            (Address.recipient_name.ilike(f"%{q}%"))
        )
        
    # Apply sorting
    if sort == "oldest":
        query = query.order_by(Order.created_at.asc())
    elif sort == "total_high":
        query = query.order_by(Order.total.desc())
    elif sort == "total_low":
        query = query.order_by(Order.total.asc())
    else: # newest
        query = query.order_by(Order.created_at.desc())
        
    result = paginate(query, page, page_size)
    return result


@router.get("/{order_uuid}", response_model=AdminOrderDetailResponse)
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
    db.add(OrderNote(
        order_id=order.id,
        admin_id=admin.id,
        note=f"Order Cancelled. Reason: {payload.reason}",
        is_internal=True,
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


@router.delete("/{order_uuid}/notes/{note_id}")
async def delete_order_note(
    order_uuid: str,
    note_id: int,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_support_or_above),
):
    order = db.query(Order).filter(Order.uuid == order_uuid).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")
    note = db.query(OrderNote).filter(OrderNote.id == note_id, OrderNote.order_id == order.id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found.")
    db.delete(note)
    db.commit()
    return {"message": "Note deleted."}


@router.patch("/{order_uuid}/tracking")
async def update_order_tracking(
    order_uuid: str,
    payload: UpdateTrackingRequest,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_ops_or_above),
):
    order = db.query(Order).filter(Order.uuid == order_uuid).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")
    order.shipping_carrier = payload.carrier
    order.tracking_number = payload.tracking_number
    db.commit()
    return {"message": "Tracking updated."}


@router.post("/{order_uuid}/assign-courier")
async def assign_courier(
    order_uuid: str,
    payload: AssignCourierRequest,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_ops_or_above),
):
    order = db.query(Order).filter(Order.uuid == order_uuid).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")
    order.shipping_carrier = payload.carrier
    db.add(OrderStatusHistory(
        order_id=order.id,
        status=order.status,
        description=f"Courier assigned: {payload.carrier}",
        admin_id=admin.id,
    ))
    db.commit()
    return {"message": f"Courier assigned: {payload.carrier}"}


@router.post("/{order_uuid}/tags")
async def add_order_tag(
    order_uuid: str,
    payload: AddTagRequest,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_support_or_above),
):
    order = db.query(Order).filter(Order.uuid == order_uuid).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")
    
    cleaned_tag = payload.tag.strip()
    if not cleaned_tag:
        raise HTTPException(status_code=400, detail="Tag cannot be empty.")
    
    existing = db.query(OrderTag).filter(OrderTag.order_id == order.id, OrderTag.tag == cleaned_tag).first()
    if not existing:
        db.add(OrderTag(order_id=order.id, tag=cleaned_tag))
        db.commit()
    
    return {"message": f"Tag '{cleaned_tag}' added."}


@router.delete("/{order_uuid}/tags/{tag_name}")
async def delete_order_tag(
    order_uuid: str,
    tag_name: str,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_support_or_above),
):
    order = db.query(Order).filter(Order.uuid == order_uuid).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")
    
    tag = db.query(OrderTag).filter(OrderTag.order_id == order.id, OrderTag.tag == tag_name).first()
    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found.")
    
    db.delete(tag)
    db.commit()
    return {"message": f"Tag '{tag_name}' deleted."}
