import json
import hashlib
from functools import wraps
from typing import Callable, Any, Optional

try:
    import redis.asyncio as aioredis
    REDIS_AVAILABLE = True
except ImportError:
    REDIS_AVAILABLE = False

from app.config import settings

_redis: Optional[Any] = None


async def get_redis():
    global _redis
    if _redis is None and REDIS_AVAILABLE:
        try:
            _redis = await aioredis.from_url(
                settings.REDIS_URL,
                encoding="utf-8",
                decode_responses=True,
            )
        except Exception:
            _redis = None
    return _redis


async def cache_get(key: str) -> Optional[Any]:
    r = await get_redis()
    if r is None:
        return None
    try:
        value = await r.get(key)
        return json.loads(value) if value else None
    except Exception:
        return None


async def cache_set(key: str, value: Any, ttl: int = 300) -> None:
    r = await get_redis()
    if r is None:
        return
    try:
        await r.setex(key, ttl, json.dumps(value, default=str))
    except Exception:
        pass


async def cache_delete(key: str) -> None:
    r = await get_redis()
    if r is None:
        return
    try:
        await r.delete(key)
    except Exception:
        pass


async def cache_delete_pattern(pattern: str) -> None:
    r = await get_redis()
    if r is None:
        return
    try:
        keys = await r.keys(pattern)
        if keys:
            await r.delete(*keys)
    except Exception:
        pass


def cache_response(ttl: int = 300, key_prefix: str = "cache"):
    """Decorator that caches FastAPI route responses in Redis."""
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Build cache key from prefix + all query kwargs
            key_data = json.dumps(
                {k: v for k, v in kwargs.items() if not hasattr(v, "__class__") or v.__class__.__name__ not in ("Session",)},
                sort_keys=True,
                default=str,
            )
            key_hash = hashlib.md5(key_data.encode()).hexdigest()
            cache_key = f"{key_prefix}:{key_hash}"

            cached = await cache_get(cache_key)
            if cached is not None:
                return cached

            result = await func(*args, **kwargs)
            # Only cache serializable results
            try:
                await cache_set(cache_key, result, ttl)
            except Exception:
                pass
            return result
        return wrapper
    return decorator
