"use client";

import { useState } from "react";
import { SearchIcon } from "./icons";
import ProductCard from "@/components/ui/ProductCard";

const products = [
  { id: "seeds", name: "Wildflower Seed Mix", price: "$12.99", img: "/product-seeds.png", badge: "Best Seller" },
  { id: "soil", name: "Premium Potting Mix", price: "$18.50", img: "/product-soil.png", badge: "Organic" },
  { id: "spray", name: "Plant Mist Spray", price: "$9.99", img: "/product-spray.png", badge: "New" },
  { id: "fertilizer", name: "Growth Fertilizer", price: "$14.99", img: "/product-fertilizer.png", badge: "Popular" },
];

export default function ProductsSection() {
  const [query, setQuery] = useState("");

  return (
    <section id="products-section" style={{ background: "var(--color-bg-primary)", padding: "var(--space-xl) 0", position: "relative" }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "64px", alignItems: "center" }} className="products-grid">
          {/* Left */}
          <div>
            <div style={{ marginBottom: "16px" }}><span className="badge-pill">🛒 Shop Essentials</span></div>
            <h2 className="section-title" style={{ marginBottom: "16px" }}>Everything<br />You Need</h2>
            <p style={{ fontFamily: "DM Sans", fontSize: "16px", color: "var(--color-text-secondary)", lineHeight: 1.7, marginBottom: "32px", maxWidth: "360px" }}>
              From rare seeds to premium soils and expert-tested plant nutrients — your one-stop plant supply shop.
            </p>
            <div style={{ display: "flex", background: "white", borderRadius: "var(--radius-full)", padding: "6px 6px 6px 20px", boxShadow: "var(--shadow-card)", gap: "8px", alignItems: "center", maxWidth: "420px" }} className="products-search-wrap">
              <SearchIcon />
              <input id="search-order-input" type="text" placeholder="Search products…" value={query} onChange={(e) => setQuery(e.target.value)}
                style={{ flex: 1, border: "none", outline: "none", fontFamily: "DM Sans", fontSize: "15px", color: "var(--color-text-primary)", background: "transparent" }}
              />
              <button id="subscribe-btn" className="btn-primary" style={{ padding: "10px 24px", fontSize: "14px" }}>Subscribe</button>
            </div>
            <p style={{ fontFamily: "DM Sans", fontSize: "13px", color: "var(--color-text-secondary)", marginTop: "12px" }}>🌱 Get weekly plant care tips & exclusive deals</p>
          </div>

          {/* Right — Product Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }} className="products-right-grid">
            {products.map((product) => <ProductCard key={product.id} id={product.id} name={product.name} image={product.img} price={product.price} badge={product.badge} onAddToCart={() => undefined} />)}
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) { .products-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 480px) {
          .products-right-grid {
            grid-template-columns: 1fr !important;
          }
          .products-search-wrap {
            padding: 4px 4px 4px 12px !important;
            gap: 4px !important;
          }
          .products-search-wrap input {
            font-size: 13px !important;
          }
          .products-search-wrap button {
            padding: 8px 16px !important;
            font-size: 12px !important;
          }
        }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   AI CARE SECTION
═══════════════════════════════════════════════════ */
