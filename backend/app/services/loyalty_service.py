from sqlalchemy.orm import Session
from app.models.loyalty import LoyaltyAccount, LoyaltyTransaction
from app.models.order import Order

POINTS_PER_RUPEE = 1          # 1 point per ₹1 spent
POINTS_TO_RUPEE  = 0.10       # 1 point = ₹0.10
SILVER_THRESHOLD = 500        # lifetime points
GOLD_THRESHOLD   = 2000

class LoyaltyService:
    def __init__(self, db: Session):
        self.db = db

    def earn_points(self, user_id: int, order: Order) -> int:
        points_earned = int(order.total * POINTS_PER_RUPEE)
        account = self.db.query(LoyaltyAccount).filter(
            LoyaltyAccount.user_id == user_id
        ).with_for_update().first()

        account.points_balance += points_earned
        account.lifetime_points += points_earned

        # Tier upgrade check
        if account.lifetime_points >= GOLD_THRESHOLD and account.tier != "gold":
            account.tier = "gold"
        elif account.lifetime_points >= SILVER_THRESHOLD and account.tier == "plant_lover":
            account.tier = "silver"

        self.db.add(LoyaltyTransaction(
            user_id=user_id,
            type="earned",
            points=points_earned,
            balance_after=account.points_balance,
            description=f"Earned for order {order.order_number}",
            order_id=order.id,
        ))
        self.db.commit()
        return points_earned

    def redeem_points(self, user_id: int, points: int, order: Order) -> float:
        account = self.db.query(LoyaltyAccount).filter(
            LoyaltyAccount.user_id == user_id
        ).with_for_update().first()

        if account.points_balance < points:
            raise ValueError("Insufficient loyalty points.")

        discount = round(points * POINTS_TO_RUPEE, 2)
        account.points_balance -= points

        self.db.add(LoyaltyTransaction(
            user_id=user_id,
            type="redeemed",
            points=-points,
            balance_after=account.points_balance,
            description=f"Redeemed for order {order.order_number}",
            order_id=order.id,
        ))
        return discount

    def adjust_points(
        self, user_id: int, points: int, reason: str, admin_id: int
    ) -> None:
        """Admin-initiated adjustment (can be positive or negative)."""
        account = self.db.query(LoyaltyAccount).filter(
            LoyaltyAccount.user_id == user_id
        ).with_for_update().first()

        if points < 0 and account.points_balance + points < 0:
            raise ValueError("Adjustment would result in negative balance.")

        account.points_balance += points
        if points > 0:
            account.lifetime_points += points

        self.db.add(LoyaltyTransaction(
            user_id=user_id,
            type="adjusted",
            points=points,
            balance_after=account.points_balance,
            description=reason,
            adjusted_by=admin_id,
        ))
        self.db.commit()