import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeFromWishlistApi } from "../api/profile.api";
import { WISHLIST_QUERY_KEY } from "./useWishlist";

/**
 * useRemoveWishlist — removes a product from the wishlist.
 * DELETE /customers/me/wishlist/{product_id}
 *
 * Usage:
 *   const { removeFromWishlist, isLoading, removingId } = useRemoveWishlist();
 *   removeFromWishlist(42); // pass productId
 */
export function useRemoveWishlist() {
  const queryClient = useQueryClient();

  const mutation = useMutation<void, Error, number>({
    mutationFn: removeFromWishlistApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
    },
  });

  return {
    removeFromWishlist: (productId: number) => mutation.mutate(productId),
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    /** The productId currently being removed — useful for per-item loading state */
    removingId: mutation.isPending ? mutation.variables : null,
    error: (mutation.error as any)?.response?.data?.detail as string | undefined,
  };
}
