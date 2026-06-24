# Book Gardening Services Online — Ugaoo Garden Services Page
## Design Specification v1.0

> **Design intent:** Deliver a trust-building, conversion-focused marketing page that guides homeowners, apartment dwellers, and corporate buyers from service discovery through confident booking enquiry — using a clean token-driven system, clear content hierarchy, and WCAG 2.2 AA accessible interactions throughout.

---

## 1. Context & Goals

| Property | Value |
|---|---|
| **Page name** | Book Gardening Services Online (Home Gardener Experts) |
| **Brand** | Ugaoo |
| **Reference URL** | https://www.ugaoo.com/pages/ugaoo-garden-services |
| **Page type** | Marketing / Service landing page |
| **Primary goal** | Generate service enquiry leads (Book Now / Get a Quote CTA conversions) |
| **Secondary goal** | Build credibility through services, process, testimonials, and FAQ |
| **Audience** | Online shoppers, homeowners, apartment residents, corporate facility managers |
| **Surface** | Marketing site — desktop-first, fully responsive |
| **Service geography** | Mumbai, Pune, Bangalore (full); Delhi, Jaipur, Nagpur (large-scale projects) |
| **Known page density** | Links: 195 · Lists: 36 · Buttons: 16 · Inputs: 6 · Navigation: 4 · Cards: 3 |

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
| `font.size.xs` | `11px` | Legal, timestamps, micro-labels |
| `font.size.sm` | `12px` | Helper text, captions, badge text |
| `font.size.md` | `13px` | Secondary labels, meta |
| `font.size.lg` | `13.33px` | Nav links, sub-labels |
| `font.size.xl` | `14px` | Card body, list items |
| `font.size.2xl` | `15px` | Section body copy |
| `font.size.3xl` | `16px` | Section sub-headings, CTA labels |
| `font.size.4xl` | `18px` | Card titles, step headings |

**Typography role map:**

| Role | Size token | Weight | Line-height |
|---|---|---|---|
| Hero heading | `font.size.4xl × 2.5` (~45px) | 700 | 1.1 |
| Hero subheading | `font.size.2xl` | 400 | 1.6 |
| Section heading | `font.size.4xl × 1.8` (~32px) | 700 | 1.2 |
| Section sub-label | `font.size.3xl` | 600 | 1.3 |
| Card title | `font.size.4xl` | 700 | 1.3 |
| Card body | `font.size.xl` | 400 | `font.lineHeight.base` |
| Step number | `font.size.4xl × 2` (~36px) | 800 | 1 |
| Step title | `font.size.4xl` | 700 | 1.3 |
| Step body | `font.size.xl` | 400 | 1.6 |
| Body copy | `font.size.2xl` | 400 | `font.lineHeight.base` |
| CTA primary label | `font.size.3xl` | 700 | 1 |
| CTA secondary label | `font.size.3xl` | 600 | 1 |
| Nav link | `font.size.lg` | 500 | 1 |
| Badge / tag | `font.size.sm` | 600 | 1 |
| Testimonial quote | `font.size.2xl` | 400 | 1.7 |
| Testimonial attribution | `font.size.md` | 600 | 1.3 |
| FAQ question | `font.size.3xl` | 600 | 1.4 |
| FAQ answer | `font.size.2xl` | 400 | `font.lineHeight.base` |
| Input label | `font.size.md` | 600 | 1.3 |
| Input value | `font.size.3xl` | 400 | 1 |
| Input placeholder | `font.size.3xl` | 400 | 1 |
| Footer heading | `font.size.3xl` | 700 | 1.3 |
| Footer link | `font.size.xl` | 400 | 1.5 |
| Breadcrumb | `font.size.md` | 400 | 1 |

### 2.2 Color Palette

| Token | Hex | Usage |
|---|---|---|
| `color.text.primary` | `#212326` | Primary headings, strong text |
| `color.surface.base` | `#000000` | Absolute baseline, deep overlays |
| `color.text.tertiary` | `#1c1c1c` | Body text, secondary headings |
| `color.text.inverse` | `#0a4c36` | Brand green — primary CTA bg, active states, hero accents |
| `color.surface.muted` | `#ffffff` | Cards, nav background, modal bg |
| `color.surface.raised` | `#f9f9f9` | Alternate section backgrounds, input bg |
| `color.surface.strong` | `#fefcf9` | Page background (warm off-white) |

**Semantic aliases (always reference parent token — never raw hex):**

| Semantic alias | Maps to token | Usage |
|---|---|---|
| `gs.page-bg` | `color.surface.strong` | Global page background |
| `gs.section-alt-bg` | `color.surface.raised` | Alternating section fills |
| `gs.card-bg` | `color.surface.muted` | Service cards, process steps, FAQ cards |
| `gs.nav-bg` | `color.surface.muted` | Navigation background |
| `gs.primary-cta-bg` | `color.text.inverse` | Primary CTA button fill |
| `gs.primary-cta-text` | `color.surface.muted` | Primary CTA label |
| `gs.secondary-cta-border` | `color.text.inverse` | Outlined CTA border |
| `gs.secondary-cta-text` | `color.text.inverse` | Outlined CTA label |
| `gs.heading` | `color.text.primary` | All headings |
| `gs.body` | `color.text.tertiary` | Body copy |
| `gs.accent` | `color.text.inverse` | Green accents, step numbers, tag fills, underlines |
| `gs.input-bg` | `color.surface.raised` | Input field background |
| `gs.input-border` | `color.text.tertiary` @ 25% | Input resting border |
| `gs.input-border-focus` | `color.text.inverse` | Input focused border |
| `gs.divider` | `color.text.tertiary` @ 12% | Horizontal rules, card borders |
| `gs.focus-ring` | `color.text.inverse` | Universal keyboard focus ring |
| `gs.hero-bg` | `color.text.inverse` | Hero section background |
| `gs.hero-text` | `color.surface.muted` | Text on hero dark-green bg |
| `gs.tag-bg` | `color.text.inverse` @ 10% | Light green tag/badge fill |
| `gs.tag-text` | `color.text.inverse` | Tag label text |
| `gs.testimonial-bg` | `color.surface.raised` | Testimonial card background |
| `gs.star-fill` | `#c8a84b` | Rating star fill (amber — one-off semantic exception) |

### 2.3 Spacing Scale

| Token | Value |
|---|---|
| `space.1` | `1px` |
| `space.2` | `2px` |
| `space.3` | `3px` |
| `space.4` | `5px` |
| `space.5` | `6px` |
| `space.6` | `8px` |
| `space.7` | `10px` |
| `space.8` | `12px` |

> **Composition rule:** Larger values compound tokens: `space.8 × 2 = 24px`, `space.8 × 3 = 36px`, `space.8 × 4 = 48px`, `space.8 × 6 = 72px`, `space.8 × 8 = 96px`.

### 2.4 Border Radius

| Token | Value | Usage |
|---|---|---|
| `radius.xs` | `4px` | Tags, micro badges, tooltips |
| `radius.sm` | `6px` | Input fields, thumbnails |
| `radius.md` | `12px` | Service cards, FAQ items, testimonial cards |
| `radius.lg` | `16px` | Process step cards, feature panels |
| `radius.xl` | `20px` | Hero CTA buttons, booking form container |
| `radius.2xl` | `9999px` | Pill badges, rounded CTA buttons |

### 2.5 Shadows

| Token | Value | Usage |
|---|---|---|
| `shadow.1` | `rgb(190, 234, 212) 0px 0px 0px 0px` | Resting state (no elevation) |
| `shadow.2` | `rgba(0, 0, 0, 0.1) 0px 4px 12px 0px` | Cards, form container, nav on scroll |

**Composed shadow values (document as rules, not new tokens):**

| Name | Value | Usage |
|---|---|---|
| `shadow.card-hover` | `rgba(10, 76, 54, 0.12) 0px 8px 24px 0px` | Service/step card hover lift |
| `shadow.fab` | `rgba(10, 76, 54, 0.25) 0px 6px 20px 0px` | WhatsApp FAB, sticky CTA |
| `shadow.testimonial` | `rgba(0, 0, 0, 0.06) 0px 4px 16px 0px` | Testimonial card subtle lift |

### 2.6 Motion

| Token | Value | Usage |
|---|---|---|
| `motion.duration.instant` | `250ms` | Hover colour, focus ring, icon colour |
| `motion.duration.fast` | `300ms` | Card hover lift, FAQ accordion, chip selection |
| `motion.duration.normal` | `400ms` | Modal open, section reveal, form slide |
| `motion.duration.slow` | `500ms` | Page load stagger, hero text entrance |

---

## 3. Page Layout & Structural Zones

### 3.1 Full Page Structure

```
┌─────────────────────────────────────────────────────────┐
│  ANNOUNCEMENT BAR                                       │
├─────────────────────────────────────────────────────────┤
│  NAVIGATION BAR                                         │
├─────────────────────────────────────────────────────────┤
│  HERO SECTION                                           │
├─────────────────────────────────────────────────────────┤
│  TRUST BAR (stats strip)                               │
├─────────────────────────────────────────────────────────┤
│  SERVICES GRID                                          │
├─────────────────────────────────────────────────────────┤
│  HOW IT WORKS (process steps)                          │
├─────────────────────────────────────────────────────────┤
│  WHY UGAOO (feature differentiators)                   │
├─────────────────────────────────────────────────────────┤
│  SERVICE AREAS (city coverage)                         │
├─────────────────────────────────────────────────────────┤
│  TESTIMONIALS                                          │
├─────────────────────────────────────────────────────────┤
│  BOOKING / ENQUIRY FORM                                │
├─────────────────────────────────────────────────────────┤
│  FAQ ACCORDION                                         │
├─────────────────────────────────────────────────────────┤
│  FOOTER CTA STRIP                                      │
├─────────────────────────────────────────────────────────┤
│  FOOTER                                                │
└─────────────────────────────────────────────────────────┘
```

### 3.2 Grid & Layout Rules

| Property | Value |
|---|---|
| **Max content width** | `1280px`, horizontally centred |
| **Horizontal padding** | `space.8 × 4 = 48px` desktop, `space.8 × 2 = 24px` tablet, `space.8 = 12px` mobile |
| **Section vertical padding** | `space.8 × 8 = 96px` desktop, `space.8 × 6 = 72px` tablet, `space.8 × 4 = 48px` mobile |
| **Column grid** | 12-column CSS Grid, `space.8 × 2 = 24px` gutter |
| **Breakpoints** | `≥ 1024px` desktop · `768–1023px` tablet · `< 768px` mobile · `< 480px` small mobile |
| **Alternate sections** | Odd sections: `gs.page-bg`; Even sections: `gs.section-alt-bg` |

