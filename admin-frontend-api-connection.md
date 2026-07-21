# Hero Plant Store — Admin Frontend ↔ Backend API Connection Map
## Complete Integration Guide v1.0
### Every admin file · Every endpoint · Every change needed

> **Purpose:** This is the definitive handoff guide for connecting the React Admin Panel frontend to the FastAPI backend. Every admin API endpoint is mapped to the exact frontend file, what request it sends, what response it expects, what state it updates, and exactly what code changes are needed.

---

## 1. Setup — Admin Frontend Config

### 1.1 Admin App Structure

The admin panel is a **separate React app** (or a `/admin` route group in the same Next.js project), completely isolated from the storefront.

```
admin/                                   ← Separate admin app root
├── src/
│   ├── app/
│   │   ├── layout.tsx                   ← Admin root layout (dark theme)
│   │   ├── providers.tsx                ← TanStack Query + Zustand
│   │   ├── (auth)/
│   │   │   └── login/page.tsx           ← /admin/login
│   │   └── (dashboard)/
│   │       ├── layout.tsx               ← Sidebar + top bar
│   │       ├── page.tsx                 ← /admin (dashboard overview)
│   │       ├── products/
│   │       ├── orders/
│   │       ├── customers/
│   │       ├── inventory/
│   │       ├── discounts/
│   │       ├── reviews/
│   │       ├── analytics/
│   │       ├── ai-care/
│   │       ├── garden-services/
│   │       └── staff/
│   │
│   ├── features/
│   │   ├── admin-auth/
│   │   ├── admin-products/
│   │   ├── admin-orders/
│   │   ├── admin-customers/
│   │   ├── admin-inventory/
│   │   ├── admin-discounts/
│   │   ├── admin-reviews/
│   │   ├── admin-analytics/
│   │   ├── admin-ai-care/
│   │   ├── admin-garden/
│   │   └── admin-staff/
│   │
│   ├── store/
│   │   └── admin-auth.store.ts          ← Zustand admin auth state
│   ├── lib/
│   │   ├── admin-axios.ts               ← Admin-specific Axios instance
│   │   └── admin-query-client.ts
│   └── middleware.ts                    ← Admin route protection
```

### 1.2 Admin Environment Variables (`admin/.env.local`)

```env
NEXT_PUBLIC_ADMIN_API_URL=http://localhost:8000
# Production:
# NEXT_PUBLIC_ADMIN_API_URL=https://api.heroplants.com
```

### 1.3 Admin Axios Instance (`src/lib/admin-axios.ts`)

**Changes needed:** Create this file — completely separate from storefront Axios.

```typescript
import axios from "axios";
import { useAdminAuthStore } from "@/store/admin-auth.store";

export const adminApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_ADMIN_API_URL + "/api/v1",
  withCredentials: true,          // for admin refresh cookie
  timeout: 20000,
  headers: { "Content-Type": "application/json" },
});

// ── Request: attach admin access token ───────────────────────────────
adminApi.interceptors.request.use((config) => {
  const token = (globalThis as any).__adminAccessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Response: silent admin token refresh on 401 ──────────────────────
let isRefreshing = false;
let failedQueue: Array<{ resolve: Function; reject: Function }> = [];

adminApi.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          return adminApi(original);
        });
      }
      original._retry = true;
      isRefreshing = true;
      try {
        const { data } = await adminApi.post("/admin/auth/refresh");
        (globalThis as any).__adminAccessToken = data.access_token;
        failedQueue.forEach((p) => p.resolve(data.access_token));
        failedQueue = [];
        original.headers.Authorization = `Bearer ${data.access_token}`;
        return adminApi(original);
      } catch {
        failedQueue.forEach((p) => p.reject(error));
        failedQueue = [];
        (globalThis as any).__adminAccessToken = null;
        window.location.href = "/admin/login";
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);
```

### 1.4 Admin Auth Store (`src/store/admin-auth.store.ts`)

```typescript
import { create } from "zustand";

interface AdminUser {
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  role:
    | "super_admin"
    | "operations_manager"
    | "inventory_manager"
    | "customer_support"
    | "marketing"
    | "garden_services"
    | "analyst";
  avatarUrl?: string;
}

interface AdminAuthState {
  admin: AdminUser | null;
  role: string | null;
  isAuthenticated: boolean;
  setAccessToken: (token: string) => void;
  setAdmin: (admin: AdminUser) => void;
  logout: () => void;
  // Role-check helpers
  can: (roles: string[]) => boolean;
}

export const useAdminAuthStore = create<AdminAuthState>((set, get) => ({
  admin: null,
  role: null,
  isAuthenticated: false,

  setAccessToken: (token) => {
    (globalThis as any).__adminAccessToken = token;
    set({ isAuthenticated: true });
  },

  setAdmin: (admin) => set({ admin, role: admin.role }),

  logout: () => {
    (globalThis as any).__adminAccessToken = null;
    set({ admin: null, role: null, isAuthenticated: false });
  },

  // Check if current admin has permission
  can: (roles: string[]) => roles.includes(get().role ?? ""),
}));
```

### 1.5 Role Permission Map

```typescript
// src/lib/permissions.ts — CREATE FILE
// Maps each admin role to what they can do
export const PERMISSIONS = {
  super_admin:         { canAll: true },
  operations_manager:  { canOrders: true, canProducts: true, canCustomers: true, canDiscounts: true, canAnalytics: true, canInventory: true, canReviews: true, canGarden: true, canAiCare: true },
  inventory_manager:   { canInventory: true, canProducts: "view+edit" },
  customer_support:    { canOrders: true, canCustomers: true, canReviews: true },
  marketing:           { canDiscounts: true, canCustomers: "view", canAnalytics: "marketing", canReviews: "reply" },
  garden_services:     { canGarden: true },
  analyst:             { canAnalytics: true },
} as const;

// Role arrays used in API calls & middleware
export const ROLES = {
  ALL:           ["super_admin","operations_manager","inventory_manager","customer_support","marketing","garden_services","analyst"],
  OPS_ABOVE:     ["super_admin","operations_manager"],
  SUPPORT_ABOVE: ["super_admin","operations_manager","customer_support"],
  INVENTORY:     ["super_admin","operations_manager","inventory_manager"],
  MARKETING:     ["super_admin","operations_manager","marketing"],
  ANALYST:       ["super_admin","operations_manager","marketing","analyst"],
  GARDEN:        ["super_admin","operations_manager","garden_services"],
  SUPER_ONLY:    ["super_admin"],
};
```

---

## 2. Admin Auth Module

### 2.1 Admin Login

| Property | Value |
|---|---|
| **Page file** | `src/app/(auth)/login/page.tsx` |
| **Component** | `src/features/admin-auth/components/AdminLoginForm.tsx` |
| **Hook** | `src/features/admin-auth/hooks/useAdminLogin.ts` |
| **API function** | `src/features/admin-auth/api/admin-auth.api.ts → adminLoginApi()` |
| **Endpoint** | `POST /api/v1/admin/auth/login` |
| **Request** | `application/x-www-form-urlencoded` → `username=[email]&password=[pass]` |
| **Success** | `{ access_token, token_type, role }` |
| **Errors** | `401` → wrong credentials · `403` → account inactive |

**Frontend changes needed:**

```typescript
// src/features/admin-auth/api/admin-auth.api.ts — CREATE FILE

import { adminApi } from "@/lib/admin-axios";

export const adminLoginApi = async (email: string, password: string) => {
  const form = new URLSearchParams({ username: email, password });
  const res = await adminApi.post("/admin/auth/login", form, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return res.data; // { access_token, token_type, role }
};

export const getAdminMeApi = async () => {
  const res = await adminApi.get("/admin/auth/me");
  return res.data; // { uuid, first_name, last_name, email, role, avatar_url }
};

export const adminLogoutApi = async () => {
  const res = await adminApi.post("/admin/auth/logout");
  return res.data;
};

export const adminRefreshApi = async () => {
  const res = await adminApi.post("/admin/auth/refresh");
  return res.data;
};

// src/features/admin-auth/hooks/useAdminLogin.ts — CREATE FILE
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { adminLoginApi, getAdminMeApi } from "../api/admin-auth.api";
import { useAdminAuthStore } from "@/store/admin-auth.store";

export function useAdminLogin() {
  const router = useRouter();
  const { setAccessToken, setAdmin } = useAdminAuthStore();

  const mutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      adminLoginApi(email, password),

    onSuccess: async (data) => {
      setAccessToken(data.access_token);
      const admin = await getAdminMeApi();
      setAdmin({
        uuid: admin.uuid,
        firstName: admin.first_name,
        lastName: admin.last_name,
        email: admin.email,
        role: admin.role,
        avatarUrl: admin.avatar_url,
      });
      router.push("/admin"); // → admin dashboard
    },
  });

  return {
    login: (email: string, password: string) =>
      mutation.mutate({ email, password }),
    isLoading: mutation.isPending,
    error: (mutation.error as any)?.response?.data?.detail as string | undefined,
    errorStatus: (mutation.error as any)?.response?.status as number | undefined,
  };
}
```

### 2.2 Admin Route Protection (`src/middleware.ts`)

```typescript
import { NextRequest, NextResponse } from "next/server";

const ADMIN_ROUTES = ["/admin"];
const ADMIN_LOGIN = "/admin/login";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin") && pathname !== ADMIN_LOGIN;
  const isAdminLogin = pathname === ADMIN_LOGIN;
  const hasAdminSession = request.cookies.has("admin_session");

  if (isAdminRoute && !hasAdminSession) {
    return NextResponse.redirect(new URL(ADMIN_LOGIN, request.url));
  }
  if (isAdminLogin && hasAdminSession) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
```


---

## 3. Admin Products Module

### 3.1 Products List + CRUD

| Endpoint | Method | Hook | API Function | Roles |
|---|---|---|---|---|
| `/admin/products/` | GET | `useAdminProducts` | `getAdminProductsApi()` | All |
| `/admin/products/` | POST | `useCreateProduct` | `createProductApi()` | Ops, Super |
| `/admin/products/{id}` | GET | `useAdminProduct` | `getAdminProductApi()` | All |
| `/admin/products/{id}` | PUT | `useUpdateProduct` | `updateProductApi()` | Ops, Super, Inventory |
| `/admin/products/{id}` | DELETE | `useDeleteProduct` | `deleteProductApi()` | Super only |
| `/admin/products/{id}/images` | POST | `useUploadProductImage` | `uploadProductImageApi()` | Ops, Super |
| `/admin/products/{id}/images/{img_id}` | DELETE | `useDeleteProductImage` | `deleteProductImageApi()` | Ops, Super |

**Frontend changes needed:**

