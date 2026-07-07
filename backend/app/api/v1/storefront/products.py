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
    page_size: int = Query(24, ge=1, le=100),
    category_id: Optional[int] = None,
    product_type: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    care_skill: Optional[str] = None,
    is_pet_friendly: Optional[bool] = None,
    is_air_purifying: Optional[bool] = None,
    sort: str = Query("newest", enum=["newest", "price_asc", "price_desc", "rating"]),
):
    query = db.query(Product).filter(Product.status == "active")

    if category_id:
        query = query.filter(Product.category_id == category_id)
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

    if sort == "price_asc":
        query = query.order_by(Product.base_price.asc())
    elif sort == "price_desc":
        query = query.order_by(Product.base_price.desc())
    elif sort == "rating":
        query = query.order_by(Product.rating_average.desc())
    else:
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
