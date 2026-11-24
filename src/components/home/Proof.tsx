import { PointerEvent, useEffect, useRef, useState } from 'react';
import { PLACEHOLDER, STATS, TESTIMONIALS } from '@/data/proof';
import { CountUp } from '@/components/motion/CountUp';
import { useInView } from '@/hooks/useInView';
import { prefersReducedMotion } from '@/lib/reveal';
import '@/styles/proof-ledger.css';

const ROT = [-2.6, 1.9, -1.3];
const LETTERS = ['A', 'B', 'C', 'D'];

/** v5.8 "The ledger wall": giant counted numerals ruled like a ledger; client notes pinned up as receipt slips. */
export const Proof = () => {
  const scene = useRef<HTMLElement>(null);
  const slips = useRef<HTMLUListElement>(null);
  const raf = useRef(0);
  const inView = useInView(slips, { threshold: 0.2 });
  const [armed, setArmed] = useState(false);
  useEffect(() => setArmed(true), []);

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse' || prefersReducedMotion() || !scene.current) return;
    const r = scene.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      scene.current?.style.setProperty('--px', x.toFixed(3));
      scene.current?.style.setProperty('--py', y.toFixed(3));
    });
  };
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  return (
    <section id="proof" ref={scene} onPointerMove={onPointerMove} className="pl-scene" aria-labelledby="proof-title">
      <div aria-hidden="true" className="pl-light" />
      <div aria-hidden="true" className="pl-vignette" />

      <div className="container pl-inner">
        <div className="pl-marker type-mono-sm">
          <span>§ 08 results</span>
          {PLACEHOLDER && <span className="pl-chip">sample data</span>}
        </div>

        <div className="pl-grid">
          <div className="pl-left">
            <h2 id="proof-title" className="pl-title section-title">Small exporters, cleared to sell.</h2>

            <dl className="pl-stats">
              {STATS.map((s, i) => (
                <div key={s.label} className="pl-stat">
                  <span className="pl-idx type-mono-sm" aria-hidden="true">{LETTERS[i]}</span>
                  <dd className="pl-num">
                    <CountUp value={s.value} />
                    {s.suffix && (
                      <>
                        <span className="pl-suf" aria-hidden="true">{s.suffix}</span>
                        <span className="sr-only">{s.suffix}</span>
                      </>
                    )}
                  </dd>
                  <dt className="pl-label type-mono-sm">{s.label}</dt>
                </div>
              ))}
            </dl>
          </div>

          <ul ref={slips} className="pl-slips no-scrollbar" data-in={armed && inView ? 'true' : 'false'} aria-label="Client notes">
            {TESTIMONIALS.map((t, i) => (
              <li
                key={t.who}
                className="pl-slip"
                style={{ ['--r' as string]: `${ROT[i % ROT.length]}deg`, ['--i' as string]: i, ['--k' as string]: 14 + i * 6 }}
              >
                <span className="pl-tape" aria-hidden="true" />
                <div className="pl-sway">
                  <figure className="pl-paper receipt-edge" tabIndex={0}>
                    <div className="pl-slip-head type-mono-sm"><span>Straitline · client note</span><span>No. {String(14 + i * 13).padStart(3, '0')}</span></div>
                    <blockquote className="pl-quote">{t.quote}</blockquote>
                    <figcaption className="pl-cap">
                      <span className="pl-who">{t.who}</span>
                      <span className="pl-route type-mono-sm">{t.route}</span>
                      <span className="barcode pl-bar" aria-hidden="true" />
                    </figcaption>
                  </figure>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
