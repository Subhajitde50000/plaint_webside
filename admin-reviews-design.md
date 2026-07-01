# Admin — Reviews Module
## Design Specification v1.0 — Production-Ready

> **Design intent:** Deliver a fast, low-friction moderation interface that lets support and marketing staff approve, reject, reply to, and analyse customer reviews at scale — surfacing flagged content first, enabling bulk moderation, and connecting review sentiment back to specific products and customers — in a dark-theme admin environment that is keyboard-first, WCAG 2.2 AA compliant, and built to keep the moderation queue at zero.

---

## 1. Context & Goals

| Property | Value |
|---|---|
| **Module name** | Reviews |
| **URLs** | `/admin/reviews` (list/queue) · `/admin/reviews/[id]` (detail drawer) · `/admin/reviews/analytics` |
| **Parent** | Admin Dashboard (`admin-dashboard-design.md`) |
| **Primary goal** | Keep the moderation queue near-zero by making approve/reject/reply fast and keyboard-driven |
| **Secondary goals** | Surface flagged/reported reviews first; connect reviews to products and customers; track rating trends per product |
| **User roles** | Super Admin (full) · Operations Manager (full) · Customer Support (full) · Marketing (view + reply) · Analyst (read-only) |
| **No access** | Inventory Manager · Garden Services Coordinator |
| **Linked modules** | Products · Customers · Orders · Analytics |
| **Page density** | Tables: 2 · Cards: ~20 · Buttons: ~40 · Inputs: ~15 · Charts: 3 |
| **Volume** | Designed for 5,000+ reviews; virtual scroll required beyond 100 rows |

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
| `admin.color.bg.overlay` | `#2d333b` | Modals, drawers |
| `admin.color.text.primary` | `#cdd9e5` | Primary text |
| `admin.color.text.secondary` | `#768390` | Muted text |
| `admin.color.text.tertiary` | `#adbac7` | Labels |
| `admin.color.text.placeholder` | `#545d68` | Input placeholder |
| `admin.color.brand.green` | `#00b566` | CTAs, active, accent |
| `admin.color.brand.green.muted` | `#00b566` @ 15% | Selected bg |
| `admin.color.border.default` | `#444c56` | Borders |
| `admin.color.border.active` | `#00b566` | Focus, active |
| `admin.color.status.success` | `#57ab5a` | Published, approved |
| `admin.color.status.warning` | `#c69026` | Pending, flagged |
| `admin.color.status.error` | `#e5534b` | Rejected, reported |
| `admin.color.status.info` | `#539bf5` | Replied, info |
| `admin.color.status.purple` | `#986ee2` | Featured review |

### 2.2 Reviews Module Semantic Aliases

| Alias | Maps to | Usage |
|---|---|---|
| `rev.page-bg` | `admin.color.bg.canvas` | Page background |
| `rev.card-bg` | `admin.color.bg.surface` | All panels |
| `rev.card-hover` | `admin.color.bg.elevated` | Row/card hover |
| `rev.input-bg` | `admin.color.bg.elevated` | All inputs |
| `rev.overlay-bg` | `admin.color.bg.overlay` | Drawers, modals |
| `rev.text` | `admin.color.text.primary` | Primary text |
| `rev.text-muted` | `admin.color.text.secondary` | Meta, timestamps |
| `rev.text-label` | `admin.color.text.tertiary` | Headers, labels |
| `rev.border` | `admin.color.border.default` | All borders |
| `rev.border-muted` | `admin.color.border.default` @ 50% | Subtle dividers |
| `rev.border-active` | `admin.color.border.active` | Focus, active |
| `rev.accent` | `admin.color.brand.green` | CTAs, active filters |
| `rev.accent-bg` | `admin.color.brand.green.muted` | Selected row, chip bg |
| `rev.focus-ring` | `admin.color.brand.green` | Focus ring |
| `rev.focus-glow` | `0 0 0 3px rgba(0,181,102,0.25)` | Focus glow |
| `rev.shadow` | `0 2px 8px rgba(0,0,0,0.25)` | Panel shadow |
| `rev.published` | `admin.color.status.success` | Published review |
| `rev.published-bg` | `admin.color.status.success.bg` | Published badge bg |
| `rev.pending` | `admin.color.status.warning` | Pending moderation |
| `rev.pending-bg` | `admin.color.status.warning.bg` | Pending badge bg |
| `rev.rejected` | `admin.color.status.error` | Rejected review |
| `rev.rejected-bg` | `admin.color.status.error.bg` | Rejected badge bg |
| `rev.flagged` | `admin.color.status.error` | Flagged/reported |
| `rev.flagged-bg` | `admin.color.status.error` @ 10% | Flagged row tint |
| `rev.replied` | `admin.color.status.info` | Admin replied |
| `rev.replied-bg` | `admin.color.status.info.bg` | Replied badge bg |
| `rev.featured` | `admin.color.status.purple` | Featured review |
| `rev.featured-bg` | `admin.color.status.purple.bg` | Featured badge bg |
| `rev.danger` | `admin.color.status.error` | Destructive actions |
| `rev.star-fill` | `#c8a84b` | Star rating fill (amber) |
| `rev.star-empty` | `admin.color.border.default` | Star rating empty |
| `rev.verified` | `admin.color.status.success` | Verified purchase badge |

### 2.3 Typography

| Role | Size | Weight | Colour |
|---|---|---|---|
| Page heading | `font.size.5xl` (24px) | 700 | `rev.text` |
| KPI value | `font.size.6xl` (32px) | 800 | `rev.text` |
| KPI label | `font.size.sm` (12px) | 500 | `rev.text-muted` |
| Section heading | `font.size.4xl` (18px) | 700 | `rev.text` |
| Panel heading | `font.size.3xl` (16px) | 600 | `rev.text` |
| Reviewer name | `font.size.3xl` (16px) | 700 | `rev.text` |
| Column header | `font.size.xs` (11px) | 700 | `rev.text-label`, uppercase |
| Table cell body | `font.size.sm` (12px) | 400 | `rev.text` |
| Table cell meta | `font.size.xs` (11px) | 400 | `rev.text-muted` |
| Review body text | `font.size.sm` (12px) | 400 | `rev.text`, line-height 1.6 |
| Status badge | `font.size.xs` (11px) | 700 | status colour |
| Button label | `font.size.sm` (12px) | 600 | per type |
| Input label | `font.size.xs` (11px) | 700 | `rev.text-label`, uppercase |
| Input value | `font.size.sm` (12px) | 400 | `rev.text` |
| Rating average | `font.size.6xl` (32px) | 800 | `rev.text` |
| Admin reply text | `font.size.sm` (12px) | 400 | `rev.text` (italic) |
| Flag reason | `font.size.xs` (11px) | 600 | `rev.flagged` |
| Tab label | `font.size.sm` (12px) | 600 | active: `rev.accent` |
| Empty state | `font.size.3xl` (16px) | 600 | `rev.text` |

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
| `radius.md` | `8px` | Cards, panels, drawers |
| `radius.lg` | `12px` | Large panels |
| `radius.full` | `9999px` | Avatar, pill badges |

| Motion token | Value |
|---|---|
| `motion.instant` | `150ms` |
| `motion.fast` | `200ms` |
| `motion.normal` | `250ms` |
| `motion.slow` | `350ms` |

### 2.5 Contrast Audit

