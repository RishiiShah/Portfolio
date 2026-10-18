/*
 * The Experience ship as a small 3D mesh in the iso kernel's units: nose along +x,
 * wings along ±y, up +z. Each frame it is yawed to its heading and banked into
 * the turn, back faces are culled against the iso view direction (1, 1, 1), and
 * the rest are painted far to near, shaded by which way they face.
 */

type P3 = [number, number, number];
interface Face {
  pts: P3[];
  /** Outward normal in model space. */
  n: P3;
  /** "hull" faces are shaded by direction; the others keep a fixed look. */
  kind: "hull" | "glass" | "light" | "flame" | "burn";
}

const C = Math.cos(Math.PI / 6);
const S = Math.sin(Math.PI / 6);
const project = ([x, y, z]: P3) => [(x - y) * C, (x + y) * S - z];

const sub = (a: P3, b: P3): P3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a: P3, b: P3): P3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a: P3, b: P3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const mean = (pts: P3[]): P3 => {
  const m: P3 = [0, 0, 0];
  pts.forEach((p) => p.forEach((v, k) => (m[k] += v / pts.length)));
  return m;
};

/** Faces of a convex solid, each normal turned to point away from the solid's centre. */
function solid(polys: P3[][], kind: Face["kind"] = "hull"): Face[] {
  const centre = mean(polys.flat());
  return polys.map((pts) => {
    let n = cross(sub(pts[1], pts[0]), sub(pts[2], pts[0]));
    const len = Math.hypot(...n) || 1;
    n = [n[0] / len, n[1] / len, n[2] / len];
    if (dot(n, sub(mean(pts), centre)) < 0) n = [-n[0], -n[1], -n[2]];
    return { pts, n, kind };
  });
}

/** A solid lofted through cross-sections (each a ring of [y, z] at one x), with end caps. */
function loft(sections: { x: number; ring: [number, number][] }[], kind: Face["kind"] = "hull") {
  const rings = sections.map(({ x, ring }) => ring.map(([y, z]): P3 => [x, y, z]));
  const polys: P3[][] = [rings[0], rings[rings.length - 1]];
  for (let s = 0; s < rings.length - 1; s++) {
    const a = rings[s];
    const b = rings[s + 1];
    for (let k = 0; k < a.length; k++) {
      const k1 = (k + 1) % a.length;
      polys.push([a[k], a[k1], b[k1], b[k]]);
    }
  }
  return solid(polys, kind);
}

/** A flat outline in the xy plane given thickness along z (wings). */
function slabXY(outline: [number, number][], z: number, t: number, kind: Face["kind"] = "hull") {
  return loftZ(outline.map(([x, y]): P3 => [x, y, z - t / 2]), t, kind);
}
/** A flat outline in the xz plane given thickness along y (fins). */
function slabXZ(outline: [number, number][], y: number, t: number, kind: Face["kind"] = "hull") {
  const lo = outline.map(([x, z]): P3 => [x, y - t / 2, z]);
  const hi = outline.map(([x, z]): P3 => [x, y + t / 2, z]);
  return solid([lo, hi, ...lo.map((p, k) => [p, lo[(k + 1) % lo.length], hi[(k + 1) % hi.length], hi[k]])], kind);
}
function loftZ(lo: P3[], t: number, kind: Face["kind"]) {
  const hi = lo.map(([x, y, z]): P3 => [x, y, z + t]);
  return solid([lo, hi, ...lo.map((p, k) => [p, lo[(k + 1) % lo.length], hi[(k + 1) % hi.length], hi[k]])], kind);
}
const box = (x: number, y: number, z: number, w: number, d: number, h: number, kind: Face["kind"] = "hull") =>
  loft(
    [x, x + w].map((xx) => ({ x: xx, ring: [[y, z], [y + d, z], [y + d, z + h], [y, z + h]] as [number, number][] })),
    kind
  );

// Fuselage cross-section: a flattened hexagon, wider than it is tall.
const hex = (w: number, h: number): [number, number][] => [
  [-w, 0],
  [-w * 0.62, h],
  [w * 0.62, h],
  [w, 0],
  [w * 0.62, -h * 0.75],
  [-w * 0.62, -h * 0.75],
];

