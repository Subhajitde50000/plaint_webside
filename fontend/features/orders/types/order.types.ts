// ─── Order Status & Payment Enums ──────────────────────────────────────────
export type OrderStatus =
  | "order_placed"
  | "payment_confirmed"
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "return_requested"
  | "refunded";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded" | "cod_pending";
export type FulfillmentStatus = "unfulfilled" | "partial" | "fulfilled" | "returned";

// ─── Order Item ─────────────────────────────────────────────────────────────
export interface OrderItem {
  id: number;
  variant_id: number;
  product_id: number;
  title: string;
  variant_title?: string | null;
  sku: string;
  quantity: number;
  unit_price: string; // Decimal serialised as string by FastAPI
  compare_at_price?: string | null;
  discount_amount: string;
  total_price: string;
  tax_amount: string;
  image_url?: string | null;
}

// ─── Status History ─────────────────────────────────────────────────────────
export interface OrderStatusHistoryEntry {
  status: string;
  location?: string | null;
  description?: string | null;
  created_at: string; // ISO date string
}

// ─── Full Order Detail ───────────────────────────────────────────────────────
export interface Order {
  id: number;
  uuid: string;
  order_number: string;
  subtotal: string;
  discount_amount: string;
  shipping_amount: string;
  tax_amount: string;
  total: string;
  currency: string;
  discount_code?: string | null;
  loyalty_points_used: number;
  loyalty_discount_amount: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  fulfillment_status: FulfillmentStatus;
  payment_gateway?: string | null;
  tracking_number?: string | null;
  tracking_url?: string | null;
  shipping_carrier?: string | null;
  estimated_delivery?: string | null;
  delivered_at?: string | null;
  is_gift: boolean;
  gift_message?: string | null;
  notes?: string | null;
  created_at: string;
  items: OrderItem[];
  status_history: OrderStatusHistoryEntry[];
}

// ─── List Item (paginated list response items) ───────────────────────────────
export interface OrderListItem {
  uuid: string;
  order_number: string;
  total: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  created_at: string;
  items_count: number;
}

// ─── Paginated List Response ─────────────────────────────────────────────────
export interface OrderListResponse {
  items: OrderListItem[];
  total: number;
  page: number;
  page_size: number;
}

// ─── Request Payloads ────────────────────────────────────────────────────────
export interface CreateOrderPayload {
  addressId: string;
  discountCode?: string;
  loyaltyPointsToUse?: number;
  notes?: string;
  giftMessage?: string;
  buyNowVariantId?: number;
  buyNowQuantity?: number;
  paymentMethod?: string;  // "cod" | "razorpay"
}

export interface CreateOrderResponse {
  order_uuid: string;
  order_number: string;
  total: string;
  razorpay_order_id?: string | null;
  razorpay_key_id?: string | null;
}

export interface VerifyPaymentPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface CancelOrderPayload {
  reason: string;
}

export interface ReturnOrderPayload {
  reason: string;
  return_type?: string; // "refund" | "exchange"
  customer_note?: string;
}

// ─── Utility: cancellable and returnable statuses ────────────────────────────
export const CANCELLABLE_STATUSES: OrderStatus[] = ["order_placed", "payment_confirmed"];
export const RETURNABLE_STATUSES: OrderStatus[] = ["delivered"];
export const TRANSIT_STATUSES: OrderStatus[] = ["shipped", "out_for_delivery"];

// ─── Human-readable status labels & colours ──────────────────────────────────
export const ORDER_STATUS_META: Record<
  OrderStatus,
  { label: string; color: string; bg: string; emoji: string }
> = {
  order_placed:       { label: "Order Placed",       color: "#2563eb", bg: "rgba(37,99,235,0.1)",   emoji: "📦" },
  payment_confirmed:  { label: "Payment Confirmed",   color: "#00b566", bg: "rgba(0,181,102,0.1)",   emoji: "✅" },
  processing:         { label: "Processing",           color: "#d97706", bg: "rgba(217,119,6,0.1)",   emoji: "⚙️" },
  shipped:            { label: "Shipped",              color: "#7c3aed", bg: "rgba(124,58,237,0.1)",  emoji: "🚚" },
  out_for_delivery:   { label: "Out for Delivery",     color: "#db2777", bg: "rgba(219,39,119,0.1)", emoji: "🏃" },
  delivered:          { label: "Delivered",            color: "#059669", bg: "rgba(5,150,105,0.1)",   emoji: "🎉" },
  cancelled:          { label: "Cancelled",            color: "#dc2626", bg: "rgba(220,38,38,0.1)",   emoji: "❌" },
  return_requested:   { label: "Return Requested",     color: "#ea580c", bg: "rgba(234,88,12,0.1)",   emoji: "↩️" },
  refunded:           { label: "Refunded",             color: "#6b7280", bg: "rgba(107,114,128,0.1)", emoji: "💸" },
};
