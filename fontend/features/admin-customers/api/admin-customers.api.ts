import { adminApi } from "@/lib/admin-axios";

export type CustomerTier = "plant_lover" | "silver" | "gold";
export type CustomerStatus = "active" | "new" | "at_risk" | "blocked" | "unverified";

export interface AdminCustomerFilters {
  segment?: string;
  q?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
  loyaltyTier?: CustomerTier;
  status?: CustomerStatus;
  city?: string;
}

export interface AdminCustomer {
  uuid: string; first_name: string; last_name: string; email: string; phone?: string | null;
  email_verified: boolean; phone_verified: boolean; is_active: boolean; is_blocked: boolean;
  created_at: string; last_login_at?: string | null; city?: string | null; tier: CustomerTier;
  loyalty_points: number; orders: number; ltv: number; last_order_at?: string | null; status: CustomerStatus;
  dob?: string | null; gender?: string | null; about_me?: string | null; avatar_url?: string | null;
  preferred_lang?: string; currency?: string; blocked_reason?: string | null; blocked_at?: string | null;
  addresses?: Array<{ id: string; type: "home" | "work" | "other"; is_default: boolean; line1: string; line2?: string | null; city: string; state: string; pincode: string; country: string }>;
  admin_notes?: Array<{ id: string; author: string; text: string; date: string }>;
}

export interface AdminCustomerListResponse { items: AdminCustomer[]; total: number; page: number; page_size: number; pages: number; has_next: boolean; has_prev: boolean; }
export interface CustomerOrder { uuid: string; order_number: string; created_at: string; total: number; status: string; payment_status: string; items: number; }

export async function getAdminCustomersApi(filters: AdminCustomerFilters = {}): Promise<AdminCustomerListResponse> {
  const { data } = await adminApi.get("/admin/customers/", { params: {
    segment: filters.segment, q: filters.q, sort: filters.sort ?? "newest", page: filters.page ?? 1,
    page_size: filters.pageSize ?? 25, loyalty_tier: filters.loyaltyTier, status: filters.status, city: filters.city,
  }});
  return data;
}
export async function getAdminCustomerApi(uuid: string): Promise<AdminCustomer> { return (await adminApi.get(`/admin/customers/${uuid}`)).data; }
export async function updateCustomerApi(uuid: string, data: { firstName?: string; lastName?: string; phone?: string; dob?: string; gender?: string; aboutMe?: string; preferredLang?: string }) {
  return (await adminApi.patch(`/admin/customers/${uuid}`, { first_name: data.firstName, last_name: data.lastName, phone: data.phone, dob: data.dob, gender: data.gender, about_me: data.aboutMe, preferred_lang: data.preferredLang })).data;
}
export async function blockCustomerApi(uuid: string, reason: string) { return (await adminApi.post(`/admin/customers/${uuid}/block`, { reason })).data; }
export async function unblockCustomerApi(uuid: string) { return (await adminApi.post(`/admin/customers/${uuid}/unblock`)).data; }
export async function deleteCustomerApi(uuid: string) { return (await adminApi.delete(`/admin/customers/${uuid}`)).data; }
export async function adjustPointsApi(uuid: string, points: number, reason: string) { return (await adminApi.post(`/admin/customers/${uuid}/points`, { points, reason })).data; }
export async function changeTierApi(uuid: string, tier: CustomerTier, reason?: string) { return (await adminApi.patch(`/admin/customers/${uuid}/tier`, { tier, reason })).data; }
export async function addCustomerNoteApi(uuid: string, note: string) { return (await adminApi.post(`/admin/customers/${uuid}/notes`, { note })).data; }
export async function getCustomerOrdersApi(uuid: string, page = 1) { return (await adminApi.get(`/admin/customers/${uuid}/orders`, { params: { page } })).data as { items: CustomerOrder[]; total: number }; }
