# Plant Details Page — Design Specification
**Brand:** plant byst | **Page:** Product / Plant Detail Page
**URL Pattern:** `plantture.com/app/plants/[slug]`

---

## 1. Page Overview

The Plant Details Page is a full product page for an individual plant listing. It is composed of **three primary vertical sections**:

1. **Above-the-fold** — Navigation + Product Hero (image gallery + purchase controls)
2. **Mid-page** — Pot selector section (scrolled into view)
3. **Below-fold** — Related products / size comparison grid

The overall aesthetic mirrors the homepage: warm cream background, organic textures, soft shadows, earthy greens.

---

## 2. Design Tokens (Page-Level)

### 2.1 Colors

| Token | Hex | Usage |
|---|---|---|
| `--color-bg` | `#F2EDE4` | Main page background (warm cream/linen) |
| `--color-bg-card` | `#FFFFFF` | Image card backgrounds |
| `--color-bg-section` | `#EDE7DA` | Alternating section bg |
| `--color-green-dark` | `#3A6B30` | CTA button, active state, accent |
| `--color-green-mid` | `#5A8A50` | Secondary labels, star fill |
| `--color-green-pale` | `#C8DBBF` | Thumbnail border active, light tints |
| `--color-text-heading` | `#1E2D1F` | Product name, section headings |
| `--color-text-body` | `#4A5C4B` | Description, labels |
| `--color-text-muted` | `#8A9E8B` | Sub-labels, breadcrumb |
| `--color-text-link` | `#3A6B30` | "Learn more", "See All" links |
| `--color-price` | `#1E2D1F` | Price figures |
| `--color-premium-tag` | `#6B8C62` | "+0+ Premium $45.00" tag |
| `--color-star` | `#F5A623` | Star rating fill (amber/gold) |
| `--color-star-empty` | `#D0C9BB` | Empty star |
| `--color-white` | `#FFFFFF` | Cards, buttons, thumbnails bg |
| `--color-black` | `#1A1A1A` | Geometric pot option |
| `--color-border` | `#E0D8CC` | Dividers, inactive size button borders |
| `--color-overlay` | `rgba(0,0,0,0.04)` | Hover overlays on cards |

### 2.2 Typography

| Role | Font | Weight | Size |
|---|---|---|---|
| **Brand Logo** | `Libre Baskerville` / serif | Regular 400 | 22px |
| **Nav Links** | `Poppins` | Medium 500 | 14px |
| **Breadcrumb** | `Poppins` | Regular 400 | 13px |
| **PC Label (eyebrow)** | `Poppins` | Regular 400 | 13px, muted |
| **Product Name** | `Playfair Display` | Bold italic 700 | 40–46px |
| **Section Label** | `Poppins` | SemiBold 600 | 13px, letter-spaced |
| **Description body** | `DM Sans` | Regular 400 | 14–15px |
| **"Learn more" link** | `DM Sans` | Regular 400 | 14px, underline |
| **Price** | `Poppins` | Bold 700 | 32–36px |
| **Premium tag** | `Poppins` | Regular 400 | 13px |
| **Star count** | `DM Sans` | Regular 400 | 13px |
| **Size button text** | `Poppins` | Medium 500 | 14–15px |
| **Add to Cart button** | `Poppins` | SemiBold 600 | 16px |
| **Pot label** | `DM Sans` | Regular 400 | 13px, centered |
| **Section heading** | `Poppins` | Bold 700 | 22–24px |
| **Quantity number** | `Poppins` | Medium 500 | 16px |

### 2.3 Spacing

| Token | Value |
|---|---|
| `--space-xs` | 4px |
| `--space-sm` | 8px |
| `--space-md` | 16px |
| `--space-lg` | 24px |
| `--space-xl` | 40px |
| `--space-2xl` | 64px |

### 2.4 Border Radius

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | 8px | Thumbnails, small chips |
| `--radius-md` | 12px | Pot cards, quantity input |
| `--radius-lg` | 16px | Main image container, size buttons |
| `--radius-xl` | 24px | Add to Cart button |
| `--radius-full` | 9999px | Wishlist heart button, chat FAB |

### 2.5 Shadows

| Token | Value | Usage |
|---|---|---|
| `--shadow-image` | `0 4px 20px rgba(0,0,0,0.08)` | Main product image card |
| `--shadow-btn` | `0 4px 16px rgba(58,107,48,0.30)` | Add to Cart button |
| `--shadow-pot-active` | `0 0 0 2px #3A6B30` | Active pot card outline |
| `--shadow-size-active` | `0 0 0 2px #3A6B30` | Active size button outline |
| `--shadow-fab` | `0 4px 16px rgba(0,0,0,0.20)` | Chat FAB button |

