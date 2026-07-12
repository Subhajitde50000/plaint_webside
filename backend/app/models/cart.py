from sqlalchemy import (
    Column, BigInteger, SmallInteger, String, DateTime, DECIMAL, ForeignKey, Index
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Cart(Base):
    __tablename__ = "carts"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    uuid = Column(String(36), unique=True, nullable=False)
    user_id = Column(BigInteger, ForeignKey("users.id", ondelete="SET NULL"))
    session_token = Column(String(64))   # for guest cart identification
    expires_at = Column(DateTime)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="carts")
    items = relationship("CartItem", back_populates="cart", cascade="all, delete-orphan")

    __table_args__ = (
        Index("idx_user_id", "user_id"),
        Index("idx_session_token", "session_token"),
    )


class CartItem(Base):
    __tablename__ = "cart_items"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    cart_id = Column(BigInteger, ForeignKey("carts.id", ondelete="CASCADE"), nullable=False)
    variant_id = Column(BigInteger, ForeignKey("product_variants.id"), nullable=False)
    quantity = Column(SmallInteger, default=1, nullable=False)
    price_at_add = Column(DECIMAL(10, 2), nullable=False)   # snapshot
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    cart = relationship("Cart", back_populates="items")
    variant = relationship("ProductVariant", back_populates="cart_items")
