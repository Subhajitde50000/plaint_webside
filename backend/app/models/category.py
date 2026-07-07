from sqlalchemy import (
    Column, BigInteger, Integer, SmallInteger, String, Boolean,
    DateTime, Enum, Text, DECIMAL, ForeignKey, Index
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, autoincrement=True)
    parent_id = Column(Integer, ForeignKey("categories.id", ondelete="SET NULL"))
    name = Column(String(100), nullable=False)
    slug = Column(String(120), unique=True, nullable=False)
    description = Column(Text)
    image_url = Column(String(500))
    sort_order = Column(SmallInteger, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    parent = relationship("Category", remote_side=[id], back_populates="children")
    children = relationship("Category", back_populates="parent")
    products = relationship("Product", back_populates="category")

    __table_args__ = (
        Index("idx_slug", "slug"),
        Index("idx_parent_id", "parent_id"),
    )


class Collection(Base):
    __tablename__ = "collections"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    slug = Column(String(120), unique=True, nullable=False)
    description = Column(Text)
    image_url = Column(String(500))
    is_active = Column(Boolean, default=True)
    sort_order = Column(SmallInteger, default=0)
    created_at = Column(DateTime, server_default=func.now())

    product_collections = relationship("ProductCollection", back_populates="collection", cascade="all, delete-orphan")
    products = relationship("Product", secondary="product_collections", viewonly=True)


class ProductCollection(Base):
    __tablename__ = "product_collections"

    product_id = Column(BigInteger, ForeignKey("products.id", ondelete="CASCADE"), primary_key=True)
    collection_id = Column(Integer, ForeignKey("collections.id", ondelete="CASCADE"), primary_key=True)
    sort_order = Column(SmallInteger, default=0)

    product = relationship("Product", back_populates="product_collections")
    collection = relationship("Collection", back_populates="product_collections")
