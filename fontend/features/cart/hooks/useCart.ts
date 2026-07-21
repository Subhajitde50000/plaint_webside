import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth.store";
import {
  getCartApi, addToCartApi, updateCartItemApi,
  removeCartItemApi, applyDiscountApi, removeDiscountApi,
} from "../api/cart.api";

const CART_KEY = ["cart"];

export function useCart() {
  const qc = useQueryClient();
  const { isAuthenticated } = useAuthStore();

  // Fetch cart
  const cart = useQuery({
    queryKey: CART_KEY,
    queryFn: getCartApi,
    staleTime: 0,  // always fresh
    enabled: isAuthenticated,
  });

  // Add item — invalidates cart after success
  const addItem = useMutation({
    mutationFn: ({ variantId, quantity }: { variantId: string; quantity: number }) =>
      addToCartApi(variantId, quantity),
    onSuccess: () => qc.invalidateQueries({ queryKey: CART_KEY }),
  });

  // Update item quantity
  const updateItem = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      updateCartItemApi(itemId, quantity),
    onSuccess: () => qc.invalidateQueries({ queryKey: CART_KEY }),
  });

  // Remove item
  const removeItem = useMutation({
    mutationFn: (itemId: string) => removeCartItemApi(itemId),
    onSuccess: () => qc.invalidateQueries({ queryKey: CART_KEY }),
  });

  // Apply discount
  const applyDiscount = useMutation({
    mutationFn: (code: string) => applyDiscountApi(code),
    onSuccess: () => qc.invalidateQueries({ queryKey: CART_KEY }),
  });

  // Remove discount
  const removeDiscount = useMutation({
    mutationFn: removeDiscountApi,
    onSuccess: () => qc.invalidateQueries({ queryKey: CART_KEY }),
  });

  return {
    cart: cart.data,
    isLoading: cart.isLoading,
    addItem: addItem.mutate,
    updateItem: updateItem.mutate,
    removeItem: removeItem.mutate,
    applyDiscount: applyDiscount.mutate,
    removeDiscount: removeDiscount.mutate,
    discountError: (applyDiscount.error as any)?.response?.data?.detail,
    isAddingItem: addItem.isPending,
  };
}