import type * as React from 'react';
import { PointerEvent as ReactPointerEvent, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, ChevronDown, Menu } from 'lucide-react';
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
import { ThemeKey } from '@/components/site/ThemeKey';
import { SITE } from '@/config/site';
import { INSIGHT_LINKS, SECTIONS } from '@/config/nav';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import { cn } from '@/lib/utils';

export const Wordmark = ({ withDescriptor = false }: { withDescriptor?: boolean }) => (
  <span className="flex items-center gap-2">
    <span
      aria-hidden="true"
      className="btn-filled flex h-7 w-7 items-center justify-center rounded-lg font-display text-[14px] font-semibold text-primary-foreground"
    >
      {SITE.name[0]}
    </span>
    <span className="font-display text-[17px] font-semibold leading-none tracking-[-0.02em]">{SITE.name}</span>
    {withDescriptor && (
      <span className="type-label-md hidden border-l border-border pl-2.5 font-medium text-muted-foreground xl:inline">{SITE.descriptor}</span>
    )}
  </span>
);

/** Kept for pages that import it; the theme control is now the glowing key. */
export const ThemeToggle = ThemeKey;

/** Glare that tracks the pointer across a `.nav-glass` element. */
function useGlare<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const raf = useRef(0);
  const onPointerMove = (e: ReactPointerEvent<T>) => {
    const { clientX, clientY } = e;
    if (raf.current) return;
    raf.current = requestAnimationFrame(() => {
      raf.current = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${clientX - r.left}px`);
      el.style.setProperty('--my', `${clientY - r.top}px`);
    });
  };
  return {
    ref,
    onPointerMove,
    onPointerEnter: (e: ReactPointerEvent<T>) => e.currentTarget.style.setProperty('--glare', '1'),
    onPointerLeave: (e: ReactPointerEvent<T>) => e.currentTarget.style.setProperty('--glare', '0'),
  };
}

// Tighter item padding below 1280px so the centred nav leaves room for the wordmark and actions inside the bar.
const itemClass = 'nav-item type-label-lg inline-flex h-full items-center px-[7px] outline-none xl:px-3';

const Header = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const onHome = pathname === '/';
  const spy = useScrollSpy(
    SECTIONS.map((s) => s.id),
    onHome,
  );
  const inInsights = pathname.startsWith('/posts') || INSIGHT_LINKS.some((l) => pathname.startsWith(l.to));
  const activeKey = onHome ? spy : pathname === '/about' ? 'about' : inInsights ? 'insights' : null;

  // Header CTA: hidden over the home hero, shown once the hero has scrolled away (always on other routes).
  const [pastHero, setPastHero] = useState(!onHome);
  useEffect(() => {
    if (!onHome) {
      setPastHero(true);
      return;
    }
    const hero = document.getElementById('hero');
    if (!hero || typeof IntersectionObserver === 'undefined') {
      const onScroll = () => setPastHero(window.scrollY > 480);
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => window.removeEventListener('scroll', onScroll);
    }
    // The hero counts as passed once less than ~120px of it remains below the sticky header.
    const io = new IntersectionObserver(([e]) => setPastHero(!e.isIntersecting), { rootMargin: '-96px 0px 0px 0px', threshold: 0 });
    io.observe(hero);
    return () => io.disconnect();
  }, [onHome, pathname]);
  // v3.11: it also steps aside while the booking form itself fills the upper half of the screen.
  const [atContact, setAtContact] = useState(false);
  useEffect(() => {
    const contact = onHome ? document.getElementById('contact') : null;
    if (!contact || typeof IntersectionObserver === 'undefined') {
      setAtContact(false);
      return;
    }
    const io = new IntersectionObserver(([e]) => setAtContact(e.isIntersecting), { rootMargin: '0px 0px -50% 0px', threshold: 0 });
    io.observe(contact);
    return () => io.disconnect();
  }, [onHome, pathname]);
  const ctaHidden = !pastHero || atContact;
  // The slot clips while collapsed and while opening; once open it stops clipping so the button's shadow shows.
  const [ctaClip, setCtaClip] = useState(ctaHidden);
  useEffect(() => {
    if (ctaHidden) {
      setCtaClip(true);
      return;
    }
    const t = window.setTimeout(() => setCtaClip(false), 300);
    return () => window.clearTimeout(t);
  }, [ctaHidden]);
  const slotProps = {
    'aria-hidden': ctaHidden || undefined,
    inert: ctaHidden ? '' : undefined,
    'data-shown': !ctaHidden,
    'data-clip': ctaClip,
  } as unknown as React.HTMLAttributes<HTMLDivElement>;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ---- Lens ----
  const navRef = useRef<HTMLDivElement>(null);
  const items = useRef<Record<string, HTMLElement | null>>({});
  const [lens, setLens] = useState({ x: 0, w: 0, visible: false, snap: true, stretch: 0 });
  const [pressed, setPressed] = useState(false);
  const place = useCallback(
    (animate: boolean) => {
      const el = activeKey ? items.current[activeKey] : null;
      setLens((l) => {
        if (!el) return { ...l, visible: false, snap: !animate };
        const moved = l.visible && Math.abs(l.x - el.offsetLeft) > 1;
        return {
          x: el.offsetLeft,
          w: el.offsetWidth,
          visible: true,
          snap: !animate || !l.visible,
          stretch: animate && moved ? l.stretch + 1 : l.stretch,
        };
      });
    },
    [activeKey],
  );
  useLayoutEffect(() => place(true), [place]);
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const ro = new ResizeObserver(() => place(false));
    ro.observe(nav);
    document.fonts?.ready.then(() => place(false));
    return () => ro.disconnect();
  }, [place]);

  const glare = useGlare<HTMLDivElement>();
  const mobileGlare = useGlare<HTMLDivElement>();
  const reg = (key: string) => (el: HTMLElement | null) => {
    items.current[key] = el;
  };
  const itemProps = (key: string) => ({
    'data-active': activeKey === key ? 'true' : 'false',
    onPointerDown: () => activeKey === key && setPressed(true),
    onPointerUp: () => setPressed(false),
    onPointerLeave: () => setPressed(false),
    className: cn(itemClass, activeKey === key ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'),
  });

  return (
    <>
      <a
        href="#main"
        className="type-label-md sr-only rounded-full bg-primary px-4 py-2.5 text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60]"
      >
        Skip to content
      </a>
      <header data-scrolled={scrolled} className="intro-header corp-header sticky top-0 z-50">
        <div className="container">
        {/* Desktop (v3.8): one liquid-glass bar the width of the container. Wordmark left, nav centred, theme key and
            CTA right. Equal outer tracks keep the nav centred; the CTA slot opens inside the right track, so nothing
            else moves when it appears. */}
        <div
          {...glare}
          data-scrolled={scrolled}
          className="hidden h-[68px] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 lg:grid xl:gap-4"
        >
          <Link to="/" aria-label={`${SITE.name} home`} className="press relative z-[1] justify-self-start rounded-lg">
            <Wordmark withDescriptor />
          </Link>

          <nav ref={navRef} aria-label="Main" className="relative z-[1] flex h-full items-center xl:gap-1">
            <span
              aria-hidden="true"
              className="nav-lens corp-underline"
              data-snap={lens.snap}
              data-pressed={pressed}
              style={{
                width: lens.w,
                transform: `translateX(${lens.x}px)`,
                opacity: lens.visible ? 1 : 0,
              }}
            >
              <span key={lens.stretch} className="nav-lens__body" style={{ animation: lens.stretch ? 'lens-stretch 520ms cubic-bezier(0.2,0,0,1)' : 'none' }} />
            </span>
            {SECTIONS.map((s) => (
              <HashLink key={s.id} to={s.id} ref={reg(s.id)} aria-current={activeKey === s.id ? 'true' : undefined} {...itemProps(s.id)}>
                {s.label}
              </HashLink>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger ref={reg('insights')} {...itemProps('insights')} className={cn(itemProps('insights').className, 'gap-1')}>
                Insights <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" sideOffset={12} className="w-48">
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
            <Link to="/about" ref={reg('about')} aria-current={pathname === '/about' ? 'page' : undefined} {...itemProps('about')}>
              About
            </Link>
          </nav>

          <div className="relative z-[1] flex items-center justify-self-end">
            <ThemeKey />
            <div {...slotProps} className="header-cta-slot grid [--cta-gap:8px] xl:[--cta-gap:12px]">
              <div className="header-cta-clip">
                <div className="header-cta w-max">
                  <Button asChild tabIndex={ctaHidden ? -1 : undefined} className="h-10 px-3 type-label-md xl:px-[18px] xl:type-label-lg">
                    <HashLink to="contact">
                      Book a free call <ArrowRight aria-hidden="true" className="hidden xl:block" />
                    </HashLink>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile and tablet: one liquid-glass bar */}
        <div
          {...mobileGlare}
          data-scrolled={scrolled}
          className="flex h-[60px] items-center justify-between gap-2 lg:hidden"
        >
          <Link to="/" aria-label={`${SITE.name} home`} className="press hit relative z-[1] shrink-0 rounded-lg">
            <Wordmark />
          </Link>
          <div className="relative z-[1] flex items-center">
            <ThemeKey />
            <div {...slotProps} className="header-cta-slot hidden [--cta-gap:8px] min-[480px]:grid">
              <div className="header-cta-clip">
                <div className="header-cta w-max">
                  <Button asChild size="sm" tabIndex={ctaHidden ? -1 : undefined}>
                    <HashLink to="contact">Book a free call</HashLink>
                  </Button>
                </div>
              </div>
            </div>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="press-strong hit ml-2">
                  <Menu />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="flex flex-col gap-0 p-5 pb-[max(20px,env(safe-area-inset-bottom))] pr-[max(20px,env(safe-area-inset-right))] pt-[max(20px,env(safe-area-inset-top))]">
                <SheetTitle className="flex h-8 items-center">
                  <Wordmark />
                </SheetTitle>
                <nav aria-label="Mobile" className="-mx-1 mt-6 flex-1 overflow-y-auto">
                  <ul className="space-y-0.5">
                    {SECTIONS.map((s) => (
                      <li key={s.id}>
                        <HashLink
                          to={s.id}
                          onClick={() => setOpen(false)}
                          className={cn(
                            'state-layer type-title-md flex h-[52px] items-center rounded-[8px] px-3',
                            activeKey === s.id && 'bg-foreground/[0.05] text-foreground',
                          )}
                        >
                          {s.label}
                        </HashLink>
                      </li>
                    ))}
                    <li>
                      <Link
                        to="/about"
                        onClick={() => setOpen(false)}
                        className={cn('state-layer type-title-md flex h-[52px] items-center rounded-[8px] px-3', pathname === '/about' && 'bg-foreground/[0.05] text-foreground')}
                      >
                        About
                      </Link>
                    </li>
                  </ul>
                  <p className="type-eyebrow mb-1 mt-6 px-3 text-muted-foreground">Insights</p>
                  <ul>
                    {INSIGHT_LINKS.map((l) => (
                      <li key={l.to}>
                        <Link to={l.to} onClick={() => setOpen(false)} className="state-layer press type-body-md flex h-11 items-center rounded-lg px-3 text-muted-foreground hover:text-foreground">
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
                <Link to="/login" onClick={() => setOpen(false)} className="type-label-lg mt-5 flex h-11 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground">
                  Client & team sign-in
                </Link>
                <Button asChild size="lg" className="mt-3 w-full">
                  <HashLink to="contact" onClick={() => setOpen(false)}>
                    Book a free call <ArrowRight aria-hidden="true" />
                  </HashLink>
                </Button>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        </div>
      </header>
    </>
  );
};

export default Header;
