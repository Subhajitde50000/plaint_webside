# Order Tracking Page
## Design Specification v1.0 — Hero Plant Storefront

> **Design intent:** Deliver a calm, reassuring post-purchase experience that lets customers track their plant order in real time — showing order status, shipment milestones, item details, and estimated delivery — reducing "Where is my order?" (WISMO) support load while building brand trust through every step of the journey.

---

## 1. Context & Goals

| Property | Value |
|---|---|
| **Page name** | Order Tracking |
| **Page type** | Post-purchase / transactional page |
| **URLs** | `/account/orders/[order-id]` (authenticated) · `/order-tracking?order=[id]&email=[email]` (guest) |
| **Primary goal** | Give customers instant, accurate visibility into where their order is |
| **Secondary goals** | Reduce WISMO support tickets; reinforce brand trust; surface relevant post-purchase actions (review, reorder, care tips) |
| **Audience** | Authenticated customers and guest shoppers who have placed an order |
| **Entry points** | Order confirmation email CTA · Profile → My Orders → Track Order · Shopify order status page redirect · Direct URL with order ID + email |
| **Surface** | E-commerce storefront — desktop-first, fully responsive |
| **Page density** | Links: ~40 · Buttons: ~12 · Cards: ~8 · Inputs: ~2 (guest lookup) |

---

## 2. Design Tokens & Foundations

### 2.1 Typography

| Token | Value | Usage |
|---|---|---|
| `font.family.primary` | `Outfit` | All UI text |
| `font.family.stack` | `Outfit, sans-serif` | CSS fallback |
| `font.size.base` | `16px` | Body reference |
| `font.weight.base` | `400` | Default weight |
| `font.lineHeight.base` | `22.4px` | Body line-height |
| `font.size.xs` | `11px` | Timestamps, sub-labels |
| `font.size.sm` | `12px` | Badge text, meta labels |
| `font.size.md` | `13px` | Helper text, captions |
| `font.size.lg` | `13.33px` | Secondary labels |
| `font.size.xl` | `14px` | Body copy, card content |
| `font.size.2xl` | `15px` | Section labels, step descriptions |
| `font.size.3xl` | `16px` | Step titles, card headings |
| `font.size.4xl` | `18px` | Section headings, order number |

**Typography role map:**

| Role | Size token | Weight | Line-height |
|---|---|---|---|
| Page heading | `font.size.4xl × 2` (~36px) | 700 | 1.2 |
| Order number | `font.size.4xl` | 700 | 1.3 |
| Section heading | `font.size.4xl × 1.5` (~27px) | 700 | 1.3 |
| Sub-section heading | `font.size.4xl` | 600 | 1.3 |
| Step title (active) | `font.size.3xl` | 700 | 1.3 |
| Step title (completed) | `font.size.3xl` | 600 | 1.3 |
| Step title (pending) | `font.size.3xl` | 400 | 1.3 |
| Step description | `font.size.2xl` | 400 | `font.lineHeight.base` |
| Step timestamp | `font.size.xs` | 400 | 1.3 |
| ETA heading | `font.size.4xl × 1.8` (~32px) | 800 | 1.1 |
| ETA sub-label | `font.size.xl` | 400 | 1.4 |
| Card title | `font.size.3xl` | 600 | 1.3 |
| Card body | `font.size.xl` | 400 | `font.lineHeight.base` |
| Product name | `font.size.3xl` | 600 | 1.3 |
| Product variant | `font.size.md` | 400 | 1.3 |
| Price | `font.size.3xl` | 700 | 1 |
| Badge / status | `font.size.sm` | 700 | 1 |
| Button label | `font.size.3xl` | 600 | 1 |
| Breadcrumb | `font.size.lg` | 400 | 1 |
| Guest input label | `font.size.md` | 600 | 1.3 |
| Guest input | `font.size.3xl` | 400 | 1 |
| Help link | `font.size.xl` | 500 | 1 |
| Carrier ID | `font.size.md` | 500 | 1 |

### 2.2 Color Palette

| Token | Hex | Usage |
|---|---|---|
| `color.surface.base` | `#000000` | Deep overlays |
| `color.text.secondary` | `#1c1c1c` | Primary headings, strong labels |
| `color.text.tertiary` | `#ffffff` | Text on green / dark surfaces |
| `color.text.inverse` | `#212326` | Body copy, secondary meta |
| `color.surface.raised` | `#00b566` | Brand green — active step, CTA, progress |
| `color.surface.strong` | `#fefcf9` | Page background, card background |

**Order tracking semantic aliases:**

| Alias | Maps to | Usage |
|---|---|---|
| `ot.page-bg` | `color.surface.strong` | Global page background |
| `ot.card-bg` | `color.surface.strong` | All content cards |
| `ot.card-border` | `color.text.secondary` @ 10% | Card border |
| `ot.heading` | `color.text.secondary` | All headings |
| `ot.body` | `color.text.inverse` | Body copy |
| `ot.meta` | `color.text.secondary` @ 45% | Timestamps, labels |
| `ot.divider` | `color.text.secondary` @ 10% | Section dividers |
| `ot.focus-ring` | `color.surface.raised` | Universal focus ring |
| `ot.cta-bg` | `color.surface.raised` | Primary CTA button |
| `ot.cta-text` | `color.text.tertiary` | Primary CTA label |
| `ot.progress-fill` | `color.surface.raised` | Progress bar and step connector fill |
| `ot.progress-track` | `color.surface.raised` @ 15% | Progress bar track |
| `ot.step-done-dot` | `color.surface.raised` | Completed step dot fill |
| `ot.step-active-dot` | `color.surface.raised` | Active step dot fill |
| `ot.step-active-ring` | `color.surface.raised` @ 30% | Active step pulse ring |
| `ot.step-pending-dot` | `color.text.secondary` @ 20% | Pending step dot |
| `ot.step-connector` | `color.text.secondary` @ 15% | Connector line track |
| `ot.step-connector-done` | `color.surface.raised` | Connector line filled portion |
| `ot.eta-bg` | `color.surface.raised` | ETA hero strip background |
| `ot.eta-text` | `color.text.tertiary` | ETA text on green bg |
| `ot.status-delivered` | `#16a34a` | Delivered status |
| `ot.status-shipped` | `#2563eb` | Shipped / in transit |
| `ot.status-processing` | `#d97706` | Processing / packed |
| `ot.status-cancelled` | `#dc2626` | Cancelled |
| `ot.status-returned` | `#7c3aed` | Returned |
| `ot.status-attempted` | `#ea580c` | Delivery attempted |
| `ot.star-fill` | `#c8a84b` | Star ratings (amber — one-off) |
| `ot.overlay-bg` | `color.surface.base` @ 55% | Modal backdrop |
| `ot.skeleton-base` | `color.text.secondary` @ 8% | Skeleton loading |
| `ot.skeleton-shine` | `color.text.tertiary` @ 60% | Skeleton shimmer |

### 2.3 Spacing Scale

| Token | Value | Composed |
|---|---|---|
| `space.1` | `1px` | — |
| `space.2` | `2px` | — |
| `space.3` | `3px` | Star gap |
| `space.4` | `5px` | Badge padding |
| `space.5` | `6px` | Inline icon gap |
| `space.6` | `8px` | Filter gap |
| `space.7` | `10px` | Base unit |
| `space.8` | `12px` | Card padding base |

> **Composed values:** `space.8 × 2 = 24px` · `space.8 × 3 = 36px` · `space.8 × 4 = 48px` · `space.8 × 6 = 72px` · `space.8 × 8 = 96px`

### 2.4 Border Radius

| Token | Value | Usage |
|---|---|---|
| `radius.xs` | `4px` | Status badges, micro chips |
| `radius.sm` | `8px` | Input fields, thumbnails |
| `radius.md` | `12px` | Content cards, map embed |
| `radius.lg` | `16px` | Large panels |
| `radius.xl` | `20px` | ETA strip, modal containers |
| `radius.step7` | `50px` | Icon buttons, step dots (large variant) |
| `radius.step8` | `9999px` | CTA buttons, pill badges |

### 2.5 Shadows

| Token | Value | Usage |
|---|---|---|
| `shadow.1` | `rgb(190, 234, 212) 0px 0px 0px 0px` | Resting (no elevation) |
| `shadow.2` | `rgb(202, 223, 212) 0px 0px 0px 1px inset` | Card default border |
| `shadow.3` | `rgb(212, 212, 212) 0px 0px 0px 1px inset` | Input default border |
| `shadow.4` | `rgb(0, 146, 82) 0px 0px 0px 1px inset` | Active / focused border |

**Composed shadows:**

| Name | Value | Usage |
|---|---|---|
| `card-shadow` | `0 4px 20px rgba(28, 28, 28, 0.06)` | Content card elevation |
| `modal-shadow` | `0 20px 60px rgba(0, 0, 0, 0.18)` | Modal overlay |
| `eta-glow` | `0 8px 40px rgba(0, 181, 102, 0.20)` | ETA strip ambient glow |
| `step-dot-active` | `0 0 0 6px rgba(0, 181, 102, 0.20)` | Active step pulse ring |

### 2.6 Motion

| Token | Value | Usage |
|---|---|---|
| `motion.duration.instant` | `200ms` | Hover, badge, toggle |
| `motion.duration.fast` | `250ms` | Step reveal, tab switch |
| `motion.duration.normal` | `300ms` | Modal open, section load |
| `motion.duration.slow` | `500ms` | Progress bar fill, page stagger |

---

## 3. Page Layout & Structure

### 3.1 Overall Structure

```
┌─────────────────────────────────────────────────────────────────┐
│  ANNOUNCEMENT BAR                                               │
├─────────────────────────────────────────────────────────────────┤
│  NAVIGATION BAR                                                 │
├─────────────────────────────────────────────────────────────────┤
│  BREADCRUMB                                                     │
├─────────────────────────────────────────────────────────────────┤
│  PAGE HEADER  (Order # · date · status badge)                   │
├─────────────────────────────────────────────────────────────────┤
│  ETA HERO STRIP  (estimated delivery + progress bar)            │
├──────────────────────────────┬──────────────────────────────────┤
│                              │                                  │
│  LEFT COLUMN  (60%)          │  RIGHT COLUMN  (40%)            │
│                              │                                  │
│  • Shipment Timeline         │  • Order Summary Card           │
│  • Map / Carrier Info        │  • Delivery Address Card        │
│  • Delivery Attempts         │  • Payment Summary Card         │
│                              │  • Need Help Card               │
│                              │                                  │
├──────────────────────────────┴──────────────────────────────────┤
│  ORDER ITEMS SECTION                                            │
├─────────────────────────────────────────────────────────────────┤
│  POST-PURCHASE ACTIONS  (review · reorder · care tips)          │
├─────────────────────────────────────────────────────────────────┤
│  RECOMMENDED PLANTS  (carousel)                                 │
├─────────────────────────────────────────────────────────────────┤
│  FOOTER                                                         │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Layout Rules

| Property | Value |
|---|---|
| Max content width | `1280px`, centred |
| Page background | `ot.page-bg` |
| Horizontal padding | `space.8 × 4 = 48px` desktop · `space.8 × 2 = 24px` tablet · `space.8 = 12px` mobile |
| Two-column gap | `space.8 × 3 = 36px` |
| Left column | `60%` width |
| Right column | `40%` width, sticky `top: 80px` (scrolls with page until viewport edge) |
| Card stack gap | `space.8 × 2 = 24px` between right column cards |

### 3.3 Breakpoints

| Breakpoint | Layout |
|---|---|
| `≥ 1280px` | Two-column, right column sticky |
| `1024–1279px` | Two-column, right column loses sticky |
| `768–1023px` | Stacked — left above, right below, full width |
| `< 768px` | Single column, ETA strip full-width, timeline vertical |
| `< 480px` | Compact — step labels below dots; cards reduced padding |

---

## 4. Navigation Bar

Shared component. For authenticated users — avatar shown. For guest trackers — standard nav.

```
[🌿 Hero]  [Plants▾][Supplies][AI Care][Garden Services]  [🔍][👤][🛒]
```

All properties inherit from the shared nav spec in `design-system.md §3.1`.

---

## 5. Breadcrumb

**Authenticated:**
```
Home  /  My Account  /  My Orders  /  Order #ORD-4821
```

**Guest:**
```
Home  /  Track Your Order
```

| Property | Value |
|---|---|
| Markup | `<nav aria-label="Breadcrumb">` → `<ol>` → `<li>` |
| Font | `font.size.lg`, weight 400, `ot.body` |
| Current page | Non-linked, weight 600, `ot.heading` |
| `aria-current` | `"page"` on last `<li>` |
| Margin | `space.8 × 2 = 24px` top, `space.8 = 12px` bottom |

---

## 6. Guest Order Lookup

For unauthenticated users who arrive via email link or direct URL without credentials.

### 6.1 Guest Lookup Form

Shown before any order data — full centred panel on first load.

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│   📦  Track Your Order                                   │
│                                                          │
│   Enter your order details to see the latest update.    │
│                                                          │
│   Order Number *                                         │
│   [ #ORD-4821                                      ]    │
│                                                          │
│   Email Address *                                        │
│   [ your@email.com                                 ]    │
│                                                          │
│   [ Track Order ]                                        │
│                                                          │
│   Have an account?  [ Sign In → ]                        │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Container max-width | `480px`, centred, `space.8 × 8 = 96px` vertical margin |
| Background | `ot.card-bg` |
| Border | `shadow.2` |
| Border-radius | `radius.xl` |
| Shadow | `card-shadow` |
| Padding | `space.8 × 4 = 48px` |
| Icon | 📦 `56×56px`, `color.surface.raised` @ 40%, centred top |
| Heading | `font.size.4xl × 1.5` (~27px), weight 700, `ot.heading`, centred |
| Subtext | `font.size.xl`, weight 400, `ot.meta`, centred |
| Input labels | `font.size.md`, weight 600, `ot.heading` |
| Inputs | `48px` height, `radius.sm`, `shadow.3` border, `font.size.3xl` |
| Input focus | `shadow.4` border + `0 0 0 3px color.surface.raised @ 15%` glow |
| CTA | `ot.cta-bg` filled, `radius.step8`, full-width, `52px` height, `font.size.3xl` weight 600 |
| "Sign In" link | `font.size.xl`, `color.surface.raised`, underline on hover |
| Field gap | `space.8 × 2 = 24px` |

**Validation rules:**
- Order number: required, must match format `#ORD-XXXX` or plain digits
- Email: required, valid email format
- Validate on blur per-field + full pass on submit

