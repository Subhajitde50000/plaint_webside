"use client";

import { useState } from "react";
import Link from "next/link";

/* ─── Design Tokens ──────────────────────────────────────────────────────── */
const T = {
  bg: "#0f1117", card: "#1c2128", elevated: "#22272e", overlay: "#2d333b",
  text: "#cdd9e5", muted: "#768390", label: "#adbac7", border: "#444c56",
  borderMuted: "rgba(68,76,86,0.5)", accent: "#00b566", accentBg: "rgba(0,181,102,0.12)",
  success: "#57ab5a", successBg: "rgba(87,171,90,0.15)", warning: "#c69026",
  error: "#e5534b", info: "#539bf5", starFill: "#c8a84b",
  shadow: "0 2px 8px rgba(0,0,0,0.35)",
};

/* ─── Icons ──────────────────────────────────────────────────────────────── */
const Icon = {
  ChevronLeft: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6" />
    </svg>
  ),
  Star: ({ filled }: { filled: boolean }) => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill={filled ? T.starFill : "none"} stroke={filled ? T.starFill : T.border} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  AlertTriangle: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" />
    </svg>
  ),
  ChevronDown: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  ),
};

/* ─── Mock Data ──────────────────────────────────────────────────────────── */
const ratingDistribution = [
  { stars: 5, count: 3204, pct: 66 },
  { stars: 4, count: 1012, pct: 21 },
  { stars: 3, count: 312,  pct: 6  },
  { stars: 2, count: 180,  pct: 4  },
  { stars: 1, count: 113,  pct: 2  },
];

const topRated = [
  { name: "Monstera Deliciosa", variant: "Medium", rating: 4.9, count: 248 },
  { name: "Peace Lily",         variant: "All",    rating: 4.8, count: 186 },
  { name: "Pothos Golden",      variant: "Hanging",rating: 4.7, count: 154 },
  { name: "ZZ Plant",           variant: "Small",  rating: 4.7, count: 112 },
  { name: "Bird of Paradise",   variant: "XL",     rating: 4.6, count: 89  },
];

const lowestRated = [
  { name: "Terracotta Pot 14cm", variant: "Natural", rating: 3.1, count: 42, warn: true },
  { name: "Cactus Mix",          variant: "Small",   rating: 3.4, count: 28, warn: true },
  { name: "Fiddle Leaf Fig",     variant: "Large",   rating: 3.6, count: 67, warn: false },
];

/* Simulated time-series (30 data points) */
const timeSeriesData = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  reviews: Math.round(40 + Math.random() * 80),
  rating: +(3.8 + Math.random() * 1.2).toFixed(1),
}));

function StarRating({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <span style={{ display: "flex", gap: 2 }} aria-label={`${rating} stars`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s}>
          <svg width={size} height={size} viewBox="0 0 24 24" fill={s <= Math.round(rating) ? T.starFill : "none"} stroke={s <= Math.round(rating) ? T.starFill : T.border} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </span>
      ))}
    </span>
  );
}

