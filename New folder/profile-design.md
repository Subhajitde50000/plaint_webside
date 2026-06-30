# User Profile Page
## Design Specification v1.0 — Hero Plant Storefront

> **Design intent:** Deliver a warm, plant-lover-first account dashboard that consolidates order tracking, wishlist, plant care history, address management, and loyalty rewards into a single trusted space — using the full brand token system, a persistent sidebar-driven layout, and WCAG 2.2 AA accessible interactions throughout.

---

## 1. Context & Goals

| Property | Value |
|---|---|
| **Page name** | My Profile / Account Dashboard |
| **Page type** | Authenticated user account page |
| **Example URL** | `/account` |
| **Primary goal** | Give users instant visibility into orders, wishlist, and saved plants |
| **Secondary goals** | Manage addresses, edit personal info, view loyalty points, access plant care history |
| **Audience** | Returning authenticated customers — plant buyers, gift-givers, corporate clients |
| **Surface** | E-commerce storefront — desktop-first, fully responsive |
| **Auth gate** | Unauthenticated users redirect to `/account/login` |
| **Page density** | Links: ~120 · Buttons: ~45 · Cards: ~30 · Inputs: ~24 · Tables: ~3 |

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
| `font.size.xs` | `9px` | Legal micro-labels, timestamps |
| `font.size.sm` | `11px` | Badge text, status chips |
| `font.size.md` | `12px` | Helper text, table captions |
| `font.size.lg` | `13px` | Sidebar nav links, meta labels |
| `font.size.xl` | `13.33px` | Secondary UI labels |
| `font.size.2xl` | `14px` | Body copy, card content |
| `font.size.3xl` | `15px` | Section labels, form labels |
| `font.size.4xl` | `16px` | Card headings, CTA labels |

**Typography role map:**

| Role | Size token | Weight | Line-height |
|---|---|---|---|
| User display name (hero) | `font.size.4xl × 2` (~32px) | 700 | 1.2 |
| User email / meta | `font.size.2xl` | 400 | 1.4 |
| Section heading | `font.size.4xl × 1.5` (~24px) | 700 | 1.3 |
| Sub-section heading | `font.size.4xl` | 600 | 1.3 |
| Sidebar nav item | `font.size.lg` | 500 | 1.4 |
| Sidebar nav item (active) | `font.size.lg` | 700 | 1.4 |
| Card title | `font.size.4xl` | 600 | 1.3 |
| Card body | `font.size.2xl` | 400 | `font.lineHeight.base` |
| Form label | `font.size.3xl` | 600 | 1.3 |
| Form input | `font.size.4xl` | 400 | 1 |
| Form placeholder | `font.size.4xl` | 400 | 1 |
| Table header | `font.size.md` | 700 | 1.3 |
| Table cell | `font.size.2xl` | 400 | 1.4 |
| Status badge | `font.size.sm` | 700 | 1 |
| Points value | `font.size.4xl × 2` (~32px) | 800 | 1 |
| Points label | `font.size.2xl` | 400 | 1.3 |
| Timestamp / order date | `font.size.xs` | 400 | 1.3 |
| Price | `font.size.3xl` | 700 | 1 |
| Empty state heading | `font.size.4xl` | 700 | 1.3 |
| Empty state body | `font.size.2xl` | 400 | `font.lineHeight.base` |
| CTA primary | `font.size.4xl` | 600 | 1 |
| CTA secondary | `font.size.3xl` | 600 | 1 |
| Toast message | `font.size.2xl` | 500 | 1.4 |

### 2.2 Color Palette

| Token | Hex | Usage |
|---|---|---|
| `color.surface.base` | `#000000` | Deep overlays |
| `color.text.secondary` | `#1c1c1c` | Primary headings, strong labels |
| `color.text.tertiary` | `#ffffff` | Text on green/dark surfaces |
| `color.text.inverse` | `#212326` | Body copy, secondary meta |
| `color.surface.raised` | `#00b566` | Primary CTA, active states, loyalty accent |
| `color.surface.strong` | `#fefcf9` | Page background, card backgrounds |

**Profile page semantic aliases (never use raw hex):**

| Alias | Maps to | Usage |
|---|---|---|
| `profile.page-bg` | `color.surface.strong` | Global page background |
| `profile.sidebar-bg` | `color.surface.strong` | Sidebar background |
| `profile.sidebar-active-bg` | `color.surface.raised` @ 10% | Active sidebar item fill |
| `profile.sidebar-active-text` | `color.surface.raised` | Active sidebar item label |
| `profile.sidebar-active-bar` | `color.surface.raised` | Active left-bar indicator |
| `profile.sidebar-hover-bg` | `color.surface.raised` @ 6% | Sidebar item hover |
| `profile.card-bg` | `color.surface.strong` | Content cards |
| `profile.card-border` | `color.text.secondary` @ 10% | Card border |
| `profile.heading` | `color.text.secondary` | All headings |
| `profile.body` | `color.text.inverse` | Body copy |
| `profile.meta` | `color.text.secondary` @ 45% | Timestamps, labels |
| `profile.cta-bg` | `color.surface.raised` | Primary CTA bg |
| `profile.cta-text` | `color.text.tertiary` | Primary CTA text |
| `profile.input-bg` | `color.surface.strong` | Input field background |
| `profile.input-border` | `color.text.secondary` @ 20% | Input resting border |
| `profile.input-focus` | `color.surface.raised` | Input focused border |
| `profile.divider` | `color.text.secondary` @ 10% | Section dividers |
| `profile.focus-ring` | `color.surface.raised` | Universal focus ring |
| `profile.avatar-bg` | `color.surface.raised` | Avatar placeholder fill |
| `profile.avatar-text` | `color.text.tertiary` | Avatar initials |
| `profile.star-fill` | `#c8a84b` | Star rating (amber — one-off) |
| `profile.status-delivered` | `#16a34a` | "Delivered" badge |
| `profile.status-processing` | `#d97706` | "Processing" badge |
| `profile.status-shipped` | `#2563eb` | "Shipped" badge |
| `profile.status-cancelled` | `#dc2626` | "Cancelled" badge |
| `profile.status-returned` | `#7c3aed` | "Returned" badge |
| `profile.danger-text` | `#dc2626` | Destructive actions |
| `profile.danger-border` | `#dc2626` | Destructive button border |
| `profile.points-bg` | `color.surface.raised` @ 8% | Loyalty card bg tint |
| `profile.overlay-bg` | `color.surface.base` @ 55% | Modal / drawer backdrop |
| `profile.skeleton-base` | `color.text.secondary` @ 8% | Skeleton loading |
| `profile.skeleton-shine` | `color.text.tertiary` @ 60% | Skeleton shimmer |

### 2.3 Spacing Scale

| Token | Value |
|---|---|
| `space.1` | `1px` |
| `space.2` | `2px` |
| `space.3` | `3px` |
| `space.4` | `4px` |
| `space.5` | `5px` |
| `space.6` | `6px` |
| `space.7` | `8px` |
| `space.8` | `9px` |

> **Composed values:** `space.7 × 2 = 16px` · `space.7 × 3 = 24px` · `space.7 × 4 = 32px` · `space.7 × 6 = 48px` · `space.7 × 8 = 64px` · `space.7 × 10 = 80px`

### 2.4 Border Radius

| Token | Value | Usage |
|---|---|---|
| `radius.xs` | `4px` | Status badges, micro chips |
| `radius.sm` | `8px` | Input fields, avatar |
| `radius.md` | `12px` | Content cards, modals |
| `radius.lg` | `16px` | Section panels |
| `radius.xl` | `20px` | Loyalty card, large panels |
| `radius.step7` | `50px` | Avatar circle, icon buttons |
| `radius.step8` | `9999px` | CTA buttons, pill tags |

### 2.5 Shadows

| Token | Value | Usage |
|---|---|---|
| `shadow.1` | `rgb(190, 234, 212) 0px 0px 0px 0px` | Resting (no elevation) |
| `shadow.2` | `rgb(202, 223, 212) 0px 0px 0px 1px inset` | Card default border |
| `shadow.3` | `rgb(212, 212, 212) 0px 0px 0px 1px inset` | Input default border |
| `shadow.4` | `rgb(0, 146, 82) 0px 0px 0px 1px inset` | Active input / focus border |

**Composed shadows:**

| Name | Value | Usage |
|---|---|---|
| `card-shadow` | `0 4px 20px rgba(28, 28, 28, 0.06)` | Content card elevation |
| `modal-shadow` | `0 20px 60px rgba(0, 0, 0, 0.18)` | Modal / drawer |
| `avatar-shadow` | `0 4px 16px rgba(0, 181, 102, 0.25)` | Avatar hover |
| `sidebar-shadow` | `2px 0 16px rgba(28, 28, 28, 0.06)` | Sidebar right edge |

### 2.6 Motion

| Token | Value | Usage |
|---|---|---|
| `motion.duration.instant` | `200ms` | Hover, badge, chip states |
| `motion.duration.fast` | `250ms` | Sidebar expand, tab switch |
| `motion.duration.normal` | `300ms` | Modal open, section reveal |
| `motion.duration.slow` | `500ms` | Page load stagger, skeleton → content |

---

## 3. Page Layout & Grid

### 3.1 Overall Structure

```
┌──────────────────────────────────────────────────────────────────┐
│  ANNOUNCEMENT BAR                                                │
├──────────────────────────────────────────────────────────────────┤
│  NAVIGATION BAR                                                  │
├──────────────────────────────────────────────────────────────────┤
│  BREADCRUMB                                                      │
├───────────────────────┬──────────────────────────────────────────┤
│                       │                                          │
│   LEFT SIDEBAR        │   MAIN CONTENT AREA                     │
│   (260px sticky)      │   (fills remaining width)               │
│                       │                                          │
│   • Profile hero      │   Active section panel renders here     │
│   • Nav items         │                                          │
│   • Sign out          │                                          │
│                       │                                          │
└───────────────────────┴──────────────────────────────────────────┘
│  FOOTER                                                          │
└──────────────────────────────────────────────────────────────────┘
```

### 3.2 Layout Rules

| Property | Value |
|---|---|
| Max content width | `1280px`, centred |
| Page background | `profile.page-bg` |
| Horizontal padding | `space.7 × 6 = 48px` desktop · `space.7 × 3 = 24px` tablet · `space.7 = 8px` mobile |
| Sidebar width | `260px` fixed |
| Sidebar + content gap | `space.7 × 3 = 24px` |
| Content area | Fills remaining width |
| Sidebar sticky | `position: sticky; top: 64px; height: calc(100vh - 64px); overflow-y: auto` |

### 3.3 Breakpoints

| Breakpoint | Sidebar | Layout |
|---|---|---|
| `≥ 1024px` | Visible, `260px` sticky | Two-column |
| `768–1023px` | Visible, `220px` sticky | Two-column compressed |
| `< 768px` | Hidden → bottom tab bar | Single column; tabs at bottom |
| `< 480px` | Bottom tab bar (icons only) | Full-width content |

---

## 4. Navigation Bar

Shared component — authenticated state.

```
[🌿 Hero]  [Plants▾][Supplies][AI Care][Garden Services]  [🔍][👤 Priya][🛒³]
```

| Property | Value |
|---|---|
| Account icon | Changes to user avatar thumbnail (32×32px circle) when logged in |
| Avatar | User photo or initials monogram, `profile.avatar-bg`, `profile.avatar-text` |
| Avatar dropdown | Account menu: "My Profile", "My Orders", "Wishlist", "Sign Out" |
| All other properties | Inherit from shared nav spec |

---

## 5. Breadcrumb

```
Home  /  My Account
```

| Property | Value |
|---|---|
| Markup | `<nav aria-label="Breadcrumb">` wrapping `<ol>` |
| Font | `font.size.lg`, weight 400, `profile.body` |
| Current page | Non-linked, weight 600, `profile.heading` |
| `aria-current` | `"page"` on current `<li>` |
| Margin | `space.7 × 3 = 24px` top, `space.7 × 2 = 16px` bottom |

---

## 6. Left Sidebar

### 6.1 Sidebar Shell

| Property | Value |
|---|---|
| Width | `260px` |
| Background | `profile.sidebar-bg` |
| Border-right | `1px solid profile.divider` |
| Shadow | `sidebar-shadow` |
| Padding | `space.7 × 2 = 16px` |
| Overflow-y | `auto` |
| `role` | `"navigation"` |
| `aria-label` | `"Account navigation"` |

### 6.2 Profile Hero (Top of Sidebar)

```
┌─────────────────────────────┐
│   ┌───────┐                 │
│   │  P K  │  Priya Kumar    │
│   └───────┘  priya@email.com│
│            🌿 Plant Lover   │
│   ●  ●  ●  ●  ●  ●  ●  ●  │  ← Loyalty points bar
│   240 Green Points          │
└─────────────────────────────┘
```

**Avatar:**

| Property | Value |
|---|---|
| Size | `72×72px`, `radius.step7` |
| Background | `profile.avatar-bg` |
| Initials | `font.size.4xl × 1.5` (~24px), weight 700, `profile.avatar-text` |
| Photo | `object-fit: cover`, `radius.step7` when uploaded |
| Edit overlay | On hover: semi-dark overlay + camera icon, `motion.duration.instant` |
| Edit `aria-label` | `"Change profile photo"` |
| Shadow | `avatar-shadow` on hover |

**User name:**

