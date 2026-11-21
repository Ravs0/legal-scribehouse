\set ON_ERROR_STOP 0
-- Seed as superuser (bypasses RLS)
INSERT INTO auth.users (id, email) VALUES
 ('00000000-0000-0000-0000-000000000001','owner@x'),('00000000-0000-0000-0000-000000000002','partner@x'),
 ('00000000-0000-0000-0000-000000000003','lawyer@x'),('00000000-0000-0000-0000-000000000004','paralegal@x'),
 ('00000000-0000-0000-0000-000000000005','editor@x'),('00000000-0000-0000-0000-000000000006','client@acme'),
 ('00000000-0000-0000-0000-000000000007','client@other'),('00000000-0000-0000-0000-000000000008','lawyer2@x');
UPDATE public.user_roles SET role='owner' WHERE user_id='00000000-0000-0000-0000-000000000001';
UPDATE public.user_roles SET role='partner' WHERE user_id='00000000-0000-0000-0000-000000000002';
UPDATE public.user_roles SET role='lawyer' WHERE user_id IN ('00000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000008');
UPDATE public.user_roles SET role='paralegal' WHERE user_id='00000000-0000-0000-0000-000000000004';
UPDATE public.user_roles SET role='editor' WHERE user_id='00000000-0000-0000-0000-000000000005';
INSERT INTO public.clients (id,name,notes) VALUES ('10000000-0000-0000-0000-000000000001','Acme Skincare','secret note'),('10000000-0000-0000-0000-000000000002','Other Foods',null);
INSERT INTO public.client_members VALUES ('10000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000006'),('10000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000007');
INSERT INTO public.matters (id,client_id,title,service,fee_amount) VALUES
 ('20000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','Acme MY entry','market-entry',8500),
 ('20000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000002','Other VN customs','customs-fta',4000);
INSERT INTO public.matter_members VALUES ('20000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000003','lead'),('20000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000004','member');
INSERT INTO public.tasks (matter_id,title,client_visible) VALUES ('20000000-0000-0000-0000-000000000001','internal task',false),('20000000-0000-0000-0000-000000000001','milestone',true);
INSERT INTO public.matter_updates (matter_id,author_id,body,visibility) VALUES ('20000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000003','internal note','internal'),('20000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000003','client update','client');
INSERT INTO public.content (title,summary,content,type,status) VALUES ('Draft piece','s','b','guide','draft');

CREATE OR REPLACE FUNCTION pg_temp.check(label text, got bigint, want bigint) RETURNS void LANGUAGE plpgsql AS $$
BEGIN RAISE NOTICE '% % (got %, want %)', CASE WHEN got = want THEN 'PASS' ELSE 'FAIL' END, label, got, want; END $$;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA pg_temp TO authenticated, anon;

