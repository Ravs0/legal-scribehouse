import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ContentItem, Author } from '@/types/blog';
import { sampleContent, sampleAuthors } from '@/data/sampleContent';

interface BlogStore {
  content: ContentItem[];
  authors: Author[];
  addContent: (item: ContentItem) => void;
  updateContent: (id: string, item: Partial<ContentItem>) => void;
  deleteContent: (id: string) => void;
  addAuthor: (author: Author) => void;
  updateAuthor: (id: string, author: Partial<Author>) => void;
  deleteAuthor: (id: string) => void;
  getContentByType: (type: ContentItem['type']) => ContentItem[];
  getContentByCategory: (category: string) => ContentItem[];
  getContentByAuthor: (authorId: string) => ContentItem[];
  searchContent: (query: string) => ContentItem[];
}

export const useBlogStore = create<BlogStore>()(
  persist(
    (set, get) => ({
      content: sampleContent as ContentItem[],
      authors: sampleAuthors,
      
      addContent: (item: ContentItem) =>
        set((state) => ({
          content: [...state.content, item],
        })),
      
      updateContent: (id: string, updates: Partial<ContentItem>) =>
        set((state) => ({
          content: state.content.map((item) =>
            item.id === id ? { ...item, ...updates } as ContentItem : item
          ),
        })),
      
      deleteContent: (id: string) =>
        set((state) => ({
          content: state.content.filter((item) => item.id !== id),
        })),
      
      addAuthor: (author: Author) =>
        set((state) => ({
          authors: [...state.authors, author],
        })),
      
      updateAuthor: (id: string, updates: Partial<Author>) =>
        set((state) => ({
          authors: state.authors.map((author) =>
            author.id === id ? { ...author, ...updates } : author
          ),
        })),
      
      deleteAuthor: (id: string) =>
        set((state) => ({
          authors: state.authors.filter((author) => author.id !== id),
        })),
      
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
    }),
    {
      name: 'cicero-blog-storage',
      version: 1,
    }
  )
);