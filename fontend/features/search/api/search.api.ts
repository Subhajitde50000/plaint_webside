import { api } from "@/lib/axios";
import type { SearchQueryParams, SearchResponse } from "../types/search.types";

export const searchProductsApi = async (params: SearchQueryParams): Promise<SearchResponse> => {
  const queryObj: Record<string, any> = {};
  if (params.q) queryObj.q = params.q;
  if (params.category) queryObj.category = params.category;
  if (params.min_price !== undefined) queryObj.min_price = params.min_price;
  if (params.max_price !== undefined) queryObj.max_price = params.max_price;
  if (params.in_stock !== undefined) queryObj.in_stock = params.in_stock;
  if (params.min_rating !== undefined) queryObj.min_rating = params.min_rating;
  if (params.sort_by) queryObj.sort_by = params.sort_by;
  if (params.page) queryObj.page = params.page;
  if (params.page_size) queryObj.page_size = params.page_size;

  const res = await api.get("/search/", { params: queryObj });
  return res.data;
};
