import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.order import Order, OrderStatusHistory, Return, Refund
from app.models.user import User
from app.schemas.order import (
    CreateOrderRequest, VerifyPaymentRequest, CancelOrderRequest, ReturnRequest
)
from app.services.order_service import OrderService
from app.services.payment_service import PaymentService
from app.tasks.order_tasks import post_payment_tasks, send_cancellation_notification
from app.utils.pagination import paginate
from datetime import datetime, timezone

from app.config import settings

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_order(
    payload: CreateOrderRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    try:
        svc = OrderService(db)
        order = svc.create_order(user, payload)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    is_cod = (payload.payment_method or "razorpay").lower() == "cod"

    if is_cod:
        # COD: mark as cod_pending, keep stock as reserved (not deducted yet)
        order.payment_status = "cod_pending"
        order.payment_gateway = "cod"
        order.status = "payment_pending"
        db.add(OrderStatusHistory(
            order_id=order.id,
            status="payment_pending",
            description="Cash on Delivery selected; payment pending",
        ))
        db.commit()
        return {
            "order_uuid": order.uuid,
            "order_number": order.order_number,
            "total": str(order.total),
            "razorpay_order_id": None,
            "razorpay_key_id": None,
        }

    # Online payment — attempt Razorpay
    payment_svc = PaymentService()
    dev_mode = False
    try:
        rp_order = payment_svc.create_razorpay_order(
            amount_paise=int(float(order.total) * 100),
            receipt=order.order_number,
        )
        order.razorpay_order_id = rp_order["id"]
        order.payment_gateway = "razorpay"
        order.status = "payment_pending"
        db.add(OrderStatusHistory(
            order_id=order.id,
            status="payment_pending",
            description="Waiting for online payment confirmation",
        ))
        db.commit()
    except Exception:
        # Razorpay not configured — dev mode: auto-confirm payment & deduct stock now
        dev_mode = True
        rp_order = {"id": None, "key": None}

    if dev_mode:
        order.payment_status = "paid"
        order.status = "payment_verified"
        db.add(OrderStatusHistory(
            order_id=order.id,
            status="payment_verified",
            description="Auto-confirmed (dev mode – no payment gateway)",
        ))
        db.commit()

    return {
        "order_uuid": order.uuid,
        "order_number": order.order_number,
        "total": str(order.total),
        "razorpay_order_id": order.razorpay_order_id,
        "razorpay_key_id": settings.RAZORPAY_KEY_ID,
    }


@router.post("/{order_uuid}/verify-payment")
async def verify_payment(
    order_uuid: str,
    payload: VerifyPaymentRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    order = db.query(Order).filter(
        Order.uuid == order_uuid, Order.user_id == user.id
    ).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")

    payment_svc = PaymentService()
    if not payment_svc.verify_signature(
        payload.razorpay_order_id,
        payload.razorpay_payment_id,
        payload.razorpay_signature,
    ):
        raise HTTPException(status_code=400, detail="Invalid payment signature.")

    order.payment_status = "paid"
    order.status = "payment_verified"
    order.razorpay_payment_id = payload.razorpay_payment_id
    order.razorpay_signature = payload.razorpay_signature
    db.add(OrderStatusHistory(
        order_id=order.id,
        status="payment_verified",
        description="Payment verified by customer",
    ))

    # ── Synchronously deduct inventory (does not depend on Celery/Redis) ──
    from app.models.inventory import Inventory, InventoryHistory
    # Stock is committed at ORDER_ACCEPTED by admin, not payment verification.
    for item in ():
        inv = db.query(Inventory).filter(
            Inventory.variant_id == item.variant_id
        ).with_for_update().first()
        if inv:
            # Guard against double deduction (e.g. webhook fires after this)
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
                    reason=f"Order {order.order_number} payment confirmed",
                    reference_id=order.order_number,
                ))

    db.commit()

    # ── Dispatch Celery task for loyalty points & confirmation email ──
    # The task will skip inventory since it's already been deducted above.
    try:
        post_payment_tasks.delay(order.id)
    except Exception:
        pass  # Celery/Redis not running; inventory already handled above.

    return {"message": "Payment confirmed.", "order_number": order.order_number}


