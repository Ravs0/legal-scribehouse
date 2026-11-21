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
  slug?: string;
  markets?: string[];
}

export interface LegalCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

// Topics for an ASEAN export practice (they match the workspace article editor).
export const LEGAL_CATEGORIES: LegalCategory[] = [
  { id: 'market-entry', name: 'Market entry', slug: 'market-entry' },
  { id: 'contracts', name: 'Contracts', slug: 'contracts' },
  { id: 'customs-ftas', name: 'Customs & FTAs', slug: 'customs-ftas' },
  { id: 'product-registration', name: 'Product registration', slug: 'product-registration' },
  { id: 'trademarks-ip', name: 'Trademarks & IP', slug: 'trademarks-ip' },
  { id: 'disputes', name: 'Disputes & payment risk', slug: 'disputes' },
];
