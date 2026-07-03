# Admin — Analytics Module
## Design Specification v1.0 — Production-Ready

> **Design intent:** Deliver a comprehensive, decision-grade analytics dashboard that gives the Hero Plant Store team full visibility into revenue performance, order trends, customer behaviour, product metrics, marketing effectiveness, and operational health — with date-range flexibility, drill-down capability, export-ready data, and chart accessibility — all in the same dark-theme admin system used across every other module.

---

## 1. Context & Goals

| Property | Value |
|---|---|
| **Module name** | Analytics |
| **URLs** | `/admin/analytics` (main) · `/admin/analytics/revenue` · `/admin/analytics/orders` · `/admin/analytics/products` · `/admin/analytics/customers` · `/admin/analytics/marketing` · `/admin/analytics/garden-services` · `/admin/analytics/ai-care` (redirects to AI Care module) |
| **Parent** | Admin Dashboard (`admin-dashboard-design.md`) |
| **Primary goal** | Give leadership and ops teams data-driven insight into every aspect of store performance in one place |
| **Secondary goals** | Enable export for finance/BI tools; surface emerging trends early; connect marketing spend to revenue; identify underperforming products |
| **User roles** | Super Admin (full) · Operations Manager (full) · Marketing (marketing + customer sections) · Analyst (read-only, all sections) |
| **No access** | Customer Support · Inventory Manager · Garden Services Coordinator |
| **Linked modules** | Orders · Products · Customers · Discounts · AI Care · Garden Services |
| **Page density** | Charts: ~30 · Tables: ~8 · KPI cards: ~24 · Buttons: ~25 · Inputs: ~10 |

---

## 2. Design Tokens

All tokens inherited from `admin-dashboard-design.md §2`. Only semantic aliases are new.

### 2.1 Inherited Admin Tokens (Key)

| Token | Hex | Role |
|---|---|---|
| `admin.color.bg.canvas` | `#0f1117` | Page background |
| `admin.color.bg.sidebar` | `#161b22` | Sidebar |
| `admin.color.bg.surface` | `#1c2128` | Cards, chart panels |
| `admin.color.bg.elevated` | `#22272e` | Hover, input bg |
| `admin.color.bg.overlay` | `#2d333b` | Dropdowns, tooltips |
| `admin.color.text.primary` | `#cdd9e5` | All main text |
| `admin.color.text.secondary` | `#768390` | Muted labels |
| `admin.color.text.tertiary` | `#adbac7` | Axis labels, legends |
| `admin.color.brand.green` | `#00b566` | Primary series, CTAs |
| `admin.color.brand.green.muted` | `#00b566` @ 15% | Selected bg |
| `admin.color.border.default` | `#444c56` | Borders, grid lines |
| `admin.color.border.active` | `#00b566` | Focus, active |
| `admin.color.status.success` | `#57ab5a` | Positive delta |
| `admin.color.status.warning` | `#c69026` | Caution, amber trend |
| `admin.color.status.error` | `#e5534b` | Negative delta |
| `admin.color.status.info` | `#539bf5` | Info, secondary series |
| `admin.color.status.purple` | `#986ee2` | Tertiary series |
| `admin.color.chart.1` | `#00b566` | Chart series 1 — green |
| `admin.color.chart.2` | `#539bf5` | Chart series 2 — blue |
| `admin.color.chart.3` | `#c69026` | Chart series 3 — amber |
| `admin.color.chart.4` | `#986ee2` | Chart series 4 — purple |
| `admin.color.chart.5` | `#e5534b` | Chart series 5 — red |
| `admin.color.chart.grid` | `#444c56` @ 40% | Grid lines |

### 2.2 Analytics Module Semantic Aliases

| Alias | Maps to | Usage |
|---|---|---|
| `ana.page-bg` | `admin.color.bg.canvas` | Page background |
| `ana.card-bg` | `admin.color.bg.surface` | Chart panel bg |
| `ana.card-hover` | `admin.color.bg.elevated` | Table row hover |
| `ana.input-bg` | `admin.color.bg.elevated` | Date picker, dropdowns |
| `ana.overlay-bg` | `admin.color.bg.overlay` | Tooltip, dropdown bg |
| `ana.text` | `admin.color.text.primary` | All text |
| `ana.text-muted` | `admin.color.text.secondary` | Meta, labels |
| `ana.text-label` | `admin.color.text.tertiary` | Axis, legend labels |
| `ana.border` | `admin.color.border.default` | Panel borders |
| `ana.border-muted` | `admin.color.border.default` @ 50% | Grid lines |
| `ana.border-active` | `admin.color.border.active` | Focus |
| `ana.accent` | `admin.color.brand.green` | CTAs, active nav |
| `ana.accent-bg` | `admin.color.brand.green.muted` | Active section bg |
| `ana.focus-ring` | `admin.color.brand.green` | Focus ring |
| `ana.focus-glow` | `0 0 0 3px rgba(0,181,102,0.25)` | Focus glow |
| `ana.shadow` | `0 2px 8px rgba(0,0,0,0.25)` | Panel shadow |
| `ana.positive` | `admin.color.status.success` | Positive delta `↑` |
| `ana.negative` | `admin.color.status.error` | Negative delta `↓` |
| `ana.neutral` | `admin.color.text.secondary` | No-change delta |
| `ana.chart-1` | `admin.color.chart.1` | Revenue, primary |
| `ana.chart-2` | `admin.color.chart.2` | Orders, secondary |
| `ana.chart-3` | `admin.color.chart.3` | AOV, tertiary |
| `ana.chart-4` | `admin.color.chart.4` | Customers |
| `ana.chart-5` | `admin.color.chart.5` | Returns / refunds |
| `ana.chart-grid` | `admin.color.chart.grid` | All chart grid lines |
| `ana.danger` | `admin.color.status.error` | Destructive, alerts |
| `ana.warning` | `admin.color.status.warning` | Caution indicators |

### 2.3 Typography

| Role | Size | Weight | Colour |
|---|---|---|---|
| Page heading | `font.size.5xl` (24px) | 700 | `ana.text` |
| Section nav item | `font.size.sm` (12px) | 500 | `ana.text-muted` |
| Section nav (active) | `font.size.sm` (12px) | 700 | `ana.text` |
| KPI value | `font.size.6xl` (32px) | 800 | `ana.text` |
| KPI label | `font.size.sm` (12px) | 500 | `ana.text-muted` |
| KPI delta positive | `font.size.sm` (12px) | 600 | `ana.positive` |
| KPI delta negative | `font.size.sm` (12px) | 600 | `ana.negative` |
| Section heading | `font.size.4xl` (18px) | 700 | `ana.text` |
| Chart title | `font.size.3xl` (16px) | 600 | `ana.text` |
| Chart axis | `font.size.xs` (11px) | 400 | `ana.text-label` |
| Chart legend | `font.size.xs` (11px) | 500 | `ana.text-label` |
| Chart tooltip value | `font.size.sm` (12px) | 700 | `ana.text` |
| Chart tooltip label | `font.size.xs` (11px) | 400 | `ana.text-muted` |
| Table header | `font.size.xs` (11px) | 700 | `ana.text-label`, uppercase |
| Table cell | `font.size.sm` (12px) | 400 | `ana.text` |
| Table rank | `font.size.sm` (12px) | 700 | `ana.text-muted` |
| Insight callout | `font.size.sm` (12px) | 600 | `ana.text` |
| Compare label | `font.size.xs` (11px) | 500 | `ana.text-muted` |
| Tab label | `font.size.sm` (12px) | 600 | active: `ana.accent` |
| Empty state | `font.size.3xl` (16px) | 600 | `ana.text` |

### 2.4 Spacing, Radius & Motion

