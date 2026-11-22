# "Dawn Tactile": Design Specification v3

Supersedes v2 "Tidewater Glass", v2.1 (3D stones, removed) and v2.2. Written by the design advisor (Fable) from the
client's reference board (`docs/inspiration-board.jpg`) and the liquid-glass nav prompt; implemented in this repo.
A standalone liquid-glass nav reference lives at `prototypes/liquid-glass-nav.html`.

**Concept:** small, precise physical objects on a warm sand desk at first light: a receipt printer, a menu card, a
switch panel, bezelled windows, one glowing key. Glass survives only in the header and on scene chips.
**Default theme:** light ("Dawn"). Dark is "Dusk".

## 1. Palette "Dawn" (HSL)

> **Superseded by v3.8 "Golden Hour"** (see the end of this file). The dawn-orange values below are kept for history only; `src/index.css` is the source of truth.

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

> Fonts superseded in v3.8: Sora (display), Manrope (UI/body), Geist Mono. See "v3.8 — Golden Hour".

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

> Desktop layout superseded in v3.8: one glass bar spanning the container. See "v3.8 — Golden Hour".

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

## v3.6 — surface finish pass

Goal: every surface carries the finish of the orange primary button (crisp rim, clear top highlight, defined shadow).

- **Ground and surfaces (light):** `--background` 34 42% 93.5% (was 36 50% 96%), `--card` / `--popover` 40 70% 99.5%. `--bg-base` stops deepened ~2.5% (`#f8f1e7 → #f2e6d6`). The steps below the card moved by the same delta so they stay darker than the page: `--surface-container-low` 91.5%, `--surface-container-high` 86.5%, `--muted` 89.5%, `--bezel` 83.5%.
- **Edges:** `--edge-out` is a 1px hairline `hsl(24 40% 20% / .09)` (was 0.5px / .10). Elevations `--e1` `0 1 2 /.08, 0 8 16 -8 /.20`, `--e2` `0 1 2 /.08, 0 12 24 -10 /.22`, `--e3` `0 2 4 /.08, 0 20 36 -14 /.24`.
- **Dark:** `--card` 12.5% (was 11%), `--edge-rim` white .10, `--edge-top` white .18.
- **Device panels:** `.device-surface` (Markets card, CtaBand) adds `inset 0 1px 0 white/.10, inset 0 0 0 1px white/.06` ahead of `--edge-out, --e4`.
- **Fields:** no border. `.recessed` = `surface-container-low` well, 12px radius, 44 high (textarea min 128), padding 0 14. Shadow `inset 0 2px 4px tint/.16, inset 0 0 0 1px tint/.12, 0 1px 0 white/.9`; hover lip .22; focus / open adds `0 0 0 2px primary, 0 0 0 6px primary/.16`; `aria-invalid` uses the same ring in destructive. Dark uses `--well-lip` / `--well-catch` with a black inset. Placeholder `muted-foreground / 70%`. Select chevron 16px, muted, 14px from the edge.
- **Checkbox (`.check-well`):** 20×20, radius 6; unchecked = the field well; checked = the `.btn-filled` gradient and rim with a white 14px check (stroke 2.5); focus ring as fields. Works for the Radix checkbox and for a native `peer` input (contact consent). Label line-height 20px so line one centres on the box, 12px gap.
- **Eyebrow:** sans 13/16, weight 600, tracking 0, sentence case. Mono is kept for device / receipt labels only (`type-mono-*`, LED). The hero "Try a route" label moved to the eyebrow.
- **Header:** desktop bar is a `minmax(0,1fr) auto minmax(0,1fr)` grid, so the nav pill is centred and never moves. The CTA sits in `.header-cta-slot`, which collapses to 0 width and 0 gap while hidden (theme key flush with the container's right edge) and opens with `grid-template-columns: 0fr → 1fr` + margin 0 → gap, 260ms `cubic-bezier(0.34,1.2,0.64,1)`. It clips only while collapsed / opening (`data-clip`, released 300ms after showing) so the button shadow is not cut. Hidden = `inert`, `aria-hidden`, `tabindex=-1`. Same slot in the ≥480 mobile bar. Below 1280 the nav items use 10px padding, the grid gap is 12px and the CTA is 36 high without the arrow so the centred pill still leaves room at 1024.
- **Markets:** each market has a `tagline` for the list's second line (no truncation). The desktop list has a 40px `mask-image` fade at the bottom (until scrolled to the end) and at the top once scrolled. Detail sheet: padding 24, radius 20, three even columns from 768 (gap 24): regulator chips wrap, hurdles a single list (8px rows, 16px icon on line one), agreements a wrapping chip row (gap 6). Column labels use the eyebrow in `#6B6158` (5.6:1 on the sheet).
- **Scenes:** shared drawing rules in `MarketScene.tsx`: buildings via `block()` with 3px rounded tops, a back layer in the same hue at 55% (`${top}8c`) and 2–3 rows of 14% white window dots on front buildings; cranes / masts / finials are 3px round-cap strokes that meet at joints (`crane()` helper replaces the old crossing paths); sun halo is a two-stop radial (35% → 0); the dashed reflection is now three short strokes under the sun. The Brunei finial now sits on the dome (it floated before).
- **Proof:** stat bezel padding 8, `.stat-well` inner lip (`inset 0 3px 8px`), numerals `headline-lg` 600 `text-primary-ink`, labels one line from 1280. Avatars are 40px `icon-well` circles with `type-label-md text-primary-ink` initials. "(placeholder)" removed from the names; the "Sample data" badge and `PLACEHOLDER = true` stay.
- **Sweep:** Glance legend swatch for "Next deadline" drops its `border` for the `--edge-out` hairline (all swatches get it); testimonial captions centre on the avatar. Muted text contrast on the deeper ground: 5.8:1 page, 5.3:1 gradient bottom, 5.6:1 `surface-low`, 4.95:1 `surface-high`, 4.6:1 bezel.

## v3.7 — markets drop-down, responsive pass, one motion system

Colours, font families and section order are unchanged (a separate decision on those is pending).

**1. Contact: "Target markets" drop-down** (`src/components/home/MarketsSelect.tsx`)

- Replaces the 11 filter chips. The trigger is the select recipe exactly: `.recessed` well, 44 high, 12px radius, padding 0 14, `type-body-md`, 16px muted chevron that turns 180° while open, placeholder `Select markets` in `muted-foreground / 70%`, focus / open ring as the other fields.
- With selections the trigger lists the names in market order, joined by ", ", on one line; names that don't fit collapse into a trailing count (`Malaysia, Vietnam +2`, measured with the trigger's font, re-measured on resize).
- Menu: Radix dropdown-menu (`modal={false}`) on `.menu-surface`, width = trigger width, max height 320 (or the space available) with scroll. Items 40 high from 1024, 44 below (touch rule); `.check-well` box on the left, 12px to the label. Ticking keeps the menu open (`onSelect` prevented); Escape, Tab-out or an outside click closes it. Ten markets, a hairline separator, then `Not sure yet`, which is exclusive (choosing it clears the markets; choosing a market clears it).
- Keyboard: Enter / Space / ↓ opens, arrows and typeahead move, Space / Enter ticks. The trigger is named by the field label plus its value text (`aria-labelledby`); the menu is labelled by the field label.
- Same `markets: string[]` value as before in react-hook-form / zod, the enquiry draft and the mailto body.
- Grid from 640: Name | Work email; Company | Exporting from; Target markets | Product category; Stage (left half); message, consent and submit full width. One column below 640.

