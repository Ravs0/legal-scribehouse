/** Shapes shared by the workspace UI and both data adapters (demo and Supabase). Mirrors the SQL schema. */
export type Role = 'owner' | 'partner' | 'lawyer' | 'paralegal' | 'editor' | 'client';

export interface Person {
  id: string;
  name: string;
  email: string;
  role: Role;
  title?: string;
  base_city?: string;
  /** Client users only: the organisations they belong to. */
  client_ids?: string[];
}

export type ClientStatus = 'prospect' | 'active' | 'dormant' | 'closed';
export interface Client {
  id: string;
  name: string;
  country?: string;
  industry?: string;
  contact_name?: string;
  contact_email?: string;
  status: ClientStatus;
  notes?: string;
  created_at: string;
}

export const SERVICES = ['market-entry', 'contracts', 'customs-fta', 'registration', 'trademark-ip', 'disputes'] as const;
export type Service = (typeof SERVICES)[number];
export const SERVICE_LABEL: Record<Service, string> = {
  'market-entry': 'Market-entry structure',
  contracts: 'Export contracts',
  'customs-fta': 'Customs, HS codes & FTAs',
  registration: 'Product registration',
  'trademark-ip': 'Trademark & IP',
  disputes: 'Disputes & payment risk',
};

export const STAGES = ['intake', 'scoping', 'in_progress', 'waiting_client', 'waiting_authority', 'completed', 'closed'] as const;
export type Stage = (typeof STAGES)[number];
export const STAGE_LABEL: Record<Stage, string> = {
  intake: 'Intake',
  scoping: 'Scoping',
  in_progress: 'In progress',
  waiting_client: 'Waiting on client',
  waiting_authority: 'Waiting on authority',
  completed: 'Completed',
  closed: 'Closed',
};

export const MARKET_CODES = ['SG', 'MY', 'ID', 'VN', 'TH', 'PH', 'KH', 'LA', 'MM', 'BN'] as const;
export const MARKET_NAME: Record<string, string> = {
  SG: 'Singapore', MY: 'Malaysia', ID: 'Indonesia', VN: 'Vietnam', TH: 'Thailand',
  PH: 'Philippines', KH: 'Cambodia', LA: 'Laos', MM: 'Myanmar', BN: 'Brunei',
};

export interface Matter {
  id: string;
  reference: string;
  client_id: string;
  title: string;
  service: Service;
  markets: string[];
  stage: Stage;
  summary?: string;
  fee_currency: string;
  lead_id?: string;
  opened_at: string;
  due_date?: string;
  closed_at?: string;
  created_at: string;
  updated_at: string;
}

export type MemberRole = 'lead' | 'member' | 'viewer';
export interface MatterMember { matter_id: string; user_id: string; role_on_matter: MemberRole }

export interface Fee { matter_id: string; fee_amount: number | null; fee_currency: string }

export type TaskStatus = 'todo' | 'doing' | 'blocked' | 'done';
export interface Task {
  id: string;
  matter_id: string;
  title: string;
  detail?: string;
  status: TaskStatus;
  priority: 'low' | 'normal' | 'high';
  assignee_id?: string;
  due_date?: string;
  client_visible: boolean;
  created_at: string;
  completed_at?: string;
}

export type UpdateKind = 'note' | 'filing' | 'authority' | 'stage' | 'client_message';
export type Visibility = 'internal' | 'client';
export interface MatterUpdate {
  id: string;
  matter_id: string;
  author_id: string;
  kind: UpdateKind;
  visibility: Visibility;
  body: string;
  created_at: string;
}

export interface DocumentFile {
  id: string;
  matter_id: string;
  name: string;
  size_bytes?: number;
  visibility: Visibility;
  uploaded_by?: string;
  created_at: string;
  storage_path: string;
}

export type EnquiryStatus = 'new' | 'contacted' | 'call_booked' | 'converted' | 'declined';
export interface Enquiry {
  id: string;
  name: string;
  email: string;
  company?: string;
  origin?: string;
  markets: string[];
  category?: string;
  stage?: string;
  message: string;
  status: EnquiryStatus;
  assigned_to?: string;
  matter_id?: string;
  internal_note?: string;
  created_at: string;
}

export type ContentType = 'post' | 'case' | 'statute' | 'guide' | 'briefing';
export type ContentStatus = 'draft' | 'in_review' | 'scheduled' | 'published' | 'archived';
export interface Article {
  id: string;
  slug?: string;
  title: string;
  summary: string;
  content: string;
  type: ContentType;
  status: ContentStatus;
  categories: string[];
  tags: string[];
  markets: string[];
  authors: string[];
  reading_time?: number;
  seo_title?: string;
  seo_description?: string;
  created_by?: string;
  reviewed_by?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
}
