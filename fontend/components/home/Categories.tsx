"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, LeafShape } from "./icons";

type StoreItem = {
  id: string;
  label: string;
  img: string;
  price: number;
  discount?: number;
  emoji?: string;
};

const categories = [
  { id: "flowers", emoji: "🌹", label: "Flower Plants", img: "/cat-flowers.png" },
  { id: "indoor", emoji: "🪴", label: "Indoor Plants", img: "/cat-indoor.png" },
  { id: "balcony", emoji: "🌸", label: "Balcony Decor", img: "/cat-balcony.png" },
  { id: "succulents", emoji: "🌿", label: "Succulents", img: "/cat-succulents.png" },
];

export default function CategoriesSection() {
  const [activeDot, setActiveDot] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const idx = Math.round(scrollRef.current.scrollLeft / 324);
    setActiveDot(Math.min(idx, categories.length - 1));
  };

  const addToCart = (qty = 1) => {
    try {
      const cur = typeof window !== "undefined" ? Number(window.localStorage.getItem("cartCount") || 0) : 0;
      const next = cur + qty;
      if (typeof window !== "undefined") {
        window.localStorage.setItem("cartCount", String(next));
        window.dispatchEvent(new CustomEvent("cart:changed", { detail: next }));
      }
    } catch {
      // ignore
    }
  };

  return (
    <section id="categories-section" style={{ background: "var(--color-bg-secondary)", padding: "var(--space-xl) 0", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "10%", left: "2%", opacity: 0.15 }}><LeafShape color="#4A7C40" width={80} height={110} rotate={-20} opacity={1} /></div>
      <div style={{ position: "absolute", bottom: "5%", right: "3%", opacity: 0.12 }}><LeafShape color="#2D5A27" width={100} height={130} rotate={30} opacity={1} /></div>

      <div className="container">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "40px" }}>
          <div>
            <div style={{ marginBottom: "8px" }}><span className="badge-pill">🌱 Browse by Category</span></div>
            <h2 className="section-title">Our Green Categories</h2>
          </div>
          <a id="see-all-categories-link" href="#"
            style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "Poppins", fontWeight: 600, fontSize: "15px", color: "var(--color-green-dark)", transition: "gap 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.gap = "12px")}
            onMouseLeave={(e) => (e.currentTarget.style.gap = "8px")}
          >See it all <ArrowRight /></a>
        </div>

        <div ref={scrollRef} onScroll={handleScroll}
          style={{ display: "flex", gap: "24px", overflowX: "auto", scrollSnapType: "x mandatory", scrollbarWidth: "none", msOverflowStyle: "none", paddingBottom: "8px" }}
        >
          {categories.map((cat) => (
            <Link key={cat.id} href={`/plants/${cat.id}`} style={{ textDecoration: "none", flex: "0 0 auto" }}>
            <div id={`cat-card-${cat.id}`}
              style={{ minWidth: "280px", maxWidth: "300px", background: "var(--color-white)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-card)", overflow: "hidden", scrollSnapAlign: "start", cursor: "pointer", transition: "transform 0.25s ease, box-shadow 0.25s ease" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "scale(1.03) translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 16px 48px rgba(45,90,39,0.18)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "scale(1)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-card)"; }}
            >
              <div style={{ height: "260px", overflow: "hidden", position: "relative" }}>
                <Image src={cat.img} alt={cat.label} fill sizes="300px" style={{ objectFit: "cover", transition: "transform 0.4s ease" }} />
              </div>
              <div style={{ padding: "20px", textAlign: "center" }}>
                <div style={{ fontSize: "28px", marginBottom: "8px" }}>{cat.emoji}</div>
                <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "18px", color: "var(--color-text-primary)", marginBottom: "6px" }}>{cat.label}</h3>
                <span style={{ fontSize: "13px", color: "var(--color-text-secondary)", fontFamily: "DM Sans" }}>Shop Collection →</span>
              </div>
            </div>
            </Link>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "32px" }}>
          {[...Array(5)].map((_, i) => (
            <button key={i} id={`cat-dot-${i}`}
              onClick={() => { setActiveDot(i); if (scrollRef.current) scrollRef.current.scrollTo({ left: i * 324, behavior: "smooth" }); }}
              aria-label={`Category page ${i + 1}`}
              style={{ width: activeDot === i ? "32px" : "10px", height: "10px", borderRadius: "999px", background: activeDot === i ? "var(--color-green-dark)" : "#C8C0B0", border: "none", cursor: "pointer", transition: "width 0.25s ease, background 0.25s ease", padding: 0 }}
            />
          ))}
        </div>

        {/* Extra Rows: Plant types, Seeds, Soil/Tools & Pots */}
        <div style={{ marginTop: "40px", display: "flex", flexDirection: "column", gap: "28px" }}>
          {/* Plant Types Row */}
          <div>
            <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "18px", color: "var(--color-text-primary)", marginBottom: "12px" }}>Plant Types</h3>
            <div style={{ display: "flex", gap: "18px", overflowX: "auto", paddingBottom: "8px" }}>
              {[
                { id: "indoor", label: "Indoor Plants", emoji: "🏠", img: "/cat-indoor.png", price: 24.99 },
                { id: "flowers", label: "Flower Plants", emoji: "🌸", img: "/cat-flowers.png", price: 29.99, discount: 0.15 },
                { id: "succulents", label: "Succulents", emoji: "🌵", img: "/cat-succulents.png", price: 18.5 },
                { id: "balcony", label: "Balcony Decor", emoji: "🌿", img: "/cat-balcony.png", price: 34.0, discount: 0.1 },
                { id: "terrarium", label: "Terrarium Kits", emoji: "🧪", img: "/product-soil.png", price: 44.0 },
                { id: "hanging", label: "Hanging Plants", emoji: "🪢", img: "/cat-balcony.png", price: 27.5, discount: 0.2 },
              ].map((it: StoreItem) => (
                <Link key={it.id} href={`/plants/${it.id}`} style={{ textDecoration: "none", flex: "0 0 auto" }}>
                  <div style={{ minWidth: "220px", background: "var(--color-white)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-card)", overflow: "hidden", cursor: "pointer" }}>
                    <div style={{ height: "140px", position: "relative", background: "#f6f6f4" }}>
                      <Image src={it.img} alt={it.label} fill sizes="220px" style={{ objectFit: "cover" }} />
                    </div>
                    <div style={{ padding: "12px", textAlign: "center" }}>
                      <div style={{ fontSize: "22px", marginBottom: "6px" }}>{it.emoji}</div>
                      <div style={{ fontFamily: "Poppins", fontWeight: 700, color: "var(--color-text-primary)" }}>{it.label}</div>
                      {/* Price display */}
                      <div style={{ marginTop: "10px" }}>
                        {typeof it.price === "number" && (
                          (() => {
                            const hasDiscount = typeof it.discount === "number" && it.discount > 0;
                            const original = `$${it.price.toFixed(2)}`;
                            const newPrice = hasDiscount ? `$${(it.price * (1 - it.discount)).toFixed(2)}` : null;
                            return (
                              <div>
                                {hasDiscount ? (
                                  <div style={{ display: "flex", justifyContent: "center", gap: "8px", alignItems: "center" }}>
                                    <span style={{ textDecoration: "line-through", color: "#9B9B9B", fontSize: "13px" }}>{original}</span>
                                    <span style={{ fontFamily: "Poppins", fontWeight: 700, color: "var(--color-green-dark)" }}>{newPrice}</span>
                                  </div>
                                ) : (
                                  <div style={{ fontFamily: "Poppins", fontWeight: 700, color: "var(--color-green-dark)" }}>{original}</div>
                                )}
                              </div>
                            );
                          })()
                        )}
                        <div>
                          <button onClick={(e) => { e.preventDefault(); addToCart(1); }}
                            style={{ marginTop: "8px", background: "var(--color-green-dark)", color: "white", border: "none", padding: "8px 14px", borderRadius: "999px", cursor: "pointer", fontFamily: "Poppins", fontWeight: 700 }}>
                            + Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Seed Types Row */}
          <div>
            <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "18px", color: "var(--color-text-primary)", marginBottom: "12px" }}>Seed Types</h3>
            <div style={{ display: "flex", gap: "18px", overflowX: "auto", paddingBottom: "8px" }}>
              {[
                { id: "wildflower", label: "Wildflower Mix", img: "/product-seeds.png", price: 12.99, discount: 0.1 },
                { id: "herbs", label: "Herb Seeds", img: "/product-seeds.png", price: 8.5 },
                { id: "veggies", label: "Vegetable Seeds", img: "/product-seeds.png", price: 9.99, discount: 0.2 },
                { id: "microgreen", label: "Microgreen Pack", img: "/product-seeds.png", price: 6.5 },
                { id: "flower-seed-small", label: "Petite Flower Pack", img: "/product-seeds.png", price: 7.99 },
              ].map((it: StoreItem) => (
                <Link key={it.id} href={`/products/${it.id}`} style={{ textDecoration: "none", flex: "0 0 auto" }}>
                  <div style={{ minWidth: "200px", background: "var(--color-white)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-card)", overflow: "hidden", cursor: "pointer" }}>
                    <div style={{ height: "120px", position: "relative", background: "#faf8f6" }}>
                      <Image src={it.img} alt={it.label} fill sizes="200px" style={{ objectFit: "cover" }} />
                    </div>
                    <div style={{ padding: "10px", textAlign: "center" }}>
                      <div style={{ fontFamily: "Poppins", fontWeight: 700, color: "var(--color-text-primary)" }}>{it.label}</div>
                      {/* Price & discount */}
                      <div style={{ marginTop: "10px" }}>
                        {typeof it.price === "number" && (
                          (() => {
                            const hasDiscount = typeof it.discount === "number" && it.discount > 0;
                            const original = `$${it.price.toFixed(2)}`;
                            const newPrice = hasDiscount ? `$${(it.price * (1 - it.discount)).toFixed(2)}` : null;
                            return (
                              <div>
                                {hasDiscount ? (
                                  <div style={{ display: "flex", justifyContent: "center", gap: "8px", alignItems: "center" }}>
                                    <span style={{ textDecoration: "line-through", color: "#9B9B9B", fontSize: "13px" }}>{original}</span>
                                    <span style={{ fontFamily: "Poppins", fontWeight: 700, color: "var(--color-green-dark)" }}>{newPrice}</span>
                                  </div>
                                ) : (
                                  <div style={{ fontFamily: "Poppins", fontWeight: 700, color: "var(--color-green-dark)" }}>{original}</div>
                                )}
                              </div>
                            );
                          })()
                        )}
                        <div>
                          <button onClick={(e) => { e.preventDefault(); addToCart(1); }}
                            style={{ marginTop: "8px", background: "var(--color-green-dark)", color: "white", border: "none", padding: "8px 14px", borderRadius: "999px", cursor: "pointer", fontFamily: "Poppins", fontWeight: 700 }}>
                            + Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Soil, Tools & Pots Row */}
          <div>
            <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "18px", color: "var(--color-text-primary)", marginBottom: "12px" }}>Soil, Tools & Pots</h3>
            <div style={{ display: "flex", gap: "18px", overflowX: "auto", paddingBottom: "8px" }}>
              {[
                { id: "soil", label: "Potting Mix", img: "/product-soil.png", price: 18.5, discount: 0.12 },
                { id: "tools", label: "Tools & Spray", img: "/product-spray.png", price: 9.99 },
                { id: "pots", label: "Pots & Planters", img: "/product-soil.png", price: 22.0 },
                { id: "fertilizer-small", label: "Mini Fertilizer", img: "/product-fertilizer.png", price: 7.5 },
                { id: "grow-bag", label: "Grow Bag", img: "/product-soil.png", price: 11.25, discount: 0.05 },
              ].map((it: StoreItem) => (
                <Link key={it.id} href={`/products/${it.id}`} style={{ textDecoration: "none", flex: "0 0 auto" }}>
                  <div style={{ minWidth: "200px", background: "var(--color-white)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-card)", overflow: "hidden", cursor: "pointer" }}>
                    <div style={{ height: "120px", position: "relative", background: "#f9f7f3" }}>
                      <Image src={it.img} alt={it.label} fill sizes="200px" style={{ objectFit: "cover" }} />
                    </div>
                    <div style={{ padding: "10px", textAlign: "center" }}>
                      <div style={{ fontFamily: "Poppins", fontWeight: 700, color: "var(--color-text-primary)" }}>{it.label}</div>
                      <div style={{ marginTop: "10px" }}>
                        {typeof it.price === "number" && (
                          (() => {
                            const hasDiscount = typeof it.discount === "number" && it.discount > 0;
                            const original = `$${it.price.toFixed(2)}`;
                            const newPrice = hasDiscount ? `$${(it.price * (1 - it.discount)).toFixed(2)}` : null;
                            return (
                              <div>
                                {hasDiscount ? (
                                  <div style={{ display: "flex", justifyContent: "center", gap: "8px", alignItems: "center" }}>
                                    <span style={{ textDecoration: "line-through", color: "#9B9B9B", fontSize: "13px" }}>{original}</span>
                                    <span style={{ fontFamily: "Poppins", fontWeight: 700, color: "var(--color-green-dark)" }}>{newPrice}</span>
                                  </div>
                                ) : (
                                  <div style={{ fontFamily: "Poppins", fontWeight: 700, color: "var(--color-green-dark)" }}>{original}</div>
                                )}
                              </div>
                            );
                          })()
                        )}
                        <div>
                          <button onClick={(e) => { e.preventDefault(); addToCart(1); }}
                            style={{ marginTop: "8px", background: "var(--color-green-dark)", color: "white", border: "none", padding: "8px 14px", borderRadius: "999px", cursor: "pointer", fontFamily: "Poppins", fontWeight: 700 }}>
                            + Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`::-webkit-scrollbar { display: none; }`}</style>
    </section>
  );
}

