"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/* ── Icons ── */
function LeafLogo() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path d="M12 2C12 2 4 5 4 13C4 17.4 7.6 21 12 21C16.4 21 20 17.4 20 13C20 5 12 2 12 2Z" fill="#00b566" />
      <path d="M12 21V10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 15L8 11" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M12 12L16 8" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
function CartIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function ChevDown() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

/* ── NAV LINKS config ── */
const NAV_LINKS = [
  { label: "Home",     href: "/",        exact: true },
  { label: "Plants",   href: "/plants/monstera", dropdown: ["Indoor Plants", "Flower Plants", "Succulents", "Balcony Decor"] },
  { label: "Products", href: "#",        dropdown: ["Seeds", "Soil & Compost", "Tools", "Fertilizer"] },
  { label: "🤖 AI Care", href: "/ai-care" },
  { label: "Our Service",    href: "#" },
];

interface SharedNavbarProps {
  cartCount?: number;
}

export default function SharedNavbar({ cartCount = 0 }: SharedNavbarProps) {
  const pathname = usePathname();
  const [scrolled,    setScrolled]    = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const navbarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  /* Close dropdown on outside click */
  useEffect(() => {
    const h = (event: MouseEvent) => {
      if (!navbarRef.current) return;
      if (event.target instanceof Node && navbarRef.current.contains(event.target)) return;
      setOpenDropdown(null);
    };
    document.addEventListener("click", h);
    return () => document.removeEventListener("click", h);
  }, []);

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href) && href !== "/";
  };

  return (
    <header
      id="main-navbar"
      ref={navbarRef}
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        background: "white",
        boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.08)" : "none",
        borderBottom: scrolled ? "none" : "1px solid rgba(0,181,102,0.12)",
        transition: "box-shadow 250ms, border-color 250ms",
        height: "64px",
        display: "flex",
        alignItems: "center",
        fontFamily: "Outfit, sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');
        #main-navbar * { box-sizing: border-box; }
        #main-navbar :focus-visible { outline: 2px solid #00b566 !important; outline-offset: 2px !important; }
        .snav-desktop { display: flex; }
        .snav-hamburger { display: none !important; }
        @media (max-width: 768px) {
          .snav-desktop { display: none !important; }
          .snav-hamburger { display: flex !important; }
          .snav-search-expand { display: none !important; }
        }
      `}</style>

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 48px", display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }} className="snav-inner">

        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "9px", textDecoration: "none" }}>
          <LeafLogo />
          <span style={{ fontWeight: 700, fontSize: "20px", color: "#1c1c1c", letterSpacing: "-0.3px" }}>plant byst</span>
        </Link>

        {/* Desktop nav */}
        <nav className="snav-desktop" style={{ alignItems: "center", gap: "6px" }}>
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href, link.exact);
            if (link.dropdown) {
              const open = openDropdown === link.label;
              return (
                  <div
                    key={link.label}
                    style={{ position: "relative" }}
                    onMouseEnter={() => setOpenDropdown(link.label)}
                    onMouseLeave={() => setOpenDropdown((current) => (current === link.label ? null : current))}
                  >
                  <button
                      onClick={(e) => { e.stopPropagation(); setOpenDropdown(open ? null : link.label); }}
                    style={{
                      display: "flex", alignItems: "center", gap: "4px",
                      background: "none", border: "none", cursor: "pointer",
                      fontFamily: "Outfit, sans-serif", fontWeight: active ? 600 : 500, fontSize: "14px",
                      color: active ? "#00b566" : "#1c1c1c",
                      padding: "8px 12px", borderRadius: "8px",
                      transition: "color 200ms, background 200ms",
                      borderBottom: active ? "2px solid #00b566" : "2px solid transparent",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,181,102,0.06)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "none"; }}
                  >
                    {link.label} <ChevDown />
                  </button>
                  {open && (
                    <div onClick={(e) => e.stopPropagation()} style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, background: "white", borderRadius: "12px", boxShadow: "0 12px 32px rgba(0,0,0,0.12)", padding: "8px", minWidth: "220px", zIndex: 300, border: "1px solid rgba(0,181,102,0.12)" }}>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center", padding: "6px" }}>
                        {link.dropdown.map((item) => (
                          <Link key={item} href="#" onClick={() => setOpenDropdown(null)}
                            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "8px 12px", borderRadius: "8px", fontSize: "14px", color: "#1c1c1c", textDecoration: "none", transition: "background 150ms" }}
                            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "rgba(0,181,102,0.07)")}
                            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "transparent")}
                          >{item}</Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            }
            return (
              <Link key={link.label} href={link.href}
                style={{
                  fontFamily: "Outfit, sans-serif", fontWeight: active ? 600 : 500, fontSize: "14px",
                  color: active ? "#00b566" : "#1c1c1c",
                  textDecoration: "none",
                  padding: "8px 12px", borderRadius: "8px",
                  borderBottom: active ? "2px solid #00b566" : "2px solid transparent",
                  transition: "color 200ms, background 200ms",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(0,181,102,0.06)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {/* Search expand */}
          <div className="snav-search-expand" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {searchOpen && (
              <div style={{ background: "white", border: "1px solid rgba(0,181,102,0.4)", borderRadius: "9999px", padding: "6px 14px", boxShadow: "0 4px 16px rgba(0,181,102,0.12)", display: "flex", alignItems: "center", gap: "8px" }}>
                <SearchIcon />
                <input ref={searchRef} value={searchValue} onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setSearchOpen(false);
                      setSearchValue("");
                    } else if (e.key === "Enter" && searchValue.trim()) {
                      window.location.href = `/search?q=${encodeURIComponent(searchValue.trim())}`;
                    }
                  }}
                  placeholder="Search plants, seeds..." aria-label="Search"
                  style={{ width: "180px", border: "none", outline: "none", fontFamily: "Outfit, sans-serif", fontSize: "14px", color: "#1c1c1c", background: "transparent" }}
                />
                <button onClick={() => { setSearchOpen(false); setSearchValue(""); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "14px", color: "rgba(28,28,28,0.4)", padding: "0 2px" }}>✕</button>
              </div>
            )}
            <button onClick={() => setSearchOpen(v => !v)} aria-label="Search"
              style={{ width: "38px", height: "38px", borderRadius: "50px", border: "none", background: "transparent", cursor: "pointer", color: "#1c1c1c", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 200ms" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(0,181,102,0.08)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "transparent")}
            ><SearchIcon /></button>
          </div>

          {/* User */}
          <Link href="/profile" aria-label="Account"
            style={{ width: "38px", height: "38px", borderRadius: "50px", border: "none", background: "transparent", cursor: "pointer", color: "#1c1c1c", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 200ms" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "rgba(0,181,102,0.08)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "transparent")}
          ><UserIcon /></Link>

          {/* Cart */}
          <Link href="/cart" aria-label={`Cart, ${cartCount} item${cartCount !== 1 ? "s" : ""}`}
            style={{ position: "relative", width: "38px", height: "38px", borderRadius: "50px", border: "none", background: "transparent", cursor: "pointer", color: "#1c1c1c", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 200ms" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "rgba(0,181,102,0.08)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "transparent")}
          >
            <CartIcon />
            {cartCount > 0 && (
              <span style={{ position: "absolute", top: "3px", right: "3px", background: "#00b566", color: "white", fontSize: "9px", fontWeight: 700, width: "15px", height: "15px", borderRadius: "9999px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>

          {/* Hamburger */}
          <button className="snav-hamburger" onClick={() => setMenuOpen(v => !v)} aria-label="Open menu"
            style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px", width: "38px", height: "38px", borderRadius: "50px", border: "none", background: "transparent", cursor: "pointer" }}
          >
            {[0,1,2].map(i => (
              <span key={i} style={{ display: "block", width: "18px", height: "2px", background: "#1c1c1c", borderRadius: "2px", transition: "transform 200ms", transform: menuOpen && i === 0 ? "rotate(45deg) translate(4px,4px)" : menuOpen && i === 2 ? "rotate(-45deg) translate(4px,-4px)" : menuOpen && i === 1 ? "opacity 0" : "none" }} />
            ))}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div style={{ position: "absolute", top: "64px", left: 0, right: 0, background: "white", boxShadow: "0 12px 32px rgba(0,0,0,0.10)", padding: "16px 24px 24px", display: "flex", flexDirection: "column", gap: "4px", borderTop: "1px solid rgba(0,181,102,0.12)", zIndex: 190 }}>
          {NAV_LINKS.map((link) => (
            <Link key={link.label} href={link.href} onClick={() => setMenuOpen(false)}
              style={{ display: "block", padding: "12px 8px", fontFamily: "Outfit, sans-serif", fontWeight: 500, fontSize: "16px", color: isActive(link.href, link.exact) ? "#00b566" : "#1c1c1c", textDecoration: "none", borderBottom: "1px solid rgba(0,181,102,0.08)", transition: "color 200ms" }}
            >{link.label}</Link>
          ))}
        </div>
      )}
    </header>
  );
}
