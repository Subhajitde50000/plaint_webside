"""
Garden Services Database Seeder.
Populates default service types and gardeners if empty.
"""
from decimal import Decimal
from datetime import date
from sqlalchemy.orm import Session
from app.models.garden_service import GardenServiceType, Gardener


DEFAULT_SERVICE_TYPES = [
    {
        "id": 1,
        "name": "Balcony & Terrace Garden Setup",
        "slug": "balcony-terrace-setup",
        "description": "Complete design, plant selection, pot placement, and drip layout for outdoor balcony & terrace spaces.",
        "duration_hours": Decimal("4.0"),
        "base_price": Decimal("4999.00"),
        "image_url": "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80",
        "is_active": True,
        "sort_order": 1,
    },
    {
        "id": 2,
        "name": "Lawn Maintenance & Care",
        "slug": "lawn-maintenance",
        "description": "Professional lawn mowing, weed control, aeration, edging, and seasonal fertilization service.",
        "duration_hours": Decimal("2.0"),
        "base_price": Decimal("1999.00"),
        "image_url": "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=800&q=80",
        "is_active": True,
        "sort_order": 2,
    },
    {
        "id": 3,
        "name": "Indoor Plant Styling & Setup",
        "slug": "indoor-plant-styling",
        "description": "Aesthetic plant arrangement, decorative pot selection, and light assessment for home or office spaces.",
        "duration_hours": Decimal("2.5"),
        "base_price": Decimal("2499.00"),
        "image_url": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80",
        "is_active": True,
        "sort_order": 3,
    },
    {
        "id": 4,
        "name": "Vertical Garden Installation",
        "slug": "vertical-garden",
        "description": "Custom living green wall installation with automated drip irrigation and foliage arrangement.",
        "duration_hours": Decimal("6.0"),
        "base_price": Decimal("7999.00"),
        "image_url": "https://images.unsplash.com/photo-1534710961216-b5c8d4529031?auto=format&fit=crop&w=800&q=80",
        "is_active": True,
        "sort_order": 4,
    },
    {
        "id": 5,
        "name": "Pest & Disease Treatment",
        "slug": "pest-treatment",
        "description": "Organic pest treatment, fungal spray, root health assessment, and plant revitalization treatment.",
        "duration_hours": Decimal("1.5"),
        "base_price": Decimal("1299.00"),
        "image_url": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80",
        "is_active": True,
        "sort_order": 5,
    },
    {
        "id": 6,
        "name": "Seasonal Plant Repotting",
        "slug": "seasonal-repotting",
        "description": "Root pruning, nutrient-rich soil mix upgrade, fresh container fitting, and post-potting care.",
        "duration_hours": Decimal("1.0"),
        "base_price": Decimal("999.00"),
        "image_url": "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&w=800&q=80",
        "is_active": True,
        "sort_order": 6,
    },
]

DEFAULT_GARDENERS = [
    {
        "id": 1,
        "name": "Ramesh Sharma",
        "phone": "+91 9876543210",
        "email": "ramesh.gardener@plantcare.com",
        "city": "Mumbai",
        "state": "Maharashtra",
        "specialisations": "1,2,6",
        "rating_average": Decimal("4.85"),
        "rating_count": 42,
        "is_active": True,
        "joined_at": date(2024, 1, 15),
    },
    {
        "id": 2,
        "name": "Suresh Verma",
        "phone": "+91 9876543211",
        "email": "suresh.gardener@plantcare.com",
        "city": "Delhi",
        "state": "Delhi",
        "specialisations": "3,4,5",
        "rating_average": Decimal("4.90"),
        "rating_count": 38,
        "is_active": True,
        "joined_at": date(2024, 2, 10),
    },
    {
        "id": 3,
        "name": "Vikram Singh",
        "phone": "+91 9876543212",
        "email": "vikram.gardener@plantcare.com",
        "city": "Bangalore",
        "state": "Karnataka",
        "specialisations": "1,3,4",
        "rating_average": Decimal("4.78"),
        "rating_count": 29,
        "is_active": True,
        "joined_at": date(2024, 3, 1),
    },
]


def seed_garden_services_if_empty(db: Session):
    """Seed service types and gardeners if none exist in the DB."""
    try:
        service_count = db.query(GardenServiceType).count()
        if service_count == 0:
            for item in DEFAULT_SERVICE_TYPES:
                service = GardenServiceType(**item)
                db.add(service)
            db.commit()

        gardener_count = db.query(Gardener).count()
        if gardener_count == 0:
            for item in DEFAULT_GARDENERS:
                gardener = Gardener(**item)
                db.add(gardener)
            db.commit()
    except Exception as e:
        db.rollback()
        print(f"Garden seed exception: {e}")
