from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class ReviewPhotoSchema(BaseModel):
    url: str
    position: int = 1

    model_config = {"from_attributes": True}


class ReviewSchema(BaseModel):
    id: int
    uuid: str
    product_id: int
    reviewer_name: str
    rating: int
    title: Optional[str] = None
    body: Optional[str] = None
    is_verified_purchase: bool = False
    is_featured: bool = False
    status: str
    admin_reply: Optional[str] = None
    admin_reply_at: Optional[datetime] = None
    helpful_count: int = 0
    not_helpful_count: int = 0
    created_at: datetime
    photos: List[ReviewPhotoSchema] = []

    model_config = {"from_attributes": True}


class SubmitReviewRequest(BaseModel):
    product_id: int
    order_item_id: Optional[int] = None
    reviewer_name: str
    reviewer_email: Optional[str] = None
    rating: int
    title: Optional[str] = None
    body: Optional[str] = None


class ReviewHelpfulRequest(BaseModel):
    helpful: bool  # True = helpful, False = not helpful


class ReviewFlagRequest(BaseModel):
    reason: str
    notes: Optional[str] = None


class AdminReviewReplyRequest(BaseModel):
    reply: str


class AdminReviewRejectRequest(BaseModel):
    reason: str
