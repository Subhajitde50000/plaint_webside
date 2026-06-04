# Hero — Plant Startup Homepage Design Specification

---

## 1. Brand Overview

| Property | Value |
|---|---|
| **Brand Name** | Hero |
| **Brand Logo** | Leaf icon (🌿) + "Hero" wordmark in dark green |
| **Tagline** | Grow Your Green Space |
| **Niche** | Plants, seeds, and expert AI-powered plant care |
| **Overall Aesthetic** | Soft organic, warm earthy, nature-forward, 3D illustrated, playful-yet-trustworthy |

---

## 2. Design Tokens

### 2.1 Color Palette

| Token | Hex | Usage |
|---|---|---|
| `--color-bg-primary` | `#F5F0E8` | Main page background (warm cream) |
| `--color-bg-secondary` | `#EDE8D8` | Section alternates, card backgrounds |
| `--color-green-dark` | `#2D5A27` | Headings, logo, primary CTA button |
| `--color-green-mid` | `#4A7C40` | Subheadings, active nav, icon accents |
| `--color-green-light` | `#A8C5A0` | Soft circle backgrounds, decorative blobs |
| `--color-green-pale` | `#D4E8CE` | Card hover states, gentle highlights |
| `--color-accent-yellow` | `#F5C842` | Sparkle stars, highlight accents |
| `--color-accent-blue` | `#6BBDE3` | Water droplet icons, AI bot accents |
| `--color-accent-orange` | `#E8A870` | Hero image warm glow gradient |
| `--color-text-primary` | `#2D3A2E` | Body text, dark headings |
| `--color-text-secondary` | `#6B7C6D` | Subtext, descriptions |
| `--color-white` | `#FFFFFF` | Cards, nav background |
| `--color-badge-green` | `#3A6B30` | CTA buttons, pill badges |

### 2.2 Typography

| Role | Font Family | Weight | Size |
|---|---|---|---|
| **Logo** | Poppins / Nunito | Bold 700 | 22px |
| **Hero Heading** | Playfair Display / Fraunces | Bold 800 | 56–64px |
| **Section Heading** | Poppins | Bold 700 | 36–40px |
| **Sub-heading / Label** | Poppins | SemiBold 600 | 18–20px |
| **Body / Description** | DM Sans / Nunito | Regular 400 | 15–16px |
| **Button Text** | Poppins | SemiBold 600 | 15–16px |
| **Nav Links** | Poppins | Medium 500 | 15px |
| **Badge / Pill** | Poppins | SemiBold 600 | 13px |

### 2.3 Spacing System

| Token | Value |
|---|---|
| `--space-xs` | 8px |
| `--space-sm` | 16px |
| `--space-md` | 24px |
| `--space-lg` | 48px |
| `--space-xl` | 80px |
| `--space-2xl` | 120px |

### 2.4 Border Radius

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | 8px | Small tags, badges |
| `--radius-md` | 16px | Cards, input fields |
| `--radius-lg` | 24px | Product cards, category tiles |
| `--radius-xl` | 32px | CTA buttons |
| `--radius-full` | 9999px | Pills, avatar bubbles |

### 2.5 Shadows

| Token | Value | Usage |
|---|---|---|
| `--shadow-card` | `0 8px 32px rgba(45, 90, 39, 0.10)` | Product cards |
| `--shadow-btn` | `0 4px 16px rgba(45, 90, 39, 0.25)` | CTA buttons |
| `--shadow-float` | `0 16px 48px rgba(0,0,0,0.12)` | Floating 3D elements |

---

## 3. Layout & Grid

- **Max Width:** 1280px, centered
- **Gutters:** 24px (mobile), 48px (desktop)
- **Columns:** 12-column CSS Grid
- **Breakpoints:**
  - Mobile: `< 768px`
  - Tablet: `768px – 1024px`
  - Desktop: `> 1024px`

---

## 4. Component Specifications

### 4.1 Navigation Bar

```
[ 🌿 Hero Logo ]          [ Plants ▾ ]  [ Supplies ]  [ AI Care ]  [ 🔍 ]  [ 🛒 (badge: 0) ]
```

| Property | Value |
|---|---|
| **Background** | White `#FFFFFF` with subtle bottom border or no border (transparent scroll) |
| **Height** | 64–72px |
| **Logo** | Leaf SVG icon + "Hero" text, dark green |
| **Nav Links** | `Plants ▾` (dropdown), `Supplies`, `AI Care` — Medium 500 |
| **Search Icon** | 🔍 circular icon button |
| **Cart Icon** | 🛒 with red notification badge showing item count |
| **Sticky** | Yes — fixed to top on scroll |
| **Mobile** | Hamburger menu (☰) |

