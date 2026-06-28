# Admin — Product Edit / Create Page
## Design Specification v1.0 — Production-Ready

> **Design intent:** Deliver a comprehensive, panel-driven product management interface that maps 1-to-1 with every field and rule defined in the storefront PDP spec — giving admins full control over plant listings, variant pricing, care metadata, SEO, pot upsell configuration, media, and publishing — in a dark-theme admin environment that is keyboard-first, WCAG 2.2 AA compliant, and optimised for fast daily merchandising workflows.

---

## 1. Context & Goals

| Property | Value |
|---|---|
| **Page name** | Product Edit / Create |
| **URLs** | `/admin/products/new` · `/admin/products/[id]/edit` |
| **Parent module** | Products (`/admin/products`) |
| **Primary goal** | Enable admins to create and maintain accurate, complete plant product listings that power the storefront PDP |
| **Secondary goals** | Enforce product-type rules (plant vs pot vs seed); surface media, SEO, care data, and pot upsell config in one page; prevent data errors before publish |
| **Linked storefront page** | PDP spec — `design_product_detels.md` |
| **User roles with access** | Super Admin · Operations Manager · Inventory Manager |
| **Read-only roles** | Customer Support (view-only drawer) |
| **Page density** | Inputs: ~60 · Buttons: ~30 · Panels: ~12 · Tables: ~3 |

---

## 2. Design Tokens (Admin — Inherited)

All tokens inherit from `admin-dashboard-design.md §2`. The product page introduces no new base tokens — only semantic aliases for page-specific roles.

### 2.1 Inherited Admin Tokens (Key References)

| Token | Hex | Usage on this page |
|---|---|---|
| `admin.color.bg.canvas` | `#0f1117` | Page background |
| `admin.color.bg.sidebar` | `#161b22` | Left admin sidebar |
| `admin.color.bg.surface` | `#1c2128` | All content panels |
| `admin.color.bg.elevated` | `#22272e` | Input bg, hover states, nested panels |
| `admin.color.bg.overlay` | `#2d333b` | Dropdowns, modals |
| `admin.color.text.primary` | `#cdd9e5` | All main labels and values |
| `admin.color.text.secondary` | `#768390` | Muted labels, help text |
| `admin.color.text.tertiary` | `#adbac7` | Section headings |
| `admin.color.text.placeholder` | `#545d68` | Input placeholder |
| `admin.color.brand.green` | `#00b566` | CTAs, active states, publish button |
| `admin.color.brand.green.muted` | `#00b566` @ 15% | Selected state bg, focus glow |
| `admin.color.border.default` | `#444c56` | All card and input borders |
| `admin.color.border.active` | `#00b566` | Focused inputs, selected panels |
| `admin.color.status.success` | `#57ab5a` | Published status, validation pass |
| `admin.color.status.warning` | `#c69026` | Draft status, incomplete fields |
| `admin.color.status.error` | `#e5534b` | Validation errors, required fields |
| `admin.color.status.info` | `#539bf5` | Help text highlights, info banners |

### 2.2 Product Page Semantic Aliases

| Alias | Maps to | Usage |
|---|---|---|
| `pp.panel-bg` | `admin.color.bg.surface` | All content panels |
| `pp.panel-border` | `admin.color.border.default` | Panel borders |
| `pp.nested-bg` | `admin.color.bg.elevated` | Inputs, nested sections |
| `pp.label` | `admin.color.text.tertiary` | Form field labels |
| `pp.help` | `admin.color.text.secondary` | Help/hint text below fields |
| `pp.value` | `admin.color.text.primary` | Input values, filled data |
| `pp.accent` | `admin.color.brand.green` | Publish CTA, active tabs, selection |
| `pp.accent-bg` | `admin.color.brand.green.muted` | Active chip bg, selected variant row |
| `pp.border` | `admin.color.border.default` | All inputs, dividers |
| `pp.border-active` | `admin.color.border.active` | Focused inputs |
| `pp.divider` | `admin.color.border.default` @ 50% | Internal section dividers |
| `pp.error` | `admin.color.status.error` | Error borders and messages |
| `pp.warning` | `admin.color.status.warning` | Warning banners |
| `pp.success` | `admin.color.status.success` | Published badge, saved states |
| `pp.focus-ring` | `admin.color.brand.green` | Universal focus ring |
| `pp.shadow` | `0 2px 8px rgba(0,0,0,0.25)` | Panel shadow |
| `pp.focus-glow` | `0 0 0 3px rgba(0,181,102,0.25)` | Focus ring glow |

### 2.3 Typography (Admin Scale)

| Role | Token | Weight | Colour |
|---|---|---|---|
| Page title | `font.size.5xl` (24px) | 700 | `pp.value` |
| Panel heading | `font.size.4xl` (18px) | 700 | `pp.value` |
| Sub-panel heading | `font.size.3xl` (16px) | 600 | `pp.label` |
| Field label | `font.size.xs` (11px) | 700 | `pp.label`, uppercase, `letter-spacing: 0.06em` |
| Input value | `font.size.sm` (12px) | 400 | `pp.value` |
| Help text | `font.size.xs` (11px) | 400 | `pp.help` |
| Button label | `font.size.sm` (12px) | 600 | per button type |
| Badge / chip | `font.size.xs` (11px) | 700 | per status |
| Table header | `font.size.xs` (11px) | 700 | `pp.help`, uppercase |
| Table cell | `font.size.sm` (12px) | 400 | `pp.value` |
| Monospace (SKU / ID) | `font.family.mono`, `font.size.xs` | 400 | `pp.label` |
| Tab label | `font.size.sm` (12px) | 600 | active: `pp.accent`; inactive: `pp.help` |
| Preview label | `font.size.xs` (11px) | 500 | `pp.help` |
| Error message | `font.size.xs` (11px) | 500 | `pp.error` |
| Character counter | `font.size.xs` (11px) | 400 | `pp.help` |

### 2.4 Spacing

| Token | Value | Usage |
|---|---|---|
| `space.4` | `8px` | Inner padding small |
| `space.6` | `12px` | Field label to input gap |
| `space.7` | `16px` | Inner panel padding |
| `space.8` | `20px` | Panel section gap |
| `space.9` | `24px` | Panel padding standard |
| `space.10` | `32px` | Between major panels |
| `space.12` | `48px` | Page section gap |

### 2.5 Border Radius

| Token | Value | Usage |
|---|---|---|
| `radius.xs` | `4px` | Status badges, mini chips |
| `radius.sm` | `6px` | Inputs, buttons, tags |
| `radius.md` | `8px` | Panels, modals |
| `radius.lg` | `12px` | Media upload zone |
| `radius.full` | `9999px` | Pill badges, toggle |

---

## 3. Page Layout

### 3.1 Overall Structure

```
┌──────────────────────────────────────────────────────────────────────┐
│  TOP BAR (64px)                                                      │
├──────────────┬───────────────────────────────────────────────────────┤
│  SIDEBAR     │  BREADCRUMB                                           │
│  (240px)     │  PAGE HEADER  [Product title + status]  [Actions bar]│
│              ├──────────────────────────────┬────────────────────────┤
│              │                              │                        │
│              │  LEFT COLUMN (65%)           │  RIGHT COLUMN (35%)   │
│              │                              │                        │
│              │  • Product Info Panel        │  • Status Panel        │
│              │  • Media Panel               │  • Organisation Panel  │
│              │  • Pricing Panel             │  • Product Type Panel  │
│              │  • Variants Panel            │  • Care Info Panel     │
│              │  • Inventory Panel           │  • Pot Upsell Panel    │
│              │  • Shipping Panel            │  • SEO Panel           │
│              │  • Tabs Content Panel        │  • Preview Panel       │
│              │    (About / Care / Reviews)  │                        │
│              │                              │                        │
│              ├──────────────────────────────┴────────────────────────┤
│              │  STICKY SAVE BAR (bottom)                             │
└──────────────┴───────────────────────────────────────────────────────┘
```

### 3.2 Layout Rules

| Property | Value |
|---|---|
| Content padding | `space.9 = 24px` all sides |
| Left column width | `65%` |
| Right column width | `35%` |
| Column gap | `space.9 = 24px` |
| Right column | `position: sticky; top: 80px; align-self: start` on desktop |
| Panel gap (vertical) | `space.9 = 24px` between panels |
| Page background | `admin.color.bg.canvas` |
| Min page width | `1280px` |
| Right column sticky | Scrolls with page, stops at viewport edge |

---

## 4. Breadcrumb & Page Header

### 4.1 Breadcrumb

```
Products  /  Edit: Monstera Deliciosa
```

For new product:
```
Products  /  Add Product
```

| Property | Value |
|---|---|
| Font | `font.size.sm`, weight 400, `pp.help` |
| Separator | `/`, `pp.help` @ 50% |
| Current page | weight 600, `pp.value` |
| `aria-label` | `"Breadcrumb"` on `<nav>` |
| `aria-current` | `"page"` on last item |

### 4.2 Page Header

```
Monstera Deliciosa                        [ Active ● ]
SKU-MM-001  ·  Last updated 5 mins ago

                    [View on Storefront ↗] [Duplicate] [Delete] [Save Draft] [Publish]
```

| Element | Value |
|---|---|
| Product name | `font.size.5xl` (24px), weight 700, `pp.value` |
| SKU + timestamp | `font.size.xs`, `pp.help`, monospace SKU, `·` separator |
| Status badge | Pill: Active `pp.success`; Draft `pp.warning`; Archived `pp.help` |
| "View on Storefront" | Ghost button, opens new tab, `rel="noopener noreferrer"` |
| "Duplicate" | Ghost button |
| "Delete" | Ghost button, `pp.error` text, confirm modal required |
| "Save Draft" | Secondary outlined button |
| "Publish" | Primary `pp.accent` filled button |
| Layout | Product name + SKU left; actions right; `justify-content: space-between` |
| Margin bottom | `space.9 = 24px` |

**New product header:**
```
Add New Product

              [Discard] [Save Draft] [Publish]
```

---

## 5. LEFT COLUMN PANELS

### 5.1 Product Info Panel

**Panel heading:** `"Product Information"`

```
┌──────────────────────────────────────────────────────────────────────┐
│  Product Information                                                 │
├──────────────────────────────────────────────────────────────────────┤
│  TITLE *                                                             │
│  [ Monstera Deliciosa                                           ]    │
│  0 / 120 characters                                                  │
│                                                                      │
│  SHORT DESCRIPTION                                                   │
│  [ A statement indoor plant with iconic split leaves...         ]    │
│  [ (rich text — one line of body copy, max 160 chars)           ]    │
│  98 / 160 characters                                                 │
│                                                                      │
│  FULL DESCRIPTION                                                    │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ B  I  U  H2  H3  ─ list  link  🖼 image  </> code  clear      │ │
│  ├─────────────────────────────────────────────────────────────────┤ │
│  │  [Rich text content area — min 200px height]                   │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  BOTANICAL NAME / SCIENTIFIC NAME                                    │
│  [ Monstera deliciosa                                           ]    │
│                                                                      │
│  SUBSPECIES / COMMON NAME (shown on storefront under title)          │
│  [ Swiss Cheese Plant                                           ]    │
└──────────────────────────────────────────────────────────────────────┘
```

**Panel shell:**

| Property | Value |
|---|---|
| Background | `pp.panel-bg` |
| Border | `1px solid pp.panel-border` |
| Border-radius | `radius.md` |
| Padding | `space.9 = 24px` |
| Shadow | `pp.shadow` |

**Title field:**

| Property | Value |
|---|---|
| Height | `36px` |
| Background | `pp.nested-bg` |
| Border | `1px solid pp.border` |
| Border-radius | `radius.sm` |
| Font | `font.size.sm`, weight 400, `pp.value` |
| Placeholder | `"e.g. Monstera Deliciosa"` |
| Max chars | `120` — shown as `[n] / 120` below right |
| Focus | `pp.border-active` border + `pp.focus-glow` |
| `aria-required` | `true` |
| `aria-label` | `"Product title"` |
| Validation | Required — inline error below on submit |

**Short description field:**

| Property | Value |
|---|---|
| Type | Single-line text (not rich text) |
| Max chars | `160` |
| Help text | `"Appears below the product title in the storefront PDP."` |
| Purpose | Maps to PDP subtitle / storefront short copy |

**Rich text editor:**

| Property | Value |
|---|---|
| Min-height | `200px` |
| Background | `pp.nested-bg` |
| Border | `1px solid pp.border` |
| Border-radius | `radius.sm` |
| Toolbar bg | `admin.color.bg.canvas` |
| Toolbar border-bottom | `1px solid pp.divider` |
| Toolbar buttons | `B I U H2 H3 — list link image code clear` |
| Focus | Toolbar border bottom turns `pp.accent` |
| Content font | `font.size.sm`, `pp.value` |
| Placeholder | `"Write a detailed description of this plant..."` |
| PDP mapping | Renders in "About This Plant" tab body text |

**Botanical name field:**

