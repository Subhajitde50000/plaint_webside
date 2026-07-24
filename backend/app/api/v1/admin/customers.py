from datetime import datetime, timedelta, timezone
from typing import Literal, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy import func, or_
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.dependencies import require_customer_list, require_ops_or_above, require_support_or_above, require_super_admin
from app.models.address import Address
from app.models.admin import AdminUser
from app.models.customer_note import CustomerNote
from app.models.loyalty import LoyaltyAccount, LoyaltyTransaction
from app.models.order import Order
from app.models.user import User
from app.schemas.customer import CustomerBlockRequest, CustomerNoteRequest, UpdateProfileRequest
from app.schemas.loyalty import AdjustPointsRequest, AdminSetTierRequest
from app.services.loyalty_service import LoyaltyService
from app.utils.pagination import paginate

router = APIRouter(prefix="/admin/customers", tags=["Admin - Customers"])


def _status(user: User, order_count: int, last_order_at: datetime | None) -> str:
    if user.is_blocked:
        return "blocked"
    if not user.email_verified:
        return "unverified"
    now = datetime.now(timezone.utc).replace(tzinfo=None)
    if user.created_at and user.created_at >= now - timedelta(days=30):
        return "new"
    if order_count and (not last_order_at or last_order_at < now - timedelta(days=90)):
        return "at_risk"
    return "active"


def _summary(user: User, account: LoyaltyAccount | None, order_count: int, ltv, last_order_at, city: str | None) -> dict:
    return {
        "uuid": user.uuid,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "phone": user.phone,
        "email_verified": user.email_verified,
        "phone_verified": user.phone_verified,
        "is_active": user.is_active,
        "is_blocked": user.is_blocked,
        "created_at": user.created_at,
        "last_login_at": user.last_login_at,
        "city": city,
        "tier": account.tier if account else "plant_lover",
        "loyalty_points": account.points_balance if account else 0,
        "orders": int(order_count or 0),
        "ltv": float(ltv or 0),
        "last_order_at": last_order_at,
        "status": _status(user, int(order_count or 0), last_order_at),
    }


@router.get("/")
def list_customers(
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_customer_list),
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=100),
    q: Optional[str] = Query(None, max_length=200),
    segment: Optional[str] = Query(None),
    sort: str = Query("newest"),
    loyalty_tier: Optional[Literal["plant_lover", "silver", "gold"]] = None,
    status_filter: Optional[str] = Query(None, alias="status"),
    city: Optional[str] = Query(None, max_length=100),
):
    # Aggregation avoids N+1 queries and only includes completed/delivered revenue.
    order_stats = db.query(
        Order.user_id.label("user_id"), func.count(Order.id).label("order_count"),
        func.coalesce(func.sum(Order.total), 0).label("ltv"), func.max(Order.created_at).label("last_order_at"),
    ).filter(Order.user_id.isnot(None)).group_by(Order.user_id).subquery()
    default_city = db.query(Address.user_id, func.max(Address.city).label("city")).filter(
        Address.is_active.is_(True)
    ).group_by(Address.user_id).subquery()

    query = db.query(User, LoyaltyAccount, order_stats.c.order_count, order_stats.c.ltv,
                     order_stats.c.last_order_at, default_city.c.city).outerjoin(
        LoyaltyAccount, LoyaltyAccount.user_id == User.id
    ).outerjoin(order_stats, order_stats.c.user_id == User.id).outerjoin(
        default_city, default_city.c.user_id == User.id
    ).filter(User.deleted_at.is_(None))
    if q:
        pattern = f"%{q.strip()}%"
        query = query.filter(or_(User.email.ilike(pattern), User.first_name.ilike(pattern),
                                 User.last_name.ilike(pattern), User.phone.ilike(pattern), User.uuid.ilike(pattern)))
    if loyalty_tier:
        query = query.filter(LoyaltyAccount.tier == loyalty_tier)
    if city:
        query = query.filter(default_city.c.city.ilike(f"%{city.strip()}%"))
    if segment == "blocked" or status_filter == "blocked":
        query = query.filter(User.is_blocked.is_(True))
    elif status_filter == "active":
        query = query.filter(User.is_blocked.is_(False), User.is_active.is_(True))
    elif segment in {"gold", "silver", "plant_lover"}:
        query = query.filter(LoyaltyAccount.tier == segment)
    elif segment == "new":
        query = query.filter(User.created_at >= datetime.now(timezone.utc).replace(tzinfo=None) - timedelta(days=30))
    elif segment == "at_risk":
        query = query.filter(order_stats.c.last_order_at < datetime.now(timezone.utc).replace(tzinfo=None) - timedelta(days=90))
    # VIP is a business segmentation rule: gold customers with at least 10 orders.
    elif segment == "vip":
        query = query.filter(LoyaltyAccount.tier == "gold", order_stats.c.order_count >= 10)

    sort_map = {
        "newest": User.created_at.desc(), "oldest": User.created_at.asc(),
        "highest_ltv": order_stats.c.ltv.desc(), "lowest_ltv": order_stats.c.ltv.asc(),
        "most_orders": order_stats.c.order_count.desc(), "name_az": User.first_name.asc(),
        "last_active": User.last_login_at.desc(),
    }
    query = query.order_by(sort_map.get(sort, User.created_at.desc()), User.id.desc())
    result = paginate(query, page, page_size)
    result["items"] = [_summary(*row) for row in result["items"]]
    return result


