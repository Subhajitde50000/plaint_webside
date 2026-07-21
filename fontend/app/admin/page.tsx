"use client";

import Link from "next/link";
import { useState, useMemo } from "react";

/* ════════════════════════════════════════════
   Types
════════════════════════════════════════════ */
type Range = "today" | "7d" | "30d" | "month";

/* ════════════════════════════════════════════
   Mock Data
════════════════════════════════════════════ */
const KPI_CARDS = [
  { id: "revenue",       label: "Total Revenue",      value: "₹4,82,340",  delta: "+18.4%",  positive: true,  ctx: "vs last month",    icon: "💰", sparkType: "line" as const },
  { id: "orders",        label: "Orders Today",        value: "124",         delta: "+12",     positive: true,  ctx: "vs yesterday",     icon: "📦", sparkType: "bar"  as const },
  { id: "customers",     label: "Active Customers",    value: "3,891",       delta: "+4.2%",   positive: true,  ctx: "vs last month",    icon: "👥", sparkType: "line" as const },
  { id: "aov",           label: "Avg Order Value",     value: "₹1,248",     delta: "−2.1%",   positive: false, ctx: "vs last month",    icon: "🛒", sparkType: "line" as const },
  { id: "units",         label: "Units Sold",          value: "8,420",       delta: "+6.3%",   positive: true,  ctx: "vs last month",    icon: "📊", sparkType: "bar"  as const },
  { id: "returns",       label: "Return Rate",         value: "1.8%",        delta: "−0.4%",   positive: true,  ctx: "vs last month",    icon: "↩️", sparkType: "line" as const },
  { id: "garden",        label: "Garden Bookings",     value: "47",          delta: "+8",      positive: true,  ctx: "this month",       icon: "🌱", sparkType: "bar"  as const },
  { id: "aicare",        label: "AI Care Queries",     value: "14,821",      delta: "+22%",    positive: true,  ctx: "vs last month",    icon: "🤖", sparkType: "line" as const },
];

const RECENT_ORDERS = [
  { id: "ORD-4831", customer: "Priya Kumar",   email: "priya@email.com",    date: "28 Jun, 10:24 AM", items: 3,  total: "₹1,248", payment: "Paid",    status: "Delivered"  },
  { id: "ORD-4830", customer: "Ravi Shah",     email: "ravi@email.com",     date: "28 Jun, 09:12 AM", items: 1,  total: "₹399",   payment: "Pending",  status: "Processing" },
  { id: "ORD-4829", customer: "Sunita Verma",  email: "sunita@email.com",   date: "27 Jun, 06:55 PM", items: 5,  total: "₹2,890", payment: "Paid",    status: "Shipped"    },
  { id: "ORD-4828", customer: "Karthik R.",    email: "karthik@email.com",  date: "27 Jun, 04:30 PM", items: 2,  total: "₹748",   payment: "Paid",    status: "Delivered"  },
  { id: "ORD-4827", customer: "Anjali Mehta",  email: "anjali@email.com",   date: "27 Jun, 02:18 PM", items: 1,  total: "₹199",   payment: "Failed",   status: "Cancelled"  },
  { id: "ORD-4826", customer: "Deepak Nair",   email: "deepak@email.com",   date: "27 Jun, 12:44 PM", items: 4,  total: "₹1,596", payment: "Paid",    status: "Shipped"    },
  { id: "ORD-4825", customer: "Meera Pillai",  email: "meera@email.com",    date: "26 Jun, 08:30 PM", items: 2,  total: "₹598",   payment: "Paid",    status: "Delivered"  },
  { id: "ORD-4824", customer: "Suresh Kumar",  email: "suresh@email.com",   date: "26 Jun, 05:15 PM", items: 1,  total: "₹3,499", payment: "Paid",    status: "Shipped"    },
  { id: "ORD-4823", customer: "Pooja Sharma",  email: "pooja@email.com",    date: "26 Jun, 03:00 PM", items: 6,  total: "₹2,394", payment: "Paid",    status: "Delivered"  },
  { id: "ORD-4822", customer: "Vikram Sinha",  email: "vikram@email.com",   date: "26 Jun, 01:22 PM", items: 3,  total: "₹897",   payment: "Paid",    status: "Returned"   },
];

const LOW_STOCK = [
  { product: "Snake Plant",           sku: "SKU-SP-002",  stock: 3,   reorder: 10 },
  { product: "Pothos Vine",           sku: "SKU-PV-001",  stock: 7,   reorder: 15 },
  { product: "Peace Lily S",          sku: "SKU-PL-001",  stock: 0,   reorder: 20 },
  { product: "Golden Cane Palm",      sku: "SKU-GC-003",  stock: 5,   reorder: 12 },
  { product: "ZZ Plant M",            sku: "SKU-ZZ-002",  stock: 9,   reorder: 10 },
];