| Property | Value |
|---|---|
| Font in field | `font.family.mono`, italic — signals scientific naming |
| Help text | `"Used in the About tab specifications card. Italicised on storefront."` |
| Validation | Optional — no required marker |

**Common name / subspecies:**

| Property | Value |
|---|---|
| Help text | `"Shown below the product title on the PDP in smaller text. E.g. 'Swiss Cheese Plant'"` |
| Validation | Optional |

---

### 5.2 Media Panel

**Panel heading:** `"Media"`

```
┌──────────────────────────────────────────────────────────────────────┐
│  Media                                               [+ Add from URL]│
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                                                                │  │
│  │   📷  Drop files here to upload                               │  │
│  │       or click to browse                                      │  │
│  │       JPG · PNG · WebP · max 10MB per file                    │  │
│  │                                                                │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │ [img 1]  │  │ [img 2]  │  │ [img 3]  │  │ [img 4]  │            │
│  │ PRIMARY  │  │          │  │          │  │          │            │
│  │  ✕       │  │  ✕       │  │  ✕       │  │  ✕       │            │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘            │
│  ← drag to reorder                                                   │
│                                                                      │
│  PDP image order: 1 = main image · 2-4 = thumbnails                 │
└──────────────────────────────────────────────────────────────────────┘
```

**Upload zone:**

| Property | Value |
|---|---|
| Height | `140px` |
| Background | `pp.nested-bg` |
| Border | `2px dashed pp.border` |
| Border-radius | `radius.lg` |
| Drag-active | `pp.accent-bg` bg, solid `pp.accent` border, scale `1.005` |
| Accepted types | `.jpg, .jpeg, .png, .webp, .heic` |
| Max file size | `10MB` per file |
| Max files | `8` (4 required by PDP spec + 4 optional extras) |
| Icon | `48×48px` camera SVG, `pp.help` colour |
| Label | `font.size.sm`, weight 500, `pp.label` |
| Sub-label | `font.size.xs`, `pp.help` |
| `aria-label` | `"Upload product images"` |
| `aria-describedby` | Accepted types sub-label |
| Keyboard | Enter/Space opens file picker |

**Image thumbnails:**

| Property | Value |
|---|---|
| Size | `96×96px` |
| Border-radius | `radius.sm` |
| Object-fit | `cover` |
| Border | `1px solid pp.border` |
| "PRIMARY" badge | First image; `pp.accent` bg, `pp.value` text (white), `radius.xs`, `font.size.xs` weight 700 |
| `×` remove | `20×20px` circle, `admin.color.bg.canvas` @ 80% bg, `pp.value` icon; top-right corner |
| Drag handle | `⠿` icon top-left, cursor `grab` |
| Drag active | Scale `1.04`, `pp.shadow` elevation, `pp.accent` border |
| `aria-label` | `"Image [n]: [filename]. [Primary / Thumbnail]. Drag to reorder."` |

**Reorder rule:**
First image in grid = primary/main image shown large on PDP. Images 2–4 = thumbnail strip. Images 5–8 = accessible via gallery nav on PDP. Admin must see this mapping clearly.

**PDP mapping note (inline):**

```
ℹ️  Image order matters:
    #1 → Main PDP image  ·  #2–4 → Thumbnail strip  ·  #5+ → Gallery extras
```

| Property | Value |
|---|---|
| Icon | ℹ️ `12×12px`, `admin.color.status.info` |
| Text | `font.size.xs`, `pp.help` |
| Background | `admin.color.status.info` @ 6% |
| Border | `1px solid admin.color.status.info` @ 30% |
| Border-radius | `radius.xs` |
| Padding | `space.4 = 8px` |

**"Add from URL" button:**

Opens a modal with a URL input. Fetches and adds remote image. Used for importing existing product photos from suppliers.

---

### 5.3 Pricing Panel

**Panel heading:** `"Pricing"`

Maps directly to PDP §11.4 Price Block.

```
┌──────────────────────────────────────────────────────────────────────┐
│  Pricing                                                             │
├──────────────────────────────────────────────────────────────────────┤
│  CURRENT PRICE *          COMPARE AT PRICE         COST PER UNIT     │
│  [ ₹  399            ]   [ ₹  599            ]   [ ₹  180       ]   │
│                           (Original / strikethrough                  │
│                           on storefront PDP)                         │
│                                                                      │
│  DISCOUNT BADGE TEXT (optional — overrides auto-calculated %)        │
│  [ ☐ ] Show custom badge text                                        │
│  [ 33% off                                      ]                   │
│  (When blank: auto-calculates from current vs compare-at price)      │
│                                                                      │
│  TAX                                                                 │
│  [ ☑ ] This product is taxable                                       │
│  TAX RATE  [ GST 18%          ▾ ]                                   │
│                                                                      │
│  PRICE NOTE (shown as sub-text on PDP)                               │
│  [ incl. of all taxes                           ]                   │
└──────────────────────────────────────────────────────────────────────┘
```

**Price input:**

| Property | Value |
|---|---|
| Width | `180px` per price field |
| Currency prefix | `₹` inside input, `pp.help`, `font.size.sm` |
| Type | `number`, `min="0"`, `step="0.01"` |
| Height | `36px` |
| All standard input styles | Inherit `pp.nested-bg`, `pp.border`, `radius.sm` |
| Focus | `pp.border-active` + `pp.focus-glow` |
| Validation | Required for current price; numeric only |

**Discount badge logic:**

| Scenario | Storefront display |
|---|---|
| Compare-at set, no custom text | Auto: `"33% off"` pill with amber bg |
| Compare-at set + custom text | Custom text shown in pill |
| No compare-at set | No badge |
| Current > compare-at | Validation error: `"Compare-at price must be greater than current price"` |

**PDP mapping:**
- `Current price` → `--color-green-dark` bold price on PDP
- `Compare at` → strikethrough in `--color-text-secondary`
- `Discount badge text` → amber pill `#fff0c2` bg, `#8a6200` text per PDP §11.4

---

### 5.4 Variants Panel

**Panel heading:** `"Variants & Sizes"`

> This panel is the admin-side implementation of PDP §11.5 (Size Selector) and §11.15 (Product Type Rules).

```
┌──────────────────────────────────────────────────────────────────────┐
│  Variants & Sizes                            [+ Add Variant Option]  │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  VARIANT TYPE:  [ ● Size / Height ]  [ ○ Diameter ]  [ ○ Weight ]  │
│  [ ○ Pack size ]  [ ○ Custom... ]                                    │
│                                                                      │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │
│                                                                      │
│ ┌────────────────────────────────────────────────────────────────┐   │
│ │  SIZE NAME  │  HEIGHT RANGE  │  PRICE  │  SKU       │  STOCK  │   │
│ ├─────────────┼────────────────┼─────────┼────────────┼─────────┤   │
│ │ ⠿ Small     │  15–25 cm      │  ₹199   │ SKU-MS-001 │   45    │   │
│ │ ⠿ Medium    │  40–50 cm      │  ₹399   │ SKU-MM-001 │  234    │   │
│ │ ⠿ Large     │  60–80 cm      │  ₹699   │ SKU-ML-001 │   67    │   │
│ └────────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  [+ Add Size Variant]                                                │
│                                                                      │
│  SIZE DETAIL CARD DATA (shown on PDP below size pills)              │
│  Per variant, define:                                               │
│   Best for:     [ Most popular pick              ]                  │
│   Pot diameter: [ 14 cm                          ]                  │
│   Dispatch:     [ 1–2 days   ▾ ]                                   │
└──────────────────────────────────────────────────────────────────────┘
```

**Variant type selector:**

| Property | Value |
|---|---|
| Input type | Radio group, `role="radiogroup"` |
| Options | Size/Height · Diameter · Weight · Pack size · Custom |
| On change | Table column headers update to match (Height Range / Diameter / Weight) |
| Help text | `"This controls what size pills look like on the storefront PDP."` |
| `aria-label` | `"Variant type"` on group |

**Variant row table:**

| Column | Content | Editable |
|---|---|---|
| ⠿ (drag) | Drag handle — reorders PDP size pills | — |
| Size Name | `"Small"` — `font.size.sm`, editable inline | Yes |
| Height Range | `"15–25 cm"` — unit auto-appended | Yes |
| Price | `₹XXX` — overrides base price for this variant | Yes |
| SKU | Monospace, auto-generated or manual | Yes |
| Stock | Integer, links to Inventory module | Yes |
| Actions | `[Edit ▾]` `[×]` | — |

**Inline variant editing:**

Clicking any cell makes it editable in-place (contenteditable or inline input). Tab advances to next cell.

**"+ Add Size Variant" button:**

Appends a new empty row at the bottom of the table. Auto-generates SKU as `[base-SKU]-[n]`.

**Size detail card data (per variant — expanded on row click):**

```
▼ Small variant details
  Best for:     [ Most popular pick              ]  ← shown in "Best for" stat on PDP
  Pot diameter: [ 14 cm                          ]  ← shown in "Pot dia." stat on PDP
  Dispatch:     [ 1–2 days   ▾ ]                    ← shown in "Dispatch" stat on PDP
```

These three fields map directly to the 4-column Size Detail Card on the PDP (§11.5). The admin must fill these per variant so the PDP renders correctly.

**PDP mapping visualisation (info panel):**

```
ℹ️  How this appears on the storefront:
    Size pill order matches the row order above. Drag rows to reorder pills.
    Selected size pill shows the detail card below with: height, best-for,
    pot diameter, and dispatch time.
```

**Variant rules by product type (from PDP §11.15):**

| Product type | Variant type to select | Notes |
|---|---|---|
| Plants | `Size / Height` | Shows height range in cm |
| Pots / Planters | `Diameter` | Shows diameter in cm |
| Seeds | `Pack size` | Shows quantity (e.g. "10 seeds") |
| Soil / Fertiliser | `Weight / Volume` | Shows grams or litres |
| Tools / Accessories | `Custom` or none | Optional |

**Rule enforcement in admin:**
When product type (§9.1) is set to "Plant", the variant type auto-sets to "Size / Height" and cannot be changed to "Diameter" or "Weight" (those are disabled). This enforces PDP §11.15.

---

### 5.5 Inventory Panel

**Panel heading:** `"Inventory"`

```
┌──────────────────────────────────────────────────────────────────────┐
│  Inventory                                                           │
├──────────────────────────────────────────────────────────────────────┤
│  SKU (Base)                        BARCODE / ISBN                    │
│  [ SKU-MM-001                ]    [ 8901234567890           ]       │
│                                                                      │
│  [ ☑ ] Track inventory for this product                              │
│                                                                      │
│  STOCK QUANTITY (per variant)                                        │
│  Small     [ 45  ]   Medium   [ 234  ]   Large  [ 67   ]            │
│                                                                      │
│  REORDER LEVEL                      LOW STOCK ALERT                  │
│  [ 20             ]                 [ ☑ ] Notify when below level    │
│                                                                      │
│  STOCK POLICY                                                        │
│  ( ● ) Deny orders when out of stock (show "Sold Out" on PDP)       │
│  ( ○ ) Allow backorders (show "Pre-order" on PDP)                   │
│  ( ○ ) Continue selling (no stock warning on PDP)                    │
│                                                                      │
│  WAREHOUSE / LOCATION                                                │
│  [ Pune Fulfilment Centre      ▾ ]                                  │
└──────────────────────────────────────────────────────────────────────┘
```

**Stock quantity display:**

Shows per-variant stock inline when variants exist. Each quantity field is `72px` wide, linked to the Inventory module. Changes here create a tracked inventory adjustment in the Activity Log.

**Reorder level:**

| Property | Value |
|---|---|
| Help text | `"A low stock alert appears on the dashboard when stock falls below this number."` |
| Validation | Integer, `min="0"` |
| Cross-reference | Feeds the low stock alert panel on the dashboard (§6.5 of admin spec) |

**Stock policy:**

Maps to storefront PDP behaviour:
- `Deny` → "Sold Out" overlay on PDP, CTA becomes "Notify Me"
- `Backorders` → "Pre-order" badge, normal CTA
- `Continue` → No warning, normal CTA

---

### 5.6 Shipping Panel

**Panel heading:** `"Shipping"`

```
┌──────────────────────────────────────────────────────────────────────┐
│  Shipping                                                            │
├──────────────────────────────────────────────────────────────────────┤
│  [ ☑ ] This is a physical product                                    │
│                                                                      │
│  WEIGHT (per unit, for shipping calculation)                         │
│  [ 0.8          ]  [ kg ▾ ]                                         │
│                                                                      │
│  DIMENSIONS                                                          │
│  Length [ 30 ] × Width [ 30 ] × Height [ 45 ] cm                   │
│                                                                      │
│  DELIVERY INFO (shown in PDP Delivery Box §11.10)                   │
│  ─────────────────────────────────────────────────                   │
│  FREE DELIVERY THRESHOLD                                             │
│  [ ☑ ] This product qualifies for free delivery above ₹499          │
│                                                                      │
│  DELIVERY ETA LABEL                                                  │
│  [ 3–5 business days                            ]                   │
│  (Shown as "Free delivery" line in PDP delivery box)                │
│                                                                      │
│  HEALTH GUARANTEE LABEL                                              │
│  [ 7-day health guarantee                       ]                   │
│  (Shown as second row in PDP delivery box)                          │
│                                                                      │
│  PACKAGING LABEL                                                     │
│  [ Eco-friendly packaging                       ]                   │
│  (Shown as third row in PDP delivery box)                           │
└──────────────────────────────────────────────────────────────────────┘
```

