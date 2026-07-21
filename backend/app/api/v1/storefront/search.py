import re
from typing import Optional, List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, desc, asc

from app.database import get_db
from app.models.product import Product, ProductVariant
from app.models.category import Category
from app.models.inventory import Inventory
from app.schemas.search import SearchResponse, SearchProductItem, SearchCategoryItem

router = APIRouter(prefix="/search", tags=["Search"])


def clean_query(text: str) -> str:
    if not text:
        return ""
    # Strip whitespace, convert to lowercase, remove excess special chars
    cleaned = re.sub(r"[^\w\s-]", "", text.strip().lower())
    return re.sub(r"\s+", " ", cleaned)


@router.get("/")
async def search_products(
    q: Optional[str] = Query("", max_length=100),
    category: Optional[str] = Query(None, description="Category slug or name"),
    min_price: Optional[float] = Query(None, ge=0),
    max_price: Optional[float] = Query(None, ge=0),
    in_stock: Optional[bool] = Query(None),
    min_rating: Optional[float] = Query(None, ge=0, le=5),
    sort_by: Optional[str] = Query("relevance", enum=["relevance", "popularity", "price_asc", "price_desc", "newest", "rating"]),
    page: int = Query(1, ge=1),
    page_size: int = Query(24, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """
    Production-ready full-text search with query cleaning, relevance scoring,
    multi-field filtering, sorting options, and auto-suggestions.
    """
    raw_query = q or ""
    query_str = clean_query(raw_query)

    # Base query for active products
    db_query = db.query(Product).filter(Product.status == "active")

    # 1. Text Search (Exact + Partial + Keyword Matches)
    if query_str:
        like_pattern = f"%{query_str}%"
        words = query_str.split()

        word_conditions = []
        for w in words:
            word_pattern = f"%{w}%"
            word_conditions.append(
                or_(
                    Product.title.ilike(word_pattern),
                    Product.botanical_name.ilike(word_pattern),
                    Product.common_name.ilike(word_pattern),
                    Product.short_description.ilike(word_pattern),
                )
            )

        db_query = db_query.filter(
            or_(
                Product.title.ilike(like_pattern),
                Product.botanical_name.ilike(like_pattern),
                Product.common_name.ilike(like_pattern),
                Product.short_description.ilike(like_pattern),
                and_(*word_conditions) if word_conditions else True,
            )
        )

    # 2. Category Filter
    if category and category.strip():
        cat_clean = category.strip().lower()
        db_query = db_query.join(Product.category).filter(
            or_(Category.slug == cat_clean, Category.name.ilike(f"%{cat_clean}%"))
        )

    # 3. Price Filter
    if min_price is not None:
        db_query = db_query.filter(Product.base_price >= min_price)
    if max_price is not None:
        db_query = db_query.filter(Product.base_price <= max_price)

    # 4. Rating Filter
    if min_rating is not None and min_rating > 0:
        db_query = db_query.filter(Product.rating_average >= min_rating)

    # Execute fetch for sorting & in-memory relevance ranking
    products = db_query.all()

    # 5. Availability (In-Stock) Filter & Mapping
    processed_items: List[dict] = []
    for p in products:
        # Check stock by checking variant inventory
        total_available = 0
        for v in p.variants:
            inv = db.query(Inventory).filter(Inventory.variant_id == v.id).first()
            if inv:
                total_available += max(0, inv.quantity - inv.reserved)
            else:
                total_available += 10 # Default fallback if no inventory row

        is_in_stock = total_available > 0
        if in_stock is not None and in_stock and not is_in_stock:
            continue

        # Primary image URL
        primary_img = next(
            (img.url for img in p.images if img.is_primary), None
        ) or (p.images[0].url if p.images else None)

        # Relevance scoring
        score = 0
        if query_str:
            title_lower = p.title.lower() if p.title else ""
            botanical_lower = p.botanical_name.lower() if p.botanical_name else ""
            common_lower = p.common_name.lower() if p.common_name else ""

            if title_lower == query_str:
                score += 100
            elif title_lower.startswith(query_str):
                score += 80
            elif query_str in title_lower:
                score += 50
            
            if query_str in botanical_lower or query_str in common_lower:
                score += 40

        processed_items.append({
            "product": p,
            "score": score,
            "primary_image": primary_img,
            "in_stock": is_in_stock,
        })

    # 6. Sorting
    if sort_by == "popularity":
        processed_items.sort(key=lambda x: (x["product"].rating_count, float(x["product"].rating_average)), reverse=True)
    elif sort_by == "price_asc":
        processed_items.sort(key=lambda x: float(x["product"].base_price))
    elif sort_by == "price_desc":
        processed_items.sort(key=lambda x: float(x["product"].base_price), reverse=True)
    elif sort_by == "newest":
        processed_items.sort(key=lambda x: x["product"].created_at or "", reverse=True)
    elif sort_by == "rating":
        processed_items.sort(key=lambda x: float(x["product"].rating_average), reverse=True)
    else:  # relevance default
        processed_items.sort(key=lambda x: (x["score"], float(x["product"].rating_average)), reverse=True)

    # 7. Pagination
    total = len(processed_items)
    total_pages = (total + page_size - 1) // page_size if total > 0 else 1
    offset = (page - 1) * page_size
    paged_slice = processed_items[offset : offset + page_size]

    # Map items to response schema
    items_out = [
        SearchProductItem(
            id=item["product"].id,
            uuid=item["product"].uuid,
            title=item["product"].title,
            slug=item["product"].slug,
            botanical_name=item["product"].botanical_name,
            common_name=item["product"].common_name,
            short_description=item["product"].short_description,
            base_price=float(item["product"].base_price),
            compare_at_price=float(item["product"].compare_at_price) if item["product"].compare_at_price else None,
            rating_average=float(item["product"].rating_average),
            rating_count=item["product"].rating_count,
            primary_image=item["primary_image"],
            product_type=item["product"].product_type,
            in_stock=item["in_stock"],
        )
        for item in paged_slice
    ]

    # 8. Category & Suggestions Extraction
    categories_dict = {}
    suggestions = set()

    for item in processed_items:
        p = item["product"]
        if p.category:
            cat_id = p.category.id
            if cat_id not in categories_dict:
                categories_dict[cat_id] = {
                    "id": p.category.id,
                    "name": p.category.name,
                    "slug": p.category.slug,
                    "product_count": 1,
                }
            else:
                categories_dict[cat_id]["product_count"] += 1
        
        if p.title:
            suggestions.add(p.title)
        if p.common_name:
            suggestions.add(p.common_name)

    categories_out = [
        SearchCategoryItem(**c) for c in list(categories_dict.values())[:6]
    ]
    suggestions_out = list(suggestions)[:8]

    return {
        "items": [item.model_dump() for item in items_out],
        "categories": [c.model_dump() for c in categories_out],
        "suggestions": suggestions_out,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages,
        "query": query_str,
    }
