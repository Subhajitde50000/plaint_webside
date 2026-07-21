export interface SearchProduct {
  id: number;
  uuid: string;
  title: string;
  slug: string;
  botanical_name?: string | null;
  common_name?: string | null;
  short_description?: string | null;
  base_price: number;
  compare_at_price?: number | null;
  rating_average: number;
  rating_count: number;
  primary_image?: string | null;
  product_type?: string | null;
  in_stock: boolean;
}

export interface SearchCategory {
  id: number;
  name: string;
  slug: string;
  product_count: number;
}

export interface SearchResponse {
  items: SearchProduct[];
  categories: SearchCategory[];
  suggestions: string[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  query: string;
}

export interface SearchQueryParams {
  q?: string;
  category?: string;
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
  min_rating?: number;
  sort_by?: "relevance" | "popularity" | "price_asc" | "price_desc" | "newest" | "rating";
  page?: number;
  page_size?: number;
}