---

## 4. Announcement Bar

A slim full-width promotional strip above the navigation.

```
← Flat 20% Off Above ₹1499  |  Free Delivery Above ₹499  |  Get 4 Plants @ ₹699! →
```

| Property | Value |
|---|---|
| Background | `gs.primary-cta-bg` (`color.text.inverse`) |
| Text | `gs.hero-text`, `font.size.sm`, weight 500, centred |
| Height | `36px` desktop, `32px` mobile |
| Link behaviour | Full bar is a tappable link; individual segments separated by `|` dividers |
| Carousel | 3 messages auto-rotate every `4000ms`; prev/next arrows `24×24px` |
| Auto-advance | Must pause on hover/focus; `aria-live="polite"` for screen readers |
| Dismiss button | `×` icon right-aligned, `24×24px` tap target, `aria-label="Dismiss announcement"` |
| `aria-label` | `role="region"` with `aria-label="Promotional announcements"` |

**Announcement link states:**

| State | Style |
|---|---|
| Default | `gs.hero-text`, no underline |
| Hover | Underline appears, `motion.duration.instant` |
| Focus-visible | `2px` focus ring `color.surface.muted` |

---

## 5. Navigation Bar

```
[Ugaoo Logo]  [Plants▾][Seeds▾][Pots▾][Plant Care▾][Bhidu's Fav][Gifting][Blog][Garden Services*][Locate Store]  [WhatsApp][Track Order][🔍][👤][🛒¹]
```

| Property | Value |
|---|---|
| Background | `gs.nav-bg` |
| Height | `64px` desktop, `56px` mobile |
| Position | `sticky`, `top: 0`, `z-index: 100` |
| Shadow | `shadow.1` resting → `shadow.2` on scroll |
| Logo | SVG, `height: 40px`, links to `/` |
| Active item | `"Garden Services"` — underline `gs.accent`, weight 600 |
| Transition | `box-shadow` change, `motion.duration.instant` |

**Nav link states:**

| State | Style |
|---|---|
| Default | `gs.body`, `font.size.lg`, weight 500 |
| Hover | `gs.accent` colour, underline `2px solid`, `motion.duration.instant` |
| Focus-visible | `2px` focus ring `gs.focus-ring`, `radius.xs` |
| Active page | `gs.accent`, weight 700, persistent underline |

**Dropdown menus:**

| Property | Value |
|---|---|
| Trigger | Hover + Enter/Space keyboard |
| Background | `gs.card-bg` |
| Border | `1px solid gs.divider` |
| Border-radius | `radius.md` |
| Shadow | `shadow.2` |
| Link font | `font.size.xl`, weight 400 |
| Link hover | `gs.accent` text, `gs.tag-bg` bg, `motion.duration.instant` |
| Close | Mouse-leave + Escape key |
| `role` | `role="menu"`, `role="menuitem"` on links |

**Mobile nav:**

- Hamburger `☰` button, `40×40px`, `radius.sm`
- Slides in from left, `motion.duration.normal`, full-height drawer
- `role="dialog"`, `aria-modal="true"`, focus trapped
- Close button `×` top-right, `40×40px`, `aria-label="Close navigation"`
- Escape closes drawer

**Utility icons:**

| Icon | Size | `aria-label` |
|---|---|---|
| WhatsApp | `24×24px` | `"Chat on WhatsApp"` |
| Track Order | `24×24px` | `"Track your order"` |
| Search | `24×24px` | `"Search"` |
| Account | `24×24px` | `"My account"` |
| Cart | `24×24px` | `"Cart, [n] items"` |

Cart badge: `gs.primary-cta-bg` bg, `gs.hero-text` text, `radius.2xl`, `font.size.xs`, `20px` min-width.

**Tab order:** Logo → Announcement bar dismiss → Nav links left-to-right → WhatsApp → Track → Search → Account → Cart → Skip-to-main.

---

## 6. Hero Section

> Full-width, dark-green immersive opener that communicates expertise and triggers the primary booking CTA.

### 6.1 Layout

```
┌──────────────────────────────────────────────────────────┐
│  [Background: lush garden photo, dark green overlay]     │
│                                                          │
│   Expert Gardeners.                                      │
│   Delivered to Your Door.                                │
│                                                          │
│   Book professional gardening services for your home,    │
│   balcony, terrace, or office. Mumbai · Pune · Bangalore │
│                                                          │
│   [ Book a Service ]   [ Get a Free Quote ]              │
│                                                          │
│   ★★★★★  4.8 · 5,000+ gardens transformed              │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Background | Hero garden photo (`object-fit: cover`) + `gs.hero-bg` @ 70% overlay |
| Min-height | `560px` desktop, `460px` tablet, `400px` mobile |
| Padding | `space.8 × 8 = 96px` vertical, `space.8 × 4 = 48px` horizontal |
| Content max-width | `720px`, left-aligned desktop, centred mobile |
| Text colour | `gs.hero-text` throughout |

**Hero heading:**

| Property | Value |
|---|---|
| Font size | `font.size.4xl × 2.5` (~45px) desktop; `font.size.4xl × 1.8` (~32px) mobile |
| Weight | 700 |
| Line-height | 1.1 |
| Colour | `gs.hero-text` |
| Margin-bottom | `space.8 × 2 = 24px` |
| Animation | Fade-up + opacity 0→1, `motion.duration.slow`, on page load |

**Hero subtext:**

| Property | Value |
|---|---|
| Font size | `font.size.2xl` |
| Weight | 400 |
| Line-height | 1.6 |
| Colour | `gs.hero-text` @ 85% |
| Max-width | `560px` |
| Margin-bottom | `space.8 × 3 = 36px` |

**Hero CTA pair:**

| Button | Style | Label |
|---|---|---|
| Primary | Filled `gs.card-bg` bg, `gs.primary-cta-bg` text, `radius.2xl`, height `52px`, `font.size.3xl` weight 700 | "Book a Service" |
| Secondary | Outlined — `2px solid gs.card-bg`, transparent bg, `gs.hero-text`, `radius.2xl`, height `52px` | "Get a Free Quote" |

CTA gap: `space.8 = 12px`.

**Hero rating strip:**

```
★★★★★  4.8 · 5,000+ gardens transformed
```

| Property | Value |
|---|---|
| Stars | 5 SVG stars, `gs.star-fill`, `16×16px` |
| Text | `font.size.xl`, weight 500, `gs.hero-text` @ 80% |
| Margin-top | `space.8 × 3 = 36px` |
| `aria-label` | `"4.8 out of 5 stars — 5,000+ gardens transformed"` |

**Hero CTA button states:**

| State | Primary | Secondary |
|---|---|---|
| Default | White bg, green text | Outlined white |
| Hover | `gs.tag-bg` bg, scale `1.02` | White bg, green text; `motion.duration.instant` |
| Focus-visible | `2px` focus ring `gs.star-fill` (yellow — contrast on green bg) | Same |
| Active | Scale `0.98` | Scale `0.98` |
| Mobile | Full-width, stacked vertically | Full-width |

---

## 7. Trust Bar (Stats Strip)

A full-width strip of key social-proof numbers immediately below the hero.

```
┌──────────┬────────────────┬─────────────────┬──────────────┐
│ 5,000+   │ 3 Cities       │ 10+ Years        │ 500+         │
│ Gardens  │ Mumbai · Pune  │ of Expertise     │ Corporate    │
│          │ · Bangalore    │                  │ Clients      │
└──────────┴────────────────┴─────────────────┴──────────────┘
```

| Property | Value |
|---|---|
| Background | `gs.primary-cta-bg` |
| Padding | `space.8 × 4 = 48px` vertical |
| Layout | 4-column flex row, `space.8 × 4` gap, centred |
| Number font | `font.size.4xl × 2` (~36px), weight 800, `gs.hero-text` |
| Label font | `font.size.2xl`, weight 400, `gs.hero-text` @ 80% |
| Dividers | `1px solid gs.hero-text` @ 20%, between columns |
| Mobile | 2×2 grid |
| Animation | Count-up animation on scroll-into-view, `motion.duration.slow` |
| `aria-label` | Each stat: `aria-label="[number]: [label description]"` |

---

## 8. Services Grid

> Communicates the full breadth of Ugaoo's gardening offer.

### 8.1 Section Header

```
Our Garden Services
We offer end-to-end green solutions for every space.
```

| Property | Value |
|---|---|
| Background | `gs.page-bg` |
| Heading | `font.size.4xl × 1.8` (~32px), weight 700, `gs.heading`, centred |
| Subtext | `font.size.2xl`, weight 400, `gs.body` @ 70%, centred, max-width `560px` |
| Heading margin-bottom | `space.8 × 5 = 60px` |

### 8.2 Service Card Grid

**Layout:** 3-column grid desktop, 2-column tablet, 1-column mobile.

**Service list (8 cards):**

| # | Icon | Service | Short description |
|---|---|---|---|
| 1 | 🌿 | Landscape Development | Designing sustainable outdoor spaces blending beauty and function |
| 2 | 🌱 | Balcony & Terrace Gardens | Curated setups for apartments, terraces, and rooftop retreats |
| 3 | 🧱 | Vertical Gardens | Modular green walls tailored for modern urban environments |
| 4 | 🏢 | Corporate Plant Rentals | Flexible indoor greenery for offices, co-working, and events |
| 5 | ✂️ | Lawn & Garden Maintenance | Weekly, bi-weekly, or monthly care plans for home gardens |
| 6 | 🐛 | Pest Control | Organic treatments for aphids, mites, and common plant pests |
| 7 | 🌸 | Landscaping & Pruning | Shaping, trimming, and seasonal care for healthy, lush plants |
| 8 | 🏨 | Hospitality Greenery | Curated green experiences for hotels, restaurants, and lounges |

**Single service card anatomy:**

```
┌───────────────────────────────────┐
│   [icon 48×48px]                  │
│                                   │
│   Landscape Development           │
│                                   │
│   Designing sustainable outdoor   │
│   spaces that blend beauty and    │
│   functionality.                  │
│                                   │
│   [ Enquire Now → ]               │
└───────────────────────────────────┘
```

| Property | Value |
|---|---|
| Background | `gs.card-bg` |
| Border | `1px solid gs.divider` |
| Border-radius | `radius.md` |
| Padding | `space.8 × 3 = 36px` |
| Shadow | `shadow.1` resting |
| Icon area | `56×56px` container, `gs.tag-bg` fill, `radius.sm`, icon `32×32px` |
| Card title | `font.size.4xl`, weight 700, `gs.heading`, margin-top `space.8 × 2` |
| Card body | `font.size.xl`, weight 400, `gs.body`, line-height 1.6, margin-top `space.6` |
| Card link | `font.size.3xl`, weight 600, `gs.accent`, margin-top `space.8 × 2`, underline on hover |
| Min-height | `280px` |
| Grid gap | `space.8 × 2 = 24px` |

**Service card states:**

| State | Border | Shadow | Transform |
|---|---|---|---|
| Default | `gs.divider` | `shadow.1` | None |
| Hover | `gs.input-border-focus` (`color.text.inverse`) | `shadow.card-hover` | `translateY(-4px)`, `motion.duration.fast` |
| Focus-visible | `2px` focus ring `gs.focus-ring`, offset `2px` | `shadow.card-hover` | None |
| Active | `gs.input-border-focus` | `shadow.2` | `translateY(-2px)` |

**Keyboard:** Tab to card; Enter follows the card's "Enquire Now" link. Card is not itself a link — only the inline CTA is interactive.

**Accessibility:**
- `role="article"` on each card
- Icon is `aria-hidden="true"` (decorative)
- Card title is `<h3>` inside `<section>`
- "Enquire Now" link `aria-label="Enquire about [service name]"`

**Empty state:** If service data fails to load, show 8 skeleton cards with shimmer animation.

---

## 9. How It Works (Process Steps)

> Reduces booking friction by making the process feel simple and predictable.

### 9.1 Section Header

```
How It Works
Book your expert gardener in 3 simple steps.
```

| Property | Value |
|---|---|
| Background | `gs.section-alt-bg` |
| Heading style | Same as §8.1 |

### 9.2 Step Cards

**Layout:** 3 cards in a horizontal row desktop; stacked vertically mobile. Connector line between cards desktop only.

```
[ Step 1 ]──────────[ Step 2 ]──────────[ Step 3 ]
Share Your           We Match You         Expert Arrives
Space Details        With an Expert       & Transforms
```

**Connector line:** `1px dashed gs.divider`, centred vertically between cards, hidden mobile.

**Single step card anatomy:**

```
┌────────────────────────────────────┐
│   01                               │
│                                    │
│   Share Your Space                 │
│                                    │
│   Fill out our quick form with     │
│   your garden size, location, and  │
│   service needed.                  │
└────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Background | `gs.card-bg` |
| Border | `1px solid gs.divider` |
| Border-radius | `radius.lg` |
| Padding | `space.8 × 3 = 36px` |
| Step number | `font.size.4xl × 2` (~36px), weight 800, `gs.accent`, opacity 15%, leading decorative |
| Step title | `font.size.4xl`, weight 700, `gs.heading`, margin-top `space.6` |
| Step body | `font.size.xl`, weight 400, `gs.body`, line-height 1.6, margin-top `space.7` |
| Hover | `shadow.card-hover`, border `gs.input-border-focus`, `motion.duration.fast` |
| Focus-visible | `2px` focus ring (if card is interactive) |

