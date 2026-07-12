from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from datetime import date, timedelta
from typing import Optional

from app.database import get_db
from app.dependencies import require_analyst
from app.models.order import Order, OrderItem
from app.models.user import User
from app.models.analytics import AnalyticsDaily
from app.models.product import Product

router = APIRouter(prefix="/admin/analytics", tags=["Admin - Analytics"])


@router.get("/overview")
async def get_overview(
    db: Session = Depends(get_db),
    admin = Depends(require_analyst),
    date_from: Optional[date] = None,
    date_to: Optional[date] = None,
):
    if not date_from:
        date_from = date.today() - timedelta(days=30)
    if not date_to:
        date_to = date.today()

    # Revenue
    revenue = db.query(func.sum(Order.total)).filter(
        Order.payment_status == "paid",
        func.date(Order.created_at).between(date_from, date_to)
    ).scalar() or 0

    # Orders
    orders = db.query(func.count(Order.id)).filter(
        func.date(Order.created_at).between(date_from, date_to)
    ).scalar() or 0

    # New customers
    new_customers = db.query(func.count(User.id)).filter(
        func.date(User.created_at).between(date_from, date_to)
    ).scalar() or 0

    # AOV
    aov = float(revenue) / orders if orders > 0 else 0

    # Units sold
    units = db.query(func.sum(OrderItem.quantity)).join(Order).filter(
        Order.payment_status == "paid",
        func.date(Order.created_at).between(date_from, date_to)
    ).scalar() or 0

    # Return rate
    cancelled = db.query(func.count(Order.id)).filter(
        Order.status.in_(["cancelled", "return_received"]),
        func.date(Order.created_at).between(date_from, date_to)
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


@router.get("/revenue/chart")
async def get_revenue_chart(
    db: Session = Depends(get_db),
    admin = Depends(require_analyst),
    date_from: Optional[date] = None,
    date_to: Optional[date] = None,
    granularity: str = Query(default="daily", enum=["daily", "weekly", "monthly"]),
):
    if not date_from:
        date_from = date.today() - timedelta(days=30)
    if not date_to:
        date_to = date.today()

    # Query pre-aggregated data from analytics_daily
    records = db.query(AnalyticsDaily).filter(
        AnalyticsDaily.date.between(date_from, date_to),
        AnalyticsDaily.metric == "revenue",
    ).order_by(AnalyticsDaily.date).all()

    return {
        "data": [
            {"date": str(r.date), "value": float(r.value)}
            for r in records
        ]
    }


@router.get("/products/top")
async def get_top_products(
    db: Session = Depends(get_db),
    admin = Depends(require_analyst),
    date_from: Optional[date] = None,
    date_to: Optional[date] = None,
    limit: int = Query(default=25, ge=1, le=100),
):
    if not date_from:
        date_from = date.today() - timedelta(days=30)
    if not date_to:
        date_to = date.today()

    results = db.query(
        OrderItem.product_id,
        OrderItem.title,
        func.sum(OrderItem.total_price).label("revenue"),
        func.sum(OrderItem.quantity).label("units"),
    ).join(Order).filter(
        Order.payment_status == "paid",
        func.date(Order.created_at).between(date_from, date_to)
    ).group_by(
        OrderItem.product_id, OrderItem.title
    ).order_by(
        func.sum(OrderItem.total_price).desc()
    ).limit(limit).all()

    return {
        "data": [
            {
                "product_id": r.product_id,
                "title": r.title,
                "revenue": float(r.revenue),
                "units": int(r.units),
            }
            for r in results
        ]
    }


@router.get("/customers/overview")
async def get_customer_overview(
    db: Session = Depends(get_db),
    admin = Depends(require_analyst),
    date_from: Optional[date] = None,
    date_to: Optional[date] = None,
):
    if not date_from:
        date_from = date.today() - timedelta(days=30)
    if not date_to:
        date_to = date.today()

    total = db.query(func.count(User.id)).filter(
        User.deleted_at == None
    ).scalar()

    new_in_period = db.query(func.count(User.id)).filter(
        func.date(User.created_at).between(date_from, date_to)
    ).scalar()

    # At-risk: no order in 90 days
    ninety_days_ago = date.today() - timedelta(days=90)
    at_risk = db.query(func.count(User.id)).filter(
        ~User.id.in_(
            db.query(Order.user_id).filter(
                Order.created_at >= ninety_days_ago
            )
        )
    ).scalar()

    return {
        "total_customers": total,
        "new_in_period": new_in_period,
        "at_risk_customers": at_risk,
    }