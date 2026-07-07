import uuid as _uuid
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user, get_optional_user
from app.models.ai_care import AICareSession, AICareMessage, AICareProductSuggestion
from app.models.user import User
from app.services.ai_care_service import AICareService
from app.utils.storage import upload_file

router = APIRouter(prefix="/ai-care", tags=["AI Plant Care"])


@router.post("/chat")
async def chat(
    message: str,
    session_uuid: str | None = None,
    db: Session = Depends(get_db),
    user: User = Depends(get_optional_user),
):
    svc = AICareService(db)
    session = svc.get_or_create_session(session_uuid, user, source="chat")

    # Store user message
    db.add(AICareMessage(session_id=session.id, role="user", content=message))
    db.flush()

    # Build history
    history = db.query(AICareMessage).filter(
        AICareMessage.session_id == session.id
    ).order_by(AICareMessage.id).all()

    ai_text, suggested_products = await svc.generate_response(
        message=message,
        history=history[:-1],  # exclude the message we just added
        plant_id=session.plant_id_result,
        photo_url=session.photo_url,
        db=db,
    )

    # Store assistant message
    db.add(AICareMessage(session_id=session.id, role="assistant", content=ai_text))
    session.message_count = (session.message_count or 0) + 2

    # Log product suggestions
    for prod in suggested_products:
        try:
            from app.models.product import Product
            p = db.query(Product).filter(Product.uuid == prod["id"]).first()
            if p:
                db.add(AICareProductSuggestion(session_id=session.id, product_id=p.id))
        except Exception:
            pass

    db.commit()
    return {
        "session_uuid": session.uuid,
        "reply": ai_text,
        "suggested_products": suggested_products,
    }


@router.post("/chat/photo")
async def chat_with_photo(
    message: str = "What plant is this?",
    session_uuid: str | None = None,
    photo: UploadFile = File(...),
    db: Session = Depends(get_db),
    user: User = Depends(get_optional_user),
):
    svc = AICareService(db)
    session = svc.get_or_create_session(session_uuid, user, source="photo_upload")

    # Upload photo to S3
    try:
        photo_url = await upload_file(photo, folder="ai-care")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    session.photo_url = photo_url

    # Identify plant via Google Vision
    plant_name, confidence = await svc.identify_plant(photo_url)
    if plant_name:
        session.plant_id_result = plant_name
        session.plant_id_confidence = confidence
        message = f"{message}. The uploaded plant appears to be: {plant_name}"

    db.add(AICareMessage(session_id=session.id, role="user", content=message))
    db.flush()

    history = db.query(AICareMessage).filter(
        AICareMessage.session_id == session.id
    ).order_by(AICareMessage.id).all()

    ai_text, suggested_products = await svc.generate_response(
        message=message,
        history=history[:-1],
        plant_id=plant_name,
        photo_url=photo_url,
        db=db,
    )

    db.add(AICareMessage(session_id=session.id, role="assistant", content=ai_text))
    db.commit()

    return {
        "session_uuid": session.uuid,
        "identified_plant": plant_name,
        "confidence": confidence,
        "reply": ai_text,
        "suggested_products": suggested_products,
    }


@router.post("/sessions/{session_uuid}/rate")
async def rate_session(
    session_uuid: str,
    rating: str,   # "helpful" | "not_helpful"
    db: Session = Depends(get_db),
    user: User = Depends(get_optional_user),
):
    if rating not in ("helpful", "not_helpful"):
        raise HTTPException(status_code=400, detail="Rating must be 'helpful' or 'not_helpful'.")

    session = db.query(AICareSession).filter(
        AICareSession.uuid == session_uuid
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found.")

    session.rating = rating
    db.commit()
    return {"message": "Rating saved."}
