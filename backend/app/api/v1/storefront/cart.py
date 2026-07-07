from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import uuid

from app.database import get_db
from app.dependencies import get_current_user, get_optional_user
from app.models.cart import Cart, CartItem
from app.models.product import ProductVariant
from app.models.discount import Discount
from app.schemas.cart import AddCartItemRequest, UpdateCartItemRequest, ApplyDiscountRequest
from app.models.user import User
from datetime import datetime, timezone, timedelta

router = APIRouter(prefix="/cart", tags=["Cart"])


def _get_or_create_cart(user, db: Session) -> Cart:
    cart = db.query(Cart).filter(Cart.user_id == user.id).first()
    if not cart:
        cart = Cart(
            uuid=str(uuid.uuid4()),
            user_id=user.id,
            expires_at=datetime.now(timezone.utc) + timedelta(days=30),
        )
        db.add(cart)
        db.flush()
    return cart


@router.get("/")
async def get_cart(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    cart = db.query(Cart).filter(Cart.user_id == user.id).first()
    if not cart:
        return {"uuid": None, "items": [], "subtotal": 0}

    items = []
    subtotal = 0.0
    for item in cart.items:
        variant = item.variant
        product = variant.product if variant else None
        price = float(item.price_at_add)
        items.append({
            "id": item.id,
            "variant_id": item.variant_id,
            "quantity": item.quantity,
            "price_at_add": price,
            "total": price * item.quantity,
            "product_title": product.title if product else "",
            "variant_title": variant.option_name if variant else "",
            "image_url": (
                next((img.url for img in product.images if img.is_primary), None)
                if product and product.images else None
            ),
        })
        subtotal += price * item.quantity

    return {"uuid": cart.uuid, "items": items, "subtotal": round(subtotal, 2)}


@router.post("/items/", status_code=status.HTTP_201_CREATED)
async def add_item(
    payload: AddCartItemRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    variant = db.query(ProductVariant).filter(
        ProductVariant.id == payload.variant_id,
        ProductVariant.is_active == True,
    ).first()
    if not variant:
        raise HTTPException(status_code=404, detail="Product variant not found.")

    cart = _get_or_create_cart(user, db)

    existing = db.query(CartItem).filter(
        CartItem.cart_id == cart.id,
        CartItem.variant_id == payload.variant_id,
    ).first()

    if existing:
        existing.quantity += payload.quantity
    else:
        db.add(CartItem(
            cart_id=cart.id,
            variant_id=payload.variant_id,
            quantity=payload.quantity,
            price_at_add=variant.price,
        ))
    db.commit()
    return {"message": "Item added to cart."}


@router.patch("/items/{item_id}")
async def update_item(
    item_id: int,
    payload: UpdateCartItemRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    cart = db.query(Cart).filter(Cart.user_id == user.id).first()
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found.")

    item = db.query(CartItem).filter(
        CartItem.id == item_id, CartItem.cart_id == cart.id
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found.")

    if payload.quantity <= 0:
        db.delete(item)
    else:
        item.quantity = payload.quantity
    db.commit()
    return {"message": "Cart updated."}


@router.delete("/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_item(
    item_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    cart = db.query(Cart).filter(Cart.user_id == user.id).first()
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found.")
    item = db.query(CartItem).filter(
        CartItem.id == item_id, CartItem.cart_id == cart.id
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found.")
    db.delete(item)
    db.commit()


@router.post("/apply-discount")
async def apply_discount(
    payload: ApplyDiscountRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    from datetime import datetime, timezone
    discount = db.query(Discount).filter(
        Discount.code == payload.code.upper(),
        Discount.status == "active",
        Discount.starts_at <= datetime.now(timezone.utc),
    ).first()
    if not discount:
        raise HTTPException(status_code=400, detail="Invalid or expired discount code.")
    return {"valid": True, "code": discount.code, "discount_type": discount.discount_type, "value": str(discount.value)}


@router.delete("/remove-discount")
async def remove_discount(user: User = Depends(get_current_user)):
    return {"message": "Discount removed."}
