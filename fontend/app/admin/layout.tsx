"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { useAdminAuth } from "@/features/admin/hooks/useAdminAuth";

/* ════════════════════════════════════════════
   SVG Icon Library
════════════════════════════════════════════ */
const Icon = {
  Dashboard: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/>
      <rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>
    </svg>
  ),
  Orders: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4H18a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
      <rect width="8" height="4" x="8" y="2" rx="1"/><path d="m9 14 2 2 4-4"/>
    </svg>
  ),
  Products: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    </svg>
  ),
  Customers: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  Analytics: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/><path d="M2 20h20"/>
    </svg>
  ),
  Inventory: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
  ),
  Payments: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
    </svg>
  ),
  Shipping: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3"/>
      <rect width="13" height="13" x="9" y="11" rx="2"/>
    </svg>
  ),
  Discounts: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 14 15 8"/><circle cx="9.5" cy="8.5" r="1.5"/><circle cx="14.5" cy="13.5" r="1.5"/>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  Reviews: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  GardenServices: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a10 10 0 0 1 10 10c0 5.5-4.5 10-10 10S2 17.5 2 12 6.5 2 12 2"/>
      <path d="M12 22V12"/><path d="m12 12-4-4m4 4 4-4"/>
    </svg>
  ),
  AICare: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/>
      <path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/>
    </svg>
  ),
  Pages: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
    </svg>
  ),
  Campaigns: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m22 2-7 20-4-9-9-4 20-7z"/>
    </svg>
  ),
  Settings: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  Staff: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  Integrations: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>
  ),
  ActivityLog: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </svg>
  ),
  Bell: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
    </svg>
  ),
  Search: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
  ),
  X: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
  ),
  ChevronLeft: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6"/>
    </svg>
  ),
  LogOut: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  ExternalLink: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  ),
  User: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  ChevronDown: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6"/>
    </svg>
  ),
  Leaf: () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path d="M12 2C12 2 4 5 4 13C4 17.4 7.6 21 12 21C16.4 21 20 17.4 20 13C20 5 12 2 12 2Z" fill="#00b566" opacity="0.9"/>
      <path d="M12 21V10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 15L8.5 11.5" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M12 12L15.5 8.5" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
};

/* ════════════════════════════════════════════
   Navigation Structure
════════════════════════════════════════════ */
const NAV_SECTIONS = [
  {
    label: "MAIN",
    items: [
      { label: "Dashboard",  href: "/admin",            icon: <Icon.Dashboard />,       exact: true },
      { label: "Orders",     href: "/admin/orders",     icon: <Icon.Orders />,          badge: "12" },
      { label: "Products",   href: "/admin/products",   icon: <Icon.Products /> },
      { label: "Customers",  href: "/admin/customers",  icon: <Icon.Customers /> },
      { label: "Analytics",  href: "/admin/analytics",  icon: <Icon.Analytics /> },
    ],
  },
  {
    label: "STORE",
    items: [
      { label: "Inventory",          href: "/admin/inventory",          icon: <Icon.Inventory /> },
      { label: "Payments",           href: "/admin/payments",           icon: <Icon.Payments /> },
      { label: "Shipping",           href: "/admin/shipping",           icon: <Icon.Shipping /> },
      { label: "Discounts",          href: "/admin/discounts",          icon: <Icon.Discounts /> },
      { label: "Reviews",            href: "/admin/reviews",            icon: <Icon.Reviews />,     badge: "5" },
    ],
  },
  {
    label: "SERVICES",
    items: [
      { label: "Garden Services",  href: "/admin/garden-services",  icon: <Icon.GardenServices /> },
      { label: "AI Care",          href: "/admin/ai-care",          icon: <Icon.AICare /> },
    ],
  },
  {
    label: "CONTENT",
    items: [
      { label: "Pages & Blog",  href: "/admin/pages",     icon: <Icon.Pages /> },
      { label: "Campaigns",     href: "/admin/campaigns", icon: <Icon.Campaigns /> },
    ],
  },
  {
    label: "SETTINGS",
    items: [
      { label: "Store Settings",  href: "/admin/settings",      icon: <Icon.Settings /> },
      { label: "Staff & Roles",   href: "/admin/staff",         icon: <Icon.Staff /> },
      { label: "Integrations",    href: "/admin/integrations",  icon: <Icon.Integrations /> },
      { label: "Activity Log",    href: "/admin/activity-log",  icon: <Icon.ActivityLog /> },
    ],
  },
];