---

## 3. Layout & Grid

- **Max content width:** 1200px, horizontally centered
- **Page padding:** 0 48px (desktop), 0 16px (mobile)
- **Product hero:** 2-column CSS Grid — `[image col: ~520px] [info col: 1fr]`, gap 48px
- **Thumbnail strip:** Horizontal flex row below main image
- **Pot selector:** Full-width horizontal scroll row

---

## 4. Section-by-Section Specification

---

### 4.1 Navigation Bar

```
[ plant byst ]     Home  Boixs  Plants  Products  Product  About     [🔍] [👤] [🛒 badge:1]
```

| Property | Value |
|---|---|
| **Logo** | "plant byst" — serif lowercase italic, ~22px, dark text |
| **Background** | Transparent over page cream background (no card/box) |
| **Nav Links** | Home, Boixs, Plants, Products, Product, About — Poppins Medium 500, 14px |
| **Active link** | Same weight; page context = "Plants" or "Products" |
| **Right icons** | 🔍 Search, 👤 Account, 🛒 Cart |
| **Cart badge** | Small dark green circle, white number "1", top-right of cart icon |
| **Height** | 60–64px |
| **Sticky** | Yes — fixed top, inherits page background |
| **Mobile** | Hamburger (☰) collapses links |

---

### 4.2 Breadcrumb

```
Home  /  Fern "Green Lady"
```

| Property | Value |
|---|---|
| **Position** | Below nav, top of content area |
| **Font** | Poppins Regular 400, 13px |
| **Color** | `--color-text-muted` |
| **Separator** | `/` with spacing |
| **Current page** | "Fern "Green Lady"" — slightly darker than muted, no underline |
| **Links** | "Home" — underline on hover |

---

### 4.3 Product Hero — Two-Column Layout

#### LEFT COLUMN — Image Gallery

##### Main Image
| Property | Value |
|---|---|
| **Size** | ~520px × 400px |
| **Shape** | Rounded rectangle, `--radius-lg` |
| **Background** | Warm white/cream card (`#FFFFFF`) |
| **Object fit** | `contain` — full plant visible with breathing room |
| **Shadow** | `--shadow-image` |
| **Zoom icon** | 🔍 Magnify icon, bottom-right corner of image card; circular white button, 32px; on click → lightbox/zoom |
| **Wishlist icon** | ♡ Heart icon, top-right corner of image card; circular white button, 36px; filled red on toggle |
| **Selected size visual** | Main image **changes** when a size button is selected (Small/Medium/Large) — different crop/angle of the same plant |

##### Thumbnail Strip (below main image)
| Property | Value |
|---|---|
| **Count** | 3 thumbnails visible |
| **Size** | ~90px × 80px each |
| **Shape** | Rounded rectangle, `--radius-sm` |
| **Gap** | 10px between thumbnails |
| **Active state** | Slightly raised, subtle green border `--color-green-pale` or `--shadow-pot-active` |
| **Background** | White card |
| **Behavior** | Clicking a thumbnail sets it as the main image |
| **Images** | Thumbnail 1: plant in terracotta pot (default) · Thumbnail 2: plant in white pot · Thumbnail 3: potted plant different angle |

##### Image Dots (below thumbnails on scroll / mobile)
| Property | Value |
|---|---|
| **Count** | 5 dots (indicates 5 swipeable images) |
| **Active** | Elongated dark green pill, ~24px wide |
| **Inactive** | Small circle, muted beige |
| **Position** | Centered below thumbnail row |

---

#### RIGHT COLUMN — Product Info Panel

##### Eyebrow Label
- Text: "PC Menghe" (category/collection label)
- Font: Poppins Regular 400, 13px
- Color: `--color-text-muted`
- Margin bottom: 4px

##### Product Name
- Text: `Fern "Green Lady"` — the word *Green Lady* in **italic**, Fern in regular or also italic
- Font: Playfair Display Bold Italic, ~42–46px
- Color: `--color-text-heading`
- Line height: 1.1

##### Description Section

```
Description
──────────────────────────
[body text paragraph]  Learn more.
```

| Property | Value |
|---|---|
| **Label** | "Description" — Poppins SemiBold 600, 13px, letter-spacing 0.5px, `--color-text-muted` |
| **Body text** | 2–3 lines of plant description — DM Sans Regular, 14–15px, `--color-text-body` |
| **"Learn more" link** | Inline at end of paragraph; dark green underline, 14px |

##### Price Row

