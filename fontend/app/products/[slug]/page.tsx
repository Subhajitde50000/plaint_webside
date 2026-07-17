"use client";

import { useState, useEffect, useRef, useCallback, use, useMemo } from "react";
import Link from "next/link";
import SharedNavbar from "@/components/Navbar";
import { useProduct } from "@/features/products/hooks/useProduct";
import { useProducts } from "@/features/products/hooks/useProducts";
import { useCart } from "@/features/cart/hooks/useCart";

/* ═══════════════════════════════════════════════════
   SVG ICONS
═══════════════════════════════════════════════════ */
function LeafIcon({ size = 24, color = "#2D5A27" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2C12 2 4 5 4 13C4 17.4 7.6 21 12 21C16.4 21 20 17.4 20 13C20 5 12 2 12 2Z" fill={color} opacity="0.9" />
      <path d="M12 21V10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 15L8 11" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M12 12L16 8" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function StarIcon({ filled = true }: { filled?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "#F5C842" : "none"} stroke="#F5C842" strokeWidth="2">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function HeartIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? "#e53935" : "none"} stroke={filled ? "#e53935" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" rx="1" /><path d="M16 8h4l3 5v3h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 4 1 10 7 10" /><polyline points="23 20 23 14 17 14" />
      <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
    </svg>
  );
}

function PackageIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" /><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

function RobotIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="12" x="3" y="8" rx="2" /><path d="M12 2v6" /><path d="M8 2h8" />
      <circle cx="8.5" cy="14" r="1" fill="white" stroke="none" /><circle cx="15.5" cy="14" r="1" fill="white" stroke="none" />
      <path d="M9 18h6" />
    </svg>
  );
}

function ChevRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function ChevLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════ */
const MOCK_REVIEWS = [
  { initials: "AK", name: "Ananya K.", location: "Mumbai", date: "Mar 2026", rating: 5, verified: true, text: "Absolutely love this product! It arrived in perfect condition, well-packed. The quality is exceptional." },
  { initials: "RS", name: "Rahul S.", location: "Bangalore", date: "Feb 2026", rating: 5, verified: true, text: "Best purchase I've made. The size was a great choice. Genuinely helpful and beautiful!" },
  { initials: "PJ", name: "Priya J.", location: "Delhi", date: "Jan 2026", rating: 4, verified: true, text: "Beautiful product and very high quality on arrival. Overall great experience." },
  { initials: "VM", name: "Vikram M.", location: "Chennai", date: "Dec 2025", rating: 5, verified: true, text: "Exceeded expectations. The product is huge for the price. Will definitely buy again." },
];

const MOCK_RELATED_PRODUCTS = [
  { name: "Snake Plant", type: "Sansevieria trifasciata", price: 799, emoji: "🌵", color: "#C8DFC0", slug: "snake-plant", firstVariantId: null as string | null },
  { name: "Peace Lily", type: "Spathiphyllum", price: 949, emoji: "🌸", color: "#F0D8E8" , slug: "peace-lily", firstVariantId: null as string | null },
  { name: "Fiddle Leaf Fig", type: "Ficus lyrata", price: 1599, emoji: "🌳", color: "#D4E8CE", slug: "fiddle-leaf-fig", firstVariantId: null as string | null },
  { name: "ZZ Plant", type: "Zamioculcas", price: 699, emoji: "🌿", color: "#DFF0D8", slug: "zz-plant", firstVariantId: null as string | null },
];

const PRODUCT = {
  slug: "monstera-deliciosa",
  name: "Monstera Deliciosa",
  tagline: "The Swiss Cheese Plant",
  categories: ["Indoor Plants", "Tropical"],
  rating: 4.8,
  reviewCount: 342,
  verified: true,
  price: 1299,
  originalPrice: 1799,
  discount: 28,
  taxNote: "Inclusive of all taxes",
  description: "The iconic Monstera Deliciosa, affectionately known as the Swiss Cheese Plant, brings bold tropical vibes to any interior. Famous for its dramatic split leaves and vigorous growth, it's a favourite for plant lovers of all levels.",
  features: [
    "Air-purifying — removes toxins from indoor air",
    "Fast-growing with dramatic split leaves",
    "Thrives in indirect bright light",
    "Non-fussy, forgiving of missed watering",
    "Statement piece for living rooms & offices",
  ],
  specs: [
    { label: "Plant Type", value: "Tropical Foliage" },
    { label: "Light Requirement", value: "Bright Indirect" },
    { label: "Watering", value: "Once a week" },
    { label: "Humidity", value: "40–70%" },
    { label: "Toxicity", value: "Toxic to pets" },
    { label: "Growth Rate", value: "Fast" },
    { label: "Origin", value: "Central America" },
    { label: "Difficulty", value: "Beginner" },
  ],
  care: [
    { icon: "☀️", label: "Light", value: "Indirect" },
    { icon: "💧", label: "Water", value: "Weekly" },
    { icon: "🌡️", label: "Temp", value: "18–27°C" },
    { icon: "🌬️", label: "Skill", value: "Beginner" },
  ],
  sizes: [
    { name: "Small", height: "20–30 cm", bestFor: "Desk & Shelf", potDia: "12 cm", dispatch: "1–2 days" },
    { name: "Medium", height: "40–55 cm", bestFor: "Most popular pick", potDia: "18 cm", dispatch: "1–2 days" },
    { name: "Large", height: "65–80 cm", height_cm: 72, bestFor: "Statement corners", potDia: "24 cm", dispatch: "1–2 days" },
    { name: "XL", height: "90–110 cm", bestFor: "Feature plant", potDia: "30 cm", dispatch: "1–2 days" },
  ],
  images: [
    { label: "Front view", emoji: "🌿", color: "#D4E8CE" },
    { label: "Leaves close-up", emoji: "🍃", color: "#C8DFC0" },
    { label: "Lifestyle shot", emoji: "🏡", color: "#E8F4D0" },
    { label: "Roots & stem", emoji: "🌱", color: "#DFF0D8" },
  ],
  pots: [
    { name: "Terracotta", price: 349, icon: "🏺" },
    { name: "White Ceramic", price: 499, icon: "🫙" },
    { name: "Jute Basket", price: 279, icon: "🧺" },
  ],
  careGuide: [
    { title: "Light", icon: "☀️", level: 3, desc: "Place in bright, indirect sunlight. Avoid harsh direct sun which scorches leaves. North or east-facing windows are ideal." },
    { title: "Watering", icon: "💧", level: 2, desc: "Water once every 7–10 days. Allow the top 2–3 cm of soil to dry between waterings. Reduce in winter." },
    { title: "Humidity", icon: "🌫️", level: 3, desc: "Loves 50–70% humidity. Mist leaves weekly or use a pebble tray. Avoid dry heating vents." },
    { title: "Fertilizer", icon: "🌿", level: 2, desc: "Feed every 4 weeks with balanced liquid fertilizer during spring and summer. Skip in winter." },
    { title: "Repotting", icon: "🪴", level: 2, desc: "Repot every 1–2 years when roots poke out of drainage holes. Use well-draining potting mix." },
    { title: "Pruning", icon: "✂️", level: 1, desc: "Trim yellowing or damaged leaves at the base with clean scissors. Light pruning promotes bushier growth." },
  ],
  reviews: MOCK_REVIEWS,
  relatedProducts: MOCK_RELATED_PRODUCTS,
};

