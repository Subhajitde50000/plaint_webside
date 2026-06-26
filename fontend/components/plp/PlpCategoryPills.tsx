"use client";

import { useRef, useCallback } from "react";
import { CATEGORY_PILLS } from "@/lib/plp-data";
import type { PlantTag } from "@/lib/plp-data";

interface PlpCategoryPillsProps {
  selected: PlantTag | "all";
  onChange: (tag: PlantTag | "all") => void;
}

export default function PlpCategoryPills({
  selected,
  onChange,
}: PlpCategoryPillsProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  // Arrow-key navigation within tablist
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, idx: number) => {
      const pills = rowRef.current?.querySelectorAll<HTMLButtonElement>(
        "[role='tab']"
      );
      if (!pills) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        pills[(idx + 1) % pills.length].focus();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        pills[(idx - 1 + pills.length) % pills.length].focus();
      } else if (e.key === "Home") {
        e.preventDefault();
        pills[0].focus();
      } else if (e.key === "End") {
        e.preventDefault();
        pills[pills.length - 1].focus();
      }
    },
    []
  );

  return (
    <>
      <div
        id="plp-category-pills"
        role="tablist"
        aria-label="Filter by plant category"
        ref={rowRef}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          padding: "8px 0",
          borderBottom: "1px solid rgba(28,28,28,0.10)",
        }}
      >
        {CATEGORY_PILLS.map((pill, idx) => {
          const isActive = selected === pill.tag;
          return (
            <button
              key={pill.tag}
              role="tab"
              id={`pill-${pill.tag}`}
              aria-selected={isActive}
              onClick={() => onChange(pill.tag)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              tabIndex={isActive ? 0 : -1}
              style={{
                flexShrink: 0,
                scrollSnapAlign: "start",
                height: "36px",
                borderRadius: "9999px",
                padding: "6px 16px",
                fontFamily: "Outfit, sans-serif",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                border: isActive
                  ? "none"
                  : "1px solid rgb(212,212,212)",
                background: isActive ? "#00b566" : "#fefcf9",
                color: isActive ? "#ffffff" : "rgba(33,35,38,0.75)",
                transition: "all 200ms ease",
                outline: "none",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(0,181,102,0.08)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    "#00b566";
                  (e.currentTarget as HTMLButtonElement).style.color = "#1c1c1c";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "#fefcf9";
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    "rgb(212,212,212)";
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "rgba(33,35,38,0.75)";
                }
              }}
              onFocus={(e) => {
                (e.currentTarget as HTMLButtonElement).style.outline =
                  "2px solid #00b566";
                (e.currentTarget as HTMLButtonElement).style.outlineOffset = "2px";
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLButtonElement).style.outline = "none";
              }}
            >
              {pill.label}
            </button>
          );
        })}
        <style>{`
          #plp-category-pills::-webkit-scrollbar { display: none; }
        `}</style>
      </div>
    </>
  );
}
