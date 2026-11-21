import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { readingMinutes, slugify } from '@/lib/markdown';
import type {
  Article, Client, ContentStatus, DocumentFile, Enquiry, Fee, Matter, MatterMember, MatterUpdate, Person, Role, Task,
} from '../types';
import { type AuditEntry, type MatterBundle, type NewMatter, type Repo } from './repo';

/**
 * Supabase adapter. Row-level security in the database decides what each person sees; this file only maps rows.
 * The generated types in src/integrations/supabase/types.ts predate the workspace migration, so this adapter uses
 * an untyped client. Regenerate the types after applying the migration to get full typing back.
 *
 * matters.fee_amount is not selectable by design (see the migration): matter queries name their columns, and
 * fees come from the matter_fees() / my_matter_fees() functions.
 */
const db = supabase as unknown as SupabaseClient;

const MATTER_COLS =
  'id, reference, client_id, title, service, markets, stage, summary, fee_currency, lead_id, opened_at, due_date, closed_at, created_at, updated_at';

const ok = <T,>(res: { data: T | null; error: { message: string } | null }): T => {
  if (res.error) throw new Error(res.error.message);
  return res.data as T;
};

async function loadPerson(userId: string, email?: string): Promise<Person> {
  const [profile, role, memberships] = await Promise.all([
    db.from('profiles').select('full_name, email, title, base_city').eq('user_id', userId).maybeSingle(),
    db.from('user_roles').select('role').eq('user_id', userId).maybeSingle(),
    db.from('client_members').select('client_id').eq('user_id', userId),
  ]);
  return {
    id: userId,
    name: profile.data?.full_name ?? email ?? 'Signed in',
    email: profile.data?.email ?? email ?? '',
    title: profile.data?.title ?? undefined,
    base_city: profile.data?.base_city ?? undefined,
    role: (role.data?.role as Role) ?? 'client',
    client_ids: (memberships.data ?? []).map((m: { client_id: string }) => m.client_id),
  };
}

