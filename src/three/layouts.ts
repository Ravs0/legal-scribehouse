import type { StoneShape } from './stoneGeometry';

export type Variant = 'basalt' | 'sandstone' | 'jade' | 'pearl' | 'glaze';

export interface StoneDef {
  variant: Variant;
  shape: StoneShape;
}

/** Nine stones. Mobile uses MOBILE_STONES only. */
export const STONES: StoneDef[] = [
  { variant: 'basalt', shape: { seed: 11, squash: [1.15, 0.62, 0.98], amplitude: 0.28, frequency: 1.9 } },
  { variant: 'sandstone', shape: { seed: 23, squash: [1.08, 0.6, 0.92], amplitude: 0.26, frequency: 2.1 } },
  { variant: 'jade', shape: { seed: 37, squash: [1.02, 0.7, 0.9], amplitude: 0.2, frequency: 1.7 } },
  { variant: 'pearl', shape: { seed: 41, squash: [1.0, 0.74, 0.96], amplitude: 0.16, frequency: 1.8 } },
  { variant: 'glaze', shape: { seed: 53, squash: [1.1, 0.62, 0.95], amplitude: 0.24, frequency: 2.0 } },
  { variant: 'basalt', shape: { seed: 61, squash: [1.0, 0.6, 0.88], amplitude: 0.3, frequency: 2.2 } },
  { variant: 'jade', shape: { seed: 71, squash: [1.12, 0.66, 0.9], amplitude: 0.2, frequency: 1.8 } },
  { variant: 'sandstone', shape: { seed: 83, squash: [1.0, 0.64, 0.94], amplitude: 0.27, frequency: 2.1 } },
  { variant: 'pearl', shape: { seed: 97, squash: [0.96, 0.72, 1.0], amplitude: 0.16, frequency: 1.7 } },
];
export const MOBILE_STONES = [0, 1, 2, 3, 4];

/** [nx, ny, z, scale]: nx/ny are -1..1 across the viewport at that depth. */
export type Slot = [number, number, number, number];

export interface Stage {
  slots: Slot[];
  /** 0 = stones sit level and only turn slowly (cairn, stepping stones); 1 = free tumble. */
  tumble: number;
  /** Idle float amplitude (world units). */
  float: number;
  /** All stones bob together (keeps a stack looking balanced). */
  sync: boolean;
}

