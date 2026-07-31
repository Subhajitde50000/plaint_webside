from pydantic import BaseModel
from typing import Optional, List
from decimal import Decimal
from datetime import datetime, date, time


class GardenServiceTypeSchema(BaseModel):
    id: int
    name: str
    slug: str
    description: Optional[str] = None
    duration_hours: Optional[Decimal] = None
    base_price: Decimal
    image_url: Optional[str] = None
    is_active: bool = True
    sort_order: int = 1

    model_config = {"from_attributes": True}


class CreateGardenServiceTypeRequest(BaseModel):
    name: str
    slug: Optional[str] = None
    description: Optional[str] = None
    duration_hours: Optional[Decimal] = Decimal("2.0")
    base_price: Decimal
    image_url: Optional[str] = None
    is_active: bool = True
    sort_order: Optional[int] = 1


class UpdateGardenServiceTypeRequest(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    duration_hours: Optional[Decimal] = None
    base_price: Optional[Decimal] = None
    image_url: Optional[str] = None
    is_active: Optional[bool] = None
    sort_order: Optional[int] = None


class GardenerSchema(BaseModel):
    id: int
    name: str
    phone: str
    email: Optional[str] = None
    city: str
    state: Optional[str] = None
    specialisations: Optional[str] = None
    is_active: bool = True
    rating_average: Decimal = Decimal("0.00")
    rating_count: int = 0
    joined_at: Optional[date] = None

    model_config = {"from_attributes": True}


class CreateGardenerRequest(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    city: str
    state: Optional[str] = None
    specialisations: Optional[str] = None
    is_active: bool = True


class UpdateGardenerRequest(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    specialisations: Optional[str] = None
    is_active: Optional[bool] = None


class CreateBookingRequest(BaseModel):
    service_type_id: int
    guest_name: Optional[str] = None
    guest_email: Optional[str] = None
    guest_phone: str
    address_id: Optional[int] = None
    scheduled_date: date
    scheduled_time_from: str    # "HH:MM"
    scheduled_time_to: Optional[str] = None
    city: str
    state: Optional[str] = None
    pincode: str
    address_full: str
    customer_notes: Optional[str] = None


class GardenBookingResponse(BaseModel):
    id: int
    uuid: str
    booking_number: str
    user_id: Optional[int] = None
    guest_name: Optional[str] = None
    guest_email: Optional[str] = None
    guest_phone: str
    service_type_id: int
    scheduled_date: date
    scheduled_time_from: Optional[str] = None
    scheduled_time_to: Optional[str] = None
    city: str
    state: Optional[str] = None
    pincode: str
    address_full: Optional[str] = None
    amount: Decimal
    payment_status: str
    status: str
    assigned_gardener_id: Optional[int] = None
    customer_notes: Optional[str] = None
    admin_notes: Optional[str] = None
    cancelled_at: Optional[datetime] = None
    cancel_reason: Optional[str] = None
    created_at: datetime
    service_type: Optional[GardenServiceTypeSchema] = None
    gardener: Optional[GardenerSchema] = None

    model_config = {"from_attributes": True}


class AdminUpdateBookingRequest(BaseModel):
    status: Optional[str] = None
    payment_status: Optional[str] = None
    assigned_gardener_id: Optional[int] = None
    admin_notes: Optional[str] = None
    cancel_reason: Optional[str] = None