**Guest lookup states:**

| State | Behaviour |
|---|---|
| Empty form | CTA disabled, `aria-disabled="true"` |
| Validation error | Red border + `role="alert"` error message |
| Loading | CTA spinner, `aria-busy="true"` |
| Order not found | Error message below CTA: `"We couldn't find an order matching those details. Double-check your order number and email."` |
| Order found | Form collapses; full tracking page renders below, `motion.duration.normal` |
| Rate limited (5 failed attempts) | `"Too many attempts. Please try again in 15 minutes."` |

---

## 7. Page Header

```
Order #ORD-4821                               [ Delivered ✓ ]
Placed on Tuesday, 15 June 2026  ·  ₹1,248
```

| Property | Value |
|---|---|
| Order number | `font.size.4xl`, weight 700, `ot.heading` |
| Status badge | Right-aligned; inherits shared status badge component |
| Placed date | `font.size.xl`, weight 400, `ot.meta` |
| Order total | `font.size.xl`, weight 600, `ot.heading`, separated by `·` |
| Section padding | `space.8 × 3 = 36px` top, `space.8 × 2 = 24px` bottom |
| Border-bottom | `1px solid ot.divider` |

**Order total format:** `₹1,248` — always `₹` prefix, rounded rupees, no paise.

---

## 8. ETA Hero Strip

The most prominent element on the page — gives the customer the single most important piece of information: when will it arrive.

### 8.1 Layout

```
┌────────────────────────────────────────────────────────────────┐
│  🚚                                                            │
│  Arriving Tomorrow, Wednesday 18 June                          │
│  Between 10:00 AM – 6:00 PM                                    │
│                                                                │
│  ████████████████████░░░░░░   Out for Delivery                 │
│                                                                │
│  Order Placed ── Packed ── Dispatched ── Out for Delivery ──  Delivered
└────────────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Background | `ot.eta-bg` (`color.surface.raised`) |
| Shadow | `eta-glow` |
| Border-radius | `radius.xl` |
| Padding | `space.8 × 4 = 48px` desktop · `space.8 × 2 = 24px` mobile |
| Margin | `space.8 × 2 = 24px` top, `space.8 × 3 = 36px` bottom |
| Icon | 🚚 `48×48px` animated SVG (truck moves right subtly, 3s loop) |
| ETA heading | `font.size.4xl × 1.8` (~32px), weight 800, `ot.eta-text` |
| ETA sub-label | `font.size.xl`, weight 400, `ot.eta-text` @ 85%: time window |
| All text | `ot.eta-text` |
| Decorative leaves | Scattered leaf silhouettes, `ot.eta-text` @ 8%, `aria-hidden="true"` |

**ETA heading variants by status:**

| Order status | ETA heading |
|---|---|
| Order placed | `"Estimated delivery: Friday, 20 June"` |
| Processing / packing | `"Being prepared — arrives Friday, 20 June"` |
| Dispatched | `"On its way — arriving Thursday, 19 June"` |
| Out for delivery | `"Arriving today!"` or `"Arriving tomorrow, Wednesday 18 June"` |
| Delivered | `"Delivered on Tuesday, 15 June 🎉"` |
| Delivery attempted | `"Delivery attempted — reschedule below"` |
| Cancelled | `"Order cancelled"` — strip bg changes to `ot.meta` neutral |
| Returned | `"Return in progress"` — strip bg neutral |

**ETA accuracy note (below time window):**

```
⏱ Estimated window — actual time may vary slightly
```

`font.size.xs`, `ot.eta-text` @ 65%, italic, `aria-hidden="true"` (decorative note).

### 8.2 Progress Bar

A linear progress bar showing the order's position across all fulfilment stages.

```
0% ──── Order Placed ──── Packed ──── Dispatched ──── Out for Delivery ──── Delivered 100%
         ✓                ✓             ✓               ● Current                 ○
```

| Property | Value |
|---|---|
| Track height | `8px`, `radius.step8` |
| Track colour | `ot.eta-text` @ 20% |
| Fill colour | `ot.eta-text` (white on green bg) |
| Fill animation | Width `0→[%]`, `motion.duration.slow` ease-out, on page load |
| Progress markers | Circles at each stage, `12×12px` |
| Completed markers | Filled white circle, `ot.eta-text` |
| Active marker | Filled white + outer ring `ot.eta-text` @ 40% |
| Pending markers | Hollow circle, `ot.eta-text` @ 30% border |
| Stage labels | `font.size.xs`, `ot.eta-text` @ 80%, below each marker, centred |
| `aria-label` | `"Order progress: [n] of [total] steps completed. Current step: [step name]."` |
| `role` | `role="progressbar"`, `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"` |
| Mobile | Stage labels hidden; only current step shown; full bar visible |

**Fulfilment stages (5 steps):**

| Step | # | Label |
|---|---|---|
| 1 | `01` | Order Placed |
| 2 | `02` | Being Packed |
| 3 | `03` | Dispatched |
| 4 | `04` | Out for Delivery |
| 5 | `05` | Delivered |

---

## 9. Left Column — Shipment Timeline

### 9.1 Timeline Card Shell

| Property | Value |
|---|---|
| Background | `ot.card-bg` |
| Border | `shadow.2` |
| Border-radius | `radius.md` |
| Padding | `space.8 × 3 = 36px` |
| Shadow | `card-shadow` |
| Margin-bottom | `space.8 × 2 = 24px` |

### 9.2 Timeline Header

```
Shipment Updates
Carrier: Shiprocket  ·  Tracking ID: SR-8821-43XY
[ View on Shiprocket → ]
```

| Property | Value |
|---|---|
| Heading | `font.size.4xl`, weight 700, `ot.heading` |
| Carrier name | `font.size.xl`, weight 500, `ot.body` |
| Tracking ID | `font.size.md`, weight 600, `ot.heading`, monospace-style bg pill |
| Tracking ID pill | `radius.xs`, `color.surface.raised` @ 10% bg, `space.4` padding, `font.size.md` |
| Copy button | 📋 `18×18px` icon right of tracking ID, `aria-label="Copy tracking ID"` |
| Copy success | Icon turns ✓, `motion.duration.instant`; resets after `2000ms` |
| "View on Carrier" | `font.size.xl`, `color.surface.raised`, underline hover, opens in new tab with `rel="noopener noreferrer"` |
| Header border-bottom | `1px solid ot.divider`, `space.8 × 2` margin below |

### 9.3 Timeline Steps

A vertical timeline with milestones showing all tracking events from newest to oldest.

```
     ┃
     ● ← active dot with pulse ring
     │
10:32 AM ─ Out for Delivery                    ← Current step
     │   Your order is with the delivery agent
     │   Mumbai, MH
     ┃
     ● ← completed dot
     │
09:00 AM ─ Dispatched from Hub
     │   Andheri Sorting Centre, Mumbai
     ┃
     ● ← completed dot
     │
15 Jun 02:48 PM ─ Packed and Ready
     │   Warehouse: Pune Fulfilment Centre
     ┃
     ● ← completed dot
     │
15 Jun 10:24 AM ─ Order Placed
           Confirmed by Hero Plant Store
```

**Timeline container:**

| Property | Value |
|---|---|
| Layout | Vertical flex column |
| Direction | Newest event at top, oldest at bottom |
| `role` | `role="list"`, `aria-label="Shipment timeline"` |
| Each event | `role="listitem"` |

**Step dot:**

| Type | Size | Fill | Border | Animation |
|---|---|---|---|---|
| Completed | `16×16px` | `ot.step-done-dot` | None | None |
| Active (current) | `20×20px` | `ot.step-active-dot` | `6px` ring `ot.step-active-ring` | Pulse: ring expands 0→10px, opacity 1→0, `1.5s infinite` |
| Pending | `14×14px` | White | `2px solid ot.step-pending-dot` | None |

**Connector line:**

| Property | Value |
|---|---|
| Width | `2px` |
| Colour (done→done) | `ot.step-connector-done` |
| Colour (done→pending) | `ot.step-connector-done` top half, `ot.step-connector` bottom half |
| Colour (pending→pending) | `ot.step-connector` |
| Left-offset | Centred on dot column |
| Min-height | `40px` between dots |
| Animation | Fill animates downward on page load, `motion.duration.slow` |

**Step content:**

| Element | Token / Value |
|---|---|
| Timestamp | `font.size.xs`, weight 400, `ot.meta`, above step title |
| Step title (active) | `font.size.3xl`, weight 700, `ot.heading` |
| Step title (completed) | `font.size.3xl`, weight 600, `ot.body` |
| Step title (pending) | `font.size.3xl`, weight 400, `ot.meta` |
| Step description | `font.size.2xl`, weight 400, `ot.body`, `font.lineHeight.base` |
| Location | `font.size.md`, weight 400, `ot.meta`, with 📍 `12×12px` icon |
| Step left padding | `space.8 × 3 = 36px` (accounts for dot + connector column) |
| Step bottom margin | `space.8 × 2 = 24px` |

**Full timeline event types and labels:**

| Event | Label | Icon |
|---|---|---|
| Order placed | `"Order Confirmed"` | ✅ |
| Payment confirmed | `"Payment Successful"` | 💳 |
| Packed | `"Packed and Ready to Ship"` | 📦 |
| Picked up by carrier | `"Picked Up by [Carrier]"` | 🚚 |
| In transit | `"In Transit — [Hub Name]"` | 🏭 |
| Out for delivery | `"Out for Delivery"` | 🛵 |
| Delivery attempted | `"Delivery Attempted"` | ⚠️ |
| Delivered | `"Delivered Successfully"` | 🎉 |
| Return initiated | `"Return Initiated"` | ↩️ |
| Return picked up | `"Return Picked Up"` | 📤 |
| Refund processed | `"Refund Initiated"` | 💰 |
| Cancelled | `"Order Cancelled"` | ✕ |

**"Load older updates" link:**

If there are more than 6 timeline events, collapse oldest events.

| Property | Value |
|---|---|
| Label | `"+ [n] older updates"` |
| Font | `font.size.xl`, weight 500, `color.surface.raised` |
| Expand animation | Height reveal, `motion.duration.fast` |
| `aria-expanded` | On toggle button |

### 9.4 Delivery Attempt Card

Shown only when status is `"Delivery Attempted"`.

