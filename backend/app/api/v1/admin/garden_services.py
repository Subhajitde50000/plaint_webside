from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.sql import func
from typing import Optional
from datetime import datetime, timezone, date

from app.database import get_db
from app.dependencies import require_garden, require_ops_or_above, get_current_admin
from app.models.garden_service import GardenBooking, Gardener, GardenServiceType
from app.models.admin import AdminUser
from app.schemas.garden_service import (
    AdminUpdateBookingRequest,
    GardenServiceTypeSchema,
    CreateGardenServiceTypeRequest,
    UpdateGardenServiceTypeRequest,
    GardenerSchema,
    CreateGardenerRequest,
    UpdateGardenerRequest,
)
from app.utils.pagination import paginate

router = APIRouter(prefix="/admin/garden-services", tags=["Admin - Garden Services"])


@router.get("/stats")
async def get_garden_stats(
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_garden),
):
    total_bookings = db.query(GardenBooking).count()
    pending = db.query(GardenBooking).filter(GardenBooking.status == "pending").count()
    assigned = db.query(GardenBooking).filter(GardenBooking.status.in_(["confirmed", "assigned", "in_progress"])).count()
    completed = db.query(GardenBooking).filter(GardenBooking.status == "completed").count()
    revenue_res = db.query(func.sum(GardenBooking.amount)).filter(
        GardenBooking.status == "completed"
    ).scalar()
    total_revenue = float(revenue_res or 0)

    active_gardeners = db.query(Gardener).filter(Gardener.is_active == True).count()

    return {
        "total_bookings": total_bookings,
        "pending": pending,
        "assigned": assigned,
        "completed": completed,
        "total_revenue": total_revenue,
        "active_gardeners": active_gardeners,
    }


@router.get("/bookings")
async def list_bookings(
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_garden),
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=100),
    status: Optional[str] = None,
    q: Optional[str] = None,
):
    query = db.query(GardenBooking).options(
        joinedload(GardenBooking.service_type),
        joinedload(GardenBooking.gardener),
    )
    if status and status != "all":
        query = query.filter(GardenBooking.status == status)
    if q:
        search_term = f"%{q}%"
        query = query.filter(
            (GardenBooking.booking_number.ilike(search_term))
            | (GardenBooking.guest_name.ilike(search_term))
            | (GardenBooking.guest_phone.ilike(search_term))
            | (GardenBooking.city.ilike(search_term))
        )
    query = query.order_by(GardenBooking.created_at.desc())
    return paginate(query, page, page_size)


@router.get("/bookings/{booking_uuid}")
async def get_booking_detail(
    booking_uuid: str,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_garden),
):
    booking = db.query(GardenBooking).options(
        joinedload(GardenBooking.service_type),
        joinedload(GardenBooking.gardener),
    ).filter(GardenBooking.uuid == booking_uuid).first()

    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found.")
    return booking


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

    data = payload.model_dump(exclude_none=True)
    for field, val in data.items():
        setattr(booking, field, val)

    if payload.status == "cancelled" and not booking.cancelled_at:
        booking.cancelled_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(booking)

    # Fetch reloaded booking with relations
    return db.query(GardenBooking).options(
        joinedload(GardenBooking.service_type),
        joinedload(GardenBooking.gardener),
    ).filter(GardenBooking.id == booking.id).first()


# ── SERVICE TYPES MANAGEMENT ───────────────────────────────────────────────

@router.get("/types")
async def list_all_service_types(
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_garden),
    is_active: Optional[bool] = None,
):
    query = db.query(GardenServiceType)
    if is_active is not None:
        query = query.filter(GardenServiceType.is_active == is_active)
    return query.order_by(GardenServiceType.sort_order.asc()).all()


@router.post("/types", status_code=status.HTTP_201_CREATED)
async def create_service_type(
    payload: CreateGardenServiceTypeRequest,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_garden),
):
    slug = payload.slug
    if not slug:
        slug = payload.name.lower().replace(" ", "-").replace("&", "and")

    existing = db.query(GardenServiceType).filter(GardenServiceType.slug == slug).first()
    if existing:
        slug = f"{slug}-{int(datetime.now().timestamp())}"

    service_type = GardenServiceType(
        name=payload.name,
        slug=slug,
        description=payload.description,
        duration_hours=payload.duration_hours,
        base_price=payload.base_price,
        image_url=payload.image_url,
        is_active=payload.is_active,
        sort_order=payload.sort_order or 1,
    )
    db.add(service_type)
    db.commit()
    db.refresh(service_type)
    return service_type


@router.patch("/types/{type_id}")
async def update_service_type(
    type_id: int,
    payload: UpdateGardenServiceTypeRequest,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_garden),
):
    service_type = db.query(GardenServiceType).filter(GardenServiceType.id == type_id).first()
    if not service_type:
        raise HTTPException(status_code=404, detail="Service type not found.")

    for field, val in payload.model_dump(exclude_none=True).items():
        setattr(service_type, field, val)

    db.commit()
    db.refresh(service_type)
    return service_type


# ── GARDENERS MANAGEMENT ───────────────────────────────────────────────────

@router.get("/gardeners")
async def list_gardeners(
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_garden),
    is_active: Optional[bool] = None,
):
    query = db.query(Gardener)
    if is_active is not None:
        query = query.filter(Gardener.is_active == is_active)
    return query.order_by(Gardener.name.asc()).all()


@router.post("/gardeners", status_code=status.HTTP_201_CREATED)
async def create_gardener(
    payload: CreateGardenerRequest,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_garden),
):
    gardener = Gardener(
        name=payload.name,
        phone=payload.phone,
        email=payload.email,
        city=payload.city,
        state=payload.state,
        specialisations=payload.specialisations,
        is_active=payload.is_active,
        joined_at=date.today(),
    )
    db.add(gardener)
    db.commit()
    db.refresh(gardener)
    return gardener


@router.patch("/gardeners/{gardener_id}")
async def update_gardener(
    gardener_id: int,
    payload: UpdateGardenerRequest,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_garden),
):
    gardener = db.query(Gardener).filter(Gardener.id == gardener_id).first()
    if not gardener:
        raise HTTPException(status_code=404, detail="Gardener not found.")

    for field, val in payload.model_dump(exclude_none=True).items():
        setattr(gardener, field, val)

    db.commit()
    db.refresh(gardener)
    return gardener

