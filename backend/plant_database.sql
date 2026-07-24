USE plant_store;

CREATE TABLE IF NOT EXISTS users (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid                CHAR(36) NOT NULL UNIQUE DEFAULT(UUID()),
    first_name          VARCHAR(100) NOT NULL,
    last_name           VARCHAR(100) NOT NULL,
    email               VARCHAR(255) UNIQUE,
    password_HASH       VARCHAR(255),
    role                ENUM('customer', 'super_admin') DEFAULT 'customer',
    phone               VARCHAR(15) UNIQUE,
    PREFERRED_LANGUAGE  CHAR(2) DEFAULT('en'),
    email_verified      BOOLEAN DEFAULT FALSE,
    phone_verified      BOOLEAN DEFAULT FALSE,
    is_block            BOOLEAN DEFAULT FALSE,
    block_reason        VARCHAR(500),
    blocked_at          DATETIME,
    last_login_at       DATETIME,
    created_at          DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at          DATETIME
);



-- ─────────────────────────────────────────────────────────────────────
-- EMAIL VERIFICATION TOKENS
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS verification_tokens(
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT UNSIGNED NOT NULL,
    token           CHAR(36) NOT NULL UNIQUE,
    type            ENUM('email_verify', 'password_reset', 'phone_otp') NOT NULL,
    expires_at      DATETIME NOT NULL,
    used_at         DATETIME,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_token (token),
    INDEX idx_user_id (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )

-- ─────────────────────────────────────────────────────────────────────
-- REFRESH TOKENS (for JWT rotation)
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS refresh_token(
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT UNSIGNED NOT NULL,
    token_has       CHAR(64) NOT NULL UNIQUE,
    device_info     VARCHAR(255),
    ip_address      VARCHAR(45),
    expires_at      DATETIME NOT NULL,
    revoked_at      DATETIME,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_user_id (user_id),    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)

-- ─────────────────────────────────────────────────────────────────────
-- ADMIN USERS (separate from storefront customers)
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_users (
    user_id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    mfa_secret      VARCHAR(255),
    mfa_enabled     BOOLEAN DEFAULT FALSE,
    last_login_at   DATETIME,
    last_login_ip   VARCHAR(45),
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP
                    ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
); 


-- ─────────────────────────────────────────────────────────────────────
-- ADMIN REFRESH TOKENS
-- ─────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS admin_refresh_tkens(
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    admin_id    BIGINT UNSIGNED NOT NULL,
    token_has   CHAR(64) NOT NULL,
    expires_at  DATETIME,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(admin_id) REFERENCES admin_users(user_id) ON DELETE CASCADE
)


CREATE TABLE  IF NOT EXISTS addresses(
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT UNSIGNED NOT  NULL,
    type            ENUM('home', 'wroke', 'other') DEFAULT 'home',
    label           VARCHAR(50),
    recipient_name  VARCHAR(200) NOT NULL,
    phone           VARCHAR(15) NOT NULL,
    line1           VARCHAR(255) NOT NULL,
    line2           VARCHAR(255),
    city            VARCHAR(100) NOT NULL,
    state           VARCHAR(100) NOT NULL,
    pincode         CHAR(6) NOT NULL,
    country         VARCHAR(100)  DEFAULT 'India',
    is_default      BOOLEAN DEFAULT FALSE,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_at       DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) 

-- ─────────────────────────────────────────────────────────────────────
-- CATEGORIES
-- ─────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS categories (
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

CREATE TABLE IF NOT EXISTS products (
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
    base_price              DECIMAL(10,2) NOT NULL,
    compare_at_price        DECIMAL(10,2),
    cost_price              DECIMAL(10,2),
    discount_badge_text    VARCHAR(50),
    price_note              VARCHAR(100),
    is_taxable              BOOLEAN DEFAULT TRUE,
    tax_rate                DECIMAL(5,2) DEFAULT 18.00,
    -- Care info (plants only)
    care_light              VARCHAR(100),
    care_water               VARCHAR(100),
    care_temperature        VARCHAR(50),
    care_skil               ENUM('beginner','intermediate','expert'),
    is_pet_friendly         BOOLEAN,
    is_air_purifying        BOOLEAN,
    -- Delivery
    delivery_eta_label      VARCHAR(100) DEFAULT '3-5 business days',
    health_guarantee_label  VARCHAR(100) DEFAULT '7-day health guarantee',
    packaging_label         VARCHAR(100) DEFAULT 'Eco-friendly packaging',
    weight_grams            DECIMAL(8,2),
    length_cm               DECIMAL(6,2),
    width_cm                DECIMAL(6,2),
    height_cm               DECIMAL(6,2),
    free_delivery_eligible  BOOLEAN DEFAULT TRUE,
    
    seo_title               VARCHAR(70),
    seo_description         VARCHAR(160),
    
    STATUS                  ENUM('draft', 'active', 'archived') DEFAULT 'draft',
    published_at            DATETIME,
    -- Ratings cache (denormalised for performance)
    rating_average      DECIMAL(3,2) DEFAULT 0.00,
    rating_count        INT UNSIGNED DEFAULT 0,
    created_by          BIGINT UNSIGNED NULL,
    created_at          DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (created_by) REFERENCES admin_users(user_id) ON DELETE SET NULL
)

-- ─────────────────────────────────────────────────────────────────────
-- PRODUCT TAGS
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS product_tags (
    product_id  BIGINT UNSIGNED NOT NULL,
    tag         VARCHAR(100) NOT NULL,
    PRIMARY KEY (product_id, tag),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_tag (tag)
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────────────────────────────
-- COLLECTIONS (curated groups: Bestsellers, New Arrivals, etc.)
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS collections (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    slug        VARCHAR(120) NOT NULL UNIQUE,
    description TEXT,
    image_url   VARCHAR(500),
    is_active   BOOLEAN DEFAULT TRUE,
    sort_order  SMALLINT DEFAULT 0,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS product_collections (
    product_id      BIGINT UNSIGNED NOT NULL,
    collection_id   INT UNSIGNED NOT NULL,
    sort_order      SMALLINT DEFAULT 0,
    PRIMARY KEY (product_id, collection_id),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE
) ENGINE=InnoDB;


CREATE TABLE IF NOT EXISTS product_variants (
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
CREATE TABLE IF NOT EXISTS product_images (
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
CREATE TABLE IF NOT EXISTS inventory (
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

CREATE TABLE IF NOT EXISTS warehouses (
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
CREATE TABLE IF NOT EXISTS inventory_history (
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
    FOREIGN KEY (admin_id) REFERENCES admin_users(user_id) ON DELETE SET NULL,
    INDEX idx_variant_id (variant_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────────────────────────────
-- PRODUCT CARE GUIDE CARDS (About tab + Care Guide tab)
-- ─────────────────────────────────────────────────────────────────────

CREATE Table IF NOT EXISTS product_care_cards(
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id  BIGINT UNSIGNED NOT NULL,
    icon                VARCHAR(50),
    title               VARCHAR(100) NOT NULL,
    value               VARCHAR(150) NOT NULL,
    detail              TEXT,
    defficults_level    TINYINT DEFAULT 3,
    sort_order          TINYINT DEFAULT 1,
    created_at          DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
)

CREATE TABLE IF NOT EXISTS product_features (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id  BIGINT UNSIGNED NOT NULL,
    feature     VARCHAR(255) NOT NULL,      -- "Air-purifying" bullet point
    sort_order  TINYINT DEFAULT 1,

    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS product_specifications (
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
CREATE TABLE IF NOT EXISTS pot_upsells (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    plant_product_id    BIGINT UNSIGNED NOT NULL,
    pot_product_id      BIGINT UNSIGNED NOT NULL,
    sort_order          TINYINT DEFAULT 1,

    FOREIGN KEY (plant_product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (pot_product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_plant (plant_product_id)
) ENGINE=InnoDB;


-- ─────────────────────────────────────────────────────────────────────
-- CARTS (session carts — persisted to DB for logged-in users)
-- ─────────────────────────────────────────────────────────────────────

CREATE Table IF NOT EXISTS carts(
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid            CHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
    user_id         BIGINT UNSIGNED,
    session_token   VARCHAR(64),
    expires_at      DATETIME,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_session_token (session_token)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS cart_items(
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
CREATE TABLE IF NOT EXISTS orders (
    id                      BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid                    CHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
    order_number            VARCHAR(50) NOT NULL UNIQUE,   -- "ORD-4821"
    user_id                 BIGINT UNSIGNED,               -- NULL = guest
    guest_email             VARCHAR(254),                  -- for guest orders
    guest_phone             VARCHAR(15),


    subtotal                DECIMAL(10,2) NOT NULL,
    discount_amount         DECIMAL(10,2) DEFAULT 0.00,
    shipping_amount         DECIMAL(10,2) DEFAULT 0.00,
    tax_amount              DECIMAL(10,2) DEFAULT 0.00,
    total                   DECIMAL(10,2) NOT NULL,
    currency                CHAR(3) DEFAULT 'INR',

  
    discount_code           VARCHAR(100),
    discount_id             BIGINT UNSIGNED,
    loyalty_points_used     INT DEFAULT 0,
    loyalty_discount_amount DECIMAL(10,2) DEFAULT 0.00,


    status                  ENUM(
        'new_order','payment_pending','payment_failed','payment_verified','payment_confirmed',
        'cod_eligibility_verified','cod_amount_collected','order_accepted','order_confirmed',
        'inventory_reserved','picking','quality_check','packed','ready_for_dispatch',
        'courier_assigned','picked_up','shipped','in_transit','out_for_delivery',
        'delivered','completed','cancelled_by_customer','cancelled_by_admin',
        'refund_pending','refunded','return_requested','return_approved',
        'return_pickup_scheduled','return_received','return_inspection',
        'return_rejected','return_completed',
        'order_placed','processing','dispatched','delivery_attempted','cancelled',
        'return_in_transit','refund_initiated'
    ) NOT NULL DEFAULT 'new_order',

    payment_status          ENUM(
        'pending','authorized','paid','partially_paid',
        'refunded','partially_refunded','voided','failed','cod_pending'
    ) DEFAULT 'pending',

    fulfillment_status      ENUM(
        'unfulfilled','partially_fulfilled','fulfilled','returned'
    ) DEFAULT 'unfulfilled',


    payment_gateway         VARCHAR(50),           -- 'razorpay', 'upi', 'cod'
    razorpay_order_id       VARCHAR(100),
    razorpay_payment_id     VARCHAR(100),
    razorpay_signature      VARCHAR(255),
    transaction_id          VARCHAR(100),


    shipping_address_id     BIGINT UNSIGNED,
    shipping_carrier        VARCHAR(100),           -- "Shiprocket"
    tracking_number         VARCHAR(100),
    tracking_url            VARCHAR(500),
    shiprocket_order_id     VARCHAR(100),
    awb_code                VARCHAR(100),
    estimated_delivery      DATE,
    delivered_at            DATETIME,


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
CREATE TABLE IF NOT EXISTS order_items (
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
CREATE TABLE IF NOT EXISTS  order_status_history (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id        BIGINT UNSIGNED NOT NULL,
    status          VARCHAR(50) NOT NULL,
    location        VARCHAR(255),
    description     VARCHAR(500),
    admin_id        BIGINT UNSIGNED,            -- who changed it (NULL = system)
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (admin_id) REFERENCES admin_users(user_id) ON DELETE SET NULL,
    INDEX idx_order_id (order_id)
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────────────────────────────
-- REFUNDS
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS  refunds (
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
    FOREIGN KEY (admin_id) REFERENCES admin_users(user_id) ON DELETE SET NULL,
    INDEX idx_order_id (order_id)
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────────────────────────────
-- RETURNS
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS  returns (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id        BIGINT UNSIGNED NOT NULL,
    reason          ENUM(
                        'damaged_product','dead_plant','wrong_product','missing_item',
                        'poor_quality','size_issue','changed_mind','other',
                        'damaged_in_transit','wrong_item','quality_issue'
                    ) NOT NULL,
    return_type     ENUM('refund','replacement','exchange','store_credit') DEFAULT 'refund',
    status          ENUM('requested','approved','rejected','pickup_scheduled','picked_up','received','inspection','refund_pending','refunded','replacement_created','completed','in_transit','refund_issued') DEFAULT 'requested',
    customer_note   TEXT,
    admin_note      TEXT,
    evidence_urls   TEXT,
    return_tracking VARCHAR(100),
    processed_by    BIGINT UNSIGNED,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (processed_by) REFERENCES admin_users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS  return_items (
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
CREATE TABLE IF NOT EXISTS  order_notes (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id    BIGINT UNSIGNED NOT NULL,
    admin_id    BIGINT UNSIGNED NOT NULL,
    note        TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT TRUE,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (admin_id) REFERENCES admin_users(user_id)
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────────────────────────────
-- ORDER TAGS
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS  order_tags (
    order_id    BIGINT UNSIGNED NOT NULL,
    tag         VARCHAR(100) NOT NULL,
    PRIMARY KEY (order_id, tag),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB;


-- ─────────────────────────────────────────────────────────────────────
-- DISCOUNTS
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS discounts (
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

    FOREIGN KEY (created_by) REFERENCES admin_users(user_id) ON DELETE SET NULL,
    INDEX idx_code (code),
    INDEX idx_status (status),
    INDEX idx_starts_at (starts_at),
    INDEX idx_ends_at (ends_at)
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────────────────────────────
-- DISCOUNT PRODUCT / COLLECTION SCOPE
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS discount_products (
    discount_id BIGINT UNSIGNED NOT NULL,
    product_id  BIGINT UNSIGNED NOT NULL,
    is_excluded BOOLEAN DEFAULT FALSE,      -- TRUE = exclusion rule
    PRIMARY KEY (discount_id, product_id),
    FOREIGN KEY (discount_id) REFERENCES discounts(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS discount_collections (
    discount_id     BIGINT UNSIGNED NOT NULL,
    collection_id   INT UNSIGNED NOT NULL,
    PRIMARY KEY (discount_id, collection_id),
    FOREIGN KEY (discount_id) REFERENCES discounts(id) ON DELETE CASCADE,
    FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────────────────────────────
-- DISCOUNT USAGE LOG
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS discount_usage (
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
CREATE TABLE IF NOT EXISTS bogo_configs (
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
CREATE TABLE IF NOT EXISTS loyalty_accounts (
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

CREATE TABLE IF NOT EXISTS loyalty_transactions (
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
    FOREIGN KEY (adjusted_by) REFERENCES admin_users(user_id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────────────────────────────
-- WISHLIST
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS wishlists (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT UNSIGNED NOT NULL UNIQUE,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS wishlist_items (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    wishlist_id     BIGINT UNSIGNED NOT NULL,
    product_id      BIGINT UNSIGNED NOT NULL,
    variant_id      BIGINT UNSIGNED,
    added_at        DATETIME DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY uq_wishlist_product (wishlist_id, product_id),
    FOREIGN KEY (wishlist_id) REFERENCES wishlists(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────────────────────────────
-- Reviews
-- ─────────────────────────────────────────────────────────────────────


CREATE TABLE IF NOT EXISTS reviews (
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
    FOREIGN KEY (admin_reply_by) REFERENCES admin_users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (moderated_by) REFERENCES admin_users(user_id) ON DELETE SET NULL,
    INDEX idx_product_id (product_id)
    INDEX idx_status (status),
    INDEX idx_rating (rating),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS review_photos (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    review_id   BIGINT UNSIGNED NOT NULL,
    url         VARCHAR(500) NOT NULL,
    position    TINYINT UNSIGNED DEFAULT 1,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS review_flags (
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
    FOREIGN KEY (resolved_by) REFERENCES admin_users(user_id) ON DELETE SET NULL,
    INDEX idx_review_id (review_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS review_moderation_history (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    review_id   BIGINT UNSIGNED NOT NULL,
    admin_id    BIGINT UNSIGNED,
    action      VARCHAR(100) NOT NULL,      -- "approved", "rejected", "flagged"
    notes       VARCHAR(500),
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE,
    FOREIGN KEY (admin_id) REFERENCES admin_users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────────────────────────────
-- Garden Services
-- ─────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS garden_service_types (
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


CREATE TABLE IF NOT EXISTS garden_bookings (
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

CREATE TABLE IF NOT EXISTS gardeners (
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

-- ─────────────────────────────────────────────────────────────────────
-- AI Care
-- ─────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS ai_care_sessions (
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
    FOREIGN KEY (reviewed_by) REFERENCES admin_users(user_id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at),
    INDEX idx_flag_status (flag_status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS ai_care_messages (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    session_id  BIGINT UNSIGNED NOT NULL,
    role        ENUM('user','assistant') NOT NULL,
    content     TEXT NOT NULL,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (session_id) REFERENCES ai_care_sessions(id) ON DELETE CASCADE,
    INDEX idx_session_id (session_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS ai_care_product_suggestions (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    session_id  BIGINT UNSIGNED NOT NULL,
    product_id  BIGINT UNSIGNED NOT NULL,
    clicked     BOOLEAN DEFAULT FALSE,
    added_to_cart BOOLEAN DEFAULT FALSE,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (session_id) REFERENCES ai_care_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;


-- ─────────────────────────────────────────────────────────────────────
-- My Plants
-- ─────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS user_plants (
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

CREATE TABLE IF NOT EXISTS plant_care_logs (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    plant_id    BIGINT UNSIGNED NOT NULL,
    type        ENUM('watered','fertilised','repotted','pruned','note') NOT NULL,
    note        TEXT,
    logged_at   DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (plant_id) REFERENCES user_plants(id) ON DELETE CASCADE,
    INDEX idx_plant_id (plant_id)
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────────────────────────────
-- Notifications & Activity Log
-- ─────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS notification_preferences (
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
CREATE TABLE IF NOT EXISTS activity_log (
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

    FOREIGN KEY (admin_id) REFERENCES admin_users(user_id) ON DELETE SET NULL,
    INDEX idx_admin_id (admin_id),
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────────────────────────────
-- ANALYTICS AGGREGATES (pre-computed, updated by Celery)
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS analytics_daily (
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

-- ─────────────────────────────────────────────────────────────────────
-- Payment Methods (saved cards)
-- ─────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS payment_methods (
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
