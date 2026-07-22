import asyncio
from app.tasks.celery_app import celery_app
from app.database import SessionLocal
from app.models.order import Order, OrderStatusHistory
from app.models.inventory import Inventory, InventoryHistory
from app.services.loyalty_service import LoyaltyService
from app.services.notification_service import NotificationService


@celery_app.task(bind=True, max_retries=3, default_retry_delay=60)
def post_payment_tasks(self, order_id: int):
    """Run after payment confirmed: deduct inventory, award loyalty, send confirmation email."""
    db = SessionLocal()
    try:
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order or order.status == "cancelled":
            return

        # 1. Deduct reserved inventory → actual stock (if not already done synchronously)
        for item in order.items:
            inv = db.query(Inventory).filter(
                Inventory.variant_id == item.variant_id
            ).with_for_update().first()
            if inv:
                already_deducted = db.query(InventoryHistory).filter(
                    InventoryHistory.reference_id == order.order_number,
                    InventoryHistory.variant_id == item.variant_id,
                    InventoryHistory.type == "sale",
                ).first()
                if not already_deducted:
                    inv.reserved = max(0, inv.reserved - item.quantity)
                    inv.quantity = max(0, inv.quantity - item.quantity)
                    db.add(InventoryHistory(
                        variant_id=item.variant_id,
                        type="sale",
                        quantity_change=-item.quantity,
                        quantity_before=inv.quantity + item.quantity,
                        quantity_after=inv.quantity,
                        reason=f"Order {order.order_number} payment confirmed",
                        reference_id=order.order_number,
                    ))

        # 2. Award loyalty points
        if order.user_id:
            LoyaltyService(db).earn_points(order.user_id, order)

        # 3. Update discount usage count
        if order.discount_id:
            from app.models.discount import Discount, DiscountUsage
            disc = db.query(Discount).filter(Discount.id == order.discount_id).first()
            if disc:
                disc.usage_count += 1
                db.add(DiscountUsage(
                    discount_id=order.discount_id,
                    order_id=order.id,
                    user_id=order.user_id,
                    discount_amount=order.discount_amount,
                ))

        db.commit()

        # 4. Send confirmation email (async in sync context)
        if order.user_id and order.user:
            notif = NotificationService()
            asyncio.run(notif.order_confirmed(order.user, order))

    except Exception as exc:
        db.rollback()
        raise self.retry(exc=exc)
    finally:
        db.close()


@celery_app.task(bind=True, max_retries=3)
def deduct_inventory_on_fulfillment(self, order_id: int):
    """Release reserved stock after fulfillment."""
    db = SessionLocal()
    try:
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            return
        for item in order.items:
            inv = db.query(Inventory).filter(
                Inventory.variant_id == item.variant_id
            ).with_for_update().first()
            if inv:
                inv.reserved = max(0, inv.reserved - item.quantity)
        db.commit()
    except Exception as exc:
        db.rollback()
        raise self.retry(exc=exc)
    finally:
        db.close()


@celery_app.task
def release_inventory_on_cancel(order_id: int):
    """Return reserved stock to available on order cancellation."""
    db = SessionLocal()
    try:
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            return
        for item in order.items:
            # Check if a sale was logged for this order and variant
            sale_history = db.query(InventoryHistory).filter(
                InventoryHistory.reference_id == order.order_number,
                InventoryHistory.variant_id == item.variant_id,
                InventoryHistory.type == "sale"
            ).first()

            # Check if we already restocked it (to prevent duplicate restocking)
            restock_history = db.query(InventoryHistory).filter(
                InventoryHistory.reference_id == order.order_number,
                InventoryHistory.variant_id == item.variant_id,
                InventoryHistory.type == "adjustment",
                InventoryHistory.reason.like("%cancelled (restocked)%")
            ).first()

            inv = db.query(Inventory).filter(
                Inventory.variant_id == item.variant_id
            ).with_for_update().first()

            if inv:
                if sale_history and not restock_history:
                    # Payment was confirmed and quantity was already decremented; restore quantity.
                    inv.quantity += item.quantity
                    db.add(InventoryHistory(
                        variant_id=item.variant_id,
                        type="adjustment",
                        quantity_change=item.quantity,
                        quantity_before=inv.quantity - item.quantity,
                        quantity_after=inv.quantity,
                        reason=f"Order {order.order_number} cancelled (restocked)",
                        reference_id=order.order_number,
                    ))
                elif not sale_history:
                    # Payment was not confirmed; release reservation.
                    inv.reserved = max(0, inv.reserved - item.quantity)
        db.commit()
    finally:
        db.close()


@celery_app.task
def send_fulfillment_notification(order_id: int):
    """Send shipped notification email to customer."""
    db = SessionLocal()
    try:
        order = db.query(Order).filter(Order.id == order_id).first()
        if order and order.user_id and order.user:
            notif = NotificationService()
            asyncio.run(notif.order_shipped(order.user, order))
    finally:
        db.close()
