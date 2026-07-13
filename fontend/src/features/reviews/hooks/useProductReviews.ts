import { useQuery } from "@tanstack/react-query";
import { getProductReviewsApi } from "../api/reviews.api";

export function useProductReviews(slug: string, page = 1, rating?: number) {
  return useQuery({
    queryKey: ["reviews", slug, page, rating],
    queryFn: () => getProductReviewsApi(slug, page, rating),
    enabled: !!slug,
    staleTime: 60 * 1000,
  });
}
