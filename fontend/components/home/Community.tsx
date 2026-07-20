"use client";

import { ArrowRight, LeafShape } from "./icons";

export default function CommunityBanner() {
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