Same scale as all admin modules. Notably:
- Chart panel padding: `space.9 = 24px`
- Chart grid gap: `space.9 = 24px`
- KPI card padding: `space.9 = 24px`
- Between section groups: `space.12 = 48px`

### 2.5 Chart Design System

All charts across the Analytics module share these rules:

| Property | Value |
|---|---|
| Background | `ana.card-bg` |
| Border | `1px solid ana.border-muted` |
| Border-radius | `radius.md` |
| Shadow | `ana.shadow` |
| Padding | `space.9 = 24px` |
| Grid lines | `ana.chart-grid`, dashed, opacity 0.5 |
| Axis text | `font.size.xs`, `ana.text-label` |
| Tooltip bg | `ana.overlay-bg` |
| Tooltip border | `1px solid ana.border` |
| Tooltip radius | `radius.sm` |
| Tooltip font | value: `font.size.sm` weight 700; label: `font.size.xs` `ana.text-muted` |
| Legend | Below chart or right; `font.size.xs`; coloured dot `8×8px` per series |
| Empty chart | Icon + `"No data for this period"` centred in chart area |
| `role` | `role="img"` on each chart container |
| `aria-label` | Data summary: `"[Chart title]. [Key insight]. [Date range]."` |
| `[↓ Export]` | Top-right of each chart panel; exports PNG or CSV of that chart |
| `[⤢ Expand]` | Full-screen modal view of that chart |


---

## 3. Page Layout

### 3.1 Overall Structure

```
┌──────────────────────────────────────────────────────────────────────┐
│  TOP BAR (64px)                                                      │
├──────────────┬───────────────────────────────────────────────────────┤
│  SIDEBAR     │  BREADCRUMB: Admin / Analytics                       │
│  (240px)     ├───────────────────────────────────────────────────────┤
│              │  PAGE HEADER                                          │
│              │  [📅 Date Range ▾]  [Compare: Previous period ▾]     │
│              │  [↓ Export All]                                       │
│              ├──────────────────────────────────────────────────────│
│              │  SECTION NAV (horizontal tabs)                        │
│              │  [Overview][Revenue][Orders][Products]                │
│              │  [Customers][Marketing][Garden Services]              │
│              ├───────────────────────────────────────────────────────┤
│              │  ACTIVE SECTION CONTENT                               │
│              │  (Charts + KPI cards + data tables)                   │
└──────────────┴───────────────────────────────────────────────────────┘
```

### 3.2 Section Navigation

```
[ Overview ]  [ Revenue ]  [ Orders ]  [ Products ]  [ Customers ]  [ Marketing ]  [ Garden Services ]
```

| Property | Value |
|---|---|
| Nav height | `44px` |
| Style | Underline-tab style; `2px solid ana.accent` bottom border when active |
| Font | `font.size.sm`, weight 500 inactive / 700 active |
| Colour | `ana.text-muted` inactive / `ana.text` active |
| Hover | `ana.text`, `motion.instant` |
| Focus-visible | `2px` focus ring `ana.focus-ring` |
| `role` | `role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls` |
| Keyboard | Arrow keys; Enter activates |
| URL | Each section updates URL: `/admin/analytics/revenue` |
| Sticky | `position: sticky; top: 64px; z-index: 50; background: ana.page-bg` |

### 3.3 Global Controls (top of page, above section nav)

```
Analytics                   [📅 1 Jul 2026 → 31 Jul 2026  ▾]  [Compare: Previous month ▾]  [↓ Export All]
```

| Control | Options |
|---|---|
| Date range | Today · Yesterday · Last 7 days · Last 30 days · Last 90 days · This month · Last month · Last quarter · Last year · Custom range |
| Compare | None (default) · Previous period · Previous year · Custom |
| Export All | Downloads all sections as multi-sheet Excel or ZIP of CSVs |

**Date range picker (expanded):**

```
┌──────────────────────────────────────────────────────────────────┐
│  [Today][7d][30d][90d][This month][Last month][Last quarter][YTD] │
│  Custom: From [ DD/MM/YYYY ]   To [ DD/MM/YYYY ]                 │
│  [ Apply ]   [ Cancel ]                                           │
└──────────────────────────────────────────────────────────────────┘
```

**Compare overlay:** When comparison is active, all charts show two series — current period (solid line) and comparison period (dashed line, `admin.color.border.default` colour). KPI cards show both values and the % difference.

### 3.4 Chart Layout Grid

Charts are arranged in a responsive CSS grid:

| Layout | Columns | Usage |
|---|---|---|
| Full-width | 1 column, 100% | Main trend charts |
| Side-by-side | 2 columns, 50% each | Two related charts |
| Triple | 3 columns, 33% each | Three KPI-level charts |
| Card row | 4 columns, 25% each | KPI metric cards |

---

## 4. Section — Overview

The default landing section. Shows the most important cross-category metrics.

### 4.1 Overview KPI Cards (8 cards)

```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Total Revenue│ │ Total Orders │ │ Avg Order Val│ │ New Customers│
│ ₹4,82,340   │ │ 4,821        │ │ ₹1,248       │ │ 342          │
│ ↑ +18.4%   │ │ ↑ +12.3%    │ │ ↓ −2.1%     │ │ ↑ +8.4%     │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Units Sold   │ │ Return Rate  │ │ Garden Rev.  │ │ AI Care Conv.│
│ 6,204        │ │ 2.4%         │ │ ₹2,48,000    │ │ 12.4%        │
│ ↑ +9.2%     │ │ ↓ −0.3%     │ │ ↑ +24.1%    │ │ ↑ +2.1%     │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

**KPI card (full spec):**

| Property | Value |
|---|---|
| Background | `ana.card-bg` |
| Border | `1px solid ana.border-muted` |
| Border-radius | `radius.md` |
| Padding | `space.9 = 24px` |
| Shadow | `ana.shadow` |
| Label | `font.size.sm`, weight 500, `ana.text-muted` |
| Value | `font.size.6xl`, weight 800, `ana.text` |
| Delta positive | `↑ +X.X%`, `ana.positive`, weight 600 |
| Delta negative | `↓ −X.X%`, `ana.negative`, weight 600 |
| Delta neutral | `→ 0%`, `ana.neutral` |
| Context | `font.size.xs`, `ana.text-muted`: `"vs previous period"` |
| Compare overlay | When compare active: shows comparison value below delta in `ana.text-muted` smaller |
| Sparkline | `48px`, right-aligned, period trend |
| Hover | `ana.card-hover`, `motion.instant` |
| Click | Navigates to that metric's detail section |
| `aria-label` | `"[label]: [value]. Change: [delta] vs [period]."` |

### 4.2 Revenue Over Time (main chart)

```
┌────────────────────────────────────────────────────────────────────┐
│  Revenue Over Time                   [Daily ▾]  [↓ Export][⤢]    │
│  ₹60,000 ──────────────────────────────────────────── ●           │
│  ₹40,000 ─────────────────────────── ╱─────────────────            │
│  ₹20,000 ──────────────── ╱─────────                               │
│        0 ──────────────╱                                           │
│            Jul 1     Jul 8    Jul 15   Jul 22   Jul 31             │
│  ── Revenue  ── Orders  ── AOV          ·· Previous period        │
└────────────────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Type | Multi-series line chart |
| Height | `320px` |
| Series | Revenue `ana.chart-1` · Orders `ana.chart-2` · AOV `ana.chart-3` |
| Compare | Previous period as `ana.border` dashed line |
| Y-axis left | Revenue `₹` |
| Y-axis right | Order count |
| Toggle | Daily / Weekly / Monthly |
| Tooltip | Date + all series values |
| Click on point | Drills to Orders module filtered by that date |

