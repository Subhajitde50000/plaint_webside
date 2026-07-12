from app.tasks.celery_app import celery_app
from app.database import SessionLocal
from app.models.order import Order
from app.models.user import User
from app.models.analytics import AnalyticsDaily
from sqlalchemy import func
from datetime import date, timedelta

@celery_app.task
def aggregate_daily_metrics():
    """Pre-aggregate key metrics for the analytics dashboard."""
    db = SessionLocal()
    try:
        today = date.today()
        yesterday = today - timedelta(days=1)

        # Revenue
        revenue = db.query(func.sum(Order.total)).filter(
            func.date(Order.created_at) == yesterday,
            Order.payment_status == "paid"
        ).scalar() or 0

        _upsert_metric(db, yesterday, "revenue", float(revenue))

        # Orders
        orders = db.query(func.count(Order.id)).filter(
            func.date(Order.created_at) == yesterday
        ).scalar() or 0
        _upsert_metric(db, yesterday, "orders", float(orders))

        # New customers
        new_customers = db.query(func.count(User.id)).filter(
            func.date(User.created_at) == yesterday
        ).scalar() or 0
        _upsert_metric(db, yesterday, "new_customers", float(new_customers))

        # AOV
        aov = revenue / orders if orders > 0 else 0
        _upsert_metric(db, yesterday, "aov", float(aov))

        db.commit()
    finally:
        db.close()


def _upsert_metric(db, date_val, metric: str, value: float, dimension: str = None):
    from sqlalchemy.dialects.mysql import insert
    stmt = insert(AnalyticsDaily).values(
        date=date_val,
        metric=metric,
        value=value,
        dimension=dimension,
    ).on_duplicate_key_update(value=value)
    db.execute(stmt)


### 14.4 Email Tasks (`app/tasks/email_tasks.py`)

@celery_app.task
def send_verification_email(user_id: int, email: str, name: str, token: str):
    notif = NotificationService()
    import asyncio
    asyncio.run(notif.send_email(
        to_email=email,
        template_id="email_verification",
        props={"first_name": name, "verification_token": token}
    ))

@celery_app.task
def send_password_reset_email(user_id: int, email: str, name: str, token: str):
    notif = NotificationService()
    import asyncio
    asyncio.run(notif.send_email(
        to_email=email,
        template_id="password_reset",
        props={"first_name": name, "reset_token": token}
    ))

@celery_app.task
def send_watering_reminders():
    """Daily task: find plants due for watering and notify owners."""
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
                    }
                ))
    finally:
        db.close()

@celery_app.task
def send_review_requests():
    """7 days after delivery, request a review."""
    from datetime import datetime, timedelta, timezone
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
            if order.user_id:
                asyncio.run(notif.send_review_request(order.user, order))
    finally:
        db.close()