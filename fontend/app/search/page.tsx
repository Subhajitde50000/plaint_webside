"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import SharedNavbar from "@/components/Navbar";

/* ── Design Tokens ─────────────────────────────────────── */
const T = {
  bg: "#fefcf9",
  bgCard: "#FFFFFF",
  bgSection: "#f7f5f0",
  bgMuted: "#fbfaf7",
  green: "#00b566",
  greenMid: "#009952",
  greenPale: "rgba(0, 181, 102, 0.12)",
  greenLight: "rgba(0, 181, 102, 0.08)",
  heading: "#1c1c1c",
  body: "#333333",
  muted: "#7c7c7c",
  border: "rgba(0, 0, 0, 0.08)",
  borderGreen: "rgba(0, 181, 102, 0.16)",
  white: "#FFFFFF",
  red: "#dc2626",
  amber: "#d97706",
  shadow: "0 4px 20px rgba(0,0,0,0.04)",
  shadowHover: "0 8px 30px rgba(0, 181, 102, 0.08)",
  shadowBtn: "0 4px 14px rgba(0, 181, 102, 0.25)",
};

interface Product {
  id: number;
  name: string;
  price: number;
  rating: number;
  category: "plants" | "seeds" | "tools";
  img: string;
  tags: string[];
  slug: string;
  description: string;
}

