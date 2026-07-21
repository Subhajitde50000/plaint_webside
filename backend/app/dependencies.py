from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError
import pprint

from app.database import get_db
from app.utils.security import decode_token
from app.models.user import User
from app.models.admin import AdminUser

oauth2_storefront = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)
oauth2_admin = OAuth2PasswordBearer(tokenUrl="/api/v1/admin/auth/login", auto_error=False)


def get_current_user(
    token: str = Depends(oauth2_storefront),
    db: Session = Depends(get_db),
) -> User:
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    try:
        payload = decode_token(token)
        uuid: str = payload.get("sub")
        if not uuid:
            raise ValueError
    except (JWTError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = db.query(User).filter(User.uuid == uuid, User.is_active == True).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found.")
    # pprint.pprint(user.__dict__)
    return user


def get_optional_user(
    token: str = Depends(oauth2_storefront),
    db: Session = Depends(get_db),
) -> User | None:
    """Return user if authenticated, else None (for optional-auth endpoints)."""
    if not token:
        return None
    try:
        payload = decode_token(token)
        uuid: str = payload.get("sub")
        if not uuid:
            return None
        return db.query(User).filter(User.uuid == uuid, User.is_active == True).first()
    except (JWTError, ValueError, Exception):
        return None


def get_current_admin(
    token: str = Depends(oauth2_admin),
    db: Session = Depends(get_db),
) -> AdminUser:
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated.")
    try:
        payload = decode_token(token)
        uuid: str = payload.get("sub")
        role: str = payload.get("role")
        if not uuid or not role:
            raise ValueError
    except (JWTError, ValueError):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials.")

    admin = db.query(AdminUser).filter(
        AdminUser.uuid == uuid,
        AdminUser.is_active == True
    ).first()
    if not admin:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Admin not found.")
    return admin


def require_role(*roles: str):
    """Factory for role-based access control."""
    def checker(admin: AdminUser = Depends(get_current_admin)):
        if admin.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to access this resource.",
            )
        return admin
    return checker


# Role shortcuts
require_super_admin = require_role("super_admin")
require_ops_or_above = require_role("super_admin", "operations_manager")
require_support_or_above = require_role("super_admin", "operations_manager", "customer_support")
require_marketing = require_role("super_admin", "operations_manager", "marketing")
require_inventory = require_role("super_admin", "operations_manager", "inventory_manager")
require_analyst = require_role("super_admin", "operations_manager", "marketing", "analyst")
require_garden = require_role("super_admin", "operations_manager", "garden_services")