```typescript
// src/features/admin-products/api/admin-products.api.ts — CREATE FILE
import { adminApi } from "@/lib/admin-axios";

export interface AdminProductFilters {
  status?: "draft" | "active" | "archived";
  categoryId?: number;
  productType?: string;
  q?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
}

export const getAdminProductsApi = async (filters: AdminProductFilters = {}) => {
  const res = await adminApi.get("/admin/products/", {
    params: {
      status: filters.status,
      category_id: filters.categoryId,
      product_type: filters.productType,
      q: filters.q,
      page: filters.page ?? 1,
      page_size: filters.pageSize ?? 25,
      sort: filters.sort ?? "newest",
    },
  });
  return res.data; // { items[], total, page, pages }
};

export const getAdminProductApi = async (productId: string) => {
  const res = await adminApi.get(`/admin/products/${productId}`);
  return res.data;
};

export const createProductApi = async (data: Record<string, any>) => {
  // Convert camelCase → snake_case for backend
  const res = await adminApi.post("/admin/products/", {
    title: data.title,
    slug: data.slug,
    category_id: data.categoryId,
    product_type: data.productType,
    short_description: data.shortDescription,
    description: data.description,
    botanical_name: data.botanicalName,
    common_name: data.commonName,
    base_price: data.basePrice,
    compare_at_price: data.compareAtPrice,
    cost_price: data.costPrice,
    is_taxable: data.isTaxable,
    tax_rate: data.taxRate,
    care_light: data.careLight,
    care_water: data.careWater,
    care_temperature: data.careTemperature,
    care_skill: data.careSkill,
    is_pet_friendly: data.isPetFriendly,
    is_air_purifying: data.isAirPurifying,
    delivery_eta_label: data.deliveryEtaLabel,
    health_guarantee_label: data.healthGuaranteeLabel,
    packaging_label: data.packagingLabel,
    seo_title: data.seoTitle,
    seo_description: data.seoDescription,
    status: data.status ?? "draft",
    tags: data.tags,
    collection_ids: data.collectionIds,
  });
  return res.data;
};

export const updateProductApi = async (
  productId: string,
  data: Record<string, any>
) => {
  const res = await adminApi.put(`/admin/products/${productId}`, data);
  return res.data;
};

export const deleteProductApi = async (productId: string) => {
  const res = await adminApi.delete(`/admin/products/${productId}`);
  return res.data;
};

export const uploadProductImageApi = async (
  productId: string,
  file: File,
  position: number
) => {
  const form = new FormData();
  form.append("image", file);
  form.append("position", String(position));
  const res = await adminApi.post(`/admin/products/${productId}/images`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteProductImageApi = async (
  productId: string,
  imageId: string
) => {
  const res = await adminApi.delete(
    `/admin/products/${productId}/images/${imageId}`
  );
  return res.data;
};

// ── Variants ──────────────────────────────────────────────────────────
export const createVariantApi = async (
  productId: string,
  variant: {
    variantType: string;
    optionName: string;
    optionDetail?: string;
    bestFor?: string;
    potDiameter?: string;
    dispatchTime?: string;
    price: number;
    compareAtPrice?: number;
    sku: string;
    sortOrder?: number;
  }
) => {
  const res = await adminApi.post(`/admin/products/${productId}/variants`, {
    variant_type: variant.variantType,
    option_name: variant.optionName,
    option_detail: variant.optionDetail,
    best_for: variant.bestFor,
    pot_diameter: variant.potDiameter,
    dispatch_time: variant.dispatchTime,
    price: variant.price,
    compare_at_price: variant.compareAtPrice,
    sku: variant.sku,
    sort_order: variant.sortOrder ?? 1,
  });
  return res.data;
};

export const updateVariantApi = async (
  variantId: string,
  data: Record<string, any>
) => {
  const res = await adminApi.put(`/admin/products/variants/${variantId}`, data);
  return res.data;
};

export const deleteVariantApi = async (variantId: string) => {
  const res = await adminApi.delete(`/admin/products/variants/${variantId}`);
  return res.data;
};

// src/features/admin-products/hooks/useAdminProducts.ts — CREATE FILE
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminProductsApi,
  getAdminProductApi,
  createProductApi,
  updateProductApi,
  deleteProductApi,
  AdminProductFilters,
} from "../api/admin-products.api";
import { useRouter } from "next/navigation";

export function useAdminProducts(filters: AdminProductFilters = {}) {
  return useQuery({
    queryKey: ["admin-products", filters],
    queryFn: () => getAdminProductsApi(filters),
    staleTime: 30 * 1000,
  });
}

export function useAdminProduct(productId: string) {
  return useQuery({
    queryKey: ["admin-product", productId],
    queryFn: () => getAdminProductApi(productId),
    enabled: !!productId,
    staleTime: 30 * 1000,
  });
}

export function useCreateProduct() {
  const router = useRouter();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createProductApi,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      router.push(`/admin/products/${data.uuid}/edit`);
    },
  });
}

export function useUpdateProduct(productId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, any>) => updateProductApi(productId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-product", productId] });
      qc.invalidateQueries({ queryKey: ["admin-products"] });
    },
  });
}

export function useDeleteProduct() {
  const router = useRouter();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteProductApi,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      router.push("/admin/products");
    },
  });
}

// src/app/(dashboard)/products/page.tsx — CHANGES NEEDED
"use client";
import { useAdminProducts } from "@/features/admin-products/hooks/useAdminProducts";
import { useSearchParams } from "next/navigation";

export default function AdminProductsPage() {
  const params = useSearchParams();
  const { data, isLoading } = useAdminProducts({
    status: (params.get("status") as any) ?? undefined,
    q: params.get("q") ?? undefined,
    page: Number(params.get("page") ?? 1),
  });

  if (isLoading) return <ProductTableSkeleton />;
  return (
    <div>
      <ProductTable products={data?.items ?? []} total={data?.total ?? 0} />
    </div>
  );
}

// src/app/(dashboard)/products/new/page.tsx — CREATE
// src/app/(dashboard)/products/[id]/edit/page.tsx — CREATE
// Both wire up useCreateProduct / useUpdateProduct
```

---

## 4. Admin Orders Module

| Endpoint | Method | Hook | API Function | Roles |
|---|---|---|---|---|
| `/admin/orders/` | GET | `useAdminOrders` | `getAdminOrdersApi()` | Support, Ops, Super |
| `/admin/orders/{uuid}` | GET | `useAdminOrder` | `getAdminOrderApi()` | Support, Ops, Super |
| `/admin/orders/{uuid}/fulfill` | POST | `useFulfillOrder` | `fulfillOrderApi()` | Ops, Super |
| `/admin/orders/{uuid}/cancel` | POST | `useCancelOrder` | `cancelOrderApi()` | Ops, Super |
| `/admin/orders/{uuid}/refund` | POST | `useRefundOrder` | `refundOrderApi()` | Ops, Super |
| `/admin/orders/{uuid}/notes` | POST | `useAddOrderNote` | `addOrderNoteApi()` | Support, Ops, Super |
| `/admin/orders/{uuid}/notes/{note_id}` | DELETE | `useDeleteOrderNote` | `deleteOrderNoteApi()` | Support, Ops, Super |

**Frontend changes needed:**

```typescript
// src/features/admin-orders/api/admin-orders.api.ts — CREATE FILE
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

// src/features/admin-orders/hooks/useAdminOrders.ts — CREATE FILE
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

// src/app/(dashboard)/orders/page.tsx — CHANGES NEEDED
"use client";
import { useAdminOrders } from "@/features/admin-orders/hooks/useAdminOrders";
import { useSearchParams } from "next/navigation";

export default function AdminOrdersPage() {
  const params = useSearchParams();
  const { data, isLoading } = useAdminOrders({
    status: params.get("status") ?? undefined,
    q: params.get("q") ?? undefined,
    page: Number(params.get("page") ?? 1),
  });

  return <AdminOrderTable orders={data?.items ?? []} total={data?.total ?? 0} />;
}

// src/app/(dashboard)/orders/[uuid]/page.tsx — CREATE
"use client";
import { useParams } from "next/navigation";
import { useAdminOrder, useFulfillOrder, useCancelOrder } from "@/features/admin-orders/hooks/useAdminOrders";

export default function AdminOrderDetailPage() {
  const { uuid } = useParams();
  const { data: order, isLoading } = useAdminOrder(uuid as string);
  const fulfill = useFulfillOrder(uuid as string);
  const cancel = useCancelOrder(uuid as string);

  if (isLoading) return <OrderDetailSkeleton />;
  return (
    <div>
      <OrderHeader order={order} />
      <FulfilmentTimeline history={order.status_history} />
      <OrderItems items={order.items} />
      <FulfilmentActionsPanel
        order={order}
        onFulfill={(data) => fulfill.mutate(data)}
        onCancel={(reason) => cancel.mutate(reason)}
        isFulfilling={fulfill.isPending}
        isCancelling={cancel.isPending}
      />
    </div>
  );
}
```

---

## 5. Admin Customers Module

| Endpoint | Method | Hook | API Function | Roles |
|---|---|---|---|---|
| `/admin/customers/` | GET | `useAdminCustomers` | `getAdminCustomersApi()` | Support, Ops, Super, Marketing |
| `/admin/customers/{uuid}` | GET | `useAdminCustomer` | `getAdminCustomerApi()` | Support, Ops, Super |
| `/admin/customers/{uuid}` | PATCH | `useUpdateCustomer` | `updateCustomerApi()` | Support, Ops, Super |
| `/admin/customers/{uuid}/block` | POST | `useBlockCustomer` | `blockCustomerApi()` | Ops, Super |
| `/admin/customers/{uuid}/unblock` | POST | `useUnblockCustomer` | `unblockCustomerApi()` | Ops, Super |
| `/admin/customers/{uuid}` | DELETE | `useDeleteCustomer` | `deleteCustomerApi()` | Super only |
| `/admin/customers/{uuid}/points` | POST | `useAdjustPoints` | `adjustPointsApi()` | Support, Ops, Super |
| `/admin/customers/{uuid}/tier` | PATCH | `useChangeTier` | `changeTierApi()` | Ops, Super |
| `/admin/customers/{uuid}/notes` | POST | `useAddCustomerNote` | `addCustomerNoteApi()` | Support, Ops, Super |

**Frontend changes needed:**

```typescript
// src/features/admin-customers/api/admin-customers.api.ts — CREATE FILE
import { adminApi } from "@/lib/admin-axios";

export interface AdminCustomerFilters {
  segment?: string;     // "vip" | "gold" | "silver" | "at_risk" | "new" | "blocked"
  q?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
  loyaltyTier?: string;
  status?: string;
  city?: string;
  tag?: string;
}

export const getAdminCustomersApi = async (filters: AdminCustomerFilters = {}) => {
  const res = await adminApi.get("/admin/customers/", {
    params: {
      segment: filters.segment,
      q: filters.q,
      sort: filters.sort ?? "newest",
      page: filters.page ?? 1,
      page_size: filters.pageSize ?? 25,
      loyalty_tier: filters.loyaltyTier,
      status: filters.status,
      city: filters.city,
      tag: filters.tag,
    },
  });
  return res.data;
};

export const getAdminCustomerApi = async (customerUuid: string) => {
  const res = await adminApi.get(`/admin/customers/${customerUuid}`);
  return res.data;
};

export const updateCustomerApi = async (
  customerUuid: string,
  data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    dob?: string;
    aboutMe?: string;
  }
) => {
  const res = await adminApi.patch(`/admin/customers/${customerUuid}`, {
    first_name: data.firstName,
    last_name: data.lastName,
    phone: data.phone,
    dob: data.dob,
    about_me: data.aboutMe,
  });
  return res.data;
};

export const blockCustomerApi = async (
  customerUuid: string,
  reason: string
) => {
  const res = await adminApi.post(`/admin/customers/${customerUuid}/block`, {
    reason,
  });
  return res.data;
};

export const unblockCustomerApi = async (customerUuid: string) => {
  const res = await adminApi.post(`/admin/customers/${customerUuid}/unblock`);
  return res.data;
};

export const deleteCustomerApi = async (customerUuid: string) => {
  const res = await adminApi.delete(`/admin/customers/${customerUuid}`);
  return res.data;
};

export const adjustPointsApi = async (
  customerUuid: string,
  points: number,
  reason: string
) => {
  const res = await adminApi.post(`/admin/customers/${customerUuid}/points`, {
    points,  // positive = add, negative = deduct
    reason,
  });
  return res.data;
};

export const changeTierApi = async (
  customerUuid: string,
  tier: "plant_lover" | "silver" | "gold",
  reason: string
) => {
  const res = await adminApi.patch(`/admin/customers/${customerUuid}/tier`, {
    tier,
    reason,
  });
  return res.data;
};

export const addCustomerNoteApi = async (
  customerUuid: string,
  note: string
) => {
  const res = await adminApi.post(`/admin/customers/${customerUuid}/notes`, {
    note,
  });
  return res.data;
};

export const getCustomerOrdersApi = async (
  customerUuid: string,
  page = 1
) => {
  const res = await adminApi.get(
    `/admin/customers/${customerUuid}/orders`,
    { params: { page } }
  );
  return res.data;
};

// src/features/admin-customers/hooks/useAdminCustomers.ts — CREATE FILE
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "../api/admin-customers.api";
import { useRouter } from "next/navigation";

export function useAdminCustomers(filters: api.AdminCustomerFilters = {}) {
  return useQuery({
    queryKey: ["admin-customers", filters],
    queryFn: () => api.getAdminCustomersApi(filters),
    staleTime: 30 * 1000,
  });
}

export function useAdminCustomer(uuid: string) {
  return useQuery({
    queryKey: ["admin-customer", uuid],
    queryFn: () => api.getAdminCustomerApi(uuid),
    enabled: !!uuid,
    staleTime: 30 * 1000,
  });
}

export function useBlockCustomer(uuid: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (reason: string) => api.blockCustomerApi(uuid, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-customer", uuid] });
      qc.invalidateQueries({ queryKey: ["admin-customers"] });
    },
  });
}

export function useAdjustPoints(uuid: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ points, reason }: { points: number; reason: string }) =>
      api.adjustPointsApi(uuid, points, reason),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["admin-customer", uuid] }),
  });
}

export function useDeleteCustomer() {
  const router = useRouter();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.deleteCustomerApi,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-customers"] });
      router.push("/admin/customers");
    },
  });
}
```

---

## 6. Admin Inventory Module

| Endpoint | Method | Hook | API Function | Roles |
|---|---|---|---|---|
| `/admin/inventory/` | GET | `useAdminInventory` | `getInventoryApi()` | Ops, Super, Inventory |
| `/admin/inventory/{variant_id}` | PATCH | `useUpdateInventory` | `updateInventoryApi()` | Ops, Super, Inventory |
| `/admin/inventory/{variant_id}/adjust` | POST | `useAdjustInventory` | `adjustInventoryApi()` | Ops, Super, Inventory |

**Frontend changes needed:**

