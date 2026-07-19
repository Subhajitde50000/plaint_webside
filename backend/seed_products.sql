USE plant_store;

-- Starter catalog seed data for plants, seeds, soil, tools, pots, and fertilizer.
-- Intended for a development database or a fresh local import.

START TRANSACTION;

-- ─────────────────────────────────────────────────────────────────────
-- CATEGORIES
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO categories (id, parent_id, name, slug, description, sort_order, is_active)
VALUES
  (1, NULL, 'Plants', 'plants', 'Live indoor and outdoor plants.', 1, TRUE),
  (2, NULL, 'Seeds', 'seeds', 'Seed packets for herbs, flowers, and vegetables.', 2, TRUE),
  (3, NULL, 'Soil', 'soil', 'Potting mixes, cocopeat, and growing media.', 3, TRUE),
  (4, NULL, 'Tools', 'tools', 'Garden tools and plant care accessories.', 4, TRUE),
  (5, NULL, 'Pots', 'pots', 'Planters, pots, and decorative cachepots.', 5, TRUE),
  (6, NULL, 'Fertilizers', 'fertilizers', 'Organic and liquid plant nutrition.', 6, TRUE),
  (7, NULL, 'Accessories', 'accessories', 'Plant supports and extra care accessories.', 7, TRUE);

-- ─────────────────────────────────────────────────────────────────────
-- WAREHOUSES
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO warehouses (id, name, city, state, pincode, is_active)
VALUES
  (1, 'Bangalore Fulfilment Center', 'Bengaluru', 'Karnataka', '560068', TRUE),
  (2, 'Mumbai Storage Hub', 'Mumbai', 'Maharashtra', '400701', TRUE);

