import { ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { repo } from '../data';
import type { ContentStatus, EnquiryStatus, Person, Stage, TaskStatus } from '../types';
import { STAGE_LABEL } from '../types';
import { ROLE_LABEL } from '../access';
import { useSession } from '../session';

/* ---------- Data hooks (react-query; keys are invalidated after every write) ---------- */
export const usePeople = () => useQuery({ queryKey: ['people'], queryFn: () => repo.listPeople() });
export const useClients = () => useQuery({ queryKey: ['clients'], queryFn: () => repo.listClients() });
export const useMatters = () => useQuery({ queryKey: ['matters'], queryFn: () => repo.listMatters() });
export const useFees = () => useQuery({ queryKey: ['fees'], queryFn: () => repo.listFees() });

export const useRefresh = () => {
  const qc = useQueryClient();
  return () => qc.invalidateQueries();
};

/** Runs a write, shows the error as a toast, refreshes every query on success. */
export const useAction = () => {
  const refresh = useRefresh();
  return async <T,>(fn: () => Promise<T>, success?: string): Promise<T | undefined> => {
    try {
      const out = await fn();
      if (success) toast.success(success);
      await refresh();
      return out;
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Something went wrong.');
      return undefined;
    }
  };
};

export const useMe = () => useSession((s) => s.user) as Person;

/* ---------- Formatting ---------- */
export const fmtDate = (d?: string) =>
  d ? new Date(d.length === 10 ? `${d}T00:00:00` : d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
export const fmtShort = (d?: string) =>
  d ? new Date(d.length === 10 ? `${d}T00:00:00` : d).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) : '—';
export const fmtAgo = (d: string) => {
  const s = (Date.now() - new Date(d).getTime()) / 1000;
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.round(s / 60)} min ago`;
  if (s < 86400) return `${Math.round(s / 3600)} h ago`;
  if (s < 86400 * 7) return `${Math.round(s / 86400)} d ago`;
  return fmtDate(d);
};
export const fmtMoney = (n: number | null | undefined, cur = 'SGD') =>
  n == null ? '—' : new Intl.NumberFormat(undefined, { style: 'currency', currency: cur, maximumFractionDigits: 0 }).format(n);
export const daysUntil = (d?: string) => (d ? Math.ceil((new Date(`${d}T23:59:59`).getTime() - Date.now()) / 86_400_000) : null);
export const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('');

/* ---------- Badges ---------- */
const STAGE_TONE: Record<Stage, 'secondary' | 'default' | 'tertiary' | 'warning' | 'success' | 'outline'> = {
  intake: 'secondary', scoping: 'tertiary', in_progress: 'default', waiting_client: 'warning', waiting_authority: 'warning', completed: 'success', closed: 'outline',
};
export const StageBadge = ({ stage }: { stage: Stage }) => <Badge variant={STAGE_TONE[stage]}>{STAGE_LABEL[stage]}</Badge>;

const TASK_TONE: Record<TaskStatus, 'secondary' | 'default' | 'destructive' | 'success'> = { todo: 'secondary', doing: 'default', blocked: 'destructive', done: 'success' };
export const TASK_LABEL: Record<TaskStatus, string> = { todo: 'To do', doing: 'Doing', blocked: 'Blocked', done: 'Done' };
export const TaskBadge = ({ status }: { status: TaskStatus }) => <Badge variant={TASK_TONE[status]}>{TASK_LABEL[status]}</Badge>;

export const ENQUIRY_LABEL: Record<EnquiryStatus, string> = { new: 'New', contacted: 'Contacted', call_booked: 'Call booked', converted: 'Converted', declined: 'Declined' };
const ENQ_TONE: Record<EnquiryStatus, 'default' | 'tertiary' | 'warning' | 'success' | 'outline'> = { new: 'default', contacted: 'tertiary', call_booked: 'warning', converted: 'success', declined: 'outline' };
export const EnquiryBadge = ({ status }: { status: EnquiryStatus }) => <Badge variant={ENQ_TONE[status]}>{ENQUIRY_LABEL[status]}</Badge>;

export const ARTICLE_LABEL: Record<ContentStatus, string> = { draft: 'Draft', in_review: 'In review', scheduled: 'Scheduled', published: 'Published', archived: 'Archived' };
const ART_TONE: Record<ContentStatus, 'secondary' | 'warning' | 'tertiary' | 'success' | 'outline'> = { draft: 'secondary', in_review: 'warning', scheduled: 'tertiary', published: 'success', archived: 'outline' };
export const ArticleBadge = ({ status }: { status: ContentStatus }) => <Badge variant={ART_TONE[status]}>{ARTICLE_LABEL[status]}</Badge>;

export const RoleBadge = ({ role }: { role: Person['role'] }) => (
  <Badge variant={role === 'owner' || role === 'partner' ? 'default' : role === 'client' ? 'tertiary' : 'secondary'}>{ROLE_LABEL[role]}</Badge>
);

export const Avatar = ({ name, className }: { name: string; className?: string }) => (
  <span aria-hidden="true" className={cn('icon-well type-label-sm inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-primary-ink', className)}>
    {initials(name)}
  </span>
);

export const DueLabel = ({ date, done }: { date?: string; done?: boolean }) => {
  const n = daysUntil(date);
  if (n === null) return <span className="text-muted-foreground">No date</span>;
  const tone = done ? 'text-muted-foreground' : n < 0 ? 'text-destructive' : n <= 3 ? 'text-warning' : 'text-muted-foreground';
  return <span className={cn('tabular', tone)}>{done ? fmtShort(date) : n < 0 ? `${-n} d overdue` : n === 0 ? 'Today' : n === 1 ? 'Tomorrow' : fmtShort(date)}</span>;
};

/* ---------- Layout bits ---------- */
export const PageHead = ({ title, sub, actions }: { title: ReactNode; sub?: ReactNode; actions?: ReactNode }) => (
  <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5">
    <div className="min-w-0">
      <h1 className="type-headline-md">{title}</h1>
      {sub && <p className="type-body-md mt-1 text-muted-foreground">{sub}</p>}
    </div>
    {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
  </div>
);

export const Panel = ({ title, action, children, className }: { title?: ReactNode; action?: ReactNode; children: ReactNode; className?: string }) => (
  <section className={cn('surface-1 rounded-[12px]', className)}>
    {(title || action) && (
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <h2 className="type-title-sm">{title}</h2>
        {action}
      </div>
    )}
    {children}
  </section>
);

export const Empty = ({ children }: { children: ReactNode }) => (
  <p className="type-body-sm px-4 py-8 text-center text-muted-foreground">{children}</p>
);

export const Stat = ({ label, value, hint }: { label: string; value: ReactNode; hint?: ReactNode }) => (
  <div className="surface-1 rounded-[12px] px-4 py-4">
    <p className="type-body-sm text-muted-foreground">{label}</p>
    <p className="type-stat mt-1 text-[34px] text-primary-ink">{value}</p>
    {hint && <p className="type-label-sm mt-1 text-muted-foreground">{hint}</p>}
  </div>
);

/** Native select styled as a field (keeps forms simple and accessible). */
export const NativeSelect = ({ className, ...p }: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select {...p} className={cn('recessed type-body-sm h-9 rounded-[8px] px-2.5 text-foreground', className)} />
);

export const Field = ({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) => (
  <label className="block">
    <span className="type-label-md mb-1.5 block">{label}</span>
    {children}
    {hint && <span className="type-label-sm mt-1 block text-muted-foreground">{hint}</span>}
  </label>
);
