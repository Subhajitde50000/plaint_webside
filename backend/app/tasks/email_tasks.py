import asyncio
from datetime import date
from app.tasks.celery_app import celery_app
from app.database import SessionLocal
from app.services.notification_service import NotificationService


@celery_app.task
def send_verification_email(user_id: int, email: str, name: str, token: str):
    """Send email verification link to newly registered user."""
    notif = NotificationService()
    asyncio.run(notif.send_verification_email(email, name, token))


@celery_app.task
def send_password_reset_email(user_id: int, email: str, name: str, token: str):
    """Send password reset link to user."""
    notif = NotificationService()
    asyncio.run(notif.send_password_reset_email(email, name, token))


@celery_app.task
def send_watering_reminders():
    """Daily task: find plants due for watering today and notify their owners."""
    from app.models.plant import UserPlant
    db = SessionLocal()
    try:
        today = date.today()
        plants = db.query(UserPlant).filter(
            UserPlant.next_water_due == today
        ).all()
        notif = NotificationService()
        for plant in plants:
            if plant.user:
                asyncio.run(notif.send_email(
                    to_email=plant.user.email,
                    template_id="watering_reminder",
                    props={
                        "first_name": plant.user.first_name,
                        "plant_name": plant.nickname or plant.plant_name,
                    },
                ))
    finally:
        db.close()


@celery_app.task
def send_review_requests():
    """Send review request emails 7 days after delivery."""
    from datetime import datetime, timedelta, timezone
    from app.models.order import Order
    db = SessionLocal()
    try:
        cutoff = datetime.now(timezone.utc) - timedelta(days=7)
        orders = db.query(Order).filter(
            Order.status == "delivered",
            Order.delivered_at <= cutoff,
            Order.delivered_at >= cutoff - timedelta(days=1),
        ).all()
        notif = NotificationService()
        for order in orders:
            if order.user_id and order.user:
                asyncio.run(notif.send_review_request(order.user, order))
    finally:
        db.close()
