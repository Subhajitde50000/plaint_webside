"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import PlantDetailNavbar from "@/components/PlantDetailNavbar";
import CustomerReviewsAndFAQ from "@/components/CustomerReviewsAndFAQ";

/* ═══════════════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════════════ */
const T = {
  // Colors
  bg:       "#fefcf9",
  text:     "#1c1c1c",
  textInv:  "#212326",
  white:    "#ffffff",
  green:    "#00b566",
  greenDk:  "#009952",
  // Radius
  xs:   "4px",
  sm:   "8px",
  md:   "12px",
  lg:   "16px",
  xl:   "20px",
  r2xl: "24px",
  pill: "9999px",
  fab:  "50px",
  // Shadows
  s2: "rgb(202, 223, 212) 0px 0px 0px 1px inset",
  s3: "rgb(212, 212, 212) 0px 0px 0px 1px inset",
  s4: "rgb(0, 146, 82) 0px 0px 0px 1px inset",
  // Motion
  fast:   "250ms",
  normal: "300ms",
  slow:   "500ms",
  instant:"200ms",
};

/* ═══════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════ */
const SIZES = [
  { label: "Small",  price: 15 },
  { label: "Medium", price: 25 },
  { label: "Large",  price: 35 },
];

const IMAGES = [
  { src: "/fern-small.png",  alt: "Red Anthurium Plant — front view" },
  { src: "/fern-medium.png", alt: "Red Anthurium Plant — side view" },
  { src: "/fern-large.png",  alt: "Red Anthurium Plant — full view" },
];

const POTS = [
  { id: "terracotta", name: "Normal",           tint: "rgba(193,120,72,0.22)",  rim: "#C17848", emoji: "🪴" },
  { id: "white",      name: "White Minimalist", tint: "rgba(230,228,220,0.28)", rim: "#DDDBD0", emoji: "⬜", star: true },
  { id: "vorite-w",   name: "Vorite Door",      tint: "rgba(215,205,190,0.28)", rim: "#C8BAA0", emoji: "🏺" },
  { id: "vorite-b",   name: "Vorite Dark",      tint: "rgba(32,32,32,0.28)",    rim: "#444",    emoji: "⬛" },
  { id: "woven",      name: "Woven Basket",     tint: "rgba(180,145,70,0.24)",  rim: "#B89050", emoji: "🧺" },
  { id: "ceramic",    name: "Phnte Sear",        tint: "rgba(230,220,210,0.26)", rim: "#C8BFB2", emoji: "🫙" },
  { id: "orange",     name: "Boat Dan",          tint: "rgba(210,105,45,0.24)", rim: "#D06030", emoji: "🪴" },
];

const POT_TABS = ["Normal", "Normies", "Varieties"];

const CARE_DATA = [
  { icon: "☀️", label: "Light",       value: "Bright Indirect",      detail: "Avoid direct sunlight. An east or north-facing window with filtered light is ideal for lush growth." },
  { icon: "💧", label: "Water",       value: "Twice a Week",         detail: "Keep the soil consistently moist. Water when the top inch feels dry. Never allow the pot to sit in standing water." },
  { icon: "🌡️", label: "Temperature", value: "65–80 °F (18–27 °C)", detail: "Thrives in warm, stable environments. Avoid cold drafts, air vents, and temperatures below 55 °F." },
  { icon: "💦", label: "Humidity",    value: "High (60–80%)",        detail: "Mist leaves regularly or use a pebble tray with water. A humidifier works best during dry winters." },
  { icon: "🌱", label: "Soil",        value: "Rich & Well-Draining", detail: "Use a mix of peat, perlite, and bark for excellent drainage. Slightly acidic pH of 5.5–6.5 is optimal." },
  { icon: "🪴", label: "Fertilizer",  value: "Monthly (Spring–Fall)","detail": "Apply a balanced liquid fertilizer diluted to half strength every 4 weeks during the growing season." },
  { icon: "✂️", label: "Pruning",     value: "As Needed",            detail: "Remove yellowing or damaged leaves at the base to redirect energy to healthy growth and new blooms." },
  { icon: "🐾", label: "Pet Safe",    value: "Mild Toxicity ⚠️",    detail: "Red Anthurium contains calcium oxalate crystals — keep away from pets and small children who might chew on it." },
];

const PLANT_FACTS = [
  ["Scientific Name", "Anthurium andraeanum"],
  ["Origin",          "Colombia & Ecuador"],
  ["Growth Rate",     "Moderate"],
  ["Bloom Season",    "Year-round indoors"],
  ["Mature Size",     "Up to 2 ft height"],
  ["Air Purifying",   "Yes — NASA listed ✓"],
];

const RELATED = [
  { name: "Monstera Deliciosa", price: 45, img: "/monstera.png" },
  { name: "Indoor Snake Plant",  price: 32, img: "/cat-indoor.png" },
  { name: "Balcony Flowers",     price: 28, img: "/cat-balcony.png" },
  { name: "Wildflower Mix",      price: 18, img: "/cat-flowers.png" },
  { name: "Succulent Set",       price: 24, img: "/cat-succulents.png" },
];

/* ═══════════════════════════════════════════════════
   SVG ICONS
═══════════════════════════════════════════════════ */
const Heart = ({ filled }: { filled: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? T.green : "none"} stroke={filled ? T.green : "currentColor"} strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const MagnifyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    <line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
  </svg>
);
const ChatBubble = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
const Truck = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="3" width="15" height="13" rx="1" /><path d="M16 8h4l3 3v5h-7V8z" />
    <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);
