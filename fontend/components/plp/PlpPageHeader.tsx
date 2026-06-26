"use client";

interface PlpPageHeaderProps {
  resultCount: number;
}

export default function PlpPageHeader({ resultCount }: PlpPageHeaderProps) {
  return (
    <div style={{ padding: "24px 0 16px" }}>
      <h1
        style={{
          fontFamily: "Outfit, sans-serif",
          fontSize: "clamp(24px, 3vw, 32px)",
          fontWeight: 700,
          color: "#1c1c1c",
          lineHeight: 1.2,
          marginBottom: "6px",
        }}
      >
        Plants
      </h1>
      <p
        style={{
          fontFamily: "Outfit, sans-serif",
          fontSize: "14px",
          fontWeight: 400,
          color: "rgba(33,35,38,0.75)",
          lineHeight: "22.4px",
          maxWidth: "720px",
          marginBottom: "8px",
        }}
        className="plp-header-desc"
      >
        Explore 500+ indoor plants, outdoor plants, flowering plants, and
        succulents for home, office, and gifting. 10M+ customers · 4.5★ rated.
      </p>
      <p
        aria-live="polite"
        aria-atomic="true"
        style={{
          fontFamily: "Outfit, sans-serif",
          fontSize: "14px",
          fontWeight: 400,
          color: "rgba(33,35,38,0.55)",
        }}
      >
        {resultCount} products
      </p>

      <style>{`
        @media (max-width: 480px) {
          .plp-header-desc { display: none; }
        }
      `}</style>
    </div>
  );
}
