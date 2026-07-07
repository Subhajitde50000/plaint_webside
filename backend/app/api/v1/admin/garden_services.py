from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.database import get_db
from app.dependencies import require_garden, require_ops_or_above, get_current_admin
from app.models.garden_service import GardenBooking, Gardener
from app.models.admin import AdminUser
from app.schemas.garden_service import AdminUpdateBookingRequest, GardenerSchema
from app.utils.pagination import paginate
from datetime import datetime, timezone

router = APIRouter(prefix="/admin/garden-services", tags=["Admin - Garden Services"])


@router.get("/bookings")
async def list_bookings(
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_garden),
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=100),
    status: Optional[str] = None,
):
    query = db.query(GardenBooking)
    if status:
        query = query.filter(GardenBooking.status == status)
    query = query.order_by(GardenBooking.scheduled_date.asc())
    return paginate(query, page, page_size)


@router.patch("/bookings/{booking_uuid}")
async def update_booking(
    booking_uuid: str,
    payload: AdminUpdateBookingRequest,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_garden),
):
    booking = db.query(GardenBooking).filter(GardenBooking.uuid == booking_uuid).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found.")

    for field, val in payload.model_dump(exclude_none=True).items():
        setattr(booking, field, val)

    if payload.status == "cancelled":
        booking.cancelled_at = datetime.now(timezone.utc)

    db.commit()
    return booking


@router.get("/gardeners")
async def list_gardeners(
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_garden),
    is_active: Optional[bool] = None,
):
    query = db.query(Gardener)
    if is_active is not None:
        query = query.filter(Gardener.is_active == is_active)
    return query.all()
