"""Tests for security utilities (password hashing, JWT tokens)."""
import pytest
import time
from app.utils.security import (
    hash_password, verify_password,
    create_access_token, decode_token,
    create_refresh_token, generate_verification_token, sha256_hash,
)
from jose import JWTError


def test_hash_and_verify_password():
    raw = "securepassword123"
    hashed = hash_password(raw)
    assert hashed != raw
    assert verify_password(raw, hashed)


def test_wrong_password_fails():
    hashed = hash_password("correctpassword")
    assert not verify_password("wrongpassword", hashed)


def test_create_and_decode_access_token():
    token = create_access_token(subject="user-uuid-123")
    payload = decode_token(token)
    assert payload["sub"] == "user-uuid-123"
    assert payload["type"] == "access"


def test_access_token_with_role():
    token = create_access_token(subject="admin-uuid-456", role="super_admin")
    payload = decode_token(token)
    assert payload["role"] == "super_admin"


def test_create_refresh_token_uniqueness():
    raw1, hash1 = create_refresh_token()
    raw2, hash2 = create_refresh_token()
    assert raw1 != raw2
    assert hash1 != hash2


def test_sha256_hash_consistency():
    value = "test-refresh-token"
    assert sha256_hash(value) == sha256_hash(value)
    assert sha256_hash(value) != sha256_hash("different-token")


def test_generate_verification_token_length():
    token = generate_verification_token()
    assert len(token) >= 32
