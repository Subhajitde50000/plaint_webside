from datetime import date, timedelta
from sqlalchemy import func
from sqlalchemy.dialects.mysql import insert

from app.tasks.celery_app import celery_app
from app.database import SessionLocal
from app.models.order import Order
from app.models.user import User
from app.models.analytics import AnalyticsDaily


@celery_app.task
def aggregate_daily_metrics():
    """Pre-aggregate key metrics for the analytics dashboard (runs hourly via Beat)."""
    db = SessionLocal()
    try:
        yesterday = date.today() - timedelta(days=1)

        # Revenue
        revenue = db.query(func.sum(Order.total)).filter(
            func.date(Order.created_at) == yesterday,
            Order.payment_status == "paid",
        ).scalar() or 0
        _upsert_metric(db, yesterday, "revenue", float(revenue))

        # Orders
        orders_count = db.query(func.count(Order.id)).filter(
            func.date(Order.created_at) == yesterday
        ).scalar() or 0
        _upsert_metric(db, yesterday, "orders", float(orders_count))

        # New customers
        new_customers = db.query(func.count(User.id)).filter(
            func.date(User.created_at) == yesterday
        ).scalar() or 0
        _upsert_metric(db, yesterday, "new_customers", float(new_customers))

        # AOV
        aov = float(revenue) / orders_count if orders_count > 0 else 0
        _upsert_metric(db, yesterday, "aov", round(aov, 2))

        db.commit()
    finally:
        db.close()


def _upsert_metric(db, date_val, metric: str, value: float, dimension: str = None):
    stmt = insert(AnalyticsDaily).values(
        date=date_val,
        metric=metric,
        value=value,
        dimension=dimension,
    ).on_duplicate_key_update(value=value)
    db.execute(stmt)