| Property | Value |
|---|---|
| Font | `font.size.4xl × 1.5` (~24px), weight 700, `profile.heading` |
| Margin top | `space.7 = 8px` |
| Max characters | 28 — truncate with ellipsis |

**User email:**

| Property | Value |
|---|---|
| Font | `font.size.2xl`, weight 400, `profile.meta` |
| Margin top | `space.4 = 4px` |

**"Plant Lover" tag:**

| Property | Value |
|---|---|
| Font | `font.size.sm`, weight 600, `color.surface.raised` |
| Icon | 🌿 leaf, `12×12px` inline |
| Background | `color.surface.raised` @ 10% |
| Border-radius | `radius.step8` |
| Padding | `space.4` vertical, `space.6` horizontal |
| Margin top | `space.5` |
| Label logic | `"Plant Lover"` < 5 orders · `"Green Thumb"` 5–15 · `"Garden Expert"` 15+ |

**Loyalty mini-bar:**

| Property | Value |
|---|---|
| Label | `"[n] Green Points"`, `font.size.md`, weight 600, `color.surface.raised` |
| Bar | Full-width, `6px` height, `radius.step8`, `color.surface.raised` bg |
| Bar track | `color.surface.raised` @ 15% |
| Progress | Current points / next tier threshold |
| Margin top | `space.7 = 8px` |
| Tooltip on hover | `"[n] more points to [next tier]"` |
| Link | Tapping opens Loyalty Rewards section |

**Sidebar profile divider:**

| Property | Value |
|---|---|
| Type | `1px solid profile.divider` |
| Margin | `space.7 × 2 = 16px` vertical |

### 6.3 Sidebar Navigation Items

```
📦  My Orders                      3 →
♡   Wishlist                      12 →
🌿  My Plants                      5 →
👤  Personal Info
📍  Addresses                      2 →
🏅  Loyalty Rewards             240 pts
💳  Payment Methods
⭐  Reviews                        8 →
🔔  Notifications
🔒  Security
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
↩   Sign Out
```

| Property | Value |
|---|---|
| Item height | `48px` minimum (touch-friendly) |
| Padding | `space.7 × 1.5 = 12px` vertical, `space.7 × 2 = 16px` horizontal |
| Border-radius | `radius.md` |
| Font | `font.size.lg`, weight 500, `profile.body` |
| Icon | `20×20px` inline-left, `space.6` gap, `profile.meta` colour |
| Badge | Pill badge right-aligned: count or points value |

**Nav item states:**

| State | Background | Left bar | Text | Icon |
|---|---|---|---|---|
| Default | Transparent | None | `profile.body` | `profile.meta` |
| Hover | `profile.sidebar-hover-bg` | None | `profile.heading` | `color.surface.raised` |
| Focus-visible | `profile.sidebar-hover-bg` | None | `profile.heading` | `color.surface.raised` |
| Active / current | `profile.sidebar-active-bg` | `3px solid profile.sidebar-active-bar` left inset | `profile.sidebar-active-text`, weight 700 | `color.surface.raised` |
| Transition | `motion.duration.instant` | — | — | — |

**Badge chips on nav items:**

| Property | Value |
|---|---|
| Background | `color.surface.raised` |
| Text | `color.text.tertiary`, `font.size.sm`, weight 700 |
| Border-radius | `radius.step8` |
| Padding | `space.3` vertical, `space.5` horizontal |
| Min-width | `20px`, centred |
| `aria-label` | `"[n] [item name]"` e.g. `"3 orders"` |

**Nav item list (full):**

| Icon | Label | Badge | Section ID |
|---|---|---|---|
| 📦 | My Orders | Order count | `#orders` |
| ♡ | Wishlist | Saved items count | `#wishlist` |
| 🌿 | My Plants | Added plants count | `#my-plants` |
| 👤 | Personal Info | — | `#personal-info` |
| 📍 | Addresses | Address count | `#addresses` |
| 🏅 | Loyalty Rewards | Points value | `#loyalty` |
| 💳 | Payment Methods | — | `#payments` |
| ⭐ | My Reviews | Review count | `#reviews` |
| 🔔 | Notifications | Unread count | `#notifications` |
| 🔒 | Security | — | `#security` |
| ↩ | Sign Out | — | Triggers sign-out modal |

**Keyboard:**
- Tab moves through nav items top-to-bottom
- Enter/Space activates item and loads section
- `aria-current="page"` on active item
- `role="list"` on nav container, `role="listitem"` on each item

### 6.4 Sign Out

| Property | Value |
|---|---|
| Separator above | `1px solid profile.divider`, `space.7 × 2` margin |
| Font | `font.size.lg`, weight 500, `profile.danger-text` |
| Icon | ↩ exit icon, `20×20px`, `profile.danger-text` |
| Hover | `profile.danger-text` @ 10% bg |
| On click | Opens confirm modal — see §18.1 |
| `aria-label` | `"Sign out of your account"` |

---

## 7. Mobile Bottom Tab Bar

Replaces sidebar on `< 768px`. Fixed at bottom of screen.

```
┌────────────────────────────────────────────────────────┐
│  [📦 Orders]  [♡ Wishlist]  [🌿 Plants]  [👤 Profile] │
└────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Position | Fixed, bottom `0`, full-width, `z-index: 100` |
| Height | `60px` |
| Background | `color.surface.strong` |
| Border-top | `1px solid profile.divider` |
| Safe area | `padding-bottom: env(safe-area-inset-bottom)` — iOS home bar |
| Tab width | Equal 25% each |
| Icon | `24×24px`, centred |
| Label | `font.size.xs`, weight 500, below icon |
| Active tab | Icon + label: `color.surface.raised`; top `2px solid color.surface.raised` indicator |
| Inactive tab | `profile.meta` |
| Badge on icon | Same style as sidebar badges |
| `role` | `role="tablist"` on bar, `role="tab"` on each |
| "Profile" tab | Opens full-screen profile menu drawer (all sidebar items) |

---

## 8. Section: Overview Dashboard (Default View)

The landing view when the user first opens `/account`. Shows a summary of all key areas.

### 8.1 Section Header

```
Welcome back, Priya 🌿
Here's what's growing in your account.
```

| Property | Value |
|---|---|
| Heading | `"Welcome back, [first name] 🌿"`, `font.size.4xl × 1.5` (~24px), weight 700, `profile.heading` |
| Subtext | `font.size.2xl`, weight 400, `profile.meta` |
| Margin bottom | `space.7 × 4 = 32px` |

### 8.2 Quick Stats Row

```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│      12      │      5       │     240      │      8       │
│   Orders     │   Plants     │    Points    │   Reviews    │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

| Property | Value |
|---|---|
| Layout | 4-column flex row, `space.7 × 2 = 16px` gap |
| Card bg | `profile.card-bg` |
| Card border | `shadow.2` |
| Card radius | `radius.md` |
| Card padding | `space.7 × 2 = 16px` |
| Number | `font.size.4xl × 2` (~32px), weight 800, `color.surface.raised` |
| Label | `font.size.2xl`, weight 400, `profile.meta`, margin-top `space.4` |
| Hover | `shadow.card-hover`, `translateY(-2px)`, `motion.duration.fast` |
| Clickable | Each card links to its respective section |
| Mobile | 2×2 grid |
| `aria-label` | `"[n] [label]"` on each card |

### 8.3 Recent Order Card

```
┌──────────────────────────────────────────────────────────────┐
│  Recent Order                            [ View All Orders ] │
├──────────────────────────────────────────────────────────────┤
│  ┌──────┐  Monstera Deliciosa            Order #ORD-4821     │
│  │ img  │  + 2 more items                15 Jun 2026         │
│  └──────┘  ₹1,248                  [ Delivered ✓ ]          │
│                          [ Track Order ]  [ Buy Again ]      │
└──────────────────────────────────────────────────────────────┘
```

Full spec in §9.

### 8.4 Wishlist Preview Card

```
┌──────────────────────────────────────────────────────────────┐
│  Wishlist (12)                        [ View All → ]         │
├──────────────────────────────────────────────────────────────┤
│  [ img ] [ img ] [ img ] [ img ]  +8 more                   │
│  Anthurium  Peace Lily  Pothos  ZZ Plant                     │
└──────────────────────────────────────────────────────────────┘
```

Shows 4 product thumbnails in a horizontal strip. Full spec in §10.

### 8.5 Loyalty Points Card

```
┌──────────────────────────────────────────────────────────────┐
│ 🏅  Green Points                                             │
│                                                              │
│     240 pts                  Next tier: Silver at 500 pts    │
│     ██████░░░░░░░░░░░░░░░░   48% to Silver                  │
│                                                              │
│  [ Redeem Points ]   [ How it Works ]                        │
└──────────────────────────────────────────────────────────────┘
```

Full spec in §13.

---

## 9. Section: My Orders

### 9.1 Section Header

```
My Orders (12)
```

| Property | Value |
|---|---|
| Heading | `font.size.4xl × 1.5`, weight 700, `profile.heading` |
| Count | `profile.meta` colour inline |
| Margin bottom | `space.7 × 3 = 24px` |

### 9.2 Order Filter Tabs

```
[ All (12) ]  [ Active (2) ]  [ Delivered (8) ]  [ Cancelled (2) ]
```

| Property | Value |
|---|---|
| Layout | Horizontal flex, `space.5` gap |
| Tab height | `40px`, `radius.step8` |
| Tab padding | `space.5` vertical, `space.7 × 2` horizontal |
| Font | `font.size.3xl`, weight 500 |
| Default | `shadow.3` border, `profile.page-bg` bg, `profile.body` text |
| Active | `color.surface.raised` bg, `color.text.tertiary`, weight 700 |
| Hover | `shadow.4` border, `motion.duration.instant` |
| Focus-visible | `2px` focus ring `profile.focus-ring` |
| `role` | `role="tablist"`, `role="tab"`, `aria-selected` |
| Keyboard | Arrow keys cycle tabs; Enter selects |

### 9.3 Order Search + Sort Row

```
┌─────────────────────────────────────┐    [ Newest First ▾ ]
│  🔍  Search orders...               │
└─────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Input height | `44px`, `radius.step8`, `shadow.3` border |
| Focus | `shadow.4` border |
| Font | `font.size.4xl`, `profile.body` |
| Sort | Same component as PLP sort dropdown (see §9.3 of PLP spec) |
| Sort options | `Newest First` (default) · `Oldest First` · `Highest Value` · `Lowest Value` |

### 9.4 Order Card

```
┌──────────────────────────────────────────────────────────────────┐
│  Order #ORD-4821                   15 Jun 2026      [ Delivered ]│
├──────────────────────────────────────────────────────────────────┤
│  ┌──────┐  Monstera Deliciosa — Medium                          │
│  │ img  │  ₹399 × 1                                             │
│  │      ├──────────────────────────────────────────────────────┤
│  │ img  │  Peace Lily — Small                                   │
│  └──────┘  ₹249 × 2                                             │
│                                                                  │
│  Total: ₹1,248  (incl. ₹0 delivery)                             │
│                                                                  │
│  [ Track Order → ]    [ Write a Review ]    [ Buy Again ]        │
│  [ Return / Exchange ]                                           │
└──────────────────────────────────────────────────────────────────┘
```

**Order card shell:**

| Property | Value |
|---|---|
| Background | `profile.card-bg` |
| Border | `shadow.2` |
| Border-radius | `radius.md` |
| Padding | `space.7 × 2 = 16px` |
| Shadow | `card-shadow` |
| Margin-bottom | `space.7 × 2 = 16px` |
| Hover | Subtle `card-shadow` deepen, `motion.duration.instant` |

**Order header row:**

| Property | Value |
|---|---|
| Order number | `font.size.4xl`, weight 700, `profile.heading` |
| Order date | `font.size.xs`, weight 400, `profile.meta`, right-aligned |
| Status badge | Pill badge right-most; see status badge spec |

**Status badge:**

| Status | Background | Text | Icon |
|---|---|---|---|
| Delivered | `profile.status-delivered` @ 12% | `profile.status-delivered` | ✓ |
| Processing | `profile.status-processing` @ 12% | `profile.status-processing` | ⏳ |
| Shipped | `profile.status-shipped` @ 12% | `profile.status-shipped` | 🚚 |
| Cancelled | `profile.status-cancelled` @ 12% | `profile.status-cancelled` | ✕ |
| Returned | `profile.status-returned` @ 12% | `profile.status-returned` | ↩ |

| Property | Value |
|---|---|
| Font | `font.size.sm`, weight 700 |
| Border-radius | `radius.step8` |
| Padding | `space.4` vertical, `space.6` horizontal |
| Icon size | `12×12px`, `space.3` gap left of text |
| `aria-label` | `"Order status: [status]"` |

**Order items list:**

| Property | Value |
|---|---|
| Product thumbnail | `56×56px`, `radius.sm`, `object-fit: cover` |
| Product name | `font.size.2xl`, weight 600, `profile.heading` |
| Variant | `font.size.md`, weight 400, `profile.meta`: `"— Medium"` |
| Price × qty | `font.size.2xl`, weight 400, `profile.body`, right-aligned |
| Items shown | Maximum 2 inline; `"+ [n] more"` collapses rest |
| "Show more" | `font.size.md`, weight 600, `color.surface.raised`, toggles `aria-expanded` |
| Divider | `1px solid profile.divider` between items |

**Order total row:**

| Property | Value |
|---|---|
| Font | `font.size.3xl`, weight 700, `profile.heading` |
| Delivery note | `font.size.md`, `profile.meta`: `"(incl. ₹0 delivery)"` |
| Border-top | `1px solid profile.divider`, `space.7 × 1.5` margin above |

**Order action buttons:**

| Button | Style | Visibility |
|---|---|---|
| Track Order → | `color.surface.raised` filled, `radius.step8`, `font.size.3xl` weight 600 | Delivered, Shipped |
| Write a Review | Outlined `shadow.3`, `radius.step8`, `font.size.3xl` | Delivered only |
| Buy Again | Outlined `shadow.3`, `radius.step8`, `font.size.3xl` | All |
| Return / Exchange | Text link, `profile.danger-text`, `font.size.2xl` | Delivered, within return window |
| Cancel Order | Text link, `profile.danger-text` | Processing only |

All buttons: height `40px`, `motion.duration.instant` hover states, `2px` focus ring.

### 9.5 Order Tracking Modal

Triggered by "Track Order →" button.

```
┌─────────────────────────────────────────────────────────────┐
│  Order #ORD-4821 — Tracking         [×]                     │
├─────────────────────────────────────────────────────────────┤
│  Estimated delivery: 18 Jun 2026                            │
│                                                             │
│  ● Order Placed       15 Jun — 10:24 AM    ✓               │
│  ● Packed             15 Jun — 2:48 PM     ✓               │
│  ● Dispatched         16 Jun — 9:00 AM     ✓               │
│  ○ Out for Delivery   17 Jun               ← Current        │
│  ○ Delivered          18 Jun               Pending          │
│                                                             │
│  Carrier: Shiprocket · Tracking ID: SR-8821                 │
│  [ View on Carrier Site ]                                   │
└─────────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Type | Centred modal overlay |
| Max-width | `520px` |
| Background | `profile.card-bg` |
| Border-radius | `radius.xl` |
| Shadow | `modal-shadow` |
| Backdrop | `profile.overlay-bg` |
| Animation open | Scale `0.95→1` + fade, `motion.duration.normal` |
| Padding | `space.7 × 3 = 24px` |
| `role` | `"dialog"`, `aria-modal="true"` |
| Focus trap | Yes — Tab cycles within modal |
| Close | `×` button (top-right, `40×40px`, `radius.step7`) + Escape key |
| Focus on open | Moves to modal heading |
| Focus on close | Returns to "Track Order" button |

