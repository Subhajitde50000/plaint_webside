"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import SharedNavbar from "@/components/Navbar";
import { useMyOrders } from "@/features/orders/hooks/useMyOrders";
import { useAuthStore } from "@/store/auth.store";
import { ORDER_STATUS_META } from "@/features/orders/types/order.types";
import type { OrderListItem } from "@/features/orders/types/order.types";

/* ── Design tokens ────────────────────────────────────────────────────────── */
const T = {
  bg:          "#fefcf9",
  bgCard:      "#ffffff",
  bgMuted:     "#f7f5f0",
  green:       "#00b566",
  greenMid:    "#009952",
  greenPale:   "rgba(0,181,102,0.08)",
  greenBorder: "rgba(0,181,102,0.18)",
  heading:     "#1c1c1c",
  body:        "#333333",
  muted:       "#7c7c7c",
  border:      "rgba(0,0,0,0.07)",
  shadow:      "0 2px 12px rgba(0,0,0,0.05)",
  shadowHover: "0 8px 28px rgba(0,181,102,0.10)",
  radius:      "16px",
  radiusSm:    "10px",
};

/* ── Helpers ──────────────────────────────────────────────────────────────── */
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function formatPrice(val: string | number) {
  return `₹${parseFloat(String(val)).toLocaleString("en-IN", {
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  })}`;
}

/* ── Order Card ───────────────────────────────────────────────────────────── */
function OrderCard({ order }: { order: OrderListItem }) {
  const meta = ORDER_STATUS_META[order.status] ?? {
    label: order.status, color: "#6b7280", bg: "rgba(107,114,128,0.1)", emoji: "📦",
  };

  return (
    <Link
      href={`/orders/${order.uuid}`}
      style={{ textDecoration: "none" }}
      id={`order-card-${order.uuid}`}
    >
      <div
        style={{
          background: T.bgCard,
          border: `1.5px solid ${T.border}`,
          borderRadius: T.radius,
          padding: "20px 24px",
          display: "flex",
          alignItems: "center",
          gap: 20,
          cursor: "pointer",
          transition: "box-shadow 0.2s, border-color 0.2s, transform 0.15s",
          boxShadow: T.shadow,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = T.shadowHover;
          (e.currentTarget as HTMLDivElement).style.borderColor = T.greenBorder;
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = T.shadow;
          (e.currentTarget as HTMLDivElement).style.borderColor = T.border;
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        }}
      >
        {/* Emoji icon */}
        <div style={{
          width: 52, height: 52, borderRadius: "50%",
          background: meta.bg, display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 22, flexShrink: 0,
        }}>
          {meta.emoji}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
            <span style={{ fontWeight: 700, fontSize: 15, color: T.heading, letterSpacing: "-0.01em" }}>
              #{order.order_number}
            </span>
            <span style={{
              fontSize: 12, fontWeight: 600, padding: "3px 10px",
              borderRadius: 20, background: meta.bg, color: meta.color,
            }}>
              {meta.label}
            </span>
          </div>
          <div style={{ fontSize: 13, color: T.muted, display: "flex", gap: 16, flexWrap: "wrap" }}>
            <span>📅 {formatDate(order.created_at)}</span>
            <span>🛍️ {order.items_count} item{order.items_count !== 1 ? "s" : ""}</span>
          </div>
        </div>

        {/* Amount */}
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontWeight: 800, fontSize: 18, color: T.heading, letterSpacing: "-0.02em" }}>
            {formatPrice(order.total)}
          </div>
          <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>Total paid</div>
        </div>

        {/* Arrow */}
        <div style={{ color: T.muted, fontSize: 20, flexShrink: 0 }}>›</div>
      </div>
    </Link>
  );
}

