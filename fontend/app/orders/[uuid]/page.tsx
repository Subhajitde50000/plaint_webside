"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import SharedNavbar from "@/components/Navbar";
import { useOrder } from "@/features/orders/hooks/useOrder";
import { useCancelOrder } from "@/features/orders/hooks/useCancelOrder";
import { useReturnOrder } from "@/features/orders/hooks/useReturnOrder";
import {
  ORDER_STATUS_META, CANCELLABLE_STATUSES, RETURNABLE_STATUSES,
} from "@/features/orders/types/order.types";
import type { Order, OrderStatus } from "@/features/orders/types/order.types";

/* ── Design tokens ──────────────────────────────────────────────────────── */
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
  red:         "#dc2626",
  redBg:       "rgba(220,38,38,0.07)",
  amber:       "#d97706",
  shadow:      "0 2px 12px rgba(0,0,0,0.05)",
  shadowHover: "0 8px 28px rgba(0,181,102,0.10)",
  radius:      "16px",
  radiusSm:    "10px",
};

/* ── Helpers ────────────────────────────────────────────────────────────── */
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function formatPrice(val: string | number) {
  return `₹${parseFloat(String(val)).toLocaleString("en-IN", {
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  })}`;
}

/* ── Status Stepper ─────────────────────────────────────────────────────── */
const STATUS_STEPS: { status: OrderStatus; label: string; emoji: string }[] = [
  { status: "order_placed",      label: "Order Placed",      emoji: "📦" },
  { status: "payment_confirmed", label: "Payment Confirmed", emoji: "✅" },
  { status: "processing",        label: "Processing",        emoji: "⚙️" },
  { status: "shipped",           label: "Shipped",           emoji: "🚚" },
  { status: "out_for_delivery",  label: "Out for Delivery",  emoji: "🏃" },
  { status: "delivered",         label: "Delivered",         emoji: "🎉" },
];

const STATUS_ORDER: Record<string, number> = {
  order_placed: 0, payment_confirmed: 1, processing: 2,
  shipped: 3, out_for_delivery: 4, delivered: 5,
};

function StatusStepper({ status }: { status: OrderStatus }) {
  const isCancelled = status === "cancelled" || status === "return_requested" || status === "refunded";
  const currentIdx = STATUS_ORDER[status] ?? -1;

  if (isCancelled) {
    const meta = ORDER_STATUS_META[status];
    return (
      <div style={{
        background: meta.bg, border: `1.5px solid ${meta.color}22`,
        borderRadius: T.radiusSm, padding: "16px 20px",
        display: "flex", alignItems: "center", gap: 12, color: meta.color,
      }}>
        <span style={{ fontSize: 24 }}>{meta.emoji}</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>{meta.label}</div>
          <div style={{ fontSize: 13, opacity: 0.8 }}>This order was {status.replace("_", " ")}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ overflowX: "auto", paddingBottom: 8 }}>
      <div style={{
        display: "flex", alignItems: "flex-start", minWidth: 480,
        gap: 0, position: "relative",
      }}>
        {STATUS_STEPS.map((step, idx) => {
          const done = currentIdx > idx;
          const active = currentIdx === idx;
          return (
            <div key={step.status} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
              {/* Connector line */}
              {idx < STATUS_STEPS.length - 1 && (
                <div style={{
                  position: "absolute", top: 18, left: "50%", right: "-50%",
                  height: 3, borderRadius: 2,
                  background: done ? T.green : "rgba(0,0,0,0.08)",
                  transition: "background 0.3s",
                }} />
              )}
              {/* Circle */}
              <div style={{
                width: 36, height: 36, borderRadius: "50%", zIndex: 1,
                background: done || active ? T.green : "#f0ede8",
                border: active ? `3px solid ${T.greenMid}` : "3px solid transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: done ? 16 : 14,
                color: done || active ? "#fff" : T.muted,
                fontWeight: 700,
                boxShadow: active ? `0 0 0 4px rgba(0,181,102,0.2)` : "none",
                transition: "all 0.3s",
              }}>
                {done ? "✓" : step.emoji}
              </div>
              {/* Label */}
              <div style={{
                fontSize: 11, fontWeight: active ? 700 : done ? 600 : 400,
                color: active ? T.green : done ? T.body : T.muted,
                marginTop: 6, textAlign: "center", lineHeight: 1.3,
              }}>
                {step.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Section Card ───────────────────────────────────────────────────────── */
function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: T.bgCard, border: `1.5px solid ${T.border}`,
      borderRadius: T.radius, overflow: "hidden", boxShadow: T.shadow,
    }}>
      <div style={{
        padding: "14px 20px", borderBottom: `1px solid ${T.border}`,
        background: T.bgMuted,
      }}>
        <h2 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: T.muted, letterSpacing: "0.05em", textTransform: "uppercase" }}>
          {title}
        </h2>
      </div>
      <div style={{ padding: "20px" }}>{children}</div>
    </div>
  );
}

