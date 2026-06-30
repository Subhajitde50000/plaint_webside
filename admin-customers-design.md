# Admin — Customers Module
## Design Specification v1.0 — Production-Ready

> **Design intent:** Deliver a comprehensive, data-rich customer management interface that gives operations, support, and marketing teams full visibility into customer profiles, order history, loyalty status, communication logs, and segment data — enabling personalised service and data-driven decisions — in a dark-theme admin environment that is keyboard-first, WCAG 2.2 AA compliant, and optimised for daily support workflows.

---

## 1. Context & Goals

| Property | Value |
|---|---|
| **Module name** | Customers |
| **URLs** | `/admin/customers` (list) · `/admin/customers/[id]` (detail) · `/admin/customers/new` (create) |
| **Parent** | Admin Dashboard (`admin-dashboard-design.md`) |
| **Primary goal** | Give support and ops teams a single pane of glass for every customer — history, behaviour, loyalty, and communication |
| **Secondary goals** | Enable fast issue resolution; support loyalty point adjustments; power marketing segmentation; surface VIP and at-risk customers |
| **User roles** | Super Admin (full) · Operations Manager (view + edit) · Customer Support (full) · Marketing (view + segments + email) · Analyst (read-only) |
| **Read-only roles** | Inventory Manager (no access) |
| **Linked modules** | Orders · Inventory · Garden Services · AI Care · Reviews |
| **Page density** | Tables: 4 · Cards: ~25 · Buttons: ~50 · Inputs: ~30 · Charts: 5 |

---

## 2. Design Tokens

All tokens inherited from `admin-dashboard-design.md §2`. Only semantic aliases are new.

### 2.1 Inherited Admin Tokens (Key)

| Token | Hex | Role |
|---|---|---|
| `admin.color.bg.canvas` | `#0f1117` | Page background |
| `admin.color.bg.sidebar` | `#161b22` | Sidebar |
| `admin.color.bg.surface` | `#1c2128` | Cards, panels |
| `admin.color.bg.elevated` | `#22272e` | Input bg, hover |
| `admin.color.bg.overlay` | `#2d333b` | Modals, dropdowns |
| `admin.color.text.primary` | `#cdd9e5` | Primary text |
| `admin.color.text.secondary` | `#768390` | Muted text |
| `admin.color.text.tertiary` | `#adbac7` | Labels |
| `admin.color.text.placeholder` | `#545d68` | Input placeholder |
| `admin.color.brand.green` | `#00b566` | CTAs, active, accent |
| `admin.color.brand.green.muted` | `#00b566` @ 15% | Selected bg |
| `admin.color.border.default` | `#444c56` | Borders |
| `admin.color.border.active` | `#00b566` | Focus, active |
| `admin.color.status.success` | `#57ab5a` | Active, paid |
| `admin.color.status.warning` | `#c69026` | At-risk, pending |
| `admin.color.status.error` | `#e5534b` | Blocked, error |
| `admin.color.status.info` | `#539bf5` | Info, new |
| `admin.color.status.purple` | `#986ee2` | VIP, special |

### 2.2 Customer Module Semantic Aliases

| Alias | Maps to | Usage |
|---|---|---|
| `cst.page-bg` | `admin.color.bg.canvas` | Page background |
| `cst.card-bg` | `admin.color.bg.surface` | All panels |
| `cst.card-hover` | `admin.color.bg.elevated` | Row hover |
| `cst.input-bg` | `admin.color.bg.elevated` | All inputs |
| `cst.overlay-bg` | `admin.color.bg.overlay` | Modals, dropdowns |
| `cst.text` | `admin.color.text.primary` | Primary text |
| `cst.text-muted` | `admin.color.text.secondary` | Meta, timestamps |
| `cst.text-label` | `admin.color.text.tertiary` | Column headers, labels |
| `cst.border` | `admin.color.border.default` | All borders |
| `cst.border-muted` | `admin.color.border.default` @ 50% | Subtle dividers |
| `cst.border-active` | `admin.color.border.active` | Focus, active |
| `cst.accent` | `admin.color.brand.green` | CTAs, active filters |
| `cst.accent-bg` | `admin.color.brand.green.muted` | Selected row, chip bg |
| `cst.focus-ring` | `admin.color.brand.green` | Focus ring |
| `cst.focus-glow` | `0 0 0 3px rgba(0,181,102,0.25)` | Focus glow |
| `cst.shadow` | `0 2px 8px rgba(0,0,0,0.25)` | Panel shadow |
| `cst.active` | `admin.color.status.success` | Active customer |
| `cst.active-bg` | `admin.color.status.success.bg` | Active badge bg |
| `cst.at-risk` | `admin.color.status.warning` | At-risk customer |
| `cst.at-risk-bg` | `admin.color.status.warning.bg` | At-risk badge bg |
| `cst.blocked` | `admin.color.status.error` | Blocked account |
| `cst.blocked-bg` | `admin.color.status.error.bg` | Blocked badge bg |
| `cst.vip` | `admin.color.status.purple` | VIP tier |
| `cst.vip-bg` | `admin.color.status.purple.bg` | VIP badge bg |
| `cst.new-customer` | `admin.color.status.info` | New customer |
| `cst.new-bg` | `admin.color.status.info.bg` | New badge bg |
| `cst.tier-plant` | `admin.color.brand.green` | Plant Lover tier |
| `cst.tier-silver` | `#adbac7` | Silver tier |
| `cst.tier-gold` | `#c69026` | Gold tier |
| `cst.danger` | `admin.color.status.error` | Destructive actions |
| `cst.star-fill` | `#c8a84b` | Star ratings (amber) |

### 2.3 Typography

| Role | Size | Weight | Colour |
|---|---|---|---|
| Page heading | `font.size.5xl` (24px) | 700 | `cst.text` |
| KPI value | `font.size.6xl` (32px) | 800 | `cst.text` |
| KPI label | `font.size.sm` (12px) | 500 | `cst.text-muted` |
| Section heading | `font.size.4xl` (18px) | 700 | `cst.text` |
| Panel heading | `font.size.3xl` (16px) | 600 | `cst.text` |
| Customer name (hero) | `font.size.5xl` (24px) | 700 | `cst.text` |
| Column header | `font.size.xs` (11px) | 700 | `cst.text-label`, uppercase |
| Table cell body | `font.size.sm` (12px) | 400 | `cst.text` |
| Table cell meta | `font.size.xs` (11px) | 400 | `cst.text-muted` |
| Status badge | `font.size.xs` (11px) | 700 | status colour |
| Tier badge | `font.size.xs` (11px) | 700 | tier colour |
| Button label | `font.size.sm` (12px) | 600 | per type |
| Input label | `font.size.xs` (11px) | 700 | `cst.text-label`, uppercase |
| Input value | `font.size.sm` (12px) | 400 | `cst.text` |
| Help text | `font.size.xs` (11px) | 400 | `cst.text-muted` |
| Email / phone | `font.size.sm` (12px) | 400 | `cst.text` |
| Customer ID | `font.family.mono`, `font.size.xs` | 400 | `cst.text-muted` |
| LTV value | `font.size.3xl` (16px) | 700 | `cst.accent` |
| Points value | `font.size.4xl` (18px) | 800 | `cst.accent` |
| Note text | `font.size.sm` (12px) | 400 | `cst.text` |
| Timeline entry | `font.size.xs` (11px) | 400 | `cst.text-muted` |
| Empty state | `font.size.3xl` (16px) | 600 | `cst.text` |
| Tab label | `font.size.sm` (12px) | 600 | active: `cst.accent` |

### 2.4 Spacing, Radius & Motion

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

| Token | Value | Usage |
|---|---|---|
| `radius.xs` | `4px` | Badges, micro chips |
| `radius.sm` | `6px` | Inputs, buttons |
| `radius.md` | `8px` | Cards, panels, modals |
| `radius.lg` | `12px` | Large panels, drawers |
| `radius.full` | `9999px` | Avatar, pill badges |

| Motion token | Value |
|---|---|
| `motion.instant` | `150ms` |
| `motion.fast` | `200ms` |
| `motion.normal` | `250ms` |
| `motion.slow` | `350ms` |


---

## 3. Page Layout

### 3.1 Customers List Structure