const RECENT_SEARCH = [
  { icon: "📦", label: "Order #ORD-4821", sub: "Priya Kumar", meta: "Delivered" },
  { icon: "🌿", label: "Monstera Deliciosa M", sub: "SKU-MM-001", meta: "In Stock 234" },
  { icon: "👤", label: "Ravi Shah", sub: "ravi@email.com", meta: "₹8,440 LTV" },
];

const JUMP_TO = [
  { icon: "📊", label: "Dashboard",  href: "/admin" },
  { icon: "📦", label: "Orders",     href: "/admin/orders" },
  { icon: "🛒", label: "Products",   href: "/admin/products" },
  { icon: "👥", label: "Customers",  href: "/admin/customers" },
];

const NOTIFICATIONS = [
  { color: "var(--admin-error)", dot: "🔴", title: "Low stock: Snake Plant (SKU-SP-002)", body: "Only 3 units remaining", time: "5 mins ago", unread: true },
  { color: "var(--admin-warning)", dot: "🟡", title: "Order #ORD-4830 — Payment pending", body: "Awaiting confirmation", time: "12 mins ago", unread: true },
  { color: "var(--admin-success)", dot: "🟢", title: "Garden service booking confirmed", body: "Ravi Shah · Pune · 20 Jun", time: "10 mins ago", unread: false },
];

/* ════════════════════════════════════════════
   Sub-components
════════════════════════════════════════════ */