-- ─────────────────────────────────────────────────────────────────────
-- PRODUCTS
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO products (
  id, uuid, category_id, product_type, title, slug, short_description, description,
  botanical_name, common_name, base_price, compare_at_price, cost_price, discount_badge_text,
  price_note, is_taxable, tax_rate, care_light, care_water, care_temperature, care_skil,
  is_pet_friendly, is_air_purifying, delivery_eta_label, health_guarantee_label,
  packaging_label, weight_grams, length_cm, width_cm, height_cm, free_delivery_eligible,
  seo_title, seo_description, status, published_at, rating_average, rating_count, created_by
)
VALUES
  (101, UUID(), 1, 'plant', 'Monstera Deliciosa', 'monstera-deliciosa', 'Large tropical foliage plant for bright interiors.', 'The Monstera Deliciosa is a bold statement plant with dramatic split leaves. It is ideal for living rooms, offices, and bright indoor corners.', 'Monstera deliciosa', 'Swiss Cheese Plant', 1299.00, 1799.00, 760.00, 'Best Seller', 'Inclusive of all taxes', TRUE, 18.00, 'Bright indirect light', 'Once a week', '18-27 C', 'beginner', FALSE, TRUE, '3-5 business days', '7-day health guarantee', 'Eco-friendly packaging', 1800.00, 30.00, 30.00, 65.00, TRUE, 'Monstera Deliciosa - Buy Indoor Plant Online', 'Shop Monstera Deliciosa indoor plant with fast delivery and beginner-friendly care.', 'active', NOW(), 4.80, 342, NULL),
  (102, UUID(), 1, 'plant', 'Snake Plant', 'snake-plant', 'Low-maintenance air-purifying plant.', 'Snake Plant is one of the toughest indoor plants. It tolerates low light, needs very little water, and works well for homes and offices.', 'Dracaena trifasciata', 'Snake Plant', 899.00, 1199.00, 520.00, 'Low Care', 'Inclusive of all taxes', TRUE, 18.00, 'Low to bright indirect light', 'Every 2 weeks', '16-28 C', 'beginner', TRUE, TRUE, '3-5 business days', '7-day health guarantee', 'Eco-friendly packaging', 1400.00, 25.00, 25.00, 55.00, TRUE, 'Snake Plant - Indoor Air Purifying Plant', 'Buy snake plant online for homes, bedrooms, and workspaces.', 'active', NOW(), 4.70, 214, NULL),
  (201, UUID(), 2, 'seed', 'Basil Seed Pack', 'basil-seed-pack', 'Herb seeds for kitchen gardens and balconies.', 'A fast-growing basil seed pack that is perfect for kitchen gardening. Great for pots, balcony planters, and small home gardens.', 'Ocimum basilicum', 'Basil Seeds', 79.00, 99.00, 28.00, 'Fresh Harvest', 'Price includes seeds only', TRUE, 5.00, NULL, NULL, NULL, NULL, NULL, NULL, '5-7 business days', 'Seed germination support', 'Compact moisture-safe pouch', 25.00, 12.00, 8.00, 1.50, TRUE, 'Basil Seed Pack Online', 'Buy basil seeds for kitchen gardening, balcony pots, and terrace gardens.', 'active', NOW(), 4.60, 88, NULL),
  (202, UUID(), 2, 'seed', 'Marigold Seed Mix', 'marigold-seed-mix', 'Bright seasonal flower seeds.', 'Marigold seed mix for colorful flower beds, pots, and festive home gardens. Easy to sow and beginner friendly.', 'Tagetes erecta', 'Marigold Seeds', 69.00, 89.00, 24.00, 'Blooming Soon', 'Price includes seeds only', TRUE, 5.00, NULL, NULL, NULL, NULL, NULL, NULL, '5-7 business days', 'Seed germination support', 'Compact moisture-safe pouch', 25.00, 12.00, 8.00, 1.50, TRUE, 'Marigold Seed Mix Online', 'Buy marigold seeds for bright, long-lasting flowers.', 'active', NOW(), 4.50, 64, NULL),
  (301, UUID(), 3, 'soil', 'Premium Potting Soil Mix', 'premium-potting-soil-mix', 'Ready-to-use mix for indoor and balcony plants.', 'A balanced potting mix with cocopeat, compost, and drainage-friendly additives. Suitable for indoor plants, terrace pots, and repotting.', NULL, 'Potting Soil Mix', 249.00, 299.00, 140.00, 'Soil Care', 'Price per bag', TRUE, 5.00, NULL, NULL, NULL, NULL, NULL, NULL, '3-5 business days', '7-day health guarantee', 'Heavy-duty sealed bag', 5000.00, 40.00, 30.00, 10.00, TRUE, 'Premium Potting Soil Mix Online', 'Buy premium potting soil mix for repotting and healthy root growth.', 'active', NOW(), 4.80, 173, NULL),
  (302, UUID(), 3, 'soil', 'Cocopeat Grow Mix', 'cocopeat-grow-mix', 'Lightweight growing medium for seed starting.', 'A lightweight cocopeat blend that improves water retention and supports seed germination, propagation, and nursery use.', NULL, 'Cocopeat Mix', 199.00, 249.00, 110.00, 'Seed Start', 'Price per bag', TRUE, 5.00, NULL, NULL, NULL, NULL, NULL, NULL, '3-5 business days', '7-day health guarantee', 'Heavy-duty sealed bag', 4000.00, 35.00, 28.00, 8.00, TRUE, 'Cocopeat Grow Mix Online', 'Buy cocopeat mix for seed starting and cuttings.', 'active', NOW(), 4.70, 118, NULL),
  (401, UUID(), 4, 'tool', 'Pruning Shears', 'pruning-shears', 'Sharp hand tool for trimming leaves and stems.', 'Comfort-grip pruning shears designed for clean cuts on stems, flowers, and small branches. Useful for regular plant maintenance.', NULL, 'Garden Pruner', 349.00, 449.00, 180.00, 'Hand Tool', 'One piece', TRUE, 18.00, NULL, NULL, NULL, NULL, NULL, NULL, '3-5 business days', '7-day health guarantee', 'Recyclable box', 250.00, 20.00, 8.00, 2.50, TRUE, 'Pruning Shears Online', 'Buy pruning shears for clean plant trimming and maintenance.', 'active', NOW(), 4.90, 96, NULL),
  (402, UUID(), 4, 'tool', 'Watering Can', 'watering-can', 'Long-spout can for controlled watering.', 'A lightweight watering can with a long spout for controlled watering of indoor plants, balcony pots, and seedlings.', NULL, 'Watering Can', 299.00, 379.00, 150.00, 'Water Care', 'One piece', TRUE, 18.00, NULL, NULL, NULL, NULL, NULL, NULL, '3-5 business days', '7-day health guarantee', 'Recyclable box', 400.00, 28.00, 12.00, 20.00, TRUE, 'Watering Can Online', 'Buy watering cans for indoor plants and balcony gardening.', 'active', NOW(), 4.70, 83, NULL),
  (501, UUID(), 5, 'pot', 'Terracotta Pot', 'terracotta-pot', 'Classic breathable pot for healthy roots.', 'Unglazed terracotta planter with natural breathability and a clean minimalist shape. Great for succulents, herbs, and indoor foliage.', NULL, 'Terracotta Pot', 349.00, 449.00, 170.00, 'Pot Pick', 'Pot only', TRUE, 18.00, NULL, NULL, NULL, NULL, NULL, NULL, '3-5 business days', '7-day health guarantee', 'Eco-friendly packaging', 900.00, 18.00, 18.00, 18.00, TRUE, 'Terracotta Pot Online', 'Buy terracotta pots for indoor and balcony plants.', 'active', NOW(), 4.60, 71, NULL),
  (502, UUID(), 5, 'pot', 'White Ceramic Planter', 'white-ceramic-planter', 'Decorative ceramic pot for premium display.', 'Glossy white ceramic planter that works well for modern interiors and decorative plant styling.', NULL, 'Ceramic Planter', 499.00, 649.00, 240.00, 'Decorative', 'Pot only', TRUE, 18.00, NULL, NULL, NULL, NULL, NULL, NULL, '3-5 business days', '7-day health guarantee', 'Eco-friendly packaging', 1300.00, 20.00, 20.00, 19.00, TRUE, 'White Ceramic Planter Online', 'Buy white ceramic planters for premium plant display.', 'active', NOW(), 4.80, 54, NULL),
  (601, UUID(), 6, 'fertilizer', 'Organic Compost Fertilizer', 'organic-compost-fertilizer', 'Slow-release natural nutrient booster.', 'A soil-enriching organic compost fertilizer for flowering, fruiting, and foliage plants. Supports slow and steady plant growth.', NULL, 'Organic Compost', 199.00, 249.00, 92.00, 'Organic Feed', 'Price per pack', TRUE, 5.00, NULL, NULL, NULL, NULL, NULL, NULL, '3-5 business days', '7-day health guarantee', 'Sealed eco pack', 1000.00, 20.00, 15.00, 5.00, TRUE, 'Organic Compost Fertilizer Online', 'Buy organic compost fertilizer for healthy plant growth.', 'active', NOW(), 4.80, 132, NULL),
  (602, UUID(), 6, 'fertilizer', 'Liquid Growth Booster', 'liquid-growth-booster', 'Quick-absorbing liquid fertilizer.', 'A balanced liquid fertilizer formulated for indoor plants, herbs, and balcony gardens. Easy to mix with water and apply weekly.', NULL, 'Growth Booster', 279.00, 349.00, 130.00, 'Quick Feed', 'Price per bottle', TRUE, 5.00, NULL, NULL, NULL, NULL, NULL, NULL, '3-5 business days', '7-day health guarantee', 'Sealed bottle', 500.00, 18.00, 8.00, 18.00, TRUE, 'Liquid Growth Booster Online', 'Buy liquid fertilizer for faster, healthier plant growth.', 'active', NOW(), 4.70, 97, NULL);

