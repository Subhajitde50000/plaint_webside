# Admin — AI Care Usage Module
## Design Specification v1.0 — Production-Ready

> **Design intent:** Deliver a data-rich AI Care operations dashboard that gives admins full visibility into how customers use the plant care chatbot — query volumes, plant identification accuracy, conversation quality, conversion to cart, flagged/problematic queries, and per-plant topic trends — enabling the team to improve AI responses, detect abuse, and understand what plant care questions drive the most revenue, all in the same dark-theme admin system.

---

## 1. Context & Goals

| Property | Value |
|---|---|
| **Module name** | AI Care Usage |
| **URLs** | `/admin/ai-care` (dashboard) · `/admin/ai-care/queries` (query log) · `/admin/ai-care/queries/[id]` (detail drawer) · `/admin/ai-care/settings` (configuration) |
| **Parent** | Admin Dashboard (`admin-dashboard-design.md`) |
| **Primary goal** | Monitor AI Care health — volume, accuracy, satisfaction, and revenue impact |
| **Secondary goals** | Detect abuse / harmful queries; identify knowledge gaps; track photo-upload quality; measure cart conversion from AI recommendations |
| **User roles** | Super Admin (full) · Operations Manager (full) · Marketing (view + analytics) · Analyst (read-only) |
| **No access** | Customer Support · Inventory Manager · Garden Services Coordinator |
| **Linked modules** | Products · Customers · Analytics |
| **Page density** | Tables: 2 · Cards: ~25 · Charts: 8 · Buttons: ~30 · Inputs: ~10 |

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
| `admin.color.brand.green` | `#00b566` | CTAs, accent |
| `admin.color.brand.green.muted` | `#00b566` @ 15% | Selected bg |
| `admin.color.border.default` | `#444c56` | Borders |
| `admin.color.border.active` | `#00b566` | Focus, active |
| `admin.color.status.success` | `#57ab5a` | Helpful, converted |
| `admin.color.status.warning` | `#c69026` | Low satisfaction, review needed |
| `admin.color.status.error` | `#e5534b` | Flagged, abuse |
| `admin.color.status.info` | `#539bf5` | Info, neutral |
| `admin.color.status.purple` | `#986ee2` | Plant ID, special |

### 2.2 AI Care Module Semantic Aliases

| Alias | Maps to | Usage |
|---|---|---|
| `ai.page-bg` | `admin.color.bg.canvas` | Page background |
| `ai.card-bg` | `admin.color.bg.surface` | All panels |
| `ai.card-hover` | `admin.color.bg.elevated` | Row hover |
| `ai.input-bg` | `admin.color.bg.elevated` | All inputs |
| `ai.overlay-bg` | `admin.color.bg.overlay` | Modals, drawers |
| `ai.text` | `admin.color.text.primary` | Primary text |
| `ai.text-muted` | `admin.color.text.secondary` | Meta, timestamps |
| `ai.text-label` | `admin.color.text.tertiary` | Headers, labels |
| `ai.border` | `admin.color.border.default` | All borders |
| `ai.border-muted` | `admin.color.border.default` @ 50% | Subtle dividers |
| `ai.border-active` | `admin.color.border.active` | Focus, active |
| `ai.accent` | `admin.color.brand.green` | CTAs, active |
| `ai.accent-bg` | `admin.color.brand.green.muted` | Selected row |
| `ai.focus-ring` | `admin.color.brand.green` | Focus ring |
| `ai.focus-glow` | `0 0 0 3px rgba(0,181,102,0.25)` | Focus glow |
| `ai.shadow` | `0 2px 8px rgba(0,0,0,0.25)` | Panel shadow |
| `ai.helpful` | `admin.color.status.success` | 👍 Helpful rating |
| `ai.helpful-bg` | `admin.color.status.success.bg` | Helpful badge bg |
| `ai.not-helpful` | `admin.color.status.error` | 👎 Not helpful |
| `ai.not-helpful-bg` | `admin.color.status.error.bg` | Not helpful bg |
| `ai.neutral` | `admin.color.text.secondary` | No rating |
| `ai.flagged` | `admin.color.status.error` | Flagged query |
| `ai.flagged-bg` | `admin.color.status.error` @ 10% | Flagged row tint |
| `ai.converted` | `admin.color.status.success` | Added to cart |
| `ai.plant-id` | `admin.color.status.purple` | Plant ID result |
| `ai.plant-id-bg` | `admin.color.status.purple.bg` | Plant ID badge bg |
| `ai.photo` | `admin.color.status.info` | Has photo |
| `ai.photo-bg` | `admin.color.status.info.bg` | Photo badge bg |
| `ai.chart-1` | `admin.color.chart.1` | Green — primary series |
| `ai.chart-2` | `admin.color.chart.2` | Blue — secondary |
| `ai.chart-3` | `admin.color.chart.3` | Amber — tertiary |
| `ai.chart-4` | `admin.color.chart.4` | Purple — plant ID |
| `ai.danger` | `admin.color.status.error` | Destructive actions |

### 2.3 Typography

