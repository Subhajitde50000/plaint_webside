"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { PlantProduct } from "@/lib/plp-data";
import PlpProductCard from "./PlpProductCard";

/* ── Skeleton card ──────────────────────────────────── */
function SkeletonCard() {
  return (
    <li
      aria-hidden="true"
      style={{
        background: "#fefcf9",
        border: "1px solid rgb(202,223,212)",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      {/* Image placeholder */}
      <div
        className="plp-skeleton"
        style={{ aspectRatio: "1 / 1", width: "100%" }}
      />
      {/* Content */}
      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <div className="plp-skeleton" style={{ height: "16px", width: "80%", borderRadius: "6px" }} />
        <div className="plp-skeleton" style={{ height: "12px", width: "55%", borderRadius: "6px" }} />
        <div className="plp-skeleton" style={{ height: "12px", width: "50%", borderRadius: "6px" }} />
        <div className="plp-skeleton" style={{ height: "14px", width: "40%", borderRadius: "6px" }} />
        <div className="plp-skeleton" style={{ height: "44px", width: "100%", borderRadius: "9999px", marginTop: "4px" }} />
      </div>
    </li>
  );
}

/* ── Empty State ────────────────────────────────────── */
interface EmptyStateProps {
  onClear: () => void;
}

function EmptyState({ onClear }: EmptyStateProps) {
  return (
    <div
      aria-live="polite"
      role="status"
      style={{
        gridColumn: "1 / -1",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 24px",
        textAlign: "center",
        gap: "16px",
      }}
    >
      {/* Plant pot icon */}
      <svg
        width="64"
        height="64"
        viewBox="0 0 64 64"
        fill="none"
        aria-hidden="true"
      >
        <ellipse cx="32" cy="54" rx="14" ry="6" fill="rgba(0,181,102,0.15)" />
        <rect x="20" y="36" width="24" height="18" rx="4" fill="rgba(0,181,102,0.25)" />
        <path
          d="M32 36C32 36 24 28 24 18C24 12 27 8 32 8C37 8 40 12 40 18C40 28 32 36 32 36Z"
          fill="rgba(0,181,102,0.40)"
        />
        <path
          d="M32 36V16"
          stroke="rgba(0,181,102,0.7)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>

      <h2
        style={{
          fontFamily: "Outfit, sans-serif",
          fontSize: "16px",
          fontWeight: 700,
          color: "#1c1c1c",
        }}
      >
        No plants found
      </h2>
      <p
        style={{
          fontFamily: "Outfit, sans-serif",
          fontSize: "14px",
          color: "rgba(33,35,38,0.70)",
          maxWidth: "360px",
          lineHeight: "22.4px",
        }}
      >
        Try adjusting or clearing your filters to find what you&apos;re looking
        for.
      </p>

      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
        <button
          onClick={onClear}
          style={{
            height: "44px",
            padding: "0 24px",
            borderRadius: "9999px",
            border: "none",
            background: "#00b566",
            color: "white",
            fontFamily: "Outfit, sans-serif",
            fontSize: "15px",
            fontWeight: 600,
            cursor: "pointer",
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
          Clear All Filters
        </button>
        <button
          onClick={onClear}
          style={{
            height: "44px",
            padding: "0 24px",
            borderRadius: "9999px",
            border: "1.5px solid #00b566",
            background: "transparent",
            color: "#00b566",
            fontFamily: "Outfit, sans-serif",
            fontSize: "15px",
            fontWeight: 600,
            cursor: "pointer",
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
          Browse All Plants
        </button>
      </div>

      <div
        style={{
          display: "flex",
          gap: "6px",
          flexWrap: "wrap",
          justifyContent: "center",
          marginTop: "8px",
        }}
      >
        <span
          style={{
            fontFamily: "Outfit, sans-serif",
            fontSize: "12px",
            color: "rgba(33,35,38,0.5)",
          }}
        >
          Try:
        </span>
        {["Indoor Plants", "Low Maintenance", "Under ₹500"].map((s) => (
          <span
            key={s}
            style={{
              fontFamily: "Outfit, sans-serif",
              fontSize: "12px",
              color: "#00b566",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Product Grid ────────────────────────────────────── */
const PAGE_SIZE = 24;
const BATCH_SIZE = 8;

interface PlpProductGridProps {
  products: PlantProduct[];
  viewMode: "grid" | "list";
  loading: boolean;
  onClearFilters: () => void;
}

export default function PlpProductGrid({
  products,
  viewMode,
  loading,
  onClearFilters,
}: PlpProductGridProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Reset visible count when products list changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [products]);

  const loadMore = useCallback(() => {
    if (isLoadingMore || visibleCount >= products.length) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((v) => Math.min(v + BATCH_SIZE, products.length));
      setIsLoadingMore(false);
    }, 600);
  }, [isLoadingMore, visibleCount, products.length]);

  // IntersectionObserver for progressive loading
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: "200px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  const visibleProducts = products.slice(0, visibleCount);
  const allLoaded = visibleCount >= products.length;

  const gridStyle: React.CSSProperties =
    viewMode === "list"
      ? {
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          listStyle: "none",
          padding: 0,
          margin: 0,
        }
      : {
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "24px 16px",
          listStyle: "none",
          padding: 0,
          margin: 0,
        };

  if (loading) {
    return (
      <>
        <ul
          aria-busy="true"
          aria-label="Loading products"
          style={gridStyle}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </ul>
        <style>{`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          .plp-skeleton {
            background: linear-gradient(90deg, rgba(28,28,28,0.08) 25%, rgba(255,255,255,0.60) 50%, rgba(28,28,28,0.08) 75%);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
          }
          @media (max-width: 1279px) { ul.plp-grid { grid-template-columns: repeat(3, 1fr) !important; } }
          @media (max-width: 767px) { ul.plp-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px 12px !important; } }
        `}</style>
      </>
    );
  }

  return (
    <>
      <ul
        role="list"
        aria-live="polite"
        aria-label="Plant products"
        className="plp-grid"
        style={viewMode === "list" ? gridStyle : { ...gridStyle }}
      >
        {visibleProducts.length === 0 ? (
          <EmptyState onClear={onClearFilters} />
        ) : (
          visibleProducts.map((product, idx) => (
            <PlpProductCard
              key={product.id}
              product={product}
              viewMode={viewMode}
              priority={idx < 4}
            />
          ))
        )}

        {/* Progressive load skeleton rows */}
        {isLoadingMore &&
          Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={`more-${i}`} />
          ))}
      </ul>

      {/* Sentinel */}
      {!allLoaded && <div ref={sentinelRef} style={{ height: "1px" }} />}

      {/* "You've seen all" message */}
      {allLoaded && visibleProducts.length > 0 && (
        <p
          style={{
            textAlign: "center",
            fontFamily: "Outfit, sans-serif",
            fontSize: "14px",
            color: "rgba(33,35,38,0.50)",
            padding: "32px 0",
          }}
        >
          You&apos;ve seen all {products.length} products
        </p>
      )}

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .plp-skeleton {
          background: linear-gradient(90deg, rgba(28,28,28,0.08) 25%, rgba(255,255,255,0.60) 50%, rgba(28,28,28,0.08) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        .plp-grid { grid-template-columns: repeat(4, 1fr); }
        @media (max-width: 1279px) { .plp-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (max-width: 767px) { .plp-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px 12px !important; } }
        @media (prefers-reduced-motion: reduce) {
          .plp-skeleton { animation: none !important; }
        }
      `}</style>
    </>
  );
}