const PRODUCT_CATALOG: Product[] = [
  {
    id: 1,
    name: "Red Anthurium Plant",
    price: 25.00,
    rating: 4.8,
    category: "plants",
    img: "/fern-small.png",
    slug: "red-anthurium-plant",
    tags: ["indoor", "flowers", "colorful", "red", "anthurium"],
    description: "Elegant air-purifying plant with vibrant waxy red heart-shaped flowers blooming year-round."
  },
  {
    id: 2,
    name: "Monstera Deliciosa",
    price: 35.00,
    rating: 4.9,
    category: "plants",
    img: "/monstera.png",
    slug: "monstera",
    tags: ["indoor", "leafy", "green", "popular", "swiss cheese"],
    description: "Famous for its iconic leaf fenestrations, perfect for adding a tropical vibe to spacious rooms."
  },
  {
    id: 3,
    name: "Indoor Snake Plant",
    price: 32.00,
    rating: 4.7,
    category: "plants",
    img: "/cat-indoor.png",
    slug: "monstera",
    tags: ["indoor", "low maintenance", "air purifying", "sansevieria"],
    description: "Resilient upright foliage that thrives in low light and produces oxygen continuously overnight."
  },
  {
    id: 4,
    name: "Balcony Flowers Mix",
    price: 28.00,
    rating: 4.5,
    category: "plants",
    img: "/cat-balcony.png",
    slug: "monstera",
    tags: ["outdoor", "flowers", "balcony", "colorful", "bright"],
    description: "A pre-potted selection of colorful annuals tailored for sunny balconies and flower boxes."
  },
  {
    id: 5,
    name: "Wildflower Seeds Mix",
    price: 18.00,
    rating: 4.6,
    category: "seeds",
    img: "/cat-flowers.png",
    slug: "monstera",
    tags: ["seeds", "flowers", "wildflowers", "mix", "garden"],
    description: "Premium blend of organic seeds that grow into a pollinator-friendly cottage wildflower meadow."
  },
  {
    id: 6,
    name: "Succulent Garden Set",
    price: 24.00,
    rating: 4.4,
    category: "plants",
    img: "/cat-succulents.png",
    slug: "monstera",
    tags: ["indoor", "succulent", "mini", "set", "desktop"],
    description: "Curated collection of 4 unique miniature succulents pre-planted in clay nursery pots."
  },
  {
    id: 7,
    name: "Moisture Meter Pro",
    price: 15.00,
    rating: 4.7,
    category: "tools",
    img: "/product-spray.png",
    slug: "monstera",
    tags: ["tools", "care", "watering", "accessories", "sensor"],
    description: "Instant probe tester that measures soil moisture levels at root level to prevent overwatering."
  },
  {
    id: 8,
    name: "AI Care Soil Tester",
    price: 19.50,
    rating: 4.8,
    category: "tools",
    img: "/product-soil.png",
    slug: "monstera",
    tags: ["tools", "care", "smart", "sensor", "soil"],
    description: "Bluetooth-enabled soil analyzer tracking nutrients, pH, temperature, and light values."
  }
];

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  // Local States
  const [query, setQuery] = useState(initialQuery);
  const [searchInput, setSearchInput] = useState(initialQuery);
  const [categoryFilter, setCategoryFilter] = useState<"all" | "plants" | "seeds" | "tools">("all");
  const [sortBy, setSortBy] = useState<"relevance" | "price-asc" | "price-desc" | "rating-desc">("relevance");
  const [cartCount, setCartCount] = useState(0);
  const [addingId, setAddingId] = useState<number | null>(null);

  // Sync state if URL query changes
  useEffect(() => {
    setQuery(initialQuery);
    setSearchInput(initialQuery);
  }, [initialQuery]);

  // Load cart count from local storage if available
  useEffect(() => {
    const saved = localStorage.getItem("cartCount");
    if (saved) setCartCount(Number(saved));
  }, []);

  // Handle local page search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(searchInput);
    // update URL parameter without full page reload
    if (window.history.pushState) {
      const newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + `?q=${encodeURIComponent(searchInput)}`;
      window.history.pushState({ path: newurl }, '', newurl);
    }
  };

  // Add to cart simulator
  const handleAddToCart = (productId: number) => {
    setAddingId(productId);
    setTimeout(() => {
      const newCount = cartCount + 1;
      setCartCount(newCount);
      localStorage.setItem("cartCount", String(newCount));
      setAddingId(null);
    }, 800);
  };

  // Filter & Search Logic
  const filteredProducts = PRODUCT_CATALOG.filter(item => {
    // 1. Text Search matching name, category, description, tags
    const matchesQuery = !query.trim() || (() => {
      const q = query.toLowerCase().trim();
      return (
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags.some(tag => tag.toLowerCase().includes(q))
      );
    })();

    // 2. Category Filter
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;

    return matchesQuery && matchesCategory;
  });

  // Sorting Logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "rating-desc") return b.rating - a.rating;
    return a.id - b.id; // relevance default
  });

  // Recommended products list for empty state
  const popularRecommendations = PRODUCT_CATALOG.slice(0, 3);

  // Render Stars helper
  const renderStars = (rating: number) => {
    const stars = [];
    const floor = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} style={{ color: i <= floor ? "#cba135" : "rgba(28,28,28,0.2)" }}>★</span>
      );
    }
    return <div style={{ display: "inline-flex", gap: "2px", fontSize: "14px" }}>{stars}</div>;
  };

  return (
    <div className="search-page-container fade-up">
      {/* LOCAL STYLES FOR SEARCH RESULTS PAGE */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,700;1,400;1,700&display=swap');
        
        .search-page-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 24px;
          font-family: 'Outfit', sans-serif;
        }

        .fade-up {
          animation: fadeUp 0.45s ease-out both;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Search Header Input bar */
        .search-form-bar {
          display: flex;
          gap: 12px;
          max-width: 600px;
          margin: 0 auto 40px;
        }
        .search-bar-input {
          flex: 1;
          height: 50px;
          border-radius: 12px;
          border: 1.5px solid ${T.border};
          padding: 0 18px;
          font-family: 'Outfit', sans-serif;
          font-size: 15px;
          background: ${T.bgCard};
          outline: none;
          transition: all 0.2s ease;
          box-shadow: ${T.shadow};
        }
        .search-bar-input:focus {
          border-color: ${T.green};
          box-shadow: 0 0 0 3px ${T.greenLight}, ${T.shadow};
        }

        /* Dual Column Layout */
        .search-layout {
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 32px;
          align-items: start;
        }
        @media (max-width: 800px) {
          .search-layout {
            grid-template-columns: 1fr;
          }
          .filters-sidebar {
            position: relative !important;
            top: 0 !important;
            width: 100%;
          }
        }

        /* Filters sidebar */
        .filters-sidebar {
          background: ${T.bgCard};
          border: 1px solid ${T.border};
          border-radius: 18px;
          padding: 24px;
          box-shadow: ${T.shadow};
        }
        .filter-section-title {
          font-size: 14px;
          font-weight: 700;
          color: ${T.heading};
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 14px;
          border-bottom: 1.5px solid ${T.border};
          padding-bottom: 6px;
        }
        .filter-option-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 8px 12px;
          border-radius: 8px;
          border: none;
          background: transparent;
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          color: ${T.body};
          cursor: pointer;
          transition: all 0.15s ease;
          margin-bottom: 6px;
          text-align: left;
        }
        .filter-option-btn:hover {
          background: rgba(0, 0, 0, 0.02);
          color: ${T.heading};
        }
        .filter-option-btn.active {
          background: ${T.greenLight};
          color: ${T.greenMid};
          font-weight: 600;
        }

        /* Product Cards Grid */
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 24px;
        }
        .product-card {
          background: ${T.bgCard};
          border-radius: 18px;
          border: 1px solid ${T.border};
          overflow: hidden;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
        }
        .product-card:hover {
          box-shadow: ${T.shadowHover};
          border-color: ${T.greenPale};
          transform: translateY(-4px);
        }
        .card-img-wrapper {
          position: relative;
          width: 100%;
          height: 200px;
          background: ${T.bgMuted};
          overflow: hidden;
          border-bottom: 1px solid ${T.border};
        }
        .card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .product-card:hover .card-img {
          transform: scale(1.05);
        }
        .category-badge {
          position: absolute;
          top: 12px; left: 12px;
          background: ${T.white};
          color: ${T.muted};
          border: 1px solid ${T.border};
          border-radius: 99px;
          padding: 3px 10px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.03);
        }

        /* Action Buttons */
        .green-btn {
          background: ${T.green};
          color: ${T.white};
          font-family: 'Outfit', sans-serif;
          font-weight: 600;
          font-size: 13.5px;
          height: 38px;
          padding: 0 16px;
          border-radius: 99px;
          border: none;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.2s ease;
          box-shadow: ${T.shadowBtn};
        }
        .green-btn:hover {
          background: ${T.greenMid};
          transform: translateY(-1px);
        }
        .outline-btn {
          background: transparent;
          color: ${T.body};
          font-family: 'Outfit', sans-serif;
          font-weight: 600;
          font-size: 13.5px;
          height: 38px;
          padding: 0 16px;
          border-radius: 99px;
          border: 1.5px solid ${T.border};
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
        .outline-btn:hover {
          border-color: ${T.heading};
          background: rgba(0, 0, 0, 0.02);
        }

        /* Empty state styling */
        .empty-illustration {
          border: 1.5px dashed ${T.border};
          border-radius: 20px;
          padding: 48px 24px;
          text-align: center;
          margin-bottom: 40px;
        }

        @media (max-width: 600px) {
          .search-page-container {
            padding: 24px 16px !important;
          }
          .search-form-bar {
            margin-bottom: 24px !important;
          }
        }
        @media (max-width: 480px) {
          .search-form-bar {
            gap: 8px !important;
          }
          .search-bar-input {
            font-size: 14px !important;
            padding: 0 12px !important;
            height: 44px !important;
          }
          .search-form-bar button {
            padding: 0 16px !important;
            font-size: 13px !important;
            height: 44px !important;
          }
        }
      `}</style>

      {/* Shared Global Header */}
      <SharedNavbar cartCount={cartCount} />

      {/* Main Search Input Form */}
      <form onSubmit={handleSearchSubmit} className="search-form-bar" style={{ marginTop: "32px" }}>
        <input 
          className="search-bar-input" 
          value={searchInput} 
          onChange={e => setSearchInput(e.target.value)} 
          placeholder="Search plants, seeds, care tools..."
          onFocus={(e) => {
            if (typeof window !== "undefined" && window.innerWidth <= 768) {
              e.target.blur();
              window.dispatchEvent(new CustomEvent("open-mobile-search"));
            }
          }}
        />
        <button type="submit" className="green-btn" style={{ height: "50px", padding: "0 24px", borderRadius: "12px" }}>
          🔍 Search
        </button>
      </form>

      {/* Query Banner */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "24px", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "28px", color: T.heading, margin: 0 }}>
            {query.trim() ? `Search Results for "${query}"` : "Explore Product Catalog"}
          </h1>
          <p style={{ fontSize: "14px", color: T.muted, margin: "4px 0 0" }}>
            Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Sort selector */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "13px", fontWeight: 600, color: T.muted, textTransform: "uppercase" }}>Sort By:</span>
          <select 
            className="address-select"
            value={sortBy} 
            onChange={e => setSortBy(e.target.value as any)}
            style={{ padding: "6px 12px", fontSize: "13px" }}
          >
            <option value="relevance">Relevance</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating-desc">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Content Layout */}
      <div className="search-layout">
        {/* Sidebar Filters */}
        <aside className="filters-sidebar">
          <h3 className="filter-section-title">Categories</h3>
          <button 
            type="button" 
            className={`filter-option-btn ${categoryFilter === "all" ? "active" : ""}`}
            onClick={() => setCategoryFilter("all")}
          >
            <span>All Products</span>
            <span style={{ fontSize: "11px", opacity: 0.6 }}>({PRODUCT_CATALOG.length})</span>
          </button>
          <button 
            type="button" 
            className={`filter-option-btn ${categoryFilter === "plants" ? "active" : ""}`}
            onClick={() => setCategoryFilter("plants")}
          >
            <span>🌿 Plants</span>
            <span style={{ fontSize: "11px", opacity: 0.6 }}>({PRODUCT_CATALOG.filter(p=>p.category==="plants").length})</span>
          </button>
          <button 
            type="button" 
            className={`filter-option-btn ${categoryFilter === "seeds" ? "active" : ""}`}
            onClick={() => setCategoryFilter("seeds")}
          >
            <span>🌻 Seeds</span>
            <span style={{ fontSize: "11px", opacity: 0.6 }}>({PRODUCT_CATALOG.filter(p=>p.category==="seeds").length})</span>
          </button>
          <button 
            type="button" 
            className={`filter-option-btn ${categoryFilter === "tools" ? "active" : ""}`}
            onClick={() => setCategoryFilter("tools")}
          >
            <span>🛠️ Tools & Care</span>
            <span style={{ fontSize: "11px", opacity: 0.6 }}>({PRODUCT_CATALOG.filter(p=>p.category==="tools").length})</span>
          </button>
        </aside>

        {/* Results grid */}
        <main>
          {sortedProducts.length > 0 ? (
            <div className="products-grid">
              {sortedProducts.map((product) => (
                <div key={product.id} className="product-card scale-in">
                  <div className="card-img-wrapper">
                    <img src={product.img} alt={product.name} className="card-img" />
                    <span className="category-badge">{product.category}</span>
                  </div>
                  
                  {/* Card Info */}
                  <div style={{ padding: "18px", display: "flex", flexDirection: "column", flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      {renderStars(product.rating)}
                      <span style={{ fontSize: "12px", fontWeight: 600, color: T.amber }}>{product.rating}</span>
                    </div>

                    <h3 style={{ fontSize: "15px", fontWeight: 700, color: T.heading, margin: "0 0 6px", lineHeight: "1.4" }}>
                      {product.name}
                    </h3>
                    
                    <p style={{ fontSize: "12.5px", color: T.muted, margin: "0 0 14px", flex: 1, lineHeight: "1.4" }}>
                      {product.description}
                    </p>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${T.border}`, paddingTop: "14px" }}>
                      <span style={{ fontSize: "18px", fontWeight: 800, color: T.heading }}>
                        ${product.price.toFixed(2)}
                      </span>

                      <div style={{ display: "flex", gap: "6px" }}>
                        <Link href={`/plants/${product.slug}`} className="outline-btn" style={{ padding: "0 12px" }}>
                          Info
                        </Link>
                        <button 
                          type="button" 
                          className="green-btn" 
                          onClick={() => handleAddToCart(product.id)}
                          disabled={addingId === product.id}
                          style={{
                            background: addingId === product.id ? T.greenMid : T.green,
                            minWidth: "90px"
                          }}
                        >
                          {addingId === product.id ? "Adding..." : "Add"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* EMPTY SEARCH STATE */
            <div className="scale-in">
              <div className="empty-illustration">
                <div style={{ fontSize: "48px", marginBottom: "12px" }}>🔍</div>
                <h2 style={{ fontSize: "18px", fontWeight: 700, color: T.heading, margin: "0 0 6px" }}>No results found</h2>
                <p style={{ fontSize: "14px", color: T.muted, maxWidth: "420px", margin: "0 auto", lineHeight: "1.5" }}>
                  We couldn't find any products matching <strong>"{query}"</strong>. Try checking your spelling, using more general terms, or clear filters.
                </p>
                <button type="button" className="green-btn" style={{ marginTop: "20px" }} onClick={() => { setQuery(""); setSearchInput(""); setCategoryFilter("all"); }}>
                  Clear Search Filters
                </button>
              </div>

              {/* Recommendations */}
              <div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: 700, color: T.heading, marginBottom: "16px" }}>
                  Popular Recommendations
                </h3>
                <div className="products-grid">
                  {popularRecommendations.map((product) => (
                    <div key={product.id} className="product-card">
                      <div className="card-img-wrapper">
                        <img src={product.img} alt={product.name} className="card-img" />
                        <span className="category-badge">{product.category}</span>
                      </div>
                      <div style={{ padding: "18px", display: "flex", flexDirection: "column", flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                          {renderStars(product.rating)}
                          <span style={{ fontSize: "12px", fontWeight: 600, color: T.amber }}>{product.rating}</span>
                        </div>
                        <h3 style={{ fontSize: "15px", fontWeight: 700, color: T.heading, margin: "0 0 6px" }}>
                          {product.name}
                        </h3>
                        <p style={{ fontSize: "12px", color: T.muted, margin: "0 0 14px", flex: 1, lineHeight: "1.4" }}>
                          {product.description}
                        </p>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${T.border}`, paddingTop: "14px" }}>
                          <span style={{ fontSize: "16px", fontWeight: 800, color: T.heading }}>
                            ${product.price.toFixed(2)}
                          </span>
                          <div style={{ display: "flex", gap: "6px" }}>
                            <Link href={`/plants/${product.slug}`} className="outline-btn" style={{ padding: "0 12px" }}>
                              Info
                            </Link>
                            <button 
                              type="button" 
                              className="green-btn" 
                              onClick={() => handleAddToCart(product.id)}
                              disabled={addingId === product.id}
                              style={{ minWidth: "90px" }}
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function SearchResultsPage() {
  return (
    <div style={{ background: T.bg, minHeight: "100vh", fontFamily: "Outfit, sans-serif", paddingTop: "64px" }}>
      <Suspense fallback={
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
          <p style={{ fontSize: "16px", color: T.muted }}>Loading search results...</p>
        </div>
      }>
        <SearchResultsContent />
      </Suspense>
    </div>
  );
}