| Role | Size | Weight | Colour |
|---|---|---|---|
| Page heading | `font.size.5xl` (24px) | 700 | `ai.text` |
| KPI value | `font.size.6xl` (32px) | 800 | `ai.text` |
| KPI label | `font.size.sm` (12px) | 500 | `ai.text-muted` |
| Section heading | `font.size.4xl` (18px) | 700 | `ai.text` |
| Panel heading | `font.size.3xl` (16px) | 600 | `ai.text` |
| Column header | `font.size.xs` (11px) | 700 | `ai.text-label`, uppercase |
| Table cell body | `font.size.sm` (12px) | 400 | `ai.text` |
| Table cell meta | `font.size.xs` (11px) | 400 | `ai.text-muted` |
| Query text | `font.size.sm` (12px) | 400 | `ai.text`, line-height 1.6 |
| AI response text | `font.size.sm` (12px) | 400 | `ai.text`, italic |
| Status badge | `font.size.xs` (11px) | 700 | status colour |
| Button label | `font.size.sm` (12px) | 600 | per type |
| Input label | `font.size.xs` (11px) | 700 | `ai.text-label`, uppercase |
| Chart axis | `font.size.xs` (11px) | 400 | `ai.text-muted` |
| Chart legend | `font.size.xs` (11px) | 500 | `ai.text-label` |
| Ranked item | `font.size.sm` (12px) | 500 | `ai.text` |
| Tab label | `font.size.sm` (12px) | 600 | active: `ai.accent` |
| Empty state | `font.size.3xl` (16px) | 600 | `ai.text` |

### 2.4 Spacing, Radius & Motion

Same scale as all admin modules: `space.2=4px` through `space.12=48px`. `radius.xs=4px` through `radius.full=9999px`. `motion.instant=150ms` through `motion.slow=350ms`.


---

## 3. Page Layout

### 3.1 AI Care Dashboard Structure

```
┌──────────────────────────────────────────────────────────────────────┐
│  TOP BAR (64px)                                                      │
├──────────────┬───────────────────────────────────────────────────────┤
│  SIDEBAR     │  BREADCRUMB: Admin / AI Care Usage                   │
│  (240px)     ├───────────────────────────────────────────────────────┤
│              │  PAGE HEADER + KPI ROW (6 cards)                     │
│              ├───────────────────────────────────────────────────────┤
│              │  SECTION TABS: [Overview] [Query Log] [Settings]      │
│              ├───────────────────────────────────────────────────────┤
│              │  ACTIVE TAB CONTENT                                   │
└──────────────┴───────────────────────────────────────────────────────┘
```

### 3.2 Query Detail Drawer

Right-side slide-in, `520px` wide (wider than reviews to accommodate full conversation threads).

```
┌────────────────────────────────────────────────────┐
│  Query Detail                               [×]   │
├────────────────────────────────────────────────────┤
│  • Session Info (user, timestamp, device)           │
│  • Uploaded Photo (if present)                      │
│  • Full Conversation Thread                         │
│  • AI Response Quality Indicators                   │
│  • Cart Conversion Details                          │
│  • Flag / Review Actions                            │
└────────────────────────────────────────────────────┘
```

### 3.3 Layout Rules

| Property | Value |
|---|---|
| Content padding | `space.9 = 24px` all sides |
| Page background | `ai.page-bg` |
| Drawer width | `520px` |
| Min page width | `1280px` |
| Chart grid | `2-column` for side-by-side charts |
| Chart gap | `space.9 = 24px` |

---

## 4. Page Header & KPI Cards

### 4.1 Page Header

```
AI Care Usage                         [📅 Last 30 days ▾]  [↓ Export]
Monitoring 14,821 total queries · 4.2% flagged · 12.4% cart conversion
```

| Element | Value |
|---|---|
| Title | `font.size.5xl` (24px), weight 700, `ai.text` |
| Subtitle | `font.size.sm`, `ai.text-muted` — key metrics inline |
| Date range | Today / Last 7 / Last 30 / Last 90 / Custom |
| Export | Secondary outlined — exports query log CSV |

### 4.2 KPI Cards Row

```
┌────────────────┐ ┌────────────────┐ ┌────────────────┐
│ Total Queries  │ │ Unique Users   │ │ Photo Uploads  │
│ 14,821         │ │ 3,204          │ │ 6,234  📷      │
│ ↑ +18.4%(30d) │ │ ↑ +4.2%       │ │ 42% of queries │
└────────────────┘ └────────────────┘ └────────────────┘
┌────────────────┐ ┌────────────────┐ ┌────────────────┐
│ Helpful Rating │ │ Cart Converted │ │ Flagged        │
│ 78%  👍        │ │ 12.4%  ₹      │ │ 3.2%  ⚠        │
│ ↑ +2.1%       │ │ ₹48,320 rev.  │ │ Needs review   │
└────────────────┘ └────────────────┘ └────────────────┘
```

**Single KPI card:**

| Property | Value |
|---|---|
| Background | `ai.card-bg` |
| Border | `1px solid ai.border-muted` |
| Border-radius | `radius.md` |
| Padding | `space.9 = 24px` |
| Label | `font.size.sm`, weight 500, `ai.text-muted` |
| Value | `font.size.6xl` (32px), weight 800, `ai.text` |
| "Flagged" card | Value in `ai.flagged`; left border `3px solid ai.flagged` |
| "Helpful Rating" | Value in `ai.helpful` when ≥ 70%; `ai.not-helpful` when < 50% |
| "Cart Converted" | Sub-value `₹[amount]` in `ai.accent` |
| Hover | `ai.card-hover`, `motion.instant` |
| Click | Filters Query Log to that segment |
| Sparkline | 48px right-aligned, 30-day trend |
| `aria-label` | `"[label]: [value]"` |

---

## 5. Tab — Overview

### 5.1 Query Volume Chart

