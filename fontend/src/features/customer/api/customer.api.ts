import { api } from "@/lib/axios";

// ─── Profile ──────────────────────────────────────────────────────────────────

export const getProfileApi = async () => {
  const res = await api.get("/customers/me");
  return res.data;
};

export const updateProfileApi = async (data: {
  firstName?: string;
  lastName?: string;
  phone?: string;
  dob?: string;
  aboutMe?: string;
}) => {
  const res = await api.patch("/customers/me", {
    first_name: data.firstName,
    last_name: data.lastName,
    phone: data.phone,
    dob: data.dob,
    about_me: data.aboutMe,
  });
  return res.data;
};

// ─── Addresses ────────────────────────────────────────────────────────────────

export const getAddressesApi = async () => {
  const res = await api.get("/customers/me/addresses");
  return res.data;
};

export const addAddressApi = async (address: {
  type: "home" | "work" | "other";
  label?: string;
  recipientName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}) => {
  const res = await api.post("/customers/me/addresses", {
    type: address.type,
    label: address.label,
    recipient_name: address.recipientName,
    phone: address.phone,
    line1: address.line1,
    line2: address.line2,
    city: address.city,
    state: address.state,
    pincode: address.pincode,
    is_default: address.isDefault,
  });
  return res.data;
};

export const updateAddressApi = async (
  id: string,
  address: Partial<Parameters<typeof addAddressApi>[0]>
) => {
  const res = await api.patch(`/customers/me/addresses/${id}`, {
    type: address.type,
    label: address.label,
    recipient_name: address.recipientName,
    phone: address.phone,
    line1: address.line1,
    line2: address.line2,
    city: address.city,
    state: address.state,
    pincode: address.pincode,
    is_default: address.isDefault,
  });
  return res.data;
};

export const deleteAddressApi = async (id: string) => {
  const res = await api.delete(`/customers/me/addresses/${id}`);
  return res.data;
};

// ─── Loyalty ──────────────────────────────────────────────────────────────────

export const getLoyaltyApi = async () => {
  const res = await api.get("/customers/me/loyalty");
  // Returns: { points_balance, tier, lifetime_points, next_tier, points_to_next }
  return res.data;
};

// ─── Wishlist ─────────────────────────────────────────────────────────────────

export const getWishlistApi = async () => {
  const res = await api.get("/customers/me/wishlist");
  return res.data;
};

export const addToWishlistApi = async (productId: string) => {
  const res = await api.post(`/customers/me/wishlist/${productId}`);
  return res.data;
};

export const removeFromWishlistApi = async (productId: string) => {
  const res = await api.delete(`/customers/me/wishlist/${productId}`);
  return res.data;
};

// ─── My Plants Diary ──────────────────────────────────────────────────────────

export const getMyPlantsApi = async () => {
  const res = await api.get("/customers/me/plants");
  return res.data;
};

export const addPlantApi = async (data: {
  productId?: string;
  nickname: string;
  notes?: string;
}) => {
  const res = await api.post("/customers/me/plants", {
    product_id: data.productId,
    nickname: data.nickname,
    notes: data.notes,
  });
  return res.data;
};

export const addPlantLogApi = async (
  plantId: string,
  data: { type: string; note?: string }
) => {
  const res = await api.post(`/customers/me/plants/${plantId}/log`, data);
  return res.data;
};
