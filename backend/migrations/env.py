from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context

# Load app settings
from app.config import settings

# Import Base and all models so Alembic detects table metadata
from app.database import Base
import app.models.user
import app.models.admin
import app.models.address
import app.models.category
import app.models.product
import app.models.inventory
import app.models.cart
import app.models.order
import app.models.discount
import app.models.loyalty
import app.models.review
import app.models.garden_service
import app.models.ai_care
import app.models.plant
import app.models.analytics

config = context.config
fileConfig(config.config_file_name)
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    url = settings.DATABASE_URL
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    configuration = config.get_section(config.config_ini_section)
    configuration["sqlalchemy.url"] = settings.DATABASE_URL
    connectable = engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
        )
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