### 4.3 Sales by Category (Donut)

```
┌────────────────────────────────────────────┐
│  Sales by Category                         │
│       ╭──────╮   ● Indoor Plants  47% ₹2.3L│
│      ╱  47%  ╲   ● Outdoor       23% ₹1.1L│
│     │ Indoor  │   ● Seeds         15% ₹0.7L│
│      ╲       ╱   ● Succulents    10% ₹0.5L│
│       ╰──────╯   ● Other          5% ₹0.2L│
└────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Type | Donut, `200px` diameter |
| Colours | `ana.chart-1` through `ana.chart-5` |
| Centre | Largest category % + name |
| Legend | Right-aligned; click segment filters products table |
| `aria-label` | Full category breakdown text |

### 4.4 Top 5 Performing Products (mini table)

```
┌──────────────────────────────────────────────────────────┐
│  Top Products (by revenue)              [View All →]     │
├───┬───────────────────────────┬───────────┬─────────────┤
│ # │ PRODUCT                   │  REVENUE  │  UNITS SOLD │
├───┼───────────────────────────┼───────────┼─────────────┤
│ 1 │ Monstera Deliciosa M      │  ₹98,402  │     248     │
│ 2 │ Peace Lily S              │  ₹72,180  │     290     │
│ 3 │ Snake Plant               │  ₹61,404  │     204     │
└───┴───────────────────────────┴───────────┴─────────────┘
```

### 4.5 Geographic Revenue Heatmap

```
┌────────────────────────────────────────────────────────────┐
│  Revenue by City (Top 10)                                   │
│  Mumbai    ████████████████████████████   ₹1,24,820        │
│  Pune      ████████████████████           ₹84,210          │
│  Bangalore ████████████                   ₹62,440          │
│  Delhi     ████████                       ₹48,320          │
│  Chennai   █████                          ₹32,180          │
└────────────────────────────────────────────────────────────┘
```

Horizontal bar chart. Click city → filters Orders and Customers module to that city.


---

## 5. Section — Revenue

### 5.1 Revenue KPI Cards (6 cards)

| Card | Value format | Context |
|---|---|---|
| Gross Revenue | `₹4,82,340` | Before discounts and returns |
| Net Revenue | `₹4,38,920` | After discounts and returns |
| Discount Cost | `₹38,420` | `ana.negative` colour — cost framing |
| Refunds Issued | `₹12,180` | `ana.negative` colour |
| Avg Order Value | `₹1,248` | |
| Revenue per Customer | `₹124` | LTV ÷ customers |

### 5.2 Gross vs Net Revenue Chart

```
┌────────────────────────────────────────────────────────────────────┐
│  Gross vs Net Revenue                [Monthly ▾]  [↓ Export][⤢]  │
│  ── Gross Revenue   ── Net Revenue   ▓ Discounts   ▓ Refunds      │
│  [Stacked area or multi-line showing the gap between gross/net]    │
└────────────────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Type | Multi-line chart with shaded area between gross/net lines |
| Gross line | `ana.chart-1` (green) |
| Net line | `ana.chart-2` (blue) |
| Gap fill | `ana.negative` @ 15% opacity (shows discount+refund cost) |
| Hover | Shows gross, net, discount, refund amounts for that period |

### 5.3 Revenue Breakdown Donut

```
┌────────────────────────────────────────────┐
│  Revenue Sources                            │
│  ● Direct plant sales      72%  ₹3.47L    │
│  ● Garden services         18%  ₹0.87L    │
│  ● Pot upsells              7%  ₹0.34L    │
│  ● Seeds / accessories      3%  ₹0.14L    │
└────────────────────────────────────────────┘
```

### 5.4 Discount Cost Analysis

```
┌────────────────────────────────────────────────────────────────────┐
│  Discount Usage & Cost                                              │
├──────────────────────────────┬──────────┬──────────┬──────────────┤
│  DISCOUNT CODE               │  USES    │  COST    │  REV GENERATED│
├──────────────────────────────┼──────────┼──────────┼──────────────┤
│  HERO20                      │   824    │  ₹16,480 │   ₹82,400    │
│  WELCOME15                   │   612    │  ₹9,180  │   ₹61,200    │
│  FREESHIP499                 │  1,204   │  ₹12,040 │  ₹1,20,400   │
└──────────────────────────────┴──────────┴──────────┴──────────────┘
```

| Property | Value |
|---|---|
| Cost column | `ana.negative` colour — cost framing |
| Revenue column | `ana.positive` colour |
| ROI | Implicit from cost vs revenue generated |
| Row click | Opens Discounts module for that code |
| `[View All Discounts →]` | Links to `/admin/discounts` |

### 5.5 Revenue by Payment Method

```
┌────────────────────────────────────────────┐
│  Payment Method Breakdown                   │
│  Visa/Mastercard   58%  ₹2,79,757          │
│  UPI (Razorpay)    28%  ₹1,35,055          │
│  Net Banking        9%  ₹43,411            │
│  COD                5%  ₹24,117            │
└────────────────────────────────────────────┘
```

Horizontal bar chart. No drill-down — informational only.

### 5.6 Revenue Cohort Table (Monthly)

```
┌──────────────────────────────────────────────────────────────────────┐
│  Monthly Revenue Cohort                                               │
├────────┬────────┬────────┬────────┬────────┬────────┬───────────────┤
│ MONTH  │  JAN   │  FEB   │  MAR   │  APR   │  MAY   │  JUN          │
├────────┼────────┼────────┼────────┼────────┼────────┼───────────────┤
│ Jan    │ ₹3.2L  │ ₹0.8L  │ ₹0.6L  │ ₹0.4L  │ ₹0.3L  │  ₹0.2L       │
│ Feb    │        │ ₹2.8L  │ ₹0.7L  │ ₹0.5L  │ ₹0.3L  │  ₹0.2L       │
│ Mar    │        │        │ ₹3.6L  │ ₹0.9L  │ ₹0.6L  │  ₹0.4L       │
└────────┴────────┴────────┴────────┴────────┴────────┴───────────────┘
```

Heat-map colouring: Darker `ana.chart-1` green = higher revenue. Helps identify retention patterns from acquisition cohorts.

---

## 6. Section — Orders

### 6.1 Orders KPI Cards (5 cards)

| Card | Value | Delta |
|---|---|---|
| Total Orders | `4,821` | % vs prev period |
| Orders Today | `124` | vs yesterday |
| Avg Items per Order | `1.8` | |
| Cancellation Rate | `2.4%` | `ana.negative` when rising |
| Return Rate | `1.8%` | `ana.negative` when rising |

### 6.2 Orders Over Time Chart

Multi-series line: Total orders · New customer orders · Returning customer orders.

### 6.3 Order Status Breakdown

```
┌────────────────────────────────────────────┐
│  Order Status Distribution                  │
│  Delivered    89.6%  ████████████████████  │
│  Processing    3.7%  █                     │
│  Shipped       4.8%  █                     │
│  Cancelled     1.9%  ▌                     │
└────────────────────────────────────────────┘
```

Click status row → navigates to Orders module filtered by that status.

### 6.4 Orders by Day of Week / Hour

```
┌────────────────────────────────────────────────────────────────────┐
│  Orders by Day of Week                                               │
│  Mon  ████                                                           │
│  Tue  ██████                                                         │
│  Wed  █████████                                                      │
│  Thu  ████████                                                       │
│  Fri  ████████████                                                   │
│  Sat  ████████████████  ← Peak day                                  │
│  Sun  ██████████                                                     │
└────────────────────────────────────────────────────────────────────┘
```

Paired with an hourly heatmap showing order density by hour (0–23) across days.

### 6.5 Orders by City Table

