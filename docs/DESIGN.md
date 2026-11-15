# "Tidewater Glass": Design Specification v2

Replaces v1 ("The Manifest"), which the client rejected. This spec is the source of truth: implement values
literally. Contrast figures are estimates; verify with a checker over the aurora blob peaks (see §9).

## 1. Concept and default theme

Material Design 3 structure (tonal roles, pill buttons, state layers, strict type scale) rendered on frosted glass
panels that float over a slow indigo, cyan and magenta aurora. The layout is a strict 12-column grid with large
geometric sans headlines, generous whitespace and one hero object: a glass "Clearance Console" showing a shipment
passing its legal checkpoints. Colour and light carry the personality; no serif, monospace or texture.

**Default theme: dark** (`defaultTheme="dark"`, `enableSystem={false}`; the toggle persists). Light is a fully
specified "frosted daylight" variant, not an inversion.

## 2. Typography

| Family | Weights | Use |
|---|---|---|
| Plus Jakarta Sans | 600, 700, 800 | display, headline, title-lg |
| Inter | 400, 500, 600 | everything else; numerals `font-feature-settings: "tnum","cv11"` |

Mobile is <768px; desktop is ≥768px, except at 768–1023px where display-lg is 56, display-md 44 and headline-lg 36.

| Role | Font | Desktop px | Mobile px | Line-height | Letter-spacing | Weight |
|---|---|---|---|---|---|---|
| display-lg | Jakarta | 72 | 40 | 1.05 | -0.03em | 800 |
| display-md | Jakarta | 56 | 34 | 1.08 | -0.025em | 800 |
| headline-lg | Jakarta | 44 | 30 | 1.12 | -0.02em | 700 |
| headline-md | Jakarta | 32 | 26 | 1.2 | -0.015em | 700 |
| headline-sm | Jakarta | 26 | 22 | 1.25 | -0.01em | 700 |
| title-lg | Jakarta | 22 | 20 | 1.3 | -0.005em | 600 |
| title-md | Inter | 18 | 17 | 1.4 | 0 | 600 |
| title-sm | Inter | 16 | 16 | 1.5 | 0 | 600 |
| body-lg | Inter | 18 | 17 | 1.65 | 0 | 400 |
| body-md | Inter | 16 | 16 | 1.6 | 0 | 400 |
| body-sm | Inter | 14 | 14 | 1.5 | 0.005em | 400 |
| label-lg | Inter | 15 | 15 | 20px | 0.005em | 600 |
| label-md | Inter | 13 | 13 | 16px | 0.01em | 600 |
| label-sm | Inter | 12 | 12 | 16px | 0.02em | 500 |
| eyebrow | Inter | 13 | 12 | 16px | 0.08em, uppercase | 600 |

**Rules**
- **Line length:** body 64ch, section subhead 56ch, hero subhead 48ch, display headings 18ch, headline-lg 24ch.
- **Wrapping:** `text-wrap: balance` on h1–h3; `text-wrap: pretty` on paragraphs.
- **Heading levels:** one h1 per page (display-lg on home, display-md elsewhere); section h2 is headline-lg; card h3 is title-lg.
- **Eyebrow:** `primary`, preceded by a 6px `tertiary` dot with an 8px gap, 16px above the h2.
- **Gradient text:** only on the hero h1 phrase, the stat numerals and the 404 numeral. Never on text under 26px.
  - Dark: `90deg, hsl(246 100% 84%) → hsl(190 95% 68%)`.
  - Light: `90deg, hsl(248 78% 50%) → hsl(190 90% 32%)`.

## 3. Colour tokens

