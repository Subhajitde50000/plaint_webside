"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { MOCK_CUSTOMERS, KPI_DATA, Customer, CustomerStatus, CustomerTier } from "./data";

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
  gold: "#c69026", silver: "#adbac7",
  star: "#c8a84b",
  shadow: "0 2px 8px rgba(0,0,0,0.35)",
  focus: "0 0 0 3px rgba(0,181,102,0.25)",
};

/* ─── helpers ────────────────────────────────────────────────────────────── */
function getInitials(first: string, last: string) {
  return `${first[0]}${last[0]}`.toUpperCase();
}

function tierConfig(tier: CustomerTier) {
  if (tier === "gold")        return { icon: "🥇", label: "Gold",        color: T.gold,   bg: T.warningBg };
  if (tier === "silver")      return { icon: "🥈", label: "Silver",      color: T.silver, bg: T.infoBg };
  return                             { icon: "🌿", label: "Plant Lover", color: T.accent, bg: T.accentBg };
}

function statusConfig(status: CustomerStatus) {
  if (status === "active")      return { label: "Active",      color: T.success, bg: T.successBg, dot: true };
  if (status === "new")         return { label: "New",         color: T.info,    bg: T.infoBg,    dot: false };
  if (status === "at_risk")     return { label: "At-Risk",     color: T.warning, bg: T.warningBg, dot: false };
  if (status === "blocked")     return { label: "Blocked",     color: T.error,   bg: T.errorBg,   dot: false };
  return                               { label: "Unverified",  color: T.muted,   bg: "rgba(84,93,104,0.15)", dot: false };
}

type Segment = "all" | "vip" | "gold" | "silver" | "plant_lover" | "new" | "at_risk" | "blocked";
type SortKey = "newest" | "oldest" | "highest_ltv" | "lowest_ltv" | "most_orders" | "name_az" | "last_active";

const SEGMENTS: { key: Segment; label: string }[] = [
  { key: "all",         label: "All" },
  { key: "vip",         label: "VIP" },
  { key: "gold",        label: "Gold" },
  { key: "silver",      label: "Silver" },
  { key: "plant_lover", label: "Plant Lover" },
  { key: "new",         label: "New" },
  { key: "at_risk",     label: "At-Risk" },
  { key: "blocked",     label: "Blocked" },
];

function filterBySegment(customers: Customer[], seg: Segment): Customer[] {
  if (seg === "all")         return customers;
  if (seg === "vip")         return customers.filter(c => c.tags.includes("VIP"));
  if (seg === "gold")        return customers.filter(c => c.tier === "gold");
  if (seg === "silver")      return customers.filter(c => c.tier === "silver");
  if (seg === "plant_lover") return customers.filter(c => c.tier === "plant_lover");
  if (seg === "new")         return customers.filter(c => c.status === "new");
  if (seg === "at_risk")     return customers.filter(c => c.status === "at_risk");
  if (seg === "blocked")     return customers.filter(c => c.status === "blocked");
  return customers;
}

function sortCustomers(customers: Customer[], sort: SortKey): Customer[] {
  const c = [...customers];
  if (sort === "newest")      return c.sort((a, b) => b.id.localeCompare(a.id));
  if (sort === "oldest")      return c.sort((a, b) => a.id.localeCompare(b.id));
  if (sort === "highest_ltv") return c.sort((a, b) => b.ltvRaw - a.ltvRaw);
  if (sort === "lowest_ltv")  return c.sort((a, b) => a.ltvRaw - b.ltvRaw);
  if (sort === "most_orders") return c.sort((a, b) => b.orders - a.orders);
  if (sort === "name_az")     return c.sort((a, b) => a.firstName.localeCompare(b.firstName));
  return c;
}

/* ─── sub-components ─────────────────────────────────────────────────────── */

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
      letterSpacing: "0.03em",
    }}>
      {getInitials(first, last)}
    </div>
  );
}

