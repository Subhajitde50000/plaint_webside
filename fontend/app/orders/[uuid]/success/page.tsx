"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import SharedNavbar from "@/components/Navbar";
import { useOrder } from "@/features/orders/hooks/useOrder";

/* ── Design tokens ────────────────────────────────────────────────────── */
const T = {
  bg:          "#fefcf9",
  bgCard:      "#ffffff",
  bgMuted:     "#f7f5f0",
  green:       "#00b566",
  greenMid:    "#009952",
  greenPale:   "rgba(0,181,102,0.10)",
  greenBorder: "rgba(0,181,102,0.20)",
  heading:     "#1c1c1c",
  body:        "#333333",
  muted:       "#7c7c7c",
  border:      "rgba(0,0,0,0.07)",
  shadow:      "0 4px 20px rgba(0,0,0,0.06)",
  radius:      "20px",
  radiusSm:    "12px",
};

/* ── Confetti ─────────────────────────────────────────────────────────── */
const CONFETTI_COLORS = ["#00b566", "#40c985", "#fbbf24", "#a78bfa", "#f472b6", "#38bdf8", "#fb923c"];

interface Particle {
  id: number; x: number; y: number; color: string;
  size: number; speed: number; angle: number; spin: number; opacity: number;
}

function Confetti() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const frameRef = useRef<number>(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const newParticles: Particle[] = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      size: 6 + Math.random() * 8,
      speed: 0.4 + Math.random() * 0.8,
      angle: Math.random() * 360,
      spin: (Math.random() - 0.5) * 4,
      opacity: 1,
    }));
    setParticles(newParticles);

    const tick = () => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            y: p.y + p.speed,
            x: p.x + Math.sin(p.y / 20) * 0.4,
            angle: p.angle + p.spin,
            opacity: p.y > 70 ? Math.max(0, p.opacity - 0.02) : p.opacity,
          }))
          .filter((p) => p.opacity > 0)
      );
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size * 0.5,
            background: p.color,
            borderRadius: 2,
            opacity: p.opacity,
            transform: `rotate(${p.angle}deg)`,
          }}
        />
      ))}
    </div>
  );
}

/* ── Price formatter ────────────────────────────────────────────────────── */
function formatPrice(val: string | number) {
  return `₹${parseFloat(String(val)).toLocaleString("en-IN", {
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  })}`;
}

