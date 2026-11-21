import { can, canSeeMatter, canWorkMatter, isFeeEarner, isSenior, isStaff } from '../access';
import type {
  Article, Client, ContentStatus, DocumentFile, Enquiry, Fee, Matter, MatterMember, MatterUpdate, Person, Role, Task,
} from '../types';
import { STARTER_ARTICLES } from './articles';
import { AccessError, type AuditEntry, type MatterBundle, type NewMatter, type Repo } from './repo';
import { readingMinutes, slugify } from '@/lib/markdown';

/**
 * Demo adapter. Keeps a seeded data set in localStorage and applies the same access rules as the database
 * (src/workspace/access.ts), so signing in as each demo person shows exactly what that role would see.
 * Nothing leaves the browser. Fictional people, clients and matters throughout.
 */

const KEY = 'stl-workspace-demo-v1';
const USER_KEY = 'stl-workspace-demo-user';

const day = 86_400_000;
const iso = (offsetDays: number) => new Date(Date.now() + offsetDays * day).toISOString();
const date = (offsetDays: number) => iso(offsetDays).slice(0, 10);
const uid = () => (crypto?.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now().toString(36));

interface State {
  people: Person[];
  clients: Client[];
  matters: Matter[];
  members: MatterMember[];
  fees: Fee[];
  tasks: Task[];
  updates: MatterUpdate[];
  documents: DocumentFile[];
  enquiries: Enquiry[];
  articles: Article[];
  audit: AuditEntry[];
  refSeq: number;
}

const PEOPLE: Person[] = [
  { id: 'u-owner', name: 'Ravi Menon', email: 'owner@demo.straitline', role: 'owner', title: 'Managing partner', base_city: 'Singapore' },
  { id: 'u-partner', name: 'Mei Lin Tan', email: 'partner@demo.straitline', role: 'partner', title: 'Partner, contracts', base_city: 'Singapore' },
  { id: 'u-counsel', name: 'Daniel Koh', email: 'counsel@demo.straitline', role: 'lawyer', title: 'Counsel, customs & FTAs', base_city: 'Singapore' },
  { id: 'u-associate', name: 'Aisha Rahman', email: 'associate@demo.straitline', role: 'lawyer', title: 'Senior associate, registration', base_city: 'Kuala Lumpur' },
  { id: 'u-para', name: 'Priya Nair', email: 'paralegal@demo.straitline', role: 'paralegal', title: 'Paralegal', base_city: 'Singapore' },
  { id: 'u-editor', name: 'Sam Ortiz', email: 'editor@demo.straitline', role: 'editor', title: 'Content editor', base_city: 'Remote' },
  { id: 'u-client', name: 'Jess Walker', email: 'jess@fernleaf.example', role: 'client', title: 'Operations lead, Fernleaf Skincare', client_ids: ['c-fernleaf'] },
];

