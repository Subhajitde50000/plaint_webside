import type { AdminCustomer, CustomerOrder } from "@/features/admin-customers";

export type CustomerStatus = "active" | "new" | "at_risk" | "blocked" | "unverified";
export type CustomerTier = "plant_lover" | "silver" | "gold";
export interface Address { id: string; type: "home" | "work" | "other"; isDefault: boolean; line1: string; city: string; state: string; pincode: string; }
export interface AdminNote { id: string; author: string; authorInitials: string; date: string; text: string; }
export interface Order { id: string; date: string; items: number; total: string; payment: "paid" | "pending" | "failed" | "refunded"; status: "delivered" | "shipped" | "processing" | "cancelled" | "returned"; }
export interface Review { id: string; product: string; productImg: string; rating: number; text: string; date: string; status: "published" | "pending" | "rejected"; }
export interface AICareQuery { id: string; datetime: string; query: string; hasPhoto: boolean; rating: "helpful" | "unhelpful" | null; converted: boolean; }
export interface GardenBooking { id: string; service: string; date: string; status: "confirmed" | "completed" | "cancelled" | "pending"; }
export interface ActivityEntry { id: string; datetime: string; actor: string; action: string; type: "order" | "account" | "admin" | "system" | "loyalty"; }
export interface WishlistItem { id: string; name: string; price: string; img: string; }
export interface RecentlyViewedItem { id: string; name: string; price: string; date: string; img: string; }
export interface SearchEntry { query: string; datetime: string; }
export interface CartItem { id: string; name: string; price: string; quantity: number; img: string; }
export interface Customer {
  id: string; customerId: string; firstName: string; lastName: string; email: string; phone: string; emailVerified: boolean; phoneVerified: boolean; avatar?: string;
  city: string; state: string; tier: CustomerTier; status: CustomerStatus; loyaltyPoints: number; loyaltyPointsToNext: number; nextTier: string;
  orders: number; ltv: string; ltvRaw: number; aov: string; returnRate: string; reviewCount: number; lastOrder: string; joined: string; lastLogin: string;
  tags: string[]; marketingEmail: boolean; marketingSms: boolean; language: string; source: string; petOwner: boolean; aiCareUser: boolean; gardenClient: boolean;
  favouriteCategory: string; avgDaysBetweenOrders: number; preferredPayment: string; deviceUsed: string; discountUsage: string;
  orderHistory: Order[]; reviews: Review[]; aiCareQueries: AICareQuery[]; gardenBookings: GardenBooking[]; activityLog: ActivityEntry[]; addresses: Address[]; adminNotes: AdminNote[];
  wishlist: WishlistItem[]; recentlyViewed: RecentlyViewedItem[]; searchHistory: SearchEntry[]; cart: CartItem[];
}
const date = (value?: string | null) => value ? new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value)) : "—";
const money = (value: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
const orderStatus = (status: string): Order["status"] => status.includes("deliver") || status === "completed" ? "delivered" : status.includes("ship") || status.includes("transit") ? "shipped" : status.includes("cancel") ? "cancelled" : status.includes("return") ? "returned" : "processing";

/** Maps the backend contract to the existing presentational components. No client-side demo records are used. */
export function customerFromApi(value: AdminCustomer, apiOrders: CustomerOrder[] = []): Customer {
  const tierTargets = { plant_lover: 500, silver: 2000, gold: 0 } as const;
  const nextTier = value.tier === "plant_lover" ? "Silver" : value.tier === "silver" ? "Gold" : "Gold (Max)";
  const addresses = (value.addresses ?? []).map(a => ({ id: a.id, type: a.type, isDefault: a.is_default, line1: a.line1, city: a.city, state: a.state, pincode: a.pincode }));
  return {
    id: value.uuid, customerId: value.uuid, firstName: value.first_name, lastName: value.last_name, email: value.email, phone: value.phone ?? "—",
    emailVerified: value.email_verified, phoneVerified: value.phone_verified, avatar: value.avatar_url ?? undefined,
    city: value.city ?? addresses.find(a => a.isDefault)?.city ?? "—", state: addresses.find(a => a.isDefault)?.state ?? "—",
    tier: value.tier, status: value.status, loyaltyPoints: value.loyalty_points, loyaltyPointsToNext: Math.max(0, tierTargets[value.tier] - value.loyalty_points), nextTier,
    orders: value.orders, ltv: money(value.ltv), ltvRaw: value.ltv, aov: value.orders ? money(value.ltv / value.orders) : "—", returnRate: "—", reviewCount: 0,
    lastOrder: date(value.last_order_at), joined: date(value.created_at), lastLogin: date(value.last_login_at), tags: [], marketingEmail: false, marketingSms: false,
    language: value.preferred_lang ?? "en", source: "—", petOwner: false, aiCareUser: false, gardenClient: false, favouriteCategory: "—", avgDaysBetweenOrders: 0, preferredPayment: "—", deviceUsed: "—", discountUsage: "—",
    orderHistory: apiOrders.map(order => ({ id: order.order_number, date: date(order.created_at), items: order.items, total: money(order.total), payment: order.payment_status === "paid" ? "paid" : order.payment_status === "refunded" ? "refunded" : order.payment_status === "failed" ? "failed" : "pending", status: orderStatus(order.status) })),
    reviews: [], aiCareQueries: [], gardenBookings: [], activityLog: [], addresses,
    adminNotes: (value.admin_notes ?? []).map(note => ({ id: note.id, author: note.author, authorInitials: note.author.slice(0, 2).toUpperCase(), date: date(note.date), text: note.text })),
    wishlist: [], recentlyViewed: [], searchHistory: [], cart: [],
  };
}