```
┌────────────────────────────────────────────────────────────┐
│  Query Volume                       [Daily ▾]  [↓ Export] │
│  600 ──────────────────────────────────────●──────────────  │
│  400 ───────────────────────────────●──────────────────────  │
│  200 ──●──────────────────●──────────────────────────────── │
│    0 ──┴──────────────────┴────────────────┴───────────────  │
│        Jun 1          Jun 14           Jun 28              │
│        ── Total queries   ── With photos   ── Converted    │
└────────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Background | `ai.card-bg`, `ai.border-muted`, `radius.md` |
| Height | `280px` |
| Series 1 | Total queries — `ai.chart-1` (green) |
| Series 2 | With photos — `ai.chart-2` (blue) |
| Series 3 | Cart conversions — `ai.chart-3` (amber) |
| Toggle | Daily / Weekly / Monthly |
| Tooltip | Date + counts for each series |
| `role` | `role="img"`, `aria-label` with summary |

### 5.2 Satisfaction Rating Distribution

```
┌────────────────────────────────────────────┐
│  Response Quality                          │
├────────────────────────────────────────────┤
│  👍 Helpful     ████████████████  78% 3,842│
│  👎 Not helpful ████              12% 591  │
│  — No rating   ████              10% 493  │
└────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Bar colours | 👍 `ai.helpful` · 👎 `ai.not-helpful` · — `ai.border` |
| Click bar | Filters Query Log to that rating |
| `role` | `role="img"` on chart; rows `aria-label="[rating]: [count], [percent]%"` |

### 5.3 Top 20 Asked Questions

```
┌────────────────────────────────────────────────────────────┐
│  Most Common Questions                    [View All →]     │
├────┬───────────────────────────────────────┬───────┬───────┤
│  # │  QUESTION TOPIC                       │ COUNT │  AVG  │
│    │                                       │       │  RATING│
├────┼───────────────────────────────────────┼───────┼───────┤
│  1 │ "Why are my leaves turning yellow?"   │  824  │  👍84%│
│  2 │ "How often should I water Monstera?"  │  612  │  👍91%│
│  3 │ "Best plants for low light?"          │  488  │  👍76%│
│  4 │ "Is my plant overwatered?"            │  421  │  👍69%│
│ ...│ ...                                   │  ...  │  ...  │
└────┴───────────────────────────────────────┴───────┴───────┘
```

| Property | Value |
|---|---|
| Question topic | NLP-clustered topic label from query text |
| Count | Total times this topic was asked |
| Avg rating | Helpful % for this topic |
| Row click | Filters Query Log to that topic cluster |
| "View All →" | Opens full topic analysis page |
| Low-rated topics | Rating < 60% → amber `ai.chart-3` row tint = knowledge gap signal |

### 5.4 Plant Identification Stats

```
┌────────────────────────────────────────────┐  ┌────────────────────────────────────────────┐
│  Plant ID Accuracy                         │  │  Most Uploaded Plants                      │
├────────────────────────────────────────────┤  ├──────────────────────────────┬─────────────┤
│  Identified successfully    82%            │  │  Monstera Deliciosa          │ 1,204 times │
│  Low confidence (< 70%)     11%            │  │  Pothos                      │   842 times │
│  Failed / unrecognised       7%            │  │  Snake Plant                 │   612 times │
│                                            │  │  ZZ Plant                    │   488 times │
│  Total ID requests: 6,234                  │  │  Peace Lily                  │   401 times │
└────────────────────────────────────────────┘  └──────────────────────────────┴─────────────┘
```

| Property | Value |
|---|---|
| Accuracy donut | 3-segment: Success `ai.helpful` / Low confidence `ai.chart-3` / Failed `ai.not-helpful` |
| Low confidence row | Amber; clicking filters photo queries by `confidence < 70%` |
| Right table | Plant name + upload count; click filters query log to that plant |

### 5.5 Cart Conversion Funnel

```
┌────────────────────────────────────────────────────────────┐
│  AI → Cart Conversion Funnel                                │
│                                                              │
│  Total AI queries:    14,821   ██████████████████████████   │
│  Received suggestion: 11,240   ████████████████████         │
│  Clicked suggestion:   2,812   ██████                       │
│  Added to cart:        1,840   ████                         │
│  Completed checkout:     824   ██                           │
│                                                              │
│  Conversion rate:  12.4% (queries → add to cart)            │
│  Revenue:          ₹48,320 (last 30 days)                   │
└────────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Funnel bars | Horizontal, `ai.accent` fill, decreasing widths |
| Each step | Label + count + bar |
| Percentages | Step-to-step drop-off rates shown on hover |
| Revenue | `ai.accent`, `font.size.3xl`, weight 700 |
| `role` | `role="img"`, `aria-label` with full funnel data |

### 5.6 Query Source Breakdown

```
┌────────────────────────────────────────────┐
│  Query Sources                              │
├────────────────────────────────────────────┤
│  Chat (text only)     58%  ████████████    │
│  Photo upload         42%  ██████████      │
│  Room Visualiser       8%  ██              │
│  Quick prompts        24%  ██████          │
└────────────────────────────────────────────┘
```

Donut chart variant with legend. Click segment filters Query Log to that source type.

### 5.7 Daily Active AI Users

```
┌────────────────────────────────────────────────────────────┐
│  Daily Active AI Users (DAU)                [Last 30 days] │
│  [bar chart: unique users per day]                          │
└────────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Chart type | Bar, `ai.chart-1` |
| Height | `200px` |
| Hover | Date + unique user count |


---

## 6. Tab — Query Log

### 6.1 Query Log Toolbar

```
[🔍 Search queries...]  [Filter ▾]  [Sort: Newest ▾]  [Export CSV]
```

**Filter panel sections:**

| Section | Options |
|---|---|
| User Type | Logged-in customer · Guest |
| Has Photo | Yes / No |
| Rating | 👍 Helpful / 👎 Not helpful / No rating |
| Conversion | Converted to cart / Not converted |
| Status | Normal / Flagged / Reviewed |
| Date Range | Date range picker |
| Plant Type | Search by plant name mentioned |
| Query Source | Chat / Photo upload / Room Visualiser / Quick prompt |

### 6.2 Query Log Table

