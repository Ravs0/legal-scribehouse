import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, ChevronDown, Menu, Moon, Sun } from 'lucide-react';
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
import { INSIGHT_LINKS, SECTIONS } from '@/config/nav';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import { spawnRipple } from '@/hooks/useRipple';
import { cn } from '@/lib/utils';

export const Wordmark = ({ withDescriptor = false }: { withDescriptor?: boolean }) => (
  <span className="flex items-center gap-2.5">
    <span
      aria-hidden="true"
      className="flex h-7 w-7 items-center justify-center rounded-md font-display text-base font-extrabold text-white shadow-elevation-1"
      style={{ background: 'linear-gradient(135deg, hsl(var(--aurora-1)), hsl(var(--aurora-2)))' }}
    >
      {SITE.name[0]}
    </span>
    <span className="type-title-lg leading-none">{SITE.name}</span>
    {withDescriptor && (
      <span className="type-label-sm hidden text-muted-foreground xl:inline">{SITE.descriptor}</span>
    )}
  </span>
);

export const ThemeToggle = ({ className }: { className?: string }) => {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      className={className}
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      <Sun className="rotate-0 scale-100 transition-all duration-medium2 ease-emphasized dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute rotate-90 scale-0 transition-all duration-medium2 ease-emphasized dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Switch colour theme</span>
    </Button>
  );
};

const navLink =
  'state-layer type-label-lg relative inline-flex h-10 items-center overflow-hidden rounded-full px-3.5 transition-colors duration-short4';

const Header = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const onHome = pathname === '/';
  const active = useScrollSpy(
    SECTIONS.map((s) => s.id),
    onHome,
  );
  const inInsights = pathname.startsWith('/posts') || INSIGHT_LINKS.some((l) => pathname.startsWith(l.to));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const ripple = (e: React.PointerEvent<HTMLElement>) => spawnRipple(e.currentTarget, e.clientX, e.clientY);

  return (
    <>
      <a
        href="#main"
        className="type-label-md sr-only rounded-full bg-primary px-4 py-2.5 text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60]"
      >
        Skip to content
      </a>
      <header className="container sticky top-2 z-50 md:top-3">
        <div
          className={cn(
            'flex h-14 items-center justify-between gap-3 rounded-full border pl-4 pr-2 transition-[background-color,box-shadow,border-color] duration-medium2 ease-standard md:h-16 md:pl-6 md:pr-3',
            scrolled || open ? 'glass-strong shadow-elevation-2' : 'border-transparent',
          )}
        >
          <Link to="/" aria-label={`${SITE.name} home`} className="shrink-0 rounded-md">
            <Wordmark withDescriptor />
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
            {SECTIONS.map((s) => (
              <HashLink
                key={s.id}
                to={s.id}
                onPointerDown={ripple}
                aria-current={onHome && active === s.id ? 'true' : undefined}
                className={cn(
                  navLink,
                  onHome && active === s.id ? 'bg-primary-container text-primary-on-container' : 'text-foreground',
                )}
              >
                {s.label}
              </HashLink>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger
                onPointerDown={ripple}
                className={cn(navLink, 'gap-1 outline-none', inInsights ? 'bg-primary-container text-primary-on-container' : '')}
              >
                Insights
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" sideOffset={12} className="w-52">
                {INSIGHT_LINKS.map((l, i) => (
                  <div key={l.to}>
                    {i === 1 && <DropdownMenuSeparator />}
                    <DropdownMenuItem asChild>
                      <Link to={l.to}>{l.label}</Link>
                    </DropdownMenuItem>
                  </div>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link
              to="/about"
              onPointerDown={ripple}
              aria-current={pathname === '/about' ? 'page' : undefined}
              className={cn(navLink, pathname === '/about' && 'bg-primary-container text-primary-on-container')}
            >
              About
            </Link>
          </nav>

          <div className="flex items-center gap-1 md:gap-2">
            <ThemeToggle />
            <Button asChild icon="trailing" className="hidden lg:inline-flex">
              <HashLink to="contact">
                Book a consult <ArrowRight aria-hidden="true" />
              </HashLink>
            </Button>
            <Button asChild size="sm" className="hidden min-[480px]:inline-flex lg:hidden">
              <HashLink to="contact">Book a consult</HashLink>
            </Button>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon-lg" className="lg:hidden">
                  <Menu />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="flex flex-col gap-0 p-6">
                <SheetTitle className="flex h-10 items-center">
                  <Wordmark />
                </SheetTitle>
                <nav aria-label="Mobile" className="-mx-2 mt-8 flex-1 overflow-y-auto">
                  <ul className="space-y-1">
                    {SECTIONS.map((s) => (
                      <li key={s.id}>
                        <HashLink
                          to={s.id}
                          onPointerDown={ripple}
                          onClick={() => setOpen(false)}
                          className="state-layer type-title-md relative flex h-[52px] items-center overflow-hidden rounded-md px-3"
                        >
                          {s.label}
                        </HashLink>
                      </li>
                    ))}
                    <li>
                      <Link
                        to="/about"
                        onPointerDown={ripple}
                        onClick={() => setOpen(false)}
                        className="state-layer type-title-md relative flex h-[52px] items-center overflow-hidden rounded-md px-3"
                      >
                        About
                      </Link>
                    </li>
                  </ul>
                  <p className="type-eyebrow mb-2 mt-8 px-3 text-muted-foreground">Insights</p>
                  <ul>
                    {INSIGHT_LINKS.map((l) => (
                      <li key={l.to}>
                        <Link
                          to={l.to}
                          onPointerDown={ripple}
                          onClick={() => setOpen(false)}
                          className="state-layer type-body-md relative flex h-11 items-center overflow-hidden rounded-md pl-7 pr-3"
                        >
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
                <div className="mt-6 space-y-4 border-t border-outline-variant pt-6">
                  <div className="flex items-center justify-between">
                    <span className="type-body-md">Theme</span>
                    <ThemeToggle />
                  </div>
                  <Button asChild size="lg" icon="trailing" className="w-full">
                    <HashLink to="contact" onClick={() => setOpen(false)}>
                      Book a consult <ArrowRight aria-hidden="true" />
                    </HashLink>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
