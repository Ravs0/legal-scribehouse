import { forwardRef, ReactNode } from 'react';
import { ChevronDown, Inbox, type LucideIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { repo } from '../data';
import type { ContentStatus, EnquiryStatus, Person, Stage, TaskStatus } from '../types';
import { STAGE_LABEL } from '../types';
import { ROLE_LABEL } from '../access';
import { useSession } from '../session';

/** The demo adapter mutates its stored rows in place, so react-query would see "no change" after a write. Copy rows on read. */
export const fresh = <T extends object>(p: Promise<T[]>) => p.then((rows) => rows.map((r) => ({ ...r })));

/* ---------- Data hooks (react-query; keys are invalidated after every write) ---------- */
export const usePeople = () => useQuery({ queryKey: ['people'], queryFn: () => fresh(repo.listPeople()) });
export const useClients = () => useQuery({ queryKey: ['clients'], queryFn: () => fresh(repo.listClients()) });
export const useMatters = () => useQuery({ queryKey: ['matters'], queryFn: () => fresh(repo.listMatters()) });
export const useFees = () => useQuery({ queryKey: ['fees'], queryFn: () => fresh(repo.listFees()) });

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
  <span aria-hidden="true" className={cn('icon-well type-meta inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-primary-ink', className)}>
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
/** One page header everywhere: title + sub on the left, actions on the right, 24px to the content below. */
export const PageHead = ({ title, sub, actions, eyebrow }: { title: ReactNode; sub?: ReactNode; actions?: ReactNode; eyebrow?: ReactNode }) => (
  <header className="flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
    <div className="min-w-0">
      {eyebrow && <p className="type-mono-md mb-1.5 text-muted-foreground">{eyebrow}</p>}
      <h1 className="type-headline-md">{title}</h1>
      {sub && <p className="type-body-md mt-1 max-w-[62ch] text-muted-foreground">{sub}</p>}
    </div>
    {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
  </header>
);

/** Filters and search sit in one row under the header. */
export const Toolbar = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn('flex flex-wrap items-center gap-2', className)}>{children}</div>
);

export const Panel = ({ title, action, children, className }: { title?: ReactNode; action?: ReactNode; children: ReactNode; className?: string }) => (
  <section className={cn('surface-1 min-w-0 rounded-[14px]', className)}>
    {(title || action) && (
      <div className="flex min-h-[52px] items-center justify-between gap-3 border-b border-border px-4 py-2.5">
        <h2 className="type-title-sm">{title}</h2>
        {action}
      </div>
    )}
    {children}
  </section>
);

/** Small link used in panel headers. */
export const PanelLink = ({ to, children }: { to: string; children: ReactNode }) => (
  <Link to={to} className="type-label-md rounded-full px-2 py-1 text-primary-ink hover:bg-primary/10">{children}</Link>
);

export const Empty = ({ children, icon: Icon = Inbox }: { children: ReactNode; icon?: LucideIcon }) => (
  <div className="flex flex-col items-center gap-2.5 px-4 py-10 text-center">
    <span className="icon-well inline-flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground">
      <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
    </span>
    <p className="type-body-sm max-w-[34ch] text-muted-foreground">{children}</p>
  </div>
);

/** Loading placeholder rows. */
export const Loading = ({ rows = 4 }: { rows?: number }) => (
  <div className="space-y-3 px-4 py-4" role="status" aria-label="Loading">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center gap-3">
        <div className="ws-skel h-8 w-8 shrink-0 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="ws-skel h-3.5 w-2/5" />
          <div className="ws-skel h-3 w-4/5" />
        </div>
      </div>
    ))}
  </div>
);

export const Stat = ({ label, value, hint }: { label: string; value: ReactNode; hint?: ReactNode }) => (
  <div className="surface-1 rounded-[14px] px-4 py-4">
    <p className="type-body-sm text-muted-foreground">{label}</p>
    <p className="type-stat mt-1 text-[34px] leading-none text-primary-ink">{value}</p>
    {hint && <p className="type-meta mt-2.5 text-muted-foreground">{hint}</p>}
  </div>
);

/* ---------- Fields: one family (40px, 10px radius, 14px text) ---------- */
export const TextInput = forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(({ className, ...p }, ref) => (
  <Input ref={ref} {...p} className={cn('h-10 rounded-[10px] px-3 text-[14px]', className)} />
));
TextInput.displayName = 'TextInput';

export const TextArea = forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(({ className, ...p }, ref) => (
  <Textarea ref={ref} {...p} className={cn('min-h-0 rounded-[10px] px-3 py-2.5 text-[14px] leading-6', className)} />
));
TextArea.displayName = 'TextArea';

/** Native select in the same field family as inputs. `className` goes on the wrapper (width, flex). */
export const NativeSelect = ({ className, compact, ...p }: React.SelectHTMLAttributes<HTMLSelectElement> & { compact?: boolean }) => (
  <span className={cn('relative inline-flex min-w-0', className)}>
    <select
      {...p}
      className={cn(
        'recessed w-full min-w-0 cursor-pointer appearance-none truncate rounded-[10px] pl-3 pr-8 text-[14px] text-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40',
        compact ? 'h-8 text-[13px]' : 'h-10',
      )}
    />
    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
  </span>
);

export const Field = ({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) => (
  <label className="block">
    <span className="type-label-md mb-1.5 block">{label}</span>
    {children}
    {hint && <span className="type-meta mt-1.5 block text-muted-foreground">{hint}</span>}
  </label>
);

/* ---------- Tactile chips and tabs ---------- */
export const chipClass = (on: boolean, size: 'sm' | 'md' = 'md') =>
  cn(
    'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full',
    size === 'md' ? 'type-label-md h-9 px-3.5' : 'type-meta h-7 px-2.5',
    on ? 'btn-filled btn-lift text-primary-foreground' : 'btn-raised btn-lift bg-card text-muted-foreground hover:text-foreground',
  );

export const Chip = ({ on, size = 'md', className, children, ...p }: { on: boolean; size?: 'sm' | 'md' } & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button type="button" aria-pressed={on} {...p} className={cn(chipClass(on, size), className)}>{children}</button>
);

/** Tabs: role=tab buttons. Active is the orange pill, inactive the raised pill. */
export const TabBar = ({ tabs, value, onChange, label }: { tabs: { id: string; label: ReactNode; count?: number }[]; value: string; onChange: (id: string) => void; label: string }) => (
  <div role="tablist" aria-label={label} className="flex flex-wrap gap-2">
    {tabs.map((t) => (
      <button key={t.id} role="tab" type="button" aria-selected={value === t.id} onClick={() => onChange(t.id)} className={chipClass(value === t.id)}>
        {t.label}
        {t.count !== undefined && <span className={cn('tabular type-meta', value === t.id ? 'opacity-75' : 'text-muted-foreground')}>{t.count}</span>}
      </button>
    ))}
  </div>
);