export const supabaseRepo: Repo = {
  mode: 'supabase',

  async currentUser() {
    const { data } = await db.auth.getUser();
    return data.user ? loadPerson(data.user.id, data.user.email ?? undefined) : null;
  },
  async signIn(email, password) {
    const { data, error } = await db.auth.signInWithPassword({ email, password });
    if (error || !data.user) throw new Error(error?.message ?? 'Sign-in failed.');
    return loadPerson(data.user.id, data.user.email ?? undefined);
  },
  async signOut() {
    await db.auth.signOut();
  },

  async listPeople() {
    const [profiles, roles] = await Promise.all([
      db.from('profiles').select('user_id, full_name, email, title, base_city'),
      db.from('user_roles').select('user_id, role'),
    ]);
    const roleOf = new Map((roles.data ?? []).map((r: { user_id: string; role: Role }) => [r.user_id, r.role]));
    return ok(profiles).map((p: { user_id: string; full_name: string | null; email: string; title: string | null; base_city: string | null }) => ({
      id: p.user_id, name: p.full_name ?? p.email, email: p.email, title: p.title ?? undefined, base_city: p.base_city ?? undefined,
      role: roleOf.get(p.user_id) ?? 'client',
    }));
  },
  async setRole(userId, role) {
    ok(await db.from('user_roles').upsert({ user_id: userId, role }));
  },

  async listClients() {
    return ok(await db.from('clients').select('*').order('name')) as Client[];
  },
  async createClient(input) {
    return ok(await db.from('clients').insert(input).select('*').single()) as Client;
  },

  async listMatters() {
    return ok(await db.from('matters').select(MATTER_COLS).order('updated_at', { ascending: false })) as Matter[];
  },
  async getMatter(id) {
    const matter = ok(await db.from('matters').select(MATTER_COLS).eq('id', id).maybeSingle()) as Matter | null;
    if (!matter) return null;
    const [client, members] = await Promise.all([
      db.from('clients').select('*').eq('id', matter.client_id).maybeSingle(),
      db.from('matter_members').select('*').eq('matter_id', id),
    ]);
    const bundle: MatterBundle = { matter, client: (client.data as Client) ?? undefined, members: (members.data ?? []) as MatterMember[] };
    return bundle;
  },
  async createMatter(input: NewMatter) {
    const { member_ids = [], fee_amount, ...rest } = input;
    const m = ok(await db.from('matters').insert({ ...rest, fee_amount: fee_amount ?? null }).select(MATTER_COLS).single()) as Matter;
    const ids = new Set([...member_ids, ...(input.lead_id ? [input.lead_id] : [])]);
    if (ids.size) {
      ok(await db.from('matter_members').insert([...ids].map((user_id) => ({ matter_id: m.id, user_id, role_on_matter: user_id === input.lead_id ? 'lead' : 'member' }))));
    }
    return m;
  },
  async updateMatter(id, patch) {
    ok(await db.from('matters').update(patch).eq('id', id));
  },
  async setMembers(matterId, members) {
    ok(await db.from('matter_members').delete().eq('matter_id', matterId));
    if (members.length) ok(await db.from('matter_members').insert(members));
  },
  async listFees() {
    const me = await supabaseRepo.currentUser();
    const fn = me?.role === 'client' ? 'my_matter_fees' : 'matter_fees';
    const res = await db.rpc(fn);
    return res.error ? [] : (res.data as Fee[]);
  },
  async setFee(matterId, amount, currency) {
    ok(await db.from('matters').update({ fee_amount: amount, fee_currency: currency }).eq('id', matterId));
  },

  async listTasks(filter = {}) {
    let q = db.from('tasks').select('*').order('due_date', { ascending: true, nullsFirst: false });
    if (filter.matterId) q = q.eq('matter_id', filter.matterId);
    if (filter.assigneeId) q = q.eq('assignee_id', filter.assigneeId);
    if (filter.openOnly) q = q.neq('status', 'done');
    return ok(await q) as Task[];
  },
  async createTask(input) {
    return ok(await db.from('tasks').insert(input).select('*').single()) as Task;
  },
  async updateTask(id, patch) {
    ok(await db.from('tasks').update(patch).eq('id', id));
  },

  async listUpdates(matterId, limit = 50) {
    let q = db.from('matter_updates').select('*').order('created_at', { ascending: false }).limit(limit);
    if (matterId) q = q.eq('matter_id', matterId);
    return ok(await q) as MatterUpdate[];
  },
  async postUpdate(input) {
    const { data } = await db.auth.getUser();
    return ok(await db.from('matter_updates').insert({ ...input, author_id: data.user?.id }).select('*').single()) as MatterUpdate;
  },

  async listDocuments(matterId) {
    return ok(await db.from('documents').select('*').eq('matter_id', matterId).order('created_at', { ascending: false })) as DocumentFile[];
  },
  async addDocument(matterId, file, visibility) {
    const path = `${matterId}/${crypto.randomUUID()}-${file.name.replace(/[^\w.\- ]/g, '_')}`;
    // Insert the row first: the storage policy only lets you read files that have a documents row.
    const doc = ok(await db.from('documents').insert({ matter_id: matterId, name: file.name, storage_path: path, size_bytes: file.size, visibility }).select('*').single()) as DocumentFile;
    const up = await db.storage.from('matter-files').upload(path, file, { upsert: false });
    if (up.error) {
      await db.from('documents').delete().eq('id', doc.id);
      throw new Error(up.error.message);
    }
    return doc;
  },
  async documentUrl(doc) {
    const res = await db.storage.from('matter-files').createSignedUrl(doc.storage_path, 60);
    return res.data?.signedUrl ?? null;
  },

  async submitEnquiry(input) {
    ok(await db.from('enquiries').insert({ ...input, markets: input.markets ?? [] }));
  },
  async listEnquiries() {
    return ok(await db.from('enquiries').select('*').order('created_at', { ascending: false })) as Enquiry[];
  },
  async updateEnquiry(id, patch) {
    ok(await db.from('enquiries').update(patch).eq('id', id));
  },
  async convertEnquiry(id, input) {
    const e = ok(await db.from('enquiries').select('*').eq('id', id).single()) as Enquiry;
    const existing = await db.from('clients').select('*').ilike('name', input.client_name.trim()).maybeSingle();
    const client = (existing.data as Client | null) ??
      (ok(await db.from('clients').insert({ name: input.client_name.trim(), country: e.origin, industry: e.category, contact_name: e.name, contact_email: e.email, status: 'active' }).select('*').single()) as Client);
    const m = await supabaseRepo.createMatter({ client_id: client.id, title: input.title, service: input.service, markets: e.markets, lead_id: input.lead_id, summary: e.message });
    ok(await db.from('enquiries').update({ status: 'converted', matter_id: m.id }).eq('id', id));
    await supabaseRepo.postUpdate({ matter_id: m.id, kind: 'note', visibility: 'internal', body: `Opened from website enquiry by ${e.name}${e.company ? ` (${e.company})` : ''}.` });
    return m;
  },

  async listArticles() {
    return (ok(await db.from('content').select('*').order('updated_at', { ascending: false })) as Article[]).map(normaliseArticle);
  },
  async listPublishedArticles() {
    return (ok(await db.from('content').select('*').eq('status', 'published').order('published_at', { ascending: false })) as Article[]).map(normaliseArticle);
  },
  async getArticle(id) {
    const a = ok(await db.from('content').select('*').eq('id', id).maybeSingle()) as Article | null;
    return a ? normaliseArticle(a) : null;
  },
  async saveArticle(input) {
    const { data } = await db.auth.getUser();
    const row = {
      ...input,
      slug: input.slug || slugify(input.title),
      reading_time: readingMinutes(input.content ?? ''),
      summary: input.summary ?? '',
      content: input.content ?? '',
    };
    if (input.id) {
      const { id, created_at: _c, updated_at: _u, status: _s, ...patch } = row;
      return normaliseArticle(ok(await db.from('content').update(patch).eq('id', id).select('*').single()) as Article);
    }
    return normaliseArticle(ok(await db.from('content').insert({ ...row, status: 'draft', created_by: data.user?.id, authors: data.user ? [data.user.id] : [] }).select('*').single()) as Article);
  },
  async setArticleStatus(id, status: ContentStatus) {
    ok(await db.from('content').update({ status }).eq('id', id));
  },
  async deleteArticle(id) {
    ok(await db.from('content').delete().eq('id', id));
  },

  async listAudit(limit = 50) {
    const rows = ok(await db.from('audit_log').select('id, actor_id, action, table_name, row_id, at').order('at', { ascending: false }).limit(limit)) as {
      id: number; actor_id: string | null; action: string; table_name: string; row_id: string | null; at: string;
    }[];
    return rows.map((r): AuditEntry => ({ id: String(r.id), actor_id: r.actor_id ?? undefined, action: r.action, table_name: r.table_name, summary: r.row_id ?? '', at: r.at }));
  },
};

function normaliseArticle(a: Article & { draft?: boolean }): Article {
  return { ...a, status: a.status ?? (a.draft ? 'draft' : 'published'), markets: a.markets ?? [], categories: a.categories ?? [], tags: a.tags ?? [] };
}
