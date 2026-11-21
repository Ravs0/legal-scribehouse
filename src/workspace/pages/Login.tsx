import { FormEvent, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { isStaff, ROLE_LABEL, ROLE_SUMMARY } from '../access';
import { BACKEND, repo } from '../data';
import { useSession } from '../session';
import { Avatar, Field } from '../components/kit';
import { DemoBanner } from '../components/Shell';

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
      <div className="grid flex-1 place-items-center px-4 py-10">
        <div className="w-full max-w-[920px]">
          <Link to="/" className="type-label-md text-muted-foreground hover:text-foreground">← Back to the site</Link>
          <div className="mt-4 grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
            <form onSubmit={submit} className="surface-2 rounded-[14px] p-6" aria-labelledby="login-title">
              <span className="icon-well inline-flex h-10 w-10 items-center justify-center rounded-[10px] text-primary-ink">
                <Lock className="h-5 w-5" aria-hidden="true" />
              </span>
              <h1 id="login-title" className="type-headline-sm mt-4">Sign in</h1>
              <p className="type-body-sm mt-1 text-muted-foreground">For the Straitline team and clients with portal access.</p>
              <div className="mt-6 space-y-4">
                <Field label="Email">
                  <Input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </Field>
                <Field label="Password" hint={BACKEND === 'demo' ? 'Demo mode: any password works for a demo email.' : undefined}>
                  <Input type="password" autoComplete="current-password" required={BACKEND !== 'demo'} value={password} onChange={(e) => setPassword(e.target.value)} />
                </Field>
              </div>
              {error && <p role="alert" className="type-body-sm mt-4 text-destructive">{error}</p>}
              <Button type="submit" className="mt-6 w-full" disabled={busy}>
                {busy ? 'Signing in…' : 'Sign in'}
              </Button>
              <p className="type-label-sm mt-4 text-muted-foreground">Access is set by the firm. Ask your Straitline contact if you need an account.</p>
            </form>

            {BACKEND === 'demo' && (
              <section className="surface-1 rounded-[14px] p-6" aria-labelledby="demo-title">
                <h2 id="demo-title" className="type-title-lg">Try it as someone</h2>
                <p className="type-body-sm mt-1 text-muted-foreground">Each demo person has a different access level, so you can see exactly what each role sees.</p>
                <ul className="mt-4 divide-y divide-border border-y border-border">
                  {people.map((p) => (
                    <li key={p.id}>
                      <button
                        type="button"
                        className="group flex w-full items-center gap-3 py-3 text-left"
                        onClick={async () => {
                          const u = await signInAs(p.id);
                          go(isStaff(u.role) ? 'staff' : 'client');
                        }}
                      >
                        <Avatar name={p.name} className="h-9 w-9" />
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
