# Plants — Product Listing Page (PLP)
## Design Specification v1.0 — Hero Plant Storefront

> **Design intent:** Deliver a fast, scannable product listing page that guides browsers to buyers through a sticky filter sidebar, a high-density 4-column product card grid, and friction-free variant discovery — using a clean token-driven system consistent with the PDP and AI Care pages, meeting WCAG 2.2 AA throughout.

---

## 1. Context & Goals

| Property | Value |
|---|---|
| **Page name** | Plants — Product Listing Page |
| **Page type** | Category / Collection page (PLP) |
| **Example URL** | `/collections/plants` |
| **Primary goal** | Drive click-throughs from product card to PDP (Add to Cart) |
| **Secondary goals** | Enable fast product discovery via filters/sort; reduce search abandonment |
| **Audience** | Online shoppers browsing indoor plants, seeds, and garden supplies |
| **Surface** | E-commerce storefront — desktop-first, fully responsive |
| **Page density** | Links: ~195 · Buttons: ~138 · Cards: ~95 · Inputs: ~48 · Navigation: 4 |
| **Default sort** | Bestselling (drives highest conversion per Baymard research) |
| **Products per page** | 24 cards (initial load); progressive load on scroll |
| **Grid columns** | 4-col desktop · 3-col tablet · 2-col mobile |

---

## 2. Design Tokens & Foundations

### 2.1 Typography

| Token | Value | Usage |
|---|---|---|
| `font.family.primary` | `Outfit` | All UI text |
| `font.family.stack` | `Outfit, sans-serif` | CSS font-family fallback |
| `font.size.base` | `16px` | Body reference |
| `font.weight.base` | `400` | Default weight |
| `font.lineHeight.base` | `22.4px` | Body line-height |
| `font.size.xs` | `9px` | Legal micro-labels |
| `font.size.sm` | `11px` | Badge text, filter counts |
| `font.size.md` | `12px` | Helper text, filter labels |
| `font.size.lg` | `13px` | Secondary labels, breadcrumb |
| `font.size.xl` | `13.33px` | Nav links, filter option text |
| `font.size.2xl` | `14px` | Card body, filter heading |
| `font.size.3xl` | `15px` | Card price, sort label |
| `font.size.4xl` | `16px` | Card title, CTA labels, section heading |

**Typography role map:**

| Role | Size token | Weight | Line-height |
|---|---|---|---|
| Page `<h1>` heading | `font.size.4xl × 2` (~32px) | 700 | 1.2 |
| Page sub-description | `font.size.2xl` | 400 | `font.lineHeight.base` |
| Breadcrumb item | `font.size.lg` | 400 | 1 |
| Result count | `font.size.2xl` | 400 | 1 |
| Sort label | `font.size.3xl` | 500 | 1 |
| Filter section heading | `font.size.2xl` | 700 | 1.3 |
| Filter option label | `font.size.xl` | 400 | 1.4 |
| Filter count badge | `font.size.sm` | 500 | 1 |
| Active filter chip | `font.size.md` | 600 | 1 |
| Card product name | `font.size.4xl` | 600 | 1.3 |
| Card price | `font.size.3xl` | 700 | 1 |
| Card original price | `font.size.md` | 400 | 1 |
| Card discount badge | `font.size.sm` | 700 | 1 |
| Card rating count | `font.size.sm` | 400 | 1 |
| Card size label | `font.size.md` | 400 | 1 |
| Card "Add to Cart" | `font.size.3xl` | 600 | 1 |
| Category pill label | `font.size.md` | 600 | 1 |
| Pagination label | `font.size.2xl` | 500 | 1 |
| Empty state heading | `font.size.4xl` | 700 | 1.3 |
| Empty state body | `font.size.2xl` | 400 | `font.lineHeight.base` |

### 2.2 Color Palette

| Token | Hex | Usage |
|---|---|---|
| `color.surface.base` | `#000000` | Deepest text, dark overlays |
| `color.text.secondary` | `#1c1c1c` | Primary headings, strong labels |
| `color.text.tertiary` | `#ffffff` | Text on green/dark surfaces |
| `color.text.inverse` | `#212326` | Secondary meta, breadcrumbs |
| `color.surface.raised` | `#00b566` | Primary CTA, active filter, badge fill |
| `color.surface.strong` | `#fefcf9` | Page background, card background |

**Semantic aliases (never use raw hex):**

| Alias | Maps to | Usage |
|---|---|---|
| `plp.page-bg` | `color.surface.strong` | Page background |
| `plp.card-bg` | `color.surface.strong` | Product card background |
| `plp.sidebar-bg` | `color.surface.strong` | Filter sidebar background |
| `plp.heading` | `color.text.secondary` | All headings |
| `plp.body` | `color.text.inverse` | Body copy, labels |
| `plp.price` | `color.text.secondary` | Sale/current price |
| `plp.price-original` | `color.text.inverse` @ 45% | Strikethrough original price |
| `plp.cta-bg` | `color.surface.raised` | "Add to Cart" button bg |
| `plp.cta-text` | `color.text.tertiary` | "Add to Cart" button label |
| `plp.badge-sale-bg` | `color.surface.raised` | Discount badge bg |
| `plp.badge-sale-text` | `color.text.tertiary` | Discount badge label |
| `plp.badge-new-bg` | `#212326` | "New" badge bg |
| `plp.badge-new-text` | `color.text.tertiary` | "New" badge label |
| `plp.badge-oos-bg` | `color.text.inverse` @ 40% | "Sold Out" overlay bg |
| `plp.star-fill` | `#c8a84b` | Star rating fill (amber) |
| `plp.divider` | `color.text.secondary` @ 10% | Sidebar dividers, card borders |
| `plp.filter-active-bg` | `color.surface.raised` @ 10% | Active filter option bg |
| `plp.filter-active-border` | `color.surface.raised` | Active filter option border |
| `plp.chip-bg` | `color.surface.raised` @ 12% | Active filter chip bg |
| `plp.chip-text` | `color.surface.raised` | Active filter chip label |
| `plp.focus-ring` | `color.surface.raised` | Universal focus ring |
| `plp.hover-overlay` | `color.surface.base` @ 6% | Card image hover darkening |
| `plp.skeleton-base` | `color.text.secondary` @ 8% | Skeleton loading base |
| `plp.skeleton-shine` | `color.text.tertiary` @ 60% | Skeleton shimmer highlight |

### 2.3 Spacing Scale

| Token | Value | Composed usage |
|---|---|---|
| `space.1` | `1px` | Micro dividers |
| `space.2` | `2px` | — |
| `space.3` | `3px` | Star gap |
| `space.4` | `4px` | Badge padding vertical |
| `space.5` | `5px` | Inline icon gap |
| `space.6` | `6px` | Filter option gap |
| `space.7` | `8px` | Card inner padding base |
| `space.8` | `9px` | Filter item padding |

> **Composed values:** `space.7 × 2 = 16px` · `space.7 × 3 = 24px` · `space.7 × 4 = 32px` · `space.7 × 6 = 48px` · `space.7 × 8 = 64px` · `space.7 × 10 = 80px`

### 2.4 Border Radius

| Token | Value | Usage |
|---|---|---|
| `radius.xs` | `4px` | Badges, count pills |
| `radius.sm` | `8px` | Filter checkboxes, input fields |
| `radius.md` | `12px` | Product cards, filter sidebar |
| `radius.lg` | `16px` | Active filter chips, category pills |
| `radius.xl` | `20px` | Sort dropdown |
| `radius.step7` | `50px` | Icon buttons, wishlist button |
| `radius.step8` | `9999px` | CTA buttons, search pill |

### 2.5 Shadows

