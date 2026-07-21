from pydantic import BaseModel
from typing import Optional, List
from decimal import Decimal
from datetime import datetime


class OrderItemSchema(BaseModel):
    id: int
    variant_id: int
    product_id: int
    title: str
    variant_title: Optional[str] = None
    sku: str
    quantity: int
    unit_price: Decimal
    compare_at_price: Optional[Decimal] = None
    discount_amount: Decimal = Decimal("0.00")
    total_price: Decimal
    tax_amount: Decimal = Decimal("0.00")
    image_url: Optional[str] = None

    model_config = {"from_attributes": True}


class OrderStatusHistorySchema(BaseModel):
    status: str
    location: Optional[str] = None
    description: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class OrderResponse(BaseModel):
    id: int
    uuid: str
    order_number: str
    subtotal: Decimal
    discount_amount: Decimal
    shipping_amount: Decimal
    tax_amount: Decimal
    total: Decimal
    currency: str
    discount_code: Optional[str] = None
    loyalty_points_used: int = 0
    loyalty_discount_amount: Decimal = Decimal("0.00")
    status: str
    payment_status: str
    fulfillment_status: str
    payment_gateway: Optional[str] = None
    tracking_number: Optional[str] = None
    tracking_url: Optional[str] = None
    shipping_carrier: Optional[str] = None
    estimated_delivery: Optional[str] = None
    delivered_at: Optional[datetime] = None
    is_gift: bool = False
    gift_message: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime
    items: List[OrderItemSchema] = []
    status_history: List[OrderStatusHistorySchema] = []

    model_config = {"from_attributes": True}


class CreateOrderRequest(BaseModel):
    address_id: int
    discount_code: Optional[str] = None
    loyalty_points_to_use: Optional[int] = None
    gift_message: Optional[str] = None
    notes: Optional[str] = None
    buy_now_variant_id: Optional[int] = None
    buy_now_quantity: Optional[int] = None


class VerifyPaymentRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


class UpdateFulfillmentRequest(BaseModel):
    carrier: str
    tracking_number: str
    tracking_url: Optional[str] = None
    notify_customer: bool = True


class AdminOrderNoteRequest(BaseModel):
    note: str
    is_internal: bool = True


class AdminOrderListResponse(BaseModel):
    items: List[OrderResponse]
    total: int
    page: int
    page_size: int


class AdminOrderDetailResponse(OrderResponse):
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    risk_score: int = 0
    razorpay_order_id: Optional[str] = None
    razorpay_payment_id: Optional[str] = None
    shiprocket_order_id: Optional[str] = None
    awb_code: Optional[str] = None

    model_config = {"from_attributes": True}


class CancelOrderRequest(BaseModel):
    reason: Optional[str] = None


class ReturnRequest(BaseModel):
    reason: str
    return_type: str = "refund"
    customer_note: Optional[str] = None


class RefundRequest(BaseModel):
    amount: Decimal
    reason: Optional[str] = None
    type: str = "partial"
