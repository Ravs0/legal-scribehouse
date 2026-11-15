/**
 * Country snapshots for the "Where we work" section.
 * Written from general knowledge as a starting draft. The firm MUST review every line
 * against current sources before launch, then set MARKETS_REVIEWED to the review date.
 */
export const MARKETS_REVIEWED: string | null = null;

export interface Market {
  code: string;
  name: string;
  snapshot: string;
  regulators: string[];
  hurdles: string[];
  agreements: string[];
}

export const MARKETS: Market[] = [
  {
    code: 'SG',
    name: 'Singapore',
    snapshot: 'Most goods enter duty-free; GST applies on import. A common regional hub and contract seat.',
    regulators: ['Singapore Customs', 'HSA', 'SFA'],
    hurdles: ['Importer registration', 'Product-specific licences', 'Choosing who is importer of record'],
    agreements: ['ATIGA', 'RCEP', 'CPTPP'],
  },
  {
    code: 'MY',
    name: 'Malaysia',
    snapshot:
      'Permit and standards requirements vary widely by product; halal certification is commercially important for food and cosmetics.',
    regulators: ['Royal Malaysian Customs', 'NPRA', 'MDA', 'JAKIM'],
    hurdles: ['Import permits', 'Cosmetic notification', 'Halal recognition', 'Sales tax'],
    agreements: ['ATIGA', 'RCEP', 'CPTPP'],
  },
  {
    code: 'ID',
    name: 'Indonesia',
    snapshot:
      'Largest ASEAN market, and the most registration-heavy. Halal certification obligations are being phased in by product category.',
    regulators: ['Customs (DJBC)', 'BPOM', 'BPJPH'],
    hurdles: [
      'Local importer / licence holder',
      'BPOM registration lead times',
      'Halal',
      'Indonesian labelling',
      'SNI standards',
    ],
    agreements: ['ATIGA', 'RCEP'],
  },
  {
    code: 'TH',
    name: 'Thailand',
    snapshot: 'Established distributor market; many consumer products need Thai FDA licensing before import.',
    regulators: ['Thai Customs', 'Thai FDA', 'TISI'],
    hurdles: ['Local licence holder', 'Thai labelling', 'Foreign-ownership limits if you set up locally'],
    agreements: ['ATIGA', 'RCEP'],
  },
  {
    code: 'VN',
    name: 'Vietnam',
    snapshot: 'Fast-growing, with an unusually wide FTA network; documentation is scrutinised closely.',
    regulators: ['Vietnam Customs', 'Ministry of Health', 'Ministry of Industry and Trade'],
    hurdles: ['Product declarations', 'Vietnamese labelling', 'Origin paperwork', 'Early trademark filing'],
    agreements: ['ATIGA', 'RCEP', 'CPTPP'],
  },
  {
    code: 'PH',
    name: 'Philippines',
    snapshot: 'Product registrations are typically held by a locally licensed importer or distributor.',
    regulators: ['Bureau of Customs', 'FDA Philippines'],
    hurdles: [
      'Importer accreditation',
      'Licence to operate and product registration',
      'Who owns the registration',
    ],
    agreements: ['ATIGA', 'RCEP'],
  },
  {
    code: 'KH',
    name: 'Cambodia',
    snapshot: 'Smaller, distributor-led market, often served through a neighbouring hub.',
    regulators: ['General Department of Customs and Excise', 'Ministry of Commerce'],
    hurdles: ['Distributor due diligence', 'Valuation disputes', 'Trademark recordal'],
    agreements: ['ATIGA', 'RCEP'],
  },
  {
    code: 'LA',
    name: 'Laos',
    snapshot: 'Landlocked; goods usually transit via Thailand or Vietnam, so transit terms matter.',
    regulators: ['Lao Customs', 'Ministry of Industry and Commerce'],
    hurdles: ['Import licensing', 'Transit documents', 'Incoterms choice'],
    agreements: ['ATIGA', 'RCEP'],
  },
  {
    code: 'MM',
    name: 'Myanmar',
    snapshot:
      'Heightened risk. Import licensing, currency controls and international sanctions need case-by-case checks before any deal.',
    regulators: ['Myanmar Customs', 'Ministry of Commerce'],
    hurdles: ['Sanctions screening', 'Payment routes', 'Licence availability'],
    agreements: ['ATIGA', 'RCEP'],
  },
  {
    code: 'BN',
    name: 'Brunei',
    snapshot: 'Small, high-income market with strict halal and import-permit expectations for food.',
    regulators: ['Royal Customs and Excise', 'Halal authorities (MUIB)'],
    hurdles: ['Halal permits', 'Small-volume economics', 'Agent arrangements'],
    agreements: ['ATIGA', 'RCEP', 'CPTPP'],
  },
];