| Token | Value | Usage |
|---|---|---|
| `shadow.1` | `rgb(190, 234, 212) 0px 0px 0px 0px` | Resting card — no elevation |
| `shadow.2` | `rgb(202, 223, 212) 0px 0px 0px 1px inset` | Card default border |
| `shadow.3` | `rgb(212, 212, 212) 0px 0px 0px 1px inset` | Filter option default border |
| `shadow.4` | `rgb(0, 146, 82) 0px 0px 0px 1px inset` | Active filter, focused input |

**Composed shadows (rule-based, not new tokens):**

| Name | Value | Usage |
|---|---|---|
| `card-hover` | `0 8px 28px rgba(0, 181, 102, 0.14)` | Card on hover |
| `sidebar-sticky` | `2px 0 12px rgba(28, 28, 28, 0.06)` | Sidebar scroll shadow |
| `sort-dropdown` | `0 8px 24px rgba(28, 28, 28, 0.12)` | Sort flyout |
| `quick-view` | `0 16px 48px rgba(0, 0, 0, 0.16)` | Quick-view modal |

### 2.6 Motion

| Token | Value | Usage |
|---|---|---|
| `motion.duration.instant` | `200ms` | Hover, badge, chip states |
| `motion.duration.fast` | `250ms` | Card hover lift, filter collapse |
| `motion.duration.normal` | `300ms` | Quick-view open, sort dropdown |
| `motion.duration.slow` | `500ms` | Skeleton → content, page load stagger |

---

## 3. Page Layout & Grid

### 3.1 Overall Structure

```
┌──────────────────────────────────────────────────────────────┐
│  ANNOUNCEMENT BAR                                            │
├──────────────────────────────────────────────────────────────┤
│  NAVIGATION BAR                                              │
├──────────────────────────────────────────────────────────────┤
│  BREADCRUMB                                                  │
├──────────────────────────────────────────────────────────────┤
│  PAGE HEADER (h1 + description + result count)               │
├──────────────────────────────────────────────────────────────┤
│  CATEGORY PILLS (horizontal scroll sub-nav)                  │
├────────────────────────┬─────────────────────────────────────┤
│                        │  SORT BAR + ACTIVE FILTER CHIPS     │
│  FILTER SIDEBAR        ├─────────────────────────────────────┤
│  (sticky, 260px)       │  PRODUCT GRID                       │
│                        │  (4-col / 3-col / 2-col)            │
│                        │                                     │
│                        │  PROGRESSIVE LOAD TRIGGER           │
│                        ├─────────────────────────────────────┤
│                        │  YOU MAY ALSO LIKE (recommended)    │
├────────────────────────┴─────────────────────────────────────┤
│  CATEGORY SEO TEXT BLOCK                                     │
├──────────────────────────────────────────────────────────────┤
│  FOOTER                                                      │
└──────────────────────────────────────────────────────────────┘
```

### 3.2 Layout Tokens

| Property | Value |
|---|---|
| Max content width | `1280px`, horizontally centred |
| Horizontal padding | `space.7 × 6 = 48px` desktop · `space.7 × 3 = 24px` tablet · `space.7 = 8px` mobile |
| Sidebar width | `260px` desktop · Hidden mobile (bottom sheet) |
| Sidebar + grid gap | `space.7 × 3 = 24px` |
| Grid column gap | `space.7 × 2 = 16px` desktop · `space.7 × 1.5 = 12px` mobile |
| Grid row gap | `space.7 × 3 = 24px` |
| Page bg | `plp.page-bg` |

### 3.3 Breakpoints

| Breakpoint | Grid | Sidebar | Changes |
|---|---|---|---|
| `≥ 1280px` | 4 columns | Visible, `260px` sticky | Full layout |
| `1024–1279px` | 3 columns | Visible, `240px` sticky | Compressed sidebar |
| `768–1023px` | 2 columns | Hidden → drawer | Filter button in sort bar |
| `< 768px` | 2 columns | Hidden → bottom sheet | Sort bar simplified |
| `< 480px` | 2 columns (compact) | Bottom sheet full-screen | Cards compact mode |

---

## 4. Navigation Bar

Inherited from shared layout. "Plants" nav link is active state.

```
[🌿 Hero Logo]  [Plants* ▾][Supplies][AI Care][Garden Services][Blog]  [🔍][👤][🛒²]
```

| Property | Value |
|---|---|
| Active nav item | `"Plants"` — underline `color.surface.raised`, weight 700 |
| All other properties | Inherit from homepage design.md nav spec |
| Announcement bar | Active above nav — inherits shared component |

---

## 5. Breadcrumb

```
Home  /  Plants
```

| Property | Value |
|---|---|
| Container | `<nav aria-label="Breadcrumb">` wrapping `<ol>` |
| Font | `font.size.lg`, weight 400, `plp.body` |
| Separator | `/` — `color.text.secondary` @ 30%, `space.7` padding each side |
| Current page | Non-linked, `plp.heading`, weight 600 |
| `aria-current` | `"page"` on current breadcrumb `<li>` |
| Margin top | `space.7 × 3 = 24px` |
| Margin bottom | `space.7 × 2 = 16px` |
| Overflow | Horizontal scroll on mobile, no wrap |

---

## 6. Page Header

```
Plants
Explore 500+ indoor plants, outdoor plants, flowering plants, and
succulents for home, office, and gifting. 10M+ customers • 4.5★ rated.

486 products
```

### 6.1 Anatomy

| Element | Token / Value |
|---|---|
| `<h1>` | `font.size.4xl × 2` (~32px), weight 700, `plp.heading`, margin-bottom `space.6` |
| Description | `font.size.2xl`, weight 400, `plp.body` @ 75%, `font.lineHeight.base`, max-width `720px`, margin-bottom `space.7` |
| Result count | `font.size.2xl`, weight 400, `plp.body` @ 55%: `"486 products"` |
| Section padding | `space.7 × 3 = 24px` top, `space.7 × 2 = 16px` bottom |
| Mobile | `<h1>` scales to `font.size.4xl × 1.5` (~24px); description hidden on < 480px |

---

## 7. Category Pills (Sub-Navigation)

A horizontally scrollable row of category shortcuts that filter the grid instantly.

```
[ All ]  [ Indoor Plants ]  [ Outdoor Plants ]  [ Flowering ]  [ Succulents ]
[ Low Maintenance ]  [ Air Purifying ]  [ Pet Friendly ]  [ Gifting ]
```

### 7.1 Anatomy

| Property | Value |
|---|---|
| Layout | Horizontal flex, `overflow-x: auto`, `scroll-snap-type: x mandatory`, no scrollbar visible |
| Container padding | `space.7` vertical, `space.7 × 6 = 48px` horizontal |
| Container bg | `plp.page-bg` |
| Container border-bottom | `1px solid plp.divider` |
| Pill gap | `space.6 = 6px` |
| Pill height | `36px` |
| Pill border-radius | `radius.step8` |
| Pill padding | `space.6` vertical, `space.7 × 2 = 16px` horizontal |
| Pill font | `font.size.md`, weight 600 |

**Pill states:**

| State | Background | Border | Text | Transition |
|---|---|---|---|---|
| Default | `color.surface.strong` | `shadow.3` | `plp.body` | — |
| Hover | `color.surface.raised` @ 8% | `shadow.4` | `plp.heading` | `motion.duration.instant` |
| Focus-visible | `color.surface.strong` | `shadow.4` | `plp.heading` | + `2px` focus ring |
| Active / selected | `color.surface.raised` | none | `color.text.tertiary` | `motion.duration.instant` |

**Category pill list:**

