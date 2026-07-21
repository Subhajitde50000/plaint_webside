import { api } from "@/lib/axios";

export const createOrderApi = async (payload: {
  addressId: string;
  discountCode?: string;
  loyaltyPointsToUse?: number;
  notes?: string;
  giftMessage?: string;
  buyNowVariantId?: number;
  buyNowQuantity?: number;
}) => {
  const res = await api.post("/orders/", {
    address_id: payload.addressId,
    discount_code: payload.discountCode,
    loyalty_points_to_use: payload.loyaltyPointsToUse,
    notes: payload.notes, 
    gift_message: payload.giftMessage,
    buy_now_variant_id: payload.buyNowVariantId,
    buy_now_quantity: payload.buyNowQuantity,
  });
  return res.data;  // { order_id, order_number, total, razorpay_order_id, razorpay_key_id }
};

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

export const getMyOrdersApi = async (page = 1) => {
  const res = await api.get("/orders/", { params: { page } });
  return res.data;
};

export const getOrderApi = async (orderUuid: string) => {
  const res = await api.get(`/orders/${orderUuid}`);
  return res.data;
};

export const cancelOrderApi = async (orderUuid: string, reason: string) => {
  const res = await api.post(`/orders/${orderUuid}/cancel`, { reason });
  return res.data;
};

export const returnOrderApi = async (
  orderUuid: string,
  payload: { reason: string; return_type?: string; customer_note?: string }
) => {
  const res = await api.post(`/orders/${orderUuid}/return`, payload);
  return res.data;
};