```
┌──────────────────────────────────────────────────────────────────┐
│  ⚠️  Delivery Attempted — 17 Jun, 2:30 PM                        │
│                                                                  │
│  Our delivery agent visited but couldn't complete delivery.      │
│  Reason: Customer not available                                  │
│                                                                  │
│  Next attempt: 18 Jun 2026                                       │
│                                                                  │
│  [ Reschedule Delivery ]     [ Change Delivery Address ]         │
└──────────────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Border-left | `4px solid ot.status-attempted` (#ea580c) |
| Background | `ot.status-attempted` @ 6% |
| Border-radius | `radius.md` |
| Padding | `space.8 × 2 = 24px` |
| Header icon | `⚠️` `20×20px` SVG, `ot.status-attempted` |
| Header text | `font.size.3xl`, weight 700, `ot.status-attempted` |
| Body | `font.size.xl`, weight 400, `ot.body` |
| Reason | `font.size.xl`, weight 600, `ot.heading` |
| CTA "Reschedule" | `ot.cta-bg` filled, `radius.step8`, `font.size.3xl` weight 600, height `44px` |
| CTA "Change Address" | Outlined, `shadow.3`, `radius.step8` |
| `role` | `role="alert"`, `aria-live="polite"` |

### 9.5 Carrier Map

An embedded static map or carrier's live tracking iframe, if supported.

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│   [  Map showing delivery route / agent's last location  ]    │
│                                                                │
│   🛵 Agent: Ramesh K.                                          │
│   📍 Last seen: Linking Road, Bandra, Mumbai                   │
│      Updated 3 mins ago                                        │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Map height | `280px` desktop · `200px` mobile |
| Border-radius | `radius.md` |
| Fallback | If map unavailable: show last known location as text only |
| Agent name | `font.size.xl`, weight 600, `ot.heading`, with 🛵 icon |
| Location | `font.size.md`, weight 400, `ot.body`, with 📍 icon |
| Last updated | `font.size.xs`, `ot.meta`: `"Updated [n] mins ago"` |
| Map `aria-label` | `"Delivery route map showing your order's current location"` |
| Map `role` | `role="img"` if static; `role="application"` if interactive |
| Map keyboard | If interactive map: must be operable by keyboard |
| Refresh button | `"↺ Refresh"` icon-text button, `font.size.md`, `color.surface.raised` |
| Refresh `aria-label` | `"Refresh delivery location"` |
| Auto-refresh | Every `60s` when status is "Out for Delivery"; `aria-live="polite"` on location text |

---

## 10. Right Column — Summary Cards

### 10.1 Order Summary Card

```
┌─────────────────────────────────────────────┐
│  Order Summary                              │
├─────────────────────────────────────────────┤
│  Subtotal                          ₹1,098   │
│  Delivery                             Free  │
│  Discount (HERO10)                   −₹110  │
│  Taxes                                ₹260  │
│  ─────────────────────────────────────────  │
│  Total                             ₹1,248   │
│  Paid via  Visa •••• 4821                   │
└─────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Card shell | Same as §9.1 (bg, border, radius, shadow, padding) |
| Section heading | `font.size.3xl`, weight 700, `ot.heading`, border-bottom `ot.divider` |
| Row label | `font.size.xl`, weight 400, `ot.body` |
| Row value | `font.size.xl`, weight 600, `ot.heading`, right-aligned |
| Discount row | Label and value in `color.surface.raised` |
| "Free" delivery | `color.surface.raised`, weight 600 |
| Divider | `1px solid ot.divider` |
| Total row | Label: `font.size.3xl` weight 700 `ot.heading`; value: `font.size.3xl` weight 800 `ot.heading` |
| Payment method | `font.size.md`, `ot.meta`, with card network icon `24×16px` |
| Row gap | `space.7 = 10px` |

### 10.2 Delivery Address Card

```
┌─────────────────────────────────────────────┐
│  Delivering To                              │
├─────────────────────────────────────────────┤
│  🏠  Priya Kumar                            │
│      42, Green Park Society, Baner          │
│      Pune — 411045, Maharashtra             │
│      📞 +91 98765 43210                     │
└─────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Card shell | Same as §9.1 |
| Section heading | Same as §10.1 |
| Address type icon | 🏠 or 🏢, `18×18px`, `color.surface.raised` |
| Recipient name | `font.size.3xl`, weight 600, `ot.heading` |
| Address lines | `font.size.xl`, weight 400, `ot.body`, line-height `font.lineHeight.base` |
| Phone | `font.size.xl`, `ot.meta`, with 📞 `14×14px` icon |
| `aria-label` | `"Delivery address"` on section |

### 10.3 Payment Summary Card

```
┌─────────────────────────────────────────────┐
│  Payment                                    │
├─────────────────────────────────────────────┤
│  💳  Visa ending 4821                        │
│      Amount paid: ₹1,248                    │
│      Status: [ Paid ✓ ]                     │
│                                             │
│  🏅  −50 Green Points used (₹5 off)         │
└─────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Card network icon | Visa/Mastercard/Rupay SVG, `32×20px` |
| Card label | `font.size.xl`, weight 500, `ot.body` |
| Amount | `font.size.xl`, weight 600, `ot.heading` |
| "Paid" badge | `ot.status-delivered` bg @ 12%, `ot.status-delivered` text, `radius.step8`, `font.size.sm` weight 700 |
| Loyalty usage | `font.size.md`, `color.surface.raised`, with 🏅 `14×14px` icon |
| `aria-label` | `"Payment details"` on section |

### 10.4 Need Help Card

```
┌─────────────────────────────────────────────┐
│  Need Help?                                 │
├─────────────────────────────────────────────┤
│  💬  Chat on WhatsApp                       │
│  📧  Email support@hero.com                 │
│  📞  +91 800 123 4567                       │
│                                             │
│  📋  Order ID: ORD-4821  (tap to copy)      │
│                                             │
│  Common questions:                          │
│  › My order is late                         │
│  › I want to cancel                         │
│  › Wrong item delivered                     │
└─────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Card shell | Same as §9.1 |
| Section heading | `font.size.3xl`, weight 700, `ot.heading` |
| Contact links | `font.size.xl`, weight 500, `color.surface.raised`, hover underline |
| Contact icons | `16×16px`, `color.surface.raised`, `space.5` gap |
| Order ID | `font.size.md`, weight 600, `ot.heading`, monospace pill |
| Copy tap | Same as §9.2 copy button behaviour |
| FAQ links | `font.size.xl`, weight 400, `ot.body`, `›` prefix, hover `color.surface.raised` |
| FAQ link `aria-label` | Descriptive: `"FAQ: My order is late"` |
| WhatsApp link | Opens `api.whatsapp.com` pre-filled with order number |

---

## 11. Order Items Section

Full-width section below the two-column layout, listing all items in the order.

### 11.1 Section Header

```
Items in This Order (3)                        [ Reorder All ]
```

| Property | Value |
|---|---|
| Heading | `font.size.4xl`, weight 700, `ot.heading` |
| Item count | Inline `ot.meta`, same font |
| "Reorder All" | Outlined CTA, `shadow.3` border, `radius.step8`, `font.size.3xl`, right-aligned |
| Margin top | `space.8 × 4 = 48px` |

### 11.2 Order Item Row

```
┌──────────────────────────────────────────────────────────────────┐
│  ┌──────────┐   Monstera Deliciosa                 ₹399 × 1    │
│  │          │   Size: Medium  ·  Pot: White Minimalist          │
│  │  [photo] │                                                   │
│  │          │   [ Write a Review ]   [ Buy Again ]              │
│  └──────────┘                                                   │
└──────────────────────────────────────────────────────────────────┘
```

**Item row shell:**

| Property | Value |
|---|---|
| Layout | Flex row, `space.8 × 2 = 24px` gap |
| Background | `ot.card-bg` |
| Border | `shadow.2` |
| Border-radius | `radius.md` |
| Padding | `space.8 × 2 = 24px` |
| Shadow | `card-shadow` |
| Margin-bottom | `space.8 = 12px` |

**Product thumbnail:**

| Property | Value |
|---|---|
| Size | `100×100px` desktop · `72×72px` mobile |
| Border-radius | `radius.sm` |
| Object-fit | `cover` |
| Loading | `loading="lazy"` |
| `alt` | `"[Product name] — [size] — [variant]"` |
| Fallback | Plant leaf placeholder, `color.surface.raised` @ 20% bg |

**Product details:**

| Element | Token / Value |
|---|---|
| Product name | `font.size.3xl`, weight 600, `ot.heading` |
| Variant line | `font.size.md`, weight 400, `ot.meta`: `"Size: Medium · Pot: White Minimalist"` |
| Price | `font.size.3xl`, weight 700, `ot.heading`, right-aligned |
| Qty | `font.size.xl`, weight 400, `ot.meta`: `"× 1"` after price |

**Item action buttons:**

| Button | Style | Visibility |
|---|---|---|
| Write a Review | Outlined `shadow.3`, `radius.step8`, `font.size.3xl`, height `40px` | Delivered only |
| Buy Again | Outlined `shadow.3`, `radius.step8`, `font.size.3xl` | All statuses |
| Return This Item | Text link, `ot.status-cancelled` colour | Delivered, within return window |

**"Already reviewed" state:**

When item has a review submitted, replace "Write a Review" with:

```
★★★★★  Your review  [ Edit ]
```

`font.size.sm` stars, `font.size.md` label, `font.size.md` edit link `color.surface.raised`.

**Plant care tip badge (unique to plant orders):**

```
🌿  Care tip: Water this plant weekly. [ View Full Care Guide ]
```

| Property | Value |
|---|---|
| Background | `color.surface.raised` @ 8% |
| Border | `shadow.4` |
| Border-radius | `radius.xs` |
| Padding | `space.4` vertical, `space.7` horizontal |
| Font | `font.size.md`, weight 400, `ot.body` |
| Icon | 🌿 `12×12px` |
| "View Care Guide" | `color.surface.raised`, underline, links to AI Care page with plant pre-loaded |
| Visibility | Always shown on delivered plant orders |

---

## 12. Post-Purchase Actions Section

A warm, action-rich strip that appears after delivery — or as contextual CTAs while in transit.

### 12.1 Status-Dependent Action Map

| Order status | Actions shown |
|---|---|
| Order placed | "View your wishlist while you wait" · "Explore care tips for your plant" |
| Packed / dispatched | "Share your order" · "Explore care tips" · "Browse plants for next time" |
| Out for delivery | "Get ready — Plant care guide" · "Who to contact if missed" |
| Delivered | "Rate your experience" · "Write a review" · "Reorder" · "Share your plants" |
| Delivery attempted | "Reschedule delivery" · "Change delivery address" · "Contact support" |
| Cancelled | "Reorder" · "Browse similar plants" · "Contact support" |
| Returned | "Browse plants" · "Contact support" · "View refund status" |

### 12.2 Action Cards (Delivered State)

```
┌──────────────────────────────────────────────────────────────────┐
│  🌿  Your plant has arrived! Here's what to do next.            │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ ⭐ Rate your  │  │ 📝 Write a   │  │ 🌱 Add to    │          │
│  │ experience   │  │ review       │  │ My Plants    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐                             │
│  │ 📱 Share on  │  │ 🔄 Reorder   │                             │
│  │ Instagram    │  │              │                             │
│  └──────────────┘  └──────────────┘                             │
└──────────────────────────────────────────────────────────────────┘
```

**Section strip:**

| Property | Value |
|---|---|
| Background | `color.surface.raised` @ 6% |
| Border | `shadow.4` |
| Border-radius | `radius.xl` |
| Padding | `space.8 × 3 = 36px` |
| Heading | `font.size.3xl`, weight 700, `ot.heading`, with 🌿 icon |
| Action card grid | 3-column desktop · 2-column mobile |
| Section margin | `space.8 × 4 = 48px` top |

**Single action card:**

| Property | Value |
|---|---|
| Background | `ot.card-bg` |
| Border | `shadow.2` |
| Border-radius | `radius.md` |
| Padding | `space.8 × 2 = 24px` |
| Icon | Emoji/SVG, `32×32px`, centred top |
| Label | `font.size.3xl`, weight 600, `ot.heading`, centred, margin-top `space.7` |
| Hover | `card-shadow`, `translateY(-2px)`, `motion.duration.fast` |
| Focus-visible | `2px` focus ring `ot.focus-ring` |
| Entire card | `role="link"` or wraps `<a>` |
| `aria-label` | Descriptive: `"Rate your experience with this order"` |

### 12.3 Share Your Plant Feature

For delivered orders — a shareable plant arrival moment.

```
┌────────────────────────────────────────────────┐
│  📸 Share your new plant!                      │
│                                                │
│  [Product image]  +  "My new Monstera arrived │
│                       from Hero Plants 🌿"     │
│                                                │
│  [ Share on WhatsApp ]  [ Copy link ]          │
└────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Pre-filled message | `"My new [plant name] just arrived from Hero Plants 🌿 [product-url]"` |
| WhatsApp share | `https://api.whatsapp.com/send?text=[encoded-message]` |
| Copy link | Copies product URL to clipboard; toast: `"Link copied!"` |
| Image | Product thumbnail `120×120px`, `radius.md` |