| Token | Light | Dark |
|---|---|---|
| background | 230 60% 98% | 232 45% 6% |
| foreground | 232 45% 12% | 228 40% 96% |
| card / card-foreground | 0 0% 100% / 232 45% 12% | 232 36% 11% / 228 40% 96% |
| popover / popover-foreground | 0 0% 100% / 232 45% 12% | 232 36% 12% / 228 40% 96% |
| primary | 248 78% 54% | 246 100% 82% |
| primary-foreground | 0 0% 100% | 246 60% 14% |
| secondary / secondary-foreground | 232 50% 94% / 232 45% 16% | 232 28% 18% / 228 40% 96% |
| muted / muted-foreground | 230 40% 95% / 230 18% 38% | 232 28% 15% / 228 20% 78% |
| accent / accent-foreground | 246 90% 95% / 248 70% 34% | 246 50% 22% / 246 100% 90% |
| border | 230 30% 86% | 230 30% 24% |
| input | 230 16% 55% | 230 20% 46% |
| ring | 248 78% 54% | 246 100% 82% |
| destructive / destructive-foreground | 356 75% 45% / 0 0% 100% | 4 90% 68% / 0 60% 10% |
| primary-container / on-primary-container | 246 100% 93% / 248 80% 24% | 246 55% 26% / 246 100% 92% |
| tertiary / on-tertiary | 184 90% 28% / 0 0% 100% | 174 72% 56% / 180 80% 8% |
| tertiary-container / on-tertiary-container | 178 70% 88% / 184 90% 14% | 176 60% 16% / 172 80% 82% |
| surface-container-low | 230 50% 96.5% | 232 38% 9% |
| surface-container-high | 230 40% 91% | 232 30% 16% |
| outline-variant | 230 28% 84% | 230 26% 24% |
| success | 152 65% 28% | 152 60% 55% |
| warning | 32 95% 34% | 38 95% 62% |
| aurora-1 (indigo) | 248 95% 72% | 248 95% 62% |
| aurora-2 (cyan) | 190 95% 62% | 190 95% 50% |
| aurora-3 (magenta) | 322 90% 74% | 322 85% 60% |
| aurora-4 (amber) | 32 100% 70% | 28 100% 60% |

- `--radius: 1rem`.
- Leave `--legal-*` and `--sidebar-*` untouched.
- `theme-color` meta: light `#F7F8FD`, dark `#080A16`.

**Aurora layer** (fixed, behind everything, on `background`). Four `radial-gradient(closest-side, …, transparent)` blobs, with no `filter: blur`:

| Blob | Size (vmax) | Centre | Alpha dark | Alpha light |
|---|---|---|---|---|
| 1 indigo | 70 | 12% / 8% | 0.50 | 0.40 |
| 2 cyan | 55 | 82% / 30% | 0.20 | 0.35 |
| 3 magenta | 50 | 68% / 88% | 0.26 | 0.28 |
| 4 amber | 30 | 30% / 78% | 0.12 | 0.20 |

**Veil:** `hsl(var(--background) / v)` over the blobs. v is 0 while the hero is ≥40% visible; otherwise 0.45 dark and 0.35 light. Transition 600ms standard. Non-home pages are always veiled.

## 4. Glass recipes

| Tier | BG light | BG dark | backdrop-filter | Border light / dark | Inset highlight light / dark | Shadow |
|---|---|---|---|---|---|---|
| glass-subtle | white / 0.60 | 232 40% 14% / 0.60 | blur(12px) saturate(140%) | white 0.70 / 0.08 | 0.60 / 0.06 | elevation-1 |
| glass | white / 0.72 | 232 40% 13% / 0.68 | blur(20px) saturate(160%) | 0.80 / 0.12 | 0.80 / 0.10 | elevation-2 |
| glass-strong | white / 0.86 | 232 42% 10% / 0.82 | blur(28px) saturate(180%) | 0.90 / 0.14 | 0.90 / 0.12 | elevation-3 |

- **Light-theme edge:** every tier also gets an outer hairline `0 0 0 1px hsl(232 45% 20% / 0.06)`.
- **No backdrop-filter support:** fall back to `hsl(var(--card) / 0.96)`. Always emit the `-webkit-` prefix.
- **Where each tier goes:**
  - **glass-subtle:** repeated grid cards. These drop blur below 1024px and use alpha 0.82 light / 0.80 dark instead.
  - **glass:** hero console, markets panel, readiness card, contact card, post table of contents.
  - **glass-strong:** scrolled header, drawer, menus, popovers, tooltips, toasts.
- **Text on glass:**
  - No text-shadow.
  - `muted-foreground` is the lightest text colour allowed.
  - Coloured text only in the primary, tertiary, success, warning or destructive roles, at ≥13px and weight 600.

