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
    cost_price: (data.costPrice ?? data.costPerUnit ?? data.cost_price) ? Number(data.costPrice ?? data.costPerUnit ?? data.cost_price) : null,
    price_note: data.priceNote || data.price_note || null,
    is_taxable: data.isTaxable ?? data.is_taxable ?? true,
    tax_rate: data.taxRate ? parseFloat(String(data.taxRate).replace(/[^0-9.]/g, '')) : 18.00,
    care_light: data.careLight || data.lightRequirement || data.care_light || null,
    care_water: data.careWater || data.waterFrequency || data.care_water || null,
    care_temperature: data.careTemperature || data.temperatureRange || data.care_temperature || null,
    care_skill: normalizeCareSkill(data.careSkill ?? data.skillLevel ?? data.care_skill),
    is_pet_friendly: Boolean(data.isPetFriendly ?? data.petFriendly ?? data.is_pet_friendly ?? false),
    is_air_purifying: Boolean(data.isAirPurifying ?? data.airPurifying ?? data.is_air_purifying ?? false),
    delivery_eta_label: data.deliveryEta || data.delivery_eta_label || null,
    health_guarantee_label: data.healthGuarantee || data.health_guarantee_label || null,
    packaging_label: data.packagingLabel || data.packaging_label || null,
    free_delivery_eligible: data.freeDelivery ?? data.free_delivery_eligible ?? true,
    weight_grams: data.weight ? Number(data.weight) : null,
    length_cm: data.dimLength ? Number(data.dimLength) : null,
    width_cm: data.dimWidth ? Number(data.dimWidth) : null,
    height_cm: data.dimHeight ? Number(data.dimHeight) : null,
    seo_title: data.seoTitle || data.seo_title || null,
    seo_description: data.seoDescription || data.seo_description || null,
    status: data.status ?? "draft",
    variants: data.variants ? data.variants.map((v: any) => ({
      variant_type: String(data.variantType || "size").toLowerCase(),
      option_name: v.sizeName,
      option_detail: v.range || null,
      price: Number(v.price),
      compare_at_price: v.compareAtPrice ? Number(v.compareAtPrice) : null,
      sku: v.sku,
      stock: Number(v.stock || 0),
      best_for: v.bestFor || null,
      pot_diameter: v.potDiameter || null,
      dispatch_time: v.dispatch || null,
    })) : undefined
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
  if (data.categoryId !== undefined || data.category_id !== undefined) {
    payload.category_id = Number(data.categoryId ?? data.category_id);
  }
  if (data.shortDescription !== undefined || data.short_description !== undefined) {
    payload.short_description = data.shortDescription ?? data.short_description;
  }
  if (data.description !== undefined) payload.description = data.description;
  if (data.botanicalName !== undefined || data.botanical_name !== undefined) {
    payload.botanical_name = data.botanicalName ?? data.botanical_name;
  }
  if (data.commonName !== undefined || data.common_name !== undefined) {
    payload.common_name = data.commonName ?? data.common_name;
  }
  if (data.currentPrice !== undefined || data.basePrice !== undefined || data.base_price !== undefined) {
    payload.base_price = Number(data.currentPrice ?? data.basePrice ?? data.base_price);
  }
  if (data.compareAtPrice !== undefined || data.compare_at_price !== undefined) {
    payload.compare_at_price = (data.compareAtPrice ?? data.compare_at_price) !== null
      ? Number(data.compareAtPrice ?? data.compare_at_price)
      : null;
  }
  if (data.costPrice !== undefined || data.costPerUnit !== undefined || data.cost_price !== undefined) {
    const val = data.costPrice ?? data.costPerUnit ?? data.cost_price;
    payload.cost_price = val ? Number(val) : null;
  }
  if (data.priceNote !== undefined || data.price_note !== undefined) {
    payload.price_note = data.priceNote ?? data.price_note ?? null;
  }
  if (data.isTaxable !== undefined || data.is_taxable !== undefined) {
    payload.is_taxable = data.isTaxable ?? data.is_taxable;
  }
  if (data.taxRate !== undefined || data.tax_rate !== undefined) {
    const raw = data.taxRate ?? data.tax_rate;
    payload.tax_rate = raw ? parseFloat(String(raw).replace(/[^0-9.]/g, '')) : null;
  }
  if (data.careLight !== undefined || data.lightRequirement !== undefined || data.care_light !== undefined) {
    payload.care_light = data.careLight ?? data.lightRequirement ?? data.care_light ?? null;
  }
  if (data.careWater !== undefined || data.waterFrequency !== undefined || data.care_water !== undefined) {
    payload.care_water = data.careWater ?? data.waterFrequency ?? data.care_water ?? null;
  }
  if (data.careTemperature !== undefined || data.temperatureRange !== undefined || data.care_temperature !== undefined) {
    payload.care_temperature = data.careTemperature ?? data.temperatureRange ?? data.care_temperature ?? null;
  }
  if (data.status !== undefined) payload.status = data.status;
  if (data.careSkill !== undefined || data.skillLevel !== undefined || data.care_skill !== undefined) {
    payload.care_skill = normalizeCareSkill(data.careSkill ?? data.skillLevel ?? data.care_skill);
  }
  if (data.isPetFriendly !== undefined || data.petFriendly !== undefined || data.is_pet_friendly !== undefined) {
    payload.is_pet_friendly = data.isPetFriendly ?? data.petFriendly ?? data.is_pet_friendly;
  }
  if (data.isAirPurifying !== undefined || data.airPurifying !== undefined || data.is_air_purifying !== undefined) {
    payload.is_air_purifying = data.isAirPurifying ?? data.airPurifying ?? data.is_air_purifying;
  }
  if (data.deliveryEta !== undefined || data.delivery_eta_label !== undefined) {
    payload.delivery_eta_label = data.deliveryEta ?? data.delivery_eta_label ?? null;
  }
  if (data.healthGuarantee !== undefined || data.health_guarantee_label !== undefined) {
    payload.health_guarantee_label = data.healthGuarantee ?? data.health_guarantee_label ?? null;
  }
  if (data.packagingLabel !== undefined || data.packaging_label !== undefined) {
    payload.packaging_label = data.packagingLabel ?? data.packaging_label ?? null;
  }
  if (data.freeDelivery !== undefined || data.free_delivery_eligible !== undefined) {
    payload.free_delivery_eligible = data.freeDelivery ?? data.free_delivery_eligible;
  }
  if (data.weight !== undefined) payload.weight_grams = data.weight ? Number(data.weight) : null;
  if (data.dimLength !== undefined) payload.length_cm = data.dimLength ? Number(data.dimLength) : null;
  if (data.dimWidth !== undefined) payload.width_cm = data.dimWidth ? Number(data.dimWidth) : null;
  if (data.dimHeight !== undefined) payload.height_cm = data.dimHeight ? Number(data.dimHeight) : null;
  if (data.seoTitle !== undefined || data.seo_title !== undefined) {
    payload.seo_title = data.seoTitle ?? data.seo_title ?? null;
  }
  if (data.seoDescription !== undefined || data.seo_description !== undefined) {
    payload.seo_description = data.seoDescription ?? data.seo_description ?? null;
  }
  if (data.variants !== undefined) {
    payload.variants = data.variants.map((v: any) => ({
      variant_type: String(data.variantType || "size").toLowerCase(),
      option_name: v.sizeName,
      option_detail: v.range || null,
      price: Number(v.price),
      compare_at_price: v.compareAtPrice ? Number(v.compareAtPrice) : null,
      sku: v.sku,
      stock: Number(v.stock || 0),
      best_for: v.bestFor || null,
      pot_diameter: v.potDiameter || null,
      dispatch_time: v.dispatch || null,
    }));
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
