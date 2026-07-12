# Hero Plant Store — Backend Architecture & Database Design
## Complete Technical Specification v1.0

> **Stack:** Python · FastAPI · MySQL 8.0 · Redis · Celery · Shopify API Integration
> **Scope:** Full backend for a production plant e-commerce platform covering storefront APIs, admin APIs, AI Care, Garden Services, Loyalty, Reviews, Analytics, and Auth.

---

## 1. System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        HERO PLANT STORE — SYSTEM ARCHITECTURE               │
│                                                                             │
│  CLIENTS                                                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐ │
│  │  Storefront  │  │ Admin Panel  │  │ Mobile App   │  │  Shopify       │ │
│  │  (Next.js)   │  │  (React)     │  │  (React NV)  │  │  Webhooks      │ │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └───────┬────────┘ │
│         │                 │                  │                   │          │
│  ═══════════════════════ API GATEWAY (Nginx + SSL) ═══════════════════════  │
│         │                 │                  │                   │          │
│  ┌──────▼─────────────────▼──────────────────▼───────────────────▼──────┐  │
│  │                     FastAPI Application                               │  │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌───────────────┐  │  │
│  │  │  Storefront │ │  Admin API  │ │  AI Care    │ │  Webhook      │  │  │
│  │  │  Router     │ │  Router     │ │  Router     │ │  Handler      │  │  │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └───────────────┘  │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                │                                                            │
│     ┌──────────┼───────────────────────────────┐                          │
│     │          │                               │                          │
│  ┌──▼──┐  ┌───▼────┐  ┌────────┐  ┌─────────┐ │                          │
│  │MySQL│  │ Redis  │  │Celery  │  │External │ │                          │
│  │ 8.0 │  │(Cache/ │  │Workers │  │Services │ │                          │
│  │     │  │Queue)  │  │(Tasks) │  │         │ │                          │
│  └─────┘  └────────┘  └────────┘  │Shopify  │ │                          │
│                                   │OpenAI   │ │                          │
│                                   │Razorpay │ │                          │
│                                   │Shiprocket│ │                          │
│                                   │Klaviyo  │ │                          │
│                                   │Google   │ │                          │
│                                   │Vision   │ │                          │
│                                   └─────────┘ │                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Tech Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| API Framework | FastAPI | 0.115.x | REST API, async, auto-docs |
| Language | Python | 3.12+ | Application logic |
| ASGI Server | Uvicorn | 0.30.x | Async server |
| Process Manager | Gunicorn | 23.x | Multi-worker production |
| ORM | SQLAlchemy | 2.0.x | Database abstraction |
| Migrations | Alembic | 1.14.x | Schema versioning |
| Database | MySQL | 8.0.x | Primary data store |
| Cache / Queue | Redis | 7.x | Session cache, task queue |
| Task Queue | Celery | 5.4.x | Async background jobs |
| Validation | Pydantic v2 | 2.x | Request/response schemas |
| Auth | python-jose | 3.x | JWT tokens |
| Password | passlib[bcrypt] | 1.7.x | Password hashing |
| File Storage | AWS S3 / Cloudflare R2 | — | Product images, review photos |
| Email | Klaviyo API | — | Transactional + marketing |
| SMS | MSG91 / Twilio | — | OTP, order updates |
| Payment | Razorpay | — | Payments, refunds |
| Shipping | Shiprocket API | — | Fulfilment, tracking |
| AI | OpenAI GPT-4o | — | AI Care chat |
| Plant ID | Google Vision API | — | Plant identification from photos |
| Monitoring | Prometheus + Grafana | — | Metrics, alerting |
| Logging | structlog + Loki | — | Structured logs |

---

## 3. Project Structure

```
hero-plant-store/
├── app/
│   ├── main.py                    # FastAPI app factory
│   ├── config.py                  # Settings (pydantic-settings)
│   ├── database.py                # SQLAlchemy engine + session
│   ├── dependencies.py            # Shared FastAPI dependencies
│   │
│   ├── api/
│   │   ├── v1/
│   │   │   ├── storefront/        # Public storefront endpoints
│   │   │   │   ├── products.py
│   │   │   │   ├── categories.py
│   │   │   │   ├── cart.py
│   │   │   │   ├── orders.py
│   │   │   │   ├── customers.py
│   │   │   │   ├── reviews.py
│   │   │   │   ├── ai_care.py
│   │   │   │   ├── garden_services.py
│   │   │   │   └── search.py
│   │   │   │
│   │   │   ├── admin/             # Admin-only endpoints
│   │   │   │   ├── products.py
│   │   │   │   ├── orders.py
│   │   │   │   ├── customers.py
│   │   │   │   ├── inventory.py
│   │   │   │   ├── discounts.py
│   │   │   │   ├── reviews.py
│   │   │   │   ├── analytics.py
│   │   │   │   ├── garden_services.py
│   │   │   │   ├── ai_care.py
│   │   │   │   └── staff.py
│   │   │   │
│   │   │   ├── auth/
│   │   │   │   ├── storefront_auth.py
│   │   │   │   └── admin_auth.py
│   │   │   │
│   │   │   └── webhooks/
│   │   │       ├── razorpay.py
│   │   │       └── shiprocket.py
│   │   │
│   │   └── router.py              # API router aggregator
│   │
│   ├── models/                    # SQLAlchemy ORM models
│   │   ├── user.py
│   │   ├── admin.py
│   │   ├── product.py
│   │   ├── category.py
│   │   ├── order.py
│   │   ├── cart.py
│   │   ├── review.py
│   │   ├── discount.py
│   │   ├── loyalty.py
│   │   ├── garden_service.py
│   │   ├── ai_care.py
│   │   ├── address.py
│   │   └── analytics.py
│   │
│   ├── schemas/                   # Pydantic v2 schemas
│   │   ├── product.py
│   │   ├── order.py
│   │   ├── customer.py
│   │   └── ...
│   │
│   ├── services/                  # Business logic layer
│   │   ├── product_service.py
│   │   ├── order_service.py
│   │   ├── payment_service.py
│   │   ├── shipping_service.py
│   │   ├── ai_care_service.py
│   │   ├── loyalty_service.py
│   │   ├── notification_service.py
│   │   └── analytics_service.py
│   │
│   ├── tasks/                     # Celery background tasks
│   │   ├── celery_app.py
│   │   ├── email_tasks.py
│   │   ├── order_tasks.py
│   │   ├── analytics_tasks.py
│   │   └── cleanup_tasks.py
│   │
│   └── utils/
│       ├── security.py
│       ├── pagination.py
│       ├── cache.py
│       └── storage.py
│
├── migrations/                    # Alembic migrations
├── tests/
├── docker-compose.yml
├── Dockerfile
├── requirements.txt
└── .env.example
```


---

## 4. MySQL Database Schema

### 4.1 Database Configuration

```sql
-- MySQL 8.0 production config
CREATE DATABASE hero_plant_store
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Connection settings
-- max_connections = 200
-- innodb_buffer_pool_size = 2G (for 4GB RAM server)
-- query_cache_type = 0 (disabled — use Redis)
-- slow_query_log = ON, long_query_time = 1
```

### 4.2 Users & Authentication

```sql
-- ─────────────────────────────────────────────────────────────────────
-- USERS (storefront customers)
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE users (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid            CHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
    first_name      VARCHAR(100) NOT NULL,
    last_name       VARCHAR(100) NOT NULL,
    email           VARCHAR(254) NOT NULL UNIQUE,
    phone           VARCHAR(15),
    password_hash   VARCHAR(255),           -- NULL for social login
    dob             DATE,
    gender          ENUM('M','F','NB','PNTS'),
    about_me        VARCHAR(240),
    avatar_url      VARCHAR(500),
    preferred_lang  VARCHAR(10) DEFAULT 'en',
    currency        VARCHAR(3) DEFAULT 'INR',
    email_verified  BOOLEAN DEFAULT FALSE,
    phone_verified  BOOLEAN DEFAULT FALSE,
    is_active       BOOLEAN DEFAULT TRUE,
    is_blocked      BOOLEAN DEFAULT FALSE,
    blocked_reason  VARCHAR(500),
    blocked_at      DATETIME,
    last_login_at   DATETIME,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at      DATETIME,               -- soft delete

    INDEX idx_email (email),
    INDEX idx_phone (phone),
    INDEX idx_created_at (created_at),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────────────────────────────
-- SOCIAL AUTH PROVIDERS
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE user_social_accounts (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT UNSIGNED NOT NULL,
    provider        ENUM('google','facebook','apple') NOT NULL,
    provider_uid    VARCHAR(255) NOT NULL,
    access_token    TEXT,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY uq_provider_uid (provider, provider_uid),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────────────────────────────
-- EMAIL VERIFICATION TOKENS
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE verification_tokens (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT UNSIGNED NOT NULL,
    token       CHAR(64) NOT NULL UNIQUE,
    type        ENUM('email_verify','password_reset','phone_otp') NOT NULL,
    expires_at  DATETIME NOT NULL,
    used_at     DATETIME,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_token (token),
    INDEX idx_user_id (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────────────────────────────
-- REFRESH TOKENS (for JWT rotation)
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE refresh_tokens (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT UNSIGNED NOT NULL,
    token_hash  CHAR(64) NOT NULL UNIQUE,  -- SHA-256 of the token
    device_info VARCHAR(255),
    ip_address  VARCHAR(45),
    expires_at  DATETIME NOT NULL,
    revoked_at  DATETIME,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_user_id (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────────────────────────────
-- ADMIN USERS (separate from storefront customers)
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE admin_users (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid            CHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
    first_name      VARCHAR(100) NOT NULL,
    last_name       VARCHAR(100) NOT NULL,
    email           VARCHAR(254) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    role            ENUM(
                        'super_admin',
                        'operations_manager',
                        'inventory_manager',
                        'customer_support',
                        'marketing',
                        'garden_services',
                        'analyst'
                    ) NOT NULL,
    avatar_url      VARCHAR(500),
    is_active       BOOLEAN DEFAULT TRUE,
    mfa_secret      VARCHAR(255),           -- TOTP secret (encrypted)
    mfa_enabled     BOOLEAN DEFAULT FALSE,
    last_login_at   DATETIME,
    last_login_ip   VARCHAR(45),
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────────────────────────────
-- ADMIN REFRESH TOKENS
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE admin_refresh_tokens (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    admin_id    BIGINT UNSIGNED NOT NULL,
    token_hash  CHAR(64) NOT NULL UNIQUE,
    expires_at  DATETIME NOT NULL,
    revoked_at  DATETIME,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE CASCADE
) ENGINE=InnoDB;
```

### 4.3 Addresses

```sql
CREATE TABLE addresses (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT UNSIGNED NOT NULL,
    type            ENUM('home','work','other') DEFAULT 'home',
    label           VARCHAR(50),
    recipient_name  VARCHAR(200) NOT NULL,
    phone           VARCHAR(15) NOT NULL,
    line1           VARCHAR(255) NOT NULL,
    line2           VARCHAR(255),
    city            VARCHAR(100) NOT NULL,
    state           VARCHAR(100) NOT NULL,
    pincode         CHAR(6) NOT NULL,
    country         VARCHAR(100) DEFAULT 'India',
    is_default      BOOLEAN DEFAULT FALSE,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_pincode (pincode)
) ENGINE=InnoDB;
```

### 4.4 Products & Catalogue

```sql
-- ─────────────────────────────────────────────────────────────────────
-- CATEGORIES
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE categories (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    parent_id       INT UNSIGNED,           -- NULL = top-level
    name            VARCHAR(100) NOT NULL,
    slug            VARCHAR(120) NOT NULL UNIQUE,
    description     TEXT,
    image_url       VARCHAR(500),
    sort_order      SMALLINT DEFAULT 0,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_slug (slug),
    INDEX idx_parent_id (parent_id)
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────────────────────────────
-- PRODUCTS
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE products (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid                CHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
    category_id         INT UNSIGNED NOT NULL,
    product_type        ENUM('plant','pot','seed','soil','tool','accessory') NOT NULL,
    title               VARCHAR(255) NOT NULL,
    slug                VARCHAR(280) NOT NULL UNIQUE,
    short_description   VARCHAR(160),
    description         LONGTEXT,           -- rich HTML
    botanical_name      VARCHAR(200),
    common_name         VARCHAR(200),

    -- Pricing (base; variants can override)
    base_price          DECIMAL(10,2) NOT NULL,
    compare_at_price    DECIMAL(10,2),
    cost_price          DECIMAL(10,2),      -- internal only
    discount_badge_text VARCHAR(50),        -- custom or NULL (auto-calc)
    price_note          VARCHAR(100),       -- "incl. of all taxes"
    is_taxable          BOOLEAN DEFAULT TRUE,
    tax_rate            DECIMAL(5,2) DEFAULT 18.00,  -- GST %

    -- Care info (plants only)
    care_light          VARCHAR(100),       -- "Indirect Bright Light"
    care_water          VARCHAR(100),       -- "Weekly"
    care_temperature    VARCHAR(50),        -- "18–27°C"
    care_skill          ENUM('beginner','intermediate','expert'),
    is_pet_friendly     BOOLEAN,
    is_air_purifying    BOOLEAN,

    -- Delivery
    delivery_eta_label      VARCHAR(100) DEFAULT '3–5 business days',
    health_guarantee_label  VARCHAR(100) DEFAULT '7-day health guarantee',
    packaging_label         VARCHAR(100) DEFAULT 'Eco-friendly packaging',
    weight_grams            DECIMAL(8,2),
    length_cm               DECIMAL(6,2),
    width_cm                DECIMAL(6,2),
    height_cm               DECIMAL(6,2),
    free_delivery_eligible  BOOLEAN DEFAULT TRUE,

    -- SEO
    seo_title           VARCHAR(70),
    seo_description     VARCHAR(160),

    -- Status
    status              ENUM('draft','active','archived') DEFAULT 'draft',
    published_at        DATETIME,

    -- Ratings cache (denormalised for performance)
    rating_average      DECIMAL(3,2) DEFAULT 0.00,
    rating_count        INT UNSIGNED DEFAULT 0,

    created_by          BIGINT UNSIGNED,
    created_at          DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (created_by) REFERENCES admin_users(id) ON DELETE SET NULL,
    INDEX idx_slug (slug),
    INDEX idx_status (status),
    INDEX idx_category_id (category_id),
    INDEX idx_product_type (product_type),
    FULLTEXT idx_ft_search (title, short_description, botanical_name, common_name)
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────────────────────────────
-- PRODUCT TAGS
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE product_tags (
    product_id  BIGINT UNSIGNED NOT NULL,
    tag         VARCHAR(100) NOT NULL,
    PRIMARY KEY (product_id, tag),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_tag (tag)
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────────────────────────────
-- COLLECTIONS (curated groups: Bestsellers, New Arrivals, etc.)
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE collections (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    slug        VARCHAR(120) NOT NULL UNIQUE,
    description TEXT,
    image_url   VARCHAR(500),
    is_active   BOOLEAN DEFAULT TRUE,
    sort_order  SMALLINT DEFAULT 0,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE product_collections (
    product_id      BIGINT UNSIGNED NOT NULL,
    collection_id   INT UNSIGNED NOT NULL,
    sort_order      SMALLINT DEFAULT 0,
    PRIMARY KEY (product_id, collection_id),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────────────────────────────
-- PRODUCT VARIANTS (size, diameter, weight, etc.)
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE product_variants (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id      BIGINT UNSIGNED NOT NULL,
    variant_type    ENUM('size','diameter','weight','pack_size','custom') NOT NULL,
    option_name     VARCHAR(100) NOT NULL,  -- "Small", "14cm", "10 seeds"
    option_detail   VARCHAR(100),           -- "15–25 cm" height range
    best_for        VARCHAR(150),           -- "Most popular pick"
    pot_diameter    VARCHAR(50),            -- "14 cm"
    dispatch_time   VARCHAR(50),            -- "1–2 days"
    price           DECIMAL(10,2) NOT NULL,
    compare_at_price DECIMAL(10,2),
    sku             VARCHAR(100) NOT NULL UNIQUE,
    barcode         VARCHAR(100),
    sort_order      SMALLINT DEFAULT 0,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product_id (product_id),
    INDEX idx_sku (sku)
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────────────────────────────
-- PRODUCT IMAGES
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE product_images (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id      BIGINT UNSIGNED NOT NULL,
    url             VARCHAR(500) NOT NULL,
    alt_text        VARCHAR(255),
    position        TINYINT UNSIGNED DEFAULT 1,  -- 1 = primary/main
    is_primary      BOOLEAN DEFAULT FALSE,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product_id (product_id)
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────────────────────────────
-- INVENTORY LEVELS
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE inventory (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    variant_id      BIGINT UNSIGNED NOT NULL UNIQUE,
    warehouse_id    INT UNSIGNED NOT NULL,
    quantity        INT DEFAULT 0,
    reserved        INT DEFAULT 0,          -- held for pending orders
    reorder_level   INT DEFAULT 10,
    low_stock_alert BOOLEAN DEFAULT TRUE,
    stock_policy    ENUM('deny','backorder','continue') DEFAULT 'deny',
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE CASCADE,
    INDEX idx_variant_id (variant_id)
) ENGINE=InnoDB;

CREATE TABLE warehouses (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    city        VARCHAR(100),
    state       VARCHAR(100),
    pincode     CHAR(6),
    is_active   BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────────────────────────────
-- INVENTORY HISTORY (audit trail for stock changes)
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE inventory_history (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    variant_id      BIGINT UNSIGNED NOT NULL,
    admin_id        BIGINT UNSIGNED,
    type            ENUM('sale','return','adjustment','purchase','damage') NOT NULL,
    quantity_change INT NOT NULL,           -- +/- signed
    quantity_before INT NOT NULL,
    quantity_after  INT NOT NULL,
    reason          VARCHAR(500),
    reference_id    VARCHAR(100),           -- order ID, PO number, etc.
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (variant_id) REFERENCES product_variants(id),
    FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE SET NULL,
    INDEX idx_variant_id (variant_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────────────────────────────
-- PRODUCT CARE GUIDE CARDS (About tab + Care Guide tab)
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE product_care_cards (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id      BIGINT UNSIGNED NOT NULL,
    icon            VARCHAR(50),            -- emoji or icon name
    title           VARCHAR(100) NOT NULL,
    value           VARCHAR(150) NOT NULL,
    detail          TEXT,
    difficulty_level TINYINT DEFAULT 3,     -- 1–5
    sort_order      TINYINT DEFAULT 1,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product_id (product_id)
) ENGINE=InnoDB;

CREATE TABLE product_features (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id  BIGINT UNSIGNED NOT NULL,
    feature     VARCHAR(255) NOT NULL,      -- "Air-purifying" bullet point
    sort_order  TINYINT DEFAULT 1,

    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE product_specifications (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id  BIGINT UNSIGNED NOT NULL,
    label       VARCHAR(100) NOT NULL,      -- "Botanical Name"
    value       VARCHAR(255) NOT NULL,      -- "Monstera deliciosa"
    sort_order  TINYINT DEFAULT 1,

    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────────────────────────────
-- POT UPSELL STRIP (plant products only)
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE pot_upsells (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    plant_product_id    BIGINT UNSIGNED NOT NULL,
    pot_product_id      BIGINT UNSIGNED NOT NULL,
    sort_order          TINYINT DEFAULT 1,

    FOREIGN KEY (plant_product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (pot_product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_plant (plant_product_id)
) ENGINE=InnoDB;
```

