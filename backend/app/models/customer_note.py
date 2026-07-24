from sqlalchemy import BigInteger, Column, DateTime, ForeignKey, Index, Text
from sqlalchemy.sql import func

from app.database import Base


class CustomerNote(Base):
    """Internal note authored by an administrator; never exposed to storefront users."""

    __tablename__ = "customer_notes"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id = Column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    admin_id = Column(BigInteger, ForeignKey("admin_users.id", ondelete="SET NULL"))
    note = Column(Text, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    __table_args__ = (Index("idx_customer_notes_user_created", "user_id", "created_at"),)