```
┌──────────────────────────────────────────────────────────────────────┐
│  TOP BAR (64px)                                                      │
├──────────────┬───────────────────────────────────────────────────────┤
│  SIDEBAR     │  BREADCRUMB: Admin / Customers                       │
│  (240px)     ├───────────────────────────────────────────────────────┤
│              │  PAGE HEADER + KPI ROW (6 cards)                     │
│              ├───────────────────────────────────────────────────────┤
│              │  SEGMENT FILTER TABS                                  │
│              ├───────────────────────────────────────────────────────┤
│              │  TABLE TOOLBAR (search · filter · sort · export)      │
│              ├───────────────────────────────────────────────────────┤
│              │  ACTIVE FILTER CHIPS (conditional)                    │
│              ├───────────────────────────────────────────────────────┤
│              │  CUSTOMERS TABLE (virtual scroll)                     │
│              ├───────────────────────────────────────────────────────┤
│              │  PAGINATION                                           │
└──────────────┴───────────────────────────────────────────────────────┘
```

### 3.2 Customer Detail Structure

```
┌──────────────┬──────────────────────────────┬────────────────────────┐
│  SIDEBAR     │  LEFT COLUMN (60%)           │  RIGHT COLUMN (40%)   │
│              │                              │  (sticky top: 80px)   │
│              │  • Customer Header           │  • Profile Card        │
│              │  • Detail Tabs               │  • Loyalty Card        │
│              │    - Overview                │  • Contact Card        │
│              │    - Orders                  │  • Addresses Card      │
│              │    - Reviews                 │  • Account Status Card │
│              │    - AI Care Queries         │  • Tags Card           │
│              │    - Garden Bookings         │  • Admin Notes Card    │
│              │    - Activity Log            │                        │
│              │                              │                        │
└──────────────┴──────────────────────────────┴────────────────────────┘
```

### 3.3 Layout Rules

| Property | Value |
|---|---|
| Content padding | `space.9 = 24px` all sides |
| Column gap (detail) | `space.9 = 24px` |
| Left column width | `60%` |
| Right column | `40%`, sticky `top: 80px` |
| Panel gap (vertical) | `space.9 = 24px` |
| Page background | `cst.page-bg` |
| Min page width | `1280px` |

---

## 4. Customers List Page

### 4.1 Page Header

```
Customers                        [📅 Last 30 days ▾]  [↓ Export]  [+ Add Customer]
12,481 total customers
```

| Element | Value |
|---|---|
| Title | `font.size.5xl` (24px), weight 700, `cst.text` |
| Subtitle | `"[n] total customers"`, `font.size.sm`, `cst.text-muted` |
| Date range | Today / Last 7 / Last 30 / This Month / Custom |
| Export | Secondary outlined, `radius.sm` |
| `+ Add Customer` | Primary `cst.accent` filled, `radius.sm` |

### 4.2 KPI Cards Row

```
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│  Total Customers │ │  New This Month  │ │  Active (30d)    │
│  12,481          │ │  342             │ │  4,821           │
│  ↑ +4.2%        │ │  ↑ +18 vs last  │ │  38.6% rate      │
└──────────────────┘ └──────────────────┘ └──────────────────┘
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│  Avg LTV         │ │  VIP Customers   │ │  At-Risk (90d    │
│  ₹14,820         │ │  284             │ │  no order)       │
│  ↑ +2.1%        │ │  🥇 Gold tier    │ │  1,204  ⚠        │
└──────────────────┘ └──────────────────┘ └──────────────────┘
```

**Single KPI card:**

| Property | Value |
|---|---|
| Background | `cst.card-bg` |
| Border | `1px solid cst.border-muted` |
| Border-radius | `radius.md` |
| Padding | `space.9 = 24px` |
| Label | `font.size.sm`, weight 500, `cst.text-muted` |
| Value | `font.size.6xl` (32px), weight 800, `cst.text` |
| Delta positive | `↑ +X%`, `cst.active` |
| Delta negative | `↓ −X%`, `cst.blocked` |
| "At-Risk" card | Value in `cst.at-risk`; border `cst.at-risk` left `3px` |
| Hover | `cst.card-hover` bg, `motion.instant` |
| Click | Filters table to that segment |
| Sparkline | 48px right-aligned, 30-day trend |
| `aria-label` | `"[label]: [value]. [delta context]"` |

### 4.3 Segment Filter Tabs

```
[ All (12,481) ]  [ VIP (284) ]  [ Gold (521) ]  [ Silver (1,240) ]
[ Plant Lover (10,436) ]  [ New (342) ]  [ At-Risk (1,204) ]  [ Blocked (54) ]
```

| Property | Value |
|---|---|
| Height | `36px`, `radius.sm` |
| Padding | `space.3` vertical, `space.7 = 16px` horizontal |
| Font | `font.size.sm`, weight 500 |
| Default | `cst.border` border, transparent, `cst.text-muted` |
| Active | `cst.accent` bg, white, weight 700 |
| VIP tab | `cst.vip` bg when active |
| Gold tab | `cst.tier-gold` text when active |
| Hover | `cst.card-hover`, `motion.instant` |
| Focus-visible | `2px` focus ring `cst.focus-ring` |
| `role` | `role="tablist"`, `role="tab"`, `aria-selected` |
| Keyboard | Arrow keys cycle; Enter selects |
| URL sync | `?segment=vip` |

### 4.4 Table Toolbar

```
[🔍 Search customers, email, phone...]  [Filter ▾ (2)]  [Sort: Newest ▾]  [Columns ▾]  [Export CSV]
```

**Search:**

| Property | Value |
|---|---|
| Width | `320px`, height `36px`, `cst.input-bg`, `cst.border`, `radius.sm` |
| Scope | Name, email, phone, customer ID, city |
| Debounce | `250ms` |
| Focus | `cst.border-active` + `cst.focus-glow` |
| `aria-label` | `"Search customers"` |

**Sort options:** Newest First (default) · Oldest Member · Highest LTV · Lowest LTV · Most Orders · Name A–Z · Last Active

**Bulk action bar:**

```
[ ☑ 24 selected ]  [Send Email ▾]  [Add Tag]  [Change Tier]  [Export Selected]  [Block]  [✕ Clear]
```

| Property | Value |
|---|---|
| Background | `cst.accent-bg`, `cst.accent` border, `radius.sm` |
| "Block" button | Ghost, `cst.danger` text |
| `aria-live` | `"polite"` on count |

### 4.5 Filter Drawer

Right-side drawer, `320px`, `role="dialog"`, `aria-label="Customer filters"`, focus trap.

**Filter sections:**

| Section | Options |
|---|---|
| Loyalty Tier | Plant Lover · Silver · Gold |
| Status | Active · New · At-Risk · Blocked · Unverified |
| Orders | Has ordered · Never ordered · Repeat buyer (3+) |
| Order Value | Min/Max LTV slider (₹0–₹1L+) |
| Total Orders | Min/Max count slider |
| Date Joined | Date range picker |
| Last Order Date | Date range picker |
| City / State | Search + checkbox multi-select |
| Tags | Search + checkbox (VIP / Corporate / Gifting / etc.) |
| Source | Direct · Google · Instagram · Referral · Other |
| Pet Owner | Yes / No |
| AI Care User | Yes / No |
| Garden Service Client | Yes / No |

| Property | Value |
|---|---|
| Apply | Instant on change |
| Clear All | `cst.danger` text |
| Accordion | `aria-expanded`, `aria-controls` |
| Close | `×` + Escape; focus → Filter button |

**Active filter chips (above table):**

```
× Tier: Gold, Silver    × LTV: ₹5,000+    × City: Mumbai    [Clear All]
```

### 4.6 Customers Data Table

**Column definitions:**

| # | Column | Content | Width | Sortable |
|---|---|---|---|---|
| 1 | ☐ | Row checkbox | `40px` | No |
| 2 | Customer | Avatar + Name + Email | `220px` | Yes |
| 3 | Phone | `+91 XXXXX XXXXX` | `140px` | No |
| 4 | Tier | 🌿 / 🥈 / 🥇 badge | `100px` | Yes |
| 5 | Orders | Count | `80px` | Yes |
| 6 | LTV | Lifetime value | `110px` | Yes |
| 7 | Last Order | Relative date | `120px` | Yes |
| 8 | Joined | Relative date | `120px` | Yes |
| 9 | City | City name | `100px` | Yes |
| 10 | Status | Active / At-Risk / Blocked badge | `110px` | Yes |
| 11 | Actions | `[View]` `[Email]` `[⋮]` | `110px` | No |

**Table shell:**

