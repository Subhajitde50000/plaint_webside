"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

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

  @media (prefers-reduced-motion:reduce) {
    *, *::before, *::after { animation-duration:0.01ms !important; transition-duration:0.01ms !important; }
  }
`;

/* ════════════════════════════════════════════
   TYPES
════════════════════════════════════════════ */
type PaymentStatus = "Paid" | "Pending" | "Failed" | "COD Pending" | "Refunded";
type FulfilmentStatus =
  | "Unfulfilled" | "Shipped" | "Out for Delivery"
  | "Delivered" | "Cancelled" | "Return Requested" | "Return Received";

interface Order {
  id: string; customer: string; email: string; phone: string; avatar: string;
  items: number; total: string; totalNum: number;
  payment: PaymentStatus; fulfilment: FulfilmentStatus;
  courier: string; city: string; state: string;
  date: string; dateRaw: Date; tags: string[]; riskScore: number;
}

/* ════════════════════════════════════════════
   MOCK DATA
════════════════════════════════════════════ */
const ORDERS: Order[] = [
  { id:"ORD-4831", customer:"Priya Kumar",   email:"priya@email.com",  phone:"+91 98765 43210", avatar:"PK", items:3, total:"₹1,248", totalNum:1248, payment:"Paid",        fulfilment:"Delivered",        courier:"Shiprocket", city:"Mumbai",    state:"MH", date:"15 Jun 2026", dateRaw:new Date(2026,5,15,10,24), tags:["VIP","Gift"],         riskScore:12 },
  { id:"ORD-4830", customer:"Rahul Mehta",   email:"rahul@email.com",  phone:"+91 99123 45678", avatar:"RM", items:2, total:"₹2,149", totalNum:2149, payment:"Paid",        fulfilment:"Shipped",          courier:"Delhivery",  city:"Delhi",     state:"DL", date:"15 Jun 2026", dateRaw:new Date(2026,5,15,9,10),  tags:["First Order"],        riskScore:8  },
  { id:"ORD-4829", customer:"Neha Khatri",   email:"neha@email.com",   phone:"+91 91234 56789", avatar:"NK", items:1, total:"₹599",   totalNum:599,  payment:"COD Pending", fulfilment:"Out for Delivery", courier:"Bluedart",   city:"Pune",      state:"MH", date:"14 Jun 2026", dateRaw:new Date(2026,5,14,14,30), tags:["COD"],                riskScore:35 },
  { id:"ORD-4828", customer:"Aditya Patel",  email:"aditya@email.com", phone:"+91 87654 32109", avatar:"AP", items:4, total:"₹3,799", totalNum:3799, payment:"Paid",        fulfilment:"Unfulfilled",      courier:"—",          city:"Bangalore", state:"KA", date:"14 Jun 2026", dateRaw:new Date(2026,5,14,11,5),  tags:[],                     riskScore:15 },
  { id:"ORD-4827", customer:"Sunita Rao",    email:"sunita@email.com", phone:"+91 76543 21098", avatar:"SR", items:1, total:"₹899",   totalNum:899,  payment:"Refunded",    fulfilment:"Return Requested", courier:"Shiprocket", city:"Hyderabad", state:"TS", date:"13 Jun 2026", dateRaw:new Date(2026,5,13,16,45), tags:["VIP"],                riskScore:20 },
  { id:"ORD-4826", customer:"Vikram Desai",  email:"vikram@email.com", phone:"+91 65432 10987", avatar:"VD", items:2, total:"₹1,450", totalNum:1450, payment:"Paid",        fulfilment:"Delivered",        courier:"DTDC",       city:"Ahmedabad", state:"GJ", date:"12 Jun 2026", dateRaw:new Date(2026,5,12,9,30),  tags:[],                     riskScore:5  },
  { id:"ORD-4825", customer:"Asha Tiwari",   email:"asha@email.com",   phone:"+91 54321 09876", avatar:"AT", items:5, total:"₹4,250", totalNum:4250, payment:"Pending",     fulfilment:"Unfulfilled",      courier:"—",          city:"Chennai",   state:"TN", date:"12 Jun 2026", dateRaw:new Date(2026,5,12,8,15),  tags:["VIP"],                riskScore:72 },
  { id:"ORD-4824", customer:"Kiran Bose",    email:"kiran@email.com",  phone:"+91 43210 98765", avatar:"KB", items:1, total:"₹349",   totalNum:349,  payment:"Paid",        fulfilment:"Delivered",        courier:"Self-ship",  city:"Kolkata",   state:"WB", date:"11 Jun 2026", dateRaw:new Date(2026,5,11,12,0),  tags:["First Order"],        riskScore:10 },
  { id:"ORD-4823", customer:"Meena Gupta",   email:"meena@email.com",  phone:"+91 32109 87654", avatar:"MG", items:2, total:"₹780",   totalNum:780,  payment:"Failed",      fulfilment:"Cancelled",        courier:"—",          city:"Jaipur",    state:"RJ", date:"11 Jun 2026", dateRaw:new Date(2026,5,11,10,20), tags:[],                     riskScore:60 },
  { id:"ORD-4822", customer:"Arjun Shah",    email:"arjun@email.com",  phone:"+91 21098 76543", avatar:"AS", items:3, total:"₹2,699", totalNum:2699, payment:"Paid",        fulfilment:"Shipped",          courier:"Delhivery",  city:"Surat",     state:"GJ", date:"10 Jun 2026", dateRaw:new Date(2026,5,10,15,45), tags:["Gift"],               riskScore:18 },
  { id:"ORD-4821", customer:"Divya Nair",    email:"divya@email.com",  phone:"+91 10987 65432", avatar:"DN", items:1, total:"₹1,099", totalNum:1099, payment:"Paid",        fulfilment:"Return Received",  courier:"Bluedart",   city:"Kochi",     state:"KL", date:"09 Jun 2026", dateRaw:new Date(2026,5,9,14,0),   tags:["VIP"],                riskScore:25 },
  { id:"ORD-4820", customer:"Rohit Kumar",   email:"rohit@email.com",  phone:"+91 98001 23456", avatar:"RK", items:6, total:"₹5,499", totalNum:5499, payment:"Paid",        fulfilment:"Delivered",        courier:"Shiprocket", city:"Lucknow",   state:"UP", date:"08 Jun 2026", dateRaw:new Date(2026,5,8,11,30),  tags:["VIP","First Order"],  riskScore:9  },
  { id:"ORD-4819", customer:"Fatima Sheikh", email:"fatima@email.com", phone:"+91 97002 34567", avatar:"FS", items:2, total:"₹1,299", totalNum:1299, payment:"COD Pending", fulfilment:"Out for Delivery", courier:"DTDC",       city:"Mumbai",    state:"MH", date:"08 Jun 2026", dateRaw:new Date(2026,5,8,9,0),    tags:["COD"],                riskScore:40 },
  { id:"ORD-4818", customer:"Suresh Kumar",  email:"suresh@email.com", phone:"+91 96003 45678", avatar:"SK", items:1, total:"₹449",   totalNum:449,  payment:"Paid",        fulfilment:"Delivered",        courier:"Shiprocket", city:"Nagpur",    state:"MH", date:"07 Jun 2026", dateRaw:new Date(2026,5,7,14,20),  tags:[],                     riskScore:7  },
  { id:"ORD-4817", customer:"Ananya Das",    email:"ananya@email.com", phone:"+91 95004 56789", avatar:"AD", items:3, total:"₹2,099", totalNum:2099, payment:"Paid",        fulfilment:"Delivered",        courier:"Delhivery",  city:"Bhopal",    state:"MP", date:"06 Jun 2026", dateRaw:new Date(2026,5,6,10,15),  tags:["Gift"],               riskScore:13 },
];

const PAYMENT_STYLE: Record<PaymentStatus, { bg:string; color:string }> = {
  "Paid":        { bg: T.deliveredBg,  color: T.delivered  },
  "Pending":     { bg: T.processingBg, color: T.processing },
  "Failed":      { bg: T.cancelledBg,  color: T.cancelled  },
  "COD Pending": { bg: T.attemptedBg,  color: T.attempted  },
  "Refunded":    { bg: T.returnedBg,   color: T.returned   },
};
const FULFILMENT_STYLE: Record<FulfilmentStatus, { bg:string; color:string }> = {
  "Unfulfilled":      { bg: T.processingBg, color: T.processing },
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
function OverflowMenu({ orderId, onAction }: { orderId:string; onAction:(label:string)=>void }) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Items list
  const ITEMS = [
    { label:"View Order",         icon:"👁" },
    { label:"Edit Order",         icon:"✏️" },
    { label:"Print Invoice",      icon:"🖨" },
    { label:"Print Packing Slip", icon:"📄" },
    { label:"Mark as Fulfilled",  icon:"✅" },
    { label:"Add Tracking Number",icon:"📦" },
    { label:"Assign Courier",     icon:"🚚" },
    null,
    { label:"Cancel Order",       icon:"✕",  danger:true },
    { label:"Refund Order",       icon:"💰", danger:true },
    { label:"Flag as Suspicious", icon:"⚑",  danger:true },
    { label:"Add Tag",            icon:"🏷" },
  ];

  return (
    <div ref={menuRef} role="menu" style={{ position:"absolute", right:0, top:"100%",
      marginTop:"4px", background:T.overlayBg, border:`1px solid ${T.border}`,
      borderRadius:"8px", width:"200px", zIndex:200, boxShadow:"0 8px 24px rgba(0,0,0,0.5)",
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
function OrderDetailPanel({ order, onClose, onToast }: {
  order:Order; onClose:()=>void; onToast:(msg:string)=>void;
}) {
  const [tab, setTab] = useState<"timeline"|"items"|"fulfil"|"notes">("timeline");
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState([
    { id:1, initials:"RK", author:"Ravi K.",   time:"15 Jun, 11:05 AM", text:"Customer requested gift wrapping. See packing note." },
    { id:2, initials:"SK", author:"Suresh K.", time:"15 Jun, 10:30 AM", text:"Payment confirmed via Razorpay ref: RZP-28291." },
  ]);
  const [tracking, setTracking] = useState("");
  const [carrier, setCarrier]   = useState("Shiprocket");
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifySms, setNotifySms]     = useState(true);

  const fSt = FULFILMENT_STYLE[order.fulfilment];
  const pSt = PAYMENT_STYLE[order.payment];

  const timeline = [
    { stage:"Order Placed",    time:"15 Jun, 10:24 AM", loc:"Mumbai",          done:true,  active:false },
    { stage:"Being Packed",    time:"15 Jun, 02:48 PM", loc:"Pune FC",          done:true,  active:false },
    { stage:"Dispatched",      time:"16 Jun, 09:00 AM", loc:"Shiprocket",       done:true,  active:false },
    { stage:"Out for Delivery",time:"17 Jun, 08:45 AM", loc:"Mumbai – Andheri", done:false, active:true  },
    { stage:"Delivered",       time:"—",                loc:"—",                done:false, active:false },
  ];

  useEffect(() => {
    const h = (e:KeyboardEvent) => { if (e.key==="Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  const addNote = () => {
    if (!noteText.trim()) return;
    setNotes([{ id:Date.now(), initials:"YO", author:"You", time:"Just now", text:noteText.trim() }, ...notes]);
    setNoteText("");
    onToast("Note saved.");
  };

  const handleFulfil = () => {
    onToast(`Order #${order.id} marked as fulfilled.`);
    onClose();
  };

  return (
    <>
      <div onClick={onClose} style={{ position:"fixed", inset:0,
        background:"rgba(0,0,0,0.55)", zIndex:400 }} />
      <div role="dialog" aria-modal="true" aria-label={`Order ${order.id}`} style={{
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
                  fontWeight:700, color:T.text }}>#{order.id}</h2>
                <Badge bg={fSt.bg} color={fSt.color}>{order.fulfilment}</Badge>
              </div>
              <div style={{ fontSize:"12px", color:T.textMuted }}>
                Placed {order.date} ·{" "}
                <span style={{ color:T.accent }}>{order.customer}</span> · {order.total}
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
        <div style={{ flex:1, overflow:"hidden", display:"flex" }}>
          {/* left */}
          <div style={{ flex:1, overflowY:"auto", padding:"20px" }}>

            {/* TIMELINE */}
            {tab==="timeline" && (
              <div style={{ background:T.cardBg, border:`1px solid ${T.borderMuted}`,
                borderRadius:"8px", padding:"20px" }}>
                <div style={{ fontSize:"15px", fontWeight:600, color:T.text, marginBottom:"20px" }}>
                  Fulfilment Timeline
                </div>
                {/* progress bar */}
                <div style={{ position:"relative", marginBottom:"20px", padding:"0 8px" }}>
                  <div style={{ height:"6px", background:T.border, borderRadius:"9999px" }}>
                    <div style={{ height:"100%", width:"65%", background:T.accent,
                      borderRadius:"9999px", transition:"width 500ms ease" }} />
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between",
                    position:"absolute", top:"-8px", left:"8px", right:"8px" }}>
                    {timeline.map((s,i) => (
                      <div key={i} style={{
                        width: s.active?"20px":s.done?"16px":"14px",
                        height:s.active?"20px":s.done?"16px":"14px",
                        borderRadius:"50%",
                        background:s.done||s.active ? T.accent : "transparent",
                        border:s.done||s.active ? "none" : `2px solid ${T.border}`,
                        display:"flex", alignItems:"center", justifyContent:"center",
                        boxShadow:s.active ? `0 0 0 5px ${T.accentBg}` : "none",
                        transition:"all 300ms",
                      }}>
                        {s.done && <span style={{ color:"#fff", fontSize:"8px" }}>✓</span>}
                      </div>
                    ))}
                  </div>
                </div>
                {/* stage labels */}
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"20px" }}>
                  {timeline.map((s,i) => (
                    <div key={i} style={{ fontSize:"10px", textAlign:"center", flex:1,
                      color:s.active ? T.accent : T.textMuted }}>
                      {s.stage}
                    </div>
                  ))}
                </div>
                {/* event log */}
                <div role="list" aria-label="Fulfilment timeline"
                  style={{ display:"flex", flexDirection:"column", gap:"2px" }}>
                  {timeline.filter(s=>s.done||s.active).map((s,i) => (
                    <div key={i} role="listitem" aria-current={s.active?"step":undefined}
                      style={{ display:"flex", gap:"12px", padding:"10px 12px",
                        borderRadius:"6px", background:s.active ? T.accentBg : "transparent",
                        borderLeft:s.active ? `3px solid ${T.accent}` : "3px solid transparent" }}>
                      <time style={{ fontSize:"11px", color:T.textMuted,
                        width:"130px", flexShrink:0 }}>{s.time}</time>
                      <span style={{ fontSize:"12px", fontWeight:s.active?600:400,
                        color:T.text, flex:1 }}>{s.stage}</span>
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
                    Items in Order ({order.items})
                  </span>
                  {order.fulfilment==="Unfulfilled" && (
                    <Btn variant="secondary" size="sm"
                      onClick={() => onToast("Add item feature coming soon.")}>
                      + Add Item
                    </Btn>
                  )}
                </div>
                <div role="list" aria-label="Order items">
                  {[
                    { name:"Monstera Deliciosa", sku:"SKU-MM-001", variant:"Medium · White Minimalist Pot", price:"₹399", qty:1, stockOk:true,  stockMsg:"✓ In stock at Pune FC" },
                    { name:"Peace Lily — Small",  sku:"SKU-PL-002", variant:"Small",                        price:"₹249", qty:2, stockOk:true,  stockMsg:"✓ In stock" },
                    { name:"Terracotta Pot 14cm", sku:"SKU-TP-014", variant:"",                             price:"₹299", qty:1, stockOk:false, stockMsg:"⚠ Low stock: 3 remaining" },
                  ].map((item,i) => (
                    <div key={i} role="listitem"
                      style={{ display:"flex", gap:"14px", padding:"14px 18px",
                        borderBottom:`1px solid ${T.borderMuted}` }}>
                      <div style={{ width:"64px", height:"64px", borderRadius:"4px",
                        background:T.cardHover, border:`1px solid ${T.border}`,
                        display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:"24px", flexShrink:0 }}>🌿</div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:"13px", fontWeight:600, color:T.text }}>{item.name}</div>
                        <div style={{ fontFamily:"monospace", fontSize:"11px", color:T.textMuted }}>{item.sku}</div>
                        {item.variant && <div style={{ fontSize:"11px", color:T.textMuted }}>{item.variant}</div>}
                        <div style={{ fontSize:"11px", color:item.stockOk?T.delivered:T.processing, marginTop:"3px" }}>
                          {item.stockMsg}
                        </div>
                      </div>
                      <div style={{ textAlign:"right", flexShrink:0 }}>
                        <div style={{ fontSize:"12px", fontWeight:700, color:T.text }}>
                          {item.price} × {item.qty}
                        </div>
                        <div style={{ fontSize:"11px", color:T.textMuted, marginTop:"2px" }}>
                          Total: {item.price}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ padding:"14px 18px", display:"flex", flexDirection:"column", gap:"6px" }}>
                  {[{l:"Subtotal",v:"₹1,196"},{l:"Discount (HERO10)",v:"−₹120",c:T.delivered},
                    {l:"Shipping",v:"₹0"},{l:"Tax (GST 18%)",v:"₹172"}].map(r => (
                    <div key={r.l} style={{ display:"flex", justifyContent:"space-between" }}>
                      <span style={{ fontSize:"12px", color:T.textMuted }}>{r.l}</span>
                      <span style={{ fontSize:"12px", fontWeight:600, color:r.c||T.text }}>{r.v}</span>
                    </div>
                  ))}
                  <div style={{ height:"1px", background:T.border, margin:"4px 0" }} />
                  <div style={{ display:"flex", justifyContent:"space-between" }}>
                    <span style={{ fontSize:"15px", fontWeight:700, color:T.text }}>Total</span>
                    <span style={{ fontSize:"15px", fontWeight:800, color:T.text }}>₹1,248</span>
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
                  <span style={{ fontSize:"15px", fontWeight:600, color:T.text }}>Fulfilment Actions</span>
                  <Badge bg={fSt.bg} color={fSt.color}>{order.fulfilment}</Badge>
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
                  <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
                    <label style={{ display:"flex", alignItems:"center", gap:"8px",
                      fontSize:"12px", color:T.text, cursor:"pointer" }}>
                      <input type="checkbox" checked={notifyEmail}
                        onChange={e=>setNotifyEmail(e.target.checked)}
                        style={{ accentColor:T.accent }} />
                      Send shipment email to {order.email}
                    </label>
                    <label style={{ display:"flex", alignItems:"center", gap:"8px",
                      fontSize:"12px", color:T.text, cursor:"pointer" }}>
                      <input type="checkbox" checked={notifySms}
                        onChange={e=>setNotifySms(e.target.checked)}
                        style={{ accentColor:T.accent }} />
                      Send SMS to {order.phone}
                    </label>
                  </div>
                  <div style={{ display:"flex", gap:"10px", paddingTop:"4px" }}>
                    <Btn variant="secondary" onClick={() => onToast("Draft saved.")}>
                      Save Draft
                    </Btn>
                    <Btn variant="primary" fullWidth onClick={handleFulfil}>
                      ✓ Mark as Fulfilled + Notify Customer
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
                  {notes.map(n => (
                    <div key={n.id} style={{ display:"flex", gap:"10px" }}>
                      <Avatar initials={n.initials} size={28} />
                      <div style={{ flex:1 }}>
                        <div style={{ display:"flex", justifyContent:"space-between",
                          alignItems:"center", marginBottom:"4px" }}>
                          <span style={{ fontSize:"11px", color:T.textMuted }}>
                            {n.author} · {n.time}
                          </span>
                          <span style={{ fontSize:"10px", background:T.accentBg, color:T.accent,
                            padding:"1px 6px", borderRadius:"9999px" }}>Internal</span>
                        </div>
                        <p style={{ margin:0, fontSize:"12px", color:T.text, lineHeight:1.6 }}>
                          {n.text}
                        </p>
                      </div>
                    </div>
                  ))}
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
                    <Btn variant="secondary" disabled={!noteText.trim()} onClick={addNote}>
                      Save Note
                    </Btn>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* right sidebar */}
          <div style={{ width:"260px", flexShrink:0, borderLeft:`1px solid ${T.border}`,
            overflowY:"auto", padding:"16px", display:"flex", flexDirection:"column", gap:"12px" }}>

            {/* Order Summary */}
            <SideCard title="Order Summary">
              {[{l:"Subtotal",v:"₹1,196"},{l:"Discount (HERO10)",v:"−₹120",c:T.delivered},
                {l:"Shipping",v:"₹0"},{l:"Tax",v:"₹172"}].map(r=>(
                <div key={r.l} style={{ display:"flex", justifyContent:"space-between", fontSize:"11px" }}>
                  <span style={{ color:T.textMuted }}>{r.l}</span>
                  <span style={{ color:r.c||T.text, fontWeight:600 }}>{r.v}</span>
                </div>
              ))}
              <div style={{ height:"1px", background:T.border, margin:"6px 0" }} />
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <span style={{ fontSize:"13px", fontWeight:700, color:T.text }}>Total</span>
                <span style={{ fontSize:"13px", fontWeight:800, color:T.text }}>₹1,248</span>
              </div>
              <div style={{ marginTop:"8px", padding:"7px", background:T.deliveredBg,
                borderRadius:"6px", fontSize:"11px", color:T.delivered }}>
                ✓ Paid · 15 Jun 2026 · Visa ···· 4821
              </div>
            </SideCard>

            {/* Customer */}
            <SideCard title="Customer" action={<Btn variant="ghost" size="xs" onClick={()=>onToast("Opening customer profile…")}>View Profile</Btn>}>
              <div style={{ display:"flex", gap:"10px", marginBottom:"10px" }}>
                <Avatar initials={order.avatar} size={38} />
                <div>
                  <div style={{ fontSize:"13px", fontWeight:700, color:T.text }}>{order.customer}</div>
                  <div style={{ fontSize:"11px", color:T.textMuted }}>{order.email}</div>
                  <div style={{ fontSize:"11px", color:T.textMuted }}>📞 {order.phone}</div>
                </div>
              </div>
              <div style={{ fontSize:"11px", color:T.accent, marginBottom:"4px" }}>🌿 Plant Lover · Member since Jan 2025</div>
              <div style={{ fontSize:"11px", color:T.textMuted, marginBottom:"10px" }}>Orders: 12 · Total spent: ₹14,820</div>
              <div style={{ display:"flex", gap:"6px" }}>
                <Btn variant="secondary" size="xs" onClick={()=>onToast("Opening email composer…")}>✉ Email</Btn>
                <Btn variant="secondary" size="xs" onClick={()=>onToast("Opening SMS composer…")}>💬 SMS</Btn>
              </div>
            </SideCard>

            {/* Delivery Address */}
            <SideCard title="Delivery Address"
              action={<Btn variant="ghost" size="xs" onClick={()=>onToast("Address edit coming soon.")}>✎ Edit</Btn>}>
              <div style={{ fontSize:"11px", color:T.text, lineHeight:1.8 }}>
                🏠 {order.customer}<br/>42, Green Park Society<br/>Baner, Pune — 411045<br/>Maharashtra, India<br/>📞 {order.phone}
              </div>
              <div style={{ display:"flex", gap:"6px", marginTop:"8px" }}>
                <Btn variant="ghost" size="xs" onClick={()=>onToast("Address copied!")}>📋 Copy</Btn>
                <Btn variant="ghost" size="xs" onClick={()=>window.open("https://maps.google.com","_blank")}>↗ Maps</Btn>
              </div>
            </SideCard>

            {/* Payment */}
            <SideCard title="Payment">
              {[{l:"Amount",v:order.total},{l:"Status",v:order.payment,c:pSt.color},
                {l:"Method",v:"Visa ···· 4821"},{l:"Gateway",v:"Razorpay"},{l:"Date",v:order.date}]
                .map(r=>(
                <div key={r.l} style={{ display:"flex", justifyContent:"space-between", fontSize:"11px", marginBottom:"4px" }}>
                  <span style={{ color:T.textMuted }}>{r.l}</span>
                  <span style={{ color:r.c||T.text, fontWeight:600 }}>{r.v}</span>
                </div>
              ))}
              <div style={{ marginTop:"8px" }}>
                <Btn variant="secondary" size="xs" fullWidth onClick={()=>onToast("Opening refund panel…")}>
                  💰 Issue Refund
                </Btn>
              </div>
            </SideCard>

            {/* Risk */}
            <SideCard title="Risk Assessment"
              action={<Badge bg={T.deliveredBg} color={T.delivered}>Low Risk 🟢</Badge>}>
              {[{l:"Fraud score",v:`${order.riskScore}/100`},{l:"IP location",v:`${order.city}, IN`},
                {l:"AVS match",v:"✓ Full"},{l:"3DS auth",v:"✓ Verified"}].map(r=>(
                <div key={r.l} style={{ display:"flex", justifyContent:"space-between", fontSize:"11px", marginBottom:"4px" }}>
                  <span style={{ color:T.textMuted }}>{r.l}</span>
                  <span style={{ color:T.text }}>{r.v}</span>
                </div>
              ))}
              <div style={{ marginTop:"8px" }}>
                <Btn variant="danger" size="xs" fullWidth onClick={()=>onToast("Order flagged as suspicious.")}>
                  ⚑ Flag as Suspicious
                </Btn>
              </div>
            </SideCard>

            {/* Tags */}
            <SideCard title="Tags">
              <div style={{ display:"flex", flexWrap:"wrap", gap:"6px" }}>
                {(order.tags.length>0 ? order.tags : []).map(tag=>(
                  <span key={tag} style={{ fontSize:"11px", background:T.cardHover,
                    border:`1px solid ${T.border}`, borderRadius:"9999px",
                    padding:"2px 10px", color:T.text }}>{tag}</span>
                ))}
                <button onClick={()=>onToast("Tag input coming soon.")}
                  style={{ fontSize:"11px", background:"none",
                    border:`1px dashed ${T.accent}`, borderRadius:"9999px",
                    padding:"2px 10px", color:T.accent, cursor:"pointer" }}>
                  + Add tag
                </button>
              </div>
              <div style={{ marginTop:"8px", fontSize:"11px", color:T.textMuted }}>
                Source: Direct / Google Ads · Channel: Mobile web
              </div>
            </SideCard>
          </div>
        </div>
      </div>
    </>
  );
}

