from sqlalchemy import Column, BigInteger, String, Boolean, DateTime, Enum, Index, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class AdminUser(Base):
    __tablename__ = "admin_users"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    uuid = Column(String(36), unique=True, nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(254), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(
        Enum(
            "super_admin", "operations_manager", "inventory_manager",
            "customer_support", "marketing", "garden_services", "analyst"
        ),
        nullable=False,
    )
    avatar_url = Column(String(500))
    is_active = Column(Boolean, default=True)
    mfa_secret = Column(String(255))   # TOTP secret (encrypted)
    mfa_enabled = Column(Boolean, default=False)
    last_login_at = Column(DateTime)
    last_login_ip = Column(String(45))
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    refresh_tokens = relationship("AdminRefreshToken", back_populates="admin", cascade="all, delete-orphan")

    __table_args__ = (
        Index("idx_email", "email"),
        Index("idx_role", "role"),
    )


class AdminRefreshToken(Base):
    __tablename__ = "admin_refresh_tokens"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    admin_id = Column(BigInteger, ForeignKey("admin_users.id", ondelete="CASCADE"), nullable=False)
    token_hash = Column(String(64), unique=True, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    revoked_at = Column(DateTime)
    created_at = Column(DateTime, server_default=func.now())

    admin = relationship("AdminUser", back_populates="refresh_tokens")
