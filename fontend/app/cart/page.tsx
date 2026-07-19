"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import SharedNavbar from "@/components/Navbar";
import { useCart } from "@/features/cart/hooks/useCart";
import { useAuthStore } from "@/store/auth.store";
import { useCheckoutStore } from "@/store/checkout.store";

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
  blue: "#2563eb",
  shadow: "0 4px 20px rgba(0,0,0,0.04)",
  shadowHover: "0 8px 30px rgba(0, 181, 102, 0.08)",
  shadowBtn: "0 4px 14px rgba(0, 181, 102, 0.25)",
};

interface CartItem {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  img: string;
  options: string;
}

export default function CartPage() {
  const {
    cart,
    isLoading,
    updateItem,
    removeItem,
    applyDiscount,
    removeDiscount,
  } = useCart();

  const { isAuthenticated } = useAuthStore();

  const [promoInput, setPromoInput] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<{
    code: string;
    discount_type: "percentage" | "fixed";
    value: number;
  } | null>(null);

  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleUpdateQuantity = (itemId: number, currentQty: number, delta: number) => {
    const newQty = currentQty + delta;
    if (newQty <= 0) {
      removeItem(String(itemId));
    } else {
      updateItem({ itemId: String(itemId), quantity: newQty });
    }
  };

  const handleRemoveItem = (itemId: number) => {
    removeItem(String(itemId));
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError("");
    setPromoSuccess("");

    if (!promoInput.trim()) {
      setPromoError("Please enter a coupon code.");
      return;
    }

    applyDiscount(promoInput.trim(), {
      onSuccess: (data: any) => {
        setAppliedDiscount({
          code: data.code,
          discount_type: data.discount_type,
          value: Number(data.value),
        });
        setPromoSuccess(`Coupon "${data.code}" applied!`);
      },
      onError: (err: any) => {
        const detail = err?.response?.data?.detail || "Invalid or expired discount code.";
        setPromoError(detail);
        setAppliedDiscount(null);
      }
    });
  };

  const handleRemovePromo = () => {
    removeDiscount(undefined, {
      onSuccess: () => {
        setAppliedDiscount(null);
        setPromoInput("");
        setPromoSuccess("");
        setPromoError("");
      }
    });
  };

  // Map API response items to the UI layout
  const cartItems: CartItem[] = (cart?.items ?? []).map((item: any) => ({
    id: item.id,
    name: item.product_title || "Product",
    category: "Storefront Item",
    price: Number(item.price_at_add),
    quantity: item.quantity,
    img: item.image_url || "/placeholder-plant.jpg",
    options: item.variant_title || "Standard size",
  }));

  // Calculations
  const subtotal = Number(cart?.subtotal ?? 0);
  
  let discountAmount = 0;
  if (appliedDiscount) {
    if (appliedDiscount.discount_type === "percentage") {
      discountAmount = (subtotal * appliedDiscount.value) / 100;
    } else {
      discountAmount = appliedDiscount.value;
    }
  }

  const postDiscountSubtotal = Math.max(0, subtotal - discountAmount);
  // Free shipping over ₹500, otherwise ₹49 shipping fee
  const shippingFee = postDiscountSubtotal >= 500 || cartItems.length === 0 ? 0 : 49;
  // Tax 8%
  const taxAmount = postDiscountSubtotal * 0.08;
  const total = postDiscountSubtotal + shippingFee + taxAmount;
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  if (!mounted) return null;

  if (!isAuthenticated) {
    return (
      <>
        <SharedNavbar />
        <div style={{ background: T.bg, minHeight: "100vh", fontFamily: "Outfit, sans-serif", paddingTop: "64px" }}>
          <div className="scale-in" style={{ background: T.bgCard, borderRadius: 24, border: `1px solid ${T.border}`, padding: "80px 24px", textAlign: "center", boxShadow: T.shadow, maxWidth: 600, margin: "80px auto 0" }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: T.greenPale, color: T.green, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 36 }}>
              🔐
            </div>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 22, color: T.heading, marginBottom: 8 }}>
              Please log in
            </h2>
            <p style={{ fontSize: 14, color: T.muted, maxWidth: 320, margin: "0 auto 24px", lineHeight: 1.5 }}>
              You need to log in to view your shopping cart and complete your purchase.
            </p>
            <Link href="/login?returnTo=/cart" className="green-btn" style={{ textDecoration: "none" }}>
              Log In to View Cart
            </Link>
          </div>
        </div>
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <SharedNavbar />
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", fontFamily: "Outfit, sans-serif", fontSize: 16 }}>
          Loading your cart...
        </div>
      </>
    );
  }

  return (
    <div style={{ background: T.bg, minHeight: "100vh", fontFamily: "Outfit, sans-serif", paddingTop: "64px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,700;1,400;1,700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; color: inherit; }
        img { max-width: 100%; display: block; }
        button { cursor: pointer; }

        @keyframes fadeUp   { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes scaleIn  { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }
        @keyframes slideLeft{ from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }

        .fade-up { animation: fadeUp .5s ease both; }
        .scale-in { animation: scaleIn .4s ease both; }
        .slide-left { animation: slideLeft .5s ease both; }

        .cart-item-row {
          background: ${T.bgCard};
          border-radius: 16px;
          padding: 20px;
          border: 1px solid ${T.border};
          display: flex;
          gap: 20px;
          align-items: center;
          transition: all 0.2s ease;
        }
        .cart-item-row:hover {
          box-shadow: ${T.shadowHover};
          border-color: ${T.greenPale};
        }

        .summary-card {
          background: ${T.bgCard};
          border-radius: 18px;
          padding: 24px;
          border: 1px solid ${T.border};
          box-shadow: ${T.shadow};
        }

        .qty-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid ${T.border};
          background: ${T.white};
          color: ${T.heading};
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: 600;
          transition: all 0.15s ease;
          cursor: pointer;
        }
        .qty-btn:hover {
          border-color: ${T.green};
          color: ${T.green};
          background: ${T.greenLight};
        }

        .remove-btn {
          background: transparent;
          border: none;
          color: ${T.muted};
          transition: color 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
          border-radius: 50%;
          cursor: pointer;
        }
        .remove-btn:hover {
          color: ${T.red};
          background: rgba(220, 38, 38, 0.06);
        }

        .promo-input {
          flex: 1;
          border: 1.5px solid ${T.border};
          border-radius: 10px;
          padding: 10px 14px;
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          outline: none;
          background: ${T.bgMuted};
          transition: border-color 0.18s ease, background-color 0.18s ease;
        }
        .promo-input:focus {
          border-color: ${T.green};
          background: ${T.white};
        }

        .green-btn {
          background: ${T.green};
          color: white;
          border: none;
          border-radius: 99px;
          font-family: 'Outfit', sans-serif;
          font-weight: 600;
          font-size: 14px;
          padding: 10px 24px;
          cursor: pointer;
          transition: all 0.18s ease;
          box-shadow: ${T.shadowBtn};
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .green-btn:hover {
          background: ${T.greenMid};
          transform: scale(1.02);
        }

        .outline-btn {
          background: transparent;
          color: ${T.body};
          border: 1.5px solid ${T.border};
          border-radius: 99px;
          font-family: 'Outfit', sans-serif;
          font-weight: 500;
          font-size: 14px;
          padding: 9px 20px;
          cursor: pointer;
          transition: all 0.18s ease;
        }
        .outline-btn:hover {
          border-color: ${T.green};
          color: ${T.green};
          background: ${T.greenLight};
        }

        @media (max-width: 992px) {
          .cart-layout {
            flex-direction: column !important;
          }
          .summary-col {
            width: 100% !important;
            position: static !important;
          }
        }
        @media (max-width: 600px) {
          .cart-item-row {
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
            gap: 14px !important;
            position: relative;
          }
          .item-image-container {
            width: 120px !important;
            height: 120px !important;
            margin: 0 auto !important;
          }
          .qty-actions-row {
            width: 100% !important;
            justify-content: space-between !important;
            margin-top: 6px;
          }
          .remove-btn-container {
            position: absolute;
            top: 12px;
            right: 12px;
          }
        }
        @media (max-width: 480px) {
          .cart-main-container {
            padding: 24px 16px !important;
          }
          .cart-title {
            font-size: 28px !important;
            margin-bottom: 20px !important;
          }
        }
      `}</style>

      {/* Navbar header */}
      <SharedNavbar />

      {/* Main Content */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px" }} className="cart-main-container fade-up">
        
        {/* Title */}
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 700, fontSize: 36, color: T.heading, marginBottom: 28 }} className="cart-title">
          Shopping Cart
        </h1>

        {cartItems.length > 0 ? (
          <div className="cart-layout" style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
            
            {/* Left Column: Cart items */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
              {cartItems.map(item => (
                <div key={item.id} className="cart-item-row scale-in">
                  
                  {/* Item Image */}
                  <div className="item-image-container" style={{ width: 100, height: 100, borderRadius: 12, overflow: "hidden", background: T.bgMuted, position: "relative", flexShrink: 0 }}>
                    <img src={item.img} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>

                  {/* Item Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 11, fontWeight: 600, color: T.green, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 3 }}>
                      {item.category}
                    </p>
                    <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 16, color: T.heading, marginBottom: 4 }}>
                      {item.name}
                    </h3>
                    <p style={{ fontSize: 13, color: T.muted }}>
                      {item.options}
                    </p>
                  </div>

                  {/* Quantity controls and price */}
                  <div className="qty-actions-row" style={{ display: "flex", alignItems: "center", gap: 24, flexShrink: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <button className="qty-btn" aria-label="Decrease quantity" onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}>-</button>
                      <span style={{ fontSize: 15, fontWeight: 600, width: 20, textAlign: "center" }}>{item.quantity}</span>
                      <button className="qty-btn" aria-label="Increase quantity" onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}>+</button>
                    </div>

                    <div style={{ minWidth: 100, textAlign: "right" }}>
                      <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 17, color: T.heading }}>
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </p>
                      {item.quantity > 1 && (
                        <p style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>
                          ₹{item.price.toLocaleString("en-IN")} each
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Remove Button */}
                  <div className="remove-btn-container" style={{ flexShrink: 0 }}>
                    <button className="remove-btn" aria-label="Remove item" onClick={() => handleRemoveItem(item.id)}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>

                </div>
              ))}

              {/* Back to shopping */}
              <div style={{ marginTop: 8 }}>
                <Link href="/categories/plants" className="outline-btn" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  ← Continue Shopping
                </Link>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="summary-col slide-left" style={{ width: 380, flexShrink: 0, position: "sticky", top: 84 }}>
              <div className="summary-card">
                <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 18, color: T.heading, marginBottom: 20 }}>
                  Order Summary
                </h2>

                {/* Promo Code Form */}
                <form onSubmit={handleApplyPromo} style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                  <input
                    className="promo-input"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Promo Code"
                    aria-label="Promo Code"
                    disabled={!!appliedDiscount}
                  />
                  {appliedDiscount ? (
                    <button type="button" className="outline-btn" onClick={handleRemovePromo} style={{ padding: "10px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600, color: T.red, borderColor: T.red }}>
                      Remove
                    </button>
                  ) : (
                    <button type="submit" className="outline-btn" style={{ padding: "10px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600 }}>
                      Apply
                    </button>
                  )}
                </form>
                {promoError && <p style={{ fontSize: 12, color: T.red, marginTop: -14, marginBottom: 16 }}>{promoError}</p>}
                {promoSuccess && <p style={{ fontSize: 12, color: T.green, marginTop: -14, marginBottom: 16 }}>{promoSuccess}</p>}

                {/* Subtotals */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12, borderBottom: `1px solid ${T.border}`, paddingBottom: 16, marginBottom: 16 }}>
                  
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: T.body }}>
                    <span>Subtotal</span>
                    <span style={{ fontWeight: 500 }}>₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: T.green }}>
                      <span>Discount ({appliedDiscount?.code})</span>
                      <span style={{ fontWeight: 500 }}>-₹{discountAmount.toLocaleString("en-IN")}</span>
                    </div>
                  )}

                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: T.body }}>
                    <span>Shipping</span>
                    <span style={{ fontWeight: 500 }}>
                      {shippingFee === 0 ? (
                        <span style={{ color: T.green }}>Free</span>
                      ) : (
                        `₹${shippingFee.toLocaleString("en-IN")}`
                      )}
                    </span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: T.body }}>
                    <span>Estimated Tax (8%)</span>
                    <span style={{ fontWeight: 500 }}>₹{taxAmount.toLocaleString("en-IN")}</span>
                  </div>

                </div>

                {/* Final Total */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: T.heading }}>Total</span>
                  <span style={{ fontSize: 22, fontWeight: 800, color: T.heading }}>₹{total.toLocaleString("en-IN")}</span>
                </div>

                {/* Checkout buttons */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <Link href="/checkout" onClick={() => useCheckoutStore.getState().clearBuyNowItem()} className="green-btn" style={{ justifyContent: "center", width: "100%", padding: "14px 28px", fontSize: 15, textDecoration: "none" }}>
                    Proceed to Checkout
                  </Link>
                  
                  {/* Secure checkout info */}
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 6, fontSize: 11, color: T.muted, marginTop: 4 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                    <span>SSL Encrypted Secure Checkout</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        ) : (
          /* Empty state */
          <div className="scale-in" style={{ background: T.bgCard, borderRadius: 24, border: `1px solid ${T.border}`, padding: "80px 24px", textAlign: "center", boxShadow: T.shadow, maxWidth: 600, margin: "40px auto 0" }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: T.greenPale, color: T.green, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 36 }}>
              🛒
            </div>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 22, color: T.heading, marginBottom: 8 }}>
              Your cart is empty
            </h2>
            <p style={{ fontSize: 14, color: T.muted, maxWidth: 320, margin: "0 auto 24px", lineHeight: 1.5 }}>
              Add some green friends, organic seeds, or expert tools to your space to get started.
            </p>
            <Link href="/categories/plants" className="green-btn" style={{ textDecoration: "none" }}>
              Explore Shop
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
