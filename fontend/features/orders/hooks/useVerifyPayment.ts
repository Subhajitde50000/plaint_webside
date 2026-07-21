import { useMutation, useQueryClient } from "@tanstack/react-query";
import { verifyPaymentApi } from "../api/orders.api";
import type { VerifyPaymentPayload } from "../types/order.types";

export function useVerifyPayment() {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      orderUuid,
      payload,
    }: {
      orderUuid: string;
      payload: VerifyPaymentPayload;
    }) => verifyPaymentApi(orderUuid, payload),
    onSuccess: (_data, variables) => {
      // Invalidate cart (cleared after payment) and the specific order
      qc.invalidateQueries({ queryKey: ["cart"] });
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: ["order", variables.orderUuid] });
    },
  });

  return {
    verifyPayment: mutation.mutate,
    verifyPaymentAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: (mutation.error as any)?.response?.data?.detail ?? null,
  };
}
