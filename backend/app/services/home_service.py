import asyncio
from typing import Any, Callable
from sqlalchemy.orm import Session

from app.services.product_service import ProductService
from app.services.category_service import CategoryService
from app.services.marketing_service import MarketingService
from app.services.testimonial_service import TestimonialService
from app.schemas.homepage import HomepageResponse, FlashSaleSchema
from app.database import SessionLocal
from app.utils.cache import cache_delete, cache_get, cache_set

_HOMEPAGE_CACHE_KEY = "homepage:v1"
_HOMEPAGE_CACHE_TTL_SECONDS = 300


def _run_with_session(operation: Callable[..., Any], *args: Any) -> Any:
    """Run a synchronous domain operation with a session owned by this thread."""
    with SessionLocal() as session:
        return operation(session, *args)


class HomeService:
    @classmethod
    async def get_homepage_data(cls, db: Session, force_refresh: bool = False) -> HomepageResponse:
        # Redis cache is shared across API workers and can be invalidated centrally.
        if force_refresh:
            await cache_delete(_HOMEPAGE_CACHE_KEY)
        else:
            cached = await cache_get(_HOMEPAGE_CACHE_KEY)
            if cached is not None:
                return HomepageResponse(**cached)

        # 2. Execute domain service calls concurrently via asyncio.to_thread
        (
            hero,
            categories,
            featured_products,
            best_sellers,
            new_arrivals,
            flash_sale_items,
            flash_sale_cfg,
            ai_care,
            garden_services,
            testimonials,
            blogs,
            newsletter,
        ) = await asyncio.gather(
            asyncio.to_thread(MarketingService.get_hero_banner),
            asyncio.to_thread(_run_with_session, CategoryService.get_homepage_categories),
            asyncio.to_thread(_run_with_session, ProductService.get_featured_products),
            asyncio.to_thread(_run_with_session, ProductService.get_best_sellers),
            asyncio.to_thread(_run_with_session, ProductService.get_new_arrivals),
            asyncio.to_thread(_run_with_session, ProductService.get_flash_sale_products),
            asyncio.to_thread(MarketingService.get_flash_sale_config),
            asyncio.to_thread(MarketingService.get_ai_care_summary),
            asyncio.to_thread(MarketingService.get_garden_services_summary),
            asyncio.to_thread(_run_with_session, TestimonialService.get_homepage_testimonials),
            asyncio.to_thread(MarketingService.get_homepage_blogs),
            asyncio.to_thread(MarketingService.get_newsletter_config),
        )

        flash_sale = FlashSaleSchema(
            title=flash_sale_cfg["title"],
            subtitle=flash_sale_cfg["subtitle"],
            end_time=flash_sale_cfg["end_time"],
            banner_url=flash_sale_cfg["banner_url"],
            items=flash_sale_items,
        )

        response = HomepageResponse(
            hero=hero,
            categories=categories,
            featured_products=featured_products,
            best_sellers=best_sellers,
            new_arrivals=new_arrivals,
            flash_sale=flash_sale,
            ai_care=ai_care,
            garden_services=garden_services,
            testimonials=testimonials,
            blogs=blogs,
            newsletter=newsletter,
        )

        await cache_set(
            _HOMEPAGE_CACHE_KEY,
            response.model_dump(mode="json", by_alias=True),
            ttl=_HOMEPAGE_CACHE_TTL_SECONDS,
        )

        return response

    @staticmethod
    async def invalidate_homepage_cache() -> None:
        await cache_delete(_HOMEPAGE_CACHE_KEY)
