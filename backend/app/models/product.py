from sqlalchemy import (
    Column, BigInteger, Integer, SmallInteger, String, Boolean,
    DateTime, Enum, Text, LargeBinary, DECIMAL, ForeignKey, Index
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    uuid = Column(String(36), unique=True, nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    product_type = Column(
        Enum("plant", "pot", "seed", "soil", "tool", "accessory"), nullable=False
    )
    title = Column(String(255), nullable=False)
    slug = Column(String(280), unique=True, nullable=False)
    short_description = Column(String(160))
    description = Column(Text)         # rich HTML
    botanical_name = Column(String(200))
    common_name = Column(String(200))

    # Pricing
    base_price = Column(DECIMAL(10, 2), nullable=False)
    compare_at_price = Column(DECIMAL(10, 2))
    cost_price = Column(DECIMAL(10, 2))
    discount_badge_text = Column(String(50))
    price_note = Column(String(100))
    is_taxable = Column(Boolean, default=True)
    tax_rate = Column(DECIMAL(5, 2), default=18.00)

    # Care info (plants only)
    care_light = Column(String(100))
    care_water = Column(String(100))
    care_temperature = Column(String(50))
    care_skill = Column(Enum("beginner", "intermediate", "expert"))
    is_pet_friendly = Column(Boolean)
    is_air_purifying = Column(Boolean)

    # Delivery
    delivery_eta_label = Column(String(100), default="3–5 business days")
    health_guarantee_label = Column(String(100), default="7-day health guarantee")
    packaging_label = Column(String(100), default="Eco-friendly packaging")
    weight_grams = Column(DECIMAL(8, 2))
    length_cm = Column(DECIMAL(6, 2))
    width_cm = Column(DECIMAL(6, 2))
    height_cm = Column(DECIMAL(6, 2))
    free_delivery_eligible = Column(Boolean, default=True)

    # SEO
    seo_title = Column(String(70))
    seo_description = Column(String(160))

    # Status
    status = Column(Enum("draft", "active", "archived"), default="draft")
    published_at = Column(DateTime)

    # Ratings cache (denormalised)
    rating_average = Column(DECIMAL(3, 2), default=0.00)
    rating_count = Column(Integer, default=0)

    created_by = Column(BigInteger, ForeignKey("admin_users.id", ondelete="SET NULL"))
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    category = relationship("Category", back_populates="products")
    created_by_admin = relationship("AdminUser")
    images = relationship("ProductImage", back_populates="product", cascade="all, delete-orphan")
    variants = relationship("ProductVariant", back_populates="product", cascade="all, delete-orphan")
    tags = relationship("ProductTag", back_populates="product", cascade="all, delete-orphan")
    care_cards = relationship("ProductCareCard", back_populates="product", cascade="all, delete-orphan")
    features = relationship("ProductFeature", back_populates="product", cascade="all, delete-orphan")
    specifications = relationship("ProductSpecification", back_populates="product", cascade="all, delete-orphan")
    pot_upsells = relationship("PotUpsell", foreign_keys="PotUpsell.plant_product_id", back_populates="plant_product", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="product")
    product_collections = relationship("ProductCollection", back_populates="product")
    discount_products = relationship("DiscountProduct", back_populates="product")
    wishlist_items = relationship("WishlistItem", back_populates="product")
    ai_suggestions = relationship("AICareProductSuggestion", back_populates="product")
    user_plants = relationship("UserPlant", back_populates="product")

    __table_args__ = (
        Index("idx_slug", "slug"),
        Index("idx_status", "status"),
        Index("idx_category_id", "category_id"),
        Index("idx_product_type", "product_type"),
    )


class ProductVariant(Base):
    __tablename__ = "product_variants"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    product_id = Column(BigInteger, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    variant_type = Column(Enum("size", "diameter", "weight", "pack_size", "custom"), nullable=False)
    option_name = Column(String(100), nullable=False)
    option_detail = Column(String(100))
    best_for = Column(String(150))
    pot_diameter = Column(String(50))
    dispatch_time = Column(String(50))
    price = Column(DECIMAL(10, 2), nullable=False)
    compare_at_price = Column(DECIMAL(10, 2))
    sku = Column(String(100), unique=True, nullable=False)
    barcode = Column(String(100))
    sort_order = Column(SmallInteger, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    product = relationship("Product", back_populates="variants")
    inventory = relationship("Inventory", back_populates="variant", uselist=False, cascade="all, delete-orphan")
    cart_items = relationship("CartItem", back_populates="variant")
    order_items = relationship("OrderItem", back_populates="variant")
    inventory_history = relationship("InventoryHistory", back_populates="variant")
    wishlist_items = relationship("WishlistItem", back_populates="variant")

    __table_args__ = (
        Index("idx_product_id", "product_id"),
        Index("idx_sku", "sku"),
    )


class ProductImage(Base):
    __tablename__ = "product_images"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    product_id = Column(BigInteger, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    url = Column(String(500), nullable=False)
    alt_text = Column(String(255))
    position = Column(SmallInteger, default=1)
    is_primary = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())

    product = relationship("Product", back_populates="images")

    __table_args__ = (
        Index("idx_product_id", "product_id"),
    )


class ProductTag(Base):
    __tablename__ = "product_tags"

    product_id = Column(BigInteger, ForeignKey("products.id", ondelete="CASCADE"), primary_key=True)
    tag = Column(String(100), primary_key=True)

    product = relationship("Product", back_populates="tags")

    __table_args__ = (
        Index("idx_tag", "tag"),
    )


class ProductCareCard(Base):
    __tablename__ = "product_care_cards"

    id = Column(Integer, primary_key=True, autoincrement=True)
    product_id = Column(BigInteger, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    icon = Column(String(50))
    title = Column(String(100), nullable=False)
    value = Column(String(150), nullable=False)
    detail = Column(Text)
    difficulty_level = Column(SmallInteger, default=3)
    sort_order = Column(SmallInteger, default=1)
    created_at = Column(DateTime, server_default=func.now())

    product = relationship("Product", back_populates="care_cards")

    __table_args__ = (
        Index("idx_product_id", "product_id"),
    )


class ProductFeature(Base):
    __tablename__ = "product_features"

    id = Column(Integer, primary_key=True, autoincrement=True)
    product_id = Column(BigInteger, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    feature = Column(String(255), nullable=False)
    sort_order = Column(SmallInteger, default=1)

    product = relationship("Product", back_populates="features")


class ProductSpecification(Base):
    __tablename__ = "product_specifications"

    id = Column(Integer, primary_key=True, autoincrement=True)
    product_id = Column(BigInteger, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    label = Column(String(100), nullable=False)
    value = Column(String(255), nullable=False)
    sort_order = Column(SmallInteger, default=1)

    product = relationship("Product", back_populates="specifications")


class PotUpsell(Base):
    __tablename__ = "pot_upsells"

    id = Column(Integer, primary_key=True, autoincrement=True)
    plant_product_id = Column(BigInteger, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    pot_product_id = Column(BigInteger, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    sort_order = Column(SmallInteger, default=1)

    plant_product = relationship("Product", foreign_keys=[plant_product_id], back_populates="pot_upsells")
    pot_product = relationship("Product", foreign_keys=[pot_product_id])

    __table_args__ = (
        Index("idx_plant", "plant_product_id"),
    )
