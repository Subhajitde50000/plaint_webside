"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  useAdminOrders,
  useAdminOrder,
  useCancelOrder,
  useRefundOrder,
  useAddOrderNote,
  useDeleteOrderNote,
  useUpdateOrderTracking,
  useAdminAnalyticsOverview,
  useAssignCourier,
  useUpdateOrderStatus,
  useUpdateReturn,
  useAddOrderTag,
  useDeleteOrderTag
} from "@/features/admin/hooks/useAdminOrders";

/* ════════════════════════════════════════════
   DESIGN TOKENS
════════════════════════════════════════════ */
const T = {
  pageBg: "#0f1117",
  cardBg: "#1c2128",
  cardHover: "#22272e",
  inputBg: "#22272e",
  overlayBg: "#2d333b",
  text: "#cdd9e5",
  textMuted: "#768390",
  textLabel: "#adbac7",
  border: "#444c56",
  borderMuted: "rgba(68,76,86,0.5)",
  borderActive: "#00b566",
  accent: "#00b566",
  accentBg: "rgba(0,181,102,0.15)",
  delivered: "#57ab5a",
  deliveredBg: "rgba(87,171,90,0.12)",
  processing: "#c69026",
  processingBg: "rgba(198,144,38,0.12)",
  shipped: "#539bf5",
  shippedBg: "rgba(83,155,245,0.12)",
  cancelled: "#e5534b",
  cancelledBg: "rgba(229,83,75,0.12)",
  returned: "#986ee2",
  returnedBg: "rgba(152,110,226,0.12)",
  attempted: "#cc6b2c",
  attemptedBg: "rgba(204,107,44,0.12)",
};

/* ════════════════════════════════════════════
   GLOBAL CSS  (injected once at top)
   All hover / focus / active states live here
   so React never fights with inline styles.
════════════════════════════════════════════ */
const GLOBAL_CSS = `
  *, *::before, *::after { box-sizing: border-box; }
  :focus-visible { outline: 2px solid #00b566 !important; outline-offset: 2px; }
  input, select, textarea, button { font-family: inherit; }

  /* ── scrollbar ── */
  ::-webkit-scrollbar { width:6px; height:6px; }
  ::-webkit-scrollbar-track { background:#0f1117; }
  ::-webkit-scrollbar-thumb { background:#444c56; border-radius:3px; }
  ::-webkit-scrollbar-thumb:hover { background:#768390; }

  /* ── base button reset ── */
  .ao-btn {
    display:inline-flex; align-items:center; gap:6px;
    padding:7px 14px; border-radius:6px; font-size:12px; font-weight:600;
    cursor:pointer; transition:all 150ms ease; border:1px solid transparent;
    white-space:nowrap; user-select:none; text-decoration:none;
  }
  .ao-btn:disabled { opacity:0.4; cursor:not-allowed; pointer-events:none; }
  .ao-btn:active:not(:disabled) { transform:scale(0.97); }

  /* variants */
  .ao-btn-primary   { background:#00b566; color:#fff; border-color:#00b566; }
  .ao-btn-primary:hover:not(:disabled)   { background:#00a05c; border-color:#00a05c; }

  .ao-btn-secondary { background:transparent; color:#adbac7; border-color:#444c56; }
  .ao-btn-secondary:hover:not(:disabled) { background:#22272e; color:#cdd9e5; border-color:#768390; }

  .ao-btn-ghost     { background:transparent; color:#adbac7; border-color:transparent; }
  .ao-btn-ghost:hover:not(:disabled)     { background:#22272e; color:#cdd9e5; }

  .ao-btn-danger    { background:transparent; color:#e5534b; border-color:#e5534b; }
  .ao-btn-danger:hover:not(:disabled)    { background:rgba(229,83,75,0.12); }

  .ao-btn-sm { padding:4px 10px; font-size:11px; }
  .ao-btn-xs { padding:2px 8px;  font-size:11px; }
  .ao-btn-fw { width:100%; justify-content:center; }

  /* ── status tabs ── */
  .ao-tab {
    padding:8px 16px; border-radius:6px 6px 0 0; border:none; cursor:pointer;
    font-size:12px; font-weight:500; transition:all 150ms; background:transparent;
    color:#768390; border-bottom:2px solid transparent;
  }
  .ao-tab:hover { background:#22272e; color:#cdd9e5; }
  .ao-tab.active { background:#00b566; color:#fff; font-weight:700; border-bottom:2px solid #00b566; }

  /* ── table rows ── */
  .ao-row { transition:background 120ms; cursor:pointer; }
  .ao-row:hover td { background:#22272e; }
  .ao-row.selected td { background:rgba(0,181,102,0.1) !important; }
  .ao-row.selected { border-left:3px solid #00b566; }
  .ao-row:not(.selected) { border-left:3px solid transparent; }

  /* ── table header sort ── */
  .ao-th-sort { cursor:pointer; user-select:none; }
  .ao-th-sort:hover { color:#cdd9e5 !important; }

  /* ── KPI card ── */
  .ao-kpi { transition:background 150ms, box-shadow 150ms; cursor:default; }
  .ao-kpi.clickable { cursor:pointer; }
  .ao-kpi.clickable:hover { background:#22272e !important; box-shadow:0 0 0 1px #00b566; }

  /* ── overflow menu items ── */
  .ao-menu-item {
    display:flex; align-items:center; gap:8px; width:100%;
    padding:9px 14px; background:transparent; border:none;
    font-size:12px; cursor:pointer; text-align:left;
    transition:background 120ms;
  }
  .ao-menu-item:hover   { background:#22272e; }
  .ao-menu-item.danger  { color:#e5534b; }
  .ao-menu-item.danger:hover { background:rgba(229,83,75,0.12); }

  /* ── filter drawer checkbox rows ── */
  .ao-filter-row { display:flex; align-items:center; gap:8px; cursor:pointer; padding:3px 0; }
  .ao-filter-row:hover span { color:#cdd9e5; }

  /* ── search input ── */
  .ao-search:focus { border-color:#00b566 !important; box-shadow:0 0 0 3px rgba(0,181,102,0.2); }

  /* ── pagination button ── */
  .ao-page-btn {
    width:32px; height:32px; border-radius:4px; border:1px solid #444c56;
    background:transparent; color:#adbac7; cursor:pointer; font-size:12px;
    transition:all 120ms; display:flex; align-items:center; justify-content:center;
  }
  .ao-page-btn:hover:not(:disabled) { background:#22272e; color:#cdd9e5; }
  .ao-page-btn.active { background:#00b566; color:#fff; border-color:#00b566; font-weight:700; }
  .ao-page-btn:disabled { opacity:0.3; cursor:not-allowed; }

  /* ── modal tabs ── */
  .ao-modal-tab {
    padding:6px 14px; border-radius:6px; border:none; cursor:pointer;
    font-size:12px; font-weight:600; transition:all 150ms; background:transparent; color:#768390;
  }
  .ao-modal-tab:hover { background:#22272e; color:#cdd9e5; }
  .ao-modal-tab.active { background:rgba(0,181,102,0.15); color:#00b566; }

  /* ── note delete / edit inline ── */
  .ao-note-btn { background:none; border:none; cursor:pointer; font-size:11px; color:#768390; padding:2px 6px; border-radius:4px; }
  .ao-note-btn:hover { background:#22272e; color:#cdd9e5; }

  /* ── order detail layout ── */
  .ao-detail-body {
    flex: 1;
    min-height: 0;
    display: flex;
  }
  .ao-detail-left {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 20px;
  }
  .ao-detail-right {
    width: 320px;
    min-height: 0;
    flex-shrink: 0;
    border-left: 1px solid #444c56;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    /* ensure height is constrained by parent so overflow-y:auto actually kicks in */
    min-height: 0;
  }

  @media (max-width: 900px) {
    .ao-detail-right {
      width: 280px;
    }
  }

  @media (max-width: 768px) {
    .ao-detail-body {
      flex-direction: column !important;
      overflow-y: auto !important;
    }
    .ao-detail-left {
      overflow-y: visible !important;
      flex: none !important;
    }
    .ao-detail-right {
      width: 100% !important;
      border-left: none !important;
      border-top: 1px solid #444c56 !important;
      overflow-y: visible !important;
      flex: none !important;
    }
  }

  @media (prefers-reduced-motion:reduce) {
    *, *::before, *::after { animation-duration:0.01ms !important; transition-duration:0.01ms !important; }
  }
`;

/* ════════════════════════════════════════════
   TYPES
════════════════════════════════════════════ */
type PaymentStatus = "Paid" | "Pending" | "Failed" | "COD Pending" | "Refunded";
type FulfilmentStatus =
  | "Unfulfilled" | "Partially fulfilled" | "Shipped" | "Out for Delivery"
  | "Delivered" | "Cancelled" | "Return Requested" | "Return Received";

interface Order {
  id: string; uuid: string; customer: string; email: string; phone: string; avatar: string;
  items: number; total: string; totalNum: number;
  payment: PaymentStatus; fulfilment: FulfilmentStatus;
  courier: string; city: string; state: string;
  date: string; dateRaw: Date; tags: string[]; riskScore: number;
}

function mapPaymentStatus(status: string): PaymentStatus {
  switch (status) {
    case "paid": return "Paid";
    case "pending": return "Pending";
    case "failed": return "Failed";
    case "cod_pending": return "COD Pending";
    case "refunded": return "Refunded";
    case "partially_refunded": return "Refunded";
    default: return "Pending";
  }
}

function mapFulfilmentStatus(status: string, orderStatus?: string): FulfilmentStatus {
  const normalizedOrderStatus = (orderStatus || "").toLowerCase();

  if (["cancelled", "cancelled_by_customer", "cancelled_by_admin"].includes(normalizedOrderStatus)) return "Cancelled";
  if (["return_requested", "return_approved", "return_pickup_scheduled"].includes(normalizedOrderStatus)) return "Return Requested";
  if (["return_received", "return_inspection", "return_completed", "return_rejected"].includes(normalizedOrderStatus)) return "Return Received";
  if (normalizedOrderStatus === "out_for_delivery") return "Out for Delivery";
  if (["dispatched", "in_transit", "picked_up", "shipped"].includes(normalizedOrderStatus)) return "Shipped";
  if (["delivered", "completed"].includes(normalizedOrderStatus)) return "Delivered";

  switch (status) {
    case "unfulfilled": return "Unfulfilled";
    case "partially_fulfilled": return "Partially fulfilled";
    case "fulfilled": return "Delivered";
    case "returned": return "Return Received";
    default: return "Unfulfilled";
  }
}

function frontendStatusToDb(status: string): string | undefined {
  switch (status) {
    case "Unfulfilled": return "processing";
    case "Shipped": return "dispatched";
    case "Out for Delivery": return "out_for_delivery";
    case "Delivered": return "delivered";
    case "Cancelled": return "cancelled";
    case "Return Requested": return "return_requested";
    case "Return Received": return "return_received";
    default: return undefined;
  }
}

function frontendPaymentStatusToDb(status: string): string | undefined {
  switch (status) {
    case "Paid": return "paid";
    case "Pending": return "pending";
    case "Failed": return "failed";
    case "COD Pending": return "cod_pending";
    case "Refunded": return "refunded";
    default: return undefined;
  }
}



const PAYMENT_STYLE: Record<PaymentStatus, { bg:string; color:string }> = {
  "Paid":        { bg: T.deliveredBg,  color: T.delivered  },
  "Pending":     { bg: T.processingBg, color: T.processing },
  "Failed":      { bg: T.cancelledBg,  color: T.cancelled  },
  "COD Pending": { bg: T.attemptedBg,  color: T.attempted  },
  "Refunded":    { bg: T.returnedBg,   color: T.returned   },
};
const FULFILMENT_STYLE: Record<FulfilmentStatus, { bg:string; color:string }> = {
  "Unfulfilled":      { bg: T.processingBg, color: T.processing },
  "Partially fulfilled": { bg: T.attemptedBg, color: T.attempted },
  "Shipped":          { bg: T.shippedBg,    color: T.shipped    },
  "Out for Delivery": { bg: T.shippedBg,    color: T.shipped    },
  "Delivered":        { bg: T.deliveredBg,  color: T.delivered  },
  "Cancelled":        { bg: T.cancelledBg,  color: T.cancelled  },
  "Return Requested": { bg: T.returnedBg,   color: T.returned   },
  "Return Received":  { bg: T.returnedBg,   color: T.returned   },
};

type TabKey = "All"|"Pending"|"Processing"|"Shipped"|"Delivered"|"Cancelled"|"Returned";
const STATUS_TABS: { key:TabKey; label:string }[] = [
  { key:"All", label:"All" }, { key:"Pending", label:"Pending" }, { key:"Processing", label:"Processing" },
  { key:"Shipped", label:"Shipped" }, { key:"Delivered", label:"Delivered" },
  { key:"Cancelled", label:"Cancelled" }, { key:"Returned", label:"Returned" },
];

