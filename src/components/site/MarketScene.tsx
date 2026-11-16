import { ReactNode, useId } from 'react';
import { CONTOUR_PATHS } from '@/lib/contours';
import { cn } from '@/lib/utils';

/**
 * Horizon scenes (illustrations; their palettes are their own, except the hero backdrop which follows the theme).
 * Dawn horizon scenes. One SVG (640×452): sky gradient, sun + halo, far ridge, a landmark silhouette,
 * water with sun reflections, and a contour-textured foreground strip.
 */
export interface SceneConfig {
  sky: [string, string, string];
  sun: string;
  water: string;
  sunX: number;
  /** `ink` is the solid front layer; `back` is the same hue at 55% opacity for the depth layer behind it. */
  landmark: (ink: string, back: string) => ReactNode;
  sand?: boolean;
  /** Sand strip colour when `sand` is set. */
  sandColor?: string;
}

const H = 300; // horizon

/*
 * v3.6 drawing rules, shared by every scene:
 * - buildings: 3px rounded top corners; a back layer (same hue, 55% opacity) behind a solid front layer;
 *   2-3 rows of small window dots at 14% white on front buildings only.
 * - line work (cranes, masts, finials): 3px stroke, round caps and joins, lines meet at joints and never cross.
 */
const R = 3;
const block = (x: number, w: number, h: number, base = H) =>
  `M${x} ${base} V${base - h + R} Q${x} ${base - h} ${x + R} ${base - h} H${x + w - R} Q${x + w} ${base - h} ${x + w} ${base - h + R} V${base} Z`;

const windows = (x: number, w: number, top: number, rows = 3, key = '', gap = 7) => {
  const cols = Math.max(1, Math.floor((w - 8) / gap) + 1);
  const span = (cols - 1) * gap;
  const x0 = x + (w - span) / 2;
  const dots: ReactNode[] = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) dots.push(<circle key={`${key}${r}-${c}`} cx={x0 + c * gap} cy={top + r * 9} r="1.4" />);
  return dots;
};

/** Front buildings: [x, width, height]. Window rows start 10px below each roof. */
const towers = (xs: [number, number, number][], ink: string, rows = 3) => (
  <g>
    {xs.map(([x, w, h], i) => (
      <path key={i} d={block(x, w, h)} fill={ink} />
    ))}
    <g fill="#fff" fillOpacity="0.14">
      {xs.map(([x, w, h], i) => windows(x, w, H - h + 10, h > 60 ? rows : 2, `${i}-`))}
    </g>
  </g>
);

/** Back buildings: same hue at 55% opacity, no windows. */
const backTowers = (xs: [number, number, number][], back: string) => (
  <g>
    {xs.map(([x, w, h], i) => (
      <path key={i} d={block(x, w, h)} fill={back} />
    ))}
  </g>
);

