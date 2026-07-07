import uuid as _uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user, get_optional_user
from app.models.review import Review, ReviewFlag
from app.models.user import User
from app.schemas.review import SubmitReviewRequest, ReviewHelpfulRequest, ReviewFlagRequest
from app.utils.pagination import paginate

router = APIRouter(prefix="/reviews", tags=["Reviews"])


@router.post("/", status_code=status.HTTP_201_CREATED)
async def submit_review(
    payload: SubmitReviewRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    # Check for duplicate review by this user for this product
    existing = db.query(Review).filter(
        Review.user_id == user.id,
        Review.product_id == payload.product_id,
        Review.status != "rejected",
    ).first()
    if existing:
        raise HTTPException(status_code=409, detail="You've already reviewed this product.")

    is_verified = False
    if payload.order_item_id:
        from app.models.order import OrderItem
        order_item = db.query(OrderItem).filter(
            OrderItem.id == payload.order_item_id
        ).first()
        if order_item and order_item.order and order_item.order.user_id == user.id:
            is_verified = True

    review = Review(
        uuid=str(_uuid.uuid4()),
        product_id=payload.product_id,
        user_id=user.id,
        order_item_id=payload.order_item_id,
        reviewer_name=payload.reviewer_name,
        reviewer_email=payload.reviewer_email or user.email,
        rating=payload.rating,
        title=payload.title,
        body=payload.body,
        is_verified_purchase=is_verified,
        status="pending",
    )
    db.add(review)
    db.commit()
    return {"message": "Review submitted. It will be visible after moderation.", "review_uuid": review.uuid}


@router.post("/{review_id}/helpful")
async def mark_helpful(
    review_id: int,
    payload: ReviewHelpfulRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found.")
    if payload.helpful:
        review.helpful_count += 1
    else:
        review.not_helpful_count += 1
    db.commit()
    return {"message": "Thank you for your feedback."}


@router.post("/{review_id}/flag")
async def flag_review(
    review_id: int,
    payload: ReviewFlagRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found.")
    db.add(ReviewFlag(
        review_id=review_id,
        user_id=user.id,
        reason=payload.reason,
        notes=payload.notes,
    ))
    review.flag_count += 1
    if review.flag_count >= 5:
        review.status = "flagged"
    db.commit()
    return {"message": "Review flagged. Our team will review it."}


@router.get("/product/{product_id}")
async def get_product_reviews(
    product_id: int,
    db: Session = Depends(get_db),
    page: int = 1,
    page_size: int = 10,
):
    query = db.query(Review).filter(
        Review.product_id == product_id,
        Review.status == "published",
    ).order_by(Review.created_at.desc())
    return paginate(query, page, page_size)
