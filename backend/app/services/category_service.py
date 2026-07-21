from typing import List
from sqlalchemy.orm import Session
from app.models.category import Category
from app.schemas.homepage import CategorySummarySchema


class CategoryService:
    @classmethod
    def get_homepage_categories(cls, db: Session, limit: int = 6) -> List[CategorySummarySchema]:
        cats = db.query(Category).filter(Category.is_active == True).limit(limit).all()
        result = []
        for c in cats:
            item_count = len([p for p in c.products if p.status == "active"]) if c.products else 0
            result.append(
                CategorySummarySchema(
                    id=c.id,
                    name=c.name,
                    slug=c.slug,
                    image_url=c.image_url or "/placeholder-category.jpg",
                    item_count=item_count,
                    icon="🪴",
                )
            )
        return result
