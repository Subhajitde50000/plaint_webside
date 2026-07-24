import uuid as _uuid
from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import IntegrityError
from typing import Optional

from app.database import get_db
from app.dependencies import require_ops_or_above, require_super_admin, get_current_admin
from app.models.product import Product, ProductImage, ProductVariant
from app.models.inventory import Inventory
from app.models.admin import AdminUser
from app.schemas.product import CreateProductRequest, UpdateProductRequest
from app.utils.pagination import paginate
from app.utils.storage import upload_file
from app.utils.cache import cache_delete_pattern

router = APIRouter(prefix="/admin/products", tags=["Admin - Products"])


@router.get("/")
async def list_products(
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=100),
    status: Optional[str] = None,
    product_type: Optional[str] = None,
    search: Optional[str] = None,
):
    query = db.query(Product)
    if status:
        query = query.filter(Product.status == status)
    if product_type:
        query = query.filter(Product.product_type == product_type)
    if search:
        query = query.filter(Product.title.ilike(f"%{search}%"))
    query = query.order_by(Product.created_at.desc())
    return paginate(query, page, page_size)


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_product(
    payload: CreateProductRequest,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_ops_or_above),
):
    existing = db.query(Product).filter(Product.slug == payload.slug).first()
    if existing:
        raise HTTPException(status_code=409, detail="Slug already exists.")

    product = Product(
        uuid=str(_uuid.uuid4()),
        created_by=admin.id,
        **payload.model_dump(exclude={"variants"}),
    )
    db.add(product)
    db.flush()

    if payload.variants:
        for idx, var_data in enumerate(payload.variants):
            variant = ProductVariant(
                product_id=product.id,
                variant_type=var_data.variant_type,
                option_name=var_data.option_name,
                option_detail=var_data.option_detail,
                best_for=var_data.best_for,
                pot_diameter=var_data.pot_diameter,
                dispatch_time=var_data.dispatch_time,
                price=var_data.price,
                compare_at_price=var_data.compare_at_price,
                sku=var_data.sku,
                sort_order=idx + 1,
            )
            db.add(variant)
            db.flush()
            db.add(Inventory(variant_id=variant.id, warehouse_id=1, quantity=var_data.stock or 0))

    try:
        db.commit()
    except IntegrityError as e:
        db.rollback()
        if "sku" in str(e.orig).lower() or "1062" in str(e.orig):
            raise HTTPException(status_code=409, detail="One of the variant SKUs already exists. Please enter a unique SKU.")
        raise HTTPException(status_code=409, detail=f"Database integrity error: {str(e.orig)}")
    db.refresh(product)
    product_loaded = db.query(Product).options(
        joinedload(Product.variants).joinedload(ProductVariant.inventory),
        joinedload(Product.images)
    ).filter(Product.id == product.id).first()
    await cache_delete_pattern("products:list:*")
    return product_loaded


@router.get("/{product_id}")
async def get_product(
    product_id: int,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    product = db.query(Product).options(
        joinedload(Product.variants).joinedload(ProductVariant.inventory),
        joinedload(Product.images)
    ).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")
    return product


@router.put("/{product_id}")
async def update_product(
    product_id: int,
    payload: UpdateProductRequest,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_ops_or_above),
):
    product = db.query(Product).options(
        joinedload(Product.variants).joinedload(ProductVariant.inventory)
    ).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")
    for field, val in payload.model_dump(exclude_none=True, exclude={"variants"}).items():
        setattr(product, field, val)

    if payload.variants is not None:
        existing_variants = {v.sku: v for v in product.variants}
        incoming_skus = {var_data.sku for var_data in payload.variants}

        # 1. Delete variants that are not in the new list
        for sku, v in list(existing_variants.items()):
            if sku not in incoming_skus:
                db.delete(v)

        # 2. Add or update variants
        for idx, var_data in enumerate(payload.variants):
            if var_data.sku in existing_variants:
                v = existing_variants[var_data.sku]
                v.variant_type = var_data.variant_type
                v.option_name = var_data.option_name
                v.option_detail = var_data.option_detail
                v.best_for = var_data.best_for
                v.pot_diameter = var_data.pot_diameter
                v.dispatch_time = var_data.dispatch_time
                v.price = var_data.price
                v.compare_at_price = var_data.compare_at_price
                v.sort_order = idx + 1
                if v.inventory:
                    v.inventory.quantity = var_data.stock or 0
                else:
                    db.add(Inventory(variant_id=v.id, warehouse_id=1, quantity=var_data.stock or 0))
            else:
                new_v = ProductVariant(
                    product_id=product.id,
                    variant_type=var_data.variant_type,
                    option_name=var_data.option_name,
                    option_detail=var_data.option_detail,
                    best_for=var_data.best_for,
                    pot_diameter=var_data.pot_diameter,
                    dispatch_time=var_data.dispatch_time,
                    price=var_data.price,
                    compare_at_price=var_data.compare_at_price,
                    sku=var_data.sku,
                    sort_order=idx + 1,
                )
                db.add(new_v)
                db.flush()
                db.add(Inventory(variant_id=new_v.id, warehouse_id=1, quantity=var_data.stock or 0))

    try:
        db.commit()
    except IntegrityError as e:
        db.rollback()
        if "sku" in str(e.orig).lower() or "1062" in str(e.orig):
            raise HTTPException(status_code=409, detail="One of the variant SKUs already exists. Please enter a unique SKU.")
        raise HTTPException(status_code=409, detail=f"Database integrity error: {str(e.orig)}")
    db.refresh(product)
    product_loaded = db.query(Product).options(
        joinedload(Product.variants).joinedload(ProductVariant.inventory),
        joinedload(Product.images)
    ).filter(Product.id == product.id).first()
    await cache_delete_pattern(f"products:detail:{product.slug}")
    await cache_delete_pattern("products:list:*")
    return product_loaded


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_super_admin),
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")
    product.status = "archived"
    db.commit()
    await cache_delete_pattern(f"products:detail:{product.slug}")


@router.post("/{product_id}/images")
async def upload_product_image(
    product_id: int,
    file: UploadFile = File(...),
    is_primary: bool = False,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_ops_or_above),
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")

    url = await upload_file(file, folder=f"products/{product_id}")

    if is_primary:
        db.query(ProductImage).filter(
            ProductImage.product_id == product_id
        ).update({"is_primary": False})

    position = len(product.images) + 1
    img = ProductImage(
        product_id=product_id,
        url=url,
        is_primary=is_primary,
        position=position,
    )
    db.add(img)
    db.commit()
    db.refresh(img)
    return img


@router.delete("/{product_id}/images/{image_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product_image(
    product_id: int,
    image_id: int,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_ops_or_above),
):
    img = db.query(ProductImage).filter(
        ProductImage.id == image_id,
        ProductImage.product_id == product_id,
    ).first()
    if not img:
        raise HTTPException(status_code=404, detail="Image not found.")
    db.delete(img)
    db.commit()
