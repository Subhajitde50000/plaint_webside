from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from typing import Optional

from app.database import get_db
from app.dependencies import require_support_or_above, require_ops_or_above, get_current_admin
from app.models.review import Review, ReviewModerationHistory
from app.models.admin import AdminUser
from app.schemas.review import AdminReviewReplyRequest, AdminReviewRejectRequest
from app.utils.pagination import paginate

router = APIRouter(prefix="/admin/reviews", tags=["Admin - Reviews"])


@router.get("/")
async def list_reviews(
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_support_or_above),
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=100),
    status: Optional[str] = None,
    min_rating: Optional[int] = None,
):
    query = db.query(Review)
    if status:
        query = query.filter(Review.status == status)
    if min_rating:
        query = query.filter(Review.rating >= min_rating)
    query = query.order_by(Review.created_at.desc())
    return paginate(query, page, page_size)


@router.post("/{review_uuid}/approve")
async def approve_review(
    review_uuid: str,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_support_or_above),
):
    review = db.query(Review).filter(Review.uuid == review_uuid).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found.")
    review.status = "published"
    review.moderated_by = admin.id
    review.moderated_at = datetime.now(timezone.utc)
    db.add(ReviewModerationHistory(
        review_id=review.id, admin_id=admin.id, action="approved"
    ))
    db.commit()

    # Update product rating cache
    from sqlalchemy import func
    from app.models.product import Product
    avg = db.query(func.avg(Review.rating)).filter(
        Review.product_id == review.product_id,
        Review.status == "published",
    ).scalar() or 0
    count = db.query(func.count(Review.id)).filter(
        Review.product_id == review.product_id,
        Review.status == "published",
    ).scalar() or 0
    db.query(Product).filter(Product.id == review.product_id).update({
        "rating_average": round(float(avg), 2),
        "rating_count": count,
    })
    db.commit()
    return {"message": "Review approved and published."}


@router.post("/{review_uuid}/reject")
async def reject_review(
    review_uuid: str,
    payload: AdminReviewRejectRequest,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_support_or_above),
):
    review = db.query(Review).filter(Review.uuid == review_uuid).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found.")
    review.status = "rejected"
    review.rejection_reason = payload.reason
    review.moderated_by = admin.id
    review.moderated_at = datetime.now(timezone.utc)
    db.add(ReviewModerationHistory(
        review_id=review.id, admin_id=admin.id, action="rejected", notes=payload.reason
    ))
    db.commit()
    return {"message": "Review rejected."}


@router.post("/{review_uuid}/reply")
async def reply_to_review(
    review_uuid: str,
    payload: AdminReviewReplyRequest,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_support_or_above),
):
    review = db.query(Review).filter(Review.uuid == review_uuid).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found.")
    review.admin_reply = payload.reply
    review.admin_reply_at = datetime.now(timezone.utc)
    review.admin_reply_by = admin.id
    db.commit()
    return {"message": "Reply saved."}


@router.delete("/{review_uuid}", status_code=204)
async def delete_review(
    review_uuid: str,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_ops_or_above),
):
    review = db.query(Review).filter(Review.uuid == review_uuid).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found.")
    db.delete(review)
    db.commit()