export default function AdminReviewsAnalyticsPage() {
  const [dateRange, setDateRange] = useState("Last 90 days");
  const [showLowest, setShowLowest] = useState(false);

  const DATE_RANGES = ["Last 7 days", "Last 30 days", "Last 90 days", "Last 12 months", "All time"];

  /* SVG mini line chart for time series */
  const chartW = 640, chartH = 160;
  const maxReviews = Math.max(...timeSeriesData.map((d) => d.reviews));
  const points = timeSeriesData.map((d, i) => {
    const x = (i / (timeSeriesData.length - 1)) * chartW;
    const y = chartH - (d.reviews / maxReviews) * chartH;
    return `${x},${y}`;
  }).join(" ");
  const ratingPoints = timeSeriesData.map((d, i) => {
    const x = (i / (timeSeriesData.length - 1)) * chartW;
    const y = chartH - ((d.rating - 3.5) / 1.5) * chartH;
    return `${x},${y}`;
  }).join(" ");

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: "'Outfit','Inter',sans-serif", padding: 24 }}>
      <style>{`* { box-sizing: border-box; } :focus-visible { outline: 2px solid #00b566 !important; outline-offset: 2px; }`}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/admin/reviews" style={{ color: T.muted, textDecoration: "none", display: "flex", alignItems: "center", gap: 4, fontSize: 13 }}>
            <Icon.ChevronLeft /> Reviews
          </Link>
          <span style={{ color: T.border }}>/</span>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: T.text, margin: 0 }}>Review Analytics</h1>
        </div>

        {/* Date Range Selector */}
        <div style={{ position: "relative" }}>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            style={{
              background: T.elevated, border: `1px solid ${T.border}`, borderRadius: 6,
              padding: "8px 32px 8px 12px", color: T.text, fontSize: 13, outline: "none", cursor: "pointer",
              appearance: "none",
            }}
          >
            {DATE_RANGES.map((r) => <option key={r}>{r}</option>)}
          </select>
          <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: T.muted }}>
            <Icon.ChevronDown />
          </span>
        </div>
      </div>

      {/* KPI Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Avg Rating", value: "4.6 ★", sub: "↑ +0.1 vs prev period" },
          { label: "Total Reviews", value: "4,821", sub: "↑ +124 this period" },
          { label: "Response Rate", value: "68%", sub: "of reviews replied to" },
          { label: "Photo Rate", value: "42%", sub: "include photos" },
        ].map((kpi) => (
          <div key={kpi.label} style={{ background: T.card, border: `1px solid ${T.borderMuted}`, borderRadius: 8, padding: "18px 20px" }}>
            <p style={{ fontSize: 11, fontWeight: 500, color: T.muted, margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.04em" }}>{kpi.label}</p>
            <p style={{ fontSize: 28, fontWeight: 800, color: T.text, margin: "0 0 4px" }}>{kpi.value}</p>
            <p style={{ fontSize: 12, color: T.muted, margin: 0 }}>{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Rating Distribution */}
      <div style={{ background: T.card, border: `1px solid ${T.borderMuted}`, borderRadius: 8, padding: 24, marginBottom: 20 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: T.text, marginBottom: 18 }}>Rating Distribution</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {ratingDistribution.map((row) => (
            <div key={row.stars} role="img" aria-label={`${row.stars} star: ${row.count} reviews, ${row.pct}%`}
              style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4, width: 60, flexShrink: 0 }}>
                <span style={{ fontSize: 13, color: T.muted, minWidth: 8 }}>{row.stars}</span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill={T.starFill} stroke={T.starFill} strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <div style={{ flex: 1, height: 16, background: T.elevated, borderRadius: 4, overflow: "hidden" }}>
                <div style={{
                  height: "100%", width: `${row.pct}%`,
                  background: T.starFill, borderRadius: 4,
                  transition: "width 0.6s ease",
                }} />
              </div>
              <div style={{ display: "flex", gap: 10, minWidth: 120, flexShrink: 0 }}>
                <span style={{ fontSize: 13, color: T.text, fontWeight: 600 }}>{row.count.toLocaleString()}</span>
                <span style={{ fontSize: 13, color: T.muted }}>({row.pct}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews Over Time Chart */}
      <div style={{ background: T.card, border: `1px solid ${T.borderMuted}`, borderRadius: 8, padding: 24, marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: T.text, margin: 0 }}>Reviews Over Time</h2>
          <div style={{ display: "flex", gap: 16, fontSize: 12 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 20, height: 3, background: T.accent, display: "inline-block", borderRadius: 2 }} />
              <span style={{ color: T.muted }}>Review Volume</span>
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 20, height: 3, background: T.starFill, display: "inline-block", borderRadius: 2, borderStyle: "dashed" }} />
              <span style={{ color: T.muted }}>Avg Rating</span>
            </span>
          </div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <svg viewBox={`0 0 ${chartW} ${chartH + 40}`} width="100%" height={chartH + 40} style={{ display: "block" }}>
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((p) => (
              <line key={p} x1="0" y1={chartH * (1 - p)} x2={chartW} y2={chartH * (1 - p)}
                stroke={T.borderMuted} strokeWidth="1" strokeDasharray="4,4" />
            ))}
            {/* Volume area fill */}
            <defs>
              <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={T.accent} stopOpacity="0.3" />
                <stop offset="100%" stopColor={T.accent} stopOpacity="0.02" />
              </linearGradient>
            </defs>
            <polygon
              points={`0,${chartH} ${points} ${chartW},${chartH}`}
              fill="url(#volGrad)"
            />
            {/* Volume line */}
            <polyline points={points} fill="none" stroke={T.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            {/* Rating line */}
            <polyline points={ratingPoints} fill="none" stroke={T.starFill} strokeWidth="1.5" strokeDasharray="5,4" strokeLinecap="round" />
            {/* X-axis labels */}
            {[0, 7, 14, 21, 29].map((i) => (
              <text key={i} x={(i / (timeSeriesData.length - 1)) * chartW} y={chartH + 22}
                textAnchor="middle" fill={T.muted} fontSize="10">
                Day {i + 1}
              </text>
            ))}
          </svg>
        </div>
      </div>

      {/* Top / Lowest Rated Products */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        {/* Top Rated */}
        <div style={{ background: T.card, border: `1px solid ${T.borderMuted}`, borderRadius: 8, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: T.text, margin: 0 }}>Top Rated Products</h2>
            <button
              onClick={() => setShowLowest((v) => !v)}
              style={{ background: "none", border: "none", color: T.accent, fontSize: 12, cursor: "pointer" }}
            >
              Lowest Rated →
            </button>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr>
                {["Product", "Rating", "Reviews"].map((h) => (
                  <th key={h} style={{
                    padding: "6px 10px", textAlign: "left", fontSize: 11, fontWeight: 700,
                    color: T.label, textTransform: "uppercase", letterSpacing: "0.05em",
                    borderBottom: `1px solid ${T.borderMuted}`,
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topRated.map((p, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${T.borderMuted}` }}>
                  <td style={{ padding: "10px 10px" }}>
                    <div style={{ fontWeight: 600, color: T.text }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: T.muted }}>{p.variant}</div>
                  </td>
                  <td style={{ padding: "10px 10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <StarRating rating={p.rating} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: T.starFill }}>{p.rating}</span>
                    </div>
                  </td>
                  <td style={{ padding: "10px 10px", color: T.muted }}>{p.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Lowest Rated */}
        <div style={{ background: T.card, border: `1px solid ${T.borderMuted}`, borderRadius: 8, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: T.text, margin: 0 }}>
              Lowest Rated <span style={{ fontSize: 12, color: T.muted, fontWeight: 400 }}>(needs attention)</span>
            </h2>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr>
                {["Product", "Rating", "Reviews"].map((h) => (
                  <th key={h} style={{
                    padding: "6px 10px", textAlign: "left", fontSize: 11, fontWeight: 700,
                    color: T.label, textTransform: "uppercase", letterSpacing: "0.05em",
                    borderBottom: `1px solid ${T.borderMuted}`,
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lowestRated.map((p, i) => (
                <tr key={i} style={{
                  borderBottom: `1px solid ${T.borderMuted}`,
                  background: p.warn ? "rgba(229,83,75,0.04)" : "transparent",
                }}>
                  <td style={{ padding: "10px 10px" }}>
                    <div style={{ fontWeight: 600, color: T.text, display: "flex", alignItems: "center", gap: 6 }}>
                      {p.name}
                      {p.warn && <span style={{ color: T.warning }}><Icon.AlertTriangle /></span>}
                    </div>
                    <div style={{ fontSize: 11, color: T.muted }}>{p.variant}</div>
                  </td>
                  <td style={{ padding: "10px 10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <StarRating rating={p.rating} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: p.warn ? T.warning : T.starFill }}>{p.rating}</span>
                    </div>
                  </td>
                  <td style={{ padding: "10px 10px", color: T.muted }}>{p.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