| Property | Value |
|---|---|
| Background | `cst.card-bg` |
| Border | `1px solid cst.border-muted`, `radius.md` |
| Overflow-x | `auto` |
| Virtual scroll | Mandatory beyond 100 rows |

**Header row:**

| Property | Value |
|---|---|
| Background | `cst.page-bg` |
| Font | `font.size.xs`, weight 700, `cst.text-label`, uppercase, `letter-spacing: 0.06em` |
| Padding | `space.4 = 8px` vertical, `space.7 = 16px` horizontal |
| Border-bottom | `1px solid cst.border` |
| Sort active | `cst.accent` colour + `↑`/`↓` |
| `aria-sort` | Per column header |

**Body row states:**

| State | Background | Left border |
|---|---|---|
| Default | `cst.card-bg` | None |
| Hover | `cst.card-hover` | None |
| Selected | `cst.accent-bg` | `3px solid cst.accent` |

| Property | Value |
|---|---|
| Min height | `56px` |
| Border-bottom | `1px solid cst.border-muted` |
| Padding | `space.4` vertical, `space.7` horizontal |
| Click | Opens customer detail page |

**Customer cell:**

```
[A]   Priya Kumar
      priya@email.com
```

| Property | Value |
|---|---|
| Avatar | `32×32px`, `radius.full`, photo or initials, `cst.accent-bg` bg |
| Name | `font.size.sm`, weight 600, `cst.text` |
| Email | `font.size.xs`, `cst.text-muted` |

**Tier badge:**

| Tier | Icon | Background | Text |
|---|---|---|---|
| Plant Lover | 🌿 | `cst.accent-bg` | `cst.tier-plant` |
| Silver | 🥈 | `admin.color.status.info.bg` | `cst.tier-silver` |
| Gold | 🥇 | `admin.color.status.warning.bg` | `cst.tier-gold` |

**Status badge:**

| Status | Background | Text |
|---|---|---|
| Active | `cst.active-bg` | `cst.active` |
| New | `cst.new-bg` | `cst.new-customer` |
| At-Risk | `cst.at-risk-bg` | `cst.at-risk` |
| Blocked | `cst.blocked-bg` | `cst.blocked` |
| Unverified | `cst.border` | `cst.text-muted` |

**All badge properties:**

| Property | Value |
|---|---|
| Font | `font.size.xs`, weight 700 |
| Border-radius | `radius.full` |
| Padding | `2px 6px` |
| Icon | `10×10px`, `space.1` gap |
| `aria-label` | `"Status: [status]"` |

**Actions cell overflow menu (⋮):**

```
View Profile
Edit Customer
Send Email
Send SMS
──────────────
Add Tag
Adjust Points
Change Tier
──────────────
Block Account
Delete Customer
```

| Property | Value |
|---|---|
| Background | `cst.overlay-bg`, `cst.border`, `radius.md`, `200px` |
| Destructive items | `cst.danger` colour |
| `role` | `role="menu"`, `role="menuitem"` |
| Keyboard | Arrows navigate; Enter activates; Escape closes |

### 4.7 Pagination

Same pattern as orders pagination: `"Showing 1–25 of 12,481"` · Page buttons · `[25 per page ▾]`.

### 4.8 Empty States

**No customers yet:**
```
        👥
  No customers yet
  Customers appear once they register
  or make their first purchase.
  [ View Storefront → ]
```

**No results for filters:**
```
        📭
  No customers found
  Try adjusting your filters or search.
  [ Clear Filters ]   [ Add Customer ]
```

---

## 5. Customer Detail Page

### 5.1 Breadcrumb & Header

```
Admin  /  Customers  /  Priya Kumar
```

```
Priya Kumar                              [ Active ● ]    [Send Email] [⋮]
#CST-00821 · priya@email.com · Joined 12 Jan 2025
```

| Element | Value |
|---|---|
| Name | `font.size.5xl` (24px), weight 700, `cst.text` |
| Status badge | Pill, right-aligned |
| Customer ID | `font.family.mono`, `font.size.xs`, `cst.text-muted` |
| Email + join date | `font.size.sm`, `cst.text-muted`, `·` separators |
| `[Send Email]` | Secondary outlined |
| `[⋮]` | Overflow: Edit / Block / Delete / Merge / Export Data |

### 5.2 Detail Tabs (Left column)

```
[ Overview ]  [ Orders (12) ]  [ Reviews (8) ]  [ AI Care (34) ]
[ Garden Bookings (3) ]  [ Activity Log ]
```

| Property | Value |
|---|---|
| Tab height | `40px` |
| Font | `font.size.sm`, weight 600 |
| Default | Transparent, `cst.text-muted` |
| Active | `cst.accent` bottom border `2px`, `cst.text`, weight 700 |
| Hover | `cst.text`, `motion.instant` |
| Focus-visible | `2px` focus ring `cst.focus-ring` |
| `role` | `role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls` |
| Keyboard | Arrow keys; Enter activates |
| Count badges | Pill, `cst.accent-bg`, `cst.accent` text |


---

## 6. Tab — Overview

### 6.1 Quick Stats Row

```
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ Orders   │ │ LTV      │ │ AOV      │ │ Returns  │ │ Reviews  │
│ 12       │ │ ₹14,820  │ │ ₹1,235   │ │ 0%       │ │ 8        │
└──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘
```

Same KPI card style as §4.2, compact variant: padding `space.7 = 16px`, value `font.size.4xl` (18px).

### 6.2 Order Frequency Chart

```
┌────────────────────────────────────────────────────────────┐
│  Order History                              [Last 12mo ▾] │
│                                                              │
│  ₹2,000 ─────────●───────────────●──────────────────────   │
│  ₹1,000 ──●───────────●─────●─────────●──────●──────────   │
│       0 ──┴───────────┴─────┴─────────┴──────┴──────────   │
│           Jul   Aug   Sep   Oct   Nov   Dec   Jan          │
└────────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Background | `cst.card-bg`, `cst.border-muted`, `radius.md` |
| Height | `240px` |
| Chart colour | `admin.color.chart.1` (green) |
| Grid lines | `admin.color.chart.grid` |
| Tooltip | Order date + amount on hover |
| `role` | `role="img"`, `aria-label` with summary |

### 6.3 Recent Orders Preview

```
┌────────────────────────────────────────────────────────────┐
│  Recent Orders                              [View All →]   │
├──────────┬──────────────┬──────────┬────────┬──────────────┤
│ #ORD-4821│ 15 Jun 2026  │ 3 items  │ ₹1,248 │ Delivered    │
│ #ORD-4312│ 20 May 2026  │ 1 item   │ ₹399   │ Delivered    │
│ #ORD-3998│ 02 May 2026  │ 2 items  │ ₹698   │ Delivered    │
└──────────┴──────────────┴──────────┴────────┴──────────────┘
```

Shows last 5 orders; links to full Orders tab (§7). Reuses order row style from `admin-orders-design.md §4.6`.

### 6.4 Wishlist Preview

```
┌────────────────────────────────────────────────────────────┐
│  Wishlist (12 items)                        [View All →]   │
│  [img] [img] [img] [img]  +8 more                          │
└────────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Thumbnails | `56×56px`, `radius.sm`, `object-fit: cover` |
| Hover | Product name tooltip |
| Click | Opens product edit page in new tab |

### 6.5 Behavioural Insights

