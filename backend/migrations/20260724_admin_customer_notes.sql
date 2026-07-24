-- Production migration for Admin Customers module. Run once before deploying the API.
CREATE TABLE IF NOT EXISTS customer_notes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    admin_id BIGINT NULL,
    note TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_customer_notes_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_customer_notes_admin FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE SET NULL,
    INDEX idx_customer_notes_user_created (user_id, created_at)
) ENGINE=InnoDB;