/* ── Modal ──────────────────────────────────────────────────────────────── */
function Modal({
  title, isOpen, onClose, children,
}: { title: string; isOpen: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!isOpen) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
    }}
      onClick={onClose}
    >
      <div
        style={{
          background: T.bgCard, borderRadius: T.radius,
          padding: 28, width: "100%", maxWidth: 460, boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 700, color: T.heading }}>
          {title}
        </h3>
        {children}
      </div>
    </div>
  );
}

/* ── Cancel Modal ───────────────────────────────────────────────────────── */
function CancelModal({
  isOpen, onClose, onConfirm, isLoading,
}: { isOpen: boolean; onClose: () => void; onConfirm: (reason: string) => void; isLoading: boolean }) {
  const [reason, setReason] = useState("");
  const reasons = ["Changed my mind", "Found a better price", "Ordered by mistake", "Delivery too slow", "Other"];

  return (
    <Modal title="Cancel Order" isOpen={isOpen} onClose={onClose}>
      <p style={{ color: T.muted, fontSize: 14, marginBottom: 16 }}>
        Please tell us why you're cancelling. This helps us improve.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
        {reasons.map((r) => (
          <label key={r} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14, color: T.body }}>
            <input type="radio" name="cancel-reason" value={r} onChange={() => setReason(r)}
              style={{ accentColor: T.green }} />
            {r}
          </label>
        ))}
        <textarea
          placeholder="Or type a custom reason…"
          value={reasons.includes(reason) ? "" : reason}
          onChange={(e) => setReason(e.target.value)}
          rows={2}
          style={{
            width: "100%", padding: "10px 12px", borderRadius: 8,
            border: `1.5px solid ${T.border}`, fontSize: 13, resize: "none",
            color: T.body, fontFamily: "inherit", marginTop: 4,
          }}
        />
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button id="btn-cancel-modal-close" onClick={onClose} style={{
          padding: "10px 20px", borderRadius: 8, border: `1.5px solid ${T.border}`,
          background: "transparent", fontWeight: 600, fontSize: 14, cursor: "pointer",
          color: T.body,
        }}>
          Keep Order
        </button>
        <button
          id="btn-cancel-confirm"
          disabled={!reason.trim() || isLoading}
          onClick={() => onConfirm(reason)}
          style={{
            padding: "10px 20px", borderRadius: 8, border: "none",
            background: !reason.trim() || isLoading ? "#f0ede8" : T.red,
            color: !reason.trim() || isLoading ? T.muted : "#fff",
            fontWeight: 700, fontSize: 14, cursor: !reason.trim() || isLoading ? "default" : "pointer",
          }}
        >
          {isLoading ? "Cancelling…" : "Cancel Order"}
        </button>
      </div>
    </Modal>
  );
}

