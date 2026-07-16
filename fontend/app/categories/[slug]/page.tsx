"use client";

import { useState, useMemo, useCallback, use } from "react";
import type { FilterState, SortOption, PlantTag, PlantProduct } from "@/lib/plp-data";
import { DEFAULT_FILTER } from "@/lib/plp-data";
import { useProducts } from "@/features/products/hooks/useProducts";
import type { ApiProduct } from "@/features/products/api/products.api";
import { SORT_OPTION_TO_API } from "@/features/products/api/products.api";
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

// Mapping of subcategory tags to backend category slugs
const TAG_TO_CATEGORY_SLUG: Record<string, string> = {
  indoor:           "indoor-plants",
  outdoor:          "outdoor-plants",
  flowering:        "flowering-plants",
  succulents:       "succulents",
  "low-maintenance": "low-maintenance",
  "air-purifying":  "air-purifying",
  "pet-friendly":   "pet-friendly",
};

// Subcategories list for each parent category
const SUB_CATEGORIES: Record<string, { label: string; tag: string }[]> = {
  plants: [
    { label: "All Plants", tag: "all" },
    { label: "Indoor Plants", tag: "indoor" },
    { label: "Outdoor Plants", tag: "outdoor" },
    { label: "Flowering Plants", tag: "flowering" },
    { label: "Succulents & Cacti", tag: "succulents" },
    { label: "Low Maintenance", tag: "low-maintenance" },
    { label: "Air Purifying", tag: "air-purifying" },
    { label: "Pet Friendly", tag: "pet-friendly" },
  ],
  seeds: [
    { label: "All Seeds", tag: "all" },
    { label: "Flower Seeds", tag: "flower-seeds" },
    { label: "Vegetable Seeds", tag: "vegetable-seeds" },
    { label: "Herb Seeds", tag: "herb-seeds" },
    { label: "Fruit Seeds", tag: "fruit-seeds" },
  ],
  pots: [
    { label: "All Pots", tag: "all" },
    { label: "Ceramic Pots", tag: "ceramic-pots" },
    { label: "Plastic Pots", tag: "plastic-pots" },
    { label: "Clay Pots", tag: "clay-pots" },
    { label: "Metal Planters", tag: "metal-planters" },
  ],
  tools: [
    { label: "All Tools", tag: "all" },
    { label: "Watering Cans", tag: "watering-cans" },
    { label: "Pruning Shears", tag: "pruning-shears" },
    { label: "Trowels & Rakes", tag: "trowels-rakes" },
    { label: "Gardening Gloves", tag: "gardening-gloves" },
  ],
  fertilizer: [
    { label: "All Fertilizers", tag: "all" },
    { label: "Organic Compost", tag: "organic-compost" },
    { label: "Liquid Fertilizer", tag: "liquid-fertilizer" },
    { label: "Pest Control", tag: "pest-control" },
    { label: "Soil Mix", tag: "soil-mix" },
  ],
};

/* ── Map API response item → PlantProduct (used by existing UI components) ───*/
function toPlantProduct(p: ApiProduct): PlantProduct {
  const basePrice   = Number(p.base_price);
  const compareAt   = p.compare_at_price != null ? Number(p.compare_at_price) : null;
  const discount    = compareAt && compareAt > basePrice
    ? Math.round(((compareAt - basePrice) / compareAt) * 100)
    : 0;

  // Primary image
  const sortedImages = [...p.images].sort(
    (a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0) || a.position - b.position
  );
  const primaryImage   = sortedImages[0]?.url ?? "/placeholder-plant.jpg";
  const secondaryImage = sortedImages[1]?.url ?? primaryImage;

  // Variant sizes
  const VALID_SIZES = new Set(["XS", "S", "M", "L", "XL"]);
  const sizes = p.variants
    .filter((v) => v.is_active && VALID_SIZES.has(v.option_name.toUpperCase()))
    .map((v) => v.option_name.toUpperCase() as any);

  // Build tags
  const tags: PlantTag[] = [];
  if (p.is_pet_friendly)   tags.push("pet-friendly");
  if (p.is_air_purifying)  tags.push("air-purifying");

  return {
    id:            String(p.id),
    slug:          p.slug,
    name:          p.title,
    secondaryName: p.short_description ?? "",
    price:         basePrice,
    originalPrice: compareAt,
    discount,
    rating:        Number(p.rating_average),
    reviewCount:   p.rating_count,
    sizes:         sizes.length > 0 ? sizes : ["M" as any],
    tags,
    lightReq:      "Partial Sun",
    watering:      "Weekly",
    badge:         null,
    stockCount:    1,
    isNew:         false,
    primaryImage,
    secondaryImage,
  };
}

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

