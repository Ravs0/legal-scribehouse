import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { can, isFeeEarner } from '../access';
import { repo } from '../data';
import { MARKET_NAME, SERVICE_LABEL, SERVICES, type Enquiry, type EnquiryStatus, type Service } from '../types';
import { Empty, ENQUIRY_LABEL, EnquiryBadge, Field, fmtAgo, NativeSelect, PageHead, Panel, useAction, useMe, usePeople } from '../components/kit';

const FILTERS: { id: 'open' | EnquiryStatus | 'all'; label: string }[] = [
  { id: 'open', label: 'Open' },
  { id: 'new', label: 'New' },
  { id: 'converted', label: 'Converted' },
  { id: 'declined', label: 'Declined' },
  { id: 'all', label: 'All' },
];

const Convert = ({ enquiry, onDone }: { enquiry: Enquiry; onDone: () => void }) => {
  const act = useAction();
  const people = usePeople();
  const nav = useNavigate();
  const [client, setClient] = useState(enquiry.company ?? enquiry.name);
  const [title, setTitle] = useState('');
  const [service, setService] = useState<Service>('market-entry');
  const [lead, setLead] = useState('');
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const m = await act(() => repo.convertEnquiry(enquiry.id, { client_name: client, title, service, lead_id: lead || undefined }), 'Matter opened from enquiry');
    if (m) {
      onDone();
      nav(`/workspace/matters/${m.id}`);
    }
  };
  return (
    <form onSubmit={submit} className="grid gap-4">
      <Field label="Client" hint="Matches an existing client by name, or creates a new one."><Input required value={client} onChange={(e) => setClient(e.target.value)} /></Field>
      <Field label="Matter title"><Input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Thailand distribution agreement" /></Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Service">
          <NativeSelect className="h-10 w-full" value={service} onChange={(e) => setService(e.target.value as Service)}>
            {SERVICES.map((s) => <option key={s} value={s}>{SERVICE_LABEL[s]}</option>)}
          </NativeSelect>
        </Field>
        <Field label="Lead">
          <NativeSelect className="h-10 w-full" value={lead} onChange={(e) => setLead(e.target.value)}>
            <option value="">Unassigned</option>
            {(people.data ?? []).filter((p) => isFeeEarner(p.role)).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </NativeSelect>
        </Field>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onDone}>Cancel</Button>
        <Button type="submit" icon="trailing">Open matter <ArrowRight /></Button>
      </div>
    </form>
  );
};

const Enquiries = () => {
  const me = useMe();
  const act = useAction();
  const people = usePeople();
  const list = useQuery({ queryKey: ['enquiries'], queryFn: () => repo.listEnquiries() });
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['id']>('open');
  const [selected, setSelected] = useState<string | null>(null);
  const [converting, setConverting] = useState(false);
  const [note, setNote] = useState('');

  const rows = (list.data ?? []).filter((e) =>
    filter === 'all' ? true : filter === 'open' ? !['converted', 'declined'].includes(e.status) : e.status === filter,
  );
  const current = (list.data ?? []).find((e) => e.id === selected) ?? rows[0];
  useEffect(() => setNote(current?.internal_note ?? ''), [current?.id, current?.internal_note]);

  return (
    <div className="space-y-6">
      <PageHead title="Enquiries" sub="Everything sent through the website's booking form." />
      <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Filter enquiries">
        {FILTERS.map((f) => (
          <button key={f.id} role="tab" aria-selected={filter === f.id} onClick={() => setFilter(f.id)}
            className={cn('type-label-md h-8 rounded-full px-3', filter === f.id ? 'bg-primary text-primary-foreground' : 'border border-border text-muted-foreground hover:text-foreground')}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <Panel>
          {rows.length === 0 ? <Empty>No enquiries here.</Empty> : (
            <ul className="divide-y divide-border">
              {rows.map((e) => (
                <li key={e.id}>
                  <button type="button" onClick={() => setSelected(e.id)}
                    className={cn('flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-foreground/[0.03]', current?.id === e.id && 'bg-primary/[0.07]')}>
                    <div className="min-w-0 flex-1">
                      <p className="type-label-lg truncate">{e.company || e.name}</p>
                      <p className="type-body-sm line-clamp-2 text-muted-foreground">{e.message}</p>
                      <p className="type-label-sm mt-1 text-muted-foreground">{fmtAgo(e.created_at)} · {e.markets.join(' ') || 'No markets'}</p>
                    </div>
                    <EnquiryBadge status={e.status} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        {current && (
          <Panel title={current.company || current.name} action={<EnquiryBadge status={current.status} />}>
            <div className="space-y-4 p-4">
              <dl className="type-body-sm grid grid-cols-[120px_minmax(0,1fr)] gap-x-3 gap-y-2">
                <dt className="text-muted-foreground">From</dt><dd>{current.name} · <a href={`mailto:${current.email}`} className="text-primary-ink">{current.email}</a></dd>
                <dt className="text-muted-foreground">Exporting from</dt><dd>{current.origin || '—'}</dd>
                <dt className="text-muted-foreground">Markets</dt><dd>{current.markets.map((c) => MARKET_NAME[c] ?? c).join(', ') || '—'}</dd>
                <dt className="text-muted-foreground">Product</dt><dd>{current.category || '—'}</dd>
                <dt className="text-muted-foreground">Stage</dt><dd>{current.stage || '—'}</dd>
              </dl>
              <blockquote className="type-body-md whitespace-pre-line rounded-[10px] border border-border bg-background px-4 py-3">{current.message}</blockquote>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Status">
                  <NativeSelect className="h-10 w-full" value={current.status} disabled={current.status === 'converted'}
                    onChange={(e) => act(() => repo.updateEnquiry(current.id, { status: e.target.value as EnquiryStatus }))}>
                    {(['new', 'contacted', 'call_booked', 'declined'] as EnquiryStatus[]).map((s) => <option key={s} value={s}>{ENQUIRY_LABEL[s]}</option>)}
                    {current.status === 'converted' && <option value="converted">Converted</option>}
                  </NativeSelect>
                </Field>
                <Field label="Owner">
                  <NativeSelect className="h-10 w-full" value={current.assigned_to ?? ''} onChange={(e) => act(() => repo.updateEnquiry(current.id, { assigned_to: e.target.value || undefined }))}>
                    <option value="">Nobody yet</option>
                    {(people.data ?? []).filter((p) => isFeeEarner(p.role)).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </NativeSelect>
                </Field>
              </div>
              <Field label="Internal note">
                <Textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} onBlur={() => note !== (current.internal_note ?? '') && act(() => repo.updateEnquiry(current.id, { internal_note: note }), 'Note saved')} />
              </Field>
              <div className="flex flex-wrap justify-end gap-2 border-t border-border pt-4">
                <Button asChild variant="outline" icon="leading"><a href={`mailto:${current.email}?subject=${encodeURIComponent('Your enquiry to Straitline')}`}><Mail /> Reply by email</a></Button>
                {can.convertEnquiry(me) && current.status !== 'converted' && (
                  <Button icon="trailing" onClick={() => setConverting(true)}>Open a matter <ArrowRight /></Button>
                )}
              </div>
            </div>
          </Panel>
        )}
      </div>

      {current && (
        <Dialog open={converting} onOpenChange={setConverting}>
          <DialogContent className="max-w-[520px]">
            <DialogHeader>
              <DialogTitle>Open a matter from this enquiry</DialogTitle>
              <DialogDescription>The enquiry's markets and message carry over; the enquiry is marked converted.</DialogDescription>
            </DialogHeader>
            <Convert enquiry={current} onDone={() => setConverting(false)} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Enquiries;
