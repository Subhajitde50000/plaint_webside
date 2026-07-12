from sqlalchemy import (
    Column, BigInteger, Integer, SmallInteger, String, Boolean,
    DateTime, Enum, DECIMAL, ForeignKey, Index
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Discount(Base):
    __tablename__ = "discounts"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    uuid = Column(String(36), unique=True, nullable=False)
    code = Column(String(255))          # NULL for automatic
    title = Column(String(255), nullable=False)
    method = Column(Enum("code", "automatic"), nullable=False)
    discount_type = Column(
        Enum("percentage", "fixed_amount", "free_shipping", "bogo"), nullable=False
    )
    value = Column(DECIMAL(10, 2))
    max_discount_amount = Column(DECIMAL(10, 2))

    # Scope
    applies_to = Column(
        Enum("all", "specific_collections", "specific_products", "specific_customers"),
        default="all",
    )
    exclude_sale_items = Column(Boolean, default=False)

    # Customer eligibility
    customer_eligibility = Column(
        Enum("all", "specific_customers", "specific_segments", "loyalty_tier", "first_time"),
        default="all",
    )
    min_loyalty_tier = Column(Enum("plant_lover", "silver", "gold"))
    first_time_only = Column(Boolean, default=False)

    # Minimum requirements
    min_requirement_type = Column(Enum("none", "amount", "quantity"), default="none")
    min_requirement_value = Column(DECIMAL(10, 2))

    # Usage limits
    usage_limit_total = Column(Integer)
    usage_limit_per_customer = Column(SmallInteger, default=1)
    usage_count = Column(Integer, default=0)

    # Combinations
    combine_with_product = Column(Boolean, default=False)
    combine_with_order = Column(Boolean, default=False)
    combine_with_shipping = Column(Boolean, default=False)

    # Dates
    starts_at = Column(DateTime, nullable=False)
    ends_at = Column(DateTime)

    status = Column(
        Enum("draft", "scheduled", "active", "paused", "expired"), default="draft"
    )

    created_by = Column(BigInteger, ForeignKey("admin_users.id", ondelete="SET NULL"))
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    products = relationship("DiscountProduct", back_populates="discount", cascade="all, delete-orphan")
    collections = relationship("DiscountCollection", back_populates="discount", cascade="all, delete-orphan")
    usage_logs = relationship("DiscountUsage", back_populates="discount")
    bogo_config = relationship("BogoConfig", back_populates="discount", uselist=False, cascade="all, delete-orphan")
    orders = relationship("Order", back_populates="discount")

    __table_args__ = (
        Index("idx_code", "code"),
        Index("idx_status", "status"),
        Index("idx_starts_at", "starts_at"),
        Index("idx_ends_at", "ends_at"),
    )


class DiscountProduct(Base):
    __tablename__ = "discount_products"

    discount_id = Column(BigInteger, ForeignKey("discounts.id", ondelete="CASCADE"), primary_key=True)
    product_id = Column(BigInteger, ForeignKey("products.id", ondelete="CASCADE"), primary_key=True)
    is_excluded = Column(Boolean, default=False)

    discount = relationship("Discount", back_populates="products")
    product = relationship("Product", back_populates="discount_products")


class DiscountCollection(Base):
    __tablename__ = "discount_collections"

    discount_id = Column(BigInteger, ForeignKey("discounts.id", ondelete="CASCADE"), primary_key=True)
    collection_id = Column(Integer, ForeignKey("collections.id", ondelete="CASCADE"), primary_key=True)

    discount = relationship("Discount", back_populates="collections")


class DiscountUsage(Base):
    __tablename__ = "discount_usage"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    discount_id = Column(BigInteger, ForeignKey("discounts.id"), nullable=False)
    order_id = Column(BigInteger, ForeignKey("orders.id"), nullable=False)
    user_id = Column(BigInteger, ForeignKey("users.id", ondelete="SET NULL"))
    discount_amount = Column(DECIMAL(10, 2), nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    discount = relationship("Discount", back_populates="usage_logs")
    order = relationship("Order", back_populates="discount_usage")

    __table_args__ = (
        Index("idx_discount_id", "discount_id"),
        Index("idx_user_id", "user_id"),
    )


class BogoConfig(Base):
    __tablename__ = "bogo_configs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    discount_id = Column(BigInteger, ForeignKey("discounts.id", ondelete="CASCADE"), unique=True, nullable=False)
    buy_quantity = Column(SmallInteger, nullable=False)
    buy_scope = Column(Enum("any", "specific_product", "specific_collection"), nullable=False)
    buy_product_id = Column(BigInteger, ForeignKey("products.id", ondelete="SET NULL"))
    buy_collection_id = Column(Integer, ForeignKey("collections.id", ondelete="SET NULL"))
    get_quantity = Column(SmallInteger, nullable=False)
    get_scope = Column(Enum("specific_product", "specific_collection"), nullable=False)
    get_product_id = Column(BigInteger, ForeignKey("products.id", ondelete="SET NULL"))
    get_collection_id = Column(Integer, ForeignKey("collections.id", ondelete="SET NULL"))
    get_discount_type = Column(Enum("percentage", "fixed_price", "free"), nullable=False)
    get_discount_value = Column(DECIMAL(10, 2))
    limit_once_per_order = Column(Boolean, default=True)

    discount = relationship("Discount", back_populates="bogo_config")
