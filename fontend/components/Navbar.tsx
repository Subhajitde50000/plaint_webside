"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMe } from "@/features/profile";
import { useAuthStore } from "@/store/auth.store";
import { useCart } from "@/features/cart/hooks/useCart";

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

function HomeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function RobotIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="12" x="3" y="8" rx="2" />
      <path d="M12 2v6" />
      <path d="M8 2h8" />
    </svg>
  );
}

function PlantIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22V12" />
      <path d="M12 12c0-2.8-2.2-5-5-5S2 9.2 2 12s2.2 5 5 5h5Z" />
      <path d="M12 12c0-2.8 2.2-5 5-5s5 2.2 5 5-2.2 5-5 5h-5Z" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function HistoryIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

/* ── NAV LINKS config ── */
const SUGGESTION_POOL = [
  "Monstera Deliciosa",
  "Red Anthurium Plant",
  "Indoor Snake Plant",
  "Balcony Flowers Mix",
  "Wildflower Seeds Mix",
  "Succulent Garden Set",
  "Moisture Meter Pro",
  "AI Care Soil Tester",
  "Seeds",
  "Soil & Compost",
  "Fertilizer",
  "Tools",
  "Monstera",
  "Anthurium",
  "Snake Plant",
  "Succulents"
];

const POPULAR_SEARCHES = [
  "Monstera",
  "Seeds",
  "Soil",
  "AI Care",
  "Succulents",
  "Tools"
];
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
  const router = useRouter();
  const { isAuthenticated, setUser } = useAuthStore();
  const { profile } = useMe();
  const { cart } = useCart();

  const liveCount = cart?.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) ?? 0;
  const finalCartCount = liveCount > 0 ? liveCount : cartCount;

  useEffect(() => {
    if (profile) {
      setUser(profile);
      if (!isAuthenticated) {
        useAuthStore.setState({ isAuthenticated: true });
      }
    }
  }, [profile, isAuthenticated, setUser]);

  const [scrolled,    setScrolled]    = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState<string | null>(null);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileSearchVal, setMobileSearchVal] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);

  // Handle profile icon click
  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push("/login?returnTo=/profile");
    } else {
      router.push("/profile");
    }
  };

  // Open search overlay on event (e.g. from the Search page input)
  useEffect(() => {
    const handleOpen = () => {
      if (typeof window !== "undefined" && window.innerWidth <= 768) {
        setMobileSearchOpen(true);
      }
    };
    window.addEventListener("open-mobile-search", handleOpen);
    return () => window.removeEventListener("open-mobile-search", handleOpen);
  }, []);

  // Lock background scroll when mobile search is open
  useEffect(() => {
    if (mobileSearchOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        mobileSearchInputRef.current?.focus();
      }, 50);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileSearchOpen]);

  // Load search history from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const historyStr = localStorage.getItem("plant_search_history");
      if (historyStr) {
        try {
          setSearchHistory(JSON.parse(historyStr));
        } catch (e) {
          setSearchHistory([]);
        }
      }
    }
  }, [mobileSearchOpen]);

  const saveSearchQuery = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    const updated = [trimmed, ...searchHistory.filter(h => h.toLowerCase() !== trimmed.toLowerCase())].slice(0, 8);
    setSearchHistory(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("plant_search_history", JSON.stringify(updated));
    }
  };

  const removeHistoryItem = (e: React.MouseEvent, item: string) => {
    e.stopPropagation();
    const updated = searchHistory.filter(h => h !== item);
    setSearchHistory(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("plant_search_history", JSON.stringify(updated));
    }
  };

  const clearAllHistory = () => {
    setSearchHistory([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("plant_search_history");
    }
  };

  const executeMobileSearch = (query: string) => {
    saveSearchQuery(query);
    setMobileSearchOpen(false);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const filteredSuggestions = mobileSearchVal.trim()
    ? SUGGESTION_POOL.filter(item =>
        item.toLowerCase().includes(mobileSearchVal.toLowerCase().trim())
      )
    : [];
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
      className={mobileSearchOpen ? "snav-mso-active" : ""}
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
        #main-navbar { z-index: 200 !important; }
        #main-navbar.snav-mso-active { z-index: 10000 !important; }
        @media (max-width: 768px) {
          #main-navbar { z-index: 9999 !important; }
        }
        #main-navbar * { box-sizing: border-box; }
        #main-navbar :focus-visible { outline: 2px solid #00b566 !important; outline-offset: 2px !important; }
        .snav-desktop { display: flex; }
        .snav-hamburger { display: none !important; }
        .snav-bottom-bar { display: none; }
        @media (max-width: 768px) {
          .snav-desktop { display: none !important; }
          .snav-hamburger { display: none !important; }
          .snav-search-expand { display: flex !important; }
          .snav-inner { padding: 0 16px !important; }
          .snav-bottom-bar {
            display: flex;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: calc(60px + env(safe-area-inset-bottom, 0px));
            padding-bottom: env(safe-area-inset-bottom, 0px);
            background: rgba(255, 255, 255, 0.96);
            backdrop-filter: blur(10px);
            border-top: 1px solid rgba(0, 181, 102, 0.12);
            box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.05);
            z-index: 250;
            align-items: center;
            justify-content: space-around;
          }
          .snav-bottom-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 4px;
            text-decoration: none;
            color: #71717a;
            font-size: 11px;
            font-weight: 500;
            width: 20%;
            height: 100%;
            transition: color 200ms, transform 150ms;
          }
          .snav-bottom-item:active {
            transform: scale(0.92);
          }
          .snav-bottom-item.active {
            color: #00b566;
          }
          body {
            padding-bottom: calc(60px + env(safe-area-inset-bottom, 0px)) !important;
          }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .snav-inner { padding: 0 24px !important; }
        }
        @media (max-width: 480px) {
          .snav-logo-text { font-size: 17px !important; }
          .snav-logo-wrap { gap: 4px !important; }
        }

        /* Mobile Search Overlay Styles */
        .snav-mobile-search-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #fefcf9;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          animation: slideInFromRight 220ms cubic-bezier(0.16, 1, 0.3, 1) both;
          font-family: 'Outfit', sans-serif;
        }
        @keyframes slideInFromRight {
          from { transform: translateX(100%); }
          to { transform: translate(0); }
        }
        .snav-mso-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-bottom: 1px solid rgba(0, 181, 102, 0.1);
          background: white;
        }
        .snav-mso-back {
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #1c1c1c;
          border-radius: 50%;
          transition: background 150ms;
        }
        .snav-mso-back:active {
          background: rgba(0, 181, 102, 0.08);
        }
        .snav-mso-input-wrapper {
          flex: 1;
          display: flex;
          align-items: center;
          background: #f4f2ee;
          border-radius: 99px;
          padding: 0 14px;
          height: 40px;
          position: relative;
        }
        .snav-mso-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          color: #1c1c1c;
          padding-left: 6px;
        }
        .snav-mso-clear {
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(28, 28, 28, 0.4);
          font-size: 12px;
          padding: 6px;
        }
        .snav-mso-content {
          flex: 1;
          overflow-y: auto;
          padding: 20px 16px;
        }
        .snav-mso-section-title {
          font-size: 12px;
          font-weight: 700;
          color: #7c7c7c;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .snav-mso-clear-history-btn {
          background: none;
          border: none;
          color: #dc2626;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          padding: 4px;
        }
        .snav-mso-history-list {
          display: flex;
          flex-direction: column;
          gap: 2px;
          margin-bottom: 24px;
        }
        .snav-mso-history-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 8px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.03);
          font-size: 14px;
          color: #1c1c1c;
          cursor: pointer;
        }
        .snav-mso-history-item:active {
          background: rgba(0, 0, 0, 0.02);
        }
        .snav-mso-history-text {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1;
        }
        .snav-mso-remove-item {
          background: none;
          border: none;
          color: rgba(0, 0, 0, 0.3);
          cursor: pointer;
          padding: 6px;
          font-size: 12px;
        }
        .snav-mso-popular-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 24px;
        }
        .snav-mso-pill {
          background: white;
          border: 1px solid rgba(0, 181, 102, 0.15);
          color: #1c1c1c;
          padding: 8px 14px;
          border-radius: 99px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .snav-mso-pill:active {
          background: rgba(0, 181, 102, 0.08);
        }
        .snav-mso-suggestions-list {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .snav-mso-suggestion-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 8px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.03);
          font-size: 14px;
          color: #1c1c1c;
          cursor: pointer;
        }
        .snav-mso-suggestion-item:active {
          background: rgba(0, 0, 0, 0.02);
        }
      `}</style>

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 48px", display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }} className="snav-inner">

        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "9px", textDecoration: "none" }} className="snav-logo-wrap">
          <LeafLogo />
          <span className="snav-logo-text" style={{ fontWeight: 700, fontSize: "20px", color: "#1c1c1c", letterSpacing: "-0.3px", transition: "font-size 200ms" }}>plant byst</span>
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
            <button onClick={() => {
              if (typeof window !== "undefined" && window.innerWidth <= 768) {
                setMobileSearchOpen(true);
              } else {
                setSearchOpen(v => !v);
              }
            }} aria-label="Search"
              style={{ width: "38px", height: "38px", borderRadius: "50px", border: "none", background: "transparent", cursor: "pointer", color: "#1c1c1c", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 200ms" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(0,181,102,0.08)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "transparent")}
            ><SearchIcon /></button>
          </div>

          {/* User - Navigate to profile or login */}
          <Link
            href="/login?returnTo=/profile"
            aria-label="Account"
            onClick={handleProfileClick}
            style={{ width: "38px", height: "38px", borderRadius: "50px", border: "none", background: "transparent", cursor: "pointer", color: "#1c1c1c", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 200ms" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "rgba(0,181,102,0.08)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "transparent")}
          >
            <UserIcon />
          </Link>

          {/* Cart */}
          <Link href="/cart" aria-label={`Cart, ${finalCartCount} item${finalCartCount !== 1 ? "s" : ""}`}
            style={{ position: "relative", width: "38px", height: "38px", borderRadius: "50px", border: "none", background: "transparent", cursor: "pointer", color: "#1c1c1c", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 200ms" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "rgba(0,181,102,0.08)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "transparent")}
          >
            <CartIcon />
            {finalCartCount > 0 && (
              <span style={{ position: "absolute", top: "3px", right: "3px", background: "#00b566", color: "white", fontSize: "9px", fontWeight: 700, width: "15px", height: "15px", borderRadius: "9999px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {finalCartCount > 9 ? "9+" : finalCartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Bottom navigation bar */}
      <div className="snav-bottom-bar">
        <Link href="/" className={`snav-bottom-item ${pathname === "/" ? "active" : ""}`}>
          <HomeIcon />
          <span>Home</span>
        </Link>
        <Link href="/categories/plants" className={`snav-bottom-item ${pathname === "/categories/plants" ? "active" : ""}`}>
          <PlantIcon />
          <span>Plants</span>
        </Link>
        <Link href="/ai-care" className={`snav-bottom-item ${pathname.startsWith("/ai-care") ? "active" : ""}`}>
          <RobotIcon />
          <span>AI Care</span>
        </Link>
        <button
          onClick={(e) => {
            e.preventDefault();
            setMobileSearchOpen(true);
          }}
          className={`snav-bottom-item ${pathname.startsWith("/search") ? "active" : ""}`}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
          <SearchIcon />
          <span>Search</span>
        </button>
        <Link href="/cart" className={`snav-bottom-item ${pathname.startsWith("/cart") ? "active" : ""}`}>
          <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            <CartIcon />
            {finalCartCount > 0 && (
              <span style={{ position: "absolute", top: "-6px", right: "-10px", background: "#00b566", color: "white", fontSize: "9px", fontWeight: 700, width: "15px", height: "15px", borderRadius: "9999px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {finalCartCount > 9 ? "9+" : finalCartCount}
              </span>
            )}
          </div>
          <span>Cart</span>
        </Link>
        <Link
          href="/login?returnTo=/profile"
          onClick={handleProfileClick}
          className={`snav-bottom-item ${pathname === "/profile" ? "active" : ""}`}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
          <UserIcon />
          <span>Profile</span>
        </Link>
      </div>

      {/* Mobile Search Preview Overlay */}
      {mobileSearchOpen && (
        <div className="snav-mobile-search-overlay">
          <div className="snav-mso-header">
            <button onClick={() => setMobileSearchOpen(false)} className="snav-mso-back" aria-label="Go back">
              <BackIcon />
            </button>
            <div className="snav-mso-input-wrapper">
              <SearchIcon />
              <input
                ref={mobileSearchInputRef}
                type="text"
                className="snav-mso-input"
                placeholder="Search plants, seeds, tools..."
                value={mobileSearchVal}
                onChange={(e) => setMobileSearchVal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && mobileSearchVal.trim()) {
                    executeMobileSearch(mobileSearchVal);
                  }
                }}
              />
              {mobileSearchVal && (
                <button onClick={() => setMobileSearchVal("")} className="snav-mso-clear" aria-label="Clear text">
                  ✕
                </button>
              )}
            </div>
          </div>
          <div className="snav-mso-content">
            {mobileSearchVal.trim() === "" ? (
              <>
                {/* Search History */}
                {searchHistory.length > 0 && (
                  <div style={{ marginBottom: "24px" }}>
                    <div className="snav-mso-section-title">
                      <span>Recent Searches</span>
                      <button onClick={clearAllHistory} className="snav-mso-clear-history-btn">
                        Clear All
                      </button>
                    </div>
                    <div className="snav-mso-history-list">
                      {searchHistory.map((item) => (
                        <div key={item} className="snav-mso-history-item" onClick={() => executeMobileSearch(item)}>
                          <div className="snav-mso-history-text">
                            <HistoryIcon />
                            <span>{item}</span>
                          </div>
                          <button onClick={(e) => removeHistoryItem(e, item)} className="snav-mso-remove-item" aria-label="Remove search history item">
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular Searches */}
                <div>
                  <div className="snav-mso-section-title">
                    <span>Popular Searches</span>
                  </div>
                  <div className="snav-mso-popular-pills">
                    {POPULAR_SEARCHES.map((item) => (
                      <button key={item} className="snav-mso-pill" onClick={() => executeMobileSearch(item)}>
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              /* Suggestions list */
              <div>
                <div className="snav-mso-section-title">
                  <span>Suggestions</span>
                </div>
                <div className="snav-mso-suggestions-list">
                  {filteredSuggestions.length > 0 ? (
                    filteredSuggestions.map((item) => (
                      <div key={item} className="snav-mso-suggestion-item" onClick={() => executeMobileSearch(item)}>
                        <SearchIcon />
                        <span>{item}</span>
                      </div>
                    ))
                  ) : (
                    <div className="snav-mso-suggestion-item" onClick={() => executeMobileSearch(mobileSearchVal)}>
                      <SearchIcon />
                      <span>Search for "{mobileSearchVal}"</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
