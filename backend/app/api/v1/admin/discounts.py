import uuid as _uuid
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.database import get_db
from app.dependencies import require_ops_or_above, require_marketing, get_current_admin
from app.models.discount import Discount
from app.models.admin import AdminUser
from app.schemas.discount import CreateDiscountRequest, UpdateDiscountRequest, DiscountSchema
from app.utils.pagination import paginate

router = APIRouter(prefix="/admin/discounts", tags=["Admin - Discounts"])


@router.get("/")
async def list_discounts(
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=100),
    status: Optional[str] = None,
):
    query = db.query(Discount)
    if status:
        query = query.filter(Discount.status == status)
    query = query.order_by(Discount.created_at.desc())
    return paginate(query, page, page_size)


@router.post("/", status_code=201)
async def create_discount(
    payload: CreateDiscountRequest,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_ops_or_above),
):
    if payload.code:
        exists = db.query(Discount).filter(Discount.code == payload.code.upper()).first()
        if exists:
            raise HTTPException(status_code=409, detail="Discount code already exists.")

    disc = Discount(
        uuid=str(_uuid.uuid4()),
        created_by=admin.id,
        code=payload.code.upper() if payload.code else None,
        **{k: v for k, v in payload.model_dump().items() if k != "code"},
    )
    db.add(disc)
    db.commit()
    db.refresh(disc)
    return disc


@router.put("/{discount_uuid}")
async def update_discount(
    discount_uuid: str,
    payload: UpdateDiscountRequest,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_ops_or_above),
):
    disc = db.query(Discount).filter(Discount.uuid == discount_uuid).first()
    if not disc:
        raise HTTPException(status_code=404, detail="Discount not found.")
    for field, val in payload.model_dump(exclude_none=True).items():
        setattr(disc, field, val)
    db.commit()
    return disc


@router.delete("/{discount_uuid}", status_code=204)
async def delete_discount(
    discount_uuid: str,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_ops_or_above),
):
    disc = db.query(Discount).filter(Discount.uuid == discount_uuid).first()
    if not disc:
        raise HTTPException(status_code=404, detail="Discount not found.")
    db.delete(disc)
    db.commit()


@router.post("/{discount_uuid}/activate")
async def activate_discount(
    discount_uuid: str,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_ops_or_above),
):
    disc = db.query(Discount).filter(Discount.uuid == discount_uuid).first()
    if not disc:
        raise HTTPException(status_code=404, detail="Discount not found.")
    disc.status = "active"
    db.commit()
    return {"message": "Discount activated."}


@router.post("/{discount_uuid}/deactivate")
async def deactivate_discount(
    discount_uuid: str,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_ops_or_above),
):
    disc = db.query(Discount).filter(Discount.uuid == discount_uuid).first()
    if not disc:
        raise HTTPException(status_code=404, detail="Discount not found.")
    disc.status = "paused"
    db.commit()
    return {"message": "Discount deactivated."}
