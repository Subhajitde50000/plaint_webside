from pydantic_settings import BaseSettings
from functools import lru_cache
from pathlib import Path
from typing import List, Union, Any

class Settings(BaseSettings):
    # App
    ENVIRONMENT: str = "development"
    SECRET_KEY: str = "change-me-in-production-use-256-bit-random-key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    # Database
    # DATABASE_URL: str = "mysql+pymysql://root:1234@127.0.0.1:3306/plant_store"
    DB_HOST: str = "gateway01.ap-southeast-1.prod.aws.tidbcloud.com"
    DB_PORT: int = 4000
    DB_USERNAME: str = "3AuTUnN3B2GJ5qZ.root"
    DB_PASSWORD: str = "jrRsMJ2YtfpKPECU"
    DB_DATABASE: str = "plant_store"
    DB_CA: str = str(Path(__file__).resolve().parents[1] / "isrgrootx1.pem")
    DATABASE_POOL_SIZE: int = 10
    DATABASE_MAX_OVERFLOW: int = 20
    DATABASE_POOL_TIMEOUT: int = 30

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    CACHE_TTL_SECONDS: int = 300  # 5 min default cache

    # Storage
    AWS_ACCESS_KEY_ID: str = "your-access-key"
    AWS_SECRET_ACCESS_KEY: str = "your-secret-key"
    AWS_S3_BUCKET: str = "hero-plant-store-media"
    AWS_S3_REGION: str = "ap-south-1"
    CDN_BASE_URL: str = "https://cdn.heroplants.com"

    # Payment
    RAZORPAY_KEY_ID: str = "rzp_test_XXXXXXXXXX"
    RAZORPAY_KEY_SECRET: str = "your-razorpay-secret"
    RAZORPAY_WEBHOOK_SECRET: str = "your-webhook-secret"

    # Shipping
    SHIPROCKET_EMAIL: str = "ops@heroplants.com"
    SHIPROCKET_PASSWORD: str = "your-shiprocket-password"

    # AI
    OPENAI_API_KEY: str = "sk-your-openai-key"
    OPENAI_MODEL: str = "gpt-4o"
    GOOGLE_VISION_API_KEY: str = "your-google-vision-key"

    # Notifications
    KLAVIYO_API_KEY: str = "pk_your-klaviyo-key"
    MSG91_AUTH_KEY: str = "your-msg91-key"
    MSG91_SENDER_ID: str = "HEROPL"

    # Google SMTP Settings
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""

    # Use a Google App Password (not your regular password) if 2FA is enabled
    SMTP_PASSWORD: str = ""
    EMAILS_FROM_NAME: str = "Hero Plants"
    EMAILS_FROM_EMAIL: str = ""

    # CORS
    ALLOWED_ORIGINS: Union[List[str], str] = ["http://localhost:3000", "http://localhost:3001", "https://plaintwebsite.vercel.app"]

    class Config:
        env_file = str(Path(__file__).resolve().parents[1] / ".env")
        extra = "ignore"


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
