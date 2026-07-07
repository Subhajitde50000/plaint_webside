"""Tests for product listing and detail endpoints."""
import pytest
import uuid
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models.category import Category
from app.models.product import Product


def create_test_product(db: Session, slug: str = "test-plant") -> Product:
    cat = Category(name="Plants", slug="plants")
    db.add(cat)
    db.flush()

    product = Product(
        uuid=str(uuid.uuid4()),
        category_id=cat.id,
        product_type="plant",
        title="Test Plant",
        slug=slug,
        short_description="A great plant",
        base_price=499.00,
        status="active",
    )
    db.add(product)
    db.commit()
    return product


def test_list_products_empty(client: TestClient):
    resp = client.get("/api/v1/products/")
    assert resp.status_code == 200
    data = resp.json()
    assert "items" in data
    assert data["total"] == 0


def test_list_products_with_data(client: TestClient, db: Session):
    create_test_product(db)
    resp = client.get("/api/v1/products/")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total"] == 1
    assert data["items"][0]["title"] == "Test Plant"


def test_product_detail(client: TestClient, db: Session):
    create_test_product(db, slug="monstera")
    resp = client.get("/api/v1/products/monstera")
    assert resp.status_code == 200
    data = resp.json()
    assert data["slug"] == "monstera"
    assert data["status"] == "active"


def test_product_not_found(client: TestClient):
    resp = client.get("/api/v1/products/nonexistent-product")
    assert resp.status_code == 404


def test_product_filter_by_type(client: TestClient, db: Session):
    create_test_product(db, slug="indoor-plant")
    resp = client.get("/api/v1/products/?product_type=plant")
    assert resp.status_code == 200
    assert resp.json()["total"] == 1

    resp2 = client.get("/api/v1/products/?product_type=pot")
    assert resp2.status_code == 200
    assert resp2.json()["total"] == 0


def test_search_products(client: TestClient, db: Session):
    create_test_product(db, slug="snake-plant")
    resp = client.get("/api/v1/search/?q=snake")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total"] >= 1
    assert data["query"] == "snake"


def test_list_categories_empty(client: TestClient):
    resp = client.get("/api/v1/categories/")
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)
