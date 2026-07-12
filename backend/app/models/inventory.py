from sqlalchemy import (
    Column, BigInteger, Integer, String, Boolean, DateTime, Enum, Index, ForeignKey, Text
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Inventory(Base):
    __tablename__ = "inventory"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    variant_id = Column(BigInteger, ForeignKey("product_variants.id", ondelete="CASCADE"), unique=True, nullable=False)
    warehouse_id = Column(Integer, nullable=False)
    quantity = Column(Integer, default=0)
    reserved = Column(Integer, default=0)    # held for pending orders
    reorder_level = Column(Integer, default=10)
    low_stock_alert = Column(Boolean, default=True)
    stock_policy = Column(Enum("deny", "backorder", "continue"), default="deny")
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    variant = relationship("ProductVariant", back_populates="inventory")

    __table_args__ = (
        Index("idx_variant_id", "variant_id"),
    )


class Warehouse(Base):
    __tablename__ = "warehouses"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    city = Column(String(100))
    state = Column(String(100))
    pincode = Column(String(6))
    is_active = Column(Boolean, default=True)


class InventoryHistory(Base):
    __tablename__ = "inventory_history"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    variant_id = Column(BigInteger, ForeignKey("product_variants.id"), nullable=False)
    admin_id = Column(BigInteger, ForeignKey("admin_users.id", ondelete="SET NULL"))
    type = Column(Enum("sale", "return", "adjustment", "purchase", "damage"), nullable=False)
    quantity_change = Column(Integer, nullable=False)  # +/- signed
    quantity_before = Column(Integer, nullable=False)
    quantity_after = Column(Integer, nullable=False)
    reason = Column(String(500))
    reference_id = Column(String(100))  # order ID, PO number, etc.
    created_at = Column(DateTime, server_default=func.now())

    variant = relationship("ProductVariant", back_populates="inventory_history")

    __table_args__ = (
        Index("idx_variant_id", "variant_id"),
        Index("idx_created_at", "created_at"),
    )