```
┌────────┬──────────────────────────────────┬───────┬────────┬──────────┬────────────┐
│  USER  │  QUERY                           │ PHOTO │ RATING │ CONVERTED│  DATE      │
├────────┼──────────────────────────────────┼───────┼────────┼──────────┼────────────┤
│ Priya K│ "Why are my Monstera leaves..."  │  📷   │  👍    │   ✓      │ 15 Jun     │
│ Guest  │ "Best plants for bedroom?"       │  —    │  👎    │   —      │ 15 Jun     │
│ Ravi S │ "Identify this plant please"     │  📷   │  —     │   ✓      │ 14 Jun     │
└────────┴──────────────────────────────────┴───────┴────────┴──────────┴────────────┘
```

**Column definitions:**

| # | Column | Content | Width | Sortable |
|---|---|---|---|---|
| 1 | User | Avatar + Name / "Guest" | `140px` | Yes |
| 2 | Query | Truncated first message text | `300px` | No |
| 3 | Photo | 📷 icon if photo attached / `—` | `70px` | No |
| 4 | Rating | 👍 / 👎 / `—` | `80px` | Yes |
| 5 | Converted | `✓` `ai.converted` / `—` | `90px` | Yes |
| 6 | Date | Relative + absolute on hover | `110px` | Yes |
| 7 | Status | Normal / Flagged / Reviewed badge | `100px` | Yes |
| 8 | Actions | `[View]` `[Flag]` `[⋮]` | `100px` | No |

**Table shell:**

| Property | Value |
|---|---|
| Background | `ai.card-bg` |
| Border | `1px solid ai.border-muted`, `radius.md` |
| Virtual scroll | Mandatory beyond 100 rows |

**Flagged row:**

| Property | Value |
|---|---|
| Background | `ai.flagged-bg` |
| Left border | `4px solid ai.flagged` |
| Status badge | `"Flagged"`, `ai.not-helpful-bg` bg, `ai.flagged` text |

**Query text cell:**

| Property | Value |
|---|---|
| Font | `font.size.sm`, `ai.text` |
| Truncation | Max 60 chars; ellipsis |
| Click | Opens query detail drawer |

**Rating cell:**

| Value | Display |
|---|---|
| `helpful` | 👍 in `ai.helpful` |
| `not_helpful` | 👎 in `ai.not-helpful` |
| `null` | `—` in `ai.text-muted` |

**Overflow menu (⋮):**

```
View Full Conversation
View Customer Profile
────────────────────
Flag as Inappropriate
Mark as Reviewed
────────────────────
Delete Query Log
```

| Property | Value |
|---|---|
| `Delete Query Log` | Super Admin only; removes from log (GDPR-support use case) |
| `Flag as Inappropriate` | Sets status to `FLAGGED`; adds to review queue |

### 6.3 Status Badges

| Status | Background | Text |
|---|---|---|
| Normal | — (no badge) | — |
| Flagged | `ai.not-helpful-bg` | `ai.flagged` |
| Reviewed | `ai.helpful-bg` | `ai.helpful` |

### 6.4 Empty States

**No queries yet:**
```
        🤖
  No AI Care queries yet
  Queries will appear once customers
  start using the AI Care feature.
```

**No results for filters:**
```
        📭
  No queries found
  Try adjusting your filters or search.
  [ Clear Filters ]
```

---

## 7. Query Detail Drawer

### 7.1 Drawer Shell

| Property | Value |
|---|---|
| Width | `520px` |
| Background | `ai.card-bg` |
| Border-left | `1px solid ai.border` |
| Shadow | `0 8px 32px rgba(0,0,0,0.4)` |
| `role` | `role="dialog"`, `aria-modal="true"`, `aria-label="Query detail"` |
| Animation | Slides from right, `motion.normal` |
| Close | `×` button + Escape |
| Focus trap | Yes |

### 7.2 Session Info

```
┌─────────────────────────────────────────────────────┐
│  [Avatar] Priya Kumar          [ View Customer →]   │
│           priya@email.com                           │
│           15 Jun 2026 · 2:30 PM                    │
│           Mobile · iOS · Chrome                     │
│           Session: 4 messages · 3 min 22 sec        │
└─────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Avatar | `36×36px`, `radius.full` |
| Name | `font.size.3xl`, weight 700, `ai.text` |
| Guest | Shows `"Guest User"` with `ai.text-muted` italic |
| `[View Customer →]` | Links to `/admin/customers/[id]` in new tab |
| Session stats | Turn count + duration; `font.size.xs`, `ai.text-muted` |

### 7.3 Uploaded Photo (conditional)

```
┌─────────────────────────────────────────────────────┐
│  Uploaded Photo                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │                [Photo image]                │   │
│  └─────────────────────────────────────────────┘   │
│  Plant ID Result:  🌿 Monstera Deliciosa (94%)      │
│  Confidence: ██████████████████░░  High             │
└─────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Photo | `100%` width, max `240px` height, `radius.sm`, `object-fit: contain` |
| Plant ID result | `font.size.sm`, weight 600, `ai.plant-id` colour |
| Confidence bar | `8px` height, `radius.full`; colour: `ai.helpful` High / `ai.chart-3` Medium / `ai.not-helpful` Low |
| Confidence label | `High ≥ 80%` · `Medium 50–79%` · `Low < 50%` |
| Not identified | `"Plant not identified"`, `ai.text-muted` |

### 7.4 Full Conversation Thread

