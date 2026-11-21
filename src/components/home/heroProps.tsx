/**
 * v5.4 hero props, drawn as lit objects (light from the upper left): three-quarter view, bevels, grain, contact
 * shadows. Each SVG has its own gradient ids (prefixed) so several can share a page.
 */

/** One wooden export crate, three-quarter view (front, top, right side). */
export const Crate = ({ id, label, sub, className }: { id: string; label?: string; sub?: string; className?: string }) => {
  const g = (n: string) => `${id}-${n}`;
  const plankYs = [52, 92, 132, 172];
  return (
    <svg viewBox="0 0 380 230" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={g('front')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#D9A46E" />
          <stop offset="0.55" stopColor="#CF9762" />
          <stop offset="1" stopColor="#BE8551" />
        </linearGradient>
        <linearGradient id={g('plank')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".22" />
          <stop offset=".18" stopColor="#fff" stopOpacity="0" />
          <stop offset=".85" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".18" />
        </linearGradient>
        <linearGradient id={g('top')} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#E9BC88" />
          <stop offset="1" stopColor="#F3CFA2" />
        </linearGradient>
        <linearGradient id={g('side')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#A4693A" />
          <stop offset="1" stopColor="#8A5530" />
        </linearGradient>
        <linearGradient id={g('batten')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#B57A45" />
          <stop offset=".5" stopColor="#C68D57" />
          <stop offset="1" stopColor="#A86E3C" />
        </linearGradient>
      </defs>
      {/* top face */}
      <path d="M0 36 L44 6 L380 6 L336 36 Z" fill={`url(#${g('top')})`} />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${14 + i * 12} ${26 - i * 8} L${350 + i * 12} ${26 - i * 8}`} stroke="#C99560" strokeOpacity=".55" strokeWidth="1.5" />
      ))}
      {/* right side */}
      <path d="M336 36 L380 6 L380 196 L336 226 Z" fill={`url(#${g('side')})`} />
      {[70, 110, 150, 190].map((y) => (
        <path key={y} d={`M336 ${y} L380 ${y - 30}`} stroke="#6E4224" strokeOpacity=".55" strokeWidth="2" />
      ))}
      {/* front planks */}
      <rect x="0" y="36" width="336" height="190" fill={`url(#${g('front')})`} />
      {plankYs.map((y, i) => (
        <g key={y}>
          <rect x="0" y={y - 16 + (i === 0 ? 0 : 0)} width="336" height="38" fill={`url(#${g('plank')})`} />
          <rect x="0" y={y + 22} width="336" height="3" fill="#7A4A26" opacity=".45" />
          {/* grain */}
          <path d={`M10 ${y - 4} C 90 ${y - 10}, 170 ${y + 2}, 330 ${y - 6}`} stroke="#9C6538" strokeOpacity=".22" fill="none" />
          <path d={`M6 ${y + 8} C 120 ${y + 2}, 220 ${y + 14}, 332 ${y + 6}`} stroke="#9C6538" strokeOpacity=".16" fill="none" />
        </g>
      ))}
      {/* corner battens */}
      {[0, 302].map((x) => (
        <g key={x}>
          <rect x={x} y="36" width="34" height="190" fill={`url(#${g('batten')})`} />
          <rect x={x} y="36" width="34" height="190" fill="none" stroke="#7A4A26" strokeOpacity=".35" />
          {[52, 132, 206].map((y) => <circle key={y} cx={x + 17} cy={y} r="2.6" fill="#5B5550" />)}
        </g>
      ))}
      {/* stencil, painted slightly unevenly */}
      {label && (
        <text x="168" y="128" textAnchor="middle" fontFamily="Sora, sans-serif" fontWeight="800" fontSize="30" letterSpacing="6" fill="#A8361A" opacity=".82">
          {label}
        </text>
      )}
      {sub && (
        <text x="168" y="166" textAnchor="middle" fontFamily="Geist Mono, monospace" fontWeight="600" fontSize="15" letterSpacing="3" fill="#5E3B1C" opacity=".75">
          {sub}
        </text>
      )}
      {/* edges */}
      <path d="M0 36 H336 L380 6" stroke="#FFF1DC" strokeOpacity=".55" strokeWidth="1.5" fill="none" />
      <rect x="0" y="36" width="336" height="190" fill="none" stroke="#6E4224" strokeOpacity=".5" />
    </svg>
  );
};

/** A 20ft container seen from the front-left: door end in perspective and the corrugated long side. */
export const ShippingContainer = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 560 300" className={className} aria-hidden="true">
    <defs>
      <pattern id="ct-ribs" width="22" height="10" patternUnits="userSpaceOnUse">
        <rect width="22" height="10" fill="#14606A" />
        <rect x="0" width="7" height="10" fill="#1B727D" />
        <rect x="7" width="3" height="10" fill="#0E4D55" />
        <rect x="15" width="5" height="10" fill="#0C4249" />
      </pattern>
      <linearGradient id="ct-light" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity=".16" />
        <stop offset=".35" stopColor="#fff" stopOpacity="0" />
        <stop offset="1" stopColor="#000" stopOpacity=".32" />
      </linearGradient>
      <linearGradient id="ct-end" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#0B3F45" />
        <stop offset="1" stopColor="#0F4F57" />
      </linearGradient>
    </defs>
    {/* door end (receding) */}
    <path d="M0 26 L86 8 L86 286 L0 296 Z" fill="url(#ct-end)" />
    {[18, 44, 66].map((x) => <path key={x} d={`M${x} ${24 - x * 0.2} L${x} ${294 - x * 0.1}`} stroke="#082F33" strokeWidth="3" />)}
    {[30, 56].map((x) => <rect key={x} x={x - 2} y="110" width="5" height="90" rx="2" fill="#B9CBC9" opacity=".6" />)}
    {/* long side */}
    <rect x="86" y="8" width="474" height="278" fill="url(#ct-ribs)" />
    <rect x="86" y="8" width="474" height="278" fill="url(#ct-light)" />
    {/* rails and corner castings */}
    <rect x="86" y="8" width="474" height="12" fill="#0F5A63" />
    <rect x="86" y="274" width="474" height="12" fill="#0A3B41" />
    {[[86, 8], [546, 8], [86, 272], [546, 272]].map(([x, y]) => <rect key={`${x}-${y}`} x={x} y={y} width="14" height="14" rx="2" fill="#0A3439" />)}
    <path d="M86 8 V286" stroke="#5FA3A8" strokeOpacity=".5" strokeWidth="1.5" />
    {/* markings */}
    <rect x="120" y="40" width="168" height="54" rx="3" fill="#0A3B41" opacity=".85" />
    <text x="204" y="64" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="17" fontWeight="600" letterSpacing="3" fill="#F4EEE6">STRT 040412</text>
    <text x="204" y="84" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="11" letterSpacing="2" fill="#A9C9C8">22G1 · 30,480 KG</text>
    <text x="150" y="250" fontFamily="Sora, sans-serif" fontSize="34" fontWeight="800" letterSpacing="4" fill="#F4EEE6" opacity=".14">STRAITLINE</text>
  </svg>
);

/** Potted plant with layered, veined leaves (the sway animation is applied to the leaf group). */
export const Plant = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 200 320" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="pl-leaf-a" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#4FA27A" />
        <stop offset="1" stopColor="#24614A" />
      </linearGradient>
      <linearGradient id="pl-leaf-b" x1="1" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#3B8C66" />
        <stop offset="1" stopColor="#1D4F3C" />
      </linearGradient>
      <linearGradient id="pl-pot" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#E08A55" />
        <stop offset=".45" stopColor="#CB6A35" />
        <stop offset="1" stopColor="#A44E24" />
      </linearGradient>
    </defs>
    <g className="palm-sway" style={{ transformOrigin: '100px 212px' }}>
      {[
        { d: 'M100 210 C 92 150, 60 96, 8 92 C 46 118, 70 160, 96 214 Z', f: 'a' },
        { d: 'M102 210 C 112 140, 150 90, 196 88 C 158 116, 130 160, 104 214 Z', f: 'b' },
        { d: 'M100 208 C 88 130, 96 60, 122 10 C 124 70, 116 140, 104 210 Z', f: 'a' },
        { d: 'M100 210 C 76 168, 40 150, 4 160 C 44 170, 70 188, 96 214 Z', f: 'b' },
        { d: 'M104 210 C 128 170, 164 156, 198 166 C 160 172, 132 190, 106 214 Z', f: 'a' },
      ].map((l, i) => (
        <g key={i}>
          <path d={l.d} fill={`url(#pl-leaf-${l.f})`} />
          <path d={l.d} fill="none" stroke="#0F3326" strokeOpacity=".25" />
        </g>
      ))}
      {['M100 210 C 80 150, 50 110, 14 96', 'M102 210 C 118 150, 150 104, 190 92', 'M101 208 C 96 140, 104 70, 120 16'].map((d) => (
        <path key={d} d={d} stroke="#C8E6D2" strokeOpacity=".35" strokeWidth="1.5" fill="none" />
      ))}
    </g>
    {/* pot */}
    <path d="M44 214 H156 L142 314 H58 Z" fill="url(#pl-pot)" />
    <rect x="36" y="204" width="128" height="20" rx="5" fill="#D9804A" />
    <rect x="36" y="204" width="128" height="5" rx="2.5" fill="#F2A877" opacity=".8" />
    <path d="M58 314 H142" stroke="#7A3615" strokeOpacity=".4" strokeWidth="3" />
  </svg>
);
