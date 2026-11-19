import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { prefersReducedMotion } from '@/lib/reveal';

/**
 * v3.12 corporate finish: a plain 36px icon button (bordered, square-ish) that switches light and dark.
 * The page still cross-fades between themes (View Transitions, opacity only) where supported.
 */
export const ThemeKey = ({ className }: { className?: string }) => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const dark = mounted && resolvedTheme === 'dark';

  const toggle = () => {
    const next = dark ? 'light' : 'dark';
    const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
    if (!doc.startViewTransition || prefersReducedMotion()) return setTheme(next);
    doc.startViewTransition(() => {
      const root = document.documentElement;
      root.classList.toggle('dark', next === 'dark');
      root.classList.toggle('light', next === 'light');
      root.style.colorScheme = next;
      flushSync(() => setTheme(next));
    });
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label="Dark theme"
      onClick={toggle}
      className={cn(
        'hit inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] border border-border text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground',
        className,
      )}
    >
      {dark ? <Moon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" /> : <Sun className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />}
    </button>
  );
};
