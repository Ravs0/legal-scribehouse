import { ReactNode, useEffect, useState } from 'react';
import { Link, NavLink, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BookOpenText, Briefcase, Building2, Inbox, LayoutDashboard, LogOut, Menu, RotateCcw, ScrollText, Users, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeKey } from '@/components/site/ThemeKey';
import { cn } from '@/lib/utils';
import { can, isStaff, ROLE_LABEL } from '../access';
import { BACKEND, repo } from '../data';
import { useSession } from '../session';
import type { Person } from '../types';
import { Avatar, Loading } from './kit';
import '../workspace.css';

const NAV: { to: string; label: string; icon: typeof Briefcase; show: (u: Person) => boolean; end?: boolean }[] = [
  { to: '/workspace', label: 'Overview', icon: LayoutDashboard, show: () => true, end: true },
  { to: '/workspace/matters', label: 'Matters', icon: Briefcase, show: (u) => u.role !== 'editor' },
  { to: '/workspace/enquiries', label: 'Enquiries', icon: Inbox, show: can.seeEnquiries },
  { to: '/workspace/clients', label: 'Clients', icon: Building2, show: can.manageClients },
  { to: '/workspace/articles', label: 'Articles', icon: BookOpenText, show: can.writeArticles },
  { to: '/workspace/team', label: 'Team & access', icon: Users, show: can.seeTeam },
  { to: '/workspace/activity', label: 'Activity log', icon: ScrollText, show: can.seeAudit },
];

export const Mark = ({ label = 'Workspace', to = '/workspace' }: { label?: string; to?: string }) => (
  <Link to={to} className="flex min-w-0 items-center gap-2.5">
    <span aria-hidden="true" className="btn-filled flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] font-display text-[15px] font-semibold text-primary-foreground">S</span>
    <span className="font-display text-[17px] font-semibold leading-none tracking-[-0.02em]">Straitline</span>
    <span className="type-meta rounded-full border border-border px-2 py-0.5 text-muted-foreground">{label}</span>
  </Link>
);

export const DemoBanner = () => {
  if (BACKEND !== 'demo') return null;
  return (
    <div className="type-meta flex flex-wrap items-center justify-center gap-x-3 gap-y-1 bg-primary/[0.12] px-4 py-1.5 text-center text-primary-ink">
      Demo mode: fictional data, stored only in this browser.
      <button
        type="button"
        className="inline-flex items-center gap-1 underline underline-offset-2"
        onClick={() => {
          repo.resetDemo?.();
          window.location.reload();
        }}
      >
        <RotateCcw className="h-3 w-3" aria-hidden="true" /> Reset demo data
      </button>
    </div>
  );
};

const UserCard = ({ user, onSignOut }: { user: Person; onSignOut: () => void }) => (
  <div className="mx-3 mb-3 flex items-center gap-2.5 rounded-[12px] border border-border bg-background/60 p-2">
    <Avatar name={user.name} className="h-9 w-9" />
    <div className="min-w-0 flex-1">
      <p className="type-label-md truncate">{user.name}</p>
      <p className="type-meta truncate text-muted-foreground">{ROLE_LABEL[user.role]}</p>
    </div>
    <Button variant="ghost" size="icon-sm" onClick={onSignOut} aria-label="Sign out">
      <LogOut />
    </Button>
  </div>
);

/** Guards a route: signed in, and (for /workspace) a firm member. Clients go to the portal. */
export const RequireUser = ({ area, children }: { area: 'workspace' | 'portal'; children: ReactNode }) => {
  const { user, ready, load } = useSession();
  const loc = useLocation();
  useEffect(() => {
    if (!ready) void load();
  }, [ready, load]);
  if (!ready) return <div className="grid min-h-dvh place-items-center bg-background"><div className="w-64"><Loading rows={2} /></div></div>;
  if (!user) return <Navigate to={`/login?next=${encodeURIComponent(loc.pathname)}`} replace />;
  if (area === 'workspace' && !isStaff(user.role)) return <Navigate to="/portal" replace />;
  if (area === 'portal' && isStaff(user.role)) return <Navigate to="/workspace" replace />;
  return <>{children}</>;
};

export const WorkspaceShell = () => {
  const user = useSession((s) => s.user)!;
  const signOut = useSession((s) => s.signOut);
  const nav = useNavigate();
  const loc = useLocation();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [loc.pathname]);
  const out = async () => {
    await signOut();
    nav('/login');
  };
  const items = NAV.filter((n) => n.show(user));
  const links = (
    <nav aria-label="Workspace" className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
      {items.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            cn(
              'type-label-lg flex h-10 items-center gap-3 rounded-full px-3.5',
              isActive ? 'btn-raised bg-card text-primary-ink' : 'text-muted-foreground transition-colors hover:bg-foreground/[0.05] hover:text-foreground',
            )
          }
        >
          <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} aria-hidden="true" />
          <span className="truncate">{label}</span>
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="ws flex min-h-dvh flex-col bg-background">
      <div className="flex min-h-0 flex-1">
        <aside className="sticky top-0 hidden h-dvh w-[256px] shrink-0 flex-col border-r border-border bg-card/70 lg:flex">
          <div className="flex h-16 items-center px-5">
            <Mark />
          </div>
          {links}
          <div className="flex items-center justify-between px-5 pb-3 pt-2">
            <Link to="/" className="type-meta text-muted-foreground hover:text-foreground">← Public site</Link>
            <ThemeKey className="scale-[0.85]" />
          </div>
          <UserCard user={user} onSignOut={out} />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <DemoBanner />
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur lg:hidden">
            <Mark />
            <Button variant="ghost" size="icon" onClick={() => setOpen((o) => !o)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>
              {open ? <X /> : <Menu />}
            </Button>
          </header>
          {open && (
            <div className="border-b border-border bg-card pb-1 lg:hidden">
              {links}
              <UserCard user={user} onSignOut={out} />
            </div>
          )}
          <main id="main" className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-6 md:px-8 md:py-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