| Column | Content | Sortable |
|---|---|---|
| City | City name | Yes |
| Orders | Count | Yes |
| Revenue | ₹ total | Yes |
| AOV | Average | Yes |
| % of Total | Share | Yes |

### 6.6 Fulfilment Performance

```
┌────────────────────────────────────────────┐
│  Fulfilment Performance                     │
├────────────────────────────────────────────┤
│  Avg time to fulfil:     1.2 days          │
│  Avg delivery time:      3.4 days          │
│  On-time delivery rate:  91.2%             │
│  Late deliveries:        8.8%  ⚠           │
│                                            │
│  [Carrier Performance →]                   │
└────────────────────────────────────────────┘
```

---

## 7. Section — Products

### 7.1 Products KPI Cards (4 cards)

| Card | Value |
|---|---|
| Total Products | `248` active |
| Best-Selling | Monstera Deliciosa M |
| Lowest Stock | Snake Plant (3 units) |
| Zero-Sales (30d) | `12` products |

### 7.2 Top Products by Revenue Table

```
┌───┬────────────────────────────┬──────────┬───────┬───────┬──────────┐
│ # │ PRODUCT                    │ REVENUE  │ UNITS │  AOV  │  STOCK   │
├───┼────────────────────────────┼──────────┼───────┼───────┼──────────┤
│ 1 │ Monstera Deliciosa M       │ ₹98,402  │  248  │ ₹397  │  234     │
│ 2 │ Peace Lily S               │ ₹72,180  │  290  │ ₹249  │   89     │
│ 3 │ Snake Plant                │ ₹61,404  │  204  │ ₹301  │    3  ⚠ │
└───┴────────────────────────────┴──────────┴───────┴───────┴──────────┘
```

| Property | Value |
|---|---|
| Rows | Top 25; `[Load more]` |
| Stock `⚠` | Low stock indicator, `ana.warning` colour |
| Row click | Opens product edit page |
| `[View All Products →]` | Links to Products module |

### 7.3 Products with Zero Sales (30d)

```
┌────────────────────────────────────────────────────────────────────┐
│  Zero-Sales Products (12)  ⚠  Needs attention       [Export]      │
├───────────────────────────────┬─────────────┬──────────────────────┤
│  PRODUCT                      │  LAST SOLD  │  STOCK               │
├───────────────────────────────┼─────────────┼──────────────────────┤
│  Large Terracotta Pot 20cm    │  45 days ago│  124 units           │
└───────────────────────────────┴─────────────┴──────────────────────┘
```

Panel has amber left border `4px solid ana.warning`. Suggests action: `[Create Discount for These Products →]`.

### 7.4 Product Category Performance

Donut chart showing revenue share per category, plus a table with category / revenue / units / AOV.

### 7.5 Inventory Risk Table

```
┌──────────────────────────────────────────────────────────────────────┐
│  Inventory Risk                                                       │
├────────────────────┬────────┬───────────┬────────────────────────────┤
│  PRODUCT           │ STOCK  │  DAILY SELL│  DAYS REMAINING           │
├────────────────────┼────────┼───────────┼────────────────────────────┤
│  Monstera M        │  234   │  8.3/day  │  28 days  ●  OK           │
│  Snake Plant       │    3   │  6.8/day  │   <1 day  ⚠  URGENT       │
│  Peace Lily S      │   89   │  9.7/day  │   9 days  ●  Reorder soon │
└────────────────────┴────────┴───────────┴────────────────────────────┘
```

| Days remaining | Indicator | Colour |
|---|---|---|
| > 30 days | `●  OK` | `ana.positive` |
| 10–30 days | `●  Reorder soon` | `ana.warning` |
| < 10 days | `⚠  URGENT` | `ana.negative` |

---

## 8. Section — Customers

### 8.1 Customer KPI Cards (5 cards)

| Card | Value |
|---|---|
| Total Customers | `12,481` |
| New This Period | `342` |
| Repeat Purchase Rate | `38.4%` |
| Avg LTV | `₹14,820` |
| Churn (90d inactive) | `1,204` |

### 8.2 New vs Returning Customers Chart

Stacked bar chart — new customers (blue) stacked on returning (green) per period.

### 8.3 Customer Acquisition Channels

```
┌────────────────────────────────────────────┐
│  Customer Acquisition                       │
│  Direct           42%  ████████            │
│  Google Organic   24%  █████               │
│  Instagram        18%  ████                │
│  Referral         10%  ██                  │
│  Google Ads        6%  █                   │
└────────────────────────────────────────────┘
```

Donut chart. Click segment → filters Customers module to that source.

### 8.4 Customer Lifetime Value Distribution

Histogram showing distribution of LTV across customer base. X-axis: LTV brackets (₹0–₹2K, ₹2K–₹5K, ₹5K–₹10K, ₹10K–₹20K, ₹20K+). Y-axis: customer count. Reveals shape of value distribution (power law expected).

### 8.5 Loyalty Tier Distribution

```
┌────────────────────────────────────────────┐
│  Loyalty Tier Breakdown                     │
│  🌿 Plant Lover  10,436  83.6%             │
│  🥈 Silver        1,240   9.9%             │
│  🥇 Gold            521   4.2%             │
│  Unregistered       284   2.3%             │
└────────────────────────────────────────────┘
```

### 8.6 Retention Cohort Table

Same pattern as Revenue Cohort (§5.6) — shows % of customers from a given month who ordered again in subsequent months.

### 8.7 At-Risk Customers

```
┌────────────────────────────────────────────────────────────────────┐
│  At-Risk Customers (1,204)  ⚠  No order in 90 days   [Email All] │
├───────────────────────────────────────────────────────────────────┤
│  Show: top 10 by LTV — so highest-value customers at risk are     │
│  surfaced first for win-back priority                             │
└────────────────────────────────────────────────────────────────────┘
```

`[Email All]` — opens bulk email in Customers module with at-risk segment pre-selected.

---

## 9. Section — Marketing

### 9.1 Marketing KPI Cards (5 cards)

| Card | Value |
|---|---|
| Discount Revenue Impact | `₹2,48,310` revenue generated via codes |
| Discount Cost | `₹38,420` `ana.negative` |
| Coupon Redemption Rate | `18.4%` |
| Email Open Rate | `28.4%` (if Klaviyo integrated) |
| AI Care → Cart Rate | `12.4%` |

### 9.2 Discount Performance Table

Full version of Revenue §5.4 — shows all discount codes with uses, cost, revenue generated, ROI calculation.

### 9.3 Campaign Performance

If email platform integrated (Klaviyo / Mailchimp):

```
┌──────────────────────────────────────────────────────────────────────┐
│  Email Campaigns                                                      │
├────────────────────┬───────────┬──────────┬──────────┬──────────────┤
│  CAMPAIGN          │  SENT     │  OPENED  │  CLICKED │  REVENUE     │
├────────────────────┼───────────┼──────────┼──────────┼──────────────┤
│  July Monstera Sale│  12,481   │  3,541 28%│  842  7% │  ₹42,100    │
└────────────────────┴───────────┴──────────┴──────────┴──────────────┘
```

If not integrated: `"Connect your email platform in Integrations to see campaign data."` with `[Go to Integrations →]`.

### 9.4 Traffic Source → Revenue Funnel

```
┌────────────────────────────────────────────────────────────────────┐
│  Traffic to Revenue Funnel                                           │
│  Visitors:    48,210  ████████████████████████                      │
│  Sessions with PDP: 18,420  ████████████████                        │
│  Added to cart:      4,820  ████████                                 │
│  Checkout started:   2,810  █████                                    │
│  Orders placed:      4,821  ████████ (includes direct/return visits) │
└────────────────────────────────────────────────────────────────────┘
```

