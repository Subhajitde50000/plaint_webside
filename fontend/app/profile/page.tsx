"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import SharedNavbar from "@/components/Navbar";

/* ══════════════════════════════════════════════════════════
   MOCK DATA (Fallback Initial States)
   ══════════════════════════════════════════════════════════ */
const INITIAL_PLANTS = [
  { id: 1, name: "Monstera Deliciosa", pot: "White Ceramic", health: 92, water: "Tomorrow", light: "Bright indirect", img: "/monstera.png", badge: "Thriving" },
  { id: 2, name: 'Fern "Green Lady"', pot: "Terracotta", health: 78, water: "Today", light: "Medium indirect", img: "/fern-small.png", badge: "Needs Water" },
  { id: 3, name: "Peace Lily", pot: "Rattan Basket", health: 88, water: "In 2 days", light: "Low light", img: "/fern-medium.png", badge: "Healthy" },
  { id: 4, name: "Bird of Paradise", pot: "Black Geometric", health: 95, water: "In 3 days", light: "Full sun", img: "/fern-large.png", badge: "Thriving" },
  { id: 5, name: "Succulent Mix", pot: "Terracotta", health: 99, water: "In 7 days", light: "Direct sun", img: "/cat-succulents.png", badge: "Perfect" },
  { id: 6, name: "Balcony Blooms", pot: "White Minimalist", health: 82, water: "In 2 days", light: "Bright indirect", img: "/hero-balcony.png", badge: "Healthy" },
];

const ORDERS = [
  { 
    id: "#PB-2847", 
    date: "Jun 12, 2026", 
    status: "Delivered", 
    items: ['Monstera Deliciosa', "White Ceramic Pot"], 
    total: 68.00, 
    img: "/monstera.png",
    address: "12/A Park Street, Flat 4B, Kolkata, West Bengal 700016",
    paymentMethod: "Visa ending in 4820",
    deliveryDate: "Jun 15, 2026"
  },
  { 
    id: "#PB-2651", 
    date: "May 28, 2026", 
    status: "Delivered", 
    items: ['Fern "Green Lady"', "Terracotta Pot"], 
    total: 34.00, 
    img: "/fern-small.png",
    address: "12/A Park Street, Flat 4B, Kolkata, West Bengal 700016",
    paymentMethod: "MasterCard ending in 9851",
    deliveryDate: "May 31, 2026"
  },
  { 
    id: "#PB-2390", 
    date: "May 3, 2026", 
    status: "Delivered", 
    items: ["Watering Can Pro", "Plant Spray"], 
    total: 29.50, 
    img: "/watering-can.png",
    address: "12/A Park Street, Flat 4B, Kolkata, West Bengal 700016",
    paymentMethod: "Visa ending in 4820",
    deliveryDate: "May 6, 2026"
  },
  { 
    id: "#PB-2104", 
    date: "Apr 10, 2026", 
    status: "Cancelled", 
    items: ["Premium Soil Mix", "Fertilizer Set"], 
    total: 22.00, 
    img: "/product-soil.png",
    address: "12/A Park Street, Flat 4B, Kolkata, West Bengal 700016",
    paymentMethod: "Visa ending in 4820",
    deliveryDate: "N/A (Cancelled)"
  },
];

const WISHLIST = [
  { id: 1, name: "Bird of Paradise", price: 55.00, rating: 4.8, reviews: 142, img: "/cat-balcony.png", size: "Medium", color: "Black" },
  { id: 2, name: "Fiddle Leaf Fig", price: 48.00, rating: 4.6, reviews: 98, img: "/hero-flowers.png", size: "Large", color: "Brown Terracotta" },
  { id: 3, name: "Orchid Collection", price: 42.00, rating: 4.9, reviews: 213, img: "/cat-flowers.png", size: "Small", color: "White Ceramic" },
  { id: 4, name: "Indoor Palm", price: 38.00, rating: 4.7, reviews: 76, img: "/cat-indoor.png", size: "Medium", color: "Grey Minimalist" },
];

const ACHIEVEMENTS = [
  { icon: "🌱", label: "First Plant", desc: "Added your first plant", unlocked: true },
  { icon: "💧", label: "Hydration Hero", desc: "Watered 30 days in a row", unlocked: true },
  { icon: "🌿", label: "Green Thumb", desc: "Own 5+ healthy plants", unlocked: true },
  { icon: "⭐", label: "Top Reviewer", desc: "Left 10 product reviews", unlocked: true },
  { icon: "🏆", label: "Plant Parent", desc: "1 year anniversary", unlocked: false },
  { icon: "🌸", label: "Rare Collector", desc: "Own a rare species", unlocked: false },
];

const ACTIVITY = [
  { icon: "💧", text: "Watered Monstera Deliciosa", time: "2 hours ago", color: "#2563eb" },
  { icon: "📦", text: "Ordered Fern \"Green Lady\" + Terracotta Pot", time: "4 days ago", color: "#00b566" },
  { icon: "⭐", text: "Reviewed Watering Can Pro — 5 stars", time: "1 week ago", color: "#c8a84b" },
  { icon: "❤️", text: "Wishlisted Bird of Paradise", time: "2 weeks ago", color: "#dc2626" },
  { icon: "🌱", text: "Added Peace Lily to your garden", time: "3 weeks ago", color: "#009952" },
  { icon: "🏆", text: "Earned \"Green Thumb\" achievement", time: "1 month ago", color: "#8b5cf6" },
];

/* ══════════════════════════════════════════════════════════
   SVG ICONS
   ══════════════════════════════════════════════════════════ */
const EditIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const CameraIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

const WaterIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#2563eb" stroke="none" aria-hidden="true">
    <path d="M12 2C12 2 5 10 5 15C5 18.87 8.13 22 12 22C15.87 22 19 18.87 19 15C19 10 12 2 12 2Z" />
  </svg>
);

const SunIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#c8a84b" aria-hidden="true">
    <circle cx="12" cy="12" r="5" />
    {[[12,1,12,3],[12,21,12,23],[4.22,4.22,5.64,5.64],[18.36,18.36,19.78,19.78],[1,12,3,12],[21,12,23,12],[4.22,19.78,5.64,18.36],[18.36,5.64,19.78,4.22]].map(([x1,y1,x2,y2],i) => (
      <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#c8a84b" strokeWidth="2.5" strokeLinecap="round" />
    ))}
  </svg>
);

