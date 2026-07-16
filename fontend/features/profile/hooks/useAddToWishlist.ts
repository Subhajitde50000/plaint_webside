import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToWishlistApi } from "../api/profile.api";
import { WISHLIST_QUERY_KEY } from "./useWishlist";

/**
 * useAddToWishlist — adds a product to the wishlist.
 * POST /customers/me/wishlist/{product_id}
 *
 * Usage:
 *   const { addToWishlist, isLoading } = useAddToWishlist();
 *   addToWishlist(42); // pass productId
 */
export function useAddToWishlist() {
  const queryClient = useQueryClient();

  const mutation = useMutation<{ message: string }, Error, number>({
    mutationFn: addToWishlistApi,
    onSuccess: () => {
      // Refetch wishlist so isInWishlist() stays in sync
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
    },
  });

  return {
    addToWishlist: (productId: number) => mutation.mutate(productId),
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: (mutation.error as any)?.response?.data?.detail as string | undefined,
  };
}
