/*
 * Isometric kernel for the iso-glow figures (after iso-figure by Tolga Cohce, MIT).
 * +x runs down-right, +y down-left, +z up. Draw ordinary SVG inside a TOP/FRONT/SIDE
 * transform and it lands on that plane; paint order (back to front) is the depth sort.
 */

const C = Math.cos(Math.PI / 6);
const S = Math.sin(Math.PI / 6);

/** Screen offset of a 3D vector, without the frame origin. */
const D = (x: number, y: number, z: number) => [(x - y) * C, (x + y) * S - z];

interface BoxProps {
  x: number;
  y: number;
  z: number;
  w: number;
  d: number;
  h: number;
  className?: string;
}

/** Frames the given extreme 3D corners into a padded viewBox and returns drawing helpers. */
export function isoFrame(corners: number[][], pad = 16) {
  const flat = corners.map(([x, y, z]) => D(x, y, z));
  const minX = Math.min(...flat.map((p) => p[0])) - pad;
  const minY = Math.min(...flat.map((p) => p[1])) - pad;
  const width = Math.max(...flat.map((p) => p[0])) + pad - minX;
  const height = Math.max(...flat.map((p) => p[1])) + pad - minY;

  const P = (x: number, y: number, z: number) => {
    const [a, b] = D(x, y, z);
    return [a - minX, b - minY];
  };
  const plane = (o: number[], u: number[], v: number[]) => {
    const [ox, oy] = P(o[0], o[1], o[2]);
    const [ux, uy] = D(u[0], u[1], u[2]);
    const [vx, vy] = D(v[0], v[1], v[2]);
    return `matrix(${ux} ${uy} ${vx} ${vy} ${ox} ${oy})`;
  };
  const TOP = (x: number, y: number, z: number) => plane([x, y, z], [1, 0, 0], [0, 1, 0]);
  const FRONT = (x: number, y: number, z: number) => plane([x, y, z], [1, 0, 0], [0, 0, -1]); // the y = max face
  const SIDE = (x: number, y: number, z: number) => plane([x, y, z], [0, -1, 0], [0, 0, -1]); // the x = max face
  const path = (pts: number[][]) => "M" + pts.map((p) => P(p[0], p[1], p[2]).map((n) => n.toFixed(2)).join(" ")).join("L");

  /** A box drawn as its three visible faces. */
  function Box({ x, y, z, w, d, h, className = "" }: BoxProps) {
    return (
      <>
        <rect className={`iso-face ${className}`} transform={SIDE(x + w, y + d, z + h)} width={d} height={h} />
        <rect className={`iso-face ${className}`} transform={FRONT(x, y + d, z + h)} width={w} height={h} />
        <rect className={`iso-face iso-top ${className}`} transform={TOP(x, y, z + h)} width={w} height={d} />
      </>
    );
  }

  /** A box rounded in plan: one continuous side wall plus a rounded top, so corners line up. */
  function RoundBox({ x, y, z, w, d, h, r: radius, className = "" }: BoxProps & { r: number }) {
    const r = Math.min(radius, w / 2, d / 2);
    const n = 10;
    const z1 = z + h;
    const q = Math.PI / 4;
    const half = Math.PI / 2;
    const arc = (cx: number, cy: number, a0: number, a1: number) =>
      Array.from({ length: n + 1 }, (_, i) => {
        const a = a0 + ((a1 - a0) * i) / n;
        return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
      });
    const ring = [
      ...arc(x + w - r, y + r, -half, 0),
      ...arc(x + w - r, y + d - r, 0, half),
      ...arc(x + r, y + d - r, half, 2 * half),
      ...arc(x + r, y + r, 2 * half, 3 * half),
    ];
    const visible = [...arc(x + w - r, y + r, -q, 0), ...arc(x + w - r, y + d - r, 0, half), ...arc(x + r, y + d - r, half, 3 * q)];
    const wall = [...visible.map(([a, b]) => [a, b, z]), ...visible.slice().reverse().map(([a, b]) => [a, b, z1])];
    return (
      <>
        <path className={`iso-face ${className}`} d={path(wall) + "Z"} />
        <path className={`iso-face iso-top ${className}`} d={path(ring.map(([a, b]) => [a, b, z1])) + "Z"} />
      </>
    );
  }

  // Filter region sized to the drawing (plus room for the blur). A huge region makes
  // Safari render the filter at reduced resolution, which blurs whatever it wraps.
  const M = 60;
  const filterRegion = { filterUnits: "userSpaceOnUse" as const, x: -M, y: -M, width: width + 2 * M, height: height + 2 * M };

  return { P, TOP, FRONT, SIDE, path, Box, RoundBox, filterRegion, viewBox: `0 0 ${width.toFixed(1)} ${height.toFixed(1)}` };
}
