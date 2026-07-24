"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { customerFromApi, Customer, CustomerTier, CustomerStatus, Order, Review, AICareQuery, GardenBooking, ActivityEntry, AdminNote, RecentlyViewedItem, SearchEntry, CartItem } from "../data";
import { useAddCustomerNote, useAdjustPoints, useAdminCustomer, useBlockCustomer, useCustomerOrders } from "@/features/admin-customers";

/* ─── tokens ─────────────────────────────────────────────────────────────── */
const T = {
  bg: "#0f1117", card: "#1c2128", elevated: "#22272e", overlay: "#2d333b",
  text: "#cdd9e5", muted: "#768390", label: "#adbac7", placeholder: "#545d68",
  border: "#444c56", borderMuted: "rgba(68,76,86,0.5)", borderActive: "#00b566",
  accent: "#00b566", accentBg: "rgba(0,181,102,0.12)",
  success: "#57ab5a", successBg: "rgba(87,171,90,0.15)",
  warning: "#c69026", warningBg: "rgba(198,144,38,0.15)",
  error: "#e5534b", errorBg: "rgba(229,83,75,0.15)",
  info: "#539bf5", infoBg: "rgba(83,159,245,0.15)",
  purple: "#986ee2", purpleBg: "rgba(152,110,226,0.15)",
  gold: "#c69026", silver: "#adbac7", star: "#c8a84b",
  shadow: "0 2px 8px rgba(0,0,0,0.35)",
  focus: "0 0 0 3px rgba(0,181,102,0.25)",
};

/* ─── helpers ────────────────────────────────────────────────────────────── */
function getInitials(first: string, last: string) { return `${first[0]}${last[0]}`.toUpperCase(); }

function tierConfig(tier: CustomerTier) {
  if (tier === "gold")        return { icon: "🥇", label: "Gold",        color: T.gold,   bg: T.warningBg };
  if (tier === "silver")      return { icon: "🥈", label: "Silver",      color: T.silver, bg: T.infoBg };
  return                             { icon: "🌿", label: "Plant Lover", color: T.accent, bg: T.accentBg };
}

function statusConfig(status: CustomerStatus) {
  if (status === "active")    return { label: "Active",     color: T.success, bg: T.successBg };
  if (status === "new")       return { label: "New",        color: T.info,    bg: T.infoBg };
  if (status === "at_risk")   return { label: "At-Risk",    color: T.warning, bg: T.warningBg };
  if (status === "blocked")   return { label: "Blocked",    color: T.error,   bg: T.errorBg };
  return                             { label: "Unverified", color: T.muted,   bg: "rgba(84,93,104,0.15)" };
}

function orderStatusConfig(s: Order["status"]) {
  const m: Record<string, { color: string; bg: string }> = {
    delivered:  { color: T.success, bg: T.successBg },
    shipped:    { color: T.info,    bg: T.infoBg },
    processing: { color: T.warning, bg: T.warningBg },
    cancelled:  { color: T.error,   bg: T.errorBg },
    returned:   { color: T.muted,   bg: T.elevated },
  };
  return m[s] ?? { color: T.muted, bg: T.elevated };
}

function gardStatusConfig(s: GardenBooking["status"]) {
  const m: Record<string, { color: string; bg: string }> = {
    confirmed:  { color: T.success, bg: T.successBg },
    completed:  { color: T.info,    bg: T.infoBg },
    cancelled:  { color: T.error,   bg: T.errorBg },
    pending:    { color: T.warning, bg: T.warningBg },
  };
  return m[s] ?? { color: T.muted, bg: T.elevated };
}

function Stars({ rating }: { rating: number }) {
  return (
    <span style={{ display: "inline-flex", gap: 1 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ fontSize: 14, color: i <= rating ? T.star : T.border }}>★</span>
      ))}
    </span>
  );
}

function SmallBadge({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <span style={{
      display: "inline-block", padding: "2px 8px", borderRadius: 9999,
      fontSize: 11, fontWeight: 700, color, background: bg,
    }}>{label}</span>
  );
}