const CATEGORIES = [
  { name: "Indoor Plants",  pct: 47, color: "var(--admin-chart-1)" },
  { name: "Outdoor Plants", pct: 23, color: "var(--admin-chart-2)" },
  { name: "Seeds",          pct: 15, color: "var(--admin-chart-3)" },
  { name: "Succulents",     pct: 10, color: "var(--admin-chart-4)" },
  { name: "Other",          pct:  5, color: "var(--admin-chart-5)" },
];

const GARDEN_BOOKINGS = [
  { customer: "Anjali Mehta",  service: "Lawn Maintenance",         time: "10:00 AM", status: "Confirmed" },
  { customer: "Karthik R.",    service: "Balcony Garden Setup",      time: "2:00 PM",  status: "Pending"   },
  { customer: "Meera Pillai",  service: "Indoor Plant Arrangement",  time: "4:00 PM",  status: "Confirmed" },
  { customer: "Deepak Nair",   service: "Terrace Garden Design",     time: "5:30 PM",  status: "Confirmed" },
];

/* ── Revenue chart data by range ── */
const CHART_DATA: Record<Range, { label: string; revenue: number; orders: number; aov: number }[]> = {
  today: [
    { label: "9AM",  revenue: 8400,  orders: 7,  aov: 1200 },
    { label: "11AM", revenue: 14200, orders: 11, aov: 1290 },
    { label: "1PM",  revenue: 11800, orders: 9,  aov: 1311 },
    { label: "3PM",  revenue: 18600, orders: 15, aov: 1240 },
    { label: "5PM",  revenue: 22100, orders: 18, aov: 1228 },
    { label: "7PM",  revenue: 16400, orders: 13, aov: 1261 },
    { label: "9PM",  revenue: 9800,  orders: 8,  aov: 1225 },
  ],
  "7d": [
    { label: "Mon", revenue: 38200, orders: 31, aov: 1232 },
    { label: "Tue", revenue: 42100, orders: 34, aov: 1238 },
    { label: "Wed", revenue: 35800, orders: 28, aov: 1279 },
    { label: "Thu", revenue: 58600, orders: 47, aov: 1246 },
    { label: "Fri", revenue: 72300, orders: 58, aov: 1246 },
    { label: "Sat", revenue: 68400, orders: 55, aov: 1244 },
    { label: "Sun", revenue: 52400, orders: 42, aov: 1248 },
  ],
  "30d": [
    { label: "Jun 1",  revenue: 42000,  orders: 34,  aov: 1235 },
    { label: "Jun 7",  revenue: 56000,  orders: 45,  aov: 1244 },
    { label: "Jun 14", revenue: 48000,  orders: 38,  aov: 1263 },
    { label: "Jun 21", revenue: 71000,  orders: 57,  aov: 1246 },
    { label: "Jun 28", revenue: 82340,  orders: 66,  aov: 1248 },
  ],
  month: [
    { label: "Jan", revenue: 320000, orders: 256, aov: 1250 },
    { label: "Feb", revenue: 290000, orders: 232, aov: 1250 },
    { label: "Mar", revenue: 380000, orders: 304, aov: 1250 },
    { label: "Apr", revenue: 350000, orders: 280, aov: 1250 },
    { label: "May", revenue: 410000, orders: 328, aov: 1250 },
    { label: "Jun", revenue: 482340, orders: 386, aov: 1248 },
  ],
};

/* ════════════════════════════════════════════
   Badge component
════════════════════════════════════════════ */
type BadgeType = "Delivered"|"Processing"|"Shipped"|"Cancelled"|"Returned"|"Attempted"|"Paid"|"Pending"|"Failed"|"Confirmed";
function Badge({ status }: { status: string }) {
  const MAP: Record<string, [string, string]> = {
    Delivered:  ["admin-badge-success", "✓"],
    Paid:       ["admin-badge-success", "✓"],
    Confirmed:  ["admin-badge-success", "✓"],
    Processing: ["admin-badge-warning", "⏳"],
    Pending:    ["admin-badge-warning", "⏳"],
    Shipped:    ["admin-badge-info",    "🚚"],
    Cancelled:  ["admin-badge-error",   "✕"],
    Failed:     ["admin-badge-error",   "✕"],
    Returned:   ["admin-badge-purple",  "↩"],
    Attempted:  ["admin-badge-orange",  "⚠"],
  };
  const [cls, icon] = MAP[status] ?? ["admin-badge-draft", "○"];
  return (
    <span className={`admin-badge ${cls}`} aria-label={`Status: ${status}`}>
      <span style={{ fontSize: "9px" }}>{icon}</span> {status}
    </span>
  );
}

