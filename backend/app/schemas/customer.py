from pydantic import BaseModel, EmailStr
from typing import Optional, List
from decimal import Decimal
from datetime import datetime


class AddressSchema(BaseModel):
    id: int
    type: Optional[str] = None
    label: Optional[str] = None
    recipient_name: str
    phone: str
    line1: str
    line2: Optional[str] = None
    city: str
    state: str
    pincode: str
    country: str = "India"
    is_default: bool = False

    model_config = {"from_attributes": True}


class CreateAddressRequest(BaseModel):
    type: Optional[str] = "home"
    label: Optional[str] = None
    recipient_name: str
    phone: str
    line1: str
    line2: Optional[str] = None
    city: str
    state: str
    pincode: str
    country: str = "India"
    is_default: bool = False


class CustomerProfile(BaseModel):
    id: int
    uuid: str
    first_name: str
    last_name: str
    email: str
    phone: Optional[str] = None
    dob: Optional[str] = None
    gender: Optional[str] = None
    about_me: Optional[str] = None
    avatar_url: Optional[str] = None
    preferred_lang: str = "en"
    currency: str = "INR"
    email_verified: bool = False
    phone_verified: bool = False
    is_active: bool = True
    created_at: datetime

    model_config = {"from_attributes": True}


class UpdateProfileRequest(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    dob: Optional[str] = None
    gender: Optional[str] = None
    about_me: Optional[str] = None
    preferred_lang: Optional[str] = None


class AdminCustomerListItem(BaseModel):
    id: int
    uuid: str
    first_name: str
    last_name: str
    email: str
    phone: Optional[str] = None
    email_verified: bool
    is_active: bool
    is_blocked: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class AdminCustomerDetail(CustomerProfile):
    is_blocked: bool = False
    blocked_reason: Optional[str] = None
    blocked_at: Optional[datetime] = None
    last_login_at: Optional[datetime] = None
    deleted_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
