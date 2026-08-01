from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc

from app.database import get_db
from app.dependencies import get_current_user, get_optional_user
from app.models.user import User
from app.models.plant import UserPlant, AiCareGuide, PlantCareLog
from app.models.ai_care import AICareSession, AICareMessage
from app.services.ai_care_service import AICareService
from app.utils.storage import upload_file

router = APIRouter(prefix="/ai-care", tags=["AI Care"])


# ── 1. Get user's plants for the dropdown ─────────────────────────────
@router.get("/my-plants")
async def get_my_plants_for_ai(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Returns the user's saved plants for the AI Care page dropdown."""
    service = AICareService(db)
    plants = service.get_user_plants(user.id)

    return {
        "plants": [
            {
                "id":                    plant.id,
                "plant_name":            plant.plant_name,
                "nickname":              plant.nickname,
                "location":              plant.location,
                "photo_url":             plant.photo_url,
                "health_status":         plant.health_status.value if plant.health_status else "healthy",
                "height_cm":             str(plant.height_cm) if plant.height_cm else None,
                "growth_stage":          plant.growth_stage.value if plant.growth_stage else None,
                "last_watered_at":       plant.last_watered_at.isoformat() if plant.last_watered_at else None,
                "next_water_due":        plant.next_water_due.isoformat() if plant.next_water_due else None,
                "watering_interval_days": plant.watering_interval_days,
                "user_notes":            plant.user_notes,
                "care_guide_count":      len([g for g in plant.care_guides if not g.is_resolved]),
            }
            for plant in plants
        ]
    }


# ── 2. Get full plant detail for AI context panel ─────────────────────
@router.get("/my-plants/{plant_id}")
async def get_plant_ai_context(
    plant_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Returns full plant data + recent care logs + care guides."""
    plant = db.query(UserPlant).filter(
        UserPlant.id == plant_id,
        UserPlant.user_id == user.id
    ).first()

    if not plant:
        raise HTTPException(status_code=404, detail="Plant not found.")

    logs = db.query(PlantCareLog).filter(
        PlantCareLog.plant_id == plant_id
    ).order_by(desc(PlantCareLog.logged_at)).limit(20).all()

    guides = db.query(AiCareGuide).filter(
        AiCareGuide.plant_id == plant_id
    ).order_by(desc(AiCareGuide.created_at)).all()

    return {
        "plant": {
            "id":                    plant.id,
            "plant_name":            plant.plant_name,
            "nickname":              plant.nickname,
            "location":              plant.location,
            "photo_url":             plant.photo_url,
            "height_cm":             str(plant.height_cm) if plant.height_cm else None,
            "growth_stage":          plant.growth_stage.value if plant.growth_stage else None,
            "pot_size_cm":           plant.pot_size_cm,
            "soil_type":             plant.soil_type,
            "sunlight_exposure":     plant.sunlight_exposure.value if plant.sunlight_exposure else None,
            "health_status":         plant.health_status.value if plant.health_status else None,
            "is_pet_household":      plant.is_pet_household,
            "last_watered_at":       plant.last_watered_at.isoformat() if plant.last_watered_at else None,
            "next_water_due":        plant.next_water_due.isoformat() if plant.next_water_due else None,
            "watering_interval_days": plant.watering_interval_days,
            "last_fertilised_at":    plant.last_fertilised_at.isoformat() if plant.last_fertilised_at else None,
            "last_repotted_at":      plant.last_repotted_at.isoformat() if plant.last_repotted_at else None,
            "user_notes":            plant.user_notes,
            "added_at":              plant.added_at.isoformat(),
        },
        "care_logs": [
            {
                "id":            log.id,
                "type":          log.type.value if hasattr(log.type, "value") else str(log.type),
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
                "category":    guide.category.value if hasattr(guide.category, "value") else str(guide.category),
                "title":       guide.title,
                "content":     guide.content,
                "severity":    guide.severity,
                "is_resolved": guide.is_resolved,
                "created_by":  guide.created_by,
                "created_at":  guide.created_at.isoformat() if guide.created_at else None,
            }
            for guide in guides
        ],
    }


# ── 3. Main chat endpoint ──────────────────────────────────────────────
@router.post("/chat")
async def ai_care_chat(
    message:      str           = Form(...),
    session_uuid: Optional[str] = Form(None),
    plant_id:     Optional[int] = Form(None),
    photo:        Optional[UploadFile] = File(None),
    db:           Session       = Depends(get_db),
    user:         Optional[User] = Depends(get_optional_user),
):
    service = AICareService(db)

    session = service.get_or_create_session(
        session_uuid=session_uuid,
        user=user,
        plant_id=plant_id,
        source="photo_upload" if photo else "chat",
    )

    # Fetch selected plant
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
    db.add(AICareMessage(session_id=session.id, role="user", content=message))
    db.flush()

    # Get conversation history (excluding the message we just added)
    history = db.query(AICareMessage).filter(
        AICareMessage.session_id == session.id
    ).order_by(asc(AICareMessage.created_at)).all()[:-1]

    # Generate AI response
    ai_text, suggested_products, save_guide_meta = await service.generate_response(
        message=message,
        history=history,
        plant=plant,
        photo_url=photo_url,
        db=db,
    )

    # Save AI message
    db.add(AICareMessage(session_id=session.id, role="assistant", content=ai_text))

    # Auto-save care guide if AI flagged it
    saved_guide = None
    if save_guide_meta and plant:
        guide = service.save_ai_care_guide(
            plant_id=plant.id,
            session_id=session.id,
            ai_text=ai_text,
            guide_meta=save_guide_meta,
        )
        saved_guide = {
            "id":       guide.id,
            "category": guide.category.value if hasattr(guide.category, "value") else str(guide.category),
            "title":    guide.title,
            "severity": guide.severity,
        }

    session.message_count = (session.message_count or 0) + 2
    db.commit()

    return {
        "session_uuid":       str(session.uuid),
        "response":           ai_text,
        "suggested_products": suggested_products,
        "saved_guide":        saved_guide,
        "plant_id":           plant_id,
    }


# ── 4. Manually save any AI message as care guide ─────────────────────
@router.post("/sessions/{session_uuid}/save-guide")
async def manually_save_guide(
    session_uuid: str,
    payload:      dict,
    db:           Session = Depends(get_db),
    user:         User    = Depends(get_current_user),
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
        plant_id=plant.id,
        session_id=session.id if session else None,
        category=payload.get("category", "general"),
        title=payload.get("title", "Saved AI Advice"),
        content=payload["message_content"],
        severity=payload.get("severity", "info"),
        created_by="ai",
    )
    db.add(guide)
    db.commit()

    return {
        "saved":    True,
        "guide_id": guide.id,
        "message":  f"Saved to {plant.nickname or plant.plant_name}'s care guide.",
    }


# ── 5. Mark a care guide as resolved ──────────────────────────────────
@router.patch("/care-guides/{guide_id}/resolve")
async def resolve_care_guide(
    guide_id: int,
    payload:  dict,
    db:       Session = Depends(get_db),
    user:     User    = Depends(get_current_user),
):
    guide = db.query(AiCareGuide).join(UserPlant).filter(
        AiCareGuide.id    == guide_id,
        UserPlant.user_id == user.id
    ).first()

    if not guide:
        raise HTTPException(status_code=404, detail="Guide not found.")

    guide.is_resolved   = True
    guide.resolved_at   = datetime.now(timezone.utc)
    guide.resolved_note = payload.get("note")
    db.commit()

    return {"resolved": True, "guide_id": guide_id}


# ── 6. Rate session ────────────────────────────────────────────────────
@router.post("/sessions/{session_uuid}/rate")
async def rate_session(
    session_uuid: str,
    rating:       str,
    db:           Session = Depends(get_db),
    user:         Optional[User] = Depends(get_optional_user),
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
