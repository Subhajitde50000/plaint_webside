from pydantic import BaseModel, model_validator
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
    plant_name: Optional[str] = None
    name: Optional[str] = None
    species: Optional[str] = None
    nickname: Optional[str] = None
    product_id: Optional[int] = None
    location: Optional[str] = None
    photo_url: Optional[str] = None
    image_url: Optional[str] = None
    added_at: Optional[date] = None
    acquired_at: Optional[date] = None
    added: Optional[str] = None
    watering_interval_days: int = 7

    @model_validator(mode="after")
    def validate_and_normalize(self):
        name_val = self.plant_name or self.name or self.species or self.nickname or "My Plant"
        self.plant_name = name_val

        if not self.photo_url and self.image_url:
            self.photo_url = self.image_url

        if not self.added_at:
            date_val = self.acquired_at
            if not date_val and self.added:
                try:
                    date_val = date.fromisoformat(str(self.added).split("T")[0])
                except Exception:
                    date_val = date.today()
            self.added_at = date_val or date.today()

        return self


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