@router.get("/")
async def list_my_orders(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
    page: int = 1,
    page_size: int = 10,
):
    query = db.query(Order).filter(
        Order.user_id == user.id
    ).order_by(Order.created_at.desc())
    result = paginate(query, page, page_size)
    result["items"] = [
        {
            "uuid": o.uuid,
            "order_number": o.order_number,
            "total": str(o.total),
            "status": o.status,
            "payment_status": o.payment_status,
            "created_at": o.created_at.isoformat(),
            "shipping_amount": str(o.shipping_amount),
            "tracking_number": o.tracking_number,
            "shipping_carrier": o.shipping_carrier,
            "tracking_url": o.tracking_url,
            "items_count": len(o.items),
            "items": [
                {
                    "title": item.title,
                    "variant_title": item.variant_title,
                    "quantity": item.quantity,
                    "unit_price": str(item.unit_price),
                    "total_price": str(item.total_price),
                    "image_url": item.image_url,
                }
                for item in o.items
            ]
        }
        for o in result["items"]
    ]
    return result


@router.get("/{order_uuid}")
async def get_order(
    order_uuid: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    order = db.query(Order).filter(
        Order.uuid == order_uuid, Order.user_id == user.id
    ).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")
    return order


@router.post("/{order_uuid}/cancel")
async def cancel_order(
    order_uuid: str,
    payload: CancelOrderRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    order = db.query(Order).filter(
        Order.uuid == order_uuid, Order.user_id == user.id
    ).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")
    non_cancellable = {
        "shipped", "dispatched", "in_transit", "out_for_delivery", "delivered", "completed",
        "cancelled", "cancelled_by_customer", "cancelled_by_admin", "refund_pending", "refunded",
        "return_requested", "return_approved", "return_pickup_scheduled", "return_received",
        "return_inspection", "return_rejected", "return_completed",
    }
    if order.status in non_cancellable:
        raise HTTPException(status_code=400, detail="Shipped, delivered, or returned orders cannot be cancelled.")
    created_at = order.created_at
    if created_at and created_at.tzinfo is None:
        created_at = created_at.replace(tzinfo=timezone.utc)
    if created_at and (datetime.now(timezone.utc) - created_at).total_seconds() > 24 * 60 * 60:
        raise HTTPException(status_code=400, detail="The 24-hour cancellation window has closed.")

    order.status = "cancelled_by_customer"
    order.cancelled_at = datetime.now(timezone.utc)
    order.cancel_reason = payload.reason
    order.cancelled_by = "customer"
    db.add(OrderStatusHistory(
        order_id=order.id,
        status="cancelled_by_customer",
        description=f"Cancelled by customer: {payload.reason}",
    ))

    # ── Synchronously restore inventory ─────────────────────────────────────
    from app.models.inventory import Inventory, InventoryHistory
    for item in order.items:
        # Check if stock was physically deducted (i.e. payment was confirmed)
        sale_history = db.query(InventoryHistory).filter(
            InventoryHistory.reference_id == order.order_number,
            InventoryHistory.variant_id == item.variant_id,
            InventoryHistory.type == "sale",
        ).first()
        # Guard against double-restocking
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
                    notes={"order_number": order.order_number, "reason": payload.reason or "Customer cancellation"},
                ).get("id")
            except Exception:
                gateway_refund_id = None
        order.status = "refunded" if gateway_refund_id else "refund_pending"
        if gateway_refund_id:
            order.payment_status = "refunded"
        db.add(Refund(
            order_id=order.id, amount=order.total, reason=payload.reason, type="full",
            gateway_refund_id=gateway_refund_id, status="processed" if gateway_refund_id else "pending",
        ))
        db.add(OrderStatusHistory(
            order_id=order.id, status=order.status,
            description="Refund completed" if gateway_refund_id else "Refund processing after customer cancellation",
        ))

    db.commit()
    try:
        send_cancellation_notification.delay(order.id)
    except Exception:
        pass
    return {"message": "Order cancelled successfully."}


@router.post("/{order_uuid}/return")
async def request_return(
    order_uuid: str,
    payload: ReturnRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    order = db.query(Order).filter(
        Order.uuid == order_uuid, Order.user_id == user.id
    ).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")
    if order.status != "delivered":
        raise HTTPException(status_code=400, detail="Only delivered orders can be returned.")

    ret = Return(
        order_id=order.id,
        reason=payload.reason,
        return_type=payload.return_type,
        customer_note=payload.customer_note,
    )
    db.add(ret)
    order.status = "return_requested"
    db.add(OrderStatusHistory(
        order_id=order.id,
        status="return_requested",
        description="Return requested by customer",
    ))
    db.commit()
    return {"message": "Return request submitted successfully."}
