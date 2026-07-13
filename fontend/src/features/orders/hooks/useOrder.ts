import { useQuery } from "@tanstack/react-query";
import { getOrderApi } from "../api/orders.api";

const IN_TRANSIT_STATUSES = ["dispatched", "in_transit", "out_for_delivery"];

export function useOrder(orderUuid: string) {
  return useQuery({
    queryKey: ["order", orderUuid],
    queryFn: () => getOrderApi(orderUuid),
    enabled: !!orderUuid,
    // Poll every 30s while order is in active transit states
    refetchInterval: (query) => {
      const status = (query.state.data as any)?.status;
      if (IN_TRANSIT_STATUSES.includes(status)) return 30_000;
      return false;
    },
  });
}
