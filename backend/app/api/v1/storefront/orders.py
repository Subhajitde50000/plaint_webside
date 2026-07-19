import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.order import Order, OrderStatusHistory, Return
from app.models.user import User
from app.schemas.order import (
    CreateOrderRequest, VerifyPaymentRequest, CancelOrderRequest, ReturnRequest
)
from app.services.order_service import OrderService
from app.services.payment_service import PaymentService
from app.tasks.order_tasks import post_payment_tasks, release_inventory_on_cancel
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
    print(payload)
    try:
        svc = OrderService(db)
        order = svc.create_order(user, payload)
        print('..................1.............')
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    payment_svc = PaymentService()
    try:
        rp_order = payment_svc.create_razorpay_order(
            amount_paise=int(float(order.total) * 100),
            receipt=order.order_number,
        )
        order.razorpay_order_id = rp_order["id"]
        order.payment_gateway = "razorpay"
        db.commit()
    except Exception:
        # Return order without payment if Razorpay not configured (dev mode)
        rp_order = {"id": None, "key": None}
    print('..................1.............')

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
    order.status = "payment_confirmed"
    order.razorpay_payment_id = payload.razorpay_payment_id
    order.razorpay_signature = payload.razorpay_signature
    db.add(OrderStatusHistory(
        order_id=order.id,
        status="payment_confirmed",
        description="Payment verified by customer",
    ))
    db.commit()

    # Trigger background tasks
    post_payment_tasks.delay(order.id)

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
            "items_count": len(o.items),
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
    if order.status not in ("order_placed", "payment_confirmed"):
        raise HTTPException(status_code=400, detail="Order cannot be cancelled at this stage.")

    order.status = "cancelled"
    order.cancelled_at = datetime.now(timezone.utc)
    order.cancel_reason = payload.reason
    order.cancelled_by = "customer"
    db.add(OrderStatusHistory(
        order_id=order.id,
        status="cancelled",
        description=f"Cancelled by customer: {payload.reason}",
    ))
    db.commit()
    release_inventory_on_cancel.delay(order.id)
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
    db.commit()
    return {"message": "Return request submitted successfully."}
