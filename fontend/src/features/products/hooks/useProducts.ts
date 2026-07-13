import { useQuery } from "@tanstack/react-query";
import {
  getProductsApi,
  ProductFilters,
  ProductListResponse,
} from "../api/products.api";

export function useProducts(filters: ProductFilters) {
  return useQuery<ProductListResponse>({
    queryKey: ["products", filters],
    queryFn: () => getProductsApi(filters),
    staleTime: 2 * 60 * 1000, // 2 min cache
    placeholderData: (prev) => prev, // keep old data while loading new page
  });
}
