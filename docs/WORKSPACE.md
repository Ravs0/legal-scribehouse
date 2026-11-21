# Straitline workspace, client portal, blog and database

This document covers the parts of the site that sit behind sign-in, the publishing workflow for articles, the
database structure, and the access levels. Design notes for the public site are in `DESIGN.md`.

## What's where

| Area | URL | Who | Code |
| --- | --- | --- | --- |
| Public site | `/`, `/services`, `/services/:slug`, `/markets`, `/markets/:code`, `/team`, `/insights`, `/insights/:slug`, `/privacy`, `/terms`, `/disclaimer` | Everyone | `src/pages`, `src/components/home` |
| Sign-in | `/login` | Firm and clients | `src/workspace/pages/Login.tsx` |
| Workspace | `/workspace/...` | Firm (owner, partner, lawyer, paralegal, editor) | `src/workspace` |
| Client portal | `/portal/...` | Clients | `src/workspace/pages/Portal.tsx` |
| Database | Supabase | | `supabase/migrations`, tests in `supabase/tests` |

### Workspace pages

- **Overview**: my open tasks, open matters, new enquiries, articles waiting for review, the latest updates.
- **Matters**: every matter you can see, filtered by stage and service. Partners open new matters (reference numbers
  `STL-YYYY-NNNN` are assigned automatically).
- **Matter page**:
  - **Timeline**: the work-update log. Each entry is a note, filing, authority response, stage change or client
    message, and is either *internal* or *shared with the client*.
  - **Tasks**: a board (To do, Doing, Blocked, Done) with assignee, due date and priority. Marking a task as a
    *client milestone* shows it in the portal.
  - **Documents**: files kept in the `matter-files` storage bucket, internal or shared.
  - **Side panel**: progress, dates, lead, the fixed fee (partners only), the team on the matter and client notes
    (internal).
- **Enquiries**: every submission from the website form. Set a status and owner, keep an internal note, reply by
  email, or **open a matter** from the enquiry. That creates or matches the client, carries the markets and
  message over, and marks the enquiry converted.
- **Clients**: organisations, their contacts, status, internal notes and matters.
- **Articles**: write in Markdown with a live preview. The workflow is *Draft → In review → Published* (and
  *Archived*). Lawyers and editors write and submit; partners publish. Published articles appear on `/insights`
  and on the related service and market pages straight away.
- **Team & access**: everyone's access level and the full access matrix. Only the owner changes levels.
- **Activity log**: changes to clients, matters, tasks, documents, enquiries and access (partners and owner).

### Client portal

Clients see only their own organisation's matters. For each one they see:
- the stage and summary;
- the milestones (tasks marked as client milestones);
- updates marked *shared*;
- shared documents, and they can upload their own;
- their quoted fixed fee.

They can message the team, and their messages appear on the matter's timeline. They never see internal notes,
internal tasks, internal files, client notes or other clients' data.

## Access levels

| Can… | Owner | Partner | Lawyer | Paralegal | Editor | Client |
| --- | :-: | :-: | :-: | :-: | :-: | :-: |
| Grant and change access | ✓ | | | | | |
| See every client and matter | ✓ | ✓ | | | | |
| Open matters and staff them | ✓ | ✓ | | | | |
| See and change fees | ✓ | ✓ | | | | own (read) |
| Publish, schedule, archive articles | ✓ | ✓ | | | | |
| Read the audit log | ✓ | ✓ | | | | |
| Work on matters they're staffed on | ✓ | ✓ | ✓ | ✓ | | |
| Triage website enquiries | ✓ | ✓ | ✓ | ✓ | | |
| Write articles, submit for review | ✓ | ✓ | ✓ | | ✓ | |
| See shared milestones, updates, files on own matters | | | | | | ✓ |
| Message the firm on own matters | | | | | | ✓ |

The database enforces this with row-level security, so it holds whichever app or API key is used.
`src/workspace/access.ts` mirrors the same rules for the interface; **change both together**. On a matter, a
person can be *lead*, *member* or *viewer* (viewers read but cannot add tasks, updates or files).

