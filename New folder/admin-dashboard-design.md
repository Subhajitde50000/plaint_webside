# Hero Plant Store — Admin Dashboard
## Design Specification v1.0 — Production-Ready

> **Design intent:** Deliver a high-density, data-rich operations dashboard that gives the Hero Plant Store admin team full visibility and control over orders, inventory, customers, products, analytics, garden services, and AI Care — using a dedicated dark-sidebar admin token system, WCAG 2.2 AA accessibility, and keyboard-first interaction patterns throughout every module.

---

## 1. Context & Goals

| Property | Value |
|---|---|
| **Product** | Hero Plant Store — Internal Admin Dashboard |
| **URL** | `/admin` (separate subdomain: `admin.heroplants.com` recommended) |
| **Access** | Internal staff only — role-based access control (RBAC) |
| **Primary goal** | Give ops/merchandising teams a single pane of glass for store management |
| **Secondary goals** | Reduce time-to-action on orders; surface inventory alerts; track revenue; manage garden services bookings; monitor AI Care usage |
| **User roles** | Super Admin · Operations Manager · Inventory Manager · Customer Support · Marketing · Garden Services Coordinator · Read-only Analyst |
| **Surface** | Internal web app — desktop-first (min `1280px`), tablet support, no mobile requirement |
| **Tech stack assumption** | React + Tailwind (or equivalent); REST/GraphQL API; Shopify Admin API integration |
| **Page density** | Links: ~300 · Buttons: ~200 · Tables: ~20 · Forms: ~30 · Charts: ~15 · Cards: ~80 |

---

## 2. Design Tokens & Foundations

### 2.1 Admin-Specific Token System

The admin dashboard uses a **separate dark-mode-first token system** from the storefront. It shares the brand green (`#00b566`) as the primary accent but uses a dark sidebar and neutral content area to signal the internal tool context clearly.

```
tokens/admin/
├── color.json
├── font.json
├── spacing.json
├── radius.json
├── shadow.json
└── motion.json
```

### 2.2 Color Tokens

| Token | Hex | Role |
|---|---|---|
| `admin.color.bg.canvas` | `#0f1117` | Outermost page background |
| `admin.color.bg.sidebar` | `#161b22` | Left sidebar background |
| `admin.color.bg.surface` | `#1c2128` | Primary content card bg |
| `admin.color.bg.elevated` | `#22272e` | Elevated card / hover bg |
| `admin.color.bg.overlay` | `#2d333b` | Modal bg, dropdown bg |
| `admin.color.bg.input` | `#22272e` | Input field background |
| `admin.color.text.primary` | `#cdd9e5` | Primary body text |
| `admin.color.text.secondary` | `#768390` | Secondary / muted text |
| `admin.color.text.tertiary` | `#adbac7` | Tertiary labels |
| `admin.color.text.placeholder` | `#545d68` | Input placeholder |
| `admin.color.text.inverse` | `#1c2128` | Text on light surfaces |
| `admin.color.text.white` | `#ffffff` | Pure white text |
| `admin.color.brand.green` | `#00b566` | Brand green — sidebar active, CTAs |
| `admin.color.brand.green.hover` | `#00a05a` | Brand green darkened 10% |
| `admin.color.brand.green.muted` | `#00b566` @ 15% | Green tinted bg |
| `admin.color.brand.green.subtle` | `#00b566` @ 8% | Very light green accent bg |
| `admin.color.border.default` | `#444c56` | Default borders, dividers |
| `admin.color.border.muted` | `#2d333b` | Subtle borders |
| `admin.color.border.active` | `#00b566` | Active / focused border |
| `admin.color.status.success` | `#57ab5a` | Success green |
| `admin.color.status.success.bg` | `#57ab5a` @ 12% | Success bg tint |
| `admin.color.status.warning` | `#c69026` | Warning amber |
| `admin.color.status.warning.bg` | `#c69026` @ 12% | Warning bg tint |
| `admin.color.status.error` | `#e5534b` | Error red |
| `admin.color.status.error.bg` | `#e5534b` @ 12% | Error bg tint |
| `admin.color.status.info` | `#539bf5` | Info blue |
| `admin.color.status.info.bg` | `#539bf5` @ 12% | Info bg tint |
| `admin.color.status.purple` | `#986ee2` | Purple — returned, special |
| `admin.color.status.purple.bg` | `#986ee2` @ 12% | Purple bg tint |
| `admin.color.status.orange` | `#cc6b2c` | Orange — delivery attempted |
| `admin.color.status.orange.bg` | `#cc6b2c` @ 12% | Orange bg tint |
| `admin.color.chart.1` | `#00b566` | Chart series 1 — brand green |
| `admin.color.chart.2` | `#539bf5` | Chart series 2 — blue |
| `admin.color.chart.3` | `#c69026` | Chart series 3 — amber |
| `admin.color.chart.4` | `#986ee2` | Chart series 4 — purple |
| `admin.color.chart.5` | `#e5534b` | Chart series 5 — red |
| `admin.color.chart.grid` | `#444c56` @ 40% | Chart grid lines |

**Semantic role aliases:**

| Alias | Maps to | Usage |
|---|---|---|
| `admin.page-bg` | `admin.color.bg.canvas` | Root page background |
| `admin.sidebar-bg` | `admin.color.bg.sidebar` | Left nav sidebar |
| `admin.card-bg` | `admin.color.bg.surface` | Content cards, tables |
| `admin.card-hover` | `admin.color.bg.elevated` | Card hover bg |
| `admin.input-bg` | `admin.color.bg.input` | All form inputs |
| `admin.overlay-bg` | `admin.color.bg.overlay` | Modals, dropdowns |
| `admin.text` | `admin.color.text.primary` | Default text |
| `admin.text-muted` | `admin.color.text.secondary` | Labels, meta, timestamps |
| `admin.text-label` | `admin.color.text.tertiary` | Table headers, form labels |
| `admin.accent` | `admin.color.brand.green` | Active items, CTAs, highlights |
| `admin.accent-hover` | `admin.color.brand.green.hover` | CTA hover |
| `admin.accent-muted` | `admin.color.brand.green.muted` | Active sidebar bg, selection bg |
| `admin.border` | `admin.color.border.default` | All card and input borders |
| `admin.border-muted` | `admin.color.border.muted` | Subtle dividers |
| `admin.border-active` | `admin.color.border.active` | Focused inputs, active cards |
| `admin.focus-ring` | `admin.color.brand.green` | Universal focus ring |

### 2.3 Typography

| Token | Value |
|---|---|
| `font.family.primary` | `Outfit` |
| `font.family.mono` | `'JetBrains Mono', 'Fira Code', monospace` |
| `font.size.xs` | `11px` |
| `font.size.sm` | `12px` |
| `font.size.md` | `13px` |
| `font.size.lg` | `13.33px` |
| `font.size.xl` | `14px` |
| `font.size.2xl` | `15px` |
| `font.size.3xl` | `16px` |
| `font.size.4xl` | `18px` |
| `font.size.5xl` | `24px` |
| `font.size.6xl` | `32px` |

**Admin typography role map:**

| Role | Size token | Weight | Colour |
|---|---|---|---|
| Page title | `font.size.5xl` | 700 | `admin.text` |
| Section heading | `font.size.4xl` | 700 | `admin.text` |
| Card title | `font.size.3xl` | 600 | `admin.text` |
| Sidebar section label | `font.size.xs` | 700 | `admin.text-muted` uppercase letter-spacing `0.08em` |
| Sidebar nav item | `font.size.sm` | 500 | `admin.text-label` |
| Sidebar nav item (active) | `font.size.sm` | 600 | `admin.text` |
| Table header | `font.size.xs` | 700 | `admin.text-muted` uppercase |
| Table cell body | `font.size.sm` | 400 | `admin.text` |
| Table cell secondary | `font.size.xs` | 400 | `admin.text-muted` |
| Metric value (KPI card) | `font.size.6xl` | 800 | `admin.text` |
| Metric label | `font.size.sm` | 500 | `admin.text-muted` |
| Metric delta | `font.size.sm` | 600 | status colour |
| Badge / status chip | `font.size.xs` | 700 | status colour |
| Button primary | `font.size.sm` | 600 | `admin.color.text.white` |
| Button secondary | `font.size.sm` | 600 | `admin.text` |
| Input value | `font.size.sm` | 400 | `admin.text` |
| Input label | `font.size.xs` | 600 | `admin.text-label` |
| Input placeholder | `font.size.sm` | 400 | `admin.color.text.placeholder` |
| Code / ID / SKU | `font.family.mono`, `font.size.xs` | 400 | `admin.text-label` |
| Breadcrumb | `font.size.sm` | 400 | `admin.text-muted` |
| Tooltip | `font.size.xs` | 400 | `admin.color.text.white` |
| Chart axis label | `font.size.xs` | 400 | `admin.text-muted` |
| Chart legend | `font.size.xs` | 500 | `admin.text-label` |
| Empty state heading | `font.size.3xl` | 600 | `admin.text` |
| Empty state body | `font.size.sm` | 400 | `admin.text-muted` |

### 2.4 Spacing Scale

| Token | Value |
|---|---|
| `space.1` | `2px` |
| `space.2` | `4px` |
| `space.3` | `6px` |
| `space.4` | `8px` |
| `space.5` | `10px` |
| `space.6` | `12px` |
| `space.7` | `16px` |
| `space.8` | `20px` |
| `space.9` | `24px` |
| `space.10` | `32px` |
| `space.11` | `40px` |
| `space.12` | `48px` |
| `space.13` | `64px` |

> The admin spacing scale is denser than the storefront — admin UIs pack more information.

### 2.5 Border Radius

| Token | Value | Usage |
|---|---|---|
| `radius.xs` | `4px` | Status badges, micro chips |
| `radius.sm` | `6px` | Buttons, inputs, small cards |
| `radius.md` | `8px` | Cards, modals, dropdowns |
| `radius.lg` | `12px` | Large panels, drawers |
| `radius.xl` | `16px` | Full-page modals |
| `radius.full` | `9999px` | Avatar chips, pill badges |

### 2.6 Shadows

| Token | Value | Usage |
|---|---|---|
| `shadow.xs` | `0 1px 2px rgba(0,0,0,0.3)` | Buttons, small elements |
| `shadow.sm` | `0 2px 8px rgba(0,0,0,0.25)` | Cards, inputs on focus |
| `shadow.md` | `0 4px 16px rgba(0,0,0,0.3)` | Modals, dropdowns |
| `shadow.lg` | `0 8px 32px rgba(0,0,0,0.4)` | Full-screen overlays |
| `shadow.green` | `0 0 0 3px rgba(0,181,102,0.25)` | Focus ring glow |

### 2.7 Motion

| Token | Value | Usage |
|---|---|---|
| `motion.instant` | `150ms` | Hover colour, icon |
| `motion.fast` | `200ms` | Dropdown, tooltip, chip |
| `motion.normal` | `250ms` | Modal, panel slide, tab |
| `motion.slow` | `350ms` | Drawer, page transition |

### 2.8 Contrast Audit

