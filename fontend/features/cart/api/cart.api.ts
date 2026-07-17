import { api } from "@/lib/axios";

export const getCartApi = async () => {
  const res = await api.get("/cart/");
  return res.data;
};

export const addToCartApi = async (variantId: string, quantity: number) => {
  const res = await api.post("/cart/items/", { variant_id: variantId, quantity });
  return res.data;
};

export const updateCartItemApi = async (itemId: string, quantity: number) => {
  const res = await api.patch(`/cart/items/${itemId}`, { quantity });
  return res.data;
};

export const removeCartItemApi = async (itemId: string) => {
  const res = await api.delete(`/cart/items/${itemId}`);
  return res.data;
};

export const applyDiscountApi = async (code: string) => {
  const res = await api.post("/cart/apply-discount", { code });
  return res.data;
};

export const removeDiscountApi = async () => {
  const res = await api.delete("/cart/remove-discount");
  return res.data;
};