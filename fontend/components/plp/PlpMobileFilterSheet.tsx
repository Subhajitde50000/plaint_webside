"use client";

import { useEffect, useRef, useCallback } from "react";
import type { FilterState } from "@/lib/plp-data";
import PlpFilterSidebar from "./PlpFilterSidebar";

interface PlpMobileFilterSheetProps {
  open: boolean;
  onClose: () => void;
  filters: FilterState;
  onFiltersChange: (f: FilterState) => void;
  resultCount: number;
}

export default function PlpMobileFilterSheet({
  open,
  onClose,
  filters,
  onFiltersChange,
  resultCount,
}: PlpMobileFilterSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const prevFocusRef = useRef<HTMLElement | null>(null);

  // Save focus and move to sheet on open
  useEffect(() => {
    if (open) {
      prevFocusRef.current = document.activeElement as HTMLElement;
      setTimeout(() => closeRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      prevFocusRef.current?.focus();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Focus trap
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const sheet = sheetRef.current;
      if (!sheet) return;
      const focusable = sheet.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [open, onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.45)",
          zIndex: 800,
          backdropFilter: "blur(2px)",
          animation: "backdropFadeIn 300ms ease",
        }}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label="Product filters"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          maxHeight: "85vh",
          minHeight: "50vh",
          background: "#fefcf9",
          borderRadius: "20px 20px 0 0",
          zIndex: 900,
          display: "flex",
          flexDirection: "column",
          animation: "sheetSlideUp 300ms ease",
          overflow: "hidden",
        }}
      >
        {/* Drag handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 8px" }}>
          <div
            style={{
              width: "40px",
              height: "4px",
              borderRadius: "9999px",
              background: "rgba(28,28,28,0.20)",
            }}
          />
        </div>

        {/* Sheet header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 20px 12px",
            borderBottom: "1px solid rgba(28,28,28,0.10)",
          }}
        >
          <h2
            style={{
              fontFamily: "Outfit, sans-serif",
              fontSize: "16px",
              fontWeight: 700,
              color: "#1c1c1c",
            }}
          >
            Filters
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              onClick={() =>
                onFiltersChange({
                  category: filters.category,
                  plantTypes: [],
                  priceMin: 0,
                  priceMax: 5000,
                  sizes: [],
                  lightReqs: [],
                  watering: [],
                  specialTags: [],
                  minRating: null,
                  inStockOnly: false,
                  discounts: [],
                })
              }
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "Outfit, sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                color: "#00b566",
                textDecoration: "underline",
                padding: "0",
              }}
              onFocus={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.outline =
                  "2px solid #00b566")
              }
              onBlur={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.outline = "none")
              }
            >
              Reset All
            </button>
            <button
              ref={closeRef}
              onClick={onClose}
              aria-label="Close filter panel"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                border: "1px solid rgba(28,28,28,0.15)",
                background: "transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Outfit, sans-serif",
                fontSize: "16px",
                color: "#1c1c1c",
                outline: "none",
              }}
              onFocus={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.outline =
                  "2px solid #00b566")
              }
              onBlur={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.outline = "none")
              }
            >
              ×
            </button>
          </div>
        </div>

        {/* Scrollable filter content */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "0 20px",
          }}
        >
          {/* Force sidebar visible inside sheet regardless of viewport */}
          <div className="mobile-sheet-filters">
            <PlpFilterSidebar
              filters={filters}
              onChange={onFiltersChange}
              totalResults={resultCount}
            />
          </div>
        </div>

        {/* Fixed footer: Show Results */}
        <div
          style={{
            padding: "16px 20px",
            borderTop: "1px solid rgba(28,28,28,0.10)",
            background: "#fefcf9",
          }}
        >
          <button
            onClick={onClose}
            aria-label={`Show ${resultCount} results and close filters`}
            style={{
              width: "100%",
              height: "52px",
              borderRadius: "9999px",
              border: "none",
              background: "#00b566",
              color: "white",
              fontFamily: "Outfit, sans-serif",
              fontSize: "16px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "background 200ms",
              outline: "none",
            }}
            onFocus={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.outline =
                "2px solid #00b566")
            }
            onBlur={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.outline = "none")
            }
          >
            Show {resultCount} Results
          </button>
        </div>
      </div>

      <style>{`
        @keyframes backdropFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes sheetSlideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        /* Force sidebar visible inside the mobile sheet */
        .mobile-sheet-filters .plp-sidebar {
          display: flex !important;
          position: static !important;
          height: auto !important;
          width: 100% !important;
          min-width: unset !important;
          border-right: none !important;
          padding: 0 !important;
          overflow: visible !important;
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes backdropFadeIn { from { opacity: 1; } }
          @keyframes sheetSlideUp { from { transform: none; } }
        }
      `}</style>
    </>
  );
}