/* ── Skeleton loader ──────────────────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div style={{
      background: T.bgCard, border: `1.5px solid ${T.border}`,
      borderRadius: T.radius, padding: "20px 24px",
      display: "flex", alignItems: "center", gap: 20,
    }}>
      <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#f0ede8", flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ width: "40%", height: 14, background: "#f0ede8", borderRadius: 6, marginBottom: 10 }} />
        <div style={{ width: "60%", height: 12, background: "#f5f3ef", borderRadius: 6 }} />
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ width: 80, height: 20, background: "#f0ede8", borderRadius: 6, marginBottom: 6 }} />
        <div style={{ width: 50, height: 12, background: "#f5f3ef", borderRadius: 6 }} />
      </div>
    </div>
  );
}

/* ── Empty State ──────────────────────────────────────────────────────────── */
function EmptyOrders() {
  return (
    <div style={{ textAlign: "center", padding: "80px 24px" }}>
      <div style={{ fontSize: 64, marginBottom: 20 }}>🌱</div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: T.heading, margin: "0 0 10px" }}>
        No orders yet
      </h2>
      <p style={{ color: T.muted, fontSize: 15, marginBottom: 28 }}>
        Start your green journey — explore our plants, seeds, soils, and more.
      </p>
      <Link
        href="/"
        id="btn-start-shopping"
        style={{
          display: "inline-block", padding: "12px 28px",
          background: T.green, color: "#fff", borderRadius: 10,
          fontWeight: 700, fontSize: 15, textDecoration: "none",
          boxShadow: "0 4px 14px rgba(0,181,102,0.28)",
          transition: "background 0.2s",
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = T.greenMid)}
        onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = T.green)}
      >
        Browse Products
      </Link>
    </div>
  );
}

/* ── Pagination ───────────────────────────────────────────────────────────── */
function Pagination({
  currentPage, totalPages, onPageChange,
}: { currentPage: number; totalPages: number; onPageChange: (p: number) => void }) {
  if (totalPages <= 1) return null;
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 32 }}>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          id={`pagination-btn-${p}`}
          onClick={() => onPageChange(p)}
          style={{
            width: 38, height: 38, borderRadius: 8, border: "1.5px solid",
            borderColor: p === currentPage ? T.green : T.border,
            background: p === currentPage ? T.green : T.bgCard,
            color: p === currentPage ? "#fff" : T.body,
            fontWeight: p === currentPage ? 700 : 500,
            fontSize: 14, cursor: "pointer", transition: "all 0.15s",
          }}
        >
          {p}
        </button>
      ))}
    </div>
  );
}

/* ── Auth wall ────────────────────────────────────────────────────────────── */
function AuthWall() {
  return (
    <div style={{ textAlign: "center", padding: "100px 24px" }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>🔒</div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: T.heading, margin: "0 0 10px" }}>
        Sign in to view your orders
      </h2>
      <p style={{ color: T.muted, fontSize: 15, marginBottom: 28 }}>
        Your order history is private and requires an account.
      </p>
      <Link
        href="/login?returnTo=/orders"
        id="btn-login-for-orders"
        style={{
          display: "inline-block", padding: "12px 28px",
          background: T.green, color: "#fff", borderRadius: 10,
          fontWeight: 700, fontSize: 15, textDecoration: "none",
          boxShadow: "0 4px 14px rgba(0,181,102,0.28)",
        }}
      >
        Sign In
      </Link>
    </div>
  );
}

/* ── Main Page ────────────────────────────────────────────────────────────── */
export default function MyOrdersPage() {
  const [page, setPage] = useState(1);
  const isHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const { isAuthenticated } = useAuthStore();
  const { orders, totalPages, isLoading, isError } = useMyOrders(page);
  const canViewOrders = isHydrated && isAuthenticated;

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'Outfit', 'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
      `}</style>

      <SharedNavbar />

      <div style={{ maxWidth: 780, margin: "0 auto", padding: "40px 16px 80px" }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 13, color: T.muted, marginBottom: 6 }}>
            <Link href="/" style={{ color: T.muted, textDecoration: "none" }}>Home</Link>
            {" "}›{" "}
            <span style={{ color: T.body }}>My Orders</span>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: T.heading, margin: 0, letterSpacing: "-0.03em" }}>
            My Orders
          </h1>
          {!isLoading && canViewOrders && orders.length > 0 && (
            <p style={{ margin: "6px 0 0", color: T.muted, fontSize: 14 }}>
              {orders.length} order{orders.length !== 1 ? "s" : ""} found
            </p>
          )}
        </div>

        {/* Auth gate */}
        {!canViewOrders && <AuthWall />}

        {/* Loading skeletons */}
        {canViewOrders && isLoading && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Error */}
        {canViewOrders && isError && (
          <div style={{
            background: "rgba(220,38,38,0.06)", border: "1.5px solid rgba(220,38,38,0.15)",
            borderRadius: T.radiusSm, padding: "18px 20px", color: "#dc2626", fontSize: 14,
          }}>
            ⚠️ Unable to load orders. Please refresh the page.
          </div>
        )}

        {/* Empty state */}
        {canViewOrders && !isLoading && !isError && orders.length === 0 && <EmptyOrders />}

        {/* Order list */}
        {canViewOrders && !isLoading && orders.length > 0 && (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {orders.map((order) => (
                <OrderCard key={order.uuid} order={order} />
              ))}
            </div>

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
