# Admin — Orders Module
## Design Specification v1.0 — Production-Ready

> **Design intent:** Deliver a high-density, real-time orders management interface that gives operations staff complete control over the full order lifecycle — from placement through fulfilment, refunds, cancellations, and returns — in a dark-theme admin environment that is keyboard-first, WCAG 2.2 AA compliant, and optimised for daily fulfilment workflows.

---

## 1. Context & Goals

| Property | Value |
|---|---|
| **Module name** | Orders |
| **URLs** | `/admin/orders` (list) · `/admin/orders/[id]` (detail) · `/admin/orders/new` (create) |
| **Parent** | Admin Dashboard (`admin-dashboard-design.md`) |
| **Primary goal** | Give ops staff a single pane to track, fulfil, and manage every order at any lifecycle stage |
| **Secondary goals** | Reduce fulfilment errors; surface payment issues; enable fast refunds/cancellations; complete audit trail |
| **User roles** | Super Admin (full) · Operations Manager (full) · Customer Support (full) · Inventory Manager (view+stock) · Analyst (read-only) |
| **Linked pages** | Storefront Order Tracking · Inventory module · Customers module · Payments module |
| **Page density** | Tables: 3 · Buttons: ~60 · Inputs: ~30 · Cards: ~20 · Charts: 4 |
| **Volume** | Designed for 10,000+ orders/month; virtual scroll required beyond 100 rows |

---

## 2. Design Tokens

All tokens inherited from `admin-dashboard-design.md §2`.

### 2.1 Inherited Admin Tokens (Key)

| Token | Hex | Role |
|---|---|---|
| `admin.color.bg.canvas` | `#0f1117` | Page background |
| `admin.color.bg.sidebar` | `#161b22` | Sidebar |
| `admin.color.bg.surface` | `#1c2128` | Cards, table bg |
| `admin.color.bg.elevated` | `#22272e` | Input bg, hover rows |
| `admin.color.bg.overlay` | `#2d333b` | Modals, dropdowns |
| `admin.color.text.primary` | `#cdd9e5` | Primary text |
| `admin.color.text.secondary` | `#768390` | Muted/meta text |
| `admin.color.text.tertiary` | `#adbac7` | Labels |
| `admin.color.brand.green` | `#00b566` | CTAs, active, accents |
| `admin.color.border.default` | `#444c56` | Borders, dividers |
| `admin.color.border.active` | `#00b566` | Focused / active |
| `admin.color.status.success` | `#57ab5a` | Delivered, paid |
| `admin.color.status.warning` | `#c69026` | Processing, pending |
| `admin.color.status.error` | `#e5534b` | Cancelled, failed |
| `admin.color.status.info` | `#539bf5` | Shipped, transit |
| `admin.color.status.purple` | `#986ee2` | Returned |
| `admin.color.status.orange` | `#cc6b2c` | Attempted delivery |

### 2.2 Orders Module Semantic Aliases

| Alias | Maps to | Usage |
|---|---|---|
| `ord.page-bg` | `admin.color.bg.canvas` | Page background |
| `ord.card-bg` | `admin.color.bg.surface` | All panels and table bg |
| `ord.card-hover` | `admin.color.bg.elevated` | Table row hover |
| `ord.input-bg` | `admin.color.bg.elevated` | All inputs |
| `ord.overlay-bg` | `admin.color.bg.overlay` | Modals, dropdowns |
| `ord.text` | `admin.color.text.primary` | Primary text |
| `ord.text-muted` | `admin.color.text.secondary` | Meta, timestamps |
| `ord.text-label` | `admin.color.text.tertiary` | Column headers, labels |
| `ord.border` | `admin.color.border.default` | All borders |
| `ord.border-muted` | `admin.color.border.default` @ 50% | Subtle dividers |
| `ord.border-active` | `admin.color.border.active` | Focus, active rows |
| `ord.accent` | `admin.color.brand.green` | CTAs, active filters |
| `ord.accent-bg` | `admin.color.brand.green` @ 15% | Selected row, active chip |
| `ord.focus-ring` | `admin.color.brand.green` | Focus ring |
| `ord.focus-glow` | `0 0 0 3px rgba(0,181,102,0.25)` | Focus glow |
| `ord.delivered` | `admin.color.status.success` | Delivered status |
| `ord.delivered-bg` | `admin.color.status.success` @ 12% | Delivered badge bg |
| `ord.processing` | `admin.color.status.warning` | Processing / pending |
| `ord.processing-bg` | `admin.color.status.warning` @ 12% | Processing badge bg |
| `ord.shipped` | `admin.color.status.info` | Shipped / in transit |
| `ord.shipped-bg` | `admin.color.status.info` @ 12% | Shipped badge bg |
| `ord.cancelled` | `admin.color.status.error` | Cancelled / failed |
| `ord.cancelled-bg` | `admin.color.status.error` @ 12% | Cancelled badge bg |
| `ord.returned` | `admin.color.status.purple` | Returned |
| `ord.returned-bg` | `admin.color.status.purple` @ 12% | Returned badge bg |
| `ord.attempted` | `admin.color.status.orange` | Delivery attempted |
| `ord.attempted-bg` | `admin.color.status.orange` @ 12% | Attempted badge bg |
| `ord.danger` | `admin.color.status.error` | Destructive actions |
| `ord.shadow` | `0 2px 8px rgba(0,0,0,0.25)` | Panel shadow |

### 2.3 Typography (Admin Scale)

| Role | Size | Weight | Colour |
|---|---|---|---|
| Page heading | `font.size.5xl` (24px) | 700 | `ord.text` |
| KPI value | `font.size.6xl` (32px) | 800 | `ord.text` |
| KPI label | `font.size.sm` (12px) | 500 | `ord.text-muted` |
| KPI delta | `font.size.sm` (12px) | 600 | status colour |
| Section heading | `font.size.4xl` (18px) | 700 | `ord.text` |
| Panel heading | `font.size.3xl` (16px) | 600 | `ord.text` |
| Column header | `font.size.xs` (11px) | 700 | `ord.text-label`, uppercase |
| Table cell body | `font.size.sm` (12px) | 400 | `ord.text` |
| Table cell meta | `font.size.xs` (11px) | 400 | `ord.text-muted` |
| Status badge | `font.size.xs` (11px) | 700 | status colour |
| Button label | `font.size.sm` (12px) | 600 | per type |
| Input label | `font.size.xs` (11px) | 700 | `ord.text-label`, uppercase |
| Input value | `font.size.sm` (12px) | 400 | `ord.text` |
| Help text | `font.size.xs` (11px) | 400 | `ord.text-muted` |
| Order number | `font.family.mono`, `font.size.sm` | 600 | `ord.text` |
| Price | `font.size.sm` (12px) | 700 | `ord.text` |
| Timeline step | `font.size.sm` (12px) | 600 active / 400 pending | `ord.text` |
| Timestamp | `font.size.xs` (11px) | 400 | `ord.text-muted` |

### 2.4 Spacing

| Token | Value |
|---|---|
| `space.2` | `4px` |
| `space.3` | `6px` |
| `space.4` | `8px` |
| `space.5` | `10px` |
| `space.6` | `12px` |
| `space.7` | `16px` |
| `space.8` | `20px` |
| `space.9` | `24px` |
| `space.10` | `32px` |
| `space.12` | `48px` |

### 2.5 Border Radius & Motion

| Token | Value | Usage |
|---|---|---|
| `radius.xs` | `4px` | Status badges, micro chips |
| `radius.sm` | `6px` | Buttons, inputs, filter chips |
| `radius.md` | `8px` | Cards, panels, modals |
| `radius.lg` | `12px` | Large panels, drawers |
| `radius.full` | `9999px` | Avatar, pill badges |

| Motion token | Value | Usage |
|---|---|---|
| `motion.instant` | `150ms` | Hover, badge colour |
| `motion.fast` | `200ms` | Dropdown, chip select |
| `motion.normal` | `250ms` | Modal, drawer slide |
| `motion.slow` | `350ms` | Timeline reveal |

### 2.6 Contrast Audit