```
┌─────────────────────────────────────────────────────┐
│  Conversation                                       │
├─────────────────────────────────────────────────────┤
│  👤  "Why are my Monstera leaves turning yellow?"    │
│      2:30:04 PM                                     │
│                                                     │
│  🤖  "Yellow leaves on a Monstera can indicate     │
│      overwatering, low light, or nutrient           │
│      deficiency. Here are some steps to try:        │
│      1. Check soil moisture before watering...      │
│      2. Move to a brighter location..."              │
│      2:30:06 PM                                     │
│                                                     │
│      👍 Helpful?  ● Yes  ○ No  (customer rated)    │
│                                                     │
│  📦  AI suggested: [ Monstera Care Kit ₹499 ] →    │
│      ✓ Added to cart                               │
│                                                     │
│  👤  "It's also getting some brown spots."          │
│      2:32:18 PM                                     │
│                                                     │
│  🤖  "Brown spots alongside yellow leaves          │
│      typically suggest..."                          │
│      2:32:20 PM                                     │
└─────────────────────────────────────────────────────┘
```

**Customer message bubble:**

| Property | Value |
|---|---|
| Alignment | Left |
| Icon | `👤` `16px` |
| Background | `ai.input-bg` |
| Border-radius | `radius.md` |
| Font | `font.size.sm`, `ai.text` |
| Timestamp | `font.size.xs`, `ai.text-muted` |

**AI response bubble:**

| Property | Value |
|---|---|
| Alignment | Left (distinct background) |
| Icon | `🤖` `16px` |
| Background | `ai.accent-bg` |
| Border-radius | `radius.md` |
| Font | `font.size.sm`, `ai.text`, line-height 1.7 |
| Timestamp | `font.size.xs`, `ai.text-muted` |

**Rating shown inline:**

| Property | Value |
|---|---|
| Shows | Customer's helpful/not-helpful rating after AI message |
| Colour | `ai.helpful` or `ai.not-helpful` |
| Read-only | Admin cannot change customer's rating |

**Product suggestion bubble:**

```
📦  AI suggested: [ Monstera Care Kit ₹499 ] →  ✓ Added to cart
```

| Property | Value |
|---|---|
| Background | `ai.accent-bg` @ 50% |
| Border | `1px solid ai.accent` @ 30% |
| Radius | `radius.sm` |
| Product chip | `font.size.sm`, weight 600, `ai.accent`, links to product edit |
| Conversion badge | `✓ Added to cart`, `ai.converted`, `font.size.xs` weight 700 |

### 7.5 Flag / Review Actions

```
┌─────────────────────────────────────────────────────┐
│  Moderation                                          │
├─────────────────────────────────────────────────────┤
│  [ 🚩 Flag as Inappropriate ]                        │
│                                                     │
│  Flag reason (required):                             │
│  [ Select a reason ▾ ]                               │
│                                                     │
│  REVIEWED BY (if already reviewed)                   │
│  ✓ Reviewed by Suresh K. — 16 Jun 2026              │
│  "Not actually inappropriate — false positive."      │
│                                                     │
│  [ Mark as Reviewed — No Issue ]                     │
└─────────────────────────────────────────────────────┘
```

| Flag reasons | |
|---|---|
| Harmful/dangerous advice | AI gave incorrect plant care that could harm the plant |
| Inappropriate content | Customer or AI response contains inappropriate language |
| Privacy concern | PII shared in conversation |
| Spam/bot behaviour | Looks like automated query |
| Other | Admin must specify in note |

| Property | Value |
|---|---|
| `[Flag]` | Ghost, `ai.danger` text; reveals reason select |
| `[Mark as Reviewed]` | Primary `ai.accent`; marks status = `REVIEWED`, logs reviewer |
| Already flagged | Shows flag reason + `[Dismiss Flag]` + `[Confirm Issue]` options |


---

## 8. Tab — Settings

