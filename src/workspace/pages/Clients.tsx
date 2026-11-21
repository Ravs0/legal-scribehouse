import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { repo } from '../data';
import type { ClientStatus } from '../types';
import { Empty, Field, NativeSelect, PageHead, Panel, StageBadge, useAction, useClients, useMatters } from '../components/kit';

const Clients = () => {
  const clients = useClients();
  const matters = useMatters();
  const act = useAction();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', country: '', industry: '', contact_name: '', contact_email: '', status: 'active' as ClientStatus, notes: '' });
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const c = await act(() => repo.createClient({ ...form, notes: form.notes || undefined }), 'Client added');
    if (c) {
      setOpen(false);
      setForm({ name: '', country: '', industry: '', contact_name: '', contact_email: '', status: 'active', notes: '' });
    }
  };

  return (
    <div className="space-y-6">
      <PageHead title="Clients" sub="Organisations the firm acts for, with their matters." actions={<Button icon="leading" onClick={() => setOpen(true)}><Plus /> Add client</Button>} />
      <div className="grid gap-4 md:grid-cols-2">
        {(clients.data ?? []).map((c) => {
          const ms = (matters.data ?? []).filter((m) => m.client_id === c.id);
          return (
            <Panel key={c.id} title={c.name} action={<Badge variant={c.status === 'active' ? 'success' : c.status === 'prospect' ? 'warning' : 'secondary'}>{c.status}</Badge>}>
              <div className="type-body-sm px-4 py-3 text-muted-foreground">
                {[c.industry, c.country].filter(Boolean).join(' · ') || '—'}
                {c.contact_name && <p className="mt-1 text-foreground">{c.contact_name} {c.contact_email && <a className="text-primary-ink" href={`mailto:${c.contact_email}`}>· {c.contact_email}</a>}</p>}
              </div>
              {ms.length === 0 ? <Empty>No matters yet.</Empty> : (
                <ul className="divide-y divide-border border-t border-border">
                  {ms.map((m) => (
                    <li key={m.id}>
                      <Link to={`/workspace/matters/${m.id}`} className="flex items-center gap-3 px-4 py-2.5 hover:bg-foreground/[0.03]">
                        <span className="type-mono-md text-muted-foreground">{m.reference}</span>
                        <span className="type-body-sm min-w-0 flex-1 truncate">{m.title}</span>
                        <StageBadge stage={m.stage} />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          );
        })}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Add a client</DialogTitle>
            <DialogDescription>Notes are internal and never shown in the client portal.</DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2"><Field label="Name"><Input required value={form.name} onChange={(e) => set('name', e.target.value)} /></Field></div>
            <Field label="Exports from"><Input value={form.country} onChange={(e) => set('country', e.target.value)} /></Field>
            <Field label="Product category"><Input value={form.industry} onChange={(e) => set('industry', e.target.value)} /></Field>
            <Field label="Contact"><Input value={form.contact_name} onChange={(e) => set('contact_name', e.target.value)} /></Field>
            <Field label="Contact email"><Input type="email" value={form.contact_email} onChange={(e) => set('contact_email', e.target.value)} /></Field>
            <Field label="Status">
              <NativeSelect className="h-10 w-full" value={form.status} onChange={(e) => set('status', e.target.value)}>
                {(['prospect', 'active', 'dormant', 'closed'] as ClientStatus[]).map((s) => <option key={s} value={s}>{s}</option>)}
              </NativeSelect>
            </Field>
            <div className="sm:col-span-2"><Field label="Internal notes"><Textarea rows={3} value={form.notes} onChange={(e) => set('notes', e.target.value)} /></Field></div>
            <div className="flex justify-end gap-2 sm:col-span-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit">Add client</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Clients;
