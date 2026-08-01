# Hero Plant Store — AI Care System
## Complete Build Specification v1.0
### Database · Backend · Frontend · API Connection

> **Vision:** When a user adds a plant to their profile (name, height, growth stage, notes, watering schedule), that plant becomes the intelligent context for the AI Care chatbot. On the AI Care page, a dropdown shows all saved plants. Selecting one pre-loads the AI with everything known about that plant — and every useful AI response (disease diagnosis, care guide, fertiliser schedule) is automatically saved back to the plant's care guide section. The AI gets smarter the more the user uses it.

---

## 1. Updated Database Schema

### 1.1 Extend `user_plants` Table

The existing `user_plants` table needs more fields to carry full plant context into the AI.

```sql
-- Add these columns to the existing user_plants table
ALTER TABLE user_plants
  ADD COLUMN height_cm           DECIMAL(6,1)      AFTER watering_interval_days,
  ADD COLUMN growth_stage        ENUM(
      'seedling','juvenile','adolescent','mature','dormant'
  )                                                 AFTER height_cm,
  ADD COLUMN pot_size_cm         TINYINT UNSIGNED   AFTER growth_stage,
  ADD COLUMN soil_type           VARCHAR(100)       AFTER pot_size_cm,
  ADD COLUMN sunlight_exposure   ENUM(
      'full_sun','partial_sun','indirect_bright','low_light','artificial_only'
  )                                                 AFTER soil_type,
  ADD COLUMN last_fertilised_at  DATE               AFTER sunlight_exposure,
  ADD COLUMN last_repotted_at    DATE               AFTER last_fertilised_at,
  ADD COLUMN health_status       ENUM(
      'thriving','healthy','needs_attention','sick','recovering'
  ) DEFAULT 'healthy'                               AFTER last_repotted_at,
  ADD COLUMN is_pet_household    BOOLEAN DEFAULT FALSE AFTER health_status,
  ADD COLUMN user_notes          TEXT               AFTER is_pet_household;
  -- user_notes: freeform notes user adds about this specific plant
  -- e.g. "Leaves turned yellow in winter", "Moved to bedroom shelf"
```

### 1.2 Extend `plant_care_logs` Table

```sql
-- Extend log types to include AI responses
ALTER TABLE plant_care_logs
  ADD COLUMN source        ENUM('user','ai','system') DEFAULT 'user' AFTER type,
  ADD COLUMN ai_session_id BIGINT UNSIGNED NULL                      AFTER source,
  ADD COLUMN care_category ENUM(
      'watering','fertilising','repotting','pruning',
      'disease','pest','light','temperature','general','note'
  ) DEFAULT 'note'                                                   AFTER ai_session_id,
  ADD COLUMN is_care_guide BOOLEAN DEFAULT FALSE                     AFTER care_category;
  -- is_care_guide = TRUE means this log appears in the plant's Care Guide section
  -- AI responses that contain actionable advice are saved with is_care_guide = TRUE
```

### 1.3 New Table: `ai_care_plant_context`

Links an AI Care session to a specific user plant so the AI has full context.

```sql
CREATE TABLE ai_care_plant_context (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    session_id      BIGINT UNSIGNED NOT NULL,
    plant_id        BIGINT UNSIGNED NOT NULL,
    context_snapshot JSON NOT NULL,
    -- Snapshot of plant data at session start:
    -- { plant_name, nickname, height_cm, growth_stage, health_status,
    --   last_watered, soil_type, sunlight, notes, recent_logs[] }
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (session_id) REFERENCES ai_care_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (plant_id)   REFERENCES user_plants(id)      ON DELETE CASCADE,
    INDEX idx_session_id (session_id),
    INDEX idx_plant_id (plant_id)
) ENGINE=InnoDB;
```

### 1.4 New Table: `ai_care_guides`

Stores AI-generated care guide entries per plant — separate from generic logs.

```sql
CREATE TABLE ai_care_guides (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    plant_id        BIGINT UNSIGNED NOT NULL,
    session_id      BIGINT UNSIGNED,        -- which session generated this
    category        ENUM(
        'watering','fertilising','repotting','pruning',
        'disease','pest','light','temperature','general'
    ) NOT NULL,
    title           VARCHAR(255) NOT NULL,  -- "Yellowing Leaves — Diagnosis"
    content         TEXT NOT NULL,          -- Full AI response, formatted
    severity        ENUM('info','warning','urgent') DEFAULT 'info',
    is_resolved     BOOLEAN DEFAULT FALSE,
    resolved_at     DATETIME,
    resolved_note   VARCHAR(500),
    created_by      ENUM('ai','user') DEFAULT 'ai',
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (plant_id)   REFERENCES user_plants(id)       ON DELETE CASCADE,
    FOREIGN KEY (session_id) REFERENCES ai_care_sessions(id)  ON DELETE SET NULL,
    INDEX idx_plant_id (plant_id),
    INDEX idx_category (category),
    INDEX idx_severity (severity)
) ENGINE=InnoDB;
```

---

## 2. Updated Backend — Models

### 2.1 Updated `UserPlant` Model (`app/models/plant.py`)

```python
from sqlalchemy import (
    Column, BigInteger, String, Boolean, Date,
    DateTime, Text, Enum, DECIMAL, SmallInteger,
    Integer, ForeignKey, Index
)
from sqlalchemy.orm import relationship
from app.database import Base
import enum

class GrowthStage(str, enum.Enum):
    seedling    = "seedling"
    juvenile    = "juvenile"
    adolescent  = "adolescent"
    mature      = "mature"
    dormant     = "dormant"

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

class UserPlant(Base):
    __tablename__ = "user_plants"

    id                      = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id                 = Column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    product_id              = Column(BigInteger, ForeignKey("products.id", ondelete="SET NULL"), nullable=True)

    plant_name              = Column(String(200), nullable=False)
    nickname                = Column(String(100))
    location                = Column(String(100))          # "Living Room", "Balcony"
    photo_url               = Column(String(500))
    added_at                = Column(Date, nullable=False)

    # Care schedule
    last_watered_at         = Column(Date)
    next_water_due          = Column(Date)
    watering_interval_days  = Column(SmallInteger, default=7)
    last_fertilised_at      = Column(Date)
    last_repotted_at        = Column(Date)

    # Plant characteristics (new fields)
    height_cm               = Column(DECIMAL(6, 1))
    growth_stage            = Column(Enum(GrowthStage))
    pot_size_cm             = Column(SmallInteger)
    soil_type               = Column(String(100))
    sunlight_exposure       = Column(Enum(SunlightExposure))
    health_status           = Column(Enum(HealthStatus), default=HealthStatus.healthy)
    is_pet_household        = Column(Boolean, default=False)
    user_notes              = Column(Text)                 # freeform notes

    created_at              = Column(DateTime)
    updated_at              = Column(DateTime)

    # Relationships
    user        = relationship("User",    back_populates="plants")
    product     = relationship("Product", back_populates=None)
    care_logs   = relationship("PlantCareLog",  back_populates="plant",
                               cascade="all, delete-orphan",
                               order_by="PlantCareLog.logged_at.desc()")
    care_guides = relationship("AiCareGuide",   back_populates="plant",
                               cascade="all, delete-orphan",
                               order_by="AiCareGuide.created_at.desc()")

class PlantCareLogType(str, enum.Enum):
    watered     = "watered"
    fertilised  = "fertilised"
    repotted    = "repotted"
    pruned      = "pruned"
    note        = "note"

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

class PlantCareLog(Base):
    __tablename__ = "plant_care_logs"

    id              = Column(BigInteger, primary_key=True, autoincrement=True)
    plant_id        = Column(BigInteger, ForeignKey("user_plants.id", ondelete="CASCADE"), nullable=False)
    type            = Column(Enum(PlantCareLogType), nullable=False)
    source          = Column(Enum("user","ai","system"), default="user")
    ai_session_id   = Column(BigInteger, ForeignKey("ai_care_sessions.id", ondelete="SET NULL"), nullable=True)
    care_category   = Column(Enum(CareCategory), default=CareCategory.note)
    note            = Column(Text)
    is_care_guide   = Column(Boolean, default=False)
    logged_at       = Column(DateTime)

    plant   = relationship("UserPlant",    back_populates="care_logs")
    session = relationship("AICareSession", foreign_keys=[ai_session_id])

class AiCareGuide(Base):
    __tablename__ = "ai_care_guides"

    id          = Column(BigInteger, primary_key=True, autoincrement=True)
    plant_id    = Column(BigInteger, ForeignKey("user_plants.id", ondelete="CASCADE"), nullable=False)
    session_id  = Column(BigInteger, ForeignKey("ai_care_sessions.id", ondelete="SET NULL"), nullable=True)
    category    = Column(Enum(CareCategory), nullable=False)
    title       = Column(String(255), nullable=False)
    content     = Column(Text, nullable=False)
    severity    = Column(Enum("info","warning","urgent"), default="info")
    is_resolved = Column(Boolean, default=False)
    resolved_at = Column(DateTime)
    resolved_note = Column(String(500))
    created_by  = Column(Enum("ai","user"), default="ai")
    created_at  = Column(DateTime)
    updated_at  = Column(DateTime)

    plant   = relationship("UserPlant",    back_populates="care_guides")
    session = relationship("AICareSession", foreign_keys=[session_id])
```


---

## 3. Updated AI Care Service (`app/services/ai_care_service.py`)