```
┌────────────────────────────────────────────────────┐
│  AI Care Settings                                   │
├────────────────────────────────────────────────────┤
│  AVAILABILITY                                        │
│  [ ☑ ] AI Care enabled on storefront               │
│  Show on: [ ☑ ] PDP   [ ☑ ] Dedicated page         │
│           [ ☑ ] Floating widget (mobile)            │
│                                                     │
│  FEATURES                                            │
│  [ ☑ ] Allow photo uploads (Plant ID)               │
│  [ ☑ ] Room Visualiser mode                         │
│  [ ☑ ] Quick prompts on widget open                 │
│  [ ☑ ] Product recommendations in responses         │
│  [ ☐ ] Allow conversation history (returning users) │
│                                                     │
│  RESPONSE SETTINGS                                   │
│  Language:       [ English               ▾ ]        │
│  Tone:           [ Friendly & informative▾ ]        │
│  Max response:   [ 300 ] words                       │
│  Fallback msg:   [ Sorry, I couldn't find info...  ]│
│                                                     │
│  SAFETY FILTERS                                      │
│  [ ☑ ] Block harmful/dangerous plant advice          │
│  [ ☑ ] Auto-flag queries with profanity              │
│  [ ☑ ] Auto-flag PII in conversations               │
│                                                     │
│  LOGGING & PRIVACY                                   │
│  [ ☑ ] Log all conversations (for analytics)        │
│  Retention:      [ 90 days              ▾ ]         │
│  [ ☑ ] Show "conversation saved" notice to users    │
│                                                     │
│  [ Save Settings ]                                  │
└────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| All toggles | `role="switch"`, `aria-checked`, same admin toggle spec |
| `[Save Settings]` | Primary `ai.accent`, full-width, `44px` |
| Language options | English · Hindi (beta) |
| Tone options | Friendly & informative · Professional · Concise |
| Retention options | 30 days · 60 days · 90 days · 1 year · Never delete |

---

## 9. Accessibility Requirements

### 9.1 Focus Management

| Interaction | Focus behaviour |
|---|---|
| AI Care dashboard load | Focus → date range picker (page is read-only data; no form fields top-priority) |
| Query Log tab switch | Focus → search field |
| Query row click | Focus → drawer heading |
| Drawer close (Escape) | Focus → returns to trigger row |
| Flag action clicked | Focus → reason select (revealed inline) |
| `[Mark as Reviewed]` success | `aria-live="polite"` announces; focus stays on button |
| Settings tab switch | Focus → first toggle |
| `[Save Settings]` success | Toast announced; focus stays on button |
| Lightbox photo open | Focus → close button |

### 9.2 Full ARIA Map

| Component | ARIA |
|---|---|
| Breadcrumb | `<nav aria-label="Breadcrumb">`, `aria-current="page"` |
| Page heading | `<h1>` — `"AI Care Usage"` |
| Main tabs | `role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls` |
| Tab panels | `role="tabpanel"`, `aria-labelledby` |
| KPI cards | `role="region"`, `aria-label="AI Care metrics"` |
| KPI card | `aria-label="[label]: [value]"` |
| Query volume chart | `role="img"`, `aria-label` with series summary |
| Satisfaction chart | `role="img"`; bars `aria-label="[rating]: [count], [percent]%"` |
| Funnel chart | `role="img"`, `aria-label` with full funnel data |
| Top questions table | `role="grid"`, `aria-label="Most common questions"` |
| Plant ID donut | `role="img"`, `aria-label` with accuracy breakdown |
| Query table | `role="grid"`, `aria-label="AI Care queries"` |
| Column headers | `role="columnheader"`, `aria-sort` |
| Query row | `role="row"` |
| Rating cell | `aria-label="Rating: Helpful"` / `"Not helpful"` / `"No rating"` |
| Conversion cell | `aria-label="Added to cart: Yes"` / `"No"` |
| Flagged row | `aria-label` includes "Flagged" in row description |
| Overflow menu | `aria-haspopup="menu"`; `role="menu"`, `role="menuitem"` |
| Detail drawer | `role="dialog"`, `aria-modal="true"`, focus trap |
| Photo lightbox | `role="dialog"`, `aria-modal="true"`, `aria-label="Query photo"` |
| Conversation log | `role="log"`, `aria-label="AI conversation"` |
| Confidence bar | `role="progressbar"`, `aria-valuenow/min/max`, `aria-label` |
| Product suggestion | `aria-label="AI suggested: [product name], [price]"` |
| Cart conversion | `aria-label="Added to cart: [yes/no]"` |
| Flag reason select | `aria-required="true"` when flag flow active |
| `[Mark as Reviewed]` | `aria-busy` during loading |
| Settings toggles | `role="switch"`, `aria-checked`, `aria-labelledby` |

### 9.3 Keyboard Map

| Key | Behaviour |
|---|---|
| `Tab` | Forward through interactive elements |
| `Shift+Tab` | Backward |
| `Arrow left/right` | Navigate main tabs |
| `Enter` | Activate button/link; open query row |
| `Space` | Toggle switch/checkbox |
| `Escape` | Close drawer/lightbox/dropdown |
| `Ctrl+A` | Select all query rows (table view) |

### 9.4 Testable Acceptance Criteria

| # | Criterion | Method | Pass |
|---|---|---|---|
| A1 | No contrast failures | axe DevTools | Zero critical |
| A2 | All focus rings visible (`2px solid #00b566` + glow) | Manual Tab | Every element |
| A3 | Main tabs keyboard-navigable | Arrow keys | `aria-selected` updates |
| A4 | All charts have `aria-label` text equivalents | Screen reader | Data summary announced |
| A5 | Conversation log accessible | Screen reader | `role="log"` announced |
| A6 | Confidence bar has correct ARIA | Screen reader | `aria-valuenow` correct |
| A7 | Drawer focus-trapped | Keyboard | Tab cycles inside only |
| A8 | Drawer closes on Escape; focus returns | Keyboard | Both conditions met |
| A9 | Settings toggles use `role="switch"` | Screen reader | State announced |
| A10 | `prefers-reduced-motion` respected | OS setting | All animations disabled |

---

## 10. Content & Tone Standards

### 10.1 Status Labels

| Internal | Display | Never use |
|---|---|---|
| `normal` | Normal / (no badge) | "OK", "Clean" |
| `flagged` | `Flagged` | "Reported", "Suspicious" |
| `reviewed` | `Reviewed` | "Checked", "Verified" |

### 10.2 CTA Labels

| Action | Label | Never use |
|---|---|---|
| Flag a query | `"Flag as Inappropriate"` | "Report", "Mark" |
| Clear a flag | `"Mark as Reviewed — No Issue"` | "Dismiss", "Clear" |
| Confirm flag | `"Confirm Issue"` | "Approve flag", "Yes" |
| Delete log entry | `"Delete Query Log"` | "Remove", "Purge" |
| Save settings | `"Save Settings"` | "Submit", "Update" |

### 10.3 Flag Reasons (canonical)

Harmful/dangerous advice · Inappropriate content · Privacy concern (PII) · Spam/bot behaviour · Other (must specify)

### 10.4 Empty & Zero States

| State | Message |
|---|---|
| No queries | `"No AI Care queries yet. Queries will appear once customers start using the AI Care feature."` |
| 0% conversion | `"No cart conversions recorded in this period."` |
| 100% helpful | `"🎉 All rated queries in this period were marked helpful!"` |
| AI disabled | Banner: `"⚠ AI Care is currently disabled. Enable it in Settings to start collecting data."` |

---

## 11. Anti-Patterns & Prohibited Implementations