```typescript
// src/features/admin-inventory/api/admin-inventory.api.ts — CREATE FILE
import { adminApi } from "@/lib/admin-axios";

export const getInventoryApi = async (filters: {
  q?: string;
  lowStock?: boolean;
  outOfStock?: boolean;
  page?: number;
} = {}) => {
  const res = await adminApi.get("/admin/inventory/", {
    params: {
      q: filters.q,
      low_stock: filters.lowStock,
      out_of_stock: filters.outOfStock,
      page: filters.page ?? 1,
    },
  });
  return res.data;
};

export const updateInventoryApi = async (
  variantId: string,
  data: {
    quantity?: number;
    reorderLevel?: number;
    lowStockAlert?: boolean;
    stockPolicy?: "deny" | "backorder" | "continue";
  }
) => {
  const res = await adminApi.patch(`/admin/inventory/${variantId}`, {
    quantity: data.quantity,
    reorder_level: data.reorderLevel,
    low_stock_alert: data.lowStockAlert,
    stock_policy: data.stockPolicy,
  });
  return res.data;
};

export const adjustInventoryApi = async (
  variantId: string,
  data: {
    type: "adjustment" | "purchase" | "damage" | "return";
    quantityChange: number;
    reason?: string;
    referenceId?: string;
  }
) => {
  const res = await adminApi.post(`/admin/inventory/${variantId}/adjust`, {
    type: data.type,
    quantity_change: data.quantityChange,
    reason: data.reason,
    reference_id: data.referenceId,
  });
  return res.data;
};

// src/features/admin-inventory/hooks/useAdminInventory.ts — CREATE FILE
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "../api/admin-inventory.api";

export function useAdminInventory(filters = {}) {
  return useQuery({
    queryKey: ["admin-inventory", filters],
    queryFn: () => api.getInventoryApi(filters),
    staleTime: 30 * 1000,
    refetchInterval: 2 * 60 * 1000,   // refresh every 2 min
  });
}

export function useAdjustInventory(variantId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof api.adjustInventoryApi>[1]) =>
      api.adjustInventoryApi(variantId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-inventory"] });
      qc.invalidateQueries({ queryKey: ["admin-products"] });
    },
  });
}
```


---

## 7. Admin Discounts Module

| Endpoint | Method | Hook | API Function | Roles |
|---|---|---|---|---|
| `/admin/discounts/` | GET | `useAdminDiscounts` | `getAdminDiscountsApi()` | All |
| `/admin/discounts/` | POST | `useCreateDiscount` | `createDiscountApi()` | Ops, Super, Marketing |
| `/admin/discounts/{uuid}` | GET | `useAdminDiscount` | `getAdminDiscountApi()` | All |
| `/admin/discounts/{uuid}` | PUT | `useUpdateDiscount` | `updateDiscountApi()` | Ops, Super, Marketing |
| `/admin/discounts/{uuid}` | DELETE | `useDeleteDiscount` | `deleteDiscountApi()` | Ops, Super |
| `/admin/discounts/{uuid}/activate` | POST | `useActivateDiscount` | `activateDiscountApi()` | Ops, Super, Marketing |
| `/admin/discounts/{uuid}/deactivate` | POST | `useDeactivateDiscount` | `deactivateDiscountApi()` | Ops, Super, Marketing |
| `/admin/discounts/{uuid}/duplicate` | POST | `useDuplicateDiscount` | `duplicateDiscountApi()` | Ops, Super, Marketing |
| `/admin/discounts/{uuid}/report` | GET | `useDiscountReport` | `getDiscountReportApi()` | Analyst, Ops, Super |

**Frontend changes needed:**

```typescript
// src/features/admin-discounts/api/admin-discounts.api.ts — CREATE FILE
import { adminApi } from "@/lib/admin-axios";

export interface DiscountPayload {
  code?: string;                  // null for automatic
  title: string;
  method: "code" | "automatic";
  discountType: "percentage" | "fixed_amount" | "free_shipping" | "bogo";
  value?: number;
  maxDiscountAmount?: number;
  appliesTo: "all" | "specific_collections" | "specific_products" | "specific_customers";
  excludeSaleItems?: boolean;
  customerEligibility: "all" | "specific_customers" | "specific_segments" | "loyalty_tier" | "first_time";
  minLoyaltyTier?: "plant_lover" | "silver" | "gold";
  firstTimeOnly?: boolean;
  minRequirementType: "none" | "amount" | "quantity";
  minRequirementValue?: number;
  usageLimitTotal?: number;
  usageLimitPerCustomer?: number;
  combineWithProduct?: boolean;
  combineWithOrder?: boolean;
  combineWithShipping?: boolean;
  startsAt: string;               // ISO datetime
  endsAt?: string;
  status?: "draft" | "active";
  productIds?: string[];
  collectionIds?: number[];
  bogoConfig?: {
    buyQuantity: number;
    buyScope: "any" | "specific_product" | "specific_collection";
    buyProductId?: string;
    buyCollectionId?: number;
    getQuantity: number;
    getScope: "specific_product" | "specific_collection";
    getProductId?: string;
    getCollectionId?: number;
    getDiscountType: "percentage" | "fixed_price" | "free";
    getDiscountValue?: number;
    limitOncePerOrder?: boolean;
  };
}

export const getAdminDiscountsApi = async (filters: {
  status?: string;
  discountType?: string;
  method?: string;
  q?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
} = {}) => {
  const res = await adminApi.get("/admin/discounts/", {
    params: {
      status: filters.status,
      discount_type: filters.discountType,
      method: filters.method,
      q: filters.q,
      page: filters.page ?? 1,
      page_size: filters.pageSize ?? 25,
      sort: filters.sort ?? "newest",
    },
  });
  return res.data;
};

export const getAdminDiscountApi = async (uuid: string) => {
  const res = await adminApi.get(`/admin/discounts/${uuid}`);
  return res.data;
};

const toSnakeCase = (d: DiscountPayload) => ({
  code: d.code,
  title: d.title,
  method: d.method,
  discount_type: d.discountType,
  value: d.value,
  max_discount_amount: d.maxDiscountAmount,
  applies_to: d.appliesTo,
  exclude_sale_items: d.excludeSaleItems,
  customer_eligibility: d.customerEligibility,
  min_loyalty_tier: d.minLoyaltyTier,
  first_time_only: d.firstTimeOnly,
  min_requirement_type: d.minRequirementType,
  min_requirement_value: d.minRequirementValue,
  usage_limit_total: d.usageLimitTotal,
  usage_limit_per_customer: d.usageLimitPerCustomer,
  combine_with_product: d.combineWithProduct ?? false,
  combine_with_order: d.combineWithOrder ?? false,
  combine_with_shipping: d.combineWithShipping ?? false,
  starts_at: d.startsAt,
  ends_at: d.endsAt,
  status: d.status ?? "draft",
  product_ids: d.productIds,
  collection_ids: d.collectionIds,
  bogo_config: d.bogoConfig ? {
    buy_quantity: d.bogoConfig.buyQuantity,
    buy_scope: d.bogoConfig.buyScope,
    buy_product_id: d.bogoConfig.buyProductId,
    buy_collection_id: d.bogoConfig.buyCollectionId,
    get_quantity: d.bogoConfig.getQuantity,
    get_scope: d.bogoConfig.getScope,
    get_product_id: d.bogoConfig.getProductId,
    get_collection_id: d.bogoConfig.getCollectionId,
    get_discount_type: d.bogoConfig.getDiscountType,
    get_discount_value: d.bogoConfig.getDiscountValue,
    limit_once_per_order: d.bogoConfig.limitOncePerOrder ?? true,
  } : undefined,
});

export const createDiscountApi = async (data: DiscountPayload) => {
  const res = await adminApi.post("/admin/discounts/", toSnakeCase(data));
  return res.data;
};

export const updateDiscountApi = async (uuid: string, data: Partial<DiscountPayload>) => {
  const res = await adminApi.put(`/admin/discounts/${uuid}`, toSnakeCase(data as DiscountPayload));
  return res.data;
};

export const deleteDiscountApi = async (uuid: string) => {
  const res = await adminApi.delete(`/admin/discounts/${uuid}`);
  return res.data;
};

export const activateDiscountApi = async (uuid: string) => {
  const res = await adminApi.post(`/admin/discounts/${uuid}/activate`);
  return res.data;
};

export const deactivateDiscountApi = async (uuid: string) => {
  const res = await adminApi.post(`/admin/discounts/${uuid}/deactivate`);
  return res.data;
};

export const duplicateDiscountApi = async (
  uuid: string,
  newCode: string
) => {
  const res = await adminApi.post(`/admin/discounts/${uuid}/duplicate`, {
    new_code: newCode,
  });
  return res.data;
};

export const getDiscountReportApi = async (uuid: string) => {
  const res = await adminApi.get(`/admin/discounts/${uuid}/report`);
  return res.data;
  // { times_used, total_discount_given, revenue_generated, orders_using[], usage_chart[] }
};

// Check if a discount code is unique (live, on blur)
export const checkDiscountCodeApi = async (code: string, excludeId?: string) => {
  const res = await adminApi.get("/admin/discounts/check-code", {
    params: { code: code.toUpperCase(), exclude_id: excludeId },
  });
  return res.data; // { available: boolean }
};

// src/features/admin-discounts/hooks/useAdminDiscounts.ts — CREATE FILE
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "../api/admin-discounts.api";
import { useRouter } from "next/navigation";

export function useAdminDiscounts(filters = {}) {
  return useQuery({
    queryKey: ["admin-discounts", filters],
    queryFn: () => api.getAdminDiscountsApi(filters),
    staleTime: 30 * 1000,
  });
}

export function useAdminDiscount(uuid: string) {
  return useQuery({
    queryKey: ["admin-discount", uuid],
    queryFn: () => api.getAdminDiscountApi(uuid),
    enabled: !!uuid,
  });
}

export function useCreateDiscount() {
  const router = useRouter();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createDiscountApi,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["admin-discounts"] });
      router.push(`/admin/discounts/${data.uuid}`);
    },
  });
}

export function useUpdateDiscount(uuid: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<api.DiscountPayload>) =>
      api.updateDiscountApi(uuid, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-discount", uuid] });
      qc.invalidateQueries({ queryKey: ["admin-discounts"] });
    },
  });
}

export function useActivateDiscount(uuid: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.activateDiscountApi(uuid),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-discount", uuid] });
      qc.invalidateQueries({ queryKey: ["admin-discounts"] });
    },
  });
}

export function useDeleteDiscount() {
  const router = useRouter();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.deleteDiscountApi,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-discounts"] });
      router.push("/admin/discounts");
    },
  });
}

export function useDiscountReport(uuid: string) {
  return useQuery({
    queryKey: ["admin-discount-report", uuid],
    queryFn: () => api.getDiscountReportApi(uuid),
    enabled: !!uuid,
    staleTime: 5 * 60 * 1000,
  });
}
```

---

## 8. Admin Reviews Module

| Endpoint | Method | Hook | API Function | Roles |
|---|---|---|---|---|
| `/admin/reviews/` | GET | `useAdminReviews` | `getAdminReviewsApi()` | Support, Ops, Super, Marketing |
| `/admin/reviews/{uuid}/approve` | POST | `useApproveReview` | `approveReviewApi()` | Support, Ops, Super |
| `/admin/reviews/{uuid}/reject` | POST | `useRejectReview` | `rejectReviewApi()` | Support, Ops, Super |
| `/admin/reviews/{uuid}/reply` | POST | `useReplyToReview` | `replyToReviewApi()` | Support, Ops, Super, Marketing |
| `/admin/reviews/{uuid}/reply` | PUT | `useUpdateReviewReply` | `updateReviewReplyApi()` | Support, Ops, Super, Marketing |
| `/admin/reviews/{uuid}/reply` | DELETE | `useDeleteReviewReply` | `deleteReviewReplyApi()` | Support, Ops, Super |
| `/admin/reviews/{uuid}/feature` | POST | `useFeatureReview` | `featureReviewApi()` | Ops, Super, Marketing |
| `/admin/reviews/{uuid}` | DELETE | `useDeleteReview` | `deleteReviewApi()` | Ops, Super |
| `/admin/reviews/{uuid}/photos/{photo_id}` | DELETE | `useDeleteReviewPhoto` | `deleteReviewPhotoApi()` | Support, Ops, Super |

**Frontend changes needed:**

