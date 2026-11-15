import { useMemo } from 'react';

/** Renders a bitmap (array of '0'/'1' strings) as a crisp pixel grid. */
export const PixelIcon = ({ map, cell = 5, color = 'currentColor', className }: { map: string[]; cell?: number; color?: string; className?: string }) => {
  const rows = map.length;
  const cols = map[0].length;
  const rects = useMemo(
    () =>
      map.flatMap((row, y) => [...row].map((c, x) => (c === '1' ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" /> : null))),
    [map],
  );
  return (
    <svg aria-hidden="true" viewBox={`0 0 ${cols} ${rows}`} width={cols * cell} height={rows * cell} shapeRendering="crispEdges" fill={color} className={className}>
      {rects}
    </svg>
  );
};

export const PIXEL = {
  handshake: [
    '000000000000',
    '011111111110',
    '100000000001',
    '100000000001',
    '101101101101',
    '101101101101',
    '100000000001',
    '011111111110',
    '000110000000',
    '000100000000',
    '001000000000',
    '000000000000',
  ],
  document: [
    '001111111000',
    '001000001100',
    '001000001110',
    '001011100010',
    '001000000010',
    '001011111010',
    '001000000010',
    '001011111010',
    '001000000010',
    '001011110010',
    '001000000010',
    '001111111110',
  ],
  stamp: [
    '000011110000',
    '000111111000',
    '000111111000',
    '000011110000',
    '000001100000',
    '000001100000',
    '011111111110',
    '111111111111',
    '111111111111',
    '000000000000',
    '011111111110',
    '000000000000',
  ],
  ship: [
    '000001000000',
    '000001100000',
    '000001110000',
    '000001111000',
    '000001000000',
    '000111111100',
    '000100000100',
    '111111111111',
    '011111111110',
    '001111111100',
    '000000000000',
    '110110110110',
  ],
};