```
Price                              $15.00
★★★★☆  30 (nes)       +0+ Premium $45.00
```

| Property | Value |
|---|---|
| **"Price" label** | Poppins Regular, 13px, `--color-text-muted` |
| **Price value** | Poppins Bold 700, 32–36px, `--color-price`, right-aligned |
| **Price changes** | Price updates dynamically when a size is selected: Small → $15, Medium → $25, Large → $35 |
| **Star rating** | 4 filled amber stars + 1 empty, 16px each |
| **Review count** | "30 (nes)" — DM Sans 13px, muted |
| **Premium tag** | "+0+ Premium $45.00" — right-aligned, Poppins Regular 13px, `--color-premium-tag` |
| **Divider** | Thin horizontal rule (`--color-border`) below this row |

##### Select Size Row

```
Select Size                        See All
[ Small ]  [ Medium ]  [ Large ]
```

| Property | Value |
|---|---|
| **Label** | "Select Size" — Poppins SemiBold 600, 15px |
| **"See All" link** | Right-aligned, green, 13px |
| **Button shape** | Rounded rectangle, `--radius-lg`, ~110px × 46px each |
| **Inactive state** | White fill, `--color-border` border, `--color-text-body` text |
| **Active/selected state** | Dark green fill (`--color-green-dark`), white text, no border |
| **Hover state** | Subtle green tint background, green border |
| **Options** | Small · Medium · Large |
| **Behavior** | Selecting a size button updates: (1) main image, (2) displayed price |

##### Quantity + Add to Cart Row

```
[ − ]  [ 1 ]  [ + ]        [ Add to Cart ————————— ]
```

| Property | Value |
|---|---|
| **Quantity control** | Minus (−) + number display + Plus (+); pill-shaped container, white bg, border, ~140px wide |
| **Minus/Plus buttons** | 32px tap area, muted color when at min/max |
| **Number** | Center-aligned, Poppins Medium 500, 16px |
| **"Add to Cart" button** | Dark green fill `--color-green-dark`, white text, `--radius-xl`, ~300px wide, 52px height |
| **Button shadow** | `--shadow-btn` |
| **Hover** | Slightly darker green, scale 1.02 |

##### Below-Cart Row

```
🚚 Add by Prize Prate        ♡ Filter mow
```

| Property | Value |
|---|---|
| **Left element** | Truck icon + "Add by Prize Prate" (delivery note / add-on link) — green underlined link |
| **Right element** | ♡ heart icon + "Filter mow" (wishlist / filter action) — `--color-text-muted` |
| **Font** | DM Sans Regular 13px |

---

### 4.4 Select Your Pot Section (Below Product Hero)

This section appears when the user scrolls down. It is a **full-width horizontal carousel** for pot selection.

#### Section Header

```
Select Your Pot            Calale   ‹  ›
```

| Property | Value |
|---|---|
| **Heading** | "Select Your Pot" — Poppins Bold 700, 22–24px, `--color-text-heading` |
| **Right link** | "Calale" text + `‹` prev `›` next navigation arrows — Poppins Medium 14px |
| **Arrow buttons** | Circular outline buttons, ~32px, `--radius-full` |

#### Tabs (Filter)

```
[ Normal ]  [ Normies ]  [ Varieties ]
```

| Property | Value |
|---|---|
| **Style** | Pill tabs / toggle buttons |
| **Active** | Dark green pill, white text |
| **Inactive** | Transparent/white, muted text |
| **Font** | Poppins Medium 500, 14px |

#### Pot Cards Row

```
‹  [Normal]  [White Minimalist★]  [Vorite Door]  [Vorite Door]  [Dutfcier lies]  [Phnte Sear]  [Boat Da...]  ›
```

| Property | Value |
|---|---|
| **Layout** | Horizontal scrollable flex row; prev `‹` / next `›` arrows on edges |
| **Card size** | ~140px × 180px |
| **Card shape** | Rounded rectangle `--radius-md` |
| **Card bg** | White |
| **Image area** | Top ~60% — pot image, centered, `object-fit: contain` |
| **Label area** | Bottom ~40% — pot name, centered, DM Sans Regular 13px |
| **Active/selected state** | Green border outline (`--shadow-pot-active`), slightly elevated shadow |
| **Hover** | Subtle shadow lift, scale 1.02 |

##### Pot Options Visible