-- ─────────────────────────────────────────────────────────────────────
-- PRODUCT VARIANTS
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO product_variants (
  id, product_id, variant_type, option_name, option_detail, best_for, pot_diameter,
  dispatch_time, price, compare_at_price, sku, barcode, sort_order, is_active
)
VALUES
  (1001, 101, 'size', 'Small', '20-30 cm', 'Desk and shelf styling', '12 cm', '1-2 days', 1299.00, 1799.00, 'MONSTERA-S-001', NULL, 1, TRUE),
  (1002, 101, 'size', 'Medium', '40-55 cm', 'Most popular pick', '18 cm', '1-2 days', 1699.00, 2199.00, 'MONSTERA-M-001', NULL, 2, TRUE),
  (1003, 102, 'size', 'Standard', '50-65 cm', 'Low-light corners', '17 cm', '1-2 days', 899.00, 1199.00, 'SNAKE-STD-001', NULL, 1, TRUE),
  (2001, 201, 'pack_size', '25 Seeds', 'Small home starter pack', 'Kitchen garden beginners', NULL, '1-2 days', 79.00, 99.00, 'BASIL-25-001', NULL, 1, TRUE),
  (2002, 201, 'pack_size', '50 Seeds', 'Family pack', 'Regular harvest planning', NULL, '1-2 days', 129.00, 159.00, 'BASIL-50-001', NULL, 2, TRUE),
  (2003, 202, 'pack_size', '25 Seeds', 'Compact flower pack', 'Balcony pots', NULL, '1-2 days', 69.00, 89.00, 'MARIGOLD-25-001', NULL, 1, TRUE),
  (3001, 301, 'weight', '1 Kg', 'Small bag', 'One planter or two medium pots', NULL, '1-2 days', 249.00, 299.00, 'SOIL-1KG-001', NULL, 1, TRUE),
  (3002, 301, 'weight', '5 Kg', 'Family bag', 'Multiple repots', NULL, '1-2 days', 899.00, 1099.00, 'SOIL-5KG-001', NULL, 2, TRUE),
  (3003, 302, 'weight', '2 Kg', 'Propagation bag', 'Seed starting and cuttings', NULL, '1-2 days', 199.00, 249.00, 'COCOPEAT-2KG-001', NULL, 1, TRUE),
  (4001, 401, 'custom', 'One Size', 'Steel pruner', 'All plant trimming tasks', NULL, '1-2 days', 349.00, 449.00, 'PRUNER-001', NULL, 1, TRUE),
  (4002, 402, 'custom', 'One Size', '1.5 L can', 'Indoor watering', NULL, '1-2 days', 299.00, 379.00, 'WATER-CAN-001', NULL, 1, TRUE),
  (5001, 501, 'diameter', '14 cm', 'Small planter', 'Herbs and succulents', '14 cm', '1-2 days', 349.00, 449.00, 'POT-14-001', NULL, 1, TRUE),
  (5002, 502, 'diameter', '18 cm', 'Medium planter', 'Premium indoor display', '18 cm', '1-2 days', 499.00, 649.00, 'POT-18-001', NULL, 1, TRUE),
  (6001, 601, 'pack_size', '1 Kg', 'Slow release pack', 'Indoor and balcony plants', NULL, '1-2 days', 199.00, 249.00, 'COMPOST-1KG-001', NULL, 1, TRUE),
  (6002, 602, 'pack_size', '500 ml', 'Liquid bottle', 'Weekly feeding', NULL, '1-2 days', 279.00, 349.00, 'BOOSTER-500ML-001', NULL, 1, TRUE);