---

### 4.2 Hero Section (Slide 1 of 5)

**Layout:** Two-column split — Left: Text | Right: 3D Illustration

#### Left Column (Text)
- **Heading:** "Grow Your Green Space" — dark green, large serif/display font, ~56–64px
- **Sub-copy:** Short description paragraph about plants, seeds, expert care — body font, `--color-text-secondary`
- **CTA Button:** `[ Shop Now ]` — dark green pill button (`--radius-xl`), white text, with box-shadow on hover
- **Decorative:** Yellow ✦ sparkle stars scattered near heading

#### Right Column (Visual)
- **3D Monstera plant** in a terracotta pot — large, center-right position
- **Cute 3D watering can** character with smiley face, mid-pour animation (water droplets animated)
- **Background circle:** Soft pastel green/cream gradient blob behind the plant
- **Floating leaves:** Scattered green leaf shapes animating gently (float up)

#### Carousel Dots
- 5 dot indicators at bottom center
- Active dot: elongated dark green pill shape
- Inactive dots: small grey/beige circles

---

### 4.3 "Our Green Categories" Section

**Heading Row:**
```
[ Our Green Categories ]                   [ See it all → ]
```

**Card Grid:** Horizontal scrollable row, 4 visible cards

| Card Property | Value |
|---|---|
| **Shape** | Rounded rectangle, `--radius-lg` |
| **Size** | ~300px × 380px |
| **Image** | Full-bleed top photo (plant/flower photo) |
| **Label** | Bold text below image, centered |
| **Background** | White card |
| **Shadow** | `--shadow-card` |
| **Hover** | Slight scale-up + shadow lift |

**Categories visible:**
1. 🌹 **Flower Plants** — Red rose photo, warm gradient bg
2. 🪴 **Indoor Plants** — Snake plant in white pot
3. 🌸 **Balcony Decor** — Hanging flower baskets
4. 🌿 *(4th card partially visible, implies scroll)*

**Carousel Dots:** 5 dots at bottom center (same style as hero)

---

### 4.4 "Everything You Need" / Products Section

**Layout:** Left: text + search | Right: product grid

#### Left Side
- **Heading:** "Everything You Need" — bold, dark green, ~36px
- **Description:** Short body text, `--color-text-secondary`
- **Search Bar + Subscribe Button:**
  - Input: "Search order…" placeholder, rounded pill shape, white bg, search icon prefix
  - Button: `[ Subscribe ]` — dark green, pill shape, white text

#### Product Grid (2×2 below, horizontally scrollable)
- Appears as small product card thumbnails
- Cards show product images (seeds packet, soil bag, spray bottle, fertilizer)

---

### 4.5 "Smart Care with AI" Feature Section

**Layout:** Two-column — Left: Phone mockup | Right: Text

#### Left Column (Phone Mockup)
- **Device:** Realistic iPhone mockup (dark frame)
- **Screen content:** "Smart Care" AI chat interface
  - AI bot avatar (green robot with leaf-shaped ears 🤖🌿)
  - Chat bubble: "Time to water your Monstera!"
  - Stats cards: Growth charts (green line graph 📈)
  - Weather card with sun icon ☀️
  - Message input bar at bottom

**Floating Elements around phone:**
- 💧 Water droplet icon (blue, top right of phone)
- ☁️ White fluffy cloud (right side)
- 💧 Another droplet (bottom right)
- ✦ Yellow sparkle star
- 🔵 Small colored dot accents (blue, orange, green)
- Dashed curved arrow lines connecting phone to floating elements (animated)

#### Right Column (Text)
- **Badge Pill:** `[ Smart Care with AI 🌿 ]` — green pill label with leaf icon
- **Heading:** "Never Let a Plant Die Again." — large, bold, dark green, ~48px
- **Body:** Short description: "Animated lines connect the phone to floating water droplet and sun icons"
- **CTA Button:** `[ Shop Now ]` — dark green pill button

---

### 4.6 "Join Our Green Community" Banner

**Layout:** Full-width banner strip at bottom

| Property | Value |
|---|---|
| **Background** | Dark green (`--color-green-dark`) |
| **Heading** | "Join Our Green Community" — white, bold |
| **Decorative** | Green leaves left and right edges, AI bot character (🤖🌿) on right |
| **Text Color** | White |

---

## 5. Decorative System

### Floating Leaves
- Multiple semi-transparent green leaf shapes scattered across backgrounds
- Animate with `float` keyframe animation (gentle up-down oscillation)
- Sizes: 24px – 60px, varied opacity (0.4–0.8)

