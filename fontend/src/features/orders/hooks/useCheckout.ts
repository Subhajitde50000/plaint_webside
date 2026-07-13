import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createOrderApi, verifyPaymentApi } from "../api/orders.api";
import { useToast } from "@/hooks/useToast";
import { getErrorMessage } from "@/lib/errors";

// Opens Razorpay modal and returns a Promise that resolves on payment success
function openRazorpay(options: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const rzpOptions = {
      ...options,
      modal: {
        ondismiss: () => reject(new Error("Payment dismissed")),
      },
      handler: async (paymentData: any) => {
        resolve(paymentData);
      },
    };
    const rzp = new (window as any).Razorpay(rzpOptions);
    rzp.on("payment.failed", (response: any) => reject(response.error));
    rzp.open();
  });
}

export function useCheckout() {
  const router = useRouter();
  const qc = useQueryClient();
  const { error: showError } = useToast();

  const checkout = useMutation({
    mutationFn: createOrderApi,

    onSuccess: async (data) => {
      try {
        // Open Razorpay payment modal
        const paymentData = await openRazorpay({
          key: data.razorpay_key_id,
          amount: Math.round(Number(data.total) * 100), // convert to paise
          currency: "INR",
          order_id: data.razorpay_order_id,
          name: "Hero Plants",
          description: `Order ${data.order_number}`,
          theme: { color: "#00b566" },
          prefill: {
            name: data.customer_name,
            email: data.customer_email,
            contact: data.customer_phone,
          },
        });

        // Verify payment with backend
        await verifyPaymentApi(data.order_id, {
          razorpay_order_id: paymentData.razorpay_order_id,
          razorpay_payment_id: paymentData.razorpay_payment_id,
          razorpay_signature: paymentData.razorpay_signature,
        });

        // Clear cart + navigate to success page
        qc.invalidateQueries({ queryKey: ["cart"] });
        router.push(`/orders/${data.order_id}/success`);
      } catch (paymentError: any) {
        if (paymentError?.message !== "Payment dismissed") {
          showError("Payment failed. Please try again.");
        }
      }
    },

    onError: (err) => showError(getErrorMessage(err)),
  });

  return {
    placeOrder: checkout.mutate,
    isPlacing: checkout.isPending,
    error: (checkout.error as any)?.response?.data?.detail as
      | string
      | undefined,
  };
}
