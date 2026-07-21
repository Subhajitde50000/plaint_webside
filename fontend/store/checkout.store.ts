import { create } from "zustand";

export interface BuyNowItem {
  product_uuid?: string;
  variant_id: number;
  variant_uuid?: string;
  product_title: string;
  variant_title?: string;
  price: number;
  quantity: number;
  image_url?: string;
  options?: string;
}

interface CheckoutState {
  buyNowItem: BuyNowItem | null;
  setBuyNowItem: (item: BuyNowItem) => void;
  clearBuyNowItem: () => void;
}

const STORAGE_KEY = "plant_byst_buy_now_item";

const getInitialBuyNowItem = (): BuyNowItem | null => {
  if (typeof window !== "undefined") {
    try {
      const stored = window.sessionStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (_) {
      return null;
    }
  }
  return null;
};

export const useCheckoutStore = create<CheckoutState>((set) => ({
  buyNowItem: getInitialBuyNowItem(),
  setBuyNowItem: (item: BuyNowItem) => {
    if (typeof window !== "undefined") {
      try {
        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(item));
      } catch (_) {}
    }
    set({ buyNowItem: item });
  },
  clearBuyNowItem: () => {
    if (typeof window !== "undefined") {
      try {
        window.sessionStorage.removeItem(STORAGE_KEY);
      } catch (_) {}
    }
    set({ buyNowItem: null });
  },
}));