### 4.5 Cart & Orders

```sql
-- ─────────────────────────────────────────────────────────────────────
-- CARTS (session carts — persisted to DB for logged-in users)
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE carts (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid            CHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
    user_id         BIGINT UNSIGNED,        -- NULL = guest cart
    session_token   VARCHAR(64),            -- for guest cart identification
    expires_at      DATETIME,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_session_token (session_token)
) ENGINE=InnoDB;

CREATE TABLE cart_items (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    cart_id         BIGINT UNSIGNED NOT NULL,
    variant_id      BIGINT UNSIGNED NOT NULL,
    quantity        SMALLINT UNSIGNED NOT NULL DEFAULT 1,
    price_at_add    DECIMAL(10,2) NOT NULL,  -- snapshot of price when added
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY uq_cart_variant (cart_id, variant_id),
    FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
    FOREIGN KEY (variant_id) REFERENCES product_variants(id)
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────────────────────────────
-- ORDERS
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE orders (
    id                      BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid                    CHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
    order_number            VARCHAR(50) NOT NULL UNIQUE,   -- "ORD-4821"
    user_id                 BIGINT UNSIGNED,               -- NULL = guest
    guest_email             VARCHAR(254),                  -- for guest orders
    guest_phone             VARCHAR(15),

    -- Amounts
    subtotal                DECIMAL(10,2) NOT NULL,
    discount_amount         DECIMAL(10,2) DEFAULT 0.00,
    shipping_amount         DECIMAL(10,2) DEFAULT 0.00,
    tax_amount              DECIMAL(10,2) DEFAULT 0.00,
    total                   DECIMAL(10,2) NOT NULL,
    currency                CHAR(3) DEFAULT 'INR',

    -- Discount
    discount_code           VARCHAR(100),
    discount_id             BIGINT UNSIGNED,
    loyalty_points_used     INT DEFAULT 0,
    loyalty_discount_amount DECIMAL(10,2) DEFAULT 0.00,

    -- Status
    status                  ENUM(
        'order_placed','payment_confirmed','processing',
        'packed','dispatched','in_transit','out_for_delivery',
        'delivered','delivery_attempted','cancelled',
        'return_requested','return_in_transit',
        'return_received','refund_initiated','refunded'
    ) NOT NULL DEFAULT 'order_placed',

    payment_status          ENUM(
        'pending','authorized','paid','partially_paid',
        'refunded','partially_refunded','voided','failed','cod_pending'
    ) DEFAULT 'pending',

    fulfillment_status      ENUM(
        'unfulfilled','partially_fulfilled','fulfilled','returned'
    ) DEFAULT 'unfulfilled',

    -- Payment
    payment_gateway         VARCHAR(50),           -- 'razorpay', 'upi', 'cod'
    razorpay_order_id       VARCHAR(100),
    razorpay_payment_id     VARCHAR(100),
    razorpay_signature      VARCHAR(255),
    transaction_id          VARCHAR(100),

    -- Shipping
    shipping_address_id     BIGINT UNSIGNED,
    shipping_carrier        VARCHAR(100),           -- "Shiprocket"
    tracking_number         VARCHAR(100),
    tracking_url            VARCHAR(500),
    shiprocket_order_id     VARCHAR(100),
    awb_code                VARCHAR(100),
    estimated_delivery      DATE,
    delivered_at            DATETIME,

    -- Meta
    source                  ENUM('web','mobile','admin') DEFAULT 'web',
    notes                   TEXT,                  -- customer note from checkout
    gift_message            TEXT,
    is_gift                 BOOLEAN DEFAULT FALSE,
    risk_score              SMALLINT DEFAULT 0,    -- 0-100
    ip_address              VARCHAR(45),
    user_agent              VARCHAR(500),

    cancelled_at            DATETIME,
    cancel_reason           VARCHAR(500),
    cancelled_by            ENUM('customer','admin','system'),

    created_at              DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at              DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (shipping_address_id) REFERENCES addresses(id) ON DELETE SET NULL,
    FOREIGN KEY (discount_id) REFERENCES discounts(id) ON DELETE SET NULL,
    INDEX idx_order_number (order_number),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_payment_status (payment_status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────────────────────────────
-- ORDER ITEMS
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE order_items (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id        BIGINT UNSIGNED NOT NULL,
    variant_id      BIGINT UNSIGNED NOT NULL,
    product_id      BIGINT UNSIGNED NOT NULL,   -- denormalised for history
    title           VARCHAR(255) NOT NULL,       -- snapshot
    variant_title   VARCHAR(100),               -- snapshot
    sku             VARCHAR(100) NOT NULL,       -- snapshot
    quantity        SMALLINT UNSIGNED NOT NULL,
    unit_price      DECIMAL(10,2) NOT NULL,
    compare_at_price DECIMAL(10,2),
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    total_price     DECIMAL(10,2) NOT NULL,
    tax_amount      DECIMAL(10,2) DEFAULT 0.00,
    image_url       VARCHAR(500),               -- snapshot

    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (variant_id) REFERENCES product_variants(id),
    INDEX idx_order_id (order_id)
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────────────────────────────
-- ORDER STATUS HISTORY (fulfilment timeline)
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE order_status_history (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id        BIGINT UNSIGNED NOT NULL,
    status          VARCHAR(50) NOT NULL,
    location        VARCHAR(255),
    description     VARCHAR(500),
    admin_id        BIGINT UNSIGNED,            -- who changed it (NULL = system)
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE SET NULL,
    INDEX idx_order_id (order_id)
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────────────────────────────
-- REFUNDS
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE refunds (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id            BIGINT UNSIGNED NOT NULL,
    admin_id            BIGINT UNSIGNED,
    amount              DECIMAL(10,2) NOT NULL,
    reason              VARCHAR(500),
    type                ENUM('full','partial','store_credit') DEFAULT 'full',
    gateway_refund_id   VARCHAR(100),
    status              ENUM('pending','processed','failed') DEFAULT 'pending',
    processed_at        DATETIME,
    created_at          DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE SET NULL,
    INDEX idx_order_id (order_id)
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────────────────────────────
-- RETURNS
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE returns (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id        BIGINT UNSIGNED NOT NULL,
    reason          ENUM(
                        'damaged_in_transit','wrong_item','changed_mind',
                        'quality_issue','other'
                    ) NOT NULL,
    return_type     ENUM('refund','exchange','store_credit') DEFAULT 'refund',
    status          ENUM('requested','approved','rejected','in_transit','received','refund_issued') DEFAULT 'requested',
    customer_note   TEXT,
    admin_note      TEXT,
    return_tracking VARCHAR(100),
    processed_by    BIGINT UNSIGNED,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (processed_by) REFERENCES admin_users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE return_items (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    return_id   BIGINT UNSIGNED NOT NULL,
    order_item_id BIGINT UNSIGNED NOT NULL,
    quantity    SMALLINT UNSIGNED NOT NULL,
    reason      VARCHAR(500),

    FOREIGN KEY (return_id) REFERENCES returns(id) ON DELETE CASCADE,
    FOREIGN KEY (order_item_id) REFERENCES order_items(id)
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────────────────────────────
-- ORDER NOTES (admin internal notes)
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE order_notes (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id    BIGINT UNSIGNED NOT NULL,
    admin_id    BIGINT UNSIGNED NOT NULL,
    note        TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT TRUE,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (admin_id) REFERENCES admin_users(id)
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────────────────────────────
-- ORDER TAGS
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE order_tags (
    order_id    BIGINT UNSIGNED NOT NULL,
    tag         VARCHAR(100) NOT NULL,
    PRIMARY KEY (order_id, tag),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB;
```


### 4.6 Discounts & Loyalty

```sql
-- ─────────────────────────────────────────────────────────────────────
-- DISCOUNTS
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE discounts (
    id                      BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid                    CHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
    code                    VARCHAR(255),           -- NULL for automatic
    title                   VARCHAR(255) NOT NULL,
    method                  ENUM('code','automatic') NOT NULL,
    discount_type           ENUM('percentage','fixed_amount','free_shipping','bogo') NOT NULL,
    value                   DECIMAL(10,2),          -- % or ₹ amount; NULL for free_shipping
    max_discount_amount     DECIMAL(10,2),          -- cap for % discounts

    -- Scope
    applies_to              ENUM('all','specific_collections','specific_products','specific_customers') DEFAULT 'all',
    exclude_sale_items      BOOLEAN DEFAULT FALSE,

    -- Customer eligibility
    customer_eligibility    ENUM('all','specific_customers','specific_segments','loyalty_tier','first_time') DEFAULT 'all',
    min_loyalty_tier        ENUM('plant_lover','silver','gold'),
    first_time_only         BOOLEAN DEFAULT FALSE,

    -- Minimum requirements
    min_requirement_type    ENUM('none','amount','quantity') DEFAULT 'none',
    min_requirement_value   DECIMAL(10,2),

    -- Usage limits
    usage_limit_total       INT UNSIGNED,           -- NULL = unlimited
    usage_limit_per_customer TINYINT UNSIGNED DEFAULT 1,
    usage_count             INT UNSIGNED DEFAULT 0,

    -- Combinations
    combine_with_product    BOOLEAN DEFAULT FALSE,
    combine_with_order      BOOLEAN DEFAULT FALSE,
    combine_with_shipping   BOOLEAN DEFAULT FALSE,

    -- Dates
    starts_at               DATETIME NOT NULL,
    ends_at                 DATETIME,               -- NULL = no end

    -- Status (computed from dates + usage; stored for fast queries)
    status                  ENUM('draft','scheduled','active','paused','expired') DEFAULT 'draft',

    created_by              BIGINT UNSIGNED,
    created_at              DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at              DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (created_by) REFERENCES admin_users(id) ON DELETE SET NULL,
    INDEX idx_code (code),
    INDEX idx_status (status),
    INDEX idx_starts_at (starts_at),
    INDEX idx_ends_at (ends_at)
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────────────────────────────
-- DISCOUNT PRODUCT / COLLECTION SCOPE
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE discount_products (
    discount_id BIGINT UNSIGNED NOT NULL,
    product_id  BIGINT UNSIGNED NOT NULL,
    is_excluded BOOLEAN DEFAULT FALSE,      -- TRUE = exclusion rule
    PRIMARY KEY (discount_id, product_id),
    FOREIGN KEY (discount_id) REFERENCES discounts(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE discount_collections (
    discount_id     BIGINT UNSIGNED NOT NULL,
    collection_id   INT UNSIGNED NOT NULL,
    PRIMARY KEY (discount_id, collection_id),
    FOREIGN KEY (discount_id) REFERENCES discounts(id) ON DELETE CASCADE,
    FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────────────────────────────
-- DISCOUNT USAGE LOG
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE discount_usage (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    discount_id     BIGINT UNSIGNED NOT NULL,
    order_id        BIGINT UNSIGNED NOT NULL,
    user_id         BIGINT UNSIGNED,
    discount_amount DECIMAL(10,2) NOT NULL,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (discount_id) REFERENCES discounts(id),
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_discount_id (discount_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────────────────────────────
-- BOGO CONFIG (Buy X Get Y)
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE bogo_configs (
    id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    discount_id         BIGINT UNSIGNED NOT NULL UNIQUE,
    buy_quantity        SMALLINT UNSIGNED NOT NULL,
    buy_scope           ENUM('any','specific_product','specific_collection') NOT NULL,
    buy_product_id      BIGINT UNSIGNED,
    buy_collection_id   INT UNSIGNED,
    get_quantity        SMALLINT UNSIGNED NOT NULL,
    get_scope           ENUM('specific_product','specific_collection') NOT NULL,
    get_product_id      BIGINT UNSIGNED,
    get_collection_id   INT UNSIGNED,
    get_discount_type   ENUM('percentage','fixed_price','free') NOT NULL,
    get_discount_value  DECIMAL(10,2),
    limit_once_per_order BOOLEAN DEFAULT TRUE,

    FOREIGN KEY (discount_id) REFERENCES discounts(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────────────────────────────
-- LOYALTY POINTS
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE loyalty_accounts (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT UNSIGNED NOT NULL UNIQUE,
    points_balance  INT DEFAULT 0,
    tier            ENUM('plant_lover','silver','gold') DEFAULT 'plant_lover',
    tier_updated_at DATETIME,
    lifetime_points INT DEFAULT 0,          -- never decremented
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE loyalty_transactions (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT UNSIGNED NOT NULL,
    type            ENUM('earned','redeemed','adjusted','expired','reversed') NOT NULL,
    points          INT NOT NULL,           -- positive or negative signed
    balance_after   INT NOT NULL,
    description     VARCHAR(255),
    order_id        BIGINT UNSIGNED,
    adjusted_by     BIGINT UNSIGNED,        -- admin_id for manual adjustments
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
    FOREIGN KEY (adjusted_by) REFERENCES admin_users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────────────────────────────
-- WISHLIST
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE wishlists (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT UNSIGNED NOT NULL UNIQUE,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE wishlist_items (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    wishlist_id     BIGINT UNSIGNED NOT NULL,
    product_id      BIGINT UNSIGNED NOT NULL,
    variant_id      BIGINT UNSIGNED,
    added_at        DATETIME DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY uq_wishlist_product (wishlist_id, product_id),
    FOREIGN KEY (wishlist_id) REFERENCES wishlists(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;
```

