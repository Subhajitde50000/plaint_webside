# app/api/v1/admin/orders.py
from fastapi import APIRouter, Depends, HTTPException, Query, BackgroundTasks
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import and_, or_
from typing import Optional, List

from app.database import get_db
from app.dependencies import require_support_or_above, require_ops_or_above
from app.models.order import Order, OrderStatusHistory, OrderNote, Refund
from app.models.admin import AdminUser
from app.schemas.order import (
    AdminOrderListResponse, AdminOrderDetailResponse,
    UpdateFulfillmentRequest, AdminOrderNoteRequest
)
from app.services.shipping_service import ShippingService
from app.tasks.order_tasks import send_fulfillment_notification

router = APIRouter(prefix="/admin/orders", tags=["Admin - Orders"])


@router.get("/", response_model=AdminOrderListResponse)
async def list_orders(
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_support_or_above),
    status: Optional[str] = None,
    payment_status: Optional[str] = None,
    fulfillment_status: Optional[str] = None,
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
    city: Optional[str] = None,
    tag: Optional[str] = None,
    q: Optional[str] = None,
    sort: str = Query(default="newest", enum=["newest","oldest","highest","lowest"]),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=25, ge=1, le=250),
):
    query = db.query(Order)

    if status:
        query = query.filter(Order.status == status)
    if payment_status:
        query = query.filter(Order.payment_status == payment_status)
    if q:
        query = query.filter(
            or_(
                Order.order_number.ilike(f"%{q}%"),
                Order.guest_email.ilike(f"%{q}%"),
                Order.tracking_number.ilike(f"%{q}%"),
            )
        )
    if date_from:
        query = query.filter(Order.created_at >= date_from)
    if date_to:
        query = query.filter(Order.created_at <= date_to)

    sort_map = {
        "newest": Order.created_at.desc(),
        "oldest": Order.created_at.asc(),
        "highest": Order.total.desc(),
        "lowest": Order.total.asc(),
    }
    query = query.order_by(sort_map[sort])

    total = query.count()
    orders = query.options(
        joinedload(Order.user),
        joinedload(Order.items),
    ).offset((page - 1) * page_size).limit(page_size).all()

    return AdminOrderListResponse(
        items=orders, total=total, page=page, page_size=page_size
    )


@router.get("/{order_uuid}", response_model=AdminOrderDetailResponse)
async def get_order_detail(
    order_uuid: str,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_support_or_above),
):
    order = db.query(Order).options(
        joinedload(Order.user),
        joinedload(Order.items),
        joinedload(Order.status_history),
        joinedload(Order.notes),
        joinedload(Order.shipping_address),
    ).filter(Order.uuid == order_uuid).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")
    return order


@router.post("/{order_uuid}/fulfill")
async def fulfill_order(
    order_uuid: str,
    payload: UpdateFulfillmentRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_ops_or_above),
):
    order = db.query(Order).filter(Order.uuid == order_uuid).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")

    if order.fulfillment_status == "fulfilled":
        raise HTTPException(status_code=400, detail="Order is already fulfilled.")

    order.fulfillment_status = "fulfilled"
    order.status = "dispatched"
    order.shipping_carrier = payload.carrier
    order.tracking_number = payload.tracking_number
    order.tracking_url = payload.tracking_url

    db.add(OrderStatusHistory(
        order_id=order.id,
        admin_id=admin.id,
        status="dispatched",
        description=f"Marked as fulfilled. Tracking: {payload.tracking_number}"
    ))

    # Release inventory reservations, deduct actual stock
    from app.tasks.order_tasks import deduct_inventory_on_fulfillment
    background_tasks.add_task(
        deduct_inventory_on_fulfillment.delay, order.id
    )

    if payload.notify_customer:
        background_tasks.add_task(
            send_fulfillment_notification.delay, order.id
        )

    db.commit()
    return {"message": "Order fulfilled.", "tracking": payload.tracking_number}


@router.post("/{order_uuid}/cancel")
async def cancel_order(
    order_uuid: str,
    payload: dict,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_ops_or_above),
):
    order = db.query(Order).filter(Order.uuid == order_uuid).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")

    cancellable = {"order_placed", "payment_confirmed", "processing", "packed"}
    if order.status not in cancellable:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot cancel an order in '{order.status}' status."
        )

    order.status = "cancelled"
    order.cancelled_at = datetime.now(timezone.utc)
    order.cancel_reason = payload.get("reason")
    order.cancelled_by = "admin"

    db.add(OrderStatusHistory(
        order_id=order.id,
        admin_id=admin.id,
        status="cancelled",
        description=f"Cancelled by admin. Reason: {payload.get('reason')}"
    ))

    # Release reserved inventory
    from app.tasks.order_tasks import release_inventory_on_cancel
    release_inventory_on_cancel.delay(order.id)

    db.commit()
    return {"message": "Order cancelled."}


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