```python
from openai import OpenAI
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import Optional, List, Tuple
from datetime import date, timedelta
import json

from app.config import settings
from app.models.plant import UserPlant, PlantCareLog, AiCareGuide, CareCategory
from app.models.ai_care import AICareSession, AICareMessage, AiCarePlantContext
from app.models.product import Product

client = OpenAI(api_key=settings.OPENAI_API_KEY)

# ── System prompt ─────────────────────────────────────────────────────
BASE_SYSTEM_PROMPT = """
You are Hero Plants' expert AI plant care assistant — warm, knowledgeable,
and precise. You help customers care for their specific plants using the
detailed plant data provided to you.

RULES:
1. Always reference the specific plant by name or nickname.
2. Use the plant's actual data (height, growth stage, last watered, soil,
   sunlight, health, notes) to give personalised advice — not generic tips.
3. When diagnosing a disease or pest, be specific: name it, describe symptoms
   to confirm, and give a clear step-by-step treatment plan.
4. When giving care advice that should be saved (disease diagnosis, fertiliser
   schedule, repotting guide), end your response with exactly this JSON block
   on its own line:
   SAVE_GUIDE:{"category":"disease","title":"[short title]","severity":"warning"}
   Categories: watering | fertilising | repotting | pruning | disease |
               pest | light | temperature | general
   Severity: info | warning | urgent
5. If the user asks something unrelated to plants, politely redirect.
6. Never recommend harmful chemicals if user mentioned pets at home.
7. Keep responses under 250 words unless a detailed guide is requested.
8. Recommend Hero Plants products where genuinely helpful — only real products.
"""

def build_plant_context_block(plant: UserPlant, db: Session) -> str:
    """Build a detailed text context block about the plant for the AI prompt."""

    # Recent care logs (last 10)
    recent_logs = db.query(PlantCareLog).filter(
        PlantCareLog.plant_id == plant.id
    ).order_by(desc(PlantCareLog.logged_at)).limit(10).all()

    logs_text = ""
    for log in recent_logs:
        source = f"[{log.source.upper()}]" if log.source != "user" else ""
        logs_text += f"\n  - {log.logged_at.strftime('%d %b %Y') if log.logged_at else 'Unknown'}: {log.type.value} {source} — {log.note or ''}"

    # Existing care guides
    guides = db.query(AiCareGuide).filter(
        AiCareGuide.plant_id == plant.id,
        AiCareGuide.is_resolved == False
    ).order_by(desc(AiCareGuide.created_at)).limit(5).all()

    guides_text = ""
    for guide in guides:
        guides_text += f"\n  - [{guide.severity.upper()}] {guide.title} ({guide.category.value})"

    # Watering status
    water_status = "Unknown"
    if plant.next_water_due:
        days_until = (plant.next_water_due - date.today()).days
        if days_until < 0:
            water_status = f"OVERDUE by {abs(days_until)} day(s)"
        elif days_until == 0:
            water_status = "Due TODAY"
        else:
            water_status = f"Due in {days_until} day(s)"

    context = f"""
=== PLANT CONTEXT (use this to personalise your response) ===
Plant Name:        {plant.plant_name}
Nickname:          {plant.nickname or 'Not set'}
Location:          {plant.location or 'Not specified'}
Height:            {f'{plant.height_cm} cm' if plant.height_cm else 'Not recorded'}
Growth Stage:      {plant.growth_stage.value if plant.growth_stage else 'Unknown'}
Pot Size:          {f'{plant.pot_size_cm} cm diameter' if plant.pot_size_cm else 'Unknown'}
Soil Type:         {plant.soil_type or 'Unknown'}
Sunlight:          {plant.sunlight_exposure.value.replace('_',' ').title() if plant.sunlight_exposure else 'Unknown'}
Health Status:     {plant.health_status.value.replace('_',' ').title() if plant.health_status else 'Unknown'}
Pet Household:     {'Yes — avoid toxic treatments' if plant.is_pet_household else 'No'}
Last Watered:      {plant.last_watered_at.strftime('%d %b %Y') if plant.last_watered_at else 'Unknown'}
Watering Status:   {water_status}
Watering Every:    {plant.watering_interval_days} days
Last Fertilised:   {plant.last_fertilised_at.strftime('%d %b %Y') if plant.last_fertilised_at else 'Never recorded'}
Last Repotted:     {plant.last_repotted_at.strftime('%d %b %Y') if plant.last_repotted_at else 'Never recorded'}
User Notes:        {plant.user_notes or 'No notes added'}

Recent Care Activity:{logs_text if logs_text else ' None recorded'}

Active Care Concerns:{guides_text if guides_text else ' None'}
=== END PLANT CONTEXT ===
"""
    return context


class AICareService:
    def __init__(self, db: Session):
        self.db = db

    def get_user_plants(self, user_id: int) -> List[UserPlant]:
        """Return all plants for the dropdown list on AI Care page."""
        return self.db.query(UserPlant).filter(
            UserPlant.user_id == user_id
        ).order_by(UserPlant.plant_name).all()

    def get_or_create_session(
        self,
        session_uuid: Optional[str],
        user,
        plant_id: Optional[int],
        source: str
    ) -> AICareSession:
        """Get existing session or create new one, linking to plant if given."""
        if session_uuid:
            session = self.db.query(AICareSession).filter(
                AICareSession.uuid == session_uuid
            ).first()
            if session:
                return session

        session = AICareSession(
            user_id=user.id if user else None,
            source=source,
        )
        self.db.add(session)
        self.db.flush()

        # If a plant is selected, save context snapshot
        if plant_id:
            plant = self.db.query(UserPlant).filter(
                UserPlant.id == plant_id,
                UserPlant.user_id == (user.id if user else None)
            ).first()
            if plant:
                snapshot = self._build_snapshot(plant)
                context_record = AiCarePlantContext(
                    session_id=session.id,
                    plant_id=plant.id,
                    context_snapshot=json.dumps(snapshot)
                )
                self.db.add(context_record)

        return session

    def _build_snapshot(self, plant: UserPlant) -> dict:
        """JSON snapshot of plant state at session start."""
        return {
            "plant_id":       plant.id,
            "plant_name":     plant.plant_name,
            "nickname":       plant.nickname,
            "height_cm":      str(plant.height_cm) if plant.height_cm else None,
            "growth_stage":   plant.growth_stage.value if plant.growth_stage else None,
            "health_status":  plant.health_status.value if plant.health_status else None,
            "soil_type":      plant.soil_type,
            "sunlight":       plant.sunlight_exposure.value if plant.sunlight_exposure else None,
            "last_watered":   plant.last_watered_at.isoformat() if plant.last_watered_at else None,
            "user_notes":     plant.user_notes,
        }

    async def generate_response(
        self,
        message: str,
        history: List[AICareMessage],
        plant: Optional[UserPlant],
        photo_url: Optional[str],
        db: Session,
    ) -> Tuple[str, list, Optional[dict]]:
        """
        Generate AI response.
        Returns: (ai_text, suggested_products, save_guide_meta)
        save_guide_meta is non-None when AI wants to save a care guide entry.
        """
        # Build messages for OpenAI
        messages = [{"role": "system", "content": BASE_SYSTEM_PROMPT}]

        # Inject plant context if a plant is selected
        if plant:
            plant_ctx = build_plant_context_block(plant, db)
            messages.append({
                "role": "system",
                "content": plant_ctx
            })

        # Conversation history (last 12 messages for context window)
        for msg in history[-12:]:
            messages.append({"role": msg.role, "content": msg.content})

        # Current user message (with photo if uploaded)
        if photo_url:
            messages.append({
                "role": "user",
                "content": [
                    {"type": "image_url", "image_url": {"url": photo_url}},
                    {"type": "text",      "text": message}
                ]
            })
        else:
            messages.append({"role": "user", "content": message})

        # Call OpenAI
        response = client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=messages,
            max_tokens=500,
            temperature=0.65,
        )

        raw_text = response.choices[0].message.content

        # ── Parse SAVE_GUIDE directive ────────────────────────────────
        save_guide_meta = None
        display_text    = raw_text

        if "SAVE_GUIDE:" in raw_text:
            parts = raw_text.split("SAVE_GUIDE:")
            display_text = parts[0].strip()
            try:
                guide_json   = parts[1].strip().split("\n")[0]
                save_guide_meta = json.loads(guide_json)
            except (json.JSONDecodeError, IndexError):
                save_guide_meta = None

        # ── Find relevant product suggestions ─────────────────────────
        suggested = self._find_relevant_products(message, plant, db)

        return display_text, suggested, save_guide_meta

    def save_ai_care_guide(
        self,
        plant_id: int,
        session_id: int,
        ai_text: str,
        guide_meta: dict
    ) -> AiCareGuide:
        """Save an AI response as a care guide entry on the plant."""
        guide = AiCareGuide(
            plant_id   = plant_id,
            session_id = session_id,
            category   = guide_meta.get("category", "general"),
            title      = guide_meta.get("title", "AI Care Advice"),
            content    = ai_text,
            severity   = guide_meta.get("severity", "info"),
            created_by = "ai",
        )
        self.db.add(guide)

        # Also add to plant_care_logs so it appears in activity timeline
        log = PlantCareLog(
            plant_id      = plant_id,
            type          = "note",
            source        = "ai",
            ai_session_id = session_id,
            care_category = guide_meta.get("category", "general"),
            note          = f"[AI] {guide_meta.get('title', 'Care guide added')}",
            is_care_guide = True,
        )
        self.db.add(log)
        self.db.commit()
        return guide

    def _find_relevant_products(
        self,
        message: str,
        plant: Optional[UserPlant],
        db: Session
    ) -> list:
        """Suggest relevant Hero Plants products based on query topic."""
        msg_lower = message.lower()
        suggestions = []

        keyword_map = {
            ("fertilise","fertilizer","nutrient","feed","npk"): ["fertilizer","accessory"],
            ("soil","potting mix","repot","media"):              ["soil"],
            ("pot","planter","container"):                       ["pot"],
            ("water","watering","spray","mister"):               ["tool"],
            ("pest","bug","insect","aphid","mealybug"):          ["accessory","tool"],
            ("prune","scissors","shears","trim"):                ["tool"],
        }

        types_to_query = []
        for keywords, product_types in keyword_map.items():
            if any(k in msg_lower for k in keywords):
                types_to_query.extend(product_types)

        if types_to_query:
            products = db.query(Product).filter(
                Product.status == "active",
                Product.product_type.in_(list(set(types_to_query)))
            ).limit(3).all()
            suggestions = [
                {
                    "uuid":       str(p.uuid),
                    "title":      p.title,
                    "price":      str(p.base_price),
                    "product_type": p.product_type.value,
                    "image_url":  p.images[0].url if p.images else None,
                }
                for p in products
            ]

        return suggestions
```

---

## 4. Updated AI Care API (`app/api/v1/storefront/ai_care.py`)