Requires Google Analytics 4 integration for traffic data.

---

## 10. Section — Garden Services

### 10.1 Garden Services KPI Cards (5 cards)

| Card | Value |
|---|---|
| Total Bookings | `124` |
| Revenue | `₹2,48,000` |
| Completed | `89 (71.8%)` |
| Avg Booking Value | `₹2,000` |
| Cancellation Rate | `8.1%` |

### 10.2 Bookings Over Time

Bar chart — bookings per day/week/month, `ana.chart-4` (purple).

### 10.3 Revenue by Service Type

```
┌────────────────────────────────────────────┐
│  Revenue by Service                         │
│  Balcony Garden Setup   42%  ₹1,04,160    │
│  Lawn Maintenance       28%  ₹69,440      │
│  Plant Health Check     18%  ₹44,640      │
│  Terrace Garden         12%  ₹29,760      │
└────────────────────────────────────────────┘
```

### 10.4 Bookings by City

Same horizontal bar chart pattern as §4.5.

### 10.5 Gardener Utilisation

```
┌────────────────────────────────────────────────────────────────────┐
│  Gardener Performance                                                │
├─────────────────┬──────────┬──────────┬───────────┬───────────────┤
│  GARDENER       │ BOOKINGS │  REVENUE │  AVG RATING│  UTILISATION  │
├─────────────────┼──────────┼──────────┼───────────┼───────────────┤
│  Ramesh Patil   │   18     │ ₹36,000  │  ★4.9     │  92%          │
│  Sunil Kumar    │   14     │ ₹28,000  │  ★4.7     │  72%          │
└─────────────────┴──────────┴──────────┴───────────┴───────────────┘
```


---

## 11. Chart Toolbar — Standard Per-Chart

Every chart panel shares a consistent toolbar at the top-right corner.

```
[Chart Title]                          [Daily ▾]  [Compare ▾]  [↓]  [⤢]
```

| Control | Behaviour |
|---|---|
| Granularity toggle `[Daily ▾]` | Daily / Weekly / Monthly; updates chart in-place |
| Compare override `[Compare ▾]` | Per-chart comparison — overrides global compare setting |
| `[↓]` Download | Opens: `[📊 Download PNG]` `[📋 Download CSV]` |
| `[⤢]` Expand | Full-screen modal showing chart at maximum size |

**Chart expand modal:**

| Property | Value |
|---|---|
| Max-width | `1200px`, `90vh` height |
| Background | `ana.card-bg` |
| Border-radius | `radius.lg` |
| Shadow | `0 20px 60px rgba(0,0,0,0.4)` |
| `role` | `role="dialog"`, `aria-modal="true"`, `aria-label="[Chart title] — expanded view"` |
| Focus trap | Yes |
| Close | `×` + Escape |
| Shows | Chart at full size + data table below |

---

## 12. Data Tables Under Charts

Every major chart offers an expandable data table view.

```
[Chart title]                                   [Show Data Table ▾]
[chart visible]

─── DATA TABLE ────────────────────────────────────────────────────
DATE        REVENUE      ORDERS       AOV
1 Jul 2026  ₹12,420      42           ₹296
2 Jul 2026  ₹18,840      58           ₹325
...
```

| Property | Value |
|---|---|
| Toggle | `[Show Data Table ▾]` / `[Hide Data Table ▲]` |
| Table style | Same as admin table (§7.1 of admin-dashboard spec) |
| Sortable | All columns sortable |
| Export | `[↓ Export Table]` downloads CSV of this specific table |
| Empty | `"No data for this period."` |
| `aria-label` | `"Data for [chart title]"` |

---

## 13. Insight Callout Cards

Auto-generated insights shown above or below relevant charts when the system detects a notable trend.

```
┌────────────────────────────────────────────────────────────────────┐
│  💡  Revenue is up 18.4% vs last month — the highest monthly       │
│     growth in 6 months. Monstera Deliciosa M drove 32% of         │
│     the increase.                                                   │
└────────────────────────────────────────────────────────────────────┘
```

```
┌────────────────────────────────────────────────────────────────────┐
│  ⚠️  3 products have had zero sales in the last 30 days while       │
│     carrying more than 50 units of stock. Consider running a       │
│     targeted discount.  [ Create Discount → ]                      │
└────────────────────────────────────────────────────────────────────┘
```

**Insight card:**

| Property | Value |
|---|---|
| Positive | Background `ana.positive` @ 6%, border-left `4px solid ana.positive` |
| Warning | Background `ana.warning` @ 6%, border-left `4px solid ana.warning` |
| Border-radius | `radius.md` |
| Icon | `💡` info / `⚠️` warning |
| Font | `font.size.sm`, weight 600, `ana.text` |
| CTA | Inline ghost link to relevant action |
| Dismiss | `×` button; dismissed state saved to `localStorage` per insight ID |
| `role` | `role="region"`, `aria-label="Insight"` |
| `aria-live` | `"polite"` — announced when new insight appears |

---

## 14. Export System

### 14.1 Export All