| Pill | Filter applied |
|---|---|
| All | Removes all category filters |
| Indoor Plants | `tag: indoor` |
| Outdoor Plants | `tag: outdoor` |
| Flowering Plants | `tag: flowering` |
| Succulents & Cacti | `tag: succulents` |
| Low Maintenance | `tag: low-maintenance` |
| Air Purifying | `tag: air-purifying` |
| Pet Friendly | `tag: pet-friendly` |
| Gifting | `tag: gifting` |

**Accessibility:**
- `role="tablist"` on container, `role="tab"` on each pill, `aria-selected` on active
- Arrow keys cycle through pills; Enter/Space selects
- Selected pill: `aria-selected="true"`, updates `aria-live="polite"` result count

---

## 8. Filter Sidebar

> The single most impactful conversion component on a PLP. Must be sticky, scannable, and instantly applied.

### 8.1 Sidebar Shell

| Property | Value |
|---|---|
| Width | `260px` |
| Background | `plp.sidebar-bg` |
| Position | `sticky`, `top: 64px` (below nav), full viewport height minus nav |
| Overflow-y | `auto`, scrollable independently of grid |
| Padding | `space.7 × 2 = 16px` |
| Border-right | `1px solid plp.divider` |
| Shadow | `sidebar-sticky` (appears when page scrolls) |
| `aria-label` | `"Product filters"` |
| `role` | `"complementary"` |

### 8.2 Sidebar Header

```
Filters                           [ Reset All ]
```

| Property | Value |
|---|---|
| "Filters" label | `font.size.4xl`, weight 700, `plp.heading` |
| "Reset All" button | `font.size.2xl`, weight 500, `color.surface.raised`, underline hover, right-aligned |
| "Reset All" visible | Only when ≥ 1 filter is active |
| "Reset All" `aria-label` | `"Clear all filters"` |
| Border-bottom | `1px solid plp.divider`, `space.7 × 2` margin below |

### 8.3 Filter Sections

Each filter section is a collapsible accordion group.

**Section header anatomy:**

```
Plant Type                        [▲]
```

| Property | Value |
|---|---|
| Font | `font.size.2xl`, weight 700, `plp.heading` |
| Chevron icon | `16×16px`, `plp.body` @ 50%, rotates `180°→0°` on collapse |
| Padding | `space.7 × 1.5 = 12px` vertical |
| Border-bottom | `1px solid plp.divider` when collapsed |
| Toggle | Click/Enter/Space; `aria-expanded` on trigger, `aria-controls` pointing to panel |
| Default state | All sections expanded on desktop; top 3 expanded on mobile |
| `role` | `<button>` trigger, `role="region"` on panel |

**Filter option anatomy (checkbox style):**

```
[✓]  Monstera                               (42)
[ ]  Fern                                   (28)
[ ]  Pothos                                 (19)
[ ]  Snake Plant                            (35)
```

| Property | Value |
|---|---|
| Layout | Flex row, space-between, `space.6` vertical gap |
| Checkbox | `18×18px`, `radius.xs`, `shadow.3` border; checked: `color.surface.raised` bg + white checkmark SVG |
| Label font | `font.size.xl`, weight 400, `plp.body` |
| Count | `font.size.sm`, weight 500, `plp.body` @ 40%, right-aligned |
| Hover | Entire row: `plp.filter-active-bg`, `radius.xs` |
| Active row | `plp.filter-active-bg`, label weight 600 |
| Touch target | Full row height `44px` minimum |
| `aria-checked` | `true/false` on each checkbox role |
| `role` | `checkbox` on each option; `group` on section |

**Filter option states:**

| State | Checkbox | Label | Row bg |
|---|---|---|---|
| Default | `shadow.3` border, white bg | `plp.body`, weight 400 | Transparent |
| Hover | `shadow.4` border | `plp.heading`, weight 400 | `plp.filter-active-bg` |
| Focus-visible | `2px` focus ring `plp.focus-ring` | — | — |
| Checked | `color.surface.raised` bg, white ✓ | `plp.heading`, weight 600 | `plp.filter-active-bg` |
| Disabled | `plp.divider` border, muted bg | `plp.body` @ 30% | — |

### 8.4 Filter Sections & Options

