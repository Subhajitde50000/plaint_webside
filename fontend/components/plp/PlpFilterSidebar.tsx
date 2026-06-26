"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { FilterState, PlantTag, PlantSize, LightReq, WateringFreq } from "@/lib/plp-data";

/* ──────────────────────────────────────────────────────
   Sub-components
────────────────────────────────────────────────────── */
function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      style={{
        transition: "transform 250ms ease",
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
        color: "rgba(33,35,38,0.5)",
        flexShrink: 0,
      }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <polyline
        points="2 6 5 9 10 3"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface AccordionSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function AccordionSection({
  title,
  defaultOpen = true,
  children,
}: AccordionSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = `filter-panel-${title.toLowerCase().replace(/\s+/g, "-")}`;
  const btnId = `filter-btn-${title.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div
      style={{
        borderBottom: "1px solid rgba(28,28,28,0.10)",
        paddingBottom: open ? "0" : "0",
      }}
    >
      <button
        id={btnId}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 0",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: "Outfit, sans-serif",
          fontSize: "14px",
          fontWeight: 700,
          color: "#1c1c1c",
          textAlign: "left",
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
        {title}
        <ChevronIcon open={open} />
      </button>

      <div
        id={panelId}
        role="region"
        aria-labelledby={btnId}
        style={{
          display: open ? "block" : "none",
          paddingBottom: "12px",
        }}
      >
        {children}
      </div>
    </div>
  );
}

interface CheckboxOptionProps {
  label: string;
  count?: number;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}

function CheckboxOption({
  label,
  count,
  checked,
  onChange,
  disabled = false,
}: CheckboxOptionProps) {
  return (
    <label
      role="checkbox"
      aria-checked={checked}
      aria-disabled={disabled}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "6px 6px",
        marginBottom: "2px",
        borderRadius: "4px",
        cursor: disabled ? "not-allowed" : "pointer",
        background: checked ? "rgba(0,181,102,0.10)" : "transparent",
        transition: "background 200ms",
        minHeight: "44px",
        opacity: disabled ? 0.4 : 1,
      }}
      onMouseEnter={(e) => {
        if (!disabled && !checked)
          (e.currentTarget as HTMLLabelElement).style.background =
            "rgba(0,181,102,0.07)";
      }}
      onMouseLeave={(e) => {
        if (!checked)
          (e.currentTarget as HTMLLabelElement).style.background =
            "transparent";
      }}
    >
      <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span
          style={{
            width: "18px",
            height: "18px",
            borderRadius: "4px",
            border: checked
              ? "none"
              : "1px solid rgb(212,212,212)",
            background: checked ? "#00b566" : "#fefcf9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "all 200ms",
          }}
        >
          {checked && <CheckIcon />}
        </span>
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
          aria-hidden="true"
        />
        <span
          style={{
            fontFamily: "Outfit, sans-serif",
            fontSize: "13.33px",
            fontWeight: checked ? 600 : 400,
            color: checked ? "#1c1c1c" : "rgba(33,35,38,0.75)",
            transition: "all 200ms",
          }}
        >
          {label}
        </span>
      </span>
      {count !== undefined && (
        <span
          style={{
            fontFamily: "Outfit, sans-serif",
            fontSize: "11px",
            fontWeight: 500,
            color: "rgba(33,35,38,0.40)",
          }}
        >
          ({count})
        </span>
      )}
    </label>
  );
}

/* ── Price Slider ────────────────────────────────────── */
interface PriceSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (v: [number, number]) => void;
}

function PriceSlider({ min, max, value, onChange }: PriceSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<"min" | "max" | null>(null);
  const [localMin, setLocalMin] = useState(String(value[0]));
  const [localMax, setLocalMax] = useState(String(value[1]));

  useEffect(() => {
    setLocalMin(String(value[0]));
    setLocalMax(String(value[1]));
  }, [value]);

  const toPercent = (v: number) => ((v - min) / (max - min)) * 100;

  const fromEvent = useCallback(
    (clientX: number): number => {
      const track = trackRef.current;
      if (!track) return 0;
      const rect = track.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      return Math.round((pct * (max - min) + min) / 50) * 50;
    },
    [min, max]
  );

  const handleMouseDown = (which: "min" | "max") => (e: React.MouseEvent) => {
    dragging.current = which;
    const onMove = (ev: MouseEvent) => {
      const v = fromEvent(ev.clientX);
      if (which === "min")
        onChange([Math.min(v, value[1] - 50), value[1]]);
      else onChange([value[0], Math.max(v, value[0] + 50)]);
    };
    const onUp = () => {
      dragging.current = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const handleThumbKey =
    (which: "min" | "max") => (e: React.KeyboardEvent) => {
      const step = e.shiftKey ? 500 : 50;
      if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        e.preventDefault();
        if (which === "min")
          onChange([Math.min(value[0] + step, value[1] - 50), value[1]]);
        else onChange([value[0], Math.min(value[1] + step, max)]);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        e.preventDefault();
        if (which === "min")
          onChange([Math.max(value[0] - step, min), value[1]]);
        else onChange([value[0], Math.max(value[1] - step, value[0] + 50)]);
      } else if (e.key === "Home") {
        e.preventDefault();
        if (which === "min") onChange([min, value[1]]);
        else onChange([value[0], value[0] + 50]);
      } else if (e.key === "End") {
        e.preventDefault();
        if (which === "min") onChange([value[1] - 50, value[1]]);
        else onChange([value[0], max]);
      }
    };

  const commitInput = () => {
    const mn = Math.max(min, Math.min(Number(localMin) || min, value[1] - 50));
    const mx = Math.min(max, Math.max(Number(localMax) || max, value[0] + 50));
    onChange([mn, mx]);
  };

  return (
    <div style={{ padding: "4px 0 12px" }}>
      {/* Track */}
      <div
        ref={trackRef}
        style={{
          position: "relative",
          height: "6px",
          borderRadius: "9999px",
          background: "rgba(28,28,28,0.10)",
          margin: "16px 10px",
          cursor: "pointer",
        }}
      >
        {/* Fill */}
        <div
          style={{
            position: "absolute",
            left: `${toPercent(value[0])}%`,
            right: `${100 - toPercent(value[1])}%`,
            top: 0,
            bottom: 0,
            background: "#00b566",
            borderRadius: "9999px",
          }}
        />
        {/* Min thumb */}
        <div
          role="slider"
          aria-label="Minimum price"
          aria-valuemin={min}
          aria-valuemax={value[1] - 50}
          aria-valuenow={value[0]}
          aria-valuetext={`₹${value[0]}`}
          tabIndex={0}
          onMouseDown={handleMouseDown("min")}
          onKeyDown={handleThumbKey("min")}
          onFocus={(e) => {
            (e.currentTarget as HTMLDivElement).style.boxShadow =
              "0 0 0 3px rgba(0,181,102,0.35)";
          }}
          onBlur={(e) => {
            (e.currentTarget as HTMLDivElement).style.boxShadow =
              "0 2px 8px rgba(0,181,102,0.25)";
          }}
          style={{
            position: "absolute",
            top: "50%",
            left: `${toPercent(value[0])}%`,
            transform: "translate(-50%, -50%)",
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            background: "#00b566",
            boxShadow: "0 2px 8px rgba(0,181,102,0.25)",
            cursor: "grab",
            zIndex: 2,
            outline: "none",
            transition: "box-shadow 200ms",
          }}
        />
        {/* Max thumb */}
        <div
          role="slider"
          aria-label="Maximum price"
          aria-valuemin={value[0] + 50}
          aria-valuemax={max}
          aria-valuenow={value[1]}
          aria-valuetext={`₹${value[1]}`}
          tabIndex={0}
          onMouseDown={handleMouseDown("max")}
          onKeyDown={handleThumbKey("max")}
          onFocus={(e) => {
            (e.currentTarget as HTMLDivElement).style.boxShadow =
              "0 0 0 3px rgba(0,181,102,0.35)";
          }}
          onBlur={(e) => {
            (e.currentTarget as HTMLDivElement).style.boxShadow =
              "0 2px 8px rgba(0,181,102,0.25)";
          }}
          style={{
            position: "absolute",
            top: "50%",
            left: `${toPercent(value[1])}%`,
            transform: "translate(-50%, -50%)",
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            background: "#00b566",
            boxShadow: "0 2px 8px rgba(0,181,102,0.25)",
            cursor: "grab",
            zIndex: 2,
            outline: "none",
            transition: "box-shadow 200ms",
          }}
        />
      </div>
      {/* Inputs */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          alignItems: "center",
          marginTop: "8px",
        }}
      >
        <div style={{ position: "relative", flex: 1 }}>
          <span
            style={{
              position: "absolute",
              left: "8px",
              top: "50%",
              transform: "translateY(-50%)",
              fontFamily: "Outfit, sans-serif",
              fontSize: "12px",
              color: "rgba(33,35,38,0.6)",
            }}
          >
            ₹
          </span>
          <input
            type="number"
            aria-label="Minimum price"
            value={localMin}
            onChange={(e) => setLocalMin(e.target.value)}
            style={{
              width: "100%",
              height: "36px",
              paddingLeft: "22px",
              paddingRight: "8px",
              borderRadius: "8px",
              border: "1px solid rgb(212,212,212)",
              fontFamily: "Outfit, sans-serif",
              fontSize: "13px",
              color: "#1c1c1c",
              background: "#fefcf9",
              outline: "none",
            }}
            onFocus={(e) =>
              ((e.currentTarget as HTMLInputElement).style.borderColor =
                "#00b566")
            }
            onBlur={(e) => {
              (e.currentTarget as HTMLInputElement).style.borderColor = "rgb(212,212,212)";
              commitInput();
            }}
          />
        </div>
        <span
          style={{
            fontFamily: "Outfit, sans-serif",
            fontSize: "12px",
            color: "rgba(33,35,38,0.5)",
          }}
        >
          to
        </span>
        <div style={{ position: "relative", flex: 1 }}>
          <span
            style={{
              position: "absolute",
              left: "8px",
              top: "50%",
              transform: "translateY(-50%)",
              fontFamily: "Outfit, sans-serif",
              fontSize: "12px",
              color: "rgba(33,35,38,0.6)",
            }}
          >
            ₹
          </span>
          <input
            type="number"
            aria-label="Maximum price"
            value={localMax}
            onChange={(e) => setLocalMax(e.target.value)}
            style={{
              width: "100%",
              height: "36px",
              paddingLeft: "22px",
              paddingRight: "8px",
              borderRadius: "8px",
              border: "1px solid rgb(212,212,212)",
              fontFamily: "Outfit, sans-serif",
              fontSize: "13px",
              color: "#1c1c1c",
              background: "#fefcf9",
              outline: "none",
            }}
            onFocus={(e) =>
              ((e.currentTarget as HTMLInputElement).style.borderColor =
                "#00b566")
            }
            onBlur={(e) => {
              (e.currentTarget as HTMLInputElement).style.borderColor = "rgb(212,212,212)";
              commitInput();
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* ── Rating Filter ─────────────────────────────────── */
function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <polygon
        points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
        fill={filled ? "#c8a84b" : "none"}
        stroke={filled ? "#c8a84b" : "rgba(28,28,28,0.20)"}
        strokeWidth="1.5"
      />
    </svg>
  );
}

/* ──────────────────────────────────────────────────────
   Main FilterSidebar
────────────────────────────────────────────────────── */
interface PlpFilterSidebarProps {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  totalResults: number;
}

export default function PlpFilterSidebar({
  filters,
  onChange,
  totalResults,
}: PlpFilterSidebarProps) {
  const hasActiveFilters =
    filters.plantTypes.length > 0 ||
    filters.priceMin > 0 ||
    filters.priceMax < 5000 ||
    filters.sizes.length > 0 ||
    filters.lightReqs.length > 0 ||
    filters.watering.length > 0 ||
    filters.specialTags.length > 0 ||
    filters.minRating !== null ||
    filters.inStockOnly ||
    filters.discounts.length > 0;

  const reset = () =>
    onChange({
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

  function toggle<T>(arr: T[], item: T): T[] {
    return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
  }

  // Plant type options
  const plantTypeOptions: { label: string; value: PlantTag }[] = [
    { label: "Indoor", value: "indoor" },
    { label: "Outdoor", value: "outdoor" },
    { label: "Flowering", value: "flowering" },
    { label: "Succulent", value: "succulents" },
    { label: "Cactus", value: "cactus" },
    { label: "Climber", value: "climber" },
    { label: "Herb", value: "herb" },
    { label: "Vegetable", value: "vegetable" },
  ];

  const sizeOptions: PlantSize[] = ["XS", "S", "M", "L", "XL"];
  const lightOptions: LightReq[] = [
    "Full Sun",
    "Partial Sun",
    "Low Light",
    "Shade",
  ];
  const wateringOptions: WateringFreq[] = [
    "Daily",
    "Weekly",
    "Bi-weekly",
    "Monthly",
  ];
  const specialTagOptions: { label: string; value: PlantTag }[] = [
    { label: "Pet Friendly", value: "pet-friendly" },
    { label: "Air Purifying", value: "air-purifying" },
    { label: "Low Maintenance", value: "low-maintenance" },
    { label: "Rare", value: "rare" },
    { label: "Gifting", value: "gifting" },
  ];

  return (
    <>
      <aside
        id="plp-filter-sidebar"
        role="complementary"
        aria-label="Product filters"
        style={{
          width: "260px",
          minWidth: "260px",
          background: "#fefcf9",
          borderRight: "1px solid rgba(28,28,28,0.10)",
          padding: "16px",
          position: "sticky",
          top: "64px",
          height: "calc(100vh - 64px)",
          overflowY: "auto",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(0,181,102,0.3) transparent",
          flexShrink: 0,
        }}
        className="plp-sidebar"
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "16px",
            paddingBottom: "16px",
            borderBottom: "1px solid rgba(28,28,28,0.10)",
          }}
        >
          <span
            style={{
              fontFamily: "Outfit, sans-serif",
              fontSize: "16px",
              fontWeight: 700,
              color: "#1c1c1c",
            }}
          >
            Filters
          </span>
          {hasActiveFilters && (
            <button
              onClick={reset}
              aria-label="Clear all filters"
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
              onFocus={(e) => {
                (e.currentTarget as HTMLButtonElement).style.outline =
                  "2px solid #00b566";
                (e.currentTarget as HTMLButtonElement).style.outlineOffset =
                  "2px";
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLButtonElement).style.outline = "none";
              }}
            >
              Reset All
            </button>
          )}
        </div>

        {/* Plant Type */}
        <AccordionSection title="Plant Type">
          {plantTypeOptions.map((opt) => (
            <CheckboxOption
              key={opt.value}
              label={opt.label}
              checked={filters.plantTypes.includes(opt.value)}
              onChange={() =>
                onChange({
                  ...filters,
                  plantTypes: toggle(filters.plantTypes, opt.value),
                })
              }
            />
          ))}
        </AccordionSection>

        {/* Price Range */}
        <AccordionSection title="Price Range">
          <PriceSlider
            min={0}
            max={5000}
            value={[filters.priceMin, filters.priceMax]}
            onChange={([mn, mx]) =>
              onChange({ ...filters, priceMin: mn, priceMax: mx })
            }
          />
        </AccordionSection>

        {/* Size */}
        <AccordionSection title="Size">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", padding: "4px 0 8px" }}>
            {sizeOptions.map((s) => {
              const active = filters.sizes.includes(s);
              return (
                <button
                  key={s}
                  role="checkbox"
                  aria-checked={active}
                  onClick={() =>
                    onChange({ ...filters, sizes: toggle(filters.sizes, s) })
                  }
                  style={{
                    height: "28px",
                    padding: "4px 10px",
                    borderRadius: "4px",
                    border: active
                      ? "1px solid #00b566"
                      : "1px solid rgb(212,212,212)",
                    background: active
                      ? "rgba(0,181,102,0.10)"
                      : "#fefcf9",
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
                >
                  {s}
                </button>
              );
            })}
          </div>
        </AccordionSection>

        {/* Light Requirements */}
        <AccordionSection title="Light Requirements" defaultOpen={false}>
          {lightOptions.map((opt) => (
            <CheckboxOption
              key={opt}
              label={opt}
              checked={filters.lightReqs.includes(opt)}
              onChange={() =>
                onChange({
                  ...filters,
                  lightReqs: toggle(filters.lightReqs, opt),
                })
              }
            />
          ))}
        </AccordionSection>

        {/* Watering */}
        <AccordionSection title="Watering" defaultOpen={false}>
          {wateringOptions.map((opt) => (
            <CheckboxOption
              key={opt}
              label={opt}
              checked={filters.watering.includes(opt)}
              onChange={() =>
                onChange({
                  ...filters,
                  watering: toggle(filters.watering, opt),
                })
              }
            />
          ))}
        </AccordionSection>

        {/* Special Tags */}
        <AccordionSection title="Special Tags">
          {specialTagOptions.map((opt) => (
            <CheckboxOption
              key={opt.value}
              label={opt.label}
              checked={filters.specialTags.includes(opt.value)}
              onChange={() =>
                onChange({
                  ...filters,
                  specialTags: toggle(filters.specialTags, opt.value),
                })
              }
            />
          ))}
        </AccordionSection>

        {/* Rating */}
        <AccordionSection title="Rating">
          <div role="radiogroup" aria-label="Minimum rating filter">
            {[4, 3].map((stars) => {
              const selected = filters.minRating === stars;
              return (
                <label
                  key={stars}
                  role="radio"
                  aria-checked={selected}
                  aria-label={`${stars} stars and above`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "6px 6px",
                    marginBottom: "2px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    background: selected
                      ? "rgba(0,181,102,0.10)"
                      : "transparent",
                    minHeight: "44px",
                  }}
                  onMouseEnter={(e) => {
                    if (!selected)
                      (e.currentTarget as HTMLLabelElement).style.background =
                        "rgba(0,181,102,0.07)";
                  }}
                  onMouseLeave={(e) => {
                    if (!selected)
                      (e.currentTarget as HTMLLabelElement).style.background =
                        "transparent";
                  }}
                >
                  <input
                    type="radio"
                    name="rating"
                    checked={selected}
                    onChange={() =>
                      onChange({
                        ...filters,
                        minRating: selected ? null : stars,
                      })
                    }
                    style={{
                      position: "absolute",
                      opacity: 0,
                      width: 0,
                      height: 0,
                    }}
                  />
                  <span style={{ display: "flex", gap: "2px" }}>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <StarIcon key={i} filled={i <= stars} />
                    ))}
                  </span>
                  <span
                    style={{
                      fontFamily: "Outfit, sans-serif",
                      fontSize: "13.33px",
                      color: "rgba(33,35,38,0.75)",
                    }}
                  >
                    {stars}★ &amp; above
                  </span>
                </label>
              );
            })}
          </div>
        </AccordionSection>

        {/* Availability */}
        <AccordionSection title="Availability" defaultOpen={false}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "6px 6px",
              borderRadius: "4px",
              cursor: "pointer",
              minHeight: "44px",
            }}
          >
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={() =>
                onChange({ ...filters, inStockOnly: !filters.inStockOnly })
              }
              style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
            />
            <span
              style={{
                width: "18px",
                height: "18px",
                borderRadius: "4px",
                border: filters.inStockOnly
                  ? "none"
                  : "1px solid rgb(212,212,212)",
                background: filters.inStockOnly ? "#00b566" : "#fefcf9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "all 200ms",
              }}
            >
              {filters.inStockOnly && <CheckIcon />}
            </span>
            <span
              style={{
                fontFamily: "Outfit, sans-serif",
                fontSize: "13.33px",
                fontWeight: filters.inStockOnly ? 600 : 400,
                color: filters.inStockOnly ? "#1c1c1c" : "rgba(33,35,38,0.75)",
              }}
            >
              In Stock Only
            </span>
          </label>
        </AccordionSection>

        {/* Discount */}
        <AccordionSection title="Discount" defaultOpen={false}>
          {[10, 25, 50].map((pct) => (
            <CheckboxOption
              key={pct}
              label={`${pct}%+ Off`}
              checked={filters.discounts.includes(pct)}
              onChange={() =>
                onChange({
                  ...filters,
                  discounts: toggle(filters.discounts, pct),
                })
              }
            />
          ))}
        </AccordionSection>
      </aside>

      <style>{`
        .plp-sidebar { display: flex; flex-direction: column; }
        @media (max-width: 767px) {
          .plp-sidebar { display: none; }
        }
        .plp-sidebar::-webkit-scrollbar { width: 4px; }
        .plp-sidebar::-webkit-scrollbar-thumb { background: rgba(0,181,102,0.3); border-radius: 2px; }
      `}</style>
    </>
  );
}
