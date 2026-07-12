from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timezone

from app.database import get_db
from app.dependencies import require_ops_or_above, get_current_admin
from app.models.ai_care import AICareSession
from app.models.admin import AdminUser
from app.utils.pagination import paginate

router = APIRouter(prefix="/admin/ai-care", tags=["Admin - AI Care"])


class FlagSessionRequest(BaseModel):
    reason: str


class UpdateAICareSettingsRequest(BaseModel):
    model: Optional[str] = None
    max_tokens: Optional[int] = None
    temperature: Optional[float] = None


@router.get("/metrics")
async def get_metrics(
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    from sqlalchemy import func
    total = db.query(func.count(AICareSession.id)).scalar()
    helpful = db.query(func.count(AICareSession.id)).filter(AICareSession.rating == "helpful").scalar()
    not_helpful = db.query(func.count(AICareSession.id)).filter(AICareSession.rating == "not_helpful").scalar()
    converted = db.query(func.count(AICareSession.id)).filter(AICareSession.converted_to_cart == True).scalar()
    avg_msgs = db.query(func.avg(AICareSession.message_count)).scalar()

    return {
        "total_sessions": total,
        "helpful_sessions": helpful,
        "not_helpful_sessions": not_helpful,
        "converted_to_cart": converted,
        "avg_messages_per_session": round(float(avg_msgs or 0), 1),
        "helpfulness_rate": round((helpful / total * 100) if total > 0 else 0, 1),
    }


@router.get("/queries")
async def list_queries(
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_ops_or_above),
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=100),
    flag_status: Optional[str] = None,
):
    query = db.query(AICareSession)
    if flag_status:
        query = query.filter(AICareSession.flag_status == flag_status)
    query = query.order_by(AICareSession.created_at.desc())
    return paginate(query, page, page_size)


@router.post("/queries/{session_id}/flag")
async def flag_session(
    session_id: int,
    payload: FlagSessionRequest,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_ops_or_above),
):
    session = db.query(AICareSession).filter(AICareSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found.")
    session.flag_status = "flagged"
    session.flag_reason = payload.reason
    db.commit()
    return {"message": "Session flagged."}


@router.put("/settings")
async def update_settings(
    payload: UpdateAICareSettingsRequest,
    admin: AdminUser = Depends(require_ops_or_above),
):
    # Settings would be stored in DB or config; stub for now
    return {"message": "Settings updated.", "settings": payload.model_dump(exclude_none=True)}
