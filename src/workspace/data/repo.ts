import type {
  Article, Client, ContentStatus, DocumentFile, Enquiry, Fee, Matter, MatterMember, MatterUpdate, Person, Role,
  Service, Task, Visibility,
} from '../types';

export interface MatterBundle {
  matter: Matter;
  client?: Client;
  members: MatterMember[];
}

export interface NewMatter {
  client_id: string;
  title: string;
  service: Service;
  markets: string[];
  summary?: string;
  lead_id?: string;
  due_date?: string;
  fee_amount?: number | null;
  fee_currency?: string;
  member_ids?: string[];
}

export interface AuditEntry {
  id: string;
  actor_id?: string;
  action: string;
  table_name: string;
  summary: string;
  at: string;
}

/**
 * Everything the workspace and the public site need from a backend. Both adapters implement it:
 * `demo` (in-browser, seeded, applies src/workspace/access.ts) and `supabase` (the real database, where
 * row-level security does the filtering). Every call acts as the signed-in person.
 */
export interface Repo {
  mode: 'demo' | 'supabase';

  currentUser(): Promise<Person | null>;
  signIn(email: string, password: string): Promise<Person>;
  signOut(): Promise<void>;
  /** Demo only: sign in as one of the seeded people. */
  signInAs?(userId: string): Promise<Person>;
  demoPeople?(): Person[];
  /** Demo only: put the seeded data back. */
  resetDemo?(): void;

  listPeople(): Promise<Person[]>;
  setRole(userId: string, role: Role): Promise<void>;

  listClients(): Promise<Client[]>;
  createClient(input: Omit<Client, 'id' | 'created_at'>): Promise<Client>;

  listMatters(): Promise<Matter[]>;
  getMatter(id: string): Promise<MatterBundle | null>;
  createMatter(input: NewMatter): Promise<Matter>;
  updateMatter(id: string, patch: Partial<Pick<Matter, 'title' | 'stage' | 'summary' | 'markets' | 'due_date' | 'lead_id'>>): Promise<void>;
  setMembers(matterId: string, members: MatterMember[]): Promise<void>;
  listFees(): Promise<Fee[]>;
  setFee(matterId: string, amount: number | null, currency: string): Promise<void>;

  listTasks(filter?: { matterId?: string; assigneeId?: string; openOnly?: boolean }): Promise<Task[]>;
  createTask(input: Omit<Task, 'id' | 'created_at' | 'completed_at'>): Promise<Task>;
  updateTask(id: string, patch: Partial<Omit<Task, 'id' | 'matter_id' | 'created_at'>>): Promise<void>;

  listUpdates(matterId?: string, limit?: number): Promise<MatterUpdate[]>;
  postUpdate(input: Pick<MatterUpdate, 'matter_id' | 'kind' | 'visibility' | 'body'>): Promise<MatterUpdate>;

  listDocuments(matterId: string): Promise<DocumentFile[]>;
  addDocument(matterId: string, file: File, visibility: Visibility): Promise<DocumentFile>;
  documentUrl(doc: DocumentFile): Promise<string | null>;

  submitEnquiry(input: Pick<Enquiry, 'name' | 'email' | 'company' | 'origin' | 'markets' | 'category' | 'stage' | 'message'>): Promise<void>;
  listEnquiries(): Promise<Enquiry[]>;
  updateEnquiry(id: string, patch: Partial<Pick<Enquiry, 'status' | 'assigned_to' | 'internal_note'>>): Promise<void>;
  convertEnquiry(id: string, input: { client_name: string; title: string; service: Service; lead_id?: string }): Promise<Matter>;

  listArticles(): Promise<Article[]>;
  listPublishedArticles(): Promise<Article[]>;
  getArticle(id: string): Promise<Article | null>;
  saveArticle(input: Partial<Article> & Pick<Article, 'title' | 'type'>): Promise<Article>;
  setArticleStatus(id: string, status: ContentStatus): Promise<void>;
  deleteArticle(id: string): Promise<void>;

  listAudit(limit?: number): Promise<AuditEntry[]>;
}

export class AccessError extends Error {
  constructor(message = 'You do not have access to do that.') {
    super(message);
    this.name = 'AccessError';
  }
}
