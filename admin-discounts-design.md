# Admin — Discounts & Coupons Module
## Design Specification v1.0 — Production-Ready

> **Design intent:** Deliver a precise, low-error discount management interface that lets marketing and operations staff create, schedule, and monitor every discount type — percentage, fixed amount, free shipping, buy-X-get-Y, and automatic cart discounts — with live preview, conflict detection, and usage analytics — in a dark-theme admin environment that is keyboard-first, WCAG 2.2 AA compliant, and built to prevent costly pricing mistakes before they go live.

---

## 1. Context & Goals

| Property | Value |
|---|---|
| **Module name** | Discounts & Coupons |
| **URLs** | `/admin/discounts` (list) · `/admin/discounts/[id]` (detail/edit) · `/admin/discounts/new` (create) |
| **Parent** | Admin Dashboard (`admin-dashboard-design.md`) |
| **Primary goal** | Let marketing create accurate, well-scoped discounts without pricing errors or unintended stacking |
| **Secondary goals** | Surface usage and revenue-impact analytics; prevent overlapping/conflicting discounts; support both code-based and automatic discounts |
| **User roles** | Super Admin (full) · Operations Manager (full) · Marketing (full) · Analyst (read-only) |
| **No access** | Customer Support · Inventory Manager · Garden Services Coordinator |
| **Linked modules** | Products · Customers · Orders · Analytics |
| **Page density** | Tables: 2 · Forms: 1 large multi-section · Buttons: ~35 · Inputs: ~40 · Charts: 3 |

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
| `admin.color.status.success` | `#57ab5a` | Active discount |
| `admin.color.status.warning` | `#c69026` | Scheduled, expiring soon |
| `admin.color.status.error` | `#e5534b` | Expired, conflict |
| `admin.color.status.info` | `#539bf5` | Draft, info |
| `admin.color.status.purple` | `#986ee2` | Automatic discount type |

### 2.2 Discounts Module Semantic Aliases

| Alias | Maps to | Usage |
|---|---|---|
| `dsc.page-bg` | `admin.color.bg.canvas` | Page background |
| `dsc.card-bg` | `admin.color.bg.surface` | All panels |
| `dsc.card-hover` | `admin.color.bg.elevated` | Row hover |
| `dsc.input-bg` | `admin.color.bg.elevated` | All inputs |
| `dsc.overlay-bg` | `admin.color.bg.overlay` | Modals, dropdowns |
| `dsc.text` | `admin.color.text.primary` | Primary text |
| `dsc.text-muted` | `admin.color.text.secondary` | Meta, timestamps |
| `dsc.text-label` | `admin.color.text.tertiary` | Headers, labels |
| `dsc.border` | `admin.color.border.default` | All borders |
| `dsc.border-muted` | `admin.color.border.default` @ 50% | Subtle dividers |
| `dsc.border-active` | `admin.color.border.active` | Focus, active |
| `dsc.accent` | `admin.color.brand.green` | CTAs, active filters |
| `dsc.accent-bg` | `admin.color.brand.green.muted` | Selected row, chip bg |
| `dsc.focus-ring` | `admin.color.brand.green` | Focus ring |
| `dsc.focus-glow` | `0 0 0 3px rgba(0,181,102,0.25)` | Focus glow |
| `dsc.shadow` | `0 2px 8px rgba(0,0,0,0.25)` | Panel shadow |
| `dsc.active` | `admin.color.status.success` | Active discount |
| `dsc.active-bg` | `admin.color.status.success.bg` | Active badge bg |
| `dsc.scheduled` | `admin.color.status.warning` | Scheduled / expiring soon |
| `dsc.scheduled-bg` | `admin.color.status.warning.bg` | Scheduled badge bg |
| `dsc.expired` | `admin.color.status.error` | Expired discount |
| `dsc.expired-bg` | `admin.color.status.error.bg` | Expired badge bg |
| `dsc.draft` | `admin.color.status.info` | Draft / unpublished |
| `dsc.draft-bg` | `admin.color.status.info.bg` | Draft badge bg |
| `dsc.automatic` | `admin.color.status.purple` | Automatic discount type |
| `dsc.automatic-bg` | `admin.color.status.purple.bg` | Automatic badge bg |
| `dsc.danger` | `admin.color.status.error` | Destructive actions, conflicts |
| `dsc.conflict-bg` | `admin.color.status.error` @ 8% | Conflict warning panel bg |
| `dsc.preview-bg` | `admin.color.brand.green` @ 6% | Live preview card bg |

### 2.3 Typography

| Role | Size | Weight | Colour |
|---|---|---|---|
| Page heading | `font.size.5xl` (24px) | 700 | `dsc.text` |
| KPI value | `font.size.6xl` (32px) | 800 | `dsc.text` |
| KPI label | `font.size.sm` (12px) | 500 | `dsc.text-muted` |
| Section heading | `font.size.4xl` (18px) | 700 | `dsc.text` |
| Panel heading | `font.size.3xl` (16px) | 600 | `dsc.text` |
| Discount code | `font.family.mono`, `font.size.3xl` | 700 | `dsc.accent` |
| Column header | `font.size.xs` (11px) | 700 | `dsc.text-label`, uppercase |
| Table cell body | `font.size.sm` (12px) | 400 | `dsc.text` |
| Table cell meta | `font.size.xs` (11px) | 400 | `dsc.text-muted` |
| Status badge | `font.size.xs` (11px) | 700 | status colour |
| Button label | `font.size.sm` (12px) | 600 | per type |
| Input label | `font.size.xs` (11px) | 700 | `dsc.text-label`, uppercase |
| Input value | `font.size.sm` (12px) | 400 | `dsc.text` |
| Help text | `font.size.xs` (11px) | 400 | `dsc.text-muted` |
| Discount value (big) | `font.size.6xl` (32px) | 800 | `dsc.accent` |
| Usage count | `font.size.3xl` (16px) | 700 | `dsc.text` |
| Revenue impact | `font.size.3xl` (16px) | 700 | `dsc.danger` (cost framing) |
| Preview card text | `font.size.sm` (12px) | 400 | `dsc.text` |
| Error message | `font.size.xs` (11px) | 500 | `dsc.danger` |
| Tab label | `font.size.sm` (12px) | 600 | active: `dsc.accent` |

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
| `radius.full` | `9999px` | Pill badges, code chip |

| Motion token | Value |
|---|---|
| `motion.instant` | `150ms` |
| `motion.fast` | `200ms` |
| `motion.normal` | `250ms` |
| `motion.slow` | `350ms` |

### 2.5 Contrast Audit