/* ── Return Modal ───────────────────────────────────────────────────────── */
function ReturnModal({
  isOpen, onClose, onConfirm, isLoading,
}: { isOpen: boolean; onClose: () => void; onConfirm: (reason: string, type: string, note: string) => void; isLoading: boolean }) {
  const [reason, setReason] = useState("Damaged product");
  const [returnType, setReturnType] = useState("refund");
  const [note, setNote] = useState("");
  const reasons = ["Damaged product", "Wrong item received", "Product not as described", "Quality issue", "Other"];

  return (
    <Modal title="Request Return" isOpen={isOpen} onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 16 }}>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: T.muted, display: "block", marginBottom: 6 }}>
            Reason
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            style={{
              width: "100%", padding: "10px 12px", borderRadius: 8,
              border: `1.5px solid ${T.border}`, fontSize: 14, color: T.body,
              fontFamily: "inherit", background: "#fff",
            }}
          >
            {reasons.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: T.muted, display: "block", marginBottom: 6 }}>
            Resolution
          </label>
          <div style={{ display: "flex", gap: 10 }}>
            {["refund", "exchange"].map((t) => (
              <button
                key={t}
                onClick={() => setReturnType(t)}
                style={{
                  flex: 1, padding: "10px", borderRadius: 8, border: "1.5px solid",
                  borderColor: returnType === t ? T.green : T.border,
                  background: returnType === t ? T.greenPale : "#fff",
                  color: returnType === t ? T.green : T.body,
                  fontWeight: returnType === t ? 700 : 500, fontSize: 14,
                  cursor: "pointer", textTransform: "capitalize",
                }}
              >
                {t === "refund" ? "💸 Refund" : "🔄 Exchange"}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: T.muted, display: "block", marginBottom: 6 }}>
            Additional note (optional)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Describe the issue in more detail…"
            rows={2}
            style={{
              width: "100%", padding: "10px 12px", borderRadius: 8,
              border: `1.5px solid ${T.border}`, fontSize: 13, resize: "none",
              color: T.body, fontFamily: "inherit",
            }}
          />
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button id="btn-return-modal-close" onClick={onClose} style={{
          padding: "10px 20px", borderRadius: 8, border: `1.5px solid ${T.border}`,
          background: "transparent", fontWeight: 600, fontSize: 14, cursor: "pointer", color: T.body,
        }}>
          Cancel
        </button>
        <button
          id="btn-return-confirm"
          disabled={isLoading}
          onClick={() => onConfirm(reason, returnType, note)}
          style={{
            padding: "10px 20px", borderRadius: 8, border: "none",
            background: isLoading ? "#f0ede8" : T.amber,
            color: isLoading ? T.muted : "#fff",
            fontWeight: 700, fontSize: 14, cursor: isLoading ? "default" : "pointer",
          }}
        >
          {isLoading ? "Submitting…" : "Submit Return"}
        </button>
      </div>
    </Modal>
  );
}

