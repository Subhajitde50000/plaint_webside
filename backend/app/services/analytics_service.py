from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, timedelta
from typing import Optional

from app.models.order import Order, OrderItem
from app.models.user import User
from app.models.analytics import AnalyticsDaily


class AnalyticsService:
    def __init__(self, db: Session):
        self.db = db

    def get_overview(
        self,
        date_from: Optional[date] = None,
        date_to: Optional[date] = None,
    ) -> dict:
        if not date_from:
            date_from = date.today() - timedelta(days=30)
        if not date_to:
            date_to = date.today()

        revenue = self.db.query(func.sum(Order.total)).filter(
            Order.payment_status == "paid",
            func.date(Order.created_at).between(date_from, date_to),
        ).scalar() or 0

        orders = self.db.query(func.count(Order.id)).filter(
            func.date(Order.created_at).between(date_from, date_to)
        ).scalar() or 0

        new_customers = self.db.query(func.count(User.id)).filter(
            func.date(User.created_at).between(date_from, date_to)
        ).scalar() or 0

        aov = float(revenue) / orders if orders > 0 else 0

        units = self.db.query(func.sum(OrderItem.quantity)).join(Order).filter(
            Order.payment_status == "paid",
            func.date(Order.created_at).between(date_from, date_to),
        ).scalar() or 0

        cancelled = self.db.query(func.count(Order.id)).filter(
            Order.status.in_(["cancelled", "return_received"]),
            func.date(Order.created_at).between(date_from, date_to),
        ).scalar() or 0
        return_rate = (cancelled / orders * 100) if orders > 0 else 0

        return {
            "period": {"from": str(date_from), "to": str(date_to)},
            "revenue": float(revenue),
            "orders": orders,
            "new_customers": new_customers,
            "aov": round(aov, 2),
            "units_sold": int(units),
            "return_rate": round(return_rate, 2),
        }

    def get_top_products(
        self,
        date_from: Optional[date],
        date_to: Optional[date],
        limit: int = 25,
    ) -> list:
        if not date_from:
            date_from = date.today() - timedelta(days=30)
        if not date_to:
            date_to = date.today()

        results = self.db.query(
            OrderItem.product_id,
            OrderItem.title,
            func.sum(OrderItem.total_price).label("revenue"),
            func.sum(OrderItem.quantity).label("units"),
        ).join(Order).filter(
            Order.payment_status == "paid",
            func.date(Order.created_at).between(date_from, date_to),
        ).group_by(
            OrderItem.product_id, OrderItem.title
        ).order_by(
            func.sum(OrderItem.total_price).desc()
        ).limit(limit).all()

        return [
            {
                "product_id": r.product_id,
                "title": r.title,
                "revenue": float(r.revenue),
                "units": int(r.units),
            }
            for r in results
        ]
