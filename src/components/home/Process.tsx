import { ReactNode, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { prefersReducedMotion } from '@/lib/reveal';
import '@/styles/process-route.css';

/**
 * v5.8 "The route" (after the v5.2 scroll story): #process is a pinned dawn scene. A cargo ship sails a dashed
 * shipping lane from MEL to PORT KLANG as you scroll; each buoy lights as the ship reaches it and its step card
 * takes over the copy area while earlier steps collapse to one-line receipts.
 * Layouts: wide (copy left third, sea right), mid (route on top, card below), tall (vertical route down the left edge).
 * Reduced motion: no pin; the whole route with the ship in port, then the four steps as a numbered list.
 * One rAF-throttled scroll listener writes the ship, wake and sun straight to the DOM; React only re-renders on step change.
 */

// Durations are placeholders until the firm confirms its service levels.
const STEPS = [
  { title: 'Scoping call', meta: 'Free · 30 min', copy: "You tell us the product, the market and what's already under way." },
  { title: 'Route plan', meta: '1–2 weeks', copy: 'One document: structure, registrations, duty position, risks and a fixed fee.' },
  { title: 'Paperwork', meta: 'Fixed fee', copy: 'We draft, file and manage local counsel, so you deal with one firm.' },
  { title: 'Ship & support', meta: 'Ongoing', copy: 'We stay on call for your first consignments, then handle renewals.' },
];
const TITLE = 'Four steps from first call to first shipment.';

type Layout = 'wide' | 'mid' | 'tall';
const MQ_TALL = '(max-width: 639.98px)';
const MQ_WIDE = '(min-width: 1024px) and (min-aspect-ratio: 23/20)';

const PHONE = '(max-width: 639px)';
const readEnv = () => {
  if (typeof window === 'undefined') return { layout: 'wide' as Layout, still: false };
  const m = (q: string) => window.matchMedia(q).matches;
  // v6.2: phones get the static route (no 3-screen pin).
  const still = prefersReducedMotion() || m(PHONE);
  let layout: Layout = m(MQ_TALL) ? 'tall' : m(MQ_WIDE) ? 'wide' : 'mid';
  if (still && layout === 'wide') layout = 'mid'; // the static version uses the stacked layout at every desktop width
  return { layout, still };
};

const useEnv = () => {
  const [env, setEnv] = useState(readEnv);
  useEffect(() => {
    const mqs = [MQ_TALL, MQ_WIDE, PHONE, '(prefers-reduced-motion: reduce)'].map((q) => window.matchMedia(q));
    const f = () => setEnv((prev) => { const n = readEnv(); return n.layout === prev.layout && n.still === prev.still ? prev : n; });
    mqs.forEach((q) => q.addEventListener('change', f));
    return () => mqs.forEach((q) => q.removeEventListener('change', f));
  }, []);
  return env;
};

/* ------------------------------------------------------------------ geometry */

interface Geo { kind: Layout; w: number; h: number; d: string; fr: number[] }
const FR = [0.1, 0.37, 0.64, 0.9];
const T0 = 104; // tall: lane starts below the quay
const B0 = 84; // tall: lane ends above the port strip

const getGeo = (kind: Layout, box: { w: number; h: number }, still: boolean): Geo => {
  if (kind === 'wide') return { kind, w: 1440, h: 900, d: 'M770 650 C880 650 960 566 1070 514 S1230 424 1282 386', fr: FR };
  if (kind === 'mid') return { kind, w: 800, h: 500, d: 'M215 372 C300 376 380 322 470 274 S590 208 630 176', fr: FR };
  const { w, h } = box;
  const L = Math.max(120, h - T0 - B0);
  return {
    kind, w, h,
    d: `M44 ${T0} C64 ${T0 + L * 0.33} 24 ${T0 + L * 0.66} 44 ${T0 + L}`,
    fr: still ? [0.125, 0.375, 0.625, 0.875] : FR,
  };
};

const SC = { wide: { fs: 13, bk: 1.25 }, mid: { fs: 16, bk: 1.6 }, tall: { fs: 12, bk: 1.3 } } as const;

/* ------------------------------------------------------------------ drawing */

const CONT = ['#F26A1C', '#F4EEE6', '#2E8F95', '#D9A877', '#B8470F', '#FFB36B'];

const SideShip = () => (
  <g>
    <ellipse cx="2" cy="7" rx="52" ry="3.2" fill="#062A2E" opacity="0.4" />
    <path d="M-92 4 Q-70 6 -52 3 M-104 8 Q-76 11 -50 7" stroke="#F4EEE6" strokeOpacity="0.45" strokeWidth="1.4" strokeLinecap="round" fill="none" />
    <g className="prc-bob">
      {/* containers: three tiers stepping toward the bow */}
      {[0, 1, 2, 3, 4, 5].map((i) => <ContBox key={`a${i}`} x={-22 + i * 11} y={-15} c={CONT[i % 6]} />)}
      {[0, 1, 2, 3].map((i) => <ContBox key={`b${i}`} x={-22 + i * 11} y={-22} c={CONT[(i + 2) % 6]} />)}
      {[0, 1].map((i) => <ContBox key={`c${i}`} x={-22 + i * 11} y={-29} c={CONT[(i + 4) % 6]} />)}
      {/* hull */}
      <path d="M-50 -8 H44 L57 -8 L46 6 H-44 Q-50 6 -50 0 Z" fill="#16120F" />
      <path d="M-49 2 H46 L45 6 H-44 Q-49 6 -49 1 Z" fill="#E8590C" />
      <rect x="-50" y="-8" width="107" height="2.2" fill="#F26A1C" />
      <g fill="#F4EEE6" opacity="0.5">{[-36, -26, -16, -6, 4, 14, 24, 34].map((x) => <circle key={x} cx={x} cy="-2" r="0.9" />)}</g>
      {/* stern bridge + funnel + mast */}
      <rect x="-31" y="-24" width="6" height="16" fill="#F26A1C" />
      <rect x="-31" y="-24" width="6" height="3" fill="#16120F" />
      <rect x="-46" y="-26" width="16" height="18" rx="1.5" fill="#F4EEE6" />
      <rect x="-48" y="-28.5" width="20" height="3.5" rx="1" fill="#16120F" />
      <rect x="-44" y="-22" width="12" height="3" rx="0.6" fill="#1B5A60" />
      <rect x="-44" y="-16" width="12" height="2.2" rx="0.6" fill="#1B5A60" opacity="0.7" />
      <path d="M-38 -28.5 V-39" stroke="#16120F" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M-38 -39 L-31 -37 L-38 -35Z" fill="#F26A1C" />
      <circle cx="52" cy="-9.5" r="1.2" fill="#FFB36B" />
    </g>
  </g>
);

const ContBox = ({ x, y, c }: { x: number; y: number; c: string }) => (
  <g>
    <rect x={x} y={y} width="10.4" height="6.6" rx="0.7" fill={c} />
    <path d={`M${x + 2.6} ${y + 0.8}V${y + 5.8}M${x + 5.2} ${y + 0.8}V${y + 5.8}M${x + 7.8} ${y + 0.8}V${y + 5.8}`} stroke="#000" strokeOpacity="0.16" strokeWidth="0.6" />
  </g>
);

const TopShip = () => (
  <g>
    <ellipse cx="2" cy="1" rx="42" ry="13" fill="#062A2E" opacity="0.3" />
    <path d="M-40 -5 L-84 -14 M-40 5 L-84 14" stroke="#F4EEE6" strokeOpacity="0.4" strokeWidth="1.4" strokeLinecap="round" fill="none" />
    <path d="M-34 -9 H16 Q34 -9 40 0 Q34 9 16 9 H-34 Q-37 9 -37 6 V-6 Q-37 -9 -34 -9Z" fill="#16120F" stroke="#F26A1C" strokeWidth="1" />
    <path d="M-31 -7 H15 Q29 -7 34 0 Q29 7 15 7 H-31Z" fill="#2A241F" />
    {[0, 1, 2, 3, 4].map((i) => (
      <g key={i}>
        <rect x={-17 + i * 8.4} y="-6" width="8" height="5.8" rx="0.6" fill={CONT[i % 6]} />
        <rect x={-17 + i * 8.4} y="0.2" width="8" height="5.8" rx="0.6" fill={CONT[(i + 3) % 6]} />
      </g>
    ))}
    <rect x="-33" y="-6.5" width="12" height="13" rx="1.5" fill="#F4EEE6" />
    <rect x="-22.6" y="-5.2" width="1.4" height="10.4" fill="#1B5A60" />
    <circle cx="-27" cy="0" r="3" fill="#F26A1C" />
  </g>
);

/** Distant coast with a port: crane, container stacks, warehouse. Local units 420 wide; y = 0 is the horizon. */
const Coast = ({ tx, ty, sc, fs, lit, ly = 84 }: { tx: number; ty: number; sc: number; fs: number; lit: boolean; ly?: number }) => (
  <g transform={`translate(${tx} ${ty}) scale(${sc})`}>
    <path d="M0 6 L40 -14 L90 -6 L150 -26 L210 -12 L270 -30 L330 -14 L420 -22 V12 H0Z" fill="#8DB5B1" opacity="0.55" />
    <path d="M60 14 Q120 -12 190 -2 T320 -8 T440 -12 V30 H60Z" fill="#3C7B7E" />
    <path d="M120 28 Q170 8 230 14 T340 8 T440 4 V30 H120Z" fill="#1B5A60" />
    <path d="M120 29 H440" stroke="#E9C9A0" strokeOpacity="0.6" strokeWidth="2" />
    {/* port */}
    <rect x="232" y="6" width="190" height="20" rx="2" fill="#0F3F44" />
    {[[240, '#F26A1C'], [256, '#F4EEE6'], [272, '#2E8F95'], [288, '#D9A877']].map(([x, c]) => (
      <g key={x as number}><rect x={x as number} y="-3" width="14" height="9" rx="1" fill={c as string} /><rect x={x as number} y="-11" width="14" height="8" rx="1" fill="#F26A1C" opacity="0.85" /></g>
    ))}
    <rect x="378" y="-14" width="36" height="20" rx="3" fill="#13383C" />
    <path d="M374 -14 L396 -22 L418 -14Z" fill="#13383C" />
    <g stroke="#13383C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d="M312 6 V-34 M340 6 V-34" />
      <path d="M300 -34 H372" />
      <path d="M300 -34 L326 -48 L372 -34" />
      <path d="M306 -34 v22" />
    </g>
    <rect x="300" y="-14" width="12" height="5" rx="1" fill="#F26A1C" />
    <circle className="prc-beacon" data-on={lit} cx="326" cy="-50" r="4" fill="#FF9A4D" />
    <circle cx="326" cy="-50" r="2" fill="#FFD9B0" opacity="0.7" />
    <text className="prc-mono" x="410" y={ly} textAnchor="end" fill="#F4EEE6" fontSize={fs / sc} letterSpacing="0.1em">PORT KLANG</text>
    <path d={`M${410 - (fs / sc) * 7.6 - 12} ${ly - 8} l5 5 l-5 5 l-5 -5Z`} fill="#F26A1C" />
  </g>
);

const Quay = ({ tx, ty, sc, fs }: { tx: number; ty: number; sc: number; fs: number }) => (
  <g transform={`translate(${tx} ${ty}) scale(${sc})`}>
    <path d="M-60 0 H176 L162 16 H-60Z" fill="#E4C59B" />
    <rect x="-60" y="16" width="222" height="30" fill="#0A3438" />
    <path d="M-60 16 H162" stroke="#F4EEE6" strokeOpacity="0.45" strokeWidth="1.5" />
    <path d="M-20 16 V46 M40 16 V46 M100 16 V46" stroke="#F4EEE6" strokeOpacity="0.08" strokeWidth="1.5" />
    {/* warehouse + crates + small portal crane */}
    <rect x="-44" y="-30" width="56" height="30" rx="2" fill="#16120F" />
    <path d="M-48 -30 L-16 -42 L16 -30Z" fill="#16120F" />
    <rect x="-34" y="-18" width="14" height="18" fill="#F26A1C" opacity="0.9" />
    <rect x="18" y="-9" width="14" height="9" rx="1" fill="#F4EEE6" />
    <rect x="34" y="-9" width="14" height="9" rx="1" fill="#2E8F95" />
    <rect x="26" y="-18" width="14" height="9" rx="1" fill="#F26A1C" />
    <g stroke="#16120F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d="M96 0 V-40 M126 0 V-40 M90 -40 H146 M146 -40 v16" />
    </g>
    <rect x="140" y="-26" width="12" height="7" rx="1" fill="#F26A1C" />
    <rect x="142" y="-6" width="5" height="6" rx="1.5" fill="#16120F" />
    <rect x="62" y="-5" width="5" height="5" rx="1.5" fill="#16120F" />
    <text className="prc-mono" x="-52" y="68" fill="#F4EEE6" fontSize={fs / sc} letterSpacing="0.1em">MEL</text>
      </g>
);

const wave = (y: number, amp: number, x0: number) => `M${x0} ${y} q20 -${amp} 40 0` + ' t40 0'.repeat(58);

const Waves = ({ ys, w }: { ys: number[]; w: number }) => (
  <g fill="none" stroke="#F4EEE6" strokeLinecap="round">
    {ys.map((y, i) => (
      <g key={y} className={`prc-drift ${i % 3 === 1 ? 'b' : i % 3 === 2 ? 'c' : ''}`}>
        <path d={wave(y, 2 + (i / ys.length) * 5, -400 - ((i * 37) % 80))} strokeOpacity={0.06 + (i / ys.length) * 0.1} strokeWidth={1 + (i / ys.length) * 1.4} />
        <path d={wave(y + 7 + i, 1.5 + (i / ys.length) * 3, -380 - ((i * 53) % 80) + (w > 1000 ? 120 : 0))} strokeOpacity={0.04 + (i / ys.length) * 0.06} strokeWidth="1" />
      </g>
    ))}
  </g>
);

const Buoy = ({ x, y, n, lit, k, fs }: { x: number; y: number; n: number; lit: boolean; k: number; fs: number }) => (
  <g className="prc-buoy" data-lit={lit} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${k})`}>
    <ellipse cy="3" rx="15" ry="4.5" fill="none" stroke="#F4EEE6" strokeOpacity="0.35" />
    <circle className="ping" cy="-15" r="8" fill="#F26A1C" />
    <circle className="ping2" cy="-15" r="8" fill="#F26A1C" />
    <g className="pop">
      <circle className="glow" cy="-15" r="13" fill="url(#prc-glow)" />
      <path d="M-6 3 L-3.6 -11 H3.6 L6 3Z" fill="#F4EEE6" />
      <path d="M-4.9 -4.5 H4.9 L5.5 -0.5 H-5.5Z" fill="#E8590C" />
      <path d="M-3.4 -11 L0 -17 L3.4 -11Z" fill="#16120F" opacity="0.85" />
      <circle className="lamp" cy="-15" r="2.6" />
    </g>
    <g transform={`translate(11 -27) scale(${1 / k})`}>
      <rect className="tag" x="0" y={-fs * 0.5 - 4} width={fs * 2 + 6} height={fs + 8} rx={(fs + 8) / 2} strokeWidth="1" />
      <text className="prc-mono lab" x={fs + 3} y={fs * 0.36} textAnchor="middle" fontSize={fs} letterSpacing="0.06em">{String(n).padStart(2, '0')}</text>
    </g>
  </g>
);

interface SceneProps {
  geo: Geo;
  pathRef: React.RefObject<SVGPathElement>;
  wakeRef: React.RefObject<SVGPathElement>;
  shipRef: React.RefObject<SVGGElement>;
  sunRef: React.RefObject<SVGGElement>;
  pts: { x: number; y: number }[];
  stage: number;
}

const RouteScene = ({ geo, pathRef, wakeRef, shipRef, sunRef, pts, stage }: SceneProps) => {
  const { kind, w, h } = geo;
  const { fs, bk } = SC[kind];
  const H = kind === 'wide' ? 324 : 90; // horizon (wide, mid)
  const ex = 900; // sky and sea rects bleed past the viewBox so `slice` and `meet` never show an edge
  const seaTop = kind === 'tall' ? 0 : H;
  const bottom = kind === 'tall' ? h : h;
  const waveYs = kind === 'wide'
    ? [340, 356, 376, 400, 428, 462, 502, 548, 602, 664, 734, 812, 892]
    : kind === 'mid'
      ? [104, 120, 140, 166, 198, 236, 280, 330, 386, 440, 492]
      : Array.from({ length: 12 }, (_, i) => 30 + i * Math.max(40, h / 11.5));
  const sun = kind === 'wide' ? { x: 960, y: H + 6, r: 60 } : kind === 'mid' ? { x: 330, y: H + 2, r: 38 } : { x: w - 62, y: 0, r: 30 };
  const lit = stage >= 5;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio={kind === 'wide' ? 'xMidYMid slice' : kind === 'mid' ? 'xMidYMax meet' : 'xMidYMid slice'}>
      <defs>
        <linearGradient id="prc-sky" gradientUnits="userSpaceOnUse" x1="0" y1={kind === 'wide' ? 0 : -40} x2="0" y2={H}>
          <stop offset="0" stopColor={kind === 'wide' ? '#F6C49B' : '#FAE0C0'} />
          <stop offset="0.8" stopColor="#FBE6CC" />
          <stop offset="1" stopColor="#FDF1DE" />
        </linearGradient>
        <linearGradient id="prc-sea" gradientUnits="userSpaceOnUse" x1="0" y1={seaTop} x2="0" y2={bottom}>
          <stop offset="0" stopColor="#0F4C52" />
          <stop offset="1" stopColor="#0B3D42" />
        </linearGradient>
        <linearGradient id="prc-haze" gradientUnits="userSpaceOnUse" x1="0" y1={seaTop} x2="0" y2={seaTop + 110}>
          <stop offset="0" stopColor="#FFB98A" stopOpacity="0.38" />
          <stop offset="1" stopColor="#FFB98A" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="prc-halo">
          <stop offset="0" stopColor="#FFC27D" stopOpacity="0.85" />
          <stop offset="0.45" stopColor="#FFB07A" stopOpacity="0.3" />
          <stop offset="1" stopColor="#FFB07A" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="prc-glow">
          <stop offset="0" stopColor="#FFB36B" stopOpacity="0.95" />
          <stop offset="1" stopColor="#F26A1C" stopOpacity="0" />
        </radialGradient>
        <filter id="prc-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix values="0 0 0 0 0.09  0 0 0 0 0.07  0 0 0 0 0.06  0 0 0 0.55 0" />
        </filter>
      </defs>

      {/* sky, sun, far ridge */}
      {kind !== 'tall' && <rect x={-ex} y={-ex} width={w + ex * 2} height={H + ex} fill="url(#prc-sky)" />}
      <g ref={sunRef}>
        <circle cx={sun.x} cy={sun.y} r={sun.r * 4.4} fill="url(#prc-halo)" />
        <circle cx={sun.x} cy={sun.y} r={sun.r} fill="#FFD08A" />
        <circle cx={sun.x} cy={sun.y} r={sun.r * 0.72} fill="#FFE2B0" opacity="0.7" />
      </g>
      {kind !== 'tall' && (
        <g fill="#FFF4E6" opacity="0.55">
          <rect x={w * 0.62} y={H * 0.62} width={w * 0.1} height="3" rx="1.5" />
          <rect x={w * 0.66} y={H * 0.62 + 9} width={w * 0.05} height="3" rx="1.5" />
          <rect x={w * 0.5} y={H * 0.36} width={w * 0.1} height="3" rx="1.5" />
          <rect x={w * 0.54} y={H * 0.36 + 9} width={w * 0.05} height="3" rx="1.5" />
        </g>
      )}
      {/* sea */}
      <rect x={-ex} y={seaTop} width={w + ex * 2} height={bottom - seaTop + ex} fill="url(#prc-sea)" />
      <rect x={-ex} y={seaTop} width={w + ex * 2} height="110" fill="url(#prc-haze)" />
      {kind !== 'tall' && (
        <g fill="#FFC98A">
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={i} x={sun.x - (sun.r * (1.3 - i * 0.2)) / 1} y={H + 6 + i * 9 * (kind === 'wide' ? 1.3 : 0.8)} width={sun.r * (2.6 - i * 0.4)} height={kind === 'wide' ? 2.6 : 1.8} rx="1.3" opacity={0.55 - i * 0.09} />
          ))}
        </g>
      )}
      <Waves ys={waveYs} w={w} />

      {/* land */}
      {kind === 'wide' && <><Coast tx={1000} ty={H} sc={1} fs={fs} lit={lit} /><Quay tx={520} ty={634} sc={1} fs={fs} /></>}
      {kind === 'mid' && <><Coast tx={450} ty={H} sc={0.7} fs={13} lit={lit} ly={150} /><Quay tx={52} ty={358} sc={0.8} fs={fs} /></>}
      {kind === 'tall' && <TallLand w={w} h={h} fs={fs} lit={lit} />}

      {/* lane: dashed, with a solid wake drawn over it as the ship passes */}
      <path ref={pathRef} d={geo.d} fill="none" stroke="#F4EEE6" strokeOpacity="0.55" strokeWidth={kind === 'mid' ? 2.4 : 2.2} strokeDasharray="9 8" strokeLinecap="round" />
      <path ref={wakeRef} d={geo.d} fill="none" stroke="#FFB36B" strokeWidth={kind === 'mid' ? 3.6 : 3.2} strokeLinecap="round" style={{ strokeDasharray: '0 9999' }} />

      {pts.map((p, i) => <Buoy key={i} x={p.x} y={p.y} n={i + 1} lit={stage > i} k={bk} fs={fs} />)}

      <g ref={shipRef} transform="translate(-999 -999)">
        {kind === 'tall' ? <TopShip /> : <SideShip />}
      </g>

      {/* grain */}
    </svg>
  );
};

const TallLand = ({ w, h, fs, lit }: { w: number; h: number; fs: number; lit: boolean }) => {
  const top = h - 70;
  return (
    <g>
      {/* MEL quay along the top edge */}
      <g transform="translate(0 24)">
      <path d="M-10 8 H108 L98 22 H-10Z" fill="#E4C59B" />
      <rect x="-10" y="22" width="108" height="14" fill="#0A3438" />
      <rect x="6" y="-14" width="26" height="22" rx="2" fill="#16120F" />
      <path d="M3 -14 L19 -22 L35 -14Z" fill="#16120F" />
      <rect x="40" y="-4" width="12" height="12" rx="1" fill="#F26A1C" />
      <rect x="54" y="-4" width="12" height="12" rx="1" fill="#F4EEE6" />
      <text className="prc-mono" x="118" y="26" fill="#F4EEE6" fontSize={fs} letterSpacing="0.1em">MEL</text>
      </g>
      {/* PORT KLANG coast along the bottom edge */}
      <path d={`M-20 ${top + 6} Q60 ${top - 14} 150 ${top - 2} T${w + 20} ${top - 8} V${h + 20} H-20Z`} fill="#1B5A60" />
      <path d={`M-20 ${top - 8} L40 ${top - 30} L100 ${top - 14} L170 ${top - 40} L240 ${top - 18} L${w + 20} ${top - 30} V${top + 10} H-20Z`} fill="#3C7B7E" opacity="0.65" />
      <path d={`M-20 ${top + 6} Q60 ${top - 14} 150 ${top - 2} T${w + 20} ${top - 8}`} fill="none" stroke="#E9C9A0" strokeOpacity="0.6" strokeWidth="2" />
      <rect x={w - 120} y={top - 2} width="110" height="14" rx="2" fill="#0F3F44" />
      <rect x={w - 112} y={top - 12} width="14" height="10" rx="1" fill="#F26A1C" />
      <rect x={w - 96} y={top - 12} width="14" height="10" rx="1" fill="#F4EEE6" />
      <g stroke="#13383C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d={`M${w - 50} ${top - 2} V${top - 38} M${w - 28} ${top - 2} V${top - 38}`} />
        <path d={`M${w - 60} ${top - 38} H${w - 12} M${w - 60} ${top - 38} L${w - 40} ${top - 50} L${w - 12} ${top - 38}`} />
      </g>
      <circle className="prc-beacon" data-on={lit} cx={w - 40} cy={top - 52} r="4" fill="#FF9A4D" />
      <text className="prc-mono" x="76" y={h - 24} fill="#F4EEE6" fontSize={fs} letterSpacing="0.1em">PORT KLANG</text>
      <path d={`M66 ${h - 28} l4 4 l-4 4 l-4 -4Z`} fill="#F26A1C" />
    </g>
  );
};

/* ------------------------------------------------------------------ copy */

const Card = ({ i }: { i: number }) => {
  const s = STEPS[i];
  return (
    <article key={i} className="prc-card">
      <p className="prc-num tabular">{String(i + 1).padStart(2, '0')}</p>
      <div className="prc-text">
        <h3 className="prc-title">{s.title}</h3>
        <p className="prc-p">{s.copy}</p>
        <p className="prc-tag">{s.meta}</p>
      </div>
    </article>
  );
};

const Copy = ({ active }: { active: number }) => (
  <div className="prc-copy" aria-hidden="true">
    {active > 0 && (
      <ul className="prc-done">
        {STEPS.slice(0, active).map((s, i) => (
          <li key={s.title} className="prc-row">
            <span className="chk">✓</span>
            <span className="n">{String(i + 1).padStart(2, '0')}</span>
            <span>{s.title}</span>
          </li>
        ))}
      </ul>
    )}
    <Card i={active} />
  </div>
);

const Markers = ({ active }: { active: number }) => (
  <div className="prc-markers" aria-hidden="true">
    <span className="type-mono-md m-sec">§ 03</span>
    <span className="type-mono-md">how it works</span>
    <span className="m-dot" />
    <span className="type-mono-md m-count">{String(active + 1).padStart(2, '0')} / 04</span>
  </div>
);

/* ------------------------------------------------------------------ section */

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

export const Process = () => {
  const { layout, still } = useEnv();
  const outerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const wakeRef = useRef<SVGPathElement>(null);
  const shipRef = useRef<SVGGElement>(null);
  const sunRef = useRef<SVGGElement>(null);
  const pRef = useRef(still ? 1 : 0);
  const lenRef = useRef(1);
  const geoRef = useRef<Geo | null>(null);

  const [box, setBox] = useState({ w: 390, h: 560 });
  const [pts, setPts] = useState<{ x: number; y: number }[]>([]);
  const [stage, setStage] = useState(still ? 5 : 0);

  const geo = useMemo(() => getGeo(layout, box, still), [layout, box, still]);
  geoRef.current = geo;

  // The tall layout draws in real pixels, so it needs the scene's size.
  useLayoutEffect(() => {
    if (layout !== 'tall') return;
    const el = sceneRef.current;
    if (!el) return;
    const read = () => {
      const w = Math.round(el.clientWidth);
      const h = Math.round(el.clientHeight);
      setBox((b) => (b.w === w && b.h === h ? b : { w, h }));
    };
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, [layout, still]);

  const apply = (p: number) => {
    const path = pathRef.current;
    const g = geoRef.current;
    if (!path || !g) return;
    const L = lenRef.current;
    const s = still ? 1 : clamp01((p - 0.03) / 0.9);
    const l = s * L;
    const a = path.getPointAtLength(Math.max(0, l - 2));
    const b = path.getPointAtLength(Math.min(L, l + 2));
    const pt = path.getPointAtLength(l);
    const deg = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
    const k = g.kind === 'wide' ? 1.3 - 0.45 * s : g.kind === 'mid' ? 1.5 - 0.6 * s : 1.3;
    const rot = g.kind === 'tall' ? deg : Math.max(-9, Math.min(9, deg * 0.3));
    shipRef.current?.setAttribute('transform', `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)}) rotate(${rot.toFixed(1)}) scale(${k.toFixed(3)})`);
    if (wakeRef.current) wakeRef.current.style.strokeDasharray = `${l.toFixed(1)} ${(L * 2).toFixed(1)}`;
    sunRef.current?.setAttribute('transform', `translate(0 ${(-p * (g.kind === 'wide' ? 26 : 12)).toFixed(1)})`);
    const n = g.fr.filter((f) => s >= f - 0.003).length + (s >= 0.995 ? 1 : 0);
    setStage(n);
  };

  // Measure the lane, place the buoys, then position everything for the current progress.
  useLayoutEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const L = path.getTotalLength();
    lenRef.current = L;
    setPts(geo.fr.map((f) => { const q = path.getPointAtLength(f * L); return { x: q.x, y: q.y }; }));
    apply(pRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geo, still]);

  useEffect(() => {
    if (still) { pRef.current = 1; apply(1); return; }
    let raf = 0;
    const read = () => {
      raf = 0;
      const el = outerRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      pRef.current = total > 0 ? clamp01(-r.top / total) : 0;
      apply(pRef.current);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(read); };
    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [still, layout]);

  const active = Math.min(3, Math.max(0, Math.min(stage, 4) - 1));
  const sceneOf = (children?: ReactNode) => (
    <div ref={sceneRef} className="prc-scene" aria-hidden="true">
      <RouteScene geo={geo} pathRef={pathRef} wakeRef={wakeRef} shipRef={shipRef} sunRef={sunRef} pts={pts} stage={stage} />
      {children}
    </div>
  );
  const scene = sceneOf();
  const band = (
    <div className="prc-band">
      <div className="container">
        <Markers active={still ? 3 : active} />
        <h2 id="process-title" className="prc-h2">{TITLE}</h2>
      </div>
    </div>
  );

  const srList = (
    <ol className="sr-only">
      {STEPS.map((s, i) => (
        <li key={s.title}>Step {i + 1}: {s.title}. {s.copy} {s.meta}.</li>
      ))}
    </ol>
  );

  if (still) {
    return (
      <section id="process" aria-labelledby="process-title" className="prc" data-layout={layout} data-still="true">
        <div className="prc-stage" data-layout={layout}>
          {band}
          {layout === 'tall' ? (
            <div className="prc-tallwrap">
              {scene}
              <StaticList />
            </div>
          ) : (
            <>
              {scene}
              <div className="prc-static-list"><div className="container"><StaticList /></div></div>
            </>
          )}
        </div>
      </section>
    );
  }

  const copy = <Copy active={active} />;
  return (
    <section id="process" aria-labelledby="process-title" className="prc" data-layout={layout} data-pinned="true">
      <div ref={outerRef} style={{ height: layout === 'wide' ? '340vh' : layout === 'mid' ? '320vh' : '300vh' }}>
        <div className="prc-stage" data-layout={layout}>
          {srList}
          {band}
          {layout === 'tall' ? (
            sceneOf(<div className="prc-copywrap">{copy}</div>)
          ) : (
            <>
              {scene}
              <div className="prc-copywrap"><div className="container">{copy}</div></div>
            </>
          )}
          <div className="prc-hint" data-on={stage < 1} aria-hidden="true"><span className="type-mono-sm">scroll ↓</span></div>
        </div>
      </div>
    </section>
  );
};

const StaticList = (): ReactNode => (
  <ol className="prc-list">
    {STEPS.map((s, i) => (
      <li key={s.title}>
        <span className="num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
        <h3 className="ttl"><span className="sr-only">Step {i + 1}: </span>{s.title}</h3>
        <p className="prc-p">{s.copy}</p>
        <p className="prc-tag">{s.meta}</p>
      </li>
    ))}
  </ol>
);
