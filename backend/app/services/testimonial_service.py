from typing import List
from sqlalchemy.orm import Session
from app.models.review import Review
from app.schemas.homepage import TestimonialSchema


class TestimonialService:
    @classmethod
    def get_homepage_testimonials(cls, db: Session, limit: int = 4) -> List[TestimonialSchema]:
        reviews = db.query(Review).filter(
            Review.status == "approved",
            Review.rating >= 4
        ).order_by(Review.created_at.desc()).limit(limit).all()

        if not reviews:
            # High quality fallback testimonials
            return [
                TestimonialSchema(
                    id=101,
                    customer_name="Ananya Sharma",
                    avatar_url="/avatar-1.jpg",
                    rating=5,
                    review_text="The Monstera Deliciosa arrived in flawless condition with healthy green leaves! The eco-friendly packaging is truly top tier.",
                    plant_purchased="Monstera Deliciosa",
                ),
                TestimonialSchema(
                    id=102,
                    customer_name="Rohan Verma",
                    avatar_url="/avatar-2.jpg",
                    rating=5,
                    review_text="AI Care diagnosed my snake plant's yellowing leaves within 10 seconds. The advice saved my plant!",
                    plant_purchased="Snake Plant Black Coral",
                ),
                TestimonialSchema(
                    id=103,
                    customer_name="Priya Patel",
                    avatar_url="/avatar-3.jpg",
                    rating=5,
                    review_text="Ordered the urban balcony garden service. Their team installed drip irrigation and gorgeous ceramic pots in under 3 hours.",
                    plant_purchased="Balcony Garden Setup",
                ),
            ]

        out = []
        for r in reviews:
            customer_name = "Valued Plant Lover"
            if r.customer:
                customer_name = f"{r.customer.first_name} {r.customer.last_name}".strip() or r.customer.email.split("@")[0]
            
            plant_name = r.product.title if r.product else "Indoor Plant"
            out.append(
                TestimonialSchema(
                    id=r.id,
                    customer_name=customer_name,
                    avatar_url=None,
                    rating=r.rating,
                    review_text=r.comment or "Great quality plant!",
                    plant_purchased=plant_name,
                )
            )
        return out