```typescript
// src/features/admin-reviews/api/admin-reviews.api.ts — CREATE FILE
import { adminApi } from "@/lib/admin-axios";

export interface AdminReviewFilters {
  status?: "pending" | "published" | "rejected" | "flagged";
  rating?: number;
  hasPhotos?: boolean;
  hasReply?: boolean;
  verifiedOnly?: boolean;
  productId?: string;
  q?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
}

export const getAdminReviewsApi = async (filters: AdminReviewFilters = {}) => {
  const res = await adminApi.get("/admin/reviews/", {
    params: {
      status: filters.status,
      rating: filters.rating,
      has_photos: filters.hasPhotos,
      has_reply: filters.hasReply,
      verified_only: filters.verifiedOnly,
      product_id: filters.productId,
      q: filters.q,
      sort: filters.sort ?? "newest",
      page: filters.page ?? 1,
      page_size: filters.pageSize ?? 25,
    },
  });
  return res.data;
};

export const approveReviewApi = async (uuid: string, isFeatured?: boolean) => {
  const res = await adminApi.post(`/admin/reviews/${uuid}/approve`, {
    is_featured: isFeatured ?? false,
  });
  return res.data;
};

export const rejectReviewApi = async (
  uuid: string,
  reason: string,
  notifyCustomer?: boolean
) => {
  const res = await adminApi.post(`/admin/reviews/${uuid}/reject`, {
    rejection_reason: reason,
    notify_customer: notifyCustomer ?? false,
  });
  return res.data;
};

export const replyToReviewApi = async (uuid: string, reply: string) => {
  const res = await adminApi.post(`/admin/reviews/${uuid}/reply`, { reply });
  return res.data;
};

export const updateReviewReplyApi = async (uuid: string, reply: string) => {
  const res = await adminApi.put(`/admin/reviews/${uuid}/reply`, { reply });
  return res.data;
};

export const deleteReviewReplyApi = async (uuid: string) => {
  const res = await adminApi.delete(`/admin/reviews/${uuid}/reply`);
  return res.data;
};

export const featureReviewApi = async (uuid: string, featured: boolean) => {
  const res = await adminApi.post(`/admin/reviews/${uuid}/feature`, {
    is_featured: featured,
  });
  return res.data;
};

export const deleteReviewApi = async (uuid: string) => {
  const res = await adminApi.delete(`/admin/reviews/${uuid}`);
  return res.data;
};

export const deleteReviewPhotoApi = async (
  reviewUuid: string,
  photoId: string
) => {
  const res = await adminApi.delete(
    `/admin/reviews/${reviewUuid}/photos/${photoId}`
  );
  return res.data;
};

// src/features/admin-reviews/hooks/useAdminReviews.ts — CREATE FILE
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "../api/admin-reviews.api";

const REVIEWS_KEY = (filters: any) => ["admin-reviews", filters];

export function useAdminReviews(filters: api.AdminReviewFilters = {}) {
  return useQuery({
    queryKey: REVIEWS_KEY(filters),
    queryFn: () => api.getAdminReviewsApi(filters),
    staleTime: 30 * 1000,
  });
}

// Helper: invalidate reviews list after any moderation action
function useInvalidateReviews() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: ["admin-reviews"] });
}

export function useApproveReview() {
  const invalidate = useInvalidateReviews();
  return useMutation({
    mutationFn: ({ uuid, isFeatured }: { uuid: string; isFeatured?: boolean }) =>
      api.approveReviewApi(uuid, isFeatured),
    onSuccess: invalidate,
  });
}

export function useRejectReview() {
  const invalidate = useInvalidateReviews();
  return useMutation({
    mutationFn: ({
      uuid,
      reason,
      notifyCustomer,
    }: {
      uuid: string;
      reason: string;
      notifyCustomer?: boolean;
    }) => api.rejectReviewApi(uuid, reason, notifyCustomer),
    onSuccess: invalidate,
  });
}

export function useReplyToReview() {
  const invalidate = useInvalidateReviews();
  return useMutation({
    mutationFn: ({ uuid, reply }: { uuid: string; reply: string }) =>
      api.replyToReviewApi(uuid, reply),
    onSuccess: invalidate,
  });
}

export function useFeatureReview() {
  const invalidate = useInvalidateReviews();
  return useMutation({
    mutationFn: ({ uuid, featured }: { uuid: string; featured: boolean }) =>
      api.featureReviewApi(uuid, featured),
    onSuccess: invalidate,
  });
}

export function useDeleteReview() {
  const invalidate = useInvalidateReviews();
  return useMutation({
    mutationFn: api.deleteReviewApi,
    onSuccess: invalidate,
  });
}

// Page wiring:
// src/app/(dashboard)/reviews/page.tsx — CHANGES NEEDED
"use client";
import { useAdminReviews, useApproveReview, useRejectReview } from "@/features/admin-reviews/hooks/useAdminReviews";
import { useSearchParams } from "next/navigation";

export default function AdminReviewsPage() {
  const params = useSearchParams();
  const { data, isLoading } = useAdminReviews({
    status: (params.get("status") as any) ?? "pending", // default: pending queue
    page: Number(params.get("page") ?? 1),
  });
  const approve = useApproveReview();
  const reject = useRejectReview();

  return (
    <ReviewModerationQueue
      reviews={data?.items ?? []}
      onApprove={(uuid) => approve.mutate({ uuid })}
      onReject={(uuid, reason) => reject.mutate({ uuid, reason })}
      isApproving={approve.isPending}
      isRejecting={reject.isPending}
    />
  );
}
```

---

## 9. Admin Analytics Module

| Endpoint | Method | Hook | API Function | Roles |
|---|---|---|---|---|
| `/admin/analytics/overview` | GET | `useAnalyticsOverview` | `getOverviewApi()` | Analyst, Marketing, Ops, Super |
| `/admin/analytics/revenue/chart` | GET | `useRevenueChart` | `getRevenueChartApi()` | Analyst, Ops, Super |
| `/admin/analytics/orders` | GET | `useOrdersAnalytics` | `getOrdersAnalyticsApi()` | Analyst, Ops, Super |
| `/admin/analytics/products/top` | GET | `useTopProducts` | `getTopProductsApi()` | Analyst, Ops, Super |
| `/admin/analytics/products/zero-sales` | GET | `useZeroSalesProducts` | `getZeroSalesProductsApi()` | Analyst, Ops, Super |
| `/admin/analytics/customers/overview` | GET | `useCustomerAnalytics` | `getCustomerAnalyticsApi()` | Analyst, Marketing, Ops, Super |
| `/admin/analytics/customers/cohort` | GET | `useCustomerCohort` | `getCustomerCohortApi()` | Analyst, Ops, Super |
| `/admin/analytics/marketing` | GET | `useMarketingAnalytics` | `getMarketingAnalyticsApi()` | Analyst, Marketing, Ops, Super |
| `/admin/analytics/garden` | GET | `useGardenAnalytics` | `getGardenAnalyticsApi()` | Garden, Ops, Super |
| `/admin/analytics/export` | GET | `useAnalyticsExport` | `exportAnalyticsApi()` | Analyst, Ops, Super |

**Frontend changes needed:**

```typescript
// src/features/admin-analytics/api/admin-analytics.api.ts — CREATE FILE
import { adminApi } from "@/lib/admin-axios";

export interface AnalyticsParams {
  dateFrom?: string;   // "YYYY-MM-DD"
  dateTo?: string;
  granularity?: "daily" | "weekly" | "monthly";
  comparePeriod?: "previous_period" | "previous_year" | string;
  limit?: number;
}

const toDateParams = (p: AnalyticsParams) => ({
  date_from: p.dateFrom,
  date_to: p.dateTo,
  granularity: p.granularity ?? "daily",
  compare_period: p.comparePeriod,
  limit: p.limit,
});

export const getOverviewApi = async (params: AnalyticsParams = {}) => {
  const res = await adminApi.get("/admin/analytics/overview", {
    params: toDateParams(params),
  });
  return res.data;
  // { revenue, orders, new_customers, aov, units_sold, return_rate,
  //   garden_revenue, ai_conversion_rate, period, compare? }
};

export const getRevenueChartApi = async (params: AnalyticsParams = {}) => {
  const res = await adminApi.get("/admin/analytics/revenue/chart", {
    params: toDateParams(params),
  });
  return res.data;
  // { data: [{ date, revenue, orders, aov }] }
};

export const getOrdersAnalyticsApi = async (params: AnalyticsParams = {}) => {
  const res = await adminApi.get("/admin/analytics/orders", {
    params: toDateParams(params),
  });
  return res.data;
};

export const getTopProductsApi = async (
  params: AnalyticsParams = {}
) => {
  const res = await adminApi.get("/admin/analytics/products/top", {
    params: toDateParams(params),
  });
  return res.data;
  // { data: [{ product_id, title, revenue, units, aov }] }
};

export const getZeroSalesProductsApi = async (params: AnalyticsParams = {}) => {
  const res = await adminApi.get("/admin/analytics/products/zero-sales", {
    params: toDateParams(params),
  });
  return res.data;
};

export const getCustomerAnalyticsApi = async (params: AnalyticsParams = {}) => {
  const res = await adminApi.get("/admin/analytics/customers/overview", {
    params: toDateParams(params),
  });
  return res.data;
};

export const getCustomerCohortApi = async (params: AnalyticsParams = {}) => {
  const res = await adminApi.get("/admin/analytics/customers/cohort", {
    params: toDateParams(params),
  });
  return res.data;
};

export const getMarketingAnalyticsApi = async (params: AnalyticsParams = {}) => {
  const res = await adminApi.get("/admin/analytics/marketing", {
    params: toDateParams(params),
  });
  return res.data;
};

export const getGardenAnalyticsApi = async (params: AnalyticsParams = {}) => {
  const res = await adminApi.get("/admin/analytics/garden", {
    params: toDateParams(params),
  });
  return res.data;
};

export const exportAnalyticsApi = async (
  section: "all" | "revenue" | "orders" | "products" | "customers",
  params: AnalyticsParams = {},
  format: "xlsx" | "csv" = "xlsx"
) => {
  const res = await adminApi.get("/admin/analytics/export", {
    params: { section, format, ...toDateParams(params) },
    responseType: "blob",   // file download
  });
  return res.data;
};

// src/features/admin-analytics/hooks/useAdminAnalytics.ts — CREATE FILE
import { useQuery } from "@tanstack/react-query";
import * as api from "../api/admin-analytics.api";

// Use a shared date range from the analytics page URL params
// All hooks take the same AnalyticsParams object

export function useAnalyticsOverview(params: api.AnalyticsParams) {
  return useQuery({
    queryKey: ["analytics-overview", params],
    queryFn: () => api.getOverviewApi(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useRevenueChart(params: api.AnalyticsParams) {
  return useQuery({
    queryKey: ["analytics-revenue-chart", params],
    queryFn: () => api.getRevenueChartApi(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useTopProducts(params: api.AnalyticsParams) {
  return useQuery({
    queryKey: ["analytics-top-products", params],
    queryFn: () => api.getTopProductsApi(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCustomerAnalytics(params: api.AnalyticsParams) {
  return useQuery({
    queryKey: ["analytics-customers", params],
    queryFn: () => api.getCustomerAnalyticsApi(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useMarketingAnalytics(params: api.AnalyticsParams) {
  return useQuery({
    queryKey: ["analytics-marketing", params],
    queryFn: () => api.getMarketingAnalyticsApi(params),
    staleTime: 5 * 60 * 1000,
  });
}

// Page wiring:
// src/app/(dashboard)/analytics/page.tsx — CHANGES NEEDED
"use client";
import { useSearchParams } from "next/navigation";
import {
  useAnalyticsOverview,
  useRevenueChart,
  useTopProducts,
} from "@/features/admin-analytics/hooks/useAdminAnalytics";

export default function AdminAnalyticsPage() {
  const params = useSearchParams();
  const analyticsParams = {
    dateFrom: params.get("from") ?? undefined,
    dateTo: params.get("to") ?? undefined,
    granularity: (params.get("g") as any) ?? "daily",
  };

  const { data: overview } = useAnalyticsOverview(analyticsParams);
  const { data: revenueChart } = useRevenueChart(analyticsParams);
  const { data: topProducts } = useTopProducts(analyticsParams);

  return (
    <div>
      <KpiRow data={overview} />
      <RevenueChart data={revenueChart?.data} />
      <TopProductsTable data={topProducts?.data} />
    </div>
  );
}
```

---

## 10. Admin AI Care Module

| Endpoint | Method | Hook | API Function | Roles |
|---|---|---|---|---|
| `/admin/ai-care/metrics` | GET | `useAiCareMetrics` | `getAiCareMetricsApi()` | Analyst, Ops, Super |
| `/admin/ai-care/queries` | GET | `useAiCareQueries` | `getAiCareQueriesApi()` | Ops, Super |
| `/admin/ai-care/queries/{id}` | GET | `useAiCareQuery` | `getAiCareQueryApi()` | Ops, Super |
| `/admin/ai-care/queries/{id}/flag` | POST | `useFlagAiQuery` | `flagAiQueryApi()` | Ops, Super |
| `/admin/ai-care/queries/{id}/review` | POST | `useReviewAiQuery` | `reviewAiQueryApi()` | Ops, Super |
| `/admin/ai-care/queries/{id}` | DELETE | `useDeleteAiQuery` | `deleteAiQueryApi()` | Super only |
| `/admin/ai-care/settings` | GET | `useAiCareSettings` | `getAiCareSettingsApi()` | Ops, Super |
| `/admin/ai-care/settings` | PUT | `useUpdateAiCareSettings` | `updateAiCareSettingsApi()` | Ops, Super |

**Frontend changes needed:**