```
[↓ Export All]
  ┌──────────────────────────────────────┐
  │  Export format:                      │
  │  ( ● ) Excel (.xlsx) — all sections │
  │  ( ○ ) ZIP of CSVs — all sections   │
  │                                      │
  │  Date range: 1 Jul 2026 → 31 Jul     │
  │                                      │
  │  [ Cancel ]    [ Export ]            │
  └──────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Excel export | Multi-sheet workbook — one sheet per section |
| ZIP export | One CSV per chart/table |
| File name | `hero-analytics-2026-07.xlsx` |
| Large exports | Background job if > 10,000 rows; email download link |
| `role` | `role="dialog"`, `aria-modal="true"` |

### 14.2 Per-Chart Export

Each chart `[↓]` button shows:

```
[ 📊 Download chart as PNG ]
[ 📋 Download data as CSV ]
```

PNG: Chart rendered via canvas/SVG → PNG. Includes chart title and date range as caption.
CSV: Underlying data rows, headers matching column names.

---

## 15. Accessibility Requirements

### 15.1 Focus Management

| Interaction | Focus behaviour |
|---|---|
| Analytics page load | Focus → date range picker (first control) |
| Section tab switch | Focus → first KPI card or chart in section |
| Chart expand modal open | Focus → modal heading |
| Chart expand modal close | Focus → expand button that triggered it |
| Date range picker open | Focus → first quick option ("Today") |
| Date range apply | Picker closes; focus → Apply button briefly, then → page heading |
| Export modal open | Focus → format radio group |
| Export modal close | Focus → Export All button |
| Insight CTA click | Navigates to linked module; focus → that page's `<h1>` |
| Insight dismiss | Focus stays on or near dismiss area; insight removed |

### 15.2 Full ARIA Map

| Component | ARIA |
|---|---|
| Breadcrumb | `<nav aria-label="Breadcrumb">`, `aria-current="page"` |
| Page heading | `<h1>` — `"Analytics"` |
| Section nav | `role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls` |
| Section panels | `role="tabpanel"`, `aria-labelledby` |
| Global date range | `aria-label="Date range"` on trigger button |
| Compare toggle | `aria-label="Compare to"` on trigger |
| KPI card row | `role="region"`, `aria-label="[section] metrics"` |
| KPI card | `aria-label="[label]: [value]. Change: [delta] vs [period]."` |
| Sparkline | `aria-hidden="true"` (decorative — value is in `aria-label` on card) |
| All charts | `role="img"`, `aria-label` with full data summary |
| Chart granularity | `aria-label="Chart granularity"` |
| Chart compare | `aria-label="Compare period for this chart"` |
| Chart expand | `aria-label="Expand [chart title] to full screen"` |
| Chart download | `aria-label="Download [chart title]"` |
| Chart expand modal | `role="dialog"`, `aria-modal="true"`, `aria-label="[title] — expanded"` |
| Data table | `role="grid"`, `aria-label="Data for [chart title]"` |
| Table headers | `role="columnheader"`, `aria-sort` |
| Show data table | `aria-expanded`, `aria-controls` |
| Insight card | `role="region"`, `aria-label="Insight"` |
| Insight dismiss | `aria-label="Dismiss this insight"` |
| Inventory risk rows | `aria-label="[product]: [n] days of stock remaining. [status]"` |
| Zero-sales rows | `aria-label="[product]: zero sales in [n] days. [stock] units in stock."` |
| Export modal | `role="dialog"`, `aria-modal="true"`, focus trap |
| Export radio group | `role="radiogroup"`, `aria-label="Export format"` |
| City bar chart | Bars `aria-label="[city]: ₹[revenue]"` |
| Cohort table | `role="grid"`, `aria-label="[type] cohort analysis"` |
| Funnel chart | `role="img"`, `aria-label` with all funnel steps |

### 15.3 Keyboard Navigation Map

| Key | Behaviour |
|---|---|
| `Tab` | Forward through interactive elements |
| `Shift+Tab` | Backward |
| `Arrow Left/Right` | Navigate section tabs |
| `Enter` | Activate button/link; open date range picker; expand chart |
| `Space` | Toggle radio buttons in export modal |
| `Escape` | Close chart expand modal / export modal / date picker |
| `⌘K` | Global search (top bar) |

### 15.4 Chart Accessibility Standards

Every chart must provide a text alternative that conveys the meaningful insight, not just "this is a bar chart":

**Good `aria-label`:** `"Revenue Over Time. Revenue grew from ₹12,420 on July 1 to ₹18,840 on July 31, an increase of 51.7%. Peak day was July 28 at ₹24,810."`

**Bad `aria-label`:** `"Bar chart showing revenue"`

All numeric data must also be available in the data table view (§12), ensuring users of assistive technology can access the underlying numbers even if chart `aria-label` is summary-only.

### 15.5 Testable Acceptance Criteria

| # | Criterion | Method | Pass |
|---|---|---|---|
| A1 | No contrast failures | axe DevTools | Zero critical |
| A2 | All focus rings visible (`2px solid #00b566` + glow) | Manual Tab | Every element |
| A3 | Section tabs keyboard-navigable | Arrow keys | `aria-selected` updates |
| A4 | All charts have meaningful `aria-label` | Screen reader | Insight data announced |
| A5 | All charts have accessible data table alternative | Screen reader | Data table toggle operable |
| A6 | Chart expand modal focus-trapped | Keyboard | Tab cycles inside only |
| A7 | Chart expand closes on Escape | Keyboard | Focus returns to expand button |
| A8 | KPI cards have full `aria-label` | Screen reader | Value + delta announced |
| A9 | Sparklines are `aria-hidden` | Screen reader | Not announced (data on card) |
| A10 | Insight callouts announced | Screen reader | `aria-live="polite"` fires |
| A11 | `prefers-reduced-motion` respected | OS setting | Chart animations disabled |

---

## 16. Content & Tone Standards

### 16.1 Section Names

| Internal | Display | Never use |
|---|---|---|
| `overview` | `Overview` | "Summary", "Dashboard" |
| `revenue` | `Revenue` | "Sales", "Income" |
| `orders` | `Orders` | "Transactions" |
| `products` | `Products` | "Inventory", "Catalogue" |
| `customers` | `Customers` | "Users", "Accounts" |
| `marketing` | `Marketing` | "Promotions", "Campaigns" |
| `garden_services` | `Garden Services` | "Services" |

### 16.2 Metric Naming Standards

| Metric | Display | Notes |
|---|---|---|
| Gross revenue | `"Gross Revenue"` | Always before discounts/returns |
| Revenue after deductions | `"Net Revenue"` | Never "actual revenue" |
| Discount impact | `"Discount Cost"` | Framed as cost, not "savings" |
| Returned amount | `"Refunds Issued"` | Not "refund losses" |
| % returning customers | `"Repeat Purchase Rate"` | Not "loyalty rate" |
| 90-day inactive | `"At-Risk Customers"` | Not "churned" or "lost" |
| Cart addition from AI | `"AI → Cart Conversion Rate"` | Must show denominator |

### 16.3 Delta Formatting

| Change | Format | Example |
|---|---|---|
| Positive | `↑ +X.X%` in `ana.positive` | `↑ +18.4%` |
| Negative | `↓ −X.X%` in `ana.negative` | `↓ −2.1%` |
| Neutral | `→ 0.0%` in `ana.neutral` | `→ 0.0%` |
| Comparison label | `"vs previous period"` | Never "vs last time" |
| Large change (>50%) | Show absolute also: `↑ +82.4% (₹+84,210)` | |

### 16.4 Number Format

| Type | Format | Example |
|---|---|---|
| Currency < ₹1,000 | `₹XXX` | `₹840` |
| Currency ₹1,000–₹99,999 | `₹X,XXX` | `₹14,820` |
| Currency ₹1,00,000+ | Indian system | `₹4,82,340` |
| Large currency (KPI) | Abbreviated | `₹4.8L` (with full on hover) |
| Percentage | `XX.X%` | `18.4%` |
| Count | Indian commas | `14,821` |
| Large count (KPI) | `14.8K` | Abbreviated |
| Date axis | `DD MMM` | `15 Jul` |
| Decimal precision | Max 1 in UI; 2 in exports | |

---

## 17. Anti-Patterns & Prohibited Implementations

| Anti-pattern | Why prohibited | Correct approach |
|---|---|---|
| Raw hex values in CSS | Breaks token system | Use `admin.*` / `ana.*` tokens only |
| `outline: none` | WCAG failure | `outline: 2px solid ana.focus-ring` always |
| Charts with no text alternative | Screen readers get nothing | `role="img"` + meaningful `aria-label` + data table |
| Sparklines with `aria-label` describing data | Redundant with parent card | `aria-hidden="true"` — data is on parent card |
| Rendering all 365 data points without virtualisation | Performance — chart lag | Aggregate by week/month for large ranges; cap at 90 data points per series |
| Discount cost shown as "savings" | Misleading framing | Always frame as cost to the business |
| Showing "churn rate" instead of "at-risk customers" | Churn implies certainty; 90d no-order is at-risk, not churned | Use `"At-Risk"` until confirmed lapsed |
| Revenue metric without clarifying gross/net | Ambiguous to finance | Always specify Gross or Net |
| Auto-selecting the widest date range on load | Slow initial load | Default to Last 30 days |
| Export running synchronously for large datasets | UI blocks | Background job for > 10,000 rows; email link |
| Insight callouts that cannot be dismissed | Clutters page over time | Always provide dismiss with state saved |
| Cohort table without colour scale legend | Impossible to interpret | Always show colour scale key |
| Missing compare context on KPI deltas | "vs what?" | Always show comparison period label |

---

## 18. Edge-Case Handling