| Section | Type | Options |
|---|---|---|
| **Plant Type** | Multi-checkbox | Indoor · Outdoor · Flowering · Succulent · Cactus · Climber · Herb · Vegetable |
| **Price Range** | Dual-handle slider | `₹0` to `₹5,000+`; input fields for min/max |
| **Size** | Multi-checkbox | XS (< 6") · S (6–12") · M (12–18") · L (18–24") · XL (> 24") |
| **Light Requirements** | Multi-checkbox | Full Sun · Partial Sun · Low Light · Shade |
| **Watering** | Multi-checkbox | Daily · Weekly · Bi-weekly · Monthly |
| **Special Tags** | Multi-checkbox | Pet Friendly · Air Purifying · Low Maintenance · Rare · Gifting |
| **Rating** | Star selector | 4★ & above · 3★ & above |
| **Availability** | Toggle | In Stock Only |
| **Discount** | Multi-checkbox | 10%+ Off · 25%+ Off · 50%+ Off |

### 8.5 Price Range Slider

```
₹0 ────●─────────────────●──── ₹5,000+
       ₹199              ₹1,499

[ ₹199 ]    to    [ ₹1,499 ]
```

| Property | Value |
|---|---|
| Track height | `6px`, `radius.step8`, `plp.divider` bg |
| Fill | `color.surface.raised` between the two thumbs |
| Thumb | `20×20px` circle, `color.surface.raised` bg, `shadow.card-hover` |
| Thumb hover | Scale `1.15`, `motion.duration.instant` |
| Min/Max input | `48px` wide, `radius.sm`, `shadow.3` border, `font.size.3xl`, currency prefix `₹` |
| Input focus | `shadow.4` border |
| `aria-label` | `"Minimum price"` / `"Maximum price"` |
| `aria-valuemin/max/now` | Per thumb |
| Apply | On input blur OR 500ms debounce after drag |
| Keyboard | Arrows ± `₹50` per press; Shift+Arrow ± `₹500` |

### 8.6 Rating Filter

```
[★★★★☆] 4★ & above  (312)
[★★★☆☆] 3★ & above  (418)
```

| Property | Value |
|---|---|
| Stars | SVG stars, `plp.star-fill` filled, `plp.divider` empty, `16×16px` |
| Label | `font.size.xl`, `plp.body` |
| Count | `font.size.sm`, `plp.body` @ 40% |
| `aria-label` | `"4 stars and above"` etc. |
| Input type | Radio (selecting one deselects the other) |

### 8.7 "Show More" Truncation

If a filter section has > 6 options, show 6 and collapse the rest.

```
Monstera · Fern · Pothos · Snake Plant · Peace Lily · ZZ Plant
[ + 14 more ]
```

| Property | Value |
|---|---|
| "Show more" button | `font.size.xl`, `color.surface.raised`, no border, inline below list |
| Animation | Expand with `motion.duration.fast` height transition |
| `aria-expanded` | On toggle button |

---

## 9. Sort Bar + Active Filter Chips

Sits above the product grid, below category pills.

### 9.1 Layout

```
┌──────────────────────────────────────────────────────────────────┐
│  486 results    [ Bestselling ▾ ]          [ ⊞ ]  [ ≡ ]        │
├──────────────────────────────────────────────────────────────────┤
│  × Indoor Plants   × Pet Friendly   × 4★+   [ Clear All ]       │
└──────────────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Background | `plp.page-bg` |
| Height | `52px` (top row) + conditional chips row |
| Padding | `0` horizontal (aligns to grid) |
| Position | Sticky `top: 64px` (nav height) + `36px` (announcement bar) |
| `z-index` | `50` (below nav, above cards) |
| Border-bottom | `1px solid plp.divider` |
| Shadow on scroll | `0 2px 8px rgba(0,0,0,0.06)` |

### 9.2 Result Count

| Property | Value |
|---|---|
| Font | `font.size.2xl`, weight 400, `plp.body` @ 60% |
| Format | `"486 results"` — update on filter change via `aria-live="polite"` |
| `aria-live` | `"polite"` on container — announces count change to screen reader |

### 9.3 Sort Dropdown

```
[ Bestselling ▾ ]
```

| Property | Value |
|---|---|
| Trigger height | `40px` |
| Trigger border-radius | `radius.step8` |
| Trigger bg | `color.surface.strong` |
| Trigger border | `shadow.3` |
| Trigger font | `font.size.3xl`, weight 500, `plp.heading` |
| Trigger padding | `space.6` vertical, `space.7 × 2` horizontal |
| Chevron icon | `14×14px`, `plp.body` @ 50%, rotates on open |
| Hover | `shadow.4` border, `motion.duration.instant` |
| Focus-visible | `2px` focus ring `plp.focus-ring` |
| Open | Dropdown flyout below trigger |

**Dropdown panel:**

| Property | Value |
|---|---|
| Background | `color.surface.strong` |
| Border | `shadow.3` |
| Border-radius | `radius.xl` |
| Shadow | `sort-dropdown` |
| Width | `220px` |
| `role` | `"listbox"` on panel, `"option"` on each item |
| `aria-expanded` | On trigger |
| Close | Click-outside + Escape + selection |

**Sort options (in order):**

| Option | Default |
|---|---|
| Bestselling | ✓ Default |
| New Arrivals | — |
| Price: Low to High | — |
| Price: High to Low | — |
| Rating: High to Low | — |
| Alphabetical: A–Z | — |

**Sort option states:**

| State | Background | Font weight | Indicator |
|---|---|---|---|
| Default | Transparent | 400 | None |
| Hover | `plp.filter-active-bg` | 500 | None |
| Focus | `plp.filter-active-bg` | 500 | `2px` focus ring |
| Selected | `plp.filter-active-bg` | 700 | `✓` icon left, `color.surface.raised` |

### 9.4 Grid/List View Toggle

```
[ ⊞ Grid ]  [ ≡ List ]
```

| Property | Value |
|---|---|
| Button size | `36×36px`, `radius.sm` |
| Icon size | `18×18px` |
| Default | Grid view active |
| Active | `color.surface.raised` bg, `color.text.tertiary` icon |
| Inactive | `shadow.3` border, `plp.body` @ 60% icon |
| `aria-label` | `"Switch to grid view"` / `"Switch to list view"` |
| `aria-pressed` | `true` on active toggle |
| Mobile | Hidden — always 2-column grid |

### 9.5 Active Filter Chips Row

Appears below sort bar when ≥ 1 filter is active.

```
[ × Indoor Plants ]  [ × Pet Friendly ]  [ × ₹199–₹1,499 ]  [ × 4★+ ]  [ Clear All ]
```

| Property | Value |
|---|---|
| Layout | Horizontal flex wrap, `space.5` gap |
| Chip height | `32px` |
| Chip border-radius | `radius.lg` |
| Chip bg | `plp.chip-bg` |
| Chip font | `font.size.md`, weight 600, `plp.chip-text` |
| Chip padding | `space.4` vertical, `space.7` horizontal |
| × button | `14×14px` inline right, `aria-label="Remove [filter name] filter"` |
| × hover | `color.surface.raised` (darker tint) |
| "Clear All" | `font.size.md`, weight 600, `color.surface.raised`, underline hover, rightmost |
| Chip animation | Fade + scale-in `motion.duration.instant` on add; fade-out on remove |
| `role` | Each chip: `role="group"` wrapping label + × button |

**Mobile filter button (replaces sidebar on mobile):**

```
[ ⚙ Filter  (3) ]
```

| Property | Value |
|---|---|
| Position | Left side of sort bar |
| Height | `40px`, `radius.step8` |
| Badge | Count of active filters: `color.surface.raised` bg, `color.text.tertiary`, `radius.step8`, `font.size.sm` |
| Tap | Opens full-screen filter bottom sheet |

---

## 10. Product Card

> The most repeated and most conversion-critical element on the page. Every detail matters.

### 10.1 Card Anatomy

```
┌───────────────────────────────────┐
│  [-30%]              [♡]          │  ← Badges + Wishlist
│                                   │
│      [Product Image]              │  ← Image (square, fills width)
│                                   │
│  [Bestseller]                     │  ← Social proof badge (optional)
│                                   │
├───────────────────────────────────┤
│  Monstera Deliciosa               │  ← Product name
│  Swiss Cheese Plant               │  ← Common/secondary name
│                                   │
│  ★★★★☆  4.3  (1,204 reviews)    │  ← Rating
│                                   │
│  ₹399   ~~₹599~~  (-33% off)      │  ← Price row
│  Size: S / M / L                  │  ← Size options
│                                   │
│  [ + Add to Cart ]                │  ← CTA
└───────────────────────────────────┘
```

### 10.2 Card Shell

| Property | Value |
|---|---|
| Background | `plp.card-bg` |
| Border | `shadow.2` (green-tinted inset) |
| Border-radius | `radius.md` |
| Padding | `0` — image flush to edges; content padding `space.7 × 2 = 16px` |
| Shadow | `shadow.1` resting |
| Overflow | `hidden` (image clips to radius) |
| Cursor | `pointer` (entire card is clickable to PDP) |

**Card hover state:**

| Property | Value |
|---|---|
| Shadow | `card-hover` |
| Transform | `translateY(-4px)` |
| Border | `shadow.4` |
| Transition | `motion.duration.fast` ease-out |
| Image | Secondary product image crossfades in (if available), `motion.duration.fast` |

### 10.3 Image Area

| Property | Value |
|---|---|
| Aspect ratio | `1 / 1` (square) |
| Object-fit | `cover` |
| Background | `color.surface.strong` (neutral fallback) |
| Border-radius | `radius.md radius.md 0 0` (top corners only) |
| Loading | `loading="lazy"`, `decoding="async"` on all except first 4 cards (above fold) |
| Hover | Secondary image crossfades in, `motion.duration.fast` |
| Fallback | Plant-leaf placeholder SVG, `color.surface.raised` @ 20% bg |
| `alt` | `"[Product name] — [size] — [colour]"` (dynamic) |

### 10.4 Badge Layer (overlaid on image)

**Discount badge (top-left):**

| Property | Value |
|---|---|
| Format | `-33%` |
| Background | `plp.badge-sale-bg` |
| Text | `plp.badge-sale-text`, `font.size.sm`, weight 700 |
| Border-radius | `radius.xs` |
| Padding | `space.4` vertical, `space.6` horizontal |
| Position | Absolute `top: space.7`, `left: space.7` |
| Visibility | Only shown when discount ≥ 10% |

**"New" badge (top-left, if no discount):**

| Property | Value |
|---|---|
| Text | `NEW` |
| Background | `plp.badge-new-bg` |
| Text | `plp.badge-new-text`, `font.size.sm`, weight 700 |
| Border-radius | `radius.xs` |
| Position | Same as discount badge |
| Visibility | Products added within last 30 days |

**"Bestseller" badge (bottom-left of image):**

| Property | Value |
|---|---|
| Text | `Bestseller` |
| Background | `color.surface.base` @ 70% blur-backdrop |
| Text | `color.text.tertiary`, `font.size.sm`, weight 600 |
| Border-radius | `radius.xs` |
| Position | Absolute `bottom: space.7`, `left: space.7` |

**"Low Stock" badge (bottom-left, overrides Bestseller):**

| Property | Value |
|---|---|
| Text | `Only 3 left` |
| Background | `#ef4444` @ 90% |
| Text | `color.text.tertiary`, `font.size.sm`, weight 600 |
| Visibility | When stock ≤ 5 units |

**Sold Out overlay:**

| Property | Value |
|---|---|
| Overlay | Full image area, `plp.badge-oos-bg`, `radius.md radius.md 0 0` |
| Label | `"Sold Out"`, centred, `font.size.2xl`, weight 700, `color.text.tertiary` |
| CTA | Replaced by `"Notify Me"` button (outlined, white) |
| Image | Still visible at 50% opacity beneath overlay |

### 10.5 Wishlist Button

| Property | Value |
|---|---|
| Position | Absolute `top: space.7`, `right: space.7` |
| Size | `36×36px`, `radius.step7` |
| Background | `color.surface.strong` @ 90% |
| Icon | Heart outline → filled, `20×20px` |
| Colour | Outline: `plp.body` · Filled: `#e74c3c` |
| Hover | Scale `1.1`, `motion.duration.instant` |
| Focus-visible | `2px` focus ring `plp.focus-ring` |
| `aria-label` | `"Add [product name] to wishlist"` / `"Remove [product name] from wishlist"` |
| `aria-pressed` | `true` when saved |
| Keyboard | Enter/Space toggles; independent of card link |

### 10.6 Content Area

**Product name:**

| Property | Value |
|---|---|
| Font | `font.size.4xl`, weight 600, `plp.heading` |
| Max lines | 2 — `display: -webkit-box`, `-webkit-line-clamp: 2`, ellipsis |
| Margin top | `space.7 = 8px` |
| Hover | `color.surface.raised` text colour, `motion.duration.instant` |
| `<a>` | Wraps entire card (card-level link to PDP) |

**Secondary / common name:**

| Property | Value |
|---|---|
| Font | `font.size.md`, weight 400, `plp.body` @ 55% |
| Max lines | 1, ellipsis |
| Margin top | `space.3 = 3px` |

**Star rating row:**

| Property | Value |
|---|---|
| Stars | 5 SVG stars, `plp.star-fill` filled, `plp.divider` empty, `14×14px` |
| Star gap | `space.3 = 3px` |
| Value | `font.size.sm`, weight 600, `plp.heading`, left of count |
| Count | `font.size.sm`, weight 400, `plp.body` @ 50%: `(1,204)` |
| Margin top | `space.5 = 5px` |
| `aria-label` | `"4.3 out of 5 stars, 1204 reviews"` on wrapper |
| Link | Rating row links to PDP #reviews anchor |

**Price row:**

```
₹399   ~~₹599~~   -33% off
```

| Property | Value |
|---|---|
| Sale price | `font.size.3xl`, weight 700, `plp.price` |
| Original price | `font.size.md`, weight 400, `plp.price-original`, `text-decoration: line-through` |
| Discount label | `font.size.sm`, weight 600, `color.surface.raised` |
| Layout | Flex row, `space.5` gap, baseline aligned |
| Margin top | `space.6 = 6px` |
| No discount | Only sale price shown, weight 700 |

**Size options row:**

```
Size:  [S]  [M]  [L]
```

| Property | Value |
|---|---|
| Label | `font.size.md`, `plp.body` @ 55%, inline left: `"Size:"` |
| Size chips | `28px` height, `radius.xs`, `shadow.3` border, `font.size.md`, weight 500 |
| Chip padding | `space.4` vertical, `space.6` horizontal |
| Active chip | `shadow.4` border, weight 700, `plp.heading` |
| Hover chip | `shadow.4` border, `motion.duration.instant` |
| Max chips shown | 4 visible; if more, show `+2` counter chip |
| Margin top | `space.6 = 6px` |
| Visibility | Only if product has size variants |
| Keyboard | Chips selectable; updates card price if size-dependent |

### 10.7 Add to Cart Button

```
[ + Add to Cart ]
```

| Property | Value |
|---|---|
| Height | `44px` |
| Width | `100%` |
| Background | `plp.cta-bg` |
| Text | `plp.cta-text`, `font.size.3xl`, weight 600 |
| Border-radius | `radius.step8` |
| Margin top | `space.7 × 1.5 = 12px` |
| Icon | `+` prefix, `16×16px`, `space.4` gap |
| Visibility | Hidden on card, reveals on hover (desktop); always visible mobile |

**Add to Cart states:**

| State | Background | Label | Behaviour |
|---|---|---|---|
| Hidden (desktop) | — | — | `opacity: 0`, `translateY(4px)` |
| Revealed on hover | `plp.cta-bg` | `"+ Add to Cart"` | `opacity: 1`, `translateY(0)`, `motion.duration.fast` |
| Always visible (mobile) | `plp.cta-bg` | `"+ Add to Cart"` | Persistent |
| Hover | `color.surface.raised` darkened 10% | — | `motion.duration.instant` |
| Focus-visible | `plp.cta-bg` + `2px` focus ring | — | — |
| Loading | `plp.cta-bg` @ 70% | Spinner replaces `+`, `aria-busy="true"` | — |
| Success | `plp.cta-bg` | `"✓ Added"` | Auto-revert after `1500ms` |
| Error | `#dc2626` | `"Try again"` | `aria-live="assertive"` |
| Sold Out | Replaced by `"Notify Me"` | `radius.step8`, outlined, `color.surface.raised` | Opens email capture |
| Size not selected | Disabled shimmer | `"Select Size"` | `aria-disabled="true"` |

**Keyboard:** Enter on a card activates the PDP link. Tab to the wishlist icon or Add to Cart button activates their respective functions. Card-level navigation: Tab moves into the card; a second Tab exits.

### 10.8 Full Card Accessibility

| Requirement | Implementation |
|---|---|
| Card link wraps entire card | `<a href="/products/[slug]">` with `aria-label="View [product name]"` |
| Wishlist is separate from card link | `<button>` inside card, `stopPropagation` |
| Add to Cart is separate from card link | `<button>` inside card, `stopPropagation` |
| Image alt | Dynamic: `"[product name] — [size] — [colour]"` |
| Rating `aria-label` | `"4.3 out of 5 stars, 1204 reviews"` |
| Discount badge | `aria-label="33% off"` on badge element |
| "Sold Out" | `aria-label="[product name] — Sold out"` |
| "Low stock" | `aria-live="polite"` on badge |
| Size chip selection | `role="radiogroup"` + `role="radio"` + `aria-checked` |

---

## 11. List View Card

Activated via the list view toggle. Wider horizontal card layout showing more detail.

```
┌──────────────────────────────────────────────────────────────────┐
│  ┌──────────┐   Monstera Deliciosa                    [-33%] [♡]│
│  │          │   Swiss Cheese Plant                              │
│  │  IMAGE   │   ★★★★☆  4.3  (1,204 reviews)                  │
│  │  200×200 │                                                   │
│  └──────────┘   ₹399  ~~₹599~~  -33% off                       │
│                 Size: [S] [M] [L]                               │
│                 ✓ In Stock · Ships in 2–3 days                  │
│                                            [ + Add to Cart ]    │
└──────────────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Height | `200px` |
| Image | `200×200px` left-aligned, `radius.md` |
| Content | Flex column, fills remaining width, `space.7 × 2` left padding |
| Extra info shown | Stock status + delivery estimate (hidden in grid view) |
| CTA | Right-aligned, `width: 160px` |
| Border | `shadow.2`, `radius.md` |
| Hover | `card-hover` shadow, `motion.duration.fast` |

---

## 12. Product Grid Loading States

### 12.1 Skeleton Cards

Shown before product data loads. Exact same grid dimensions as real cards.

| Property | Value |
|---|---|
| Image placeholder | Full image area, `plp.skeleton-base` bg, shimmer animation |
| Text placeholders | Rounded bars at exact widths of real text: name `80%`, rating `50%`, price `40%` |
| CTA placeholder | Full-width bar, `40px` height |
| Shimmer | `linear-gradient(90deg, base, shine, base)`, `background-size: 200%`, `animation: shimmer 1.5s infinite` |
| Card count shown | Same as real grid (24) |
| `aria-busy` | `true` on grid container while loading |
| `aria-label` | `"Loading products"` |

### 12.2 Progressive Loading

| Property | Value |
|---|---|
| Initial load | 24 cards |
| Load trigger | IntersectionObserver on last card (not "Load More" button) |
| Load batch | 24 additional cards per trigger |
| Loading indicator | Row of 4 skeleton cards at bottom of grid |
| No more results | `"You've seen all 486 products"` — centred text, `font.size.2xl`, `plp.body` @ 50% |
| `aria-live` | `"polite"` on grid — announces when new products load |
| Scroll position | Maintained on back-navigation (history state) |

---

## 13. Empty State

Shown when filters return zero results.

```
┌──────────────────────────────────────────────────┐
│                                                  │
│   🪴                                              │
│                                                  │
│   No plants found                                │
│                                                  │
│   Try adjusting or clearing your filters to      │
│   find what you're looking for.                  │
│                                                  │
│   [ Clear All Filters ]   [ Browse All Plants ]  │
│                                                  │
└──────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Icon | Plant-in-pot SVG, `64×64px`, `color.surface.raised` @ 40% |
| Heading | `"No plants found"`, `font.size.4xl`, weight 700, `plp.heading` |
| Body | `font.size.2xl`, weight 400, `plp.body` @ 70%, max-width `360px`, centred |
| "Clear All Filters" | `color.surface.raised` filled, `radius.step8`, `font.size.3xl` weight 600 |
| "Browse All Plants" | Outlined, `radius.step8`, `color.surface.raised` border + text |
| CTA gap | `space.7 = 8px` |
| Alignment | Vertically + horizontally centred in grid area |
| `aria-live` | `"polite"` — announced when empty state appears |
| Suggestion chips | Below CTAs: "Try: Indoor Plants / Low Maintenance / Under ₹500" |

---

## 14. "You May Also Like" Section

Personalised product recommendations shown below the main grid.

```
You May Also Like
Based on what other plant lovers are exploring
─────────────────────────────────────────────────────────
[ Card ]  [ Card ]  [ Card ]  [ Card ]  [ Card ] →
```

| Property | Value |
|---|---|
| Background | `color.surface.raised` @ 50% (off-white alternate) |
| Section padding | `space.7 × 8 = 64px` vertical |
| Heading | `font.size.4xl × 1.5` (~24px), weight 700, `plp.heading` |
| Sub-label | `font.size.2xl`, `plp.body` @ 60%, margin-top `space.5` |
| Layout | Horizontal scroll carousel, `scroll-snap-type: x mandatory` |
| Card size | Same as grid cards |
| Cards shown | 4 desktop · 3 tablet · 2 mobile |
| Prev/Next arrows | `44×44px`, `radius.step7`, `shadow.3` border; hover `color.surface.raised` bg |
| Arrow disabled | `opacity: 0.3`, `aria-disabled="true"` |
| `aria-label` | `"You may also like"`, `role="region"` |
| Data source | Based on currently browsed category + user's recent history |

---

## 15. SEO Text Block

A concise, keyword-rich text block at the bottom of the page, after all products.

```
About Indoor Plants
Indoor plants transform living spaces with natural beauty and cleaner air.
At Hero, we offer 500+ indoor plant varieties — from low-maintenance ...
[ Read more ]
```

| Property | Value |
|---|---|
| Background | `plp.page-bg` |
| Max-width | `800px`, centred |
| Heading | `<h2>`, `font.size.4xl`, weight 700, `plp.heading` |
| Body | `font.size.2xl`, `plp.body` @ 80%, `font.lineHeight.base` |
| Collapsed height | `96px` (3 lines), remainder hidden |
| "Read more" | `color.surface.raised`, underline, expands full text, `aria-expanded` |
| Section padding | `space.7 × 8 = 64px` vertical |
| Purpose | SEO keyword content — not shown prominently; collapsed by default |

---

## 16. Mobile Filter Bottom Sheet

Replaces sidebar on `< 768px` viewports.

### 16.1 Trigger

```
[ ⚙ Filter (3) ]     [ Bestselling ▾ ]
```

| Property | Value |
|---|---|
| Position | Full-width bar, sticky top below nav |
| Filter button | Left, `height: 44px`, `radius.step8`, `shadow.3` border |
| Filter badge | Active count pill, `color.surface.raised`, `radius.step8` |
| Sort button | Right, same dimensions, sort label + chevron |

### 16.2 Bottom Sheet

| Property | Value |
|---|---|
| Trigger | "Filter" button tap |
| Animation | Slides up from bottom, `motion.duration.normal` |
| Height | `85vh` maximum, `min-height: 50vh` |
| Border-radius | `radius.2xl radius.2xl 0 0` (top corners only) |
| Background | `color.surface.strong` |
| Drag handle | `40×4px` pill, `plp.divider`, centred top `space.7` |
| Header | `"Filters"` heading + `"Reset All"` link + `×` close button |
| Content | Same filter sections as sidebar, scrollable |
| Footer | Fixed inside sheet: `[ Show 312 Results ]` full-width green button |
| `role` | `"dialog"`, `aria-modal="true"`, `aria-label="Product filters"` |
| Focus trap | Yes — Tab cycles only inside sheet |
| Close | Drag down + `×` button + Escape |
| Show Results button | Closes sheet; updates grid; `aria-label="Show [n] results"` |

---

## 17. Accessibility Requirements

### 17.1 Contrast Ratios

| Pairing | Ratio | Required | Status |
|---|---|---|---|
| `plp.heading` (#1c1c1c) on `plp.page-bg` (#fefcf9) | ~17:1 | 4.5:1 | ✅ Pass |
| `plp.cta-text` (#fff) on `plp.cta-bg` (#00b566) at `font.size.3xl` weight 600 | ~3.4:1 | 3:1 large | ✅ Pass |
| `plp.price-original` (#1c1c1c @ 45%) on `plp.card-bg` | ~5:1 | 4.5:1 | ✅ Pass |
| `plp.chip-text` (`color.surface.raised`) on chip bg (`color.surface.raised` @ 12%) | ~8:1 | 4.5:1 | ✅ Pass |
| `plp.badge-sale-text` (#fff) on `plp.badge-sale-bg` (#00b566) at `font.size.sm` | ~3.4:1 | 4.5:1 | ⚠️ Must use weight 700 minimum and `font.size.sm = 11px` minimum |
| Skeleton shimmer | Decorative | N/A | ✅ Pass |
| `plp.star-fill` (#c8a84b) on `plp.card-bg` | Decorative | Paired with text label | ✅ Pass |

### 17.2 Focus Management

- Selecting a filter must not move focus away from that filter checkbox
- After applying a filter: `aria-live="polite"` on result count announces new total
- Opening mobile filter sheet: focus moves to sheet heading
- Closing sheet: focus returns to filter trigger button
- Sort selection: focus stays on sort trigger after selection
- Adding to cart: focus stays on Add to Cart button; toast announced via `aria-live`
- Wishlist toggle: focus stays on wishlist button; state change announced

### 17.3 Full ARIA Map

| Component | ARIA |
|---|---|
| Breadcrumb | `<nav aria-label="Breadcrumb">`, `<ol>`, `aria-current="page"` |
| Category pills | `role="tablist"`, `role="tab"`, `aria-selected` |
| Filter sidebar | `role="complementary"`, `aria-label="Product filters"` |
| Filter section | `<button>` trigger, `aria-expanded`, `aria-controls`, panel `role="region"` |
| Filter checkbox | `role="checkbox"`, `aria-checked` |
| Price slider | `role="slider"` × 2, `aria-valuemin/max/now/label` |
| Rating filter | `role="radio"` in `role="radiogroup"` |
| Sort dropdown | `aria-haspopup="listbox"`, `aria-expanded`; panel `role="listbox"` |
| Sort option | `role="option"`, `aria-selected` |
| Grid view toggle | `role="group"`, each `aria-pressed` |
| Result count | `aria-live="polite"` |
| Active filter chip | `role="group"`, × button `aria-label="Remove [filter] filter"` |
| Product grid | `role="list"`, `aria-busy` during load |
| Product card | `role="listitem"`, card `<a>` `aria-label="View [name]"` |
| Wishlist button | `aria-pressed`, `aria-label` |
| Add to Cart button | `aria-busy` on load, `aria-label="Add [name] to cart"` |
| Size chips on card | `role="radiogroup"`, `role="radio"`, `aria-checked` |
| "Sold Out" card | `aria-label="[name] — Sold out"` |
| Skeleton grid | `aria-busy="true"`, `aria-label="Loading products"` |
| Mobile filter sheet | `role="dialog"`, `aria-modal="true"`, focus trap |
| "Show N Results" | `aria-label="Show [n] results and close filters"` |
| Recommendation region | `role="region"`, `aria-label="You may also like"` |
| Carousel arrows | `aria-label="Previous"` / `"Next"`, `aria-disabled` |

### 17.4 Keyboard Navigation Map

| Key | Behaviour |
|---|---|
| `Tab` | Moves through all interactive elements in DOM order |
| `Arrow Left/Right` | Cycles through category pills (tablist) |
| `Arrow Up/Down` | Moves between sort options (listbox); filter options (within section) |
| `Enter / Space` | Activates button, link, checkbox, radio |
| `Escape` | Closes sort dropdown · closes mobile filter sheet · closes quick-view modal |
| `Home / End` | Price slider jumps to min / max |
| `Arrow keys` (slider) | ± `₹50` per press |
| `Shift + Arrows` (slider) | ± `₹500` per press |
| `Delete / Backspace` (chip) | Remove focused filter chip |

### 17.5 Testable Acceptance Criteria

| # | Criterion | Method | Pass |
|---|---|---|---|
| A1 | No contrast failures | axe DevTools | Zero critical |
| A2 | All focus rings visible | Manual Tab | `2px solid #00b566` on all |
| A3 | Result count announced on filter | Screen reader | `aria-live` fires |
| A4 | Wishlist state announced | Screen reader | `aria-pressed` change |
| A5 | Category pill selection announced | Screen reader | `aria-selected` change |
| A6 | Add to Cart loading announced | Screen reader | `aria-busy` change |
| A7 | Filter sheet traps focus | Keyboard | Tab cycles inside only |
| A8 | Filter sheet closes on Escape | Keyboard | Escape closes; focus returns to trigger |
| A9 | Sort keyboard-operable | Keyboard | Arrow keys + Enter work |
| A10 | Price slider keyboard-operable | Keyboard | Arrows change value; canvas updates |
| A11 | Skeleton has accessible loading label | Screen reader | `aria-busy="true"` announced |
| A12 | Empty state announced | Screen reader | `aria-live` fires; message read |
| A13 | Image alt reflects variant | Screen reader | Alt includes size + colour |
| A14 | Reduced motion | OS setting | All transitions disabled |
| A15 | Discount badge has text label | Screen reader | `aria-label` not colour-only |

---

## 18. Content & Tone Standards

### 18.1 Product Card Copy

| Element | Rule | Example |
|---|---|---|
| Product name | Max 2 lines, sentence case | `"Monstera Deliciosa"` |
| Secondary name | Max 1 line, descriptive common name | `"Swiss Cheese Plant"` |
| Price | Always `₹` prefix, no paise (round to rupee) | `₹399` not `₹399.00` |
| Discount | `"-33% off"` format, only if ≥ 10% | `"-33% off"` |
| Size | `S / M / L` — not abbreviation soup | `"S / M / L"` |
| CTA | `"+ Add to Cart"` — always this exact label | Never `"Buy"` or `"Shop"` |
| Sold Out CTA | `"Notify Me"` | Never `"Out of Stock"` as CTA |
| Badge labels | `"Bestseller"` / `"New"` / `"Only [n] left"` | Sentence case |

### 18.2 Filter Labels

- Must: Use plain language — `"Low Maintenance"` not `"Easy Care Level"`
- Must: Show count of matching products in brackets — `(42)`
- Must not: Use zero-result filter options (hide or disable if 0 products match)
- Should: Sort options alphabetically within each filter group

### 18.3 Sort Options

- Must: Default to `"Bestselling"` on first page load
- Must: Persist selected sort across filter changes (don't reset sort on filter)
- Must not: Use `"Relevance"` as an option — non-descriptive

### 18.4 Empty State

- Must: Explain why results are empty — `"No plants found for these filters"`
- Must: Offer a clear escape — `"Clear All Filters"` or `"Browse All Plants"`
- Must not: Show generic 404 or error message

---

## 19. Anti-Patterns & Prohibited Implementations

| Anti-pattern | Why prohibited | Correct approach |
|---|---|---|
| Raw hex `#00b566` in CSS | Breaks token system | Use `color.surface.raised` |
| `outline: none` on any element | Kills keyboard | `outline: 2px solid color.surface.raised` |
| "Quick View" modal | Baymard: no longer best practice; adds click layer | Link directly to PDP |
| More than 4 columns on desktop | Cognitive overload (Baymard Institute) | Max 4-col grid |
| Auto-paginating without scroll position memory | Back-nav loses position | Save scroll + page in history state |
| Filter applied only on "Apply" click | Creates friction; delays feedback | Apply filters instantly on check |
| All filters collapsed on load | Discovery friction | Expand top 3–4 filter sections by default |
| Zero-result options not hidden | Misleading; leads to empty state | Hide options with 0 results after filtering |
| Discount badge without text `aria-label` | Colour-only meaning | Always add `aria-label="33% off"` |
| Wishlist inside card `<a>` tag | Nested interactive elements | Wishlist is `<button>` sibling to the card link |
| Sort resets on filter change | Confusing; user's preference lost | Persist sort selection across filter changes |
| Infinite scroll with no "you've seen all" message | No closure; user doesn't know if done | Show `"You've seen all [n] products"` |
| "Add to Cart" always visible on desktop | Clutters grid at scale | Reveal only on hover desktop; always visible mobile |
| Using `<div>` for cards | Inaccessible to screen readers | `<ul>` + `<li>` + inner `<a>` for card link |
| Filter bottom sheet without focus trap | Keyboard escapes modal | Focus trap required on mobile sheet |
| Price shown without `₹` currency prefix | Ambiguous | Always prefix with `₹` |

---

## 20. Edge-Case Handling

| Scenario | Behaviour |
|---|---|
| Product has only 1 size | Hide size chips row on card |
| Product has no reviews | Hide star row; show no placeholder rating |
| Product name > 2 lines | `line-clamp: 2` + ellipsis; full name in tooltip on hover |
| All products sold out | Show full grid with sold-out overlays; `"Notify Me"` CTAs |
| Filter returns 1 result | Grid shows 1 card; `"1 result"` in count; no empty state |
| No products in collection | Full empty state shown immediately |
| Image fails to load | Plant leaf placeholder SVG, `color.surface.raised` bg |
| Discount of exactly 0% | No discount badge shown |
| Very long price (> `₹10,000`) | No truncation; container min-width `80px` |
| User wishlists 20+ items | No cap; wishlist count in nav updates |
| Filter count changes to 0 | Option is dimmed and `aria-disabled`; not removed (prevents layout shift) |
| Sort "Price: Low–High" with sold-out items | In-stock items first, sold-out items last |
| Back navigation from PDP | Grid restores scroll position + selected filters + sort |
| Slow network on progressive load | Show skeleton row; retry after 3s; show error message after 10s |
| JavaScript disabled | Server-rendered grid with form-based filter (GET request) |
| No search results from search referral | Show message: `"No results for '[query]'. Here are our popular plants instead."` + fallback grid |

---

## 21. Performance Specification

| Metric | Target |
|---|---|
| LCP | `< 2.5s` — first 4 card images `loading="eager"`, `fetchpriority="high"` |
| CLS | `< 0.1` — all card images have explicit `aspect-ratio: 1/1` + `width/height` |
| INP | `< 200ms` — filter application, sort change, wishlist toggle |
| FCP | `< 1.8s` — critical CSS inlined; Outfit font preloaded |

**Image strategy:**

| Image | Format | Loading |
|---|---|---|
| First 4 cards (above fold) | WebP + JPEG fallback, `srcset` 2 sizes | `eager`, `fetchpriority="high"` |
| Remaining cards | WebP + JPEG fallback | `lazy`, `decoding="async"` |
| Card hover secondary image | Preloaded on card hover-intent (100ms delay) | `<link rel="preload">` injected |
| Skeleton | Pure CSS — no images | — |

---

## 22. Page Sections — Full Order

```
01  ANNOUNCEMENT BAR            — shared component
02  NAVIGATION BAR              — "Plants" active
03  BREADCRUMB                  — Home / Plants
04  PAGE HEADER                 — h1, description, result count
05  CATEGORY PILLS              — horizontal sub-nav
06  SORT BAR + ACTIVE CHIPS     — sticky below nav (z: 50)
    ┌────────────────────────────────────────────┐
    │ FILTER SIDEBAR (sticky, 260px)             │
    │ PRODUCT GRID (4-col, 24 cards)             │
    │ PROGRESSIVE LOAD TRIGGER                   │
    │ "YOU'VE SEEN ALL" FOOTER LINE              │
    └────────────────────────────────────────────┘
07  YOU MAY ALSO LIKE           — recommendation carousel
08  SEO TEXT BLOCK              — collapsed by default
09  FOOTER                      — shared component
    MOBILE FILTER BOTTOM SHEET  — conditional, mobile only
    CART DRAWER                 — shared, slides in on add
```

---

## 23. Responsive Behaviour Summary

| Breakpoint | Grid | Sidebar | Sort bar | Cards |
|---|---|---|---|---|
| `≥ 1280px` | 4 col | Visible sticky 260px | Full: count + sort + toggle | Hover reveals CTA |
| `1024–1279px` | 3 col | Visible sticky 240px | Full | Hover reveals CTA |
| `768–1023px` | 2 col | Bottom sheet drawer | Filter btn + sort | CTA always visible |
| `< 768px` | 2 col | Bottom sheet full-screen | Filter btn + sort | CTA always visible |
| `< 480px` | 2 col compact | Bottom sheet full-screen | Icon-only filter btn | CTA always visible, smaller |

---

## 24. QA Checklist

### Visual
- [ ] Page background: `color.surface.strong` (#fefcf9)
- [ ] All text: `Outfit` font family
- [ ] No raw hex in CSS — tokens only
- [ ] Category pills: active pill full green, inactive transparent
- [ ] Filter checkboxes: green fill with white ✓ when checked
- [ ] Price slider: green fill between thumbs; green thumbs
- [ ] Cards: hover lifts `4px`, green border, secondary image fades in
- [ ] Discount badge: green bg, white text, `radius.xs`
- [ ] "Bestseller" badge: dark semi-transparent bg, white text
- [ ] "Sold Out" overlay: full image coverage, correct opacity
- [ ] Add to Cart: hidden desktop until hover; always visible mobile
- [ ] Active filter chips: green-tinted bg, green text, × button
- [ ] Skeleton cards: shimmer animation, matches card dimensions
- [ ] Sort dropdown: correct shadow, `radius.xl`, green check on selected

### Interaction
- [ ] Category pill click: filters grid instantly; result count updates
- [ ] Filter checkbox: applies filter instantly; result count updates
- [ ] Price slider: drags smoothly; updates grid after 500ms debounce
- [ ] Sort dropdown: opens on click/Enter; closes on Escape/outside click
- [ ] Grid view / list view toggle switches layout correctly
- [ ] Active filter chip × removes that filter; grid updates
- [ ] "Clear All Filters" removes all; grid resets
- [ ] Wishlist toggle: heart fills on click; state persists across page
- [ ] Add to Cart: spinner during load; "✓ Added" on success; cart count increments
- [ ] Progressive load: fires on scroll to last card; skeleton row appears
- [ ] "You've seen all" message appears after last card loads
- [ ] Mobile filter sheet: opens on tap; closes on drag/Escape/Show Results
- [ ] Back from PDP: scroll position, filters, and sort all restored
- [ ] Sort persists when filter changes

### Accessibility
- [ ] axe DevTools: zero critical/serious errors
- [ ] All focus rings: `2px solid #00b566` on every element
- [ ] Result count `aria-live` fires on every filter change
- [ ] Screen reader announces wishlist toggle state
- [ ] Category pill tab/arrow navigation works
- [ ] Sort keyboard-operable: arrows + Enter
- [ ] Price slider keyboard-operable: arrows change value
- [ ] Mobile filter sheet focus trap works
- [ ] Filter sheet closes on Escape; focus returns to trigger
- [ ] Card image `alt` is dynamic and descriptive
- [ ] "Sold Out" communicated in text, not only visually
- [ ] Discount badge `aria-label` present
- [ ] Skeleton: `aria-busy="true"` on grid during load
- [ ] Empty state: `aria-live="polite"` announces

### Content
- [ ] Product names: sentence case, max 2 lines
- [ ] Prices: `₹` prefix, rounded to whole rupee
- [ ] Discounts: only shown ≥ 10%, format `-33% off`
- [ ] CTA label: `"+ Add to Cart"` exactly
- [ ] "Notify Me" for sold-out (not `"Out of Stock"`)
- [ ] Filter options: plain language, count in brackets
- [ ] Sort defaults to `"Bestselling"`
- [ ] Empty state has both clear-filters + browse-all actions

### Responsive
- [ ] No horizontal overflow at 320px viewport
- [ ] Touch targets ≥ 44×44px on all interactive elements
- [ ] Mobile: sidebar replaced by bottom sheet
- [ ] Mobile: Add to Cart always visible (not hover-reveal)
- [ ] Mobile: 2-column grid on all breakpoints below 768px
- [ ] Category pills scroll horizontally; no wrapping

---

*Document version: 1.0 — Plants Product Listing Page (PLP)*
*Guideline standard: WCAG 2.2 AA | Token system: Outfit / Hero brand token set*
*Companion documents: Homepage design.md · Red Anthurium Plant PDP design.md · AI Care design.md · Garden Services design.md*
*Last updated: June 2026*