## 5. Shape, elevation, spacing, layout

**Radius:**

| Token | px | Used for |
|---|---|---|
| xs | 4 | checkbox |
| sm | 8 | tooltip, menu items |
| md | 12 | fields, icon containers, answer cards |
| lg | 16 | grid cards, stat tiles, accordion items, menus |
| xl | 24 | glass panels, drawer |
| 2xl | 32 | CTA band, hero console |
| full | 9999 | buttons, chips, tabs, header bar, avatars |

**Elevation.** Light shadows are tinted `232 45% 20%`; dark shadows use `232 60% 2%`.

| Level | Light | Dark |
|---|---|---|
| 1 | 0 1px 2px /.06, 0 1px 3px /.08 | 0 1px 2px /.40, 0 1px 3px /.30 |
| 2 | 0 2px 4px /.06, 0 4px 12px /.08 | 0 2px 4px /.40, 0 6px 16px /.35 |
| 3 | 0 4px 8px /.06, 0 12px 28px /.10 | 0 4px 8px /.40, 0 14px 32px /.40 |
| 4 | 0 8px 16px /.08, 0 20px 44px /.12 | 0 8px 16px /.45, 0 24px 48px /.45 |
| 5 | 0 12px 24px /.10, 0 32px 72px /.16 | 0 12px 24px /.50, 0 36px 80px /.55 |

**Primary glow:** `0 8px 28px hsl(var(--primary) / .35)`.

**Spacing (px):** 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128. No other values.

**Layout per breakpoint:**

| Breakpoint | Gutter | Grid gap | Section padding-y | Heading block to content |
|---|---|---|---|---|
| 360 | 16 | 16 | 64 | 32 |
| 640 | 24 | 16 | 72 | 32 |
| 768 | 32 | 24 | 80 | 48 |
| 1024 | 40 | 24 | 96 | 48 |
| 1280 | 48 | 32 | 112 | 56 |
| 1536 | 48 | 32 | 128 | 56 |

**Grid and placement:**
- Content max-width is 1200px.
- 12 columns at ≥768px, 4 columns below.
- Heading blocks are left-aligned on columns 1–7. Inside a heading block: eyebrow, then 16px, then h2, then 16px, then subhead.
- No divider lines between sections.
- `scroll-margin-top: 96px` on every section anchor.

## 6. Components

**Buttons:** all `rounded-full`, labels never wrap.

| Size | Height | Padding-x | Icon-side padding | Gap | Icon | Font role |
|---|---|---|---|---|---|---|
| sm | 36 (44 hit area) | 16 | 12 | 6 | 16 | label-md |
| md | 44 | 24 | 16 | 8 | 18 | label-lg |
| lg | 52 | 32 | 24 | 10 | 20 | title-sm |

| Variant | Container | Content | Border / shadow |
|---|---|---|---|
| filled | primary | primary-foreground | hover: elevation-1 + primary glow |
| filled-tonal | primary-container | on-primary-container | none |
| outlined | transparent | primary | 1px `input` |
| text | transparent | primary | none; padding-x 12 at all sizes |
| glass | glass-subtle | foreground | glass border, elevation-1; hover elevation-2 |
| icon | 40×40 (sm 36, lg 48) | foreground, 20px icon | none |
| FAB / extended FAB | 56 high, radius 16, primary | primary-foreground | elevation-3 + glow |

**Interaction states:**
- **State layer:** a `currentColor` overlay at 0 at rest, 0.08 on hover, 0.10 on focus-visible and 0.12 when pressed, over 150ms. Pressed also scales to 0.98 over 100ms.
- **Focus ring:** `outline 2px ring, offset 2px` plus `0 0 0 6px ring/.25`.
- **Disabled:** container `foreground/.12`, content `foreground/.38`.
- **Ripple:** starts at the pointer, diameter twice the distance to the farthest corner, opacity 0.16 → 0 and scale 0 → 1 over 450ms `cubic-bezier(0,0,0,1)`. Turned off under reduced motion.

**Other components:**

