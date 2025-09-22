export interface Author {
  id: string;
  name: string;
  bio: string;
  photo?: string;
  links?: { label: string; url: string }[];
}

export interface BaseContent {
  id: string;
  title: string;
  date: string;
  summary: string;
  categories: string[];
  tags: string[];
  authors: string[];
  draft: boolean;
  content: string;
  slug: string;
}

export interface Post extends BaseContent {
  type: 'post';
}

export interface CaseDigest extends BaseContent {
  type: 'case';
  court: string;
  jurisdiction: string;
  citation: string;
  holding: string;
  rationale: string;
}

export interface StatuteNote extends BaseContent {
  type: 'statute';
  act: string;
  section: string;
  interpretation: string;
}

export interface Guide extends BaseContent {
  type: 'guide';
}

export interface Briefing extends BaseContent {
  type: 'briefing';
}

export type ContentItem = Post | CaseDigest | StatuteNote | Guide | Briefing;

export interface LegalCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export const LEGAL_CATEGORIES: LegalCategory[] = [
  { id: 'company-law', name: 'Company Law', slug: 'company-law' },
  { id: 'securities-sebi', name: 'Securities/SEBI', slug: 'securities-sebi' },
  { id: 'competition', name: 'Competition', slug: 'competition' },
  { id: 'ibc-bankruptcy', name: 'IBC/Bankruptcy', slug: 'ibc-bankruptcy' },
  { id: 'arbitration', name: 'Arbitration', slug: 'arbitration' },
  { id: 'tax', name: 'Tax', slug: 'tax' },
  { id: 'tech-privacy', name: 'Tech/Privacy', slug: 'tech-privacy' },
  { id: 'esg', name: 'ESG', slug: 'esg' },
  { id: 'international-law', name: 'International Law', slug: 'international-law' },
];