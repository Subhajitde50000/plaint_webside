"use client";

import {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from "react";
import Link from "next/link";
import {
  KPI_DATA,
  MOCK_QUERIES,
  VOLUME_DATA_DAILY,
  VOLUME_DATA_WEEKLY,
  VOLUME_DATA_MONTHLY,
  SATISFACTION_DATA,
  TOP_QUESTIONS,
  PLANT_ID_STATS,
  MOST_UPLOADED_PLANTS,
  FUNNEL_DATA,
  SOURCE_DATA,
  DAU_DATA,
  DEFAULT_SETTINGS,
  FLAG_REASONS,
  QueryLog,
  QueryStatus,
  QueryRating,
  QuerySource,
  FlagReason,
  AISettings,
} from "./data";

/* ─── Design Tokens ──────────────────────────────────────────────────────────── */
const T = {
  bg: "#0f1117",
  card: "#1c2128",
  elevated: "#22272e",
  overlay: "#2d333b",
  text: "#cdd9e5",
  muted: "#768390",
  label: "#adbac7",
  placeholder: "#545d68",
  border: "#444c56",
  borderMuted: "rgba(68,76,86,0.5)",
  borderActive: "#00b566",
  accent: "#00b566",
  accentBg: "rgba(0,181,102,0.12)",
  success: "#57ab5a",
  successBg: "rgba(87,171,90,0.15)",
  warning: "#c69026",
  warningBg: "rgba(198,144,38,0.15)",
  error: "#e5534b",
  errorBg: "rgba(229,83,75,0.15)",
  info: "#539bf5",
  infoBg: "rgba(83,159,245,0.15)",
  purple: "#986ee2",
  purpleBg: "rgba(152,110,226,0.15)",
  shadow: "0 2px 8px rgba(0,0,0,0.25)",
  shadowLg: "0 8px 32px rgba(0,0,0,0.4)",
  focus: "0 0 0 3px rgba(0,181,102,0.25)",
  chart1: "#00b566",
  chart2: "#539bf5",
  chart3: "#c69026",
  chart4: "#986ee2",
};

/* ─── SVG Icons ──────────────────────────────────────────────────────────────── */
const Icon = {
  Bot: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/>
      <path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/>
    </svg>
  ),
  Calendar: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/>
    </svg>
  ),
  Download: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  Search: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
  ),
  Filter: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
    </svg>
  ),
  ChevronDown: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6"/>
    </svg>
  ),
  ChevronUp: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m18 15-6-6-6 6"/>
    </svg>
  ),
  X: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
  ),
  Flag: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>
    </svg>
  ),
  Check: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5"/>
    </svg>
  ),
  Eye: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  MoreVert: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="12" cy="19" r="1" fill="currentColor"/>
    </svg>
  ),
  Camera: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>
    </svg>
  ),
  ExternalLink: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  ),
  ArrowUp: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
    </svg>
  ),
  ArrowDown: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
    </svg>
  ),
  ShoppingCart: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </svg>
  ),
  Leaf: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
    </svg>
  ),
  Warning: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
      <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  Trash: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>
  ),
  SortAsc: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 8 4-4 4 4"/><path d="M7 4v16"/><path d="M11 12h4"/><path d="M11 16h7"/><path d="M11 20h10"/>
    </svg>
  ),
  Settings: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
};

/* ─── Utility Functions ──────────────────────────────────────────────────────── */
function formatNumber(n: number): string {
  return n.toLocaleString("en-IN");
}

function formatCurrency(n: number): string {
  return `₹${n.toLocaleString("en-IN")}`;
}