### 4.7 Reviews

```sql
CREATE TABLE reviews (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid                CHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
    product_id          BIGINT UNSIGNED NOT NULL,
    user_id             BIGINT UNSIGNED,
    order_item_id       BIGINT UNSIGNED,       -- for verified purchase check
    reviewer_name       VARCHAR(200) NOT NULL,
    reviewer_email      VARCHAR(254),
    rating              TINYINT UNSIGNED NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title               VARCHAR(255),
    body                TEXT,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    is_featured         BOOLEAN DEFAULT FALSE,
    status              ENUM('submitted','pending','published','rejected','flagged') DEFAULT 'pending',
    rejection_reason    VARCHAR(500),
    admin_reply         TEXT,
    admin_reply_at      DATETIME,
    admin_reply_by      BIGINT UNSIGNED,
    flag_count          TINYINT UNSIGNED DEFAULT 0,
    helpful_count       INT UNSIGNED DEFAULT 0,
    not_helpful_count   INT UNSIGNED DEFAULT 0,
    moderated_by        BIGINT UNSIGNED,
    moderated_at        DATETIME,
    created_at          DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE SET NULL,
    FOREIGN KEY (admin_reply_by) REFERENCES admin_users(id) ON DELETE SET NULL,
    FOREIGN KEY (moderated_by) REFERENCES admin_users(id) ON DELETE SET NULL,
    INDEX idx_product_id (product_id),
    INDEX idx_status (status),
    INDEX idx_rating (rating),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

CREATE TABLE review_photos (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    review_id   BIGINT UNSIGNED NOT NULL,
    url         VARCHAR(500) NOT NULL,
    position    TINYINT UNSIGNED DEFAULT 1,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE review_flags (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    review_id   BIGINT UNSIGNED NOT NULL,
    user_id     BIGINT UNSIGNED,
    reason      ENUM(
        'inappropriate_language','spam','off_topic',
        'fake_purchase','personal_info','suspected_bot','other'
    ) NOT NULL,
    reporter    ENUM('customer','system','admin') DEFAULT 'customer',
    notes       VARCHAR(500),
    resolved_by BIGINT UNSIGNED,
    resolved_at DATETIME,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (resolved_by) REFERENCES admin_users(id) ON DELETE SET NULL,
    INDEX idx_review_id (review_id)
) ENGINE=InnoDB;

CREATE TABLE review_moderation_history (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    review_id   BIGINT UNSIGNED NOT NULL,
    admin_id    BIGINT UNSIGNED,
    action      VARCHAR(100) NOT NULL,      -- "approved", "rejected", "flagged"
    notes       VARCHAR(500),
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE,
    FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE SET NULL
) ENGINE=InnoDB;
```

### 4.8 Garden Services

```sql
CREATE TABLE garden_service_types (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(150) NOT NULL,
    slug        VARCHAR(180) NOT NULL UNIQUE,
    description TEXT,
    duration_hours  DECIMAL(4,1),
    base_price  DECIMAL(10,2) NOT NULL,
    image_url   VARCHAR(500),
    is_active   BOOLEAN DEFAULT TRUE,
    sort_order  TINYINT DEFAULT 1
) ENGINE=InnoDB;

CREATE TABLE garden_bookings (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid                CHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
    booking_number      VARCHAR(50) NOT NULL UNIQUE,  -- "GS-0821"
    user_id             BIGINT UNSIGNED,
    guest_name          VARCHAR(200),
    guest_email         VARCHAR(254),
    guest_phone         VARCHAR(15) NOT NULL,
    service_type_id     INT UNSIGNED NOT NULL,
    address_id          BIGINT UNSIGNED,
    scheduled_date      DATE NOT NULL,
    scheduled_time_from TIME NOT NULL,
    scheduled_time_to   TIME,
    city                VARCHAR(100) NOT NULL,
    state               VARCHAR(100),
    pincode             CHAR(6) NOT NULL,
    address_full        TEXT NOT NULL,              -- snapshot
    customer_notes      TEXT,
    amount              DECIMAL(10,2) NOT NULL,
    payment_status      ENUM('pending','paid','refunded') DEFAULT 'pending',
    payment_gateway     VARCHAR(50),
    transaction_id      VARCHAR(100),
    status              ENUM(
        'pending','confirmed','assigned',
        'in_progress','completed','cancelled'
    ) DEFAULT 'pending',
    assigned_gardener_id INT UNSIGNED,
    admin_notes         TEXT,
    cancelled_at        DATETIME,
    cancel_reason       VARCHAR(500),
    created_at          DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (service_type_id) REFERENCES garden_service_types(id),
    FOREIGN KEY (address_id) REFERENCES addresses(id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_gardener_id) REFERENCES gardeners(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_scheduled_date (scheduled_date),
    INDEX idx_booking_number (booking_number)
) ENGINE=InnoDB;

CREATE TABLE gardeners (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(200) NOT NULL,
    phone           VARCHAR(15) NOT NULL,
    email           VARCHAR(254),
    city            VARCHAR(100) NOT NULL,
    state           VARCHAR(100),
    specialisations VARCHAR(500),           -- comma-separated service type IDs
    rating_average  DECIMAL(3,2) DEFAULT 0.00,
    rating_count    INT UNSIGNED DEFAULT 0,
    is_active       BOOLEAN DEFAULT TRUE,
    joined_at       DATE,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;
```

### 4.9 AI Care

```sql
CREATE TABLE ai_care_sessions (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid            CHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
    user_id         BIGINT UNSIGNED,        -- NULL = guest
    session_token   VARCHAR(64),            -- for guest sessions
    source          ENUM('chat','photo_upload','room_visualiser','quick_prompt') DEFAULT 'chat',
    device_type     VARCHAR(50),
    ip_address      VARCHAR(45),
    duration_seconds INT UNSIGNED,
    message_count   TINYINT UNSIGNED DEFAULT 0,
    photo_url       VARCHAR(500),
    plant_id_result VARCHAR(255),           -- "Monstera Deliciosa"
    plant_id_confidence DECIMAL(5,2),       -- 0-100%
    rating          ENUM('helpful','not_helpful'),
    converted_to_cart BOOLEAN DEFAULT FALSE,
    converted_product_ids TEXT,             -- JSON array of product IDs
    flag_status     ENUM('normal','flagged','reviewed') DEFAULT 'normal',
    flag_reason     VARCHAR(255),
    reviewed_by     BIGINT UNSIGNED,
    reviewed_at     DATETIME,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (reviewed_by) REFERENCES admin_users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at),
    INDEX idx_flag_status (flag_status)
) ENGINE=InnoDB;

CREATE TABLE ai_care_messages (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    session_id  BIGINT UNSIGNED NOT NULL,
    role        ENUM('user','assistant') NOT NULL,
    content     TEXT NOT NULL,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (session_id) REFERENCES ai_care_sessions(id) ON DELETE CASCADE,
    INDEX idx_session_id (session_id)
) ENGINE=InnoDB;

CREATE TABLE ai_care_product_suggestions (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    session_id  BIGINT UNSIGNED NOT NULL,
    product_id  BIGINT UNSIGNED NOT NULL,
    clicked     BOOLEAN DEFAULT FALSE,
    added_to_cart BOOLEAN DEFAULT FALSE,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (session_id) REFERENCES ai_care_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;
```

### 4.10 My Plants (user plant diary)

```sql
CREATE TABLE user_plants (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT UNSIGNED NOT NULL,
    product_id      BIGINT UNSIGNED,        -- linked product (if purchased from store)
    plant_name      VARCHAR(200) NOT NULL,
    nickname        VARCHAR(100),
    location        VARCHAR(100),           -- "Living Room"
    photo_url       VARCHAR(500),
    added_at        DATE NOT NULL,
    last_watered_at DATE,
    next_water_due  DATE,
    watering_interval_days TINYINT UNSIGNED DEFAULT 7,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB;

CREATE TABLE plant_care_logs (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    plant_id    BIGINT UNSIGNED NOT NULL,
    type        ENUM('watered','fertilised','repotted','pruned','note') NOT NULL,
    note        TEXT,
    logged_at   DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (plant_id) REFERENCES user_plants(id) ON DELETE CASCADE,
    INDEX idx_plant_id (plant_id)
) ENGINE=InnoDB;
```

### 4.11 Notifications & Activity Log

```sql
CREATE TABLE notification_preferences (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT UNSIGNED NOT NULL UNIQUE,
    order_updates_email   BOOLEAN DEFAULT TRUE,
    order_updates_push    BOOLEAN DEFAULT TRUE,
    order_updates_sms     BOOLEAN DEFAULT FALSE,
    watering_email        BOOLEAN DEFAULT FALSE,
    watering_push         BOOLEAN DEFAULT TRUE,
    watering_sms          BOOLEAN DEFAULT FALSE,
    price_drops_email     BOOLEAN DEFAULT TRUE,
    price_drops_push      BOOLEAN DEFAULT FALSE,
    offers_email          BOOLEAN DEFAULT TRUE,
    offers_push           BOOLEAN DEFAULT FALSE,
    loyalty_email         BOOLEAN DEFAULT TRUE,
    loyalty_push          BOOLEAN DEFAULT TRUE,
    updated_at            DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────────────────────────────
-- ACTIVITY LOG (admin actions — immutable, append-only)
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE activity_log (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    admin_id        BIGINT UNSIGNED,
    action          VARCHAR(100) NOT NULL,  -- "product.updated", "order.cancelled"
    entity_type     VARCHAR(50) NOT NULL,   -- "product", "order", "customer"
    entity_id       BIGINT UNSIGNED NOT NULL,
    entity_label    VARCHAR(255),           -- human-readable: "Monstera Deliciosa M"
    changes         JSON,                   -- before/after diff
    ip_address      VARCHAR(45),
    user_agent      VARCHAR(500),
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE SET NULL,
    INDEX idx_admin_id (admin_id),
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────────────────────────────
-- ANALYTICS AGGREGATES (pre-computed, updated by Celery)
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE analytics_daily (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    date            DATE NOT NULL,
    metric          VARCHAR(100) NOT NULL,  -- "revenue","orders","new_customers"
    value           DECIMAL(15,4) NOT NULL,
    dimension       VARCHAR(100),           -- optional: "category:indoor_plants"
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY uq_date_metric_dim (date, metric, dimension),
    INDEX idx_date (date),
    INDEX idx_metric (metric)
) ENGINE=InnoDB;
```

### 4.12 Payment Methods (saved cards)

```sql
CREATE TABLE payment_methods (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id             BIGINT UNSIGNED NOT NULL,
    gateway             VARCHAR(50) NOT NULL,   -- "razorpay"
    gateway_customer_id VARCHAR(100),           -- Razorpay customer ID
    gateway_token       VARCHAR(255),           -- Razorpay token ID (encrypted)
    card_network        VARCHAR(50),            -- "Visa", "Mastercard"
    card_last4          CHAR(4),
    card_expiry_month   TINYINT,
    card_expiry_year    SMALLINT,
    is_default          BOOLEAN DEFAULT FALSE,
    created_at          DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB;
```


---

## 5. FastAPI Application Setup

### 5.1 Main Application (`app/main.py`)

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from contextlib import asynccontextmanager
import structlog

from app.config import settings
from app.database import engine, Base
from app.api.router import api_router

logger = structlog.get_logger()

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting Hero Plant Store API", env=settings.ENVIRONMENT)
    yield
    logger.info("Shutting down")

app = FastAPI(
    title="Hero Plant Store API",
    version="1.0.0",
    docs_url="/docs" if settings.ENVIRONMENT != "production" else None,
    redoc_url="/redoc" if settings.ENVIRONMENT != "production" else None,
    lifespan=lifespan,
)

# ── Middleware ────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(GZipMiddleware, minimum_size=1000)

# ── Routes ────────────────────────────────────────────────────────────
app.include_router(api_router, prefix="/api/v1")

@app.get("/health")
async def health_check():
    return {"status": "ok", "version": "1.0.0"}
```

### 5.2 Configuration (`app/config.py`)

```python
from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import List

class Settings(BaseSettings):
    # App
    ENVIRONMENT: str = "development"
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    # Database
    DATABASE_URL: str  # mysql+pymysql://user:pass@host:3306/hero_plant_store
    DATABASE_POOL_SIZE: int = 10
    DATABASE_MAX_OVERFLOW: int = 20
    DATABASE_POOL_TIMEOUT: int = 30

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    CACHE_TTL_SECONDS: int = 300        # 5 min default cache

    # Storage
    AWS_ACCESS_KEY_ID: str
    AWS_SECRET_ACCESS_KEY: str
    AWS_S3_BUCKET: str
    AWS_S3_REGION: str = "ap-south-1"
    CDN_BASE_URL: str

    # Payment
    RAZORPAY_KEY_ID: str
    RAZORPAY_KEY_SECRET: str
    RAZORPAY_WEBHOOK_SECRET: str

    # Shipping
    SHIPROCKET_EMAIL: str
    SHIPROCKET_PASSWORD: str

    # AI
    OPENAI_API_KEY: str
    OPENAI_MODEL: str = "gpt-4o"
    GOOGLE_VISION_API_KEY: str

    # Notifications
    KLAVIYO_API_KEY: str
    MSG91_AUTH_KEY: str
    MSG91_SENDER_ID: str

    # Admin
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000"]

    class Config:
        env_file = ".env"

@lru_cache
def get_settings() -> Settings:
    return Settings()

settings = get_settings()
```

### 5.3 Database Session (`app/database.py`)

```python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from typing import Generator
from app.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    pool_size=settings.DATABASE_POOL_SIZE,
    max_overflow=settings.DATABASE_MAX_OVERFLOW,
    pool_timeout=settings.DATABASE_POOL_TIMEOUT,
    pool_pre_ping=True,         # reconnect on lost connections
    pool_recycle=3600,          # recycle connections every hour
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

---

## 6. Authentication System

### 6.1 Security Utilities (`app/utils/security.py`)

```python
from datetime import datetime, timedelta, timezone
from typing import Optional
import hashlib
import secrets
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def create_access_token(
    subject: str,
    role: Optional[str] = None,
    extra: dict = {}
) -> str:
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    payload = {
        "sub": subject,
        "exp": expire,
        "type": "access",
        **extra
    }
    if role:
        payload["role"] = role
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def create_refresh_token() -> tuple[str, str]:
    """Returns (raw_token, token_hash)"""
    raw = secrets.token_urlsafe(48)
    hashed = hashlib.sha256(raw.encode()).hexdigest()
    return raw, hashed

def decode_token(token: str) -> dict:
    return jwt.decode(
        token,
        settings.SECRET_KEY,
        algorithms=[settings.ALGORITHM]
    )

def generate_verification_token() -> str:
    return secrets.token_urlsafe(48)
```

### 6.2 Storefront Auth (`app/api/v1/auth/storefront_auth.py`)

