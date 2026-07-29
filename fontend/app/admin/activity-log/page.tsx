"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAllActivityLogs } from "@/features/admin-customers";

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
  shadow: "0 2px 8px rgba(0,0,0,0.35)",
  focus: "0 0 0 3px rgba(0,181,102,0.25)",
};

const typeIcon: Record<string, string> = { order: "🛍", account: "👤", admin: "🔧", system: "⚙️", loyalty: "🏅" };

function date(value?: string | null) {
  return value ? new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value)) : "—";
}

function ActivityLogContent() {
  const searchParams = useSearchParams();
  const customerParam = searchParams?.get("customer") || "";

  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [customerUuid, setCustomerUuid] = useState(customerParam);
  const [page, setPage] = useState(1);

  // Sync query parameter when it changes
  useEffect(() => {
    setCustomerUuid(customerParam);
    setPage(1);
  }, [customerParam]);

  const { data, isLoading } = useAllActivityLogs({
    customer_uuid: customerUuid || undefined,
    q: q || undefined,
    type: type || undefined,
    start_date: startDate || undefined,
    end_date: endDate || undefined,
    page,
    page_size: 25,
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: T.text }}>Admin Activity Log</h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: T.muted }}>Track all customer actions, order status changes, and loyalty transactions.</p>
        </div>
      </div>

      {/* Filter panel */}
      <div style={{
        background: T.card, border: `1px solid ${T.border}`, borderRadius: 8,
        padding: "16px 18px", display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end"
      }}>
        <div style={{ flex: "1 1 200px" }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: T.label, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>Search Log</label>
          <input
            type="text"
            placeholder="Search by action, order no, description..."
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }}
            style={{
              width: "100%", padding: "8px 12px", background: T.elevated, border: `1px solid ${T.border}`,
              borderRadius: 6, color: T.text, fontSize: 13, outline: "none", boxSizing: "border-box"
            }}
          />
        </div>

        <div style={{ width: "140px" }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: T.label, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>Event Type</label>
          <select
            value={type}
            onChange={(e) => { setType(e.target.value); setPage(1); }}
            style={{
              width: "100%", padding: "8px 12px", background: T.elevated, border: `1px solid ${T.border}`,
              borderRadius: 6, color: T.text, fontSize: 13, outline: "none", cursor: "pointer"
            }}
          >
            <option value="">All Events</option>
            <option value="order">🛍 Orders</option>
            <option value="loyalty">🏅 Loyalty Points</option>
          </select>
        </div>

        <div style={{ width: "135px" }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: T.label, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
            style={{
              width: "100%", padding: "7px 10px", background: T.elevated, border: `1px solid ${T.border}`,
              borderRadius: 6, color: T.text, fontSize: 13, outline: "none", boxSizing: "border-box"
            }}
          />
        </div>

        <div style={{ width: "135px" }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: T.label, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
            style={{
              width: "100%", padding: "7px 10px", background: T.elevated, border: `1px solid ${T.border}`,
              borderRadius: 6, color: T.text, fontSize: 13, outline: "none", boxSizing: "border-box"
            }}
          />
        </div>

        <div style={{ flex: "1 1 180px" }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: T.label, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>Customer UUID Filter</label>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="text"
              placeholder="e.g. 03b9cb37-..."
              value={customerUuid}
              onChange={(e) => { setCustomerUuid(e.target.value); setPage(1); }}
              style={{
                width: "100%", padding: "8px 12px", background: T.elevated, border: `1px solid ${T.border}`,
                borderRadius: 6, color: T.text, fontSize: 13, outline: "none", boxSizing: "border-box"
              }}
            />
            {(customerUuid || startDate || endDate || q || type) && (
              <button
                onClick={() => { setCustomerUuid(""); setStartDate(""); setEndDate(""); setQ(""); setType(""); setPage(1); }}
                style={{
                  padding: "8px 12px", background: T.elevated, border: `1px solid ${T.border}`,
                  borderRadius: 6, color: T.muted, fontSize: 13, cursor: "pointer", fontWeight: 600, whiteSpace: "nowrap"
                }}
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Log list card */}
      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, overflow: "hidden", boxShadow: T.shadow }}>
        {isLoading ? (
          <div style={{ padding: 40, textAlign: "center", color: T.muted, fontSize: 14 }}>Loading logs...</div>
        ) : !data || data.items.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: T.muted, fontSize: 14 }}>No activity logs match the criteria.</div>
        ) : (
          <div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#0f1117", borderBottom: `1px solid ${T.border}` }}>
                  <th style={thSt}>Date &amp; Time</th>
                  <th style={thSt}>Event</th>
                  <th style={thSt}>Customer</th>
                  <th style={thSt}>Action Details</th>
                  <th style={thSt}>Actor</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((log) => (
                  <tr
                    key={log.id}
                    style={{ borderBottom: `1px solid ${T.borderMuted}` }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = T.elevated; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                  >
                    <td style={tdSt}>{date(log.datetime)}</td>
                    <td style={tdSt}>
                      <span style={{ fontSize: 15, marginRight: 6 }}>{typeIcon[log.type] || "•"}</span>
                      <span style={{ textTransform: "capitalize", fontWeight: 600 }}>{log.type}</span>
                    </td>
                    <td style={tdSt}>
                      {log.customer ? (
                        <Link href={`/admin/customers/${log.customer.uuid}`} style={{ color: T.accent, textDecoration: "none", fontWeight: 600 }}>
                          {log.customer.first_name} {log.customer.last_name}
                          <div style={{ fontSize: 11, color: T.muted, fontWeight: 400 }}>{log.customer.email}</div>
                        </Link>
                      ) : (
                        <span style={{ color: T.muted }}>Guest / Anonymous</span>
                      )}
                    </td>
                    <td style={{ ...tdSt, color: T.text, fontWeight: 500 }}>{log.action}</td>
                    <td style={{ ...tdSt, color: T.muted }}>{log.actor}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {data.total > 25 && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 18px", borderTop: `1px solid ${T.border}`, background: "#0f1117" }}>
                <span style={{ fontSize: 12, color: T.muted }}>
                  Showing {((page - 1) * 25) + 1} to {Math.min(page * 25, data.total)} of {data.total} logs
                </span>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    style={{
                      padding: "6px 12px", background: page === 1 ? "transparent" : T.elevated,
                      border: `1px solid ${T.border}`, borderRadius: 6, color: page === 1 ? T.muted : T.text,
                      cursor: page === 1 ? "not-allowed" : "pointer", fontSize: 12, fontWeight: 600
                    }}
                  >
                    Previous
                  </button>
                  <button
                    disabled={page * 25 >= data.total}
                    onClick={() => setPage(p => p + 1)}
                    style={{
                      padding: "6px 12px", background: page * 25 >= data.total ? "transparent" : T.elevated,
                      border: `1px solid ${T.border}`, borderRadius: 6, color: page * 25 >= data.total ? T.muted : T.text,
                      cursor: page * 25 >= data.total ? "not-allowed" : "pointer", fontSize: 12, fontWeight: 600
                    }}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ActivityLogPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: "center", color: T.muted, fontSize: 14 }}>Loading...</div>}>
      <ActivityLogContent />
    </Suspense>
  );
}

const thSt: React.CSSProperties = {
  padding: "10px 14px", textAlign: "left",
  fontSize: 11, fontWeight: 700, color: T.label,
  textTransform: "uppercase", letterSpacing: "0.06em",
  whiteSpace: "nowrap",
};

const tdSt: React.CSSProperties = {
  padding: "12px 14px", verticalAlign: "middle",
};
