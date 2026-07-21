from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import Optional

from app.database import get_db
from app.models.product import Product
from app.models.category import Category, Collection
from app.schemas.product import ProductListResponse, ProductDetailResponse
from app.utils.cache import cache_get, cache_set
from app.utils.pagination import paginate
import json

router = APIRouter(prefix="/products", tags=["Products"])


@router.get("/", response_model=ProductListResponse)
async def list_products(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    # Category — accept slug (preferred) or legacy id
    category_slug: Optional[str] = None,
    category_id: Optional[int] = None,
    # Collection
    collection_slug: Optional[str] = None,
    # Filters
    product_type: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    care_skill: Optional[str] = None,
    is_pet_friendly: Optional[bool] = None,
    is_air_purifying: Optional[bool] = None,
    # Full-text search
    q: Optional[str] = None,
    # Sort
    sort: str = Query(
        "popularity",
        enum=["popularity", "newest", "price_asc", "price_desc", "rating", "name_asc"],
    ),
):
    query = db.query(Product).filter(Product.status == "active")

    # ── Category filter ────────────────────────────────────────────────────
    if category_slug:
        query = query.join(Category, Product.category_id == Category.id).filter(
            Category.slug == category_slug
        )
    elif category_id:
        query = query.filter(Product.category_id == category_id)

    # ── Collection filter ──────────────────────────────────────────────────
    if collection_slug:
        from app.models.category import Collection, ProductCollection
        query = (
            query
            .join(ProductCollection, Product.id == ProductCollection.product_id)
            .join(Collection, ProductCollection.collection_id == Collection.id)
            .filter(Collection.slug == collection_slug)
        )

    # ── Product type / price / care filters ───────────────────────────────
    if product_type:
        query = query.filter(Product.product_type == product_type)
    if min_price is not None:
        query = query.filter(Product.base_price >= min_price)
    if max_price is not None:
        query = query.filter(Product.base_price <= max_price)
    if care_skill:
        query = query.filter(Product.care_skill == care_skill)
    if is_pet_friendly is not None:
        query = query.filter(Product.is_pet_friendly == is_pet_friendly)
    if is_air_purifying is not None:
        query = query.filter(Product.is_air_purifying == is_air_purifying)

    # ── Full-text search ───────────────────────────────────────────────────
    if q:
        pattern = f"%{q.strip()}%"
        query = query.filter(
            Product.title.ilike(pattern) | Product.short_description.ilike(pattern)
        )

    # ── Sorting ────────────────────────────────────────────────────────────
    if sort == "price_asc":
        query = query.order_by(Product.base_price.asc())
    elif sort == "price_desc":
        query = query.order_by(Product.base_price.desc())
    elif sort == "rating":
        query = query.order_by(Product.rating_average.desc())
    elif sort == "name_asc":
        query = query.order_by(Product.title.asc())
    elif sort == "popularity":
        query = query.order_by(Product.rating_count.desc(), Product.rating_average.desc())
    else:  # newest
        query = query.order_by(Product.published_at.desc())

    result = paginate(query, page, page_size)
    return result


@router.get("/{slug}", response_model=ProductDetailResponse)
async def get_product(slug: str, db: Session = Depends(get_db)):
    cache_key = f"products:detail:{slug}"
    cached = await cache_get(cache_key)
    if cached:
        return cached

    product = db.query(Product).filter(
        Product.slug == slug, Product.status == "active"
    ).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")

    data = ProductDetailResponse.model_validate(product).model_dump(mode="json")
    await cache_set(cache_key, data, ttl=60)
    return data