const WORKFLOW_STATUS_LABELS: Record<string, string> = {
  payment_pending: "PAYMENT_PENDING", payment_verified: "PAYMENT_VERIFIED", payment_confirmed: "PAYMENT_VERIFIED",
  payment_failed: "PAYMENT_FAILED", cod_eligibility_verified: "VERIFY_COD_ELIGIBILITY",
  cod_amount_collected: "COD_AMOUNT_COLLECTED",
  order_accepted: "ORDER_ACCEPTED", order_confirmed: "ORDER_ACCEPTED", inventory_reserved: "INVENTORY_RESERVED",
  picking: "PICKING", quality_check: "QUALITY_CHECK", packed: "PACKED",
  ready_for_dispatch: "READY_FOR_DISPATCH", courier_assigned: "COURIER_ASSIGNED",
  picked_up: "PICKED_UP", shipped: "SHIPPED", in_transit: "IN_TRANSIT",
  out_for_delivery: "OUT_FOR_DELIVERY", delivered: "DELIVERED", completed: "COMPLETED",
  cancelled_by_admin: "CANCELLED_BY_ADMIN", refund_pending: "REFUND_PENDING",
  refunded: "REFUNDED", return_requested: "RETURN_REQUESTED",
  return_approved: "RETURN_APPROVED", return_pickup_scheduled: "RETURN_PICKUP_SCHEDULED",
  return_received: "RETURN_RECEIVED", return_inspection: "RETURN_INSPECTION",
  return_rejected: "RETURN_REJECTED", return_completed: "RETURN_COMPLETED",
};

function recommendedWorkflowStatuses(currentStatus: string, paymentStatus: string, paymentGateway?: string | null): string[] {
  const paid = ["paid", "partially_paid"].includes(paymentStatus);
  const isCod = paymentGateway === "cod";
  const normal: Record<string, string[]> = {
    new_order: ["payment_pending"],
    order_placed: ["payment_pending"],
    payment_pending: isCod ? ["cod_eligibility_verified"] : [],
    cod_eligibility_verified: ["order_accepted"],
    payment_verified: ["order_accepted"],
    payment_confirmed: ["order_accepted"],
    order_accepted: ["inventory_reserved"],
    order_confirmed: ["inventory_reserved"],
    inventory_reserved: ["picking"],
    picking: ["quality_check"],
    quality_check: ["packed"],
    processing: ["packed"],
    packed: ["ready_for_dispatch"],
    ready_for_dispatch: ["courier_assigned"],
    courier_assigned: ["picked_up"],
    picked_up: ["shipped"],
    dispatched: ["in_transit"],
    shipped: ["in_transit"],
    in_transit: ["out_for_delivery"],
    out_for_delivery: isCod ? ["cod_amount_collected"] : ["delivered"],
    cod_amount_collected: ["delivered"],
    delivered: ["completed", "return_requested"],
    return_requested: ["return_approved", "return_rejected"],
    return_approved: ["return_pickup_scheduled"],
    return_pickup_scheduled: ["return_received"],
    return_received: ["return_inspection"],
    return_inspection: ["return_completed", "refund_pending", "return_rejected"],
    return_completed: ["refund_pending"],
    refund_pending: ["refunded"],
  };
  if (currentStatus === "cancelled_by_customer" || currentStatus === "cancelled_by_admin" || currentStatus === "cancelled") {
    return paid ? ["refund_pending"] : [];
  }
  return normal[currentStatus] ?? [];
}

/* ════════════════════════════════════════════
   SMALL REUSABLE COMPONENTS
════════════════════════════════════════════ */
function Badge({ bg, color, children }: { bg:string; color:string; children:React.ReactNode }) {
  return (
    <span style={{ background:bg, color, fontSize:"11px", fontWeight:700,
      borderRadius:"9999px", padding:"2px 8px", whiteSpace:"nowrap" }}>
      {children}
    </span>
  );
}

function Avatar({ initials, size=32 }: { initials:string; size?:number }) {
  return (
    <div style={{ width:size, height:size, borderRadius:"50%", background:T.accentBg,
      border:`1px solid ${T.borderActive}`, display:"flex", alignItems:"center",
      justifyContent:"center", fontSize:size<28?"10px":"12px", fontWeight:700,
      color:T.accent, flexShrink:0 }}>
      {initials}
    </div>
  );
}