function Avatar({ first, last, size = 32 }: { first: string; last: string; size?: number }) {
  const colors = ["#1e4d2b","#1a3a5c","#4a1c6b","#5c3a1a","#1c4a4a"];
  const idx = (first.charCodeAt(0) + last.charCodeAt(0)) % colors.length;
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `linear-gradient(135deg, ${colors[idx]}, ${T.accent}33)`,
      border: `1.5px solid ${T.border}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.38, fontWeight: 700, color: T.accent, flexShrink: 0,
    }}>
      {getInitials(first, last)}
    </div>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: T.card, borderRadius: 8, border: `1px solid ${T.border}`,
      boxShadow: T.shadow, ...style,
    }}>{children}</div>
  );
}

function CardHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "14px 18px", borderBottom: `1px solid ${T.border}`,
    }}>
      <span style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{title}</span>
      {action}
    </div>
  );
}

function InfoRow({ label, value, valueColor }: { label: string; value: React.ReactNode; valueColor?: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, padding: "8px 18px" }}>
      <span style={{ fontSize: 13, color: T.muted, whiteSpace: "nowrap" }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: valueColor || T.text, textAlign: "right" }}>{value}</span>
    </div>
  );
}

/* ─── Modals ─────────────────────────────────────────────────────────────── */
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 299, backdropFilter: "blur(3px)" }} />
      <div role="dialog" aria-modal aria-label={title} style={{
        position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        zIndex: 300, background: T.overlay, border: `1px solid ${T.border}`,
        borderRadius: 12, width: "min(480px, 90vw)", boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
        overflow: "hidden",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: `1px solid ${T.border}` }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: T.text }}>{title}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: T.muted, cursor: "pointer", fontSize: 18 }}>×</button>
        </div>
        <div style={{ padding: "20px" }}>{children}</div>
      </div>
    </>
  );
}

function AdjustPointsModal({ customer, onClose, onApply }: { customer: Customer; onClose: () => void; onApply: (points: number, reason: string) => void }) {
  const [action, setAction] = useState<"add" | "deduct">("add");
  const [points, setPoints] = useState("");
  const [reason, setReason] = useState("");
  const numPoints = parseInt(points) || 0;
  const newBalance = action === "add"
    ? customer.loyaltyPoints + numPoints
    : Math.max(0, customer.loyaltyPoints - numPoints);

  return (
    <Modal title={`Adjust Points for ${customer.firstName} ${customer.lastName}`} onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ fontSize: 13, color: T.muted }}>Current balance: <strong style={{ color: T.accent }}>{customer.loyaltyPoints} pts</strong></div>
        <div>
          <label style={labelSt}>Action</label>
          <div style={{ display: "flex", gap: 16, marginTop: 6 }}>
            {(["add", "deduct"] as const).map(a => (
              <label key={a} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: T.text }}>
                <div onClick={() => setAction(a)} style={{
                  width: 16, height: 16, borderRadius: "50%",
                  border: `2px solid ${action === a ? T.accent : T.border}`,
                  background: action === a ? T.accent : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {action === a && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />}
                </div>
                {a.charAt(0).toUpperCase() + a.slice(1)}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label style={labelSt}>Points</label>
          <input
            type="number" value={points} onChange={e => setPoints(e.target.value)}
            placeholder="Enter points" min={0}
            style={{ ...inputSt, marginTop: 6 }}
          />
        </div>
        <div>
          <label style={labelSt}>Reason *</label>
          <input
            value={reason} onChange={e => setReason(e.target.value)}
            placeholder="e.g. Goodwill gesture"
            style={{ ...inputSt, marginTop: 6 }}
          />
        </div>
        <div aria-live="polite" style={{
          padding: "10px 14px", borderRadius: 6, background: T.elevated,
          border: `1px solid ${T.border}`, fontSize: 13, color: T.text,
        }}>
          New balance: <strong style={{ color: T.accent }}>{newBalance} pts</strong>
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ ...secondaryBtn }}>Cancel</button>
          <button
            disabled={!points || !reason}
            style={{
              padding: "9px 18px", borderRadius: 6, background: (!points || !reason) ? T.elevated : T.accent,
              border: "none", color: (!points || !reason) ? T.muted : "#fff",
              fontSize: 13, fontWeight: 700, cursor: (!points || !reason) ? "not-allowed" : "pointer",
            }}
          onClick={() => onApply(action === "add" ? numPoints : -numPoints, reason)}>Apply Adjustment</button>
        </div>
      </div>
    </Modal>
  );
}

function SendEmailModal({ customer, onClose }: { customer: Customer; onClose: () => void }) {
  const [template, setTemplate] = useState("Custom Message");
  const [subject, setSubject] = useState("A note from Hero Plants 🌿");
  const [message, setMessage] = useState("");
  const templates = ["Custom Message", "Win-Back Offer", "VIP Thank You", "Re-engagement", "Birthday Greeting", "Order Follow-Up"];

  return (
    <Modal title={`Send Email to ${customer.firstName} ${customer.lastName}`} onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label style={labelSt}>Template</label>
          <select value={template} onChange={e => setTemplate(e.target.value)} style={{ ...inputSt, marginTop: 6 }}>
            {templates.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label style={labelSt}>Subject</label>
          <input value={subject} onChange={e => setSubject(e.target.value)} style={{ ...inputSt, marginTop: 6 }} />
        </div>
        <div>
          <label style={labelSt}>Message</label>
          <textarea
            value={message} onChange={e => setMessage(e.target.value)}
            placeholder="Write your message..."
            rows={6}
            style={{ ...inputSt, marginTop: 6, resize: "vertical", minHeight: 120, fontFamily: "inherit" }}
          />
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={secondaryBtn}>Cancel</button>
          <button style={{ padding: "9px 18px", borderRadius: 6, background: T.accent, border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            Send Email
          </button>
        </div>
      </div>
    </Modal>
  );
}

function BlockModal({ customer, onClose, onBlock }: { customer: Customer; onClose: () => void; onBlock: (reason: string) => void }) {
  const [reason, setReason] = useState("");
  return (
    <Modal title={`Block ${customer.firstName} ${customer.lastName}'s account?`} onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <p style={{ fontSize: 13, color: T.muted, margin: 0 }}>They won't be able to sign in or place orders.</p>
        <div>
          <label style={labelSt}>Reason *</label>
          <textarea
            value={reason} onChange={e => setReason(e.target.value)}
            placeholder="Explain why this account is being blocked..."
            rows={3}
            style={{ ...inputSt, marginTop: 6, resize: "vertical", fontFamily: "inherit" }}
          />
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ ...secondaryBtn, fontWeight: 700 }}>Keep Active</button>
          <button disabled={!reason} style={{
            padding: "9px 18px", borderRadius: 6,
            background: !reason ? T.elevated : T.error,
            border: "none", color: !reason ? T.muted : "#fff",
            fontSize: 13, fontWeight: 700, cursor: !reason ? "not-allowed" : "pointer",
          }} onClick={() => onBlock(reason)}>Block Account</button>
        </div>
      </div>
    </Modal>
  );
}

function AddNoteModal({ onClose, onAdd }: { onClose: () => void; onAdd: (note: string) => void }) {
  const [text, setText] = useState("");
  return (
    <Modal title="Add Admin Note" onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <textarea
          value={text} onChange={e => setText(e.target.value)}
          placeholder="Write internal note..."
          rows={5}
          style={{ ...inputSt, resize: "vertical", fontFamily: "inherit" }}
        />
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={secondaryBtn}>Cancel</button>
          <button disabled={!text} style={{
            padding: "9px 18px", borderRadius: 6,
            background: !text ? T.elevated : T.accent,
            border: "none", color: !text ? T.muted : "#fff",
            fontSize: 13, fontWeight: 700, cursor: !text ? "not-allowed" : "pointer",
          }} onClick={() => onAdd(text)}>Save Note</button>
        </div>
      </div>
    </Modal>
  );
}

/* ─── Tab Panels ─────────────────────────────────────────────────────────── */