| Pairing | Ratio | Required | Status |
|---|---|---|---|
| `ord.text` (#cdd9e5) on `ord.card-bg` (#1c2128) | ~10:1 | 4.5:1 | ✅ Pass |
| `ord.text-muted` (#768390) on `ord.card-bg` | ~4.6:1 | 4.5:1 | ✅ Pass |
| `ord.text-label` (#adbac7) on `ord.page-bg` (#0f1117) | ~8.2:1 | 4.5:1 | ✅ Pass |
| `admin.color.status.success` (#57ab5a) on `ord.card-bg` | ~4.5:1 | 4.5:1 | ✅ Pass |
| `admin.color.status.error` (#e5534b) on `ord.card-bg` | ~4.5:1 | 4.5:1 | ✅ Pass |
| `admin.color.status.warning` (#c69026) on `ord.card-bg` | ~4.6:1 | 4.5:1 | ✅ Pass |
| White on `ord.accent` (#00b566) — weight 600, 12px | ~3.5:1 | 3:1 large | ✅ Pass (weight 600+) |


---

## 3. Page Layout

### 3.1 Orders List Structure

```
┌──────────────────────────────────────────────────────────────────────┐
│  TOP BAR (64px)                                                      │
├──────────────┬───────────────────────────────────────────────────────┤
│  SIDEBAR     │  BREADCRUMB: Admin / Orders                          │
│  (240px)     ├───────────────────────────────────────────────────────┤
│              │  PAGE HEADER + KPI ROW (8 cards)                     │
│              ├───────────────────────────────────────────────────────┤
│              │  STATUS FILTER TABS (7 tabs, live counts)             │
│              ├───────────────────────────────────────────────────────┤
│              │  TABLE TOOLBAR (search · filter · sort · export)      │
│              ├───────────────────────────────────────────────────────┤
│              │  ACTIVE FILTER CHIPS (conditional)                    │
│              ├───────────────────────────────────────────────────────┤
│              │  ORDERS TABLE (virtual scroll, 25/50/100 rows)        │
│              ├───────────────────────────────────────────────────────┤
│              │  PAGINATION                                           │
└──────────────┴───────────────────────────────────────────────────────┘
```

### 3.2 Order Detail Structure

```
┌──────────────┬──────────────────────────────┬────────────────────────┐
│  SIDEBAR     │  LEFT COLUMN (62%)           │  RIGHT COLUMN (38%)   │
│              │                              │  (sticky top: 80px)   │
│              │  • Order Header              │  • Order Summary       │
│              │  • Fulfilment Timeline       │  • Customer Card       │
│              │  • Order Items Panel         │  • Delivery Address    │
│              │  • Fulfilment Actions        │  • Payment Card        │
│              │  • Return / Refund Panel     │  • Carrier & Tracking  │
│              │  • Admin Notes               │  • Risk Assessment     │
│              │  • Activity Log              │  • Tags & Attributes   │
└──────────────┴──────────────────────────────┴────────────────────────┘
```

### 3.3 Layout Rules

| Property | Value |
|---|---|
| Content padding | `space.9 = 24px` all sides |
| Column gap (detail) | `space.9 = 24px` |
| Left column | `62%` |
| Right column | `38%`, sticky `top: 80px` |
| Panel gap (vertical) | `space.9 = 24px` |
| Page background | `ord.page-bg` |
| Min page width | `1280px` |

---

## 4. Orders List Page

### 4.1 Page Header

```
Orders                          [📅 Last 30 days ▾]  [↓ Export]  [+ Create Order]
4,821 total orders
```

| Element | Value |
|---|---|
| Title | `font.size.5xl` (24px), weight 700, `ord.text` |
| Subtitle | `"[n] total orders"`, `font.size.sm`, `ord.text-muted` |
| Date range | Today / Yesterday / Last 7 / Last 30 / This Month / Custom range |
| Export | Secondary outlined, `radius.sm` |
| `+ Create Order` | Primary `ord.accent` filled, `radius.sm` |

### 4.2 KPI Cards Row

```
┌────────────────────┐ ┌────────────────────┐ ┌────────────────────┐ ┌────────────────────┐
│  Orders Today      │ │  Revenue Today      │ │  Avg Order Value   │ │  Pending Fulfilment│
│  124               │ │  ₹1,54,752          │ │  ₹1,248            │ │  18                │
│  ↑ +12 vs yest.   │ │  ↑ +8.4%            │ │  → same            │ │  ⚠ Action needed  │
└────────────────────┘ └────────────────────┘ └────────────────────┘ └────────────────────┘
```

**Single KPI card:**

| Property | Value |
|---|---|
| Background | `ord.card-bg` |
| Border | `1px solid ord.border-muted` |
| Border-radius | `radius.md` |
| Padding | `space.9 = 24px` |
| Label | `font.size.sm`, weight 500, `ord.text-muted` |
| Value | `font.size.6xl` (32px), weight 800, `ord.text` |
| Delta positive | `↑ +X%`, `ord.delivered` colour |
| Delta negative | `↓ −X%`, `ord.cancelled` colour |
| Delta neutral | `→ same`, `ord.text-muted` |
| Pending card | Value in `ord.processing`; border `ord.processing` |
| Hover | `ord.card-hover` bg, `motion.instant` |
| Click | Filters table to that status segment |
| Sparkline | 48px right-aligned, 7-day trend |
| `aria-label` | `"[label]: [value]. [delta context]"` |

**8 KPI cards:**

| Card | Format | Click filter |
|---|---|---|
| Orders Today | Integer | Date = today |
| Revenue Today | `₹X,XX,XXX` | Date = today |
| Avg Order Value | `₹X,XXX` | — |
| Pending Fulfilment | Integer + ⚠ | Status = Processing |
| Shipped Today | Integer | Fulfilled today |
| Cancelled Today | Integer | Cancelled today |
| Return Requests | Integer | Status = Returned |
| COD Pending | Integer | Payment = COD Pending |

### 4.3 Status Filter Tabs

```
[ All (4,821) ]  [ Pending (24) ]  [ Processing (18) ]  [ Shipped (312) ]
[ Delivered (4,321) ]  [ Cancelled (89) ]  [ Returned (57) ]
```

| Property | Value |
|---|---|
| Height | `36px`, `radius.sm` |
| Padding | `space.3` vertical, `space.7 = 16px` horizontal |
| Font | `font.size.sm`, weight 500 |
| Default | `ord.border` border, transparent, `ord.text-muted` |
| Active | `ord.accent` bg, white, weight 700 |
| Hover | `ord.card-hover` bg, `motion.instant` |
| Focus-visible | `2px` focus ring `ord.focus-ring` |
| `role` | `role="tablist"`, `role="tab"`, `aria-selected` |
| Keyboard | Arrow keys cycle; Enter selects |
| URL update | `?status=processing` |
| Live counts | Update via WebSocket; `aria-live="polite"` |

### 4.4 Table Toolbar

```
[🔍 Search orders, customers, SKUs...]  [Filter ▾ (3)]  [Sort: Newest ▾]  [Columns ▾]  [Export CSV]
```

**Search field:**

| Property | Value |
|---|---|
| Width | `320px`, height `36px` |
| Background | `ord.input-bg`, `ord.border` border, `radius.sm` |
| Placeholder | `"Search orders, customers, SKUs..."` |
| Scope | Order #, customer name, email, phone, product, SKU |
| Debounce | `250ms` |
| Focus | `ord.border-active` + `ord.focus-glow` |
| Clear `×` | Appears on input; `aria-label="Clear search"` |

**Sort dropdown options:**

Newest First (default) · Oldest First · Highest Value · Lowest Value · Customer A–Z · Last Updated

**Bulk action bar (on row selection):**

```
[ ☑ 12 selected ]  [Update Status ▾]  [Assign Courier ▾]  [Print Invoices]  [Export Selected]  [✕ Clear]
```

| Property | Value |
|---|---|
| Background | `ord.accent-bg` |
| Border | `1px solid ord.accent`, `radius.sm` |
| Font | `font.size.sm`, weight 500, `ord.text` |
| `aria-live` | `"polite"` on count |

### 4.5 Filter Drawer

Right-side drawer, `320px`, `role="dialog"`, `aria-label="Order filters"`, focus trap.

**Filter sections:**

| Section | Options |
|---|---|
| Order Status | Pending · Processing · Shipped · Delivered · Cancelled · Returned |
| Payment Status | Paid · Pending · Failed · COD Pending · Refunded |
| Date Range | From/To date pickers + quick chips (Today / Last 7 / This month) |
| Order Value | `₹0–₹10,000+` dual-handle slider |
| Fulfilment Status | Unfulfilled · Partially fulfilled · Fulfilled · Returned |
| Courier / Carrier | Shiprocket · Delhivery · Bluedart · DTDC · Self-ship |
| City / State | Search + checkbox multi-select |
| Tags | Search + checkbox (VIP / First Order / COD / Gift) |

| Property | Value |
|---|---|
| Apply | Instant on checkbox change |
| Clear All | Resets all; `ord.danger` text |
| Section accordion | `aria-expanded`, `aria-controls` |
| Close | `×` + Escape; focus returns to Filter button |

**Active filter chips (above table):**

```
× Status: Pending, Processing    × Value: ₹500–₹5,000    × City: Mumbai    [Clear All]
```

| Property | Value |
|---|---|
| Chip bg | `ord.accent-bg`, `ord.accent` border, `radius.full` |
| Font | `font.size.xs`, weight 600, `ord.text` |
| `×` removes | That filter group only |

### 4.6 Orders Data Table

**Column definitions:**

| # | Column | Content | Width | Sortable |
|---|---|---|---|---|
| 1 | ☐ | Row checkbox | `40px` | No |
| 2 | Order | `#ORD-4831` mono + Date below | `160px` | Yes |
| 3 | Customer | Avatar + Name + Email | `200px` | Yes |
| 4 | Items | `3 items` + thumbnail hover tooltip | `80px` | No |
| 5 | Total | `₹1,248` | `100px` | Yes |
| 6 | Payment | Paid/Pending/Failed/COD badge | `130px` | Yes |
| 7 | Fulfilment | Unfulfilled/Shipped/Delivered badge | `140px` | Yes |
| 8 | Courier | Carrier name + mini tracking | `130px` | No |
| 9 | City | City + State | `120px` | Yes |
| 10 | Date | Relative + absolute on hover tooltip | `120px` | Yes |
| 11 | Actions | `[View]` `[Fulfil]` `[⋮]` | `120px` | No |

**Table shell:**

| Property | Value |
|---|---|
| Background | `ord.card-bg` |
| Border | `1px solid ord.border-muted`, `radius.md` |
| Overflow-x | `auto` |
| Virtual scroll | Mandatory beyond 100 rows |

**Header row:**

| Property | Value |
|---|---|
| Background | `ord.page-bg` |
| Font | `font.size.xs`, weight 700, `ord.text-label`, uppercase, `letter-spacing: 0.06em` |
| Padding | `space.4 = 8px` vertical, `space.7 = 16px` horizontal |
| Border-bottom | `1px solid ord.border` |
| Sort active | `ord.accent` colour + `↑`/`↓` indicator |
| `aria-sort` | `"ascending"` / `"descending"` / `"none"` |

**Body row states:**

| State | Background | Left border |
|---|---|---|
| Default | `ord.card-bg` | None |
| Hover | `ord.card-hover` | None |
| Selected | `ord.accent-bg` | `3px solid ord.accent` |

| Property | Value |
|---|---|
| Min height | `52px` |
| Border-bottom | `1px solid ord.border-muted` |
| Padding | `space.4` vertical, `space.7` horizontal |
| Click | Opens order detail page |

**Order number cell:**

```
#ORD-4831
15 Jun, 10:24 AM
```

`font.family.mono`, weight 600, `ord.accent`; date `font.size.xs`, `ord.text-muted`

**Customer cell:**

`24px` avatar circle (initials, `ord.accent-bg`) + Name `font.size.sm` weight 500 + email `font.size.xs` `ord.text-muted`

**Items cell:**

`"[n] items"` text; hover reveals thumbnail tooltip (`3 × 40×40px` product images, `ord.overlay-bg`)

**Payment badge variants:**

| Status | Background | Text |
|---|---|---|
| Paid | `ord.delivered-bg` | `ord.delivered` |
| Pending | `ord.processing-bg` | `ord.processing` |
| Failed | `ord.cancelled-bg` | `ord.cancelled` |
| COD Pending | `ord.attempted-bg` | `ord.attempted` |
| Refunded | `ord.returned-bg` | `ord.returned` |

**Fulfilment badge variants:**

| Status | Background | Text |
|---|---|---|
| Unfulfilled | `ord.processing-bg` | `ord.processing` |
| Shipped | `ord.shipped-bg` | `ord.shipped` |
| Out for Delivery | `ord.shipped-bg` | `ord.shipped` |
| Delivered | `ord.delivered-bg` | `ord.delivered` |
| Cancelled | `ord.cancelled-bg` | `ord.cancelled` |
| Return Requested | `ord.returned-bg` | `ord.returned` |
| Return Received | `ord.returned-bg` | `ord.returned` |

**All badge properties:**

| Property | Value |
|---|---|
| Font | `font.size.xs`, weight 700 |
| Border-radius | `radius.full` |
| Padding | `space.1 space.3` = `2px 6px` |
| Icon | `10×10px`, `space.1` gap |
| `aria-label` | `"Status: [status]"` |

**Actions cell overflow menu (⋮):**

```
View Order          Edit Order
Print Invoice       Print Packing Slip
Mark as Fulfilled   Add Tracking Number
Assign Courier      Cancel Order
─────────────────────────────────
Refund Order        Flag as Suspicious
Add Tag
```

| Property | Value |
|---|---|
| Background | `ord.overlay-bg`, `ord.border`, `radius.md`, `200px` width |
| Item font | `font.size.sm`, weight 400, `ord.text` |
| Item hover | `ord.card-hover` bg |
| Destructive | `ord.danger` colour (Cancel, Refund) |
| `role` | `role="menu"`, `role="menuitem"` |
| Keyboard | Arrows navigate; Enter activates; Escape closes |

### 4.7 Pagination

```
Showing 1–25 of 4,821     [‹ Prev]  [1][2][3]...[193]  [Next ›]     [25 per page ▾]
```

| Property | Value |
|---|---|
| Font | `font.size.sm`, `ord.text-muted` |
| Page buttons | `32×32px`, `radius.xs`, hover `ord.card-hover` |
| Active page | `ord.accent` bg, white |
| Per-page select | 25 / 50 / 100 / 250 |
| `aria-label` | `"Pagination"` on `<nav>` |
| `aria-current` | `"page"` on active |

### 4.8 Empty States

**No orders:**

```
        📦
  No orders yet
  Orders will appear here once customers
  start purchasing from your store.
  [ Visit Storefront → ]
```

**No results:**

```
        📭
  No orders found
  Try adjusting your filters or search terms.
  [ Clear Filters ]   [ Create Order ]
```

| Property | Value |
|---|---|
| Icon | `64×64px` SVG, `ord.text-muted` @ 30% |
| Heading | `font.size.3xl`, weight 600, `ord.text` |
| Body | `font.size.sm`, `ord.text-muted`, centred |
| Min-height | `280px` in table area |
| `aria-live` | `"polite"` — announced on appearance |


---

## 5. Order Detail Page

### 5.1 Breadcrumb & Header

```
Admin  /  Orders  /  #ORD-4821
```

```
Order #ORD-4821                          [ Delivered ✓ ]     [Print ▾]  [⋮]
Placed Tuesday, 15 June 2026 at 10:24 AM · Priya Kumar · ₹1,248
```

| Element | Value |
|---|---|
| Order number | `font.family.mono`, `font.size.5xl`, weight 700, `ord.text` |
| Status badge | Large pill, right-aligned, correct colour per status |
| Date · customer · total | `font.size.sm`, `ord.text-muted`, `·` separators |
| Customer name | `ord.accent` text, links to customer detail |
| `[Print ▾]` | Secondary; dropdown: Invoice / Packing Slip / Return Label |
| `[⋮]` | Overflow: Duplicate / Cancel / Refund / Add Tag / Flag |

### 5.2 Fulfilment Timeline (Left column, top)

```
┌──────────────────────────────────────────────────────────────────────┐
│  Fulfilment Timeline                                                 │
├──────────────────────────────────────────────────────────────────────┤
│  ●─────────●─────────●─────────●──────── ○                          │
│  ✓         ✓         ✓      ● Current   Pending                     │
│  Order     Packed    Dispatch  Out for   Delivered                   │
│  Placed              -ed       Delivery                              │
│                                                                      │
│  15 Jun 10:24 AM  Order Confirmed               Mumbai               │
│  15 Jun 02:48 PM  Packed & Ready                Pune FC              │
│  16 Jun 09:00 AM  Picked Up by Shiprocket                           │
│  16 Jun 02:15 PM  In Transit                    Pune Hub             │
│  17 Jun 08:45 AM● Out for Delivery              Mumbai - Andheri     │
│                  [ + Load earlier events ]                           │
└──────────────────────────────────────────────────────────────────────┘
```

**Progress bar:**

| Property | Value |
|---|---|
| Track height | `6px`, `radius.full`, `ord.border` colour |
| Fill | `ord.accent`, animated width on load, `motion.slow` |
| Dot — completed | `16×16px` filled `ord.accent`, white `✓` |
| Dot — active | `20×20px` filled `ord.accent`, pulsing ring `ord.accent` @ 30%, `1.5s infinite` |
| Dot — pending | `14×14px` hollow, `ord.border` border |
| Stage labels | `font.size.xs`, `ord.text-muted`, below each dot |

**Event log:**

| Property | Value |
|---|---|
| Timestamp | `font.size.xs`, `ord.text-muted`, `<time>` element |
| Event title | `font.size.sm`, weight 600 (current) / 400 (past), `ord.text` |
| Location | `font.size.xs`, `ord.text-muted`, right-aligned |
| Current event row | `ord.accent-bg` bg, `3px solid ord.accent` left border |
| `[Load earlier]` | Ghost link, `font.size.xs`, `ord.accent` |
| `role` | `role="list"`, `aria-label="Fulfilment timeline"` |
| Active step | `aria-current="step"` |

**5 fulfilment stages:**

Order Placed → Being Packed → Dispatched → Out for Delivery → Delivered

### 5.3 Order Items Panel (Left column)

```
┌──────────────────────────────────────────────────────────────────────┐
│  Items in Order (3)                                 [Add Item]       │
├──────────────────────────────────────────────────────────────────────┤
│  ┌──────┐   Monstera Deliciosa                      ₹399 × 1        │
│  │ img  │   SKU-MM-001 · Size: Medium · Pot: White Minimalist        │
│  │      │   ✓ In stock at Pune FC                   Total: ₹399     │
│  └──────┘                                                            │
│  ─────────────────────────────────────────────────────────────────   │
│  ┌──────┐   Peace Lily — Small                      ₹249 × 2        │
│  │ img  │   SKU-PL-002 · Size: Small                                │
│  └──────┘   ✓ In stock                              Total: ₹498     │
│  ─────────────────────────────────────────────────────────────────   │
│  ┌──────┐   Terracotta Pot (14cm)                   ₹299 × 1        │
│  │ img  │   SKU-TP-014                                              │
│  └──────┘   ⚠ Low stock: 3 remaining                Total: ₹299    │
├──────────────────────────────────────────────────────────────────────┤
│                              Subtotal                     ₹1,196    │
│                              Discount (HERO10)              −₹120   │
│                              Shipping                          ₹0   │
│                              Tax (GST 18%)                   ₹172   │
│                              ─────────────────────────────────────  │
│                              Total                        ₹1,248    │
└──────────────────────────────────────────────────────────────────────┘
```

**Item row:**

| Element | Value |
|---|---|
| Thumbnail | `64×64px`, `radius.xs`, `object-fit: cover` |
| Product name | `font.size.sm`, weight 600, `ord.text`, links to product edit |
| SKU | `font.family.mono`, `font.size.xs`, `ord.text-muted` |
| Variant info | `font.size.xs`, `ord.text-muted` |
| Stock ✓ | `ord.delivered` + `✓`; Low stock: `ord.processing` + `⚠`; OOS: `ord.cancelled` |
| Price × qty | `font.size.sm`, weight 700, right-aligned |
| `aria-label` | `"[Product], [qty] units, [total]"` |

**Order totals:**

| Property | Value |
|---|---|
| Label | `font.size.sm`, weight 400, `ord.text-muted` |
| Value | `font.size.sm`, weight 600, `ord.text` |
| Discount | `ord.delivered` colour |
| Total row | `font.size.3xl`, weight 800, `ord.text`, border-top `ord.border` |
| Refunded | `"Refunded: −₹[amount]"` in `ord.returned` colour |

**"Add Item" button:** Only visible for `Processing` status orders.

### 5.4 Fulfilment Actions Panel (Left column — 5 status variants)

**Variant A — Unfulfilled:**

```
┌──────────────────────────────────────────────────────────────────────┐
│  Fulfilment Actions                     Status: ⏳ Unfulfilled       │
├──────────────────────────────────────────────────────────────────────┤
│  FULFILMENT METHOD                                                   │
│  ( ● ) Ship items    ( ○ ) Mark as picked up locally                │
│                                                                      │
│  TRACKING NUMBER                                                     │
│  [ SR-8821-43XY                                              ]      │
│                                                                      │
│  CARRIER                                                             │
│  [ Shiprocket                                          ▾ ]          │
│                                                                      │
│  NOTIFY CUSTOMER                                                     │
│  [ ☑ ] Send shipment email to priya@email.com                       │
│  [ ☑ ] Send SMS to +91 98765 43210                                  │
│                                                                      │
│  FULFILMENT NOTE (internal only)                                    │
│  [ Packed in eco-wrap. Handle with care.              ]             │
│                                                                      │
│  [ Save Draft ]       [ Mark as Fulfilled + Notify Customer ]       │
└──────────────────────────────────────────────────────────────────────┘
```

**Variant B — Shipped:**

```
  Carrier: Shiprocket
  Tracking: SR-8821-43XY  [📋 Copy]  [Open Tracker ↗]
  Shipped: 16 Jun 2026 at 09:00 AM · ETA: 18 Jun 2026
  [ Update Tracking ]  [ Mark as Delivered ]
```

**Variant C — Out for Delivery:**

```
  [ Mark as Delivered ]  [ Log Attempted Delivery ]
```

**Variant D — Delivered:**

Delivery confirmed banner. `[View Proof of Delivery]` if available.

**Variant E — Delivery Attempted:**

```
┌──────────────────────────────────────────────────────────────────────┐
│  ⚠️  Delivery Attempted — 17 Jun, 2:30 PM                            │
│  Reason: Customer not available                                      │
│  [ Reschedule Delivery ]  [ Update Customer ]  [ Mark Delivered ]   │
└──────────────────────────────────────────────────────────────────────┘
```

Border-left `4px solid ord.attempted`; bg `ord.attempted-bg`.

**"Mark as Fulfilled" button:**

| Property | Value |
|---|---|
| Style | Primary `ord.accent`, full-width, `radius.sm` |
| Height | `40px` |
| Loading | Spinner, `aria-busy="true"` |
| Success | Timeline updates; toast: `"Order #ORD-4821 marked as fulfilled."` |

### 5.5 Return & Refund Panel (Left column — conditional)

**Return request form:**

```
┌──────────────────────────────────────────────────────────────────────┐
│  Return Request                                                      │
│  Customer requested: 20 Jun 2026 at 3:12 PM                         │
├──────────────────────────────────────────────────────────────────────┤
│  ITEMS TO RETURN                                                     │
│  [☑] Monstera Deliciosa — Medium  ₹399  Reason: Damaged on arrival  │
│  [☐] Peace Lily — Small           ₹249                              │
│                                                                      │
│  RETURN TYPE                                                         │
│  ( ● ) Full refund to original payment                               │
│  ( ○ ) Partial refund                                               │
│  ( ○ ) Store credit   ( ○ ) Exchange                                │
│                                                                      │
│  REFUND AMOUNT                                                       │
│  Items: ₹399 + Tax: ₹72 = ₹471                                      │
│  Include shipping: [ ☐ ] (₹0)     Total refund: ₹471               │
│                                                                      │
│  RETURN SHIPPING                                                     │
│  ( ● ) Customer arranges return   ( ○ ) Generate return label       │
│                                                                      │
│  ADMIN NOTE                                                          │
│  [ Refund approved per policy. Damaged in transit.  ]               │
│                                                                      │
│  [ Reject Return ]         [ Approve & Process Refund ]             │
└──────────────────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Refund total | `font.size.3xl`, weight 800, `ord.text` |
| `aria-live` on total | `"polite"` — announced when changed |
| "Approve" button | Primary `ord.accent` filled |
| "Approve" confirm | Modal: `"Process refund of ₹471 to Priya Kumar's Visa •••• 4821? Cannot be undone."` |
| "Reject" button | Ghost, `ord.danger` text |
| "Reject" | Modal with reason textarea |

**Refund-only flow (no return — e.g. late delivery compensation):**

```
  REFUND TYPE: ( ● ) Partial  ( ○ ) Full
  AMOUNT: [ ₹ 100 ]  (Max: ₹1,248)
  REASON: [ Late delivery compensation ]
  NOTIFY: [ ☑ ] Email refund confirmation
  [ Cancel ]  [ Confirm Refund — ₹100 ]
```

### 5.6 Admin Notes Panel (Left column)

```
┌──────────────────────────────────────────────────────────────────────┐
│  Admin Notes                                          [+ Add Note]  │
├──────────────────────────────────────────────────────────────────────┤
│  [RK] Ravi K. · 15 Jun 11:05 AM · Internal                         │
│  Customer requested gift wrapping. See packing note.                │
│                               [Edit]  [Delete]                       │
│  ─────────────────────────────────────────────────────────────────   │
│  [SK] Suresh K. · 15 Jun 10:30 AM · Internal                       │
│  Payment confirmed via Razorpay ref: RZP-28291.                     │
│                               [Edit]  [Delete]                       │
├──────────────────────────────────────────────────────────────────────┤
│  ADD NOTE                                                            │
│  [ Type a note...                                              ]     │
│  [ ☑ ] Internal only (not visible to customer)                      │
│  [ Save Note ]                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Avatar | `24×24px`, `radius.full`, initials, `ord.accent-bg` |
| Author + time | `font.size.xs`, `ord.text-muted` |
| Note type badge | "Internal" / "Customer-facing" |
| Note text | `font.size.sm`, `ord.text` |
| Edit | Replaces note with textarea inline |
| Delete | Inline confirm: `"Delete this note?"` |
| Textarea | `80px` min, `ord.input-bg`, `ord.border`, `radius.sm` |
| `[Save Note]` | Secondary outlined; disabled when empty |
| `role` | `role="log"`, `aria-label="Admin notes"` |

### 5.7 Activity Log Panel (Left column — collapsed)

```
┌──────────────────────────────────────────────────────────────────────┐
│  Activity Log                              [View Full Log ↗]  [▼]  │
├──────────────────────────────────────────────────────────────────────┤
│  Today 10:24 AM  Priya K.   Marked as Fulfilled                     │
│  Today 09:15 AM  Auto       Payment confirmed (Razorpay)            │
│  15 Jun 3:42 PM  Ravi S.    Tracking added: SR-8821-43XY           │
│  15 Jun 2:11 PM  System     Order placed by customer                │
└──────────────────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Default | Collapsed — `[▼]` expands |
| Rows shown | Last 5; `[Load more]` for older |
| `[View Full Log ↗]` | `/admin/activity-log?order=[id]` |
| `role` | `role="log"`, `aria-label="Order activity log"` |


---

## 6. Right Column Panels

### 6.1 Order Summary Card

```
┌────────────────────────────────────────────┐
│  Order Summary                             │
├────────────────────────────────────────────┤
│  Subtotal               ₹1,196            │
│  Discount (HERO10)       −₹120            │
│  Shipping                    ₹0           │
│  Tax (GST 18%)             ₹172           │
│  ────────────────────────────────         │
│  Total                  ₹1,248            │
│                                            │
│  [Visa logo]  Visa ending 4821            │
│  Paid · 15 Jun 2026 · 10:24 AM            │
│  TXN ID: RZP-28291  [📋 Copy]             │
│                                            │
│  [ ☑ Paid ]                               │
└────────────────────────────────────────────┘
```

| Element | Value |
|---|---|
| Label | `font.size.sm`, `ord.text-muted` |
| Value | `font.size.sm`, weight 600, `ord.text`, right-aligned |
| Discount row | `ord.delivered` colour |
| Total | `font.size.3xl`, weight 800, `ord.text`, border-top `ord.border` |
| TXN ID | `font.family.mono`, `font.size.xs`, `ord.text-muted` |
| `[📋 Copy]` | Ghost; `aria-label="Copy transaction ID"`; announces `"Copied!"` |
| Payment badge | `ord.delivered-bg` + `ord.delivered` + `☑` |
| Refunded amount | `"Refunded: −₹[amount]"` in `ord.returned` colour |

### 6.2 Customer Card

```
┌────────────────────────────────────────────┐
│  Customer                   [View Profile] │
├────────────────────────────────────────────┤
│  [Avatar 40px]  Priya Kumar               │
│                 priya@email.com            │
│                 📞 +91 98765 43210         │
│                                            │
│  🌿 Plant Lover · Member since Jan 2025   │
│  Orders: 12  ·  Total spent: ₹14,820      │
│                                            │
│  [ Send Email ]   [ Send SMS ]            │
└────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Avatar | `40×40px`, `radius.full`, photo or initials |
| Name | `font.size.3xl`, weight 700, `ord.text` |
| Email/phone | `font.size.sm`, `ord.text-muted` |
| Tier | `font.size.xs`, `ord.accent` |
| Stats | `font.size.xs`, `ord.text-muted` |
| `[View Profile]` | Ghost, `font.size.xs`, top-right |
| `[Send Email]` / `[Send SMS]` | Secondary outlined, `font.size.xs` |

**Send Email modal:**

```
┌──────────────────────────────────────────────────────┐
│  Send Email to Priya Kumar                    [×]   │
├──────────────────────────────────────────────────────┤
│  TEMPLATE  [ Order Update ▾ ]                       │
│  SUBJECT   [ Your Order #ORD-4821 Update       ]    │
│  MESSAGE   [ Hi Priya, your order has been...  ]    │
│            [ (rich text, 400px min height)      ]   │
│  [ Preview Email ]      [ Send Email ]              │
└──────────────────────────────────────────────────────┘
```

Templates: Order Update · Shipment Notification · Delivery Confirmation · Refund Confirmation · Custom.

### 6.3 Delivery Address Card

```
┌────────────────────────────────────────────┐
│  Delivery Address               [Edit ✎]  │
├────────────────────────────────────────────┤
│  🏠  Priya Kumar                          │
│      42, Green Park Society               │
│      Baner, Pune — 411045                 │
│      Maharashtra, India                   │
│      📞 +91 98765 43210                   │
│                                            │
│  [ Copy Address ]   [ Open in Maps ↗ ]   │
└────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Address type | 🏠 or 🏢, `ord.accent` |
| Name | `font.size.sm`, weight 600, `ord.text` |
| Address lines | `font.size.sm`, `ord.text`, line-height 1.6 |
| `[Edit ✎]` | Opens modal; only for Unfulfilled / Processing |
| `[Open in Maps ↗]` | Google Maps with address; new tab |
| `[Copy Address]` | Clipboard; announces "Copied!" |

### 6.4 Payment Card

```
┌────────────────────────────────────────────┐
│  Payment                                   │
├────────────────────────────────────────────┤
│  Amount       ₹1,248                      │
│  Status       [ Paid ✓ ]                  │
│  Method       Visa ending 4821            │
│  Gateway      Razorpay                    │
│  TXN ID       RZP-28291                   │
│  Date         15 Jun, 10:24 AM            │
│                                            │
│  LOYALTY POINTS USED                       │
│  −50 Green Points (₹5 off applied)        │
│                                            │
│  [ Capture Payment ]  ← auth-only          │
│  [ Void Payment ]     ← auth-only          │
│  [ Mark as Paid ]     ← COD only           │
│  [ Issue Refund ]                          │
└────────────────────────────────────────────┘
```

**Conditional buttons:**

| Button | Shown when | Action |
|---|---|---|
| `[Capture Payment]` | Auth not yet captured | Triggers gateway capture |
| `[Void Payment]` | Auth not yet captured | Cancels auth |
| `[Mark as Paid]` | COD — not yet collected | Updates payment status |
| `[Issue Refund]` | Payment captured | Opens refund panel |

### 6.5 Carrier & Tracking Card

```
┌────────────────────────────────────────────┐
│  Shipping & Tracking                       │
├────────────────────────────────────────────┤
│  Carrier       Shiprocket                 │
│  Tracking #    SR-8821-43XY               │
│                [📋 Copy]  [Open ↗]        │
│  Service       Express                    │
│  Dispatched    16 Jun, 09:00 AM           │
│  ETA           18 Jun 2026                │
│                                            │
│  Charged to customer:  ₹0 (Free)         │
│  Actual carrier cost:  ₹145              │
│  Shipping margin:      −₹145             │
│                                            │
│  [ Update Tracking ]  [ Void Shipment ]   │
└────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Tracking # | `font.family.mono`, `font.size.sm` |
| Shipping margin | Super Admin + Ops Manager only |
| Negative margin | `ord.cancelled` colour |
| `[Void Shipment]` | Confirm modal; resets to Unfulfilled |

### 6.6 Risk Assessment Card

```
┌────────────────────────────────────────────┐
│  Risk Assessment       [ Low Risk 🟢 ]    │
├────────────────────────────────────────────┤
│  Fraud score:   12 / 100  (Low)           │
│  IP location:   Mumbai, IN                │
│  Device:        Mobile · iOS              │
│  AVS match:     ✓ Full match              │
│  CVV match:     ✓ Match                   │
│  3DS auth:      ✓ Verified                │
│                                            │
│  [ Flag as Suspicious ]                   │
└────────────────────────────────────────────┘
```

**Risk badge colours:**

| Score | Badge | Colour |
|---|---|---|
| 0–29 | Low Risk 🟢 | `ord.delivered` |
| 30–69 | Medium Risk 🟡 | `ord.processing` |
| 70–100 | High Risk 🔴 | `ord.cancelled` |

| Property | Value |
|---|---|
| Row labels | `font.size.xs`, `ord.text-muted` |
| Row values | `font.size.xs`, `ord.text` |
| `[Flag as Suspicious]` | Ghost, `ord.danger`; adds tag + notifies fraud team |

### 6.7 Tags & Attributes Card

```
┌────────────────────────────────────────────┐
│  Tags                                      │
├────────────────────────────────────────────┤
│  [VIP][First Order][Gift]  [+ Add tag]     │
│                                            │
│  ATTRIBUTES                                │
│  Gift message:  "Happy Birthday, Mom! 🌸" │
│  Source:        Direct / Google Ads        │
│  Channel:       Mobile web                 │
└────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Tag chips | `ord.card-hover` bg, `ord.border`, `radius.full`, `font.size.xs` |
| `[+ Add tag]` | Ghost, `ord.accent`; opens inline tag input |
| Remove tag | `×` on each chip |
| Attributes | `font.size.xs`; label `ord.text-muted`, value `ord.text` |

---

## 7. Create Order Page

**URL:** `/admin/orders/new`

```
← Orders    Create Order

┌────────────────────────────────────┬────────────────────────────────┐
│  CUSTOMER                          │  ORDER SUMMARY                 │
│  [ Search existing customer... ]   │  Subtotal        ₹0           │
│  or [ Create new customer ]        │  Discount        ₹0           │
│                                    │  Shipping        ₹0           │
│  PRODUCTS                          │  Tax             ₹0           │
│  [ Search products or scan SKU  ]  │  ─────────────────────        │
│  ┌─────────────────────────────┐   │  Total           ₹0           │
│  │[img] Monstera M  ₹399 × [1]│   │                               │
│  │[img] Peace Lily  ₹249 × [2]│   │  PAYMENT                      │
│  └─────────────────────────────┘   │  ( ● ) Mark as paid          │
│                                    │  ( ○ ) Send invoice           │
│  DISCOUNT                          │  ( ○ ) Cash on delivery       │
│  [ ☐ ] Apply discount code        │                               │
│  [ HERO10             ]            │  CONFIRMATION                  │
│                                    │  [ ☑ ] Email customer         │
│  SHIPPING ADDRESS                  │  [ ☐ ] SMS customer           │
│  [Full address form]               │                               │
│                                    │  [ Create Order ]             │
│  SHIPPING METHOD                   │                               │
│  ( ● ) Free  ( ○ ) Standard ₹99   │                               │
│  ( ○ ) Express ₹199               │                               │
└────────────────────────────────────┴────────────────────────────────┘
```

**Product search:**

| Property | Value |
|---|---|
| Input | Searches by name, SKU; shows thumbnail + name + SKU + price + stock |
| Select | Adds item to order table |
| Quantity | Inline stepper per row |
| Remove | `×` per row |
| Barcode scanner | Accepts scanner input in same field |

**Order summary:** Updates in real-time as items, discount, and shipping selected.

**"Create Order" button:**

| Property | Value |
|---|---|
| Style | Primary `ord.accent`, full-width |
| Disabled | While required fields incomplete |
| Success | Redirects to new order detail; toast: `"Order #ORD-4832 created."` |

---

## 8. Print Flows

### 8.1 Invoice

Triggered by `[Print ▾] → [Invoice]`.

```
┌──────────────────────────────────────────────────────────┐
│  [Hero Logo]                         INVOICE             │
│  123 Plant Street, Pune  ·  GSTIN: 27XXXX...            │
│                                                          │
│  Invoice #: INV-4821         Date: 15 Jun 2026           │
│  Order #: ORD-4821                                       │
│                                                          │
│  Bill To:                    Ship To:                    │
│  Priya Kumar                 Priya Kumar                 │
│  priya@email.com             42 Green Park...            │
│  ────────────────────────────────────────────────────    │
│  ITEM               QTY   PRICE   TOTAL                  │
│  Monstera Del (M)    1    ₹399    ₹399                   │
│  Peace Lily (S)      2    ₹249    ₹498                   │
│  ────────────────────────────────────────────────────    │
│  Subtotal                          ₹897                  │
│  Discount (HERO10)                 −₹90                  │
│  IGST 18%                          ₹145                  │
│  TOTAL                           ₹1,248                  │
│  ────────────────────────────────────────────────────    │
│  Paid: Visa •••• 4821 · 15 Jun 2026                     │
│  "Thank you for growing with Hero Plants 🌿"             │
└──────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Format | HTML `@media print` CSS or PDF via jsPDF |
| Download | `INV-4821.pdf` |
| Branding | Store logo + GSTIN from store settings |
| Tax | GST: CGST+SGST (same state) / IGST (interstate) |

### 8.2 Packing Slip

Warehouse-use: simpler layout with `[ ]` checkboxes for staff to tick physically.

```
PACKING SLIP · Order: #ORD-4821 · 15 Jun 2026
Ship To: Priya Kumar, 42 Green Park, Pune 411045, 📞 +91 98765 43210
──────────────────────────────────────────────────────────────────────
QTY  ITEM                      SKU
 1   Monstera Deliciosa M      SKU-MM-001
 2   Peace Lily S              SKU-PL-002
 1   Terracotta Pot 14cm       SKU-TP-014
──────────────────────────────────────────────────────────────────────
Special instructions: Gift wrap requested
[ ] All items packed    [ ] Verified by: _______________
```

### 8.3 Return Label

Generated when store arranges return shipping. Carrier API creates prepaid label PDF.

---

## 9. Bulk Actions — Full Specification

### 9.1 Update Status (Bulk)

```
┌──────────────────────────────────────────────────────┐
│  Update Status — 12 Orders                    [×]   │
├──────────────────────────────────────────────────────┤
│  New status:  [ Shipped                      ▾ ]    │
│                                                     │
│  [ ☐ ] Add same tracking number to all             │
│         [ SR-8821-BULK           ]                  │
│         Carrier: [ Shiprocket  ▾ ]                  │
│                                                     │
│  [ ☑ ] Send notification to all 12 customers       │
│                                                     │
│  ⚠️  3 orders already in a later status — skipped   │
│                                                     │
│  [ Cancel ]           [ Update 9 Orders ]           │
└──────────────────────────────────────────────────────┘
```

State machine aware: only valid next states shown. Past-status orders auto-skipped with count warning.

### 9.2 Assign Courier (Bulk)

```
  Carrier: [ Shiprocket ▾ ]    Service: [ Express (1–2 days) ▾ ]
  [ ☑ ] Auto-generate tracking numbers
  [ ☑ ] Send AWB to carrier API
  [ Cancel ]   [ Assign Courier to 12 Orders ]
```

### 9.3 Print Invoices (Bulk)

All selected invoices concatenated; downloads as `"invoices-batch-15-jun.pdf"`.

### 9.4 Export Selected

CSV download. PII warning shown for non-Super-Admin roles.

---

## 10. Real-Time Updates

### 10.1 WebSocket / Polling Strategy

| Event | Method | Frequency |
|---|---|---|
| New order placed | WebSocket push | Real-time |
| Payment confirmed | WebSocket push | Real-time |
| Carrier tracking update | Webhook preferred; fallback polling | Every 5 min |
| Order status change | WebSocket push | Real-time |
| Return requested | WebSocket push | Real-time |

### 10.2 New Order Toast (auto-appears)

```
🛒 New order: #ORD-4832 — Ravi Shah — ₹1,050    [View]  [×]
```

| Property | Value |
|---|---|
| Position | Top-right, stacks below notification bell |
| Auto-dismiss | `8000ms` |
| `role` | `role="status"`, `aria-live="polite"` |

### 10.3 Live Tab Counts

Status filter tab counts update in real-time. Brief `ord.accent` colour pulse on count change (`0.4s ease-out`).

### 10.4 Concurrent Edit Banner (Order Detail)

```
ℹ️  This order was updated by Ravi S. 2 minutes ago.   [Refresh]  [×]
```

| Property | Value |
|---|---|
| Position | Fixed top of content area, below top bar |
| Background | `admin.color.status.info.bg` |
| Border | `1px solid admin.color.status.info` |
| `role` | `role="status"`, `aria-live="polite"` |
| `[Refresh]` | Reloads order data in-place |


---

## 11. Shopify Admin API Integration

### 11.1 Order Data Field Mapping

| Admin UI field | Shopify API field | Notes |
|---|---|---|
| Order number | `order.name` | e.g. `#ORD-4821` |
| Customer name | `order.customer.first_name + last_name` | |
| Customer email | `order.customer.email` | |
| Customer phone | `order.customer.phone` | |
| Order total | `order.total_price` | |
| Subtotal | `order.subtotal_price` | |
| Discount | `order.total_discounts` | |
| Shipping | `order.shipping_lines[].price` | |
| Tax | `order.total_tax` | |
| Payment status | `order.financial_status` | `paid/pending/refunded/voided` |
| Payment gateway | `order.payment_gateway` | |
| Line items | `order.line_items[]` | `title, sku, quantity, price, variant_title` |
| Shipping address | `order.shipping_address` | |
| Fulfilment status | `order.fulfillment_status` | `fulfilled/partial/unfulfilled/restocked` |
| Tracking number | `order.fulfillments[].tracking_number` | |
| Carrier | `order.fulfillments[].tracking_company` | |
| Tracking URL | `order.fulfillments[].tracking_url` | |
| Tags | `order.tags` | Comma-separated |
| Customer note | `order.note` | From checkout |
| Admin notes | `order.note_attributes[]` | `{name, value}` array |
| Risk signals | `order.risks[]` | Shopify Fraud Protect |
| Discount codes | `order.discount_codes[]` | |
| Transactions | `order.transactions[]` | Gateway + amount + status |
| Refunds | `order.refunds[]` | |
| Created at | `order.created_at` | |
| Updated at | `order.updated_at` | Conflict detection |

### 11.2 Key API Endpoints

| Action | Endpoint | Method |
|---|---|---|
| List orders | `GET /admin/api/2024-10/orders.json` | Read |
| Order detail | `GET /admin/api/2024-10/orders/{id}.json` | Read |
| Update order (tags/notes) | `PUT /admin/api/2024-10/orders/{id}.json` | Write |
| Create fulfilment | `POST /admin/api/2024-10/orders/{id}/fulfillments.json` | Write |
| Update fulfilment | `PUT /admin/api/2024-10/orders/{id}/fulfillments/{fid}.json` | Write |
| Cancel order | `POST /admin/api/2024-10/orders/{id}/cancel.json` | Write |
| Create refund | `POST /admin/api/2024-10/orders/{id}/refunds.json` | Write |
| Calculate refund | `POST /admin/api/2024-10/orders/{id}/refunds/calculate.json` | Read |
| Create transaction | `POST /admin/api/2024-10/orders/{id}/transactions.json` | Write |
| List order risks | `GET /admin/api/2024-10/orders/{id}/risks.json` | Read |
| Count orders | `GET /admin/api/2024-10/orders/count.json` | Read |
| Create manual order | `POST /admin/api/2024-10/orders.json` | Write |
| List transactions | `GET /admin/api/2024-10/orders/{id}/transactions.json` | Read |

### 11.3 Order List Filter → API Params

| Filter UI | Shopify API param |
|---|---|
| Status tab | `fulfillment_status=fulfilled` etc. |
| Payment status | `financial_status=paid` etc. |
| Date range | `created_at_min`, `created_at_max` |
| Search | `status=any&q=[query]` |
| Tags | `tag=[tag_name]` |
| Value min/max | `order.total_price` — filter client-side or via metafields |

### 11.4 Webhook Subscriptions

| Topic | Consumer |
|---|---|
| `orders/create` | New order toast + count update |
| `orders/updated` | Order detail real-time refresh |
| `orders/paid` | Payment confirmed; loyalty trigger |
| `orders/fulfilled` | Timeline update |
| `orders/cancelled` | Status update |
| `orders/partially_fulfilled` | Status update |
| `refunds/create` | Payment card update |
| `fulfillments/create` | Tracking card update |
| `fulfillments/update` | Tracking update |
| `fulfillments/destroy` | Shipment voided |
| `orders/risks/create` | Risk card update |

---

## 12. Order Status State Machine

```
┌──────────────────────────────────────────────────────────────────────┐
│                     ORDER STATUS STATE MACHINE                       │
│                                                                      │
│  [ORDER_PLACED] ─────────────────────────────────────────┐          │
│       │                                                   │          │
│       ▼                                                   │          │
│  [PAYMENT_CONFIRMED]                              (payment fails)    │
│       │                                                   ▼          │
│  [PROCESSING / PACKING] ──────────────► [PAYMENT_FAILED]            │
│       │              (cancel)                                        │
│       │◄──────────────────────                                       │
│       ▼                                                              │
│  [CANCELLED] ◄── (cancel before dispatch)                           │
│                                                                      │
│  [DISPATCHED / IN_TRANSIT]                                           │
│       │                                                              │
│       ├────────────────────────────► [DELIVERY_ATTEMPTED]           │
│       │                                      │                       │
│       │◄─────────────────────────────────────┘ (reschedule)         │
│       ▼                                                              │
│  [OUT_FOR_DELIVERY]                                                  │
│       │                                                              │
│       ├────────────────────────────► [DELIVERY_ATTEMPTED]           │
│       ▼                                                              │
│  [DELIVERED] ──────────────────────► [RETURN_REQUESTED]            │
│                   (within window)            │                       │
│                                              ▼                       │
│                                    [RETURN_IN_TRANSIT]               │
│                                              │                       │
│                                              ▼                       │
│                                    [RETURN_RECEIVED]                 │
│                                              │                       │
│                                              ▼                       │
│                                    [REFUND_PROCESSED]                │
└──────────────────────────────────────────────────────────────────────┘
```

### Valid Status Transitions (state machine enforcement)

| From state | Valid next states |
|---|---|
| `ORDER_PLACED` | `PAYMENT_CONFIRMED` · `CANCELLED` |
| `PAYMENT_CONFIRMED` | `PROCESSING` · `CANCELLED` |
| `PROCESSING` | `DISPATCHED` · `CANCELLED` |
| `DISPATCHED` | `OUT_FOR_DELIVERY` · `DELIVERY_ATTEMPTED` |
| `OUT_FOR_DELIVERY` | `DELIVERED` · `DELIVERY_ATTEMPTED` |
| `DELIVERY_ATTEMPTED` | `OUT_FOR_DELIVERY` (reschedule) · `CANCELLED` |
| `DELIVERED` | `RETURN_REQUESTED` (within window) |
| `RETURN_REQUESTED` | `RETURN_IN_TRANSIT` · `REJECTED` |
| `RETURN_IN_TRANSIT` | `RETURN_RECEIVED` |
| `RETURN_RECEIVED` | `REFUND_PROCESSED` |
| `CANCELLED` | No transitions (terminal) |
| `REFUND_PROCESSED` | No transitions (terminal) |

**UI enforcement:** The status dropdown in the fulfilment panel and bulk update modal must only show valid next states. Attempting to set an invalid state via API must return `422 Unprocessable Entity`.

---

## 13. Accessibility Requirements

### 13.1 Focus Management

| Interaction | Focus behaviour |
|---|---|
| Orders list page load | Focus → search field |
| Filter drawer open | Focus → first checkbox |
| Filter drawer close (Escape) | Focus → Filter button |
| Order row click | Focus → order detail `<h1>` |
| Fulfilment form open | Focus → tracking number input |
| Bulk bar appears | `aria-live` announces; focus stays on last row |
| Refund confirm modal open | Focus → "Review again" (safe action) |
| Return reject modal open | Focus → reason textarea |
| Toast appears | Announced; focus does NOT move |
| After fulfil success | Focus stays on "Mark as Fulfilled" button |
| After cancel confirm | Focus → order detail heading |

### 13.2 Full ARIA Map

| Component | ARIA |
|---|---|
| Breadcrumb | `<nav aria-label="Breadcrumb">`, `aria-current="page"` |
| Page heading | `<h1>` — `"Orders"` / `"Order #ORD-4821"` |
| KPI row | `role="region"`, `aria-label="Order metrics"` |
| KPI card | `aria-label="[label]: [value]. [delta]"` |
| Status tabs | `role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls` |
| Tab counts | `aria-live="polite"` |
| Search input | `aria-label="Search orders"`, `aria-controls` → table |
| Filter button | `aria-label="Filter orders (3 active)"` when filters applied |
| Filter drawer | `role="dialog"`, `aria-label="Order filters"`, focus trap |
| Filter checkboxes | `role="checkbox"`, `aria-checked` |
| Filter accordion | `<button>`, `aria-expanded`, `aria-controls` |
| Active chip strip | `role="group"`, `aria-label="Active filters"` |
| Chip remove | `aria-label="Remove [filter] filter"` |
| Orders table | `role="grid"`, `aria-label="Orders"` |
| Column headers | `role="columnheader"`, sortable: `aria-sort` |
| Sort button | `aria-label="Sort by [column] [direction]"` |
| Row checkbox | `aria-label="Select order [number]"`, `aria-checked` |
| Select all | `aria-label="Select all orders"`, `aria-checked="mixed"` partial |
| Bulk bar count | `aria-live="polite"` |
| Order row | `role="row"`, `aria-selected` |
| Overflow menu | `aria-haspopup="menu"`, `aria-expanded`; `role="menu"`, `role="menuitem"` |
| Pagination | `<nav aria-label="Pagination">`, active `aria-current="page"` |
| Timeline | `role="list"`, `aria-label="Fulfilment timeline"` |
| Timeline item | `role="listitem"` |
| Active dot | `aria-current="step"` |
| Items list | `role="list"`, `aria-label="Order items"` |
| Item row | `role="listitem"`, `aria-label="[product], qty [n], [price]"` |
| Fulfilment form | `role="form"`, `aria-label="Fulfilment details"` |
| Mark fulfilled btn | `aria-busy` during loading |
| Return checkboxes | `aria-label="Return [product name]"`, `aria-checked` |
| Refund total | `aria-live="polite"` on change |
| Risk card | `role="region"`, `aria-label="Risk assessment"` |
| Activity log | `role="log"`, `aria-label="Order activity log"` |
| Admin notes | `role="log"`, `aria-label="Admin notes"` |
| New order toast | `role="status"`, `aria-live="polite"` |
| Update banner | `role="status"`, `aria-live="polite"` |
| Copy buttons | Update `aria-label` to "Copied!" on success |
| Confirm modals | `role="alertdialog"`, `aria-modal="true"`, focus trap |
| Send email modal | `role="dialog"`, `aria-modal="true"`, focus trap |

### 13.3 Keyboard Map

| Key | Behaviour |
|---|---|
| `Tab` | Forward through interactive elements |
| `Shift+Tab` | Backward |
| `Enter` | Activate button/link; open order row |
| `Space` | Toggle checkbox; activate button |
| `Arrow Up/Down` | Navigate dropdown menus; table rows |
| `Arrow Left/Right` | Navigate status tabs |
| `Escape` | Close filter drawer / modal / dropdown |
| `Ctrl+A` | Select all visible rows |
| `Delete` | Cancel selected order (with confirm) |
| `P` (row focused) | Quick-print invoice |
| `F` (row focused) | Quick-open fulfilment panel |

### 13.4 Testable Acceptance Criteria

| # | Criterion | Method | Pass |
|---|---|---|---|
| A1 | No contrast failures | axe DevTools | Zero critical |
| A2 | All focus rings visible (`2px solid #00b566` + glow) | Manual Tab | Every element |
| A3 | Status tab keyboard-navigable | Arrow keys | `aria-selected` updates |
| A4 | Table sort by keyboard | Enter on `<th>` | `aria-sort` updates |
| A5 | Row checkbox selects row | Space | `aria-selected` + bulk bar |
| A6 | Bulk count announced | Screen reader | `aria-live="polite"` fires |
| A7 | Filter drawer focus-trapped | Keyboard | Tab cycles inside only |
| A8 | Filter closes on Escape | Keyboard | Focus returns to Filter btn |
| A9 | Fulfilment modal focus-trapped | Keyboard | Tab cycles inside |
| A10 | Refund total announced on change | Screen reader | `aria-live="polite"` fires |
| A11 | Overflow menu keyboard-operable | Keyboard | Arrows + Escape work |
| A12 | Copy buttons announce success | Screen reader | "Copied!" announced |
| A13 | Timeline active step announced | Screen reader | `aria-current="step"` |
| A14 | New order toast announced | Screen reader | `role="status"` fires |
| A15 | `prefers-reduced-motion` respected | OS setting | Pulse + animations removed |

---

## 14. Content & Tone Standards

### 14.1 Order Status Labels (Canonical)

| Internal | Display | Never use |
|---|---|---|
| `unfulfilled` | `Unfulfilled` | "Not shipped", "Pending shipment" |
| `processing` | `Processing` | "In progress" |
| `shipped` | `Shipped` | "Dispatched", "Sent" |
| `out_for_delivery` | `Out for Delivery` | "On the way" |
| `delivered` | `Delivered` | "Completed", "Done" |
| `attempted` | `Delivery Attempted` | "Failed delivery" |
| `cancelled` | `Cancelled` | "Voided", "Deleted" |
| `return_requested` | `Return Requested` | "Return pending" |
| `return_in_transit` | `Return In Transit` | "Returning" |
| `return_received` | `Return Received` | "Returned" |
| `refund_initiated` | `Refund Initiated` | "Refunding" |
| `refunded` | `Refunded` | "Money back" |

### 14.2 CTA Labels

| Action | Label | Never use |
|---|---|---|
| Fulfil order | `"Mark as Fulfilled"` | "Ship it", "Done" |
| Update tracking | `"Update Tracking Number"` | "Edit tracking" |
| Cancel order | `"Cancel Order"` | "Delete", "Remove" |
| Issue refund | `"Confirm Refund — ₹[amount]"` | "Submit", "Proceed" |
| Approve return | `"Approve & Process Refund"` | "Confirm", "OK" |
| Reject return | `"Reject Return"` | "Decline", "No" |
| Print invoice | `"Print Invoice"` | "Download", "Export" |
| Create order | `"Create Order"` | "Submit order" |
| Safe action (confirms) | Always named clearly: `"Keep Order"`, `"Review again"` | "Cancel", "No", "Back" |

### 14.3 Error Messages

| Error | Message |
|---|---|
| Fulfil without tracking | `"No tracking number added. Fulfil anyway?"` (warning, not block) |
| Refund > order total | `"Refund cannot exceed the original total of ₹[amount]."` |
| Cancel delivered order | `"This order has already been delivered. Initiate a return instead."` |
| Duplicate fulfilment | `"This order is already fulfilled. Use 'Update Tracking' instead."` |
| Payment capture failed | `"Payment capture failed. Try again or contact your payment gateway."` |
| COD mark-paid without confirm | `"Confirm you've collected ₹[amount] in cash before marking as paid."` |
| Network error | `"Something went wrong. Refresh and try again."` |

### 14.4 Confirmation Dialog Templates

| Action | Heading | Body | Safe action | Destructive |
|---|---|---|---|---|
| Mark fulfilled | `"Mark as fulfilled?"` | `"Updates customer tracking. Sends notification."` | `"Review first"` | `"Mark as Fulfilled"` |
| Cancel order | `"Cancel order #ORD-4821?"` | `"Customer notified. Issue refund separately if paid."` | `"Keep Order"` | `"Cancel Order"` |
| Process refund | `"Process refund of ₹[amount]?"` | `"Sent to [customer]'s [payment method]. Cannot be undone."` | `"Review again"` | `"Confirm Refund"` |
| Void shipment | `"Void this shipment?"` | `"Order returns to Unfulfilled. Carrier may charge a fee."` | `"Keep Shipment"` | `"Void Shipment"` |
| Reject return | `"Reject this return?"` | `"Customer will be notified by email."` | `"Review again"` | `"Reject Return"` |

---

## 15. Anti-Patterns & Prohibited Implementations

| Anti-pattern | Why prohibited | Correct approach |
|---|---|---|
| Raw hex values in CSS | Breaks admin token system | Use `admin.*` / `ord.*` tokens only |
| `outline: none` on any element | WCAG 2.4.11 failure | `outline: 2px solid ord.focus-ring` always |
| Rendering 500+ rows without virtual scroll | Browser lock-up | Virtual scroll mandatory beyond 100 rows |
| Colour-only status badges (no text label) | WCAG 1.4.1 failure | Always pair colour with text + icon |
| Cancelling a delivered order without error | Data integrity issue | Show: "Cannot cancel delivered order. Initiate return." |
| Refund amount > order total | Financial error | Validate max = order total in real-time |
| Auto-fulfilling without tracking confirmation | Broken customer experience | Warn if no tracking; require confirmation |
| Bulk status change without state machine check | Silent invalid transitions | Show skip count; auto-skip with warning |
| Printing invoices as rasterised images | Inaccessible; unsearchable | HTML/CSS print layout or proper PDF |
| Showing full credit card number | PCI-DSS violation | Always mask: `•••• XXXX` only |
| Exporting customer PII without role check | GDPR/privacy violation | Role-check; show warning before export |
| Allowing any role to void a payment | Financial risk | Super Admin + Ops Manager only |
| Deleting admin notes without confirmation | Permanent data loss | Inline confirm before delete |
| Auto-sending emails on every admin action | Customer spam | Notify checkbox; default opt-in |
| No conflict detection on concurrent edits | Data overwrite | Check `updated_at` on every save |
| Overflow menu without keyboard navigation | Mouse-only interaction | Arrows + Enter + Escape required |
| Filter drawer without Escape-to-close | Keyboard trap | Escape always closes drawer |
| Missing `<caption>` or `aria-label` on tables | Screen reader lost | All tables must have accessible names |

---

## 16. Edge-Case Handling

| Scenario | Behaviour |
|---|---|
| Order with 50+ line items | Paginate items list (20/page) with search within order |
| Partial fulfilment (some items shipped) | Per-item fulfilment status; allow remaining items separately |
| Order with multiple shipments | Separate tracking card per fulfilment; timeline shows per-shipment |
| COD collected offline | `[Mark as Paid]` requires amount confirmation; creates `cash` transaction |
| Payment gateway timeout on refund | Show "Refund pending"; retry button; fallback: check gateway dashboard |
| Order placed during stock-out (oversell) | Warning banner: `"⚠ [Product] is out of stock. Contact customer before fulfilling."` |
| Duplicate order same customer (< 10 min) | Warning chip: `"⚠ Possible duplicate of #ORD-[previous]"` |
| Very large order (> 50 items, > ₹50,000) | Flag for manual review; `[Approve for Fulfilment]` by Ops Manager |
| Address change after dispatch | Error: "Cannot change address — already dispatched. Contact carrier." |
| Return window expired (> 7 days) | Hide return button; admin can `[Override Return Window]` |
| International order | Show currency as placed; address in local format |
| Cancelled order with loyalty points used | Auto-reverse points via Shopify Flow |
| Bulk-select 1000+ orders | Warning: "Bulk actions may take several minutes." Progress shown. |
| Network disconnect during fulfilment mark | Save state locally; auto-retry on reconnect; `"Reconnecting..."` indicator |
| Order flagged high-risk (score > 70) | Auto-hold; banner: `"⚠ On hold for fraud review."` |
| Gift order with custom message | Auto-populate in admin notes; include in packing slip |
| Cancelled order with active cart items (same products) | Warning: "This product is in [n] customer carts." |

---

## 17. Performance Requirements

| Metric | Target | Rule |
|---|---|---|
| Orders list load | `< 1.5s` | First 25 rows SSR; table virtualised |
| Order detail load | `< 1s` | SSR all panels; no client-side waterfall |
| Search response | `< 300ms` | Debounced `250ms`; server search |
| Filter apply | `< 200ms` | URL update + refetch |
| Real-time update | `< 2s` | WebSocket; fallback polling 30s |
| Bulk action (25 orders) | `< 3s` | Batch API; progress shown |
| Bulk action (250+ orders) | Background job | Queue + email when complete |
| Invoice print | `< 500ms` | HTML/CSS print; no image rendering |
| Export CSV (25 rows) | `< 1s` | Client-side generation |
| Export CSV (10,000+ rows) | Background job | Email download link |
| Table row interactions | `< 100ms` | Local state; no API per click |

---

## 18. Analytics & Tracking Events

| Event | Trigger | Properties |
|---|---|---|
| `orders_list_view` | Page load | `admin_id`, `filter_status`, `page` |
| `order_detail_view` | Detail load | `admin_id`, `order_id`, `status` |
| `orders_search` | Search | `admin_id`, `query`, `result_count` |
| `orders_filter_apply` | Filter applied | `admin_id`, `filters[]` |
| `orders_tab_switch` | Status tab click | `admin_id`, `status` |
| `orders_row_select` | Checkbox tick | `admin_id`, `order_id` |
| `orders_select_all` | Select all | `admin_id`, `count` |
| `orders_bulk_action` | Bulk submit | `admin_id`, `action`, `count`, `success_count` |
| `order_fulfil_open` | Fulfil form open | `admin_id`, `order_id` |
| `order_fulfil_submit` | Submit | `admin_id`, `order_id`, `has_tracking`, `notify` |
| `order_fulfil_success` | Confirmed | `admin_id`, `order_id`, `carrier` |
| `order_cancel_open` | Cancel clicked | `admin_id`, `order_id`, `status` |
| `order_cancel_confirm` | Cancel confirmed | `admin_id`, `order_id` |
| `order_refund_open` | Refund form | `admin_id`, `order_id` |
| `order_refund_submit` | Refund submit | `admin_id`, `order_id`, `amount`, `type` |
| `order_return_approve` | Return approved | `admin_id`, `order_id`, `refund_amount` |
| `order_return_reject` | Return rejected | `admin_id`, `order_id`, `reason` |
| `order_note_add` | Note saved | `admin_id`, `order_id`, `is_internal` |
| `order_print_invoice` | Invoice printed | `admin_id`, `order_id` |
| `order_email_send` | Email sent | `admin_id`, `order_id`, `template` |
| `order_tag_add` | Tag added | `admin_id`, `order_id`, `tag` |
| `order_flag_suspicious` | Flagged | `admin_id`, `order_id` |
| `orders_export` | Export triggered | `admin_id`, `count`, `filters[]` |
| `order_create_submit` | New order created | `admin_id`, `order_id`, `item_count`, `total` |
| `order_conflict_detected` | Concurrent edit | `admin_id`, `order_id`, `conflicting_admin_id` |
| `order_bulk_status_skip` | Orders skipped | `admin_id`, `action`, `skipped_count`, `reason` |

---

## 19. Internationalisation (i18n)

```json
{
  "ord.page.title": "Orders",
  "ord.page.subtitle": "{{count}} total orders",
  "ord.page.new": "+ Create Order",

  "ord.tabs.all": "All ({{count}})",
  "ord.tabs.pending": "Pending ({{count}})",
  "ord.tabs.processing": "Processing ({{count}})",
  "ord.tabs.shipped": "Shipped ({{count}})",
  "ord.tabs.delivered": "Delivered ({{count}})",
  "ord.tabs.cancelled": "Cancelled ({{count}})",
  "ord.tabs.returned": "Returned ({{count}})",

  "ord.table.col.order": "ORDER",
  "ord.table.col.customer": "CUSTOMER",
  "ord.table.col.items": "ITEMS",
  "ord.table.col.total": "TOTAL",
  "ord.table.col.payment": "PAYMENT",
  "ord.table.col.fulfilment": "FULFILMENT",
  "ord.table.col.courier": "COURIER",
  "ord.table.col.date": "DATE",
  "ord.table.col.actions": "ACTIONS",

  "ord.status.unfulfilled": "Unfulfilled",
  "ord.status.processing": "Processing",
  "ord.status.shipped": "Shipped",
  "ord.status.out_for_delivery": "Out for Delivery",
  "ord.status.delivered": "Delivered",
  "ord.status.attempted": "Delivery Attempted",
  "ord.status.cancelled": "Cancelled",
  "ord.status.return_requested": "Return Requested",
  "ord.status.return_in_transit": "Return In Transit",
  "ord.status.return_received": "Return Received",
  "ord.status.refunded": "Refunded",

  "ord.payment.paid": "Paid",
  "ord.payment.pending": "Pending",
  "ord.payment.failed": "Failed",
  "ord.payment.cod": "COD Pending",
  "ord.payment.refunded": "Refunded",

  "ord.action.view": "View",
  "ord.action.fulfil": "Fulfil",
  "ord.action.mark_fulfilled": "Mark as Fulfilled",
  "ord.action.update_tracking": "Update Tracking Number",
  "ord.action.mark_delivered": "Mark as Delivered",
  "ord.action.cancel": "Cancel Order",
  "ord.action.refund_confirm": "Confirm Refund — ₹{{amount}}",
  "ord.action.approve_return": "Approve & Process Refund",
  "ord.action.reject_return": "Reject Return",
  "ord.action.print_invoice": "Print Invoice",
  "ord.action.print_packing": "Print Packing Slip",
  "ord.action.send_email": "Send Email",
  "ord.action.send_sms": "Send SMS",
  "ord.action.create_order": "Create Order",
  "ord.action.flag": "Flag as Suspicious",
  "ord.action.void_shipment": "Void Shipment",
  "ord.action.mark_paid": "Mark as Paid",

  "ord.fulfil.success": "Order {{order}} marked as fulfilled.",
  "ord.refund.success": "Refund of ₹{{amount}} initiated. 5–7 business days to appear.",
  "ord.cancel.success": "Order {{order}} has been cancelled.",

  "ord.confirm.fulfil.heading": "Mark as fulfilled?",
  "ord.confirm.fulfil.body": "Updates customer tracking and sends notification.",
  "ord.confirm.fulfil.safe": "Review first",
  "ord.confirm.fulfil.action": "Mark as Fulfilled",

  "ord.confirm.cancel.heading": "Cancel order {{order}}?",
  "ord.confirm.cancel.body": "Customer notified. Issue a refund separately if payment was taken.",
  "ord.confirm.cancel.safe": "Keep Order",
  "ord.confirm.cancel.action": "Cancel Order",

  "ord.confirm.refund.heading": "Process refund of ₹{{amount}}?",
  "ord.confirm.refund.body": "Sent to {{customer}}'s {{method}}. Cannot be undone.",
  "ord.confirm.refund.safe": "Review again",
  "ord.confirm.refund.action": "Confirm Refund",

  "ord.error.cancel_delivered": "This order has already been delivered. Initiate a return instead.",
  "ord.error.refund_excess": "Refund cannot exceed the original total of ₹{{amount}}.",
  "ord.error.no_tracking": "No tracking number added. Fulfil anyway?",
  "ord.error.network": "Something went wrong. Refresh and try again.",

  "ord.copy.tracking": "Copy tracking number",
  "ord.copy.txn": "Copy transaction ID",
  "ord.copy.address": "Copy address",
  "ord.copy.success": "Copied!",

  "ord.empty.no_orders": "No orders yet",
  "ord.empty.no_orders_body": "Orders appear here once customers start purchasing.",
  "ord.empty.no_results": "No orders found",
  "ord.empty.no_results_body": "Try adjusting your filters or search terms.",

  "ord.note.placeholder": "Type a note...",
  "ord.note.internal": "Internal only (not visible to customer)",
  "ord.note.save": "Save Note",

  "ord.toast.new_order": "New order: {{order}} — {{customer}} — ₹{{total}}",
  "ord.toast.updated_by": "Updated by {{admin}} {{time}}.",

  "ord.bulk.selected": "{{count}} selected",
  "ord.bulk.status_skip": "{{count}} orders in a later status — skipped.",

  "ord.kpi.orders_today": "Orders Today",
  "ord.kpi.revenue_today": "Revenue Today",
  "ord.kpi.avg_order": "Avg Order Value",
  "ord.kpi.pending": "Pending Fulfilment",
  "ord.kpi.shipped": "Shipped Today",
  "ord.kpi.cancelled": "Cancelled Today",
  "ord.kpi.returns": "Return Requests",
  "ord.kpi.cod": "COD Pending"
}
```

---

## 20. Component State Master Table

| Component | Default | Hover | Focus-visible | Active | Disabled | Loading | Error | Success |
|---|---|---|---|---|---|---|---|---|
| Status tab (default) | `ord.border`, transparent, `ord.text-muted` | `ord.card-hover` bg, `ord.text` | `2px` ring `ord.focus-ring` | — | — | — | — | — |
| Status tab (active) | `ord.accent` bg, white, weight 700 | Darken 5% | `2px` ring | — | — | — | — | — |
| Table header (sort) | `ord.text-label`, `↑↓` neutral | `ord.text`, pointer | `2px` ring | — | — | — | — | — |
| Table header (sorted) | `ord.accent`, `↑`/`↓` | — | `2px` ring | — | — | — | — | — |
| Table row | `ord.card-bg` | `ord.card-hover` | `2px` ring on row | — | — | — | — | — |
| Table row (selected) | `ord.accent-bg`, green left bar | Deeper green bg | `2px` ring | — | — | — | — | — |
| Row checkbox | `ord.border`, white | `ord.border-active` | `ord.focus-glow` | — | — | — | — | `ord.accent` fill + ✓ |
| Select all checkbox | `ord.border` | `ord.border-active` | `ord.focus-glow` | — | — | — | — | Mixed: `─`; Full: ✓ |
| Overflow menu trigger | `ord.text-muted` | `ord.card-hover`, `ord.text` | `2px` ring | — | — | — | — | — |
| Overflow menu item | Transparent | `ord.card-hover` | `2px` ring | — | — | — | — | — |
| Overflow item (danger) | Transparent | `ord.cancelled-bg` | `2px` ring | — | — | — | — | — |
| KPI card | `ord.card-bg`, `ord.border-muted` | `ord.card-hover`, `motion.instant` | `2px` ring (if linked) | — | — | Skeleton shimmer | — | — |
| Primary button | `ord.accent` | `ord.accent` darken 10% | `2px` ring + `ord.focus-glow` | Scale `0.98` | `opacity: 0.4`, `aria-disabled` | Spinner, `aria-busy` | — | — |
| Secondary button | Transparent, `ord.border` | `ord.card-hover` | `2px` ring | Scale `0.98` | `opacity: 0.4` | Spinner | — | — |
| Ghost button | Transparent | `ord.card-hover`, `ord.text` | `2px` ring | — | `opacity: 0.4` | — | — | — |
| Danger button | `ord.cancelled` | Darken 10% | `2px` ring | Scale `0.98` | `opacity: 0.4` | Spinner | — | — |
| Filter button | `ord.border`, transparent | `ord.card-hover` | `2px` ring | — | — | — | — | — |
| Filter button (active) | `ord.accent-bg`, `ord.accent` border | Deeper tint | `2px` ring | — | — | — | — | — |
| Filter checkbox | `ord.border`, white | `ord.border-active` | `ord.focus-glow` | — | — | — | — | `ord.accent` fill |
| Input field | `ord.input-bg`, `ord.border` | `ord.border-active` @ 60% | `ord.border-active` + `ord.focus-glow` | — | Muted bg | — | `ord.cancelled` border + bg tint | `ord.delivered` border |
| "Mark as Fulfilled" | `ord.accent` | Darken 10% | `2px` ring | Scale `0.98` | `opacity: 0.4` | Spinner, `aria-busy` | Error toast | Toast: "fulfilled" |
| "Cancel Order" (danger) | `ord.cancelled` | Darken | `2px` ring | Scale `0.98` | — | Spinner | Error toast | Confirm modal → success |
| "Confirm Refund" | `ord.accent` | Darken | `2px` ring | Scale `0.98` | 0 items selected | Spinner | Error toast | Toast: "Refund initiated" |
| "Reject Return" | Ghost, `ord.danger` | `ord.cancelled-bg` tint | `2px` ring | — | — | Spinner | — | Status → Rejected |
| Tracking copy btn | `ord.text-muted` icon | `ord.accent` | `2px` ring | — | — | — | — | ✓ icon for 2s |
| Timeline dot (complete) | `ord.accent` fill, ✓ | — | — | — | — | — | — | — |
| Timeline dot (active) | `ord.accent` + pulse ring | — | — | — | — | — | — | — |
| Timeline dot (pending) | `ord.border` outline | — | — | — | — | — | — | — |
| Pagination button | `ord.card-bg`, `ord.border` | `ord.card-hover` | `2px` ring | — | — | — | — | — |
| Pagination active | `ord.accent` bg, white | — | `2px` ring | — | — | — | — | — |
| Pagination arrow (end) | `ord.text-muted` | — | `2px` ring | — | `opacity: 0.3`, `aria-disabled` | — | — | — |
| Admin notes textarea | `ord.input-bg`, `ord.border` | `ord.border-active` @ 60% | `ord.border-active` + glow | — | Muted | — | Red border | — |
| "Save Note" | Secondary outlined | `ord.card-hover` | `2px` ring | Scale `0.98` | Empty textarea | Spinner | Error toast | Note appears; textarea clears |
| Risk "Flag" button | Ghost, `ord.danger` | `ord.cancelled-bg` | `2px` ring `ord.danger` | Scale `0.98` | — | — | — | Tag added; toast |
| Fulfil "Save Draft" | Secondary outlined | `ord.card-hover` | `2px` ring | Scale `0.98` | — | Spinner | Error toast | "Draft saved" toast |
| New order toast | `ord.card-bg`, green border, slide in | — | — | — | — | — | — | Auto-dismisses 8s |
| Toast dismiss `×` | `ord.text-muted` | `ord.text` | `2px` ring | Scale `0.95` | — | — | — | — |
| Concurrent edit banner | `admin.color.status.info.bg` | — | — | — | — | — | — | — |
| Banner `[Refresh]` | Info text link | Underline | `2px` ring | — | — | Spinner | — | Page refreshes |
| Bulk "Update Status" | `ord.accent` | Darken | `2px` ring | Scale `0.98` | 0 rows selected | Spinner, `aria-busy` | Error toast | Toast: "X orders updated" |

---

## 21. Final Summary — Complete Section Map

```
Admin Orders Module — v1.0
Complete Design Specification
═══════════════════════════════════════════════════════════════════════
CORE SPEC (§1–§12)

§1   Context & Goals
§2   Design Tokens (17 inherited tokens, 28 ord.* aliases,
     typography × 17, spacing × 10, radius × 5, motion × 4,
     contrast audit × 7 pairings)

ORDERS LIST PAGE (§3–§4)
§3   Page Layout (list + detail shell diagrams, layout rules)
§4   Orders List Page
     §4.1  Page Header (title, subtitle, date range, CTAs)
     §4.2  KPI Cards Row (8 cards, click-to-filter, sparklines)
     §4.3  Status Filter Tabs (7 tabs, live counts, URL sync)
     §4.4  Table Toolbar (search, filter, sort, columns, bulk bar)
     §4.5  Filter Drawer (8 sections, instant apply, active chips)
     §4.6  Orders Data Table
           • 11 columns with specs
           • Header (sort, aria-sort)
           • Row states (default/hover/selected)
           • Order # cell, customer cell, items hover tooltip
           • Payment badges (5 variants)
           • Fulfilment badges (7 variants)
           • Actions + overflow menu (11 items)
           • Virtual scroll rule
     §4.7  Pagination
     §4.8  Empty States (no orders + no results)

ORDER DETAIL PAGE (§5–§6)
§5   Left Column
     §5.1  Breadcrumb & Header
     §5.2  Fulfilment Timeline
           • Progress bar (6px, animated fill)
           • Step dots (completed/active/pending + pulse)
           • Event log with aria-current="step"
     §5.3  Order Items Panel
           • Item rows (thumbnail, SKU, variant, stock status)
           • Order totals (subtotal→total)
     §5.4  Fulfilment Actions Panel (5 status variants)
     §5.5  Return & Refund Panel
           • Return form (item select, return type, live calculation)
           • Refund-only flow
     §5.6  Admin Notes Panel
     §5.7  Activity Log Panel (collapsed)

§6   Right Column (sticky 38%)
     §6.1  Order Summary Card
     §6.2  Customer Card + Send Email modal
     §6.3  Delivery Address Card
     §6.4  Payment Card (conditional buttons)
     §6.5  Carrier & Tracking Card
     §6.6  Risk Assessment Card
     §6.7  Tags & Attributes Card

CREATE ORDER (§7)
§7   Create Order Page (customer, products, discount, shipping, payment)

PRINT FLOWS (§8)
§8   Invoice · Packing Slip · Return Label

BULK ACTIONS (§9)
§9   Update Status · Assign Courier · Print Invoices · Export

REAL-TIME (§10)
§10  New order toast · Live tab counts · Concurrent edit banner
     WebSocket/polling strategy (4 event types)

INTEGRATION (§11)
§11  Shopify API
     • 24-field order data mapping
     • 13 API endpoints
     • Filter → API param mapping
     • 11 webhook subscriptions

STATE MACHINE (§12)
§12  Full state diagram (12 states)
     Valid transition table
     UI enforcement rules

EXTENDED IMPLEMENTATION GUIDE (§13–§21)

§13  Accessibility Requirements
     • Focus management (10 scenarios)
     • Full ARIA map (34 components)
     • Keyboard map (11 keys)
     • 15 testable acceptance criteria

§14  Content & Tone Standards
     • Status labels (12 statuses)
     • CTA labels (9 actions)
     • Error messages (7 scenarios)
     • Confirmation dialog templates (5 dialogs)

§15  Anti-Patterns (× 18 prohibited implementations)

§16  Edge-Case Handling (× 17 scenarios)

§17  Performance Requirements (11 metrics with targets)

§18  Analytics & Tracking Events (× 26 events)

§19  Internationalisation (90 i18n keys)

§20  Component State Master Table (× 38 components × 8 states)

§21  Final Summary — Section Map (this section)

═══════════════════════════════════════════════════════════════════════
Total: ~2,700 lines | 21 sections
WCAG 2.2 AA | Admin dark token system (Outfit)

Companion documents:
  admin-dashboard-design.md     ← Admin system tokens & shared components
  admin-product-page-design.md  ← Product edit (linked from order items)
  order-tracking-design.md      ← Storefront order tracking (customer view)
  profile-design.md             ← Customer profile (linked from customer card)
  design-system.md              ← Master storefront design system

Last updated: June 2026
═══════════════════════════════════════════════════════════════════════
```

---

*Document version: 1.0 (complete) — Admin Orders Module*
*Sections: 1–12 (core spec) + 13–21 (extended implementation guide)*
*Guideline standard: WCAG 2.2 AA | Token system: Admin dark (Outfit)*
*Companion: `admin-dashboard-design.md` · `order-tracking-design.md` · `profile-design.md`*
*Last updated: June 2026*
