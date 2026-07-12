from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.category import Category, Collection
from app.utils.cache import cache_get, cache_set

router = APIRouter(tags=["Categories & Collections"])


@router.get("/categories/")
async def list_categories(db: Session = Depends(get_db)):
    cached = await cache_get("categories:tree")
    if cached:
        return cached

    roots = db.query(Category).filter(
        Category.parent_id == None,
        Category.is_active == True,
    ).order_by(Category.sort_order).all()

    def build_tree(cat):
        children = db.query(Category).filter(
            Category.parent_id == cat.id,
            Category.is_active == True,
        ).order_by(Category.sort_order).all()
        return {
            "id": cat.id,
            "name": cat.name,
            "slug": cat.slug,
            "image_url": cat.image_url,
            "children": [build_tree(c) for c in children],
        }

    tree = [build_tree(r) for r in roots]
    await cache_set("categories:tree", tree, ttl=3600)
    return tree


@router.get("/collections/")
async def list_collections(db: Session = Depends(get_db)):
    cached = await cache_get("collections:all")
    if cached:
        return cached

    collections = db.query(Collection).filter(
        Collection.is_active == True
    ).order_by(Collection.sort_order).all()
    data = [
        {
            "id": c.id,
            "name": c.name,
            "slug": c.slug,
            "description": c.description,
            "image_url": c.image_url,
        }
        for c in collections
    ]
    await cache_set("collections:all", data, ttl=300)
    return data


@router.get("/collections/{slug}")
async def get_collection(slug: str, db: Session = Depends(get_db)):
    collection = db.query(Collection).filter(
        Collection.slug == slug, Collection.is_active == True
    ).first()
    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found.")

    from app.models.product import Product
    products = [
        {
            "id": p.id,
            "uuid": p.uuid,
            "title": p.title,
            "slug": p.slug,
            "base_price": str(p.base_price),
            "compare_at_price": str(p.compare_at_price) if p.compare_at_price else None,
            "status": p.status,
        }
        for p in collection.products
        if p.status == "active"
    ]
    return {
        "id": collection.id,
        "name": collection.name,
        "slug": collection.slug,
        "description": collection.description,
        "image_url": collection.image_url,
        "products": products,
    }
