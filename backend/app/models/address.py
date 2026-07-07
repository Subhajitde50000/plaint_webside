from sqlalchemy import Column, BigInteger, String, Boolean, DateTime, Enum, Index, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Address(Base):
    __tablename__ = "addresses"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id = Column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    type = Column(Enum("home", "work", "other"), default="home")
    label = Column(String(50))
    recipient_name = Column(String(200), nullable=False)
    phone = Column(String(15), nullable=False)
    line1 = Column(String(255), nullable=False)
    line2 = Column(String(255))
    city = Column(String(100), nullable=False)
    state = Column(String(100), nullable=False)
    pincode = Column(String(6), nullable=False)
    country = Column(String(100), default="India")
    is_default = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="addresses")
    orders = relationship("Order", back_populates="shipping_address")
    garden_bookings = relationship("GardenBooking", back_populates="address")

    __table_args__ = (
        Index("idx_user_id", "user_id"),
        Index("idx_pincode", "pincode"),
    )