const CartIco = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);
const ChevL = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
);
const ChevR = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
);
const LeafLogo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M12 2C12 2 4 5 4 13C4 17.4 7.6 21 12 21C16.4 21 20 17.4 20 13C20 5 12 2 12 2Z" fill={T.green} />
    <path d="M12 21V10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M12 15L8 11" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M12 12L16 8" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);
const Star = ({ filled }: { filled: boolean }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill={filled ? "#c8a84b" : "rgba(28,28,28,0.25)"} stroke="none">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

/* ═══════════════════════════════════════════════════
   LIGHTBOX
═══════════════════════════════════════════════════ */
function Lightbox({ src, alt, onClose, triggerRef }: { src: string; alt: string; onClose: () => void; triggerRef: React.RefObject<HTMLButtonElement | null> }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { onClose(); triggerRef.current?.focus(); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, triggerRef]);

  return (
    <div
      role="dialog" aria-modal="true" aria-label="Product image zoom"
      onClick={() => { onClose(); triggerRef.current?.focus(); }}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", animation: `lbIn ${T.slow} ease both` }}
    >
      <div onClick={(e) => e.stopPropagation()} style={{ position: "relative", maxWidth: "90vw", maxHeight: "90vh" }}>
        <Image src={src} alt={alt} width={800} height={800} sizes="90vw" style={{ objectFit: "contain", borderRadius: T.md, maxWidth: "90vw", maxHeight: "90vh", width: "auto", height: "auto" }} />
        <button
          ref={closeRef}
          onClick={() => { onClose(); triggerRef.current?.focus(); }}
          aria-label="Close image zoom"
          style={{ position: "absolute", top: "12px", right: "12px", background: "rgba(255,255,255,0.15)", border: "none", borderRadius: T.fab, width: "36px", height: "36px", cursor: "pointer", color: "white", fontSize: "20px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", outline: "none" }}
          onFocus={(e) => (e.currentTarget.style.outline = `2px solid ${T.green}`)}
          onBlur={(e) => (e.currentTarget.style.outline = "none")}
        >×</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   POT COMPOSITE PREVIEW
═══════════════════════════════════════════════════ */
function PotPreview({ src, alt, pot, fading }: { src: string; alt: string; pot: typeof POTS[0]; fading: boolean }) {
  return (
    <div style={{ position: "absolute", inset: 0, opacity: fading ? 0 : 1, transform: fading ? "scale(0.97)" : "scale(1)", transition: `opacity ${T.fast} ease, transform ${T.fast} ease` }}>
      <Image src={src} alt={alt} fill sizes="(max-width:768px) 100vw, 50vw" style={{ objectFit: "cover" }} priority />
      {/* Pot tint radial overlay at bottom */}
      <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "55%", height: "42%", background: `radial-gradient(ellipse at 50% 25%, ${pot.tint}, transparent 70%)`, borderRadius: "50% 50% 40% 40% / 30% 30% 70% 70%", pointerEvents: "none" }} />
      {/* Pot rim */}
      <div style={{ position: "absolute", bottom: "40%", left: "50%", transform: "translateX(-50%)", width: "42%", height: "5px", background: pot.rim, borderRadius: "50%", opacity: 0.4, pointerEvents: "none" }} />
      {/* Pot label badge */}
      <div style={{ position: "absolute", bottom: "8px", left: "50%", transform: "translateX(-50%)", background: "rgba(254,252,249,0.92)", backdropFilter: "blur(8px)", borderRadius: T.pill, padding: "4px 14px", fontSize: "11px", fontWeight: 600, color: T.green, whiteSpace: "nowrap", boxShadow: T.s4, letterSpacing: "0.3px" }}>
        {pot.emoji} {pot.name}
      </div>
    </div>
  );
}