function seed(): State {
  const clients: Client[] = [
    { id: 'c-fernleaf', name: 'Fernleaf Skincare', country: 'Australia', industry: 'Cosmetics', contact_name: 'Jess Walker', contact_email: 'jess@fernleaf.example', status: 'active', notes: 'Wants MY first, ID next year. Price-sensitive.', created_at: iso(-60) },
    { id: 'c-saltbush', name: 'Saltbush Snacks', country: 'Australia', industry: 'Packaged food', contact_name: 'Tom Hale', contact_email: 'tom@saltbush.example', status: 'active', created_at: iso(-45) },
    { id: 'c-lumen', name: 'Lumen Devices', country: 'New Zealand', industry: 'Medical devices', contact_name: 'Ana Ruiz', contact_email: 'ana@lumen.example', status: 'active', created_at: iso(-30) },
    { id: 'c-harbour', name: 'Harbour & Hide', country: 'United Kingdom', industry: 'Apparel', contact_name: 'Ollie Grant', contact_email: 'ollie@harbourhide.example', status: 'prospect', created_at: iso(-6) },
  ];
  const matters: Matter[] = [
    { id: 'm-1', reference: 'STL-2026-0012', client_id: 'c-fernleaf', title: 'Malaysia entry and NPRA notification', service: 'registration', markets: ['MY'], stage: 'waiting_authority', summary: 'Cosmetic notifications for six SKUs through an independent licence holder, then distributor agreement.', fee_currency: 'SGD', lead_id: 'u-associate', opened_at: date(-52), due_date: date(18), created_at: iso(-52), updated_at: iso(-1) },
    { id: 'm-2', reference: 'STL-2026-0013', client_id: 'c-fernleaf', title: 'Distributor agreement, Kuala Lumpur', service: 'contracts', markets: ['MY'], stage: 'in_progress', summary: 'Exclusive distribution for Peninsular Malaysia with step-up minimums.', fee_currency: 'SGD', lead_id: 'u-partner', opened_at: date(-20), due_date: date(9), created_at: iso(-20), updated_at: iso(-2) },
    { id: 'm-3', reference: 'STL-2026-0014', client_id: 'c-saltbush', title: 'Origin review for AANZFTA, Vietnam', service: 'customs-fta', markets: ['VN'], stage: 'scoping', summary: 'Check three biscuit lines against the product-specific rules and set up the origin file.', fee_currency: 'SGD', lead_id: 'u-counsel', opened_at: date(-8), due_date: date(25), created_at: iso(-8), updated_at: iso(-3) },
    { id: 'm-4', reference: 'STL-2026-0015', client_id: 'c-lumen', title: 'Trademark filings, ID/TH/PH', service: 'trademark-ip', markets: ['ID', 'TH', 'PH'], stage: 'in_progress', summary: 'Word mark and logo in classes 10 and 44 via Madrid, with local agents for responses.', fee_currency: 'SGD', lead_id: 'u-counsel', opened_at: date(-26), due_date: date(40), created_at: iso(-26), updated_at: iso(-4) },
    { id: 'm-5', reference: 'STL-2026-0009', client_id: 'c-saltbush', title: 'Singapore entry structure', service: 'market-entry', markets: ['SG'], stage: 'completed', summary: 'Distributor versus own entity; recommended a distributor for year one.', fee_currency: 'SGD', lead_id: 'u-partner', opened_at: date(-120), closed_at: date(-70), created_at: iso(-120), updated_at: iso(-70) },
  ];
  const members: MatterMember[] = [
    { matter_id: 'm-1', user_id: 'u-associate', role_on_matter: 'lead' },
    { matter_id: 'm-1', user_id: 'u-para', role_on_matter: 'member' },
    { matter_id: 'm-2', user_id: 'u-partner', role_on_matter: 'lead' },
    { matter_id: 'm-2', user_id: 'u-associate', role_on_matter: 'member' },
    { matter_id: 'm-3', user_id: 'u-counsel', role_on_matter: 'lead' },
    { matter_id: 'm-3', user_id: 'u-para', role_on_matter: 'member' },
    { matter_id: 'm-4', user_id: 'u-counsel', role_on_matter: 'lead' },
    { matter_id: 'm-5', user_id: 'u-partner', role_on_matter: 'lead' },
  ];
  const fees: Fee[] = [
    { matter_id: 'm-1', fee_amount: 6800, fee_currency: 'SGD' },
    { matter_id: 'm-2', fee_amount: 5200, fee_currency: 'SGD' },
    { matter_id: 'm-3', fee_amount: 3900, fee_currency: 'SGD' },
    { matter_id: 'm-4', fee_amount: 7400, fee_currency: 'SGD' },
    { matter_id: 'm-5', fee_amount: 2800, fee_currency: 'SGD' },
  ];
  const t = (id: string, matter_id: string, title: string, status: Task['status'], assignee_id: string, due: number | null, client_visible = false, priority: Task['priority'] = 'normal'): Task => ({
    id, matter_id, title, status, assignee_id, priority, client_visible, due_date: due === null ? undefined : date(due), created_at: iso(-10), completed_at: status === 'done' ? iso(-2) : undefined,
  });
  const tasks: Task[] = [
    t('t-1', 'm-1', 'Collect ingredient lists and labels for 6 SKUs', 'done', 'u-para', -12, true),
    t('t-2', 'm-1', 'Sign licence-holder agreement', 'done', 'u-associate', -6, true),
    t('t-3', 'm-1', 'File NPRA notifications', 'done', 'u-associate', -3, true, 'high'),
    t('t-4', 'm-1', 'Answer NPRA query on SKU 4 preservative', 'doing', 'u-associate', 2, false, 'high'),
    t('t-5', 'm-1', 'Notification numbers issued', 'todo', 'u-associate', 18, true),
    t('t-6', 'm-2', 'First draft of distribution agreement', 'done', 'u-associate', -5, true),
    t('t-7', 'm-2', 'Negotiate minimums with distributor counsel', 'doing', 'u-partner', 4, false, 'high'),
    t('t-8', 'm-2', 'Agreement signed', 'todo', 'u-partner', 9, true),
    t('t-9', 'm-3', 'Get bill of materials and supplier declarations', 'blocked', 'u-para', 1, true),
    t('t-10', 'm-3', 'Classify three lines at 8 digits (AHTN)', 'doing', 'u-counsel', 6),
    t('t-11', 'm-3', 'Origin file and memo to client', 'todo', 'u-counsel', 25, true),
    t('t-12', 'm-4', 'Madrid application filed', 'done', 'u-counsel', -14, true),
    t('t-13', 'm-4', 'Watch for provisional refusals (ID)', 'todo', 'u-counsel', 30),
    t('t-14', 'm-5', 'Structure memo delivered', 'done', 'u-partner', -72, true),
  ];
  const u = (id: string, matter_id: string, author_id: string, kind: MatterUpdate['kind'], visibility: MatterUpdate['visibility'], body: string, ago: number): MatterUpdate => ({
    id, matter_id, author_id, kind, visibility, body, created_at: iso(-ago),
  });
  const updates: MatterUpdate[] = [
    u('w-1', 'm-1', 'u-associate', 'filing', 'client', 'All six notifications filed with NPRA. We expect numbers in two to three weeks unless there are queries.', 3),
    u('w-2', 'm-1', 'u-associate', 'authority', 'internal', 'NPRA query on SKU 4: preservative concentration. Draft response with supplier spec, check limit against the ASEAN Cosmetic Directive annex.', 1),
    u('w-3', 'm-1', 'u-client', 'client_message', 'client', 'Thanks. Do you need anything else from us for SKU 4?', 1),
    u('w-4', 'm-1', 'u-associate', 'note', 'client', 'Yes please: the supplier certificate of analysis for the preservative blend. Upload it here when you have it.', 0.8),
    u('w-5', 'm-2', 'u-partner', 'note', 'internal', 'Distributor wants exclusivity for all of Malaysia. Offering Peninsular only for year one, Sabah/Sarawak on hitting minimums.', 2),
    u('w-6', 'm-2', 'u-associate', 'stage', 'client', 'Stage moved from scoping to in progress.', 15),
    u('w-7', 'm-3', 'u-para', 'note', 'internal', 'Chased Saltbush for supplier declarations twice; Tom says end of week.', 3),
    u('w-8', 'm-4', 'u-counsel', 'filing', 'client', 'Madrid application filed designating Indonesia, Thailand and the Philippines. Examination usually takes several months per office.', 14),
    u('w-9', 'm-5', 'u-partner', 'note', 'client', 'Structure memo delivered: distributor for year one, review own entity at the 12-month mark.', 72),
  ];
  const documents: DocumentFile[] = [
    { id: 'd-1', matter_id: 'm-1', name: 'Licence-holder agreement (signed).pdf', size_bytes: 412_000, visibility: 'client', uploaded_by: 'u-associate', created_at: iso(-6), storage_path: 'm-1/licence-holder-agreement.pdf' },
    { id: 'd-2', matter_id: 'm-1', name: 'NPRA query SKU4.pdf', size_bytes: 96_000, visibility: 'internal', uploaded_by: 'u-associate', created_at: iso(-1), storage_path: 'm-1/npra-query-sku4.pdf' },
    { id: 'd-3', matter_id: 'm-2', name: 'Distribution agreement v2 (redline).docx', size_bytes: 188_000, visibility: 'client', uploaded_by: 'u-associate', created_at: iso(-5), storage_path: 'm-2/distribution-v2.docx' },
  ];
  const enquiries: Enquiry[] = [
    { id: 'e-1', name: 'Ollie Grant', email: 'ollie@harbourhide.example', company: 'Harbour & Hide', origin: 'United Kingdom', markets: ['SG', 'TH'], category: 'Apparel', stage: 'Have a buyer', message: 'We have a buyer in Bangkok asking for exclusivity. Need the contract checked and to know what duty we would pay.', status: 'call_booked', assigned_to: 'u-partner', created_at: iso(-6) },
    { id: 'e-2', name: 'Nina Park', email: 'nina@brightbrew.example', company: 'Brightbrew Tea', origin: 'New Zealand', markets: ['VN', 'PH'], category: 'Food & beverage', stage: 'Exploring', message: 'Looking at Vietnam and the Philippines for packaged tea. Where do we start?', status: 'new', created_at: iso(-1) },
    { id: 'e-3', name: 'Marcus Lee', email: 'marcus@kinetica.example', company: 'Kinetica', origin: 'Australia', markets: ['ID'], category: 'Medical devices', stage: 'Have a problem', message: 'Our distributor registered our device in their name and has stopped paying. Can we move the registration?', status: 'new', created_at: iso(-0.3) },
    { id: 'e-4', name: 'Hana Sato', email: 'hana@example.org', markets: ['SG'], stage: 'Exploring', message: 'Student project, can I interview someone about FTAs?', status: 'declined', created_at: iso(-12) },
  ];
  return {
    people: PEOPLE, clients, matters, members, fees, tasks, updates, documents, enquiries,
    articles: STARTER_ARTICLES, audit: [], refSeq: 16,
  };
}