```python
from fastapi import APIRouter, Depends, HTTPException, status, Response
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone

from app.database import get_db
from app.models.user import User, RefreshToken, VerificationToken
from app.models.loyalty import LoyaltyAccount
from app.models.notification import NotificationPreference
from app.schemas.auth import (
    RegisterRequest, LoginResponse, TokenRefreshRequest,
    ForgotPasswordRequest, ResetPasswordRequest
)
from app.utils.security import (
    hash_password, verify_password,
    create_access_token, create_refresh_token,
    decode_token, generate_verification_token
)
from app.tasks.email_tasks import send_verification_email, send_password_reset_email
from app.config import settings

router = APIRouter(prefix="/auth", tags=["Storefront Auth"])

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    # Check duplicate email
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists."
        )

    user = User(
        first_name=payload.first_name,
        last_name=payload.last_name,
        email=payload.email.lower().strip(),
        password_hash=hash_password(payload.password),
        phone=payload.phone,
    )
    db.add(user)
    db.flush()  # get user.id before commit

    # Bootstrap loyalty account
    db.add(LoyaltyAccount(user_id=user.id))
    # Bootstrap notification prefs (all defaults)
    db.add(NotificationPreference(user_id=user.id))

    # Verification token
    token = generate_verification_token()
    db.add(VerificationToken(
        user_id=user.id,
        token=token,
        type="email_verify",
        expires_at=datetime.now(timezone.utc) + timedelta(hours=48)
    ))
    db.commit()

    # Send verification email (async via Celery)
    send_verification_email.delay(user.id, user.email, user.first_name, token)

    return {"message": "Account created. Check your email to verify."}


@router.post("/login", response_model=LoginResponse)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    response: Response = Response(),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == form_data.username.lower()).first()

    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )

    if user.is_blocked:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account has been blocked. Contact support."
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account not active."
        )

    access_token = create_access_token(str(user.uuid))
    raw_refresh, refresh_hash = create_refresh_token()

    db.add(RefreshToken(
        user_id=user.id,
        token_hash=refresh_hash,
        expires_at=datetime.now(timezone.utc) + timedelta(
            days=settings.REFRESH_TOKEN_EXPIRE_DAYS
        )
    ))
    user.last_login_at = datetime.now(timezone.utc)
    db.commit()

    # Set HttpOnly cookie for refresh token
    response.set_cookie(
        key="refresh_token",
        value=raw_refresh,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 86400
    )

    return LoginResponse(access_token=access_token, token_type="bearer")


@router.post("/refresh")
async def refresh_token(
    request: TokenRefreshRequest,
    db: Session = Depends(get_db)
):
    import hashlib
    token_hash = hashlib.sha256(request.refresh_token.encode()).hexdigest()
    record = db.query(RefreshToken).filter(
        RefreshToken.token_hash == token_hash,
        RefreshToken.revoked_at == None,
        RefreshToken.expires_at > datetime.now(timezone.utc)
    ).first()

    if not record:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token."
        )

    # Rotate: revoke old, issue new
    record.revoked_at = datetime.now(timezone.utc)
    user = record.user

    access_token = create_access_token(str(user.uuid))
    raw_new, new_hash = create_refresh_token()
    db.add(RefreshToken(
        user_id=user.id,
        token_hash=new_hash,
        expires_at=datetime.now(timezone.utc) + timedelta(
            days=settings.REFRESH_TOKEN_EXPIRE_DAYS
        )
    ))
    db.commit()

    return {"access_token": access_token, "refresh_token": raw_new}


@router.post("/forgot-password")
async def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if user:  # always return 200 to prevent email enumeration
        token = generate_verification_token()
        db.add(VerificationToken(
            user_id=user.id,
            token=token,
            type="password_reset",
            expires_at=datetime.now(timezone.utc) + timedelta(hours=1)
        ))
        db.commit()
        send_password_reset_email.delay(user.id, user.email, user.first_name, token)

    return {"message": "If that email exists, a reset link has been sent."}


@router.post("/reset-password")
async def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    record = db.query(VerificationToken).filter(
        VerificationToken.token == payload.token,
        VerificationToken.type == "password_reset",
        VerificationToken.used_at == None,
        VerificationToken.expires_at > datetime.now(timezone.utc)
    ).first()

    if not record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token is invalid or has expired."
        )

    user = record.user
    user.password_hash = hash_password(payload.new_password)
    record.used_at = datetime.now(timezone.utc)

    # Revoke all refresh tokens (security: force re-login everywhere)
    db.query(RefreshToken).filter(
        RefreshToken.user_id == user.id,
        RefreshToken.revoked_at == None
    ).update({"revoked_at": datetime.now(timezone.utc)})

    db.commit()
    return {"message": "Password reset successful. Please log in."}
```

### 6.3 Auth Dependencies (`app/dependencies.py`)

```python
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError

from app.database import get_db
from app.utils.security import decode_token
from app.models.user import User
from app.models.admin import AdminUser

oauth2_storefront = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")
oauth2_admin = OAuth2PasswordBearer(tokenUrl="/api/v1/admin/auth/login")

def get_current_user(
    token: str = Depends(oauth2_storefront),
    db: Session = Depends(get_db)
) -> User:
    try:
        payload = decode_token(token)
        uuid: str = payload.get("sub")
        if not uuid:
            raise ValueError
    except (JWTError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = db.query(User).filter(User.uuid == uuid, User.is_active == True).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    return user

def get_current_admin(
    token: str = Depends(oauth2_admin),
    db: Session = Depends(get_db)
) -> AdminUser:
    try:
        payload = decode_token(token)
        uuid: str = payload.get("sub")
        role: str = payload.get("role")
        if not uuid or not role:
            raise ValueError
    except (JWTError, ValueError):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    admin = db.query(AdminUser).filter(
        AdminUser.uuid == uuid,
        AdminUser.is_active == True
    ).first()
    if not admin:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    return admin

def require_role(*roles: str):
    """Factory for role-based access control."""
    def checker(admin: AdminUser = Depends(get_current_admin)):
        if admin.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to access this resource."
            )
        return admin
    return checker

# Role shortcuts
require_super_admin = require_role("super_admin")
require_ops_or_above = require_role("super_admin", "operations_manager")
require_support_or_above = require_role(
    "super_admin", "operations_manager", "customer_support"
)
require_marketing = require_role("super_admin", "operations_manager", "marketing")
require_inventory = require_role("super_admin", "operations_manager", "inventory_manager")
require_analyst = require_role(
    "super_admin", "operations_manager", "marketing", "analyst"
)
```

---

## 7. Core API Endpoints

### 7.1 Products API (`app/api/v1/storefront/products.py`)

```python
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import and_, or_, func
from typing import Optional, List
from app.database import get_db
from app.models.product import Product, ProductVariant, ProductImage
from app.schemas.product import ProductListResponse, ProductDetailResponse
from app.utils.cache import cache_response
from app.utils.pagination import paginate

router = APIRouter(prefix="/products", tags=["Products"])

@router.get("/", response_model=ProductListResponse)
@cache_response(ttl=120, key_prefix="products:list")
async def list_products(
    db: Session = Depends(get_db),
    category_slug: Optional[str] = None,
    collection_slug: Optional[str] = None,
    product_type: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    in_stock: Optional[bool] = None,
    is_pet_friendly: Optional[bool] = None,
    is_air_purifying: Optional[bool] = None,
    care_skill: Optional[str] = None,
    sort: str = Query(default="popularity", enum=[
        "popularity", "newest", "price_asc", "price_desc",
        "rating", "name_asc"
    ]),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    q: Optional[str] = None,
):
    query = db.query(Product).filter(Product.status == "active")

    if q:
        query = query.filter(
            func.match(
                Product.title, Product.short_description,
                Product.botanical_name, Product.common_name
            ).against(q, mysql_boolean_mode=True)
        )

    if category_slug:
        query = query.join(Product.category).filter(
            Product.category.has(slug=category_slug)
        )

    if product_type:
        query = query.filter(Product.product_type == product_type)

    if min_price is not None:
        query = query.filter(Product.base_price >= min_price)

    if max_price is not None:
        query = query.filter(Product.base_price <= max_price)

    if is_pet_friendly is not None:
        query = query.filter(Product.is_pet_friendly == is_pet_friendly)

    if is_air_purifying is not None:
        query = query.filter(Product.is_air_purifying == is_air_purifying)

    if care_skill:
        query = query.filter(Product.care_skill == care_skill)

    # Sorting
    sort_map = {
        "popularity": Product.rating_count.desc(),
        "newest": Product.published_at.desc(),
        "price_asc": Product.base_price.asc(),
        "price_desc": Product.base_price.desc(),
        "rating": Product.rating_average.desc(),
        "name_asc": Product.title.asc(),
    }
    query = query.order_by(sort_map[sort])

    total = query.count()
    products = query.options(
        joinedload(Product.images),
        joinedload(Product.variants)
    ).offset((page - 1) * page_size).limit(page_size).all()

    return ProductListResponse(
        items=products,
        total=total,
        page=page,
        page_size=page_size,
        pages=(total + page_size - 1) // page_size
    )


@router.get("/{slug}", response_model=ProductDetailResponse)
@cache_response(ttl=60, key_prefix="products:detail")
async def get_product(slug: str, db: Session = Depends(get_db)):
    product = db.query(Product).options(
        joinedload(Product.images),
        joinedload(Product.variants),
        joinedload(Product.care_cards),
        joinedload(Product.features),
        joinedload(Product.specifications),
        joinedload(Product.pot_upsells),
        joinedload(Product.category),
    ).filter(
        Product.slug == slug,
        Product.status == "active"
    ).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")

    return product
```

### 7.2 Orders API (`app/api/v1/storefront/orders.py`)

```python
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.models.order import Order, OrderItem, OrderStatusHistory
from app.models.inventory import Inventory
from app.schemas.order import CreateOrderRequest, OrderResponse
from app.services.order_service import OrderService
from app.services.payment_service import PaymentService

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.post("/", response_model=dict)
async def create_order(
    payload: CreateOrderRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    service = OrderService(db)
    order = service.create_order(user=user, payload=payload)

    # Create Razorpay order
    pay_service = PaymentService()
    razorpay_order = pay_service.create_razorpay_order(
        amount_paise=int(order.total * 100),
        receipt=order.order_number,
    )

    order.razorpay_order_id = razorpay_order["id"]
    db.commit()

    return {
        "order_id": str(order.uuid),
        "order_number": order.order_number,
        "total": str(order.total),
        "razorpay_order_id": razorpay_order["id"],
        "razorpay_key_id": settings.RAZORPAY_KEY_ID,
    }


@router.post("/{order_uuid}/verify-payment")
async def verify_payment(
    order_uuid: str,
    payload: dict,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    order = db.query(Order).filter(
        Order.uuid == order_uuid,
        Order.user_id == user.id
    ).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")

    # Verify Razorpay signature
    pay_service = PaymentService()
    if not pay_service.verify_signature(
        order_id=payload["razorpay_order_id"],
        payment_id=payload["razorpay_payment_id"],
        signature=payload["razorpay_signature"],
    ):
        raise HTTPException(status_code=400, detail="Payment verification failed.")

    order.payment_status = "paid"
    order.status = "payment_confirmed"
    order.razorpay_payment_id = payload["razorpay_payment_id"]
    order.razorpay_signature = payload["razorpay_signature"]

    # Log status change
    db.add(OrderStatusHistory(
        order_id=order.id,
        status="payment_confirmed",
        description="Payment confirmed via Razorpay"
    ))

    db.commit()

    # Async: deduct inventory, award loyalty points, send confirmation email
    from app.tasks.order_tasks import post_payment_tasks
    background_tasks.add_task(post_payment_tasks.delay, str(order.id))

    return {"message": "Payment confirmed.", "order_number": order.order_number}


@router.get("/", response_model=List[OrderResponse])
async def list_my_orders(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
    status: Optional[str] = None,
    page: int = 1,
    page_size: int = 20,
):
    query = db.query(Order).filter(Order.user_id == user.id)
    if status:
        query = query.filter(Order.status == status)
    query = query.order_by(Order.created_at.desc())
    total = query.count()
    orders = query.offset((page - 1) * page_size).limit(page_size).all()
    return orders


@router.get("/{order_uuid}", response_model=OrderResponse)
async def get_order(
    order_uuid: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    order = db.query(Order).filter(
        Order.uuid == order_uuid,
        Order.user_id == user.id
    ).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")
    return order
```

### 7.3 Order Service (`app/services/order_service.py`)

```python
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from typing import Optional
import random, string

from app.models.order import Order, OrderItem, OrderStatusHistory
from app.models.cart import Cart, CartItem
from app.models.inventory import Inventory
from app.models.discount import Discount, DiscountUsage
from app.models.loyalty import LoyaltyAccount
from app.schemas.order import CreateOrderRequest
from app.models.user import User


class OrderService:
    def __init__(self, db: Session):
        self.db = db

    def generate_order_number(self) -> str:
        suffix = "".join(random.choices(string.digits, k=4))
        return f"ORD-{suffix}"

    def create_order(self, user: User, payload: CreateOrderRequest) -> Order:
        db = self.db

        # 1. Validate and lock cart items
        cart = db.query(Cart).filter(Cart.user_id == user.id).first()
        if not cart or not cart.items:
            raise ValueError("Cart is empty.")

        # 2. Calculate pricing
        subtotal = sum(
            item.price_at_add * item.quantity for item in cart.items
        )
        discount_amount = 0.00
        discount_id = None

        if payload.discount_code:
            discount = self._validate_discount(payload.discount_code, user, subtotal)
            discount_amount = self._calculate_discount(discount, cart.items, subtotal)
            discount_id = discount.id

        # 3. Loyalty points
        loyalty_discount = 0.00
        if payload.loyalty_points_to_use:
            account = db.query(LoyaltyAccount).filter(
                LoyaltyAccount.user_id == user.id
            ).first()
            max_use = min(payload.loyalty_points_to_use, account.points_balance)
            loyalty_discount = max_use * 0.10  # 1 pt = ₹0.10
            payload.loyalty_points_to_use = max_use

        # 4. Shipping & Tax
        shipping = 0.00 if (subtotal - discount_amount) >= 499 else 99.00
        taxable = subtotal - discount_amount - loyalty_discount
        tax = round(taxable * 0.18, 2)
        total = taxable + shipping + tax

        # 5. Create order
        order = Order(
            order_number=self.generate_order_number(),
            user_id=user.id,
            subtotal=subtotal,
            discount_amount=discount_amount,
            shipping_amount=shipping,
            tax_amount=tax,
            total=total,
            discount_id=discount_id,
            discount_code=payload.discount_code,
            loyalty_points_used=payload.loyalty_points_to_use or 0,
            loyalty_discount_amount=loyalty_discount,
            shipping_address_id=payload.address_id,
            gift_message=payload.gift_message,
            is_gift=bool(payload.gift_message),
            notes=payload.notes,
        )
        db.add(order)
        db.flush()

        # 6. Create order items from cart
        for cart_item in cart.items:
            db.add(OrderItem(
                order_id=order.id,
                variant_id=cart_item.variant_id,
                product_id=cart_item.variant.product_id,
                title=cart_item.variant.product.title,
                variant_title=cart_item.variant.option_name,
                sku=cart_item.variant.sku,
                quantity=cart_item.quantity,
                unit_price=cart_item.price_at_add,
                compare_at_price=cart_item.variant.compare_at_price,
                total_price=cart_item.price_at_add * cart_item.quantity,
                image_url=(
                    cart_item.variant.product.images[0].url
                    if cart_item.variant.product.images else None
                ),
            ))

        # 7. Reserve inventory
        for cart_item in cart.items:
            inventory = db.query(Inventory).filter(
                Inventory.variant_id == cart_item.variant_id
            ).with_for_update().first()

            if inventory.quantity - inventory.reserved < cart_item.quantity:
                db.rollback()
                raise ValueError(
                    f"Insufficient stock for {cart_item.variant.product.title}"
                )
            inventory.reserved += cart_item.quantity

        # 8. Initial status history
        db.add(OrderStatusHistory(
            order_id=order.id,
            status="order_placed",
            description="Order placed by customer"
        ))

        db.commit()
        return order

    def _validate_discount(
        self, code: str, user: User, subtotal: float
    ) -> Discount:
        discount = self.db.query(Discount).filter(
            Discount.code == code.upper(),
            Discount.status == "active",
            Discount.starts_at <= datetime.now(timezone.utc),
        ).first()

        if not discount:
            raise ValueError("Invalid or expired discount code.")

        if discount.ends_at and discount.ends_at < datetime.now(timezone.utc):
            raise ValueError("This discount code has expired.")

        if discount.usage_limit_total and discount.usage_count >= discount.usage_limit_total:
            raise ValueError("This discount code has reached its usage limit.")

        if discount.min_requirement_type == "amount":
            if subtotal < discount.min_requirement_value:
                raise ValueError(
                    f"Minimum order of ₹{discount.min_requirement_value:.0f} required."
                )

        return discount

    def _calculate_discount(
        self, discount: Discount, cart_items, subtotal: float
    ) -> float:
        if discount.discount_type == "percentage":
            amount = subtotal * (discount.value / 100)
            if discount.max_discount_amount:
                amount = min(amount, discount.max_discount_amount)
            return round(amount, 2)
        elif discount.discount_type == "fixed_amount":
            return min(discount.value, subtotal)
        elif discount.discount_type == "free_shipping":
            return 0.00  # handled in shipping calc
        return 0.00
```

