from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from typing import Optional

from app.database import get_db
from app.dependencies import require_support_or_above, require_ops_or_above, require_super_admin, get_current_admin
from app.models.user import User
from app.models.admin import AdminUser
from app.schemas.customer import UpdateProfileRequest, AdminCustomerListItem, AdminCustomerDetail
from app.schemas.loyalty import AdjustPointsRequest, AdminSetTierRequest
from app.services.loyalty_service import LoyaltyService
from app.utils.pagination import paginate

router = APIRouter(prefix="/admin/customers", tags=["Admin - Customers"])


@router.get("/")
async def list_customers(
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_support_or_above),
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=100),
    search: Optional[str] = None,
    is_blocked: Optional[bool] = None,
):
    query = db.query(User).filter(User.deleted_at == None)
    if search:
        query = query.filter(
            User.email.ilike(f"%{search}%") | User.first_name.ilike(f"%{search}%")
        )
    if is_blocked is not None:
        query = query.filter(User.is_blocked == is_blocked)
    query = query.order_by(User.created_at.desc())
    return paginate(query, page, page_size)


@router.get("/{customer_uuid}")
async def get_customer(
    customer_uuid: str,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_support_or_above),
):
    user = db.query(User).filter(User.uuid == customer_uuid).first()
    if not user:
        raise HTTPException(status_code=404, detail="Customer not found.")
    return user


@router.patch("/{customer_uuid}")
async def update_customer(
    customer_uuid: str,
    payload: UpdateProfileRequest,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_support_or_above),
):
    user = db.query(User).filter(User.uuid == customer_uuid).first()
    if not user:
        raise HTTPException(status_code=404, detail="Customer not found.")
    for field, val in payload.model_dump(exclude_none=True).items():
        setattr(user, field, val)
    db.commit()
    return {"message": "Customer updated."}


@router.post("/{customer_uuid}/block")
async def block_customer(
    customer_uuid: str,
    reason: str,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_ops_or_above),
):
    user = db.query(User).filter(User.uuid == customer_uuid).first()
    if not user:
        raise HTTPException(status_code=404, detail="Customer not found.")
    user.is_blocked = True
    user.blocked_reason = reason
    user.blocked_at = datetime.now(timezone.utc)
    db.commit()
    return {"message": "Customer blocked."}


@router.delete("/{customer_uuid}", status_code=204)
async def soft_delete_customer(
    customer_uuid: str,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_super_admin),
):
    user = db.query(User).filter(User.uuid == customer_uuid).first()
    if not user:
        raise HTTPException(status_code=404, detail="Customer not found.")
    user.deleted_at = datetime.now(timezone.utc)
    user.is_active = False
    db.commit()


@router.post("/{customer_uuid}/points")
async def adjust_points(
    customer_uuid: str,
    payload: AdjustPointsRequest,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_support_or_above),
):
    user = db.query(User).filter(User.uuid == customer_uuid).first()
    if not user:
        raise HTTPException(status_code=404, detail="Customer not found.")
    svc = LoyaltyService(db)
    svc.adjust_points(user.id, payload.points, payload.reason, admin.id)
    return {"message": f"Loyalty points adjusted by {payload.points}."}


@router.post("/{customer_uuid}/tier")
async def set_tier(
    customer_uuid: str,
    payload: AdminSetTierRequest,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_ops_or_above),
):
    from app.models.loyalty import LoyaltyAccount
    user = db.query(User).filter(User.uuid == customer_uuid).first()
    if not user:
        raise HTTPException(status_code=404, detail="Customer not found.")
    account = db.query(LoyaltyAccount).filter(LoyaltyAccount.user_id == user.id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Loyalty account not found.")
    account.tier = payload.tier
    account.tier_updated_at = datetime.now(timezone.utc)
    db.commit()
    return {"message": f"Tier set to {payload.tier}."}
