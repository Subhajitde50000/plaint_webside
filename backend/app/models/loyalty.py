from sqlalchemy import (
    Column, BigInteger, Integer, String, Boolean, DateTime, Enum, ForeignKey, Index
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class LoyaltyAccount(Base):
    __tablename__ = "loyalty_accounts"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id = Column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    points_balance = Column(Integer, default=0)
    tier = Column(Enum("plant_lover", "silver", "gold"), default="plant_lover")
    tier_updated_at = Column(DateTime)
    lifetime_points = Column(Integer, default=0)  # never decremented
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="loyalty_account")


class LoyaltyTransaction(Base):
    __tablename__ = "loyalty_transactions"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id = Column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    type = Column(
        Enum("earned", "redeemed", "adjusted", "expired", "reversed"), nullable=False
    )
    points = Column(Integer, nullable=False)   # positive or negative
    balance_after = Column(Integer, nullable=False)
    description = Column(String(255))
    order_id = Column(BigInteger, ForeignKey("orders.id", ondelete="SET NULL"))
    adjusted_by = Column(BigInteger, ForeignKey("admin_users.id", ondelete="SET NULL"))
    created_at = Column(DateTime, server_default=func.now())

    user = relationship("User", back_populates="loyalty_transactions")
    order = relationship("Order", back_populates="loyalty_transactions")

    __table_args__ = (
        Index("idx_user_id", "user_id"),
        Index("idx_created_at", "created_at"),
    )


class Wishlist(Base):
    __tablename__ = "wishlists"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id = Column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    user = relationship("User", back_populates="wishlist")
    items = relationship("WishlistItem", back_populates="wishlist", cascade="all, delete-orphan")


class WishlistItem(Base):
    __tablename__ = "wishlist_items"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    wishlist_id = Column(BigInteger, ForeignKey("wishlists.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(BigInteger, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    variant_id = Column(BigInteger, ForeignKey("product_variants.id", ondelete="SET NULL"))
    added_at = Column(DateTime, server_default=func.now())

    wishlist = relationship("Wishlist", back_populates="items")
    product = relationship("Product", back_populates="wishlist_items")
    variant = relationship("ProductVariant", back_populates="wishlist_items")