-- ─────────────────────────────────────────────────────────────────────
-- PRODUCT IMAGES
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO product_images (product_id, url, alt_text, position, is_primary)
VALUES
  (101, 'https://images.unsplash.com/photo-1463154545680-d59320fd685d?auto=format&fit=crop&w=900&q=80', 'Monstera Deliciosa front view', 1, TRUE),
  (102, 'https://images.unsplash.com/photo-1491146855903-4d8c0b5b4a0d?auto=format&fit=crop&w=900&q=80', 'Snake plant in pot', 1, TRUE),
  (201, 'https://images.unsplash.com/photo-1598515213692-5f0f2d0b7b9d?auto=format&fit=crop&w=900&q=80', 'Basil seed packet', 1, TRUE),
  (202, 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80', 'Marigold flowers', 1, TRUE),
  (301, 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&w=900&q=80', 'Potting soil bag', 1, TRUE),
  (302, 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=900&q=80', 'Cocopeat mix bag', 1, TRUE),
  (401, 'https://images.unsplash.com/photo-1459156212016-c812468e2115?auto=format&fit=crop&w=900&q=80', 'Pruning shears tool', 1, TRUE),
  (402, 'https://images.unsplash.com/photo-1582582494700-27f56a4e0d3a?auto=format&fit=crop&w=900&q=80', 'Watering can', 1, TRUE),
  (501, 'https://images.unsplash.com/photo-1612198188060-c7c2a3b7f4c3?auto=format&fit=crop&w=900&q=80', 'Terracotta pot', 1, TRUE),
  (502, 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80', 'White ceramic planter', 1, TRUE),
  (601, 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=900&q=80', 'Organic compost fertilizer', 1, TRUE),
  (602, 'https://images.unsplash.com/photo-1602165002176-1c9a1a4a4b1f?auto=format&fit=crop&w=900&q=80', 'Liquid growth booster', 1, TRUE);

-- ─────────────────────────────────────────────────────────────────────
-- PRODUCT FEATURES
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO product_features (product_id, feature, sort_order)
VALUES
  (101, 'Large split leaves create an instant tropical look', 1),
  (101, 'Forgiving and easy for first-time plant owners', 2),
  (102, 'Thrives with very little watering', 1),
  (102, 'Excellent air-purifying indoor plant', 2),
  (201, 'High-germination herb seeds for home gardening', 1),
  (201, 'Works well in balcony pots and kitchen planters', 2),
  (202, 'Bright seasonal bloom for festive garden spaces', 1),
  (301, 'Balanced drainage and moisture retention', 1),
  (302, 'Lightweight medium for seed starting', 1),
  (401, 'Clean cutting action for healthy pruning', 1),
  (402, 'Long spout for controlled water flow', 1),
  (501, 'Breathable natural clay construction', 1),
  (502, 'Glossy decorative finish for premium spaces', 1),
  (601, 'Slow release nutrients for steady growth', 1),
  (602, 'Fast-acting formula for quick plant recovery', 1);

-- ─────────────────────────────────────────────────────────────────────
-- PRODUCT SPECIFICATIONS
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO product_specifications (product_id, label, value, sort_order)
VALUES
  (101, 'Plant Type', 'Tropical foliage', 1),
  (101, 'Light Requirement', 'Bright indirect light', 2),
  (101, 'Care Skill', 'Beginner', 3),
  (102, 'Plant Type', 'Indoor foliage', 1),
  (102, 'Light Requirement', 'Low to bright indirect light', 2),
  (102, 'Care Skill', 'Beginner', 3),
  (201, 'Pack Size', '25 and 50 seed packs', 1),
  (201, 'Sowing Season', 'All season in warm climates', 2),
  (201, 'Germination Time', '7-14 days', 3),
  (202, 'Pack Size', '25 seeds', 1),
  (202, 'Sowing Season', 'Spring and monsoon', 2),
  (202, 'Germination Time', '7-12 days', 3),
  (301, 'Volume', '1 Kg and 5 Kg', 1),
  (301, 'Ideal For', 'Repotting and new plants', 2),
  (301, 'pH', '6.0-6.8', 3),
  (302, 'Volume', '2 Kg', 1),
  (302, 'Ideal For', 'Seed starting and cuttings', 2),
  (302, 'pH', '6.0-6.5', 3),
  (401, 'Material', 'Stainless steel', 1),
  (401, 'Use', 'Pruning stems and leaves', 2),
  (401, 'Grip', 'Comfort grip handle', 3),
  (402, 'Capacity', '1.5 L', 1),
  (402, 'Use', 'Controlled watering', 2),
  (402, 'Material', 'Lightweight plastic', 3),
  (501, 'Diameter', '14 cm', 1),
  (501, 'Drainage', 'Yes', 2),
  (501, 'Material', 'Terracotta clay', 3),
  (502, 'Diameter', '18 cm', 1),
  (502, 'Drainage', 'Yes', 2),
  (502, 'Material', 'Ceramic', 3),
  (601, 'Net Weight', '1 Kg', 1),
  (601, 'Formulation', 'Organic compost', 2),
  (601, 'Application', 'Top dressing and soil mix', 3),
  (602, 'Volume', '500 ml', 1),
  (602, 'Formulation', 'Liquid fertilizer', 2),
  (602, 'Application', 'Mix with water weekly', 3);

-- ─────────────────────────────────────────────────────────────────────
-- PRODUCT CARE CARDS
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO product_care_cards (product_id, icon, title, value, detail, defficults_level, sort_order)
VALUES
  (101, '☀️', 'Light', 'Bright indirect', 'Avoid harsh direct sun to protect the leaves.', 3, 1),
  (101, '💧', 'Water', 'Weekly', 'Water when the top soil feels dry.', 2, 2),
  (101, '🌫️', 'Humidity', 'Moderate', 'Prefers slightly humid indoor spaces.', 3, 3),
  (102, '☀️', 'Light', 'Low to bright indirect', 'Very adaptable in indoor spaces.', 2, 1),
  (102, '💧', 'Water', 'Every 2 weeks', 'Let soil dry out between waterings.', 1, 2);

-- ─────────────────────────────────────────────────────────────────────
-- POT UPSELLS
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO pot_upsells (plant_product_id, pot_product_id, sort_order)
VALUES
  (101, 501, 1),
  (101, 502, 2),
  (102, 501, 1),
  (102, 502, 2);

-- ─────────────────────────────────────────────────────────────────────
-- INVENTORY
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO inventory (variant_id, warehouse_id, quantity, reserved, reorder_level, low_stock_alert, stock_policy)
VALUES
  (1001, 1, 18, 2, 5, TRUE, 'deny'),
  (1002, 1, 12, 1, 5, TRUE, 'deny'),
  (1003, 1, 20, 2, 5, TRUE, 'deny'),
  (2001, 1, 120, 0, 20, TRUE, 'continue'),
  (2002, 1, 90, 0, 20, TRUE, 'continue'),
  (2003, 1, 110, 0, 20, TRUE, 'continue'),
  (3001, 1, 55, 4, 10, TRUE, 'deny'),
  (3002, 1, 25, 2, 10, TRUE, 'deny'),
  (3003, 1, 48, 3, 10, TRUE, 'deny'),
  (4001, 1, 40, 1, 10, TRUE, 'deny'),
  (4002, 1, 35, 1, 10, TRUE, 'deny'),
  (5001, 1, 60, 2, 10, TRUE, 'deny'),
  (5002, 1, 44, 2, 10, TRUE, 'deny'),
  (6001, 1, 70, 5, 10, TRUE, 'continue'),
  (6002, 1, 65, 4, 10, TRUE, 'continue');

COMMIT;