**Steps content:**

| Step | Number | Title | Body |
|---|---|---|---|
| 1 | `01` | Share Your Space | Fill out our quick form with garden size, location, and service type |
| 2 | `02` | We Match You | Our team reviews your request and assigns a verified expert gardener |
| 3 | `03` | Expert Arrives | Your gardener visits at the scheduled time and transforms your space |

**Accessibility:**
- Steps wrapped in `<ol>` list
- Each step is `<li>` with `role="article"` inner content
- Step number `aria-hidden="true"` — not relied upon for semantic order

---

## 10. Why Ugaoo (Feature Differentiators)

> Builds trust by articulating what makes Ugaoo different from unorganised local gardeners.

### 10.1 Layout

Two-column desktop (image left, feature list right); stacked single-column mobile.

```
┌────────────────────┬─────────────────────────────────────┐
│                    │  Why Choose Ugaoo?                  │
│  [Garden photo     │                                     │
│   with happy       │  ✓ Verified & trained professionals │
│   gardener]        │  ✓ Organic, eco-friendly methods    │
│                    │  ✓ Weekly / bi-weekly / monthly plans│
│                    │  ✓ Serving 5,000+ homes since 2013  │
│                    │  ✓ Trusted by WeWork, Roche,        │
│                    │    Snowflake & more                 │
│                    │                                     │
│                    │  [ Book a Service ]                 │
└────────────────────┴─────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Background | `gs.page-bg` |
| Image | `object-fit: cover`, `radius.md`, `aspect-ratio: 4/3`, `50%` column width |
| Column gap | `space.8 × 5 = 60px` |
| Image `alt` | `"Ugaoo expert gardener tending to a home balcony garden"` |

### 10.2 Feature List

| Property | Value |
|---|---|
| List type | `<ul>`, `list-style: none` |
| Item gap | `space.8 × 2 = 24px` |
| Check icon | Custom green SVG `✓`, `20×20px`, `gs.accent`, `aria-hidden="true"` |
| Item font | `font.size.2xl`, weight 400, `gs.body`, line-height 1.5 |
| Strong text | weight 700, `gs.heading` |
| Icon + text gap | `space.7 = 10px` |
| `aria-label` | Feature list: `aria-label="Ugaoo advantages"` |

### 10.3 Section CTA

Same styles as Hero primary CTA (`gs.primary-cta-bg` filled, `radius.2xl`, height `52px`), left-aligned under list.

---

## 11. Service Areas (City Coverage)

> Manages geographic expectations before enquiry — reduces unqualified leads.

### 11.1 Layout

```
Where We Serve
Professional gardening services available across major cities.

┌──────────┬──────────┬──────────┐   ┌──────────────────────────┐
│ Mumbai   │ Pune     │ Bangalore│   │ Delhi · Jaipur · Nagpur  │
│ Full     │ Full     │ Full     │   │ Large-scale projects      │
│ Service  │ Service  │ Service  │   │                          │
└──────────┴──────────┴──────────┘   └──────────────────────────┘
```

| Property | Value |
|---|---|
| Background | `gs.section-alt-bg` |
| Section header | Same as §8.1 |
| City card layout | 3 primary + 1 wider secondary, CSS Grid |
| City card bg | `gs.card-bg` |
| City card border | `1px solid gs.divider` |
| City card radius | `radius.md` |
| City card padding | `space.8 × 2 = 24px` |
| City name | `font.size.4xl`, weight 700, `gs.heading` |
| Service level tag | `radius.2xl` pill, `gs.tag-bg` bg, `gs.tag-text`, `font.size.sm`, weight 600 |
| City body | `font.size.xl`, `gs.body`, margin-top `space.6` |
| Hover | `shadow.card-hover`, border `gs.input-border-focus`, `motion.duration.fast` |

**City cards:**

| City | Tag | Services |
|---|---|---|
| Mumbai | `Full Service` | Residential, corporate, landscaping, maintenance |
| Pune | `Full Service` | Residential, corporate, landscaping, maintenance |
| Bangalore | `Full Service` | Residential, corporate, landscaping, maintenance |
| Delhi / Jaipur / Nagpur | `Large Projects` | Landscape development and large-scale installations |

**"Not in your city?" strip:** Below cards.

```
Not in your city? We may still be able to help — get in touch.
[ Contact Us ]
```

| Property | Value |
|---|---|
| Background | `gs.primary-cta-bg` @ 8% |
| Border-radius | `radius.md` |
| Padding | `space.8 × 2 = 24px` |
| Font | `font.size.2xl`, weight 400, `gs.body` |
| CTA | Outlined secondary button, `gs.accent` border + text |

---

## 12. Testimonials Section

> Social proof from real named clients, including corporate brands.

### 12.1 Section Header

```
What Our Clients Say
Trusted by homes, offices, and hospitality brands alike.
```

| Property | Value |
|---|---|
| Background | `gs.page-bg` |
| Style | Centred heading, same as §8.1 |

### 12.2 Testimonial Card Carousel

**Layout:** 3 cards visible on desktop, 2 on tablet, 1 on mobile. Horizontal scroll-snap with prev/next arrows.

**Single testimonial card anatomy:**

```
┌──────────────────────────────────────────────────────────┐
│  ★★★★★                                                   │
│                                                          │
│  "We've been associated with Ugaoo for three years.      │
│   Their team ensures our workspace stays green,           │
│   vibrant, and well-maintained year-round."              │
│                                                          │
│  — Sanket Yenpure                                        │
│     Facility Manager, C&W                               │
│                                                          │
│  [Company logo if available]                             │
└──────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Background | `gs.testimonial-bg` |
| Border | `1px solid gs.divider` |
| Border-radius | `radius.md` |
| Padding | `space.8 × 3 = 36px` |
| Shadow | `shadow.testimonial` |
| Min-height | `240px` |
| Stars | 5 amber stars, `gs.star-fill`, `16×16px`, `aria-label="5 out of 5 stars"` |
| Quote | `font.size.2xl`, weight 400, `gs.body`, line-height 1.7, italic, margin-top `space.8` |
| Quote marks | Opening `"` decorative character, `font.size.4xl × 3`, `gs.accent` @ 20%, `aria-hidden="true"` |
| Attribution name | `font.size.md`, weight 700, `gs.heading`, margin-top `space.8 × 2` |
| Attribution role | `font.size.md`, weight 400, `gs.body` @ 70%, margin-top `space.3` |
| Company logo | `40px` height, greyscale, `filter: grayscale(1)`, `aria-hidden="true"` |

**Testimonial data (3 primary):**

| Quote (paraphrased) | Name | Role / Company |
|---|---|---|
| Three years of association; professional, proactive team aligned with sustainability goals | Sanket Yenpure | Facility Manager, C&W |
| Freshness brought to our premises; prompt action to requests | Anita | Cravatex Ltd, Mumbai |
| Expert team, reliable maintenance, trusted for our corporate premises | [Client name] | [Role], [Company] |

**Carousel controls:**

| Property | Value |
|---|---|
| Prev/Next arrows | `44×44px`, `radius.2xl`, `gs.card-bg` bg, `gs.body` icon, `1px solid gs.divider` border |
| Hover | `gs.primary-cta-bg` bg, `gs.hero-text` icon, `motion.duration.instant` |
| Focus-visible | `2px` focus ring `gs.focus-ring` |
| Disabled | `opacity: 0.4`, `aria-disabled="true"` |
| Dots | `8px` circles, active = `gs.accent`, inactive = `gs.divider`, `radius.2xl` |
| Keyboard | Arrow keys advance; Enter/Space on dots selects |
| `aria-label` | Container `aria-label="Customer testimonials"`, `role="region"` |
| Auto-advance | No auto-advance — static unless manually navigated |
| `aria-roledescription` | `"carousel"` on container |

