from pydantic import BaseModel, Field
from typing import Literal, Optional, List
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
    points: int = Field(ge=-100_000, le=100_000)
    reason: str = Field(min_length=3, max_length=255)


class AdminSetTierRequest(BaseModel):
    tier: Literal["plant_lover", "silver", "gold"]