| Scenario | Behaviour |
|---|---|
| No data for selected period | Each chart shows empty state: icon + `"No data for this period."` + `[Clear Date Range]` |
| Single data point (e.g. Today view) | Show bar/point chart not line chart; disable granularity toggle |
| Revenue = ₹0 for a period | Show `₹0` not blank; delta shows `→ N/A` if prev period also ₹0 |
| Negative net revenue (refunds > revenue) | Value in `ana.negative`; label suffix `"(net loss)"` |
| Zero new customers in period | KPI shows `0`, delta `→ 0%`; no division-by-zero error |
| Compare period has 0 orders | Delta shows `"N/A"` not infinity |
| All products have zero sales (new store) | Zero-sales table shows all; `"Get your first sale! [View Storefront →]"` |
| Garden Services not yet used | Section shows empty state: `"No bookings yet. [Go to Garden Services →]"` |
| Email platform not connected | Marketing section shows partial data + `"Connect Klaviyo to see email metrics. [Go to Integrations →]"` |
| Analyst role views Marketing section | Full read-only access; no `[Email All]` or `[Create Discount]` action buttons |
| Export file > 50MB | Warn: `"This export is large. You'll receive a download link by email within a few minutes."` |
| Date range > 1 year | Force Monthly granularity; disable Daily toggle for performance |
| Cohort table with < 3 months data | Shows partial cohort with note: `"More data will appear as months pass."` |

---

## 19. Performance Requirements

| Metric | Target | Rule |
|---|---|---|
| Analytics page load (Overview) | `< 2s` | KPI cards SSR; charts lazy-loaded per section |
| Section switch | `< 500ms` | Section data prefetched on hover-intent |
| Chart render | `< 500ms` | Skeleton placeholder shown immediately |
| Date range change | `< 1s` | Debounced 250ms; all charts update simultaneously |
| Data table toggle | `< 200ms` | Data already fetched with chart; no extra API call |
| Export (≤ 1,000 rows) | `< 2s` | Client-side or fast server generation |
| Export (> 1,000 rows) | Background job | Email link when ready |
| Insight generation | `< 3s` | Pre-computed server-side; cached 15 min |
| Chart expand modal | `< 100ms` | Reuses already-rendered chart; no re-fetch |

---

## 20. Shopify & Third-Party Integration

### 20.1 Data Sources

| Metric type | Source |
|---|---|
| Orders, revenue, products | Shopify Admin API (`orders`, `products`, `customers`) |
| Discount usage | Shopify GraphQL Discount API |
| Inventory levels | Shopify Inventory API |
| Customer acquisition channel | Shopify `customer.source` + UTM params stored in order attributes |
| Traffic data | Google Analytics 4 (via GA4 Data API) |
| Email metrics | Klaviyo API / Mailchimp API |
| AI Care data | Custom backend (see `admin-ai-care-design.md §15`) |
| Garden Services data | Custom backend (see `admin-garden-services-design.md`) |

### 20.2 Data Aggregation Strategy

Analytics data is pre-aggregated server-side and cached. The admin UI queries a **custom analytics API**, not Shopify directly for each chart render (to avoid rate limits and latency).

```
Shopify Webhooks → Event stream → Analytics DB (PostgreSQL/BigQuery)
                                         ↓
                               Aggregation jobs (hourly/nightly)
                                         ↓
                               Analytics API → Admin UI
```

| Aggregation | Frequency |
|---|---|
| Real-time KPIs (orders today, revenue today) | Every 5 minutes |
| Daily aggregates | Nightly at 02:00 IST |
| Cohort tables | Weekly |
| Insight generation | Every 6 hours |

### 20.3 Key Analytics API Endpoints

| Endpoint | Returns |
|---|---|
| `GET /api/admin/analytics/overview?range=30d` | All Overview KPIs + sparkline data |
| `GET /api/admin/analytics/revenue?range=30d&granularity=daily` | Revenue chart data |
| `GET /api/admin/analytics/orders?range=30d` | Orders section data |
| `GET /api/admin/analytics/products?range=30d&limit=25` | Top products + zero-sales |
| `GET /api/admin/analytics/customers?range=30d` | Customer metrics + cohort |
| `GET /api/admin/analytics/marketing?range=30d` | Discount + campaign data |
| `GET /api/admin/analytics/garden?range=30d` | Garden services metrics |
| `GET /api/admin/analytics/insights?range=30d` | Auto-generated insight cards |
| `GET /api/admin/analytics/export?section=all&range=30d&format=xlsx` | Export job creation |
| `GET /api/admin/analytics/export/status/[job_id]` | Export job status polling |

---

## 21. Component Migration Notes

### 21.1 Reused Admin Components

| Component | Source | Usage |
|---|---|---|
| Admin primary/secondary buttons | `admin-dashboard-design.md §7.3` | Export, drill-down CTAs |
| Admin table | `admin-dashboard-design.md §7.1` | Data tables under charts |
| Admin modal shell | `admin-dashboard-design.md §7.5` | Chart expand, export modal |
| Admin toast | `admin-dashboard-design.md §7.6` | Export success notification |
| Admin tooltip | `admin-dashboard-design.md §7.7` | Metric definitions on hover |
| Admin skeleton | `admin-dashboard-design.md` | Chart loading states |
| Admin status badge | `admin-dashboard-design.md §7.4` | Inventory risk status |

### 21.2 Page-Exclusive Components

| Component | Notes |
|---|---|
| Section navigation (horizontal tab bar, sticky) | Analytics only |
| Multi-series line chart with dual Y-axis | Analytics + dashboard use |
| Donut chart with legend | Analytics + dashboard |
| Horizontal bar chart (categorical) | Analytics only |
| Stacked area chart | Revenue section only |
| Cohort heat-map table | Analytics only |
| Conversion funnel chart | Analytics + AI Care |
| Inventory risk table with days-remaining | Analytics + Inventory module |
| Geographic revenue bar chart | Analytics only |
| Granularity toggle (Daily/Weekly/Monthly) | Analytics only |
| Chart expand modal | Analytics only |
| Data table beneath chart (toggle) | Analytics only |
| Insight callout card (auto-generated) | Analytics only |
| Compare period overlay on charts | Analytics only |
| Order heatmap (day × hour) | Analytics only |

---

## 22. Analytics & Tracking Events

| Event | Trigger | Properties |
|---|---|---|
| `analytics_view` | Page load | `admin_id`, `section`, `date_range` |
| `analytics_section_switch` | Tab switch | `admin_id`, `section` |
| `analytics_date_change` | Date range changed | `admin_id`, `range`, `is_custom` |
| `analytics_compare_toggle` | Compare enabled/disabled | `admin_id`, `compare_period` |
| `analytics_chart_expand` | Expand button clicked | `admin_id`, `chart_name` |
| `analytics_chart_download` | Download clicked | `admin_id`, `chart_name`, `format` |
| `analytics_data_table_toggle` | Table shown/hidden | `admin_id`, `chart_name`, `visible` |
| `analytics_export_all` | Export initiated | `admin_id`, `format`, `range` |
| `analytics_granularity_change` | Daily/Weekly/Monthly changed | `admin_id`, `chart_name`, `granularity` |
| `analytics_insight_dismiss` | Insight dismissed | `admin_id`, `insight_id` |
| `analytics_insight_cta` | Insight CTA clicked | `admin_id`, `insight_id`, `destination` |
| `analytics_drilldown` | Chart click → module | `admin_id`, `chart_name`, `filter_applied` |
| `analytics_chart_click` | Data point clicked | `admin_id`, `chart_name`, `x_value` |

---

## 23. Internationalisation (i18n)

