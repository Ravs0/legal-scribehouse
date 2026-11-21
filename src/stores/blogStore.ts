import { create } from 'zustand';
import { ContentItem, Author } from '@/types/blog';
import { supabase } from '@/integrations/supabase/client';
import { sampleAuthors } from '@/data/sampleContent';
import { repo } from '@/workspace/data';
import { STARTER_ARTICLES } from '@/workspace/data/articles';
import type { Article } from '@/workspace/types';

/** Workspace articles in the shape the public insights pages use. */
const toItem = (a: Article): ContentItem => ({
  id: a.id, title: a.title, summary: a.summary, content: a.content, type: a.type, categories: a.categories, tags: a.tags,
  authors: a.authors, draft: a.status !== 'published', reading_time: a.reading_time, published_at: a.published_at,
  created_at: a.published_at ?? a.created_at, updated_at: a.updated_at, slug: a.slug, markets: a.markets,
});

interface BlogStore {
  content: ContentItem[];
  authors: Author[];
  loading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  getFilteredContent: (type?: string, category?: string) => ContentItem[];
  getContentByType: (type: ContentItem['type']) => ContentItem[];
  getContentByCategory: (category: string) => ContentItem[];
  getContentByAuthor: (authorId: string) => ContentItem[];
  searchContent: (query: string) => ContentItem[];
  fetchContent: () => Promise<void>;
  fetchAuthors: () => Promise<void>;
}

export const useBlogStore = create<BlogStore>((set, get) => ({
  content: [],
  authors: [],
  loading: false,
  searchTerm: '',

  setSearchTerm: (term) => set({ searchTerm: term }),

  getFilteredContent: (type, category) => {
    const { content, searchTerm } = get();
    let filtered = content;

    if (type) {
      filtered = filtered.filter(item => item.type === type);
    }

    if (category) {
      filtered = filtered.filter(item => 
        item.categories.some(cat => cat.toLowerCase() === category.toLowerCase())
      );
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(term) ||
        item.summary.toLowerCase().includes(term) ||
        item.content.toLowerCase().includes(term) ||
        item.tags.some(tag => tag.toLowerCase().includes(term)) ||
        item.categories.some(cat => cat.toLowerCase().includes(term))
      );
    }

    return filtered.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  },

  getContentByType: (type: ContentItem['type']) => {
    const { content } = get();
    return content.filter((item) => item.type === type);
  },

  getContentByCategory: (category: string) => {
    const { content } = get();
    return content.filter((item) => 
      item.categories.includes(category)
    );
  },

  getContentByAuthor: (authorId: string) => {
    const { content } = get();
    return content.filter((item) => 
      item.authors.includes(authorId)
    );
  },

  searchContent: (query: string) => {
    const { content } = get();
    const lowercaseQuery = query.toLowerCase();
    return content.filter((item) => (
      item.title.toLowerCase().includes(lowercaseQuery) ||
      item.summary.toLowerCase().includes(lowercaseQuery) ||
      item.content.toLowerCase().includes(lowercaseQuery) ||
      item.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
      item.categories.some(cat => cat.toLowerCase().includes(lowercaseQuery))
    ));
  },

  fetchContent: async () => {
    set({ loading: true });
    try {
      // Published articles from whichever backend the workspace uses (demo or Supabase).
      const items = (await repo.listPublishedArticles()).map(toItem);
      set({ content: items });
    } catch (error) {
      console.error('Error fetching content:', error);
      // Backend unreachable: show the starter articles so the site never looks empty.
      set({ content: STARTER_ARTICLES.filter((a) => a.status === 'published').map(toItem) });
    } finally {
      set({ loading: false });
    }
  },

  fetchAuthors: async () => {
    // Demo backend: bylines come from the demo team.
    if (repo.mode === 'demo' && repo.demoPeople) {
      const now = new Date().toISOString();
      set({ authors: repo.demoPeople().filter((p) => p.role !== 'client').map((p) => ({ id: p.id, name: p.name, email: '', bio: p.title, created_at: now, updated_at: now })) });
      return;
    }
    set({ loading: true });
    try {
      // Use the secure function to get authors without email addresses
      const { data, error } = await supabase.rpc('get_authors_public');

      if (error) throw error;
      set({ authors: (data || []) as Author[] });
    } catch (error) {
      console.error('Error fetching authors:', error);
      // Fallback to sample data if fetch fails (but remove emails from sample data)
      const safeAuthors = sampleAuthors.map(({ email, ...author }) => ({
        ...author,
        email: '' // Provide empty email to satisfy type requirements
      }));
      set({ authors: safeAuthors });
    } finally {
      set({ loading: false });
    }
  },
}));