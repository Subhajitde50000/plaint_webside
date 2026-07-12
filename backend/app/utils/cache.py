import json
import hashlib
from functools import wraps
from typing import Callable, Any, Optional
import redis.asyncio as aioredis
from app.config import settings

_redis: Optional[aioredis.Redis] = None

async def get_redis() -> aioredis.Redis:
    global _redis
    if _redis is None:
        _redis = await aioredis.from_url(
            settings.REDIS_URL,
            encoding="utf-8",
            decode_responses=True
        )
    return _redis


async def cache_get(key: str) -> Optional[Any]:
    r = await get_redis()
    value = await r.get(key)
    return json.loads(value) if value else None


async def cache_set(key: str, value: Any, ttl: int = 300) -> None:
    r = await get_redis()
    await r.setex(key, ttl, json.dumps(value, default=str))


async def cache_delete(key: str) -> None:
    r = await get_redis()
    await r.delete(key)


async def cache_delete_pattern(pattern: str) -> None:
    r = await get_redis()
    keys = await r.keys(pattern)
    if keys:
        await r.delete(*keys)


def cache_response(ttl: int = 300, key_prefix: str = "cache"):
    """Decorator for caching FastAPI route responses."""
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Build cache key from prefix + kwargs
            key_data = json.dumps(kwargs, sort_keys=True, default=str)
            key_hash = hashlib.md5(key_data.encode()).hexdigest()
            cache_key = f"{key_prefix}:{key_hash}"

            cached = await cache_get(cache_key)
            if cached is not None:
                return cached

            result = await func(*args, **kwargs)
            await cache_set(cache_key, result, ttl)
            return result
        return wrapper
    return decorator