```
┌────────────────────────────────────────────────────────────┐
│  Insights                                                    │
├────────────────────────────────────────────────────────────┤
│  Favourite category:    Indoor Plants (8 of 12 orders)      │
│  Avg days between orders: 24 days                            │
│  Preferred payment:      Visa (10 of 12)                     │
│  Device used most:       Mobile (75%)                        │
│  Discount code usage:    5 of 12 orders (HERO10, WELCOME15)  │
│  Pet owner:               Yes (per AI Care queries)           │
└────────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Row label | `font.size.sm`, `cst.text-muted` |
| Row value | `font.size.sm`, weight 600, `cst.text` |
| Data source | Computed from order history + AI Care query analysis |

---

## 7. Tab — Orders

Full orders table scoped to this customer. Reuses the shared admin table component (`admin-orders-design.md §4.6`) filtered to `customer_id = [id]`.

```
┌────────────────────────────────────────────────────────────────────┐
│  Orders (12)                          [Sort: Newest ▾]  [Export]   │
├──────────┬────────────┬──────────┬────────┬─────────┬─────────────┤
│  ORDER   │  DATE      │  ITEMS   │  TOTAL │ PAYMENT │  STATUS     │
├──────────┼────────────┼──────────┼────────┼─────────┼─────────────┤
│ #ORD-4821│ 15 Jun 2026│ 3 items  │ ₹1,248 │  Paid   │  Delivered  │
│ #ORD-4312│ 20 May 2026│ 1 item   │  ₹399  │  Paid   │  Delivered  │
│ ...      │            │          │        │         │             │
└──────────┴────────────┴──────────┴────────┴─────────┴─────────────┘
```

| Property | Value |
|---|---|
| Columns | Order # · Date · Items · Total · Payment · Status · `[View]` |
| Row click | Opens `/admin/orders/[id]` |
| Same badge styles | Reuses `ord.*` status/payment badges from Orders module |
| Empty state | `"No orders from this customer yet"` |

---

## 8. Tab — Reviews

```
┌────────────────────────────────────────────────────────────────────┐
│  Reviews (8)                                                        │
├────────────────────────────────────────────────────────────────────┤
│  [img] Monstera Deliciosa          ★★★★★  5/5                      │
│        "Absolutely beautiful plant! Arrived in perfect condition." │
│        15 Jun 2026 · [ Published ]              [View] [Moderate]  │
│  ──────────────────────────────────────────────────────────────    │
│  [img] Peace Lily                  ★★★★☆  4/5                      │
│        "Good plant, smaller than expected."                        │
│        20 May 2026 · [ Published ]              [View] [Moderate]  │
└────────────────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Stars | `cst.star-fill` filled, `cst.border` empty, `14×14px` |
| Status badge | Published / Pending / Rejected (reuses Reviews module badge styles) |
| `[Moderate]` | Links to Reviews module detail drawer |
| Empty state | `"This customer hasn't left any reviews yet."` |

---

## 9. Tab — AI Care Queries

```
┌────────────────────────────────────────────────────────────────────┐
│  AI Care Activity (34 queries)                                      │
├────────────────────────────────────────────────────────────────────┤
│  15 Jun, 2:30 PM   "Why are my Monstera leaves yellow?"             │
│                     📷 Photo attached  · 👍 Helpful                 │
│  ──────────────────────────────────────────────────────────────    │
│  12 Jun, 9:15 AM    "Best plants for low light?"                    │
│                     No photo  · Converted to cart  ✓                │
└────────────────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Query text | `font.size.sm`, `cst.text` |
| Timestamp | `font.size.xs`, `cst.text-muted` |
| Photo indicator | 📷 icon if attached |
| Rating | 👍 / 👎 / — |
| Converted badge | `✓ Converted to cart` in `cst.active` colour |
| Click row | Expands full conversation thread |
| Empty state | `"This customer hasn't used AI Care yet."` |

---

## 10. Tab — Garden Bookings

```
┌────────────────────────────────────────────────────────────────────┐
│  Garden Service Bookings (3)                                        │
├──────────────┬─────────────────────┬────────────┬──────────────────┤
│  BOOKING ID  │  SERVICE            │  DATE      │  STATUS          │
├──────────────┼─────────────────────┼────────────┼──────────────────┤
│  #GS-0821    │  Balcony Garden     │  20 Jun    │  Confirmed       │
│  #GS-0654    │  Lawn Maintenance   │  15 Mar    │  Completed       │
└──────────────┴─────────────────────┴────────────┴──────────────────┘
```

| Property | Value |
|---|---|
| Row click | Opens `/admin/garden-services/[id]` |
| Status badges | Reuses Garden Services module styles |
| Empty state | `"No garden service bookings yet."` |

---

## 11. Tab — Activity Log

```
┌────────────────────────────────────────────────────────────────────┐
│  Activity Log                                  [View Full Log ↗]  │
├────────────────────────────────────────────────────────────────────┤
│  Today 10:24 AM   Priya K.    Order #ORD-4821 placed               │
│  15 Jun 2:11 PM   Suresh K.   Added tag "VIP"                      │
│  12 Jan 2025      System      Account created                      │
└────────────────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Includes | Account changes, admin edits, point adjustments, tag changes, login events |
| `role` | `role="log"`, `aria-label="Customer activity log"` |
| `[View Full Log ↗]` | `/admin/activity-log?customer=[id]` |


---

## 12. RIGHT COLUMN PANELS

### 12.1 Profile Card

```
┌────────────────────────────────────────────┐
│       [Avatar 80px]                        │
│       Priya Kumar                          │
│       priya@email.com                      │
│       📞 +91 98765 43210                   │
│       📍 Pune, Maharashtra                 │
│                                            │
│       [ Edit Profile ]                     │
└────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Avatar | `80×80px`, `radius.full`, photo or initials, `cst.accent-bg` |
| Name | `font.size.4xl` (18px), weight 700, `cst.text`, centred |
| Email/phone/city | `font.size.sm`, `cst.text-muted`, centred |
| `[Edit Profile]` | Secondary outlined, full-width |

**Edit Profile modal:** Name, email, phone, DOB, gender — same field spec as storefront `profile-design.md §12.2`.

### 12.2 Loyalty Card

```
┌────────────────────────────────────────────┐
│  🏅 Loyalty                                │
├────────────────────────────────────────────┤
│   240 pts          🌿 Plant Lover          │
│   ██████░░░░░░░░░░  48% to Silver          │
│                                            │
│   [ Adjust Points ]   [ Change Tier ]      │
└────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Points value | `font.size.4xl` (18px), weight 800, `cst.accent` |
| Tier badge | Icon + name, tier colour |
| Progress bar | `8px` height, `radius.full`, `cst.accent` fill |
| `aria-label` | `"[n] of [max] points to [next tier]"` |
| `[Adjust Points]` | Opens modal (§12.2.1) |
| `[Change Tier]` | Opens modal — manual tier override with reason |

**§12.2.1 Adjust Points modal:**

```
┌────────────────────────────────────────┐
│  Adjust Points for Priya Kumar  [×]   │
│  Current balance: 240 pts             │
│                                        │
│  Action:  ( ● ) Add  ( ○ ) Deduct    │
│  Points:  [ 50                    ]   │
│  Reason:  [ Goodwill gesture      ]   │
│                                        │
│  New balance: 290 pts                 │
│                                        │
│  [ Cancel ]      [ Apply Adjustment ] │
└────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| New balance | `aria-live="polite"` — updates live as points entered |
| Reason | Required field |
| `[Apply Adjustment]` | Primary `cst.accent`; logs to activity log |
| Validation | Deduct cannot exceed current balance |

### 12.3 Contact Card

```
┌────────────────────────────────────────────┐
│  Contact                                   │
├────────────────────────────────────────────┤
│  Email      priya@email.com    ✓ Verified │
│  Phone      +91 98765 43210    ✓ Verified │
│  Language   English                       │
│  Marketing  [ ☑ ] Opted in to emails      │
│             [ ☑ ] Opted in to SMS         │
└────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Verified badge | `cst.active` colour + `✓` |
| Unverified | `cst.at-risk` colour + `⚠` + `[Resend Verification]` link |
| Marketing toggles | Read view shows checkbox state; editable in Edit Profile modal |

### 12.4 Addresses Card

```
┌────────────────────────────────────────────┐
│  Addresses (2)                [+ Add]      │
├────────────────────────────────────────────┤
│  🏠 Home (Default)                         │
│  42 Green Park Society, Baner              │
│  Pune — 411045, Maharashtra                │
│  [Edit] [Delete]                           │
│  ──────────────────────────────────────    │
│  🏢 Work                                   │
│  WeWork BKC, Mumbai — 400051                │
│  [Edit] [Delete] [Set Default]             │
└────────────────────────────────────────────┘
```

Same field/edit pattern as `profile-design.md §14`. Admin can add/edit/delete on the customer's behalf.

### 12.5 Account Status Card

```
┌────────────────────────────────────────────┐
│  Account Status                            │
├────────────────────────────────────────────┤
│  Status:        [ Active ● ]               │
│  Member since:  12 Jan 2025                │
│  Last login:    2 hours ago                │
│  Last order:    15 Jun 2026                │
│  Account type:  Customer                    │
│                                            │
│  [ Block Account ]   [ Delete Account ]    │
└────────────────────────────────────────────┘
```

**Status dropdown options:** Active · Blocked · Unverified

| Property | Value |
|---|---|
| `[Block Account]` | Ghost, `cst.danger`; opens confirm modal with reason field |
| `[Delete Account]` | Ghost, `cst.danger`; opens type-to-confirm modal (same pattern as `admin-product-page-design.md §12`) |
| Block confirm | `"Block [name]'s account? They won't be able to sign in or place orders."` + reason textarea |
| Delete confirm | Type customer name to confirm; checks for active orders first |

