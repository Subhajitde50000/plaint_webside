from sqlalchemy import (
    Column, BigInteger, Integer, SmallInteger, String, Boolean,
    DateTime, Enum, Text, ForeignKey, Index
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Review(Base):
    __tablename__ = "reviews"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    uuid = Column(String(36), unique=True, nullable=False)
    product_id = Column(BigInteger, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(BigInteger, ForeignKey("users.id", ondelete="SET NULL"))
    order_item_id = Column(BigInteger, ForeignKey("order_items.id", ondelete="SET NULL"))
    reviewer_name = Column(String(200), nullable=False)
    reviewer_email = Column(String(254))
    rating = Column(SmallInteger, nullable=False)
    title = Column(String(255))
    body = Column(Text)
    is_verified_purchase = Column(Boolean, default=False)
    is_featured = Column(Boolean, default=False)
    status = Column(
        Enum("submitted", "pending", "published", "rejected", "flagged"),
        default="pending",
    )
    rejection_reason = Column(String(500))
    admin_reply = Column(Text)
    admin_reply_at = Column(DateTime)
    admin_reply_by = Column(BigInteger, ForeignKey("admin_users.id", ondelete="SET NULL"))
    flag_count = Column(SmallInteger, default=0)
    helpful_count = Column(Integer, default=0)
    not_helpful_count = Column(Integer, default=0)
    moderated_by = Column(BigInteger, ForeignKey("admin_users.id", ondelete="SET NULL"))
    moderated_at = Column(DateTime)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    product = relationship("Product", back_populates="reviews")
    user = relationship("User", back_populates="reviews")
    order_item = relationship("OrderItem", back_populates="reviews")
    photos = relationship("ReviewPhoto", back_populates="review", cascade="all, delete-orphan")
    flags = relationship("ReviewFlag", back_populates="review", cascade="all, delete-orphan")
    moderation_history = relationship("ReviewModerationHistory", back_populates="review", cascade="all, delete-orphan")

    __table_args__ = (
        Index("idx_product_id", "product_id"),
        Index("idx_status", "status"),
        Index("idx_rating", "rating"),
        Index("idx_created_at", "created_at"),
        Index("idx_product_status_date", "product_id", "status", "created_at"),
    )


class ReviewPhoto(Base):
    __tablename__ = "review_photos"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    review_id = Column(BigInteger, ForeignKey("reviews.id", ondelete="CASCADE"), nullable=False)
    url = Column(String(500), nullable=False)
    position = Column(SmallInteger, default=1)
    created_at = Column(DateTime, server_default=func.now())

    review = relationship("Review", back_populates="photos")


class ReviewFlag(Base):
    __tablename__ = "review_flags"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    review_id = Column(BigInteger, ForeignKey("reviews.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(BigInteger, ForeignKey("users.id", ondelete="SET NULL"))
    reason = Column(
        Enum(
            "inappropriate_language", "spam", "off_topic",
            "fake_purchase", "personal_info", "suspected_bot", "other",
        ),
        nullable=False,
    )
    reporter = Column(Enum("customer", "system", "admin"), default="customer")
    notes = Column(String(500))
    resolved_by = Column(BigInteger, ForeignKey("admin_users.id", ondelete="SET NULL"))
    resolved_at = Column(DateTime)
    created_at = Column(DateTime, server_default=func.now())

    review = relationship("Review", back_populates="flags")

    __table_args__ = (
        Index("idx_review_id", "review_id"),
    )


class ReviewModerationHistory(Base):
    __tablename__ = "review_moderation_history"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    review_id = Column(BigInteger, ForeignKey("reviews.id", ondelete="CASCADE"), nullable=False)
    admin_id = Column(BigInteger, ForeignKey("admin_users.id", ondelete="SET NULL"))
    action = Column(String(100), nullable=False)
    notes = Column(String(500))
    created_at = Column(DateTime, server_default=func.now())

    review = relationship("Review", back_populates="moderation_history")
