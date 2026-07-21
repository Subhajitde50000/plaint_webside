from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from decimal import Decimal


class InventorySchema(BaseModel):
    quantity: int
    reserved: int
    reorder_level: int
    low_stock_alert: bool
    stock_policy: str

    model_config = {"from_attributes": True}


class VariantSchema(BaseModel):
    id: int
    option_name: str
    option_detail: Optional[str] = None
    best_for: Optional[str] = None
    pot_diameter: Optional[str] = None
    dispatch_time: Optional[str] = None
    price: Decimal
    compare_at_price: Optional[Decimal] = None
    sku: str
    sort_order: int = 0
    is_active: bool = True
    inventory: Optional[InventorySchema] = None

    model_config = {"from_attributes": True}


class ImageSchema(BaseModel):
    id: int
    url: str
    alt_text: Optional[str] = None
    position: int = 1
    is_primary: bool = False

    model_config = {"from_attributes": True}


class CareCardSchema(BaseModel):
    id: int
    icon: Optional[str] = None
    title: str
    value: str
    detail: Optional[str] = None
    difficulty_level: int = 3
    sort_order: int = 1

    model_config = {"from_attributes": True}


class FeatureSchema(BaseModel):
    feature: str
    sort_order: int = 1

    model_config = {"from_attributes": True}


class SpecificationSchema(BaseModel):
    label: str
    value: str
    sort_order: int = 1

    model_config = {"from_attributes": True}


class ProductListItem(BaseModel):
    id: int
    uuid: str
    title: str
    slug: str
    short_description: Optional[str] = None
    base_price: Decimal
    compare_at_price: Optional[Decimal] = None
    discount_badge_text: Optional[str] = None
    product_type: str
    care_skill: Optional[str] = None
    is_pet_friendly: Optional[bool] = None
    is_air_purifying: Optional[bool] = None
    rating_average: Decimal = Decimal("0.00")
    rating_count: int = 0
    status: str
    images: List[ImageSchema] = []
    variants: List[VariantSchema] = []

    model_config = {"from_attributes": True}


class ProductListResponse(BaseModel):
    items: List[ProductListItem]
    total: int
    page: int
    page_size: int
    pages: int


class PotUpsellSchema(BaseModel):
    id: int
    plant_product_id: int
    pot_product_id: int
    sort_order: int
    pot_product: ProductListItem

    model_config = {"from_attributes": True}


class ProductDetailResponse(BaseModel):
    id: int
    uuid: str
    title: str
    slug: str
    short_description: Optional[str] = None
    description: Optional[str] = None
    botanical_name: Optional[str] = None
    common_name: Optional[str] = None
    product_type: str
    base_price: Decimal
    compare_at_price: Optional[Decimal] = None
    discount_badge_text: Optional[str] = None
    price_note: Optional[str] = None
    is_taxable: bool = True
    tax_rate: Decimal = Decimal("18.00")
    care_light: Optional[str] = None
    care_water: Optional[str] = None
    care_temperature: Optional[str] = None
    care_skill: Optional[str] = None
    is_pet_friendly: Optional[bool] = None
    is_air_purifying: Optional[bool] = None
    delivery_eta_label: Optional[str] = None
    health_guarantee_label: Optional[str] = None
    packaging_label: Optional[str] = None
    free_delivery_eligible: bool = True
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    rating_average: Decimal = Decimal("0.00")
    rating_count: int = 0
    status: str
    published_at: Optional[datetime] = None
    images: List[ImageSchema] = []
    variants: List[VariantSchema] = []
    care_cards: List[CareCardSchema] = []
    features: List[FeatureSchema] = []
    specifications: List[SpecificationSchema] = []
    pot_upsells: List[PotUpsellSchema] = []

    model_config = {"from_attributes": True}


class CreateProductRequest(BaseModel):
    category_id: int
    product_type: str
    title: str
    slug: str
    short_description: Optional[str] = None
    description: Optional[str] = None
    botanical_name: Optional[str] = None
    common_name: Optional[str] = None
    base_price: Decimal
    compare_at_price: Optional[Decimal] = None
    cost_price: Optional[Decimal] = None
    care_skill: Optional[str] = None
    is_pet_friendly: Optional[bool] = None
    is_air_purifying: Optional[bool] = None
    status: str = "draft"


class UpdateProductRequest(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    short_description: Optional[str] = None
    description: Optional[str] = None
    base_price: Optional[Decimal] = None
    compare_at_price: Optional[Decimal] = None
    status: Optional[str] = None
    care_skill: Optional[str] = None
    is_pet_friendly: Optional[bool] = None
    is_air_purifying: Optional[bool] = None