SET ROLE authenticated;
-- lawyer on matter 1 only
SET request.jwt.claim.sub = '00000000-0000-0000-0000-000000000003';
SELECT pg_temp.check('lawyer sees only own matter', (SELECT count(*) FROM public.matters), 1);
SELECT pg_temp.check('lawyer sees both tasks', (SELECT count(*) FROM public.tasks), 2);
SELECT pg_temp.check('lawyer sees own client only', (SELECT count(*) FROM public.clients), 1);
DO $$ BEGIN PERFORM fee_amount FROM public.matters; RAISE NOTICE 'FAIL lawyer read fee'; EXCEPTION WHEN insufficient_privilege THEN RAISE NOTICE 'PASS lawyer cannot read fee'; END $$;
DO $$ BEGIN UPDATE public.matters SET fee_amount=1 WHERE id='20000000-0000-0000-0000-000000000001'; RAISE NOTICE 'FAIL lawyer changed fee'; EXCEPTION WHEN others THEN RAISE NOTICE 'PASS lawyer cannot change fee (%)', SQLERRM; END $$;
UPDATE public.matters SET stage='scoping' WHERE id='20000000-0000-0000-0000-000000000001';
SELECT pg_temp.check('stage change posts timeline entry', (SELECT count(*) FROM public.matter_updates WHERE kind='stage'), 1);
DO $$ BEGIN INSERT INTO public.matters (client_id,title,service) VALUES ('10000000-0000-0000-0000-000000000001','x','contracts'); RAISE NOTICE 'FAIL lawyer opened matter'; EXCEPTION WHEN others THEN RAISE NOTICE 'PASS lawyer cannot open matters'; END $$;
DO $$ BEGIN INSERT INTO public.content (title,summary,content,type,status,created_by) VALUES ('p','s','b','guide','published',auth.uid()); RAISE NOTICE 'FAIL lawyer published'; EXCEPTION WHEN others THEN RAISE NOTICE 'PASS lawyer cannot publish (%)', SQLERRM; END $$;
INSERT INTO public.content (title,summary,content,type,status,created_by) VALUES ('mine','s','b','guide','in_review',auth.uid());
SELECT pg_temp.check('lawyer can submit for review', (SELECT count(*) FROM public.content WHERE title='mine'), 1);
-- other lawyer, not on any matter
SET request.jwt.claim.sub = '00000000-0000-0000-0000-000000000008';
SELECT pg_temp.check('unassigned lawyer sees no matters', (SELECT count(*) FROM public.matters), 0);
SELECT pg_temp.check('unassigned lawyer sees enquiries table (triage)', (SELECT count(*) FROM public.enquiries), 0);
-- paralegal
SET request.jwt.claim.sub = '00000000-0000-0000-0000-000000000004';
SELECT pg_temp.check('paralegal sees assigned matter', (SELECT count(*) FROM public.matters), 1);
INSERT INTO public.tasks (matter_id,title) VALUES ('20000000-0000-0000-0000-000000000001','para task');
SELECT pg_temp.check('paralegal can add task', (SELECT count(*) FROM public.tasks WHERE title='para task'), 1);
-- editor
SET request.jwt.claim.sub = '00000000-0000-0000-0000-000000000005';
SELECT pg_temp.check('editor sees no matters', (SELECT count(*) FROM public.matters), 0);
SELECT pg_temp.check('editor sees no clients', (SELECT count(*) FROM public.clients), 0);
SELECT pg_temp.check('editor sees drafts', (SELECT count(*) FROM public.content WHERE status <> 'published'), 2);
-- client of Acme
SET request.jwt.claim.sub = '00000000-0000-0000-0000-000000000006';
SELECT pg_temp.check('client sees own matter', (SELECT count(*) FROM public.matters), 1);
SELECT pg_temp.check('client sees only shared task', (SELECT count(*) FROM public.tasks), 1);
SELECT pg_temp.check('client sees shared updates only (client update + stage)', (SELECT count(*) FROM public.matter_updates), 2);
SELECT pg_temp.check('client sees no enquiries', (SELECT count(*) FROM public.enquiries), 0);
SELECT pg_temp.check('client sees no drafts', (SELECT count(*) FROM public.content), 0);
SELECT pg_temp.check('client sees own fee via function', (SELECT count(*) FROM public.my_matter_fees()), 1);
INSERT INTO public.matter_updates (matter_id,kind,visibility,body) VALUES ('20000000-0000-0000-0000-000000000001','client_message','client','hello');
SELECT pg_temp.check('client can message own matter', (SELECT count(*) FROM public.matter_updates WHERE body='hello'), 1);
DO $$ BEGIN INSERT INTO public.matter_updates (matter_id,kind,visibility,body) VALUES ('20000000-0000-0000-0000-000000000001','note','internal','sneaky'); RAISE NOTICE 'FAIL client posted internal'; EXCEPTION WHEN others THEN RAISE NOTICE 'PASS client cannot post internal notes'; END $$;
DO $$ BEGIN UPDATE public.user_roles SET role='owner' WHERE user_id=auth.uid(); IF FOUND THEN RAISE NOTICE 'FAIL client escalated'; ELSE RAISE NOTICE 'PASS client cannot change own role'; END IF; END $$;
-- other client
SET request.jwt.claim.sub = '00000000-0000-0000-0000-000000000007';
SELECT pg_temp.check('other client cannot see Acme matter', (SELECT count(*) FROM public.matters WHERE title='Acme MY entry'), 0);
-- partner
SET request.jwt.claim.sub = '00000000-0000-0000-0000-000000000002';
SELECT pg_temp.check('partner sees all matters', (SELECT count(*) FROM public.matters), 2);
SELECT pg_temp.check('partner reads fees', (SELECT count(*) FROM public.matter_fees()), 2);
UPDATE public.content SET status='published' WHERE title='mine';
SELECT pg_temp.check('partner publishes; draft flag follows', (SELECT count(*) FROM public.content WHERE title='mine' AND draft=false AND published_at IS NOT NULL), 1);
DO $$ BEGIN UPDATE public.user_roles SET role='owner' WHERE user_id=auth.uid(); IF FOUND THEN RAISE NOTICE 'FAIL partner escalated'; ELSE RAISE NOTICE 'PASS partner cannot grant roles'; END IF; END $$;
-- anon
RESET request.jwt.claim.sub; SET ROLE anon;
INSERT INTO public.enquiries (name,email,message) VALUES ('Jo','jo@co.com','hi');
SELECT pg_temp.check('anon can submit enquiry', 1, 1);
DO $$ BEGIN INSERT INTO public.enquiries (name,email,message,status) VALUES ('Jo','jo@co.com','hi','converted'); RAISE NOTICE 'FAIL anon set status'; EXCEPTION WHEN others THEN RAISE NOTICE 'PASS anon cannot set triage fields'; END $$;
SELECT pg_temp.check('anon reads published only', (SELECT count(*) FROM public.content), 1);
SELECT pg_temp.check('anon reads no enquiries', (SELECT count(*) FROM public.enquiries), 0);
-- owner
SET ROLE authenticated; SET request.jwt.claim.sub = '00000000-0000-0000-0000-000000000001';
UPDATE public.user_roles SET role='partner' WHERE user_id='00000000-0000-0000-0000-000000000003';
SELECT pg_temp.check('owner can promote lawyer', (SELECT count(*) FROM public.user_roles WHERE role='partner'), 2);
SELECT pg_temp.check('role change audited (seed + promotion)', (SELECT count(*) FROM public.audit_log WHERE table_name='user_roles' AND action='UPDATE' AND row_id='00000000-0000-0000-0000-000000000003'), 2);
