from typing import Optional, List, Tuple
import json
import uuid as _uuid

try:
    from openai import OpenAI
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False

from sqlalchemy.orm import Session
from sqlalchemy import desc, asc
from datetime import date

from app.config import settings
from app.models.plant import UserPlant, PlantCareLog, AiCareGuide, CareCategory
from app.models.ai_care import AICareSession, AICareMessage, AiCarePlantContext
from app.models.product import Product


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
        source_tag = f"[{log.source.upper()}]" if log.source != "user" else ""
        logged_date = log.logged_at.strftime("%d %b %Y") if log.logged_at else "Unknown"
        log_type = log.type.value if hasattr(log.type, "value") else str(log.type)
        logs_text += f"\n  - {logged_date}: {log_type} {source_tag} — {log.note or ''}"

    # Active care guides
    guides = db.query(AiCareGuide).filter(
        AiCareGuide.plant_id == plant.id,
        AiCareGuide.is_resolved == False
    ).order_by(desc(AiCareGuide.created_at)).limit(5).all()

    guides_text = ""
    for guide in guides:
        sev = guide.severity if isinstance(guide.severity, str) else guide.severity.value
        cat = guide.category.value if hasattr(guide.category, "value") else str(guide.category)
        guides_text += f"\n  - [{sev.upper()}] {guide.title} ({cat})"

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

    growth = plant.growth_stage.value if plant.growth_stage else "Unknown"
    sunlight = plant.sunlight_exposure.value.replace("_", " ").title() if plant.sunlight_exposure else "Unknown"
    health = plant.health_status.value.replace("_", " ").title() if plant.health_status else "Unknown"

    context = f"""
=== PLANT CONTEXT (use this to personalise your response) ===
Plant Name:        {plant.plant_name}
Nickname:          {plant.nickname or 'Not set'}
Location:          {plant.location or 'Not specified'}
Height:            {f'{plant.height_cm} cm' if plant.height_cm else 'Not recorded'}
Growth Stage:      {growth}
Pot Size:          {f'{plant.pot_size_cm} cm diameter' if plant.pot_size_cm else 'Unknown'}
Soil Type:         {plant.soil_type or 'Unknown'}
Sunlight:          {sunlight}
Health Status:     {health}
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
        self._client = OpenAI(api_key=settings.OPENAI_API_KEY) if OPENAI_AVAILABLE else None

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
        source: str,
    ) -> AICareSession:
        """Get existing session or create a new one, linking to plant if given."""
        if session_uuid:
            session = self.db.query(AICareSession).filter(
                AICareSession.uuid == session_uuid
            ).first()
            if session:
                return session

        session = AICareSession(
            uuid=str(_uuid.uuid4()),
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
                    context_snapshot=snapshot,
                )
                self.db.add(context_record)

        return session

    def _build_snapshot(self, plant: UserPlant) -> dict:
        """JSON snapshot of plant state at session start."""
        return {
            "plant_id":    plant.id,
            "plant_name":  plant.plant_name,
            "nickname":    plant.nickname,
            "height_cm":   str(plant.height_cm) if plant.height_cm else None,
            "growth_stage": plant.growth_stage.value if plant.growth_stage else None,
            "health_status": plant.health_status.value if plant.health_status else None,
            "soil_type":   plant.soil_type,
            "sunlight":    plant.sunlight_exposure.value if plant.sunlight_exposure else None,
            "last_watered": plant.last_watered_at.isoformat() if plant.last_watered_at else None,
            "user_notes":  plant.user_notes,
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
        if not self._client:
            return (
                "I'm unable to process your request right now. Please try again later.",
                [],
                None,
            )

        # Build messages for OpenAI
        messages = [{"role": "system", "content": BASE_SYSTEM_PROMPT}]

        # Inject plant context if a plant is selected
        if plant:
            plant_ctx = build_plant_context_block(plant, db)
            messages.append({"role": "system", "content": plant_ctx})

        # Conversation history (last 12 messages for context window)
        for msg in history[-12:]:
            messages.append({"role": msg.role, "content": msg.content})

        # Current user message (with photo if uploaded)
        if photo_url:
            messages.append({
                "role": "user",
                "content": [
                    {"type": "image_url", "image_url": {"url": photo_url}},
                    {"type": "text", "text": message},
                ],
            })
        else:
            messages.append({"role": "user", "content": message})

        response = self._client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=messages,
            max_tokens=500,
            temperature=0.65,
        )

        raw_text = response.choices[0].message.content

        # Parse SAVE_GUIDE directive
        save_guide_meta = None
        display_text = raw_text

        if "SAVE_GUIDE:" in raw_text:
            parts = raw_text.split("SAVE_GUIDE:")
            display_text = parts[0].strip()
            try:
                guide_json = parts[1].strip().split("\n")[0]
                save_guide_meta = json.loads(guide_json)
            except (json.JSONDecodeError, IndexError):
                save_guide_meta = None

        # Find relevant product suggestions
        suggested = self._find_relevant_products(message, plant, db)

        return display_text, suggested, save_guide_meta

    def save_ai_care_guide(
        self,
        plant_id: int,
        session_id: int,
        ai_text: str,
        guide_meta: dict,
    ) -> AiCareGuide:
        """Save an AI response as a care guide entry on the plant."""
        guide = AiCareGuide(
            plant_id=plant_id,
            session_id=session_id,
            category=guide_meta.get("category", "general"),
            title=guide_meta.get("title", "AI Care Advice"),
            content=ai_text,
            severity=guide_meta.get("severity", "info"),
            created_by="ai",
        )
        self.db.add(guide)

        # Also log in plant_care_logs so it appears in activity timeline
        log = PlantCareLog(
            plant_id=plant_id,
            type="note",
            source="ai",
            ai_session_id=session_id,
            care_category=guide_meta.get("category", "general"),
            note=f"[AI] {guide_meta.get('title', 'Care guide added')}",
            is_care_guide=True,
        )
        self.db.add(log)
        self.db.commit()
        return guide

    def _find_relevant_products(
        self,
        message: str,
        plant: Optional[UserPlant],
        db: Session,
    ) -> list:
        """Suggest relevant Hero Plants products based on query topic."""
        msg_lower = message.lower()

        keyword_map = {
            ("fertilise", "fertilizer", "nutrient", "feed", "npk"): ["fertilizer", "accessory"],
            ("soil", "potting mix", "repot", "media"):               ["soil"],
            ("pot", "planter", "container"):                         ["pot"],
            ("water", "watering", "spray", "mister"):                ["tool"],
            ("pest", "bug", "insect", "aphid", "mealybug"):          ["accessory", "tool"],
            ("prune", "scissors", "shears", "trim"):                 ["tool"],
        }

        types_to_query = []
        for keywords, product_types in keyword_map.items():
            if any(k in msg_lower for k in keywords):
                types_to_query.extend(product_types)

        if not types_to_query:
            return []

        products = db.query(Product).filter(
            Product.status == "active",
            Product.product_type.in_(list(set(types_to_query)))
        ).limit(3).all()

        return [
            {
                "uuid":         str(p.uuid),
                "title":        p.title,
                "price":        str(p.base_price),
                "product_type": p.product_type.value if hasattr(p.product_type, "value") else str(p.product_type),
                "image_url":    p.images[0].url if p.images else None,
            }
            for p in products
        ]
