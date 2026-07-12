from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import Optional, List

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.models.order import Order, OrderItem, OrderStatusHistory
from app.models.inventory import Inventory
from app.schemas.order import CreateOrderRequest, OrderResponse
from app.services.order_service import OrderService
from app.services.payment_service import PaymentService

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.post("/", response_model=dict)
async def create_order(
    payload: CreateOrderRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    service = OrderService(db)
    order = service.create_order(user=user, payload=payload)

    # Create Razorpay order
    pay_service = PaymentService()
    razorpay_order = pay_service.create_razorpay_order(
        amount_paise=int(order.total * 100),
        receipt=order.order_number,
    )

    order.razorpay_order_id = razorpay_order["id"]
    db.commit()

    return {
        "order_id": str(order.uuid),
        "order_number": order.order_number,
        "total": str(order.total),
        "razorpay_order_id": razorpay_order["id"],
        "razorpay_key_id": settings.RAZORPAY_KEY_ID,
    }


@router.post("/{order_uuid}/verify-payment")
async def verify_payment(
    order_uuid: str,
    payload: dict,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    order = db.query(Order).filter(
        Order.uuid == order_uuid,
        Order.user_id == user.id
    ).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")

    # Verify Razorpay signature
    pay_service = PaymentService()
    if not pay_service.verify_signature(
        order_id=payload["razorpay_order_id"],
        payment_id=payload["razorpay_payment_id"],
        signature=payload["razorpay_signature"],
    ):
        raise HTTPException(status_code=400, detail="Payment verification failed.")

    order.payment_status = "paid"
    order.status = "payment_confirmed"
    order.razorpay_payment_id = payload["razorpay_payment_id"]
    order.razorpay_signature = payload["razorpay_signature"]

    # Log status change
    db.add(OrderStatusHistory(
        order_id=order.id,
        status="payment_confirmed",
        description="Payment confirmed via Razorpay"
    ))

    db.commit()

    # Async: deduct inventory, award loyalty points, send confirmation email
    from app.tasks.order_tasks import post_payment_tasks
    background_tasks.add_task(post_payment_tasks.delay, str(order.id))

    return {"message": "Payment confirmed.", "order_number": order.order_number}


@router.get("/", response_model=List[OrderResponse])
async def list_my_orders(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
    status: Optional[str] = None,
    page: int = 1,
    page_size: int = 20,
):
    query = db.query(Order).filter(Order.user_id == user.id)
    if status:
        query = query.filter(Order.status == status)
    query = query.order_by(Order.created_at.desc())
    total = query.count()
    orders = query.offset((page - 1) * page_size).limit(page_size).all()
    return orders


@router.get("/{order_uuid}", response_model=OrderResponse)
async def get_order(
    order_uuid: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    order = db.query(Order).filter(
        Order.uuid == order_uuid,
        Order.user_id == user.id
    ).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")
    return order