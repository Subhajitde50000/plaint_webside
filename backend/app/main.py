from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from contextlib import asynccontextmanager
import structlog


from config import settings
# from app.datbase import
# from app.api.router import api_router

logger = structlog.get_logger()
async def lifespan(app: FastAPI):
    logger.info("Starting Hero Plant Store API", env=settings.ENVIRONMENT)
    yield
    logger.info("Shutting down")

app = FastAPI(
    title="Hero plant Store API",
    version="1.0.0",
    docs_url="/docs" if settings.ENVIRONMENT != "production" else None,
    redoc_url="/redoc" if settings.ENVIRONMENT != "production" else None,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origin=settings.ALLOWED_ORIGINS,
    allow_methods = ['*'],
    allow_headers=['*'],
    allow_credentials=True,
)
# app.include_router(GZipMiddleware, prefix='/app/v1')
app.add_middleware(GZipMiddleware, minimum_size=1000)

@app.get("/health")
async def health_check():
    return {"status": "ok", "version": "1.0.0"}
