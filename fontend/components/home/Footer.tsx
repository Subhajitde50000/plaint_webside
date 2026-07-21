"use client";

import Link from "next/link";
import { LeafIcon } from "./icons";

export default function Footer() {
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

