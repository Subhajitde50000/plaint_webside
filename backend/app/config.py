from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import List

class Settings(BaseSettings):
    # ── Application ─────────────────────────────────────────────────────
    ENVIRONMENT:str ="development"
    SECRET_KEY:str
    ALGORITHM:str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES:int = 60
    REFRESH_TOKEN_EXPIRE_DAYS:int = 60

     # Database
    DATABASE_URL: str  # mysql+pymysql://user:pass@host:3306/hero_plant_store
    DATABASE_POOL_SIZE: int = 10
    DATABASE_MAX_OVERFLOW: int = 20
    DATABASE_POOL_TIMEOUT: int = 30

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    CACHE_TTL_SECONDS: int = 300 

    # Storage
    AWS_ACCESS_KEY_ID: str
    AWS_SECRET_ACCESS_KEY: str
    AWS_S3_BUCKET: str
    AWS_S3_REGION: str = "ap-south-1"
    CDN_BASE_URL: str

    # Shipping
    SHIPROCKET_EMAIL: str
    SHIPROCKET_PASSWORD: str

    # AI
    OPENAI_API_KEY: str
    OPENAI_MODEL: str = "gpt-4o"
    GOOGLE_VISION_API_KEY: str

    # Notifications
    KLAVIYO_API_KEY: str
    MSG91_AUTH_KEY: str
    MSG91_SENDER_ID: str

    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000"]

    class Config:
        env_file = ".env"
        extra = "ignore"

@lru_cache
def get_settings() -> Settings:
    return Settings()

settings = get_settings()
