import { FormEvent, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Eye, EyeOff, FileText, ListChecks, Lock, MessageSquareText, Plus, Send, Upload, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { can, canWorkMatter, isFeeEarner } from '../access';
import { repo } from '../data';
import {
  MARKET_NAME, SERVICE_LABEL, STAGE_LABEL, STAGES, type MatterMember, type MemberRole, type Person, type Task, type TaskStatus,
  type UpdateKind, type Visibility,
} from '../types';
import {
  Avatar, Chip, fresh, DueLabel, Empty, fmtAgo, fmtDate, fmtMoney, Loading, NativeSelect, PageHead, Panel, StageBadge, TabBar, TASK_LABEL, TextArea, TextInput, useAction, useFees, useMe, usePeople,
} from '../components/kit';

const KIND_LABEL: Record<UpdateKind, string> = { note: 'Note', filing: 'Filing', authority: 'Authority', stage: 'Stage', client_message: 'Client message' };

/* ---------- Timeline (used by the workspace and the portal) ---------- */
export const Timeline = ({ matterId, people, asClient }: { matterId: string; people: Person[]; asClient?: boolean }) => {
  const me = useMe();
  const act = useAction();
  const updates = useQuery({ queryKey: ['updates', matterId], queryFn: () => repo.listUpdates(matterId, 200) });
  const [body, setBody] = useState('');
  const [kind, setKind] = useState<UpdateKind>('note');
  const [visibility, setVisibility] = useState<Visibility>('internal');
  const who = (id: string) => people.find((p) => p.id === id);

  const post = async (e: FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    const ok = await act(() => repo.postUpdate({ matter_id: matterId, body: body.trim(), kind: asClient ? 'client_message' : kind, visibility: asClient ? 'client' : visibility }), asClient ? 'Message sent' : 'Update posted');
    if (ok) setBody('');
  };

  return (
    <div className="space-y-5">
      <form onSubmit={post} className="surface-1 rounded-[14px] p-3">
        <label htmlFor={`post-${matterId}`} className="sr-only">{asClient ? 'Message the team' : 'Post a work update'}</label>
        <TextArea
          id={`post-${matterId}`}
          rows={3}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={asClient ? 'Write to the team working on this matter…' : 'What happened? Filing made, authority replied, client chased…'}
          className="min-h-[88px] resize-y"
        />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
          {!asClient ? (
            <div className="flex flex-wrap items-center gap-2">
              <NativeSelect aria-label="Kind" value={kind} onChange={(e) => setKind(e.target.value as UpdateKind)}>
                {(['note', 'filing', 'authority'] as UpdateKind[]).map((k) => <option key={k} value={k}>{KIND_LABEL[k]}</option>)}
              </NativeSelect>
              <Chip
                on={false}
                onClick={() => setVisibility((v) => (v === 'internal' ? 'client' : 'internal'))}
                aria-pressed={visibility === 'client'}
                className={cn('h-10 px-4', visibility === 'client' && 'text-tertiary')}
              >
                {visibility === 'client' ? <Eye className="h-4 w-4" aria-hidden="true" /> : <EyeOff className="h-4 w-4" aria-hidden="true" />}
                {visibility === 'client' ? 'Client can see this' : 'Internal only'}
              </Chip>
            </div>
          ) : (
            <span className="type-meta text-muted-foreground">Your message goes to the team on this matter.</span>
          )}
          <Button type="submit" icon="trailing" disabled={!body.trim()}>
            {asClient ? 'Send' : 'Post update'} <Send />
          </Button>
        </div>
      </form>

      {updates.isLoading ? (
        <Loading rows={3} />
      ) : (updates.data ?? []).length === 0 ? (
        <Empty icon={MessageSquareText}>No updates yet.</Empty>
      ) : (
        <ol className="ws-line relative space-y-1">
          {(updates.data ?? []).map((u) => {
            const p = who(u.author_id);
            const mine = u.author_id === me.id;
            const shared = u.visibility === 'client';
            return (
              <li key={u.id} className="relative flex gap-3 py-1.5">
                <Avatar name={p?.name ?? '?'} className={cn('relative z-[1] h-8 w-8 ring-4 ring-background', p?.role === 'client' && 'text-tertiary')} />
                <div
                  className={cn(
                    'min-w-0 flex-1 rounded-[12px] px-4 py-3',
                    shared ? 'surface-1 border-l-2 border-l-tertiary' : 'border border-border bg-foreground/[0.03]',
                  )}
                >
                  <p className="type-meta flex flex-wrap items-center gap-x-2 gap-y-1 text-muted-foreground">
                    <span className="font-semibold text-foreground">{mine ? 'You' : (p?.name ?? 'Someone')}</span>
                    <span>{fmtAgo(u.created_at)}</span>
                    {!asClient && <Badge variant={u.kind === 'client_message' ? 'tertiary' : 'secondary'}>{KIND_LABEL[u.kind]}</Badge>}
                    {!asClient && (shared
                      ? <span className="inline-flex items-center gap-1 text-tertiary"><Eye className="h-3 w-3" aria-hidden="true" />Shared with client</span>
                      : <span className="inline-flex items-center gap-1"><Lock className="h-3 w-3" aria-hidden="true" />Internal</span>)}
                  </p>
                  <p className="type-body-md mt-1.5 whitespace-pre-line">{u.body}</p>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
};

/* ---------- Tasks ---------- */
const COLUMNS: TaskStatus[] = ['todo', 'doing', 'blocked', 'done'];

const Tasks = ({ matterId, people, canWork }: { matterId: string; people: Person[]; canWork: boolean }) => {
  const act = useAction();
  const tasks = useQuery({ queryKey: ['tasks', matterId], queryFn: () => fresh(repo.listTasks({ matterId })) });
  const [title, setTitle] = useState('');
  const [assignee, setAssignee] = useState('');
  const [due, setDue] = useState('');
  const [shared, setShared] = useState(false);
  const staff = people.filter((p) => isFeeEarner(p.role));

  const add = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const ok = await act(() => repo.createTask({ matter_id: matterId, title: title.trim(), status: 'todo', priority: 'normal', assignee_id: assignee || undefined, due_date: due || undefined, client_visible: shared }), 'Task added');
    if (ok) {
      setTitle('');
      setDue('');
      setShared(false);
    }
  };

  return (
    <div className="space-y-4">
      {canWork && (
        <form onSubmit={add} className="surface-1 space-y-2.5 rounded-[14px] p-3">
          <div className="flex flex-col gap-2 sm:flex-row">
            <TextInput aria-label="New task" placeholder="Add a task…" value={title} onChange={(e) => setTitle(e.target.value)} className="min-w-0 sm:flex-1" />
            <Button type="submit" icon="leading" disabled={!title.trim()}><Plus /> Add task</Button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <NativeSelect aria-label="Assignee" value={assignee} onChange={(e) => setAssignee(e.target.value)} className="w-full sm:w-[180px]">
              <option value="">Unassigned</option>
              {staff.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </NativeSelect>
            <TextInput aria-label="Due date" type="date" value={due} onChange={(e) => setDue(e.target.value)} className="w-full sm:w-[160px]" />
            <Chip on={shared} onClick={() => setShared((v) => !v)} className="h-10 px-4">
              {shared ? <Eye className="h-4 w-4" aria-hidden="true" /> : <EyeOff className="h-4 w-4" aria-hidden="true" />}
              Client milestone
            </Chip>
          </div>
        </form>
      )}
      <div className="grid grid-cols-[minmax(0,1fr)] gap-3 md:grid-cols-2 xl:grid-cols-4">
        {COLUMNS.map((col) => {
          const list = (tasks.data ?? []).filter((t) => t.status === col);
          return (
            <section key={col} className="min-w-0 rounded-[14px] border border-border bg-foreground/[0.025] p-2" aria-label={TASK_LABEL[col]}>
              <h3 className="type-label-md flex items-center gap-2 px-2 py-2">
                <span className={cn('h-2 w-2 rounded-full', COL_DOT[col])} aria-hidden="true" />
                {TASK_LABEL[col]}
                <span className="tabular type-meta ml-auto rounded-full bg-foreground/[0.07] px-2 py-0.5 text-muted-foreground">{list.length}</span>
              </h3>
              <ul className="space-y-2">
                {list.map((t) => (
                  <TaskCard key={t.id} task={t} people={people} canWork={canWork} onStatus={(s) => act(() => repo.updateTask(t.id, { status: s }))} onShare={() => act(() => repo.updateTask(t.id, { client_visible: !t.client_visible }))} />
                ))}
                {list.length === 0 && <li className="type-meta rounded-[10px] border border-dashed border-border px-3 py-5 text-center text-muted-foreground">Nothing here</li>}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
};

const COL_DOT: Record<TaskStatus, string> = { todo: 'bg-muted-foreground/60', doing: 'bg-primary', blocked: 'bg-destructive', done: 'bg-success' };

const TaskCard = ({ task: t, people, canWork, onStatus, onShare }: { task: Task; people: Person[]; canWork: boolean; onStatus: (s: TaskStatus) => void; onShare: () => void }) => {
  const owner = people.find((p) => p.id === t.assignee_id);
  return (
    <li className="surface-1 rounded-[12px] p-3">
      <p className={cn('type-label-lg', t.status === 'done' && 'font-medium text-muted-foreground line-through')}>{t.title}</p>
      <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1.5">
        <span className="type-meta"><DueLabel date={t.due_date} done={t.status === 'done'} /></span>
        {t.priority === 'high' && <Badge variant="destructive">High</Badge>}
        {t.client_visible && <Badge variant="tertiary">Milestone</Badge>}
      </div>
      <p className="type-meta mt-2 flex items-center gap-1.5 text-muted-foreground" title={owner?.name ?? 'Unassigned'}>
        {owner ? <Avatar name={owner.name} className="h-5 w-5 text-[9px]" /> : null}
        {owner?.name ?? 'Unassigned'}
      </p>
      {canWork && (
        <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
          <NativeSelect compact aria-label={`Status of ${t.title}`} value={t.status} onChange={(e) => onStatus(e.target.value as TaskStatus)} className="flex-1">
            {COLUMNS.map((c) => <option key={c} value={c}>{TASK_LABEL[c]}</option>)}
          </NativeSelect>
          <button type="button" onClick={onShare} aria-pressed={t.client_visible} title={t.client_visible ? 'Hide from client' : 'Show to client as a milestone'}
            className={cn('btn-raised btn-lift inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-card', t.client_visible ? 'text-tertiary' : 'text-muted-foreground')}>
            {t.client_visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            <span className="sr-only">{t.client_visible ? 'Hide from client' : 'Show to client'}</span>
          </button>
        </div>
      )}
    </li>
  );
};

/* ---------- Documents ---------- */
export const Documents = ({ matterId, people, canUpload, asClient }: { matterId: string; people: Person[]; canUpload: boolean; asClient?: boolean }) => {
  const act = useAction();
  const docs = useQuery({ queryKey: ['documents', matterId], queryFn: () => fresh(repo.listDocuments(matterId)) });
  const input = useRef<HTMLInputElement>(null);
  const [visibility, setVisibility] = useState<Visibility>(asClient ? 'client' : 'internal');
  const open = async (id: string) => {
    const d = docs.data?.find((x) => x.id === id);
    if (!d) return;
    const url = await repo.documentUrl(d);
    if (url) window.open(url, '_blank', 'noopener');
    else act(async () => { throw new Error('Demo mode keeps file names only; connect Supabase storage to open files.'); });
  };
  return (
    <Panel
      title="Documents"
      action={canUpload && (
        <div className="flex items-center gap-2">
          {!asClient && (
            <NativeSelect compact aria-label="Who can see the upload" value={visibility} onChange={(e) => setVisibility(e.target.value as Visibility)}>
              <option value="internal">Internal</option>
              <option value="client">Share with client</option>
            </NativeSelect>
          )}
          <input ref={input} type="file" className="sr-only" onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void act(() => repo.addDocument(matterId, f, visibility), 'Uploaded');
            e.target.value = '';
          }} />
          <Button size="sm" variant="outline" icon="leading" onClick={() => input.current?.click()}><Upload /> Upload</Button>
        </div>
      )}
    >
      {(docs.data ?? []).length === 0 ? (
        <Empty icon={FileText}>No documents yet.</Empty>
      ) : (
        <ul className="divide-y divide-border">
          {(docs.data ?? []).map((d) => (
            <li key={d.id} className="ws-row flex items-center gap-3 px-4 py-3">
              <span className="icon-well inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] text-muted-foreground"><FileText className="h-[18px] w-[18px]" aria-hidden="true" /></span>
              <span className="min-w-0 flex-1">
                <button type="button" onClick={() => open(d.id)} className="type-label-lg block max-w-full truncate text-left hover:text-primary-ink">{d.name}</button>
                <span className="type-meta block text-muted-foreground">{people.find((p) => p.id === d.uploaded_by)?.name.split(' ')[0]} · {fmtDate(d.created_at)}</span>
              </span>
              {!asClient && (d.visibility === 'client' ? <Badge variant="tertiary">Shared</Badge> : <Badge variant="secondary">Internal</Badge>)}
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
};

/* ---------- Team ---------- */
const Team = ({ matterId, members, people, canStaff }: { matterId: string; members: MatterMember[]; people: Person[]; canStaff: boolean }) => {
  const act = useAction();
  const [draft, setDraft] = useState<MatterMember[] | null>(null);
  const list = draft ?? members;
  const staff = people.filter((p) => isFeeEarner(p.role));
  return (
    <Panel title="People on this matter" action={canStaff && (draft
      ? <div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => setDraft(null)}>Cancel</Button><Button size="sm" onClick={async () => { await act(() => repo.setMembers(matterId, list), 'Team updated'); setDraft(null); }}>Save</Button></div>
      : <Button size="sm" variant="outline" icon="leading" onClick={() => setDraft(members)}><Users /> Edit</Button>)}>
      <ul className="divide-y divide-border">
        {(draft ? staff : staff.filter((p) => list.some((m) => m.user_id === p.id))).map((p) => {
          const m = list.find((x) => x.user_id === p.id);
          return (
            <li key={p.id} className="flex items-center gap-3 px-4 py-3">
              <Avatar name={p.name} className="h-9 w-9" />
              <div className="min-w-0 flex-1">
                <p className="type-label-lg truncate">{p.name}</p>
                <p className="type-meta text-muted-foreground">{p.title}</p>
              </div>
              {draft ? (
                <NativeSelect compact aria-label={`${p.name} on this matter`} value={m?.role_on_matter ?? ''} onChange={(e) => {
                  const v = e.target.value as MemberRole | '';
                  setDraft(v ? [...list.filter((x) => x.user_id !== p.id), { matter_id: matterId, user_id: p.id, role_on_matter: v }] : list.filter((x) => x.user_id !== p.id));
                }}>
                  <option value="">Not on matter</option>
                  <option value="lead">Lead</option>
                  <option value="member">Member</option>
                  <option value="viewer">Viewer (read only)</option>
                </NativeSelect>
              ) : (
                <Badge variant={m?.role_on_matter === 'lead' ? 'default' : 'secondary'}>{m?.role_on_matter === 'lead' ? 'Lead' : m?.role_on_matter === 'viewer' ? 'Viewer' : 'Member'}</Badge>
              )}
            </li>
          );
        })}
        {!draft && list.length === 0 && <Empty icon={Users}>No one staffed yet.</Empty>}
      </ul>
    </Panel>
  );
};

/* ---------- Page ---------- */
const MatterDetail = () => {
  const { id = '' } = useParams();
  const me = useMe();
  const act = useAction();
  const people = usePeople();
  const fees = useFees();
  const bundle = useQuery({ queryKey: ['matter', id], queryFn: () => repo.getMatter(id).then((b) => (b ? { ...b, matter: { ...b.matter }, members: b.members.map((x) => ({ ...x })) } : b)) });
  const tasks = useQuery({ queryKey: ['tasks', id], queryFn: () => fresh(repo.listTasks({ matterId: id })) });
  const [feeDraft, setFeeDraft] = useState<string | null>(null);
  const [tab, setTab] = useState('timeline');

  if (bundle.isLoading) return <Panel><Loading rows={5} /></Panel>;
  if (!bundle.data) {
    return (
      <div className="space-y-4">
        <Link to="/workspace/matters" className="type-label-md inline-flex items-center gap-1 text-muted-foreground"><ArrowLeft className="h-4 w-4" /> Matters</Link>
        <Panel><Empty icon={Lock}>This matter doesn't exist, or you aren't staffed on it.</Empty></Panel>
      </div>
    );
  }
  const { matter: m, client, members } = bundle.data;
  const all = people.data ?? [];
  const work = canWorkMatter(me, { matter: m, members });
  const fee = fees.data?.find((f) => f.matter_id === m.id);
  const t = tasks.data ?? [];
  const done = t.filter((x) => x.status === 'done').length;
  const pct = t.length ? Math.round((done / t.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Link to="/workspace/matters" className="type-label-md -ml-1 inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-muted-foreground hover:bg-foreground/[0.05] hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Matters</Link>
        <PageHead
          eyebrow={<>{m.reference} · {client?.name}</>}
          title={m.title}
          sub={<>{SERVICE_LABEL[m.service]} · {m.markets.map((c) => MARKET_NAME[c] ?? c).join(', ') || 'No markets'}</>}
          actions={work ? (
            <NativeSelect aria-label="Stage" value={m.stage} onChange={(e) => act(() => repo.updateMatter(m.id, { stage: e.target.value as typeof m.stage }), 'Stage updated')} className="min-w-[190px]">
              {STAGES.map((s) => <option key={s} value={s}>{STAGE_LABEL[s]}</option>)}
            </NativeSelect>
          ) : (
            <StageBadge stage={m.stage} />
          )}
        />
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-4">
          <TabBar
            label="Matter sections"
            value={tab}
            onChange={setTab}
            tabs={[{ id: 'timeline', label: 'Timeline' }, { id: 'tasks', label: 'Tasks', count: t.length - done }, { id: 'documents', label: 'Documents' }]}
          />
          {tab === 'timeline' && <Timeline matterId={m.id} people={all} />}
          {tab === 'tasks' && <Tasks matterId={m.id} people={all} canWork={work} />}
          {tab === 'documents' && <Documents matterId={m.id} people={all} canUpload={work} />}
        </div>

        <aside className="min-w-0 space-y-4">
          <Panel title="Summary">
            <dl className="type-body-sm divide-y divide-border">
              <div className="px-4 py-3">
                <dt className="type-label-md text-muted-foreground">Progress</dt>
                <dd className="mt-1.5">
                  <div className="h-2 overflow-hidden rounded-full bg-foreground/10"><div className="h-full rounded-full bg-primary transition-[width] duration-500" style={{ width: `${pct}%` }} /></div>
                  <p className="type-meta mt-1 text-muted-foreground">{done} of {t.length} tasks done</p>
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3 px-4 py-3"><dt className="text-muted-foreground">Opened</dt><dd>{fmtDate(m.opened_at)}</dd></div>
              <div className="flex items-center justify-between gap-3 px-4 py-3"><dt className="text-muted-foreground">Due</dt><dd><DueLabel date={m.due_date} done={m.stage === 'completed' || m.stage === 'closed'} /></dd></div>
              <div className="flex items-center justify-between gap-3 px-4 py-3"><dt className="text-muted-foreground">Lead</dt><dd>{all.find((p) => p.id === m.lead_id)?.name ?? '—'}</dd></div>
              {can.seeFees(me) && (
                <div className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Fixed fee</dt>
                    <dd>
                      {feeDraft === null ? (
                        <button type="button" className="tabular hover:text-primary-ink" onClick={() => setFeeDraft(String(fee?.fee_amount ?? ''))}>{fmtMoney(fee?.fee_amount, fee?.fee_currency)}</button>
                      ) : (
                        <form className="flex items-center gap-1" onSubmit={async (e) => { e.preventDefault(); await act(() => repo.setFee(m.id, feeDraft ? Number(feeDraft) : null, m.fee_currency), 'Fee saved'); setFeeDraft(null); }}>
                          <TextInput aria-label="Fee" type="number" min="0" value={feeDraft} onChange={(e) => setFeeDraft(e.target.value)} className="h-8 w-24 text-[13px]" autoFocus />
                          <Button size="sm" type="submit">Save</Button>
                        </form>
                      )}
                    </dd>
                  </div>
                  <p className="type-meta mt-1 text-muted-foreground">Partners and the client only.</p>
                </div>
              )}
            </dl>
            {m.summary && <p className="type-body-sm border-t border-border px-4 py-3 text-muted-foreground">{m.summary}</p>}
          </Panel>
          <Team matterId={m.id} members={members} people={all} canStaff={can.staffMatter(me)} />
          {client && (
            <Panel title="Client">
              <div className="type-body-sm space-y-1 px-4 py-3">
                <p className="type-label-lg">{client.name}</p>
                <p className="text-muted-foreground">{[client.industry, client.country].filter(Boolean).join(' · ')}</p>
                {client.contact_name && <p>{client.contact_name}{client.contact_email && <> · <a className="text-primary-ink" href={`mailto:${client.contact_email}`}>{client.contact_email}</a></>}</p>}
                {client.notes && <p className="mt-2 rounded-[8px] bg-warning/10 px-2.5 py-2 text-warning"><Lock className="mr-1 inline h-3 w-3" aria-hidden="true" />{client.notes}</p>}
              </div>
            </Panel>
          )}
        </aside>
      </div>
    </div>
  );
};

export default MatterDetail;
