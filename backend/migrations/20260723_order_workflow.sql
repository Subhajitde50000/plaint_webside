-- MySQL migration: expand the orders workflow enum without invalidating legacy orders.
-- Run once before deploying the updated backend against an existing database.
ALTER TABLE orders MODIFY COLUMN status ENUM(
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
) NOT NULL DEFAULT 'new_order';

ALTER TABLE returns
  MODIFY COLUMN reason ENUM('damaged_product','dead_plant','wrong_product','missing_item','poor_quality','size_issue','changed_mind','other','damaged_in_transit','wrong_item','quality_issue') NOT NULL,
  MODIFY COLUMN return_type ENUM('refund','replacement','exchange','store_credit') DEFAULT 'refund',
  MODIFY COLUMN status ENUM('requested','approved','rejected','pickup_scheduled','picked_up','received','inspection','refund_pending','refunded','replacement_created','completed','in_transit','refund_issued') DEFAULT 'requested',
  ADD COLUMN evidence_urls TEXT NULL AFTER admin_note;
