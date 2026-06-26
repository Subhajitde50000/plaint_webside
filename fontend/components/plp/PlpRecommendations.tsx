"use client";

import { useRef, useState } from "react";
import { ALL_PRODUCTS } from "@/lib/plp-data";
import PlpProductCard from "./PlpProductCard";

function ChevLeft() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevRight() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export default function PlpRecommendations() {
  // Pick 8 products from the data (would be API-driven in production)
  const recs = ALL_PRODUCTS.filter((p) => p.badge === "bestseller").slice(0, 8);
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const scroll = (dir: "prev" | "next") => {
    const track = trackRef.current;
    if (!track) return;
    const amount = track.clientWidth * 0.8;
    track.scrollBy({ left: dir === "next" ? amount : -amount, behavior: "smooth" });
  };

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    setAtStart(track.scrollLeft <= 8);
    setAtEnd(track.scrollLeft + track.clientWidth >= track.scrollWidth - 8);
  };

  return (
    <section
      role="region"
      aria-label="You may also like"
      style={{
        background: "rgba(0,181,102,0.04)",
        padding: "64px 0",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 48px",
        }}
        className="recs-container"
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: "28px",
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "Outfit, sans-serif",
                fontSize: "clamp(20px, 2.5vw, 24px)",
                fontWeight: 700,
                color: "#1c1c1c",
                marginBottom: "5px",
              }}
            >
              You May Also Like
            </h2>
            <p
              style={{
                fontFamily: "Outfit, sans-serif",
                fontSize: "14px",
                color: "rgba(33,35,38,0.60)",
              }}
            >
              Based on what other plant lovers are exploring
            </p>
          </div>

          {/* Arrow controls */}
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => scroll("prev")}
              aria-label="Previous recommendations"
              aria-disabled={atStart}
              disabled={atStart}
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50px",
                border: "1px solid rgb(212,212,212)",
                background: "#fefcf9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: atStart ? "not-allowed" : "pointer",
                color: "#1c1c1c",
                opacity: atStart ? 0.3 : 1,
                transition: "all 200ms",
                outline: "none",
              }}
              onMouseEnter={(e) => {
                if (!atStart)
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "#00b566";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "#fefcf9";
              }}
              onFocus={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.outline =
                  "2px solid #00b566")
              }
              onBlur={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.outline = "none")
              }
            >
              <ChevLeft />
            </button>
            <button
              onClick={() => scroll("next")}
              aria-label="Next recommendations"
              aria-disabled={atEnd}
              disabled={atEnd}
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50px",
                border: "1px solid rgb(212,212,212)",
                background: "#fefcf9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: atEnd ? "not-allowed" : "pointer",
                color: "#1c1c1c",
                opacity: atEnd ? 0.3 : 1,
                transition: "all 200ms",
                outline: "none",
              }}
              onMouseEnter={(e) => {
                if (!atEnd)
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "#00b566";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "#fefcf9";
              }}
              onFocus={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.outline =
                  "2px solid #00b566")
              }
              onBlur={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.outline = "none")
              }
            >
              <ChevRight />
            </button>
          </div>
        </div>

        {/* Carousel track */}
        <div
          ref={trackRef}
          onScroll={handleScroll}
          style={{
            display: "grid",
            gridAutoFlow: "column",
            gridAutoColumns: "calc(25% - 12px)",
            gap: "16px",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            scrollbarWidth: "none",
            paddingBottom: "8px",
          }}
          className="recs-track"
        >
          {recs.map((product, idx) => (
            <div
              key={product.id}
              style={{ scrollSnapAlign: "start", minWidth: 0 }}
            >
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                <PlpProductCard
                  product={product}
                  viewMode="grid"
                  priority={false}
                />
              </ul>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .recs-track::-webkit-scrollbar { display: none; }
        @media (max-width: 1023px) {
          .recs-track { grid-auto-columns: calc(33.33% - 11px) !important; }
        }
        @media (max-width: 767px) {
          .recs-track { grid-auto-columns: calc(50% - 8px) !important; }
          .recs-container { padding: 0 24px !important; }
        }
        @media (max-width: 480px) {
          .recs-container { padding: 0 16px !important; }
        }
      `}</style>
    </section>
  );
}
