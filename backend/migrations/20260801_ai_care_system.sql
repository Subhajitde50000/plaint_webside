-- Active: 1783267041355@@127.0.0.1@3306@plant_store
-- Active: 1785154390693@@gateway01.ap-southeast-1.prod.aws.tidbcloud.com@4000@mysql
-- Migration: AI Care System Database Schema Extension (Compatible Types)
-- Date: 2026-08-01

-- 1. Extend user_plants Table
ALTER TABLE user_plants
  ADD COLUMN IF NOT EXISTS height_cm           DECIMAL(6,1)      AFTER watering_interval_days,
  ADD COLUMN IF NOT EXISTS growth_stage        ENUM('seedling','juvenile','adolescent','mature','dormant') AFTER height_cm,
  ADD COLUMN IF NOT EXISTS pot_size_cm         TINYINT           AFTER growth_stage,
  ADD COLUMN IF NOT EXISTS soil_type           VARCHAR(100)       AFTER pot_size_cm,
  ADD COLUMN IF NOT EXISTS sunlight_exposure   ENUM('full_sun','partial_sun','indirect_bright','low_light','artificial_only') AFTER soil_type,
  ADD COLUMN IF NOT EXISTS last_fertilised_at  DATE               AFTER sunlight_exposure,
  ADD COLUMN IF NOT EXISTS last_repotted_at    DATE               AFTER last_fertilised_at,
  ADD COLUMN IF NOT EXISTS health_status       ENUM('thriving','healthy','needs_attention','sick','recovering') DEFAULT 'healthy' AFTER last_repotted_at,
  ADD COLUMN IF NOT EXISTS is_pet_household    BOOLEAN DEFAULT FALSE AFTER health_status,
  ADD COLUMN IF NOT EXISTS user_notes          TEXT               AFTER is_pet_household;

-- 2. Extend plant_care_logs Table
ALTER TABLE plant_care_logs
  ADD COLUMN IF NOT EXISTS source        ENUM('user','ai','system') DEFAULT 'user' AFTER type,
  ADD COLUMN IF NOT EXISTS ai_session_id BIGINT NULL                               AFTER source,
  ADD COLUMN IF NOT EXISTS care_category ENUM('watering','fertilising','repotting','pruning','disease','pest','light','temperature','general','note') DEFAULT 'note' AFTER ai_session_id,
  ADD COLUMN IF NOT EXISTS is_care_guide BOOLEAN DEFAULT FALSE                     AFTER care_category;

-- 3. New Table: ai_care_plant_context
CREATE TABLE IF NOT EXISTS ai_care_plant_context (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    session_id      BIGINT NOT NULL,
    plant_id        BIGINT NOT NULL,
    context_snapshot JSON NOT NULL,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (session_id) REFERENCES ai_care_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (plant_id)   REFERENCES user_plants(id)      ON DELETE CASCADE,
    INDEX idx_plant_ctx_session (session_id),
    INDEX idx_plant_ctx_plant (plant_id)
) ENGINE=InnoDB;

-- 4. New Table: ai_care_guides
CREATE TABLE IF NOT EXISTS ai_care_guides (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    plant_id        BIGINT NOT NULL,
    session_id      BIGINT,
    category        ENUM('watering','fertilising','repotting','pruning','disease','pest','light','temperature','general') NOT NULL,
    title           VARCHAR(255) NOT NULL,
    content         TEXT NOT NULL,
    severity        ENUM('info','warning','urgent') DEFAULT 'info',
    is_resolved     BOOLEAN DEFAULT FALSE,
    resolved_at     DATETIME,
    resolved_note   VARCHAR(500),
    created_by      ENUM('ai','user') DEFAULT 'ai',
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (plant_id)   REFERENCES user_plants(id)       ON DELETE CASCADE,
    FOREIGN KEY (session_id) REFERENCES ai_care_sessions(id)  ON DELETE SET NULL,
    INDEX idx_guide_plant (plant_id),
    INDEX idx_guide_category (category),
    INDEX idx_guide_severity (severity)
) ENGINE=InnoDB;
