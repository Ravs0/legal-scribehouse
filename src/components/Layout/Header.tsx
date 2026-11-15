import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { HashLink } from '@/components/site/HashLink';
import { SITE } from '@/config/site';
import { INSIGHT_LINKS } from '@/config/nav';

const SECTIONS = [
  { id: 'markets', label: 'Markets' },
  { id: 'services', label: 'Services' },
  { id: 'process', label: 'How it works' },
  { id: 'check', label: 'Readiness check' },
];

export const Wordmark = () => (
  <span className="flex items-center gap-1.5 font-mono text-[15px] font-semibold uppercase tracking-[0.18em]">
    <span className="text-accent">~/</span>
    {SITE.name}
  </span>
);

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative rounded-sm"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle colour theme</span>
    </Button>
  );
};

const Header = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const inInsights = INSIGHT_LINKS.some((l) => pathname.startsWith(l.to)) || pathname.startsWith('/posts');

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link to="/" aria-label={`${SITE.name} home`} className="shrink-0">
          <Wordmark />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {SECTIONS.map((s) => (
            <HashLink key={s.id} to={s.id} className="bracket-link px-2 py-2 text-sm font-medium hover:text-primary">
              {s.label}
            </HashLink>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger
              className="bracket-link flex items-center gap-1 px-2 py-2 text-sm font-medium outline-none hover:text-primary"
              aria-current={inInsights ? 'page' : undefined}
            >
              Insights <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-sm font-mono text-sm">
              {INSIGHT_LINKS.map((l, i) => (
                <div key={l.to}>
                  {i === 1 && <DropdownMenuSeparator />}
                  <DropdownMenuItem asChild className="rounded-none">
                    <Link to={l.to}>{l.label}</Link>
                  </DropdownMenuItem>
                </div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Link
            to="/about"
            aria-current={pathname === '/about' ? 'page' : undefined}
            className="bracket-link px-2 py-2 text-sm font-medium hover:text-primary"
          >
            About
          </Link>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />
          <Button asChild size="sm" className="arrow-nudge hidden h-9 rounded-sm px-4 sm:inline-flex">
            <HashLink to="contact">
              Book a consult <span className="arrow font-mono">-&gt;</span>
            </HashLink>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-sm lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex w-full flex-col gap-0 rounded-none p-0 sm:max-w-sm">
              <SheetTitle className="flex h-16 items-center border-b border-border px-5">
                <Wordmark />
              </SheetTitle>
              <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 py-6">
                <div className="label-mono mb-3 text-muted-foreground">Sections</div>
                <ul className="space-y-1">
                  {SECTIONS.map((s, i) => (
                    <li key={s.id}>
                      <HashLink
                        to={s.id}
                        onClick={() => setOpen(false)}
                        className="flex items-baseline gap-3 py-2 font-mono text-xl"
                      >
                        <span className="text-xs text-accent">{String(i + 1).padStart(2, '0')}</span>
                        {s.label}
                      </HashLink>
                    </li>
                  ))}
                  <li>
                    <Link to="/about" onClick={() => setOpen(false)} className="flex items-baseline gap-3 py-2 font-mono text-xl">
                      <span className="text-xs text-accent">05</span>About
                    </Link>
                  </li>
                </ul>
                <div className="label-mono mb-3 mt-8 text-muted-foreground">Insights</div>
                <ul className="grid grid-cols-2 gap-1">
                  {INSIGHT_LINKS.map((l) => (
                    <li key={l.to}>
                      <Link to={l.to} onClick={() => setOpen(false)} className="block py-1.5 font-mono">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="border-t border-border p-5">
                <Button asChild size="lg" className="arrow-nudge h-12 w-full rounded-sm">
                  <HashLink to="contact" onClick={() => setOpen(false)}>
                    Book a free consult <span className="arrow ml-1 font-mono">-&gt;</span>
                  </HashLink>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
