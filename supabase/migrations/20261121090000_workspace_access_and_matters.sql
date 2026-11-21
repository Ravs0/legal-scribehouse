-- =====================================================================================================
-- Straitline workspace: access levels, clients, matters, tasks, work updates, documents, enquiries,
-- editorial workflow for published content, and an audit log.
--
-- Access ladder (highest first). A person has exactly one firm role; client users have role 'client'
-- and are linked to one or more client organisations through client_members.
--
--   owner      everything, including granting roles and deleting records
--   partner    all clients and matters, fees, publishing, enquiries, team list
--   lawyer     matters they are a member of; drafts and submits articles for review
--   paralegal  matters they are a member of (tasks, updates, documents); no fees, no publishing
--   editor     articles only (draft, submit, edit); no client data
--   client     portal: their own organisation's matters, and only items marked visible to the client
--
-- Every rule below is enforced by row-level security, so it holds whatever app or API calls the database.
-- src/workspace/access.ts mirrors this matrix for the UI; keep the two in step.
-- =====================================================================================================

-- ---------- Roles ----------
CREATE TYPE public.app_role AS ENUM ('owner', 'partner', 'lawyer', 'paralegal', 'editor', 'client');

-- Roles live in their own table (never on profiles), so a user cannot raise their own access by
-- updating their profile row.
CREATE TABLE public.user_roles (
  user_id    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role       public.app_role NOT NULL DEFAULT 'client',
  granted_by UUID REFERENCES auth.users(id),
  granted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Profiles gain a title and avatar for the team list; is_admin is retired in favour of user_roles.
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS title TEXT,
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS base_city TEXT;

-- Existing admins become owners.
INSERT INTO public.user_roles (user_id, role)
SELECT user_id, 'owner'::public.app_role FROM public.profiles WHERE is_admin = true
ON CONFLICT (user_id) DO NOTHING;

-- New sign-ups get the lowest role. Staff are promoted by an owner.
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'client') ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

-- Helper functions. SECURITY DEFINER so policies can read user_roles without recursion.
CREATE OR REPLACE FUNCTION public.current_role_of(_uid UUID)
RETURNS public.app_role LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT role FROM public.user_roles WHERE user_id = _uid
$$;

CREATE OR REPLACE FUNCTION public.role_rank(_uid UUID)
RETURNS INT LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT CASE (SELECT role FROM public.user_roles WHERE user_id = _uid)
    WHEN 'owner' THEN 60 WHEN 'partner' THEN 50 WHEN 'lawyer' THEN 40
    WHEN 'paralegal' THEN 30 WHEN 'editor' THEN 20 WHEN 'client' THEN 10 ELSE 0 END
$$;

CREATE OR REPLACE FUNCTION public.has_role(_uid UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _uid AND role = _role)
$$;

