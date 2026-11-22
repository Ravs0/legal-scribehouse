import { CSSProperties, KeyboardEvent, PointerEvent, useEffect, useRef, useState } from 'react';
import { PLACEHOLDER, TEAM, type Person } from '@/data/team';
import { observeOnce, prefersReducedMotion } from '@/lib/reveal';
import '@/styles/desk-scene.css';

/** A lit picture frame (wood or brass), mat and portrait. Own gradient ids so several share a page. */
const FrameArt = ({ id, brass, person }: { id: string; brass?: boolean; person: Person }) => {
  const g = (n: string) => `${id}-${n}`;
  const [c1, c2, c3] = brass ? ['#F3D98F', '#C9A24A', '#8E6B22'] : ['#B9783E', '#8F5A2B', '#6A4020'];
  return (
    <svg viewBox="0 0 260 340" className="desk-frame-svg" aria-hidden="true">
      <defs>
        <linearGradient id={g('f')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={c1} />
          <stop offset=".55" stopColor={c2} />
          <stop offset="1" stopColor={c3} />
        </linearGradient>
        <linearGradient id={g('bev')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".55" />
          <stop offset=".4" stopColor="#fff" stopOpacity="0" />
          <stop offset=".6" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".4" />
        </linearGradient>
        <linearGradient id={g('mat')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFF9EC" />
          <stop offset="1" stopColor="#EBDDC2" />
        </linearGradient>
        <linearGradient id={g('bg')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F4E2C4" />
          <stop offset="1" stopColor="#DDBE93" />
        </linearGradient>
        <radialGradient id={g('glow')} cx=".25" cy=".1" r="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".5" />
          <stop offset=".6" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <clipPath id={g('clip')}>
          <rect x="44" y="44" width="172" height="230" rx="2" />
        </clipPath>
      </defs>
      {/* easel strut, just visible behind the frame */}
      <path d="M170 300 L196 334 L206 334 L186 292 Z" fill="#3B2412" />
      {/* frame, bevel, mat */}
      <rect x="0" y="0" width="260" height="322" rx="6" fill={`url(#${g('f')})`} />
      <rect x="0" y="0" width="260" height="322" rx="6" fill={`url(#${g('bev')})`} />
      {!brass && [18, 34, 50, 66].map((y) => (
        <path key={y} d={`M4 ${y * 4 + 6} C 80 ${y * 4}, 170 ${y * 4 + 12}, 256 ${y * 4 + 4}`} stroke="#5A3418" strokeOpacity=".22" fill="none" />
      ))}
      <rect x="12" y="12" width="236" height="298" rx="3" fill="none" stroke="#000" strokeOpacity=".28" strokeWidth="2" />
      <rect x="14" y="14" width="232" height="294" rx="3" fill="none" stroke="#fff" strokeOpacity=".3" />
      <rect x="22" y="22" width="216" height="278" fill={`url(#${g('mat')})`} />
      <rect x="22" y="22" width="216" height="278" fill="none" stroke="#7A5A30" strokeOpacity=".25" />
      {/* opening: portrait, inset shadow */}
      <rect x="44" y="44" width="172" height="230" rx="2" fill={`url(#${g('bg')})`} />
      <g clipPath={`url(#${g('clip')})`}>
        {person.photo ? (
          <image href={person.photo} x="44" y="44" width="172" height="230" preserveAspectRatio="xMidYMin slice" />
        ) : (
          <>
            <circle cx="130" cy="130" r="42" fill="#0F4C52" fillOpacity=".5" />
            <path d="M30 290c0-70 44-112 100-112s100 42 100 112z" fill="#0F4C52" fillOpacity=".38" />
          </>
        )}
        <rect x="44" y="44" width="172" height="230" fill={`url(#${g('glow')})`} />
        <rect x="44" y="44" width="172" height="10" fill="#000" fillOpacity=".12" />
        <rect x="44" y="44" width="8" height="230" fill="#000" fillOpacity=".08" />
      </g>
      <rect x="44" y="44" width="172" height="230" rx="2" fill="none" stroke="#000" strokeOpacity=".35" />
      {/* lit top edge */}
      <path d="M6 1.5 H254" stroke="#fff" strokeOpacity=".55" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
};

const Item = ({ p, i, open, setOpen }: { p: Person; i: number; open: boolean; setOpen: (v: boolean) => void }) => {
  const lastType = useRef('mouse');
  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    lastType.current = 'key';
    if (e.key === 'Escape') setOpen(false);
  };
  const onPointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    lastType.current = e.pointerType;
  };
  return (
    <li className="desk-item" style={{ '--n': i } as CSSProperties}>
      <button
        type="button"
        className="desk-btn"
        aria-expanded={open}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerEnter={(e) => e.pointerType === 'mouse' && setOpen(true)}
        onPointerLeave={(e) => e.pointerType === 'mouse' && setOpen(false)}
        onFocus={(e) => e.currentTarget.matches(':focus-visible') && setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => {
          if (lastType.current === 'mouse') return; // hover already did it
          setOpen(!open);
        }}
      >
        <span className="desk-rise">
          <span className="desk-wall-shadow" aria-hidden="true" />
          <span className="desk-foot" aria-hidden="true" />
          <span className="desk-tilt">
            <FrameArt id={`dk${i}`} brass={i === 1} person={p} />
          </span>
          <span className="desk-placard">
            <span className="desk-card">
              <span className="desk-face">
                <span className="desk-name">{p.name}</span>
                <span className="desk-role">{p.role}</span>
              </span>
              <span className="desk-face desk-face-back">
                <span className="desk-focus">{p.focus}</span>
                <span className="desk-adm">{p.admitted}</span>
              </span>
            </span>
          </span>
        </span>
      </button>
    </li>
  );
};

/** v5.8 "The desk": the people on the file, as framed portraits standing on a desk in front of a giant DESK. */
export const Desk = () => {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const [inView, setInView] = useState(false);
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    return observeOnce(el, () => setInView(true), 0.3);
  }, []);

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse' || prefersReducedMotion() || !section.current) return;
    const r = section.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      section.current?.style.setProperty('--px', x.toFixed(3));
      section.current?.style.setProperty('--py', y.toFixed(3));
    });
  };

  return (
    <section id="desk" ref={section} onPointerMove={onPointerMove} className="desk-scene" aria-labelledby="desk-title">
      <div aria-hidden="true" className="desk-wall" />
      <div aria-hidden="true" className="desk-light" />
      <div aria-hidden="true" className="desk-vignette" />

      <div className="container relative z-[3]">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
          <p className="desk-mono flex items-center gap-2">
            <span>§ 01 your desk</span>
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#E8590C]" />
          </p>
          <p className="desk-mono">3 lawyers · singapore · kuala lumpur</p>
        </div>
        <h2 id="desk-title" className="desk-title mt-4">
          <span className="sr-only">01 Your desk. </span>The people on your file.
        </h2>
        <p className="desk-lede mt-3">The person on your first call stays on your file to the end.</p>
        {PLACEHOLDER && <span className="desk-chip">Sample people</span>}
      </div>

      <div ref={stage} className="desk-stage" data-in={inView}>
        <div aria-hidden="true" className="desk-word">
          DESK.
        </div>
        <div aria-hidden="true" className="desk-top">
          <div className="desk-surface" />
          <div className="desk-edge" />
        </div>
        <div className="container relative z-[2]">
          <ul className="desk-row" aria-label="The team">
            {TEAM.map((p, i) => (
              <Item key={p.name} p={p} i={i} open={open === i} setOpen={(v) => setOpen(v ? i : open === i ? null : open)} />
            ))}
          </ul>
        </div>
        <span className="desk-hint" aria-hidden="true">
          swipe <span aria-hidden="true">→</span>
        </span>
      </div>
    </section>
  );
};
