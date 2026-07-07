from pydantic import BaseModel
from typing import Optional, List
from decimal import Decimal
from datetime import datetime


class CartItemSchema(BaseModel):
    id: int
    variant_id: int
    quantity: int
    price_at_add: Decimal

    model_config = {"from_attributes": True}


class CartResponse(BaseModel):
    id: int
    uuid: str
    items: List[CartItemSchema] = []

    model_config = {"from_attributes": True}


class AddCartItemRequest(BaseModel):
    variant_id: int
    quantity: int = 1


class UpdateCartItemRequest(BaseModel):
    quantity: int


class ApplyDiscountRequest(BaseModel):
    code: str