/* ── Main Page ──────────────────────────────────────────────────────────── */
export default function OrderSuccessPage() {
  const params = useParams();
  const orderUuid = params?.uuid as string;
  const { order, isLoading } = useOrder(orderUuid);
  const [mounted, setMounted] = useState(false);
  const orderItems = Array.isArray(order?.items) ? order.items : [];

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);
  }, []);

  const isCod = (order as any)?.payment_gateway === "cod";

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'Outfit', 'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        @keyframes popIn {
          0% { transform: scale(0.6) translateY(20px); opacity: 0; }
          70% { transform: scale(1.05) translateY(-4px); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2.2); opacity: 0; }
        }
      `}</style>

      <Confetti />
      <SharedNavbar />

      <div style={{
        maxWidth: 520, margin: "0 auto", padding: "48px 16px 80px",
        position: "relative", zIndex: 1,
      }}>
        {/* Success card */}
        <div style={{
          background: T.bgCard, borderRadius: T.radius,
          border: `1.5px solid ${T.greenBorder}`,
          boxShadow: "0 12px 48px rgba(0,181,102,0.12)",
          padding: "40px 32px",
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
          textAlign: "center",
        }}>
          {/* Icon */}
          <div style={{ position: "relative", display: "inline-block", marginBottom: 24 }}>
            <div style={{
              position: "absolute", inset: -8, borderRadius: "50%",
              border: `2px solid ${T.green}`,
              animation: "pulse-ring 1.6s ease-out infinite",
            }} />
            <div style={{
              position: "absolute", inset: -8, borderRadius: "50%",
              border: `2px solid ${T.green}`,
              animation: "pulse-ring 1.6s ease-out 0.4s infinite",
            }} />
            <div style={{
              width: 80, height: 80, borderRadius: "50%",
              background: `linear-gradient(135deg, ${T.green}, ${T.greenMid})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 36, boxShadow: "0 8px 24px rgba(0,181,102,0.35)",
              animation: "popIn 0.6s cubic-bezier(0.34,1.56,0.64,1) both",
            }}>
              ✓
            </div>
          </div>

          <h1 style={{
            fontSize: 26, fontWeight: 800, color: T.heading,
            margin: "0 0 8px", letterSpacing: "-0.03em",
            animation: "fadeUp 0.5s 0.2s ease both",
          }}>
            Order Confirmed! 🎉
          </h1>
          <p style={{
            fontSize: 15, color: T.muted, margin: "0 0 28px",
            lineHeight: 1.6, animation: "fadeUp 0.5s 0.3s ease both",
          }}>
            {isCod
              ? "Your order is placed! Pay in cash or UPI when your delivery arrives."
              : "Thank you for your purchase. Your green companions are being prepared with love."}
          </p>

          {/* Order number */}
          {isLoading ? (
            <div style={{
              height: 54, background: T.bgMuted, borderRadius: T.radiusSm,
              marginBottom: 24,
            }} />
          ) : order ? (
            <div style={{
              background: T.greenPale, border: `1.5px solid ${T.greenBorder}`,
              borderRadius: T.radiusSm, padding: "14px 20px", marginBottom: 24,
              animation: "fadeUp 0.5s 0.4s ease both",
            }}>
              <div style={{ fontSize: 12, color: T.muted, marginBottom: 4, fontWeight: 600, letterSpacing: "0.04em" }}>
                ORDER NUMBER
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: T.green, letterSpacing: "-0.01em" }}>
                #{order.order_number}
              </div>
            </div>
          ) : null}

          {/* Order summary */}
          {order && (
            <div style={{
              background: T.bgMuted, borderRadius: T.radiusSm,
              padding: "16px 20px", marginBottom: 28, textAlign: "left",
              animation: "fadeUp 0.5s 0.5s ease both",
            }}>
              {/* Items */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
                {orderItems.slice(0, 3).map((item, idx) => (
                  <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                    <span style={{ color: T.body, fontWeight: 600 }}>
                      {item.title} {item.variant_title ? `(${item.variant_title})` : ""}
                      <span style={{ color: T.muted, fontWeight: 400 }}> × {item.quantity}</span>
                    </span>
                    <span style={{ color: T.heading, fontWeight: 700 }}>
                      {formatPrice(item.total_price)}
                    </span>
                  </div>
                ))}
                {orderItems.length > 3 && (
                  <div style={{ fontSize: 12, color: T.muted }}>
                    +{orderItems.length - 3} more item{orderItems.length - 3 !== 1 ? "s" : ""}
                  </div>
                )}
              </div>

              {/* Total */}
              <div style={{
                display: "flex", justifyContent: "space-between",
                paddingTop: 12, borderTop: `1px solid ${T.border}`,
                fontSize: 15, fontWeight: 800, color: T.heading,
              }}>
                <span>{isCod ? "💵 Pay on delivery (COD)" : "Total paid"}</span>
                <span style={{ color: T.green }}>{formatPrice(order.total)}</span>
              </div>

              {/* Delivery estimate */}
              {order.estimated_delivery && (
                <div style={{
                  marginTop: 12, paddingTop: 12, borderTop: `1px solid ${T.border}`,
                  fontSize: 13, color: T.muted, display: "flex", alignItems: "center", gap: 6,
                }}>
                  🚚 Estimated delivery:
                  <span style={{ color: T.body, fontWeight: 700 }}>
                    {new Date(order.estimated_delivery).toLocaleDateString("en-IN", {
                      day: "2-digit", month: "short", year: "numeric",
                    })}
                  </span>
                </div>
              )}

              {/* COD reminder */}
              {isCod && (
                <div style={{
                  marginTop: 12, paddingTop: 12, borderTop: `1px solid ${T.border}`,
                  fontSize: 12, color: T.greenMid, fontWeight: 600,
                  background: T.greenPale, borderRadius: 8, padding: "10px 12px",
                }}>
                  💡 Keep exact change of {formatPrice(order.total)} ready for the delivery agent.
                </div>
              )}
            </div>
          )}

          {/* CTAs */}
          <div style={{
            display: "flex", flexDirection: "column", gap: 10,
            animation: "fadeUp 0.5s 0.6s ease both",
          }}>
            <Link
              href={`/orders/${orderUuid}`}
              id="btn-view-order"
              style={{
                display: "block", padding: "14px 24px", borderRadius: 12,
                background: `linear-gradient(135deg, ${T.green}, ${T.greenMid})`,
                color: "#fff", fontWeight: 700, fontSize: 15, textDecoration: "none",
                boxShadow: "0 6px 18px rgba(0,181,102,0.32)",
                transition: "transform 0.15s, box-shadow 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 10px 24px rgba(0,181,102,0.40)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 6px 18px rgba(0,181,102,0.32)";
              }}
            >
              View Order Details →
            </Link>
            <Link
              href="/"
              id="btn-continue-shopping-success"
              style={{
                display: "block", padding: "13px 24px", borderRadius: 12,
                border: `1.5px solid ${T.border}`, background: T.bgCard,
                color: T.body, fontWeight: 600, fontSize: 15, textDecoration: "none",
                transition: "border-color 0.15s, background 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = T.greenBorder;
                (e.currentTarget as HTMLAnchorElement).style.background = T.greenPale;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = T.border;
                (e.currentTarget as HTMLAnchorElement).style.background = T.bgCard;
              }}
            >
              Continue Shopping 🌱
            </Link>
          </div>
        </div>

        {/* Footer note */}
        <p style={{
          textAlign: "center", fontSize: 13, color: T.muted, marginTop: 24,
          animation: "fadeUp 0.5s 0.8s ease both", lineHeight: 1.5,
        }}>
          {isCod
            ? "You can track your order anytime from "
            : "A confirmation email has been sent. You can track your order anytime from "}
          <Link href="/orders" style={{ color: T.green, textDecoration: "none", fontWeight: 600 }}>
            My Orders
          </Link>.
        </p>
      </div>
    </div>
  );
}
