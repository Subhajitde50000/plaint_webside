import uuid
from datetime import datetime, timezone, timedelta

from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User, RefreshToken, VerificationToken
from app.schemas.auth import (
    RegisterRequest, LoginResponse, ForgotPasswordRequest,
    ResetPasswordRequest, TokenRefreshRequest,
)

# Inline login schema (separate from register)
from pydantic import BaseModel, EmailStr

class _LoginRequest(BaseModel):
    email: EmailStr
    password: str

from app.utils.security import (
    hash_password, verify_password, create_access_token,
    create_refresh_token, generate_verification_token, sha256_hash, decode_token,
)
from app.config import settings
from app.tasks.email_tasks import send_verification_email, send_password_reset_email

router = APIRouter(prefix="/auth", tags=["Auth — Storefront"])

REFRESH_COOKIE = "refresh_token"


def _set_refresh_cookie(response: Response, raw_token: str):
    response.set_cookie(
        key=REFRESH_COOKIE,
        value=raw_token,
        httponly=True,
        secure=settings.ENVIRONMENT == "production",
        samesite="lax",
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 86400,
    )


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == payload.email.lower()).first():
        raise HTTPException(status_code=409, detail="Email already registered.")

    user = User(
        uuid=str(uuid.uuid4()),
        first_name=payload.first_name,
        last_name=payload.last_name,
        email=payload.email.lower(),
        phone=payload.phone,
        password_hash=hash_password(payload.password),
    )
    db.add(user)
    db.flush()

    # Create loyalty account
    from app.models.loyalty import LoyaltyAccount, Wishlist
    db.add(LoyaltyAccount(user_id=user.id))
    db.add(Wishlist(user_id=user.id))

    # Verification token
    token = generate_verification_token()
    db.add(VerificationToken(
        user_id=user.id,
        token=token,
        type="email_verify",
        expires_at=datetime.now(timezone.utc) + timedelta(hours=24),
    ))
    db.commit()

    # Send verification email async via Celery
    send_verification_email.delay(user.id, user.email, user.first_name, token)

    return {"message": "Registration successful. Please verify your email.", "user_uuid": user.uuid}


@router.post("/login", response_model=LoginResponse)
async def login(
    payload: _LoginRequest,
    response: Response,
    db: Session = Depends(get_db),
):
    # Accept email+password (reuse RegisterRequest fields)
    user = db.query(User).filter(
        User.email == payload.email.lower(),
        User.deleted_at == None,
    ).first()

    if not user or not user.password_hash or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    if user.is_blocked:
        raise HTTPException(status_code=403, detail="Account is blocked. Contact support.")

    user.last_login_at = datetime.now(timezone.utc)

    access_token = create_access_token(subject=user.uuid)
    raw_refresh, refresh_hash = create_refresh_token()

    db.add(RefreshToken(
        user_id=user.id,
        token_hash=refresh_hash,
        expires_at=datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
    ))
    db.commit()

    _set_refresh_cookie(response, raw_refresh)
    return LoginResponse(access_token=access_token)


@router.post("/refresh")
async def refresh_token(
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
):
    raw = request.cookies.get(REFRESH_COOKIE)
    if not raw:
        raise HTTPException(status_code=401, detail="No refresh token provided.")

    token_hash = sha256_hash(raw)
    record = db.query(RefreshToken).filter(
        RefreshToken.token_hash == token_hash,
        RefreshToken.revoked_at == None,
        RefreshToken.expires_at > datetime.now(timezone.utc),
    ).first()
    if not record:
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token.")

    user = db.query(User).filter(User.id == record.user_id, User.is_active == True).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found.")

    # Revoke old token (rotation)
    record.revoked_at = datetime.now(timezone.utc)

    access_token = create_access_token(subject=user.uuid)
    raw_refresh, refresh_hash = create_refresh_token()
    db.add(RefreshToken(
        user_id=user.id,
        token_hash=refresh_hash,
        expires_at=datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
    ))
    db.commit()

    _set_refresh_cookie(response, raw_refresh)
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/logout")
async def logout(request: Request, response: Response, db: Session = Depends(get_db)):
    raw = request.cookies.get(REFRESH_COOKIE)
    if raw:
        token_hash = sha256_hash(raw)
        record = db.query(RefreshToken).filter(
            RefreshToken.token_hash == token_hash
        ).first()
        if record:
            record.revoked_at = datetime.now(timezone.utc)
            db.commit()
    response.delete_cookie(REFRESH_COOKIE)
    return {"message": "Logged out successfully."}


@router.post("/forgot-password")
async def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if user:
        token = generate_verification_token()
        db.add(VerificationToken(
            user_id=user.id,
            token=token,
            type="password_reset",
            expires_at=datetime.now(timezone.utc) + timedelta(hours=2),
        ))
        db.commit()
        send_password_reset_email.delay(user.id, user.email, user.first_name, token)
    # Always return 200 to avoid email enumeration
    return {"message": "If that email exists, a password reset link has been sent."}


@router.post("/reset-password")
async def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    record = db.query(VerificationToken).filter(
        VerificationToken.token == payload.token,
        VerificationToken.type == "password_reset",
        VerificationToken.used_at == None,
        VerificationToken.expires_at > datetime.now(timezone.utc),
    ).first()
    if not record:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token.")

    user = db.query(User).filter(User.id == record.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    user.password_hash = hash_password(payload.new_password)
    record.used_at = datetime.now(timezone.utc)
    db.commit()
    return {"message": "Password reset successful. You can now log in."}


@router.post("/verify-email/{token}")
async def verify_email(token: str, db: Session = Depends(get_db)):
    record = db.query(VerificationToken).filter(
        VerificationToken.token == token,
        VerificationToken.type == "email_verify",
        VerificationToken.used_at == None,
        VerificationToken.expires_at > datetime.now(timezone.utc),
    ).first()
    if not record:
        raise HTTPException(status_code=400, detail="Invalid or expired verification token.")

    user = db.query(User).filter(User.id == record.user_id).first()
    if user:
        user.email_verified = True
    record.used_at = datetime.now(timezone.utc)
    db.commit()
    return {"message": "Email verified successfully."}
