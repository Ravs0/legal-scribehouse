import { BookOpen, Compass, FileText, Gavel, Newspaper, type LucideIcon } from 'lucide-react';
import type { ContentItem } from '@/types/blog';

export const TYPE_META: Record<ContentItem['type'], { label: string; icon: LucideIcon; pair: [number, number] }> = {
  post: { label: 'Analysis', icon: FileText, pair: [1, 2] },
  guide: { label: 'Guide', icon: Compass, pair: [2, 3] },
  briefing: { label: 'Briefing', icon: Newspaper, pair: [1, 3] },
  case: { label: 'Case', icon: Gavel, pair: [3, 4] },
  statute: { label: 'Statute', icon: BookOpen, pair: [2, 4] },
};

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