/* ═══════════════════════════════════════════════════
   TOAST
═══════════════════════════════════════════════════ */
function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <div style={{
      position: "fixed", bottom: 96, left: "50%", transform: `translateX(-50%) translateY(${visible ? "0" : "24px"})`,
      background: "var(--color-green-dark)", color: "white",
      fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "14px",
      padding: "14px 28px", borderRadius: "var(--radius-full)", boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
      zIndex: 9999, opacity: visible ? 1 : 0, transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
      whiteSpace: "nowrap",
    }}>
      🛒 {message}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   IMAGE GALLERY
   Renders real image URLs using <img> tags with dynamic fallback.
   ═══════════════════════════════════════════════════ */
function ImageGallery({ images }: { images: { label: string; url?: string; emoji?: string; color: string }[] }) {
  const [active, setActive] = useState(0);
  const [fading, setFading] = useState(false);

  const switchImage = (idx: number) => {
    if (idx === active) return;
    setFading(true);
    setTimeout(() => { setActive(idx); setFading(false); }, 200);
  };

  const currentImage = images[active] || images[0];

  return (
    <div className="pdp-gallery-sticky">
      {/* Main image */}
      <div style={{
        background: "white", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-card)",
        aspectRatio: "1/1", display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", overflow: "hidden", marginBottom: "12px",
      }}>
        {/* Blob */}
        <div style={{
          position: "absolute", width: "320px", height: "320px", borderRadius: "50%",
          background: currentImage?.color || "#D4E8CE", opacity: 0.6, top: "50%", left: "50%",
          transform: "translate(-50%,-50%)", transition: "background 0.4s ease",
        }} />

        {/* Plant image */}
        <div style={{
          position: "relative", zIndex: 1,
          animation: "floatPlant 3s ease-in-out infinite",
          opacity: fading ? 0 : 1,
          transition: "opacity 0.2s ease",
          textAlign: "center",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
        }}>
          {currentImage?.url ? (
            <img
              src={currentImage.url}
              alt={currentImage.label}
              style={{
                maxWidth: "85%",
                maxHeight: "85%",
                objectFit: "contain",
              }}
            />
          ) : (
            <span style={{ fontSize: "180px", lineHeight: 1, display: "block" }}>{currentImage?.emoji}</span>
          )}
          <p style={{
            fontFamily: "DM Sans, sans-serif", fontSize: "13px",
            color: "var(--color-text-secondary)", marginTop: "8px",
          }}>{currentImage?.label}</p>
        </div>

        {/* Badge Organic */}
        <div style={{
          position: "absolute", bottom: "16px", left: "16px",
          background: "var(--color-green-dark)", color: "white",
          fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "12px",
          padding: "5px 14px", borderRadius: "var(--radius-full)", zIndex: 2,
        }}>🌿 Organic</div>

        {/* Badge Sale */}
        <div style={{
          position: "absolute", bottom: "16px", right: "16px",
          background: "#F5C842", color: "#2D3A2E",
          fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "12px",
          padding: "5px 12px", borderRadius: "var(--radius-full)", zIndex: 2,
        }}>Sale</div>
      </div>

      {/* Thumbnails */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => switchImage(idx)}
            aria-label={img.label}
            style={{
              background: "white", border: `2px solid ${active === idx ? "var(--color-green-dark)" : "rgba(45,90,39,0.15)"}`,
              borderRadius: "var(--radius-md)", aspectRatio: "1/1", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "var(--shadow-card)", transition: "border-color 0.2s, transform 0.2s",
              transform: active === idx ? "scale(1.04)" : "scale(1)",
              padding: 4,
            }}
          >
            {img.url ? (
              <img
                src={img.url}
                alt={img.label}
                style={{ width: "90%", height: "90%", objectFit: "contain" }}
              />
            ) : (
              <span style={{ fontSize: "28px" }}>{img.emoji}</span>
            )}
          </button>
        ))}
      </div>

      <style>{`
        @keyframes floatPlant {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   STAR BAR (for reviews)
═══════════════════════════════════════════════════ */
function StarBar({ count, total, pct }: { count: number; total: number; pct: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
      <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "13px", color: "var(--color-text-secondary)", minWidth: "16px" }}>{count}</span>
      <StarIcon filled />
      <div style={{ flex: 1, height: "7px", background: "var(--color-bg-secondary)", borderRadius: "99px", overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: "#F5C842", borderRadius: "99px", transition: "width 0.6s ease" }} />
      </div>
      <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "12px", color: "var(--color-text-secondary)", minWidth: "30px" }}>{total}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════ */
interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  const { data: product, isLoading, isError } = useProduct(slug);

  // Fetch related products dynamically
  const { data: relatedData } = useProducts({
    productType: product?.product_type || undefined,
    pageSize: 4,
  });

  const { addItem, isAddingItem } = useCart();
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState(0); // default to first variant
  const [wishlisted, setWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState<"about" | "care" | "reviews">("about");
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMsg, setToastMsg] = useState("Added to cart!");
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset selected size when product changes
  useEffect(() => {
    setSelectedSize(0);
  }, [product]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastVisible(false), 2500);
  };

  // Map real product data to layout expected fields
  const p = useMemo(() => {
    if (!product) return null;

    const basePrice = Number(product.base_price);
    const compareAt = product.compare_at_price != null ? Number(product.compare_at_price) : null;
    const discount = compareAt && compareAt > basePrice
      ? Math.round(((compareAt - basePrice) / compareAt) * 100)
      : 0;

    const sizes = product.variants?.length > 0
      ? product.variants.map((v) => ({
          name: v.option_name,
          height: v.option_detail || "Standard size",
          bestFor: v.best_for || "Most popular pick",
          potDia: v.pot_diameter || "N/A",
          dispatch: v.dispatch_time || "1–2 days",
          price: Number(v.price),
          originalPrice: v.compare_at_price ? Number(v.compare_at_price) : null,
          discount: v.compare_at_price && Number(v.compare_at_price) > Number(v.price)
            ? Math.round(((Number(v.compare_at_price) - Number(v.price)) / Number(v.compare_at_price)) * 100)
            : 0
        }))
      : [
          { name: "Standard", height: "Standard size", bestFor: "Most popular pick", potDia: "N/A", dispatch: "1–2 days", price: basePrice, originalPrice: compareAt, discount }
        ];

    // Image mapping
    const sortedImages = [...product.images].sort((a, b) => a.position - b.position);
    const images = sortedImages.length > 0
      ? sortedImages.map((img) => ({
          label: img.alt_text || "Product view",
          url: img.url,
          color: "#D4E8CE"
        }))
      : [
          { label: "Product view", url: "/placeholder-plant.jpg", color: "#D4E8CE" }
        ];

    // Care guide cards mapping
    const careGuide = product.care_cards?.length > 0
      ? product.care_cards.map((c) => ({
          title: c.title,
          icon: c.icon || "🌿",
          level: c.difficulty_level,
          desc: c.value + (c.detail ? ` — ${c.detail}` : "")
        }))
      : [
          { title: "Light", icon: "☀️", level: 3, desc: product.care_light || "Indirect bright sunlight is best." },
          { title: "Watering", icon: "💧", level: 2, desc: product.care_water || "Water when top soil feels dry." }
        ];

    // Specs mapping
    const specs = product.specifications?.length > 0
      ? product.specifications.map((s) => ({ label: s.label, value: s.value }))
      : [
          { label: "Botanical Name", value: product.botanical_name || "N/A" },
          { label: "Common Name", value: product.common_name || "N/A" },
          { label: "Pet Friendly", value: product.is_pet_friendly ? "Yes" : "No" },
          { label: "Air Purifying", value: product.is_air_purifying ? "Yes" : "No" },
          { label: "Care Skill", value: product.care_skill || "Beginner" }
        ];

    // Features mapping
    const features = product.features?.length > 0
      ? product.features.map((f) => f.feature)
      : [
          "Air-purifying qualities to clean indoor spaces",
          "Thrives under moderate indirect light",
          "Low-maintenance and easy to grow",
        ];

    // Care quick chips
    const care = [
      { icon: "☀️", label: "Light", value: product.care_light || "Indirect" },
      { icon: "💧", label: "Water", value: product.care_water || "Weekly" },
      { icon: "🌡️", label: "Temp", value: product.care_temperature || "18–27°C" },
      { icon: "🌬️", label: "Skill", value: product.care_skill || "Beginner" }
    ];

    // Pots upsells
    const pots = product.pot_upsells?.length > 0
      ? product.pot_upsells.map((pu) => ({
          name: pu.pot_product.title,
          price: Number(pu.pot_product.base_price),
          icon: "🏺",
          slug: pu.pot_product.slug
        }))
      : [
          { name: "Terracotta Pot", price: 349, icon: "🏺", slug: "terracotta-pot" },
          { name: "White Ceramic Pot", price: 499, icon: "🫙", slug: "white-ceramic-pot" }
        ];

    // Related products
    const related = (relatedData?.items ?? []).map((item) => ({
      name: item.title,
      type: item.short_description || "",
      price: Number(item.base_price),
      emoji: "🌿",
      color: "#D4E8CE",
      slug: item.slug,
      firstVariantId: item.variants?.[0]?.id ? String(item.variants[0].id) : null
    }));

    return {
      slug: product.slug,
      name: product.title,
      tagline: product.botanical_name || product.common_name || product.short_description || "",
      categories: [product.product_type],
      rating: Number(product.rating_average),
      reviewCount: product.rating_count,
      verified: product.rating_count > 0,
      price: basePrice,
      originalPrice: compareAt,
      discount,
      taxNote: product.price_note || "Inclusive of all taxes",
      description: product.description || "",
      features,
      specs,
      care,
      sizes,
      images,
      pots,
      careGuide,
      reviews: MOCK_REVIEWS,
      relatedProducts: related.length > 0 ? related : MOCK_RELATED_PRODUCTS
    };
  }, [product, relatedData]);

  const handleAddToCart = () => {
    if (!p || !product) return;
    const variant = product.variants?.[selectedSize];
    if (!variant) {
      showToast("Selected size/variant is not available.");
      return;
    }
    addItem(
      { variantId: String(variant.id), quantity: qty },
      {
        onSuccess: () => {
          showToast(`${qty}× ${p.name} added to cart!`);
        },
        onError: (err: any) => {
          const detail = err?.response?.data?.detail || "Could not add item to cart. Please log in first.";
          showToast(detail);
        }
      }
    );
  };

  // Scroll-in for sections — must be declared before any early return
  const aiRef = useRef<HTMLDivElement>(null);
  const [aiVisible, setAiVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setAiVisible(true); }, { threshold: 0.15 });
    if (aiRef.current) obs.observe(aiRef.current);
    return () => obs.disconnect();
  }, []);

  if (isLoading) {
    return (
      <>
        <SharedNavbar />
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", fontFamily: "Poppins, sans-serif", fontSize: 16 }}>
          Loading product details...
        </div>
      </>
    );
  }

  if (isError || !p) {
    return (
      <>
        <SharedNavbar />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "100vh", fontFamily: "Poppins, sans-serif", gap: 16 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--color-green-dark)" }}>Product Not Found</h1>
          <p style={{ color: "var(--color-text-secondary)" }}>The product you are looking for does not exist or has been removed.</p>
          <Link href="/categories/plants" className="btn-primary" style={{ textDecoration: "none" }}>Back to Shop</Link>
        </div>
      </>
    );
  }

  const size = p.sizes[selectedSize] || p.sizes[0];
  const activePrice = size?.price ?? p.price;
  const activeOriginalPrice = size?.originalPrice ?? p.originalPrice;
  const activeDiscount = size?.discount ?? p.discount;

  return (
    <>
      <SharedNavbar />

      <style>{`
        /* PDP page styles */
        .pdp-wrap { padding-top: 80px; }

        /* Gallery container sticky */
        .pdp-gallery-sticky {
          position: sticky;
          top: 88px;
        }

        /* Breadcrumb */
        .pdp-breadcrumb {
          padding: 20px 48px;
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: 'Poppins', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: var(--color-text-secondary);
          flex-wrap: wrap;
        }
        .pdp-breadcrumb a { color: var(--color-text-secondary); text-decoration: none; transition: color 0.2s; }
        .pdp-breadcrumb a:hover { color: var(--color-green-dark); }
        .pdp-breadcrumb-sep { opacity: 0.5; }
        .pdp-breadcrumb-current { color: var(--color-green-dark); font-weight: 600; }

        /* Main grid */
        .pdp-main-grid {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 48px 80px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: start;
        }

        /* Dividers */
        .pdp-divider {
          border: none;
          border-top: 1px solid rgba(45,90,39,0.10);
          margin: 20px 0;
        }

        /* Tabs */
        .pdp-tabs-wrap {
          max-width: 1280px;
          margin: 60px auto 0;
          padding: 0 48px;
        }
        .pdp-tab-bar {
          display: flex;
          gap: 0;
          border-bottom: 2px solid rgba(45,90,39,0.12);
          margin-bottom: 36px;
        }
        .pdp-tab-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'Poppins', sans-serif;
          font-size: 16px;
          padding: 14px 28px;
          position: relative;
          transition: color 0.2s;
        }
        .pdp-tab-btn.active {
          color: var(--color-green-dark);
          font-weight: 600;
        }
        .pdp-tab-btn.active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--color-green-dark);
          border-radius: 2px 2px 0 0;
        }
        .pdp-tab-btn:not(.active) {
          color: var(--color-text-secondary);
          font-weight: 500;
        }

        /* About grid */
        .pdp-about-grid {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 40px;
          align-items: start;
        }

        /* Care grid */
        .pdp-care-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        /* Related grid */
        .pdp-related-grid {
          max-width: 1280px;
          margin: 0 auto;
          padding: 60px 48px;
        }
        .pdp-products-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-top: 28px;
        }

        /* Community banner */
        .pdp-community {
          background: var(--color-green-dark);
          padding: 64px 48px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        /* Mobile responsive */
        @media (max-width: 1024px) {
          .pdp-gallery-sticky {
            position: relative;
            top: 0;
          }
          .pdp-main-grid { grid-template-columns: 1fr; gap: 36px; padding: 0 24px 60px; }
          .pdp-about-grid { grid-template-columns: 1fr; }
          .pdp-care-grid { grid-template-columns: repeat(2, 1fr); }
          .pdp-products-grid { grid-template-columns: repeat(2, 1fr); }
          .pdp-breadcrumb { padding: 16px 24px; }
          .pdp-tabs-wrap { padding: 0 24px; }
          .pdp-related-grid { padding: 48px 24px; }
          .pdp-community { padding: 48px 24px; }
        }
        @media (max-width: 640px) {
          .pdp-tab-bar {
            overflow-x: auto;
            white-space: nowrap;
            -webkit-overflow-scrolling: touch;
            display: flex;
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none; /* IE/Edge */
          }
          .pdp-tab-bar::-webkit-scrollbar {
            display: none; /* Chrome/Safari/Webkit */
          }
          .pdp-tab-btn {
            flex-shrink: 0;
            padding: 12px 16px;
            font-size: 14px;
          }
          .pdp-care-grid { grid-template-columns: repeat(2, 1fr); }
          .pdp-products-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .pdp-main-grid { padding: 0 16px 48px; }
          .pdp-breadcrumb { padding: 14px 16px; }
          .pdp-tabs-wrap { padding: 0 16px; }
          .pdp-related-grid { padding: 40px 16px; }
          .pdp-community { padding: 40px 16px; }
        }
      `}</style>

      <div className="pdp-wrap">
        {/* ── Breadcrumb ── */}
        <nav className="pdp-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span className="pdp-breadcrumb-sep">›</span>
          <Link href="/categories/plants">Indoor Plants</Link>
          <span className="pdp-breadcrumb-sep">›</span>
          <span className="pdp-breadcrumb-current">{p.name}</span>
        </nav>

        {/* ── Main Grid ── */}
        <div className="pdp-main-grid">
          {/* LEFT — Gallery */}
          <ImageGallery images={p.images} />

          {/* RIGHT — Info */}
          <div>
            {/* Category tags */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
              {p.categories.map((cat, i) => (
                <span key={cat} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{
                    fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "12px",
                    color: "var(--color-green-mid)", letterSpacing: "0.08em", textTransform: "uppercase",
                  }}>{cat}</span>
                  {i < p.categories.length - 1 && (
                    <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "var(--color-green-light)", display: "inline-block" }} />
                  )}
                </span>
              ))}
            </div>

            {/* Product name */}
            <div style={{ position: "relative", marginBottom: "8px" }}>
              <h1 style={{
                fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: "clamp(28px,4vw,44px)",
                color: "var(--color-green-dark)", lineHeight: 1.15,
              }}>
                {p.name}
                <span style={{
                  display: "inline-block", marginLeft: "10px", color: "var(--color-accent-yellow)",
                  fontSize: "28px", animation: "pulse-star 2s ease-in-out infinite", verticalAlign: "middle",
                }}>✦</span>
              </h1>
              <p style={{ fontFamily: "DM Sans, sans-serif", color: "var(--color-text-secondary)", fontSize: "15px", marginTop: "4px" }}>
                {p.tagline}
              </p>
            </div>

            {/* Rating row */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                {[1,2,3,4,5].map((s) => (
                  <StarIcon key={s} filled={s <= Math.round(p.rating)} />
                ))}
              </div>
              <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "14px", color: "var(--color-text-primary)" }}>{p.rating}</span>
              <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "13px", color: "var(--color-text-secondary)" }}>({p.reviewCount} reviews)</span>
              {p.verified && (
                <span style={{
                  background: "var(--color-green-pale)", color: "var(--color-green-dark)",
                  fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "11px",
                  padding: "3px 10px", borderRadius: "var(--radius-full)",
                }}>✓ Verified Seller</span>
              )}
              <button
                onClick={() => { navigator.share?.({ title: p.name, url: window.location.href }); }}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-secondary)", marginLeft: "auto", display: "flex", alignItems: "center", gap: "4px" }}
                aria-label="Share product"
              >
                <ShareIcon />
              </button>
            </div>

            <hr className="pdp-divider" />

            {/* Price block */}
            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
                <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "clamp(26px,3vw,34px)", color: "var(--color-green-dark)" }}>
                  ₹{activePrice.toLocaleString("en-IN")}
                </span>
                {activeOriginalPrice && activeOriginalPrice > activePrice && (
                  <span style={{ fontFamily: "Poppins, sans-serif", fontSize: "18px", color: "var(--color-text-secondary)", textDecoration: "line-through" }}>
                    ₹{activeOriginalPrice.toLocaleString("en-IN")}
                  </span>
                )}
                {activeDiscount > 0 && (
                  <span style={{
                    background: "#fff0c2", color: "#8a6200",
                    fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "12px",
                    padding: "4px 10px", borderRadius: "var(--radius-full)",
                  }}>{activeDiscount}% OFF</span>
                )}
              </div>
              <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "12px", color: "var(--color-text-secondary)", marginTop: "4px" }}>
                {p.taxNote}
              </p>
            </div>

            <hr className="pdp-divider" />

            {/* Size selector */}
            <div style={{ marginBottom: "16px" }}>
              <p style={{
                fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "14px",
                color: "var(--color-text-primary)", marginBottom: "12px",
              }}>
                Plant Size
              </p>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {p.sizes.map((sz, idx) => (
                  <button
                    key={sz.name}
                    aria-pressed={selectedSize === idx}
                    onClick={() => setSelectedSize(idx)}
                    style={{
                      background: selectedSize === idx ? "var(--color-green-pale)" : "white",
                      border: `2px solid ${selectedSize === idx ? "var(--color-green-dark)" : "rgba(45,90,39,0.20)"}`,
                      borderRadius: "var(--radius-full)",
                      padding: "10px 20px",
                      cursor: "pointer",
                      fontFamily: "Poppins, sans-serif",
                      transition: "all 0.2s ease",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: "13px", color: "var(--color-green-dark)" }}>{sz.name}</div>
                    <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: "11px", color: "var(--color-text-secondary)", marginTop: "2px" }}>{sz.height}</div>
                  </button>
                ))}
              </div>
              <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "12px", color: "var(--color-text-secondary)", marginTop: "10px" }}>
                Pot not included — browse our pot collection below
              </p>
            </div>

            {/* Size detail card */}
            <div style={{
              background: "white", border: "1.5px solid var(--color-green-pale)",
              borderRadius: "var(--radius-md)", padding: "14px 18px", marginBottom: "20px",
              display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
              gap: "0",
            }}>
              {[
                { label: "Height", value: size.height },
                { label: "Best for", value: size.bestFor },
                { label: "Pot dia.", value: size.potDia },
                { label: "Dispatch", value: size.dispatch },
              ].map((stat, i) => (
                <div key={stat.label} style={{
                  padding: "8px 12px",
                  borderRight: i < 3 ? "1px solid rgba(45,90,39,0.10)" : "none",
                }}>
                  <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "10px", textTransform: "uppercase", color: "var(--color-text-secondary)", letterSpacing: "0.05em", marginBottom: "4px" }}>{stat.label}</div>
                  <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "13px", color: "var(--color-green-dark)" }}>{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Pot upsell strip */}
            <div style={{
              background: "var(--color-bg-secondary)", borderRadius: "var(--radius-md)",
              padding: "14px 18px", marginBottom: "20px",
            }}>
              <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "11px", textTransform: "uppercase", color: "var(--color-text-secondary)", letterSpacing: "0.08em", marginBottom: "10px" }}>
                Pair it with a pot
              </p>
              <div style={{ display: "flex", gap: "10px", overflowX: "auto", paddingBottom: "4px" }}>
                {p.pots.map((pot) => (
                  <Link
                    key={pot.name}
                    href={`/products/${pot.slug}`}
                    style={{
                      display: "flex", alignItems: "center", gap: "8px",
                      background: "white", border: "1.5px solid rgba(45,90,39,0.15)",
                      borderRadius: "var(--radius-full)", padding: "8px 16px",
                      textDecoration: "none", flexShrink: 0,
                      transition: "border-color 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--color-green-mid)")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(45,90,39,0.15)")}
                  >
                    <span style={{ fontSize: "18px" }}>{pot.icon}</span>
                    <div>
                      <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "12px", color: "var(--color-text-primary)" }}>{pot.name}</div>
                      <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: "11px", color: "var(--color-green-mid)" }}>₹{pot.price}</div>
                    </div>
                  </Link>
                ))}
                <Link
                  href="/categories/pots"
                  style={{
                    display: "flex", alignItems: "center", gap: "6px",
                    background: "white", border: "1.5px solid rgba(45,90,39,0.15)",
                    borderRadius: "var(--radius-full)", padding: "8px 16px",
                    textDecoration: "none", flexShrink: 0, color: "var(--color-green-mid)",
                    fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "12px",
                    transition: "border-color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--color-green-mid)")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(45,90,39,0.15)")}
                >
                  All Pots →
                </Link>
              </div>
            </div>

            {/* Qty + Wishlist */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" }}>
              <div style={{
                display: "flex", alignItems: "center",
                border: "2px solid rgba(45,90,39,0.20)", borderRadius: "var(--radius-full)",
                background: "white", overflow: "hidden",
              }}>
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  style={{
                    width: "44px", height: "44px", border: "none", background: "none",
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    color: "var(--color-green-dark)", transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-green-pale)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                >
                  <MinusIcon />
                </button>
                <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "16px", minWidth: "40px", textAlign: "center", color: "var(--color-text-primary)" }}>
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  aria-label="Increase quantity"
                  style={{
                    width: "44px", height: "44px", border: "none", background: "none",
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    color: "var(--color-green-dark)", transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-green-pale)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                >
                  <PlusIcon />
                </button>
              </div>

              {/* Wishlist */}
              <button
                onClick={() => setWishlisted((w) => !w)}
                aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                style={{
                  width: "46px", height: "46px", borderRadius: "50%",
                  border: `2px solid ${wishlisted ? "#e53935" : "rgba(45,90,39,0.20)"}`,
                  background: wishlisted ? "#fff5f5" : "white",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s ease",
                  color: wishlisted ? "#e53935" : "var(--color-text-secondary)",
                }}
              >
                <HeartIcon filled={wishlisted} />
              </button>
            </div>

            {/* Care quick-chips */}
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px",
              background: "white", borderRadius: "var(--radius-md)",
              boxShadow: "var(--shadow-card)", padding: "16px", marginBottom: "20px",
            }}>
              {p.care.map((c) => (
                <div key={c.label} style={{ textAlign: "center" }}>
                  <div style={{
                    width: "44px", height: "44px", borderRadius: "50%",
                    background: "var(--color-green-pale)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 6px", fontSize: "20px",
                  }}>
                    {c.icon}
                  </div>
                  <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "10px", textTransform: "uppercase", color: "var(--color-text-secondary)", marginBottom: "2px" }}>{c.label}</div>
                  <div style={{ fontFamily: "DM Sans, sans-serif", fontWeight: 500, fontSize: "13px", color: "var(--color-text-primary)" }}>{c.value}</div>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
              <button
                id="add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={isAddingItem}
                aria-busy={isAddingItem}
                className="btn-primary"
                style={{ width: "100%", justifyContent: "center", fontSize: "16px", padding: "16px 32px", opacity: isAddingItem ? 0.7 : 1 }}
              >
                <CartIcon /> {isAddingItem ? "Adding to Cart..." : "Add to Cart"}
              </button>
              <Link
                href="/checkout"
                id="buy-now-btn"
                style={{
                  width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "16px",
                  padding: "14px 32px", borderRadius: "var(--radius-xl)",
                  border: "2px solid var(--color-green-dark)", color: "var(--color-green-dark)",
                  background: "transparent", textDecoration: "none",
                  transition: "all 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--color-green-pale)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                Buy Now
              </Link>
            </div>

            {/* Delivery info */}
            <div style={{
              background: "#f0f9f0", border: "1.5px solid var(--color-green-pale)",
              borderRadius: "var(--radius-md)", padding: "16px 20px", marginBottom: "16px",
              display: "flex", flexDirection: "column", gap: "10px",
            }}>
              {[
                { icon: <TruckIcon />, label: "Free Delivery", desc: "Estimated in 3–5 business days" },
                { icon: <RefreshIcon />, label: "7-Day Health Guarantee", desc: "Unhappy? Return within 7 days, no questions" },
                { icon: <PackageIcon />, label: "Eco Packaging", desc: "100% sustainable, plant-safe materials" },
              ].map((row) => (
                <div key={row.label} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                  <span style={{ color: "var(--color-green-mid)", flexShrink: 0, marginTop: "1px" }}>{row.icon}</span>
                  <div>
                    <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "13px", color: "var(--color-green-dark)" }}>{row.label}</span>
                    <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "13px", color: "var(--color-text-secondary)" }}> — {row.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Care strip */}
            <div
              ref={aiRef}
              style={{
                background: "linear-gradient(135deg, var(--color-green-dark), var(--color-green-mid))",
                borderRadius: "var(--radius-lg)", padding: "18px 20px",
                display: "flex", alignItems: "center", gap: "14px", cursor: "pointer",
                opacity: aiVisible ? 1 : 0,
                transform: aiVisible ? "translateY(0)" : "translateY(16px)",
                transition: "opacity 0.5s ease, transform 0.5s ease",
              }}
              onClick={() => window.location.href = "/ai-care"}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.01)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              role="button"
              tabIndex={0}
            >
              <div style={{
                width: "48px", height: "48px", borderRadius: "50%",
                background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <RobotIcon size={28} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "14px", color: "white" }}>
                  Get personalised care for this plant
                </div>
                <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.82)", marginTop: "2px" }}>
                  Our AI companion will remind, monitor, and guide you
                </div>
              </div>
              <span style={{ color: "rgba(255,255,255,0.7)" }}><ChevRight /></span>
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="pdp-tabs-wrap">
          <div className="pdp-tab-bar" role="tablist">
            {(["about", "care", "reviews"] as const).map((tab) => (
              <button
                key={tab}
                role="tab"
                aria-selected={activeTab === tab}
                id={`tab-${tab}`}
                className={`pdp-tab-btn${activeTab === tab ? " active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "about" ? "About This Plant" : tab === "care" ? "Care Guide" : `Reviews (${p.reviewCount})`}
              </button>
            ))}
          </div>

          {/* About tab */}
          {activeTab === "about" && (
            <div className="pdp-about-grid">
              <div>
                <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "22px", color: "var(--color-green-dark)", marginBottom: "14px" }}>
                  About {p.name}
                </h2>
                <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "15px", color: "var(--color-text-secondary)", lineHeight: 1.75, marginBottom: "24px" }}>
                  {p.description}
                </p>
                <h3 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "16px", color: "var(--color-green-dark)", marginBottom: "12px" }}>
                  Key Features
                </h3>
                <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                  {p.features.map((feat) => (
                    <li key={feat} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontFamily: "DM Sans, sans-serif", fontSize: "15px", color: "var(--color-text-primary)" }}>
                      <span style={{ color: "var(--color-accent-yellow)", fontSize: "16px", flexShrink: 0, marginTop: "1px" }}>✦</span>
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Spec card */}
              <div style={{ borderRadius: "var(--radius-md)", overflow: "hidden", boxShadow: "var(--shadow-card)" }}>
                <div style={{ background: "var(--color-green-dark)", padding: "16px 20px" }}>
                  <h3 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "16px", color: "white", margin: 0 }}>
                    Plant Specifications
                  </h3>
                </div>
                <div style={{ background: "white" }}>
                  {p.specs.map((spec, i) => (
                    <div key={spec.label} style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "12px 20px",
                      borderBottom: i < p.specs.length - 1 ? "1px solid rgba(45,90,39,0.08)" : "none",
                      background: i % 2 === 0 ? "white" : "rgba(212,232,206,0.2)",
                    }}>
                      <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500, fontSize: "13px", color: "var(--color-text-secondary)" }}>{spec.label}</span>
                      <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "13px", color: "var(--color-text-primary)" }}>{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Care Guide tab */}
          {activeTab === "care" && (
            <div className="pdp-care-grid">
              {p.careGuide.map((card) => (
                <div key={card.title} style={{
                  background: "white", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-card)",
                  padding: "24px", transition: "transform 0.2s, box-shadow 0.2s",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "var(--shadow-float)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "var(--shadow-card)"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                    <span style={{ fontSize: "28px" }}>{card.icon}</span>
                    <h4 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "16px", color: "var(--color-green-dark)" }}>{card.title}</h4>
                  </div>
                  {/* Care level dots */}
                  <div style={{ display: "flex", gap: "5px", marginBottom: "12px" }}>
                    {[1,2,3,4,5].map((d) => (
                      <div key={d} style={{
                        width: "8px", height: "8px", borderRadius: "50%",
                        background: d <= card.level ? "var(--color-green-dark)" : "var(--color-green-light)",
                      }} />
                    ))}
                    <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "11px", color: "var(--color-text-secondary)", marginLeft: "6px" }}>
                      {card.level <= 2 ? "Low" : card.level <= 3 ? "Medium" : "High"}
                    </span>
                  </div>
                  <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "13px", color: "var(--color-text-secondary)", lineHeight: 1.65 }}>
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Reviews tab */}
          {activeTab === "reviews" && (
            <div>
              {/* Header */}
              <div style={{ display: "flex", gap: "48px", flexWrap: "wrap", marginBottom: "36px" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: "64px", color: "var(--color-green-dark)", lineHeight: 1 }}>
                    {p.rating}
                  </div>
                  <div style={{ display: "flex", justifyContent: "center", gap: "2px", margin: "8px 0 4px" }}>
                    {[1,2,3,4,5].map((s) => <StarIcon key={s} filled={s <= Math.round(p.rating)} />)}
                  </div>
                  <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: "13px", color: "var(--color-text-secondary)" }}>
                    {p.reviewCount} reviews
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: "200px" }}>
                  <StarBar count={5} total={280} pct={82} />
                  <StarBar count={4} total={45} pct={13} />
                  <StarBar count={3} total={12} pct={4} />
                  <StarBar count={2} total={3} pct={1} />
                  <StarBar count={1} total={2} pct={0.5} />
                </div>
              </div>

              {/* Review cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {p.reviews.map((rev) => (
                  <div key={rev.name} style={{
                    background: "white", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-card)",
                    padding: "24px",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px", marginBottom: "12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{
                          width: "44px", height: "44px", borderRadius: "50%",
                          background: "var(--color-green-pale)", color: "var(--color-green-dark)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "16px",
                        }}>
                          {rev.initials}
                        </div>
                        <div>
                          <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "14px", color: "var(--color-text-primary)" }}>{rev.name}</div>
                          <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: "12px", color: "var(--color-text-secondary)" }}>{rev.location} · {rev.date}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ display: "flex", gap: "2px" }}>
                          {[1,2,3,4,5].map((s) => <StarIcon key={s} filled={s <= rev.rating} />)}
                        </div>
                        {rev.verified && (
                          <span style={{
                            background: "var(--color-green-pale)", color: "var(--color-green-dark)",
                            fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "10px",
                            padding: "2px 8px", borderRadius: "var(--radius-full)",
                          }}>✓ Verified</span>
                        )}
                      </div>
                    </div>
                    <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "14px", color: "var(--color-text-primary)", lineHeight: 1.7 }}>
                      {rev.text}
                    </p>
                    <button style={{
                      background: "none", border: "none", cursor: "pointer",
                      fontFamily: "Poppins, sans-serif", fontWeight: 500, fontSize: "12px",
                      color: "var(--color-text-secondary)", marginTop: "12px", padding: 0,
                      display: "flex", alignItems: "center", gap: "4px",
                      transition: "color 0.2s",
                    }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-green-dark)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-secondary)")}
                    >
                      👍 Helpful
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Related Products ── */}
        <div className="pdp-related-grid">
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "0" }}>
            <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "28px", color: "var(--color-green-dark)" }}>
              You Might Also Love
            </h2>
            <span style={{ color: "var(--color-accent-yellow)", fontSize: "22px", animation: "pulse-star 2s ease-in-out infinite" }}>✦</span>
          </div>
          <div className="pdp-products-grid">
            {p.relatedProducts.map((prod) => (
              <Link
                key={prod.name}
                href={`/products/${prod.slug}`}
                style={{ textDecoration: "none" }}
              >
                <div style={{
                  background: "white", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-card)",
                  overflow: "hidden", cursor: "pointer",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "var(--shadow-float)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "var(--shadow-card)"; }}
                >
                  <div style={{
                    aspectRatio: "1/1", background: prod.color,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "72px", position: "relative",
                  }}>
                    {prod.emoji}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        if (!prod.firstVariantId) {
                          showToast("Product is currently unavailable.");
                          return;
                        }
                        addItem(
                          { variantId: prod.firstVariantId, quantity: 1 },
                          {
                            onSuccess: () => {
                              showToast(`${prod.name} added to cart!`);
                            },
                            onError: (err: any) => {
                              const detail = err?.response?.data?.detail || "Could not add item to cart. Please log in first.";
                              showToast(detail);
                            }
                          }
                        );
                      }}
                      style={{
                        position: "absolute", bottom: "12px", right: "12px",
                        width: "32px", height: "32px", borderRadius: "50%",
                        background: "var(--color-green-dark)", border: "none",
                        color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: "0 2px 8px rgba(45,90,39,0.3)", fontSize: "18px",
                        transition: "transform 0.15s",
                      }}
                      aria-label={`Quick add ${prod.name} to cart`}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    >+</button>
                  </div>
                  <div style={{ padding: "14px 16px" }}>
                    <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "14px", color: "var(--color-text-primary)", marginBottom: "2px" }}>{prod.name}</p>
                    <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "12px", color: "var(--color-text-secondary)", fontStyle: "italic", marginBottom: "8px" }}>{prod.type}</p>
                    <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "15px", color: "var(--color-green-dark)" }}>₹{prod.price.toLocaleString("en-IN")}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Community Banner ── */}
        <div className="pdp-community">
          {/* Decorative leaves */}
          <div style={{ position: "absolute", left: "40px", top: "50%", transform: "translateY(-50%)", opacity: 0.25, fontSize: "80px" }}>🌿</div>
          <div style={{ position: "absolute", right: "60px", top: "50%", transform: "translateY(-50%)", opacity: 0.2, fontSize: "120px" }}>🌿</div>

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
              <span style={{
                background: "rgba(255,255,255,0.12)", color: "white",
                fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "12px",
                padding: "5px 16px", borderRadius: "var(--radius-full)", letterSpacing: "0.08em",
              }}>🤖 AI-Powered Community</span>
            </div>
            <h2 style={{
              fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "clamp(24px, 4vw, 40px)",
              color: "white", marginBottom: "12px",
            }}>
              Join Our Green Community
            </h2>
            <p style={{
              fontFamily: "DM Sans, sans-serif", fontSize: "16px", color: "rgba(255,255,255,0.75)",
              maxWidth: "480px", margin: "0 auto 28px", lineHeight: 1.65,
            }}>
              Connect with 50,000+ plant lovers. Get care reminders, expert advice, and exclusive deals straight to your inbox.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/ai-care" style={{
                background: "white", color: "var(--color-green-dark)",
                fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "15px",
                padding: "14px 32px", borderRadius: "var(--radius-xl)", textDecoration: "none",
                transition: "transform 0.2s, box-shadow 0.2s",
                display: "inline-block",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.03)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.2)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                Try AI Care 🤖
              </Link>
              <Link href="/" style={{
                background: "transparent", color: "white",
                fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "15px",
                padding: "12px 28px", borderRadius: "var(--radius-xl)", textDecoration: "none",
                border: "2px solid rgba(255,255,255,0.4)",
                transition: "border-color 0.2s, background 0.2s",
                display: "inline-block",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "white"; e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)"; e.currentTarget.style.background = "transparent"; }}
              >
                Back to Home 🌿
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      <Toast message={toastMsg} visible={toastVisible} />
    </>
  );
}
