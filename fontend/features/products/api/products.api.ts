import { api } from "@/lib/axios";

export interface ProductFilters {
  categorySlug?: string;
  collectionSlug?: string;
  productType?: string;
  minPrice?: number;
  maxPrice?: number;
  isPetFriendly?: boolean;
  isAirPurifying?: boolean;
  careSkill?: "beginner" | "intermediate" | "expert";
  sort?: "popularity" | "newest" | "price_asc" | "price_desc" | "rating" | "name_asc";
  page?: number;
  pageSize?: number;
  q?: string;
}

/** Maps the UI SortOption strings (from plp-data) to the API sort param */
export const SORT_OPTION_TO_API: Record<string, ProductFilters["sort"]> = {
  bestselling:   "popularity",
  "new-arrivals": "newest",
  "price-asc":   "price_asc",
  "price-desc":  "price_desc",
  "rating-desc": "rating",
  alphabetical:  "name_asc",
};

export const getProductsApi = async (filters: ProductFilters = {}) => {
  const res = await api.get("/products/", {
    params: {
      category_slug:    filters.categorySlug,
      collection_slug:  filters.collectionSlug,
      product_type:     filters.productType,
      min_price:        filters.minPrice,
      max_price:        filters.maxPrice,
      is_pet_friendly:  filters.isPetFriendly,
      is_air_purifying: filters.isAirPurifying,
      care_skill:       filters.careSkill,
      sort:             filters.sort ?? "popularity",
      page:             filters.page ?? 1,
      page_size:        filters.pageSize ?? 20,
      q:                filters.q,
    },
  });
  return res.data as {
    items: ApiProduct[];
    total: number;
    page: number;
    page_size: number;
    pages: number;
  };
};

// Minimal API product shape (matches backend ProductListItem schema)
export interface ApiProduct {
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
  images: { id: number; url: string; alt_text?: string; position: number; is_primary: boolean }[];
  variants: {
    id: number;
    option_name: string;
    price: number;
    sku: string;
    is_active: boolean;
    inventory?: {
      quantity: number;
      reserved: number;
      reorder_level: number;
      low_stock_alert: boolean;
      stock_policy: "deny" | "backorder" | "continue";
    };
  }[];
}

export interface ApiProductDetail {
  id: number;
  uuid: string;
  title: string;
  slug: string;
  short_description?: string;
  description?: string;
  botanical_name?: string;
  common_name?: string;
  product_type: string;
  base_price: number;
  compare_at_price?: number;
  discount_badge_text?: string;
  price_note?: string;
  is_taxable: boolean;
  tax_rate: number;
  care_light?: string;
  care_water?: string;
  care_temperature?: string;
  care_skill?: string;
  is_pet_friendly?: boolean;
  is_air_purifying?: boolean;
  delivery_eta_label?: string;
  health_guarantee_label?: string;
  packaging_label?: string;
  free_delivery_eligible: boolean;
  rating_average: number;
  rating_count: number;
  status: string;
  images: { id: number; url: string; alt_text?: string; position: number; is_primary: boolean }[];
  variants: {
    id: number;
    option_name: string;
    option_detail?: string;
    best_for?: string;
    pot_diameter?: string;
    dispatch_time?: string;
    price: number;
    compare_at_price?: number;
    sku: string;
    is_active: boolean;
    inventory?: {
      quantity: number;
      reserved: number;
      reorder_level: number;
      low_stock_alert: boolean;
      stock_policy: "deny" | "backorder" | "continue";
    };
  }[];
  care_cards: { id: number; icon?: string; title: string; value: string; detail?: string; difficulty_level: number }[];
  features: { feature: string }[];
  specifications: { label: string; value: string }[];
  pot_upsells: {
    id: number;
    plant_product_id: number;
    pot_product_id: number;
    pot_product: ApiProduct;
  }[];
}

export const getProductBySlugApi = async (slug: string): Promise<ApiProductDetail> => {
  const res = await api.get(`/products/${slug}`);
  return res.data;
};