---

## 13. Recommended Plants Carousel

A personalised "You may also like" carousel, shown below post-purchase actions.

```
Plants Your Order Pairs Well With 🌿
Based on your Monstera, you might love these...
──────────────────────────────────────────────────────
[ Card ]  [ Card ]  [ Card ]  [ Card ] →
```

| Property | Value |
|---|---|
| Background | `color.surface.raised` @ 4% alternate bg |
| Section padding | `space.8 × 6 = 72px` vertical |
| Heading | `font.size.4xl`, weight 700, `ot.heading` |
| Sub-label | `font.size.xl`, `ot.meta` |
| Cards | Same as shared product card (PLP spec §10) |
| Layout | Horizontal scroll carousel, `scroll-snap-type: x mandatory` |
| Cards visible | 4 desktop · 3 tablet · 2 mobile |
| Prev/Next arrows | `44×44px`, `radius.step7`, `shadow.3` border |
| Arrow hover | `color.surface.raised` bg, `color.text.tertiary` |
| `aria-label` | `role="region"`, `aria-label="Recommended plants"` |
| Data logic | Carrier: same family → complementary plants → same price range |

---

## 14. Notifications & Real-Time Updates

### 14.1 Real-Time Status Update Banner

Appears at top of page when tracking status changes while user is viewing the page.

```
┌──────────────────────────────────────────────────────────────────┐
│  🔔  Update: Your order is now Out for Delivery!   [ Refresh ]  │
└──────────────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Background | `color.surface.raised` |
| Text | `color.text.tertiary`, `font.size.2xl`, weight 600 |
| Border-radius | `radius.md` |
| Padding | `space.7 × 1.5` vertical, `space.8 × 2` horizontal |
| Position | Sticky top, below nav, above page header |
| `role` | `role="alert"`, `aria-live="assertive"` |
| "Refresh" button | Text button, `color.text.tertiary`, underline |
| Dismiss | `×` button right-aligned |
| Auto-dismiss | After `8000ms` if user takes no action |

### 14.2 Push Notification Prompt

Shown once, after page load, if push notifications not yet granted.

```
┌────────────────────────────────────────────┐
│  🔔 Get delivery updates                   │
│  We'll notify you when your plant arrives. │
│  [ Enable Notifications ]  [ Not now ]     │
└────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Type | Bottom-right toast-style panel |
| Width | `320px` |
| Background | `ot.card-bg` |
| Border | `shadow.2` |
| Border-radius | `radius.lg` |
| Shadow | `card-shadow` |
| `role` | `role="dialog"`, `aria-modal="false"` |
| "Enable" | `color.surface.raised` filled, `radius.step8`, height `40px` |
| "Not now" | Text link, `ot.meta` |
| Show trigger | 3s after page load, only once per session |
| Hide | On either button click; does not reappear |

### 14.3 Polling / WebSocket Strategy

| Status | Update strategy |
|---|---|
| Out for Delivery | WebSocket preferred; HTTP polling every `30s` as fallback |
| All other statuses | HTTP polling every `5 min` |
| Delivered | No polling needed — stop all updates |
| Cancelled / Returned | No polling needed |
| Tab hidden | Pause polling; resume on tab focus |
| `aria-live` update | When status changes, update ETA strip + timeline `aria-live="polite"` |

---

## 15. Cancellation & Return Flows

### 15.1 Cancel Order Panel

Shown when order is in "Processing" status. Replaces the ETA strip CTA section.

```
┌──────────────────────────────────────────────────────────────────┐
│  Cancel this order?                                              │
│                                                                  │
│  This order hasn't been dispatched yet. You can cancel for a    │
│  full refund.                                                    │
│                                                                  │
│  Reason for cancellation (optional):                             │
│  [ Select a reason ▾ ]                                           │
│                                                                  │
│  [ Keep my order ]          [ Cancel Order ]                    │
└──────────────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Container | `radius.md`, `ot.status-cancelled` @ 6% bg, `4px solid ot.status-cancelled` border-left |
| Heading | `font.size.3xl`, weight 700, `ot.status-cancelled` |
| Body | `font.size.xl`, `ot.body` |
| Reason select | Shared select input component; options: Changed my mind · Found it cheaper · Wrong item · Delivery too slow · Other |
| "Keep my order" | Outlined, `shadow.3`, `radius.step8`, height `44px` |
| "Cancel Order" | `ot.status-cancelled` bg, `color.text.tertiary`, `radius.step8`, height `44px` |
| Confirm modal | Triggered by "Cancel Order" — confirm with `"Yes, Cancel Order"` destructive button |
| On confirm | Loading state → success message → ETA strip updates to "Order Cancelled" |
| `aria-label` | `"Cancel this order"` on cancel button |

**Cancellation success state:**

```
✓ Your order has been cancelled.
  A full refund of ₹1,248 will be processed to your Visa •••• 4821 within 5–7 business days.
```

`role="alert"`, `aria-live="assertive"`. Replaces cancel panel.

### 15.2 Return / Exchange Panel

Shown after delivery, within the return window (typically 7 days).

```
┌──────────────────────────────────────────────────────────────────┐
│  Return or Exchange                                              │
│  You have 7 days from delivery to initiate a return.            │
│                                                                  │
│  Select items to return:                                         │
│  [ ☐ ] Monstera Deliciosa — Medium   ₹399                      │
│  [ ☐ ] Peace Lily — Small            ₹249                      │
│                                                                  │
│  Reason *                                                        │
│  [ Select a reason ▾ ]                                           │
│                                                                  │
│  Return type:                                                    │
│  ( ● ) Refund to original payment method                        │
│  ( ○ ) Exchange for another item                                 │
│                                                                  │
│  [ Submit Return Request ]                                       │
└──────────────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Return window countdown | `"X days remaining to return"` — amber badge if ≤ 2 days |
| Item checkboxes | Shared checkbox component; `aria-label="Select [item name] for return"` |
| Reason options | Plant damaged on arrival · Wrong plant delivered · Changed my mind · Quality not as expected · Other |
| Return type | Radio buttons; `role="radiogroup"` |
| Submit CTA | `color.surface.raised` filled, full-width, `52px` |
| Submit loading | Spinner, `aria-busy="true"` |
| Success | Confirmation: `"Return request submitted. Our team will contact you within 24 hours."` |

---

## 16. Accessibility Requirements

### 16.1 Contrast Ratios