**Tracking steps:**

| Property | Value |
|---|---|
| Step dot completed | `color.surface.raised` filled circle, `16×16px` |
| Step dot current | `color.surface.raised` filled + white pulse ring animation |
| Step dot pending | `profile.divider` border, white fill |
| Connector line | `2px solid profile.divider`; completed segments: `color.surface.raised` |
| Step label | `font.size.2xl`, weight 600, `profile.heading` (completed/current) / `profile.meta` (pending) |
| Step date/time | `font.size.xs`, `profile.meta` |
| Current step label | `font.size.sm` badge: `"← Current"`, `color.surface.raised` bg |

### 9.6 Empty State — No Orders

```
┌──────────────────────────────────────────────────┐
│                 📦                               │
│   No orders yet                                  │
│   Start exploring our plants and bring green     │
│   into your space.                               │
│                                                  │
│   [ Shop Plants ]                                │
└──────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Icon | `64×64px` box SVG, `color.surface.raised` @ 40% |
| Heading | `font.size.4xl`, weight 700, `profile.heading` |
| Body | `font.size.2xl`, `profile.meta`, max-width `320px`, centred |
| CTA | `color.surface.raised` filled, `radius.step8`, `font.size.4xl` weight 600 |
| Centred in section | Vertically + horizontally |

---

## 10. Section: Wishlist

### 10.1 Section Header

```
Wishlist (12)
```

| Property | Value |
|---|---|
| Heading | Same pattern as §9.1 |
| Sort | `[ Recently Added ▾ ]` — right-aligned dropdown |

### 10.2 Wishlist Grid

| Property | Value |
|---|---|
| Layout | 4-column grid desktop · 3-col tablet · 2-col mobile |
| Grid gap | `space.7 × 2 = 16px` |
| Card | Same as PLP product card (§10 of PLP spec) |
| Differences from PLP card | No "Add to Cart" hover-reveal — always visible |
| Remove button | `×` icon top-left of image (alongside wishlist ♡); removes from wishlist |
| "Move to Cart" | `color.surface.raised` filled CTA replaces generic "Add to Cart" label |
| Out of Stock card | "Notify Me" CTA, muted overlay |
| `aria-label` on remove | `"Remove [product name] from wishlist"` |

### 10.3 Wishlist Actions Bar

```
[ ☐ Select All ]   [ 🛒 Add Selected to Cart ]   [ 🗑 Remove Selected ]
```

| Property | Value |
|---|---|
| Select all checkbox | `18×18px`, `radius.xs`, `shadow.3` border; checked: `color.surface.raised` fill |
| "Add Selected to Cart" | `color.surface.raised` filled, `radius.step8`, disabled when 0 selected |
| "Remove Selected" | Outlined, `profile.danger-border`, `profile.danger-text`, `radius.step8` |
| Disabled state | `opacity: 0.4`, `aria-disabled="true"` |
| `aria-label` on select all | `"Select all wishlist items"` |

### 10.4 Empty State — Empty Wishlist

```
♡  Your wishlist is empty
   Save plants you love and find them here later.
   [ Explore Plants ]
```

Same structure as §9.6 empty state pattern.

---

## 11. Section: My Plants

> A personal plant diary where users log plants they own and receive care reminders.

### 11.1 Section Header

```
My Plants (5)                         [ + Add a Plant ]
```

| Property | Value |
|---|---|
| "Add a Plant" button | `color.surface.raised` filled, `radius.step8`, height `40px` |
| Heading | Same pattern |

### 11.2 Plant Care Card

```
┌────────────────────────────────────────────────────────────┐
│  ┌──────────┐   Monstera Deliciosa              [ ⋮ ]     │
│  │          │   Added: 12 Jan 2026                         │
│  │  [photo] │   Location: Living Room                      │
│  │          │                                              │
│  └──────────┘   💧 Water in 2 days     ☀️ Medium Light    │
│                 🌡 65–85°F              🪴 Repot: May 2027  │
├────────────────────────────────────────────────────────────┤
│  [ 💧 Log Watering ]  [ 📝 Add Note ]  [ View Care Guide ]│
└────────────────────────────────────────────────────────────┘
```

**Plant card shell:**

| Property | Value |
|---|---|
| Background | `profile.card-bg` |
| Border | `shadow.2` |
| Border-radius | `radius.md` |
| Padding | `space.7 × 2 = 16px` |
| Shadow | `card-shadow` |
| Layout | Flex row: image left + content right |

**Plant image:**

| Property | Value |
|---|---|
| Size | `120×120px`, `radius.md`, `object-fit: cover` |
| Fallback | Plant category icon, `color.surface.raised` @ 20% bg |
| `alt` | `"[Plant name] — user's photo"` |
| Tap | Opens full-size photo viewer |

**Plant info:**

| Property | Value |
|---|---|
| Plant name | `font.size.4xl`, weight 700, `profile.heading` |
| Date added | `font.size.xs`, `profile.meta` |
| Location | `font.size.md`, `profile.meta` with 📍 icon |

**Care indicators row (4 items):**

| Indicator | Icon | Font |
|---|---|---|
| Watering due | 💧 | `font.size.md`, weight 600 |
| Light level | ☀️ | `font.size.md`, `profile.meta` |
| Temperature | 🌡 | `font.size.md`, `profile.meta` |
| Repotting | 🪴 | `font.size.md`, `profile.meta` |

Watering due colour:
- Overdue: `profile.status-cancelled` (red)
- Due today: `profile.status-processing` (amber)
- Due in 2+ days: `color.surface.raised` (green)

**Card action buttons:**

| Button | Style |
|---|---|
| Log Watering | Outlined, `shadow.3` border, `font.size.3xl` |
| Add Note | Outlined, `shadow.3` border, `font.size.3xl` |
| View Care Guide | Text link, `color.surface.raised`, underline |

**⋮ overflow menu (top-right):**

| Option | Behaviour |
|---|---|
| Edit plant details | Opens edit modal |
| Change photo | Opens file picker |
| Set reminder | Opens reminder scheduler |
| Remove plant | Confirm dialog, then removes |

`role="menu"`, `role="menuitem"` on options; triggered by `<button>` with `aria-haspopup="menu"`, `aria-expanded`.

### 11.3 Add a Plant Modal

```
┌──────────────────────────────────────────────────────┐
│  Add a Plant                              [×]         │
├──────────────────────────────────────────────────────┤
│  Plant Name *           [ Monstera Deliciosa      ]  │
│  Nickname               [ My Monstera             ]  │
│  Date Added *           [ 12 / 01 / 2026          ]  │
│  Location               [ Living Room             ]  │
│                                                      │
│  Photo                  [ 📷 Take Photo / Upload  ]  │
│                                                      │
│  [ Cancel ]             [ Save Plant ]               │
└──────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Modal max-width | `480px` |
| Modal radius | `radius.xl` |
| Modal shadow | `modal-shadow` |
| Backdrop | `profile.overlay-bg` |
| Input fields | Same spec as PDP/garden services form inputs |
| "Save Plant" | `color.surface.raised` filled, `radius.step8`, full-width |
| "Cancel" | Outlined, `radius.step8` |
| `role` | `"dialog"`, `aria-modal="true"` |
| Focus trap | Yes |
| Close | `×` + Escape |

### 11.4 Empty State — No Plants

```
🌱  No plants yet
    Add the plants you own and we'll help you care for them.
    [ + Add Your First Plant ]
```

---

## 12. Section: Personal Info

### 12.1 Section Header

```
Personal Information
```

### 12.2 Form Layout

Two-column grid on desktop; single column mobile.

```
┌──────────────────────────────────────────────────────────────┐
│  Profile Photo                                               │
│  ┌───────┐                                                   │
│  │  P K  │  [ Change Photo ]   [ Remove Photo ]             │
│  └───────┘                                                   │
├──────────────────────────────────────────────────────────────┤
│  First Name *          │  Last Name *                        │
│  [             ]       │  [              ]                   │
│                        │                                     │
│  Email Address *       │  Phone Number                       │
│  [             ]       │  [              ]                   │
│                        │                                     │
│  Date of Birth         │  Gender                             │
│  [  DD/MM/YYYY  ]      │  [ Select ▾     ]                  │
│                        │                                     │
│  About Me (optional)                                         │
│  [                                                ]          │
│  [  Describe yourself as a plant lover...         ]          │
│                                                              │
│  Preferred Language    │  Currency                           │
│  [ English     ▾ ]    │  [ INR (₹)    ▾ ]                  │
│                                                              │
│  [ Cancel ]            [ Save Changes ]                      │
└──────────────────────────────────────────────────────────────┘
```

**Field specifications:**

| Field | Type | Validation | Required |
|---|---|---|---|
| First Name | text | Max 50 chars | Yes |
| Last Name | text | Max 50 chars | Yes |
| Email Address | email | Valid email format | Yes |
| Phone Number | tel | 10-digit Indian mobile | No |
| Date of Birth | date | Must be > 13 years | No |
| Gender | select | M / F / Non-binary / Prefer not to say | No |
| About Me | textarea | Max 240 chars | No |
| Preferred Language | select | EN / HI / MR / TE / TA | No |
| Currency | select | INR / USD | No |

**Char counter (About Me):**

| Property | Value |
|---|---|
| Format | `"[n] / 240"`, `font.size.xs`, right-aligned below textarea |
| At 80% | `profile.status-processing` colour |
| At 100% | `profile.status-cancelled` colour |
| `aria-live` | `"polite"` — announces count every 10 chars |

**Input states:** Inherited from garden services form spec (§13.3). Same token rules:
- Default: `shadow.3` border
- Hover: darken border
- Focus: `2px solid profile.input-focus` + focus glow
- Error: red border + error message `role="alert"`
- Disabled: muted bg

**Action buttons:**

| Button | Style | Behaviour |
|---|---|---|
| Save Changes | `color.surface.raised` filled, `radius.step8`, `font.size.4xl` weight 600, full-width bottom | Submits form; loading state; success toast |
| Cancel | Text link, `profile.meta` | Resets form to saved values |

**Avatar change:**

| Property | Value |
|---|---|
| "Change Photo" | Outlined button, opens file picker or camera |
| "Remove Photo" | Text link, `profile.danger-text`; confirm inline |
| Accepted formats | JPG, PNG, WebP ≤ 5MB |
| Crop | Shows crop UI after upload (square crop, `radius.step7` preview) |

### 12.3 Email Verification Banner

Shown if email is unverified.

```
⚠  Verify your email — We sent a link to priya@email.com
   [ Resend Email ]   ·   [ Change Email ]
```

| Property | Value |
|---|---|
| Background | `profile.status-processing` @ 8% |
| Border-left | `4px solid profile.status-processing` |
| Border-radius | `radius.sm` |
| Font | `font.size.2xl`, `profile.heading` |
| `role` | `"alert"` |
| `aria-live` | `"assertive"` |

---

## 13. Section: Loyalty Rewards

### 13.1 Points Summary Card