function TabOverview({ c }: { c: Customer }) {
  const [adjustOpen, setAdjustOpen] = useState(false);
  const adjustPoints = useAdjustPoints(c.id);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {adjustOpen && <AdjustPointsModal customer={c} onClose={() => setAdjustOpen(false)} onApply={(points, reason) => adjustPoints.mutate({ points, reason }, { onSuccess: () => setAdjustOpen(false) })} />}
      {/* Quick Stats */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {[
          { label: "Orders", value: c.orders },
          { label: "LTV", value: c.ltv },
          { label: "AOV", value: c.aov },
          { label: "Returns", value: c.returnRate },
          { label: "Reviews", value: c.reviewCount },
        ].map(stat => (
          <div key={stat.label} style={{
            flex: "1 1 110px", background: T.elevated, borderRadius: 8,
            border: `1px solid ${T.borderMuted}`, padding: "14px 16px",
          }}>
            <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginBottom: 4 }}>{stat.label}</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: stat.label === "LTV" ? T.accent : T.text }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader title="Recent Orders" action={
          <Link href={`/admin/customers/${c.id}#orders`} style={{ fontSize: 12, color: T.accent, textDecoration: "none" }}>View All →</Link>
        } />
        {c.orderHistory.length === 0
          ? <div style={{ padding: "28px 18px", textAlign: "center", color: T.muted, fontSize: 13 }}>No orders from this customer yet</div>
          : <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr>{["Order", "Date", "Items", "Total", "Status"].map(h =>
                  <th key={h} style={{ ...thSt, padding: "8px 14px" }}>{h}</th>
                )}</tr>
              </thead>
              <tbody>
                {c.orderHistory.slice(0, 5).map(o => {
                  const sc = orderStatusConfig(o.status);
                  return (
                    <tr key={o.id} style={{ borderTop: `1px solid ${T.borderMuted}` }}>
                      <td style={{ ...tdSt, padding: "10px 14px" }}>
                        <span style={{ fontFamily: "monospace", color: T.accent, fontSize: 12 }}>#{o.id}</span>
                      </td>
                      <td style={{ ...tdSt, padding: "10px 14px", color: T.muted }}>{o.date}</td>
                      <td style={{ ...tdSt, padding: "10px 14px", color: T.text }}>{o.items} item{o.items !== 1 ? "s" : ""}</td>
                      <td style={{ ...tdSt, padding: "10px 14px", fontWeight: 700, color: T.text }}>{o.total}</td>
                      <td style={{ ...tdSt, padding: "10px 14px" }}>
                        <SmallBadge label={o.status.charAt(0).toUpperCase() + o.status.slice(1)} color={sc.color} bg={sc.bg} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
        }
      </Card>

      {/* Wishlist */}
      {c.wishlist.length > 0 && (
        <Card>
          <CardHeader title={`Wishlist (${c.wishlist.length} items)`} action={
            <span style={{ fontSize: 12, color: T.accent, cursor: "pointer" }}>View All →</span>
          } />
          <div style={{ padding: "14px 18px", display: "flex", gap: 10, flexWrap: "wrap" }}>
            {c.wishlist.slice(0, 6).map(w => (
              <div key={w.id} title={w.name} style={{
                width: 56, height: 56, borderRadius: 6,
                background: T.elevated, border: `1px solid ${T.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 24, cursor: "pointer",
              }}>🌿</div>
            ))}
            {c.wishlist.length > 6 && <div style={{ width: 56, height: 56, borderRadius: 6, background: T.elevated, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: T.muted }}>+{c.wishlist.length - 6}</div>}
          </div>
        </Card>
      )}

      {/* Behavioural Insights */}
      <Card>
        <CardHeader title="Insights" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          {[
            { label: "Favourite category",       value: c.favouriteCategory },
            { label: "Avg days between orders",   value: `${c.avgDaysBetweenOrders} days` },
            { label: "Preferred payment",         value: c.preferredPayment },
            { label: "Device used most",          value: c.deviceUsed },
            { label: "Discount code usage",       value: c.discountUsage },
            { label: "Pet owner",                 value: c.petOwner ? "Yes (per AI Care queries)" : "No" },
            { label: "Source",                    value: c.source },
          ].map((row, i) => (
            <div key={row.label} style={{
              display: "flex", justifyContent: "space-between", gap: 12,
              padding: "9px 18px", borderTop: i > 0 ? `1px solid ${T.borderMuted}` : undefined,
            }}>
              <span style={{ fontSize: 13, color: T.muted }}>{row.label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: T.text, textAlign: "right", maxWidth: "60%" }}>{row.value}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function TabOrders({ c }: { c: Customer }) {
  return (
    <Card>
      <CardHeader title={`Orders (${c.orderHistory.length})`} action={
        <div style={{ display: "flex", gap: 8 }}>
          <select style={{ ...inputSt, padding: "5px 10px", fontSize: 12 }}><option>Sort: Newest</option></select>
          <button style={{ ...secondaryBtn, fontSize: 11, padding: "5px 10px" }}>Export</button>
        </div>
      } />
      {c.orderHistory.length === 0
        ? <div style={{ padding: "40px", textAlign: "center", color: T.muted, fontSize: 13 }}>No orders from this customer yet</div>
        : <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr>{["ORDER", "DATE", "ITEMS", "TOTAL", "PAYMENT", "STATUS", ""].map(h =>
                <th key={h} style={{ ...thSt, padding: "8px 14px" }}>{h}</th>
              )}</tr>
            </thead>
            <tbody>
              {c.orderHistory.map(o => {
                const sc = orderStatusConfig(o.status);
                const payC = o.payment === "paid" ? { color: T.success, bg: T.successBg }
                           : o.payment === "pending" ? { color: T.warning, bg: T.warningBg }
                           : o.payment === "failed" ? { color: T.error, bg: T.errorBg }
                           : { color: T.muted, bg: T.elevated };
                return (
                  <tr key={o.id} style={{ borderTop: `1px solid ${T.borderMuted}`, cursor: "pointer" }}
                    onMouseEnter={e => e.currentTarget.style.background = T.elevated}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ ...tdSt, padding: "11px 14px" }}>
                      <span style={{ fontFamily: "monospace", color: T.accent, fontSize: 12 }}>#{o.id}</span>
                    </td>
                    <td style={{ ...tdSt, padding: "11px 14px", color: T.muted }}>{o.date}</td>
                    <td style={{ ...tdSt, padding: "11px 14px", color: T.text }}>{o.items} item{o.items !== 1 ? "s" : ""}</td>
                    <td style={{ ...tdSt, padding: "11px 14px", fontWeight: 700, color: T.text }}>{o.total}</td>
                    <td style={{ ...tdSt, padding: "11px 14px" }}><SmallBadge label={o.payment.charAt(0).toUpperCase() + o.payment.slice(1)} color={payC.color} bg={payC.bg} /></td>
                    <td style={{ ...tdSt, padding: "11px 14px" }}><SmallBadge label={o.status.charAt(0).toUpperCase() + o.status.slice(1)} color={sc.color} bg={sc.bg} /></td>
                    <td style={{ ...tdSt, padding: "11px 14px" }}>
                      <Link href={`/admin/orders`} style={{ fontSize: 11, color: T.accent, textDecoration: "none", fontWeight: 600 }}>View →</Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
      }
    </Card>
  );
}

function TabReviews({ c }: { c: Customer }) {
  return (
    <Card>
      <CardHeader title={`Reviews (${c.reviews.length})`} />
      {c.reviews.length === 0
        ? <div style={{ padding: "40px", textAlign: "center", color: T.muted, fontSize: 13 }}>This customer hasn't left any reviews yet.</div>
        : <div>
            {c.reviews.map((r, i) => {
              const st = r.status === "published" ? { color: T.success, bg: T.successBg }
                       : r.status === "pending"   ? { color: T.warning, bg: T.warningBg }
                       : { color: T.error, bg: T.errorBg };
              return (
                <div key={r.id} style={{ padding: "16px 18px", borderTop: i > 0 ? `1px solid ${T.borderMuted}` : undefined }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 6, background: T.elevated, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🌿</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{r.product}</span>
                        <Stars rating={r.rating} />
                        <span style={{ fontSize: 12, color: T.muted }}>{r.rating}/5</span>
                      </div>
                      <p style={{ margin: "4px 0 8px", fontSize: 13, color: T.text, lineHeight: 1.5 }}>"{r.text}"</p>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 11, color: T.muted }}>{r.date}</span>
                        <SmallBadge label={r.status.charAt(0).toUpperCase() + r.status.slice(1)} color={st.color} bg={st.bg} />
                        <button style={{ fontSize: 11, color: T.accent, background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>View</button>
                        <button style={{ fontSize: 11, color: T.muted, background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>Moderate</button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
      }
    </Card>
  );
}

function TabAICare({ c }: { c: Customer }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <Card>
      <CardHeader title={`AI Care Activity (${c.aiCareQueries.length} queries)`} />
      {c.aiCareQueries.length === 0
        ? <div style={{ padding: "40px", textAlign: "center", color: T.muted, fontSize: 13 }}>This customer hasn't used AI Care yet.</div>
        : <div>
            {c.aiCareQueries.map((q, i) => (
              <div key={q.id} style={{
                padding: "14px 18px", borderTop: i > 0 ? `1px solid ${T.borderMuted}` : undefined,
                cursor: "pointer",
              }} onClick={() => setExpanded(expanded === q.id ? null : q.id)}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 11, color: T.muted, marginBottom: 4 }}>{q.datetime}</div>
                    <div style={{ fontSize: 13, color: T.text }}>{q.query}</div>
                    <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                      {q.hasPhoto && <span style={{ fontSize: 11, color: T.muted }}>📷 Photo attached</span>}
                      {q.rating && <span style={{ fontSize: 11, color: q.rating === "helpful" ? T.success : T.error }}>{q.rating === "helpful" ? "👍 Helpful" : "👎 Unhelpful"}</span>}
                      {q.converted && <span style={{ fontSize: 11, color: T.success, fontWeight: 600 }}>✓ Converted to cart</span>}
                    </div>
                  </div>
                  <span style={{ fontSize: 12, color: T.muted, flexShrink: 0, marginTop: 2 }}>{expanded === q.id ? "▲" : "▼"}</span>
                </div>
                {expanded === q.id && (
                  <div style={{ marginTop: 12, padding: "12px", background: T.elevated, borderRadius: 6, fontSize: 12, color: T.muted }}>
                    Full conversation thread would appear here.
                  </div>
                )}
              </div>
            ))}
          </div>
      }
    </Card>
  );
}

function TabGarden({ c }: { c: Customer }) {
  return (
    <Card>
      <CardHeader title={`Garden Service Bookings (${c.gardenBookings.length})`} />
      {c.gardenBookings.length === 0
        ? <div style={{ padding: "40px", textAlign: "center", color: T.muted, fontSize: 13 }}>No garden service bookings yet.</div>
        : <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr>{["BOOKING ID", "SERVICE", "DATE", "STATUS"].map(h =>
                <th key={h} style={{ ...thSt, padding: "8px 14px" }}>{h}</th>
              )}</tr>
            </thead>
            <tbody>
              {c.gardenBookings.map(b => {
                const sc = gardStatusConfig(b.status);
                return (
                  <tr key={b.id} style={{ borderTop: `1px solid ${T.borderMuted}` }}
                    onMouseEnter={e => e.currentTarget.style.background = T.elevated}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ ...tdSt, padding: "11px 14px" }}><span style={{ fontFamily: "monospace", color: T.accent, fontSize: 12 }}>#{b.id}</span></td>
                    <td style={{ ...tdSt, padding: "11px 14px", color: T.text }}>{b.service}</td>
                    <td style={{ ...tdSt, padding: "11px 14px", color: T.muted }}>{b.date}</td>
                    <td style={{ ...tdSt, padding: "11px 14px" }}><SmallBadge label={b.status.charAt(0).toUpperCase() + b.status.slice(1)} color={sc.color} bg={sc.bg} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
      }
    </Card>
  );
}

function TabActivity({ c }: { c: Customer }) {
  const typeIcon: Record<string, string> = { order: "🛍", account: "👤", admin: "🔧", system: "⚙️", loyalty: "🏅" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* ─── Cart Card ─── */}
      <Card>
        <CardHeader title={`🛒 Active Shopping Cart (${c.cart?.length || 0} items)`} />
        {!c.cart || c.cart.length === 0 ? (
          <div style={{ padding: "30px 18px", textAlign: "center", color: T.muted, fontSize: 13 }}>
            Shopping cart is currently empty.
          </div>
        ) : (
          <div style={{ padding: "8px 0" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr>
                  {["Product", "Price", "Qty", "Total", "Actions"].map(h => (
                    <th key={h} style={{ ...thSt, padding: "8px 14px" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {c.cart.map(item => (
                  <tr key={item.id} style={{ borderTop: `1px solid ${T.borderMuted}` }}>
                    <td style={{ ...tdSt, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 16 }}>🌿</span>
                      <span style={{ fontWeight: 600, color: T.text }}>{item.name}</span>
                    </td>
                    <td style={{ ...tdSt, padding: "10px 14px", color: T.text }}>{item.price}</td>
                    <td style={{ ...tdSt, padding: "10px 14px", color: T.muted }}>{item.quantity}</td>
                    <td style={{ ...tdSt, padding: "10px 14px", fontWeight: 700, color: T.accent }}>
                      ₹{(parseInt(item.price.replace(/[^\d]/g, "")) * item.quantity).toLocaleString()}
                    </td>
                    <td style={{ ...tdSt, padding: "10px 14px" }}>
                      <button style={{
                        padding: "3px 8px", borderRadius: 4, background: T.elevated,
                        border: `1px solid ${T.border}`, color: T.text, fontSize: 11,
                        cursor: "pointer", marginRight: 6, fontWeight: 600
                      }}>Move to Wishlist</button>
                      <button style={{
                        padding: "3px 8px", borderRadius: 4, background: "transparent",
                        border: "none", color: T.error, fontSize: 11, cursor: "pointer", fontWeight: 600
                      }}>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* ─── Wishlist Card ─── */}
      <Card>
        <CardHeader title={`❤️ Detailed Wishlist (${c.wishlist?.length || 0} items)`} />
        {!c.wishlist || c.wishlist.length === 0 ? (
          <div style={{ padding: "30px 18px", textAlign: "center", color: T.muted, fontSize: 13 }}>
            Wishlist is currently empty.
          </div>
        ) : (
          <div style={{ padding: "8px 0" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr>
                  {["Product", "Price", "Actions"].map(h => (
                    <th key={h} style={{ ...thSt, padding: "8px 14px" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {c.wishlist.map(item => (
                  <tr key={item.id} style={{ borderTop: `1px solid ${T.borderMuted}` }}>
                    <td style={{ ...tdSt, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 16 }}>🌿</span>
                      <span style={{ fontWeight: 600, color: T.text }}>{item.name}</span>
                    </td>
                    <td style={{ ...tdSt, padding: "10px 14px", color: T.accent, fontWeight: 700 }}>{item.price}</td>
                    <td style={{ ...tdSt, padding: "10px 14px" }}>
                      <button style={{
                        padding: "3px 8px", borderRadius: 4, background: T.accentBg,
                        border: `1px solid ${T.accent}`, color: T.accent, fontSize: 11,
                        cursor: "pointer", marginRight: 6, fontWeight: 600
                      }}>Add to Cart</button>
                      <button style={{
                        padding: "3px 8px", borderRadius: 4, background: "transparent",
                        border: "none", color: T.error, fontSize: 11, cursor: "pointer", fontWeight: 600
                      }}>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* ─── Recently Viewed Products ─── */}
      <Card>
        <CardHeader title={`👁️ Recently Viewed Products (${c.recentlyViewed?.length || 0})`} />
        {!c.recentlyViewed || c.recentlyViewed.length === 0 ? (
          <div style={{ padding: "30px 18px", textAlign: "center", color: T.muted, fontSize: 13 }}>
            No recently viewed products.
          </div>
        ) : (
          <div style={{ padding: "8px 0" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr>
                  {["Product", "Price", "Viewed At"].map(h => (
                    <th key={h} style={{ ...thSt, padding: "8px 14px" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {c.recentlyViewed.map(item => (
                  <tr key={item.id} style={{ borderTop: `1px solid ${T.borderMuted}` }}>
                    <td style={{ ...tdSt, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 16 }}>🌿</span>
                      <span style={{ fontWeight: 600, color: T.text }}>{item.name}</span>
                    </td>
                    <td style={{ ...tdSt, padding: "10px 14px", color: T.text }}>{item.price}</td>
                    <td style={{ ...tdSt, padding: "10px 14px", color: T.muted }}>{item.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* ─── Search History ─── */}
      <Card>
        <CardHeader title={`🔍 Search History (Last 10–20 searches)`} />
        {!c.searchHistory || c.searchHistory.length === 0 ? (
          <div style={{ padding: "30px 18px", textAlign: "center", color: T.muted, fontSize: 13 }}>
            No search history found.
          </div>
        ) : (
          <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 8 }}>
            {c.searchHistory.map((sh, idx) => (
              <div key={idx} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "8px 12px", background: T.elevated, borderRadius: 6,
                border: `1px solid ${T.borderMuted}`
              }}>
                <span style={{ fontSize: 13, color: T.text, fontWeight: 500 }}>"{sh.query}"</span>
                <span style={{ fontSize: 11, color: T.muted }}>{sh.datetime}</span>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* ─── Activity Log ─── */}
      <Card>
        <CardHeader title="Activity Log" action={
          <a href={`/admin/activity-log?customer=${c.id}`} style={{ fontSize: 12, color: T.accent, textDecoration: "none" }}>View Full Log ↗</a>
        } />
        {c.activityLog.length === 0
          ? <div style={{ padding: "40px", textAlign: "center", color: T.muted, fontSize: 13 }}>No activity recorded yet.</div>
          : <div role="log" aria-label="Customer activity log">
              {c.activityLog.map((e, i) => (
                <div key={e.id} style={{
                  display: "flex", gap: 12, padding: "12px 18px",
                  borderTop: i > 0 ? `1px solid ${T.borderMuted}` : undefined,
                }}>
                  <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{typeIcon[e.type] || "•"}</span>
                  <div>
                    <div style={{ fontSize: 13, color: T.text }}>{e.action}</div>
                    <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{e.datetime} · {e.actor}</div>
                  </div>
                </div>
              ))}
            </div>
        }
      </Card>
    </div>
  );
}

/* ─── Right Column Panels ─────────────────────────────────────────────────── */

function ProfileCard({ c, onEmailClick }: { c: Customer; onEmailClick: () => void }) {
  const [editOpen, setEditOpen] = useState(false);
  return (
    <Card>
      <div style={{ padding: "20px 18px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        <Avatar first={c.firstName} last={c.lastName} size={80} />
        <div style={{ marginTop: 12, fontSize: 18, fontWeight: 700, color: T.text }}>{c.firstName} {c.lastName}</div>
        <div style={{ fontSize: 12, color: T.muted, marginTop: 4 }}>{c.email}</div>
        <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>📞 {c.phone}</div>
        <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>📍 {c.city}, {c.state}</div>
        <div style={{ display: "flex", gap: 8, marginTop: 14, width: "100%" }}>
          <button onClick={() => setEditOpen(true)} style={{ ...secondaryBtn, flex: 1, textAlign: "center", justifyContent: "center" }}>Edit Profile</button>
          <button onClick={onEmailClick} style={{ ...secondaryBtn, flex: 1, textAlign: "center", justifyContent: "center" }}>✉ Email</button>
        </div>
      </div>
      {editOpen && (
        <Modal title="Edit Profile" onClose={() => setEditOpen(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1 }}>
                <label style={labelSt}>First Name</label>
                <input defaultValue={c.firstName} style={{ ...inputSt, marginTop: 6 }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelSt}>Last Name</label>
                <input defaultValue={c.lastName} style={{ ...inputSt, marginTop: 6 }} />
              </div>
            </div>
            <div>
              <label style={labelSt}>Email</label>
              <input defaultValue={c.email} type="email" style={{ ...inputSt, marginTop: 6 }} />
            </div>
            <div>
              <label style={labelSt}>Phone</label>
              <input defaultValue={c.phone} style={{ ...inputSt, marginTop: 6 }} />
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setEditOpen(false)} style={secondaryBtn}>Cancel</button>
              <button onClick={() => setEditOpen(false)} style={{ padding: "9px 18px", borderRadius: 6, background: T.accent, border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Save Changes</button>
            </div>
          </div>
        </Modal>
      )}
    </Card>
  );
}

function LoyaltyCard({ c }: { c: Customer }) {
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [tierOpen, setTierOpen] = useState(false);
  const adjustPoints = useAdjustPoints(c.id);
  const tier = tierConfig(c.tier);
  const totalForNext = c.loyaltyPoints + c.loyaltyPointsToNext;
  const pct = totalForNext > 0 ? Math.round((c.loyaltyPoints / totalForNext) * 100) : 100;

  return (
    <Card>
      {adjustOpen && <AdjustPointsModal customer={c} onClose={() => setAdjustOpen(false)} onApply={(points, reason) => adjustPoints.mutate({ points, reason }, { onSuccess: () => setAdjustOpen(false) })} />}
      {tierOpen && (
        <Modal title="Change Tier" onClose={() => setTierOpen(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={labelSt}>New Tier</label>
              <select style={{ ...inputSt, marginTop: 6 }}>
                <option>🌿 Plant Lover</option>
                <option>🥈 Silver</option>
                <option>🥇 Gold</option>
              </select>
            </div>
            <div>
              <label style={labelSt}>Reason</label>
              <input placeholder="e.g. Holiday promotion" style={{ ...inputSt, marginTop: 6 }} />
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setTierOpen(false)} style={secondaryBtn}>Cancel</button>
              <button onClick={() => setTierOpen(false)} style={{ padding: "9px 18px", borderRadius: 6, background: T.accent, border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Update Tier</button>
            </div>
          </div>
        </Modal>
      )}
      <CardHeader title="🏅 Loyalty" />
      <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 22, fontWeight: 800, color: T.accent }}>{c.loyaltyPoints.toLocaleString()} pts</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 700, color: tier.color, background: tier.bg, borderRadius: 9999, padding: "3px 10px" }}>
            {tier.icon} {tier.label}
          </span>
        </div>
        <div>
          <div style={{ height: 8, background: T.elevated, borderRadius: 9999, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: T.accent, borderRadius: 9999, transition: "width 600ms ease" }} />
          </div>
          <div style={{ fontSize: 11, color: T.muted, marginTop: 5 }} aria-label={`${c.loyaltyPoints} of ${totalForNext} points to ${c.nextTier}`}>
            {pct}% to {c.nextTier}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setAdjustOpen(true)} style={{ ...secondaryBtn, flex: 1, fontSize: 12, padding: "7px 10px" }}>Adjust Points</button>
          <button onClick={() => setTierOpen(true)} style={{ ...secondaryBtn, flex: 1, fontSize: 12, padding: "7px 10px" }}>Change Tier</button>
        </div>
      </div>
    </Card>
  );
}

function ContactCard({ c }: { c: Customer }) {
  return (
    <Card>
      <CardHeader title="Contact" />
      <div style={{ padding: "4px 0 8px" }}>
        <InfoRow label="Email" value={
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>{c.email}</span>
            <span aria-label={c.emailVerified ? "Email verified" : "Email not verified"}
              style={{ fontSize: 11, color: c.emailVerified ? T.success : T.warning, fontWeight: 700 }}>
              {c.emailVerified ? "✓" : "⚠"}
            </span>
          </span>
        } />
        <InfoRow label="Phone" value={
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {c.phone}
            <span aria-label={c.phoneVerified ? "Phone verified" : "Phone not verified"}
              style={{ fontSize: 11, color: c.phoneVerified ? T.success : T.warning, fontWeight: 700 }}>
              {c.phoneVerified ? "✓" : "⚠"}
            </span>
          </span>
        } />
        <InfoRow label="Language" value={c.language} />
        <div style={{ padding: "8px 18px", borderTop: `1px solid ${T.borderMuted}`, marginTop: 4 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.label, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Marketing</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: T.text }}>
              <div style={{ width: 14, height: 14, borderRadius: 3, background: c.marketingEmail ? T.accent : T.elevated, border: `1.5px solid ${c.marketingEmail ? T.accent : T.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {c.marketingEmail && <span style={{ color: "#fff", fontSize: 9, fontWeight: 900 }}>✓</span>}
              </div>
              Opted in to emails
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: T.text }}>
              <div style={{ width: 14, height: 14, borderRadius: 3, background: c.marketingSms ? T.accent : T.elevated, border: `1.5px solid ${c.marketingSms ? T.accent : T.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {c.marketingSms && <span style={{ color: "#fff", fontSize: 9, fontWeight: 900 }}>✓</span>}
              </div>
              Opted in to SMS
            </label>
          </div>
        </div>
      </div>
    </Card>
  );
}

function AddressesCard({ c }: { c: Customer }) {
  const icons = { home: "🏠", work: "🏢", other: "📍" };
  return (
    <Card>
      <CardHeader title={`Addresses (${c.addresses.length})`} action={
        <button style={{ fontSize: 12, color: T.accent, background: "none", border: "none", cursor: "pointer", fontWeight: 700 }}>+ Add</button>
      } />
      <div style={{ padding: "8px 0" }}>
        {c.addresses.length === 0 && <div style={{ padding: "16px 18px", color: T.muted, fontSize: 13 }}>No addresses saved.</div>}
        {c.addresses.map((a, i) => (
          <div key={a.id} style={{ padding: "12px 18px", borderTop: i > 0 ? `1px solid ${T.borderMuted}` : undefined }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <span style={{ fontSize: 14 }}>{icons[a.type]}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>
                {a.type.charAt(0).toUpperCase() + a.type.slice(1)}
                {a.isDefault && <span style={{ fontSize: 10, color: T.accent, marginLeft: 6, fontWeight: 700, background: T.accentBg, borderRadius: 9999, padding: "1px 6px" }}>Default</span>}
              </span>
            </div>
            <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.6 }}>
              {a.line1}<br />{a.city} — {a.pincode}, {a.state}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button style={{ fontSize: 11, color: T.muted, background: "none", border: "none", cursor: "pointer" }}>Edit</button>
              <button style={{ fontSize: 11, color: T.error, background: "none", border: "none", cursor: "pointer" }}>Delete</button>
              {!a.isDefault && <button style={{ fontSize: 11, color: T.accent, background: "none", border: "none", cursor: "pointer" }}>Set Default</button>}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function AccountStatusCard({ c, onBlock }: { c: Customer; onBlock: () => void }) {
  const sc = statusConfig(c.status);
  return (
    <Card>
      <CardHeader title="Account Status" />
      <div style={{ padding: "4px 0 12px" }}>
        <InfoRow label="Status" value={<SmallBadge label={sc.label} color={sc.color} bg={sc.bg} />} />
        <InfoRow label="Member since" value={c.joined} />
        <InfoRow label="Last login" value={c.lastLogin} />
        <InfoRow label="Last order" value={c.lastOrder} />
        <InfoRow label="Account type" value="Customer" />
      </div>
      <div style={{ padding: "12px 18px", borderTop: `1px solid ${T.border}`, display: "flex", gap: 8 }}>
        <button onClick={onBlock} style={{
          flex: 1, padding: "8px", borderRadius: 6, background: "transparent",
          border: `1px solid ${T.error}`, color: T.error, fontSize: 12,
          cursor: "pointer", fontWeight: 700, transition: "background 150ms",
        }}
          onMouseEnter={e => e.currentTarget.style.background = T.errorBg}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >Block Account</button>
        <button style={{
          flex: 1, padding: "8px", borderRadius: 6, background: "transparent",
          border: `1px solid ${T.error}`, color: T.error, fontSize: 12,
          cursor: "pointer", fontWeight: 700, transition: "background 150ms",
        }}
          onMouseEnter={e => e.currentTarget.style.background = T.errorBg}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >Delete Account</button>
      </div>
    </Card>
  );
}

function TagsCard({ c }: { c: Customer }) {
  const [tags, setTags] = useState(c.tags);
  const [adding, setAdding] = useState(false);
  const [newTag, setNewTag] = useState("");

  function addTag() {
    if (newTag.trim() && !tags.includes(newTag.trim())) setTags(prev => [...prev, newTag.trim()]);
    setNewTag(""); setAdding(false);
  }

  return (
    <Card>
      <CardHeader title="Tags" action={
        <button onClick={() => setAdding(true)} style={{ fontSize: 12, color: T.accent, background: "none", border: "none", cursor: "pointer", fontWeight: 700 }}>+ Add tag</button>
      } />
      <div style={{ padding: "14px 18px", display: "flex", flexWrap: "wrap", gap: 8 }}>
        {tags.length === 0 && !adding && <span style={{ fontSize: 12, color: T.muted }}>No tags yet</span>}
        {tags.map(tag => (
          <span key={tag} style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            background: T.elevated, border: `1px solid ${T.border}`, borderRadius: 9999,
            padding: "3px 10px", fontSize: 12, color: T.text,
          }}>
            {tag}
            <button onClick={() => setTags(prev => prev.filter(t => t !== tag))} style={{
              background: "none", border: "none", color: T.muted, cursor: "pointer", fontSize: 12, padding: 0, lineHeight: 1,
            }} onMouseEnter={e => e.currentTarget.style.color = T.error} onMouseLeave={e => e.currentTarget.style.color = T.muted}>×</button>
          </span>
        ))}
        {adding && (
          <div style={{ display: "flex", gap: 6 }}>
            <input
              autoFocus value={newTag} onChange={e => setNewTag(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") addTag(); if (e.key === "Escape") setAdding(false); }}
              placeholder="Tag name..." aria-label="Add tag"
              style={{ ...inputSt, padding: "3px 8px", fontSize: 12, width: 100 }}
            />
            <button onClick={addTag} style={{ fontSize: 12, color: T.accent, background: "none", border: "none", cursor: "pointer" }}>✓</button>
            <button onClick={() => setAdding(false)} style={{ fontSize: 12, color: T.muted, background: "none", border: "none", cursor: "pointer" }}>✕</button>
          </div>
        )}
      </div>
    </Card>
  );
}

function AdminNotesCard({ c }: { c: Customer }) {
  const [addOpen, setAddOpen] = useState(false);
  const addNote = useAddCustomerNote(c.id);
  const notes = c.adminNotes;

  return (
    <Card>
      {addOpen && <AddNoteModal onClose={() => setAddOpen(false)} onAdd={(note) => addNote.mutate(note, { onSuccess: () => setAddOpen(false) })} />}
      <CardHeader title="Admin Notes" action={
        <button onClick={() => setAddOpen(true)} style={{ fontSize: 12, color: T.accent, background: "none", border: "none", cursor: "pointer", fontWeight: 700 }}>+ Add Note</button>
      } />
      <div role="log" aria-label="Admin notes">
        {notes.length === 0
          ? <div style={{ padding: "16px 18px", color: T.muted, fontSize: 13 }}>No notes yet.</div>
          : notes.map((n, i) => (
              <div key={n.id} style={{ padding: "12px 18px", borderTop: i > 0 ? `1px solid ${T.borderMuted}` : undefined }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 26, height: 26, borderRadius: "50%", background: T.accentBg, border: `1px solid ${T.accent}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: T.accent }}>
                      {n.authorInitials}
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: T.text }}>{n.author}</span>
                    <span style={{ fontSize: 11, color: T.muted }}>· {n.date}</span>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button style={{ fontSize: 11, color: T.muted, background: "none", border: "none", cursor: "pointer" }}>Edit</button>
                  </div>
                </div>
                <p style={{ margin: 0, fontSize: 13, color: T.text, lineHeight: 1.5 }}>{n.text}</p>
              </div>
            ))
        }
      </div>
    </Card>
  );
}

/* ─── Main Detail Page ───────────────────────────────────────────────────── */

type Tab = "overview" | "orders" | "reviews" | "ai_care" | "garden" | "activity";
const TABS: { key: Tab; label: (c: Customer) => string }[] = [
  { key: "overview",  label: () => "Overview" },
  { key: "orders",    label: c => `Orders (${c.orderHistory.length})` },
  { key: "reviews",   label: c => `Reviews (${c.reviewCount})` },
  { key: "ai_care",   label: c => `AI Care (${c.aiCareQueries.length})` },
  { key: "garden",    label: c => `Garden Bookings (${c.gardenBookings.length})` },
  { key: "activity",  label: () => "Activity Log" },
];

export default function CustomerDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { data: customerData, isLoading, isError } = useAdminCustomer(id);
  const { data: ordersData } = useCustomerOrders(id);
  const blockCustomer = useBlockCustomer(id);
  const customer = customerData ? customerFromApi(customerData, ordersData?.items ?? []) : undefined;

  const [tab, setTab]           = useState<Tab>("overview");
  const [emailOpen, setEmailOpen] = useState(false);
  const [blockOpen, setBlockOpen] = useState(false);
  const [overflowOpen, setOverflowOpen] = useState(false);

  if (isLoading) {
    return <div style={{ padding: "80px 24px", textAlign: "center", color: T.muted }}>Loading customer…</div>;
  }

  if (!customer) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px", gap: 16 }}>
        <div style={{ fontSize: 48 }}>👤</div>
        <div style={{ fontSize: 18, fontWeight: 600, color: T.text }}>{isError ? "Customer could not be loaded" : "Customer not found"}</div>
        <Link href="/admin/customers" style={{ color: T.accent, textDecoration: "none", fontSize: 14 }}>← Back to Customers</Link>
      </div>
    );
  }

  const sc = statusConfig(customer.status);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {emailOpen && <SendEmailModal customer={customer} onClose={() => setEmailOpen(false)} />}
      {blockOpen && <BlockModal customer={customer} onClose={() => setBlockOpen(false)} onBlock={(reason) => blockCustomer.mutate(reason, { onSuccess: () => setBlockOpen(false) })} />}

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" style={{ fontSize: 12, color: T.muted, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
        <Link href="/admin" style={{ color: T.muted, textDecoration: "none" }}>Admin</Link>
        <span>/</span>
        <Link href="/admin/customers" style={{ color: T.muted, textDecoration: "none" }}>Customers</Link>
        <span>/</span>
        <span style={{ color: T.text }} aria-current="page">{customer.firstName} {customer.lastName}</span>
      </nav>

      {/* Customer Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: T.text }}>{customer.firstName} {customer.lastName}</h1>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              background: sc.bg, color: sc.color, fontSize: 12, fontWeight: 700,
              borderRadius: 9999, padding: "3px 10px",
            }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: sc.color }} />
              {sc.label}
            </span>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 6, flexWrap: "wrap" }}>
            <code style={{ fontSize: 11, color: T.muted, fontFamily: "monospace" }}>#{customer.customerId}</code>
            <span style={{ color: T.borderMuted }}>·</span>
            <span style={{ fontSize: 12, color: T.muted }}>{customer.email}</span>
            <span style={{ color: T.borderMuted }}>·</span>
            <span style={{ fontSize: 12, color: T.muted }}>Joined {customer.joined}</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={() => setEmailOpen(true)} style={secondaryBtn}>✉ Send Email</button>
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setOverflowOpen(!overflowOpen)}
              aria-haspopup="menu"
              style={{
                width: 36, height: 36, borderRadius: 6,
                background: "transparent", border: `1px solid ${T.border}`,
                color: T.text, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >⋮</button>
            {overflowOpen && (
              <div role="menu" style={{
                position: "absolute", right: 0, top: "calc(100% + 4px)", zIndex: 100,
                background: T.overlay, border: `1px solid ${T.border}`, borderRadius: 8,
                width: 200, boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
              }}>
                {[
                  { label: "Edit Customer", danger: false },
                  { label: "Block Account", danger: true, action: () => { setOverflowOpen(false); setBlockOpen(true); } },
                  { label: "Delete Account", danger: true },
                  null,
                  { label: "Merge Customers", danger: false },
                  { label: "Export Data", danger: false },
                ].map((item, i) =>
                  item === null
                    ? <div key={i} style={{ height: 1, background: T.border }} />
                    : <button key={item.label} role="menuitem"
                        onClick={() => { if (item.action) item.action(); else setOverflowOpen(false); }}
                        style={{
                          display: "block", width: "100%", textAlign: "left",
                          padding: "9px 14px", background: "transparent", border: "none",
                          cursor: "pointer", fontSize: 13,
                          color: item.danger ? T.error : T.text,
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = item.danger ? T.errorBg : T.elevated}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >{item.label}</button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
        {/* Left column — 60% */}
        <div style={{ flex: "0 0 calc(60% - 12px)", minWidth: 0 }}>
          {/* Tabs */}
          <div role="tablist" style={{ display: "flex", gap: 0, borderBottom: `1px solid ${T.border}`, marginBottom: 20, overflowX: "auto" }}>
            {TABS.map(t => {
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  role="tab"
                  aria-selected={active}
                  aria-controls={`panel-${t.key}`}
                  onClick={() => setTab(t.key)}
                  style={{
                    padding: "10px 16px", background: "transparent",
                    border: "none", borderBottom: active ? `2px solid ${T.accent}` : "2px solid transparent",
                    color: active ? T.text : T.muted, fontSize: 13,
                    fontWeight: active ? 700 : 500, cursor: "pointer",
                    whiteSpace: "nowrap", transition: "all 150ms", outline: "none",
                    marginBottom: -1,
                  }}
                  onFocus={e => { e.currentTarget.style.boxShadow = T.focus; }}
                  onBlur={e => { e.currentTarget.style.boxShadow = "none"; }}
                >
                  {t.label(customer)}
                </button>
              );
            })}
          </div>

          {/* Tab Panels */}
          <div id={`panel-${tab}`} role="tabpanel">
            {tab === "overview"  && <TabOverview c={customer} />}
            {tab === "orders"    && <TabOrders   c={customer} />}
            {tab === "reviews"   && <TabReviews  c={customer} />}
            {tab === "ai_care"   && <TabAICare   c={customer} />}
            {tab === "garden"    && <TabGarden   c={customer} />}
            {tab === "activity"  && <TabActivity c={customer} />}
          </div>
        </div>

        {/* Right column — 40%, sticky */}
        <div style={{ flex: "0 0 calc(40% - 12px)", display: "flex", flexDirection: "column", gap: 16, position: "sticky", top: 80 }}>
          <ProfileCard c={customer} onEmailClick={() => setEmailOpen(true)} />
          <LoyaltyCard c={customer} />
          <ContactCard c={customer} />
          <AddressesCard c={customer} />
          <AccountStatusCard c={customer} onBlock={() => setBlockOpen(true)} />
          <TagsCard c={customer} />
          <AdminNotesCard c={customer} />
        </div>
      </div>
    </div>
  );
}

/* ─── shared style helpers ───────────────────────────────────────────────── */
const thSt: React.CSSProperties = {
  padding: "9px 14px", textAlign: "left",
  fontSize: 11, fontWeight: 700, color: T.label,
  textTransform: "uppercase", letterSpacing: "0.06em",
  whiteSpace: "nowrap", borderBottom: `1px solid ${T.border}`,
  background: "#0f1117",
};

const tdSt: React.CSSProperties = {
  padding: "11px 14px", verticalAlign: "middle",
};

const secondaryBtn: React.CSSProperties = {
  padding: "8px 14px", borderRadius: 6,
  background: "transparent", border: `1px solid ${T.border}`,
  color: T.text, fontSize: 13, cursor: "pointer", fontWeight: 600,
};

const labelSt: React.CSSProperties = {
  fontSize: 11, fontWeight: 700, color: T.label,
  textTransform: "uppercase", letterSpacing: "0.06em", display: "block",
};

const inputSt: React.CSSProperties = {
  width: "100%", boxSizing: "border-box",
  padding: "9px 12px", borderRadius: 6,
  background: T.elevated, border: `1px solid ${T.border}`,
  color: T.text, fontSize: 13, outline: "none", fontFamily: "inherit",
};
