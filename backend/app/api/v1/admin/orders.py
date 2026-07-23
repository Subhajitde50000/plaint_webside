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
    , UpdateOrderStatusRequest
)
from app.utils.pagination import paginate
from app.services.payment_service import PaymentService
from app.models.inventory import Inventory, InventoryHistory
from app.tasks.order_tasks import send_fulfillment_notification, send_cancellation_notification

router = APIRouter(prefix="/admin/orders", tags=["Admin - Orders"])

ADMIN_ORDER_STATUSES = {
    "new_order", "payment_pending", "payment_failed", "payment_verified", "payment_confirmed",
    "cod_eligibility_verified", "cod_amount_collected", "order_accepted", "order_confirmed",
    "inventory_reserved", "picking", "quality_check", "packed",
    "ready_for_dispatch", "courier_assigned", "picked_up", "shipped",
    "in_transit", "out_for_delivery", "delivered", "completed",
    "cancelled_by_customer", "cancelled_by_admin", "refund_pending", "refunded",
    "return_requested", "return_approved", "return_pickup_scheduled",
    "return_received", "return_inspection", "return_rejected", "return_completed",
}


@router.patch("/{order_uuid}/status")
async def update_order_status(
    order_uuid: str,
    payload: UpdateOrderStatusRequest,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_ops_or_above),
):
    """Move an order through the operations workflow and append its audit trail."""
    if payload.status not in ADMIN_ORDER_STATUSES:
        raise HTTPException(status_code=400, detail="Unsupported order status.")
    if payload.status in {"cancelled_by_customer", "cancelled_by_admin"}:
        raise HTTPException(
            status_code=400,
            detail="Use the managed cancellation action so inventory and refund handling are applied.",
        )

    order = db.query(Order).filter(Order.uuid == order_uuid).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")
    if order.status in {"completed", "refunded", "return_completed"}:
        raise HTTPException(status_code=400, detail="A completed, cancelled, refunded, or returned order cannot be moved.")
    if order.status in {"cancelled_by_customer", "cancelled_by_admin", "cancelled"} and payload.status != "refund_pending":
        raise HTTPException(status_code=400, detail="A cancelled order can only move to refund processing.")
    if payload.status in {"order_accepted", "order_confirmed", "inventory_reserved", "picking", "quality_check", "packed", "ready_for_dispatch", "courier_assigned", "picked_up", "shipped"} and order.payment_status not in {"paid", "cod_pending"}:
        raise HTTPException(status_code=400, detail="Payment must be confirmed before fulfillment can begin.")
    is_cod = order.payment_gateway == "cod"
    if payload.status == "cod_eligibility_verified" and (not is_cod or order.payment_status != "cod_pending"):
        raise HTTPException(status_code=400, detail="COD eligibility can only be verified for a pending COD order.")
    if payload.status in {"order_accepted", "order_confirmed"} and is_cod and order.status != "cod_eligibility_verified":
        raise HTTPException(status_code=400, detail="Verify COD eligibility before accepting a COD order.")
    if payload.status == "order_accepted":
        for item in order.items:
            inv = db.query(Inventory).filter(Inventory.variant_id == item.variant_id).with_for_update().first()
            if not inv or inv.quantity - inv.reserved < item.quantity:
                raise HTTPException(status_code=400, detail=f"Insufficient stock to accept order item '{item.title}'.")
            already_committed = db.query(InventoryHistory).filter(
                InventoryHistory.reference_id == order.order_number,
                InventoryHistory.variant_id == item.variant_id,
                InventoryHistory.type == "sale",
            ).first()
            if not already_committed:
                quantity_before = inv.quantity
                # Release a reservation left by orders created before this
                # acceptance-only inventory policy, then commit stock once.
                if inv.reserved >= item.quantity:
                    inv.reserved -= item.quantity
                inv.quantity -= item.quantity
                db.add(InventoryHistory(
                    variant_id=item.variant_id, admin_id=admin.id, type="sale",
                    quantity_change=-item.quantity, quantity_before=quantity_before,
                    quantity_after=inv.quantity,
                    reason=f"Order {order.order_number} accepted; inventory reserved",
                    reference_id=order.order_number,
                ))
    if payload.status == "cod_amount_collected":
        if not is_cod or order.status != "out_for_delivery":
            raise HTTPException(status_code=400, detail="COD amount can only be collected for a COD order that is out for delivery.")
        order.payment_status = "paid"
    if payload.status == "delivered" and is_cod and order.status != "cod_amount_collected":
        raise HTTPException(status_code=400, detail="Record COD amount collection before marking this order as delivered.")
    if payload.status == "shipped" and (not order.shipping_carrier or not order.tracking_number):
        raise HTTPException(
            status_code=400,
            detail="Save carrier and tracking number before marking an order as shipped.",
        )

    order.status = payload.status
    if payload.status in {"delivered", "completed"}:
        order.fulfillment_status = "fulfilled"
        if payload.status == "delivered":
            order.delivered_at = datetime.now(timezone.utc)
    elif payload.status in {"return_received", "return_completed"}:
        order.fulfillment_status = "returned"

    db.add(OrderStatusHistory(
        order_id=order.id, status=payload.status, location=payload.location,
        description=payload.description or payload.status.replace("_", " ").title(),
        admin_id=admin.id,
    ))
    db.commit()
    return {"message": "Order status updated.", "status": order.status}


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
    order.status = "shipped"
    order.fulfillment_status = "fulfilled"
    db.add(OrderStatusHistory(
        order_id=order.id,
        status="shipped",
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
    if order.status in ("shipped", "dispatched", "in_transit", "out_for_delivery", "delivered", "completed", "cancelled_by_customer", "cancelled_by_admin", "refund_pending", "refunded", "return_requested", "return_approved", "return_pickup_scheduled", "return_received", "return_inspection", "return_rejected", "return_completed"):
        raise HTTPException(status_code=400, detail=f"Cannot cancel order in '{order.status}' state.")

    order.status = "cancelled_by_admin"
    order.cancelled_at = datetime.now(timezone.utc)
    order.cancel_reason = payload.reason
    order.cancelled_by = "admin"
    db.add(OrderStatusHistory(
        order_id=order.id,
        status="cancelled_by_admin",
        description=f"Admin cancelled: {payload.reason}",
        admin_id=admin.id,
    ))
    db.add(OrderNote(
        order_id=order.id,
        admin_id=admin.id,
        note=f"Order Cancelled. Reason: {payload.reason}",
        is_internal=True,
    ))

    # ── Synchronously restore inventory ─────────────────────────────────────
    for item in order.items:
        sale_history = db.query(InventoryHistory).filter(
            InventoryHistory.reference_id == order.order_number,
            InventoryHistory.variant_id == item.variant_id,
            InventoryHistory.type == "sale",
        ).first()
        restock_history = db.query(InventoryHistory).filter(
            InventoryHistory.reference_id == order.order_number,
            InventoryHistory.variant_id == item.variant_id,
            InventoryHistory.type == "adjustment",
            InventoryHistory.reason.like("%cancelled (restocked)%"),
        ).first()
        inv = db.query(Inventory).filter(
            Inventory.variant_id == item.variant_id
        ).with_for_update().first()
        if inv:
            if sale_history and not restock_history:
                # Payment confirmed → quantity was deducted → restore it
                inv.quantity += item.quantity
                db.add(InventoryHistory(
                    variant_id=item.variant_id,
                    type="adjustment",
                    quantity_change=item.quantity,
                    quantity_before=inv.quantity - item.quantity,
                    quantity_after=inv.quantity,
                    reason=f"Order {order.order_number} cancelled (restocked)",
                    reference_id=order.order_number,
                ))
            elif not sale_history:
                # Payment not confirmed → only reservation was held → release it
                inv.reserved = max(0, inv.reserved - item.quantity)

    if order.payment_gateway != "cod" and order.payment_status in {"paid", "partially_paid"}:
        gateway_refund_id = None
        if order.razorpay_payment_id:
            try:
                gateway_refund_id = PaymentService().create_refund(
                    payment_id=order.razorpay_payment_id,
                    amount_paise=int(float(order.total) * 100),
                    notes={"order_number": order.order_number, "reason": payload.reason or "Admin cancellation"},
                ).get("id")
            except Exception:
                gateway_refund_id = None
        order.status = "refunded" if gateway_refund_id else "refund_pending"
        if gateway_refund_id:
            order.payment_status = "refunded"
        db.add(Refund(
            order_id=order.id, admin_id=admin.id, amount=order.total, reason=payload.reason,
            type="full", gateway_refund_id=gateway_refund_id,
            status="processed" if gateway_refund_id else "pending",
        ))
        db.add(OrderStatusHistory(
            order_id=order.id, status=order.status, admin_id=admin.id,
            description="Refund completed" if gateway_refund_id else "Refund processing after admin cancellation",
        ))

    db.commit()
    try:
        send_cancellation_notification.delay(order.id)
    except Exception:
        pass
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
    order.status = "refunded" if gateway_refund_id else "refund_pending"
    order.payment_status = "refunded" if gateway_refund_id else order.payment_status
    db.add(OrderStatusHistory(
        order_id=order.id,
        status=order.status,
        description="Refund completed" if gateway_refund_id else "Refund processing",
        admin_id=admin.id,
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
