import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCartApi,
  addToCartApi,
  updateCartItemApi,
  removeCartItemApi,
  applyDiscountApi,
  removeDiscountApi,
} from "../api/cart.api";
import { useToast } from "@/hooks/useToast";
import { getErrorMessage } from "@/lib/errors";

const CART_KEY = ["cart"];

export function useCart() {
  const qc = useQueryClient();
  const { success, error: showError } = useToast();

  // ── Fetch cart ──────────────────────────────────────────────────────────────
  const cart = useQuery({
    queryKey: CART_KEY,
    queryFn: getCartApi,
    staleTime: 0, // always fresh
  });

  // ── Add item ────────────────────────────────────────────────────────────────
  const addItem = useMutation({
    mutationFn: ({
      variantId,
      quantity,
    }: {
      variantId: string;
      quantity: number;
    }) => addToCartApi(variantId, quantity),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CART_KEY });
      success("Added to cart! 🌿");
    },
    onError: (err) => showError(getErrorMessage(err)),
  });

  // ── Update item quantity ────────────────────────────────────────────────────
  const updateItem = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      updateCartItemApi(itemId, quantity),
    onSuccess: () => qc.invalidateQueries({ queryKey: CART_KEY }),
    onError: (err) => showError(getErrorMessage(err)),
  });

  // ── Remove item ─────────────────────────────────────────────────────────────
  const removeItem = useMutation({
    mutationFn: (itemId: string) => removeCartItemApi(itemId),
    onSuccess: () => qc.invalidateQueries({ queryKey: CART_KEY }),
    onError: (err) => showError(getErrorMessage(err)),
  });

  // ── Apply discount code ─────────────────────────────────────────────────────
  const applyDiscount = useMutation({
    mutationFn: (code: string) => applyDiscountApi(code),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CART_KEY });
      success("Discount applied! 🎉");
    },
    onError: (err) =>
      showError(
        (err as any)?.response?.data?.detail ?? "Invalid discount code"
      ),
  });

  // ── Remove discount ─────────────────────────────────────────────────────────
  const removeDiscount = useMutation({
    mutationFn: removeDiscountApi,
    onSuccess: () => qc.invalidateQueries({ queryKey: CART_KEY }),
  });

  return {
    cart: cart.data,
    isLoading: cart.isLoading,
    isError: cart.isError,
    // Item count for badge
    itemCount:
      cart.data?.items?.reduce(
        (sum: number, item: any) => sum + item.quantity,
        0
      ) ?? 0,
    addItem: addItem.mutate,
    updateItem: updateItem.mutate,
    removeItem: removeItem.mutate,
    applyDiscount: applyDiscount.mutate,
    removeDiscount: removeDiscount.mutate,
    isAddingItem: addItem.isPending,
    isUpdatingItem: updateItem.isPending,
    isRemovingItem: removeItem.isPending,
    isApplyingDiscount: applyDiscount.isPending,
    discountError: (applyDiscount.error as any)?.response?.data?.detail as
      | string
      | undefined,
  };
}