| # | Name | Description |
|---|---|---|
| 1 | **Normal** | Classic terracotta pot, unglazed orange-brown |
| 2 | **White Minimalist** *(default selected)* | Clean white ceramic cylinder, matte finish |
| 3 | **Vorite Door** | Small white/off-white pot, rounded base |
| 4 | **Vorite Door** (variant) | Dark geometric faceted black pot (polygonal shape) |
| 5 | **Dutfcier lies** | Natural woven/rattan basket-style planter |
| 6 | **Phnte Sear** | White ceramic with small plant inserted already |
| 7 | **Boat Da...** | Terracotta/orange pot variant (partially visible, implies scroll) |

#### Pot Section Sub-label
- Small label below section: "Fant Tean Pot" — muted italic, possibly a collection name
- Position: bottom-left, near pot cards

---

### 4.5 Size Comparison / Related Products Grid (Bottom Section)

This section appears furthest down the scroll. It appears to be a **size comparison view** or **related products** displayed as large image cards.

#### Layout

```
[ Large image card 1 ]  [ Large image card 2 ]  [ Large image card 3 → ]
                          ♡                          🛍️
              ●  ●  ○  ○  ○        (carousel dots)
                   $45.00                [ Add to Cart ]
              + Premium $45.00
```

| Property | Value |
|---|---|
| **Card count visible** | 3 cards at once (horizontal scroll implied) |
| **Card size** | ~380px × 280px |
| **Card shape** | Rounded rectangle `--radius-lg` |
| **Image** | Full-bleed plant photo, `object-fit: cover` |
| **Wishlist icon** | ♡ heart button, top-right of center card, circular white bg |
| **Cart icon** | 🛍️ shopping bag icon on rightmost card, circular white bg |
| **Carousel dots** | 5 dots below the cards row; active = elongated green pill |
| **Price display** | Large price below carousel dots, center-aligned: `$45.00`, Poppins Bold 36px |
| **Premium tag** | `+ Premium $45.00` — below main price, smaller, muted green |
| **Add to Cart button** | Right-aligned large pill button, dark green, matches style of top CTA |

---

### 4.6 Floating Chat Button (FAB)

| Property | Value |
|---|---|
| **Position** | Fixed, bottom-right corner of viewport |
| **Size** | 48px × 48px circle |
| **Background** | Dark green `--color-green-dark` |
| **Icon** | Chat bubble / message icon, white |
| **Shadow** | `--shadow-fab` |
| **Z-index** | Above all content |
| **Hover** | Scale 1.05, shadow deepens |

---

### 4.7 Next / Prev Navigation Arrow

| Property | Value |
|---|---|
| **Position** | Fixed, right edge of viewport, vertically centered |
| **Size** | 32px × 48px, semi-transparent white pill |
| **Icon** | `›` chevron, dark text |
| **Purpose** | Navigate to next product in category |

---

## 5. Key Interactive Behaviours

| Interaction | Trigger | Result |
|---|---|---|
| **Select size button** | Click Small / Medium / Large | (1) Active button turns dark green, (2) Price updates ($15 / $25 / $35), (3) Main product image swaps to size-appropriate photo |
| **Select pot card** | Click any pot card | Active card gets green border highlight; plant preview image updates to show plant in selected pot |
| **Thumbnail click** | Click thumbnail image | Main image swaps to that photo, thumbnail gets active border |
| **Zoom icon** | Click 🔍 bottom-right of main image | Opens lightbox/modal with zoomed-in full image |
| **Wishlist heart** | Click ♡ top-right of image | Toggles: empty ♡ → filled ❤️; saves to wishlist |
| **Quantity −/+** | Click minus/plus | Decrements / increments integer; min = 1 |
| **Add to Cart** | Click green CTA | Adds item (with selected size + pot) to cart; cart badge counter increments |
| **Pot carousel ‹/›** | Click arrow buttons | Scrolls pot card row left/right; smooth scroll |
| **Bottom image carousel** | Click dots / swipe | Cycles between 5 product images |
| **"Learn more" link** | Click | Expands description or navigates to care guide |
| **Chat FAB** | Click | Opens chat overlay / support widget |

---

## 6. Interaction & Animation

| Element | State / Trigger | Animation |
|---|---|---|
| **Size buttons** | Click | Background fills dark green (150ms ease), text flips to white |
| **Price** | Size change | Number counts up/down (200ms) or crossfade |
| **Main image** | Size/thumbnail change | Crossfade 250ms ease-in-out |
| **Pot cards** | Click | Green border appears (120ms), slight scale-up (1.02) |
| **Add to Cart** | Hover | Scale 1.02, shadow deepens (150ms) |
| **Add to Cart** | Click | Brief pulse animation, then cart icon badge increments |
| **Wishlist heart** | Click | Heart fill animation (scale 1.3 → 1.0, red fill) |
| **Thumbnail** | Click | Active border slides to selected thumb |
| **Pot row arrows** | Click | Row scrolls smoothly 1 card width (300ms) |
| **Chat FAB** | Hover | Scale 1.05 |
| **Page load** | — | Left image fades + slides in from left (0.5s); right panel fades up (0.6s, 100ms delay) |