| Anti-pattern | Why prohibited | Correct approach |
|---|---|---|
| Raw hex in CSS | Breaks token system | Use `admin.*` / `ai.*` tokens only |
| `outline: none` | WCAG failure | `outline: 2px solid ai.focus-ring` always |
| Charts with no text alternative | Screen readers get nothing | `role="img"` + `aria-label` with data summary on every chart |
| Rating shown as emoji only | WCAG 1.4.1 failure | Always pair with `aria-label` text |
| Storing customer conversation PII beyond retention period | GDPR/DPDPA violation | Enforce retention period setting; auto-delete on schedule |
| Showing customer PII (email) in query log to all roles | Privacy risk | Mask email to `p***@email.com` for non-Super-Admin in log |
| Query delete available to all roles | Irreversible data loss | Super Admin only |
| Rendering 1000+ conversation rows without virtual scroll | Browser lock-up | Virtual scroll mandatory beyond 100 rows |
| Auto-playing AI response audio (if voice feature added) | Disruptive | User-triggered only, never autoplay |
| Conversion rate shown without denominator context | Misleading metric | Always show `"X% of Y queries"` not just `"X%"` |

---

## 12. Edge-Case Handling

| Scenario | Behaviour |
|---|---|
| Query with no AI response (timeout/error) | Shows `"AI response unavailable"` in `ai.not-helpful` italic in conversation |
| Plant ID with 0% confidence | Shown as `"Unable to identify plant"` not a % |
| Conversation with 20+ turns | Thread shows first 5 + last 5 with `"[n] messages hidden — Show all"` expand |
| Guest user queries (no customer_id) | Shows `"Guest"` avatar with `ai.text-muted` italic |
| Photo upload fails | Query log shows `"Photo upload failed"` in `ai.text-muted` |
| Customer manually clears conversation history | Query log still retained on admin side per retention settings |
| AI recommended a product since deleted | Shows `"[Deleted product]"` in `ai.text-muted`; no link |
| Flagged query from VIP customer | Flag review does not suppress customer's account status — moderated independently |
| Bulk export of 10,000+ queries | Background job; email download link when ready |
| Settings change while queries in flight | New settings apply to subsequent queries; in-flight sessions complete with old settings |

---

## 13. Performance Requirements

| Metric | Target | Rule |
|---|---|---|
| Dashboard load | `< 1.5s` | KPI cards SSR; charts lazy-loaded |
| Query Log load | `< 1.5s` | First 25 rows SSR; virtual scroll beyond 100 |
| Detail drawer open | `< 300ms` | Hover-intent prefetch where possible |
| Chart render | `< 500ms` | Skeleton shown during load |
| Analytics export | `< 2s` for ≤ 1,000 rows; background for more | Queue + email |
| Search response | `< 300ms` | Debounced 250ms |
| Settings save | `< 500ms` | Optimistic UI; rollback on error |

---

## 14. Analytics & Tracking Events

| Event | Trigger | Properties |
|---|---|---|
| `ai_care_admin_view` | Dashboard load | `admin_id`, `date_range` |
| `ai_care_tab_switch` | Tab switched | `admin_id`, `tab` |
| `ai_care_filter_apply` | Filter applied | `admin_id`, `filters[]` |
| `ai_care_query_open` | Drawer opened | `admin_id`, `query_id` |
| `ai_care_query_flag` | Query flagged | `admin_id`, `query_id`, `reason` |
| `ai_care_flag_reviewed` | Flag marked reviewed | `admin_id`, `query_id`, `outcome` |
| `ai_care_query_delete` | Query log deleted | `admin_id`, `query_id` |
| `ai_care_export` | Export triggered | `admin_id`, `count`, `filters[]` |
| `ai_care_settings_save` | Settings saved | `admin_id`, `settings_changed[]` |
| `ai_care_chart_click` | Chart segment clicked | `admin_id`, `chart`, `segment` |

---

## 15. Shopify / Backend Integration

### 15.1 Data Storage

AI Care conversations are not stored in Shopify natively. Recommended architecture:

```
Customer query
    │
    ▼
AI Care API (custom — e.g. FastAPI/Node.js + OpenAI/Gemini)
    │
    ├── Plant ID → Google Vision API / custom plant ML model
    │
    ├── Response generated → stored in custom database
    │   (PostgreSQL / Firestore)
    │
    ├── Product suggestions → Shopify Storefront API
    │   (search by plant topic keywords)
    │
    └── Conversation log → stored with:
         - session_id
         - customer_id (if logged in)
         - shopify_customer_id (linked)
         - messages[] (role: user/assistant, content, timestamp)
         - photo_url (CDN)
         - plant_id_result { plant_name, confidence }
         - rating (helpful/not_helpful)
         - converted_product_ids[]
         - flag_status
         - created_at, updated_at
```

### 15.2 Admin API Endpoints (Custom)

| Action | Endpoint | Method |
|---|---|---|
| Dashboard metrics | `GET /api/admin/ai-care/metrics?date_range=30d` | Read |
| Query log | `GET /api/admin/ai-care/queries?page=1&limit=25&filters={}` | Read |
| Query detail | `GET /api/admin/ai-care/queries/[id]` | Read |
| Flag query | `PUT /api/admin/ai-care/queries/[id]/flag` | Write |
| Mark reviewed | `PUT /api/admin/ai-care/queries/[id]/review` | Write |
| Delete query log | `DELETE /api/admin/ai-care/queries/[id]` | Write |
| Export | `GET /api/admin/ai-care/export?filters={}` | Read |
| Get settings | `GET /api/admin/ai-care/settings` | Read |
| Update settings | `PUT /api/admin/ai-care/settings` | Write |
| Top questions | `GET /api/admin/ai-care/analytics/topics` | Read |
| Funnel data | `GET /api/admin/ai-care/analytics/funnel` | Read |

### 15.3 Data Retention & DPDPA / GDPR Compliance

