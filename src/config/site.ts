/**
 * Single source of truth for brand details.
 * The company name is still undecided: change it here and it changes everywhere.
 * Other names considered: Landfall Counsel, Manifest & Seal, Tenfold Trade Advisory, Monsoon Passage.
 * None has been checked for trademarks or domains yet.
 */
export const SITE = {
  name: 'Straitline',
  descriptor: 'Trade Counsel',
  tagline: 'Clear passage into Southeast Asia.',
  description:
    'Export legal advisory for small businesses selling into Southeast Asia: market-entry structure, contracts, customs and FTAs, product registration, trademarks and disputes.',
  // TODO: replace placeholder contact details before launch.
  email: 'hello@example.com',
  phone: '+65 0000 0000',
  city: 'Singapore',
} as const;

export const SITE_TITLE = `${SITE.name} · ${SITE.descriptor}`;