---

## 8. Admin API — Orders Module

```python
# app/api/v1/admin/orders.py
from fastapi import APIRouter, Depends, HTTPException, Query, BackgroundTasks
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import and_, or_
from typing import Optional, List

from app.database import get_db
from app.dependencies import require_support_or_above, require_ops_or_above
from app.models.order import Order, OrderStatusHistory, OrderNote, Refund
from app.models.admin import AdminUser
from app.schemas.order import (
    AdminOrderListResponse, AdminOrderDetailResponse,
    UpdateFulfillmentRequest, AdminOrderNoteRequest
)
from app.services.shipping_service import ShippingService
from app.tasks.order_tasks import send_fulfillment_notification

router = APIRouter(prefix="/admin/orders", tags=["Admin - Orders"])


@router.get("/", response_model=AdminOrderListResponse)
async def list_orders(
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_support_or_above),
    status: Optional[str] = None,
    payment_status: Optional[str] = None,
    fulfillment_status: Optional[str] = None,
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
    city: Optional[str] = None,
    tag: Optional[str] = None,
    q: Optional[str] = None,
    sort: str = Query(default="newest", enum=["newest","oldest","highest","lowest"]),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=25, ge=1, le=250),
):
    query = db.query(Order)

    if status:
        query = query.filter(Order.status == status)
    if payment_status:
        query = query.filter(Order.payment_status == payment_status)
    if q:
        query = query.filter(
            or_(
                Order.order_number.ilike(f"%{q}%"),
                Order.guest_email.ilike(f"%{q}%"),
                Order.tracking_number.ilike(f"%{q}%"),
            )
        )
    if date_from:
        query = query.filter(Order.created_at >= date_from)
    if date_to:
        query = query.filter(Order.created_at <= date_to)

    sort_map = {
        "newest": Order.created_at.desc(),
        "oldest": Order.created_at.asc(),
        "highest": Order.total.desc(),
        "lowest": Order.total.asc(),
    }
    query = query.order_by(sort_map[sort])

    total = query.count()
    orders = query.options(
        joinedload(Order.user),
        joinedload(Order.items),
    ).offset((page - 1) * page_size).limit(page_size).all()

    return AdminOrderListResponse(
        items=orders, total=total, page=page, page_size=page_size
    )


@router.get("/{order_uuid}", response_model=AdminOrderDetailResponse)
async def get_order_detail(
    order_uuid: str,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_support_or_above),
):
    order = db.query(Order).options(
        joinedload(Order.user),
        joinedload(Order.items),
        joinedload(Order.status_history),
        joinedload(Order.notes),
        joinedload(Order.shipping_address),
    ).filter(Order.uuid == order_uuid).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")
    return order


@router.post("/{order_uuid}/fulfill")
async def fulfill_order(
    order_uuid: str,
    payload: UpdateFulfillmentRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_ops_or_above),
):
    order = db.query(Order).filter(Order.uuid == order_uuid).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")

    if order.fulfillment_status == "fulfilled":
        raise HTTPException(status_code=400, detail="Order is already fulfilled.")

    order.fulfillment_status = "fulfilled"
    order.status = "dispatched"
    order.shipping_carrier = payload.carrier
    order.tracking_number = payload.tracking_number
    order.tracking_url = payload.tracking_url

    db.add(OrderStatusHistory(
        order_id=order.id,
        admin_id=admin.id,
        status="dispatched",
        description=f"Marked as fulfilled. Tracking: {payload.tracking_number}"
    ))

    # Release inventory reservations, deduct actual stock
    from app.tasks.order_tasks import deduct_inventory_on_fulfillment
    background_tasks.add_task(
        deduct_inventory_on_fulfillment.delay, order.id
    )

    if payload.notify_customer:
        background_tasks.add_task(
            send_fulfillment_notification.delay, order.id
        )

    db.commit()
    return {"message": "Order fulfilled.", "tracking": payload.tracking_number}


@router.post("/{order_uuid}/cancel")
async def cancel_order(
    order_uuid: str,
    payload: dict,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_ops_or_above),
):
    order = db.query(Order).filter(Order.uuid == order_uuid).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")

    cancellable = {"order_placed", "payment_confirmed", "processing", "packed"}
    if order.status not in cancellable:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot cancel an order in '{order.status}' status."
        )

    order.status = "cancelled"
    order.cancelled_at = datetime.now(timezone.utc)
    order.cancel_reason = payload.get("reason")
    order.cancelled_by = "admin"

    db.add(OrderStatusHistory(
        order_id=order.id,
        admin_id=admin.id,
        status="cancelled",
        description=f"Cancelled by admin. Reason: {payload.get('reason')}"
    ))

    # Release reserved inventory
    from app.tasks.order_tasks import release_inventory_on_cancel
    release_inventory_on_cancel.delay(order.id)

    db.commit()
    return {"message": "Order cancelled."}


@router.post("/{order_uuid}/notes")
async def add_order_note(
    order_uuid: str,
    payload: AdminOrderNoteRequest,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(require_support_or_above),
):
    order = db.query(Order).filter(Order.uuid == order_uuid).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")

    note = OrderNote(
        order_id=order.id,
        admin_id=admin.id,
        note=payload.note,
        is_internal=payload.is_internal,
    )
    db.add(note)
    db.commit()
    return {"message": "Note added."}
```

---

## 9. AI Care API

```python
# app/api/v1/storefront/ai_care.py
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
import httpx, base64, json

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.models.ai_care import AICareSession, AICareMessage
from app.services.ai_care_service import AICareService
from app.utils.storage import upload_file

router = APIRouter(prefix="/ai-care", tags=["AI Care"])


@router.post("/chat")
async def ai_care_chat(
    message: str = Form(...),
    session_uuid: Optional[str] = Form(None),
    photo: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    user: Optional[User] = Depends(get_current_user),
):
    service = AICareService(db)

    # Get or create session
    session = service.get_or_create_session(
        session_uuid=session_uuid,
        user=user,
        source="photo_upload" if photo else "chat",
    )

    # Upload photo if provided
    photo_url = None
    plant_id_result = None
    plant_id_confidence = None

    if photo:
        photo_url = await upload_file(
            file=photo,
            folder=f"ai-care-photos/{session.uuid}",
        )
        # Plant ID via Google Vision
        plant_id_result, plant_id_confidence = await service.identify_plant(photo_url)
        session.photo_url = photo_url
        session.plant_id_result = plant_id_result
        session.plant_id_confidence = plant_id_confidence

    # Save user message
    db.add(AICareMessage(
        session_id=session.id,
        role="user",
        content=message,
    ))

    # Build conversation history for OpenAI context
    history = db.query(AICareMessage).filter(
        AICareMessage.session_id == session.id
    ).order_by(AICareMessage.created_at).all()

    # Generate AI response
    ai_response, suggested_products = await service.generate_response(
        message=message,
        history=history,
        plant_id=plant_id_result,
        photo_url=photo_url,
        db=db,
    )

    # Save AI response
    db.add(AICareMessage(
        session_id=session.id,
        role="assistant",
        content=ai_response,
    ))

    session.message_count = len(history) + 2
    db.commit()

    return {
        "session_uuid": str(session.uuid),
        "response": ai_response,
        "plant_identified": plant_id_result,
        "plant_confidence": plant_id_confidence,
        "suggested_products": suggested_products,
    }


@router.post("/sessions/{session_uuid}/rate")
async def rate_session(
    session_uuid: str,
    rating: str,
    db: Session = Depends(get_db),
    user: Optional[User] = Depends(get_current_user),
):
    if rating not in ("helpful", "not_helpful"):
        raise HTTPException(status_code=400, detail="Invalid rating.")

    session = db.query(AICareSession).filter(
        AICareSession.uuid == session_uuid
    ).first()

    if not session:
        raise HTTPException(status_code=404, detail="Session not found.")

    session.rating = rating
    db.commit()
    return {"message": "Rating saved."}
```

### 9.1 AI Care Service (`app/services/ai_care_service.py`)

```python
from openai import OpenAI
from sqlalchemy.orm import Session
from typing import Optional, List, Tuple
import httpx

from app.config import settings
from app.models.ai_care import AICareSession, AICareMessage
from app.models.product import Product

client = OpenAI(api_key=settings.OPENAI_API_KEY)

SYSTEM_PROMPT = """
You are Hero Plant Store's AI Care assistant — a warm, knowledgeable plant expert.
Help customers care for their plants with accurate, practical advice.
When recommending products, only suggest items from Hero Plant Store.
Keep responses concise (under 200 words), friendly, and actionable.
If a plant is identified from a photo, reference it by name.
Never give advice that could harm plants or people.
"""

class AICareService:
    def __init__(self, db: Session):
        self.db = db

    def get_or_create_session(
        self,
        session_uuid: Optional[str],
        user,
        source: str
    ) -> AICareSession:
        if session_uuid:
            session = self.db.query(AICareSession).filter(
                AICareSession.uuid == session_uuid
            ).first()
            if session:
                return session

        session = AICareSession(
            user_id=user.id if user else None,
            source=source,
        )
        self.db.add(session)
        self.db.flush()
        return session

    async def identify_plant(self, image_url: str) -> Tuple[Optional[str], Optional[float]]:
        """Use Google Vision API to identify plant from uploaded photo."""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"https://vision.googleapis.com/v1/images:annotate?key={settings.GOOGLE_VISION_API_KEY}",
                json={
                    "requests": [{
                        "image": {"source": {"imageUri": image_url}},
                        "features": [
                            {"type": "LABEL_DETECTION", "maxResults": 5},
                            {"type": "WEB_DETECTION", "maxResults": 3},
                        ]
                    }]
                }
            )
            data = response.json()

        # Extract plant name from web entities or labels
        try:
            web = data["responses"][0].get("webDetection", {})
            entities = web.get("webEntities", [])
            plant_entities = [
                e for e in entities
                if e.get("score", 0) > 0.5
            ]
            if plant_entities:
                top = plant_entities[0]
                return top["description"], round(top["score"] * 100, 1)
        except (KeyError, IndexError):
            pass
        return None, None

    async def generate_response(
        self,
        message: str,
        history: List[AICareMessage],
        plant_id: Optional[str],
        photo_url: Optional[str],
        db: Session,
    ) -> Tuple[str, list]:
        # Build message history for OpenAI
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]

        if plant_id:
            messages.append({
                "role": "system",
                "content": f"The customer uploaded a photo. Plant identified: {plant_id}."
            })

        for msg in history[-10:]:  # last 10 messages for context
            messages.append({"role": msg.role, "content": msg.content})

        # Add current message
        if photo_url:
            messages.append({
                "role": "user",
                "content": [
                    {"type": "image_url", "image_url": {"url": photo_url}},
                    {"type": "text", "text": message}
                ]
            })
        else:
            messages.append({"role": "user", "content": message})

        response = client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=messages,
            max_tokens=300,
            temperature=0.7,
        )

        ai_text = response.choices[0].message.content

        # Find relevant products to suggest
        suggested = self._find_relevant_products(message, plant_id, db)

        return ai_text, suggested

    def _find_relevant_products(
        self, message: str, plant_id: Optional[str], db: Session
    ) -> list:
        """Simple keyword-based product suggestion."""
        keywords = message.lower().split()
        care_keywords = ["water", "fertilise", "soil", "pot", "repot", "care", "feed"]

        if any(k in keywords for k in care_keywords):
            products = db.query(Product).filter(
                Product.status == "active",
                Product.product_type.in_(["soil", "tool", "accessory"])
            ).limit(3).all()
            return [{"id": str(p.uuid), "title": p.title, "price": str(p.base_price)} for p in products]

        if plant_id:
            products = db.query(Product).filter(
                Product.status == "active",
                Product.title.ilike(f"%{plant_id.split()[0]}%")
            ).limit(2).all()
            return [{"id": str(p.uuid), "title": p.title, "price": str(p.base_price)} for p in products]

        return []
```


---

## 10. Payment Service (`app/services/payment_service.py`)

```python
import razorpay
import hmac, hashlib
from app.config import settings

class PaymentService:
    def __init__(self):
        self.client = razorpay.Client(
            auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
        )

    def create_razorpay_order(self, amount_paise: int, receipt: str) -> dict:
        return self.client.order.create({
            "amount": amount_paise,
            "currency": "INR",
            "receipt": receipt,
            "payment_capture": 1,
        })

    def verify_signature(
        self, order_id: str, payment_id: str, signature: str
    ) -> bool:
        body = f"{order_id}|{payment_id}"
        expected = hmac.new(
            settings.RAZORPAY_KEY_SECRET.encode(),
            body.encode(),
            hashlib.sha256
        ).hexdigest()
        return hmac.compare_digest(expected, signature)

    def create_refund(self, payment_id: str, amount_paise: int, notes: dict = {}) -> dict:
        return self.client.payment.refund(payment_id, {
            "amount": amount_paise,
            "notes": notes,
        })

    def capture_payment(self, payment_id: str, amount_paise: int) -> dict:
        return self.client.payment.capture(payment_id, amount_paise)
```

---

## 11. Shipping Service (`app/services/shipping_service.py`)

```python
import httpx
from app.config import settings

class ShippingService:
    BASE_URL = "https://apiv2.shiprocket.in/v1/external"

    def __init__(self):
        self._token: str | None = None

    async def get_token(self) -> str:
        if self._token:
            return self._token
        async with httpx.AsyncClient() as client:
            r = await client.post(
                f"{self.BASE_URL}/auth/login",
                json={
                    "email": settings.SHIPROCKET_EMAIL,
                    "password": settings.SHIPROCKET_PASSWORD,
                }
            )
            self._token = r.json()["token"]
        return self._token

    async def create_shipment(self, order) -> dict:
        token = await self.get_token()
        items = [
            {
                "name": item.title,
                "sku": item.sku,
                "units": item.quantity,
                "selling_price": str(item.unit_price),
            }
            for item in order.items
        ]
        payload = {
            "order_id": order.order_number,
            "order_date": order.created_at.strftime("%Y-%m-%d %H:%M"),
            "pickup_location": "Pune FC",
            "billing_customer_name": order.user.first_name,
            "billing_last_name": order.user.last_name,
            "billing_address": order.shipping_address.line1,
            "billing_city": order.shipping_address.city,
            "billing_pincode": order.shipping_address.pincode,
            "billing_state": order.shipping_address.state,
            "billing_country": "India",
            "billing_email": order.user.email,
            "billing_phone": order.shipping_address.phone,
            "shipping_is_billing": True,
            "order_items": items,
            "payment_method": "Prepaid",
            "sub_total": str(order.subtotal),
            "length": 30, "breadth": 30, "height": 20, "weight": 1.0,
        }
        async with httpx.AsyncClient() as client:
            r = await client.post(
                f"{self.BASE_URL}/orders/create/adhoc",
                json=payload,
                headers={"Authorization": f"Bearer {token}"}
            )
        return r.json()

    async def track_shipment(self, awb_code: str) -> dict:
        token = await self.get_token()
        async with httpx.AsyncClient() as client:
            r = await client.get(
                f"{self.BASE_URL}/courier/track/awb/{awb_code}",
                headers={"Authorization": f"Bearer {token}"}
            )
        return r.json()
```

---

## 12. Loyalty Service (`app/services/loyalty_service.py`)