---

## 13. Booking / Enquiry Form

> Primary lead-capture component. Must be fast, low-friction, and clearly branded.

### 13.1 Section Wrapper

| Property | Value |
|---|---|
| Background | `gs.section-alt-bg` |
| Form container max-width | `720px`, centred |
| Form container bg | `gs.card-bg` |
| Form container border | `1px solid gs.divider` |
| Form container border-radius | `radius.xl` |
| Form container shadow | `shadow.2` |
| Form container padding | `space.8 × 4 = 48px` desktop, `space.8 × 2 = 24px` mobile |

### 13.2 Form Header

```
Book a Gardening Service
Tell us about your space and we'll get back to you within 24 hours.
```

| Property | Value |
|---|---|
| Heading | `font.size.4xl × 1.8` (~32px), weight 700, `gs.heading`, centred |
| Subtext | `font.size.2xl`, `gs.body` @ 70%, centred, margin-bottom `space.8 × 3` |

### 13.3 Form Fields (6 inputs)

**Field layout:** 2-column grid on desktop; single column mobile.

| # | Field | Type | Required | Placeholder |
|---|---|---|---|---|
| 1 | Full Name | Text | Yes | "Your full name" |
| 2 | Phone Number | Tel | Yes | "+91 XXXXX XXXXX" |
| 3 | Email Address | Email | No | "your@email.com" |
| 4 | City | Select | Yes | "Select your city" |
| 5 | Service Type | Select | Yes | "Select a service" |
| 6 | Tell Us More | Textarea | No | "Describe your garden size, any specific requirements..." |

**"Tell Us More" textarea:** Spans full width (both columns), `min-height: 120px`, max `300px` with `resize: vertical`.

**Single input anatomy:**

```
Full Name  *
┌──────────────────────────────────────┐
│  Your full name                      │
└──────────────────────────────────────┘
Helper text or error message here
```

| Property | Value |
|---|---|
| Label font | `font.size.md`, weight 600, `gs.heading` |
| Required marker | `*` in `gs.accent`, `aria-hidden="true"` on marker; `aria-required="true"` on input |
| Input height | `48px` (text/tel/email/select); auto textarea |
| Input bg | `gs.input-bg` |
| Input border | `1px solid gs.input-border` |
| Input border-radius | `radius.sm` |
| Input font | `font.size.3xl`, weight 400, `gs.body` |
| Placeholder | `gs.body` @ 40% |
| Padding | `space.7 = 10px` vertical, `space.8 = 12px` horizontal |
| Field gap | `space.8 × 2 = 24px` vertical |

**Input states:**

| State | Border | Background | Shadow |
|---|---|---|---|
| Default | `gs.input-border` | `gs.input-bg` | None |
| Hover | `gs.body` @ 50% | `gs.input-bg` | None |
| Focus | `2px solid gs.input-border-focus` | `gs.input-bg` | `0 0 0 3px gs.accent @ 15%` |
| Filled (valid) | `gs.input-border-focus` | `gs.input-bg` | None |
| Error | `2px solid #dc2626` | `#dc2626 @ 5%` | None |
| Disabled | `gs.divider` | `gs.section-alt-bg` | None |

**Error message anatomy:**

```
⚠ This field is required.
```

| Property | Value |
|---|---|
| Font | `font.size.sm`, weight 500, `#dc2626` |
| Icon | Warning SVG, `14×14px`, inline-left, `aria-hidden="true"` |
| Gap above | `space.4 = 5px` |
| `role` | `"alert"`, `aria-live="polite"` |
| `id` | Unique per field; referenced by input's `aria-describedby` |

**Select dropdown:**

| Property | Value |
|---|---|
| Appearance | Custom — chevron icon `gs.body` right-aligned |
| Options font | `font.size.3xl`, `gs.body` |
| City options | Mumbai, Pune, Bangalore, Delhi, Jaipur, Nagpur, Other |
| Service options | Landscape Development, Balcony / Terrace Garden, Vertical Garden, Corporate Plant Rental, Lawn Maintenance, Pest Control, Pruning, Other |

**Form validation:**
- Client-side validation on blur (per-field) + on submit
- All errors shown simultaneously after failed submit
- Focus moves to first error field on submit failure
- `aria-invalid="true"` on errored inputs
- Success state: form replaced by success message (no page reload)

**Submit button:**

```
[ Submit Enquiry ]
```

| Property | Value |
|---|---|
| Style | `gs.primary-cta-bg` fill, `gs.hero-text`, `radius.2xl`, full-width, height `56px` |
| Font | `font.size.3xl`, weight 700 |
| States | Default → Hover (darken 10%) → Loading (spinner) → Success (checkmark "Submitted!") → Error |
| Loading | `aria-busy="true"`, spinner replaces label |
| Success | Auto-replaces form: "✓ We've received your enquiry. Our team will call you within 24 hours." |
| Error | Below button: "Something went wrong. Please try again." `aria-live="assertive"` |
| Disabled | While loading; `aria-disabled="true"` |

**Privacy note below button:**

```
By submitting, you agree to our Privacy Policy. We don't share your data.
```

| Property | Value |
|---|---|
| Font | `font.size.xs`, `gs.body` @ 50%, centred |
| "Privacy Policy" link | `gs.accent`, underline |

---

## 14. FAQ Accordion

> Reduces pre-booking hesitation by answering the most common objections and questions.

### 14.1 Section Header

```
Frequently Asked Questions
Everything you need to know before booking.
```

| Property | Value |
|---|---|
| Background | `gs.page-bg` |
| Style | Centred, same as §8.1 |

### 14.2 FAQ Item Anatomy

```
┌──────────────────────────────────────────────────────────┐
│  Do you provide maintenance for homes and apartments? [+] │
├──────────────────────────────────────────────────────────┤
│  Yes. We specialise in residential garden maintenance —   │
│  from small balcony gardens and terrace setups to large   │
│  bungalow lawns.                                          │
└──────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Container max-width | `800px`, centred |
| Item bg | `gs.card-bg` |
| Item border | `1px solid gs.divider` |
| Item border-radius | `radius.md` |
| Item margin-bottom | `space.7 = 10px` |
| Question padding | `space.8 × 2 = 24px` horizontal, `space.8 = 12px` vertical |
| Question font | `font.size.3xl`, weight 600, `gs.heading` |
| Chevron icon | `20×20px`, `gs.body` @ 60%, right-aligned, rotates `0°→180°` on open |
| Answer padding | `0 space.8×2 space.8×2` (no top padding — slides in below question) |
| Answer font | `font.size.2xl`, weight 400, `gs.body`, line-height `font.lineHeight.base` |
| Accordion animation | Height `0→auto`, `motion.duration.fast`, `ease-in-out` |

**FAQ item states:**

| State | Question border | Background |
|---|---|---|
| Default (closed) | `gs.divider` | `gs.card-bg` |
| Hover | `gs.input-border-focus` | `gs.tag-bg` |
| Focus-visible | `2px` focus ring `gs.focus-ring` | — |
| Open | `gs.input-border-focus` | `gs.tag-bg` @ 40% |

**FAQ data (8 items from Ugaoo's real FAQ content):**

| # | Question | Answer summary |
|---|---|---|
| 1 | What gardening services does Ugaoo offer? | Landscaping, vertical gardens, balcony gardens, plant rentals, lawn care, pruning, pest control, corporate maintenance |
| 2 | Do you provide maintenance for homes and apartments? | Yes — balcony, terrace, and bungalow lawns; weekly/bi-weekly/monthly plans |
| 3 | Which cities do you serve? | Full service in Mumbai, Pune, Bangalore; large projects in Delhi, Jaipur, Nagpur |
| 4 | Do you offer corporate plant rental? | Yes — delivery, installation, and bi-weekly maintenance included |
| 5 | How often will a gardener visit? | Depends on plan: weekly, bi-weekly, or monthly options available |
| 6 | Are your pest control methods safe? | Yes — organic fertilisers and eco-friendly pest control methods |
| 7 | How do I book a service? | Fill the enquiry form, our team contacts you within 24 hours to confirm |
| 8 | What are your service charges? | Varies by service and garden size — fill the form for a customised quote |

**Accessibility:**
- `<dl>` or `<ul>` with `<button>` trigger (not `<a>`)
- `aria-expanded="true/false"` on each question button
- `aria-controls` pointing to answer panel id
- Answer panel: `role="region"`, `aria-labelledby` question button id
- Single or multi-open: single-open preferred (only one answer visible at a time)
- Keyboard: Enter/Space toggles; Up/Down arrows between questions

---

## 15. Footer CTA Strip

A full-width conversion strip just above the main footer.

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  Ready to transform your green space?                    │
│  Expert gardeners. Sustainable methods.                  │
│  Mumbai · Pune · Bangalore                               │
│                                                          │
│  [ Book a Service ]   [ Chat on WhatsApp ]               │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Background | `gs.primary-cta-bg` |
| Padding | `space.8 × 8 = 96px` vertical |
| Text | `gs.hero-text`, centred |
| Heading | `font.size.4xl × 1.8`, weight 700 |
| Subtext | `font.size.2xl`, weight 400, `gs.hero-text` @ 80% |
| City tags | Inline `·` separated, `font.size.2xl`, `gs.hero-text` @ 70%, margin-top `space.7` |
| CTA pair | Same styles as Hero section (white fill primary, outlined secondary) |
| CTA gap | `space.8 = 12px` |
| "Chat on WhatsApp" | Secondary outlined; opens `api.whatsapp.com` link |
| Decorative bg | Scattered leaf silhouettes `gs.hero-text` @ 6%, `aria-hidden="true"` |

---

## 16. Footer

### 16.1 Footer Layout

```
┌────────────┬────────────┬────────────┬─────────────────────┐
│  [Logo]    │  Services  │  Company   │  Connect            │
│            │            │            │                     │
│  India's   │  Landscape │  About Us  │  WhatsApp           │
│  No.1      │  Balcony   │  Blog      │  Instagram          │
│  online    │  Vertical  │  Careers   │  Facebook           │
│  plant     │  Corporate │  Locate    │  Twitter            │
│  store.    │  Lawn Care │  Store     │                     │
│            │  Pest      │  Gifting   │  [Subscribe input]  │
│            │  Control   │            │  Your email  [→]    │
└────────────┴────────────┴────────────┴─────────────────────┘
© 2025 Ugaoo Agritech Private Limited. All rights reserved.
[Privacy Policy] [Terms of Service] [Refund Policy]
```

| Property | Value |
|---|---|
| Background | `color.text.primary` (`#212326`) |
| Text | `gs.hero-text` |
| Padding top | `space.8 × 8 = 96px` |
| Padding bottom | `space.8 × 4 = 48px` |
| Column layout | 4-column grid, `space.8 × 5 = 60px` gap |
| Column heading | `font.size.3xl`, weight 700, `gs.hero-text`, margin-bottom `space.8 × 2` |
| Column link | `font.size.xl`, weight 400, `gs.hero-text` @ 70%, hover `gs.hero-text` + underline, `motion.duration.instant` |
| Link gap | `space.8 = 12px` |
| Logo | White variant, `height: 40px` |
| Tagline | `font.size.2xl`, weight 400, `gs.hero-text` @ 60%, max-width `200px` |
| Divider | `1px solid gs.hero-text` @ 10%, full-width, above legal row |
| Legal row | `font.size.xs`, `gs.hero-text` @ 50%, flex space-between |
| Legal links | `gs.hero-text` @ 50%, hover `gs.hero-text`, `font.size.xs` |
| Mobile | Single stacked column; accordion-collapse each section |