| Pairing | Ratio | Required | Status |
|---|---|---|---|
| `ot.heading` (#1c1c1c) on `ot.page-bg` (#fefcf9) | ~17:1 | 4.5:1 | ✅ Pass |
| `ot.eta-text` (#fff) on `ot.eta-bg` (#00b566) — weight 800, 32px | ~3.4:1 | 3:1 large | ✅ Pass |
| `ot.eta-text` (#fff) on `ot.eta-bg` — `font.size.xl` weight 400 | ~3.4:1 | 4.5:1 | ⚠️ Use weight 600+ for sub-label text |
| `ot.meta` (#1c1c1c @ 45%) on `ot.page-bg` | ~6:1 | 4.5:1 | ✅ Pass |
| Status badges: coloured text on 12% tinted bg | ~5–8:1 | 4.5:1 | ✅ Pass |
| `color.surface.raised` (#00b566) on `ot.page-bg` (#fefcf9) | ~3.7:1 | 3:1 large | ✅ Pass (links/large text only) |
| Tracking ID pill: `ot.heading` on `color.surface.raised` @ 10% | ~15:1 | 4.5:1 | ✅ Pass |

### 16.2 Focus Management

- Page load: focus set to page `<h1>` (Order Tracking heading) on full page loads
- Guest form submit: on success, focus moves to order tracking heading; on error, focus moves to first error field
- Modal open: focus moves to modal heading; Escape closes; focus returns to trigger
- Real-time update banner: `aria-live="assertive"` announced; focus does NOT move (non-disruptive)
- Copy tracking ID: focus stays on copy button; toast announces `"Tracking ID copied"` via `aria-live="polite"`
- "Load older updates" expand: focus stays on trigger; `aria-expanded` updates
- Cancel confirm modal: focus moves to "Keep my order" (safe action first) on open

### 16.3 Full ARIA Map

| Component | ARIA |
|---|---|
| Breadcrumb | `<nav aria-label="Breadcrumb">`, `<ol>`, `aria-current="page"` |
| Guest lookup form | `<form aria-label="Track your order">` |
| Guest input errors | `role="alert"`, `aria-live="polite"`, `aria-describedby` on inputs |
| Progress bar | `role="progressbar"`, `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"`, `aria-label` |
| ETA strip | `role="region"`, `aria-label="Estimated delivery"` |
| Timeline | `role="list"`, `aria-label="Shipment timeline"` |
| Timeline item | `role="listitem"` |
| Active step dot | `aria-current="step"` |
| Timeline expand | `<button>`, `aria-expanded`, `aria-controls` |
| Map embed | `role="img"` (static) or `role="application"` (interactive), `aria-label` |
| Refresh button | `aria-label="Refresh delivery location"` |
| Copy tracking ID | `aria-label="Copy tracking ID"` |
| Status badges | `aria-label="Order status: [status]"` |
| Real-time update banner | `role="alert"`, `aria-live="assertive"` |
| Push notification prompt | `role="dialog"`, `aria-modal="false"` |
| Cancel order form | `role="region"`, `aria-label="Cancel this order"` |
| Cancel confirm modal | `role="alertdialog"`, `aria-modal="true"`, `aria-labelledby`, `aria-describedby` |
| Return form checkboxes | `role="checkbox"`, `aria-checked`, `aria-label` per item |
| Return type radios | `role="radiogroup"`, `role="radio"` |
| "Write a Review" button | `aria-label="Write a review for [product name]"` |
| Recommendation carousel | `role="region"`, `aria-label="Recommended plants"` |
| Carousel arrows | `aria-label="Previous"` / `"Next"`, `aria-disabled` at ends |
| Order items section | `<section aria-label="Items in this order">` |
| Post-purchase actions | `<section aria-label="Next steps">`|

### 16.4 Keyboard Navigation Map

| Key | Behaviour |
|---|---|
| `Tab` | Moves through all interactive elements in DOM order |
| `Enter / Space` | Activates button, link, checkbox, radio |
| `Escape` | Closes modals, dismiss update banner, close push notification prompt |
| `Shift + Tab` | Reverses Tab direction |
| Arrow keys | Navigate radio groups (return type), carousel slides |
| `C` (custom) | (Optional) Copy tracking ID shortcut when copy button focused |

### 16.5 Testable Acceptance Criteria

| # | Criterion | Method | Pass |
|---|---|---|---|
| A1 | No contrast failures | axe DevTools | Zero critical |
| A2 | All focus rings visible (`2px solid #00b566`) | Manual Tab | Every element |
| A3 | Progress bar has `role="progressbar"` + `aria-valuenow` | Screen reader | Announced correctly |
| A4 | Active step has `aria-current="step"` | Screen reader | Step announced |
| A5 | Real-time update banner announced | Screen reader | `aria-live="assertive"` fires |
| A6 | Guest form error focus moves | Keyboard | First error field receives focus |
| A7 | Cancel confirm modal traps focus | Keyboard | Tab cycles inside modal only |
| A8 | Copy button announces success | Screen reader | Toast `aria-live="polite"` fires |
| A9 | Map has accessible name | Screen reader | `aria-label` read |
| A10 | Status badge text not colour-only | Screen reader | Text label in `aria-label` |
| A11 | Return checkboxes keyboard-operable | Keyboard | Space toggles, `aria-checked` updates |
| A12 | Carousel keyboard-navigable | Keyboard | Arrow keys advance slides |
| A13 | `prefers-reduced-motion` respected | OS setting | All animations removed |
| A14 | Guest lookup rate limit announced | Screen reader | `role="alert"` fires |
| A15 | Timeline expand button announces state | Screen reader | `aria-expanded` changes |

---

## 17. Content & Tone Standards

### 17.1 Status Messages

| Status | ETA heading | Timeline latest label |
|---|---|---|
| Order placed | `"Estimated delivery: [date]"` | `"Order Confirmed"` |
| Being packed | `"Being prepared — arrives [date]"` | `"Packed and Ready to Ship"` |
| Dispatched | `"On its way — arriving [date]"` | `"Picked Up by [Carrier]"` |
| Out for delivery | `"Arriving today!"` or `"Arriving tomorrow"` | `"Out for Delivery"` |
| Delivered | `"Delivered on [date] 🎉"` | `"Delivered Successfully"` |
| Attempted | `"Delivery attempted — [action]"` | `"Delivery Attempted"` |
| Cancelled | `"Order cancelled"` | `"Order Cancelled"` |
| Returned | `"Return in progress"` | `"Return Initiated"` |

### 17.2 CTA Labels

| Action | Label | Never use |
|---|---|---|
| Track externally | `"View on [Carrier]"` | `"Click here"`, `"Track here"` |
| Reschedule | `"Reschedule Delivery"` | `"Change date"`, `"Modify"` |
| Cancel | `"Cancel Order"` | `"Cancel"` alone |
| Keep order | `"Keep My Order"` | `"No"`, `"Back"` |
| Return | `"Submit Return Request"` | `"Submit"` alone |
| Copy | `"Copy"` (icon label) · `"Copied!"` (success) | — |

### 17.3 Empty / Error States

| State | Message |
|---|---|
| Order not found (guest) | `"We couldn't find an order matching those details. Double-check your order number and email."` |
| Tracking unavailable | `"Tracking details will appear here once your order is dispatched. Check back soon."` |
| Map unavailable | `"Live map unavailable. Here's your last known location: [location text]."` |
| No carrier data | `"Carrier tracking is being updated. Refresh in a few minutes."` |
| Carrier API timeout | `"We're having trouble fetching your tracking details. Try refreshing the page."` |

### 17.4 Date & Time Format

| Context | Format | Example |
|---|---|---|
| ETA heading | `Day, DD Month` | `Wednesday, 18 June` |
| ETA "tomorrow" | `"tomorrow, [Day DD Month]"` | `"tomorrow, Wednesday 18 June"` |
| ETA "today" | `"today!"` | — |
| Order placed date | `Day, DD Month YYYY` | `Tuesday, 15 June 2026` |
| Timeline events (today) | Time only | `10:32 AM` |
| Timeline events (past) | `DD Mon, HH:MM AM/PM` | `15 Jun, 10:24 AM` |
| Return window | `"X days remaining"` | `"5 days remaining"` |
| Auto-refresh | `"Updated [n] mins ago"` | `"Updated 3 mins ago"` |

---

## 18. Anti-Patterns & Prohibited Implementations

| Anti-pattern | Why prohibited | Correct approach |
|---|---|---|
| Raw hex `#00b566` in CSS | Breaks token system | Use `color.surface.raised` |
| `outline: none` on any element | Kills keyboard access | `outline: 2px solid color.surface.raised` always |
| Auto-refreshing page without warning | Loses user's scroll position | Use `aria-live` to announce status; refresh content in-place |
| Colour-only status indication | Fails WCAG 1.4.1 | Always pair colour with text label and icon |
| Progress bar without `role="progressbar"` | Screen reader can't interpret | Add full ARIA attributes |
| Active step dot animation without reduced-motion check | Vestibular disorders affected | Disable pulse animation on `prefers-reduced-motion: reduce` |
| ETA shown without accuracy disclaimer | Overpromises delivery | Always show `"Estimated — may vary"` note |
| Cancel action with no confirmation step | Irreversible action | Always show confirm modal with "Keep My Order" safe default |
| Tracking external link without `rel="noopener noreferrer"` | Security vulnerability | Always add `rel` attribute |
| Polling when tab is hidden | Wasted API calls | Pause polling on `document.visibilityState === "hidden"` |
| Rate limiting with no user feedback | User retries endlessly | Show clear `"Try again in [n] minutes"` message |
| Map `<iframe>` without title | Screen reader gets no context | `<iframe title="Delivery route map">` |
| Carrier tracking ID shown without copy button | Friction to share/report | Always include 📋 copy button |
| Guest form pre-filling order ID from URL without masking | Exposes order ID in viewport | Show last 4 digits: `"****4821"` — reveal on focus |
| Timeline showing all events without collapse | Overwhelming on large orders | Collapse beyond 6 events with "load older updates" |
| "Write a Review" shown before delivery | Cannot review undelivered item | Only show after `fulfillment_status === "delivered"` |

---

## 19. Edge-Case Handling

| Scenario | Behaviour |
|---|---|
| Order with 0 items (data error) | Show `"Error loading order details"` + "Contact Support" CTA |
| Guest order ID doesn't match email | `"We couldn't find an order matching those details."` error |
| Order placed but carrier not yet assigned | Timeline shows only "Order Confirmed"; tracking section shows `"Tracking details coming soon"` |
| Multiple shipments in one order | Show separate timeline card per shipment, tabbed or stacked |
| Carrier API timeout (> 10s) | Show last known status with `"Carrier tracking unavailable. Last updated: [time]"` |
| Order delivered but status not yet updated in system | Show ETA as `"Arriving today"` + note: `"If already received, it may take a few hours to update"` |
| Return window expired | Hide return button; show `"Return window closed on [date]"` in `ot.meta` |
| Partial delivery (some items missing) | Show "Items Delivered" count vs "Items Ordered" count; per-item delivery status |
| Very long product name (> 50 chars) | Truncate with ellipsis; full name in `title` attribute tooltip |
| Wrong address flagged by customer | Show "Address concern? Contact us" in delivery address card |
| Order cancelled after dispatch | Show full timeline up to dispatch; "Cancelled" step with reason |
| Refund status after cancellation | Add "Refund Status" card in right column: `"Processing — 5–7 business days"` |
| No internet connection mid-session | Toast: `"You're offline. Tracking updates paused."`, `role="status"` |
| Currency display for international orders | Use order's original currency; never convert |
| Plant care tip data unavailable | Hide care tip badge gracefully — no placeholder text |
| User shares order link | Must not expose sensitive data in shareable URL — use token-based link, not order ID + email |

---

## 20. Performance Specification

| Metric | Target |
|---|---|
| LCP | `< 2.5s` — ETA strip is LCP element; must render server-side |
| CLS | `< 0.1` — Reserve space for map, timeline, product images |
| INP | `< 200ms` — Status refresh, copy button, expand timeline |
| FCP | `< 1.8s` — Critical CSS inlined; order status above fold |
| TTFB | `< 600ms` — Order data fetched server-side; no client-side wait for status |

**Loading strategy:**

| Element | Strategy |
|---|---|
| ETA strip, page header, timeline (first 4 steps) | SSR — rendered on server, delivered with HTML |
| Right column cards | SSR |
| Product thumbnails in order items | `loading="lazy"`, `decoding="async"` |
| Carrier map | Client-side, lazy-loaded after main content |
| Recommendation carousel | Client-side, IntersectionObserver trigger |
| Real-time polling | Client-side, starts after page interactive |
| Guest form | Client-side — no SSR needed (page doesn't know identity yet) |

**Image strategy:**
- Product thumbnails: WebP + JPEG fallback, `srcset` at `2×` for retina
- All images: explicit `width` + `height` to prevent CLS
- Map tile images: handled by carrier embed or maps API

---

## 21. Analytics & Tracking Events

| Event name | Trigger | Properties |
|---|---|---|
| `order_tracking_view` | Page load | `order_id`, `order_status`, `is_guest: true/false` |
| `guest_lookup_attempt` | Guest form submit | `order_id_entered`, `success: true/false` |
| `guest_lookup_fail` | Guest form error | `reason: "not_found" / "rate_limited"` |
| `tracking_id_copy` | Copy tracking ID | `carrier`, `tracking_id` |
| `carrier_link_click` | "View on [Carrier]" | `carrier_name`, `order_id` |
| `timeline_expand` | "Load older updates" | `order_id`, `events_loaded` |
| `map_refresh` | Refresh button | `order_id`, `current_status` |
| `reschedule_init` | "Reschedule Delivery" | `order_id` |
| `cancel_init` | "Cancel Order" click | `order_id`, `order_status` |
| `cancel_confirm` | Confirm cancel modal submit | `order_id`, `reason` |
| `cancel_abandon` | "Keep My Order" | `order_id` |
| `return_init` | "Return / Exchange" | `order_id` |
| `return_submit` | Return form submit | `order_id`, `item_ids[]`, `reason`, `type: "refund/exchange"` |
| `review_start` | "Write a Review" | `order_id`, `product_id` |
| `reorder_click` | "Buy Again" / "Reorder All" | `order_id`, `product_ids[]` |
| `care_tip_click` | "View Care Guide" | `plant_name`, `order_id` |
| `share_click` | Share button | `platform: "whatsapp/copy"`, `order_id` |
| `push_prompt_accept` | "Enable Notifications" | `order_id` |
| `push_prompt_dismiss` | "Not now" | — |
| `real_time_update_seen` | Update banner appears | `old_status`, `new_status`, `order_id` |
| `recommendation_click` | Product card in carousel | `product_id`, `position`, `order_id` |

---

## 22. Page Sections — Full Structure

```
01  ANNOUNCEMENT BAR              — shared, promotional ticker
02  NAVIGATION BAR                — authenticated or guest
03  BREADCRUMB                    — contextual to auth state
    GUEST LOOKUP FORM             — only if unauthenticated + no order loaded
04  PAGE HEADER                   — order number, date, status badge
05  ETA HERO STRIP                — estimated delivery + progress bar
    ┌──────────────────────────────────────────────────────┐
    │ LEFT COLUMN (60%)           │ RIGHT COLUMN (40%)     │
    │                             │                        │
    │ 06 SHIPMENT TIMELINE        │ 10 ORDER SUMMARY CARD  │
    │    • Carrier info header    │ 11 DELIVERY ADDRESS    │
    │    • Timeline steps         │ 12 PAYMENT SUMMARY     │
    │    • "Load older" expand    │ 13 NEED HELP CARD      │
    │                             │                        │
    │ 07 CARRIER MAP              │ (right col sticky)     │
    │    • Agent location         │                        │
    │    • Auto-refresh           │                        │
    │                             │                        │
    │ 08 DELIVERY ATTEMPT CARD    │                        │
    │    (conditional — attempted)│                        │
    │                             │                        │
    │ 09 CANCEL ORDER PANEL       │                        │
    │    (conditional — processing│                        │
    └─────────────────────────────┴────────────────────────┘
14  ORDER ITEMS SECTION           — all items, per-item actions
15  POST-PURCHASE ACTIONS         — contextual by status
16  SHARE YOUR PLANT              — delivered state only
17  RECOMMENDED PLANTS CAROUSEL   — always shown
18  FOOTER                        — shared component
    REAL-TIME UPDATE BANNER       — conditional, top of page
    PUSH NOTIFICATION PROMPT      — conditional, bottom-right
    TOAST NOTIFICATION LAYER      — z: 400
    CANCEL CONFIRM MODAL          — conditional
    RETURN FORM PANEL             — conditional
```

---

## 23. Responsive Behaviour Summary

| Breakpoint | Layout changes |
|---|---|
| `≥ 1280px` | Two-column 60/40; right column sticky; progress bar with labels |
| `1024–1279px` | Two-column 60/40; right column not sticky |
| `768–1023px` | Single column; right cards stack below timeline; progress bar labels hidden |
| `< 768px` | Single column; ETA strip full-width; timeline compact (dots smaller); post-purchase 2-col grid |
| `< 480px` | All cards full-width; step labels below dots; action cards single-column |

---

## 24. QA Checklist

### Visual
- [ ] Page background: `color.surface.strong` (#fefcf9) throughout
- [ ] All text: `Outfit` font family, no fallbacks visible
- [ ] No raw hex values in CSS — tokens only
- [ ] ETA strip: `color.surface.raised` green bg, white text
- [ ] Progress bar: green fill animates on load, correct percentage
- [ ] Active step dot: green with pulse ring animation
- [ ] Completed step dots: solid green, smaller than active
- [ ] Pending step dots: grey hollow circles
- [ ] Connector lines: green for completed segments, grey for pending
- [ ] Status badges: correct colour per status with icon + text
- [ ] Tracking ID: monospace pill, green-tinted bg
- [ ] Right column cards: consistent shadow, border, radius
- [ ] Plant care tip badge: green tinted bg, green border
- [ ] Delivery attempt card: amber left border, amber text
- [ ] Cancellation panel: red left border, red heading

### Interaction
- [ ] Guest lookup: validates on blur + submit; error message shown; focus moves to error field
- [ ] Guest lookup success: form collapses; tracking page renders
- [ ] Copy tracking ID: button shows ✓, toast fires, resets after 2s
- [ ] "View on Carrier" opens in new tab
- [ ] "Load older updates" expands timeline, `aria-expanded` updates
- [ ] Map auto-refreshes every 60s when status is "Out for Delivery"
- [ ] Real-time update banner appears on status change, auto-dismisses after 8s
- [ ] Cancel button opens confirm modal; "Keep My Order" safe default has focus
- [ ] Cancel confirm submits, ETA strip updates to "Cancelled" state
- [ ] Return form: checkboxes selectable, reason required, submit triggers loading state
- [ ] Share button: WhatsApp opens with pre-filled message; copy shows toast
- [ ] Recommendation carousel: arrows advance; keyboard navigable
- [ ] Polling pauses on tab hidden; resumes on tab focus

### Accessibility
- [ ] axe DevTools: zero critical/serious errors
- [ ] All focus rings: `2px solid #00b566` on every interactive element
- [ ] Progress bar: `role="progressbar"`, `aria-valuenow`, `aria-label` correct
- [ ] Timeline: `role="list"`, `role="listitem"`, active step `aria-current="step"`
- [ ] Real-time banner: `role="alert"`, `aria-live="assertive"` fires
- [ ] Status badges: `aria-label` includes status text
- [ ] Map: `aria-label` present; keyboard-navigable if interactive
- [ ] Guest form errors: `aria-invalid`, `aria-describedby`, `role="alert"`
- [ ] Cancel modal: `role="alertdialog"`, focus trap, Escape closes
- [ ] Return checkboxes: `role="checkbox"`, `aria-checked`, `aria-label`
- [ ] Copy button: `aria-label` updates on success
- [ ] `prefers-reduced-motion`: all animations (pulse, progress fill, truck) disabled
- [ ] Breadcrumb: `aria-current="page"` on last item

### Content
- [ ] ETA heading matches correct template for each status
- [ ] Timeline labels match §17.1 event type map
- [ ] CTA labels match §17.2 exactly
- [ ] Date formats match §17.4 exactly
- [ ] Error messages match §19 edge-case spec
- [ ] No `"Click here"` or `"Learn more"` as standalone CTA labels
- [ ] Plant care tip visible on delivered plant orders

### Responsive
- [ ] No horizontal overflow at 320px viewport
- [ ] ETA strip full-width on mobile
- [ ] Right column cards stack below timeline on `< 768px`
- [ ] Progress bar labels hidden on mobile; bar still visible
- [ ] All touch targets ≥ 44×44px
- [ ] Timeline dots and connectors render correctly at all breakpoints

---

*Document version: 1.0 — Order Tracking Page*
*Guideline standard: WCAG 2.2 AA | Token system: Outfit / Hero brand token set*
*Companion documents: Homepage design.md · PLP design.md · PDP design.md · AI Care design.md · Garden Services design.md · Profile design.md · design-system.md*
*Last updated: June 2026*

---

## 25. SEO & Meta Specification

> Order tracking pages are transactional and must be fully excluded from search indexing while maintaining correct semantic HTML for screen readers and browser tooling.

### 25.1 Page-Level Meta Tags

| Tag | Value |
|---|---|
| `<title>` (authenticated) | `Order #ORD-4821 — Track Your Order · Hero Plant Store` |
| `<title>` (guest) | `Track Your Order · Hero Plant Store` |
| `meta description` | None — transactional page, no SEO value |
| `robots` | `noindex, nofollow` — must not be crawled |
| `canonical` | None — do not set canonical on authenticated/guest pages |
| `og:title` | None — no social sharing of order pages |
| `og:image` | None |
| `meta theme-color` | `#00b566` |
| `<link rel="preload">` | Preload Outfit font woff2; preload order status API call |

### 25.2 Heading Hierarchy

```
<h1>  Track Your Order                              (Page title — visually shown)
  <h2>  Order #ORD-4821 — Delivered                (Page header)
  <h2>  Arriving Tomorrow, Wednesday 18 June        (ETA strip — visually prominent)
  <h2>  Shipment Updates                            (Timeline card)
  <h2>  Order Summary                               (Right col card)
  <h2>  Delivering To                               (Right col card)
  <h2>  Payment                                     (Right col card)
  <h2>  Need Help?                                  (Right col card)
  <h2>  Items in This Order                         (Order items section)
    <h3>  Monstera Deliciosa                        (Each item name)
  <h2>  Your plant has arrived! Here's what to do  (Post-purchase actions)
  <h2>  Plants Your Order Pairs Well With           (Recommendation carousel)
```

**Rule:** `<h1>` must always be `"Track Your Order"` — never the order number alone (too generic for screen reader landmarks). The order number belongs in the `<h2>` page header.

### 25.3 Landmark Regions

| Landmark | Element | `aria-label` |
|---|---|---|
| Main navigation | `<nav>` | `"Main navigation"` |
| Breadcrumb | `<nav>` | `"Breadcrumb"` |
| Main content | `<main>` | — |
| ETA region | `<section>` | `"Estimated delivery"` |
| Shipment timeline | `<section>` | `"Shipment timeline"` |
| Order summary | `<aside>` or `<section>` | `"Order summary"` |
| Order items | `<section>` | `"Items in this order"` |
| Post-purchase | `<section>` | `"Next steps"` |
| Recommendations | `<section>` | `"Recommended plants"` |
| Footer | `<footer>` | — |

**Rule:** Must not have two unlabelled `<nav>` elements on the same page.

### 25.4 Structured Data (JSON-LD)

Order tracking pages should implement `Order` schema where data is available:

```json
{
  "@context": "https://schema.org",
  "@type": "Order",
  "orderNumber": "ORD-4821",
  "orderStatus": "https://schema.org/OrderDelivered",
  "orderDate": "2026-06-15T10:24:00+05:30",
  "seller": {
    "@type": "Organization",
    "name": "Hero Plant Store",
    "url": "https://www.heroplants.com"
  },
  "orderedItem": [
    {
      "@type": "OrderItem",
      "orderItemNumber": "1",
      "orderQuantity": 1,
      "orderedItem": {
        "@type": "Product",
        "name": "Monstera Deliciosa",
        "image": "https://cdn.heroplants.com/monstera-m.webp"
      }
    }
  ],
  "priceCurrency": "INR",
  "price": "1248"
}
```

**Order status schema values:**

| Store status | Schema value |
|---|---|
| Order placed | `schema:OrderProcessing` |
| Being packed | `schema:OrderProcessing` |
| Dispatched | `schema:OrderInTransit` |
| Out for delivery | `schema:OrderInTransit` |
| Delivered | `schema:OrderDelivered` |
| Cancelled | `schema:OrderCancelled` |
| Returned | `schema:OrderReturned` |

---

## 26. Order Status State Machine

> A formal definition of all possible order states, allowed transitions, and the UI impact of each. Every page variant must be derived from this state machine — no ad-hoc status handling.

### 26.1 State Definitions

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ORDER STATE MACHINE                              │
│                                                                     │
│  [ORDER_PLACED] ──────────────────────────────────┐                │
│       │                                           │                │
│       ▼                                           │                │
│  [PAYMENT_CONFIRMED]                              │ (payment fails) │
│       │                                           │                │
│       ▼                                           ▼                │
│  [PROCESSING / PACKING] ────────────────► [PAYMENT_FAILED]        │
│       │                    (cancel)               │                │
│       │ ◄──────────────────────────────────────── │                │
│       ▼                                                            │
│  [CANCELLED] ◄─── (cancel before dispatch)                        │
│                                                                    │
│  [DISPATCHED / IN_TRANSIT]                                        │
│       │                                                            │
│       ├──────────────────────────────────►[DELIVERY_ATTEMPTED]    │
│       │                  (missed delivery)        │                │
│       │                                           │ (reschedule)  │
│       │ ◄─────────────────────────────────────────┘               │
│       ▼                                                            │
│  [OUT_FOR_DELIVERY]                                               │
│       │                                                            │
│       ├──────────────────────────────────►[DELIVERY_ATTEMPTED]    │
│       │                                                            │
│       ▼                                                            │
│  [DELIVERED] ──────────────────────────►[RETURN_REQUESTED]       │
│                       (within window)             │               │
│                                                   ▼               │
│                                           [RETURN_IN_TRANSIT]     │
│                                                   │               │
│                                                   ▼               │
│                                           [RETURN_RECEIVED]       │
│                                                   │               │
│                                                   ▼               │
│                                           [REFUND_PROCESSED]      │
└─────────────────────────────────────────────────────────────────────┘
```

### 26.2 State → UI Mapping

| State | ETA Strip style | ETA heading | Progress % | Cancel shown | Return shown | Timeline colour |
|---|---|---|---|---|---|---|
| `ORDER_PLACED` | Green bg | `"Estimated delivery: [date]"` | 10% | ✅ | ❌ | 1/5 filled |
| `PAYMENT_CONFIRMED` | Green bg | `"Being prepared — arrives [date]"` | 20% | ✅ | ❌ | 2/5 filled |
| `PROCESSING` | Green bg | `"Being prepared — arrives [date]"` | 30% | ✅ | ❌ | 2/5 filled |
| `DISPATCHED` | Green bg | `"On its way — arriving [date]"` | 55% | ❌ | ❌ | 3/5 filled |
| `OUT_FOR_DELIVERY` | Green bg + truck anim | `"Arriving today!"` | 80% | ❌ | ❌ | 4/5 filled |
| `DELIVERY_ATTEMPTED` | Amber bg | `"Delivery attempted — reschedule below"` | 75% | ❌ | ❌ | Amber dot |
| `DELIVERED` | Green bg + 🎉 | `"Delivered on [date] 🎉"` | 100% | ❌ | ✅ (within window) | 5/5 filled |
| `CANCELLED` | Neutral grey bg | `"Order cancelled"` | 0% (grey) | ❌ | ❌ | Grey all |
| `RETURN_REQUESTED` | Neutral bg | `"Return in progress"` | — | ❌ | ❌ | Purple dot |
| `RETURN_IN_TRANSIT` | Neutral bg | `"Return in progress"` | — | ❌ | ❌ | Purple dots |
| `RETURN_RECEIVED` | Neutral bg | `"Return received"` | — | ❌ | ❌ | Purple complete |
| `REFUND_PROCESSED` | Green bg | `"Refund of ₹[amount] initiated"` | — | ❌ | ❌ | Green complete |
| `PAYMENT_FAILED` | Red bg | `"Payment failed — action required"` | 0% | ❌ | ❌ | Red dot |

### 26.3 ETA Strip Background by State

| State group | Background | Text |
|---|---|---|
| Active (placed → out for delivery) | `color.surface.raised` | `color.text.tertiary` |
| Delivered | `color.surface.raised` | `color.text.tertiary` |
| Delivery attempted | `#d97706` (amber, documented exception) | `color.text.tertiary` |
| Cancelled | `color.text.secondary` @ 15% | `color.text.secondary` |
| Return in progress | `color.text.secondary` @ 15% | `color.text.secondary` |
| Refund processed | `color.surface.raised` | `color.text.tertiary` |
| Payment failed | `#dc2626` (red, documented exception) | `color.text.tertiary` |

**Rule:** Amber and red ETA strip backgrounds are the only permitted exceptions to the green/neutral palette on this page. Both must be documented as semantic state tokens:

```json
"ot.eta-bg-attempted": "#d97706",
"ot.eta-bg-failed":    "#dc2626",
"ot.eta-bg-neutral":   "color.text.secondary @ 15%"
```

### 26.4 Post-Purchase Action Visibility Matrix

| Action | Placed | Processing | Dispatched | Out for del. | Delivered | Attempted | Cancelled |
|---|---|---|---|---|---|---|---|
| View wishlist | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Browse plants | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Care tips | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Share order | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |
| Rate experience | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Write a review | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Add to My Plants | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Reorder | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| Reschedule | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Contact support | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Cancel order | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Return / Exchange | ❌ | ❌ | ❌ | ❌ | ✅ (window) | ❌ | ❌ |

---

## 27. Shopify Liquid Integration Notes

### 27.1 Template Mapping

| Element | Shopify approach |
|---|---|
| Order tracking page (auth) | `templates/customers/order.liquid` |
| Order listing (profile) | `templates/customers/account.liquid` |
| Guest lookup | Custom page template + AJAX call to Order Status API |
| Order status | `{{ order.fulfillment_status }}` · `{{ order.financial_status }}` |
| Tracking number | `{{ fulfillment.tracking_number }}` |
| Carrier name | `{{ fulfillment.tracking_company }}` |
| Carrier URL | `{{ fulfillment.tracking_url }}` |
| Line items | `{% for line_item in order.line_items %}` |
| Order total | `{{ order.total_price | money }}` |
| Discount amount | `{{ order.total_discounts | money }}` |
| Shipping total | `{{ order.shipping_price | money }}` |
| Tax total | `{{ order.total_tax | money }}` |
| Payment gateway | `{{ order.gateway }}` |
| Shipping address | `{{ order.shipping_address }}` |
| Order created date | `{{ order.created_at | date: "%A, %d %B %Y" }}` |
| Fulfillment events | Via Shopify Admin API `GET /fulfillment_events.json` |

### 27.2 Key Shopify Liquid Objects

```liquid
{%- for fulfillment in order.fulfillments -%}
  {%- assign tracking_number = fulfillment.tracking_number -%}
  {%- assign tracking_company = fulfillment.tracking_company -%}
  {%- assign tracking_url = fulfillment.tracking_url -%}

  {%- for line_item in fulfillment.line_items -%}
    {{ line_item.title }}
    {{ line_item.variant_title }}
    {{ line_item.quantity }}
    {{ line_item.final_price | money }}
  {%- endfor -%}
{%- endfor -%}
```

### 27.3 Fulfillment Status Mapping

Map Shopify's native fulfillment statuses to the design spec state machine:

| Shopify `fulfillment_status` | Design spec state |
|---|---|
| `null` | `ORDER_PLACED` |
| `unfulfilled` | `PROCESSING` |
| `partial` | `DISPATCHED` (partial) |
| `fulfilled` | `DELIVERED` |
| `restocked` | `RETURN_RECEIVED` |
| `in_transit` (via carrier) | `IN_TRANSIT` |
| `out_for_delivery` (via carrier) | `OUT_FOR_DELIVERY` |
| `attempted_delivery` (via carrier) | `DELIVERY_ATTEMPTED` |

Shopify `financial_status` → payment state:

| Shopify `financial_status` | Design spec state |
|---|---|
| `pending` | `PAYMENT_CONFIRMED` |
| `authorized` | `PAYMENT_CONFIRMED` |
| `paid` | `PAYMENT_CONFIRMED` |
| `partially_paid` | `PAYMENT_CONFIRMED` |
| `refunded` | `REFUND_PROCESSED` |
| `partially_refunded` | `REFUND_PROCESSED` (partial) |
| `voided` | `CANCELLED` |

### 27.4 Real-Time Tracking Events

Shopify does not natively push fulfillment events in real time. Recommended approach:

| Option | Implementation | Use case |
|---|---|---|
| Shiprocket webhook | Receive carrier events → store in Shopify order notes/metafields | Production-grade |
| Shopify Flow | Trigger on fulfillment event → update metafield | Simple statuses |
| Third-party (AfterShip, Narvar) | Full-featured tracking with branded page | Enterprise |
| Polling Shopify Admin API | `GET /fulfillments/{id}/events.json` every 5 min | MVP / low traffic |

**Recommended for MVP:** Shiprocket webhook → Shopify order metafield `tracking.events` (JSON array) → frontend polls every `5 min` for non-live states, `30s` for `OUT_FOR_DELIVERY`.

### 27.5 Guest Order Lookup Implementation

Shopify's native order status page is at `/orders/[token]` — uses a unique order token (not the order number) for security.

For a custom guest lookup:

```javascript
// Client-side AJAX — POST to a Shopify proxy or custom endpoint
const response = await fetch('/apps/order-lookup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    order_number: '#ORD-4821',
    email: 'priya@email.com'
  })
});
// Server validates against Shopify Admin API:
// GET /orders.json?name=[order_number]&email=[email]
// Returns order token if match found
// Client redirects to /orders/[token]
```

**Security rules:**
- Rate-limit guest lookups: 5 attempts per IP per 15 minutes
- Never expose order token in error messages
- Never confirm whether an order number exists without matching email
- Log all lookup attempts for fraud monitoring

### 27.6 Return Request Implementation

Shopify does not have a native return request flow from the storefront. Options:

| Option | Approach |
|---|---|
| Loop Returns | Third-party app; full self-serve return portal |
| Custom form → email | Return request form submits to support email / Zendesk ticket |
| Shopify Admin API | Create refund/return via Admin API after manual approval |
| Shopify Markets (2024+) | Native return requests via Shopify Markets for eligible stores |

**Recommended for MVP:** Custom form → Zendesk/Freshdesk ticket creation via API. Return confirmation shown instantly; fulfilment handled manually until automation warrants a full app.

---

## 28. Component Migration Notes

### 28.1 Token Adoption Priority

| Priority | Token group | Risk if skipped |
|---|---|---|
| P0 — Critical | `color.surface.raised` (ETA bg, CTA, progress, active step) | Brand inconsistency; broken visual hierarchy |
| P0 — Critical | Focus ring `2px solid color.surface.raised` | WCAG failure; keyboard inaccessibility |
| P0 — Critical | `ot.status-*` tokens for status badges | Colour-only status; WCAG 1.4.1 failure |
| P1 — High | All `font.size.*` tokens | Typography inconsistency |
| P1 — High | `radius.xs` through `radius.step8` | Shape regressions |
| P2 — Medium | `shadow.1` through `shadow.4` | Elevation inconsistency |
| P2 — Medium | `motion.duration.*` | Animation timing inconsistency |
| P3 — Low | Composed `card-shadow`, `eta-glow`, `step-dot-active` | Polish only |

### 28.2 Raw Values to Replace

| Raw value | Replace with | Used in |
|---|---|---|
| `#00b566` | `color.surface.raised` | ETA bg, progress fill, CTA, step dots |
| `#1c1c1c` | `color.text.secondary` | Headings |
| `#212326` | `color.text.inverse` | Body copy |
| `#fefcf9` | `color.surface.strong` | Page bg, card bg |
| `#16a34a` | `ot.status-delivered` | Delivered badge |
| `#d97706` | `ot.status-processing` · `ot.eta-bg-attempted` | Processing badge, attempted ETA strip |
| `#2563eb` | `ot.status-shipped` | Shipped / in transit badge |
| `#dc2626` | `ot.status-cancelled` · `ot.eta-bg-failed` | Cancelled badge, failed ETA strip |
| `#7c3aed` | `ot.status-returned` | Returned badge |
| `#ea580c` | `ot.status-attempted` | Attempted delivery badge |
| `#c8a84b` | `ot.star-fill` | Star ratings |
| `border-radius: 9999px` | `radius.step8` | CTA buttons, badges |
| `border-radius: 50px` | `radius.step7` | Icon buttons |
| `border-radius: 12px` | `radius.md` | Cards |

### 28.3 Reused vs New Components

| Component | Source | Notes |
|---|---|---|
| Nav bar | `design-system.md §3.1` | No changes needed |
| Footer | `design-system.md §3.3` | No changes needed |
| Announcement bar | `design-system.md §3.2` | No changes needed |
| Breadcrumb | `design-system.md §3.16` | No changes needed |
| Primary CTA button | `design-system.md §3.4` | No changes needed |
| Secondary outlined button | `design-system.md §3.5` | No changes needed |
| Input field | `design-system.md §3.6` | Guest lookup only |
| Checkbox | `design-system.md §3.7` | Return form |
| Status badge | `design-system.md §3.11` | Order status, item status |
| Modal shell | `design-system.md §3.12` | Cancel confirm |
| Toast notification | `design-system.md §3.13` | Copy success, status updates |
| Skeleton loading | `design-system.md §3.14` | Order data loading |
| WhatsApp FAB | `design-system.md §3.15` | Persistent on all pages |
| Product card | `design-system.md §3.17` | Recommendation carousel |
| Star rating display | `design-system.md §3.9` | Order items review display |
| **ETA hero strip** | **New — order tracking only** | State-driven bg, heading, progress bar |
| **Shipment timeline** | **New — order tracking only** | Step dots, connector lines, event list |
| **Progress bar (fulfilment)** | **New — order tracking only** | `role="progressbar"`, 5-step |
| **Carrier map** | **New — order tracking only** | Static / live map embed |
| **Delivery attempt card** | **New — order tracking only** | Amber bordered alert |
| **Cancel order panel** | **New — order tracking only** | Red bordered, confirm modal |
| **Return request form** | **New — order tracking only** | Multi-item checkbox, reason select |
| **Plant care tip badge** | **New — order tracking only** | May be reused on PDP |
| **Order item row** | **Extension of profile order card** | Adds care tip, per-item review state |
| **Post-purchase action cards** | **New — order tracking only** | State-conditional grid |
| **Real-time update banner** | **New — order tracking only** | `role="alert"`, top-of-page |
| **Push notification prompt** | **Shared with profile** | Same component, different trigger |

---

## 29. Component State Master Table

> Every interactive component on the order tracking page with all required states. Teams must implement every state listed — no exceptions.

| Component | Default | Hover | Focus-visible | Active | Disabled | Loading | Error | Success |
|---|---|---|---|---|---|---|---|---|
| Guest lookup input | `shadow.3` border | Darken border | `shadow.4` + focus glow | — | `shadow.1`, muted bg | — | Red border + `role="alert"` | — |
| Guest lookup CTA | `color.surface.raised` bg | Darken 10% | `2px` focus ring | Scale `0.98` | `opacity: 0.4`, `aria-disabled` | Spinner, `aria-busy` | Error toast | Form collapses, tracking reveals |
| Copy tracking ID | 📋 icon, `ot.meta` | `color.surface.raised` | `2px` focus ring | — | — | — | — | ✓ icon, `motion.duration.instant`; resets `2000ms` |
| "View on Carrier" link | `color.surface.raised`, no underline | Underline appears | `2px` focus ring | — | — | — | — | — |
| Map refresh button | `ot.meta` icon + label | `color.surface.raised` | `2px` focus ring | Scale `0.95` | `opacity: 0.4` | Spinner | Error toast | Location text updates |
| "Load older updates" | `color.surface.raised`, no underline | Underline | `2px` focus ring | — | — | — | — | Timeline expands, `aria-expanded` → `true` |
| Progress bar | Static at current % | — | `2px` focus ring (if interactive) | — | — | Fill animates on load | — | 100% fill, green throughout |
| Active step dot | Green + pulse ring | — | `2px` focus ring | — | — | — | — | — |
| Reschedule CTA | `color.surface.raised` bg | Darken 10% | `2px` focus ring | Scale `0.98` | — | Spinner | Error toast | Confirmation message |
| "Change Address" outlined | Transparent, `shadow.3` | `color.surface.raised` bg | `2px` focus ring | Scale `0.98` | — | Spinner | Error toast | Address updated toast |
| Cancel order (panel) | `ot.status-cancelled` bg panel | — | — | — | — | — | — | — |
| "Cancel Order" button | `ot.status-cancelled` bg | Darken 10% | `2px` focus ring `ot.status-cancelled` | Scale `0.98` | `opacity: 0.4` | Spinner | Error toast | Confirm modal opens |
| Cancel confirm modal | Scale `0.96→1` + fade | — | — | — | — | — | — | — |
| "Keep My Order" (modal) | `shadow.3` outlined | `color.surface.raised` bg, white text | `2px` focus ring | Scale `0.98` | — | — | — | Modal closes |
| "Yes, Cancel" (modal) | `ot.status-cancelled` bg | Darken 10% | `2px` focus ring | Scale `0.98` | — | Spinner, `aria-busy` | Error toast | ETA updates to "Cancelled" |
| Return checkbox (item) | `shadow.3`, white bg | `shadow.4` | `2px` focus ring | — | `shadow.1`, muted | — | — | `color.surface.raised` fill + ✓ |
| Return reason select | `shadow.3` | Darken border | `shadow.4` + focus glow | — | `shadow.1` | — | Red border + error msg | — |
| Return type radio | Hollow circle | Fill to hover | `2px` focus ring | — | Muted | — | — | `color.surface.raised` fill |
| "Submit Return" CTA | `color.surface.raised` bg, full-width | Darken 10% | `2px` focus ring | Scale `0.98` | `opacity: 0.4` (no items selected) | Spinner | Error toast | Success message replaces form |
| "Write a Review" | `shadow.3` outlined | `shadow.4`, slight bg | `2px` focus ring | Scale `0.98` | Hidden (not delivered) | — | — | Opens review modal |
| "Buy Again" | `shadow.3` outlined | `shadow.4`, slight bg | `2px` focus ring | Scale `0.98` | — | Spinner (adding to cart) | Error toast | Cart count increments, toast |
| "Return This Item" link | `ot.status-cancelled`, no underline | Underline | `2px` focus ring | — | Hidden (outside window) | — | — | — |
| Post-purchase action card | `shadow.2`, `card-bg` | `card-shadow`, `translateY(-2px)` | `2px` focus ring | — | — | — | — | — |
| Share on WhatsApp | `shadow.2` card | `card-shadow` | `2px` focus ring | — | — | — | — | Opens WhatsApp |
| Copy link (share) | `shadow.2` card | `card-shadow` | `2px` focus ring | — | — | — | — | Toast: `"Link copied!"` |
| Real-time update banner | Slides down from top | — | `2px` focus ring on actions | — | — | — | — | — |
| Banner dismiss (×) | `color.text.tertiary` @ 70% | `color.text.tertiary` | `2px` white focus ring | Scale `0.95` | — | — | — | Banner slides up, removed |
| Push prompt "Enable" | `color.surface.raised` bg | Darken 10% | `2px` focus ring | Scale `0.98` | — | — | — | Prompt dismissed; browser permission requested |
| Push prompt "Not now" | `ot.meta` text link | `ot.heading` + underline | `2px` focus ring | — | — | — | — | Prompt dismissed |
| Carousel arrow (prev/next) | `shadow.3`, icon `ot.body` @ 60% | `color.surface.raised` bg, white icon | `2px` focus ring | Scale `0.95` | `opacity: 0.3`, `aria-disabled` | — | — | — |
| "Reorder All" outlined | `shadow.3` outlined | `shadow.4`, slight bg | `2px` focus ring | Scale `0.98` | — | Spinner | Error toast | All items added, cart count updates |
| WhatsApp FAB | `#25D366`, `fab-shadow` | Scale `1.08` | `2px` focus ring | Scale `0.96` | — | — | — | Opens WhatsApp |
| Carrier link (help card) | `color.surface.raised`, no underline | Underline | `2px` focus ring | — | — | — | — | — |
| FAQ links (help card) | `ot.body`, no underline | `color.surface.raised` + underline | `2px` focus ring | — | — | — | — | — |

---

## 30. Reduced Motion Specification

All animations must respect `prefers-reduced-motion: reduce`. Implementation is mandatory — not optional.

### 30.1 Animation Removal Map

| Animation | With motion | Without motion |
|---|---|---|
| Progress bar fill on load | `width: 0 → [%]`, `motion.duration.slow` ease-out | Instant final width, no transition |
| Active step dot pulse ring | `box-shadow` expand + fade, `1.5s infinite` | Ring hidden entirely; dot remains static |
| Connector line fill | Height animation downward, `motion.duration.slow` | Instant final state, all connectors static |
| ETA truck icon sway | Subtle `translateX` loop, `3s infinite` | Static truck icon, no movement |
| Card hover `translateY(-2px)` | `transform: translateY(-2px)`, `motion.duration.fast` | No transform; colour/border change only |
| Page load section stagger | Stagger `fadeUp` + `translateY`, `motion.duration.slow` | Instant opacity, no translate |
| Skeleton shimmer | `shimmer` keyframe, `1.5s infinite` | Static `ot.skeleton-base` colour; no shimmer |
| Guest form collapse on success | `height: auto → 0` + fade, `motion.duration.normal` | Instant `display: none` |
| Tracking reveal on guest success | Slide down + fade, `motion.duration.normal` | Instant appearance |
| Cancel confirm modal open | Scale `0.96→1` + fade, `motion.duration.normal` | Opacity only, no scale |
| Real-time banner slide in | `translateY(-100%→0)` + fade | Instant appearance |
| Timeline step expand | Height animation, `motion.duration.fast` | Instant `display: block` |
| Recommendation carousel scroll | `scroll-behavior: smooth` | `scroll-behavior: auto` |
| Toast slide up | `translateY(100%→0)` + fade | Instant appearance |

### 30.2 CSS Implementation

```css
/* Applied globally — see design-system.md §2.6 */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Order-tracking-specific reduced motion overrides */
@media (prefers-reduced-motion: reduce) {
  .ot-step-dot-active .ot-pulse-ring {
    display: none;
  }
  .ot-progress-bar-fill {
    width: var(--progress-target) !important;
    transition: none !important;
  }
  .ot-truck-icon {
    animation: none !important;
  }
  .ot-connector-line {
    height: var(--connector-target) !important;
    transition: none !important;
  }
}
```

---

## 31. Internationalisation (i18n) Notes

### 31.1 Currency & Number Formatting

| Format | Rule | Example |
|---|---|---|
| Currency | `₹` prefix, no paise | `₹1,248` |
| Large amounts | Indian numbering | `₹1,00,000` |
| Order total | Always show full amount | `₹1,248` not `₹1.2k` |
| Refund amount | Must match order total exactly | `"₹1,248 will be refunded"` |

### 31.2 Date & Time Formatting

| Context | Format | Example |
|---|---|---|
| ETA heading (specific date) | `Day, DD Month` | `Wednesday, 18 June` |
| ETA heading (today) | `"today!"` | — |
| ETA heading (tomorrow) | `"tomorrow, Day DD Month"` | `"tomorrow, Wednesday 18 June"` |
| Timeline event (today) | `HH:MM AM/PM` | `10:32 AM` |
| Timeline event (this week) | `DDD HH:MM AM/PM` | `Mon 10:32 AM` |
| Timeline event (older) | `DD Mon, HH:MM AM/PM` | `15 Jun, 10:24 AM` |
| Order placed date | `Day, DD Month YYYY` | `Tuesday, 15 June 2026` |
| Return window | `"X days remaining"` | `"5 days remaining"` |
| Return window (urgent) | `"Only X day(s) left"` in amber | `"Only 2 days left"` |
| Auto-refresh label | `"Updated X mins ago"` | `"Updated 3 mins ago"` |
| Auto-refresh (just now) | `"Updated just now"` | — |

### 31.3 i18n Key Structure

```json
{
  "ot.page.title": "Track Your Order",
  "ot.guest.heading": "Track Your Order",
  "ot.guest.subtext": "Enter your order details to see the latest update.",
  "ot.guest.order_number_label": "Order Number",
  "ot.guest.email_label": "Email Address",
  "ot.guest.cta": "Track Order",
  "ot.guest.signin": "Have an account? Sign In",
  "ot.guest.not_found": "We couldn't find an order matching those details. Double-check your order number and email.",
  "ot.guest.rate_limited": "Too many attempts. Please try again in {{minutes}} minutes.",
  "ot.eta.arriving_today": "Arriving today!",
  "ot.eta.arriving_tomorrow": "Arriving tomorrow, {{day}} {{date}}",
  "ot.eta.arriving_date": "Arriving {{day}}, {{date}}",
  "ot.eta.delivered": "Delivered on {{date}} 🎉",
  "ot.eta.attempted": "Delivery attempted — reschedule below",
  "ot.eta.cancelled": "Order cancelled",
  "ot.eta.return_progress": "Return in progress",
  "ot.eta.refund": "Refund of {{amount}} initiated",
  "ot.progress.aria_label": "Order progress: {{completed}} of {{total}} steps completed. Current step: {{current_step}}.",
  "ot.timeline.load_older": "+ {{count}} older updates",
  "ot.copy.label": "Copy",
  "ot.copy.success": "Copied!",
  "ot.copy.aria_copied": "Tracking ID copied to clipboard",
  "ot.cancel.heading": "Cancel this order?",
  "ot.cancel.body": "This order hasn't been dispatched yet. You can cancel for a full refund.",
  "ot.cancel.keep": "Keep My Order",
  "ot.cancel.confirm": "Yes, Cancel Order",
  "ot.cancel.success": "Your order has been cancelled. A full refund of {{amount}} will be processed to your {{payment_method}} within {{days}} business days.",
  "ot.return.window": "{{days}} days remaining to return",
  "ot.return.window_urgent": "Only {{days}} day(s) left to return",
  "ot.return.submit": "Submit Return Request",
  "ot.return.success": "Return request submitted. Our team will contact you within 24 hours.",
  "ot.items.heading": "Items in This Order ({{count}})",
  "ot.reorder_all": "Reorder All",
  "ot.care_tip": "Care tip: {{tip}}",
  "ot.care_tip.link": "View Full Care Guide",
  "ot.share.heading": "Share your new plant!",
  "ot.share.message": "My new {{plant_name}} just arrived from Hero Plants 🌿 {{product_url}}",
  "ot.share.whatsapp": "Share on WhatsApp",
  "ot.share.copy": "Copy link",
  "ot.share.link_copied": "Link copied!",
  "ot.help.heading": "Need Help?",
  "ot.realtime.update": "Update: Your order is now {{new_status}}!",
  "ot.push.heading": "Get delivery updates",
  "ot.push.body": "We'll notify you when your plant arrives.",
  "ot.push.enable": "Enable Notifications",
  "ot.push.dismiss": "Not now"
}
```

---

## 32. Final Summary — Section Map

```
Order Tracking Page — 32 Sections
─────────────────────────────────────────────────────────────────
CORE SPEC (§1–§24)
§1   Context & Goals
§2   Design Tokens (Typography, Color, Spacing, Radius, Shadow, Motion)
§3   Page Layout & Structure
§4   Navigation Bar
§5   Breadcrumb
§6   Guest Order Lookup (form, validation, states)
§7   Page Header (order number, date, status)
§8   ETA Hero Strip (heading variants, progress bar, truck animation)
§9   Left Column — Shipment Timeline
      • Timeline card shell
      • Timeline header (carrier, tracking ID, copy button)
      • Timeline steps (dots, connectors, event types)
      • Load older updates
      • Delivery attempt card
      • Carrier map (static/live, auto-refresh)
      • Cancel order panel
§10  Right Column — Order Summary Card
§11  Right Column — Delivery Address Card
§12  Right Column — Payment Summary Card
§13  Right Column — Need Help Card
§14  Order Items Section (item rows, plant care tip, review states)
§15  Post-Purchase Actions (status matrix, action cards, share feature)
§16  [merged into §15]
§17  Recommended Plants Carousel
§18  Notifications & Real-Time Updates (update banner, push prompt, polling)
§19  Cancellation & Return Flows (cancel panel, return form)
§20  [merged into §19]
§21  Accessibility Requirements (contrast, focus, ARIA map × 23, keyboard, criteria × 15)
§22  Content & Tone Standards (status messages, CTAs, error states, date formats)
§23  Anti-Patterns & Prohibited Implementations (× 16)
§24  Edge-Case Handling (× 18)
     Performance Specification (LCP/CLS/INP targets, loading strategy)
     Analytics & Tracking Events (× 21 events)
     QA Checklist (× 45 checkboxes)

EXTENDED IMPLEMENTATION GUIDE (§25–§32)
§25  SEO & Meta (noindex, heading hierarchy, landmark regions, JSON-LD Order schema)
§26  Order Status State Machine (state diagram, state→UI mapping, ETA bg variants,
      post-purchase action visibility matrix)
§27  Shopify Liquid Integration (template mapping, Liquid objects, fulfillment status
      mapping, real-time tracking approach, guest lookup security, return implementation)
§28  Component Migration Notes (token priority, raw value replacement table,
      reused vs new component registry)
§29  Component State Master Table (× 32 components × 8 states)
§30  Reduced Motion Specification (× 14 animations mapped, CSS implementation)
§31  Internationalisation (currency/date formats, i18n key structure × 35 keys)
§32  Final Summary — Section Map (this section)
─────────────────────────────────────────────────────────────────
Total: ~2,100 lines | WCAG 2.2 AA | Outfit token system
Companion docs: Homepage · PLP · PDP · AI Care · Garden Services · Profile · design-system.md
Last updated: June 2026
```

---

*Document version: 1.0 (complete) — Order Tracking Page*
*Sections: 1–24 (core spec) + 25–32 (extended implementation guide)*
*Guideline standard: WCAG 2.2 AA | Token system: Outfit / Hero brand token set*
*Companion documents: Homepage design.md · PLP design.md · PDP design.md · AI Care design.md · Garden Services design.md · Profile design.md · design-system.md*
*Last updated: June 2026*
