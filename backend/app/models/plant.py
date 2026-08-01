import enum
from sqlalchemy import (
    Column, BigInteger, SmallInteger, String, Boolean, Date,
    DateTime, Text, Enum, DECIMAL, ForeignKey, Index
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


# ── Enums ─────────────────────────────────────────────────────────────

class GrowthStage(str, enum.Enum):
    seedling   = "seedling"
    juvenile   = "juvenile"
    adolescent = "adolescent"
    mature     = "mature"
    dormant    = "dormant"


class SunlightExposure(str, enum.Enum):
    full_sun        = "full_sun"
    partial_sun     = "partial_sun"
    indirect_bright = "indirect_bright"
    low_light       = "low_light"
    artificial_only = "artificial_only"


class HealthStatus(str, enum.Enum):
    thriving        = "thriving"
    healthy         = "healthy"
    needs_attention = "needs_attention"
    sick            = "sick"
    recovering      = "recovering"


class PlantCareLogType(str, enum.Enum):
    watered    = "watered"
    fertilised = "fertilised"
    repotted   = "repotted"
    pruned     = "pruned"
    note       = "note"


class CareCategory(str, enum.Enum):
    watering    = "watering"
    fertilising = "fertilising"
    repotting   = "repotting"
    pruning     = "pruning"
    disease     = "disease"
    pest        = "pest"
    light       = "light"
    temperature = "temperature"
    general     = "general"
    note        = "note"


# ── Models ────────────────────────────────────────────────────────────

class UserPlant(Base):
    __tablename__ = "user_plants"

    id                     = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id                = Column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    product_id             = Column(BigInteger, ForeignKey("products.id", ondelete="SET NULL"), nullable=True)

    plant_name             = Column(String(200), nullable=False)
    nickname               = Column(String(100))
    location               = Column(String(100))
    photo_url              = Column(String(500))
    added_at               = Column(Date, nullable=False)

    # Care schedule
    last_watered_at        = Column(Date)
    next_water_due         = Column(Date)
    watering_interval_days = Column(SmallInteger, default=7)
    last_fertilised_at     = Column(Date)
    last_repotted_at       = Column(Date)

    # Plant characteristics
    height_cm              = Column(DECIMAL(6, 1))
    growth_stage           = Column(Enum(GrowthStage))
    pot_size_cm            = Column(SmallInteger)
    soil_type              = Column(String(100))
    sunlight_exposure      = Column(Enum(SunlightExposure))
    health_status          = Column(Enum(HealthStatus), default=HealthStatus.healthy)
    is_pet_household       = Column(Boolean, default=False)
    user_notes             = Column(Text)

    created_at             = Column(DateTime, server_default=func.now())
    updated_at             = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    user        = relationship("User", back_populates="plants")
    product     = relationship("Product", back_populates="user_plants")
    care_logs   = relationship(
        "PlantCareLog", back_populates="plant",
        cascade="all, delete-orphan",
        order_by="PlantCareLog.logged_at.desc()"
    )
    care_guides = relationship(
        "AiCareGuide", back_populates="plant",
        cascade="all, delete-orphan",
        order_by="AiCareGuide.created_at.desc()"
    )

    __table_args__ = (
        Index("idx_user_plant_user_id", "user_id"),
    )


class PlantCareLog(Base):
    __tablename__ = "plant_care_logs"

    id            = Column(BigInteger, primary_key=True, autoincrement=True)
    plant_id      = Column(BigInteger, ForeignKey("user_plants.id", ondelete="CASCADE"), nullable=False)
    type          = Column(Enum(PlantCareLogType), nullable=False)
    source        = Column(Enum("user", "ai", "system"), default="user")
    ai_session_id = Column(BigInteger, ForeignKey("ai_care_sessions.id", ondelete="SET NULL"), nullable=True)
    care_category = Column(Enum(CareCategory), default=CareCategory.note)
    note          = Column(Text)
    is_care_guide = Column(Boolean, default=False)
    logged_at     = Column(DateTime, server_default=func.now())

    plant   = relationship("UserPlant", back_populates="care_logs")
    session = relationship("AICareSession", foreign_keys=[ai_session_id])

    __table_args__ = (
        Index("idx_care_log_plant_id", "plant_id"),
    )


class AiCareGuide(Base):
    __tablename__ = "ai_care_guides"

    id            = Column(BigInteger, primary_key=True, autoincrement=True)
    plant_id      = Column(BigInteger, ForeignKey("user_plants.id", ondelete="CASCADE"), nullable=False)
    session_id    = Column(BigInteger, ForeignKey("ai_care_sessions.id", ondelete="SET NULL"), nullable=True)
    category      = Column(Enum(CareCategory), nullable=False)
    title         = Column(String(255), nullable=False)
    content       = Column(Text, nullable=False)
    severity      = Column(Enum("info", "warning", "urgent"), default="info")
    is_resolved   = Column(Boolean, default=False)
    resolved_at   = Column(DateTime)
    resolved_note = Column(String(500))
    created_by    = Column(Enum("ai", "user"), default="ai")
    created_at    = Column(DateTime, server_default=func.now())
    updated_at    = Column(DateTime, server_default=func.now(), onupdate=func.now())

    plant   = relationship("UserPlant", back_populates="care_guides")
    session = relationship("AICareSession", foreign_keys=[session_id])

    __table_args__ = (
        Index("idx_care_guide_plant_id", "plant_id"),
        Index("idx_care_guide_severity", "severity"),
    )