### Sparkle Stars
- Yellow 4-pointed ✦ stars
- Appear near headings and hero area
- Subtle pulse or twinkle animation

### Blobs / Circles
- Soft pastel green or cream circles behind 3D images (plant, phone)
- No hard edges — use `border-radius: 50%` + soft gradient fill
- Size: 400–500px diameter

### Dashed Curved Lines (AI Section)
- SVG dashed arcs connecting phone to floating icons
- Animated dash-offset for "data flowing" effect

### Scattered Seeds / Pebbles
- Small brown oval shapes (seed icons) scattered in background
- Low opacity, decorative only

---

## 6. Interaction & Animation

| Element | Interaction | Animation |
|---|---|---|
| **Hero plant image** | Page load | Float up + fade in, 0.8s ease |
| **Watering can** | Idle | Gentle sway animation |
| **Water droplets** | Idle | Drip animation (fall + fade) |
| **Floating leaves** | Idle | Gentle float up/down loop |
| **CTA Button** | Hover | Scale 1.03, shadow deepens |
| **Category cards** | Hover | Scale 1.02, shadow lifts |
| **Sparkle stars** | Idle | Pulse scale (1 → 1.2 → 1) loop |
| **AI phone** | Scroll-in | Slide up from below + fade |
| **Dashed arcs (AI)** | Idle | Animated stroke-dashoffset |
| **Carousel dots** | Click | Active dot animates to pill shape |
| **Nav** | Scroll | Optional shadow appears on scroll |

---

## 7. Responsive Behaviour

### Mobile (`< 768px`)
- Single column layout for Hero (text stacked above image)
- Hero heading: ~36px
- Category cards: horizontal scroll (snap)
- AI section: phone above, text below
- Nav: hamburger → slide-in menu
- CTA buttons: full-width

### Tablet (`768–1024px`)
- Two-column hero with smaller image
- Category cards: 2 visible in row
- AI section: two-column maintained

---

## 8. Assets Required

| Asset | Format | Notes |
|---|---|---|
| 🌿 Logo leaf icon | SVG | Two-leaf motif, dark green |
| Monstera plant 3D render | PNG (transparent) | High-res, right-facing |
| Watering can 3D character | PNG (transparent) | Smiley face, mid-pour |
| Flower Plants photo | JPG/WebP | Red roses, warm gradient bg |
| Indoor Plants photo | JPG/WebP | Snake plant in white pot |
| Balcony Decor photo | JPG/WebP | Hanging baskets |
| AI Robot character | PNG/SVG | Green robot, leaf-ear design |
| iPhone mockup frame | SVG or PNG | Dark frame, transparent screen |
| Water droplet icon | SVG | Blue, 3D style |
| Sun icon | SVG | Yellow, illustrated |
| Cloud icon | SVG/PNG | White, fluffy cartoon |
| Seed/pebble shapes | SVG | Decorative background elements |

---

## 9. Page Sections — Full Order

```
1. ──────────────────────────────
   NAVIGATION BAR
   [Logo] ........... [Nav Links] [Cart]

2. ──────────────────────────────
   HERO SECTION  (Carousel: 5 slides)
   [Heading + CTA]    [3D Plant + Watering Can]
   ○ ● ○ ○ ○  (dots)

3. ──────────────────────────────
   OUR GREEN CATEGORIES
   [Heading]                [See All →]
   [Card] [Card] [Card] [Card →scroll]
   ○ ○ ● ○ ○  (dots)

4. ──────────────────────────────
   EVERYTHING YOU NEED
   [Heading + Search + Subscribe]
   [Product Grid: seeds / soil / spray / fert]

5. ──────────────────────────────
   SMART CARE WITH AI
   [Phone Mockup]    [Badge + Heading + CTA]
   (with floating icons + dashed arcs)

6. ──────────────────────────────
   JOIN OUR GREEN COMMUNITY
   (Dark green full-width banner)
```

---

## 10. Technical Stack (Recommended)

| Layer | Recommendation |
|---|---|
| **Framework** | next js + Tailwind CSS |
| **Animations** | Framer Motion (next js) or CSS keyframes |
| **Icons** | Custom SVGs + Lucide next js |
| **Fonts** | Google Fonts: Playfair Display + Poppins + DM Sans |
| **3D Assets** | Pre-rendered PNG with transparent backgrounds |
| **Carousel** | Swiper.js or CSS scroll-snap |
| **Hosting** | Vercel / Netlify |

---

*Document version: 1.0 — Generated from homepage design video analysis*