```
┌─────────────────────────────────────────────────────────────┐
│  🏅  Green Points                                            │
│                                                              │
│      240                    Next: Silver at 500 pts         │
│      points                                                  │
│                                                              │
│  ██████████░░░░░░░░░░░░░░░░░░░░  240 / 500                 │
│                                                              │
│  🌿 Plant Lover    ——→    🥈 Silver    ——→    🥇 Gold       │
│  (Current)                                                   │
│                                                              │
│   [ Redeem Points ]     [ Points History ]                   │
└─────────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Background | `profile.points-bg` |
| Border | `shadow.4` |
| Border-radius | `radius.xl` |
| Padding | `space.7 × 3 = 24px` |
| Points value | `font.size.4xl × 2` (~32px), weight 800, `color.surface.raised` |
| "points" label | `font.size.2xl`, weight 400, `profile.meta` |
| Progress bar | `8px` height, `radius.step8`, `color.surface.raised` fill, `color.surface.raised` @ 15% track |
| Progress % label | `"240 / 500"`, `font.size.md`, weight 600, `color.surface.raised`, right-aligned |
| Tier icons | 🌿 → 🥈 → 🥇, connected by `→` dashes; current tier is bold + `color.surface.raised` |
| `aria-label` on bar | `"240 of 500 points to Silver tier"` |

### 13.2 Tier Benefits Table

| Tier | Points | Benefits |
|---|---|---|
| 🌿 Plant Lover | 0–499 | 1 point per ₹10 spent · Birthday discount |
| 🥈 Silver | 500–999 | 1.5× points · Free delivery on ₹399+ |
| 🥇 Gold | 1000+ | 2× points · Free delivery always · Early sale access |

**Table styles:**

| Property | Value |
|---|---|
| Font | `font.size.2xl` body, `font.size.md` header |
| Header bg | `color.surface.raised` @ 8% |
| Header text | `profile.heading`, weight 700 |
| Cell border | `1px solid profile.divider` |
| Active tier row | `color.surface.raised` @ 6% bg, left `3px solid color.surface.raised` border |
| Border-radius on table | `radius.md` overall |

### 13.3 Points History

```
┌──────────────────────────────────────────────────────────┐
│  Date          │  Description              │  Points      │
├──────────────────────────────────────────────────────────┤
│  15 Jun 2026   │  Order #ORD-4821          │  +124 pts   │
│  08 Jun 2026   │  Referral bonus           │  +50 pts    │
│  01 Jun 2026   │  Redeemed for discount    │  −100 pts   │
│  20 May 2026   │  Order #ORD-4312          │  +87 pts    │
└──────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Points earned | `font.size.2xl`, weight 600, `profile.status-delivered` (green) |
| Points spent | `font.size.2xl`, weight 600, `profile.status-cancelled` (red) |
| Load more | `"Load more history"` text button, `color.surface.raised` |
| Empty | `"No points activity yet"`, centred `profile.meta` |

### 13.4 Redeem Points Modal

```
┌────────────────────────────────────────────┐
│  Redeem Green Points                  [×]  │
├────────────────────────────────────────────┤
│  Available: 240 pts = ₹24 off              │
│                                            │
│  Points to redeem:                         │
│  [ ──────────●───────── ]  240 pts         │
│  Value: ₹24 off your next order            │
│                                            │
│  [ Apply to Next Order ]                   │
└────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Slider | Same spec as price slider (§8.5 of PLP) |
| Conversion rate | 1 pt = ₹0.10 |
| Minimum redeem | 100 pts |
| Max redeem | Available balance |
| Apply button | `color.surface.raised` filled, full-width |
| Coupon code generated | Shows generated code after apply: `"GREEN-24"` + copy button |

---

## 14. Section: Addresses

### 14.1 Section Header

```
Saved Addresses (2)                    [ + Add New Address ]
```

| Property | Value |
|---|---|
| "Add New Address" | `color.surface.raised` filled, `radius.step8`, height `40px` |

### 14.2 Address Card Grid

2-column grid desktop, 1-column mobile.

```
┌───────────────────────────────────────┐
│  🏠 Home                [ Default ]   │
│  ────────────────────────────────     │
│  Priya Kumar                          │
│  42, Green Park Society               │
│  Baner, Pune — 411045                 │
│  Maharashtra, India                   │
│  📞 +91 98765 43210                   │
│                                       │
│  [ Edit ]      [ Delete ]             │
│  [ Set as Default ]                   │
└───────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Card bg | `profile.card-bg` |
| Card border | `shadow.2` (default) · `shadow.4` (default address) |
| Card radius | `radius.md` |
| Card padding | `space.7 × 2 = 16px` |
| Address type label | `font.size.md`, weight 700, `profile.heading` + 🏠/🏢 icon |
| "Default" badge | `color.surface.raised` bg, `color.text.tertiary`, `radius.step8`, `font.size.sm` |
| Name | `font.size.2xl`, weight 600, `profile.heading` |
| Address lines | `font.size.2xl`, weight 400, `profile.body`, `font.lineHeight.base` |
| Phone | `font.size.2xl`, `profile.meta` |
| Edit button | Outlined, `shadow.3`, `radius.step8`, `font.size.3xl` |
| Delete button | Text link, `profile.danger-text` |
| "Set as Default" | Text link, `color.surface.raised`, hidden if already default |

### 14.3 Add/Edit Address Modal

```
┌─────────────────────────────────────────────────────────┐
│  Add New Address                            [×]          │
├─────────────────────────────────────────────────────────┤
│  Address Type: [ 🏠 Home ]  [ 🏢 Work ]  [ ☆ Other ]   │
│                                                          │
│  Full Name *           Phone Number *                    │
│  [                ]    [                ]                │
│                                                          │
│  Pincode *             City *                            │
│  [        ]  [Auto-fill →]  [           ]               │
│                                                          │
│  Address Line 1 *                                        │
│  [                                     ]                 │
│                                                          │
│  Address Line 2                                          │
│  [                                     ]                 │
│                                                          │
│  State *               Country                           │
│  [ Select ▾ ]          [ India  ]                        │
│                                                          │
│  [ ☐ Set as default address ]                            │
│                                                          │
│  [ Cancel ]            [ Save Address ]                  │
└─────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Modal max-width | `560px` |
| Pincode auto-fill | On 6-digit pincode entry: auto-populates city + state via API |
| Auto-fill loading | Spinner inside pincode field, `aria-busy="true"` |
| Auto-fill error | `"Pincode not found"` error message |
| All input specs | Inherit form input token rules from §12.2 |
| "Save Address" | `color.surface.raised` filled, full-width |

---

## 15. Section: Payment Methods

### 15.1 Section Header

```
Payment Methods                    [ + Add Card ]
```

### 15.2 Saved Card

```
┌──────────────────────────────────────────────────┐
│  💳  Visa                            [ Default ] │
│      •••• •••• •••• 4821                         │
│      Expires: 09/28                              │
│                                                  │
│  [ Remove ]    [ Set as Default ]                │
└──────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Card bg | `profile.card-bg` |
| Card border | `shadow.2` default · `shadow.4` active card |
| Card radius | `radius.md` |
| Card padding | `space.7 × 2 = 16px` |
| Card network logo | Visa/Mastercard/Rupay SVG, `40×24px` |
| Card number | `font.size.2xl`, weight 500, `profile.heading` |
| Expiry | `font.size.md`, `profile.meta` |
| "Default" badge | Same as address default badge |
| Remove | Text link, `profile.danger-text`; confirm dialog |

### 15.3 Add Card Modal

Standard payment form: card number, name on card, expiry MM/YY, CVV. All inputs follow §12.2 rules. Card number field auto-detects network and shows logo. CVV field: `type="password"`, `maxlength="4"`.

**Security note:**

```
🔒 Your card details are encrypted and stored securely.
   We never store your CVV.
```

| Property | Value |
|---|---|
| Font | `font.size.md`, `profile.meta` |
| Lock icon | `14×14px`, `color.surface.raised` |

---

## 16. Section: My Reviews

### 16.1 Section Header

```
My Reviews (8)
```

### 16.2 Review Tabs

```
[ Written (6) ]  [ Pending (2) ]
```

**Written review card:**

```
┌──────────────────────────────────────────────────────────────┐
│  ┌──────┐  Monstera Deliciosa                                │
│  │ img  │  ★★★★★  5 / 5                                    │
│  └──────┘  Ordered: 15 Jun 2026                              │
│                                                              │
│  "Absolutely beautiful plant! Arrived in perfect             │
│   condition and the packaging was excellent."                │
│                                                              │
│  [ Edit Review ]   [ Delete Review ]                         │
└──────────────────────────────────────────────────────────────┘
```

**Pending review card (product bought, no review yet):**

```
┌──────────────────────────────────────────────────────────────┐
│  ┌──────┐  Peace Lily — Small                               │
│  │ img  │  Ordered: 08 Jun 2026                             │
│  └──────┘                                                   │
│  How was this plant?                                         │
│  [ ☆ ☆ ☆ ☆ ☆ ]  Tap to rate                             │
│                                                              │
│  [ Write a Review ]                                          │
└──────────────────────────────────────────────────────────────┘
```

**Star rating tap interaction (pending card):**

| Property | Value |
|---|---|
| Stars | 5 SVG stars, `32×32px`, `profile.star-fill` filled, `profile.divider` empty |
| Hover / tap | Stars fill incrementally left-to-right |
| Selected | Fills to selected count |
| Keyboard | Arrow keys change rating; Enter confirms |
| `role` | `role="radiogroup"`, `role="radio"` on each star |
| `aria-label` | `"Rate [product name]: [n] out of 5 stars"` |

### 16.3 Write / Edit Review Modal

```
┌────────────────────────────────────────────────────────────┐
│  Review: Monstera Deliciosa                      [×]        │
├────────────────────────────────────────────────────────────┤
│  Rating *         [ ★ ★ ★ ★ ★ ]                          │
│                                                            │
│  Review Title     [ Great plant! ]                         │
│                                                            │
│  Your Review *                                             │
│  [                                                ]        │
│  [ Arrived in perfect condition...                ]        │
│  50–2000 characters           156 / 2000                   │
│                                                            │
│  Add Photos (optional)  [ 📷 + Add up to 3 photos ]       │
│  [ photo1 ] [ photo2 ]                                     │
│                                                            │
│  [ Cancel ]              [ Submit Review ]                 │
└────────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Photo upload | `80×80px` thumbnails, `radius.sm`, remove `×` on each |
| Max photos | 3 |
| Char counter | `font.size.xs`, right-aligned, turns amber at 80%, red at 100% |
| Min chars | 50 (error if submitted below) |
| Submit button | `color.surface.raised` filled, full-width, `radius.step8` |

---

## 17. Section: Notifications

### 17.1 Section Header

```
Notifications                    [ Mark All as Read ]
```

### 17.2 Notification List

```
┌──────────────────────────────────────────────────────────┐
│  🚚  Your order #ORD-4821 has been shipped!   2 hrs ago  │ ← Unread (green left bar)
│      Estimated delivery: 18 Jun 2026                     │
├──────────────────────────────────────────────────────────┤
│  💧  Time to water your Monstera!             1 day ago  │
│      It's been 7 days since the last watering.           │
├──────────────────────────────────────────────────────────┤
│  🏅  You've earned 124 Green Points!          3 days ago │ ← Read (no bar)
│      From order #ORD-4821                                │
└──────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Unread item | `color.surface.raised` @ 6% bg, `3px solid color.surface.raised` left border |
| Read item | `profile.card-bg`, no border |
| Icon | `32×32px` emoji or category SVG |
| Title | `font.size.2xl`, weight 600, `profile.heading` (unread) / `profile.body` (read) |
| Body | `font.size.2xl`, weight 400, `profile.meta` |
| Timestamp | `font.size.xs`, `profile.meta`, right-aligned |
| Mark as read | Click anywhere on notification row |
| Delete | Swipe left on mobile (reveals red delete zone); × button on desktop hover |
| `aria-label` on item | `"[Notification type]: [title]. [time ago]. [Read/Unread]"` |

### 17.3 Notification Preferences

Toggle settings panel below the list.

```
┌──────────────────────────────────────────────────────────────┐
│  Notification Preferences                                    │
├──────────────────────────────────────────────────────────────┤
│  Order Updates            [ Email ☑ ]  [ Push ☑ ]  [ SMS ☐ ]│
│  Watering Reminders       [ Email ☐ ]  [ Push ☑ ]  [ SMS ☐ ]│
│  Wishlist price drops     [ Email ☑ ]  [ Push ☐ ]  [ SMS ☐ ]│
│  New arrivals & offers    [ Email ☑ ]  [ Push ☐ ]  [ SMS ☐ ]│
│  Loyalty rewards          [ Email ☑ ]  [ Push ☑ ]  [ SMS ☐ ]│
└──────────────────────────────────────────────────────────────┘
```

**Toggle switch:**

| Property | Value |
|---|---|
| Width | `44px` |
| Height | `24px` |
| Thumb | `20×20px` white circle |
| Track off | `profile.divider` bg |
| Track on | `color.surface.raised` bg |
| Transition | Thumb slides, `motion.duration.instant` |
| `role` | `"switch"` |
| `aria-checked` | `true/false` |
| Label connection | `aria-labelledby` pointing to row label |
| Focus-visible | `2px` focus ring `profile.focus-ring` |

---

## 18. Section: Security

### 18.1 Section Header

```
Security
```

### 18.2 Security Items