function Badge({ label, color, bg, dot }: { label: string; color: string; bg: string; dot?: boolean }) {
  return (
    <span aria-label={`Status: ${label}`} style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      background: bg, color, fontSize: 11, fontWeight: 700,
      borderRadius: 9999, padding: "2px 8px",
    }}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, flexShrink: 0 }} />}
      {label}
    </span>
  );
}

function TierBadge({ tier }: { tier: CustomerTier }) {
  const cfg = tierConfig(tier);
  return (
    <span aria-label={`Tier: ${cfg.label}`} style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      background: cfg.bg, color: cfg.color, fontSize: 11, fontWeight: 700,
      borderRadius: 9999, padding: "2px 8px",
    }}>
      <span style={{ fontSize: 12 }}>{cfg.icon}</span>{cfg.label}
    </span>
  );
}

function KpiCard({ label, value, delta, positive, accent }: {
  label: string; value: string; delta: string; positive: boolean; accent?: boolean;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        flex: "1 1 180px", background: hov ? T.elevated : T.card,
        borderRadius: 8, padding: "20px 22px",
        border: `1px solid ${accent && !positive ? T.warning : T.borderMuted}`,
        borderLeft: accent && !positive ? `3px solid ${T.warning}` : undefined,
        transition: "background 150ms",
        cursor: "default",
      }}
    >
      <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color: accent && !positive ? T.warning : T.text, lineHeight: 1.1 }}>{value}</div>
      <div style={{ marginTop: 6, fontSize: 11, color: positive ? T.success : T.warning, fontWeight: 600 }}>
        {positive ? "↑" : "⚠"} {delta}
      </div>
    </div>
  );
}

function OverflowMenu({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handle(e: MouseEvent) { if (!ref.current?.contains(e.target as Node)) onClose(); }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [onClose]);
  const items = [
    { label: "View Profile", danger: false },
    { label: "Edit Customer", danger: false },
    { label: "Send Email", danger: false },
    { label: "Send SMS", danger: false },
    null,
    { label: "Add Tag", danger: false },
    { label: "Adjust Points", danger: false },
    { label: "Change Tier", danger: false },
    null,
    { label: "Block Account", danger: true },
    { label: "Delete Customer", danger: true },
  ];
  return (
    <div ref={ref} role="menu" style={{
      position: "absolute", right: 0, top: "calc(100% + 4px)", zIndex: 100,
      background: T.overlay, border: `1px solid ${T.border}`, borderRadius: 8,
      width: 200, boxShadow: "0 8px 24px rgba(0,0,0,0.45)", overflow: "hidden",
    }}>
      {items.map((item, i) =>
        item === null
          ? <div key={i} style={{ height: 1, background: T.border, margin: "2px 0" }} />
          : (
            <button key={item.label} role="menuitem" onClick={onClose} style={{
              display: "block", width: "100%", textAlign: "left",
              padding: "9px 14px", background: "transparent",
              border: "none", cursor: "pointer",
              fontSize: 13, color: item.danger ? T.error : T.text,
              transition: "background 150ms",
            }}
              onMouseEnter={e => (e.currentTarget.style.background = item.danger ? T.errorBg : T.elevated)}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              {item.label}
            </button>
          )
      )}
    </div>
  );
}

