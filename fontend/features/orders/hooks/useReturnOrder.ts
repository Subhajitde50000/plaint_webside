import { useMutation, useQueryClient } from "@tanstack/react-query";
import { returnOrderApi } from "../api/orders.api";
import type { ReturnOrderPayload } from "../types/order.types";

export function useReturnOrder(orderUuid: string) {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: ReturnOrderPayload) => returnOrderApi(orderUuid, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["order", orderUuid] });
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  return {
    requestReturn: mutation.mutate,
    requestReturnAsync: mutation.mutateAsync,
    isRequesting: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: (mutation.error as any)?.response?.data?.detail ?? null,
  };
}