**Delivery info mapping:**

These three text fields map to exactly the three rows in the PDP Delivery Info Box (§11.10):

| Admin field | Storefront PDP row |
|---|---|
| Delivery ETA label | `🚚 [value]` |
| Health guarantee label | `🔄 [value]` |
| Packaging label | `📦 [value]` |

Default values auto-populated for plant products:
- ETA: `"3–5 business days"`
- Guarantee: `"7-day health guarantee"`
- Packaging: `"Eco-friendly packaging"`

---

### 5.7 Tabs Content Panel

**Panel heading:** `"Storefront Tab Content"`

This panel manages the three PDP tabs (§11.12): **About This Plant**, **Care Guide**, **Reviews**.

```
┌──────────────────────────────────────────────────────────────────────┐
│  Storefront Tab Content                                              │
├─────────────────────────────────────────────────────────────────────┤
│  [ About This Plant ]  [ Care Guide ]  [ Reviews ]                  │
│                                        ↑ managed via Reviews module  │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ◀ ABOUT THIS PLANT TAB                                             │
│                                                                      │
│  FEATURE LIST (yellow ✦ bullet points shown in About tab body)     │
│  [ ✦ Perfect for home and office spaces                        ] [×]│
│  [ ✦ Air-purifying: removes toxins from the air                ] [×]│
│  [ ✦ Low maintenance: thrives in indirect light                ] [×]│
│  [ + Add feature point ]                                            │
│                                                                      │
│  PLANT SPECIFICATIONS CARD (right column of About tab)             │
│  (Right column in 2-column About layout per PDP §11.12)            │
│  ─────────────────────────────────────────────────────              │
│  Spec Label           Spec Value                                    │
│  [ Botanical Name  ]  [ Monstera deliciosa              ] [×]      │
│  [ Family          ]  [ Araceae                         ] [×]      │
│  [ Origin          ]  [ Central America                 ] [×]      │
│  [ Growth Rate     ]  [ Moderate                        ] [×]      │
│  [ Max Height      ]  [ Up to 3 metres indoors          ] [×]      │
│  [ Pot Type        ]  [ Any — pot not included          ] [×]      │
│  [ + Add spec row ]                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

**About tab — feature list:**

| Property | Value |
|---|---|
| Each item | Text input, `font.size.sm`, full-width |
| Yellow bullet prefix | `✦` non-editable prefix shown in input left padding area |
| `[×]` remove | `20×20px` ghost button right of input |
| Drag reorder | `⠿` handle left of each row |
| `[+ Add feature point]` | Ghost button, appends new input row |
| Max items | `8` |
| PDP mapping | Each item renders as a yellow `✦` bullet in the About tab body text |

**Plant specifications card:**

| Property | Value |
|---|---|
| Each row | Two text inputs: Label + Value |
| Row add/remove | `[+ Add spec row]` / `[×]` per row |
| Drag reorder | `⠿` handle |
| Max rows | `12` |
| PDP mapping | Renders in the right-column spec card with dark green header, alternating row dividers |
| Default rows pre-filled | For "Plant" product type: Botanical Name, Family, Origin, Growth Rate, Max Height, Pot Type |

```
┌──────────────────────────────────────────────────────────────────────┐
│  ◀ CARE GUIDE TAB                                                   │
│  (Populates the 3×2 care card grid in the Care Guide tab §11.12)   │
│                                                                      │
│  CARE CARDS (up to 6 — maps to 3×2 grid on storefront)             │
│  ─────────────────────────────────────────────────────              │
│  CARD 1                                                             │
│  Icon:     [ ☀️ Sunlight ▾ ]                                         │
│  Title:    [ Sunlight                      ]                        │
│  Value:    [ Indirect bright light         ]                        │
│  Detail:   [ Avoid direct sun — can scorch leaves               ]  │
│  Level:    [ ● ● ● ○ ○ ] (1–5 difficulty — 3 filled dots)         │
│  ─────────────────────────────────────────────────────              │
│  CARD 2, 3, 4, 5, 6... (same structure, collapsible)               │
│                                                                      │
│  [+ Add Care Card]                  (max 6 cards)                   │
└──────────────────────────────────────────────────────────────────────┘
```

**Care card fields:**

| Field | Input type | PDP mapping |
|---|---|---|
| Icon | Icon picker dropdown (plant-themed icons) | Card icon in `--color-green-pale` circle |
| Title | Text | Card title (e.g. "Sunlight") |
| Value | Text | Care value (e.g. "Indirect light") |
| Detail | Textarea, `80px` min | Expanded description text in care card body |
| Level (1–5) | 5-dot rating input | Dot indicator row in care card |

**Care level dot input:**

```
Level:  [ ● ● ● ○ ○ ]
```

5 clickable circles. Filled = `pp.accent`; empty = `pp.border`. Click fills up to clicked dot. `role="slider"`, `aria-valuenow="3"`, `aria-valuemin="1"`, `aria-valuemax="5"`, `aria-label="Difficulty level"`.

---

## 6. RIGHT COLUMN PANELS

### 6.1 Status Panel

**Panel heading:** `"Status"`

```
┌────────────────────────────────────────────┐
│  Status                                    │
├────────────────────────────────────────────┤
│  PRODUCT STATUS                            │
│  [ Active        ▾ ]                       │
│                                            │
│  ● Active    — Live on storefront          │
│  ○ Draft     — Hidden from customers       │
│  ○ Archived  — Removed from all listings  │
│                                            │
│  SALES CHANNELS                            │
│  [ ☑ ] Online Store                        │
│  [ ☐ ] Point of Sale                       │
│                                            │
│  PUBLISH DATE (optional — schedule ahead) │
│  [ ☐ ] Schedule publish date              │
│  Date:  [ DD / MM / YYYY ]  Time: [ HH:MM ]│
└────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Status select | Custom dropdown, `36px`, `radius.sm`, `pp.nested-bg` |
| Active | `pp.success` indicator dot |
| Draft | `pp.warning` indicator dot |
| Archived | `pp.help` indicator dot |
| Help text per status | Shown inline below each option |
| Scheduled publish | Shows date/time pickers when checkbox ticked |
| `aria-label` | `"Product status"` on select |

### 6.2 Organisation Panel

**Panel heading:** `"Organisation"`

```
┌────────────────────────────────────────────┐
│  Organisation                              │
├────────────────────────────────────────────┤
│  CATEGORY *                                │
│  [ Indoor Plants              ▾ ]          │
│  (Maps to PLP category filter)             │
│                                            │
│  SUBCATEGORY                               │
│  [ Foliage Plants             ▾ ]          │
│                                            │
│  TAGS                                      │
│  [ indoor ] [×]  [ monstera ] [×]          │
│  [ air-purifying ] [×]  [+ Add tag]        │
│                                            │
│  COLLECTIONS                               │
│  [ ☑ ] Bestsellers                         │
│  [ ☐ ] New Arrivals                        │
│  [ ☑ ] Air Purifying Plants                │
│  [ ☐ ] Pet Friendly                        │
│  [ ☐ ] Low Maintenance                     │
│  [ ☐ ] Gifting                             │
└────────────────────────────────────────────┘
```

**Category select:**

| Property | Value |
|---|---|
| Options | Indoor Plants · Outdoor Plants · Flowering Plants · Succulents & Cacti · Seeds · Soil & Fertiliser · Tools · Pots & Planters |
| Help text | `"Controls which category filter this product appears under on the PLP."` |
| Required | Yes |

**Tags:**

| Property | Value |
|---|---|
| Input type | Free-text with `Enter` to add; shows as removable chips |
| Chip style | `pp.nested-bg` bg, `pp.border` border, `radius.full`, `font.size.xs` |
| `[×]` | Removes tag |
| Suggestion | Shows matching existing tags in dropdown as user types |

**Collections:**

Checkboxes map to Shopify collections or internal tag groups. These control which curated lists the product appears in on the homepage and PLP.

### 6.3 Product Type Panel

**Panel heading:** `"Product Type"`

> This is the most important right-column panel. It enforces the product type rules from PDP §11.15 and controls which panels render in the left column.

```
┌────────────────────────────────────────────┐
│  Product Type                              │
├────────────────────────────────────────────┤
│  PRODUCT TYPE *                            │
│  ( ● ) 🌿 Plant (bare-root)               │
│  ( ○ ) 🪴 Pot / Planter                   │
│  ( ○ ) 🌱 Seed / Bulb                     │
│  ( ○ ) 🧱 Soil / Fertiliser               │
│  ( ○ ) 🔧 Tool / Accessory                │
│                                            │
│  PRODUCT RULES (auto-shown for selection): │
│                                            │
│  🌿 Plant selected:                        │
│  ✓ Size/Height variant type auto-set       │
│  ✓ Pot Upsell Strip panel shown            │
│  ✓ Care Info panel shown                   │
│  ✓ "Pot not included" hint on size pills   │
│  ✗ Pot selector never shown as variant     │
│                                            │
└────────────────────────────────────────────┘
```

**Product type radio group:**

| Property | Value |
|---|---|
| `role` | `role="radiogroup"`, `aria-label="Product type"` |
| `aria-required` | `true` |
| On change | Updates visible panels, variant type lock, and size pill hints |
| Help text per type | Inline below each radio |

**Panel visibility rules by product type:**

| Panel | Plant | Pot | Seed | Soil | Tool |
|---|---|---|---|---|---|
| Variants (Size/Height) | ✅ | ✅ Diameter | ✅ Pack size | ✅ Weight | Optional |
| Care Info Panel | ✅ | ❌ | ✅ | ❌ | ❌ |
| Pot Upsell Panel | ✅ | ❌ | ❌ | ❌ | ❌ |
| Quick-care chips data | ✅ | ❌ | ❌ | ❌ | ❌ |
| Shipping dimensions | All | All | All | All | All |

When a panel is hidden, its section collapses with `display: none` and its data is not required for saving.

### 6.4 Care Info Panel

**Panel heading:** `"Care Quick-Chips"`

> Shown only when Product Type = Plant. Maps to PDP §11.8.

```
┌────────────────────────────────────────────┐
│  Care Quick-Chips                          │
│  (4-column grid shown on storefront PDP)   │
├────────────────────────────────────────────┤
│  LIGHT                                     │
│  [ Indirect Bright Light    ▾ ]            │
│                                            │
│  WATER FREQUENCY                           │
│  [ Weekly                   ▾ ]            │
│                                            │
│  TEMPERATURE RANGE                         │
│  [ 18–27°C                  ]              │
│                                            │
│  SKILL LEVEL                               │
│  [ Beginner                 ▾ ]            │
│                                            │
│  PET FRIENDLY                              │
│  [ ☑ ] Safe for pets                       │
│                                            │
│  AIR PURIFYING                             │
│  [ ☑ ] Air purifying plant                 │
│                                            │
│  ─ Preview ─                               │
│  ┌────┬────┬────┬────┐                    │
│  │ ☀️  │ 💧  │ 🌡  │ 🌿 │                    │
│  │Indirect│Weekly│18-27│Begin│             │
│  └────┴────┴────┴────┘                    │
└────────────────────────────────────────────┘
```

**Light dropdown options:**
Full Sun · Partial Sun · Indirect Bright Light · Low Light · Shade

**Water frequency options:**
Daily · Every 2–3 days · Weekly · Bi-weekly · Monthly

**Skill level options:**
Beginner · Intermediate · Expert

**Chip preview:**
A live 4-column mini-preview of exactly how the care chips will look on the PDP. Updates on each field change. Rendered using the same layout tokens as the PDP care chips section.

**PDP mapping:**
Each dropdown value maps to a chip in the PDP §11.8 4-column care grid:
- Light → ☀️ chip
- Water → 💧 chip
- Temperature → 🌡️ chip
- Skill → 🌬️ chip

### 6.5 Pot Upsell Panel

**Panel heading:** `"Pot Upsell Strip"`

> Shown only when Product Type = Plant. Maps to PDP §11.6.

```
┌────────────────────────────────────────────┐
│  Pot Upsell Strip                          │
│  (Shown on PDP below size selector)        │
├────────────────────────────────────────────┤
│  SECTION LABEL                             │
│  [ Pair it with a pot         ]            │
│  (Shown above the pot chips)               │
│                                            │
│  FEATURED POTS (link to pot PDPs)          │
│  ┌──────────────────────────────────┐     │
│  │ [🪴 img] Terracotta Pot   ₹299  [×]│   │
│  │ [🪴 img] White Ceramic    ₹449  [×]│   │
│  │ [🪴 img] Jute Basket      ₹199  [×]│   │
│  └──────────────────────────────────┘     │
│  [+ Add Pot]  (product picker modal)       │
│                                            │
│  SHOW "All Pots →" LINK                   │
│  [ ☑ ] Show link to all pots collection   │
│                                            │
│  ─────────────────────────────────────     │
│  ℹ️  Clicking a pot chip on the storefront │
│     navigates to that pot's own PDP.       │
│     Pots are never variants of this plant. │
└────────────────────────────────────────────┘
```

