import { ReactNode, useId } from 'react';
import { CONTOUR_PATHS } from '@/lib/contours';
import { cn } from '@/lib/utils';

/**
 * Dawn horizon scenes. One SVG (640×452): sky gradient, sun + halo, far ridge, a landmark silhouette,
 * water with sun reflections, and a contour-textured foreground strip.
 */
export interface SceneConfig {
  sky: [string, string, string];
  sun: string;
  water: string;
  sunX: number;
  landmark: (ink: string, ink2: string) => ReactNode;
  sand?: boolean;
}

const H = 300; // horizon

const towers = (xs: [number, number, number][], ink: string) =>
  xs.map(([x, w, h], i) => <rect key={i} x={x} y={H - h} width={w} height={h} fill={ink} />);

export const SCENES: Record<string, SceneConfig> = {
  home: {
    sky: ['#F7B58A', '#FFD9B0', '#FFF1DC'],
    sun: '#FFE7BF',
    water: '#7FB3C2',
    sunX: 400,
    sand: true,
    landmark: (ink) => <path d={`M0 ${H} Q120 ${H - 34} 240 ${H - 12} T520 ${H - 20} T640 ${H - 8} V${H} Z`} fill={ink} opacity="0.35" />,
  },
  SG: {
    sky: ['#2B3A67', '#F08A5D', '#FFD3A1'],
    sun: '#FFE2B0',
    water: '#35507A',
    sunX: 230,
    landmark: (ink, ink2) => (
      <g>
        {towers([[360, 26, 120], [392, 20, 92], [418, 30, 150], [454, 22, 110], [482, 28, 132], [516, 18, 84]], ink)}
        <path d={`M548 ${H} V${H - 96} H600 M560 ${H - 96} L600 ${H - 72} M588 ${H} V${H - 70}`} stroke={ink2} strokeWidth="5" fill="none" />
        <path d={`M100 ${H} V${H - 70} H150 M112 ${H - 70} L148 ${H - 50}`} stroke={ink2} strokeWidth="4" fill="none" />
      </g>
    ),
  },
  MY: {
    sky: ['#3B2F63', '#E9765B', '#FFC98A'],
    sun: '#FFD9A0',
    water: '#3F4B78',
    sunX: 210,
    landmark: (ink, ink2) => (
      <g>
        <path d={`M400 ${H} V${H - 150} L408 ${H - 175} L410 ${H - 215} L412 ${H - 175} L420 ${H - 150} V${H} Z`} fill={ink} />
        <path d={`M460 ${H} V${H - 150} L468 ${H - 175} L470 ${H - 215} L472 ${H - 175} L480 ${H - 150} V${H} Z`} fill={ink} />
        <rect x="420" y={H - 112} width="40" height="5" fill={ink} />
        {towers([[330, 24, 70], [500, 26, 86], [534, 20, 60]], ink2)}
      </g>
    ),
  },
  ID: {
    sky: ['#44305E', '#F26A1C', '#FFC27A'],
    sun: '#FFE0A8',
    water: '#4A4470',
    sunX: 470,
    landmark: (ink, ink2) => (
      <g>
        <path d={`M200 ${H} L210 ${H - 30} H230 L240 ${H} Z`} fill={ink} />
        <path d={`M214 ${H - 30} L218 ${H - 160} H222 L226 ${H - 30} Z`} fill={ink} />
        <path d={`M216 ${H - 160} q4 -14 4 -22 q4 8 4 22 Z`} fill={ink2} />
        <path d={`M340 ${H} V${H - 80} H410 M352 ${H - 80} L400 ${H - 60} M396 ${H} V${H - 60}`} stroke={ink} strokeWidth="5" fill="none" />
        <path d={`M560 ${H} V${H - 64} H612 M570 ${H - 64} L606 ${H - 48}`} stroke={ink2} strokeWidth="4" fill="none" />
      </g>
    ),
  },
  TH: {
    sky: ['#50305A', '#EE7B4F', '#FFD08F'],
    sun: '#FFE6B5',
    water: '#5A4A6E',
    sunX: 190,
    landmark: (ink, ink2) => (
      <g>
        {[
          [400, 70, 170],
          [356, 44, 110],
          [476, 44, 110],
        ].map(([x, w, h], i) => (
          <path key={i} d={`M${x} ${H} V${H - h * 0.45} Q${x + w / 2} ${H - h * 0.6} ${x + w / 2} ${H - h} Q${x + w / 2} ${H - h * 0.6} ${x + w} ${H - h * 0.45} V${H} Z`} fill={i === 0 ? ink : ink2} />
        ))}
      </g>
    ),
  },
  VN: {
    sky: ['#2F4A5E', '#E8915F', '#FFDBA6'],
    sun: '#FFF0C4',
    water: '#3E6672',
    sunX: 300,
    landmark: (ink, ink2) => (
      <g>
        <path d={`M40 ${H} Q60 ${H - 120} 90 ${H - 110} Q120 ${H - 100} 130 ${H} Z M120 ${H} Q140 ${H - 80} 170 ${H - 76} Q196 ${H - 70} 200 ${H} Z`} fill={ink2} />
        <path d={`M500 ${H} Q520 ${H - 130} 552 ${H - 120} Q584 ${H - 110} 596 ${H} Z`} fill={ink2} />
        {[0, 1, 2, 3].map((k) => (
          <g key={k}>
            <rect x={400 + k * 6} y={H - 30 - k * 28} width={60 - k * 12} height="22" fill={ink} />
            <path d={`M${392 + k * 6} ${H - 30 - k * 28} L${430} ${H - 44 - k * 28} L${468 - k * 6} ${H - 30 - k * 28} Z`} fill={ink} />
          </g>
        ))}
      </g>
    ),
  },
  PH: {
    sky: ['#283E6B', '#F0825A', '#FFCB94'],
    sun: '#FFE4AE',
    water: '#2F5D86',
    sunX: 180,
    landmark: (ink, ink2) => (
      <g>
        <path d={`M300 ${H} Q420 ${H - 40} 450 ${H - 150} Q458 ${H - 160} 466 ${H - 150} Q496 ${H - 40} 620 ${H} Z`} fill={ink} />
        <path d={`M452 ${H - 158} q8 -20 30 -30 q-20 18 -22 32 Z`} fill={ink2} opacity="0.7" />
      </g>
    ),
  },
  KH: {
    sky: ['#4A3350', '#E57A45', '#FFC581'],
    sun: '#FFDCA0',
    water: '#5B4C63',
    sunX: 470,
    landmark: (ink, ink2) => (
      <g>
        <rect x="150" y={H - 30} width="230" height="30" fill={ink2} />
        {[
          [160, 50, 110],
          [240, 60, 150],
          [330, 50, 110],
        ].map(([x, w, h], i) => (
          <path key={i} d={`M${x} ${H - 30} Q${x + 4} ${H - 30 - h * 0.7} ${x + w / 2} ${H - 30 - h} Q${x + w - 4} ${H - 30 - h * 0.7} ${x + w} ${H - 30} Z`} fill={ink} />
        ))}
      </g>
    ),
  },
  LA: {
    sky: ['#3A4458', '#E2915C', '#FFD9A8'],
    sun: '#FFEBC0',
    water: '#4E6268',
    sunX: 230,
    landmark: (ink, ink2) => (
      <g>
        <path d={`M0 ${H} Q100 ${H - 70} 200 ${H - 40} Q260 ${H - 20} 320 ${H} Z`} fill={ink2} />
        <rect x="400" y={H - 40} width="140" height="40" fill={ink} />
        <path d={`M430 ${H - 40} Q440 ${H - 90} 470 ${H - 150} Q500 ${H - 90} 510 ${H - 40} Z`} fill={ink} />
        <rect x="468" y={H - 172} width="4" height="24" fill={ink} />
      </g>
    ),
  },
  MM: {
    sky: ['#4B2F4F', '#E86E3E', '#FFBF78'],
    sun: '#FFD796',
    water: '#5D4560',
    sunX: 200,
    landmark: (ink, ink2) => (
      <g>
        <rect x="360" y={H - 26} width="180" height="26" fill={ink2} />
        <path d={`M390 ${H - 26} Q400 ${H - 80} 450 ${H - 96} Q500 ${H - 80} 510 ${H - 26} Z`} fill={ink} />
        <path d={`M436 ${H - 94} Q450 ${H - 140} 450 ${H - 190} Q450 ${H - 140} 464 ${H - 94} Z`} fill={ink} />
      </g>
    ),
  },
  BN: {
    sky: ['#26455F', '#EC8A57', '#FFD6A0'],
    sun: '#FFE8B8',
    water: '#2F6A7A',
    sunX: 470,
    landmark: (ink, ink2) => (
      <g>
        <rect x="160" y={H - 50} width="160" height="50" fill={ink} />
        <path d={`M196 ${H - 50} Q240 ${H - 130} 284 ${H - 50} Z`} fill={ink} />
        <rect x="238" y={H - 140} width="4" height="16" fill={ink} />
        <rect x="340" y={H - 150} width="12" height="150" fill={ink2} />
        <path d={`M338 ${H - 150} L346 ${H - 172} L354 ${H - 150} Z`} fill={ink2} />
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
      {scene.landmark(top, `${top}cc`)}
      <rect y={H} width="640" height={452 - H} fill={`url(#water-${id})`} />
      {/* Sun reflection on the water */}
      <g stroke={scene.sun} strokeWidth="3" strokeLinecap="round" strokeDasharray="40 18" opacity="0.75">
        {[0, 1, 2, 3, 4, 5, 6].map((k) => (
          <line key={k} x1={scene.sunX - 60 + k * 6} x2={scene.sunX + 60 - k * 6} y1={H + 10 + k * 12} y2={H + 10 + k * 12} />
        ))}
      </g>
      {scene.sand ? (
        <rect y="396" width="640" height="56" fill="#EAD6B8" />
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
