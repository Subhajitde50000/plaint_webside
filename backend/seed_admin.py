"""
Script to seed demo admin user into the database.
"""
import os
import sys
import uuid
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

# Load .env file if present
dotenv_path = PROJECT_ROOT / ".env"
if dotenv_path.exists():
    with open(dotenv_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, value = line.split("=", 1)
                os.environ.setdefault(key.strip(), value.strip())

# ── Patch SQLite to treat BIGINT as INTEGER (enables autoincrement PKs) ───────
import sqlalchemy.dialects.sqlite.base as _sb

def _bigint_as_integer(self, type_, **kw):
    return "INTEGER"

for _attr in dir(_sb.SQLiteTypeCompiler):
    if "BIG" in _attr.upper() or "bigint" in _attr.lower():
        setattr(_sb.SQLiteTypeCompiler, _attr, _bigint_as_integer)

_sb.SQLiteTypeCompiler.visit_BIGINT = _bigint_as_integer

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.config import settings
from app.database import Base
from app.models import *
from app.utils.security import hash_password

from sqlalchemy import event

def _add_if_not_exists_to_indexes(conn, cursor, statement, params, context, executemany):
    if statement.startswith("CREATE INDEX ") and "IF NOT EXISTS" not in statement:
        statement = statement.replace("CREATE INDEX ", "CREATE INDEX IF NOT EXISTS ", 1)
    return statement, params

def get_db_session():
    # Try configured database URL
    db_urls_to_try = [
        settings.DATABASE_URL,
        os.environ.get("DATABASE_URL"),
        "mysql+pymysql://root:1234@127.0.0.1:3306/plant_store",
        "mysql+pymysql://root:root@localhost:3306/plant_store",
        f"sqlite:///{PROJECT_ROOT / 'dev_plant_store.db'}",
    ]

    for url in db_urls_to_try:
        if not url:
            continue
        try:
            print(f"Connecting to database: {url.split('@')[-1] if '@' in url else url}")
            connect_args = {"check_same_thread": False} if "sqlite" in url else {}
            engine = create_engine(url, connect_args=connect_args)
            if "sqlite" in url:
                event.listen(engine, "before_cursor_execute", _add_if_not_exists_to_indexes, retval=True)
            conn = engine.connect()
            conn.close()
            Base.metadata.create_all(bind=engine)
            Session = sessionmaker(autocommit=False, autoflush=False, bind=engine)
            return Session(), engine, url
        except Exception as e:
            print(f"  Connection attempt failed for {url.split('@')[-1] if '@' in url else url}: {e}")

    raise RuntimeError("Could not connect to any database URL.")


def seed_demo_admin():
    email = "admin@plantcare.com"
    password = "Admin123!"

    print("--- Starting Demo Admin Seeding ---")
    session, engine, active_url = get_db_session()

    try:
        existing = session.query(AdminUser).filter(AdminUser.email == email).first()
        if existing:
            print(f"Existing demo admin user '{email}' found. Updating password and active state...")
            existing.password_hash = hash_password(password)
            existing.is_active = True
            existing.role = "super_admin"
            existing.first_name = "Admin"
            existing.last_name = "User"
            session.commit()
            print("Successfully updated demo admin user!")
        else:
            print(f"Creating new demo admin user '{email}'...")
            admin = AdminUser(
                uuid=str(uuid.uuid4()),
                email=email,
                password_hash=hash_password(password),
                first_name="Admin",
                last_name="User",
                role="super_admin",
                is_active=True,
            )
            session.add(admin)
            session.commit()
            print("Successfully created demo admin user!")

        # Seed default Kolkata warehouse
        kolkata_wh = session.query(Warehouse).filter(Warehouse.city == "Kolkata").first()
        if not kolkata_wh:
            print("Creating default Kolkata Warehouse...")
            kolkata_wh = Warehouse(
                id=1,
                name="Kolkata Warehouse",
                city="Kolkata",
                state="West Bengal",
                pincode="700001",
                is_active=True
            )
            session.add(kolkata_wh)
            session.commit()
            print("Successfully created Kolkata Warehouse!")

        print("\n==============================================")
        print("  DEMO ADMIN CREDENTIALS ADDED TO DATABASE")
        print("==============================================")
        print(f"  Email:    {email}")
        print(f"  Password: {password}")
        print(f"  Role:     super_admin")
        print(f"  Database: {active_url.split('@')[-1] if '@' in active_url else active_url}")
        print("==============================================\n")

    except Exception as e:
        print(f"Error seeding demo admin: {e}")
        session.rollback()
    finally:
        session.close()


if __name__ == "__main__":
    seed_demo_admin()