**Featured pots table:**

| Property | Value |
|---|---|
| Rows | Up to 6 featured pot products |
| Thumbnail | `40×40px`, `radius.xs`, `object-fit: cover` |
| Product name | `font.size.sm`, `pp.value` |
| Price | `font.size.xs`, `pp.help` |
| `[×]` | Removes from upsell strip |
| Drag reorder | `⠿` handle — order = chip display order on PDP |
| `[+ Add Pot]` | Opens product picker modal — filtered to Pots category |

**Product picker modal:**

```
┌──────────────────────────────────────────────────┐
│  Select Pots for Upsell Strip            [×]     │
├──────────────────────────────────────────────────┤
│  [🔍 Search pots...                         ]    │
├──────────────────────────────────────────────────┤
│  [ ☐ ] [img] Terracotta Pot           ₹299       │
│  [ ☐ ] [img] White Minimalist Pot     ₹449       │
│  [ ☑ ] [img] Jute Basket              ₹199       │
├──────────────────────────────────────────────────┤
│  [ Cancel ]          [ Add Selected (1) ]        │
└──────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Max select | `6` |
| Filter | Category = "Pots / Planters", Status = Active |
| Search | Name and SKU |
| Selected indicator | `pp.accent-bg` row bg, `pp.accent` checkbox |

### 6.6 SEO Panel

**Panel heading:** `"SEO & Search Visibility"`

Maps to storefront meta tags and URL structure.

```
┌────────────────────────────────────────────┐
│  SEO & Search Visibility             [Edit]│
├────────────────────────────────────────────┤
│  SEARCH PREVIEW                            │
│  ┌──────────────────────────────────────┐  │
│  │ heroplants.com/products/monstera-m   │  │
│  │ Monstera Deliciosa (M) — Hero Plants │  │
│  │ A statement indoor plant with iconic │  │
│  │ split leaves. Free delivery over ₹499│  │
│  └──────────────────────────────────────┘  │
│  (Live preview of Google search result)    │
│                                            │
│  PAGE TITLE                                │
│  [ Monstera Deliciosa (M) — Hero Plants]   │
│  62 / 70 characters                        │
│                                            │
│  META DESCRIPTION                          │
│  [ A statement indoor plant...         ]   │
│  128 / 160 characters                      │
│                                            │
│  URL HANDLE                                │
│  heroplants.com/products/                  │
│  [ monstera-deliciosa-medium          ]    │
│  (Auto-generated from title; editable)     │
└────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Collapsed by default | `[Edit]` button expands fields |
| Search preview box | Live preview; updates on field changes |
| Preview bg | `admin.color.bg.canvas`, white simulated Google card |
| Page title max | `70 chars` — counter turns `pp.warning` at `65+`, `pp.error` at `71+` |
| Meta description max | `160 chars` — same counter behaviour |
| URL handle | Auto-generated from product title; lowercase, hyphenated, no special chars |
| URL edit | Editable; validation: no spaces, no special chars except `-` |
| SEO score (optional) | `[Good / Needs improvement]` badge based on title + description completeness |
| `aria-label` on each | `"SEO page title"`, `"SEO meta description"`, `"URL handle"` |

### 6.7 Storefront Preview Panel

**Panel heading:** `"Storefront Preview"`

```
┌────────────────────────────────────────────┐
│  Storefront Preview              [Open ↗]  │
├────────────────────────────────────────────┤
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │  [Product image — 1:1 thumbnail]     │  │
│  │                                      │  │
│  │  Monstera Deliciosa                  │  │
│  │  Swiss Cheese Plant                  │  │
│  │  ★★★★☆ 4.3  (1,204)                │  │
│  │  ₹399  ~~₹599~~  −33% off           │  │
│  │  Size: [S] [M*] [L]                  │  │
│  │  [ + Add to Cart ]                   │  │
│  └──────────────────────────────────────┘  │
│                                            │
│  Preview shows how this product appears   │
│  as a card on the PLP and as the PDP.     │
│                                            │
│  [ Preview PDP → ]   [ Preview PLP Card ]  │
└────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Preview card | Scaled-down replica of the storefront PDP card component |
| Updates | Reflects current unsaved form data in real-time |
| "Open ↗" | Opens live storefront in new tab (only works if product is Active/Published) |
| "Preview PDP →" | Opens admin-side preview at `/admin/products/[id]/preview` |
| "Preview PLP Card" | Opens a modal showing how the product appears as a PLP grid card |

---

## 7. Sticky Save Bar

Permanently pinned at the bottom of the content area. Always visible regardless of scroll position.

```
┌──────────────────────────────────────────────────────────────────────┐
│  [← Discard Changes]     Last saved: 2 mins ago          [Save Draft] [Publish]│
└──────────────────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Position | `position: sticky; bottom: 0; z-index: 50` |
| Background | `admin.color.bg.sidebar` |
| Border-top | `1px solid pp.panel-border` |
| Padding | `space.7 = 16px` vertical, `space.9 = 24px` horizontal |
| Height | `64px` |
| Layout | Flex, space-between |
| Backdrop blur | `backdrop-filter: blur(8px)` |

**"Discard Changes":**

| Property | Value |
|---|---|
| Style | Ghost button, `pp.error` text |
| Enabled | Only when form is dirty (unsaved changes exist) |
| On click | Confirm modal: `"Discard all unsaved changes? This cannot be undone."` |
| `aria-label` | `"Discard all unsaved changes"` |

**"Last saved" indicator:**

| Property | Value |
|---|---|
| Font | `font.size.xs`, `pp.help` |
| Updates | After every successful auto-save (every 30s) or manual save |
| Content | `"Last saved: 2 mins ago"` / `"Unsaved changes"` |
| Auto-save | Every 30s to draft; shows `"Saving..."` during save |
| Dirty indicator | `"Unsaved changes"` in `pp.warning` when form modified |

**"Save Draft":**

| Property | Value |
|---|---|
| Style | Secondary outlined, `pp.border`, `pp.value` text |
| Height | `36px`, `radius.sm` |
| Action | Saves all data, status → Draft |
| Loading | Spinner, `aria-busy="true"` |
| Success | Brief `"✓ Draft saved"` text + toast |

**"Publish":**

| Property | Value |
|---|---|
| Style | Primary filled, `pp.accent` bg, `admin.color.text.white` |
| Height | `36px`, `radius.sm` |
| Action | Saves all data, status → Active, makes live on storefront |
| Pre-publish validation | Runs required field check; shows error panel if any required fields missing |
| Loading | Spinner, `aria-busy="true"` |
| Success | Status badge updates to `Active ●`, toast `"Product published successfully."` |
| Required check | Title, Price, at least 1 image, Category, Product Type, at least 1 variant |

---

## 8. Validation System

### 8.1 Required Fields

| Field | Required | Condition |
|---|---|---|
| Product title | ✅ Always | |
| Current price | ✅ Always | |
| At least 1 image | ✅ Always | |
| Category | ✅ Always | |
| Product type | ✅ Always | |
| At least 1 variant | ✅ If variants enabled | |
| Variant SKU | ✅ Per variant | Must be unique |
| Size name | ✅ Per variant | |
| Variant price | ✅ Per variant | |

### 8.2 Validation Rules

| Rule | Error message |
|---|---|
| Title blank | `"Product title is required."` |
| Title > 120 chars | `"Title must be 120 characters or fewer."` |
| Price blank | `"Current price is required."` |
| Price ≤ 0 | `"Price must be greater than ₹0."` |
| Compare-at < current | `"Compare-at price must be greater than the current price."` |
| No images | `"Upload at least one product image."` |
| Duplicate SKU | `"SKU '[value]' is already in use by another product."` |
| URL handle taken | `"This URL handle is already in use. Please choose a different one."` |
| SEO title > 70 chars | `"SEO title should be 70 characters or fewer for best results."` (warning, not block) |
| Meta desc > 160 chars | `"Meta description should be 160 characters or fewer."` (warning) |
| Care level not set | Warning: `"Care level is not set. It will appear empty on the storefront."` |

### 8.3 Validation Display

**Inline field errors:**

```
CURRENT PRICE *
[ ₹ 0         ] ← red border
⚠ Price must be greater than ₹0.
```

| Property | Value |
|---|---|
| Error border | `2px solid pp.error` |
| Error bg | `pp.error` @ 5% |
| Error text | `font.size.xs`, weight 500, `pp.error`, with `⚠` prefix |
| `aria-invalid` | `"true"` on input |
| `aria-describedby` | Points to error message `id` |
| `role="alert"` | On error message |

**Pre-publish error summary panel:**

Appears above the sticky save bar when "Publish" is clicked with validation errors:

```
┌──────────────────────────────────────────────────────────────────────┐
│  ✕  This product can't be published yet. Fix 3 issues:              │
│  • Product title is required.                                        │
│  • Upload at least one product image.                                │
│  • At least one size variant is required.                            │
└──────────────────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Background | `pp.error` @ 8% |
| Border | `1px solid pp.error` |
| Border-radius | `radius.sm` |
| Padding | `space.7 = 16px` |
| Font | `font.size.sm`, `pp.error` |
| Each error | Bullet list, links to the offending field (scroll + focus) |
| `role` | `"alert"`, `aria-live="assertive"` |
| Dismiss | `×` button top-right |

---

## 9. Unsaved Changes Guard

When the admin navigates away from a dirty (unsaved) form, show a browser-native `beforeunload` dialog or a custom modal:

```
┌──────────────────────────────────────────────┐
│  Leave without saving?                 [×]  │
│                                              │
│  You have unsaved changes to this product.   │
│  They will be lost if you leave.             │
│                                              │
│  [ Stay on page ]    [ Leave without saving ]│
└──────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Trigger | Route change / tab close / browser back when `isDirty = true` |
| "Stay on page" | `pp.accent` filled — safe default, has focus on open |
| "Leave without saving" | Ghost, `pp.error` text |
| `role` | `role="alertdialog"`, `aria-modal="true"` |
| Focus | Moves to "Stay on page" on open |

---

## 10. Auto-Save System

| Property | Value |
|---|---|
| Interval | Every `30s` when form is dirty |
| Saves to | Draft status (never auto-publishes) |
| Indicator | `"Saving..."` → `"Last saved: just now"` |
| Failure | `"Auto-save failed. Check your connection."` toast warning |
| Conflict | If another admin saved in the meantime: `"This product was updated by [name] while you were editing. [View Changes] [Overwrite]"` |
| Activity log | Every auto-save creates a log entry: `"Auto-saved by [admin]"` |
| localStorage backup | Additionally saves form state to `localStorage` keyed by product ID in case of browser crash |

---

## 11. Product Duplication

Triggered by the "Duplicate" button in the page header.

**Duplicate modal:**

```
┌──────────────────────────────────────────────────────────────┐
│  Duplicate Product                                    [×]   │
│  This will create a copy of:                               │
│  "Monstera Deliciosa"                                      │
│                                                            │
│  New product title:                                        │
│  [ Monstera Deliciosa (Copy)                         ]    │
│                                                            │
│  Duplicate:                                                │
│  [☑] All product information and descriptions             │
│  [☑] Pricing and variants                                 │
│  [☑] Care info and specifications                         │
│  [☑] SEO settings                                         │
│  [☐] Media (images)  ← copies references, not files      │
│                                                            │
│  Status of duplicate:  ( ● ) Draft  ( ○ ) Active         │
│                                                            │
│  [ Cancel ]         [ Create Duplicate ]                  │
└──────────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| New SKU | Auto-suffixed: `SKU-MM-001-COPY` |
| URL handle | Auto-suffixed: `monstera-deliciosa-medium-copy` |
| Status | Defaults to Draft — admin must explicitly publish |
| After creation | Redirect to new product's edit page with toast: `"Duplicate created. Review and publish when ready."` |

---

## 12. Delete Product Flow

Triggered by the "Delete" button. Requires double-confirmation for products with order history.

**Step 1 — Confirm delete modal:**

```
┌─────────────────────────────────────────────────────────────┐
│  Delete "Monstera Deliciosa"?                         [×]  │
│                                                            │
│  ⚠️  This product has been ordered 248 times.              │
│     Deleting it will remove it from the storefront        │
│     but will not affect existing order records.           │
│                                                            │
│  To confirm, type the product name:                       │
│  [ Monstera Deliciosa                               ]     │
│                                                            │
│  [ Cancel ]           [ Delete Product ]                  │
└─────────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Warning | If product has orders, show count and `pp.warning` border-left panel |
| Confirmation input | Must match product title exactly; case-insensitive |
| "Delete Product" button | `pp.error` bg; disabled until title matches |
| Alternative | Suggest "Archive instead" link — less destructive |
| After delete | Redirect to Products list; toast: `"[Product name] was deleted."` |
| `role` | `role="alertdialog"` |