| Component | Spec |
|---|---|
| Filter chip | 36 high, padding-x 16, full radius, label-md, 1px outline-variant. Selected: primary-container with a 16px check, padding-left 10, gap 6. 8px gap between chips. |
| Assist chip | 32 high, padding-x 12, gap 6, 16px icon in primary, label-md, glass-subtle. |
| Tabs (markets) | Glass-subtle pill track 52 high with 4px padding, scrolls horizontally with snap. Tabs 44 high, padding-x 16, label-lg. The active tab sits on a sliding primary-container indicator (350ms emphasized). |
| Text field (outlined) | 56 high, radius md, 1px `input`, background card/.5, padding-x 16. Static label above (label-md, 8px gap). Hover border foreground. Focus border 2px primary. Helper text body-sm, 6px below. Error state: 2px destructive border plus an AlertCircle icon in the helper. Textarea min-height 128. |
| Select | Trigger styled like a text field, with a chevron that rotates 180° over 200ms. Menu: glass-strong, radius lg, padding 8, elevation-3. Items 44 high, radius sm. Selected item: primary-container with a check. |
| Checkbox | 20px box, radius xs, 2px `input` border, 44px hit area. Checked: primary fill. Label body-sm, gap 12. |
| Answer card (radio) | Min-height 56, padding 16, radius md, 1px outline-variant, gap 12, 20px radio. Selected: 2px primary border and primary/.10 background. |
| Theme switch | Track 52×32, thumb 24 with a 14px Sun or Moon icon, 20px travel over 200ms. |
| Glass panel | glass tier, radius xl. Padding 20 / 24 / 32 / 40 at <640 / 640+ / 768+ / 1280+. |
| Grid card | glass-subtle, radius lg. Padding 20 / 24 / 28 at <768 / 768+ / 1280+. Hover: lift 4px, elevation-3, border primary/.45, 250ms emphasized. Cursor-follow glow at ≥1024px. |
| Outlined card | Transparent, 1px outline-variant, radius lg. |
| Accordion | Separate glass-subtle cards with 12px gaps. Trigger min-height 64, padding 20/24, title-md. 20px chevron inside a 32px tonal circle. Content padding 0 24 24, max 64ch, 300ms emphasized. |
| Badge | 24 high, padding-x 10, full radius, label-sm. Tonal variants (role colour at .16 alpha): primary, tertiary, success, warning, destructive, neutral. |
| Tooltip | glass-strong, radius sm, padding 6/10, label-sm, max-width 240, 400ms delay. |
| Header | Floating pill: sticky at top 12px (8 on mobile), full radius, 64 high (56 on mobile). Transparent at scrollY ≤ 8, then glass-strong plus elevation-2. |
| Drawer | Sheet from the right, width min(88vw, 360px), glass-strong, radius xl on the left edge, padding 24, scrim `hsl(232 45% 4% / .55)`. Links 52 high, title-md. |
| Icon container | 48px, radius md, primary-container, 24px icon (small size: 40px with a 20px icon). |
| Avatar | 40px circle in tertiary-container (country-code avatar: 56px). |
| Stat tile | glass-subtle, radius lg, padding 24. Numeral in display-md gradient text, label body-sm. |
| Divider | 1px outline-variant, inside cards only. Never dashed. |
| Toast | glass-strong, radius lg, elevation-4. |

## 7. Motion

**Easing curves:**

| Token | cubic-bezier |
|---|---|
| emphasized | (0.2, 0, 0, 1) |
| emphasized-decelerate | (0.05, 0.7, 0.1, 1) |
| emphasized-accelerate | (0.3, 0, 0.8, 0.15) |
| standard | (0.2, 0, 0, 1) |
| standard-decelerate | (0, 0, 0, 1) |
| standard-accelerate | (0.3, 0, 1, 1) |

**Durations (ms):** short 50/100/150/200; medium 250/300/350/400; long 450/500/550/600.

