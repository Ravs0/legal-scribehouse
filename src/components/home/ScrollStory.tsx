import { CSSProperties, useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HashLink } from '@/components/site/HashLink';
import { cn } from '@/lib/utils';
import { prefersReducedMotion } from '@/lib/reveal';

/**
 * v5.2 scroll story (after human-md.ai): the section pins while the copy builds line by line, and each beat ends with
 * one giant word sliding up out of a mask, on its own full-bleed colour. Three beats (the three ways a first shipment
 * goes wrong) and a closing beat on ink. Lines step in on thresholds; the giant word is scrubbed by scroll.
 * Reduced motion or no JS: a static, stacked version. Screen readers get the plain text version either way.
 */
interface Beat {
  id: string;
  bg: string;
  fg: string;
  muted: string;
  word: string;
  wordColor: string;
  lines: [string, string];
  tail: string;
}

const BEATS: Beat[] = [
  {
    id: 'port',
    bg: '#F2E6D6',
    fg: '#1F1A16',
    muted: '#6B6158',
    word: 'PORT.',
    wordColor: '#E8590C',
    lines: ['Most first shipments don’t fail at sea.', 'They get stuck at the'],
    tail: 'Wrong tariff code, missing permit, goods in a warehouse while storage fees add up.',
  },
  {
    id: 'brand',
    bg: '#0F4C52',
    fg: '#F4EEE6',
    muted: '#A9C9C8',
    word: 'BRAND.',
    wordColor: '#FFD9B0',
    lines: ['Or a distributor quietly files', 'your trademark, and now owns your'],
    tail: 'Most ASEAN markets are first-to-file. The earlier filing usually wins.',
  },
  {
    id: 'duty',
    bg: '#F26A1C',
    fg: '#1A0F08',
    muted: '#5A2A0C',
    word: 'DUTY.',
    wordColor: '#FFF4E6',
    lines: ['Or you qualify for a trade agreement', 'and still pay the full'],
    tail: 'No one checked origin, or the certificate wasn’t in order on entry.',
  },
];

// Scroll budget: each beat gets three steps (line 1, line 2, word + tail); the close gets two.
const STEPS_PER_BEAT = 3;
const TOTAL_STEPS = BEATS.length * STEPS_PER_BEAT + 2;

const useProgress = (ref: React.RefObject<HTMLElement>) => {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      setP(total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref]);
  return p;
};

const Line = ({ on, children, className }: { on: boolean; children: React.ReactNode; className?: string }) => (
  <span className={cn('story-line block', className)} data-on={on}>
    {children}
  </span>
);

const Static = () => (
  <div className="space-y-px">
    {BEATS.map((b) => (
      <div key={b.id} className="px-4 py-14 md:px-8" style={{ background: b.bg, color: b.fg }}>
        <div className="container">
          <p className="type-body-lg md:text-[22px]">{b.lines[0]} {b.lines[1]}</p>
          <p className="story-word mt-2" style={{ color: b.wordColor }}>{b.word}</p>
          <p className="type-body-md mt-3 max-w-[52ch]" style={{ color: b.muted }}>{b.tail}</p>
        </div>
      </div>
    ))}
  </div>
);

export const ScrollStory = () => {
  const ref = useRef<HTMLElement>(null);
  const p = useProgress(ref);
  const [still, setStill] = useState(false);
  useEffect(() => setStill(prefersReducedMotion()), []);

  const step = p * TOTAL_STEPS; // continuous
  const beatIndex = Math.min(BEATS.length, Math.floor(step / STEPS_PER_BEAT));
  const closing = beatIndex >= BEATS.length;
  const beat = BEATS[Math.min(beatIndex, BEATS.length - 1)];
  const local = closing ? step - BEATS.length * STEPS_PER_BEAT : step - beatIndex * STEPS_PER_BEAT; // 0..3
  const wordT = Math.min(1, Math.max(0, local - 1.6) / 0.9); // scrubbed 1.6 → 2.5
  const bg = closing ? '#16120F' : beat.bg;
  const fg = closing ? '#F4EEE6' : beat.fg;
  const muted = closing ? '#B7ADA3' : beat.muted;

  return (
    <section id="route" aria-labelledby="route-title" className="relative">
      <h2 id="route-title" className="sr-only">Why exports stall: three ways a first shipment goes wrong</h2>
      <ul className="sr-only">
        {BEATS.map((b) => (
          <li key={b.id}>{b.lines.join(' ')} {b.word.replace('.', '')}. {b.tail}</li>
        ))}
        <li>We close all three before the goods leave. Book a free call.</li>
      </ul>

      {still ? (
        <div aria-hidden="true"><Static /></div>
      ) : (
        <div ref={ref as React.RefObject<HTMLDivElement>} aria-hidden="true" style={{ height: `${TOTAL_STEPS * 34 + 100}vh` }}>
          <div className="story-stage sticky top-0 h-dvh overflow-hidden" style={{ background: bg, color: fg, '--muted': muted } as CSSProperties}>
            {/* Mono file label, like a section marker in a document. */}
            <div className="container flex items-center gap-2 pt-[calc(84px+env(safe-area-inset-top))]">
              <span className="type-mono-md" style={{ color: muted }}>§ 00</span>
              <span className="type-mono-md">why exports stall</span>
              <span className="story-dot ml-1 h-1.5 w-1.5 rounded-full bg-[#E8590C]" />
              <span className="type-mono-md ml-auto tabular" style={{ color: muted }}>
                {closing ? '—' : `0${beatIndex + 1}`} / 03
              </span>
            </div>

            {!closing ? (
              <div key={beat.id} className="container relative flex h-[calc(100%-120px)] flex-col justify-center">
                <p className="story-copy">
                  <Line on={local >= 0.15}>{beat.lines[0]}</Line>
                  <Line on={local >= 1}>{beat.lines[1]}</Line>
                </p>
                <div className="story-mask mt-1 overflow-hidden">
                  <span className="story-word block" style={{ color: beat.wordColor, transform: `translateY(${(1 - wordT) * 105}%)` }}>
                    {beat.word}
                  </span>
                </div>
                <p className="story-tail type-body-lg mt-4 max-w-[46ch]" data-on={wordT > 0.85} style={{ color: muted }}>
                  {beat.tail}
                </p>
              </div>
            ) : (
              <div className="container relative flex h-[calc(100%-120px)] flex-col justify-center">
                <p className="story-copy">
                  <Line on={local >= 0.1}>We close all three</Line>
                  <Line on={local >= 0.6}>
                    before the goods <span className="text-[#F26A1C]">leave.</span>
                  </Line>
                </p>
                <div className="story-tail mt-8" data-on={local >= 1}>
                  <Button asChild size="lg" icon="trailing" tabIndex={-1}>
                    <HashLink to="contact">
                      Book a free call <ArrowRight />
                    </HashLink>
                  </Button>
                </div>
              </div>
            )}

            {/* Progress rail and scroll hint. */}
            <div className="absolute inset-x-0 bottom-6 flex flex-col items-center gap-3">
              <span className="story-hint type-mono-sm rounded-full px-3 py-1.5" data-on={p < 0.97} style={{ background: fg, color: bg }}>
                scroll ↓
              </span>
              <span className="h-px w-40 overflow-hidden rounded-full" style={{ background: `${fg}33` }}>
                <span className="block h-full origin-left" style={{ background: fg, transform: `scaleX(${p})` }} />
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