**2. Responsive rules**

- **Viewports audited:** 320×640, 360×800, 390×844, 414×896, 844×390, 600×960, 768×1024, 820×1180, 1024×768, 1180×820, 1280×800, 1366×768, 1440×900, 1920×1080, 2560×1440 (Playwright: no horizontal scroll, nothing wider than the viewport, no clipped / overlapping text, no text outside its card or its own button, 44×44 targets below 1024, no orphaned heading words, popovers inside the viewport, drawer reachable, header on one line).
- **Container** (`.container` in `index.css`): gutters 16 / 24 (≥640) / 32 (≥768) / 40 (≥1024) / 48 (≥1280); content capped at 1280 and centred. Gutters become `max(gutter, env(safe-area-inset-*))`.
- **Fluid type:** display and headline roles (and title-lg, LED) use `clamp()` between their old mobile and desktop sizes, interpolated 360 → 1280px: display-lg 34→52, display-md 30→42, headline-lg 24→32, headline-md 22→24, headline-sm 20→22, title-lg 18→19. `.section` padding 40→64 the same way. Headline roles and h1–h3 `text-wrap: balance`, paragraphs `pretty`.
- **Touch targets (<1024):** controls that are visually smaller than 44 (chips, pills, the switch, icon buttons, all `Button`s) get an invisible 44×44 hit area via `.hit::after` (element must be positioned); list rows (footer links, drawer insights links, select / menu items) are 44 high below 1024. Hover styles only apply on hover-capable pointers (`future.hoverOnlyWhenSupported`).
- **Hero:** 768–1023 the text block is max 640 and the printer sits centred below it. Phone landscape (landscape, ≤500 high, 600–1023 wide): text 7 / printer 5 side by side, the printer uses its compact 328×400 size (`roomy:` variant = ≥640 wide and not a landscape phone), hero ≈ 1.9 screens at 844×390.
- **Markets:** below 1024 the list is a horizontal snap row of country pills above the scene; the scene is 16/11 (16/9 from 768) and never taller than 70svh; the detail sits below with its full width for the snapshot (the draft badge moved next to the name).
- **Proof stats:** 2×2 on phones (centred text below 640), 4 across from 1024. Readiness actions stack below 380. Glance deadline numeral 32 below 400.
- **Safe areas:** `viewport-fit=cover`; the sticky header sits `8px / 12px + env(safe-area-inset-top)` down, the drawer pads for the top / right / bottom insets, the footer adds `env(safe-area-inset-bottom)`; anchor `scroll-margin-top` adds the top inset. App shell `min-height: 100dvh`.

