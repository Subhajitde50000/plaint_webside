import { useQuery } from "@tanstack/react-query";
import { getProductBySlugApi } from "../api/products.api";

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => getProductBySlugApi(slug),
    staleTime: 60 * 1000, // 1 min
    enabled: !!slug,
  });
}
