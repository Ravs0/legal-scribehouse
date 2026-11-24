/**
 * v6.0 seam between two full-bleed scenes: a vertical gradient from the exact colour at the bottom of the scene
 * above to the exact colour at the top of the scene below (colours sampled from the rendered page; see DESIGN.md).
 * `transparent` lets the page ground (which differs by theme) show through.
 */
export const SeamFade = ({ from, to, height = 120, via }: { from: string; to: string; height?: number; via?: string }) => (
  <div
    aria-hidden="true"
    className="seam-fade pointer-events-none relative"
    style={{ height, background: `linear-gradient(180deg, ${from}, ${via ? `${via}, ` : ''}${to})` }}
  />
);