/* Btn — uses CSS classes so hover always works */
function Btn({ variant="secondary", size, fullWidth, disabled, onClick, children, className="" }: {
  variant?: "primary"|"secondary"|"ghost"|"danger";
  size?: "sm"|"xs";
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  children: React.ReactNode;
  className?: string;
}) {
  const cls = [
    "ao-btn",
    `ao-btn-${variant}`,
    size ? `ao-btn-${size}` : "",
    fullWidth ? "ao-btn-fw" : "",
    className,
  ].filter(Boolean).join(" ");
  return (
    <button className={cls} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}

/* ════════════════════════════════════════════
   SPARKLINE
════════════════════════════════════════════ */
function Sparkline({ data, color }: { data:number[]; color:string }) {
  const w=64, h=28, max=Math.max(...data), min=Math.min(...data), range=max-min||1;
  const pts = data.map((v,i) => {
    const x = (i/(data.length-1))*w;
    const y = h - ((v-min)/range)*h*0.8 - h*0.1;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ flexShrink:0 }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
    </svg>
  );
}

/* ════════════════════════════════════════════
   KPI CARD
════════════════════════════════════════════ */
function KpiCard({ label, value, delta, deltaType, sparkData, accentColor, onClick }: {
  label:string; value:string; delta:string; deltaType:"up"|"down"|"neutral";
  sparkData:number[]; accentColor?:string; onClick?:()=>void;
}) {
  const deltaColor = deltaType==="up" ? T.delivered : deltaType==="down" ? T.cancelled : T.textMuted;
  const deltaIcon  = deltaType==="up" ? "↑" : deltaType==="down" ? "↓" : "→";
  return (
    <div
      className={`ao-kpi${onClick ? " clickable" : ""}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? e => { if (e.key==="Enter"||e.key===" ") onClick(); } : undefined}
      style={{ background:T.cardBg, border:`1px solid ${accentColor||T.borderMuted}`,
        borderRadius:"8px", padding:"20px", flex:"1 1 160px",
        display:"flex", flexDirection:"column", gap:"8px", minWidth:0 }}
    >
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:"8px" }}>
        <div style={{ minWidth:0 }}>
          <div style={{ fontSize:"12px", fontWeight:500, color:T.textMuted, marginBottom:"4px" }}>{label}</div>
          <div style={{ fontSize:"28px", fontWeight:800, color:accentColor||T.text, lineHeight:1 }}>{value}</div>
        </div>
        <Sparkline data={sparkData} color={accentColor||T.accent} />
      </div>
      <div style={{ fontSize:"11px", fontWeight:600, color:deltaColor }}>{deltaIcon} {delta}</div>
    </div>
  );
}

/* ════════════════════════════════════════════
   OVERFLOW MENU
════════════════════════════════════════════ */
function OverflowMenu({ orderId, triggerId, onAction }: { orderId:string; triggerId:string; onAction:(label:string)=>void }) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    const trigger = document.getElementById(triggerId);
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const menuHeight = 360; // approximate menu height
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUpward = spaceBelow < menuHeight && rect.top > menuHeight;
    
    setCoords({
      top: openUpward ? rect.top - menuHeight : rect.bottom + 4,
      left: rect.right - 200,
    });
  }, [triggerId]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onAction("");
      }
    };
    const handleScroll = () => {
      onAction("");
    };
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [onAction]);

  // Items list
  const ITEMS = [
    { label:"View Order",         icon:"👁" },
    { label:"Edit Order",         icon:"✏️" },
    { label:"Print Invoice",      icon:"🖨" },
    { label:"Print Packing Slip", icon:"📄" },
    { label:"Shipment Details",   icon:"🚚" },
    { label:"Add Tracking Number",icon:"📦" },
    { label:"Assign Courier",     icon:"🚚" },
    null,
    { label:"Cancel Order",       icon:"✕",  danger:true },
    { label:"Refund Order",       icon:"💰", danger:true },
    { label:"Flag as Suspicious", icon:"⚑",  danger:true },
    { label:"Add Tag",            icon:"🏷" },
  ];

  if (!coords) return null;

  return (
    <div ref={menuRef} role="menu" style={{ position:"fixed", left:`${coords.left}px`, top:`${coords.top}px`,
      background:T.overlayBg, border:`1px solid ${T.border}`,
      borderRadius:"8px", width:"200px", zIndex:9999, boxShadow:"0 8px 24px rgba(0,0,0,0.5)",
      overflow:"hidden" }}>
      {ITEMS.map((item, i) =>
        item === null
          ? <div key={i} style={{ height:"1px", background:T.border, margin:"4px 0" }} />
          : (
            <button key={item.label} role="menuitem"
              className={`ao-menu-item${item.danger ? " danger" : ""}`}
              style={{ color: item.danger ? T.cancelled : T.text }}
              onClick={() => onAction(item.label)}>
              <span style={{ fontSize:"13px" }}>{item.icon}</span> {item.label}
            </button>
          )
      )}
    </div>
  );
}

/* ════════════════════════════════════════════
   FILTER DRAWER
════════════════════════════════════════════ */
interface FilterState { orderStatus:string[]; paymentStatus:string[]; courier:string[]; tags:string[]; }
const EMPTY_FILTERS: FilterState = { orderStatus:[], paymentStatus:[], courier:[], tags:[] };

function FilterDrawer({ open, onClose, filters, setFilters }: {
  open:boolean; onClose:()=>void; filters:FilterState; setFilters:(f:FilterState)=>void;
}) {
  const SECTIONS = [
    { title:"Order Status",      key:"orderStatus"  as keyof FilterState, opts:["Unfulfilled","Shipped","Out for Delivery","Delivered","Cancelled","Return Requested"] },
    { title:"Payment Status",    key:"paymentStatus"as keyof FilterState, opts:["Paid","Pending","Failed","COD Pending","Refunded"] },
    { title:"Courier / Carrier", key:"courier"      as keyof FilterState, opts:["Shiprocket","Delhivery","Bluedart","DTDC","Self-ship"] },
    { title:"Tags",              key:"tags"         as keyof FilterState, opts:["VIP","First Order","COD","Gift"] },
  ];

  const toggle = (key: keyof FilterState, val:string) => {
    const arr = filters[key];
    setFilters({ ...filters, [key]: arr.includes(val) ? arr.filter(x=>x!==val) : [...arr, val] });
  };
  const totalActive = Object.values(filters).flat().length;

  useEffect(() => {
    if (!open) return;
    const h = (e:KeyboardEvent) => { if (e.key==="Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [open, onClose]);

  return (
    <>
      {open && <div onClick={onClose} style={{ position:"fixed", inset:0,
        background:"rgba(0,0,0,0.5)", zIndex:300 }} />}
      <div role="dialog" aria-label="Order filters" aria-modal="true" style={{
        position:"fixed", top:0, right:0, height:"100vh", width:"320px",
        background:T.cardBg, borderLeft:`1px solid ${T.border}`, zIndex:301,
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition:"transform 250ms ease",
        display:"flex", flexDirection:"column", overflow:"hidden" }}>
        {/* header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"16px 20px", borderBottom:`1px solid ${T.border}` }}>
          <div style={{ fontSize:"16px", fontWeight:600, color:T.text }}>
            Filters
            {totalActive > 0 && (
              <span style={{ fontSize:"11px", background:T.accentBg, color:T.accent,
                borderRadius:"9999px", padding:"2px 7px", marginLeft:"6px" }}>
                {totalActive}
              </span>
            )}
          </div>
          <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
            {totalActive > 0 && (
              <Btn variant="ghost" size="xs" onClick={() => setFilters(EMPTY_FILTERS)}
                className="" >
                <span style={{ color:T.cancelled }}>Clear All</span>
              </Btn>
            )}
            <Btn variant="ghost" size="xs" onClick={onClose}>✕</Btn>
          </div>
        </div>
        {/* body */}
        <div style={{ flex:1, overflowY:"auto", padding:"16px 20px",
          display:"flex", flexDirection:"column", gap:"20px" }}>
          {SECTIONS.map(sec => (
            <div key={sec.key}>
              <div style={{ fontSize:"11px", fontWeight:700, color:T.textLabel,
                textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:"10px" }}>
                {sec.title}
              </div>
              {sec.opts.map(opt => (
                <label key={opt} className="ao-filter-row">
                  <input type="checkbox" checked={filters[sec.key].includes(opt)}
                    onChange={() => toggle(sec.key, opt)}
                    style={{ accentColor:T.accent, width:"14px", height:"14px", cursor:"pointer" }} />
                  <span style={{ fontSize:"12px", color:T.text }}>{opt}</span>
                </label>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ════════════════════════════════════════════
   ORDER DETAIL PANEL (slide-in from right)
════════════════════════════════════════════ */
function OrderDetailPanel({
  orderSummary,
  onClose,
  onToast,
  initialTab = "timeline",
  initialCancelOpen = false,
  initialRefundOpen = false,
  initialAssignCourierOpen = false,
  initialAddTagOpen = false,
}: {
  orderSummary: Order;
  onClose: () => void;
  onToast: (msg: string) => void;
  initialTab?: "timeline" | "items" | "fulfil" | "notes";
  initialCancelOpen?: boolean;
  initialRefundOpen?: boolean;
  initialAssignCourierOpen?: boolean;
  initialAddTagOpen?: boolean;
}) {
  const { data: order, isLoading, isError } = useAdminOrder(orderSummary.uuid);
  const [tab, setTab] = useState<"timeline" | "items" | "fulfil" | "notes">(initialTab);
  const [noteText, setNoteText] = useState("");
  const [tracking, setTracking] = useState("");
  const [carrier, setCarrier]   = useState("Shiprocket");

  // refund state
  const [refundOpen, setRefundOpen] = useState(initialRefundOpen);
  const [refundAmount, setRefundAmount] = useState("");
  const [refundReason, setRefundReason] = useState("");

  // cancel state
  const [cancelOpen, setCancelOpen] = useState(initialCancelOpen);
  const [cancelReason, setCancelReason] = useState("");

  const [isAssigning, setIsAssigning] = useState(initialAssignCourierOpen);
  const [courierInput, setCourierInput] = useState("");
  const [isAddingTag, setIsAddingTag] = useState(initialAddTagOpen);
  const [tagInput, setTagInput] = useState("");
  const [nextStatus, setNextStatus] = useState("");
  const [returnNote, setReturnNote] = useState("");

  // Sync with initial props when they change
  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    setCancelOpen(initialCancelOpen);
  }, [initialCancelOpen]);

  useEffect(() => {
    setRefundOpen(initialRefundOpen);
  }, [initialRefundOpen]);

  useEffect(() => {
    setIsAssigning(initialAssignCourierOpen);
    if (initialAssignCourierOpen && order) {
      setCourierInput(order.shipping_carrier || "Shiprocket");
    }
  }, [initialAssignCourierOpen, order]);

  useEffect(() => {
    setIsAddingTag(initialAddTagOpen);
  }, [initialAddTagOpen]);

  const trackingMutation = useUpdateOrderTracking(orderSummary.uuid);
  const cancelMutation = useCancelOrder(orderSummary.uuid);
  const refundMutation = useRefundOrder(orderSummary.uuid);
  const addNoteMutation = useAddOrderNote(orderSummary.uuid);
  const deleteNoteMutation = useDeleteOrderNote(orderSummary.uuid);
  const assignCourierMutation = useAssignCourier(orderSummary.uuid);
  const statusMutation = useUpdateOrderStatus(orderSummary.uuid);
  const returnMutation = useUpdateReturn(orderSummary.uuid);
  const addTagMutation = useAddOrderTag(orderSummary.uuid);
  const deleteTagMutation = useDeleteOrderTag(orderSummary.uuid);

  useEffect(() => {
    const h = (e:KeyboardEvent) => { if (e.key==="Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  // Set default tracking details from order if already set
  useEffect(() => {
    if (order) {
      if (order.tracking_number) setTracking(order.tracking_number);
      if (order.shipping_carrier) setCarrier(order.shipping_carrier);
    }
  }, [order]);

  if (isLoading) {
    return (
      <>
        <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.55)", zIndex:400 }} />
        <div style={{
          position:"fixed", top:0, right:0, height:"100vh", width:"min(900px,95vw)",
          background:T.pageBg, borderLeft:`1px solid ${T.border}`, zIndex:401,
          display:"flex", alignItems:"center", justifyContent:"center", color:T.text
        }}>
          <div>Loading order details...</div>
        </div>
      </>
    );
  }

  if (isError || !order) {
    return (
      <>
        <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.55)", zIndex:400 }} />
        <div style={{
          position:"fixed", top:0, right:0, height:"100vh", width:"min(900px,95vw)",
          background:T.pageBg, borderLeft:`1px solid ${T.border}`, zIndex:401,
          display:"flex", alignItems:"center", justifyContent:"center", color:T.cancelled
        }}>
          <div>Error loading order details.</div>
        </div>
      </>
    );
  }

  const fSt = FULFILMENT_STYLE[mapFulfilmentStatus(order.fulfillment_status, order.status)];
  const pSt = PAYMENT_STYLE[mapPaymentStatus(order.payment_status)];
  const recommendedStatuses = recommendedWorkflowStatuses(order.status, order.payment_status, order.payment_gateway);
  const returnCase = Array.isArray(order.returns) ? order.returns[0] : null;
  let returnEvidence: string[] = [];
  try {
    returnEvidence = returnCase?.evidence_urls ? JSON.parse(returnCase.evidence_urls) : [];
  } catch {
    returnEvidence = [];
  }
  const returnAction = (action: string, requiresReason = false) => {
    if (requiresReason && !returnNote.trim()) {
      onToast("Enter a reason before rejecting this return.");
      return;
    }
    returnMutation.mutate(
      { action, adminNote: returnNote.trim() || undefined },
      {
        onSuccess: () => {
          setReturnNote("");
          onToast("Return case updated.");
        },
        onError: (err: any) => onToast(err.response?.data?.detail || "Could not update return case.")
      }
    );
  };

  const timeline: Array<{ stage: string; description?: string; time: string; loc: string; done: boolean; active: boolean }> = (order.status_history || []).map((h: any) => ({
    stage: h.status.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()),
    description: h.description || undefined,
    time: new Date(h.created_at).toLocaleString("en-IN", { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true }),
    loc: h.location || "System",
    done: true,
    active: false
  }));

  if (timeline.length === 0) {
    timeline.push({
      stage: "Order Placed",
      time: new Date(order.created_at).toLocaleString("en-IN", { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true }),
      loc: "System",
      done: true,
      active: true
    });
  }

  const addNote = () => {
    if (!noteText.trim()) return;
    addNoteMutation.mutate(
      { note: noteText.trim(), isInternal: true },
      {
        onSuccess: () => {
          setNoteText("");
          onToast("Note saved.");
        },
        onError: () => {
          onToast("Failed to save note.");
        }
      }
    );
  };

  const saveShipmentDetails = () => {
    if (!tracking.trim() || !carrier.trim()) {
      onToast("Enter both a carrier and tracking number.");
      return;
    }
    trackingMutation.mutate(
      { carrier, trackingNumber: tracking.trim() },
      {
        onSuccess: () => {
          onToast("Shipment details saved. Update the workflow separately when the order ships.");
        },
        onError: (err: any) => {
          onToast(`Failed to save shipment details: ${err.response?.data?.detail || err.message}`);
        }
      }
    );
  };

  const handleCancel = () => {
    if (!cancelReason.trim()) return;
    cancelMutation.mutate(cancelReason.trim(), {
      onSuccess: () => {
        onToast(`Order #${order.order_number} cancelled.`);
        setCancelOpen(false);
        onClose();
      },
      onError: (err: any) => {
        onToast(`Failed to cancel order: ${err.response?.data?.detail || err.message}`);
      }
    });
  };

  const handleRefund = () => {
    const amountNum = parseFloat(refundAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      onToast("Please enter a valid amount.");
      return;
    }
    refundMutation.mutate(
      {
        amount: amountNum,
        reason: refundReason.trim(),
        type: amountNum >= parseFloat(order.total) ? "full" : "partial"
      },
      {
        onSuccess: () => {
          onToast(`Refund of ₹${amountNum} initiated.`);
          setRefundOpen(false);
          onClose();
        },
        onError: (err: any) => {
          onToast(`Failed to initiate refund: ${err.response?.data?.detail || err.message}`);
        }
      }
    );
  };

  return (
    <>
      <div onClick={onClose} style={{ position:"fixed", inset:0,
        background:"rgba(0,0,0,0.55)", zIndex:400 }} />
      <div role="dialog" aria-modal="true" aria-label={`Order ${order.order_number}`} style={{
        position:"fixed", top:0, right:0, height:"100vh", width:"min(900px,95vw)",
        background:T.pageBg, borderLeft:`1px solid ${T.border}`,
        zIndex:401, display:"flex", flexDirection:"column", overflow:"hidden",
        boxShadow:"-8px 0 40px rgba(0,0,0,0.6)" }}>
        {/* ── header ── */}
        <div style={{ padding:"20px 24px", borderBottom:`1px solid ${T.border}`, background:T.cardBg }}>
          <div style={{ display:"flex", alignItems:"flex-start",
            justifyContent:"space-between", gap:"12px" }}>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"4px" }}>
                <h2 style={{ margin:0, fontFamily:"monospace", fontSize:"20px",
                  fontWeight:700, color:T.text }}>#{order.order_number}</h2>
                <Badge bg={fSt.bg} color={fSt.color}>{mapFulfilmentStatus(order.fulfillment_status, order.status)}</Badge>
              </div>
              <div style={{ fontSize:"12px", color:T.textMuted }}>
                Placed {new Date(order.created_at).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' })} ·{" "}
                <span style={{ color:T.accent }}>{orderSummary.customer}</span> · ₹{parseFloat(order.total).toLocaleString("en-IN")}
              </div>
            </div>
            <div style={{ display:"flex", gap:"8px", flexShrink:0 }}>
              <Btn variant="secondary" size="sm" onClick={() => onToast("Invoice sent to print.")}>🖨 Print</Btn>
              <Btn variant="ghost" size="sm" onClick={onClose}>✕ Close</Btn>
            </div>
          </div>
          {/* tab nav */}
          <div style={{ display:"flex", gap:"4px", marginTop:"14px" }}>
            {(["timeline","items","fulfil","notes"] as const).map(t => (
              <button key={t} className={`ao-modal-tab${tab===t?" active":""}`}
                onClick={() => setTab(t)}>
                {{ timeline:"📍 Timeline", items:"📦 Items",
                   fulfil:"🚚 Fulfilment", notes:"📝 Notes" }[t]}
              </button>
            ))}
          </div>
        </div>

        {/* ── body ── */}
        <div className="ao-detail-body">
          {/* left */}
          <div className="ao-detail-left">

            {/* TIMELINE */}
            {tab==="timeline" && (
              <div style={{ background:T.cardBg, border:`1px solid ${T.borderMuted}`,
                borderRadius:"8px", padding:"20px" }}>
                <div style={{ fontSize:"15px", fontWeight:600, color:T.text, marginBottom:"20px" }}>
                  Order Workflow
                </div>
                {returnCase && (
                  <div style={{ marginBottom:"18px", padding:"14px", borderRadius:"7px", border:`1px solid ${T.returned}55`, background:T.returnedBg }}>
                    <div style={{ display:"flex", justifyContent:"space-between", gap:"12px", alignItems:"center", marginBottom:"10px" }}>
                      <strong style={{ color:T.text }}>Return case</strong>
                      <Badge bg={T.returnedBg} color={T.returned}>{returnCase.status.replace(/_/g, " ")}</Badge>
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(2, minmax(0, 1fr))", gap:"8px", fontSize:"12px", color:T.text }}>
                      <div><span style={{ color:T.textMuted }}>Reason: </span>{returnCase.reason.replace(/_/g, " ")}</div>
                      <div><span style={{ color:T.textMuted }}>Resolution: </span>{returnCase.return_type}</div>
                    </div>
                    {returnCase.customer_note && <div style={{ marginTop:"9px", fontSize:"12px", color:T.text }}><span style={{ color:T.textMuted }}>Customer note: </span>{returnCase.customer_note}</div>}
                    {returnCase.admin_note && <div style={{ marginTop:"6px", fontSize:"12px", color:T.text }}><span style={{ color:T.textMuted }}>Admin note: </span>{returnCase.admin_note}</div>}
                    {returnCase.items?.length > 0 && <div style={{ marginTop:"9px", fontSize:"12px", color:T.textMuted }}>Items: {returnCase.items.map((item: any) => `${item.order_item?.title || `Item #${item.order_item_id}`} × ${item.quantity}`).join(", ")}</div>}
                    {returnEvidence.length > 0 && <div style={{ marginTop:"9px", display:"flex", gap:"8px", flexWrap:"wrap" }}>{returnEvidence.map((url, index) => <a key={url + index} href={url} target="_blank" rel="noreferrer" style={{ color:T.accent, fontSize:"12px" }}>View evidence {index + 1}</a>)}</div>}
                    {!["rejected", "refunded", "completed", "replacement_created"].includes(returnCase.status) && (
                      <>
                        <textarea value={returnNote} onChange={e => setReturnNote(e.target.value)} placeholder="Admin note (required when rejecting)" rows={2}
                          style={{ width:"100%", marginTop:"12px", padding:"8px", resize:"vertical", background:T.inputBg, color:T.text, border:`1px solid ${T.border}`, borderRadius:"5px", fontSize:"12px" }} />
                        <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", marginTop:"8px" }}>
                          {returnCase.status === "requested" && <><Btn size="sm" variant="primary" disabled={returnMutation.isPending} onClick={() => returnAction("approve")}>Approve</Btn><Btn size="sm" variant="danger" disabled={returnMutation.isPending} onClick={() => returnAction("reject", true)}>Reject</Btn></>}
                          {returnCase.status === "approved" && <Btn size="sm" variant="primary" disabled={returnMutation.isPending} onClick={() => returnAction("schedule_pickup")}>Schedule pickup</Btn>}
                          {returnCase.status === "pickup_scheduled" && <Btn size="sm" variant="primary" disabled={returnMutation.isPending} onClick={() => returnAction("picked_up")}>Mark picked up</Btn>}
                          {returnCase.status === "picked_up" && <Btn size="sm" variant="primary" disabled={returnMutation.isPending} onClick={() => returnAction("received")}>Mark received</Btn>}
                          {returnCase.status === "received" && <><Btn size="sm" variant="primary" disabled={returnMutation.isPending} onClick={() => returnAction("inspect_passed")}>QC passed</Btn><Btn size="sm" variant="danger" disabled={returnMutation.isPending} onClick={() => returnAction("inspect_failed", true)}>QC failed</Btn></>}
                          {returnCase.status === "inspection" && (returnCase.return_type === "refund" ? <Btn size="sm" variant="primary" disabled={returnMutation.isPending} onClick={() => returnAction("refund")}>Process refund</Btn> : <Btn size="sm" variant="primary" disabled={returnMutation.isPending} onClick={() => returnAction(returnCase.return_type)}>Create {returnCase.return_type}</Btn>)}
                        </div>
                      </>
                    )}
                  </div>
                )}
                <div style={{ display:"flex", gap:"8px", alignItems:"center", marginBottom:"18px", padding:"10px", background:T.inputBg, borderRadius:"6px" }}>
                  <select aria-label="Update order workflow status" value={nextStatus} onChange={e=>setNextStatus(e.target.value)}
                    style={{ flex:1, padding:"8px", background:T.cardBg, color:T.text, border:`1px solid ${T.border}`, borderRadius:"5px", fontSize:"12px" }}>
                    <option value="">Update workflow status…</option>
                    {recommendedStatuses.map(status => <option key={status} value={status}>{WORKFLOW_STATUS_LABELS[status]}</option>)}
                  </select>
                  <Btn size="sm" variant="primary" disabled={!nextStatus || statusMutation.isPending} onClick={() => {
                    if (nextStatus === "shipped" && (!order.shipping_carrier || !order.tracking_number)) {
                      onToast("Save carrier and tracking number in Shipment Details before marking this order as shipped.");
                      return;
                    }
                    statusMutation.mutate(
                      { status: nextStatus },
                      { onSuccess: () => { onToast(`Status updated to ${nextStatus.replace(/_/g, " ")}.`); setNextStatus(""); }, onError: (err: any) => onToast(err.response?.data?.detail || "Could not update order status.") }
                    );
                  }}>
                    {statusMutation.isPending ? "Updating…" : "Update"}
                  </Btn>
                </div>
                {/* event log */}
                <div role="list" aria-label="Fulfilment timeline"
                  style={{ display:"flex", flexDirection:"column", gap:"2px" }}>
                  {timeline.map((s,i) => (
                    <div key={i} role="listitem"
                      style={{ display:"flex", gap:"12px", padding:"10px 12px",
                        borderRadius:"6px", background:s.active ? T.accentBg : "transparent",
                        borderLeft:s.active ? `3px solid ${T.accent}` : "3px solid transparent" }}>
                      <time style={{ fontSize:"11px", color:T.textMuted,
                        width:"130px", flexShrink:0 }}>{s.time}</time>
                      <span style={{ fontSize:"12px", fontWeight:s.active?600:400,
                        color:T.text, flex:1 }}>
                        <div style={{ fontWeight: 600 }}>{s.stage}</div>
                        {s.description && (
                          <div style={{ fontSize:"11px", color:T.textMuted, marginTop:"3px" }}>
                            {s.description}
                          </div>
                        )}
                      </span>
                      <span style={{ fontSize:"11px", color:T.textMuted }}>{s.loc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ITEMS */}
            {tab==="items" && (
              <div style={{ background:T.cardBg, border:`1px solid ${T.borderMuted}`,
                borderRadius:"8px", overflow:"hidden" }}>
                <div style={{ padding:"14px 18px", borderBottom:`1px solid ${T.borderMuted}`,
                  display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:"15px", fontWeight:600, color:T.text }}>
                    Items in Order ({order.items?.length || 0})
                  </span>
                </div>
                <div role="list" aria-label="Order items">
                  {(order.items || []).map((item: any, i: number) => (
                    <div key={i} role="listitem"
                      style={{ display:"flex", gap:"14px", padding:"14px 18px",
                        borderBottom:`1px solid ${T.borderMuted}` }}>
                      <div style={{ width:"64px", height:"64px", borderRadius:"4px",
                        background:T.cardHover, border:`1px solid ${T.border}`,
                        display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:"24px", flexShrink:0 }}>
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.title} style={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:"4px" }} />
                        ) : (
                          "🌿"
                        )}
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:"13px", fontWeight:600, color:T.text }}>{item.title}</div>
                        <div style={{ fontFamily:"monospace", fontSize:"11px", color:T.textMuted }}>{item.sku}</div>
                        {item.variant_title && <div style={{ fontSize:"11px", color:T.textMuted }}>{item.variant_title}</div>}
                        <div style={{ fontSize:"11px", color:T.delivered, marginTop:"3px" }}>
                          ✓ Ready to fulfill
                        </div>
                      </div>
                      <div style={{ textAlign:"right", flexShrink:0 }}>
                        <div style={{ fontSize:"12px", fontWeight:700, color:T.text }}>
                          ₹{parseFloat(item.unit_price).toLocaleString("en-IN")} × {item.quantity}
                        </div>
                        <div style={{ fontSize:"11px", color:T.textMuted, marginTop:"2px" }}>
                          Total: ₹{parseFloat(item.total_price).toLocaleString("en-IN")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ padding:"14px 18px", display:"flex", flexDirection:"column", gap:"6px" }}>
                  {[
                    { l: "Subtotal", v: `₹${parseFloat(order.subtotal).toLocaleString("en-IN")}` },
                    { l: `Discount${order.discount_code ? ` (${order.discount_code})` : ""}`, v: `−₹${parseFloat(order.discount_amount).toLocaleString("en-IN")}`, c: T.delivered },
                    { l: "Shipping", v: `₹${parseFloat(order.shipping_amount).toLocaleString("en-IN")}` },
                    { l: "Tax", v: `₹${parseFloat(order.tax_amount).toLocaleString("en-IN")}` }
                  ].map(r => (
                    <div key={r.l} style={{ display:"flex", justifyContent:"space-between" }}>
                      <span style={{ fontSize:"12px", color:T.textMuted }}>{r.l}</span>
                      <span style={{ fontSize:"12px", fontWeight:600, color:r.c||T.text }}>{r.v}</span>
                    </div>
                  ))}
                  <div style={{ height:"1px", background:T.border, margin:"4px 0" }} />
                  <div style={{ display:"flex", justifyContent:"space-between" }}>
                    <span style={{ fontSize:"15px", fontWeight:700, color:T.text }}>Total</span>
                    <span style={{ fontSize:"15px", fontWeight:800, color:T.text }}>
                      ₹{parseFloat(order.total).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* FULFIL */}
            {tab==="fulfil" && (
              <div style={{ background:T.cardBg, border:`1px solid ${T.borderMuted}`,
                borderRadius:"8px", padding:"20px" }}>
                <div style={{ display:"flex", justifyContent:"space-between",
                  alignItems:"center", marginBottom:"18px" }}>
                  <span style={{ fontSize:"15px", fontWeight:600, color:T.text }}>Shipment Details</span>
                  <Badge bg={fSt.bg} color={fSt.color}>{mapFulfilmentStatus(order.fulfillment_status, order.status)}</Badge>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
                  <div>
                    <label style={{ display:"block", fontSize:"11px", fontWeight:700, color:T.textLabel,
                      textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:"6px" }}>
                      Tracking Number
                    </label>
                    <input value={tracking} onChange={e=>setTracking(e.target.value)}
                      placeholder="e.g. SR-8821-43XY"
                      style={{ width:"100%", padding:"9px 12px", background:T.inputBg,
                        border:`1px solid ${T.border}`, borderRadius:"6px", color:T.text,
                        fontSize:"12px", fontFamily:"monospace", outline:"none" }} />
                  </div>
                  <div>
                    <label style={{ display:"block", fontSize:"11px", fontWeight:700, color:T.textLabel,
                      textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:"6px" }}>
                      Carrier
                    </label>
                    <select value={carrier} onChange={e=>setCarrier(e.target.value)}
                      style={{ width:"100%", padding:"9px 12px", background:T.inputBg,
                        border:`1px solid ${T.border}`, borderRadius:"6px", color:T.text,
                        fontSize:"12px", outline:"none" }}>
                      {["Shiprocket","Delhivery","Bluedart","DTDC","Self-ship"].map(c=>(
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ display:"flex", gap:"10px", paddingTop:"4px" }}>
                    <Btn variant="primary" fullWidth disabled={trackingMutation.isPending} onClick={saveShipmentDetails}>
                      {trackingMutation.isPending ? "Saving..." : "Save Shipment Details"}
                    </Btn>
                  </div>
                </div>
              </div>
            )}

            {/* NOTES */}
            {tab==="notes" && (
              <div style={{ background:T.cardBg, border:`1px solid ${T.borderMuted}`,
                borderRadius:"8px", overflow:"hidden" }}>
                <div style={{ padding:"14px 18px", borderBottom:`1px solid ${T.borderMuted}`,
                  display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:"15px", fontWeight:600, color:T.text }}>Admin Notes</span>
                </div>
                <div role="log" aria-label="Admin notes"
                  style={{ padding:"16px 18px", display:"flex", flexDirection:"column", gap:"14px" }}>
                  {(order.notes_list || []).map((n: any) => {
                    const initials = n.admin ? `${n.admin.first_name[0]}${n.admin.last_name[0]}`.toUpperCase() : "AD";
                    const author = n.admin ? `${n.admin.first_name} ${n.admin.last_name}` : "Admin";
                    const time = new Date(n.created_at).toLocaleString("en-IN", { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true });
                    return (
                      <div key={n.id} style={{ display:"flex", gap:"10px" }}>
                        <Avatar initials={initials} size={28} />
                        <div style={{ flex:1 }}>
                          <div style={{ display:"flex", justifyContent:"space-between",
                            alignItems:"center", marginBottom:"4px" }}>
                            <span style={{ fontSize:"11px", color:T.textMuted }}>
                              {author} · {time}
                            </span>
                            <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
                              <span style={{ fontSize:"10px", background:T.accentBg, color:T.accent,
                                padding:"1px 6px", borderRadius:"9999px" }}>{n.is_internal ? "Internal" : "Public"}</span>
                              <button
                                onClick={() => deleteNoteMutation.mutate(String(n.id), {
                                  onSuccess: () => onToast("Note deleted.")
                                })}
                                disabled={deleteNoteMutation.isPending}
                                style={{ background:"none", border:"none", color:T.cancelled, cursor:"pointer", fontSize:"10px" }}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                          <p style={{ margin:0, fontSize:"12px", color:T.text, lineHeight:1.6 }}>
                            {n.note}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  {/* add note */}
                  <div style={{ borderTop:`1px solid ${T.borderMuted}`, paddingTop:"14px" }}>
                    <label style={{ display:"block", fontSize:"11px", fontWeight:700, color:T.textLabel,
                      textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:"6px" }}>
                      Add Note
                    </label>
                    <textarea value={noteText} onChange={e=>setNoteText(e.target.value)}
                      placeholder="Type a note..." rows={3}
                      style={{ width:"100%", padding:"9px 12px", background:T.inputBg,
                        border:`1px solid ${T.border}`, borderRadius:"6px", color:T.text,
                        fontSize:"12px", resize:"vertical", outline:"none", marginBottom:"10px" }} />
                    <Btn variant="secondary" disabled={!noteText.trim() || addNoteMutation.isPending} onClick={addNote}>
                      {addNoteMutation.isPending ? "Saving..." : "Save Note"}
                    </Btn>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* right sidebar */}
          <div className="ao-detail-right">

            {/* Order Summary */}
            <SideCard title="Order Summary">
              {[
                { l: "Subtotal", v: `₹${parseFloat(order.subtotal).toLocaleString("en-IN")}` },
                { l: `Discount${order.discount_code ? ` (${order.discount_code})` : ""}`, v: `−₹${parseFloat(order.discount_amount).toLocaleString("en-IN")}`, c: T.delivered },
                { l: "Shipping", v: `₹${parseFloat(order.shipping_amount).toLocaleString("en-IN")}` },
                { l: "Tax", v: `₹${parseFloat(order.tax_amount).toLocaleString("en-IN")}` }
              ].map(r=>(
                <div key={r.l} style={{ display:"flex", justifyContent:"space-between", fontSize:"11px" }}>
                  <span style={{ color:T.textMuted }}>{r.l}</span>
                  <span style={{ color:r.c||T.text, fontWeight:600 }}>{r.v}</span>
                </div>
              ))}
              <div style={{ height:"1px", background:T.border, margin:"6px 0" }} />
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <span style={{ fontSize:"13px", fontWeight:700, color:T.text }}>Total</span>
                <span style={{ fontSize:"13px", fontWeight:800, color:T.text }}>
                  ₹{parseFloat(order.total).toLocaleString("en-IN")}
                </span>
              </div>
              <div style={{ marginTop:"8px", padding:"7px", background: mapPaymentStatus(order.payment_status) === "Paid" ? T.deliveredBg : T.processingBg,
                borderRadius:"6px", fontSize:"11px", color: mapPaymentStatus(order.payment_status) === "Paid" ? T.delivered : T.processing }}>
                ✓ {mapPaymentStatus(order.payment_status)} · {new Date(order.created_at).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' })} {order.payment_gateway ? `· ${order.payment_gateway}` : ""}
              </div>
            </SideCard>

            {/* Customer */}
            <SideCard title="Customer">
              <div style={{ display:"flex", gap:"10px", marginBottom:"10px" }}>
                <Avatar initials={orderSummary.avatar} size={38} />
                <div>
                  <div style={{ fontSize:"13px", fontWeight:700, color:T.text }}>{orderSummary.customer}</div>
                  <div style={{ fontSize:"11px", color:T.textMuted }}>{orderSummary.email}</div>
                  <div style={{ fontSize:"11px", color:T.textMuted }}>📞 {orderSummary.phone}</div>
                </div>
              </div>
            </SideCard>

            {/* Delivery Address */}
            <SideCard title="Delivery Address">
              <div style={{ fontSize:"11px", color:T.text, lineHeight:1.8 }}>
                🏠 {order.shipping_address?.recipient_name || orderSummary.customer}<br/>
                {order.shipping_address?.line1}<br/>
                {order.shipping_address?.line2 && <>{order.shipping_address.line2}<br/></>}
                {order.shipping_address?.city} — {order.shipping_address?.pincode}<br/>
                {order.shipping_address?.state}, {order.shipping_address?.country || "India"}<br/>
                📞 {order.shipping_address?.phone || orderSummary.phone}
              </div>
              <div style={{ display:"flex", gap:"6px", marginTop:"8px" }}>
                <Btn variant="ghost" size="xs" onClick={()=>{
                  navigator.clipboard.writeText(
                    `${order.shipping_address?.recipient_name || orderSummary.customer}\n${order.shipping_address?.line1}\n${order.shipping_address?.line2 || ""}\n${order.shipping_address?.city} — ${order.shipping_address?.pincode}\n${order.shipping_address?.state}\nPhone: ${order.shipping_address?.phone || orderSummary.phone}`
                  );
                  onToast("Address copied!");
                }}>📋 Copy</Btn>
                <Btn variant="ghost" size="xs" onClick={()=>window.open(`https://maps.google.com/?q=${encodeURIComponent(order.shipping_address?.city + ", " + order.shipping_address?.state)}`,"_blank")}>↗ Maps</Btn>
              </div>
            </SideCard>

            {/* Payment */}
            <SideCard title="Payment">
              {[
                {l:"Amount",v:`₹${parseFloat(order.total).toLocaleString("en-IN")}`},
                {l:"Status",v:mapPaymentStatus(order.payment_status),c:pSt.color},
                {l:"Method",v:order.payment_gateway || "Razorpay"},
                {l:"Gateway",v:"Razorpay"},
                {l:"Date",v:new Date(order.created_at).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' })}
              ].map(r=>(
                <div key={r.l} style={{ display:"flex", justifyContent:"space-between", fontSize:"11px", marginBottom:"4px" }}>
                  <span style={{ color:T.textMuted }}>{r.l}</span>
                  <span style={{ color:r.c||T.text, fontWeight:600 }}>{r.v}</span>
                </div>
              ))}
              {order.payment_status === "paid" && (
                <div style={{ marginTop:"8px" }}>
                  <Btn variant="secondary" size="xs" fullWidth onClick={()=>setRefundOpen(true)}>
                    💰 Issue Refund
                  </Btn>
                </div>
              )}
            </SideCard>

            {/* Risk */}
            <SideCard title="Risk Assessment"
              action={<Badge bg={order.risk_score > 50 ? T.cancelledBg : T.deliveredBg} color={order.risk_score > 50 ? T.cancelled : T.delivered}>
                {order.risk_score > 50 ? "High Risk 🔴" : "Low Risk 🟢"}
              </Badge>}>
              {[
                {l:"Fraud score",v:`${order.risk_score || 0}/100`},
                {l:"IP location",v:`${orderSummary.city}, IN`},
                {l:"AVS match",v:"✓ Full"},
                {l:"3DS auth",v:"✓ Verified"}
              ].map(r=>(
                <div key={r.l} style={{ display:"flex", justifyContent:"space-between", fontSize:"11px", marginBottom:"4px" }}>
                  <span style={{ color:T.textMuted }}>{r.l}</span>
                  <span style={{ color:T.text }}>{r.v}</span>
                </div>
              ))}
            </SideCard>

            {/* Tags */}
            <SideCard title="Tags">
              <div style={{ display:"flex", flexWrap:"wrap", gap:"6px" }}>
                {(order.tags && order.tags.length > 0 ? order.tags : []).map((tag: string)=>(
                  <span key={tag} style={{ fontSize:"11px", background:T.cardHover,
                    border:`1px solid ${T.border}`, borderRadius:"9999px",
                    padding:"2px 10px", color:T.text, display:"flex", alignItems:"center", gap:"6px" }}>
                    {tag}
                    <button
                      onClick={() => {
                        deleteTagMutation.mutate(tag, {
                          onSuccess: () => onToast(`Tag "${tag}" removed.`),
                          onError: (err: any) => onToast(`Failed to delete tag: ${err.message}`)
                        });
                      }}
                      disabled={deleteTagMutation.isPending}
                      style={{ background:"none", border:"none", cursor:"pointer", color:T.cancelled, fontSize:"11px", padding:0, display:"flex", alignItems:"center", justifyContent:"center" }}
                      aria-label={`Remove tag ${tag}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
                {(order.tags || []).length === 0 && (
                  <span style={{ fontSize:"11px", color:T.textMuted }}>No tags added yet.</span>
                )}
              </div>
            </SideCard>

            {/* Manage Order Actions */}
            <SideCard title="Manage Order">
              <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
                {/* Quick workflow actions based on recommended next statuses */}
                {recommendedStatuses && recommendedStatuses.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {recommendedStatuses.map(rs => {
                      const label = WORKFLOW_STATUS_LABELS[rs] || rs.replace(/_/g, " ");
                      const isDanger = /cancel|refund|reject/.test(rs);
                      return (
                        <Btn key={rs}
                          variant={isDanger ? "danger" : "primary"}
                          size="xs"
                          fullWidth
                          onClick={() => {
                            if (rs === "shipped" && (!order.shipping_carrier || !order.tracking_number)) {
                              onToast("Save carrier and tracking number in Shipment Details before marking shipped.");
                              setTab("fulfil");
                              return;
                            }
                            statusMutation.mutate(
                              { status: rs },
                              { onSuccess: () => { onToast(`${label} applied.`); }, onError: (err: any) => onToast(err.response?.data?.detail || "Could not update status.") }
                            );
                          }}
                        >
                          {label}
                        </Btn>
                      );
                    })}
                  </div>
                )}

                {/* Edit Order */}
                <Btn variant="secondary" size="xs" fullWidth onClick={() => onToast("Edit Order — Opening editor…")}>
                  ✏️ Edit Order
                </Btn>

                {/* Print Invoice */}
                <Btn variant="secondary" size="xs" fullWidth onClick={() => onToast("Invoice sent to print.")}>
                  🖨 Print Invoice
                </Btn>

                {/* Print Packing Slip */}
                <Btn variant="secondary" size="xs" fullWidth onClick={() => onToast("Print Packing Slip — Sent to print.")}>
                  📄 Print Packing Slip
                </Btn>

                {/* Assign Courier */}
                {isAssigning ? (
                  <div style={{ display: "flex", gap: "6px", alignItems: "center", marginTop: "4px" }}>
                    <select
                      value={courierInput}
                      onChange={e => setCourierInput(e.target.value)}
                      style={{ flex: 1, padding: "6px 8px", background: T.inputBg, border: `1px solid ${T.border}`, borderRadius: "4px", color: T.text, fontSize: "11px", outline: "none" }}
                    >
                      <option value="">-- Select Courier --</option>
                      {["Shiprocket", "Delhivery", "Bluedart", "DTDC", "Self-ship"].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <Btn
                      variant="primary"
                      size="xs"
                      disabled={assignCourierMutation.isPending || !courierInput}
                      onClick={() => {
                        assignCourierMutation.mutate(courierInput, {
                          onSuccess: () => {
                            onToast(`Courier assigned: ${courierInput}`);
                            setIsAssigning(false);
                          },
                          onError: (err: any) => onToast(`Failed to assign: ${err.message}`)
                        });
                      }}
                    >
                      ✓
                    </Btn>
                    <Btn
                      variant="ghost"
                      size="xs"
                      onClick={() => setIsAssigning(false)}
                    >
                      ✕
                    </Btn>
                  </div>
                ) : (
                  <Btn
                    variant="secondary"
                    size="xs"
                    fullWidth
                    disabled={assignCourierMutation.isPending}
                    onClick={() => {
                      setCourierInput(order.shipping_carrier || "Shiprocket");
                      setIsAssigning(true);
                    }}
                  >
                    {assignCourierMutation.isPending ? "Assigning..." : "🚚 Assign Courier"}
                  </Btn>
                )}

                {/* Add Tag */}
                {isAddingTag ? (
                  <div style={{ display: "flex", gap: "6px", alignItems: "center", marginTop: "4px" }}>
                    <input
                      type="text"
                      placeholder="Enter tag..."
                      value={tagInput}
                      onChange={e => setTagInput(e.target.value)}
                      style={{ flex: 1, padding: "6px 8px", background: T.inputBg, border: `1px solid ${T.border}`, borderRadius: "4px", color: T.text, fontSize: "11px", outline: "none" }}
                    />
                    <Btn
                      variant="primary"
                      size="xs"
                      disabled={addTagMutation.isPending || !tagInput.trim()}
                      onClick={() => {
                        const trimmed = tagInput.trim();
                        addTagMutation.mutate(trimmed, {
                          onSuccess: () => {
                            onToast(`Tag "${trimmed}" added.`);
                            setTagInput("");
                            setIsAddingTag(false);
                          },
                          onError: (err: any) => onToast(`Failed to add tag: ${err.message}`)
                        });
                      }}
                    >
                      ✓
                    </Btn>
                    <Btn
                      variant="ghost"
                      size="xs"
                      onClick={() => setIsAddingTag(false)}
                    >
                      ✕
                    </Btn>
                  </div>
                ) : (
                  <Btn
                    variant="secondary"
                    size="xs"
                    fullWidth
                    disabled={addTagMutation.isPending}
                    onClick={() => {
                      setTagInput("");
                      setIsAddingTag(true);
                    }}
                  >
                    {addTagMutation.isPending ? "Adding tag..." : "🏷️ Add Tag"}
                  </Btn>
                )}

                {/* Flag as Suspicious */}
                <Btn variant="danger" size="xs" fullWidth onClick={() => onToast("Order flagged as suspicious ⚑")}>
                  ⚑ Flag as Suspicious
                </Btn>

                {/* Shipment details */}
                {order.fulfillment_status !== "fulfilled" && (
                  <Btn variant="primary" size="xs" fullWidth onClick={() => setTab("fulfil")}>
                    🚚 Shipment Details
                  </Btn>
                )}

                {/* Issue Refund */}
                {order.payment_status === "paid" && (
                  <Btn variant="secondary" size="xs" fullWidth onClick={() => setRefundOpen(true)}>
                    💰 Issue Refund
                  </Btn>
                )}

                {/* Cancel Order */}
                {!["cancelled", "cancelled_by_customer", "cancelled_by_admin", "delivered", "completed", "refunded"].includes(order.status) && (
                  <Btn variant="danger" size="xs" fullWidth onClick={() => setCancelOpen(true)}>
                    ✕ Cancel Order
                  </Btn>
                )}
              </div>
            </SideCard>
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {cancelOpen && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", zIndex:500, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ background:T.cardBg, border:`1px solid ${T.border}`, borderRadius:"8px", padding:"20px", width:"360px", display:"flex", flexDirection:"column", gap:"12px" }}>
            <div style={{ fontSize:"16px", fontWeight:700, color:T.text }}>Cancel Order</div>
            <p style={{ fontSize:"12px", color:T.textMuted, margin:0 }}>Please provide a reason for cancelling this order.</p>
            <select value={cancelReason} onChange={e => setCancelReason(e.target.value)}
              style={{ width:"100%", padding:"9px 12px", background:T.inputBg, border:`1px solid ${T.border}`, borderRadius:"6px", color:T.text, fontSize:"12px", outline:"none" }}>
              <option value="">Select cancellation reason…</option>
              {['Out of Stock', 'Damaged Product', 'Fraud', 'Delivery Unavailable', 'Other'].map(reason => <option key={reason} value={reason}>{reason}</option>)}
            </select>
            <textarea
              value={cancelReason}
              onChange={e => setCancelReason(e.target.value)}
              placeholder="Add details or enter another reason…"
              rows={3}
              style={{ width:"100%", padding:"9px 12px", background:T.inputBg, border:`1px solid ${T.border}`, borderRadius:"6px", color:T.text, fontSize:"12px", outline:"none", resize:"none" }}
            />
            <div style={{ display:"flex", gap:"8px", justifyContent:"flex-end" }}>
              <Btn variant="ghost" size="sm" onClick={() => setCancelOpen(false)}>Cancel</Btn>
              <Btn variant="danger" size="sm" disabled={!cancelReason.trim() || cancelMutation.isPending} onClick={handleCancel}>
                {cancelMutation.isPending ? "Cancelling..." : "Confirm Cancel"}
              </Btn>
            </div>
          </div>
        </div>
      )}

      {/* Refund Modal */}
      {refundOpen && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", zIndex:500, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ background:T.cardBg, border:`1px solid ${T.border}`, borderRadius:"8px", padding:"20px", width:"360px", display:"flex", flexDirection:"column", gap:"12px" }}>
            <div style={{ fontSize:"16px", fontWeight:700, color:T.text }}>Issue Refund</div>
            <div>
              <label style={{ display:"block", fontSize:"11px", fontWeight:700, color:T.textLabel, textTransform:"uppercase", marginBottom:"6px" }}>Refund Amount (Max ₹{parseFloat(order.total).toLocaleString("en-IN")})</label>
              <input
                type="number"
                value={refundAmount}
                onChange={e => setRefundAmount(e.target.value)}
                placeholder="e.g. 500"
                style={{ width:"100%", padding:"9px 12px", background:T.inputBg, border:`1px solid ${T.border}`, borderRadius:"6px", color:T.text, fontSize:"12px", outline:"none" }}
              />
            </div>
            <div>
              <label style={{ display:"block", fontSize:"11px", fontWeight:700, color:T.textLabel, textTransform:"uppercase", marginBottom:"6px" }}>Reason</label>
              <textarea
                value={refundReason}
                onChange={e => setRefundReason(e.target.value)}
                placeholder="e.g. Return received, damaged item..."
                rows={2}
                style={{ width:"100%", padding:"9px 12px", background:T.inputBg, border:`1px solid ${T.border}`, borderRadius:"6px", color:T.text, fontSize:"12px", outline:"none", resize:"none" }}
              />
            </div>
            <div style={{ display:"flex", gap:"8px", justifyContent:"flex-end" }}>
              <Btn variant="ghost" size="sm" onClick={() => setRefundOpen(false)}>Cancel</Btn>
              <Btn variant="primary" size="sm" disabled={!refundAmount.trim() || refundMutation.isPending} onClick={handleRefund}>
                {refundMutation.isPending ? "Refunding..." : "Confirm Refund"}
              </Btn>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* tiny helper card */
function SideCard({ title, action, children }: {
  title:string; action?:React.ReactNode; children:React.ReactNode
}) {
  return (
    <div style={{ background:T.cardBg, border:`1px solid ${T.borderMuted}`,
      borderRadius:"12px",
      boxShadow:"0 1px 0 rgba(255,255,255,0.03), 0 10px 24px rgba(0,0,0,0.16)",
      flexShrink: 0 }}>
      <div style={{ padding:"10px 14px", borderBottom:`1px solid ${T.borderMuted}`,
        display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <span style={{ fontSize:"13px", fontWeight:700, color:T.text }}>{title}</span>
        {action}
      </div>
      <div style={{ padding:"14px", display:"flex", flexDirection:"column", gap:"8px" }}>
        {children}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   TOAST
════════════════════════════════════════════ */
function Toast({ message, onDismiss }: { message:string; onDismiss:()=>void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 5000);
    return () => clearTimeout(t);
  }, [onDismiss]);
  return (
    <div role="status" aria-live="polite" style={{
      position:"fixed", top:"80px", right:"24px", zIndex:600,
      background:T.cardBg, border:`1px solid ${T.accent}`, borderRadius:"8px",
      padding:"12px 16px", display:"flex", alignItems:"center", gap:"12px",
      boxShadow:"0 8px 32px rgba(0,0,0,0.5)", fontSize:"12px", color:T.text,
      maxWidth:"360px", animation:"slideIn 200ms ease" }}>
      <span style={{ color:T.accent, fontSize:"16px" }}>✓</span>
      <span style={{ flex:1 }}>{message}</span>
      <button onClick={onDismiss} className="ao-btn ao-btn-ghost ao-btn-xs"
        style={{ padding:"2px 6px", fontSize:"16px", lineHeight:1 }}>×</button>
    </div>
  );
}

/* ════════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════════ */
export default function AdminOrdersPage() {
  const [activeTab, setActiveTab]     = useState<TabKey>("All");
  const [search, setSearch]           = useState("");
  const [sortKey, setSortKey]         = useState<"date"|"total"|"customer">("date");
  const [sortDir, setSortDir]         = useState<"asc"|"desc">("desc");
  const [selected, setSelected]       = useState<Set<string>>(new Set());
  const [openMenu, setOpenMenu]       = useState<string|null>(null);
  const [filterOpen, setFilterOpen]   = useState(false);
  const [filters, setFilters]         = useState<FilterState>(EMPTY_FILTERS);
  const [page, setPage]               = useState(1);
  const [perPage, setPerPage]         = useState(25);
  const [detailOrder, setDetailOrder] = useState<Order|null>(null);
  const [detailTab, setDetailTab] = useState<"timeline"|"items"|"fulfil"|"notes">("timeline");
  const [detailCancelOpen, setDetailCancelOpen] = useState(false);
  const [detailRefundOpen, setDetailRefundOpen] = useState(false);
  const [detailAssignCourierOpen, setDetailAssignCourierOpen] = useState(false);
  const [detailAddTagOpen, setDetailAddTagOpen] = useState(false);
  const [toasts, setToasts]           = useState<{id:number;msg:string}[]>([]);
  const [bulkMenuOpen, setBulkMenuOpen] = useState(false);

  const pushToast = (msg:string) =>
    setToasts(t => [...t, { id:Date.now(), msg }]);
  const dismissToast = (id:number) =>
    setToasts(t => t.filter(x => x.id!==id));

  // Map local states to API query parameters
  const apiFilters: any = {
    page,
    pageSize: perPage,
    sort: sortKey === "date" ? (sortDir === "desc" ? "newest" : "oldest") : (sortKey === "total" ? (sortDir === "desc" ? "total_high" : "total_low") : "newest"),
    q: search || undefined,
  };

  // Add tab filters
  if (activeTab === "Pending") {
    apiFilters.paymentStatus = "pending";
  } else if (activeTab === "Processing") {
    apiFilters.fulfillmentStatus = "unfulfilled";
  } else if (activeTab === "Shipped") {
    apiFilters.fulfillmentStatus = "fulfilled";
  } else if (activeTab === "Delivered") {
    apiFilters.status = "delivered";
  } else if (activeTab === "Cancelled") {
    apiFilters.status = "cancelled";
  } else if (activeTab === "Returned") {
    apiFilters.status = "return_received";
  }

  // Add drawer filters (override if set)
  if (filters.orderStatus.length > 0) {
    apiFilters.status = frontendStatusToDb(filters.orderStatus[0]);
  }
  if (filters.paymentStatus.length > 0) {
    apiFilters.paymentStatus = frontendPaymentStatusToDb(filters.paymentStatus[0]);
  }
  if (filters.tags.length > 0) {
    apiFilters.tag = filters.tags[0];
  }

  const { data, isLoading } = useAdminOrders(apiFilters);
  const { data: analyticsData } = useAdminAnalyticsOverview();

  // Orders Today calculation
  const oToday = analyticsData?.orders_today ?? 0;
  const oYest = analyticsData?.orders_yesterday ?? 0;
  const oDiff = oToday - oYest;
  const oDelta = oDiff >= 0 ? `+${oDiff} vs yesterday` : `${oDiff} vs yesterday`;
  const oDeltaType = oDiff >= 0 ? "up" : "down";

  // Revenue Today calculation
  const rToday = analyticsData?.revenue_today ?? 0;
  const rYest = analyticsData?.revenue_yesterday ?? 0;
  const rPct = rYest > 0 ? ((rToday - rYest) / rYest * 100) : 0;
  const rDelta = rPct >= 0 ? `+${rPct.toFixed(1)}%` : `${rPct.toFixed(1)}%`;
  const rDeltaType = rPct >= 0 ? "up" : "down";

  // Shipped Today calculation
  const sToday = analyticsData?.shipped_today ?? 0;
  const sYest = analyticsData?.shipped_yesterday ?? 0;
  const sDiff = sToday - sYest;
  const sDelta = sDiff >= 0 ? `+${sDiff} vs yesterday` : `${sDiff} vs yesterday`;
  const sDeltaType = sDiff >= 0 ? "up" : "down";

  // Cancelled Today calculation
  const cToday = analyticsData?.cancelled_today ?? 0;
  const cYest = analyticsData?.cancelled_yesterday ?? 0;
  const cDiff = cToday - cYest;
  const cDelta = cDiff >= 0 ? `+${cDiff} vs yesterday` : `${cDiff} vs yesterday`;
  const cDeltaType = cDiff >= 0 ? "up" : "down";

  // Average Order Value calculation
  const aovValue = analyticsData?.aov ?? 0;

  // Map API items to local Order format
  const ordersList: Order[] = (data?.items || []).map((o: any) => {
    const customerName = o.user ? `${o.user.first_name} ${o.user.last_name}` : (o.shipping_address?.recipient_name || "Guest Customer");
    const email = o.user?.email || o.guest_email || "—";
    const phone = o.user?.phone || o.guest_phone || o.shipping_address?.phone || "—";
    const initials = customerName.split(" ").map((n: string) => n[0]).join("").toUpperCase().substring(0, 2) || "GC";
    
    return {
      id: o.order_number,
      uuid: o.uuid,
      customer: customerName,
      email,
      phone,
      avatar: initials,
      items: o.items?.length || 0,
      total: `₹${parseFloat(o.total).toLocaleString("en-IN")}`,
      totalNum: parseFloat(o.total),
      payment: mapPaymentStatus(o.payment_status),
      fulfilment: mapFulfilmentStatus(o.fulfillment_status, o.status),
      courier: o.shipping_carrier || "—",
      city: o.shipping_address?.city || "—",
      state: o.shipping_address?.state || "—",
      date: new Date(o.created_at).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' }),
      dateRaw: new Date(o.created_at),
      tags: o.tags || [],
      riskScore: o.risk_score || 0,
    };
  });

  const totalPages = data ? Math.max(1, Math.ceil(data.total / perPage)) : 1;

  const tabCounts: Record<TabKey, string> = {
    All: data?.total !== undefined && activeTab === "All" ? String(data.total) : "—",
    Pending: data?.total !== undefined && activeTab === "Pending" ? String(data.total) : "—",
    Processing: data?.total !== undefined && activeTab === "Processing" ? String(data.total) : "—",
    Shipped: data?.total !== undefined && activeTab === "Shipped" ? String(data.total) : "—",
    Delivered: data?.total !== undefined && activeTab === "Delivered" ? String(data.total) : "—",
    Cancelled: data?.total !== undefined && activeTab === "Cancelled" ? String(data.total) : "—",
    Returned: data?.total !== undefined && activeTab === "Returned" ? String(data.total) : "—",
  };

  const allSel = ordersList.length > 0 && ordersList.every(o => selected.has(o.uuid));
  const someSel = ordersList.some(o => selected.has(o.uuid));

  const toggleSelectAll = () => {
    const next = new Set(selected);
    if (allSel) ordersList.forEach(o => next.delete(o.uuid));
    else        ordersList.forEach(o => next.add(o.uuid));
    setSelected(next);
  };

  const toggleSelect = (uuid: string) => {
    const next = new Set(selected);
    next.has(uuid) ? next.delete(uuid) : next.add(uuid);
    setSelected(next);
  };

  const handleSort = (key: typeof sortKey) => {
    if (sortKey===key) setSortDir(d=>d==="asc"?"desc":"asc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const activeFilterCount = Object.values(filters).flat().length;
  const removeFilter = (key:keyof FilterState) => setFilters({...filters,[key]:[]});

  // Close overflow menu on outside click
  useEffect(() => {
    if (!openMenu) return;
    const h = () => setOpenMenu(null);
    document.addEventListener("click", h, { capture:true, once:true });
    return () => document.removeEventListener("click", h, { capture:true });
  }, [openMenu]);

  // KPI spark data
  const sparks = {
    orders:  [12,15,10,18,14,11,17,20,16,14,19,22,18,24],
    revenue: [12,15,9,18,14,11,17,20,16,14,19,21,18,24].map(v=>v*1000),
    avg:     [1100,1200,980,1300,1150,1050,1250,1350,1200,1100,1300,1400,1200,1248],
    pending: [2,3,1,4,2,3,5,3,4,2,3,4,3,4],
    shipped: [3,4,5,3,6,4,7,5,6,4,5,6,5,7],
    cancel:  [4,3,5,2,4,3,2,3,4,2,3,4,3,3],
    returns: [1,0,2,1,0,1,2,1,1,0,1,1,0,2],
    cod:     [2,3,2,4,3,2,3,4,3,2,3,4,3,3],
  };

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{ display:"flex", flexDirection:"column", minHeight:"100vh", background:T.pageBg }}>

        {/* ── Breadcrumb ── */}
        <nav aria-label="Breadcrumb"
          style={{ padding:"8px 24px", fontSize:"12px", color:T.textMuted,
            display:"flex", gap:"6px", alignItems:"center" }}>
          <Link href="/admin" style={{ color:T.textMuted, textDecoration:"none" }}>Admin</Link>
          <span>/</span>
          <span style={{ color:T.text }} aria-current="page">Orders</span>
        </nav>

        {/* ── Content ── */}
        <div style={{ padding:"0 24px 48px", display:"flex", flexDirection:"column", gap:"20px" }}>

          {/* ── Page Header ── */}
          <div style={{ display:"flex", alignItems:"flex-start",
            justifyContent:"space-between", gap:"16px", flexWrap:"wrap" }}>
            <div>
              <h1 style={{ margin:0, fontSize:"24px", fontWeight:700, color:T.text }}>Orders</h1>
              <p style={{ margin:"4px 0 0", fontSize:"12px", color:T.textMuted }}>
                {data ? data.total.toLocaleString() : "0"} total orders
              </p>
            </div>
            <div style={{ display:"flex", gap:"8px", alignItems:"center", flexWrap:"wrap" }}>
              <select style={{ padding:"7px 12px", background:T.inputBg, border:`1px solid ${T.border}`,
                borderRadius:"6px", color:T.text, fontSize:"12px", cursor:"pointer" }}>
                {["Last 30 days","Today","Yesterday","Last 7 days","This Month"].map(o=>(
                  <option key={o}>{o}</option>
                ))}
              </select>
              <Btn variant="secondary" onClick={()=>pushToast("CSV export started…")}>↓ Export</Btn>
              <Btn variant="primary" onClick={()=>pushToast("Opening create order form…")}>+ Create Order</Btn>
            </div>
          </div>

          {/* ── KPI Row ── */}
          <div role="region" aria-label="Order metrics"
            style={{ display:"flex", gap:"12px", flexWrap:"wrap" }}>
            <KpiCard label="Orders Today"       value={String(oToday)} delta={oDelta}  deltaType={oDeltaType}      sparkData={sparks.orders}  onClick={()=>{ setActiveTab("All");        pushToast("Filtered: Today's orders"); }} />
            <KpiCard label="Revenue Today"      value={`₹${rToday.toLocaleString("en-IN")}`} delta={rDelta}             deltaType={rDeltaType}      sparkData={sparks.revenue} />
            <KpiCard label="Avg Order Value"    value={`₹${aovValue.toLocaleString("en-IN")}`}    delta="for current period" deltaType="neutral" sparkData={sparks.avg}     />
            <KpiCard label="Pending Fulfilment" value={data?.total !== undefined && activeTab === "Processing" ? String(data.total) : "—"} delta="Action needed" deltaType="down" sparkData={sparks.pending} accentColor={T.processing} onClick={()=>{ setActiveTab("Processing"); pushToast("Filtered: Pending fulfilment"); }} />
            <KpiCard label="Shipped Today"      value={String(sToday)}        delta={sDelta}   deltaType={sDeltaType}      sparkData={sparks.shipped} onClick={()=>{ setActiveTab("Shipped");    pushToast("Filtered: Shipped orders"); }} />
            <KpiCard label="Cancelled Today"    value={String(cToday)}         delta={cDelta}   deltaType={cDeltaType}      sparkData={sparks.cancel}  accentColor={T.cancelled} onClick={()=>{ setActiveTab("Cancelled");  pushToast("Filtered: Cancelled orders"); }} />
            <KpiCard label="Return Requests"    value={data?.total !== undefined && activeTab === "Returned" ? String(data.total) : "—"} delta="1 new today" deltaType="down" sparkData={sparks.returns} accentColor={T.returned} onClick={()=>{ setActiveTab("Returned"); pushToast("Filtered: Return requests"); }} />
            <KpiCard label="COD Pending"        value={data?.total !== undefined && activeTab === "Pending" ? String(data.total) : "—"} delta="Needs collection" deltaType="neutral" sparkData={sparks.cod} accentColor={T.attempted} />
          </div>

          {/* ── Status Tabs ── */}
          <div role="tablist" aria-label="Filter orders by status"
            style={{ display:"flex", gap:"4px", flexWrap:"wrap",
              borderBottom:`1px solid ${T.border}` }}>
            {STATUS_TABS.map(tab => (
              <button key={tab.key} role="tab" aria-selected={activeTab===tab.key}
                className={`ao-tab${activeTab===tab.key?" active":""}`}
                onClick={() => { setActiveTab(tab.key); setPage(1); }}>
                {tab.label} {tabCounts[tab.key] !== "—" ? `(${tabCounts[tab.key]})` : ""}
              </button>
            ))}
          </div>

          {/* ── Bulk Bar ── */}
          {selected.size > 0 && (
            <div aria-live="polite" style={{ display:"flex", alignItems:"center", gap:"10px",
              padding:"10px 16px", background:T.accentBg,
              border:`1px solid ${T.accent}`, borderRadius:"6px", flexWrap:"wrap" }}>
              <span style={{ fontSize:"12px", fontWeight:600, color:T.text }}>
                ☑ {selected.size} selected
              </span>
              <div style={{ width:"1px", height:"16px", background:T.border }} />
              <div style={{ position:"relative" }}>
                <Btn variant="secondary" size="sm"
                  onClick={e=>{ e.stopPropagation(); setBulkMenuOpen(v=>!v); }}>
                  Update Status ▾
                </Btn>
                {bulkMenuOpen && (
                  <div style={{ position:"absolute", top:"100%", left:0, marginTop:"4px",
                    background:T.overlayBg, border:`1px solid ${T.border}`,
                    borderRadius:"8px", padding:"4px 0", zIndex:50, width:"160px",
                    boxShadow:"0 8px 24px rgba(0,0,0,0.4)" }}>
                    {["Shipped","Delivered","Cancelled","Processing"].map(s=>(
                      <button key={s} className="ao-menu-item" style={{ color:T.text }}
                        onClick={()=>{
                          setBulkMenuOpen(false);
                          pushToast(`${selected.size} orders updated to ${s}.`);
                          setSelected(new Set());
                        }}>
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <Btn variant="secondary" size="sm" onClick={()=>pushToast("Assign courier coming soon.")}>Assign Courier ▾</Btn>
              <Btn variant="secondary" size="sm" onClick={()=>pushToast("Printing invoices…")}>🖨 Print Invoices</Btn>
              <Btn variant="secondary" size="sm" onClick={()=>pushToast("Exporting selected orders…")}>↓ Export Selected</Btn>
              <Btn variant="ghost" size="sm" onClick={()=>setSelected(new Set())}>✕ Clear</Btn>
            </div>
          )}

          {/* ── Toolbar ── */}
          <div style={{ display:"flex", gap:"10px", flexWrap:"wrap", alignItems:"center" }}>
            <div style={{ position:"relative", flex:"1 1 280px" }}>
              <svg style={{ position:"absolute", left:"10px", top:"50%",
                transform:"translateY(-50%)", color:T.textMuted }}
                width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input className="ao-search" value={search}
                onChange={e=>{ setSearch(e.target.value); setPage(1); }}
                placeholder="Search orders, customers, SKUs…"
                aria-label="Search orders"
                style={{ width:"100%", padding:"8px 32px", background:T.inputBg,
                  border:`1px solid ${T.border}`, borderRadius:"6px", color:T.text,
                  fontSize:"12px", outline:"none", transition:"border-color 150ms, box-shadow 150ms" }} />
              {search && (
                <button onClick={()=>setSearch("")} aria-label="Clear search"
                  style={{ position:"absolute", right:"8px", top:"50%",
                    transform:"translateY(-50%)", background:"none", border:"none",
                    color:T.textMuted, cursor:"pointer", fontSize:"16px", lineHeight:1 }}>×</button>
              )}
            </div>
            <button onClick={()=>setFilterOpen(true)}
              aria-label={`Filter orders${activeFilterCount>0?` (${activeFilterCount} active)`:""}`}
              style={{ padding:"8px 14px", borderRadius:"6px", cursor:"pointer",
                border:`1px solid ${activeFilterCount>0 ? T.accent : T.border}`,
                background:activeFilterCount>0 ? T.accentBg : "transparent",
                color:activeFilterCount>0 ? T.accent : T.textLabel,
                fontSize:"12px", fontWeight:600, transition:"all 150ms",
                display:"flex", alignItems:"center", gap:"6px" }}>
              ⚙ Filter {activeFilterCount>0 && `(${activeFilterCount})`}
            </button>
            <select value={`${sortKey}-${sortDir}`}
              onChange={e=>{ const [k,d]=e.target.value.split("-"); setSortKey(k as typeof sortKey); setSortDir(d as "asc"|"desc"); }}
              style={{ padding:"8px 12px", background:T.inputBg, border:`1px solid ${T.border}`,
                borderRadius:"6px", color:T.text, fontSize:"12px", cursor:"pointer" }}>
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="total-desc">Highest Value</option>
              <option value="total-asc">Lowest Value</option>
              <option value="customer-asc">Customer A–Z</option>
            </select>
          </div>

          {/* ── Active filter chips ── */}
          {activeFilterCount > 0 && (
            <div role="group" aria-label="Active filters"
              style={{ display:"flex", gap:"8px", flexWrap:"wrap", alignItems:"center" }}>
              {(Object.keys(filters) as Array<keyof FilterState>).map(key =>
                filters[key].length>0 ? (
                  <span key={key} style={{ display:"flex", alignItems:"center", gap:"6px",
                    padding:"3px 10px", background:T.accentBg,
                    border:`1px solid ${T.accent}`, borderRadius:"9999px",
                    fontSize:"11px", fontWeight:600, color:T.text }}>
                    {{orderStatus:"Status",paymentStatus:"Payment",
                      courier:"Carrier",tags:"Tags"}[key]}:{" "}
                    {filters[key].join(", ")}
                    <button onClick={()=>removeFilter(key)} style={{ background:"none",
                      border:"none", color:T.textMuted, cursor:"pointer",
                      fontSize:"14px", lineHeight:1, padding:0 }}>×</button>
                  </span>
                ) : null
              )}
              <Btn variant="ghost" size="xs"
                onClick={()=>setFilters(EMPTY_FILTERS)}>
                <span style={{ color:T.cancelled }}>Clear All</span>
              </Btn>
            </div>
          )}

          {/* ── Orders Table ── */}
          <div style={{ background:T.cardBg, border:`1px solid ${T.borderMuted}`,
            borderRadius:"8px", overflow:"hidden" }}>
            <div style={{ overflowX:"auto" }}>
              <table role="grid" aria-label="Orders"
                style={{ width:"100%", borderCollapse:"collapse", fontSize:"12px" }}>
                <thead>
                  <tr style={{ background:T.pageBg, borderBottom:`1px solid ${T.border}` }}>
                    {/* checkbox */}
                    <th style={{ width:"40px", padding:"10px 14px", textAlign:"center" }}>
                      <input type="checkbox" aria-label="Select all orders"
                        checked={allSel}
                        ref={el=>{ if(el) el.indeterminate = someSel&&!allSel; }}
                        onChange={toggleSelectAll}
                        style={{ accentColor:T.accent, cursor:"pointer" }} />
                    </th>
                    {/* sortable headers */}
                    {[
                      { label:"ORDER",      key:"order" as const,    width:"155px", sortK:"date"     as const },
                      { label:"CUSTOMER",   key:"customer" as const, width:"190px", sortK:"customer" as const },
                      { label:"ITEMS",      key:null,                width:"60px",  sortK:null },
                      { label:"TOTAL",      key:"total" as const,    width:"90px",  sortK:"total"    as const },
                      { label:"PAYMENT",    key:null,                width:"115px", sortK:null },
                      { label:"FULFILMENT", key:null,                width:"130px", sortK:null },
                      { label:"COURIER",    key:null,                width:"110px", sortK:null },
                      { label:"CITY",       key:null,                width:"90px",  sortK:null },
                      { label:"DATE",       key:"date" as const,     width:"110px", sortK:"date"     as const },
                      { label:"ACTIONS",    key:null,                width:"130px", sortK:null },
                    ].map(col => (
                      <th key={col.label}
                        role="columnheader"
                        className={col.sortK ? "ao-th-sort" : ""}
                        aria-sort={col.sortK===sortKey ? (sortDir==="asc"?"ascending":"descending") : col.sortK ? "none" : undefined}
                        onClick={col.sortK ? ()=>handleSort(col.sortK!) : undefined}
                        style={{ padding:"10px 14px", textAlign:"left", fontSize:"10px",
                          fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em",
                          whiteSpace:"nowrap", width:col.width,
                          color: col.sortK===sortKey ? T.accent : T.textLabel }}>
                        {col.label}
                        {col.sortK===sortKey && (
                          <span style={{ marginLeft:"4px" }}>{sortDir==="asc"?"↑":"↓"}</span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {isLoading && (
                    <tr><td colSpan={11}>
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:"60px 20px", color:T.text }}>
                        Loading orders...
                      </div>
                    </td></tr>
                  )}
                  {!isLoading && ordersList.map(order => {
                    const isSel = selected.has(order.uuid);
                    const pSt = PAYMENT_STYLE[order.payment];
                    const fSt = FULFILMENT_STYLE[order.fulfilment];
                    return (
                      <tr key={order.uuid} role="row" aria-selected={isSel}
                        className={`ao-row${isSel?" selected":""}`}
                        onClick={()=>{
                          setDetailTab("timeline");
                          setDetailCancelOpen(false);
                          setDetailRefundOpen(false);
                          setDetailAssignCourierOpen(false);
                          setDetailAddTagOpen(false);
                          setDetailOrder(order);
                        }}>
                        {/* checkbox cell — stop propagation so row-click doesn't also open detail */}
                        <td style={{ padding:"12px 14px", textAlign:"center" }}
                          onClick={e=>e.stopPropagation()}>
                          <input type="checkbox" aria-label={`Select order ${order.id}`}
                            checked={isSel} onChange={()=>toggleSelect(order.uuid)}
                            style={{ accentColor:T.accent, cursor:"pointer" }} />
                        </td>
                        <td style={{ padding:"12px 14px", whiteSpace:"nowrap" }}>
                          <div style={{ fontFamily:"monospace", fontWeight:600, color:T.accent }}>
                            #{order.id}
                          </div>
                          <div style={{ fontSize:"11px", color:T.textMuted, marginTop:"2px" }}>
                            {order.date}
                          </div>
                        </td>
                        <td style={{ padding:"12px 14px", whiteSpace:"nowrap" }}>
                          <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                            <Avatar initials={order.avatar} size={26} />
                            <div>
                              <div style={{ fontWeight:500, color:T.text }}>{order.customer}</div>
                              <div style={{ fontSize:"11px", color:T.textMuted }}>{order.email}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding:"12px 14px", color:T.textMuted }}>{order.items} items</td>
                        <td style={{ padding:"12px 14px", fontWeight:700, color:T.text, whiteSpace:"nowrap" }}>
                          {order.total}
                        </td>
                        <td style={{ padding:"12px 14px" }}>
                          <Badge bg={pSt.bg} color={pSt.color}>{order.payment}</Badge>
                        </td>
                        <td style={{ padding:"12px 14px" }}>
                          <Badge bg={fSt.bg} color={fSt.color}>{order.fulfilment}</Badge>
                        </td>
                        <td style={{ padding:"12px 14px", color:T.textMuted, fontSize:"11px" }}>
                          {order.courier}
                        </td>
                        <td style={{ padding:"12px 14px", color:T.textMuted, fontSize:"11px" }}>
                          {order.city}, {order.state}
                        </td>
                        <td style={{ padding:"12px 14px", color:T.textMuted, fontSize:"11px", whiteSpace:"nowrap" }}>
                          {order.date}
                        </td>
                        {/* actions cell — stop propagation so clicking buttons doesn't open detail */}
                        <td style={{ padding:"12px 14px", whiteSpace:"nowrap" }}
                          onClick={e=>e.stopPropagation()}>
                          <div style={{ display:"flex", gap:"6px", alignItems:"center" }}>
                            <Btn variant="secondary" size="sm"
                              onClick={()=>{
                                setDetailTab("timeline");
                                setDetailCancelOpen(false);
                                setDetailRefundOpen(false);
                                setDetailAssignCourierOpen(false);
                                setDetailAddTagOpen(false);
                                setDetailOrder(order);
                              }}>
                              View
                            </Btn>
                            {order.fulfilment==="Unfulfilled" && (
                              <Btn variant="primary" size="sm"
                                onClick={()=>{
                                  setDetailTab("fulfil");
                                  setDetailCancelOpen(false);
                                  setDetailRefundOpen(false);
                                  setDetailAssignCourierOpen(false);
                                  setDetailAddTagOpen(false);
                                  setDetailOrder(order);
                                }}>
                                Fulfil
                              </Btn>
                            )}
                            <div style={{ position:"relative" }}>
                              <button aria-haspopup="menu"
                                id={`menu-btn-${order.uuid}`}
                                aria-expanded={openMenu===order.uuid}
                                className="ao-btn ao-btn-secondary ao-btn-sm"
                                style={{ padding:"4px 8px" }}
                                onClick={e=>{ e.stopPropagation(); setOpenMenu(openMenu===order.uuid?null:order.uuid); }}>
                                ⋮
                              </button>
                              {openMenu===order.uuid && (
                                <OverflowMenu orderId={order.uuid}
                                  triggerId={`menu-btn-${order.uuid}`}
                                  onAction={label=>{
                                    setOpenMenu(null);
                                    if (label==="View Order") {
                                      setDetailTab("timeline");
                                      setDetailCancelOpen(false);
                                      setDetailRefundOpen(false);
                                      setDetailAssignCourierOpen(false);
                                      setDetailAddTagOpen(false);
                                      setDetailOrder(order);
                                    } else if (label==="Shipment Details" || label==="Add Tracking Number") {
                                      setDetailTab("fulfil");
                                      setDetailCancelOpen(false);
                                      setDetailRefundOpen(false);
                                      setDetailAssignCourierOpen(false);
                                      setDetailAddTagOpen(false);
                                      setDetailOrder(order);
                                    } else if (label==="Cancel Order") {
                                      setDetailTab("timeline");
                                      setDetailCancelOpen(true);
                                      setDetailRefundOpen(false);
                                      setDetailAssignCourierOpen(false);
                                      setDetailAddTagOpen(false);
                                      setDetailOrder(order);
                                    } else if (label==="Refund Order") {
                                      setDetailTab("timeline");
                                      setDetailCancelOpen(false);
                                      setDetailRefundOpen(true);
                                      setDetailAssignCourierOpen(false);
                                      setDetailAddTagOpen(false);
                                      setDetailOrder(order);
                                    } else if (label==="Assign Courier") {
                                      setDetailTab("timeline");
                                      setDetailCancelOpen(false);
                                      setDetailRefundOpen(false);
                                      setDetailAssignCourierOpen(true);
                                      setDetailAddTagOpen(false);
                                      setDetailOrder(order);
                                    } else if (label==="Add Tag") {
                                      setDetailTab("timeline");
                                      setDetailCancelOpen(false);
                                      setDetailRefundOpen(false);
                                      setDetailAssignCourierOpen(false);
                                      setDetailAddTagOpen(true);
                                      setDetailOrder(order);
                                    } else {
                                      if (label==="Edit Order") {
                                        pushToast("Edit Order — Opening editor…");
                                      } else if (label==="Print Invoice") {
                                        pushToast("Invoice sent to print.");
                                      } else if (label==="Print Packing Slip") {
                                        pushToast("Print Packing Slip — Sent to print.");
                                      } else if (label==="Flag as Suspicious") {
                                        pushToast("Order flagged as suspicious ⚑");
                                      }
                                    }
                                  }} />
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {!isLoading && ordersList.length===0 && (
                    <tr><td colSpan={11}>
                      <div aria-live="polite" style={{ display:"flex", flexDirection:"column",
                        alignItems:"center", padding:"60px 20px", gap:"12px" }}>
                        <span style={{ fontSize:"48px", opacity:0.3 }}>📭</span>
                        <div style={{ fontSize:"16px", fontWeight:600, color:T.text }}>No orders found</div>
                        <div style={{ fontSize:"12px", color:T.textMuted }}>
                          Try adjusting your filters or search terms.
                        </div>
                        <div style={{ display:"flex", gap:"8px", marginTop:"4px" }}>
                          <Btn variant="secondary" onClick={()=>{
                            setSearch(""); setFilters(EMPTY_FILTERS); setActiveTab("All");
                          }}>Clear Filters</Btn>
                          <Btn variant="primary" onClick={()=>pushToast("Opening create order form…")}>
                            + Create Order
                          </Btn>
                        </div>
                      </div>
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* ── Pagination ── */}
            {data && data.total > 0 && (
              <div style={{ padding:"12px 16px", borderTop:`1px solid ${T.borderMuted}`,
                display:"flex", alignItems:"center", justifyContent:"space-between",
                flexWrap:"wrap", gap:"10px" }}>
                <span style={{ fontSize:"12px", color:T.textMuted }}>
                  Showing {(page-1)*perPage+1}–{Math.min(page*perPage,data.total)}{" "}
                  of {data.total.toLocaleString()}
                </span>
                <nav aria-label="Pagination" style={{ display:"flex", gap:"4px", alignItems:"center" }}>
                  <button className="ao-page-btn" disabled={page===1}
                    onClick={()=>setPage(p=>p-1)}>‹</button>
                  {Array.from({ length:Math.min(5,totalPages) }, (_,i) => {
                    const p = totalPages<=5 ? i+1
                      : page<=3 ? i+1
                      : page>=totalPages-2 ? totalPages-4+i
                      : page-2+i;
                    return (
                      <button key={p} className={`ao-page-btn${p===page?" active":""}`}
                        onClick={()=>setPage(p)} aria-current={p===page?"page":undefined}>
                        {p}
                      </button>
                    );
                  })}
                  {totalPages>5 && page<totalPages-2 && <span style={{ color:T.textMuted,fontSize:"12px" }}>…</span>}
                  <button className="ao-page-btn" disabled={page===totalPages}
                    onClick={()=>setPage(p=>p+1)}>›</button>
                </nav>
                <select value={perPage}
                  onChange={e=>{ setPerPage(Number(e.target.value)); setPage(1); }}
                  style={{ padding:"5px 10px", background:T.inputBg,
                    border:`1px solid ${T.border}`, borderRadius:"4px",
                    color:T.text, fontSize:"12px", cursor:"pointer" }}>
                  {[25,50,100,250].map(n=><option key={n} value={n}>{n} per page</option>)}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* ── Filter Drawer ── */}
        <FilterDrawer open={filterOpen} onClose={()=>setFilterOpen(false)}
          filters={filters} setFilters={setFilters} />

        {/* ── Order Detail Panel ── */}
        {detailOrder && (
          <OrderDetailPanel orderSummary={detailOrder}
            onClose={()=>setDetailOrder(null)}
            onToast={pushToast}
            initialTab={detailTab}
            initialCancelOpen={detailCancelOpen}
            initialRefundOpen={detailRefundOpen} />
        )}

        {/* ── Toast stack ── */}
        <div style={{ position:"fixed", top:"80px", right:"24px", zIndex:700,
          display:"flex", flexDirection:"column", gap:"8px" }}>
          {toasts.map(t => (
            <Toast key={t.id} message={t.msg} onDismiss={()=>dismissToast(t.id)} />
          ))}
        </div>
      </div>
    </>
  );
}