---

## 7. Responsive Behaviour

### Mobile (`< 768px`)
- Single column layout: image stack on top, info panel below
- Thumbnail strip: horizontal scroll, snap
- Size buttons: remain 3-across or wrap to 2-across
- Quantity + Add to Cart: stacked or full-width
- Pot selector: full-width horizontal scroll, no arrows (swipe)
- FAB: remains fixed bottom-right
- Nav: hamburger → slide-in drawer

### Tablet (`768–1024px`)
- Two-column layout maintained but narrower
- Image panel: ~45% width
- Info panel: ~55% width
- Pot cards: 4 visible at once

### Desktop (`> 1024px`)
- Two-column split as designed
- Pot cards: 6–7 visible at once with nav arrows

---

## 8. Assets Required

| Asset | Format | Notes |
|---|---|---|
| Fern "Green Lady" — Small | PNG (transparent bg) or JPG | Plant in terracotta pot, medium shot |
| Fern "Green Lady" — Medium | PNG | Plant in white pot, medium shot |
| Fern "Green Lady" — Large | PNG | Plant in full room context, large shot |
| Thumbnail 1 | JPG ~180×160px | Small potted fern, warm bg |
| Thumbnail 2 | JPG ~180×160px | Fern in white modern pot |
| Thumbnail 3 | JPG ~180×160px | Alternate angle potted fern |
| Pot: Normal | PNG (transparent) | Classic terracotta |
| Pot: White Minimalist | PNG (transparent) | Clean white cylinder |
| Pot: Vorite Door (white) | PNG (transparent) | Small white rounded |
| Pot: Vorite Door (black) | PNG (transparent) | Faceted dark geometric |
| Pot: Dutfcier lies | PNG (transparent) | Woven/rattan basket |
| Pot: Phnte Sear | PNG (transparent) | White ceramic with plant |
| Heart icon | SVG | Outline + filled states |
| Zoom icon | SVG | Magnifying glass |
| Chat bubble icon | SVG | White on dark green |
| Star icon | SVG | Filled (amber) + empty |
| Truck icon | SVG | For delivery note |

---

## 9. Page Sections — Full Scroll Order

```
┌──────────────────────────────────────────────┐
│  NAVIGATION BAR (sticky)                     │
│  [plant byst logo]  [nav links]  [icons]     │
├──────────────────────────────────────────────┤
│  BREADCRUMB                                  │
│  Home / Fern "Green Lady"                    │
├──────────────────────────────────────────────┤
│  PRODUCT HERO  (2-column)                    │
│  ┌─────────────────┐  ┌───────────────────┐  │
│  │  Main Image     │  │  Eyebrow label    │  │
│  │  (plant photo)  │  │  Product Name     │  │
│  │  [zoom] [♡]     │  │  Description      │  │
│  │                 │  │  Price + Stars    │  │
│  │  [thumb][thumb] │  │  Select Size      │  │
│  │  [thumb]        │  │  Qty + Add to Cart│  │
│  │  ● ● ○ ○ ○      │  │  🚚 delivery link │  │
│  └─────────────────┘  └───────────────────┘  │
├──────────────────────────────────────────────┤
│  SELECT YOUR POT                             │
│  [Normal] [Normies] [Varieties]  tabs        │
│  ‹ [pot][pot][pot][pot][pot][pot][pot] ›     │
├──────────────────────────────────────────────┤
│  SIZE COMPARISON / RELATED PRODUCTS          │
│  [card image] [card image] [card image →]    │
│  ● ● ○ ○ ○      $45.00   [ Add to Cart ]    │
└──────────────────────────────────────────────┘
                              [💬 chat FAB]
                                        [›]
```

---

## 10. Technical Stack (Recommended)

| Layer | Recommendation |
|---|---|
| **Framework** | React + Tailwind CSS |
| **State** | `useState` for selected size, pot, quantity, wishlist |
| **Animations** | Framer Motion — image crossfade, button transitions |
| **Carousel** | Swiper.js (pot row + bottom image row) |
| **Lightbox** | yet-another-react-lightbox or similar |
| **Icons** | Custom SVGs + Lucide React |
| **Fonts** | Google Fonts: Playfair Display + Poppins + DM Sans |
| **URL** | Dynamic route: `/plants/[slug]` |

---

*Document version: 1.0 — Generated from plant details page design video analysis*