```
┌──────────────────────────────────────────────────────────────┐
│  🔑  Password                                               │
│      Last changed: 45 days ago                              │
│      [ Change Password ]                                    │
├──────────────────────────────────────────────────────────────┤
│  📱  Two-Factor Authentication                 [ OFF → ON ] │
│      Add extra security to your account                     │
├──────────────────────────────────────────────────────────────┤
│  💻  Active Sessions                                        │
│      Chrome · Mumbai, MH · 2 mins ago · Current            │
│      Safari · Pune, MH · 3 days ago  [ Sign Out ]          │
├──────────────────────────────────────────────────────────────┤
│  🗑  Delete Account                                         │
│      Permanently delete your account and all data           │
│      [ Delete Account ]                                     │
└──────────────────────────────────────────────────────────────┘
```

**Change Password Modal:**

Fields: Current Password · New Password · Confirm New Password. All `type="password"`, `44px` height, same input tokens. Show/hide toggle (👁) inside field right. Password strength meter below new password field:

| Strength | Colour | Label |
|---|---|---|
| Weak | `profile.status-cancelled` | "Weak" |
| Fair | `profile.status-processing` | "Fair" |
| Good | `#2563eb` | "Good" |
| Strong | `profile.status-delivered` | "Strong" |

Meter: 4-segment bar, `6px` height, `radius.step8`, segments animate fill `motion.duration.fast`.

**2FA Toggle:** Same toggle switch component as notification preferences. Enabling opens modal with QR code + backup codes.

**Delete Account button:**

| Property | Value |
|---|---|
| Style | Outlined, `profile.danger-border`, `profile.danger-text`, `radius.step8` |
| Font | `font.size.4xl`, weight 600 |
| Height | `44px` |
| Hover | `profile.danger-text` @ 8% bg |
| On click | Multi-step confirm modal: type "DELETE" + password confirmation |
| `aria-label` | `"Delete your account permanently"` |

---

## 19. Modals — Universal Rules

All modals on the profile page share these properties:

| Property | Value |
|---|---|
| Backdrop | `profile.overlay-bg` (`color.surface.base` @ 55%), full-screen |
| Background | `profile.card-bg` |
| Border-radius | `radius.xl` |
| Shadow | `modal-shadow` |
| Max-width | `480px` (small) · `560px` (form) · `640px` (large) |
| Padding | `space.7 × 3 = 24px` |
| `role` | `"dialog"`, `aria-modal="true"`, `aria-labelledby` → modal heading |
| Focus trap | Yes — Tab cycles only inside modal |
| Open animation | Scale `0.96→1` + fade, `motion.duration.normal` |
| Close animation | Fade, `motion.duration.fast` |
| Close triggers | `×` button (top-right) + Escape key + "Cancel" button |
| Focus on open | Moves to modal heading or first input |
| Focus on close | Returns to trigger element |
| Mobile | Full-screen bottom sheet with drag handle (same as PLP filter sheet) |

---

## 20. Sign Out Confirm Modal

```
┌─────────────────────────────────────────┐
│  Sign out?                              │
│                                         │
│  You'll need to sign in again to access │
│  your orders, wishlist, and plants.     │
│                                         │
│  [ Cancel ]      [ Yes, Sign Out ]      │
└─────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| "Yes, Sign Out" | `profile.danger-text` coloured filled button |
| "Cancel" | Outlined, focus on open |
| On confirm | Clears session; redirects to `/` |

---

## 21. Toast Notifications

All profile save/update/error actions use toast. Shared component:

| Property | Value |
|---|---|
| Position | Bottom-centre, fixed, `z-index: 300` |
| Background | `color.text.secondary` |
| Text | `color.text.tertiary`, `font.size.2xl`, weight 500 |
| Border-radius | `radius.md` |
| Padding | `space.7 × 1.5 = 12px` vertical, `space.7 × 3 = 24px` horizontal |
| Auto-dismiss | `3000ms` |
| Animation in | Slide up + fade, `motion.duration.fast` |
| Animation out | Fade, `motion.duration.fast` |
| `role` | `"status"` |
| `aria-live` | `"polite"` |

**Toast variants:**

| Variant | Left border | Icon | Example |
|---|---|---|---|
| Success | `4px solid color.surface.raised` | ✓ | "Profile updated successfully" |
| Error | `4px solid profile.danger-text` | ✕ | "Failed to save. Try again." |
| Info | `4px solid color.surface.raised` @ 60% | ℹ | "Verification email sent" |

---

## 22. Skeleton Loading States

Shown while section data loads. Replaces real content with same-dimension placeholders.

| Element | Skeleton |
|---|---|
| Avatar | `72×72px` circle, `profile.skeleton-base` + shimmer |
| User name | `160px × 24px` bar |
| Order card | Full card-height block with 3 text bars |
| Product thumbnail | `56×56px` square |
| Stats card | `100% × 80px` block |
| Plant care card | `100% × 140px` block |
| `aria-busy` | `"true"` on section container while loading |
| `aria-label` | `"Loading [section name]"` |

**Shimmer animation:**

```css
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
background: linear-gradient(
  90deg,
  profile.skeleton-base 25%,
  profile.skeleton-shine 50%,
  profile.skeleton-base 75%
);
background-size: 200% 100%;
animation: shimmer 1.5s infinite;
```

---

## 23. Accessibility Requirements

### 23.1 Contrast Ratios

| Pairing | Ratio | Required | Status |
|---|---|---|---|
| `profile.heading` (#1c1c1c) on `profile.page-bg` (#fefcf9) | ~17:1 | 4.5:1 | ✅ Pass |
| `profile.cta-text` (#fff) on `profile.cta-bg` (#00b566) at `font.size.4xl` weight 600 | ~3.4:1 | 3:1 large | ✅ Pass |
| `profile.meta` (#1c1c1c @ 45%) on `profile.page-bg` | ~6:1 | 4.5:1 | ✅ Pass |
| `profile.sidebar-active-text` (#00b566) on `profile.sidebar-active-bg` (@ 10%) | ~8:1 | 4.5:1 | ✅ Pass |
| Status badges: coloured text on 12% tinted bg | ~6–9:1 | 4.5:1 | ✅ Pass |
| `profile.danger-text` (#dc2626) on `profile.page-bg` | ~5.8:1 | 4.5:1 | ✅ Pass |

### 23.2 Full ARIA Map

| Component | ARIA |
|---|---|
| Sidebar nav | `role="navigation"`, `aria-label="Account navigation"` |
| Sidebar nav item (active) | `aria-current="page"` |
| Sidebar badge | `aria-label="[n] [item type]"` |
| Sign Out button | `aria-label="Sign out of your account"` |
| Mobile tab bar | `role="tablist"`, `role="tab"`, `aria-selected` |
| Avatar edit button | `aria-label="Change profile photo"` |
| Order filter tabs | `role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls` |
| Status badge | `aria-label="Order status: [status]"` |
| Order tracking modal | `role="dialog"`, `aria-modal`, `aria-labelledby` |
| Tracking steps | `role="list"`, current step `aria-current="step"` |
| "Show more" items | `aria-expanded` on toggle |
| Wishlist remove | `aria-label="Remove [name] from wishlist"` |
| Select all checkbox | `aria-label="Select all wishlist items"`, `aria-checked` |
| Plant care watering due | `aria-label="Water [plant name] in [n] days"` |
| Overflow menu (⋮) | `aria-haspopup="menu"`, `aria-expanded`, `role="menu"` items |
| Add plant modal | `role="dialog"`, `aria-modal`, focus trap |
| Form error messages | `role="alert"`, `aria-live="polite"`, `aria-describedby` on inputs |
| Invalid inputs | `aria-invalid="true"` |
| Password show/hide | `aria-label="Show/hide password"`, `aria-pressed` |
| Password strength | `role="status"`, `aria-live="polite"` |
| Char counter | `aria-live="polite"` every 10 chars |
| Loyalty progress bar | `aria-label="[n] of [max] points to [tier]"` |
| Loyalty tier table | `role="table"`, active row `aria-selected` |
| Notification item | `aria-label` includes read/unread state |
| Notification toggle | `role="switch"`, `aria-checked` |
| Star rating input | `role="radiogroup"`, `role="radio"`, `aria-checked` |
| Toggle switches | `role="switch"`, `aria-checked`, `aria-labelledby` |
| Sign out confirm modal | `role="dialog"`, focus on "Cancel" on open |
| Delete account button | `aria-label="Delete your account permanently"` |
| Toast notification | `role="status"`, `aria-live="polite"` |
| Skeleton sections | `aria-busy="true"`, `aria-label="Loading [section]"` |

### 23.3 Keyboard Navigation Map

| Key | Behaviour |
|---|---|
| `Tab` | Moves through all interactive elements in DOM order |
| `Arrow Up/Down` | Cycles through sidebar nav items |
| `Arrow Left/Right` | Switches order filter tabs / review tabs |
| `Enter / Space` | Activates button, link, checkbox, toggle |
| `Escape` | Closes modal / dropdown / overflow menu |
| `Arrow keys` (star rating) | Changes rating 1–5 |
| `Arrow keys` (slider) | Adjusts price / loyalty slider value |
| `Delete` (notification) | Deletes focused notification (after confirm) |
| `Tab` in modal | Cycles within modal only (focus trap) |
| `Shift+Tab` | Reverses Tab direction |

### 23.4 Testable Acceptance Criteria

| # | Criterion | Method | Pass |
|---|---|---|---|
| A1 | No contrast failures | axe DevTools | Zero critical |
| A2 | All focus rings visible (`2px solid #00b566`) | Manual Tab | Every element |
| A3 | Sidebar active item has `aria-current="page"` | Screen reader | Announced on load |
| A4 | Modal traps focus | Keyboard | Tab cycles inside only |
| A5 | Modal closes on Escape; focus returns | Keyboard | Both conditions met |
| A6 | Status badges not colour-only | Screen reader | `aria-label` includes status text |
| A7 | Star rating keyboard-operable | Keyboard | Arrows + Enter change/confirm rating |
| A8 | Toggle switches use `role="switch"` + `aria-checked` | Screen reader | State announced on toggle |
| A9 | Form validation announced on error | Screen reader | `aria-live` fires; `aria-invalid` set |
| A10 | Skeleton announces loading state | Screen reader | `aria-busy="true"` announced |
| A11 | Toast announces save/error | Screen reader | `role="status"` fires |
| A12 | Password strength announced | Screen reader | `aria-live="polite"` fires |
| A13 | Notification read/unread state in `aria-label` | Screen reader | State included in label |
| A14 | Loyalty bar has text equivalent | Screen reader | `aria-label` with points/tier |
| A15 | `prefers-reduced-motion` respected | OS setting | All animations disabled |

---

## 24. Content & Tone Standards

### 24.1 Headings

- Must: Sentence case — `"My orders"` not `"MY ORDERS"`
- Must: Include count in heading where relevant — `"My Orders (12)"`
- Must not: Use ALL CAPS

### 24.2 CTA Labels

| Action | Label | Never use |
|---|---|---|
| Save profile | `"Save Changes"` | `"Submit"`, `"Update"` |
| Add address | `"Save Address"` | `"Add"`, `"Confirm"` |
| Add plant | `"Save Plant"` | `"Add"`, `"Create"` |
| Submit review | `"Submit Review"` | `"Post"`, `"Send"` |
| Redeem points | `"Apply to Next Order"` | `"Redeem"` alone |
| Sign out | `"Yes, Sign Out"` | `"Logout"`, `"Log Out"` |
| Delete account | `"Delete My Account"` | `"Confirm"`, `"Proceed"` |

### 24.3 Empty States

- Must: Explain what's missing in plain language
- Must: Offer one clear action to remedy it
- Must not: Show a generic `"No data found"` message

### 24.4 Error Messages

| Error | Message |
|---|---|
| Required field | `"[Field name] is required."` |
| Invalid email | `"Enter a valid email address."` |
| Invalid phone | `"Enter a valid 10-digit mobile number."` |
| Password too short | `"Password must be at least 8 characters."` |
| Passwords don't match | `"Passwords don't match. Try again."` |
| Review too short | `"Your review must be at least 50 characters."` |
| Pincode not found | `"We couldn't find this pincode. Enter city manually."` |
| Network error | `"Something went wrong. Please try again."` |
| Session expired | `"Your session has expired. Please sign in again."` (redirects to login) |

### 24.5 Loyalty Tier Names

| Tier | Name | Icon |
|---|---|---|
| 0–499 pts | Plant Lover | 🌿 |
| 500–999 pts | Silver Green Thumb | 🥈 |
| 1000+ pts | Gold Garden Expert | 🥇 |

---

## 25. Anti-Patterns & Prohibited Implementations