/* ─── Filter Drawer ──────────────────────────────────────────────────────── */
function FilterDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [tiers, setTiers]     = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [source, setSource]   = useState<string[]>([]);
  const [minLtv, setMinLtv]   = useState("");
  const [maxLtv, setMaxLtv]   = useState("");

  function toggle(arr: string[], val: string, set: (v: string[]) => void) {
    set(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);
  }

  function clearAll() { setTiers([]); setStatuses([]); setSource([]); setMinLtv(""); setMaxLtv(""); }

  return (
    <>
      {open && (
        <div onClick={onClose} style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 199, backdropFilter: "blur(2px)",
        }} />
      )}
      <div role="dialog" aria-label="Customer filters" aria-modal style={{
        position: "fixed", top: 0, right: 0, height: "100%", width: 320,
        background: T.card, borderLeft: `1px solid ${T.border}`,
        zIndex: 200, display: "flex", flexDirection: "column",
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform 250ms cubic-bezier(0.4,0,0.2,1)",
        boxShadow: "-8px 0 32px rgba(0,0,0,0.4)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px", borderBottom: `1px solid ${T.border}` }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: T.text }}>Filters</span>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <button onClick={clearAll} style={{ background: "none", border: "none", color: T.error, fontSize: 12, cursor: "pointer", fontWeight: 600 }}>Clear All</button>
            <button onClick={onClose} aria-label="Close filters" style={{
              background: T.elevated, border: `1px solid ${T.border}`, borderRadius: 6,
              width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
              color: T.muted, cursor: "pointer", fontSize: 14,
            }}>✕</button>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Tier */}
          <FilterSection label="Loyalty Tier">
            {(["Plant Lover", "Silver", "Gold"] as const).map(t => (
              <CheckItem key={t} label={t} checked={tiers.includes(t)} onChange={() => toggle(tiers, t, setTiers)} />
            ))}
          </FilterSection>
          {/* Status */}
          <FilterSection label="Status">
            {(["Active", "New", "At-Risk", "Blocked", "Unverified"] as const).map(s => (
              <CheckItem key={s} label={s} checked={statuses.includes(s)} onChange={() => toggle(statuses, s, setStatuses)} />
            ))}
          </FilterSection>
          {/* LTV Range */}
          <FilterSection label="Lifetime Value (LTV)">
            <div style={{ display: "flex", gap: 8 }}>
              <input value={minLtv} onChange={e => setMinLtv(e.target.value)} placeholder="Min ₹" style={inputSt} />
              <input value={maxLtv} onChange={e => setMaxLtv(e.target.value)} placeholder="Max ₹" style={inputSt} />
            </div>
          </FilterSection>
          {/* Source */}
          <FilterSection label="Acquisition Source">
            {(["Direct", "Google", "Instagram", "Referral", "Other"] as const).map(s => (
              <CheckItem key={s} label={s} checked={source.includes(s)} onChange={() => toggle(source, s, setSource)} />
            ))}
          </FilterSection>
          {/* Booleans */}
          <FilterSection label="Customer Type">
            <CheckItem label="Pet Owner" checked={false} onChange={() => {}} />
            <CheckItem label="AI Care User" checked={false} onChange={() => {}} />
            <CheckItem label="Garden Service Client" checked={false} onChange={() => {}} />
          </FilterSection>
        </div>
        <div style={{ padding: "16px 20px", borderTop: `1px solid ${T.border}` }}>
          <button onClick={onClose} style={{
            width: "100%", padding: "10px", borderRadius: 6, background: T.accent,
            border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer",
          }}>Apply Filters</button>
        </div>
      </div>
    </>
  );
}

function FilterSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, color: T.label, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>{label}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{children}</div>
    </div>
  );
}

function CheckItem({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: T.text }}>
      <div onClick={onChange} role="checkbox" aria-checked={checked} style={{
        width: 16, height: 16, borderRadius: 4,
        border: `1.5px solid ${checked ? T.accent : T.border}`,
        background: checked ? T.accent : T.elevated,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, cursor: "pointer", transition: "all 150ms",
      }}>
        {checked && <span style={{ color: "#fff", fontSize: 10, fontWeight: 900 }}>✓</span>}
      </div>
      {label}
    </label>
  );
}

const inputSt: React.CSSProperties = {
  flex: 1, padding: "8px 10px", borderRadius: 6, background: T.elevated,
  border: `1px solid ${T.border}`, color: T.text, fontSize: 12,
  outline: "none", fontFamily: "inherit",
};

