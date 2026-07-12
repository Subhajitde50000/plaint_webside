from openai import OpenAI
from sqlalchemy.orm import Session
from typing import Optional, List, Tuple
import httpx

from app.config import settings
from app.models.ai_care import AICareSession, AICareMessage
from app.models.product import Product

client = OpenAI(api_key=settings.OPENAI_API_KEY)

SYSTEM_PROMPT = """
You are Hero Plant Store's AI Care assistant — a warm, knowledgeable plant expert.
Help customers care for their plants with accurate, practical advice.
When recommending products, only suggest items from Hero Plant Store.
Keep responses concise (under 200 words), friendly, and actionable.
If a plant is identified from a photo, reference it by name.
Never give advice that could harm plants or people.
"""

class AICareService:
    def __init__(self, db: Session):
        self.db = db

    def get_or_create_session(
        self,
        session_uuid: Optional[str],
        user,
        source: str
    ) -> AICareSession:
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
        return session

    async def identify_plant(self, image_url: str) -> Tuple[Optional[str], Optional[float]]:
        """Use Google Vision API to identify plant from uploaded photo."""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"https://vision.googleapis.com/v1/images:annotate?key={settings.GOOGLE_VISION_API_KEY}",
                json={
                    "requests": [{
                        "image": {"source": {"imageUri": image_url}},
                        "features": [
                            {"type": "LABEL_DETECTION", "maxResults": 5},
                            {"type": "WEB_DETECTION", "maxResults": 3},
                        ]
                    }]
                }
            )
            data = response.json()

        # Extract plant name from web entities or labels
        try:
            web = data["responses"][0].get("webDetection", {})
            entities = web.get("webEntities", [])
            plant_entities = [
                e for e in entities
                if e.get("score", 0) > 0.5
            ]
            if plant_entities:
                top = plant_entities[0]
                return top["description"], round(top["score"] * 100, 1)
        except (KeyError, IndexError):
            pass
        return None, None

    async def generate_response(
        self,
        message: str,
        history: List[AICareMessage],
        plant_id: Optional[str],
        photo_url: Optional[str],
        db: Session,
    ) -> Tuple[str, list]:
        # Build message history for OpenAI
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]

        if plant_id:
            messages.append({
                "role": "system",
                "content": f"The customer uploaded a photo. Plant identified: {plant_id}."
            })

        for msg in history[-10:]:  # last 10 messages for context
            messages.append({"role": msg.role, "content": msg.content})

        # Add current message
        if photo_url:
            messages.append({
                "role": "user",
                "content": [
                    {"type": "image_url", "image_url": {"url": photo_url}},
                    {"type": "text", "text": message}
                ]
            })
        else:
            messages.append({"role": "user", "content": message})

        response = client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=messages,
            max_tokens=300,
            temperature=0.7,
        )

        ai_text = response.choices[0].message.content

        # Find relevant products to suggest
        suggested = self._find_relevant_products(message, plant_id, db)

        return ai_text, suggested

    def _find_relevant_products(
        self, message: str, plant_id: Optional[str], db: Session
    ) -> list:
        """Simple keyword-based product suggestion."""
        keywords = message.lower().split()
        care_keywords = ["water", "fertilise", "soil", "pot", "repot", "care", "feed"]

        if any(k in keywords for k in care_keywords):
            products = db.query(Product).filter(
                Product.status == "active",
                Product.product_type.in_(["soil", "tool", "accessory"])
            ).limit(3).all()
            return [{"id": str(p.uuid), "title": p.title, "price": str(p.base_price)} for p in products]

        if plant_id:
            products = db.query(Product).filter(
                Product.status == "active",
                Product.title.ilike(f"%{plant_id.split()[0]}%")
            ).limit(2).all()
            return [{"id": str(p.uuid), "title": p.title, "price": str(p.base_price)} for p in products]

        return []