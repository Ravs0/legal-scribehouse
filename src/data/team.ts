/**
 * PLACEHOLDER TEAM. Replace every entry with real people (name, role, admissions, photo) before launch,
 * then set PLACEHOLDER = false to remove the "Sample" badge.
 * `photo` is a path under /public (e.g. '/team/partner.jpg'); leave undefined to show the neutral frame.
 */
export const PLACEHOLDER = true;

export interface Person {
  name: string;
  role: string;
  base: string;
  focus: string;
  admitted: string;
  photo?: string;
}

export const TEAM: Person[] = [
  { name: 'Partner name', role: 'Founding partner', base: 'Singapore', focus: 'Market entry and distributor contracts', admitted: 'Admitted in Singapore and New South Wales' },
  { name: 'Counsel name', role: 'Counsel', base: 'Singapore', focus: 'Customs, HS classification and FTAs', admitted: 'Former customs ruling officer' },
  { name: 'Associate name', role: 'Senior associate', base: 'Kuala Lumpur', focus: 'Product registration and trademarks', admitted: 'Admitted in Malaysia' },
];
