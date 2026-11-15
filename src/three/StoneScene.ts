import {
  ACESFilmicToneMapping,
  Color,
  DirectionalLight,
  HemisphereLight,
  Mesh,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  PMREMGenerator,
  Scene,
  SRGBColorSpace,
  Texture,
  WebGLRenderer,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { createStoneGeometry, mulberry32 } from './stoneGeometry';
import { MOBILE_STONES, STAGES, STONES, type Stage, type Variant } from './layouts';

type Theme = 'dark' | 'light';

const FOV = 35;
const CAMERA_Z = 14;

/** Physical material recipes per stone variant and theme. */
function materialFor(variant: Variant, theme: Theme, lite: boolean): MeshPhysicalMaterial {
  const dark = theme === 'dark';
  switch (variant) {
    case 'basalt':
      return new MeshPhysicalMaterial({
        color: dark ? '#1c2132' : '#2b3248',
        roughness: 0.34,
        metalness: 0,
        clearcoat: 1,
        clearcoatRoughness: 0.12,
      });
    case 'sandstone':
      return new MeshPhysicalMaterial({
        color: dark ? '#d39c6c' : '#e5b385',
        roughness: 0.8,
        clearcoat: 0.25,
        clearcoatRoughness: 0.6,
        sheen: 0.5,
        sheenColor: new Color('#ffd7ad'),
        sheenRoughness: 0.6,
      });
    case 'jade':
      return lite
        ? new MeshPhysicalMaterial({ color: '#3fc2b2', roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.05 })
        : new MeshPhysicalMaterial({
            color: dark ? '#9ef0e2' : '#7fe0d2',
            roughness: 0.12,
            transmission: 1,
            thickness: 1.4,
            ior: 1.5,
            attenuationColor: new Color('#1fa596'),
            attenuationDistance: 1.1,
            clearcoat: 1,
            clearcoatRoughness: 0.05,
          });
    case 'pearl':
      return new MeshPhysicalMaterial({
        color: dark ? '#e6e3ff' : '#f1efff',
        roughness: 0.22,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
        iridescence: 1,
        iridescenceIOR: 1.35,
        iridescenceThicknessRange: [180, 620],
        sheen: 0.3,
        sheenColor: new Color('#c9c2ff'),
      });
    case 'glaze':
      return new MeshPhysicalMaterial({
        color: dark ? '#7b6dff' : '#5b4ce8',
        roughness: 0.26,
        clearcoat: 1,
        clearcoatRoughness: 0.06,
      });
  }
}

interface StoneState {
  mesh: Mesh;
  x: number;
  y: number;
  z: number;
  s: number;
  ax: number;
  ay: number;
  az: number;
  wx: number;
  wy: number;
  wz: number;
  phase: number;
  period: number;
}

const smooth = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export interface StoneSceneOptions {
  canvas: HTMLCanvasElement;
  mobile: boolean;
  reducedMotion: boolean;
  theme: Theme;
}

/**
 * Fixed full-viewport scene of floating stones. Native scroll drives which
 * arrangement ("stage") the stones move toward; the pointer adds parallax.
 */
export class StoneScene {
  private renderer: WebGLRenderer;
  private scene = new Scene();
  private camera = new PerspectiveCamera(FOV, 1, 0.1, 100);
  private stones: StoneState[] = [];
  private env: Texture;
  private hemi = new HemisphereLight();
  private key = new DirectionalLight();
  private rimA = new DirectionalLight();
  private rimB = new DirectionalLight();
  private stageEls: HTMLElement[] = [];
  private pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  private raf = 0;
  private last = 0;
  private time = 0;
  private lastScroll = 0;
  private spinBoost = 0;
  private slowFrames = 0;
  private frames = 0;
  private dpr: number;
  private lite: boolean;
  private theme: Theme;
  private running = false;
  private disposed = false;

  constructor(private opts: StoneSceneOptions) {
    const { canvas, mobile } = opts;
    this.theme = opts.theme;
    this.lite = mobile;
    this.renderer = new WebGLRenderer({ canvas, alpha: true, antialias: !mobile, powerPreference: 'high-performance' });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.outputColorSpace = SRGBColorSpace;
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.5);
    this.renderer.setPixelRatio(this.dpr);

    const pmrem = new PMREMGenerator(this.renderer);
    this.env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
    this.scene.environment = this.env;

    this.key.position.set(5, 6, 8);
    this.rimA.position.set(-6, 2, -4);
    this.rimB.position.set(6, -4, -3);
    this.scene.add(this.hemi, this.key, this.rimA, this.rimB);

    const ids = mobile ? MOBILE_STONES : STONES.map((_, i) => i);
    const rand = mulberry32(7);
    for (const i of ids) {
      const def = STONES[i];
      const geo = createStoneGeometry(def.shape, mobile ? 8 : 14);
      const mesh = new Mesh(geo, materialFor(def.variant, this.theme, this.lite));
      mesh.userData.index = i;
      mesh.userData.variant = def.variant;
      this.scene.add(mesh);
      this.stones.push({
        mesh,
        x: 0,
        y: 0,
        z: 0,
        s: 0.001,
        ax: rand() * Math.PI,
        ay: rand() * Math.PI * 2,
        az: rand() * Math.PI,
        wx: (rand() - 0.5) * 0.9,
        wy: 0.12 + rand() * 0.25,
        wz: (rand() - 0.5) * 0.7,
        phase: rand() * Math.PI * 2,
        period: 5 + rand() * 3,
      });
    }

    this.applyTheme(this.theme);
    this.resize();
    this.refreshStages();
    this.snapToTarget();
    this.lastScroll = window.scrollY;
  }

  /** Re-read [data-stage] sections (call after route changes). */
  refreshStages() {
    this.stageEls = Array.from(document.querySelectorAll<HTMLElement>('[data-stage]'));
  }

  setTheme(theme: Theme) {
    if (theme === this.theme) return;
    this.theme = theme;
    for (const st of this.stones) {
      const old = st.mesh.material as MeshPhysicalMaterial;
      st.mesh.material = materialFor(st.mesh.userData.variant, theme, this.lite);
      old.dispose();
    }
    this.applyTheme(theme);
    if (!this.running) this.render();
  }

  private applyTheme(theme: Theme) {
    const dark = theme === 'dark';
    this.hemi.color.set(dark ? '#9aa8ff' : '#ffffff');
    this.hemi.groundColor.set(dark ? '#140f2e' : '#c9cbe8');
    this.hemi.intensity = dark ? 0.6 : 0.9;
    this.key.color.set('#ffffff');
    this.key.intensity = dark ? 2.2 : 2.6;
    this.rimA.color.set('#3fe0ff');
    this.rimA.intensity = dark ? 1.6 : 1.0;
    this.rimB.color.set('#ff5ad1');
    this.rimB.intensity = dark ? 0.9 : 0.5;
    this.scene.environmentIntensity = dark ? 0.9 : 1.1;
    this.renderer.toneMappingExposure = dark ? 1.0 : 1.05;
  }

  setPointer(nx: number, ny: number) {
    this.pointer.tx = nx;
    this.pointer.ty = ny;
  }

  resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    if (!this.running) this.render();
  }

  /** Blend of the two stages around the viewport centre. */
  private target(): { stageA: Stage; stageB: Stage; t: number } {
    const fallback = STAGES.page;
    if (!this.stageEls.length) return { stageA: fallback, stageB: fallback, t: 0 };
    const mid = window.innerHeight / 2;
    let idx = 0;
    let frac = 0.5;
    for (let i = 0; i < this.stageEls.length; i++) {
      const r = this.stageEls[i].getBoundingClientRect();
      if (r.top <= mid) {
        idx = i;
        frac = r.height > 0 ? (mid - r.top) / r.height : 0.5;
      }
    }
    // Hold each stage around its section's middle; travel between middles.
    let s = idx + Math.min(frac, 1) - 0.5;
    s = Math.max(0, Math.min(this.stageEls.length - 1, s));
    const a = Math.floor(s);
    const b = Math.min(a + 1, this.stageEls.length - 1);
    const name = (i: number) => this.stageEls[i].dataset.stage ?? 'page';
    return { stageA: STAGES[name(a)] ?? fallback, stageB: STAGES[name(b)] ?? fallback, t: smooth(s - a) };
  }

  private computeTargets() {
    const { stageA, stageB, t } = this.target();
    const tanHalf = Math.tan(((FOV / 2) * Math.PI) / 180);
    const mobileScale = this.opts.mobile ? 0.5 : 1;
    return this.stones.map((st) => {
      const i = st.mesh.userData.index as number;
      const A = stageA.slots[i];
      const B = stageB.slots[i];
      const z = lerp(A[2], B[2], t);
      const dist = CAMERA_Z - z;
      const halfH = dist * tanHalf;
      const halfW = halfH * this.camera.aspect;
      // On narrow screens push stones toward the edges so they frame, not cover, the text.
      const nx = lerp(A[0], B[0], t);
      const edge = this.opts.mobile ? (Math.sign(nx) || 1) * 1.04 : nx;
      const scaleUnit = halfH / (CAMERA_Z * tanHalf); // keeps on-screen size stable across depths
      return {
        x: edge * halfW,
        y: lerp(A[1], B[1], t) * halfH,
        z,
        s: lerp(A[3], B[3], t) * mobileScale * scaleUnit,
        tumble: lerp(stageA.tumble, stageB.tumble, t),
        float: lerp(stageA.float, stageB.float, t),
        sync: t < 0.5 ? stageA.sync : stageB.sync,
      };
    });
  }

  private snapToTarget() {
    const targets = this.computeTargets();
    this.stones.forEach((st, i) => {
      const tg = targets[i];
      st.x = tg.x;
      st.y = tg.y;
      st.z = tg.z;
      st.s = tg.s;
    });
    this.applyTransforms(targets, 0);
  }

  private applyTransforms(targets: ReturnType<StoneScene['computeTargets']>, time: number) {
    this.stones.forEach((st, i) => {
      const tg = targets[i];
      const phase = tg.sync ? 0 : st.phase;
      const bob = Math.sin((time / st.period) * Math.PI * 2 + phase) * tg.float;
      const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));
      st.mesh.position.set(st.x, st.y + bob, st.z);
      st.mesh.scale.setScalar(st.s);
      // Level stones (tumble 0) sit flat and only turn; tumbling ones roll freely.
      st.mesh.rotation.set(wrap(st.ax) * tg.tumble, st.ay, wrap(st.az) * tg.tumble);
    });
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  private frame = (now: number) => {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this.frame);
    if (document.hidden) {
      this.last = now;
      return;
    }
    const dt = Math.min(0.05, this.last ? (now - this.last) / 1000 : 0.016);
    this.last = now;
    this.time += dt;

    // Scroll velocity adds a little spin, so the scene feels connected to the page.
    const sy = window.scrollY;
    const v = Math.abs(sy - this.lastScroll) / Math.max(dt, 0.001);
    this.lastScroll = sy;
    this.spinBoost = lerp(this.spinBoost, Math.min(v / 1500, 2.5), 1 - Math.exp(-dt * 6));

    const targets = this.computeTargets();
    const k = 1 - Math.exp(-dt * 3.2);
    this.stones.forEach((st, i) => {
      const tg = targets[i];
      st.x = lerp(st.x, tg.x, k);
      st.y = lerp(st.y, tg.y, k);
      st.z = lerp(st.z, tg.z, k);
      st.s = lerp(st.s, tg.s, k);
      const spin = 1 + this.spinBoost;
      st.ay += st.wy * dt * (0.35 + tg.tumble) * spin;
      st.ax += st.wx * dt * tg.tumble * spin;
      st.az += st.wz * dt * tg.tumble * spin;
    });
    this.applyTransforms(targets, this.time);

    // Pointer parallax on the camera.
    this.pointer.x = lerp(this.pointer.x, this.pointer.tx, 1 - Math.exp(-dt * 2.5));
    this.pointer.y = lerp(this.pointer.y, this.pointer.ty, 1 - Math.exp(-dt * 2.5));
    this.camera.position.set(this.pointer.x * 0.6, -this.pointer.y * 0.4, CAMERA_Z);
    this.camera.lookAt(0, 0, 0);

    this.render();
    this.watchPerformance(dt);
  };

  /** Drop resolution, then glass transmission, if frames run long. */
  private watchPerformance(dt: number) {
    this.frames++;
    if (dt > 0.028) this.slowFrames++;
    if (this.frames < 90) return;
    if (this.slowFrames > 45) {
      if (this.dpr > 1) {
        this.dpr = 1;
        this.renderer.setPixelRatio(1);
        this.resize();
      } else if (!this.lite) {
        this.lite = true;
        for (const st of this.stones) {
          if (st.mesh.userData.variant === 'jade') {
            const old = st.mesh.material as MeshPhysicalMaterial;
            st.mesh.material = materialFor('jade', this.theme, true);
            old.dispose();
          }
        }
      }
    }
    this.frames = 0;
    this.slowFrames = 0;
  }

  start() {
    if (this.opts.reducedMotion) {
      this.snapToTarget();
      this.render();
      return;
    }
    if (this.running) return;
    this.running = true;
    this.last = 0;
    this.raf = requestAnimationFrame(this.frame);
  }

  /** For reduced motion: re-place stones for the current scroll position and draw once. */
  renderStatic() {
    this.snapToTarget();
    this.render();
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    for (const st of this.stones) {
      st.mesh.geometry.dispose();
      (st.mesh.material as MeshPhysicalMaterial).dispose();
    }
    this.env.dispose();
    this.renderer.dispose();
  }
}
