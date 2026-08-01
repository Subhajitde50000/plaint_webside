from pydantic import BaseModel, model_validator
from typing import Optional
from datetime import date, datetime


class UserPlantSchema(BaseModel):
    id:                     int
    plant_name:             str
    nickname:               Optional[str] = None
    location:               Optional[str] = None
    photo_url:              Optional[str] = None
    added_at:               date
    last_watered_at:        Optional[date] = None
    next_water_due:         Optional[date] = None
    watering_interval_days: int = 7
    last_fertilised_at:     Optional[date] = None
    last_repotted_at:       Optional[date] = None
    height_cm:              Optional[float] = None
    growth_stage:           Optional[str] = None
    pot_size_cm:            Optional[int] = None
    soil_type:              Optional[str] = None
    sunlight_exposure:      Optional[str] = None
    health_status:          Optional[str] = "healthy"
    is_pet_household:       bool = False
    user_notes:             Optional[str] = None

    model_config = {"from_attributes": True}


class CreateUserPlantRequest(BaseModel):
    # Basic identity — accept several field name variants for compatibility
    plant_name:             Optional[str] = None
    name:                   Optional[str] = None
    species:                Optional[str] = None
    nickname:               Optional[str] = None
    product_id:             Optional[int] = None
    location:               Optional[str] = None
    photo_url:              Optional[str] = None
    image_url:              Optional[str] = None
    added_at:               Optional[date] = None
    acquired_at:            Optional[date] = None
    added:                  Optional[str] = None

    # Care schedule
    watering_interval_days: int = 7
    last_watered_at:        Optional[date] = None
    last_fertilised_at:     Optional[date] = None
    last_repotted_at:       Optional[date] = None

    # Plant characteristics
    height_cm:              Optional[float] = None
    growth_stage:           Optional[str] = None
    pot_size_cm:            Optional[int] = None
    soil_type:              Optional[str] = None
    sunlight_exposure:      Optional[str] = None
    health_status:          Optional[str] = "healthy"
    is_pet_household:       bool = False
    user_notes:             Optional[str] = None

    @model_validator(mode="after")
    def validate_and_normalize(self):
        # Resolve plant_name from any alias
        self.plant_name = self.plant_name or self.name or self.species or self.nickname or "My Plant"

        # Resolve photo_url alias
        if not self.photo_url and self.image_url:
            self.photo_url = self.image_url

        # Resolve added_at from any alias
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
    nickname:               Optional[str] = None
    location:               Optional[str] = None
    photo_url:              Optional[str] = None
    watering_interval_days: Optional[int] = None
    last_watered_at:        Optional[date] = None
    next_water_due:         Optional[date] = None
    last_fertilised_at:     Optional[date] = None
    last_repotted_at:       Optional[date] = None
    height_cm:              Optional[float] = None
    growth_stage:           Optional[str] = None
    pot_size_cm:            Optional[int] = None
    soil_type:              Optional[str] = None
    sunlight_exposure:      Optional[str] = None
    health_status:          Optional[str] = None
    is_pet_household:       Optional[bool] = None
    user_notes:             Optional[str] = None


class AddCareLogRequest(BaseModel):
    type:          str            # watered | fertilised | repotted | pruned | note
    note:          Optional[str] = None
    care_category: Optional[str] = None