```python
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
import json

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.models.plant import UserPlant, AiCareGuide
from app.models.ai_care import AICareSession, AICareMessage
from app.services.ai_care_service import AICareService
from app.utils.storage import upload_file

router = APIRouter(prefix="/ai-care", tags=["AI Care"])


# ── 1. Get user's plants for the dropdown ────────────────────────────
@router.get("/my-plants")
async def get_my_plants_for_ai(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """
    Returns the user's saved plants for the AI Care page dropdown.
    Each plant includes enough data to show in the dropdown and
    pre-load the AI context.
    """
    service = AICareService(db)
    plants  = service.get_user_plants(user.id)

    return {
        "plants": [
            {
                "id":           plant.id,
                "plant_name":   plant.plant_name,
                "nickname":     plant.nickname,
                "location":     plant.location,
                "photo_url":    plant.photo_url,
                "health_status": plant.health_status.value if plant.health_status else "healthy",
                "height_cm":    str(plant.height_cm) if plant.height_cm else None,
                "growth_stage": plant.growth_stage.value if plant.growth_stage else None,
                "last_watered_at": plant.last_watered_at.isoformat() if plant.last_watered_at else None,
                "next_water_due":  plant.next_water_due.isoformat()  if plant.next_water_due  else None,
                "watering_interval_days": plant.watering_interval_days,
                "user_notes":   plant.user_notes,
                "care_guide_count": len([g for g in plant.care_guides if not g.is_resolved]),
            }
            for plant in plants
        ]
    }


# ── 2. Get full plant detail for AI context panel ────────────────────
@router.get("/my-plants/{plant_id}")
async def get_plant_ai_context(
    plant_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """
    Returns full plant data + recent care logs + care guides
    for the AI Care context panel shown when a plant is selected.
    """
    plant = db.query(UserPlant).filter(
        UserPlant.id == plant_id,
        UserPlant.user_id == user.id
    ).first()

    if not plant:
        raise HTTPException(status_code=404, detail="Plant not found.")

    # Recent care logs (last 20)
    from sqlalchemy import desc
    from app.models.plant import PlantCareLog
    logs = db.query(PlantCareLog).filter(
        PlantCareLog.plant_id == plant_id
    ).order_by(desc(PlantCareLog.logged_at)).limit(20).all()

    # Active care guides (unresolved)
    guides = db.query(AiCareGuide).filter(
        AiCareGuide.plant_id == plant_id
    ).order_by(desc(AiCareGuide.created_at)).all()

    return {
        "plant": {
            "id":                   plant.id,
            "plant_name":           plant.plant_name,
            "nickname":             plant.nickname,
            "location":             plant.location,
            "photo_url":            plant.photo_url,
            "height_cm":            str(plant.height_cm) if plant.height_cm else None,
            "growth_stage":         plant.growth_stage.value if plant.growth_stage else None,
            "pot_size_cm":          plant.pot_size_cm,
            "soil_type":            plant.soil_type,
            "sunlight_exposure":    plant.sunlight_exposure.value if plant.sunlight_exposure else None,
            "health_status":        plant.health_status.value if plant.health_status else None,
            "is_pet_household":     plant.is_pet_household,
            "last_watered_at":      plant.last_watered_at.isoformat()      if plant.last_watered_at     else None,
            "next_water_due":       plant.next_water_due.isoformat()       if plant.next_water_due      else None,
            "watering_interval_days": plant.watering_interval_days,
            "last_fertilised_at":   plant.last_fertilised_at.isoformat()   if plant.last_fertilised_at  else None,
            "last_repotted_at":     plant.last_repotted_at.isoformat()     if plant.last_repotted_at    else None,
            "user_notes":           plant.user_notes,
            "added_at":             plant.added_at.isoformat(),
        },
        "care_logs": [
            {
                "id":            log.id,
                "type":          log.type.value,
                "source":        log.source,
                "care_category": log.care_category.value if log.care_category else None,
                "note":          log.note,
                "is_care_guide": log.is_care_guide,
                "logged_at":     log.logged_at.isoformat() if log.logged_at else None,
            }
            for log in logs
        ],
        "care_guides": [
            {
                "id":          guide.id,
                "category":    guide.category.value,
                "title":       guide.title,
                "content":     guide.content,
                "severity":    guide.severity,
                "is_resolved": guide.is_resolved,
                "created_by":  guide.created_by,
                "created_at":  guide.created_at.isoformat() if guide.created_at else None,
            }
            for guide in guides
        ]
    }


# ── 3. Main chat endpoint ─────────────────────────────────────────────
@router.post("/chat")
async def ai_care_chat(
    message:      str           = Form(...),
    session_uuid: Optional[str] = Form(None),
    plant_id:     Optional[int] = Form(None),   # ← NEW: selected plant ID
    photo:        Optional[UploadFile] = File(None),
    db:           Session       = Depends(get_db),
    user:         Optional[User] = Depends(get_current_user),
):
    service = AICareService(db)

    # Get or create session (linked to plant if selected)
    session = service.get_or_create_session(
        session_uuid = session_uuid,
        user         = user,
        plant_id     = plant_id,
        source       = "photo_upload" if photo else "chat",
    )

    # Fetch the selected plant (if any)
    plant = None
    if plant_id and user:
        plant = db.query(UserPlant).filter(
            UserPlant.id == plant_id,
            UserPlant.user_id == user.id
        ).first()

    # Upload photo if provided
    photo_url = None
    if photo:
        photo_url = await upload_file(
            file=photo,
            folder=f"ai-care-photos/{session.uuid}",
        )

    # Save user message
    db.add(AICareMessage(
        session_id = session.id,
        role       = "user",
        content    = message,
    ))

    # Get conversation history
    from sqlalchemy import asc
    history = db.query(AICareMessage).filter(
        AICareMessage.session_id == session.id
    ).order_by(asc(AICareMessage.created_at)).all()

    # Generate AI response
    ai_text, suggested_products, save_guide_meta = await service.generate_response(
        message   = message,
        history   = history,
        plant     = plant,
        photo_url = photo_url,
        db        = db,
    )

    # Save AI message
    db.add(AICareMessage(
        session_id = session.id,
        role       = "assistant",
        content    = ai_text,
    ))

    # Auto-save care guide if AI flagged it
    saved_guide = None
    if save_guide_meta and plant:
        guide = service.save_ai_care_guide(
            plant_id   = plant.id,
            session_id = session.id,
            ai_text    = ai_text,
            guide_meta = save_guide_meta,
        )
        saved_guide = {
            "id":       guide.id,
            "category": guide.category.value,
            "title":    guide.title,
            "severity": guide.severity,
        }

    session.message_count = len(history) + 2
    db.commit()

    return {
        "session_uuid":      str(session.uuid),
        "response":          ai_text,
        "suggested_products": suggested_products,
        "saved_guide":       saved_guide,   # non-null = care guide was auto-saved
        "plant_id":          plant_id,
    }


# ── 4. Manually save any AI message as care guide ────────────────────
@router.post("/sessions/{session_uuid}/save-guide")
async def manually_save_guide(
    session_uuid: str,
    payload: dict,
    db: Session = Depends(get_db),
    user: User  = Depends(get_current_user),
):
    """
    User clicks 'Save to Care Guide' on any AI message.
    payload: { plant_id, message_content, category, title, severity }
    """
    plant = db.query(UserPlant).filter(
        UserPlant.id      == payload["plant_id"],
        UserPlant.user_id == user.id
    ).first()

    if not plant:
        raise HTTPException(status_code=404, detail="Plant not found.")

    session = db.query(AICareSession).filter(
        AICareSession.uuid == session_uuid
    ).first()

    guide = AiCareGuide(
        plant_id   = plant.id,
        session_id = session.id if session else None,
        category   = payload.get("category", "general"),
        title      = payload.get("title", "Saved AI Advice"),
        content    = payload["message_content"],
        severity   = payload.get("severity", "info"),
        created_by = "ai",
    )
    db.add(guide)
    db.commit()

    return {
        "saved": True,
        "guide_id": guide.id,
        "message": f"Saved to {plant.nickname or plant.plant_name}'s care guide."
    }


# ── 5. Mark a care guide as resolved ────────────────────────────────
@router.patch("/care-guides/{guide_id}/resolve")
async def resolve_care_guide(
    guide_id: int,
    payload: dict,
    db: Session = Depends(get_db),
    user: User  = Depends(get_current_user),
):
    guide = db.query(AiCareGuide).join(UserPlant).filter(
        AiCareGuide.id        == guide_id,
        UserPlant.user_id     == user.id
    ).first()

    if not guide:
        raise HTTPException(status_code=404, detail="Guide not found.")

    from datetime import datetime, timezone
    guide.is_resolved   = True
    guide.resolved_at   = datetime.now(timezone.utc)
    guide.resolved_note = payload.get("note")
    db.commit()

    return {"resolved": True, "guide_id": guide_id}


# ── 6. Rate session ──────────────────────────────────────────────────
@router.post("/sessions/{session_uuid}/rate")
async def rate_session(
    session_uuid: str,
    rating: str,
    db: Session = Depends(get_db),
    user: Optional[User] = Depends(get_current_user),
):
    if rating not in ("helpful", "not_helpful"):
        raise HTTPException(status_code=400, detail="Invalid rating.")

    session = db.query(AICareSession).filter(
        AICareSession.uuid == session_uuid
    ).first()

    if not session:
        raise HTTPException(status_code=404, detail="Session not found.")

    session.rating = rating
    db.commit()
    return {"message": "Rating saved."}
```


---

## 5. Frontend — API Layer (`src/features/ai-care/api/ai-care.api.ts`)

```typescript
import { api } from "@/lib/axios";

// ── Types ─────────────────────────────────────────────────────────────

export interface UserPlantSummary {
  id:                    number;
  plantName:             string;
  nickname:              string | null;
  location:              string | null;
  photoUrl:              string | null;
  healthStatus:          "thriving" | "healthy" | "needs_attention" | "sick" | "recovering";
  heightCm:              string | null;
  growthStage:           string | null;
  lastWateredAt:         string | null;
  nextWaterDue:          string | null;
  wateringIntervalDays:  number;
  userNotes:             string | null;
  careGuideCount:        number;
}

export interface PlantDetail {
  plant: {
    id:                   number;
    plantName:            string;
    nickname:             string | null;
    location:             string | null;
    photoUrl:             string | null;
    heightCm:             string | null;
    growthStage:          string | null;
    potSizeCm:            number | null;
    soilType:             string | null;
    sunlightExposure:     string | null;
    healthStatus:         string | null;
    isPetHousehold:       boolean;
    lastWateredAt:        string | null;
    nextWaterDue:         string | null;
    wateringIntervalDays: number;
    lastFertilisedAt:     string | null;
    lastRepottedAt:       string | null;
    userNotes:            string | null;
    addedAt:              string;
  };
  careLogs:   CareLog[];
  careGuides: CareGuide[];
}

export interface CareLog {
  id:           number;
  type:         string;
  source:       "user" | "ai" | "system";
  careCategory: string | null;
  note:         string | null;
  isCareGuide:  boolean;
  loggedAt:     string | null;
}

export interface CareGuide {
  id:         number;
  category:   string;
  title:      string;
  content:    string;
  severity:   "info" | "warning" | "urgent";
  isResolved: boolean;
  createdBy:  "ai" | "user";
  createdAt:  string | null;
}

export interface ChatMessage {
  role:              "user" | "assistant";
  content:           string;
  suggestedProducts?: SuggestedProduct[];
  savedGuide?:       SavedGuide | null;
  timestamp:         Date;
}

export interface SuggestedProduct {
  uuid:        string;
  title:       string;
  price:       string;
  productType: string;
  imageUrl:    string | null;
}

export interface SavedGuide {
  id:       number;
  category: string;
  title:    string;
  severity: string;
}

// ── API functions ─────────────────────────────────────────────────────

/**
 * GET /ai-care/my-plants
 * Returns all user plants for the dropdown selector.
 */
export const getMyPlantsForAiApi = async (): Promise<{
  plants: UserPlantSummary[];
}> => {
  const res = await api.get("/ai-care/my-plants");
  // Convert snake_case → camelCase
  return {
    plants: res.data.plants.map((p: any) => ({
      id:                   p.id,
      plantName:            p.plant_name,
      nickname:             p.nickname,
      location:             p.location,
      photoUrl:             p.photo_url,
      healthStatus:         p.health_status,
      heightCm:             p.height_cm,
      growthStage:          p.growth_stage,
      lastWateredAt:        p.last_watered_at,
      nextWaterDue:         p.next_water_due,
      wateringIntervalDays: p.watering_interval_days,
      userNotes:            p.user_notes,
      careGuideCount:       p.care_guide_count,
    })),
  };
};

/**
 * GET /ai-care/my-plants/{id}
 * Returns full plant detail + care logs + care guides
 * for the context panel when a plant is selected.
 */
export const getPlantAiContextApi = async (
  plantId: number
): Promise<PlantDetail> => {
  const res = await api.get(`/ai-care/my-plants/${plantId}`);
  const d = res.data;
  return {
    plant: {
      id:                   d.plant.id,
      plantName:            d.plant.plant_name,
      nickname:             d.plant.nickname,
      location:             d.plant.location,
      photoUrl:             d.plant.photo_url,
      heightCm:             d.plant.height_cm,
      growthStage:          d.plant.growth_stage,
      potSizeCm:            d.plant.pot_size_cm,
      soilType:             d.plant.soil_type,
      sunlightExposure:     d.plant.sunlight_exposure,
      healthStatus:         d.plant.health_status,
      isPetHousehold:       d.plant.is_pet_household,
      lastWateredAt:        d.plant.last_watered_at,
      nextWaterDue:         d.plant.next_water_due,
      wateringIntervalDays: d.plant.watering_interval_days,
      lastFertilisedAt:     d.plant.last_fertilised_at,
      lastRepottedAt:       d.plant.last_repotted_at,
      userNotes:            d.plant.user_notes,
      addedAt:              d.plant.added_at,
    },
    careLogs:   d.care_logs.map((l: any) => ({
      id:           l.id,
      type:         l.type,
      source:       l.source,
      careCategory: l.care_category,
      note:         l.note,
      isCareGuide:  l.is_care_guide,
      loggedAt:     l.logged_at,
    })),
    careGuides: d.care_guides.map((g: any) => ({
      id:         g.id,
      category:   g.category,
      title:      g.title,
      content:    g.content,
      severity:   g.severity,
      isResolved: g.is_resolved,
      createdBy:  g.created_by,
      createdAt:  g.created_at,
    })),
  };
};

/**
 * POST /ai-care/chat
 * Send a message to the AI, optionally with a selected plant and photo.
 */
export const aiCareChatApi = async (data: {
  message:     string;
  sessionUuid: string | null;
  plantId:     number | null;
  photo?:      File;
}): Promise<{
  sessionUuid:       string;
  response:          string;
  suggestedProducts: SuggestedProduct[];
  savedGuide:        SavedGuide | null;
  plantId:           number | null;
}> => {
  const form = new FormData();
  form.append("message", data.message);
  if (data.sessionUuid) form.append("session_uuid", data.sessionUuid);
  if (data.plantId)     form.append("plant_id",     String(data.plantId));
  if (data.photo)       form.append("photo",        data.photo);

  const res = await api.post("/ai-care/chat", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return {
    sessionUuid:       res.data.session_uuid,
    response:          res.data.response,
    suggestedProducts: (res.data.suggested_products ?? []).map((p: any) => ({
      uuid:        p.uuid,
      title:       p.title,
      price:       p.price,
      productType: p.product_type,
      imageUrl:    p.image_url,
    })),
    savedGuide: res.data.saved_guide ?? null,
    plantId:    res.data.plant_id ?? null,
  };
};

/**
 * POST /ai-care/sessions/{uuid}/save-guide
 * Manually save any AI message to the plant's care guide.
 */
export const saveAiGuideApi = async (
  sessionUuid: string,
  data: {
    plantId:        number;
    messageContent: string;
    category:       string;
    title:          string;
    severity:       string;
  }
): Promise<{ saved: boolean; guideId: number; message: string }> => {
  const res = await api.post(
    `/ai-care/sessions/${sessionUuid}/save-guide`,
    {
      plant_id:        data.plantId,
      message_content: data.messageContent,
      category:        data.category,
      title:           data.title,
      severity:        data.severity,
    }
  );
  return {
    saved:    res.data.saved,
    guideId:  res.data.guide_id,
    message:  res.data.message,
  };
};

/**
 * PATCH /ai-care/care-guides/{id}/resolve
 * Mark a care guide entry as resolved.
 */
export const resolveCareGuideApi = async (
  guideId: number,
  note?: string
): Promise<{ resolved: boolean }> => {
  const res = await api.patch(`/ai-care/care-guides/${guideId}/resolve`, {
    note,
  });
  return res.data;
};

/**
 * POST /ai-care/sessions/{uuid}/rate
 * Rate the AI session as helpful or not.
 */
export const rateAiSessionApi = async (
  sessionUuid: string,
  rating: "helpful" | "not_helpful"
): Promise<void> => {
  await api.post(`/ai-care/sessions/${sessionUuid}/rate`, { rating });
};
```

