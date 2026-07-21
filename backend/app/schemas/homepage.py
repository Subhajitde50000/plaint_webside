from pydantic import BaseModel, Field, ConfigDict
from pydantic.alias_generators import to_camel
from typing import Optional, List


class HeroBannerSchema(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, serialize_by_alias=True)
    title: str
    subtitle: str
    cta_text: str
    cta_link: str
    image_url: str
    badge: Optional[str] = None


class CategorySummarySchema(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, serialize_by_alias=True)
    id: int
    name: str
    slug: str
    image_url: Optional[str] = None
    item_count: int
    icon: Optional[str] = None


class ProductSummarySchema(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, serialize_by_alias=True, from_attributes=True)
    id: int
    uuid: str
    title: str
    slug: str
    base_price: float
    compare_at_price: Optional[float] = None
    primary_image: Optional[str] = None
    rating_average: float
    rating_count: int
    in_stock: bool
    badge: Optional[str] = None


class FlashSaleSchema(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, serialize_by_alias=True)
    title: str
    subtitle: str
    end_time: str
    banner_url: Optional[str] = None
    items: List[ProductSummarySchema] = []


class AICareSummarySchema(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, serialize_by_alias=True)
    title: str
    subtitle: str
    feature_points: List[str] = []
    cta_text: str
    cta_link: str
    image_url: Optional[str] = None


class ServiceItemSchema(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, serialize_by_alias=True)
    id: str
    title: str
    description: str
    icon: str
    price_start: float


class GardenServicesSummarySchema(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, serialize_by_alias=True)
    title: str
    subtitle: str
    services: List[ServiceItemSchema] = []
    cta_text: str
    cta_link: str


class TestimonialSchema(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, serialize_by_alias=True)
    id: int
    customer_name: str
    avatar_url: Optional[str] = None
    rating: int
    review_text: str
    plant_purchased: Optional[str] = None


class BlogSummarySchema(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, serialize_by_alias=True)
    id: int
    title: str
    slug: str
    excerpt: str
    image_url: Optional[str] = None
    read_time: str
    published_at: Optional[str] = None


class NewsletterSchema(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, serialize_by_alias=True)
    title: str
    subtitle: str
    placeholder: str
    button_text: str
    discount_note: Optional[str] = None


class HomepageResponse(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, serialize_by_alias=True)
    hero: HeroBannerSchema
    categories: List[CategorySummarySchema] = []
    featured_products: List[ProductSummarySchema] = Field(..., alias="featuredProducts")
    best_sellers: List[ProductSummarySchema] = Field(..., alias="bestSellers")
    new_arrivals: List[ProductSummarySchema] = Field(..., alias="newArrivals")
    flash_sale: FlashSaleSchema = Field(..., alias="flashSale")
    ai_care: AICareSummarySchema = Field(..., alias="aiCare")
    garden_services: GardenServicesSummarySchema = Field(..., alias="gardenServices")
    testimonials: List[TestimonialSchema] = []
    blogs: List[BlogSummarySchema] = []
    newsletter: NewsletterSchema
