"""Tests for auth endpoints: register, login, refresh, forgot/reset password."""
import pytest
from fastapi.testclient import TestClient


def test_register_success(client: TestClient):
    resp = client.post("/api/v1/auth/register", json={
        "first_name": "Jane",
        "last_name": "Doe",
        "email": "jane@example.com",
        "password": "securepass123",
    })
    assert resp.status_code == 201
    data = resp.json()
    assert "user_uuid" in data
    assert data["message"] == "Registration successful. Please verify your email."


def test_register_duplicate_email(client: TestClient):
    payload = {
        "first_name": "Jane",
        "last_name": "Doe",
        "email": "jane@example.com",
        "password": "securepass123",
    }
    client.post("/api/v1/auth/register", json=payload)
    resp = client.post("/api/v1/auth/register", json=payload)
    assert resp.status_code == 409


def test_login_success(client: TestClient, registered_user):
    resp = client.post("/api/v1/auth/login", json={
        "email": registered_user["email"],
        "password": registered_user["password"],
    })
    assert resp.status_code == 200
    data = resp.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_wrong_password(client: TestClient, registered_user):
    resp = client.post("/api/v1/auth/login", json={
        "email": registered_user["email"],
        "password": "wrongpassword",
    })
    assert resp.status_code == 401


def test_login_nonexistent_user(client: TestClient):
    resp = client.post("/api/v1/auth/login", json={
        "email": "nobody@example.com",
        "password": "anypassword",
    })
    assert resp.status_code == 401


def test_get_profile_authenticated(client: TestClient, auth_headers):
    resp = client.get("/api/v1/customers/me", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["email"] == "test@example.com"


def test_get_profile_unauthenticated(client: TestClient):
    resp = client.get("/api/v1/customers/me")
    assert resp.status_code == 401


def test_forgot_password_always_200(client: TestClient):
    # Should return 200 even for non-existent email (no enumeration)
    resp = client.post("/api/v1/auth/forgot-password", json={"email": "ghost@example.com"})
    assert resp.status_code == 200
    assert "message" in resp.json()


def test_health_check(client: TestClient):
    resp = client.get("/health")
    assert resp.status_code == 200
    assert resp.json()["status"] == "ok"