---

## 6. Frontend — Custom Hooks (`src/features/ai-care/hooks/useAiCare.ts`)

```typescript
"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useCallback, useRef } from "react";
import {
  getMyPlantsForAiApi,
  getPlantAiContextApi,
  aiCareChatApi,
  saveAiGuideApi,
  resolveCareGuideApi,
  rateAiSessionApi,
  ChatMessage,
  UserPlantSummary,
  CareGuide,
} from "../api/ai-care.api";

// ── 1. Plants dropdown hook ───────────────────────────────────────────
export function useMyPlantsForAi() {
  return useQuery({
    queryKey: ["ai-care-plants"],
    queryFn:  getMyPlantsForAiApi,
    staleTime: 2 * 60 * 1000,
    select: (data) => data.plants,
  });
}

// ── 2. Plant context hook (fires when plant selected) ─────────────────
export function usePlantAiContext(plantId: number | null) {
  return useQuery({
    queryKey: ["ai-care-plant-context", plantId],
    queryFn:  () => getPlantAiContextApi(plantId!),
    enabled:  !!plantId,
    staleTime: 60 * 1000,
  });
}

// ── 3. Main AI chat hook ──────────────────────────────────────────────
export function useAiCareChat() {
  const qc = useQueryClient();

  // Chat state
  const [sessionUuid,     setSessionUuid]     = useState<string | null>(null);
  const [selectedPlantId, setSelectedPlantId] = useState<number | null>(null);
  const [messages,        setMessages]        = useState<ChatMessage[]>([]);
  const [isTyping,        setIsTyping]        = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new message
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }, []);

  // Select a plant — resets chat for new context
  const selectPlant = useCallback(
    (plant: UserPlantSummary | null) => {
      setSelectedPlantId(plant?.id ?? null);
      setSessionUuid(null);      // new session per plant selection
      setMessages([]);           // clear chat history
      if (plant) {
        // Add a system-style greeting message
        setMessages([
          {
            role:      "assistant",
            content:   `Hi! I can see you've selected **${plant.nickname || plant.plantName}** 🌿\n\nI have full access to its care history, notes, and health status. What would you like to know?`,
            timestamp: new Date(),
          },
        ]);
      }
    },
    []
  );

  // Send a message
  const sendMutation = useMutation({
    mutationFn: (data: { message: string; photo?: File }) =>
      aiCareChatApi({
        message:     data.message,
        sessionUuid: sessionUuid,
        plantId:     selectedPlantId,
        photo:       data.photo,
      }),

    onMutate: ({ message }) => {
      // Immediately show user message
      setMessages((prev) => [
        ...prev,
        { role: "user", content: message, timestamp: new Date() },
      ]);
      setIsTyping(true);
      scrollToBottom();
    },

    onSuccess: (data) => {
      // Save session UUID from first response
      if (!sessionUuid) setSessionUuid(data.sessionUuid);

      // Add AI response
      setMessages((prev) => [
        ...prev,
        {
          role:              "assistant",
          content:           data.response,
          suggestedProducts: data.suggestedProducts,
          savedGuide:        data.savedGuide,
          timestamp:         new Date(),
        },
      ]);

      // If care guide was auto-saved, refresh plant context
      if (data.savedGuide && selectedPlantId) {
        qc.invalidateQueries({
          queryKey: ["ai-care-plant-context", selectedPlantId],
        });
      }

      setIsTyping(false);
      scrollToBottom();
    },

    onError: () => {
      setMessages((prev) => [
        ...prev,
        {
          role:      "assistant",
          content:   "Sorry, something went wrong. Please try again.",
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    },
  });

  // Manually save a message to care guide
  const saveGuideMutation = useMutation({
    mutationFn: (data: {
      messageContent: string;
      category:       string;
      title:          string;
      severity:       string;
    }) => {
      if (!sessionUuid || !selectedPlantId) {
        throw new Error("No active session or plant selected.");
      }
      return saveAiGuideApi(sessionUuid, {
        plantId:        selectedPlantId,
        messageContent: data.messageContent,
        category:       data.category,
        title:          data.title,
        severity:       data.severity,
      });
    },
    onSuccess: () => {
      // Refresh care guides in context panel
      if (selectedPlantId) {
        qc.invalidateQueries({
          queryKey: ["ai-care-plant-context", selectedPlantId],
        });
      }
    },
  });

  // Rate session
  const rateMutation = useMutation({
    mutationFn: (rating: "helpful" | "not_helpful") => {
      if (!sessionUuid) throw new Error("No active session.");
      return rateAiSessionApi(sessionUuid, rating);
    },
  });

  return {
    // State
    sessionUuid,
    selectedPlantId,
    messages,
    isTyping,
    bottomRef,

    // Actions
    selectPlant,
    sendMessage:    (message: string, photo?: File) =>
                      sendMutation.mutate({ message, photo }),
    saveToGuide:    saveGuideMutation.mutate,
    rateSession:    rateMutation.mutate,

    // Loading states
    isSending:      sendMutation.isPending,
    isSavingGuide:  saveGuideMutation.isPending,

    // Errors
    sendError:      sendMutation.error,
    saveGuideSuccess: saveGuideMutation.isSuccess,
  };
}

// ── 4. Resolve care guide hook ────────────────────────────────────────
export function useResolveCareGuide(plantId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ guideId, note }: { guideId: number; note?: string }) =>
      resolveCareGuideApi(guideId, note),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["ai-care-plant-context", plantId],
      });
    },
  });
}
```

---

## 7. Frontend — AI Care Page (`src/app/(storefront)/ai-care/page.tsx`)

```typescript
"use client";
import { useState, useRef } from "react";
import { useMyPlantsForAi, usePlantAiContext, useAiCareChat, useResolveCareGuide } from "@/features/ai-care/hooks/useAiCare";
import { UserPlantSummary, ChatMessage, CareGuide } from "@/features/ai-care/api/ai-care.api";