```typescript
// src/features/admin-ai-care/api/admin-ai-care.api.ts — CREATE FILE
import { adminApi } from "@/lib/admin-axios";

export const getAiCareMetricsApi = async (params: {
  dateFrom?: string;
  dateTo?: string;
} = {}) => {
  const res = await adminApi.get("/admin/ai-care/metrics", {
    params: { date_from: params.dateFrom, date_to: params.dateTo },
  });
  return res.data;
  // { total_queries, unique_users, photo_uploads, helpful_rate,
  //   cart_conversion_rate, cart_revenue, flagged_count,
  //   top_questions[], funnel_data, satisfaction_distribution }
};

export const getAiCareQueriesApi = async (filters: {
  status?: "normal" | "flagged" | "reviewed";
  hasPhoto?: boolean;
  rating?: "helpful" | "not_helpful";
  converted?: boolean;
  q?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
} = {}) => {
  const res = await adminApi.get("/admin/ai-care/queries", {
    params: {
      status: filters.status,
      has_photo: filters.hasPhoto,
      rating: filters.rating,
      converted: filters.converted,
      q: filters.q,
      page: filters.page ?? 1,
      page_size: filters.pageSize ?? 25,
      sort: filters.sort ?? "newest",
    },
  });
  return res.data;
};

export const getAiCareQueryApi = async (queryId: string) => {
  const res = await adminApi.get(`/admin/ai-care/queries/${queryId}`);
  return res.data;
  // Full session: { messages[], photo_url, plant_id_result, rating, suggested_products[] }
};

export const flagAiQueryApi = async (queryId: string, reason: string) => {
  const res = await adminApi.post(`/admin/ai-care/queries/${queryId}/flag`, {
    flag_reason: reason,
  });
  return res.data;
};

export const reviewAiQueryApi = async (
  queryId: string,
  outcome: "no_issue" | "confirmed_issue",
  notes?: string
) => {
  const res = await adminApi.post(`/admin/ai-care/queries/${queryId}/review`, {
    outcome,
    notes,
  });
  return res.data;
};

export const deleteAiQueryApi = async (queryId: string) => {
  const res = await adminApi.delete(`/admin/ai-care/queries/${queryId}`);
  return res.data;
};

export const getAiCareSettingsApi = async () => {
  const res = await adminApi.get("/admin/ai-care/settings");
  return res.data;
};

export const updateAiCareSettingsApi = async (settings: {
  enabled?: boolean;
  allowPhotoUploads?: boolean;
  allowRoomVisualiser?: boolean;
  showProductRecommendations?: boolean;
  autoFlagProfanity?: boolean;
  autoFlagPii?: boolean;
  autoApproveHighRated?: boolean;
  maxResponseWords?: number;
  retentionDays?: number;
  logConversations?: boolean;
}) => {
  const res = await adminApi.put("/admin/ai-care/settings", {
    enabled: settings.enabled,
    allow_photo_uploads: settings.allowPhotoUploads,
    allow_room_visualiser: settings.allowRoomVisualiser,
    show_product_recommendations: settings.showProductRecommendations,
    auto_flag_profanity: settings.autoFlagProfanity,
    auto_flag_pii: settings.autoFlagPii,
    auto_approve_high_rated: settings.autoApproveHighRated,
    max_response_words: settings.maxResponseWords,
    retention_days: settings.retentionDays,
    log_conversations: settings.logConversations,
  });
  return res.data;
};

// src/features/admin-ai-care/hooks/useAdminAiCare.ts — CREATE FILE
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "../api/admin-ai-care.api";

export function useAiCareMetrics(params = {}) {
  return useQuery({
    queryKey: ["admin-ai-care-metrics", params],
    queryFn: () => api.getAiCareMetricsApi(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useAiCareQueries(filters = {}) {
  return useQuery({
    queryKey: ["admin-ai-care-queries", filters],
    queryFn: () => api.getAiCareQueriesApi(filters),
    staleTime: 30 * 1000,
  });
}

export function useAiCareQuery(queryId: string) {
  return useQuery({
    queryKey: ["admin-ai-care-query", queryId],
    queryFn: () => api.getAiCareQueryApi(queryId),
    enabled: !!queryId,
  });
}

export function useFlagAiQuery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      api.flagAiQueryApi(id, reason),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["admin-ai-care-queries"] }),
  });
}

export function useUpdateAiCareSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.updateAiCareSettingsApi,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["admin-ai-care-settings"] }),
  });
}
```

---

## 11. Admin Garden Services Module

| Endpoint | Method | Hook | API Function | Roles |
|---|---|---|---|---|
| `/admin/garden-services/bookings` | GET | `useAdminBookings` | `getAdminBookingsApi()` | Garden, Ops, Super |
| `/admin/garden-services/bookings/{uuid}` | GET | `useAdminBooking` | `getAdminBookingApi()` | Garden, Ops, Super |
| `/admin/garden-services/bookings/{uuid}` | PATCH | `useUpdateBooking` | `updateBookingApi()` | Garden, Ops, Super |
| `/admin/garden-services/gardeners` | GET | `useGardeners` | `getGardenersApi()` | Garden, Ops, Super |
| `/admin/garden-services/gardeners` | POST | `useCreateGardener` | `createGardenerApi()` | Ops, Super |
| `/admin/garden-services/gardeners/{id}` | PATCH | `useUpdateGardener` | `updateGardenerApi()` | Ops, Super |
| `/admin/garden-services/types` | GET | `useServiceTypes` | `getServiceTypesApi()` | Garden, Ops, Super |
| `/admin/garden-services/types` | POST | `useCreateServiceType` | `createServiceTypeApi()` | Ops, Super |

**Frontend changes needed:**

```typescript
// src/features/admin-garden/api/admin-garden.api.ts — CREATE FILE
import { adminApi } from "@/lib/admin-axios";

export const getAdminBookingsApi = async (filters: {
  status?: string;
  city?: string;
  gardenerId?: number;
  dateFrom?: string;
  dateTo?: string;
  q?: string;
  page?: number;
} = {}) => {
  const res = await adminApi.get("/admin/garden-services/bookings", {
    params: {
      status: filters.status,
      city: filters.city,
      gardener_id: filters.gardenerId,
      date_from: filters.dateFrom,
      date_to: filters.dateTo,
      q: filters.q,
      page: filters.page ?? 1,
    },
  });
  return res.data;
};

export const updateBookingApi = async (
  uuid: string,
  data: {
    status?: string;
    assignedGardenerId?: number;
    adminNotes?: string;
    scheduledDate?: string;
    scheduledTimeFrom?: string;
  }
) => {
  const res = await adminApi.patch(
    `/admin/garden-services/bookings/${uuid}`,
    {
      status: data.status,
      assigned_gardener_id: data.assignedGardenerId,
      admin_notes: data.adminNotes,
      scheduled_date: data.scheduledDate,
      scheduled_time_from: data.scheduledTimeFrom,
    }
  );
  return res.data;
};

export const getGardenersApi = async () => {
  const res = await adminApi.get("/admin/garden-services/gardeners");
  return res.data;
};

export const createGardenerApi = async (data: {
  name: string;
  phone: string;
  email?: string;
  city: string;
  state?: string;
  specialisations?: string;
  joinedAt?: string;
}) => {
  const res = await adminApi.post("/admin/garden-services/gardeners", {
    name: data.name,
    phone: data.phone,
    email: data.email,
    city: data.city,
    state: data.state,
    specialisations: data.specialisations,
    joined_at: data.joinedAt,
  });
  return res.data;
};

// src/features/admin-garden/hooks/useAdminGarden.ts — CREATE FILE
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "../api/admin-garden.api";

export function useAdminBookings(filters = {}) {
  return useQuery({
    queryKey: ["admin-bookings", filters],
    queryFn: () => api.getAdminBookingsApi(filters),
    staleTime: 30 * 1000,
  });
}

export function useUpdateBooking(uuid: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof api.updateBookingApi>[1]) =>
      api.updateBookingApi(uuid, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-bookings"] });
      qc.invalidateQueries({ queryKey: ["admin-booking", uuid] });
    },
  });
}

export function useGardeners() {
  return useQuery({
    queryKey: ["admin-gardeners"],
    queryFn: api.getGardenersApi,
    staleTime: 5 * 60 * 1000,
  });
}
```

---

## 12. Admin Staff Module

| Endpoint | Method | Hook | API Function | Roles |
|---|---|---|---|---|
| `/admin/staff/` | GET | `useAdminStaff` | `getStaffApi()` | Super only |
| `/admin/staff/` | POST | `useCreateStaff` | `createStaffApi()` | Super only |
| `/admin/staff/{uuid}` | GET | `useStaffMember` | `getStaffMemberApi()` | Super only |
| `/admin/staff/{uuid}` | PATCH | `useUpdateStaff` | `updateStaffApi()` | Super only |
| `/admin/staff/{uuid}` | DELETE | `useDeleteStaff` | `deleteStaffApi()` | Super only |
| `/admin/staff/{uuid}/activate` | POST | `useActivateStaff` | `activateStaffApi()` | Super only |
| `/admin/staff/{uuid}/deactivate` | POST | `useDeactivateStaff` | `deactivateStaffApi()` | Super only |

**Frontend changes needed:**

```typescript
// src/features/admin-staff/api/admin-staff.api.ts — CREATE FILE
import { adminApi } from "@/lib/admin-axios";

export const getStaffApi = async () => {
  const res = await adminApi.get("/admin/staff/");
  return res.data;
};

export const createStaffApi = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  avatarUrl?: string;
}) => {
  const res = await adminApi.post("/admin/staff/", {
    first_name: data.firstName,
    last_name: data.lastName,
    email: data.email,
    password: data.password,
    role: data.role,
    avatar_url: data.avatarUrl,
  });
  return res.data;
};

export const updateStaffApi = async (
  uuid: string,
  data: {
    firstName?: string;
    lastName?: string;
    role?: string;
    isActive?: boolean;
  }
) => {
  const res = await adminApi.patch(`/admin/staff/${uuid}`, {
    first_name: data.firstName,
    last_name: data.lastName,
    role: data.role,
    is_active: data.isActive,
  });
  return res.data;
};

export const deleteStaffApi = async (uuid: string) => {
  const res = await adminApi.delete(`/admin/staff/${uuid}`);
  return res.data;
};

// src/features/admin-staff/hooks/useAdminStaff.ts — CREATE FILE
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "../api/admin-staff.api";

export function useAdminStaff() {
  return useQuery({
    queryKey: ["admin-staff"],
    queryFn: api.getStaffApi,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateStaff() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createStaffApi,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-staff"] }),
  });
}

export function useUpdateStaff(uuid: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof api.updateStaffApi>[1]) =>
      api.updateStaffApi(uuid, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-staff"] }),
  });
}

export function useDeleteStaff() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.deleteStaffApi,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-staff"] }),
  });
}
```


---

## 13. Complete Admin Master Table — All Endpoints

> Every admin endpoint, the exact frontend file that calls it, request shape, roles allowed, and what needs to change.