| Moment | Spec |
|---|---|
| Aurora drift | Transform only, `ease-in-out infinite alternate`, in 28s, 34s, 40s and 46s cycles. Paused when the tab is hidden. |
| Hero entrance | Stagger 0/80/160/240/320ms, fading up 16px over 500ms emphasized-decelerate. The console rises 32px and scales 0.96 → 1 over 600ms, after a 200ms delay. |
| Console | Route draws over 1600ms, starting at 600ms. Checks complete at 900, 1500 and 2100ms. Progress bar fills to 75% over 1200ms. The 4th check pulses (1800ms, infinite). Satellites float ±6px over 6s and 7s. |
| Scroll reveal | Fade up 24px over 500ms emphasized-decelerate. IntersectionObserver threshold 0.2, runs once. Stagger 60ms, capped at 6 items. |
| Counters | Count up over 1200ms with easeOutCubic, tabular numerals. |
| Tab indicator | Slides over 350ms emphasized. Panel content enters by fading up 8px over 250ms. |
| Readiness steps | Outgoing step exits left over 150ms; incoming step enters from the right over 300ms. Gauge sweeps over 900ms. |
| Page change | `<main>` fades up 8px over 300ms emphasized-decelerate. |

**Reduced motion:**
- The aurora is static and the console renders in its final state.
- Reveals are visible immediately and counters show their final values.
- No ripple and no cursor glow.
- State-layer opacity changes remain.

## 8. Page layouts

**Header:**
- **Left:** wordmark (28px gradient square with the initial, then the name in title-lg; the descriptor shows at ≥1280px).
- **Centre (≥1024px):** section links in label-lg, 40 high, full radius. The active link (scroll-spy) gets primary-container.
- **Right:** theme icon button and a filled md "Book a consult".
- **Below 1024px:** a menu button opens the drawer. The CTA is sm at 480–1023px and moves into the drawer below 480px.

**Homepage:**

| Section | Desktop | Mobile | Copy |
|---|---|---|---|
| Hero | min-height `100svh − 76px`. Text on columns 1–6, Clearance Console on columns 7–12. | Text first, console below. CTAs stacked full width. | Chip: "Export legal advisory · ASEAN". H1: "Sell into Southeast Asia. **Skip the legal surprises.**" CTAs: "Book a consult" and "Check my readiness". Trust row: "10 ASEAN markets · 6 advisory services · 2-minute readiness check". |
| Problems | Heading on columns 1–7; three 4-column cards with destructive-tonal icons. | Stacked | Eyebrow "Why exports stall". H2: "Three problems that stop a first shipment." |
| Markets | Sliding tabs, then a 12-column glass panel. Columns 1–5: code avatar, name, snapshot. Columns 6–12: regulators (assist chips), hurdles (2-column list), agreements (tertiary badges). | Tabs scroll edge to edge; the panel stacks. | Eyebrow "Where we work". H2: "Ten markets. Ten rulebooks." Panel footer: "Ask about {name}" plus a "Draft: under review" badge. |
| Services | 3×2 grid cards: icon container, title, copy, divider, "You get" badge. | 1 column, 2 columns from 640px | Eyebrow "What we do". H2: "Six ways we clear your path." |
| Process | Four 3-column cards with numbered circles and a gradient connector. | Vertical list with a connector on the left | Eyebrow "How it works". H2: "From first call to first shipment in four steps." |
| Readiness | Columns 1–5 sticky heading with three check bullets; columns 6–12 glass panel (progress, question, answer cards; auto-advances after 250ms). Result: semicircle gauge, status badge (Hold / Inspect / Cleared), "fix first" outlined card, "Book a consult about this". | Stacked | Eyebrow "Readiness check". H2: "Is your product ready to ship?" |
| Proof | Four stat tiles, three testimonial cards, "Sample data" warning badge. | 2×2 stats; testimonials in a snap carousel | Eyebrow "Results". H2: "Small exporters, cleared to sell." |
| Insights | Heading on columns 1–8, "All insights" text button on columns 9–12, three post cards. | Button below the cards, full width | Eyebrow "Insights". H2: "Plain-English guides to ASEAN trade rules." |
| FAQ | Columns 1–4 sticky heading; columns 6–12 accordion cards. | Stacked | Eyebrow "FAQ". H2: "Questions we hear every week." |
| Contact | Columns 1–5: heading, contact rows, "What happens next" card. Columns 6–12: glass form (2-column field grid). | Heading, form, then the rest | Eyebrow "Book a consult". H2: "Tell us what you're shipping, and where." |

