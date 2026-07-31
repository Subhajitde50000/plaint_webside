import uuid as _uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
import random

from app.database import get_db
from app.dependencies import get_current_user, get_optional_user
from app.models.garden_service import GardenServiceType, GardenBooking
from app.models.user import User
from app.schemas.garden_service import CreateBookingRequest, GardenBookingResponse
from app.services.garden_seed import seed_garden_services_if_empty

router = APIRouter(prefix="/garden-services", tags=["Garden Services"])


@router.get("/types")
async def list_service_types(db: Session = Depends(get_db)):
    seed_garden_services_if_empty(db)
    types = db.query(GardenServiceType).filter(
        GardenServiceType.is_active == True
    ).order_by(GardenServiceType.sort_order).all()
    return types


@router.post("/bookings", status_code=status.HTTP_201_CREATED)
async def create_booking(
    payload: CreateBookingRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_optional_user),
):
    service_type = db.query(GardenServiceType).filter(
        GardenServiceType.id == payload.service_type_id,
        GardenServiceType.is_active == True,
    ).first()
    if not service_type:
        raise HTTPException(status_code=404, detail="Service type not found.")

    booking_number = f"GRD-{''.join([str(random.randint(0,9)) for _ in range(6)])}"

    booking = GardenBooking(
        uuid=str(_uuid.uuid4()),
        booking_number=booking_number,
        user_id=user.id if user else None,
        guest_name=payload.guest_name,
        guest_email=payload.guest_email,
        guest_phone=payload.guest_phone,
        service_type_id=payload.service_type_id,
        address_id=payload.address_id,
        scheduled_date=payload.scheduled_date,
        scheduled_time_from=payload.scheduled_time_from,
        scheduled_time_to=payload.scheduled_time_to,
        city=payload.city,
        state=payload.state,
        pincode=payload.pincode,
        address_full=payload.address_full,
        customer_notes=payload.customer_notes,
        amount=service_type.base_price,
    )
    db.add(booking)
    db.commit()
    
    return db.query(GardenBooking).options(
        joinedload(GardenBooking.service_type)
    ).filter(GardenBooking.id == booking.id).first()


@router.get("/bookings/{booking_uuid}")
async def get_booking(
    booking_uuid: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_optional_user),
):
    booking = db.query(GardenBooking).options(
        joinedload(GardenBooking.service_type),
        joinedload(GardenBooking.gardener),
    ).filter(
        GardenBooking.uuid == booking_uuid
    ).first()

    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found.")
    if user and booking.user_id and booking.user_id != user.id:
        raise HTTPException(status_code=403, detail="Access denied.")
    return booking


@router.get("/my-bookings")
async def my_bookings(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    bookings = db.query(GardenBooking).options(
        joinedload(GardenBooking.service_type),
        joinedload(GardenBooking.gardener),
    ).filter(
        GardenBooking.user_id == user.id
    ).order_by(GardenBooking.created_at.desc()).all()
    return bookings