-- Partner or owner.
CREATE OR REPLACE FUNCTION public.is_senior(_uid UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.role_rank(_uid) >= 50
$$;

-- Any firm member who works on matters (owner, partner, lawyer, paralegal).
CREATE OR REPLACE FUNCTION public.is_fee_earner(_uid UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.role_rank(_uid) >= 30
$$;

-- Any firm member at all (includes editors).
CREATE OR REPLACE FUNCTION public.is_staff(_uid UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.role_rank(_uid) >= 20
$$;

-- Retire the old admin checks on content and authors: admins are now "senior".
CREATE OR REPLACE FUNCTION public.is_admin_compat(_uid UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.is_senior(_uid)
$$;

-- user_roles policies: everyone reads their own role; seniors read all; only owners grant or change.
CREATE POLICY "read own role" ON public.user_roles FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "seniors read all roles" ON public.user_roles FOR SELECT USING (public.is_senior(auth.uid()));
CREATE POLICY "owners grant roles" ON public.user_roles FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'owner'));
CREATE POLICY "owners change roles" ON public.user_roles FOR UPDATE USING (public.has_role(auth.uid(), 'owner'));
CREATE POLICY "owners remove roles" ON public.user_roles FOR DELETE USING (public.has_role(auth.uid(), 'owner'));

-- Staff can see each other's profiles (team list); everyone still sees their own.
CREATE POLICY "staff read staff profiles" ON public.profiles FOR SELECT USING (public.is_staff(auth.uid()));

-- ---------- Clients ----------
CREATE TABLE public.clients (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  country       TEXT,                 -- where they export from
  industry      TEXT,                 -- product category
  website       TEXT,
  contact_name  TEXT,
  contact_email TEXT,
  status        TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('prospect', 'active', 'dormant', 'closed')),
  notes         TEXT,                 -- internal only; never shown in the portal
  created_by    UUID REFERENCES auth.users(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Client portal users linked to an organisation.
CREATE TABLE public.client_members (
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  user_id   UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  PRIMARY KEY (client_id, user_id)
);
ALTER TABLE public.client_members ENABLE ROW LEVEL SECURITY;

-- ---------- Matters ----------
CREATE TYPE public.matter_stage AS ENUM
  ('intake', 'scoping', 'in_progress', 'waiting_client', 'waiting_authority', 'completed', 'closed');

CREATE SEQUENCE public.matter_ref_seq;

CREATE TABLE public.matters (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference   TEXT NOT NULL UNIQUE
                DEFAULT ('STL-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.matter_ref_seq')::text, 4, '0')),
  client_id   UUID NOT NULL REFERENCES public.clients(id) ON DELETE RESTRICT,
  title       TEXT NOT NULL,
  service     TEXT NOT NULL CHECK (service IN ('market-entry', 'contracts', 'customs-fta', 'registration', 'trademark-ip', 'disputes')),
  markets     TEXT[] NOT NULL DEFAULT '{}',          -- ISO codes: SG, MY, ID, VN, TH, PH, KH, LA, MM, BN
  stage       public.matter_stage NOT NULL DEFAULT 'intake',
  summary     TEXT,                                   -- shown in the portal
  fee_amount  NUMERIC(12, 2),                         -- fixed fee; seniors only (see matter_fees view)
  fee_currency TEXT NOT NULL DEFAULT 'SGD',
  lead_id     UUID REFERENCES auth.users(id),
  opened_at   DATE NOT NULL DEFAULT current_date,
  due_date    DATE,
  closed_at   DATE,
  created_by  UUID REFERENCES auth.users(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.matters ENABLE ROW LEVEL SECURITY;
CREATE INDEX matters_client_idx ON public.matters (client_id);
CREATE INDEX matters_stage_idx ON public.matters (stage);

CREATE TABLE public.matter_members (
  matter_id UUID NOT NULL REFERENCES public.matters(id) ON DELETE CASCADE,
  user_id   UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_on_matter TEXT NOT NULL DEFAULT 'member' CHECK (role_on_matter IN ('lead', 'member', 'viewer')),
  PRIMARY KEY (matter_id, user_id)
);
ALTER TABLE public.matter_members ENABLE ROW LEVEL SECURITY;

-- Can this user see the matter at all?
CREATE OR REPLACE FUNCTION public.can_see_matter(_uid UUID, _matter UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.is_senior(_uid)
      OR (public.is_fee_earner(_uid) AND EXISTS (
            SELECT 1 FROM public.matter_members mm WHERE mm.matter_id = _matter AND mm.user_id = _uid))
      OR (public.has_role(_uid, 'client') AND EXISTS (
            SELECT 1 FROM public.matters m JOIN public.client_members cm ON cm.client_id = m.client_id
            WHERE m.id = _matter AND cm.user_id = _uid))
$$;

-- Can this user work on the matter (add tasks, updates, documents)?
CREATE OR REPLACE FUNCTION public.can_work_matter(_uid UUID, _matter UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.is_senior(_uid)
      OR (public.is_fee_earner(_uid) AND EXISTS (
            SELECT 1 FROM public.matter_members mm
            WHERE mm.matter_id = _matter AND mm.user_id = _uid AND mm.role_on_matter <> 'viewer'))
$$;

CREATE OR REPLACE FUNCTION public.is_client_user_of_matter(_uid UUID, _matter UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role(_uid, 'client') AND EXISTS (
    SELECT 1 FROM public.matters m JOIN public.client_members cm ON cm.client_id = m.client_id
    WHERE m.id = _matter AND cm.user_id = _uid)
$$;

-- clients: seniors full; fee earners read clients of matters they're on; client users read their own org.
CREATE POLICY "seniors manage clients" ON public.clients FOR ALL USING (public.is_senior(auth.uid())) WITH CHECK (public.is_senior(auth.uid()));
CREATE POLICY "fee earners read their clients" ON public.clients FOR SELECT USING (
  public.is_fee_earner(auth.uid()) AND EXISTS (
    SELECT 1 FROM public.matters m JOIN public.matter_members mm ON mm.matter_id = m.id
    WHERE m.client_id = clients.id AND mm.user_id = auth.uid()));
CREATE POLICY "client users read own org" ON public.clients FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.client_members cm WHERE cm.client_id = clients.id AND cm.user_id = auth.uid()));

CREATE POLICY "seniors manage client members" ON public.client_members FOR ALL USING (public.is_senior(auth.uid())) WITH CHECK (public.is_senior(auth.uid()));
CREATE POLICY "users see own memberships" ON public.client_members FOR SELECT USING (user_id = auth.uid());

-- matters: visibility via can_see_matter; seniors create/delete; workers update.
CREATE POLICY "see matters" ON public.matters FOR SELECT USING (public.can_see_matter(auth.uid(), id));
CREATE POLICY "seniors open matters" ON public.matters FOR INSERT WITH CHECK (public.is_senior(auth.uid()));
CREATE POLICY "workers update matters" ON public.matters FOR UPDATE USING (public.can_work_matter(auth.uid(), id));
CREATE POLICY "owners delete matters" ON public.matters FOR DELETE USING (public.has_role(auth.uid(), 'owner'));

CREATE POLICY "see matter members" ON public.matter_members FOR SELECT USING (public.can_see_matter(auth.uid(), matter_id));
CREATE POLICY "seniors staff matters" ON public.matter_members FOR ALL USING (public.is_senior(auth.uid())) WITH CHECK (public.is_senior(auth.uid()));

-- Fees: lawyers, paralegals and clients must not read fee_amount. A column-level revoke does nothing while a
-- table-level SELECT grant exists, so revoke the table grant and grant every other column explicitly.
-- (The app therefore never selects '*' from matters; it names its columns.)
REVOKE SELECT ON public.matters FROM anon, authenticated;
GRANT SELECT (id, reference, client_id, title, service, markets, stage, summary, fee_currency, lead_id, opened_at,
              due_date, closed_at, created_by, created_at, updated_at) ON public.matters TO authenticated;
GRANT USAGE ON SEQUENCE public.matter_ref_seq TO authenticated;
-- Seniors read fees through this view (security definer function underneath).
CREATE OR REPLACE FUNCTION public.matter_fees()
RETURNS TABLE (matter_id UUID, fee_amount NUMERIC, fee_currency TEXT)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT id, fee_amount, fee_currency FROM public.matters WHERE public.is_senior(auth.uid())
$$;
-- Clients see their own quoted fee in the portal.
CREATE OR REPLACE FUNCTION public.my_matter_fees()
RETURNS TABLE (matter_id UUID, fee_amount NUMERIC, fee_currency TEXT)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT m.id, m.fee_amount, m.fee_currency FROM public.matters m
  WHERE public.is_client_user_of_matter(auth.uid(), m.id)
$$;

-- ---------- Tasks ----------
CREATE TABLE public.tasks (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  matter_id      UUID NOT NULL REFERENCES public.matters(id) ON DELETE CASCADE,
  title          TEXT NOT NULL,
  detail         TEXT,
  status         TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'doing', 'blocked', 'done')),
  priority       TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high')),
  assignee_id    UUID REFERENCES auth.users(id),
  due_date       DATE,
  client_visible BOOLEAN NOT NULL DEFAULT false,      -- shows as a milestone in the portal
  created_by     UUID REFERENCES auth.users(id),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at   TIMESTAMPTZ
);
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
CREATE INDEX tasks_matter_idx ON public.tasks (matter_id);
CREATE INDEX tasks_assignee_idx ON public.tasks (assignee_id) WHERE status <> 'done';

CREATE POLICY "staff see tasks" ON public.tasks FOR SELECT USING (
  public.is_fee_earner(auth.uid()) AND public.can_see_matter(auth.uid(), matter_id));
CREATE POLICY "clients see shared tasks" ON public.tasks FOR SELECT USING (
  client_visible AND public.is_client_user_of_matter(auth.uid(), matter_id));
CREATE POLICY "workers write tasks" ON public.tasks FOR INSERT WITH CHECK (public.can_work_matter(auth.uid(), matter_id));
CREATE POLICY "workers update tasks" ON public.tasks FOR UPDATE USING (public.can_work_matter(auth.uid(), matter_id));
CREATE POLICY "seniors delete tasks" ON public.tasks FOR DELETE USING (public.is_senior(auth.uid()));

-- ---------- Work updates (the matter timeline) ----------
CREATE TABLE public.matter_updates (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  matter_id  UUID NOT NULL REFERENCES public.matters(id) ON DELETE CASCADE,
  author_id  UUID NOT NULL REFERENCES auth.users(id) DEFAULT auth.uid(),
  kind       TEXT NOT NULL DEFAULT 'note' CHECK (kind IN ('note', 'filing', 'authority', 'stage', 'client_message')),
  visibility TEXT NOT NULL DEFAULT 'internal' CHECK (visibility IN ('internal', 'client')),
  body       TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.matter_updates ENABLE ROW LEVEL SECURITY;
CREATE INDEX matter_updates_matter_idx ON public.matter_updates (matter_id, created_at DESC);

CREATE POLICY "staff see updates" ON public.matter_updates FOR SELECT USING (
  public.is_fee_earner(auth.uid()) AND public.can_see_matter(auth.uid(), matter_id));
CREATE POLICY "clients see shared updates" ON public.matter_updates FOR SELECT USING (
  visibility = 'client' AND public.is_client_user_of_matter(auth.uid(), matter_id));
CREATE POLICY "workers post updates" ON public.matter_updates FOR INSERT WITH CHECK (
  author_id = auth.uid() AND public.can_work_matter(auth.uid(), matter_id));
-- Clients may post messages on their own matters; they are always client-visible.
CREATE POLICY "clients post messages" ON public.matter_updates FOR INSERT WITH CHECK (
  author_id = auth.uid() AND kind = 'client_message' AND visibility = 'client'
  AND public.is_client_user_of_matter(auth.uid(), matter_id));
-- Updates are a record: no edits; only owners delete.
CREATE POLICY "owners delete updates" ON public.matter_updates FOR DELETE USING (public.has_role(auth.uid(), 'owner'));

-- ---------- Documents (files live in the 'matter-files' storage bucket under <matter_id>/...) ----------
CREATE TABLE public.documents (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  matter_id    UUID NOT NULL REFERENCES public.matters(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  storage_path TEXT NOT NULL UNIQUE,
  size_bytes   BIGINT,
  visibility   TEXT NOT NULL DEFAULT 'internal' CHECK (visibility IN ('internal', 'client')),
  uploaded_by  UUID REFERENCES auth.users(id) DEFAULT auth.uid(),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "staff see documents" ON public.documents FOR SELECT USING (
  public.is_fee_earner(auth.uid()) AND public.can_see_matter(auth.uid(), matter_id));
CREATE POLICY "clients see shared documents" ON public.documents FOR SELECT USING (
  visibility = 'client' AND public.is_client_user_of_matter(auth.uid(), matter_id));
CREATE POLICY "workers add documents" ON public.documents FOR INSERT WITH CHECK (public.can_work_matter(auth.uid(), matter_id));
CREATE POLICY "clients upload to their matters" ON public.documents FOR INSERT WITH CHECK (
  visibility = 'client' AND public.is_client_user_of_matter(auth.uid(), matter_id));
CREATE POLICY "workers update documents" ON public.documents FOR UPDATE USING (public.can_work_matter(auth.uid(), matter_id));
CREATE POLICY "seniors delete documents" ON public.documents FOR DELETE USING (public.is_senior(auth.uid()));

INSERT INTO storage.buckets (id, name, public) VALUES ('matter-files', 'matter-files', false)
ON CONFLICT (id) DO NOTHING;

-- Storage objects follow the documents table: the first path segment is the matter id.
CREATE POLICY "matter files read" ON storage.objects FOR SELECT USING (
  bucket_id = 'matter-files' AND EXISTS (
    SELECT 1 FROM public.documents d WHERE d.storage_path = storage.objects.name));
CREATE POLICY "matter files upload" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'matter-files' AND (
    public.can_work_matter(auth.uid(), ((storage.foldername(name))[1])::uuid)
    OR public.is_client_user_of_matter(auth.uid(), ((storage.foldername(name))[1])::uuid)));
CREATE POLICY "matter files delete" ON storage.objects FOR DELETE USING (
  bucket_id = 'matter-files' AND public.is_senior(auth.uid()));

-- ---------- Enquiries (website contact form) ----------
CREATE TABLE public.enquiries (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 200),
  email         TEXT NOT NULL CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  company       TEXT CHECK (char_length(company) <= 200),
  origin        TEXT CHECK (char_length(origin) <= 100),
  markets       TEXT[] NOT NULL DEFAULT '{}',
  category      TEXT CHECK (char_length(category) <= 100),
  stage         TEXT CHECK (char_length(stage) <= 100),
  message       TEXT NOT NULL CHECK (char_length(message) BETWEEN 1 AND 5000),
  status        TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'call_booked', 'converted', 'declined')),
  assigned_to   UUID REFERENCES auth.users(id),
  matter_id     UUID REFERENCES public.matters(id),
  internal_note TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

-- Anyone may submit, but only the public fields and only as 'new'. Nobody outside the firm can read.
CREATE POLICY "public submits enquiries" ON public.enquiries FOR INSERT TO anon, authenticated WITH CHECK (
  status = 'new' AND assigned_to IS NULL AND matter_id IS NULL AND internal_note IS NULL);
CREATE POLICY "fee earners read enquiries" ON public.enquiries FOR SELECT USING (public.is_fee_earner(auth.uid()));
CREATE POLICY "fee earners triage enquiries" ON public.enquiries FOR UPDATE USING (public.is_fee_earner(auth.uid()));
CREATE POLICY "seniors delete enquiries" ON public.enquiries FOR DELETE USING (public.is_senior(auth.uid()));

-- ---------- Editorial workflow on content ----------
CREATE TYPE public.content_status AS ENUM ('draft', 'in_review', 'scheduled', 'published', 'archived');

ALTER TABLE public.content
  ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS status public.content_status NOT NULL DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS markets TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS cover_url TEXT,
  ADD COLUMN IF NOT EXISTS seo_title TEXT,
  ADD COLUMN IF NOT EXISTS seo_description TEXT,
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES auth.users(id);

-- Keep the legacy draft flag in step with status (the public site still filters on it).
UPDATE public.content SET status = CASE WHEN draft THEN 'draft'::public.content_status ELSE 'published'::public.content_status END;

CREATE OR REPLACE FUNCTION public.content_workflow_guard()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  -- Only partners and owners may publish, schedule or archive.
  IF NEW.status IN ('published', 'scheduled', 'archived')
     AND (TG_OP = 'INSERT' OR NEW.status IS DISTINCT FROM OLD.status)
     AND NOT public.is_senior(auth.uid()) THEN
    RAISE EXCEPTION 'Only a partner can publish, schedule or archive content';
  END IF;
  IF NEW.status = 'published' AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM 'published') THEN
    NEW.published_at := COALESCE(NEW.published_at, now());
    NEW.reviewed_by := auth.uid();
  END IF;
  NEW.draft := NEW.status <> 'published';
  RETURN NEW;
END;
$$;
CREATE TRIGGER content_workflow BEFORE INSERT OR UPDATE ON public.content
  FOR EACH ROW EXECUTE FUNCTION public.content_workflow_guard();

-- Revisions: a snapshot on every save.
CREATE TABLE public.content_revisions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID NOT NULL REFERENCES public.content(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  body       TEXT NOT NULL,
  status     public.content_status NOT NULL,
  saved_by   UUID REFERENCES auth.users(id) DEFAULT auth.uid(),
  saved_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.content_revisions ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE FUNCTION public.snapshot_content()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.content_revisions (content_id, title, body, status) VALUES (NEW.id, NEW.title, NEW.content, NEW.status);
  RETURN NEW;
END;
$$;
CREATE TRIGGER content_snapshot AFTER INSERT OR UPDATE OF title, content, status ON public.content
  FOR EACH ROW EXECUTE FUNCTION public.snapshot_content();
CREATE POLICY "writers read revisions" ON public.content_revisions FOR SELECT USING (
  public.is_senior(auth.uid()) OR public.has_role(auth.uid(), 'lawyer') OR public.has_role(auth.uid(), 'editor'));

-- Replace the old admin-only content policies.
DROP POLICY IF EXISTS "Published content is viewable by everyone" ON public.content;
DROP POLICY IF EXISTS "Only admins can create content" ON public.content;
DROP POLICY IF EXISTS "Only admins can update content" ON public.content;
DROP POLICY IF EXISTS "Only admins can delete content" ON public.content;

CREATE POLICY "public reads published content" ON public.content FOR SELECT USING (
  status = 'published' OR public.is_staff(auth.uid()));
CREATE POLICY "writers create content" ON public.content FOR INSERT WITH CHECK (
  public.is_senior(auth.uid()) OR public.has_role(auth.uid(), 'lawyer') OR public.has_role(auth.uid(), 'editor'));
-- Writers edit their own pieces until they are published; seniors edit anything.
CREATE POLICY "writers edit content" ON public.content FOR UPDATE USING (
  public.is_senior(auth.uid())
  OR ((public.has_role(auth.uid(), 'lawyer') OR public.has_role(auth.uid(), 'editor'))
      AND created_by = auth.uid() AND status IN ('draft', 'in_review')));
CREATE POLICY "seniors delete content" ON public.content FOR DELETE USING (public.is_senior(auth.uid()));

-- Authors: seniors manage (replaces the is_admin checks).
DROP POLICY IF EXISTS "Only admins can create authors" ON public.authors;
DROP POLICY IF EXISTS "Only admins can update authors" ON public.authors;
DROP POLICY IF EXISTS "Only admins can delete authors" ON public.authors;
DROP POLICY IF EXISTS "Admins can view full author data including emails" ON public.authors;
CREATE POLICY "seniors manage authors" ON public.authors FOR ALL USING (public.is_senior(auth.uid())) WITH CHECK (public.is_senior(auth.uid()));

-- ---------- Audit log ----------
CREATE TABLE public.audit_log (
  id         BIGSERIAL PRIMARY KEY,
  actor_id   UUID DEFAULT auth.uid(),
  action     TEXT NOT NULL,            -- INSERT / UPDATE / DELETE
  table_name TEXT NOT NULL,
  row_id     UUID,
  changes    JSONB,
  at         TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "seniors read audit" ON public.audit_log FOR SELECT USING (public.is_senior(auth.uid()));
-- No insert/update/delete policies: only the trigger below (security definer) writes.

CREATE OR REPLACE FUNCTION public.audit_row()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.audit_log (action, table_name, row_id, changes)
  VALUES (TG_OP, TG_TABLE_NAME,
          COALESCE((CASE WHEN TG_OP = 'DELETE' THEN OLD.id ELSE NEW.id END), NULL),
          CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE to_jsonb(NEW) END);
  RETURN COALESCE(NEW, OLD);
END;
$$;
CREATE TRIGGER audit_clients AFTER INSERT OR UPDATE OR DELETE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.audit_row();
CREATE TRIGGER audit_matters AFTER INSERT OR UPDATE OR DELETE ON public.matters FOR EACH ROW EXECUTE FUNCTION public.audit_row();
CREATE TRIGGER audit_tasks AFTER INSERT OR UPDATE OR DELETE ON public.tasks FOR EACH ROW EXECUTE FUNCTION public.audit_row();
CREATE TRIGGER audit_documents AFTER INSERT OR UPDATE OR DELETE ON public.documents FOR EACH ROW EXECUTE FUNCTION public.audit_row();
CREATE TRIGGER audit_enquiries AFTER UPDATE OR DELETE ON public.enquiries FOR EACH ROW EXECUTE FUNCTION public.audit_row();

-- Role changes are audited too (user_roles has no id column, so log the user id).
CREATE OR REPLACE FUNCTION public.audit_role()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.audit_log (action, table_name, row_id, changes)
  VALUES (TG_OP, 'user_roles', COALESCE(NEW.user_id, OLD.user_id),
          jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW)));
  RETURN COALESCE(NEW, OLD);
END;
$$;
CREATE TRIGGER audit_user_roles AFTER INSERT OR UPDATE OR DELETE ON public.user_roles FOR EACH ROW EXECUTE FUNCTION public.audit_role();

-- ---------- Housekeeping ----------
CREATE TRIGGER clients_updated BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER matters_updated BEFORE UPDATE ON public.matters FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER tasks_updated BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER enquiries_updated BEFORE UPDATE ON public.enquiries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Completing a task stamps completed_at; a stage change on a matter posts an internal timeline entry.
CREATE OR REPLACE FUNCTION public.task_completion_stamp()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.status = 'done' AND OLD.status IS DISTINCT FROM 'done' THEN NEW.completed_at := now(); END IF;
  IF NEW.status <> 'done' THEN NEW.completed_at := NULL; END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER tasks_completion BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION public.task_completion_stamp();

CREATE OR REPLACE FUNCTION public.matter_stage_note()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.stage IS DISTINCT FROM OLD.stage AND auth.uid() IS NOT NULL THEN
    INSERT INTO public.matter_updates (matter_id, author_id, kind, visibility, body)
    VALUES (NEW.id, auth.uid(), 'stage', 'client',
            'Stage moved from ' || replace(OLD.stage::text, '_', ' ') || ' to ' || replace(NEW.stage::text, '_', ' ') || '.');
    IF NEW.stage IN ('completed', 'closed') THEN NEW.closed_at := COALESCE(NEW.closed_at, current_date); END IF;
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER matters_stage_note BEFORE UPDATE OF stage ON public.matters FOR EACH ROW EXECUTE FUNCTION public.matter_stage_note();

-- Fee changes: partners and owners only (lawyers can update a matter's stage and dates, not its fee).
CREATE OR REPLACE FUNCTION public.matter_fee_guard()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF (NEW.fee_amount IS DISTINCT FROM OLD.fee_amount OR NEW.fee_currency IS DISTINCT FROM OLD.fee_currency)
     AND auth.uid() IS NOT NULL AND NOT public.is_senior(auth.uid()) THEN
    RAISE EXCEPTION 'Only a partner can change a fee';
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER matters_fee_guard BEFORE UPDATE ON public.matters FOR EACH ROW EXECUTE FUNCTION public.matter_fee_guard();
