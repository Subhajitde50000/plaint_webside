"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import SharedNavbar from "@/components/Navbar";
import { useSearch } from "@/features/search";
import type { SearchProduct } from "@/features/search";

/* ── Design Tokens ────────────────────────────────────────────────────────── */
const T = {
  bg:          "#fefcf9",
  bgCard:      "#ffffff",
  bgMuted:     "#f7f5f0",
  green:       "#00b566",
  greenMid:    "#009952",
  greenPale:   "rgba(0,181,102,0.08)",
  greenBorder: "rgba(0,181,102,0.18)",
  heading:     "#1c1c1c",
  body:        "#333333",
  muted:       "#7c7c7c",
  border:      "rgba(0,0,0,0.07)",
  shadow:      "0 2px 12px rgba(0,0,0,0.04)",
  shadowHover: "0 8px 28px rgba(0,181,102,0.10)",
  radius:      "16px",
  radiusSm:    "10px",
};

/* ── Product Card ─────────────────────────────────────────────────────────── */
function ProductCard({ p }: { p: SearchProduct }) {
  const discount = p.compare_at_price && p.compare_at_price > p.base_price
    ? Math.round(((p.compare_at_price - p.base_price) / p.compare_at_price) * 100)
    : 0;

  return (
    <div
      style={{
        background: T.bgCard,
        border: `1.5px solid ${T.border}`,
        borderRadius: T.radius,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
        boxShadow: T.shadow,
        position: "relative",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = T.shadowHover;
        (e.currentTarget as HTMLDivElement).style.borderColor = T.greenBorder;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = T.shadow;
        (e.currentTarget as HTMLDivElement).style.borderColor = T.border;
      }}
    >
      {/* Discount badge */}
      {discount > 0 && (
        <span style={{
          position: "absolute", top: 12, left: 12, zIndex: 2,
          background: "#dc2626", color: "#fff", fontSize: 11,
          fontWeight: 700, padding: "3px 8px", borderRadius: 6,
        }}>
          {discount}% OFF
        </span>
      )}

      {/* Stock status badge */}
      {!p.in_stock && (
        <span style={{
          position: "absolute", top: 12, right: 12, zIndex: 2,
          background: "rgba(0,0,0,0.6)", color: "#fff", fontSize: 11,
          fontWeight: 600, padding: "3px 8px", borderRadius: 6,
        }}>
          Out of Stock
        </span>
      )}

      {/* Image container */}
      <Link href={`/products/${p.slug}`} style={{ textDecoration: "none" }}>
        <div style={{
          width: "100%", height: 210, background: T.bgMuted,
          overflow: "hidden", position: "relative",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {p.primary_image ? (
            <img
              src={p.primary_image}
              alt={p.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <span style={{ fontSize: 54 }}>🌿</span>
          )}
        </div>
      </Link>

      {/* Details */}
      <div style={{ padding: "16px", display: "flex", flexDirection: "column", flex: 1 }}>
        {p.product_type && (
          <span style={{
            fontSize: 11, fontWeight: 700, color: T.green,
            textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4,
          }}>
            {p.product_type}
          </span>
        )}

        <Link href={`/products/${p.slug}`} style={{ textDecoration: "none", color: T.heading }}>
          <h3 style={{
            margin: "0 0 6px", fontSize: 15, fontWeight: 700,
            lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>
            {p.title}
          </h3>
        </Link>

        {p.short_description && (
          <p style={{
            margin: "0 0 10px", fontSize: 12, color: T.muted,
            lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>
            {p.short_description}
          </p>
        )}

        {/* Rating */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12, fontSize: 12 }}>
          <span style={{ color: "#f59e0b" }}>★</span>
          <span style={{ fontWeight: 700, color: T.heading }}>{p.rating_average.toFixed(1)}</span>
          <span style={{ color: T.muted }}>({p.rating_count})</span>
        </div>

        {/* Price & Action */}
        <div style={{
          marginTop: "auto", paddingTop: 10, borderTop: `1px solid ${T.border}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <span style={{ fontSize: 17, fontWeight: 800, color: T.heading }}>
              ₹{p.base_price.toLocaleString("en-IN")}
            </span>
            {p.compare_at_price && p.compare_at_price > p.base_price && (
              <span style={{ fontSize: 12, color: T.muted, textDecoration: "line-through", marginLeft: 6 }}>
                ₹{p.compare_at_price.toLocaleString("en-IN")}
              </span>
            )}
          </div>
          <Link
            href={`/products/${p.slug}`}
            style={{
              padding: "7px 14px", borderRadius: 8, background: T.greenPale,
              color: T.green, fontWeight: 700, fontSize: 12, textDecoration: "none",
              border: `1px solid ${T.greenBorder}`, transition: "background 0.2s",
            }}
          >
            View →
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ── Skeleton Card ────────────────────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div style={{
      background: T.bgCard, border: `1.5px solid ${T.border}`,
      borderRadius: T.radius, height: 360, overflow: "hidden",
      padding: 16, display: "flex", flexDirection: "column", gap: 12,
    }}>
      <div style={{ width: "100%", height: 180, background: "#f0ede8", borderRadius: 10 }} />
      <div style={{ width: "40%", height: 12, background: "#f0ede8", borderRadius: 4 }} />
      <div style={{ width: "80%", height: 16, background: "#f0ede8", borderRadius: 4 }} />
      <div style={{ width: "60%", height: 12, background: "#f5f3ef", borderRadius: 4 }} />
    </div>
  );
}

/* ── Popular Categories Backup ────────────────────────────────────────────── */
const POPULAR_CATEGORIES = [
  { name: "Indoor Plants", slug: "indoor-plants", icon: "🪴" },
  { name: "Air Purifying", slug: "air-purifying", icon: "🍃" },
  { name: "Flowering Plants", slug: "flowering-plants", icon: "🌸" },
  { name: "Pots & Planters", slug: "pots-planters", icon: "🏺" },
  { name: "Seeds & Soil", slug: "seeds-soil", icon: "🌱" },
  { name: "Plant Tools", slug: "plant-tools", icon: "✂️" },
];

/* ── Main Search View ─────────────────────────────────────────────────────── */
function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlQuery = searchParams.get("q") || "";
  const urlCategory = searchParams.get("category") || undefined;

  const {
    searchTerm, setSearchTerm,
    debouncedQuery,
    category, setCategory,
    minPrice, setMinPrice,
    maxPrice, setMaxPrice,
    inStock, setInStock,
    minRating, setMinRating,
    sortBy, setSortBy,
    page, setPage,
    resetFilters,
    data, isLoading, isError,
  } = useSearch({
    q: urlQuery,
    category: urlCategory,
    page_size: 24,
  });

  // Keep search bar in sync if URL query changes
  useEffect(() => {
    if (urlQuery !== searchTerm) {
      setSearchTerm(urlQuery);
    }
  }, [urlQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
  };

  const activeFilterCount = [
    category, minPrice, maxPrice, inStock, minRating,
  ].filter((v) => v !== undefined && v !== false).length;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 16px 80px" }}>
      {/* Search Bar Header */}
      <div style={{ marginBottom: 32 }}>
        <form onSubmit={handleSearchSubmit} style={{ position: "relative", maxWidth: 640, margin: "0 auto 16px" }}>
          <span style={{
            position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)",
            fontSize: 20, color: T.muted, pointerEvents: "none",
          }}>
            🔍
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search plants, pots, seeds, tools…"
            id="search-input-main"
            style={{
              width: "100%", padding: "14px 44px 14px 48px", borderRadius: 30,
              border: `2px solid ${T.greenBorder}`, fontSize: 16, outline: "none",
              background: "#fff", boxShadow: T.shadow, color: T.heading,
              fontFamily: "inherit", transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.target.style.borderColor = T.green)}
            onBlur={(e) => (e.target.style.borderColor = T.greenBorder)}
          />
          {searchTerm && (
            <button
              type="button"
              id="btn-clear-search"
              onClick={() => { setSearchTerm(""); router.push("/search"); }}
              style={{
                position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                background: "transparent", border: "none", fontSize: 18, color: T.muted,
                cursor: "pointer", padding: 4,
              }}
            >
              ✕
            </button>
          )}
        </form>

        {/* Suggestions Bar */}
        {data?.suggestions && data.suggestions.length > 0 && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: T.muted }}>Suggestions:</span>
            {data.suggestions.map((s) => (
              <button
                key={s}
                onClick={() => { setSearchTerm(s); router.push(`/search?q=${encodeURIComponent(s)}`); }}
                style={{
                  padding: "4px 12px", borderRadius: 20, background: T.greenPale,
                  border: `1px solid ${T.greenBorder}`, color: T.green,
                  fontSize: 12, fontWeight: 600, cursor: "pointer",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Grid Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 28 }}>
        {/* Sidebar Filters */}
        <aside style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{
            background: T.bgCard, border: `1.5px solid ${T.border}`,
            borderRadius: T.radius, padding: 20, boxShadow: T.shadow,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: T.heading }}>
                Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </h2>
              {activeFilterCount > 0 && (
                <button
                  id="btn-reset-filters"
                  onClick={resetFilters}
                  style={{
                    background: "transparent", border: "none", color: T.green,
                    fontSize: 12, fontWeight: 700, cursor: "pointer", padding: 0,
                  }}
                >
                  Reset all
                </button>
              )}
            </div>

            {/* Category filter */}
            {data?.categories && data.categories.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 13, fontWeight: 700, color: T.muted, display: "block", marginBottom: 8 }}>
                  Category
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {data.categories.map((c) => (
                    <label key={c.id} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      fontSize: 13, color: category === c.slug ? T.green : T.body,
                      fontWeight: category === c.slug ? 700 : 500, cursor: "pointer",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <input
                          type="checkbox"
                          checked={category === c.slug}
                          onChange={(e) => setCategory(e.target.checked ? c.slug : undefined)}
                          style={{ accentColor: T.green }}
                        />
                        <span>{c.name}</span>
                      </div>
                      <span style={{ fontSize: 11, color: T.muted }}>({c.product_count})</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Price Range */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: T.muted, display: "block", marginBottom: 8 }}>
                Price Range (₹)
              </label>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice ?? ""}
                  onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : undefined)}
                  style={{
                    width: "100%", padding: "6px 10px", borderRadius: 8,
                    border: `1.5px solid ${T.border}`, fontSize: 13, outline: "none",
                  }}
                />
                <span style={{ color: T.muted }}>–</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice ?? ""}
                  onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
                  style={{
                    width: "100%", padding: "6px 10px", borderRadius: 8,
                    border: `1.5px solid ${T.border}`, fontSize: 13, outline: "none",
                  }}
                />
              </div>
            </div>

            {/* In Stock Toggle */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 13, color: T.body, fontWeight: 600 }}>
                <input
                  type="checkbox"
                  checked={!!inStock}
                  onChange={(e) => setInStock(e.target.checked ? true : undefined)}
                  style={{ accentColor: T.green }}
                />
                In-Stock Only
              </label>
            </div>

            {/* Minimum Rating */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: T.muted, display: "block", marginBottom: 8 }}>
                Minimum Rating
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[4, 3, 2].map((r) => (
                  <label key={r} style={{
                    display: "flex", alignItems: "center", gap: 8, cursor: "pointer",
                    fontSize: 13, color: minRating === r ? T.green : T.body,
                    fontWeight: minRating === r ? 700 : 500,
                  }}>
                    <input
                      type="radio"
                      name="min-rating"
                      checked={minRating === r}
                      onChange={() => setMinRating(minRating === r ? undefined : r)}
                      style={{ accentColor: T.green }}
                    />
                    <span>{r}★ & above</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Results Area */}
        <main>
          {/* Toolbar */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: 20, paddingBottom: 16, borderBottom: `1px solid ${T.border}`,
            flexWrap: "wrap", gap: 12,
          }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: T.heading }}>
                {debouncedQuery ? `Results for "${debouncedQuery}"` : "All Products"}
              </h1>
              {data && (
                <span style={{ fontSize: 13, color: T.muted, marginTop: 2, display: "block" }}>
                  {data.total} product{data.total !== 1 ? "s" : ""} found
                </span>
              )}
            </div>

            {/* Sort selection */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <label htmlFor="sort-select" style={{ fontSize: 13, fontWeight: 600, color: T.muted }}>
                Sort by:
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                style={{
                  padding: "8px 12px", borderRadius: 8, border: `1.5px solid ${T.border}`,
                  fontSize: 13, fontWeight: 600, color: T.body, background: "#fff",
                  outline: "none", cursor: "pointer",
                }}
              >
                <option value="relevance">Relevance</option>
                <option value="popularity">Popularity</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Skeletons */}
          {isLoading && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
              {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {/* Error */}
          {isError && (
            <div style={{
              background: "rgba(220,38,38,0.06)", border: "1.5px solid rgba(220,38,38,0.15)",
              borderRadius: T.radiusSm, padding: "24px", color: "#dc2626", textAlign: "center",
            }}>
              ⚠️ Unable to fetch search results. Please refresh or try another query.
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !isError && data && data.items.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🌱</div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: T.heading, margin: "0 0 8px" }}>
                No products found for "{debouncedQuery}"
              </h2>
              <p style={{ color: T.muted, fontSize: 14, marginBottom: 28 }}>
                Try checking for spelling errors, clearing filters, or exploring popular categories below.
              </p>

              {/* Popular Categories */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, maxWidth: 600, margin: "0 auto" }}>
                {POPULAR_CATEGORIES.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => { setCategory(cat.slug); setSearchTerm(""); router.push(`/search?category=${cat.slug}`); }}
                    style={{
                      background: T.bgCard, border: `1.5px solid ${T.border}`,
                      borderRadius: T.radiusSm, padding: "16px 12px",
                      cursor: "pointer", transition: "transform 0.15s, border-color 0.15s",
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = T.greenBorder;
                      (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = T.border;
                      (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                    }}
                  >
                    <span style={{ fontSize: 28 }}>{cat.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: T.heading }}>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Product Grid */}
          {!isLoading && data && data.items.length > 0 && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
                {data.items.map((product) => (
                  <ProductCard key={product.id} p={product} />
                ))}
              </div>

              {/* Pagination */}
              {data.total_pages > 1 && (
                <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 40 }}>
                  {Array.from({ length: data.total_pages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      id={`page-btn-${p}`}
                      onClick={() => setPage(p)}
                      style={{
                        width: 38, height: 38, borderRadius: 8, border: "1.5px solid",
                        borderColor: p === page ? T.green : T.border,
                        background: p === page ? T.green : T.bgCard,
                        color: p === page ? "#fff" : T.body,
                        fontWeight: p === page ? 700 : 500,
                        fontSize: 14, cursor: "pointer", transition: "all 0.15s",
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'Outfit', 'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
      `}</style>
      <SharedNavbar />
      <Suspense fallback={<div style={{ padding: 40, textAlign: "center" }}>Loading Search…</div>}>
        <SearchContent />
      </Suspense>
    </div>
  );
}
