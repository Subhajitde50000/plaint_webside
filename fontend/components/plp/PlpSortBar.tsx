"use client";

import { useState, useRef, useEffect } from "react";
import type { FilterState, PlantTag, PlantSize, LightReq, WateringFreq, SortOption } from "@/lib/plp-data";
import { SORT_LABELS } from "@/lib/plp-data";

function ChevronDown() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function GridIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? "#ffffff" : "rgba(33,35,38,0.6)"}
      strokeWidth="2"
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  );
}

function ListIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? "#ffffff" : "rgba(33,35,38,0.6)"}
      strokeWidth="2"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

function CheckMark() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <polyline
        points="2 7 5.5 10 12 3"
        stroke="#00b566"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface PlpSortBarProps {
  resultCount: number;
  sort: SortOption;
  onSortChange: (s: SortOption) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (m: "grid" | "list") => void;
  filters: FilterState;
  onFiltersChange: (f: FilterState) => void;
  onMobileFilterOpen: () => void;
  activeFilterCount: number;
}

export default function PlpSortBar({
  resultCount,
  sort,
  onSortChange,
  viewMode,
  onViewModeChange,
  filters,
  onFiltersChange,
  onMobileFilterOpen,
  activeFilterCount,
}: PlpSortBarProps) {
  const [sortOpen, setSortOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close on outside click
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      )
        setSortOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  // Keyboard nav inside sort listbox
  const handleSortKey = (e: React.KeyboardEvent) => {
    const opts = Object.keys(SORT_LABELS) as SortOption[];
    const idx = opts.indexOf(sort);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      onSortChange(opts[(idx + 1) % opts.length]);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      onSortChange(opts[(idx - 1 + opts.length) % opts.length]);
    } else if (e.key === "Escape") {
      setSortOpen(false);
      triggerRef.current?.focus();
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setSortOpen(false);
      triggerRef.current?.focus();
    }
  };

  // Active filter chip list
  type ChipItem = { label: string; onRemove: () => void };
  const chips: ChipItem[] = [];

  filters.plantTypes.forEach((t) =>
    chips.push({
      label: t.charAt(0).toUpperCase() + t.slice(1),
      onRemove: () =>
        onFiltersChange({
          ...filters,
          plantTypes: filters.plantTypes.filter((x) => x !== t),
        }),
    })
  );
  if (filters.priceMin > 0 || filters.priceMax < 5000)
    chips.push({
      label: `₹${filters.priceMin}–₹${filters.priceMax}`,
      onRemove: () =>
        onFiltersChange({ ...filters, priceMin: 0, priceMax: 5000 }),
    });
  filters.sizes.forEach((s) =>
    chips.push({
      label: `Size: ${s}`,
      onRemove: () =>
        onFiltersChange({
          ...filters,
          sizes: filters.sizes.filter((x) => x !== s),
        }),
    })
  );
  filters.lightReqs.forEach((l) =>
    chips.push({
      label: l,
      onRemove: () =>
        onFiltersChange({
          ...filters,
          lightReqs: filters.lightReqs.filter((x) => x !== l),
        }),
    })
  );
  filters.watering.forEach((w) =>
    chips.push({
      label: w,
      onRemove: () =>
        onFiltersChange({
          ...filters,
          watering: filters.watering.filter((x) => x !== w),
        }),
    })
  );
  filters.specialTags.forEach((t) =>
    chips.push({
      label: t.charAt(0).toUpperCase() + t.slice(1).replace("-", " "),
      onRemove: () =>
        onFiltersChange({
          ...filters,
          specialTags: filters.specialTags.filter((x) => x !== t),
        }),
    })
  );
  if (filters.minRating)
    chips.push({
      label: `${filters.minRating}★+`,
      onRemove: () => onFiltersChange({ ...filters, minRating: null }),
    });
  if (filters.inStockOnly)
    chips.push({
      label: "In Stock",
      onRemove: () => onFiltersChange({ ...filters, inStockOnly: false }),
    });
  filters.discounts.forEach((d) =>
    chips.push({
      label: `${d}%+ Off`,
      onRemove: () =>
        onFiltersChange({
          ...filters,
          discounts: filters.discounts.filter((x) => x !== d),
        }),
    })
  );

  const clearAll = () =>
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
    });

  return (
    <div
      style={{
        background: "#fefcf9",
        borderBottom: "1px solid rgba(28,28,28,0.10)",
        position: "sticky",
        top: "64px",
        zIndex: 50,
      }}
    >
      {/* Row 1: count + sort + toggle */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "52px",
          gap: "12px",
        }}
      >
        {/* Mobile filter btn */}
        <button
          onClick={onMobileFilterOpen}
          aria-label={`Filter products, ${activeFilterCount} active filter${activeFilterCount !== 1 ? "s" : ""}`}
          className="plp-filter-mobile-btn"
          style={{
            display: "none",
            alignItems: "center",
            gap: "6px",
            height: "40px",
            padding: "0 16px",
            borderRadius: "9999px",
            border: "1px solid rgb(212,212,212)",
            background: "#fefcf9",
            fontFamily: "Outfit, sans-serif",
            fontSize: "14px",
            fontWeight: 500,
            color: "#1c1c1c",
            cursor: "pointer",
            flexShrink: 0,
          }}
          onFocus={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.outline =
              "2px solid #00b566")
          }
          onBlur={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.outline = "none")
          }
        >
          <FilterIcon />
          Filter
          {activeFilterCount > 0 && (
            <span
              style={{
                background: "#00b566",
                color: "white",
                fontSize: "11px",
                fontWeight: 700,
                width: "20px",
                height: "20px",
                borderRadius: "9999px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Result count */}
        <p
          aria-live="polite"
          aria-atomic="true"
          style={{
            fontFamily: "Outfit, sans-serif",
            fontSize: "14px",
            fontWeight: 400,
            color: "rgba(33,35,38,0.60)",
            flexShrink: 0,
          }}
        >
          {resultCount} results
        </p>

        {/* Right side: sort + view toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "auto" }}>
          {/* Sort dropdown */}
          <div ref={dropdownRef} style={{ position: "relative" }}>
            <button
              ref={triggerRef}
              id="sort-trigger"
              aria-haspopup="listbox"
              aria-expanded={sortOpen}
              aria-label={`Sort by ${SORT_LABELS[sort]}`}
              onClick={() => setSortOpen((v) => !v)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                height: "40px",
                padding: "0 14px",
                borderRadius: "9999px",
                border: "1px solid rgb(212,212,212)",
                background: "#fefcf9",
                fontFamily: "Outfit, sans-serif",
                fontSize: "15px",
                fontWeight: 500,
                color: "#1c1c1c",
                cursor: "pointer",
                transition: "border-color 200ms",
                outline: "none",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.borderColor =
                  "#00b566")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.borderColor =
                  "rgb(212,212,212)")
              }
              onFocus={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.outline =
                  "2px solid #00b566")
              }
              onBlur={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.outline = "none")
              }
            >
              <span style={{ maxWidth: "140px", overflow: "hidden", textOverflow: "ellipsis" }}>
                {SORT_LABELS[sort]}
              </span>
              <span
                style={{
                  transition: "transform 300ms",
                  transform: sortOpen ? "rotate(180deg)" : "none",
                  display: "flex",
                  color: "rgba(33,35,38,0.5)",
                }}
              >
                <ChevronDown />
              </span>
            </button>

            {sortOpen && (
              <div
                role="listbox"
                aria-label="Sort options"
                onKeyDown={handleSortKey}
                tabIndex={-1}
                style={{
                  position: "absolute",
                  top: "calc(100% + 6px)",
                  right: 0,
                  background: "#fefcf9",
                  border: "1px solid rgb(212,212,212)",
                  borderRadius: "20px",
                  boxShadow: "0 8px 24px rgba(28,28,28,0.12)",
                  width: "220px",
                  zIndex: 300,
                  overflow: "hidden",
                  padding: "8px",
                }}
              >
                {(Object.entries(SORT_LABELS) as [SortOption, string][]).map(
                  ([key, label]) => {
                    const isSelected = key === sort;
                    return (
                      <button
                        key={key}
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          onSortChange(key);
                          setSortOpen(false);
                          triggerRef.current?.focus();
                        }}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          padding: "10px 12px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          border: "none",
                          background: isSelected
                            ? "rgba(0,181,102,0.08)"
                            : "transparent",
                          borderRadius: "10px",
                          fontFamily: "Outfit, sans-serif",
                          fontSize: "14px",
                          fontWeight: isSelected ? 700 : 400,
                          color: "#1c1c1c",
                          cursor: "pointer",
                          transition: "background 150ms",
                          outline: "none",
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected)
                            (e.currentTarget as HTMLButtonElement).style.background =
                              "rgba(0,181,102,0.07)";
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected)
                            (e.currentTarget as HTMLButtonElement).style.background =
                              "transparent";
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
                        {label}
                        {isSelected && <CheckMark />}
                      </button>
                    );
                  }
                )}
              </div>
            )}
          </div>

          {/* View toggle */}
          <div
            role="group"
            aria-label="View mode"
            className="plp-view-toggle"
            style={{ display: "flex", gap: "4px" }}
          >
            <button
              aria-label="Switch to grid view"
              aria-pressed={viewMode === "grid"}
              onClick={() => onViewModeChange("grid")}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                border: viewMode === "grid" ? "none" : "1px solid rgb(212,212,212)",
                background: viewMode === "grid" ? "#00b566" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 200ms",
                outline: "none",
              } as React.CSSProperties}
              onFocus={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.outline =
                  "2px solid #00b566")
              }
              onBlur={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.outline = "none")
              }
            >
              <GridIcon active={viewMode === "grid"} />
            </button>
            <button
              aria-label="Switch to list view"
              aria-pressed={viewMode === "list"}
              onClick={() => onViewModeChange("list")}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                border: viewMode === "list" ? "none" : "1px solid rgb(212,212,212)",
                background: viewMode === "list" ? "#00b566" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 200ms",
                outline: "none",
              } as React.CSSProperties}
              onFocus={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.outline =
                  "2px solid #00b566")
              }
              onBlur={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.outline = "none")
              }
            >
              <ListIcon active={viewMode === "list"} />
            </button>
          </div>
        </div>
      </div>

      {/* Row 2: Active filter chips */}
      {chips.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "5px",
            alignItems: "center",
            paddingBottom: "10px",
          }}
        >
          {chips.map((chip, i) => (
            <div
              key={i}
              role="group"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                height: "32px",
                padding: "4px 8px",
                borderRadius: "16px",
                background: "rgba(0,181,102,0.12)",
                animation: "chipFadeIn 200ms ease",
              }}
            >
              <span
                style={{
                  fontFamily: "Outfit, sans-serif",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#00b566",
                  whiteSpace: "nowrap",
                }}
              >
                {chip.label}
              </span>
              <button
                onClick={chip.onRemove}
                aria-label={`Remove ${chip.label} filter`}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#00b566",
                  display: "flex",
                  alignItems: "center",
                  padding: "0",
                  fontSize: "14px",
                  lineHeight: 1,
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
                ×
              </button>
            </div>
          ))}
          <button
            onClick={clearAll}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "Outfit, sans-serif",
              fontSize: "12px",
              fontWeight: 600,
              color: "#00b566",
              textDecoration: "underline",
              padding: "0 4px",
              height: "32px",
            }}
            onFocus={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.outline =
                "2px solid #00b566")
            }
            onBlur={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.outline = "none")
            }
          >
            Clear All
          </button>
        </div>
      )}

      <style>{`
        @keyframes chipFadeIn {
          from { opacity: 0; transform: scale(0.85); }
          to { opacity: 1; transform: scale(1); }
        }
        @media (max-width: 767px) {
          .plp-filter-mobile-btn { display: flex !important; }
          .plp-view-toggle { display: none !important; }
        }
      `}</style>
    </div>
  );
}
