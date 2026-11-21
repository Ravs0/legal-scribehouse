import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Check } from 'lucide-react';
import { can, isFeeEarner } from '../access';
import { repo } from '../data';
import { ArticleBadge, Avatar, DueLabel, Empty, EnquiryBadge, fmtAgo, PageHead, Panel, Stat, StageBadge, useAction, useMatters, useMe, usePeople } from '../components/kit';

const Overview = () => {
  const me = useMe();
  const act = useAction();
  const matters = useMatters();
  const people = usePeople();
  const myTasks = useQuery({ queryKey: ['tasks', 'mine'], queryFn: () => repo.listTasks({ assigneeId: me.id, openOnly: true }), enabled: isFeeEarner(me.role) });
  const updates = useQuery({ queryKey: ['updates', 'recent'], queryFn: () => repo.listUpdates(undefined, 8), enabled: isFeeEarner(me.role) });
  const enquiries = useQuery({ queryKey: ['enquiries'], queryFn: () => repo.listEnquiries(), enabled: can.seeEnquiries(me) });
  const articles = useQuery({ queryKey: ['articles'], queryFn: () => repo.listArticles(), enabled: can.writeArticles(me) });

  const nameOf = (id?: string) => people.data?.find((p) => p.id === id)?.name ?? '—';
  const matterOf = (id: string) => matters.data?.find((m) => m.id === id);
  const open = (matters.data ?? []).filter((m) => m.stage !== 'completed' && m.stage !== 'closed');
  const tasks = (myTasks.data ?? []).sort((a, b) => (a.due_date ?? '9').localeCompare(b.due_date ?? '9'));
  const dueSoon = tasks.filter((t) => t.due_date && new Date(`${t.due_date}T23:59`).getTime() - Date.now() < 7 * 86_400_000).length;
  const newEnq = (enquiries.data ?? []).filter((e) => e.status === 'new');
  const inReview = (articles.data ?? []).filter((a) => a.status === 'in_review');
  const hour = new Date().getHours();

  return (
    <div className="space-y-6">
      <PageHead title={`Good ${hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening'}, ${me.name.split(' ')[0]}.`} sub="What needs you today." />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {isFeeEarner(me.role) && <Stat label="My open tasks" value={tasks.length} hint={`${dueSoon} due within 7 days`} />}
        {isFeeEarner(me.role) && <Stat label="Open matters" value={open.length} hint={`${open.filter((m) => m.stage.startsWith('waiting')).length} waiting on someone`} />}
        {can.seeEnquiries(me) && <Stat label="New enquiries" value={newEnq.length} hint="from the website" />}
        {can.writeArticles(me) && <Stat label="Articles in review" value={inReview.length} hint={can.publishArticles(me) ? 'waiting for you to publish' : 'waiting for a partner'} />}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        {isFeeEarner(me.role) && (
          <Panel title="My tasks" action={<Link to="/workspace/matters" className="type-label-sm text-primary-ink">All matters</Link>}>
            {tasks.length === 0 ? (
              <Empty>Nothing assigned to you. Nice.</Empty>
            ) : (
              <ul className="divide-y divide-border">
                {tasks.slice(0, 8).map((t) => {
                  const m = matterOf(t.matter_id);
                  return (
                    <li key={t.id} className="flex items-center gap-3 px-4 py-3">
                      <button
                        type="button"
                        aria-label={`Mark "${t.title}" done`}
                        onClick={() => act(() => repo.updateTask(t.id, { status: 'done' }), 'Task done')}
                        className="check-well flex h-5 w-5 shrink-0 items-center justify-center rounded-[5px] text-transparent hover:text-muted-foreground"
                      >
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      </button>
                      <div className="min-w-0 flex-1">
                        <p className="type-body-md truncate">{t.title}</p>
                        {m && (
                          <Link to={`/workspace/matters/${m.id}`} className="type-label-sm text-muted-foreground hover:text-primary-ink">
                            {m.reference} · {m.title}
                          </Link>
                        )}
                      </div>
                      <span className="type-label-sm shrink-0">
                        <DueLabel date={t.due_date} />
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>
        )}

        {isFeeEarner(me.role) && (
          <Panel title="Latest on your matters">
            {(updates.data ?? []).length === 0 ? (
              <Empty>No updates yet.</Empty>
            ) : (
              <ul className="divide-y divide-border">
                {(updates.data ?? []).map((u) => {
                  const m = matterOf(u.matter_id);
                  return (
                    <li key={u.id} className="flex gap-3 px-4 py-3">
                      <Avatar name={nameOf(u.author_id)} />
                      <div className="min-w-0 flex-1">
                        <p className="type-label-sm text-muted-foreground">
                          {nameOf(u.author_id)} · {fmtAgo(u.created_at)}
                          {u.visibility === 'client' && <span className="text-tertiary"> · shared with client</span>}
                        </p>
                        <p className="type-body-sm mt-0.5 line-clamp-2">{u.body}</p>
                        {m && <Link to={`/workspace/matters/${m.id}`} className="type-label-sm text-primary-ink">{m.reference}</Link>}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>
        )}

        {can.seeEnquiries(me) && (
          <Panel title="Website enquiries" action={<Link to="/workspace/enquiries" className="type-label-sm text-primary-ink">Open inbox</Link>}>
            {(enquiries.data ?? []).filter((e) => e.status !== 'declined' && e.status !== 'converted').length === 0 ? (
              <Empty>Inbox clear.</Empty>
            ) : (
              <ul className="divide-y divide-border">
                {(enquiries.data ?? []).filter((e) => e.status !== 'declined' && e.status !== 'converted').slice(0, 5).map((e) => (
                  <li key={e.id} className="flex items-center gap-3 px-4 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="type-label-lg truncate">{e.company || e.name}</p>
                      <p className="type-body-sm truncate text-muted-foreground">{e.message}</p>
                    </div>
                    <EnquiryBadge status={e.status} />
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        )}

        {can.writeArticles(me) && (
          <Panel title="Articles" action={<Link to="/workspace/articles" className="type-label-sm text-primary-ink">All articles</Link>}>
            <ul className="divide-y divide-border">
              {(articles.data ?? []).slice(0, 5).map((a) => (
                <li key={a.id} className="flex items-center gap-3 px-4 py-3">
                  <Link to={`/workspace/articles/${a.id}`} className="type-body-md min-w-0 flex-1 truncate hover:text-primary-ink">{a.title}</Link>
                  <ArticleBadge status={a.status} />
                </li>
              ))}
            </ul>
          </Panel>
        )}

        {isFeeEarner(me.role) && (
          <Panel title="Open matters" className="lg:col-span-2">
            {open.length === 0 ? (
              <Empty>No open matters.</Empty>
            ) : (
              <ul className="divide-y divide-border">
                {open.slice(0, 6).map((m) => (
                  <li key={m.id}>
                    <Link to={`/workspace/matters/${m.id}`} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 hover:bg-foreground/[0.03]">
                      <span className="type-mono-md text-muted-foreground">{m.reference}</span>
                      <span className="type-label-lg min-w-0 flex-1">{m.title}</span>
                      <StageBadge stage={m.stage} />
                      <span className="type-label-sm w-24 text-right"><DueLabel date={m.due_date} /></span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        )}
      </div>
    </div>
  );
};

export default Overview;
