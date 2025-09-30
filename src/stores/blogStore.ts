import { create } from 'zustand';
import { ContentItem, Author } from '@/types/blog';
import { supabase } from '@/integrations/supabase/client';
import { sampleContent, sampleAuthors } from '@/data/sampleContent';

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
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ content: (data || []) as ContentItem[] });
    } catch (error) {
      console.error('Error fetching content:', error);
      // Fallback to sample data if fetch fails
      set({ content: sampleContent });
    } finally {
      set({ loading: false });
    }
  },

  fetchAuthors: async () => {
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