## Database structure

Migration: `supabase/migrations/20261121090000_workspace_access_and_matters.sql` (on top of the two earlier
migrations that created `profiles`, `authors` and `content`).

```
auth.users ─┬─ profiles (name, title, base city)
            ├─ user_roles (role: owner | partner | lawyer | paralegal | editor | client)
            └─ client_members ── clients (name, country, industry, contact, status, internal notes)
                                   │
                                   └── matters (reference, title, service, markets[], stage, summary,
                                        │        fee_amount*, fee_currency, lead, opened/due/closed dates)
                                        ├── matter_members (user, lead | member | viewer)
                                        ├── tasks (title, status, priority, assignee, due, client_visible)
                                        ├── matter_updates (author, kind, visibility internal | client, body)
                                        └── documents (name, storage_path in bucket matter-files, visibility)

enquiries (website form; status new → contacted → call_booked → converted | declined; owner; matter link)
content (articles: slug, status draft | in_review | scheduled | published | archived, markets[], SEO fields)
 └── content_revisions (snapshot on every save)
audit_log (actor, action, table, row, changes) — written only by triggers
```
`*` `fee_amount` is not readable through normal queries. Partners read fees through `matter_fees()`; clients
read their own through `my_matter_fees()`. A trigger blocks fee changes by anyone below partner.

Automatic behaviour:
- **New users** get the `client` role; the owner promotes staff.
- **Stage changes** on a matter post a shared timeline entry, and stamp the closed date when a matter completes.
- **Completing a task** stamps `completed_at`.
- **Publishing** is limited to partners and owners by a trigger. It also sets `published_at` and `reviewed_by`,
  and keeps the old `draft` flag in step.
- **Every save of an article** stores a revision.
- **Changes to clients, matters, tasks, documents, enquiries and roles** are written to `audit_log`.
- **Anyone can submit an enquiry**, but only into the public fields and only as `new`. Nobody outside the firm can
  read enquiries.

### Testing the rules

```
bash supabase/tests/run.sh
```
This needs Postgres 16 locally. It runs every migration against a throwaway database (with a stub of Supabase's
`auth` and `storage` schemas), signs in as each role, and prints PASS or FAIL for 36 rules. It exits non-zero on
any failure. Run it after any change to a migration.

## Demo mode and going live

The workspace has two backends behind one interface (`src/workspace/data/repo.ts`):

- **Demo** (default): seeded fictional people, clients, matters and articles, stored in the visitor's browser.
  `/login` lists a demo person for each access level, and the demo applies the same access rules. The website's
  contact form drops enquiries into the demo inbox. "Reset demo data" in the banner restores the seed.
- **Supabase**: the real database. To switch:
  1. Apply the migrations to the Supabase project (`supabase db push`, or paste the SQL into the SQL editor in
     order).
  2. Run the access tests above.
  3. Set `VITE_WORKSPACE_BACKEND=supabase` in the environment and rebuild.
  4. Create the first account (Supabase Auth). In the SQL editor, run
     `update public.user_roles set role = 'owner' where user_id = '<that user id>';`. From then on, manage access
     on the Team & access page.
  5. Regenerate the typed client: `supabase gen types typescript --project-id <id> > src/integrations/supabase/types.ts`.
  6. For client portal users: create their account, then link them to their organisation in `client_members`
     (an "Invite to portal" button is a sensible next addition).

## Before launch

- [ ] Real people in `src/data/team.ts`, and real local partner firms in the hero.
- [ ] Review the starter articles (`src/workspace/data/articles.ts`) or replace them with the firm's own.
- [ ] Review the privacy, terms and disclaimer drafts (`src/pages/Legal.tsx`) against the PDPA and professional rules.
- [ ] Confirm service timelines and inclusions (`src/data/serviceDetails.ts`).
- [ ] Rate-limit or add a captcha to enquiry submissions (the form has a honeypot; the database checks lengths
      and email format).
- [ ] Decide a retention period for declined enquiries and add a scheduled clean-up.