let cache: State | null = null;
const load = (): State => {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    cache = raw ? (JSON.parse(raw) as State) : seed();
  } catch {
    cache = seed();
  }
  return cache;
};
const save = () => {
  try {
    if (cache) localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {
    /* storage full or blocked: keep in memory */
  }
};

const me = (): Person | null => {
  let id: string | null = null;
  try {
    id = localStorage.getItem(USER_KEY);
  } catch {
    /* ignore */
  }
  return load().people.find((p) => p.id === id) ?? null;
};
const need = (): Person => {
  const u = me();
  if (!u) throw new AccessError('Please sign in.');
  return u;
};
const ctx = (s: State, matterId: string) => {
  const matter = s.matters.find((m) => m.id === matterId);
  if (!matter) throw new Error('Matter not found.');
  return { matter, members: s.members };
};
const audit = (s: State, action: string, table_name: string, summary: string) => {
  s.audit.unshift({ id: uid(), actor_id: me()?.id, action, table_name, summary, at: new Date().toISOString() });
  s.audit = s.audit.slice(0, 200);
};
const tick = <T,>(v: T) => new Promise<T>((r) => setTimeout(() => r(v), 60));

export const demoRepo: Repo = {
  mode: 'demo',

  async currentUser() {
    return tick(me());
  },
  async signIn(email) {
    const p = load().people.find((x) => x.email.toLowerCase() === email.trim().toLowerCase());
    if (!p) throw new Error('No demo account with that email. Pick a person below instead.');
    localStorage.setItem(USER_KEY, p.id);
    return tick(p);
  },
  async signInAs(userId) {
    const p = load().people.find((x) => x.id === userId);
    if (!p) throw new Error('Unknown demo person.');
    localStorage.setItem(USER_KEY, p.id);
    return tick(p);
  },
  async signOut() {
    localStorage.removeItem(USER_KEY);
  },
  demoPeople: () => load().people,
  resetDemo() {
    cache = seed();
    save();
  },

  async listPeople() {
    const u = need();
    const s = load();
    if (isStaff(u.role)) return tick(s.people);
    // Clients see themselves and the firm people staffed on their own matters.
    const myMatters = new Set(s.matters.filter((m) => u.client_ids?.includes(m.client_id)).map((m) => m.id));
    const staffed = new Set(s.members.filter((m) => myMatters.has(m.matter_id)).map((m) => m.user_id));
    return tick(s.people.filter((p) => p.id === u.id || staffed.has(p.id)).map(({ email: _e, ...p }) => ({ ...p, email: '' })));
  },
  async setRole(userId, role: Role) {
    const u = need();
    if (!can.grantRoles(u)) throw new AccessError('Only the owner can change access.');
    const s = load();
    const p = s.people.find((x) => x.id === userId);
    if (!p) throw new Error('Unknown person.');
    audit(s, 'UPDATE', 'user_roles', `${p.name}: ${p.role} → ${role}`);
    p.role = role;
    save();
  },

  async listClients() {
    const u = need();
    const s = load();
    if (isSenior(u.role)) return tick(s.clients);
    if (isFeeEarner(u.role)) {
      const ids = new Set(s.matters.filter((m) => canSeeMatter(u, { matter: m, members: s.members })).map((m) => m.client_id));
      return tick(s.clients.filter((c) => ids.has(c.id)));
    }
    if (u.role === 'client') return tick(s.clients.filter((c) => u.client_ids?.includes(c.id)).map(({ notes: _n, ...c }) => c));
    return tick([]);
  },
  async createClient(input) {
    const u = need();
    if (!can.manageClients(u)) throw new AccessError();
    const s = load();
    const c: Client = { ...input, id: uid(), created_at: new Date().toISOString() };
    s.clients.push(c);
    audit(s, 'INSERT', 'clients', c.name);
    save();
    return c;
  },

  async listMatters() {
    const u = need();
    const s = load();
    return tick(s.matters.filter((m) => canSeeMatter(u, { matter: m, members: s.members })));
  },
  async getMatter(id) {
    const u = need();
    const s = load();
    const matter = s.matters.find((m) => m.id === id);
    if (!matter || !canSeeMatter(u, { matter, members: s.members })) return tick(null);
    const client = s.clients.find((c) => c.id === matter.client_id);
    const bundle: MatterBundle = {
      matter,
      client: client && u.role === 'client' ? { ...client, notes: undefined } : client,
      members: s.members.filter((m) => m.matter_id === id),
    };
    return tick(bundle);
  },
  async createMatter(input: NewMatter) {
    const u = need();
    if (!can.openMatter(u)) throw new AccessError('Only a partner can open a matter.');
    const s = load();
    const now = new Date().toISOString();
    const year = new Date().getFullYear();
    const m: Matter = {
      id: uid(), reference: `STL-${year}-${String(s.refSeq++).padStart(4, '0')}`, client_id: input.client_id, title: input.title,
      service: input.service, markets: input.markets, stage: 'intake', summary: input.summary, fee_currency: input.fee_currency ?? 'SGD',
      lead_id: input.lead_id, opened_at: now.slice(0, 10), due_date: input.due_date, created_at: now, updated_at: now,
    };
    s.matters.unshift(m);
    s.fees.push({ matter_id: m.id, fee_amount: input.fee_amount ?? null, fee_currency: m.fee_currency });
    const ids = new Set([...(input.member_ids ?? []), ...(input.lead_id ? [input.lead_id] : [])]);
    ids.forEach((id) => s.members.push({ matter_id: m.id, user_id: id, role_on_matter: id === input.lead_id ? 'lead' : 'member' }));
    audit(s, 'INSERT', 'matters', `${m.reference} ${m.title}`);
    save();
    return m;
  },
  async updateMatter(id, patch) {
    const u = need();
    const s = load();
    const c = ctx(s, id);
    if (!canWorkMatter(u, c)) throw new AccessError();
    const m = c.matter;
    if (patch.stage && patch.stage !== m.stage) {
      s.updates.unshift({ id: uid(), matter_id: id, author_id: u.id, kind: 'stage', visibility: 'client', body: `Stage moved from ${m.stage.replace(/_/g, ' ')} to ${patch.stage.replace(/_/g, ' ')}.`, created_at: new Date().toISOString() });
      if (patch.stage === 'completed' || patch.stage === 'closed') m.closed_at = m.closed_at ?? new Date().toISOString().slice(0, 10);
    }
    Object.assign(m, patch, { updated_at: new Date().toISOString() });
    audit(s, 'UPDATE', 'matters', `${m.reference}: ${Object.keys(patch).join(', ')}`);
    save();
  },
  async setMembers(matterId, members) {
    const u = need();
    if (!can.staffMatter(u)) throw new AccessError('Only a partner can staff a matter.');
    const s = load();
    s.members = [...s.members.filter((m) => m.matter_id !== matterId), ...members];
    audit(s, 'UPDATE', 'matter_members', `${s.matters.find((m) => m.id === matterId)?.reference}: ${members.length} people`);
    save();
  },
  async listFees() {
    const u = need();
    const s = load();
    if (isSenior(u.role)) return tick(s.fees);
    if (u.role === 'client') return tick(s.fees.filter((f) => u.client_ids?.includes(s.matters.find((m) => m.id === f.matter_id)?.client_id ?? '')));
    return tick([]);
  },
  async setFee(matterId, amount, currency) {
    const u = need();
    if (!can.editFees(u)) throw new AccessError('Only a partner can change a fee.');
    const s = load();
    const f = s.fees.find((x) => x.matter_id === matterId);
    if (f) Object.assign(f, { fee_amount: amount, fee_currency: currency });
    else s.fees.push({ matter_id: matterId, fee_amount: amount, fee_currency: currency });
    audit(s, 'UPDATE', 'matters', `fee changed on ${s.matters.find((m) => m.id === matterId)?.reference}`);
    save();
  },

  async listTasks(filter = {}) {
    const u = need();
    const s = load();
    return tick(
      s.tasks.filter((t) => {
        const m = s.matters.find((x) => x.id === t.matter_id);
        if (!m || !canSeeMatter(u, { matter: m, members: s.members })) return false;
        if (u.role === 'client' && !t.client_visible) return false;
        if (filter.matterId && t.matter_id !== filter.matterId) return false;
        if (filter.assigneeId && t.assignee_id !== filter.assigneeId) return false;
        if (filter.openOnly && t.status === 'done') return false;
        return true;
      }),
    );
  },
  async createTask(input) {
    const u = need();
    const s = load();
    if (!canWorkMatter(u, ctx(s, input.matter_id))) throw new AccessError();
    const t: Task = { ...input, id: uid(), created_at: new Date().toISOString() };
    s.tasks.push(t);
    audit(s, 'INSERT', 'tasks', t.title);
    save();
    return t;
  },
  async updateTask(id, patch) {
    const u = need();
    const s = load();
    const t = s.tasks.find((x) => x.id === id);
    if (!t) throw new Error('Task not found.');
    if (!canWorkMatter(u, ctx(s, t.matter_id))) throw new AccessError();
    Object.assign(t, patch);
    if (patch.status) t.completed_at = patch.status === 'done' ? new Date().toISOString() : undefined;
    audit(s, 'UPDATE', 'tasks', `${t.title}: ${Object.keys(patch).join(', ')}`);
    save();
  },

  async listUpdates(matterId, limit = 50) {
    const u = need();
    const s = load();
    return tick(
      s.updates
        .filter((w) => {
          const m = s.matters.find((x) => x.id === w.matter_id);
          if (!m || !canSeeMatter(u, { matter: m, members: s.members })) return false;
          if (u.role === 'client' && w.visibility !== 'client') return false;
          if (u.role === 'editor') return false;
          return !matterId || w.matter_id === matterId;
        })
        .sort((a, b) => b.created_at.localeCompare(a.created_at))
        .slice(0, limit),
    );
  },
  async postUpdate(input) {
    const u = need();
    const s = load();
    const c = ctx(s, input.matter_id);
    const asClient = u.role === 'client';
    if (asClient) {
      if (!canSeeMatter(u, c)) throw new AccessError();
      input = { ...input, kind: 'client_message', visibility: 'client' };
    } else if (!canWorkMatter(u, c)) throw new AccessError();
    const w: MatterUpdate = { ...input, id: uid(), author_id: u.id, created_at: new Date().toISOString() };
    s.updates.unshift(w);
    c.matter.updated_at = w.created_at;
    save();
    return w;
  },

  async listDocuments(matterId) {
    const u = need();
    const s = load();
    const c = ctx(s, matterId);
    if (!canSeeMatter(u, c) || u.role === 'editor') return [];
    return tick(s.documents.filter((d) => d.matter_id === matterId && (u.role !== 'client' || d.visibility === 'client')));
  },
  async addDocument(matterId, file, visibility) {
    const u = need();
    const s = load();
    const c = ctx(s, matterId);
    const asClient = u.role === 'client' && canSeeMatter(u, c);
    if (!asClient && !canWorkMatter(u, c)) throw new AccessError();
    const d: DocumentFile = {
      id: uid(), matter_id: matterId, name: file.name, size_bytes: file.size, visibility: asClient ? 'client' : visibility,
      uploaded_by: u.id, created_at: new Date().toISOString(), storage_path: `${matterId}/${uid()}-${file.name}`,
    };
    s.documents.unshift(d);
    audit(s, 'INSERT', 'documents', d.name);
    save();
    return d;
  },
  async documentUrl() {
    return null; // The demo keeps file names only; the Supabase adapter returns a signed link.
  },

  async submitEnquiry(input) {
    const s = load();
    s.enquiries.unshift({ ...input, markets: input.markets ?? [], id: uid(), status: 'new', created_at: new Date().toISOString() });
    save();
  },
  async listEnquiries() {
    const u = need();
    if (!can.seeEnquiries(u)) return [];
    return tick([...load().enquiries].sort((a, b) => b.created_at.localeCompare(a.created_at)));
  },
  async updateEnquiry(id, patch) {
    const u = need();
    if (!can.seeEnquiries(u)) throw new AccessError();
    const s = load();
    const e = s.enquiries.find((x) => x.id === id);
    if (!e) throw new Error('Enquiry not found.');
    Object.assign(e, patch);
    audit(s, 'UPDATE', 'enquiries', `${e.name}: ${Object.keys(patch).join(', ')}`);
    save();
  },
  async convertEnquiry(id, input) {
    const u = need();
    if (!can.convertEnquiry(u)) throw new AccessError('Only a partner can open a matter.');
    const s = load();
    const e = s.enquiries.find((x) => x.id === id);
    if (!e) throw new Error('Enquiry not found.');
    let client = s.clients.find((c) => c.name.toLowerCase() === input.client_name.trim().toLowerCase());
    if (!client) {
      client = { id: uid(), name: input.client_name.trim(), country: e.origin, industry: e.category, contact_name: e.name, contact_email: e.email, status: 'active', created_at: new Date().toISOString() };
      s.clients.push(client);
    }
    const m = await demoRepo.createMatter({ client_id: client.id, title: input.title, service: input.service, markets: e.markets, lead_id: input.lead_id, summary: e.message });
    const st = load();
    const e2 = st.enquiries.find((x) => x.id === id)!;
    Object.assign(e2, { status: 'converted', matter_id: m.id });
    st.updates.unshift({ id: uid(), matter_id: m.id, author_id: u.id, kind: 'note', visibility: 'internal', body: `Opened from website enquiry by ${e.name}${e.company ? ` (${e.company})` : ''}.`, created_at: new Date().toISOString() });
    save();
    return m;
  },

  async listArticles() {
    const u = need();
    if (!isStaff(u.role)) return [];
    return tick([...load().articles].sort((a, b) => b.updated_at.localeCompare(a.updated_at)));
  },
  async listPublishedArticles() {
    return load().articles.filter((a) => a.status === 'published');
  },
  async getArticle(id) {
    const u = me();
    const a = load().articles.find((x) => x.id === id) ?? null;
    if (!a) return null;
    if (a.status !== 'published' && !(u && isStaff(u.role))) return null;
    return tick(a);
  },
  async saveArticle(input) {
    const u = need();
    if (!can.writeArticles(u)) throw new AccessError();
    const s = load();
    const now = new Date().toISOString();
    const existing = input.id ? s.articles.find((a) => a.id === input.id) : undefined;
    if (existing) {
      if (!can.editArticle(u, existing)) throw new AccessError('This article is locked. Ask a partner to edit it.');
      Object.assign(existing, input, { updated_at: now, reading_time: readingMinutes(input.content ?? existing.content), slug: input.slug || existing.slug || slugify(input.title) });
      audit(s, 'UPDATE', 'content', existing.title);
      save();
      return existing;
    }
    const a: Article = {
      summary: '', content: '', categories: [], tags: [], markets: [], authors: [u.id], ...input,
      id: uid(), status: 'draft', slug: input.slug || slugify(input.title), created_by: u.id, created_at: now, updated_at: now,
      reading_time: readingMinutes(input.content ?? ''),
    };
    s.articles.unshift(a);
    audit(s, 'INSERT', 'content', a.title);
    save();
    return a;
  },
  async setArticleStatus(id, status: ContentStatus) {
    const u = need();
    const s = load();
    const a = s.articles.find((x) => x.id === id);
    if (!a) throw new Error('Article not found.');
    const senior = can.publishArticles(u);
    if ((status === 'published' || status === 'scheduled' || status === 'archived') && !senior) {
      throw new AccessError('Only a partner can publish, schedule or archive.');
    }
    if (!senior && !can.editArticle(u, a)) throw new AccessError();
    a.status = status;
    if (status === 'published') {
      a.published_at = a.published_at ?? new Date().toISOString();
      a.reviewed_by = u.id;
    }
    a.updated_at = new Date().toISOString();
    audit(s, 'UPDATE', 'content', `${a.title}: ${status}`);
    save();
  },
  async deleteArticle(id) {
    const u = need();
    if (!can.deleteArticle(u)) throw new AccessError();
    const s = load();
    s.articles = s.articles.filter((a) => a.id !== id);
    save();
  },

  async listAudit(limit = 50) {
    const u = need();
    if (!can.seeAudit(u)) return [];
    return tick(load().audit.slice(0, limit));
  },
};
