import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth.store";
import { getMyOrdersApi } from "../api/orders.api";
import type { OrderListResponse } from "../types/order.types";

export function useMyOrders(page = 1) {
  const { isAuthenticated } = useAuthStore();

  const query = useQuery<OrderListResponse>({
    queryKey: ["orders", "my", page],
    queryFn: () => getMyOrdersApi(page),
    staleTime: 30 * 1000, // 30 seconds
    enabled: isAuthenticated,
  });

  return {
    orders: query.data?.items ?? [],
    total: query.data?.total ?? 0,
    currentPage: query.data?.page ?? page,
    pageSize: query.data?.page_size ?? 10,
    totalPages: query.data ? Math.ceil(query.data.total / query.data.page_size) : 0,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: (query.error as any)?.response?.data?.detail ?? null,
    refetch: query.refetch,
  };
}
