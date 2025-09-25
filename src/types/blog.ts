export interface Author {
  id: string;
  name: string;
  email: string;
  bio?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ContentItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  type: 'post' | 'case' | 'statute' | 'guide' | 'briefing';
  categories: string[];
  tags: string[];
  authors: string[];
  draft: boolean;
  reading_time?: number;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

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