"use client";

import { useState } from "react";
import Link from "next/link";
import SharedNavbar from "@/components/Navbar";
import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import AICare from "@/components/home/AICare";
import Footer from "@/components/home/Footer";
import WhatsAppWidget from "@/components/home/WhatsAppWidget";
import type { BlogSummary, HomepageData, ProductSummary, Testimonial } from "@/features/homepage";

/* â”€â”€ Design Tokens â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const T = {
  bg:          "#fefcf9",
  bgCard:      "#ffffff",
  bgSection:   "#f7f5f0",
  green:       "#00b566",
  greenMid:    "#009952",
  greenPale:   "rgba(0,181,102,0.08)",
  greenBorder: "rgba(0,181,102,0.18)",
  heading:     "#1c1c1c",
  body:        "#333333",
  muted:       "#7c7c7c",
  border:      "rgba(0,0,0,0.07)",
  shadow:      "0 4px 20px rgba(0,0,0,0.04)",
  shadowHover: "0 8px 30px rgba(0,181,102,0.12)",
  radius:      "20px",
};

/* â”€â”€ Product Card Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function ProductCard({ item }: { item: ProductSummary }) {
  const price = item.basePrice ?? item.base_price ?? 0;
  const comparePrice = item.compareAtPrice ?? item.compare_at_price;
  const image = item.primaryImage ?? item.primary_image;
  const ratingAvg = item.ratingAverage ?? item.rating_average ?? 5.0;
  const ratingCnt = item.ratingCount ?? item.rating_count ?? 0;

  const discount = comparePrice && comparePrice > price
    ? Math.round(((comparePrice - price) / comparePrice) * 100)
    : 0;

  return (
    <div style={{
      background: T.bgCard, border: `1.5px solid ${T.border}`,
      borderRadius: T.radius, overflow: "hidden", display: "flex",
      flexDirection: "column", boxShadow: T.shadow, position: "relative",
      transition: "transform 0.25s ease, box-shadow 0.25s ease",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-4px)";
      e.currentTarget.style.boxShadow = T.shadowHover;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = T.shadow;
    }}
    >
      {item.badge && (
        <span style={{
          position: "absolute", top: 12, left: 12, zIndex: 2,
          background: item.badge.includes("Deal") || item.badge.includes("Flash") ? "#dc2626" : T.green,
          color: "#fff", fontSize: 11, fontWeight: 700,
          padding: "3px 9px", borderRadius: 6, textTransform: "uppercase",
        }}>
          {item.badge}
        </span>
      )}

      <Link href={`/products/${item.slug}`} style={{ textDecoration: "none" }}>
        <div style={{
          width: "100%", height: 210, background: "#f5f2eb",
          display: "flex", alignItems: "center", justifyContent: "center",
          overflow: "hidden", position: "relative",
        }}>
          {image ? (
            <img src={image} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <span style={{ fontSize: 56 }}>ðŸŒ¿</span>
          )}
        </div>
      </Link>

      <div style={{ padding: "16px", display: "flex", flexDirection: "column", flex: 1 }}>
        <Link href={`/products/${item.slug}`} style={{ textDecoration: "none", color: T.heading }}>
          <h4 style={{ margin: "0 0 8px", fontSize: 15, fontWeight: 700, lineHeight: 1.3 }}>
            {item.title}
          </h4>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12, fontSize: 12 }}>
          <span style={{ color: "#f59e0b" }}>â˜…</span>
          <span style={{ fontWeight: 700, color: T.heading }}>{ratingAvg.toFixed(1)}</span>
          <span style={{ color: T.muted }}>({ratingCnt})</span>
        </div>

        <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <span style={{ fontSize: 17, fontWeight: 800, color: T.heading }}>
              â‚¹{price.toLocaleString("en-IN")}
            </span>
            {discount > 0 && comparePrice && (
              <span style={{ fontSize: 12, color: T.muted, textDecoration: "line-through", marginLeft: 6 }}>
                â‚¹{comparePrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>
          <Link
            href={`/products/${item.slug}`}
            style={{
              padding: "7px 14px", borderRadius: 8, background: T.greenPale,
              color: T.green, fontWeight: 700, fontSize: 12, textDecoration: "none",
              border: `1px solid ${T.greenBorder}`,
            }}
          >
            Buy Now
          </Link>
        </div>
      </div>
    </div>
  );
}

/* â”€â”€ Section Title â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function SectionHeader({ badge, title, subtitle }: { badge: string; title: string; subtitle?: string }) {
  return (
    <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 40px" }}>
      <span style={{
        background: T.greenPale, border: `1.5px solid ${T.greenBorder}`,
        color: T.green, fontSize: 12, fontWeight: 800, padding: "5px 14px",
        borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.05em",
        display: "inline-block", marginBottom: 12,
      }}>
        {badge}
      </span>
      <h2 style={{ margin: "0 0 10px", fontSize: 32, fontWeight: 800, color: T.heading, letterSpacing: "-0.02em" }}>
        {title}
      </h2>
      {subtitle && (
        <p style={{ margin: 0, fontSize: 15, color: T.muted, lineHeight: 1.5 }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

/* â”€â”€ Main Landing Page Component Tree â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
type HomePageClientProps = { initialData: HomepageData | null };

export default function HomePageClient({ initialData }: HomePageClientProps) {
  const data = initialData;
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const featuredList = data?.featuredProducts ?? data?.featured_products ?? [];
  const bestSellersList = data?.bestSellers ?? data?.best_sellers ?? [];
  const newArrivalsList = data?.newArrivals ?? data?.new_arrivals ?? [];
  const flashSale = data?.flashSale ?? data?.flash_sale;
  const aiCare = data?.aiCare ?? data?.ai_care;
  const gardenServices = data?.gardenServices ?? data?.garden_services;
  const testimonials = data?.testimonials ?? [];
  const blogs = data?.blogs ?? [];
  const newsletter = data?.newsletter;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubscribed(true);
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'Outfit', 'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
      `}</style>
      <SharedNavbar />

      <main>
        {/* 1. Hero Section */}
        <Hero />

        {/* 2. Categories Showcase */}
        <Categories />

        {/* 3. Flash Sale Section */}
        {flashSale && flashSale.items && flashSale.items.length > 0 && (
          <section style={{ padding: "64px 20px", background: "linear-gradient(135deg, #fff5f5 0%, #fef2f2 100%)", borderTop: "1.5px solid rgba(220,38,38,0.12)", borderBottom: "1.5px solid rgba(220,38,38,0.12)" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
              <SectionHeader
                badge="âš¡ Limited Time Deal"
                title={flashSale.title}
                subtitle={flashSale.subtitle}
              />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 24 }}>
                {flashSale.items.map((p) => (
                  <ProductCard key={p.id} item={p} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 4. Featured Products */}
        {featuredList.length > 0 && (
          <section style={{ padding: "64px 20px", background: T.bg }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
              <SectionHeader
                badge="âœ¨ Handpicked Selection"
                title="Featured Plant Collection"
                subtitle="Explore our most popular houseplants, carefully grown to bring vibrant greenery into your living spaces."
              />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 24 }}>
                {featuredList.slice(0, 4).map((p) => (
                  <ProductCard key={p.id} item={p} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 5. Best Sellers */}
        {bestSellersList.length > 0 && (
          <section style={{ padding: "64px 20px", background: T.bgSection }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
              <SectionHeader
                badge="ðŸ”¥ Customer Favorites"
                title="Best Sellers"
                subtitle="Top rated by thousands of plant parents across India."
              />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 24 }}>
                {bestSellersList.slice(0, 4).map((p) => (
                  <ProductCard key={p.id} item={p} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 6. New Arrivals */}
        {newArrivalsList.length > 0 && (
          <section style={{ padding: "64px 20px", background: T.bg }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
              <SectionHeader
                badge="ðŸŒ± Fresh Restock"
                title="New Arrivals"
                subtitle="Newly propagated rare species & freshly potted indoor plants."
              />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 24 }}>
                {newArrivalsList.slice(0, 4).map((p) => (
                  <ProductCard key={p.id} item={p} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 7. AI Care Assistant Teaser */}
        <AICare />

        {/* 8. Urban Garden Services */}
        {gardenServices && (
          <section style={{ padding: "64px 20px", background: T.bgSection }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
              <SectionHeader
                badge="ðŸ¡ Transform Your Space"
                title={gardenServices.title}
                subtitle={gardenServices.subtitle}
              />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
                {gardenServices.services.map((s) => (
                  <div key={s.id} style={{
                    background: T.bgCard, border: `1.5px solid ${T.border}`,
                    borderRadius: T.radius, padding: "28px 24px", boxShadow: T.shadow,
                  }}>
                    <span style={{ fontSize: 40, marginBottom: 12, display: "block" }}>{s.icon}</span>
                    <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: T.heading }}>
                      {s.title}
                    </h3>
                    <p style={{ margin: "0 0 16px", fontSize: 13, color: T.muted, lineHeight: 1.5 }}>
                      {s.description}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: T.green }}>
                        Starts from â‚¹{(s.priceStart ?? s.price_start ?? 0).toLocaleString("en-IN")}
                      </span>
                      <Link
                        href={gardenServices.ctaLink ?? gardenServices.cta_link ?? "/admin/garden-services"}
                        style={{
                          padding: "6px 14px", borderRadius: 8, background: T.greenPale,
                          color: T.green, fontSize: 12, fontWeight: 700, textDecoration: "none",
                        }}
                      >
                        Book â†’
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 9. Customer Testimonials */}
        {testimonials.length > 0 && (
          <section style={{ padding: "64px 20px", background: T.bg }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
              <SectionHeader
                badge="ðŸ’¬ Customer Love"
                title="What Plant Lovers Say"
                subtitle="Real reviews from verified plant parents who transformed their home gardens with us."
              />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
                {testimonials.map((t: Testimonial) => (
                  <div key={t.id} style={{
                    background: T.bgCard, border: `1.5px solid ${T.border}`,
                    borderRadius: T.radius, padding: "24px", boxShadow: T.shadow,
                    display: "flex", flexDirection: "column",
                  }}>
                    <div style={{ display: "flex", gap: 2, color: "#f59e0b", marginBottom: 12, fontSize: 16 }}>
                      {Array.from({ length: t.rating }).map((_, i) => <span key={i}>â˜…</span>)}
                    </div>
                    <p style={{ fontSize: 14, color: T.body, lineHeight: 1.6, margin: "0 0 16px", flex: 1, fontStyle: "italic" }}>
                      "{t.reviewText ?? t.review_text}"
                    </p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${T.border}`, paddingTop: 12 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: T.heading }}>{t.customerName ?? t.customer_name}</span>
                      {(t.plantPurchased ?? t.plant_purchased) && (
                        <span style={{ fontSize: 11, color: T.green, background: T.greenPale, padding: "2px 8px", borderRadius: 4 }}>
                          {t.plantPurchased ?? t.plant_purchased}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 10. Plant Blogs */}
        {blogs.length > 0 && (
          <section style={{ padding: "64px 20px", background: T.bgSection }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
              <SectionHeader
                badge="ðŸ“š Green Journal"
                title="Expert Plant Care Guides"
                subtitle="Tips, tricks, and guides from our greenhouse horticulturists."
              />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
                {blogs.map((b: BlogSummary) => (
                  <div key={b.id} style={{
                    background: T.bgCard, border: `1.5px solid ${T.border}`,
                    borderRadius: T.radius, overflow: "hidden", boxShadow: T.shadow,
                  }}>
                    <div style={{ width: "100%", height: 160, background: "#e8e5de", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 40 }}>ðŸ“–</span>
                    </div>
                    <div style={{ padding: 20 }}>
                      <span style={{ fontSize: 11, color: T.muted, fontWeight: 600 }}>{b.readTime ?? b.read_time}</span>
                      <h3 style={{ margin: "6px 0 8px", fontSize: 16, fontWeight: 700, color: T.heading, lineHeight: 1.3 }}>
                        {b.title}
                      </h3>
                      <p style={{ margin: "0 0 14px", fontSize: 13, color: T.muted, lineHeight: 1.5 }}>
                        {b.excerpt}
                      </p>
                      <Link href={`/search?q=${encodeURIComponent(b.title)}`} style={{ fontSize: 13, fontWeight: 700, color: T.green, textDecoration: "none" }}>
                        Read Guide â†’
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 11. Newsletter Signup */}
        {newsletter && (
          <section style={{ padding: "64px 20px", background: T.greenPale, borderTop: `1px solid ${T.greenBorder}`, borderBottom: `1px solid ${T.greenBorder}` }}>
            <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
              <span style={{ fontSize: 36, marginBottom: 8, display: "block" }}>ðŸ’Œ</span>
              <h2 style={{ margin: "0 0 8px", fontSize: 28, fontWeight: 800, color: T.heading }}>
                {newsletter.title}
              </h2>
              <p style={{ margin: "0 0 24px", fontSize: 14, color: T.muted, lineHeight: 1.5 }}>
                {newsletter.subtitle}
              </p>

              {subscribed ? (
                <div style={{ background: "#dcfce7", color: "#15803d", padding: "14px 20px", borderRadius: 12, fontWeight: 700, fontSize: 14 }}>
                  ðŸŽ‰ Welcome to the community! Check your inbox for your 10% OFF discount code.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
                  <input
                    type="email"
                    required
                    placeholder={newsletter.placeholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      padding: "12px 18px", borderRadius: 30, border: `1.5px solid ${T.greenBorder}`,
                      fontSize: 14, outline: "none", width: "100%", maxWidth: 360, background: "#fff",
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      padding: "12px 24px", borderRadius: 30, background: T.green,
                      color: "#fff", fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer",
                    }}
                  >
                    {newsletter.buttonText ?? newsletter.button_text}
                  </button>
                </form>
              )}

              {(newsletter.discountNote ?? newsletter.discount_note) && (
                <span style={{ fontSize: 12, color: T.muted, display: "block", marginTop: 12 }}>
                  {newsletter.discountNote ?? newsletter.discount_note}
                </span>
              )}
            </div>
          </section>
        )}
      </main>

      <Footer />
      <WhatsAppWidget />
    </div>
  );
}

