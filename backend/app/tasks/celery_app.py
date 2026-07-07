from celery import Celery
from app.config import settings

celery_app = Celery(
    "hero_plant_store",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
    include=[
        "app.tasks.order_tasks",
        "app.tasks.email_tasks",
        "app.tasks.analytics_tasks",
        "app.tasks.cleanup_tasks",
    ],
)

celery_app.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    timezone="Asia/Kolkata",
    enable_utc=True,
    task_soft_time_limit=300,    # 5 min soft limit
    task_time_limit=600,         # 10 min hard limit
    worker_prefetch_multiplier=1,
    task_acks_late=True,
)

# ── Beat schedule (periodic tasks) ───────────────────────────────────
celery_app.conf.beat_schedule = {
    "aggregate-analytics-daily": {
        "task": "app.tasks.analytics_tasks.aggregate_daily_metrics",
        "schedule": 3600.0,      # every hour
    },
    "update-discount-statuses": {
        "task": "app.tasks.cleanup_tasks.update_discount_statuses",
        "schedule": 300.0,       # every 5 minutes
    },
    "expire-old-carts": {
        "task": "app.tasks.cleanup_tasks.expire_old_carts",
        "schedule": 86400.0,     # daily
    },
    "expire-verification-tokens": {
        "task": "app.tasks.cleanup_tasks.expire_verification_tokens",
        "schedule": 3600.0,      # hourly
    },
    "send-watering-reminders": {
        "task": "app.tasks.email_tasks.send_watering_reminders",
        "schedule": 86400.0,     # daily 08:00 IST
    },
    "send-review-requests": {
        "task": "app.tasks.email_tasks.send_review_requests",
        "schedule": 86400.0,     # daily
    },
}