/* ═══════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════ */
export default function PlantDetailPage() {
  const [activeImg,     setActiveImg]     = useState(0);
  const [selectedSize,  setSelectedSize]  = useState(0);
  const [selectedPot,   setSelectedPot]   = useState(1);
  const [activePotTab,  setActivePotTab]  = useState(0);
  const [qty,           setQty]           = useState(1);
  const [wishlisted,    setWishlisted]    = useState(false);
  const [cartCount,     setCartCount]     = useState(1);
  const [lightbox,      setLightbox]      = useState(false);
  const [imgFading,     setImgFading]     = useState(false);
  const [cartState,     setCartState]     = useState<"idle"|"loading"|"success">("idle");
  const [descExpanded,  setDescExpanded]  = useState(false);
  const [activeRelDot,  setActiveRelDot]  = useState(0);

  const zoomRef    = useRef<HTMLButtonElement>(null);
  const potScrollRef = useRef<HTMLDivElement>(null);
  const relScrollRef = useRef<HTMLDivElement>(null);

  const crossfade = useCallback((fn: () => void) => {
    setImgFading(true);
    setTimeout(() => { fn(); setImgFading(false); }, 270);
  }, []);

  const selectImg  = (i: number) => crossfade(() => setActiveImg(i));
  const selectSize = (i: number) => { if (i !== selectedSize) crossfade(() => setSelectedSize(i)); };
  const selectPot  = (i: number) => { if (i !== selectedPot) crossfade(() => setSelectedPot(i)); };

  const addToCart = () => {
    setCartState("loading");
    setTimeout(() => {
      setCartCount(c => c + qty);
      setCartState("success");
      setTimeout(() => setCartState("idle"), 1800);
    }, 900);
  };

  const buyNow = () => {
    const params = new URLSearchParams({
      buyNow: "true",
      name: "Red Anthurium Plant",
      price: String(price),
      qty: String(qty),
      size: SIZES[selectedSize].label,
      pot: pot.name,
      img: IMAGES[0].src
    });
    window.location.href = `/checkout?${params.toString()}`;
  };

  const price   = SIZES[selectedSize].price;
  const pot     = POTS[selectedPot];
  const imgSrc  = IMAGES[activeImg].src;
  const imgAlt  = `Red Anthurium Plant — ${SIZES[selectedSize].label} size, ${pot.name} pot`;

  /* ── Shared interactive button style helpers ── */
  const iconBtn = (extra?: React.CSSProperties): React.CSSProperties => ({
    width: "36px", height: "36px", borderRadius: T.fab, border: "none",
    background: "rgba(254,252,249,0.9)", backdropFilter: "blur(6px)",
    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
    color: T.text, transition: `transform ${T.instant}, background ${T.instant}`,
    outline: "none", ...extra,
  });

  return (
    <div style={{ background: T.bg, minHeight: "100vh", fontFamily: "Outfit, sans-serif", color: T.text }}>
      {/* Google Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

        @keyframes lbIn    { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }
        @keyframes fabPulse { 0%,100%{box-shadow:0 0 0 0 rgba(0,181,102,0.4)} 50%{box-shadow:0 0 0 10px rgba(0,181,102,0)} }
        @keyframes shimmer  { from { background-position: -200% 0; } to { background-position: 200% 0; } }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :focus-visible { outline: 2px solid #00b566 !important; outline-offset: 2px !important; }

        ::-webkit-scrollbar { display: none; }

        .hero-grid      { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: start; }
        .pot-grid       { display: grid; grid-template-columns: 1fr 220px; gap: 28px; align-items: start; }
        .facts-grid     { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .seasons-grid   { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
        .care-grid      { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }

        @media (max-width: 1023px) {
          .hero-grid  { grid-template-columns: 1fr !important; gap: 32px !important; }
          .pot-grid   { grid-template-columns: 1fr !important; }
          .facts-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 767px) {
          .pd-wrap    { padding: 0 16px !important; }
          .hero-grid  { gap: 24px !important; }
          .seasons-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 479px) {
          .seasons-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <PlantDetailNavbar cartCount={cartCount} />

      {lightbox && <Lightbox src={imgSrc} alt={imgAlt} onClose={() => setLightbox(false)} triggerRef={zoomRef} />}

      <main id="main-content" style={{ paddingBottom: "80px" }}>

        {/* ── BREADCRUMB ── */}
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px 48px 0" }} className="pd-wrap">
          <nav aria-label="Breadcrumb">
            <ol style={{ listStyle: "none", display: "flex", gap: "6px", alignItems: "center", fontFamily: "Outfit, sans-serif", fontSize: "13px", fontWeight: 400, color: T.textInv }}>
              <li><Link href="/" style={{ color: T.textInv, textDecoration: "none" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.textDecoration = "underline")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.textDecoration = "none")}
              >Home</Link></li>
              <li aria-hidden>/</li>
              <li aria-current="page" style={{ color: T.text, fontWeight: 500 }}>Red Anthurium Plant</li>
            </ol>
          </nav>
        </div>

        {/* ════════════════════════════════════════════
            PRODUCT HERO — 2-column grid
        ════════════════════════════════════════════ */}
        <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px 48px 56px" }} className="pd-wrap">
          <div className="hero-grid">

            {/* ── LEFT: Image Gallery ── */}
            <div style={{ animation: "lbIn 0.5s ease both" }}>
              {/* Viewing-in badge */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                <span style={{ fontSize: "12px", color: "rgba(28,28,28,0.55)" }}>Viewing in:</span>
                <span style={{ fontSize: "12px", fontWeight: 600, color: T.green, background: `${T.green}12`, borderRadius: T.pill, padding: "2px 10px", boxShadow: T.s4 }}>
                  {pot.emoji} {pot.name}
                </span>
              </div>

              {/* Main image */}
              <div style={{ position: "relative", borderRadius: T.r2xl, aspectRatio: "1/1", background: "#f5f0e8", boxShadow: T.s2, overflow: "hidden" }}>
                <PotPreview src={imgSrc} alt={imgAlt} pot={pot} fading={imgFading} />

                {/* Wishlist */}
                <button
                  aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  aria-pressed={wishlisted}
                  onClick={() => setWishlisted(v => !v)}
                  style={{ ...iconBtn({ position: "absolute", top: "14px", right: "14px", zIndex: 10, color: wishlisted ? T.green : T.text }) }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "scale(1.1)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "scale(1)")}
                ><Heart filled={wishlisted} /></button>

                {/* Zoom */}
                <button
                  ref={zoomRef}
                  aria-label="Zoom image"
                  onClick={() => setLightbox(true)}
                  style={{ ...iconBtn({ position: "absolute", bottom: "14px", right: "14px", zIndex: 10 }) }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "scale(1.1)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "scale(1)")}
                ><MagnifyIcon /></button>
              </div>

              {/* Thumbnail strip */}
              <div role="tablist" aria-label="Product thumbnails" style={{ display: "flex", gap: "10px", marginTop: "14px" }}>
                {IMAGES.map((img, i) => (
                  <button
                    key={i}
                    id={`thumb-${i}`}
                    role="tab"
                    aria-selected={activeImg === i}
                    aria-controls="main-product-image"
                    onClick={() => selectImg(i)}
                    style={{
                      width: "80px", height: "80px", borderRadius: T.xl, border: "none", padding: 0,
                      boxShadow: activeImg === i ? T.s4 : T.s2,
                      background: "#f0ece2", cursor: "pointer", overflow: "hidden",
                      position: "relative", flexShrink: 0,
                      transform: activeImg === i ? "scale(1.04)" : "scale(1)",
                      transition: `transform ${T.instant}, box-shadow ${T.instant}`,
                      outline: "none",
                    }}
                    onFocus={(e) => (e.currentTarget.style.outline = `2px solid ${T.green}`)}
                    onBlur={(e) => (e.currentTarget.style.outline = "none")}
                    onMouseEnter={(e) => { if (activeImg !== i) (e.currentTarget as HTMLButtonElement).style.boxShadow = T.s3; }}
                    onMouseLeave={(e) => { if (activeImg !== i) (e.currentTarget as HTMLButtonElement).style.boxShadow = T.s2; }}
                  >
                    <Image src={img.src} alt={img.alt} fill sizes="80px" style={{ objectFit: "cover" }} />
                  </button>
                ))}
              </div>

              {/* Dot indicators */}
              <div style={{ display: "flex", justifyContent: "center", gap: "7px", marginTop: "14px" }}>
                {IMAGES.map((_, i) => (
                  <button key={i} onClick={() => selectImg(i)} aria-label={`View image ${i + 1}`}
                    style={{ width: activeImg === i ? "24px" : "8px", height: "8px", borderRadius: T.pill, background: activeImg === i ? T.green : "rgba(28,28,28,0.25)", border: "none", cursor: "pointer", transition: `width ${T.fast}, background ${T.fast}`, padding: 0, outline: "none" }}
                    onFocus={(e) => (e.currentTarget.style.outline = `2px solid ${T.green}`)}
                    onBlur={(e) => (e.currentTarget.style.outline = "none")}
                  />
                ))}
              </div>
            </div>

            {/* ── RIGHT: Product Info ── */}
            <div style={{ paddingTop: "4px" }}>
              {/* Category eyebrow */}
              <p style={{ fontSize: "13px", fontWeight: 400, color: "rgba(28,28,28,0.6)", marginBottom: "6px" }}>PC Mentghe</p>

              {/* Product title */}
              <h1 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 600, fontSize: "clamp(28px, 3.5vw, 40px)", color: T.text, lineHeight: 1.15, marginBottom: "16px" }}>
                Red Anthurium Plant
              </h1>

              {/* Description */}
              <div style={{ marginBottom: "20px" }}>
                <p style={{ fontWeight: 600, fontSize: "15px", color: T.text, marginBottom: "8px" }}>Description</p>
                <div style={{ height: "1px", background: `rgba(28,28,28,0.1)`, marginBottom: "10px" }} />
                <p style={{
                  fontSize: "14px", fontWeight: 400, color: `rgba(28,28,28,0.85)`, lineHeight: "22.4px",
                  display: "-webkit-box", WebkitLineClamp: descExpanded ? "unset" : 3, WebkitBoxOrient: "vertical",
                  overflow: descExpanded ? "visible" : "hidden"
                }}>
                  The Red Anthurium is one of the most striking tropical houseplants, known for its glossy, heart-shaped blooms that emerge in vivid scarlet and last for months. Native to Colombia and Ecuador, it thrives in warm, humid environments with bright, filtered light — making it a stunning focal piece for living rooms, offices, and conservatories. Beyond its beauty, it actively purifies indoor air.
                </p>
                <button
                  aria-expanded={descExpanded}
                  onClick={() => setDescExpanded(v => !v)}
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: "14px", color: T.green, padding: 0, marginTop: "4px", fontFamily: "Outfit, sans-serif", fontWeight: 400, textDecoration: "underline", textUnderlineOffset: "2px" }}
                >{descExpanded ? "Show less" : "Learn more."}</button>
              </div>

              {/* Price & Rating */}
              <div style={{ marginBottom: "6px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: "15px", fontWeight: 400, color: T.text }}>Price</span>
                  <span style={{ fontSize: "32px", fontWeight: 700, color: T.text, transition: `opacity ${T.normal}` }} aria-live="polite" aria-atomic="true">
                    ${price}.00
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "6px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }} aria-label="4 out of 5 stars, 30 reviews">
                    {[1,2,3,4,5].map(s => <Star key={s} filled={s <= 4} />)}
                    <span style={{ fontSize: "13px", color: "rgba(28,28,28,0.7)", marginLeft: "5px" }}>(30 reviews)</span>
                  </div>
                  <span style={{ fontSize: "15px", color: "rgba(28,28,28,0.6)" }}>+ Premium $45.00</span>
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: "1px", background: `rgba(28,28,28,0.1)`, margin: "16px 0" }} />

              {/* Size selector */}
              <div style={{ marginBottom: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <p style={{ fontWeight: 600, fontSize: "15px", color: T.text }}>Select Size</p>
                  <a href="#" style={{ fontSize: "15px", color: T.green, textDecoration: "none" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.textDecoration = "underline")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.textDecoration = "none")}
                  >See All</a>
                </div>
                <div role="radiogroup" aria-label="Select plant size" style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {SIZES.map((sz, i) => {
                    const active = selectedSize === i;
                    return (
                      <button
                        key={sz.label}
                        id={`size-${sz.label.toLowerCase()}`}
                        role="radio"
                        aria-checked={active}
                        onClick={() => selectSize(i)}
                        style={{
                          minWidth: "88px", height: "44px",
                          borderRadius: T.lg, border: "none",
                          background: active ? T.green : T.bg,
                          color: active ? T.white : T.text,
                          fontFamily: "Outfit, sans-serif", fontWeight: 500, fontSize: "15px",
                          cursor: "pointer",
                          boxShadow: active ? T.s4 : T.s3,
                          transition: `all ${T.instant}`,
                          outline: "none",
                          padding: "0 18px",
                        }}
                        onMouseEnter={(e) => { if (!active) { (e.currentTarget as HTMLButtonElement).style.background = `${T.green}12`; (e.currentTarget as HTMLButtonElement).style.boxShadow = T.s4; } }}
                        onMouseLeave={(e) => { if (!active) { (e.currentTarget as HTMLButtonElement).style.background = T.bg; (e.currentTarget as HTMLButtonElement).style.boxShadow = T.s3; } }}
                        onFocus={(e) => (e.currentTarget.style.outline = `2px solid ${T.green}`)}
                        onBlur={(e) => (e.currentTarget.style.outline = "none")}
                      >{sz.label}</button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity + Add to Cart */}
              <div style={{ display: "flex", gap: "14px", alignItems: "center", marginBottom: "16px", flexWrap: "wrap" }}>
                {/* Stepper */}
                <div style={{ display: "inline-flex", alignItems: "center", boxShadow: T.s3, borderRadius: T.pill, background: T.bg, height: "52px", minWidth: "120px", overflow: "hidden" }}>
                  <button id="qty-minus" aria-label="Decrease quantity"
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    disabled={qty <= 1}
                    style={{ width: "44px", height: "52px", border: "none", background: "none", cursor: qty <= 1 ? "not-allowed" : "pointer", color: qty <= 1 ? "rgba(28,28,28,0.3)" : T.green, fontSize: "22px", fontWeight: 300, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Outfit, sans-serif", outline: "none" }}
                    onFocus={(e) => (e.currentTarget.style.outline = `2px solid ${T.green}`)}
                    onBlur={(e) => (e.currentTarget.style.outline = "none")}
                  >−</button>
                  <span aria-live="polite" aria-label={`Quantity: ${qty}`} style={{ flex: 1, textAlign: "center", fontWeight: 600, fontSize: "16px", color: T.text, userSelect: "none" }}>{qty}</span>
                  <button id="qty-plus" aria-label="Increase quantity"
                    onClick={() => setQty(q => q + 1)}
                    style={{ width: "44px", height: "52px", border: "none", background: "none", cursor: "pointer", color: T.green, fontSize: "22px", fontWeight: 300, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Outfit, sans-serif", outline: "none" }}
                    onFocus={(e) => (e.currentTarget.style.outline = `2px solid ${T.green}`)}
                    onBlur={(e) => (e.currentTarget.style.outline = "none")}
                  >+</button>
                </div>

                {/* CTA */}
                <button id="add-to-cart-btn"
                  aria-busy={cartState === "loading"}
                  onClick={addToCart}
                  disabled={cartState === "loading"}
                  style={{
                    flex: 1, minWidth: "160px", height: "52px", borderRadius: T.pill, border: "none",
                    background: cartState === "success" ? T.greenDk : T.green,
                    color: T.white, fontFamily: "Outfit, sans-serif", fontWeight: 600, fontSize: "16px",
                    cursor: cartState === "loading" ? "wait" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                    transition: `background ${T.instant}, transform ${T.instant}`,
                    outline: "none",
                  }}
                  onMouseEnter={(e) => { if (cartState === "idle") (e.currentTarget as HTMLButtonElement).style.background = T.greenDk; }}
                  onMouseLeave={(e) => { if (cartState === "idle") (e.currentTarget as HTMLButtonElement).style.background = T.green; }}
                  onMouseDown={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98)")}
                  onMouseUp={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "scale(1)")}
                  onFocus={(e) => (e.currentTarget.style.outline = `2px solid ${T.text}`)}
                  onBlur={(e) => (e.currentTarget.style.outline = "none")}
                >
                  {cartState === "loading" && <span style={{ width: "18px", height: "18px", border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />}
                  {cartState === "success" ? "Added to Cart ✓" : cartState === "loading" ? "Adding…" : <><CartIco /> Add to Cart</>}
                </button>
              </div>

              {/* Buy Now Button */}
              <button id="buy-now-btn"
                onClick={buyNow}
                style={{
                  width: "100%", height: "52px", borderRadius: T.pill, border: "none",
                  background: T.green, color: T.white, fontFamily: "Outfit, sans-serif",
                  fontWeight: 600, fontSize: "16px", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  transition: `background ${T.instant}, transform ${T.instant}`,
                  boxShadow: "0 4px 14px rgba(0, 181, 102, 0.25)",
                  marginBottom: "16px",
                  outline: "none",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = T.greenDk)}
                onMouseLeave={(e) => (e.currentTarget.style.background = T.green)}
                onMouseDown={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98)")}
                onMouseUp={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "scale(1)")}
                onFocus={(e) => (e.currentTarget.style.outline = `2px solid ${T.text}`)}
                onBlur={(e) => (e.currentTarget.style.outline = "none")}
              >
                💳 Buy It Now
              </button>

              {/* Below CTA */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                <a href="#" style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "13px", color: T.text, textDecoration: "underline", textUnderlineOffset: "2px" }}>
                  <Truck /> Free delivery on orders over $50
                </a>
                <button aria-pressed={wishlisted} onClick={() => setWishlisted(v => !v)}
                  style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "13px", color: T.text, background: "none", border: "none", cursor: "pointer", fontFamily: "Outfit, sans-serif" }}>
                  <Heart filled={wishlisted} /> {wishlisted ? "Wishlisted" : "Add to Wishlist"}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            SELECT YOUR POT
        ════════════════════════════════════════════ */}
        <section style={{ background: "#f3ede2", padding: "56px 0 48px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 48px" }} className="pd-wrap">
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <h2 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "24px", color: T.text }}>Select Your Pot</h2>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button style={{ fontSize: "15px", color: T.green, background: "none", border: "none", cursor: "pointer", fontFamily: "Outfit, sans-serif", padding: 0 }}>Browse All</button>
                {[{ label: "Previous pots", icon: <ChevL />, dir: -1 }, { label: "Next pots", icon: <ChevR />, dir: 1 }].map(({ label, icon, dir }) => (
                  <button key={label} aria-label={label}
                    onClick={() => potScrollRef.current?.scrollBy({ left: dir * 460, behavior: "smooth" })}
                    style={{ width: "32px", height: "32px", borderRadius: T.fab, border: "none", boxShadow: T.s3, background: T.bg, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: T.text, transition: `background ${T.instant}` }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = `${T.green}12`)}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = T.bg)}
                  >{icon}</button>
                ))}
              </div>
            </div>

            <p style={{ fontSize: "13px", color: "rgba(28,28,28,0.55)", marginBottom: "18px" }}>
              Pick a pot — the product photo updates instantly ✨
            </p>

            {/* Category tabs */}
            <div role="tablist" aria-label="Pot categories" style={{ display: "flex", gap: "6px", marginBottom: "22px" }}>
              {POT_TABS.map((tab, i) => (
                <button key={tab} id={`pot-tab-${i}`} role="tab" aria-selected={activePotTab === i}
                  onClick={() => setActivePotTab(i)}
                  style={{ padding: "7px 18px", borderRadius: T.pill, border: "none", background: activePotTab === i ? T.green : "transparent", color: activePotTab === i ? T.white : "rgba(28,28,28,0.6)", fontFamily: "Outfit, sans-serif", fontWeight: activePotTab === i ? 600 : 500, fontSize: "15px", cursor: "pointer", transition: `all ${T.instant}`, borderBottom: activePotTab === i ? "none" : "2px solid transparent", outline: "none" }}
                  onFocus={(e) => (e.currentTarget.style.outline = `2px solid ${T.green}`)}
                  onBlur={(e) => (e.currentTarget.style.outline = "none")}
                >{tab}</button>
              ))}
            </div>

            {/* Pot cards + live preview */}
            <div className="pot-grid">
              {/* Cards */}
              <div ref={potScrollRef} role="radiogroup" aria-label="Select a pot" style={{ display: "flex", gap: "14px", overflowX: "auto", scrollSnapType: "x mandatory", scrollbarWidth: "none", paddingBottom: "6px" }}>
                {POTS.map((p, i) => {
                  const active = selectedPot === i;
                  return (
                    <div key={p.id} id={`pot-${p.id}`}
                      role="radio" aria-checked={active}
                      tabIndex={0}
                      onClick={() => selectPot(i)}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); selectPot(i); } }}
                      style={{
                        minWidth: "130px", background: T.bg, borderRadius: T.md, padding: "14px 10px 10px",
                        boxShadow: active ? `${T.s4}, 0 0 0 2px ${T.green}` : T.s3,
                        cursor: "pointer", textAlign: "center", flexShrink: 0,
                        scrollSnapAlign: "start",
                        transform: active ? "scale(1.05)" : "scale(1)",
                        transition: `all ${T.normal}`,
                        outline: "none",
                      }}
                      onFocus={(e) => (e.currentTarget.style.outline = `2px solid ${T.green}`)}
                      onBlur={(e) => (e.currentTarget.style.outline = "none")}
                      onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLDivElement).style.boxShadow = T.s4; }}
                      onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLDivElement).style.boxShadow = T.s3; }}
                    >
                      <div style={{ width: "68px", height: "68px", margin: "0 auto 8px", borderRadius: T.md, background: `${p.tint}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "30px", border: `1.5px solid ${p.rim}40` }}>{p.emoji}</div>
                      <p style={{ fontSize: "12px", fontWeight: active ? 600 : 500, color: T.text, lineHeight: 1.3 }}>
                        {p.name}{p.star && <span style={{ color: "#c8a84b" }}> ★</span>}
                      </p>
                      {active && <p style={{ fontSize: "11px", color: T.green, fontWeight: 600, marginTop: "4px" }}>✓ Selected</p>}
                    </div>
                  );
                })}
              </div>

              {/* Live Preview */}
              <div style={{ background: T.bg, borderRadius: T.r2xl, boxShadow: T.s2, padding: "14px", textAlign: "center" }}>
                <p style={{ fontSize: "11px", fontWeight: 600, color: "rgba(28,28,28,0.5)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px" }}>Live Preview</p>
                <div style={{ position: "relative", height: "160px", borderRadius: T.lg, overflow: "hidden", background: "#f0ece2" }}>
                  <PotPreview src={imgSrc} alt={imgAlt} pot={pot} fading={imgFading} />
                </div>
                <p style={{ marginTop: "10px", fontSize: "12px", fontWeight: 600, color: T.green }}>{pot.emoji} {pot.name}</p>
              </div>
            </div>

            <p style={{ fontSize: "12px", fontStyle: "italic", color: "rgba(28,28,28,0.45)", marginTop: "14px" }}>Fant Tean Pot Collection</p>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            PLANT CARE & DETAILS
        ════════════════════════════════════════════ */}
        <section id="care-section" style={{ background: T.bg, padding: "72px 0" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 48px" }} className="pd-wrap">

            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <span style={{ display: "inline-block", background: `${T.green}14`, color: T.green, borderRadius: T.pill, padding: "6px 18px", fontSize: "13px", fontWeight: 600, marginBottom: "14px" }}>🌿 Complete Care Guide</span>
              <h2 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "clamp(26px, 3.5vw, 38px)", color: T.text, lineHeight: 1.15, marginBottom: "12px" }}>
                Everything Your Anthurium Needs
              </h2>
              <p style={{ fontSize: "14px", color: "rgba(28,28,28,0.65)", maxWidth: "520px", margin: "0 auto", lineHeight: "22.4px" }}>
                Hover any card for full guidance. With the right care, your Red Anthurium blooms year-round.
              </p>
            </div>

            {/* Care cards grid */}
            <div className="care-grid" style={{ marginBottom: "48px" }}>
              {CARE_DATA.map((item) => (
                <CareCard key={item.label} item={item} />
              ))}
            </div>

            {/* Quick facts + environment */}
            <div className="facts-grid" style={{ marginBottom: "32px" }}>
              {/* Facts table */}
              <div style={{ background: "white", borderRadius: T.r2xl, padding: "28px", boxShadow: T.s2 }}>
                <h3 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "17px", color: T.text, marginBottom: "18px" }}>📋 Plant Facts</h3>
                {PLANT_FACTS.map(([k, v], i) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 0", borderBottom: i < PLANT_FACTS.length - 1 ? "1px solid rgba(28,28,28,0.06)" : "none" }}>
                    <span style={{ fontSize: "13px", color: "rgba(28,28,28,0.55)" }}>{k}</span>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: T.green }}>{v}</span>
                  </div>
                ))}
              </div>

              {/* Environment */}
              <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                {/* Difficulty */}
                <div style={{ background: "white", borderRadius: T.r2xl, padding: "24px", boxShadow: T.s2 }}>
                  <h3 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "15px", color: T.text, marginBottom: "14px" }}>🎯 Care Level</h3>
                  <div style={{ display: "flex", gap: "5px", marginBottom: "8px" }}>
                    {[1,2,3,4,5].map(l => (
                      <div key={l} style={{ flex: 1, height: "8px", borderRadius: "4px", background: l <= 3 ? T.green : "rgba(28,28,28,0.12)", transition: "background 0.3s" }} />
                    ))}
                  </div>
                  <p style={{ fontSize: "13px", color: "rgba(28,28,28,0.65)", lineHeight: "20px" }}>
                    <strong style={{ color: T.green }}>Moderate</strong> — Rewarding for attentive plant owners. Consistent humidity is the key to healthy blooms.
                  </p>
                </div>

                {/* Ideal spots */}
                <div style={{ background: `linear-gradient(135deg, ${T.green} 0%, ${T.greenDk} 100%)`, borderRadius: T.r2xl, padding: "24px", flex: 1 }}>
                  <h3 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "15px", color: T.white, marginBottom: "14px" }}>🏡 Ideal Environment</h3>
                  {[
                    ["🚿", "Humid bathroom with filtered window light"],
                    ["🪟", "East or north-facing window, no direct sun"],
                    ["🌡️", "Away from AC vents — stable warmth only"],
                    ["🪴", "Pebble tray beneath pot for ambient moisture"],
                  ].map(([icon, text]) => (
                    <div key={text} style={{ display: "flex", gap: "9px", marginBottom: "10px", alignItems: "flex-start" }}>
                      <span style={{ fontSize: "15px", flexShrink: 0 }}>{icon}</span>
                      <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.88)", lineHeight: "20px" }}>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Seasonal timeline */}
            <div style={{ background: "white", borderRadius: T.r2xl, padding: "28px 32px", boxShadow: T.s2 }}>
              <h3 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "17px", color: T.text, marginBottom: "22px" }}>📅 Seasonal Care Timeline</h3>
              <div className="seasons-grid">
                {[
                  { s: "🌸 Spring", bg: "#fff0f0", tc: "#8B3A3A", tasks: ["Repot if root-bound", "Resume monthly feeding", "Increase watering", "Watch for new blooms"] },
                  { s: "☀️ Summer",  bg: "#fffbeb", tc: "#7A5A00", tasks: ["Water 2–3× weekly", "Daily misting", "Pest check: mites", "Avoid direct sun"] },
                  { s: "🍂 Autumn", bg: "#fff4ea", tc: "#7A3800", tasks: ["Reduce watering", "Stop fertilising", "Move indoors early", "Clean leaves gently"] },
                  { s: "❄️ Winter",  bg: "#eef4ff", tc: "#1A3A8B", tasks: ["Minimal watering", "No cold drafts", "Use a humidifier", "No fertiliser"] },
                ].map((item) => (
                  <div key={item.s} style={{ background: item.bg, borderRadius: T.lg, padding: "18px" }}>
                    <p style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "13px", color: item.tc, marginBottom: "10px" }}>{item.s}</p>
                    <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "5px" }}>
                      {item.tasks.map(t => (
                        <li key={t} style={{ display: "flex", gap: "6px", fontSize: "12px", color: T.text, lineHeight: "18px" }}>
                          <span style={{ color: T.green, flexShrink: 0 }}>✓</span>{t}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <CustomerReviewsAndFAQ />

        {/* ════════════════════════════════════════════
            FULL-WIDTH GALLERY / RELATED
        ════════════════════════════════════════════ */}
        <section style={{ background: "#f3ede2", padding: "56px 0 80px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 48px" }} className="pd-wrap">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "26px" }}>
              <h2 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "22px", color: T.text }}>You May Also Like</h2>
              <Link href="/" style={{ fontSize: "14px", color: T.green, fontWeight: 500, textDecoration: "none" }}>See All Plants →</Link>
            </div>

            <div role="region" aria-label="Related products" ref={relScrollRef}
              style={{ display: "flex", gap: "18px", overflowX: "auto", scrollSnapType: "x mandatory", scrollbarWidth: "none", paddingBottom: "8px" }}>
              {RELATED.map((item, i) => (
                <div key={i} id={`related-${i}`}
                  style={{ minWidth: "280px", borderRadius: T.r2xl, overflow: "hidden", background: T.bg, boxShadow: T.s2, flexShrink: 0, scrollSnapAlign: "start", cursor: "pointer", transition: `transform ${T.fast}, box-shadow ${T.fast}`, position: "relative" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = `${T.s4}, 0 12px 32px rgba(0,0,0,0.10)`; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = T.s2; }}
                >
                  <button style={{ position: "absolute", top: "12px", right: "12px", zIndex: 2, ...iconBtn() }} aria-label="Add to wishlist">
                    <Heart filled={false} />
                  </button>
                  <div style={{ height: "200px", position: "relative", background: "#f0ece2" }}>
                    <Image src={item.img} alt={item.name} fill sizes="280px" style={{ objectFit: "cover" }} />
                  </div>
                  <div style={{ padding: "16px 18px 18px" }}>
                    <h3 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 600, fontSize: "15px", color: T.text, marginBottom: "10px" }}>{item.name}</h3>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: "20px", color: T.text }}>${item.price}.00</p>
                        <p style={{ fontSize: "11px", color: "rgba(28,28,28,0.55)" }}>+ Premium $45.00</p>
                      </div>
                      <button style={{ background: T.green, color: T.white, border: "none", borderRadius: T.pill, padding: "9px 18px", fontFamily: "Outfit, sans-serif", fontWeight: 600, fontSize: "13px", cursor: "pointer", transition: `background ${T.instant}`, outline: "none" }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = T.greenDk)}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = T.green)}
                        onFocus={(e) => (e.currentTarget.style.outline = `2px solid ${T.text}`)}
                        onBlur={(e) => (e.currentTarget.style.outline = "none")}
                      >Add to Cart</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Dots */}
            <div style={{ display: "flex", justifyContent: "center", gap: "7px", marginTop: "24px" }}>
              {[0,1,2,3,4].map(i => (
                <button key={i} id={`rel-dot-${i}`}
                  onClick={() => { setActiveRelDot(i); relScrollRef.current?.scrollTo({ left: i * 298, behavior: "smooth" }); }}
                  style={{ width: activeRelDot === i ? "24px" : "8px", height: "8px", borderRadius: T.pill, background: activeRelDot === i ? T.green : "rgba(28,28,28,0.2)", border: "none", cursor: "pointer", transition: `width ${T.fast}, background ${T.fast}`, padding: 0, outline: "none" }}
                  onFocus={(e) => (e.currentTarget.style.outline = `2px solid ${T.green}`)}
                  onBlur={(e) => (e.currentTarget.style.outline = "none")}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ── FLOATING CHAT FAB ── */}
      <button id="chat-fab" aria-label="Open live chat"
        style={{ position: "fixed", bottom: "28px", right: "28px", zIndex: 200, width: "52px", height: "52px", borderRadius: T.fab, background: T.green, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", animation: "fabPulse 4s ease-in-out infinite", transition: `transform ${T.instant}`, outline: "none" }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "scale(1)")}
        onMouseDown={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "scale(0.96)")}
        onMouseUp={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)")}
        onFocus={(e) => (e.currentTarget.style.outline = `2px solid ${T.text}`)}
        onBlur={(e) => (e.currentTarget.style.outline = "none")}
      ><ChatBubble /></button>

      {/* ── RIGHT EDGE NAV ── */}
      <div style={{ position: "fixed", right: "12px", top: "50%", transform: "translateY(-50%)", zIndex: 50 }}>
        <button style={{ background: "rgba(254,252,249,0.88)", border: "none", borderRadius: T.pill, width: "30px", height: "52px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: T.s2, color: T.text, transition: `background ${T.instant}`, outline: "none" }}
          aria-label="Next product"
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(254,252,249,0.98)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(254,252,249,0.88)")}
          onFocus={(e) => (e.currentTarget.style.outline = `2px solid ${T.green}`)}
          onBlur={(e) => (e.currentTarget.style.outline = "none")}
        ><ChevR /></button>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   CARE CARD (separate component for hover state)
═══════════════════════════════════════════════════ */
function CareCard({ item }: { item: typeof CARE_DATA[0] }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ background: "white", borderRadius: T.r2xl, padding: "20px", boxShadow: hov ? `${T.s4}, 0 8px 24px rgba(0,181,102,0.12)` : T.s2, transition: `box-shadow ${T.instant}, transform ${T.instant}`, transform: hov ? "translateY(-3px)" : "translateY(0)", cursor: "default", position: "relative", overflow: "hidden" }}
    >
      <div style={{ fontSize: "26px", marginBottom: "10px" }}>{item.icon}</div>
      <p style={{ fontSize: "11px", fontWeight: 600, color: "rgba(28,28,28,0.5)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>{item.label}</p>
      <p style={{ fontSize: "14px", fontWeight: 700, color: T.green, marginBottom: "8px" }}>{item.value}</p>
      <p style={{ fontSize: "13px", color: "rgba(28,28,28,0.7)", lineHeight: "20px", opacity: hov ? 1 : 0.8, transition: `opacity ${T.instant}` }}>{item.detail}</p>
      <div style={{ position: "absolute", top: "-14px", right: "-14px", width: "52px", height: "52px", borderRadius: "50%", background: `${T.green}08` }} />
    </div>
  );
}
