from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import and_, or_, func
from typing import Optional, List
from app.database import get_db
from app.models.product import Product, ProductVariant, ProductImage
from app.schemas.product import ProductListResponse, ProductDetailResponse
from app.utils.cache import cache_response
from app.utils.pagination import paginate

router = APIRouter(prefix="/products", tags=["Products"])

@router.get("/", response_model=ProductListResponse)
@cache_response(ttl=120, key_prefix="products:list")
async def list_products(
    db: Session = Depends(get_db),
    category_slug: Optional[str] = None,
    collection_slug: Optional[str] = None,
    product_type: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    in_stock: Optional[bool] = None,
    is_pet_friendly: Optional[bool] = None,
    is_air_purifying: Optional[bool] = None,
    care_skill: Optional[str] = None,
    sort: str = Query(default="popularity", enum=[
        "popularity", "newest", "price_asc", "price_desc",
        "rating", "name_asc"
    ]),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    q: Optional[str] = None,
):
    query = db.query(Product).filter(Product.status == "active")

    if q:
        query = query.filter(
            func.match(
                Product.title, Product.short_description,
                Product.botanical_name, Product.common_name
            ).against(q, mysql_boolean_mode=True)
        )

    if category_slug:
        query = query.join(Product.category).filter(
            Product.category.has(slug=category_slug)
        )

    if product_type:
        query = query.filter(Product.product_type == product_type)

    if min_price is not None:
        query = query.filter(Product.base_price >= min_price)

    if max_price is not None:
        query = query.filter(Product.base_price <= max_price)

    if is_pet_friendly is not None:
        query = query.filter(Product.is_pet_friendly == is_pet_friendly)

    if is_air_purifying is not None:
        query = query.filter(Product.is_air_purifying == is_air_purifying)

    if care_skill:
        query = query.filter(Product.care_skill == care_skill)

    # Sorting
    sort_map = {
        "popularity": Product.rating_count.desc(),
        "newest": Product.published_at.desc(),
        "price_asc": Product.base_price.asc(),
        "price_desc": Product.base_price.desc(),
        "rating": Product.rating_average.desc(),
        "name_asc": Product.title.asc(),
    }
    query = query.order_by(sort_map[sort])

    total = query.count()
    products = query.options(
        joinedload(Product.images),
        joinedload(Product.variants)
    ).offset((page - 1) * page_size).limit(page_size).all()

    return ProductListResponse(
        items=products,
        total=total,
        page=page,
        page_size=page_size,
        pages=(total + page_size - 1) // page_size
    )


@router.get("/{slug}", response_model=ProductDetailResponse)
@cache_response(ttl=60, key_prefix="products:detail")
async def get_product(slug: str, db: Session = Depends(get_db)):
    product = db.query(Product).options(
        joinedload(Product.images),
        joinedload(Product.variants),
        joinedload(Product.care_cards),
        joinedload(Product.features),
        joinedload(Product.specifications),
        joinedload(Product.pot_upsells),
        joinedload(Product.category),
    ).filter(
        Product.slug == slug,
        Product.status == "active"
    ).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")

    return product