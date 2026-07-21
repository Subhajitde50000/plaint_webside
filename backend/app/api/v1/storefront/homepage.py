from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.home_service import HomeService
from app.schemas.homepage import HomepageResponse

router = APIRouter(prefix="/homepage", tags=["Homepage"])


@router.get("/", response_model=HomepageResponse)
async def get_homepage(
    refresh: bool = Query(False, description="Force refresh cache"),
    db: Session = Depends(get_db),
):
    """
    Get aggregated homepage landing data in 1 single HTTP request.
    Leverages domain services, concurrent async execution, and high-performance caching.
    """
    return await HomeService.get_homepage_data(db, force_refresh=refresh)
