import { PointerEvent as ReactPointerEvent, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
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
import { Magnetic } from '@/components/motion/Magnetic';
import { SITE } from '@/config/site';
import { INSIGHT_LINKS, SECTIONS } from '@/config/nav';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import { spawnRipple } from '@/hooks/useRipple';
import { cn } from '@/lib/utils';

export const Wordmark = ({ withDescriptor = false }: { withDescriptor?: boolean }) => (
  <span className="flex items-center gap-2.5">
    <span
      aria-hidden="true"
      className="pebble flex h-7 w-7 items-center justify-center font-display text-base font-extrabold text-white"
      style={{ backgroundColor: 'hsl(var(--aurora-1))', backgroundImage: 'radial-gradient(120% 90% at 30% 18%, hsl(0 0% 100% / 0.45), transparent 52%), linear-gradient(135deg, hsl(var(--aurora-1)), hsl(var(--aurora-2)))' }}
    >
      {SITE.name[0]}
    </span>
    <span className="type-title-lg leading-none">{SITE.name}</span>
    {withDescriptor && <span className="type-label-sm hidden text-muted-foreground xl:inline">{SITE.descriptor}</span>}
  </span>
);

/** Sun and moon rotate, scale and cross-fade on a spring. */
export const ThemeToggle = ({ className }: { className?: string }) => {
  const { resolvedTheme, setTheme } = useTheme();
  const icon = 'absolute transition-[transform,opacity] duration-[600ms] ease-[cubic-bezier(0.34,1.2,0.64,1)]';
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn('press-spring', className)}
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      <Sun className={cn(icon, 'rotate-0 scale-100 opacity-100 dark:rotate-90 dark:scale-[0.4] dark:opacity-0')} />
      <Moon className={cn(icon, '-rotate-90 scale-[0.4] opacity-0 dark:rotate-0 dark:scale-100 dark:opacity-100')} />
      <span className="sr-only">Switch colour theme</span>
    </Button>
  );
};

const navLink =
  'press-spring state-layer type-label-lg relative z-[1] inline-flex h-10 items-center overflow-hidden rounded-full px-3.5';

const Header = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const onHome = pathname === '/';
  const active = useScrollSpy(
    SECTIONS.map((s) => s.id),
    onHome,
  );
  const inInsights = pathname.startsWith('/posts') || INSIGHT_LINKS.some((l) => pathname.startsWith(l.to));
  const activeKey = onHome ? active : pathname === '/about' ? 'about' : inInsights ? 'insights' : null;

  // ---- Sliding active pill ----
  const navRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<Record<string, HTMLElement | null>>({});
  const [pill, setPill] = useState<{ x: number; y: number; w: number; h: number; visible: boolean; animate: boolean }>({
    x: 0,
    y: 0,
    w: 0,
    h: 40,
    visible: false,
    animate: false,
  });
  const placePill = useCallback(
    (animate: boolean) => {
      const el = activeKey ? linkRefs.current[activeKey] : null;
      if (!el) {
        setPill((p) => ({ ...p, visible: false, animate }));
        return;
      }
      setPill((p) => ({
        x: el.offsetLeft,
        y: el.offsetTop,
        w: el.offsetWidth,
        h: el.offsetHeight,
        visible: true,
        // First appearance snaps into place; later moves spring.
        animate: animate && p.visible,
      }));
    },
    [activeKey],
  );
  useLayoutEffect(() => placePill(true), [placePill]);
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const ro = new ResizeObserver(() => placePill(false));
    ro.observe(nav);
    document.fonts?.ready.then(() => placePill(false));
    return () => ro.disconnect();
  }, [placePill]);

  // ---- Pointer glare on the glass bar ----
  const barRef = useRef<HTMLDivElement>(null);
  const glareRaf = useRef(0);
  const onBarMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    if (glareRaf.current) return;
    glareRaf.current = requestAnimationFrame(() => {
      glareRaf.current = 0;
      const bar = barRef.current;
      if (!bar) return;
      const r = bar.getBoundingClientRect();
      bar.style.setProperty('--mx', `${clientX - r.left}px`);
      bar.style.setProperty('--my', `${clientY - r.top}px`);
    });
  };

  const ripple = (e: React.PointerEvent<HTMLElement>) => spawnRipple(e.currentTarget, e.clientX, e.clientY);
  const linkColor = (key: string) => (activeKey === key ? 'text-primary-on-container' : 'text-foreground');

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
          ref={barRef}
          onPointerMove={onBarMove}
          onPointerEnter={(e) => e.currentTarget.style.setProperty('--glare', '1')}
          onPointerLeave={(e) => e.currentTarget.style.setProperty('--glare', '0')}
          className="liquid flex h-14 items-center justify-between gap-3 rounded-full pl-4 pr-2 md:h-16 md:pl-6 md:pr-3"
        >
          <Link to="/" aria-label={`${SITE.name} home`} className="press-spring relative z-[1] shrink-0 rounded-md">
            <Wordmark withDescriptor />
          </Link>

          <nav ref={navRef} aria-label="Main" className="relative hidden items-center gap-1 lg:flex">
            <span
              aria-hidden="true"
              className={cn('absolute left-0 top-0 rounded-full bg-primary-container', pill.animate && 'spring-pill')}
              style={{
                width: pill.w,
                height: pill.h,
                transform: `translate(${pill.x}px, ${pill.y}px) scale(${pill.visible ? 1 : 0.6})`,
                opacity: pill.visible ? 1 : 0,
              }}
            />
            {SECTIONS.map((s) => (
              <HashLink
                key={s.id}
                to={s.id}
                ref={(el: HTMLAnchorElement | null) => (linkRefs.current[s.id] = el)}
                onPointerDown={ripple}
                aria-current={activeKey === s.id ? 'true' : undefined}
                className={cn(navLink, linkColor(s.id))}
              >
                {s.label}
              </HashLink>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger
                ref={(el) => (linkRefs.current.insights = el)}
                onPointerDown={ripple}
                className={cn(navLink, 'gap-1 outline-none', linkColor('insights'))}
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
              ref={(el) => (linkRefs.current.about = el)}
              onPointerDown={ripple}
              aria-current={pathname === '/about' ? 'page' : undefined}
              className={cn(navLink, linkColor('about'))}
            >
              About
            </Link>
          </nav>

          <div className="relative z-[1] flex items-center gap-1 md:gap-2">
            <span aria-hidden="true" className="mr-1 hidden h-6 w-px bg-foreground/15 lg:block" />
            <ThemeToggle />
            <Magnetic className="hidden lg:inline-flex">
              <Button asChild icon="trailing">
                <HashLink to="contact">
                  Book a consult <ArrowRight aria-hidden="true" />
                </HashLink>
              </Button>
            </Magnetic>
            <Button asChild size="sm" className="hidden min-[480px]:inline-flex lg:hidden">
              <HashLink to="contact">Book a consult</HashLink>
            </Button>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon-lg" className="press-spring lg:hidden">
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
                          className="state-layer press-spring type-title-md relative flex h-[52px] items-center overflow-hidden rounded-md px-3"
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
                        className="state-layer press-spring type-title-md relative flex h-[52px] items-center overflow-hidden rounded-md px-3"
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
                          className="state-layer press-spring type-body-md relative flex h-11 items-center overflow-hidden rounded-md pl-7 pr-3"
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