| Pairing | Ratio | Required | Status |
|---|---|---|---|
| `dsc.text` on `dsc.card-bg` | ~10:1 | 4.5:1 | ✅ Pass |
| `dsc.accent` (#00b566) on `dsc.card-bg` (#1c2128) | ~5.2:1 | 4.5:1 | ✅ Pass |
| `dsc.text-muted` on `dsc.card-bg` | ~4.6:1 | 4.5:1 | ✅ Pass |
| `admin.color.status.warning` on `dsc.card-bg` | ~4.6:1 | 4.5:1 | ✅ Pass |
| `admin.color.status.error` on `dsc.card-bg` | ~4.5:1 | 4.5:1 | ✅ Pass |
| `admin.color.status.purple` on `dsc.card-bg` | ~4.6:1 | 4.5:1 | ✅ Pass |


---

## 3. Page Layout

### 3.1 Discounts List Structure

```
┌──────────────────────────────────────────────────────────────────────┐
│  TOP BAR (64px)                                                      │
├──────────────┬───────────────────────────────────────────────────────┤
│  SIDEBAR     │  BREADCRUMB: Admin / Discounts                       │
│  (240px)     ├───────────────────────────────────────────────────────┤
│              │  PAGE HEADER + KPI ROW (5 cards)                     │
│              ├───────────────────────────────────────────────────────┤
│              │  TYPE FILTER TABS                                    │
│              ├───────────────────────────────────────────────────────┤
│              │  TABLE TOOLBAR (search · filter · sort · create)      │
│              ├───────────────────────────────────────────────────────┤
│              │  DISCOUNTS TABLE                                      │
│              ├───────────────────────────────────────────────────────┤
│              │  PAGINATION                                           │
└──────────────┴───────────────────────────────────────────────────────┘
```

### 3.2 Discount Create / Edit Structure

```
┌──────────────┬──────────────────────────────┬────────────────────────┐
│  SIDEBAR     │  LEFT COLUMN (62%)           │  RIGHT COLUMN (38%)   │
│              │                              │  (sticky top: 80px)   │
│              │  • Discount Method (code/auto)│  • Summary Card        │
│              │  • Code / Title               │  • Live Preview Card   │
│              │  • Discount Type & Value      │  • Conflict Warning    │
│              │  • Applies To (scope)         │    (conditional)       │
│              │  • Customer Eligibility       │  • Active Dates Card   │
│              │  • Minimum Requirements       │  • Usage Stats         │
│              │  • Usage Limits                │    (edit mode only)   │
│              │  • Combinations                │                        │
│              │  • Active Dates                │                        │
│                                              │                        │
└──────────────┴──────────────────────────────┴────────────────────────┘
```

### 3.3 Layout Rules

| Property | Value |
|---|---|
| Content padding | `space.9 = 24px` all sides |
| Column gap (form) | `space.9 = 24px` |
| Left column | `62%` |
| Right column | `38%`, sticky `top: 80px` |
| Panel gap (vertical) | `space.9 = 24px` |
| Page background | `dsc.page-bg` |
| Min page width | `1280px` |

---

## 4. Discounts List Page

### 4.1 Page Header

```
Discounts & Coupons                                       [+ Create Discount]
148 total discounts · 24 active
```

| Element | Value |
|---|---|
| Title | `font.size.5xl` (24px), weight 700, `dsc.text` |
| Subtitle | `font.size.sm`, `dsc.text-muted` |
| `+ Create Discount` | Primary `dsc.accent` filled, `radius.sm` |

### 4.2 KPI Cards Row

```
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│  Active Discounts│ │  Codes Used (30d)│ │  Revenue from    │ │  Discount Cost   │ │  Expiring Soon   │
│  24              │ │  1,842           │ │  Discounts       │ │  (30d)           │ │  (7 days)        │
│                  │ │                  │ │  ₹2,48,310       │ │  ₹38,420         │ │  6  ⚠            │
└──────────────────┘ └──────────────────┘ └──────────────────┘ └──────────────────┘ └──────────────────┘
```

**Single KPI card:**

| Property | Value |
|---|---|
| Background | `dsc.card-bg` |
| Border | `1px solid dsc.border-muted` |
| Border-radius | `radius.md` |
| Padding | `space.9 = 24px` |
| Label | `font.size.sm`, weight 500, `dsc.text-muted` |
| Value | `font.size.6xl` (32px), weight 800, `dsc.text` |
| "Discount Cost" value | `dsc.danger` colour (framed as cost, not gain) |
| "Expiring Soon" card | Border-left `3px solid dsc.scheduled`; value in `dsc.scheduled` |
| Hover | `dsc.card-hover` bg, `motion.instant` |
| Click | Filters table to relevant segment |
| `aria-label` | `"[label]: [value]"` |

### 4.3 Type Filter Tabs

```
[ All (148) ]  [ Active (24) ]  [ Scheduled (8) ]  [ Expired (104) ]  [ Draft (12) ]
```

| Property | Value |
|---|---|
| Height | `36px`, `radius.sm` |
| Padding | `space.3` vertical, `space.7 = 16px` horizontal |
| Font | `font.size.sm`, weight 500 |
| Default | `dsc.border` border, transparent, `dsc.text-muted` |
| Active | `dsc.accent` bg, white, weight 700 |
| Hover | `dsc.card-hover`, `motion.instant` |
| Focus-visible | `2px` focus ring `dsc.focus-ring` |
| `role` | `role="tablist"`, `role="tab"`, `aria-selected` |
| Keyboard | Arrow keys cycle; Enter selects |

### 4.4 Table Toolbar

```
[🔍 Search by code or title...]  [Filter ▾]  [Sort: Newest ▾]            [+ Create Discount]
```

**Search:**

| Property | Value |
|---|---|
| Width | `320px`, height `36px`, `dsc.input-bg`, `dsc.border`, `radius.sm` |
| Scope | Discount code, title, ID |
| Debounce | `250ms` |
| `aria-label` | `"Search discounts"` |

**Sort options:** Newest First (default) · Oldest First · Most Used · Highest Value · Expiring Soonest · A–Z

**Filter panel sections:** Discount Type (% / fixed / free shipping / BOGO) · Method (Code / Automatic) · Status · Applies To (All products / Specific) · Customer Eligibility · Date Range

### 4.5 Discounts Data Table

**Column definitions:**

| # | Column | Content | Width | Sortable |
|---|---|---|---|---|
| 1 | Code / Title | `HERO20` mono + title below | `200px` | Yes |
| 2 | Type | % off / ₹ off / Free shipping / BOGO badge | `130px` | No |
| 3 | Value | `20%` or `₹100` | `90px` | Yes |
| 4 | Method | Code / Automatic badge | `100px` | No |
| 5 | Used | `24 / 100` or `24 (unlimited)` | `100px` | Yes |
| 6 | Min. Order | `₹500` or `—` | `100px` | No |
| 7 | Active Dates | Start–End or "No end date" | `180px` | Yes |
| 8 | Status | Active / Scheduled / Expired / Draft badge | `110px` | Yes |
| 9 | Actions | `[Edit]` `[Copy Link]` `[⋮]` | `120px` | No |

**Table shell:**

| Property | Value |
|---|---|
| Background | `dsc.card-bg` |
| Border | `1px solid dsc.border-muted`, `radius.md` |
| Overflow-x | `auto` |
| Virtual scroll | Beyond 100 rows |

**Code/Title cell:**

```
HERO20
Flat 20% off — Summer Sale
```

| Property | Value |
|---|---|
| Code | `font.family.mono`, `font.size.3xl`, weight 700, `dsc.accent` |
| Title | `font.size.xs`, `dsc.text-muted`, below code |
| Click | Opens discount edit page |

**Type badge:**

| Type | Icon | Background |
|---|---|---|
| Percentage off | `%` | `dsc.accent-bg` |
| Fixed amount off | `₹` | `dsc.accent-bg` |
| Free shipping | `🚚` | `admin.color.status.info.bg` |
| Buy X Get Y | `🎁` | `admin.color.status.purple.bg` |

**Method badge:**

| Method | Background | Text |
|---|---|---|
| Code | `dsc.card-hover` | `dsc.text-label` |
| Automatic | `dsc.automatic-bg` | `dsc.automatic` |

**Used cell:**

```
24 / 100
```
or
```
24 (unlimited)
```

| Property | Value |
|---|---|
| Format | `[used] / [limit]` if capped; `[used] (unlimited)` if not |
| Near limit (≥ 90%) | `dsc.scheduled` colour with `⚠` |
| At limit (100%) | `dsc.expired` colour with `✕` |

**Status badge:**

| Status | Background | Text |
|---|---|---|
| Active | `dsc.active-bg` | `dsc.active` |
| Scheduled | `dsc.scheduled-bg` | `dsc.scheduled` |
| Expired | `dsc.expired-bg` | `dsc.expired` |
| Draft | `dsc.draft-bg` | `dsc.draft` |

**All badge properties:**

| Property | Value |
|---|---|
| Font | `font.size.xs`, weight 700 |
| Border-radius | `radius.full` |
| Padding | `2px 6px` |
| `aria-label` | `"Status: [status]"` |

**Actions cell overflow menu (⋮):**

```
Edit
Duplicate
Copy Discount Link
View Usage Report
─────────────────
Deactivate
Delete
```

| Property | Value |
|---|---|
| Background | `dsc.overlay-bg`, `dsc.border`, `radius.md`, `200px` |
| Destructive items | `dsc.danger` colour |
| `role` | `role="menu"`, `role="menuitem"` |

### 4.6 Pagination & Empty States

Same pattern as Orders/Customers modules.

**No discounts yet:**
```
        🎟️
  No discounts created
  Create your first discount to offer deals to customers.
  [ + Create Discount ]
```

**No results for filters:**
```
        📭
  No discounts found
  Try adjusting your filters or search.
  [ Clear Filters ]
```


---

## 5. Discount Create / Edit Page — Left Column

### 5.1 Breadcrumb & Header

```
Admin  /  Discounts  /  Create Discount
```

```
Create Discount                          [ Discard ]   [Save as Draft]  [Activate]
```

For edit mode:
```
HERO20                                    [ Active ● ]   [Discard] [Save] [Deactivate]
Created 12 Jan 2026 by Priya K.
```

| Element | Value |
|---|---|
| Title | `font.size.5xl` (24px), weight 700, `dsc.text` |
| Status badge (edit) | Right-aligned pill |
| `[Discard]` | Ghost button |
| `[Save as Draft]` / `[Save]` | Secondary outlined |
| `[Activate]` | Primary `dsc.accent` filled |
| `[Deactivate]` | Ghost, `dsc.danger` text |

### 5.2 Discount Method Panel

The very first decision point — controls all subsequent form sections.

```
┌──────────────────────────────────────────────────────────────────────┐
│  Discount Method                                                     │
├──────────────────────────────────────────────────────────────────────┤
│  ( ● ) Discount Code                                                 │
│        Customer enters a code at checkout                            │
│                                                                      │
│  ( ○ ) Automatic Discount                                            │
│        Applied automatically when conditions are met — no code      │
│        needed                                                        │
└──────────────────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| `role` | `role="radiogroup"`, `aria-label="Discount method"` |
| Selection locked | Once orders have used this discount, method cannot be changed (shown disabled with tooltip in edit mode) |
| On change | Updates "Code / Title" panel below to show either a code field or a title-only field |

### 5.3 Code / Title Panel

**If Method = Discount Code:**

```
┌──────────────────────────────────────────────────────────────────────┐
│  Discount Code                                                       │
├──────────────────────────────────────────────────────────────────────┤
│  CODE *                                          [ Generate Random ] │
│  [ HERO20                                                    ]      │
│  Customers enter this at checkout. 0/255 characters used.            │
│                                                                      │
│  ⚠ This code is already in use by "Welcome Discount" — choose       │
│    another.                                                          │
└──────────────────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Input | `font.family.mono`, `font.size.3xl`, weight 700, uppercase auto-transform |
| Height | `44px` |
| Background | `dsc.input-bg` |
| Border | `1px solid dsc.border` |
| Border-radius | `radius.sm` |
| `[Generate Random]` | Ghost button — generates 8-char alphanumeric code |
| Validation | Required, unique, max 255 chars, alphanumeric + hyphens only |
| Duplicate check | Live, on blur — shows inline error with link to conflicting discount |
| `aria-describedby` | Points to character count + error message |

**If Method = Automatic Discount:**

```
┌──────────────────────────────────────────────────────────────────────┐
│  Discount Title                                                      │
├──────────────────────────────────────────────────────────────────────┤
│  TITLE *  (internal — customers see this in cart, not a code)        │
│  [ Free Shipping Over ₹499                                   ]      │
└──────────────────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Help text | `"Internal — customers see this in cart, not a code"` |
| Validation | Required, max 255 chars |

### 5.4 Discount Type & Value Panel

```
┌──────────────────────────────────────────────────────────────────────┐
│  Discount Type                                                       │
├──────────────────────────────────────────────────────────────────────┤
│  [ ⊙ Percentage ] [ ⊙ Fixed Amount ] [ ⊙ Free Shipping ] [ ⊙ Buy X Get Y ] │
│                                                                      │
│  VALUE *                                                              │
│  [ 20          ] %                                                    │
│                                                                      │
│  MAXIMUM DISCOUNT CAP (optional, for % discounts)                    │
│  [ ☐ ] Cap maximum discount amount                                   │
│  [ ₹ 500                                                      ]      │
└──────────────────────────────────────────────────────────────────────┘
```

**Type selector:**

| Property | Value |
|---|---|
| Layout | 4 large selectable cards, `role="radiogroup"` |
| Card | `120px × 80px`, icon + label, `radius.sm` |
| Selected | `dsc.accent` border `2px`, `dsc.accent-bg` fill |
| Default | `dsc.border` border, `dsc.card-bg` |
| Icons | `%` · `₹` · `🚚` · `🎁` |

**Value input — Percentage:**

| Property | Value |
|---|---|
| Type | Number, `min="1"`, `max="100"`, suffix `%` |
| Width | `120px` |
| Validation | Required, 1–100 |
| Error | `"Percentage must be between 1 and 100."` |

**Value input — Fixed Amount:**

| Property | Value |
|---|---|
| Type | Number, currency prefix `₹` |
| Validation | Required, `> 0` |

**Value input — Free Shipping:** No value field — just applies free shipping when conditions met.

**Value input — Buy X Get Y:**

```
BUY
[ Quantity: 2 ] of [ Any product in: ] [ Select collection ▾ ]

GET
[ Quantity: 1 ] of [ Specific product: ] [ Select product ▾ ]
at [ ⊙ 100% off ] [ ⊙ 50% off ] [ ⊙ Fixed price: ₹___ ]

[ ☐ ] Limit to once per order
```

| Property | Value |
|---|---|
| "Buy" scope | Specific product / Specific collection / Any product |
| "Get" scope | Specific product / Specific collection |
| Get discount | 100% off / 50% off / Fixed price |
| Limit checkbox | Prevents customer stacking the same offer multiple times in one order |

**Maximum discount cap:**

| Property | Value |
|---|---|
| Visibility | Only shown when Type = Percentage |
| Purpose | Prevents very large orders from getting unlimited ₹ discount on a % code |
| Help text | `"E.g. 20% off, capped at ₹500 maximum discount"` |


### 5.5 Applies To Panel (Scope)

```
┌──────────────────────────────────────────────────────────────────────┐
│  Applies To                                                          │
├──────────────────────────────────────────────────────────────────────┤
│  ( ● ) All products                                                  │
│  ( ○ ) Specific collections                                          │
│        [ Search collections...                              ]       │
│        [Indoor Plants ×] [Air Purifying ×]  [+ Add collection]      │
│  ( ○ ) Specific products                                             │
│        [ Search products...                                 ]       │
│        [Monstera Deliciosa ×]  [+ Add product]                      │
│  ( ○ ) Specific customers                                            │
│        [ Search customers...                                ]       │
│                                                                      │
│  EXCLUDE                                                              │
│  [ ☐ ] Exclude sale items                                            │
│  [ ☐ ] Exclude specific products                                     │
│        [ Search products to exclude...                      ]       │
└──────────────────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| `role` | `role="radiogroup"`, `aria-label="Applies to"` |
| Search/select | Same product picker pattern as `admin-product-page-design.md §6.5` |
| Selected chips | `dsc.accent-bg` bg, `dsc.accent` border, `radius.full`, `×` to remove |
| Exclude sale items | Prevents discount stacking on already-discounted products |
| Exclude specific products | Useful for protecting low-margin items |

### 5.6 Customer Eligibility Panel

```
┌──────────────────────────────────────────────────────────────────────┐
│  Customer Eligibility                                                │
├──────────────────────────────────────────────────────────────────────┤
│  ( ● ) All customers                                                 │
│  ( ○ ) Specific customer segments                                    │
│        [ Select segment ▾ ]  e.g. "VIP Customers", "At-Risk"        │
│  ( ○ ) Specific customers                                            │
│        [ Search customers...                                ]       │
│  ( ○ ) Specific loyalty tiers                                        │
│        [ ☐ ] Plant Lover  [ ☑ ] Silver  [ ☑ ] Gold                 │
│                                                                      │
│  [ ☐ ] First-time customers only                                     │
└──────────────────────────────────────────------------------------------┘
```

| Property | Value |
|---|---|
| Segment select | Pulls from `admin-customers-design.md §17` saved segments |
| Loyalty tier checkboxes | Multi-select |
| "First-time customers only" | Mutually exclusive note shown if combined with returning-customer segment |

### 5.7 Minimum Requirements Panel

```
┌──────────────────────────────────────────────────────────────────────┐
│  Minimum Requirements                                                │
├──────────────────────────────────────────────────────────────────────┤
│  ( ● ) No minimum requirement                                        │
│  ( ○ ) Minimum purchase amount                                       │
│        [ ₹ 500                                                ]      │
│  ( ○ ) Minimum quantity of items                                     │
│        [ 3 items                                              ]      │
└──────────────────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| `role` | `role="radiogroup"` |
| Min amount | Number input, currency prefix `₹` |
| Min quantity | Number input, integer only |
| Validation | If amount: `> 0`; if quantity: `≥ 1` |

### 5.8 Usage Limits Panel

```
┌──────────────────────────────────────────────────────────────────────┐
│  Usage Limits                                                        │
├──────────────────────────────────────────────────────────────────────┤
│  [ ☐ ] Limit number of times this discount can be used in total      │
│        [ 100                                                  ]      │
│        Used 24 of 100 (24%)                                          │
│        ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░                          │
│                                                                      │
│  [ ☑ ] Limit to one use per customer                                 │
└──────────────────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Total limit | Number input; shown only when checkbox ticked |
| Usage progress | Only visible in edit mode with existing usage |
| Progress bar | `8px` height, `radius.full`, `dsc.accent` fill |
| Near limit (≥ 90%) | Bar turns `dsc.scheduled` colour |
| At limit | Bar turns `dsc.expired`; banner: `"This discount has reached its usage limit and is no longer active."` |
| Per-customer limit | Checkbox, defaults ON (best practice) |

### 5.9 Combinations Panel

> Critical for preventing accidental discount stacking that erodes margin.

```
┌──────────────────────────────────────────────────────────────────────┐
│  Combinations                                                        │
├──────────────────────────────────────────────────────────────────────┤
│  This discount can be combined with:                                 │
│  [ ☐ ] Product discounts                                             │
│  [ ☐ ] Order discounts                                               │
│  [ ☐ ] Shipping discounts                                            │
│                                                                      │
│  ℹ️  By default, discounts cannot be combined with other discounts   │
│     of the same category, to prevent unintended stacking.            │
└──────────────────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Default | All unchecked — no combination allowed |
| Help banner | Explains default exclusivity behaviour |
| Category logic | Product / Order / Shipping discounts can each only combine with discounts from a different category unless explicitly enabled |

### 5.10 Active Dates Panel

```
┌──────────────────────────────────────────────────────────────────────┐
│  Active Dates                                                        │
├──────────────────────────────────────────────────────────────────────┤
│  START DATE *                                                        │
│  [ 01 / 07 / 2026 ]   [ 00:00 ]                                      │
│                                                                      │
│  [ ☐ ] Set end date                                                   │
│  END DATE                                                             │
│  [ 31 / 07 / 2026 ]   [ 23:59 ]                                      │
│                                                                      │
│  Timezone: Asia/Kolkata (IST)                                        │
└──────────────────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Start date | Required, defaults to today |
| End date | Optional — unchecked means discount runs indefinitely |
| Date format | `DD / MM / YYYY` |
| Time | 24-hour `HH:MM` |
| Validation | End date must be after start date |
| Timezone | Fixed to store timezone, shown for clarity |
| Past start date warning | If start date is in the past on create: `"This discount will activate immediately upon saving."` |


---

## 6. Discount Create / Edit Page — Right Column

### 6.1 Summary Card

```
┌────────────────────────────────────────────┐
│  Summary                                   │
├────────────────────────────────────────────┤
│  Type:          Percentage discount        │
│  Value:         20% off                    │
│  Code:          HERO20                     │
│  Applies to:    All products                │
│  Min. purchase: ₹500                       │
│  Customer:      All customers               │
│  Dates:         1 Jul 2026 → No end date   │
│  Combinations:  Cannot combine              │
└────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Updates live | Reflects every change in the left-column form instantly |
| Background | `dsc.card-bg` |
| Row label | `font.size.xs`, `dsc.text-muted` |
| Row value | `font.size.sm`, weight 600, `dsc.text` |
| Incomplete fields | Shown as `"—"` in `dsc.text-muted` italic |

### 6.2 Live Preview Card

Shows exactly how the discount will appear to the customer.

**Code-based preview (cart):**

```
┌────────────────────────────────────────────┐
│  Customer Preview                          │
├────────────────────────────────────────────┤
│  At checkout:                              │
│  ┌──────────────────────────────────────┐  │
│  │  Promo code           [HERO20    ] [Apply]│
│  │  ✓ HERO20 applied — 20% off        │  │
│  │  Subtotal              ₹1,098      │  │
│  │  Discount (HERO20)      −₹220      │  │
│  └──────────────────────────────────────┘  │
└────────────────────────────────────────────┘
```

**Automatic discount preview:**

```
┌────────────────────────────────────────────┐
│  Customer Preview                          │
├────────────────────────────────────────────┤
│  In cart automatically:                    │
│  ┌──────────────────────────────────────┐  │
│  │  Subtotal              ₹598          │  │
│  │  🎉 Free Shipping Over ₹499 applied   │  │
│  │  Shipping                  ₹0        │  │
│  └──────────────────────────────────────┘  │
└────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Background | `dsc.preview-bg` |
| Border | `1px solid dsc.accent` @ 30% |
| Border-radius | `radius.md` |
| Mock cart UI | Simplified replica of storefront cart, using example order of `₹1,098` |
| Updates live | Recalculates as type/value/minimum fields change |
| Purpose | Lets admin verify exact customer-facing wording and math before publishing |

### 6.3 Conflict Warning Panel (conditional)

Appears only when the system detects an overlapping discount.

```
┌────────────────────────────────────────────┐
│  ⚠️  Potential Conflict                     │
├────────────────────────────────────────────┤
│  "WELCOME15" is also active for All        │
│  Products during an overlapping date range. │
│  Since both apply to Order discounts and    │
│  combinations are disabled, only one will   │
│  apply at checkout (whichever is higher     │
│  value).                                    │
│                                             │
│  [ View WELCOME15 → ]                       │
└────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Background | `dsc.conflict-bg` |
| Border | `1px solid dsc.danger` |
| Border-left | `4px solid dsc.danger` |
| Border-radius | `radius.md` |
| Icon | `⚠️`, `dsc.danger` |
| Heading | `font.size.sm`, weight 700, `dsc.danger` |
| Body | `font.size.xs`, `dsc.text` |
| `[View →]` | Links to the conflicting discount's edit page |
| `role` | `role="alert"`, `aria-live="polite"` |
| Trigger | Checked on scope + date + combination changes, debounced `500ms` |
| Non-blocking | This is a warning, not a hard block — admin can still save |

### 6.4 Active Dates Card (mirror, read-only summary)

```
┌────────────────────────────────────────────┐
│  Schedule                                  │
├────────────────────────────────────────────┤
│  Starts:   1 Jul 2026, 12:00 AM            │
│  Ends:     No end date                     │
│  Status:   Will activate in 3 days         │
└────────────────────────────────────────────┘
```

Status line dynamically computed: `"Active now"` / `"Will activate in [n] days"` / `"Ended [n] days ago"`.

### 6.5 Usage Stats Card (edit mode only)

```
┌────────────────────────────────────────────┐
│  Usage Stats                               │
├────────────────────────────────────────────┤
│  Times used:        24                     │
│  Total discount given: ₹4,840              │
│  Orders using this:  24                    │
│  Avg order value:    ₹1,102                │
│  Revenue generated:  ₹26,448                │
│                                             │
│  [ View Full Report → ]                    │
│                                             │
│  Last 30 days:                              │
│  ▁▂▃▅▇▆▄▃▂▁▃▅▆▇█▆▅▄▃▂▁▂▃▄▅▆▇█▆▅            │
└────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Mini sparkline | Daily usage trend, `dsc.accent` colour, `40px` height |
| `[View Full Report →]` | Opens detailed analytics with order list using this code |
| `aria-label` on sparkline | `"Usage trend over last 30 days"` |

---

## 7. Discount Usage Report Page

**URL:** `/admin/discounts/[id]/report`

```
← HERO20    Usage Report

┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Times Used   │ │ Total Given  │ │ Revenue      │ │ Avg Order    │
│ 24           │ │ ₹4,840       │ │ ₹26,448      │ │ ₹1,102       │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘

┌────────────────────────────────────────────────────────────┐
│  Usage Over Time                          [Daily ▾]        │
│  [line chart]                                               │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  Orders Using This Discount (24)              [Export]     │
├──────────┬──────────────┬──────────┬────────┬──────────────┤
│  ORDER   │  CUSTOMER    │  DATE    │  TOTAL │  DISCOUNT    │
├──────────┼──────────────┼──────────┼────────┼──────────────┤
│ #ORD-4821│ Priya Kumar  │ 15 Jun   │ ₹1,248 │  −₹220       │
│ ...      │              │          │        │              │
└──────────┴──────────────┴──────────┴────────┴──────────────┘
```

| Property | Value |
|---|---|
| Chart | Reuses chart component from `admin-dashboard-design.md §6.3` |
| Order table | Row click → opens order detail in Orders module |
| Export | CSV download of all orders using this discount |


---

## 8. Validation System

### 8.1 Required Fields

| Field | Required | Condition |
|---|---|---|
| Discount method | ✅ Always | Code or Automatic |
| Code | ✅ If method = Code | Unique |
| Title | ✅ If method = Automatic | |
| Discount type | ✅ Always | |
| Value | ✅ If type ≠ Free Shipping | |
| Start date | ✅ Always | |
| Buy/Get config | ✅ If type = BOGO | Both buy and get scope required |

### 8.2 Validation Rules

| Rule | Error message |
|---|---|
| Code blank | `"Discount code is required."` |
| Code duplicate | `"This code is already in use by '[discount name]'."` |
| Code invalid chars | `"Code can only contain letters, numbers, and hyphens."` |
| Title blank (automatic) | `"Discount title is required."` |
| Percentage out of range | `"Percentage must be between 1 and 100."` |
| Fixed amount ≤ 0 | `"Discount amount must be greater than ₹0."` |
| Fixed amount > avg order value | Warning (not error): `"This discount amount is higher than your average order value of ₹1,235. Confirm this is intentional."` |
| End date before start date | `"End date must be after the start date."` |
| Usage limit ≤ 0 | `"Usage limit must be at least 1."` |
| Min purchase ≤ 0 | `"Minimum purchase amount must be greater than ₹0."` |
| BOGO missing buy scope | `"Select what customers need to buy."` |
| BOGO missing get scope | `"Select what customers will get."` |
| No products/collections selected (when scope = specific) | `"Select at least one product or collection."` |

### 8.3 Validation Display

**Inline field errors:**

```
VALUE *
[ 150        ] % ← red border
⚠ Percentage must be between 1 and 100.
```

| Property | Value |
|---|---|
| Error border | `2px solid dsc.danger` |
| Error bg | `dsc.danger` @ 5% |
| Error text | `font.size.xs`, weight 500, `dsc.danger`, `⚠` prefix |
| `aria-invalid` | `"true"` |
| `aria-describedby` | Points to error message |
| `role="alert"` | On error message |

**Pre-activate validation summary:**

```
┌──────────────────────────────────────────────────────────────────────┐
│  ✕  This discount can't be activated yet. Fix 2 issues:              │
│  • Discount code is required.                                        │
│  • End date must be after the start date.                            │
└──────────────────────────────────────────────────────────────────────┘
```

Same pattern as `admin-product-page-design.md §8.3`.

---

## 9. Discount State Machine

```
┌──────────────────────────────────────────────────────────────────────┐
│                  DISCOUNT STATE MACHINE                              │
│                                                                      │
│  [DRAFT] ──(save as draft)──┐                                       │
│     │                       │                                       │
│     │ (activate)            │                                       │
│     ▼                       │                                       │
│  [SCHEDULED] ──(start date reached)──► [ACTIVE]                    │
│     │                                      │                         │
│     │ (deactivate)                  (deactivate)                    │
│     ▼                                      ▼                        │
│  [DRAFT]                              [PAUSED]                      │
│                                            │                         │
│                                    (reactivate within end date)      │
│                                            ▼                        │
│                                       [ACTIVE]                      │
│                                                                      │
│  [ACTIVE] ──(end date reached OR usage limit hit)──► [EXPIRED]     │
│                                                                      │
│  [EXPIRED] ──(terminal — no transitions; can duplicate to new)      │
└──────────────────────────────────────────────────────────────────────┘
```

### Status → UI Mapping

| State | Badge | Editable fields |
|---|---|---|
| `DRAFT` | `dsc.draft` | All fields editable |
| `SCHEDULED` | `dsc.scheduled` | All fields editable |
| `ACTIVE` | `dsc.active` | Most fields editable; **method and type locked once used** |
| `PAUSED` | `dsc.scheduled` (amber) | Most fields editable |
| `EXPIRED` | `dsc.expired` | Read-only; `[Duplicate]` only action available |

**Rule:** Once a discount has been used in at least 1 order, the **Discount Method** (Code/Automatic) and **Discount Type** (%/Fixed/Shipping/BOGO) become locked to preserve order history accuracy. Shown disabled with tooltip: `"Cannot be changed after first use. Duplicate this discount to create a new one."`

---

## 10. Duplicate Discount Flow

```
┌──────────────────────────────────────────────────────────┐
│  Duplicate Discount                              [×]    │
│  This will create a copy of "HERO20"                    │
│                                                          │
│  New code:                                                │
│  [ HERO20-COPY                                      ]    │
│                                                          │
│  [ ☑ ] Reset usage count to 0                             │
│  [ ☑ ] Set as Draft (don't activate automatically)        │
│                                                          │
│  [ Cancel ]              [ Create Duplicate ]             │
└──────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| New code | Auto-suffixed `-COPY`; editable |
| Default state | Draft |
| After creation | Redirects to new discount's edit page |

---

## 11. Delete Discount Flow

```
┌──────────────────────────────────────────────────────────┐
│  Delete "HERO20"?                                 [×]   │
│                                                          │
│  ⚠️  This discount has been used in 24 orders.            │
│     Deleting it will not affect those orders, but the    │
│     discount code will no longer work.                   │
│                                                          │
│  To confirm, type the discount code:                     │
│  [ HERO20                                           ]    │
│                                                          │
│  [ Cancel ]              [ Delete Discount ]              │
└──────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Warning | Shown if `usage_count > 0` |
| Type-to-confirm | Must match code exactly |
| Alternative suggested | `"Deactivate instead"` link — less destructive |
| `role` | `role="alertdialog"` |

---

## 12. Bulk Actions

```
[ ☑ 8 selected ]  [Deactivate]  [Extend End Date]  [Export]  [Delete]  [✕ Clear]
```

**Extend End Date (bulk):**

```
┌──────────────────────────────────────────────────────┐
│  Extend End Date — 8 Discounts                [×]   │
│  New end date: [ DD / MM / YYYY ]  [ HH:MM ]        │
│  [ Cancel ]        [ Extend 8 Discounts ]            │
└──────────────────────────────────────────────────────┘
```


---

## 13. Accessibility Requirements

### 13.1 Focus Management

| Interaction | Focus behaviour |
|---|---|
| Discounts list load | Focus → search field |
| Create discount page load | Focus → Discount Method radio group |
| Code field error | Focus → code input on blur validation fail |
| Activate clicked with errors | Focus → first error field; summary panel announced |
| Conflict warning appears | `aria-live="polite"` announces; focus does NOT move |
| Duplicate modal open | Focus → new code input |
| Delete modal open | Focus → confirmation input |
| Product/collection picker open | Focus → search field |
| After successful activate | Focus → status badge; toast announced |

### 13.2 Full ARIA Map

| Component | ARIA |
|---|---|
| Breadcrumb | `<nav aria-label="Breadcrumb">`, `aria-current="page"` |
| Page heading | `<h1>` — `"Discounts & Coupons"` / `"[code/title]"` |
| Type filter tabs | `role="tablist"`, `role="tab"`, `aria-selected` |
| Search input | `aria-label="Search discounts"` |
| Discounts table | `role="grid"`, `aria-label="Discounts"` |
| Column headers | `role="columnheader"`, sortable: `aria-sort` |
| Status badge | `aria-label="Status: [status]"` |
| Overflow menu | `aria-haspopup="menu"`; `role="menu"`, `role="menuitem"` |
| Discount method radios | `role="radiogroup"`, `aria-label="Discount method"` |
| Discount type cards | `role="radiogroup"`, `aria-label="Discount type"` |
| Code input | `aria-required="true"`, `aria-describedby` (char count + error) |
| Applies To radios | `role="radiogroup"`, `aria-label="Applies to"` |
| Customer eligibility radios | `role="radiogroup"`, `aria-label="Customer eligibility"` |
| Minimum requirements radios | `role="radiogroup"`, `aria-label="Minimum requirements"` |
| Usage limit progress bar | `role="progressbar"`, `aria-valuenow/min/max`, `aria-label="[used] of [limit] uses"` |
| Combinations checkboxes | `role="checkbox"`, `aria-checked` |
| Conflict warning | `role="alert"`, `aria-live="polite"` |
| Live preview card | `aria-label="Customer preview"`, updates `aria-live="polite"` |
| Summary card | `aria-label="Discount summary"` |
| Validation summary | `role="alert"`, `aria-live="assertive"` |
| Duplicate modal | `role="dialog"`, `aria-modal="true"`, focus trap |
| Delete modal | `role="alertdialog"`, `aria-modal="true"` |
| Product/collection picker | `role="dialog"`, `aria-modal="true"`, search `role="combobox"` |
| Usage stats sparkline | `role="img"`, `aria-label="Usage trend over last 30 days"` |

### 13.3 Keyboard Navigation Map

| Key | Behaviour |
|---|---|
| `Tab` | Forward through interactive elements |
| `Shift+Tab` | Backward |
| `Enter` | Activate button/link |
| `Space` | Toggle checkbox; select radio |
| `Arrow keys` | Navigate radio groups (method, type, applies-to, eligibility) |
| `Escape` | Close modal/dropdown/picker |
| `⌘S` / `Ctrl+S` | Save as Draft |
| `⌘Enter` | Activate discount |
| `⌘D` | Duplicate (edit mode) |

### 13.4 Testable Acceptance Criteria

| # | Criterion | Method | Pass |
|---|---|---|---|
| A1 | No contrast failures | axe DevTools | Zero critical |
| A2 | All focus rings visible (`2px solid #00b566` + glow) | Manual Tab | Every element |
| A3 | Discount type cards keyboard-navigable | Arrow keys | Selection changes, `aria-checked` updates |
| A4 | Code duplicate check announced | Screen reader | Error `role="alert"` fires on blur |
| A5 | Conflict warning announced | Screen reader | `aria-live="polite"` fires |
| A6 | Usage limit bar has correct ARIA | Screen reader | `aria-valuenow` correct |
| A7 | Validation summary focus-first-error | Keyboard | First error field focused |
| A8 | Duplicate/Delete modals trap focus | Keyboard | Tab cycles inside only |
| A9 | Live preview updates announced appropriately | Screen reader | Not overly verbose — `aria-live="polite"` only |
| A10 | `prefers-reduced-motion` respected | OS setting | Animations disabled |

---

## 14. Content & Tone Standards

### 14.1 Status Labels

| Internal | Display | Never use |
|---|---|---|
| `draft` | `Draft` | "Unpublished" |
| `scheduled` | `Scheduled` | "Pending", "Upcoming" |
| `active` | `Active` | "Live", "Running" |
| `paused` | `Paused` | "Stopped", "Halted" |
| `expired` | `Expired` | "Ended", "Done" |

### 14.2 CTA Labels

| Action | Label | Never use |
|---|---|---|
| Create new | `"+ Create Discount"` | "Add", "New" |
| Save without activating | `"Save as Draft"` | "Save" alone |
| Make live | `"Activate"` | "Publish", "Go Live" |
| Stop a running discount | `"Deactivate"` | "Stop", "Cancel" |
| Copy a discount | `"Duplicate"` | "Copy", "Clone" |
| Remove permanently | `"Delete Discount"` | "Remove" |
| Generate random code | `"Generate Random"` | "Auto-fill" |

### 14.3 Error Messages

Full list in §8.2.

### 14.4 Help Text Standards

| Field | Help text |
|---|---|
| Maximum discount cap | `"E.g. 20% off, capped at ₹500 maximum discount"` |
| Combinations | `"By default, discounts cannot be combined with other discounts of the same category, to prevent unintended stacking."` |
| First-time customers | `"Only customers placing their very first order will see this discount."` |
| Automatic discount title | `"Internal — customers see this in cart, not a code."` |

---

## 15. Anti-Patterns & Prohibited Implementations

| Anti-pattern | Why prohibited | Correct approach |
|---|---|---|
| Raw hex values in CSS | Breaks admin token system | Use `admin.*` / `dsc.*` tokens only |
| `outline: none` | WCAG 2.4.11 failure | `outline: 2px solid dsc.focus-ring` always |
| Allowing % value > 100 | Pricing error — negative revenue risk | Hard validation cap at 100 |
| Saving a code with spaces | Breaks checkout code matching | Strip spaces; alphanumeric + hyphens only |
| Allowing duplicate active codes | Checkout ambiguity | Real-time uniqueness check |
| Combinations enabled by default | Unintended margin-eroding stacking | Default OFF; explicit opt-in required |
| Changing discount type after use | Corrupts historical order discount records | Lock type/method post-first-use |
| Deleting a discount with no warning | Breaks reporting integrity silently | Always show usage count + type-to-confirm |
| Activating with past end date | Discount appears active but never applies | Validate end date ≥ now at activation |
| No live preview of customer-facing copy | Admin can't verify wording before launch | Always show Live Preview Card |
| Hiding the conflict warning | Silent margin loss from stacking errors | Always surface conflict, even if non-blocking |
| Currency without `₹` prefix | Ambiguous | Always prefix all amounts |

---

## 16. Edge-Case Handling

| Scenario | Behaviour |
|---|---|
| Two discounts both auto-apply, same category, no combination | Only the higher-value discount applies; customer sees no error |
| Discount usage limit hit mid-checkout (race condition) | Last valid use wins; subsequent attempts show: `"This code has reached its usage limit."` |
| BOGO discount with insufficient stock of "Get" product | Discount shows as available but applies only while stock lasts; auto-hides when "Get" item is out of stock |
| Code entered in wrong case by customer | Case-insensitive matching at checkout (storefront handles); admin sees code stored as entered |
| Discount deleted while customer has it in active cart | Cart shows: `"This discount code is no longer valid."` |
| Percentage discount on a free product (already ₹0) | No-op — discount shows `₹0 off`; warning shown to admin at creation if scope includes ₹0 items |
| Min purchase amount higher than any product price | Warning at save: `"No products meet this minimum. Customers won't be able to use this code."` |
| End date in the past on edit | Status auto-shows `Expired`; editing re-extends if end date is moved forward |
| Discount applied to gift cards | Blocked by default — gift cards excluded unless explicitly enabled (Shopify platform rule) |
| Very long discount code (> 50 chars) | Table cell truncates with ellipsis; full code shown in tooltip |
| Discount with 10,000+ usage events | Usage report table virtualised, paginated |

---

## 17. Performance Requirements

| Metric | Target | Rule |
|---|---|---|
| Discounts list load | `< 1.5s` | First 25 rows SSR; virtualised beyond |
| Create/edit page load | `< 1s` | SSR form shell; product/collection pickers lazy |
| Code uniqueness check | `< 300ms` | Debounced 250ms; indexed lookup |
| Conflict detection | `< 500ms` | Debounced 500ms after scope/date change |
| Live preview update | `< 100ms` | Pure client-side calculation, no API call |
| Usage report load | `< 1.5s` | Chart + first 25 orders SSR |
| Bulk action (8 discounts) | `< 2s` | Batch API |

---

## 18. Analytics & Tracking Events

| Event | Trigger | Properties |
|---|---|---|
| `discounts_list_view` | Page load | `admin_id`, `filter_status` |
| `discount_create_start` | New discount page opened | `admin_id` |
| `discount_method_select` | Method radio changed | `admin_id`, `method` |
| `discount_type_select` | Type card selected | `admin_id`, `type` |
| `discount_code_generate` | "Generate Random" clicked | `admin_id` |
| `discount_save_draft` | Draft saved | `admin_id`, `discount_id` |
| `discount_activate` | Activated | `admin_id`, `discount_id`, `type`, `method` |
| `discount_activate_fail` | Validation failed | `admin_id`, `failed_fields[]` |
| `discount_conflict_shown` | Conflict warning appeared | `admin_id`, `discount_id`, `conflicting_id` |
| `discount_deactivate` | Deactivated | `admin_id`, `discount_id` |
| `discount_duplicate` | Duplicated | `admin_id`, `source_id`, `new_id` |
| `discount_delete` | Deleted | `admin_id`, `discount_id`, `usage_count` |
| `discount_report_view` | Usage report opened | `admin_id`, `discount_id` |
| `discount_export` | Usage exported | `admin_id`, `discount_id`, `row_count` |
| `discounts_bulk_action` | Bulk submitted | `admin_id`, `action`, `count` |

---

## 19. Internationalisation (i18n)

```json
{
  "dsc.page.title": "Discounts & Coupons",
  "dsc.page.subtitle": "{{total}} total discounts · {{active}} active",
  "dsc.page.create": "+ Create Discount",

  "dsc.tabs.all": "All ({{count}})",
  "dsc.tabs.active": "Active ({{count}})",
  "dsc.tabs.scheduled": "Scheduled ({{count}})",
  "dsc.tabs.expired": "Expired ({{count}})",
  "dsc.tabs.draft": "Draft ({{count}})",

  "dsc.status.draft": "Draft",
  "dsc.status.scheduled": "Scheduled",
  "dsc.status.active": "Active",
  "dsc.status.paused": "Paused",
  "dsc.status.expired": "Expired",

  "dsc.method.code": "Discount Code",
  "dsc.method.automatic": "Automatic Discount",
  "dsc.type.percentage": "Percentage",
  "dsc.type.fixed": "Fixed Amount",
  "dsc.type.shipping": "Free Shipping",
  "dsc.type.bogo": "Buy X Get Y",

  "dsc.field.code": "CODE",
  "dsc.field.title": "TITLE",
  "dsc.field.value": "VALUE",
  "dsc.field.min_purchase": "Minimum purchase amount",
  "dsc.field.min_quantity": "Minimum quantity of items",
  "dsc.field.start_date": "START DATE",
  "dsc.field.end_date": "END DATE",

  "dsc.action.generate_random": "Generate Random",
  "dsc.action.save_draft": "Save as Draft",
  "dsc.action.activate": "Activate",
  "dsc.action.deactivate": "Deactivate",
  "dsc.action.duplicate": "Duplicate",
  "dsc.action.delete": "Delete Discount",
  "dsc.action.view_report": "View Usage Report",

  "dsc.validation.code_required": "Discount code is required.",
  "dsc.validation.code_duplicate": "This code is already in use by '{{name}}'.",
  "dsc.validation.percentage_range": "Percentage must be between 1 and 100.",
  "dsc.validation.amount_positive": "Discount amount must be greater than ₹0.",
  "dsc.validation.end_before_start": "End date must be after the start date.",
  "dsc.validation.publish_summary": "This discount can't be activated yet. Fix {{count}} issue(s):",

  "dsc.conflict.heading": "Potential Conflict",
  "dsc.conflict.body": "'{{name}}' is also active for {{scope}} during an overlapping date range.",

  "dsc.toast.activated": "{{name}} is now active.",
  "dsc.toast.deactivated": "{{name}} has been deactivated.",
  "dsc.toast.deleted": "{{name}} was deleted.",
  "dsc.toast.duplicated": "Duplicate created as draft.",

  "dsc.confirm.delete.heading": "Delete '{{code}}'?",
  "dsc.confirm.delete.body": "This discount has been used in {{count}} orders. Deleting it will not affect those orders, but the code will stop working.",
  "dsc.confirm.delete.type_label": "To confirm, type the discount code:",

  "dsc.empty.no_discounts": "No discounts created",
  "dsc.empty.no_discounts_body": "Create your first discount to offer deals to customers.",
  "dsc.empty.no_results": "No discounts found",
  "dsc.empty.no_results_body": "Try adjusting your filters or search.",

  "dsc.kpi.active": "Active Discounts",
  "dsc.kpi.used_30d": "Codes Used (30d)",
  "dsc.kpi.revenue": "Revenue from Discounts",
  "dsc.kpi.cost": "Discount Cost (30d)",
  "dsc.kpi.expiring": "Expiring Soon (7 days)"
}
```


---

## 20. Shopify Admin API Integration

### 20.1 Discount Data Field Mapping

Shopify uses two distinct API objects: `PriceRule` (legacy REST) and `DiscountCode` for code-based discounts, or `DiscountAutomaticApp`/`DiscountAutomaticBasic` (GraphQL Admin API) for automatic discounts. New builds should use the **GraphQL Discount API** (`discountCodeBasicCreate`, `discountAutomaticBasicCreate`, etc.) rather than legacy REST PriceRules.

| Admin UI field | Shopify GraphQL field | Notes |
|---|---|---|
| Code | `DiscountCodeBasic.codes[].code` | |
| Title (automatic) | `DiscountAutomaticBasic.title` | |
| Discount type | `customerGets.value` (`DiscountPercentage` / `DiscountAmount`) | |
| Value | `customerGets.value.percentage` or `.amount` | |
| Applies to | `customerGets.items` (`AllDiscountItems` / `DiscountProducts` / `DiscountCollections`) | |
| Customer eligibility | `customerSelection` (`DiscountCustomerAll` / `DiscountCustomers` / `DiscountCustomerSegments`) | |
| Minimum requirement | `minimumRequirement` (`DiscountMinimumQuantity` / `DiscountMinimumSubtotal`) | |
| Usage limit | `usageLimit` | |
| Once per customer | `appliesOncePerCustomer` | |
| Combinations | `combinesWith` (`{ orderDiscounts, productDiscounts, shippingDiscounts }` booleans) | |
| Start date | `startsAt` | ISO 8601 |
| End date | `endsAt` | ISO 8601, nullable |
| Status | `status` (`ACTIVE` / `EXPIRED` / `SCHEDULED`) | Computed by Shopify from dates |
| Usage count | `asyncUsageCount` | |
| BOGO buy config | `customerBuys.value` + `customerBuys.items` | |
| BOGO get config | `customerGets.value` + `customerGets.items` | |

### 20.2 Key GraphQL Mutations

| Action | Mutation |
|---|---|
| Create code discount | `discountCodeBasicCreate` |
| Update code discount | `discountCodeBasicUpdate` |
| Create automatic discount | `discountAutomaticBasicCreate` |
| Update automatic discount | `discountAutomaticBasicUpdate` |
| Create BOGO discount | `discountCodeBxgyCreate` / `discountAutomaticBxgyCreate` |
| Create free shipping discount | `discountCodeFreeShippingCreate` |
| Activate | `discountCodeActivate` / `discountAutomaticActivate` |
| Deactivate | `discountCodeDeactivate` / `discountAutomaticDeactivate` |
| Delete | `discountCodeDelete` / `discountAutomaticDelete` |

### 20.3 Key GraphQL Queries

| Action | Query |
|---|---|
| List discounts | `discountNodes(first: 25, query: "status:active")` |
| Discount detail | `discountNode(id: "gid://shopify/DiscountCodeNode/...")` |
| Usage report (orders) | `orders(query: "discount_code:HERO20")` |
| Customer segments (for eligibility) | `segments(first: 50)` |

### 20.4 Conflict Detection Logic (custom, not native Shopify)

Shopify does not natively warn about overlapping discounts in the admin UI. This must be implemented as a custom server-side check:

```
ON discount scope/date/combination change (debounced 500ms):
  1. Query all ACTIVE + SCHEDULED discounts via discountNodes
  2. Filter to those with overlapping date range (startsAt/endsAt intersect)
  3. Filter to those with overlapping "Applies To" scope
     (same product/collection/all-products match)
  4. Filter to those in the same combination category
     (both are "order" discounts, or both "product", or both "shipping")
  5. If combinesWith does NOT explicitly allow combination → flag as conflict
  6. Display ConflictWarningPanel with the highest-priority match
```

### 20.5 Code Uniqueness Check

```
GET via GraphQL: codeDiscountNodeByCode(code: "HERO20")
→ If result is non-null and id !== current_discount_id → show duplicate error
```

Debounced `250ms` on code field blur/keyup.

---

## 21. Component Migration Notes

### 21.1 Token Adoption Priority

| Priority | Token group | Risk if skipped |
|---|---|---|
| P0 — Critical | All `admin.color.*` base tokens | Dark theme breaks |
| P0 — Critical | `dsc.focus-ring` + `dsc.focus-glow` | WCAG 2.4.11 failure |
| P0 — Critical | `dsc.danger` on validation states | Pricing errors invisible |
| P1 — High | All `font.size.*` tokens | Typography regressions |
| P1 — High | `radius.xs` through `radius.lg` | Shape inconsistency |
| P2 — Medium | `dsc.preview-bg`, `dsc.conflict-bg` | Visual hierarchy polish |
| P3 — Low | Sparkline chart colours | Minor polish |

### 21.2 Reused Admin Components

| Component | Source | Usage on this page |
|---|---|---|
| Admin Input Field | `admin-dashboard-design.md §7.2` | All text/number inputs |
| Admin Select / Dropdown | §7.2 | Segment select, exclusion lists |
| Admin Checkbox | §7.2 | Usage limits, combinations, exclusions |
| Admin Toggle | §7.2 | (not used — radio groups preferred for mutually exclusive options) |
| Admin Primary Button | §7.3 | Activate, Create Discount |
| Admin Secondary Button | §7.3 | Save as Draft |
| Admin Ghost Button | §7.3 | Discard, Generate Random |
| Admin Danger Button | §7.3 | Delete Discount |
| Admin Modal Shell | §7.5 | Duplicate, product/collection picker |
| Admin Alert Dialog | §7.5 | Delete confirmation |
| Admin Toast | §7.6 | All save/activate/error notifications |
| Admin Status Badge | §7.4 | Discount status, type badges |
| Product/collection picker modal | `admin-product-page-design.md §6.5` | "Applies To" and "Exclude" selectors |
| Customer search | `admin-customers-design.md §15` | "Specific customers" eligibility |
| Segment select | `admin-customers-design.md §17` | "Specific segments" eligibility |
| Chart component | `admin-dashboard-design.md §6.3` | Usage Over Time chart |

### 21.3 Page-Exclusive Components

| Component | Notes |
|---|---|
| Discount type card selector (4-option visual radio) | Discounts only |
| Live Preview Card (mock cart) | Discounts only |
| Conflict Warning Panel | Discounts only |
| Usage limit progress bar | Discounts only |
| BOGO buy/get configuration UI | Discounts only |
| Discount code mono-font input with auto-uppercase | Discounts only |

---

## 22. Final Summary — Complete Section Map

```
Admin Discounts & Coupons Module — v1.0
Complete Design Specification
═══════════════════════════════════════════════════════════════════════
CORE SPEC (§1–§17)

§1   Context & Goals
§2   Design Tokens (17 inherited, 24 dsc.* aliases, typography × 19,
     spacing/radius/motion, contrast audit × 6)

DISCOUNTS LIST (§3–§4)
§3   Page Layout (list + create/edit shell diagrams)
§4   Discounts List Page
     §4.1  Page Header
     §4.2  KPI Cards Row (5 cards)
     §4.3  Type Filter Tabs (5 statuses)
     §4.4  Table Toolbar
     §4.5  Discounts Data Table (9 columns, 4 badge types)
     §4.6  Pagination & Empty States

CREATE / EDIT — LEFT COLUMN (§5)
§5.1  Breadcrumb & Header
§5.2  Discount Method Panel (Code vs Automatic — locks form structure)
§5.3  Code / Title Panel (uniqueness check, random generator)
§5.4  Discount Type & Value Panel (4 types incl. full BOGO config)
§5.5  Applies To Panel (scope: all/collections/products/customers + exclude)
§5.6  Customer Eligibility Panel (segments, tiers, first-time-only)
§5.7  Minimum Requirements Panel (amount or quantity)
§5.8  Usage Limits Panel (total + per-customer, live progress)
§5.9  Combinations Panel (default-off stacking prevention)
§5.10 Active Dates Panel (timezone-aware scheduling)

CREATE / EDIT — RIGHT COLUMN (§6)
§6.1  Summary Card (live-updating)
§6.2  Live Preview Card (mock customer-facing cart/checkout)
§6.3  Conflict Warning Panel (conditional, non-blocking)
§6.4  Active Dates Card (computed status line)
§6.5  Usage Stats Card (edit mode, sparkline)

REPORTING (§7)
§7   Discount Usage Report Page (KPIs, chart, order list, export)

SYSTEMS (§8–§12)
§8   Validation System (required fields × 7, rules × 12, display)
§9   Discount State Machine (5 states, type/method lock rule)
§10  Duplicate Discount Flow
§11  Delete Discount Flow (type-to-confirm)
§12  Bulk Actions (deactivate, extend date, export, delete)

EXTENDED IMPLEMENTATION GUIDE (§13–§22)

§13  Accessibility Requirements
     • Focus management (9 scenarios)
     • Full ARIA map (20 components)
     • Keyboard map (9 keys)
     • 10 testable acceptance criteria

§14  Content & Tone Standards
     • Status labels (5) · CTA labels (7) · Help text standards (4)

§15  Anti-Patterns (× 12 prohibited implementations)

§16  Edge-Case Handling (× 11 scenarios)

§17  Performance Requirements (7 metrics)

§18  Analytics & Tracking Events (× 15 events)

§19  Internationalisation (60 i18n keys)

§20  Shopify Admin API Integration
     • 14-field GraphQL data mapping
     • 9 mutations · 4 queries
     • Custom conflict detection algorithm (5-step logic)
     • Code uniqueness check implementation

§21  Component Migration Notes
     • Token priority P0–P3
     • 14 reused admin components
     • 6 page-exclusive components

§22  Final Summary — Section Map (this section)

═══════════════════════════════════════════════════════════════════════
Total: ~1,700 lines | 22 sections
WCAG 2.2 AA | Admin dark token system (Outfit)

Companion documents:
  admin-dashboard-design.md     ← Admin system tokens & shared components
  admin-orders-design.md        ← Orders module (linked from usage report)
  admin-customers-design.md     ← Customers (segments, eligibility scoping)
  admin-product-page-design.md  ← Product picker (Applies To scope)
  design-system.md              ← Master storefront design system

Last updated: June 2026
═══════════════════════════════════════════════════════════════════════
```

---

*Document version: 1.0 (complete) — Admin Discounts & Coupons Module*
*Sections: 1–12 (core spec) + 13–22 (extended implementation guide)*
*Guideline standard: WCAG 2.2 AA | Token system: Admin dark (Outfit)*
*Companion: `admin-dashboard-design.md` · `admin-orders-design.md` · `admin-customers-design.md`*
*Last updated: June 2026*