const FACES: Face[] = [
  // Fuselage, tail to nose: four tapered segments (each convex) so normals stay true.
  ...loft([{ x: -36, ring: hex(6, 5) }, { x: -14, ring: hex(8.5, 7) }]),
  ...loft([{ x: -14, ring: hex(8.5, 7) }, { x: 10, ring: hex(8, 6.5) }]),
  ...loft([{ x: 10, ring: hex(8, 6.5) }, { x: 26, ring: hex(5, 4) }]),
  ...loft([{ x: 26, ring: hex(5, 4) }, { x: 40, ring: hex(0.6, 0.6) }]),
  // Canopy: a low glass wedge on the forward deck.
  ...loft([{ x: -2, ring: [[-4, 6.4], [4, 6.4], [3, 10], [-3, 10]] }, { x: 18, ring: [[-3, 5.2], [3, 5.2], [0.5, 6.4], [-0.5, 6.4]] }], "glass"),
  // Swept wings with real thickness.
  ...slabXY([[6, 8], [-18, 34], [-27, 34], [-24, 8]], -1, 2.4),
  ...slabXY([[6, -8], [-24, -8], [-27, -34], [-18, -34]], -1, 2.4),
  // Tail fin.
  ...slabXZ([[-36, 4], [-20, 4], [-30, 18], [-37, 18]], 0, 2),
  // Engine block and its glowing nozzle.
  ...box(-42, -5.5, -3.5, 6, 11, 8),
  ...box(-43, -4, -2.2, 1.2, 8, 5.4, "light"),
  // Wingtip nav lights, seated on the tips rather than floating beside them.
  ...box(-26, 32.5, -1.6, 6, 3, 3.2, "light"),
  ...box(-26, -35.5, -1.6, 6, 3, 3.2, "light"),
  // Exhaust: a short idle cone and a long burn cone (shown only while flying).
  ...loft([{ x: -43, ring: hex(3.6, 3).map(([y, z]) => [y, z + 0.5]) as [number, number][] }, { x: -56, ring: hex(0.4, 0.4) }], "flame"),
  ...loft([{ x: -43, ring: hex(3.6, 3).map(([y, z]) => [y, z + 0.5]) as [number, number][] }, { x: -88, ring: hex(0.4, 0.4) }], "burn"),
];

const VIEW: P3 = [1 / Math.sqrt(3), 1 / Math.sqrt(3), 1 / Math.sqrt(3)];

/** SVG markup for the ship at a heading (yaw, radians about +z) and bank (roll about its own nose axis). */
export function shipMarkup(yaw: number, bank = 0): string {
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const cb = Math.cos(bank);
  const sb = Math.sin(bank);
  const turn = ([x, y, z]: P3): P3 => {
    // Bank about x, then yaw about z.
    const y1 = y * cb - z * sb;
    const z1 = y * sb + z * cb;
    return [x * cy - y1 * sy, x * sy + y1 * cy, z1];
  };
  const out: { depth: number; d: string; cls: string }[] = [];
  for (const f of FACES) {
    const n = turn(f.n);
    // Exhaust cones are translucent light, drawn whichever way they face.
    if (f.kind !== "flame" && f.kind !== "burn" && dot(n, VIEW) <= 0.02) continue;
    const pts = f.pts.map(turn);
    const d = "M" + pts.map((p) => project(p).map((v) => v.toFixed(1)).join(" ")).join("L") + "Z";
    let cls = "space-ship-flame";
    if (f.kind === "burn") cls = "space-ship-flame space-ship-burn";
    else if (f.kind === "glass") cls = "space-ship-glass";
    else if (f.kind === "light") cls = "space-ship-light";
    else if (f.kind === "hull") cls = n[2] > 0.55 ? "space-ship-hull is-top" : n[0] - n[1] > 0 ? "space-ship-hull is-side" : "space-ship-hull";
    out.push({ depth: dot(mean(pts), VIEW), d, cls });
  }
  out.sort((a, b) => a.depth - b.depth);
  return out.map((f) => `<path class="${f.cls}" d="${f.d}"/>`).join("");
}

/** Ground-plane heading for a direction given as a screen angle in degrees. */
export function headingFromScreen(angleDeg: number) {
  const a = (angleDeg * Math.PI) / 180;
  const sx = Math.cos(a);
  const sy = Math.sin(a);
  return Math.atan2((sy / S - sx / C) / 2, (sx / C + sy / S) / 2);
}
