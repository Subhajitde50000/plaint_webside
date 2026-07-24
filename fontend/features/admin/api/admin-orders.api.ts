import { adminApi } from "@/lib/admin-axios";

export interface AdminOrderFilters {
  status?: string;
  paymentStatus?: string;
  fulfillmentStatus?: string;
  dateFrom?: string;
  dateTo?: string;
  city?: string;
  tag?: string;
  q?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
}

export const getAdminOrdersApi = async (filters: AdminOrderFilters = {}) => {
  const res = await adminApi.get("/admin/orders/", {
    params: {
      status: filters.status,
      payment_status: filters.paymentStatus,
      fulfillment_status: filters.fulfillmentStatus,
      date_from: filters.dateFrom,
      date_to: filters.dateTo,
      city: filters.city,
      tag: filters.tag,
      q: filters.q,
      sort: filters.sort ?? "newest",
      page: filters.page ?? 1,
      page_size: filters.pageSize ?? 25,
    },
  });
  return res.data;
};

export const getAdminOrderApi = async (orderUuid: string) => {
  const res = await adminApi.get(`/admin/orders/${orderUuid}`);
  return res.data;
};

export const fulfillOrderApi = async (
  orderUuid: string,
  data: {
    trackingNumber?: string;
    carrier?: string;
    trackingUrl?: string;
    notifyCustomer?: boolean;
    fulfilmentNote?: string;
  }
) => {
  const res = await adminApi.post(`/admin/orders/${orderUuid}/fulfill`, {
    tracking_number: data.trackingNumber,
    carrier: data.carrier,
    tracking_url: data.trackingUrl,
    notify_customer: data.notifyCustomer ?? true,
    fulfilment_note: data.fulfilmentNote,
  });
  return res.data;
};

export const cancelOrderApi = async (orderUuid: string, reason: string) => {
  const res = await adminApi.post(`/admin/orders/${orderUuid}/cancel`, {
    reason,
  });
  return res.data;
};

export const refundOrderApi = async (
  orderUuid: string,
  data: {
    amount: number;
    reason: string;
    type: "full" | "partial" | "store_credit";
    notifyCustomer?: boolean;
    returnItemIds?: string[];
  }
) => {
  const res = await adminApi.post(`/admin/orders/${orderUuid}/refund`, {
    amount: data.amount,
    reason: data.reason,
    type: data.type,
    notify_customer: data.notifyCustomer ?? true,
    return_item_ids: data.returnItemIds,
  });
  return res.data;
};

export const addOrderNoteApi = async (
  orderUuid: string,
  note: string,
  isInternal: boolean
) => {
  const res = await adminApi.post(`/admin/orders/${orderUuid}/notes`, {
    note,
    is_internal: isInternal,
  });
  return res.data;
};

export const deleteOrderNoteApi = async (
  orderUuid: string,
  noteId: string
) => {
  const res = await adminApi.delete(
    `/admin/orders/${orderUuid}/notes/${noteId}`
  );
  return res.data;
};

export const updateOrderTrackingApi = async (
  orderUuid: string,
  trackingNumber: string,
  carrier: string
) => {
  const res = await adminApi.patch(`/admin/orders/${orderUuid}/tracking`, {
    tracking_number: trackingNumber,
    carrier,
  });
  return res.data;
};

export const getAdminAnalyticsOverviewApi = async (filters: { dateFrom?: string; dateTo?: string } = {}) => {
  const res = await adminApi.get("/admin/analytics/overview", {
    params: {
      date_from: filters.dateFrom,
      date_to: filters.dateTo,
    },
  });
  return res.data;
};

export const assignCourierApi = async (orderUuid: string, carrier: string) => {
  const res = await adminApi.post(`/admin/orders/${orderUuid}/assign-courier`, {
    carrier,
  });
  return res.data;
};

export const updateOrderStatusApi = async (
  orderUuid: string,
  data: { status: string; description?: string; location?: string }
) => {
  const res = await adminApi.patch(`/admin/orders/${orderUuid}/status`, data);
  return res.data;
};

export const updateReturnApi = async (
  orderUuid: string,
  data: { action: string; adminNote?: string; pickupRequired?: boolean }
) => {
  const res = await adminApi.post(`/admin/orders/${orderUuid}/return`, {
    action: data.action,
    admin_note: data.adminNote || undefined,
    pickup_required: data.pickupRequired ?? true,
  });
  return res.data;
};

export const addOrderTagApi = async (orderUuid: string, tag: string) => {
  const res = await adminApi.post(`/admin/orders/${orderUuid}/tags`, {
    tag,
  });
  return res.data;
};

export const deleteOrderTagApi = async (orderUuid: string, tag: string) => {
  const res = await adminApi.delete(`/admin/orders/${orderUuid}/tags/${encodeURIComponent(tag)}`);
  return res.data;
};