```python
from sqlalchemy.orm import Session
from app.models.loyalty import LoyaltyAccount, LoyaltyTransaction
from app.models.order import Order

POINTS_PER_RUPEE = 1          # 1 point per ₹1 spent
POINTS_TO_RUPEE  = 0.10       # 1 point = ₹0.10
SILVER_THRESHOLD = 500        # lifetime points
GOLD_THRESHOLD   = 2000

class LoyaltyService:
    def __init__(self, db: Session):
        self.db = db

    def earn_points(self, user_id: int, order: Order) -> int:
        points_earned = int(order.total * POINTS_PER_RUPEE)
        account = self.db.query(LoyaltyAccount).filter(
            LoyaltyAccount.user_id == user_id
        ).with_for_update().first()

        account.points_balance += points_earned
        account.lifetime_points += points_earned

        # Tier upgrade check
        if account.lifetime_points >= GOLD_THRESHOLD and account.tier != "gold":
            account.tier = "gold"
        elif account.lifetime_points >= SILVER_THRESHOLD and account.tier == "plant_lover":
            account.tier = "silver"

        self.db.add(LoyaltyTransaction(
            user_id=user_id,
            type="earned",
            points=points_earned,
            balance_after=account.points_balance,
            description=f"Earned for order {order.order_number}",
            order_id=order.id,
        ))
        self.db.commit()
        return points_earned

    def redeem_points(self, user_id: int, points: int, order: Order) -> float:
        account = self.db.query(LoyaltyAccount).filter(
            LoyaltyAccount.user_id == user_id
        ).with_for_update().first()

        if account.points_balance < points:
            raise ValueError("Insufficient loyalty points.")

        discount = round(points * POINTS_TO_RUPEE, 2)
        account.points_balance -= points

        self.db.add(LoyaltyTransaction(
            user_id=user_id,
            type="redeemed",
            points=-points,
            balance_after=account.points_balance,
            description=f"Redeemed for order {order.order_number}",
            order_id=order.id,
        ))
        return discount

    def adjust_points(
        self, user_id: int, points: int, reason: str, admin_id: int
    ) -> None:
        """Admin-initiated adjustment (can be positive or negative)."""
        account = self.db.query(LoyaltyAccount).filter(
            LoyaltyAccount.user_id == user_id
        ).with_for_update().first()

        if points < 0 and account.points_balance + points < 0:
            raise ValueError("Adjustment would result in negative balance.")

        account.points_balance += points
        if points > 0:
            account.lifetime_points += points

        self.db.add(LoyaltyTransaction(
            user_id=user_id,
            type="adjusted",
            points=points,
            balance_after=account.points_balance,
            description=reason,
            adjusted_by=admin_id,
        ))
        self.db.commit()
```

---

## 13. Notification Service (`app/services/notification_service.py`)

```python
import httpx
from app.config import settings

class NotificationService:

    # ── Klaviyo (email) ──────────────────────────────────────────────
    KLAVIYO_BASE = "https://a.klaviyo.com/api"

    async def send_email(self, to_email: str, template_id: str, props: dict):
        async with httpx.AsyncClient() as client:
            await client.post(
                f"{self.KLAVIYO_BASE}/events/",
                headers={
                    "Authorization": f"Klaviyo-API-Key {settings.KLAVIYO_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "data": {
                        "type": "event",
                        "attributes": {
                            "profile": {"$email": to_email},
                            "metric": {"name": template_id},
                            "properties": props,
                        }
                    }
                }
            )

    # ── MSG91 (SMS) ───────────────────────────────────────────────────
    async def send_sms(self, phone: str, message: str):
        async with httpx.AsyncClient() as client:
            await client.post(
                "https://api.msg91.com/api/v5/flow/",
                headers={
                    "authkey": settings.MSG91_AUTH_KEY,
                    "Content-Type": "application/json",
                },
                json={
                    "sender": settings.MSG91_SENDER_ID,
                    "mobiles": phone,
                    "message": message,
                }
            )

    # ── Common notification methods ───────────────────────────────────
    async def order_confirmed(self, user, order):
        await self.send_email(
            to_email=user.email,
            template_id="order_confirmed",
            props={
                "first_name": user.first_name,
                "order_number": order.order_number,
                "total": str(order.total),
                "items": [
                    {"title": i.title, "qty": i.quantity, "price": str(i.unit_price)}
                    for i in order.items
                ],
            }
        )

    async def order_shipped(self, user, order):
        await self.send_email(
            to_email=user.email,
            template_id="order_shipped",
            props={
                "first_name": user.first_name,
                "order_number": order.order_number,
                "tracking_number": order.tracking_number,
                "tracking_url": order.tracking_url,
                "carrier": order.shipping_carrier,
            }
        )

    async def send_review_request(self, user, order):
        await self.send_email(
            to_email=user.email,
            template_id="review_request",
            props={
                "first_name": user.first_name,
                "order_number": order.order_number,
                "items": [
                    {"title": i.title, "product_id": str(i.product_id)}
                    for i in order.items
                ],
            }
        )
```

---

## 14. Celery Tasks (`app/tasks/`)

### 14.1 Celery App (`app/tasks/celery_app.py`)

```python
from celery import Celery
from app.config import settings

celery_app = Celery(
    "hero_plant_store",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
    include=[
        "app.tasks.order_tasks",
        "app.tasks.email_tasks",
        "app.tasks.analytics_tasks",
        "app.tasks.cleanup_tasks",
    ]
)

celery_app.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    timezone="Asia/Kolkata",
    enable_utc=True,
    task_soft_time_limit=300,   # 5 min soft limit
    task_time_limit=600,        # 10 min hard limit
    worker_prefetch_multiplier=1,
    task_acks_late=True,
)

# Beat schedule (periodic tasks)
celery_app.conf.beat_schedule = {
    "aggregate-analytics-daily": {
        "task": "app.tasks.analytics_tasks.aggregate_daily_metrics",
        "schedule": 3600.0,     # every hour
    },
    "update-discount-statuses": {
        "task": "app.tasks.cleanup_tasks.update_discount_statuses",
        "schedule": 300.0,      # every 5 min
    },
    "expire-old-carts": {
        "task": "app.tasks.cleanup_tasks.expire_old_carts",
        "schedule": 86400.0,    # daily
    },
    "expire-verification-tokens": {
        "task": "app.tasks.cleanup_tasks.expire_verification_tokens",
        "schedule": 3600.0,
    },
    "send-watering-reminders": {
        "task": "app.tasks.email_tasks.send_watering_reminders",
        "schedule": 86400.0,    # daily 08:00 IST
    },
    "send-review-requests": {
        "task": "app.tasks.email_tasks.send_review_requests",
        "schedule": 86400.0,    # daily
    },
}
```

### 14.2 Order Tasks (`app/tasks/order_tasks.py`)

```python
from app.tasks.celery_app import celery_app
from app.database import SessionLocal
from app.models.order import Order, OrderStatusHistory
from app.models.inventory import Inventory
from app.services.loyalty_service import LoyaltyService
from app.services.notification_service import NotificationService
import asyncio

@celery_app.task(bind=True, max_retries=3, default_retry_delay=60)
def post_payment_tasks(self, order_id: int):
    """Run after payment confirmed: deduct inventory, award loyalty, send email."""
    db = SessionLocal()
    try:
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            return

        # 1. Deduct reserved inventory → actual stock
        for item in order.items:
            inv = db.query(Inventory).filter(
                Inventory.variant_id == item.variant_id
            ).with_for_update().first()
            inv.reserved = max(0, inv.reserved - item.quantity)
            inv.quantity = max(0, inv.quantity - item.quantity)

        # 2. Award loyalty points
        if order.user_id:
            LoyaltyService(db).earn_points(order.user_id, order)

        # 3. Update discount usage count
        if order.discount_id:
            from app.models.discount import Discount, DiscountUsage
            disc = db.query(Discount).filter(Discount.id == order.discount_id).first()
            if disc:
                disc.usage_count += 1
                db.add(DiscountUsage(
                    discount_id=order.discount_id,
                    order_id=order.id,
                    user_id=order.user_id,
                    discount_amount=order.discount_amount,
                ))

        db.commit()

        # 4. Send confirmation email
        notif = NotificationService()
        asyncio.run(notif.order_confirmed(order.user, order))

    except Exception as exc:
        db.rollback()
        raise self.retry(exc=exc)
    finally:
        db.close()


@celery_app.task(bind=True, max_retries=3)
def deduct_inventory_on_fulfillment(self, order_id: int):
    db = SessionLocal()
    try:
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            return
        for item in order.items:
            inv = db.query(Inventory).filter(
                Inventory.variant_id == item.variant_id
            ).with_for_update().first()
            if inv:
                inv.reserved = max(0, inv.reserved - item.quantity)
        db.commit()
    except Exception as exc:
        db.rollback()
        raise self.retry(exc=exc)
    finally:
        db.close()


@celery_app.task
def release_inventory_on_cancel(order_id: int):
    db = SessionLocal()
    try:
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            return
        for item in order.items:
            inv = db.query(Inventory).filter(
                Inventory.variant_id == item.variant_id
            ).with_for_update().first()
            if inv:
                inv.reserved = max(0, inv.reserved - item.quantity)
        db.commit()
    finally:
        db.close()


@celery_app.task
def send_fulfillment_notification(order_id: int):
    db = SessionLocal()
    try:
        order = db.query(Order).filter(Order.id == order_id).first()
        if order and order.user_id:
            notif = NotificationService()
            asyncio.run(notif.order_shipped(order.user, order))
    finally:
        db.close()
```

### 14.3 Analytics Tasks (`app/tasks/analytics_tasks.py`)

```python
from app.tasks.celery_app import celery_app
from app.database import SessionLocal
from app.models.order import Order
from app.models.user import User
from app.models.analytics import AnalyticsDaily
from sqlalchemy import func
from datetime import date, timedelta

@celery_app.task
def aggregate_daily_metrics():
    """Pre-aggregate key metrics for the analytics dashboard."""
    db = SessionLocal()
    try:
        today = date.today()
        yesterday = today - timedelta(days=1)

        # Revenue
        revenue = db.query(func.sum(Order.total)).filter(
            func.date(Order.created_at) == yesterday,
            Order.payment_status == "paid"
        ).scalar() or 0

        _upsert_metric(db, yesterday, "revenue", float(revenue))

        # Orders
        orders = db.query(func.count(Order.id)).filter(
            func.date(Order.created_at) == yesterday
        ).scalar() or 0
        _upsert_metric(db, yesterday, "orders", float(orders))

        # New customers
        new_customers = db.query(func.count(User.id)).filter(
            func.date(User.created_at) == yesterday
        ).scalar() or 0
        _upsert_metric(db, yesterday, "new_customers", float(new_customers))

        # AOV
        aov = revenue / orders if orders > 0 else 0
        _upsert_metric(db, yesterday, "aov", float(aov))

        db.commit()
    finally:
        db.close()


def _upsert_metric(db, date_val, metric: str, value: float, dimension: str = None):
    from sqlalchemy.dialects.mysql import insert
    stmt = insert(AnalyticsDaily).values(
        date=date_val,
        metric=metric,
        value=value,
        dimension=dimension,
    ).on_duplicate_key_update(value=value)
    db.execute(stmt)


### 14.4 Email Tasks (`app/tasks/email_tasks.py`)

@celery_app.task
def send_verification_email(user_id: int, email: str, name: str, token: str):
    notif = NotificationService()
    import asyncio
    asyncio.run(notif.send_email(
        to_email=email,
        template_id="email_verification",
        props={"first_name": name, "verification_token": token}
    ))

@celery_app.task
def send_password_reset_email(user_id: int, email: str, name: str, token: str):
    notif = NotificationService()
    import asyncio
    asyncio.run(notif.send_email(
        to_email=email,
        template_id="password_reset",
        props={"first_name": name, "reset_token": token}
    ))

@celery_app.task
def send_watering_reminders():
    """Daily task: find plants due for watering and notify owners."""
    from app.models.plant import UserPlant
    db = SessionLocal()
    try:
        today = date.today()
        plants = db.query(UserPlant).filter(
            UserPlant.next_water_due == today
        ).all()
        notif = NotificationService()
        for plant in plants:
            if plant.user:
                asyncio.run(notif.send_email(
                    to_email=plant.user.email,
                    template_id="watering_reminder",
                    props={
                        "first_name": plant.user.first_name,
                        "plant_name": plant.nickname or plant.plant_name,
                    }
                ))
    finally:
        db.close()

@celery_app.task
def send_review_requests():
    """7 days after delivery, request a review."""
    from datetime import datetime, timedelta, timezone
    db = SessionLocal()
    try:
        cutoff = datetime.now(timezone.utc) - timedelta(days=7)
        orders = db.query(Order).filter(
            Order.status == "delivered",
            Order.delivered_at <= cutoff,
            Order.delivered_at >= cutoff - timedelta(days=1),
        ).all()
        notif = NotificationService()
        for order in orders:
            if order.user_id:
                asyncio.run(notif.send_review_request(order.user, order))
    finally:
        db.close()
```


---

## 15. Redis Caching (`app/utils/cache.py`)

```python
import json
import hashlib
from functools import wraps
from typing import Callable, Any, Optional
import redis.asyncio as aioredis
from app.config import settings

_redis: Optional[aioredis.Redis] = None

async def get_redis() -> aioredis.Redis:
    global _redis
    if _redis is None:
        _redis = await aioredis.from_url(
            settings.REDIS_URL,
            encoding="utf-8",
            decode_responses=True
        )
    return _redis


async def cache_get(key: str) -> Optional[Any]:
    r = await get_redis()
    value = await r.get(key)
    return json.loads(value) if value else None


async def cache_set(key: str, value: Any, ttl: int = 300) -> None:
    r = await get_redis()
    await r.setex(key, ttl, json.dumps(value, default=str))


async def cache_delete(key: str) -> None:
    r = await get_redis()
    await r.delete(key)


async def cache_delete_pattern(pattern: str) -> None:
    r = await get_redis()
    keys = await r.keys(pattern)
    if keys:
        await r.delete(*keys)


def cache_response(ttl: int = 300, key_prefix: str = "cache"):
    """Decorator for caching FastAPI route responses."""
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Build cache key from prefix + kwargs
            key_data = json.dumps(kwargs, sort_keys=True, default=str)
            key_hash = hashlib.md5(key_data.encode()).hexdigest()
            cache_key = f"{key_prefix}:{key_hash}"

            cached = await cache_get(cache_key)
            if cached is not None:
                return cached

            result = await func(*args, **kwargs)
            await cache_set(cache_key, result, ttl)
            return result
        return wrapper
    return decorator
```

---

## 16. File Storage (`app/utils/storage.py`)

```python
import boto3
import uuid
from fastapi import UploadFile
from app.config import settings

s3_client = boto3.client(
    "s3",
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    region_name=settings.AWS_S3_REGION,
)

ALLOWED_IMAGE_TYPES = {
    "image/jpeg", "image/png", "image/webp", "image/heic"
}
MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB

async def upload_file(file: UploadFile, folder: str) -> str:
    """Upload file to S3/R2 and return CDN URL."""
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise ValueError(f"Unsupported file type: {file.content_type}")

    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE_BYTES:
        raise ValueError("File exceeds 10MB limit.")

    ext = file.filename.rsplit(".", 1)[-1].lower()
    key = f"{folder}/{uuid.uuid4()}.{ext}"

    s3_client.put_object(
        Bucket=settings.AWS_S3_BUCKET,
        Key=key,
        Body=contents,
        ContentType=file.content_type,
        CacheControl="max-age=31536000",  # 1 year CDN cache
    )

    return f"{settings.CDN_BASE_URL}/{key}"


def delete_file(url: str) -> None:
    """Delete file from S3 given its CDN URL."""
    key = url.replace(f"{settings.CDN_BASE_URL}/", "")
    s3_client.delete_object(Bucket=settings.AWS_S3_BUCKET, Key=key)
```

---

## 17. Webhooks

### 17.1 Razorpay Webhook (`app/api/v1/webhooks/razorpay.py`)