/* tiny helper card */
function SideCard({ title, action, children }: {
  title:string; action?:React.ReactNode; children:React.ReactNode
}) {
  return (
    <div style={{ background:T.cardBg, border:`1px solid ${T.borderMuted}`,
      borderRadius:"8px", overflow:"hidden" }}>
      <div style={{ padding:"10px 14px", borderBottom:`1px solid ${T.borderMuted}`,
        display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <span style={{ fontSize:"12px", fontWeight:600, color:T.text }}>{title}</span>
        {action}
      </div>
      <div style={{ padding:"12px 14px", display:"flex", flexDirection:"column", gap:"4px" }}>
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
  const [toasts, setToasts]           = useState<{id:number;msg:string}[]>([]);
  const [bulkMenuOpen, setBulkMenuOpen] = useState(false);

  const pushToast = (msg:string) =>
    setToasts(t => [...t, { id:Date.now(), msg }]);
  const dismissToast = (id:number) =>
    setToasts(t => t.filter(x => x.id!==id));

  // Show arrival toast on mount
  useEffect(() => {
    const t = setTimeout(() => pushToast("New order: #ORD-4832 — Ravi Shah — ₹1,050"), 2500);
    return () => clearTimeout(t);
  }, []);

  // Close overflow menu on outside click
  useEffect(() => {
    if (!openMenu) return;
    const h = () => setOpenMenu(null);
    document.addEventListener("click", h, { capture:true, once:true });
    return () => document.removeEventListener("click", h, { capture:true });
  }, [openMenu]);

  // ── filter + sort ──
  const filtered = ORDERS.filter(o => {
    const q = search.toLowerCase();
    const matchSearch = !search ||
      o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) ||
      o.email.toLowerCase().includes(q) || o.city.toLowerCase().includes(q);
    const matchTab =
      activeTab==="All" ||
      (activeTab==="Pending"    && o.payment==="Pending") ||
      (activeTab==="Processing" && o.fulfilment==="Unfulfilled") ||
      (activeTab==="Shipped"    && (o.fulfilment==="Shipped"||o.fulfilment==="Out for Delivery")) ||
      (activeTab==="Delivered"  && o.fulfilment==="Delivered") ||
      (activeTab==="Cancelled"  && o.fulfilment==="Cancelled") ||
      (activeTab==="Returned"   && (o.fulfilment==="Return Requested"||o.fulfilment==="Return Received"));
    const matchPay  = !filters.paymentStatus.length || filters.paymentStatus.includes(o.payment);
    const matchCour = !filters.courier.length       || filters.courier.includes(o.courier);
    const matchTags = !filters.tags.length          || filters.tags.some(t=>o.tags.includes(t));
    return matchSearch && matchTab && matchPay && matchCour && matchTags;
  }).sort((a,b) => {
    const dir = sortDir==="asc" ? 1 : -1;
    if (sortKey==="date")     return dir*(a.dateRaw.getTime()-b.dateRaw.getTime());
    if (sortKey==="total")    return dir*(a.totalNum-b.totalNum);
    if (sortKey==="customer") return dir*a.customer.localeCompare(b.customer);
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length/perPage));
  const paged = filtered.slice((page-1)*perPage, page*perPage);

  const tabCounts: Record<TabKey,number> = {
    All:        ORDERS.length,
    Pending:    ORDERS.filter(o=>o.payment==="Pending").length,
    Processing: ORDERS.filter(o=>o.fulfilment==="Unfulfilled").length,
    Shipped:    ORDERS.filter(o=>o.fulfilment==="Shipped"||o.fulfilment==="Out for Delivery").length,
    Delivered:  ORDERS.filter(o=>o.fulfilment==="Delivered").length,
    Cancelled:  ORDERS.filter(o=>o.fulfilment==="Cancelled").length,
    Returned:   ORDERS.filter(o=>o.fulfilment==="Return Requested"||o.fulfilment==="Return Received").length,
  };

  const allSel = paged.length>0 && paged.every(o=>selected.has(o.id));
  const someSel = paged.some(o=>selected.has(o.id));

  const toggleSelectAll = () => {
    const next = new Set(selected);
    if (allSel) paged.forEach(o=>next.delete(o.id));
    else        paged.forEach(o=>next.add(o.id));
    setSelected(next);
  };

  const toggleSelect = (id:string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const handleSort = (key:typeof sortKey) => {
    if (sortKey===key) setSortDir(d=>d==="asc"?"desc":"asc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const activeFilterCount = Object.values(filters).flat().length;
  const removeFilter = (key:keyof FilterState) => setFilters({...filters,[key]:[]});

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
                {ORDERS.length.toLocaleString()} total orders
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
            <KpiCard label="Orders Today"       value="124"       delta="+12 vs yesterday"  deltaType="up"      sparkData={sparks.orders}  onClick={()=>{ setActiveTab("All");        pushToast("Filtered: Today's orders"); }} />
            <KpiCard label="Revenue Today"      value="₹1,54,752" delta="+8.4%"             deltaType="up"      sparkData={sparks.revenue} />
            <KpiCard label="Avg Order Value"    value="₹1,248"    delta="same as yesterday" deltaType="neutral" sparkData={sparks.avg}     />
            <KpiCard label="Pending Fulfilment" value={String(tabCounts.Processing)} delta="Action needed" deltaType="down" sparkData={sparks.pending} accentColor={T.processing} onClick={()=>{ setActiveTab("Processing"); pushToast("Filtered: Pending fulfilment"); }} />
            <KpiCard label="Shipped Today"      value="34"        delta="+5 vs yesterday"   deltaType="up"      sparkData={sparks.shipped} onClick={()=>{ setActiveTab("Shipped");    pushToast("Filtered: Shipped orders"); }} />
            <KpiCard label="Cancelled Today"    value="3"         delta="−2 vs yesterday"   deltaType="up"      sparkData={sparks.cancel}  accentColor={T.cancelled} onClick={()=>{ setActiveTab("Cancelled");  pushToast("Filtered: Cancelled orders"); }} />
            <KpiCard label="Return Requests"    value={String(tabCounts.Returned)} delta="1 new today" deltaType="down" sparkData={sparks.returns} accentColor={T.returned} onClick={()=>{ setActiveTab("Returned"); pushToast("Filtered: Return requests"); }} />
            <KpiCard label="COD Pending"        value={String(tabCounts.Pending)} delta="Needs collection" deltaType="neutral" sparkData={sparks.cod} accentColor={T.attempted} />
          </div>

          {/* ── Status Tabs ── */}
          <div role="tablist" aria-label="Filter orders by status"
            style={{ display:"flex", gap:"4px", flexWrap:"wrap",
              borderBottom:`1px solid ${T.border}` }}>
            {STATUS_TABS.map(tab => (
              <button key={tab.key} role="tab" aria-selected={activeTab===tab.key}
                className={`ao-tab${activeTab===tab.key?" active":""}`}
                onClick={() => { setActiveTab(tab.key); setPage(1); }}>
                {tab.label} ({tabCounts[tab.key]})
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
                  {paged.map(order => {
                    const isSel = selected.has(order.id);
                    const pSt = PAYMENT_STYLE[order.payment];
                    const fSt = FULFILMENT_STYLE[order.fulfilment];
                    return (
                      <tr key={order.id} role="row" aria-selected={isSel}
                        className={`ao-row${isSel?" selected":""}`}
                        onClick={()=>setDetailOrder(order)}>
                        {/* checkbox cell — stop propagation so row-click doesn't also open detail */}
                        <td style={{ padding:"12px 14px", textAlign:"center" }}
                          onClick={e=>e.stopPropagation()}>
                          <input type="checkbox" aria-label={`Select order ${order.id}`}
                            checked={isSel} onChange={()=>toggleSelect(order.id)}
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
                              onClick={()=>setDetailOrder(order)}>
                              View
                            </Btn>
                            {order.fulfilment==="Unfulfilled" && (
                              <Btn variant="primary" size="sm"
                                onClick={()=>setDetailOrder(order)}>
                                Fulfil
                              </Btn>
                            )}
                            <div style={{ position:"relative" }}>
                              <button aria-haspopup="menu"
                                aria-expanded={openMenu===order.id}
                                className="ao-btn ao-btn-secondary ao-btn-sm"
                                style={{ padding:"4px 8px" }}
                                onClick={e=>{ e.stopPropagation(); setOpenMenu(openMenu===order.id?null:order.id); }}>
                                ⋮
                              </button>
                              {openMenu===order.id && (
                                <OverflowMenu orderId={order.id}
                                  onAction={label=>{
                                    setOpenMenu(null);
                                    if (label==="View Order") setDetailOrder(order);
                                    else pushToast(`${label} — ${order.id}`);
                                  }} />
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {paged.length===0 && (
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
            {filtered.length > 0 && (
              <div style={{ padding:"12px 16px", borderTop:`1px solid ${T.borderMuted}`,
                display:"flex", alignItems:"center", justifyContent:"space-between",
                flexWrap:"wrap", gap:"10px" }}>
                <span style={{ fontSize:"12px", color:T.textMuted }}>
                  Showing {(page-1)*perPage+1}–{Math.min(page*perPage,filtered.length)}{" "}
                  of {filtered.length.toLocaleString()}
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
                  {totalPages>5 && <span style={{ color:T.textMuted,fontSize:"12px" }}>…</span>}
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
          <OrderDetailPanel order={detailOrder}
            onClose={()=>setDetailOrder(null)}
            onToast={pushToast} />
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
