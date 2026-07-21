"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CloudIcon, LeafShape, SunIcon, WaterDroplet } from "./icons";

export default function AICareSection() {
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
