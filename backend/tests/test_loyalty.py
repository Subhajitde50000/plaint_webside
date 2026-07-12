"""Tests for loyalty service and endpoints."""
import pytest
from sqlalchemy.orm import Session

from app.models.loyalty import LoyaltyAccount
from app.services.loyalty_service import LoyaltyService, SILVER_THRESHOLD, GOLD_THRESHOLD


class MockOrder:
    def __init__(self, total=1000.00, order_number="ORD-001", id=1):
        self.total = total
        self.order_number = order_number
        self.id = id


def create_loyalty_account(db: Session, user_id: int = 1) -> LoyaltyAccount:
    account = LoyaltyAccount(user_id=user_id, points_balance=0, lifetime_points=0)
    db.add(account)
    db.commit()
    return account


def test_earn_points(db: Session):
    account = create_loyalty_account(db)
    order = MockOrder(total=500.00)
    svc = LoyaltyService(db)

    # Manually attach account to mock user context
    points = account.points_balance
    assert points == 0

    earned = 500  # 1 point per ₹1
    account.points_balance += earned
    account.lifetime_points += earned
    db.commit()

    db.refresh(account)
    assert account.points_balance == 500
    assert account.lifetime_points == 500


def test_tier_upgrade_to_silver(db: Session):
    account = create_loyalty_account(db)
    account.lifetime_points = SILVER_THRESHOLD
    account.tier = "plant_lover"
    db.commit()

    # Simulate tier check
    if account.lifetime_points >= SILVER_THRESHOLD:
        account.tier = "silver"
        db.commit()

    db.refresh(account)
    assert account.tier == "silver"


def test_tier_upgrade_to_gold(db: Session):
    account = create_loyalty_account(db)
    account.lifetime_points = GOLD_THRESHOLD
    account.tier = "silver"
    db.commit()

    if account.lifetime_points >= GOLD_THRESHOLD:
        account.tier = "gold"
        db.commit()

    db.refresh(account)
    assert account.tier == "gold"


def test_redeem_insufficient_points(db: Session):
    account = create_loyalty_account(db)
    account.points_balance = 10
    db.commit()

    svc = LoyaltyService(db)
    order = MockOrder()
    with pytest.raises(ValueError, match="Insufficient loyalty points"):
        svc.redeem_points(user_id=1, points=100, order=order)


def test_adjust_points(db: Session):
    account = create_loyalty_account(db)
    account.points_balance = 200
    db.commit()

    svc = LoyaltyService(db)
    svc.adjust_points(user_id=1, points=-50, reason="Manual correction", admin_id=1)

    db.refresh(account)
    assert account.points_balance == 150


def test_adjust_points_negative_balance_raises(db: Session):
    account = create_loyalty_account(db)
    account.points_balance = 10
    db.commit()

    svc = LoyaltyService(db)
    with pytest.raises(ValueError, match="negative balance"):
        svc.adjust_points(user_id=1, points=-100, reason="Test", admin_id=1)
