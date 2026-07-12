from pydantic import BaseModel
from typing import Optional, List
from decimal import Decimal
from datetime import datetime, date


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
    service_type_id: int
    guest_phone: str
    scheduled_date: date
    city: str
    pincode: str
    amount: Decimal
    payment_status: str
    status: str
    customer_notes: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class AdminUpdateBookingRequest(BaseModel):
    status: Optional[str] = None
    assigned_gardener_id: Optional[int] = None
    admin_notes: Optional[str] = None
    cancel_reason: Optional[str] = None


class GardenerSchema(BaseModel):
    id: int
    name: str
    phone: str
    email: Optional[str] = None
    city: str
    state: Optional[str] = None
    is_active: bool = True
    rating_average: Decimal = Decimal("0.00")
    rating_count: int = 0

    model_config = {"from_attributes": True}