/* ── Dynamic Category Page ─────────────────────────────────────────────────── */
export default function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = use(params); // dynamic route param (e.g. plants, seeds, tools)

  const [filters, setFilters]           = useState<FilterState>(DEFAULT_FILTER);
  const [sort, setSort]                 = useState<SortOption>("bestselling");
  const [viewMode, setViewMode]         = useState<"grid" | "list">("grid");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [page, setPage]                 = useState(1);
  const [q, setQ]                       = useState("");

  const customPills = useMemo(() => SUB_CATEGORIES[slug] || [{ label: "All Items", tag: "all" }], [slug]);

  /* ── Translate UI FilterState → ProductFilters ── */
  const apiFilters = useMemo(() => {
    // If selected pill is "all", query the parent category slug. Otherwise use the mapped subcategory slug.
    const activeCategorySlug = filters.category === "all"
      ? slug
      : (TAG_TO_CATEGORY_SLUG[filters.category] ?? filters.category);

    const isPetFriendly   = filters.specialTags.includes("pet-friendly") || undefined;
    const isAirPurifying  = filters.specialTags.includes("air-purifying") || undefined;

    let careSkill: "beginner" | "intermediate" | "expert" | undefined;
    if (filters.specialTags.includes("low-maintenance" as PlantTag)) careSkill = "beginner";

    return {
      categorySlug:    activeCategorySlug,
      minPrice:        filters.priceMin > 0 ? filters.priceMin : undefined,
      maxPrice:        filters.priceMax < 5000 ? filters.priceMax : undefined,
      isPetFriendly:   isPetFriendly,
      isAirPurifying:  isAirPurifying,
      careSkill,
      sort:            SORT_OPTION_TO_API[sort] ?? "popularity",
      page,
      pageSize:        20,
      q:               q.trim() || undefined,
    };
  }, [filters, sort, page, q, slug]);

  /* ── Real API data ── */
  const { data, isLoading, isFetching } = useProducts(apiFilters);
  const apiProducts: PlantProduct[] = useMemo(
    () => (data?.items ?? []).map(toPlantProduct),
    [data]
  );
  const totalResults = data?.total ?? 0;
  const totalPages   = data?.pages ?? 1;

  /* ── Reset page when filters/sort/search changes ── */
  const handleFiltersChange = useCallback((next: FilterState) => {
    setFilters(next);
    setPage(1);
  }, []);
  const handleSortChange = useCallback((next: SortOption) => {
    setSort(next);
    setPage(1);
  }, []);

  /* ── Category pill handler ── */
  const handleCategoryChange = useCallback((tag: PlantTag | "all") => {
    setFilters((prev) => ({ ...prev, category: tag, plantTypes: [] }));
    setPage(1);
  }, []);

  /* ── Active filter count badge ── */
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
    setQ("");
    setPage(1);
  }, []);

  // Format header display title
  const displayTitle = useMemo(() => {
    const formatted = slug.charAt(0).toUpperCase() + slug.slice(1);
    if (slug === "soil") return "Soil & Compost";
    return formatted;
  }, [slug]);

  return (
    <>
      <SharedNavbar />

      <main style={{ background: "#fefcf9", minHeight: "100vh", paddingTop: "64px", fontFamily: "Outfit, sans-serif" }}>

        {/* ── Above-the-fold header ── */}
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 48px" }} className="plp-header-wrapper">
          <PlpBreadcrumb />
          <div style={{ marginTop: 24, marginBottom: 16 }}>
            <h1 style={{ fontSize: "2.5rem", fontWeight: 700, color: "#1c1c1c", margin: 0 }}>{displayTitle}</h1>
          </div>
          <PlpCategoryPills selected={filters.category} onChange={handleCategoryChange} pills={customPills} />
        </div>

        {/* ── Search bar ── */}
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "12px 48px 0" }} className="plp-header-wrapper">
          <div style={{ position: "relative", maxWidth: 400 }}>
            <svg style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", pointerEvents: "none" }}
              width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              id="plp-search"
              type="search"
              placeholder={`Search ${slug}…`}
              value={q}
              onChange={(e) => { setQ(e.target.value); setPage(1); }}
              style={{
                width: "100%", height: 42, paddingLeft: 40, paddingRight: 16,
                border: "1.5px solid #d1d5db", borderRadius: 9999, fontSize: 14,
                fontFamily: "Outfit, sans-serif", outline: "none", background: "#fff",
                transition: "border-color 150ms",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "#00b566"; }}
              onBlur={(e)  => { e.currentTarget.style.borderColor = "#d1d5db"; }}
            />
            {q && (
              <button
                onClick={() => { setQ(""); setPage(1); }}
                aria-label="Clear search"
                style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", color: "#6b7280", padding: 0 }}
              >✕</button>
            )}
          </div>
        </div>

        {/* ── Sort bar ── */}
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 48px" }} className="plp-header-wrapper">
          <PlpSortBar
            resultCount={totalResults}
            sort={sort}
            onSortChange={handleSortChange}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onMobileFilterOpen={() => setMobileFilterOpen(true)}
            activeFilterCount={activeFilterCount}
          />
        </div>

        {/* ── Sidebar + Grid layout ── */}
        <div
          style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 48px", display: "flex", gap: "24px", alignItems: "flex-start" }}
          className="plp-body-wrapper"
        >
          <PlpFilterSidebar filters={filters} onChange={handleFiltersChange} totalResults={totalResults} />

          <div style={{ flex: 1, minWidth: 0, paddingTop: "24px", paddingBottom: "48px" }}>
            <PlpProductGrid
              products={apiProducts}
              viewMode={viewMode}
              loading={isLoading || isFetching}
              onClearFilters={clearAllFilters}
            />

            {/* ── Pagination ── */}
            {totalPages > 1 && (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, paddingTop: 32 }}>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  style={{
                    height: 40, minWidth: 40, borderRadius: 9999,
                    border: "1.5px solid #d1d5db", background: "#fff",
                    color: page <= 1 ? "#d1d5db" : "#1c1c1c",
                    cursor: page <= 1 ? "not-allowed" : "pointer",
                    fontFamily: "Outfit, sans-serif", fontWeight: 600, fontSize: 14,
                  }}
                  aria-label="Previous page"
                >←</button>

                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  const p = totalPages <= 7 ? i + 1
                    : page <= 4 ? i + 1
                    : page >= totalPages - 3 ? totalPages - 6 + i
                    : page - 3 + i;
                  return (
                    <button key={p} onClick={() => setPage(p)}
                      aria-label={`Page ${p}`} aria-current={page === p ? "page" : undefined}
                      style={{
                        height: 40, minWidth: 40, borderRadius: 9999,
                        border: page === p ? "none" : "1.5px solid #d1d5db",
                        background: page === p ? "#00b566" : "#fff",
                        color: page === p ? "#fff" : "#1c1c1c",
                        fontFamily: "Outfit, sans-serif", fontWeight: 600, fontSize: 14,
                        cursor: "pointer",
                      }}>{p}</button>
                  );
                })}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  style={{
                    height: 40, minWidth: 40, borderRadius: 9999,
                    border: "1.5px solid #d1d5db", background: "#fff",
                    color: page >= totalPages ? "#d1d5db" : "#1c1c1c",
                    cursor: page >= totalPages ? "not-allowed" : "pointer",
                    fontFamily: "Outfit, sans-serif", fontWeight: 600, fontSize: 14,
                  }}
                  aria-label="Next page"
                >→</button>

                <span style={{ fontSize: 13, color: "#6b7280", marginLeft: 8, fontFamily: "Outfit, sans-serif" }}>
                  Page {page} of {totalPages}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── You May Also Like ── */}
        <PlpRecommendations />

        {/* ── SEO Text Block ── */}
        <PlpSeoBlock />

        {/* ── Footer ── */}
        <footer style={{ borderTop: "1px solid rgba(28,28,28,0.10)", padding: "32px 48px", background: "#fefcf9" }} className="plp-footer">
          <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C12 2 4 5 4 13C4 17.4 7.6 21 12 21C16.4 21 20 17.4 20 13C20 5 12 2 12 2Z" fill="#00b566" />
                <path d="M12 21V10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M12 15L8 11" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M12 12L16 8" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              <span style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "16px", color: "#1c1c1c" }}>plant byst</span>
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
        onFiltersChange={handleFiltersChange}
        resultCount={totalResults}
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        #plp-search:focus { outline: none; }
        main :focus-visible { outline: 2px solid #00b566 !important; outline-offset: 2px !important; }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
        @media (max-width: 1279px) {
          .plp-header-wrapper, .plp-body-wrapper { padding: 0 24px !important; }
          .plp-footer { padding: 32px 24px !important; }
        }
        @media (max-width: 767px) {
          .plp-header-wrapper, .plp-body-wrapper { padding: 0 16px !important; }
          .plp-footer { padding: 24px 16px !important; }
        }
        @media (max-width: 480px) {
          .plp-header-wrapper, .plp-body-wrapper { padding: 0 8px !important; }
        }
      `}</style>
    </>
  );
}