**3. Motion tokens and rules** (`:root` block at the end of `index.css`)

| Token | Value | Used for |
|---|---|---|
| `--ease-out` | `cubic-bezier(0.2, 0, 0, 1)` | entrances, reveals, menus, page changes |
| `--ease-spring` | `cubic-bezier(0.34, 1.2, 0.64, 1)` | press / hover feedback, switches, nav lens |
| `--dur-short` | 150ms | menus and selects (scale .98→1 + fade) |
| `--dur-medium` | 260ms | press release, FAQ answer fade, CTA slot |
| `--dur-long` | 600ms | scroll reveals, hero items |
| `--stagger` | 70ms | step between staggered items (max 6 steps) |

- **First paint:** header fades / drops 12px (400ms); from 200ms the hero chip, h1, paragraph, route picker and stat pills rise 20px + fade (600ms, 70ms apart); the printer scales .96→1 + fades (700ms) and prints its first receipt at ~1s.
- **Scroll reveals** (`Reveal`, `src/lib/reveal.ts`): once 15% of an element (or 15% of the viewport, for taller elements) is visible: opacity 0→1, translateY 24→0, 600ms `--ease-out`. Elements that enter in the same frame stagger 70ms in document order; `<Reveal stagger>` staggers its direct children (section headings: eyebrow, title, subtitle, extras). One shared IntersectionObserver (no rootMargin, so it behaves the same inside the artifact iframe) plus a passive rAF rect check on scroll plus a 1.5s fallback if the observer never answers. Already-passed elements count as seen.
- **Never invisible:** hidden "before" states only exist under `html.motion-ok`, set in `main.tsx` when JS runs and reduced motion is off. All entrances are CSS animations with fill-mode `backwards` and individual `translate` / `scale` properties: nothing lingers afterwards and `.nav-glass` blur is never under a filling opacity animation.
- **Scroll progress:** 2px `--primary` line fixed at the top (`.scroll-progress`), `transform: scaleX()` from a passive, rAF-throttled scroll listener, `will-change: transform`.
- **Feedback:** buttons lift on hover (pointer devices) and squish on press with the spring; chips / pills / switches / select triggers / FAQ triggers / menu items use `.press` or `.press-soft` (scale on `:active`); cards keep `card-hover`. FAQ: Radix height 260ms open / 200ms close plus an answer fade. Mobile drawer and market detail sheet slide as before.
- **Theme switch:** 200ms cross-fade of the whole page through the View Transitions API (opacity only); instant where unsupported or with reduced motion.
- **Routes:** the page container fades and rises 8px in 200ms; scroll resets to the top instantly. In-page anchors scroll smoothly and land below the sticky header (`scroll-margin-top`).
- **Reduced motion:** no `motion-ok`, so everything renders in its final state; the global rule cuts remaining animations and transitions to ~0; smooth scrolling is off.
- **Deliberate exceptions to "transform / opacity only":** the FAQ accordion height and the Glance widget morph (left / top / width / height) still animate layout, as before.


## v3.8 — Golden Hour

The owner's new colour and type direction plus new placements. The material system (pebble finish, edges, wells, bezels,
glass), the 1280px container, fluid type, the reveal system (`src/lib/reveal.ts`), motion tokens, 44px hit areas and the
markets drop-down from v3.7 are unchanged. The dawn-orange palette (section 1) and the v3.6 header scrim are **superseded**.

