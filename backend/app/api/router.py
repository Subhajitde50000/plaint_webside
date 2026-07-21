from fastapi import APIRouter

# Auth
from app.api.v1.auth.storefront_auth import router as storefront_auth_router
from app.api.v1.auth.admin_auth import router as admin_auth_router

# Storefront
from app.api.v1.storefront.products import router as products_router
from app.api.v1.storefront.categories import router as categories_router
from app.api.v1.storefront.cart import router as cart_router
from app.api.v1.storefront.orders import router as orders_router
from app.api.v1.storefront.customers import router as customers_router
from app.api.v1.storefront.reviews import router as reviews_router
from app.api.v1.storefront.ai_care import router as ai_care_router
from app.api.v1.storefront.garden_services import router as garden_services_router
from app.api.v1.storefront.search import router as search_router
from app.api.v1.storefront.homepage import router as homepage_router

# Admin
from app.api.v1.admin.products import router as admin_products_router
from app.api.v1.admin.orders import router as admin_orders_router
from app.api.v1.admin.customers import router as admin_customers_router
from app.api.v1.admin.inventory import router as admin_inventory_router
from app.api.v1.admin.discounts import router as admin_discounts_router
from app.api.v1.admin.reviews import router as admin_reviews_router
from app.api.v1.admin.analytics import router as admin_analytics_router
from app.api.v1.admin.ai_care import router as admin_ai_care_router
from app.api.v1.admin.garden_services import router as admin_garden_router
from app.api.v1.admin.staff import router as admin_staff_router

# Webhooks
from app.api.v1.webhooks.razorpay import router as razorpay_webhook_router
from app.api.v1.webhooks.shiprocket import router as shiprocket_webhook_router

api_router = APIRouter()

# ── Auth ──────────────────────────────────────────────────────────────
api_router.include_router(storefront_auth_router)
api_router.include_router(admin_auth_router)

# ── Storefront ────────────────────────────────────────────────────────
api_router.include_router(products_router)
api_router.include_router(categories_router)
api_router.include_router(cart_router)
api_router.include_router(orders_router)
api_router.include_router(customers_router)
api_router.include_router(reviews_router)
api_router.include_router(ai_care_router)
api_router.include_router(garden_services_router)
api_router.include_router(search_router)
api_router.include_router(homepage_router)

# ── Admin ─────────────────────────────────────────────────────────────
api_router.include_router(admin_products_router)
api_router.include_router(admin_orders_router)
api_router.include_router(admin_customers_router)
api_router.include_router(admin_inventory_router)
api_router.include_router(admin_discounts_router)
api_router.include_router(admin_reviews_router)
api_router.include_router(admin_analytics_router)
api_router.include_router(admin_ai_care_router)
api_router.include_router(admin_garden_router)
api_router.include_router(admin_staff_router)

# ── Webhooks ──────────────────────────────────────────────────────────
api_router.include_router(razorpay_webhook_router)
api_router.include_router(shiprocket_webhook_router)
