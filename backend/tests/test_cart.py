"""Tests for cart endpoints."""
import pytest
import uuid
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models.category import Category
from app.models.product import Product, ProductVariant
from app.models.inventory import Inventory


def create_variant(db: Session) -> ProductVariant:
    cat = Category(name="Plants", slug=f"plants-{uuid.uuid4().hex[:6]}")
    db.add(cat)
    db.flush()

    product = Product(
        uuid=str(uuid.uuid4()),
        category_id=cat.id,
        product_type="plant",
        title="Cactus",
        slug=f"cactus-{uuid.uuid4().hex[:6]}",
        base_price=299.00,
        status="active",
    )
    db.add(product)
    db.flush()

    variant = ProductVariant(
        product_id=product.id,
        variant_type="size",
        option_name="Small",
        price=299.00,
        sku=f"SKU-{uuid.uuid4().hex[:8]}",
    )
    db.add(variant)
    db.flush()

    db.add(Inventory(variant_id=variant.id, warehouse_id=1, quantity=50))
    db.commit()
    return variant


def test_get_empty_cart(client: TestClient, auth_headers):
    resp = client.get("/api/v1/cart/", headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json()["items"] == []


def test_add_item_to_cart(client: TestClient, auth_headers, db: Session):
    variant = create_variant(db)
    resp = client.post("/api/v1/cart/items/", json={
        "variant_id": variant.id,
        "quantity": 2,
    }, headers=auth_headers)
    assert resp.status_code == 201
    assert resp.json()["message"] == "Item added to cart."


def test_cart_shows_added_items(client: TestClient, auth_headers, db: Session):
    variant = create_variant(db)
    client.post("/api/v1/cart/items/", json={"variant_id": variant.id, "quantity": 1}, headers=auth_headers)
    resp = client.get("/api/v1/cart/", headers=auth_headers)
    assert resp.status_code == 200
    assert len(resp.json()["items"]) == 1


def test_update_cart_item(client: TestClient, auth_headers, db: Session):
    variant = create_variant(db)
    client.post("/api/v1/cart/items/", json={"variant_id": variant.id, "quantity": 1}, headers=auth_headers)
    cart_resp = client.get("/api/v1/cart/", headers=auth_headers)
    item_id = cart_resp.json()["items"][0]["id"]

    resp = client.patch(f"/api/v1/cart/items/{item_id}", json={"quantity": 3}, headers=auth_headers)
    assert resp.status_code == 200


def test_remove_cart_item(client: TestClient, auth_headers, db: Session):
    variant = create_variant(db)
    client.post("/api/v1/cart/items/", json={"variant_id": variant.id, "quantity": 1}, headers=auth_headers)
    cart_resp = client.get("/api/v1/cart/", headers=auth_headers)
    item_id = cart_resp.json()["items"][0]["id"]

    resp = client.delete(f"/api/v1/cart/items/{item_id}", headers=auth_headers)
    assert resp.status_code == 204


def test_cart_requires_auth(client: TestClient):
    resp = client.get("/api/v1/cart/")
    assert resp.status_code == 401