### Fonts
- Google Fonts: `Sora:wght@400..800`, `Manrope:wght@400..800`, `Geist Mono:wght@400..600` (index.html and the artifact
  `straitline.html`).
- Tailwind `fontFamily`: display `"Sora"`, sans `"Manrope"`, mono `"Geist Mono"`, each with system fallbacks.
- Display/headline weight 600. Tracking: display −0.035em, headline-lg −0.03em, headline-md/sm −0.025em, title-lg −0.015em.
  Body Manrope 400/500; labels and titles stay at 600 (Manrope 600 reads firmly enough).
- `type-display-lg` re-tuned to `clamp(34px, 28.522px + 1.5217vw, 48px)` (max 52 → 48, −7.7%): Sora is wider, and the
  hero's second line wrapped at 1024px. No other clamp needed changing (the section h2 wraps that grew come from the new
  24ch measure, which scales with the font, so a smaller size would not help).

### Colour tokens (HSL, `src/index.css`)
| Token | Light | Dark |
|---|---|---|
| background | 44 70% 92% | 160 22% 6% |
| foreground (card/popover/secondary fg follow) | 160 24% 10% | 44 40% 94% |
| card / popover | 48 80% 98% | 160 16% 10.5% / 10% |
| primary (amber) | 34 96% 50% | 36 96% 56% |
| primary-foreground | 160 30% 8% | 160 30% 8% |
| primary-ink | 28 90% 32% | 38 95% 66% |
| ring | 32 96% 44% | 36 96% 56% |
| muted-foreground | 160 8% 34% | 44 10% 68% |
| secondary / muted | 44 52% 89% / 44 46% 87.5% | 160 12% 15% / 160 12% 12.5% |
| accent / accent-fg | 40 96% 88% / 28 90% 28% | 36 50% 16% / 40 100% 80% |
| border / input / outline-variant | 44 30% 79% / 160 8% 46% / 44 28% 77% | 160 10% 20% / 160 8% 44% / 160 10% 18% |
| surface-low / surface-high | 44 50% 88% / 44 38% 83.5% | 160 20% 8% / 160 12% 14% |
| bezel | 44 40% 82% | 160 12% 13.5% |
| primary-container / on- | 40 96% 85% / 28 85% 22% | 34 60% 18% / 40 100% 86% |
| tertiary (deep teal-green) / container / on-container | 165 60% 24% / 165 40% 86% / 165 70% 13% | 165 55% 58% / 165 40% 14% / 165 60% 82% |
| device / device-fg | 160 20% 8% / 44 40% 94% | 160 22% 4.5% / 44 40% 94% |
| led | 34 100% 60% | 34 100% 60% |
| tint (all shadows, edges, wells, float drops) | 160 30% 12% | 160 40% 2% |
| bg-base | `#fbf4e1 → #f5e6c4` | `#0b1310 → #101a15` |
| blobs | amber 38/.38, coral 18/.22, teal 165/.20 | amber 36/.16, teal 165/.14, amber 28/.10 |
| nav-fill | 48 80% 98% / .72 | 160 16% 12% / .62 |

- `.btn-filled`: `linear-gradient(180deg, hsl(40 98% 58%), hsl(30 95% 50%))`, inner/outer shadow hues 28–34; label in
  `--primary-foreground`. The checked checkbox uses the same gradient with a primary-foreground tick.
- **Paper tokens** for illustrations that stay light in both themes (receipt, market detail sheet, filter chips on the
  device panel): `--paper` 48 90% 98.5%, `--paper-ink`, `--paper-muted`, `--paper-rule`, `--paper-chip`,
  `--paper-accent` (28 90% 32%), `--paper-teal` / `--paper-teal-ink`. Tailwind: `bg-paper`, `text-paper-ink` etc.
- The hero printer's backdrop scene (`SCENES.home`) is amber sky, cream horizon, deep-teal water and cream sand. The
  printer head and keys are green-black; the ThemeKey glows amber (light) or mint (dark). Market and post scenes keep
  their own illustration palettes.
- Placeholders use full `muted-foreground` (no 70% alpha).

**Contrast (WCAG, computed from the tokens):**

| Pair | Light | Dark |
|---|---|---|
| foreground on background / card / surface-low / bezel | 14.97 / 16.44 / 13.72 / 12.05 | 16.93 / 15.10 / 16.14 / 13.81 |
| muted-foreground on background / card / surface-low / bezel | 6.08 / 6.68 / 5.57 / 4.89 | 8.82 / 7.87 / 8.41 / 7.20 |
| primary-ink on card | 5.94 | 10.10 |
| button label on amber (gradient top / bottom) | 10.11 / 6.83 | same |
| placeholder (muted-fg) on field (surface-low) | 5.57 | 8.41 |
| paper-muted / paper-accent on paper | 6.73 / 5.99 | same |

