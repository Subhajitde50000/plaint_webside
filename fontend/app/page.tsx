"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

/* ═══════════════════════════════════════════════════
   SVG ICONS
═══════════════════════════════════════════════════ */
function LeafIcon({ size = 24, color = "#2D5A27" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2C12 2 4 5 4 13C4 17.4 7.6 21 12 21C16.4 21 20 17.4 20 13C20 5 12 2 12 2Z"
        fill={color}
        opacity="0.9"
      />
      <path d="M12 21V10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 15L8 11" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M12 12L16 8" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function WaterDroplet({ size = 32, color = "#6BBDE3" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 2C12 2 5 10 5 15C5 18.87 8.13 22 12 22C15.87 22 19 18.87 19 15C19 10 12 2 12 2Z" />
      <path d="M9 15C9 16.66 10.34 18 12 18" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SunIcon({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#F5C842">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" stroke="#F5C842" strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="21" x2="12" y2="23" stroke="#F5C842" strokeWidth="2" strokeLinecap="round" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="#F5C842" strokeWidth="2" strokeLinecap="round" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="#F5C842" strokeWidth="2" strokeLinecap="round" />
      <line x1="1" y1="12" x2="3" y2="12" stroke="#F5C842" strokeWidth="2" strokeLinecap="round" />
      <line x1="21" y1="12" x2="23" y2="12" stroke="#F5C842" strokeWidth="2" strokeLinecap="round" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="#F5C842" strokeWidth="2" strokeLinecap="round" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="#F5C842" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CloudIcon() {
  return (
    <svg width="60" height="40" viewBox="0 0 80 50" fill="white">
      <ellipse cx="40" cy="35" rx="35" ry="14" />
      <ellipse cx="28" cy="28" rx="18" ry="16" />
      <ellipse cx="50" cy="26" rx="20" ry="18" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════
   DECORATIVE LEAVES (SVG)
═══════════════════════════════════════════════════ */
function LeafShape({ color = "#A8C5A0", width = 40, height = 55, rotate = 0, opacity = 0.6 }: {
  color?: string; width?: number; height?: number; rotate?: number; opacity?: number;
}) {
  return (
    <svg width={width} height={height} viewBox="0 0 40 55" style={{ opacity, transform: `rotate(${rotate}deg)` }}>
      <path
        d="M20 50 C20 50 5 35 5 20 C5 8 12 2 20 2 C28 2 35 8 35 20 C35 35 20 50 20 50Z"
        fill={color}
      />
      <path d="M20 50 L20 5" stroke="white" strokeWidth="1" strokeOpacity="0.5" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════
   NAVIGATION
═══════════════════════════════════════════════════ */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount] = useState(3);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      id="navbar"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: "white",
        boxShadow: scrolled ? "0 2px 20px rgba(45,90,39,0.10)" : "none",
        borderBottom: scrolled ? "none" : "1px solid rgba(168,197,160,0.2)",
        transition: "box-shadow 0.3s ease",
        height: "68px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
        {/* Logo */}
        <a href="#" id="logo-link" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
          <LeafIcon size={28} />
          <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "22px", color: "var(--color-green-dark)" }}>
            Hero
          </span>
        </a>

        {/* Desktop Nav */}
        <div style={{ display: "flex", alignItems: "center", gap: "36px" }} className="desktop-nav">
          {[
            { label: "Plants", dropdown: true },
            { label: "Supplies", dropdown: false },
            { label: "AI Care", dropdown: false },
          ].map((item) => (
            <a
              key={item.label}
              href="#"
              id={`nav-${item.label.toLowerCase().replace(" ", "-")}`}
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 500,
                fontSize: "15px",
                color: "var(--color-text-primary)",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-green-mid)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-primary)")}
            >
              {item.label}
              {item.dropdown && <ChevronDown />}
            </a>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            id="search-btn"
            style={{
              background: "var(--color-bg-secondary)",
              border: "none",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "var(--color-green-dark)",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "var(--color-green-pale)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "var(--color-bg-secondary)")}
          >
            <SearchIcon />
          </button>

          <button
            id="cart-btn"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              position: "relative",
              color: "var(--color-green-dark)",
              padding: "4px",
            }}
          >
            <CartIcon />
            <span style={{
              position: "absolute",
              top: "-4px",
              right: "-4px",
              background: "#E53E3E",
              color: "white",
              fontSize: "11px",
              fontWeight: 700,
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "Poppins, sans-serif",
            }}>
              {cartCount}
            </span>
          </button>

          {/* Hamburger */}
          <button
            id="hamburger-btn"
            className="hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "none",
              flexDirection: "column",
              gap: "5px",
              padding: "4px",
            }}
          >
            {[0, 1, 2].map((i) => (
              <span key={i} style={{ display: "block", width: "22px", height: "2px", background: "var(--color-green-dark)", borderRadius: "2px" }} />
            ))}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          position: "absolute",
          top: "68px",
          left: 0,
          right: 0,
          background: "white",
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          padding: "16px 24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          animation: "fadeSlideUp 0.2s ease",
        }}>
          {["Plants", "Supplies", "AI Care"].map((item) => (
            <a key={item} href="#" style={{ fontFamily: "Poppins", fontWeight: 500, fontSize: "16px", color: "var(--color-text-primary)", padding: "8px 0", borderBottom: "1px solid var(--color-bg-secondary)" }}>
              {item}
            </a>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}

/* ═══════════════════════════════════════════════════
   HERO SECTION
═══════════════════════════════════════════════════ */
const heroSlides = [
  {
    heading: "Grow Your Green Space",
    sub: "Discover our handpicked collection of plants, seeds, and expert AI-powered care — for every home, every garden, every dream.",
    cta: "Shop Now",
  },
  {
    heading: "Plants That Spark Joy",
    sub: "Transform any corner into a lush oasis. Browse hundreds of indoor and outdoor varieties, each with personalized care tips.",
    cta: "Explore Plants",
  },
  {
    heading: "Your AI Plant Expert",
    sub: "Get real-time watering reminders, sunlight tips, and growth tracking powered by our smart AI companion.",
    cta: "Try AI Care",
  },
  {
    heading: "Seeds of Tomorrow",
    sub: "Start from scratch and watch life bloom. Our premium seed collection comes with step-by-step growing guides.",
    cta: "Browse Seeds",
  },
  {
    heading: "Style Your Balcony",
    sub: "Elevate your outdoor space with our curated balcony décor and hanging basket collections.",
    cta: "Shop Decor",
  },
];

function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
      setAnimKey((k) => k + 1);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (idx: number) => {
    setActiveSlide(idx);
    setAnimKey((k) => k + 1);
  };

  const slide = heroSlides[activeSlide];

  return (
    <section
      id="hero-section"
      style={{
        background: "linear-gradient(135deg, var(--color-bg-primary) 0%, #EEF7EA 50%, var(--color-bg-secondary) 100%)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        paddingTop: "68px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Decorative Leaves */}
      <div style={{ position: "absolute", top: "10%", left: "2%", animation: "floatLeaf 5s ease-in-out infinite" }}>
        <LeafShape color="#A8C5A0" width={45} height={60} rotate={-30} opacity={0.35} />
      </div>
      <div style={{ position: "absolute", top: "60%", left: "5%", animation: "floatLeaf 6s ease-in-out infinite 1s" }}>
        <LeafShape color="#4A7C40" width={30} height={40} rotate={45} opacity={0.25} />
      </div>
      <div style={{ position: "absolute", top: "20%", right: "3%", animation: "floatLeaf 4.5s ease-in-out infinite 0.5s" }}>
        <LeafShape color="#2D5A27" width={35} height={48} rotate={20} opacity={0.2} />
      </div>
      <div style={{ position: "absolute", bottom: "15%", left: "15%", animation: "floatLeaf 7s ease-in-out infinite 2s" }}>
        <LeafShape color="#A8C5A0" width={25} height={35} rotate={-15} opacity={0.3} />
      </div>
      {/* Seed decorative shapes */}
      {[
        { top: "30%", left: "8%", delay: 0 },
        { top: "70%", left: "20%", delay: 0.5 },
        { top: "45%", right: "8%", delay: 1 },
        { top: "80%", right: "20%", delay: 1.5 },
      ].map((pos, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            ...pos as React.CSSProperties,
            width: "12px",
            height: "18px",
            background: "#C4A882",
            borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
            opacity: 0.25,
            animation: `float ${4 + i}s ease-in-out infinite ${pos.delay}s`,
          }}
        />
      ))}

      <div className="container" style={{ width: "100%", padding: "80px 48px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "48px",
          alignItems: "center",
          minHeight: "80vh",
        }}
          className="hero-grid"
        >
          {/* Left — Text */}
          <div key={animKey} style={{ animation: "fadeSlideIn 0.6s ease both", position: "relative", zIndex: 2 }}>
            {/* Sparkle stars */}
            <span style={{ position: "absolute", top: "-20px", left: "10px", fontSize: "22px", color: "var(--color-accent-yellow)", animation: "pulse-star 2s ease-in-out infinite" }}>✦</span>
            <span style={{ position: "absolute", top: "40px", right: "60px", fontSize: "14px", color: "var(--color-accent-yellow)", animation: "pulse-star 2.5s ease-in-out infinite 0.5s" }}>✦</span>
            <span style={{ position: "absolute", bottom: "60px", left: "30px", fontSize: "18px", color: "var(--color-accent-yellow)", animation: "pulse-star 3s ease-in-out infinite 1s" }}>✦</span>

            <div style={{ marginBottom: "20px" }}>
              <span className="badge-pill">🌿 Premium Plant Shop</span>
            </div>

            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 800,
                fontSize: "clamp(40px, 5vw, 64px)",
                color: "var(--color-green-dark)",
                lineHeight: 1.1,
                marginBottom: "20px",
                letterSpacing: "-0.5px",
              }}
            >
              {slide.heading}
            </h1>

            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "17px",
              color: "var(--color-text-secondary)",
              lineHeight: 1.7,
              marginBottom: "36px",
              maxWidth: "480px",
            }}>
              {slide.sub}
            </p>

            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <button id="hero-shop-btn" className="btn-primary">
                {slide.cta} <ArrowRight />
              </button>
              <button id="hero-learn-btn" className="btn-outline">
                Learn More
              </button>
            </div>

            {/* Stats */}
            <div style={{ display: "flex", gap: "32px", marginTop: "48px", flexWrap: "wrap" }}>
              {[
                { val: "500+", label: "Plant Varieties" },
                { val: "10K+", label: "Happy Gardeners" },
                { val: "4.9★", label: "Customer Rating" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "24px", color: "var(--color-green-dark)" }}>{stat.val}</div>
                  <div style={{ fontFamily: "DM Sans", fontSize: "13px", color: "var(--color-text-secondary)" }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Visual */}
          <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
            {/* Background blob circle */}
            <div style={{
              position: "absolute",
              width: "500px",
              height: "500px",
              background: "radial-gradient(circle, #D4E8CE 0%, #EEF7EA 60%, transparent 80%)",
              borderRadius: "50%",
              zIndex: 0,
            }} />

            {/* Monstera plant */}
            <div style={{
              position: "relative",
              zIndex: 2,
              animation: "float 3.5s ease-in-out infinite",
              filter: "drop-shadow(0 20px 40px rgba(45,90,39,0.2))",
            }}>
              <Image
                src="/monstera.png"
                alt="Monstera plant in terracotta pot"
                width={420}
                height={480}
                priority
                style={{ objectFit: "contain" }}
              />
            </div>

            {/* Watering can */}
            <div style={{
              position: "absolute",
              bottom: "5%",
              left: "-5%",
              zIndex: 3,
              animation: "sway 3s ease-in-out infinite",
              transformOrigin: "bottom center",
            }}>
              <Image
                src="/watering-can.png"
                alt="Cute watering can character"
                width={140}
                height={140}
                style={{ objectFit: "contain" }}
              />
            </div>

            {/* Water droplets */}
            {[0, 0.3, 0.6].map((delay, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${5 + i * 5}%`,
                  bottom: `${10 + i * 8}%`,
                  animation: `drip 1.5s ease-in infinite ${delay}s`,
                  zIndex: 4,
                }}
              >
                <WaterDroplet size={12 + i * 4} color="#6BBDE3" />
              </div>
            ))}

            {/* Floating leaf accents */}
            <div style={{ position: "absolute", top: "5%", right: "5%", animation: "floatLeaf 4s ease-in-out infinite 1s" }}>
              <LeafShape color="#4A7C40" width={30} height={40} rotate={25} opacity={0.7} />
            </div>
            <div style={{ position: "absolute", top: "35%", right: "-2%", animation: "floatLeaf 5s ease-in-out infinite" }}>
              <LeafShape color="#A8C5A0" width={22} height={30} rotate={-10} opacity={0.6} />
            </div>
            <div style={{ position: "absolute", bottom: "30%", right: "8%", animation: "floatLeaf 3.5s ease-in-out infinite 2s" }}>
              <LeafShape color="#2D5A27" width={18} height={25} rotate={40} opacity={0.5} />
            </div>

            {/* Yellow sparkle */}
            <span style={{ position: "absolute", top: "12%", left: "15%", fontSize: "28px", color: "var(--color-accent-yellow)", animation: "pulse-star 2s ease-in-out infinite", zIndex: 5 }}>✦</span>
          </div>
        </div>

        {/* Carousel Dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "40px" }}>
          {heroSlides.map((_, i) => (
            <button
              key={i}
              id={`hero-dot-${i}`}
              onClick={() => goToSlide(i)}
              style={{
                width: activeSlide === i ? "32px" : "10px",
                height: "10px",
                borderRadius: "999px",
                background: activeSlide === i ? "var(--color-green-dark)" : "#C8C0B0",
                border: "none",
                cursor: "pointer",
                transition: "all 0.35s ease",
                padding: 0,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            text-align: center;
          }
          .hero-grid > div:last-child {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   CATEGORIES SECTION
═══════════════════════════════════════════════════ */
const categories = [
  { id: "flowers", emoji: "🌹", label: "Flower Plants", img: "/cat-flowers.png" },
  { id: "indoor", emoji: "🪴", label: "Indoor Plants", img: "/cat-indoor.png" },
  { id: "balcony", emoji: "🌸", label: "Balcony Decor", img: "/cat-balcony.png" },
  { id: "succulents", emoji: "🌿", label: "Succulents", img: "/cat-succulents.png" },
];

function CategoriesSection() {
  const [activeDot, setActiveDot] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const cardW = 300 + 24;
    const idx = Math.round(el.scrollLeft / cardW);
    setActiveDot(Math.min(idx, categories.length - 1));
  };

  return (
    <section
      id="categories-section"
      style={{
        background: "var(--color-bg-secondary)",
        padding: "var(--space-xl) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background leaves */}
      <div style={{ position: "absolute", top: "10%", left: "2%", opacity: 0.15 }}>
        <LeafShape color="#4A7C40" width={80} height={110} rotate={-20} opacity={1} />
      </div>
      <div style={{ position: "absolute", bottom: "5%", right: "3%", opacity: 0.12 }}>
        <LeafShape color="#2D5A27" width={100} height={130} rotate={30} opacity={1} />
      </div>

      <div className="container">
        {/* Heading Row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "40px" }}>
          <div>
            <div style={{ marginBottom: "8px" }}>
              <span className="badge-pill">🌱 Browse by Category</span>
            </div>
            <h2 className="section-title">Our Green Categories</h2>
          </div>
          <a
            id="see-all-categories-link"
            href="#"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontFamily: "Poppins",
              fontWeight: 600,
              fontSize: "15px",
              color: "var(--color-green-dark)",
              transition: "gap 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.gap = "12px")}
            onMouseLeave={(e) => (e.currentTarget.style.gap = "8px")}
          >
            See it all <ArrowRight />
          </a>
        </div>

        {/* Card Row */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          style={{
            display: "flex",
            gap: "24px",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            paddingBottom: "8px",
          }}
        >
          {categories.map((cat) => (
            <div
              key={cat.id}
              id={`cat-card-${cat.id}`}
              style={{
                minWidth: "280px",
                maxWidth: "300px",
                background: "var(--color-white)",
                borderRadius: "var(--radius-lg)",
                boxShadow: "var(--shadow-card)",
                overflow: "hidden",
                scrollSnapAlign: "start",
                flex: "0 0 auto",
                cursor: "pointer",
                transition: "transform 0.25s ease, box-shadow 0.25s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "scale(1.03) translateY(-4px)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 16px 48px rgba(45,90,39,0.18)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-card)";
              }}
            >
              <div style={{ height: "260px", overflow: "hidden", position: "relative" }}>
                <Image
                  src={cat.img}
                  alt={cat.label}
                  fill
                  style={{ objectFit: "cover", transition: "transform 0.4s ease" }}
                />
              </div>
              <div style={{ padding: "20px", textAlign: "center" }}>
                <div style={{ fontSize: "28px", marginBottom: "8px" }}>{cat.emoji}</div>
                <h3 style={{
                  fontFamily: "Poppins",
                  fontWeight: 700,
                  fontSize: "18px",
                  color: "var(--color-text-primary)",
                  marginBottom: "6px",
                }}>
                  {cat.label}
                </h3>
                <span style={{ fontSize: "13px", color: "var(--color-text-secondary)", fontFamily: "DM Sans" }}>
                  Shop Collection →
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "32px" }}>
          {[...Array(5)].map((_, i) => (
            <button
              key={i}
              id={`cat-dot-${i}`}
              onClick={() => {
                setActiveDot(i);
                if (scrollRef.current) {
                  scrollRef.current.scrollTo({ left: i * 324, behavior: "smooth" });
                }
              }}
              style={{
                width: activeDot === i ? "32px" : "10px",
                height: "10px",
                borderRadius: "999px",
                background: activeDot === i ? "var(--color-green-dark)" : "#C8C0B0",
                border: "none",
                cursor: "pointer",
                transition: "all 0.35s ease",
                padding: 0,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`::-webkit-scrollbar { display: none; }`}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   PRODUCTS SECTION
═══════════════════════════════════════════════════ */
const products = [
  { id: "seeds", name: "Wildflower Seed Mix", price: "$12.99", img: "/product-seeds.png", badge: "Best Seller" },
  { id: "soil", name: "Premium Potting Mix", price: "$18.50", img: "/product-soil.png", badge: "Organic" },
  { id: "spray", name: "Plant Mist Spray", price: "$9.99", img: "/product-spray.png", badge: "New" },
  { id: "fertilizer", name: "Growth Fertilizer", price: "$14.99", img: "/product-fertilizer.png", badge: "Popular" },
];

function ProductsSection() {
  const [email, setEmail] = useState("");

  return (
    <section
      id="products-section"
      style={{
        background: "var(--color-bg-primary)",
        padding: "var(--space-xl) 0",
        position: "relative",
      }}
    >
      <div className="container">
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.4fr",
          gap: "64px",
          alignItems: "center",
        }}
          className="products-grid"
        >
          {/* Left */}
          <div>
            <div style={{ marginBottom: "16px" }}>
              <span className="badge-pill">🛒 Shop Essentials</span>
            </div>
            <h2 className="section-title" style={{ marginBottom: "16px" }}>
              Everything<br />You Need
            </h2>
            <p style={{
              fontFamily: "DM Sans",
              fontSize: "16px",
              color: "var(--color-text-secondary)",
              lineHeight: 1.7,
              marginBottom: "32px",
              maxWidth: "360px",
            }}>
              From rare seeds to premium soils and expert-tested plant nutrients — your one-stop plant supply shop.
            </p>

            {/* Search + Subscribe */}
            <div style={{
              display: "flex",
              background: "white",
              borderRadius: "var(--radius-full)",
              padding: "6px 6px 6px 20px",
              boxShadow: "var(--shadow-card)",
              gap: "8px",
              alignItems: "center",
              maxWidth: "420px",
            }}>
              <SearchIcon />
              <input
                id="search-order-input"
                type="text"
                placeholder="Search products…"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  fontFamily: "DM Sans",
                  fontSize: "15px",
                  color: "var(--color-text-primary)",
                  background: "transparent",
                }}
              />
              <button id="subscribe-btn" className="btn-primary" style={{ padding: "10px 24px", fontSize: "14px" }}>
                Subscribe
              </button>
            </div>

            <p style={{ fontFamily: "DM Sans", fontSize: "13px", color: "var(--color-text-secondary)", marginTop: "12px" }}>
              🌱 Get weekly plant care tips & exclusive deals
            </p>
          </div>

          {/* Right — Product Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}>
            {products.map((product) => (
              <div
                key={product.id}
                id={`product-${product.id}`}
                style={{
                  background: "white",
                  borderRadius: "var(--radius-lg)",
                  boxShadow: "var(--shadow-card)",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "scale(1.03) translateY(-4px)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 40px rgba(45,90,39,0.15)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-card)";
                }}
              >
                {/* Badge */}
                <div style={{
                  position: "absolute",
                  top: "10px",
                  left: "10px",
                  background: "var(--color-green-dark)",
                  color: "white",
                  fontFamily: "Poppins",
                  fontWeight: 600,
                  fontSize: "11px",
                  padding: "3px 10px",
                  borderRadius: "var(--radius-full)",
                  zIndex: 2,
                }}>
                  {product.badge}
                </div>
                <div style={{ height: "150px", position: "relative", background: "var(--color-bg-secondary)" }}>
                  <Image src={product.img} alt={product.name} fill style={{ objectFit: "cover" }} />
                </div>
                <div style={{ padding: "14px 16px" }}>
                  <h4 style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: "14px", color: "var(--color-text-primary)", marginBottom: "4px" }}>
                    {product.name}
                  </h4>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "16px", color: "var(--color-green-dark)" }}>
                      {product.price}
                    </span>
                    <button style={{
                      background: "var(--color-green-pale)",
                      border: "none",
                      borderRadius: "50%",
                      width: "30px",
                      height: "30px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      fontSize: "18px",
                      color: "var(--color-green-dark)",
                      transition: "background 0.2s",
                    }}>
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .products-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   AI CARE SECTION
═══════════════════════════════════════════════════ */
function AICareSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="ai-care-section"
      ref={sectionRef}
      style={{
        background: "linear-gradient(135deg, #EEF7EA 0%, var(--color-bg-secondary) 100%)",
        padding: "var(--space-xl) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decoration */}
      <div style={{ position: "absolute", top: "5%", right: "0%", opacity: 0.08 }}>
        <LeafShape color="#2D5A27" width={160} height={220} rotate={-40} opacity={1} />
      </div>
      <div style={{ position: "absolute", bottom: "5%", left: "0%", opacity: 0.08 }}>
        <LeafShape color="#4A7C40" width={120} height={160} rotate={30} opacity={1} />
      </div>

      <div className="container">
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "64px",
          alignItems: "center",
        }}
          className="ai-grid"
        >
          {/* Left — Phone Mockup */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            position: "relative",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(48px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}>
            {/* Phone Frame */}
            <div style={{
              width: "280px",
              background: "#1A1A1A",
              borderRadius: "40px",
              padding: "12px",
              boxShadow: "0 24px 60px rgba(0,0,0,0.25), inset 0 0 0 1px rgba(255,255,255,0.1)",
              position: "relative",
              zIndex: 2,
            }}>
              {/* Notch */}
              <div style={{
                width: "100px",
                height: "28px",
                background: "#1A1A1A",
                borderRadius: "16px",
                margin: "0 auto 8px",
                position: "relative",
                zIndex: 3,
              }} />
              {/* Screen */}
              <div style={{
                background: "#F0F8F0",
                borderRadius: "28px",
                overflow: "hidden",
                minHeight: "440px",
                padding: "16px",
              }}>
                <Image
                  src="/ai-phone.png"
                  alt="Smart Care AI interface"
                  width={256}
                  height={440}
                  style={{ width: "100%", height: "auto", borderRadius: "20px" }}
                />
              </div>
            </div>

            {/* Floating elements around phone */}
            {/* Water droplet top */}
            <div style={{
              position: "absolute",
              top: "-20px",
              right: "20px",
              animation: "float 2.5s ease-in-out infinite",
              background: "rgba(107,189,227,0.15)",
              borderRadius: "50%",
              padding: "10px",
              backdropFilter: "blur(4px)",
              border: "1px solid rgba(107,189,227,0.3)",
            }}>
              <WaterDroplet size={28} color="#6BBDE3" />
            </div>

            {/* Cloud */}
            <div style={{
              position: "absolute",
              top: "20px",
              right: "-60px",
              animation: "float 4s ease-in-out infinite 1s",
              filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))",
            }}>
              <CloudIcon />
            </div>

            {/* Sun */}
            <div style={{
              position: "absolute",
              bottom: "80px",
              right: "-40px",
              animation: "float 3s ease-in-out infinite 0.5s",
            }}>
              <SunIcon size={44} />
            </div>

            {/* Another droplet */}
            <div style={{
              position: "absolute",
              bottom: "20px",
              right: "10px",
              animation: "drip 2s ease-in infinite 0.5s",
            }}>
              <WaterDroplet size={20} color="#6BBDE3" />
            </div>

            {/* Yellow sparkle */}
            <span style={{
              position: "absolute",
              top: "40%",
              left: "-20px",
              fontSize: "24px",
              color: "var(--color-accent-yellow)",
              animation: "pulse-star 2s ease-in-out infinite",
            }}>✦</span>

            {/* Dashed arc SVG */}
            <svg
              style={{ position: "absolute", top: "0", left: "0", width: "100%", height: "100%", pointerEvents: "none", zIndex: 1 }}
              viewBox="0 0 400 500"
              fill="none"
            >
              <path
                d="M 300 100 Q 380 200 360 350"
                stroke="var(--color-green-light)"
                strokeWidth="2"
                strokeDasharray="8 6"
                strokeDashoffset="200"
                strokeLinecap="round"
                style={{ animation: "dashOffset 3s linear infinite" }}
              />
              <path
                d="M 300 380 Q 350 300 340 200"
                stroke="var(--color-accent-blue)"
                strokeWidth="1.5"
                strokeDasharray="6 5"
                strokeDashoffset="150"
                strokeLinecap="round"
                style={{ animation: "dashOffset 4s linear infinite reverse" }}
              />
            </svg>
          </div>

          {/* Right — Text */}
          <div style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateX(0)" : "translateX(32px)",
            transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s",
          }}>
            <div style={{ marginBottom: "20px" }}>
              <span className="badge-pill">🤖 Smart Care with AI 🌿</span>
            </div>

            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 800,
              fontSize: "clamp(32px, 4vw, 52px)",
              color: "var(--color-green-dark)",
              lineHeight: 1.1,
              marginBottom: "20px",
            }}>
              Never Let a<br />Plant Die Again.
            </h2>

            <p style={{
              fontFamily: "DM Sans",
              fontSize: "16px",
              color: "var(--color-text-secondary)",
              lineHeight: 1.8,
              marginBottom: "32px",
              maxWidth: "420px",
            }}>
              Our AI companion monitors your plants around the clock, sending personalized watering reminders, sunlight tips, and growth insights directly to your phone.
            </p>

            {/* Feature list */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "36px" }}>
              {[
                { icon: "💧", text: "Smart watering reminders based on weather & soil" },
                { icon: "📈", text: "Real-time growth tracking & health scores" },
                { icon: "☀️", text: "Sunlight & climate personalized care plans" },
                { icon: "🤖", text: "AI chat for instant plant advice anytime" },
              ].map((feat) => (
                <div key={feat.text} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{
                    fontSize: "20px",
                    width: "40px",
                    height: "40px",
                    background: "var(--color-green-pale)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}>{feat.icon}</span>
                  <span style={{ fontFamily: "DM Sans", fontSize: "15px", color: "var(--color-text-secondary)" }}>
                    {feat.text}
                  </span>
                </div>
              ))}
            </div>

            <button id="ai-shop-btn" className="btn-primary">
              Try AI Care Free <ArrowRight />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .ai-grid { grid-template-columns: 1fr !important; }
        }
        @keyframes dashOffset {
          from { stroke-dashoffset: 200; }
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   COMMUNITY BANNER
═══════════════════════════════════════════════════ */
function CommunityBanner() {
  return (
    <section
      id="community-section"
      style={{
        background: "var(--color-green-dark)",
        padding: "64px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Left decorative leaves */}
      <div style={{ position: "absolute", left: "-30px", top: "-20px", opacity: 0.15 }}>
        <LeafShape color="#A8C5A0" width={120} height={160} rotate={-20} opacity={1} />
      </div>
      <div style={{ position: "absolute", left: "40px", bottom: "-10px", opacity: 0.1 }}>
        <LeafShape color="#D4E8CE" width={80} height={110} rotate={30} opacity={1} />
      </div>

      {/* Right decorative leaves */}
      <div style={{ position: "absolute", right: "120px", top: "-20px", opacity: 0.12 }}>
        <LeafShape color="#A8C5A0" width={100} height={140} rotate={15} opacity={1} />
      </div>
      <div style={{ position: "absolute", right: "-20px", top: "0", opacity: 0.1 }}>
        <LeafShape color="#D4E8CE" width={140} height={190} rotate={-10} opacity={1} />
      </div>

      {/* Sparkles */}
      <span style={{ position: "absolute", top: "20px", left: "25%", fontSize: "20px", color: "var(--color-accent-yellow)", animation: "pulse-star 2.5s ease-in-out infinite", opacity: 0.7 }}>✦</span>
      <span style={{ position: "absolute", bottom: "20px", right: "30%", fontSize: "14px", color: "var(--color-accent-yellow)", animation: "pulse-star 3s ease-in-out infinite 1s", opacity: 0.7 }}>✦</span>

      <div className="container" style={{ position: "relative", zIndex: 2 }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "40px",
          flexWrap: "wrap",
        }}>
          {/* Text */}
          <div style={{ flex: 1, minWidth: "300px" }}>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 800,
              fontSize: "clamp(28px, 4vw, 48px)",
              color: "white",
              lineHeight: 1.1,
              marginBottom: "16px",
            }}>
              Join Our Green<br />Community
            </h2>
            <p style={{
              fontFamily: "DM Sans",
              fontSize: "17px",
              color: "rgba(255,255,255,0.75)",
              lineHeight: 1.7,
              marginBottom: "28px",
              maxWidth: "480px",
            }}>
              Connect with 10,000+ plant lovers. Share your garden journey, get expert advice, and grow together. 🌿
            </p>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <button id="join-community-btn" style={{
                background: "white",
                color: "var(--color-green-dark)",
                fontFamily: "Poppins",
                fontWeight: 700,
                fontSize: "15px",
                padding: "14px 32px",
                borderRadius: "var(--radius-xl)",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.03)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.3)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.2)";
                }}
              >
                Join for Free <ArrowRight />
              </button>
              <button id="learn-more-community-btn" style={{
                background: "rgba(255,255,255,0.15)",
                color: "white",
                fontFamily: "Poppins",
                fontWeight: 600,
                fontSize: "15px",
                padding: "14px 28px",
                borderRadius: "var(--radius-xl)",
                border: "1px solid rgba(255,255,255,0.3)",
                cursor: "pointer",
                transition: "background 0.2s",
                backdropFilter: "blur(4px)",
              }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.25)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.15)")}
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Right — AI Bot character + stats */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
            {/* AI Bot */}
            <div style={{
              fontSize: "80px",
              animation: "float 3s ease-in-out infinite",
              filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.2))",
              lineHeight: 1,
            }}>
              🤖
            </div>
            <div style={{ display: "flex", gap: "24px" }}>
              {[
                { val: "10K+", label: "Members" },
                { val: "50K+", label: "Plants Shared" },
                { val: "99%", label: "Satisfaction" },
              ].map((stat) => (
                <div key={stat.label} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "22px", color: "white" }}>{stat.val}</div>
                  <div style={{ fontFamily: "DM Sans", fontSize: "12px", color: "rgba(255,255,255,0.65)" }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer style={{
      background: "#1D3A18",
      color: "white",
      padding: "48px 0 28px",
    }}>
      <div className="container">
        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr",
          gap: "40px",
          marginBottom: "40px",
          flexWrap: "wrap",
        }}
          className="footer-grid"
        >
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <LeafIcon size={24} color="var(--color-green-light)" />
              <span style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "20px" }}>Hero</span>
            </div>
            <p style={{ fontFamily: "DM Sans", fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, maxWidth: "240px" }}>
              Your trusted partner for plants, seeds, and AI-powered plant care solutions.
            </p>
          </div>

          {[
            { title: "Shop", links: ["All Plants", "Seeds", "Supplies", "Gift Cards"] },
            { title: "Care", links: ["AI Care", "Plant Guide", "Watering Tips", "Blog"] },
            { title: "Company", links: ["About Us", "Careers", "Press", "Contact"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: "15px", marginBottom: "16px" }}>{col.title}</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {col.links.map((link) => (
                  <a key={link} href="#" style={{ fontFamily: "DM Sans", fontSize: "14px", color: "rgba(255,255,255,0.55)", transition: "color 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.1)",
          paddingTop: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}>
          <p style={{ fontFamily: "DM Sans", fontSize: "13px", color: "rgba(255,255,255,0.45)" }}>
            © 2026 Hero. All rights reserved. Made with 🌿
          </p>
          <div style={{ display: "flex", gap: "20px" }}>
            {["🌿", "🐦", "📸", "▶"].map((icon, i) => (
              <a key={i} href="#" style={{
                fontSize: "18px",
                color: "rgba(255,255,255,0.5)",
                transition: "color 0.2s",
              }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════ */
export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <CategoriesSection />
        <ProductsSection />
        <AICareSection />
        <CommunityBanner />
      </main>
      <Footer />
    </>
  );
}