| Requirement | Implementation |
|---|---|
| User consent for logging | Show `"This conversation may be saved to improve our service"` on first session |
| Right to deletion | Admin `[Delete Query Log]` for individual; customer can request via profile settings |
| Retention enforcement | Cron job deletes conversations older than configured retention period |
| PII masking in admin | Emails masked for non-Super-Admin: `p***@email.com` |
| Data export for user | `/account` → Privacy → Download my data includes AI Care history |

---

## 16. Component Migration Notes

### 16.1 Reused Admin Components

| Component | Source | Usage |
|---|---|---|
| Admin primary/secondary/ghost buttons | `admin-dashboard-design.md §7.3` | Flag, Mark Reviewed, Save Settings |
| Admin toggle switch | `admin-dashboard-design.md §7.2` | Settings toggles |
| Admin select | `admin-dashboard-design.md §7.2` | Flag reason, language, tone, retention |
| Admin toast | `admin-dashboard-design.md §7.6` | Flag/review/settings success |
| Admin filter drawer | `admin-dashboard-design.md §7.8` | Query log filters |
| Chart component | `admin-dashboard-design.md §6.3` | Volume, DAU bar charts |
| Admin modal shell | `admin-dashboard-design.md §7.5` | (if needed for confirmations) |

### 16.2 Page-Exclusive Components

| Component | Notes |
|---|---|
| Conversation thread log | AI Care + potentially future chat support module |
| Plant ID confidence bar | AI Care only |
| Product suggestion bubble (in conversation) | AI Care only |
| Cart conversion inline badge | AI Care only |
| AI Care satisfaction distribution chart | AI Care only |
| Query Volume multi-series chart (with conversion overlay) | AI Care only |
| Cart conversion funnel chart | AI Care only |
| Top Questions ranked table | AI Care only |
| Query Source donut | AI Care only |
| Flag moderation inline panel (drawer) | AI Care + Reviews share similar pattern |

---

## 17. Final Summary — Complete Section Map

```
Admin AI Care Usage Module — v1.0
Complete Design Specification
═══════════════════════════════════════════════════════════════════════
CORE SPEC (§1–§8)

§1   Context & Goals
§2   Design Tokens (17 inherited, 28 ai.* aliases, typography × 18,
     spacing/radius/motion)

DASHBOARD STRUCTURE (§3)
§3   Page Layout (dashboard + query drawer shell, layout rules)

KPI LAYER (§4)
§4   Page Header & KPI Cards Row (6 cards with sparklines)

TAB — OVERVIEW (§5)
§5.1  Query Volume Chart (3-series: total / with photos / converted)
§5.2  Satisfaction Rating Distribution (👍 / 👎 / no-rating bars)
§5.3  Top 20 Asked Questions (topic clusters, avg rating, gap detection)
§5.4  Plant ID Stats (accuracy donut + most-uploaded plants table)
§5.5  Cart Conversion Funnel (5-step, ₹ revenue shown)
§5.6  Query Source Breakdown (chat / photo / visualiser / quick prompt)
§5.7  Daily Active AI Users (bar chart)

TAB — QUERY LOG (§6)
§6.1  Query Log Toolbar (search, filter drawer, sort, export)
§6.2  Query Log Table (8 columns, virtual scroll, flagged row styling)
§6.3  Status Badges (Normal / Flagged / Reviewed)
§6.4  Empty States

QUERY DETAIL DRAWER (§7)
§7.1  Drawer Shell (520px, focus trap, Escape close)
§7.2  Session Info (user, timestamps, device, session stats)
§7.3  Uploaded Photo + Plant ID Result + Confidence Bar
§7.4  Full Conversation Thread
       • Customer bubble · AI response bubble
       • Inline satisfaction rating (read-only)
       • Product suggestion bubble with cart conversion indicator
§7.5  Flag / Review Actions (flag reasons × 5, mark-reviewed flow)

TAB — SETTINGS (§8)
§8   AI Care Settings Panel
     Availability, Features, Response Settings,
     Safety Filters, Logging & Privacy

EXTENDED IMPLEMENTATION GUIDE (§9–§17)

§9   Accessibility Requirements
     • Focus management (9 scenarios)
     • Full ARIA map (22 components)
     • Keyboard map (7 keys)
     • 10 testable acceptance criteria

§10  Content & Tone Standards
     • Status labels (3) · CTA labels (5) · Flag reasons (5)
     • Empty & zero states (4)

§11  Anti-Patterns (× 10 prohibited implementations)

§12  Edge-Case Handling (× 10 scenarios)

§13  Performance Requirements (7 metrics)

§14  Analytics & Tracking Events (× 10 events)

§15  Backend Integration
     • Recommended architecture (custom API + DB + OpenAI)
     • Plant ID pipeline
     • 11 custom Admin API endpoints
     • DPDPA / GDPR compliance requirements (5 rules)

§16  Component Migration Notes
     • 7 reused admin components
     • 10 page-exclusive components

§17  Final Summary — Section Map (this section)

═══════════════════════════════════════════════════════════════════════
Total: ~1,400 lines | 17 sections
WCAG 2.2 AA | Admin dark token system (Outfit)

Companion documents:
  admin-dashboard-design.md     ← Admin system tokens & shared components
  admin-customers-design.md     ← Customer profile (linked from session info)
  admin-product-page-design.md  ← Product edit (linked from suggested products)
  ai-care-design.md             ← Storefront AI Care page (customer-facing)
  design-system.md              ← Master storefront design system

Last updated: June 2026
═══════════════════════════════════════════════════════════════════════
```

---

*Document version: 1.0 (complete) — Admin AI Care Usage Module*
*Sections: 1–8 (core spec) + 9–17 (extended implementation guide)*
*Guideline standard: WCAG 2.2 AA | Token system: Admin dark (Outfit)*
*Companion: `admin-dashboard-design.md` · `ai-care-design.md` · `admin-customers-design.md`*
*Last updated: June 2026*
