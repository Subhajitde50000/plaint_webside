import uuid
from sqlalchemy import (
    Column, BigInteger, SmallInteger, String, Boolean, DateTime, Date,
    Enum, Text, DECIMAL, ForeignKey, Index, Integer
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Order(Base):
    __tablename__ = "orders"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    uuid = Column(String(36), unique=True, nullable=False, default=lambda: str(uuid.uuid4()))
    order_number = Column(String(50), unique=True, nullable=False)
    user_id = Column(BigInteger, ForeignKey("users.id", ondelete="SET NULL"))
    guest_email = Column(String(254))
    guest_phone = Column(String(15))

    # Amounts
    subtotal = Column(DECIMAL(10, 2), nullable=False)
    discount_amount = Column(DECIMAL(10, 2), default=0.00)
    shipping_amount = Column(DECIMAL(10, 2), default=0.00)
    tax_amount = Column(DECIMAL(10, 2), default=0.00)
    total = Column(DECIMAL(10, 2), nullable=False)
    currency = Column(String(3), default="INR")

    # Discount
    discount_code = Column(String(100))
    discount_id = Column(BigInteger, ForeignKey("discounts.id", ondelete="SET NULL"))
    loyalty_points_used = Column(Integer, default=0)
    loyalty_discount_amount = Column(DECIMAL(10, 2), default=0.00)

    # Status
    status = Column(
        Enum(
            # Canonical operational workflow.  Legacy values are retained so
            # existing orders can still be read while they are migrated.
            "new_order", "payment_pending", "payment_failed", "payment_verified", "payment_confirmed",
            "cod_eligibility_verified", "cod_amount_collected",
            "order_accepted", "order_confirmed", "inventory_reserved", "picking", "quality_check",
            "packed", "ready_for_dispatch", "courier_assigned", "picked_up",
            "shipped", "in_transit", "out_for_delivery", "delivered", "completed",
            "cancelled_by_customer", "cancelled_by_admin",
            "refund_pending", "refunded",
            "return_requested", "return_approved", "return_pickup_scheduled",
            "return_received", "return_inspection", "return_rejected", "return_completed",
            "order_placed", "processing", "dispatched", "delivery_attempted",
            "cancelled", "return_in_transit", "refund_initiated",
        ),
        nullable=False,
        default="new_order",
    )
    payment_status = Column(
        Enum(
            "pending", "authorized", "paid", "partially_paid",
            "refunded", "partially_refunded", "voided", "failed", "cod_pending",
        ),
        default="pending",
    )
    fulfillment_status = Column(
        Enum("unfulfilled", "partially_fulfilled", "fulfilled", "returned"),
        default="unfulfilled",
    )

    # Payment
    payment_gateway = Column(String(50))
    razorpay_order_id = Column(String(100))
    razorpay_payment_id = Column(String(100))
    razorpay_signature = Column(String(255))
    transaction_id = Column(String(100))

    # Shipping
    shipping_address_id = Column(BigInteger, ForeignKey("addresses.id", ondelete="SET NULL"))
    shipping_carrier = Column(String(100))
    tracking_number = Column(String(100))
    tracking_url = Column(String(500))
    shiprocket_order_id = Column(String(100))
    awb_code = Column(String(100))
    estimated_delivery = Column(Date)
    delivered_at = Column(DateTime)

    # Meta
    source = Column(Enum("web", "mobile", "admin"), default="web")
    notes = Column(Text)
    gift_message = Column(Text)
    is_gift = Column(Boolean, default=False)
    risk_score = Column(SmallInteger, default=0)
    ip_address = Column(String(45))
    user_agent = Column(String(500))

    cancelled_at = Column(DateTime)
    cancel_reason = Column(String(500))
    cancelled_by = Column(Enum("customer", "admin", "system"))

    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="orders")
    shipping_address = relationship("Address", back_populates="orders")
    discount = relationship("Discount", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    status_history = relationship("OrderStatusHistory", back_populates="order", cascade="all, delete-orphan")
    refunds = relationship("Refund", back_populates="order")
    returns = relationship("Return", back_populates="order")
    notes_list = relationship("OrderNote", back_populates="order", cascade="all, delete-orphan")
    tags = relationship("OrderTag", back_populates="order", cascade="all, delete-orphan")
    discount_usage = relationship("DiscountUsage", back_populates="order")
    loyalty_transactions = relationship("LoyaltyTransaction", back_populates="order")

    __table_args__ = (
        Index("idx_order_number", "order_number"),
        Index("idx_user_id", "user_id"),
        Index("idx_status", "status"),
        Index("idx_payment_status", "payment_status"),
        Index("idx_created_at", "created_at"),
        Index("idx_user_created", "user_id", "created_at"),
    )


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    order_id = Column(BigInteger, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    variant_id = Column(BigInteger, ForeignKey("product_variants.id"), nullable=False)
    product_id = Column(BigInteger, nullable=False)   # denormalised for history
    title = Column(String(255), nullable=False)       # snapshot
    variant_title = Column(String(100))
    sku = Column(String(100), nullable=False)         # snapshot
    quantity = Column(SmallInteger, nullable=False)
    unit_price = Column(DECIMAL(10, 2), nullable=False)
    compare_at_price = Column(DECIMAL(10, 2))
    discount_amount = Column(DECIMAL(10, 2), default=0.00)
    total_price = Column(DECIMAL(10, 2), nullable=False)
    tax_amount = Column(DECIMAL(10, 2), default=0.00)
    image_url = Column(String(500))   # snapshot

    order = relationship("Order", back_populates="items")
    variant = relationship("ProductVariant", back_populates="order_items")
    reviews = relationship("Review", back_populates="order_item")
    return_items = relationship("ReturnItem", back_populates="order_item")

    __table_args__ = (
        Index("idx_order_id", "order_id"),
    )


class OrderStatusHistory(Base):
    __tablename__ = "order_status_history"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    order_id = Column(BigInteger, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    status = Column(String(50), nullable=False)
    location = Column(String(255))
    description = Column(String(500))
    admin_id = Column(BigInteger, ForeignKey("admin_users.id", ondelete="SET NULL"))
    created_at = Column(DateTime, server_default=func.now())

    order = relationship("Order", back_populates="status_history")

    __table_args__ = (
        Index("idx_order_id", "order_id"),
    )


class Refund(Base):
    __tablename__ = "refunds"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    order_id = Column(BigInteger, ForeignKey("orders.id"), nullable=False)
    admin_id = Column(BigInteger, ForeignKey("admin_users.id", ondelete="SET NULL"))
    amount = Column(DECIMAL(10, 2), nullable=False)
    reason = Column(String(500))
    type = Column(Enum("full", "partial", "store_credit"), default="full")
    gateway_refund_id = Column(String(100))
    status = Column(Enum("pending", "processed", "failed"), default="pending")
    processed_at = Column(DateTime)
    created_at = Column(DateTime, server_default=func.now())

    order = relationship("Order", back_populates="refunds")

    __table_args__ = (
        Index("idx_order_id", "order_id"),
    )


class Return(Base):
    __tablename__ = "returns"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    order_id = Column(BigInteger, ForeignKey("orders.id"), nullable=False)
    reason = Column(
        Enum("damaged_product", "dead_plant", "wrong_product", "missing_item", "poor_quality", "size_issue", "changed_mind", "other", "damaged_in_transit", "wrong_item", "quality_issue"),
        nullable=False,
    )
    return_type = Column(Enum("refund", "replacement", "exchange", "store_credit"), default="refund")
    status = Column(
        Enum("requested", "approved", "rejected", "pickup_scheduled", "picked_up", "received", "inspection", "refund_pending", "refunded", "replacement_created", "completed", "in_transit", "refund_issued"),
        default="requested",
    )
    customer_note = Column(Text)
    admin_note = Column(Text)
    evidence_urls = Column(Text)  # JSON array of customer-uploaded image/video URLs
    return_tracking = Column(String(100))
    processed_by = Column(BigInteger, ForeignKey("admin_users.id", ondelete="SET NULL"))
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    order = relationship("Order", back_populates="returns")
    items = relationship("ReturnItem", back_populates="return_obj", cascade="all, delete-orphan")


class ReturnItem(Base):
    __tablename__ = "return_items"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    return_id = Column(BigInteger, ForeignKey("returns.id", ondelete="CASCADE"), nullable=False)
    order_item_id = Column(BigInteger, ForeignKey("order_items.id"), nullable=False)
    quantity = Column(SmallInteger, nullable=False)
    reason = Column(String(500))

    return_obj = relationship("Return", back_populates="items")
    order_item = relationship("OrderItem", back_populates="return_items")


class OrderNote(Base):
    __tablename__ = "order_notes"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    order_id = Column(BigInteger, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    admin_id = Column(BigInteger, ForeignKey("admin_users.id"), nullable=False)
    note = Column(Text, nullable=False)
    is_internal = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    order = relationship("Order", back_populates="notes_list")
    admin = relationship("AdminUser")


class OrderTag(Base):
    __tablename__ = "order_tags"

    order_id = Column(BigInteger, ForeignKey("orders.id", ondelete="CASCADE"), primary_key=True)
    tag = Column(String(100), primary_key=True)

    order = relationship("Order", back_populates="tags")
