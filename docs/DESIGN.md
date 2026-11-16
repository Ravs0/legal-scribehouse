# "Dawn Tactile": Design Specification v3

Supersedes v2 "Tidewater Glass", v2.1 (3D stones, removed) and v2.2. Written by the design advisor (Fable) from the
client's reference board (`docs/inspiration-board.jpg`) and the liquid-glass nav prompt; implemented in this repo.
A standalone liquid-glass nav reference lives at `prototypes/liquid-glass-nav.html`.

**Concept:** small, precise physical objects on a warm sand desk at first light: a receipt printer, a menu card, a
switch panel, bezelled windows, one glowing key. Glass survives only in the header and on scene chips.
**Default theme:** light ("Dawn"). Dark is "Dusk".

## 1. Palette "Dawn" (HSL)

| Token | Light | Dark |
|---|---|---|
| background / foreground | 36 50% 96% / 24 28% 10% | 258 20% 7% / 34 40% 94% |
| card | 40 60% 99% | 258 16% 11% |
| primary (dawn orange) | 21 90% 53% (#F26A1C) | 24 95% 60% |
| primary-foreground (button text) | 20 60% 8% | 20 60% 8% |
| primary-ink (orange used as text) | 18 85% 36% | 26 100% 70% |
| secondary / muted | 34 36% 91% / 35 32% 92% | 258 12% 17% / 258 12% 14% |
| muted-foreground | 28 12% 36% | 32 14% 72% |
| border / input / ring | 32 24% 84% / 30 12% 52% / 21 90% 48% | 258 10% 22% / 258 8% 46% / 24 95% 60% |
| tertiary (lagoon) | 186 72% 24% | 186 75% 60% |
| success / warning / destructive | 152 60% 27% / 36 95% 32% / 356 72% 44% | 152 55% 58% / 38 95% 62% / 4 90% 68% |
| device (dark objects) | 24 10% 9% | 258 18% 5% |
| bezel / led | 34 30% 86% / 32 100% 62% | 258 12% 15% / 32 100% 62% |

Rules:
- **Button text:** dark ink text on orange buttons (≈5.9:1). White on this orange fails AA, so it is never used.
- **Orange as text:** always `primary-ink`, never `primary`.
- **Background:** static. Light is `#FBF7F1 → #F5ECE0` with three soft blobs (orange, rose, lagoon) and grain at .035. Dusk is `#110F16 → #17121A`.

## 2. Type and component size sheet

**Fonts:** Plus Jakarta Sans (600/700/800) and Inter (400/500/600). JetBrains Mono 500 is used **only** for receipt
text, LED readouts, glass-chip counters and widget unit labels.

| Role | Desktop / mobile px | Line-height | Tracking | Weight |
|---|---|---|---|---|
| display-lg | 64 / 38 | 1.04 | -0.035em | 800 |
| display-md | 48 / 32 | 1.08 | -0.03em | 800 |
| headline-lg | 38 / 28 | 1.12 | -0.025em | 700 |
| headline-md / sm | 28 / 24, 22 / 20 | 1.18 / 1.25 | -0.02 / -0.015em | 700 |
| title-lg / md / sm | 19 / 18, 16, 14 | 1.3 / 1.4 / 1.4 | -0.01 / -0.011 / -0.006em | 600 |
| body-lg / md / sm | 17 / 16, 15, 13 | 1.6 / 1.6 / 1.5 | slight negative | 400 |
| label-lg / md / sm | 14, 13, 11 | 20 / 16 / 14px | none | 600 / 600 / 500 |
| eyebrow | 11 | 14px | 0.09em, uppercase | 600 |
| mono-md / mono-sm / led | 12, 10, 22 / 20 | 16 / 14 / 24px | none | 500 |

| Component | Size |
|---|---|
| Button sm / md / lg | 32 / 40 / 48 high; padding-x 12 / 18 / 24; pill; icon 14 / 16 / 18 |
| Icon button | 32 / 40 / 48 |
| Nav bar / nav item | 52 / 44 (mobile 48 / 40), item padding-x 14 |
| Segmented | track 36 with 3px padding, segment 30; radius 10 / 7 |
| Filter chip / glass chip / badge | 30 / 28 / 20 high; badge radius 6 |
| Toggle | 44×26 track, 20 thumb, 18 travel |
| Checkbox | 18, radius 5 |
| Input / select / textarea | 44 / 44 / min 112; radius 12; padding-x 14 |
| Menu item / list row | 36 / 64 |
| Accordion trigger | min 56; chevron 16 in a 28 well |
| Cards | grid card radius 20, padding 20 (mobile 16); panel radius 28, padding 28 (mobile 20) |
| Bezel | padding 12; outer radius 36, inner 24 (or pill) |
| Section | padding-y 96 / 80 / 64; heading block: eyebrow, 12px, h2, 12px, subhead, then 40px (mobile 28) to content |

**States:** press scales to .97 (nav items and widgets to .92). Focus is a 2px ring with a 2px offset. Disabled is opacity .4.

## 3. Navigation: liquid-glass bar with a clear lens

**Layout:** wordmark, then the centred glass pill nav, then the theme key and the "Book a consult" button.

**Bar:** `blur(50px) saturate(200%)`, a curved specular `::before`, and a pointer glare `::after` (overlay blend).

**Lens:** a clear capsule defined by rim light only, with no tint and one tight contact shadow. (The v2 slider read as a smudge because of its tint and heavy shadow.)

| Lens behaviour | Spec |
|---|---|
| Slide | 520ms `cubic-bezier(0.34, 1.2, 0.64, 1)` |
| Stretch | scale(1.14, .9) → (.97, 1.04) → 1 |
| Magnify | Active label scales to 1.06 |
| Hover | A ghost capsule at 35% |
| Press | Item scales to .92, lens to .96 |
| First paint | Snaps into place; no slide |

## 4. Components (from the reference board)

| Component | Where | Key spec |
|---|---|---|
| Receipt printer (`ClearancePrinter.tsx`) | Hero | Dark glossy head unit, LED "Duty saved", 3 route presets (MY / ID / VN). On change: retract 260ms, then LED scramble 320ms, then print in 9 steps over 990ms with the head unit nudging, then a 240ms spring settle. Sits on a dawn-beach scene. Illustrative figures on A$48,000. |
| Dark menu card (`Markets.tsx`) | Markets | Device card (R 32). Filter pills. A list of 64px rows with a sliding lifted surface (420ms spring). Scene panel (R 22) with a glass chip "03 / 10 · Jakarta" and a detail sheet. |
| Dawn scenes (`MarketScene.tsx`) | Markets, hero, post thumbnails, widgets | SVG 640×452: sky gradient, sun with halo, ridge, landmark silhouette, water with reflections. Per-country palette and landmark. |
| Switch panel (`ReadinessCheck.tsx`) | Readiness | Crate illustration whose tag takes the verdict colour. Six toggles, 2 points each. 0–4 Hold, 6–8 Inspect, 10–12 Cleared. "Fix first" line. Filled and outlined buttons. |
| Bezel window (`.bezel` + `.bezel-well`) | Process icons, proof stats, 404 map, post thumbnails | Thick sand bezel, recessed well. |
| Magnifier lens | Proof stats (desktop) | 72px glass circle at 1.25× zoom that follows the pointer. |
| Theme key (`ThemeKey.tsx`) | Header | Dark slot 72×40 with a 32px key that glows orange in light and cyan in dark. An 11×11 pixel sun/moon dissolves diagonally between states (620ms max). |
| Contours (`Contours.tsx`) | Footer, CTA band, 404, scene foregrounds | Generated topographic rings at .14 (light) / .08 (dark) alpha. |
| Widget board (`Glance.tsx`) | New "Export at a glance" section after Services | Bezel well holding a 4×2 grid of 164px cells: duty saved (2×2, orange), shipment status (2×1, device), next deadline (1×1), market weather (1×1). Click to morph open: 480ms `cubic-bezier(0.32, 0.72, 0, 1)`, siblings dim to .45. Inside you can act: change shipment value, read checkpoints, jump to markets. Escape closes. Inspired by combine-and-act-in-place home-screen widgets; not attributed to any vendor. |

## 5. Elevation and recess

- **Shadow tint:** light `24 40% 20%`, dark `260 40% 2%`.
- **E1–E4:** a 1px ring plus soft negative-spread drops. Raised surfaces add a top inner highlight.
- **Filled button:** gradient `hsl(24 95% 60%) → hsl(21 90% 53%)` with an inner highlight and an orange drop shadow. Hover lifts 1px; pressed sinks 1px and loses the drop.
- **Recessed fields:** `inset 0 1px 2px tint/.14`. Focus adds a ring border and a 4px glow.

## 6. Motion

**Curves:**

| Name | Curve |
|---|---|
| spring | `cubic-bezier(0.34, 1.2, 0.64, 1)` |
| morph | `cubic-bezier(0.32, 0.72, 0, 1)` |
| out | `cubic-bezier(0.2, 0, 0, 1)` |
| in | `cubic-bezier(0.3, 0, 0.8, 0.15)` |

**Reduced motion:**
- The receipt shows its final state.
- Moves become instant.
- The widget swaps by crossfade only.
- The process track shows full.

## 6a. Pebble finish (v3.1)

One satin material shared by every raised component (cards, buttons, chips, widgets, bezels, menus, toggle thumbs):

| Layer | Spec |
|---|---|
| Satin sheen | `radial-gradient(130% 110% at --lx --ly, white × sheen, transparent 58%)`. Sheen .62 light / .13 dark; filled buttons .42. |
| Bounce light | `linear-gradient(to top, white × .14 / .05, transparent 34%)` |
| Matte grain | SVG fractal noise tile, 140px, alpha .09 (warm) light / .05 (white) dark. Also applied to wells and fields. |
| Convex shading | Top rim `inset 0 1px 0`; underside `inset 0 -10…-14px 18…24px` in the tint at .16 light / .45 dark |
| Float | Rest `0 2px 3px` + `0 14px 26px -12px`. Hover lifts 5px (cards) or 2px (buttons) to `0 26px 40px -16px`, 320ms spring. Press: cards scale .985, buttons sink 1px and scale .96 |
| Interactive light | `--lx` / `--ly` are registered properties. One delegated pointer listener (`PebbleLight.tsx`) moves the highlight toward the cursor on the hovered surface (upper half only); it glides over 500–600ms and drifts back on leave. Fine pointers only; off for reduced motion. |
| Idle float | The hero printer drifts ±3–4px over 7s |
| Toggle thumb | White pebble: radial highlight at 35%/25%, underside shade, two-step drop |

## 7. Removed

- **3D layer:** three.js and the stones.
- **Background:** the aurora animation and veil.
- **Glass:** glass on content cards.
- **v2 effects:** tilt and sheen cards, ripple, magnetic CTAs, the 3D button edge, pebbles.

## Pre-launch checklist

- [ ] **Market data** (`src/data/markets.ts`): review, then set `MARKETS_REVIEWED`.
- [ ] **Proof** (`src/data/proof.ts`): sample data; replace, then set `PLACEHOLDER = false`.
- [ ] **Illustrative figures** in the receipt printer and widgets: counsel to review.
- [ ] **Name and contact details** (`src/config/site.ts`), **enquiry delivery** (`src/lib/enquiry.ts`), and **regulatory wording** (FAQ, footer, response-time promise).

## v3.2 Edge polish

**A. One edge for every raised surface.** Recipe: `var(--edge-top), var(--edge-rim), <underside inset shade>, var(--edge-out), <drop>` on `.surface-1…4`, `.menu-surface`, `.btn-raised`, `.card-hover:hover`, `.bezel`, the Glance widgets (rest, hover, open) and the open FAQ item (`.faq-item`). The `0 0 0 1px` ring is gone from `--e1…--e4`, so there is only one outer line.

| Token | Light | Dark |
|---|---|---|
| `--edge-rim` | `inset 0 0 0 1px hsl(0 0% 100% / .75)` | `inset 0 0 0 1px hsl(0 0% 100% / .07)` |
| `--edge-top` | `inset 0 1.5px 0.5px hsl(0 0% 100% / .95)` | `inset 0 1px 0.5px hsl(0 0% 100% / .14)` |
| `--edge-out` | `0 0 0 0.5px hsl(24 40% 20% / .10)` | `0 0 0 0.5px hsl(0 0% 0% / .6)` |
| `--well-lip` | `inset 0 0 0 1px hsl(24 40% 20% / .10)` | `inset 0 0 0 1px hsl(0 0% 0% / .6)` |
| `--well-catch` | `0 1px 0 hsl(0 0% 100% / .9)` | `0 1px 0 hsl(0 0% 100% / .06)` |

- Coloured buttons keep their own recipes and add an inner rim: filled `inset 0 0 0 1px hsl(0 0% 100% / .22)`, device `… / .08`. Filled drop: rest `0 8px 16px -8px`, hover `0 14px 22px -10px`.
- Wells (`.icon-well`, `.bezel-well`, `.recessed`, unchecked checkbox) use the inset shade plus `--well-lip` and `--well-catch`.
- Nav bar hairline: `0 0 0 0.5px hsl(24 40% 20% / .12)` light, `hsl(0 0% 0% / .6)` dark.

**B. Continuous corners.** Inside `@supports (corner-shape: squircle)`, surfaces, menus, bezels, wells, fields and `.pebble` get `corner-shape: squircle`. Anything with `.rounded-full` or `.pill` is left out, so pills stay round.

**C. Concentric radii** (inner = outer − padding):

| Element | Outer / padding | Inner |
|---|---|---|
| Readiness card | 28 / 12 | illustration 16 |
| Post card | 20 / 10 | thumbnail well 10, image 6 (well padding 4) |
| Glance board | 44 / 20 (16 mobile) | widgets 24 (28 mobile), rest and open |
| Markets device | 32 / 12 | scene panel 20; active row 14; detail sheet 14 |
| Process bezel | 30 / 12 (18 / 6 mobile) | well 18 (12 mobile) |
| Theme key | slot 14 / 4 | key 10 |
| Hero printer | stage 36 | head unit 20 / 14 (unchanged) |

**Review note (design lead):** the squircle corner experiment (B) was reverted after review. At these radii it made cards read as boxy rather than pebble-soft, so standard round corners stay.

## v3.3 Density pass

Client feedback: too much empty space and an oversized hero headline. Tighter type and rhythm, and side columns that carry content instead of air.

**1. Type scale** (mobile / ≥768 / ≥1024):

| Role | Was | Now |
|---|---|---|
| `display-lg` | 38 / 52 / 64 | 34 / 44 / 52 |
| `display-md` | 32 / 40 / 48 | 30 / 36 / 42 |
| `headline-lg` | 28 / 32 / 38 | 24 / 28 / 32 |
| `headline-md` | 24 / 28 | 22 / 24 |
| `body-lg` | 16 / 17 | 16 / 16 |

**2. Vertical rhythm.**

- `.section` padding-block 40 / 56 (≥768) / 64 (≥1280), was 64 / 80 / 96. `.after-heading` 20 / 28, was 28 / 40.
- `SectionHeading`: eyebrow → h2 and h2 → subtitle 10px (`mt-2.5`); h2 max 28ch, subtitle max 60ch.
- Footer `pt-10 md:pt-12`; bottom row `mt-8 pt-5`.
- Services grid gap 16 at all sizes; card title `mt-3`, footer `mt-3 pt-3`. Contact form `gap-y-3.5`, textarea 4 rows. Proof stat wells 96 high at all sizes, numerals `headline-lg`.

**Structural changes**

- **Hero:** 7 / 5 grid, h1 16ch, printer stage 400×460 (328×400 mobile) with a tighter receipt (head unit and receipt sit 8px higher; below 640 the receipt drops the trademark row and barcode so its torn edge stays ≥16px inside the stage). Trust text replaced by three `surface-1` stat pills. The **problems strip** (`#problems`) now lives inside the hero: one `surface-2` panel, three cells divided by `outline-variant` hairlines. The separate Problems section is gone.
- **Glance:** two columns from 1024: heading, widget legend and the illustrative note on the left (4 cols), board on the right (8 cols). Below 1024 the legend is hidden.
- **Process:** two columns from 1024: heading on the left (4 cols), 2×2 step cards on the right (bezel 64 / padding 8 / radius 20 around a 48 well). The scroll-filled track is removed.
- **Readiness:** the left column gains a "How to read your score" card (Hold / Inspect / Cleared with score ranges); grid aligns to the top.
- **FAQ:** "Still unsure?" consult card under the heading; accordion spans 8 columns from column 5.
- **Insights:** the empty state is a slim strip with a "Browse insights" button; the header and mobile "All insights" buttons hide while there are no posts.
- **Markets:** desktop list and scene height 420, was 452.
- **Proof:** testimonials use subgrid rows from 768, so quote marks, quotes and caption rules line up whatever the name length.

## v3.4 — type and copy pass

- **Families:** display Bricolage Grotesque (variable, optical sizing on), body Instrument Sans, mono Geist Mono. Loaded from Google Fonts in `index.html`.
- **Weights and tracking:** display and headline classes are weight 600 (was 800/700) with tracking −0.03em (display-lg) down to −0.015em (headline-sm). Body, title and label classes use tracking 0; the Inter-only `cv11` feature is gone.
- **Eyebrow:** Geist Mono 12/16, weight 500, sentence case (no longer uppercase tracked caps). The orange dot stays.
- **Copy:** hero headline "Export to Southeast Asia. Get it right the first time."; the call-to-action label is "Book a free call" everywhere; services, process, readiness verdicts and two FAQ answers rewritten to say what the client gets.

## v3.5 — hero route picker, scroll-in CTA, one icon language

- **Hero:** both hero buttons are gone. The h1 is one colour (`text-foreground`, no `text-gradient`), two lines from 1024 (`<br>` after the first sentence), natural wrap below. The top chip is text only. Where the buttons were: "Try a route" (`type-mono-sm`) → 8px → a `.recessed` segmented control (`role="radiogroup"`, 44 high, padding 4, pill; options 36 high, padding 0 14, `type-label-md`; selected = `surface-1` thumb with e1, `text-foreground`; arrow keys / Home / End with a roving tabindex) → 10px → helper line (`type-body-sm`). Options Malaysia · cosmetics / Indonesia · biscuits / Vietnam · T-shirts map to the MY / ID / VN presets; below 480 only the country shows. `ClearancePrinter` takes optional `selected` / `onSelect` (internal state when absent); the device keys stay in sync and any selection change runs the retract → print sequence. Stat pills sit 20px below the helper line.
- **Hero alignment:** from 1024 the printer card is flush with the container's right edge (`lg:mr-0` on the `mx-auto` card); centred below.
- **Problems strip:** one left-aligned header row (eyebrow, 12px, h2 in `type-label-md text-muted-foreground`, baseline-aligned). The icon wells are replaced by 8px `bg-destructive` LED dots with a 3px `destructive / .14` halo, centred on the title's first line, 12px to the text.
- **Header CTA:** on the home page it is hidden until the hero (`#hero`) leaves the viewport (IntersectionObserver), then springs in (opacity 0→1, scale .92→1, x 8→0, 260ms `cubic-bezier(0.34,1.2,0.64,1)`; fade only with reduced motion). While hidden it is `inert`, `aria-hidden`, `pointer-events: none` and `tabindex=-1`, and keeps its slot so the nav pill and theme key never move. Always shown on other routes; the drawer CTA is unchanged.
- **Readiness:** the panel is flush right from 1024 (`lg:ml-auto lg:mr-0`).
- **Process:** pixel icons removed (and `PixelIcon` with them, now unused). The 48 well shows the numeral `01`–`04` (Geist Mono 18/600, `text-primary-ink`, tabular); the mono meta line shows only the meta.
- **IconContainer:** md 44 well / 22 glyph, sm 36 / 18, `strokeWidth` 2, `[&_svg]:shrink-0`.
- **Alignment audit** (1440×900): no card-like block (`surface-*`, `bezel`, `bg-device`, >200 wide, not nested in another card or the Glance board well) sits within 70px of the container edge without being on it. At 1024 / 1280 / 1440 headings, cards, the wordmark and the hero column share the left edge; the header CTA, printer, readiness panel and right-most cards share the right edge.
