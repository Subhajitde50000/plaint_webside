from datetime import datetime, timezone, timedelta
from app.tasks.celery_app import celery_app
from app.database import SessionLocal
from app.models.discount import Discount
from app.models.cart import Cart
from app.models.user import VerificationToken


@celery_app.task
def update_discount_statuses():
    """Every 5 minutes: activate scheduled discounts and expire ended ones."""
    db = SessionLocal()
    now = datetime.now(timezone.utc)
    try:
        # Activate scheduled → active
        db.query(Discount).filter(
            Discount.status == "scheduled",
            Discount.starts_at <= now,
        ).update({"status": "active"})

        # Expire active → expired
        db.query(Discount).filter(
            Discount.status == "active",
            Discount.ends_at != None,
            Discount.ends_at < now,
        ).update({"status": "expired"})

        # Expire usage-limit-reached discounts
        db.query(Discount).filter(
            Discount.status == "active",
            Discount.usage_limit_total != None,
            Discount.usage_count >= Discount.usage_limit_total,
        ).update({"status": "expired"})

        db.commit()
    finally:
        db.close()


@celery_app.task
def expire_old_carts():
    """Daily: remove guest carts older than 7 days."""
    db = SessionLocal()
    try:
        cutoff = datetime.now(timezone.utc) - timedelta(days=7)
        old_carts = db.query(Cart).filter(
            Cart.user_id == None,
            Cart.updated_at < cutoff,
        ).all()
        for cart in old_carts:
            db.delete(cart)
        db.commit()
    finally:
        db.close()


@celery_app.task
def expire_verification_tokens():
    """Hourly: mark expired verification tokens."""
    db = SessionLocal()
    try:
        now = datetime.now(timezone.utc)
        db.query(VerificationToken).filter(
            VerificationToken.expires_at < now,
            VerificationToken.used_at == None,
        ).delete()
        db.commit()
    finally:
        db.close()
