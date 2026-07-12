from sqlalchemy import (
    Column,BigInteger, String, Boolean,DateTime, Date,
      Enum, Text, ForeignKey, Index
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import column, func
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    uuid = Column(String(36), unique=True, nullable=False)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    phone_number = Column(String(20), unique=True, nullable=True)
    password_hash = Column(String(255), nullable=False)
    preferred_language = Column(String(10), default='en')
    currency = Column(String(10), default='INR')
    email_verified = Column(Boolean, default=False)
    phone_verified = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    is_blocked = Column(Boolean, default=False)
    block_reason = Column(String(255), nullable=True)
    block_at = Column(DateTime)
    last_login_at = Column(DateTime)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    deleted_at = Column(DateTime)


    # Relationships
    social_accounts = relationship("UserSocialAccount", back_populates="user")
    verification_tokens = relationship("VerificationToken", back_populates="user", cascade="all, delete-orphan")
    refresh_tokens = relationship("RefreshToken", back_populates="user", cascade="all, delete-orphan")
    addresses = relationship("Address", back_populates="user", cascade="all, delete-orphan")
    orders = relationship("Order", back_populates="user")
    carts = relationship("Cart", back_populates="user")
    loyalty_account = relationship("LoyaltyAccount", back_populates="user", uselist=False, cascade="all, delete-orphan")
    loyalty_transactions = relationship("LoyaltyTransaction", back_populates="user")
    wishlist = relationship("Wishlist", back_populates="user", uselist=False, cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="user")
    plants = relationship("UserPlant", back_populates="user", cascade="all, delete-orphan")
    notification_preferences = relationship("NotificationPreference", back_populates="user", uselist=False)
    ai_care_sessions = relationship("AICareSession", back_populates="user")
    garden_bookings = relationship("GardenBooking", back_populates="user")
    payment_methods = relationship("PaymentMethod", back_populates="user", cascade="all, delete-orphan")

    __table_args__ = (
        Index("idx_email", "email"),
        Index("idx_phone", "phone"),
        Index("idx_created_at", "created_at"),
        Index("idx_is_active", "is_active"),
    )

class UserSocialAccount(Base):
    __tablename__ = "user_social_accounts"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id = Column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    provider = Column(Enum("google", "facebook", "apple"), nullable=False)
    provider_uid = Column(String(255), nullable=False)
    access_token = Column(Text)
    created_at = Column(DateTime, server_default=func.now())

    user = relationship("User", back_populates="social_accounts")

    __table_args__ = (
        Index("idx_user_id", "user_id"),
    )


class VerificationToken(Base):
    __tablename__ = "verification_tokens"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id = Column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    token = Column(String(64), unique=True, nullable=False)
    type = Column(Enum("email_verify", "password_reset", "phone_otp"), nullable=False)
    expires_at = Column(DateTime, nullable=False)
    used_at = Column(DateTime)
    created_at = Column(DateTime, server_default=func.now())

    user = relationship("User", back_populates="verification_tokens")

    __table_args__ = (
        Index("idx_token", "token"),
        Index("idx_user_id", "user_id"),
    )


class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id = Column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    token_hash = Column(String(64), unique=True, nullable=False)  # SHA-256 of raw token
    device_info = Column(String(255))
    ip_address = Column(String(45))
    expires_at = Column(DateTime, nullable=False)
    revoked_at = Column(DateTime)
    created_at = Column(DateTime, server_default=func.now())

    user = relationship("User", back_populates="refresh_tokens")

    __table_args__ = (
        Index("idx_user_id", "user_id"),
    )
