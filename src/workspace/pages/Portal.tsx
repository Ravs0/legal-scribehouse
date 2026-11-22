import { Link, Outlet, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Check, Flag, Inbox, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeKey } from '@/components/site/ThemeKey';
import { cn } from '@/lib/utils';
import { repo } from '../data';
import { MARKET_NAME, SERVICE_LABEL } from '../types';
import { useSession } from '../session';
import { Avatar, DueLabel, Empty, fmtAgo, fmtDate, fmtMoney, Loading, PageHead, Panel, StageBadge, useFees, useMatters, useMe, usePeople, fresh } from '../components/kit';
import { DemoBanner, Mark } from '../components/Shell';
import { Documents, Timeline } from './MatterDetail';

/** Client portal: their organisation's matters, shared milestones, shared updates and files, and a message box. */
export const PortalShell = () => {
  const me = useMe();
  const signOut = useSession((s) => s.signOut);
  const nav = useNavigate();
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <DemoBanner />
      <header className="sticky top-0 z-30 border-b border-border bg-card/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1040px] items-center justify-between gap-3 px-4 md:px-8">
          <Mark label="Client portal" to="/portal" />
          <div className="flex items-center gap-2">
            <ThemeKey className="hidden scale-[0.85] sm:block" />
            <span className="hidden items-center gap-2 pl-1 md:inline-flex"><Avatar name={me.name} className="h-8 w-8" /><span className="type-label-md">{me.name}</span></span>
            <Button variant="ghost" size="icon-sm" aria-label="Sign out" onClick={async () => { await signOut(); nav('/login'); }}><LogOut /></Button>
          </div>
        </div>
      </header>
      <main id="main" className="mx-auto w-full max-w-[1040px] flex-1 px-4 py-8 md:px-8 md:py-10">
        <Outlet />
      </main>
    </div>
  );
};

