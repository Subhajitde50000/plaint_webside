import { useQuery } from "@tanstack/react-query";
import { getWishlistApi, WishlistData } from "../api/profile.api";

export const WISHLIST_QUERY_KEY = ["wishlist"] as const;

/**
 * useWishlist — fetches the user's wishlist with product titles.
 * GET /customers/me/wishlist
 *
 * Usage:
 *   const { items, isInWishlist, isLoading } = useWishlist();
 *   const inList = isInWishlist(productId);
 */
export function useWishlist() {
  const query = useQuery<WishlistData>({
    queryKey: WISHLIST_QUERY_KEY,
    queryFn: getWishlistApi,
    staleTime: 1000 * 60 * 2,
  });

  const items = query.data?.items ?? [];

  /** Helper: check if a product is already in the wishlist */
  const isInWishlist = (productId: number) =>
    items.some((item) => item.product_id === productId);

  return {
    items,
    isInWishlist,
    isLoading: query.isLoading,
    error: (query.error as any)?.response?.data?.detail as string | undefined,
    refetch: query.refetch,
  };
}