---

## 13. Activity Log (Product-Specific)

A tab-style panel at the very bottom of the left column, below all other panels, showing the edit history for this specific product.

```
┌──────────────────────────────────────────────────────────────────────┐
│  Activity Log                                   [View Full Log →]    │
├────────────────┬─────────────────────────┬──────────────────────────┤
│  DATE          │  ADMIN                  │  ACTION                  │
├────────────────┼─────────────────────────┼──────────────────────────┤
│  Today 10:24AM │  Priya K.               │  Changed price to ₹399  │
│  Today 09:15AM │  Auto-save              │  Auto-saved (draft)      │
│  15 Jun 3:42PM │  Ravi S.                │  Published product       │
│  15 Jun 2:11PM │  Ravi S.                │  Uploaded 3 images       │
│  15 Jun 1:05PM │  Ravi S.                │  Created product (draft) │
└────────────────┴─────────────────────────┴──────────────────────────┘
```

| Property | Value |
|---|---|
| Rows shown | Last 5 actions |
| "View Full Log →" | Links to `/admin/activity-log?product=[id]` |
| Date | `font.size.xs`, `pp.help`, `<time>` element |
| Admin | Avatar (16px) + name, `font.size.xs` |
| Action | `font.size.xs`, `pp.value` |
| Panel bg | `pp.panel-bg` |
| Collapsed by default | Expandable section — `[Show activity log ▾]` |

---

## 14. Accessibility Requirements

### 14.1 Focus Management

- Page load (edit): Focus set to product title field
- Page load (new): Focus set to product title field
- Panel open (e.g. SEO edit expand): Focus moves to first field in panel
- Modal open: Focus trapped; moves to modal heading or safe action
- Modal close: Focus returns to trigger
- Validation error: Focus moves to first error field after failed submit
- Tab switching (Storefront Content): Focus moves to first field in revealed tab
- Save success: Focus returns to "Publish" button; toast announced
- Delete: After deletion, focus moves to Products list page `<h1>`

### 14.2 Full ARIA Map

| Component | ARIA |
|---|---|
| Breadcrumb | `<nav aria-label="Breadcrumb">`, `aria-current="page"` |
| Product title input | `aria-label="Product title"`, `aria-required="true"` |
| Rich text editor | `role="textbox"`, `aria-multiline="true"`, `aria-label="Full description"` |
| Media upload zone | `aria-label="Upload product images"`, `aria-describedby` |
| Image thumbnail | `aria-label="Image [n]: [filename]. [Role]. Drag to reorder."` |
| Variant type radios | `role="radiogroup"`, `aria-label="Variant type"` |
| Variant table | `role="grid"`, `aria-label="Size variants"` |
| Variant row | `role="row"` |
| Variant cell | `role="gridcell"` |
| Care level dots | `role="slider"`, `aria-valuemin/max/now`, `aria-label="Difficulty level"` |
| Product type radios | `role="radiogroup"`, `aria-label="Product type"`, `aria-required` |
| Collections checkboxes | `role="group"`, `aria-label="Collections"` |
| Status select | `aria-label="Product status"` |
| Publish button | `aria-busy="true"` during save |
| Save draft button | `aria-busy="true"` during save |
| Discard button | `aria-label="Discard all unsaved changes"` |
| Unsaved changes guard | `role="alertdialog"`, `aria-modal`, focus on safe action |
| Validation summary | `role="alert"`, `aria-live="assertive"` |
| Inline error messages | `role="alert"`, `aria-live="polite"` |
| Error input | `aria-invalid="true"`, `aria-describedby` pointing to error |
| Pot picker modal | `role="dialog"`, `aria-modal`, focus trap |
| Duplicate modal | `role="dialog"`, `aria-modal`, focus trap |
| Delete modal | `role="alertdialog"`, `aria-modal` |
| Confirmation input | `aria-label="Type product name to confirm deletion"` |
| SEO title counter | `aria-live="polite"` — announces count on change |
| Auto-save indicator | `aria-live="polite"` — announces save state |
| Activity log | `role="log"`, `aria-label="Product activity log"` |
| Preview panel | `aria-label="Storefront preview"` |
| Sticky save bar | `role="region"`, `aria-label="Save actions"` |
| Tab buttons | `role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls` |
| Tab panels | `role="tabpanel"`, `aria-labelledby` |

### 14.3 Keyboard Navigation

| Key | Behaviour |
|---|---|
| `Tab` | Forward through all form fields and buttons |
| `Shift+Tab` | Backward |
| `Enter` | Submit focused button; expand collapsed section |
| `Space` | Toggle checkbox; select radio; activate toggle |
| `Arrow keys` | Navigate radio groups; change care level dots; move between variant table cells |
| `Escape` | Close modal; close open dropdown |
| `⌘S / Ctrl+S` | Save Draft |
| `⌘Enter` | Publish |
| `Delete` (in image grid) | Removes focused image (with confirm) |
| `Tab / Shift+Tab` in table | Navigate between variant table cells |

### 14.4 Testable Acceptance Criteria

| # | Criterion | Method | Pass |
|---|---|---|---|
| A1 | No contrast failures | axe DevTools | Zero critical |
| A2 | All focus rings visible (`2px solid #00b566` + glow) | Manual Tab | Every element |
| A3 | Product title field focused on page load | Keyboard | Title receives focus |
| A4 | Validation errors announced on publish attempt | Screen reader | `aria-live="assertive"` fires |
| A5 | Error focus moves to first invalid field | Keyboard | First error field focused |
| A6 | Media upload zone keyboard-operable | Keyboard | Enter opens file picker |
| A7 | Variant table navigable by arrows | Keyboard | Arrow keys move between cells |
| A8 | All modals trap focus | Keyboard | Tab cycles inside only |
| A9 | Modals close on Escape | Keyboard | Dialog closes; focus returns |
| A10 | Auto-save announced to screen readers | Screen reader | `aria-live="polite"` fires |
| A11 | Unsaved changes guard safe action has focus | Keyboard | "Stay on page" focused on modal open |
| A12 | Delete confirmation type-to-confirm | Keyboard + SR | Input `aria-label` read; button disabled until match |
| A13 | Care level dots keyboard-operable | Keyboard | Arrow keys change value |
| A14 | `prefers-reduced-motion` respected | OS setting | All panel animations removed |
| A15 | Rich text editor accessible | Screen reader | `role="textbox"` announced |

---

## 15. Performance Requirements

| Metric | Target | Rule |
|---|---|---|
| Page load (edit existing) | `< 1.5s` | Product data SSR; panels render immediately |
| Page load (new product) | `< 1s` | Empty form, no API calls needed |
| Image upload feedback | `< 200ms` | Local thumbnail shown before upload completes |
| Auto-save | `< 500ms` | Background; no UI blocking |
| Variant table interaction | `< 100ms` | Local state only; no API on each keystroke |
| Rich text editor load | `< 300ms` | Lazy-loaded; skeleton shown |
| Preview panel update | `< 150ms` | Derived from local form state; no API |
| Publish validation | `< 100ms` | Client-side only (pre-API check) |
| Publish API call | `< 2s` | Show loading state; success/error handled |

---

## 16. PDP → Admin Field Mapping Reference

This is the master cross-reference table. Every field visible on the storefront PDP is traceable to an admin panel field. Use this during QA to verify the admin → storefront data flow.

| Storefront PDP Element | PDP Section | Admin Panel | Admin Field |
|---|---|---|---|
| Product name (large title) | §11.2 | Product Info | Title |
| Subspecies/common name | §11.2 | Product Info | Common Name |
| Product image (main) | §11.1 | Media | Image #1 |
| Thumbnail images | §11.1 | Media | Images #2–4 |
| Current price | §11.4 | Pricing | Current Price |
| Strikethrough price | §11.4 | Pricing | Compare At Price |
| Discount badge | §11.4 | Pricing | Discount Badge Text (or auto) |
| Tax note | §11.4 | Pricing | Price Note + Tax checkbox |
| Size pill labels | §11.5 | Variants | Size Name per variant |
| Size pill height range | §11.5 | Variants | Height Range per variant |
| Size detail — Best for | §11.5 | Variants | Best For (variant detail) |
| Size detail — Pot dia. | §11.5 | Variants | Pot Diameter (variant detail) |
| Size detail — Dispatch | §11.5 | Variants | Dispatch (variant detail) |
| "Pot not included" hint | §11.5 | Product Type | Auto-shown when type = Plant |
| Pot upsell chip labels | §11.6 | Pot Upsell | Featured Pots (names) |
| Pot upsell chip prices | §11.6 | Pot Upsell | Featured Pots (prices — from pot PDP) |
| Pot upsell section label | §11.6 | Pot Upsell | Section Label field |
| "All Pots →" link | §11.6 | Pot Upsell | Show "All Pots" toggle |
| Quantity stepper | §11.7 | Inventory | Track inventory + stock |
| Care chip — Light | §11.8 | Care Info | Light dropdown |
| Care chip — Water | §11.8 | Care Info | Water Frequency dropdown |
| Care chip — Temperature | §11.8 | Care Info | Temperature Range field |
| Care chip — Skill | §11.8 | Care Info | Skill Level dropdown |
| Add to Cart CTA | §11.9 | Inventory | Stock Policy (Active/Sold Out) |
| Delivery ETA row | §11.10 | Shipping | Delivery ETA Label |
| Health guarantee row | §11.10 | Shipping | Health Guarantee Label |
| Packaging row | §11.10 | Shipping | Packaging Label |
| AI Care strip | §11.11 | — | Auto-shown on all plant PDPs |
| About tab — body text | §11.12 | Tabs → About | Full Description (rich text) |
| About tab — feature list | §11.12 | Tabs → About | Feature List |
| About tab — spec card | §11.12 | Tabs → About | Plant Specifications |
| Botanical name | §11.12 | Product Info | Botanical Name |
| Care guide cards (6) | §11.12 | Tabs → Care Guide | Care Cards (up to 6) |
| Care card level dots | §11.12 | Tabs → Care Guide | Level (1–5) |
| Reviews tab | §11.12 | — | Managed via Reviews module |
| Related products grid | §11.13 | Organisation | Collections membership |
| PDP URL | — | SEO | URL Handle |
| `<title>` tag | — | SEO | Page Title |
| `meta description` | — | SEO | Meta Description |
| Product category (PLP filter) | — | Organisation | Category |
| Collections (PLP/homepage) | — | Organisation | Collections checkboxes |

---

## 17. Anti-Patterns & Prohibited Implementations

| Anti-pattern | Why prohibited | Correct approach |
|---|---|---|
| Raw hex values in CSS | Breaks admin token system | Use `admin.*` / `pp.*` semantic aliases |
| `outline: none` on any field | Kills keyboard access | `outline: 2px solid pp.focus-ring` always |
| Allowing pot as a variant of a plant | Violates PDP §11.15 product rules | Pot Upsell Panel only; variant type locked per product type |
| Auto-publishing on save | Risk of live errors | "Publish" is always an explicit separate action |
| Deleting without confirmation | Irreversible data loss | Always show `role="alertdialog"` with product name |
| Form submit without client validation | Server round-trip wasted | Client-side validation on publish/save |
| Saving without auto-save conflict check | Data loss from concurrent edits | Always check `updated_at` timestamp; show conflict modal |
| Rich text editor auto-injecting `<style>` tags | Breaks storefront rendering | Strip disallowed tags before save; whitelist: `h2 h3 p ul ol li a strong em` |
| Allowing `<script>` in rich text | XSS vulnerability | Sanitise on save + preview render |
| Uploading images > 10MB without warning | Silent failure | Validate client-side; show error before upload attempt |
| Storing SEO title > 70 chars without warning | Poor SEO | Warn (not block) at 65+; error at 71+ |
| Removing "Pot not included" hint for plant products | Violates PDP design rule §11.5 | Hint auto-shown; cannot be toggled off for Plant type |
| Showing variant table for products with no variants | Confusing empty table | Only show variant table after admin enables variants |
| Creating duplicate SKU | Inventory tracking failure | Validate uniqueness on blur + on save |
| Reordering images without confirming main image change | Unexpected PDP change | Toast: `"Image order changed. Image #1 is now the main PDP image."` |
| Closing "Product type" to change after variants added | Data loss of variant type-specific fields | Show warning: `"Changing product type will reset variant type. [Confirm]"` |

---

## 18. Edge-Case Handling

