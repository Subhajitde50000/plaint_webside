import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getWishlistApi,
  addToWishlistApi,
  removeFromWishlistApi,
} from "../api/customer.api";

const WISHLIST_KEY = ["wishlist"];

export function useWishlist() {
  const qc = useQueryClient();

  const wishlist = useQuery({
    queryKey: WISHLIST_KEY,
    queryFn: getWishlistApi,
    staleTime: 2 * 60 * 1000,
  });

  // Add — uses optimistic update for instant heart toggle
  const add = useMutation({
    mutationFn: addToWishlistApi,
    onMutate: async (productId) => {
      await qc.cancelQueries({ queryKey: WISHLIST_KEY });
      const prev = qc.getQueryData(WISHLIST_KEY);
      qc.setQueryData(WISHLIST_KEY, (old: any) => ({
        ...old,
        items: [...(old?.items ?? []), { product_id: productId }],
      }));
      return { prev };
    },
    onError: (_, __, ctx) => qc.setQueryData(WISHLIST_KEY, ctx?.prev),
    onSettled: () => qc.invalidateQueries({ queryKey: WISHLIST_KEY }),
  });

  // Remove — also optimistic
  const remove = useMutation({
    mutationFn: removeFromWishlistApi,
    onMutate: async (productId) => {
      await qc.cancelQueries({ queryKey: WISHLIST_KEY });
      const prev = qc.getQueryData(WISHLIST_KEY);
      qc.setQueryData(WISHLIST_KEY, (old: any) => ({
        ...old,
        items: (old?.items ?? []).filter(
          (i: any) => i.product_id !== productId
        ),
      }));
      return { prev };
    },
    onError: (_, __, ctx) => qc.setQueryData(WISHLIST_KEY, ctx?.prev),
    onSettled: () => qc.invalidateQueries({ queryKey: WISHLIST_KEY }),
  });

  const isWishlisted = (productId: string) =>
    (wishlist.data?.items ?? []).some(
      (i: any) => i.product_id === productId
    );

  const toggle = (productId: string) => {
    if (isWishlisted(productId)) {
      remove.mutate(productId);
    } else {
      add.mutate(productId);
    }
  };

  return {
    wishlist: wishlist.data,
    items: wishlist.data?.items ?? [],
    isLoading: wishlist.isLoading,
    isWishlisted,
    toggle, // single toggle function for heart button
    addToWishlist: add.mutate,
    removeFromWishlist: remove.mutate,
    isAdding: add.isPending,
    isRemoving: remove.isPending,
  };
}