const LINE = { strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' } as const;

/** Tower crane: mast, peak, jib + counter-jib, one tie from the peak to the jib tip, and a short hoist line. */
const crane = (x: number, h: number, jib: number, color: string) => {
  const top = H - h;
  return (
    <g stroke={color} {...LINE}>
      <path d={`M${x} ${H} V${top - 14}`} />
      <path d={`M${x - 16} ${top} H${x + jib}`} />
      <path d={`M${x + jib} ${top} L${x} ${top - 14} L${x - 16} ${top}`} />
      <path d={`M${x + jib - 8} ${top} v20`} />
    </g>
  );
};

export const SCENES: Record<string, SceneConfig> = {
  // v3.8 Golden Hour backdrop for the hero printer: amber sky, cream horizon, deep-teal water, cream sand.
  home: {
    sky: ['#F4A62A', '#FBD27E', '#FCF1D4'],
    sun: '#FFF3D2',
    water: '#2F7A6C',
    sunX: 400,
    sand: true,
    sandColor: '#F3DFAE',
    landmark: (ink) => <path d={`M0 ${H} Q120 ${H - 34} 240 ${H - 12} T520 ${H - 20} T640 ${H - 8} V${H} Z`} fill={ink} opacity="0.35" />,
  },
  SG: {
    sky: ['#2B3A67', '#F08A5D', '#FFD3A1'],
    sun: '#FFE2B0',
    water: '#35507A',
    sunX: 230,
    landmark: (ink, back) => (
      <g>
        {backTowers([[374, 24, 140], [440, 26, 172], [500, 24, 118]], back)}
        {towers([[360, 26, 120], [392, 20, 92], [418, 30, 150], [454, 22, 110], [482, 28, 132], [516, 18, 84]], ink)}
        {crane(572, 96, 44, ink)}
        {crane(110, 70, 38, back)}
      </g>
    ),
  },
  MY: {
    sky: ['#3B2F63', '#E9765B', '#FFC98A'],
    sun: '#FFD9A0',
    water: '#3F4B78',
    sunX: 210,
    landmark: (ink, back) => (
      <g>
        {backTowers([[318, 24, 96], [352, 22, 64], [500, 26, 108], [532, 22, 74]], back)}
        <path d={`M400 ${H} V${H - 150} L408 ${H - 175} L410 ${H - 215} L412 ${H - 175} L420 ${H - 150} V${H} Z`} fill={ink} />
        <path d={`M460 ${H} V${H - 150} L468 ${H - 175} L470 ${H - 215} L472 ${H - 175} L480 ${H - 150} V${H} Z`} fill={ink} />
        <rect x="418" y={H - 112} width="44" height="5" rx="1.5" fill={ink} />
        <g fill="#fff" fillOpacity="0.14">
          {windows(400, 20, H - 138, 3, 'a')}
          {windows(460, 20, H - 138, 3, 'b')}
        </g>
        {towers([[330, 24, 70], [508, 26, 86], [542, 20, 60]], ink, 2)}
      </g>
    ),
  },
  ID: {
    sky: ['#44305E', '#F26A1C', '#FFC27A'],
    sun: '#FFE0A8',
    water: '#4A4470',
    sunX: 470,
    landmark: (ink, back) => (
      <g>
        {backTowers([[150, 30, 54], [256, 34, 66], [290, 22, 42]], back)}
        <path d={`M200 ${H} L210 ${H - 30} H230 L240 ${H} Z`} fill={ink} />
        <path d={`M214 ${H - 30} L218 ${H - 160} H222 L226 ${H - 30} Z`} fill={ink} />
        <path d={`M216 ${H - 160} q4 -14 4 -22 q4 8 4 22 Z`} fill={ink} />
        {crane(372, 84, 46, ink)}
        {crane(584, 64, 34, back)}
      </g>
    ),
  },
  TH: {
    sky: ['#50305A', '#EE7B4F', '#FFD08F'],
    sun: '#FFE6B5',
    water: '#5A4A6E',
    sunX: 190,
    landmark: (ink, back) => (
      <g>
        {[
          [356, 44, 110],
          [476, 44, 110],
          [400, 70, 170],
        ].map(([x, w, h], i) => (
          <path key={i} d={`M${x} ${H} V${H - h * 0.45} Q${x + w / 2} ${H - h * 0.6} ${x + w / 2} ${H - h} Q${x + w / 2} ${H - h * 0.6} ${x + w} ${H - h * 0.45} V${H} Z`} fill={i === 2 ? ink : back} />
        ))}
        <g fill="#fff" fillOpacity="0.14">{windows(412, 46, H - 62, 2, 't', 12)}</g>
      </g>
    ),
  },
  VN: {
    sky: ['#2F4A5E', '#E8915F', '#FFDBA6'],
    sun: '#FFF0C4',
    water: '#3E6672',
    sunX: 300,
    landmark: (ink, back) => (
      <g>
        <path d={`M40 ${H} Q60 ${H - 120} 90 ${H - 110} Q120 ${H - 100} 130 ${H} Z M120 ${H} Q140 ${H - 80} 170 ${H - 76} Q196 ${H - 70} 200 ${H} Z`} fill={back} />
        <path d={`M500 ${H} Q520 ${H - 130} 552 ${H - 120} Q584 ${H - 110} 596 ${H} Z`} fill={back} />
        {[0, 1, 2, 3].map((k) => (
          <g key={k}>
            <path d={block(400 + k * 6, 60 - k * 12, 22, H - 8 - k * 28)} fill={ink} />
            <path d={`M${392 + k * 6} ${H - 30 - k * 28} L430 ${H - 44 - k * 28} L${468 - k * 6} ${H - 30 - k * 28} Z`} fill={ink} strokeLinejoin="round" stroke={ink} strokeWidth="1" />
          </g>
        ))}
        <rect x="400" y={H - 8} width="60" height="8" fill={ink} />
        <g fill="#fff" fillOpacity="0.14">
          {windows(400, 60, H - 19, 1, 'p0')}
          {windows(406, 48, H - 47, 1, 'p1')}
          {windows(412, 36, H - 75, 1, 'p2')}
        </g>
      </g>
    ),
  },
  PH: {
    sky: ['#283E6B', '#F0825A', '#FFCB94'],
    sun: '#FFE4AE',
    water: '#2F5D86',
    sunX: 180,
    landmark: (ink, back) => (
      <g>
        <path d={`M452 ${H - 158} q8 -20 30 -30 q-20 18 -22 32 Z`} fill={back} />
        <path d={`M300 ${H} Q420 ${H - 40} 450 ${H - 150} Q458 ${H - 160} 466 ${H - 150} Q496 ${H - 40} 620 ${H} Z`} fill={ink} />
      </g>
    ),
  },
  KH: {
    sky: ['#4A3350', '#E57A45', '#FFC581'],
    sun: '#FFDCA0',
    water: '#5B4C63',
    sunX: 470,
    landmark: (ink, back) => (
      <g>
        {[
          [196, 44, 96],
          [290, 44, 96],
        ].map(([x, w, h], i) => (
          <path key={i} d={`M${x} ${H - 30} Q${x + 4} ${H - 30 - h * 0.7} ${x + w / 2} ${H - 30 - h} Q${x + w - 4} ${H - 30 - h * 0.7} ${x + w} ${H - 30} Z`} fill={back} />
        ))}
        {[
          [160, 50, 110],
          [240, 60, 150],
          [330, 50, 110],
        ].map(([x, w, h], i) => (
          <path key={i} d={`M${x} ${H - 30} Q${x + 4} ${H - 30 - h * 0.7} ${x + w / 2} ${H - 30 - h} Q${x + w - 4} ${H - 30 - h * 0.7} ${x + w} ${H - 30} Z`} fill={ink} />
        ))}
        <path d={block(150, 230, 31)} fill={ink} />
        <g fill="#fff" fillOpacity="0.14">{windows(158, 214, H - 21, 2, 'k', 14)}</g>
      </g>
    ),
  },
  LA: {
    sky: ['#3A4458', '#E2915C', '#FFD9A8'],
    sun: '#FFEBC0',
    water: '#4E6268',
    sunX: 230,
    landmark: (ink, back) => (
      <g>
        <path d={`M0 ${H} Q100 ${H - 70} 200 ${H - 40} Q260 ${H - 20} 320 ${H} Z`} fill={back} />
        <path d={`M470 ${H - 148} V${H - 170}`} stroke={ink} {...LINE} />
        <path d={`M430 ${H - 38} Q440 ${H - 90} 470 ${H - 150} Q500 ${H - 90} 510 ${H - 38} Z`} fill={ink} />
        <path d={block(400, 140, 40)} fill={ink} />
        <g fill="#fff" fillOpacity="0.14">{windows(406, 128, H - 28, 2, 'l', 14)}</g>
      </g>
    ),
  },
  MM: {
    sky: ['#4B2F4F', '#E86E3E', '#FFBF78'],
    sun: '#FFD796',
    water: '#5D4560',
    sunX: 200,
    landmark: (ink, back) => (
      <g>
        {[330, 548].map((cx, i) => (
          <g key={i} fill={back}>
            <path d={`M${cx - 22} ${H} Q${cx - 18} ${H - 34} ${cx} ${H - 42} Q${cx + 18} ${H - 34} ${cx + 22} ${H} Z`} />
            <path d={`M${cx - 6} ${H - 40} Q${cx} ${H - 60} ${cx} ${H - 82} Q${cx} ${H - 60} ${cx + 6} ${H - 40} Z`} />
          </g>
        ))}
        <path d={`M390 ${H - 24} Q400 ${H - 80} 450 ${H - 96} Q500 ${H - 80} 510 ${H - 24} Z`} fill={ink} />
        <path d={`M436 ${H - 94} Q450 ${H - 140} 450 ${H - 190} Q450 ${H - 140} 464 ${H - 94} Z`} fill={ink} />
        <path d={block(360, 180, 26)} fill={ink} />
        <g fill="#fff" fillOpacity="0.14">{windows(366, 168, H - 17, 2, 'm', 14)}</g>
      </g>
    ),
  },
  BN: {
    sky: ['#26455F', '#EC8A57', '#FFD6A0'],
    sun: '#FFE8B8',
    water: '#2F6A7A',
    sunX: 470,
    landmark: (ink, back) => (
      <g>
        <path d={block(340, 12, 150)} fill={back} />
        <path d={`M338 ${H - 148} L346 ${H - 172} L354 ${H - 148} Z`} fill={back} strokeLinejoin="round" />
        <path d={`M240 ${H - 90} V${H - 110}`} stroke={ink} {...LINE} />
        <path d={`M196 ${H - 48} Q240 ${H - 130} 284 ${H - 48} Z`} fill={ink} />
        <path d={block(160, 160, 50)} fill={ink} />
        <g fill="#fff" fillOpacity="0.14">{windows(166, 148, H - 38, 3, 'n', 12)}</g>
      </g>
    ),
  },
};

export const MarketScene = ({ scene, className }: { scene: SceneConfig; className?: string }) => {
  const id = useId().replace(/:/g, '');
  const [top, mid, horizon] = scene.sky;
  return (
    <svg aria-hidden="true" viewBox="0 0 640 452" preserveAspectRatio="xMidYMid slice" className={cn('block h-full w-full', className)}>
      <defs>
        <linearGradient id={`sky-${id}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="0.55" stopColor={mid} />
          <stop offset="1" stopColor={horizon} />
        </linearGradient>
        <radialGradient id={`halo-${id}`}>
          <stop offset="0" stopColor={scene.sun} stopOpacity="0.35" />
          <stop offset="1" stopColor={scene.sun} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`water-${id}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={scene.water} stopOpacity="0.85" />
          <stop offset="1" stopColor={scene.water} />
        </linearGradient>
      </defs>
      <rect width="640" height={H} fill={`url(#sky-${id})`} />
      <g style={{ transform: `translateX(${scene.sunX - 320}px)`, transition: 'transform 600ms cubic-bezier(0.2,0,0,1)' }}>
        <circle cx="320" cy={H - 34} r="150" fill={`url(#halo-${id})`} />
        <circle cx="320" cy={H - 34} r="46" fill={scene.sun} />
      </g>
      <path d={`M0 ${H} Q160 ${H - 46} 300 ${H - 24} T640 ${H - 30} V${H} Z`} fill={top} opacity="0.35" />
      {scene.landmark(top, `${top}8c`)}
      <rect y={H} width="640" height={452 - H} fill={`url(#water-${id})`} />
      {/* Sun reflection: three short strokes under the sun, shortening with depth */}
      <g stroke={scene.sun} strokeWidth="3" strokeLinecap="round" opacity="0.75">
        {[
          [14, 72],
          [30, 48],
          [46, 26],
        ].map(([dy, w]) => (
          <line key={dy} x1={scene.sunX - w / 2} x2={scene.sunX + w / 2} y1={H + dy} y2={H + dy} />
        ))}
      </g>
      {scene.sand ? (
        <rect y="396" width="640" height="56" fill={scene.sandColor ?? '#EAD6B8'} />
      ) : (
        <g opacity="0.12" transform="translate(0 380) scale(0.8 0.12)">
          {CONTOUR_PATHS.map((p, i) => (
            <path key={i} d={p.d} stroke="#fff" strokeWidth="6" fill="none" />
          ))}
        </g>
      )}
    </svg>
  );
};