### Header
- ≥1024: **one** `.nav-glass` bar the width of the container: 60px tall, radius full, padding 0 8px 0 20px. Grid
  `minmax(0,1fr) auto minmax(0,1fr)`: wordmark left, nav centred (moved 6px left to cancel the asymmetric padding), right
  track = ThemeKey then the 40px "Book a free call" button. The CTA keeps the collapsed-slot appear-on-scroll behaviour on
  home; it opens inside the right track, so the nav never moves (measured stable at 1024–2560). Lens, stretch, spring and
  scroll-spy are unchanged. Glare/specular cover the whole bar.
- 1024–1279: nav items `px-[7px]` with no gap, CTA `px-3` label-md, CTA gap 6px; the descriptor shows from 1280.
- The `.header-scrim` hack is gone; the bar (fill raised to 72% / 62%) is the backing.
- <1024: the single glass bar + drawer are unchanged.

### Section order and nav
Hero (+ problems strip) → Services → Process → Markets → ReadinessCheck → Glance → Proof → InsightsTeaser → Faq → Contact.
Nav: Services · How it works · Markets · Readiness check · Insights · About (scroll-spy follows page order).

### Hero
≥1024 mirrored: printer in the left 5 columns, flush with the container's left edge; text in the right 7, left-aligned,
vertically centred on the printer. DOM order stays text first (`lg:order-*`). <1024 unchanged. The phone-landscape
side-by-side rule is mirrored too (printer left).