export const PortalHome = () => {
  const me = useMe();
  const matters = useMatters();
  const fees = useFees();
  const people = usePeople();
  const updates = useQuery({ queryKey: ['updates', 'recent'], queryFn: () => repo.listUpdates(undefined, 5) });
  const list = matters.data ?? [];
  return (
    <div className="space-y-6">
      <PageHead title={`Hello, ${me.name.split(' ')[0]}.`} sub="Your matters with Straitline, and everything we've shared with you." />
      <div className="grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-2">
        {matters.isLoading && <Panel className="md:col-span-2"><Loading rows={2} /></Panel>}
        {!matters.isLoading && list.length === 0 && <Panel className="md:col-span-2"><Empty>No matters yet.</Empty></Panel>}
        {list.map((m) => {
          const fee = fees.data?.find((f) => f.matter_id === m.id);
          const lead = people.data?.find((p) => p.id === m.lead_id);
          return (
            <Link key={m.id} to={`/portal/matters/${m.id}`} className="surface-2 card-hover group flex flex-col rounded-[16px] p-5">
              <div className="flex items-start justify-between gap-3">
                <p className="type-mono-md text-muted-foreground">{m.reference}</p>
                <StageBadge stage={m.stage} />
              </div>
              <h2 className="type-title-lg mt-2 group-hover:text-primary-ink">{m.title}</h2>
              <p className="type-body-sm mb-5 mt-1 text-muted-foreground">{SERVICE_LABEL[m.service]} · {m.markets.map((c) => MARKET_NAME[c] ?? c).join(', ')}</p>
              <dl className="type-body-sm mt-auto grid grid-cols-3 gap-3 border-t border-border pt-4 [&>div]:mt-0 [&>div]:min-w-0 [&_dd]:mt-0.5 [&_dd]:truncate">
                <div><dt className="type-meta text-muted-foreground">Lead</dt><dd>{lead?.name ?? '—'}</dd></div>
                <div><dt className="type-meta text-muted-foreground">Target date</dt><dd><DueLabel date={m.due_date} done={m.stage === 'completed' || m.stage === 'closed'} /></dd></div>
                <div><dt className="type-meta text-muted-foreground">Fixed fee</dt><dd className="tabular">{fmtMoney(fee?.fee_amount, fee?.fee_currency)}</dd></div>
              </dl>
            </Link>
          );
        })}
      </div>
      <Panel title="Latest from the team">
        {(updates.data ?? []).length === 0 ? <Empty icon={Inbox}>Nothing new.</Empty> : (
          <ul className="divide-y divide-border">
            {(updates.data ?? []).map((u) => (
              <li key={u.id} className="px-4 py-3.5">
                <p className="type-meta text-muted-foreground">{people.data?.find((p) => p.id === u.author_id)?.name ?? 'Straitline'} · {fmtAgo(u.created_at)} · {list.find((m) => m.id === u.matter_id)?.reference}</p>
                <p className="type-body-md mt-1">{u.body}</p>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
};

export const PortalMatter = () => {
  const { id = '' } = useParams();
  const people = usePeople();
  const fees = useFees();
  const bundle = useQuery({ queryKey: ['matter', id], queryFn: () => repo.getMatter(id).then((b) => (b ? { ...b, matter: { ...b.matter }, members: b.members.map((x) => ({ ...x })) } : b)) });
  const tasks = useQuery({ queryKey: ['tasks', id], queryFn: () => fresh(repo.listTasks({ matterId: id })) });
  if (bundle.isLoading) return <Panel><Loading rows={4} /></Panel>;
  if (!bundle.data) return <Panel><Empty>We couldn't find that matter.</Empty></Panel>;
  const { matter: m, members } = bundle.data;
  const milestones = [...(tasks.data ?? [])].sort((a, b) => (a.due_date ?? '9').localeCompare(b.due_date ?? '9'));
  const doneCount = milestones.filter((t) => t.status === 'done').length;
  const fee = fees.data?.find((f) => f.matter_id === m.id);
  const all = people.data ?? [];
  const team = all.filter((p) => members.some((x) => x.user_id === p.id));

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Link to="/portal" className="type-label-md -ml-1 inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-muted-foreground hover:bg-foreground/[0.05] hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Your matters</Link>
        <PageHead eyebrow={m.reference} title={<span className="flex flex-wrap items-center gap-x-3 gap-y-2">{m.title} <StageBadge stage={m.stage} /></span>} sub={m.summary} />
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-6">
          <Panel title="Milestones" action={milestones.length > 0 && <span className="type-meta tabular text-muted-foreground">{doneCount} of {milestones.length} complete</span>}>
            {milestones.length === 0 ? <Empty icon={Flag}>Milestones will appear here.</Empty> : (
              <div>
                <div className="px-4 pt-4"><div className="h-2 overflow-hidden rounded-full bg-foreground/10"><div className="h-full rounded-full bg-primary transition-[width] duration-500" style={{ width: `${Math.round((doneCount / milestones.length) * 100)}%` }} /></div></div>
                <ol className="px-4 py-2">
                  {milestones.map((t, i) => (
                    <li key={t.id} className="relative flex items-center gap-3 py-3">
                      {i < milestones.length - 1 && <span aria-hidden="true" className="absolute left-3 top-[calc(50%+12px)] h-full w-px bg-border" />}
                      {t.status === 'done'
                        ? <span className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success text-background"><Check className="h-3.5 w-3.5" strokeWidth={3} aria-label="Done" /></span>
                        : <span role="img" aria-label={t.status === 'doing' ? 'In progress' : 'Not started'} className={cn('relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 bg-card', t.status === 'doing' ? 'border-primary' : 'border-border')}>{t.status === 'doing' && <span className="h-2 w-2 rounded-full bg-primary" />}</span>}
                      <span className={cn('type-body-md min-w-0 flex-1', t.status === 'done' && 'text-muted-foreground')}>{t.title}</span>
                      <span className="type-meta shrink-0"><DueLabel date={t.due_date} done={t.status === 'done'} /></span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </Panel>
          <section aria-labelledby="updates-title">
            <h2 id="updates-title" className="type-title-md mb-4">Updates and messages</h2>
            <Timeline matterId={m.id} people={all} asClient />
          </section>
        </div>
        <aside className="min-w-0 space-y-4">
          <Panel title="Your team">
            <ul className="divide-y divide-border">
              {team.map((p) => (
                <li key={p.id} className="flex items-center gap-3 px-4 py-3">
                  <Avatar name={p.name} className="h-9 w-9" />
                  <div className="min-w-0">
                    <p className="type-label-lg truncate">{p.name}</p>
                    <p className="type-meta text-muted-foreground">{p.title}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel title="Engagement">
            <dl className="type-body-sm divide-y divide-border">
              <div className="flex items-center justify-between gap-3 px-4 py-3"><dt className="text-muted-foreground">Fixed fee</dt><dd className="tabular">{fmtMoney(fee?.fee_amount, fee?.fee_currency)}</dd></div>
              <div className="flex items-center justify-between gap-3 px-4 py-3"><dt className="text-muted-foreground">Opened</dt><dd>{fmtDate(m.opened_at)}</dd></div>
              <div className="flex items-center justify-between gap-3 px-4 py-3"><dt className="text-muted-foreground">Target date</dt><dd><DueLabel date={m.due_date} /></dd></div>
            </dl>
          </Panel>
          <Documents matterId={m.id} people={all} canUpload asClient />
        </aside>
      </div>
    </div>
  );
};