```python
from fastapi import APIRouter, Request, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
import hmac, hashlib, json
from app.database import get_db
from app.config import settings
from app.models.order import Order, OrderStatusHistory
from fastapi import Depends

router = APIRouter(prefix="/webhooks/razorpay", tags=["Webhooks"])

@router.post("/")
async def razorpay_webhook(
    request: Request,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    body = await request.body()
    signature = request.headers.get("X-Razorpay-Signature", "")

    # Verify webhook signature
    expected = hmac.new(
        settings.RAZORPAY_WEBHOOK_SECRET.encode(),
        body,
        hashlib.sha256
    ).hexdigest()

    if not hmac.compare_digest(expected, signature):
        raise HTTPException(status_code=400, detail="Invalid webhook signature.")

    payload = json.loads(body)
    event = payload.get("event")

    if event == "payment.captured":
        payment = payload["payload"]["payment"]["entity"]
        order_id = payment.get("order_id")

        order = db.query(Order).filter(
            Order.razorpay_order_id == order_id
        ).first()

        if order and order.payment_status != "paid":
            order.payment_status = "paid"
            order.status = "payment_confirmed"
            order.razorpay_payment_id = payment["id"]
            db.add(OrderStatusHistory(
                order_id=order.id,
                status="payment_confirmed",
                description="Payment captured via Razorpay webhook"
            ))
            db.commit()

            from app.tasks.order_tasks import post_payment_tasks
            background_tasks.add_task(post_payment_tasks.delay, order.id)

    elif event == "refund.created":
        refund_data = payload["payload"]["refund"]["entity"]
        order = db.query(Order).filter(
            Order.razorpay_payment_id == refund_data.get("payment_id")
        ).first()
        if order:
            from app.models.order import Refund
            refund = db.query(Refund).filter(
                Refund.order_id == order.id,
                Refund.status == "pending"
            ).first()
            if refund:
                refund.status = "processed"
                refund.gateway_refund_id = refund_data["id"]
                db.commit()

    return {"status": "ok"}
```

### 17.2 Shiprocket Webhook (`app/api/v1/webhooks/shiprocket.py`)

```python
from fastapi import APIRouter, Request, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.order import Order, OrderStatusHistory

router = APIRouter(prefix="/webhooks/shiprocket", tags=["Webhooks"])

STATUS_MAP = {
    "PICKUP PENDING": "processing",
    "PICKUP SCHEDULED": "processing",
    "PICKED UP": "dispatched",
    "IN TRANSIT": "in_transit",
    "OUT FOR DELIVERY": "out_for_delivery",
    "DELIVERED": "delivered",
    "DELIVERY FAILED": "delivery_attempted",
    "UNDELIVERED": "delivery_attempted",
    "RTO INITIATED": "return_in_transit",
    "RTO DELIVERED": "return_received",
}

@router.post("/")
async def shiprocket_webhook(
    request: Request,
    db: Session = Depends(get_db),
):
    payload = await request.json()
    awb = payload.get("awb")
    sr_status = payload.get("current_status", "")
    location = payload.get("location", "")

    if not awb:
        return {"status": "ignored"}

    order = db.query(Order).filter(Order.awb_code == awb).first()
    if not order:
        return {"status": "not_found"}

    new_status = STATUS_MAP.get(sr_status.upper())
    if new_status and order.status != new_status:
        order.status = new_status
        if new_status == "delivered":
            from datetime import datetime, timezone
            order.delivered_at = datetime.now(timezone.utc)

        db.add(OrderStatusHistory(
            order_id=order.id,
            status=new_status,
            location=location,
            description=f"Shiprocket: {sr_status}",
        ))
        db.commit()

    return {"status": "ok"}
```

---

## 18. Pagination Utility (`app/utils/pagination.py`)

```python
from typing import TypeVar, Generic, List, Type
from pydantic import BaseModel
from sqlalchemy.orm import Query

T = TypeVar("T")

class PaginatedResponse(BaseModel, Generic[T]):
    items: List[T]
    total: int
    page: int
    page_size: int
    pages: int
    has_next: bool
    has_prev: bool

def paginate(query: Query, page: int, page_size: int):
    total = query.count()
    items = query.offset((page - 1) * page_size).limit(page_size).all()
    pages = (total + page_size - 1) // page_size
    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
        "pages": pages,
        "has_next": page < pages,
        "has_prev": page > 1,
    }
```

---

## 19. Admin Analytics API (`app/api/v1/admin/analytics.py`)

```python
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from datetime import date, timedelta
from typing import Optional

from app.database import get_db
from app.dependencies import require_analyst
from app.models.order import Order, OrderItem
from app.models.user import User
from app.models.analytics import AnalyticsDaily
from app.models.product import Product

router = APIRouter(prefix="/admin/analytics", tags=["Admin - Analytics"])


@router.get("/overview")
async def get_overview(
    db: Session = Depends(get_db),
    admin = Depends(require_analyst),
    date_from: Optional[date] = None,
    date_to: Optional[date] = None,
):
    if not date_from:
        date_from = date.today() - timedelta(days=30)
    if not date_to:
        date_to = date.today()

    # Revenue
    revenue = db.query(func.sum(Order.total)).filter(
        Order.payment_status == "paid",
        func.date(Order.created_at).between(date_from, date_to)
    ).scalar() or 0

    # Orders
    orders = db.query(func.count(Order.id)).filter(
        func.date(Order.created_at).between(date_from, date_to)
    ).scalar() or 0

    # New customers
    new_customers = db.query(func.count(User.id)).filter(
        func.date(User.created_at).between(date_from, date_to)
    ).scalar() or 0

    # AOV
    aov = float(revenue) / orders if orders > 0 else 0

    # Units sold
    units = db.query(func.sum(OrderItem.quantity)).join(Order).filter(
        Order.payment_status == "paid",
        func.date(Order.created_at).between(date_from, date_to)
    ).scalar() or 0

    # Return rate
    cancelled = db.query(func.count(Order.id)).filter(
        Order.status.in_(["cancelled", "return_received"]),
        func.date(Order.created_at).between(date_from, date_to)
    ).scalar() or 0
    return_rate = (cancelled / orders * 100) if orders > 0 else 0

    return {
        "period": {"from": str(date_from), "to": str(date_to)},
        "revenue": float(revenue),
        "orders": orders,
        "new_customers": new_customers,
        "aov": round(aov, 2),
        "units_sold": int(units),
        "return_rate": round(return_rate, 2),
    }


@router.get("/revenue/chart")
async def get_revenue_chart(
    db: Session = Depends(get_db),
    admin = Depends(require_analyst),
    date_from: Optional[date] = None,
    date_to: Optional[date] = None,
    granularity: str = Query(default="daily", enum=["daily", "weekly", "monthly"]),
):
    if not date_from:
        date_from = date.today() - timedelta(days=30)
    if not date_to:
        date_to = date.today()

    # Query pre-aggregated data from analytics_daily
    records = db.query(AnalyticsDaily).filter(
        AnalyticsDaily.date.between(date_from, date_to),
        AnalyticsDaily.metric == "revenue",
    ).order_by(AnalyticsDaily.date).all()

    return {
        "data": [
            {"date": str(r.date), "value": float(r.value)}
            for r in records
        ]
    }


@router.get("/products/top")
async def get_top_products(
    db: Session = Depends(get_db),
    admin = Depends(require_analyst),
    date_from: Optional[date] = None,
    date_to: Optional[date] = None,
    limit: int = Query(default=25, ge=1, le=100),
):
    if not date_from:
        date_from = date.today() - timedelta(days=30)
    if not date_to:
        date_to = date.today()

    results = db.query(
        OrderItem.product_id,
        OrderItem.title,
        func.sum(OrderItem.total_price).label("revenue"),
        func.sum(OrderItem.quantity).label("units"),
    ).join(Order).filter(
        Order.payment_status == "paid",
        func.date(Order.created_at).between(date_from, date_to)
    ).group_by(
        OrderItem.product_id, OrderItem.title
    ).order_by(
        func.sum(OrderItem.total_price).desc()
    ).limit(limit).all()

    return {
        "data": [
            {
                "product_id": r.product_id,
                "title": r.title,
                "revenue": float(r.revenue),
                "units": int(r.units),
            }
            for r in results
        ]
    }


@router.get("/customers/overview")
async def get_customer_overview(
    db: Session = Depends(get_db),
    admin = Depends(require_analyst),
    date_from: Optional[date] = None,
    date_to: Optional[date] = None,
):
    if not date_from:
        date_from = date.today() - timedelta(days=30)
    if not date_to:
        date_to = date.today()

    total = db.query(func.count(User.id)).filter(
        User.deleted_at == None
    ).scalar()

    new_in_period = db.query(func.count(User.id)).filter(
        func.date(User.created_at).between(date_from, date_to)
    ).scalar()

    # At-risk: no order in 90 days
    ninety_days_ago = date.today() - timedelta(days=90)
    at_risk = db.query(func.count(User.id)).filter(
        ~User.id.in_(
            db.query(Order.user_id).filter(
                Order.created_at >= ninety_days_ago
            )
        )
    ).scalar()

    return {
        "total_customers": total,
        "new_in_period": new_in_period,
        "at_risk_customers": at_risk,
    }
```

---

## 20. Docker Configuration

### 20.1 `Dockerfile`

```dockerfile
FROM python:3.12-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    default-libmysqlclient-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Run Alembic migrations then start server
CMD ["sh", "-c", "alembic upgrade head && gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000"]
```

### 20.2 `docker-compose.yml`

```yaml
version: "3.9"

services:
  api:
    build: .
    ports:
      - "8000:8000"
    env_file: .env
    depends_on:
      mysql:
        condition: service_healthy
      redis:
        condition: service_started
    volumes:
      - .:/app
    restart: unless-stopped

  celery-worker:
    build: .
    command: celery -A app.tasks.celery_app worker --loglevel=info --concurrency=4
    env_file: .env
    depends_on:
      - mysql
      - redis
    restart: unless-stopped

  celery-beat:
    build: .
    command: celery -A app.tasks.celery_app beat --loglevel=info
    env_file: .env
    depends_on:
      - mysql
      - redis
    restart: unless-stopped

  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: hero_plant_store
      MYSQL_USER: ${MYSQL_USER}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
    volumes:
      - mysql_data:/var/lib/mysql
      - ./migrations/init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "3306:3306"
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl
    depends_on:
      - api
    restart: unless-stopped

volumes:
  mysql_data:
  redis_data:
```

### 20.3 `requirements.txt`

```
fastapi==0.115.5
uvicorn[standard]==0.32.1
gunicorn==23.0.0
sqlalchemy==2.0.36
alembic==1.14.0
pymysql==1.1.1
cryptography==43.0.3
pydantic==2.9.2
pydantic-settings==2.6.1
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.17
celery==5.4.0
redis==5.2.0
razorpay==1.4.2
httpx==0.27.2
openai==1.55.0
boto3==1.35.74
structlog==24.4.0
prometheus-fastapi-instrumentator==7.0.0
```

---

## 21. Alembic Migration Setup

### `migrations/env.py` (partial)

```python
from alembic import context
from sqlalchemy import engine_from_config, pool
from app.database import Base
from app.config import settings

# Import all models so Alembic detects them
import app.models.user
import app.models.admin
import app.models.product
import app.models.order
import app.models.cart
import app.models.review
import app.models.discount
import app.models.loyalty
import app.models.garden_service
import app.models.ai_care
import app.models.analytics

target_metadata = Base.metadata

def run_migrations_online():
    configuration = context.config
    configuration.set_main_option("sqlalchemy.url", settings.DATABASE_URL)
    connectable = engine_from_config(
        configuration.get_section(configuration.config_ini_section),
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
```

**Common commands:**

```bash
# Create a new migration
alembic revision --autogenerate -m "add_garden_bookings_table"

# Apply all pending migrations
alembic upgrade head

# Rollback one migration
alembic downgrade -1

# Show current revision
alembic current
```

---

## 22. API Route Summary

### Storefront Routes (`/api/v1/`)

| Method | Path | Description |
|---|---|---|
| **AUTH** | | |
| POST | `/auth/register` | Customer registration |
| POST | `/auth/login` | Login → access + refresh tokens |
| POST | `/auth/refresh` | Rotate refresh token |
| POST | `/auth/logout` | Revoke refresh token |
| POST | `/auth/forgot-password` | Send reset email |
| POST | `/auth/reset-password` | Reset with token |
| POST | `/auth/verify-email/{token}` | Email verification |
| **PRODUCTS** | | |
| GET | `/products/` | List / search products (filters, pagination) |
| GET | `/products/{slug}` | Product detail |
| GET | `/products/{slug}/reviews` | Product reviews |
| GET | `/categories/` | Category tree |
| GET | `/collections/` | Collections list |
| GET | `/collections/{slug}` | Collection products |
| GET | `/search/` | Full-text product search |
| **CART** | | |
| GET | `/cart/` | Get cart |
| POST | `/cart/items/` | Add item to cart |
| PATCH | `/cart/items/{item_id}` | Update item quantity |
| DELETE | `/cart/items/{item_id}` | Remove item |
| POST | `/cart/apply-discount` | Apply discount code |
| DELETE | `/cart/remove-discount` | Remove discount |
| **ORDERS** | | |
| POST | `/orders/` | Create order + Razorpay order |
| POST | `/orders/{uuid}/verify-payment` | Verify Razorpay payment |
| GET | `/orders/` | My orders |
| GET | `/orders/{uuid}` | Order detail |
| POST | `/orders/{uuid}/cancel` | Cancel order |
| POST | `/orders/{uuid}/return` | Request return |
| **CUSTOMERS** | | |
| GET | `/customers/me` | My profile |
| PATCH | `/customers/me` | Update profile |
| GET | `/customers/me/addresses` | My addresses |
| POST | `/customers/me/addresses` | Add address |
| PATCH | `/customers/me/addresses/{id}` | Update address |
| DELETE | `/customers/me/addresses/{id}` | Delete address |
| GET | `/customers/me/loyalty` | Loyalty balance + tier |
| GET | `/customers/me/wishlist` | Wishlist |
| POST | `/customers/me/wishlist/{product_id}` | Add to wishlist |
| DELETE | `/customers/me/wishlist/{product_id}` | Remove from wishlist |
| GET | `/customers/me/plants` | My plants |
| POST | `/customers/me/plants` | Add plant |
| PATCH | `/customers/me/plants/{id}` | Update plant |
| POST | `/customers/me/plants/{id}/log` | Add care log |
| **REVIEWS** | | |
| POST | `/reviews/` | Submit review |
| POST | `/reviews/{id}/helpful` | Mark helpful/not-helpful |
| POST | `/reviews/{id}/flag` | Flag review |
| **AI CARE** | | |
| POST | `/ai-care/chat` | Send message / photo |
| POST | `/ai-care/sessions/{uuid}/rate` | Rate session |
| **GARDEN SERVICES** | | |
| GET | `/garden-services/types` | Service types |
| POST | `/garden-services/bookings` | Create booking |
| GET | `/garden-services/bookings/{uuid}` | Booking detail |

### Admin Routes (`/api/v1/admin/`)

