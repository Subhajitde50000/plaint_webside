"use client";

import SharedNavbar from "@/components/Navbar";

export function ReviewSkeleton() {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "var(--radius-lg, 16px)",
        boxShadow: "var(--shadow-card, 0 4px 20px rgba(0,0,0,0.05))",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        border: "1px solid rgba(45,90,39,0.08)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div
          className="pdp-skeleton-pulse"
          style={{ width: "44px", height: "44px", borderRadius: "50%" }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <div
            className="pdp-skeleton-pulse"
            style={{ width: "120px", height: "16px", borderRadius: "4px" }}
          />
          <div
            className="pdp-skeleton-pulse"
            style={{ width: "80px", height: "12px", borderRadius: "4px" }}
          />
        </div>
      </div>
      <div style={{ display: "flex", gap: "4px" }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="pdp-skeleton-pulse"
            style={{ width: "16px", height: "16px", borderRadius: "3px" }}
          />
        ))}
      </div>
      <div
        className="pdp-skeleton-pulse"
        style={{ width: "95%", height: "14px", borderRadius: "4px" }}
      />
      <div
        className="pdp-skeleton-pulse"
        style={{ width: "70%", height: "14px", borderRadius: "4px" }}
      />
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "20px",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
        border: "1px solid rgba(45,90,39,0.08)",
      }}
    >
      {/* Product Image placeholder */}
      <div
        className="pdp-skeleton-pulse"
        style={{
          width: "100%",
          aspectRatio: "1",
          borderRadius: "16px",
        }}
      />
      {/* Category line */}
      <div
        className="pdp-skeleton-pulse"
        style={{ width: "40%", height: "12px", borderRadius: "4px" }}
      />
      {/* Title line */}
      <div
        className="pdp-skeleton-pulse"
        style={{ width: "80%", height: "18px", borderRadius: "6px" }}
      />
      {/* Rating row */}
      <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="pdp-skeleton-pulse"
            style={{ width: "12px", height: "12px", borderRadius: "2px" }}
          />
        ))}
        <div
          className="pdp-skeleton-pulse"
          style={{ width: "30px", height: "12px", borderRadius: "4px", marginLeft: "4px" }}
        />
      </div>
      {/* Price line */}
      <div
        className="pdp-skeleton-pulse"
        style={{ width: "50%", height: "22px", borderRadius: "6px" }}
      />
      {/* Add button */}
      <div
        className="pdp-skeleton-pulse"
        style={{ width: "100%", height: "42px", borderRadius: "9999px", marginTop: "4px" }}
      />
    </div>
  );
}

