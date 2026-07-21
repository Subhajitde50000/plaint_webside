import { adminApi } from "@/lib/admin-axios";

export interface AdminProductFilters {
  status?: "draft" | "active" | "archived" | string;
  categoryId?: number;
  productType?: string;
  q?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
}

export interface AdminProductImage {
  id: number;
  url: string;
  alt_text?: string;
  position: number;
  is_primary: boolean;
}

export interface AdminProductListItem {
  id: number;
  uuid: string;
  title: string;
  slug: string;
  short_description?: string;
  base_price: number;
  compare_at_price?: number;
  discount_badge_text?: string;
  product_type: string;
  care_skill?: string;
  is_pet_friendly?: boolean;
  is_air_purifying?: boolean;
  rating_average: number;
  rating_count: number;
  status: string;
  images: AdminProductImage[];
  created_at?: string;
  updated_at?: string;
}

export interface AdminProductListResponse {
  items: AdminProductListItem[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

const CARE_SKILL_VALUES = {
  beginner: "beginner",
  easy: "beginner",
  intermediate: "intermediate",
  expert: "expert",
} as const;

const normalizeCareSkill = (value: unknown): string | undefined => {
  if (typeof value !== "string" || !value.trim()) return undefined;
  return CARE_SKILL_VALUES[value.trim().toLowerCase() as keyof typeof CARE_SKILL_VALUES];
};

export const getAdminProductsApi = async (
  filters: AdminProductFilters = {}
): Promise<AdminProductListResponse> => {
  const res = await adminApi.get("/admin/products/", {
    params: {
      status: filters.status && filters.status !== "all" ? filters.status : undefined,
      category_id: filters.categoryId,
      product_type: filters.productType,
      search: filters.q,
      page: filters.page ?? 1,
      page_size: filters.pageSize ?? 25,
    },
  });
  return res.data;
};

export const getAdminProductApi = async (productId: string | number) => {
  const res = await adminApi.get(`/admin/products/${productId}`);
  return res.data;
};

export const createProductApi = async (data: Record<string, any>) => {
  const payload = {
    category_id: Number(data.categoryId || data.category_id || 1),
    product_type: String(data.productType || data.product_type || "plant").toLowerCase(),
    title: data.title,
    slug: data.slug || (data.title ? data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : `product-${Date.now()}`),
    short_description: data.shortDescription || data.short_description || "",
    description: data.description || "",
    botanical_name: data.botanicalName || data.botanical_name || "",
    common_name: data.commonName || data.common_name || "",
    base_price: Number(data.currentPrice ?? data.basePrice ?? data.base_price ?? 0),
    compare_at_price: (data.compareAtPrice ?? data.compare_at_price) ? Number(data.compareAtPrice ?? data.compare_at_price) : null,
    cost_price: (data.costPrice ?? data.cost_price) ? Number(data.costPrice ?? data.cost_price) : null,
    care_skill: normalizeCareSkill(data.careSkill ?? data.care_skill),
    is_pet_friendly: Boolean(data.isPetFriendly ?? data.is_pet_friendly ?? false),
    is_air_purifying: Boolean(data.isAirPurifying ?? data.is_air_purifying ?? false),
    status: data.status ?? "draft",
  };

  const res = await adminApi.post("/admin/products/", payload);
  return res.data;
};

export const updateProductApi = async (
  productId: string | number,
  data: Record<string, any>
) => {
  const payload: Record<string, any> = {};
  if (data.title !== undefined) payload.title = data.title;
  if (data.slug !== undefined) payload.slug = data.slug;
  if (data.shortDescription !== undefined || data.short_description !== undefined) {
    payload.short_description = data.shortDescription ?? data.short_description;
  }
  if (data.description !== undefined) payload.description = data.description;
  if (data.currentPrice !== undefined || data.basePrice !== undefined || data.base_price !== undefined) {
    payload.base_price = Number(data.currentPrice ?? data.basePrice ?? data.base_price);
  }
  if (data.compareAtPrice !== undefined || data.compare_at_price !== undefined) {
    payload.compare_at_price = (data.compareAtPrice ?? data.compare_at_price) !== null 
      ? Number(data.compareAtPrice ?? data.compare_at_price) 
      : null;
  }
  if (data.status !== undefined) payload.status = data.status;
  if (data.careSkill !== undefined || data.care_skill !== undefined) {
    payload.care_skill = normalizeCareSkill(data.careSkill ?? data.care_skill);
  }
  if (data.isPetFriendly !== undefined || data.is_pet_friendly !== undefined) {
    payload.is_pet_friendly = data.isPetFriendly ?? data.is_pet_friendly;
  }
  if (data.isAirPurifying !== undefined || data.is_air_purifying !== undefined) {
    payload.is_air_purifying = data.isAirPurifying ?? data.is_air_purifying;
  }

  const res = await adminApi.put(`/admin/products/${productId}`, payload);
  return res.data;
};

export const deleteProductApi = async (productId: string | number) => {
  const res = await adminApi.delete(`/admin/products/${productId}`);
  return res.data;
};

export const uploadProductImageApi = async (
  productId: string | number,
  file: File,
  isPrimary: boolean = false
) => {
  const form = new FormData();
  form.append("file", file);
  const res = await adminApi.post(`/admin/products/${productId}/images?is_primary=${isPrimary}`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteProductImageApi = async (
  productId: string | number,
  imageId: string | number
) => {
  const res = await adminApi.delete(
    `/admin/products/${productId}/images/${imageId}`
  );
  return res.data;
};
