import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrderApi } from "../api/orders.api";
import type { CreateOrderPayload } from "../types/order.types";

export function useCreateOrder() {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: CreateOrderPayload) => createOrderApi(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  return {
    createOrder: mutation.mutate,
    createOrderAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
    error: (mutation.error as any)?.response?.data?.detail ?? null,
  };
}
