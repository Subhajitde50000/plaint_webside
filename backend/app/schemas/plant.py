from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime


class UserPlantSchema(BaseModel):
    id: int
    plant_name: str
    nickname: Optional[str] = None
    location: Optional[str] = None
    photo_url: Optional[str] = None
    added_at: date
    last_watered_at: Optional[date] = None
    next_water_due: Optional[date] = None
    watering_interval_days: int = 7

    model_config = {"from_attributes": True}


class CreateUserPlantRequest(BaseModel):
    plant_name: str
    nickname: Optional[str] = None
    product_id: Optional[int] = None
    location: Optional[str] = None
    photo_url: Optional[str] = None
    added_at: date
    watering_interval_days: int = 7


class UpdateUserPlantRequest(BaseModel):
    nickname: Optional[str] = None
    location: Optional[str] = None
    photo_url: Optional[str] = None
    watering_interval_days: Optional[int] = None
    last_watered_at: Optional[date] = None
    next_water_due: Optional[date] = None


class AddCareLogRequest(BaseModel):
    type: str  # watered, fertilised, repotted, pruned, note
    note: Optional[str] = None