| Pairing | Ratio | Required | Status |
|---|---|---|---|
| `rev.text` on `rev.card-bg` | ~10:1 | 4.5:1 | ✅ Pass |
| `rev.text-muted` on `rev.card-bg` | ~4.6:1 | 4.5:1 | ✅ Pass |
| `admin.color.status.success` on `rev.card-bg` | ~4.5:1 | 4.5:1 | ✅ Pass |
| `admin.color.status.warning` on `rev.card-bg` | ~4.6:1 | 4.5:1 | ✅ Pass |
| `admin.color.status.error` on `rev.card-bg` | ~4.5:1 | 4.5:1 | ✅ Pass |
| `rev.star-fill` (#c8a84b) on `rev.card-bg` | Decorative | Paired with numeric rating text | ✅ Pass |


---

## 3. Page Layout

### 3.1 Reviews List/Queue Structure

```
┌──────────────────────────────────────────────────────────────────────┐
│  TOP BAR (64px)                                                      │
├──────────────┬───────────────────────────────────────────────────────┤
│  SIDEBAR     │  BREADCRUMB: Admin / Reviews                         │
│  (240px)     ├───────────────────────────────────────────────────────┤
│              │  PAGE HEADER + KPI ROW (5 cards)                     │
│              ├───────────────────────────────────────────────────────┤
│              │  STATUS FILTER TABS (Pending first, default view)     │
│              ├───────────────────────────────────────────────────────┤
│              │  TABLE TOOLBAR (search · filter · sort · bulk bar)    │
│              ├───────────────────────────────────────────────────────┤
│              │  REVIEWS LIST (card-row hybrid, virtual scroll)       │
│              ├───────────────────────────────────────────────────────┤
│              │  PAGINATION                                           │
└──────────────┴───────────────────────────────────────────────────────┘
```

### 3.2 Review Detail Drawer (right-side overlay, not a separate page)

```
┌────────────────────────────────────────────────────┐
│  Review Detail                              [×]   │
├────────────────────────────────────────────────────┤
│  • Reviewer & Product Info                          │
│  • Rating & Review Text                              │
│  • Photos (if attached)                               │
│  • Order Verification                                 │
│  • Flag / Report Details (conditional)                │
│  • Moderation Actions                                 │
│  • Admin Reply Composer                                │
│  • Moderation History                                  │
└────────────────────────────────────────────────────┘
```

### 3.3 Layout Rules

| Property | Value |
|---|---|
| Content padding | `space.9 = 24px` all sides |
| Page background | `rev.page-bg` |
| Drawer width | `480px`, slides from right, `position: fixed` |
| Drawer overlay | `admin.color.bg.canvas` @ 70% backdrop |
| Min page width | `1280px` |

---

## 4. Reviews List / Moderation Queue

### 4.1 Page Header

```
Reviews                                            [↓ Export]  [⚙ Settings]
4,821 total reviews · 4.6 average rating · 12 pending
```

| Element | Value |
|---|---|
| Title | `font.size.5xl` (24px), weight 700, `rev.text` |
| Subtitle | `font.size.sm`, `rev.text-muted` — total, average, pending count |
| Export | Secondary outlined, `radius.sm` |
| `[⚙ Settings]` | Opens review settings panel (§14) |

### 4.2 KPI Cards Row

```
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│  Average Rating  │ │  Total Reviews   │ │  Pending         │ │  Flagged         │ │  Response Rate   │
│  4.6 ★          │ │  4,821           │ │  12  ⏳          │ │  3  🚩           │ │  68%             │
│  ↑ +0.1 (30d)   │ │  ↑ +124 (30d)   │ │  Needs review    │ │  Needs review    │ │  of reviews      │
└──────────────────┘ └──────────────────┘ └──────────────────┘ └──────────────────┘ └──────────────────┘
```

**Single KPI card:**

| Property | Value |
|---|---|
| Background | `rev.card-bg` |
| Border | `1px solid rev.border-muted` |
| Border-radius | `radius.md` |
| Padding | `space.9 = 24px` |
| Label | `font.size.sm`, weight 500, `rev.text-muted` |
| Value | `font.size.6xl` (32px), weight 800, `rev.text` |
| "Pending" card | Value in `rev.pending`; border-left `3px solid rev.pending` |
| "Flagged" card | Value in `rev.flagged`; border-left `3px solid rev.flagged` |
| Average Rating | Shows `★` suffix, amber tint on star only |
| Hover | `rev.card-hover` bg, `motion.instant` |
| Click | Filters list to that segment |
| `aria-label` | `"[label]: [value]"` |

### 4.3 Status Filter Tabs

```
[ Pending (12) ]  [ All (4,821) ]  [ Published (4,640) ]  [ Rejected (166) ]  [ Flagged (3) ]
```

| Property | Value |
|---|---|
| Default active tab | `"Pending"` — moderation queue is the priority view |
| Height | `36px`, `radius.sm` |
| Font | `font.size.sm`, weight 500 |
| Default | `rev.border` border, transparent, `rev.text-muted` |
| Active | `rev.accent` bg, white, weight 700 |
| "Flagged" tab (when count > 0) | Pulses subtly on load to draw attention; `rev.flagged` colour when active |
| Hover | `rev.card-hover`, `motion.instant` |
| Focus-visible | `2px` focus ring `rev.focus-ring` |
| `role` | `role="tablist"`, `role="tab"`, `aria-selected` |
| Keyboard | Arrow keys cycle; Enter selects |

### 4.4 Table Toolbar

```
[🔍 Search reviews, products, customers...]  [Filter ▾]  [Sort: Newest ▾]  [⊞ List / ☰ Cards]
```

**Search:**

| Property | Value |
|---|---|
| Width | `320px`, height `36px`, `rev.input-bg`, `rev.border`, `radius.sm` |
| Scope | Review text, product name, reviewer name/email |
| Debounce | `250ms` |
| `aria-label` | `"Search reviews"` |

**Sort options:** Newest First (default) · Oldest First · Highest Rating · Lowest Rating · Most Helpful Votes · Has Photos First

**Filter panel sections:** Rating (1–5 star checkboxes) · Has Photos · Verified Purchase Only · Has Reply · Date Range · Product / Collection · Source (Storefront / Email Request / Import)

**View toggle:** List (compact table) vs Cards (richer review preview cards) — preference saved to `localStorage`

**Bulk action bar:**

```
[ ☑ 8 selected ]  [Approve]  [Reject]  [Feature]  [Export]  [Delete]  [✕ Clear]
```

| Property | Value |
|---|---|
| Background | `rev.accent-bg`, `rev.accent` border, `radius.sm` |
| "Reject" / "Delete" | Ghost, `rev.danger` text |
| `aria-live` | `"polite"` on count |


### 4.5 Reviews List — Card Row (default view)

> Reviews use a richer card-row hybrid rather than a dense data table, since review text needs to be scannable for moderation decisions.

```
┌──────────────────────────────────────────────────────────────────────────┐
│ ☐  ★★★★★  Priya Kumar  ✓ Verified Purchase          [ Pending ]         │
│    "Absolutely beautiful plant! Arrived in perfect condition and the     │
│    packaging was excellent. Highly recommend for first-time plant       │
│    owners."                                                              │
│    [📷 2 photos]                                                         │
│    Monstera Deliciosa — Medium  ·  Order #ORD-4821  ·  15 Jun 2026      │
│                                                                          │
│    [ Approve ]  [ Reject ]  [ Reply ]  [ View Full ]  [⋮]              │
└──────────────────────────────────────────────────────────────────────────┘
```

**Card shell:**

| Property | Value |
|---|---|
| Background | `rev.card-bg` |
| Border | `1px solid rev.border-muted` |
| Border-radius | `radius.md` |
| Padding | `space.7 = 16px` |
| Margin-bottom | `space.6 = 12px` |
| Hover | `rev.card-hover`, `motion.instant` |
| Flagged row | Background tint `rev.flagged-bg`, left border `4px solid rev.flagged` |

**Card header row:**

| Element | Value |
|---|---|
| Checkbox | `18×18px`, `radius.xs`, left-aligned |
| Stars | 5 stars, `rev.star-fill` filled, `rev.star-empty` outline, `16×16px` |
| Reviewer name | `font.size.3xl` (16px), weight 700, `rev.text` |
| Verified badge | `✓ Verified Purchase`, `rev.verified` colour, `font.size.xs` |
| Status badge | Right-aligned pill |

**Review body:**

| Property | Value |
|---|---|
| Text | `font.size.sm`, `rev.text`, line-height 1.6 |
| Max lines collapsed | 3 lines; `"Show more"` link expands |
| Photo indicator | `📷 [n] photos`, `font.size.xs`, `rev.text-muted`; click opens lightbox |

**Meta row:**

```
Monstera Deliciosa — Medium  ·  Order #ORD-4821  ·  15 Jun 2026
```

| Property | Value |
|---|---|
| Font | `font.size.xs`, `rev.text-muted` |
| Product name | Links to product edit page, `rev.accent` on hover |
| Order link | Links to order detail, `rev.accent` on hover |
| Separator | `·` |

**Action row:**

| Button | Style | Visibility |
|---|---|---|
| `[Approve]` | Primary `rev.accent` filled, `font.size.sm`, height `32px` | Pending status only |
| `[Reject]` | Ghost, `rev.danger` text | Pending status only |
| `[Reply]` | Secondary outlined | All statuses |
| `[View Full]` | Ghost, `rev.text-muted` | All — opens detail drawer |
| `[⋮]` | Icon button | Feature / Delete / Flag as spam |

**Flag/Report indicator (conditional):**

```
🚩  Reported 2 times — "Inappropriate language"
```

| Property | Value |
|---|---|
| Background | `rev.flagged-bg` |
| Border | `1px solid rev.flagged` |
| Border-radius | `radius.xs` |
| Padding | `space.4 = 8px` |
| Icon | `🚩`, `rev.flagged` |
| Text | `font.size.xs`, weight 600, `rev.flagged` |
| Position | Above the action row, below review body |

**Admin reply indicator (if replied):**

```
↳ Store reply: "Thank you for the wonderful review, Priya! 🌿" — 16 Jun 2026
```

| Property | Value |
|---|---|
| Background | `rev.replied-bg` |
| Border-left | `2px solid rev.replied` |
| Padding | `space.5 = 10px` left |
| Font | `font.size.sm`, italic, `rev.text` |
| Timestamp | `font.size.xs`, `rev.text-muted` |

### 4.6 Reviews List — Compact Table View (alternate)

```
┌────┬──────┬─────────────┬──────────────────────┬───────────┬─────────┬────────────┐
│ ☐  │ STARS│  REVIEWER   │  PRODUCT             │  DATE     │  PHOTOS │  STATUS    │
├────┼──────┼─────────────┼──────────────────────┼───────────┼─────────┼────────────┤
│ ☐  │ ★★★★★│ Priya Kumar │ Monstera Deliciosa   │ 15 Jun    │  📷 2   │ Pending    │
│ ☐  │ ★★★★☆│ Ravi Shah   │ Peace Lily           │ 14 Jun    │   —     │ Published  │
└────┴──────┴─────────────┴──────────────────────┴───────────┴─────────┴────────────┘
```

| Column | Sortable |
|---|---|
| ☐ Checkbox | No |
| Stars | Yes |
| Reviewer | Yes |
| Product | Yes |
| Date | Yes |
| Photos | No |
| Status | Yes |
| Actions `[⋮]` | No |

Row click opens the detail drawer. Same table shell/header/row-state rules as `admin-orders-design.md §4.6`.

### 4.7 Status Badge Variants

| Status | Background | Text |
|---|---|---|
| Published | `rev.published-bg` | `rev.published` |
| Pending | `rev.pending-bg` | `rev.pending` |
| Rejected | `rev.rejected-bg` | `rev.rejected` |
| Flagged | `rev.flagged-bg` | `rev.flagged` |
| Featured | `rev.featured-bg` | `rev.featured` |

| Property | Value |
|---|---|
| Font | `font.size.xs`, weight 700 |
| Border-radius | `radius.full` |
| Padding | `2px 6px` |
| `aria-label` | `"Status: [status]"` |

### 4.8 Overflow Menu (⋮)

```
View Full Review
Edit Review Text
Reply to Review
─────────────────
Feature this Review
Mark as Spam
─────────────────
Reject
Delete Permanently
```

| Property | Value |
|---|---|
| Background | `rev.overlay-bg`, `rev.border`, `radius.md`, `200px` |
| Destructive items | `rev.danger` colour |
| `role` | `role="menu"`, `role="menuitem"` |
| Keyboard | Arrows navigate; Enter activates; Escape closes |

### 4.9 Pagination & Empty States

Same pattern as other admin modules: `"Showing 1–25 of 4,821"` · page buttons · `[25 per page ▾]`.

**No reviews pending:**
```
        ✅
  No reviews pending
  All reviews have been moderated. Nice work!
  [ View All Reviews ]
```

**No results for filters:**
```
        📭
  No reviews found
  Try adjusting your filters or search.
  [ Clear Filters ]
```


---

## 5. Review Detail Drawer

Opens as a right-side slide-in panel, `480px` wide, triggered by `[View Full]` or row/card click.

### 5.1 Drawer Header

```
┌────────────────────────────────────────────────────┐
│  Review Detail                              [×]   │
│  #REV-08214                                        │
└────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Background | `rev.card-bg` |
| Border-left | `1px solid rev.border` |
| Shadow | `0 8px 32px rgba(0,0,0,0.4)` |
| `role` | `role="dialog"`, `aria-modal="true"`, `aria-label="Review detail"` |
| Animation | Slides in from right, `motion.normal` |
| Close | `×` button + Escape key |
| Focus trap | Yes |
| Focus on open | Drawer heading |
| Focus on close | Returns to trigger element |

### 5.2 Reviewer & Product Info

```
┌────────────────────────────────────────────────────┐
│  [Avatar] Priya Kumar          ✓ Verified Purchase │
│           priya@email.com                          │
│           [View Customer Profile →]                │
│                                                     │
│  Product:  Monstera Deliciosa — Medium             │
│            [View Product →]                        │
│  Order:    #ORD-4821                                │
│            [View Order →]                           │
│  Submitted: 15 Jun 2026, 10:32 AM                   │
└────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Avatar | `40×40px`, `radius.full` |
| Reviewer name | `font.size.3xl`, weight 700, `rev.text` |
| Links | `rev.accent`, underline on hover, open relevant module |
| Verified badge | `rev.verified` colour + `✓` |
| Unverified | `font.size.xs`, `rev.text-muted`: `"Not linked to a verified order"` |

### 5.3 Rating & Review Text

```
┌────────────────────────────────────────────────────┐
│  ★★★★★  5 / 5                                       │
│                                                     │
│  "Absolutely beautiful plant! Arrived in perfect    │
│  condition and the packaging was excellent. Highly  │
│  recommend for first-time plant owners. The leaves  │
│  are huge and healthy."                              │
└────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Stars | `20×20px`, `rev.star-fill` |
| Rating text | `font.size.sm`, weight 600, `rev.text` |
| Review text | `font.size.sm`, `rev.text`, line-height 1.7, full text shown (no truncation in drawer) |
| `[Edit Review Text]` | Ghost link below — opens inline textarea for admin correction (e.g. removing PII accidentally shared) |

### 5.4 Photos

```
┌────────────────────────────────────────────────────┐
│  Photos (2)                                        │
│  ┌────────┐  ┌────────┐                            │
│  │ photo 1│  │ photo 2│                             │
│  └────────┘  └────────┘                             │
└────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Thumbnail | `96×96px`, `radius.sm`, `object-fit: cover` |
| Click | Opens full-size lightbox overlay |
| Lightbox | `role="dialog"`, `aria-modal="true"`, arrow keys navigate between photos, Escape closes |
| `[Remove Photo]` | Per-photo ghost button, visible on hover — for removing inappropriate images while keeping text review |

### 5.5 Flag / Report Details (conditional)

Only shown if `report_count > 0`.

```
┌────────────────────────────────────────────────────┐
│  🚩  Reported 2 times                               │
├────────────────────────────────────────────────────┤
│  Report 1:  "Inappropriate language"                │
│             Reported by: Customer (anonymous)        │
│             14 Jun 2026                              │
│  ──────────────────────────────────────────────────  │
│  Report 2:  "Suspected fake review"                  │
│             Reported by: System (AI detection)        │
│             15 Jun 2026                               │
└────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Background | `rev.flagged-bg` |
| Border | `1px solid rev.flagged` |
| Border-radius | `radius.md` |
| Header | `font.size.sm`, weight 700, `rev.flagged`, `🚩` icon |
| Report reason | `font.size.sm`, weight 600, `rev.text` |
| Reporter | `font.size.xs`, `rev.text-muted` |
| `role` | `role="region"`, `aria-label="Reported [n] times"` |

**Report reason categories:** Inappropriate language · Spam/fake review · Off-topic · Personal information shared · Suspected bot/fraud · Other

### 5.6 Moderation Actions

```
┌────────────────────────────────────────────────────┐
│  Moderation                                         │
├────────────────────────────────────────────────────┤
│  [ ✓ Approve & Publish ]                            │
│  [ ✕ Reject ]                                        │
│                                                     │
│  REJECTION REASON (required if rejecting)            │
│  [ Select a reason ▾ ]                               │
│  [ ☐ ] Notify customer of rejection via email        │
│                                                     │
│  [ ☐ ] Feature this review (shown prominently on PDP)│
└────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| `[Approve & Publish]` | Primary `rev.accent` filled, full-width, `44px` height |
| `[Reject]` | Outlined `rev.danger` border + text, full-width |
| Rejection reason select | Required when Reject is clicked; appears inline |
| Rejection reasons | Inappropriate language · Spam/promotional · Off-topic · Fake/unverifiable · Personal info shared · Other |
| Notify customer checkbox | Default unchecked; sends templated rejection email if checked |
| Feature toggle | `role="switch"`; featured reviews appear in a highlighted carousel on the PDP |

**Approve confirmation (inline, not modal):**

On `[Approve & Publish]` click, button shows loading spinner → success state: `"✓ Published"` with brief green flash, then drawer can be closed or moves to next pending review automatically (configurable, see §14).

**Reject flow:**

1. Click `[Reject]`
2. Reason select + notify checkbox reveal inline (slide down, `motion.fast`)
3. `[Confirm Rejection]` button appears
4. On confirm: status updates, toast shown, drawer closes or advances to next

### 5.7 Admin Reply Composer

```
┌────────────────────────────────────────────────────┐
│  Store Reply                                        │
├────────────────────────────────────────────────────┤
│  [ Template: Thank You ▾ ]                          │
│                                                     │
│  [ Thank you for the wonderful review, Priya! We're │
│  thrilled your Monstera arrived happy and healthy.  │
│  🌿                                            ]    │
│  156 / 1000 characters                               │
│                                                     │
│  [ Save as Draft ]          [ Post Reply ]          │
└────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Template dropdown | Thank You · Address Concern · Apology · Custom |
| Textarea | `120px` min height, `rev.input-bg`, `rev.border`, `radius.sm` |
| Max chars | `1000`; counter turns `rev.pending` at 90%, `rev.rejected` at 100% |
| `[Post Reply]` | Primary `rev.accent`; publishes reply visible to all customers viewing this review on the PDP |
| Existing reply | If already replied, shows reply text with `[Edit Reply]` / `[Delete Reply]` instead of composer |
| `aria-label` | `"Store reply to review"` |

### 5.8 Moderation History

```
┌────────────────────────────────────────────────────┐
│  History                                            │
├────────────────────────────────────────────────────┤
│  16 Jun 10:05 AM   Suresh K.   Approved & published │
│  15 Jun 11:42 PM   System       Flagged (AI: spam   │
│                                  check, score: 0.12) │
│  15 Jun 10:32 AM   Priya K.     Review submitted    │
└────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| `role` | `role="log"`, `aria-label="Moderation history"` |
| Entry | Timestamp · Actor (admin name or "System") · Action description |


---

## 6. Bulk Moderation Actions

### 6.1 Bulk Approve

```
┌──────────────────────────────────────────────────────┐
│  Approve 8 Reviews?                            [×]  │
│  These reviews will be published immediately and     │
│  become visible on their product pages.               │
│                                                       │
│  [ ☐ ] Feature all selected reviews                  │
│                                                       │
│  [ Cancel ]            [ Approve 8 Reviews ]          │
└──────────────────────────────────────────────────────┘
```

### 6.2 Bulk Reject

```
┌──────────────────────────────────────────────────────┐
│  Reject 8 Reviews?                              [×]  │
│  Reason (applies to all): [ Select a reason ▾ ]      │
│  [ ☐ ] Notify customers of rejection                 │
│                                                       │
│  [ Cancel ]             [ Reject 8 Reviews ]          │
└──────────────────────────────────────────────────────┘
```

### 6.3 Bulk Delete

```
┌──────────────────────────────────────────────────────┐
│  ⚠️ Delete 8 Reviews Permanently?               [×]  │
│  This cannot be undone. Reviews will be removed       │
│  entirely, not just unpublished.                      │
│                                                       │
│  [ Cancel ]         [ Delete 8 Reviews ]              │
└──────────────────────────────────────────────────────┘
```

`rev.danger` confirm button; requires Super Admin or Ops Manager role for bulk delete specifically (Customer Support can bulk approve/reject but not bulk delete).

---

## 7. Reviews Analytics Page

**URL:** `/admin/reviews/analytics`

```
← Reviews    Review Analytics                    [📅 Last 90 days ▾]

┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Avg Rating   │ │ Total Reviews│ │ Response Rate│ │ Photo Rate   │
│ 4.6 ★       │ │ 4,821        │ │ 68%          │ │ 42%          │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘

┌────────────────────────────────────────────────────────────┐
│  Rating Distribution                                         │
│  5★ ████████████████████████████████  3,204 (66%)          │
│  4★ ██████████████                    1,012 (21%)          │
│  3★ ████                                312  (6%)          │
│  2★ ██                                  180  (4%)          │
│  1★ █                                   113  (2%)          │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  Reviews Over Time                          [Daily ▾]       │
│  [line chart: review volume + avg rating overlay]            │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  Top Rated Products                    [Lowest Rated →]    │
├──────────────────────────┬──────────┬────────────────────────┤
│  Monstera Deliciosa      │ ★4.9     │  248 reviews           │
│  Peace Lily               │ ★4.8     │  186 reviews           │
└──────────────────────────┴──────────┴────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  Lowest Rated Products  (needs attention)                    │
├──────────────────────────┬──────────┬────────────────────────┤
│  Terracotta Pot 14cm     │ ★3.1     │  42 reviews  ⚠         │
└──────────────────────────┴──────────┴────────────────────────┘
```

| Section | Detail |
|---|---|
| Rating distribution | Horizontal bar chart, 1★–5★, `rev.star-fill` colour, count + percentage |
| Reviews over time | Dual-axis line chart: volume (bar) + average rating (line) |
| Top rated products | Table, click → product edit page reviews tab |
| Lowest rated products | Same table, sorted ascending; `⚠` icon if avg < 3.5 |
| Click rating distribution bar | Filters main reviews list to that star rating |

---

## 8. Review Settings Panel

Triggered by `[⚙ Settings]` in page header. Opens as a drawer.

```
┌────────────────────────────────────────────────────┐
│  Review Settings                              [×]  │
├────────────────────────────────────────────────────┤
│  MODERATION                                          │
│  [ ☑ ] Require approval before publishing            │
│  [ ☑ ] Auto-flag reviews with profanity (AI)         │
│  [ ☐ ] Auto-approve reviews from verified buyers      │
│        with 4★ or 5★ rating                          │
│                                                     │
│  AFTER APPROVING A REVIEW                             │
│  ( ● ) Stay on this review                            │
│  ( ○ ) Auto-advance to next pending review            │
│                                                     │
│  REQUEST EMAILS                                       │
│  [ ☑ ] Send review request email                      │
│        [ 7 ] days after delivery                      │
│  Template: [ Default Review Request ▾ ]              │
│                                                     │
│  DISPLAY                                              │
│  [ ☑ ] Show "Verified Purchase" badge                 │
│  [ ☑ ] Allow photo uploads                            │
│  Minimum review length: [ 20 ] characters             │
│                                                     │
│  [ Save Settings ]                                    │
└────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Auto-advance toggle | Controls the workflow behaviour described in §5.6 |
| AI profanity flag | If enabled, reviews matching a profanity/spam classifier auto-enter "Flagged" status |
| Auto-approve rule | When enabled, 4★/5★ verified-purchase reviews skip the queue entirely and publish immediately |
| Review request email | Scheduling controls for the post-delivery review request automation |
| `[Save Settings]` | Primary `rev.accent`, full-width |


---

## 9. Review State Machine

```
┌──────────────────────────────────────────────────────────────────────┐
│                    REVIEW STATE MACHINE                              │
│                                                                      │
│  [SUBMITTED] ──(auto-approve rule met)──► [PUBLISHED]               │
│       │                                                              │
│       │ (default — requires moderation)                              │
│       ▼                                                              │
│  [PENDING] ──(approve)──────────────────► [PUBLISHED]               │
│       │                                          │                   │
│       │ (reject)                          (report received)         │
│       ▼                                          ▼                  │
│  [REJECTED]                                 [FLAGGED]               │
│   (terminal —                                    │                  │
│    can be re-approved                    (admin re-reviews)         │
│    by admin override)                            │                  │
│                                          ┌────────┴────────┐        │
│                                          ▼                 ▼        │
│                                    [PUBLISHED]        [REJECTED]    │
│                                  (report dismissed)  (report upheld)│
│                                                                      │
│  [PUBLISHED] ──(delete)──► [DELETED] (terminal, hard delete)        │
└──────────────────────────────────────────────────────────────────────┘
```

### Valid Transitions

| From state | Valid next states |
|---|---|
| `SUBMITTED` | `PUBLISHED` (auto-approve) · `PENDING` (default) |
| `PENDING` | `PUBLISHED` · `REJECTED` |
| `PUBLISHED` | `FLAGGED` (on report) · `DELETED` |
| `FLAGGED` | `PUBLISHED` (report dismissed) · `REJECTED` (report upheld) |
| `REJECTED` | `PUBLISHED` (admin override/re-approve) |
| `DELETED` | No transitions (terminal) |

**UI enforcement:** The action buttons shown in the detail drawer and card-row are computed from this table — e.g. a `REJECTED` review only shows `[Re-approve]` and `[Delete Permanently]`, not `[Reject]` again.

---

## 10. Accessibility Requirements

### 10.1 Focus Management

| Interaction | Focus behaviour |
|---|---|
| Reviews list load | Focus → search field (or first pending card if queue view) |
| Detail drawer open | Focus → drawer heading |
| Detail drawer close (Escape) | Focus → returns to trigger card/row |
| Approve clicked | Focus stays on Approve button; success state announced |
| Reject clicked | Focus → rejection reason select (revealed inline) |
| Bulk modal open | Focus → safe action ("Cancel") for destructive bulk actions |
| Reply composer | Focus → template dropdown on first open |
| Lightbox photo open | Focus → close button; arrow keys navigate; Escape closes, focus returns to thumbnail |
| Settings drawer open | Focus → first checkbox |
| Auto-advance to next review | Focus → new drawer heading; `aria-live="polite"` announces `"Now viewing review [n] of [total] pending"` |

### 10.2 Full ARIA Map

| Component | ARIA |
|---|---|
| Breadcrumb | `<nav aria-label="Breadcrumb">`, `aria-current="page"` |
| Page heading | `<h1>` — `"Reviews"` |
| KPI row | `role="region"`, `aria-label="Review metrics"` |
| KPI card | `aria-label="[label]: [value]"` |
| Status tabs | `role="tablist"`, `role="tab"`, `aria-selected` |
| Search input | `aria-label="Search reviews"` |
| Reviews list | `role="list"`, `aria-label="Reviews"` |
| Review card | `role="listitem"` |
| Star rating display | `aria-label="[n] out of 5 stars"`, stars `aria-hidden="true"` |
| Verified badge | `aria-label="Verified purchase"` |
| Status badge | `aria-label="Status: [status]"` |
| Flag indicator | `role="region"`, `aria-label="Reported [n] times"` |
| Photo thumbnail | `aria-label="Review photo [n] of [total]"` |
| Lightbox | `role="dialog"`, `aria-modal="true"`, `aria-label="Review photo viewer"` |
| Detail drawer | `role="dialog"`, `aria-modal="true"`, `aria-label="Review detail"`, focus trap |
| Approve button | `aria-busy` during loading |
| Reject reason select | `aria-required="true"` when reject flow active |
| Feature toggle | `role="switch"`, `aria-checked` |
| Reply textarea | `aria-label="Store reply to review"`, char counter `aria-live="polite"` |
| Moderation history | `role="log"`, `aria-label="Moderation history"` |
| Bulk action bar | `aria-live="polite"` on count |
| Bulk modal | `role="alertdialog"` for destructive (reject/delete), `role="dialog"` for approve |
| Rating distribution bars | `role="img"`, `aria-label="[n] star: [count] reviews, [percent]%"` |
| Settings drawer | `role="dialog"`, `aria-modal="true"`, focus trap |

### 10.3 Keyboard Navigation Map

| Key | Behaviour |
|---|---|
| `Tab` | Forward through interactive elements |
| `Shift+Tab` | Backward |
| `Enter` | Activate button/link; open review detail |
| `Space` | Toggle checkbox |
| `Arrow keys` | Navigate status tabs; navigate lightbox photos |
| `Escape` | Close drawer/modal/lightbox |
| `Ctrl+A` | Select all visible reviews |
| `A` (card focused) | Quick-approve focused review |
| `R` (card focused) | Quick-reject focused review (opens reason select) |
| `⌘Enter` | Post reply (when composer focused) |

### 10.4 Testable Acceptance Criteria

| # | Criterion | Method | Pass |
|---|---|---|---|
| A1 | No contrast failures | axe DevTools | Zero critical |
| A2 | All focus rings visible (`2px solid #00b566` + glow) | Manual Tab | Every element |
| A3 | Star ratings have text equivalent | Screen reader | `aria-label` announces "[n] out of 5 stars" |
| A4 | Status tab keyboard-navigable | Arrow keys | `aria-selected` updates |
| A5 | Detail drawer focus-trapped | Keyboard | Tab cycles inside only |
| A6 | Drawer closes on Escape; focus returns | Keyboard | Both conditions met |
| A7 | Lightbox keyboard-navigable | Arrow keys | Photos cycle; Escape closes |
| A8 | Reply char counter announced | Screen reader | `aria-live="polite"` fires near limit |
| A9 | Bulk count announced | Screen reader | `aria-live="polite"` fires |
| A10 | Auto-advance announced | Screen reader | New review context announced |
| A11 | `prefers-reduced-motion` respected | OS setting | Drawer slide, pulse animations disabled |

---

## 11. Content & Tone Standards

### 11.1 Status Labels

| Internal | Display | Never use |
|---|---|---|
| `pending` | `Pending` | "Awaiting", "In queue" |
| `published` | `Published` | "Live", "Approved" (use Published as the noun-state) |
| `rejected` | `Rejected` | "Denied", "Removed" |
| `flagged` | `Flagged` | "Reported" alone (use Flagged as status, "reported" as the event) |
| `featured` | `Featured` | "Pinned", "Highlighted" |

### 11.2 CTA Labels

| Action | Label | Never use |
|---|---|---|
| Approve a review | `"Approve & Publish"` | "Accept", "OK" |
| Reject a review | `"Reject"` | "Decline", "Deny" |
| Permanently remove | `"Delete Permanently"` | "Remove", "Trash" |
| Reply to customer | `"Post Reply"` | "Submit", "Send" |
| Highlight on PDP | `"Feature this Review"` | "Pin", "Promote" |
| Re-approve after flag | `"Re-approve"` | "Restore", "Unflag" |

### 11.3 Rejection Reasons (canonical list)

Inappropriate language · Spam/promotional content · Off-topic · Fake/unverifiable purchase · Personal information shared · Duplicate review · Other (admin must specify in note)

### 11.4 Error Messages

| Error | Message |
|---|---|
| Reject without reason | `"Select a reason before rejecting this review."` |
| Reply exceeds 1000 chars | `"Reply must be 1000 characters or fewer."` |
| Bulk delete without role permission | `"Only Super Admin or Operations Manager can permanently delete reviews."` |
| Feature non-published review | `"Only published reviews can be featured."` |

### 11.5 Confirmation Dialog Templates

| Action | Heading | Body | Safe action | Destructive |
|---|---|---|---|---|
| Bulk approve | `"Approve {{n}} reviews?"` | `"These will be published immediately and visible on product pages."` | `"Cancel"` | `"Approve {{n}} Reviews"` |
| Bulk reject | `"Reject {{n}} reviews?"` | `"Select a reason that applies to all selected reviews."` | `"Cancel"` | `"Reject {{n}} Reviews"` |
| Bulk delete | `"Delete {{n}} reviews permanently?"` | `"This cannot be undone. Reviews are removed entirely, not just unpublished."` | `"Cancel"` | `"Delete {{n}} Reviews"` |
| Remove photo | `"Remove this photo?"` | `"The review text will remain. This cannot be undone."` | `"Cancel"` | `"Remove Photo"` |


---

## 12. Anti-Patterns & Prohibited Implementations

| Anti-pattern | Why prohibited | Correct approach |
|---|---|---|
| Raw hex values in CSS | Breaks admin token system | Use `admin.*` / `rev.*` tokens only |
| `outline: none` | WCAG 2.4.11 failure | `outline: 2px solid rev.focus-ring` always |
| Star rating with colour only, no text | WCAG 1.4.1 failure | Always pair with `aria-label="[n] out of 5 stars"` |
| Permanently deleting reviews without confirmation | Irreversible data loss | Always `role="alertdialog"` with explicit "permanently" language |
| Rejecting without requiring a reason | No audit trail; unfair to customer disputes | Reason select mandatory before reject confirms |
| Auto-publishing all reviews with no moderation option | Risk of spam/abuse going live instantly | Default to `PENDING`; auto-approve is opt-in only (§8) |
| Showing flagged reviews mixed in with normal queue, no priority | Reports go unnoticed | Flagged tab + visual pulse + flagged-bg tint on rows |
| Bulk delete available to all roles | Risk of mass data loss by junior staff | Restrict to Super Admin + Ops Manager |
| Featuring an unpublished/rejected review | Broken/inconsistent storefront state | Feature toggle only enabled when status = Published |
| Reply textarea without character limit shown | Customer-facing reply could be cut off unexpectedly | Always show live counter, enforce 1000 char max |
| Photo lightbox without keyboard navigation | Mouse-only interaction | Arrow keys + Escape required |
| No verified-purchase distinction shown | Reduces trust signal value for shoppers | Always display verification status clearly |
| Auto-advance to next review without announcing context | Screen reader user loses orientation | `aria-live="polite"` announces new review context |

---

## 13. Edge-Case Handling

| Scenario | Behaviour |
|---|---|
| Review submitted with no order match (guest checkout edge case) | Shown as "Unverified"; moderation still required, no auto-approve eligibility |
| Customer edits/deletes their review after admin reply posted | Reply remains attached to the edited review; admin notified via activity log |
| Review contains an image that fails moderation but text is fine | Admin can `[Remove Photo]` independently and approve the text-only review |
| Same customer reviews same product twice | Flagged automatically as `"Possible duplicate of review #REV-[id]"` |
| Review text is empty (rating-only submission) | Allowed if store settings permit; shown in list as `"(No written review)"` in `rev.text-muted` italic |
| AI profanity flag false-positive | Admin can dismiss flag without rejecting; logged in moderation history |
| Reviewer account deleted after review published | Review remains; reviewer name shows as `"Former Customer"` |
| Reply posted then store wants to retract it | `[Delete Reply]` available; removes from storefront immediately |
| Bulk action partially fails (e.g. 2 of 8 already deleted by another admin) | Toast: `"6 of 8 reviews updated successfully. 2 were already processed."` |
| Featured review's product goes out of stock | Review remains featured; no dependency on stock status |
| Very long review text (> 2000 chars) | Card view truncates at 3 lines regardless; drawer shows full text with internal scroll if needed |
| Review rating distribution chart with 0 reviews | Shows empty state: `"No reviews yet for this period."` |
| Concurrent moderation (two admins viewing same pending review) | Second admin sees banner: `"This review was already moderated by [name]."` on attempted action |

---

## 14. Performance Requirements

| Metric | Target | Rule |
|---|---|---|
| Reviews list load | `< 1.5s` | First 25 rows/cards SSR; virtualised beyond 100 |
| Detail drawer open | `< 300ms` | Data pre-fetched on hover-intent where possible |
| Search response | `< 300ms` | Debounced 250ms; server search |
| Approve/Reject action | `< 500ms` | Optimistic UI update; rollback on error |
| Bulk action (8 reviews) | `< 2s` | Batch API |
| Bulk action (100+ reviews) | Background job | Progress toast + summary on completion |
| Analytics page load | `< 1.5s` | Charts + tables SSR for default 90-day range |
| Photo lightbox load | `< 200ms` | Lazy-loaded full-res image with thumbnail placeholder |

---

## 15. Analytics & Tracking Events

| Event | Trigger | Properties |
|---|---|---|
| `reviews_list_view` | Page load | `admin_id`, `filter_status`, `view_mode` |
| `review_detail_open` | Drawer opened | `admin_id`, `review_id` |
| `reviews_search` | Search | `admin_id`, `query`, `result_count` |
| `reviews_filter_apply` | Filter applied | `admin_id`, `filters[]` |
| `review_approve` | Approved | `admin_id`, `review_id`, `rating`, `had_photos` |
| `review_reject` | Rejected | `admin_id`, `review_id`, `reason` |
| `review_reapprove` | Re-approved from flagged/rejected | `admin_id`, `review_id` |
| `review_feature` | Featured toggled on | `admin_id`, `review_id` |
| `review_unfeature` | Featured toggled off | `admin_id`, `review_id` |
| `review_reply_post` | Reply posted | `admin_id`, `review_id`, `char_count` |
| `review_reply_edit` | Reply edited | `admin_id`, `review_id` |
| `review_reply_delete` | Reply deleted | `admin_id`, `review_id` |
| `review_photo_remove` | Photo removed | `admin_id`, `review_id`, `photo_index` |
| `review_delete` | Permanently deleted | `admin_id`, `review_id` |
| `review_flag_dismiss` | Flag dismissed | `admin_id`, `review_id` |
| `reviews_bulk_action` | Bulk submit | `admin_id`, `action`, `count` |
| `review_auto_advance` | Auto-advanced to next pending | `admin_id`, `from_review_id`, `to_review_id` |
| `reviews_analytics_view` | Analytics page load | `admin_id`, `date_range` |
| `reviews_export` | Export triggered | `admin_id`, `count`, `filters[]` |
| `review_settings_save` | Settings saved | `admin_id`, `settings_changed[]` |

---

## 16. Internationalisation (i18n)

```json
{
  "rev.page.title": "Reviews",
  "rev.page.subtitle": "{{total}} total reviews · {{avg}} average rating · {{pending}} pending",

  "rev.tabs.pending": "Pending ({{count}})",
  "rev.tabs.all": "All ({{count}})",
  "rev.tabs.published": "Published ({{count}})",
  "rev.tabs.rejected": "Rejected ({{count}})",
  "rev.tabs.flagged": "Flagged ({{count}})",

  "rev.status.pending": "Pending",
  "rev.status.published": "Published",
  "rev.status.rejected": "Rejected",
  "rev.status.flagged": "Flagged",
  "rev.status.featured": "Featured",

  "rev.action.approve": "Approve & Publish",
  "rev.action.reject": "Reject",
  "rev.action.reply": "Reply",
  "rev.action.view_full": "View Full",
  "rev.action.feature": "Feature this Review",
  "rev.action.unfeature": "Remove from Featured",
  "rev.action.delete": "Delete Permanently",
  "rev.action.reapprove": "Re-approve",
  "rev.action.remove_photo": "Remove Photo",
  "rev.action.post_reply": "Post Reply",
  "rev.action.save_draft": "Save as Draft",
  "rev.action.edit_reply": "Edit Reply",
  "rev.action.delete_reply": "Delete Reply",
  "rev.action.view_customer": "View Customer Profile",
  "rev.action.view_product": "View Product",
  "rev.action.view_order": "View Order",

  "rev.field.rejection_reason": "Rejection reason",
  "rev.field.notify_customer": "Notify customer of rejection via email",
  "rev.field.reply_template": "Template",

  "rev.reason.inappropriate": "Inappropriate language",
  "rev.reason.spam": "Spam/promotional content",
  "rev.reason.off_topic": "Off-topic",
  "rev.reason.fake": "Fake/unverifiable purchase",
  "rev.reason.personal_info": "Personal information shared",
  "rev.reason.duplicate": "Duplicate review",
  "rev.reason.other": "Other",

  "rev.verified.badge": "Verified Purchase",
  "rev.verified.none": "Not linked to a verified order",

  "rev.flag.heading": "Reported {{count}} times",
  "rev.flag.reported_by": "Reported by: {{source}}",

  "rev.confirm.bulk_approve.heading": "Approve {{count}} reviews?",
  "rev.confirm.bulk_approve.body": "These will be published immediately and visible on product pages.",
  "rev.confirm.bulk_reject.heading": "Reject {{count}} reviews?",
  "rev.confirm.bulk_delete.heading": "Delete {{count}} reviews permanently?",
  "rev.confirm.bulk_delete.body": "This cannot be undone. Reviews are removed entirely, not just unpublished.",
  "rev.confirm.remove_photo.heading": "Remove this photo?",
  "rev.confirm.remove_photo.body": "The review text will remain. This cannot be undone.",

  "rev.toast.approved": "Review approved and published.",
  "rev.toast.rejected": "Review rejected.",
  "rev.toast.reply_posted": "Reply posted.",
  "rev.toast.featured": "Review featured on product page.",
  "rev.toast.deleted": "Review deleted permanently.",
  "rev.toast.bulk_partial": "{{success}} of {{total}} reviews updated. {{skipped}} were already processed.",

  "rev.error.reason_required": "Select a reason before rejecting this review.",
  "rev.error.reply_too_long": "Reply must be 1000 characters or fewer.",
  "rev.error.delete_permission": "Only Super Admin or Operations Manager can permanently delete reviews.",
  "rev.error.feature_unpublished": "Only published reviews can be featured.",

  "rev.empty.no_pending": "No reviews pending",
  "rev.empty.no_pending_body": "All reviews have been moderated. Nice work!",
  "rev.empty.no_results": "No reviews found",
  "rev.empty.no_results_body": "Try adjusting your filters or search.",
  "rev.empty.no_written_review": "(No written review)",

  "rev.kpi.avg_rating": "Average Rating",
  "rev.kpi.total": "Total Reviews",
  "rev.kpi.pending": "Pending",
  "rev.kpi.flagged": "Flagged",
  "rev.kpi.response_rate": "Response Rate"
}
```


---

## 17. Shopify Admin API Integration

### 17.1 Review Data Model

Shopify does not have a native reviews product. Reviews are typically managed via:
1. **Shopify Product Reviews app** (deprecated, being sunset)
2. **Judge.me / Yotpo / Okendo** — third-party apps with their own APIs
3. **Custom metafields + custom storefront** — fully custom implementation

This spec documents the **custom metafield + Admin API** approach for maximum control and no recurring app cost.

### 17.2 Review Data Schema (Custom Metafields)

Reviews are stored as a JSON array in a product metafield, with individual review records also stored as customer metafields for the "My Reviews" section.

**Product metafield — reviews store:**

```json
{
  "namespace": "reviews",
  "key": "all_reviews",
  "type": "json",
  "value": [
    {
      "id": "REV-08214",
      "customer_id": "gid://shopify/Customer/821430001",
      "reviewer_name": "Priya Kumar",
      "reviewer_email": "priya@email.com",
      "order_id": "gid://shopify/Order/4821",
      "rating": 5,
      "title": "",
      "body": "Absolutely beautiful plant!...",
      "photos": ["https://cdn.heroplants.com/review-photos/REV-08214-1.webp"],
      "status": "published",
      "is_verified_purchase": true,
      "is_featured": false,
      "admin_reply": "Thank you for the wonderful review! 🌿",
      "admin_reply_at": "2026-06-16T10:05:00+05:30",
      "admin_reply_by": "Suresh K.",
      "flag_count": 0,
      "flags": [],
      "moderation_history": [
        { "action": "submitted", "at": "2026-06-15T10:32:00+05:30", "by": "customer" },
        { "action": "approved", "at": "2026-06-16T10:05:00+05:30", "by": "admin:SUK-001" }
      ],
      "created_at": "2026-06-15T10:32:00+05:30",
      "updated_at": "2026-06-16T10:05:00+05:30"
    }
  ]
}
```

**Product review aggregate metafield:**

```json
{
  "namespace": "reviews",
  "key": "aggregate",
  "type": "json",
  "value": {
    "count": 248,
    "average": 4.9,
    "distribution": { "5": 210, "4": 28, "3": 7, "2": 2, "1": 1 }
  }
}
```

**Customer metafield — submitted reviews:**

```json
{
  "namespace": "reviews",
  "key": "submitted",
  "type": "json",
  "value": [
    { "review_id": "REV-08214", "product_id": "...", "rating": 5, "status": "published" }
  ]
}
```

### 17.3 Key Admin API Endpoints Used

| Action | Endpoint | Method |
|---|---|---|
| Fetch all reviews for a product | `GET /admin/api/2024-10/products/{id}/metafields.json?namespace=reviews` | Read |
| Update review status (approve/reject) | `PUT /admin/api/2024-10/products/{id}/metafields/{mf_id}.json` | Write |
| Add admin reply | `PUT /admin/api/2024-10/products/{id}/metafields/{mf_id}.json` | Write |
| Update aggregate | `PUT /admin/api/2024-10/products/{id}/metafields/{agg_id}.json` | Write |
| Fetch customer reviews | `GET /admin/api/2024-10/customers/{id}/metafields.json?namespace=reviews` | Read |
| Create review (admin-created) | `POST /admin/api/2024-10/products/{id}/metafields.json` | Write |
| Delete review (full) | Update metafield JSON array to remove element | Write |
| Upload review photo | Shopify Files API or CDN upload | Write |

### 17.4 Review Request Email Automation

Implemented via Shopify Flow:

```
Trigger: Order fulfilled + [n] days passed
Condition: Customer has not reviewed this product
Action: Send email via Klaviyo/Mailchimp with review CTA link
         → Link: /account?review=true&product=[id]&order=[id]
```

### 17.5 Third-Party App Integration (Alternative)

If using Judge.me / Yotpo / Okendo instead:

| App | Admin API | Moderation endpoint |
|---|---|---|
| Judge.me | `GET /judge_me/reviews` + `PUT /judge_me/reviews/{id}` | `?state=published/unreviewed/rejected` |
| Yotpo | Yotpo REST API v1 `/reviews/{review_id}/vote` | |
| Okendo | Okendo API `/reviews/{id}/status` | |

The admin UI spec remains the same regardless of backend — only the API calls change.

---

## 18. Component Migration Notes

### 18.1 Token Adoption Priority

| Priority | Token group | Risk if skipped |
|---|---|---|
| P0 — Critical | All `admin.color.*` base tokens | Dark theme breaks |
| P0 — Critical | `rev.focus-ring` + `rev.focus-glow` | WCAG 2.4.11 failure |
| P0 — Critical | `rev.flagged-bg` on flagged rows | Flagged reviews invisible |
| P0 — Critical | `rev.star-fill` with text equivalent | WCAG 1.4.1 failure if stars alone |
| P1 — High | `rev.published`, `rev.pending`, `rev.rejected` | Status indistinguishable |
| P1 — High | `radius.xs` through `radius.lg` | Shape regressions |
| P2 — Medium | `rev.shadow` | Drawer elevation polish |
| P2 — Medium | `motion.*` tokens | Drawer slide animation |

### 18.2 Reused Admin Components

| Component | Source | Usage |
|---|---|---|
| Admin table (compact view) | `admin-dashboard-design.md §7.1` | Compact table view toggle |
| Admin checkbox | `admin-dashboard-design.md §7.2` | Row selection, settings toggles |
| Admin primary button | `admin-dashboard-design.md §7.3` | Approve, Post Reply |
| Admin ghost button | `admin-dashboard-design.md §7.3` | Reject, View Full |
| Admin danger button | `admin-dashboard-design.md §7.3` | Delete Permanently |
| Admin toggle switch | `admin-dashboard-design.md §7.2` | Feature toggle |
| Admin modal shell | `admin-dashboard-design.md §7.5` | Bulk action confirmations |
| Admin toast | `admin-dashboard-design.md §7.6` | Approve/reject/reply success |
| Admin filter drawer | `admin-dashboard-design.md §7.8` | Reviews filter panel |
| Chart component | `admin-dashboard-design.md §6.3` | Analytics page charts |
| Admin textarea | `admin-dashboard-design.md §7.2` | Reply composer |

### 18.3 Page-Exclusive Components

| Component | Notes |
|---|---|
| Review card-row (hybrid list item) | Reviews only — richer than a standard table row |
| Star rating display (admin scale) | Shared between admin modules; canonical def here |
| Verified Purchase badge | Reviews + Customers modules |
| Flag/report indicator band | Reviews only |
| Admin reply indicator (inline) | Reviews only |
| Moderation actions inline panel | Reviews only |
| Auto-advance setting + behaviour | Reviews only |
| Rating distribution horizontal bars | Reviews analytics only |
| Review detail drawer | Reviews only |
| Photo lightbox | Reviews only |
| Review settings drawer | Reviews only |

---

## 19. Component State Master Table

| Component | Default | Hover | Focus-visible | Active | Disabled | Loading | Error | Success |
|---|---|---|---|---|---|---|---|---|
| Status tab (default) | `rev.border`, transparent | `rev.card-hover` | `2px` ring | — | — | — | — | — |
| Status tab (active) | `rev.accent` bg, white | Darken 5% | `2px` ring | — | — | — | — | — |
| Review card | `rev.card-bg`, `rev.border-muted` | `rev.card-hover` | `2px` ring (on focusable child) | — | — | — | — | — |
| Review card (flagged) | `rev.flagged-bg`, `4px left border` | Same + deeper | — | — | — | — | — | — |
| Row checkbox | `rev.border`, white | `rev.border-active` | `rev.focus-glow` | — | — | — | — | `rev.accent` fill |
| `[Approve]` button | `rev.accent` | Darken 10% | `2px` ring + glow | Scale `0.98` | `opacity: 0.4` | Spinner, `aria-busy` | Error toast | `"✓ Published"` briefly |
| `[Reject]` button | Ghost, `rev.danger` | `rev.rejected-bg` tint | `2px` ring `rev.danger` | Scale `0.98` | `opacity: 0.4` | Spinner | — | Reason select reveals |
| `[Confirm Rejection]` | `rev.danger` filled | Darken | `2px` ring | Scale `0.98` | — | Spinner | Error toast | Toast + status updates |
| `[Reply]` button | Secondary outlined | `rev.card-hover` | `2px` ring | Scale `0.98` | — | — | — | Composer opens |
| `[Post Reply]` | `rev.accent` | Darken | `2px` ring | Scale `0.98` | Empty/over-limit | Spinner | Error toast | Reply appears inline |
| Feature toggle | Off: grey track | — | `2px` ring | — | Non-published review: `opacity: 0.4` | — | — | On: `rev.accent` track |
| Reply textarea | `rev.input-bg`, `rev.border` | `rev.border-active` @ 60% | `rev.border-active` + glow | — | — | — | Red border | — |
| Photo thumbnail | `radius.sm` | Scale `1.02`, cursor pointer | `2px` ring | — | — | Skeleton | — | — |
| `[Remove Photo]` | Hidden | Visible ghost overlay | `2px` ring | — | — | — | — | Photo removed |
| Detail drawer | Slide-in from right | — | — | — | — | — | — | — |
| `×` close | `rev.text-muted` | `rev.text` | `2px` ring | Scale `0.95` | — | — | — | — |
| Bulk `[Approve]` | `rev.accent` filled | Darken | `2px` ring | Scale `0.98` | 0 selected | Spinner | Error toast | Toast: "N approved" |
| Bulk `[Reject]` | Ghost, `rev.danger` | `rev.rejected-bg` | `2px` ring | Scale `0.98` | 0 selected | Spinner | — | Toast: "N rejected" |
| Bulk `[Delete]` | Ghost, `rev.danger` | `rev.rejected-bg` | `2px` ring | Scale `0.98` | No permission / 0 selected | Spinner | Permission error | Toast: "N deleted" |
| Lightbox prev/next | Ghost, white icon | Semi-dark bg | `2px` ring white | — | At first/last | — | — | — |
| Rating distribution bar | `rev.star-fill` fill | Cursor pointer, slight scale | `2px` ring | Filters main list | — | — | — | — |
| `[Save Settings]` | `rev.accent` filled | Darken | `2px` ring | Scale `0.98` | — | Spinner | Error toast | Toast: "Settings saved" |
| KPI card | `rev.card-bg` | `rev.card-hover` | `2px` ring (if linked) | — | — | Skeleton | — | — |
| Overflow menu trigger | `rev.text-muted` | `rev.card-hover` | `2px` ring | — | — | — | — | — |
| Overflow item (danger) | Transparent | `rev.rejected-bg` | `2px` ring | — | — | — | — | — |
| Toast | Slide in, coloured border | — | — | — | — | — | — | Auto-dismiss 3–4s |

---

## 20. Final Summary — Complete Section Map

```
Admin Reviews Module — v1.0
Complete Design Specification
═══════════════════════════════════════════════════════════════════════
CORE SPEC (§1–§14)

§1   Context & Goals
§2   Design Tokens (17 inherited, 24 rev.* aliases, typography × 19,
     spacing/radius/motion, contrast audit × 6)

REVIEWS LIST / MODERATION QUEUE (§3–§4)
§3   Page Layout (list + drawer structure, layout rules)
§4   Reviews List / Moderation Queue
     §4.1  Page Header (title, total, avg, pending count)
     §4.2  KPI Cards Row (5 cards — Pending + Flagged bordered red)
     §4.3  Status Filter Tabs (Pending as DEFAULT view — key decision)
     §4.4  Table Toolbar (search, filter, sort, view toggle, bulk bar)
     §4.5  Reviews List — Card-Row Hybrid (default, rich view)
           • Card shell, header, body, meta, action row
           • Flag/report indicator band
           • Admin reply indicator
     §4.6  Reviews List — Compact Table (alternate toggle)
     §4.7  Status Badge Variants (5 statuses)
     §4.8  Overflow Menu (⋮, 7 items)
     §4.9  Pagination & Empty States

REVIEW DETAIL DRAWER (§5)
§5   Review Detail Drawer (480px right-slide, focus-trapped)
     §5.1  Drawer Header (ID, close)
     §5.2  Reviewer & Product Info (verified badge, cross-links)
     §5.3  Rating & Review Text (full text, edit-text option)
     §5.4  Photos (lightbox, per-photo remove)
     §5.5  Flag / Report Details (conditional, report list)
     §5.6  Moderation Actions (approve/reject inline flow, feature toggle)
     §5.7  Admin Reply Composer (templates, 1000 char limit, draft/post)
     §5.8  Moderation History (append-only log)

BULK & FLOWS (§6–§8)
§6   Bulk Moderation (Approve / Reject / Delete — role-restricted)
§7   Reviews Analytics Page (distribution bars, trend chart,
     top/lowest rated products)
§8   Review Settings Panel (auto-approve rules, auto-advance,
     request emails, display options)

SYSTEMS (§9)
§9   Review State Machine (6 states, valid transition table,
     UI enforcement rules)

EXTENDED IMPLEMENTATION GUIDE (§10–§20)

§10  Accessibility Requirements
     • Focus management (10 scenarios)
     • Full ARIA map (22 components)
     • Keyboard map (11 keys)
     • 11 testable acceptance criteria

§11  Content & Tone Standards
     • Status labels (5) · CTA labels (6) · Rejection reasons (7)
     • Error messages (4) · Confirmation templates (4)

§12  Anti-Patterns (× 13 prohibited implementations)

§13  Edge-Case Handling (× 13 scenarios)

§14  Performance Requirements (8 metrics)

§15  Analytics & Tracking Events (× 20 events)

§16  Internationalisation (65 i18n keys)

§17  Shopify Admin API Integration
     • Custom review data schema (metafields JSON)
     • Review aggregate metafield
     • 8 API endpoints
     • Review request email via Shopify Flow
     • Third-party app integration note (Judge.me/Yotpo/Okendo)

§18  Component Migration Notes
     • Token priority P0–P3
     • 11 reused admin components
     • 11 page-exclusive components

§19  Component State Master Table (× 23 components × 8 states)

§20  Final Summary — Section Map (this section)

═══════════════════════════════════════════════════════════════════════
Total: ~1,900 lines | 20 sections
WCAG 2.2 AA | Admin dark token system (Outfit)

Companion documents:
  admin-dashboard-design.md     ← Admin system tokens & shared components
  admin-customers-design.md     ← Customer profile (cross-linked from reviewer info)
  admin-product-page-design.md  ← Product edit (cross-linked from review product)
  admin-orders-design.md        ← Orders (cross-linked from verified purchase order)
  profile-design.md             ← Storefront My Reviews (customer-facing counterpart)
  design-system.md              ← Master storefront design system

Last updated: June 2026
═══════════════════════════════════════════════════════════════════════
```

---

*Document version: 1.0 (complete) — Admin Reviews Module*
*Sections: 1–9 (core spec) + 10–20 (extended implementation guide)*
*Guideline standard: WCAG 2.2 AA | Token system: Admin dark (Outfit)*
*Companion: `admin-dashboard-design.md` · `admin-customers-design.md` · `admin-orders-design.md`*
*Last updated: June 2026*
