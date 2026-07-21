"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createOrderApi, verifyPaymentApi } from "../api/orders.api";
import type { CreateOrderPayload, CreateOrderResponse } from "../types/order.types";

// ─── Razorpay SDK loader ──────────────────────────────────────────────────────
function loadRazorpayScript(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if ((window as any).Razorpay) return Promise.resolve(true);

  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// ─── Open Razorpay modal, returns payment data on success ────────────────────
function openRazorpayModal(options: Record<string, unknown>): Promise<Record<string, string>> {
  return new Promise((resolve, reject) => {
    const rzp = new (window as any).Razorpay({
      ...options,
      handler: (paymentData: Record<string, string>) => {
        resolve(paymentData);
      },
      modal: {
        ondismiss: () => reject(new Error("Payment was cancelled")),
      },
    });
    rzp.on("payment.failed", (response: any) => {
      reject(new Error(response?.error?.description ?? "Payment failed"));
    });
    rzp.open();
  });
}

import { useCheckoutStore } from "@/store/checkout.store";

// ─── Main checkout orchestrator ───────────────────────────────────────────────
export function useCheckout() {
  const router = useRouter();
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: CreateOrderPayload): Promise<{ order_uuid: string; order_number: string }> => {
      // 1. Create order on backend → get Razorpay order ID
      const order: CreateOrderResponse = await createOrderApi(payload);

      // 2. COD or no Razorpay order — skip payment modal
      if (!order.razorpay_order_id) {
        return { order_uuid: order.order_uuid, order_number: order.order_number };
      }

      // 3. Load Razorpay SDK
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        throw new Error("Unable to load payment gateway. Please check your connection.");
      }

      // Prefer key from response, fallback to env var
      const keyId =
        order.razorpay_key_id ||
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

      if (!keyId) {
        throw new Error("Payment gateway is not configured. Please contact support.");
      }

      // 4. Open Razorpay checkout modal
      const paymentData = await openRazorpayModal({
        key: keyId,
        amount: Math.round(parseFloat(order.total) * 100), // convert ₹ to paise
        currency: "INR",
        order_id: order.razorpay_order_id,
        name: "Hero Plants",
        description: `Order #${order.order_number}`,
        image: "/logo.png",
        theme: { color: "#00b566" },
      });

      // 5. Verify signature with backend
      await verifyPaymentApi(order.order_uuid, {
        razorpay_order_id: paymentData.razorpay_order_id,
        razorpay_payment_id: paymentData.razorpay_payment_id,
        razorpay_signature: paymentData.razorpay_signature,
      });

      return { order_uuid: order.order_uuid, order_number: order.order_number };
    },

    onSuccess: (data) => {
      // Clear temporary Buy Now item and cart cache
      useCheckoutStore.getState().clearBuyNowItem();
      qc.invalidateQueries({ queryKey: ["cart"] });
      qc.invalidateQueries({ queryKey: ["orders"] });
      router.push(`/orders/${data.order_uuid}/success`);
    },
  });

  return {
    placeOrder: mutation.mutate,
    placeOrderAsync: mutation.mutateAsync,
    isPlacing: mutation.isPending,
    isSuccess: mutation.isSuccess,
    // Prefer backend detail message, else JS Error message
    error:
      (mutation.error as any)?.response?.data?.detail ??
      (mutation.error as Error)?.message ??
      null,
  };
}
