import { useQuery } from "@tanstack/react-query";
import { getMyOrdersApi } from "../api/orders.api";

export function useMyOrders(page = 1, status?: string) {
  return useQuery({
    queryKey: ["orders", "my", page, status],
    queryFn: () => getMyOrdersApi(page, status),
    staleTime: 30 * 1000,
  });
}