| Anti-pattern | Why prohibited | Correct approach |
|---|---|---|
| Raw hex `#00b566` in CSS | Breaks token system | Use `color.surface.raised` |
| `outline: none` on any element | Kills keyboard access | `outline: 2px solid color.surface.raised` always |
| "Delete Account" with single click | Irreversible action — no safeguard | Multi-step confirm: warning modal → type "DELETE" → password confirm |
| Status badge with colour only | Fails WCAG 1.4.1 | Always include text label + `aria-label` |
| Form submit without validation | Data loss / corrupt state | Validate on blur (per field) + on submit |
| Password field without show/hide toggle | Poor UX, especially mobile | Always include `👁` show/hide toggle |
| Notification preferences without save feedback | User unsure if saved | Auto-save on toggle + success toast |
| Modal without focus trap | Keyboard escapes modal | Focus trap required on all modals |
| Modal without Escape key close | Keyboard user stuck | Escape must close all modals |
| "Sign Out" with no confirmation | Accidental sign-out | Always show confirm modal |
| Order tab filter that reloads page | Breaks back-navigation | Client-side filter, no page reload |
| Loyalty points bar without `aria-label` | Screen reader can't interpret graph | `aria-label="240 of 500 points to Silver"` |
| Skeleton duration > 2s with no error state | User assumes broken page | Show error state + retry after 10s timeout |
| Inline star rating without keyboard support | Mouse-only interaction | `role="radiogroup"` with arrow-key navigation |
| Toggle switch styled as checkbox | Misrepresents control type | Use `role="switch"` not `role="checkbox"` |
| "Remove" without undo option | Data loss with no recovery | Toast with `"Undo"` button for 5s after remove |

---

## 26. Edge-Case Handling

| Scenario | Behaviour |
|---|---|
| User has no orders | Orders section shows full empty state (§9.6) |
| User has no saved addresses | Addresses section shows empty state + "Add First Address" CTA |
| User has 0 loyalty points | Progress bar at 0%; `"Earn points with your first order"` prompt |
| Profile photo fails to upload | Error toast: `"Photo couldn't be uploaded. File must be JPG, PNG, or WebP under 5MB."` |
| Email change: new email already registered | `"This email is already linked to another account."` error inline |
| Session expires mid-session | Toast: `"Session expired. Signing you in again..."` → redirect to login |
| Avatar initials: double-barrelled name | Use first letter of first word only |
| Name > 28 chars in sidebar | Truncate with ellipsis; full name in `title` attribute |
| 100+ orders | Paginate at 20 per page; show load-more button; or infinite scroll |
| User has no payment methods | Section shows `"No payment methods saved"` + add CTA |
| Plant watering overdue by 3+ days | Urgent badge: red `"Overdue!"` instead of amber |
| Network failure on save | Error toast with retry button; form state preserved |
| User revokes photo permission on mobile | Camera option hidden; file upload only |
| Points expire (if applicable) | Show expiry warning: amber banner `"120 pts expire in 30 days"` |
| Review already submitted for order | "Write a Review" button replaced by "Edit Review" |
| Delete account with pending orders | Block deletion: `"Please wait for your active orders to be fulfilled before deleting."` |

---

## 27. Performance Specification

| Metric | Target |
|---|---|
| LCP | `< 2.5s` — sidebar + overview above fold |
| CLS | `< 0.1` — all images/avatars have explicit dimensions |
| INP | `< 200ms` — tab switches, form validation, toggle updates |
| FCP | `< 1.8s` — critical CSS inlined |

**Loading strategy:**

| Element | Strategy |
|---|---|
| Sidebar + profile hero | Eager — above fold, SSR |
| Order cards (first 5) | Eager |
| Order cards (6+) | Lazy, load on scroll |
| Product thumbnails in orders | `loading="lazy"`, `decoding="async"` |
| Wishlist grid | Lazy — load on tab switch |
| My Plants section | Lazy — load on tab switch |
| Loyalty history | Lazy — collapsed by default |

---

## 28. Page Sections — Full Structure

```
ANNOUNCEMENT BAR              — shared component
NAVIGATION BAR                — authenticated state, avatar shown
BREADCRUMB                    — Home / My Account
─────────────────────────────────────────────────────────────
LEFT SIDEBAR (260px, sticky)
│  Profile hero (avatar + name + tag + points bar)
│  Nav items (10 sections)
│  Sign out
─────────────────────────────────────────────────────────────
MAIN CONTENT AREA (active section renders here)
│
├── OVERVIEW DASHBOARD (default)
│     Quick stats row (4 cards)
│     Recent order preview card
│     Wishlist preview card
│     Loyalty points card
│
├── MY ORDERS
│     Filter tabs + search + sort
│     Order cards (with tracking modal)
│     Empty state
│
├── WISHLIST
│     Actions bar (select all, bulk actions)
│     4-col product grid
│     Empty state
│
├── MY PLANTS
│     Plant care cards (with watering log, notes)
│     Add a Plant modal
│     Empty state
│
├── PERSONAL INFO
│     Avatar + photo upload
│     Profile form (9 fields)
│     Email verification banner (conditional)
│
├── ADDRESSES
│     Address card grid (2-col)
│     Add/Edit address modal
│
├── LOYALTY REWARDS
│     Points summary card
│     Tier benefits table
│     Points history table
│     Redeem modal
│
├── PAYMENT METHODS
│     Saved card grid
│     Add card modal
│
├── MY REVIEWS
│     Written / Pending tabs
│     Write/Edit review modal
│
├── NOTIFICATIONS
│     Notification list
│     Notification preferences (toggles)
│
└── SECURITY
      Password change
      2FA toggle
      Active sessions
      Delete account
─────────────────────────────────────────────────────────────
FOOTER                        — shared component
SIGN OUT MODAL                — conditional
TOAST NOTIFICATION LAYER      — z: 300
MODAL OVERLAY LAYER           — z: 200
MOBILE BOTTOM TAB BAR         — z: 100, mobile only
```

---

## 29. Responsive Behaviour Summary

| Breakpoint | Sidebar | Content | Modals |
|---|---|---|---|
| `≥ 1024px` | Visible, `260px` sticky | Two-column layout | Centred overlays |
| `768–1023px` | Visible, `220px` sticky | Two-column compressed | Centred overlays |
| `< 768px` | Hidden → bottom tab bar | Full-width, single column | Full-screen bottom sheets |
| `< 480px` | Tab bar icons only; "Profile" opens full drawer | Compact cards; form single-column | Full-screen bottom sheets |

---

## 30. QA Checklist

