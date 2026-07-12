from sqlalchemy import (
    Column, BigInteger, SmallInteger, String, DateTime, Date,
    Enum, Text, ForeignKey, Index
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class UserPlant(Base):
    __tablename__ = "user_plants"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id = Column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(BigInteger, ForeignKey("products.id", ondelete="SET NULL"))
    plant_name = Column(String(200), nullable=False)
    nickname = Column(String(100))
    location = Column(String(100))
    photo_url = Column(String(500))
    added_at = Column(Date, nullable=False)
    last_watered_at = Column(Date)
    next_water_due = Column(Date)
    watering_interval_days = Column(SmallInteger, default=7)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="plants")
    product = relationship("Product", back_populates="user_plants")
    care_logs = relationship("PlantCareLog", back_populates="plant", cascade="all, delete-orphan")

    __table_args__ = (
        Index("idx_user_id", "user_id"),
    )


class PlantCareLog(Base):
    __tablename__ = "plant_care_logs"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    plant_id = Column(BigInteger, ForeignKey("user_plants.id", ondelete="CASCADE"), nullable=False)
    type = Column(Enum("watered", "fertilised", "repotted", "pruned", "note"), nullable=False)
    note = Column(Text)
    logged_at = Column(DateTime, server_default=func.now())

    plant = relationship("UserPlant", back_populates="care_logs")

    __table_args__ = (
        Index("idx_plant_id", "plant_id"),
    )
