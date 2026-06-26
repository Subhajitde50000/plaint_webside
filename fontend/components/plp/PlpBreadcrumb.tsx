"use client";

import Link from "next/link";

export default function PlpBreadcrumb() {
  return (
    <nav aria-label="Breadcrumb" style={{ padding: "24px 0 16px" }}>
      <ol
        style={{
          listStyle: "none",
          display: "flex",
          alignItems: "center",
          gap: "0",
          flexWrap: "nowrap",
          overflowX: "auto",
          scrollbarWidth: "none",
        }}
      >
        <li>
          <Link
            href="/"
            style={{
              fontFamily: "Outfit, sans-serif",
              fontSize: "13px",
              fontWeight: 400,
              color: "rgba(33,35,38,0.65)",
              textDecoration: "none",
              transition: "color 200ms",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.color = "#1c1c1c")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.color =
                "rgba(33,35,38,0.65)")
            }
          >
            Home
          </Link>
        </li>
        <li
          aria-hidden="true"
          style={{
            padding: "0 8px",
            color: "rgba(28,28,28,0.30)",
            fontFamily: "Outfit, sans-serif",
            fontSize: "13px",
            userSelect: "none",
          }}
        >
          /
        </li>
        <li aria-current="page">
          <span
            style={{
              fontFamily: "Outfit, sans-serif",
              fontSize: "13px",
              fontWeight: 600,
              color: "#1c1c1c",
              whiteSpace: "nowrap",
            }}
          >
            Plants
          </span>
        </li>
      </ol>
    </nav>
  );
}
