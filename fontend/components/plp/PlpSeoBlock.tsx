"use client";

import { useState } from "react";

export default function PlpSeoBlock() {
  const [expanded, setExpanded] = useState(false);

  const fullText = `Indoor plants transform living spaces with natural beauty and cleaner air. At Hero, we offer 500+ indoor plant varieties — from low-maintenance snake plants and pothos to dramatic fiddle leaf figs and rare aroids. Our plants are sourced from certified nurseries, quality-checked by horticulturists, and shipped in eco-friendly packaging to ensure they arrive healthy and thriving.

Whether you're a seasoned plant parent or just getting started, our curated collection has something for every light condition, lifestyle, and budget. Browse air-purifying plants for your bedroom, pet-friendly varieties for families, or sculptural statement plants to elevate your living room. Every order comes with a care guide and 7-day freshness guarantee.`;

  return (
    <section
      style={{
        background: "#fefcf9",
        padding: "64px 0",
        borderTop: "1px solid rgba(28,28,28,0.08)",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "0 48px",
        }}
        className="seo-block-container"
      >
        <h2
          style={{
            fontFamily: "Outfit, sans-serif",
            fontSize: "16px",
            fontWeight: 700,
            color: "#1c1c1c",
            marginBottom: "16px",
          }}
        >
          About Indoor Plants
        </h2>

        <div
          style={{
            position: "relative",
            maxHeight: expanded ? "none" : "96px",
            overflow: "hidden",
            transition: "max-height 300ms ease",
          }}
        >
          <p
            style={{
              fontFamily: "Outfit, sans-serif",
              fontSize: "14px",
              color: "rgba(33,35,38,0.80)",
              lineHeight: "22.4px",
              whiteSpace: "pre-line",
            }}
          >
            {fullText}
          </p>

          {/* Gradient fade when collapsed */}
          {!expanded && (
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "48px",
                background:
                  "linear-gradient(to bottom, transparent, #fefcf9)",
                pointerEvents: "none",
              }}
            />
          )}
        </div>

        <button
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          style={{
            marginTop: "12px",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "Outfit, sans-serif",
            fontSize: "14px",
            fontWeight: 500,
            color: "#00b566",
            textDecoration: "underline",
            padding: "0",
            outline: "none",
          }}
          onFocus={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.outline =
              "2px solid #00b566")
          }
          onBlur={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.outline = "none")
          }
        >
          {expanded ? "Read less" : "Read more"}
        </button>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .seo-block-container { padding: 0 24px !important; }
        }
        @media (max-width: 480px) {
          .seo-block-container { padding: 0 16px !important; }
        }
      `}</style>
    </section>
  );
}
