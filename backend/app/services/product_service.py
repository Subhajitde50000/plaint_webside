from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.product import Product
from app.models.inventory import Inventory
from app.schemas.homepage import ProductSummarySchema


class ProductService:
    @staticmethod
    def _to_summary(p: Product, db: Session, badge: Optional[str] = None) -> ProductSummarySchema:
        # Check stock by inventory records
        total_qty = 0
        if p.variants:
            for v in p.variants:
                inv = db.query(Inventory).filter(Inventory.variant_id == v.id).first()
                if inv:
                    total_qty += max(0, inv.quantity - inv.reserved)
                else:
                    total_qty += 10
        else:
            total_qty = 10

        primary_img = next(
            (img.url for img in p.images if img.is_primary), None
        ) or (p.images[0].url if p.images else "/placeholder-plant.jpg")

        return ProductSummarySchema(
            id=p.id,
            uuid=p.uuid,
            title=p.title,
            slug=p.slug,
            base_price=float(p.base_price),
            compare_at_price=float(p.compare_at_price) if p.compare_at_price else None,
            primary_image=primary_img,
            rating_average=float(p.rating_average),
            rating_count=p.rating_count,
            in_stock=total_qty > 0,
            badge=badge or p.discount_badge_text,
        )

    @classmethod
    def get_featured_products(cls, db: Session, limit: int = 8) -> List[ProductSummarySchema]:
        products = db.query(Product).filter(
            Product.status == "active"
        ).order_by(Product.rating_average.desc()).limit(limit).all()
        return [cls._to_summary(p, db, badge="Featured") for p in products]

    @classmethod
    def get_best_sellers(cls, db: Session, limit: int = 8) -> List[ProductSummarySchema]:
        products = db.query(Product).filter(
            Product.status == "active"
        ).order_by(Product.rating_count.desc(), Product.rating_average.desc()).limit(limit).all()
        return [cls._to_summary(p, db, badge="Best Seller") for p in products]

    @classmethod
    def get_new_arrivals(cls, db: Session, limit: int = 8) -> List[ProductSummarySchema]:
        products = db.query(Product).filter(
            Product.status == "active"
        ).order_by(Product.created_at.desc()).limit(limit).all()
        return [cls._to_summary(p, db, badge="New") for p in products]

    @classmethod
    def get_flash_sale_products(cls, db: Session, limit: int = 4) -> List[ProductSummarySchema]:
        products = db.query(Product).filter(
            Product.status == "active",
            Product.compare_at_price != None
        ).order_by(Product.base_price.asc()).limit(limit).all()
        return [cls._to_summary(p, db, badge="Flash Deal") for p in products]
