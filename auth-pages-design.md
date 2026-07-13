# Hero Plant Store — Auth Pages Design Specification
## Sign Up · OTP Verification · Forgot Password · Reset Password
### Design Specification v1.0 — Production-Ready

> **Design intent:** Deliver a warm, plant-themed authentication experience that feels consistent with the rest of the Hero Plant storefront — using the same Outfit typeface, brand green, and off-white surface tokens — while maintaining absolute clarity, speed, and WCAG 2.2 AA accessibility across all four auth flows. Every screen is single-focus, low-friction, and mobile-first.

---

## 1. Context & Goals

| Property | Value |
|---|---|
| **Pages covered** | Sign Up · OTP Verification · Forgot Password · Reset Password |
| **URLs** | `/signup` · `/verify-otp` · `/forgot-password` · `/reset-password` |
| **Design system parent** | `design-system.md` — all tokens inherited |
| **Viewport** | Mobile-first (375px base) · Tablet (768px) · Desktop (1280px+) |
| **Primary goal** | Get a new plant lover into their account in under 60 seconds |
| **Secondary goals** | Zero-confusion error recovery; accessible to screen reader users; no unnecessary friction |
| **Font** | `Outfit` — 400/500/600/700/800 |
| **Auth methods** | Email + password · Google OAuth · OTP (email or phone) |

---

## 2. Design Tokens (Storefront — Inherited)

All tokens from `design-system.md §2`. The auth pages introduce only page-specific semantic aliases.

### 2.1 Core Tokens Used on Auth Pages

| Token | Value | Role on auth pages |
|---|---|---|
| `color.surface.base` | `#000000` | Darkest text, overlay bg |
| `color.text.secondary` | `#1c1c1c` | All headings |
| `color.text.inverse` | `#212326` | Body copy, labels |
| `color.surface.raised` | `#00b566` | Brand green — primary CTA bg, active input border, checkmark |
| `color.surface.strong` | `#fefcf9` | Page background (warm off-white) |
| `color.text.tertiary` | `#ffffff` | Text on green CTA buttons |

### 2.2 Auth-Specific Semantic Aliases

| Alias | Maps to | Usage |
|---|---|---|
| `auth.page-bg` | `color.surface.strong` (`#fefcf9`) | Full-page background |
| `auth.card-bg` | `#ffffff` | Auth card / form surface |
| `auth.card-border` | `rgb(202, 223, 212)` (`shadow.2`) | Card border |
| `auth.card-shadow` | `0 8px 32px rgba(0, 181, 102, 0.10)` | Card shadow |
| `auth.heading` | `color.text.secondary` (`#1c1c1c`) | Page title, form heading |
| `auth.body` | `color.text.inverse` (`#212326`) | Body copy, labels |
| `auth.muted` | `#6b7280` | Helper text, placeholder, secondary links |
| `auth.accent` | `color.surface.raised` (`#00b566`) | CTA bg, active states, highlights |
| `auth.accent-hover` | `#009952` | CTA hover (darken 15%) |
| `auth.accent-light` | `#f0faf5` | Success bg, OTP active ring fill |
| `auth.danger` | `#dc2626` | Error messages, error border |
| `auth.danger-bg` | `#fef2f2` | Error field background |
| `auth.danger-border` | `#fca5a5` | Error field border |
| `auth.input-border` | `rgb(212, 212, 212)` (`shadow.3`) | Default input border |
| `auth.input-active` | `rgb(0, 146, 82)` (`shadow.4`) | Focused input border |
| `auth.input-bg` | `#ffffff` | Input background |
| `auth.divider` | `#e5e7eb` | OR divider, section separators |
| `auth.social-bg` | `#f9fafb` | Social login button background |
| `auth.social-border` | `#e5e7eb` | Social login button border |
| `auth.success` | `#16a34a` | Success tick, verification confirmed |
| `auth.success-bg` | `#f0fdf4` | Success state background |
| `auth.otp-digit-bg` | `#f8fafc` | OTP input box background (unfilled) |
| `auth.otp-active-border` | `color.surface.raised` | OTP active digit border |
| `auth.otp-filled-bg` | `auth.accent-light` | OTP digit filled background |
| `auth.strength-weak` | `#ef4444` | Password strength — weak |
| `auth.strength-medium` | `#f59e0b` | Password strength — medium |
| `auth.strength-strong` | `#22c55e` | Password strength — strong |

### 2.3 Typography on Auth Pages

