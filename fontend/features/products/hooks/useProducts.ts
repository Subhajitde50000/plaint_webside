import { useQuery } from "@tanstack/react-query";
import { getProductsApi, ProductFilters } from "../api/products.api";

export function useProducts(filters: ProductFilters) {
  return useQuery({
    queryKey: ["products", filters],            // re-fetches when filters change
    queryFn: () => getProductsApi(filters),
    staleTime: 2 * 60 * 1000,                  // 2 min cache
    placeholderData: (prev) => prev,            // keep old data while loading new
  });
}