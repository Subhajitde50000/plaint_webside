from sqlalchemy import create_engine
from sqlalchemy.engine import URL
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from typing import Generator
from pathlib import Path
from app.config import settings

# Resolve DB_CA to absolute path (relative to backend root)
_BASE_DIR = Path(__file__).resolve().parents[1]
_db_ca = str(_BASE_DIR / settings.DB_CA) if settings.DB_CA else ""

engine = create_engine(
    URL.create(
        drivername="mysql+pymysql",
        username=settings.DB_USERNAME,
        password=settings.DB_PASSWORD,
        host=settings.DB_HOST,
        port=settings.DB_PORT,
        database=settings.DB_DATABASE,
    ),
    pool_size=settings.DATABASE_POOL_SIZE,
    max_overflow=settings.DATABASE_MAX_OVERFLOW,
    pool_timeout=settings.DATABASE_POOL_TIMEOUT,
    pool_pre_ping=True,      # reconnect on lost connections
    pool_recycle=3600,       # recycle connections every hour
    connect_args={"ssl": {"ca": _db_ca}} if _db_ca else {},
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