| # | Frontend File | Endpoint | Method | Request | Response | Roles | What Changes |
|---|---|---|---|---|---|---|---|
| **ADMIN AUTH** | | | | | | | |
| 1 | `features/admin-auth/api/admin-auth.api.ts` | `/admin/auth/login` | POST | form-encoded `username= &password=` | `{access_token, role}` | All | Create `adminLoginApi()` — form-encoded |
| 2 | `features/admin-auth/api/admin-auth.api.ts` | `/admin/auth/me` | GET | Bearer token | `{uuid, role, first_name...}` | All | Create `getAdminMeApi()` |
| 3 | `features/admin-auth/api/admin-auth.api.ts` | `/admin/auth/refresh` | POST | HttpOnly cookie | `{access_token}` | All | Create `adminRefreshApi()` — called by Axios interceptor |
| 4 | `features/admin-auth/api/admin-auth.api.ts` | `/admin/auth/logout` | POST | — | `{message}` | All | Create `adminLogoutApi()` |
| 5 | `features/admin-auth/hooks/useAdminLogin.ts` | via `adminLoginApi` | — | — | — | All | Create hook; `setAccessToken` + `getAdminMeApi()` + redirect `/admin` |
| 6 | `store/admin-auth.store.ts` | — | — | — | — | — | Create Zustand store with `can(roles[])` helper |
| 7 | `lib/admin-axios.ts` | — | — | — | — | — | Create separate Axios instance; silent refresh interceptor |
| 8 | `middleware.ts` | — | — | — | — | — | Create route protection for `/admin/**` paths |
| **ADMIN PRODUCTS** | | | | | | | |
| 9 | `features/admin-products/api/admin-products.api.ts` | `/admin/products/` | GET | `?status=&category_id=&q=&page=&sort=` | `{items[], total, pages}` | All | Create `getAdminProductsApi()` |
| 10 | `features/admin-products/api/admin-products.api.ts` | `/admin/products/` | POST | full product snake_case object | `{uuid, title...}` | Ops, Super | Create `createProductApi()` with camelCase→snake_case |
| 11 | `features/admin-products/api/admin-products.api.ts` | `/admin/products/{id}` | GET | — | full product + variants + images + care | All | Create `getAdminProductApi()` |
| 12 | `features/admin-products/api/admin-products.api.ts` | `/admin/products/{id}` | PUT | partial product update | updated product | Ops, Super, Inventory | Create `updateProductApi()` |
| 13 | `features/admin-products/api/admin-products.api.ts` | `/admin/products/{id}` | DELETE | — | `{message}` | Super | Create `deleteProductApi()` |
| 14 | `features/admin-products/api/admin-products.api.ts` | `/admin/products/{id}/images` | POST | FormData: `{image, position}` | `{id, url, position}` | Ops, Super | Create `uploadProductImageApi()` — multipart |
| 15 | `features/admin-products/api/admin-products.api.ts` | `/admin/products/{id}/images/{img_id}` | DELETE | — | `{message}` | Ops, Super | Create `deleteProductImageApi()` |
| 16 | `features/admin-products/api/admin-products.api.ts` | `/admin/products/{id}/variants` | POST | variant snake_case object | new variant | Ops, Super | Create `createVariantApi()` |
| 17 | `features/admin-products/api/admin-products.api.ts` | `/admin/products/variants/{id}` | PUT | variant fields | updated variant | Ops, Super, Inventory | Create `updateVariantApi()` |
| 18 | `features/admin-products/api/admin-products.api.ts` | `/admin/products/variants/{id}` | DELETE | — | `{message}` | Ops, Super | Create `deleteVariantApi()` |
| 19 | `features/admin-products/hooks/useAdminProducts.ts` | all product APIs | — | — | — | — | Create all 5 hooks |
| 20 | `app/(dashboard)/products/page.tsx` | via `useAdminProducts` | — | — | — | — | Wire filters from URL params |
| 21 | `app/(dashboard)/products/new/page.tsx` | via `useCreateProduct` | — | — | — | — | Create page; wire form |
| 22 | `app/(dashboard)/products/[id]/edit/page.tsx` | via `useAdminProduct` + `useUpdateProduct` | — | — | — | — | Create page; wire form; image upload |
| **ADMIN ORDERS** | | | | | | | |
| 23 | `features/admin-orders/api/admin-orders.api.ts` | `/admin/orders/` | GET | `?status=&payment_status=&q=&page=&sort=` | `{items[], total}` | Support, Ops, Super | Create `getAdminOrdersApi()` |
| 24 | `features/admin-orders/api/admin-orders.api.ts` | `/admin/orders/{uuid}` | GET | — | full order + items + history + notes | Support, Ops, Super | Create `getAdminOrderApi()` |
| 25 | `features/admin-orders/api/admin-orders.api.ts` | `/admin/orders/{uuid}/fulfill` | POST | `{tracking_number, carrier, notify_customer}` | `{message}` | Ops, Super | Create `fulfillOrderApi()` |
| 26 | `features/admin-orders/api/admin-orders.api.ts` | `/admin/orders/{uuid}/cancel` | POST | `{reason}` | `{message}` | Ops, Super | Create `cancelOrderApi()` |
| 27 | `features/admin-orders/api/admin-orders.api.ts` | `/admin/orders/{uuid}/refund` | POST | `{amount, reason, type}` | `{message}` | Ops, Super | Create `refundOrderApi()` |
| 28 | `features/admin-orders/api/admin-orders.api.ts` | `/admin/orders/{uuid}/notes` | POST | `{note, is_internal}` | new note | Support, Ops, Super | Create `addOrderNoteApi()` |
| 29 | `features/admin-orders/api/admin-orders.api.ts` | `/admin/orders/{uuid}/tracking` | PATCH | `{tracking_number, carrier}` | updated order | Ops, Super | Create `updateOrderTrackingApi()` |
| 30 | `features/admin-orders/hooks/useAdminOrders.ts` | all order APIs | — | — | — | — | Create 6 hooks; auto-poll detail every 30s |
| 31 | `app/(dashboard)/orders/page.tsx` | via `useAdminOrders` | — | — | — | — | Wire status tab filter; auto-refresh 60s |
| 32 | `app/(dashboard)/orders/[uuid]/page.tsx` | via `useAdminOrder` + action hooks | — | — | — | — | Create detail page; fulfil/cancel/refund panels |
| **ADMIN CUSTOMERS** | | | | | | | |
| 33 | `features/admin-customers/api/admin-customers.api.ts` | `/admin/customers/` | GET | `?segment=&q=&tier=&status=&page=` | `{items[], total}` | Support, Ops, Super, Marketing | Create `getAdminCustomersApi()` |
| 34 | `features/admin-customers/api/admin-customers.api.ts` | `/admin/customers/{uuid}` | GET | — | full customer + loyalty + addresses | Support, Ops, Super | Create `getAdminCustomerApi()` |
| 35 | `features/admin-customers/api/admin-customers.api.ts` | `/admin/customers/{uuid}` | PATCH | profile fields snake_case | updated customer | Support, Ops, Super | Create `updateCustomerApi()` |
| 36 | `features/admin-customers/api/admin-customers.api.ts` | `/admin/customers/{uuid}/block` | POST | `{reason}` | `{message}` | Ops, Super | Create `blockCustomerApi()` |
| 37 | `features/admin-customers/api/admin-customers.api.ts` | `/admin/customers/{uuid}/unblock` | POST | — | `{message}` | Ops, Super | Create `unblockCustomerApi()` |
| 38 | `features/admin-customers/api/admin-customers.api.ts` | `/admin/customers/{uuid}` | DELETE | — | `{message}` | Super | Create `deleteCustomerApi()` |
| 39 | `features/admin-customers/api/admin-customers.api.ts` | `/admin/customers/{uuid}/points` | POST | `{points, reason}` | `{balance_after}` | Support, Ops, Super | Create `adjustPointsApi()` |
| 40 | `features/admin-customers/api/admin-customers.api.ts` | `/admin/customers/{uuid}/tier` | PATCH | `{tier, reason}` | `{tier}` | Ops, Super | Create `changeTierApi()` |
| 41 | `features/admin-customers/api/admin-customers.api.ts` | `/admin/customers/{uuid}/notes` | POST | `{note}` | new note | Support, Ops, Super | Create `addCustomerNoteApi()` |
| 42 | `features/admin-customers/api/admin-customers.api.ts` | `/admin/customers/{uuid}/orders` | GET | `?page=` | `{items[], total}` | Support, Ops, Super | Create `getCustomerOrdersApi()` |
| 43 | `features/admin-customers/hooks/useAdminCustomers.ts` | all customer APIs | — | — | — | — | Create 7 hooks |
| 44 | `app/(dashboard)/customers/page.tsx` | via `useAdminCustomers` | — | — | — | — | Wire segment tabs + filters |
| 45 | `app/(dashboard)/customers/[uuid]/page.tsx` | via `useAdminCustomer` + action hooks | — | — | — | — | Create detail page with 6 tabs |
| **ADMIN INVENTORY** | | | | | | | |
| 46 | `features/admin-inventory/api/admin-inventory.api.ts` | `/admin/inventory/` | GET | `?q=&low_stock=&out_of_stock=` | `{items[], total}` | Ops, Super, Inventory | Create `getInventoryApi()` |
| 47 | `features/admin-inventory/api/admin-inventory.api.ts` | `/admin/inventory/{variant_id}` | PATCH | `{quantity, reorder_level, stock_policy}` | updated inventory | Ops, Super, Inventory | Create `updateInventoryApi()` |
| 48 | `features/admin-inventory/api/admin-inventory.api.ts` | `/admin/inventory/{variant_id}/adjust` | POST | `{type, quantity_change, reason}` | `{quantity_after}` | Ops, Super, Inventory | Create `adjustInventoryApi()` |
| 49 | `features/admin-inventory/hooks/useAdminInventory.ts` | all inventory APIs | — | — | — | — | Create 3 hooks; auto-refresh 2 min |
| 50 | `app/(dashboard)/inventory/page.tsx` | via `useAdminInventory` | — | — | — | — | Wire low-stock filter; adjust modal |
| **ADMIN DISCOUNTS** | | | | | | | |
| 51 | `features/admin-discounts/api/admin-discounts.api.ts` | `/admin/discounts/` | GET | `?status=&type=&method=&q=&page=` | `{items[], total}` | All | Create `getAdminDiscountsApi()` |
| 52 | `features/admin-discounts/api/admin-discounts.api.ts` | `/admin/discounts/` | POST | full discount payload | `{uuid, code}` | Ops, Super, Marketing | Create `createDiscountApi()` with `toSnakeCase()` helper |
| 53 | `features/admin-discounts/api/admin-discounts.api.ts` | `/admin/discounts/{uuid}` | GET | — | full discount | All | Create `getAdminDiscountApi()` |
| 54 | `features/admin-discounts/api/admin-discounts.api.ts` | `/admin/discounts/{uuid}` | PUT | partial discount update | updated discount | Ops, Super, Marketing | Create `updateDiscountApi()` |
| 55 | `features/admin-discounts/api/admin-discounts.api.ts` | `/admin/discounts/{uuid}` | DELETE | — | `{message}` | Ops, Super | Create `deleteDiscountApi()` |
| 56 | `features/admin-discounts/api/admin-discounts.api.ts` | `/admin/discounts/{uuid}/activate` | POST | — | `{status}` | Ops, Super, Marketing | Create `activateDiscountApi()` |
| 57 | `features/admin-discounts/api/admin-discounts.api.ts` | `/admin/discounts/{uuid}/deactivate` | POST | — | `{status}` | Ops, Super, Marketing | Create `deactivateDiscountApi()` |
| 58 | `features/admin-discounts/api/admin-discounts.api.ts` | `/admin/discounts/{uuid}/duplicate` | POST | `{new_code}` | new discount | Ops, Super, Marketing | Create `duplicateDiscountApi()` |
| 59 | `features/admin-discounts/api/admin-discounts.api.ts` | `/admin/discounts/{uuid}/report` | GET | `?date_from=&date_to=` | usage report | Analyst, Ops, Super | Create `getDiscountReportApi()` |
| 60 | `features/admin-discounts/api/admin-discounts.api.ts` | `/admin/discounts/check-code` | GET | `?code=&exclude_id=` | `{available: boolean}` | Ops, Super, Marketing | Create `checkDiscountCodeApi()` — live uniqueness check |
| 61 | `features/admin-discounts/hooks/useAdminDiscounts.ts` | all discount APIs | — | — | — | — | Create 7 hooks |
| 62 | `app/(dashboard)/discounts/page.tsx` | via `useAdminDiscounts` | — | — | — | — | Wire status filter tabs |
| 63 | `app/(dashboard)/discounts/new/page.tsx` | via `useCreateDiscount` | — | — | — | — | Create multi-section form |
| 64 | `app/(dashboard)/discounts/[uuid]/page.tsx` | via `useAdminDiscount` + action hooks | — | — | — | — | Create edit + activate + report page |
| **ADMIN REVIEWS** | | | | | | | |
| 65 | `features/admin-reviews/api/admin-reviews.api.ts` | `/admin/reviews/` | GET | `?status=pending&q=&page=` | `{items[], total}` | Support, Ops, Super, Marketing | Create `getAdminReviewsApi()` |
| 66 | `features/admin-reviews/api/admin-reviews.api.ts` | `/admin/reviews/{uuid}/approve` | POST | `{is_featured}` | `{status}` | Support, Ops, Super | Create `approveReviewApi()` |
| 67 | `features/admin-reviews/api/admin-reviews.api.ts` | `/admin/reviews/{uuid}/reject` | POST | `{rejection_reason, notify_customer}` | `{status}` | Support, Ops, Super | Create `rejectReviewApi()` |
| 68 | `features/admin-reviews/api/admin-reviews.api.ts` | `/admin/reviews/{uuid}/reply` | POST | `{reply}` | `{reply}` | Support, Ops, Super, Marketing | Create `replyToReviewApi()` |
| 69 | `features/admin-reviews/api/admin-reviews.api.ts` | `/admin/reviews/{uuid}/reply` | PUT | `{reply}` | updated reply | Support, Ops, Super, Marketing | Create `updateReviewReplyApi()` |
| 70 | `features/admin-reviews/api/admin-reviews.api.ts` | `/admin/reviews/{uuid}/reply` | DELETE | — | `{message}` | Support, Ops, Super | Create `deleteReviewReplyApi()` |
| 71 | `features/admin-reviews/api/admin-reviews.api.ts` | `/admin/reviews/{uuid}/feature` | POST | `{is_featured}` | `{is_featured}` | Ops, Super, Marketing | Create `featureReviewApi()` |
| 72 | `features/admin-reviews/api/admin-reviews.api.ts` | `/admin/reviews/{uuid}` | DELETE | — | `{message}` | Ops, Super | Create `deleteReviewApi()` |
| 73 | `features/admin-reviews/api/admin-reviews.api.ts` | `/admin/reviews/{uuid}/photos/{id}` | DELETE | — | `{message}` | Support, Ops, Super | Create `deleteReviewPhotoApi()` |
| 74 | `features/admin-reviews/hooks/useAdminReviews.ts` | all review APIs | — | — | — | — | Create 6 hooks; shared `useInvalidateReviews()` |
| 75 | `app/(dashboard)/reviews/page.tsx` | via all review hooks | — | — | — | — | Default status=pending (moderation queue) |
| **ADMIN ANALYTICS** | | | | | | | |
| 76 | `features/admin-analytics/api/admin-analytics.api.ts` | `/admin/analytics/overview` | GET | `?date_from=&date_to=&granularity=` | all KPI metrics | Analyst, Marketing, Ops, Super | Create `getOverviewApi()` |
| 77 | `features/admin-analytics/api/admin-analytics.api.ts` | `/admin/analytics/revenue/chart` | GET | same params | `{data[{date, revenue, orders, aov}]}` | Analyst, Ops, Super | Create `getRevenueChartApi()` |
| 78 | `features/admin-analytics/api/admin-analytics.api.ts` | `/admin/analytics/orders` | GET | same params | orders section data | Analyst, Ops, Super | Create `getOrdersAnalyticsApi()` |
| 79 | `features/admin-analytics/api/admin-analytics.api.ts` | `/admin/analytics/products/top` | GET | same + `limit=` | `{data[{product_id, title, revenue, units}]}` | Analyst, Ops, Super | Create `getTopProductsApi()` |
| 80 | `features/admin-analytics/api/admin-analytics.api.ts` | `/admin/analytics/products/zero-sales` | GET | same params | `{data[]}` | Analyst, Ops, Super | Create `getZeroSalesProductsApi()` |
| 81 | `features/admin-analytics/api/admin-analytics.api.ts` | `/admin/analytics/customers/overview` | GET | same params | customer KPIs | Analyst, Marketing, Ops, Super | Create `getCustomerAnalyticsApi()` |
| 82 | `features/admin-analytics/api/admin-analytics.api.ts` | `/admin/analytics/customers/cohort` | GET | same params | cohort grid | Analyst, Ops, Super | Create `getCustomerCohortApi()` |
| 83 | `features/admin-analytics/api/admin-analytics.api.ts` | `/admin/analytics/marketing` | GET | same params | discount + campaign metrics | Analyst, Marketing, Ops, Super | Create `getMarketingAnalyticsApi()` |
| 84 | `features/admin-analytics/api/admin-analytics.api.ts` | `/admin/analytics/garden` | GET | same params | garden KPIs | Garden, Ops, Super | Create `getGardenAnalyticsApi()` |
| 85 | `features/admin-analytics/api/admin-analytics.api.ts` | `/admin/analytics/export` | GET | same + `section=&format=` | Blob (file download) | Analyst, Ops, Super | Create `exportAnalyticsApi()` — `responseType: "blob"` |
| 86 | `features/admin-analytics/hooks/useAdminAnalytics.ts` | all analytics APIs | — | — | — | — | Create 6 hooks; shared `analyticsParams` from URL |
| 87 | `app/(dashboard)/analytics/page.tsx` | via all analytics hooks | — | — | — | — | All charts share same date params from URL |
| **ADMIN AI CARE** | | | | | | | |
| 88 | `features/admin-ai-care/api/admin-ai-care.api.ts` | `/admin/ai-care/metrics` | GET | `?date_from=&date_to=` | dashboard metrics | Analyst, Ops, Super | Create `getAiCareMetricsApi()` |
| 89 | `features/admin-ai-care/api/admin-ai-care.api.ts` | `/admin/ai-care/queries` | GET | `?status=&has_photo=&rating=&page=` | `{items[], total}` | Ops, Super | Create `getAiCareQueriesApi()` |
| 90 | `features/admin-ai-care/api/admin-ai-care.api.ts` | `/admin/ai-care/queries/{id}` | GET | — | full session + messages[] | Ops, Super | Create `getAiCareQueryApi()` |
| 91 | `features/admin-ai-care/api/admin-ai-care.api.ts` | `/admin/ai-care/queries/{id}/flag` | POST | `{flag_reason}` | `{status}` | Ops, Super | Create `flagAiQueryApi()` |
| 92 | `features/admin-ai-care/api/admin-ai-care.api.ts` | `/admin/ai-care/queries/{id}/review` | POST | `{outcome, notes}` | `{status}` | Ops, Super | Create `reviewAiQueryApi()` |
| 93 | `features/admin-ai-care/api/admin-ai-care.api.ts` | `/admin/ai-care/queries/{id}` | DELETE | — | `{message}` | Super | Create `deleteAiQueryApi()` |
| 94 | `features/admin-ai-care/api/admin-ai-care.api.ts` | `/admin/ai-care/settings` | GET | — | settings object | Ops, Super | Create `getAiCareSettingsApi()` |
| 95 | `features/admin-ai-care/api/admin-ai-care.api.ts` | `/admin/ai-care/settings` | PUT | settings snake_case | updated settings | Ops, Super | Create `updateAiCareSettingsApi()` |
| 96 | `features/admin-ai-care/hooks/useAdminAiCare.ts` | all AI care APIs | — | — | — | — | Create 5 hooks |
| 97 | `app/(dashboard)/ai-care/page.tsx` | via `useAiCareMetrics` + `useAiCareQueries` | — | — | — | — | Dashboard + query log with drawer |
| **ADMIN GARDEN SERVICES** | | | | | | | |
| 98 | `features/admin-garden/api/admin-garden.api.ts` | `/admin/garden-services/bookings` | GET | `?status=&city=&gardener_id=&page=` | `{items[], total}` | Garden, Ops, Super | Create `getAdminBookingsApi()` |
| 99 | `features/admin-garden/api/admin-garden.api.ts` | `/admin/garden-services/bookings/{uuid}` | GET | — | full booking | Garden, Ops, Super | Create `getAdminBookingApi()` |
| 100 | `features/admin-garden/api/admin-garden.api.ts` | `/admin/garden-services/bookings/{uuid}` | PATCH | `{status, assigned_gardener_id}` | updated booking | Garden, Ops, Super | Create `updateBookingApi()` |
| 101 | `features/admin-garden/api/admin-garden.api.ts` | `/admin/garden-services/gardeners` | GET | — | `{gardeners[]}` | Garden, Ops, Super | Create `getGardenersApi()` |
| 102 | `features/admin-garden/api/admin-garden.api.ts` | `/admin/garden-services/gardeners` | POST | gardener snake_case | new gardener | Ops, Super | Create `createGardenerApi()` |
| 103 | `features/admin-garden/api/admin-garden.api.ts` | `/admin/garden-services/gardeners/{id}` | PATCH | gardener fields | updated gardener | Ops, Super | Create `updateGardenerApi()` |
| 104 | `features/admin-garden/api/admin-garden.api.ts` | `/admin/garden-services/types` | GET | — | `{types[]}` | Garden, Ops, Super | Create `getServiceTypesApi()` |
| 105 | `features/admin-garden/api/admin-garden.api.ts` | `/admin/garden-services/types` | POST | service type data | new type | Ops, Super | Create `createServiceTypeApi()` |
| 106 | `features/admin-garden/hooks/useAdminGarden.ts` | all garden APIs | — | — | — | — | Create 5 hooks |
| 107 | `app/(dashboard)/garden-services/page.tsx` | via `useAdminBookings` | — | — | — | — | Booking list with assign gardener |
| **ADMIN STAFF** | | | | | | | |
| 108 | `features/admin-staff/api/admin-staff.api.ts` | `/admin/staff/` | GET | — | `{staff[]}` | Super only | Create `getStaffApi()` |
| 109 | `features/admin-staff/api/admin-staff.api.ts` | `/admin/staff/` | POST | `{first_name, last_name, email, password, role}` | new admin | Super only | Create `createStaffApi()` |
| 110 | `features/admin-staff/api/admin-staff.api.ts` | `/admin/staff/{uuid}` | GET | — | staff member detail | Super only | Create `getStaffMemberApi()` |
| 111 | `features/admin-staff/api/admin-staff.api.ts` | `/admin/staff/{uuid}` | PATCH | `{role, is_active}` | updated member | Super only | Create `updateStaffApi()` |
| 112 | `features/admin-staff/api/admin-staff.api.ts` | `/admin/staff/{uuid}` | DELETE | — | `{message}` | Super only | Create `deleteStaffApi()` |
| 113 | `features/admin-staff/api/admin-staff.api.ts` | `/admin/staff/{uuid}/activate` | POST | — | `{is_active: true}` | Super only | Create `activateStaffApi()` |
| 114 | `features/admin-staff/api/admin-staff.api.ts` | `/admin/staff/{uuid}/deactivate` | POST | — | `{is_active: false}` | Super only | Create `deactivateStaffApi()` |
| 115 | `features/admin-staff/hooks/useAdminStaff.ts` | all staff APIs | — | — | — | — | Create 4 hooks |
| 116 | `app/(dashboard)/staff/page.tsx` | via `useAdminStaff` | — | — | — | — | Role-gated (super_admin only) |


