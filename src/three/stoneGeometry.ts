import { BufferGeometry, IcosahedronGeometry, Vector3 } from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

/** Deterministic PRNG so every visit gets the same stones. */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface StoneShape {
  seed: number;
  /** Non-uniform scale that turns a sphere into a pebble. */
  squash: [number, number, number];
  /** Large-scale lumpiness. */
  amplitude: number;
  frequency: number;
}

/**
 * Smooth pebble: an icosphere pushed in and out along its normals by a sum of
 * randomly oriented sine waves (cheap, smooth, organic), plus a faint fine grain
 * that catches the light like worn stone. Vertices are merged first so normals are smooth.
 */
export function createStoneGeometry(shape: StoneShape, detail: number): BufferGeometry {
  const rand = mulberry32(shape.seed);
  const waves = Array.from({ length: 7 }, () => {
    const dir = new Vector3(rand() * 2 - 1, rand() * 2 - 1, rand() * 2 - 1).normalize();
    return { dir, phase: rand() * Math.PI * 2, weight: 0.5 + rand() * 0.5 };
  });
  const grain = Array.from({ length: 5 }, () => ({
    dir: new Vector3(rand() * 2 - 1, rand() * 2 - 1, rand() * 2 - 1).normalize(),
    phase: rand() * Math.PI * 2,
  }));
  const weightSum = waves.reduce((s, w) => s + w.weight, 0);

  let geo: BufferGeometry = new IcosahedronGeometry(1, detail);
  geo.deleteAttribute('normal');
  geo.deleteAttribute('uv');
  geo = mergeVertices(geo);

  const pos = geo.getAttribute('position');
  const v = new Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i).normalize();
    let n = 0;
    for (const w of waves) n += Math.sin(v.dot(w.dir) * shape.frequency * Math.PI + w.phase) * w.weight;
    n /= weightSum;
    let g = 0;
    for (const w of grain) g += Math.sin(v.dot(w.dir) * 9 * Math.PI + w.phase);
    const r = 1 + n * shape.amplitude + (g / grain.length) * 0.02;
    pos.setXYZ(i, v.x * r * shape.squash[0], v.y * r * shape.squash[1], v.z * r * shape.squash[2]);
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
  geo.computeBoundingSphere();
  return geo;
}