```json
{
  "ana.page.title": "Analytics",

  "ana.nav.overview": "Overview",
  "ana.nav.revenue": "Revenue",
  "ana.nav.orders": "Orders",
  "ana.nav.products": "Products",
  "ana.nav.customers": "Customers",
  "ana.nav.marketing": "Marketing",
  "ana.nav.garden": "Garden Services",

  "ana.date.today": "Today",
  "ana.date.yesterday": "Yesterday",
  "ana.date.last_7": "Last 7 days",
  "ana.date.last_30": "Last 30 days",
  "ana.date.last_90": "Last 90 days",
  "ana.date.this_month": "This month",
  "ana.date.last_month": "Last month",
  "ana.date.last_quarter": "Last quarter",
  "ana.date.ytd": "Year to date",
  "ana.date.custom": "Custom range",

  "ana.compare.none": "No comparison",
  "ana.compare.prev_period": "Previous period",
  "ana.compare.prev_year": "Previous year",

  "ana.delta.vs": "vs {{period}}",
  "ana.delta.na": "N/A",

  "ana.granularity.daily": "Daily",
  "ana.granularity.weekly": "Weekly",
  "ana.granularity.monthly": "Monthly",

  "ana.chart.expand": "Expand {{chart}} to full screen",
  "ana.chart.download": "Download {{chart}}",
  "ana.chart.download_png": "Download chart as PNG",
  "ana.chart.download_csv": "Download data as CSV",
  "ana.chart.show_table": "Show Data Table",
  "ana.chart.hide_table": "Hide Data Table",
  "ana.chart.no_data": "No data for this period.",

  "ana.export.title": "Export Analytics",
  "ana.export.format_excel": "Excel (.xlsx) — all sections",
  "ana.export.format_zip": "ZIP of CSVs — all sections",
  "ana.export.action": "Export",
  "ana.export.large_warning": "This export is large. You'll receive a download link by email.",
  "ana.export.success": "Export ready. Download link sent to {{email}}.",

  "ana.kpi.total_revenue": "Total Revenue",
  "ana.kpi.net_revenue": "Net Revenue",
  "ana.kpi.gross_revenue": "Gross Revenue",
  "ana.kpi.total_orders": "Total Orders",
  "ana.kpi.aov": "Avg Order Value",
  "ana.kpi.new_customers": "New Customers",
  "ana.kpi.units_sold": "Units Sold",
  "ana.kpi.return_rate": "Return Rate",
  "ana.kpi.garden_revenue": "Garden Revenue",
  "ana.kpi.ai_conversion": "AI Care → Cart",
  "ana.kpi.discount_cost": "Discount Cost",
  "ana.kpi.repeat_rate": "Repeat Purchase Rate",

  "ana.insight.dismiss": "Dismiss this insight",
  "ana.insight.positive": "💡 {{message}}",
  "ana.insight.warning": "⚠️ {{message}}",

  "ana.empty.no_data": "No data for this period.",
  "ana.empty.no_bookings": "No bookings yet.",
  "ana.empty.no_sales": "Get your first sale!",
  "ana.empty.connect_email": "Connect your email platform to see campaign data.",
  "ana.empty.no_campaigns": "No campaigns sent in this period."
}
```

---

## 24. Final Summary — Complete Section Map

```
Admin Analytics Module — v1.0
Complete Design Specification
═══════════════════════════════════════════════════════════════════════
CORE SPEC (§1–§14)

§1   Context & Goals
§2   Design Tokens (24 admin colour tokens, 26 ana.* aliases,
     typography × 21, chart design system × 10 shared rules)

LAYOUT & NAVIGATION (§3)
§3   Page Layout
     §3.1  Overall structure (sticky section nav)
     §3.2  Section Navigation (7 tabs, URL-synced)
     §3.3  Global Controls (date range, compare, export all)
     §3.4  Chart Layout Grid (full / 2-col / 3-col / card-row)

SECTION — OVERVIEW (§4)
§4.1  8 KPI cards (full spec with compare overlay + sparkline)
§4.2  Revenue Over Time — 3-series line chart
§4.3  Sales by Category — donut chart
§4.4  Top 5 Products — mini table
§4.5  Geographic Revenue — horizontal bar chart

SECTION — REVENUE (§5)
§5.1  6 KPI cards (gross, net, discount cost, refunds, AOV, RPU)
§5.2  Gross vs Net Revenue — stacked area chart
§5.3  Revenue Sources — donut chart
§5.4  Discount Cost Analysis — sortable table
§5.5  Revenue by Payment Method — bar chart
§5.6  Revenue Cohort Table — heat-map grid

SECTION — ORDERS (§6)
§6.1  5 KPI cards
§6.2  Orders Over Time — multi-series line
§6.3  Order Status Breakdown — horizontal bars
§6.4  Orders by Day of Week + Hourly Heatmap
§6.5  Orders by City Table
§6.6  Fulfilment Performance Panel

SECTION — PRODUCTS (§7)
§7.1  4 KPI cards
§7.2  Top Products by Revenue — full table (25 rows)
§7.3  Zero-Sales Products — amber-bordered warning panel
§7.4  Product Category Performance — donut + table
§7.5  Inventory Risk Table — days-remaining with urgency colours

SECTION — CUSTOMERS (§8)
§8.1  5 KPI cards
§8.2  New vs Returning — stacked bar
§8.3  Acquisition Channels — donut
§8.4  LTV Distribution — histogram
§8.5  Loyalty Tier Distribution — bar chart
§8.6  Retention Cohort Table
§8.7  At-Risk Customers panel with [Email All]

SECTION — MARKETING (§9)
§9.1  5 KPI cards
§9.2  Discount Performance Table
§9.3  Campaign Performance (if email platform connected)
§9.4  Traffic → Revenue Funnel

SECTION — GARDEN SERVICES (§10)
§10.1 5 KPI cards
§10.2 Bookings Over Time
§10.3 Revenue by Service Type
§10.4 Bookings by City
§10.5 Gardener Utilisation Table

SHARED CHART SYSTEM (§11–§13)
§11  Chart Toolbar (granularity, compare override, download, expand)
     Chart Expand Modal (full-screen, focus-trapped)
§12  Data Tables Under Charts (toggle, sort, export per-chart)
§13  Insight Callout Cards (auto-generated, dismissible, two types)

EXPORT SYSTEM (§14)
§14  Export All modal (Excel/ZIP), per-chart PNG + CSV

EXTENDED IMPLEMENTATION GUIDE (§15–§24)

§15  Accessibility Requirements
     • Focus management (9 scenarios)
     • Full ARIA map (24 components)
     • Keyboard map (7 keys)
     • Chart accessibility standard + example
     • 11 testable acceptance criteria

§16  Content & Tone Standards
     • Section names · Metric naming · Delta format · Number format

§17  Anti-Patterns (× 13 prohibited implementations)

§18  Edge-Case Handling (× 13 scenarios)

§19  Performance Requirements (9 metrics)

§20  Shopify & Third-Party Integration
     • Data sources × 8
     • Aggregation strategy + architecture diagram
     • 10 custom analytics API endpoints

§21  Component Migration Notes
     • 7 reused admin components
     • 15 page-exclusive components

§22  Analytics & Tracking Events (× 13 events)

§23  Internationalisation (60 i18n keys)

§24  Final Summary — Section Map (this section)

═══════════════════════════════════════════════════════════════════════
Total: ~2,000 lines | 24 sections | 7 analytics sections
WCAG 2.2 AA | Admin dark token system (Outfit)

Companion documents:
  admin-dashboard-design.md     ← Admin system tokens & shared components
  admin-orders-design.md        ← Orders module (drill-down target)
  admin-products-design.md      ← Products module (drill-down target)
  admin-customers-design.md     ← Customers module (drill-down target)
  admin-discounts-design.md     ← Discounts module (drill-down target)
  admin-ai-care-design.md       ← AI Care module (AI section data source)
  design-system.md              ← Master storefront design system

Last updated: June 2026
═══════════════════════════════════════════════════════════════════════
```

---

*Document version: 1.0 (complete) — Admin Analytics Module*
*Sections: 1–14 (core spec) + 15–24 (extended implementation guide)*
*Guideline standard: WCAG 2.2 AA | Token system: Admin dark (Outfit)*
*Companion: `admin-dashboard-design.md` · all admin module specs*
*Last updated: June 2026*
