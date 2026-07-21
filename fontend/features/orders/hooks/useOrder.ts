import { useQuery } from "@tanstack/react-query";
import { getOrderApi } from "../api/orders.api";
import type { Order, OrderStatus } from "../types/order.types";
import { TRANSIT_STATUSES } from "../types/order.types";

export function useOrder(orderUuid: string) {
  const query = useQuery<Order>({
    queryKey: ["order", orderUuid],
    queryFn: () => getOrderApi(orderUuid),
    enabled: !!orderUuid,
    staleTime: 10 * 1000, // 10 seconds
    refetchInterval: (q) => {
      const status = q.state.data?.status as OrderStatus | undefined;
      // Auto-poll every 30s while the order is in transit
      if (status && TRANSIT_STATUSES.includes(status)) return 30 * 1000;
      return false;
    },
  });

  return {
    order: query.data ?? null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: (query.error as any)?.response?.data?.detail ?? null,
    refetch: query.refetch,
  };
}
