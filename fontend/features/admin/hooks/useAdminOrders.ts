import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "../api/admin-orders.api";

export function useAdminOrders(filters: api.AdminOrderFilters = {}) {
  return useQuery({
    queryKey: ["admin-orders", filters],
    queryFn: () => api.getAdminOrdersApi(filters),
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,   // auto-refresh orders every 60s
  });
}

export function useAdminOrder(orderUuid: string) {
  return useQuery({
    queryKey: ["admin-order", orderUuid],
    queryFn: () => api.getAdminOrderApi(orderUuid),
    enabled: !!orderUuid,
    staleTime: 15 * 1000,
    refetchInterval: 30 * 1000,   // poll for status changes
  });
}

export function useFulfillOrder(orderUuid: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof api.fulfillOrderApi>[1]) =>
      api.fulfillOrderApi(orderUuid, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-order", orderUuid] });
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
    },
  });
}

export function useCancelOrder(orderUuid: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (reason: string) => api.cancelOrderApi(orderUuid, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-order", orderUuid] });
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
    },
  });
}

export function useRefundOrder(orderUuid: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof api.refundOrderApi>[1]) =>
      api.refundOrderApi(orderUuid, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-order", orderUuid] });
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
    },
  });
}

export function useAddOrderNote(orderUuid: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ note, isInternal }: { note: string; isInternal: boolean }) =>
      api.addOrderNoteApi(orderUuid, note, isInternal),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["admin-order", orderUuid] }),
  });
}

export function useDeleteOrderNote(orderUuid: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (noteId: string) => api.deleteOrderNoteApi(orderUuid, noteId),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["admin-order", orderUuid] }),
  });
}

export function useUpdateOrderTracking(orderUuid: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ trackingNumber, carrier }: { trackingNumber: string; carrier: string }) =>
      api.updateOrderTrackingApi(orderUuid, trackingNumber, carrier),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-order", orderUuid] });
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
    },
  });
}

export function useAdminAnalyticsOverview(filters: { dateFrom?: string; dateTo?: string } = {}) {
  return useQuery({
    queryKey: ["admin-analytics-overview", filters],
    queryFn: () => api.getAdminAnalyticsOverviewApi(filters),
    staleTime: 60 * 1000,
  });
}

export function useAssignCourier(orderUuid: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (carrier: string) => api.assignCourierApi(orderUuid, carrier),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-order", orderUuid] });
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
    },
  });
}

export function useUpdateOrderStatus(orderUuid: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof api.updateOrderStatusApi>[1]) =>
      api.updateOrderStatusApi(orderUuid, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-order", orderUuid] });
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
    },
  });
}

export function useAddOrderTag(orderUuid: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (tag: string) => api.addOrderTagApi(orderUuid, tag),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-order", orderUuid] });
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
    },
  });
}

export function useDeleteOrderTag(orderUuid: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (tag: string) => api.deleteOrderTagApi(orderUuid, tag),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-order", orderUuid] });
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
    },
  });
}