| Scenario | Behaviour |
|---|---|
| New product, no title typed | All fields enabled but "Publish" disabled; tooltip on hover: `"Add a title to publish"` |
| Product with 0 variants enabled | Shows single price row only; no variant table |
| Product with 50+ variants | Paginate variant table (25/page); search/filter by variant name |
| Image upload fails (network) | Error toast: `"Upload failed for [filename]. Try again."` + retry button on thumbnail |
| Image upload format unsupported | Inline error: `"[filename] is not supported. Upload JPG, PNG, or WebP."` |
| Very long product title (> 120) | Character counter turns red; inline error; publish blocked |
| Duplicate SKU on save | Field turns red; inline error with link to conflicting product |
| URL handle already taken | SEO field error with suggestion: `"monstera-deliciosa-medium-2"` |
| Rich text paste of HTML from external source | Strip non-whitelisted tags silently; show toast: `"Some formatting was removed on paste."` |
| Concurrent admin editing same product | Conflict modal with diff view on next save attempt |
| Internet drops during publish | Loading spinner remains; error after `15s` timeout: `"Publish failed. Your changes are saved as draft."` |
| Product type change after variant data entered | Confirmation modal: `"Changing product type will clear current variant settings. Continue?"` |
| Delete product with active cart items | Warning: `"This product is in [n] customer carts. Deleting will remove it from those carts."` |
| Product with pending returns | Warning: `"This product has pending returns. Consider archiving instead of deleting."` |
| Image reorder (first image changes) | Toast: `"Main image updated. [Image name] is now the primary PDP image."` |
| Feature list with > 8 items | `[+ Add feature point]` becomes disabled; tooltip: `"Maximum 8 feature points."` |
| Pot upsell: linked pot product deleted | Warning banner: `"'[Pot name]' in your upsell strip has been deleted. [Remove from strip]"` |
| SEO fields left empty | Warning chip on SEO panel header: `"SEO incomplete"` (amber); blocks nothing |

---

## 19. QA Checklist

