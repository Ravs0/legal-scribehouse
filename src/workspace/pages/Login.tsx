import { FormEvent, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { isStaff, ROLE_LABEL, ROLE_SUMMARY } from '../access';
import { BACKEND, repo } from '../data';
import { useSession } from '../session';
import { Avatar, Field, TextInput } from '../components/kit';
import { DemoBanner, Mark } from '../components/Shell';

const Login = () => {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const { signIn, signInAs } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const go = (role: string) => {
    const next = params.get('next');
    nav(next && next.startsWith(role === 'client' ? '/portal' : '/workspace') ? next : role === 'client' ? '/portal' : '/workspace', { replace: true });
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const u = await signIn(email, password);
      go(isStaff(u.role) ? 'staff' : 'client');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-in failed.');
    } finally {
      setBusy(false);
    }
  };

  const people = repo.demoPeople?.() ?? [];

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <DemoBanner />
      <div className="grid flex-1 place-items-center px-4 py-8 md:py-12">
        <div className="w-full max-w-[960px]">
          <div className="mb-5 flex items-center justify-between gap-3">
            <Mark label="Sign in" to="/login" />
            <Link to="/" className="type-label-md rounded-full px-3 py-1.5 text-muted-foreground hover:bg-foreground/[0.05] hover:text-foreground">← Back to the site</Link>
          </div>
          <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:gap-6">
            <form onSubmit={submit} className="surface-2 flex flex-col rounded-[16px] p-6 md:p-8" aria-labelledby="login-title">
              <span className="icon-well inline-flex h-10 w-10 items-center justify-center rounded-[10px] text-primary-ink">
                <Lock className="h-5 w-5" aria-hidden="true" />
              </span>
              <h1 id="login-title" className="type-headline-sm mt-5">Sign in</h1>
              <p className="type-body-sm mt-1 text-muted-foreground">For the Straitline team and clients with portal access.</p>
              <div className="mt-6 space-y-5">
                <Field label="Email">
                  <TextInput type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </Field>
                <Field label="Password" hint={BACKEND === 'demo' ? 'Demo mode: any password works for a demo email.' : undefined}>
                  <TextInput type="password" autoComplete="current-password" required={BACKEND !== 'demo'} value={password} onChange={(e) => setPassword(e.target.value)} />
                </Field>
              </div>
              {error && <p role="alert" className="type-body-sm mt-4 text-destructive">{error}</p>}
              <Button type="submit" size="lg" className="mt-7 w-full" disabled={busy}>
                {busy ? 'Signing in…' : 'Sign in'}
              </Button>
              <p className="type-meta mt-auto pt-6 text-muted-foreground">Access is set by the firm. Ask your Straitline contact if you need an account.</p>
            </form>

            {BACKEND === 'demo' && (
              <section className="surface-1 rounded-[16px] p-6 md:p-8" aria-labelledby="demo-title">
                <h2 id="demo-title" className="type-title-lg">Try it as someone</h2>
                <p className="type-body-sm mt-1 text-muted-foreground">Each demo person has a different access level, so you can see exactly what each role sees.</p>
                <ul className="-mx-2 mt-4 space-y-0.5">
                  {people.map((p) => (
                    <li key={p.id}>
                      <button
                        type="button"
                        className="ws-row group flex w-full items-center gap-3 rounded-[12px] px-2 py-2.5 text-left"
                        onClick={async () => {
                          const u = await signInAs(p.id);
                          go(isStaff(u.role) ? 'staff' : 'client');
                        }}
                      >
                        <Avatar name={p.name} className="h-10 w-10" />
                        <span className="min-w-0 flex-1">
                          <span className="type-label-lg block">
                            {p.name} <span className="font-medium text-muted-foreground">· {ROLE_LABEL[p.role]}</span>
                          </span>
                          <span className="type-body-sm block text-muted-foreground">{ROLE_SUMMARY[p.role]}</span>
                        </span>
                        <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary-ink" aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