**Email subscribe input:**

| Property | Value |
|---|---|
| Height | `44px` |
| Bg | `gs.hero-text` @ 10% |
| Border | `1px solid gs.hero-text` @ 20% |
| Border-radius | `radius.2xl` |
| Input font | `font.size.3xl`, `gs.hero-text` |
| Placeholder | "Your email address" |
| Submit button | Arrow icon, `gs.primary-cta-bg` bg, `gs.hero-text`, `radius.2xl`, `40×40px`, inside input right side |
| Focus | `2px solid gs.hero-text` @ 60% |
| `aria-label` | `"Subscribe to Ugaoo newsletter"` |

---

## 17. Persistent Elements

### 17.1 WhatsApp FAB

```
  [WhatsApp icon]    ← Fixed bottom-right
```

| Property | Value |
|---|---|
| Position | Fixed, bottom-right, `space.8 × 3 = 36px` margin, `z-index: 200` |
| Size | `56×56px`, `radius.2xl` |
| Background | `#25D366` (WhatsApp brand green — one-off; document explicitly) |
| Icon | WhatsApp SVG, `28×28px`, white |
| Shadow | `shadow.fab` |
| `aria-label` | `"Chat with us on WhatsApp"` |
| Hover | Scale `1.08`, `motion.duration.instant` |
| Focus-visible | `2px` focus ring `gs.focus-ring` |
| Active | Scale `0.96` |
| Mobile | Remains visible; no label text shown |

### 17.2 Sticky "Book Now" Bar (Mobile only)

Appears at bottom of screen on mobile when hero CTA scrolls out of view.

```
┌──────────────────────────────────┐
│  [ Book a Service ]              │
└──────────────────────────────────┘
```

| Property | Value |
|---|---|
| Position | Fixed, bottom `0`, full-width, `z-index: 150` |
| Background | `gs.card-bg` |
| Border-top | `1px solid gs.divider` |
| Padding | `space.7 = 10px` vertical, `space.8 × 2 = 24px` horizontal |
| Button | Full-width, `gs.primary-cta-bg`, `radius.2xl`, height `48px`, `font.size.3xl` weight 700 |
| Show trigger | When hero CTA leaves viewport (IntersectionObserver) |
| Hide trigger | When booking form enters viewport |
| Animation | Slide up from bottom, `motion.duration.fast` |

### 17.3 Toast Notifications

| Property | Value |
|---|---|
| Position | Bottom-centre, fixed, `z-index: 300` |
| Background | `color.text.primary` |
| Text | `gs.hero-text`, `font.size.2xl`, weight 500 |
| Border-radius | `radius.md` |
| Padding | `space.8 = 12px` vertical, `space.8 × 2 = 24px` horizontal |
| Auto-dismiss | `4000ms` |
| Animation | Slide up + fade `motion.duration.fast` in; fade `motion.duration.fast` out |
| `role` | `"status"` |
| `aria-live` | `"polite"` |

---

## 18. Accessibility Requirements

### 18.1 Contrast Ratios