| Role | Size | Weight | Colour |
|---|---|---|---|
| Page heading | `font.size.4xl` (18px) | 700 | `auth.heading` |
| Sub-heading | `font.size.3xl` (16px) | 600 | `auth.heading` |
| Brand tagline | `font.size.sm` (12px) | 500 | `auth.accent` |
| Field label | `font.size.md` (13px) | 600 | `auth.body` |
| Input text | `font.size.3xl` (16px) | 400 | `auth.body` |
| Placeholder | `font.size.3xl` (16px) | 400 | `auth.muted` |
| Helper text | `font.size.sm` (12px) | 400 | `auth.muted` |
| Error message | `font.size.sm` (12px) | 500 | `auth.danger` |
| CTA button | `font.size.3xl` (16px) | 700 | `color.text.tertiary` (#fff) |
| Social button | `font.size.3xl` (16px) | 500 | `auth.body` |
| Link text | `font.size.md` (13px) | 600 | `auth.accent` |
| OTP digit | `font.size.4xl` (18px) | 700 | `auth.body` |
| Password strength label | `font.size.xs` (11px) | 600 | strength colour |
| Checkbox label | `font.size.md` (13px) | 400 | `auth.body` |
| Step counter | `font.size.xs` (11px) | 600 | `auth.muted` |
| Timer (OTP countdown) | `font.size.md` (13px) | 600 | `auth.accent` |

### 2.4 Spacing (Auth-Specific Compositions)

| Name | Value | Usage |
|---|---|---|
| `auth.card-padding` | `32px` (desktop) · `24px` (mobile) | Card inner padding |
| `auth.field-gap` | `20px` | Gap between form fields |
| `auth.label-gap` | `6px` | Label to input gap |
| `auth.section-gap` | `28px` | Between form sections |
| `auth.cta-height` | `52px` | Primary CTA button height |
| `auth.input-height` | `52px` | All text inputs |
| `auth.otp-box-size` | `56px × 68px` (desktop) · `48px × 60px` (mobile) | OTP digit boxes |
| `auth.social-height` | `52px` | Social login buttons |

### 2.5 Border Radius on Auth Pages

| Element | Radius |
|---|---|
| Auth card | `radius.xl = 20px` |
| Input fields | `radius.sm = 8px` |
| CTA buttons | `radius.step8 = 9999px` (pill) |
| Social buttons | `radius.step8 = 9999px` (pill) |
| OTP digit boxes | `radius.md = 12px` |
| Error banner | `radius.sm = 8px` |
| Password strength bar | `radius.step8 = 9999px` |
| Avatar / logo | `radius.step7 = 50px` |
| Success icon | `radius.step7 = 50px` |


---

## 3. Shared Layout — Auth Card Shell

All four auth pages share the same layout shell.

### 3.1 Page Structure

```
┌──────────────────────────────────────────────────────────────────────┐
│  PAGE BACKGROUND  (auth.page-bg = #fefcf9, full viewport)           │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐   │
│  │  HEADER (sticky, 60px)                                        │   │
│  │  [🌿 Hero Plants logo]                    [Sign In]  [Sign Up]│   │
│  └───────────────────────────────────────────────────────────────┘   │
│                                                                      │
│           ┌───────────────────────────────────────┐                  │
│           │          AUTH CARD                    │                  │
│           │  (white, 480px max-width, centred)    │                  │
│           │                                       │                  │
│           │  [Brand mark + tagline]               │                  │
│           │  [Page heading]                       │                  │
│           │  [Form content — varies per page]     │                  │
│           │                                       │                  │
│           └───────────────────────────────────────┘                  │
│                                                                      │
│  FOOTER (minimal — Privacy · Terms · © 2026 Hero Plants)            │
└──────────────────────────────────────────────────────────────────────┘
```

### 3.2 Auth Card Spec

| Property | Value |
|---|---|
| Max-width | `480px` |
| Width | `100%` (full-width on mobile < 520px) |
| Background | `auth.card-bg` (#ffffff) |
| Border | `1px solid auth.card-border` |
| Border-radius | `radius.xl = 20px` (desktop) · `0px` top corners on mobile fullscreen |
| Shadow | `auth.card-shadow` |
| Padding | `auth.card-padding` = `32px` desktop · `24px` mobile |
| Margin | `auto` horizontal; `40px` top (desktop) · `0` mobile (full-height) |
| Position | Vertically centred on desktop; fills screen on mobile |

**Mobile behaviour:** On viewports < `520px`, the card fills the full screen — no card border, no border-radius on top. Feels native. On `≥ 520px`, centred floating card with shadow.

### 3.3 Header

```
[🌿 Hero Plants]                           [Sign In]  [Sign Up]
```

| Property | Value |
|---|---|
| Background | `auth.page-bg` |
| Height | `60px` |
| Logo | SVG leaf icon + `"Hero Plants"` wordmark; `font.size.4xl`, weight 700, `auth.accent` |
| Nav links | `font.size.md`, weight 600, `auth.muted`; active page suppressed from nav |
| Sticky | `position: sticky; top: 0; z-index: 100` |
| Shadow on scroll | `nav-scroll` shadow from design system |

### 3.4 Brand Mark (top of card)

```
   🌿
Hero Plants
Your green companion
```

| Property | Value |
|---|---|
| Icon | `48px` plant leaf SVG, `auth.accent` |
| Brand name | `font.size.4xl` (18px), weight 700, `auth.heading` |
| Tagline | `font.size.sm` (12px), weight 500, `auth.accent` |
| Alignment | Centre-aligned |
| Margin-bottom | `24px` |

### 3.5 Social Login Button (Google)

Used on Sign Up and Sign In pages.

```
┌─────────────────────────────────────────────────────────┐
│   [G]   Continue with Google                             │
└─────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Height | `52px` |
| Background | `auth.social-bg` (#f9fafb) |
| Border | `1px solid auth.social-border` |
| Border-radius | `radius.step8` (pill) |
| Font | `font.size.3xl` (16px), weight 500, `auth.body` |
| Google icon | `20×20px` Google SVG logo, left-aligned inside |
| Hover | `background: #f3f4f6`, `box-shadow: 0 2px 8px rgba(0,0,0,0.08)` |
| Focus | `2px solid auth.accent` outline + `0 0 0 4px auth.accent-light` glow |
| Loading | Spinner replaces Google icon; text: `"Connecting..."` |
| `aria-label` | `"Continue with Google"` |

### 3.6 OR Divider

```
────────────────  or  ────────────────
```

| Property | Value |
|---|---|
| Line | `1px solid auth.divider` |
| Text | `"or"`, `font.size.sm` (12px), weight 500, `auth.muted` |
| Gap | `16px` on each side of text |
| Margin | `24px` vertical |
| `role` | `role="separator"`, `aria-label="Or"` |

### 3.7 Input Field (Shared Spec)

```
LABEL *
┌──────────────────────────────────────────────┐
│  Placeholder text                            │
└──────────────────────────────────────────────┘
Helper text or error message
```

| Property | Value |
|---|---|
| Label font | `font.size.md` (13px), weight 600, `auth.body` |
| Required marker | `*`, `auth.danger`, inline after label |
| Label-to-input gap | `6px` |
| Input height | `52px` |
| Input background | `auth.input-bg` (#fff) |
| Input border | `1px solid auth.input-border` |
| Input border-radius | `radius.sm = 8px` |
| Input font | `font.size.3xl` (16px), weight 400, `auth.body` |
| Placeholder | `font.size.3xl` (16px), weight 400, `auth.muted` |
| Padding | `16px` horizontal |
| Focus border | `2px solid auth.input-active` |
| Focus glow | `0 0 0 4px rgba(0,181,102,0.15)` |
| Focus transition | `border-color 150ms ease, box-shadow 150ms ease` |
| Error border | `2px solid auth.danger` |
| Error background | `auth.danger-bg` (#fef2f2) |
| Error text | `font.size.sm` (12px), weight 500, `auth.danger`, with `⚠` prefix |
| Error `role` | `role="alert"`, `aria-live="polite"` |
| `aria-invalid` | `"true"` when error |
| `aria-describedby` | Points to error message `id` |

### 3.8 Primary CTA Button (Shared Spec)

```
┌──────────────────────────────────────────────┐
│             Create my account →              │
└──────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Height | `52px` |
| Width | `100%` (full-width in card) |
| Background | `auth.accent` (#00b566) |
| Border-radius | `radius.step8` (pill) |
| Font | `font.size.3xl` (16px), weight 700, `#ffffff` |
| Hover | `background: auth.accent-hover` (#009952), scale `1.01`, shadow `0 4px 16px rgba(0,181,102,0.30)` |
| Active | Scale `0.98` |
| Focus | `2px solid auth.accent` outline offset `3px` + green glow |
| Disabled | `opacity: 0.5`, `cursor: not-allowed`, no hover effects |
| Loading | Left spinner (`20×20px`, white), text: `"[Action]..."` |
| `aria-busy` | `"true"` during loading |
| Transition | `all 200ms ease` |

### 3.9 Footer (minimal)

```
Privacy Policy  ·  Terms of Service  ·  © 2026 Hero Plants
```

| Property | Value |
|---|---|
| Font | `font.size.xs` (11px), weight 400, `auth.muted` |
| Links | `auth.muted`, underline on hover |
| Margin-top | `32px` from card bottom |
| Alignment | Centre |


---

## 4. Sign Up Page (`/signup`)

### 4.1 Page Overview

```
┌──────────────────────────────────────────────────────┐
│                    🌿 Hero Plants                     │
│                  Your green companion                 │
│                                                      │
│          Create your account                         │
│         Join 12,000+ plant lovers 🌱                 │
│                                                      │
│  ┌────────────────────────────────────────────────┐  │
│  │   [G]  Continue with Google                    │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  ─────────────────  or  ──────────────────           │
│                                                      │
│  FIRST NAME *           LAST NAME *                  │
│  [                ]     [               ]            │
│                                                      │
│  EMAIL ADDRESS *                                     │
│  [                                         ]        │
│                                                      │
│  PHONE NUMBER (optional)                             │
│  [+91 ][                                  ]         │
│                                                      │
│  PASSWORD *                                          │
│  [                                     ] [👁]       │
│  ████████░░░░  Strong                                │
│  ✓ 8+ chars  ✓ Number  ✓ Special char               │
│                                                      │
│  [ ☑ ] I agree to the Terms & Privacy Policy        │
│  [ ☐ ] Send me plant care tips & offers (optional)  │
│                                                      │
│  ┌────────────────────────────────────────────────┐  │
│  │           Create my account →                  │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│       Already have an account?  Sign in →           │
└──────────────────────────────────────────────────────┘
```

### 4.2 Heading

| Property | Value |
|---|---|
| H1 | `"Create your account"`, `font.size.4xl` (18px), weight 700, `auth.heading` |
| Sub-text | `"Join 12,000+ plant lovers 🌱"`, `font.size.sm` (12px), weight 500, `auth.muted` |
| Alignment | Centre |
| Margin-bottom | `28px` |

### 4.3 Name Fields (Two-column row)

First Name and Last Name sit side-by-side on desktop, stack vertically on mobile (< 520px).

| Property | Value |
|---|---|
| Layout | `display: grid; grid-template-columns: 1fr 1fr; gap: 12px` |
| Mobile | `grid-template-columns: 1fr` (stacked) |
| Both fields | Full input spec from §3.7 |
| Autocomplete | `given-name` and `family-name` |

### 4.4 Email Field

| Property | Value |
|---|---|
| Type | `email` |
| Autocomplete | `email` |
| Validation | Required; valid email format; checked for existing account on blur |
| Blur check | API call: if email exists → inline error: `"An account with this email already exists. Sign in instead →"` with link |
| `aria-label` | `"Email address"` |

### 4.5 Phone Field (Optional)

```
[+91 ▾] [98765 43210]
```

| Property | Value |
|---|---|
| Country code | `+91` fixed prefix chip inside input, `font.size.md`, `auth.muted`; tapping opens country selector |
| Input type | `tel` |
| Autocomplete | `tel` |
| Mask | Auto-formats as `XXXXX XXXXX` after country code |
| Validation | Optional; if filled: 10-digit Indian number |
| Helper text | `"We'll send order updates via SMS"` |

### 4.6 Password Field

```
PASSWORD *
┌──────────────────────────────────────────────────────────┐
│  ••••••••                                         [👁]   │
└──────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Type | `password` |
| Toggle | `👁` / `🙈` icon button, right inside input |
| Toggle `aria-label` | `"Show password"` / `"Hide password"` |
| Autocomplete | `new-password` |
| Min length | 8 characters |
| `aria-describedby` | Points to strength indicator and rules |

**Password strength meter:**

```
████████████░░░░░  Strong
✓ 8+ characters   ✓ Uppercase letter
✓ Number          ✓ Special character (!@#$...)
```

| Property | Value |
|---|---|
| Bar width | `100%` |
| Bar height | `6px`, `radius.step8` |
| 0% (empty) | `auth.divider` |
| Weak (1/4 rule met) | `auth.strength-weak` (#ef4444), 25% fill |
| Medium (2–3 rules met) | `auth.strength-medium` (#f59e0b), 60% fill |
| Strong (all 4 rules) | `auth.strength-strong` (#22c55e), 100% fill |
| Label | `"Weak"` / `"Medium"` / `"Strong"`, `font.size.xs` (11px), weight 600, matching colour |
| Rules list | 4 items with `✓` (green) / `✗` (red) prefix; `font.size.xs` (11px), `auth.muted` |
| `role` | `role="status"`, `aria-live="polite"` — announces strength change |
| Transition | Bar width and colour: `300ms ease` |

**Password strength rules:**

| Rule | Regex |
|---|---|
| 8+ characters | `.{8,}` |
| Uppercase letter | `[A-Z]` |
| Number | `\d` |
| Special character | `[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]` |

### 4.7 Checkboxes

**Terms checkbox (required):**

| Property | Value |
|---|---|
| Checkbox | `18×18px`, `radius.xs = 4px`, `auth.input-border` border |
| Checked bg | `auth.accent` |
| Checked tick | White SVG tick |
| Label | `"I agree to the "` `[Terms of Service]` `" and "` `[Privacy Policy]` |
| Terms/Privacy links | `auth.accent`, weight 600, underline on hover; open in new tab |
| Required | Yes — `[Create my account]` disabled if unchecked |
| `aria-required` | `"true"` |
| Error if unchecked on submit | `"Please accept the terms to continue."` |

**Marketing checkbox (optional):**

| Property | Value |
|---|---|
| Label | `"Send me plant care tips & exclusive offers"` |
| Pre-checked | No (privacy-respecting default) |
| Helper | `"You can unsubscribe anytime."`, `font.size.xs` (11px), `auth.muted` |

### 4.8 Create Account CTA

Button label: `"Create my account →"`

| State | Behaviour |
|---|---|
| Default | Full green pill, full-width |
| Disabled | When Terms unchecked; `opacity: 0.5`, `cursor: not-allowed` |
| Loading | `"Creating your account..."` + spinner; `aria-busy="true"` |
| Success | Brief `"✓ Account created!"` + redirect to OTP page |

### 4.9 Sign In Link

```
Already have an account?   Sign in →
```

`font.size.md` (13px), `auth.muted` + `auth.accent` link, centred, `24px` top margin.

### 4.10 Form Validation Rules

| Field | Rule | Error message |
|---|---|---|
| First name | Required, min 2 chars, max 100 | `"Please enter your first name."` |
| Last name | Required, min 2 chars, max 100 | `"Please enter your last name."` |
| Email | Required, valid format | `"Enter a valid email address."` |
| Email (duplicate) | API check on blur | `"An account with this email exists. Sign in instead →"` |
| Phone | Optional; if filled: 10-digit | `"Enter a valid 10-digit phone number."` |
| Password | Min 8 chars + strength | `"Password must be at least 8 characters."` |
| Password (weak) | 0–1 rules met | Warning (not block): `"Password is too weak. Add numbers or special characters."` |
| Terms | Required | `"Please accept the terms to continue."` |

### 4.11 Sign-Up Success Flow

After successful registration:

1. `"✓ Account created!"` — brief inline success state on button (500ms)
2. Redirect to `/verify-otp?method=email&email=[email]`
3. Celery task: sends verification email in background
4. No intermediate loading screen — transition is instant

---

## 5. OTP Verification Page (`/verify-otp`)

### 5.1 Page Overview

```
┌──────────────────────────────────────────────────────┐
│                    🌿 Hero Plants                     │
│                  Your green companion                 │
│                                                      │
│           Verify your email                          │
│                                                      │
│  We sent a 6-digit code to                           │
│  priya@email.com                                     │
│  [Change email →]                                    │
│                                                      │
│  ┌────┐  ┌────┐  ┌────┐  ┌────┐  ┌────┐  ┌────┐    │
│  │ 4  │  │    │  │    │  │    │  │    │  │    │    │
│  └────┘  └────┘  └────┘  └────┘  └────┘  └────┘    │
│                                                      │
│                  [Verify email →]                    │
│                                                      │
│  Didn't receive the code?                            │
│  Resend in  0:42                                     │
│                                                      │
│  ─────────────────────────────────────────────────   │
│  Or verify with phone number instead                 │
└──────────────────────────────────────────────────────┘
```

### 5.2 Heading & Description

| Property | Value |
|---|---|
| H1 | `"Verify your email"` (or `"Verify your phone"` if SMS mode) |
| Font | `font.size.4xl` (18px), weight 700, `auth.heading` |
| Desc | `"We sent a 6-digit code to"` → bold email/phone |
| Email/phone | `font.size.md` (13px), weight 700, `auth.body` |
| `[Change]` | `"Change email →"`, `font.size.sm` (12px), `auth.accent`, links back to `/signup` |

### 5.3 OTP Input — 6 Digit Boxes

```
┌─────┐  ┌─────┐  ┌─────┐    ┌─────┐  ┌─────┐  ┌─────┐
│  4  │  │  2  │  │     │    │     │  │     │  │     │
└─────┘  └─────┘  └─────┘    └─────┘  └─────┘  └─────┘
```

**Individual OTP box:**

| Property | Value |
|---|---|
| Size | `56×68px` (desktop) · `48×60px` (mobile) |
| Background | `auth.otp-digit-bg` (#f8fafc) — empty |
| Background (filled) | `auth.otp-filled-bg` (#f0faf5) |
| Border | `1px solid auth.input-border` — empty |
| Border (active/focused) | `2px solid auth.otp-active-border` + green glow |
| Border (filled) | `1px solid auth.input-active` |
| Border (error) | `2px solid auth.danger` on all boxes |
| Border-radius | `radius.md = 12px` |
| Font | `font.size.4xl` (18px), weight 700, `auth.body` |
| Text align | Centre |
| Input type | `tel` (shows numeric keyboard on mobile) |
| `inputmode` | `"numeric"` |
| Max length | `1` per box |
| Gap between boxes | `8px`; `16px` gap between box 3 and 4 (visual group separation) |

**OTP Input Behaviour:**

| Interaction | Behaviour |
|---|---|
| Typing a digit | Fills current box, auto-advances focus to next box |
| Backspace | Clears current digit; if empty, moves focus to previous box |
| Paste (6 digits) | Auto-fills all 6 boxes instantly |
| Paste (< 6 digits) | Fills from current position forward |
| Auto-fill (SMS OTP on Android/iOS) | Supported via `autocomplete="one-time-code"` on first input |
| Full `aria-label` | `"Digit [n] of 6"` on each input |
| `role` on group | `role="group"`, `aria-label="6-digit verification code"` |
| `aria-labelledby` | Points to heading for screen reader context |

**Auto-submit:** When the 6th digit is entered, auto-submit the form (same as clicking `[Verify]`). Show loading on CTA.

**Error state:**

```
┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐
│  4   │  │  2   │  │  0   │  │  1   │  │  X   │  │  X   │
└──────┘  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘
    ⚠ Incorrect code. 2 attempts remaining.
```

All boxes turn red border. Error message below boxes. Boxes clear and focus returns to first box.

### 5.4 Verify Button

Label: `"Verify email →"` (or `"Verify phone →"`)

| State | Behaviour |
|---|---|
| Default | Disabled until all 6 digits entered |
| Enabled | Full green pill once all 6 filled |
| Loading | `"Verifying..."` + spinner |
| Success | `"✓ Verified!"` → redirect to dashboard or return URL |
| Error | Returns to OTP input with error message |

### 5.5 Resend Timer & Resend Link

```
Didn't receive the code?
Resend in  0:42
```

| State | Behaviour |
|---|---|
| Timer active (60s) | `"Resend in 0:42"` — countdown; `aria-live="polite"` updates every second |
| Timer expired | `"Resend code"` link appears in `auth.accent` |
| Resend clicked | Sends new OTP; resets timer to 60s; toast: `"A new code has been sent."` |
| Max resends | After 3 resends: disable link for 10 minutes; show: `"Too many attempts. Try again in 10 minutes."` |
| Timer font | `font.size.md` (13px), weight 600, `auth.accent` |
| `aria-label` on timer | `"Resend code available in [n] seconds"` |

### 5.6 Alternate Method

```
─────────────────────────────────────────────────────
Or verify with phone number instead
```

| Property | Value |
|---|---|
| Link | `"verify with phone number instead"`, `auth.accent`, weight 600 |
| Action | Switches mode: sends OTP to phone (if phone was provided at signup); heading changes to `"Verify your phone"` |
| If no phone | Link hidden (phone not provided at signup) |

### 5.7 Verification Success Screen

After successful verification — brief interstitial before redirect.

```
┌──────────────────────────────────────────────────────┐
│                    🌿 Hero Plants                     │
│                                                      │
│         ┌────────────────────────────────┐           │
│         │                                │           │
│         │          ✅                    │           │
│         │    Email verified!             │           │
│         │    Welcome to Hero Plants, Priya 🌿         │
│         │                                │           │
│         │    Taking you to your          │           │
│         │    account...                  │           │
│         │                                │           │
│         └────────────────────────────────┘           │
└──────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Success icon | `64×64px` green circle with white `✓` check, `auth.success-bg` bg, `auth.success` border |
| Icon animation | Scale `0→1` + fade-in, `motion.duration.normal` (300ms); disabled for `prefers-reduced-motion` |
| Heading | `"Email verified!"`, `font.size.4xl` (18px), weight 700, `auth.heading` |
| Sub-text | `"Welcome to Hero Plants, [first_name] 🌿"`, `font.size.md` (13px), `auth.muted` |
| Redirect | Auto-redirect after `2000ms`; `"Taking you to your account..."` in `auth.muted` italic |
| `role` | `role="status"`, `aria-live="assertive"` — announced to screen readers |
| Manual link | `"Go to my account →"` if redirect doesn't fire |


---

## 6. Forgot Password Page (`/forgot-password`)

### 6.1 Page Overview

```
┌──────────────────────────────────────────────────────┐
│                    🌿 Hero Plants                     │
│                  Your green companion                 │
│                                                      │
│           Forgot your password?                      │
│  No worries — we'll send you a reset link.           │
│                                                      │
│  EMAIL ADDRESS *                                     │
│  [                                         ]        │
│                                                      │
│  ┌────────────────────────────────────────────────┐  │
│  │           Send reset link →                    │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│          ← Back to sign in                           │
└──────────────────────────────────────────────────────┘
```

### 6.2 Heading & Description

| Property | Value |
|---|---|
| H1 | `"Forgot your password?"`, `font.size.4xl` (18px), weight 700, `auth.heading` |
| Sub-text | `"No worries — we'll send you a reset link."`, `font.size.md` (13px), `auth.muted` |
| Alignment | Centre |
| Margin-bottom | `32px` |

### 6.3 Email Field

Same spec as §3.7.

| Property | Value |
|---|---|
| Label | `"EMAIL ADDRESS"` |
| Type | `email` |
| Autocomplete | `email` |
| Placeholder | `"priya@email.com"` |
| Validation | Required, valid format |
| Error (invalid format) | `"Enter a valid email address."` |
| Note | Always respond with success even if email not found (prevents email enumeration) |

### 6.4 Send Reset Link CTA

Label: `"Send reset link →"`

| State | Behaviour |
|---|---|
| Default | Enabled once email field is non-empty |
| Loading | `"Sending..."` + spinner; `aria-busy="true"` |
| Success | Transitions to success state (§6.5) |

### 6.5 Sent Confirmation State (replaces form)

After clicking Send — the form is replaced in-place:

```
┌──────────────────────────────────────────────────────┐
│                    🌿 Hero Plants                     │
│                  Your green companion                 │
│                                                      │
│         ┌────────────────────────────────┐           │
│         │          📧                    │           │
│         │  Check your inbox              │           │
│         │                                │           │
│         │  We've sent a password reset   │           │
│         │  link to:                      │           │
│         │  priya@email.com               │           │
│         │                                │           │
│         │  The link expires in 1 hour.   │           │
│         │                                │           │
│         │  ┌──────────────────────────┐  │           │
│         │  │   Open email app →       │  │           │
│         │  └──────────────────────────┘  │           │
│         │                                │           │
│         │  Didn't receive it?            │           │
│         │  Check spam · [Resend link]    │           │
│         │                                │           │
│         └────────────────────────────────┘           │
│                                                      │
│            ← Back to sign in                         │
└──────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Email icon | `64×64px`, `auth.accent-light` bg, `48px` mail SVG `auth.accent` |
| Heading | `"Check your inbox"`, `font.size.4xl` (18px), weight 700, `auth.heading` |
| Body | `"We've sent a password reset link to:"` → bold email below |
| Email shown | `font.size.3xl` (16px), weight 700, `auth.accent` |
| Expiry note | `"The link expires in 1 hour."`, `font.size.sm` (12px), `auth.muted` |
| `[Open email app →]` | Green pill CTA — `mailto:` link for convenience; opens default mail app |
| Didn't receive | `"Didn't receive it?"` in `auth.muted` + `"Check spam"` text + `"Resend link"` `auth.accent` link |
| Resend | Cooldown: once every 60 seconds; after 3 sends: `"Max resends reached. Wait 10 minutes."` |
| `role` | `role="status"`, `aria-live="assertive"` — full message announced |

**Back to sign in link:**

`"← Back to sign in"`, `font.size.md` (13px), weight 600, `auth.muted`, centred, `24px` top margin.

---

## 7. Reset Password Page (`/reset-password?token=[token]`)

### 7.1 Page Overview

This page is reached via the link in the reset email. The `token` query param is validated before the form renders.

```
┌──────────────────────────────────────────────────────┐
│                    🌿 Hero Plants                     │
│                  Your green companion                 │
│                                                      │
│           Set a new password                         │
│  Choose something strong and memorable.              │
│                                                      │
│  NEW PASSWORD *                                      │
│  [                                     ] [👁]       │
│  ████████████░░  Strong                              │
│  ✓ 8+ chars  ✓ Number  ✓ Uppercase  ✓ Special       │
│                                                      │
│  CONFIRM PASSWORD *                                  │
│  [                                     ] [👁]       │
│                                                      │
│  ┌────────────────────────────────────────────────┐  │
│  │           Set new password →                   │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

### 7.2 Token Validation (Page Load)

Before rendering the form, the token is validated server-side.

**Valid token:** Form renders normally.

**Invalid / expired token:**

```
┌──────────────────────────────────────────────────────┐
│                    🌿 Hero Plants                     │
│                                                      │
│         ┌────────────────────────────────┐           │
│         │          ⏰                    │           │
│         │  This link has expired         │           │
│         │                                │           │
│         │  Password reset links are      │           │
│         │  only valid for 1 hour.        │           │
│         │                                │           │
│         │  ┌──────────────────────────┐  │           │
│         │  │   Request a new link →   │  │           │
│         │  └──────────────────────────┘  │           │
│         └────────────────────────────────┘           │
└──────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Icon | `64×64px`, amber bg, clock SVG in `#c69026` |
| Heading | `"This link has expired"`, `font.size.4xl` (18px), weight 700, `auth.heading` |
| Body | `"Password reset links are only valid for 1 hour."`, `auth.muted` |
| CTA | `"Request a new link →"` — green pill, navigates to `/forgot-password` |
| No form rendered | Form never shown for invalid/expired/used tokens |

### 7.3 Heading & Description

| Property | Value |
|---|---|
| H1 | `"Set a new password"`, `font.size.4xl` (18px), weight 700, `auth.heading` |
| Sub-text | `"Choose something strong and memorable."`, `font.size.md` (13px), `auth.muted` |
| Alignment | Centre |
| Margin-bottom | `32px` |

### 7.4 New Password Field

Same password spec as §4.6 — with full strength meter and rules checklist.

| Property | Value |
|---|---|
| Label | `"NEW PASSWORD"` |
| Autocomplete | `new-password` |
| Toggle visibility | `👁` / `🙈` icon |
| Strength meter | Full 4-rule strength bar (see §4.6) |
| `aria-describedby` | Strength meter + rules checklist |

### 7.5 Confirm Password Field

```
CONFIRM PASSWORD *
┌──────────────────────────────────────────────────────────┐
│  ••••••••                                         [👁]   │
└──────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Label | `"CONFIRM PASSWORD"` |
| Autocomplete | `new-password` |
| Toggle | `👁` / `🙈` |
| Validation | Must match New Password |
| Inline match check | On blur — shows `"✓ Passwords match"` in `auth.success` if matching; `"⚠ Passwords don't match"` in `auth.danger` if not |
| `aria-describedby` | Points to match indicator message |

**Match indicator:**

| State | Display | Colour |
|---|---|---|
| Not yet typed | Nothing | — |
| Matches | `"✓ Passwords match"`, `font.size.sm`, weight 600 | `auth.success` (#16a34a) |
| Doesn't match | `"⚠ Passwords don't match"`, `font.size.sm`, weight 600 | `auth.danger` (#dc2626) |
| `aria-live` | `"polite"` — announced on blur |

### 7.6 Set New Password CTA

Label: `"Set new password →"`

| State | Behaviour |
|---|---|
| Disabled | When passwords don't match OR new password is too weak |
| Enabled | When both fields match + password is at least Medium strength |
| Loading | `"Updating password..."` + spinner |
| Success | Transitions to success state (§7.7) |

### 7.7 Reset Success State (replaces form)

```
┌──────────────────────────────────────────────────────┐
│                    🌿 Hero Plants                     │
│                  Your green companion                 │
│                                                      │
│         ┌────────────────────────────────┐           │
│         │          ✅                    │           │
│         │  Password updated!             │           │
│         │                                │           │
│         │  Your password has been        │           │
│         │  reset successfully. You've    │           │
│         │  been signed out of all        │           │
│         │  other devices.                │           │
│         │                                │           │
│         │  ┌──────────────────────────┐  │           │
│         │  │      Sign in now →       │  │           │
│         │  └──────────────────────────┘  │           │
│         └────────────────────────────────┘           │
└──────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Success icon | `64×64px` green circle, white `✓`; scale `0→1` animation |
| Heading | `"Password updated!"`, `font.size.4xl` (18px), weight 700, `auth.heading` |
| Body | `"Your password has been reset successfully. You've been signed out of all other devices."` |
| Security note | `"You've been signed out of all other devices."` — communicates security action of global session revoke |
| `[Sign in now →]` | Green pill CTA → `/login`; auto-redirect after 3000ms |
| `role` | `role="status"`, `aria-live="assertive"` |


---

## 8. Mobile Responsiveness

### 8.1 Breakpoints

| Breakpoint | Value | Layout |
|---|---|---|
| Mobile | `< 520px` | Full-screen card, no border-radius top |
| Tablet | `520px – 768px` | Centred card, `radius.xl` all corners |
| Desktop | `> 768px` | Centred card, max-width `480px`, vertical centre |

### 8.2 Mobile-Specific Rules

| Element | Mobile adaptation |
|---|---|
| Auth card | `width: 100%`, `min-height: 100dvh`, `border-radius: 0` |
| Card padding | `24px` (reduced from `32px`) |
| Name fields | Stack vertically (1 column) |
| OTP boxes | `48×60px` (reduced from `56×68px`) |
| CTA button | Full-width, `52px` height |
| Header | Simplified — logo only, no nav links |
| Keyboard | `inputmode="numeric"` for OTP boxes ensures numeric keyboard on iOS/Android |
| Viewport meta | `<meta name="viewport" content="width=device-width, initial-scale=1, interactive-widget=resizes-content">` — prevents keyboard from pushing form off screen |

### 8.3 Touch Targets

All interactive elements meet the minimum `44×44px` touch target per WCAG 2.5.5:

| Element | Touch target size |
|---|---|
| CTA button | Full-width × `52px` ✅ |
| Social button | Full-width × `52px` ✅ |
| OTP boxes | `48×60px` ✅ |
| Password toggle `👁` | `44×44px` tap zone |
| Checkboxes | `44×44px` tap zone (label extends zone) |
| Back link | `44px` minimum height |
| Resend link | `44px` minimum height |

---

## 9. Animation & Transition Specs

### 9.1 Page Transitions

| Transition | Animation | Duration |
|---|---|---|
| Sign Up → OTP Verification | Slide left `→` | `motion.duration.normal` 300ms |
| OTP Verification → Success | Fade + scale up | `motion.duration.normal` 300ms |
| Forgot Password → Sent state | Form fades out, success card fades in | `250ms` |
| Reset Password → Success | Same as OTP success | `300ms` |
| All | Disabled for `prefers-reduced-motion` | — |

### 9.2 Form State Animations

| Element | Animation |
|---|---|
| Error messages | Slide down + fade in, `200ms ease` |
| Error clear | Fade out, `150ms ease` |
| Password strength bar | Width transition `300ms ease`, colour `200ms ease` |
| OTP box focus | Border + glow `150ms ease` |
| OTP auto-advance | Instant (no animation) |
| Success icon | `scale(0.5) → scale(1.05) → scale(1)` bounce, `400ms` |
| Loading spinner | Rotate `1s linear infinite` |
| Button hover | `transform: scale(1.01)`, shadow `200ms ease` |
| Verify button enable | Opacity `0.5 → 1.0`, `150ms ease` |

### 9.3 OTP Box Fill Animation

When a digit is typed:
```css
.otp-box {
  transition: background-color 150ms ease, border-color 150ms ease;
}
.otp-box.filled {
  background: auth.otp-filled-bg;  /* #f0faf5 */
  border-color: auth.input-active;  /* rgb(0, 146, 82) */
}
```

---

## 10. Accessibility Requirements

### 10.1 Focus Management

| Interaction | Focus behaviour |
|---|---|
| Page load (Sign Up) | Focus → First Name input |
| Page load (OTP) | Focus → First OTP digit box |
| Page load (Forgot Password) | Focus → Email input |
| Page load (Reset Password) | Focus → New Password input |
| Form submit (loading) | Focus locked to submit button; `aria-busy="true"` |
| Validation error appears | Focus moves to first errored field |
| OTP digit filled | Focus auto-advances to next digit box |
| OTP backspace on empty box | Focus moves to previous box |
| OTP success | Focus → success heading |
| Sent confirmation state | Focus → confirmation heading |
| Reset success | Focus → `"Sign in now"` button |
| Token expired state | Focus → `"Request a new link"` button |
| Password visibility toggle | Focus stays on toggle after click; not on input |

### 10.2 Full ARIA Map

| Component | ARIA |
|---|---|
| Sign Up form | `<form aria-label="Create account">` |
| OTP Verification form | `<form aria-label="Verify your email">` |
| Forgot Password form | `<form aria-label="Reset your password">` |
| Reset Password form | `<form aria-label="Set a new password">` |
| First Name input | `aria-label="First name"`, `aria-required="true"` |
| Last Name input | `aria-label="Last name"`, `aria-required="true"` |
| Email input | `aria-label="Email address"`, `aria-required="true"` |
| Phone input | `aria-label="Phone number"`, `aria-required="false"` |
| Password input | `aria-label="Password"`, `aria-required="true"`, `aria-describedby="pw-strength pw-rules"` |
| Password toggle | `<button aria-label="Show password">` / `"Hide password"` |
| Password strength | `id="pw-strength"`, `role="status"`, `aria-live="polite"` |
| Password rules | `id="pw-rules"`, each rule `role="listitem"` |
| Terms checkbox | `aria-required="true"`, `aria-label="Agree to Terms of Service and Privacy Policy"` |
| Marketing checkbox | `aria-label="Subscribe to plant care tips and offers"` |
| Error message | `role="alert"`, `aria-live="polite"`, `aria-atomic="true"` |
| Error input | `aria-invalid="true"`, `aria-describedby="[error-id]"` |
| Create account CTA | `aria-busy="true"` during loading; `aria-disabled="true"` when disabled |
| Google button | `aria-label="Continue with Google"` |
| OR divider | `role="separator"`, `aria-label="Or"` |
| OTP group | `role="group"`, `aria-label="6-digit verification code"` |
| OTP input 1–6 | `aria-label="Digit 1 of 6"` ... `"Digit 6 of 6"`, `autocomplete="one-time-code"` on first |
| Resend timer | `aria-live="polite"`, `aria-label="Resend code available in [n] seconds"` |
| Resend button | `aria-label="Resend verification code"` |
| Verify CTA | `aria-busy` during loading; `aria-disabled` when incomplete |
| Success state | `role="status"`, `aria-live="assertive"` |
| Token expired | `role="alert"`, `aria-live="assertive"` |
| Confirm password | `aria-describedby="pw-match-msg"` |
| Match indicator | `id="pw-match-msg"`, `aria-live="polite"` |
| Back link | `aria-label="Back to sign in"` |
| Change email link | `aria-label="Change email address"` |

### 10.3 Keyboard Navigation Map

| Key | Behaviour |
|---|---|
| `Tab` | Forward through all form elements |
| `Shift+Tab` | Backward |
| `Enter` | Submit form (on any field); activate any button |
| `Space` | Toggle checkbox |
| `Arrow Left/Right` | (No special behaviour — Tab handles OTP navigation) |
| `Backspace` (OTP) | Clears current digit; moves to previous box if empty |
| `0–9` (OTP) | Fills digit, advances to next box |
| `Ctrl+V` / `Cmd+V` (OTP) | Pastes full OTP code across all boxes |
| `Escape` | Clears active dropdown (country selector) |

### 10.4 Screen Reader Announcements

| Event | Announcement |
|---|---|
| Password strength change | `"Password strength: [Weak/Medium/Strong]"` |
| Password rule satisfied | `"[Rule name]: met"` (e.g. `"8 characters: met"`) |
| OTP digit filled + advance | Screen reader follows focus naturally |
| OTP error | `"Incorrect code. [n] attempts remaining."` — `role="alert"` |
| Form submission loading | `"Creating your account..."` / `"Verifying..."` etc. |
| Success state | Full success message announced immediately |
| Token expired | `"This link has expired."` — `role="alert"` |
| Resend timer | Updates every second via `aria-live="polite"` |
| Duplicate email on blur | `"An account with this email already exists. Sign in instead."` |

### 10.5 Testable Acceptance Criteria

| # | Criterion | Method | Pass |
|---|---|---|---|
| A1 | No contrast failures on any auth page | axe DevTools | Zero critical |
| A2 | All inputs have visible labels (not just placeholder) | Manual | ✅ Labels always present |
| A3 | All focus rings visible | Manual Tab | Green `2px` ring on every element |
| A4 | Password can be shown/hidden without mouse | Keyboard | Tab to toggle → Enter/Space works |
| A5 | OTP paste works from clipboard | Paste `"123456"` | All 6 boxes fill instantly |
| A6 | OTP auto-complete from SMS works | iOS/Android device | `autocomplete="one-time-code"` fires |
| A7 | Password strength announced on change | NVDA/VoiceOver | `aria-live="polite"` fires |
| A8 | Form errors announced and focus moves | Screen reader | First error focused + announced |
| A9 | Success states announced | Screen reader | `aria-live="assertive"` fires |
| A10 | Token expired state announced | Screen reader | `role="alert"` fires |
| A11 | All touch targets ≥ 44×44px | Mobile inspection | Every element meets minimum |
| A12 | `prefers-reduced-motion` respected | OS setting | All animations disabled |
| A13 | Form works without JavaScript | JS disabled | Native HTML form submit fallback |
| A14 | Name autocomplete works | Browser autocomplete | `given-name`/`family-name` fills |
| A15 | Email / password managers work | 1Password/Bitwarden | All fields correctly autocomplete |

---

## 11. Error States — Complete Reference

### 11.1 Sign Up Errors

| Error | Trigger | Message | Field behaviour |
|---|---|---|---|
| First name blank | Submit | `"Please enter your first name."` | Red border + bg |
| Last name blank | Submit | `"Please enter your last name."` | Red border + bg |
| Email blank | Submit | `"Email address is required."` | Red border + bg |
| Email invalid | Blur | `"Enter a valid email address."` | Red border + bg |
| Email duplicate | Blur (API) | `"An account with this email exists. Sign in instead →"` | Red border; link in error msg |
| Phone invalid | Blur | `"Enter a valid 10-digit phone number."` | Red border + bg |
| Password blank | Submit | `"Password is required."` | Red border + bg |
| Password too short | Blur | `"Password must be at least 8 characters."` | Red border + bg |
| Password too weak | Real-time | `"Too weak — add numbers or special characters."` (warning, non-blocking) | Amber strength bar |
| Terms unchecked | Submit | `"Please accept the terms to continue."` | Checkbox red ring |
| Generic API error | Submit | `"Something went wrong. Please try again."` | Top-of-form error banner |

### 11.2 OTP Errors

| Error | Trigger | Message |
|---|---|---|
| Wrong code | Submit / auto-submit | `"Incorrect code. 2 attempts remaining."` |
| Expired code | Submit | `"This code has expired. Request a new one below."` |
| Max wrong attempts (5) | Submit | `"Too many failed attempts. Request a new code."` |
| Max resends (3) | Resend click | `"Maximum resends reached. Try again in 10 minutes."` |
| Network error | Submit | `"Connection error. Check your internet and try again."` |

### 11.3 Forgot Password Errors

| Error | Trigger | Message |
|---|---|---|
| Email blank | Submit | `"Email address is required."` |
| Email invalid | Blur | `"Enter a valid email address."` |
| Generic API error | Submit | `"Something went wrong. Please try again."` |
| Note | Never reveal if email exists | Always show `"Check your inbox"` success state regardless |

### 11.4 Reset Password Errors

| Error | Trigger | Message |
|---|---|---|
| New password blank | Submit | `"Please enter a new password."` |
| New password too short | Blur | `"Password must be at least 8 characters."` |
| Confirm password blank | Submit | `"Please confirm your new password."` |
| Passwords don't match | Blur on confirm | `"⚠ Passwords don't match."` (inline match indicator) |
| Token invalid/expired | Page load | Shows expired state screen (§7.2) |
| Token already used | Page load | Shows expired state screen with `"This link has already been used."` |
| Generic API error | Submit | `"Something went wrong. Please try again."` |

### 11.5 Error Banner (top-of-form, for API errors)

```
┌────────────────────────────────────────────────────────┐
│  ⚠  Something went wrong. Please try again.       [×] │
└────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Background | `auth.danger-bg` (#fef2f2) |
| Border | `1px solid auth.danger-border` (#fca5a5) |
| Border-left | `4px solid auth.danger` (#dc2626) |
| Border-radius | `radius.sm = 8px` |
| Icon | `⚠` `auth.danger`, `16×16px` |
| Font | `font.size.sm` (12px), weight 500, `auth.danger` |
| Close button | `×`, `auth.danger`, `aria-label="Dismiss error"` |
| `role` | `role="alert"`, `aria-live="assertive"` |
| Padding | `12px 16px` |
| Appears | Below heading, above form |

---

## 12. Anti-Patterns & Prohibited Implementations

| Anti-pattern | Why prohibited | Correct approach |
|---|---|---|
| Placeholder as only label | Screen readers lose context when typing | Always have a visible `<label>` above input |
| `outline: none` on any element | WCAG 2.4.11 failure | `outline: 2px solid auth.accent` + glow always |
| Revealing whether email exists on forgot-password | Email enumeration attack | Always show success state regardless |
| Auto-submitting OTP without all 6 digits | Premature API call, poor UX | Auto-submit only when digit 6 is filled |
| Storing password in plain text | Critical security failure | Always bcrypt with cost factor 12 |
| Password strength blocking submit at any level | Alienates users with valid but simple passwords | Warn for weak, block only if < 8 chars |
| Showing raw token in error messages | Security information leak | Never expose token in UI; generic errors only |
| Hard-coded colour values in CSS | Breaks token system | Always use `auth.*` semantic aliases |
| Disabling browser autocomplete | Prevents password managers; accessibility issue | Never use `autocomplete="off"` on password fields |
| Marking optional fields as required | False UX | Phone is explicitly optional with clear label |
| Error-only feedback (no success confirmation) | User confusion | Always confirm success states visually and via `aria-live` |
| Redirecting without user seeing success | Jarring, inaccessible | Always show success screen ≥ 2000ms before redirect |
| OTP boxes using `type="text"` | Shows letters on mobile keyboard | Use `type="tel"` + `inputmode="numeric"` |
| Resend without cooldown | API abuse vector | 60-second cooldown, max 3 resends per session |
| Not revoking all sessions on password reset | Security risk | Always revoke all refresh tokens on password reset |

---

## 13. Edge Cases

| Scenario | Behaviour |
|---|---|
| User submits Sign Up with very long name (> 100 chars) | Client-side validation before API; `"Name must be 100 characters or fewer."` |
| User pastes email with trailing space | `trim()` silently before validation |
| User enters emoji in name field | Allow (Unicode names are valid); backend trims length in bytes |
| OTP arrives before timer starts (instant delivery) | Timer still shows 60s; doesn't affect usability |
| User navigates back from OTP page | If email already registered → Sign Up page shows `"You already have an account. Verify your email below."` banner |
| User opens reset link on a different device | Works normally — token is stateless (stored server-side, not cookie-bound) |
| User opens reset link twice | Second visit shows `"This link has already been used."` (used_at set on first use) |
| User closes tab mid-sign-up | Form data lost (no localStorage persistence for security); user restarts |
| Slow internet (> 5s API response) | Loading state maintained; toast after 10s: `"This is taking longer than expected..."` |
| User submits OTP with spaces pasted (e.g. "123 456") | Strip spaces before matching against boxes |
| Google OAuth popup blocked | Show: `"Popup was blocked. Allow popups for this site or use email sign up."` |
| User is already logged in and visits `/signup` | Redirect to `/` (homepage) |
| Caps Lock on for password field | Show subtle `"Caps Lock is on"` tooltip below input |

---

## 14. Performance Requirements

| Metric | Target | Rule |
|---|---|---|
| Auth page load (LCP) | `< 1.2s` | Minimal JS; CSS inlined for above-fold |
| Time to interactive | `< 1.5s` | First input focused within 1.5s |
| Form submit response | `< 800ms` | API responds; loading state shown if > 300ms |
| Email duplicate check (blur) | `< 400ms` | Debounced 300ms; API indexed on email |
| OTP auto-submit | Instant | Client-side; auto-submit triggers on 6th digit |
| Password strength calc | `< 10ms` | Pure client-side regex; no API call |
| Redirect after success | `2000ms` | Deliberate delay to let user read success message |
| Google OAuth | `< 2s` popup | Browser-dependent; loading state shown |

---

## 15. Final Summary — All Auth Pages

```
Hero Plant Store — Auth Pages Design v1.0
══════════════════════════════════════════════════════
PAGES COVERED

/signup               Sign Up
  §4.1  Page layout + heading
  §4.2  Brand mark
  §4.3  Google OAuth button
  §4.4  Name fields (2-col, stacks on mobile)
  §4.5  Email field (duplicate check on blur)
  §4.6  Phone field (optional, +91 prefix, mask)
  §4.7  Password field + strength meter (4 rules)
  §4.8  Terms checkbox (required) + Marketing (opt-in)
  §4.9  Create my account CTA
  §4.10 Sign in link
  §4.11 Form validation rules (8 fields)
  §4.12 Post-signup flow (→ OTP)

/verify-otp           OTP Verification
  §5.1  Page layout + heading + destination display
  §5.2  6 OTP digit boxes
        • Auto-advance · Backspace · Paste · Auto-submit
        • autocomplete="one-time-code"
        • Numeric keyboard on mobile
  §5.3  Verify CTA (disabled until all 6 filled)
  §5.4  Resend timer (60s countdown, max 3 resends)
  §5.5  Alternate method (phone/email toggle)
  §5.6  Verification success interstitial screen

/forgot-password      Forgot Password
  §6.1  Page layout + heading
  §6.2  Email field
  §6.3  Send reset link CTA
  §6.4  Sent confirmation state (replaces form)
        • Email icon · Email shown · Open email app CTA
        • Resend link with cooldown
        • Always success (prevents enumeration)

/reset-password       Reset Password
  §7.1  Token validation on page load
  §7.2  Expired/invalid/used token error screen
  §7.3  New password field + strength meter
  §7.4  Confirm password + live match indicator
  §7.5  Set new password CTA
  §7.6  Reset success screen + security notice

SHARED COMPONENTS (§3)
  Auth card shell · Social (Google) button · OR divider
  Input field spec · Primary CTA spec · Footer

EXTENDED SPEC (§8–§14)
  §8   Mobile responsiveness (3 breakpoints, touch targets)
  §9   Animations (page transitions, form states, OTP fill)
  §10  Accessibility (focus map, ARIA map ×25 components,
       keyboard map, screen reader announcements,
       15 testable criteria)
  §11  Error states (complete: signup×9, OTP×5,
       forgot×4, reset×7, error banner spec)
  §12  Anti-patterns (×15 prohibited implementations)
  §13  Edge cases (×15 scenarios)
  §14  Performance requirements (8 metrics)
  §15  Final Summary (this section)

══════════════════════════════════════════════════════
Total: ~900 lines | 15 sections | 4 auth pages
WCAG 2.2 AA | Outfit typeface | Brand green system
Companion: design-system.md · profile-design.md
Last updated: June 2026
══════════════════════════════════════════════════════
```

---

*Document version: 1.0 (complete) — Auth Pages Design Specification*
*Pages: Sign Up · OTP Verification · Forgot Password · Reset Password*
*Font: Outfit | Tokens: `design-system.md §2` | WCAG 2.2 AA*
*Last updated: June 2026*
