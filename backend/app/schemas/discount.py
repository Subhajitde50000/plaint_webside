from pydantic import BaseModel
from typing import Optional, List
from decimal import Decimal
from datetime import datetime


class DiscountSchema(BaseModel):
    id: int
    uuid: str
    code: Optional[str] = None
    title: str
    method: str
    discount_type: str
    value: Optional[Decimal] = None
    max_discount_amount: Optional[Decimal] = None
    applies_to: str
    customer_eligibility: str
    min_requirement_type: str
    min_requirement_value: Optional[Decimal] = None
    usage_limit_total: Optional[int] = None
    usage_limit_per_customer: int = 1
    usage_count: int = 0
    combine_with_product: bool = False
    combine_with_order: bool = False
    combine_with_shipping: bool = False
    starts_at: datetime
    ends_at: Optional[datetime] = None
    status: str

    model_config = {"from_attributes": True}


class CreateDiscountRequest(BaseModel):
    code: Optional[str] = None
    title: str
    method: str
    discount_type: str
    value: Optional[Decimal] = None
    max_discount_amount: Optional[Decimal] = None
    applies_to: str = "all"
    customer_eligibility: str = "all"
    min_requirement_type: str = "none"
    min_requirement_value: Optional[Decimal] = None
    usage_limit_total: Optional[int] = None
    usage_limit_per_customer: int = 1
    starts_at: datetime
    ends_at: Optional[datetime] = None
    status: str = "draft"


class UpdateDiscountRequest(BaseModel):
    title: Optional[str] = None
    value: Optional[Decimal] = None
    max_discount_amount: Optional[Decimal] = None
    usage_limit_total: Optional[int] = None
    starts_at: Optional[datetime] = None
    ends_at: Optional[datetime] = None
    status: Optional[str] = None


class ValidateDiscountResponse(BaseModel):
    valid: bool
    discount_type: Optional[str] = None
    discount_amount: Optional[Decimal] = None
    message: str
