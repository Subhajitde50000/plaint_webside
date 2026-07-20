from pydantic import BaseModel
from typing import Optional, List


class SearchProductItem(BaseModel):
    id: int
    uuid: str
    title: str
    slug: str
    botanical_name: Optional[str] = None
    common_name: Optional[str] = None
    short_description: Optional[str] = None
    base_price: float
    compare_at_price: Optional[float] = None
    rating_average: float
    rating_count: int
    primary_image: Optional[str] = None
    product_type: Optional[str] = None
    in_stock: bool

    model_config = {"from_attributes": True}


class SearchCategoryItem(BaseModel):
    id: int
    name: str
    slug: str
    product_count: int


class SearchResponse(BaseModel):
    items: List[SearchProductItem]
    categories: List[SearchCategoryItem] = []
    suggestions: List[str] = []
    total: int
    page: int
    page_size: int
    total_pages: int
    query: str