### Section headings
`SectionHeading` is a centred block: eyebrow (dot + label) → 10px → h2 (headline-lg, `max-w-[24ch]`, balanced) → 10px →
subtitle (`max-w-[56ch]`) → `.after-heading` → content at full container width. Page h1s (About, Insights, Authors) use
the same block with display-md at 20ch. Extra content (e.g. Proof's "Sample data" badge) is centred under the title.
- Process: four cards in a row ≥1024, 2×2 at 640–1023, one column below.
- Glance: board centred, max 880px; the legend is a 4-column row under it (2×2 on phones).
- Readiness: one centred 960px panel (v3.9, see below); the three ticks are a row under the subtitle.
- FAQ: accordion centred, max 800px; "Still unsure?" is a slim row under it, the same 800px wide (text left, button
  right, stacked on phones).
- Contact: one 880px column (v3.9): steps strip, form, contact-details row.
- Insights: a single centred "All insights" button under the cards at every size.

### Card anatomy (`src/components/site/CardHeader.tsx`, `.card-*` in index.css)
- `.card-shell`: padding 20px (`.card-shell-lg` 24px from 768), flex column, `container-type: inline-size`.
- **Header row** (`CardHeader`): 40px well (20px icon, or a mono numeral) + title (`type-title-lg`) + optional mono-small
  meta right-aligned, 12px gaps. The title's **first line** is centred on the well (`margin-top: calc((40px - 1lh)/2)`),
  so one- and two-line titles in a row share a first baseline.
- **Body** (`.card-body`): 12px below, `type-body-md`, muted.
- **Footer** (`CardFooter` / `.card-foot`): `margin-top: auto`, hairline above, 16px top padding; at least 16px between
  the body and the hairline. Rows of cards stretch to equal height, so footers align across a row.
- Narrow cards (<280px, i.e. Process at 1024–1279): the meta drops under the title and the title steps down to 17px.
- Applied to: Service cards, Process steps, "Still unsure?", About
  ("Why we exist" and the principle cards). Problems strip items: dot + title row, body hangs from the title's left edge.
  Testimonials: quote mark, quote, pinned `.card-foot` (avatar well + name + route) on the existing subgrid. Insight
  cards: image, title + arrow, body, pinned footer with the type badge and date.

## v3.9 — no empty space beside tall cards
- **Readiness** (`ReadinessCheck.tsx`): the ticks are one centred row of small items 16px under the subtitle (wraps on
  phones). The check is ONE `surface-3` panel, max 960px, radius 28, padding 16 (12 below 1024), with a 12-column grid
  (gap 24) at ≥1024. Left 5/12: crate well (10:7, about 4:3, cropped around the crate; score pill in its corner) →
  title + verdict badge → helper → verdict / "Fix first" (min 40px so a two-line verdict does not shift the panel) →
  score legend (hairline above; replaces the separate "How to read your score" card) → buttons + Reset row pinned with
  `mt-auto`. Right 7/12: the six switch rows as a flex column, each `flex-1` (min 64px), hairline dividers. Both columns
  stretch to the grid row, so they share a bottom edge; at 1440 each is 599px tall, rows ~100px. The crate is drawn
  twice (strip crop `lg:hidden`, well crop `hidden lg:block`), each with its own gradient id. Below 1024 the column
  wrappers are `display: contents` and `order-*` gives: illustration, title, switches, fix-first, legend, actions.
- **Contact** (`Contact.tsx`): no side column. Under the heading, an 880px column: a slim `surface-1` strip of the
  three steps (24px numbered wells, one line each, chevrons between; column below 640; visually hidden h3 "What happens
  next"), the form card 20px below, then the three contact details (well + label + value) as a centred, evenly spaced
  row 20px under the form (stacked below 640). Detail links are blocks with `.hit` so they meet the 44px target on touch.

## v3.10 Colours reverted to dawn-orange

The Golden Hour palette (v3.8) is withdrawn. Colour tokens, shadows tints, the filled-button gradient, the theme key, the printer and the hero scene are back to the v3.7 dawn-orange values (sand ground hue 34, orange primary `21 90% 53%`, warm brown ink; dark theme on violet-black hue 258). Everything else from v3.8 and v3.9 stays: Sora + Manrope, the single glass bar, section order, mirrored hero, centred headings, card anatomy, readiness and contact layouts. The `--paper-*` tokens stay and now carry the v3.7 paper colours. The glass bar keeps its raised fill opacity (0.72 light, 0.62 dark) in the old hues.

## v3.11 Refinement pass (reference research)

Research (search only; reference sites could not be loaded from this environment) pointed at three things small clients look for on advisory sites: fee clarity, a clear hiring process and concrete proof. Changes:

- Services: a "How pricing works" strip under the grid (fixed fee per job, no hourly billing, local counsel in the quote), same anatomy as the hero problems strip. The FAQ cost answer now says the same thing. Confirm these commitments before launch.
- Proof: the four stat pebbles are one `surface-2` strip (4 cells ≥1024, 2×2 below) with hairline dividers; numbers top-aligned.
- Hero stats: on phones (<640) one strip of three equal cells, numbers top-aligned; pills from 640.
- Insights: with no published posts, three "In progress" guide cards in the shared card anatomy instead of a one-line notice; the "All insights" link always shows.
- Contact: Stage is a full-width segmented choice (native radios, 2×2 on phones, 4 across from 640) so the row has no empty half.
- Header CTA steps aside while the contact section fills the top half of the screen.
- Footer: the duplicate theme switch is replaced by "Back to top".

## v3.12 Corporate finish

Feedback: "less corporate, finish is average". The tactile material (pebble sheen, bevels, glass, blobs, grain, lift-on-hover, toy theme key) is retired; colours (dawn-orange) and section order stay. The override layer is the "v3.12 Corporate finish" block at the end of `src/index.css`.

- Ground: flat paper `#faf8f5` (dark `#0f0e13`); `--background` matches it. No blobs or grain.
- Surfaces: card fill, 1px `--corp-line` border, quiet shadows (`--corp-shadow-1/2/3`). Hover firms the border; nothing moves.
- Radii: buttons and fields 8px, cards 12px, large panels 14px, segmented controls 10px outer / 7px inner. Pills only for dots and avatars.
- Header: full-width solid bar (68px desktop, 60px mobile) with a hairline once scrolled; active section is a 2px primary underline; theme is a 36px bordered icon button; wordmark is an ink square.
- Section headings: left-aligned. Eyebrow is a 24px rule + label; title (28–44px) in the left 7 columns, subtitle in the right 5, over a full-width hairline.
- Content sits on the 12-column grid: FAQ (help card left 4, accordion right 8), Contact (steps and details left 4, form right 8), Glance (legend left 4, board right 8), Readiness panel full width.
- Rhythm: section padding 56–96px; tinted bands on How it works, Export at a glance and FAQ; a dark ink band on Results; the footer is ink.

## v4.0 "Regional desk" (chosen from three trust-first mock-ups: A partner-led, B track record, C regional desk)

The user picked C, asked to keep every interactive piece, and to use placeholders for people for now.

- Default theme is dark, in warm ink (background `24 20% 7%`, cards `24 18% 9%`, hairlines `24 12% 16%`, text `34 38% 92%`, muted `30 12% 70%`). Light theme (corporate paper) stays available from the header.
- Type: Newsreader 400 (serif) for the hero (`.type-hero`, 44–78px), section titles (32–52px) and stat figures (`.type-stat`); Manrope for everything else, with card titles in Manrope 700.
- Hero: eyebrow of office cities, "One desk for all ten ASEAN markets.", two buttons (Book a free call, How we work), and a grid of the six main markets with who handles each (placeholder: "Local counsel · city"), then a four-cell promise row (1 contact · 10 markets · 1 day to a first answer · fixed fee). The header CTA stays hidden over the hero so the call button never shows twice.
- New "Your desk" section (`src/components/home/Desk.tsx`, data in `src/data/team.ts`, `PLACEHOLDER = true` shows a "Sample people" badge). Portrait cards 4:5 from 640px; compact rows on phones.
- The receipt printer, route picker and the three failure modes moved into their own "Try a route" section (`RouteDemo` in Hero.tsx), after Markets.
- Page order: Hero, Our desk, Services, How it works, Markets, Try a route, Readiness check, At a glance, Results, Insights, FAQ, Contact. Nav adds "Our desk".
- Before launch: real names, roles, admissions and photos; the real local partner firms per market; confirm the "1 day" and fixed-fee promises.

## v4.1 Dawn colours and tactile buttons restored; editorial headings; motion

Feedback: keep the previous colour theme and buttons; text placement must not feel generic; add animation.

- Colours: the v3.11 dawn-orange set again (sand ground with blobs, orange primary, violet-black dark). Light is the default. The v4.0 warm-ink dark and the v3.12 flat ground are removed.
- Buttons: the v3.11 pill buttons (gradient, bevel, sheen, lift), the glowing theme key, the orange wordmark tile, and pill segmented controls (route picker, stage, market filters).
- Kept from v3.12/v4.0: hairline cards, the regional-desk hero, Our desk, serif headlines, the 12-column placements.
- Section headings: editorial margin layout. A hairline across the top; from 1024px the serif section number (01–11) and label sit in columns 1–3, the title and subtitle hang from column 4. On phones the number and label share a row.
- Motion (only under `html.motion-ok`; nothing moves with reduced motion):
  - hero headline words rise out of line masks, 60ms apart;
  - the desk grid cycles a highlight (orange edge bar, tint, live dot) every 2.4s, pausing on hover or focus;
  - promise figures count up;
  - each section's hairline draws in from the left, the number rises, then the title and subtitle follow;
  - cards lift 3px on hover.

## v5.0 Workspace, client portal, public pages, database

See `docs/WORKSPACE.md` for the internal system, access levels, database structure and how to go live.
New public pages: /services and /services/:slug, /markets and /markets/:code, /team, /privacy, /terms, /disclaimer;
articles now live at /insights/:slug and are written in the workspace. The footer gains a "Firm" column with these
and the client & team sign-in.

## v5.1 Printer back in the hero

The receipt printer and route picker return to the hero, printer on the left as chosen in v3.8. The text, the route
picker and the two buttons sit on the right. The desk grid becomes a full-width strip under the hero (six markets in one
row from 1024px, with the cycling highlight), followed by the four promises. The "Try a route" section becomes
"Why exports stall": the three failure modes as numbered cards.

## v5.2 Scroll story and file markers (inspiration: human-md.ai)

What we took from human-md.ai: copy that builds line by line as you scroll inside a pinned stage, one giant word per
beat, full-bleed colour scenes, typewriter-mono "file" markers, a travelling dot, and a mono "scroll" pill.

- `src/components/home/ScrollStory.tsx`, straight after the hero (`#route`). Three beats:
  - sand, "…stuck at the **PORT.**";
  - deep teal, "…owns your **BRAND.**";
  - orange, "…still pay the full **DUTY.**".

  It closes on ink: "We close all three before the goods leave." with the call button. Lines step in at scroll
  thresholds; the giant word (Sora 800, up to 300px) is scrubbed by scroll out of a mask. A mono `§ 00 why exports
  stall` marker, a beat counter (01 / 03), a pulsing orange dot, and a scroll pill with a progress rail.
- Reduced motion: a static stacked version. Screen readers: a plain text list.
- The header shows the current home section as a mono marker (`§ services`) next to the wordmark from 1280px; the
  header button also steps aside while the story is pinned.

## v5.3 Hero rebuilt as a room (after human-md.ai); one button finish everywhere

Kept from before: the calculator (ClearancePrinter, now with a `bare` mode without its painted card) and the tactile
pill button finish. Everything else in the hero is new (`src/components/home/HeroStage.tsx`).

- **The room.** A full-bleed orange wall (with grain), a sand floor (28% of the height) and an orange skirting line.
  Fixed scene colours in both themes.
- **The word.** A giant **Cleared** (Sora 800, up to 232px, cream) with a teal dot, then *to sell.* in Newsreader italic.
  On phones and tablets the word never breaks; "to sell." takes the next line.
- **The set.** The calculator stands in front of the word, like the figure in front of "HUMAN.md". Crates
  (FRAGILE, MEL → PKG) sit mid-floor, and a teal shipping container and a potted palm sit on the right. The
  calculator is zoomed to 0.86 and set lower at 1024–1365px so "to sell." still reads.
- **The copy.** A mono `§ export law for small brands · asean` marker, a serif lede, "try a route →" with the route
  picker (selected key is a raised pill), and two tactile buttons.
- **The floor.** Three mono notes that type themselves, a scroll pill, and a live Singapore clock with a "desk open"
  dot.
- **Motion** (only when allowed):
  - letters drop in with a spring, the dot pops, and the serif slides in;
  - props rise in and the container slides in from the right;
  - the palm sways and the notes type;
  - the scene shifts with the mouse (each prop by its own depth) and drifts as you scroll.
- **One button finish everywhere:**
  - "on" states are the orange filled pill (`btn-filled`), "off" states the raised cream pill (`btn-raised`), both
    with `btn-lift`;
  - this covers workspace filters and chips, the insights filter chips and pagination, the dashboard
    shipment-size toggle, the contact "stage" choice, the timeline visibility switch, the task "show to client"
    toggle and the mobile sign-in link.

## v5.4 Hero finish pass

Feedback: the idea is right, the finish isn't. Fixes:
- **Lit props** (`src/components/home/heroProps.tsx`), all lit from the upper left:
  - crates in three-quarter view with plank shading, grain, corner battens, nails and a painted stencil;
  - a 20ft container with a door end in perspective, corrugated ribs, rails, corner castings and its markings in view;
  - a plant with two-tone veined leaves and a glazed pot.
- **Grounding.** The calculator rests on two stacked crates and its receipt drapes down their front. Every object has
  a soft shadow thrown up-right onto the wall and a contact shadow on the floor. Objects stand at different depths:
  container behind, crates in the middle, plant in front.
- **Room light.** Window light across the wall (soft-light), a vignette, a shadow where wall meets floor (the orange
  skirting line is gone), a lit floor, and a soft cast shadow on the giant word.
- **Composition.**
  - The Singapore clock moves to the top row beside the section marker, and the scroll pill is centred.
  - The container's label sits on its visible half.
  - Mid-size desktops zoom the set to 0.8, so "to sell." stays clear.
  - The tablet/phone set is shorter, so there's no empty band.
- **Motion.** The bottom crate rises, the top crate drops onto it, and the shadows fade in after them.

## v5.5–v5.6 Upright hero phrase, pill nav, and a site-wide polish pass

- **Hero:** "to sell." is upright: Sora 600, half the size of "Cleared", in deep ink. No italics anywhere on the site.
- **Top bar:** the active section is a raised pill (the btn-raised finish) and nav items get a soft pill on hover. The
  mono section marker only shows from 1440px, because it collided with the nav at 1024–1280.
- **Polish pass:** five sub-agents each owned a separate area and worked in their own branch. Each branch was reviewed
  from before/after screenshots at 390/820/1440 in light and dark, then merged.
  - Our desk / Services / How it works: equal-height cards with pinned footers; the pricing strip is on the 12-column
    grid.
  - Markets / Readiness / Glance: tactile pills in the markets panel; numbered readiness rows with a six-segment
    meter; dashboard widgets with +/× hints.
  - Results / Insights / FAQ / Contact / Footer: one form-field family with clear errors; FAQ pill toggles; footer
    columns aligned.
  - Inner pages (`src/styles/polish-pages.css`): one page-top rhythm; article reading typography with the contents
    list in the left margin; equal-height cards; numbered legal sections.
  - Workspace / portal / sign-in (`src/workspace/workspace.css`):
    - one page header, toolbar, field family, tactile Chip and TabBar, designed empty states;
    - a fix for task-status changes not refreshing the board (copy-on-read in `kit.tsx`).
- **Follow-ups:**
  - the call-to-action panel keeps an edge in dark mode;
  - article cards link to `/insights/:slug`.
