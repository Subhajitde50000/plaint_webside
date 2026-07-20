"use client";

import { useState } from "react";

export default function WhatsAppWidget() {
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