### Visual
- [ ] Page background: `admin.color.bg.canvas` (#0f1117)
- [ ] All panels: `admin.color.bg.surface` (#1c2128) bg, `admin.color.border.default` border
- [ ] All inputs: `admin.color.bg.elevated` (#22272e) bg
- [ ] All text: `Outfit` font; SKUs/IDs in monospace
- [ ] No raw hex in CSS — all through `admin.*` / `pp.*` tokens
- [ ] Media upload: dashed border normal; solid green border on drag-active
- [ ] "PRIMARY" badge on first image: green bg, white text
- [ ] Variant table: row hover green-tinted bg; selected row green-tinted bg
- [ ] Care level dots: green filled / border-only unfilled
- [ ] Live preview panel: mirrors PDP card appearance accurately
- [ ] Status badge colours: Active green / Draft amber / Archived grey
- [ ] Sticky save bar: visible at all scroll positions; correct background blur
- [ ] Validation errors: red border + red text + ⚠ prefix
- [ ] "Publish" button: `admin.accent` green; loading spinner on click

### Interaction
- [ ] Product title: autofocused on page load
- [ ] Image upload: drag-and-drop + click to browse both work
- [ ] Image reorder: drag handle works; order persists on save
- [ ] Remove image: `×` button removes; toast confirms
- [ ] Variant inline edit: clicking cell makes it editable; Tab advances to next
- [ ] Size detail card expands on variant row click
- [ ] Care level dots: click fills to that level; keyboard arrow keys work
- [ ] Product type change: correct panels show/hide immediately
- [ ] Pot picker modal: search, select, add all work
- [ ] SEO preview: updates in real-time as title/description are typed
- [ ] Auto-save: triggers every 30s; indicator updates; never auto-publishes
- [ ] Unsaved changes guard: fires on navigate-away when form is dirty
- [ ] Duplicate modal: new title pre-filled; creates draft on confirm
- [ ] Delete type-to-confirm: button disabled until title matches exactly
- [ ] Publish validation: required fields checked; error summary shown; errors scrolled to
- [ ] ⌘S saves draft; ⌘Enter publishes

### PDP Mapping Verification
- [ ] Title → PDP product name heading
- [ ] Common name → PDP subtitle under name
- [ ] Image #1 → PDP main image
- [ ] Images #2-4 → PDP thumbnail strip
- [ ] Current price → PDP price display
- [ ] Compare-at → PDP strikethrough price
- [ ] Discount badge → PDP amber pill badge
- [ ] Variant size names → PDP size pill labels
- [ ] Variant height ranges → PDP size detail card
- [ ] Care chips (Light/Water/Temp/Skill) → PDP 4-column care grid
- [ ] Delivery ETA/guarantee/packaging → PDP delivery box rows
- [ ] Feature list → About tab bullet points
- [ ] Plant specs → About tab specification card
- [ ] Care guide cards → Care Guide tab 3×2 grid
- [ ] Pot upsell featured pots → PDP pot upsell chip strip

### Accessibility
- [ ] axe DevTools: zero critical/serious errors
- [ ] All focus rings: `2px solid #00b566` + green glow on every element
- [ ] Title input focused on page load
- [ ] Validation `aria-live="assertive"` fires on publish attempt
- [ ] First error field receives focus after validation fail
- [ ] All modals: focus trap, Escape close, focus return to trigger
- [ ] Upload zone keyboard-operable (Enter opens picker)
- [ ] Variant table navigable by arrow keys
- [ ] Care level dots: `role="slider"` with correct ARIA
- [ ] Rich text editor: `role="textbox"`, `aria-multiline`
- [ ] `prefers-reduced-motion`: panel animations, auto-save animation disabled

### Data Integrity
- [ ] Duplicate SKU caught at field blur and at save
- [ ] Compare-at < current price shows validation error
- [ ] Product type change warning fires when variants already entered
- [ ] Auto-save never changes status from Draft → Active
- [ ] Concurrent edit conflict detected on save
- [ ] Deleted product removed from pot upsell strips of other products
- [ ] Image order change triggers toast about primary image change

---

## 20. Summary — Panel Map

```
Admin Product Edit Page — Panel Map
═══════════════════════════════════════════════════════════════════════
LEFT COLUMN (65%)
├── §5.1  Product Info Panel
│         Title · Short description · Full description (rich text)
│         Botanical name · Common name
├── §5.2  Media Panel
│         Drag-and-drop upload zone · Image thumbnails (reorderable)
│         Primary image badge · PDP order mapping info
├── §5.3  Pricing Panel
│         Current price · Compare-at price · Cost per unit
│         Discount badge text · Tax settings · Price note
├── §5.4  Variants Panel
│         Variant type selector · Variant table (inline edit)
│         Size detail card data per variant
│         Product-type locked variant rules
├── §5.5  Inventory Panel
│         Base SKU · Stock per variant · Reorder level
│         Stock policy (deny / backorder / continue)
├── §5.6  Shipping Panel
│         Weight · Dimensions
│         Delivery ETA, health guarantee, packaging labels
├── §5.7  Storefront Tab Content Panel
│         → About tab: Feature list + Plant specs table
│         → Care Guide tab: Care cards (up to 6) with level dots
│         → Reviews: managed via Reviews module
└── §13   Activity Log Panel (collapsed by default)

RIGHT COLUMN (35%, sticky)
├── §6.1  Status Panel
│         Active / Draft / Archived · Sales channels · Schedule publish
├── §6.2  Organisation Panel
│         Category · Subcategory · Tags · Collections
├── §6.3  Product Type Panel ← CRITICAL
│         Plant / Pot / Seed / Soil / Tool
│         Controls panel visibility and variant type locking
├── §6.4  Care Info Panel (Plant only)
│         Light · Water · Temperature · Skill · Pet safe · Air purifying
│         Live chip preview
├── §6.5  Pot Upsell Panel (Plant only)
│         Section label · Featured pots (product picker)
│         "All Pots →" toggle
├── §6.6  SEO Panel
│         Search preview · Page title · Meta description · URL handle
└── §6.7  Storefront Preview Panel
          Live PDP card preview · "Preview PDP →" · "Preview PLP Card"

PERSISTENT
└── §7    Sticky Save Bar
          Discard Changes · Last saved indicator · Save Draft · Publish

MODALS
├── §8.3  Pre-publish validation error summary
├── §9    Unsaved changes guard modal
├── §11   Duplicate product modal
├── §12   Delete confirmation modal (type-to-confirm)
└── §6.5  Pot picker modal
═══════════════════════════════════════════════════════════════════════
Total: 20 sections | ~3,200 lines
PDP cross-reference: 38 field mappings documented in §16
WCAG 2.2 AA | Admin dark token system
Companion: admin-dashboard-design.md · design_product_detels.md (PDP)
Last updated: June 2026
```

---

*Document version: 1.0 (complete) — Admin Product Edit / Create Page*
*Built from: `design_product_detels.md` (storefront PDP spec) + `admin-dashboard-design.md` (admin system)*
*Every storefront PDP field has a corresponding admin panel field — see §16 for the complete mapping.*
*Guideline standard: WCAG 2.2 AA | Token system: Admin dark token set (Outfit)*
*Last updated: June 2026*

---

## 21. Shopify Admin API Integration

### 21.1 Product Data Mapping (Admin → Shopify)

Every admin panel field maps to a Shopify product or variant object field. This table is the definitive reference for the engineering implementation.

**Product-level fields:**

| Admin panel field | Shopify API field | Notes |
|---|---|---|
| Title | `product.title` | Required |
| Short description | `product.body_html` (first `<p>`) OR metafield `custom.short_description` | Prefer metafield for clean separation |
| Full description | `product.body_html` | Rich HTML; whitelist tags before save |
| Botanical name | `product.metafields[namespace=plant][key=botanical_name]` | String |
| Common name | `product.metafields[namespace=plant][key=common_name]` | String |
| Product type | `product.product_type` | Maps to `"Plant"` / `"Pot"` / `"Seed"` etc. |
| Category | `product.metafields[namespace=custom][key=category]` OR Shopify taxonomy |
| Tags | `product.tags` | Comma-separated string |
| Status | `product.status` → `"active"` / `"draft"` / `"archived"` |
| Published at | `product.published_at` | Null = draft/archived |
| Sales channels | `product.published_scope` → `"web"` / `"global"` |
| Scheduled publish | Custom metafield + Shopify Flow trigger | Native scheduling via `published_at` |
| Image #1–8 | `product.images[]` | Order = `position` field |
| SEO title | `product.metafields[namespace=global][key=title_tag]` |
| SEO description | `product.metafields[namespace=global][key=description_tag]` |
| URL handle | `product.handle` | Auto-slugified; must be unique |
| Compare-at price | `variant.compare_at_price` | Per variant |
| Current price | `variant.price` | Per variant |
| Cost per unit | `variant.cost` (Shopify inventory cost) |
| Taxable | `variant.taxable` → boolean |
| Base SKU | `variant.sku` |
| Barcode | `variant.barcode` |
| Track inventory | `variant.inventory_management` → `"shopify"` / null |
| Stock | `inventory_level.available` | Via Inventory API |
| Stock policy | `variant.inventory_policy` → `"deny"` / `"continue"` |
| Weight | `variant.weight` + `variant.weight_unit` |
| Care chips | `product.metafields[namespace=plant][key=care_*]` | One metafield per chip |
| Feature list | `product.metafields[namespace=plant][key=features]` | JSON array |
| Plant specs | `product.metafields[namespace=plant][key=specifications]` | JSON array of `{label, value}` |
| Care guide cards | `product.metafields[namespace=plant][key=care_guide]` | JSON array of card objects |
| Delivery ETA label | `product.metafields[namespace=delivery][key=eta_label]` |
| Health guarantee | `product.metafields[namespace=delivery][key=guarantee_label]` |
| Packaging label | `product.metafields[namespace=delivery][key=packaging_label]` |
| Pot upsell section label | `product.metafields[namespace=pot_upsell][key=section_label]` |
| Pot upsell featured pots | `product.metafields[namespace=pot_upsell][key=product_ids]` | JSON array of product IDs |
| Show "All Pots" link | `product.metafields[namespace=pot_upsell][key=show_all_link]` | Boolean |
| Discount badge text | `product.metafields[namespace=pricing][key=discount_badge]` | String or empty |
| Price note | `product.metafields[namespace=pricing][key=price_note]` | String |
| Reorder level | `product.metafields[namespace=inventory][key=reorder_level]` | Integer |
| Low stock alert | `product.metafields[namespace=inventory][key=low_stock_alert]` | Boolean |
| Warehouse | `inventory_level.location_id` | Shopify location |
| Collections | Via `PUT /collects.json` — add/remove from collections |

**Variant-level metafields (per size variant):**

| Admin field | Shopify field |
|---|---|
| Size name | `variant.option1` |
| Height range | `variant.metafields[namespace=plant][key=height_range]` |
| Best for | `variant.metafields[namespace=plant][key=best_for]` |
| Pot diameter | `variant.metafields[namespace=plant][key=pot_diameter]` |
| Dispatch time | `variant.metafields[namespace=plant][key=dispatch_time]` |

### 21.2 Required Shopify Metafield Definitions

Create these metafield definitions in Shopify Admin → Settings → Custom Data before development:

```json
[
  { "namespace": "plant", "key": "botanical_name",   "type": "single_line_text_field" },
  { "namespace": "plant", "key": "common_name",       "type": "single_line_text_field" },
  { "namespace": "plant", "key": "care_light",        "type": "single_line_text_field" },
  { "namespace": "plant", "key": "care_water",        "type": "single_line_text_field" },
  { "namespace": "plant", "key": "care_temperature",  "type": "single_line_text_field" },
  { "namespace": "plant", "key": "care_skill",        "type": "single_line_text_field" },
  { "namespace": "plant", "key": "care_pet_safe",     "type": "boolean" },
  { "namespace": "plant", "key": "care_air_purifying","type": "boolean" },
  { "namespace": "plant", "key": "features",          "type": "json" },
  { "namespace": "plant", "key": "specifications",    "type": "json" },
  { "namespace": "plant", "key": "care_guide",        "type": "json" },
  { "namespace": "delivery", "key": "eta_label",      "type": "single_line_text_field" },
  { "namespace": "delivery", "key": "guarantee_label","type": "single_line_text_field" },
  { "namespace": "delivery", "key": "packaging_label","type": "single_line_text_field" },
  { "namespace": "pot_upsell", "key": "section_label","type": "single_line_text_field" },
  { "namespace": "pot_upsell", "key": "product_ids",  "type": "json" },
  { "namespace": "pot_upsell", "key": "show_all_link","type": "boolean" },
  { "namespace": "pricing", "key": "discount_badge",  "type": "single_line_text_field" },
  { "namespace": "pricing", "key": "price_note",      "type": "single_line_text_field" },
  { "namespace": "inventory", "key": "reorder_level", "type": "number_integer" },
  { "namespace": "inventory", "key": "low_stock_alert","type": "boolean" },
  { "namespace": "global", "key": "title_tag",        "type": "single_line_text_field" },
  { "namespace": "global", "key": "description_tag",  "type": "multi_line_text_field" }
]
```

**Variant metafield definitions:**
```json
[
  { "owner_resource": "variant", "namespace": "plant", "key": "height_range",   "type": "single_line_text_field" },
  { "owner_resource": "variant", "namespace": "plant", "key": "best_for",       "type": "single_line_text_field" },
  { "owner_resource": "variant", "namespace": "plant", "key": "pot_diameter",   "type": "single_line_text_field" },
  { "owner_resource": "variant", "namespace": "plant", "key": "dispatch_time",  "type": "single_line_text_field" }
]
```

### 21.3 API Call Sequence (Create Product)

```
1. POST /admin/api/2024-10/products.json
   → Creates product with title, body_html, product_type, tags, handle, status
   → Returns product.id and variant.id(s)

2. POST /admin/api/2024-10/products/{id}/images.json  (× n images)
   → Upload each image with position

3. PUT /admin/api/2024-10/products/{id}.json
   → Add metafields (plant care, features, specs, pot upsell, delivery, SEO)

4. PUT /admin/api/2024-10/variants/{id}.json  (× n variants)
   → Update variant SKU, price, compare_at_price, weight, option1
   → Add variant metafields (height_range, best_for, etc.)

5. POST /admin/api/2024-10/inventory_levels/adjust.json  (× n variants)
   → Set initial stock per location

6. POST /admin/api/2024-10/collects.json  (× n collections)
   → Add to selected collections
```

### 21.4 API Call Sequence (Update Product)

```
1. GET /admin/api/2024-10/products/{id}.json
   → Fetch current state (for conflict detection via updated_at)

2. Check: if response.updated_at > local.loaded_at → show conflict modal

3. PUT /admin/api/2024-10/products/{id}.json
   → Update changed fields only (PATCH approach)

4. PUT /admin/api/2024-10/products/{id}/images/{image_id}.json (if reordered)
   → Update position for each image

5. DELETE /admin/api/2024-10/products/{id}/images/{image_id}.json (if removed)

6. PUT /admin/api/2024-10/variants/{id}.json (if variant changed)

7. POST /admin/api/2024-10/inventory_levels/adjust.json (if stock changed)
```

### 21.5 Rich Text HTML Sanitisation

Before saving `body_html` to Shopify, run server-side sanitisation:

**Allowed tags:** `h2 h3 h4 p ul ol li a strong em b i br blockquote`
**Allowed attributes:** `href` (on `<a>` only — must be `https://` prefixed)
**Strip all:** `script style iframe object embed form input button`
**Encode:** All `<`, `>`, `&` in text nodes that should be literal characters

```javascript
// Example (server-side, Node.js using DOMPurify or sanitize-html)
const clean = sanitizeHtml(rawHtml, {
  allowedTags: ['h2','h3','h4','p','ul','ol','li','a','strong','em','br','blockquote'],
  allowedAttributes: { 'a': ['href'] },
  allowedSchemes: ['https']
});
```

---

## 22. Form State Machine

### 22.1 Product Edit States

```
┌───────────────────────────────────────────────────────────────────┐
│                   PRODUCT EDIT STATE MACHINE                      │
│                                                                   │
│  [LOADING]                                                        │
│     │  (API data received)                                        │
│     ▼                                                             │
│  [CLEAN] ──── (user edits) ────► [DIRTY]                        │
│     │                               │                            │
│     │                        (auto-save timer)                   │
│     │                               │                            │
│     │                               ▼                            │
│     │                          [SAVING_DRAFT]                    │
│     │                               │                            │
│     │                    ┌──────────┴──────────┐                │
│     │                    │                      │                │
│     │                  success               failure             │
│     │                    │                      │                │
│     │                    ▼                      ▼                │
│     │               [CLEAN] ◄──────────── [SAVE_ERROR]         │
│     │                                                            │
│     └──── (publish clicked) ──────► [VALIDATING]               │
│                                          │                       │
│                                 ┌────────┴────────┐             │
│                                 │                  │             │
│                               pass               fail            │
│                                 │                  │             │
│                                 ▼                  ▼             │
│                           [PUBLISHING]      [VALIDATION_ERROR]  │
│                                 │                                │
│                       ┌─────────┴─────────┐                    │
│                       │                   │                     │
│                     success            failure                  │
│                       │                   │                     │
│                       ▼                   ▼                     │
│                  [PUBLISHED]        [PUBLISH_ERROR]             │
│                                                                  │
│  [DELETING] ──► [CONFIRM_DELETE] ──► [DELETED] → redirect      │
│  [DUPLICATING] ──────────────────► [DUPLICATED] → redirect     │
│                                                                  │
└───────────────────────────────────────────────────────────────────┘
```

### 22.2 UI Response per State

| State | Save bar | Publish btn | Title bar | Toast |
|---|---|---|---|---|
| `LOADING` | Hidden | Disabled | `"Loading..."` skeleton | — |
| `CLEAN` | `"All changes saved"`, Discard disabled | Enabled | Normal | — |
| `DIRTY` | `"Unsaved changes"` amber | Enabled | `●` dirty indicator | — |
| `SAVING_DRAFT` | `"Saving..."` + spinner | Disabled | — | — |
| `SAVE_ERROR` | `"Failed to save. Retry"` red | Enabled | — | Error toast |
| `VALIDATING` | Spinner on Publish | Loading | — | — |
| `VALIDATION_ERROR` | Error summary panel | Re-enabled | — | — |
| `PUBLISHING` | Spinner on Publish | Loading | — | — |
| `PUBLISHED` | `"Published ✓"` green | Green | Status → Active | `"Product published"` |
| `PUBLISH_ERROR` | Normal | Re-enabled | — | Error toast |
| `DELETING` | Hidden | — | — | Spinner in modal |
| `DELETED` | — | — | — | Toast; redirect |
| `DUPLICATING` | Spinner in modal | — | — | — |
| `DUPLICATED` | — | — | — | Toast; redirect |

---

## 23. Component Migration Notes

### 23.1 Token Adoption Priority

| Priority | Token / group | Risk if skipped |
|---|---|---|
| P0 — Critical | All `admin.color.*` base tokens | Dark theme breaks entirely |
| P0 — Critical | `pp.focus-ring` + `pp.focus-glow` | WCAG 2.4.11 failure |
| P0 — Critical | `pp.error` on validation states | Error states invisible |
| P1 — High | All `font.size.*` tokens for admin scale | Typography regressions |
| P1 — High | `radius.xs` through `radius.lg` | Shape inconsistency |
| P2 — Medium | `pp.shadow` / `pp.focus-glow` | Elevation/focus polish |
| P2 — Medium | `motion.*` tokens | Animation inconsistency |
| P3 — Low | `pp.panel-bg`, `pp.nested-bg` aliases | Semantic clarity only |

### 23.2 Reused Admin Components (from `admin-dashboard-design.md`)

These components are used on this page and must not be reimplemented locally:

| Component | Source section | Usage on this page |
|---|---|---|
| Admin Input Field | §7.2 | All text inputs, number inputs |
| Admin Textarea | §7.2 | Short description |
| Admin Select / Dropdown | §7.2 | Status, categories, care chips, stock policy |
| Admin Checkbox | §7.2 | Tax, inventory tracking, collections, delivery options |
| Admin Toggle | §7.2 | Scheduled publish, show "All Pots" link |
| Admin Primary Button | §7.3 | Publish |
| Admin Secondary Button | §7.3 | Save Draft |
| Admin Ghost Button | §7.3 | Discard, View on Storefront, Duplicate |
| Admin Danger Button | §7.3 | Delete |
| Admin Modal Shell | §7.5 | Unsaved changes, duplicate, pot picker |
| Admin Alert Dialog | §7.5 | Delete confirmation |
| Admin Toast | §7.6 | All save/publish/error notifications |
| Admin Status Badge | §7.4 | Product status, image PRIMARY badge |
| Admin Tooltip | §7.7 | Help text on icons, disabled button labels |

### 23.3 Page-Exclusive Components (not shared)

These are unique to the product edit page and should not be copied elsewhere without design review:

| Component | Notes |
|---|---|
| Media upload zone (drag-and-drop) | Re-usable only on media-heavy pages |
| Image thumbnail grid (drag-to-reorder) | Product edit only |
| Rich text editor | Also used on Pages & Blog module |
| Variant table (inline edit) | Also used on a future Inventory module |
| Care level dot input (1–5 slider) | Product edit only |
| Care chip preview (live mini-preview) | Product edit only |
| Storefront preview panel | Product edit only |
| PDP field mapping info banners (ℹ️) | Product edit only |
| Pot product picker modal | Product edit + Garden Services |
| Pre-publish validation error summary | Product edit only |
| Activity log embedded panel | Shared with other entity edit pages |
| Sticky save bar (product variant) | Shared pattern with other edit pages |
| Conflict detection modal | Shared pattern with other concurrent-edit pages |
| Type-to-confirm delete modal | Shared pattern for high-risk deletions |

---

## 24. Keyboard Shortcuts — Product Page Specific

> These extend the global admin shortcuts defined in `admin-dashboard-design.md §32`.

| Shortcut | Action |
|---|---|
| `⌘S` / `Ctrl+S` | Save as Draft |
| `⌘Enter` / `Ctrl+Enter` | Publish product |
| `⌘Z` / `Ctrl+Z` | Undo last field change |
| `⌘Shift+Z` / `Ctrl+Shift+Z` | Redo |
| `⌘D` / `Ctrl+D` | Open Duplicate modal |
| `Tab` | Advance to next form field |
| `Shift+Tab` | Previous field |
| `Arrow keys` | Navigate care level dots; navigate within variant table cells |
| `Delete` (image focused) | Remove focused image (with inline confirm) |
| `Space` | Toggle checkbox; select radio |
| `Enter` (in dropdown) | Open select dropdown / confirm selection |
| `Escape` | Close any open modal / dropdown / panel |
| `⌘P` / `Ctrl+P` | Open storefront preview in new tab |
| `G then P` | Go to Products list (global nav shortcut) |

**Tab sections (quick jump):**

| Shortcut | Jump to section |
|---|---|
| `1` (when focused on tab) | About This Plant tab |
| `2` | Care Guide tab |
| `3` | Reviews tab |

---

## 25. Analytics & Tracking Events

All product edit actions are logged in the admin activity log (§13) and optionally sent to an internal analytics pipeline.

| Event name | Trigger | Properties |
|---|---|---|
| `product_edit_open` | Page load (existing product) | `product_id`, `admin_id`, `status` |
| `product_create_open` | Page load (new product) | `admin_id` |
| `product_field_change` | Field blur (value changed) | `product_id`, `field_name`, `admin_id` |
| `product_image_upload` | Image upload complete | `product_id`, `image_count`, `admin_id` |
| `product_image_remove` | Image `×` clicked and confirmed | `product_id`, `image_position`, `admin_id` |
| `product_image_reorder` | Drag-and-drop reorder complete | `product_id`, `new_primary_image`, `admin_id` |
| `product_variant_add` | `+ Add Size Variant` clicked | `product_id`, `admin_id` |
| `product_variant_remove` | Variant `×` clicked | `product_id`, `variant_id`, `admin_id` |
| `product_save_draft` | Save Draft success | `product_id`, `admin_id`, `trigger: "manual"/"auto"` |
| `product_auto_save` | Auto-save success | `product_id`, `admin_id`, `trigger: "auto"` |
| `product_publish_attempt` | Publish button clicked | `product_id`, `admin_id` |
| `product_publish_success` | Published successfully | `product_id`, `admin_id`, `time_to_publish_ms` |
| `product_publish_fail` | Publish API error | `product_id`, `admin_id`, `error_code` |
| `product_validation_fail` | Validation error on publish | `product_id`, `admin_id`, `failed_fields[]` |
| `product_duplicate_open` | Duplicate modal opened | `product_id`, `admin_id` |
| `product_duplicate_confirm` | Duplicate confirmed | `source_product_id`, `new_product_id`, `admin_id` |
| `product_delete_open` | Delete button clicked | `product_id`, `admin_id` |
| `product_delete_confirm` | Delete confirmed | `product_id`, `admin_id` |
| `product_conflict_detected` | Concurrent edit conflict | `product_id`, `conflicting_admin_id`, `admin_id` |
| `product_type_change` | Product type radio changed | `product_id`, `old_type`, `new_type`, `admin_id` |
| `product_pot_upsell_add` | Pot added to upsell strip | `product_id`, `pot_id`, `admin_id` |
| `product_storefront_preview` | Preview PDP opened | `product_id`, `admin_id` |
| `product_seo_field_edit` | SEO panel expanded and edited | `product_id`, `fields_edited[]`, `admin_id` |

---

## 26. Internationalisation (i18n) — Product Page

### 26.1 Field Label i18n Keys

```json
{
  "pp.panel.product_info":         "Product Information",
  "pp.panel.media":                "Media",
  "pp.panel.pricing":              "Pricing",
  "pp.panel.variants":             "Variants & Sizes",
  "pp.panel.inventory":            "Inventory",
  "pp.panel.shipping":             "Shipping",
  "pp.panel.tab_content":          "Storefront Tab Content",
  "pp.panel.status":               "Status",
  "pp.panel.organisation":         "Organisation",
  "pp.panel.product_type":         "Product Type",
  "pp.panel.care_info":            "Care Quick-Chips",
  "pp.panel.pot_upsell":           "Pot Upsell Strip",
  "pp.panel.seo":                  "SEO & Search Visibility",
  "pp.panel.preview":              "Storefront Preview",
  "pp.panel.activity_log":         "Activity Log",

  "pp.field.title":                "TITLE",
  "pp.field.short_description":    "SHORT DESCRIPTION",
  "pp.field.full_description":     "FULL DESCRIPTION",
  "pp.field.botanical_name":       "BOTANICAL NAME",
  "pp.field.common_name":          "COMMON NAME / SUBSPECIES",
  "pp.field.current_price":        "CURRENT PRICE",
  "pp.field.compare_at":           "COMPARE AT PRICE",
  "pp.field.cost_per_unit":        "COST PER UNIT",
  "pp.field.discount_badge":       "DISCOUNT BADGE TEXT",
  "pp.field.tax_note":             "PRICE NOTE",
  "pp.field.sku":                  "SKU",
  "pp.field.stock":                "STOCK QUANTITY",
  "pp.field.reorder_level":        "REORDER LEVEL",
  "pp.field.care_light":           "LIGHT",
  "pp.field.care_water":           "WATER FREQUENCY",
  "pp.field.care_temperature":     "TEMPERATURE RANGE",
  "pp.field.care_skill":           "SKILL LEVEL",
  "pp.field.seo_title":            "PAGE TITLE",
  "pp.field.seo_description":      "META DESCRIPTION",
  "pp.field.url_handle":           "URL HANDLE",

  "pp.action.publish":             "Publish",
  "pp.action.save_draft":          "Save Draft",
  "pp.action.discard":             "Discard Changes",
  "pp.action.duplicate":           "Duplicate",
  "pp.action.delete":              "Delete",
  "pp.action.view_storefront":     "View on Storefront",
  "pp.action.preview_pdp":         "Preview PDP →",
  "pp.action.add_variant":         "+ Add Size Variant",
  "pp.action.add_feature":         "+ Add feature point",
  "pp.action.add_spec":            "+ Add spec row",
  "pp.action.add_care_card":       "+ Add Care Card",
  "pp.action.add_pot":             "+ Add Pot",
  "pp.action.add_from_url":        "+ Add from URL",

  "pp.status.active":              "Active",
  "pp.status.draft":               "Draft",
  "pp.status.archived":            "Archived",

  "pp.product_type.plant":         "🌿 Plant (bare-root)",
  "pp.product_type.pot":           "🪴 Pot / Planter",
  "pp.product_type.seed":          "🌱 Seed / Bulb",
  "pp.product_type.soil":          "🧱 Soil / Fertiliser",
  "pp.product_type.tool":          "🔧 Tool / Accessory",

  "pp.validation.title_required":  "Product title is required.",
  "pp.validation.price_required":  "Current price is required.",
  "pp.validation.price_zero":      "Price must be greater than ₹0.",
  "pp.validation.compare_invalid": "Compare-at price must be greater than the current price.",
  "pp.validation.image_required":  "Upload at least one product image.",
  "pp.validation.sku_duplicate":   "SKU '{{sku}}' is already in use by another product.",
  "pp.validation.url_taken":       "This URL handle is already in use.",
  "pp.validation.title_too_long":  "Title must be 120 characters or fewer.",
  "pp.validation.publish_summary": "This product can't be published yet. Fix {{count}} issue(s):",

  "pp.save.saving":                "Saving...",
  "pp.save.saved_at":              "Last saved: {{time}}",
  "pp.save.unsaved":               "Unsaved changes",
  "pp.save.auto_fail":             "Auto-save failed. Check your connection.",

  "pp.toast.published":            "Product published successfully.",
  "pp.toast.draft_saved":          "Draft saved.",
  "pp.toast.deleted":              "'{{title}}' was deleted.",
  "pp.toast.duplicated":           "Duplicate created. Review and publish when ready.",
  "pp.toast.image_reordered":      "Main image updated. '{{filename}}' is now the primary PDP image.",
  "pp.toast.image_removed":        "Image removed.",
  "pp.toast.conflict":             "This product was updated by {{admin}} while you were editing.",
  "pp.toast.paste_stripped":       "Some formatting was removed on paste.",

  "pp.confirm.discard":            "Discard all unsaved changes? This cannot be undone.",
  "pp.confirm.delete":             "Delete '{{title}}'?",
  "pp.confirm.delete_body":        "This action cannot be undone.",
  "pp.confirm.type_to_delete":     "To confirm, type the product name:",
  "pp.confirm.type_change":        "Changing product type will reset variant settings. Continue?",
  "pp.confirm.unsaved_leave":      "You have unsaved changes. They will be lost if you leave.",

  "pp.info.image_order":           "Image order matters: #1 → Main PDP image · #2–4 → Thumbnail strip · #5+ → Gallery",
  "pp.info.pot_separate":          "Clicking a pot chip navigates to that pot's PDP. Pots are never variants.",
  "pp.info.plant_rules":           "Size/Height variant type is auto-set for Plant products.",
  "pp.info.pot_not_included":      "Pot not included — browse our pot collection below",

  "pp.help.short_description":     "Appears below the product title in the storefront PDP.",
  "pp.help.botanical_name":        "Used in the About tab specifications card. Italicised on storefront.",
  "pp.help.compare_at":            "The original price shown with a strikethrough on the PDP.",
  "pp.help.discount_badge":        "Leave blank to auto-calculate from current vs compare-at price.",
  "pp.help.url_handle":            "Auto-generated from title. Changing this may break existing links.",
  "pp.help.reorder_level":         "A dashboard alert appears when stock falls below this number."
}
```

---

## 27. Final Summary — Complete Section Map

```
Admin Product Edit / Create Page — v1.0
Complete Design Specification
═══════════════════════════════════════════════════════════════════════
CORE SPEC (§1–§20)

§1   Context & Goals
§2   Design Tokens (inherited admin tokens + 17 pp.* semantic aliases,
     typography role map × 14, spacing × 7, radius × 5)
§3   Page Layout (shell diagram, 65/35 two-column, sticky right col)
§4   Breadcrumb & Page Header (breadcrumb, header anatomy, new vs edit)

LEFT COLUMN (§5)
§5.1 Product Info Panel
     Title (120 char) · Short description (160 char) · Rich text editor
     Botanical name · Common name
§5.2 Media Panel
     Upload zone (drag-drop, click) · Image thumbnails (reorderable)
     Primary badge · PDP order mapping info banner
§5.3 Pricing Panel
     Current price · Compare-at · Cost · Discount badge logic
     Tax settings · Price note · PDP price block mapping
§5.4 Variants Panel
     Variant type radio (locked by product type)
     Variant table (inline edit, drag reorder)
     Size detail card data per variant (best for, pot dia, dispatch)
     Product type → variant type lock rules
§5.5 Inventory Panel
     Base SKU · Stock per variant · Reorder level
     Stock policy (deny/backorder/continue) · Warehouse
§5.6 Shipping Panel
     Weight · Dimensions
     3 delivery label fields → PDP delivery box rows
§5.7 Storefront Tab Content Panel
     → About tab: Feature list (drag-reorder) + Plant specs table
     → Care Guide tab: Care cards × 6 with level dot input
     → Reviews: external (Reviews module)

RIGHT COLUMN (§6)
§6.1 Status Panel (Active/Draft/Archived, channels, schedule)
§6.2 Organisation Panel (Category, subcategory, tags, collections)
§6.3 Product Type Panel ← CRITICAL (locks panels + variant type)
§6.4 Care Info Panel — Plant only (4 dropdowns + pet/air toggles + live preview)
§6.5 Pot Upsell Panel — Plant only (featured pots + product picker modal)
§6.6 SEO Panel (live search preview + title/desc/URL fields)
§6.7 Storefront Preview Panel (live card preview + open links)

PERSISTENT
§7   Sticky Save Bar (Discard · last-saved · Save Draft · Publish)

SYSTEMS
§8   Validation System (required fields × 9, rules × 10, display rules,
     pre-publish error summary panel)
§9   Unsaved Changes Guard (beforeunload + alertdialog modal)
§10  Auto-Save System (30s interval, localStorage backup, conflict detect)
§11  Product Duplication (modal, new SKU/URL logic, redirect)
§12  Delete Product Flow (conflict check, type-to-confirm, archive alt)
§13  Activity Log Panel (embedded, last 5 actions, collapse/expand)
§14  Accessibility Requirements (focus management, full ARIA map × 30,
     keyboard navigation, 15 testable criteria)
§15  Performance Requirements (7 metrics with targets)
§16  PDP → Admin Field Mapping (38 field mappings — master cross-ref)
§17  Anti-Patterns (× 16 prohibited implementations)
§18  Edge-Case Handling (× 18 scenarios)
§19  QA Checklist (× 52 checkboxes: Visual, Interaction, PDP Mapping,
     Accessibility, Data Integrity)
§20  Summary — Panel Map

EXTENDED IMPLEMENTATION GUIDE (§21–§27)

§21  Shopify Admin API Integration
     • Product field → Shopify API mapping (25 fields)
     • Variant field → Shopify API mapping (5 fields)
     • Required metafield definitions (JSON, 23 product + 4 variant)
     • API call sequence: Create (6 steps) + Update (7 steps)
     • Rich text HTML sanitisation (whitelist + code example)

§22  Form State Machine
     • State diagram (11 states: Loading → Clean → Dirty →
       Saving/Save_Error → Validating → Validation_Error →
       Publishing → Published/Publish_Error → Deleting/Duplicating)
     • UI response per state (save bar, publish btn, title, toast)

§23  Component Migration Notes
     • Token adoption priority P0–P3
     • 13 reused admin components (with source sections)
     • 14 page-exclusive components

§24  Keyboard Shortcuts — Product Page
     (14 shortcuts + tab section quick-jump)

§25  Analytics & Tracking Events (22 events with properties)

§26  Internationalisation (90 i18n keys covering all labels,
     actions, validations, toasts, confirms, help text, info banners)

§27  Final Summary — Section Map (this section)

═══════════════════════════════════════════════════════════════════════
Total: ~2,600 lines | 27 sections
PDP cross-reference: 38 field mappings (§16)
Shopify metafields: 27 definitions (§21.2)
WCAG 2.2 AA | Admin dark token system (Outfit)

Companion documents:
  design_product_detels.md   ← Storefront PDP spec (source of truth)
  admin-dashboard-design.md  ← Admin system tokens & shared components
  design-system.md           ← Master storefront design system

Last updated: June 2026
═══════════════════════════════════════════════════════════════════════
```

---

*Document version: 1.0 (complete) — Admin Product Edit / Create Page*
*Sections: 1–20 (core spec) + 21–27 (extended implementation guide)*
*Every storefront PDP element traces back to an admin field — see §16.*
*Guideline standard: WCAG 2.2 AA | Token system: Admin dark (Outfit)*
*Companion: `design_product_detels.md` (PDP) · `admin-dashboard-design.md` · `design-system.md`*
*Last updated: June 2026*
