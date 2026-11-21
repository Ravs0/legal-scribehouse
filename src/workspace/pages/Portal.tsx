import { Link, Outlet, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Check, Circle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeKey } from '@/components/site/ThemeKey';
import { cn } from '@/lib/utils';
import { repo } from '../data';
import { MARKET_NAME, SERVICE_LABEL } from '../types';
import { useSession } from '../session';
import { DueLabel, Empty, fmtAgo, fmtDate, fmtMoney, Panel, StageBadge, useFees, useMatters, useMe, usePeople } from '../components/kit';
import { DemoBanner } from '../components/Shell';
import { Documents, Timeline } from './MatterDetail';

/** Client portal: their organisation's matters, shared milestones, shared updates and files, and a message box. */
export const PortalShell = () => {
  const me = useMe();
  const signOut = useSession((s) => s.signOut);
  const nav = useNavigate();
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <DemoBanner />
      <header className="border-b border-border bg-card/70">
        <div className="mx-auto flex h-16 max-w-[1040px] items-center justify-between gap-3 px-4 md:px-8">
          <Link to="/portal" className="flex items-center gap-2">
            <span aria-hidden="true" className="btn-filled flex h-7 w-7 items-center justify-center rounded-lg font-display text-[14px] font-semibold text-primary-foreground">S</span>
            <span className="font-display text-[16px] font-semibold tracking-[-0.02em]">Straitline</span>
            <span className="type-label-sm rounded-[5px] border border-border px-1.5 py-0.5 text-muted-foreground">Client portal</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeKey className="hidden scale-[0.85] sm:block" />
            <span className="type-label-md hidden text-muted-foreground md:inline">{me.name}</span>
            <Button variant="ghost" size="icon-sm" aria-label="Sign out" onClick={async () => { await signOut(); nav('/login'); }}><LogOut /></Button>
          </div>
        </div>
      </header>
      <main id="main" className="mx-auto w-full max-w-[1040px] flex-1 px-4 py-8 md:px-8">
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
    <div className="space-y-8">
      <div>
        <h1 className="type-headline-md">Hello, {me.name.split(' ')[0]}.</h1>
        <p className="type-body-md mt-1 text-muted-foreground">Your matters with Straitline, and everything we've shared with you.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {list.length === 0 && <Panel><Empty>No matters yet.</Empty></Panel>}
        {list.map((m) => {
          const fee = fees.data?.find((f) => f.matter_id === m.id);
          const lead = people.data?.find((p) => p.id === m.lead_id);
          return (
            <Link key={m.id} to={`/portal/matters/${m.id}`} className="surface-2 card-hover block rounded-[14px] p-5">
              <div className="flex items-start justify-between gap-3">
                <p className="type-mono-md text-muted-foreground">{m.reference}</p>
                <StageBadge stage={m.stage} />
              </div>
              <h2 className="type-title-lg mt-2">{m.title}</h2>
              <p className="type-body-sm mt-1 text-muted-foreground">{SERVICE_LABEL[m.service]} · {m.markets.map((c) => MARKET_NAME[c] ?? c).join(', ')}</p>
              <dl className="type-body-sm mt-4 grid grid-cols-3 gap-3 border-t border-border pt-3">
                <div><dt className="type-label-sm text-muted-foreground">Lead</dt><dd>{lead?.name ?? '—'}</dd></div>
                <div><dt className="type-label-sm text-muted-foreground">Target date</dt><dd><DueLabel date={m.due_date} done={m.stage === 'completed' || m.stage === 'closed'} /></dd></div>
                <div><dt className="type-label-sm text-muted-foreground">Fixed fee</dt><dd className="tabular">{fmtMoney(fee?.fee_amount, fee?.fee_currency)}</dd></div>
              </dl>
            </Link>
          );
        })}
      </div>
      <Panel title="Latest from the team">
        {(updates.data ?? []).length === 0 ? <Empty>Nothing new.</Empty> : (
          <ul className="divide-y divide-border">
            {(updates.data ?? []).map((u) => (
              <li key={u.id} className="px-4 py-3">
                <p className="type-label-sm text-muted-foreground">{people.data?.find((p) => p.id === u.author_id)?.name ?? 'Straitline'} · {fmtAgo(u.created_at)} · {list.find((m) => m.id === u.matter_id)?.reference}</p>
                <p className="type-body-sm mt-0.5">{u.body}</p>
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
  const bundle = useQuery({ queryKey: ['matter', id], queryFn: () => repo.getMatter(id) });
  const tasks = useQuery({ queryKey: ['tasks', id], queryFn: () => repo.listTasks({ matterId: id }) });
  if (bundle.isLoading) return <Empty>Loading…</Empty>;
  if (!bundle.data) return <Panel><Empty>We couldn't find that matter.</Empty></Panel>;
  const { matter: m, members } = bundle.data;
  const milestones = [...(tasks.data ?? [])].sort((a, b) => (a.due_date ?? '9').localeCompare(b.due_date ?? '9'));
  const fee = fees.data?.find((f) => f.matter_id === m.id);
  const all = people.data ?? [];
  const team = all.filter((p) => members.some((x) => x.user_id === p.id));

  return (
    <div className="space-y-6">
      <Link to="/portal" className="type-label-md inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Your matters</Link>
      <div className="border-b border-border pb-5">
        <div className="flex flex-wrap items-center gap-3">
          <p className="type-mono-md text-muted-foreground">{m.reference}</p>
          <StageBadge stage={m.stage} />
        </div>
        <h1 className="type-headline-md mt-1">{m.title}</h1>
        {m.summary && <p className="type-body-md mt-2 max-w-[64ch] text-muted-foreground">{m.summary}</p>}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-6">
          <Panel title="Milestones">
            {milestones.length === 0 ? <Empty>Milestones will appear here.</Empty> : (
              <ol className="divide-y divide-border">
                {milestones.map((t) => (
                  <li key={t.id} className="flex items-center gap-3 px-4 py-3">
                    {t.status === 'done'
                      ? <span className="flex h-6 w-6 items-center justify-center rounded-full bg-success text-white"><Check className="h-3.5 w-3.5" strokeWidth={3} aria-label="Done" /></span>
                      : <Circle className={cn('h-6 w-6', t.status === 'doing' ? 'text-primary' : 'text-muted-foreground/50')} aria-label={t.status === 'doing' ? 'In progress' : 'Not started'} />}
                    <span className={cn('type-body-md flex-1', t.status === 'done' && 'text-muted-foreground')}>{t.title}</span>
                    <span className="type-label-sm"><DueLabel date={t.due_date} done={t.status === 'done'} /></span>
                  </li>
                ))}
              </ol>
            )}
          </Panel>
          <section aria-labelledby="updates-title">
            <h2 id="updates-title" className="type-title-md mb-3">Updates and messages</h2>
            <Timeline matterId={m.id} people={all} asClient />
          </section>
        </div>
        <aside className="space-y-4">
          <Panel title="Your team">
            <ul className="divide-y divide-border">
              {team.map((p) => (
                <li key={p.id} className="px-4 py-3">
                  <p className="type-label-lg">{p.name}</p>
                  <p className="type-label-sm text-muted-foreground">{p.title}</p>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel title="Engagement">
            <dl className="type-body-sm divide-y divide-border">
              <div className="flex justify-between px-4 py-3"><dt className="text-muted-foreground">Fixed fee</dt><dd className="tabular">{fmtMoney(fee?.fee_amount, fee?.fee_currency)}</dd></div>
              <div className="flex justify-between px-4 py-3"><dt className="text-muted-foreground">Opened</dt><dd>{fmtDate(m.opened_at)}</dd></div>
              <div className="flex justify-between px-4 py-3"><dt className="text-muted-foreground">Target date</dt><dd><DueLabel date={m.due_date} /></dd></div>
            </dl>
          </Panel>
          <Documents matterId={m.id} people={all} canUpload asClient />
        </aside>
      </div>
    </div>
  );
};
