import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { repo } from '../data';
import type { ClientStatus } from '../types';
import { Empty, Field, useFormErrors, WsDialogContent, Loading, NativeSelect, PageHead, Panel, StageBadge, useAction, useClients, useMatters, TextInput, TextArea } from '../components/kit';

const Clients = () => {
  const clients = useClients();
  const matters = useMatters();
  const act = useAction();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', country: '', industry: '', contact_name: '', contact_email: '', status: 'active' as ClientStatus, notes: '' });
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const f = useFormErrors();
  const submit = async () => {
    const c = await act(() => repo.createClient({ ...form, notes: form.notes || undefined }), 'Client added');
    if (c) {
      setOpen(false);
      setForm({ name: '', country: '', industry: '', contact_name: '', contact_email: '', status: 'active', notes: '' });
    }
  };

  return (
    <div className="space-y-6">
      <PageHead title="Clients" sub="Organisations the firm acts for, with their matters." actions={<Button icon="leading" onClick={() => setOpen(true)}><Plus /> Add client</Button>} />
      <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-4 md:grid-cols-2">
        {clients.isLoading && <Panel className="md:col-span-2"><Loading rows={3} /></Panel>}
        {(clients.data ?? []).map((c) => {
          const ms = (matters.data ?? []).filter((m) => m.client_id === c.id);
          return (
            <Panel key={c.id} title={c.name} action={<Badge variant={c.status === 'active' ? 'success' : c.status === 'prospect' ? 'warning' : 'secondary'}>{c.status[0].toUpperCase() + c.status.slice(1)}</Badge>}>
              <div className="type-body-sm px-4 py-3.5 text-muted-foreground">
                {[c.industry, c.country].filter(Boolean).join(' · ') || '—'}
                {c.contact_name && <p className="mt-1 text-foreground">{c.contact_name} {c.contact_email && <a className="text-primary-ink" href={`mailto:${c.contact_email}`}>· {c.contact_email}</a>}</p>}
              </div>
              {ms.length === 0 ? <div className="border-t border-border"><Empty icon={Building2} title="No matters yet" help="Matters opened for this client appear here." /></div> : (
                <ul className="divide-y divide-border border-t border-border">
                  {ms.map((m) => (
                    <li key={m.id}>
                      <Link to={`/workspace/matters/${m.id}`} className="ws-row flex items-center gap-3 px-4 py-3">
                        <span className="type-mono-md shrink-0 text-muted-foreground">{m.reference}</span>
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
        <WsDialogContent className="max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Add a client</DialogTitle>
            <DialogDescription>Notes are internal and never shown in the client portal.</DialogDescription>
          </DialogHeader>
          <form {...f.form(() => ({ name: !form.name.trim() && 'Enter the client name.', contact_email: !!form.contact_email.trim() && !/^\S+@\S+\.\S+$/.test(form.contact_email.trim()) && 'Enter a valid email address.' }), submit)} className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2"><Field label="Name" error={f.error('name')}><TextInput {...f.field('name')} value={form.name} onChange={(e) => set('name', e.target.value)} /></Field></div>
            <Field label="Exports from"><TextInput value={form.country} onChange={(e) => set('country', e.target.value)} /></Field>
            <Field label="Product category"><TextInput value={form.industry} onChange={(e) => set('industry', e.target.value)} /></Field>
            <Field label="Contact"><TextInput value={form.contact_name} onChange={(e) => set('contact_name', e.target.value)} /></Field>
            <Field label="Contact email" error={f.error('contact_email')}><TextInput {...f.field('contact_email')} type="email" value={form.contact_email} onChange={(e) => set('contact_email', e.target.value)} /></Field>
            <Field label="Status">
              <NativeSelect className="w-full" value={form.status} onChange={(e) => set('status', e.target.value)}>
                {(['prospect', 'active', 'dormant', 'closed'] as ClientStatus[]).map((s) => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}
              </NativeSelect>
            </Field>
            <div className="sm:col-span-2"><Field label="Internal notes"><TextArea rows={3} value={form.notes} onChange={(e) => set('notes', e.target.value)} /></Field></div>
            <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:col-span-2 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit">Add client</Button>
            </div>
          </form>
        </WsDialogContent>
      </Dialog>
    </div>
  );
};

export default Clients;