---

## 14. Role-Based Access Control in Components

### 14.1 Role Guard Component (`src/components/RoleGuard.tsx`)

```typescript
// CREATE FILE — wrap any admin component/page to restrict by role
"use client";
import { useAdminAuthStore } from "@/store/admin-auth.store";
import { ROLES } from "@/lib/permissions";

interface RoleGuardProps {
  roles: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGuard({
  roles,
  children,
  fallback = null,
}: RoleGuardProps) {
  const { can } = useAdminAuthStore();
  if (!can(roles)) return <>{fallback}</>;
  return <>{children}</>;
}

// USAGE IN ANY PAGE OR COMPONENT:
// <RoleGuard roles={ROLES.OPS_ABOVE}>
//   <button onClick={handleFulfil}>Mark as Fulfilled</button>
// </RoleGuard>
//
// <RoleGuard roles={ROLES.SUPER_ONLY} fallback={<p>No permission</p>}>
//   <DeleteButton />
// </RoleGuard>
```

### 14.2 Hook-Level Role Check

```typescript
// In any hook, guard destructive actions:
export function useDeleteProduct() {
  const { can } = useAdminAuthStore();
  const qc = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (productId: string) => {
      // Extra client-side guard (server enforces too)
      if (!can(ROLES.SUPER_ONLY)) {
        throw new Error("Insufficient permissions.");
      }
      return deleteProductApi(productId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      router.push("/admin/products");
    },
  });
}
```

### 14.3 Sidebar Navigation with Role-Based Items (`src/components/AdminSidebar.tsx`)

```typescript
// CHANGE: filter nav items based on current admin role
"use client";
import { useAdminAuthStore } from "@/store/admin-auth.store";
import { ROLES } from "@/lib/permissions";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Dashboard",        href: "/admin",                   roles: ROLES.ALL },
  { label: "Products",         href: "/admin/products",          roles: ROLES.ALL },
  { label: "Orders",           href: "/admin/orders",            roles: ROLES.SUPPORT_ABOVE },
  { label: "Customers",        href: "/admin/customers",         roles: ROLES.SUPPORT_ABOVE },
  { label: "Inventory",        href: "/admin/inventory",         roles: ROLES.INVENTORY },
  { label: "Discounts",        href: "/admin/discounts",         roles: [...ROLES.OPS_ABOVE, "marketing"] },
  { label: "Reviews",          href: "/admin/reviews",           roles: ROLES.SUPPORT_ABOVE },
  { label: "Analytics",        href: "/admin/analytics",         roles: ROLES.ANALYST },
  { label: "AI Care",          href: "/admin/ai-care",           roles: ROLES.ANALYST },
  { label: "Garden Services",  href: "/admin/garden-services",   roles: ROLES.GARDEN },
  { label: "Staff",            href: "/admin/staff",             roles: ROLES.SUPER_ONLY },
];

export function AdminSidebar() {
  const { can, admin } = useAdminAuthStore();
  const pathname = usePathname();

  const visibleItems = NAV_ITEMS.filter((item) => can(item.roles));

  return (
    <aside className="w-60 min-h-screen bg-[#161b22] border-r border-[#444c56]">
      {/* Admin user info */}
      <div className="p-4 border-b border-[#444c56]">
        <p className="text-sm font-semibold text-[#cdd9e5]">
          {admin?.firstName} {admin?.lastName}
        </p>
        <p className="text-xs text-[#768390] capitalize">
          {admin?.role?.replace("_", " ")}
        </p>
      </div>

      {/* Nav items */}
      <nav aria-label="Admin navigation">
        <ul>
          {visibleItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={[
                  "flex items-center px-4 py-3 text-sm font-medium transition-colors",
                  pathname.startsWith(item.href) && item.href !== "/admin"
                    ? "bg-[#22272e] text-[#00b566] border-l-2 border-[#00b566]"
                    : "text-[#adbac7] hover:bg-[#22272e] hover:text-[#cdd9e5]",
                ].join(" ")}
                aria-current={
                  pathname === item.href ? "page" : undefined
                }
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
```

---

## 15. Admin Error Handling

### 15.1 Admin Error Message Mapper (`src/lib/admin-errors.ts`)

```typescript
// CREATE FILE
export function getAdminErrorMessage(error: unknown): string {
  const err = error as any;
  const detail = err?.response?.data?.detail;
  const status = err?.response?.status;

  if (status === 400) return typeof detail === "string" ? detail : "Invalid request.";
  if (status === 401) return "Session expired. Please log in again.";
  if (status === 403) return "You don't have permission to do this.";
  if (status === 404) return "Not found.";
  if (status === 409) return typeof detail === "string" ? detail : "Conflict — resource already exists.";
  if (status === 422) {
    if (Array.isArray(detail)) {
      return detail.map((e: any) => `${e.loc?.slice(-1)[0]}: ${e.msg}`).join(", ");
    }
    return "Validation error. Please check your input.";
  }
  if (status === 429) return "Too many requests. Please wait.";
  if (status >= 500) return "Server error. Please try again or contact support.";
  if (typeof detail === "string") return detail;
  return "An unexpected error occurred.";
}

// USE IN MUTATIONS:
// onError: (error) => toast.error(getAdminErrorMessage(error))
```

### 15.2 Admin Toast Usage Pattern

```typescript
// All admin mutations follow this pattern:
import { toast } from "sonner";
import { getAdminErrorMessage } from "@/lib/admin-errors";

export function useFulfillOrder(orderUuid: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => fulfillOrderApi(orderUuid, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-order", orderUuid] });
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Order fulfilled successfully.");
    },
    onError: (error) => {
      toast.error(getAdminErrorMessage(error));
    },
  });
}
```

### 15.3 Optimistic Updates (for fast UI in Orders & Reviews)

```typescript
// For approve review — optimistic: update status locally before server confirms
export function useApproveReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ uuid, isFeatured }: { uuid: string; isFeatured?: boolean }) =>
      approveReviewApi(uuid, isFeatured),

    // Optimistic update
    onMutate: async ({ uuid }) => {
      await qc.cancelQueries({ queryKey: ["admin-reviews"] });
      const prev = qc.getQueryData(["admin-reviews"]);

      qc.setQueryData(["admin-reviews"], (old: any) => ({
        ...old,
        items: old?.items?.map((r: any) =>
          r.uuid === uuid ? { ...r, status: "published" } : r
        ),
      }));

      return { prev };
    },
    onError: (_, __, ctx) => {
      // Roll back on error
      qc.setQueryData(["admin-reviews"], ctx?.prev);
    },
    onSettled: () => {
      // Always refetch to sync with server
      qc.invalidateQueries({ queryKey: ["admin-reviews"] });
    },
  });
}
```

