from datetime import datetime, timezone, timedelta

from fastapi import APIRouter, Depends, HTTPException, Response, Request
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.admin import AdminUser, AdminRefreshToken
from app.schemas.auth import AdminLoginRequest, AdminLoginResponse
from app.utils.security import verify_password, create_access_token, create_refresh_token, sha256_hash
from app.config import settings

router = APIRouter(prefix="/admin/auth", tags=["Auth — Admin"])
REFRESH_COOKIE = "admin_refresh_token"


def _set_cookie(response: Response, raw: str):
    response.set_cookie(
        key=REFRESH_COOKIE,
        value=raw,
        httponly=True,
        secure=settings.ENVIRONMENT == "production",
        samesite="lax",
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 86400,
    )


@router.post("/login", response_model=AdminLoginResponse)
async def admin_login(
    payload: AdminLoginRequest,
    response: Response,
    db: Session = Depends(get_db),
):
    admin = db.query(AdminUser).filter(
        AdminUser.email == payload.email.lower(),
        AdminUser.is_active == True,
    ).first()

    if not admin or not verify_password(payload.password, admin.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    admin.last_login_at = datetime.now(timezone.utc)

    access_token = create_access_token(subject=admin.uuid, role=admin.role)
    raw_refresh, refresh_hash = create_refresh_token()
    db.add(AdminRefreshToken(
        admin_id=admin.id,
        token_hash=refresh_hash,
        expires_at=datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
    ))
    db.commit()

    _set_cookie(response, raw_refresh)
    return AdminLoginResponse(
        access_token=access_token,
        role=admin.role,
        admin_uuid=admin.uuid,
        first_name=admin.first_name,
        last_name=admin.last_name,
    )


@router.post("/refresh")
async def admin_refresh(
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
):
    raw = request.cookies.get(REFRESH_COOKIE)
    if not raw:
        raise HTTPException(status_code=401, detail="No refresh token provided.")

    token_hash = sha256_hash(raw)
    record = db.query(AdminRefreshToken).filter(
        AdminRefreshToken.token_hash == token_hash,
        AdminRefreshToken.revoked_at == None,
        AdminRefreshToken.expires_at > datetime.now(timezone.utc),
    ).first()
    if not record:
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token.")

    admin = db.query(AdminUser).filter(
        AdminUser.id == record.admin_id, AdminUser.is_active == True
    ).first()
    if not admin:
        raise HTTPException(status_code=401, detail="Admin not found.")

    record.revoked_at = datetime.now(timezone.utc)
    access_token = create_access_token(subject=admin.uuid, role=admin.role)
    raw_refresh, refresh_hash = create_refresh_token()
    db.add(AdminRefreshToken(
        admin_id=admin.id,
        token_hash=refresh_hash,
        expires_at=datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
    ))
    db.commit()

    _set_cookie(response, raw_refresh)
    return {"access_token": access_token, "token_type": "bearer", "role": admin.role}


@router.post("/logout")
async def admin_logout(request: Request, response: Response, db: Session = Depends(get_db)):
    raw = request.cookies.get(REFRESH_COOKIE)
    if raw:
        token_hash = sha256_hash(raw)
        record = db.query(AdminRefreshToken).filter(
            AdminRefreshToken.token_hash == token_hash
        ).first()
        if record:
            record.revoked_at = datetime.now(timezone.utc)
            db.commit()
    response.delete_cookie(REFRESH_COOKIE)
    return {"message": "Logged out."}
