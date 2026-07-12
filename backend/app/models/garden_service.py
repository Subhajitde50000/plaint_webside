from sqlalchemy import (
    Column, BigInteger, Integer, SmallInteger, String, Boolean,
    DateTime, Date, Enum, Text, Time, DECIMAL, ForeignKey, Index
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class GardenServiceType(Base):
    __tablename__ = "garden_service_types"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(150), nullable=False)
    slug = Column(String(180), unique=True, nullable=False)
    description = Column(Text)
    duration_hours = Column(DECIMAL(4, 1))
    base_price = Column(DECIMAL(10, 2), nullable=False)
    image_url = Column(String(500))
    is_active = Column(Boolean, default=True)
    sort_order = Column(SmallInteger, default=1)

    bookings = relationship("GardenBooking", back_populates="service_type")


class GardenBooking(Base):
    __tablename__ = "garden_bookings"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    uuid = Column(String(36), unique=True, nullable=False)
    booking_number = Column(String(50), unique=True, nullable=False)
    user_id = Column(BigInteger, ForeignKey("users.id", ondelete="SET NULL"))
    guest_name = Column(String(200))
    guest_email = Column(String(254))
    guest_phone = Column(String(15), nullable=False)
    service_type_id = Column(Integer, ForeignKey("garden_service_types.id"), nullable=False)
    address_id = Column(BigInteger, ForeignKey("addresses.id", ondelete="SET NULL"))
    scheduled_date = Column(Date, nullable=False)
    scheduled_time_from = Column(Time, nullable=False)
    scheduled_time_to = Column(Time)
    city = Column(String(100), nullable=False)
    state = Column(String(100))
    pincode = Column(String(6), nullable=False)
    address_full = Column(Text, nullable=False)    # snapshot
    customer_notes = Column(Text)
    amount = Column(DECIMAL(10, 2), nullable=False)
    payment_status = Column(Enum("pending", "paid", "refunded"), default="pending")
    payment_gateway = Column(String(50))
    transaction_id = Column(String(100))
    status = Column(
        Enum("pending", "confirmed", "assigned", "in_progress", "completed", "cancelled"),
        default="pending",
    )
    assigned_gardener_id = Column(Integer, ForeignKey("gardeners.id", ondelete="SET NULL"))
    admin_notes = Column(Text)
    cancelled_at = Column(DateTime)
    cancel_reason = Column(String(500))
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="garden_bookings")
    service_type = relationship("GardenServiceType", back_populates="bookings")
    address = relationship("Address", back_populates="garden_bookings")
    gardener = relationship("Gardener", back_populates="bookings")

    __table_args__ = (
        Index("idx_user_id", "user_id"),
        Index("idx_status", "status"),
        Index("idx_scheduled_date", "scheduled_date"),
        Index("idx_booking_number", "booking_number"),
    )


class Gardener(Base):
    __tablename__ = "gardeners"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(200), nullable=False)
    phone = Column(String(15), nullable=False)
    email = Column(String(254))
    city = Column(String(100), nullable=False)
    state = Column(String(100))
    specialisations = Column(String(500))     # comma-separated service type IDs
    rating_average = Column(DECIMAL(3, 2), default=0.00)
    rating_count = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    joined_at = Column(Date)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    bookings = relationship("GardenBooking", back_populates="gardener")