/* ════════════════════════════════════════════
   Sparkline SVG
════════════════════════════════════════════ */
function Sparkline({ type, positive }: { type: "line" | "bar"; positive: boolean }) {
  const lineData = [30, 45, 38, 52, 48, 62, 58, 72, 68, 85];
  const barData  = [20, 35, 28, 42, 38, 55, 50, 68, 72, 80];
  const color    = positive ? "var(--admin-chart-1)" : "var(--admin-error)";
  const W = 80, H = 40;

  if (type === "line") {
    const pts = lineData.map((v, i) => {
      const x = (i / (lineData.length - 1)) * W;
      const y = H - (v / 100) * H;
      return `${x},${y}`;
    }).join(" ");
    const areaPoints = `0,${H} ` + pts + ` ${W},${H}`;
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        <defs>
          <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3"/>
            <stop offset="100%" stopColor={color} stopOpacity="0"/>
          </linearGradient>
        </defs>
        <polygon points={areaPoints} fill="url(#sg)"/>
        <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }

  const barW = W / barData.length - 2;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
      {barData.map((v, i) => {
        const bH = (v / 100) * H;
        const x = i * (barW + 2);
        return (
          <rect
            key={i}
            x={x} y={H - bH} width={barW} height={bH}
            fill={color}
            opacity={i === barData.length - 1 ? 1 : 0.4}
            rx="1"
          />
        );
      })}
    </svg>
  );
}

