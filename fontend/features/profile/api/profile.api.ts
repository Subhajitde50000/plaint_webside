import { api } from "@/lib/axios";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CustomerProfile {
  id: number;
  uuid: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  avatar_url?: string | null;
  email_verified: number;
  is_blocked: boolean;
  created_at: string;
}

export interface UpdateProfilePayload {
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar_url?: string;
  about?: string | null;
}

export interface Address {
  id: number;
  user_id: number;
  label?: string;
  recipient_name: string;
  phone: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  pincode: string;
  country: string;
  is_default: boolean;
  is_active: boolean;
}

export interface CreateAddressPayload {
  label?: string;
  recipient_name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
  is_default?: boolean;
}

export interface LoyaltyData {
  points_balance: number;
  tier: string;
  lifetime_points: number;
  tier_updated_at?: string | null;
  recent_transactions: Array<{
    type: string;
    points: number;
    description?: string;
    created_at: string;
  }>;
}

export interface WishlistItem {
  id: number;
  product_id: number;
  variant_id?: number | null;
  added_at: string;
  product_title?: string | null;
}

export interface WishlistData {
  items: WishlistItem[];
}

export interface UserPlant {
  id: number;
  user_id: number;
  product_id?: number | null;
  nickname: string;
  species?: string | null;
  acquired_at?: string | null;
  location?: string | null;
  watering_interval_days?: number | null;
  last_watered_at?: string | null;
  next_water_due?: string | null;
  notes?: string | null;
  image_url?: string | null;
}

export interface CreatePlantPayload {
  nickname: string;
  product_id?: number;
  species?: string;
  acquired_at?: string;
  location?: string;
  watering_interval_days?: number;
  notes?: string;
  image_url?: string;
}

export interface UpdatePlantPayload {
  nickname?: string;
  species?: string;
  location?: string;
  watering_interval_days?: number;
  notes?: string;
  image_url?: string;
}

export interface AddCareLogPayload {
  type: "watered" | "fertilized" | "repotted" | "pruned" | "other";
  note?: string;
  logged_at?: string; // ISO date string
}

export interface PlantCareLog {
  id: number;
  plant_id: number;
  type: string;
  note?: string | null;
  logged_at?: string | null;
  created_at: string;
}

// ─── API Functions ─────────────────────────────────────────────────────────────

/** GET /customers/me */
export const getMeApi = async (): Promise<CustomerProfile> => {
  const res = await api.get("/customers/me");
  return res.data;
};

/** PATCH /customers/me */
export const updateProfileApi = async (payload: UpdateProfilePayload): Promise<{ message: string }> => {
  const res = await api.patch("/customers/me", payload);
  return res.data;
};

/** GET /customers/me/addresses */
export const getAddressesApi = async (): Promise<Address[]> => {
  const res = await api.get("/customers/me/addresses");
  return res.data;
};

/** POST /customers/me/addresses */
export const addAddressApi = async (payload: CreateAddressPayload): Promise<Address> => {
  const res = await api.post("/customers/me/addresses", payload);
  return res.data;
};

/** PATCH /customers/me/addresses/{id} */
export const updateAddressApi = async (id: number, payload: Partial<CreateAddressPayload>): Promise<Address> => {
  const res = await api.patch(`/customers/me/addresses/${id}`, payload);
  return res.data;
};

/** DELETE /customers/me/addresses/{id} */
export const deleteAddressApi = async (id: number): Promise<void> => {
  await api.delete(`/customers/me/addresses/${id}`);
};

/** GET /customers/me/loyalty */
export const getLoyaltyApi = async (): Promise<LoyaltyData> => {
  const res = await api.get("/customers/me/loyalty");
  return res.data;
};

/** GET /customers/me/wishlist */
export const getWishlistApi = async (): Promise<WishlistData> => {
  const res = await api.get("/customers/me/wishlist");
  return res.data;
};

/** POST /customers/me/wishlist/{product_id} */
export const addToWishlistApi = async (productId: number): Promise<{ message: string }> => {
  const res = await api.post(`/customers/me/wishlist/${productId}`);
  return res.data;
};

/** DELETE /customers/me/wishlist/{product_id} */
export const removeFromWishlistApi = async (productId: number): Promise<void> => {
  await api.delete(`/customers/me/wishlist/${productId}`);
};

/** GET /customers/me/plants */
export const getMyPlantsApi = async (): Promise<UserPlant[]> => {
  const res = await api.get("/customers/me/plants");
  return res.data;
};

/** POST /customers/me/plants */
export const addPlantApi = async (payload: CreatePlantPayload): Promise<UserPlant> => {
  const res = await api.post("/customers/me/plants", payload);
  return res.data;
};

/** POST /customers/me/plants/{id}/log */
export const addPlantLogApi = async (plantId: number, payload: AddCareLogPayload): Promise<PlantCareLog> => {
  const res = await api.post(`/customers/me/plants/${plantId}/log`, payload);
  return res.data;
};
