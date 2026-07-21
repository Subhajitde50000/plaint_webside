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

    product_data = payload.model_dump()
    variants_data = product_data.pop("variants", None)
    base_sku = product_data.pop("base_sku", None)
    barcode = product_data.pop("barcode", None)
    track_inventory = product_data.pop("track_inventory", None)
    reorder_level = product_data.pop("reorder_level", None)
    low_stock_alert = product_data.pop("low_stock_alert", None)
    stock_policy = product_data.pop("stock_policy", None)
    warehouse = product_data.pop("warehouse", None)

    product = Product(
        uuid=str(_uuid.uuid4()),
        created_by=admin.id,
        **product_data,
    )
    db.add(product)
    db.commit()
    db.refresh(product)

    from app.models.product import ProductVariant
    from app.models.inventory import Inventory

    wh_id = 1  # Default to Kolkata Warehouse (id=1)

    if variants_data:
        for v in variants_data:
            variant = ProductVariant(
                product_id=product.id,
                variant_type="size",
                option_name=v["option_name"],
                option_detail=v.get("option_detail"),
                price=v["price"],
                compare_at_price=v.get("compare_at_price"),
                sku=v["sku"],
                barcode=barcode,
                is_active=v.get("is_active", True),
            )
            db.add(variant)
            db.commit()
            db.refresh(variant)

            inv = Inventory(
                variant_id=variant.id,
                warehouse_id=wh_id,
                quantity=v.get("stock", 0),
                reserved=0,
                reorder_level=reorder_level if reorder_level is not None else 10,
                low_stock_alert=low_stock_alert if low_stock_alert is not None else True,
                stock_policy=stock_policy if stock_policy is not None else "deny",
            )
            db.add(inv)
            db.commit()
    else:
        variant = ProductVariant(
            product_id=product.id,
            variant_type="size",
            option_name="Standard",
            price=product.base_price,
            compare_at_price=product.compare_at_price,
            sku=base_sku if base_sku else f"SKU-{product.slug.upper()}",
            barcode=barcode,
            is_active=True,
        )
        db.add(variant)
        db.commit()
        db.refresh(variant)

        inv = Inventory(
            variant_id=variant.id,
            warehouse_id=wh_id,
            quantity=0,
            reserved=0,
            reorder_level=reorder_level if reorder_level is not None else 10,
            low_stock_alert=low_stock_alert if low_stock_alert is not None else True,
            stock_policy=stock_policy if stock_policy is not None else "deny",
        )
        db.add(inv)
        db.commit()

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

    update_data = payload.model_dump(exclude_none=True)
    variants_data = update_data.pop("variants", None)
    base_sku = update_data.pop("base_sku", None)
    barcode = update_data.pop("barcode", None)
    track_inventory = update_data.pop("track_inventory", None)
    reorder_level = update_data.pop("reorder_level", None)
    low_stock_alert = update_data.pop("low_stock_alert", None)
    stock_policy = update_data.pop("stock_policy", None)
    warehouse = update_data.pop("warehouse", None)

    for field, val in update_data.items():
        setattr(product, field, val)
    db.commit()

    from app.models.product import ProductVariant
    from app.models.inventory import Inventory

    wh_id = 1  # Default to Kolkata Warehouse (id=1)

    if variants_data is not None:
        submitted_ids = []
        for v in variants_data:
            v_id = v.get("id")
            if v_id:
                variant = db.query(ProductVariant).filter(
                    ProductVariant.id == v_id,
                    ProductVariant.product_id == product_id
                ).first()
                if variant:
                    variant.option_name = v["option_name"]
                    variant.option_detail = v.get("option_detail")
                    variant.price = v["price"]
                    variant.compare_at_price = v.get("compare_at_price")
                    variant.sku = v["sku"]
                    variant.is_active = v.get("is_active", True)
                    if barcode:
                        variant.barcode = barcode
                    db.commit()
                    submitted_ids.append(variant.id)

                    inv = db.query(Inventory).filter(Inventory.variant_id == variant.id).first()
                    if inv:
                        inv.quantity = v.get("stock", inv.quantity)
                        if reorder_level is not None:
                            inv.reorder_level = reorder_level
                        if low_stock_alert is not None:
                            inv.low_stock_alert = low_stock_alert
                        if stock_policy is not None:
                            inv.stock_policy = stock_policy
                    else:
                        inv = Inventory(
                            variant_id=variant.id,
                            warehouse_id=wh_id,
                            quantity=v.get("stock", 0),
                            reorder_level=reorder_level if reorder_level is not None else 10,
                            low_stock_alert=low_stock_alert if low_stock_alert is not None else True,
                            stock_policy=stock_policy if stock_policy is not None else "deny",
                        )
                        db.add(inv)
                    db.commit()
            else:
                variant = ProductVariant(
                    product_id=product_id,
                    variant_type="size",
                    option_name=v["option_name"],
                    option_detail=v.get("option_detail"),
                    price=v["price"],
                    compare_at_price=v.get("compare_at_price"),
                    sku=v["sku"],
                    barcode=barcode,
                    is_active=v.get("is_active", True),
                )
                db.add(variant)
                db.commit()
                db.refresh(variant)
                submitted_ids.append(variant.id)

                inv = Inventory(
                    variant_id=variant.id,
                    warehouse_id=wh_id,
                    quantity=v.get("stock", 0),
                    reorder_level=reorder_level if reorder_level is not None else 10,
                    low_stock_alert=low_stock_alert if low_stock_alert is not None else True,
                    stock_policy=stock_policy if stock_policy is not None else "deny",
                )
                db.add(inv)
                db.commit()

        # Delete variants that were removed in the UI
        db.query(ProductVariant).filter(
            ProductVariant.product_id == product_id,
            ~ProductVariant.id.in_(submitted_ids)
        ).delete(synchronize_session=False)
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
