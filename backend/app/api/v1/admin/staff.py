import uuid as _uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime, timezone

from app.database import get_db
from app.dependencies import require_super_admin
from app.models.admin import AdminUser
from app.utils.security import hash_password
from app.utils.pagination import paginate

router = APIRouter(prefix="/admin/staff", tags=["Admin - Staff"])


class CreateStaffRequest(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    role: str


class UpdateStaffRequest(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None


@router.get("/")
async def list_staff(
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_super_admin),
    page: int = 1,
    page_size: int = 25,
):
    query = db.query(AdminUser).order_by(AdminUser.created_at.desc())
    return paginate(query, page, page_size)


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_staff(
    payload: CreateStaffRequest,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_super_admin),
):
    if db.query(AdminUser).filter(AdminUser.email == payload.email.lower()).first():
        raise HTTPException(status_code=409, detail="Email already in use.")

    new_admin = AdminUser(
        uuid=str(_uuid.uuid4()),
        first_name=payload.first_name,
        last_name=payload.last_name,
        email=payload.email.lower(),
        password_hash=hash_password(payload.password),
        role=payload.role,
    )
    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)
    return new_admin


@router.patch("/{staff_uuid}")
async def update_staff(
    staff_uuid: str,
    payload: UpdateStaffRequest,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_super_admin),
):
    staff = db.query(AdminUser).filter(AdminUser.uuid == staff_uuid).first()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff member not found.")
    for field, val in payload.model_dump(exclude_none=True).items():
        setattr(staff, field, val)
    db.commit()
    return staff


@router.delete("/{staff_uuid}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_staff(
    staff_uuid: str,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_super_admin),
):
    staff = db.query(AdminUser).filter(AdminUser.uuid == staff_uuid).first()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff member not found.")
    staff.is_active = False
    db.commit()