**Clearance Console (hero visual):**
- **Panel:** glass, radius 2xl, padding 24, elevation-4, with an "Illustrative example" badge.
- **Header:** Ship icon container, then "Shipment · Skincare, 2 pallets" and "Melbourne → Port Klang, MY".
- **Route:** SVG with viewBox `0 0 472 120` and path `M24 96 C140 8, 332 8, 448 96`, drawn in an aurora-1 → aurora-2 gradient. A travelling dot sits at 75% of the route.
- **Checkpoints:** four rows: Structure agreed, Contract signed, Product registered (all done) and Customs clearance (in progress, pulsing).
- **Footer:** a 6px progress bar at 75% with "3 of 4 checks cleared".
- **Satellites (≥640px):** "Duty 0% with origin proof" and "Trademark filed".

**Other pages:**
- **Closing CTA band** (non-home pages): radius 2xl, gradient aurora-1 → aurora-2, centred dark text, white pill button.
- **Insights listing:**
  - Header: eyebrow, h1 in display-md, subhead.
  - Filters: chips plus a search field.
  - Featured post: a 12-column horizontal panel.
  - Grid: 3 / 2 / 1 columns. Post cards have a 16:9 gradient tile, a category badge, a 3-line title, a 3-line excerpt, and date · read time.
- **Post detail:**
  - Article column spans columns 3–10.
  - Top: back link, badge, h1 in display-md, meta row.
  - Prose: body-lg at 68ch. Blockquotes are glass-subtle with a tertiary bar.
  - End: disclaimer card, related posts, CTA band.
- **About:**
  - Header block.
  - Glass story panel next to 2×2 stat tiles.
  - Three "How we work" cards, then the CTA band.
- **404:** "404" in display-lg gradient text. "This route isn't on the map." Buttons: "Back to home" and "Browse insights".
- **Footer:**
  - Surface surface-container-low/.80 with a top border.
  - Columns 1–4: brand, tagline and contact.
  - Columns 6–7: Explore.
  - Columns 8–9: Insights.
  - Columns 10–12: disclaimer card.
  - Bottom row: © and the theme switch.

## 9. Accessibility and performance

- **Blur budget:** at most 4 backdrop-filter elements on screen at once. Grid cards drop blur below 1024px, and so does the contact form panel below 768px.
- **Blur limits:** blur never exceeds 28px. No `filter: blur()` anywhere. Never animate backdrop-filter.
- **Aurora:** `will-change: transform` on the aurora blobs only. Blobs animate transform only.
- **Contrast:** verify 4.5:1 for muted-foreground and primary text over each blob centre, in both themes. If a check fails, raise the glass alpha in steps of 0.04.
- **`prefers-reduced-transparency`:** glass becomes solid card colour and the aurora is halved.
- **`forced-colors`:** no aurora or gradients; keep 1px borders.
- **Focus rings** are never clipped.
- **Touch targets** are at least 44×44px with 8px spacing.
- **Fonts:** `display=swap`, six weights in total.
- **Decorative SVG** is `aria-hidden`.

## 10. Must NOT appear

- Fonts: no serif, and no monospace in labels, eyebrows, numbers or navigation.
- Decoration: no ASCII art, stamps or rotated badges, double borders, paper or beige backgrounds, dot-grid or paper textures, or dashed or perforated rules.
- Effects: no hard offset shadows, `[ ]` bracket link decorations, blinking cursors, marquee tickers or scramble-text effects.
- Shapes and other: no section numbers like "01 /", no corners of 2px or less on interactive elements, and no emoji.

## Pre-launch checklist (content)

- [ ] **Market data** (`src/data/markets.ts`): draft from general knowledge. Review it, then set `MARKETS_REVIEWED`.
- [ ] **Proof** (`src/data/proof.ts`): sample stats and quotes. Replace them, then set `PLACEHOLDER = false`.
- [ ] **Contact details and name** (`src/config/site.ts`): placeholders. The name is undecided and has not been trademark-checked.
- [ ] **Enquiry delivery** (`src/lib/enquiry.ts`): opens a prefilled email. Swap it for a real endpoint.
- [ ] **Regulatory wording:** the FAQ "licensed" answer, the footer disclaimer, the response-time promise and the process durations.