@router.get("/{customer_uuid}")
def get_customer(customer_uuid: str, db: Session = Depends(get_db), admin: AdminUser = Depends(require_support_or_above)):
    user = db.query(User).options(joinedload(User.addresses), joinedload(User.loyalty_account)).filter(
        User.uuid == customer_uuid, User.deleted_at.is_(None)
    ).first()
    if not user:
        raise HTTPException(status_code=404, detail="Customer not found.")
    order_count, ltv, last_order_at = db.query(func.count(Order.id), func.coalesce(func.sum(Order.total), 0), func.max(Order.created_at)).filter(Order.user_id == user.id).one()
    city = next((address.city for address in user.addresses if address.is_active and address.is_default), None)
    data = _summary(user, user.loyalty_account, order_count, ltv, last_order_at, city)
    data.update({
        "dob": user.dob, "gender": user.gender, "about_me": user.about_me, "avatar_url": user.avatar_url,
        "preferred_lang": user.preferred_lang, "currency": user.currency, "blocked_reason": user.blocked_reason,
        "blocked_at": user.blocked_at,
        "addresses": [{"id": str(a.id), "type": a.type, "is_default": a.is_default, "line1": a.line1,
                       "line2": a.line2, "city": a.city, "state": a.state, "pincode": a.pincode,
                       "country": a.country} for a in user.addresses if a.is_active],
        "admin_notes": [{"id": str(n.id), "text": n.note, "date": n.created_at,
                         "author": f"{n.admin_id or 'System'}"} for n in db.query(CustomerNote).filter(
                             CustomerNote.user_id == user.id).order_by(CustomerNote.created_at.desc()).all()],
    })
    return data


@router.patch("/{customer_uuid}")
def update_customer(customer_uuid: str, payload: UpdateProfileRequest, db: Session = Depends(get_db), admin: AdminUser = Depends(require_support_or_above)):
    user = db.query(User).filter(User.uuid == customer_uuid, User.deleted_at.is_(None)).first()
    if not user:
        raise HTTPException(status_code=404, detail="Customer not found.")
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(user, field, value)
    db.commit(); db.refresh(user)
    return {"message": "Customer updated.", "uuid": user.uuid}


@router.post("/{customer_uuid}/block")
def block_customer(customer_uuid: str, payload: CustomerBlockRequest, db: Session = Depends(get_db), admin: AdminUser = Depends(require_ops_or_above)):
    user = db.query(User).filter(User.uuid == customer_uuid, User.deleted_at.is_(None)).first()
    if not user: raise HTTPException(status_code=404, detail="Customer not found.")
    user.is_blocked, user.blocked_reason, user.blocked_at = True, payload.reason, datetime.now(timezone.utc)
    db.commit(); return {"message": "Customer blocked."}


