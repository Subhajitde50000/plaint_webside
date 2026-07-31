"""
Script to seed or update admin user directly in the database.
"""
import argparse
import sys
import uuid
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from app.database import SessionLocal
from app.models.admin import AdminUser
from app.utils.security import hash_password
from app.services.garden_seed import seed_garden_services_if_empty


def seed_or_update_admin(
    email: str = "admin@plantcare.com",
    password: str = "Admin123!",
    first_name: str = "Admin",
    last_name: str = "User",
    role: str = "super_admin",
):
    print("--- Seeding/Updating Admin User & Garden Services ---")
    db = SessionLocal()

    try:
        seed_garden_services_if_empty(db)
        existing_admin = db.query(AdminUser).filter(AdminUser.email == email).first()

        if existing_admin:
            print(f"Existing admin user '{email}' found. Updating password and details...")
            existing_admin.password_hash = hash_password(password)
            existing_admin.first_name = first_name
            existing_admin.last_name = last_name
            existing_admin.role = role
            existing_admin.is_active = True
            db.commit()
            print("Successfully updated existing admin password and details!")
        else:
            print(f"Creating new admin user '{email}'...")
            new_admin = AdminUser(
                uuid=str(uuid.uuid4()),
                email=email,
                password_hash=hash_password(password),
                first_name=first_name,
                last_name=last_name,
                role=role,
                is_active=True,
            )
            db.add(new_admin)
            db.commit()
            print("Successfully added new admin user!")

        print("\n==============================================")
        print("  ADMIN CREDENTIALS SET IN DATABASE")
        print("==============================================")
        print(f"  Email:      {email}")
        print(f"  Password:   {password}")
        print(f"  First Name: {first_name}")
        print(f"  Last Name:  {last_name}")
        print(f"  Role:       {role}")
        print("==============================================\n")

    except Exception as e:
        print(f"An error occurred while seeding admin: {e}")
        db.rollback()
    finally:
        db.close()


def main():
    parser = argparse.ArgumentParser(description="Add or update admin user credentials directly.")
    parser.add_argument("--email", default="admin@plantcare.com", help="Admin email address")
    parser.add_argument("--password", default="Admin123!", help="Admin password")
    parser.add_argument("--first-name", default="Admin", help="Admin first name")
    parser.add_argument("--last-name", default="User", help="Admin last name")
    parser.add_argument(
        "--role",
        default="super_admin",
        choices=[
            "super_admin",
            "operations_manager",
            "inventory_manager",
            "customer_support",
            "marketing",
            "garden_services",
            "analyst",
        ],
        help="Admin role (default: super_admin)",
    )

    args = parser.parse_args()
    seed_or_update_admin(
        email=args.email,
        password=args.password,
        first_name=args.first_name,
        last_name=args.last_name,
        role=args.role,
    )


if __name__ == "__main__":
    main()
