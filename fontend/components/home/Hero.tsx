"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, LeafShape, WaterDroplet } from "./icons";

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

export default function HeroSection() {
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