export default function AiCarePage() {
  const { data: plants = [], isLoading: plantsLoading } = useMyPlantsForAi();
  const {
    selectedPlantId, messages, isTyping, bottomRef,
    selectPlant, sendMessage, saveToGuide, rateSession,
    isSending, saveGuideSuccess,
  } = useAiCareChat();

  const { data: plantContext, isLoading: contextLoading } =
    usePlantAiContext(selectedPlantId);

  const [input,        setInput]        = useState("");
  const [photo,        setPhoto]        = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [activeTab,    setActiveTab]    = useState<"chat" | "guides" | "logs">("chat");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!input.trim() && !photo) return;
    sendMessage(input.trim(), photo ?? undefined);
    setInput("");
    setPhoto(null);
    setPhotoPreview(null);
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  return (
    <div className="min-h-screen bg-[#fefcf9]">
      {/* Page header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <h1 className="text-2xl font-extrabold text-[#1c1c1c]">
          🌿 AI Plant Care
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Ask anything about your plants — personalised advice based on their
          actual care history.
        </p>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6 h-[calc(100vh-96px)]">

        {/* ── LEFT: Plant selector + context panel ──────────────────── */}
        <aside className="w-72 flex-shrink-0 flex flex-col gap-4">

          {/* Plant dropdown */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <label
              htmlFor="plant-select"
              className="block text-xs font-700 text-gray-500 uppercase
                         tracking-wider mb-2"
            >
              Select your plant
            </label>

            {plantsLoading ? (
              <div className="h-11 bg-gray-100 rounded-lg animate-pulse" />
            ) : plants.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">No plants saved yet.</p>
                <a
                  href="/account/plants"
                  className="text-sm font-semibold text-[#00b566] mt-1 block"
                >
                  + Add a plant →
                </a>
              </div>
            ) : (
              <select
                id="plant-select"
                aria-label="Select your plant for AI care advice"
                className="w-full h-11 px-3 border border-gray-200 rounded-lg
                           text-sm font-medium text-[#1c1c1c] bg-white
                           focus:outline-none focus:border-[#00b566]
                           focus:ring-2 focus:ring-[#00b566]/20"
                value={selectedPlantId ?? ""}
                onChange={(e) => {
                  const id = Number(e.target.value);
                  const plant = plants.find((p) => p.id === id) ?? null;
                  selectPlant(plant);
                  setActiveTab("chat");
                }}
              >
                <option value="">— Choose a plant —</option>
                {plants.map((plant) => (
                  <option key={plant.id} value={plant.id}>
                    {plant.nickname
                      ? `${plant.nickname} (${plant.plantName})`
                      : plant.plantName}
                    {plant.careGuideCount > 0
                      ? ` · ${plant.careGuideCount} guide${plant.careGuideCount > 1 ? "s" : ""}`
                      : ""}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Plant context panel (shows after selection) */}
          {selectedPlantId && (
            <div className="bg-white rounded-2xl border border-gray-100
                            shadow-sm flex-1 overflow-hidden flex flex-col">

              {/* Tabs */}
              <div
                className="flex border-b border-gray-100"
                role="tablist"
                aria-label="Plant information tabs"
              >
                {(["chat","guides","logs"] as const).map((tab) => (
                  <button
                    key={tab}
                    role="tab"
                    aria-selected={activeTab === tab}
                    aria-controls={`tab-panel-${tab}`}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-2.5 text-xs font-600 capitalize
                      transition-colors ${
                        activeTab === tab
                          ? "text-[#00b566] border-b-2 border-[#00b566]"
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                  >
                    {tab === "guides" && plantContext?.careGuides?.filter(g => !g.isResolved).length
                      ? `Guides (${plantContext.careGuides.filter(g => !g.isResolved).length})`
                      : tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Tab panels */}
              <div className="flex-1 overflow-y-auto p-4">

                {/* Plant info tab */}
                {activeTab === "chat" && plantContext && (
                  <PlantInfoPanel plant={plantContext.plant} />
                )}
                {activeTab === "chat" && contextLoading && (
                  <PlantInfoSkeleton />
                )}

                {/* Care guides tab */}
                {activeTab === "guides" && plantContext && (
                  <CareGuidesPanel
                    guides={plantContext.careGuides}
                    plantId={selectedPlantId}
                  />
                )}

                {/* Care logs tab */}
                {activeTab === "logs" && plantContext && (
                  <CareLogsPanel logs={plantContext.careLogs} />
                )}
              </div>
            </div>
          )}
        </aside>

        {/* ── RIGHT: Chat interface ─────────────────────────────────── */}
        <main
          className="flex-1 bg-white rounded-2xl border border-gray-100
                     shadow-sm flex flex-col overflow-hidden"
          aria-label="AI Care chat"
        >
          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto px-5 py-5 space-y-4"
            role="log"
            aria-label="Chat messages"
            aria-live="polite"
          >
            {messages.length === 0 && !selectedPlantId && (
              <EmptyChatState plants={plants} onSelectPlant={selectPlant} />
            )}

            {messages.map((msg, i) => (
              <MessageBubble
                key={i}
                message={msg}
                sessionUuid={null}
                selectedPlantId={selectedPlantId}
                onSaveGuide={saveToGuide}
                isSavingGuide={false}
              />
            ))}

            {isTyping && <TypingIndicator />}
            <div ref={bottomRef} aria-hidden="true" />
          </div>

          {/* Photo preview */}
          {photoPreview && (
            <div className="px-5 pb-2 flex items-center gap-2">
              <img
                src={photoPreview}
                alt="Selected photo preview"
                className="w-16 h-16 rounded-lg object-cover border border-gray-200"
              />
              <button
                onClick={() => { setPhoto(null); setPhotoPreview(null); }}
                className="text-xs text-red-500 font-semibold"
                aria-label="Remove selected photo"
              >
                Remove
              </button>
            </div>
          )}

          {/* Input bar */}
          <div className="border-t border-gray-100 px-4 py-3">
            {!selectedPlantId && plants.length > 0 && (
              <p
                className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3
                           py-2 mb-2 font-medium"
                role="status"
                aria-live="polite"
              >
                💡 Select a plant above for personalised advice
              </p>
            )}
            <div className="flex items-end gap-2">
              {/* Photo upload */}
              <button
                onClick={() => fileRef.current?.click()}
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center
                           rounded-xl bg-gray-50 border border-gray-200 text-gray-400
                           hover:bg-[#00b566]/10 hover:border-[#00b566]/30
                           hover:text-[#00b566] transition-colors"
                aria-label="Upload a photo of your plant"
              >
                📷
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                aria-hidden="true"
                onChange={handlePhotoSelect}
              />

              {/* Text input */}
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={
                  selectedPlantId
                    ? "Ask about your plant's care, health, growth..."
                    : "Ask anything about plant care..."
                }
                rows={1}
                className="flex-1 resize-none border border-gray-200 rounded-xl
                           px-4 py-2.5 text-sm text-[#1c1c1c] placeholder-gray-400
                           focus:outline-none focus:border-[#00b566]
                           focus:ring-2 focus:ring-[#00b566]/20
                           max-h-32 overflow-y-auto"
                aria-label="Type your plant care question"
              />

              {/* Send button */}
              <button
                onClick={handleSend}
                disabled={isSending || (!input.trim() && !photo)}
                aria-label="Send message"
                aria-busy={isSending}
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center
                           rounded-xl bg-[#00b566] text-white font-bold text-lg
                           hover:bg-[#009959] disabled:opacity-40
                           disabled:cursor-not-allowed transition-all
                           focus-visible:outline focus-visible:outline-2
                           focus-visible:outline-[#00b566]"
              >
                {isSending ? "⏳" : "↑"}
              </button>
            </div>

            {/* Rating (shows after 3+ messages) */}
            {messages.length >= 3 && (
              <div className="flex items-center gap-2 mt-2 justify-end">
                <span className="text-xs text-gray-400">Was this helpful?</span>
                <button
                  onClick={() => rateSession("helpful")}
                  className="text-xs px-2 py-1 rounded-full bg-green-50
                             text-green-600 hover:bg-green-100 transition-colors"
                  aria-label="Rate as helpful"
                >
                  👍
                </button>
                <button
                  onClick={() => rateSession("not_helpful")}
                  className="text-xs px-2 py-1 rounded-full bg-red-50
                             text-red-500 hover:bg-red-100 transition-colors"
                  aria-label="Rate as not helpful"
                >
                  👎
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
```

---

## 8. Supporting UI Components

### 8.1 MessageBubble Component

```typescript
// src/features/ai-care/components/MessageBubble.tsx
"use client";
import { useState } from "react";
import { ChatMessage } from "../api/ai-care.api";

interface Props {
  message:         ChatMessage;
  sessionUuid:     string | null;
  selectedPlantId: number | null;
  onSaveGuide:     (data: any) => void;
  isSavingGuide:   boolean;
}

export function MessageBubble({
  message, sessionUuid, selectedPlantId, onSaveGuide, isSavingGuide
}: Props) {
  const isUser  = message.role === "user";
  const [showSaveMenu, setShowSaveMenu] = useState(false);
  const [saveSuccess,  setSaveSuccess]  = useState(false);

  const handleSaveGuide = (category: string) => {
    onSaveGuide({
      messageContent: message.content,
      category,
      title:    `AI advice — ${category}`,
      severity: "info",
    });
    setSaveSuccess(true);
    setShowSaveMenu(false);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} gap-3`}>
      {/* AI avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-[#00b566]/10 flex items-center
                        justify-center flex-shrink-0 text-base">
          🌿
        </div>
      )}

      <div className={`max-w-[78%] group`}>
        {/* Bubble */}
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed
            ${isUser
              ? "bg-[#00b566] text-white rounded-br-sm"
              : "bg-gray-50 text-[#1c1c1c] rounded-bl-sm border border-gray-100"
            }`}
        >
          {/* Parse markdown-style bold */}
          <FormattedMessage content={message.content} />
        </div>

        {/* Timestamp */}
        <p className={`text-[10px] text-gray-400 mt-1
          ${isUser ? "text-right" : "text-left"}`}>
          {message.timestamp.toLocaleTimeString("en-IN", {
            hour: "2-digit", minute: "2-digit"
          })}
        </p>

        {/* AI message actions */}
        {!isUser && (
          <div className="flex items-center gap-2 mt-1.5 opacity-0
                          group-hover:opacity-100 transition-opacity">

            {/* Auto-saved badge */}
            {message.savedGuide && (
              <span className="text-xs bg-green-50 text-green-600 border
                               border-green-200 rounded-full px-2 py-0.5 font-medium">
                ✓ Saved to care guide
              </span>
            )}

            {/* Manual save button */}
            {!message.savedGuide && selectedPlantId && (
              <div className="relative">
                <button
                  onClick={() => setShowSaveMenu(!showSaveMenu)}
                  className="text-xs text-gray-400 hover:text-[#00b566]
                             border border-gray-200 rounded-full px-2 py-0.5
                             transition-colors hover:border-[#00b566]/30"
                  aria-label="Save this advice to plant care guide"
                >
                  {saveSuccess ? "✓ Saved!" : "💾 Save to guide"}
                </button>

                {/* Category picker dropdown */}
                {showSaveMenu && (
                  <div className="absolute bottom-8 left-0 bg-white border
                                  border-gray-200 rounded-xl shadow-lg p-2
                                  min-w-[160px] z-10">
                    {[
                      { value: "disease",     label: "🦠 Disease" },
                      { value: "pest",        label: "🐛 Pest" },
                      { value: "watering",    label: "💧 Watering" },
                      { value: "fertilising", label: "🌱 Fertilising" },
                      { value: "repotting",   label: "🪴 Repotting" },
                      { value: "light",       label: "☀️ Light" },
                      { value: "general",     label: "📝 General" },
                    ].map((cat) => (
                      <button
                        key={cat.value}
                        onClick={() => handleSaveGuide(cat.value)}
                        className="w-full text-left text-xs px-3 py-2 rounded-lg
                                   hover:bg-[#00b566]/10 text-[#1c1c1c]
                                   transition-colors"
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Suggested products */}
        {!isUser && message.suggestedProducts && message.suggestedProducts.length > 0 && (
          <div className="mt-3 flex gap-2 flex-wrap">
            {message.suggestedProducts.map((product) => (
              <a
                key={product.uuid}
                href={`/plants/${product.uuid}`}
                className="flex items-center gap-2 bg-white border border-gray-200
                           rounded-xl px-3 py-2 text-xs font-medium text-[#1c1c1c]
                           hover:border-[#00b566]/40 hover:bg-[#00b566]/5
                           transition-colors"
                aria-label={`View ${product.title} — ₹${product.price}`}
              >
                {product.imageUrl && (
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                )}
                <div>
                  <p className="font-semibold">{product.title}</p>
                  <p className="text-[#00b566]">₹{product.price}</p>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* User avatar */}
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-[#00b566] flex items-center
                        justify-center flex-shrink-0 text-white text-xs font-bold">
          You
        </div>
      )}
    </div>
  );
}

function FormattedMessage({ content }: { content: string }) {
  // Parse **bold** and newlines
  const parts = content.split(/(\*\*[^*]+\*\*|\n)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        if (part === "\n") return <br key={i} />;
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
```

### 8.2 PlantInfoPanel Component

```typescript
// src/features/ai-care/components/PlantInfoPanel.tsx
interface Props {
  plant: PlantDetail["plant"];
}

const HEALTH_COLOURS: Record<string, string> = {
  thriving:        "text-green-600 bg-green-50",
  healthy:         "text-green-500 bg-green-50",
  needs_attention: "text-amber-600 bg-amber-50",
  sick:            "text-red-500 bg-red-50",
  recovering:      "text-blue-500 bg-blue-50",
};

const HEALTH_ICONS: Record<string, string> = {
  thriving: "🌟", healthy: "✅", needs_attention: "⚠️",
  sick: "🤒", recovering: "💪",
};

export function PlantInfoPanel({ plant }: Props) {
  const waterDue = plant.nextWaterDue
    ? new Date(plant.nextWaterDue)
    : null;
  const waterStatus = waterDue
    ? (() => {
        const days = Math.round(
          (waterDue.getTime() - Date.now()) / 86400000
        );
        if (days < 0)  return { label: `Overdue ${Math.abs(days)}d`, colour: "text-red-500" };
        if (days === 0) return { label: "Due today",   colour: "text-amber-600" };
        return           { label: `In ${days} day${days > 1 ? "s" : ""}`, colour: "text-green-600" };
      })()
    : null;

  const infoRows = [
    { icon: "📍", label: "Location",     value: plant.location },
    { icon: "📏", label: "Height",       value: plant.heightCm ? `${plant.heightCm} cm` : null },
    { icon: "🌱", label: "Growth stage", value: plant.growthStage?.replace("_", " ") },
    { icon: "🪴", label: "Pot size",     value: plant.potSizeCm ? `${plant.potSizeCm} cm` : null },
    { icon: "🌍", label: "Soil",         value: plant.soilType },
    { icon: "☀️", label: "Sunlight",     value: plant.sunlightExposure?.replace(/_/g, " ") },
    { icon: "💧", label: "Next water",   value: waterStatus?.label,
      colour: waterStatus?.colour },
    { icon: "🌿", label: "Fertilised",   value: plant.lastFertilisedAt
        ? new Date(plant.lastFertilisedAt).toLocaleDateString("en-IN") : "Not recorded" },
  ].filter((r) => r.value);

  return (
    <div className="space-y-3">
      {/* Plant photo + name */}
      <div className="flex items-center gap-3">
        {plant.photoUrl ? (
          <img src={plant.photoUrl} alt={plant.plantName}
            className="w-14 h-14 rounded-xl object-cover" />
        ) : (
          <div className="w-14 h-14 rounded-xl bg-[#00b566]/10 flex
                          items-center justify-center text-2xl">🌿</div>
        )}
        <div>
          <p className="font-bold text-[#1c1c1c] text-sm">
            {plant.nickname || plant.plantName}
          </p>
          {plant.nickname && (
            <p className="text-xs text-gray-400">{plant.plantName}</p>
          )}
          {plant.healthStatus && (
            <span className={`inline-flex items-center gap-1 text-xs
              font-semibold rounded-full px-2 py-0.5 mt-1
              ${HEALTH_COLOURS[plant.healthStatus] ?? ""}`}>
              {HEALTH_ICONS[plant.healthStatus]} {plant.healthStatus.replace("_", " ")}
            </span>
          )}
        </div>
      </div>

      {/* Info rows */}
      <div className="space-y-1.5">
        {infoRows.map((row) => (
          <div key={row.label} className="flex items-center gap-2 text-xs">
            <span aria-hidden="true">{row.icon}</span>
            <span className="text-gray-400 w-20 flex-shrink-0">{row.label}</span>
            <span className={`font-medium text-[#1c1c1c] capitalize ${row.colour ?? ""}`}>
              {row.value}
            </span>
          </div>
        ))}
      </div>

      {/* User notes */}
      {plant.userNotes && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
          <p className="text-xs font-semibold text-amber-700 mb-1">📝 Your notes</p>
          <p className="text-xs text-amber-800 leading-relaxed">{plant.userNotes}</p>
        </div>
      )}
    </div>
  );
}
```

### 8.3 CareGuidesPanel Component

```typescript
// src/features/ai-care/components/CareGuidesPanel.tsx
import { useResolveCareGuide } from "../hooks/useAiCare";
import { CareGuide } from "../api/ai-care.api";

const SEVERITY_STYLES: Record<string, string> = {
  info:    "border-blue-200 bg-blue-50",
  warning: "border-amber-200 bg-amber-50",
  urgent:  "border-red-200 bg-red-50",
};
const SEVERITY_BADGE: Record<string, string> = {
  info:    "bg-blue-100 text-blue-700",
  warning: "bg-amber-100 text-amber-700",
  urgent:  "bg-red-100 text-red-600",
};
const CATEGORY_ICONS: Record<string, string> = {
  disease: "🦠", pest: "🐛", watering: "💧",
  fertilising: "🌱", repotting: "🪴", pruning: "✂️",
  light: "☀️", temperature: "🌡️", general: "📝",
};

export function CareGuidesPanel({
  guides,
  plantId,
}: {
  guides:  CareGuide[];
  plantId: number;
}) {
  const resolve  = useResolveCareGuide(plantId);
  const active   = guides.filter((g) => !g.isResolved);
  const resolved = guides.filter((g) => g.isResolved);

  if (guides.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-2xl mb-2">📋</p>
        <p className="text-sm font-semibold text-gray-600">No care guides yet</p>
        <p className="text-xs text-gray-400 mt-1">
          Ask the AI about your plant's health and save its advice here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {active.length > 0 && (
        <>
          <p className="text-xs font-700 text-gray-500 uppercase tracking-wider">
            Active ({active.length})
          </p>
          {active.map((guide) => (
            <GuideCard
              key={guide.id}
              guide={guide}
              onResolve={(note) =>
                resolve.mutate({ guideId: guide.id, note })
              }
              isResolving={resolve.isPending}
            />
          ))}
        </>
      )}

      {resolved.length > 0 && (
        <>
          <p className="text-xs font-700 text-gray-400 uppercase tracking-wider mt-4">
            Resolved ({resolved.length})
          </p>
          {resolved.map((guide) => (
            <GuideCard key={guide.id} guide={guide} resolved />
          ))}
        </>
      )}
    </div>
  );
}

function GuideCard({
  guide, onResolve, isResolving, resolved = false,
}: {
  guide:       CareGuide;
  onResolve?:  (note?: string) => void;
  isResolving?: boolean;
  resolved?:   boolean;
}) {
  const [expanded,   setExpanded]   = useState(false);
  const [resolving,  setResolving]  = useState(false);
  const [resolveNote, setResolveNote] = useState("");

  return (
    <div className={`border rounded-xl overflow-hidden
      ${resolved ? "opacity-60 border-gray-200 bg-gray-50"
                 : SEVERITY_STYLES[guide.severity] ?? "border-gray-200 bg-gray-50"}`}>

      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 px-3 py-2.5 text-left"
        aria-expanded={expanded}
      >
        <span className="text-base" aria-hidden="true">
          {CATEGORY_ICONS[guide.category] ?? "📝"}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-[#1c1c1c] truncate">
            {guide.title}
          </p>
          <p className="text-[10px] text-gray-400 capitalize">
            {guide.category} · {guide.createdBy === "ai" ? "🤖 AI" : "✍️ You"}
            {guide.createdAt
              ? ` · ${new Date(guide.createdAt).toLocaleDateString("en-IN")}`
              : ""}
          </p>
        </div>
        {!resolved && (
          <span className={`text-[10px] font-700 px-2 py-0.5 rounded-full
            ${SEVERITY_BADGE[guide.severity] ?? ""}`}>
            {guide.severity}
          </span>
        )}
        {resolved && (
          <span className="text-[10px] text-green-600 font-600">✓ Resolved</span>
        )}
        <span className="text-gray-400 text-xs ml-1">
          {expanded ? "▲" : "▼"}
        </span>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-3 pb-3 border-t border-white/60">
          <p className="text-xs text-[#1c1c1c] leading-relaxed mt-2 whitespace-pre-wrap">
            {guide.content}
          </p>

          {/* Resolve controls */}
          {!resolved && onResolve && (
            <div className="mt-3">
              {!resolving ? (
                <button
                  onClick={() => setResolving(true)}
                  className="text-xs text-green-600 font-semibold border
                             border-green-200 rounded-full px-3 py-1
                             hover:bg-green-50 transition-colors"
                >
                  ✓ Mark as resolved
                </button>
              ) : (
                <div className="space-y-2">
                  <textarea
                    value={resolveNote}
                    onChange={(e) => setResolveNote(e.target.value)}
                    placeholder="Optional: how did you resolve this? (e.g. Treated with neem oil)"
                    rows={2}
                    className="w-full text-xs border border-gray-200 rounded-lg
                               px-3 py-2 resize-none focus:outline-none
                               focus:border-[#00b566]"
                    aria-label="Resolution note (optional)"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => onResolve(resolveNote || undefined)}
                      disabled={isResolving}
                      className="text-xs bg-green-600 text-white rounded-full
                                 px-3 py-1 font-semibold hover:bg-green-700
                                 disabled:opacity-50 transition-colors"
                    >
                      {isResolving ? "Saving…" : "Confirm"}
                    </button>
                    <button
                      onClick={() => setResolving(false)}
                      className="text-xs text-gray-400 hover:text-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

### 8.4 TypingIndicator & EmptyChatState

```typescript
// src/features/ai-care/components/TypingIndicator.tsx
export function TypingIndicator() {
  return (
    <div className="flex items-center gap-3" aria-label="AI is typing" role="status">
      <div className="w-8 h-8 rounded-full bg-[#00b566]/10 flex items-center
                      justify-center text-base">🌿</div>
      <div className="bg-gray-50 border border-gray-100 rounded-2xl
                      rounded-bl-sm px-4 py-3 flex gap-1 items-center">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 bg-[#00b566] rounded-full animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  );
}

// src/features/ai-care/components/EmptyChatState.tsx
export function EmptyChatState({
  plants,
  onSelectPlant,
}: {
  plants:         UserPlantSummary[];
  onSelectPlant:  (p: UserPlantSummary) => void;
}) {
  const quickPrompts = [
    "Why are my plant's leaves turning yellow?",
    "How often should I water my Monstera?",
    "Best fertiliser for indoor plants?",
    "How do I identify root rot?",
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full
                    text-center px-8 py-12">
      <div className="text-5xl mb-4">🌿</div>
      <h2 className="text-lg font-bold text-[#1c1c1c] mb-2">
        AI Plant Care Assistant
      </h2>
      <p className="text-sm text-gray-500 mb-6 max-w-sm leading-relaxed">
        {plants.length > 0
          ? "Select one of your plants from the panel to get personalised advice, or ask a general question."
          : "Add plants to your profile to get personalised care advice based on their specific health and history."}
      </p>

      {/* Quick prompts */}
      <div className="space-y-2 w-full max-w-sm">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Quick questions
        </p>
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            className="w-full text-left text-sm bg-gray-50 border border-gray-200
                       rounded-xl px-4 py-3 text-[#1c1c1c] hover:bg-[#00b566]/5
                       hover:border-[#00b566]/30 transition-colors"
            onClick={() => {
              // Fill input with this prompt
              const textarea = document.querySelector(
                "textarea[aria-label='Type your plant care question']"
              ) as HTMLTextAreaElement;
              if (textarea) {
                textarea.value = prompt;
                textarea.focus();
                textarea.dispatchEvent(new Event("input", { bubbles: true }));
              }
            }}
          >
            {prompt}
          </button>
        ))}
      </div>

      {plants.length === 0 && (
        <a
          href="/account/plants"
          className="mt-6 inline-flex items-center gap-2 bg-[#00b566] text-white
                     text-sm font-semibold rounded-full px-5 py-2.5
                     hover:bg-[#009959] transition-colors"
        >
          + Add your first plant
        </a>
      )}
    </div>
  );
}
```


---

## 9. Profile Page — Add / Edit Plant Form

> This is where users add their plants with all the details that feed the AI context. The form in `src/app/(storefront)/account/plants/` needs to be updated to collect the new fields.

### 9.1 Plant API (`src/features/customer/api/plants.api.ts`)

```typescript
import { api } from "@/lib/axios";

export interface PlantPayload {
  plantName:            string;
  nickname?:            string;
  location?:            string;
  addedAt:              string;          // "YYYY-MM-DD"
  heightCm?:            number;
  growthStage?:         string;
  potSizeCm?:           number;
  soilType?:            string;
  sunlightExposure?:    string;
  healthStatus?:        string;
  isPetHousehold?:      boolean;
  lastWateredAt?:       string;
  wateringIntervalDays?: number;
  lastFertilisedAt?:    string;
  lastRepottedAt?:      string;
  userNotes?:           string;
  productId?:           number;          // linked store product
  photo?:               File;
}

export const getMyPlantsApi = async () => {
  const res = await api.get("/customers/me/plants");
  return res.data;
};

export const addPlantApi = async (data: PlantPayload) => {
  const form = new FormData();
  form.append("plant_name",              data.plantName);
  if (data.nickname)            form.append("nickname",              data.nickname);
  if (data.location)            form.append("location",              data.location);
  form.append("added_at",                data.addedAt);
  if (data.heightCm)            form.append("height_cm",             String(data.heightCm));
  if (data.growthStage)         form.append("growth_stage",          data.growthStage);
  if (data.potSizeCm)           form.append("pot_size_cm",           String(data.potSizeCm));
  if (data.soilType)            form.append("soil_type",             data.soilType);
  if (data.sunlightExposure)    form.append("sunlight_exposure",     data.sunlightExposure);
  if (data.healthStatus)        form.append("health_status",         data.healthStatus);
  form.append("is_pet_household",        String(data.isPetHousehold ?? false));
  if (data.lastWateredAt)       form.append("last_watered_at",       data.lastWateredAt);
  if (data.wateringIntervalDays) form.append("watering_interval_days", String(data.wateringIntervalDays));
  if (data.lastFertilisedAt)    form.append("last_fertilised_at",    data.lastFertilisedAt);
  if (data.lastRepottedAt)      form.append("last_repotted_at",      data.lastRepottedAt);
  if (data.userNotes)           form.append("user_notes",            data.userNotes);
  if (data.productId)           form.append("product_id",            String(data.productId));
  if (data.photo)               form.append("photo",                 data.photo);

  const res = await api.post("/customers/me/plants", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updatePlantApi = async (
  plantId: number,
  data: Partial<PlantPayload>
) => {
  const form = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    const snakeKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
    if (value instanceof File) {
      form.append(snakeKey, value);
    } else {
      form.append(snakeKey, String(value));
    }
  });
  const res = await api.patch(`/customers/me/plants/${plantId}`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deletePlantApi = async (plantId: number) => {
  const res = await api.delete(`/customers/me/plants/${plantId}`);
  return res.data;
};

export const addPlantCareLogApi = async (
  plantId: number,
  data: {
    type:         string;
    note?:        string;
    careCategory?: string;
  }
) => {
  const res = await api.post(`/customers/me/plants/${plantId}/log`, {
    type:          data.type,
    note:          data.note,
    care_category: data.careCategory,
  });
  return res.data;
};
```

### 9.2 Add/Edit Plant Form Component (`src/features/customer/components/PlantForm.tsx`)

```typescript
"use client";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addPlantApi, updatePlantApi, PlantPayload } from "../api/plants.api";

// ── Validation schema ────────────────────────────────────────────────
const plantSchema = z.object({
  plantName:            z.string().min(2, "Name must be at least 2 characters"),
  nickname:             z.string().optional(),
  location:             z.string().optional(),
  addedAt:              z.string().min(1, "Date added is required"),
  heightCm:             z.number().min(0).max(999).optional(),
  growthStage:          z.enum(["seedling","juvenile","adolescent","mature","dormant"]).optional(),
  potSizeCm:            z.number().min(1).max(200).optional(),
  soilType:             z.string().optional(),
  sunlightExposure:     z.enum(["full_sun","partial_sun","indirect_bright","low_light","artificial_only"]).optional(),
  healthStatus:         z.enum(["thriving","healthy","needs_attention","sick","recovering"]).optional(),
  isPetHousehold:       z.boolean().default(false),
  lastWateredAt:        z.string().optional(),
  wateringIntervalDays: z.number().min(1).max(365).default(7),
  lastFertilisedAt:     z.string().optional(),
  lastRepottedAt:       z.string().optional(),
  userNotes:            z.string().max(1000).optional(),
});

type PlantFormData = z.infer<typeof plantSchema>;

interface Props {
  plant?:    any;        // existing plant for edit mode
  onSuccess?: () => void;
}

export function PlantForm({ plant, onSuccess }: Props) {
  const qc = useQueryClient();
  const isEdit = !!plant;
  const [photo,        setPhoto]        = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    plant?.photo_url ?? null
  );
  const [activeSection, setActiveSection] = useState<
    "basic" | "growth" | "care" | "notes"
  >("basic");

  const form = useForm<PlantFormData>({
    resolver: zodResolver(plantSchema),
    defaultValues: {
      plantName:            plant?.plant_name            ?? "",
      nickname:             plant?.nickname              ?? "",
      location:             plant?.location              ?? "",
      addedAt:              plant?.added_at              ?? new Date().toISOString().split("T")[0],
      heightCm:             plant?.height_cm             ?? undefined,
      growthStage:          plant?.growth_stage          ?? undefined,
      potSizeCm:            plant?.pot_size_cm           ?? undefined,
      soilType:             plant?.soil_type             ?? "",
      sunlightExposure:     plant?.sunlight_exposure     ?? undefined,
      healthStatus:         plant?.health_status         ?? "healthy",
      isPetHousehold:       plant?.is_pet_household      ?? false,
      lastWateredAt:        plant?.last_watered_at       ?? "",
      wateringIntervalDays: plant?.watering_interval_days ?? 7,
      lastFertilisedAt:     plant?.last_fertilised_at    ?? "",
      lastRepottedAt:       plant?.last_repotted_at      ?? "",
      userNotes:            plant?.user_notes            ?? "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: PlantFormData) => {
      const payload: PlantPayload = {
        ...data,
        photo: photo ?? undefined,
      };
      return isEdit
        ? updatePlantApi(plant.id, payload)
        : addPlantApi(payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-plants"] });
      qc.invalidateQueries({ queryKey: ["ai-care-plants"] });
      onSuccess?.();
    },
  });

  const sections = [
    { id: "basic",  label: "Basic Info",   icon: "🌿" },
    { id: "growth", label: "Growth",       icon: "📏" },
    { id: "care",   label: "Care Schedule",icon: "💧" },
    { id: "notes",  label: "My Notes",     icon: "📝" },
  ] as const;

  return (
    <form
      onSubmit={form.handleSubmit((d) => mutation.mutate(d))}
      aria-label={isEdit ? "Edit plant" : "Add new plant"}
      noValidate
    >
      {/* Section tabs */}
      <div
        className="flex gap-1 mb-6 bg-gray-50 p-1 rounded-xl"
        role="tablist"
        aria-label="Plant form sections"
      >
        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            role="tab"
            aria-selected={activeSection === section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex-1 flex items-center justify-center gap-1.5
              text-xs font-semibold py-2 px-3 rounded-lg transition-all
              ${activeSection === section.id
                ? "bg-white text-[#00b566] shadow-sm"
                : "text-gray-400 hover:text-gray-600"
              }`}
          >
            <span aria-hidden="true">{section.icon}</span>
            <span className="hidden sm:inline">{section.label}</span>
          </button>
        ))}
      </div>

      {/* ── SECTION 1: Basic Info ──────────────────────────────────── */}
      {activeSection === "basic" && (
        <div className="space-y-4" role="tabpanel" aria-label="Basic info">

          {/* Photo upload */}
          <div className="flex items-center gap-4">
            <div
              className="w-20 h-20 rounded-2xl bg-[#00b566]/10 border-2
                         border-dashed border-[#00b566]/30 flex items-center
                         justify-center overflow-hidden cursor-pointer
                         hover:border-[#00b566]/60 transition-colors"
              onClick={() =>
                document.getElementById("plant-photo-input")?.click()
              }
              role="button"
              aria-label="Upload plant photo"
              tabIndex={0}
            >
              {photoPreview ? (
                <img src={photoPreview} alt="Plant preview"
                     className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl">📷</span>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1c1c1c]">
                Plant photo
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Helps the AI identify your plant visually
              </p>
              <input
                id="plant-photo-input"
                type="file"
                accept="image/*"
                className="hidden"
                aria-hidden="true"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  setPhoto(f);
                  setPhotoPreview(URL.createObjectURL(f));
                }}
              />
            </div>
          </div>

          {/* Plant name */}
          <FormField
            label="Plant Name"
            required
            error={form.formState.errors.plantName?.message}
          >
            <input
              {...form.register("plantName")}
              type="text"
              placeholder="e.g. Monstera Deliciosa"
              className={inputClass(!!form.formState.errors.plantName)}
              aria-required="true"
              autoComplete="off"
            />
          </FormField>

          {/* Nickname */}
          <FormField label="Nickname" hint="What do you call it?">
            <input
              {...form.register("nickname")}
              type="text"
              placeholder="e.g. Monty, Big Leaf"
              className={inputClass(false)}
            />
          </FormField>

          {/* Location */}
          <FormField label="Location" hint="Where in your home?">
            <input
              {...form.register("location")}
              type="text"
              placeholder="e.g. Living Room, Balcony, Bedroom"
              className={inputClass(false)}
            />
          </FormField>

          {/* Date added */}
          <FormField label="Date Added" required
            error={form.formState.errors.addedAt?.message}>
            <input
              {...form.register("addedAt")}
              type="date"
              className={inputClass(!!form.formState.errors.addedAt)}
              aria-required="true"
            />
          </FormField>

          {/* Health status */}
          <FormField label="Current Health Status">
            <Controller
              name="healthStatus"
              control={form.control}
              render={({ field }) => (
                <div
                  className="grid grid-cols-5 gap-2"
                  role="radiogroup"
                  aria-label="Health status"
                >
                  {[
                    { value: "thriving",        label: "Thriving",  icon: "🌟" },
                    { value: "healthy",         label: "Healthy",   icon: "✅" },
                    { value: "needs_attention", label: "Needs care",icon: "⚠️" },
                    { value: "sick",            label: "Sick",      icon: "🤒" },
                    { value: "recovering",      label: "Recovering",icon: "💪" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      role="radio"
                      aria-checked={field.value === opt.value}
                      onClick={() => field.onChange(opt.value)}
                      className={`flex flex-col items-center gap-1 p-2
                        rounded-xl border text-center transition-all
                        ${field.value === opt.value
                          ? "border-[#00b566] bg-[#00b566]/10 text-[#00b566]"
                          : "border-gray-200 bg-gray-50 text-gray-400 hover:border-gray-300"
                        }`}
                    >
                      <span className="text-xl" aria-hidden="true">{opt.icon}</span>
                      <span className="text-[9px] font-semibold leading-tight">
                        {opt.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            />
          </FormField>

          {/* Pet household toggle */}
          <div className="flex items-center justify-between bg-amber-50
                          border border-amber-100 rounded-xl px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-[#1c1c1c]">
                🐾 Pet household
              </p>
              <p className="text-xs text-gray-500">
                AI will avoid recommending toxic treatments
              </p>
            </div>
            <Controller
              name="isPetHousehold"
              control={form.control}
              render={({ field }) => (
                <button
                  type="button"
                  role="switch"
                  aria-checked={field.value}
                  onClick={() => field.onChange(!field.value)}
                  className={`w-12 h-6 rounded-full transition-colors relative
                    ${field.value ? "bg-[#00b566]" : "bg-gray-200"}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5
                    transition-transform shadow-sm
                    ${field.value ? "translate-x-6" : "translate-x-0.5"}`}
                  />
                </button>
              )}
            />
          </div>
        </div>
      )}

      {/* ── SECTION 2: Growth ─────────────────────────────────────── */}
      {activeSection === "growth" && (
        <div className="space-y-4" role="tabpanel" aria-label="Growth info">

          {/* Height */}
          <FormField label="Current Height (cm)"
            hint="Helps AI give size-appropriate advice">
            <div className="flex items-center gap-2">
              <input
                {...form.register("heightCm", { valueAsNumber: true })}
                type="number"
                min="0" max="999" step="0.5"
                placeholder="e.g. 45"
                className={`${inputClass(false)} flex-1`}
              />
              <span className="text-sm text-gray-400 font-medium w-8">cm</span>
            </div>
          </FormField>

          {/* Growth stage */}
          <FormField label="Growth Stage">
            <Controller
              name="growthStage"
              control={form.control}
              render={({ field }) => (
                <div className="grid grid-cols-5 gap-2" role="radiogroup">
                  {[
                    { value: "seedling",   label: "Seedling",   icon: "🌱" },
                    { value: "juvenile",   label: "Juvenile",   icon: "🌿" },
                    { value: "adolescent", label: "Young",      icon: "🪴" },
                    { value: "mature",     label: "Mature",     icon: "🌳" },
                    { value: "dormant",    label: "Dormant",    icon: "😴" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      role="radio"
                      aria-checked={field.value === opt.value}
                      onClick={() => field.onChange(opt.value)}
                      className={`flex flex-col items-center gap-1 p-2
                        rounded-xl border text-center transition-all
                        ${field.value === opt.value
                          ? "border-[#00b566] bg-[#00b566]/10"
                          : "border-gray-200 bg-gray-50 text-gray-400"
                        }`}
                    >
                      <span className="text-xl" aria-hidden="true">{opt.icon}</span>
                      <span className="text-[9px] font-semibold leading-tight
                                       text-[#1c1c1c]">
                        {opt.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            />
          </FormField>

          {/* Pot size */}
          <FormField label="Pot Diameter (cm)">
            <input
              {...form.register("potSizeCm", { valueAsNumber: true })}
              type="number" min="5" max="200" step="1"
              placeholder="e.g. 14"
              className={inputClass(false)}
            />
          </FormField>

          {/* Soil type */}
          <FormField label="Soil / Growing Media">
            <select
              {...form.register("soilType")}
              className={inputClass(false)}
            >
              <option value="">Select soil type</option>
              <option value="General potting mix">General potting mix</option>
              <option value="Cactus & succulent mix">Cactus & succulent mix</option>
              <option value="Cocopeat">Cocopeat</option>
              <option value="Peat-based mix">Peat-based mix</option>
              <option value="Loamy garden soil">Loamy garden soil</option>
              <option value="Bark & perlite mix">Bark & perlite mix</option>
              <option value="Hydroponics">Hydroponics</option>
              <option value="Custom mix">Custom mix</option>
            </select>
          </FormField>

          {/* Sunlight */}
          <FormField label="Sunlight Exposure">
            <div className="space-y-2" role="radiogroup" aria-label="Sunlight exposure">
              {[
                { value: "full_sun",        label: "Full Sun",         desc: "6+ hours direct sun", icon: "☀️" },
                { value: "partial_sun",     label: "Partial Sun",      desc: "3–6 hours direct sun", icon: "🌤️" },
                { value: "indirect_bright", label: "Indirect Bright",  desc: "Bright room, no direct rays", icon: "💡" },
                { value: "low_light",       label: "Low Light",        desc: "Away from windows", icon: "🌑" },
                { value: "artificial_only", label: "Artificial Light",  desc: "Grow lights only", icon: "💡" },
              ].map((opt) => (
                <Controller
                  key={opt.value}
                  name="sunlightExposure"
                  control={form.control}
                  render={({ field }) => (
                    <button
                      type="button"
                      role="radio"
                      aria-checked={field.value === opt.value}
                      onClick={() => field.onChange(opt.value)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl
                        border text-left transition-all
                        ${field.value === opt.value
                          ? "border-[#00b566] bg-[#00b566]/10"
                          : "border-gray-200 bg-gray-50 hover:border-gray-300"
                        }`}
                    >
                      <span className="text-xl w-7" aria-hidden="true">{opt.icon}</span>
                      <div>
                        <p className="text-sm font-semibold text-[#1c1c1c]">{opt.label}</p>
                        <p className="text-xs text-gray-400">{opt.desc}</p>
                      </div>
                    </button>
                  )}
                />
              ))}
            </div>
          </FormField>
        </div>
      )}

      {/* ── SECTION 3: Care Schedule ──────────────────────────────── */}
      {activeSection === "care" && (
        <div className="space-y-4" role="tabpanel" aria-label="Care schedule">

          <FormField label="Last Watered">
            <input
              {...form.register("lastWateredAt")}
              type="date"
              className={inputClass(false)}
              max={new Date().toISOString().split("T")[0]}
            />
          </FormField>

          <FormField
            label="Water every (days)"
            hint="AI uses this to compute next watering date"
          >
            <div className="flex items-center gap-3">
              <input
                {...form.register("wateringIntervalDays", { valueAsNumber: true })}
                type="range"
                min="1" max="30" step="1"
                className="flex-1 accent-[#00b566]"
                aria-label="Watering interval in days"
              />
              <span className="text-sm font-bold text-[#00b566] w-16 text-right">
                {form.watch("wateringIntervalDays")} day{form.watch("wateringIntervalDays") !== 1 ? "s" : ""}
              </span>
            </div>
          </FormField>

          <FormField label="Last Fertilised">
            <input
              {...form.register("lastFertilisedAt")}
              type="date"
              className={inputClass(false)}
              max={new Date().toISOString().split("T")[0]}
            />
          </FormField>

          <FormField label="Last Repotted">
            <input
              {...form.register("lastRepottedAt")}
              type="date"
              className={inputClass(false)}
              max={new Date().toISOString().split("T")[0]}
            />
          </FormField>
        </div>
      )}

      {/* ── SECTION 4: Notes ──────────────────────────────────────── */}
      {activeSection === "notes" && (
        <div role="tabpanel" aria-label="Personal notes">
          <FormField
            label="Your Notes"
            hint="The AI reads these notes to give personalised advice"
          >
            <textarea
              {...form.register("userNotes")}
              rows={8}
              placeholder={
                "Add anything useful about this plant:\n" +
                "• Leaves turned yellow last winter\n" +
                "• Moved from balcony to bedroom in June\n" +
                "• Reacted badly to direct afternoon sun\n" +
                "• Used neem oil for pests in March — worked well\n" +
                "• Bought from Hero Plants, medium variant"
              }
              className={`${inputClass(false)} resize-none leading-relaxed`}
              aria-describedby="notes-hint"
            />
            <p id="notes-hint" className="text-xs text-gray-400 mt-1.5">
              {form.watch("userNotes")?.length ?? 0} / 1000 characters
            </p>
          </FormField>
        </div>
      )}

      {/* ── Navigation + Submit ────────────────────────────────────── */}
      <div className="flex items-center justify-between mt-6 pt-4
                      border-t border-gray-100">
        {/* Previous section */}
        {activeSection !== "basic" && (
          <button
            type="button"
            onClick={() => {
              const order = ["basic","growth","care","notes"] as const;
              const idx   = order.indexOf(activeSection);
              setActiveSection(order[idx - 1]);
            }}
            className="text-sm font-semibold text-gray-400 hover:text-gray-600"
          >
            ← Back
          </button>
        )}
        {activeSection === "basic" && <div />}

        {/* Next section or submit */}
        {activeSection !== "notes" ? (
          <button
            type="button"
            onClick={() => {
              const order = ["basic","growth","care","notes"] as const;
              const idx   = order.indexOf(activeSection);
              setActiveSection(order[idx + 1]);
            }}
            className="bg-[#00b566] text-white text-sm font-semibold
                       rounded-full px-5 py-2.5 hover:bg-[#009959]
                       transition-colors"
          >
            Next →
          </button>
        ) : (
          <button
            type="submit"
            disabled={mutation.isPending}
            aria-busy={mutation.isPending}
            className="bg-[#00b566] text-white text-sm font-semibold
                       rounded-full px-6 py-2.5 hover:bg-[#009959]
                       disabled:opacity-50 transition-colors
                       focus-visible:outline focus-visible:outline-2
                       focus-visible:outline-[#00b566]"
          >
            {mutation.isPending
              ? isEdit ? "Saving…" : "Adding plant…"
              : isEdit ? "Save Changes" : "Add Plant 🌿"}
          </button>
        )}
      </div>

      {/* Error */}
      {mutation.isError && (
        <p role="alert" className="text-xs text-red-500 mt-3 text-center">
          ⚠ {(mutation.error as any)?.response?.data?.detail
               ?? "Something went wrong. Please try again."}
        </p>
      )}
    </form>
  );
}

// ── Shared helpers ────────────────────────────────────────────────────

function inputClass(hasError: boolean) {
  return `w-full h-11 px-4 border rounded-xl text-sm text-[#1c1c1c]
    bg-white placeholder-gray-400 transition-all outline-none
    focus:border-[#00b566] focus:ring-2 focus:ring-[#00b566]/20
    ${hasError ? "border-red-400 bg-red-50" : "border-gray-200"}`;
}

function FormField({
  label,
  required,
  hint,
  error,
  children,
}: {
  label:     string;
  required?: boolean;
  hint?:     string;
  error?:    string;
  children:  React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-700 text-gray-600 uppercase
                         tracking-wider mb-1.5">
        {label}
        {required && (
          <span className="text-red-500 ml-0.5" aria-label="required">*</span>
        )}
      </label>
      {hint && (
        <p className="text-xs text-gray-400 mb-1.5">{hint}</p>
      )}
      {children}
      {error && (
        <p role="alert" className="text-xs text-red-500 mt-1">⚠ {error}</p>
      )}
    </div>
  );
}
```

---

## 10. Complete API Route Map — AI Care System

| # | Endpoint | Method | File | Hook | Purpose |
|---|---|---|---|---|---|
| 1 | `/ai-care/my-plants` | GET | `ai-care.api.ts → getMyPlantsForAiApi()` | `useMyPlantsForAi` | Dropdown list |
| 2 | `/ai-care/my-plants/{id}` | GET | `ai-care.api.ts → getPlantAiContextApi()` | `usePlantAiContext` | Context panel |
| 3 | `/ai-care/chat` | POST | `ai-care.api.ts → aiCareChatApi()` | `useAiCareChat` | Send message |
| 4 | `/ai-care/sessions/{uuid}/save-guide` | POST | `ai-care.api.ts → saveAiGuideApi()` | `useAiCareChat` | Manual save |
| 5 | `/ai-care/care-guides/{id}/resolve` | PATCH | `ai-care.api.ts → resolveCareGuideApi()` | `useResolveCareGuide` | Resolve guide |
| 6 | `/ai-care/sessions/{uuid}/rate` | POST | `ai-care.api.ts → rateAiSessionApi()` | `useAiCareChat` | Rate session |
| 7 | `/customers/me/plants` | GET | `plants.api.ts → getMyPlantsApi()` | `useMyPlants` | Profile page list |
| 8 | `/customers/me/plants` | POST | `plants.api.ts → addPlantApi()` | `useMutation` | Add plant |
| 9 | `/customers/me/plants/{id}` | PATCH | `plants.api.ts → updatePlantApi()` | `useMutation` | Edit plant |
| 10 | `/customers/me/plants/{id}` | DELETE | `plants.api.ts → deletePlantApi()` | `useMutation` | Delete plant |
| 11 | `/customers/me/plants/{id}/log` | POST | `plants.api.ts → addPlantCareLogApi()` | `useMutation` | Add care log |

---

## 11. Data Flow — Complete System

```
USER ADDS PLANT (profile page)
    │
    ▼ PlantForm submits
POST /customers/me/plants
{ plant_name, nickname, height_cm, growth_stage,
  soil_type, sunlight_exposure, health_status,
  watering_interval_days, is_pet_household, user_notes ... }
    │
    ▼ Stored in user_plants table
    │
    ▼ qc.invalidateQueries(["ai-care-plants"])

USER OPENS AI CARE PAGE
    │
    ▼
GET /ai-care/my-plants
Returns dropdown list: [{ id, plant_name, nickname, health_status... }]
    │
    ▼ User selects plant from dropdown
    │
    ▼
GET /ai-care/my-plants/{id}
Returns: { plant{...}, care_logs[], care_guides[] }
    │
    ▼ Shown in left panel (info / guides / logs tabs)
    │ AI chat resets with greeting message

USER SENDS MESSAGE
    │
    ▼
POST /ai-care/chat
FormData: { message, session_uuid, plant_id }
    │
    ▼ AICareService:
    │  1. build_plant_context_block(plant) → injects ALL plant data into system prompt
    │  2. Calls OpenAI GPT-4o with context + history
    │  3. Parses SAVE_GUIDE: directive from AI response
    │  4. Finds relevant product suggestions
    │
    ▼ If AI response contains SAVE_GUIDE:
    │  → auto-saves to ai_care_guides table
    │  → auto-logs to plant_care_logs (source=ai, is_care_guide=true)
    │
    ▼ Response:
    { session_uuid, response, suggested_products[], saved_guide? }
    │
    ▼ Frontend:
    │  → adds AI message bubble to chat
    │  → shows "✓ Saved to care guide" badge if saved_guide present
    │  → qc.invalidateQueries(["ai-care-plant-context", plantId])
    │     → context panel refreshes showing new care guide

USER CLICKS "💾 Save to guide" on any AI message
    │
    ▼ Category picker dropdown appears
    │
    ▼
POST /ai-care/sessions/{uuid}/save-guide
{ plant_id, message_content, category, title, severity }
    │
    ▼ Guide saved → context panel refreshes

USER VIEWS CARE GUIDES TAB
    │  Shows all active guides with severity badges
    │  User can expand each guide to read full content
    │  "✓ Mark as resolved" → opens resolution form
    │
    ▼
PATCH /ai-care/care-guides/{id}/resolve
{ note: "Treated with neem oil — worked!" }
    │
    ▼ Guide moved to "Resolved" section
```

---

## 12. Final Summary

```
Hero Plant Store — AI Care System v1.0
════════════════════════════════════════════════════════════════════
DATABASE CHANGES
  user_plants      ← 10 new columns (height, growth_stage, soil,
                      sunlight, health_status, pet_household, notes...)
  plant_care_logs  ← 4 new columns (source, ai_session_id,
                      care_category, is_care_guide)
  ai_care_plant_context  ← NEW table (session ↔ plant link + snapshot)
  ai_care_guides         ← NEW table (AI-generated care guide entries)

BACKEND FILES
  app/models/plant.py          ← Extended UserPlant + PlantCareLog models
                                  + new AiCareGuide model
  app/services/ai_care_service.py ← Full plant context builder
                                    SAVE_GUIDE directive parser
                                    auto-save care guide logic
  app/api/v1/storefront/ai_care.py ← 6 endpoints:
                                      GET  /ai-care/my-plants
                                      GET  /ai-care/my-plants/{id}
                                      POST /ai-care/chat  (plant_id added)
                                      POST /ai-care/sessions/{uuid}/save-guide
                                      PATCH /ai-care/care-guides/{id}/resolve
                                      POST /ai-care/sessions/{uuid}/rate

FRONTEND FILES
  features/ai-care/api/ai-care.api.ts          ← 6 typed API functions
  features/ai-care/hooks/useAiCare.ts          ← 4 hooks
  app/(storefront)/ai-care/page.tsx            ← Complete page
  features/ai-care/components/MessageBubble.tsx   ← Chat bubble + save menu
  features/ai-care/components/PlantInfoPanel.tsx  ← Context panel left tab
  features/ai-care/components/CareGuidesPanel.tsx ← Guides tab + resolve
  features/ai-care/components/CareLogsPanel.tsx   ← Activity timeline
  features/ai-care/components/TypingIndicator.tsx  ← Bouncing dots
  features/ai-care/components/EmptyChatState.tsx   ← Quick prompts
  features/customer/api/plants.api.ts           ← 5 plant CRUD API functions
  features/customer/components/PlantForm.tsx    ← 4-section add/edit form

KEY FEATURES
  ✓ Plant dropdown on AI Care page — all saved plants
  ✓ Full plant context injected into AI system prompt
     (height, growth, soil, sunlight, health, logs, notes)
  ✓ AI auto-saves care guides via SAVE_GUIDE: directive
  ✓ Manual "💾 Save to guide" on any AI message
  ✓ Category picker: disease / pest / watering / fertilising...
  ✓ Care guides panel with severity badges (info/warning/urgent)
  ✓ Mark care guide as resolved with note
  ✓ Pet household flag → AI avoids toxic recommendations
  ✓ Plant notes field → AI reads and references them
  ✓ Full care log timeline (user + AI entries)
  ✓ Product suggestions based on query topic
  ✓ Session rating (👍/👎)
  ✓ Photo upload for plant identification
  ✓ Auto-scroll to latest message
  ✓ Typing indicator while AI responds

════════════════════════════════════════════════════════════════════
Last updated: June 2026
```

---

*Document version: 1.0 (complete) — Hero Plant Store AI Care System*
*Backend: FastAPI + SQLAlchemy + OpenAI GPT-4o*
*Frontend: Next.js 14 + TanStack Query + Zustand*
*Last updated: June 2026*