// Sidebar nav item
function NavItem({ item, isActive, collapsed }: {
  item: { label: string; href: string; icon: React.ReactNode; badge?: string; exact?: boolean };
  isActive: boolean;
  collapsed: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const ref = useRef<HTMLAnchorElement>(null);

  const handleMouseEnter = () => {
    setHovered(true);
    if (collapsed && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setTooltipStyle({ top: rect.top + rect.height / 2 - 14 });
    }
  };

  const bg = isActive
    ? "var(--admin-accent-muted)"
    : hovered
    ? "var(--admin-bg-elevated)"
    : "transparent";

  const textColor = isActive ? "var(--admin-text)" : hovered ? "var(--admin-text)" : "var(--admin-text-label)";
  const iconColor = isActive || hovered ? "var(--admin-accent)" : "var(--admin-text-muted)";

  return (
    <div style={{ position: "relative" }}>
      <Link
        ref={ref}
        href={item.href}
        aria-current={isActive ? "page" : undefined}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          height: "36px",
          padding: collapsed ? "0 19px" : "0 16px",
          borderRadius: "var(--admin-radius-sm)",
          background: bg,
          color: textColor,
          textDecoration: "none",
          fontWeight: isActive ? 600 : 500,
          fontSize: "12px",
          transition: "all var(--admin-motion-instant)",
          borderLeft: isActive ? "3px solid var(--admin-accent)" : "3px solid transparent",
          overflow: "hidden",
          whiteSpace: "nowrap",
          position: "relative",
        }}
      >
        <span style={{ color: iconColor, flexShrink: 0, transition: "color var(--admin-motion-instant)", display: "flex" }}>
          {item.icon}
        </span>
        {!collapsed && (
          <>
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.badge && (
              <span style={{
                background: "var(--admin-accent)",
                color: "white",
                fontSize: "10px",
                fontWeight: 700,
                borderRadius: "9999px",
                padding: "1px 6px",
                lineHeight: 1.4,
              }}>
                {item.badge}
              </span>
            )}
          </>
        )}
      </Link>

      {/* Tooltip for collapsed mode */}
      {collapsed && hovered && (
        <div
          style={{
            position: "fixed",
            left: "64px",
            ...tooltipStyle,
            background: "var(--admin-bg-overlay)",
            border: "1px solid var(--admin-border)",
            color: "var(--admin-text)",
            fontSize: "12px",
            fontWeight: 500,
            padding: "6px 10px",
            borderRadius: "var(--admin-radius-sm)",
            boxShadow: "var(--admin-shadow-md)",
            zIndex: 999,
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
        >
          {item.label}
          {item.badge && (
            <span style={{ marginLeft: "6px", background: "var(--admin-accent)", color: "white", fontSize: "10px", fontWeight: 700, borderRadius: "9999px", padding: "1px 5px" }}>
              {item.badge}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// Global Search Modal
function SearchModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 300,
        background: "rgba(15,17,23,0.75)",
        display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "80px",
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Global search"
    >
      <div
        style={{
          width: "640px", maxWidth: "calc(100vw - 32px)",
          background: "var(--admin-bg-overlay)",
          border: "1px solid var(--admin-border)",
          borderRadius: "var(--admin-radius-lg)",
          boxShadow: "var(--admin-shadow-lg)",
          overflow: "hidden",
          animation: "admin-fade-in var(--admin-motion-fast) ease-out",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Search input */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "0 16px", borderBottom: "1px solid var(--admin-border-muted)" }}>
          <span style={{ color: "var(--admin-text-muted)", display: "flex" }}><Icon.Search /></span>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search orders, products, customers..."
            style={{
              flex: 1, height: "52px", background: "transparent", border: "none", outline: "none",
              color: "var(--admin-text)", fontSize: "16px", fontFamily: "Outfit, sans-serif",
            }}
          />
          <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--admin-text-muted)", display: "flex", padding: "4px" }}>
            <Icon.X />
          </button>
        </div>

        {/* Recent */}
        <div style={{ padding: "12px 0" }}>
          <div style={{ padding: "6px 16px 4px", fontSize: "11px", fontWeight: 700, color: "var(--admin-text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            {query ? "Results" : "Recent"}
          </div>
          {RECENT_SEARCH.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex", alignItems: "center", gap: "12px", padding: "10px 16px",
                cursor: "pointer", transition: "background var(--admin-motion-instant)",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "var(--admin-bg-elevated)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <span style={{ fontSize: "18px" }}>{item.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--admin-text)" }}>{item.label}</div>
                <div style={{ fontSize: "11px", color: "var(--admin-text-muted)" }}>{item.sub}</div>
              </div>
              <span style={{ fontSize: "11px", color: "var(--admin-text-muted)" }}>{item.meta}</span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ borderTop: "1px solid var(--admin-border-muted)" }} />

        {/* Jump to */}
        <div style={{ padding: "12px 0 8px" }}>
          <div style={{ padding: "6px 16px 4px", fontSize: "11px", fontWeight: 700, color: "var(--admin-text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Jump to
          </div>
          {JUMP_TO.map((item, i) => (
            <Link
              key={i}
              href={item.href}
              onClick={onClose}
              style={{
                display: "flex", alignItems: "center", gap: "12px", padding: "9px 16px",
                color: "var(--admin-text-label)", fontSize: "13px", textDecoration: "none",
                transition: "background var(--admin-motion-instant)",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "var(--admin-bg-elevated)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}
            >
              <span style={{ fontSize: "16px" }}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Keyboard hint */}
        <div style={{ borderTop: "1px solid var(--admin-border-muted)", padding: "8px 16px", display: "flex", gap: "16px" }}>
          {[["↑↓", "navigate"], ["↵", "select"], ["esc", "close"]].map(([key, label]) => (
            <span key={label} style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "var(--admin-text-muted)" }}>
              <kbd style={{ background: "var(--admin-bg-canvas)", border: "1px solid var(--admin-border)", borderRadius: "3px", padding: "1px 5px", fontSize: "10px", fontFamily: "inherit" }}>{key}</kbd>
              <span>{label}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// Notification Panel
function NotificationPanel({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 200 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          position: "fixed", top: "64px", right: 0, width: "320px", height: "calc(100vh - 64px)",
          background: "var(--admin-bg-surface)",
          borderLeft: "1px solid var(--admin-border)",
          boxShadow: "var(--admin-shadow-lg)",
          animation: "admin-slide-in-right var(--admin-motion-slow) ease-out",
          display: "flex", flexDirection: "column",
          zIndex: 200,
        }}
        role="log"
        aria-live="polite"
        aria-label="Notifications"
        onClick={e => e.stopPropagation()}
      >
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--admin-border-muted)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--admin-text)" }}>Notifications</span>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button style={{ fontSize: "11px", color: "var(--admin-accent)", background: "transparent", border: "none", cursor: "pointer", fontWeight: 600, padding: "2px 6px" }}>
              Mark all read
            </button>
            <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--admin-text-muted)", display: "flex" }}>
              <Icon.X />
            </button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>
          {NOTIFICATIONS.map((n, i) => (
            <div
              key={i}
              style={{
                padding: "14px 20px",
                borderBottom: "1px solid var(--admin-border-muted)",
                background: n.unread ? "var(--admin-accent-muted)" : "transparent",
                cursor: "pointer",
                transition: "background var(--admin-motion-instant)",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "var(--admin-bg-elevated)")}
              onMouseLeave={e => (e.currentTarget.style.background = n.unread ? "var(--admin-accent-muted)" : "transparent")}
            >
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "14px", marginTop: "1px" }}>{n.dot}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--admin-text)", lineHeight: 1.4 }}>{n.title}</div>
                  <div style={{ fontSize: "11px", color: "var(--admin-text-muted)", marginTop: "2px" }}>{n.body}</div>
                  <div style={{ fontSize: "11px", color: "var(--admin-text-muted)", marginTop: "4px" }}>{n.time}</div>
                </div>
                {n.unread && <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--admin-accent)", flexShrink: 0, marginTop: "5px" }} />}
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: "12px 20px", borderTop: "1px solid var(--admin-border-muted)" }}>
          <button style={{
            width: "100%", padding: "8px", background: "transparent",
            border: "1px solid var(--admin-border)", borderRadius: "var(--admin-radius-sm)",
            color: "var(--admin-text-muted)", fontSize: "12px", cursor: "pointer",
            transition: "all var(--admin-motion-instant)",
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "var(--admin-bg-elevated)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--admin-text)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "var(--admin-text-muted)"; }}
          >
            View all notifications
          </button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   Main Layout
════════════════════════════════════════════ */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  const { admin, logout } = useAdminAuth(!isLoginPage);

  const [collapsed, setCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Ctrl+K global search shortcut
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      setSearchOpen(true);
    }
  }, []);

  useEffect(() => {
    if (isLoginPage) return;
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown, isLoginPage]);

  // Close user menu on outside click
  useEffect(() => {
    if (isLoginPage) return;
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isLoginPage]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  const adminName = admin ? `${admin.first_name} ${admin.last_name}` : "Admin User";
  const adminInitials = admin
    ? `${admin.first_name?.[0] || ""}${admin.last_name?.[0] || ""}`.toUpperCase() || "AD"
    : "AD";
  const adminRoleFormatted = admin?.role
    ? admin.role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "Administrator";


  const sidebarWidth = collapsed ? "56px" : "240px";

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div className="admin-shell" style={{ display: "flex", flexDirection: "column" }}>

      {/* ── TOP BAR ── */}
      <header
        role="banner"
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          height: "64px",
          background: "var(--admin-bg-sidebar)",
          borderBottom: "1px solid var(--admin-border-muted)",
          display: "flex", alignItems: "center", gap: "16px",
          padding: "0 24px",
        }}
      >
        {/* Logo */}
        <Link
          href="/admin"
          style={{
            display: "flex", alignItems: "center", gap: "10px",
            textDecoration: "none", width: collapsed ? "auto" : "200px",
            transition: "width var(--admin-motion-slow)", flexShrink: 0,
          }}
          aria-label="Hero Admin — go to dashboard"
        >
          <Icon.Leaf />
          {!collapsed && (
            <span style={{ fontSize: "16px", fontWeight: 700, color: "var(--admin-text)", whiteSpace: "nowrap", letterSpacing: "-0.3px" }}>
              Hero Admin
            </span>
          )}
        </Link>

        {/* Global search */}
        <button
          role="combobox"
          aria-expanded={searchOpen}
          aria-label="Global search"
          onClick={() => setSearchOpen(true)}
          style={{
            flex: 1, maxWidth: "480px", margin: "0 auto",
            height: "40px",
            display: "flex", alignItems: "center", gap: "10px",
            background: "var(--admin-bg-input)",
            border: "1px solid var(--admin-border)",
            borderRadius: "var(--admin-radius-sm)",
            padding: "0 12px",
            cursor: "text", textAlign: "left",
            transition: "border-color var(--admin-motion-instant), box-shadow var(--admin-motion-instant)",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--admin-accent)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--admin-border)"; }}
        >
          <span style={{ color: "var(--admin-text-muted)", display: "flex" }}><Icon.Search /></span>
          <span style={{ flex: 1, fontSize: "12px", color: "var(--admin-text-ph)", textAlign: "left" }}>
            Search orders, products, customers...
          </span>
          <kbd style={{
            background: "var(--admin-bg-canvas)", border: "1px solid var(--admin-border)",
            borderRadius: "var(--admin-radius-xs)", padding: "2px 6px",
            fontSize: "10px", color: "var(--admin-text-muted)", fontFamily: "inherit",
          }}>
            ⌘K
          </kbd>
        </button>

        {/* Right actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "auto", flexShrink: 0 }}>

          {/* Help */}
          <button style={{
            width: "36px", height: "36px", borderRadius: "50%", background: "transparent",
            border: "1px solid var(--admin-border-muted)", cursor: "pointer",
            color: "var(--admin-text-muted)", display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all var(--admin-motion-instant)",
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "var(--admin-bg-elevated)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--admin-text)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "var(--admin-text-muted)"; }}
            aria-label="Help"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>
            </svg>
          </button>

          {/* Notification Bell */}
          <button
            onClick={() => { setNotifOpen(!notifOpen); setUserMenuOpen(false); }}
            aria-label="Notifications, 3 unread"
            aria-haspopup="true"
            style={{
              width: "36px", height: "36px", borderRadius: "50%", background: "transparent",
              border: "1px solid var(--admin-border-muted)", cursor: "pointer",
              color: notifOpen ? "var(--admin-accent)" : "var(--admin-text-muted)",
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative",
              transition: "all var(--admin-motion-instant)",
              outline: notifOpen ? "2px solid var(--admin-accent)" : "none",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "var(--admin-bg-elevated)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--admin-text)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = notifOpen ? "var(--admin-accent)" : "var(--admin-text-muted)"; }}
          >
            <Icon.Bell />
            <span style={{
              position: "absolute", top: "6px", right: "6px",
              width: "8px", height: "8px",
              background: "var(--admin-error)", borderRadius: "50%",
              border: "1.5px solid var(--admin-bg-sidebar)",
            }} />
          </button>

          {/* User Menu */}
          <div ref={userMenuRef} style={{ position: "relative" }}>
            <button
              onClick={() => { setUserMenuOpen(!userMenuOpen); setNotifOpen(false); }}
              aria-label="User menu for Priya K."
              aria-haspopup="menu"
              style={{
                display: "flex", alignItems: "center", gap: "8px",
                padding: "4px 10px 4px 4px",
                background: userMenuOpen ? "var(--admin-bg-elevated)" : "transparent",
                border: "1px solid var(--admin-border-muted)",
                borderRadius: "var(--admin-radius-full)",
                cursor: "pointer",
                transition: "all var(--admin-motion-instant)",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "var(--admin-bg-elevated)"; }}
              onMouseLeave={e => { if (!userMenuOpen) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
            >
              {/* Avatar */}
              <div style={{
                width: "28px", height: "28px", borderRadius: "50%",
                background: "var(--admin-accent-muted)",
                border: "1.5px solid var(--admin-accent)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--admin-accent)", fontSize: "11px", fontWeight: 700,
                flexShrink: 0,
              }}>{adminInitials}</div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--admin-text)", whiteSpace: "nowrap" }}>{adminName}</div>
                <div style={{ fontSize: "10px", color: "var(--admin-text-muted)", whiteSpace: "nowrap" }}>{adminRoleFormatted}</div>
              </div>
              <span style={{ color: "var(--admin-text-muted)", display: "flex" }}><Icon.ChevronDown /></span>
            </button>

            {/* Dropdown */}
            {userMenuOpen && (
              <div
                role="menu"
                style={{
                  position: "absolute", top: "calc(100% + 8px)", right: 0,
                  width: "200px",
                  background: "var(--admin-bg-overlay)",
                  border: "1px solid var(--admin-border)",
                  borderRadius: "var(--admin-radius-md)",
                  boxShadow: "var(--admin-shadow-md)",
                  zIndex: 200,
                  overflow: "hidden",
                  animation: "admin-fade-in var(--admin-motion-fast) ease-out",
                }}
              >
                {[
                  { label: "My Profile", icon: <Icon.User /> },
                  { label: "Account Settings", icon: <Icon.Settings /> },
                  { label: "Activity Log", icon: <Icon.ActivityLog /> },
                  { label: "Switch Role", icon: <Icon.Staff /> },
                ].map((m, i) => (
                  <button
                    key={i}
                    role="menuitem"
                    style={{
                      width: "100%", display: "flex", alignItems: "center", gap: "10px",
                      padding: "10px 14px", background: "transparent", border: "none",
                      cursor: "pointer", color: "var(--admin-text-label)", fontSize: "13px",
                      textAlign: "left", transition: "all var(--admin-motion-instant)",
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "var(--admin-bg-elevated)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--admin-text)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "var(--admin-text-label)"; }}
                  >
                    <span style={{ display: "flex", color: "var(--admin-text-muted)" }}>{m.icon}</span>
                    {m.label}
                  </button>
                ))}
                <div style={{ borderTop: "1px solid var(--admin-border-muted)", margin: "4px 0" }} />
                <button
                  role="menuitem"
                  onClick={logout}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: "10px",
                    padding: "10px 14px", background: "transparent", border: "none",
                    cursor: "pointer", color: "var(--admin-error)", fontSize: "13px",
                    textAlign: "left", transition: "all var(--admin-motion-instant)",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "var(--admin-error-bg)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                >
                  <span style={{ display: "flex" }}><Icon.LogOut /></span>
                  Sign Out
                </button>

              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── BODY (sidebar + main) ── */}
      <div style={{ display: "flex", paddingTop: "64px", minHeight: "100vh" }}>

        {/* ── SIDEBAR ── */}
        <nav
          role="navigation"
          aria-label="Admin navigation"
          style={{
            width: sidebarWidth,
            flexShrink: 0,
            position: "fixed",
            top: "64px",
            left: 0,
            bottom: 0,
            background: "var(--admin-bg-sidebar)",
            borderRight: "1px solid var(--admin-border-muted)",
            overflowY: "auto",
            overflowX: "hidden",
            zIndex: 90,
            display: "flex",
            flexDirection: "column",
            transition: "width var(--admin-motion-slow)",
          }}
        >
          {/* Nav items */}
          <div style={{ flex: 1, padding: "8px 8px", paddingBottom: "0" }} role="list">
            {NAV_SECTIONS.map(section => (
              <div key={section.label} style={{ marginBottom: "4px" }}>
                {/* Section label */}
                {!collapsed && (
                  <div
                    aria-hidden="true"
                    style={{
                      fontSize: "11px", fontWeight: 700, color: "var(--admin-text-muted)",
                      letterSpacing: "0.08em", textTransform: "uppercase",
                      padding: "10px 8px 4px",
                    }}
                  >
                    {section.label}
                  </div>
                )}
                {collapsed && <div style={{ height: "8px" }} />}

                {/* Items */}
                <div role="list" style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                  {section.items.map(item => (
                    <div key={item.href} role="listitem">
                      <NavItem
                        item={item}
                        isActive={isActive(item.href, item.exact)}
                        collapsed={collapsed}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* ── Bottom: user + collapse ── */}
          <div style={{ padding: "8px", borderTop: "1px solid var(--admin-border-muted)" }}>
            {!collapsed && (
              <div style={{
                display: "flex", alignItems: "center", gap: "10px",
                padding: "10px 12px 10px",
                borderRadius: "var(--admin-radius-sm)",
                marginBottom: "4px",
              }}>
                <div style={{
                  width: "32px", height: "32px", borderRadius: "50%",
                  background: "var(--admin-accent-muted)",
                  border: "1.5px solid var(--admin-accent)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--admin-accent)", fontSize: "12px", fontWeight: 700,
                  flexShrink: 0,
                }}>PK</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--admin-text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Priya K.</div>
                  <div style={{ fontSize: "11px", color: "var(--admin-accent)", whiteSpace: "nowrap" }}>Super Admin</div>
                </div>
              </div>
            )}

            {/* Sign out */}
            {!collapsed && (
              <button style={{
                width: "100%", display: "flex", alignItems: "center", gap: "8px",
                padding: "8px 12px", background: "transparent",
                border: "none", borderRadius: "var(--admin-radius-sm)",
                cursor: "pointer", color: "var(--admin-text-muted)", fontSize: "12px",
                transition: "all var(--admin-motion-instant)", marginBottom: "4px",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "var(--admin-error-bg)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--admin-error)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "var(--admin-text-muted)"; }}
              >
                <Icon.LogOut /> Sign Out
              </button>
            )}

            {/* View store */}
            {!collapsed && (
              <Link href="/" style={{
                display: "flex", alignItems: "center", gap: "8px",
                padding: "8px 12px", color: "var(--admin-text-muted)", fontSize: "12px",
                textDecoration: "none", borderRadius: "var(--admin-radius-sm)",
                transition: "all var(--admin-motion-instant)", marginBottom: "8px",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "var(--admin-bg-elevated)"; (e.currentTarget as HTMLAnchorElement).style.color = "var(--admin-text)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; (e.currentTarget as HTMLAnchorElement).style.color = "var(--admin-text-muted)"; }}
              >
                <Icon.ExternalLink /> View Store
              </Link>
            )}

            {/* Collapse toggle */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-expanded={!collapsed}
              style={{
                width: "100%", height: "32px",
                display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "flex-end",
                padding: "0 8px",
                background: "transparent", border: "1px solid var(--admin-border-muted)",
                borderRadius: "var(--admin-radius-sm)",
                cursor: "pointer", color: "var(--admin-text-muted)",
                transition: "all var(--admin-motion-instant)",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "var(--admin-bg-elevated)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--admin-text)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--admin-border)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "var(--admin-text-muted)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--admin-border-muted)"; }}
            >
              {collapsed ? <Icon.ChevronRight /> : (
                <>
                  <span style={{ fontSize: "11px", marginRight: "4px" }}>Collapse</span>
                  <Icon.ChevronLeft />
                </>
              )}
            </button>
          </div>
        </nav>

        {/* ── MAIN CONTENT ── */}
        <main
          style={{
            flex: 1,
            marginLeft: sidebarWidth,
            transition: "margin-left var(--admin-motion-slow)",
            minWidth: 0,
            minHeight: "calc(100vh - 64px)",
            padding: "24px",
            background: "var(--admin-bg-canvas)",
          }}
        >
          {children}
        </main>
      </div>

      {/* ── OVERLAYS ── */}
      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
      {notifOpen && <NotificationPanel onClose={() => setNotifOpen(false)} />}
    </div>
  );
}