/* ── Main Page ──────────────────────────────────────────────────────────── */
export default function OrderDetailPage() {
  const params = useParams();
  const orderUuid = params?.uuid as string;

  const { order, isLoading, isError, isFetching } = useOrder(orderUuid);
  const { cancelOrder, isCancelling, isSuccess: cancelDone } = useCancelOrder(orderUuid);
  const { requestReturn, isRequesting, isSuccess: returnDone } = useReturnOrder(orderUuid);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleCancel = (reason: string) => {
    cancelOrder(reason, {
      onSuccess: () => { setShowCancelModal(false); showToast("Order cancelled successfully", "success"); },
      onError: () => showToast("Could not cancel order. Please try again.", "error"),
    });
  };

  const handleReturn = (reason: string, returnType: string, note: string) => {
    requestReturn({ reason, return_type: returnType, customer_note: note }, {
      onSuccess: () => { setShowReturnModal(false); showToast("Return request submitted!", "success"); },
      onError: () => showToast("Could not submit return. Please try again.", "error"),
    });
  };

  const canCancel = order && CANCELLABLE_STATUSES.includes(order.status);
  const canReturn = order && RETURNABLE_STATUSES.includes(order.status);

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'Outfit', 'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
      `}</style>

      <SharedNavbar />

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)",
          zIndex: 2000, padding: "14px 24px", borderRadius: 12,
          background: toast.type === "success" ? "#1b4332" : T.red,
          color: "#fff", fontWeight: 600, fontSize: 14,
          boxShadow: "0 8px 24px rgba(0,0,0,0.18)", whiteSpace: "nowrap",
        }}>
          {toast.type === "success" ? "✅ " : "⚠️ "}{toast.msg}
        </div>
      )}

      {/* Modals */}
      <CancelModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancel}
        isLoading={isCancelling}
      />
      <ReturnModal
        isOpen={showReturnModal}
        onClose={() => setShowReturnModal(false)}
        onConfirm={handleReturn}
        isLoading={isRequesting}
      />

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 16px 80px" }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: 13, color: T.muted, marginBottom: 20 }}>
          <Link href="/" style={{ color: T.muted, textDecoration: "none" }}>Home</Link>
          {" "}›{" "}
          <Link href="/orders" style={{ color: T.muted, textDecoration: "none" }}>My Orders</Link>
          {" "}›{" "}
          <span style={{ color: T.body }}>Order #{order?.order_number ?? "…"}</span>
        </div>

        {/* Loading */}
        {isLoading && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{
                background: T.bgCard, border: `1.5px solid ${T.border}`,
                borderRadius: T.radius, height: i === 1 ? 120 : 160,
              }} />
            ))}
          </div>
        )}

        {/* Error */}
        {isError && (
          <div style={{
            background: T.redBg, border: `1.5px solid ${T.red}33`,
            borderRadius: T.radiusSm, padding: "20px", color: T.red, textAlign: "center",
          }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>⚠️</div>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Order not found</div>
            <div style={{ fontSize: 13 }}>This order doesn't exist or doesn't belong to your account.</div>
            <Link href="/orders" style={{ display: "inline-block", marginTop: 14, color: T.green, fontWeight: 600, textDecoration: "none" }}>
              ← Back to Orders
            </Link>
          </div>
        )}

        {/* Order content */}
        {order && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Header */}
            <div style={{
              background: T.bgCard, border: `1.5px solid ${T.border}`,
              borderRadius: T.radius, padding: "22px 24px", boxShadow: T.shadow,
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: T.heading, letterSpacing: "-0.02em" }}>
                      Order #{order.order_number}
                    </h1>
                    {isFetching && (
                      <span style={{ fontSize: 11, color: T.muted, background: T.bgMuted, padding: "3px 8px", borderRadius: 6 }}>
                        Refreshing…
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 13, color: T.muted }}>
                    Placed on {formatDate(order.created_at)}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {canCancel && (
                    <button
                      id="btn-cancel-order"
                      onClick={() => setShowCancelModal(true)}
                      style={{
                        padding: "9px 16px", borderRadius: 8, fontSize: 13, fontWeight: 700,
                        border: `1.5px solid ${T.red}44`, background: T.redBg,
                        color: T.red, cursor: "pointer",
                      }}
                    >
                      Cancel Order
                    </button>
                  )}
                  {canReturn && (
                    <button
                      id="btn-return-order"
                      onClick={() => setShowReturnModal(true)}
                      style={{
                        padding: "9px 16px", borderRadius: 8, fontSize: 13, fontWeight: 700,
                        border: `1.5px solid ${T.amber}44`, background: "rgba(217,119,6,0.07)",
                        color: T.amber, cursor: "pointer",
                      }}
                    >
                      Return / Refund
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Status stepper */}
            <SectionCard title="Order Status">
              <StatusStepper status={order.status} />
              {order.tracking_number && (
                <div style={{
                  marginTop: 20, padding: "14px 16px", borderRadius: 10,
                  background: T.greenPale, border: `1px solid ${T.greenBorder}`,
                  display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
                }}>
                  <span style={{ fontSize: 20 }}>🚚</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: T.green }}>
                      {order.shipping_carrier ?? "Courier"} — {order.tracking_number}
                    </div>
                    {order.estimated_delivery && (
                      <div style={{ fontSize: 12, color: T.muted }}>
                        Est. delivery: {new Date(order.estimated_delivery).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </div>
                    )}
                  </div>
                  {order.tracking_url && (
                    <a
                      href={order.tracking_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      id="btn-track-shipment"
                      style={{
                        padding: "8px 14px", borderRadius: 8, background: T.green,
                        color: "#fff", fontSize: 13, fontWeight: 700, textDecoration: "none",
                      }}
                    >
                      Track Shipment →
                    </a>
                  )}
                </div>
              )}
            </SectionCard>

            {/* Items */}
            <SectionCard title={`Items (${order.items.length})`}>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {order.items.map((item, idx) => (
                  <div key={item.id ?? idx} style={{
                    display: "flex", alignItems: "center", gap: 14,
                    paddingBottom: idx < order.items.length - 1 ? 16 : 0,
                    borderBottom: idx < order.items.length - 1 ? `1px solid ${T.border}` : "none",
                  }}>
                    {/* Image */}
                    <div style={{
                      width: 60, height: 60, borderRadius: 10,
                      background: T.bgMuted, overflow: "hidden", flexShrink: 0,
                      border: `1.5px solid ${T.border}`,
                    }}>
                      {item.image_url
                        ? <img src={item.image_url} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>🌿</div>
                      }
                    </div>
                    {/* Details */}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: T.heading, marginBottom: 2 }}>{item.title}</div>
                      {item.variant_title && (
                        <div style={{ fontSize: 12, color: T.muted }}>{item.variant_title}</div>
                      )}
                      <div style={{ fontSize: 12, color: T.muted }}>SKU: {item.sku}</div>
                    </div>
                    {/* Qty & price */}
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: T.heading }}>
                        {formatPrice(item.total_price)}
                      </div>
                      <div style={{ fontSize: 12, color: T.muted }}>
                        {formatPrice(item.unit_price)} × {item.quantity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* Cost Summary */}
            <SectionCard title="Payment Summary">
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { label: "Subtotal", value: order.subtotal },
                  { label: "Discount", value: `-${formatPrice(order.discount_amount)}`, color: T.green },
                  { label: "Shipping", value: parseFloat(order.shipping_amount) === 0 ? "Free" : formatPrice(order.shipping_amount), color: parseFloat(order.shipping_amount) === 0 ? T.green : undefined },
                  { label: "Tax", value: order.tax_amount },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: T.body }}>
                    <span style={{ color: T.muted }}>{label}</span>
                    <span style={{ color: color ?? T.body }}>
                      {typeof value === "string" && value.startsWith("-") ? value : (typeof value === "string" && !value.startsWith("₹") && value !== "Free") ? formatPrice(value) : value}
                    </span>
                  </div>
                ))}
                {order.discount_code && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                    <span style={{ color: T.muted }}>Coupon</span>
                    <span style={{
                      background: T.greenPale, color: T.green, padding: "2px 8px",
                      borderRadius: 6, fontWeight: 700, fontSize: 12,
                    }}>
                      {order.discount_code}
                    </span>
                  </div>
                )}
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  fontSize: 16, fontWeight: 800, color: T.heading,
                  paddingTop: 12, borderTop: `2px solid ${T.border}`, marginTop: 4,
                }}>
                  <span>Total</span>
                  <span style={{ color: T.green }}>{formatPrice(order.total)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: T.muted }}>Payment Status</span>
                  <span style={{
                    fontWeight: 700, color: order.payment_status === "paid" ? T.green : T.amber,
    textTransform: "capitalize",
                  }}>
                    {order.payment_status}
                  </span>
                </div>
                {order.payment_gateway && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                    <span style={{ color: T.muted }}>Payment via</span>
                    <span style={{ color: T.body, textTransform: "capitalize" }}>{order.payment_gateway}</span>
                  </div>
                )}
              </div>
            </SectionCard>

            {/* Status History */}
            {order.status_history.length > 0 && (
              <SectionCard title="Order Timeline">
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {[...order.status_history].reverse().map((entry, idx) => (
                    <div key={idx} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: "50%",
                        background: idx === 0 ? T.greenPale : T.bgMuted,
                        border: `2px solid ${idx === 0 ? T.green : T.border}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 13, flexShrink: 0,
                      }}>
                        {ORDER_STATUS_META[entry.status as OrderStatus]?.emoji ?? "📋"}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 13, color: T.heading }}>
                          {ORDER_STATUS_META[entry.status as OrderStatus]?.label ?? entry.status}
                        </div>
                        {entry.description && (
                          <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{entry.description}</div>
                        )}
                        <div style={{ fontSize: 11, color: T.muted, marginTop: 4 }}>
                          {formatDate(entry.created_at)}
                          {entry.location && ` · ${entry.location}`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}

            {/* Gift message */}
            {order.is_gift && order.gift_message && (
              <SectionCard title="Gift Message">
                <div style={{
                  fontSize: 14, color: T.body, fontStyle: "italic",
                  lineHeight: 1.6, padding: "4px 0",
                }}>
                  🎁 "{order.gift_message}"
                </div>
              </SectionCard>
            )}

            {/* Actions footer */}
            <div style={{ display: "flex", gap: 12, justifyContent: "center", paddingTop: 8 }}>
              <Link href="/orders" id="btn-back-to-orders" style={{
                padding: "12px 24px", borderRadius: 10, border: `1.5px solid ${T.border}`,
                background: T.bgCard, fontWeight: 700, fontSize: 14, textDecoration: "none",
                color: T.body, display: "inline-block",
              }}>
                ← All Orders
              </Link>
              <Link href="/" id="btn-continue-shopping" style={{
                padding: "12px 24px", borderRadius: 10, border: "none",
                background: T.green, color: "#fff", fontWeight: 700, fontSize: 14,
                textDecoration: "none", display: "inline-block",
                boxShadow: "0 4px 14px rgba(0,181,102,0.28)",
              }}>
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
