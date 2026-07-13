import { api } from "@/lib/axios";

// ─── Create Order ─────────────────────────────────────────────────────────────

export const createOrderApi = async (payload: {
  addressId: string;
  discountCode?: string;
  loyaltyPointsToUse?: number;
  notes?: string;
  giftMessage?: string;
}) => {
  const res = await api.post("/orders/", {
    address_id: payload.addressId,
    discount_code: payload.discountCode,
    loyalty_points_to_use: payload.loyaltyPointsToUse,
    notes: payload.notes,
    gift_message: payload.giftMessage,
  });
  // Returns: { order_id, order_number, total, razorpay_order_id, razorpay_key_id }
  return res.data;
};

// ─── Verify Payment ───────────────────────────────────────────────────────────

export const verifyPaymentApi = async (
  orderUuid: string,
  razorpayData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }
) => {
  const res = await api.post(`/orders/${orderUuid}/verify-payment`, razorpayData);
  return res.data;
};

// ─── List My Orders ───────────────────────────────────────────────────────────

export const getMyOrdersApi = async (page = 1, status?: string) => {
  const res = await api.get("/orders/", { params: { page, status } });
  return res.data;
};

// ─── Order Detail ─────────────────────────────────────────────────────────────

export const getOrderApi = async (orderUuid: string) => {
  const res = await api.get(`/orders/${orderUuid}`);
  return res.data;
};

// ─── Cancel Order ─────────────────────────────────────────────────────────────

export const cancelOrderApi = async (orderUuid: string, reason: string) => {
  const res = await api.post(`/orders/${orderUuid}/cancel`, { reason });
  return res.data;
};

// ─── Return Request ───────────────────────────────────────────────────────────

export const createReturnApi = async (
  orderUuid: string,
  data: { reason: string; return_type: "refund" | "exchange" }
) => {
  const res = await api.post(`/orders/${orderUuid}/return`, data);
  return res.data;
};