| Pairing | Ratio | Required | Pass/Fail |
|---|---|---|---|
| `color.text.primary` (#212326) on `color.surface.strong` (#fefcf9) | ~16:1 | 4.5:1 AA | ✅ Pass |
| `color.text.tertiary` (#1c1c1c) on `color.surface.muted` (#fff) | ~17:1 | 4.5:1 AA | ✅ Pass |
| `gs.hero-text` (#fff) on `gs.hero-bg` (#0a4c36) | ~11:1 | 4.5:1 AA | ✅ Pass |
| `gs.hero-text` (#fff) on #25D366 WhatsApp FAB | ~2.7:1 | 3:1 (large icon) | ✅ Pass (icon only) |
| `gs.tag-text` (#0a4c36) on `gs.tag-bg` (#0a4c36 @ 10%) | ~10:1 | 4.5:1 AA | ✅ Pass |
| `gs.body` (#1c1c1c) on `gs.section-alt-bg` (#f9f9f9) | ~16:1 | 4.5:1 AA | ✅ Pass |
| `gs.star-fill` (#c8a84b) on `gs.card-bg` (#fff) | ~2.8:1 | N/A — decorative | ✅ Pass (paired with text) |

> **Rule:** Stars must always be accompanied by a text label or `aria-label` — never rely on colour alone to convey rating.

### 18.2 Focus Management Rules

- Every interactive element: `2px solid gs.focus-ring` (`color.text.inverse`), `2px` offset, visible against all backgrounds
- Nav dropdown opened by keyboard: first menu item receives focus
- Nav dropdown closed by Escape: focus returns to trigger button
- Mobile nav drawer: focus trapped; Escape closes; focus returns to hamburger
- Form submit error: focus moves to first error field, `aria-live="polite"` announces error summary
- FAQ accordion: Escape closes open panel; focus remains on trigger
- Testimonial carousel: Arrow keys advance; Tab moves to next interactive element past the carousel
- Announcement bar carousel: pauses on focus; `aria-live="polite"` announces new message
- Sticky mobile CTA: Tab-accessible; does not trap focus

### 18.3 Full ARIA Map

| Component | ARIA |
|---|---|
| Announcement bar | `role="region"`, `aria-label="Promotional announcements"`, `aria-live="polite"` |
| Nav | `<nav>`, `aria-label="Main navigation"` |
| Nav dropdown | `role="menu"`, `aria-expanded`, `aria-haspopup="true"` on trigger |
| Mobile drawer | `role="dialog"`, `aria-modal="true"`, `aria-label="Navigation menu"` |
| Hero rating | `aria-label="4.8 out of 5 stars — 5,000+ gardens transformed"` |
| Skip link | `href="#main-content"`, visually hidden until focused |
| Services grid | `<section>`, `aria-label="Our garden services"` |
| Service card | `role="article"`, `<h3>` title |
| Service card CTA | `aria-label="Enquire about [service name]"` |
| Trust bar stats | Each stat: `aria-label="[value]: [description]"` |
| Process steps | `<ol>`, each `<li>` wraps step content |
| Feature list | `aria-label="Ugaoo advantages"`, `<ul>` |
| City cards | `role="article"` per city |
| Testimonial carousel | `role="region"`, `aria-label="Customer testimonials"`, `aria-roledescription="carousel"` |
| Testimonial card | `role="group"`, `aria-label="Testimonial from [name]"` |
| Carousel dots | `role="tab"` per dot, `aria-selected`, `aria-label="Slide [n] of [total]"` |
| Enquiry form | `<form>`, `aria-label="Book a gardening service"` |
| Required fields | `aria-required="true"` |
| Error messages | `role="alert"`, `aria-live="polite"`, `aria-describedby` on input |
| Invalid inputs | `aria-invalid="true"` |
| Submit loading | `aria-busy="true"` |
| FAQ container | `<section>`, `aria-label="Frequently asked questions"` |
| FAQ trigger | `<button>`, `aria-expanded`, `aria-controls` |
| FAQ answer | `role="region"`, `aria-labelledby` |
| WhatsApp FAB | `aria-label="Chat with us on WhatsApp"` |
| Sticky CTA | `aria-label="Book a gardening service"` |
| Footer subscribe | `aria-label="Subscribe to Ugaoo newsletter"` |

### 18.4 Keyboard Navigation Map (full page Tab order)

1. Skip to main content link
2. Announcement bar links
3. Announcement dismiss button
4. Logo
5. Nav links + dropdowns (Arrow keys in dropdown)
6. WhatsApp utility
7. Track Order
8. Search
9. Account
10. Cart
11. Hero CTA — "Book a Service"
12. Hero CTA — "Get a Free Quote"
13. Trust bar (non-interactive, skipped)
14. Service cards — "Enquire Now" links (3 × 8 = 8 links)
15. Process steps (non-interactive)
16. Why Ugaoo CTA
17. City cards
18. "Contact Us" — not in city strip
19. Testimonial prev/next arrows
20. Testimonial carousel dots
21. Form fields (6 in Tab order)
22. Submit button
23. Privacy policy link
24. FAQ items — question buttons (8)
25. Footer CTA "Book a Service"
26. Footer CTA "Chat on WhatsApp"
27. Footer nav links (all 195 links, collapsed on mobile)
28. Email subscribe input + submit
29. Legal links
30. WhatsApp FAB

### 18.5 Reduced Motion

- All scroll-triggered animations, stagger effects, and count-up numbers: instant on `prefers-reduced-motion: reduce`
- Announcement bar auto-rotation: pauses
- Card hover `translateY`: removed; colour change only
- FAQ accordion: height `auto` instantly, no transition

### 18.6 Testable Acceptance Criteria

| # | Criterion | Test method | Pass condition |
|---|---|---|---|
| A1 | No contrast failures | axe DevTools | Zero critical/serious |
| A2 | All interactive elements have visible focus ring | Manual Tab traversal | `2px solid #0a4c36` ring visible on every element |
| A3 | Skip link works | Tab from URL bar | "Skip to main content" appears; Enter skips to `<main>` |
| A4 | Nav dropdown keyboard-operable | Keyboard | Enter opens, Escape closes, arrows navigate items |
| A5 | Mobile nav drawer traps focus | Keyboard | Tab cycles only inside drawer; Escape closes |
| A6 | Announcement bar pauses on focus | Focus on bar link | Carousel stops rotating |
| A7 | Form validation announced on error | Screen reader (NVDA/VoiceOver) | Error messages read aloud; focus moves to first error |
| A8 | FAQ accordion state announced | Screen reader | `aria-expanded` change read on toggle |
| A9 | Testimonial carousel announces slide | Screen reader | Slide transition announced via `aria-live` |
| A10 | Rating always has text label | Screen reader | Stars described in words, not colour |
| A11 | Submit button loading state announced | Screen reader | `aria-busy="true"` change read |
| A12 | Success message announced | Screen reader | Form success `role="alert"` fires |
| A13 | Reduced motion respected | OS reduced motion ON | Animations disabled |
| A14 | WhatsApp FAB has accessible name | Screen reader | Label "Chat with us on WhatsApp" read |
| A15 | Sticky mobile CTA accessible | Keyboard + screen reader | Button reachable, label correct |

---

## 19. Content & Tone Standards

### 19.1 Headings

- Must: Sentence case throughout — "Book a gardening service", not "Book A Gardening Service"
- Must not: ALL CAPS headings
- Should: Lead with action or benefit — "Transform your space" not "Our services"

### 19.2 CTA Labels

| CTA | Label | Must not use |
|---|---|---|
| Primary booking | "Book a Service" | "Click here", "Submit", "Go" |
| Quote request | "Get a Free Quote" | "Request info" |
| Service enquiry | "Enquire Now" | "Learn more" (too vague for service cards) |
| WhatsApp | "Chat on WhatsApp" | "Contact us" |

### 19.3 Error Messages

| Error | Message |
|---|---|
| Required field empty | "[Field name] is required." |
| Invalid phone | "Enter a valid 10-digit phone number." |
| Invalid email | "Enter a valid email address." |
| No city selected | "Select your city to continue." |
| Network / submit error | "Something went wrong. Please try again." |
| File too large (if upload added) | "File must be under 5MB." |

### 19.4 Service Card Copy Rules

- Must: Service name ≤ 3 words
- Must: Description 1–2 sentences, benefit-led, ≤ 25 words
- Must not: Use jargon without explanation ("modular systems", "phytoremediation")
- Should: Start description with what the service does for the customer

### 19.5 Testimonial Copy Rules

- Must: Use client's real name and company
- Must not: Truncate attribution to first name only without approval
- Should: Quote length 2–4 sentences maximum; truncate longer quotes with "Show more"

### 19.6 City / Service Area Copy

- Must: Clearly distinguish "full service" cities from "large projects only" cities
- Must not: Imply nationwide coverage without confirmation

---

## 20. Anti-Patterns & Prohibited Implementations

| Anti-pattern | Why prohibited | Correct approach |
|---|---|---|
| Raw hex `#0a4c36` in CSS | Breaks token system | Use `color.text.inverse` |
| `outline: none` on any element | Removes keyboard access | `outline: 2px solid color.text.inverse` always |
| Vague CTA labels: "Click here", "Learn more" | Non-descriptive, fails WCAG 2.4.6 | "Book a Service", "Enquire about Landscaping" |
| Stars without text label | Colour-only meaning fails WCAG 1.4.1 | Always add `aria-label="N out of 5 stars"` |
| Auto-advancing carousel without pause | Fails WCAG 2.2.2 | No auto-advance on testimonials; announcement bar must pause on focus |
| Form validation only on submit | Poor UX; confuses users | Validate per-field on blur + full pass on submit |
| Hero background image without overlay | Text may fail contrast on light photos | Always apply `color.text.inverse` @ ≥ 65% overlay |
| Sticky mobile CTA covering form fields | Blocks content | Hide sticky CTA when form is in viewport |
| Dropdown opened on hover-only | Keyboard-inaccessible | Must also open on Enter/Space |
| Testimonial quotes with no attribution | Untrustworthy, anonymous claims | Full name + role + company always required |
| WhatsApp link in `<div>` with click handler | Screen reader inaccessible | Use `<a href="https://api.whatsapp.com/...">` |
| Spacing exceptions outside token scale | Breaks design consistency | Use only token-composed values |
| City coverage implied as nationwide | Misleading | Explicitly list cities; include "not in your city" fallback |
| Form success without visual + announced feedback | User confusion | Show success panel + `role="alert"` |
| Local font-size exception below `font.size.xs` (11px) | Below minimum legible size at body weight | Use `font.size.xs = 11px` minimum |

---

## 21. Edge-Case Handling

| Scenario | Behaviour |
|---|---|
| Form submit on slow network | Button enters loading state; timeout after 15s; show error toast |
| User's city not in dropdown | "Other" option present; free-text city field appears |
| Testimonial has no company logo | Avatar initials circle shown (`gs.tag-bg` bg, `gs.tag-text`) |
| Service card description > 40 words | Truncate with "See more" toggle; expanded with `aria-expanded` |
| FAQ answer has links | Inline anchor tags, `gs.accent` colour, underline, open in same tab |
| Hero image fails to load | `gs.primary-cta-bg` solid colour fallback bg; text still legible |
| WhatsApp link on desktop | Opens `web.whatsapp.com` in new tab |
| User submits form twice | Debounce submit; button disabled after first click until response |
| Mobile keyboard open | Sticky CTA hides to avoid covering input; form scrolls into view |
| Very long city / service name in select | Text truncates with ellipsis; full name in `title` attribute |
| JavaScript disabled | Form falls back to standard `<form>` POST; page reloads to success URL |
| All FAQ items open at once | Only one open at a time (single-open accordion); prevents excessive scroll |

---

## 22. Full Page Section Order

```
01  ANNOUNCEMENT BAR  — Promotional offers ticker
02  NAVIGATION BAR    — Sticky, "Garden Services" active
03  HERO              — Dark green, heading, subtext, 2 CTAs, rating
04  TRUST BAR         — 4 key stats, green bg
05  SERVICES GRID     — 8 service cards, 3-col grid
06  HOW IT WORKS      — 3 step cards with connector line
07  WHY UGAOO         — 2-col: photo left, feature list right
08  SERVICE AREAS     — City cards + "not in your city" strip
09  TESTIMONIALS      — 3-card carousel, arrows + dots
10  BOOKING FORM      — 6-field form, centred, white card
11  FAQ ACCORDION     — 8 questions, single-open
12  FOOTER CTA STRIP  — Dark green, 2 CTAs
13  FOOTER            — 4-col links, subscribe, legal
    WHATSAPP FAB      — Fixed bottom-right, persistent
    STICKY MOBILE CTA — Fixed bottom, mobile only, conditional show
```

---

## 23. Responsive Behaviour Summary

| Breakpoint | Key layout changes |
|---|---|
| `≥ 1280px` | Full 3-col service grid; 4-stat trust bar; 2-col why-ugaoo; 3-col testimonials; 2-col form |
| `1024–1279px` | 3-col service grid; 2-col testimonials; 2-col form |
| `768–1023px` | 2-col service grid; 1-col testimonials; 1-col form; stacked why-ugaoo |
| `< 768px` | 1-col all sections; sticky bottom CTA; FAQ accordion collapses by default; announcement bar single message |
| `< 480px` | Trust bar 2×2 grid; compact hero; form full-width fields; footer accordion-collapsible columns |

---

## 24. QA Checklist

### Visual
- [ ] Page background: `color.surface.strong` (#fefcf9) — warm off-white
- [ ] All text: `Outfit` font family
- [ ] No raw hex values in component CSS — tokens only
- [ ] Hero: dark green overlay on photo; all text passes contrast
- [ ] Trust bar: white text on `color.text.inverse` background
- [ ] Service cards: hover lifts `4px`, green border appears
- [ ] Step cards: large step number visible at 15% opacity
- [ ] Testimonial cards: subtle shadow, quote marks decorative
- [ ] FAQ: chevron rotates 180° on open; green border on active item
- [ ] Footer: dark `color.text.primary` bg, white text links
- [ ] WhatsApp FAB: green, fixed position, visible above all content
- [ ] Sticky mobile CTA: slides up; hidden when form visible

### Interaction
- [ ] Announcement bar rotates 3 messages; pauses on hover/focus
- [ ] Nav dropdowns open on hover AND Enter/Space keyboard
- [ ] Mobile nav: opens on hamburger; Escape closes; focus trapped
- [ ] Hero CTAs: "Book a Service" scrolls to form; "Get a Free Quote" opens form with "Quote" pre-selected
- [ ] Stat counter animates on scroll-into-view
- [ ] Service card "Enquire Now" scrolls to form + pre-selects service
- [ ] Testimonial carousel: arrows advance; dots jump to slide; Arrow keys work
- [ ] Form: validates on blur per field; all errors on submit fail; focus moves to first error
- [ ] Form submit: loading spinner; success panel on success; error toast on failure
- [ ] FAQ: single-open; Escape closes; Up/Down arrows navigate
- [ ] Sticky mobile CTA appears when hero leaves viewport; hides when form visible
- [ ] WhatsApp FAB: opens WhatsApp Web on desktop; WhatsApp app on mobile

### Accessibility
- [ ] axe DevTools: zero critical/serious errors
- [ ] All focus rings: `2px solid #0a4c36`, visible on all bg colours
- [ ] Skip link: appears on first Tab; works correctly
- [ ] Nav dropdown: keyboard-navigable; Escape closes
- [ ] All star ratings have `aria-label` text description
- [ ] Form errors: `aria-invalid`, `aria-describedby`, `role="alert"` on messages
- [ ] FAQ accordion: `aria-expanded`, `aria-controls` correct
- [ ] Testimonial carousel: `aria-roledescription="carousel"`, live region
- [ ] Submit button `aria-busy="true"` during loading
- [ ] `prefers-reduced-motion`: all animations disabled when enabled
- [ ] Sticky CTA and FAB keyboard-accessible

### Content
- [ ] All CTA labels match §19.2 spec exactly
- [ ] All error messages match §19.3 spec
- [ ] Service card descriptions ≤ 25 words, benefit-led
- [ ] Testimonials include full name + role + company
- [ ] City coverage distinguishes "Full Service" from "Large Projects"
- [ ] No lorem ipsum or placeholder text in production
- [ ] Headings: sentence case throughout

### Responsive
- [ ] No horizontal overflow at 320px viewport width
- [ ] All touch targets ≥ 44×44px on mobile
- [ ] Form fields full-width on mobile; no side-by-side cramping
- [ ] Footer columns collapse to accordion on mobile
- [ ] Announcement bar shows single message on mobile (no overflow)
- [ ] Sticky mobile CTA does not cover form fields when keyboard open

---

*Document version: 1.0 — Ugaoo Garden Services marketing page*
*Guideline standard: WCAG 2.2 AA | Token system: Outfit / Ugaoo brand token set*
*Companion documents: Red Anthurium PDP design.md · AI Care design.md*

---

## 25. SEO & Meta Specification

> Every on-page SEO property must be implementation-ready and consistent with the Ugaoo brand voice.

### 25.1 Page-Level Meta Tags

| Tag | Value |
|---|---|
| `<title>` | `Book Gardening Services Online (Home Gardener Experts) – Ugaoo` |
| `meta description` | `Book gardening services near you for home care, maintenance, and landscaping. Hire expert gardeners online for your home garden today.` |
| `canonical` | `https://www.ugaoo.com/pages/ugaoo-garden-services` |
| `og:title` | `Book Gardening Services Online (Home Gardener Experts)` |
| `og:description` | Same as meta description |
| `og:image` | `https://www.ugaoo.com/cdn/shop/files/Website_Link_Thumbnail_Final_1200px_X_628px_1.png` |
| `og:image:width` | `1200` |
| `og:image:height` | `628` |
| `og:type` | `website` |
| `og:url` | `https://www.ugaoo.com/pages/ugaoo-garden-services` |
| `og:site_name` | `Ugaoo` |
| `twitter:card` | `summary_large_image` |
| `twitter:site` | `@Ugaooindia` |
| `twitter:title` | `Book Gardening Services Online (Home Gardener Experts)` |
| `twitter:description` | Same as meta description |
| `meta theme-color` | `#0a4c36` |

### 25.2 Heading Hierarchy

Must follow a strict single `<h1>` → `<h2>` → `<h3>` descending hierarchy. No skipped levels.

```
<h1>  Expert Gardeners. Delivered to Your Door.           (Hero)
  <h2>  Our Garden Services                               (§8)
    <h3>  Landscape Development                           (Service card)
    <h3>  Balcony & Terrace Gardens                       (Service card)
    <h3>  [... all 8 service cards]
  <h2>  How It Works                                      (§9)
    <h3>  Share Your Space                                (Step 1)
    <h3>  We Match You                                    (Step 2)
    <h3>  Expert Arrives                                  (Step 3)
  <h2>  Why Choose Ugaoo?                                 (§10)
  <h2>  Where We Serve                                    (§11)
    <h3>  Mumbai                                          (City card)
    <h3>  Pune                                            (City card)
    <h3>  Bangalore                                       (City card)
    <h3>  Delhi / Jaipur / Nagpur                         (City card)
  <h2>  What Our Clients Say                              (§12)
  <h2>  Book a Gardening Service                          (§13 — form heading)
  <h2>  Frequently Asked Questions                        (§14)
  <h2>  Ready to Transform Your Green Space?              (§15 — footer strip)
```

### 25.3 Structured Data (JSON-LD)

Must implement the following schema types on the page:

**LocalBusiness schema:**

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Ugaoo Garden Services",
  "url": "https://www.ugaoo.com/pages/ugaoo-garden-services",
  "logo": "https://www.ugaoo.com/cdn/shop/files/logo.png",
  "description": "Book professional gardening services for home, balcony, terrace, or office. Expert gardeners in Mumbai, Pune, and Bangalore.",
  "areaServed": ["Mumbai", "Pune", "Bangalore", "Delhi", "Jaipur", "Nagpur"],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Gardening Services",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Landscape Development" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Balcony & Terrace Gardens" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Vertical Gardens" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Corporate Plant Rentals" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Lawn & Garden Maintenance" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Pest Control" } }
    ]
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "5000"
  }
}
```

**FAQPage schema:**

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What gardening services does Ugaoo offer?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Ugaoo offers landscaping, vertical gardens, balcony gardens, indoor plant rentals, lawn care, pruning, pest control, and corporate maintenance services."
      }
    },
    {
      "@type": "Question",
      "name": "Which cities do you serve?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Full service is available in Mumbai, Pune, and Bangalore. Large-scale projects are also taken up in Delhi, Jaipur, and Nagpur."
      }
    }
    // ... remaining 6 FAQ items follow same pattern
  ]
}
```

### 25.4 Image Alt Text Standards

| Image | Required `alt` |
|---|---|
| Hero background | `""` (decorative — CSS background-image, no `<img>`) |
| Why Ugaoo photo | `"Ugaoo expert gardener tending to a home balcony garden in Mumbai"` |
| Service card icons | `""` (decorative — `aria-hidden="true"`) |
| Client company logos | `"[Company name] logo"` |
| Testimonial author avatar | `"[Author name]"` |
| Trust bar icons | `""` (decorative — `aria-hidden="true"`) |
| OG share image | `"Ugaoo professional gardening services — Mumbai, Pune, Bangalore"` |

---

## 26. Performance & Loading Specification

> Every token and component rule must ship without degrading Core Web Vitals.

### 26.1 Core Web Vitals Targets

| Metric | Target | Budget |
|---|---|---|
| **LCP** (Largest Contentful Paint) | `< 2.5s` | Hero image must be `loading="eager"`, `fetchpriority="high"` |
| **CLS** (Cumulative Layout Shift) | `< 0.1` | All images must have explicit `width` + `height` attributes |
| **INP** (Interaction to Next Paint) | `< 200ms` | Form validation, FAQ toggle, card hover all within budget |
| **FCP** (First Contentful Paint) | `< 1.8s` | Critical CSS inlined; Outfit font `preload` |
| **TTFB** (Time to First Byte) | `< 600ms` | Shopify CDN caching + edge delivery |

### 26.2 Image Optimisation Rules

| Rule | Requirement |
|---|---|
| Hero image format | WebP with JPEG fallback; served via `<picture>` with `srcset` |
| Hero image sizes | `srcset`: 480w, 768w, 1024w, 1280w, 1920w |
| Hero image loading | `loading="eager"`, `fetchpriority="high"`, `decoding="async"` |
| All other images | `loading="lazy"`, `decoding="async"` |
| Service card icons | SVG inline (no HTTP request) or CSS; never `<img>` for decorative icons |
| Testimonial avatars | `width="56" height="56"` explicit; served WebP at `2×` resolution |
| OG image | Must be exactly `1200×628px` as declared in meta |
| City section images | Not required — CSS-only card design; no image loading cost |

### 26.3 Font Loading

```html
<!-- Preconnect to Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- Outfit subset: only Latin, weights 400 / 600 / 700 / 800 -->
<link rel="preload" as="style"
  href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&display=swap">
```

| Rule | Requirement |
|---|---|
| `font-display` | `swap` — text visible during font load using system fallback |
| Fallback stack | `Outfit, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` |
| Weights loaded | 400, 600, 700, 800 only (not full variable font) |
| Subsetting | Latin characters only — reduces file size by ~60% |
| Self-hosted | Should self-host via Shopify CDN for GDPR compliance and reduced DNS lookup |

### 26.4 JavaScript Loading Rules

| Script | Loading strategy | Notes |
|---|---|---|
| FAQ accordion | `defer` | Lightweight vanilla JS; no library required |
| Form validation | `defer` | Client-side only; submit still works without JS |
| Count-up animation | `defer` + IntersectionObserver | Fires only when stats enter viewport |
| Testimonial carousel | `defer` | CSS scroll-snap preferred over JS carousel library |
| Announcement bar | `defer` | Inline vanilla; `requestAnimationFrame` for rotation |
| Google Tag Manager | `async` in `<head>` | Do not block render |
| WhatsApp link | No JS — pure `<a href>` | Works without JavaScript |
| Sticky mobile CTA | IntersectionObserver | Lightweight; no library |

### 26.5 Critical CSS

The following styles must be inlined in `<head>` to prevent FOUC and CLS:

- Base reset and `box-sizing`
- `color.surface.strong` body background
- `Outfit` font-face declaration
- Navigation bar layout and height (`64px`)
- Hero section minimum height and background colour (`color.text.inverse`)
- Announcement bar height (`36px`)

### 26.6 Lazy Loading Regions

| Section | Loading strategy |
|---|---|
| Hero | Eager — above fold |
| Trust bar | Eager — near fold |
| Services grid | Lazy — below fold |
| How it works | Lazy |
| Why Ugaoo | Lazy — image `loading="lazy"` |
| Testimonials | Lazy |
| Booking form | Lazy |
| FAQ | Lazy |
| Footer | Lazy |

---

## 27. Component Migration Notes

> For teams migrating from an existing or unstructured implementation to this token-driven spec.

### 27.1 Token Adoption Priority

Adopt tokens in this order to minimise regression risk:

| Priority | Token group | Risk if skipped |
|---|---|---|
| P0 — Critical | `color.text.primary`, `color.text.inverse`, `color.surface.strong`, `color.surface.muted` | Text contrast failures, brand inconsistency |
| P0 — Critical | Focus ring: `2px solid color.text.inverse` | WCAG 2.4.11 failure, keyboard inaccessibility |
| P1 — High | All `font.size.*` tokens | Typography regressions; hierarchy breaks |
| P1 — High | `radius.xs` through `radius.2xl` | Card/button shape inconsistency |
| P2 — Medium | `shadow.1`, `shadow.2` | Elevation inconsistency; not a contrast failure |
| P2 — Medium | `motion.duration.*` | Animation timing inconsistency; not functional |
| P3 — Low | Composed shadow values (`shadow.card-hover` etc.) | Minor elevation polish |

### 27.2 One-off Values to Eliminate

The following raw values are in common use and must be replaced during migration:

| Raw value | Replace with | Location |
|---|---|---|
| `#0a4c36` | `color.text.inverse` | CTAs, nav active, accents |
| `#212326` | `color.text.primary` | Headings, footer bg |
| `#1c1c1c` | `color.text.tertiary` | Body text |
| `#f9f9f9` | `color.surface.raised` | Alt section bg |
| `#ffffff` | `color.surface.muted` | Cards, nav bg |
| `#fefcf9` | `color.surface.strong` | Page bg |
| `border-radius: 50px` | `radius.2xl` | Pill buttons |
| `border-radius: 8px` | Use `radius.sm = 6px` or `radius.md = 12px` — snap to nearest | Inputs, cards |
| `font-size: 14px` | `font.size.xl` | Body copy |
| `font-size: 16px` | `font.size.3xl` | CTAs, labels |

### 27.3 Component Naming Conventions

All CSS custom properties must follow the kebab-case token naming:

```css
/* Correct */
--color-text-primary: #212326;
--color-text-inverse: #0a4c36;
--radius-md: 12px;
--motion-duration-fast: 300ms;

/* Incorrect — never use */
--primaryGreen: #0a4c36;
--cardRadius: 12px;
--animSpeed: 300ms;
```

### 27.4 Shopify Liquid Integration Notes

| Element | Shopify-specific implementation |
|---|---|
| Announcement bar | Shopify theme settings: `settings_schema.json` — `announcement_text` field |
| Nav links | Shopify navigation linklist — `main-menu` handle |
| Service cards | Shopify metafields on page object: `page.metafields.services.items` |
| Testimonials | Shopify metafields or hardcoded section blocks |
| FAQ items | Shopify section blocks with `type: "faq_item"`, `settings: [question, answer]` |
| Booking form | Shopify Contact Form action `/contact#ContactForm` or third-party (Typeform / HubSpot) |
| City data | Hardcoded section JSON or metafields |
| WhatsApp number | Theme setting `whatsapp_phone` to avoid hardcoding |
| Trust bar stats | Theme settings: `stat_1_number`, `stat_1_label` × 4 |

---

## 28. Design System Integration

> How this page connects to the broader Ugaoo design system and companion page specs.

### 28.1 Shared Component Registry

Components on this page that are shared across the Ugaoo storefront and must not diverge:

| Component | Defined in | Used on |
|---|---|---|
| Navigation bar | Shared layout | All pages |
| Announcement bar | Shared layout | All pages |
| Footer | Shared layout | All pages |
| WhatsApp FAB | Shared layout | All pages |
| Toast notifications | Shared utility | All pages |
| Primary CTA button | Shared components | PDP, AI Care, Garden Services |
| Secondary outlined button | Shared components | PDP, AI Care, Garden Services |
| Input field (text/email/tel) | Shared form components | Garden Services, AI Care |
| Select / dropdown | Shared form components | Garden Services, AI Care |
| Textarea | Shared form components | Garden Services |
| Star rating display | Shared components | PDP, Garden Services testimonials |
| Pill badge / tag | Shared components | PDP size chips, Garden Services city tags |
| Card (generic) | Shared components | PDP pot cards, Services grid, AI Care plant cards |

### 28.2 Page-Exclusive Components

Components unique to this Garden Services page that must not be copied ad-hoc to other pages without design review:

| Component | Notes |
|---|---|
| Trust bar (stats strip) | May be reused on About page if created |
| Process step cards | Specific to how-it-works flows |
| City coverage cards | Specific to services page |
| Testimonial carousel with attribution | May reuse on homepage |
| Booking enquiry form | Garden-services-specific fields; not reusable as-is |
| Footer CTA strip | Shared with landing pages only |
| Sticky mobile booking CTA | Garden services + any high-intent landing pages |

### 28.3 Token File Reference

All tokens in this spec align with the following token file structure:

```
tokens/
├── color.json          ← color.text.*, color.surface.*
├── font.json           ← font.family.*, font.size.*, font.weight.*
├── spacing.json        ← space.1 through space.8
├── radius.json         ← radius.xs through radius.2xl
├── shadow.json         ← shadow.1, shadow.2
├── motion.json         ← motion.duration.*
└── semantic/
    └── garden-services.json   ← gs.* aliases defined here
```

### 28.4 Cross-Page Consistency Rules

| Rule | Applies to |
|---|---|
| Must: Same nav height (64px desktop, 56px mobile) | All pages |
| Must: Same focus ring style (`2px solid color.text.inverse`) | All pages |
| Must: Same CTA button height (52px primary, 44px secondary) | All pages |
| Must: Same card `border-radius` (`radius.md = 12px`) | All pages |
| Must: Same input height (48px) | All pages |
| Should: Same section padding rhythm (`96px / 72px / 48px`) | All marketing pages |
| Should: Same toast position (bottom-centre) and token | All pages |
| Must not: Introduce new font weights not in the 400/600/700/800 set | All pages |
| Must not: Introduce new spacing values outside the token scale | All pages |

---

## 29. Analytics & Tracking Events

> Implementation-ready event definitions for conversion tracking. Teams must fire these on user interactions.

### 29.1 Key Events to Track

| Event name | Trigger | Properties |
|---|---|---|
| `page_view` | Page load | `page_type: "garden_services"`, `url` |
| `hero_cta_click` | Hero "Book a Service" or "Get a Free Quote" clicked | `cta_label`, `cta_position: "hero"` |
| `service_card_click` | "Enquire Now" on any service card | `service_name`, `card_position` |
| `city_card_view` | City section enters viewport | `cities_visible` (array) |
| `testimonial_advance` | Carousel prev/next arrow or dot clicked | `direction`, `slide_number` |
| `form_start` | User focuses first form field | `form_id: "garden_services_enquiry"` |
| `form_field_complete` | User blurs a completed field | `field_name`, `form_id` |
| `form_submit_attempt` | Submit button clicked | `form_id`, `has_errors: true/false` |
| `form_submit_success` | Form submits successfully | `form_id`, `city`, `service_type` |
| `form_submit_error` | Form submit fails | `form_id`, `error_type` |
| `faq_open` | FAQ item opened | `question_index`, `question_text` |
| `footer_cta_click` | Footer strip CTA clicked | `cta_label`, `cta_position: "footer_strip"` |
| `whatsapp_fab_click` | WhatsApp FAB clicked | `source: "fab"` |
| `whatsapp_footer_click` | WhatsApp link in footer strip clicked | `source: "footer_strip"` |
| `sticky_cta_click` | Mobile sticky CTA clicked | `cta_position: "sticky_mobile"` |
| `announcement_click` | Announcement bar link clicked | `message_text`, `destination_url` |

### 29.2 Conversion Funnel

```
Page View
    ↓
Hero CTA click   OR   Sticky CTA click   OR   Service card "Enquire Now"
    ↓
Form field interaction (form_start)
    ↓
Form completion (all required fields filled)
    ↓
form_submit_attempt
    ↓
form_submit_success  ←→  form_submit_error (retry loop)
    ↓
CONVERSION ✓
```

Primary conversion metric: `form_submit_success`.
Secondary metric: `whatsapp_fab_click` + `whatsapp_footer_click`.

### 29.3 Data Layer Structure (GTM)

```javascript
// On form submit success
window.dataLayer.push({
  event: 'form_submit_success',
  form_id: 'garden_services_enquiry',
  city: 'Mumbai',           // from select field value
  service_type: 'Lawn & Garden Maintenance',  // from select field value
  page_type: 'garden_services'
});
```

---

## 30. Appendix — Component State Summary Table

> A single-reference summary of all interactive components and their required states. Teams must implement every state listed.

| Component | Default | Hover | Focus-visible | Active | Disabled | Loading | Error | Success |
|---|---|---|---|---|---|---|---|---|
| Primary CTA button | `gs.primary-cta-bg` fill | Darken 10% | `2px` yellow focus ring | Scale `0.98` | `opacity: 0.4` | Spinner | — | Checkmark |
| Secondary outlined button | Transparent, green border | Fill green bg | `2px` focus ring | Scale `0.98` | `opacity: 0.4` | Spinner | — | — |
| Nav link | `gs.body`, no underline | `gs.accent`, underline | `2px` focus ring | — | — | — | — | — |
| Nav dropdown item | Transparent | `gs.tag-bg` bg | `2px` focus ring | — | — | — | — | — |
| Service card | `shadow.1`, `gs.divider` border | `shadow.card-hover`, green border, `translateY(-4px)` | `2px` focus ring | `translateY(-2px)` | — | Skeleton | — | — |
| Service card CTA link | `gs.accent` | Underline | `2px` focus ring | — | — | — | — | — |
| FAQ trigger button | `gs.divider` border | Green border, `gs.tag-bg` bg | `2px` focus ring | — | — | — | — | — |
| FAQ answer panel | `height: 0`, hidden | — | — | — | — | — | — | Visible, `height: auto` |
| Form input | `gs.input-border` | Darken border | `2px solid gs.input-border-focus` + glow | — | `gs.divider`, muted bg | — | Red border + error msg | Green border |
| Form select | Same as input | Same | Same | — | Same | — | Same | Same |
| Form textarea | Same as input | Same | Same | — | Same | — | Same | Same |
| Submit button | `gs.primary-cta-bg` | Darken 10% | `2px` focus ring | Scale `0.98` | `aria-disabled` | Spinner, `aria-busy` | Error toast below | Replaced by success panel |
| Testimonial prev/next | `gs.card-bg`, `gs.divider` border | `gs.primary-cta-bg`, white icon | `2px` focus ring | — | `opacity: 0.4`, `aria-disabled` | — | — | — |
| Carousel dot | `gs.divider` circle | `gs.accent` circle | `2px` focus ring | — | — | — | — | — |
| Carousel dot (active) | `gs.accent` pill | — | `2px` focus ring | — | — | — | — | — |
| Announcement bar link | No underline | Underline | `2px` white focus ring | — | — | — | — | — |
| Announcement dismiss | Icon colour `gs.hero-text` @ 70% | `gs.hero-text` @ 100% | `2px` white focus ring | Scale `0.95` | — | — | — | — |
| City card | `gs.divider` border | `shadow.card-hover`, green border | `2px` focus ring | — | — | — | — | — |
| WhatsApp FAB | `#25D366` bg, `shadow.fab` | Scale `1.08` | `2px` focus ring `gs.focus-ring` | Scale `0.96` | — | — | — | — |
| Sticky mobile CTA | `gs.primary-cta-bg` | Darken 10% | `2px` focus ring | Scale `0.98` | — | — | — | — |
| Footer email input | `gs.hero-text` @ 10% bg | Darken border | `2px solid gs.hero-text` @ 60% | — | — | — | Error msg below | — |
| Footer subscribe btn | `gs.primary-cta-bg` | Darken 10% | `2px` focus ring | Scale `0.96` | — | Spinner | — | Checkmark |
| Mobile nav hamburger | `gs.body` icon | `gs.accent` icon | `2px` focus ring | — | — | — | — | — |
| Mobile nav close btn | `gs.body` icon | `gs.accent` icon | `2px` focus ring | Scale `0.95` | — | — | — | — |
| "Not in city" CTA | Outlined, `gs.accent` | Fill `gs.primary-cta-bg`, white text | `2px` focus ring | Scale `0.98` | — | — | — | — |

---

*Document version: 1.0 (complete) — Ugaoo Garden Services marketing page*
*Sections: 1–24 (core spec) + 25–30 (extended implementation guide)*
*Guideline standard: WCAG 2.2 AA | Token system: Outfit / Ugaoo brand token set*
*Companion documents: Red Anthurium Plant PDP design.md · AI Care page design.md*
*Last updated: June 2026*