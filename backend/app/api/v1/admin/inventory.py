from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from app.database import get_db
from app.dependencies import require_inventory, get_current_admin
from app.models.inventory import Inventory, InventoryHistory
from app.models.product import ProductVariant
from app.models.admin import AdminUser
from app.utils.pagination import paginate

router = APIRouter(prefix="/admin/inventory", tags=["Admin - Inventory"])


class UpdateInventoryRequest(BaseModel):
    quantity: Optional[int] = None
    reorder_level: Optional[int] = None
    stock_policy: Optional[str] = None
    low_stock_alert: Optional[bool] = None


class AdjustInventoryRequest(BaseModel):
    quantity_change: int       # positive (purchase/return) or negative (damage/loss)
    type: str                  # adjustment, purchase, damage
    reason: Optional[str] = None
    reference_id: Optional[str] = None


@router.get("/")
async def list_inventory(
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_inventory),
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=100),
    low_stock_only: bool = False,
):
    query = db.query(Inventory)
    if low_stock_only:
        query = query.filter(
            (Inventory.quantity - Inventory.reserved) <= Inventory.reorder_level
        )
    return paginate(query, page, page_size)


@router.patch("/{variant_id}")
async def update_inventory(
    variant_id: int,
    payload: UpdateInventoryRequest,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_inventory),
):
    inv = db.query(Inventory).filter(Inventory.variant_id == variant_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Inventory record not found.")
    for field, val in payload.model_dump(exclude_none=True).items():
        setattr(inv, field, val)
    db.commit()
    return inv


@router.post("/{variant_id}/adjust")
async def adjust_inventory(
    variant_id: int,
    payload: AdjustInventoryRequest,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_inventory),
):
    inv = db.query(Inventory).filter(
        Inventory.variant_id == variant_id
    ).with_for_update().first()
    if not inv:
        raise HTTPException(status_code=404, detail="Inventory record not found.")

    before = inv.quantity
    inv.quantity = max(0, inv.quantity + payload.quantity_change)

    db.add(InventoryHistory(
        variant_id=variant_id,
        admin_id=admin.id,
        type=payload.type,
        quantity_change=payload.quantity_change,
        quantity_before=before,
        quantity_after=inv.quantity,
        reason=payload.reason,
        reference_id=payload.reference_id,
    ))
    db.commit()
    return {"message": "Inventory adjusted.", "new_quantity": inv.quantity}
