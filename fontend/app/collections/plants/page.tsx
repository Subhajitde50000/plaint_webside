"use client";

import { useState, useMemo, useCallback } from "react";
import type { FilterState, SortOption, PlantTag } from "@/lib/plp-data";
import {
  ALL_PRODUCTS,
  DEFAULT_FILTER,
  applyFilters,
  sortProducts,
} from "@/lib/plp-data";
import SharedNavbar from "@/components/Navbar";
import PlpBreadcrumb from "@/components/plp/PlpBreadcrumb";
import PlpPageHeader from "@/components/plp/PlpPageHeader";
import PlpCategoryPills from "@/components/plp/PlpCategoryPills";
import PlpFilterSidebar from "@/components/plp/PlpFilterSidebar";
import PlpSortBar from "@/components/plp/PlpSortBar";
import PlpProductGrid from "@/components/plp/PlpProductGrid";
import PlpMobileFilterSheet from "@/components/plp/PlpMobileFilterSheet";
import PlpRecommendations from "@/components/plp/PlpRecommendations";
import PlpSeoBlock from "@/components/plp/PlpSeoBlock";

export default function PlantsCollectionPage() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTER);
  const [sort, setSort] = useState<SortOption>("bestselling");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Derived: filtered + sorted products
  const products = useMemo(
    () => sortProducts(applyFilters(ALL_PRODUCTS, filters), sort),
    [filters, sort]
  );

  // Category pill handler — updates filter.category and resets plant types
  const handleCategoryChange = useCallback((tag: PlantTag | "all") => {
    setFilters((prev) => ({
      ...prev,
      category: tag,
      plantTypes: [],
    }));
  }, []);

  // Count active non-category filters (for mobile badge)
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.plantTypes.length > 0) count += filters.plantTypes.length;
    if (filters.priceMin > 0 || filters.priceMax < 5000) count++;
    count += filters.sizes.length;
    count += filters.lightReqs.length;
    count += filters.watering.length;
    count += filters.specialTags.length;
    if (filters.minRating !== null) count++;
    if (filters.inStockOnly) count++;
    count += filters.discounts.length;
    return count;
  }, [filters]);

  const clearAllFilters = useCallback(() => {
    setFilters(DEFAULT_FILTER);
  }, []);

  return (
    <>
      {/* SEO meta injected via Next.js metadata API — see layout */}
      <SharedNavbar />

      <main
        style={{
          background: "#fefcf9",
          minHeight: "100vh",
          paddingTop: "64px", // nav height
          fontFamily: "Outfit, sans-serif",
        }}
      >
        {/* ── Above-the-fold header area ── */}
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 48px",
          }}
          className="plp-header-wrapper"
        >
          <PlpBreadcrumb />
          <PlpPageHeader resultCount={products.length} />
          <PlpCategoryPills
            selected={filters.category}
            onChange={handleCategoryChange}
          />
        </div>

        {/* ── Sticky sort bar (full width, inner constrained) ── */}
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 48px",
          }}
          className="plp-header-wrapper"
        >
          <PlpSortBar
            resultCount={products.length}
            sort={sort}
            onSortChange={setSort}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            filters={filters}
            onFiltersChange={setFilters}
            onMobileFilterOpen={() => setMobileFilterOpen(true)}
            activeFilterCount={activeFilterCount}
          />
        </div>

        {/* ── Sidebar + Grid layout ── */}
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 48px",
            display: "flex",
            gap: "24px",
            alignItems: "flex-start",
          }}
          className="plp-body-wrapper"
        >
          {/* Filter sidebar — hidden on mobile */}
          <PlpFilterSidebar
            filters={filters}
            onChange={setFilters}
            totalResults={products.length}
          />

          {/* Main content area */}
          <div style={{ flex: 1, minWidth: 0, paddingTop: "24px", paddingBottom: "48px" }}>
            <PlpProductGrid
              products={products}
              viewMode={viewMode}
              loading={false}
              onClearFilters={clearAllFilters}
            />
          </div>
        </div>

        {/* ── You May Also Like ── */}
        <PlpRecommendations />

        {/* ── SEO Text Block ── */}
        <PlpSeoBlock />

        {/* ── Footer placeholder ── */}
        <footer
          style={{
            borderTop: "1px solid rgba(28,28,28,0.10)",
            padding: "32px 48px",
            background: "#fefcf9",
          }}
          className="plp-footer"
        >
          <div
            style={{
              maxWidth: "1280px",
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C12 2 4 5 4 13C4 17.4 7.6 21 12 21C16.4 21 20 17.4 20 13C20 5 12 2 12 2Z" fill="#00b566" />
                <path d="M12 21V10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M12 15L8 11" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M12 12L16 8" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              <span style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "16px", color: "#1c1c1c" }}>
                plant byst
              </span>
            </div>
            <p style={{ fontFamily: "Outfit, sans-serif", fontSize: "13px", color: "rgba(33,35,38,0.50)" }}>
              © 2026 plant byst. Grow something beautiful.
            </p>
          </div>
        </footer>
      </main>

      {/* ── Mobile Filter Sheet ── */}
      <PlpMobileFilterSheet
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
        resultCount={products.length}
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }

        /* Focus ring global rule for this page */
        main :focus-visible {
          outline: 2px solid #00b566 !important;
          outline-offset: 2px !important;
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* Responsive padding */
        @media (max-width: 1279px) {
          .plp-header-wrapper,
          .plp-body-wrapper { padding: 0 24px !important; }
          .plp-footer { padding: 32px 24px !important; }
        }
        @media (max-width: 767px) {
          .plp-header-wrapper,
          .plp-body-wrapper { padding: 0 16px !important; }
          .plp-footer { padding: 24px 16px !important; }
        }
        @media (max-width: 480px) {
          .plp-header-wrapper,
          .plp-body-wrapper { padding: 0 8px !important; }
        }
      `}</style>
    </>
  );
}
