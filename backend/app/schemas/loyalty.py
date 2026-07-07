from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class LoyaltyAccountSchema(BaseModel):
    id: int
    user_id: int
    points_balance: int
    tier: str
    lifetime_points: int
    tier_updated_at: Optional[datetime] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class LoyaltyTransactionSchema(BaseModel):
    id: int
    type: str
    points: int
    balance_after: int
    description: Optional[str] = None
    order_id: Optional[int] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class WishlistItemSchema(BaseModel):
    id: int
    product_id: int
    variant_id: Optional[int] = None
    added_at: datetime

    model_config = {"from_attributes": True}


class AdjustPointsRequest(BaseModel):
    points: int
    reason: str


class AdminSetTierRequest(BaseModel):
    tier: str  # plant_lover | silver | gold
