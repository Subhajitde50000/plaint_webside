from pydantic import BaseModel
from typing import Optional, List, TypeVar, Generic

T = TypeVar("T")


class PaginatedResponse(BaseModel):
    """Generic paginated response wrapper."""
    total: int
    page: int
    page_size: int
    pages: int
    has_next: bool
    has_prev: bool


class MessageResponse(BaseModel):
    message: str


class SuccessResponse(BaseModel):
    success: bool = True
    message: Optional[str] = None
