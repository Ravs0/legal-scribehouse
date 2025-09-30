import { create } from 'zustand';
import { ContentItem, Author } from '@/types/blog';
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
}

export const useBlogStore = create<BlogStore>((set, get) => ({
  content: sampleContent,
  authors: sampleAuthors,
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
}));