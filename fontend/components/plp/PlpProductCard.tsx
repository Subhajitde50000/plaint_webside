"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import type { PlantProduct, PlantSize } from "@/lib/plp-data";

/* ── Icons ─────────────────────────────────────────── */
function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        fill={filled ? "#e74c3c" : "none"}
        stroke={filled ? "#e74c3c" : "rgba(33,35,38,0.6)"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StarFilled() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24">
      <polygon
        points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
        fill="#c8a84b"
        stroke="#c8a84b"
        strokeWidth="1"
      />
    </svg>
  );
}

function StarEmpty() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24">
      <polygon
        points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
        fill="none"
        stroke="rgba(28,28,28,0.20)"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2.5"
      style={{ animation: "plpSpin 0.7s linear infinite" }}
    >
      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
    </svg>
  );
}

/* ── Star rating row ──────────────────────────────── */
function StarRow({ rating, count }: { rating: number; count: number }) {
  const full = Math.floor(rating);
  return (
    <span
      style={{ display: "flex", alignItems: "center", gap: "3px" }}
      aria-label={`${rating} out of 5 stars, ${count.toLocaleString()} reviews`}
    >
      {[1, 2, 3, 4, 5].map((i) =>
        i <= full ? <StarFilled key={i} /> : <StarEmpty key={i} />
      )}
      <span
        style={{
          fontFamily: "Outfit, sans-serif",
          fontSize: "11px",
          fontWeight: 600,
          color: "#1c1c1c",
          marginLeft: "1px",
        }}
      >
        {rating.toFixed(1)}
      </span>
      <span
        style={{
          fontFamily: "Outfit, sans-serif",
          fontSize: "11px",
          fontWeight: 400,
          color: "rgba(33,35,38,0.50)",
        }}
      >
        ({count.toLocaleString()})
      </span>
    </span>
  );
}

/* ── Leaf placeholder SVG ──────────────────────────── */
function LeafPlaceholder() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,181,102,0.08)",
      }}
    >
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2C12 2 4 5 4 13C4 17.4 7.6 21 12 21C16.4 21 20 17.4 20 13C20 5 12 2 12 2Z"
          fill="rgba(0,181,102,0.35)"
        />
        <path
          d="M12 21V10"
          stroke="rgba(0,181,102,0.6)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

/* ── Main card ─────────────────────────────────────── */
interface PlpProductCardProps {
  product: PlantProduct;
  viewMode: "grid" | "list";
  priority?: boolean; // true for first 4 above-fold cards
}