| Pairing | Ratio | AA body | Status |
|---|---|---|---|
| `admin.text` (#cdd9e5) on `admin.card-bg` (#1c2128) | ~10:1 | ✅ | Pass |
| `admin.text-muted` (#768390) on `admin.card-bg` (#1c2128) | ~4.6:1 | ✅ | Pass |
| `admin.color.text.white` on `admin.accent` (#00b566) — weight 600 | ~3.5:1 | ⚠️ large only | Large/bold only |
| `admin.color.status.success` (#57ab5a) on `admin.card-bg` | ~4.5:1 | ✅ | Pass |
| `admin.color.status.error` (#e5534b) on `admin.card-bg` | ~4.5:1 | ✅ | Pass |
| `admin.color.status.warning` (#c69026) on `admin.card-bg` | ~4.6:1 | ✅ | Pass |
| `admin.text-label` (#adbac7) on `admin.sidebar-bg` (#161b22) | ~8.2:1 | ✅ | Pass |

---

## 3. Page Layout & Navigation Structure

### 3.1 Shell Layout

```
┌────────────────────────────────────────────────────────────────────────┐
│  TOP BAR (64px)                                                        │
│  [🌿 Hero Admin]  [Global Search]  [🔔 Alerts]  [Avatar: Priya K.]    │
├───────────────┬────────────────────────────────────────────────────────┤
│               │                                                        │
│  LEFT         │  MAIN CONTENT AREA                                     │
│  SIDEBAR      │                                                        │
│  (240px)      │  ┌── BREADCRUMB ──────────────────────────────────┐   │
│               │  │                                                 │   │
│  • Nav items  │  │  PAGE TITLE + PAGE ACTIONS                     │   │
│  • Sections   │  │                                                 │   │
│  • User info  │  │  CONTENT (tables, charts, forms, etc.)         │   │
│               │  └─────────────────────────────────────────────────┘  │
│               │                                                        │
└───────────────┴────────────────────────────────────────────────────────┘
```

### 3.2 Layout Rules

| Property | Value |
|---|---|
| Sidebar width | `240px` collapsed to `56px` icon-only mode |
| Top bar height | `64px` |
| Page background | `admin.page-bg` |
| Content area bg | `admin.page-bg` |
| Content padding | `space.9 = 24px` all sides |
| Max content width | `1440px` for wide screens; unconstrained for tables |
| `z-index: sidebar` | `90` |
| `z-index: top-bar` | `100` |
| `z-index: dropdown` | `200` |
| `z-index: modal` | `300` |
| `z-index: toast` | `400` |
| `z-index: tooltip` | `500` |

---

## 4. Top Bar

```
┌────────────────────────────────────────────────────────────────────────┐
│  🌿 Hero Admin    [🔍 Search orders, products, customers... ⌘K]       │
│                   [🔔 3]  [❓]  [┐ Priya K. · Super Admin  ▾]        │
└────────────────────────────────────────────────────────────────────────┘
```

### 4.1 Top Bar Shell

| Property | Value |
|---|---|
| Background | `admin.sidebar-bg` |
| Height | `64px` |
| Border-bottom | `1px solid admin.border-muted` |
| Position | `fixed`, `top: 0`, `left: 0`, `right: 0`, `z-index: 100` |
| Padding | `0 space.9` |

### 4.2 Logo & Brand

| Property | Value |
|---|---|
| Logo | 🌿 leaf SVG + "Hero Admin" wordmark |
| Logo font | `font.size.3xl`, weight 700, `admin.text` |
| Logo width | `160px` (aligns with sidebar) |
| Logo link | `/admin` — dashboard home |
| Focus-visible | `2px` focus ring `admin.focus-ring` |

### 4.3 Global Search

```
[🔍 Search orders, products, customers...    ⌘K]
```

| Property | Value |
|---|---|
| Width | `480px`, centred in top bar |
| Height | `40px` |
| Background | `admin.input-bg` |
| Border | `1px solid admin.border` |
| Border-radius | `radius.sm` |
| Font | `font.size.sm`, `admin.text-muted` placeholder |
| Shortcut badge | `⌘K` pill, `admin.border` bg, `admin.text-muted`, `font.size.xs` |
| Focus | Full search modal opens (see §4.3.1) |
| `aria-label` | `"Global search"` |
| `role` | `"combobox"` |

**§4.3.1 Global Search Modal:**

Triggered by click or `⌘K` / `Ctrl+K`.

```
┌──────────────────────────────────────────────────────────┐
│  🔍 [                                              ] [×] │
├──────────────────────────────────────────────────────────┤
│  RECENT                                                  │
│  📦 Order #ORD-4821 — Priya Kumar       Delivered        │
│  🌿 Monstera Deliciosa M — SKU-MM-001   In Stock 234     │
│  👤 Ravi Shah — ravi@email.com          ₹8,440 LTV       │
├──────────────────────────────────────────────────────────┤
│  JUMP TO                                                  │
│  📊 Dashboard                                            │
│  📦 Orders                                               │
│  🛒 Products                                             │
│  👥 Customers                                            │
└──────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Modal width | `640px`, centred |
| Background | `admin.overlay-bg` |
| Border | `1px solid admin.border` |
| Border-radius | `radius.lg` |
| Shadow | `shadow.lg` |
| Backdrop | `admin.color.bg.canvas` @ 70% |
| Input | Full-width, `48px`, no border, `font.size.xl` |
| Results | `role="listbox"`, each result `role="option"` |
| Keyboard | Arrow keys navigate; Enter selects; Escape closes |
| Focus trap | Yes |
| Result types | Orders, Products, Customers, Customers by email, Pages |
| Debounce | `250ms` after keystroke |
| Min chars | `2` before searching |
| Empty | `"No results for '[query]'"` |

### 4.4 Notification Bell

```
[🔔 3]
```

| Property | Value |
|---|---|
| Icon | `24×24px` bell SVG |
| Badge | Count, `admin.color.status.error`, `radius.full`, `font.size.xs` weight 700 |
| Click | Opens notification panel (right-side drawer, `280px`) |
| `aria-label` | `"Notifications, 3 unread"` |
| `aria-haspopup` | `"true"` |

**Notification panel items:**

```
┌──────────────────────────────────────────────┐
│  Notifications                    [Mark all] │
├──────────────────────────────────────────────┤
│  🔴  Low stock: Snake Plant (SKU-SP-002)     │
│      Only 3 units remaining · 5 mins ago     │
├──────────────────────────────────────────────┤
│  🟡  Order #ORD-4830 — Payment pending       │
│      Awaiting confirmation · 12 mins ago     │
├──────────────────────────────────────────────┤
│  🟢  Garden service booking confirmed        │
│      Ravi Shah · Pune · 20 Jun · 10 mins ago │
└──────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Unread bg | `admin.accent-muted` |
| Read bg | `admin.card-bg` |
| Font (title) | `font.size.sm`, weight 600, `admin.text` |
| Font (body) | `font.size.xs`, weight 400, `admin.text-muted` |
| Timestamp | `font.size.xs`, `admin.text-muted` |
| Click | Navigate to related entity |
| `role` | `role="log"`, `aria-live="polite"` |

### 4.5 User Menu

```
[┐ Priya K. · Super Admin  ▾]
```

| Property | Value |
|---|---|
| Avatar | `32×32px`, `radius.full`, initials monogram, `admin.accent-muted` bg |
| Name | `font.size.sm`, weight 600, `admin.text` |
| Role | `font.size.xs`, weight 400, `admin.text-muted` |
| Dropdown | My Profile · Account Settings · Activity Log · Switch Role · Sign Out |
| `aria-label` | `"User menu for [name]"` |
| `aria-haspopup` | `"menu"` |

---

## 5. Left Sidebar

### 5.1 Sidebar Shell

| Property | Value |
|---|---|
| Width | `240px` expanded · `56px` collapsed (icon-only) |
| Background | `admin.sidebar-bg` |
| Border-right | `1px solid admin.border-muted` |
| Position | `fixed`, `top: 64px`, `left: 0`, `bottom: 0`, `overflow-y: auto` |
| `z-index` | `90` |
| Transition | Width `motion.slow` |
| Collapse trigger | `‹` / `›` icon button at bottom, `aria-label="Collapse sidebar"` |

### 5.2 Navigation Structure

```
MAIN
  📊 Dashboard
  📦 Orders
  🛒 Products
  👥 Customers
  📈 Analytics

STORE
  🌿 Inventory
  💳 Payments
  🚚 Shipping & Fulfilment
  🎟️ Discounts & Coupons
  ⭐ Reviews

SERVICES
  🌱 Garden Services
  🤖 AI Care Usage

CONTENT
  📝 Pages & Blog
  📢 Campaigns

SETTINGS
  ⚙️  Store Settings
  👤 Staff & Permissions
  🔗 Integrations
  📋 Activity Log

━━━━━━━━━━━━━━━━━━━━━━━
  [Avatar] Priya K.
  Super Admin
  [Sign Out ↩]
```

### 5.3 Sidebar Nav Item

| Property | Value |
|---|---|
| Height | `36px` |
| Border-radius | `radius.sm` |
| Padding | `space.3 = 6px` vertical, `space.7 = 16px` horizontal |
| Icon | `18×18px`, left-aligned, `space.4` gap to label |
| Font | `font.size.sm`, weight 500, `admin.text-label` |
| Margin | `space.1` between items, `space.4` between sections |

**Nav item states:**

| State | Background | Icon | Text | Left bar |
|---|---|---|---|---|
| Default | Transparent | `admin.text-muted` | `admin.text-label` | None |
| Hover | `admin.color.bg.elevated` | `admin.text-label` | `admin.text` | None |
| Focus-visible | `admin.color.bg.elevated` | `admin.accent` | `admin.text` | `2px` focus ring |
| Active | `admin.accent-muted` | `admin.accent` | `admin.text`, weight 600 | `3px solid admin.accent` left inset |
| Transition | `motion.instant` | — | — | — |

**Badge on nav item (count):**

| Property | Value |
|---|---|
| Background | `admin.accent` |
| Text | `admin.color.text.white`, `font.size.xs`, weight 700 |
| Border-radius | `radius.full` |
| Padding | `1px space.2` |
| `aria-label` | `"[n] [item type]"` |

**Sidebar section labels:**

| Property | Value |
|---|---|
| Font | `font.size.xs`, weight 700, `admin.text-muted` |
| Letter-spacing | `0.08em` |
| Text transform | `uppercase` |
| Padding | `space.7 = 16px` horizontal, `space.4 = 8px` top, `space.2 = 4px` bottom |
| `aria-hidden` | `true` — decorative section label |

**Collapsed sidebar:**
- Icons only, `56px` width
- Active item: `admin.accent-muted` bg, `admin.accent` icon
- Tooltip on hover: nav item label, right-of-icon, `admin.overlay-bg`
- Section labels hidden

**Keyboard:**
- `role="navigation"`, `aria-label="Admin navigation"`
- `role="list"` on nav list, `role="listitem"` on items
- Arrow keys cycle through items; Enter activates
- `aria-current="page"` on active item

---

## 6. Dashboard — Overview Page

> Default landing page after login. Shows store health at a glance.

### 6.1 Page Header

```
Dashboard                              [📅 Last 30 days ▾]  [↓ Export]
Tuesday, 28 June 2026
```

| Property | Value |
|---|---|
| Page title | `font.size.5xl`, weight 700, `admin.text` |
| Date subtitle | `font.size.sm`, `admin.text-muted` |
| Date range picker | Right-aligned dropdown: Today · Yesterday · Last 7 days · Last 30 days · This month · Custom |
| Export button | Secondary outlined, `radius.sm`, `font.size.sm` |

### 6.2 KPI Cards Row

```
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│  Total Revenue   │ │   Orders Today   │ │  Active Customers│ │  Avg Order Value │
│                  │ │                  │ │                  │ │                  │
│  ₹4,82,340       │ │     124          │ │    3,891         │ │    ₹1,248        │
│  ↑ +18.4%        │ │  ↑ +12 vs yest. │ │  ↑ +4.2%        │ │  ↓ −2.1%        │
│  vs last month   │ │                  │ │                  │ │                  │
└──────────────────┘ └──────────────────┘ └──────────────────┘ └──────────────────┘
```

**Single KPI card:**

| Property | Value |
|---|---|
| Background | `admin.card-bg` |
| Border | `1px solid admin.border-muted` |
| Border-radius | `radius.md` |
| Padding | `space.9 = 24px` |
| Shadow | `shadow.xs` |
| Hover | `admin.card-hover` bg, `motion.instant` |
| Min-width | `200px` |
| Grid | 4-column, `space.7 = 16px` gap |

| Element | Token / Value |
|---|---|
| Label | `font.size.sm`, weight 500, `admin.text-muted` |
| Value | `font.size.6xl`, weight 800, `admin.text` |
| Delta (positive) | `↑ +18.4%`, `font.size.sm`, weight 600, `admin.color.status.success` |
| Delta (negative) | `↓ −2.1%`, `font.size.sm`, weight 600, `admin.color.status.error` |
| Delta (neutral) | `→ 0%`, `font.size.sm`, weight 600, `admin.text-muted` |
| Context | `font.size.xs`, `admin.text-muted` below delta |
| Sparkline | `48px` height, right-aligned, `admin.accent` line, no axes |
| `aria-label` | `"[label]: [value]. [delta] [context]"` |

**8 KPI cards for dashboard:**

| KPI | Format | Chart |
|---|---|---|
| Total Revenue | `₹X,XX,XXX` | Line sparkline |
| Orders Today | Integer | Bar sparkline |
| Active Customers | Integer | Line sparkline |
| Avg Order Value | `₹X,XXX` | Line sparkline |
| Units Sold | Integer | Bar sparkline |
| Return Rate | `X.X%` | Line sparkline |
| Garden Bookings | Integer | Bar sparkline |
| AI Care Queries | Integer | Line sparkline |

### 6.3 Revenue Chart (Main)

```
┌─────────────────────────────────────────────────────────────────────┐
│  Revenue Over Time                        [Daily ▾]  [Line / Bar ⌃]│
│                                                                     │
│  ₹60,000 ─────────────────────────────────────────── ✦             │
│  ₹40,000 ──────────────────────────── ╱───────────────             │
│  ₹20,000 ────────────────── ╱────────                              │
│       0 ─────────────────╱                                         │
│           Jun 1    Jun 7    Jun 14   Jun 21   Jun 28               │
│           ● Revenue  ● Orders  ● Avg Order Value                   │
└─────────────────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Background | `admin.card-bg` |
| Border | `1px solid admin.border-muted` |
| Border-radius | `radius.md` |
| Padding | `space.9 = 24px` |
| Height | `320px` |
| Chart library | Recharts / Chart.js / Victory |
| Grid lines | `admin.color.chart.grid`, dashed |
| Line colours | `admin.color.chart.1` (revenue), `.chart.2` (orders), `.chart.3` (AOV) |
| Tooltip | `admin.overlay-bg` bg, `shadow.md`, `radius.sm` |
| Tooltip font | `font.size.xs`, `admin.text` |
| X-axis | `font.size.xs`, `admin.text-muted` |
| Y-axis | `font.size.xs`, `admin.text-muted`, formatted `₹` |
| Legend | Below chart, `font.size.xs`, coloured dots |
| Toggle | Daily / Weekly / Monthly dropdown |
| Chart type | Line / Bar toggle |
| `role` | `role="img"`, `aria-label` describes current data range and values |

### 6.4 Recent Orders Table

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Recent Orders                                           [View All →]   │
├──────────┬─────────────────────┬─────────────────┬────────┬────────────┤
│  ORDER   │  CUSTOMER           │  ITEMS          │  TOTAL │  STATUS    │
├──────────┼─────────────────────┼─────────────────┼────────┼────────────┤
│ #ORD-4831│ Priya Kumar         │ 3 items         │ ₹1,248 │ Delivered  │
│ #ORD-4830│ Ravi Shah           │ 1 item          │  ₹399  │ Processing │
│ #ORD-4829│ Sunita Verma        │ 5 items         │ ₹2,890 │ Shipped    │
└──────────┴─────────────────────┴─────────────────┴────────┴────────────┘
```

Shows last 10 orders. Full table spec in §8 (Orders module).

### 6.5 Low Stock Alerts

```
┌─────────────────────────────────────────────────────────────┐
│  ⚠️ Low Stock Alerts (5)                    [View Inventory] │
├──────────────┬─────────────────┬────────┬──────────────────┤
│  PRODUCT     │  SKU            │  STOCK │  REORDER LEVEL   │
├──────────────┼─────────────────┼────────┼──────────────────┤
│ Snake Plant  │ SKU-SP-002      │   3    │  10              │
│ Pothos Vine  │ SKU-PV-001      │   7    │  15              │
└──────────────┴─────────────────┴────────┴──────────────────┘
```

| Property | Value |
|---|---|
| Header border-left | `4px solid admin.color.status.warning` |
| Stock < reorder | `admin.color.status.error` text + `admin.color.status.error.bg` row bg |
| Stock warning zone | `admin.color.status.warning` text |
| "Quick Reorder" | Inline action button per row |
| `role` | `role="alert"`, `aria-live="polite"` when new item enters list |

### 6.6 Category Sales Breakdown (Donut Chart)

```
┌────────────────────────────────────────────┐
│  Sales by Category                         │
│                                            │
│        ╭──────╮                            │
│       ╱  47%  ╲    ● Indoor Plants   47%  │
│      │  Indoor  │   ● Outdoor Plants  23%  │
│       ╲        ╱   ● Seeds           15%  │
│        ╰──────╯    ● Succulents       10%  │
│                    ● Other             5%  │
└────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Chart type | Donut, `240px` diameter |
| Colours | `admin.color.chart.1–5` |
| Centre label | Largest category name + % |
| Legend | Right-aligned, category + %, `font.size.xs` |
| Hover segment | Elevates slightly, tooltip shows value + % |
| `aria-label` | `"Sales by category. [list of categories with percentages]"` |

### 6.7 Today's Garden Service Bookings

```
┌───────────────────────────────────────────────────────┐
│  Garden Bookings Today (4)          [View All →]      │
├────────────────────┬─────────────────┬───────────────┤
│  CUSTOMER          │  SERVICE        │  TIME  STATUS │
├────────────────────┼─────────────────┼───────────────┤
│  Anjali Mehta      │  Lawn Maint.    │  10AM  Conf.  │
│  Karthik R.        │  Balcony Garden │  2PM   Pending│
└────────────────────┴─────────────────┴───────────────┘
```

---

## 7. Shared Admin Components

### 7.1 Data Table

Used across Orders, Products, Customers, Inventory, Reviews.

```
┌────────────────────────────────────────────────────────────────────────────┐
│  [🔍 Search...] [Filter ▾] [Columns ▾]         [Export CSV]  [+ New]      │
├────────┬───────────────────┬──────────┬──────────┬────────┬───────────────┤
│ ☐ ALL  │  COLUMN A         │ COLUMN B │ COLUMN C │ COL D  │  ACTIONS      │
├────────┼───────────────────┼──────────┼──────────┼────────┼───────────────┤
│ ☐      │  Row data         │  data    │  data    │  data  │  [Edit][⋮]   │
│ ☐      │  Row data         │  data    │  data    │  data  │  [Edit][⋮]   │
│ ☐      │  Row data         │  data    │  data    │  data  │  [Edit][⋮]   │
├────────┴───────────────────┴──────────┴──────────┴────────┴───────────────┤
│  Showing 1–25 of 486  [< Prev]  [1][2][3]...[20]  [Next >]               │
└────────────────────────────────────────────────────────────────────────────┘
```

**Table shell:**

| Property | Value |
|---|---|
| Background | `admin.card-bg` |
| Border | `1px solid admin.border-muted` |
| Border-radius | `radius.md` |
| Overflow | `overflow-x: auto` — horizontal scroll on narrow content |

**Table header row:**

| Property | Value |
|---|---|
| Background | `admin.color.bg.canvas` |
| Font | `font.size.xs`, weight 700, `admin.text-muted`, uppercase, `letter-spacing: 0.06em` |
| Padding | `space.4 = 8px` vertical, `space.7 = 16px` horizontal |
| Border-bottom | `1px solid admin.border` |
| Sort indicator | `↑↓` arrows, `admin.text-muted`; active column shows `↑` or `↓` in `admin.accent` |
| Sortable header | Hover: `admin.text`, cursor `pointer`; focus-visible: `2px` focus ring |
| `role` | `role="columnheader"`, `aria-sort="ascending/descending/none"` |

**Table body rows:**

| Property | Value |
|---|---|
| Font | `font.size.sm`, weight 400, `admin.text` |
| Padding | `space.4 = 8px` vertical, `space.7 = 16px` horizontal |
| Min row height | `48px` (touch-friendly) |
| Border-bottom | `1px solid admin.border-muted` |
| Hover bg | `admin.color.bg.elevated` |
| Selected bg | `admin.accent-muted` |
| Striped | Optional — alternate rows `admin.color.bg.canvas` |
| `role` | `role="row"`, `aria-selected` when selectable |

**Table toolbar:**

| Element | Spec |
|---|---|
| Search input | `240px`, `radius.sm`, `admin.input-bg`, `shadow.xs` on focus |
| Filter button | Outlined `admin.border`, `radius.sm`, opens filter panel |
| Columns button | Toggles column visibility picker dropdown |
| Export CSV | Secondary outlined button |
| "+ New" | Primary `admin.accent` filled, `radius.sm` |
| Bulk actions bar | Appears on row selection: `"X selected"` + bulk action buttons |

**Bulk actions bar:**

```
[ ☑ 12 selected ]  [Change Status ▾]  [Export Selected]  [Delete]  [✕ Clear]
```

| Property | Value |
|---|---|
| Background | `admin.accent-muted` |
| Border | `1px solid admin.accent` |
| Border-radius | `radius.sm` |
| Font | `font.size.sm`, weight 500, `admin.text` |
| Delete button | `admin.color.status.error` text, outlined `admin.color.status.error` border |
| `aria-live` | `"polite"` — announces selection count |

**Pagination:**

| Property | Value |
|---|---|
| Font | `font.size.sm`, `admin.text-muted` |
| Page buttons | `32×32px`, `radius.xs`, `admin.color.bg.elevated` hover |
| Active page | `admin.accent` bg, `admin.color.text.white` |
| Prev/Next | Arrow icons, disabled at ends |
| Per-page | `[25 per page ▾]` dropdown: 25 / 50 / 100 |
| `aria-label` | `"Pagination navigation"` |
| `aria-current` | `"page"` on active page button |

**Empty table state:**

```
┌───────────────────────────────────────────────┐
│                                               │
│   📭  No orders found                         │
│       Try adjusting your filters or search.   │
│       [ Clear Filters ]                       │
│                                               │
└───────────────────────────────────────────────┘
```

**Accessibility:**
- `<table>` with `role="grid"` for interactive tables
- `<caption>` or `aria-label` on each table
- `<th scope="col">` on headers
- `<th scope="row">` on row headers
- Keyboard: Tab to table; Arrow keys navigate cells; Enter opens row; Space selects checkbox

### 7.2 Admin Form Components

**Input field:**

| Property | Value |
|---|---|
| Height | `36px` |
| Background | `admin.input-bg` |
| Border | `1px solid admin.border` |
| Border-radius | `radius.sm` |
| Font | `font.size.sm`, `admin.text` |
| Padding | `space.3 = 6px` vertical, `space.6 = 12px` horizontal |
| Label | `font.size.xs`, weight 600, `admin.text-label`, above input, `space.2` gap |
| Placeholder | `admin.color.text.placeholder` |

**Input states:**

| State | Border | Background |
|---|---|---|
| Default | `admin.border` | `admin.input-bg` |
| Hover | `admin.color.border.active` @ 60% | `admin.input-bg` |
| Focus | `admin.border-active` + `shadow.green` | `admin.input-bg` |
| Filled | `admin.border` | `admin.input-bg` |
| Error | `admin.color.status.error` | `admin.color.status.error.bg` |
| Disabled | `admin.border-muted` | `admin.color.bg.canvas` |
| Read-only | `admin.border-muted` | `admin.color.bg.canvas` |

**Textarea:** Same as input; `min-height: 80px`; `resize: vertical`.

**Select:** Custom dropdown with `admin.overlay-bg` panel, `shadow.md`, `radius.sm`.

**Checkbox:**
- `16×16px`, `radius.xs`
- Unchecked: `admin.border` border, `admin.input-bg`
- Checked: `admin.accent` bg + white `✓`
- Focus: `shadow.green`

**Toggle:**
- `36×20px` track, `16×16px` thumb
- Off: `admin.border` track; On: `admin.accent` track
- `role="switch"`, `aria-checked`

**Date picker:** Standard HTML `<input type="date">` styled with admin tokens; custom styled calendar dropdown.

### 7.3 Admin Buttons

**Primary (filled):**

| Property | Value |
|---|---|
| Background | `admin.accent` |
| Text | `admin.color.text.white`, `font.size.sm`, weight 600 |
| Height | `36px` |
| Padding | `0 space.7 = 16px` |
| Border-radius | `radius.sm` |
| Hover | `admin.accent-hover` |
| Focus | `shadow.green` |
| Active | Scale `0.98` |
| Disabled | `admin.accent` @ 40%, `aria-disabled` |
| Loading | Spinner, `aria-busy` |

**Secondary (outlined):**

| Property | Value |
|---|---|
| Background | Transparent |
| Border | `1px solid admin.border` |
| Text | `admin.text`, `font.size.sm`, weight 600 |
| Hover | `admin.color.bg.elevated` bg |

**Danger:**

| Property | Value |
|---|---|
| Background | `admin.color.status.error` |
| Text | `admin.color.text.white` |
| Hover | `admin.color.status.error` darkened 10% |

**Ghost (icon-only or text):**

| Property | Value |
|---|---|
| Background | Transparent |
| Text | `admin.text-muted` |
| Hover | `admin.color.bg.elevated`, `admin.text` |

**All button sizes:**

| Size | Height | Font | Padding |
|---|---|---|---|
| Large | `40px` | `font.size.sm` | `0 space.8 = 20px` |
| Default | `36px` | `font.size.sm` | `0 space.7 = 16px` |
| Small | `28px` | `font.size.xs` | `0 space.5 = 10px` |

### 7.4 Status Badge

| Status | Background | Text | Icon |
|---|---|---|---|
| Delivered / Active / Paid | `admin.color.status.success.bg` | `admin.color.status.success` | ✓ |
| Processing / Pending | `admin.color.status.warning.bg` | `admin.color.status.warning` | ⏳ |
| Shipped / In Transit | `admin.color.status.info.bg` | `admin.color.status.info` | 🚚 |
| Cancelled / Error | `admin.color.status.error.bg` | `admin.color.status.error` | ✕ |
| Returned | `admin.color.status.purple.bg` | `admin.color.status.purple` | ↩ |
| Attempted | `admin.color.status.orange.bg` | `admin.color.status.orange` | ⚠ |
| Draft | `admin.border` | `admin.text-muted` | ○ |

| Property | Value |
|---|---|
| Font | `font.size.xs`, weight 700 |
| Border-radius | `radius.full` |
| Padding | `space.1 space.3` = `2px 6px` |
| Icon | `10×10px`, `space.1` gap |
| `aria-label` | `"Status: [status]"` |

### 7.5 Modal / Drawer

**Confirmation Modal:**

```
┌──────────────────────────────────────────────────┐
│  Delete Product?                            [×]  │
│                                                  │
│  This action cannot be undone. The product and  │
│  all its variants will be permanently deleted.   │
│                                                  │
│  [ Cancel ]              [ Delete Product ]      │
└──────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Max-width | `480px` small · `640px` default · `800px` large |
| Background | `admin.overlay-bg` |
| Border | `1px solid admin.border` |
| Border-radius | `radius.lg` |
| Shadow | `shadow.lg` |
| Backdrop | `admin.color.bg.canvas` @ 75% |
| Heading | `font.size.3xl`, weight 700, `admin.text` |
| Body | `font.size.sm`, `admin.text-muted` |
| `role` | `"dialog"` / `"alertdialog"` |
| `aria-modal` | `"true"` |
| Focus trap | Yes |
| Close | `×` + Escape |

**Right-Side Drawer:**

For detail panels, filters, and quick-edit forms.

| Property | Value |
|---|---|
| Width | `480px` default · `640px` large |
| Background | `admin.card-bg` |
| Border-left | `1px solid admin.border` |
| Shadow | `shadow.lg` |
| `role` | `"dialog"`, `aria-modal="true"` |
| Animation | Slides in from right, `motion.slow` |

### 7.6 Toast Notifications

| Property | Value |
|---|---|
| Position | Top-right, fixed, `z-index: 400` |
| Width | `320px` |
| Background | `admin.color.bg.overlay` |
| Border | `1px solid admin.border` |
| Border-radius | `radius.md` |
| Shadow | `shadow.md` |
| Font | `font.size.sm`, `admin.text` |
| Auto-dismiss | `4000ms` |
| `role` | `"status"` |
| `aria-live` | `"polite"` |

**Variants:**

| Type | Left border | Icon |
|---|---|---|
| Success | `4px solid admin.color.status.success` | ✓ |
| Error | `4px solid admin.color.status.error` | ✕ |
| Warning | `4px solid admin.color.status.warning` | ⚠ |
| Info | `4px solid admin.color.status.info` | ℹ |

### 7.7 Tooltip

| Property | Value |
|---|---|
| Background | `admin.color.bg.canvas` |
| Border | `1px solid admin.border` |
| Border-radius | `radius.xs` |
| Font | `font.size.xs`, `admin.color.text.white` |
| Padding | `space.2 space.4` = `4px 8px` |
| Max-width | `240px` |
| Show trigger | Hover + focus (`300ms` delay) |
| `role` | `"tooltip"` |
| `aria-describedby` | On trigger |

### 7.8 Filter Panel

```
┌──────────────────────────────────────────┐
│  Filters                      [Clear All]│
├──────────────────────────────────────────┤
│  Status                             [▲]  │
│  [☑] Delivered    [☐] Processing         │
│  [☐] Shipped      [☐] Cancelled          │
├──────────────────────────────────────────┤
│  Date Range                         [▲]  │
│  From: [  DD/MM/YYYY  ]                  │
│  To:   [  DD/MM/YYYY  ]                  │
├──────────────────────────────────────────┤
│  Order Total                        [▲]  │
│  ₹[Min ──────●──────────── Max]          │
└──────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Panel type | Right-side drawer, `320px` |
| Background | `admin.card-bg` |
| Filter section heading | `font.size.xs`, weight 700, `admin.text-muted`, uppercase |
| Section accordion | Chevron toggle, `aria-expanded` |
| Apply on change | Instant — no "Apply" button needed |
| "Clear All" | Top-right, `admin.color.status.error` text |

---

## 8. Orders Module

### 8.1 Orders List Page

**URL:** `/admin/orders`

**Page header:**
```
Orders (4,821)          [🔍 Search] [Filter] [Status ▾] [Date ▾]  [Export]  [+ Create Order]
```

**Order table columns:**

| Column | Content | Width | Sortable |
|---|---|---|---|
| ☐ | Checkbox | `40px` | No |
| Order | `#ORD-4831` (link), `font.family.mono` | `120px` | Yes |
| Customer | Name + email in smaller font | `200px` | Yes |
| Date | `15 Jun, 10:24 AM` | `140px` | Yes |
| Items | `3 items` | `80px` | No |
| Total | `₹1,248` | `100px` | Yes |
| Payment | Paid / Pending / Failed badge | `120px` | Yes |
| Status | Order status badge | `130px` | Yes |
| Actions | `[View]` `[⋮]` overflow | `100px` | No |

**Row overflow menu (⋮):**
- View details
- Edit order
- Print invoice
- Cancel order
- Refund
- Add note

**Status filter chips (quick filter above table):**
```
[ All ]  [ Pending ]  [ Processing ]  [ Shipped ]  [ Delivered ]  [ Cancelled ]
```

Same chip style as `admin.accent-muted` active, `admin.border` default.

### 8.2 Order Detail Page

**URL:** `/admin/orders/ORD-4821`

```
← Orders    Order #ORD-4821                    [Print Invoice] [Refund] [Cancel Order]
            Placed 15 Jun 2026 · Priya Kumar

┌────────────────────────────────┬─────────────────────────────────────────┐
│  ORDER TIMELINE                │  ORDER SUMMARY                          │
│  ● Order Placed                │  Items: ₹1,098                          │
│  ● Payment Confirmed           │  Shipping: Free                         │
│  ● Packed                      │  Discount: −₹110                        │
│  ● Dispatched                  │  Tax: ₹260                              │
│  ● Out for Delivery ← Current  │  ─────────────                          │
│                                │  Total: ₹1,248                          │
│                                │  Paid via: Visa •••• 4821               │
├────────────────────────────────┴─────────────────────────────────────────┤
│  ORDER ITEMS                                                              │
│  [img] Monstera Deliciosa — M   SKU-MM-001   ₹399 × 1   ₹399           │
│  [img] Peace Lily — S           SKU-PL-002   ₹249 × 2   ₹498           │
├────────────────────────────────────────────────────────────────────────────┤
│  CUSTOMER INFO           │  SHIPPING ADDRESS         │  FULFILMENT        │
│  Priya Kumar             │  42 Green Park Society    │  Shiprocket        │
│  priya@email.com         │  Baner, Pune — 411045     │  SR-8821-43XY      │
│  📞 +91 98765 43210      │  Maharashtra, India       │  [Update Status]   │
├────────────────────────────────────────────────────────────────────────────┤
│  ADMIN NOTES                                              [+ Add Note]    │
│  15 Jun — Priya requested gift wrapping. — Admin: Suresh                 │
└────────────────────────────────────────────────────────────────────────────┘
```

**Fulfilment status update:**

| Property | Value |
|---|---|
| Current status | Badge, always visible |
| "Update Status" | Opens modal with status select + tracking number input |
| Status select | All valid next states shown (state machine aware) |
| Tracking number | Text input, optional note field |
| Submit | `"Save & Notify Customer"` (sends email) or `"Save Only"` |

**Admin notes:**

| Property | Value |
|---|---|
| Note entry | Textarea + `[Add Note]` button |
| Notes list | Chronological, author + timestamp |
| Note visibility | Internal only (not shown to customer) |
| Note font | `font.size.sm`, `admin.text` |
| Author | `font.size.xs`, `admin.text-muted` |

---

## 9. Products Module

### 9.1 Products List Page

**URL:** `/admin/products`

**Table columns:**

| Column | Content | Sortable |
|---|---|---|
| ☐ | Checkbox | No |
| Product | Thumbnail + Name + SKU | Yes |
| Category | Tag chips | No |
| Price | Current price | Yes |
| Stock | Units remaining (coloured) | Yes |
| Status | Active / Draft / Archived | Yes |
| Updated | Relative timestamp | Yes |
| Actions | `[Edit]` `[⋮]` | No |

**Stock colour coding:**
- `> reorder level` → `admin.color.status.success`
- `≤ reorder level` → `admin.color.status.warning`
- `0` → `admin.color.status.error` + `"Out of Stock"` badge

### 9.2 Product Edit / Create Page

**URL:** `/admin/products/new` · `/admin/products/[id]/edit`

```
← Products     Edit Product: Monstera Deliciosa              [Save Draft] [Publish]

┌────────────────────────────────────┬─────────────────────────────────────┐
│  PRODUCT INFO                      │  PRODUCT ORGANISATION               │
│  Title *                           │  Category *                         │
│  [ Monstera Deliciosa           ]  │  [ Indoor Plants ▾ ]               │
│                                    │                                     │
│  Description                       │  Tags                               │
│  [Rich text editor               ] │  [ indoor, monstera, air-purifying ]│
│                                    │                                     │
│  MEDIA                             │  Status                             │
│  [+ Upload photos / drag drop    ] │  ( ● ) Active                      │
│  [img1][img2][img3]                │  ( ○ ) Draft                        │
│                                    │  ( ○ ) Archived                     │
├────────────────────────────────────┤                                     │
│  PRICING                           │  CARE INFORMATION (plant-specific)  │
│  Price *        [ ₹399        ]   │  Light: [ Select ▾ ]               │
│  Compare at     [ ₹599        ]   │  Water: [ Select ▾ ]               │
│  Cost per unit  [ ₹180        ]   │  Temp:  [ _______ ]                │
│  Taxable  [☑]                      │  Pet safe: [☑]                     │
├────────────────────────────────────┤  Air purifying: [☑]               │
│  INVENTORY                         │                                     │
│  SKU    [ SKU-MM-001          ]   │  SEO                                │
│  Stock  [ 234                 ]   │  Meta title: [              ]       │
│  Reorder level [ 20           ]   │  Meta desc:  [              ]       │
│  Track qty [☑]                     │  URL: /products/[ monstera-m ]     │
├────────────────────────────────────┴─────────────────────────────────────┤
│  VARIANTS                                                                 │
│  [+ Add variant option]  (Size · Colour · Pot type)                      │
│  ┌────────────┬──────────┬────────┬──────────┬────────────┐             │
│  │  VARIANT   │  PRICE   │  STOCK │  SKU     │  ACTIONS   │             │
│  │  Small     │  ₹199    │   45   │ SKU-MS   │  [Edit][×] │             │
│  │  Medium    │  ₹399    │  234   │ SKU-MM   │  [Edit][×] │             │
│  │  Large     │  ₹699    │   67   │ SKU-ML   │  [Edit][×] │             │
│  └────────────┴──────────┴────────┴──────────┴────────────┘             │
└──────────────────────────────────────────────────────────────────────────┘
```

**Rich text editor toolbar:**
`B  I  U  H1  H2  — List  Link  Image  Code  Clear`

| Property | Value |
|---|---|
| Editor bg | `admin.input-bg` |
| Editor border | `1px solid admin.border` |
| Editor radius | `radius.sm` |
| Min height | `200px` |
| Toolbar bg | `admin.color.bg.canvas` |
| Toolbar border-bottom | `1px solid admin.border-muted` |

**Media upload zone:**

| Property | Value |
|---|---|
| Style | Dashed border `admin.border`, `admin.accent` @ 30%, `radius.md` |
| Drag-active | `admin.accent-muted` bg, solid `admin.accent` border |
| Accepted | JPG, PNG, WebP ≤ 10MB |
| Preview | `80×80px` thumbnails, `radius.xs`, drag-to-reorder |
| Primary image | First image badge: `"Primary"` |
| `aria-label` | `"Upload product images"` |

**Publish/Save actions (sticky footer bar):**

```
[Discard Changes]                        [Save Draft]  [Publish]
```

| Property | Value |
|---|---|
| Position | Sticky bottom of page content area |
| Background | `admin.sidebar-bg` |
| Border-top | `1px solid admin.border` |
| Padding | `space.7 = 16px` |
| "Publish" | `admin.accent` filled, primary |
| "Save Draft" | Secondary outlined |
| "Discard" | Ghost, `admin.color.status.error` text |

---

## 10. Customers Module

### 10.1 Customers List Page

**URL:** `/admin/customers`

**Table columns:**

| Column | Content | Sortable |
|---|---|---|
| ☐ | Checkbox | No |
| Customer | Avatar + Name + Email | Yes |
| Phone | Phone number | No |
| Orders | Order count | Yes |
| Total Spent | Lifetime value | Yes |
| Loyalty Tier | 🌿 / 🥈 / 🥇 badge | Yes |
| Last Order | Relative date | Yes |
| Actions | `[View]` `[⋮]` | No |

### 10.2 Customer Detail Page

**URL:** `/admin/customers/[id]`

```
← Customers    Priya Kumar                         [Edit] [Send Email] [⋮]
               priya@email.com · +91 98765 43210

┌─────────────────────────────────────┬──────────────────────────────────┐
│  CUSTOMER OVERVIEW                  │  LOYALTY & POINTS                │
│  Member since: 12 Jan 2025          │  🌿 Plant Lover                  │
│  Last active: 2 hours ago           │  240 Green Points                │
│  Total orders: 12                   │  ████████░░  240/500 to Silver   │
│  Total spent: ₹14,820              │  [Adjust Points]                 │
│  Avg order value: ₹1,235           │                                  │
│  Return rate: 0%                    │  TAGS                            │
│                                     │  [VIP] [Plant Lover] [+ Add Tag] │
├─────────────────────────────────────┴──────────────────────────────────┤
│  ORDER HISTORY                                                         │
│  [table: recent 5 orders with status — "View All Orders →"]           │
├────────────────────────────────────────────────────────────────────────┤
│  ADDRESS BOOK                                    ADMIN NOTES           │
│  🏠 Home: 42 Green Park, Pune 411045            [note list + add]     │
│  🏢 Work: WeWork BKC, Mumbai 400051                                   │
├────────────────────────────────────────────────────────────────────────┤
│  WISHLIST (12 items)                                                   │
│  [product thumbnails grid, 6 shown + "View All →"]                    │
└────────────────────────────────────────────────────────────────────────┘
```

**Adjust Points modal:**

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

---

## 11. Inventory Module

### 11.1 Inventory List Page

**URL:** `/admin/inventory`

**View toggles:** `[Table]  [Cards]  [By Category]`

**Table columns:**

| Column | Content | Sortable |
|---|---|---|
| Product | Image + Name + SKU | Yes |
| Category | Tag | No |
| Stock | Current units (coloured) | Yes |
| Reorder Level | Threshold | Yes |
| Status | In Stock / Low / Out | Yes |
| Last Updated | Date | Yes |
| Cost Price | Per unit | Yes |
| Actions | `[Edit Stock]` `[⋮]` | No |

**Low stock alert banner (top of page):**

```
⚠️  5 products are below reorder level.  [ View Low Stock Items ]
```

| Property | Value |
|---|---|
| Background | `admin.color.status.warning.bg` |
| Border | `1px solid admin.color.status.warning` |
| Border-radius | `radius.sm` |
| Font | `font.size.sm`, `admin.color.status.warning` |
| `role` | `role="alert"` |

### 11.2 Stock Adjustment Modal

```
┌───────────────────────────────────────────────────┐
│  Adjust Stock: Monstera Deliciosa M         [×]  │
│  Current stock: 234 units                        │
│                                                   │
│  Adjustment type:                                 │
│  ( ● ) Add stock    ( ○ ) Remove    ( ○ ) Set    │
│                                                   │
│  Quantity:   [ 50             ]                   │
│  Reason:     [ Supplier order ▾ ]                │
│  Reference:  [ PO-2026-0412   ]                   │
│  Note:       [ optional...    ]                   │
│                                                   │
│  New total: 284 units                             │
│                                                   │
│  [ Cancel ]          [ Save Adjustment ]          │
└───────────────────────────────────────────────────┘
```

### 11.3 Inventory History Table

Appended below inventory list — shows all stock movements per product.

| Column | Content |
|---|---|
| Date | Timestamp |
| Type | Added / Removed / Adjusted / Sale / Return |
| Qty | `+50` / `−1` (signed, coloured) |
| Reason | Free text |
| Reference | PO number, order ID, etc. |
| Admin | Who made the change |

---

## 12. Analytics Module

### 12.1 Analytics Dashboard

**URL:** `/admin/analytics`

**Date range:** Top-right picker; defaults to last 30 days.

**Layout — 3 sections:**

**Section 1 — Revenue & Orders:**
- Revenue Over Time (line chart, §6.3 pattern)
- Orders by Day (bar chart)
- Revenue by Category (stacked bar)
- Average Order Value trend (line)

**Section 2 — Products:**
- Top 10 Products by Revenue (horizontal bar chart)
- Top 10 Products by Units Sold (horizontal bar)
- Products with Zero Sales (table)
- Low Inventory Risk (table)

**Section 3 — Customers:**
- New vs Returning Customers (pie chart)
- Customer Acquisition by Channel (donut)
- Customer Lifetime Value distribution (histogram)
- Geographic breakdown by city (table or map)

**Section 4 — Garden Services:**
- Bookings by Month (bar)
- Bookings by Service Type (donut)
- Revenue from Garden Services (line)

**Section 5 — AI Care:**
- Daily AI queries (bar)
- Top plant questions (ranked list)
- Photo uploads volume (bar)
- Conversion from AI Care to cart (funnel)

### 12.2 Chart Toolbar (all charts)

```
[Chart title]                          [📅 Date ▾]  [↓ Export]  [⤢ Expand]
```

| Property | Value |
|---|---|
| Expand | Opens chart in full-screen modal |
| Export | Downloads chart as PNG or CSV |
| Date override | Per-chart date range overrides global |

### 12.3 Analytics Table (data below charts)

Each chart section has a supporting data table expandable with `[Show Data Table]`:

| Property | Value |
|---|---|
| Toggle | `[Show Data Table]` / `[Show Chart]` |
| Table | Standard admin table (§7.1) |
| Export | Always available on tables |

---

## 13. Garden Services Module

### 13.1 Bookings List Page

**URL:** `/admin/garden-services`

**KPI row:**
```
[ Total Bookings: 124 ]  [ Confirmed: 89 ]  [ Pending: 18 ]  [ Revenue: ₹2,48,000 ]
```

**Table columns:**

| Column | Content | Sortable |
|---|---|---|
| Booking ID | `#GS-0821` | Yes |
| Customer | Name + Phone | Yes |
| Service | Service type chip | Yes |
| Date & Time | Scheduled slot | Yes |
| City | Location | Yes |
| Assigned To | Gardener name + avatar | No |
| Status | Confirmed / Pending / Completed / Cancelled | Yes |
| Amount | ₹ value | Yes |
| Actions | `[View]` `[Assign]` `[⋮]` | No |

### 13.2 Booking Detail Page

**URL:** `/admin/garden-services/[id]`

```
← Garden Services    Booking #GS-0821         [Confirm]  [Cancel]  [Reassign]

Customer:     Priya Kumar · +91 98765 43210
Service:      Balcony & Terrace Garden Setup
Date/Time:    Saturday, 20 June 2026 · 10:00 AM – 1:00 PM
Location:     42 Green Park Society, Baner, Pune 411045
Notes:        "Please bring the Monstera and Peace Lily from my last order."
Amount:       ₹3,500 · Paid via Razorpay
Status:       [ Confirmed ✓ ]

ASSIGNED GARDENER
  [Avatar] Ramesh Patil · Pune Team · ⭐ 4.8
  [Reassign Gardener]

ACTIVITY LOG
  12 Jun 10:24 AM  Booking created by customer
  12 Jun 11:00 AM  Confirmed by Admin: Suresh
  12 Jun 11:05 AM  Assigned to Ramesh Patil
```

### 13.3 Gardener Management

**URL:** `/admin/garden-services/gardeners`

**Table columns:** Gardener name · City · Active bookings · Rating · Status (Active/On Leave/Inactive) · Actions.

**Gardener profile page:** Name, photo, city, specialisations, schedule calendar, booking history, customer ratings.

---

## 14. AI Care Module

### 14.1 AI Care Dashboard

**URL:** `/admin/ai-care`

```
AI Care Usage Dashboard                     [📅 Last 30 days ▾]

┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────────────────┐
│ Total     │ │ Unique    │ │ Photo     │ │ Add-to-Cart from      │
│ Queries   │ │ Users     │ │ Uploads   │ │ AI Recommendations    │
│  14,821   │ │  3,204    │ │   6,234   │ │ ₹48,320 / 12.4%      │
└───────────┘ └───────────┘ └───────────┘ └───────────────────────┘
```

**Charts:**
- Daily queries volume (bar chart)
- Top 20 most asked questions (ranked list with count)
- Most uploaded plant types (horizontal bar)
- AI → Cart conversion funnel
- Response accuracy rating (pie: helpful/not helpful)

### 14.2 Query Log Table

**URL:** `/admin/ai-care/queries`

| Column | Content |
|---|---|
| Timestamp | Date + time |
| User | Customer name / "Guest" |
| Query | Truncated question text |
| Has Photo | ✓ / − |
| AI Response | Truncated preview |
| Rating | 👍 / 👎 / — |
| Converted | ✓ if added product to cart |

**Row expand:** Full query + photo + AI response + conversation thread.

**Flagged queries:** Queries with negative ratings or no photo match highlighted with `admin.color.status.warning.bg` row bg.

---

## 15. Discounts & Coupons Module

### 15.1 Discounts List Page

**URL:** `/admin/discounts`

**Table columns:**

| Column | Content | Sortable |
|---|---|---|
| Code | `HERO20` monospace | Yes |
| Type | % off / ₹ off / Free shipping | No |
| Value | `20%` or `₹100` | No |
| Used | `24 / 100` | Yes |
| Min order | `₹500` | No |
| Expires | Date | Yes |
| Status | Active / Expired / Disabled | Yes |
| Actions | `[Edit]` `[Disable]` `[Copy Link]` | No |

### 15.2 Create Discount Form

Full form with:
- Code (auto-generate toggle)
- Discount type: % / fixed / free shipping / buy X get Y
- Value
- Applies to: All products / Specific collections / Specific products
- Minimum requirements: Order amount / Qty
- Customer eligibility: All / Specific customers / Loyalty tier
- Usage limits: Total / Per customer
- Active dates: Start date + End date
- Combine with other discounts: toggle

---

## 16. Reviews Module

### 16.1 Reviews List Page

**URL:** `/admin/reviews`

**KPI row:** Total Reviews · Average Rating · Pending Moderation · Flagged.

**Table columns:**

| Column | Content | Sortable |
|---|---|---|
| Rating | ★★★★☆ display | Yes |
| Reviewer | Name + verified badge | Yes |
| Product | Product name + thumbnail | Yes |
| Review | Truncated text | No |
| Photos | `[📷 2]` count | No |
| Date | Relative | Yes |
| Status | Published / Pending / Rejected | Yes |
| Actions | `[Approve]` `[Reject]` `[View]` | No |

**Review detail drawer:**

Full review text, all photos, reviewer's order link, moderation history, reply form.

**Reply to review:**

```
Admin reply:
[ Your plants always make our team smile, Priya! Thank you for... ]
[ 240 / 500 ]
[ Cancel ]  [ Publish Reply ]
```

---

## 17. Staff & Permissions Module

### 17.1 Staff List Page

**URL:** `/admin/settings/staff`

**Table columns:** Avatar · Name · Email · Role · Last Login · Status · Actions.

**Role badges:**

| Role | Badge colour |
|---|---|
| Super Admin | `admin.color.status.purple` |
| Operations Manager | `admin.color.status.info` |
| Inventory Manager | `admin.color.status.warning` |
| Customer Support | `admin.color.status.success` |
| Marketing | `admin.color.chart.2` |
| Garden Services | `admin.color.brand.green` |
| Analyst (Read-only) | `admin.text-muted` |

### 17.2 Role Permissions Matrix

```
┌─────────────────────┬────────────┬────────────┬──────────┬──────────┐
│  MODULE             │ Super Admin│ Ops Manager│ Inventory│ Support  │
├─────────────────────┼────────────┼────────────┼──────────┼──────────┤
│  Dashboard          │  ✓ Full    │  ✓ Full    │  View    │  View    │
│  Orders             │  ✓ Full    │  ✓ Full    │  View    │  ✓ Full  │
│  Products           │  ✓ Full    │  ✓ Full    │  ✓ Full  │  View    │
│  Customers          │  ✓ Full    │  View      │  —       │  ✓ Full  │
│  Inventory          │  ✓ Full    │  View      │  ✓ Full  │  —       │
│  Analytics          │  ✓ Full    │  View      │  View    │  —       │
│  Garden Services    │  ✓ Full    │  ✓ Full    │  —       │  View    │
│  AI Care            │  ✓ Full    │  View      │  —       │  —       │
│  Discounts          │  ✓ Full    │  ✓ Full    │  —       │  —       │
│  Reviews            │  ✓ Full    │  ✓ Full    │  —       │  ✓ Full  │
│  Staff              │  ✓ Full    │  —         │  —       │  —       │
│  Settings           │  ✓ Full    │  —         │  —       │  —       │
└─────────────────────┴────────────┴────────────┴──────────┴──────────┘
```

---

## 18. Settings Module

### 18.1 Settings Navigation

```
GENERAL
  Store Details
  Billing & Plan
  Taxes & VAT

SALES CHANNELS
  Online Store
  Shopify POS

SHIPPING & FULFILMENT
  Zones & Rates
  Carrier Accounts (Shiprocket)
  Packing Slips

PAYMENTS
  Payment Gateways
  Payout Schedule

NOTIFICATIONS
  Email Templates
  SMS Templates
  Push Notification Settings

INTEGRATIONS
  Shopify
  Razorpay / PayU
  Shiprocket
  Mailchimp / Klaviyo
  Zendesk
  Google Analytics 4
  Meta Pixel

ADVANCED
  API Access
  Webhooks
  Audit Log
```

### 18.2 Store Details Form

Standard form with:
- Store name, tagline, logo upload
- Contact email, phone
- Address (registered)
- Currency, timezone, language
- `[Save Changes]`

### 18.3 Integration Cards

```
┌─────────────────────────────────────────────────────┐
│  [Razorpay logo]   Razorpay                         │
│  Payment gateway — Indian cards, UPI, wallets       │
│  Status: [ Connected ✓ ]        [Settings] [Revoke] │
└─────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Card bg | `admin.card-bg` |
| Status connected | `admin.color.status.success` badge |
| Status disconnected | `admin.color.status.error` badge / `[Connect]` button |
| Logo | `40×40px` integration logo, `radius.sm` |
| Name | `font.size.3xl`, weight 700, `admin.text` |
| Description | `font.size.sm`, `admin.text-muted` |

---

## 19. Activity Log

### 19.1 Activity Log Page

**URL:** `/admin/activity-log`

A tamper-proof chronological record of all admin actions.

**Table columns:**

| Column | Content |
|---|---|
| Timestamp | `15 Jun 2026, 10:24:38 AM` |
| Admin | Avatar + name |
| Action | Verb: `Created` / `Updated` / `Deleted` / `Exported` / `Logged in` |
| Entity | `Order #ORD-4821` / `Product: Monstera M` |
| IP Address | `103.x.x.x` |
| Details | `[View Details →]` expands to full diff |

**Filter by:** Admin user · Action type · Entity type · Date range.

**Action diff view (drawer):**

Shows before/after state in a JSON diff viewer:
```
  "fulfillment_status": {
-   "old": "processing",
+   "new": "shipped"
  },
  "tracking_number": {
-   "old": null,
+   "new": "SR-8821-43XY"
  }
```

Green = added/changed, Red = removed, Mono font, dark bg.

---

## 20. Accessibility Requirements

### 20.1 Contrast Ratios

| Pairing | Ratio | Required | Status |
|---|---|---|---|
| `admin.text` (#cdd9e5) on `admin.card-bg` (#1c2128) | ~10:1 | 4.5:1 | ✅ Pass |
| `admin.text-muted` (#768390) on `admin.card-bg` | ~4.6:1 | 4.5:1 | ✅ Pass |
| `admin.text-muted` (#768390) on `admin.sidebar-bg` (#161b22) | ~5.2:1 | 4.5:1 | ✅ Pass |
| `admin.color.status.success` (#57ab5a) on `admin.card-bg` | ~4.5:1 | 4.5:1 | ✅ Pass |
| `admin.color.status.error` (#e5534b) on `admin.card-bg` | ~4.5:1 | 4.5:1 | ✅ Pass |
| `admin.color.status.warning` (#c69026) on `admin.card-bg` | ~4.6:1 | 4.5:1 | ✅ Pass |
| `admin.color.text.white` on `admin.accent` (#00b566) at body size | ~3.5:1 | 4.5:1 | ⚠️ Use weight 600+ `font.size.sm` minimum |

### 20.2 Focus Management

- All interactive elements: `outline: 2px solid admin.focus-ring; outline-offset: 2px; box-shadow: shadow.green`
- Global search modal: focus trapped; Escape closes; focus returns to search trigger
- All modals: focus trapped; `role="dialog"` or `"alertdialog"`; Escape closes
- Drawers: focus trapped; Escape closes; focus returns to trigger
- After table row action (edit/delete): focus returns to row or next row
- Toast: `aria-live="polite"` — focus does NOT move
- Sidebar collapse: focus moves to first visible element if focused item becomes hidden

### 20.3 Full ARIA Map

| Component | ARIA |
|---|---|
| Top bar | `<header>`, `role="banner"` |
| Global search trigger | `role="combobox"`, `aria-expanded`, `aria-controls` |
| Global search modal | `role="dialog"`, `aria-label="Global search"`, focus trap |
| Search results | `role="listbox"`, `role="option"`, `aria-selected` |
| Notification bell | `aria-label="Notifications, [n] unread"`, `aria-haspopup` |
| Notification panel | `role="log"`, `aria-live="polite"` |
| User menu | `aria-label="User menu"`, `role="menu"`, `role="menuitem"` |
| Sidebar | `<nav>`, `role="navigation"`, `aria-label="Admin navigation"` |
| Sidebar nav list | `role="list"` |
| Sidebar nav item | `role="listitem"`, active: `aria-current="page"` |
| Sidebar collapse | `<button>`, `aria-label="Collapse sidebar"`, `aria-expanded` |
| Data table | `<table>`, `aria-label="[Table name]"`, `role="grid"` |
| Table header cell | `<th scope="col">`, `aria-sort` |
| Table sort button | `<button>` inside `<th>`, `aria-label="Sort by [col] ascending/descending"` |
| Row checkbox | `role="checkbox"`, `aria-label="Select [row identifier]"` |
| Select all | `role="checkbox"`, `aria-label="Select all rows"`, `aria-checked="mixed"` |
| Bulk action bar | `aria-live="polite"` — announces selection count |
| Pagination | `<nav aria-label="Pagination">`, `aria-current="page"` |
| Status badge | `aria-label="Status: [status]"` |
| Filter panel | `role="dialog"` (if drawer), `aria-label="Filters"` |
| Filter checkbox | `role="checkbox"`, `aria-checked` |
| Toggle switch | `role="switch"`, `aria-checked`, `aria-labelledby` |
| Rich text editor | `role="textbox"`, `aria-multiline`, `aria-label` |
| Modal | `role="dialog"` or `"alertdialog"`, `aria-modal="true"`, `aria-labelledby` |
| Confirmation modal | `role="alertdialog"`, focus defaults to safe action |
| Drawer | `role="dialog"`, `aria-modal="true"` |
| Toast | `role="status"`, `aria-live="polite"` |
| Chart | `role="img"`, `aria-label` with data summary |
| KPI card | `aria-label="[label]: [value]. [delta] [context]"` |
| Progress bar | `role="progressbar"`, `aria-valuenow/min/max` |
| Tooltip | `role="tooltip"`, referenced by `aria-describedby` |
| Activity diff | `role="region"`, `aria-label="Change details"` |

### 20.4 Keyboard Navigation Map

| Key | Behaviour |
|---|---|
| `Tab` | Forward through all interactive elements |
| `Shift+Tab` | Backward |
| `Enter / Space` | Activate button, link, checkbox, toggle |
| `Escape` | Close modal / drawer / dropdown / search |
| `Arrow Up/Down` | Navigate dropdown menu / table rows |
| `Arrow Left/Right` | Navigate table columns / tab lists |
| `Home / End` | First / last item in dropdown or table |
| `⌘K / Ctrl+K` | Open global search modal |
| `⌘S / Ctrl+S` | Save current form |
| `⌘Z / Ctrl+Z` | Undo last action (where supported) |
| `Delete` | Delete selected row (with confirm) |
| `Ctrl+A` | Select all table rows |
| `Ctrl+Click` | Multi-select table rows |

### 20.5 Testable Acceptance Criteria

| # | Criterion | Method | Pass |
|---|---|---|---|
| A1 | No contrast failures | axe DevTools | Zero critical |
| A2 | All focus rings visible (`2px solid #00b566`) | Manual Tab | Every element |
| A3 | Global search keyboard operable | Keyboard | ⌘K opens; arrows navigate; Enter selects; Escape closes |
| A4 | Table sort operable by keyboard | Keyboard | Enter on column header sorts; `aria-sort` updates |
| A5 | Bulk action bar announced | Screen reader | `aria-live` fires on selection change |
| A6 | All modals trap focus | Keyboard | Tab cycles inside only |
| A7 | All modals close on Escape | Keyboard | Dialog closes; focus returns to trigger |
| A8 | Status badges not colour-only | Screen reader | `aria-label` includes text |
| A9 | Charts have text alternatives | Screen reader | `aria-label` with data summary |
| A10 | Table has `aria-label` | Screen reader | Table name announced |
| A11 | Pagination `aria-current` correct | Screen reader | Active page announced |
| A12 | Toggle switches use `role="switch"` | Screen reader | State announced |
| A13 | Form errors announced | Screen reader | `aria-invalid` + `role="alert"` |
| A14 | `prefers-reduced-motion` respected | OS setting | Animations disabled |
| A15 | Sidebar collapse accessible | Keyboard + SR | `aria-label` + `aria-expanded` correct |

### 20.6 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Specific admin animations to disable:
- Sidebar width transition (collapse/expand)
- Modal/drawer slide animation
- Chart line drawing animation
- Skeleton shimmer
- Notification bell shake
- Toast slide-in

---

## 21. Security & Auth

### 21.1 Authentication

| Requirement | Rule |
|---|---|
| Auth method | Email + Password OR SSO (Google Workspace) |
| MFA | Mandatory for Super Admin; optional for others |
| Session timeout | 8 hours active · 30 min idle |
| Session expiry | Toast warning at `25 min`; forced sign-out at `30 min` idle |
| Failed login | Lockout after `5 attempts`, `15 min` cooldown |
| Password policy | Min 12 chars, 1 uppercase, 1 number, 1 special char |
| Login page | `/admin/login` — `noindex`, `nofollow` |
| Password reset | Email link, `30 min` expiry |

### 21.2 Route Guards

| Role | Accessible routes |
|---|---|
| Super Admin | All routes |
| Operations Manager | `/admin`, `/admin/orders/*`, `/admin/products/*`, `/admin/analytics`, `/admin/garden-services/*`, `/admin/discounts/*`, `/admin/reviews/*` |
| Inventory Manager | `/admin`, `/admin/products/*`, `/admin/inventory/*` |
| Customer Support | `/admin`, `/admin/orders/*`, `/admin/customers/*`, `/admin/reviews/*` |
| Marketing | `/admin`, `/admin/analytics`, `/admin/discounts/*`, `/admin/campaigns/*` |
| Garden Services | `/admin`, `/admin/garden-services/*` |
| Analyst | `/admin`, `/admin/analytics` — read-only all |

Accessing an unauthorised route → `403 Forbidden` page with: `"You don't have permission to view this page."` + `[Go to Dashboard]`.

### 21.3 Data Handling

- Customer PII (email, phone) must be masked in exports unless explicitly authorised
- Credit card data: never stored or displayed — show masked format (`•••• 4821`) only
- Activity log: immutable — no admin can delete log entries, including Super Admin
- Export actions: logged in activity log with admin ID, timestamp, record count

---

## 22. Performance Specification

| Metric | Target | Rule |
|---|---|---|
| LCP | `< 2s` | Dashboard KPI cards SSR; charts client-side |
| CLS | `< 0.1` | All card/chart containers have fixed dimensions |
| INP | `< 200ms` | Table filter, row select, modal open |
| FCP | `< 1.5s` | Critical CSS inlined; Outfit font preloaded |
| Table render | `< 100ms` | Virtualise rows beyond 100 visible rows |
| Search response | `< 300ms` | Debounce `250ms`; API response target |
| Chart render | `< 500ms` | Lazy-load chart library; skeleton while loading |

**Virtualisation:** Tables with > 100 rows must use virtual scrolling (`react-virtual`, `tanstack-virtual`). Never render all DOM rows.

**Lazy-loaded modules:**
- Analytics charts (loaded on tab visit)
- Activity log (loaded on route visit)
- Rich text editor (loaded on product edit only)
- Calendar/scheduler (loaded on garden services only)

---

## 23. Analytics & Tracking (Internal)

> Admin actions tracked for internal analytics and audit purposes. Not the same as customer-facing GA4.

| Event | Trigger | Properties |
|---|---|---|
| `admin_login` | Login success | `admin_id`, `role`, `ip` |
| `admin_logout` | Sign out | `admin_id`, `session_duration` |
| `admin_page_view` | Route change | `admin_id`, `path`, `role` |
| `order_status_updated` | Status change | `admin_id`, `order_id`, `old_status`, `new_status` |
| `product_created` | Product save | `admin_id`, `product_id`, `product_name` |
| `product_updated` | Product save | `admin_id`, `product_id`, `fields_changed[]` |
| `product_deleted` | Delete confirm | `admin_id`, `product_id` |
| `stock_adjusted` | Stock save | `admin_id`, `product_id`, `adjustment`, `reason` |
| `customer_points_adjusted` | Points modal save | `admin_id`, `customer_id`, `adjustment`, `reason` |
| `discount_created` | Discount save | `admin_id`, `code`, `type`, `value` |
| `review_moderated` | Approve/Reject | `admin_id`, `review_id`, `action` |
| `booking_assigned` | Gardener assign | `admin_id`, `booking_id`, `gardener_id` |
| `export_triggered` | Export button | `admin_id`, `module`, `record_count`, `format` |
| `bulk_action` | Bulk submit | `admin_id`, `action`, `entity_type`, `count` |
| `search_performed` | Search submit | `admin_id`, `query`, `result_count` |

---

## 24. Anti-Patterns & Prohibited Implementations

| Anti-pattern | Why prohibited | Correct approach |
|---|---|---|
| Raw hex values in CSS | Breaks token system | Use `admin.*` tokens |
| `outline: none` anywhere | Kills keyboard access | `outline: 2px solid admin.focus-ring` always |
| Rendering all table rows in DOM | Performance — lag at 500+ rows | Virtual scroll for > 100 rows |
| Colour-only status indication | WCAG 1.4.1 failure | Always pair colour with text label |
| Deleting records without confirm | Irreversible action | Always `role="alertdialog"` confirm |
| Bulk delete without name/count confirmation | Mass data loss | Confirm modal: `"Delete 12 orders? This cannot be undone."` |
| Unauthenticated API calls | Security vulnerability | All admin API calls require valid session token |
| Exposing raw customer PII in exports | Privacy/GDPR | Mask or require explicit permission |
| Super Admin actions without MFA | Security risk | Destructive actions require re-auth for Super Admin |
| Chart without `aria-label` | Screen readers get nothing | Every chart needs `role="img"` + meaningful `aria-label` |
| Session with no idle timeout | Hijacking risk | 30 min idle timeout enforced |
| Storing passwords in plaintext | Critical security failure | Bcrypt hash, never store |
| Activity log deletable by admin | Audit trail integrity | Log must be append-only, no delete |
| Role permissions hard-coded in frontend | Easy to bypass | Always enforce on API/server side |
| Untokenised font sizes in tables | Typography drift | Use `font.size.xs/sm` tokens only |
| Dropdown without Escape close | Keyboard trap | Escape must close all dropdowns |
| Filter with "Apply" button | Adds friction | Apply filters instantly on change |
| Tooltip on hover only (no focus) | Inaccessible to keyboard | Show tooltip on both hover AND focus |
| Form validation only on submit | Poor UX | Validate per-field on blur + full pass on submit |

---

## 25. Edge-Case Handling

| Scenario | Behaviour |
|---|---|
| Admin network drops mid-edit | Auto-save draft every 30s; show `"Last saved [time]"` indicator; warn on navigate-away if unsaved |
| Table with 0 results | Full empty state with icon, message, and action (§7.1) |
| Very long product name (> 60 chars) | Truncate at 40 chars in table cell; full name in tooltip |
| Order with 20+ line items | Show first 5; `"+ 15 more items"` expand |
| Customer with 0 orders | Show empty order table; `"No orders yet"` |
| Search query returns 0 results | `"No results for '[query]'"` with suggestion to try fewer words |
| Export of 10,000+ rows | Queue as background job; show `"Your export is being prepared"` toast; email link when ready |
| Chart data unavailable / API error | Show `"Unable to load chart data. [Retry]"` inside chart container |
| Duplicate product SKU on create | Inline error: `"This SKU is already in use by [product name]."` |
| Gardener unavailable for booking date | Show `"[Gardener] is unavailable on this date"` and suggest next available |
| Payment webhook delayed | Order shows `"Payment: Pending"` with `"Verify manually"` admin action |
| Concurrent edit conflict | Server returns `409`; show `"This record was updated by [Admin] while you were editing. [View changes] [Overwrite]"` |
| Bulk action on 1000+ rows | Warning modal: `"You're about to update 1,248 orders. This may take a few minutes."` |
| Shopify API rate limit hit | Retry with exponential backoff; show `"Syncing with Shopify — this may take a moment"` |
| Admin account locked | Login shows: `"Account locked. Contact your Super Admin."` |
| MFA code invalid | `"Incorrect code. Try again."` — 3 attempts before 15 min lockout |
| Session expired mid-action | Modal: `"Your session has expired. Please sign in again."` — preserves current URL for redirect after login |

---

## 26. Responsive Behaviour

The admin dashboard is desktop-first. Tablet support is provided; mobile is not required.

| Breakpoint | Layout |
|---|---|
| `≥ 1440px` | Full layout; sidebar `240px`; wide tables |
| `1280–1439px` | Full layout; sidebar `240px`; standard tables |
| `1024–1279px` | Sidebar auto-collapses to `56px`; content fills remaining width |
| `768–1023px` | Sidebar hidden → hamburger overlay; tables horizontally scrollable |
| `< 768px` | Not supported — show `"Please use a desktop or tablet to access the admin."` |

---

## 27. Page Sections — Full Module Map

```
ADMIN DASHBOARD — Module Map
─────────────────────────────────────────────────────────────────
SHELL
  Top Bar (global search, notifications, user menu)
  Left Sidebar (navigation, collapse)

MODULES
  📊 Dashboard          Overview, KPI cards, revenue chart, recent orders,
                        low stock alerts, category breakdown, today's bookings

  📦 Orders             List (table), Detail (timeline + items + customer),
                        Create Order, Print Invoice, Refund, Cancel, Notes

  🛒 Products           List (table), Edit/Create (full form with variants,
                        media, care info, SEO, pricing, inventory)

  👥 Customers          List (table), Detail (overview, orders, wishlist,
                        addresses, notes, loyalty adjust)

  📈 Analytics          Revenue, Orders, Products, Customers, Garden Services,
                        AI Care — charts + supporting data tables

  🌿 Inventory          List, Stock Adjustment, Inventory History,
                        Low Stock Alerts, Reorder Management

  💳 Payments           Transactions list, Payout schedule, Gateway config

  🚚 Shipping           Zones & rates, Carrier accounts, Packing slips

  🎟️  Discounts          List, Create/Edit discount, Usage analytics

  ⭐ Reviews            List, Moderation queue, Reply, Approve/Reject

  🌱 Garden Services    Bookings list/detail, Gardener management,
                        Schedule calendar, Revenue tracking

  🤖 AI Care            Usage dashboard, Query log, Flagged queries,
                        Conversion analytics

  📝 Pages & Blog       CMS for static pages and blog posts

  📢 Campaigns          Email/SMS campaign list, create, analytics

  ⚙️  Store Settings     General, Billing, Taxes, Notification templates

  👤 Staff & Permissions Staff list, Roles, Permission matrix, Invite

  🔗 Integrations       Connected services dashboard, connect/revoke

  📋 Activity Log       Full immutable audit log with diff viewer

SHARED COMPONENTS
  Data Table (sortable, filterable, paginated, virtualised, bulk actions)
  Filter Panel (drawer)
  Admin Forms (inputs, selects, toggles, rich text editor, media upload)
  Buttons (primary, secondary, ghost, danger — 3 sizes)
  Status Badges (7 variants)
  Modals (confirmation, alertdialog, full-form)
  Drawers (right-side detail/edit panels)
  Toasts (success, error, warning, info)
  Tooltips
  Charts (line, bar, donut, sparkline)
  KPI Cards
  Breadcrumb
  Global Search Modal
  Notification Panel
  Skeleton Loading
  Empty States
─────────────────────────────────────────────────────────────────
```

---

## 28. QA Checklist

### Visual
- [ ] Page background: `admin.color.bg.canvas` (#0f1117) — deep dark
- [ ] Sidebar background: `admin.color.bg.sidebar` (#161b22)
- [ ] Card background: `admin.color.bg.surface` (#1c2128)
- [ ] All text: `Outfit` font; monospace IDs/SKUs: `JetBrains Mono`
- [ ] No raw hex in CSS — all from `admin.*` token namespace
- [ ] Active sidebar item: green left bar + green bg tint + green text
- [ ] Status badges: correct colour + icon + text for each status
- [ ] Table header: uppercase, `font.size.xs`, letter-spacing
- [ ] Selected row: green-tinted bg
- [ ] Bulk action bar: green-tinted bg, green border
- [ ] KPI card values: `font.size.6xl`, weight 800
- [ ] Chart colours: `admin.color.chart.1–5` palette
- [ ] Focus rings: `2px solid #00b566` + green glow on all elements
- [ ] Toast: top-right, coloured left border per type
- [ ] Modal backdrop: `admin.color.bg.canvas` @ 75%

### Interaction
- [ ] Global search: `⌘K` / `Ctrl+K` opens modal; arrow keys navigate; Enter selects; Escape closes
- [ ] Sidebar collapse: animates to 56px; tooltip shows on icon hover; expands on click
- [ ] Table sort: click/Enter on header sorts; `aria-sort` updates; indicator shows
- [ ] Row checkbox: selects row; bulk action bar appears
- [ ] Select all: checks all; `aria-checked="mixed"` when partial
- [ ] Bulk actions: disabled when 0 rows selected; confirm on destructive
- [ ] Filter panel: applies instantly on checkbox change
- [ ] Date range picker: updates all charts/tables within scope
- [ ] Product media upload: drag-and-drop works; preview shows; reorder by drag
- [ ] Rich text editor: all toolbar buttons functional
- [ ] Stock adjustment: "New total" preview updates dynamically
- [ ] Order status update: state machine only shows valid next states
- [ ] Form auto-save: product form saves draft every 30s; indicator shows
- [ ] Concurrent edit: `409` handled gracefully with conflict modal
- [ ] Export large dataset: queued as background job; email notification

### Accessibility
- [ ] axe DevTools: zero critical/serious errors on all pages
- [ ] All focus rings visible (2px green + green glow)
- [ ] All tables: `aria-label`, `scope` attributes, sortable headers
- [ ] All charts: `role="img"`, meaningful `aria-label`
- [ ] All modals: focus trap, Escape close, focus return to trigger
- [ ] Bulk action `aria-live` announces selection count
- [ ] Toggle switches: `role="switch"`, `aria-checked`
- [ ] Global search: `role="combobox"`, results `role="listbox"`
- [ ] Sidebar nav: `aria-current="page"` on active item
- [ ] Pagination: `aria-current="page"` on active button
- [ ] Status badges: `aria-label` includes text status
- [ ] `prefers-reduced-motion`: all transitions and animations disabled
- [ ] Notification panel: `role="log"`, `aria-live="polite"`

### Security
- [ ] All routes require authenticated session
- [ ] Role-based route guards enforced on server side (not just client)
- [ ] Destructive actions (delete, cancel, refund) require confirmation modal
- [ ] Super Admin destructive actions require MFA re-auth
- [ ] Activity log is append-only; no delete endpoint
- [ ] Customer PII masked in exported CSVs unless explicitly permitted
- [ ] Credit card numbers never shown full — `•••• XXXX` only
- [ ] Session idle timeout: 30 min enforced
- [ ] All API calls include valid session token

### Performance
- [ ] LCP `< 2s` on dashboard page
- [ ] Tables with > 100 rows: virtual scroll active
- [ ] Charts: lazy-loaded; skeleton shown while loading
- [ ] Global search: debounced `250ms`, response `< 300ms`
- [ ] Outfit font preloaded; `font-display: swap`
- [ ] All chart containers have fixed `height` to prevent CLS

### Content
- [ ] All column headers: uppercase, concise (≤ 2 words)
- [ ] Empty states: descriptive message + clear action CTA
- [ ] Error messages: specific, actionable, not just "Error occurred"
- [ ] Timestamps: consistent format across all modules
- [ ] Prices: `₹` prefix, Indian number format
- [ ] Monospace font on all: order IDs, SKUs, tracking numbers, API keys

---

*Document version: 1.0 (complete) — Admin Dashboard*
*Covers: All 18 modules + shared component library*
*Guideline standard: WCAG 2.2 AA | Token system: Outfit / Admin dark token set*
*Companion documents: Homepage · PLP · PDP · AI Care · Garden Services · Profile · Order Tracking · design-system.md*
*Last updated: June 2026*

---

## 29. Authentication & Session Flows

### 29.1 Admin Login Page

**URL:** `/admin/login`

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│   🌿 Hero Admin                                      │
│                                                      │
│   Sign in to your admin account                      │
│                                                      │
│   Email address *                                    │
│   [ admin@heroplants.com                        ]    │
│                                                      │
│   Password *                                         │
│   [ ••••••••••••••                          👁 ]    │
│                                                      │
│   [ Sign In ]                                        │
│                                                      │
│   Forgot password?                                   │
│                                                      │
│   ─────────── or ───────────                         │
│                                                      │
│   [ Continue with Google Workspace ]                 │
│                                                      │
└──────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Page background | `admin.color.bg.canvas` |
| Card max-width | `420px`, centred, `space.12 = 48px` vertical margin |
| Card bg | `admin.card-bg` |
| Card border | `1px solid admin.border` |
| Card border-radius | `radius.lg` |
| Card shadow | `shadow.md` |
| Card padding | `space.12 = 48px` |
| Logo | 🌿 leaf + "Hero Admin", `font.size.5xl`, weight 700, `admin.text` |
| Heading | `font.size.3xl`, weight 600, `admin.text-muted` |
| Input labels | `font.size.xs`, weight 600, `admin.text-label` |
| Inputs | `36px` height, `admin.input-bg`, `admin.border` |
| "Sign In" button | `admin.accent` filled, full-width, `font.size.sm` weight 600 |
| "Forgot password" | `font.size.sm`, `admin.color.status.info` link |
| Google SSO button | Outlined `admin.border`, white Google icon + label |
| `robots` | `noindex, nofollow` |

**Login error states:**

| Error | Message | Display |
|---|---|---|
| Wrong credentials | `"Incorrect email or password."` | `role="alert"` below password |
| Account locked | `"Account locked after 5 failed attempts. Try again in 15 minutes."` | Red banner above form |
| Account disabled | `"Your account has been disabled. Contact your Super Admin."` | Red banner |
| SSO error | `"Google sign-in failed. Try again or use email/password."` | Red banner |
| Rate limited | `"Too many attempts. Please wait 15 minutes."` | Red banner |

### 29.2 MFA Flow

Required for Super Admin. Optional (but encouraged) for all roles.

```
┌──────────────────────────────────────────────────┐
│   🌿 Hero Admin                                  │
│                                                  │
│   Two-factor authentication                      │
│   Enter the 6-digit code from your              │
│   authenticator app.                             │
│                                                  │
│   [ _ ] [ _ ] [ _ ] [ _ ] [ _ ] [ _ ]          │
│                                                  │
│   [ Verify ]                                     │
│                                                  │
│   Didn't receive a code?  [ Use backup code ]    │
└──────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Code input | 6 individual `1-char` inputs, auto-advance on digit entry |
| Input style | `48×56px`, `radius.sm`, `admin.input-bg`, `admin.border` |
| Auto-verify | On 6th digit entry — no manual submit needed |
| Paste support | Paste 6-digit code → auto-fills all boxes |
| Invalid code | All boxes shake animation; `"Incorrect code. [n] attempts remaining."` |
| Lockout | 3 failed MFA attempts → 15 min lockout |
| Backup code | Plain text input, single-use 8-char code |
| `aria-label` on each | `"MFA digit [n] of 6"` |

### 29.3 Password Reset Flow

```
/admin/login → [Forgot password]
  → /admin/forgot-password (email entry)
  → Email sent → "Check your inbox" confirmation page
  → Email CTA → /admin/reset-password/[token]
  → New password form → Success → /admin/login
```

**Reset form fields:** New password + Confirm password. Password strength meter (same spec as Profile §18 — 4-segment bar). Token expiry: `60 min`. Expired token → `"This link has expired."` + `[Request new link]`.

### 29.4 Session State Handling

| State | Behaviour |
|---|---|
| Active | Normal operation |
| Idle `25 min` | Toast: `"Your session will expire in 5 minutes. Stay signed in?"` with `[Stay Signed In]` button |
| Idle `30 min` | Auto sign-out; modal: `"You've been signed out due to inactivity."` → redirect to `/admin/login?return=[current-path]` |
| Token expired | Silently redirect to `/admin/login?reason=expired` |
| Concurrent session | Warning toast: `"Your account was signed in from another device."` |
| Suspicious login | Email alert sent; session flagged in activity log |

---

## 30. Shopify Admin API Integration

### 30.1 Key API Endpoints Used

| Module | Shopify API endpoint | Method |
|---|---|---|
| Orders list | `GET /admin/api/2024-10/orders.json` | Read |
| Order detail | `GET /admin/api/2024-10/orders/{id}.json` | Read |
| Update fulfillment | `POST /admin/api/2024-10/orders/{id}/fulfillments.json` | Write |
| Cancel order | `POST /admin/api/2024-10/orders/{id}/cancel.json` | Write |
| Create refund | `POST /admin/api/2024-10/orders/{id}/refunds.json` | Write |
| Products list | `GET /admin/api/2024-10/products.json` | Read |
| Product detail | `GET /admin/api/2024-10/products/{id}.json` | Read |
| Create product | `POST /admin/api/2024-10/products.json` | Write |
| Update product | `PUT /admin/api/2024-10/products/{id}.json` | Write |
| Delete product | `DELETE /admin/api/2024-10/products/{id}.json` | Write |
| Inventory levels | `GET /admin/api/2024-10/inventory_levels.json` | Read |
| Adjust inventory | `POST /admin/api/2024-10/inventory_levels/adjust.json` | Write |
| Customers list | `GET /admin/api/2024-10/customers.json` | Read |
| Customer detail | `GET /admin/api/2024-10/customers/{id}.json` | Read |
| Update customer | `PUT /admin/api/2024-10/customers/{id}.json` | Write |
| Discounts | `GET /admin/api/2024-10/price_rules.json` | Read |
| Create discount | `POST /admin/api/2024-10/price_rules.json` | Write |

### 30.2 Webhook Subscriptions

| Event | Topic | Consumer |
|---|---|---|
| New order | `orders/create` | Orders module, notification bell |
| Order paid | `orders/paid` | Orders module, loyalty points trigger |
| Order fulfilled | `orders/fulfilled` | Orders module |
| Order cancelled | `orders/cancelled` | Orders module, inventory restock |
| Product updated | `products/update` | Products module |
| Inventory change | `inventory_levels/update` | Inventory alert system |
| Customer created | `customers/create` | Customers module |
| Refund created | `refunds/create` | Orders module |

### 30.3 Rate Limiting Strategy

Shopify REST API: `40 requests/second` (leaky bucket). GraphQL: `50 cost points/second`.

| Scenario | Strategy |
|---|---|
| Bulk export | Use GraphQL `bulk operations` API — single async job |
| High-frequency polling | Replace with webhooks wherever possible |
| Rate limit hit (`429`) | Exponential backoff: 1s → 2s → 4s → 8s (max 3 retries) |
| Admin notification | Toast: `"Syncing with Shopify — this may take a moment"` |
| Critical actions | Queue with priority; show spinner + status message |

### 30.4 Data Sync Strategy

| Data type | Sync approach | Frequency |
|---|---|---|
| Orders | Webhook-driven + 5-min polling fallback | Real-time |
| Products | Event-driven on admin save | On demand |
| Inventory levels | Webhook-driven | Real-time |
| Customers | 15-min polling + webhook on create | Near real-time |
| Analytics data | Cached; refresh every `1 hour` | Hourly |
| Discount usage | Polled every `15 min` | Near real-time |

---

## 31. Component Migration Notes

### 31.1 Token Adoption Priority

| Priority | Token group | Risk if skipped |
|---|---|---|
| P0 — Critical | All `admin.color.*` tokens | Dark theme breaks; contrast failures |
| P0 — Critical | Focus ring: `2px solid admin.focus-ring` + `shadow.green` | WCAG 2.4.11 failure |
| P0 — Critical | `admin.color.status.*` for all badges | Colour-only info; WCAG 1.4.1 failure |
| P1 — High | All `font.size.*` tokens | Typography regressions |
| P1 — High | `radius.xs` through `radius.lg` | Shape inconsistency |
| P2 — Medium | `shadow.xs` through `shadow.lg` | Elevation inconsistency |
| P2 — Medium | `motion.*` tokens | Animation timing inconsistency |
| P3 — Low | Composed chart colours `admin.color.chart.*` | Chart colour drift |

### 31.2 Raw Values to Eliminate

| Raw value | Replace with token | Location |
|---|---|---|
| `#0f1117` | `admin.color.bg.canvas` | Page bg |
| `#161b22` | `admin.color.bg.sidebar` | Sidebar bg |
| `#1c2128` | `admin.color.bg.surface` | Card bg |
| `#22272e` | `admin.color.bg.elevated` | Hover bg, input bg |
| `#2d333b` | `admin.color.bg.overlay` | Modal, dropdown bg |
| `#cdd9e5` | `admin.color.text.primary` | Primary text |
| `#768390` | `admin.color.text.secondary` | Muted text |
| `#adbac7` | `admin.color.text.tertiary` | Label text |
| `#444c56` | `admin.color.border.default` | Borders |
| `#00b566` | `admin.color.brand.green` | Accent |
| `#57ab5a` | `admin.color.status.success` | Success |
| `#e5534b` | `admin.color.status.error` | Error |
| `#c69026` | `admin.color.status.warning` | Warning |
| `#539bf5` | `admin.color.status.info` | Info |
| `#986ee2` | `admin.color.status.purple` | Returned/special |
| `border-radius: 8px` | `radius.md` | Cards |
| `border-radius: 6px` | `radius.sm` | Buttons, inputs |
| `font-size: 12px` | `font.size.sm` | Table cells |
| `font-size: 11px` | `font.size.xs` | Table headers, badges |

### 31.3 Shared vs Admin-Exclusive Components

**Must NOT re-use storefront components in admin (separate token system):**

| Storefront component | Admin equivalent |
|---|---|
| Storefront Primary CTA | Admin Primary Button |
| Storefront Input Field | Admin Input Field |
| Storefront Status Badge | Admin Status Badge |
| Storefront Modal | Admin Modal |
| Storefront Toast | Admin Toast |
| Storefront Checkbox | Admin Checkbox |
| Storefront Toggle | Admin Toggle |

**Admin-exclusive components (not shared with storefront):**

| Component | Notes |
|---|---|
| Data Table with virtual scroll | Admin only — too complex for storefront |
| KPI Card with sparkline | Admin only |
| Revenue / analytics charts | Admin only |
| Bulk action bar | Admin only |
| Global search modal | Admin only |
| Notification panel | Admin only |
| Sidebar navigation | Admin only |
| Top bar | Admin only |
| Rich text editor | Admin product edit only |
| Activity log diff viewer | Admin only |
| Inventory adjustment modal | Admin only |
| Permission matrix grid | Admin only |
| MFA code input | Admin only |
| Gardener schedule calendar | Admin only |

---

## 32. Keyboard Shortcuts Reference

> All keyboard shortcuts must be documented in a `[?]` help modal accessible from the top bar. Every shortcut must have a keyboard-accessible alternative — shortcuts are accelerators, not the only path.

### 32.1 Global Shortcuts

| Shortcut | Action |
|---|---|
| `⌘K` / `Ctrl+K` | Open global search |
| `⌘/` / `Ctrl+/` | Open keyboard shortcuts help |
| `G then D` | Go to Dashboard |
| `G then O` | Go to Orders |
| `G then P` | Go to Products |
| `G then C` | Go to Customers |
| `G then A` | Go to Analytics |
| `G then I` | Go to Inventory |
| `Escape` | Close any open modal, drawer, dropdown, or search |

### 32.2 Table Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl+A` | Select all visible rows |
| `Space` | Toggle selected row checkbox |
| `Arrow Up/Down` | Navigate rows |
| `Arrow Left/Right` | Navigate columns |
| `Enter` | Open row detail |
| `Delete` | Delete selected rows (with confirm) |
| `E` | Edit focused row |
| `F` | Open filter panel |
| `S` | Focus sort on current column |

### 32.3 Form Shortcuts

| Shortcut | Action |
|---|---|
| `⌘S` / `Ctrl+S` | Save current form (draft or publish depending on context) |
| `⌘Z` / `Ctrl+Z` | Undo last field change |
| `Escape` | Discard unsaved changes (with confirm if dirty) |
| `Tab` | Advance to next field |
| `Shift+Tab` | Go to previous field |
| `Enter` (in select) | Open select dropdown |
| `Arrow Up/Down` (in select) | Navigate options |

### 32.4 Shortcuts Help Modal

```
┌──────────────────────────────────────────────────────────────┐
│  Keyboard Shortcuts                                    [×]   │
├─────────────────────────┬────────────────────────────────────┤
│  NAVIGATION             │  TABLES                            │
│  ⌘K  Global Search      │  Ctrl+A  Select all rows           │
│  G D  Dashboard         │  Space   Toggle row select         │
│  G O  Orders            │  Enter   Open row detail           │
│  G P  Products          │  Delete  Delete selected           │
│  G C  Customers         │  E       Edit focused row          │
│  G A  Analytics         │  F       Open filters              │
│                         │                                    │
│  FORMS                  │  GLOBAL                            │
│  ⌘S   Save              │  ⌘/   This help panel              │
│  ⌘Z   Undo              │  Esc  Close / dismiss              │
│  Esc  Discard changes   │                                    │
└─────────────────────────┴────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Modal max-width | `640px` |
| Trigger | `?` icon in top bar, `aria-label="Keyboard shortcuts"` |
| Shortcut key display | `<kbd>` element, `admin.color.bg.canvas` bg, `admin.border` border, `radius.xs`, `font.family.mono`, `font.size.xs` |
| `role` | `role="dialog"`, `aria-label="Keyboard shortcuts"` |
| Focus on open | First shortcut key |

---

## 33. Component State Master Table

> Every interactive admin component with all required states. Teams must implement every row.

| Component | Default | Hover | Focus-visible | Active | Disabled | Loading | Error | Success |
|---|---|---|---|---|---|---|---|---|
| Sidebar nav item | Transparent, `admin.text-label` | `admin.card-hover` bg, `admin.text` | `2px` focus ring green | — | — | — | — | — |
| Sidebar nav item (active) | `admin.accent-muted` bg, green left bar, `admin.text` weight 600 | Slightly deeper bg | `2px` focus ring | — | — | — | — | — |
| Sidebar collapse button | Ghost, `admin.text-muted` | `admin.card-hover` bg, `admin.text` | `2px` focus ring | — | — | — | — | — |
| Top bar search trigger | `admin.input-bg` bg, `admin.border` | `admin.border-active` @ 60% | `admin.border-active` full | — | — | — | — | — |
| Global search result | Transparent | `admin.card-hover` bg | `2px` focus ring | `admin.accent-muted` bg | — | — | — | — |
| Notification bell | No badge: `admin.text-muted`; badge: error red | `admin.text` | `2px` focus ring | — | — | — | — | — |
| User menu trigger | `admin.text` | `admin.card-hover` bg, `radius.sm` | `2px` focus ring | — | — | — | — | — |
| User menu item | Transparent | `admin.card-hover` bg | `2px` focus ring | — | — | — | — | — |
| Primary button | `admin.accent` bg | `admin.accent-hover` bg | `2px` focus ring + `shadow.green` | Scale `0.98` | `admin.accent` @ 40%, `aria-disabled` | Spinner, `aria-busy` | — | — |
| Secondary button | Transparent, `admin.border` | `admin.card-hover` bg | `2px` focus ring | Scale `0.98` | `opacity: 0.4` | Spinner | — | — |
| Ghost button | Transparent | `admin.card-hover` bg, `admin.text` | `2px` focus ring | — | `opacity: 0.4` | — | — | — |
| Danger button | `admin.color.status.error` bg | Darken 10% | `2px` focus ring `admin.color.status.error` | Scale `0.98` | `opacity: 0.4` | Spinner | — | — |
| Form input | `admin.input-bg`, `admin.border` | `admin.border-active` @ 60% | `admin.border-active` + `shadow.green` | — | `admin.color.bg.canvas`, `admin.border-muted` | — | `admin.color.status.error` border + bg | `admin.color.status.success` border |
| Form select | Same as input | Same | Same | — | Same | — | Same | Same |
| Form textarea | Same as input | Same | Same | — | Same | — | Same | Same |
| Checkbox | `admin.border`, `admin.input-bg` | `admin.border-active` @ 60% | `shadow.green` | — | `opacity: 0.4` | — | — | `admin.accent` bg + white ✓ |
| Toggle switch | Grey track, left thumb | — | `shadow.green` | — | `opacity: 0.4` | — | — | `admin.accent` track, right thumb |
| Table header (sortable) | `admin.text-muted`, `↑↓` indicator | `admin.text`, cursor pointer | `2px` focus ring | — | — | — | — | — |
| Table header (sorted) | `admin.text`, `↑` or `↓` in `admin.accent` | — | `2px` focus ring | — | — | — | — | — |
| Table row | `admin.card-bg` | `admin.card-hover` bg | `2px` focus ring | — | — | — | — | — |
| Table row (selected) | `admin.accent-muted` bg | Deeper `admin.accent-muted` | `2px` focus ring | — | — | — | — | — |
| Row checkbox | `admin.border` | `admin.border-active` | `shadow.green` | — | — | — | — | `admin.accent` fill + ✓ |
| Select-all checkbox | `admin.border` | `admin.border-active` | `shadow.green` | — | — | — | — | Partial: `─` in `admin.accent`; Full: ✓ |
| Pagination button | `admin.card-bg`, `admin.border` | `admin.card-hover` bg | `2px` focus ring | — | — | — | — | — |
| Pagination active | `admin.accent` bg, white text | — | `2px` focus ring | — | — | — | — | — |
| Pagination arrow (end) | `admin.text-muted` | — | `2px` focus ring | — | `opacity: 0.3`, `aria-disabled` | — | — | — |
| Status badge | Correct colour bg tint + text | — | — | — | — | — | — | — |
| KPI card | `admin.card-bg`, `admin.border-muted` | `admin.card-hover` bg, `motion.instant` | `2px` focus ring (if linked) | — | — | Skeleton shimmer | — | — |
| Chart container | `admin.card-bg` | — | — | — | — | Skeleton | Error state + retry | — |
| Chart tooltip | Hidden | Visible on data point hover | — | — | — | — | — | — |
| Filter checkbox (panel) | `admin.border` | `admin.border-active` | `shadow.green` | — | — | — | — | `admin.accent` fill |
| Date range picker trigger | `admin.input-bg`, `admin.border` | `admin.border-active` | `shadow.green` | — | — | — | — | — |
| Date range calendar day | Transparent | `admin.accent-muted` | `2px` focus ring | — | `opacity: 0.3` | — | — | `admin.accent` bg, white text (selected) |
| Modal `×` button | `admin.text-muted` | `admin.text` | `2px` focus ring | Scale `0.95` | — | — | — | — |
| Confirm modal safe button | Outlined, `admin.border` | `admin.card-hover` | `2px` focus ring | Scale `0.98` | — | — | — | — |
| Confirm modal danger button | `admin.color.status.error` bg | Darken 10% | `2px` focus ring | Scale `0.98` | — | Spinner | — | — |
| Drawer close button | `admin.text-muted` | `admin.text` | `2px` focus ring | Scale `0.95` | — | — | — | — |
| Toast notification | `admin.overlay-bg`, coloured left border | — | — | — | — | — | — | Auto-dismiss `4000ms` |
| Toast dismiss `×` | `admin.text-muted` | `admin.text` | `2px` focus ring | — | — | — | — | — |
| Tooltip | Hidden | Appears on hover | Appears on focus | — | — | — | — | — |
| Rich text toolbar button | Ghost | `admin.card-hover` | `2px` focus ring | `admin.accent-muted` bg (active format) | `opacity: 0.4` | — | — | — |
| Media upload zone | Dashed `admin.border` | Solid `admin.border-active`, bg tint | `2px` focus ring | — | — | Upload progress | Error: red border + message | Thumbnail preview |
| Overflow menu trigger (⋮) | `admin.text-muted` | `admin.card-hover`, `admin.text` | `2px` focus ring | — | — | — | — | — |
| Overflow menu item | Transparent | `admin.card-hover` | `2px` focus ring | — | `opacity: 0.4` | — | — | — |
| Overflow menu item (danger) | Transparent | `admin.color.status.error.bg` | `2px` focus ring | — | — | — | — | — |
| Sticky save bar "Publish" | `admin.accent` | `admin.accent-hover` | `2px` focus ring | Scale `0.98` | — | Spinner | — | Brief `"✓ Published"` |
| Sticky save bar "Discard" | Ghost, `admin.color.status.error` text | `admin.color.status.error.bg` tint | `2px` focus ring | — | — | — | — | — |
| MFA digit input | `admin.input-bg`, `admin.border` | — | `admin.border-active` + `shadow.green` | — | — | — | Shake animation | Auto-advances |
| Login submit | `admin.accent` bg, full-width | `admin.accent-hover` | `2px` focus ring | Scale `0.98` | — | Spinner | — | Redirect to dashboard |
| Integration card "Connect" | `admin.accent` outlined | `admin.accent-muted` bg | `2px` focus ring | Scale `0.98` | — | Spinner | Error toast | `"Connected ✓"` badge |
| Integration card "Revoke" | Ghost, `admin.color.status.error` | `admin.color.status.error.bg` | `2px` focus ring | — | — | — | — | Confirm → disconnected |
| Stock adjustment "Save" | `admin.accent` filled | `admin.accent-hover` | `2px` focus ring | Scale `0.98` | Disabled if qty = 0 | Spinner | Error inline | New total updates, toast |
| Points adjust "Apply" | `admin.accent` filled | `admin.accent-hover` | `2px` focus ring | Scale `0.98` | — | Spinner | Error toast | New balance shown, toast |
| Booking "Confirm" | `admin.color.status.success` filled | Darken | `2px` focus ring | Scale `0.98` | — | Spinner | Error toast | Status badge updates |
| Booking "Cancel" | `admin.color.status.error` filled | Darken | `2px` focus ring | Scale `0.98` | — | Spinner | Error toast | Confirm modal first |
| Review "Approve" | `admin.color.status.success` | Darken | `2px` focus ring | Scale `0.98` | — | Spinner | — | Status → Published |
| Review "Reject" | `admin.color.status.error` outlined | `admin.color.status.error.bg` | `2px` focus ring | — | — | — | — | Status → Rejected |

---

## 34. Date, Time & Number Formatting Standards

> All formatting must be consistent across every module. Never mix formats within a page.

### 34.1 Date Formats

| Context | Format | Example |
|---|---|---|
| Table cells (current year) | `DD MMM, HH:MM AM/PM` | `15 Jun, 10:24 AM` |
| Table cells (past year) | `DD MMM YYYY` | `15 Jun 2025` |
| Full detail pages | `Day, DD Month YYYY · HH:MM AM/PM` | `Tuesday, 15 June 2026 · 10:24 AM` |
| Relative (< 1 hour) | `[n] mins ago` | `5 mins ago` |
| Relative (< 24 hours) | `[n] hrs ago` | `3 hrs ago` |
| Relative (< 7 days) | `[n] days ago` | `2 days ago` |
| Relative (> 7 days) | Switch to absolute | `15 Jun, 10:24 AM` |
| Date picker input | `DD / MM / YYYY` | `15 / 06 / 2026` |
| Export file names | `YYYY-MM-DD` | `2026-06-15-orders.csv` |
| Activity log | `DD MMM YYYY, HH:MM:SS AM/PM` | `15 Jun 2026, 10:24:38 AM` |

### 34.2 Number & Currency Formats

| Context | Format | Example |
|---|---|---|
| Currency (< ₹1,000) | `₹XXX` | `₹399` |
| Currency (₹1,000–₹99,999) | `₹X,XXX` | `₹1,248` |
| Currency (₹1,00,000+) | Indian system | `₹4,82,340` |
| Large currency (KPI) | `₹X.XXL` abbreviated | `₹4.8L` |
| Percentage | `XX.X%` | `18.4%` |
| Percentage delta positive | `↑ +XX.X%` in green | `↑ +18.4%` |
| Percentage delta negative | `↓ −XX.X%` in red | `↓ −2.1%` |
| Integer counts | Indian system commas | `14,821` |
| Large counts (KPI) | Abbreviated `14.8K` | `14.8K` |
| Decimal precision | Max 1 decimal in UI; 2 in exports | `4.8` rating |
| Stock levels | Integer, no decimals | `234 units` |
| Order IDs | Monospace, `#ORD-XXXX` | `#ORD-4821` |
| SKUs | Monospace, uppercase | `SKU-MM-001` |
| Tracking numbers | Monospace | `SR-8821-43XY` |
| API keys | Monospace, masked | `sk_live_••••••••4821` |

### 34.3 Timestamp Tooltip Rule

For all relative timestamps, show the absolute timestamp in a tooltip on hover:

```
"5 mins ago" → tooltip: "15 Jun 2026, 10:24:38 AM"
```

`aria-label` on the `<time>` element must include the absolute value:
`<time datetime="2026-06-15T10:24:38+05:30" aria-label="June 15 2026 at 10:24 AM">5 mins ago</time>`

---

## 35. Empty States — Full Specification

Every list/table/chart must define a specific empty state. Generic `"No data"` messages are prohibited.

### 35.1 Empty State Anatomy

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│              [Icon  64×64px]                        │
│                                                     │
│           No orders found                           │
│     Try adjusting your filters or search            │
│     terms to find what you're looking for.          │
│                                                     │
│        [ Clear Filters ]  [ Create Order ]          │
│                                                     │
└─────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Icon | `64×64px` SVG, `admin.text-muted` @ 30%, thematic (box for orders, leaf for products, etc.) |
| Heading | `font.size.3xl`, weight 600, `admin.text` |
| Body | `font.size.sm`, `admin.text-muted`, max-width `360px`, centred |
| CTA | Secondary + Primary buttons (context-dependent) |
| Alignment | Centred in table/chart container |
| Min-height | `240px` for the empty region |

### 35.2 Module Empty States

| Module | Icon | Heading | Body | CTAs |
|---|---|---|---|---|
| Orders — no results | 📭 | `"No orders found"` | `"Try adjusting your filters."` | `[Clear Filters]` |
| Orders — first order | 📦 | `"No orders yet"` | `"Orders will appear here once customers start shopping."` | `[View Storefront →]` |
| Products — no results | 🌿 | `"No products found"` | `"Try a different search term or clear filters."` | `[Clear Filters]` `[+ Add Product]` |
| Products — empty store | 🌱 | `"No products yet"` | `"Add your first product to start selling."` | `[+ Add Product]` |
| Customers — no results | 👥 | `"No customers found"` | `"Try adjusting your search or filters."` | `[Clear Filters]` |
| Inventory — no alerts | ✅ | `"All stock levels healthy"` | `"No products are below their reorder levels."` | — |
| Reviews — pending queue | ⭐ | `"No reviews pending"` | `"All reviews have been moderated."` | `[View All Reviews]` |
| Garden bookings — empty | 🌺 | `"No bookings today"` | `"Upcoming garden service bookings will appear here."` | `[View All Bookings]` |
| AI Care — no queries | 🤖 | `"No queries yet"` | `"AI Care queries will appear here once customers use the feature."` | — |
| Activity log — no entries | 📋 | `"No activity recorded"` | `"Admin actions will be logged here automatically."` | — |
| Analytics chart — no data | 📊 | `"No data for this period"` | `"Try selecting a different date range."` | `[Change Date Range]` |
| Discounts — empty | 🎟️ | `"No discounts created"` | `"Create your first discount to offer deals to customers."` | `[+ Create Discount]` |
| Notifications — empty | 🔔 | `"You're all caught up"` | `"No new notifications."` | — |

---

## 36. SEO & Meta for Admin Pages

All admin pages must be fully excluded from indexing.

### 36.1 Meta Tags (All Admin Pages)

| Tag | Value |
|---|---|
| `robots` | `noindex, nofollow` |
| `X-Robots-Tag` (HTTP header) | `noindex, nofollow` |
| `canonical` | None |
| `og:*` | None |
| `<title>` | `[Page Name] · Hero Admin` |
| `meta theme-color` | `#0f1117` |

### 36.2 Admin Page Titles

| Page | `<title>` |
|---|---|
| Dashboard | `Dashboard · Hero Admin` |
| Orders | `Orders · Hero Admin` |
| Order detail | `Order #ORD-4821 · Hero Admin` |
| Products | `Products · Hero Admin` |
| Product edit | `Edit: Monstera Deliciosa · Hero Admin` |
| Customers | `Customers · Hero Admin` |
| Inventory | `Inventory · Hero Admin` |
| Analytics | `Analytics · Hero Admin` |
| Garden Services | `Garden Services · Hero Admin` |
| AI Care | `AI Care Usage · Hero Admin` |
| Settings | `Settings · Hero Admin` |
| Activity Log | `Activity Log · Hero Admin` |
| Login | `Sign In · Hero Admin` |

### 36.3 `robots.txt` Entry

```
User-agent: *
Disallow: /admin/
Disallow: /admin/login
```

### 36.4 Subdomain Strategy (Recommended)

Host admin on `admin.heroplants.com` (separate subdomain), not `/admin` of main domain. Benefits:
- Completely separate from storefront SEO
- Different CSP headers
- Independent deployment and caching
- No risk of admin routes leaking into sitemap

---

## 37. Internationalisation (i18n) — Admin

The admin dashboard defaults to English. It is not user-facing to customers, so full multi-language support is lower priority. However, Indian number and currency formatting must be applied.

### 37.1 Number & Currency Rules

All the same rules as §34.2.

### 37.2 Admin i18n Key Sample

```json
{
  "admin.nav.dashboard": "Dashboard",
  "admin.nav.orders": "Orders",
  "admin.nav.products": "Products",
  "admin.nav.customers": "Customers",
  "admin.nav.analytics": "Analytics",
  "admin.nav.inventory": "Inventory",
  "admin.nav.garden_services": "Garden Services",
  "admin.nav.ai_care": "AI Care Usage",
  "admin.nav.discounts": "Discounts & Coupons",
  "admin.nav.reviews": "Reviews",
  "admin.nav.staff": "Staff & Permissions",
  "admin.nav.settings": "Store Settings",
  "admin.nav.activity_log": "Activity Log",
  "admin.table.no_results": "No {{entity}} found",
  "admin.table.selected": "{{count}} selected",
  "admin.table.showing": "Showing {{from}}–{{to}} of {{total}}",
  "admin.action.save": "Save Changes",
  "admin.action.cancel": "Cancel",
  "admin.action.delete": "Delete",
  "admin.action.export": "Export CSV",
  "admin.action.create": "+ New {{entity}}",
  "admin.confirm.delete": "Delete {{entity}}?",
  "admin.confirm.delete_body": "This action cannot be undone.",
  "admin.confirm.bulk_delete": "Delete {{count}} {{entity}}? This cannot be undone.",
  "admin.status.active": "Active",
  "admin.status.draft": "Draft",
  "admin.status.archived": "Archived",
  "admin.status.delivered": "Delivered",
  "admin.status.processing": "Processing",
  "admin.status.shipped": "Shipped",
  "admin.status.cancelled": "Cancelled",
  "admin.status.returned": "Returned",
  "admin.toast.saved": "Changes saved successfully.",
  "admin.toast.deleted": "{{entity}} deleted.",
  "admin.toast.error": "Something went wrong. Please try again.",
  "admin.toast.exported": "Export ready. Check your email.",
  "admin.session.expiring": "Your session will expire in 5 minutes.",
  "admin.session.expired": "You've been signed out due to inactivity."
}
```

---

## 38. Final Summary — Complete Module & Section Map

```
Hero Plant Store Admin Dashboard — v1.0
Complete Design Specification
═══════════════════════════════════════════════════════════════════
CORE SPEC (§1–§28)

§1   Context & Goals (roles, surface, page density)
§2   Design Tokens (Color × 40 tokens, Typography × 25 roles,
     Spacing × 13 steps, Radius × 6, Shadow × 4, Motion × 4,
     Contrast audit)
§3   Page Layout & Navigation Structure (shell, z-index scale)
§4   Top Bar (logo, global search + modal, notifications, user menu)
§5   Left Sidebar (shell, navigation structure, nav item states,
     badges, collapsed mode)
§6   Dashboard Overview (page header, 8 KPI cards, revenue chart,
     recent orders, low stock alerts, category donut, bookings)
§7   Shared Admin Components
     • Data Table (header, body, toolbar, bulk actions, pagination,
       empty state, virtual scroll, full ARIA)
     • Admin Form Components (input, textarea, select, checkbox,
       toggle, date picker — all 7 states each)
     • Admin Buttons (primary, secondary, danger, ghost — 3 sizes)
     • Status Badge (7 variants)
     • Modal / Drawer (confirmation, alertdialog, right-side drawer)
     • Toast (4 variants)
     • Tooltip
     • Filter Panel (drawer)
§8   Orders Module (list, detail, fulfilment update, admin notes)
§9   Products Module (list, edit/create, variants, media, SEO,
     care info, rich text editor, sticky save bar)
§10  Customers Module (list, detail, loyalty points adjust)
§11  Inventory Module (list, stock adjustment modal, history)
§12  Analytics Module (5 sections, chart toolbar, data tables)
§13  Garden Services Module (bookings list/detail, gardener mgmt)
§14  AI Care Module (usage dashboard, query log)
§15  Discounts & Coupons Module (list, create form)
§16  Reviews Module (list, moderation, reply)
§17  Staff & Permissions (list, role badges, permission matrix)
§18  Settings Module (navigation, store details, integrations)
§19  Activity Log (table, action diff drawer)
§20  Accessibility Requirements (contrast audit, focus management,
     full ARIA map × 35, keyboard map × 15 keys, 15 testable
     criteria, reduced motion)
§21  Security & Auth (authentication rules, route guards × 7 roles,
     data handling)
§22  Performance Specification (5 metrics, virtualisation,
     lazy loading, chart strategy)
§23  Analytics & Tracking — Internal (15 events)
§24  Anti-Patterns & Prohibited Implementations (× 20)
§25  Edge-Case Handling (× 17 scenarios)
§26  Responsive Behaviour (5 breakpoints)
§27  Page Sections — Full Module Map
§28  QA Checklist (× 55 checkboxes: Visual, Interaction,
     Accessibility, Security, Performance, Content)

EXTENDED IMPLEMENTATION GUIDE (§29–§38)

§29  Authentication & Session Flows (login page, MFA flow,
     password reset, session state handling × 6 states)
§30  Shopify Admin API Integration (17 endpoints, 8 webhook
     subscriptions, rate limiting strategy, data sync strategy)
§31  Component Migration Notes (token priority P0–P3,
     20 raw values to replace, shared vs admin-exclusive registry)
§32  Keyboard Shortcuts Reference (global, table, form shortcuts;
     help modal spec)
§33  Component State Master Table (55 components × 8 states each)
§34  Date, Time & Number Formatting Standards (date formats × 9,
     number/currency formats × 12, tooltip rule)
§35  Empty States — Full Specification (anatomy, 13 module-specific
     empty states)
§36  SEO & Meta for Admin Pages (noindex rules, page titles × 13,
     robots.txt, subdomain strategy)
§37  Internationalisation (number rules, i18n key sample × 35 keys)
§38  Final Summary — Complete Module & Section Map (this section)

═══════════════════════════════════════════════════════════════════
Total: ~3,100 lines | 38 sections | 18 modules
Guideline standard: WCAG 2.2 AA | Admin dark token system
Companion documents: Homepage · PLP · PDP · AI Care · Garden
Services · Profile · Order Tracking · Master design-system.md
Last updated: June 2026
═══════════════════════════════════════════════════════════════════
```

---

*Document version: 1.0 (complete) — Admin Dashboard*
*Sections: 1–28 (core spec) + 29–38 (extended implementation guide)*
*Guideline standard: WCAG 2.2 AA | Token system: Outfit / Admin dark token set*
*Companion documents: Homepage design.md · PLP design.md · PDP design.md · AI Care design.md · Garden Services design.md · Profile design.md · Order Tracking design.md · design-system.md*
*Last updated: June 2026*
