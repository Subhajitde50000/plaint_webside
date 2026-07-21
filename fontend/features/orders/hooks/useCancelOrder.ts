import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelOrderApi } from "../api/orders.api";

export function useCancelOrder(orderUuid: string) {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: (reason: string) => cancelOrderApi(orderUuid, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["order", orderUuid] });
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  return {
    cancelOrder: mutation.mutate,
    cancelOrderAsync: mutation.mutateAsync,
    isCancelling: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: (mutation.error as any)?.response?.data?.detail ?? null,
  };
}
