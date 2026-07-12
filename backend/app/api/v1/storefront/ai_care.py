from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
import httpx, base64, json

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.models.ai_care import AICareSession, AICareMessage
from app.services.ai_care_service import AICareService
from app.utils.storage import upload_file

router = APIRouter(prefix="/ai-care", tags=["AI Care"])


@router.post("/chat")
async def ai_care_chat(
    message: str = Form(...),
    session_uuid: Optional[str] = Form(None),
    photo: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    user: Optional[User] = Depends(get_current_user),
):
    service = AICareService(db)

    # Get or create session
    session = service.get_or_create_session(
        session_uuid=session_uuid,
        user=user,
        source="photo_upload" if photo else "chat",
    )

    # Upload photo if provided
    photo_url = None
    plant_id_result = None
    plant_id_confidence = None

    if photo:
        photo_url = await upload_file(
            file=photo,
            folder=f"ai-care-photos/{session.uuid}",
        )
        # Plant ID via Google Vision
        plant_id_result, plant_id_confidence = await service.identify_plant(photo_url)
        session.photo_url = photo_url
        session.plant_id_result = plant_id_result
        session.plant_id_confidence = plant_id_confidence

    # Save user message
    db.add(AICareMessage(
        session_id=session.id,
        role="user",
        content=message,
    ))

    # Build conversation history for OpenAI context
    history = db.query(AICareMessage).filter(
        AICareMessage.session_id == session.id
    ).order_by(AICareMessage.created_at).all()

    # Generate AI response
    ai_response, suggested_products = await service.generate_response(
        message=message,
        history=history,
        plant_id=plant_id_result,
        photo_url=photo_url,
        db=db,
    )

    # Save AI response
    db.add(AICareMessage(
        session_id=session.id,
        role="assistant",
        content=ai_response,
    ))

    session.message_count = len(history) + 2
    db.commit()

    return {
        "session_uuid": str(session.uuid),
        "response": ai_response,
        "plant_identified": plant_id_result,
        "plant_confidence": plant_id_confidence,
        "suggested_products": suggested_products,
    }


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