export default function PlpProductCard({
  product,
  viewMode,
  priority = false,
}: PlpProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [selectedSize, setSelectedSize] = useState<PlantSize | null>(
    product.sizes[0] ?? null
  );
  const [cartState, setCartState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const isSoldOut = product.stockCount === 0;
  const isLowStock = product.stockCount > 0 && product.stockCount <= 5;

  const handleAddToCart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (isSoldOut || cartState !== "idle") return;
      setCartState("loading");
      setTimeout(() => {
        setCartState("success");
        setTimeout(() => setCartState("idle"), 1500);
      }, 900);
    },
    [isSoldOut, cartState]
  );

  const handleWishlist = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlisted((v) => !v);
  }, []);

  const handleNotifyMe = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    alert(`We'll notify you when ${product.name} is back in stock!`);
  }, [product.name]);

  const sizesToShow = product.sizes.slice(0, 4);
  const extraSizes = product.sizes.length > 4 ? product.sizes.length - 4 : 0;

  /* ── List view ─────────────────────────────────── */
  if (viewMode === "list") {
    return (
      <li
        role="listitem"
        style={{
          position: "relative",
          display: "flex",
          gap: "0",
          background: "#fefcf9",
          border: "1px solid rgb(202,223,212)",
          borderRadius: "12px",
          overflow: "hidden",
          height: "200px",
          cursor: "pointer",
          transition: "box-shadow 250ms ease, transform 250ms ease",
          boxShadow: "none",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLLIElement).style.boxShadow =
            "0 8px 28px rgba(0,181,102,0.14)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLLIElement).style.boxShadow = "none";
        }}
      >
        {/* Image */}
        <div
          style={{
            width: "200px",
            minWidth: "200px",
            height: "200px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {imgError ? (
            <LeafPlaceholder />
          ) : (
            <img
              src={product.primaryImage}
              alt={`${product.name} — ${selectedSize} — green`}
              onError={() => setImgError(true)}
              loading={priority ? "eager" : "lazy"}
              decoding="async"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          )}
          {/* Discount badge */}
          {product.discount >= 10 && (
            <span
              aria-label={`${product.discount}% off`}
              style={{
                position: "absolute",
                top: "8px",
                left: "8px",
                background: "#00b566",
                color: "white",
                fontSize: "11px",
                fontWeight: 700,
                padding: "4px 6px",
                borderRadius: "4px",
              }}
            >
              -{product.discount}%
            </span>
          )}
          {product.discount < 10 && product.isNew && (
            <span
              style={{
                position: "absolute",
                top: "8px",
                left: "8px",
                background: "#212326",
                color: "white",
                fontSize: "11px",
                fontWeight: 700,
                padding: "4px 6px",
                borderRadius: "4px",
              }}
            >
              NEW
            </span>
          )}
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <Link
              href={`/plants/${product.slug}`}
              aria-label={`View ${product.name}`}
              style={{
                display: "block",
                fontFamily: "Outfit, sans-serif",
                fontSize: "16px",
                fontWeight: 600,
                color: "#1c1c1c",
                textDecoration: "none",
                marginBottom: "3px",
              }}
            >
              {product.name}
            </Link>
            <p
              style={{
                fontFamily: "Outfit, sans-serif",
                fontSize: "12px",
                color: "rgba(33,35,38,0.55)",
                marginBottom: "5px",
              }}
            >
              {product.secondaryName}
            </p>
            {product.reviewCount > 0 && (
              <StarRow rating={product.rating} count={product.reviewCount} />
            )}
            <p
              style={{
                fontFamily: "Outfit, sans-serif",
                fontSize: "12px",
                color: "rgba(33,35,38,0.70)",
                marginTop: "8px",
              }}
            >
              ✓ In Stock · Ships in 2–3 days
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {/* Price */}
            <div style={{ display: "flex", alignItems: "baseline", gap: "5px" }}>
              <span style={{ fontFamily: "Outfit, sans-serif", fontSize: "15px", fontWeight: 700, color: "#1c1c1c" }}>
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <>
                  <span style={{ fontFamily: "Outfit, sans-serif", fontSize: "12px", color: "rgba(33,35,38,0.45)", textDecoration: "line-through" }}>
                    ₹{product.originalPrice}
                  </span>
                  <span style={{ fontFamily: "Outfit, sans-serif", fontSize: "11px", fontWeight: 600, color: "#00b566" }}>
                    -{product.discount}% off
                  </span>
                </>
              )}
            </div>
            {/* CTA */}
            <button
              onClick={handleAddToCart}
              aria-label={`Add ${product.name} to cart`}
              aria-busy={cartState === "loading"}
              style={{
                height: "44px",
                padding: "0 24px",
                borderRadius: "9999px",
                border: "none",
                background: "#00b566",
                color: "white",
                fontFamily: "Outfit, sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                transition: "background 200ms",
              }}
            >
              {cartState === "loading" ? (
                <SpinnerIcon />
              ) : cartState === "success" ? (
                "✓ Added"
              ) : (
                <>
                  <PlusIcon />
                  Add to Cart
                </>
              )}
            </button>
          </div>
        </div>

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          aria-pressed={wishlisted}
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            width: "36px",
            height: "36px",
            borderRadius: "50px",
            background: "rgba(254,252,249,0.9)",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "transform 200ms",
            outline: "none",
          }}
          onFocus={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.outline =
              "2px solid #00b566")
          }
          onBlur={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.outline = "none")
          }
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.transform =
              "scale(1.1)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.transform =
              "scale(1)")
          }
        >
          <HeartIcon filled={wishlisted} />
        </button>
      </li>
    );
  }

  /* ── Grid view ─────────────────────────────────── */
  return (
    <>
      <li
        role="listitem"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        style={{
          position: "relative",
          background: "#fefcf9",
          border: hovering ? "1px solid #00b566" : "1px solid rgb(202,223,212)",
          borderRadius: "12px",
          overflow: "hidden",
          cursor: "pointer",
          transition: "box-shadow 250ms ease, transform 250ms ease, border-color 250ms",
          boxShadow: hovering ? "0 8px 28px rgba(0,181,102,0.14)" : "none",
          transform: hovering ? "translateY(-4px)" : "translateY(0)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Image area */}
        <div
          style={{
            position: "relative",
            aspectRatio: "1 / 1",
            overflow: "hidden",
            borderRadius: "12px 12px 0 0",
            background: "#fefcf9",
          }}
        >
          <Link
            href={`/plants/${product.slug}`}
            aria-label={`View ${product.name}`}
            tabIndex={-1}
            style={{ display: "block", width: "100%", height: "100%" }}
          >
            {imgError ? (
              <LeafPlaceholder />
            ) : (
              <img
                src={hovering && product.secondaryImage ? product.secondaryImage : product.primaryImage}
                alt={`${product.name} — ${selectedSize ?? ""} — green`}
                onError={() => setImgError(true)}
                loading={priority ? "eager" : "lazy"}
                decoding="async"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "opacity 250ms ease",
                }}
              />
            )}

            {/* Sold Out overlay */}
            {isSoldOut && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(33,35,38,0.40)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "12px 12px 0 0",
                }}
              >
                <span
                  style={{
                    fontFamily: "Outfit, sans-serif",
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "white",
                  }}
                >
                  Sold Out
                </span>
              </div>
            )}
          </Link>

          {/* Discount badge (top-left) */}
          {!isSoldOut && product.discount >= 10 && (
            <span
              aria-label={`${product.discount}% off`}
              style={{
                position: "absolute",
                top: "8px",
                left: "8px",
                background: "#00b566",
                color: "white",
                fontSize: "11px",
                fontWeight: 700,
                padding: "4px 6px",
                borderRadius: "4px",
                pointerEvents: "none",
              }}
            >
              -{product.discount}%
            </span>
          )}

          {/* New badge */}
          {!isSoldOut && product.discount < 10 && product.isNew && (
            <span
              style={{
                position: "absolute",
                top: "8px",
                left: "8px",
                background: "#212326",
                color: "white",
                fontSize: "11px",
                fontWeight: 700,
                padding: "4px 6px",
                borderRadius: "4px",
                pointerEvents: "none",
              }}
            >
              NEW
            </span>
          )}

          {/* Bottom-left badge: Low Stock / Bestseller */}
          {!isSoldOut && isLowStock && (
            <span
              aria-live="polite"
              style={{
                position: "absolute",
                bottom: "8px",
                left: "8px",
                background: "rgba(239,68,68,0.90)",
                color: "white",
                fontSize: "11px",
                fontWeight: 600,
                padding: "4px 6px",
                borderRadius: "4px",
                pointerEvents: "none",
              }}
            >
              Only {product.stockCount} left
            </span>
          )}
          {!isSoldOut && !isLowStock && product.badge === "bestseller" && (
            <span
              style={{
                position: "absolute",
                bottom: "8px",
                left: "8px",
                background: "rgba(0,0,0,0.70)",
                backdropFilter: "blur(4px)",
                color: "white",
                fontSize: "11px",
                fontWeight: 600,
                padding: "4px 6px",
                borderRadius: "4px",
                pointerEvents: "none",
              }}
            >
              Bestseller
            </span>
          )}

          {/* Wishlist button */}
          <button
            onClick={handleWishlist}
            aria-label={
              wishlisted
                ? `Remove ${product.name} from wishlist`
                : `Add ${product.name} to wishlist`
            }
            aria-pressed={wishlisted}
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              width: "36px",
              height: "36px",
              borderRadius: "50px",
              background: "rgba(254,252,249,0.90)",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "transform 200ms",
              outline: "none",
              zIndex: 2,
            }}
            onFocus={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.outline =
                "2px solid #00b566")
            }
            onBlur={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.outline = "none")
            }
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.transform =
                "scale(1.1)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.transform =
                "scale(1)")
            }
          >
            <HeartIcon filled={wishlisted} />
          </button>
        </div>

        {/* Content area */}
        <div
          style={{
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            flex: 1,
          }}
        >
          {/* Name */}
          <Link
            href={`/plants/${product.slug}`}
            aria-label={`View ${product.name}`}
            style={{
              fontFamily: "Outfit, sans-serif",
              fontSize: "16px",
              fontWeight: 600,
              color: hovering ? "#00b566" : "#1c1c1c",
              textDecoration: "none",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              marginTop: "0",
              lineHeight: 1.3,
              transition: "color 200ms",
            }}
          >
            {product.name}
          </Link>

          {/* Secondary name */}
          <p
            style={{
              fontFamily: "Outfit, sans-serif",
              fontSize: "12px",
              fontWeight: 400,
              color: "rgba(33,35,38,0.55)",
              marginTop: "3px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {product.secondaryName}
          </p>

          {/* Star rating */}
          {product.reviewCount > 0 && (
            <div style={{ marginTop: "5px" }}>
              <StarRow rating={product.rating} count={product.reviewCount} />
            </div>
          )}

          {/* Price row */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "5px",
              flexWrap: "wrap",
              marginTop: "6px",
            }}
          >
            <span
              style={{
                fontFamily: "Outfit, sans-serif",
                fontSize: "15px",
                fontWeight: 700,
                color: "#1c1c1c",
              }}
            >
              ₹{product.price}
            </span>
            {product.originalPrice && (
              <>
                <span
                  style={{
                    fontFamily: "Outfit, sans-serif",
                    fontSize: "12px",
                    fontWeight: 400,
                    color: "rgba(33,35,38,0.45)",
                    textDecoration: "line-through",
                  }}
                >
                  ₹{product.originalPrice}
                </span>
                <span
                  style={{
                    fontFamily: "Outfit, sans-serif",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#00b566",
                  }}
                >
                  -{product.discount}% off
                </span>
              </>
            )}
          </div>

          {/* Size chips */}
          {product.sizes.length > 1 && (
            <div
              role="radiogroup"
              aria-label="Select size"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                marginTop: "6px",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontFamily: "Outfit, sans-serif",
                  fontSize: "12px",
                  color: "rgba(33,35,38,0.55)",
                }}
              >
                Size:
              </span>
              {sizesToShow.map((s) => {
                const active = selectedSize === s;
                return (
                  <button
                    key={s}
                    role="radio"
                    aria-checked={active}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedSize(s);
                    }}
                    style={{
                      height: "28px",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      border: active ? "1px solid #00b566" : "1px solid rgb(212,212,212)",
                      background: "transparent",
                      fontFamily: "Outfit, sans-serif",
                      fontSize: "12px",
                      fontWeight: active ? 700 : 500,
                      color: active ? "#1c1c1c" : "rgba(33,35,38,0.75)",
                      cursor: "pointer",
                      transition: "all 200ms",
                      outline: "none",
                    }}
                    onFocus={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.outline =
                        "2px solid #00b566")
                    }
                    onBlur={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.outline =
                        "none")
                    }
                    onMouseEnter={(e) => {
                      if (!active)
                        (e.currentTarget as HTMLButtonElement).style.borderColor =
                          "#00b566";
                    }}
                    onMouseLeave={(e) => {
                      if (!active)
                        (e.currentTarget as HTMLButtonElement).style.borderColor =
                          "rgb(212,212,212)";
                    }}
                  >
                    {s}
                  </button>
                );
              })}
              {extraSizes > 0 && (
                <span
                  style={{
                    height: "28px",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    border: "1px solid rgb(212,212,212)",
                    fontFamily: "Outfit, sans-serif",
                    fontSize: "12px",
                    color: "rgba(33,35,38,0.55)",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  +{extraSizes}
                </span>
              )}
            </div>
          )}

          {/* Add to Cart / Notify Me */}
          <div style={{ marginTop: "auto", paddingTop: "12px" }}>
            {isSoldOut ? (
              <button
                onClick={handleNotifyMe}
                aria-label={`Notify me when ${product.name} is back in stock`}
                className="plp-atc-btn plp-atc-notify"
                style={{
                  width: "100%",
                  height: "44px",
                  borderRadius: "9999px",
                  border: "1.5px solid #00b566",
                  background: "transparent",
                  color: "#00b566",
                  fontFamily: "Outfit, sans-serif",
                  fontSize: "15px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 200ms",
                  outline: "none",
                }}
                onFocus={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.outline =
                    "2px solid #00b566")
                }
                onBlur={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.outline =
                    "none")
                }
              >
                Notify Me
              </button>
            ) : (
              <button
                onClick={handleAddToCart}
                aria-label={`Add ${product.name} to cart`}
                aria-busy={cartState === "loading"}
                className="plp-atc-btn"
                style={{
                  width: "100%",
                  height: "44px",
                  borderRadius: "9999px",
                  border: "none",
                  background:
                    cartState === "error" ? "#dc2626" : "#00b566",
                  color: "white",
                  fontFamily: "Outfit, sans-serif",
                  fontSize: "15px",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                  transition: "all 200ms",
                  outline: "none",
                  opacity: cartState === "loading" ? 0.75 : 1,
                }}
                onFocus={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.outline =
                    "2px solid #00b566")
                }
                onBlur={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.outline =
                    "none")
                }
                onMouseEnter={(e) => {
                  if (cartState === "idle")
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "#009952";
                }}
                onMouseLeave={(e) => {
                  if (cartState === "idle")
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "#00b566";
                }}
              >
                {cartState === "loading" ? (
                  <SpinnerIcon />
                ) : cartState === "success" ? (
                  "✓ Added"
                ) : cartState === "error" ? (
                  "Try again"
                ) : (
                  <>
                    <PlusIcon />
                    Add to Cart
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </li>

      <style>{`
        @keyframes plpSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        /* Desktop: hide CTA until hover */
        @media (min-width: 768px) {
          .plp-atc-btn {
            opacity: 0;
            transform: translateY(4px);
            transition: opacity 250ms ease, transform 250ms ease, background 200ms !important;
          }
          li:hover .plp-atc-btn,
          li:focus-within .plp-atc-btn {
            opacity: 1 !important;
            transform: translateY(0) !important;
          }
          .plp-atc-notify {
            opacity: 0;
            transform: translateY(4px);
          }
          li:hover .plp-atc-notify,
          li:focus-within .plp-atc-notify {
            opacity: 1 !important;
            transform: translateY(0) !important;
          }
        }
      `}</style>
    </>
  );
}