const HeartIcon = ({ filled }: { filled?: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "#dc2626" : "none"} stroke={filled ? "#dc2626" : "currentColor"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const BellIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

/* ══════════════════════════════════════════════════════════
   SUBCOMPONENTS
   ══════════════════════════════════════════════════════════ */
function HealthBar({ value }: { value: number }) {
  const color = value >= 90 ? "var(--color-surface-raised)" : value >= 75 ? "var(--profile-star-fill)" : "var(--profile-danger-text)";
  return (
    <div style={{ background: "rgba(0,0,0,0.08)", borderRadius: 99, height: 6, overflow: "hidden", flex: 1 }} aria-label={`Plant health is ${value}%`}>
      <div style={{ width: `${value}%`, height: "100%", background: color, borderRadius: 99, transition: "width 0.8s ease" }} />
    </div>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", gap: 3 }} aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i <= Math.round(rating) ? "var(--profile-star-fill)" : "rgba(0,0,0,0.12)"} aria-hidden="true">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

const CreditCard = ({ number, name, expiry, type, color, onDelete }: {
  number: string;
  name: string;
  expiry: string;
  type: string;
  color: string;
  onDelete?: () => void;
}) => {
  const renderLogo = () => {
    switch (type) {
      case "visa":
        return <div style={{ color: "white", fontWeight: "800", fontSize: 18, fontStyle: "italic", fontFamily: "sans-serif" }}>VISA</div>;
      case "mastercard":
        return (
          <div style={{ display: "flex" }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#EB001B", marginRight: -7, opacity: 0.95 }} />
            <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#F79E1B", opacity: 0.9 }} />
          </div>
        );
      case "amex":
        return <div style={{ background: "#016FD0", color: "white", fontWeight: "bold", fontSize: 10, padding: "3px 5px", borderRadius: 3 }}>AMEX</div>;
      default:
        return <div style={{ color: "white", fontWeight: "800", fontSize: 18, fontStyle: "italic", fontFamily: "sans-serif" }}>VISA</div>;
    }
  };

  return (
    <div style={{
      width: "100%",
      maxWidth: 340,
      height: 190,
      borderRadius: "var(--radius-lg)",
      background: color,
      padding: 20,
      color: "white",
      position: "relative",
      boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      overflow: "hidden",
      border: "1px solid rgba(255,255,255,0.12)"
    }}>
      <div style={{
        position: "absolute",
        top: "-25%",
        right: "-10%",
        width: 140,
        height: 140,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
        pointerEvents: "none"
      }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* SIM Chip */}
        <div style={{ width: 34, height: 25, borderRadius: 4, background: "linear-gradient(135deg, #f3d078 0%, #dca842 100%)", boxShadow: "inset 0 1px 1px rgba(255,255,255,0.3)" }} />
        {renderLogo()}
      </div>

      <div style={{ fontSize: 17, letterSpacing: "2px", fontFamily: "monospace", fontWeight: "bold", margin: "14px 0" }}>
        {number || "•••• •••• •••• ••••"}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div style={{ minWidth: 0, flex: 1, marginRight: 10 }}>
          <p style={{ fontSize: 7, textTransform: "uppercase", letterSpacing: "1px", opacity: 0.65, marginBottom: 2 }}>Card Holder</p>
          <p style={{ fontSize: 11, fontWeight: "600", textTransform: "uppercase", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {name || "Your Name"}
          </p>
        </div>
        
        <div style={{ flexShrink: 0, textAlign: "right", marginRight: onDelete ? 10 : 0 }}>
          <p style={{ fontSize: 7, textTransform: "uppercase", letterSpacing: "1px", opacity: 0.65, marginBottom: 2 }}>Expires</p>
          <p style={{ fontSize: 11, fontWeight: "600", fontFamily: "monospace" }}>
            {expiry || "MM/YY"}
          </p>
        </div>

        {onDelete && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            aria-label="Delete saved card"
            className="delete-card-btn"
            style={{
              background: "rgba(255,255,255,0.18)",
              border: "none",
              borderRadius: "50%",
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "background var(--motion-duration-instant), transform 0.1s",
              color: "white",
              flexShrink: 0
            }}
          >
            <TrashIcon />
          </button>
        )}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ══════════════════════════════════════════════════════════ */
export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"garden"|"orders"|"wishlist"|"billing"|"settings"|string>("garden");
  const [editMode, setEditMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  // Profile fields states (synced to localStorage)
  const [userName, setUserName] = useState("Subhajit Ghosh");
  const [userBio, setUserBio] = useState("Plant parent of 6 🌿 | Nature lover | Always learning to grow");
  const [userLocation, setUserLocation] = useState("Kolkata, India");
  const [notifPref, setNotifPref] = useState({ water: true, orders: true, promo: false, tips: true });

  // Lists states
  const [myPlants, setMyPlants] = useState<typeof INITIAL_PLANTS>([]);
  const [savedCards, setSavedCards] = useState<any[]>([]);
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [cartCount, setCartCount] = useState(0);

  // New Card form validation states
  const [formNumber, setFormNumber] = useState("");
  const [formName, setFormName] = useState("");
  const [formExpiry, setFormExpiry] = useState("");
  const [formCvv, setFormCvv] = useState("");
  const [cardErrors, setCardErrors] = useState<Record<string, string>>({});
  const [cardTouched, setCardTouched] = useState<Record<string, boolean>>({});

  // Account Settings validation states
  const [settingsName, setSettingsName] = useState("");
  const [settingsEmail, setSettingsEmail] = useState("subhajit@email.com");
  const [settingsPhone, setSettingsPhone] = useState("+91 98765 43210");
  const [settingsLocation, setSettingsLocation] = useState("");
  const [settingsErrors, setSettingsErrors] = useState<Record<string, string>>({});
  const [settingsTouched, setSettingsTouched] = useState<Record<string, boolean>>({});

  // Password validation states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [passwordTouched, setPasswordTouched] = useState<Record<string, boolean>>({});

  // Modal control states
  const [plantModalOpen, setPlantModalOpen] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [dangerModalOpen, setDangerModalOpen] = useState(false);
  const [dangerType, setDangerType] = useState<"export" | "delete">("export");

  // New Plant form states
  const [newPlantName, setNewPlantName] = useState("");
  const [newPlantPot, setNewPlantPot] = useState("Terracotta");
  const [newPlantLight, setNewPlantLight] = useState("Bright indirect");
  const [newPlantWater, setNewPlantWater] = useState("Today");
  const [newPlantHealth, setNewPlantHealth] = useState(90);
  const [plantFormErrors, setPlantFormErrors] = useState<Record<string, string>>({});
  const [plantTouched, setPlantTouched] = useState<Record<string, boolean>>({});

  // Toast messages queue state
  const [toasts, setToasts] = useState<Array<{ id: number; text: string; type: "success" | "error" | "info" }>>([]);

  // Refs for tablist accessibility
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const modalRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  // Add toast helper
  const addToast = useCallback((text: string, type: "success" | "error" | "info" = "success") => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  // Load from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("profile_name") || "Subhajit Ghosh";
      const storedBio = localStorage.getItem("profile_bio") || "Plant parent of 6 🌿 | Nature lover | Always learning to grow";
      const storedLoc = localStorage.getItem("profile_location") || "Kolkata, India";
      const storedNotifs = localStorage.getItem("profile_notifications");
      const storedPlants = localStorage.getItem("profile_plants");
      const storedCards = localStorage.getItem("profile_cards");
      const storedWishlist = localStorage.getItem("profile_wishlist");
      const storedCart = localStorage.getItem("profile_cart_count");

      setUserName(storedName);
      setSettingsName(storedName);
      setUserBio(storedBio);
      setUserLocation(storedLoc);
      setSettingsLocation(storedLoc);

      if (storedNotifs) setNotifPref(JSON.parse(storedNotifs));
      
      if (storedPlants) {
        setMyPlants(JSON.parse(storedPlants));
      } else {
        setMyPlants(INITIAL_PLANTS);
        localStorage.setItem("profile_plants", JSON.stringify(INITIAL_PLANTS));
      }

      if (storedCards) {
        setSavedCards(JSON.parse(storedCards));
      } else {
        const initialCards = [
          { id: 1, number: "4532 7812 9012 4820", name: "Subhajit Ghosh", expiry: "12/29", type: "visa", color: "linear-gradient(135deg, #0b3f2c 0%, #009952 100%)" },
          { id: 2, number: "5412 8890 2314 9851", name: "Subhajit Ghosh", expiry: "06/28", type: "mastercard", color: "linear-gradient(135deg, #1e3a8a 0%, #6d28d9 100%)" },
        ];
        setSavedCards(initialCards);
        localStorage.setItem("profile_cards", JSON.stringify(initialCards));
      }

      if (storedWishlist) {
        setWishlistItems(JSON.parse(storedWishlist));
      } else {
        const initialWishlist = WISHLIST.map(w => ({ ...w, saved: true }));
        setWishlistItems(initialWishlist);
        localStorage.setItem("profile_wishlist", JSON.stringify(initialWishlist));
      }

      if (storedCart) {
        setCartCount(parseInt(storedCart, 10));
      }

      // Simulate network request with skeleton reveal
      setTimeout(() => {
        setLoading(false);
        setMounted(true);
      }, 1000);
    }
  }, []);

  // Sync state helpers
  const saveProfileField = (name: string, bio: string, loc: string) => {
    setUserName(name);
    setUserBio(bio);
    setUserLocation(loc);
    localStorage.setItem("profile_name", name);
    localStorage.setItem("profile_bio", bio);
    localStorage.setItem("profile_location", loc);
  };

  const toggleNotifPref = (key: keyof typeof notifPref) => {
    const updated = { ...notifPref, [key]: !notifPref[key] };
    setNotifPref(updated);
    localStorage.setItem("profile_notifications", JSON.stringify(updated));
    addToast(`Updated settings: ${key === "water" ? "Watering reminders" : key === "orders" ? "Order updates" : key === "promo" ? "Promotions" : "Plant care tips"} toggled.`);
  };

  // Keyboard navigation for W3C ARIA tablist
  const handleTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number, tabKey: string) => {
    const tabKeys = ["garden", "orders", "wishlist", "billing", "settings"];
    let nextIndex = index;

    if (e.key === "ArrowRight") {
      nextIndex = (index + 1) % tabKeys.length;
    } else if (e.key === "ArrowLeft") {
      nextIndex = (index - 1 + tabKeys.length) % tabKeys.length;
    } else if (e.key === "Home") {
      nextIndex = 0;
    } else if (e.key === "End") {
      nextIndex = tabKeys.length - 1;
    } else {
      return;
    }

    e.preventDefault();
    const nextTabKey = tabKeys[nextIndex];
    setActiveTab(nextTabKey);
    setTimeout(() => {
      tabRefs.current[nextTabKey]?.focus();
    }, 5);
  };

  /* ══════════════════════════════════════════════════════════
     FORM VALIDATION RULES
     ══════════════════════════════════════════════════════════ */
  // New Card Validation
  const validateCardField = (name: string, val: string) => {
    let error = "";
    if (name === "number") {
      const clean = val.replace(/\D/g, "");
      if (!val) error = "Card Number is required.";
      else if (clean.length !== 16) error = "Enter a valid credit card (must be 16 digits).";
    } else if (name === "name") {
      if (!val.trim()) error = "Cardholder Name is required.";
      else if (/[^a-zA-Z\s]/.test(val)) error = "Name must only contain letters.";
    } else if (name === "expiry") {
      if (!val) error = "Expiry Date is required.";
      else if (!/^\d{2}\/\d{2}$/.test(val)) error = "Enter a valid format (MM/YY).";
      else {
        const [m, y] = val.split("/").map(Number);
        if (m < 1 || m > 12) error = "Enter a valid month (01-12).";
        else {
          const now = new Date();
          const currentYear = now.getFullYear() % 100;
          const currentMonth = now.getMonth() + 1;
          if (y < currentYear || (y === currentYear && m < currentMonth)) {
            error = "This card has expired.";
          }
        }
      }
    } else if (name === "cvv") {
      if (!val) error = "CVV is required.";
      else if (val.length < 3) error = "CVV must be 3 characters.";
    }
    setCardErrors(prev => ({ ...prev, [name]: error }));
    return !error;
  };

  // Card Inputs Formatting
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 16) val = val.substring(0, 16);
    let formatted = "";
    for (let i = 0; i < val.length; i++) {
      if (i > 0 && i % 4 === 0) formatted += " ";
      formatted += val[i];
    }
    setFormNumber(formatted);
    if (cardTouched.number) validateCardField("number", formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 4) val = val.substring(0, 4);
    let formatted = "";
    if (val.length > 2) {
      formatted = val.substring(0, 2) + "/" + val.substring(2);
    } else {
      formatted = val;
    }
    setFormExpiry(formatted);
    if (cardTouched.expiry) validateCardField("expiry", formatted);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 3) val = val.substring(0, 3);
    setFormCvv(val);
    if (cardTouched.cvv) validateCardField("cvv", val);
  };

  // Settings Information Validation
  const validateSettingsField = (name: string, val: string) => {
    let error = "";
    if (name === "name") {
      if (!val.trim()) error = "Full Name is required.";
    } else if (name === "email") {
      if (!val) error = "Email is required.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) error = "Enter a valid email address.";
    } else if (name === "phone") {
      if (!val) error = "Phone is required.";
      else if (val.replace(/\D/g, "").length < 10) error = "Enter a valid phone number.";
    } else if (name === "location") {
      if (!val.trim()) error = "Location is required.";
    }
    setSettingsErrors(prev => ({ ...prev, [name]: error }));
    return !error;
  };

  // Password fields Validation
  const validatePasswordField = (name: string, val: string) => {
    let error = "";
    if (name === "currentPassword") {
      if (!val) error = "Current Password is required.";
    } else if (name === "newPassword") {
      if (!val) error = "New Password is required.";
      else if (val.length < 8) error = "Password must be at least 8 characters.";
    } else if (name === "confirmPassword") {
      if (!val) error = "Confirm Password is required.";
      else if (val !== newPassword) error = "Passwords do not match.";
    }
    setPasswordErrors(prev => ({ ...prev, [name]: error }));
    return !error;
  };

  // Plant Addition Validation
  const validatePlantField = (name: string, val: any) => {
    let error = "";
    if (name === "name") {
      if (!val.trim()) error = "Plant name is required.";
    } else if (name === "health") {
      const h = Number(val);
      if (isNaN(h) || h < 0 || h > 100) error = "Health must be a percentage between 0 and 100.";
    }
    setPlantFormErrors(prev => ({ ...prev, [name]: error }));
    return !error;
  };

  // Card detection
  const getCardType = (num: string) => {
    const clean = num.replace(/\D/g, "");
    if (clean.startsWith("4")) return "visa";
    if (clean.startsWith("5")) return "mastercard";
    if (clean.startsWith("37") || clean.startsWith("34")) return "amex";
    return "visa";
  };

  /* ══════════════════════════════════════════════════════════
     FORM SUBMITS handlers
     ══════════════════════════════════════════════════════════ */
  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();

    const tNumber = validateCardField("number", formNumber);
    const tName = validateCardField("name", formName);
    const tExpiry = validateCardField("expiry", formExpiry);
    const tCvv = validateCardField("cvv", formCvv);

    setCardTouched({ number: true, name: true, expiry: true, cvv: true });

    if (tNumber && tName && tExpiry && tCvv) {
      const newCard = {
        id: Date.now(),
        number: formNumber,
        name: formName,
        expiry: formExpiry,
        type: getCardType(formNumber),
        color: savedCards.length % 2 === 0 
          ? "linear-gradient(135deg, #0b3f2c 0%, #009952 100%)" 
          : "linear-gradient(135deg, #1e3a8a 0%, #6d28d9 100%)"
      };
      const updated = [...savedCards, newCard];
      setSavedCards(updated);
      localStorage.setItem("profile_cards", JSON.stringify(updated));
      
      // Reset card state
      setFormNumber("");
      setFormName("");
      setFormExpiry("");
      setFormCvv("");
      setCardTouched({});
      setCardErrors({});
      addToast("New payment card successfully saved!");
    } else {
      addToast("Please correct the form errors before saving.", "error");
      // Focus first error field
      const errKeys = ["number", "name", "expiry", "cvv"];
      for (const k of errKeys) {
        if (cardErrors[k] || !cardTouched[k]) {
          const el = document.getElementById(`card-${k}`);
          el?.focus();
          break;
        }
      }
    }
  };

  const handleUpdateInfo = (e: React.FormEvent) => {
    e.preventDefault();
    const tName = validateSettingsField("name", settingsName);
    const tEmail = validateSettingsField("email", settingsEmail);
    const tPhone = validateSettingsField("phone", settingsPhone);
    const tLoc = validateSettingsField("location", settingsLocation);

    setSettingsTouched({ name: true, email: true, phone: true, location: true });

    if (tName && tEmail && tPhone && tLoc) {
      saveProfileField(settingsName, userBio, settingsLocation);
      addToast("Account details updated successfully.");
    } else {
      addToast("Failed to save changes. Verify fields.", "error");
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    const tCurr = validatePasswordField("currentPassword", currentPassword);
    const tNew = validatePasswordField("newPassword", newPassword);
    const tConf = validatePasswordField("confirmPassword", confirmPassword);

    setPasswordTouched({ currentPassword: true, newPassword: true, confirmPassword: true });

    if (tCurr && tNew && tConf) {
      addToast("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordTouched({});
      setPasswordErrors({});
    } else {
      addToast("Please satisfy password strength criteria.", "error");
    }
  };

  const handleAddPlant = (e: React.FormEvent) => {
    e.preventDefault();
    const tName = validatePlantField("name", newPlantName);
    const tHealth = validatePlantField("health", newPlantHealth);

    setPlantTouched({ name: true, health: true });

    if (tName && tHealth) {
      const badges = ["Thriving", "Healthy", "Perfect", "Needs Water"];
      let selectedBadge = "Healthy";
      if (newPlantHealth >= 95) selectedBadge = "Perfect";
      else if (newPlantHealth >= 85) selectedBadge = "Thriving";
      else if (newPlantHealth < 75) selectedBadge = "Needs Water";

      const imgs = ["/monstera.png", "/fern-small.png", "/fern-medium.png", "/fern-large.png", "/cat-succulents.png", "/hero-balcony.png"];
      const randomImg = imgs[Math.floor(Math.random() * imgs.length)];

      const newPlant = {
        id: Date.now(),
        name: newPlantName,
        pot: newPlantPot,
        health: Number(newPlantHealth),
        water: newPlantWater,
        light: newPlantLight,
        img: randomImg,
        badge: selectedBadge
      };

      const updated = [newPlant, ...myPlants];
      setMyPlants(updated);
      localStorage.setItem("profile_plants", JSON.stringify(updated));

      // Reset
      setNewPlantName("");
      setNewPlantPot("Terracotta");
      setNewPlantLight("Bright indirect");
      setNewPlantWater("Today");
      setNewPlantHealth(90);
      setPlantTouched({});
      setPlantFormErrors({});
      setPlantModalOpen(false);

      addToast(`${newPlantName} has been added to your garden!`);
      // Return focus to trigger
      triggerRef.current?.focus();
    } else {
      addToast("Please fill in the plant name.", "error");
    }
  };

  const handleDeleteCard = (id: number) => {
    const updated = savedCards.filter(c => c.id !== id);
    setSavedCards(updated);
    localStorage.setItem("profile_cards", JSON.stringify(updated));
    addToast("Saved payment method removed.", "info");
  };

  const handleHeartToggle = (id: number, name: string) => {
    let wasSaved = false;
    const updated = wishlistItems.map(item => {
      if (item.id === id) {
        wasSaved = item.saved;
        return { ...item, saved: !item.saved };
      }
      return item;
    });
    setWishlistItems(updated);
    localStorage.setItem("profile_wishlist", JSON.stringify(updated));
    if (wasSaved) {
      addToast(`Removed ${name} from your wishlist.`, "info");
    } else {
      addToast(`Added ${name} back to your wishlist!`, "success");
    }
  };

  const handleAddToCart = (name: string) => {
    const newCount = cartCount + 1;
    setCartCount(newCount);
    localStorage.setItem("profile_cart_count", String(newCount));
    addToast(`Added ${name} to your Cart!`, "success");
  };

  // Danger actions execution
  const executeDangerAction = () => {
    if (dangerType === "export") {
      addToast("Initiating data export. Check your email shortly.");
    } else {
      // Clear localStorage
      localStorage.clear();
      addToast("Account successfully reset.", "info");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
    setDangerModalOpen(false);
    triggerRef.current?.focus();
  };

  // Keyboard navigation & Trap focus for open modals
  useEffect(() => {
    if (plantModalOpen || orderModalOpen || dangerModalOpen) {
      const focusableElements = modalRef.current?.querySelectorAll(
        'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]'
      );
      if (focusableElements && focusableElements.length > 0) {
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
        
        // Focus first element on open
        firstElement.focus();

        const handleKeyDown = (e: KeyboardEvent) => {
          if (e.key === "Tab") {
            if (e.shiftKey) {
              if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
              }
            } else {
              if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
              }
            }
          } else if (e.key === "Escape") {
            setPlantModalOpen(false);
            setOrderModalOpen(false);
            setDangerModalOpen(false);
            triggerRef.current?.focus();
          }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
      }
    }
  }, [plantModalOpen, orderModalOpen, dangerModalOpen]);

  return (
    <div style={{ background: "var(--color-surface-strong)", minHeight: "100vh", fontFamily: "var(--font-family-primary)", paddingTop: "64px" }}>
      
      {/* ────────────────────────────────────────────────────────
         STYLING & CSS RULES (Variables, Grid, Theme, Animations)
         ──────────────────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,700;1,700&display=swap');
        
        :root {
          --color-surface-base: #000000;
          --color-text-secondary: #1c1c1c;
          --color-text-tertiary: #ffffff;
          --color-text-inverse: #212326;
          --color-surface-raised: #00b566;
          --color-surface-strong: #fefcf9;

          --font-family-primary: 'Outfit', sans-serif;
          --font-size-xs: 11px;
          --font-size-sm: 12px;
          --font-size-md: 13px;
          --font-size-lg: 13.33px;
          --font-size-xl: 14px;
          --font-size-2xl: 15px;
          --font-size-3xl: 16px;
          --font-size-4xl: 18px;

          --space-1: 1px;
          --space-2: 2px;
          --space-3: 3px;
          --space-4: 5px;
          --space-5: 6px;
          --space-6: 8px;
          --space-7: 10px;
          --space-8: 12px;

          --radius-xs: 4px;
          --radius-sm: 8px;
          --radius-md: 12px;
          --radius-lg: 16px;
          --radius-xl: 20px;
          --radius-2xl: 24px;
          --radius-step7: 50px;
          --radius-step8: 9999px;

          --motion-duration-instant: 200ms;
          --motion-duration-fast: 250ms;
          --motion-duration-normal: 300ms;
          --motion-duration-slow: 500ms;

          --shadow-1: none;
          --shadow-2: 0 0 0 1px inset rgb(202, 223, 212);
          --shadow-3: 0 0 0 1px inset rgb(212, 212, 212);
          --shadow-4: 0 0 0 1px inset var(--color-surface-raised);

          --card-hover: 0 8px 28px rgba(0, 181, 102, 0.14);
          --modal-shadow: 0 20px 60px rgba(0, 0, 0, 0.18);
          --nav-scroll: 0 2px 8px rgba(0, 0, 0, 0.06);
          --fab-shadow: 0 6px 20px rgba(0, 181, 102, 0.30);
          
          --profile-star-fill: #c8a84b;
          --profile-danger-text: #dc2626;
        }

        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        /* Skip link style */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
        .sr-only-focusable:active, .sr-only-focusable:focus,
        .focus\\:not-sr-only:focus {
          position: fixed;
          top: 10px;
          left: 10px;
          width: auto;
          height: auto;
          padding: 12px 24px;
          background: var(--color-surface-raised);
          color: white;
          font-weight: 700;
          border-radius: var(--radius-sm);
          z-index: 9999;
          outline: 2px solid white;
          outline-offset: 2px;
          clip: auto;
          white-space: normal;
        }

        /* Keyboard Focus Indicator matching §5.1 */
        button:focus-visible,
        a:focus-visible,
        input:focus-visible,
        select:focus-visible,
        textarea:focus-visible,
        .toggle-track:focus-visible {
          outline: 2px solid var(--color-surface-raised) !important;
          outline-offset: 2px !important;
        }

        @keyframes fadeUp   { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
        @keyframes scaleIn  { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }
        @keyframes slideDown{ from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes heartPop { 0%{transform:scale(1)} 40%{transform:scale(1.3)} 100%{transform:scale(1)} }
        @keyframes shimmer   { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }

        .profile-fade { animation: fadeUp var(--motion-duration-fast) ease both; }
        .cover-fade   { animation: fadeIn var(--motion-duration-slow) ease both; }
        .card-in      { animation: scaleIn var(--motion-duration-fast) ease both; }

        .breadcrumb-link:hover {
          color: var(--color-surface-raised);
          text-decoration: underline;
        }

        .tab-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 18px; border-radius: var(--radius-step8); border: none;
          font-family: var(--font-family-primary); font-weight: 500; font-size: var(--font-size-md);
          cursor: pointer; transition: all var(--motion-duration-instant) ease; position: relative;
          background: transparent; color: var(--color-text-inverse);
          white-space: nowrap;
        }
        .tab-btn:hover { background: rgba(0, 181, 102, 0.08); color: var(--color-surface-raised); }
        .tab-btn[aria-selected="true"] { background: var(--color-surface-raised); color: white; box-shadow: var(--shadow-Btn); }

        .plant-card {
          background: white; border-radius: var(--radius-md); padding: 14px;
          border: 1px solid rgba(0, 0, 0, 0.08); transition: all var(--motion-duration-instant) ease;
          display: flex; flex-direction: column; gap: 10px;
        }
        .plant-card:hover { transform: translateY(-3px); box-shadow: var(--card-hover); border-color: rgba(0, 181, 102, 0.16); }

        .order-card {
          background: white; border-radius: var(--radius-md); padding: 16px;
          border: 1px solid rgba(0, 0, 0, 0.08); display: flex; gap: 14px;
          align-items: center; transition: all var(--motion-duration-instant) ease;
          cursor: pointer;
        }
        .order-card:hover { box-shadow: var(--card-hover); border-color: rgba(0, 181, 102, 0.16); }

        .wish-card {
          background: white; border-radius: var(--radius-md); overflow: hidden;
          border: 1px solid rgba(0, 0, 0, 0.08); transition: all var(--motion-duration-instant) ease;
        }
        .wish-card:hover { transform: translateY(-3px); box-shadow: var(--card-hover); border-color: rgba(0, 181, 102, 0.16); }

        .setting-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 14px 0; border-bottom: 1px solid rgba(0, 0, 0, 0.08);
        }
        .setting-row:last-child { border-bottom: none; }

        .toggle-track {
          width: 44px; height: 24px; border-radius: var(--radius-step8); border: none;
          cursor: pointer; transition: background var(--motion-duration-instant) ease; position: relative; padding: 0;
          flex-shrink: 0;
        }
        .toggle-thumb {
          position: absolute; top: 2px; width: 20px; height: 20px;
          border-radius: 50%; background: white; transition: transform var(--motion-duration-instant) ease;
          box-shadow: 0 1px 3px rgba(0,0,0,.15);
        }

        .badge {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 3px 8px; border-radius: var(--radius-step8);
          font-family: var(--font-family-primary); font-weight: 700; font-size: var(--font-size-xs);
        }

        .stat-box {
          background: white; border-radius: var(--radius-md); padding: 14px;
          border: 1px solid rgba(0, 0, 0, 0.08); text-align: center; flex: 1;
          transition: all var(--motion-duration-instant) ease;
        }
        .stat-box:hover { box-shadow: var(--card-hover); border-color: rgba(0, 181, 102, 0.16); transform: translateY(-2px); }

        .achievement-card {
          background: white; border-radius: var(--radius-md); padding: 12px;
          border: 1px solid rgba(0, 0, 0, 0.08); display: flex; align-items: center; gap: 12px;
          transition: all var(--motion-duration-instant) ease;
        }
        .achievement-card.unlocked { border-color: rgba(0, 181, 102, 0.16); }
        .achievement-card:hover { box-shadow: var(--card-hover); }

        /* Inputs states matching §3.6 */
        .edit-input {
          width: 100%; border: 1.5px solid rgb(212, 212, 212); border-radius: var(--radius-sm);
          padding: 10px 14px; font-family: var(--font-family-primary); font-size: var(--font-size-md);
          color: var(--color-text-secondary); background: var(--color-surface-strong); outline: none;
          transition: border-color var(--motion-duration-instant) ease, background-color var(--motion-duration-instant) ease;
        }
        .edit-input:hover { border-color: rgba(28, 28, 28, 0.5); }
        .edit-input:focus { border-color: var(--color-surface-raised); background: white; box-shadow: 0 0 0 3px rgba(0, 181, 102, 0.15); }
        
        .edit-input.input-error {
          border-color: #dc2626 !important;
          background: rgba(220, 38, 38, 0.05) !important;
        }
        .edit-input.input-valid {
          border-color: var(--color-surface-raised) !important;
        }

        .input-error-msg {
          color: #dc2626; font-size: var(--font-size-sm); margin-top: 4px; display: flex; align-items: center; gap: 4px;
        }

        .green-btn {
          background: var(--color-surface-raised); color: white; border: none; border-radius: var(--radius-step8);
          font-family: var(--font-family-primary); font-weight: 600; font-size: var(--font-size-xl);
          padding: 10px 22px; cursor: pointer; transition: all var(--motion-duration-instant) ease;
          box-shadow: 0 4px 14px rgba(0, 181, 102, 0.25);
          display: inline-flex; align-items: center; gap: 6px;
        }
        .green-btn:hover { background: var(--color-green-mid); transform: scale(1.03); }
        .green-btn:active { scale: 0.98; background: #008044; }

        .outline-btn {
          background: transparent; color: var(--color-text-inverse); border: 1.5px solid rgba(0, 0, 0, 0.08);
          border-radius: var(--radius-step8); font-family: var(--font-family-primary); font-weight: 500;
          font-size: var(--font-size-xl); padding: 9px 18px; cursor: pointer; transition: all var(--motion-duration-instant) ease;
        }
        .outline-btn:hover { border-color: var(--color-surface-raised); color: var(--color-surface-raised); }

        /* Skeleton shimmer load effect */
        .skeleton {
          background: rgba(28, 28, 28, 0.08);
          background-image: linear-gradient(90deg, rgba(28, 28, 28, 0.08) 0%, rgba(255, 255, 255, 0.6) 40%, rgba(28, 28, 28, 0.08) 80%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite linear;
          border-radius: var(--radius-sm);
        }

        /* Reduced Motion rule matching §2.6 */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
          .skeleton {
            background: rgba(28, 28, 28, 0.08) !important;
            animation: none !important;
          }
        }

        /* Responsive Breakpoints matching §4.2 */
        @media (max-width: 1280px) {
          .profile-container { padding: 0 var(--space-8) * 3 !important; }
        }
        @media (max-width: 1024px) {
          .stats-row { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .profile-hero-row { flex-direction: column !important; align-items: center !important; text-align: center !important; }
          .plants-grid { grid-template-columns: 1fr !important; }
          .wish-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .tab-scroll { overflow-x: auto; padding-bottom: 4px; }
          .tab-scroll::-webkit-scrollbar { display: none; }
          .cover-actions { right: 12px !important; bottom: 12px !important; }
          .main-pad { padding: 0 16px !important; }
          .activity-row { flex-direction: column !important; gap: 24px !important; }
          .billing-flex { flex-direction: column !important; }
          .billing-form-col { width: 100% !important; }
          .settings-flex { flex-direction: column !important; }
          .settings-side-col { width: 100% !important; }
          .delete-card-btn { opacity: 1 !important; }
        }
        @media (max-width: 480px) {
          .wish-grid { grid-template-columns: 1fr !important; }
          .tab-btn { padding: 8px 12px !important; font-size: var(--font-size-sm) !important; }
          .stats-row { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ────────────────────────────────────────────────────────
         SKIP LINK & NAVBAR
         ──────────────────────────────────────────────────────── */}
      <a href="#main-content" className="sr-only focus:not-sr-only">Skip to main content</a>
      <SharedNavbar cartCount={cartCount} />

      {/* ────────────────────────────────────────────────────────
         SKELETON LOADER (Initial fetch simulation)
         ──────────────────────────────────────────────────────── */}
      {loading ? (
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 48px" }} className="main-pad" aria-busy="true" aria-label="Loading Profile Details">
          {/* Breadcrumb skeleton */}
          <div className="skeleton" style={{ width: 150, height: 16, marginBottom: 20 }} />
          
          {/* Hero Banner skeleton */}
          <div className="skeleton" style={{ height: 240, borderRadius: 16, marginBottom: 32 }} />

          {/* Hero Row skeleton */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: 24, marginTop: -50, marginBottom: 32 }}>
            <div className="skeleton" style={{ width: 100, height: 100, borderRadius: "50%", border: "4px solid white" }} />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
              <div className="skeleton" style={{ width: 220, height: 28 }} />
              <div className="skeleton" style={{ width: "80%", height: 16 }} />
              <div className="skeleton" style={{ width: 140, height: 14 }} />
            </div>
            <div className="skeleton" style={{ width: 120, height: 38, borderRadius: 20 }} />
          </div>

          {/* Stats skeleton */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 32 }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="skeleton" style={{ height: 120, borderRadius: 12 }} />
            ))}
          </div>

          {/* Tabbar skeleton */}
          <div className="skeleton" style={{ width: 450, height: 42, borderRadius: 20, marginBottom: 28 }} />

          {/* Main Grid skeleton */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton" style={{ height: 280, borderRadius: 16 }} />
            ))}
          </div>
        </div>
      ) : (
        <main id="main-content">
          
          {/* ────────────────────────────────────────────────────────
             BREADCRUMBS (§3.16)
             ──────────────────────────────────────────────────────── */}
          <nav aria-label="Breadcrumb" style={{ maxWidth: 1200, margin: "0 auto", padding: "12px 48px" }} className="main-pad">
            <ol style={{ display: "flex", listStyle: "none", fontSize: "var(--font-size-md)", color: "var(--color-text-inverse)" }}>
              <li style={{ display: "flex", alignItems: "center" }}>
                <Link href="/" className="breadcrumb-link" style={{ transition: "color var(--motion-duration-instant)" }}>Home</Link>
                <span style={{ margin: "0 var(--space-7)", color: "rgba(0,0,0,0.2)" }} aria-hidden="true">/</span>
              </li>
              <li aria-current="page" style={{ fontWeight: 600, color: "var(--color-text-secondary)" }}>
                Profile
              </li>
            </ol>
          </nav>

          {/* ────────────────────────────────────────────────────────
             COVER BANNER IMAGE
             ──────────────────────────────────────────────────────── */}
          <div className="cover-fade" style={{ position: "relative", height: 240, background: `linear-gradient(135deg, #0b3f2c 0%, #009952 50%, #00b566 100%)`, overflow: "hidden" }}>
            {/* Decorative plant layout icons */}
            {[
              { top: "10%", left: "5%", size: 80, rotate: "-20deg", opacity: 0.18 },
              { top: "20%", right: "8%", size: 120, rotate: "30deg", opacity: 0.14 },
              { bottom: "5%", left: "20%", size: 60, rotate: "45deg", opacity: 0.12 },
              { bottom: "10%", right: "25%", size: 90, rotate: "-40deg", opacity: 0.12 },
            ].map((s, i) => (
              <div key={i} style={{ position: "absolute", top: s.top, left: s.left, right: s.right, bottom: s.bottom, transform: `rotate(${s.rotate})`, opacity: s.opacity, pointerEvents: "none", fontSize: s.size }}>
                🌿
              </div>
            ))}

            {/* Banner visual elements */}
            <img src="/monstera.png" alt="" aria-hidden="true" style={{ position: "absolute", right: 60, bottom: 0, height: 220, opacity: 0.22, objectFit: "contain", pointerEvents: "none" }} />
            <img src="/fern-large.png" alt="" aria-hidden="true" style={{ position: "absolute", left: 80, bottom: 0, height: 180, opacity: 0.18, objectFit: "contain", pointerEvents: "none" }} />

            {/* Actions overlay */}
            <div className="cover-actions" style={{ position: "absolute", right: 24, bottom: 20, display: "flex", gap: 8 }}>
              <button 
                onClick={() => addToast("Cover banner upload dialog opened (mocked).")}
                style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.3)", color: "white", borderRadius: "var(--radius-step8)", padding: "7px 14px", fontSize: 12, fontWeight: 500, transition: "all var(--motion-duration-instant) ease", cursor: "pointer" }}
              >
                <CameraIcon /> Change Cover
              </button>
            </div>
          </div>

          {/* ────────────────────────────────────────────────────────
             PROFILE HERO SECTION
             ──────────────────────────────────────────────────────── */}
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px" }} className="main-pad">
            <section aria-label="Account Overview" className="profile-hero-row" style={{ display: "flex", alignItems: "flex-end", gap: 24, marginTop: -50, marginBottom: 32, position: "relative", zIndex: 2 }}>
              
              {/* Avatar circle */}
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div style={{ width: 100, height: 100, borderRadius: "50%", background: `linear-gradient(135deg, var(--color-surface-raised) 0%, #009952 100%)`, display: "flex", alignItems: "center", justifyContent: "center", border: `4px solid white`, boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 700, fontSize: 34, color: "white", userSelect: "none" }}>
                    {userName.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase()}
                  </span>
                </div>
                <button 
                  onClick={() => addToast("Avatar upload feature simulated.")}
                  aria-label="Change profile picture" 
                  style={{ position: "absolute", bottom: 2, right: 2, width: 28, height: 28, borderRadius: "50%", background: "var(--color-surface-raised)", border: "2px solid white", color: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}
                >
                  <CameraIcon />
                </button>
              </div>

              {/* Bio Details */}
              <div style={{ flex: 1, paddingBottom: 8 }}>
                {editMode ? (
                  <form onSubmit={(e) => { e.preventDefault(); setEditMode(false); }} style={{ display: "flex", flexDirection: "column", gap: 8, animation: "slideDown .25s ease" }}>
                    <input className="edit-input" value={userName} onChange={e => { setUserName(e.target.value); setSettingsName(e.target.value); }} placeholder="Your name" aria-label="Full Name" style={{ fontSize: 18, fontWeight: 600, maxWidth: 320 }} required />
                    <input className="edit-input" value={userBio} onChange={e => setUserBio(e.target.value)} placeholder="Short bio description" aria-label="Bio description" />
                    <input className="edit-input" value={userLocation} onChange={e => { setUserLocation(e.target.value); setSettingsLocation(e.target.value); }} placeholder="Location" aria-label="Location" style={{ maxWidth: 220 }} required />
                  </form>
                ) : (
                  <div className="profile-fade" style={{ animationDelay: ".05s" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                      <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontStyle: "italic", fontSize: 28, color: "var(--color-text-secondary)" }}>{userName}</h1>
                      <span className="badge" style={{ background: "rgba(0, 181, 102, 0.08)", color: "var(--color-surface-raised)" }}>
                        🌿 Plant Parent
                      </span>
                    </div>
                    <p style={{ fontSize: 14, color: "var(--color-text-inverse)", marginTop: 4, marginBottom: 6 }}>{userBio}</p>
                    <p style={{ fontSize: 13, color: "var(--color-text-inverse)", opacity: 0.7, display: "flex", alignItems: "center", gap: 5 }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                      </svg>
                      {userLocation}
                      <span style={{ color: "rgba(0,0,0,0.12)" }} aria-hidden="true">•</span>
                      <span>Member since Jan 2025</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Header Action CTAs */}
              <div style={{ display: "flex", gap: 10, paddingBottom: 8, flexShrink: 0, flexWrap: "wrap" }}>
                {editMode ? (
                  <>
                    <button className="green-btn" onClick={() => { saveProfileField(userName, userBio, userLocation); setEditMode(false); addToast("Profile changes successfully updated."); }}>Save Changes</button>
                    <button className="outline-btn" onClick={() => {
                      if (typeof window !== "undefined") {
                        setUserName(localStorage.getItem("profile_name") || "Subhajit Ghosh");
                        setUserBio(localStorage.getItem("profile_bio") || "Plant parent of 6 🌿 | Nature lover | Always learning to grow");
                        setUserLocation(localStorage.getItem("profile_location") || "Kolkata, India");
                      }
                      setEditMode(false);
                    }}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button className="green-btn" onClick={(e) => { triggerRef.current = e.currentTarget; setEditMode(true); }}>
                      <EditIcon /> Edit Profile
                    </button>
                    <button className="outline-btn" onClick={() => {
                      if (navigator.share) {
                        navigator.share({ title: "My Hero Garden", text: `Check out ${userName}'s plant collection!`, url: window.location.href });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        addToast("Profile link copied to clipboard!");
                      }
                    }}>Share Profile</button>
                  </>
                )}
              </div>
            </section>

            {/* ────────────────────────────────────────────────────────
               STATS SUMMARY CARDS SECTION
               ──────────────────────────────────────────────────────── */}
            <section aria-label="Garden statistics summary" className="stats-row" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 32 }}>
              {[
                { label: "Plants Owned", value: myPlants.length, icon: "🌱", sub: "Thriving collection" },
                { label: "Orders Placed", value: ORDERS.length, icon: "📦", sub: "Last order Jun 12" },
                { label: "Wishlist Items", value: wishlistItems.length, icon: "❤️", sub: `${wishlistItems.filter(w=>w.saved).length} items saved` },
                { 
                  label: "Garden Health", 
                  value: `${myPlants.length > 0 ? Math.round(myPlants.reduce((acc, p) => acc + p.health, 0) / myPlants.length) : 0}%`, 
                  icon: "💚", 
                  sub: "Avg plant health" 
                },
              ].map((s, i) => (
                <div key={i} className="stat-box card-in" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div style={{ fontSize: 24, marginBottom: 6 }} aria-hidden="true">{s.icon}</div>
                  <p style={{ fontWeight: 700, fontSize: 24, color: "var(--color-text-secondary)" }}>{s.value}</p>
                  <h3 style={{ fontWeight: 600, fontSize: 13, color: "var(--color-text-inverse)", opacity: 0.8, marginBottom: 3 }}>{s.label}</h3>
                  <p style={{ fontSize: 11, color: "var(--color-text-inverse)", opacity: 0.6 }}>{s.sub}</p>
                </div>
              ))}
            </section>

            {/* ────────────────────────────────────────────────────────
               TAB LISTS NAVIGATION (WAI-ARIA TABLIST PATTERN §5.2)
               ──────────────────────────────────────────────────────── */}
            <div 
              role="tablist" 
              aria-label="Profile navigation sections" 
              className="tab-scroll" 
              style={{ display: "flex", gap: 6, marginBottom: 28, background: "white", padding: 6, borderRadius: "var(--radius-step8)", width: "fit-content", border: `1px solid rgba(0, 0, 0, 0.08)`, boxShadow: "var(--shadow-1)" }}
            >
              {[
                { key: "garden", label: "My Garden", icon: "🌿", count: myPlants.length },
                { key: "orders", label: "Orders", icon: "📦", count: ORDERS.length },
                { key: "wishlist", label: "Wishlist", icon: "❤️", count: wishlistItems.filter(w => w.saved).length },
                { key: "billing", label: "Saved Cards", icon: "💳", count: savedCards.length },
                { key: "settings", label: "Settings", icon: "⚙️", count: null },
              ].map((t, idx) => (
                <button
                  key={t.key}
                  id={`tab-${t.key}`}
                  role="tab"
                  aria-selected={activeTab === t.key}
                  aria-controls={`panel-${t.key}`}
                  tabIndex={activeTab === t.key ? 0 : -1}
                  ref={el => { tabRefs.current[t.key] = el; }}
                  onClick={() => setActiveTab(t.key)}
                  onKeyDown={(e) => handleTabKeyDown(e, idx, t.key)}
                  className="tab-btn"
                >
                  <span aria-hidden="true" style={{ fontSize: 14 }}>{t.icon}</span>
                  {t.label}
                  {t.count !== null && (
                    <span style={{ background: activeTab === t.key ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.06)", color: activeTab === t.key ? "white" : "var(--color-text-inverse)", opacity: activeTab === t.key ? 1 : 0.7, borderRadius: 99, padding: "1px 6px", fontSize: 10, fontWeight: 700, marginLeft: 4 }}>
                      {t.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* ────────────────────────────────────────────────────────
               TABPANELS SECTION
               ──────────────────────────────────────────────────────── */}

            {/* PANEL: MY GARDEN */}
            <div 
              id="panel-garden" 
              role="tabpanel" 
              aria-labelledby="tab-garden" 
              hidden={activeTab !== "garden"}
              className="profile-fade"
              style={{ display: activeTab === "garden" ? "block" : "none" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h2 style={{ fontWeight: 700, fontSize: 18, color: "var(--color-text-secondary)" }}>
                  My Garden <span style={{ color: "var(--color-text-inverse)", opacity: 0.6, fontWeight: 400, fontSize: 14 }}>— {myPlants.length} plants</span>
                </h2>
                <button 
                  onClick={(e) => { triggerRef.current = e.currentTarget; setPlantModalOpen(true); }}
                  className="green-btn" 
                  style={{ fontSize: 13, padding: "8px 18px" }}
                >
                  <PlusIcon /> Add Plant
                </button>
              </div>

              {/* Plant Cards Grid */}
              <div className="plants-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18, marginBottom: 40 }}>
                {myPlants.map((p, i) => (
                  <article key={p.id} className="plant-card card-in" style={{ animationDelay: `${i * 0.05}s` }}>
                    <div style={{ position: "relative", borderRadius: "var(--radius-md)", overflow: "hidden", background: "var(--color-surface-strong)", height: 140 }}>
                      <img src={p.img} alt={`Photo of ${p.name} plant`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <span className="badge" style={{ 
                        position: "absolute", top: 10, left: 10, 
                        background: p.badge === "Thriving" || p.badge === "Perfect" ? "rgba(0,181,102,0.12)" : p.badge === "Needs Water" ? "#FEF3C7" : "#EFF6FF", 
                        color: p.badge === "Thriving" || p.badge === "Perfect" ? "var(--color-surface-raised)" : p.badge === "Needs Water" ? "var(--profile-star-fill)" : "var(--color-text-inverse)" 
                      }}>
                        {p.badge}
                      </span>
                    </div>
                    <div>
                      <h3 style={{ fontWeight: 600, fontSize: 14, color: "var(--color-text-secondary)", marginBottom: 2 }}>{p.name}</h3>
                      <p style={{ fontSize: 12, color: "var(--color-text-inverse)", opacity: 0.7, marginBottom: 10 }}>{p.pot} Pot</p>
                      
                      {/* Health Indicator bar */}
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <span style={{ fontSize: 11, color: "var(--color-text-inverse)", opacity: 0.7, width: 42, flexShrink: 0 }}>Health</span>
                        <HealthBar value={p.health} />
                        <span style={{ fontSize: 11, fontWeight: 600, color: p.health >= 90 ? "var(--color-surface-raised)" : p.health >= 75 ? "var(--profile-star-fill)" : "var(--profile-danger-text)", width: 30, textAlign: "right" }}>
                          {p.health}%
                        </span>
                      </div>

                      {/* Details row */}
                      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--color-text-inverse)", opacity: 0.8 }}>
                          <WaterIcon /> {p.water}
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--color-text-inverse)", opacity: 0.8 }}>
                          <SunIcon /> {p.light}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Activity & Achievements layout block */}
              <div className="activity-row" style={{ display: "flex", gap: 24, marginBottom: 40 }}>
                {/* Recent Activities */}
                <section aria-label="Recent gardening logs" style={{ flex: 1, background: "white", borderRadius: "var(--radius-lg)", padding: 24, border: `1px solid rgba(0, 0, 0, 0.08)` }}>
                  <h3 style={{ fontWeight: 700, fontSize: 15, color: "var(--color-text-secondary)", marginBottom: 18 }}>Recent Activity</h3>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {ACTIVITY.map((a, i) => (
                      <div key={i} style={{ display: "flex", gap: 14, padding: "12px 0", borderBottom: i < ACTIVITY.length - 1 ? `1px solid rgba(0,0,0,0.06)` : "none", alignItems: "flex-start" }}>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: `${a.color}14`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>
                          {a.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 13, color: "var(--color-text-inverse)", lineHeight: 1.45 }}>{a.text}</p>
                          <p style={{ fontSize: 11, color: "var(--color-text-inverse)", opacity: 0.6, marginTop: 2 }}>{a.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Achievements List */}
                <section aria-label="My unlocked achievements" style={{ width: 340, flexShrink: 0, background: "white", borderRadius: "var(--radius-lg)", padding: 24, border: `1px solid rgba(0, 0, 0, 0.08)` }}>
                  <h3 style={{ fontWeight: 700, fontSize: 15, color: "var(--color-text-secondary)", marginBottom: 18 }}>
                    Achievements <span style={{ fontSize: 12, color: "var(--color-text-inverse)", opacity: 0.6, fontWeight: 400 }}>4/6 unlocked</span>
                  </h3>
                  
                  {/* Progress tracker */}
                  <div style={{ background: "rgba(0,0,0,0.06)", borderRadius: 99, height: 6, marginBottom: 18, overflow: "hidden" }} aria-label="Achievements progress 66%">
                    <div style={{ width: "66%", height: "100%", background: `linear-gradient(90deg, var(--color-surface-raised), #009952)`, borderRadius: 99 }} />
                  </div>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {ACHIEVEMENTS.map((a, i) => (
                      <div key={i} className={`achievement-card${a.unlocked ? " unlocked" : ""}`} style={{ opacity: a.unlocked ? 1 : 0.45, filter: a.unlocked ? "none" : "grayscale(1)" }}>
                        <div style={{ width: 38, height: 38, borderRadius: "var(--radius-sm)", background: a.unlocked ? "rgba(0, 181, 102, 0.08)" : "var(--color-surface-strong)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }} aria-hidden="true">
                          {a.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontWeight: 600, fontSize: 13, color: "var(--color-text-secondary)" }}>{a.label}</h4>
                          <p style={{ fontSize: 11, color: "var(--color-text-inverse)", opacity: 0.7, marginTop: 1 }}>{a.desc}</p>
                        </div>
                        {a.unlocked && <span style={{ fontSize: 14, color: "var(--color-surface-raised)", fontWeight: "bold" }} aria-label="Unlocked">✓</span>}
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>

            {/* PANEL: ORDER HISTORY */}
            <div 
              id="panel-orders" 
              role="tabpanel" 
              aria-labelledby="tab-orders" 
              hidden={activeTab !== "orders"}
              className="profile-fade"
              style={{ display: activeTab === "orders" ? "block" : "none" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h2 style={{ fontWeight: 700, fontSize: 18, color: "var(--color-text-secondary)" }}>Order History</h2>
                <div style={{ display: "flex", gap: 8 }}>
                  <label htmlFor="filter-orders" className="sr-only">Filter orders</label>
                  <select id="filter-orders" aria-label="Filter orders" style={{ border: `1px solid rgba(0,0,0,0.08)`, borderRadius: "var(--radius-sm)", padding: "8px 14px", fontSize: 13, color: "var(--color-text-inverse)", background: "white", outline: "none", cursor: "pointer" }}>
                    <option>All Orders</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Orders Cards list */}
              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 40 }}>
                {ORDERS.map((o, i) => {
                  const delivered = o.status === "Delivered";
                  return (
                    <article 
                      key={o.id} 
                      onClick={(e) => { triggerRef.current = e.currentTarget; setSelectedOrder(o); setOrderModalOpen(true); }}
                      className="order-card card-in" 
                      style={{ animationDelay: `${i * 0.05}s` }}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          triggerRef.current = e.currentTarget;
                          setSelectedOrder(o);
                          setOrderModalOpen(true);
                        }
                      }}
                      aria-label={`Order ${o.id} placed on ${o.date}. Click to view details.`}
                    >
                      <div style={{ width: 60, height: 60, borderRadius: "var(--radius-sm)", overflow: "hidden", background: "var(--color-surface-strong)", flexShrink: 0 }}>
                        <img src={o.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                          <div>
                            <h3 style={{ fontWeight: 600, fontSize: 14, color: "var(--color-text-secondary)" }}>Order {o.id}</h3>
                            <p style={{ fontSize: 11, color: "var(--color-text-inverse)", opacity: 0.6, marginTop: 2 }}>{o.date}</p>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <p style={{ fontWeight: 700, fontSize: 15, color: "var(--color-text-secondary)" }}>${o.total.toFixed(2)}</p>
                            <span style={{ fontSize: 11, color: "var(--color-text-inverse)", opacity: 0.7 }}>{o.items.length} items</span>
                          </div>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                          <p style={{ fontSize: 12, color: "var(--color-text-inverse)", opacity: 0.8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginRight: 16 }}>
                            {o.items.join(" + ")}
                          </p>
                          <span className="badge" style={{ 
                            background: delivered ? "rgba(22, 163, 74, 0.12)" : "rgba(220, 38, 38, 0.12)", 
                            color: delivered ? "#16a34a" : "#dc2626" 
                          }}>
                            {delivered ? "✓" : "✕"} {o.status}
                          </span>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            {/* PANEL: WISHLIST */}
            <div 
              id="panel-wishlist" 
              role="tabpanel" 
              aria-labelledby="tab-wishlist" 
              hidden={activeTab !== "wishlist"}
              className="profile-fade"
              style={{ display: activeTab === "wishlist" ? "block" : "none" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h2 style={{ fontWeight: 700, fontSize: 18, color: "var(--color-text-secondary)" }}>
                  My Wishlist <span style={{ color: "var(--color-text-inverse)", opacity: 0.6, fontWeight: 400, fontSize: 14 }}>— {wishlistItems.filter(w=>w.saved).length} items</span>
                </h2>
                <Link href="/collections/plants" style={{ fontSize: 13, color: "var(--color-surface-raised)", textDecoration: "underline", fontWeight: 600 }} className="breadcrumb-link">Browse All Plants →</Link>
              </div>

              {/* Wishlist Items Grid */}
              <div className="wish-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18, marginBottom: 40 }}>
                {wishlistItems.map((item, i) => {
                  if (!item.saved) return null;
                  return (
                    <article key={item.id} className="wish-card card-in" style={{ animationDelay: `${i * 0.05}s` }}>
                      <div style={{ position: "relative", height: 170 }}>
                        <img src={item.img} alt={`Product photo of ${item.name}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0, 0, 0, 0.3) 0%, transparent 50%)" }} />
                        <button
                          onClick={() => handleHeartToggle(item.id, item.name)}
                          aria-label={`Remove ${item.name} from wishlist`}
                          style={{ position: "absolute", top: 10, right: 10, width: 32, height: 32, borderRadius: "50%", background: "white", border: "none", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,.15)", cursor: "pointer", animation: item.saved ? "heartPop .35s ease" : undefined }}
                        >
                          <HeartIcon filled={item.saved} />
                        </button>
                      </div>
                      <div style={{ padding: 14 }}>
                        <h3 style={{ fontWeight: 600, fontSize: 14, color: "var(--color-text-secondary)", marginBottom: 4 }}>{item.name}</h3>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                          <Stars rating={item.rating} />
                          <span style={{ fontSize: 11, color: "var(--color-text-inverse)", opacity: 0.6 }} aria-label={`${item.reviews} reviews`}>({item.reviews})</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <p style={{ fontWeight: 700, fontSize: 15, color: "var(--color-text-secondary)" }}>${item.price.toFixed(2)}</p>
                          <button 
                            className="green-btn" 
                            style={{ fontSize: 11, padding: "6px 12px" }}
                            onClick={() => handleAddToCart(item.name)}
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}

                {wishlistItems.filter(w => w.saved).length === 0 && (
                  <div style={{ gridColumn: "1/-1", border: `2px dashed rgba(0,0,0,0.08)`, borderRadius: "var(--radius-md)", padding: "64px 24px", textAlign: "center" }}>
                    <p style={{ fontSize: 36, marginBottom: 12 }}>❤️</p>
                    <h3 style={{ fontWeight: 600, fontSize: 15, color: "var(--color-text-secondary)", marginBottom: 4 }}>No Saved Items</h3>
                    <p style={{ fontSize: 13, color: "var(--color-text-inverse)", opacity: 0.7, marginBottom: 18 }}>Your wishlist is empty. Add plants you love to save them here.</p>
                    <Link href="/collections/plants" className="green-btn">Explore Plants</Link>
                  </div>
                )}
              </div>
            </div>

            {/* PANEL: SAVED CARDS (BILLING) */}
            <div 
              id="panel-billing" 
              role="tabpanel" 
              aria-labelledby="tab-billing" 
              hidden={activeTab !== "billing"}
              className="profile-fade"
              style={{ display: activeTab === "billing" ? "block" : "none" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h2 style={{ fontWeight: 700, fontSize: 18, color: "var(--color-text-secondary)" }}>Saved Payment Methods</h2>
              </div>
              
              <div className="billing-flex" style={{ display: "flex", gap: 32, flexWrap: "wrap", alignItems: "flex-start", marginBottom: 40 }}>
                {/* Left: saved cards list */}
                <div style={{ flex: 1, minWidth: 320, display: "flex", flexDirection: "column", gap: 14 }}>
                  <p style={{ fontSize: 13, color: "var(--color-text-inverse)", opacity: 0.7, marginBottom: 4 }}>Manage your credit and debit options for faster checkout flows:</p>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
                    {savedCards.map(card => (
                      <div key={card.id} className="card-in">
                        <CreditCard
                          number={card.number}
                          name={card.name}
                          expiry={card.expiry}
                          type={card.type}
                          color={card.color}
                          onDelete={() => handleDeleteCard(card.id)}
                        />
                      </div>
                    ))}
                    {savedCards.length === 0 && (
                      <div style={{ gridColumn: "1/-1", border: `2px dashed rgba(0,0,0,0.08)`, borderRadius: "var(--radius-md)", padding: "48px 24px", textAlign: "center" }}>
                        <p style={{ fontSize: 32, marginBottom: 8 }}>💳</p>
                        <h3 style={{ fontWeight: 600, fontSize: 14, color: "var(--color-text-secondary)", marginBottom: 4 }}>No Saved Cards</h3>
                        <p style={{ fontSize: 12, color: "var(--color-text-inverse)", opacity: 0.6 }}>Register your primary cards to simplify future purchases.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: add form + live preview */}
                <div style={{ width: 340, flexShrink: 0, display: "flex", flexDirection: "column", gap: 20 }} className="billing-form-col">
                  <div style={{ background: "white", borderRadius: "var(--radius-lg)", padding: 24, border: `1px solid rgba(0, 0, 0, 0.08)`, boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
                    <h3 style={{ fontWeight: 700, fontSize: 15, color: "var(--color-text-secondary)", marginBottom: 18 }}>Add New Card</h3>
                    
                    {/* Live Preview card */}
                    <div style={{ marginBottom: 24, display: "flex", justifyContent: "center" }}>
                      <CreditCard
                        number={formNumber}
                        name={formName}
                        expiry={formExpiry}
                        type={getCardType(formNumber)}
                        color="linear-gradient(135deg, #1e293b 0%, #0f172a 100%)"
                      />
                    </div>

                    {/* Form fields */}
                    <form onSubmit={handleAddCard} style={{ display: "flex", flexDirection: "column", gap: 14 }} noValidate>
                      <div>
                        <label htmlFor="card-number" style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-inverse)", opacity: 0.7, display: "block", marginBottom: 5, textTransform: "uppercase" }}>
                          Card Number <span style={{ color: "var(--color-surface-raised)" }} aria-hidden="true">*</span>
                        </label>
                        <input 
                          id="card-number"
                          value={formNumber} 
                          onChange={handleNumberChange} 
                          onBlur={() => { setCardTouched(prev => ({ ...prev, number: true })); validateCardField("number", formNumber); }}
                          placeholder="4111 2222 3333 4444" 
                          aria-required="true"
                          aria-invalid={!!cardErrors.number}
                          aria-describedby={cardErrors.number ? "card-number-error" : undefined}
                          className={`edit-input ${cardTouched.number && cardErrors.number ? "input-error" : cardTouched.number ? "input-valid" : ""}`}
                        />
                        {cardTouched.number && cardErrors.number && (
                          <div id="card-number-error" role="alert" className="input-error-msg">⚠️ {cardErrors.number}</div>
                        )}
                      </div>

                      <div>
                        <label htmlFor="card-name" style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-inverse)", opacity: 0.7, display: "block", marginBottom: 5, textTransform: "uppercase" }}>
                          Cardholder Name <span style={{ color: "var(--color-surface-raised)" }} aria-hidden="true">*</span>
                        </label>
                        <input 
                          id="card-name"
                          value={formName} 
                          onChange={(e) => { setFormName(e.target.value); if (cardTouched.name) validateCardField("name", e.target.value); }} 
                          onBlur={() => { setCardTouched(prev => ({ ...prev, name: true })); validateCardField("name", formName); }}
                          placeholder="SUBHAJIT GHOSH" 
                          aria-required="true"
                          aria-invalid={!!cardErrors.name}
                          aria-describedby={cardErrors.name ? "card-name-error" : undefined}
                          style={{ textTransform: "uppercase" }}
                          className={`edit-input ${cardTouched.name && cardErrors.name ? "input-error" : cardTouched.name ? "input-valid" : ""}`}
                        />
                        {cardTouched.name && cardErrors.name && (
                          <div id="card-name-error" role="alert" className="input-error-msg">⚠️ {cardErrors.name}</div>
                        )}
                      </div>

                      <div style={{ display: "flex", gap: 12 }}>
                        <div style={{ flex: 1 }}>
                          <label htmlFor="card-expiry" style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-inverse)", opacity: 0.7, display: "block", marginBottom: 5, textTransform: "uppercase" }}>
                            Expiry <span style={{ color: "var(--color-surface-raised)" }} aria-hidden="true">*</span>
                          </label>
                          <input 
                            id="card-expiry"
                            value={formExpiry} 
                            onChange={handleExpiryChange} 
                            onBlur={() => { setCardTouched(prev => ({ ...prev, expiry: true })); validateCardField("expiry", formExpiry); }}
                            placeholder="MM/YY" 
                            aria-required="true"
                            aria-invalid={!!cardErrors.expiry}
                            aria-describedby={cardErrors.expiry ? "card-expiry-error" : undefined}
                            className={`edit-input ${cardTouched.expiry && cardErrors.expiry ? "input-error" : cardTouched.expiry ? "input-valid" : ""}`}
                          />
                          {cardTouched.expiry && cardErrors.expiry && (
                            <div id="card-expiry-error" role="alert" className="input-error-msg">⚠️ {cardErrors.expiry}</div>
                          )}
                        </div>
                        <div style={{ flex: 1 }}>
                          <label htmlFor="card-cvv" style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-inverse)", opacity: 0.7, display: "block", marginBottom: 5, textTransform: "uppercase" }}>
                            CVV <span style={{ color: "var(--color-surface-raised)" }} aria-hidden="true">*</span>
                          </label>
                          <input 
                            id="card-cvv"
                            type="password" 
                            value={formCvv} 
                            onChange={handleCvvChange} 
                            onBlur={() => { setCardTouched(prev => ({ ...prev, cvv: true })); validateCardField("cvv", formCvv); }}
                            placeholder="•••" 
                            aria-required="true"
                            aria-invalid={!!cardErrors.cvv}
                            aria-describedby={cardErrors.cvv ? "card-cvv-error" : undefined}
                            className={`edit-input ${cardTouched.cvv && cardErrors.cvv ? "input-error" : cardTouched.cvv ? "input-valid" : ""}`}
                          />
                          {cardTouched.cvv && cardErrors.cvv && (
                            <div id="card-cvv-error" role="alert" className="input-error-msg">⚠️ {cardErrors.cvv}</div>
                          )}
                        </div>
                      </div>

                      <button type="submit" className="green-btn" style={{ marginTop: 8, width: "100%", justifyContent: "center" }}>
                        Save Card
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            {/* PANEL: SETTINGS */}
            <div 
              id="panel-settings" 
              role="tabpanel" 
              aria-labelledby="tab-settings" 
              hidden={activeTab !== "settings"}
              className="profile-fade"
              style={{ display: activeTab === "settings" ? "block" : "none" }}
            >
              <div className="settings-flex" style={{ display: "flex", gap: 24, alignItems: "flex-start", marginBottom: 40 }}>
                {/* Left Settings Column */}
                <div style={{ flex: 1, minWidth: 280, display: "flex", flexDirection: "column", gap: 20 }}>
                  
                  {/* Account settings form */}
                  <section aria-labelledby="heading-account-info" style={{ background: "white", borderRadius: "var(--radius-lg)", padding: 24, border: `1px solid rgba(0, 0, 0, 0.08)` }}>
                    <h3 id="heading-account-info" style={{ fontWeight: 700, fontSize: 15, color: "var(--color-text-secondary)", marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ width: 32, height: 32, background: "rgba(0, 181, 102, 0.08)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-surface-raised)" }} aria-hidden="true">
                        <EditIcon />
                      </span>
                      Account Information
                    </h3>
                    
                    <form onSubmit={handleUpdateInfo} style={{ display: "flex", flexDirection: "column", gap: 14 }} noValidate>
                      {[
                        { key: "name", label: "Full Name", value: settingsName, setValue: setSettingsName, type: "text" },
                        { key: "email", label: "Email", value: settingsEmail, setValue: setSettingsEmail, type: "email" },
                        { key: "phone", label: "Phone", value: settingsPhone, setValue: setSettingsPhone, type: "tel" },
                        { key: "location", label: "Location", value: settingsLocation, setValue: setSettingsLocation, type: "text" },
                      ].map(f => (
                        <div key={f.key}>
                          <label htmlFor={`settings-${f.key}`} style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-inverse)", opacity: 0.8, display: "block", marginBottom: 5 }}>
                            {f.label} <span style={{ color: "var(--color-surface-raised)" }} aria-hidden="true">*</span>
                          </label>
                          <input 
                            id={`settings-${f.key}`}
                            type={f.type} 
                            value={f.value} 
                            onChange={(e) => { f.setValue(e.target.value); if (settingsTouched[f.key]) validateSettingsField(f.key, e.target.value); }}
                            onBlur={() => { setSettingsTouched(prev => ({ ...prev, [f.key]: true })); validateSettingsField(f.key, f.value); }}
                            aria-required="true"
                            aria-invalid={!!settingsErrors[f.key]}
                            aria-describedby={settingsErrors[f.key] ? `settings-${f.key}-error` : undefined}
                            className={`edit-input ${settingsTouched[f.key] && settingsErrors[f.key] ? "input-error" : settingsTouched[f.key] ? "input-valid" : ""}`}
                          />
                          {settingsTouched[f.key] && settingsErrors[f.key] && (
                            <div id={`settings-${f.key}-error`} role="alert" className="input-error-msg">⚠️ {settingsErrors[f.key]}</div>
                          )}
                        </div>
                      ))}
                      <button type="submit" className="green-btn" style={{ alignSelf: "flex-start", marginTop: 4 }}>Save Changes</button>
                    </form>
                  </section>

                  {/* Password update form */}
                  <section aria-labelledby="heading-password-change" style={{ background: "white", borderRadius: "var(--radius-lg)", padding: 24, border: `1px solid rgba(0, 0, 0, 0.08)` }}>
                    <h3 id="heading-password-change" style={{ fontWeight: 700, fontSize: 15, color: "var(--color-text-secondary)", marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ width: 32, height: 32, background: "rgba(200, 168, 75, 0.12)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--profile-star-fill)" }} aria-hidden="true">
                        <LockIcon />
                      </span>
                      Change Password
                    </h3>
                    
                    <form onSubmit={handleChangePassword} style={{ display: "flex", flexDirection: "column", gap: 12 }} noValidate>
                      {[
                        { key: "currentPassword", label: "Current Password", value: currentPassword, setValue: setCurrentPassword },
                        { key: "newPassword", label: "New Password", value: newPassword, setValue: setNewPassword },
                        { key: "confirmPassword", label: "Confirm Password", value: confirmPassword, setValue: setConfirmPassword },
                      ].map(f => (
                        <div key={f.key}>
                          <label htmlFor={`pwd-${f.key}`} style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-inverse)", opacity: 0.8, display: "block", marginBottom: 5 }}>
                            {f.label} <span style={{ color: "var(--color-surface-raised)" }} aria-hidden="true">*</span>
                          </label>
                          <input 
                            id={`pwd-${f.key}`}
                            type="password" 
                            value={f.value} 
                            placeholder="••••••••"
                            onChange={(e) => { f.setValue(e.target.value); if (passwordTouched[f.key]) validatePasswordField(f.key, e.target.value); }}
                            onBlur={() => { setPasswordTouched(prev => ({ ...prev, [f.key]: true })); validatePasswordField(f.key, f.value); }}
                            aria-required="true"
                            aria-invalid={!!passwordErrors[f.key]}
                            aria-describedby={passwordErrors[f.key] ? `pwd-${f.key}-error` : undefined}
                            className={`edit-input ${passwordTouched[f.key] && passwordErrors[f.key] ? "input-error" : passwordTouched[f.key] ? "input-valid" : ""}`}
                          />
                          {passwordTouched[f.key] && passwordErrors[f.key] && (
                            <div id={`pwd-${f.key}-error`} role="alert" className="input-error-msg">⚠️ {passwordErrors[f.key]}</div>
                          )}
                        </div>
                      ))}
                      <button type="submit" className="green-btn" style={{ alignSelf: "flex-start", marginTop: 4 }}>Update Password</button>
                    </form>
                  </section>
                </div>

                {/* Right Settings Column */}
                <div style={{ width: 340, flexShrink: 0, display: "flex", flexDirection: "column", gap: 20 }} className="settings-side-col">
                  
                  {/* Notifications Switch list §3.8 */}
                  <section aria-labelledby="heading-notifications" style={{ background: "white", borderRadius: "var(--radius-lg)", padding: 24, border: `1px solid rgba(0, 0, 0, 0.08)` }}>
                    <h3 id="heading-notifications" style={{ fontWeight: 700, fontSize: 15, color: "var(--color-text-secondary)", marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ width: 32, height: 32, background: "rgba(37, 99, 235, 0.12)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#2563eb" }} aria-hidden="true">
                        <BellIcon />
                      </span>
                      Notifications
                    </h3>
                    
                    {[
                      { key: "water" as const, label: "Watering Reminders", desc: "Daily plant care alerts" },
                      { key: "orders" as const, label: "Order Updates", desc: "Shipping & delivery status" },
                      { key: "promo" as const, label: "Promotions", desc: "Deals & discount offers" },
                      { key: "tips" as const, label: "Plant Care Tips", desc: "Weekly growing advice" },
                    ].map((n, idx) => (
                      <div key={n.key} className="setting-row">
                        <div id={`label-switch-${n.key}`}>
                          <p style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-secondary)" }}>{n.label}</p>
                          <p style={{ fontSize: 11, color: "var(--color-text-inverse)", opacity: 0.6, marginTop: 2 }}>{n.desc}</p>
                        </div>
                        
                        <button
                          className="toggle-track"
                          style={{ background: notifPref[n.key] ? "var(--color-surface-raised)" : "rgba(0,0,0,0.12)" }}
                          onClick={() => toggleNotifPref(n.key)}
                          role="switch"
                          aria-checked={notifPref[n.key]}
                          aria-labelledby={`label-switch-${n.key}`}
                        >
                          <div className="toggle-thumb" style={{ transform: notifPref[n.key] ? "translateX(22px)" : "translateX(2px)" }} />
                        </button>
                      </div>
                    ))}
                  </section>

                  {/* Danger Zone */}
                  <section aria-labelledby="heading-danger-zone" style={{ background: "white", borderRadius: "var(--radius-lg)", padding: 24, border: `1.5px solid #FEE2E2` }}>
                    <h3 id="heading-danger-zone" style={{ fontWeight: 700, fontSize: 15, color: "var(--profile-danger-text)", marginBottom: 14 }}>Danger Zone</h3>
                    <p style={{ fontSize: 13, color: "var(--color-text-inverse)", opacity: 0.8, marginBottom: 16, lineHeight: 1.5 }}>These actions are permanent and cannot be undone. Please be careful.</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      <button 
                        onClick={(e) => { triggerRef.current = e.currentTarget; setDangerType("export"); setDangerModalOpen(true); }}
                        style={{ background: "transparent", border: "1.5px solid #FCA5A5", color: "var(--profile-danger-text)", borderRadius: 10, padding: "10px 16px", fontSize: 13, fontWeight: 500, cursor: "pointer", textAlign: "left", transition: "all var(--motion-duration-instant)" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "#FEE2E2")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                      >
                        Export My Data
                      </button>
                      
                      <button 
                        onClick={(e) => { triggerRef.current = e.currentTarget; setDangerType("delete"); setDangerModalOpen(true); }}
                        style={{ background: "transparent", border: "1.5px solid #FCA5A5", color: "var(--profile-danger-text)", borderRadius: 10, padding: "10px 16px", fontSize: 13, fontWeight: 500, cursor: "pointer", textAlign: "left", transition: "all var(--motion-duration-instant)" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "#FEE2E2")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                      >
                        Delete Account Permanently
                      </button>
                    </div>
                  </section>
                </div>
              </div>
            </div>

            <div style={{ height: 64 }} />
          </div>

          {/* ────────────────────────────────────────────────────────
             INTERACTIVE MODALS Shells (§3.12)
             ──────────────────────────────────────────────────────── */}
          
          {/* MODAL A: ADD PLANT */}
          {plantModalOpen && (
            <div 
              role="dialog" 
              aria-modal="true" 
              aria-labelledby="modal-plant-heading" 
              style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300, padding: 16 }}
            >
              <div 
                ref={modalRef}
                style={{ background: "var(--color-surface-strong)", borderRadius: "var(--radius-xl)", padding: 32, maxWidth: 500, width: "100%", boxShadow: "var(--modal-shadow)", position: "relative", animation: "scaleIn var(--motion-duration-fast) ease" }}
              >
                {/* Close Button */}
                <button 
                  onClick={() => { setPlantModalOpen(false); triggerRef.current?.focus(); }}
                  aria-label="Close dialog" 
                  style={{ position: "absolute", top: 16, right: 16, width: 36, height: 36, borderRadius: "50%", background: "rgba(0,0,0,0.05)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                >
                  ✕
                </button>

                <h2 id="modal-plant-heading" style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 18, color: "var(--color-text-secondary)", marginBottom: 18 }}>Add Plant to Garden</h2>
                
                <form onSubmit={handleAddPlant} style={{ display: "flex", flexDirection: "column", gap: 14 }} noValidate>
                  <div>
                    <label htmlFor="plant-name" style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-inverse)", opacity: 0.8, display: "block", marginBottom: 5 }}>
                      Plant Name <span style={{ color: "var(--color-surface-raised)" }} aria-hidden="true">*</span>
                    </label>
                    <input 
                      id="plant-name" 
                      value={newPlantName} 
                      onChange={(e) => { setNewPlantName(e.target.value); if (plantTouched.name) validatePlantField("name", e.target.value); }} 
                      onBlur={() => { setPlantTouched(prev => ({ ...prev, name: true })); validatePlantField("name", newPlantName); }}
                      placeholder="e.g. Ficus Lyrata" 
                      aria-required="true"
                      aria-invalid={!!plantFormErrors.name}
                      aria-describedby={plantFormErrors.name ? "plant-name-error" : undefined}
                      className={`edit-input ${plantTouched.name && plantFormErrors.name ? "input-error" : ""}`}
                    />
                    {plantTouched.name && plantFormErrors.name && (
                      <div id="plant-name-error" role="alert" className="input-error-msg">⚠️ {plantFormErrors.name}</div>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <label htmlFor="plant-pot" style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-inverse)", opacity: 0.8, display: "block", marginBottom: 5 }}>Pot Style</label>
                      <select 
                        id="plant-pot" 
                        value={newPlantPot} 
                        onChange={(e) => setNewPlantPot(e.target.value)} 
                        style={{ border: `1.5px solid rgb(212, 212, 212)`, borderRadius: "var(--radius-sm)", padding: 10, fontSize: 13, background: "white", width: "100%", outline: "none" }}
                      >
                        {["Terracotta", "White Ceramic", "Rattan Basket", "Black Geometric", "Minimalist Plastic"].map(pot => (
                          <option key={pot} value={pot}>{pot}</option>
                        ))}
                      </select>
                    </div>

                    <div style={{ flex: 1 }}>
                      <label htmlFor="plant-light" style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-inverse)", opacity: 0.8, display: "block", marginBottom: 5 }}>Sunlight</label>
                      <select 
                        id="plant-light" 
                        value={newPlantLight} 
                        onChange={(e) => setNewPlantLight(e.target.value)} 
                        style={{ border: `1.5px solid rgb(212, 212, 212)`, borderRadius: "var(--radius-sm)", padding: 10, fontSize: 13, background: "white", width: "100%", outline: "none" }}
                      >
                        {["Bright indirect", "Medium indirect", "Low light", "Direct sun", "Full sun"].map(light => (
                          <option key={light} value={light}>{light}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <label htmlFor="plant-water" style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-inverse)", opacity: 0.8, display: "block", marginBottom: 5 }}>Water Schedule</label>
                      <select 
                        id="plant-water" 
                        value={newPlantWater} 
                        onChange={(e) => setNewPlantWater(e.target.value)} 
                        style={{ border: `1.5px solid rgb(212, 212, 212)`, borderRadius: "var(--radius-sm)", padding: 10, fontSize: 13, background: "white", width: "100%", outline: "none" }}
                      >
                        {["Today", "Tomorrow", "In 2 days", "In 3 days", "In 5 days", "In 7 days"].map(w => (
                          <option key={w} value={w}>{w}</option>
                        ))}
                      </select>
                    </div>

                    <div style={{ flex: 1 }}>
                      <label htmlFor="plant-health" style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-inverse)", opacity: 0.8, display: "block", marginBottom: 5 }}>Health (%)</label>
                      <input 
                        id="plant-health" 
                        type="number" 
                        value={newPlantHealth} 
                        onChange={(e) => { setNewPlantHealth(Number(e.target.value)); if (plantTouched.health) validatePlantField("health", e.target.value); }} 
                        onBlur={() => { setPlantTouched(prev => ({ ...prev, health: true })); validatePlantField("health", newPlantHealth); }}
                        min="0"
                        max="100"
                        aria-required="true"
                        aria-invalid={!!plantFormErrors.health}
                        aria-describedby={plantFormErrors.health ? "plant-health-error" : undefined}
                        className={`edit-input ${plantTouched.health && plantFormErrors.health ? "input-error" : ""}`}
                      />
                      {plantTouched.health && plantFormErrors.health && (
                        <div id="plant-health-error" role="alert" className="input-error-msg">⚠️ {plantFormErrors.health}</div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 12 }}>
                    <button type="button" onClick={() => { setPlantModalOpen(false); triggerRef.current?.focus(); }} className="outline-btn">Cancel</button>
                    <button type="submit" className="green-btn">Save Plant</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* MODAL B: ORDER DETAILS */}
          {orderModalOpen && selectedOrder && (
            <div 
              role="dialog" 
              aria-modal="true" 
              aria-labelledby="modal-order-heading" 
              style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300, padding: 16 }}
            >
              <div 
                ref={modalRef}
                style={{ background: "var(--color-surface-strong)", borderRadius: "var(--radius-xl)", padding: 32, maxWidth: 540, width: "100%", boxShadow: "var(--modal-shadow)", position: "relative", animation: "scaleIn var(--motion-duration-fast) ease" }}
              >
                {/* Close */}
                <button 
                  onClick={() => { setOrderModalOpen(false); triggerRef.current?.focus(); }}
                  aria-label="Close dialog" 
                  style={{ position: "absolute", top: 16, right: 16, width: 36, height: 36, borderRadius: "50%", background: "rgba(0,0,0,0.05)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                >
                  ✕
                </button>

                <h2 id="modal-order-heading" style={{ fontWeight: 700, fontSize: 18, color: "var(--color-text-secondary)", marginBottom: 6 }}>Order Details</h2>
                <p style={{ fontSize: 12, color: "var(--color-text-inverse)", opacity: 0.6, marginBottom: 20 }}>Invoice ID: {selectedOrder.id} • Purchased on {selectedOrder.date}</p>

                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  
                  {/* Items summary */}
                  <div>
                    <h3 style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>Items Purchased</h3>
                    <div style={{ background: "white", border: "1px solid rgba(0,0,0,0.08)", borderRadius: "var(--radius-sm)", padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
                      {selectedOrder.items.map((item: string, idx: number) => (
                        <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
                          <span style={{ color: "var(--color-text-inverse)" }}>{item}</span>
                          <span style={{ fontWeight: 600, color: "var(--color-text-secondary)" }}>1x</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment and shipping */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div>
                      <h3 style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-inverse)", opacity: 0.7, marginBottom: 4, textTransform: "uppercase" }}>Payment</h3>
                      <p style={{ fontSize: 13, color: "var(--color-text-secondary)", fontWeight: 500 }}>{selectedOrder.paymentMethod}</p>
                    </div>
                    <div>
                      <h3 style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-inverse)", opacity: 0.7, marginBottom: 4, textTransform: "uppercase" }}>Total Price</h3>
                      <p style={{ fontSize: 15, color: "var(--color-surface-raised)", fontWeight: 700 }}>${selectedOrder.total.toFixed(2)}</p>
                    </div>
                  </div>

                  <div>
                    <h3 style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-inverse)", opacity: 0.7, marginBottom: 4, textTransform: "uppercase" }}>Delivery Address</h3>
                    <p style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.45 }}>{selectedOrder.address}</p>
                  </div>

                  <div style={{ borderTop: "1px solid rgba(0,0,0,0.08)", paddingTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <h3 style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-inverse)", opacity: 0.7, marginBottom: 2, textTransform: "uppercase" }}>Est. Delivery</h3>
                      <p style={{ fontSize: 13, color: "var(--color-text-secondary)", fontWeight: 500 }}>{selectedOrder.deliveryDate}</p>
                    </div>
                    <span className="badge" style={{ 
                      background: selectedOrder.status === "Delivered" ? "rgba(22, 163, 74, 0.12)" : "rgba(220, 38, 38, 0.12)", 
                      color: selectedOrder.status === "Delivered" ? "#16a34a" : "#dc2626" 
                    }}>
                      {selectedOrder.status}
                    </span>
                  </div>

                  <button 
                    onClick={() => { setOrderModalOpen(false); triggerRef.current?.focus(); }}
                    className="green-btn" 
                    style={{ width: "100%", justifyContent: "center", marginTop: 6 }}
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MODAL C: DANGER ZONE CONFIRMATION */}
          {dangerModalOpen && (
            <div 
              role="dialog" 
              aria-modal="true" 
              aria-labelledby="modal-danger-heading" 
              style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300, padding: 16 }}
            >
              <div 
                ref={modalRef}
                style={{ background: "var(--color-surface-strong)", borderRadius: "var(--radius-xl)", padding: 32, maxWidth: 450, width: "100%", boxShadow: "var(--modal-shadow)", position: "relative", animation: "scaleIn var(--motion-duration-fast) ease" }}
              >
                <h2 id="modal-danger-heading" style={{ fontWeight: 700, fontSize: 18, color: "var(--profile-danger-text)", marginBottom: 12 }}>
                  {dangerType === "export" ? "Confirm Data Export" : "Confirm Account Reset"}
                </h2>
                <p style={{ fontSize: 13, color: "var(--color-text-inverse)", opacity: 0.8, lineHeight: 1.5, marginBottom: 20 }}>
                  {dangerType === "export" 
                    ? "We will compile all your account details, plant history, saved cards, and transaction records and email them to you. Do you wish to continue?"
                    : "This action will clear all your local customizations (my plants list, billing credentials, name changes) and revert back to standard mock values. This cannot be undone."}
                </p>

                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                  <button onClick={() => { setDangerModalOpen(false); triggerRef.current?.focus(); }} className="outline-btn">Cancel</button>
                  <button 
                    onClick={executeDangerAction} 
                    className="green-btn" 
                    style={{ background: dangerType === "delete" ? "var(--profile-danger-text)" : "var(--color-surface-raised)" }}
                  >
                    {dangerType === "export" ? "Export Data" : "Yes, Reset Data"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ────────────────────────────────────────────────────────
             TOAST NOTIFICATION STACK (§3.13)
             ──────────────────────────────────────────────────────── */}
          <div 
            style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", gap: 8, zIndex: 400 }}
            aria-live="polite"
            role="status"
          >
            {toasts.map(toast => (
              <div
                key={toast.id}
                style={{
                  background: "var(--color-text-secondary)",
                  color: "var(--color-text-tertiary)",
                  fontSize: 13,
                  fontWeight: 500,
                  borderRadius: "var(--radius-md)",
                  padding: "10px 20px",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.18)",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  borderLeft: toast.type === "success" 
                    ? "4px solid var(--color-surface-raised)" 
                    : toast.type === "error" 
                      ? "4px solid var(--profile-danger-text)" 
                      : "4px solid rgba(0,181,102,0.6)",
                  animation: "fadeUp var(--motion-duration-fast) ease both"
                }}
              >
                <span>{toast.type === "success" ? "✓" : toast.type === "error" ? "✕" : "ℹ"}</span>
                {toast.text}
              </div>
            ))}
          </div>

          {/* ────────────────────────────────────────────────────────
             TOAST ALERT FOR LIVE UPDATES
             ──────────────────────────────────────────────────────── */}

          {/* ────────────────────────────────────────────────────────
             WHATSAPP FLOATING ACTION BUTTON (§3.15)
             ──────────────────────────────────────────────────────── */}
          <Link
            href="https://api.whatsapp.com/send?phone=919876543210"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with us on WhatsApp"
            style={{
              position: "fixed",
              bottom: 24,
              right: 24,
              width: 56,
              height: 56,
              borderRadius: "var(--radius-step7)",
              background: "#25D366",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "var(--fab-shadow)",
              zIndex: 200,
              cursor: "pointer",
              transition: "transform var(--motion-duration-instant) ease, box-shadow var(--motion-duration-instant) ease"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "scale(1.08)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <svg width="28" height="28" viewBox="0 0 448 512" fill="white" aria-hidden="true">
              <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
            </svg>
          </Link>
          
        </main>
      )}
    </div>
  );
}
