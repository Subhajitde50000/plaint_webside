# Models package — single source of truth, no duplicates
from app.models.user import User, UserSocialAccount, VerificationToken, RefreshToken
from app.models.admin import AdminUser, AdminRefreshToken
from app.models.address import Address
from app.models.category import Category, Collection, ProductCollection
from app.models.product import (
    Product, ProductVariant, ProductImage, ProductTag,
    ProductCareCard, ProductFeature, ProductSpecification, PotUpsell
)
from app.models.inventory import Inventory, Warehouse, InventoryHistory
from app.models.cart import Cart, CartItem
from app.models.order import (
    Order, OrderItem, OrderStatusHistory, Refund,
    Return, ReturnItem, OrderNote, OrderTag
)
from app.models.discount import (
    Discount, DiscountProduct, DiscountCollection, DiscountUsage, BogoConfig, DiscountAuditLog
)
from app.models.loyalty import LoyaltyAccount, LoyaltyTransaction, Wishlist, WishlistItem
from app.models.review import Review, ReviewPhoto, ReviewFlag, ReviewModerationHistory, ReviewHelpfulVote
from app.models.garden_service import GardenServiceType, GardenBooking, Gardener
from app.models.plant import UserPlant, PlantCareLog, AiCareGuide
from app.models.ai_care import AICareSession, AICareMessage, AICareProductSuggestion, AiCarePlantContext
from app.models.analytics import AnalyticsDaily, NotificationPreference, ActivityLog, PaymentMethod
from app.models.customer_note import CustomerNote

__all__ = [
    "User", "UserSocialAccount", "VerificationToken", "RefreshToken",
    "AdminUser", "AdminRefreshToken",
    "Address",
    "Category", "Collection", "ProductCollection",
    "Product", "ProductVariant", "ProductImage", "ProductTag",
    "ProductCareCard", "ProductFeature", "ProductSpecification", "PotUpsell",
    "Inventory", "Warehouse", "InventoryHistory",
    "Cart", "CartItem",
    "Order", "OrderItem", "OrderStatusHistory", "Refund",
    "Return", "ReturnItem", "OrderNote", "OrderTag",
    "Discount", "DiscountProduct", "DiscountCollection", "DiscountUsage", "BogoConfig", "DiscountAuditLog",
    "LoyaltyAccount", "LoyaltyTransaction", "Wishlist", "WishlistItem",
    "Review", "ReviewPhoto", "ReviewFlag", "ReviewModerationHistory", "ReviewHelpfulVote",
    "GardenServiceType", "GardenBooking", "Gardener",
    "UserPlant", "PlantCareLog", "AiCareGuide",
    "AICareSession", "AICareMessage", "AICareProductSuggestion", "AiCarePlantContext",
    "AnalyticsDaily", "NotificationPreference", "ActivityLog", "PaymentMethod",
    "CustomerNote",
]
