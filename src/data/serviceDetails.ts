/**
 * Long-form content for /services/:slug. Keyed by the ids in src/data/services.ts.
 * Placeholder commercial terms (timelines, what is included) must be confirmed by the firm before launch.
 */
export interface ServiceDetail {
  slug: string;
  /** Matching service code in the workspace (matters.service). */
  code: 'market-entry' | 'contracts' | 'customs-fta' | 'registration' | 'trademark-ip' | 'disputes';
  intro: string;
  forWho: string[];
  steps: { title: string; copy: string }[];
  youGet: string[];
  timeline: string;
  /** Article topic used to pull related insights. */
  topic: string;
}

export const SERVICE_DETAILS: Record<string, ServiceDetail> = {
  structure: {
    slug: 'market-entry-structure',
    code: 'market-entry',
    intro: 'Before you sign with anyone, decide how you will sell: through a distributor, an agent, or a company of your own. Each choice changes your tax, your liability and how much control you keep.',
    forWho: ['Brands choosing their first ASEAN market', 'Exporters with an offer from a distributor', 'Businesses outgrowing a distributor'],
    steps: [
      { title: 'Scoping call', copy: 'Product, volumes, markets and the offers already on the table.' },
      { title: 'Options compared', copy: 'Distributor, agent, licensing and own entity, side by side for your markets.' },
      { title: 'Recommendation', copy: 'One route, with the documents, registrations and costs it needs.' },
    ],
    youGet: ['Structure memo with a recommendation', 'Cost and timeline for the chosen route', 'List of the contracts and filings it needs'],
    timeline: 'Usually 1–2 weeks',
    topic: 'Market entry',
  },
  contracts: {
    slug: 'export-contracts',
    code: 'contracts',
    intro: 'Distribution, agency and supply agreements that say who does what, what happens if it goes wrong, and how you get paid. Written for your market, not copied from a template.',
    forWho: ['Exporters signing a first distributor', 'Brands renegotiating exclusivity or minimums', 'Anyone handed a counterparty’s template'],
    steps: [
      { title: 'Review or draft', copy: 'We review their draft or write yours, with the clauses that matter in that market.' },
      { title: 'Negotiate', copy: 'We explain each point in plain terms and handle the exchange with the other side.' },
      { title: 'Sign and file', copy: 'Clean signature copy, and a one-page summary of what you agreed.' },
    ],
    youGet: ['Signature-ready agreement', 'Plain-English summary of key terms', 'Diary of renewal and notice dates'],
    timeline: 'Usually 2–4 weeks including negotiation',
    topic: 'Contracts',
  },
  customs: {
    slug: 'customs-hs-codes-ftas',
    code: 'customs-fta',
    intro: 'The right tariff code at the destination, the permits that code triggers, and the lowest lawful duty, including free trade agreement rates you may not be claiming.',
    forWho: ['Exporters shipping to a new market', 'Businesses paying full duty on regional trade', 'Anyone whose goods were held at the border'],
    steps: [
      { title: 'Classify', copy: 'Tariff line for each product in each destination, with the reasoning written down.' },
      { title: 'Check origin', copy: 'Which agreement applies, whether you meet its rule, and what proof it needs.' },
      { title: 'Set up the file', copy: 'An origin file per product and market that your team can keep current.' },
    ],
    youGet: ['Classification and origin file per product', 'Permit and licence checklist', 'Advance ruling application where useful'],
    timeline: 'Usually 1–3 weeks',
    topic: 'Customs & FTAs',
  },
  registration: {
    slug: 'product-registration',
    code: 'registration',
    intro: 'Food, cosmetics, supplements and medical devices usually need a registration or notification before they can be sold. We map the requirement, choose the licence holder with you, and get it filed.',
    forWho: ['Cosmetics and personal care brands', 'Food, beverage and supplement makers', 'Medical device companies'],
    steps: [
      { title: 'Map', copy: 'What each product needs in each market, and who can hold the licence.' },
      { title: 'Prepare', copy: 'Dossier, labels and documents in the form the regulator expects.' },
      { title: 'File and follow up', copy: 'Submission, regulator queries and the final number or certificate.' },
    ],
    youGet: ['Registration roadmap', 'Licence-holder agreement that keeps control with you', 'Filed registrations and the issued numbers'],
    timeline: 'Weeks to months, depending on market and product',
    topic: 'Product registration',
  },
  ip: {
    slug: 'trademark-ip',
    code: 'trademark-ip',
    intro: 'Most ASEAN markets are first-to-file. We file your marks before you meet distributors, directly or through the Madrid system, and deal with objections along the way.',
    forWho: ['Brands entering any new market', 'Businesses whose mark was filed by someone else', 'Companies licensing their brand'],
    steps: [
      { title: 'Search', copy: 'Clearance searches in each target market.' },
      { title: 'File', copy: 'National filings or a Madrid designation, whichever is cheaper and safer.' },
      { title: 'Protect', copy: 'Responses to objections, watch notices and oppositions.' },
    ],
    youGet: ['Filing plan and budget', 'Filed applications', 'Registration certificates'],
    timeline: 'Filing in 1–2 weeks; registration takes months per office',
    topic: 'Trademarks & IP',
  },
  disputes: {
    slug: 'disputes-payment-risk',
    code: 'disputes',
    intro: 'Dispute clauses that work across borders, payment terms that protect a first order, and a plan for when a buyer stops paying.',
    forWho: ['Exporters with an unpaid invoice', 'Businesses agreeing terms with a new buyer', 'Anyone in a dispute with a distributor'],
    steps: [
      { title: 'Assess', copy: 'Your contract, your evidence and where you could enforce.' },
      { title: 'Act', copy: 'Demand letters, negotiation, and arbitration or court where it is worth it.' },
      { title: 'Prevent', copy: 'Payment terms and clauses for the next deal.' },
    ],
    youGet: ['Risk checklist for new buyers', 'Enforceable dispute clause', 'Recovery plan with costs'],
    timeline: 'Advice within days; recovery depends on the route',
    topic: 'Disputes & payment risk',
  },
};
