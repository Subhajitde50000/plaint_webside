"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import SharedNavbar from "@/components/Navbar";

/* ── Design Tokens ─────────────────────────────────────── */
const T = {
  bg: "#fefcf9",
  bgCard: "#FFFFFF",
  bgSection: "#f7f5f0",
  bgMuted: "#fbfaf7",
  green: "#00b566",
  greenMid: "#009952",
  greenPale: "rgba(0, 181, 102, 0.12)",
  greenLight: "rgba(0, 181, 102, 0.08)",
  heading: "#1c1c1c",
  body: "#333333",
  muted: "#7c7c7c",
  border: "rgba(0, 0, 0, 0.08)",
  borderGreen: "rgba(0, 181, 102, 0.16)",
  star: "#c8a84b",
  white: "#FFFFFF",
  red: "#dc2626",
  amber: "#d97706",
  blue: "#2563eb",
  shadow: "0 4px 20px rgba(0,0,0,0.04)",
  shadowHover: "0 8px 30px rgba(0, 181, 102, 0.08)",
  shadowBtn: "0 4px 14px rgba(0, 181, 102, 0.25)",
};

/* ── Mock Data ─────────────────────────────────────────── */
const MY_PLANTS = [
  { id: 1, name: "Monstera Deliciosa", pot: "White Ceramic", health: 92, water: "Tomorrow", light: "Bright indirect", img: "/monstera.png", badge: "Thriving" },
  { id: 2, name: 'Fern "Green Lady"', pot: "Terracotta", health: 78, water: "Today", light: "Medium indirect", img: "/fern-small.png", badge: "Needs Water" },
  { id: 3, name: "Peace Lily", pot: "Rattan Basket", health: 88, water: "In 2 days", light: "Low light", img: "/fern-medium.png", badge: "Healthy" },
  { id: 4, name: "Bird of Paradise", pot: "Black Geometric", health: 95, water: "In 3 days", light: "Full sun", img: "/fern-large.png", badge: "Thriving" },
  { id: 5, name: "Succulent Mix", pot: "Terracotta", health: 99, water: "In 7 days", light: "Direct sun", img: "/cat-succulents.png", badge: "Perfect" },
  { id: 6, name: "Balcony Blooms", pot: "White Minimalist", health: 82, water: "In 2 days", light: "Bright indirect", img: "/hero-balcony.png", badge: "Healthy" },
];

const ORDERS = [
  { id: "#PB-2847", date: "Jun 12, 2026", status: "Delivered", items: ['Monstera Deliciosa', "White Ceramic Pot"], total: 68.00, img: "/monstera.png" },
  { id: "#PB-2651", date: "May 28, 2026", status: "Delivered", items: ['Fern "Green Lady"', "Terracotta Pot"], total: 34.00, img: "/fern-small.png" },
  { id: "#PB-2390", date: "May 3, 2026", status: "Delivered", items: ["Watering Can Pro", "Plant Spray"], total: 29.50, img: "/watering-can.png" },
  { id: "#PB-2104", date: "Apr 10, 2026", status: "Cancelled", items: ["Premium Soil Mix", "Fertilizer Set"], total: 22.00, img: "/product-soil.png" },
];

const WISHLIST = [
  { id: 1, name: "Bird of Paradise", price: 55.00, rating: 4.8, reviews: 142, img: "/cat-balcony.png" },
  { id: 2, name: "Fiddle Leaf Fig", price: 48.00, rating: 4.6, reviews: 98, img: "/hero-flowers.png" },
  { id: 3, name: "Orchid Collection", price: 42.00, rating: 4.9, reviews: 213, img: "/cat-flowers.png" },
  { id: 4, name: "Indoor Palm", price: 38.00, rating: 4.7, reviews: 76, img: "/cat-indoor.png" },
];

const ACHIEVEMENTS = [
  { icon: "🌱", label: "First Plant", desc: "Added your first plant", unlocked: true },
  { icon: "💧", label: "Hydration Hero", desc: "Watered 30 days in a row", unlocked: true },
  { icon: "🌿", label: "Green Thumb", desc: "Own 5+ healthy plants", unlocked: true },
  { icon: "⭐", label: "Top Reviewer", desc: "Left 10 product reviews", unlocked: true },
  { icon: "🏆", label: "Plant Parent", desc: "1 year anniversary", unlocked: false },
  { icon: "🌸", label: "Rare Collector", desc: "Own a rare species", unlocked: false },
];

const ACTIVITY = [
  { icon: "💧", text: "Watered Monstera Deliciosa", time: "2 hours ago", color: "#2563eb" },
  { icon: "🛒", text: "Ordered Fern \"Green Lady\" + Terracotta Pot", time: "4 days ago", color: T.green },
  { icon: "⭐", text: "Reviewed Watering Can Pro — 5 stars", time: "1 week ago", color: T.star },
  { icon: "❤️", text: "Wishlisted Bird of Paradise", time: "2 weeks ago", color: T.red },
  { icon: "🌱", text: "Added Peace Lily to your garden", time: "3 weeks ago", color: T.greenMid },
  { icon: "🏆", text: "Earned \"Green Thumb\" achievement", time: "1 month ago", color: "#8b5cf6" },
];

/* ── SVG Icons ─────────────────────────────────────────── */
const EditIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const CameraIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

const WaterIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={T.blue} stroke="none">
    <path d="M12 2C12 2 5 10 5 15C5 18.87 8.13 22 12 22C15.87 22 19 18.87 19 15C19 10 12 2 12 2Z" />
  </svg>
);

const SunIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={T.amber}>
    <circle cx="12" cy="12" r="5" />
    {[[12,1,12,3],[12,21,12,23],[4.22,4.22,5.64,5.64],[18.36,18.36,19.78,19.78],[1,12,3,12],[21,12,23,12],[4.22,19.78,5.64,18.36],[18.36,5.64,19.78,4.22]].map(([x1,y1,x2,y2],i) => (
      <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={T.amber} strokeWidth="2" strokeLinecap="round" />
    ))}
  </svg>
);

