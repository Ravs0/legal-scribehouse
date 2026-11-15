# Site design: "The Manifest"

Marketing site for an export legal advisory serving small businesses selling into Southeast Asia (ASEAN).
Direction set by a design-advisor pass, then implemented in this repo.

## Concept
The site is a shipping document come alive: warm paper, ink, ruled ledger lines, mono field labels
(`[ 03 ] WHERE WE WORK ───`), and customs-stamp accents. The mono/ASCII layer gives it personality;
a confident serif gives it trust. Dark mode is the same document on a ship's bridge at night.

- **Type:** Fraunces (display), IBM Plex Sans (body), IBM Plex Mono (labels, ASCII).
- **Colour:** paper / ink / deep-sea teal, with a vermilion stamp accent (amber in dark mode). Tokens in `src/index.css`.
- **Shape:** near-square corners, 1px borders, no soft shadows; hover uses a hard offset "printed" shadow.

## Name
Undecided. Working placeholder: **Straitline · Trade Counsel**, "Clear passage into Southeast Asia."
Change it in **`src/config/site.ts`** and it changes everywhere.
Other candidates: Landfall Counsel, Manifest & Seal, Tenfold Trade Advisory, Monsoon Passage.
None has been checked for trademarks or domains.

## Signature moments
| Piece | Where | Notes |
|---|---|---|
| ASCII sea chart | `src/components/site/AsciiSeaChart.tsx` | Animated swell, dotted lanes drawn on load, a ship that sails to a port, port flashes `(*)`, a clearance line types out. 12fps, pauses off-screen. |
| Scramble/decode labels | `src/components/motion/ScrambleText.tsx` | Section labels, the hero's italic word, and the country code in the markets panel. |
| Customs stamps | `src/components/motion/Stamp.tsx` | Readiness verdict (HOLD / INSPECT / CLEARED), form success (RECEIVED), proof section. |
| Ticker | `src/components/motion/Ticker.tsx` | ATIGA, RCEP, CPTPP, Incoterms, HS, SIAC… |
| Reveal, count-up, process line | `src/components/motion/*`, `home/Process.tsx` | Once-only, subtle. |

All motion respects `prefers-reduced-motion` (static chart frame, no marquee, no transitions).
Decorative ASCII is `aria-hidden`.

## Homepage sections (`src/components/home/`)
Hero → Problem strip → Markets (interactive country explorer) → Services → Process →
Export readiness check (6 questions, prefills the contact form) → Proof → Insights teaser → FAQ → Contact.
The old blog is kept as the **Insights** area (`/insights`, `/posts`, `/guides`, …).

## Must confirm before launch
- [ ] **Market data** in `src/data/markets.ts` was drafted from general knowledge. Review it, then set `MARKETS_REVIEWED`. The "DRAFT" badge disappears once it is set.
- [ ] **Proof** stats and testimonials in `src/data/proof.ts` are samples. Replace them, then set `PLACEHOLDER = false`.
- [ ] **Contact details** in `src/config/site.ts` (currently `hello@example.com`).
- [ ] **Enquiry delivery:** `src/lib/enquiry.ts` opens a prefilled email (`mailto:`). Swap it for a real endpoint when one exists.
- [ ] **Regulatory wording:** the FAQ "licensed in every country" answer and the footer disclaimer depend on the firm's status. The copy avoids calling the firm a "law firm" or its people "lawyers".
- [ ] **Process durations** and the "reply within two working days" promise are placeholders.
- [ ] Blog categories in `src/types/blog.ts` are left over from the previous blog (e.g. SEBI, IBC). Consider export-focused ones.
