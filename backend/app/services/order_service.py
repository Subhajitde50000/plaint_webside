import random
import string
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy.orm import Session

from app.models.order import Order, OrderItem, OrderStatusHistory
from app.models.cart import Cart, CartItem
from app.models.inventory import Inventory
from app.models.discount import Discount, DiscountUsage
from app.models.loyalty import LoyaltyAccount
from app.schemas.order import CreateOrderRequest
from app.models.user import User


class OrderService:
    def __init__(self, db: Session):
        self.db = db

    def generate_order_number(self) -> str:
        suffix = "".join(random.choices(string.digits, k=6))
        return f"ORD-{suffix}"

    def create_order(self, user: User, payload: CreateOrderRequest) -> Order:
        db = self.db

        # 1. Validate and load cart items
        cart = db.query(Cart).filter(Cart.user_id == user.id).first()
        if not cart or not cart.items:
            raise ValueError("Cart is empty.")

        # 2. Calculate subtotal
        subtotal = sum(
            float(item.price_at_add) * item.quantity for item in cart.items
        )
        discount_amount = 0.00
        discount_id = None
        discount_code = None

        # 3. Apply discount code
        if payload.discount_code:
            discount = self._validate_discount(payload.discount_code, user, subtotal)
            discount_amount = self._calculate_discount(discount, cart.items, subtotal)
            discount_id = discount.id
            discount_code = payload.discount_code.upper()

        # 4. Loyalty points
        loyalty_discount = 0.00
        loyalty_points_used = 0
        if payload.loyalty_points_to_use and payload.loyalty_points_to_use > 0:
            account = db.query(LoyaltyAccount).filter(
                LoyaltyAccount.user_id == user.id
            ).first()
            if account:
                points = min(payload.loyalty_points_to_use, account.points_balance)
                loyalty_discount = round(points * 0.10, 2)   # 1 pt = ₹0.10
                loyalty_points_used = points

        # 5. Shipping & Tax
        taxable = subtotal - discount_amount - loyalty_discount
        shipping = 0.00 if taxable >= 499 else 99.00

        # Check for free_shipping discount
        if payload.discount_code and discount_id:
            disc = db.query(Discount).filter(Discount.id == discount_id).first()
            if disc and disc.discount_type == "free_shipping":
                shipping = 0.00

        tax = round(taxable * 0.18, 2)
        total = round(taxable + shipping + tax, 2)

        # 6. Create order record
        order = Order(
            order_number=self.generate_order_number(),
            user_id=user.id,
            subtotal=subtotal,
            discount_amount=discount_amount,
            shipping_amount=shipping,
            tax_amount=tax,
            total=total,
            discount_id=discount_id,
            discount_code=discount_code,
            loyalty_points_used=loyalty_points_used,
            loyalty_discount_amount=loyalty_discount,
            shipping_address_id=payload.address_id,
            gift_message=payload.gift_message,
            is_gift=bool(payload.gift_message),
            notes=payload.notes,
        )
        db.add(order)
        db.flush()  # get order.id

        # 7. Create order items from cart
        for cart_item in cart.items:
            variant = cart_item.variant
            product = variant.product
            primary_image = next(
                (img.url for img in product.images if img.is_primary), None
            ) or (product.images[0].url if product.images else None)

            db.add(OrderItem(
                order_id=order.id,
                variant_id=cart_item.variant_id,
                product_id=product.id,
                title=product.title,
                variant_title=variant.option_name,
                sku=variant.sku,
                quantity=cart_item.quantity,
                unit_price=cart_item.price_at_add,
                compare_at_price=variant.compare_at_price,
                total_price=float(cart_item.price_at_add) * cart_item.quantity,
                image_url=primary_image,
            ))

        # 8. Reserve inventory (SELECT FOR UPDATE prevents race conditions)
        for cart_item in cart.items:
            inventory = db.query(Inventory).filter(
                Inventory.variant_id == cart_item.variant_id
            ).with_for_update().first()

            if not inventory:
                db.rollback()
                raise ValueError(f"No inventory record for variant {cart_item.variant_id}")

            available = inventory.quantity - inventory.reserved
            if available < cart_item.quantity:
                db.rollback()
                raise ValueError(
                    f"Insufficient stock for '{cart_item.variant.product.title}'. "
                    f"Only {available} available."
                )
            inventory.reserved += cart_item.quantity

        # 9. Initial status history
        db.add(OrderStatusHistory(
            order_id=order.id,
            status="order_placed",
            description="Order placed by customer",
        ))

        db.commit()
        db.refresh(order)
        return order

    def _validate_discount(
        self, code: str, user: User, subtotal: float
    ) -> Discount:
        discount = self.db.query(Discount).filter(
            Discount.code == code.upper(),
            Discount.status == "active",
            Discount.starts_at <= datetime.now(timezone.utc),
        ).first()

        if not discount:
            raise ValueError("Invalid or expired discount code.")

        if discount.ends_at and discount.ends_at < datetime.now(timezone.utc):
            raise ValueError("This discount code has expired.")

        if (
            discount.usage_limit_total
            and discount.usage_count >= discount.usage_limit_total
        ):
            raise ValueError("This discount code has reached its usage limit.")

        if discount.min_requirement_type == "amount":
            if subtotal < float(discount.min_requirement_value or 0):
                raise ValueError(
                    f"Minimum order of ₹{discount.min_requirement_value:.0f} required."
                )

        # Per-customer limit check
        if user and discount.usage_limit_per_customer:
            user_usage = self.db.query(DiscountUsage).filter(
                DiscountUsage.discount_id == discount.id,
                DiscountUsage.user_id == user.id,
            ).count()
            if user_usage >= discount.usage_limit_per_customer:
                raise ValueError("You have already used this discount code.")

        return discount

    def _calculate_discount(
        self, discount: Discount, cart_items, subtotal: float
    ) -> float:
        if discount.discount_type == "percentage":
            amount = subtotal * (float(discount.value or 0) / 100)
            if discount.max_discount_amount:
                amount = min(amount, float(discount.max_discount_amount))
            return round(amount, 2)
        elif discount.discount_type == "fixed_amount":
            return round(min(float(discount.value or 0), subtotal), 2)
        elif discount.discount_type in ("free_shipping", "bogo"):
            return 0.00
        return 0.00