// Layouts keep stones clear of left-aligned headings and pass behind the glass panels.
export const STAGES: Record<string, Stage> = {
  hero: {
    tumble: 0,
    float: 0.08,
    sync: true,
    slots: [
      [0.8, -0.46, 0, 1.15],
      [0.81, -0.12, 0.2, 0.86],
      [0.79, 0.15, 0.4, 0.66],
      [0.46, -0.9, -2, 0.36],
      [0.8, 0.36, 0.3, 0.44],
      [0.06, -0.86, -3, 0.5],
      [0.99, -0.92, 1, 0.42],
      [-0.97, -0.7, -4, 0.5],
      [-0.42, -0.95, -2, 0.28],
    ],
  },
  problems: {
    tumble: 1,
    float: 0.2,
    sync: false,
    slots: [
      [0.86, 0.58, -1, 0.85],
      [-0.94, -0.62, -1, 0.75],
      [0.62, -0.78, 0, 0.62],
      [0.97, -0.08, 1, 0.38],
      [0.6, 0.86, -2, 0.42],
      [0.36, 0.9, -3, 0.48],
      [-0.98, 0.12, 0, 0.36],
      [0.12, -0.95, -2, 0.46],
      [0.72, 0.18, 1, 0.28],
    ],
  },
  markets: {
    tumble: 0.25,
    float: 0.1,
    sync: false,
    slots: [
      [-0.8, -0.82, -6, 0.95],
      [-0.42, -0.9, -5, 0.65],
      [0.02, -0.84, -7, 0.8],
      [0.4, -0.94, -4, 0.42],
      [0.72, -0.8, -6, 0.6],
      [0.97, -0.6, -5, 0.5],
      [-0.98, -0.4, -4, 0.4],
      [0.92, 0.75, -8, 0.5],
      [-0.98, -0.1, -8, 0.36],
    ],
  },
  services: {
    tumble: 0.6,
    float: 0.16,
    sync: false,
    slots: [
      [0.9, 0.62, -2, 0.7],
      [0.97, 0.05, -1, 0.55],
      [0.88, -0.55, -2, 0.62],
      [-0.96, 0.45, -1, 0.35],
      [-0.9, -0.62, -2, 0.5],
      [0.6, 0.92, -5, 0.45],
      [-0.5, 0.95, -5, 0.4],
      [0.45, -0.95, -4, 0.45],
      [-0.25, -0.98, -4, 0.3],
    ],
  },
  // Stepping stones across the bottom of the viewport.
  process: {
    tumble: 0,
    float: 0.05,
    sync: false,
    slots: [
      [-0.86, -0.82, 0, 0.72],
      [-0.43, -0.74, 0, 0.68],
      [0.0, -0.66, 0, 0.64],
      [0.43, -0.58, 0, 0.6],
      [0.86, -0.5, 0, 0.56],
      [0.92, 0.8, -5, 0.5],
      [0.98, 0.3, -5, 0.45],
      [0.5, 0.94, -6, 0.5],
      [0.25, 0.97, -6, 0.35],
    ],
  },
  // The cairn again, under the readiness heading on the left.
  readiness: {
    tumble: 0,
    float: 0.07,
    sync: true,
    slots: [
      [-0.72, -0.8, 0, 0.95],
      [-0.71, -0.52, 0.2, 0.72],
      [-0.73, -0.3, 0.4, 0.55],
      [0.97, 0.82, -2, 0.4],
      [-0.72, -0.13, 0.3, 0.36],
      [0.98, -0.82, -1, 0.5],
      [0.35, 0.95, -5, 0.4],
      [0.3, -0.97, -4, 0.45],
      [0.6, 0.9, -2, 0.3],
    ],
  },
  proof: {
    tumble: 0.5,
    float: 0.15,
    sync: false,
    slots: [
      [0.94, 0.62, -2, 0.7],
      [0.95, -0.7, -2, 0.62],
      [-0.95, -0.82, -3, 0.5],
      [-0.96, -0.3, 0, 0.36],
      [0.55, 0.95, -4, 0.4],
      [-0.6, -0.95, -3, 0.48],
      [0.98, 0.05, -1, 0.4],
      [0.1, 0.98, -6, 0.42],
      [-0.2, -0.98, -5, 0.3],
    ],
  },
  insights: {
    tumble: 0.5,
    float: 0.15,
    sync: false,
    slots: [
      [0.92, 0.72, -2, 0.75],
      [-0.94, -0.72, -2, 0.6],
      [-0.9, -0.3, -3, 0.5],
      [0.96, -0.35, 0, 0.36],
      [0.55, 0.96, -4, 0.4],
      [0.6, -0.96, -3, 0.48],
      [-0.98, 0.0, -1, 0.4],
      [0.15, -0.98, -6, 0.42],
      [-0.1, 0.98, -5, 0.3],
    ],
  },
  faq: {
    tumble: 0.3,
    float: 0.12,
    sync: false,
    slots: [
      [-0.78, -0.78, -1, 0.8],
      [-0.5, -0.88, -2, 0.55],
      [-0.9, -0.45, -2, 0.5],
      [0.97, 0.7, -2, 0.36],
      [-0.62, -0.56, -1, 0.4],
      [0.98, -0.85, -3, 0.48],
      [0.5, 0.97, -5, 0.4],
      [-0.2, 0.96, -6, 0.42],
      [0.2, -0.98, -5, 0.3],
    ],
  },
  // A loose cluster behind the form.
  contact: {
    tumble: 0.35,
    float: 0.14,
    sync: false,
    slots: [
      [0.42, 0.12, -6, 1.3],
      [0.7, -0.4, -5, 0.95],
      [0.18, -0.45, -7, 0.85],
      [0.85, 0.55, -4, 0.45],
      [0.62, 0.62, -6, 0.6],
      [-0.92, -0.8, -3, 0.5],
      [-0.95, 0.75, -4, 0.4],
      [0.95, -0.9, -3, 0.42],
      [0.3, 0.85, -7, 0.35],
    ],
  },
  // Inner pages: calm, out of the reading column.
  page: {
    tumble: 0.3,
    float: 0.12,
    sync: false,
    slots: [
      [0.9, 0.62, -3, 0.85],
      [0.95, -0.1, -2, 0.6],
      [-0.94, -0.7, -3, 0.65],
      [0.86, -0.75, -1, 0.4],
      [-0.9, -0.25, -4, 0.45],
      [0.55, 0.97, -6, 0.4],
      [-0.6, -0.98, -5, 0.38],
      [0.98, 0.3, -6, 0.42],
      [-0.98, 0.15, -5, 0.3],
    ],
  },
};
