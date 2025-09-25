import { create } from 'zustand';
import { ContentItem, Author } from '@/types/blog';
import { supabase } from '@/integrations/supabase/client';

interface BlogStore {
  content: ContentItem[];
  authors: Author[];
  loading: boolean;
  error: string | null;
  fetchContent: () => Promise<void>;
  fetchAuthors: () => Promise<void>;
  addContent: (item: Omit<ContentItem, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateContent: (id: string, item: Partial<ContentItem>) => Promise<void>;
  deleteContent: (id: string) => Promise<void>;
  addAuthor: (author: Omit<Author, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateAuthor: (id: string, author: Partial<Author>) => Promise<void>;
  deleteAuthor: (id: string) => Promise<void>;
  getContentByType: (type: ContentItem['type']) => ContentItem[];
  getContentByCategory: (category: string) => ContentItem[];
  getContentByAuthor: (authorId: string) => ContentItem[];
  searchContent: (query: string) => ContentItem[];
}

export const useBlogStore = create<BlogStore>()((set, get) => ({
  content: [],
  authors: [],
  loading: false,
  error: null,

  fetchContent: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      set({ content: (data || []) as unknown as ContentItem[], loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchAuthors: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('authors')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      set({ authors: data || [], loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  addContent: async (item) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('content')
        .insert([item])
        .select()
        .single();
      
      if (error) throw error;
      
      set((state) => ({
        content: [data as unknown as ContentItem, ...state.content],
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateContent: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('content')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      set((state) => ({
        content: state.content.map((item) =>
          item.id === id ? data as unknown as ContentItem : item
        ),
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  deleteContent: async (id) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('content')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      set((state) => ({
        content: state.content.filter((item) => item.id !== id),
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  addAuthor: async (author) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('authors')
        .insert(author)
        .select()
        .single();
      
      if (error) throw error;
      
      set((state) => ({
        authors: [data, ...state.authors],
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateAuthor: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('authors')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      set((state) => ({
        authors: state.authors.map((author) =>
          author.id === id ? data : author
        ),
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  deleteAuthor: async (id) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('authors')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      set((state) => ({
        authors: state.authors.filter((author) => author.id !== id),
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  getContentByType: (type: ContentItem['type']) => {
    const { content } = get();
    return content.filter((item) => item.type === type && !item.draft);
  },

  getContentByCategory: (category: string) => {
    const { content } = get();
    return content.filter((item) => 
      item.categories.includes(category) && !item.draft
    );
  },

  getContentByAuthor: (authorId: string) => {
    const { content } = get();
    return content.filter((item) => 
      item.authors.includes(authorId) && !item.draft
    );
  },

  searchContent: (query: string) => {
    const { content } = get();
    const lowercaseQuery = query.toLowerCase();
    return content.filter((item) => {
      if (item.draft) return false;
      return (
        item.title.toLowerCase().includes(lowercaseQuery) ||
        item.summary.toLowerCase().includes(lowercaseQuery) ||
        item.content.toLowerCase().includes(lowercaseQuery) ||
        item.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
        item.categories.some(cat => cat.toLowerCase().includes(lowercaseQuery))
      );
    });
  },
}));