import type { Article } from '../types';

/**
 * Starter articles. General information written for small exporters; reviewed wording should replace these
 * before launch where the firm wants its own voice. They deliberately avoid rates, thresholds and deadlines
 * that change: those belong in dated briefings.
 */
const d = (iso: string) => new Date(iso).toISOString();

export const STARTER_ARTICLES: Article[] = [
  {
    id: 'a-hs-codes',
    slug: 'finding-the-right-hs-code',
    title: 'Finding the right HS code for your destination',
    summary: 'Why the code you use at home can be wrong at the border, and how to check it before you book freight.',
    type: 'guide',
    status: 'published',
    categories: ['Customs & FTAs'],
    tags: ['HS codes', 'classification', 'customs'],
    markets: ['MY', 'ID', 'VN', 'TH', 'PH', 'SG'],
    authors: ['u-counsel'],
    created_by: 'u-counsel',
    reviewed_by: 'u-partner',
    reading_time: 6,
    published_at: d('2026-09-02'),
    created_at: d('2026-08-20'),
    updated_at: d('2026-09-02'),
    content: `The Harmonized System gives every traded product a six-digit code that is the same worldwide. After those six digits each country adds its own, and that is where most first shipments go wrong: the eight- or ten-digit code your forwarder used at home is not automatically the right one at the destination.

## Why the code matters

The tariff line decides three things at once:

- **The duty rate**, including whether a free trade agreement rate is available at all.
- **Whether the goods need a permit or registration** before they can be released.
- **Which agency looks at the goods** at the border, and what they will ask for.

A wrong code can mean paying too much duty, or paying too little and facing a reassessment, a penalty and goods held in storage while it is sorted out.

## How to check it before you ship

1. **Start from the product, not the invoice description.** Write down what it is made of, what it does and how it is packed for retail. Classification follows the General Interpretative Rules, which look at those facts in a fixed order.
2. **Agree the first six digits with your forwarder and your buyer.** If the three of you disagree at six digits, stop and resolve that first.
3. **Look up the national tariff for the destination.** Every ASEAN member publishes its tariff schedule; the ASEAN Harmonised Tariff Nomenclature (AHTN) keeps the first eight digits aligned across the region.
4. **Check for permits on that line.** Cosmetics, food, supplements and medical devices usually need product registration or a licence that is tied to the tariff line.
5. **Write the reasoning down.** A one-page note of why you chose the code is the first thing a customs officer, or we, will ask for.

## When to ask for a ruling

If the product sits between two headings (a cosmetic with a therapeutic claim, a snack that might be confectionery), ask the destination customs authority for an advance ruling. Most ASEAN customs administrations offer them; they take time, but they bind the authority and remove the argument from every future shipment.

> This guide is general information, not legal advice. Tariff lines and permit rules change; check the current schedule for your product and market before you ship.`,
  },
  {
    id: 'a-rules-of-origin',
    slug: 'rules-of-origin-without-the-jargon',
    title: 'Rules of origin, without the jargon',
    summary: 'How to tell whether your goods qualify for an FTA rate, and the paperwork that proves it.',
    type: 'guide',
    status: 'published',
    categories: ['Customs & FTAs'],
    tags: ['rules of origin', 'FTA', 'AANZFTA', 'RCEP', 'ATIGA'],
    markets: ['MY', 'ID', 'VN', 'TH', 'PH'],
    authors: ['u-counsel'],
    created_by: 'u-counsel',
    reviewed_by: 'u-partner',
    reading_time: 8,
    published_at: d('2026-09-23'),
    created_at: d('2026-09-10'),
    updated_at: d('2026-09-23'),
    content: `A free trade agreement only cuts your duty if your goods "originate" under that agreement's rules, and you can prove it. Many small exporters pay the full rate for years because nobody checked.

## Three questions decide it

1. **Is there an agreement between where you export from and where you sell?** For ASEAN markets the common ones are ATIGA (between ASEAN members), RCEP, AANZFTA (with Australia and New Zealand) and the CPTPP for some members.
2. **Does your product meet the rule for its tariff line?** Each agreement has product-specific rules. The usual tests are:
   - **Wholly obtained**: grown, mined or caught in the exporting country.
   - **Regional value content**: a set share of the value is added in the agreement's member countries.
   - **Change in tariff classification**: the imported materials change heading or chapter when you make the product.
3. **Can you prove it?** That means a certificate of origin or, under some agreements, a declaration by the exporter or producer, backed by cost and supplier records you keep for several years.

## Choosing between agreements

If more than one agreement covers the route, compare them line by line. The rates differ, the rules differ, and the paperwork differs. The cheapest rate is not always the right answer if you cannot meet its rule reliably on every shipment.

## What usually goes wrong

- The code used for the origin assessment is not the code on the import declaration.
- Supplier declarations are missing, so value content cannot be shown.
- A certificate is issued after the goods arrive and the importer did not claim the rate on entry.

## A simple routine

Keep a one-page origin file per product and market: the tariff line, the agreement, the rule, the calculation and the supporting documents. Review it whenever a supplier, recipe or price changes.

> General information, not legal advice. Agreements and product rules are updated; check the current text for your tariff line.`,
  },
  {
    id: 'a-distributor-clauses',
    slug: 'five-clauses-in-a-distributor-contract',
    title: 'Five clauses to check in a distributor contract',
    summary: 'Exclusivity, minimums, exit, trademark ownership and governing law: what to ask for and what to refuse.',
    type: 'guide',
    status: 'published',
    categories: ['Contracts'],
    tags: ['distribution', 'contracts', 'trademarks'],
    markets: ['MY', 'ID', 'VN', 'TH', 'PH', 'SG'],
    authors: ['u-partner'],
    created_by: 'u-partner',
    reviewed_by: 'u-partner',
    reading_time: 7,
    published_at: d('2026-10-14'),
    created_at: d('2026-10-01'),
    updated_at: d('2026-10-14'),
    content: `A first distributor often arrives with their own template. It will be written for them. These are the five clauses we read first.

## 1. Exclusivity

Exclusivity is valuable to a distributor, so trade it for something. Tie it to a defined territory and channel, and make it conditional on performance. Avoid open-ended exclusivity over "the region".

## 2. Minimum purchases

Ask for annual minimums that step up over time, and say what happens if they are missed: exclusivity falls away first, termination follows. Without minimums an exclusive distributor can sit on your brand.

## 3. Exit

Agree how either side can leave, what notice is needed, and what happens to stock, registrations and customer lists. In some markets local law protects distributors on termination; build that into the price of the deal rather than discovering it later.

## 4. Who owns the trademark and the registrations

Your trademark should be filed in your name in each market before you sign. Product registrations are often held by a local licence holder; the contract must oblige them to transfer or cancel on request. This is the clause that most often costs exporters their market.

## 5. Governing law and disputes

Choose the law and the forum deliberately. International arbitration (for example in Singapore) is common because awards are enforceable across ASEAN under the New York Convention. A court clause in a country where you have no presence may be cheap to sign and expensive to use.

## Before you sign

- Check the distributor's company records and who controls it.
- Make sure the price and payment terms match the Incoterm you agreed.
- Keep the signed copy, the annexes and any side letters in one place.

> General information, not legal advice. Local rules on distribution and termination differ by market.`,
  },
  {
    id: 'a-briefing-registration',
    slug: 'who-should-hold-your-product-registration',
    title: 'Who should hold your product registration?',
    summary: 'In several ASEAN markets a local entity must hold the licence. Here is how to keep control of it.',
    type: 'briefing',
    status: 'published',
    categories: ['Product registration'],
    tags: ['registration', 'licence holder', 'cosmetics', 'food'],
    markets: ['ID', 'MY', 'VN', 'TH', 'PH'],
    authors: ['u-associate'],
    created_by: 'u-associate',
    reviewed_by: 'u-partner',
    reading_time: 4,
    published_at: d('2026-10-28'),
    created_at: d('2026-10-20'),
    updated_at: d('2026-10-28'),
    content: `For cosmetics, food, supplements and medical devices, several ASEAN regulators only accept a registration or notification from a locally established company. That company becomes the licence holder, and in practice controls whether your product can be sold.

## Your options

- **Your distributor holds it.** Quick and cheap, but if the relationship ends the registration usually goes with them.
- **An independent licence holder holds it.** A neutral local company holds the registration for a fee and does not sell your product, so you can change distributors without re-registering.
- **Your own local entity holds it.** The most control, and the most cost. Usually worth it once volumes justify a presence.

## Whatever you choose

Put a written agreement in place before the filing: who owns the dossier and data, who pays renewals, and an obligation to transfer or cancel the registration on request.

> General information, not legal advice.`,
  },
  {
    id: 'a-analysis-first-shipment',
    slug: 'three-ways-a-first-shipment-goes-wrong',
    title: 'Three ways a first shipment goes wrong',
    summary: 'Stuck at the port, a brand registered by someone else, and duty paid that never needed paying.',
    type: 'post',
    status: 'published',
    categories: ['Market entry'],
    tags: ['first shipment', 'checklist'],
    markets: ['SG', 'MY', 'ID', 'VN', 'TH', 'PH'],
    authors: ['u-partner'],
    created_by: 'u-partner',
    reviewed_by: 'u-partner',
    reading_time: 5,
    published_at: d('2026-11-06'),
    created_at: d('2026-11-01'),
    updated_at: d('2026-11-06'),
    content: `Most problems we are asked to fix after a first shipment trace back to three gaps. None of them is expensive to close in advance.

## Stuck at the port

The goods were declared under the wrong tariff line, or under the right one without the permit that line requires. They sit in a bonded warehouse while storage charges add up and the paperwork is redone. **Fix in advance:** confirm the code and the permits for the destination (see our guide on HS codes).

## Brand registered by someone else

A distributor, or a stranger, files your trademark in the destination first. Most ASEAN markets are first-to-file, so the earlier filing usually wins. **Fix in advance:** file in each target market before you start talking to distributors, directly or through the Madrid system.

## Duty overpaid

The goods qualified for a lower rate under a free trade agreement, but no one claimed it, or the certificate of origin was not in order. **Fix in advance:** check origin once per product and market, and keep the file current.

> General information, not legal advice.`,
  },
  {
    id: 'a-draft-payment',
    slug: 'getting-paid-by-a-new-buyer',
    title: 'Getting paid by a new buyer in Southeast Asia',
    summary: 'Letters of credit, documentary collections and open account: which to use for a first order.',
    type: 'guide',
    status: 'in_review',
    categories: ['Disputes & payment risk'],
    tags: ['payment', 'letters of credit'],
    markets: ['VN', 'ID', 'PH'],
    authors: ['u-associate'],
    created_by: 'u-associate',
    reading_time: 4,
    created_at: d('2026-11-15'),
    updated_at: d('2026-11-18'),
    content: `Draft for review. A first order from a new buyer is the riskiest one you will ship.

## The options, safest first

1. **Payment in advance**
2. **Letter of credit**
3. **Documentary collection**
4. **Open account**, ideally with credit insurance

## What we suggest for a first order

Ask for a deposit and a letter of credit for the balance, then move to open account once the buyer has paid on time for a few orders.`,
  },
];