### 12.6 Tags Card

```
┌────────────────────────────────────────────┐
│  Tags                                      │
├────────────────────────────────────────────┤
│  [VIP] [Corporate] [+ Add tag]             │
└────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Chip style | `cst.card-hover` bg, `cst.border`, `radius.full`, `font.size.xs` |
| `[+ Add tag]` | Inline input on click; suggests existing tags |
| Remove | `×` per chip |

### 12.7 Admin Notes Card

```
┌────────────────────────────────────────────┐
│  Admin Notes                  [+ Add Note] │
├────────────────────────────────────────────┤
│  [RK] Ravi K. · 10 Jun 2026                │
│  Customer called about delayed delivery.   │
│  Resolved with 10% discount code.          │
│                          [Edit] [Delete]   │
└────────────────────────────────────────────┘
```

Same pattern as `admin-orders-design.md §5.6` — internal-only notes, edit/delete inline, author + timestamp.

---

## 13. Send Email Modal

Triggered from page header `[Send Email]` or table row action.

```
┌──────────────────────────────────────────────────────┐
│  Send Email to Priya Kumar                    [×]   │
├──────────────────────────────────────────────────────┤
│  TEMPLATE                                            │
│  [ Custom Message                          ▾ ]       │
│                                                      │
│  SUBJECT                                             │
│  [ A note from Hero Plants 🌿                  ]    │
│                                                      │
│  MESSAGE                                             │
│  [ Rich text editor, 300px min height           ]   │
│                                                      │
│  [ Preview ]              [ Send Email ]            │
└──────────────────────────────────────────────────────┘
```

**Templates:** Custom Message · Win-Back Offer · VIP Thank You · Re-engagement · Birthday Greeting · Order Follow-Up

---

## 14. Create / Edit Customer Page

**URL:** `/admin/customers/new`

```
← Customers    Add New Customer