### Visual
- [ ] Page background: `color.surface.strong` (#fefcf9)
- [ ] All text: `Outfit` font family
- [ ] No raw hex in CSS — tokens only
- [ ] Sidebar active item: green left bar + green text + green bg tint
- [ ] Avatar: correct initials / photo, `radius.step7`
- [ ] Loyalty progress bar: green fill, correct percentage
- [ ] Status badges: correct colour per status, with icon
- [ ] Order cards: shadow on card, dividers between items
- [ ] Plant care cards: watering due colour changes (green/amber/red)
- [ ] Toggle switches: green when on, grey when off
- [ ] Skeleton shimmer: correct dimensions per element
- [ ] Toast: correct left-border colour per variant

### Interaction
- [ ] Sidebar nav: clicking item loads section, updates active state
- [ ] Mobile tab bar: tapping tab switches section
- [ ] Profile photo: hover reveals edit overlay + camera icon
- [ ] Order filter tabs switch order list client-side
- [ ] Order "Show more items" expands inline
- [ ] Track Order modal opens; Escape closes; focus returns to button
- [ ] Wishlist: remove item; undo toast appears for 5s
- [ ] Wishlist bulk: select all enables bulk actions
- [ ] Plant card overflow menu (⋮) opens; Escape closes
- [ ] Log watering updates watering due date
- [ ] Pincode auto-fills city + state
- [ ] Password show/hide toggles field type
- [ ] Password strength meter updates on keystroke
- [ ] Char counter updates on textarea input
- [ ] Notification toggle: auto-saves, shows success toast
- [ ] Delete account: multi-step confirm works; correct blocker if active orders

### Accessibility
- [ ] axe DevTools: zero critical/serious errors
- [ ] All focus rings: `2px solid #00b566` on every element
- [ ] Sidebar nav `aria-current="page"` on active item
- [ ] All modals: `role="dialog"`, `aria-modal`, focus trap, Escape close
- [ ] Status badges have text label (not colour only)
- [ ] Toggle switches use `role="switch"` + `aria-checked`
- [ ] Star rating uses `role="radiogroup"` + arrow key navigation
- [ ] Form errors: `aria-invalid`, `aria-describedby`, `role="alert"`
- [ ] Loyalty bar has `aria-label` with points and tier
- [ ] Skeleton sections: `aria-busy="true"` on container
- [ ] Toast: `role="status"`, `aria-live="polite"`
- [ ] `prefers-reduced-motion`: all animations disabled

### Content
- [ ] All CTAs match §24.2 label spec exactly
- [ ] All error messages match §24.4 spec
- [ ] Empty states: descriptive message + one clear action CTA
- [ ] Tier names match §24.5 (Plant Lover / Silver / Gold)
- [ ] No ALL CAPS headings
- [ ] Heading count shown in brackets where applicable

### Responsive
- [ ] Sidebar visible ≥ 768px; bottom tab bar below
- [ ] Modals: centred overlay on desktop; bottom sheet on mobile
- [ ] All touch targets ≥ 44×44px
- [ ] No horizontal overflow at 320px viewport
- [ ] Form fields: single column on mobile

---

*Document version: 1.0 — User Profile Page*
*Guideline standard: WCAG 2.2 AA | Token system: Outfit / Hero brand token set*
*Companion documents: Homepage design.md · PDP design.md · AI Care design.md · Garden Services design.md · PLP design.md*
*Last updated: June 2026*

---

## 31. SEO & Meta Specification

> Profile pages are authenticated — they must be fully excluded from search engine indexing while still following semantic HTML and accessibility best practices.

### 31.1 Page-Level Meta Tags

| Tag | Value |
|---|---|
| `<title>` | `My Account — Hero Plant Store` |
| `meta description` | No description — authenticated page |
| `robots` | `noindex, nofollow` — must not be crawled or indexed |
| `canonical` | None — authenticated page should not be canonical |
| `og:title` | None — no social sharing of account pages |
| `og:image` | None |
| `meta theme-color` | `#00b566` |

### 31.2 Heading Hierarchy

```
<h1>  My Account                                  (Page title — screen-reader only, visually hidden)
  <h2>  Overview                                  (Default section)
  <h2>  My Orders                                 (§9)
    <h3>  Order #ORD-4821                         (Each order card)
  <h2>  Wishlist                                  (§10)
  <h2>  My Plants                                 (§11)
    <h3>  Monstera Deliciosa                      (Each plant card)
  <h2>  Personal Information                      (§12)
  <h2>  Addresses                                 (§14)
    <h3>  Home Address                            (Each address card)
  <h2>  Loyalty Rewards                           (§13)
  <h2>  Payment Methods                           (§15)
  <h2>  My Reviews                                (§16)
  <h2>  Notifications                             (§17)
  <h2>  Security                                  (§18)
```

**Rule:** `<h1>` must be present and unique per page even if visually hidden — required for screen reader page landmarks. Use `class="sr-only"` to hide visually.

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

### 31.3 Landmark Regions

| Landmark | Element | `aria-label` |
|---|---|---|
| Main nav | `<nav>` | `"Main navigation"` |
| Account nav | `<nav>` | `"Account navigation"` |
| Main content | `<main>` | — |
| Sidebar | `<aside>` | `"Account sidebar"` |
| Active section | `<section>` | `"[Section name]"` |
| Footer | `<footer>` | — |

**Rule:** Must not have two `<nav>` elements without distinct `aria-label` values — screen readers list all landmarks; unlabelled duplicates confuse users.

---

## 32. Authentication & Route Guards

### 32.1 Auth Flow

```
User visits /account
        │
        ├── Authenticated? ──Yes──→ Load profile page
        │
        └── No ──→ Redirect to /account/login
                         │
                         └── After login ──→ Return to /account
                                            (preserve intended destination)
```

### 32.2 Session States

| State | Behaviour |
|---|---|
| Active session | Full page loads normally |
| Session expiring (< 5 min) | Warning toast: `"Your session will expire soon. Stay signed in?"` with `[ Stay Signed In ]` button |
| Session expired mid-page | Modal: `"You've been signed out due to inactivity."` → redirects to login on dismiss |
| Token invalid | Silent redirect to `/account/login?reason=invalid_token` |
| Account suspended | Error page: `"Your account has been suspended. Contact support."` |
| Account deleted | Redirect to `/` with toast: `"Account deleted successfully."` |

### 32.3 Login Page Minimum Spec

| Element | Value |
|---|---|
| Fields | Email + Password (both required) |
| "Forgot Password" | Link below password field, opens `/account/reset` |
| Submit | `"Sign In"`, `color.surface.raised` filled, full-width, `radius.step8` |
| Social login | `[ Continue with Google ]` outlined button below divider `"or"` |
| Register link | `"Don't have an account? Register →"`, `font.size.2xl`, `color.surface.raised` |
| Error (wrong creds) | Inline `role="alert"`: `"Email or password is incorrect."` |
| Error (account locked) | `"Your account is locked after 5 failed attempts. Try again in 15 minutes."` |
| Rate limiting | After 3 failed attempts: CAPTCHA required |
| Redirect after login | Returns to original intended route |
| Page `<title>` | `Sign In — Hero Plant Store` |
| `robots` | `noindex, nofollow` |

### 32.4 Forgot Password Flow

```
/account/login
   → [ Forgot Password ] link
   → /account/reset (email input)
   → Submit → "Check your inbox" confirmation
   → Email link → /account/reset/[token]
   → New password form → Success → Redirect to /account/login
```

| Screen | Key rule |
|---|---|
| Email input | `aria-required`, real-time email format validation |
| Submit | `"Send Reset Link"` label |
| Success screen | `"We've sent a reset link to [email]"` + `"Resend"` link (60s cooldown) |
| Reset form | New password + confirm; strength meter required |
| Token expired | `"This link has expired."` + `"Request a new link"` CTA |

---

## 33. Design System Integration

### 33.1 Shared Components (from Storefront System)

These components must not be reimplemented locally on the profile page. Always use the shared version:

| Component | Defined in | Used on Profile |
|---|---|---|
| Navigation bar (authenticated) | Shared layout | All pages |
| Announcement bar | Shared layout | All pages |
| Footer | Shared layout | All pages |
| Toast notification | Shared utility | Profile: saves, errors, undo |
| Primary CTA button | Shared components | All sections |
| Secondary outlined button | Shared components | All sections |
| Input field (text/email/tel) | Shared form | Personal info, address, review |
| Select / dropdown | Shared form | All forms |
| Textarea | Shared form | Personal info, review |
| Checkbox | Shared form | Wishlist select, notification prefs |
| Toggle switch | Shared form | Notifications, 2FA, availability |
| Modal shell | Shared utility | All profile modals |
| Product card | Shared (PLP) | Wishlist grid |
| Star rating display | Shared | Reviews, order product stars |
| Status badge | Shared | Order status, notification type |
| Skeleton shimmer | Shared utility | All loading states |
| Price display | Shared | Wishlist, orders |

### 33.2 Profile-Exclusive Components

These must not be copied to other pages without design review:

| Component | Notes |
|---|---|
| Sidebar nav | Profile-specific; not reusable in general nav |
| Profile hero (avatar + name + tier) | Profile-specific |
| Loyalty points card | Only on profile and checkout |
| Loyalty tier progress bar | Profile-specific |
| Tier benefits table | Profile-specific |
| Order tracking modal | May be reused on order confirmation page |
| Plant care card | Profile-specific (My Plants section) |
| Watering log button | Profile-specific |
| Notification preference toggles | Profile-specific |
| Active sessions list | Security section only |
| Password strength meter | Login + security only |
| Quick stats row (dashboard) | Profile-specific |
| Mobile bottom tab bar | Profile-specific; replaces sidebar |

### 33.3 Token File Reference

```
tokens/
├── color.json            ← color.text.*, color.surface.*
├── font.json             ← font.family.*, font.size.*, font.weight.*
├── spacing.json          ← space.1 through space.8
├── radius.json           ← radius.xs through radius.step8
├── shadow.json           ← shadow.1 through shadow.4
├── motion.json           ← motion.duration.*
└── semantic/
    └── profile.json      ← profile.* aliases defined here
```

### 33.4 Cross-Page Consistency Rules

| Rule | All pages |
|---|---|
| Must: Nav height `64px` desktop, `56px` mobile | ✓ |
| Must: Focus ring `2px solid color.surface.raised` | ✓ |
| Must: Primary CTA height `44–52px` | ✓ |
| Must: Input height `48px` | ✓ |
| Must: Card `border-radius: radius.md = 12px` | ✓ |
| Must: Toast position bottom-centre fixed | ✓ |
| Must: Modal `radius.xl` with `modal-shadow` | ✓ |
| Must: `Outfit` font family everywhere | ✓ |
| Must not: Introduce new font weights outside 400/600/700/800 | ✓ |
| Must not: Add spacing values outside the token scale | ✓ |

---

## 34. Analytics & Tracking Events

> Every user action on the profile page must fire a structured event for product analytics and personalisation.

### 34.1 Event Definitions

| Event name | Trigger | Properties |
|---|---|---|
| `profile_view` | Page load | `section: "overview"`, `user_tier` |
| `profile_section_switch` | Sidebar nav item click | `section: "[section name]"` |
| `order_tab_switch` | Order filter tab click | `tab: "all|active|delivered|cancelled"` |
| `order_track_open` | "Track Order" click | `order_id`, `order_status` |
| `order_buy_again` | "Buy Again" click | `order_id`, `product_ids[]` |
| `order_cancel_init` | "Cancel Order" click | `order_id` |
| `order_return_init` | "Return / Exchange" click | `order_id` |
| `wishlist_remove` | Remove from wishlist | `product_id`, `product_name` |
| `wishlist_add_to_cart` | "Move to Cart" click | `product_id`, `product_name` |
| `wishlist_bulk_add` | "Add Selected to Cart" | `product_ids[]`, `count` |
| `plant_add_start` | "Add a Plant" click | — |
| `plant_add_complete` | "Save Plant" submit | `plant_name`, `location` |
| `plant_water_log` | "Log Watering" click | `plant_name`, `days_since_last` |
| `profile_save` | "Save Changes" submit | `fields_changed[]` |
| `address_add_start` | "Add New Address" click | — |
| `address_add_complete` | "Save Address" submit | `address_type`, `city` |
| `address_delete` | "Delete" confirm | `address_type` |
| `address_set_default` | "Set as Default" click | `address_type` |
| `loyalty_redeem_start` | "Redeem Points" click | `points_available` |
| `loyalty_redeem_complete` | "Apply to Next Order" | `points_redeemed`, `discount_value` |
| `review_start` | "Write a Review" click | `product_id`, `order_id` |
| `review_submit` | "Submit Review" | `product_id`, `rating`, `has_photo` |
| `review_edit` | "Edit Review" submit | `product_id`, `old_rating`, `new_rating` |
| `notification_toggle` | Toggle switch change | `notification_type`, `channel`, `enabled: true/false` |
| `password_change` | Password save | `trigger: "security_section"` |
| `two_fa_enable` | 2FA enabled | — |
| `signout` | Confirm sign out | `session_duration_minutes` |
| `account_delete_start` | "Delete Account" click | — |
| `account_delete_complete` | Deletion confirmed | `reason` (if collected) |

### 34.2 Data Layer Structure

```javascript
// Profile section switch
window.dataLayer.push({
  event: 'profile_section_switch',
  section: 'my_orders',
  user_tier: 'plant_lover',
  user_points: 240
});

// Order buy again
window.dataLayer.push({
  event: 'order_buy_again',
  order_id: 'ORD-4821',
  product_ids: ['prod-monstera-m', 'prod-peace-lily-s'],
  order_total: 1248
});

// Review submit
window.dataLayer.push({
  event: 'review_submit',
  product_id: 'prod-monstera-m',
  order_id: 'ORD-4821',
  rating: 5,
  has_photo: true,
  char_count: 156
});
```

### 34.3 Personalisation Signals

The following events feed the AI Care and PLP personalisation engines:

| Signal | Source event | Used for |
|---|---|---|
| Owned plant types | `plant_add_complete` | AI Care chat context |
| Browsing category preference | `profile_section_switch` | PLP recommended sort |
| Wishlist product list | `wishlist_remove` (inverse) | PLP "You may also like" |
| Purchase history | `order_buy_again` | Homepage recommendations |
| Loyalty tier | `profile_view.user_tier` | Announcement bar offers |
| Review rating patterns | `review_submit.rating` | Seller analytics |

---

## 35. Shopify Liquid Integration Notes

> The Hero storefront runs on Shopify. These notes bridge the design spec to Shopify-specific implementation.

### 35.1 Account Template Mapping

| Profile section | Shopify template / approach |
|---|---|
| Profile page shell | `templates/customers/account.liquid` |
| Order list | `customers/orders` — Shopify native order object |
| Order detail | `templates/customers/order.liquid` |
| Addresses | `templates/customers/addresses.liquid` |
| Login page | `templates/customers/login.liquid` |
| Register page | `templates/customers/register.liquid` |
| Reset password | `templates/customers/reset_password.liquid` |
| Activate account | `templates/customers/activate_account.liquid` |

### 35.2 Shopify Liquid Objects (Key)

| Data needed | Liquid object |
|---|---|
| Customer name | `{{ customer.first_name }}` / `{{ customer.name }}` |
| Customer email | `{{ customer.email }}` |
| Order list | `{% for order in customer.orders %}` |
| Order number | `{{ order.name }}` (e.g. `#ORD-4821`) |
| Order date | `{{ order.created_at | date: "%d %b %Y" }}` |
| Order status | `{{ order.financial_status }}` · `{{ order.fulfillment_status }}` |
| Order total | `{{ order.total_price | money }}` |
| Order items | `{% for line_item in order.line_items %}` |
| Line item name | `{{ line_item.title }}` |
| Line item image | `{{ line_item.image | img_url: '120x120' }}` |
| Line item price | `{{ line_item.final_price | money }}` |
| Address list | `{% for address in customer.addresses %}` |
| Default address | `{{ customer.default_address }}` |
| Metafields (plants, points) | `{{ customer.metafields.profile.my_plants }}` |
| Tags (tier) | `{% if customer.tags contains 'gold-tier' %}` |

### 35.3 Shopify Metafield Schema

Non-native profile data stored as customer metafields:

| Namespace | Key | Type | Usage |
|---|---|---|---|
| `profile` | `display_name` | `single_line_text_field` | Custom display name |
| `profile` | `about_me` | `multi_line_text_field` | About me bio |
| `profile` | `avatar_url` | `url` | Uploaded avatar CDN URL |
| `profile` | `loyalty_points` | `number_integer` | Current Green Points balance |
| `profile` | `loyalty_tier` | `single_line_text_field` | `plant_lover` / `silver` / `gold` |
| `profile` | `tier_updated_at` | `date_time` | Last tier change timestamp |
| `plants` | `my_plants` | `json` | Array of plant diary entries |
| `preferences` | `language` | `single_line_text_field` | `en` / `hi` / `mr` etc. |
| `preferences` | `notifications` | `json` | Per-channel notification prefs |
| `preferences` | `currency` | `single_line_text_field` | `INR` / `USD` |

### 35.4 Wishlist Implementation

Shopify does not natively support wishlists. Implementation options:

| Option | Approach | Notes |
|---|---|---|
| Customer metafield | Store product IDs as JSON in `wishlist.items` metafield | Simplest; survives device switch |
| localStorage | Store client-side per browser | Lost on device switch; no auth sync |
| Third-party app | Wishlist Hero, Growave | Adds cost; fastest to ship |

**Recommended:** Customer metafield — syncs across devices, no third-party dependency.

Update metafield via Shopify Admin API or Storefront API on wishlist toggle:

```javascript
// AJAX call on wishlist toggle
fetch('/cart/update.js', { ... }) // proxy to Admin API
// OR use Shopify Storefront API customerUpdate mutation
```

### 35.5 Loyalty Points Implementation

Shopify does not natively support loyalty points. Options:

| Option | Notes |
|---|---|
| Customer metafields | Store balance + history in JSON metafields; update via Admin API on order completion |
| Shopify Flow + metafields | Automate point addition on `order/paid` trigger via Flow workflow |
| Third-party (Smile.io, LoyaltyLion) | Full-featured; faster; adds cost |

**Recommended for MVP:** Shopify Flow + metafields. Full app integration in v2.

### 35.6 Notification Preferences

Store as JSON metafield `preferences.notifications`:

```json
{
  "order_updates":    { "email": true,  "push": true,  "sms": false },
  "watering":         { "email": false, "push": true,  "sms": false },
  "price_drops":      { "email": true,  "push": false, "sms": false },
  "offers":           { "email": true,  "push": false, "sms": false },
  "loyalty":          { "email": true,  "push": true,  "sms": false }
}
```

Update on toggle change via debounced AJAX (500ms after last toggle, not per-toggle).

---

## 36. Component Migration Notes

### 36.1 Token Adoption Priority

| Priority | Token group | Impact if skipped |
|---|---|---|
| P0 — Critical | `color.surface.raised` (focus ring, CTA bg, active states) | WCAG failure; brand inconsistency |
| P0 — Critical | `profile.danger-text` (destructive actions) | Red actions may blend with body text |
| P1 — High | All `font.size.*` tokens | Typography regressions |
| P1 — High | `radius.xs` through `radius.step8` | Shape inconsistency |
| P2 — Medium | `shadow.1` through `shadow.4` | Elevation inconsistency |
| P2 — Medium | `motion.duration.*` | Animation timing inconsistency |
| P3 — Low | Composed `card-shadow`, `modal-shadow` | Polish only |

### 36.2 Raw Values to Replace

| Raw value in use | Replace with token | Where |
|---|---|---|
| `#00b566` | `color.surface.raised` | CTAs, active states, focus rings |
| `#1c1c1c` | `color.text.secondary` | Headings |
| `#212326` | `color.text.inverse` | Body copy |
| `#fefcf9` | `color.surface.strong` | Page bg, card bg |
| `#ffffff` | `color.surface.base` (white alias) | Modal bg |
| `#dc2626` | `profile.danger-text` | Destructive buttons |
| `#c8a84b` | `profile.star-fill` | Star ratings |
| `#16a34a` | `profile.status-delivered` | Delivered badge |
| `#d97706` | `profile.status-processing` | Processing badge |
| `#2563eb` | `profile.status-shipped` | Shipped badge |
| `#7c3aed` | `profile.status-returned` | Returned badge |
| `border-radius: 50%` | `radius.step7` | Avatar, icon buttons |
| `border-radius: 9999px` | `radius.step8` | Pills, CTA buttons |
| `font-size: 14px` | `font.size.2xl` | Body copy |
| `font-size: 16px` | `font.size.4xl` | Card headings |

### 36.3 CSS Custom Property Naming

```css
/* ✅ Correct — kebab-case, token-named */
--color-surface-raised: #00b566;
--profile-danger-text: #dc2626;
--profile-status-delivered: #16a34a;
--radius-step8: 9999px;
--motion-duration-fast: 250ms;

/* ❌ Incorrect — never use */
--green: #00b566;
--dangerColor: #dc2626;
--pillRadius: 9999px;
--animFast: 250ms;
```

---

## 37. Component State Master Table

> Single-reference summary of all interactive profile page components and their required states.

| Component | Default | Hover | Focus-visible | Active | Disabled | Loading | Error | Success |
|---|---|---|---|---|---|---|---|---|
| Sidebar nav item | Transparent bg, `profile.body` | `profile.sidebar-hover-bg`, `profile.heading` | `2px` focus ring | — | — | — | — | — |
| Sidebar nav item (active) | `profile.sidebar-active-bg`, green left bar | Same + deepened | `2px` focus ring | — | — | — | — | — |
| Avatar edit button | Hidden overlay | Dark overlay + camera icon visible | `2px` focus ring | — | — | — | — | — |
| Mobile tab item | `profile.meta` icon/label | — | `2px` focus ring | `color.surface.raised` icon/label + top bar | — | — | — | — |
| Primary CTA button | `color.surface.raised` bg | Darken 10% | `2px` focus ring, offset `2px` | Scale `0.98` | `opacity: 0.4`, `aria-disabled` | Spinner, `aria-busy` | Error toast | `"✓ Saved"` auto-revert |
| Secondary outlined button | Transparent, `shadow.3` border | `color.surface.raised` bg, `color.text.tertiary` text | `2px` focus ring | Scale `0.98` | `opacity: 0.4` | Spinner | — | — |
| Danger outlined button | Transparent, `profile.danger-border` | `profile.danger-text` @ 8% bg | `2px` focus ring `profile.danger-text` | Scale `0.98` | `opacity: 0.4` | — | — | — |
| Danger text link | `profile.danger-text`, no underline | Underline appears | `2px` focus ring | — | `opacity: 0.3` | — | — | — |
| Form input | `shadow.3` border, `profile.input-bg` | Darken border | `2px solid profile.input-focus` + glow | — | Muted bg, `shadow.1` | — | Red border + `role="alert"` | Green border `shadow.4` |
| Form select | Same as input | Same | Same | — | Same | — | Same | Same |
| Form textarea | Same as input | Same | Same | — | Same | — | Same | Same |
| Checkbox | `shadow.3` border, white bg | `shadow.4` border | `2px` focus ring | — | Muted, `aria-disabled` | — | — | `color.surface.raised` fill + ✓ |
| Toggle switch | Grey track, left thumb | — | `2px` focus ring | — | `opacity: 0.4` | — | — | `color.surface.raised` track, right thumb |
| Star rating input | Empty stars `profile.divider` | Fills to hovered star | `2px` focus ring on selected | — | `opacity: 0.4` | — | — | Stars filled to rated value |
| Order filter tab | `shadow.3` border, transparent | `shadow.4` border | `2px` focus ring | — | — | — | — | — |
| Order filter tab (active) | `color.surface.raised` bg, `color.text.tertiary` | Darken 5% | `2px` focus ring | — | — | — | — | — |
| Sort dropdown trigger | `shadow.3` border | `shadow.4` border | `2px` focus ring | — | — | — | — | — |
| Sort option | Transparent | `profile.sidebar-hover-bg` | `2px` focus ring | — | — | — | — | Selected: green ✓ |
| Wishlist product card | `shadow.2` border | `card-hover` shadow, `translateY(-2px)` | `2px` focus ring | — | — | — | — | — |
| Wishlist remove (×) | `profile.meta` | `profile.danger-text` | `2px` focus ring | — | — | — | — | — |
| "Move to Cart" button | `color.surface.raised` filled | Darken 10% | `2px` focus ring | Scale `0.98` | — | Spinner | Error state | `"✓ Added"` |
| Overflow menu trigger (⋮) | `profile.meta` | `color.surface.raised` | `2px` focus ring | — | — | — | — | — |
| Overflow menu item | Transparent | `profile.sidebar-hover-bg` | `2px` focus ring | — | — | — | — | — |
| Plant care card | `shadow.2` | `card-shadow` deepen | `2px` focus ring | — | — | — | — | — |
| "Log Watering" button | `shadow.3` border | `shadow.4` border | `2px` focus ring | Scale `0.98` | — | Spinner | Error toast | `"✓ Logged"` + date updated |
| Address card | `shadow.2` (default) · `shadow.4` (default addr) | `card-shadow` | `2px` focus ring | — | — | — | — | — |
| "Set as Default" link | `color.surface.raised`, no underline | Underline | `2px` focus ring | — | Hidden (already default) | — | — | — |
| Loyalty progress bar | `color.surface.raised` fill to % | Tooltip on hover | `2px` focus ring (if interactive) | — | — | — | — | — |
| Notification item | Unread: green left bar + tinted bg | Highlight row | `2px` focus ring | Mark as read | — | — | — | — |
| Notification toggle | See toggle switch row | — | — | — | — | — | — | — |
| Password show/hide | 👁 icon, `profile.meta` | `color.surface.raised` | `2px` focus ring | — | — | — | — | — |
| Password strength bar | Segment fills per strength | — | — | — | — | — | — | — |
| Modal `×` close button | `profile.meta` | `profile.heading` | `2px` focus ring | Scale `0.95` | — | — | — | — |
| Tracking step dot (complete) | `color.surface.raised` filled | — | — | — | — | — | — | — |
| Tracking step dot (current) | `color.surface.raised` + pulse ring | — | — | — | — | — | — | — |
| Tracking step dot (pending) | `profile.divider` border | — | — | — | — | — | — | — |
| Carousel arrow (prev/next) | `shadow.3` border | `color.surface.raised` bg | `2px` focus ring | Scale `0.95` | `opacity: 0.3`, `aria-disabled` | — | — | — |
| Toast notification | Auto-visible, slides up | — | — | — | — | — | — | Auto-dismisses `3000ms` |
| Skeleton element | Shimmer animation | — | — | — | — | — | — | Fades out when content loads |
| Sign Out link | `profile.danger-text`, no underline | Underline + `profile.danger-text` @ 8% bg | `2px` focus ring | — | — | — | — | — |

---

## 38. Reduced Motion Specification

> All animations must respect `prefers-reduced-motion: reduce`. This is a WCAG 2.5.3 requirement and must be tested before release.

### 38.1 Animation Removal Map

| Animation | With motion | With reduced motion |
|---|---|---|
| Page section load stagger | `fadeUp` + `translateY`, `motion.duration.slow` | Instant opacity change |
| Skeleton shimmer | Continuous `shimmer` keyframe | Static `profile.skeleton-base` colour — no shimmer |
| Card hover `translateY(-4px)` | `transform: translateY(-4px)`, `motion.duration.fast` | Colour/border change only, no transform |
| Modal open (scale + fade) | `scale(0.96→1)` + opacity, `motion.duration.normal` | Instant opacity only |
| Sidebar nav item hover | `background-color`, `motion.duration.instant` | Instant (already instant — keep) |
| CTA button scale on active | `scale(0.98)`, `motion.duration.instant` | No scale — colour change only |
| Tracking dot pulse ring | CSS `pulse` keyframe, infinite | Hidden entirely |
| Toggle switch thumb slide | `translateX`, `motion.duration.instant` | Instant position change |
| Order tracking step connector fill | Height animation | Instant |
| Progress bar fill | Width animation on mount | Instant final width |
| Toast slide up | `translateY(100%→0)`, `motion.duration.fast` | Instant appearance |
| Avatar hover overlay | Opacity transition | Instant |
| FAQ accordion height | `height` animation | Instant `display: block/none` |
| Wishlist remove fade | Opacity + `translateX`, `motion.duration.fast` | Instant removal |
| Count-up animation (quick stats) | Numeric count-up, `motion.duration.slow` | Instant final value |

### 38.2 CSS Implementation

```css
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
```

**Note:** The `0.01ms` approach (not `0ms`) is intentional — it fires `transitionend` and `animationend` events, preventing JavaScript that listens to these events from breaking.

---

## 39. Internationalisation (i18n) Notes

> The storefront targets Indian users primarily. These rules ensure the profile page handles Indian-specific formats and future language expansion.

### 39.1 Number & Currency Formatting

| Format | Rule | Example |
|---|---|---|
| Currency | Always `₹` prefix, no decimals | `₹1,248` not `₹1248.00` |
| Large numbers | Indian numbering system (lakh/crore) | `₹1,00,000` not `₹100,000` |
| Points | Always suffix `pts` | `240 pts` |
| Phone | `+91` prefix, 10-digit format | `+91 98765 43210` |
| Pincode | 6-digit | `411045` |

### 39.2 Date & Time Formatting

| Context | Format | Example |
|---|---|---|
| Order date | `DD MMM YYYY` | `15 Jun 2026` |
| Timestamp (notifications) | Relative: `2 hrs ago`, `3 days ago`, `Just now` | — |
| Absolute fallback (> 7 days) | `DD MMM YYYY` | `08 Jun 2026` |
| Date input | `DD / MM / YYYY` | `15 / 06 / 2026` |
| Relative threshold | Switch to absolute after 7 days | — |

### 39.3 Language Support (Future)

Prepare component strings for i18n by externalising all copy into locale keys:

```json
{
  "profile.welcome": "Welcome back, {{firstName}} 🌿",
  "profile.overview.subtitle": "Here's what's growing in your account.",
  "profile.orders.heading": "My Orders ({{count}})",
  "profile.orders.empty.heading": "No orders yet",
  "profile.orders.empty.body": "Start exploring our plants and bring green into your space.",
  "profile.orders.empty.cta": "Shop Plants",
  "profile.cta.save_changes": "Save Changes",
  "profile.cta.add_plant": "+ Add a Plant",
  "profile.error.required": "{{field}} is required.",
  "profile.error.invalid_email": "Enter a valid email address.",
  "profile.tier.plant_lover": "Plant Lover",
  "profile.tier.silver": "Silver Green Thumb",
  "profile.tier.gold": "Gold Garden Expert"
}
```

**Supported languages (planned):** English (default) → Hindi → Marathi → Tamil → Telugu.

**RTL:** Not required for initial launch. Arabic/Urdu support flagged for future.

---

## 40. Final Summary — Section Map

```
Profile Page — 40 Sections
─────────────────────────────────────────────────────────
CORE SPEC (§1–§30)
§1   Context & Goals
§2   Design Tokens (Typography, Color, Spacing, Radius, Shadow, Motion)
§3   Page Layout & Grid
§4   Navigation Bar
§5   Breadcrumb
§6   Left Sidebar (shell, profile hero, nav items)
§7   Mobile Bottom Tab Bar
§8   Overview Dashboard (welcome, quick stats, preview cards)
§9   My Orders (filter tabs, search, order cards, tracking modal, empty state)
§10  Wishlist (grid, actions bar, empty state)
§11  My Plants (plant care cards, watering log, add plant modal, empty state)
§12  Personal Info (avatar, form, email verification banner)
§13  Loyalty Rewards (points card, tier table, history, redeem modal)
§14  Addresses (card grid, add/edit modal)
§15  Payment Methods (saved cards, add card modal)
§16  My Reviews (written/pending tabs, review modal, star rating)
§17  Notifications (list, read/unread, preferences toggles)
§18  Security (password, 2FA, sessions, delete account)
§19  Modals — Universal Rules
§20  Sign Out Confirm Modal
§21  Toast Notifications
§22  Skeleton Loading States
§23  Accessibility Requirements (contrast, ARIA map, keyboard, criteria × 15)
§24  Content & Tone Standards (headings, CTAs, errors, tier names)
§25  Anti-Patterns & Prohibited Implementations (× 16)
§26  Edge-Case Handling (× 16)
§27  Performance Specification (LCP/CLS/INP targets, image strategy)
§28  Page Sections — Full Structure
§29  Responsive Behaviour Summary
§30  QA Checklist (× 42 checkboxes)

EXTENDED IMPLEMENTATION GUIDE (§31–§40)
§31  SEO & Meta (noindex rules, heading hierarchy, landmark regions)
§32  Authentication & Route Guards (auth flow, session states, login page)
§33  Design System Integration (shared vs exclusive components, token files)
§34  Analytics & Tracking Events (× 28 events, data layer, personalisation)
§35  Shopify Liquid Integration (templates, liquid objects, metafields, wishlist, loyalty)
§36  Component Migration Notes (token priority, raw value replacement, CSS naming)
§37  Component State Master Table (× 35 components × 8 states each)
§38  Reduced Motion Specification (× 15 animations mapped, CSS implementation)
§39  Internationalisation (number/currency/date formats, i18n keys, language plan)
§40  Final Summary — Section Map (this section)
─────────────────────────────────────────────────────────
Total: ~2,400 lines | WCAG 2.2 AA | Outfit token system
Companion docs: Homepage · PDP · AI Care · Garden Services · PLP
Last updated: June 2026
```

---

*Document version: 1.0 (complete) — User Profile Page*
*Sections: 1–30 (core spec) + 31–40 (extended implementation guide)*
*Guideline standard: WCAG 2.2 AA | Token system: Outfit / Hero brand token set*
*Companion documents: Homepage design.md · PDP design.md · AI Care design.md · Garden Services design.md · PLP design.md*
*Last updated: June 2026*
