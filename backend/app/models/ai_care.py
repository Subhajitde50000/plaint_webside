from sqlalchemy import (
    Column, BigInteger, SmallInteger, String, Boolean,
    DateTime, Enum, Text, DECIMAL, ForeignKey, Index, Integer
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class AICareSession(Base):
    __tablename__ = "ai_care_sessions"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    uuid = Column(String(36), unique=True, nullable=False)
    user_id = Column(BigInteger, ForeignKey("users.id", ondelete="SET NULL"))
    session_token = Column(String(64))
    source = Column(
        Enum("chat", "photo_upload", "room_visualiser", "quick_prompt"), default="chat"
    )
    device_type = Column(String(50))
    ip_address = Column(String(45))
    duration_seconds = Column(Integer)
    message_count = Column(SmallInteger, default=0)
    photo_url = Column(String(500))
    plant_id_result = Column(String(255))
    plant_id_confidence = Column(DECIMAL(5, 2))
    rating = Column(Enum("helpful", "not_helpful"))
    converted_to_cart = Column(Boolean, default=False)
    converted_product_ids = Column(Text)     # JSON array
    flag_status = Column(Enum("normal", "flagged", "reviewed"), default="normal")
    flag_reason = Column(String(255))
    reviewed_by = Column(BigInteger, ForeignKey("admin_users.id", ondelete="SET NULL"))
    reviewed_at = Column(DateTime)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="ai_care_sessions")
    messages = relationship("AICareMessage", back_populates="session", cascade="all, delete-orphan")
    product_suggestions = relationship("AICareProductSuggestion", back_populates="session", cascade="all, delete-orphan")

    __table_args__ = (
        Index("idx_user_id", "user_id"),
        Index("idx_created_at", "created_at"),
        Index("idx_flag_status", "flag_status"),
        Index("idx_user_created", "user_id", "created_at"),
    )


class AICareMessage(Base):
    __tablename__ = "ai_care_messages"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    session_id = Column(BigInteger, ForeignKey("ai_care_sessions.id", ondelete="CASCADE"), nullable=False)
    role = Column(Enum("user", "assistant"), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    session = relationship("AICareSession", back_populates="messages")

    __table_args__ = (
        Index("idx_session_id", "session_id"),
    )


class AICareProductSuggestion(Base):
    __tablename__ = "ai_care_product_suggestions"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    session_id = Column(BigInteger, ForeignKey("ai_care_sessions.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(BigInteger, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    clicked = Column(Boolean, default=False)
    added_to_cart = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())

    session = relationship("AICareSession", back_populates="product_suggestions")
    product = relationship("Product", back_populates="ai_suggestions")
