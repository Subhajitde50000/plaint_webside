from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database import get_db
from app.models.product import Product
from app.utils.pagination import paginate

router = APIRouter(prefix="/search", tags=["Search"])


@router.get("/")
async def search_products(
    q: str = Query(..., min_length=1, max_length=100),
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    page_size: int = Query(24, ge=1, le=100),
):
    """Full-text product search using LIKE (upgradeable to Meilisearch)."""
    like_q = f"%{q}%"
    query = db.query(Product).filter(
        Product.status == "active",
        or_(
            Product.title.ilike(like_q),
            Product.botanical_name.ilike(like_q),
            Product.common_name.ilike(like_q),
            Product.short_description.ilike(like_q),
        ),
    ).order_by(Product.rating_average.desc())

    result = paginate(query, page, page_size)
    result["query"] = q
    return result