/* ─── Bulk Action Bar ────────────────────────────────────────────────────── */
function BulkBar({ count, onClear }: { count: number; onClear: () => void }) {
  return (
    <div aria-live="polite" style={{
      display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
      background: T.accentBg, border: `1px solid ${T.accent}`, borderRadius: 8,
      padding: "10px 16px",
    }}>
      <span style={{ fontSize: 13, color: T.accent, fontWeight: 700 }}>☑ {count} selected</span>
      {[["Send Email", false], ["Add Tag", false], ["Change Tier", false], ["Export Selected", false]].map(([label]) => (
        <button key={label as string} style={{
          padding: "5px 12px", borderRadius: 6, background: T.elevated,
          border: `1px solid ${T.border}`, color: T.text, fontSize: 12, cursor: "pointer", fontWeight: 600,
        }}>{label}</button>
      ))}
      <button style={{
        padding: "5px 12px", borderRadius: 6, background: "transparent",
        border: `1px solid ${T.error}`, color: T.error, fontSize: 12, cursor: "pointer", fontWeight: 600,
      }}>Block</button>
      <button onClick={onClear} style={{
        marginLeft: "auto", background: "none", border: "none", color: T.muted,
        fontSize: 18, cursor: "pointer", lineHeight: 1,
      }}>✕</button>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────────────── */
export default function AdminCustomersPage() {
  const [search, setSearch]           = useState("");
  const [segment, setSegment]         = useState<Segment>("all");
  const [sort, setSort]               = useState<SortKey>("newest");
  const [filterOpen, setFilterOpen]   = useState(false);
  const [selected, setSelected]       = useState<Set<string>>(new Set());
  const [page, setPage]               = useState(1);
  const [openMenu, setOpenMenu]       = useState<string | null>(null);
  const PER_PAGE = 25;

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  function handleSearch(val: string) {
    setSearch(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(val), 250);
  }

  // filter + sort
  const afterSegment = filterBySegment(MOCK_CUSTOMERS, segment);
  const afterSearch  = afterSegment.filter(c => {
    const q = debouncedSearch.toLowerCase();
    if (!q) return true;
    return (
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.customerId.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q)
    );
  });
  const sorted = sortCustomers(afterSearch, sort);
  const total  = sorted.length;
  const pages  = Math.max(1, Math.ceil(total / PER_PAGE));
  const paginated = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function toggleSelect(id: string) {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }
  function toggleAll() {
    if (selected.size === paginated.length) { setSelected(new Set()); }
    else { setSelected(new Set(paginated.map(c => c.id))); }
  }

  const segCounts = SEGMENTS.reduce((acc, seg) => {
    acc[seg.key] = filterBySegment(MOCK_CUSTOMERS, seg.key).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, minHeight: "100%" }}>

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" style={{ fontSize: 12, color: T.muted, display: "flex", alignItems: "center", gap: 6 }}>
        <Link href="/admin" style={{ color: T.muted, textDecoration: "none" }}>Admin</Link>
        <span>/</span>
        <span style={{ color: T.text }} aria-current="page">Customers</span>
      </nav>

      {/* Page Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: T.text }}>Customers</h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: T.muted }}>{total.toLocaleString()} total customers</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button style={secondaryBtn}>↓ Export</button>
          <Link href="/admin/customers/new" style={{
            padding: "8px 16px", borderRadius: 6, background: T.accent,
            color: "#fff", fontSize: 13, fontWeight: 700, textDecoration: "none",
            display: "flex", alignItems: "center", gap: 6,
          }}>+ Add Customer</Link>
        </div>
      </div>

      {/* KPI Row */}
      <div role="region" aria-label="Customer metrics" style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <KpiCard label="Total Customers"       value={KPI_DATA.totalCustomers.value} delta={KPI_DATA.totalCustomers.delta} positive />
        <KpiCard label="New This Month"        value={KPI_DATA.newThisMonth.value}   delta={KPI_DATA.newThisMonth.delta}   positive />
        <KpiCard label="Active (30d)"          value={KPI_DATA.active30d.value}      delta={KPI_DATA.active30d.delta}      positive />
        <KpiCard label="Avg LTV"               value={KPI_DATA.avgLtv.value}         delta={KPI_DATA.avgLtv.delta}         positive />
        <KpiCard label="VIP Customers"         value={KPI_DATA.vipCustomers.value}   delta={KPI_DATA.vipCustomers.delta}   positive />
        <KpiCard label="At-Risk (90d no order)" value={KPI_DATA.atRisk.value}        delta={KPI_DATA.atRisk.delta}         positive={false} accent />
      </div>

      {/* Segment Tabs */}
      <div role="tablist" aria-label="Customer segments" style={{
        display: "flex", gap: 6, flexWrap: "wrap",
        borderBottom: `1px solid ${T.border}`, paddingBottom: 0,
      }}>
        {SEGMENTS.map(seg => {
          const active = segment === seg.key;
          const isVip = seg.key === "vip";
          return (
            <button
              key={seg.key}
              role="tab"
              aria-selected={active}
              onClick={() => { setSegment(seg.key); setPage(1); }}
              style={{
                padding: "8px 16px", borderRadius: "6px 6px 0 0",
                background: active ? (isVip ? T.purpleBg : T.accentBg) : "transparent",
                border: `1px solid ${active ? (isVip ? T.purple : T.accent) : T.border}`,
                borderBottom: active ? `1px solid ${T.card}` : `1px solid ${T.border}`,
                color: active ? (isVip ? T.purple : T.accent) : T.muted,
                fontSize: 13, fontWeight: active ? 700 : 500,
                cursor: "pointer", transition: "all 150ms",
                outline: "none", marginBottom: -1,
              }}
              onFocus={e => { e.currentTarget.style.boxShadow = T.focus; }}
              onBlur={e => { e.currentTarget.style.boxShadow = "none"; }}
            >
              {seg.label} ({segCounts[seg.key]})
            </button>
          );
        })}
      </div>

      {/* Table Toolbar */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        {/* Search */}
        <div style={{ position: "relative", flex: "1 1 280px" }}>
          <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: T.muted, fontSize: 14 }}>🔍</span>
          <input
            aria-label="Search customers"
            value={search}
            onChange={e => handleSearch(e.target.value)}
            placeholder="Search customers, email, phone..."
            style={{
              width: "100%", boxSizing: "border-box",
              padding: "8px 12px 8px 34px",
              background: T.elevated, border: `1px solid ${T.border}`,
              borderRadius: 6, color: T.text, fontSize: 13,
              outline: "none", fontFamily: "inherit",
            }}
            onFocus={e => { e.currentTarget.style.borderColor = T.borderActive; e.currentTarget.style.boxShadow = T.focus; }}
            onBlur={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = "none"; }}
          />
        </div>
        {/* Filter */}
        <button
          id="filter-btn"
          onClick={() => setFilterOpen(true)}
          style={{ ...secondaryBtn, display: "flex", alignItems: "center", gap: 6 }}
        >
          ⚙ Filter
        </button>
        {/* Sort */}
        <select
          value={sort}
          onChange={e => setSort(e.target.value as SortKey)}
          style={{
            padding: "8px 12px", borderRadius: 6, background: T.elevated,
            border: `1px solid ${T.border}`, color: T.text, fontSize: 13,
            outline: "none", cursor: "pointer", fontFamily: "inherit",
          }}
        >
          <option value="newest">Sort: Newest First</option>
          <option value="oldest">Oldest Member</option>
          <option value="highest_ltv">Highest LTV</option>
          <option value="lowest_ltv">Lowest LTV</option>
          <option value="most_orders">Most Orders</option>
          <option value="name_az">Name A–Z</option>
          <option value="last_active">Last Active</option>
        </select>
        <button style={secondaryBtn}>↓ Export CSV</button>
      </div>

      {/* Bulk bar */}
      {selected.size > 0 && <BulkBar count={selected.size} onClear={() => setSelected(new Set())} />}

      {/* Table */}
      <div style={{
        background: T.card, borderRadius: 8, border: `1px solid ${T.borderMuted}`,
        overflow: "hidden", boxShadow: T.shadow,
      }}>
        <div style={{ overflowX: "auto" }}>
          <table role="grid" aria-label="Customers" style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#0f1117" }}>
                <th style={thSt}>
                  <div
                    role="checkbox"
                    aria-label="Select all customers"
                    aria-checked={selected.size === paginated.length ? "true" : selected.size > 0 ? "mixed" : "false"}
                    onClick={toggleAll}
                    style={{
                      width: 16, height: 16, borderRadius: 4, cursor: "pointer",
                      border: `1.5px solid ${selected.size > 0 ? T.accent : T.border}`,
                      background: selected.size === paginated.length ? T.accent : T.elevated,
                      display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto",
                    }}
                  >
                    {selected.size > 0 && <span style={{ color: "#fff", fontSize: 10, fontWeight: 900 }}>
                      {selected.size === paginated.length ? "✓" : "–"}
                    </span>}
                  </div>
                </th>
                {[
                  { label: "Customer",   w: 220 },
                  { label: "Phone",      w: 140 },
                  { label: "Tier",       w: 110 },
                  { label: "Orders",     w: 80  },
                  { label: "LTV",        w: 110 },
                  { label: "Last Order", w: 120 },
                  { label: "Joined",     w: 110 },
                  { label: "City",       w: 100 },
                  { label: "Status",     w: 110 },
                  { label: "Actions",    w: 120 },
                ].map(col => (
                  <th key={col.label} role="columnheader" style={{ ...thSt, width: col.w }}>{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={11} style={{ textAlign: "center", padding: "64px 24px" }}>
                    <div style={{ fontSize: 36, marginBottom: 12 }}>📭</div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: T.text, marginBottom: 6 }}>No customers found</div>
                    <div style={{ fontSize: 13, color: T.muted }}>Try adjusting your filters or search terms.</div>
                  </td>
                </tr>
              )}
              {paginated.map(c => {
                const isSelected = selected.has(c.id);
                const sc = statusConfig(c.status);
                return (
                  <tr
                    key={c.id}
                    style={{
                      borderTop: `1px solid ${T.borderMuted}`,
                      background: isSelected ? T.accentBg : "transparent",
                      borderLeft: isSelected ? `3px solid ${T.accent}` : "3px solid transparent",
                      transition: "background 150ms",
                      cursor: "pointer",
                    }}
                    onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = T.elevated; }}
                    onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
                  >
                    {/* Checkbox */}
                    <td style={tdSt} onClick={e => { e.stopPropagation(); toggleSelect(c.id); }}>
                      <div role="checkbox" aria-label={`Select customer ${c.firstName} ${c.lastName}`} aria-checked={isSelected}
                        style={{
                          width: 16, height: 16, borderRadius: 4, cursor: "pointer",
                          border: `1.5px solid ${isSelected ? T.accent : T.border}`,
                          background: isSelected ? T.accent : T.elevated,
                          display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto",
                        }}>
                        {isSelected && <span style={{ color: "#fff", fontSize: 10, fontWeight: 900 }}>✓</span>}
                      </div>
                    </td>
                    {/* Customer */}
                    <td style={tdSt}>
                      <Link href={`/admin/customers/${c.id}`} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
                        <Avatar first={c.firstName} last={c.lastName} />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: T.text, whiteSpace: "nowrap" }}>{c.firstName} {c.lastName}</div>
                          <div style={{ fontSize: 11, color: T.muted, marginTop: 1 }}>{c.email}</div>
                        </div>
                      </Link>
                    </td>
                    <td style={{ ...tdSt, color: T.text, whiteSpace: "nowrap" }}>{c.phone}</td>
                    <td style={tdSt}><TierBadge tier={c.tier} /></td>
                    <td style={{ ...tdSt, textAlign: "center", fontWeight: 700, color: T.text }}>{c.orders}</td>
                    <td style={{ ...tdSt, fontWeight: 700, color: T.accent, whiteSpace: "nowrap" }}>{c.ltv}</td>
                    <td style={{ ...tdSt, color: T.muted, whiteSpace: "nowrap" }}>{c.lastOrder}</td>
                    <td style={{ ...tdSt, color: T.muted, whiteSpace: "nowrap" }}>{c.joined}</td>
                    <td style={{ ...tdSt, color: T.text, whiteSpace: "nowrap" }}>{c.city}</td>
                    <td style={tdSt}>
                      <Badge label={sc.label} color={sc.color} bg={sc.bg} dot={sc.dot} />
                    </td>
                    {/* Actions */}
                    <td style={{ ...tdSt, whiteSpace: "nowrap" }}>
                      <div style={{ display: "flex", gap: 6, alignItems: "center", position: "relative" }}>
                        <Link href={`/admin/customers/${c.id}`} style={{
                          padding: "4px 10px", borderRadius: 5,
                          border: `1px solid ${T.border}`, color: T.text,
                          fontSize: 11, fontWeight: 600, textDecoration: "none",
                          background: "transparent",
                        }}>View</Link>
                        <button style={{
                          padding: "4px 10px", borderRadius: 5,
                          border: `1px solid ${T.border}`, color: T.muted,
                          fontSize: 11, fontWeight: 600, background: "transparent",
                          cursor: "pointer",
                        }}>Email</button>
                        <div style={{ position: "relative" }}>
                          <button
                            aria-label="More actions"
                            aria-haspopup="menu"
                            onClick={e => { e.stopPropagation(); setOpenMenu(openMenu === c.id ? null : c.id); }}
                            style={{
                              width: 28, height: 28, borderRadius: 5,
                              border: `1px solid ${T.border}`, background: "transparent",
                              color: T.muted, cursor: "pointer", fontSize: 16, lineHeight: "28px",
                              display: "flex", alignItems: "center", justifyContent: "center",
                            }}
                          >⋮</button>
                          {openMenu === c.id && <OverflowMenu onClose={() => setOpenMenu(null)} />}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 20px", borderTop: `1px solid ${T.border}`, flexWrap: "wrap", gap: 10,
        }}>
          <span style={{ fontSize: 12, color: T.muted }}>
            Showing {Math.min((page - 1) * PER_PAGE + 1, total)}–{Math.min(page * PER_PAGE, total)} of {total.toLocaleString()} customers
          </span>
          <nav aria-label="Pagination" style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={pageBtn(false, page === 1)}>‹ Prev</button>
            {Array.from({ length: Math.min(pages, 5) }, (_, i) => i + 1).map(p => (
              <button key={p} aria-current={p === page ? "page" : undefined} onClick={() => setPage(p)}
                style={pageBtn(p === page, false)}>{p}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} style={pageBtn(false, page === pages)}>Next ›</button>
          </nav>
        </div>
      </div>

      <FilterDrawer open={filterOpen} onClose={() => setFilterOpen(false)} />
    </div>
  );
}

/* ─── style helpers ──────────────────────────────────────────────────────── */
const thSt: React.CSSProperties = {
  padding: "10px 14px", textAlign: "left",
  fontSize: 11, fontWeight: 700, color: T.label,
  textTransform: "uppercase", letterSpacing: "0.06em",
  whiteSpace: "nowrap", borderBottom: `1px solid ${T.border}`,
};

const tdSt: React.CSSProperties = {
  padding: "12px 14px", verticalAlign: "middle",
};

const secondaryBtn: React.CSSProperties = {
  padding: "8px 14px", borderRadius: 6,
  background: "transparent", border: `1px solid ${T.border}`,
  color: T.text, fontSize: 13, cursor: "pointer", fontWeight: 600,
  whiteSpace: "nowrap",
};

function pageBtn(active: boolean, disabled: boolean): React.CSSProperties {
  return {
    padding: "5px 10px", borderRadius: 5,
    background: active ? T.accent : T.elevated,
    border: `1px solid ${active ? T.accent : T.border}`,
    color: active ? "#fff" : disabled ? T.muted : T.text,
    fontSize: 12, cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.4 : 1, fontWeight: active ? 700 : 400,
    minWidth: 32,
  };
}
