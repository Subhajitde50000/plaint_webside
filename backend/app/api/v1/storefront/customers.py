from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.models.address import Address
from app.models.loyalty import LoyaltyAccount, LoyaltyTransaction, Wishlist, WishlistItem
from app.models.plant import UserPlant, PlantCareLog
from app.schemas.customer import CustomerProfile, UpdateProfileRequest, CreateAddressRequest
from app.schemas.plant import (
    UserPlantSchema, CreateUserPlantRequest, UpdateUserPlantRequest, AddCareLogRequest
)
from datetime import date

router = APIRouter(prefix="/customers", tags=["Customers"])


@router.get("/me", response_model=CustomerProfile)
async def get_my_profile(user: User = Depends(get_current_user)):
    return user


@router.patch("/me")
async def update_profile(
    payload: UpdateProfileRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    for field, val in payload.model_dump(exclude_none=True).items():
        setattr(user, field, val)
    db.commit()
    return {"message": "Profile updated."}


# ── Addresses ─────────────────────────────────────────────────────────
@router.get("/me/addresses")
async def get_addresses(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    addresses = db.query(Address).filter(
        Address.user_id == user.id, Address.is_active == True
    ).all()
    return addresses


@router.post("/me/addresses", status_code=status.HTTP_201_CREATED)
async def add_address(
    payload: CreateAddressRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    if payload.is_default:
        db.query(Address).filter(Address.user_id == user.id).update({"is_default": False})

    addr = Address(user_id=user.id, **payload.model_dump())
    db.add(addr)
    db.commit()
    db.refresh(addr)
    return addr


@router.patch("/me/addresses/{address_id}")
async def update_address(
    address_id: int,
    payload: CreateAddressRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    addr = db.query(Address).filter(
        Address.id == address_id, Address.user_id == user.id
    ).first()
    if not addr:
        raise HTTPException(status_code=404, detail="Address not found.")
    if payload.is_default:
        db.query(Address).filter(Address.user_id == user.id).update({"is_default": False})
    for field, val in payload.model_dump(exclude_none=True).items():
        setattr(addr, field, val)
    db.commit()
    return addr


@router.delete("/me/addresses/{address_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_address(
    address_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    addr = db.query(Address).filter(
        Address.id == address_id, Address.user_id == user.id
    ).first()
    if not addr:
        raise HTTPException(status_code=404, detail="Address not found.")
    addr.is_active = False
    db.commit()


# ── Loyalty ────────────────────────────────────────────────────────────
@router.get("/me/loyalty")
async def get_loyalty(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    account = db.query(LoyaltyAccount).filter(LoyaltyAccount.user_id == user.id).first()
    if not account:
        return {"points_balance": 0, "tier": "plant_lover", "lifetime_points": 0}
    transactions = db.query(LoyaltyTransaction).filter(
        LoyaltyTransaction.user_id == user.id
    ).order_by(LoyaltyTransaction.created_at.desc()).limit(10).all()
    return {
        "points_balance": account.points_balance,
        "tier": account.tier,
        "lifetime_points": account.lifetime_points,
        "tier_updated_at": account.tier_updated_at,
        "recent_transactions": [
            {"type": t.type, "points": t.points, "description": t.description, "created_at": t.created_at}
            for t in transactions
        ],
    }


# ── Wishlist ───────────────────────────────────────────────────────────
@router.get("/me/wishlist")
async def get_wishlist(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    wishlist = db.query(Wishlist).filter(Wishlist.user_id == user.id).first()
    if not wishlist:
        return {"items": []}
    return {"items": [
        {
            "id": item.id,
            "product_id": item.product_id,
            "variant_id": item.variant_id,
            "added_at": item.added_at,
            "product_title": item.product.title if item.product else None,
        }
        for item in wishlist.items
    ]}


@router.post("/me/wishlist/{product_id}", status_code=status.HTTP_201_CREATED)
async def add_to_wishlist(
    product_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    wishlist = db.query(Wishlist).filter(Wishlist.user_id == user.id).first()
    if not wishlist:
        import uuid
        wishlist = Wishlist(user_id=user.id)
        db.add(wishlist)
        db.flush()

    exists = db.query(WishlistItem).filter(
        WishlistItem.wishlist_id == wishlist.id,
        WishlistItem.product_id == product_id,
    ).first()
    if not exists:
        db.add(WishlistItem(wishlist_id=wishlist.id, product_id=product_id))
        db.commit()
    return {"message": "Added to wishlist."}


@router.delete("/me/wishlist/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_from_wishlist(
    product_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    wishlist = db.query(Wishlist).filter(Wishlist.user_id == user.id).first()
    if wishlist:
        db.query(WishlistItem).filter(
            WishlistItem.wishlist_id == wishlist.id,
            WishlistItem.product_id == product_id,
        ).delete()
        db.commit()


# ── My Plants ──────────────────────────────────────────────────────────
@router.get("/me/plants")
async def get_my_plants(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    plants = db.query(UserPlant).filter(UserPlant.user_id == user.id).all()
    return plants


@router.post("/me/plants", status_code=status.HTTP_201_CREATED)
async def add_plant(
    payload: CreateUserPlantRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    plant = UserPlant(user_id=user.id, **payload.model_dump())
    db.add(plant)
    db.commit()
    db.refresh(plant)
    return plant


@router.patch("/me/plants/{plant_id}")
async def update_plant(
    plant_id: int,
    payload: UpdateUserPlantRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    plant = db.query(UserPlant).filter(
        UserPlant.id == plant_id, UserPlant.user_id == user.id
    ).first()
    if not plant:
        raise HTTPException(status_code=404, detail="Plant not found.")
    for field, val in payload.model_dump(exclude_none=True).items():
        setattr(plant, field, val)
    db.commit()
    return plant


@router.post("/me/plants/{plant_id}/log", status_code=status.HTTP_201_CREATED)
async def add_care_log(
    plant_id: int,
    payload: AddCareLogRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    plant = db.query(UserPlant).filter(
        UserPlant.id == plant_id, UserPlant.user_id == user.id
    ).first()
    if not plant:
        raise HTTPException(status_code=404, detail="Plant not found.")

    log = PlantCareLog(plant_id=plant_id, **payload.model_dump())
    db.add(log)

    # Update watering date if watered
    if payload.type == "watered":
        from datetime import timedelta
        plant.last_watered_at = date.today()
        plant.next_water_due = date.today() + timedelta(days=plant.watering_interval_days or 7)

    db.commit()
    return log