/* ════════════════════════════════════════════
   KPI Card
════════════════════════════════════════════ */
function KpiCard({ card }: { card: typeof KPI_CARDS[0] }) {
  return (
    <div
      className="admin-kpi-card"
      aria-label={`${card.label}: ${card.value}. ${card.delta} ${card.ctx}`}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "12px" }}>
        <div>
          <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--admin-text-muted)", marginBottom: "6px" }}>{card.label}</div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--admin-text)", lineHeight: 1, letterSpacing: "-0.5px" }}>{card.value}</div>
        </div>
        <span style={{ fontSize: "22px", opacity: 0.8 }}>{card.icon}</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <span style={{
            fontSize: "12px", fontWeight: 600,
            color: card.positive ? "var(--admin-success)" : "var(--admin-error)",
          }}>
            {card.positive ? "↑" : "↓"} {card.delta}
          </span>
          <span style={{ fontSize: "11px", color: "var(--admin-text-muted)", marginLeft: "4px" }}>{card.ctx}</span>
        </div>
        <Sparkline type={card.sparkType} positive={card.positive} />
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   Revenue Line Chart (Pure SVG)
════════════════════════════════════════════ */
function RevenueChart({ range }: { range: Range }) {
  const data = CHART_DATA[range];
  const [tooltip, setTooltip] = useState<{x: number; y: number; d: typeof data[0]} | null>(null);
  const W = 100, H = 220;
  const PAD = { l: 60, r: 20, t: 20, b: 30 };
  const CW = W - PAD.l - PAD.r;
  const CH = H - PAD.t - PAD.b;

  const maxRev = Math.max(...data.map(d => d.revenue));
  const minRev = Math.min(...data.map(d => d.revenue));
  const revRange = maxRev - minRev || 1;

  const maxOrd = Math.max(...data.map(d => d.orders));

  const toX = (i: number) => PAD.l + (i / (data.length - 1)) * CW;
  const toY = (v: number, mx: number, mn: number) => PAD.t + CH - ((v - mn) / (mx - mn || 1)) * CH;

  const revLine = data.map((d, i) => `${toX(i)},${toY(d.revenue, maxRev, minRev)}`).join(" ");
  const ordLine = data.map((d, i) => `${toX(i)},${toY(d.orders, maxOrd, 0)}`).join(" ");
  const aovLine = data.map((d, i) => `${toX(i)},${toY(d.aov, 1400, 1100)}`).join(" ");

  // Area fill for revenue
  const areaPoints = `${PAD.l},${PAD.t + CH} ` + revLine + ` ${PAD.l + CW},${PAD.t + CH}`;

  // Y axis labels
  const yTicks = [0, 25, 50, 75, 100].map(pct => {
    const v = minRev + (revRange * pct) / 100;
    const y = toY(v, maxRev, minRev);
    return { label: v >= 100000 ? `₹${(v / 100000).toFixed(0)}L` : `₹${(v / 1000).toFixed(0)}k`, y };
  });

  const fmt = (n: number) => n >= 100000 ? `₹${(n / 100000).toFixed(2)}L` : `₹${n.toLocaleString("en-IN")}`;

  return (
    <div style={{ position: "relative" }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", height: "220px" }}
        role="img"
        aria-label={`Revenue chart for ${range === "30d" ? "last 30 days" : range}. Peak: ${fmt(maxRev)}`}
        onMouseLeave={() => setTooltip(null)}
      >
        <defs>
          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00b566" stopOpacity="0.2"/>
            <stop offset="100%" stopColor="#00b566" stopOpacity="0"/>
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {yTicks.map((t, i) => (
          <g key={i}>
            <line x1={PAD.l} y1={t.y} x2={PAD.l + CW} y2={t.y}
              stroke="rgba(68,76,86,0.4)" strokeWidth="0.5" strokeDasharray="3 3"/>
            <text x={PAD.l - 4} y={t.y + 3.5} textAnchor="end"
              fontSize="5" fill="var(--admin-text-muted)" fontFamily="Outfit,sans-serif">
              {t.label}
            </text>
          </g>
        ))}

        {/* X axis labels */}
        {data.map((d, i) => (
          <text key={i} x={toX(i)} y={H - PAD.b + 12} textAnchor="middle"
            fontSize="4.5" fill="var(--admin-text-muted)" fontFamily="Outfit,sans-serif">
            {d.label}
          </text>
        ))}

        {/* Revenue area */}
        <polygon points={areaPoints} fill="url(#revGrad)"/>

        {/* Revenue line */}
        <polyline points={revLine} fill="none" stroke="var(--admin-chart-1)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>

        {/* Orders line */}
        <polyline points={ordLine} fill="none" stroke="var(--admin-chart-2)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 2"/>

        {/* AOV line */}
        <polyline points={aovLine} fill="none" stroke="var(--admin-chart-3)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 2"/>

        {/* Hover dots */}
        {data.map((d, i) => (
          <circle
            key={i}
            cx={toX(i)} cy={toY(d.revenue, maxRev, minRev)} r="2"
            fill="var(--admin-chart-1)" opacity="0"
            style={{ cursor: "pointer" }}
            onMouseEnter={e => {
              (e.target as SVGElement).setAttribute("opacity", "1");
              setTooltip({ x: toX(i), y: toY(d.revenue, maxRev, minRev), d });
            }}
            onMouseLeave={e => {
              (e.target as SVGElement).setAttribute("opacity", "0");
            }}
          />
        ))}
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div style={{
          position: "absolute",
          left: `calc(${(tooltip.x / 100) * 100}% - 70px)`,
          top: `${(tooltip.y / 220) * 100}%`,
          transform: "translateY(-100%) translateY(-8px)",
          background: "var(--admin-bg-overlay)",
          border: "1px solid var(--admin-border)",
          borderRadius: "var(--admin-radius-sm)",
          padding: "8px 12px",
          boxShadow: "var(--admin-shadow-md)",
          pointerEvents: "none",
          zIndex: 10,
          minWidth: "140px",
        }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--admin-text)", marginBottom: "4px" }}>{tooltip.d.label}</div>
          <div style={{ fontSize: "11px", color: "var(--admin-chart-1)" }}>Revenue: ₹{tooltip.d.revenue.toLocaleString("en-IN")}</div>
          <div style={{ fontSize: "11px", color: "var(--admin-chart-2)" }}>Orders: {tooltip.d.orders}</div>
          <div style={{ fontSize: "11px", color: "var(--admin-chart-3)" }}>AOV: ₹{tooltip.d.aov.toLocaleString("en-IN")}</div>
        </div>
      )}

      {/* Legend */}
      <div style={{ display: "flex", gap: "16px", marginTop: "12px", justifyContent: "center" }}>
        {[["var(--admin-chart-1)", "Revenue", "solid"], ["var(--admin-chart-2)", "Orders", "dashed"], ["var(--admin-chart-3)", "Avg Order Value", "dotted"]].map(([col, lbl, style]) => (
          <div key={lbl} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <span style={{
              display: "inline-block", width: "24px", height: "2px",
              background: col,
              borderTop: style === "dashed" ? "none" : "none",
              opacity: style === "solid" ? 1 : 0.8,
            }}/>
            <span style={{ fontSize: "11px", color: "var(--admin-text-muted)" }}>{lbl}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   Category Donut Chart (Pure SVG)
════════════════════════════════════════════ */
function DonutChart() {
  const [hovered, setHovered] = useState<number | null>(null);
  const R = 70, r = 44, CX = 80, CY = 80;
  const total = CATEGORIES.reduce((s, c) => s + c.pct, 0);

  const slices = useMemo(() => {
    let cumulative = 0;
    return CATEGORIES.map(cat => {
      const start = cumulative;
      cumulative += cat.pct;
      return { ...cat, start, end: cumulative };
    });
  }, []);

  function polarToCartesian(cx: number, cy: number, radius: number, angle: number) {
    const rad = ((angle - 90) * Math.PI) / 180;
    const x = cx + radius * Math.cos(rad);
    const y = cy + radius * Math.sin(rad);
    return { x: Number(x.toFixed(4)), y: Number(y.toFixed(4)) };
  }

  function describeArc(cx: number, cy: number, outerR: number, innerR: number, startPct: number, endPct: number, expand: boolean) {
    const offset = expand ? 3 : 0;
    const midAngle = ((startPct + endPct) / 2 / total) * 360 - 90;
    const dx = expand ? Math.cos((midAngle * Math.PI) / 180) * offset : 0;
    const dy = expand ? Math.sin((midAngle * Math.PI) / 180) * offset : 0;
    const startAngle = (startPct / total) * 360;
    const endAngle = (endPct / total) * 360;
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    const s1 = polarToCartesian(cx + dx, cy + dy, outerR, startAngle);
    const e1 = polarToCartesian(cx + dx, cy + dy, outerR, endAngle);
    const s2 = polarToCartesian(cx + dx, cy + dy, innerR, endAngle);
    const e2 = polarToCartesian(cx + dx, cy + dy, innerR, startAngle);
    return `M ${s1.x} ${s1.y} A ${outerR} ${outerR} 0 ${largeArc} 1 ${e1.x} ${e1.y} L ${s2.x} ${s2.y} A ${innerR} ${innerR} 0 ${largeArc} 0 ${e2.x} ${e2.y} Z`;
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
      <svg
        viewBox="0 0 160 160"
        style={{ width: "160px", height: "160px", flexShrink: 0 }}
        role="img"
        aria-label="Sales by category donut chart"
      >
        {slices.map((s, i) => (
          <path
            key={i}
            d={describeArc(CX, CY, R, r, s.start, s.end, hovered === i)}
            fill={s.color}
            opacity={hovered === null || hovered === i ? 1 : 0.5}
            style={{ transition: "all 150ms", cursor: "pointer" }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          />
        ))}
        {/* Centre text */}
        <text x={CX} y={CY - 7} textAnchor="middle" fontSize="10" fontWeight="700" fill="var(--admin-text)" fontFamily="Outfit,sans-serif">
          {hovered !== null ? `${CATEGORIES[hovered].pct}%` : "47%"}
        </text>
        <text x={CX} y={CY + 7} textAnchor="middle" fontSize="6" fill="var(--admin-text-muted)" fontFamily="Outfit,sans-serif">
          {hovered !== null ? CATEGORIES[hovered].name.split(" ")[0] : "Indoor"}
        </text>
      </svg>

      {/* Legend */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
        {CATEGORIES.map((c, i) => (
          <div
            key={i}
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              cursor: "pointer", opacity: hovered === null || hovered === i ? 1 : 0.5,
              transition: "opacity 150ms",
            }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: c.color, flexShrink: 0 }} />
            <span style={{ fontSize: "11px", color: "var(--admin-text-label)", flex: 1 }}>{c.name}</span>
            <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--admin-text)" }}>{c.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   Main Dashboard Page
════════════════════════════════════════════ */
export default function AdminDashboard() {
  const [range, setRange] = useState<Range>("30d");
  const [rangeOpen, setRangeOpen] = useState(false);

  const RANGES: { key: Range; label: string }[] = [
    { key: "today", label: "Today" },
    { key: "7d",    label: "Last 7 days" },
    { key: "30d",   label: "Last 30 days" },
    { key: "month", label: "By Month" },
  ];
  const rangeLabel = RANGES.find(r => r.key === range)?.label ?? "Last 30 days";

  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "1440px" }}>

      {/* ── Page Header ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 700, color: "var(--admin-text)", lineHeight: 1.2, margin: 0 }}>Dashboard</h1>
          <p style={{ fontSize: "12px", color: "var(--admin-text-muted)", marginTop: "4px" }}>{today}</p>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
          {/* Date range picker */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setRangeOpen(!rangeOpen)}
              style={{
                display: "flex", alignItems: "center", gap: "8px",
                height: "36px", padding: "0 14px",
                background: "var(--admin-bg-surface)",
                border: "1px solid var(--admin-border)",
                borderRadius: "var(--admin-radius-sm)",
                color: "var(--admin-text)", fontSize: "12px", cursor: "pointer",
                transition: "all var(--admin-motion-instant)",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--admin-border-active)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--admin-border)"; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              {rangeLabel}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </button>
            {rangeOpen && (
              <div style={{
                position: "absolute", top: "calc(100% + 4px)", left: 0,
                background: "var(--admin-bg-overlay)", border: "1px solid var(--admin-border)",
                borderRadius: "var(--admin-radius-md)", boxShadow: "var(--admin-shadow-md)",
                zIndex: 200, overflow: "hidden", minWidth: "160px",
                animation: "admin-fade-in var(--admin-motion-fast) ease-out",
              }}>
                {RANGES.map(r => (
                  <button
                    key={r.key}
                    onClick={() => { setRange(r.key); setRangeOpen(false); }}
                    style={{
                      display: "block", width: "100%", textAlign: "left",
                      padding: "9px 14px", background: range === r.key ? "var(--admin-accent-muted)" : "transparent",
                      border: "none", cursor: "pointer",
                      color: range === r.key ? "var(--admin-accent)" : "var(--admin-text-label)",
                      fontSize: "12px", transition: "background var(--admin-motion-instant)",
                    }}
                    onMouseEnter={e => { if (range !== r.key) (e.currentTarget as HTMLButtonElement).style.background = "var(--admin-bg-elevated)"; }}
                    onMouseLeave={e => { if (range !== r.key) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Export */}
          <button style={{
            display: "flex", alignItems: "center", gap: "6px",
            height: "36px", padding: "0 14px",
            background: "transparent", border: "1px solid var(--admin-border)",
            borderRadius: "var(--admin-radius-sm)",
            color: "var(--admin-text)", fontSize: "12px", cursor: "pointer",
            transition: "all var(--admin-motion-instant)",
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "var(--admin-bg-elevated)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export
          </button>
        </div>
      </div>

      {/* ── KPI Cards (8 cards, 4 per row) ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "14px" }}>
        {KPI_CARDS.map(card => <KpiCard key={card.id} card={card} />)}
      </div>

      {/* ── Revenue Chart ── */}
      <div style={{
        background: "var(--admin-bg-surface)",
        border: "1px solid var(--admin-border-muted)",
        borderRadius: "var(--admin-radius-md)",
        padding: "20px 24px",
        boxShadow: "var(--admin-shadow-xs)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <div>
            <h2 style={{ fontSize: "15px", fontWeight: 700, color: "var(--admin-text)", margin: 0 }}>Revenue Over Time</h2>
            <p style={{ fontSize: "11px", color: "var(--admin-text-muted)", marginTop: "2px" }}>Three series: Revenue · Orders · Avg Order Value</p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {RANGES.map(r => (
              <button
                key={r.key}
                onClick={() => setRange(r.key)}
                style={{
                  padding: "5px 10px", fontSize: "11px", fontWeight: 600,
                  borderRadius: "var(--admin-radius-xs)",
                  border: range === r.key ? "1px solid var(--admin-accent)" : "1px solid var(--admin-border)",
                  background: range === r.key ? "var(--admin-accent-muted)" : "transparent",
                  color: range === r.key ? "var(--admin-accent)" : "var(--admin-text-muted)",
                  cursor: "pointer", transition: "all var(--admin-motion-instant)",
                }}
              >{r.label}</button>
            ))}
          </div>
        </div>
        <RevenueChart range={range} />
      </div>

      {/* ── Recent Orders Table ── */}
      <div style={{
        background: "var(--admin-bg-surface)",
        border: "1px solid var(--admin-border-muted)",
        borderRadius: "var(--admin-radius-md)",
        boxShadow: "var(--admin-shadow-xs)",
        overflow: "hidden",
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 20px", borderBottom: "1px solid var(--admin-border-muted)",
        }}>
          <div>
            <h2 style={{ fontSize: "15px", fontWeight: 700, color: "var(--admin-text)", margin: 0 }}>Recent Orders</h2>
            <p style={{ fontSize: "11px", color: "var(--admin-text-muted)", marginTop: "2px" }}>Last 10 orders</p>
          </div>
          <Link
            href="/admin/orders"
            style={{
              fontSize: "12px", fontWeight: 600, color: "var(--admin-accent)",
              textDecoration: "none", display: "flex", alignItems: "center", gap: "4px",
              transition: "opacity var(--admin-motion-instant)",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.75"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; }}
          >
            View All →
          </Link>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px" }}
            aria-label="Recent orders table"
            role="grid"
          >
            <thead>
              <tr style={{ background: "var(--admin-bg-canvas)" }}>
                {["ORDER", "CUSTOMER", "DATE", "ITEMS", "TOTAL", "PAYMENT", "STATUS", "ACTIONS"].map(col => (
                  <th
                    key={col}
                    scope="col"
                    style={{
                      padding: "8px 16px", textAlign: "left",
                      fontSize: "11px", fontWeight: 700,
                      color: "var(--admin-text-muted)",
                      letterSpacing: "0.06em", textTransform: "uppercase",
                      borderBottom: "1px solid var(--admin-border)",
                      whiteSpace: "nowrap",
                    }}
                  >{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RECENT_ORDERS.map((order, i) => (
                <tr
                  key={order.id}
                  style={{
                    borderBottom: i < RECENT_ORDERS.length - 1 ? "1px solid var(--admin-border-muted)" : "none",
                    transition: "background var(--admin-motion-instant)",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.background = "var(--admin-bg-elevated)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = "transparent"; }}
                  role="row"
                >
                  <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                    <span className="admin-mono" style={{ color: "var(--admin-accent)", fontWeight: 500 }}>#{order.id}</span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--admin-text)" }}>{order.customer}</div>
                    <div style={{ fontSize: "11px", color: "var(--admin-text-muted)" }}>{order.email}</div>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "12px", color: "var(--admin-text-muted)", whiteSpace: "nowrap" }}>{order.date}</td>
                  <td style={{ padding: "12px 16px", fontSize: "12px", color: "var(--admin-text)" }}>{order.items} item{order.items !== 1 ? "s" : ""}</td>
                  <td style={{ padding: "12px 16px", fontSize: "12px", fontWeight: 600, color: "var(--admin-text)", whiteSpace: "nowrap" }}>{order.total}</td>
                  <td style={{ padding: "12px 16px" }}><Badge status={order.payment} /></td>
                  <td style={{ padding: "12px 16px" }}><Badge status={order.status} /></td>
                  <td style={{ padding: "12px 16px" }}>
                    <button style={{
                      padding: "4px 10px", fontSize: "11px", fontWeight: 600,
                      background: "transparent", border: "1px solid var(--admin-border)",
                      borderRadius: "var(--admin-radius-xs)",
                      color: "var(--admin-text-label)", cursor: "pointer",
                      transition: "all var(--admin-motion-instant)",
                    }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--admin-accent)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--admin-accent)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--admin-border)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--admin-text-label)"; }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 2-column: Low Stock + Category Donut + Garden Bookings ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>

        {/* Low Stock Alerts */}
        <div style={{
          background: "var(--admin-bg-surface)",
          border: "1px solid var(--admin-border-muted)",
          borderLeft: "4px solid var(--admin-warning)",
          borderRadius: "var(--admin-radius-md)",
          boxShadow: "var(--admin-shadow-xs)",
          overflow: "hidden",
        }}
          role="alert"
          aria-live="polite"
        >
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 18px", borderBottom: "1px solid var(--admin-border-muted)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "16px" }}>⚠️</span>
              <h2 style={{ fontSize: "14px", fontWeight: 700, color: "var(--admin-text)", margin: 0 }}>
                Low Stock Alerts <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--admin-warning)", marginLeft: "4px" }}>({LOW_STOCK.length})</span>
              </h2>
            </div>
            <Link href="/admin/inventory" style={{ fontSize: "11px", color: "var(--admin-accent)", textDecoration: "none", fontWeight: 600 }}>
              View Inventory →
            </Link>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse" }} aria-label="Low stock alerts">
            <thead>
              <tr style={{ background: "var(--admin-bg-canvas)" }}>
                {["PRODUCT", "SKU", "STOCK", "REORDER"].map(col => (
                  <th key={col} scope="col" style={{
                    padding: "7px 14px", fontSize: "10px", fontWeight: 700,
                    color: "var(--admin-text-muted)", textTransform: "uppercase",
                    letterSpacing: "0.06em", textAlign: "left",
                    borderBottom: "1px solid var(--admin-border)",
                  }}>{col}</th>
                ))}
                <th scope="col" style={{ padding: "7px 14px", borderBottom: "1px solid var(--admin-border)" }} />
              </tr>
            </thead>
            <tbody>
              {LOW_STOCK.map((item, i) => {
                const critical = item.stock === 0;
                const rowBg = critical ? "var(--admin-error-bg)" : "transparent";
                return (
                  <tr
                    key={i}
                    style={{
                      background: rowBg,
                      borderBottom: i < LOW_STOCK.length - 1 ? "1px solid var(--admin-border-muted)" : "none",
                      transition: "background var(--admin-motion-instant)",
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.background = "var(--admin-bg-elevated)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = rowBg; }}
                  >
                    <td style={{ padding: "10px 14px", fontSize: "12px", fontWeight: 600, color: "var(--admin-text)" }}>{item.product}</td>
                    <td style={{ padding: "10px 14px" }}>
                      <span className="admin-mono" style={{ color: "var(--admin-text-label)" }}>{item.sku}</span>
                    </td>
                    <td style={{ padding: "10px 14px", fontSize: "12px", fontWeight: 700, color: critical ? "var(--admin-error)" : "var(--admin-warning)" }}>
                      {critical ? "Out of Stock" : item.stock}
                    </td>
                    <td style={{ padding: "10px 14px", fontSize: "12px", color: "var(--admin-text-muted)" }}>{item.reorder}</td>
                    <td style={{ padding: "10px 14px" }}>
                      <button style={{
                        padding: "3px 8px", fontSize: "10px", fontWeight: 600,
                        background: "var(--admin-accent-muted)", border: "1px solid var(--admin-accent)",
                        borderRadius: "var(--admin-radius-xs)",
                        color: "var(--admin-accent)", cursor: "pointer",
                        transition: "all var(--admin-motion-instant)", whiteSpace: "nowrap",
                      }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "var(--admin-accent)"; (e.currentTarget as HTMLButtonElement).style.color = "white"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "var(--admin-accent-muted)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--admin-accent)"; }}
                      >
                        Reorder
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Right column: Donut + Garden Bookings */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

          {/* Category Donut */}
          <div style={{
            background: "var(--admin-bg-surface)",
            border: "1px solid var(--admin-border-muted)",
            borderRadius: "var(--admin-radius-md)",
            padding: "18px 20px",
            boxShadow: "var(--admin-shadow-xs)",
          }}>
            <h2 style={{ fontSize: "14px", fontWeight: 700, color: "var(--admin-text)", margin: "0 0 14px" }}>Sales by Category</h2>
            <DonutChart />
          </div>

          {/* Garden Bookings Today */}
          <div style={{
            background: "var(--admin-bg-surface)",
            border: "1px solid var(--admin-border-muted)",
            borderRadius: "var(--admin-radius-md)",
            overflow: "hidden",
            boxShadow: "var(--admin-shadow-xs)",
          }}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "14px 18px", borderBottom: "1px solid var(--admin-border-muted)",
            }}>
              <h2 style={{ fontSize: "14px", fontWeight: 700, color: "var(--admin-text)", margin: 0 }}>
                Garden Bookings Today
                <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--admin-text-muted)", marginLeft: "8px" }}>({GARDEN_BOOKINGS.length})</span>
              </h2>
              <Link href="/admin/garden-services" style={{ fontSize: "11px", color: "var(--admin-accent)", textDecoration: "none", fontWeight: 600 }}>
                View All →
              </Link>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse" }} aria-label="Today's garden service bookings">
              <thead>
                <tr style={{ background: "var(--admin-bg-canvas)" }}>
                  {["CUSTOMER", "SERVICE", "TIME", "STATUS"].map(col => (
                    <th key={col} scope="col" style={{
                      padding: "7px 14px", fontSize: "10px", fontWeight: 700,
                      color: "var(--admin-text-muted)", textTransform: "uppercase",
                      letterSpacing: "0.06em", textAlign: "left",
                      borderBottom: "1px solid var(--admin-border)",
                    }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {GARDEN_BOOKINGS.map((b, i) => (
                  <tr
                    key={i}
                    style={{
                      borderBottom: i < GARDEN_BOOKINGS.length - 1 ? "1px solid var(--admin-border-muted)" : "none",
                      transition: "background var(--admin-motion-instant)",
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.background = "var(--admin-bg-elevated)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = "transparent"; }}
                  >
                    <td style={{ padding: "10px 14px", fontSize: "12px", fontWeight: 600, color: "var(--admin-text)" }}>{b.customer}</td>
                    <td style={{ padding: "10px 14px", fontSize: "11px", color: "var(--admin-text-muted)", maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.service}</td>
                    <td style={{ padding: "10px 14px", fontSize: "12px", color: "var(--admin-text-label)", whiteSpace: "nowrap" }}>{b.time}</td>
                    <td style={{ padding: "10px 14px" }}><Badge status={b.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bottom spacer */}
      <div style={{ height: "24px" }} />
    </div>
  );
}
