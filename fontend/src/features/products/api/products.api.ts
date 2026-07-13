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
  sort?:
    | "popularity"
    | "newest"
    | "price_asc"
    | "price_desc"
    | "rating"
    | "name_asc";
  page?: number;
  pageSize?: number;
  q?: string;
}

export interface ProductListResponse {
  items: Product[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

export interface Product {
  uuid: string;
  slug: string;
  title: string;
  short_description?: string;
  price: number;
  sale_price?: number;
  images: ProductImage[];
  category_name?: string;
  average_rating?: number;
  review_count?: number;
  is_in_stock: boolean;
  is_pet_friendly?: boolean;
  care_skill?: string;
  is_featured?: boolean;
}

export interface ProductImage {
  url: string;
  alt?: string;
  is_primary: boolean;
}

// ─── Product Listing ──────────────────────────────────────────────────────────

export const getProductsApi = async (
  filters: ProductFilters = {}
): Promise<ProductListResponse> => {
  const res = await api.get("/products/", {
    params: {
      category_slug: filters.categorySlug,
      collection_slug: filters.collectionSlug,
      product_type: filters.productType,
      min_price: filters.minPrice,
      max_price: filters.maxPrice,
      is_pet_friendly: filters.isPetFriendly,
      is_air_purifying: filters.isAirPurifying,
      care_skill: filters.careSkill,
      sort: filters.sort ?? "popularity",
      page: filters.page ?? 1,
      page_size: filters.pageSize ?? 20,
      q: filters.q,
    },
  });
  return res.data;
};

// ─── Product Detail ───────────────────────────────────────────────────────────

export const getProductBySlugApi = async (slug: string) => {
  const res = await api.get(`/products/${slug}`);
  return res.data;
};

// ─── Categories ───────────────────────────────────────────────────────────────

export const getCategoriesApi = async () => {
  const res = await api.get("/categories/");
  return res.data;
};

// ─── Collections ──────────────────────────────────────────────────────────────

export const getCollectionsApi = async () => {
  const res = await api.get("/collections/");
  return res.data;
};

export const getCollectionProductsApi = async (slug: string) => {
  const res = await api.get(`/collections/${slug}`);
  return res.data;
};

// ─── Featured / Homepage ──────────────────────────────────────────────────────

export const getFeaturedProductsApi = async () => {
  const res = await api.get("/products/", {
    params: { sort: "popularity", page: 1, page_size: 8 },
  });
  return res.data;
};