┌────────────────────────────────────┬────────────────────────────────┐
│  PERSONAL INFO                     │  ADDRESS (optional)            │
│  First Name * [           ]        │  [Full address form]           │
│  Last Name *  [           ]        │                                │
│  Email *      [           ]        │  ACCOUNT OPTIONS                │
│  Phone        [           ]        │  [ ☐ ] Send welcome email      │
│  DOB          [DD/MM/YYYY ]        │  [ ☐ ] Send password setup link│
│                                    │  Initial tier: [ Plant Lover ▾]│
│  TAGS                              │  Initial points: [ 0          ]│
│  [+ Add tag]                       │                                │
│                                    │  [ Cancel ]   [ Create Customer]│
└────────────────────────────────────┴────────────────────────────────┘
```

| Validation | Rule |
|---|---|
| Email | Required, valid format, unique |
| First/Last name | Required |
| Phone | Optional, 10-digit Indian format if provided |
| Duplicate email | Inline error: `"A customer with this email already exists. [View Customer]"` |

---

## 15. Merge Customers Flow

For duplicate accounts (e.g. customer used 2 different emails).

```
┌──────────────────────────────────────────────────────────┐
│  Merge Customers                                  [×]   │
├──────────────────────────────────────────────────────────┤
│  Primary (keeps this ID):                                │
│  Priya Kumar — priya@email.com — #CST-00821              │
│                                                          │
│  Merge with:                                              │
│  [ Search customer to merge...                    ]     │
│  Priya K. — priya.kumar@gmail.com — #CST-01532           │
│                                                          │
│  This will combine:                                       │
│  ✓ Order history (12 + 3 = 15 orders)                    │
│  ✓ Loyalty points (240 + 80 = 320 pts)                    │
│  ✓ Addresses, tags, and notes                             │
│  ✗ The secondary account (#CST-01532) will be deleted    │
│                                                          │
│  [ Cancel ]              [ Merge Customers ]              │
└──────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Search | Finds candidate duplicate by name/email/phone |
| Preview | Shows combined totals before confirming |
| `[Merge Customers]` | `cst.danger`-adjacent caution colour; requires confirmation |
| Logged | Full merge logged in activity log on both records (secondary record flagged as merged, not hard-deleted, for audit) |

---

## 16. Bulk Actions — Full Specification

### 16.1 Send Email (Bulk)

Opens same modal as §13, sends to all selected customers. Preview shows recipient count: `"This will be sent to 24 customers."`

### 16.2 Add Tag (Bulk)

```
┌──────────────────────────────────────────┐
│  Add Tag — 24 Customers           [×]   │
│  [ VIP                              ]    │
│  [ Cancel ]      [ Add Tag to 24 ]      │
└──────────────────────────────────────────┘
```

### 16.3 Change Tier (Bulk)

```
┌──────────────────────────────────────────┐
│  Change Tier — 24 Customers       [×]   │
│  New tier: [ Gold ▾ ]                   │
│  Reason:   [ Holiday promotion       ]  │
│  [ Cancel ]   [ Update 24 Customers ]   │
└──────────────────────────────────────────┘
```

### 16.4 Block (Bulk)

```
┌──────────────────────────────────────────┐
│  ⚠️ Block 24 Customers?           [×]   │
│  They won't be able to sign in or order. │
│  Reason: [                          ]   │
│  [ Cancel ]        [ Block 24 Accounts ] │
└──────────────────────────────────────────┘
```

`cst.danger` confirm button; requires Super Admin or Ops Manager role.


---

## 17. Customer Segmentation (Marketing)

**URL:** `/admin/customers/segments`

For Marketing role — saved dynamic segments based on filter criteria.

```
┌────────────────────────────────────────────────────────────────────┐
│  Segments                                      [+ Create Segment]  │
├────────────────────────────────────────────────────────────────────┤
│  VIP Customers                  284 customers      [Edit] [Email]  │
│  Tier = Gold AND LTV > ₹20,000                                     │
│  ────────────────────────────────────────────────────────────────  │
│  At-Risk (Win-Back)             1,204 customers    [Edit] [Email]  │
│  Last order > 90 days AND Total orders >= 2                        │
│  ────────────────────────────────────────────────────────────────  │
│  Pune Customers                 892 customers       [Edit] [Email] │
│  City = Pune                                                       │
└────────────────────────────────────────────────────────────────────┘
```

**Create Segment modal:**

```
┌──────────────────────────────────────────────────────────┐
│  Create Segment                                  [×]    │
│  Name: [ Plant Lovers — Mumbai            ]              │
│                                                          │
│  CONDITIONS (AND)                                         │
│  [ Tier        ▾ ] [ equals ▾ ] [ Plant Lover ▾ ]  [×]  │
│  [ City        ▾ ] [ equals ▾ ] [ Mumbai      ▾ ]  [×]  │
│  [ + Add condition ]                                      │
│                                                          │
│  Preview: 3,204 customers match                          │
│                                                          │
│  [ Cancel ]              [ Save Segment ]                │
└──────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Condition fields | Tier, Status, LTV, Order count, City, Tag, Source, Pet owner, AI Care user, Last order date, Date joined |
| Operators | equals, not equals, greater than, less than, contains, between |
| Preview count | Live, `aria-live="polite"` |
| Saved segment | Reusable in bulk email tool and analytics |

---

## 18. Accessibility Requirements

### 18.1 Focus Management

| Interaction | Focus behaviour |
|---|---|
| Customers list load | Focus → search field |
| Filter drawer open | Focus → first checkbox |
| Filter drawer close (Escape) | Focus → Filter button |
| Customer row click | Focus → customer detail `<h1>` |
| Tab switch | Focus → first focusable element in revealed tab panel |
| Edit Profile modal open | Focus → first input (First Name) |
| Adjust Points modal open | Focus → points input |
| Block confirm modal | Focus → "Keep Active" (safe action) |
| Delete confirm modal | Focus → confirmation text input |
| Merge modal | Focus → search field |
| Send Email modal | Focus → template select |
| Toast appears | Announced via `aria-live`; focus does not move |
| After block/delete success | Focus → customer list page heading (redirect) |

### 18.2 Full ARIA Map

| Component | ARIA |
|---|---|
| Breadcrumb | `<nav aria-label="Breadcrumb">`, `aria-current="page"` |
| Page heading | `<h1>` — `"Customers"` / `"[Customer name]"` |
| KPI row | `role="region"`, `aria-label="Customer metrics"` |
| KPI card | `aria-label="[label]: [value]. [delta]"` |
| Segment tabs | `role="tablist"`, `role="tab"`, `aria-selected` |
| Search input | `aria-label="Search customers"` |
| Filter drawer | `role="dialog"`, `aria-label="Customer filters"`, focus trap |
| Filter checkboxes | `role="checkbox"`, `aria-checked` |
| Active chips | `role="group"`, `aria-label="Active filters"` |
| Customers table | `role="grid"`, `aria-label="Customers"` |
| Column headers | `role="columnheader"`, `aria-sort` |
| Row checkbox | `aria-label="Select customer [name]"`, `aria-checked` |
| Select all | `aria-label="Select all customers"`, `aria-checked="mixed"` |
| Bulk bar | `aria-live="polite"` on count |
| Overflow menu | `aria-haspopup="menu"`; `role="menu"`, `role="menuitem"` |
| Pagination | `<nav aria-label="Pagination">`, `aria-current="page"` |
| Detail tabs | `role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls` |
| Tab panel | `role="tabpanel"`, `aria-labelledby` |
| Loyalty progress bar | `aria-label="[n] of [max] points to [tier]"` |
| Adjust Points new balance | `aria-live="polite"` on change |
| Tags add input | `aria-label="Add tag"` |
| Admin notes | `role="log"`, `aria-label="Admin notes"` |
| Activity log | `role="log"`, `aria-label="Customer activity log"` |
| Block confirm | `role="alertdialog"`, `aria-modal`, focus on safe action |
| Delete confirm | `role="alertdialog"`, confirmation input `aria-label` |
| Merge modal | `role="dialog"`, `aria-modal`, focus trap |
| Segment preview count | `aria-live="polite"` |
| Status badge | `aria-label="Status: [status]"` |
| Tier badge | `aria-label="Tier: [tier]"` |
| Verified badge | `aria-label="Email verified"` / `"Email not verified"` |

### 18.3 Keyboard Navigation Map

| Key | Behaviour |
|---|---|
| `Tab` | Forward through interactive elements |
| `Shift+Tab` | Backward |
| `Enter` | Activate button/link; open customer row |
| `Space` | Toggle checkbox |
| `Arrow Up/Down` | Navigate dropdown menus, table rows |
| `Arrow Left/Right` | Navigate segment tabs, detail tabs |
| `Escape` | Close drawer/modal/dropdown |
| `Ctrl+A` | Select all visible rows |
| `1–6` (tab focused) | Quick-jump to detail tab N |

### 18.4 Testable Acceptance Criteria

| # | Criterion | Method | Pass |
|---|---|---|---|
| A1 | No contrast failures | axe DevTools | Zero critical |
| A2 | All focus rings visible (`2px solid #00b566` + glow) | Manual Tab | Every element |
| A3 | Segment tab keyboard-navigable | Arrow keys | `aria-selected` updates |
| A4 | Table sort by keyboard | Enter on `<th>` | `aria-sort` updates |
| A5 | Detail tabs keyboard-navigable | Arrow keys | Panel switches, `aria-controls` correct |
| A6 | Filter drawer focus-trapped | Keyboard | Tab cycles inside only |
| A7 | Points adjustment balance announced | Screen reader | `aria-live="polite"` fires |
| A8 | Block/Delete confirm safe-action-first | Keyboard | Focus on safe action by default |
| A9 | Bulk count announced | Screen reader | `aria-live="polite"` fires |
| A10 | Verified badge readable without colour | Screen reader | Text label present |
| A11 | Segment preview count announced | Screen reader | `aria-live="polite"` fires |
| A12 | `prefers-reduced-motion` respected | OS setting | Animations disabled |

---

## 19. Content & Tone Standards

### 19.1 Status Labels

| Internal | Display | Never use |
|---|---|---|
| `active` | `Active` | "OK", "Good" |
| `new` | `New` | "Fresh" |
| `at_risk` | `At-Risk` | "Inactive", "Lost" |
| `blocked` | `Blocked` | "Banned", "Suspended" |
| `unverified` | `Unverified` | "Pending" |

### 19.2 Tier Names

| Tier | Display | Icon |
|---|---|---|
| `plant_lover` | `Plant Lover` | 🌿 |
| `silver` | `Silver` | 🥈 |
| `gold` | `Gold` | 🥇 |

### 19.3 CTA Labels

| Action | Label | Never use |
|---|---|---|
| Edit customer info | `"Edit Profile"` | "Update", "Modify" |
| Adjust loyalty points | `"Apply Adjustment"` | "Submit", "Save" |
| Block account | `"Block Account"` | "Disable", "Suspend" |
| Delete account | `"Delete Customer"` | "Remove" |
| Send email | `"Send Email"` | "Notify", "Message" |
| Merge accounts | `"Merge Customers"` | "Combine", "Join" |
| Create segment | `"Save Segment"` | "Submit", "Create" |

### 19.4 Error Messages

| Error | Message |
|---|---|
| Duplicate email on create | `"A customer with this email already exists. [View Customer]"` |
| Deduct exceeds balance | `"Cannot deduct more points than the customer's current balance."` |
| Delete with active orders | `"This customer has 2 active orders. Complete or cancel them before deleting."` |
| Merge same account | `"You can't merge a customer with themselves. Select a different account."` |
| Invalid phone format | `"Enter a valid 10-digit mobile number."` |

### 19.5 Confirmation Dialog Templates

| Action | Heading | Body | Safe action | Destructive |
|---|---|---|---|---|
| Block account | `"Block [name]'s account?"` | `"They won't be able to sign in or place orders."` | `"Keep Active"` | `"Block Account"` |
| Delete account | `"Delete [name]?"` | `"This cannot be undone. Order history is preserved for records."` | `"Cancel"` | `"Delete Customer"` |
| Bulk block | `"Block [n] customers?"` | `"They won't be able to sign in or place orders."` | `"Cancel"` | `"Block [n] Accounts"` |
| Merge | `"Merge these two accounts?"` | `"[Secondary] will be merged into [Primary] and marked as merged."` | `"Cancel"` | `"Merge Customers"` |

---

## 20. Anti-Patterns & Prohibited Implementations

| Anti-pattern | Why prohibited | Correct approach |
|---|---|---|
| Raw hex values in CSS | Breaks admin token system | Use `admin.*` / `cst.*` tokens only |
| `outline: none` on any element | WCAG 2.4.11 failure | `outline: 2px solid cst.focus-ring` always |
| Deleting customer without checking active orders | Breaks order integrity | Block deletion if active orders exist |
| Hard-deleting merged duplicate account | Loses audit trail | Mark as "merged", retain record |
| Showing full customer PII in table to all roles | Privacy violation | Role-based column visibility |
| Points deduction without balance check | Negative balance bug | Validate deduct ≤ current balance |
| Blocking account without reason field | No audit trail for support disputes | Always require reason text |
| Bulk email without recipient count preview | Risk of accidental mass-send | Always show `"Sent to [n] customers"` confirmation |
| Verified badge shown as colour dot only | WCAG 1.4.1 failure | Always include text label |
| Segment builder without live preview count | User can't validate logic before saving | Live `aria-live` count required |
| Tier badge with colour-only meaning | Inaccessible | Icon + text label always |
| Customer search without debounce | Excessive API calls | `250ms` debounce mandatory |
| Rendering 500+ customer rows without virtual scroll | Browser lock-up | Virtual scroll beyond 100 rows |

---

## 21. Edge-Case Handling

| Scenario | Behaviour |
|---|---|
| Customer with 0 orders | Overview tab shows "No orders yet"; LTV shows ₹0 |
| Customer with duplicate phone, different email | Flag in detail page: `"⚠ This phone number is also used by [other customer]"` |
| Points adjustment makes balance negative | Blocked client-side; error shown |
| Customer deleted but has order history | Orders remain in system with `"Guest (deleted account)"` label |
| Merge candidates have conflicting addresses | Show both; admin selects which to keep as default |
| Customer blocks self via app, admin views detail | Status reflects "Blocked" with reason if logged |
| Very long customer name (>40 chars) | Truncate with ellipsis; full name in `title` tooltip |
| Customer with 100+ orders | Orders tab paginates 25/page |
| Segment with 0 matches | `"No customers match this segment yet."` shown in preview |
| Bulk action partially fails (e.g. 2 of 24 emails bounce) | Toast: `"22 of 24 emails sent successfully. 2 failed — [View Details]"` |
| Customer changes email mid-session (another admin editing) | Conflict detection via `updated_at`; same pattern as Orders module |

---

## 22. Performance Requirements

| Metric | Target | Rule |
|---|---|---|
| Customers list load | `< 1.5s` | First 25 rows SSR; virtualised beyond |
| Customer detail load | `< 1s` | SSR profile + overview tab; other tabs lazy |
| Tab switch | `< 200ms` | Client-side; lazy-load tab data on first visit |
| Search response | `< 300ms` | Debounced 250ms; server search |
| Segment preview count | `< 500ms` | Debounced query against indexed fields |
| Bulk email (24 recipients) | `< 3s` | Queued; progress shown |
| Bulk email (1000+ recipients) | Background job | Email summary when complete |

---

## 23. Analytics & Tracking Events

| Event | Trigger | Properties |
|---|---|---|
| `customers_list_view` | Page load | `admin_id`, `segment`, `page` |
| `customer_detail_view` | Detail load | `admin_id`, `customer_id` |
| `customer_tab_switch` | Tab clicked | `admin_id`, `customer_id`, `tab` |
| `customers_search` | Search | `admin_id`, `query`, `result_count` |
| `customers_filter_apply` | Filter | `admin_id`, `filters[]` |
| `customer_create` | New customer saved | `admin_id`, `customer_id` |
| `customer_edit` | Profile saved | `admin_id`, `customer_id`, `fields_changed[]` |
| `customer_points_adjust` | Points modal save | `admin_id`, `customer_id`, `adjustment`, `reason` |
| `customer_tier_change` | Tier changed | `admin_id`, `customer_id`, `old_tier`, `new_tier` |
| `customer_block` | Block confirmed | `admin_id`, `customer_id`, `reason` |
| `customer_delete` | Delete confirmed | `admin_id`, `customer_id` |
| `customer_merge` | Merge confirmed | `admin_id`, `primary_id`, `secondary_id` |
| `customer_email_send` | Email sent | `admin_id`, `customer_id`, `template` |
| `customer_tag_add` | Tag added | `admin_id`, `customer_id`, `tag` |
| `customers_bulk_action` | Bulk submit | `admin_id`, `action`, `count` |
| `segment_create` | Segment saved | `admin_id`, `segment_name`, `condition_count` |
| `segment_email_send` | Segment email | `admin_id`, `segment_id`, `recipient_count` |


---

## 24. Shopify Admin API Integration

### 24.1 Customer Data Field Mapping

| Admin UI field | Shopify API field | Notes |
|---|---|---|
| Name | `customer.first_name + last_name` | |
| Email | `customer.email` | |
| Phone | `customer.phone` | |
| Customer ID | `customer.id` | Display as `#CST-[id]` |
| Total orders | `customer.orders_count` | |
| LTV | `customer.total_spent` | |
| Addresses | `customer.addresses[]` | |
| Default address | `customer.default_address` | |
| Tags | `customer.tags` | Comma-separated |
| Marketing opt-in (email) | `customer.email_marketing_consent.state` | |
| Marketing opt-in (SMS) | `customer.sms_marketing_consent.state` | |
| Verified email | `customer.verified_email` | |
| State (account status) | `customer.state` | `enabled / disabled / invited / declined` |
| Created at | `customer.created_at` | |
| Updated at | `customer.updated_at` | Conflict detection |
| Note | `customer.note` | Internal note field |
| Loyalty points | `customer.metafields[namespace=profile][key=loyalty_points]` | |
| Loyalty tier | `customer.metafields[namespace=profile][key=loyalty_tier]` | |
| Avatar URL | `customer.metafields[namespace=profile][key=avatar_url]` | |
| Wishlist items | `customer.metafields[namespace=wishlist][key=items]` | JSON array |
| My Plants data | `customer.metafields[namespace=plants][key=my_plants]` | JSON array |

### 24.2 Key API Endpoints

| Action | Endpoint | Method |
|---|---|---|
| List customers | `GET /admin/api/2024-10/customers.json` | Read |
| Search customers | `GET /admin/api/2024-10/customers/search.json?query=` | Read |
| Customer detail | `GET /admin/api/2024-10/customers/{id}.json` | Read |
| Create customer | `POST /admin/api/2024-10/customers.json` | Write |
| Update customer | `PUT /admin/api/2024-10/customers/{id}.json` | Write |
| Delete customer | `DELETE /admin/api/2024-10/customers/{id}.json` | Write |
| Customer orders | `GET /admin/api/2024-10/customers/{id}/orders.json` | Read |
| Customer addresses | `GET /admin/api/2024-10/customers/{id}/addresses.json` | Read |
| Add address | `POST /admin/api/2024-10/customers/{id}/addresses.json` | Write |
| Send invite | `POST /admin/api/2024-10/customers/{id}/send_invite.json` | Write |
| Customer count | `GET /admin/api/2024-10/customers/count.json` | Read |

### 24.3 Block Account Implementation

Shopify customer `state` field supports `disabled`. Block action:
```
PUT /admin/api/2024-10/customers/{id}.json
{ "customer": { "state": "disabled" } }
```
Reason stored in `customer.note` or a dedicated metafield `account.block_reason`.

### 24.4 Merge Implementation

Shopify has no native merge endpoint. Implementation: custom server-side process that:
1. Reassigns all orders from secondary → primary via order `customer_id` update (requires order edit permissions, or done via internal database mapping if orders aren't directly reassignable)
2. Sums loyalty points and updates primary's metafield
3. Copies unique addresses, tags, and notes to primary
4. Sets secondary customer `tags` to include `"merged-into-{primary_id}"` and `state: disabled`
5. Logs merge action in activity log on both records

### 24.5 Webhook Subscriptions

| Topic | Consumer |
|---|---|
| `customers/create` | New customer KPI update |
| `customers/update` | Detail page real-time refresh |
| `customers/delete` | List removal |

---

## 25. Internationalisation (i18n)

```json
{
  "cst.page.title": "Customers",
  "cst.page.subtitle": "{{count}} total customers",
  "cst.page.new": "+ Add Customer",

  "cst.segment.all": "All ({{count}})",
  "cst.segment.vip": "VIP ({{count}})",
  "cst.segment.gold": "Gold ({{count}})",
  "cst.segment.silver": "Silver ({{count}})",
  "cst.segment.plant_lover": "Plant Lover ({{count}})",
  "cst.segment.new": "New ({{count}})",
  "cst.segment.at_risk": "At-Risk ({{count}})",
  "cst.segment.blocked": "Blocked ({{count}})",

  "cst.status.active": "Active",
  "cst.status.new": "New",
  "cst.status.at_risk": "At-Risk",
  "cst.status.blocked": "Blocked",
  "cst.status.unverified": "Unverified",

  "cst.tier.plant_lover": "Plant Lover",
  "cst.tier.silver": "Silver",
  "cst.tier.gold": "Gold",

  "cst.tabs.overview": "Overview",
  "cst.tabs.orders": "Orders ({{count}})",
  "cst.tabs.reviews": "Reviews ({{count}})",
  "cst.tabs.ai_care": "AI Care ({{count}})",
  "cst.tabs.garden": "Garden Bookings ({{count}})",
  "cst.tabs.activity": "Activity Log",

  "cst.action.edit_profile": "Edit Profile",
  "cst.action.adjust_points": "Adjust Points",
  "cst.action.change_tier": "Change Tier",
  "cst.action.block": "Block Account",
  "cst.action.delete": "Delete Customer",
  "cst.action.merge": "Merge Customers",
  "cst.action.send_email": "Send Email",
  "cst.action.send_sms": "Send SMS",
  "cst.action.add_tag": "+ Add tag",
  "cst.action.add_note": "+ Add Note",

  "cst.confirm.block.heading": "Block {{name}}'s account?",
  "cst.confirm.block.body": "They won't be able to sign in or place orders.",
  "cst.confirm.block.safe": "Keep Active",
  "cst.confirm.block.action": "Block Account",

  "cst.confirm.delete.heading": "Delete {{name}}?",
  "cst.confirm.delete.body": "This cannot be undone. Order history is preserved for records.",

  "cst.error.duplicate_email": "A customer with this email already exists.",
  "cst.error.points_exceed": "Cannot deduct more points than the current balance.",
  "cst.error.delete_active_orders": "This customer has {{count}} active orders. Resolve them before deleting.",

  "cst.empty.no_customers": "No customers yet",
  "cst.empty.no_customers_body": "Customers appear once they register or make their first purchase.",
  "cst.empty.no_results": "No customers found",
  "cst.empty.no_results_body": "Try adjusting your filters or search terms.",
  "cst.empty.no_orders": "No orders from this customer yet",
  "cst.empty.no_reviews": "This customer hasn't left any reviews yet.",
  "cst.empty.no_ai_care": "This customer hasn't used AI Care yet.",
  "cst.empty.no_bookings": "No garden service bookings yet.",

  "cst.toast.profile_saved": "Profile updated successfully.",
  "cst.toast.points_adjusted": "Points balance updated to {{balance}}.",
  "cst.toast.blocked": "{{name}}'s account has been blocked.",
  "cst.toast.deleted": "{{name}} was deleted.",
  "cst.toast.merged": "Accounts merged successfully.",
  "cst.toast.email_sent": "Email sent to {{name}}.",
  "cst.toast.bulk_email_sent": "Sent to {{count}} customers.",

  "cst.kpi.total": "Total Customers",
  "cst.kpi.new_month": "New This Month",
  "cst.kpi.active_30d": "Active (30d)",
  "cst.kpi.avg_ltv": "Avg LTV",
  "cst.kpi.vip": "VIP Customers",
  "cst.kpi.at_risk": "At-Risk (90d no order)"
}
```

---

## 26. Component State Master Table

| Component | Default | Hover | Focus-visible | Active | Disabled | Loading | Error | Success |
|---|---|---|---|---|---|---|---|---|
| Segment tab (default) | `cst.border`, transparent | `cst.card-hover` | `2px` ring | — | — | — | — | — |
| Segment tab (active) | `cst.accent` bg, white | Darken 5% | `2px` ring | — | — | — | — | — |
| Detail tab (default) | Transparent, `cst.text-muted` | `cst.text` | `2px` ring | — | — | — | — | — |
| Detail tab (active) | `cst.accent` bottom border, `cst.text` | — | `2px` ring | — | — | — | — | — |
| Table row | `cst.card-bg` | `cst.card-hover` | `2px` ring | — | — | — | — | — |
| Table row (selected) | `cst.accent-bg`, green left bar | Deeper | `2px` ring | — | — | — | — | — |
| Row checkbox | `cst.border`, white | `cst.border-active` | `cst.focus-glow` | — | — | — | — | `cst.accent` fill |
| KPI card | `cst.card-bg` | `cst.card-hover` | `2px` ring (if linked) | — | — | Skeleton | — | — |
| Primary button | `cst.accent` | Darken 10% | `2px` ring + glow | Scale `0.98` | `opacity: 0.4` | Spinner | — | — |
| Secondary button | Transparent, `cst.border` | `cst.card-hover` | `2px` ring | Scale `0.98` | `opacity: 0.4` | Spinner | — | — |
| Danger button | `cst.danger` | Darken 10% | `2px` ring | Scale `0.98` | `opacity: 0.4` | Spinner | — | — |
| Input field | `cst.input-bg`, `cst.border` | `cst.border-active` @ 60% | `cst.border-active` + glow | — | Muted | — | Red border | Green border |
| Loyalty progress bar | `cst.accent` fill | — | — | — | — | — | — | — |
| "Adjust Points" CTA | `cst.accent` | Darken | `2px` ring | Scale `0.98` | 0 amount | Spinner | Error toast | Toast + balance updates |
| Tag chip | `cst.card-hover` bg | — | — | — | — | — | — | — |
| Tag remove `×` | `cst.text-muted` | `cst.danger` | `2px` ring | — | — | — | — | — |
| "Block Account" | Ghost, `cst.danger` | `cst.blocked-bg` tint | `2px` ring | Scale `0.98` | — | Spinner | Error toast | Status → Blocked |
| "Delete Customer" | Ghost, `cst.danger` | `cst.blocked-bg` tint | `2px` ring | — | Has active orders | Spinner | Error inline | Redirect + toast |
| Merge search input | `cst.input-bg`, `cst.border` | `cst.border-active` | `cst.focus-glow` | — | — | Spinner | No results | Result selected |
| Segment condition row | `cst.card-bg`, `cst.border` | — | — | — | — | — | — | — |
| Segment preview count | `cst.text`, `aria-live` | — | — | — | — | Loading dots | — | Count updates |
| Overflow menu trigger | `cst.text-muted` | `cst.card-hover` | `2px` ring | — | — | — | — | — |
| Overflow menu item (danger) | Transparent | `cst.blocked-bg` | `2px` ring | — | — | — | — | — |
| Toast | Slide in, coloured border | — | — | — | — | — | — | Auto-dismiss 3–4s |

---

## 27. Final Summary — Complete Section Map

```
Admin Customers Module — v1.0
Complete Design Specification
═══════════════════════════════════════════════════════════════════════
CORE SPEC (§1–§17)

§1   Context & Goals
§2   Design Tokens (17 inherited, 25 cst.* aliases, typography × 20,
     spacing/radius/motion)

CUSTOMERS LIST (§3–§4)
§3   Page Layout (list + detail shell diagrams)
§4   Customers List Page
     §4.1  Page Header
     §4.2  KPI Cards Row (6 cards)
     §4.3  Segment Filter Tabs (8 segments)
     §4.4  Table Toolbar (search, filter, sort, bulk bar)
     §4.5  Filter Drawer (12 sections)
     §4.6  Customers Data Table (11 columns, badges, overflow menu)
     §4.7  Pagination
     §4.8  Empty States

CUSTOMER DETAIL (§5–§11)
§5   Breadcrumb & Header + Detail Tabs (6 tabs)
§6   Tab — Overview (stats, order chart, recent orders, wishlist, insights)
§7   Tab — Orders (scoped table, reuses Orders module)
§8   Tab — Reviews (star display, moderation links)
§9   Tab — AI Care Queries (conversation history, conversion tracking)
§10  Tab — Garden Bookings (scoped table)
§11  Tab — Activity Log

RIGHT COLUMN (§12)
§12.1 Profile Card + Edit modal
§12.2 Loyalty Card + Adjust Points modal
§12.3 Contact Card (verified badges, marketing opt-ins)
§12.4 Addresses Card
§12.5 Account Status Card (Block/Delete)
§12.6 Tags Card
§12.7 Admin Notes Card

MODALS & FLOWS (§13–§17)
§13  Send Email Modal (6 templates)
§14  Create / Edit Customer Page
§15  Merge Customers Flow
§16  Bulk Actions (Email, Tag, Tier, Block)
§17  Customer Segmentation (Marketing — condition builder, live preview)

EXTENDED IMPLEMENTATION GUIDE (§18–§27)

§18  Accessibility Requirements
     • Focus management (12 scenarios)
     • Full ARIA map (26 components)
     • Keyboard map (9 keys)
     • 12 testable acceptance criteria

§19  Content & Tone Standards
     • Status labels (5) · Tier names (3) · CTA labels (7)
     • Error messages (5) · Confirmation templates (4)

§20  Anti-Patterns (× 13 prohibited implementations)

§21  Edge-Case Handling (× 11 scenarios)

§22  Performance Requirements (7 metrics)

§23  Analytics & Tracking Events (× 17 events)

§24  Shopify Admin API Integration
     • 19-field data mapping
     • 11 API endpoints
     • Block implementation
     • Merge implementation (5-step process)
     • 3 webhook subscriptions

§25  Internationalisation (65 i18n keys)

§26  Component State Master Table (× 23 components × 8 states)

§27  Final Summary — Section Map (this section)

═══════════════════════════════════════════════════════════════════════
Total: ~1,900 lines | 27 sections
WCAG 2.2 AA | Admin dark token system (Outfit)

Companion documents:
  admin-dashboard-design.md     ← Admin system tokens & shared components
  admin-orders-design.md        ← Orders module (linked from customer card)
  admin-product-page-design.md  ← Product edit (linked from wishlist)
  profile-design.md             ← Storefront customer profile (counterpart)
  design-system.md              ← Master storefront design system

Last updated: June 2026
═══════════════════════════════════════════════════════════════════════
```

---

*Document version: 1.0 (complete) — Admin Customers Module*
*Sections: 1–17 (core spec) + 18–27 (extended implementation guide)*
*Guideline standard: WCAG 2.2 AA | Token system: Admin dark (Outfit)*
*Companion: `admin-dashboard-design.md` · `admin-orders-design.md` · `profile-design.md`*
*Last updated: June 2026*