---

# v2.1 addendum: "Depth & Stone" (3D layer)

Client direction: Material 3 + glass + **real 3D**, with stone-like objects and a floating, tactile feel on buttons
and cards. (The reference sites could not be loaded from our sandbox; this addendum works from the client's
description.) Concept: **stepping stones across the strait.** Polished stones float behind the frosted glass and
rearrange as you scroll, so the 3D tells the same story as the copy.

## Rendering

| Item | Value |
|---|---|
| Engine | three.js r169, one fixed full-viewport `<canvas>` at `z-index:-5` (above aurora, below all UI). Lazy-loaded after first paint (`requestIdleCallback`, 1200ms timeout). Code-split: ~123 KB gzip. |
| Camera | Perspective, fov 35°, z 14, looks at origin. Pointer parallax ±0.6 (x) / ±0.4 (y) world units, damped at 2.5/s. |
| Quality | DPR ≤ 1.5 desktop, 1.0 mobile; antialias desktop only. If >50% of 90 frames exceed 28ms: drop DPR to 1, then disable glass transmission. |
| Lighting | RoomEnvironment PMREM (no texture files). Hemisphere, white key (5,6,8), cyan rim #3FE0FF (−6,2,−4), magenta rim #FF5AD1 (6,−4,−3). Dark: 0.6 / 2.2 / 1.6 / 0.9, env 0.9. Light: 0.9 / 2.6 / 1.0 / 0.5, env 1.1. ACES tone mapping. |
| Fallbacks | No WebGL: the canvas never mounts (aurora remains). Reduced motion: a single static frame, re-placed 150ms after scrolling stops. Mobile canvas opacity 0.7. |

## Stones

Each stone is an icosphere (detail 14 desktop / 8 mobile) displaced along its normals by 7 random sine waves
(lumps) plus 5 high-frequency waves at 0.02 (worn grain), then squashed into a river-stone shape. Nine stones on
desktop, five on mobile.

| Variant | Material (MeshPhysicalMaterial) |
|---|---|
| Basalt | #1C2132 dark / #2B3248 light, roughness .34, clearcoat 1 (.12) |
| Sandstone | #D39C6C / #E5B385, roughness .8, clearcoat .25, sheen .5 #FFD7AD |
| Jade (glass) | #9EF0E2, transmission 1, thickness 1.4, ior 1.5, attenuation #1FA596 @1.1, roughness .12. Mobile: opaque #3FC2B2. |
| Pearl | #E6E3FF, roughness .22, iridescence 1 (ior 1.35, 180–620nm), clearcoat 1 |
| Glaze | #7B6DFF / #5B4CE8, roughness .26, clearcoat 1 (.06) |

## Choreography

Every home section carries `data-stage`. The stage is held while its section's middle is at the viewport centre;
between centres the layouts blend with smoothstep, and stones chase their targets at 3.2/s (exponential damping).
Scroll speed adds up to 2.5× spin. Layouts live in `src/three/layouts.ts` as `[nx, ny, z, scale]` per stone.

| Stage | Arrangement | Tumble | Float |
|---|---|---|---|
| hero | **Cairn** of 4 stones stacked at the right edge, behind the Clearance Console (blurs through it); 5 small stones frame the page | 0 (level, slow turn) | .08, in sync |
| problems | Scattered, tumbling: things going wrong | 1 | .2 |
| markets | **Archipelago** low and deep behind the markets panel | .25 | .1 |
| services | Loose orbit at the edges | .6 | .16 |
| process | **Stepping stones** rising left→right beneath the four steps | 0 | .05 |
| readiness | The **cairn** rebuilt under the heading on the left | 0 | .07, in sync |
| proof / insights / faq | Calm, at the edges | .3–.5 | .12–.15 |
| contact | Cluster deep behind the form | .35 | .14 |
| inner pages | `page` layout, out of the reading column | .3 | .12 |

## 3D UI layer (CSS)