function getInitials(name: string): string {
  return name === "Guest" ? "G" : name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function maskEmail(email: string): string {
  if (!email) return "";
  const [user, domain] = email.split("@");
  return `${user[0]}***@${domain}`;
}

/* ─── Shared Components ──────────────────────────────────────────────────────── */
function Avatar({ initials, size = 32 }: { initials: string; size?: number }) {
  const isGuest = initials === "G";
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: isGuest ? T.elevated : T.accentBg,
      border: `1px solid ${isGuest ? T.border : T.borderActive}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.35, fontWeight: 700,
      color: isGuest ? T.muted : T.accent,
      flexShrink: 0, fontFamily: "Outfit, sans-serif",
    }}>
      {initials}
    </div>
  );
}

function StatusBadge({ status }: { status: QueryStatus }) {
  if (status === "normal") return null;
  const cfg = {
    flagged: { bg: T.errorBg, color: T.error, label: "Flagged" },
    reviewed: { bg: T.successBg, color: T.success, label: "Reviewed" },
  }[status];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "2px 8px", borderRadius: 4,
      background: cfg.bg, color: cfg.color,
      fontSize: 11, fontWeight: 700, letterSpacing: "0.02em",
      fontFamily: "Outfit, sans-serif",
    }}>
      {status === "flagged" && "🚩 "}{status === "reviewed" && "✓ "}
      {cfg.label}
    </span>
  );
}

function RatingDisplay({ rating }: { rating: QueryRating }) {
  if (rating === "helpful") return <span style={{ color: T.success, fontSize: 16 }} aria-label="Rating: Helpful">👍</span>;
  if (rating === "not_helpful") return <span style={{ color: T.error, fontSize: 16 }} aria-label="Rating: Not helpful">👎</span>;
  return <span style={{ color: T.muted }} aria-label="Rating: No rating">—</span>;
}

function ToggleSwitch({
  id, checked, onChange, label,
}: {
  id: string; checked: boolean; onChange: (v: boolean) => void; label: string;
}) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      style={{
        width: 40, height: 22, borderRadius: 11,
        background: checked ? T.accent : T.elevated,
        border: `1px solid ${checked ? T.accent : T.border}`,
        cursor: "pointer", position: "relative",
        transition: "all 0.15s ease", flexShrink: 0, padding: 0,
        outline: "none",
      }}
      onFocus={(e) => { e.currentTarget.style.boxShadow = T.focus; }}
      onBlur={(e) => { e.currentTarget.style.boxShadow = "none"; }}
    >
      <span style={{
        position: "absolute", top: 2,
        left: checked ? 20 : 2,
        width: 16, height: 16, borderRadius: "50%",
        background: T.text,
        transition: "left 0.15s ease",
      }} />
    </button>
  );
}

function Toast({ message, type, onClose }: { message: string; type: "success" | "error" | "info"; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  const colors = { success: T.success, error: T.error, info: T.info };
  const icons = { success: "✓", error: "✕", info: "ℹ" };
  return (
    <div role="alert" aria-live="polite" style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 9999,
      background: T.card, border: `1px solid ${colors[type]}`,
      borderRadius: 8, padding: "12px 16px",
      display: "flex", alignItems: "center", gap: 10,
      boxShadow: T.shadowLg, color: T.text,
      fontFamily: "Outfit, sans-serif", fontSize: 13, fontWeight: 500,
      animation: "slideInRight 0.2s ease",
    }}>
      <span style={{ color: colors[type], fontWeight: 700 }}>{icons[type]}</span>
      {message}
      <button onClick={onClose} style={{ marginLeft: 8, background: "none", border: "none", color: T.muted, cursor: "pointer", padding: 2 }}>
        <Icon.X />
      </button>
    </div>
  );
}

/* ─── KPI Card ───────────────────────────────────────────────────────────────── */
function KpiCard({
  label, value, sub, trend, trendLabel, accentColor, leftAccent, icon, sparkline,
  onClick,
}: {
  label: string; value: string; sub?: string; trend?: number; trendLabel?: string;
  accentColor?: string; leftAccent?: string; icon?: string; sparkline?: number[];
  onClick?: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const valueColor = accentColor || T.text;

  return (
    <div
      role="region"
      aria-label={`${label}: ${value}`}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? T.elevated : T.card,
        border: `1px solid ${T.borderMuted}`,
        borderLeft: leftAccent ? `3px solid ${leftAccent}` : `1px solid ${T.borderMuted}`,
        borderRadius: 8, padding: 20,
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.15s ease",
        position: "relative", overflow: "hidden",
      } as React.CSSProperties}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: T.muted, fontFamily: "Outfit, sans-serif" }}>
          {icon && <span style={{ marginRight: 4 }}>{icon}</span>}
          {label}
        </div>
        {sparkline && (
          <svg width="64" height="28" viewBox={`0 0 64 28`} aria-hidden="true">
            {sparkline.map((v, i) => {
              const min = Math.min(...sparkline), max = Math.max(...sparkline);
              const x = (i / (sparkline.length - 1)) * 60 + 2;
              const y = 26 - ((v - min) / (max - min || 1)) * 22;
              return i === 0 ? null : (
                <line
                  key={i}
                  x1={(((i - 1) / (sparkline.length - 1)) * 60 + 2)}
                  y1={26 - ((sparkline[i - 1] - min) / (max - min || 1)) * 22}
                  x2={x} y2={y}
                  stroke={accentColor || T.accent} strokeWidth="1.5" strokeLinecap="round"
                />
              );
            })}
          </svg>
        )}
      </div>
      <div style={{ fontSize: 32, fontWeight: 800, color: valueColor, fontFamily: "Outfit, sans-serif", lineHeight: 1 }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 11, color: accentColor || T.accent, fontWeight: 600, fontFamily: "Outfit, sans-serif", marginTop: 2 }}>
          {sub}
        </div>
      )}
      {trend !== undefined && (
        <div style={{
          display: "flex", alignItems: "center", gap: 4, marginTop: 6,
          fontSize: 11, color: trend >= 0 ? T.success : T.error, fontWeight: 600,
          fontFamily: "Outfit, sans-serif",
        }}>
          {trend >= 0 ? <Icon.ArrowUp /> : <Icon.ArrowDown />}
          {Math.abs(trend)}% {trendLabel || "(30d)"}
        </div>
      )}
    </div>
  );
}

/* ─── Mini Bar Chart (Sparkline) ─────────────────────────────────────────────── */
function MiniBarChart({ data, color = T.chart1, height = 200 }: {
  data: { label: string; count: number }[]; color?: string; height?: number;
}) {
  const max = Math.max(...data.map((d) => d.count));
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div style={{ position: "relative", height }} aria-label={`Bar chart. Max value: ${max}`}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: "100%", paddingBottom: 20 }}>
        {data.map((d, i) => {
          const barH = ((d.count / max) * (height - 30));
          return (
            <div
              key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%", position: "relative", cursor: "default" }}
            >
              {hovered === i && (
                <div style={{
                  position: "absolute", bottom: barH + 24, left: "50%", transform: "translateX(-50%)",
                  background: T.overlay, border: `1px solid ${T.border}`, borderRadius: 4,
                  padding: "4px 8px", fontSize: 10, color: T.text, fontFamily: "Outfit, sans-serif",
                  whiteSpace: "nowrap", zIndex: 10,
                }}>
                  {d.label}: {formatNumber(d.count)}
                </div>
              )}
              <div style={{
                width: "80%", height: barH, borderRadius: "2px 2px 0 0",
                background: hovered === i ? T.accent : color,
                transition: "background 0.15s",
              }} />
              {data.length <= 10 && (
                <div style={{ fontSize: 9, color: T.muted, marginTop: 2, fontFamily: "Outfit, sans-serif" }}>
                  {d.label.replace("Jun ", "").replace("Week ", "W")}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Multi-Series Line Chart ────────────────────────────────────────────────── */
function LineChart({
  data, height = 240,
}: {
  data: { label: string; total: number; photos: number; converted: number }[];
  height?: number;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [svgW, setSvgW] = useState(600);

  useEffect(() => {
    const obs = new ResizeObserver((entries) => {
      if (entries[0]) setSvgW(entries[0].contentRect.width);
    });
    if (svgRef.current?.parentElement) obs.observe(svgRef.current.parentElement);
    return () => obs.disconnect();
  }, []);

  const maxVal = Math.max(...data.map((d) => d.total));
  const pad = { top: 16, right: 16, bottom: 32, left: 44 };
  const chartW = svgW - pad.left - pad.right;
  const chartH = height - pad.top - pad.bottom;

  const xPos = (i: number) => (i / (data.length - 1)) * chartW + pad.left;
  const yPos = (v: number) => (1 - v / maxVal) * chartH + pad.top;

  const pathFor = (key: "total" | "photos" | "converted") =>
    data.map((d, i) => `${i === 0 ? "M" : "L"}${xPos(i).toFixed(1)},${yPos(d[key]).toFixed(1)}`).join(" ");

  const series = [
    { key: "total" as const, color: T.chart1, label: "Total queries" },
    { key: "photos" as const, color: T.chart2, label: "With photos" },
    { key: "converted" as const, color: T.chart3, label: "Converted" },
  ];

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(maxVal * f));

  return (
    <div style={{ position: "relative" }}>
      <svg
        ref={svgRef}
        width="100%"
        height={height}
        role="img"
        aria-label={`Query volume chart. Total queries peak at ${Math.max(...data.map(d => d.total))}.`}
        style={{ overflow: "visible" }}
      >
        {/* Y-axis ticks */}
        {yTicks.map((tick, i) => (
          <g key={i}>
            <line x1={pad.left} x2={svgW - pad.right} y1={yPos(tick)} y2={yPos(tick)} stroke={T.borderMuted} strokeWidth={0.5} strokeDasharray="3 3" />
            <text x={pad.left - 6} y={yPos(tick) + 4} textAnchor="end" fill={T.muted} fontSize={10} fontFamily="Outfit, sans-serif">
              {tick >= 1000 ? `${(tick / 1000).toFixed(1)}k` : tick}
            </text>
          </g>
        ))}

        {/* X-axis labels (every ~5th) */}
        {data.map((d, i) => i % Math.ceil(data.length / 6) === 0 && (
          <text key={i} x={xPos(i)} y={height - 4} textAnchor="middle" fill={T.muted} fontSize={10} fontFamily="Outfit, sans-serif">
            {d.label}
          </text>
        ))}

        {/* Lines */}
        {series.map((s) => (
          <path key={s.key} d={pathFor(s.key)} fill="none" stroke={s.color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        ))}

        {/* Hover vertical line */}
        {hovered !== null && (
          <line x1={xPos(hovered)} x2={xPos(hovered)} y1={pad.top} y2={height - pad.bottom} stroke={T.border} strokeWidth={1} strokeDasharray="4 2" />
        )}

        {/* Hover dots */}
        {hovered !== null && series.map((s) => (
          <circle key={s.key} cx={xPos(hovered!)} cy={yPos(data[hovered!][s.key])} r={4} fill={s.color} stroke={T.card} strokeWidth={2} />
        ))}

        {/* Transparent hover targets */}
        {data.map((d, i) => (
          <rect
            key={i}
            x={xPos(i) - (chartW / data.length / 2)}
            y={pad.top}
            width={chartW / data.length}
            height={chartH}
            fill="transparent"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          />
        ))}
      </svg>

      {/* Tooltip */}
      {hovered !== null && (
        <div style={{
          position: "absolute",
          left: Math.min(xPos(hovered) + 12, svgW - 140),
          top: pad.top,
          background: T.overlay, border: `1px solid ${T.border}`,
          borderRadius: 6, padding: "8px 12px",
          fontSize: 11, color: T.text, fontFamily: "Outfit, sans-serif",
          pointerEvents: "none", zIndex: 10,
        }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>{data[hovered].label}</div>
          {series.map((s) => (
            <div key={s.key} style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: s.color, display: "inline-block" }} />
              <span style={{ color: T.label }}>{s.label}:</span>
              <span style={{ fontWeight: 600 }}>{formatNumber(data[hovered!][s.key])}</span>
            </div>
          ))}
        </div>
      )}

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, marginTop: 8, flexWrap: "wrap" }}>
        {series.map((s) => (
          <div key={s.key} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: T.label, fontFamily: "Outfit, sans-serif" }}>
            <span style={{ width: 20, height: 2, background: s.color, display: "inline-block", borderRadius: 1 }} />
            {s.label}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Donut Chart ────────────────────────────────────────────────────────────── */
function DonutChart({ segments, size = 120, label }: {
  segments: { label: string; value: number; color: string }[];
  size?: number; label?: string;
}) {
  const total = segments.reduce((a, s) => a + s.value, 0);
  let cumAngle = -90;
  const r = size * 0.4, cx = size / 2, cy = size / 2;
  const strokeW = r * 0.45;

  const describeArc = (start: number, end: number) => {
    const a1 = (start * Math.PI) / 180, a2 = (end * Math.PI) / 180;
    const x1 = (cx + r * Math.cos(a1)).toFixed(4);
    const y1 = (cy + r * Math.sin(a1)).toFixed(4);
    const x2 = (cx + r * Math.cos(a2)).toFixed(4);
    const y2 = (cy + r * Math.sin(a2)).toFixed(4);
    const large = end - start > 180 ? 1 : 0;
    return `M${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2}`;
  };

  return (
    <svg
      width={size} height={size}
      role="img"
      aria-label={`Donut chart: ${segments.map((s) => `${s.label} ${s.value}%`).join(", ")}`}
    >
      {segments.map((s, i) => {
        const angle = (s.value / total) * 360;
        const path = describeArc(cumAngle, cumAngle + angle - 0.5);
        cumAngle += angle;
        return <path key={i} d={path} stroke={s.color} strokeWidth={strokeW} fill="none" strokeLinecap="butt" />;
      })}
      {label && (
        <text x={cx} y={cy + 5} textAnchor="middle" fill={T.text} fontSize={13} fontWeight={700} fontFamily="Outfit, sans-serif">
          {label}
        </text>
      )}
    </svg>
  );
}

/* ─── Satisfaction Bars ──────────────────────────────────────────────────────── */
function SatisfactionChart({ onFilter }: { onFilter?: (rating: string) => void }) {
  const max = Math.max(...SATISFACTION_DATA.map((d) => d.count));
  return (
    <div role="img" aria-label={`Response quality: ${SATISFACTION_DATA.map(d => `${d.label} ${d.percent}%`).join(", ")}`}>
      {SATISFACTION_DATA.map((d) => (
        <div
          key={d.label}
          onClick={() => onFilter?.(d.label.toLowerCase().replace(" ", "_"))}
          style={{
            display: "flex", alignItems: "center", gap: 10, marginBottom: 12, cursor: "pointer",
            padding: "4px 0", borderRadius: 4,
          }}
          aria-label={`${d.label}: ${formatNumber(d.count)}, ${d.percent}%`}
        >
          <div style={{ width: 80, fontSize: 12, fontWeight: 500, color: T.label, fontFamily: "Outfit, sans-serif" }}>
            {d.icon} {d.label}
          </div>
          <div style={{ flex: 1, height: 8, background: T.elevated, borderRadius: 4, overflow: "hidden" }}>
            <div style={{
              width: `${(d.count / max) * 100}%`, height: "100%",
              background: d.color, borderRadius: 4, transition: "width 0.5s ease",
            }} />
          </div>
          <div style={{ width: 60, textAlign: "right", fontSize: 11, color: T.text, fontFamily: "Outfit, sans-serif", fontWeight: 600 }}>
            {d.percent}%
          </div>
          <div style={{ width: 40, fontSize: 11, color: T.muted, fontFamily: "Outfit, sans-serif" }}>
            {formatNumber(d.count)}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Funnel Chart ───────────────────────────────────────────────────────────── */
function FunnelChart() {
  const maxCount = FUNNEL_DATA[0].count;
  return (
    <div
      role="img"
      aria-label={`AI to cart conversion funnel: ${FUNNEL_DATA.map(f => `${f.label} ${formatNumber(f.count)}`).join(", ")}`}
    >
      {FUNNEL_DATA.map((step, i) => {
        const pct = (step.count / maxCount) * 100;
        const dropoff = i > 0 ? ((FUNNEL_DATA[i - 1].count - step.count) / FUNNEL_DATA[i - 1].count * 100).toFixed(1) : null;
        return (
          <div key={i} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
              <div style={{ fontSize: 12, color: T.label, fontFamily: "Outfit, sans-serif", width: 160, flexShrink: 0 }}>{step.label}</div>
              <div style={{ flex: 1, height: 10, background: T.elevated, borderRadius: 5, overflow: "hidden" }}>
                <div style={{
                  width: `${pct}%`, height: "100%",
                  background: `linear-gradient(90deg, ${T.accent}, ${T.chart2})`,
                  borderRadius: 5, transition: "width 0.6s ease",
                }} />
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: T.text, fontFamily: "Outfit, sans-serif", width: 60, textAlign: "right" }}>
                {formatNumber(step.count)}
              </div>
            </div>
            {dropoff && (
              <div style={{ paddingLeft: 172, fontSize: 10, color: T.muted, fontFamily: "Outfit, sans-serif" }}>
                ↓ {dropoff}% drop-off
              </div>
            )}
          </div>
        );
      })}
      <div style={{
        marginTop: 16, padding: "12px 16px",
        background: T.accentBg, borderRadius: 6,
        display: "flex", gap: 24, flexWrap: "wrap",
      }}>
        <div>
          <div style={{ fontSize: 11, color: T.muted, fontFamily: "Outfit, sans-serif" }}>Conversion Rate</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: T.accent, fontFamily: "Outfit, sans-serif" }}>12.4%</div>
          <div style={{ fontSize: 10, color: T.muted, fontFamily: "Outfit, sans-serif" }}>queries → add to cart</div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: T.muted, fontFamily: "Outfit, sans-serif" }}>Revenue (30d)</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: T.accent, fontFamily: "Outfit, sans-serif" }}>₹48,320</div>
          <div style={{ fontSize: 10, color: T.muted, fontFamily: "Outfit, sans-serif" }}>AI-attributed</div>
        </div>
      </div>
    </div>
  );
}

/* ─── Query Detail Drawer ────────────────────────────────────────────────────── */
function QueryDetailDrawer({
  query,
  onClose,
  onFlag,
  onMarkReviewed,
}: {
  query: QueryLog;
  onClose: () => void;
  onFlag: (id: string, reason: FlagReason, note?: string) => void;
  onMarkReviewed: (id: string, note?: string) => void;
}) {
  const [flagging, setFlagging] = useState(false);
  const [flagReason, setFlagReason] = useState<FlagReason | "">("");
  const [flagNote, setFlagNote] = useState("");
  const [reviewNote, setReviewNote] = useState("");
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [photoLightbox, setPhotoLightbox] = useState(false);
  const [busyReview, setBusyReview] = useState(false);

  // Focus trap & Escape
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleFlag = () => {
    if (!flagReason) return;
    onFlag(query.id, flagReason as FlagReason, flagNote || undefined);
    setFlagging(false);
    setFlagReason("");
    setFlagNote("");
  };

  const handleReview = async () => {
    setBusyReview(true);
    await new Promise((r) => setTimeout(r, 600));
    onMarkReviewed(query.id, reviewNote || undefined);
    setBusyReview(false);
  };

  const confidenceLabel = (c: number) => c >= 80 ? "High" : c >= 50 ? "Medium" : "Low";
  const confidenceColor = (c: number) => c >= 80 ? T.success : c >= 50 ? T.warning : T.error;

  return (
    <>
      <style>{`
        @keyframes slideFromRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideInRight { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000,
        }}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Query detail"
        style={{
          position: "fixed", top: 0, right: 0, width: 520, height: "100vh",
          background: T.card, borderLeft: `1px solid ${T.border}`,
          boxShadow: T.shadowLg, zIndex: 1001, overflowY: "auto",
          animation: "slideFromRight 0.25s ease",
          display: "flex", flexDirection: "column",
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 20px", borderBottom: `1px solid ${T.borderMuted}`,
          position: "sticky", top: 0, background: T.card, zIndex: 1,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ color: T.accent }}><Icon.Bot /></div>
            <span style={{ fontSize: 15, fontWeight: 700, color: T.text, fontFamily: "Outfit, sans-serif" }}>Query Detail</span>
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close drawer"
            style={{
              background: "none", border: `1px solid ${T.border}`, borderRadius: 6,
              color: T.muted, cursor: "pointer", padding: "6px 8px",
              transition: "all 0.15s",
            }}
            onFocus={(e) => { e.currentTarget.style.boxShadow = T.focus; }}
            onBlur={(e) => { e.currentTarget.style.boxShadow = "none"; }}
          >
            <Icon.X />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: 20, flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Session Info */}
          <section>
            <div style={{
              display: "flex", alignItems: "flex-start", justifyContent: "space-between",
              padding: 16, background: T.elevated, borderRadius: 8, gap: 12,
            }}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start", flex: 1 }}>
                <Avatar initials={query.userAvatar} size={36} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T.text, fontFamily: "Outfit, sans-serif" }}>
                    {query.userName}
                    {query.userId === null && <span style={{ fontStyle: "italic", color: T.muted, fontWeight: 400, fontSize: 12, marginLeft: 4 }}>(Guest)</span>}
                  </div>
                  {query.userEmail && (
                    <div style={{ fontSize: 11, color: T.muted, fontFamily: "Outfit, sans-serif" }}>{maskEmail(query.userEmail)}</div>
                  )}
                  <div style={{ fontSize: 11, color: T.muted, fontFamily: "Outfit, sans-serif", marginTop: 2 }}>{query.dateAbsolute}</div>
                  <div style={{ fontSize: 11, color: T.muted, fontFamily: "Outfit, sans-serif" }}>{query.device} · {query.os} · {query.browser}</div>
                  <div style={{ fontSize: 11, color: T.muted, fontFamily: "Outfit, sans-serif" }}>
                    Session: {query.sessionTurns} messages · {query.sessionDuration}
                  </div>
                </div>
              </div>
              {query.userId && (
                <Link
                  href={`/admin/customers/${query.userId}`}
                  target="_blank"
                  style={{
                    display: "flex", alignItems: "center", gap: 4,
                    fontSize: 11, color: T.accent, fontWeight: 600,
                    fontFamily: "Outfit, sans-serif", whiteSpace: "nowrap",
                    textDecoration: "none",
                  }}
                >
                  View Customer <Icon.ExternalLink />
                </Link>
              )}
            </div>
          </section>

          {/* Uploaded Photo */}
          {query.hasPhoto && (
            <section>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.label, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10, fontFamily: "Outfit, sans-serif" }}>
                Uploaded Photo
              </div>
              <div style={{ background: T.elevated, borderRadius: 8, padding: 12 }}>
                {query.photoUrl && (
                  <img
                    src={query.photoUrl}
                    alt="Uploaded plant photo"
                    onClick={() => setPhotoLightbox(true)}
                    style={{
                      width: "100%", maxHeight: 200, objectFit: "contain", borderRadius: 6,
                      cursor: "pointer", marginBottom: 10,
                    }}
                  />
                )}
                {query.plantIdResult && (
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: T.purple, fontFamily: "Outfit, sans-serif", marginBottom: 6 }}>
                      🌿 Plant ID Result: {query.plantIdResult.plantName}
                    </div>
                    {query.plantIdResult.identified && (
                      <>
                        <div style={{ fontSize: 11, color: T.muted, fontFamily: "Outfit, sans-serif", marginBottom: 4 }}>
                          Confidence: {query.plantIdResult.confidence}% — {confidenceLabel(query.plantIdResult.confidence)}
                        </div>
                        <div style={{ height: 8, background: T.border, borderRadius: 4, overflow: "hidden" }}>
                          <div
                            role="progressbar"
                            aria-valuenow={query.plantIdResult.confidence}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-label={`Plant ID confidence: ${query.plantIdResult.confidence}%`}
                            style={{
                              width: `${query.plantIdResult.confidence}%`, height: "100%",
                              background: confidenceColor(query.plantIdResult.confidence),
                              borderRadius: 4, transition: "width 0.4s ease",
                            }}
                          />
                        </div>
                      </>
                    )}
                    {!query.plantIdResult.identified && (
                      <div style={{ fontSize: 12, color: T.muted, fontStyle: "italic", fontFamily: "Outfit, sans-serif" }}>Plant not identified</div>
                    )}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Conversation Thread */}
          <section>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.label, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10, fontFamily: "Outfit, sans-serif" }}>
              Conversation
            </div>
            <div
              role="log"
              aria-label="AI conversation"
              style={{ display: "flex", flexDirection: "column", gap: 10 }}
            >
              {query.conversation.map((msg, i) => (
                <div key={msg.id}>
                  <div style={{
                    padding: "10px 12px", borderRadius: 8,
                    background: msg.role === "user" ? T.elevated : T.accentBg,
                    border: msg.role === "ai" ? `1px solid rgba(0,181,102,0.15)` : "none",
                  }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                      <span style={{ fontSize: 14, flexShrink: 0 }}>{msg.role === "user" ? "👤" : "🤖"}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: 12, color: T.text, fontFamily: "Outfit, sans-serif",
                          lineHeight: msg.role === "ai" ? 1.7 : 1.5,
                          fontStyle: msg.aiUnavailable ? "italic" : "normal",
                          whiteSpace: "pre-wrap",
                        }}>
                          {msg.aiUnavailable ? "AI response unavailable" : msg.content}
                        </div>
                        <div style={{ fontSize: 10, color: T.muted, fontFamily: "Outfit, sans-serif", marginTop: 4 }}>{msg.timestamp}</div>
                      </div>
                    </div>
                  </div>

                  {/* Inline rating */}
                  {msg.role === "ai" && msg.rating !== undefined && (
                    <div style={{ paddingLeft: 22, marginTop: 4, fontSize: 11, color: msg.rating === "helpful" ? T.success : msg.rating === "not_helpful" ? T.error : T.muted, fontFamily: "Outfit, sans-serif" }}>
                      {msg.rating === "helpful" ? "👍 Marked helpful by customer" : msg.rating === "not_helpful" ? "👎 Marked not helpful by customer" : "— No rating"}
                    </div>
                  )}

                  {/* Product suggestion */}
                  {msg.productSuggestions?.map((ps) => (
                    <div key={ps.id} style={{
                      marginTop: 6, padding: "8px 12px",
                      background: "rgba(0,181,102,0.06)",
                      border: `1px solid rgba(0,181,102,0.2)`,
                      borderRadius: 6, marginLeft: 22,
                      display: "flex", alignItems: "center", gap: 10,
                    }}
                      aria-label={`AI suggested: ${ps.name}, ${formatCurrency(ps.price)}`}
                    >
                      <span style={{ fontSize: 12 }}>📦</span>
                      <div style={{ flex: 1, fontSize: 12, color: T.accent, fontWeight: 600, fontFamily: "Outfit, sans-serif" }}>
                        {ps.deleted ? <span style={{ color: T.muted, fontStyle: "italic", fontWeight: 400 }}>[Deleted product]</span> : ps.name}
                        {!ps.deleted && <span style={{ color: T.muted, fontWeight: 400, marginLeft: 4 }}>{formatCurrency(ps.price)}</span>}
                      </div>
                      {ps.addedToCart && (
                        <span
                          style={{ fontSize: 10, fontWeight: 700, color: T.success, fontFamily: "Outfit, sans-serif" }}
                          aria-label="Added to cart: yes"
                        >
                          ✓ Added to cart
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>

          {/* Moderation */}
          <section>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.label, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12, fontFamily: "Outfit, sans-serif" }}>
              Moderation
            </div>
            <div style={{ background: T.elevated, borderRadius: 8, padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
              {/* Already reviewed */}
              {query.status === "reviewed" && (
                <div style={{ fontSize: 12, color: T.success, fontFamily: "Outfit, sans-serif", display: "flex", gap: 6, alignItems: "flex-start" }}>
                  <Icon.Check />
                  <div>
                    <div>Reviewed by {query.reviewedBy} — {query.reviewedAt}</div>
                    {query.reviewNote && <div style={{ color: T.muted, fontStyle: "italic", marginTop: 2 }}>"{query.reviewNote}"</div>}
                  </div>
                </div>
              )}

              {/* Flagged info */}
              {query.status === "flagged" && (
                <div style={{
                  padding: 10, background: T.errorBg, borderRadius: 6,
                  border: `1px solid rgba(229,83,75,0.3)`,
                  fontSize: 12, color: T.error, fontFamily: "Outfit, sans-serif",
                }}>
                  🚩 Flagged: {FLAG_REASONS.find((r) => r.value === query.flagReason)?.label}
                  {query.flagNote && <div style={{ color: T.label, marginTop: 4, fontStyle: "italic" }}>"{query.flagNote}"</div>}
                  <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                    <button
                      onClick={() => onMarkReviewed(query.id, "Dismissed flag")}
                      style={{
                        padding: "6px 12px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                        background: T.successBg, border: `1px solid ${T.success}`, color: T.success,
                        cursor: "pointer", fontFamily: "Outfit, sans-serif",
                      }}
                    >
                      Mark as Reviewed — No Issue
                    </button>
                    <button
                      onClick={() => alert("Issue confirmed and escalated")}
                      style={{
                        padding: "6px 12px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                        background: T.errorBg, border: `1px solid ${T.error}`, color: T.error,
                        cursor: "pointer", fontFamily: "Outfit, sans-serif",
                      }}
                    >
                      Confirm Issue
                    </button>
                  </div>
                </div>
              )}

              {/* Flag action */}
              {query.status === "normal" && (
                <>
                  {!flagging ? (
                    <button
                      onClick={() => setFlagging(true)}
                      style={{
                        display: "flex", alignItems: "center", gap: 6,
                        padding: "8px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600,
                        background: "none", border: `1px solid ${T.error}`, color: T.error,
                        cursor: "pointer", fontFamily: "Outfit, sans-serif",
                        transition: "all 0.15s",
                        alignSelf: "flex-start",
                      }}
                    >
                      <Icon.Flag /> Flag as Inappropriate
                    </button>
                  ) : (
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 700, color: T.label, textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "Outfit, sans-serif", display: "block", marginBottom: 6 }}>
                        FLAG REASON *
                      </label>
                      <select
                        value={flagReason}
                        onChange={(e) => setFlagReason(e.target.value as FlagReason)}
                        aria-required="true"
                        style={{
                          width: "100%", padding: "8px 12px", borderRadius: 6,
                          background: T.overlay, border: `1px solid ${T.border}`,
                          color: T.text, fontSize: 12, fontFamily: "Outfit, sans-serif",
                          marginBottom: 8,
                        }}
                      >
                        <option value="">Select a reason</option>
                        {FLAG_REASONS.map((r) => (
                          <option key={r.value} value={r.value}>{r.label}</option>
                        ))}
                      </select>
                      <textarea
                        placeholder="Optional note..."
                        value={flagNote}
                        onChange={(e) => setFlagNote(e.target.value)}
                        style={{
                          width: "100%", padding: "8px 12px", borderRadius: 6,
                          background: T.overlay, border: `1px solid ${T.border}`,
                          color: T.text, fontSize: 12, fontFamily: "Outfit, sans-serif",
                          resize: "vertical", minHeight: 60, marginBottom: 8,
                        }}
                      />
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={handleFlag}
                          disabled={!flagReason}
                          style={{
                            flex: 1, padding: "8px", borderRadius: 6, fontSize: 12, fontWeight: 600,
                            background: flagReason ? T.error : T.elevated,
                            border: "none", color: flagReason ? "#fff" : T.muted,
                            cursor: flagReason ? "pointer" : "not-allowed", fontFamily: "Outfit, sans-serif",
                          }}
                        >
                          Flag as Inappropriate
                        </button>
                        <button
                          onClick={() => { setFlagging(false); setFlagReason(""); setFlagNote(""); }}
                          style={{
                            padding: "8px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600,
                            background: "none", border: `1px solid ${T.border}`, color: T.muted,
                            cursor: "pointer", fontFamily: "Outfit, sans-serif",
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Mark as reviewed */}
              {query.status !== "reviewed" && (
                <button
                  onClick={handleReview}
                  aria-busy={busyReview}
                  style={{
                    padding: "8px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600,
                    background: T.accent, border: "none", color: "#fff",
                    cursor: busyReview ? "wait" : "pointer", fontFamily: "Outfit, sans-serif",
                    opacity: busyReview ? 0.7 : 1,
                    alignSelf: "flex-start",
                  }}
                  onFocus={(e) => { e.currentTarget.style.boxShadow = T.focus; }}
                  onBlur={(e) => { e.currentTarget.style.boxShadow = "none"; }}
                >
                  {busyReview ? "Saving..." : "Mark as Reviewed — No Issue"}
                </button>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Photo Lightbox */}
      {photoLightbox && query.photoUrl && (
        <div
          onClick={() => setPhotoLightbox(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Query photo"
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 2000,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <img
            src={query.photoUrl}
            alt="Uploaded plant"
            style={{ maxWidth: "80vw", maxHeight: "80vh", borderRadius: 8, objectFit: "contain" }}
          />
        </div>
      )}
    </>
  );
}

/* ─── Query Log Tab ──────────────────────────────────────────────────────────── */
function QueryLogTab({
  onQueryOpen,
}: {
  onQueryOpen: (q: QueryLog) => void;
}) {
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"date" | "rating" | "converted" | "status">("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  // Filters
  const [filterUserType, setFilterUserType] = useState<"all" | "logged_in" | "guest">("all");
  const [filterHasPhoto, setFilterHasPhoto] = useState<"all" | "yes" | "no">("all");
  const [filterRating, setFilterRating] = useState<"all" | "helpful" | "not_helpful" | "no_rating">("all");
  const [filterConverted, setFilterConverted] = useState<"all" | "yes" | "no">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "normal" | "flagged" | "reviewed">("all");
  const [filterSource, setFilterSource] = useState<"all" | QuerySource>("all");

  const filtered = useMemo(() => {
    let q = [...MOCK_QUERIES];
    if (search) {
      const s = search.toLowerCase();
      q = q.filter((r) => r.query.toLowerCase().includes(s) || r.userName.toLowerCase().includes(s));
    }
    if (filterUserType !== "all") q = q.filter((r) => filterUserType === "guest" ? r.userId === null : r.userId !== null);
    if (filterHasPhoto !== "all") q = q.filter((r) => filterHasPhoto === "yes" ? r.hasPhoto : !r.hasPhoto);
    if (filterRating !== "all") {
      if (filterRating === "no_rating") q = q.filter((r) => r.rating === null);
      else q = q.filter((r) => r.rating === filterRating);
    }
    if (filterConverted !== "all") q = q.filter((r) => filterConverted === "yes" ? r.converted : !r.converted);
    if (filterStatus !== "all") q = q.filter((r) => r.status === filterStatus);
    if (filterSource !== "all") q = q.filter((r) => r.source === filterSource);

    const dir = sortDir === "asc" ? 1 : -1;
    q.sort((a, b) => {
      if (sortBy === "rating") {
        const order = { helpful: 2, not_helpful: 1, null: 0 };
        return (order[a.rating as keyof typeof order] - order[b.rating as keyof typeof order]) * dir;
      }
      if (sortBy === "converted") return ((a.converted ? 1 : 0) - (b.converted ? 1 : 0)) * dir;
      if (sortBy === "status") return a.status.localeCompare(b.status) * dir;
      return 0;
    });
    return q;
  }, [search, filterUserType, filterHasPhoto, filterRating, filterConverted, filterStatus, filterSource, sortBy, sortDir]);

  const hasActiveFilters = filterUserType !== "all" || filterHasPhoto !== "all" || filterRating !== "all" || filterConverted !== "all" || filterStatus !== "all" || filterSource !== "all";

  const clearFilters = () => {
    setFilterUserType("all"); setFilterHasPhoto("all"); setFilterRating("all");
    setFilterConverted("all"); setFilterStatus("all"); setFilterSource("all");
  };

  const handleSort = (col: typeof sortBy) => {
    if (sortBy === col) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else { setSortBy(col); setSortDir("desc"); }
  };

  const thStyle = (col: typeof sortBy): React.CSSProperties => ({
    padding: "10px 12px", textAlign: "left",
    fontSize: 11, fontWeight: 700, color: T.label, textTransform: "uppercase", letterSpacing: "0.06em",
    fontFamily: "Outfit, sans-serif",
    cursor: ["rating", "converted", "status", "date"].includes(col) ? "pointer" : "default",
    userSelect: "none",
    whiteSpace: "nowrap",
  });

  const SortIcon = ({ col }: { col: typeof sortBy }) =>
    sortBy === col ? (sortDir === "asc" ? <Icon.ChevronUp /> : <Icon.ChevronDown />) : null;

  const sourceLabel: Record<QuerySource, string> = {
    chat: "Chat", photo: "Photo", room_visualiser: "Room Viz", quick_prompt: "Quick"
  };

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
          <div style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: T.muted, pointerEvents: "none" }}>
            <Icon.Search />
          </div>
          <input
            type="search"
            placeholder="Search queries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%", padding: "9px 12px 9px 34px",
              background: T.elevated, border: `1px solid ${T.border}`, borderRadius: 6,
              color: T.text, fontSize: 12, fontFamily: "Outfit, sans-serif",
              outline: "none",
            }}
            onFocus={(e) => { e.target.style.borderColor = T.borderActive; e.target.style.boxShadow = T.focus; }}
            onBlur={(e) => { e.target.style.borderColor = T.border; e.target.style.boxShadow = "none"; }}
          />
        </div>

        <button
          onClick={() => setFilterOpen((v) => !v)}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600,
            background: hasActiveFilters ? T.accentBg : T.elevated,
            border: `1px solid ${hasActiveFilters ? T.borderActive : T.border}`,
            color: hasActiveFilters ? T.accent : T.text,
            cursor: "pointer", fontFamily: "Outfit, sans-serif",
          }}
        >
          <Icon.Filter />
          Filter {hasActiveFilters && `(active)`}
        </button>

        <button
          onClick={() => alert("Exporting CSV...")}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600,
            background: T.elevated, border: `1px solid ${T.border}`, color: T.text,
            cursor: "pointer", fontFamily: "Outfit, sans-serif",
          }}
        >
          <Icon.Download /> Export CSV
        </button>
      </div>

      {/* Filter Panel */}
      {filterOpen && (
        <div style={{
          background: T.elevated, border: `1px solid ${T.border}`, borderRadius: 8,
          padding: 16, marginBottom: 16, display: "flex", gap: 16, flexWrap: "wrap",
        }}>
          {[
            { label: "User Type", value: filterUserType, set: setFilterUserType, opts: [["all","All"],["logged_in","Logged-in"],["guest","Guest"]] },
            { label: "Has Photo", value: filterHasPhoto, set: setFilterHasPhoto, opts: [["all","All"],["yes","Yes"],["no","No"]] },
            { label: "Rating", value: filterRating, set: setFilterRating, opts: [["all","All"],["helpful","👍 Helpful"],["not_helpful","👎 Not helpful"],["no_rating","No rating"]] },
            { label: "Converted", value: filterConverted, set: setFilterConverted, opts: [["all","All"],["yes","Converted"],["no","Not converted"]] },
            { label: "Status", value: filterStatus, set: setFilterStatus, opts: [["all","All"],["normal","Normal"],["flagged","Flagged"],["reviewed","Reviewed"]] },
            { label: "Source", value: filterSource, set: setFilterSource, opts: [["all","All"],["chat","Chat"],["photo","Photo"],["room_visualiser","Room Visualiser"],["quick_prompt","Quick prompt"]] },
          ].map(({ label, value, set, opts }) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 140 }}>
              <label style={{ fontSize: 10, fontWeight: 700, color: T.label, textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "Outfit, sans-serif" }}>{label}</label>
              <select
                value={value}
                onChange={(e) => (set as any)(e.target.value)}
                style={{
                  padding: "6px 10px", borderRadius: 6, background: T.overlay,
                  border: `1px solid ${T.border}`, color: T.text,
                  fontSize: 12, fontFamily: "Outfit, sans-serif",
                }}
              >
                {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          ))}
          {hasActiveFilters && (
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button
                onClick={clearFilters}
                style={{
                  padding: "6px 12px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                  background: "none", border: `1px solid ${T.border}`, color: T.muted,
                  cursor: "pointer", fontFamily: "Outfit, sans-serif",
                }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div style={{ background: T.card, border: `1px solid ${T.borderMuted}`, borderRadius: 8, overflow: "hidden" }}>
        {filtered.length === 0 ? (
          <div style={{ padding: 60, textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>{search || hasActiveFilters ? "📭" : "🤖"}</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: T.text, fontFamily: "Outfit, sans-serif", marginBottom: 6 }}>
              {search || hasActiveFilters ? "No queries found" : "No AI Care queries yet"}
            </div>
            <div style={{ fontSize: 12, color: T.muted, fontFamily: "Outfit, sans-serif", marginBottom: 16 }}>
              {search || hasActiveFilters
                ? "Try adjusting your filters or search."
                : "Queries will appear once customers start using the AI Care feature."}
            </div>
            {hasActiveFilters && (
              <button onClick={clearFilters} style={{ padding: "8px 16px", borderRadius: 6, background: T.elevated, border: `1px solid ${T.border}`, color: T.text, cursor: "pointer", fontSize: 12, fontFamily: "Outfit, sans-serif" }}>
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              role="grid"
              aria-label="AI Care queries"
              style={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}
            >
              <thead>
                <tr style={{ borderBottom: `1px solid ${T.borderMuted}` }}>
                  <th style={thStyle("date")} role="columnheader">User</th>
                  <th style={{ ...thStyle("date"), minWidth: 240 }} role="columnheader">Query</th>
                  <th style={thStyle("date")} role="columnheader">Photo</th>
                  <th style={thStyle("rating")} onClick={() => handleSort("rating")} role="columnheader" aria-sort={sortBy === "rating" ? (sortDir === "asc" ? "ascending" : "descending") : "none"}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>Rating <SortIcon col="rating" /></span>
                  </th>
                  <th style={thStyle("converted")} onClick={() => handleSort("converted")} role="columnheader" aria-sort={sortBy === "converted" ? (sortDir === "asc" ? "ascending" : "descending") : "none"}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>Converted <SortIcon col="converted" /></span>
                  </th>
                  <th style={thStyle("status")} onClick={() => handleSort("status")} role="columnheader" aria-sort={sortBy === "status" ? (sortDir === "asc" ? "ascending" : "descending") : "none"}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>Status <SortIcon col="status" /></span>
                  </th>
                  <th style={thStyle("date")} role="columnheader">Date</th>
                  <th style={thStyle("date")} role="columnheader">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((q) => {
                  const isFlagged = q.status === "flagged";
                  return (
                    <tr
                      key={q.id}
                      role="row"
                      aria-label={`${q.userName}: ${q.query}${isFlagged ? " — Flagged" : ""}`}
                      style={{
                        borderBottom: `1px solid ${T.borderMuted}`,
                        background: isFlagged ? T.errorBg : "transparent",
                        borderLeft: isFlagged ? `4px solid ${T.error}` : "4px solid transparent",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) => { if (!isFlagged) (e.currentTarget as HTMLElement).style.background = T.elevated; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = isFlagged ? T.errorBg : "transparent"; }}
                    >
                      {/* User */}
                      <td style={{ padding: "10px 12px", width: 140 }}>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <Avatar initials={q.userAvatar} size={28} />
                          <div style={{ fontSize: 12, color: q.userId ? T.text : T.muted, fontFamily: "Outfit, sans-serif", fontStyle: q.userId ? "normal" : "italic" }}>
                            {q.userName}
                          </div>
                        </div>
                      </td>

                      {/* Query */}
                      <td style={{ padding: "10px 12px" }}>
                        <div
                          onClick={() => onQueryOpen(q)}
                          style={{
                            fontSize: 12, color: T.text, fontFamily: "Outfit, sans-serif",
                            cursor: "pointer", maxWidth: 280,
                            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                          }}
                          title={q.query}
                        >
                          {q.query.length > 60 ? q.query.slice(0, 60) + "…" : q.query}
                        </div>
                        <div style={{ fontSize: 10, color: T.muted, fontFamily: "Outfit, sans-serif", marginTop: 2 }}>
                          {sourceLabel[q.source]} · {q.sessionTurns} turns
                        </div>
                      </td>

                      {/* Photo */}
                      <td style={{ padding: "10px 12px", width: 70, textAlign: "center" }}>
                        {q.hasPhoto ? (
                          <span style={{ color: T.info }} title="Has photo upload"><Icon.Camera /></span>
                        ) : (
                          <span style={{ color: T.muted }}>—</span>
                        )}
                      </td>

                      {/* Rating */}
                      <td style={{ padding: "10px 12px", width: 80 }}>
                        <RatingDisplay rating={q.rating} />
                      </td>

                      {/* Converted */}
                      <td style={{ padding: "10px 12px", width: 90 }}>
                        {q.converted ? (
                          <span
                            style={{ color: T.success, fontSize: 12, fontWeight: 700, fontFamily: "Outfit, sans-serif" }}
                            aria-label="Added to cart: Yes"
                          >
                            ✓ {q.conversionAmount ? formatCurrency(q.conversionAmount) : ""}
                          </span>
                        ) : (
                          <span style={{ color: T.muted }} aria-label="Added to cart: No">—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td style={{ padding: "10px 12px", width: 100 }}>
                        <StatusBadge status={q.status} />
                      </td>

                      {/* Date */}
                      <td style={{ padding: "10px 12px", width: 110 }}>
                        <div style={{ fontSize: 11, color: T.text, fontFamily: "Outfit, sans-serif" }} title={q.dateAbsolute}>{q.date}</div>
                        <div style={{ fontSize: 10, color: T.muted, fontFamily: "Outfit, sans-serif" }}>{q.dateAbsolute.split(" · ")[0]}</div>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: "10px 12px", width: 100 }}>
                        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                          <button
                            onClick={() => onQueryOpen(q)}
                            title="View conversation"
                            style={{
                              padding: "4px 10px", borderRadius: 5, fontSize: 11, fontWeight: 600,
                              background: T.elevated, border: `1px solid ${T.border}`, color: T.text,
                              cursor: "pointer", fontFamily: "Outfit, sans-serif",
                            }}
                          >
                            View
                          </button>

                          {/* Overflow menu */}
                          <div style={{ position: "relative" }}>
                            <button
                              onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === q.id ? null : q.id); }}
                              aria-haspopup="menu"
                              style={{
                                padding: "4px 6px", borderRadius: 5,
                                background: T.elevated, border: `1px solid ${T.border}`, color: T.muted,
                                cursor: "pointer",
                              }}
                            >
                              <Icon.MoreVert />
                            </button>
                            {menuOpen === q.id && (
                              <div
                                role="menu"
                                style={{
                                  position: "absolute", right: 0, top: "100%", marginTop: 4,
                                  background: T.overlay, border: `1px solid ${T.border}`, borderRadius: 8,
                                  boxShadow: T.shadowLg, zIndex: 100, minWidth: 180,
                                }}
                                onClick={() => setMenuOpen(null)}
                              >
                                {[
                                  { label: "View Full Conversation", icon: <Icon.Eye />, onClick: () => onQueryOpen(q) },
                                  { label: "View Customer Profile", icon: <Icon.ExternalLink />, onClick: () => alert("Navigate to customer") },
                                  null,
                                  { label: "Flag as Inappropriate", icon: <Icon.Flag />, danger: true, onClick: () => { onQueryOpen(q); } },
                                  { label: "Mark as Reviewed", icon: <Icon.Check />, onClick: () => alert("Marked reviewed") },
                                  null,
                                  { label: "Delete Query Log", icon: <Icon.Trash />, danger: true, superAdminOnly: true, onClick: () => { if (confirm("Delete this query log entry? This cannot be undone.")) alert("Deleted"); } },
                                ].map((item, i) =>
                                  item === null ? (
                                    <div key={i} style={{ height: 1, background: T.borderMuted, margin: "4px 0" }} />
                                  ) : (
                                    <button
                                      key={i}
                                      role="menuitem"
                                      onClick={item.onClick}
                                      style={{
                                        display: "flex", alignItems: "center", gap: 8, width: "100%",
                                        padding: "8px 14px", background: "none", border: "none",
                                        color: (item as any).danger ? T.error : T.text,
                                        fontSize: 12, cursor: "pointer", fontFamily: "Outfit, sans-serif",
                                        textAlign: "left",
                                      }}
                                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = T.elevated; }}
                                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "none"; }}
                                    >
                                      <span style={{ color: (item as any).danger ? T.error : T.muted }}>{item.icon}</span>
                                      {item.label}
                                    </button>
                                  )
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div style={{ marginTop: 10, fontSize: 11, color: T.muted, fontFamily: "Outfit, sans-serif" }}>
        Showing {filtered.length} of {MOCK_QUERIES.length} queries
      </div>
    </div>
  );
}

/* ─── Settings Tab ───────────────────────────────────────────────────────────── */
function SettingsTab({ onSave }: { onSave: () => void }) {
  const [settings, setSettings] = useState<AISettings>(DEFAULT_SETTINGS);
  const [saving, setSaving] = useState(false);

  const toggle = (key: keyof AISettings) => setSettings((s) => ({ ...s, [key]: !s[key as keyof typeof s] }));
  const set = (key: keyof AISettings, val: string | number) => setSettings((s) => ({ ...s, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
    onSave();
  };

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: T.label, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14, fontFamily: "Outfit, sans-serif", borderBottom: `1px solid ${T.borderMuted}`, paddingBottom: 8 }}>
        {title}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{children}</div>
    </div>
  );

  const ToggleRow = ({ id, label, desc, checked, onChange }: { id: string; label: string; desc?: string; checked: boolean; onChange: (v: boolean) => void }) => (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
      <div style={{ flex: 1 }}>
        <label htmlFor={id} style={{ fontSize: 13, fontWeight: 500, color: T.text, fontFamily: "Outfit, sans-serif", cursor: "pointer", display: "block" }}>{label}</label>
        {desc && <div style={{ fontSize: 11, color: T.muted, fontFamily: "Outfit, sans-serif", marginTop: 2 }}>{desc}</div>}
      </div>
      <ToggleSwitch id={id} checked={checked} onChange={onChange} label={label} />
    </div>
  );

  const SelectRow = ({ id, label, value, onChange, opts }: { id: string; label: string; value: string; onChange: (v: string) => void; opts: [string, string][] }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
      <label htmlFor={id} style={{ fontSize: 13, fontWeight: 500, color: T.text, fontFamily: "Outfit, sans-serif" }}>{label}</label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: "7px 12px", borderRadius: 6, background: T.elevated,
          border: `1px solid ${T.border}`, color: T.text,
          fontSize: 12, fontFamily: "Outfit, sans-serif", minWidth: 200,
        }}
      >
        {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </div>
  );

  return (
    <div style={{ maxWidth: 680 }}>
      <div style={{ background: T.card, border: `1px solid ${T.borderMuted}`, borderRadius: 8, padding: 24 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: T.text, fontFamily: "Outfit, sans-serif", marginBottom: 24 }}>
          AI Care Settings
        </div>

        <Section title="Availability">
          <ToggleRow id="enabled" label="AI Care enabled on storefront" desc="Master switch — disabling hides AI Care everywhere" checked={settings.enabledOnStorefront} onChange={(v) => toggle("enabledOnStorefront")} />
          <div style={{ paddingLeft: 0 }}>
            <div style={{ fontSize: 12, color: T.muted, fontFamily: "Outfit, sans-serif", marginBottom: 8 }}>Show on:</div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {([["showOnPDP", "Product pages (PDP)"], ["showOnDedicatedPage", "Dedicated page"], ["showFloatingWidget", "Floating widget (mobile)"]] as [keyof AISettings, string][]).map(([k, l]) => (
                <label key={k} style={{ display: "flex", gap: 8, alignItems: "center", cursor: "pointer", fontSize: 12, color: T.text, fontFamily: "Outfit, sans-serif" }}>
                  <input type="checkbox" checked={!!settings[k]} onChange={() => toggle(k)} style={{ accentColor: T.accent }} />
                  {l}
                </label>
              ))}
            </div>
          </div>
        </Section>

        <Section title="Features">
          <ToggleRow id="photoUploads" label="Allow photo uploads (Plant ID)" desc="Enables customers to upload plant photos for AI identification" checked={settings.allowPhotoUploads} onChange={() => toggle("allowPhotoUploads")} />
          <ToggleRow id="roomVis" label="Room Visualiser mode" checked={settings.roomVisualiserMode} onChange={() => toggle("roomVisualiserMode")} />
          <ToggleRow id="quickPrompts" label="Quick prompts on widget open" desc="Show suggested starter questions when chat opens" checked={settings.quickPromptsOnOpen} onChange={() => toggle("quickPromptsOnOpen")} />
          <ToggleRow id="productRecs" label="Product recommendations in responses" desc="Allow AI to suggest and link products" checked={settings.productRecommendations} onChange={() => toggle("productRecommendations")} />
          <ToggleRow id="history" label="Allow conversation history (returning users)" desc="Beta — requires customer to be logged in" checked={settings.allowConversationHistory} onChange={() => toggle("allowConversationHistory")} />
        </Section>

        <Section title="Response Settings">
          <SelectRow id="language" label="Language" value={settings.language} onChange={(v) => set("language", v)} opts={[["english", "English"], ["hindi", "Hindi (beta)"]]} />
          <SelectRow id="tone" label="Tone" value={settings.tone} onChange={(v) => set("tone", v)} opts={[["friendly", "Friendly & informative"], ["professional", "Professional"], ["concise", "Concise"]]} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <label htmlFor="maxWords" style={{ fontSize: 13, fontWeight: 500, color: T.text, fontFamily: "Outfit, sans-serif" }}>Max response length (words)</label>
            <input
              id="maxWords"
              type="number"
              value={settings.maxResponseWords}
              onChange={(e) => set("maxResponseWords", parseInt(e.target.value))}
              min={50} max={600} step={50}
              style={{
                width: 80, padding: "7px 10px", borderRadius: 6,
                background: T.elevated, border: `1px solid ${T.border}`, color: T.text,
                fontSize: 12, fontFamily: "Outfit, sans-serif", textAlign: "center",
              }}
            />
          </div>
          <div>
            <label htmlFor="fallback" style={{ fontSize: 13, fontWeight: 500, color: T.text, fontFamily: "Outfit, sans-serif", display: "block", marginBottom: 6 }}>Fallback message</label>
            <textarea
              id="fallback"
              value={settings.fallbackMessage}
              onChange={(e) => set("fallbackMessage", e.target.value)}
              style={{
                width: "100%", padding: "8px 12px", borderRadius: 6,
                background: T.elevated, border: `1px solid ${T.border}`, color: T.text,
                fontSize: 12, fontFamily: "Outfit, sans-serif", resize: "vertical", minHeight: 70,
              }}
            />
          </div>
        </Section>

        <Section title="Safety Filters">
          <ToggleRow id="harmBlock" label="Block harmful/dangerous plant advice" desc="AI will decline requests for advice that could harm plants or humans" checked={settings.blockHarmfulAdvice} onChange={() => toggle("blockHarmfulAdvice")} />
          <ToggleRow id="profanity" label="Auto-flag queries with profanity" checked={settings.autoFlagProfanity} onChange={() => toggle("autoFlagProfanity")} />
          <ToggleRow id="piiFlag" label="Auto-flag PII in conversations" desc="Detects and flags queries containing personal data" checked={settings.autoFlagPII} onChange={() => toggle("autoFlagPII")} />
        </Section>

        <Section title="Logging & Privacy">
          <ToggleRow id="logConvs" label="Log all conversations (for analytics)" desc="Required for this dashboard. Disabling stops new data collection." checked={settings.logConversations} onChange={() => toggle("logConversations")} />
          <SelectRow id="retention" label="Data retention period" value={settings.retentionDays} onChange={(v) => set("retentionDays", v)} opts={[["30", "30 days"], ["60", "60 days"], ["90", "90 days"], ["365", "1 year"], ["never", "Never delete"]]} />
          <ToggleRow id="notice" label={`Show "conversation saved" notice to users`} desc="Recommended for DPDPA / GDPR compliance" checked={settings.showConversationNotice} onChange={() => toggle("showConversationNotice")} />
        </Section>

        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            width: "100%", height: 44, borderRadius: 8, fontSize: 14, fontWeight: 700,
            background: saving ? T.elevated : T.accent,
            border: "none", color: saving ? T.muted : "#fff",
            cursor: saving ? "wait" : "pointer",
            fontFamily: "Outfit, sans-serif", transition: "all 0.15s",
          }}
          onFocus={(e) => { e.currentTarget.style.boxShadow = T.focus; }}
          onBlur={(e) => { e.currentTarget.style.boxShadow = "none"; }}
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}

/* ─── Overview Tab ───────────────────────────────────────────────────────────── */
function OverviewTab({ onFilterToTab }: { onFilterToTab: (tab: string) => void }) {
  const [volumeGranularity, setVolumeGranularity] = useState<"Daily" | "Weekly" | "Monthly">("Daily");
  const volumeData = volumeGranularity === "Daily" ? VOLUME_DATA_DAILY : volumeGranularity === "Weekly" ? VOLUME_DATA_WEEKLY : VOLUME_DATA_MONTHLY;

  const Panel = ({ title, children, action, footer }: { title: string; children: React.ReactNode; action?: React.ReactNode; footer?: React.ReactNode }) => (
    <div style={{ background: T.card, border: `1px solid ${T.borderMuted}`, borderRadius: 8, padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: T.text, fontFamily: "Outfit, sans-serif" }}>{title}</div>
        {action}
      </div>
      {children}
      {footer && <div style={{ marginTop: 16 }}>{footer}</div>}
    </div>
  );

  const sparkline7 = DAU_DATA.slice(-7).map((d) => d.count);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Row 1: Volume Chart full width */}
      <Panel
        title="Query Volume"
        action={
          <div style={{ display: "flex", gap: 4 }}>
            {(["Daily", "Weekly", "Monthly"] as const).map((g) => (
              <button key={g} onClick={() => setVolumeGranularity(g)} style={{
                padding: "4px 10px", borderRadius: 5, fontSize: 11, fontWeight: 600,
                background: volumeGranularity === g ? T.accentBg : T.elevated,
                border: `1px solid ${volumeGranularity === g ? T.borderActive : T.border}`,
                color: volumeGranularity === g ? T.accent : T.muted,
                cursor: "pointer", fontFamily: "Outfit, sans-serif",
              }}>{g}</button>
            ))}
            <button onClick={() => alert("Exporting chart…")} style={{ padding: "4px 8px", borderRadius: 5, fontSize: 11, background: T.elevated, border: `1px solid ${T.border}`, color: T.muted, cursor: "pointer" }}>
              <Icon.Download />
            </button>
          </div>
        }
      >
        <LineChart data={volumeData} height={260} />
      </Panel>

      {/* Row 2: Satisfaction + Source */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <Panel title="Response Quality">
          <SatisfactionChart onFilter={() => onFilterToTab("Query Log")} />
        </Panel>

        <Panel title="Query Sources">
          <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
            <DonutChart
              segments={SOURCE_DATA.map((s) => ({ label: s.label, value: s.percent, color: s.color }))}
              size={130}
              label="Sources"
            />
            <div style={{ flex: 1, minWidth: 120 }}>
              {SOURCE_DATA.map((s) => (
                <div
                  key={s.label}
                  onClick={() => onFilterToTab("Query Log")}
                  style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, cursor: "pointer" }}
                >
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: s.color, display: "inline-block", flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: T.label, fontFamily: "Outfit, sans-serif", flex: 1 }}>{s.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: T.text, fontFamily: "Outfit, sans-serif" }}>{s.percent}%</span>
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </div>

      {/* Row 3: Top Questions full width */}
      <Panel
        title="Most Common Questions"
        action={
          <button
            onClick={() => onFilterToTab("Query Log")}
            style={{ fontSize: 12, color: T.accent, background: "none", border: "none", cursor: "pointer", fontFamily: "Outfit, sans-serif", fontWeight: 600 }}
          >
            View All →
          </button>
        }
      >
        <div style={{ overflowX: "auto" }}>
          <table role="grid" aria-label="Most common questions" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${T.borderMuted}` }}>
                {["#", "Question Topic", "Count", "Avg Rating"].map((h) => (
                  <th key={h} style={{ padding: "8px 12px", textAlign: h === "#" ? "center" : "left", fontSize: 11, fontWeight: 700, color: T.label, textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "Outfit, sans-serif" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TOP_QUESTIONS.map((q) => {
                const isGap = q.avgRating < 60;
                return (
                  <tr
                    key={q.rank}
                    onClick={() => onFilterToTab("Query Log")}
                    style={{
                      borderBottom: `1px solid ${T.borderMuted}`, cursor: "pointer",
                      background: isGap ? "rgba(198,144,38,0.06)" : "transparent",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = isGap ? "rgba(198,144,38,0.1)" : T.elevated; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = isGap ? "rgba(198,144,38,0.06)" : "transparent"; }}
                  >
                    <td style={{ padding: "9px 12px", textAlign: "center", fontSize: 12, fontWeight: 700, color: T.muted, fontFamily: "Outfit, sans-serif" }}>{q.rank}</td>
                    <td style={{ padding: "9px 12px", fontSize: 12, color: T.text, fontFamily: "Outfit, sans-serif" }}>
                      {q.topic}
                      {isGap && <span style={{ marginLeft: 8, fontSize: 10, color: T.warning, fontWeight: 600 }}>⚠ Knowledge gap</span>}
                    </td>
                    <td style={{ padding: "9px 12px", fontSize: 12, fontWeight: 600, color: T.text, fontFamily: "Outfit, sans-serif" }}>{formatNumber(q.count)}</td>
                    <td style={{ padding: "9px 12px" }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: q.avgRating >= 70 ? T.success : q.avgRating >= 60 ? T.warning : T.error, fontFamily: "Outfit, sans-serif" }}>
                        {q.avgRating >= 70 ? "👍" : q.avgRating >= 60 ? "⚠" : "👎"} {q.avgRating}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Row 4: Plant ID Stats + Funnel */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <Panel title="Plant ID Accuracy">
          <div style={{ display: "flex", gap: 20, alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap" }}>
            <DonutChart
              segments={[
                { label: "Identified", value: PLANT_ID_STATS.identified, color: T.success },
                { label: "Low confidence", value: PLANT_ID_STATS.lowConfidence, color: T.warning },
                { label: "Failed", value: PLANT_ID_STATS.failed, color: T.error },
              ]}
              size={110}
              label={`${PLANT_ID_STATS.identified}%`}
            />
            <div style={{ flex: 1, minWidth: 120 }}>
              {[
                { label: "Identified successfully", value: PLANT_ID_STATS.identified, color: T.success },
                { label: "Low confidence (<70%)", value: PLANT_ID_STATS.lowConfidence, color: T.warning },
                { label: "Failed / unrecognised", value: PLANT_ID_STATS.failed, color: T.error },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: item.color, flexShrink: 0, display: "inline-block" }} />
                  <span style={{ fontSize: 11, color: T.label, fontFamily: "Outfit, sans-serif", flex: 1 }}>{item.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: item.color, fontFamily: "Outfit, sans-serif" }}>{item.value}%</span>
                </div>
              ))}
              <div style={{ fontSize: 11, color: T.muted, fontFamily: "Outfit, sans-serif", marginTop: 8 }}>
                Total: {formatNumber(PLANT_ID_STATS.totalRequests)} ID requests
              </div>
            </div>
          </div>

          <div style={{ fontSize: 12, fontWeight: 600, color: T.label, fontFamily: "Outfit, sans-serif", marginBottom: 10 }}>
            Most Uploaded Plants
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {MOST_UPLOADED_PLANTS.slice(0, 5).map((p) => (
              <div key={p.plantName} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 11, color: T.text, fontFamily: "Outfit, sans-serif", flex: 1 }}>{p.plantName}</span>
                <span style={{ fontSize: 11, color: T.muted, fontFamily: "Outfit, sans-serif" }}>{formatNumber(p.count)}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="AI → Cart Conversion Funnel">
          <FunnelChart />
        </Panel>
      </div>

      {/* Row 5: DAU Chart */}
      <Panel title="Daily Active AI Users (DAU)" action={<span style={{ fontSize: 11, color: T.muted, fontFamily: "Outfit, sans-serif" }}>Last 30 days</span>}>
        <MiniBarChart data={DAU_DATA} color={T.chart1} height={200} />
      </Panel>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────────────────── */
export default function AdminAICarePage() {
  const [activeTab, setActiveTab] = useState<"Overview" | "Query Log" | "Settings">("Overview");
  const [dateRange, setDateRange] = useState("last_30");
  const [selectedQuery, setSelectedQuery] = useState<QueryLog | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const showToast = useCallback((message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
  }, []);

  const handleFlag = useCallback((id: string, reason: FlagReason, note?: string) => {
    setSelectedQuery(null);
    showToast("Query flagged as inappropriate", "error");
  }, [showToast]);

  const handleMarkReviewed = useCallback((id: string, note?: string) => {
    setSelectedQuery(null);
    showToast("Query marked as reviewed — no issue", "success");
  }, [showToast]);

  // Keyboard nav for tabs
  const tabs = ["Overview", "Query Log", "Settings"] as const;
  const handleTabKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "ArrowRight") { const next = (index + 1) % tabs.length; tabRefs.current[next]?.focus(); setActiveTab(tabs[next]); }
    if (e.key === "ArrowLeft") { const prev = (index - 1 + tabs.length) % tabs.length; tabRefs.current[prev]?.focus(); setActiveTab(tabs[prev]); }
  };

  const dateRangeLabel: Record<string, string> = {
    today: "Today", last_7: "Last 7 days", last_30: "Last 30 days", last_90: "Last 90 days",
  };

  const kpiSparklines = {
    total: DAU_DATA.slice(-12).map((d) => d.count * 5 + Math.random() * 50),
    users: DAU_DATA.slice(-12).map((d) => d.count + Math.random() * 10),
    photos: DAU_DATA.slice(-12).map((d) => d.count * 2 + Math.random() * 30),
    helpful: [74, 75, 73, 76, 77, 78, 77, 78, 79, 78, 78, 78],
    cart: [10, 11, 10.5, 11.2, 12, 11.8, 12.2, 12.1, 12.3, 12.4, 12.4, 12.4],
    flagged: [3.8, 3.6, 3.5, 3.4, 3.3, 3.2, 3.2, 3.3, 3.2, 3.1, 3.2, 3.2],
  };

  return (
    <>
      <style>{`
        @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #444c56; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #768390; }
        select option { background: #2d333b; }
        @keyframes slideFromRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideInRight { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      `}</style>

      <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: "Outfit, sans-serif", minWidth: 1100 }}>
        <div style={{ padding: 24 }}>

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" style={{ marginBottom: 16 }}>
            <ol style={{ display: "flex", gap: 6, alignItems: "center", listStyle: "none", fontSize: 12, color: T.muted }}>
              <li><Link href="/admin" style={{ color: T.muted, textDecoration: "none" }}>Admin</Link></li>
              <li style={{ color: T.borderMuted }}>/</li>
              <li aria-current="page" style={{ color: T.text, fontWeight: 500 }}>AI Care Usage</li>
            </ol>
          </nav>

          {/* Page Header */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24, gap: 16, flexWrap: "wrap" }}>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 700, color: T.text, fontFamily: "Outfit, sans-serif", marginBottom: 4, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ color: T.accent, background: T.accentBg, padding: 6, borderRadius: 8, display: "flex" }}><Icon.Bot /></span>
                AI Care Usage
              </h1>
              <p style={{ fontSize: 12, color: T.muted, fontFamily: "Outfit, sans-serif" }}>
                Monitoring <strong style={{ color: T.text }}>14,821</strong> total queries ·{" "}
                <strong style={{ color: T.error }}>4.2%</strong> flagged ·{" "}
                <strong style={{ color: T.success }}>12.4%</strong> cart conversion
              </p>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ position: "relative" }}>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  style={{
                    padding: "8px 32px 8px 10px", borderRadius: 6,
                    background: T.elevated, border: `1px solid ${T.border}`,
                    color: T.text, fontSize: 12, fontFamily: "Outfit, sans-serif",
                    appearance: "none", cursor: "pointer", paddingLeft: 30,
                  }}
                  aria-label="Date range"
                >
                  <option value="today">Today</option>
                  <option value="last_7">Last 7 days</option>
                  <option value="last_30">Last 30 days</option>
                  <option value="last_90">Last 90 days</option>
                  <option value="custom">Custom range</option>
                </select>
                <span style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: T.muted }}>
                  <Icon.Calendar />
                </span>
                <span style={{ position: "absolute", right: 9, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: T.muted }}>
                  <Icon.ChevronDown />
                </span>
              </div>
              <button
                onClick={() => alert("Exporting query log CSV…")}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600,
                  background: T.elevated, border: `1px solid ${T.border}`, color: T.text,
                  cursor: "pointer", fontFamily: "Outfit, sans-serif",
                }}
              >
                <Icon.Download /> Export
              </button>
            </div>
          </div>

          {/* KPI Cards Row */}
          <div
            role="region"
            aria-label="AI Care metrics"
            style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12, marginBottom: 24 }}
          >
            <KpiCard
              label="Total Queries"
              value={formatNumber(KPI_DATA.totalQueries)}
              trend={KPI_DATA.totalQueriesTrend}
              sparkline={kpiSparklines.total}
              onClick={() => setActiveTab("Query Log")}
            />
            <KpiCard
              label="Unique Users"
              value={formatNumber(KPI_DATA.uniqueUsers)}
              trend={KPI_DATA.uniqueUsersTrend}
              sparkline={kpiSparklines.users}
              onClick={() => setActiveTab("Query Log")}
            />
            <KpiCard
              label="Photo Uploads"
              value={formatNumber(KPI_DATA.photoUploads)}
              icon="📷"
              sub={`${KPI_DATA.photoUploadsPercent}% of queries`}
              sparkline={kpiSparklines.photos}
              accentColor={T.info}
              onClick={() => setActiveTab("Query Log")}
            />
            <KpiCard
              label="Helpful Rating"
              value={`${KPI_DATA.helpfulRating}%`}
              icon="👍"
              trend={KPI_DATA.helpfulRatingTrend}
              sparkline={kpiSparklines.helpful}
              accentColor={T.success}
              onClick={() => setActiveTab("Query Log")}
            />
            <KpiCard
              label="Cart Converted"
              value={`${KPI_DATA.cartConversionRate}%`}
              icon="₹"
              sub={`${formatCurrency(KPI_DATA.cartConversionRevenue)} revenue`}
              sparkline={kpiSparklines.cart}
              accentColor={T.accent}
              onClick={() => setActiveTab("Query Log")}
            />
            <KpiCard
              label="Flagged"
              value={`${KPI_DATA.flaggedRate}%`}
              icon="⚠"
              sub="Needs review"
              sparkline={kpiSparklines.flagged}
              accentColor={T.error}
              leftAccent={T.error}
              onClick={() => setActiveTab("Query Log")}
            />
          </div>

          {/* Main Tabs */}
          <div
            role="tablist"
            aria-label="AI Care sections"
            style={{ display: "flex", gap: 0, borderBottom: `1px solid ${T.borderMuted}`, marginBottom: 20 }}
          >
            {tabs.map((tab, i) => (
              <button
                key={tab}
                ref={(el) => { tabRefs.current[i] = el; }}
                role="tab"
                id={`tab-${tab.toLowerCase().replace(" ", "-")}`}
                aria-selected={activeTab === tab}
                aria-controls={`panel-${tab.toLowerCase().replace(" ", "-")}`}
                onClick={() => setActiveTab(tab)}
                onKeyDown={(e) => handleTabKeyDown(e, i)}
                style={{
                  padding: "10px 20px", background: "none", border: "none",
                  borderBottom: activeTab === tab ? `2px solid ${T.accent}` : "2px solid transparent",
                  color: activeTab === tab ? T.accent : T.muted,
                  fontSize: 12, fontWeight: 600, cursor: "pointer",
                  fontFamily: "Outfit, sans-serif", transition: "all 0.15s",
                  display: "flex", alignItems: "center", gap: 6,
                }}
                onFocus={(e) => { e.currentTarget.style.outline = `2px solid ${T.accent}`; e.currentTarget.style.outlineOffset = "-2px"; }}
                onBlur={(e) => { e.currentTarget.style.outline = "none"; }}
              >
                {tab === "Settings" && <Icon.Settings />}
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div
            role="tabpanel"
            id={`panel-${activeTab.toLowerCase().replace(" ", "-")}`}
            aria-labelledby={`tab-${activeTab.toLowerCase().replace(" ", "-")}`}
          >
            {activeTab === "Overview" && (
              <OverviewTab onFilterToTab={(t) => setActiveTab(t as typeof activeTab)} />
            )}
            {activeTab === "Query Log" && (
              <QueryLogTab onQueryOpen={setSelectedQuery} />
            )}
            {activeTab === "Settings" && (
              <SettingsTab onSave={() => showToast("Settings saved successfully", "success")} />
            )}
          </div>
        </div>
      </div>

      {/* Query Detail Drawer */}
      {selectedQuery && (
        <QueryDetailDrawer
          query={selectedQuery}
          onClose={() => setSelectedQuery(null)}
          onFlag={handleFlag}
          onMarkReviewed={handleMarkReviewed}
        />
      )}

      {/* Toast */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </>
  );
}
