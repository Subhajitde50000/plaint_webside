# AI Care — Intelligent Plant Assistant Page
## Design Specification v1.0

> **Design intent:** Deliver a single unified AI Care page that combines a context-aware plant chat assistant with a spatial visualiser — letting users ask any plant question (with photo upload), then place, resize, and re-pot plants inside a photo of their own space — all within one coherent, nature-forward interface.

---

## 1. Context & Goals

| Property | Value |
|---|---|
| **Page name** | AI Care |
| **Page type** | AI-powered feature page within e-commerce storefront |
| **Primary goal** | Answer plant questions instantly via conversational AI |
| **Secondary goal** | Let users visualise plants in their own spaces with pot/size customisation |
| **Audience** | Online shoppers, indoor plant owners, home decorators |
| **Surface** | E-commerce storefront — desktop-first, fully responsive |
| **Brand continuity** | Shares token system with PDP: Outfit font, `color.surface.raised` (#00b566), `color.surface.strong` (#fefcf9) |
| **Page density** | Buttons: ~40 · Inputs: ~8 · Cards: ~30 · Links: ~20 |

---

## 2. Design Tokens & Foundations

All tokens inherit from the brand system. AI Care introduces semantic aliases for page-specific roles.

### 2.1 Typography

| Token | Value | Usage |
|---|---|---|
| `font.family.primary` | `Outfit` | All UI text |
| `font.family.stack` | `Outfit, sans-serif` | CSS fallback |
| `font.size.base` | `16px` | Body reference |
| `font.weight.base` | `400` | Default weight |
| `font.lineHeight.base` | `22.4px` | Body line-height |
| `font.size.xs` | `9px` | Timestamps, micro-labels |
| `font.size.sm` | `11px` | Badge text, chip meta |
| `font.size.md` | `12px` | Helper text, captions |
| `font.size.lg` | `13px` | Secondary UI labels |
| `font.size.xl` | `13.33px` | Nav links |
| `font.size.2xl` | `14px` | Chat body copy |
| `font.size.3xl` | `15px` | Section labels, card titles |
| `font.size.4xl` | `16px` | CTA labels, chat input |

**Page-level typography role map:**

| Role | Size token | Weight | Line-height |
|---|---|---|---|
| Page hero heading | `font.size.4xl × 2.5` (~40px) | 700 | 1.15 |
| Page hero subtext | `font.size.2xl` | 400 | `font.lineHeight.base` |
| Mode tab labels | `font.size.3xl` | 600 | 1 |
| Section heading | `font.size.3xl` | 600 | 1.3 |
| AI message body | `font.size.2xl` | 400 | 1.6 |
| User message body | `font.size.2xl` | 400 | 1.5 |
| Chat input placeholder | `font.size.4xl` | 400 | 1 |
| Suggestion chip label | `font.size.lg` | 500 | 1 |
| Timestamp / meta | `font.size.xs` | 400 | 1 |
| Plant card name | `font.size.3xl` | 600 | 1.2 |
| Plant card meta | `font.size.md` | 400 | 1.3 |
| Control label | `font.size.lg` | 500 | 1 |
| Button label | `font.size.4xl` | 600 | 1 |
| Toast / alert | `font.size.2xl` | 500 | 1.4 |

### 2.2 Color Palette

| Token | Hex | Role on AI Care page |
|---|---|---|
| `color.surface.base` | `#000000` | Absolute baseline, overlays |
| `color.text.secondary` | `#1c1c1c` | Primary body text, headings |
| `color.text.tertiary` | `#ffffff` | Text on green / dark surfaces |
| `color.text.inverse` | `#212326` | Secondary meta text |
| `color.surface.raised` | `#00b566` | Primary CTA, active tabs, AI avatar, active tool buttons |
| `color.surface.strong` | `#fefcf9` | Page background, cards, chat surface |

**AI Care semantic aliases (always reference parent token — never raw hex):**

| Semantic alias | Maps to | Usage |
|---|---|---|
| `ai-care.bg` | `color.surface.strong` | Page background |
| `ai-care.chat-surface` | `color.surface.strong` | Chat panel background |
| `ai-care.ai-bubble-bg` | `color.surface.raised` @ 10% | AI response bubble fill |
| `ai-care.ai-bubble-border` | `color.surface.raised` @ 30% | AI bubble border |
| `ai-care.user-bubble-bg` | `color.surface.raised` | User message bubble |
| `ai-care.user-bubble-text` | `color.text.tertiary` | User message text |
| `ai-care.input-bg` | `color.surface.strong` | Chat input field |
| `ai-care.input-border` | `color.text.secondary` @ 20% | Input resting border |
| `ai-care.input-border-focus` | `color.surface.raised` | Input focused border |
| `ai-care.canvas-bg` | `color.text.secondary` @ 4% | Visualiser canvas |
| `ai-care.plant-card-bg` | `color.surface.strong` | Plant card in sidebar |
| `ai-care.plant-card-border` | `color.text.secondary` @ 12% | Plant card border |
| `ai-care.plant-card-active` | `color.surface.raised` | Active/selected plant card border |
| `ai-care.overlay-bg` | `color.surface.base` @ 60% | Lightbox / modal backdrop |
| `ai-care.tooltip-bg` | `color.text.secondary` | Tooltip background |
| `ai-care.tooltip-text` | `color.text.tertiary` | Tooltip text |
| `ai-care.tag-health-good` | `#16a34a` (green-600) | "Healthy" status tag |
| `ai-care.tag-health-warn` | `#d97706` (amber-600) | "Needs attention" tag |
| `ai-care.tag-health-bad` | `#dc2626` (red-600) | "Unhealthy" tag |
| `ai-care.focus-ring` | `color.surface.raised` | Universal focus ring |

### 2.3 Spacing Scale (inherited)

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

> Larger compound values: `space.7 × 2 = 16px`, `space.7 × 3 = 24px`, `space.7 × 4 = 32px`, `space.7 × 6 = 48px`, `space.7 × 10 = 80px`.

### 2.4 Border Radius (inherited + new)

| Token | Value | Usage |
|---|---|---|
| `radius.xs` | `4px` | Status tags, micro badges |
| `radius.sm` | `8px` | Input field, thumbnail |
| `radius.md` | `12px` | Plant cards, chat bubbles |
| `radius.lg` | `16px` | Suggestion chips, tool panels |
| `radius.xl` | `20px` | Upload zone, visualiser toolbar |
| `radius.2xl` | `24px` | Main chat panel, canvas panel |
| `radius.step7` | `50px` | Icon buttons, FAB, send button |
| `radius.step8` | `9999px` | CTA buttons, mode tab pills |

### 2.5 Shadows (inherited)

| Token | Value | Usage |
|---|---|---|
| `shadow.1` | `rgb(190, 234, 212) 0px 0px 0px 0px` | Resting (no shadow) |
| `shadow.2` | `rgb(202, 223, 212) 0px 0px 0px 1px inset` | Default card border |
| `shadow.3` | `rgb(212, 212, 212) 0px 0px 0px 1px inset` | Chip / input default border |
| `shadow.4` | `rgb(0, 146, 82) 0px 0px 0px 1px inset` | Active/focused green border |

**AI Care additional shadows (non-token, document as composition rules):**

| Name | Value | Usage |
|---|---|---|
| `chat-panel-shadow` | `0 8px 40px rgba(0, 181, 102, 0.08)` | Chat panel elevation |
| `plant-card-hover-shadow` | `0 4px 20px rgba(0, 181, 102, 0.15)` | Plant card hover lift |
| `fab-shadow` | `0 6px 24px rgba(0, 181, 102, 0.30)` | Action buttons / FAB |
| `canvas-shadow` | `0 2px 16px rgba(28, 28, 28, 0.08)` | Visualiser canvas |

### 2.6 Motion (inherited)

| Token | Value | Usage |
|---|---|---|
| `motion.duration.instant` | `200ms` | Hover, chip active, icon colour |
| `motion.duration.fast` | `250ms` | Bubble appear, tab switch |
| `motion.duration.normal` | `300ms` | Panel slide, modal open |
| `motion.duration.slow` | `500ms` | Page load stagger, canvas transitions |

---

## 3. Page Layout & Structural Zones

### 3.1 Overall Layout (Desktop ≥ 1024px)

```
┌─────────────────────────────────────────────────────────────┐
│                        NAV BAR                              │
├─────────────────────────────────────────────────────────────┤
│                      PAGE HERO STRIP                        │
├─────────────────────────────────────────────────────────────┤
│              MODE SWITCHER TABS (Ask / Visualise)           │
├──────────────────────────┬──────────────────────────────────┤
│                          │                                  │
│    LEFT PANEL            │    RIGHT PANEL                   │
│    (Chat / Upload)       │    (AI Response / Canvas)        │
│    ~44% width            │    ~56% width                    │
│                          │                                  │
└──────────────────────────┴──────────────────────────────────┘
```

- **Max content width:** 1280px, centered, `space.7 × 6 = 48px` horizontal padding
- **Panel gap:** `space.7 × 3 = 24px`
- **Min page height:** `100vh`
- **Panel height:** Fills viewport height minus nav + hero + tabs; `overflow-y: auto` within each panel
- **Sticky panels:** Both panels sticky below tabs, full viewport scroll handled internally

### 3.2 Responsive Breakpoints

| Breakpoint | Layout |
|---|---|
| `≥ 1280px` | Two columns 44/56 split, full sidebar |
| `1024–1279px` | Two columns 40/60 split, compressed sidebar |
| `768–1023px` | Stacked — left panel on top, right panel below, full width each |
| `< 768px` | Single column; mode tabs as full-width toggle; panels scroll as one page; visualiser toolbar collapses to bottom sheet |
| `< 480px` | Chat input pinned to bottom; plant cards become compact 2-column grid |

---

## 4. Navigation Bar

Shared component — same as storefront nav bar.

```
[ 🌿 Hero Logo ]   [ Home ][ Boixs ][ Plants ][ Products ][ AI Care* ][ About ]   [ 🔍 ][ 👤 ][ 🛒¹ ]
```

| Property | Value |
|---|---|
| Active nav item | `AI Care` — underline `color.surface.raised`, weight 600 |
| All other properties | Inherit from Nav Bar spec in PDP design.md |

---

## 5. Page Hero Strip

A compact full-width banner that establishes the AI Care page identity.

### 5.1 Anatomy

```
┌──────────────────────────────────────────────────────────────┐
│  🤖🌿  AI Plant Care              [Start Asking →]           │
│        Your smart plant companion — ask, upload, visualise   │
└──────────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Background | Linear gradient: `color.surface.raised` (0%) → `color.surface.raised` @ 70% (#006b3d, 100%) |
| Height | `120px` desktop, `96px` mobile |
| Padding | `space.7 × 6 = 48px` horizontal |
| Layout | Flex row, space-between, vertically centered |

**Left side:**
- Bot+leaf icon: `40×40px` animated SVG (gentle leaf-sway loop, 3s ease-in-out infinite)
- Heading: "AI Plant Care" — `font.size.4xl × 2.5`, weight 700, `color.text.tertiary`
- Subtext: "Your smart plant companion — ask, upload, visualise" — `font.size.2xl`, weight 400, `color.text.tertiary` @ 80%

**Right side:**
- CTA button: `[ Start Asking → ]` — `color.surface.strong` bg, `color.surface.raised` text, `radius.step8`, `font.size.4xl`, weight 600
- Button smooth-scrolls to chat input field on click

**Background decorative elements:**
- Scattered leaf silhouettes (CSS shapes), `color.text.tertiary` @ 8%, non-interactive
- Subtle radial glow centre-right, `color.surface.strong` @ 5%

---

## 6. Mode Switcher Tabs

Two primary modes control the right panel content.

### 6.1 Anatomy

```
┌─────────────────────────────────────────┐
│   [ 💬 Ask About Plants ]  [ 🪴 Room Visualiser ]   │
└─────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Layout | Full-width pill container, `radius.step8`, `color.surface.strong`, `shadow.3` border |
| Container height | `52px` desktop, `48px` mobile |
| Container margin | `space.7 × 3 = 24px` top, `space.7 × 3` bottom |
| Padding inside | `space.4 = 4px` |

**Each tab:**

| Property | Value |
|---|---|
| Width | 50% of container |
| Height | 44px |
| Font | `font.size.3xl`, weight 600 |
| Border-radius | `radius.step8` |
| Icon | 18×18px inline left of label, `space.5` gap |

**Tab states:**

| State | Background | Text | Border |
|---|---|---|---|
| Default (inactive) | Transparent | `color.text.secondary` @ 60% | None |
| Hover | `color.surface.raised` @ 8% | `color.text.secondary` | None |
| Focus-visible | Transparent | `color.text.secondary` | `2px` focus ring `color.surface.raised` |
| Active/selected | `color.surface.raised` | `color.text.tertiary` | None |
| Transition | `motion.duration.fast` | — | — |

**Accessibility:**
- `role="tablist"` on container
- `role="tab"` on each tab, `aria-selected="true/false"`, `aria-controls` pointing to panel id
- Keyboard: Left/Right arrow keys switch tabs; Enter/Space activates
- Active tab's panel has `role="tabpanel"`, `aria-labelledby` pointing to tab id

---

## 7. Mode A — Ask About Plants (Chat Interface)

Activated when "💬 Ask About Plants" tab is selected.

### 7.1 Two-Panel Layout (Mode A)

```
┌─────────────────────┬────────────────────────────────┐
│  LEFT: INPUT PANEL  │  RIGHT: CONVERSATION PANEL     │
│  - Chat input       │  - AI responses                │
│  - Photo upload     │  - Message thread              │
│  - Quick prompts    │  - Plant identification card   │
│  - Upload preview   │  - Inline product links        │
└─────────────────────┴────────────────────────────────┘
```

---

### 7.2 Left Panel — Input & Upload

#### 7.2.1 Panel Shell

| Property | Value |
|---|---|
| Background | `color.surface.strong` |
| Border | `shadow.2` |
| Border-radius | `radius.2xl` |
| Padding | `space.7 × 3 = 24px` |
| Width | 44% of content area |
| Height | Fills viewport, internal scroll |
| Shadow | `chat-panel-shadow` |

#### 7.2.2 Upload Zone

A prominent drag-and-drop zone at the top of the left panel.

```
┌─────────────────────────────────────────────┐
│                                             │
│   📷  Drop a photo here, or click to upload │
│                                             │
│   Plants · Soil · Seeds · Leaves · Pots     │
│                                             │
│   ─────────── or ───────────                │
│                                             │
│   [ 📷 Take Photo ]  [ 🖼 Choose File ]     │
│                                             │
└─────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Height | `180px` default, `240px` when drag-active |
| Border | `2px dashed color.surface.raised` @ 40% |
| Border-radius | `radius.xl` |
| Background | `color.surface.raised` @ 4% |
| Icon | Camera emoji or SVG, `48×48px`, `color.surface.raised` |
| Primary label | `font.size.3xl`, weight 600, `color.text.secondary` |
| Sub-label | `font.size.lg`, weight 400, `color.text.secondary` @ 60% |
| Transition on drag | Border solid `color.surface.raised`, bg `color.surface.raised` @ 8%, scale `1.01`, `motion.duration.instant` |
| Accepted types | `.jpg`, `.jpeg`, `.png`, `.webp`, `.heic` |
| Max file size | 10MB — error message if exceeded |
| `aria-label` | `"Upload plant photo"` |
| `aria-describedby` | Points to sub-label listing accepted subjects |

**"Take Photo" button:**

| Property | Value |
|---|---|
| Style | Outlined — `shadow.3` border, `radius.step8`, `color.surface.strong` bg |
| Label | `font.size.3xl`, weight 600, `color.text.secondary` |
| Height | `44px` |
| Width | `50% - space.4` |
| Behaviour | Opens device camera via `<input capture="environment">` on mobile; file picker on desktop |

**"Choose File" button:**

| Property | Value |
|---|---|
| Style | Filled — `color.surface.raised` bg, `radius.step8` |
| Label | `font.size.3xl`, weight 600, `color.text.tertiary` |
| Height | `44px` |
| Width | `50% - space.4` |
| Behaviour | Opens file picker |

#### 7.2.3 Upload Preview Area

Appears below upload zone after file is selected. Replaces upload zone with preview.

```
┌─────────────────────────────────────────────┐
│  ┌────────────┐   monstera.jpg              │
│  │   [photo]  │   2.4 MB · JPG              │
│  └────────────┘   [ ✕ Remove ]             │
└─────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Thumbnail | `80×80px`, `radius.sm`, `object-fit: cover` |
| File name | `font.size.3xl`, weight 500, `color.text.secondary` |
| File meta | `font.size.md`, `color.text.secondary` @ 60% |
| Remove button | `×` icon, `radius.step7`, `color.text.secondary` @ 50%, hover `color.ai-care.tag-health-bad` |
| Animation in | Slide down + fade, `motion.duration.fast` |

#### 7.2.4 Chat Input Field

```
┌─────────────────────────────────────┬──────┐
│  Ask anything about your plant...   │  [ ➤ ] │
└─────────────────────────────────────┴──────┘
```

| Property | Value |
|---|---|
| Height | `56px` single line; auto-expands to `120px` max on multiline |
| Background | `color.surface.strong` |
| Border | `shadow.3` default; `shadow.4` on focus |
| Border-radius | `radius.step8` |
| Font | `font.size.4xl`, weight 400, `color.text.secondary` |
| Placeholder | `"Ask anything about your plant..."`, `color.text.secondary` @ 40% |
| Padding | `space.7 × 2 = 16px` left, `52px` right (reserved for send button) |
| Send button | `40×40px`, `radius.step7`, `color.surface.raised` bg, arrow icon `color.text.tertiary` |
| Send disabled | `color.surface.raised` @ 40%, `aria-disabled="true"` |
| Send loading | Spinner replaces arrow, `aria-busy="true"` |
| Keyboard submit | Enter (single line); Shift+Enter = newline |
| `aria-label` | `"Plant question"` |
| `aria-describedby` | Upload zone description when photo attached |

**Input states:**

| State | Border | Background |
|---|---|---|
| Default | `shadow.3` | `color.surface.strong` |
| Focus | `shadow.4` | `color.surface.strong` |
| Error | `1px solid ai-care.tag-health-bad` | `ai-care.tag-health-bad` @ 5% |
| Disabled | `shadow.1` | `color.surface.strong` @ 60% |
| With attachment | Attachment pill shown above input | Green tinted border `shadow.4` |

#### 7.2.5 Attachment Pill (when photo is attached to message)

```
┌────────────────────────────────┐
│  📎 monstera.jpg    [✕]        │
└────────────────────────────────┘
```

| Property | Value |
|---|---|
| Height | `32px` |
| Border-radius | `radius.step8` |
| Background | `color.surface.raised` @ 10% |
| Border | `shadow.4` |
| Label | `font.size.lg`, `color.text.secondary` |
| Icon | Paperclip, `color.surface.raised`, `16×16px` |
| Remove × | `color.text.secondary` @ 50%, hover `ai-care.tag-health-bad` |
| Position | Floats above input field, `space.5` gap below |
| Animation | Slide down + fade, `motion.duration.instant` |

#### 7.2.6 Quick Prompt Suggestions

A row of tappable chips below the input that pre-fill the text field with common questions.

```
Why are my leaves yellow?   How often to water?   Best soil mix?   Repotting tips
```

| Property | Value |
|---|---|
| Layout | Horizontal flex-wrap, `space.5` gap |
| Chip height | `36px` |
| Chip border-radius | `radius.step8` |
| Chip bg | `color.surface.strong` |
| Chip border | `shadow.3` |
| Chip font | `font.size.lg`, weight 500, `color.text.secondary` |
| Chip hover | `color.surface.raised` @ 8% bg, `shadow.4` border, `motion.duration.instant` |
| Chip active | `color.surface.raised` bg, `color.text.tertiary` text |
| Chip focus-visible | `2px` focus ring `color.surface.raised` |
| On click | Fills input field; auto-focuses input |
| Section label above | "Try asking:" — `font.size.lg`, weight 500, `color.text.secondary` @ 60% |

**Default suggestion set:**
1. "Why are my leaves turning yellow?"
2. "How often should I water this?"
3. "Best soil mix for this plant?"
4. "Is this plant safe for pets?"
5. "How much light does it need?"
6. "Help me identify this plant"
7. "Signs of overwatering?"
8. "When should I repot?"

Chips regenerate contextually after each AI response (topic-aware follow-ups).

---

### 7.3 Right Panel — Conversation Thread

#### 7.3.1 Panel Shell

| Property | Value |
|---|---|
| Background | `color.surface.strong` |
| Border | `shadow.2` |
| Border-radius | `radius.2xl` |
| Padding | `space.7 × 3 = 24px` |
| Width | 56% of content area |
| Height | Fills viewport, `overflow-y: auto` |
| Scroll behaviour | `scroll-behavior: smooth`; auto-scrolls to latest message |
| Shadow | `chat-panel-shadow` |

#### 7.3.2 Empty / Welcome State

Shown when no conversation has started yet.

```
┌──────────────────────────────────────────────────┐
│                                                  │
│         🤖🌿                                      │
│                                                  │
│   Hi! I'm your AI Plant Care assistant.          │
│   Ask me anything — or upload a photo to         │
│   identify your plant and get care tips.         │
│                                                  │
│   [ Why are my leaves yellow? ]                  │
│   [ Identify this plant → ]                      │
│   [ Best plants for low light? ]                 │
│                                                  │
└──────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Vertical alignment | Centred in panel |
| Bot avatar | `72×72px`, `radius.step7`, `color.surface.raised` bg, white leaf/robot icon |
| Heading | `font.size.3xl`, weight 600, `color.text.secondary` |
| Subtext | `font.size.2xl`, weight 400, `color.text.secondary` @ 70%, max-width `360px` |
| Suggestion buttons | `radius.lg`, `shadow.3` border, `font.size.2xl`, hover `shadow.4` |
| Animation | Staggered fade-up, `motion.duration.slow`, 100ms delay between items |

#### 7.3.3 Message Bubble — User

```
                                  ┌───────────────────────────────┐
                                  │  Why are my monstera leaves    │
                                  │  turning yellow?               │
                                  │                                │
                                  │  [📎 monstera.jpg]            │
                                  └───────────────────────────────┘
                                                           9:41 AM  👤
```

| Property | Value |
|---|---|
| Alignment | Right-aligned, max-width `75%` |
| Background | `color.surface.raised` (`ai-care.user-bubble-bg`) |
| Text color | `color.text.tertiary` |
| Border-radius | `radius.md` with `radius.xs` on bottom-right corner |
| Padding | `space.7 × 2 = 16px` horizontal, `space.7 × 1.5 = 12px` vertical |
| Font | `font.size.2xl`, weight 400 |
| Timestamp | `font.size.xs`, right-aligned, `color.text.secondary` @ 40%, below bubble |
| Attached image | Thumbnail `160×120px` `radius.sm`, stacked above message text if present |
| Animation in | Slide-in from right + fade, `motion.duration.fast` |

#### 7.3.4 Message Bubble — AI

```
👤  ┌──────────────────────────────────────────────┐
    │  Yellowing monstera leaves usually signal     │
    │  one of these issues:                         │
    │                                              │
    │  🌊 Overwatering — check if soil is soggy    │
    │  ☀️ Too much direct sun                       │
    │  🪨 Nutrient deficiency                       │
    │                                              │
    │  [🛒 Monstera Plant Food — $12]              │
    │  [🛒 Premium Soil Mix — $8]                  │
    └──────────────────────────────────────────────┘
                                              9:41 AM
```

| Property | Value |
|---|---|
| Alignment | Left-aligned, max-width `85%` |
| Background | `ai-care.ai-bubble-bg` (green @ 10%) |
| Border | `ai-care.ai-bubble-border` |
| Text color | `color.text.secondary` |
| Border-radius | `radius.md` with `radius.xs` on bottom-left corner |
| Padding | `space.7 × 2` horizontal, `space.7 × 2` vertical |
| Font | `font.size.2xl`, weight 400, line-height 1.6 |
| Bullet/list items | `space.6` gap between items, `font.size.2xl` |
| Timestamp | `font.size.xs`, left-aligned, `color.text.secondary` @ 40% |
| AI avatar | `32×32px` circle, `color.surface.raised` bg, white icon, left of bubble |
| Typing indicator | Three animated dots (bounce, 300ms stagger) before response arrives |
| Animation in | Slide-in from left + fade, `motion.duration.fast` |
| Code/scientific names | `radius.xs` bg, `color.surface.raised` @ 12%, monospace |

#### 7.3.5 AI Typing Indicator

```
👤  ● ● ●
```

| Property | Value |
|---|---|
| Dots | Three `8×8px` circles, `color.surface.raised` @ 50% |
| Animation | Bounce: `translateY(-4px)`, stagger `100ms` each, `400ms` duration, infinite loop |
| `aria-label` | `"AI is thinking"` |
| `aria-live` | `"polite"` |

#### 7.3.6 Plant Identification Card

Appears in AI response when a photo has been uploaded and identified.

```
┌────────────────────────────────────────────────────────────┐
│  ┌─────────┐   Monstera Deliciosa                          │
│  │ [photo] │   Swiss Cheese Plant                          │
│  │  thumb  │   ████████░░  82% match confidence            │
│  └─────────┘                                               │
│                                                            │
│  [ 🟢 Healthy ]   💧 Weekly    ☀️ Indirect    🌡 65–85°F   │
│                                                            │
│  [ View Care Guide ]   [ Add to My Plants ]               │
└────────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Card bg | `color.surface.strong` |
| Card border | `shadow.4` |
| Card border-radius | `radius.lg` |
| Card padding | `space.7 × 2 = 16px` |
| Photo thumbnail | `72×72px`, `radius.md`, `object-fit: cover` |
| Plant name | `font.size.3xl`, weight 700, `color.text.secondary` |
| Common name | `font.size.2xl`, weight 400, `color.text.secondary` @ 70% |
| Confidence bar | Full-width, `8px` height, `radius.step8`, `color.surface.raised` fill, `color.surface.raised` @ 15% track |
| Confidence label | `font.size.md`, weight 500, `color.text.secondary` @ 60%, right-aligned |
| Health tag | `radius.xs`, `font.size.sm`, weight 600; colour from `ai-care.tag-health-*` tokens |
| Care icons | `16×16px` inline icon + `font.size.lg` label, `space.7 × 2` gap between pairs |
| CTA buttons | "View Care Guide": outlined `shadow.3`; "Add to My Plants": `color.surface.raised` filled |
| Button height | `40px`, `radius.step8`, `font.size.3xl`, weight 600 |
| Animation | Slide-in + fade, `motion.duration.normal`, 150ms after AI text |

#### 7.3.7 Inline Product Recommendation Cards

Appear inside AI message when product recommendation is relevant.

```
┌─────────────────────────────────────────┐
│ 🛒  Monstera Plant Food               →  │
│     ★★★★☆  $12.00    [ Add to Cart ]   │
└─────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Height | `56px` |
| Background | `color.surface.strong` |
| Border | `shadow.2` |
| Border-radius | `radius.md` |
| Product name | `font.size.3xl`, weight 600, `color.text.secondary` |
| Price | `font.size.3xl`, weight 700, `color.text.secondary` |
| Rating | 4 amber stars, `font.size.sm` |
| "Add to Cart" CTA | `color.surface.raised` pill button, `font.size.lg`, `radius.step8`, height `32px` |
| Hover | `shadow.3` → `shadow.4` border, scale `1.005`, `motion.duration.instant` |
| Max per AI turn | 3 product cards (more = visual noise) |

#### 7.3.8 Health Diagnosis Card

Appears when photo upload shows signs of disease/pest/deficiency.

```
┌──────────────────────────────────────────────────────────┐
│  ⚠️  Diagnosis: Overwatering detected                    │
│                                                          │
│  Signs found in your photo:                             │
│  • Yellowing lower leaves                               │
│  • Root rot indicators                                  │
│                                                          │
│  Recommended fix:                                       │
│  1. Reduce watering to every 10–14 days                 │
│  2. Repot in fresh, well-draining soil                  │
│  3. Trim affected roots                                  │
│                                                          │
│  [ 🛒 Get Well-Draining Soil Mix — $8 ]                 │
└──────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Border-left | `4px solid ai-care.tag-health-warn` |
| Background | `ai-care.tag-health-warn` @ 5% |
| Border-radius | `radius.lg` |
| Header icon | `⚠️` or coloured SVG, `20×20px` |
| Header text | `font.size.3xl`, weight 700, `ai-care.tag-health-warn` |
| Body text | `font.size.2xl`, `color.text.secondary`, `font.lineHeight.base` |
| List items | `space.5` gap, bullet or numbered |
| CTA | Full-width green pill button at bottom |

---

## 8. Mode B — Room Visualiser

Activated when "🪴 Room Visualiser" tab is selected.

### 8.1 Two-Panel Layout (Mode B)

```
┌──────────────────────────┬─────────────────────────────────┐
│  LEFT: PLANT SIDEBAR     │  RIGHT: VISUALISER CANVAS       │
│  - Upload room photo     │  - Room photo with plant layers │
│  - Plant library         │  - Drag-to-position plants      │
│  - Active plant controls │  - Toolbar: resize, pot, flip   │
│  - Pot selector          │  - Undo/redo/clear              │
└──────────────────────────┴─────────────────────────────────┘
```

---

### 8.2 Left Panel — Plant Sidebar

#### 8.2.1 Panel Shell

Same shell as chat left panel (bg, border, radius, shadow, padding, width).

#### 8.2.2 Room Photo Upload Zone

```
┌─────────────────────────────────────────────┐
│                                             │
│   🏠  Upload your room or space photo       │
│                                             │
│   Balcony · Living Room · Office · Garden   │
│                                             │
│   [ 📷 Take Photo ]  [ 🖼 Upload Photo ]    │
│                                             │
└─────────────────────────────────────────────┘
```

Same structure and token rules as §7.2.2 Upload Zone, with these differences:

| Property | Value |
|---|---|
| Icon | House/room emoji or SVG |
| Primary label | "Upload your room or space photo" |
| Sub-label | "Balcony · Living Room · Office · Garden" |
| After upload | Upload zone collapses; room thumbnail shown + "Change photo" link |

**Room thumbnail after upload:**

```
┌─────────────────────────────────────────┐
│  ┌──────────────────┐  Living Room      │
│  │   [room thumb]   │  IMG_4821.jpg     │
│  │   240×160px      │  [ Change photo ] │
│  └──────────────────┘                  │
└─────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Thumbnail | `240×160px`, `radius.md`, `object-fit: cover` |
| Room name (editable) | `font.size.3xl`, weight 500, `color.text.secondary` |
| "Change photo" | `font.size.lg`, `color.surface.raised`, underline hover |

#### 8.2.3 Plant Library Search

```
┌──────────────────────────────────────┐
│  🔍  Search plants...                │
└──────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Height | `44px` |
| Background | `color.surface.strong` |
| Border | `shadow.3` default; `shadow.4` on focus |
| Border-radius | `radius.step8` |
| Icon | 🔍 magnifier, `16×16px`, `color.text.secondary` @ 40%, left padding |
| Font | `font.size.4xl`, `color.text.secondary` |
| Placeholder | `"Search plants..."` |

#### 8.2.4 Plant Category Filter Row

```
[ All ]  [ Indoor ]  [ Outdoor ]  [ Flowering ]  [ Succulents ]
```

| Property | Value |
|---|---|
| Layout | Horizontal scroll, `space.5` gap, no scrollbar visible |
| Chip height | `32px` |
| Chip border-radius | `radius.step8` |
| Default | `shadow.3` border, `color.surface.strong` bg, `font.size.lg` weight 500 |
| Active | `color.surface.raised` bg, `color.text.tertiary` text |
| Hover | `shadow.4` border, `motion.duration.instant` |
| Keyboard | Arrow keys cycle through; Enter activates |
| `role` | `radiogroup` + `radio` |

#### 8.2.5 Plant Card Grid

A 2-column grid of draggable plant cards inside the sidebar.

```
┌──────────────┬──────────────┐
│ [plant img]  │ [plant img]  │
│ Monstera     │ Snake Plant  │
│ Indoor ·M    │ Indoor ·S    │
│ [+ Add]      │ [+ Add]      │
├──────────────┼──────────────┤
│ [plant img]  │ [plant img]  │
│ Peace Lily   │ Pothos       │
│ Indoor ·S    │ Indoor ·XS   │
│ [+ Add]      │ [+ Add]      │
└──────────────┴──────────────┘
```

**Single plant card:**

| Property | Value |
|---|---|
| Width | `(panel - gap) / 2` |
| Background | `ai-care.plant-card-bg` |
| Border | `ai-care.plant-card-border` (`shadow.2`) |
| Border-radius | `radius.md` |
| Padding | `space.7` |
| Image area | `100%` width, `140px` height, `radius.sm`, `object-fit: contain`, neutral bg |
| Plant name | `font.size.3xl`, weight 600, `color.text.secondary`, margin-top `space.5` |
| Meta line | `font.size.md`, `color.text.secondary` @ 60%: "Indoor · M" |
| "+ Add" button | `color.surface.raised` bg, `color.text.tertiary`, `radius.step8`, height `36px`, full width |
| Hover state | `plant-card-hover-shadow`, border `ai-care.plant-card-active`, scale `1.01`, `motion.duration.instant` |
| Active/on-canvas | `ai-care.plant-card-active` border, `color.surface.raised` @ 8% bg |
| Drag behaviour | `draggable="true"`; cursor `grab` → `grabbing` on drag; drag-ghost is plant image |
| `aria-label` | `"Add [plant name] to your room"` |
| `aria-pressed` | `true` when plant is on canvas |

**Keyboard drag alternative:** Each card has a "+ Add" button that places the plant at centre of canvas.

#### 8.2.6 Active Plant Controls Panel

Appears below the plant grid when a plant is selected on the canvas.

```
┌─────────────────────────────────────────────┐
│  🪴  Monstera Deliciosa  [✕ Remove]         │
├─────────────────────────────────────────────┤
│  Size                                       │
│  [ XS ] [ S ] [ M* ] [ L ] [ XL ]           │
├─────────────────────────────────────────────┤
│  Resize (manual)                            │
│  ◀──────●──────────────────▶  75%           │
├─────────────────────────────────────────────┤
│  Select Pot                                 │
│  [terracotta] [white] [black] [wicker] ›    │
├─────────────────────────────────────────────┤
│  [ Flip ↔ ]  [ Duplicate ]  [ Send Back ]  │
└─────────────────────────────────────────────┘
```

**Panel header:**

| Property | Value |
|---|---|
| Plant name | `font.size.3xl`, weight 600, `color.text.secondary` |
| Remove button | `×` icon + "Remove", `color.text.secondary` @ 50%, hover `ai-care.tag-health-bad` |
| Background | `color.surface.raised` @ 6% |
| Border | `shadow.4` |
| Border-radius | `radius.lg` |
| Padding | `space.7 × 2` |
| Slide-in animation | Down from above, `motion.duration.fast` |

**Size selector (S/M/L chips):**

Same chip rules as PDP size selector (§5.4 in PDP spec):
- `role="radiogroup"`, `role="radio"` on each
- Active chip: `color.surface.raised` bg, `color.text.tertiary`, `shadow.4` border
- Updates plant scale on canvas in real-time, `motion.duration.normal`
- Sizes: `XS / S / M / L / XL`
- Section label: `font.size.lg`, weight 500, `color.text.secondary` @ 60%

**Manual resize slider:**

| Property | Value |
|---|---|
| Track height | `6px`, `radius.step8`, `color.surface.raised` @ 20% bg |
| Fill | `color.surface.raised` |
| Thumb | `20×20px` circle, `color.surface.raised`, `shadow: 0 2px 8px rgba(0,181,102,0.4)` |
| Value label | `font.size.lg`, weight 600, `color.surface.raised`, right of slider |
| Range | `20%` to `200%` |
| Step | `5%` |
| `aria-label` | `"Plant size: [value]%"` |
| `aria-valuemin/max/now` | `20` / `200` / current |
| Keyboard | Arrow keys ± 5% per press; Home/End = min/max |
| Canvas update | Real-time with `motion.duration.instant` |

**Pot selector strip:**

Same rules as PDP pot selector (§6.3) applied in compact horizontal strip:

| Property | Value |
|---|---|
| Layout | Horizontal scroll, 4 pots visible, `>` arrow if more |
| Card width | `72px` |
| Card height | `80px` |
| Pot image | `56×56px`, centered |
| Pot name | `font.size.xs`, centered, below image |
| Active | `ai-care.plant-card-active` border, `shadow.4` |
| On select | Plant's pot updates on canvas in real-time, `motion.duration.normal` |

**Action buttons row:**

| Button | Icon | Behaviour |
|---|---|---|
| Flip ↔ | Mirror icon | Horizontally flips plant image on canvas |
| Duplicate | Copy icon | Adds second instance of same plant |
| Send Back | Layer-back icon | Moves plant behind other layers (z-index--) |

| Property | Value |
|---|---|
| Button style | Outlined, `shadow.3` border, `radius.lg`, `color.surface.strong` bg |
| Font | `font.size.lg`, weight 500, `color.text.secondary` |
| Height | `40px` |
| Hover | `shadow.4`, `motion.duration.instant` |

---

### 8.3 Right Panel — Visualiser Canvas

#### 8.3.1 Panel Shell

| Property | Value |
|---|---|
| Background | `ai-care.canvas-bg` (subtle grid or linen texture) |
| Border | `shadow.2` |
| Border-radius | `radius.2xl` |
| Width | 56% of content area |
| Height | Fills viewport, fixed height |
| Overflow | Hidden — plants can't escape canvas bounds |
| Shadow | `canvas-shadow` |

#### 8.3.2 Empty Canvas State

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│          📷                                              │
│   Upload a room photo to get started                     │
│   Then drag plants from the sidebar onto your space      │
│                                                          │
│        [ Upload Room Photo ]                             │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Background | Subtle dot-grid pattern, `color.text.secondary` @ 6% |
| Icon | `64×64px` camera SVG, `color.surface.raised` @ 40% |
| Heading | `font.size.3xl`, weight 600, `color.text.secondary` @ 50% |
| Sub-label | `font.size.2xl`, weight 400, `color.text.secondary` @ 40% |
| CTA button | `color.surface.raised` filled, `radius.step8` |
| Alignment | Fully centred in canvas |

#### 8.3.3 Canvas with Room Photo

Once a room photo is uploaded:

| Property | Value |
|---|---|
| Room photo | `object-fit: cover`, fills canvas, `radius.2xl` |
| Canvas overlay | Transparent div on top for plant layer interactions |
| Drop zone active | Border `2px dashed color.surface.raised`, semi-transparent green overlay `color.surface.raised` @ 6% |

#### 8.3.4 Plant Layer on Canvas

Each plant added to the canvas is a positioned, interactive layer.

**Plant layer element:**

| Property | Value |
|---|---|
| Rendering | `<img>` PNG/WebP with transparent bg, no pot bg — pot is swapped separately |
| Default position | Centre of canvas |
| Default size | Medium (`M`) — 30% of canvas height |
| Cursor | `grab` (idle), `grabbing` (dragging), `pointer` (hover) |
| Selection indicator | `2px solid color.surface.raised` dashed border + corner handles `8×8px` green squares |
| Shadow (selected) | `0 8px 32px rgba(0,181,102,0.2)` |
| Shadow (unselected) | `0 4px 16px rgba(28,28,28,0.12)` (natural cast shadow) |
| Deselect | Click empty canvas area |
| Delete | Delete/Backspace key when selected |

**Drag interaction:**

| Event | Behaviour |
|---|---|
| Drag start | Plant lifts (scale `1.04`), `motion.duration.instant`; cursor `grabbing` |
| Drag over canvas | Plant follows cursor in real-time |
| Drag drop | Plant snaps to drop position; scale returns, `motion.duration.fast` |
| Out of bounds | Constrained to canvas edges; bounces back |
| Touch drag | Touch-move events; same behaviour as pointer |

**Resize handles (when selected):**

| Handle | Position | Behaviour |
|---|---|---|
| Corner handles | All 4 corners | Drag to proportionally resize |
| Bottom-centre | Bottom edge | Drag up/down to resize vertically only |
| `cursor` on handles | `nwse-resize` / `nesw-resize` | — |
| Min size | `10%` of canvas height | Cannot drag smaller |
| Max size | `120%` of canvas height | Cannot drag larger |
| Real-time update | Slider in sidebar syncs to match resize, `motion.duration.instant` |

**Pot composite:**
- Pot image rendered separately, behind plant foliage image, both move/scale together as a group
- Changing pot in sidebar swaps pot image layer with crossfade, `motion.duration.normal`

#### 8.3.5 Canvas Toolbar

Fixed to top of canvas, above the photo layer.

```
┌───────────────────────────────────────────────────────────────┐
│  [↩ Undo]  [↪ Redo]  [🗑 Clear All]     [💾 Save]  [📤 Share] │
└───────────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Background | `color.surface.strong` @ 95% blur-backdrop |
| Border-bottom | `shadow.2` |
| Border-radius | `radius.xl radius.xl 0 0` (top corners only) |
| Height | `52px` |
| Padding | `space.7 × 2` horizontal |
| Backdrop filter | `blur(8px)` |

**Toolbar buttons:**

| Button | Icon | `aria-label` | Keyboard shortcut |
|---|---|---|---|
| Undo | ↩ | `"Undo last action"` | `Ctrl+Z` |
| Redo | ↪ | `"Redo last action"` | `Ctrl+Shift+Z` |
| Clear All | 🗑 | `"Clear all plants"` | — (confirm dialog required) |
| Save | 💾 | `"Save visualisation"` | `Ctrl+S` |
| Share | 📤 | `"Share visualisation"` | — |

| Property | Value |
|---|---|
| Button style | Ghost — no bg, `color.text.secondary`, icon + label |
| Button height | `40px`, `radius.lg` |
| Font | `font.size.lg`, weight 500 |
| Hover | `color.surface.raised` @ 8% bg, `motion.duration.instant` |
| Disabled (no action) | `color.text.secondary` @ 30%, `aria-disabled="true"` |
| "Clear All" confirm | Bottom-sheet / modal: "Remove all plants? [Cancel] [Clear All]" |

**Save behaviour:**
- Downloads canvas as PNG: room photo composited with all plant layers
- File name: `my-room-plants.png`
- Progress toast: "Saving…" → "Saved! 💾" — `font.size.2xl`, `color.text.tertiary`, `color.surface.raised` bg, `radius.md`, bottom-centre toast

**Share behaviour:**
- Generates shareable link OR opens native share sheet on mobile
- `aria-live="polite"` announces "Link copied to clipboard"

#### 8.3.6 Canvas Zoom & Pan Controls

```
  ┌─────┐
  │  +  │
  │ 100%│    ← Fixed bottom-right of canvas
  │  −  │
  └─────┘
```

| Property | Value |
|---|---|
| Position | Fixed bottom-right of canvas, `space.7 × 2` margin |
| Background | `color.surface.strong` @ 95% |
| Border | `shadow.3` |
| Border-radius | `radius.md` |
| `+` / `−` | `36×36px` buttons, `radius.sm` |
| Percentage display | `font.size.lg`, weight 600, `color.text.secondary`, min-width `40px` |
| Zoom range | `50%` to `200%` |
| Keyboard | `Ctrl + +` / `Ctrl + −` |
| Pan | Click + drag on empty canvas area |
| Reset | Double-click percentage to reset to 100% |

#### 8.3.7 Plant Count Badge

```
  3 plants added
```

| Property | Value |
|---|---|
| Position | Fixed bottom-left of canvas |
| Background | `color.text.secondary` @ 80% |
| Text | `color.text.tertiary`, `font.size.lg`, weight 500 |
| Border-radius | `radius.step8` |
| Padding | `space.6` vertical, `space.7 × 2` horizontal |
| Update | `aria-live="polite"` announces count changes |

---

## 9. Persistent Elements

### 9.1 Conversation History Sidebar (Mode A)

A collapsible panel or flyout on desktop showing past chat sessions.

```
[ ☰ History ]
──────────────
Today
  • Monstera care tips
  • Yellow leaves fix
Yesterday
  • Peace Lily watering
```

| Property | Value |
|---|---|
| Trigger | "History" icon button above chat panel, `32×32px` |
| Panel width | `260px`, slides in from left, `motion.duration.normal` |
| Background | `color.surface.strong` |
| Border-right | `shadow.2` |
| Session item | `font.size.2xl`, `color.text.secondary`, `radius.sm` hover bg `color.surface.raised` @ 8% |
| Group heading | `font.size.md`, weight 600, `color.text.secondary` @ 40%, uppercase |
| Selected session | `color.surface.raised` bg @ 12%, `color.surface.raised` left border `3px` |
| Delete session | Trash icon on hover, right-aligned |
| Keyboard close | Escape |

### 9.2 Toast Notifications

| Property | Value |
|---|---|
| Position | Bottom-centre, fixed, `z-index: 300` |
| Background | `color.text.secondary` |
| Text | `color.text.tertiary`, `font.size.2xl`, weight 500 |
| Border-radius | `radius.md` |
| Padding | `space.7 × 1.5` vertical, `space.7 × 3` horizontal |
| Min-width | `240px` |
| Auto-dismiss | `3000ms` |
| Animation in | Slide up + fade, `motion.duration.fast` |
| Animation out | Fade + scale down, `motion.duration.fast` |
| `role` | `"status"` |
| `aria-live` | `"polite"` |

**Toast variants:**

| Variant | Left border | Icon |
|---|---|---|
| Success | `4px solid color.surface.raised` | ✓ green |
| Error | `4px solid ai-care.tag-health-bad` | ✕ red |
| Info | `4px solid color.surface.raised` @ 60% | ℹ |
| Loading | None | Spinner |

---

## 10. Accessibility Requirements

### 10.1 Contrast

| Pairing | Ratio | Required | Pass/Fail |
|---|---|---|---|
| `color.text.secondary` (#1c1c1c) on `color.surface.strong` (#fefcf9) | ~18:1 | 4.5:1 AA | ✅ Pass |
| `color.text.tertiary` (#fff) on `color.surface.raised` (#00b566) — `font.size.4xl` weight 600 | ~3.4:1 | 3:1 (large) | ✅ Pass |
| `color.text.tertiary` on `color.surface.raised` — `font.size.lg/md` | ~3.4:1 | 4.5:1 | ⚠️ Avoid — do not place small/light text on green |
| AI bubble: `color.text.secondary` on green @ 10% bg | ~16:1 | 4.5:1 | ✅ Pass |
| `ai-care.tag-health-bad` (#dc2626) on `color.surface.strong` | ~5.5:1 | 4.5:1 | ✅ Pass |
| `ai-care.tag-health-warn` (#d97706) on `color.surface.strong` | ~3.1:1 | 4.5:1 | ⚠️ Use only for icon/decorative; pair with black text label |

> **Rule:** Health status tags must always pair a colour-coded icon/dot with a text label — never colour alone.

### 10.2 Focus Management

- Every interactive element: `2px solid color.surface.raised` focus ring, `2px` offset
- Mode tab switch: focus follows to first focusable element in newly active panel
- Modal / bottom-sheet open: focus trapped inside; Escape closes; focus returns to trigger
- Canvas plants: keyboard-selectable via Tab; Delete removes selected plant; arrow keys nudge position `4px` per keypress
- After plant drop: focus moves to active plant controls panel in sidebar

### 10.3 ARIA Map

| Component | ARIA |
|---|---|
| Mode tabs | `role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls`, `aria-labelledby` |
| Tab panels | `role="tabpanel"`, `aria-labelledby` |
| Chat input | `aria-label="Plant question"`, `aria-describedby` upload hint |
| Upload zone | `aria-label="Upload plant photo"`, `aria-describedby` accepted-types |
| Send button | `aria-label="Send message"`, `aria-disabled` when empty |
| AI typing indicator | `aria-label="AI is thinking"`, `aria-live="polite"` |
| Message list | `role="log"`, `aria-live="polite"`, `aria-atomic="false"` |
| Plant ID confidence | `aria-label="82% match confidence"` on progress bar |
| Health tag | Text label required alongside colour; `aria-label` on icon |
| Size chips | `role="radiogroup"`, `role="radio"`, `aria-checked` |
| Resize slider | `role="slider"`, `aria-valuemin/max/now`, `aria-label` |
| Pot selector | `role="radiogroup"`, `role="radio"`, `aria-checked` |
| Canvas region | `role="application"`, `aria-label="Plant visualiser canvas"` |
| Plant on canvas | `role="img"`, `aria-label="[Plant name], [size]%, [pot name]. Selected."` |
| Zoom controls | `aria-label` per button; percentage display `aria-live="polite"` |
| Toast | `role="status"`, `aria-live="polite"` |
| Confirm dialog | `role="dialog"`, `aria-modal="true"`, focus trap |

### 10.4 Keyboard Map (Mode B — Visualiser)

| Key | Behaviour |
|---|---|
| `Tab` | Cycles through canvas plants and toolbar buttons |
| `Enter / Space` | Selects focused plant; activates buttons |
| `Arrow keys` | Nudges selected plant 4px per press |
| `Shift + Arrows` | Nudges selected plant 20px per press |
| `Delete / Backspace` | Removes selected plant |
| `Ctrl + Z` | Undo |
| `Ctrl + Shift + Z` | Redo |
| `Ctrl + D` | Duplicate selected plant |
| `Ctrl + S` | Save canvas |
| `Escape` | Deselects plant / closes modals |
| `[ / ]` | Send selected plant backward / forward in z-order |

### 10.5 Reduced Motion

- All animations must respect `prefers-reduced-motion: reduce`
- When reduced: replace transitions with instant state changes; disable bounce typing indicator (show static dots)
- Plant drag still functional; remove scale/lift effect

### 10.6 Testable Acceptance Criteria

| # | Criterion | Test method | Pass condition |
|---|---|---|---|
| A1 | No contrast failures | axe DevTools | Zero critical/serious |
| A2 | All focusable elements have visible ring | Manual Tab | Green 2px ring on every element |
| A3 | Mode switch announces to screen reader | NVDA/VoiceOver | Tab name + panel content read |
| A4 | AI response announced when arrives | Screen reader | `aria-live="polite"` fires |
| A5 | Upload zone keyboard operable | Keyboard only | Enter opens file picker |
| A6 | Plant ID card health tag readable without colour | Screen reader | Text label present |
| A7 | Canvas plants keyboard-movable | Keyboard only | Arrow keys reposition plant |
| A8 | Resize slider operable by keyboard | Keyboard | Arrows change size, canvas updates |
| A9 | Confirm dialog traps focus | Keyboard | Tab cycles only inside dialog |
| A10 | Reduced motion preference respected | `prefers-reduced-motion` media query active | Animations disabled |
| A11 | Canvas region has accessible name | Screen reader | "Plant visualiser canvas" announced |
| A12 | Image alt dynamically reflects plant + pot | Screen reader | Alt updates on pot change |

---

## 11. Content & Tone Standards

### 11.1 AI Response Writing Rules
- Must: Be concise — 3–6 sentences per response block before a list or follow-up
- Must: Use plain language — no jargon without explanation
- Must: Acknowledge photo uploads before answering: "Looking at your photo…"
- Must not: Say "I cannot" — rephrase to "Try…" or "Here's what to do…"
- Must not: Use ALL CAPS for emphasis

### 11.2 Suggestion Chips
- Must: Be questions, not commands: "Why are my leaves yellow?" not "Yellow leaves"
- Must: Be ≤ 8 words per chip
- Must not: Repeat the same chip if already asked this session

### 11.3 Error Messages

| Error | Message |
|---|---|
| File too large | "That file is over 10MB. Try a smaller photo." |
| Wrong file type | "Only JPG, PNG, and WebP photos are supported." |
| Network error | "Couldn't connect. Check your internet and try again." |
| No plant found | "I couldn't identify a plant in this photo. Try a clearer, closer shot." |
| Empty input submit | "Type a question or upload a photo to get started." |

### 11.4 Canvas Labels
- Plant name below each canvas plant (optional toggle): `font.size.sm`, white pill badge, bg `color.text.secondary` @ 60%
- Toggle label: "Show plant names" — checkbox in toolbar

---

## 12. Anti-Patterns & Prohibited Implementations

| Anti-pattern | Why prohibited | Correct approach |
|---|---|---|
| Raw hex `#00b566` in CSS | Breaks token system | Use `color.surface.raised` |
| `outline: none` on any element | Kills keyboard access | `outline: 2px solid color.surface.raised` |
| Colour-only health status (red/amber with no text) | Fails WCAG 1.4.1 | Always include text label with colour |
| Auto-sending message on upload without user confirm | Unexpected behaviour, no undo | Upload → preview → user submits |
| Plant layer z-index not controllable | Users can't arrange layers | "Send Back" / "Bring Forward" controls required |
| Canvas without keyboard interaction | Mouse-only, inaccessible | Arrow keys, Tab, Delete all required |
| Inline product push after every AI message | Feels like advertising | Only recommend when directly relevant to diagnosis |
| Resize slider without text value | Imprecise, not accessible | Always show percentage alongside slider |
| Single point of failure: no room photo = blocked | Dead end UX | Plant cards are still browsable without room photo; "Add to Cart" always available |
| Pot swap with hard cut/flash | Jarring visual | Crossfade `motion.duration.normal` required |
| Chat history not persisted | Conversation lost on refresh | Sessions must persist in localStorage/session |
| Missing empty states | Blank panels feel broken | Every panel must have a defined empty state |
| Typing indicator never disappears | Confusing if AI errors | Auto-dismiss after 15s timeout with error state |

---

## 13. Edge-Case Handling

| Scenario | Behaviour |
|---|---|
| Photo upload of non-plant object | AI: "I see a [X] in this photo — try uploading a photo of a plant, soil, or seeds." |
| Photo too dark/blurry to identify | AI: "This photo is a bit unclear. A well-lit, close-up shot will give better results." |
| Question unrelated to plants | AI answers within domain: "I specialise in plant care — [answer if plant-adjacent] — for other topics, try a general search." |
| Plant dragged off canvas edge | Constrained to canvas boundary; bounces back |
| Two plants overlap on canvas | Both remain draggable; z-order controllable via controls |
| Room photo portrait orientation | Canvas adapts; room photo letter-boxed with neutral bg sides |
| Canvas with 10+ plants | No hard limit; performance warning toast at 15+: "Many plants may slow down the canvas." |
| Zero search results in plant library | "No plants found for '[query]'. Try a different name." with clear search button |
| Chat history > 100 messages | Virtual scroll — only render visible messages in DOM; full history scrollable |
| Very long AI response | "Show more / Show less" truncation at 400 chars for initial render |
| Slow network / AI timeout | Loading skeleton in response bubble; error bubble after 15s: "Couldn't get a response. Try again." |
| Desktop browser no camera | "Take Photo" button hidden; file upload only shown |
| iOS/Android native share | Detect `navigator.share` — use native sheet; else copy-link fallback |

---

## 14. Page Sections — Full Structure

```
1. ──────────────────────────────────────────────
   NAVIGATION BAR
   "AI Care" tab active

2. ──────────────────────────────────────────────
   PAGE HERO STRIP
   Green gradient · Heading · Subtext · CTA

3. ──────────────────────────────────────────────
   MODE SWITCHER TABS
   [ 💬 Ask About Plants ]  [ 🪴 Room Visualiser ]

4a. ─────────────────────────────────────────────
    MODE A: ASK ABOUT PLANTS
    ┌──────────────────┬──────────────────────────┐
    │ LEFT: INPUT      │ RIGHT: CONVERSATION      │
    │ • Upload zone    │ • Welcome state          │
    │ • Photo preview  │ • Message thread         │
    │ • Chat input     │ • AI typing indicator    │
    │ • Quick prompts  │ • Plant ID card          │
    │                  │ • Health diagnosis card  │
    │                  │ • Product recommendations│
    └──────────────────┴──────────────────────────┘

4b. ─────────────────────────────────────────────
    MODE B: ROOM VISUALISER
    ┌──────────────────┬──────────────────────────┐
    │ LEFT: SIDEBAR    │ RIGHT: CANVAS            │
    │ • Room upload    │ • Toolbar (undo/save)    │
    │ • Plant search   │ • Room photo             │
    │ • Category tabs  │ • Plant layers           │
    │ • Plant grid     │ • Resize handles         │
    │ • Active plant   │ • Zoom controls          │
    │   controls       │ • Plant count badge      │
    │   - Size chips   │                          │
    │   - Resize slider│                          │
    │   - Pot selector │                          │
    │   - Flip/Dup     │                          │
    └──────────────────┴──────────────────────────┘

5. ──────────────────────────────────────────────
   TOAST NOTIFICATION LAYER (z: 300)

6. ──────────────────────────────────────────────
   MODAL / CONFIRM DIALOG LAYER (z: 400)
```

---

## 15. Responsive Behaviour Summary

| Breakpoint | Mode A — Chat | Mode B — Visualiser |
|---|---|---|
| `≥ 1280px` | Two columns, full sidebar visible | Two columns, full canvas + sidebar |
| `1024–1279px` | Two columns, compressed | Two columns, canvas 60% |
| `768–1023px` | Stacked: upload top, chat below, full width | Stacked: canvas top, sidebar below |
| `< 768px` | Input + chips pinned bottom; chat scrolls above | Canvas full-width; controls as bottom sheet drawer |
| `< 480px` | Input single-line forced; chips horizontal scroll | Canvas fills screen; plant grid 2-col compact; controls collapse into FAB |

**Mobile-specific:**
- "Take Photo" button uses `capture="environment"` for rear camera
- Plant drag on canvas: touch-move events; long-press to select, then drag
- Active plant controls: slide-up bottom sheet (`radius.2xl` top corners, drag handle)
- Toolbar: icon-only (labels hidden), tooltip on long-press

---

## 16. QA Checklist

### Visual
- [ ] Page background: `color.surface.strong` (#fefcf9) — no hard white
- [ ] All text: `Outfit` font family
- [ ] No raw hex in CSS — tokens only
- [ ] Hero strip gradient transitions correctly
- [ ] Mode tabs: active state full green pill, inactive transparent
- [ ] AI bubble: green @ 10% bg, green border
- [ ] User bubble: full `color.surface.raised`, white text
- [ ] Plant card: shadow lifts on hover
- [ ] Active plant on canvas: dashed green selection border + handles
- [ ] Typing indicator animates and dismisses correctly
- [ ] Plant ID confidence bar renders with green fill
- [ ] Health tags: green / amber / red with text label
- [ ] Toast slides up, auto-dismisses after 3s
- [ ] Canvas toolbar: backdrop blur, correct border-radius (top only)
- [ ] Resize slider thumb: green circle with shadow

### Interaction
- [ ] Upload zone expands and changes style on drag-over
- [ ] Photo preview renders on upload, with remove button
- [ ] Attachment pill shows above input when photo attached
- [ ] Quick prompt fills input and focuses input on click
- [ ] Send button disabled when input empty
- [ ] Send button shows spinner during AI response
- [ ] AI response animates in after typing indicator
- [ ] Plant card drag places plant on canvas
- [ ] "+ Add" button places plant at canvas centre (keyboard path)
- [ ] Size chip updates canvas plant size in real-time
- [ ] Slider updates canvas and syncs to size chips
- [ ] Pot change crossfades on canvas
- [ ] Flip mirrors plant image
- [ ] Duplicate adds second plant instance
- [ ] Undo/Redo works for all canvas actions
- [ ] Clear All shows confirm dialog; cancels correctly
- [ ] Save downloads PNG of composited canvas
- [ ] Zoom + / − works; double-click resets to 100%
- [ ] Plant constrained to canvas bounds on drag
- [ ] Escape deselects plant on canvas

### Accessibility
- [ ] axe DevTools: zero critical/serious errors on both modes
- [ ] All focus rings visible (2px green, 2px offset)
- [ ] Mode tab switch announced by screen reader
- [ ] Message log uses `role="log"` with `aria-live="polite"`
- [ ] AI typing indicator `aria-live="polite"` fires
- [ ] Upload zone keyboard-operable (Enter opens picker)
- [ ] All health tags have text label (not colour-only)
- [ ] Resize slider uses `role="slider"` with correct ARIA attributes
- [ ] Canvas `role="application"` with accessible name
- [ ] Plant layers keyboard-movable (arrows) and deletable (Delete key)
- [ ] Confirm dialog traps focus; Escape closes
- [ ] `prefers-reduced-motion` disables all animations
- [ ] Pot change: alt text updates on canvas plant

### Content
- [ ] No lorem ipsum in production
- [ ] Error messages match §11.3 spec exactly
- [ ] AI responses follow §11.1 tone rules
- [ ] Suggestion chips are questions, ≤ 8 words
- [ ] Plant names use proper casing (common name + scientific italic)
- [ ] Canvas plant name badges: `font.size.sm`, pill badge

### Responsive
- [ ] No horizontal overflow at 320px viewport
- [ ] Mobile: controls render as bottom sheet
- [ ] Mobile: chat input pinned to bottom
- [ ] Touch drag functional on canvas (iOS + Android tested)
- [ ] All touch targets ≥ 44×44px

---

*Document version: 1.0 — AI Care page, Hero plant storefront*
*Guideline standard: WCAG 2.2 AA | Token system: Outfit / brand token set*
*Companion document: Red Anthurium Plant PDP design.md*