| Element | Recipe |
|---|---|
| Buttons (`.btn-3d`) | Inset top highlight `0 1px 0 white/.38`, inset base `0 -2px 0 black/.12`, **thickness edge** `0 4px 0 var(--btn-edge)`, drop `0 12px 18px -6px var(--btn-drop)`. Hover: rise 2px, edge 6px. Pressed: sink 3px, edge 1px (70ms). 160ms emphasized. Filled uses a top gradient `--primary-hi → --primary`; edges: filled `--primary-edge`, tonal `--container-edge`, glass `--btn-edge-glass`, outlined `--btn-edge-outline`. Text buttons stay flat. |
| Floating cards (`.lift-card`) | `perspective(900px)`, pointer tilt max 6° (desktop hover only), lift −6px on hover, elevation-4, border primary/.45. Two-layer sheen follows the pointer: white 160px at .14 inside primary 320px at .14. Release eases back over 450ms. |
| Pebbles (`.pebble`) | Icon containers, step numbers, avatars: organic radius `46% 54% 52% 48% / 55% 48% 52% 45%`, specular radial at 30%/18%, carved underside inset shadow. |
| Lip (`.lip`) | Selected chips, tab indicator, console satellites: `0 2px 0 --container-edge` plus a soft drop. |
| Carved fields (`.carved`) | Inputs, selects, textarea: `inset 0 2px 4px shadow/.16`. |
| Console | Idle float ±8px over 8s, plus tilt and sheen. |
| Magnetic CTAs | Hero CTAs and the header CTA pull toward the pointer: 0.25× offset, max 8px, 250ms. |
| Reveal | Rises out of the water: `perspective(800px) translateY(32px) rotateX(10°)` → none, 500ms. |

## Guardrails

- Glass must be able to see the canvas: **no filling opacity/transform/filter animations on ancestors of glass.** Entrance animations use `animation-fill-mode: backwards`.
- Stones never carry text or meaning; the canvas is `aria-hidden` and `pointer-events: none`.
- Tilt, magnetic pull and sheen are off for touch and reduced motion; 3D buttons keep their edge but don't move.

---

# v2.2 addendum: "Liquid Glass"

The client's reference: glass that reads as wet, poured clear resin, combining classic Aqua gloss with VisionOS
depth. A standalone, dependency-free reference implementation lives at `prototypes/liquid-glass-nav.html`.

| Element | Recipe |
|---|---|
| Material (`.liquid`) | `backdrop-filter: blur(50px) saturate(200%)`. Tint: white/.32 (light), hsl(232 40% 60% / .10) (dark). |
| Specular (`::before`) | Curved highlight over the top 52%: `border-radius: 999px 999px 60% 60% / 999px 999px 100% 100%`. Gradient white × spec (.9 → .32 → 0); spec .85 light / .40 dark. |
| Caustics and volume | Rim `inset 0 1px .5px`. Bottom refraction `inset 0 -10px 18px -12px white/.7` and `inset 0 -1.5px 1px -.5px white/.45`. Thick-resin band `inset 0 8px 22px -14px black/.18`. Drops `0 1px 2px`, `0 12px 28px -8px`, `0 34px 70px -24px` in the liquid shadow colour. |
| Glare (`::after`) | `radial-gradient(140px circle at --mx --my, white × .9 light / .45 dark, transparent 70%)`, `mix-blend-mode: overlay`. Fades in on pointer enter (400ms); position updates are throttled to one per animation frame. |
| Sliding pill (`.spring-pill`) | Absolutely positioned behind the active item, measured from `offsetLeft` / `offsetWidth`. Transform and width transition at `0.5s cubic-bezier(0.34, 1.2, 0.64, 1)`. Snaps on first paint and on resize; springs only on user changes. |
| Press (`.press-spring`) | `:active` scales to .92 (120ms in, 260ms spring out). |
| Theme icons | Sun and moon rotate ±90°, scale .4 ↔ 1 and cross-fade over 600ms on the same spring. |
| Where used | Header bar (`.liquid`, always on), markets tab track (`.liquid`). Main panels (console, markets, readiness, contact, featured post) use `.liquid-sheen`: the same highlight, toned down to 34% height at .32 opacity so body text stays crisp. |