---

## 16. Admin Data Flow Diagrams

### 16.1 Admin Login → Dashboard Flow

```
Admin fills LoginForm
       │
       ▼
useAdminLogin.login(email, password)
       │
       ▼ (form-encoded — same as storefront)
adminLoginApi() → POST /admin/auth/login
       │
  ┌────┴────────────────────────────┐
  │ 200 OK                          │ 401 / 403 inactive
  │ { access_token, role }          ▼
  ▼                         Show error banner
setAccessToken(token)
globalThis.__adminAccessToken = token
       │
       ▼ then
getAdminMeApi() → GET /admin/auth/me
       │
       ▼
setAdmin({ uuid, firstName, role, ... })
       │
       ▼
router.push("/admin")
       │
       ▼ AdminSidebar
can(roles) filters nav items by role
```

### 16.2 Order Fulfillment Flow

```
Admin opens order detail
/admin/orders/[uuid]
       │
       ▼
useAdminOrder(uuid) → GET /admin/orders/{uuid}
Polls every 30s (refetchInterval)
       │
       ▼ Admin fills fulfillment form
[tracking_number, carrier, notify_customer]
       │
       ▼ clicks [Mark as Fulfilled]
useFulfillOrder.mutate(data)
       │
       ▼
fulfillOrderApi(uuid, data)
→ POST /admin/orders/{uuid}/fulfill
{
  tracking_number: "SR-8821",
  carrier: "Shiprocket",
  notify_customer: true
}
       │
  ┌────┴────────────────────────────────────┐
  │ 200 OK                                  │ 400 already fulfilled
  ▼                                         ▼
invalidateQueries(["admin-order", uuid])   toast.error(message)
invalidateQueries(["admin-orders"])
toast.success("Order fulfilled.")
UI updates: status → "dispatched"
```

### 16.3 Discount Code Uniqueness Check Flow

```
Admin types discount code in create form
       │ (debounced 500ms)
       ▼
checkDiscountCodeApi(code, excludeId?)
→ GET /admin/discounts/check-code?code=HERO20
       │
  ┌────┴──────────────────────┐
  │ { available: true }       │ { available: false }
  ▼                           ▼
Green ✓ border on input    Red ✗ border + error:
"Code is available"        "Code already in use by '[name]'"
```

### 16.4 Analytics Date Range → All Charts Update Flow

```
Admin selects date range on Analytics page
       │
       ▼ URL updates:
/admin/analytics?from=2026-07-01&to=2026-07-31&g=daily
       │
       ▼ All chart hooks re-run (queryKey includes params):
useAnalyticsOverview(params)    → GET /admin/analytics/overview?date_from=...
useRevenueChart(params)         → GET /admin/analytics/revenue/chart?...
useTopProducts(params)          → GET /admin/analytics/products/top?...
useCustomerAnalytics(params)    → GET /admin/analytics/customers/overview?...
useMarketingAnalytics(params)   → GET /admin/analytics/marketing?...
       │
       ▼ All return simultaneously (parallel queries)
All charts update with new data
Skeletons shown while loading
```

---

## 17. Complete Admin Folder Structure

```
admin/src/
├── app/
│   ├── layout.tsx                           CHANGE: wrap <Providers>, dark theme
│   ├── providers.tsx                        CREATE: TanStack Query + dark theme CSS
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx                     CREATE: AdminLoginForm page
│   └── (dashboard)/
│       ├── layout.tsx                       CREATE: AdminSidebar + AdminTopBar
│       ├── page.tsx                         CHANGE: wire useAnalyticsOverview KPIs
│       ├── products/
│       │   ├── page.tsx                     CHANGE: wire useAdminProducts
│       │   ├── new/page.tsx                 CREATE: create product form
│       │   └── [id]/edit/page.tsx           CREATE: edit product + images
│       ├── orders/
│       │   ├── page.tsx                     CHANGE: wire useAdminOrders, status tabs
│       │   └── [uuid]/page.tsx              CREATE: detail + fulfil/cancel/refund
│       ├── customers/
│       │   ├── page.tsx                     CHANGE: wire useAdminCustomers
│       │   └── [uuid]/page.tsx              CREATE: detail 6-tab page
│       ├── inventory/
│       │   └── page.tsx                     CREATE: low-stock table + adjust modal
│       ├── discounts/
│       │   ├── page.tsx                     CHANGE: wire useAdminDiscounts
│       │   ├── new/page.tsx                 CREATE: multi-section discount form
│       │   └── [uuid]/page.tsx              CREATE: edit + activate + report
│       ├── reviews/
│       │   └── page.tsx                     CHANGE: default pending queue
│       ├── analytics/
│       │   └── page.tsx                     CHANGE: wire all 6 analytics hooks
│       ├── ai-care/
│       │   └── page.tsx                     CREATE: metrics dashboard + query log
│       ├── garden-services/
│       │   └── page.tsx                     CREATE: bookings + assign gardener
│       └── staff/
│           └── page.tsx                     CREATE: super_admin only — staff list
│
├── features/
│   ├── admin-auth/
│   │   ├── api/admin-auth.api.ts            CREATE: 4 auth API functions
│   │   ├── components/AdminLoginForm.tsx    CREATE: email + password + role display
│   │   └── hooks/useAdminLogin.ts           CREATE
│   ├── admin-products/
│   │   ├── api/admin-products.api.ts        CREATE: 9 API functions (incl. variants)
│   │   └── hooks/useAdminProducts.ts        CREATE: 5 hooks
│   ├── admin-orders/
│   │   ├── api/admin-orders.api.ts          CREATE: 7 API functions
│   │   └── hooks/useAdminOrders.ts          CREATE: 6 hooks
│   ├── admin-customers/
│   │   ├── api/admin-customers.api.ts       CREATE: 10 API functions
│   │   └── hooks/useAdminCustomers.ts       CREATE: 7 hooks
│   ├── admin-inventory/
│   │   ├── api/admin-inventory.api.ts       CREATE: 3 API functions
│   │   └── hooks/useAdminInventory.ts       CREATE: 3 hooks
│   ├── admin-discounts/
│   │   ├── api/admin-discounts.api.ts       CREATE: 10 API functions + toSnakeCase helper
│   │   └── hooks/useAdminDiscounts.ts       CREATE: 7 hooks
│   ├── admin-reviews/
│   │   ├── api/admin-reviews.api.ts         CREATE: 9 API functions
│   │   └── hooks/useAdminReviews.ts         CREATE: 6 hooks + shared invalidator
│   ├── admin-analytics/
│   │   ├── api/admin-analytics.api.ts       CREATE: 10 API functions + toDateParams helper
│   │   └── hooks/useAdminAnalytics.ts       CREATE: 6 hooks
│   ├── admin-ai-care/
│   │   ├── api/admin-ai-care.api.ts         CREATE: 8 API functions
│   │   └── hooks/useAdminAiCare.ts          CREATE: 5 hooks
│   ├── admin-garden/
│   │   ├── api/admin-garden.api.ts          CREATE: 8 API functions
│   │   └── hooks/useAdminGarden.ts          CREATE: 5 hooks
│   └── admin-staff/
│       ├── api/admin-staff.api.ts           CREATE: 7 API functions
│       └── hooks/useAdminStaff.ts           CREATE: 4 hooks
│
├── store/
│   └── admin-auth.store.ts                  CREATE: Zustand with can() helper
│
├── lib/
│   ├── admin-axios.ts                       CREATE: separate instance + interceptors
│   ├── admin-query-client.ts                CREATE: TanStack Query client
│   ├── permissions.ts                       CREATE: ROLES map + PERMISSIONS
│   └── admin-errors.ts                      CREATE: error message mapper
│
├── components/
│   ├── AdminSidebar.tsx                     CREATE: role-filtered nav
│   ├── AdminTopBar.tsx                      CREATE: user info + logout
│   ├── RoleGuard.tsx                        CREATE: wrap any component
│   └── ErrorBoundary.tsx                    CREATE: admin error boundary
│
└── middleware.ts                            CREATE: /admin route protection
```

---

## 18. Quick Reference — Admin API Rules

```typescript
// ── All admin requests go through: ───────────────────────────────────
BASE: process.env.NEXT_PUBLIC_ADMIN_API_URL + "/api/v1"

// ── Admin login: form-encoded (same as storefront login) ─────────────
POST /admin/auth/login
headers: { "Content-Type": "application/x-www-form-urlencoded" }
body: new URLSearchParams({ username: email, password })

// ── All other requests: JSON ──────────────────────────────────────────
headers: { "Content-Type": "application/json" }
Authorization: "Bearer <admin_access_token>"   // added by interceptor

// ── File uploads (product images, etc.) ──────────────────────────────
headers: { "Content-Type": "multipart/form-data" }
body: FormData

// ── File downloads (analytics export) ────────────────────────────────
{ responseType: "blob" }  // on the Axios request config

// ── Field naming convention ───────────────────────────────────────────
// Backend expects snake_case:  first_name, product_type, date_from
// Frontend uses camelCase:     firstName, productType, dateFrom
// Convert in API layer ONLY — never in components or hooks

// ── Tokens ───────────────────────────────────────────────────────────
// Admin access token: memory only (globalThis.__adminAccessToken)
// Admin refresh token: HttpOnly cookie (sent via withCredentials: true)
// SEPARATE from storefront tokens — different Axios instance, different store

// ── Query invalidation pattern ────────────────────────────────────────
// After any mutation, invalidate the list AND the detail:
qc.invalidateQueries({ queryKey: ["admin-orders"] });           // list
qc.invalidateQueries({ queryKey: ["admin-order", uuid] });     // detail

// ── Analytics query key convention ───────────────────────────────────
// Always include full params in key — queries auto-refetch on param change:
queryKey: ["analytics-revenue-chart", { dateFrom, dateTo, granularity }]

// ── Auto-polling ──────────────────────────────────────────────────────
// Orders list:   refetchInterval: 60 * 1000      (every 60s)
// Order detail:  refetchInterval: 30 * 1000      (every 30s)
// Inventory:     refetchInterval: 2 * 60 * 1000  (every 2 min)
// Analytics:     staleTime: 5 * 60 * 1000        (5 min cache, no poll)
// Reviews queue: staleTime: 30 * 1000            (30s cache)
```

---

## 19. Final Summary

```
Admin Frontend ↔ Backend API Connection Map v1.0
════════════════════════════════════════════════════════════════════
FILES TO CREATE:   48 new files
FILES TO CHANGE:   6 existing files
TOTAL ENDPOINTS:   116 admin API endpoint connections
TOTAL API FUNCS:   78 typed API functions
TOTAL HOOKS:       48 custom React hooks
TOTAL STORES:      1 Zustand store (admin auth with can() helper)
TOTAL ROLE CHECKS: 7 distinct role groups mapped to endpoints

MODULE BREAKDOWN:
  Admin Auth         4 endpoints  · 1 hook  · 1 store
  Products           9 endpoints  · 5 hooks  (incl. variants + images)
  Orders             7 endpoints  · 6 hooks  (auto-poll 30s/60s)
  Customers         10 endpoints  · 7 hooks
  Inventory          3 endpoints  · 3 hooks  (auto-refresh 2min)
  Discounts         10 endpoints  · 7 hooks  (incl. code check + report)
  Reviews            9 endpoints  · 6 hooks  (optimistic updates)
  Analytics         10 endpoints  · 6 hooks  (shared date params)
  AI Care            8 endpoints  · 5 hooks
  Garden Services    8 endpoints  · 5 hooks
  Staff              7 endpoints  · 4 hooks  (super_admin only)

KEY ARCHITECTURAL RULES:
  ✓ Admin Axios (adminApi) is 100% separate from storefront api
  ✓ Admin access token stored at globalThis.__adminAccessToken (memory)
  ✓ Admin refresh token in HttpOnly cookie (withCredentials: true)
  ✓ Silent refresh on 401 with request queue (no race conditions)
  ✓ Login is application/x-www-form-urlencoded (FastAPI OAuth2)
  ✓ File uploads use FormData (product images, exports use blob)
  ✓ Backend snake_case ↔ Frontend camelCase in API layer only
  ✓ All mutations invalidate both list + detail query keys
  ✓ Role checks at component level (RoleGuard) + hook level + server
  ✓ Reviews use optimistic updates for fast moderation UX
  ✓ Analytics hooks share date params from URL (all charts sync)
  ✓ Orders + Inventory auto-poll (real-time feel without WebSockets)
  ✓ Discount code uniqueness checked live on blur (checkDiscountCodeApi)
  ✓ Analytics export uses responseType: "blob" for file download
  ✓ Default reviews page status = pending (moderation queue first)
  ✓ Sidebar nav items filtered by role using can() store method

════════════════════════════════════════════════════════════════════
Last updated: June 2026
```

---

*Document version: 1.0 (complete) — Admin Frontend API Connection Map*
*Stack: Next.js 14 · TypeScript · TanStack Query · Axios · Zustand*
*Backend: FastAPI · MySQL 8.0 · Redis · Celery*
*Last updated: June 2026*
