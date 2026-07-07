from sqlalchemy import (
    Column, BigInteger, SmallInteger, String, Boolean,
    DateTime, Date, DECIMAL, ForeignKey, Index, JSON, Integer
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class AnalyticsDaily(Base):
    __tablename__ = "analytics_daily"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    date = Column(Date, nullable=False)
    metric = Column(String(100), nullable=False)   # "revenue","orders","new_customers"
    value = Column(DECIMAL(15, 4), nullable=False)
    dimension = Column(String(100))               # optional: "category:indoor_plants"
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    __table_args__ = (
        Index("idx_date", "date"),
        Index("idx_metric", "metric"),
        Index("idx_date_metric", "date", "metric"),
    )


class NotificationPreference(Base):
    __tablename__ = "notification_preferences"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id = Column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    order_updates_email = Column(Boolean, default=True)
    order_updates_push = Column(Boolean, default=True)
    order_updates_sms = Column(Boolean, default=False)
    watering_email = Column(Boolean, default=False)
    watering_push = Column(Boolean, default=True)
    watering_sms = Column(Boolean, default=False)
    price_drops_email = Column(Boolean, default=True)
    price_drops_push = Column(Boolean, default=False)
    offers_email = Column(Boolean, default=True)
    offers_push = Column(Boolean, default=False)
    loyalty_email = Column(Boolean, default=True)
    loyalty_push = Column(Boolean, default=True)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="notification_preferences")


class ActivityLog(Base):
    __tablename__ = "activity_log"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    admin_id = Column(BigInteger, ForeignKey("admin_users.id", ondelete="SET NULL"))
    action = Column(String(100), nullable=False)   # "product.updated", "order.cancelled"
    entity_type = Column(String(50), nullable=False)
    entity_id = Column(BigInteger, nullable=False)
    entity_label = Column(String(255))
    changes = Column(JSON)                          # before/after diff
    ip_address = Column(String(45))
    user_agent = Column(String(500))
    created_at = Column(DateTime, server_default=func.now())

    __table_args__ = (
        Index("idx_admin_id", "admin_id"),
        Index("idx_entity", "entity_type", "entity_id"),
        Index("idx_created_at", "created_at"),
    )


class PaymentMethod(Base):
    __tablename__ = "payment_methods"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id = Column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    gateway = Column(String(50), nullable=False)      # "razorpay"
    gateway_customer_id = Column(String(100))
    gateway_token = Column(String(255))               # encrypted
    card_network = Column(String(50))
    card_last4 = Column(String(4))
    card_expiry_month = Column(SmallInteger)
    card_expiry_year = Column(SmallInteger)
    is_default = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())

    user = relationship("User", back_populates="payment_methods")

    __table_args__ = (
        Index("idx_user_id", "user_id"),
    )