export default function PdpSkeleton() {
  return (
    <>
      <SharedNavbar />
      <style>{`
        @keyframes pdp-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .pdp-skeleton-pulse {
          background: linear-gradient(
            90deg,
            rgba(45, 90, 39, 0.06) 25%,
            rgba(255, 255, 255, 0.80) 50%,
            rgba(45, 90, 39, 0.06) 75%
          );
          background-size: 200% 100%;
          animation: pdp-shimmer 1.6s ease-in-out infinite;
        }

        .pdp-skeleton-wrap {
          padding-top: 80px;
          min-height: 100vh;
          background: var(--color-bg-primary, #F7F5F0);
        }

        .pdp-skeleton-breadcrumb {
          padding: 24px 48px;
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .pdp-skeleton-grid {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 48px 60px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: start;
        }

        .pdp-skeleton-tabs {
          max-width: 1280px;
          margin: 40px auto 0;
          padding: 0 48px;
        }

        .pdp-skeleton-related {
          max-width: 1280px;
          margin: 0 auto;
          padding: 60px 48px;
        }

        .pdp-skeleton-related-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-top: 28px;
        }

        @media (max-width: 1024px) {
          .pdp-skeleton-grid { grid-template-columns: 1fr; gap: 36px; padding: 0 24px 48px; }
          .pdp-skeleton-breadcrumb { padding: 16px 24px; }
          .pdp-skeleton-tabs { padding: 0 24px; }
          .pdp-skeleton-related { padding: 48px 24px; }
          .pdp-skeleton-related-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 640px) {
          .pdp-skeleton-grid { padding: 0 16px 36px; }
          .pdp-skeleton-breadcrumb { padding: 14px 16px; }
          .pdp-skeleton-tabs { padding: 0 16px; }
          .pdp-skeleton-related { padding: 36px 16px; }
          .pdp-skeleton-related-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .pdp-skeleton-pulse { animation: none !important; }
        }
      `}</style>

      <div className="pdp-skeleton-wrap">
        {/* Breadcrumb Skeleton */}
        <div className="pdp-skeleton-breadcrumb">
          <div className="pdp-skeleton-pulse" style={{ width: "48px", height: "14px", borderRadius: "4px" }} />
          <span style={{ color: "rgba(45,90,39,0.3)", fontSize: "14px" }}>›</span>
          <div className="pdp-skeleton-pulse" style={{ width: "90px", height: "14px", borderRadius: "4px" }} />
          <span style={{ color: "rgba(45,90,39,0.3)", fontSize: "14px" }}>›</span>
          <div className="pdp-skeleton-pulse" style={{ width: "140px", height: "14px", borderRadius: "4px" }} />
        </div>

        {/* Main PDP Grid Skeleton */}
        <div className="pdp-skeleton-grid">
          {/* LEFT: Image Gallery Skeleton */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Main large image */}
            <div
              className="pdp-skeleton-pulse"
              style={{
                width: "100%",
                height: "500px",
                borderRadius: "24px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
              }}
            />
            {/* Thumbnails strip */}
            <div style={{ display: "flex", gap: "14px" }}>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="pdp-skeleton-pulse"
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "14px",
                    flexShrink: 0,
                  }}
                />
              ))}
            </div>
          </div>

          {/* RIGHT: Product Details Skeleton */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Category tag */}
            <div className="pdp-skeleton-pulse" style={{ width: "110px", height: "14px", borderRadius: "4px" }} />

            {/* Title & Tagline */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div className="pdp-skeleton-pulse" style={{ width: "85%", height: "38px", borderRadius: "8px" }} />
              <div className="pdp-skeleton-pulse" style={{ width: "60%", height: "16px", borderRadius: "4px" }} />
            </div>

            {/* Rating Stars & Reviews Count */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ display: "flex", gap: "4px" }}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="pdp-skeleton-pulse" style={{ width: "18px", height: "18px", borderRadius: "3px" }} />
                ))}
              </div>
              <div className="pdp-skeleton-pulse" style={{ width: "120px", height: "14px", borderRadius: "4px" }} />
            </div>

            {/* Price Box */}
            <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginTop: "4px" }}>
              <div className="pdp-skeleton-pulse" style={{ width: "120px", height: "36px", borderRadius: "8px" }} />
              <div className="pdp-skeleton-pulse" style={{ width: "70px", height: "20px", borderRadius: "4px" }} />
              <div className="pdp-skeleton-pulse" style={{ width: "65px", height: "24px", borderRadius: "12px" }} />
            </div>

            <hr style={{ border: "none", borderTop: "1px solid rgba(45,90,39,0.1)", margin: "4px 0" }} />

            {/* Planter Selector */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div className="pdp-skeleton-pulse" style={{ width: "120px", height: "14px", borderRadius: "4px" }} />
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="pdp-skeleton-pulse" style={{ width: "100px", height: "42px", borderRadius: "9999px" }} />
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div className="pdp-skeleton-pulse" style={{ width: "90px", height: "14px", borderRadius: "4px" }} />
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="pdp-skeleton-pulse" style={{ width: "115px", height: "64px", borderRadius: "16px" }} />
                ))}
              </div>
            </div>

            {/* Quantity & CTA Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "8px" }}>
              <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                {/* Qty Counter */}
                <div className="pdp-skeleton-pulse" style={{ width: "120px", height: "52px", borderRadius: "9999px" }} />
                {/* Add to Cart CTA */}
                <div className="pdp-skeleton-pulse" style={{ flex: 1, height: "52px", borderRadius: "9999px" }} />
              </div>
              {/* Buy Now CTA */}
              <div className="pdp-skeleton-pulse" style={{ width: "100%", height: "52px", borderRadius: "9999px" }} />
            </div>

            {/* Trust Badges */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginTop: "12px" }}>
              {[1, 2, 3].map((i) => (
                <div key={i} className="pdp-skeleton-pulse" style={{ height: "64px", borderRadius: "14px" }} />
              ))}
            </div>
          </div>
        </div>

        {/* Tabs Section Skeleton */}
        <div className="pdp-skeleton-tabs">
          {/* Tab bar header */}
          <div style={{ display: "flex", gap: "24px", borderBottom: "2px solid rgba(45,90,39,0.1)", paddingBottom: "12px", marginBottom: "28px" }}>
            {[100, 120, 90, 110].map((w, idx) => (
              <div key={idx} className="pdp-skeleton-pulse" style={{ width: `${w}px`, height: "24px", borderRadius: "6px" }} />
            ))}
          </div>

          {/* Tab content lines */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div className="pdp-skeleton-pulse" style={{ width: "100%", height: "16px", borderRadius: "4px" }} />
            <div className="pdp-skeleton-pulse" style={{ width: "92%", height: "16px", borderRadius: "4px" }} />
            <div className="pdp-skeleton-pulse" style={{ width: "96%", height: "16px", borderRadius: "4px" }} />
            <div className="pdp-skeleton-pulse" style={{ width: "70%", height: "16px", borderRadius: "4px" }} />
          </div>
        </div>

        {/* Related Products Skeleton Section */}
        <div className="pdp-skeleton-related">
          <div className="pdp-skeleton-pulse" style={{ width: "220px", height: "28px", borderRadius: "8px" }} />
          <div className="pdp-skeleton-related-grid">
            {[1, 2, 3, 4].map((i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
