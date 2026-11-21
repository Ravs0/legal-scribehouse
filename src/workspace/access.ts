import type { Article, Matter, MatterMember, Person, Role } from './types';

/**
 * The access ladder. This file mirrors the row-level security in
 * supabase/migrations/20261121090000_workspace_access_and_matters.sql; keep the two in step.
 * The database is the real gate; this file decides what the UI offers, and the demo adapter
 * uses it to filter data the same way the database would.
 */
export const RANK: Record<Role, number> = { owner: 60, partner: 50, lawyer: 40, paralegal: 30, editor: 20, client: 10 };

export const ROLE_LABEL: Record<Role, string> = {
  owner: 'Owner',
  partner: 'Partner',
  lawyer: 'Lawyer',
  paralegal: 'Paralegal',
  editor: 'Editor',
  client: 'Client',
};

export const ROLE_SUMMARY: Record<Role, string> = {
  owner: 'Everything, including granting access and deleting records.',
  partner: 'All clients and matters, fees, publishing articles, the enquiries inbox.',
  lawyer: 'Matters they are staffed on. Writes articles and submits them for review.',
  paralegal: 'Matters they are staffed on: tasks, updates, documents. No fees, no publishing.',
  editor: 'Articles only: draft, edit, submit for review. No client data.',
  client: 'The portal: their own matters, and only what the firm has shared with them.',
};

export const isSenior = (r: Role) => RANK[r] >= 50;
export const isFeeEarner = (r: Role) => RANK[r] >= 30;
export const isStaff = (r: Role) => RANK[r] >= 20;
export const isWriter = (r: Role) => isSenior(r) || r === 'lawyer' || r === 'editor';

export interface MatterContext {
  matter: Matter;
  members: MatterMember[];
}

export const canSeeMatter = (u: Person, { matter, members }: MatterContext) =>
  isSenior(u.role) ||
  (isFeeEarner(u.role) && members.some((m) => m.matter_id === matter.id && m.user_id === u.id)) ||
  (u.role === 'client' && (u.client_ids ?? []).includes(matter.client_id));

export const canWorkMatter = (u: Person, { matter, members }: MatterContext) =>
  isSenior(u.role) ||
  (isFeeEarner(u.role) && members.some((m) => m.matter_id === matter.id && m.user_id === u.id && m.role_on_matter !== 'viewer'));

/** Everything the UI may offer, by capability. */
export const can = {
  openMatter: (u: Person) => isSenior(u.role),
  seeFees: (u: Person) => isSenior(u.role),
  editFees: (u: Person) => isSenior(u.role),
  staffMatter: (u: Person) => isSenior(u.role),
  manageClients: (u: Person) => isSenior(u.role),
  seeEnquiries: (u: Person) => isFeeEarner(u.role),
  convertEnquiry: (u: Person) => isSenior(u.role),
  seeTeam: (u: Person) => isStaff(u.role),
  grantRoles: (u: Person) => u.role === 'owner',
  seeAudit: (u: Person) => isSenior(u.role),
  writeArticles: (u: Person) => isWriter(u.role),
  publishArticles: (u: Person) => isSenior(u.role),
  editArticle: (u: Person, a: Article) =>
    isSenior(u.role) || (isWriter(u.role) && a.created_by === u.id && (a.status === 'draft' || a.status === 'in_review')),
  deleteArticle: (u: Person) => isSenior(u.role),
  useWorkspace: (u: Person) => isStaff(u.role),
  usePortal: (u: Person) => u.role === 'client',
};

/** Rows of the access matrix shown on the Team & access page. */
export const MATRIX: { label: string; roles: Role[] }[] = [
  { label: 'Grant and change access', roles: ['owner'] },
  { label: 'See every client and matter', roles: ['owner', 'partner'] },
  { label: 'Open matters and staff them', roles: ['owner', 'partner'] },
  { label: 'See and change fees', roles: ['owner', 'partner'] },
  { label: 'Publish, schedule and archive articles', roles: ['owner', 'partner'] },
  { label: 'Read the audit log', roles: ['owner', 'partner'] },
  { label: 'Work on matters they are staffed on', roles: ['owner', 'partner', 'lawyer', 'paralegal'] },
  { label: 'Triage website enquiries', roles: ['owner', 'partner', 'lawyer', 'paralegal'] },
  { label: 'Write articles and submit for review', roles: ['owner', 'partner', 'lawyer', 'editor'] },
  { label: 'See shared milestones, updates and files on their own matters', roles: ['client'] },
  { label: 'Message the firm on their own matters', roles: ['client'] },
];
