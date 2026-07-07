from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date

from app.database import get_db
from app.dependencies import require_analyst
from app.models.admin import AdminUser
from app.models.analytics import AnalyticsDaily
from app.services.analytics_service import AnalyticsService

router = APIRouter(prefix="/admin/analytics", tags=["Admin - Analytics"])


@router.get("/overview")
async def get_overview(
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_analyst),
    date_from: Optional[date] = None,
    date_to: Optional[date] = None,
):
    return AnalyticsService(db).get_overview(date_from, date_to)


@router.get("/revenue/chart")
async def get_revenue_chart(
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_analyst),
    date_from: Optional[date] = None,
    date_to: Optional[date] = None,
):
    from datetime import timedelta
    if not date_from:
        date_from = date.today() - timedelta(days=30)
    if not date_to:
        date_to = date.today()

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
    admin: AdminUser = Depends(require_analyst),
    date_from: Optional[date] = None,
    date_to: Optional[date] = None,
    limit: int = Query(default=25, ge=1, le=100),
):
    return {"data": AnalyticsService(db).get_top_products(date_from, date_to, limit)}


@router.get("/customers/overview")
async def get_customer_overview(
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_analyst),
    date_from: Optional[date] = None,
    date_to: Optional[date] = None,
):
    from sqlalchemy import func
    from datetime import timedelta
    from app.models.user import User
    from app.models.order import Order

    if not date_from:
        date_from = date.today() - timedelta(days=30)
    if not date_to:
        date_to = date.today()

    total = db.query(func.count(User.id)).filter(User.deleted_at == None).scalar()
    new_in_period = db.query(func.count(User.id)).filter(
        func.date(User.created_at).between(date_from, date_to)
    ).scalar()

    ninety_days_ago = date.today() - timedelta(days=90)
    at_risk = db.query(func.count(User.id)).filter(
        ~User.id.in_(
            db.query(Order.user_id).filter(Order.created_at >= ninety_days_ago)
        )
    ).scalar()

    return {
        "total_customers": total,
        "new_in_period": new_in_period,
        "at_risk_customers": at_risk,
    }
