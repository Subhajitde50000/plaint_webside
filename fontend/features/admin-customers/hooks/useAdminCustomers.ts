"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "../api/admin-customers.api";

const listKey = ["admin-customers"] as const;
const detailKey = (uuid: string) => ["admin-customer", uuid] as const;
const invalidateCustomer = (qc: ReturnType<typeof useQueryClient>, uuid: string) => Promise.all([
  qc.invalidateQueries({ queryKey: listKey }), qc.invalidateQueries({ queryKey: detailKey(uuid) }),
]);

export function useAdminCustomers(filters: api.AdminCustomerFilters = {}) {
  return useQuery({ queryKey: [...listKey, filters], queryFn: () => api.getAdminCustomersApi(filters), staleTime: 30_000 });
}
export function useAdminCustomer(uuid: string) {
  return useQuery({ queryKey: detailKey(uuid), queryFn: () => api.getAdminCustomerApi(uuid), enabled: Boolean(uuid), staleTime: 30_000 });
}
export function useCustomerOrders(uuid: string, page = 1) {
  return useQuery({ queryKey: [...detailKey(uuid), "orders", page], queryFn: () => api.getCustomerOrdersApi(uuid, page), enabled: Boolean(uuid) });
}
export function useUpdateCustomer(uuid: string) { const qc = useQueryClient(); return useMutation({ mutationFn: (data: Parameters<typeof api.updateCustomerApi>[1]) => api.updateCustomerApi(uuid, data), onSuccess: () => invalidateCustomer(qc, uuid) }); }
export function useBlockCustomer(uuid: string) { const qc = useQueryClient(); return useMutation({ mutationFn: (reason: string) => api.blockCustomerApi(uuid, reason), onSuccess: () => invalidateCustomer(qc, uuid) }); }
export function useUnblockCustomer(uuid: string) { const qc = useQueryClient(); return useMutation({ mutationFn: () => api.unblockCustomerApi(uuid), onSuccess: () => invalidateCustomer(qc, uuid) }); }
export function useDeleteCustomer() { const qc = useQueryClient(); return useMutation({ mutationFn: api.deleteCustomerApi, onSuccess: () => qc.invalidateQueries({ queryKey: listKey }) }); }
export function useAdjustPoints(uuid: string) { const qc = useQueryClient(); return useMutation({ mutationFn: ({ points, reason }: { points: number; reason: string }) => api.adjustPointsApi(uuid, points, reason), onSuccess: () => invalidateCustomer(qc, uuid) }); }
export function useChangeTier(uuid: string) { const qc = useQueryClient(); return useMutation({ mutationFn: ({ tier, reason }: { tier: api.CustomerTier; reason?: string }) => api.changeTierApi(uuid, tier, reason), onSuccess: () => invalidateCustomer(qc, uuid) }); }
export function useAddCustomerNote(uuid: string) { const qc = useQueryClient(); return useMutation({ mutationFn: (note: string) => api.addCustomerNoteApi(uuid, note), onSuccess: () => invalidateCustomer(qc, uuid) }); }
