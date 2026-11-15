import { useEffect, useState } from 'react';

interface ScoreGaugeProps {
  score: number;
  max: number;
  /** CSS colour for the value arc. */
  color: string;
}

/** Semicircle gauge (200×110, stroke 14) that sweeps to the score over 900ms. */
export const ScoreGauge = ({ score, max, color }: ScoreGaugeProps) => {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(score / max));
    return () => cancelAnimationFrame(id);
  }, [score, max]);

  const r = 86;
  const arc = `M ${100 - r} 100 A ${r} ${r} 0 0 1 ${100 + r} 100`;
  return (
    <div className="relative mx-auto h-[110px] w-[200px]" aria-hidden="true">
      <svg viewBox="0 0 200 110" className="h-full w-full" fill="none">
        <path d={arc} stroke="hsl(var(--surface-container-high))" strokeWidth="14" strokeLinecap="round" />
        <path
          d={arc}
          pathLength={1}
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray="1"
          strokeDashoffset={1 - shown}
          style={{ transition: 'stroke-dashoffset 900ms cubic-bezier(0.2,0,0,1)' }}
        />
      </svg>
      <div className="absolute inset-x-0 bottom-0 text-center">
        <span className="type-headline-lg tabular">{score}</span>
        <span className="type-title-md text-muted-foreground">/{max}</span>
      </div>
    </div>
  );
};
