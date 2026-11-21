import { FormEvent, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { can, isFeeEarner } from '../access';
import { repo } from '../data';
import { MARKET_CODES, MARKET_NAME, SERVICE_LABEL, SERVICES, STAGE_LABEL, STAGES, type Service, type Stage } from '../types';
import { DueLabel, Empty, Field, NativeSelect, PageHead, Panel, StageBadge, useAction, useClients, useMatters, useMe, usePeople } from '../components/kit';

export const NewMatterDialog = ({ open, onOpenChange, defaults }: { open: boolean; onOpenChange: (o: boolean) => void; defaults?: { client_id?: string } }) => {
  const clients = useClients();
  const people = usePeople();
  const act = useAction();
  const nav = useNavigate();
  const [form, setForm] = useState({ client_id: defaults?.client_id ?? '', title: '', service: 'market-entry' as Service, markets: [] as string[], lead_id: '', due_date: '', fee: '', summary: '' });
  const set = (k: keyof typeof form, v: unknown) => setForm((f) => ({ ...f, [k]: v }));
  const staff = (people.data ?? []).filter((p) => isFeeEarner(p.role));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const m = await act(
      () => repo.createMatter({
        client_id: form.client_id, title: form.title, service: form.service, markets: form.markets, lead_id: form.lead_id || undefined,
        due_date: form.due_date || undefined, fee_amount: form.fee ? Number(form.fee) : null, summary: form.summary || undefined,
      }),
      'Matter opened',
    );
    if (m) {
      onOpenChange(false);
      nav(`/workspace/matters/${m.id}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Open a matter</DialogTitle>
          <DialogDescription>It gets the next reference number and starts at Intake.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field label="Client">
              <NativeSelect required className="h-10 w-full" value={form.client_id} onChange={(e) => set('client_id', e.target.value)}>
                <option value="">Choose a client…</option>
                {(clients.data ?? []).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </NativeSelect>
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Title"><Input required value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Malaysia entry and NPRA notification" /></Field>
          </div>
          <Field label="Service">
            <NativeSelect className="h-10 w-full" value={form.service} onChange={(e) => set('service', e.target.value)}>
              {SERVICES.map((s) => <option key={s} value={s}>{SERVICE_LABEL[s]}</option>)}
            </NativeSelect>
          </Field>
          <Field label="Lead">
            <NativeSelect className="h-10 w-full" value={form.lead_id} onChange={(e) => set('lead_id', e.target.value)}>
              <option value="">Unassigned</option>
              {staff.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </NativeSelect>
          </Field>
          <Field label="Due date"><Input type="date" value={form.due_date} onChange={(e) => set('due_date', e.target.value)} /></Field>
          <Field label="Fixed fee (SGD)"><Input type="number" min="0" step="100" value={form.fee} onChange={(e) => set('fee', e.target.value)} /></Field>
          <fieldset className="sm:col-span-2">
            <legend className="type-label-md mb-1.5">Markets</legend>
            <div className="flex flex-wrap gap-1.5">
              {MARKET_CODES.map((c) => {
                const on = form.markets.includes(c);
                return (
                  <button key={c} type="button" aria-pressed={on} onClick={() => set('markets', on ? form.markets.filter((x) => x !== c) : [...form.markets, c])}
                    className={`type-label-sm h-7 rounded-full px-2.5 ${on ? 'bg-primary text-primary-foreground' : 'border border-border text-muted-foreground hover:text-foreground'}`}>
                    {MARKET_NAME[c]}
                  </button>
                );
              })}
            </div>
          </fieldset>
          <div className="sm:col-span-2">
            <Field label="Summary" hint="Shown to the client in the portal."><Textarea rows={3} value={form.summary} onChange={(e) => set('summary', e.target.value)} /></Field>
          </div>
          <div className="flex justify-end gap-2 sm:col-span-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Open matter</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const Matters = () => {
  const me = useMe();
  const matters = useMatters();
  const clients = useClients();
  const people = usePeople();
  const [q, setQ] = useState('');
  const [stage, setStage] = useState<'' | Stage | 'open'>('open');
  const [service, setService] = useState<'' | Service>('');
  const [creating, setCreating] = useState(false);

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return (matters.data ?? []).filter((m) => {
      if (stage === 'open' && (m.stage === 'completed' || m.stage === 'closed')) return false;
      if (stage && stage !== 'open' && m.stage !== stage) return false;
      if (service && m.service !== service) return false;
      if (!term) return true;
      const client = clients.data?.find((c) => c.id === m.client_id)?.name ?? '';
      return `${m.reference} ${m.title} ${client}`.toLowerCase().includes(term);
    });
  }, [matters.data, clients.data, q, stage, service]);

  return (
    <div className="space-y-6">
      <PageHead
        title="Matters"
        sub={can.openMatter(me) ? 'Every client matter in the firm.' : 'Matters you are staffed on.'}
        actions={can.openMatter(me) && <Button onClick={() => setCreating(true)} icon="leading"><Plus /> Open a matter</Button>}
      />
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input aria-label="Search matters" placeholder="Search by reference, title or client" className="h-9 pl-9" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <NativeSelect aria-label="Stage" value={stage} onChange={(e) => setStage(e.target.value as typeof stage)}>
          <option value="open">Open matters</option>
          <option value="">All stages</option>
          {STAGES.map((s) => <option key={s} value={s}>{STAGE_LABEL[s]}</option>)}
        </NativeSelect>
        <NativeSelect aria-label="Service" value={service} onChange={(e) => setService(e.target.value as typeof service)}>
          <option value="">All services</option>
          {SERVICES.map((s) => <option key={s} value={s}>{SERVICE_LABEL[s]}</option>)}
        </NativeSelect>
      </div>

      <Panel>
        {matters.isLoading ? (
          <Empty>Loading…</Empty>
        ) : rows.length === 0 ? (
          <Empty>No matters match.</Empty>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead className="type-label-sm text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="px-4 py-2.5 font-medium">Reference</th>
                  <th className="px-4 py-2.5 font-medium">Matter</th>
                  <th className="px-4 py-2.5 font-medium">Stage</th>
                  <th className="px-4 py-2.5 font-medium">Markets</th>
                  <th className="px-4 py-2.5 font-medium">Lead</th>
                  <th className="px-4 py-2.5 text-right font-medium">Due</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((m) => (
                  <tr key={m.id} className="group hover:bg-foreground/[0.03]">
                    <td className="type-mono-md px-4 py-3 text-muted-foreground">{m.reference}</td>
                    <td className="px-4 py-3">
                      <Link to={`/workspace/matters/${m.id}`} className="type-label-lg after:absolute group-hover:text-primary-ink">{m.title}</Link>
                      <p className="type-label-sm text-muted-foreground">{clients.data?.find((c) => c.id === m.client_id)?.name} · {SERVICE_LABEL[m.service]}</p>
                    </td>
                    <td className="px-4 py-3"><StageBadge stage={m.stage} /></td>
                    <td className="type-mono-md px-4 py-3 text-muted-foreground">{m.markets.join(' ')}</td>
                    <td className="type-body-sm px-4 py-3">{people.data?.find((p) => p.id === m.lead_id)?.name ?? '—'}</td>
                    <td className="type-label-sm px-4 py-3 text-right"><DueLabel date={m.due_date} done={m.stage === 'completed' || m.stage === 'closed'} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
      {can.openMatter(me) && <NewMatterDialog open={creating} onOpenChange={setCreating} />}
    </div>
  );
};

export default Matters;