| Method | Path | Roles |
|---|---|---|
| **AUTH** | | |
| POST | `/admin/auth/login` | All |
| POST | `/admin/auth/refresh` | All |
| **PRODUCTS** | | |
| GET | `/admin/products/` | All |
| POST | `/admin/products/` | Ops, Super |
| GET | `/admin/products/{id}` | All |
| PUT | `/admin/products/{id}` | Ops, Super, Inventory |
| DELETE | `/admin/products/{id}` | Super |
| POST | `/admin/products/{id}/images` | Ops, Super |
| DELETE | `/admin/products/{id}/images/{img_id}` | Ops, Super |
| **ORDERS** | | |
| GET | `/admin/orders/` | Support, Ops, Super |
| GET | `/admin/orders/{uuid}` | Support, Ops, Super |
| POST | `/admin/orders/{uuid}/fulfill` | Ops, Super |
| POST | `/admin/orders/{uuid}/cancel` | Ops, Super |
| POST | `/admin/orders/{uuid}/refund` | Ops, Super |
| POST | `/admin/orders/{uuid}/notes` | Support, Ops, Super |
| **CUSTOMERS** | | |
| GET | `/admin/customers/` | Support, Ops, Super, Marketing |
| GET | `/admin/customers/{uuid}` | Support, Ops, Super |
| PATCH | `/admin/customers/{uuid}` | Support, Ops, Super |
| POST | `/admin/customers/{uuid}/block` | Ops, Super |
| DELETE | `/admin/customers/{uuid}` | Super |
| POST | `/admin/customers/{uuid}/points` | Support, Ops, Super |
| POST | `/admin/customers/{uuid}/tier` | Ops, Super |
| **INVENTORY** | | |
| GET | `/admin/inventory/` | Ops, Super, Inventory |
| PATCH | `/admin/inventory/{variant_id}` | Ops, Super, Inventory |
| POST | `/admin/inventory/{variant_id}/adjust` | Ops, Super, Inventory |
| **DISCOUNTS** | | |
| GET | `/admin/discounts/` | All |
| POST | `/admin/discounts/` | Ops, Super, Marketing |
| PUT | `/admin/discounts/{uuid}` | Ops, Super, Marketing |
| DELETE | `/admin/discounts/{uuid}` | Ops, Super |
| POST | `/admin/discounts/{uuid}/activate` | Ops, Super, Marketing |
| POST | `/admin/discounts/{uuid}/deactivate` | Ops, Super, Marketing |
| **REVIEWS** | | |
| GET | `/admin/reviews/` | Support, Ops, Super, Marketing |
| POST | `/admin/reviews/{uuid}/approve` | Support, Ops, Super |
| POST | `/admin/reviews/{uuid}/reject` | Support, Ops, Super |
| POST | `/admin/reviews/{uuid}/reply` | Support, Ops, Super, Marketing |
| DELETE | `/admin/reviews/{uuid}` | Ops, Super |
| **ANALYTICS** | | |
| GET | `/admin/analytics/overview` | Analyst, Marketing, Ops, Super |
| GET | `/admin/analytics/revenue/chart` | Analyst, Ops, Super |
| GET | `/admin/analytics/products/top` | Analyst, Ops, Super |
| GET | `/admin/analytics/customers/overview` | Analyst, Marketing, Ops, Super |
| GET | `/admin/analytics/export` | Analyst, Ops, Super |
| **AI CARE** | | |
| GET | `/admin/ai-care/metrics` | Analyst, Ops, Super |
| GET | `/admin/ai-care/queries` | Ops, Super |
| POST | `/admin/ai-care/queries/{id}/flag` | Ops, Super |
| PUT | `/admin/ai-care/settings` | Ops, Super |
| **GARDEN SERVICES** | | |
| GET | `/admin/garden-services/bookings` | Garden, Ops, Super |
| PATCH | `/admin/garden-services/bookings/{uuid}` | Garden, Ops, Super |
| GET | `/admin/garden-services/gardeners` | Garden, Ops, Super |
| **STAFF** | | |
| GET | `/admin/staff/` | Super |
| POST | `/admin/staff/` | Super |
| PATCH | `/admin/staff/{uuid}` | Super |
| DELETE | `/admin/staff/{uuid}` | Super |
| **WEBHOOKS** | | |
| POST | `/webhooks/razorpay` | System |
| POST | `/webhooks/shiprocket` | System |


---

## 23. Environment Variables (`.env.example`)

```env
# ── Application ─────────────────────────────────────────────────────
ENVIRONMENT=development
SECRET_KEY=your-256-bit-random-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
REFRESH_TOKEN_EXPIRE_DAYS=30

# ── Database ─────────────────────────────────────────────────────────
DATABASE_URL=mysql+pymysql://hero_user:hero_password@localhost:3306/hero_plant_store
DATABASE_POOL_SIZE=10
DATABASE_MAX_OVERFLOW=20
DATABASE_POOL_TIMEOUT=30

# MySQL (for docker-compose)
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_USER=hero_user
MYSQL_PASSWORD=hero_password

# ── Redis ────────────────────────────────────────────────────────────
REDIS_URL=redis://localhost:6379/0
CACHE_TTL_SECONDS=300

# ── Storage ──────────────────────────────────────────────────────────
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=hero-plant-store-media
AWS_S3_REGION=ap-south-1
CDN_BASE_URL=https://cdn.heroplants.com

# ── Payment ──────────────────────────────────────────────────────────
RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXX
RAZORPAY_KEY_SECRET=your-razorpay-secret
RAZORPAY_WEBHOOK_SECRET=your-webhook-secret

# ── Shipping ─────────────────────────────────────────────────────────
SHIPROCKET_EMAIL=ops@heroplants.com
SHIPROCKET_PASSWORD=your-shiprocket-password

# ── AI ──────────────────────────────────────────────────────────────
OPENAI_API_KEY=sk-your-openai-key
OPENAI_MODEL=gpt-4o
GOOGLE_VISION_API_KEY=your-google-vision-key

# ── Notifications ────────────────────────────────────────────────────
KLAVIYO_API_KEY=pk_your-klaviyo-key
MSG91_AUTH_KEY=your-msg91-key
MSG91_SENDER_ID=HEROPL

# ── CORS ────────────────────────────────────────────────────────────
ALLOWED_ORIGINS=["http://localhost:3000","https://heroplants.com"]
```

---

## 24. Security Architecture

### 24.1 Authentication Flow

```
┌──────────────────────────────────────────────────────────────────────┐
│                    AUTH FLOW — STOREFRONT                            │
│                                                                      │
│  Login                                                               │
│  ┌────────┐   POST /auth/login   ┌─────────┐                       │
│  │ Client │──────────────────────▶│  API    │                       │
│  └────────┘                       └────┬────┘                       │
│                                        │ Verify password             │
│                                        │ Create access_token (JWT)  │
│                                        │ Create refresh_token        │
│                                        │ Store hash in DB            │
│  ┌────────┐   access_token (body) ┌────▼────┐                       │
│  │ Client │◀──────────────────────│  API    │                       │
│  │        │   refresh_token       └─────────┘                       │
│  │        │   (HttpOnly cookie)                                      │
│  └────────┘                                                          │
│                                                                      │
│  Authenticated Request                                               │
│  ┌────────┐  Authorization: Bearer <access_token>  ┌─────────┐      │
│  │ Client │────────────────────────────────────────▶│  API    │      │
│  └────────┘                                          └─────────┘      │
│                                                                      │
│  Token Rotation (access expires after 60 min)                        │
│  ┌────────┐  POST /auth/refresh (cookie: refresh)  ┌─────────┐      │
│  │ Client │────────────────────────────────────────▶│  API    │      │
│  └────────┘◀───────────────────────────────────────│         │      │
│             new access_token + new refresh_token    └─────────┘      │
└──────────────────────────────────────────────────────────────────────┘
```

### 24.2 Security Rules

| Rule | Implementation |
|---|---|
| Passwords | Bcrypt with cost factor 12 |
| JWT signing | HS256 with 256-bit secret |
| Refresh tokens | Stored as SHA-256 hash only (never raw) |
| HttpOnly cookie | Refresh token in `Secure; HttpOnly; SameSite=Lax` cookie |
| HTTPS | Enforced via Nginx TLS termination |
| CORS | Strict origin allowlist |
| SQL injection | SQLAlchemy ORM — no raw string interpolation |
| Rate limiting | Nginx rate limit on auth endpoints (5 req/min per IP) |
| Admin MFA | TOTP (Google Authenticator) — optional per admin |
| PCI-DSS | No raw card data stored — Razorpay tokenisation only |
| GDPR/DPDPA | Soft delete for users, data export endpoint, retention policy |
| XSS | Rich text sanitised before save; CSP headers via Nginx |
| Webhook security | HMAC-SHA256 signature verification on all webhooks |
| Inventory race condition | `SELECT ... FOR UPDATE` lock before reservation |
| File upload | Type + size validation before S3 upload |

---

## 25. Performance Architecture

### 25.1 Caching Strategy

| Data | Cache Key | TTL | Invalidation |
|---|---|---|---|
| Product list | `products:list:{hash}` | 120s | On product update/create |
| Product detail | `products:detail:{slug}` | 60s | On product update |
| Category tree | `categories:tree` | 3600s | On category update |
| Collection | `collections:{slug}` | 300s | On product/collection update |
| User cart | Not cached — always fresh | — | — |
| Analytics overview | `analytics:overview:{date}` | 300s | On Celery aggregation |
| Search results | `search:{q}:{filters_hash}` | 60s | Time-based only |

### 25.2 Database Indexing Strategy

```sql
-- High-frequency queries and their indexes:

-- Product listing with filters
-- Index: (status, category_id, base_price, product_type)
-- Covered by: idx_status, idx_category_id, FULLTEXT idx_ft_search

-- Order history for a customer
-- Index: (user_id, created_at DESC) — composite
ALTER TABLE orders ADD INDEX idx_user_created (user_id, created_at DESC);

-- Discount code lookup at checkout
-- Index: (code, status) — covered by idx_code + idx_status

-- Inventory check by variant
-- Covered by idx_variant_id (unique)

-- Analytics daily aggregation
ALTER TABLE analytics_daily ADD INDEX idx_date_metric (date, metric);

-- Review listing for a product
ALTER TABLE reviews ADD INDEX idx_product_status_date (product_id, status, created_at DESC);

-- AI Care session by user
ALTER TABLE ai_care_sessions ADD INDEX idx_user_created (user_id, created_at DESC);
```

### 25.3 Connection Pooling

```python
# SQLAlchemy pool configuration for production
engine = create_engine(
    settings.DATABASE_URL,
    pool_size=10,          # 10 persistent connections per worker
    max_overflow=20,       # up to 20 extra connections under load
    pool_timeout=30,       # wait max 30s for a connection
    pool_pre_ping=True,    # test connection before use
    pool_recycle=3600,     # recycle connections every hour
    # With 4 Gunicorn workers: max 4 × (10 + 20) = 120 connections
    # MySQL max_connections should be > 130
)
```

---

## 26. Database Design Decisions & Rationale

| Decision | Rationale |
|---|---|
| **MySQL 8.0 over PostgreSQL** | Better compatibility with Shopify's MySQL-native tooling; team familiarity; `utf8mb4` for full emoji/Unicode support; JSON column type sufficient for our use case |
| **FULLTEXT index on products** | Enables fast full-text search without Elasticsearch for an MVP; upgrade path to Meilisearch later |
| **Soft delete on users** | GDPR compliance + order history integrity — `deleted_at` column, never hard delete |
| **Append-only activity_log** | Immutable audit trail — no DELETE, no UPDATE on this table |
| **Denormalised rating columns on products** | Avoids COUNT/AVG query on reviews table per product page load; updated by Celery after each moderation |
| **Refresh token as SHA-256 hash** | Raw token never stored — prevents DB breach exposing active sessions |
| **`order_items` price snapshots** | Product prices change over time; order line items must reflect the price at purchase |
| **Inventory `reserved` column** | Two-phase commit pattern — reserve on order placement, deduct on payment confirmation; prevents overselling |
| **`analytics_daily` pre-aggregation** | Analytics queries on raw orders table would be expensive at scale; pre-aggregate nightly via Celery |
| **UUIDs as public identifiers** | `id` (BIGINT) is internal; `uuid` (CHAR 36) is used in API responses and URLs to prevent ID enumeration attacks |
| **JSON column for AI Care product suggestions** | Semi-structured, low-volume data; not queried relationally |
| **Separate `admin_users` table** | Admin and customer auth are completely separate; different roles, different JWT secrets possible |
| **`FOR UPDATE` lock on inventory reservation** | Prevents race condition where two concurrent orders both reserve the last unit |
| **Celery for post-payment tasks** | Payment API response must be fast (<2s); inventory deduction, loyalty points, and emails are background tasks |

---

## 27. Final Architecture Summary

```
Hero Plant Store — Backend Architecture v1.0
═══════════════════════════════════════════════════════════════════════
STACK
  Language:     Python 3.12+
  Framework:    FastAPI 0.115.x (async)
  ORM:          SQLAlchemy 2.0 + Alembic
  Database:     MySQL 8.0 (utf8mb4_unicode_ci)
  Cache/Queue:  Redis 7.x
  Tasks:        Celery 5.4.x + Celery Beat
  Auth:         JWT (python-jose) + Bcrypt (passlib)
  Server:       Uvicorn (dev) · Gunicorn + UvicornWorker (prod)
  Containers:   Docker + Docker Compose
  Proxy:        Nginx (TLS termination, rate limiting)

DATABASE (MySQL 8.0) — 35 TABLES
  Auth:           users · admin_users · refresh_tokens ·
                  admin_refresh_tokens · verification_tokens ·
                  user_social_accounts
  Addresses:      addresses
  Products:       products · categories · collections ·
                  product_variants · product_images ·
                  product_collections · product_tags ·
                  product_care_cards · product_features ·
                  product_specifications · pot_upsells
  Inventory:      inventory · warehouses · inventory_history
  Cart & Orders:  carts · cart_items · orders · order_items ·
                  order_status_history · order_notes · order_tags ·
                  refunds · returns · return_items
  Discounts:      discounts · discount_products ·
                  discount_collections · discount_usage · bogo_configs
  Loyalty:        loyalty_accounts · loyalty_transactions ·
                  wishlists · wishlist_items
  Reviews:        reviews · review_photos · review_flags ·
                  review_moderation_history
  Garden:         garden_service_types · garden_bookings · gardeners
  AI Care:        ai_care_sessions · ai_care_messages ·
                  ai_care_product_suggestions
  My Plants:      user_plants · plant_care_logs
  System:         notification_preferences · activity_log ·
                  analytics_daily · payment_methods

SERVICES (Business Logic Layer)
  OrderService      → create order, validate discount, pricing, reserve inventory
  PaymentService    → Razorpay order, signature verify, refund, capture
  ShippingService   → Shiprocket create shipment, track AWB
  LoyaltyService    → earn/redeem/adjust points, tier upgrade
  NotificationService → Klaviyo email, MSG91 SMS
  AICareService     → session management, Google Vision plant ID, OpenAI GPT-4o
  AnalyticsService  → query pre-aggregated metrics, compute KPIs

CELERY TASKS
  post_payment_tasks        → deduct inventory + earn loyalty + send email
  deduct_inventory          → on fulfillment
  release_inventory         → on cancellation
  send_fulfillment_notification → shipped email/SMS
  aggregate_daily_metrics   → hourly analytics aggregation
  update_discount_statuses  → every 5 min (scheduled→active→expired)
  expire_old_carts          → daily cleanup
  send_watering_reminders   → daily plant care emails
  send_review_requests      → 7 days post-delivery

API SURFACE
  Storefront routes:  ~50 endpoints (auth, products, cart, orders,
                       customers, reviews, AI care, garden services)
  Admin routes:       ~60 endpoints (all modules + analytics + staff)
  Webhooks:           2 (Razorpay, Shiprocket)

EXTERNAL INTEGRATIONS
  Razorpay       → payments, refunds (HMAC-SHA256 webhook)
  Shiprocket     → fulfilment, AWB, tracking (webhook)
  OpenAI GPT-4o  → AI Care conversation generation
  Google Vision  → plant photo identification
  Klaviyo        → transactional + marketing email
  MSG91          → OTP + order SMS
  AWS S3 / R2    → product images, review photos, AI care uploads

SECURITY
  JWT access tokens (60 min) · SHA-256-hashed refresh tokens ·
  HttpOnly Secure cookie · Bcrypt bcrypt-12 passwords ·
  HMAC-SHA256 webhook verification · FOR UPDATE inventory locks ·
  Role-based access (7 admin roles) · Soft-delete users ·
  No raw card data (Razorpay tokenisation) · DPDPA compliance

PERFORMANCE
  Redis caching (60–3600s TTL per resource type) ·
  SQLAlchemy connection pool (10 + 20 overflow per worker) ·
  FULLTEXT product search (MySQL native, upgrade to Meilisearch) ·
  Pre-aggregated analytics_daily (Celery hourly) ·
  Virtual scroll API (paginated, max 250/page) ·
  Background tasks for all post-payment operations

═══════════════════════════════════════════════════════════════════════
Total spec: ~2,500 lines | 27 sections
Files: 45+ Python modules | 35 MySQL tables | 110+ API endpoints
Last updated: June 2026
═══════════════════════════════════════════════════════════════════════
```

---

*Document version: 1.0 (complete) — Hero Plant Store Backend Architecture*
*Stack: Python · FastAPI · MySQL 8.0 · Redis · Celery*
*Author: Hero Plant Store Engineering*
*Last updated: June 2026*