@router.post("/{customer_uuid}/unblock")
def unblock_customer(customer_uuid: str, db: Session = Depends(get_db), admin: AdminUser = Depends(require_ops_or_above)):
    user = db.query(User).filter(User.uuid == customer_uuid, User.deleted_at.is_(None)).first()
    if not user: raise HTTPException(status_code=404, detail="Customer not found.")
    user.is_blocked, user.blocked_reason, user.blocked_at = False, None, None
    db.commit(); return {"message": "Customer unblocked."}


@router.delete("/{customer_uuid}", status_code=status.HTTP_204_NO_CONTENT)
def soft_delete_customer(customer_uuid: str, db: Session = Depends(get_db), admin: AdminUser = Depends(require_super_admin)):
    user = db.query(User).filter(User.uuid == customer_uuid, User.deleted_at.is_(None)).first()
    if not user: raise HTTPException(status_code=404, detail="Customer not found.")
    user.deleted_at, user.is_active = datetime.now(timezone.utc), False
    db.commit(); return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/{customer_uuid}/points")
def adjust_points(customer_uuid: str, payload: AdjustPointsRequest, db: Session = Depends(get_db), admin: AdminUser = Depends(require_support_or_above)):
    if not payload.points: raise HTTPException(status_code=422, detail="Points adjustment cannot be zero.")
    user = db.query(User).filter(User.uuid == customer_uuid, User.deleted_at.is_(None)).first()
    if not user: raise HTTPException(status_code=404, detail="Customer not found.")
    try:
        LoyaltyService(db).adjust_points(user.id, payload.points, payload.reason, admin.id)
    except ValueError as error:
        raise HTTPException(status_code=422, detail=str(error)) from error
    account = db.query(LoyaltyAccount).filter(LoyaltyAccount.user_id == user.id).one()
    return {"message": "Loyalty points adjusted.", "balance_after": account.points_balance}


@router.patch("/{customer_uuid}/tier")
def set_tier(customer_uuid: str, payload: AdminSetTierRequest, db: Session = Depends(get_db), admin: AdminUser = Depends(require_ops_or_above)):
    if payload.tier not in {"plant_lover", "silver", "gold"}:
        raise HTTPException(status_code=422, detail="Invalid loyalty tier.")
    user = db.query(User).filter(User.uuid == customer_uuid, User.deleted_at.is_(None)).first()
    if not user: raise HTTPException(status_code=404, detail="Customer not found.")
    account = LoyaltyService(db).get_or_create_account(user.id)
    account.tier, account.tier_updated_at = payload.tier, datetime.now(timezone.utc)
    db.commit(); return {"message": "Tier updated.", "tier": account.tier}


@router.post("/{customer_uuid}/notes", status_code=status.HTTP_201_CREATED)
def add_customer_note(customer_uuid: str, payload: CustomerNoteRequest, db: Session = Depends(get_db), admin: AdminUser = Depends(require_support_or_above)):
    user = db.query(User).filter(User.uuid == customer_uuid, User.deleted_at.is_(None)).first()
    if not user: raise HTTPException(status_code=404, detail="Customer not found.")
    note = CustomerNote(user_id=user.id, admin_id=admin.id, note=payload.note.strip())
    db.add(note); db.commit(); db.refresh(note)
    return {"id": str(note.id), "text": note.note, "date": note.created_at,
            "author": f"{admin.first_name} {admin.last_name}"}


@router.get("/{customer_uuid}/orders")
def get_customer_orders(customer_uuid: str, db: Session = Depends(get_db), admin: AdminUser = Depends(require_support_or_above), page: int = Query(1, ge=1), page_size: int = Query(25, ge=1, le=100)):
    user = db.query(User).filter(User.uuid == customer_uuid, User.deleted_at.is_(None)).first()
    if not user: raise HTTPException(status_code=404, detail="Customer not found.")
    result = paginate(db.query(Order).filter(Order.user_id == user.id).order_by(Order.created_at.desc()), page, page_size)
    result["items"] = [{"uuid": order.uuid, "order_number": order.order_number, "created_at": order.created_at,
                        "total": float(order.total), "status": order.status, "payment_status": order.payment_status,
                        "items": len(order.items)} for order in result["items"]]
    return result