const HeartIcon = ({ filled }: { filled?: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? T.red : "none"} stroke={filled ? T.red : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const BellIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

/* ── Health Bar ─────────────────────────────────────────── */
function HealthBar({ value }: { value: number }) {
  const color = value >= 90 ? T.green : value >= 75 ? T.amber : T.red;
  return (
    <div style={{ background: "rgba(0,0,0,0.08)", borderRadius: 99, height: 6, overflow: "hidden", flex: 1 }}>
      <div style={{ width: `${value}%`, height: "100%", background: color, borderRadius: 99, transition: "width 0.8s ease" }} />
    </div>
  );
}

/* ── Star Rating ────────────────────────────────────────── */
function Stars({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i <= Math.round(rating) ? T.star : "rgba(0,0,0,0.12)"}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

/* ── Saved Cards Sub-components ─────────────────────────── */
const SimChip = () => (
  <div style={{
    width: 38,
    height: 28,
    borderRadius: 6,
    background: "linear-gradient(135deg, #f3d078 0%, #dca842 100%)",
    position: "relative",
    overflow: "hidden",
    boxShadow: "inset 0 1px 2px rgba(255,255,255,0.4)"
  }}>
    <div style={{ position: "absolute", top: 0, bottom: 0, left: "30%", width: "1px", background: "rgba(0,0,0,0.15)" }} />
    <div style={{ position: "absolute", top: 0, bottom: 0, left: "70%", width: "1px", background: "rgba(0,0,0,0.15)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: "50%", height: "1px", background: "rgba(0,0,0,0.15)" }} />
  </div>
);

const VisaLogo = () => (
  <div style={{ color: "#ffffff", fontWeight: "bold", fontSize: 20, fontStyle: "italic", letterSpacing: "1px", fontFamily: "sans-serif", userSelect: "none" }}>
    VISA
  </div>
);

const MastercardLogo = () => (
  <div style={{ display: "flex", alignItems: "center", userSelect: "none" }}>
    <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#EB001B", marginRight: -8, opacity: 0.95 }} />
    <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#F79E1B", opacity: 0.9 }} />
  </div>
);

const AmexLogo = () => (
  <div style={{ background: "#016FD0", color: "#ffffff", fontWeight: "bold", fontSize: 11, padding: "4px 6px", borderRadius: 4, fontFamily: "sans-serif", userSelect: "none" }}>
    AMEX
  </div>
);

const DiscoverLogo = () => (
  <div style={{ color: "#FF6000", fontWeight: "bold", fontSize: 14, fontStyle: "italic", fontFamily: "sans-serif", userSelect: "none" }}>
    DISCOVER
  </div>
);

const CreditCard = ({ number, name, expiry, type, color, onDelete }: {
  number: string;
  name: string;
  expiry: string;
  type: string;
  color: string;
  onDelete?: () => void;
}) => {
  const renderLogo = () => {
    switch (type) {
      case "visa": return <VisaLogo />;
      case "mastercard": return <MastercardLogo />;
      case "amex": return <AmexLogo />;
      case "discover": return <DiscoverLogo />;
      default: return <VisaLogo />;
    }
  };

  return (
    <div style={{
      width: "100%",
      maxWidth: 350,
      height: 200,
      borderRadius: 16,
      background: color,
      padding: 22,
      color: "white",
      position: "relative",
      boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      overflow: "hidden",
      border: "1px solid rgba(255,255,255,0.12)",
      fontFamily: "'Outfit', sans-serif"
    }}>
      {/* Decorative radial glow */}
      <div style={{
        position: "absolute",
        top: "-25%",
        right: "-10%",
        width: 140,
        height: 140,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)",
        pointerEvents: "none"
      }} />

      {/* Top row: SIM Chip & Brand Logo */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <SimChip />
        {renderLogo()}
      </div>

      {/* Card Number */}
      <div style={{
        fontSize: 19,
        letterSpacing: "2.5px",
        fontFamily: "'Courier New', Courier, monospace",
        fontWeight: "bold",
        textShadow: "1px 1px 2px rgba(0,0,0,0.25)",
        margin: "18px 0 6px 0",
        whiteSpace: "nowrap"
      }}>
        {number || "•••• •••• •••• ••••"}
      </div>

      {/* Bottom row: Name, Expiry, Delete */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div style={{ minWidth: 0, flex: 1, marginRight: 12 }}>
          <p style={{ fontSize: 8, textTransform: "uppercase", letterSpacing: "1px", opacity: 0.65, marginBottom: 2 }}>Card Holder</p>
          <p style={{ fontSize: 12, fontWeight: "600", letterSpacing: "0.5px", textTransform: "uppercase", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {name || "Your Name"}
          </p>
        </div>
        
        <div style={{ flexShrink: 0, textAlign: "right", marginRight: onDelete ? 12 : 0 }}>
          <p style={{ fontSize: 8, textTransform: "uppercase", letterSpacing: "1px", opacity: 0.65, marginBottom: 2 }}>Expires</p>
          <p style={{ fontSize: 12, fontWeight: "600", fontFamily: "'Courier New', Courier, monospace" }}>
            {expiry || "MM/YY"}
          </p>
        </div>

        {onDelete && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            aria-label="Delete saved card"
            style={{
              background: "rgba(255,255,255,0.18)",
              border: "none",
              borderRadius: "50%",
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "background 0.2s, transform 0.1s",
              color: "white",
              flexShrink: 0
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239, 68, 68, 0.85)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.18)")}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════════════════ */
export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"garden"|"orders"|"wishlist"|"billing"|"settings">("garden");
  const [editMode, setEditMode] = useState(false);
  const [notifPref, setNotifPref] = useState({ water: true, orders: true, promo: false, tips: true });
  const [wishlistItems, setWishlistItems] = useState(WISHLIST.map(w => ({ ...w, saved: true })));
  const [userName, setUserName] = useState("Subhajit Ghosh");
  const [userBio, setUserBio] = useState("Plant parent of 6 🌿 | Nature lover | Always learning to grow");
  const [userLocation, setUserLocation] = useState("Kolkata, India");
  const [mounted, setMounted] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Saved Cards state
  const [savedCards, setSavedCards] = useState([
    { id: 1, number: "4532 7812 9012 4820", name: "Subhajit Ghosh", expiry: "12/29", type: "visa", color: "linear-gradient(135deg, #0b3f2c 0%, #009952 100%)" },
    { id: 2, number: "5412 8890 2314 9851", name: "Subhajit Ghosh", expiry: "06/28", type: "mastercard", color: "linear-gradient(135deg, #1e3a8a 0%, #6d28d9 100%)" },
  ]);

  // Form states for new card
  const [formNumber, setFormNumber] = useState("");
  const [formName, setFormName] = useState("");
  const [formExpiry, setFormExpiry] = useState("");
  const [formCvv, setFormCvv] = useState("");

  useEffect(() => { setTimeout(() => setMounted(true), 80); }, []);

  const TABS = [
    { key: "garden",   label: "My Garden",  icon: "🌿", count: MY_PLANTS.length },
    { key: "orders",   label: "Orders",     icon: "📦", count: ORDERS.length },
    { key: "wishlist", label: "Wishlist",   icon: "❤️",  count: WISHLIST.length },
    { key: "billing",  label: "Saved Cards", icon: "💳",  count: savedCards.length },
    { key: "settings", label: "Settings",   icon: "⚙️",  count: null },
  ] as const;

  // Auto detect card type based on number input
  const getCardType = (num: string) => {
    const clean = num.replace(/\D/g, "");
    if (clean.startsWith("4")) return "visa";
    if (clean.startsWith("5")) return "mastercard";
    if (clean.startsWith("3")) return "amex";
    if (clean.startsWith("6")) return "discover";
    return "visa";
  };

  // Card formatting handlers
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 16) val = val.substring(0, 16);
    let formatted = "";
    for (let i = 0; i < val.length; i++) {
      if (i > 0 && i % 4 === 0) formatted += " ";
      formatted += val[i];
    }
    setFormNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 4) val = val.substring(0, 4);
    let formatted = "";
    if (val.length > 2) {
      formatted = val.substring(0, 2) + "/" + val.substring(2);
    } else {
      formatted = val;
    }
    setFormExpiry(formatted);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 3) val = val.substring(0, 3);
    setFormCvv(val);
  };

  return (
    <div style={{ background: T.bg, minHeight: "100vh", fontFamily: "Outfit, sans-serif", paddingTop: "64px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,700;1,400;1,700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; color: inherit; }
        img { max-width: 100%; display: block; }
        button { cursor: pointer; }

        @keyframes fadeUp   { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
        @keyframes scaleIn  { from { opacity:0; transform:scale(0.93); } to { opacity:1; transform:scale(1); } }
        @keyframes slideDown{ from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes heartPop { 0%{transform:scale(1)} 40%{transform:scale(1.4)} 100%{transform:scale(1)} }
        @keyframes progressFill { from{width:0} }

        .profile-fade { animation: fadeUp .55s ease both; }
        .cover-fade   { animation: fadeIn .7s ease both; }
        .card-in      { animation: scaleIn .4s ease both; }

        .tab-btn {
          display:flex; align-items:center; gap:7px;
          padding:10px 22px; border-radius:9999px; border:none;
          font-family:'Outfit',sans-serif; font-weight:500; font-size:14px;
          cursor:pointer; transition:all .18s ease; position:relative;
          background:transparent; color:${T.muted};
          white-space:nowrap;
        }
        .tab-btn:hover { background:${T.greenLight}; color:${T.green}; }
        .tab-btn.active { background:${T.green}; color:#fff; box-shadow:${T.shadowBtn}; }

        .plant-card {
          background:${T.bgCard}; border-radius:16px; padding:16px;
          border:1px solid ${T.border}; transition:all .2s ease;
          display:flex; flex-direction:column; gap:12px;
        }
        .plant-card:hover { transform:translateY(-3px); box-shadow:${T.shadowHover}; border-color:${T.greenPale}; }

        .order-card {
          background:${T.bgCard}; border-radius:14px; padding:18px 20px;
          border:1px solid ${T.border}; display:flex; gap:16px;
          align-items:center; transition:all .18s ease;
        }
        .order-card:hover { box-shadow:${T.shadowHover}; border-color:${T.greenPale}; }

        .wish-card {
          background:${T.bgCard}; border-radius:16px; overflow:hidden;
          border:1px solid ${T.border}; transition:all .2s ease; cursor:pointer;
        }
        .wish-card:hover { transform:translateY(-4px); box-shadow:${T.shadowHover}; border-color:${T.greenPale}; }

        .setting-row {
          display:flex; justify-content:space-between; align-items:center;
          padding:16px 0; border-bottom:1px solid ${T.border};
        }
        .setting-row:last-child { border-bottom:none; }

        .toggle-track {
          width:44px; height:24px; border-radius:99px; border:none;
          cursor:pointer; transition:background .2s ease; position:relative; padding:0;
          flex-shrink:0;
        }
        .toggle-thumb {
          position:absolute; top:3px; width:18px; height:18px;
          border-radius:50%; background:white; transition:transform .2s ease;
          box-shadow:0 1px 4px rgba(0,0,0,.2);
        }

        .badge {
          display:inline-flex; align-items:center;
          padding:3px 10px; border-radius:9999px;
          font-family:'Outfit',sans-serif; font-weight:600; font-size:11px;
        }

        .stat-box {
          background:${T.bgCard}; border-radius:14px; padding:18px 20px;
          border:1px solid ${T.border}; text-align:center; flex:1;
          transition:all .18s ease;
        }
        .stat-box:hover { box-shadow:${T.shadowHover}; border-color:${T.greenPale}; transform:translateY(-2px); }

        .achievement-card {
          background:${T.bgCard}; border-radius:14px; padding:16px;
          border:1px solid ${T.border}; display:flex; align-items:center; gap:14px;
          transition:all .18s ease;
        }
        .achievement-card.unlocked { border-color:${T.greenPale}; }
        .achievement-card:hover { box-shadow:${T.shadowHover}; }

        .edit-input {
          width:100%; border:1.5px solid ${T.border}; border-radius:10px;
          padding:10px 14px; font-family:'Outfit',sans-serif; font-size:14px;
          color:${T.heading}; background:${T.bgMuted}; outline:none;
          transition:border-color .18s ease, background-color .18s ease;
        }
        .edit-input:focus { border-color:${T.green}; background:white; }

        .green-btn {
          background:${T.green}; color:white; border:none; border-radius:99px;
          font-family:'Outfit',sans-serif; font-weight:600; font-size:14px;
          padding:10px 24px; cursor:pointer; transition:all .18s ease;
          box-shadow:${T.shadowBtn};
        }
        .green-btn:hover { background:${T.greenMid}; transform:scale(1.03); }

        .outline-btn {
          background:transparent; color:${T.body}; border:1.5px solid ${T.border};
          border-radius:99px; font-family:'Outfit',sans-serif; font-weight:500;
          font-size:14px; padding:9px 20px; cursor:pointer; transition:all .18s ease;
        }
        .outline-btn:hover { border-color:${T.green}; color:${T.green}; }

        .nav-link { 
          font-family:'Outfit',sans-serif; font-size:13.5px; font-weight:400;
          color:${T.body}; transition:color .15s; padding-bottom:2px;
          border-bottom:2px solid transparent; transition:all .15s ease;
        }
        .nav-link:hover { color:${T.green}; border-bottom-color:${T.green}; }

        ::-webkit-scrollbar { width:4px; height:4px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:${T.greenPale}; border-radius:2px; }

        @media (max-width:768px) {
          .profile-hero-row { flex-direction:column !important; align-items:center !important; text-align:center !important; }
          .stats-row { grid-template-columns:repeat(2,1fr) !important; }
          .plants-grid { grid-template-columns:1fr !important; }
          .wish-grid { grid-template-columns:repeat(2,1fr) !important; }
          .tab-scroll { overflow-x:auto; padding-bottom:4px; }
          .tab-scroll::-webkit-scrollbar { display:none; }
          .cover-actions { right:12px !important; bottom:12px !important; }
          .main-pad { padding:0 16px !important; }
          .activity-row { flex-direction:column !important; gap:24px !important; }
          .billing-form-col { width:100% !important; }
        }
        @media (max-width:480px) {
          .wish-grid { grid-template-columns:1fr !important; }
          .tab-btn { padding:9px 14px !important; font-size:13px !important; }
        }
      `}</style>

      {/* ── Navbar ─────────────────────────────────────── */}
      <SharedNavbar cartCount={cartCount} />

      {/* ── Cover Photo ────────────────────────────────── */}
      <div className="cover-fade" style={{ position:"relative", height:240, background:`linear-gradient(135deg, #0b3f2c 0%, #009952 50%, #00b566 100%)`, overflow:"hidden" }}>
        {/* Decorative leaves */}
        {[
          { top:"10%", left:"5%", size:80, rotate:"-20deg", opacity:0.18 },
          { top:"20%", right:"8%", size:120, rotate:"30deg", opacity:0.14 },
          { bottom:"5%", left:"20%", size:60, rotate:"45deg", opacity:0.12 },
          { top:"5%", left:"40%", size:50, rotate:"-10deg", opacity:0.15 },
          { bottom:"10%", right:"25%", size:90, rotate:"-40deg", opacity:0.12 },
        ].map((s,i) => (
          <div key={i} style={{ position:"absolute", top:(s as any).top, left:(s as any).left, right:(s as any).right, bottom:(s as any).bottom, transform:`rotate(${s.rotate})`, opacity:s.opacity, pointerEvents:"none", fontSize:s.size }}>
            🍃
          </div>
        ))}

        {/* Subtle plant images */}
        <img src="/monstera.png" alt="" aria-hidden style={{ position:"absolute", right:60, bottom:0, height:220, opacity:0.22, objectFit:"contain", pointerEvents:"none" }} />
        <img src="/fern-large.png" alt="" aria-hidden style={{ position:"absolute", left:80, bottom:0, height:180, opacity:0.18, objectFit:"contain", pointerEvents:"none" }} />

        {/* Cover actions */}
        <div className="cover-actions" style={{ position:"absolute", right:24, bottom:20, display:"flex", gap:8 }}>
          <button style={{ display:"flex", alignItems:"center", gap:6, background:"rgba(255,255,255,0.18)", backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,0.3)", color:"white", borderRadius:9999, padding:"7px 14px", fontSize:12, fontFamily:"'Outfit',sans-serif", fontWeight:500, transition:"all .18s ease" }}
            onMouseEnter={e=>(e.currentTarget.style.background="rgba(255,255,255,0.28)")}
            onMouseLeave={e=>(e.currentTarget.style.background="rgba(255,255,255,0.18)")}>
            <CameraIcon /> Change Cover
          </button>
        </div>
      </div>

      {/* ── Profile Hero ────────────────────────────────── */}
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 48px" }} className="main-pad">
        <div className="profile-hero-row" style={{ display:"flex", alignItems:"flex-end", gap:24, marginTop:-50, marginBottom:32, position:"relative", zIndex:2 }}>
          {/* Avatar */}
          <div style={{ position:"relative", flexShrink:0 }}>
            <div style={{ width:100, height:100, borderRadius:"50%", background:`linear-gradient(135deg, ${T.green} 0%, ${T.greenMid} 100%)`, display:"flex", alignItems:"center", justifyContent:"center", border:`4px solid white`, boxShadow:"0 4px 20px rgba(0,0,0,0.15)" }}>
              <span style={{ fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontWeight:700, fontSize:34, color:"white", userSelect:"none" }}>SG</span>
            </div>
            <button aria-label="Change avatar" style={{ position:"absolute", bottom:2, right:2, width:28, height:28, borderRadius:"50%", background:T.green, border:"2px solid white", color:"white", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
              <CameraIcon />
            </button>
          </div>

          {/* Name + bio */}
          <div style={{ flex:1, paddingBottom:8 }}>
            {editMode ? (
              <div style={{ display:"flex", flexDirection:"column", gap:8, animation:"slideDown .25s ease" }}>
                <input className="edit-input" value={userName} onChange={e=>setUserName(e.target.value)} placeholder="Your name" style={{ fontSize:18, fontWeight:600, maxWidth:320 }} />
                <input className="edit-input" value={userBio} onChange={e=>setUserBio(e.target.value)} placeholder="Bio" />
                <input className="edit-input" value={userLocation} onChange={e=>setUserLocation(e.target.value)} placeholder="Location" style={{ maxWidth:220 }} />
              </div>
            ) : (
              <div className={mounted ? "profile-fade" : ""} style={{ animationDelay:".05s" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
                  <h1 style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontStyle:"italic", fontSize:28, color:T.heading }}>{userName}</h1>
                  <span className="badge" style={{ background: "rgba(0, 181, 102, 0.08)", color:T.green }}>🌿 Plant Parent</span>
                </div>
                <p style={{ fontSize:14, color:T.body, marginTop:4, marginBottom:6 }}>{userBio}</p>
                <p style={{ fontSize:13, color:T.muted, display:"flex", alignItems:"center", gap:5 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={T.muted} strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {userLocation}
                  <span style={{ color:"rgba(0,0,0,0.12)" }}>·</span>
                  <span>Member since Jan 2025</span>
                </p>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div style={{ display:"flex", gap:10, paddingBottom:8, flexShrink:0, flexWrap:"wrap" }}>
            {editMode ? (
              <>
                <button className="green-btn" onClick={()=>setEditMode(false)}>Save Changes</button>
                <button className="outline-btn" onClick={()=>setEditMode(false)}>Cancel</button>
              </>
            ) : (
              <>
                <button className="green-btn" style={{ display:"flex", alignItems:"center", gap:7 }} onClick={()=>setEditMode(true)}>
                  <EditIcon /> Edit Profile
                </button>
                <button className="outline-btn">Share Profile</button>
              </>
            )}
          </div>
        </div>

        {/* ── Stats Row ─────────────────────────────────── */}
        <div className="stats-row" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:32 }}>
          {[
            { label:"Plants Owned", value:"6", icon:"🌱", sub:"2 added this month" },
            { label:"Orders Placed", value:"4",  icon:"📦", sub:"Last order Jun 12" },
            { label:"Wishlist",      value:"4",  icon:"❤️",  sub:"3 in stock" },
            { label:"Plant Health",  value:"89%",icon:"💚", sub:"Avg across garden" },
          ].map((s,i) => (
            <div key={i} className={`stat-box${mounted?" card-in":""}`} style={{ animationDelay:`${i*0.07}s` }}>
              <div style={{ fontSize:28, marginBottom:6 }}>{s.icon}</div>
              <p style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:24, color:T.heading }}>{s.value}</p>
              <p style={{ fontFamily:"'Outfit',sans-serif", fontWeight:600, fontSize:13, color:T.body, marginBottom:3 }}>{s.label}</p>
              <p style={{ fontSize:12, color:T.muted }}>{s.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Tab Bar ───────────────────────────────────── */}
        <div className="tab-scroll" style={{ display:"flex", gap:6, marginBottom:28, background:T.bgCard, padding:6, borderRadius:99, width:"fit-content", border:`1px solid ${T.border}`, boxShadow:T.shadow }}>
          {TABS.map(t => (
            <button key={t.key} className={`tab-btn${activeTab===t.key?" active":""}`} onClick={()=>setActiveTab(t.key)}>
              <span>{t.icon}</span>
              {t.label}
              {t.count !== null && (
                <span style={{ background: activeTab===t.key ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.06)", color: activeTab===t.key ? "white" : T.muted, borderRadius:99, padding:"1px 8px", fontSize:11, fontWeight:700 }}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ═══ TAB CONTENT ═══════════════════════════════ */}

        {/* ── MY GARDEN ─────────────────────────────────── */}
        {activeTab === "garden" && (
          <div className={mounted ? "profile-fade" : ""} style={{ animationDelay:".1s" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <h2 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:18, color:T.heading }}>My Garden <span style={{ color:T.muted, fontWeight:400, fontSize:14 }}>— {MY_PLANTS.length} plants</span></h2>
              <button className="green-btn" style={{ fontSize:13, padding:"8px 18px" }}>+ Add Plant</button>
            </div>

            {/* Plants grid */}
            <div className="plants-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:18, marginBottom:40 }}>
              {MY_PLANTS.map((p,i) => (
                <div key={p.id} className={`plant-card${mounted?" card-in":""}`} style={{ animationDelay:`${i*0.06}s` }}>
                  {/* Image */}
                  <div style={{ position:"relative", borderRadius:12, overflow:"hidden", background:T.bgMuted, height:140 }}>
                    <img src={p.img} alt={p.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                    <span className="badge" style={{ position:"absolute", top:10, left:10, background: p.badge==="Thriving"||p.badge==="Perfect" ? "rgba(0,181,102,0.08)" : p.badge==="Needs Water" ? "#FEF3C7" : "#EFF6FF", color: p.badge==="Thriving"||p.badge==="Perfect" ? T.green : p.badge==="Needs Water" ? T.amber : T.blue, fontSize:10 }}>
                      {p.badge}
                    </span>
                  </div>
                  {/* Info */}
                  <div>
                    <p style={{ fontFamily:"'Outfit',sans-serif", fontWeight:600, fontSize:14, color:T.heading, marginBottom:2 }}>{p.name}</p>
                    <p style={{ fontSize:12, color:T.muted, marginBottom:10 }}>{p.pot}</p>
                    {/* Health */}
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                      <span style={{ fontSize:11, color:T.muted, width:44, flexShrink:0 }}>Health</span>
                      <HealthBar value={p.health} />
                      <span style={{ fontSize:11, fontFamily:"'Outfit',sans-serif", fontWeight:600, color: p.health>=90?T.green:p.health>=75?T.amber:T.red, width:30, textAlign:"right" }}>{p.health}%</span>
                    </div>
                    {/* Meta */}
                    <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                      <span style={{ display:"flex", alignItems:"center", gap:4, fontSize:11, color:T.muted }}>
                        <WaterIcon /> {p.water}
                      </span>
                      <span style={{ display:"flex", alignItems:"center", gap:4, fontSize:11, color:T.muted }}>
                        <SunIcon /> {p.light}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Activity + Achievements side by side ──── */}
            <div className="activity-row" style={{ display:"flex", gap:24, marginBottom:40 }}>
              {/* Recent Activity */}
              <div style={{ flex:1, background:T.bgCard, borderRadius:16, padding:24, border:`1px solid ${T.border}` }}>
                <h3 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:16, color:T.heading, marginBottom:18 }}>Recent Activity</h3>
                <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
                  {ACTIVITY.map((a,i) => (
                    <div key={i} style={{ display:"flex", gap:14, padding:"12px 0", borderBottom: i<ACTIVITY.length-1 ? `1px solid ${T.border}` : "none", alignItems:"flex-start" }}>
                      <div style={{ width:36, height:36, borderRadius:"50%", background:`${a.color}14`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>{a.icon}</div>
                      <div style={{ flex:1 }}>
                        <p style={{ fontSize:13, color:T.body, lineHeight:1.45 }}>{a.text}</p>
                        <p style={{ fontSize:11, color:T.muted, marginTop:3 }}>{a.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Achievements */}
              <div style={{ width:340, flexShrink:0, background:T.bgCard, borderRadius:16, padding:24, border:`1px solid ${T.border}` }}>
                <h3 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:16, color:T.heading, marginBottom:18 }}>
                  Achievements <span style={{ fontSize:12, color:T.muted, fontWeight:400 }}>4/6 unlocked</span>
                </h3>
                {/* Progress bar */}
                <div style={{ background:"rgba(0,0,0,0.08)", borderRadius:99, height:6, marginBottom:18, overflow:"hidden" }}>
                  <div style={{ width:"66%", height:"100%", background:`linear-gradient(90deg, ${T.green}, ${T.greenMid})`, borderRadius:99, animation:"progressFill .9s ease" }} />
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {ACHIEVEMENTS.map((a,i) => (
                    <div key={i} className={`achievement-card${a.unlocked?" unlocked":""}`} style={{ opacity: a.unlocked ? 1 : 0.45, filter: a.unlocked?"none":"grayscale(1)" }}>
                      <div style={{ width:40, height:40, borderRadius:10, background: a.unlocked ? "rgba(0, 181, 102, 0.08)" : T.bgMuted, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{a.icon}</div>
                      <div style={{ flex:1 }}>
                        <p style={{ fontFamily:"'Outfit',sans-serif", fontWeight:600, fontSize:13, color:T.heading }}>{a.label}</p>
                        <p style={{ fontSize:11, color:T.muted, marginTop:1 }}>{a.desc}</p>
                      </div>
                      {a.unlocked && <span style={{ fontSize:16, color:T.green }}>✓</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── ORDERS ────────────────────────────────────── */}
        {activeTab === "orders" && (
          <div className={mounted ? "profile-fade" : ""} style={{ animationDelay:".1s" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <h2 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:18, color:T.heading }}>Order History</h2>
              <select aria-label="Filter orders" style={{ border:`1px solid ${T.border}`, borderRadius:10, padding:"8px 14px", fontSize:13, fontFamily:"'Outfit',sans-serif", color:T.body, background:T.bgCard, outline:"none", cursor:"pointer" }}>
                <option>All Orders</option>
                <option>Delivered</option>
                <option>Cancelled</option>
              </select>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {ORDERS.map((o,i) => {
                const delivered = o.status === "Delivered";
                return (
                  <div key={o.id} className={`order-card${mounted?" card-in":""}`} style={{ animationDelay:`${i*0.07}s` }}>
                    <div style={{ width:64, height:64, borderRadius:12, overflow:"hidden", background:T.bgMuted, flexShrink:0 }}>
                      <img src={o.img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12 }}>
                        <div>
                          <p style={{ fontFamily:"'Outfit',sans-serif", fontWeight:600, fontSize:14, color:T.heading }}>{o.id}</p>
                          <p style={{ fontSize:12, color:T.muted, marginTop:2 }}>{o.date}</p>
                        </div>
                        <span className="badge" style={{ background: delivered ? "rgba(0, 181, 102, 0.08)" : "#FEF2F2", color: delivered ? T.green : T.red, flexShrink:0 }}>
                          {delivered ? "✓ " : "✕ "}{o.status}
                        </span>
                      </div>
                      <p style={{ fontSize:13, color:T.body, marginTop:8 }}>{o.items.join(" + ")}</p>
                    </div>
                    <div style={{ textAlign:"right", flexShrink:0 }}>
                      <p style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:16, color:T.heading }}>${o.total.toFixed(2)}</p>
                      {delivered && (
                        <button style={{ marginTop:8, background:"transparent", border:`1px solid ${T.border}`, borderRadius:8, padding:"5px 12px", fontSize:11, fontFamily:"'Outfit',sans-serif", color:T.body, cursor:"pointer", transition:"all .15s" }}
                          onMouseEnter={e=>{(e.currentTarget.style.borderColor=T.green);(e.currentTarget.style.color=T.green)}}
                          onMouseLeave={e=>{(e.currentTarget.style.borderColor=T.border);(e.currentTarget.style.color=T.body)}}>
                          Reorder
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order summary card */}
            <div style={{ marginTop:32, background:`linear-gradient(135deg, rgba(0, 181, 102, 0.04), rgba(0, 181, 102, 0.12))`, border:`1px solid ${T.greenPale}`, borderRadius:16, padding:24, display:"flex", gap:32, flexWrap:"wrap" }}>
              {[
                { label:"Total Spent",  value:"$153.50", icon:"💰" },
                { label:"Plants Bought",value:"5",       icon:"🌿" },
                { label:"Avg Order",    value:"$38.38",  icon:"📊" },
                { label:"Saved",        value:"$24.00",  icon:"🏷️" },
              ].map(s => (
                <div key={s.label} style={{ textAlign:"center", flex:1, minWidth:80 }}>
                  <p style={{ fontSize:24, marginBottom:4 }}>{s.icon}</p>
                  <p style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:20, color:T.heading }}>{s.value}</p>
                  <p style={{ fontSize:12, color:T.muted }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── WISHLIST ──────────────────────────────────── */}
        {activeTab === "wishlist" && (
          <div className={mounted ? "profile-fade" : ""} style={{ animationDelay:".1s" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <h2 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:18, color:T.heading }}>My Wishlist <span style={{ color:T.muted, fontWeight:400, fontSize:14 }}>— {wishlistItems.length} items</span></h2>
              <Link href="/plants/monstera" style={{ fontFamily:"'Outfit',sans-serif", fontSize:13, color:T.green, textDecoration:"underline" }}>Browse Plants →</Link>
            </div>
            <div className="wish-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:18 }}>
              {wishlistItems.map((item,i) => (
                <div key={item.id} className={`wish-card${mounted?" card-in":""}`} style={{ animationDelay:`${i*0.07}s` }}>
                  <div style={{ position:"relative", height:180 }}>
                    <img src={item.img} alt={item.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                    <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0, 0, 0, 0.4) 0%, transparent 50%)" }} />
                    <button
                      onClick={() => setWishlistItems(prev => prev.map(w => w.id===item.id ? {...w, saved:!w.saved} : w))}
                      style={{ position:"absolute", top:10, right:10, width:32, height:32, borderRadius:"50%", background:T.white, border:"none", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 2px 8px rgba(0,0,0,.15)", transition:"all .18s", animation: item.saved?"heartPop .35s ease":undefined, cursor:"pointer" }}
                    >
                      <HeartIcon filled={item.saved} />
                    </button>
                  </div>
                  <div style={{ padding:"14px 14px 16px" }}>
                    <p style={{ fontFamily:"'Outfit',sans-serif", fontWeight:600, fontSize:14, color:T.heading, marginBottom:5 }}>{item.name}</p>
                    <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:10 }}>
                      <Stars rating={item.rating} />
                      <span style={{ fontSize:11, color:T.muted }}>({item.reviews})</span>
                    </div>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <p style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:16, color:T.heading }}>${item.price.toFixed(2)}</p>
                      <button className="green-btn" style={{ fontSize:12, padding:"6px 14px" }} onClick={()=>setCartCount(c=>c+1)}>Add to Cart</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SAVED CARDS ────────────────────────────────── */}
        {activeTab === "billing" && (
          <div className={mounted ? "profile-fade" : ""} style={{ animationDelay:".1s" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
              <h2 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:18, color:T.heading }}>Saved Cards</h2>
            </div>
            
            <div style={{ display:"flex", gap:32, flexWrap:"wrap", alignItems:"flex-start" }}>
              {/* Left Side: Saved cards list */}
              <div style={{ flex: 1, minWidth: 320, display: "flex", flexDirection: "column", gap: 16 }}>
                <p style={{ fontSize: 13, color: T.muted, marginBottom: 4 }}>Your saved payment options for quick checkout:</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 18 }}>
                  {savedCards.map(card => (
                    <div key={card.id} className={mounted ? "card-in" : ""}>
                      <CreditCard
                        number={card.number}
                        name={card.name}
                        expiry={card.expiry}
                        type={card.type}
                        color={card.color}
                        onDelete={() => setSavedCards(prev => prev.filter(c => c.id !== card.id))}
                      />
                    </div>
                  ))}
                  {savedCards.length === 0 && (
                    <div style={{ gridColumn: "1/-1", border: `2px dashed ${T.border}`, borderRadius: 16, padding: "48px 24px", textAlign: "center", background: "rgba(0,0,0,0.01)" }}>
                      <p style={{ fontSize: 32, marginBottom: 8 }}>💳</p>
                      <p style={{ fontWeight: 600, fontSize: 15, color: T.heading, marginBottom: 4 }}>No Saved Cards</p>
                      <p style={{ fontSize: 13, color: T.muted }}>Add your first credit or debit card to get started.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side: Live preview + Form */}
              <div style={{ width: 360, flexShrink: 0, display: "flex", flexDirection: "column", gap: 20 }} className="billing-form-col">
                <div style={{ background: T.bgCard, borderRadius: 16, padding: 24, border: `1px solid ${T.border}`, boxShadow: T.shadow }}>
                  <h3 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 15, color: T.heading, marginBottom: 18 }}>Add New Card</h3>
                  
                  {/* Live preview credit card */}
                  <div style={{ marginBottom: 24, display: "flex", justifyContent: "center" }}>
                    <CreditCard
                      number={formNumber}
                      name={formName}
                      expiry={formExpiry}
                      type={getCardType(formNumber)}
                      color="linear-gradient(135deg, #1e293b 0%, #0f172a 100%)"
                    />
                  </div>

                  {/* Form */}
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (!formNumber || !formName || !formExpiry || !formCvv) return;
                    
                    const newCard = {
                      id: Date.now(),
                      number: formNumber,
                      name: formName,
                      expiry: formExpiry,
                      type: getCardType(formNumber),
                      color: savedCards.length % 2 === 0 
                        ? "linear-gradient(135deg, #0b3f2c 0%, #009952 100%)" 
                        : "linear-gradient(135deg, #1e3a8a 0%, #6d28d9 100%)"
                    };
                    
                    setSavedCards(prev => [...prev, newCard]);
                    // Reset form
                    setFormNumber("");
                    setFormName("");
                    setFormExpiry("");
                    setFormCvv("");
                  }} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <div>
                      <label style={{ fontSize: 11, fontFamily: "'Outfit',sans-serif", fontWeight: 600, color: T.muted, display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.5px" }}>Card Number</label>
                      <input className="edit-input" value={formNumber} onChange={handleNumberChange} placeholder="4111 2222 3333 4444" required />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontFamily: "'Outfit',sans-serif", fontWeight: 600, color: T.muted, display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.5px" }}>Cardholder Name</label>
                      <input className="edit-input" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="SUBHAJIT GHOSH" required style={{ textTransform: "uppercase" }} />
                    </div>
                    <div style={{ display: "flex", gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: 11, fontFamily: "'Outfit',sans-serif", fontWeight: 600, color: T.muted, display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.5px" }}>Expiry Date</label>
                        <input className="edit-input" value={formExpiry} onChange={handleExpiryChange} placeholder="MM/YY" required />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: 11, fontFamily: "'Outfit',sans-serif", fontWeight: 600, color: T.muted, display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.5px" }}>CVV</label>
                        <input className="edit-input" type="password" value={formCvv} onChange={handleCvvChange} placeholder="•••" required />
                      </div>
                    </div>
                    <button type="submit" className="green-btn" style={{ marginTop: 8, width: "100%", textAlign: "center", justifyContent: "center", display: "flex" }}>
                      Save Card
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── SETTINGS ──────────────────────────────────── */}
        {activeTab === "settings" && (
          <div className={mounted ? "profile-fade" : ""} style={{ animationDelay:".1s", display:"flex", gap:24, alignItems:"flex-start", flexWrap:"wrap" }}>
            {/* Left column */}
            <div style={{ flex:1, minWidth:280, display:"flex", flexDirection:"column", gap:20 }}>

              {/* Account Settings */}
              <div style={{ background:T.bgCard, borderRadius:16, padding:24, border:`1px solid ${T.border}` }}>
                <h3 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:15, color:T.heading, marginBottom:18, display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ width:32,height:32, background:T.greenLight, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", color:T.green }}><EditIcon /></span>
                  Account Information
                </h3>
                <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                  {[
                    { label:"Full Name", value:userName, type:"text" },
                    { label:"Email", value:"subhajit@email.com", type:"email" },
                    { label:"Phone", value:"+91 98765 43210", type:"tel" },
                    { label:"Location", value:userLocation, type:"text" },
                  ].map(f => (
                    <div key={f.label}>
                      <label style={{ fontSize:12, fontFamily:"'Outfit',sans-serif", fontWeight:500, color:T.muted, display:"block", marginBottom:5 }}>{f.label}</label>
                      <input className="edit-input" defaultValue={f.value} type={f.type} aria-label={f.label} />
                    </div>
                  ))}
                  <button className="green-btn" style={{ alignSelf:"flex-start", marginTop:4 }}>Save Changes</button>
                </div>
              </div>

              {/* Password */}
              <div style={{ background:T.bgCard, borderRadius:16, padding:24, border:`1px solid ${T.border}` }}>
                <h3 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:15, color:T.heading, marginBottom:18, display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ width:32,height:32, background:"#FEF3C720", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", color:T.amber }}><LockIcon /></span>
                  Change Password
                </h3>
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {["Current Password","New Password","Confirm Password"].map(l => (
                    <div key={l}>
                      <label style={{ fontSize:12, fontFamily:"'Outfit',sans-serif", fontWeight:500, color:T.muted, display:"block", marginBottom:5 }}>{l}</label>
                      <input className="edit-input" type="password" placeholder="••••••••" aria-label={l} />
                    </div>
                  ))}
                  <button className="green-btn" style={{ alignSelf:"flex-start", marginTop:4 }}>Update Password</button>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div style={{ width:340, flexShrink:0, display:"flex", flexDirection:"column", gap:20 }}>

              {/* Notifications */}
              <div style={{ background:T.bgCard, borderRadius:16, padding:24, border:`1px solid ${T.border}` }}>
                <h3 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:15, color:T.heading, marginBottom:18, display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ width:32,height:32, background:"#EFF6FF", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", color:T.blue }}><BellIcon /></span>
                  Notifications
                </h3>
                {[
                  { key:"water" as const, label:"Watering Reminders", desc:"Daily plant care alerts" },
                  { key:"orders" as const, label:"Order Updates", desc:"Shipping & delivery status" },
                  { key:"promo" as const, label:"Promotions", desc:"Deals & discount offers" },
                  { key:"tips" as const, label:"Plant Care Tips", desc:"Weekly growing advice" },
                ].map(n => (
                  <div key={n.key} className="setting-row">
                    <div>
                      <p style={{ fontSize:13, fontFamily:"'Outfit',sans-serif", fontWeight:500, color:T.heading }}>{n.label}</p>
                      <p style={{ fontSize:11, color:T.muted, marginTop:2 }}>{n.desc}</p>
                    </div>
                    <button
                      className="toggle-track"
                      style={{ background: notifPref[n.key] ? T.green : "rgba(0,0,0,0.12)" }}
                      onClick={() => setNotifPref(prev => ({ ...prev, [n.key]: !prev[n.key] }))}
                      aria-label={`Toggle ${n.label}`}
                      role="switch"
                      aria-checked={notifPref[n.key]}
                    >
                      <div className="toggle-thumb" style={{ transform: notifPref[n.key] ? "translateX(20px)" : "translateX(3px)" }} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Danger zone */}
              <div style={{ background:T.bgCard, borderRadius:16, padding:24, border:`1.5px solid #FEE2E2` }}>
                <h3 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:15, color:"#B91C1C", marginBottom:14 }}>Danger Zone</h3>
                <p style={{ fontSize:13, color:T.muted, marginBottom:16, lineHeight:1.55 }}>These actions are permanent and cannot be undone. Please be careful.</p>
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  <button style={{ background:"transparent", border:"1.5px solid #FCA5A5", color:"#DC2626", borderRadius:10, padding:"10px 16px", fontSize:13, fontFamily:"'Outfit',sans-serif", fontWeight:500, cursor:"pointer", textAlign:"left", transition:"all .18s" }}
                    onMouseEnter={e=>(e.currentTarget.style.background="#FEE2E2")}
                    onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                    Export My Data
                  </button>
                  <button style={{ background:"transparent", border:"1.5px solid #FCA5A5", color:"#DC2626", borderRadius:10, padding:"10px 16px", fontSize:13, fontFamily:"'Outfit',sans-serif", fontWeight:500, cursor:"pointer", textAlign:"left", transition:"all .18s" }}
                    onMouseEnter={e=>(e.currentTarget.style.background="#FEE2E2")}
                    onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                    Delete Account Permanently
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div style={{ height:64 }} />
      </div>

      {/* ── Chat FAB ─────────────────────────────────────── */}
      <button
        aria-label="Open chat support"
        style={{ position:"fixed", bottom:28, right:28, width:52, height:52, borderRadius:"50%", background:T.green, border:"none", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 16px rgba(0,0,0,.15)", zIndex:200, cursor:"pointer", transition:"all .18s ease" }}
        onMouseEnter={e=>{(e.currentTarget.style.transform="scale(1.1)");(e.currentTarget.style.boxShadow="0 6px 24px rgba(0,0,0,.25)")}}
        onMouseLeave={e=>{(e.currentTarget.style.transform="scale(1)");(e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,.15)")}}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>
    </div>
  );
}
