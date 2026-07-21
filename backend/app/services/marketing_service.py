from typing import List
from app.schemas.homepage import (
    HeroBannerSchema,
    FlashSaleSchema,
    AICareSummarySchema,
    GardenServicesSummarySchema,
    ServiceItemSchema,
    BlogSummarySchema,
    NewsletterSchema,
)


class MarketingService:
    @classmethod
    def get_hero_banner(cls) -> HeroBannerSchema:
        return HeroBannerSchema(
            title="Bring Living Nature Into Your Urban Sanctuary",
            subtitle="Curated, air-purifying indoor plants delivered directly from our sustainable greenhouse to your doorstep.",
            cta_text="Explore Collection",
            cta_link="/collections/plants",
            image_url="/hero-banner.jpg",
            badge="🌿 Fresh Summer Collection 2026",
        )

    @classmethod
    def get_flash_sale_config(cls) -> dict:
        return {
            "title": "⚡ Midnight Flash Sale",
            "subtitle": "Up to 40% OFF premium rare plants & artisanal planters. Ends soon!",
            "end_time": "2026-07-31T23:59:59Z",
            "banner_url": "/flash-banner.jpg",
        }

    @classmethod
    def get_ai_care_summary(cls) -> AICareSummarySchema:
        return AICareSummarySchema(
            title="AI Plant Care Assistant",
            subtitle="Upload a quick photo of your plant to diagnose leaves, detect watering issues, and get personalized plant care advice instantly.",
            feature_points=[
                "Instant Leaf Disease & Bug Detection",
                "Automated Watering & Sun Light Schedules",
                "Custom Soil & Fertilizer Recommendations",
            ],
            cta_text="Try AI Care Doctor →",
            cta_link="/ai-care",
            image_url="/ai-care-hero.jpg",
        )

    @classmethod
    def get_garden_services_summary(cls) -> GardenServicesSummarySchema:
        return GardenServicesSummarySchema(
            title="Professional Urban Garden Setup",
            subtitle="Transform your balcony, terrace, or office space into a lush green haven with our expert landscape design team.",
            services=[
                ServiceItemSchema(
                    id="balcony-setup",
                    title="Balcony Transformation",
                    description="Custom planter layout, drip irrigation, and outdoor air-purifiers.",
                    icon="🏡",
                    price_start=4999.0,
                ),
                ServiceItemSchema(
                    id="office-greenery",
                    title="Corporate Office Greens",
                    description="Ergonomic indoor plants with monthly maintenance contracts.",
                    icon="🏢",
                    price_start=9999.0,
                ),
                ServiceItemSchema(
                    id="terrace-garden",
                    title="Terrace & Kitchen Garden",
                    description="Organic vegetable beds, fruit pots, and vertical green walls.",
                    icon="🌱",
                    price_start=14999.0,
                ),
            ],
            cta_text="Book Free Inspection",
            cta_link="/admin/garden-services",
        )

    @classmethod
    def get_homepage_blogs(cls) -> List[BlogSummarySchema]:
        return [
            BlogSummarySchema(
                id=1,
                title="7 Air-Purifying Plants Every Home Needs",
                slug="7-air-purifying-plants",
                excerpt="Learn which houseplants effectively remove toxins like formaldehyde and benzene from indoor air.",
                image_url="/blog-air-plants.jpg",
                read_time="4 min read",
                published_at="2026-07-15",
            ),
            BlogSummarySchema(
                id=2,
                title="How to Keep Monstera Deliciosa Thriving in Small Spaces",
                slug="monstera-care-guide",
                excerpt="Master light requirements, node propagation, and moss pole installation for oversized fenestrated leaves.",
                image_url="/blog-monstera.jpg",
                read_time="6 min read",
                published_at="2026-07-10",
            ),
            BlogSummarySchema(
                id=3,
                title="Under-watering vs Over-watering: The Ultimate Leaf Guide",
                slug="watering-guide",
                excerpt="Identify yellow tips, crispy brown edges, and root rot early to save your favorite plants.",
                image_url="/blog-watering.jpg",
                read_time="5 min read",
                published_at="2026-07-02",
            ),
        ]

    @classmethod
    def get_newsletter_config(cls) -> NewsletterSchema:
        return NewsletterSchema(
            title="Join Our Green Community",
            subtitle="Subscribe to receive weekly expert plant care tips, rare restock alerts, and 10% OFF your first order.",
            placeholder="Enter your email address...",
            button_text="Subscribe Now",
            discount_note="🎁 Instantly claim your 10% discount code upon subscribing.",
        )
