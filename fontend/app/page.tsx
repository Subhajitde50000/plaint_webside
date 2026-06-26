"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import SharedNavbar from "@/components/Navbar";

/* ═══════════════════════════════════════════════════
   SVG ICONS
═══════════════════════════════════════════════════ */
function LeafIcon({ size = 24, color = "#2D5A27" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2C12 2 4 5 4 13C4 17.4 7.6 21 12 21C16.4 21 20 17.4 20 13C20 5 12 2 12 2Z" fill={color} opacity="0.9" />
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

function LeafShape({ color = "#A8C5A0", width = 40, height = 55, rotate = 0, opacity = 0.6 }: {
  color?: string; width?: number; height?: number; rotate?: number; opacity?: number;
}) {
  return (
    <svg width={width} height={height} viewBox="0 0 40 55" style={{ opacity, transform: `rotate(${rotate}deg)` }}>
      <path d="M20 50 C20 50 5 35 5 20 C5 8 12 2 20 2 C28 2 35 8 35 20 C35 35 20 50 20 50Z" fill={color} />
      <path d="M20 50 L20 5" stroke="white" strokeWidth="1" strokeOpacity="0.5" />
    </svg>
  );
}



/* ═══════════════════════════════════════════════════
   HERO SECTION — per-slide unique right-column visuals
═══════════════════════════════════════════════════ */
const heroSlides = [
  {
    heading: "Grow Your Green Space",
    sub: "Discover our handpicked collection of plants, seeds, and expert AI-powered care — for every home, every garden, every dream.",
    cta: "Shop Now",
    img: "/monstera.png",
    imgAlt: "Monstera plant in terracotta pot",
    blobColor: "radial-gradient(circle, #D4E8CE 0%, #EEF7EA 55%, transparent 80%)",
    showWateringCan: true,
    showDroplets: true,
  },
  {
    heading: "Flower Plants",
    sub: "Bring life and colour to your home with our stunning collection of flowering plants — from roses to orchids and beyond.",
    cta: "Explore Flowers",
    img: "/hero-flowers.png",
    imgAlt: "Blooming red roses in a vase",
    blobColor: "radial-gradient(circle, #F9D8D8 0%, #FDE8DC 55%, transparent 80%)",
    showWateringCan: false,
    showDroplets: false,
  },
  {
    heading: "Indoor Plants",
    sub: "Purify your air and elevate your interiors. Our indoor collection suits every corner, shelf, and window sill.",
    cta: "Shop Indoor",
    img: "/hero-indoor.png",
    imgAlt: "Snake plant and fiddle leaf fig in white pots",
    blobColor: "radial-gradient(circle, #C8DFC0 0%, #E0EDD8 55%, transparent 80%)",
    showWateringCan: false,
    showDroplets: false,
  },
  {
    heading: "Balcony Decor",
    sub: "Transform your balcony into a lush retreat. Hanging baskets, trailing vines, and colourful blooms await.",
    cta: "Shop Decor",
    img: "/hero-balcony.png",
    imgAlt: "Hanging planter basket with colorful flowers",
    blobColor: "radial-gradient(circle, #C8E8F4 0%, #DDF0F8 55%, transparent 80%)",
    showWateringCan: false,
    showDroplets: false,
  },
  {
    heading: "AI Smart Care",
    sub: "Meet your personal plant expert. Our AI companion monitors, reminds, and guides you to keep every plant thriving.",
    cta: "Try AI Care",
    img: "/hero-ai-robot.png",
    imgAlt: "Green AI robot with leaf ears holding a plant",
    blobColor: "radial-gradient(circle, #B2E8E0 0%, #D4F4F0 55%, transparent 80%)",
    showWateringCan: false,
    showDroplets: false,
  },
];

function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [prevSlide, setPrevSlide] = useState<number | null>(null);
  const [textVisible, setTextVisible] = useState(true);
  const [imgFading, setImgFading] = useState(false);
  const isHovered = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goToSlide = useCallback((idx: number) => {
    if (idx === activeSlide) return;
    // Fade out text
    setTextVisible(false);
    // Crossfade image
    setImgFading(true);
    setPrevSlide(activeSlide);

    setTimeout(() => {
      setActiveSlide(idx);
      setPrevSlide(null);
      setImgFading(false);
      // Fade text back in
      setTimeout(() => setTextVisible(true), 50);
    }, 350);
  }, [activeSlide]);

  // Auto-advance
  useEffect(() => {
    const startTimer = () => {
      timerRef.current = setInterval(() => {
        if (!isHovered.current) {
          setTextVisible(false);
          setImgFading(true);
          setPrevSlide((cur) => cur); // will be updated below
          setTimeout(() => {
            setActiveSlide((prev) => {
              const next = (prev + 1) % heroSlides.length;
              setPrevSlide(null);
              setImgFading(false);
              setTimeout(() => setTextVisible(true), 50);
              return next;
            });
          }, 350);
        }
      }, 4500);
    };
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const slide = heroSlides[activeSlide];
  const prev = prevSlide !== null ? heroSlides[prevSlide] : null;

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
      onMouseEnter={() => { isHovered.current = true; }}
      onMouseLeave={() => { isHovered.current = false; }}
    >
      {/* Background leaves */}
      <div style={{ position: "absolute", top: "10%", left: "2%", animation: "floatLeaf 5s ease-in-out infinite" }}><LeafShape color="#A8C5A0" width={45} height={60} rotate={-30} opacity={0.35} /></div>
      <div style={{ position: "absolute", top: "60%", left: "5%", animation: "floatLeaf 6s ease-in-out infinite 1s" }}><LeafShape color="#4A7C40" width={30} height={40} rotate={45} opacity={0.25} /></div>
      <div style={{ position: "absolute", top: "20%", right: "3%", animation: "floatLeaf 4.5s ease-in-out infinite 0.5s" }}><LeafShape color="#2D5A27" width={35} height={48} rotate={20} opacity={0.18} /></div>
      <div style={{ position: "absolute", bottom: "15%", left: "15%", animation: "floatLeaf 7s ease-in-out infinite 2s" }}><LeafShape color="#A8C5A0" width={25} height={35} rotate={-15} opacity={0.3} /></div>

      {/* Seed decorative */}
      {[{ top: "30%", left: "8%" }, { top: "70%", left: "20%" }, { top: "45%", right: "8%" }, { top: "80%", right: "20%" }].map((pos, i) => (
        <div key={i} style={{ position: "absolute", ...pos as React.CSSProperties, width: "12px", height: "18px", background: "#C4A882", borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", opacity: 0.22, animation: `float ${4 + i}s ease-in-out infinite ${i * 0.5}s` }} />
      ))}

      <div className="container hero-container" style={{ width: "100%" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", alignItems: "center", minHeight: "78vh" }} className="hero-grid">

          {/* ── LEFT: Text (fades up on slide change) ── */}
          <div className="hero-text-col" style={{
            position: "relative",
            zIndex: 2,
            opacity: textVisible ? 1 : 0,
            transform: textVisible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.3s ease, transform 0.3s ease",
          }}>
            {/* Sparkle stars */}
            <span style={{ position: "absolute", top: "-20px", left: "10px", fontSize: "22px", color: "var(--color-accent-yellow)", animation: "pulse-star 2s ease-in-out infinite" }} className="hero-leaf-accent">✦</span>
            <span style={{ position: "absolute", top: "40px", right: "60px", fontSize: "14px", color: "var(--color-accent-yellow)", animation: "pulse-star 2.5s ease-in-out infinite 0.5s" }} className="hero-leaf-accent">✦</span>
            <span style={{ position: "absolute", bottom: "60px", left: "30px", fontSize: "18px", color: "var(--color-accent-yellow)", animation: "pulse-star 3s ease-in-out infinite 1s" }} className="hero-leaf-accent">✦</span>

            <div style={{ marginBottom: "20px" }} className="hero-badge-wrap">
              <span className="badge-pill">🌿 Premium Plant Shop</span>
            </div>

            <h1 className="hero-title" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: "clamp(38px, 5vw, 64px)", color: "var(--color-green-dark)", lineHeight: 1.1, marginBottom: "20px", letterSpacing: "-0.5px" }}>
              {slide.heading}
            </h1>

            <p className="hero-desc" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "17px", color: "var(--color-text-secondary)", lineHeight: 1.7, marginBottom: "36px", maxWidth: "480px" }}>
              {slide.sub}
            </p>

            <div className="hero-btns-wrap" style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <Link href={slide.heading === "AI Smart Care" ? "/ai-care" : "/plants/monstera"} style={{ textDecoration: "none" }}>
                <button id="hero-shop-btn" className="btn-primary">{slide.cta} <ArrowRight /></button>
              </Link>
              <button id="hero-learn-btn" className="btn-outline">Learn More</button>
            </div>

            {/* Stats */}
            <div className="hero-stats" style={{ display: "flex", gap: "32px", marginTop: "48px", flexWrap: "wrap" }}>
              {[{ val: "500+", label: "Plant Varieties" }, { val: "10K+", label: "Happy Gardeners" }, { val: "4.9★", label: "Customer Rating" }].map((stat) => (
                <div key={stat.label}>
                  <div style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "24px", color: "var(--color-green-dark)" }}>{stat.val}</div>
                  <div style={{ fontFamily: "DM Sans", fontSize: "13px", color: "var(--color-text-secondary)" }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Visual (crossfade on slide change) ── */}
          <div className="hero-visual-col" style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
            {/* Blob (transitions with slide color) */}
            <div className="hero-blob" style={{
              position: "absolute",
              background: slide.blobColor,
              borderRadius: "50%",
              zIndex: 0,
              transition: "background 0.5s ease",
            }} />

            {/* Previous image fading OUT during crossfade */}
            {prev && imgFading && (
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2, opacity: 0, transition: "opacity 0.35s ease" }}>
                <Image src={prev.img} alt={prev.imgAlt} width={400} height={460} sizes="(max-width:768px) 80vw, 400px" style={{ objectFit: "contain" }} priority />
              </div>
            )}

            {/* Current image fading IN */}
            <div className="hero-main-img-wrap" style={{
              position: "relative",
              zIndex: 3,
              opacity: imgFading ? 0 : 1,
              transform: imgFading ? "scale(0.97)" : "scale(1)",
              transition: "opacity 0.35s ease, transform 0.35s ease",
              animation: !imgFading ? "float 3.5s ease-in-out infinite" : "none",
              filter: "drop-shadow(0 20px 40px rgba(45,90,39,0.18))",
            }}>
              <Image
                src={slide.img}
                alt={slide.imgAlt}
                width={420}
                height={480}
                sizes="(max-width:768px) 80vw, 420px"
                priority
                style={{ objectFit: "contain", width: "auto", height: "auto", maxWidth: "420px", maxHeight: "480px" }}
              />
            </div>

            {/* Watering can (only slide 0) */}
            {slide.showWateringCan && (
              <div className="hero-watering-can" style={{ position: "absolute", bottom: "5%", left: "-5%", zIndex: 4, animation: "sway 3s ease-in-out infinite", transformOrigin: "bottom center" }}>
                <Image src="/watering-can.png" alt="Cute watering can character" width={140} height={140} sizes="140px" style={{ objectFit: "contain" }} />
              </div>
            )}

            {/* Water droplets (only slide 0) */}
            {slide.showDroplets && [0, 0.3, 0.6].map((delay, i) => (
              <div key={i} className="hero-droplet" style={{ position: "absolute", left: `${5 + i * 5}%`, bottom: `${10 + i * 8}%`, animation: `drip 1.5s ease-in infinite ${delay}s`, zIndex: 5 }}>
                <WaterDroplet size={12 + i * 4} color="#6BBDE3" />
              </div>
            ))}

            {/* Floating leaf accents */}
            <div className="hero-leaf-accent" style={{ position: "absolute", top: "5%", right: "5%", animation: "floatLeaf 4s ease-in-out infinite 1s" }}><LeafShape color="#4A7C40" width={30} height={40} rotate={25} opacity={0.7} /></div>
            <div className="hero-leaf-accent" style={{ position: "absolute", top: "35%", right: "-2%", animation: "floatLeaf 5s ease-in-out infinite" }}><LeafShape color="#A8C5A0" width={22} height={30} rotate={-10} opacity={0.6} /></div>
            <div className="hero-leaf-accent" style={{ position: "absolute", bottom: "30%", right: "8%", animation: "floatLeaf 3.5s ease-in-out infinite 2s" }}><LeafShape color="#2D5A27" width={18} height={25} rotate={40} opacity={0.5} /></div>

            {/* Yellow sparkle */}
            <span style={{ position: "absolute", top: "12%", left: "15%", fontSize: "28px", color: "var(--color-accent-yellow)", animation: "pulse-star 2s ease-in-out infinite", zIndex: 5 }} className="hero-leaf-accent">✦</span>
          </div>
        </div>

        {/* ── Carousel Dots ── */}
        <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "40px" }}>
          {heroSlides.map((_, i) => (
            <button
              key={i}
              id={`hero-dot-${i}`}
              onClick={() => goToSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
              style={{
                width: activeSlide === i ? "32px" : "10px",
                height: "10px",
                borderRadius: "999px",
                background: activeSlide === i ? "var(--color-green-dark)" : "#C8C0B0",
                border: "none",
                cursor: "pointer",
                transition: "width 0.25s ease, background 0.25s ease",
                padding: 0,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        .hero-container {
          padding: 80px 48px;
        }
        .hero-blob {
          width: 500px;
          height: 500px;
        }
        .hero-visual-col {
          min-height: 480px;
        }
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; text-align: center; }
          .hero-container {
            padding: 40px 16px !important;
          }
          .hero-desc {
            margin: 0 auto 28px !important;
          }
          .hero-badge-wrap {
            display: flex;
            justify-content: center;
          }
          .hero-btns-wrap {
            justify-content: center !important;
          }
          .hero-stats {
            justify-content: center !important;
            gap: 16px !important;
            margin-top: 32px !important;
          }
          .hero-visual-col {
            min-height: 320px !important;
            margin-top: 24px;
          }
          .hero-blob {
            width: 280px !important;
            height: 280px !important;
          }
          .hero-main-img-wrap img {
            max-height: 280px !important;
            max-width: 240px !important;
          }
          .hero-watering-can {
            width: 90px !important;
            height: 90px !important;
            left: 5% !important;
            bottom: 5% !important;
          }
          .hero-watering-can img {
            width: 90px !important;
            height: 90px !important;
          }
          .hero-droplet {
            display: none !important;
          }
          .hero-leaf-accent {
            display: none !important;
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
    const idx = Math.round(scrollRef.current.scrollLeft / 324);
    setActiveDot(Math.min(idx, categories.length - 1));
  };

  const addToCart = (qty = 1) => {
    try {
      const cur = typeof window !== "undefined" ? Number(window.localStorage.getItem("cartCount") || 0) : 0;
      const next = cur + qty;
      if (typeof window !== "undefined") {
        window.localStorage.setItem("cartCount", String(next));
        window.dispatchEvent(new CustomEvent("cart:changed", { detail: next }));
      }
    } catch (e) {
      // ignore
    }
  };

  return (
    <section id="categories-section" style={{ background: "var(--color-bg-secondary)", padding: "var(--space-xl) 0", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "10%", left: "2%", opacity: 0.15 }}><LeafShape color="#4A7C40" width={80} height={110} rotate={-20} opacity={1} /></div>
      <div style={{ position: "absolute", bottom: "5%", right: "3%", opacity: 0.12 }}><LeafShape color="#2D5A27" width={100} height={130} rotate={30} opacity={1} /></div>

      <div className="container">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "40px" }}>
          <div>
            <div style={{ marginBottom: "8px" }}><span className="badge-pill">🌱 Browse by Category</span></div>
            <h2 className="section-title">Our Green Categories</h2>
          </div>
          <a id="see-all-categories-link" href="#"
            style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "Poppins", fontWeight: 600, fontSize: "15px", color: "var(--color-green-dark)", transition: "gap 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.gap = "12px")}
            onMouseLeave={(e) => (e.currentTarget.style.gap = "8px")}
          >See it all <ArrowRight /></a>
        </div>

        <div ref={scrollRef} onScroll={handleScroll}
          style={{ display: "flex", gap: "24px", overflowX: "auto", scrollSnapType: "x mandatory", scrollbarWidth: "none", msOverflowStyle: "none", paddingBottom: "8px" }}
        >
          {categories.map((cat) => (
            <Link key={cat.id} href={`/plants/${cat.id}`} style={{ textDecoration: "none", flex: "0 0 auto" }}>
            <div id={`cat-card-${cat.id}`}
              style={{ minWidth: "280px", maxWidth: "300px", background: "var(--color-white)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-card)", overflow: "hidden", scrollSnapAlign: "start", cursor: "pointer", transition: "transform 0.25s ease, box-shadow 0.25s ease" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "scale(1.03) translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 16px 48px rgba(45,90,39,0.18)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "scale(1)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-card)"; }}
            >
              <div style={{ height: "260px", overflow: "hidden", position: "relative" }}>
                <Image src={cat.img} alt={cat.label} fill sizes="300px" style={{ objectFit: "cover", transition: "transform 0.4s ease" }} />
              </div>
              <div style={{ padding: "20px", textAlign: "center" }}>
                <div style={{ fontSize: "28px", marginBottom: "8px" }}>{cat.emoji}</div>
                <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "18px", color: "var(--color-text-primary)", marginBottom: "6px" }}>{cat.label}</h3>
                <span style={{ fontSize: "13px", color: "var(--color-text-secondary)", fontFamily: "DM Sans" }}>Shop Collection →</span>
              </div>
            </div>
            </Link>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "32px" }}>
          {[...Array(5)].map((_, i) => (
            <button key={i} id={`cat-dot-${i}`}
              onClick={() => { setActiveDot(i); if (scrollRef.current) scrollRef.current.scrollTo({ left: i * 324, behavior: "smooth" }); }}
              aria-label={`Category page ${i + 1}`}
              style={{ width: activeDot === i ? "32px" : "10px", height: "10px", borderRadius: "999px", background: activeDot === i ? "var(--color-green-dark)" : "#C8C0B0", border: "none", cursor: "pointer", transition: "width 0.25s ease, background 0.25s ease", padding: 0 }}
            />
          ))}
        </div>

        {/* Extra Rows: Plant types, Seeds, Soil/Tools & Pots */}
        <div style={{ marginTop: "40px", display: "flex", flexDirection: "column", gap: "28px" }}>
          {/* Plant Types Row */}
          <div>
            <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "18px", color: "var(--color-text-primary)", marginBottom: "12px" }}>Plant Types</h3>
            <div style={{ display: "flex", gap: "18px", overflowX: "auto", paddingBottom: "8px" }}>
              {[
                { id: "indoor", label: "Indoor Plants", emoji: "🏠", img: "/cat-indoor.png", price: 24.99 },
                { id: "flowers", label: "Flower Plants", emoji: "🌸", img: "/cat-flowers.png", price: 29.99, discount: 0.15 },
                { id: "succulents", label: "Succulents", emoji: "🌵", img: "/cat-succulents.png", price: 18.5 },
                { id: "balcony", label: "Balcony Decor", emoji: "🌿", img: "/cat-balcony.png", price: 34.0, discount: 0.1 },
                { id: "terrarium", label: "Terrarium Kits", emoji: "🧪", img: "/product-soil.png", price: 44.0 },
                { id: "hanging", label: "Hanging Plants", emoji: "🪢", img: "/cat-balcony.png", price: 27.5, discount: 0.2 },
              ].map((it: any) => (
                <Link key={it.id} href={`/plants/${it.id}`} style={{ textDecoration: "none", flex: "0 0 auto" }}>
                  <div style={{ minWidth: "220px", background: "var(--color-white)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-card)", overflow: "hidden", cursor: "pointer" }}>
                    <div style={{ height: "140px", position: "relative", background: "#f6f6f4" }}>
                      <Image src={it.img} alt={it.label} fill sizes="220px" style={{ objectFit: "cover" }} />
                    </div>
                    <div style={{ padding: "12px", textAlign: "center" }}>
                      <div style={{ fontSize: "22px", marginBottom: "6px" }}>{it.emoji}</div>
                      <div style={{ fontFamily: "Poppins", fontWeight: 700, color: "var(--color-text-primary)" }}>{it.label}</div>
                      {/* Price display */}
                      <div style={{ marginTop: "10px" }}>
                        {typeof it.price === "number" && (
                          (() => {
                            const hasDiscount = typeof it.discount === "number" && it.discount > 0;
                            const original = `$${it.price.toFixed(2)}`;
                            const newPrice = hasDiscount ? `$${(it.price * (1 - it.discount)).toFixed(2)}` : null;
                            return (
                              <div>
                                {hasDiscount ? (
                                  <div style={{ display: "flex", justifyContent: "center", gap: "8px", alignItems: "center" }}>
                                    <span style={{ textDecoration: "line-through", color: "#9B9B9B", fontSize: "13px" }}>{original}</span>
                                    <span style={{ fontFamily: "Poppins", fontWeight: 700, color: "var(--color-green-dark)" }}>{newPrice}</span>
                                  </div>
                                ) : (
                                  <div style={{ fontFamily: "Poppins", fontWeight: 700, color: "var(--color-green-dark)" }}>{original}</div>
                                )}
                              </div>
                            );
                          })()
                        )}
                        <div>
                          <button onClick={(e) => { e.preventDefault(); addToCart(1); }}
                            style={{ marginTop: "8px", background: "var(--color-green-dark)", color: "white", border: "none", padding: "8px 14px", borderRadius: "999px", cursor: "pointer", fontFamily: "Poppins", fontWeight: 700 }}>
                            + Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Seed Types Row */}
          <div>
            <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "18px", color: "var(--color-text-primary)", marginBottom: "12px" }}>Seed Types</h3>
            <div style={{ display: "flex", gap: "18px", overflowX: "auto", paddingBottom: "8px" }}>
              {[
                { id: "wildflower", label: "Wildflower Mix", img: "/product-seeds.png", price: 12.99, discount: 0.1 },
                { id: "herbs", label: "Herb Seeds", img: "/product-seeds.png", price: 8.5 },
                { id: "veggies", label: "Vegetable Seeds", img: "/product-seeds.png", price: 9.99, discount: 0.2 },
                { id: "microgreen", label: "Microgreen Pack", img: "/product-seeds.png", price: 6.5 },
                { id: "flower-seed-small", label: "Petite Flower Pack", img: "/product-seeds.png", price: 7.99 },
              ].map((it: any) => (
                <Link key={it.id} href={`/products/${it.id}`} style={{ textDecoration: "none", flex: "0 0 auto" }}>
                  <div style={{ minWidth: "200px", background: "var(--color-white)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-card)", overflow: "hidden", cursor: "pointer" }}>
                    <div style={{ height: "120px", position: "relative", background: "#faf8f6" }}>
                      <Image src={it.img} alt={it.label} fill sizes="200px" style={{ objectFit: "cover" }} />
                    </div>
                    <div style={{ padding: "10px", textAlign: "center" }}>
                      <div style={{ fontFamily: "Poppins", fontWeight: 700, color: "var(--color-text-primary)" }}>{it.label}</div>
                      {/* Price & discount */}
                      <div style={{ marginTop: "10px" }}>
                        {typeof it.price === "number" && (
                          (() => {
                            const hasDiscount = typeof it.discount === "number" && it.discount > 0;
                            const original = `$${it.price.toFixed(2)}`;
                            const newPrice = hasDiscount ? `$${(it.price * (1 - it.discount)).toFixed(2)}` : null;
                            return (
                              <div>
                                {hasDiscount ? (
                                  <div style={{ display: "flex", justifyContent: "center", gap: "8px", alignItems: "center" }}>
                                    <span style={{ textDecoration: "line-through", color: "#9B9B9B", fontSize: "13px" }}>{original}</span>
                                    <span style={{ fontFamily: "Poppins", fontWeight: 700, color: "var(--color-green-dark)" }}>{newPrice}</span>
                                  </div>
                                ) : (
                                  <div style={{ fontFamily: "Poppins", fontWeight: 700, color: "var(--color-green-dark)" }}>{original}</div>
                                )}
                              </div>
                            );
                          })()
                        )}
                        <div>
                          <button onClick={(e) => { e.preventDefault(); addToCart(1); }}
                            style={{ marginTop: "8px", background: "var(--color-green-dark)", color: "white", border: "none", padding: "8px 14px", borderRadius: "999px", cursor: "pointer", fontFamily: "Poppins", fontWeight: 700 }}>
                            + Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Soil, Tools & Pots Row */}
          <div>
            <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "18px", color: "var(--color-text-primary)", marginBottom: "12px" }}>Soil, Tools & Pots</h3>
            <div style={{ display: "flex", gap: "18px", overflowX: "auto", paddingBottom: "8px" }}>
              {[
                { id: "soil", label: "Potting Mix", img: "/product-soil.png", price: 18.5, discount: 0.12 },
                { id: "tools", label: "Tools & Spray", img: "/product-spray.png", price: 9.99 },
                { id: "pots", label: "Pots & Planters", img: "/product-soil.png", price: 22.0 },
                { id: "fertilizer-small", label: "Mini Fertilizer", img: "/product-fertilizer.png", price: 7.5 },
                { id: "grow-bag", label: "Grow Bag", img: "/product-soil.png", price: 11.25, discount: 0.05 },
              ].map((it: any) => (
                <Link key={it.id} href={`/products/${it.id}`} style={{ textDecoration: "none", flex: "0 0 auto" }}>
                  <div style={{ minWidth: "200px", background: "var(--color-white)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-card)", overflow: "hidden", cursor: "pointer" }}>
                    <div style={{ height: "120px", position: "relative", background: "#f9f7f3" }}>
                      <Image src={it.img} alt={it.label} fill sizes="200px" style={{ objectFit: "cover" }} />
                    </div>
                    <div style={{ padding: "10px", textAlign: "center" }}>
                      <div style={{ fontFamily: "Poppins", fontWeight: 700, color: "var(--color-text-primary)" }}>{it.label}</div>
                      <div style={{ marginTop: "10px" }}>
                        {typeof it.price === "number" && (
                          (() => {
                            const hasDiscount = typeof it.discount === "number" && it.discount > 0;
                            const original = `$${it.price.toFixed(2)}`;
                            const newPrice = hasDiscount ? `$${(it.price * (1 - it.discount)).toFixed(2)}` : null;
                            return (
                              <div>
                                {hasDiscount ? (
                                  <div style={{ display: "flex", justifyContent: "center", gap: "8px", alignItems: "center" }}>
                                    <span style={{ textDecoration: "line-through", color: "#9B9B9B", fontSize: "13px" }}>{original}</span>
                                    <span style={{ fontFamily: "Poppins", fontWeight: 700, color: "var(--color-green-dark)" }}>{newPrice}</span>
                                  </div>
                                ) : (
                                  <div style={{ fontFamily: "Poppins", fontWeight: 700, color: "var(--color-green-dark)" }}>{original}</div>
                                )}
                              </div>
                            );
                          })()
                        )}
                        <div>
                          <button onClick={(e) => { e.preventDefault(); addToCart(1); }}
                            style={{ marginTop: "8px", background: "var(--color-green-dark)", color: "white", border: "none", padding: "8px 14px", borderRadius: "999px", cursor: "pointer", fontFamily: "Poppins", fontWeight: 700 }}>
                            + Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
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
  const [query, setQuery] = useState("");

  return (
    <section id="products-section" style={{ background: "var(--color-bg-primary)", padding: "var(--space-xl) 0", position: "relative" }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "64px", alignItems: "center" }} className="products-grid">
          {/* Left */}
          <div>
            <div style={{ marginBottom: "16px" }}><span className="badge-pill">🛒 Shop Essentials</span></div>
            <h2 className="section-title" style={{ marginBottom: "16px" }}>Everything<br />You Need</h2>
            <p style={{ fontFamily: "DM Sans", fontSize: "16px", color: "var(--color-text-secondary)", lineHeight: 1.7, marginBottom: "32px", maxWidth: "360px" }}>
              From rare seeds to premium soils and expert-tested plant nutrients — your one-stop plant supply shop.
            </p>
            <div style={{ display: "flex", background: "white", borderRadius: "var(--radius-full)", padding: "6px 6px 6px 20px", boxShadow: "var(--shadow-card)", gap: "8px", alignItems: "center", maxWidth: "420px" }} className="products-search-wrap">
              <SearchIcon />
              <input id="search-order-input" type="text" placeholder="Search products…" value={query} onChange={(e) => setQuery(e.target.value)}
                style={{ flex: 1, border: "none", outline: "none", fontFamily: "DM Sans", fontSize: "15px", color: "var(--color-text-primary)", background: "transparent" }}
              />
              <button id="subscribe-btn" className="btn-primary" style={{ padding: "10px 24px", fontSize: "14px" }}>Subscribe</button>
            </div>
            <p style={{ fontFamily: "DM Sans", fontSize: "13px", color: "var(--color-text-secondary)", marginTop: "12px" }}>🌱 Get weekly plant care tips & exclusive deals</p>
          </div>

          {/* Right — Product Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }} className="products-right-grid">
            {products.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`} style={{ textDecoration: "none" }}>
              <div id={`product-${product.id}`}
                style={{ background: "white", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-card)", overflow: "hidden", cursor: "pointer", transition: "transform 0.25s ease, box-shadow 0.25s ease", position: "relative" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "scale(1.03) translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 40px rgba(45,90,39,0.15)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "scale(1)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-card)"; }}
              >
                <div style={{ position: "absolute", top: "10px", left: "10px", background: "var(--color-green-dark)", color: "white", fontFamily: "Poppins", fontWeight: 600, fontSize: "11px", padding: "3px 10px", borderRadius: "var(--radius-full)", zIndex: 2 }}>{product.badge}</div>
                <div style={{ height: "150px", position: "relative", background: "var(--color-bg-secondary)" }}>
                  <Image src={product.img} alt={product.name} fill sizes="(max-width:768px) 50vw, 200px" style={{ objectFit: "cover" }} />
                </div>
                <div style={{ padding: "14px 16px" }}>
                  <h4 style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: "14px", color: "var(--color-text-primary)", marginBottom: "4px" }}>{product.name}</h4>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "16px", color: "var(--color-green-dark)" }}>{product.price}</span>
                    <button onClick={(e) => e.preventDefault()} style={{ background: "var(--color-green-pale)", border: "none", borderRadius: "50%", width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "18px", color: "var(--color-green-dark)", transition: "background 0.2s" }}>+</button>
                  </div>
                </div>
              </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) { .products-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 480px) {
          .products-right-grid {
            grid-template-columns: 1fr !important;
          }
          .products-search-wrap {
            padding: 4px 4px 4px 12px !important;
            gap: 4px !important;
          }
          .products-search-wrap input {
            font-size: 13px !important;
          }
          .products-search-wrap button {
            padding: 8px 16px !important;
            font-size: 12px !important;
          }
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
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.2 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="ai-care-section" ref={sectionRef}
      style={{ background: "linear-gradient(135deg, #EEF7EA 0%, var(--color-bg-secondary) 100%)", padding: "var(--space-xl) 0", position: "relative", overflow: "hidden" }}
    >
      <div style={{ position: "absolute", top: "5%", right: "0%", opacity: 0.08 }}><LeafShape color="#2D5A27" width={160} height={220} rotate={-40} opacity={1} /></div>
      <div style={{ position: "absolute", bottom: "5%", left: "0%", opacity: 0.08 }}><LeafShape color="#4A7C40" width={120} height={160} rotate={30} opacity={1} /></div>

      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "center" }} className="ai-grid">

          {/* Left — Phone Mockup */}
          <div style={{ display: "flex", justifyContent: "center", position: "relative", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(48px)", transition: "opacity 0.7s ease, transform 0.7s ease" }}>
            <div style={{ width: "280px", background: "#1A1A1A", borderRadius: "40px", padding: "12px", boxShadow: "0 24px 60px rgba(0,0,0,0.25), inset 0 0 0 1px rgba(255,255,255,0.1)", position: "relative", zIndex: 2 }} className="ai-phone-mockup">
              <div style={{ width: "100px", height: "28px", background: "#1A1A1A", borderRadius: "16px", margin: "0 auto 8px", position: "relative", zIndex: 3 }} />
              <div style={{ background: "#F0F8F0", borderRadius: "28px", overflow: "hidden", minHeight: "440px", padding: "16px" }}>
                <Image src="/ai-phone.png" alt="Smart Care AI interface" width={256} height={440} sizes="256px" style={{ width: "100%", height: "auto", borderRadius: "20px" }} />
              </div>
            </div>

            <div style={{ position: "absolute", top: "-20px", right: "20px", animation: "float 2.5s ease-in-out infinite", background: "rgba(107,189,227,0.15)", borderRadius: "50%", padding: "10px", backdropFilter: "blur(4px)", border: "1px solid rgba(107,189,227,0.3)" }} className="ai-float-icon">
              <WaterDroplet size={28} color="#6BBDE3" />
            </div>
            <div style={{ position: "absolute", top: "20px", right: "-60px", animation: "float 4s ease-in-out infinite 1s", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))" }} className="ai-float-icon">
              <CloudIcon />
            </div>
            <div style={{ position: "absolute", bottom: "80px", right: "-40px", animation: "float 3s ease-in-out infinite 0.5s" }} className="ai-float-icon">
              <SunIcon size={44} />
            </div>
            <div style={{ position: "absolute", bottom: "20px", right: "10px", animation: "drip 2s ease-in infinite 0.5s" }} className="ai-float-icon">
              <WaterDroplet size={20} color="#6BBDE3" />
            </div>
            <span style={{ position: "absolute", top: "40%", left: "-20px", fontSize: "24px", color: "var(--color-accent-yellow)", animation: "pulse-star 2s ease-in-out infinite" }} className="ai-float-icon">✦</span>

            {/* Animated dashed arcs */}
            <svg style={{ position: "absolute", top: "0", left: "0", width: "100%", height: "100%", pointerEvents: "none", zIndex: 1 }} viewBox="0 0 400 500" fill="none" className="ai-float-icon">
              <path d="M 300 100 Q 380 200 360 350" stroke="var(--color-green-light)" strokeWidth="2" strokeDasharray="8 6" strokeLinecap="round">
                <animate attributeName="stroke-dashoffset" from="200" to="0" dur="3s" repeatCount="indefinite" />
              </path>
              <path d="M 300 380 Q 350 300 340 200" stroke="var(--color-accent-blue)" strokeWidth="1.5" strokeDasharray="6 5" strokeLinecap="round">
                <animate attributeName="stroke-dashoffset" from="0" to="150" dur="4s" repeatCount="indefinite" />
              </path>
            </svg>
          </div>

          {/* Right — Text */}
          <div style={{ opacity: visible ? 1 : 0, transform: visible ? "translateX(0)" : "translateX(32px)", transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s" }} className="ai-text-col">
            <div style={{ marginBottom: "20px" }}><span className="badge-pill">🤖 Smart Care with AI 🌿</span></div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: "clamp(32px, 4vw, 52px)", color: "var(--color-green-dark)", lineHeight: 1.1, marginBottom: "20px" }}>
              Never Let a<br />Plant Die Again.
            </h2>
            <p style={{ fontFamily: "DM Sans", fontSize: "16px", color: "var(--color-text-secondary)", lineHeight: 1.8, marginBottom: "32px", maxWidth: "420px" }}>
              Our AI companion monitors your plants around the clock — sending personalized watering reminders, sunlight tips, and growth insights directly to your phone.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "36px" }}>
              {[
                { icon: "💧", text: "Smart watering reminders based on weather & soil" },
                { icon: "📈", text: "Real-time growth tracking & health scores" },
                { icon: "☀️", text: "Sunlight & climate personalized care plans" },
                { icon: "🤖", text: "AI chat for instant plant advice anytime" },
              ].map((feat) => (
                <div key={feat.text} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "20px", width: "40px", height: "40px", background: "var(--color-green-pale)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{feat.icon}</span>
                  <span style={{ fontFamily: "DM Sans", fontSize: "15px", color: "var(--color-text-secondary)" }}>{feat.text}</span>
                </div>
              ))}
            </div>
            <Link href="/ai-care" style={{ textDecoration: "none" }}>
              <button id="ai-shop-btn" className="btn-primary">Try AI Care Free <ArrowRight /></button>
            </Link>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .ai-grid { grid-template-columns: 1fr !important; }
          .ai-float-icon { display: none !important; }
          .ai-text-col { text-align: center !important; display: flex; flex-direction: column; align-items: center; }
          .ai-text-col p { max-width: 100% !important; }
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
    <section id="community-section" style={{ background: "var(--color-green-dark)", padding: "64px 0", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: "-30px", top: "-20px", opacity: 0.15 }}><LeafShape color="#A8C5A0" width={120} height={160} rotate={-20} opacity={1} /></div>
      <div style={{ position: "absolute", left: "40px", bottom: "-10px", opacity: 0.1 }}><LeafShape color="#D4E8CE" width={80} height={110} rotate={30} opacity={1} /></div>
      <div style={{ position: "absolute", right: "120px", top: "-20px", opacity: 0.12 }}><LeafShape color="#A8C5A0" width={100} height={140} rotate={15} opacity={1} /></div>
      <div style={{ position: "absolute", right: "-20px", top: "0", opacity: 0.1 }}><LeafShape color="#D4E8CE" width={140} height={190} rotate={-10} opacity={1} /></div>

      <span style={{ position: "absolute", top: "20px", left: "25%", fontSize: "20px", color: "var(--color-accent-yellow)", animation: "pulse-star 2.5s ease-in-out infinite", opacity: 0.7 }}>✦</span>
      <span style={{ position: "absolute", bottom: "20px", right: "30%", fontSize: "14px", color: "var(--color-accent-yellow)", animation: "pulse-star 3s ease-in-out infinite 1s", opacity: 0.7 }}>✦</span>

      <div className="container" style={{ position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "40px", flexWrap: "wrap" }} className="community-flex">
          <div style={{ flex: 1, minWidth: "300px" }} className="community-left">
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: "clamp(28px, 4vw, 48px)", color: "white", lineHeight: 1.1, marginBottom: "16px" }} className="community-title">
              Join Our Green<br />Community
            </h2>
            <p style={{ fontFamily: "DM Sans", fontSize: "17px", color: "rgba(255,255,255,0.75)", lineHeight: 1.7, marginBottom: "28px", maxWidth: "480px" }} className="community-text">
              Connect with 10,000+ plant lovers. Share your garden journey, get expert advice, and grow together. 🌿
            </p>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }} className="community-btns">
              <button id="join-community-btn"
                style={{ background: "white", color: "var(--color-green-dark)", fontFamily: "Poppins", fontWeight: 700, fontSize: "15px", padding: "14px 32px", borderRadius: "var(--radius-xl)", border: "none", cursor: "pointer", boxShadow: "0 4px 16px rgba(0,0,0,0.2)", transition: "transform 0.2s ease, box-shadow 0.2s ease", display: "flex", alignItems: "center", gap: "8px" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.03)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.3)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.2)"; }}
              >Join for Free <ArrowRight /></button>
              <button id="learn-more-community-btn"
                style={{ background: "rgba(255,255,255,0.15)", color: "white", fontFamily: "Poppins", fontWeight: 600, fontSize: "15px", padding: "14px 28px", borderRadius: "var(--radius-xl)", border: "1px solid rgba(255,255,255,0.3)", cursor: "pointer", transition: "background 0.2s", backdropFilter: "blur(4px)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.25)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.15)")}
              >Learn More</button>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }} className="community-right">
            <div style={{ fontSize: "80px", animation: "float 3s ease-in-out infinite", filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.2))", lineHeight: 1 }}>🤖</div>
            <div style={{ display: "flex", gap: "24px" }} className="community-stats-wrap">
              {[{ val: "10K+", label: "Members" }, { val: "50K+", label: "Plants Shared" }, { val: "99%", label: "Satisfaction" }].map((stat) => (
                <div key={stat.label} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "22px", color: "white" }}>{stat.val}</div>
                  <div style={{ fontFamily: "DM Sans", fontSize: "12px", color: "rgba(255,255,255,0.65)" }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .community-flex {
            flex-direction: column !important;
            text-align: center !important;
            gap: 32px !important;
          }
          .community-left {
            min-width: 100% !important;
          }
          .community-btns {
            justify-content: center !important;
          }
          .community-title br {
            display: none !important;
          }
          .community-text {
            max-width: 100% !important;
          }
          .community-stats-wrap {
            gap: 12px !important;
          }
        }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer style={{ background: "#1D3A18", color: "white", padding: "48px 0 28px" }} className="footer-wrap">
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "40px", marginBottom: "40px" }} className="footer-grid">
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
                  <Link key={link} href={link === "AI Care" ? "/ai-care" : "#"} style={{ fontFamily: "DM Sans", fontSize: "14px", color: "rgba(255,255,255,0.55)", transition: "color 0.2s", textDecoration: "none" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
                  >{link}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }} className="footer-bottom">
          <p style={{ fontFamily: "DM Sans", fontSize: "13px", color: "rgba(255,255,255,0.45)" }}>© 2026 Hero. All rights reserved. Made with 🌿</p>
          <div style={{ display: "flex", gap: "20px" }}>
            {["🌿", "🐦", "📸", "▶"].map((icon, i) => (
              <a key={i} href="#" style={{ fontSize: "18px", color: "rgba(255,255,255,0.5)", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
              >{icon}</a>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .footer-wrap { padding: 40px 16px 20px !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
          .footer-bottom {
            flex-direction: column !important;
            text-align: center !important;
            gap: 16px !important;
          }
        }
        @media (max-width: 480px) { .footer-grid { grid-template-columns: 1fr !important; } }
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
      <SharedNavbar cartCount={3} />
      <main>
        <HeroSection />
        <CategoriesSection />
        <ProductsSection />
        <AICareSection />
        <CommunityBanner />
      </main>
      <Footer />
      <WhatsAppWidget />
    </>
  );
}

function WhatsAppWidget() {
  const [open, setOpen] = useState(false);
  const phone = "0170637279744";
  const waUrl = `https://wa.me/${phone}`;

  return (
    <div>
      <style>{`
        @media (max-width: 768px) {
          .wa-floating-panel {
            bottom: calc(88px + 60px + env(safe-area-inset-bottom, 0px)) !important;
            right: 16px !important;
          }
          .wa-floating-btn {
            bottom: calc(20px + 60px + env(safe-area-inset-bottom, 0px)) !important;
            right: 16px !important;
          }
        }
      `}</style>

      {/* Panel */}
      <div className="wa-floating-panel" style={{ position: "fixed", right: 20, bottom: 88, zIndex: 9999, transition: "opacity 0.2s", opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none" }}>
        <div style={{ width: 300, background: "white", borderRadius: 12, boxShadow: "0 12px 36px rgba(0,0,0,0.18)", overflow: "hidden", fontFamily: "DM Sans" }}>
          <div style={{ padding: "14px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
            <div>
              <div style={{ fontFamily: "Poppins", fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 4 }}>Hi! How can we help you?</div>
              <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>Typically replies in few minutes</div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close" style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 16 }}>✕</button>
          </div>
          <div style={{ padding: 12, display: "flex", gap: 8, flexDirection: "column" }}>
            <a href={waUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
              <button style={{ width: "100%", background: "#25D366", color: "white", border: "none", padding: "10px 12px", borderRadius: 8, fontFamily: "Poppins", fontWeight: 700, cursor: "pointer" }}>Start Chat</button>
            </a>
            <a href="https://sagepilot.ai/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "inline-block", textAlign: "center" }}>
              <button style={{ width: "100%", background: "transparent", color: "#6B7280", border: "1px solid #E5E7EB", padding: "8px 12px", borderRadius: 8, fontFamily: "Poppins", fontWeight: 600, cursor: "pointer" }}>Powered by SagePilot</button>
            </a>
          </div>
        </div>
      </div>

      {/* Floating Button */}
      <div className="wa-floating-btn" style={{ position: "fixed", right: 20, bottom: 20, zIndex: 9999 }}>
        <button onClick={() => setOpen((s) => !s)} aria-label={open ? "Close chat" : "Open WhatsApp chat"} style={{ width: 56, height: 56, borderRadius: 999, background: "#25D366", border: "none", boxShadow: "0 8px 24px rgba(37,211,102,0.28)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          {open ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <line x1="4" y1="4" x2="20" y2="20" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
              <line x1="20" y1="4" x2="4" y2="20" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="12" cy="12" r="11" fill="#25D366" />
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.149-.672.15-.198.297-.768.967-.942 1.167-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.654-2.058-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.672-1.611-.92-2.206-.242-.579-.487-.5-.672-.51l-.573-.01c-.198 0-.52.074-.793.372s-1.04 1.016-1.04 2.479 1.064 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487 1.355.586 1.912.621 2.592.52.397-.066 1.758-.718 2.006-1.412.248-.695.248-1.29.173-1.412-.074-.123-.272-.198-.57-.347z" fill="white" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
