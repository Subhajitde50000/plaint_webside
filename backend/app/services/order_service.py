from sqlalchemy.orm import Session
from datetime import datetime, timezone
from typing import Optional
import random, string

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
        suffix = "".join(random.choices(string.digits, k=4))
        return f"ORD-{suffix}"

    def create_order(self, user: User, payload: CreateOrderRequest) -> Order:
        db = self.db

        # 1. Validate and lock cart items
        cart = db.query(Cart).filter(Cart.user_id == user.id).first()
        if not cart or not cart.items:
            raise ValueError("Cart is empty.")

        # 2. Calculate pricing
        subtotal = sum(
            item.price_at_add * item.quantity for item in cart.items
        )
        discount_amount = 0.00
        discount_id = None

        if payload.discount_code:
            discount = self._validate_discount(payload.discount_code, user, subtotal)
            discount_amount = self._calculate_discount(discount, cart.items, subtotal)
            discount_id = discount.id

        # 3. Loyalty points
        loyalty_discount = 0.00
        if payload.loyalty_points_to_use:
            account = db.query(LoyaltyAccount).filter(
                LoyaltyAccount.user_id == user.id
            ).first()
            max_use = min(payload.loyalty_points_to_use, account.points_balance)
            loyalty_discount = max_use * 0.10  # 1 pt = ₹0.10
            payload.loyalty_points_to_use = max_use

        # 4. Shipping & Tax
        shipping = 0.00 if (subtotal - discount_amount) >= 499 else 99.00
        taxable = subtotal - discount_amount - loyalty_discount
        tax = round(taxable * 0.18, 2)
        total = taxable + shipping + tax

        # 5. Create order
        order = Order(
            order_number=self.generate_order_number(),
            user_id=user.id,
            subtotal=subtotal,
            discount_amount=discount_amount,
            shipping_amount=shipping,
            tax_amount=tax,
            total=total,
            discount_id=discount_id,
            discount_code=payload.discount_code,
            loyalty_points_used=payload.loyalty_points_to_use or 0,
            loyalty_discount_amount=loyalty_discount,
            shipping_address_id=payload.address_id,
            gift_message=payload.gift_message,
            is_gift=bool(payload.gift_message),
            notes=payload.notes,
        )
        db.add(order)
        db.flush()

        # 6. Create order items from cart
        for cart_item in cart.items:
            db.add(OrderItem(
                order_id=order.id,
                variant_id=cart_item.variant_id,
                product_id=cart_item.variant.product_id,
                title=cart_item.variant.product.title,
                variant_title=cart_item.variant.option_name,
                sku=cart_item.variant.sku,
                quantity=cart_item.quantity,
                unit_price=cart_item.price_at_add,
                compare_at_price=cart_item.variant.compare_at_price,
                total_price=cart_item.price_at_add * cart_item.quantity,
                image_url=(
                    cart_item.variant.product.images[0].url
                    if cart_item.variant.product.images else None
                ),
            ))

        # 7. Reserve inventory
        for cart_item in cart.items:
            inventory = db.query(Inventory).filter(
                Inventory.variant_id == cart_item.variant_id
            ).with_for_update().first()

            if inventory.quantity - inventory.reserved < cart_item.quantity:
                db.rollback()
                raise ValueError(
                    f"Insufficient stock for {cart_item.variant.product.title}"
                )
            inventory.reserved += cart_item.quantity

        # 8. Initial status history
        db.add(OrderStatusHistory(
            order_id=order.id,
            status="order_placed",
            description="Order placed by customer"
        ))

        db.commit()
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

        if discount.usage_limit_total and discount.usage_count >= discount.usage_limit_total:
            raise ValueError("This discount code has reached its usage limit.")

        if discount.min_requirement_type == "amount":
            if subtotal < discount.min_requirement_value:
                raise ValueError(
                    f"Minimum order of ₹{discount.min_requirement_value:.0f} required."
                )

        return discount

    def _calculate_discount(
        self, discount: Discount, cart_items, subtotal: float
    ) -> float:
        if discount.discount_type == "percentage":
            amount = subtotal * (discount.value / 100)
            if discount.max_discount_amount:
                amount = min(amount, discount.max_discount_amount)
            return round(amount, 2)
        elif discount.discount_type == "fixed_amount":
            return min(discount.value, subtotal)
        elif discount.discount_type == "free_shipping":
            return 0.00  # handled in shipping calc
        return 0.00