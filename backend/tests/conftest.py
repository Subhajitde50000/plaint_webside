"""
Test configuration using in-memory SQLite.
Uses a session-scoped engine (created once) so all tables exist across all tests.
Each test gets a fresh transactional session that is rolled back after the test.
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, event, text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

# ── Patch SQLite to treat BIGINT as INTEGER (enables autoincrement PKs) ───────
import sqlalchemy.dialects.sqlite.base as _sb

def _bigint_as_integer(self, type_, **kw):
    return "INTEGER"

for _attr in dir(_sb.SQLiteTypeCompiler):
    if "BIG" in _attr.upper() or "bigint" in _attr.lower():
        setattr(_sb.SQLiteTypeCompiler, _attr, _bigint_as_integer)

# Also patch the main BigInteger rendering
_sb.SQLiteTypeCompiler.visit_BIGINT = _bigint_as_integer

# ── Create the shared in-memory engine ────────────────────────────────────────
engine = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
    echo=False,
)

# On SQLite, execute CREATE INDEX with IF NOT EXISTS workaround
@event.listens_for(engine, "before_cursor_execute", retval=True)
def _add_if_not_exists_to_indexes(conn, cursor, statement, params, context, executemany):
    """Rewrite 'CREATE INDEX idx_x ON tbl' -> 'CREATE INDEX IF NOT EXISTS idx_x ON tbl'"""
    if statement.startswith("CREATE INDEX ") and "IF NOT EXISTS" not in statement:
        statement = statement.replace("CREATE INDEX ", "CREATE INDEX IF NOT EXISTS ", 1)
    return statement, params


TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


# Import app AFTER all patches
from app.database import Base, get_db
from app.main import app  # noqa: E402

app.dependency_overrides[get_db] = override_get_db


# ── Session-scoped: create tables ONCE for the whole test session ─────────────
@pytest.fixture(scope="session", autouse=True)
def create_tables():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


# ── Function-scoped: wrap each test in a savepoint (transaction rollback) ─────
@pytest.fixture(scope="function", autouse=True)
def clean_db(create_tables):
    """Truncate all tables before each test to ensure isolation."""
    conn = engine.connect()
    trans = conn.begin()
    # Disable FK checks so truncation order doesn't matter
    conn.execute(text("PRAGMA foreign_keys=OFF"))
    for table in reversed(Base.metadata.sorted_tables):
        conn.execute(table.delete())
    conn.execute(text("PRAGMA foreign_keys=ON"))
    trans.commit()
    conn.close()
    yield


@pytest.fixture(scope="function")
def client(clean_db):
    return TestClient(app)


@pytest.fixture(scope="function")
def db(clean_db):
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture
def registered_user(client):
    """Register and return a test user."""
    resp = client.post("/api/v1/auth/register", json={
        "first_name": "Test",
        "last_name": "User",
        "email": "test@example.com",
        "password": "testpassword123",
    })
    assert resp.status_code == 201, f"Register failed: {resp.json()}"
    return {"email": "test@example.com", "password": "testpassword123"}


@pytest.fixture
def auth_headers(client, registered_user):
    """Login and return Authorization headers."""
    resp = client.post("/api/v1/auth/login", json={
        "email": registered_user["email"],
        "password": registered_user["password"],
    })
    assert resp.status_code == 200, f"Login failed: {resp.json()}"
    token = resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}
