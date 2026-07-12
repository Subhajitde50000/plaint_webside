import uuid as _uuid
from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.database import get_db
from app.dependencies import require_ops_or_above, require_super_admin, get_current_admin
from app.models.product import Product, ProductImage
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
        **payload.model_dump(),
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    await cache_delete_pattern("products:list:*")
    return product


@router.get("/{product_id}")
async def get_product(
    product_id: int,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    product = db.query(Product).filter(Product.id == product_id).first()
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
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")
    for field, val in payload.model_dump(exclude_none=True).items():
        setattr(product, field, val)
    db.commit()
    await cache_delete_pattern(f"products:detail:{product.slug}")
    await cache_delete_pattern("products:list:*")
    return product


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
