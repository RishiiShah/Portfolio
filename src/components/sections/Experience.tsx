"use client";

import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { education, experience, publications } from "@/data";
import { toIsoDate } from "@/lib/dates";
import { D, isoFrame } from "@/lib/iso";
import { scrollToY } from "@/lib/motion";
import { RevealText } from "../anim";

gsap.registerPlugin(ScrollTrigger);

interface Stop {
  start: string;
  end: string;
  place: string;
  title: string;
  role: string;
  /** Shown beside the title on desktop; replaced by `summary` on small screens. */
  bullets: string[];
  summary: string;
  highlights: { value: string; label: string }[];
  tech?: string[];
  next?: boolean;
}

const [rutgers, mumbai] = education;
const jobs = [...experience].reverse();

const STOPS: Stop[] = [
  {
    start: mumbai.start,
    end: mumbai.end,
    place: mumbai.location,
    title: "University of Mumbai",
    role: mumbai.degree,
    bullets: [`Studied AI & Data Science, published ${publications.length} papers, and took two engineering internships along the way.`],
    summary: `AI & Data Science, ${publications.length} papers, two internships.`,
    highlights: [{ value: mumbai.gpa.split(" ")[0], label: "GPA, of 10" }],
  },
  ...jobs.map((j) => ({
    start: j.start,
    end: j.end,
    place: j.location ?? "",
    title: j.organization,
    role: j.role,
    bullets: j.bullets,
    summary: j.summary ?? "",
    highlights: j.highlights ?? [],
    tech: j.tech,
  })),
  {
    start: rutgers.start,
    end: rutgers.end,
    place: rutgers.location,
    title: "Rutgers University",
    role: rutgers.degree,
    bullets: ["Master's in Computer Science, and building developer tooling for coding agents on the side."],
    summary: "M.S. in Computer Science; building developer tooling for coding agents.",
    highlights: [{ value: rutgers.gpa.split(" ")[0], label: "GPA, of 4.0" }],
  },
  {
    start: rutgers.end,
    end: "",
    place: "",
    title: "Next stop",
    role: "Open to SWE, systems & AI/ML roles",
    bullets: ["Graduating in May 2027. Looking for full-time roles and internships where the work has to hold up in production."],
    summary: "Graduating May 2027. Full-time roles and internships.",
    highlights: [],
    next: true,
  },
];

const N = STOPS.length;

const SCROLL_PER_STOP = 1.2; // viewport heights of scrolling per stop

// ─── The system ──────────────────────────────────────────────────────────────
// One planet per stop, left to right. The ship parks below each planet and
// swoops between them on cubic curves.
const GAP = 760;
// Each world has its own surface: latitudes, meridians (which turn as the globe
// spins) and sites, the lights that switch on while the ship is docked.
const PLANETS = [
  { r: 82, ring: false, moons: 1, station: false, lats: [-0.66, -0.33, 0.33, 0.66], meridians: 4, sites: 14 }, // Mumbai: home world
  { r: 52, ring: true, moons: 0, station: false, lats: [-0.8, -0.6, -0.38, -0.16, 0.12, 0.36, 0.58, 0.8], meridians: 0, sites: 8 }, // Creative Line: banded giant
  { r: 104, ring: false, moons: 0, station: true, lats: [-0.5, 0.5], meridians: 6, sites: 22 }, // Aaditya Technologies
  { r: 78, ring: true, moons: 2, station: false, lats: [-0.66, -0.33, 0.33, 0.66], meridians: 3, sites: 14 }, // Rutgers
  { r: 64, ring: false, moons: 0, station: false, lats: [-0.5, 0.5], meridians: 3, sites: 0 }, // Next stop: uncharted
].slice(0, N);
const centers = PLANETS.map((p, i) => [i * GAP, i % 2 ? -50 : 40]);
const parks = PLANETS.map((p, i) => [centers[i][0], centers[i][1] + p.r + 110]);
const END_X = (N - 1) * GAP;
const WORLD = { x: -600, y: -420, w: END_X + 1200, h: 840 };
const WORLD_VIEW = `${WORLD.x} ${WORLD.y} ${WORLD.w} ${WORLD.h}`;
// While flying, every layer is drawn once at this size and the camera only moves
// layers with composited transforms, so scrolling never repaints the scene.
const CAM = { x: WORLD.x - 600, y: -1100, w: WORLD.w + 1200, h: 2600 };
const CAM_VIEW = `${CAM.x} ${CAM.y} ${CAM.w} ${CAM.h}`;

type V = [number, number];
const legs = parks.slice(1).map((q1, i): V[] => {
  const q0 = parks[i];
  const s = i % 2 ? -1 : 1;
  return [q0 as V, [q0[0] + 280, q0[1] + 150 * s], [q1[0] - 280, q1[1] + 150 * s], q1 as V];
});
const bez = ([a, b, c, d]: V[], t: number): V => {
  const u = 1 - t;
  const k = [u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t];
  return [k[0] * a[0] + k[1] * b[0] + k[2] * c[0] + k[3] * d[0], k[0] * a[1] + k[1] * b[1] + k[2] * c[1] + k[3] * d[1]];
};
// Arc-length tables, so the ship moves at an even pace and the lit trail matches it.
const SAMPLES = 80;
const tables = legs.map((leg) => {
  const pts = Array.from({ length: SAMPLES + 1 }, (_, i) => bez(leg, i / SAMPLES));
  const cum = [0];
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  return { pts, cum, total: cum[cum.length - 1] };
});
function along(leg: number, frac: number) {
  const { pts, cum, total } = tables[leg];
  const target = frac * total;
  let i = 1;
  while (i < SAMPLES && cum[i] < target) i++;
  const f = (target - cum[i - 1]) / (cum[i] - cum[i - 1] || 1);
  const x = pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * f;
  const y = pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * f;
  const angle = (Math.atan2(pts[i][1] - pts[i - 1][1], pts[i][0] - pts[i - 1][0]) * 180) / Math.PI;
  return { x, y, angle };
}
const legD = (leg: V[]) => `M${leg[0].join(" ")}C${leg[1].join(" ")} ${leg[2].join(" ")} ${leg[3].join(" ")}`;

// Three star layers; farther layers drift less as the camera pans (parallax).
function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = seeded(7);
const STAR_LAYERS = [
  { depth: 0.85, count: 700, r: 0.9 },
  { depth: 0.55, count: 380, r: 1.4 },
  { depth: 0.2, count: 140, r: 2 },
].map((layer) => {
  const stars = Array.from({ length: layer.count }, () => ({
    x: CAM.x + rand() * CAM.w,
    y: CAM.y + rand() * CAM.h,
    lit: rand() < 0.025,
    delay: rand() * 4,
  }));
  return {
    ...layer,
    // Plain stars as one path of round-capped dots; only the few twinkling ones are elements.
    dots: stars.filter((st) => !st.lit).map((st) => `M${st.x.toFixed(0)} ${st.y.toFixed(0)}h0`).join(""),
    lit: stars.filter((st) => st.lit),
  };
});

// ─── Iso-glow globes ─────────────────────────────────────────────────────────
// Planets are true isometric spheres: a sphere of radius s projects to a circle
// of radius s·√1.5, and its latitudes and meridians are traced in 3D so only the
// half facing the viewer (+x +y +z) is drawn. Rings and orbits lie on the TOP plane.
const ISO = Math.sqrt(1.5);
const { Box, TOP, path, P: P0 } = isoFrame([[0, 0, 0]], 0); // kernel at the origin, inside a translate()
type P3 = [number, number, number];
const TAU = Math.PI * 2;
const loop = (f: (t: number) => P3, from = 0, n = 96) => Array.from({ length: n + 1 }, (_, i) => f(from + (i / n) * TAU));
const half = (f: (t: number) => P3, front: boolean, n = 48) =>
  Array.from({ length: n + 1 }, (_, i) => f((front ? -0.25 : 0.75) * Math.PI + (i / n) * Math.PI));
const facing = ([x, y, z]: P3) => x + y + z > 0;
/** Screen path through 3D points, lifting the pen over the ones that fail `keep`. */
function trace(pts: P3[], keep: (p: P3) => boolean = () => true) {
  let d = "";
  let pen = false;
  for (const p of pts) {
    if (!keep(p)) {
      pen = false;
      continue;
    }
    const [a, b] = D(...p);
    d += `${pen ? "L" : "M"}${a.toFixed(1)} ${b.toFixed(1)}`;
    pen = true;
  }
  return d;
}
const flat = (rho: number, z = 0) => (t: number): P3 => [rho * Math.cos(t), rho * Math.sin(t), z];
/** Half of a flat annulus (inner..outer) on the TOP plane, as a filled outline. */
const band = (inner: number, outer: number, front: boolean) => {
  const o = trace(half(flat(outer), front));
  const i = trace(half(flat(inner), front).reverse());
  return `${o}L${i.slice(1)}Z`;
};

/** Orbit radii (in 3D units) around planet i: moons outside any ring, then a station. */
function orbitsOf(i: number) {
  const { r, ring, moons, station } = PLANETS[i];
  const s = r / ISO;
  return [
    ...Array.from({ length: moons }, (_, m) => ({ rho: s * ((ring ? 2.3 : 1.75) + m * 0.45), dur: 16 + m * 9, kind: "moon" as const, m })),
    ...(station ? [{ rho: s * 1.7, dur: 30, kind: "station" as const, m: 0 }] : []),
  ];
}
/** How far the planet and its orbits reach above its centre on screen, for placing the label. */
const reach = (i: number) => Math.max(PLANETS[i].r, ...orbitsOf(i).map((o) => o.rho * Math.SQRT1_2 + 8));

/** A meridian (great circle through the poles) at longitude phi, front half only. */
const meridianD = (s: number, phi: number) =>
  trace(loop((t) => [s * Math.sin(t) * Math.cos(phi), s * Math.sin(t) * Math.sin(phi), s * Math.cos(t)]), facing);
const SPIN = 0.22; // radians per second for the docked planet
const siteRand = seeded(21);
const SITES = PLANETS.map((p) =>
  Array.from({ length: p.sites }, () => ({ lon: siteRand() * TAU, k: (siteRand() * 2 - 1) * 0.78 }))
);
/** Screen position of a surface site at the given spin, or null while it's on the far side. */
function sitePos(s: number, site: { lon: number; k: number }, rot: number) {
  const rho = s * Math.sqrt(1 - site.k * site.k);
  const p: P3 = [rho * Math.cos(site.lon + rot), rho * Math.sin(site.lon + rot), s * site.k];
  return p[0] + p[1] + p[2] > s * 0.35 ? D(...p) : null;
}

function Moon({ path, dur, size, front }: { path: string; dur: number; size: number; front?: boolean }) {
  return (
    <g>
      <animateMotion dur={`${dur}s`} repeatCount="indefinite" path={path} />
      {front && <animate attributeName="opacity" values="1;0" keyTimes="0;0.5" calcMode="discrete" dur={`${dur}s`} repeatCount="indefinite" />}
      <circle className="space-body" r={size * ISO} />
      <path className="space-grid" d={trace(loop(flat(size)), facing)} />
    </g>
  );
}

function Station({ path, dur, front }: { path: string; dur: number; front?: boolean }) {
  return (
    <g>
      <animateMotion dur={`${dur}s`} repeatCount="indefinite" path={path} />
      {front && <animate attributeName="opacity" values="1;0" keyTimes="0;0.5" calcMode="discrete" dur={`${dur}s`} repeatCount="indefinite" />}
      {[-34, 12].map((x) => (
        <g key={x} transform={TOP(x, -5, 0)}>
          <rect className="iso-face iso-top" width={22} height={10} />
          {[5.5, 11, 16.5].map((u) => (
            <line key={u} className="iso-detail" x1={u} x2={u} y1={0} y2={10} />
          ))}
        </g>
      ))}
      <Box x={-8} y={-8} z={-6} w={16} d={16} h={12} />
      <circle className="space-light" cy={-6} r={2.2} />
    </g>
  );
}

/** An iso-glow planet: wireframe globe, optional flat ring, moons or a station on dashed orbits. */
function Planet({ i }: { i: number }) {
  const [cx, cy] = centers[i];
  const { r, ring } = PLANETS[i];
  const s = r / ISO;
  const uncharted = i === N - 1;
  const orbits = orbitsOf(i);
  // Orbits start at the left end of the ellipse, so the first half of each lap is the front half.
  const orbitPath = (rho: number) => trace(loop(flat(rho), -0.25 * Math.PI, 64)) + "Z";
  const { lats, meridians } = PLANETS[i];
  const sats = (front: boolean) =>
    orbits.map((o) =>
      o.kind === "moon" ? (
        <Moon key={`m${o.m}`} path={orbitPath(o.rho)} dur={o.dur} size={5 - o.m} front={front} />
      ) : (
        <Station key="st" path={orbitPath(o.rho)} dur={o.dur} front={front} />
      )
    );
  return (
    <g className="space-planet" data-i={i} transform={`translate(${cx} ${cy})`}>
      <circle className="space-halo" r={r * 1.6} fill="url(#space-halo-grad)" />
      {/* Behind the globe */}
      {ring && (
        <>
          <path className="space-annulus" d={band(s * 1.4, s * 1.95, false)} />
          <path className="space-grid" d={trace(half(flat(s * 1.62), false))} />
          <path className="space-grid" d={trace(half(flat(s * 1.78), false))} />
        </>
      )}
      {orbits.map((o) => (
        <path key={o.rho} className="space-orbit" d={trace(half(flat(o.rho), false))} />
      ))}
      {sats(false)}
      {/* Arrival: two shock rings on the orbital plane, played when the planet becomes active */}
      {[0, 1].map((k) => (
        <ellipse key={k} className="space-ripple" rx={s * 1.2 * ISO} ry={s * 1.2 * Math.SQRT1_2} style={{ animationDelay: `${k * 0.4}s` }} />
      ))}
      {/* Globe */}
      <circle className={uncharted ? "space-uncharted" : "space-body"} r={r} />
      {lats.map((k) => (
        <path key={k} className="space-grid" d={trace(loop(flat(s * Math.sqrt(1 - k * k), s * k)), facing)} />
      ))}
      {Array.from({ length: meridians }, (_, m) => (
        <path key={m} className="space-grid space-meridian" d={meridianD(s, (m * Math.PI) / meridians)} />
      ))}
      <path className="space-equator" d={trace(loop(flat(s)), facing)} />
      {SITES[i].map((site, k) => {
        const at = sitePos(s, site, 0);
        return <circle key={k} className="space-site" r={2.6} cx={at ? at[0].toFixed(1) : 0} cy={at ? at[1].toFixed(1) : 0} opacity={at ? 1 : 0} />;
      })}
      {uncharted && (
        <>
          <text className="space-mark" y={r * 0.22} textAnchor="middle" fontSize={r * 0.7}>
            ?
          </text>
          <line className="space-mast" y1={-s} y2={-s - 26} />
          <circle className="space-light space-beacon" cy={-s - 26} r={4} />
        </>
      )}
      {/* In front of the globe */}
      {ring && (
        <>
          <path className="space-annulus" d={band(s * 1.4, s * 1.95, true)} />
          <path className="space-grid" d={trace(half(flat(s * 1.62), true))} />
          <path className="space-grid" d={trace(half(flat(s * 1.78), true))} />
        </>
      )}
      {orbits.map((o) => (
        <path key={o.rho} className="space-orbit" d={trace(half(flat(o.rho), true))} />
      ))}
      {sats(true)}
      {/* Docking beam down to the parked ship, with a signal travelling up it */}
      <g className="space-dock">
        <path className="space-beam" d={`M-5 ${parks[i][1] - cy - 14} L-${r * 0.32} ${r * 0.96} L${r * 0.32} ${r * 0.96} L5 ${parks[i][1] - cy - 14}Z`} />
        <line className="space-link" y1={r + 4} y2={parks[i][1] - cy - 16} pathLength={1} />
      </g>
    </g>
  );
}

/** Wing on the z = 0 plane, on the far (−y) or near (+y) side of the hull. */
const wing = (side: number) => path([[-24, 8 * side, 0], [-4, 8 * side, 0], [-18, 28 * side, 0], [-30, 28 * side, 0]]) + "Z";
/** Crossed flat fins behind the engine, so the exhaust reads as a cone. */
const flame = (len: number) => path([[-40, -5, 0], [-40 - len, 0, 0], [-40, 5, 0]]) + path([[-40, 0, 5], [-40 - len, 0, 0], [-40, 0, -5]]);

/** The ship as an iso-glow model, nose along +x (down-right on screen), painted back to front. */
function Ship() {
  return (
    <g className="space-ship-bob">
      <path className="space-flame" d={flame(16)} />
      <path className="space-flame space-flame-burn" d={flame(44)} />
      <path className="iso-face iso-top" d={wing(-1)} />
      <Box x={-40} y={-6} z={-5} w={10} d={12} h={10} />
      <Box x={-30} y={-8} z={-6} w={44} d={16} h={12} />
      {/* Nose: a pyramid on the hull's front end; only its top and near faces show */}
      <path className="iso-face iso-top" d={path([[14, -8, 6], [14, 8, 6], [38, 0, 0]]) + "Z"} />
      <path className="iso-face" d={path([[14, 8, 6], [14, 8, -6], [38, 0, 0]]) + "Z"} />
      <g transform={TOP(-2, -5, 6)}>
        <rect className="iso-glass is-hot" width={14} height={10} rx={2} />
      </g>
      <g transform={TOP(-30, -8, 6)}>
        {[8, 14, 20].map((u) => (
          <line key={u} className="iso-detail" x1={u} x2={u} y1={2} y2={14} />
        ))}
      </g>
      <path className="iso-face iso-top" d={wing(1)} />
      <circle className="space-light" cx={P0(-26, 28, 0)[0]} cy={P0(-26, 28, 0)[1]} r={2.5} />
    </g>
  );
}

// ─── Dates ───────────────────────────────────────────────────────────────────
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthIndex = (d: string) => {
  const [y, m] = toIsoDate(d).split("-").map(Number);
  return y * 12 + (m ?? 1) - 1;
};
const fmtMonth = (m: number) => `${MONTHS[Math.round(m) % 12]} ${Math.floor(Math.round(m) / 12)}`;
const short = (d: string) => (d ? fmtMonth(monthIndex(d)) : "");
const stopMonths = STOPS.map((s) => monthIndex(s.start));

const smooth = (x: number) => {
  const t = Math.max(0, Math.min(1, x));
  return t * t * (3 - 2 * t);
};

/*
 * Experience as a voyage (iso-glow line style): one planet per stop, from the
 * home world in Mumbai through two internships to Rutgers, then an uncharted
 * planet for what's next. The stage pins; scrolling flies a ship along a
 * swooping trajectory, the camera follows with parallax stars, and the planet
 * it's orbiting lights up. Without JS or with reduced motion, the whole system
 * is shown above a plain list of stops.
 */
export function Experience() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const ship = useRef<SVGGElement>(null);
  const date = useRef<HTMLSpanElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: reduce)", () => svg.current?.pauseAnimations());
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(".space-card");
        const planets = gsap.utils.toArray<SVGGElement>(".space-planet, .space-label");
        const trails = gsap.utils.toArray<SVGPathElement>(".space-trail-lit, .space-trail-glow");
        const layers = gsap.utils.toArray<SVGSVGElement>(".space-sky");
        const scene = [...layers, svg.current].filter((el): el is SVGSVGElement => !!el);
        scene.forEach((el) => el.setAttribute("viewBox", CAM_VIEW));
        let scale = 0;
        const navItems = gsap.utils.toArray<HTMLElement>(".space-nav-item");
        let last = 0;
        let active = 0;

        // Spin the docked planet: its meridians and surface sites turn about the vertical axis.
        const globes = gsap.utils.toArray<SVGGElement>(".space-planet").map((g) => ({
          meridians: [...g.querySelectorAll<SVGPathElement>(".space-meridian")],
          sites: [...g.querySelectorAll<SVGCircleElement>(".space-site")],
        }));
        const rot = PLANETS.map(() => 0);
        let prev = performance.now();
        let raf = requestAnimationFrame(function spin(time) {
          raf = requestAnimationFrame(spin);
          const dt = Math.min(0.1, (time - prev) / 1000);
          prev = time;
          if (!trigger.current?.isActive) return;
          const i = active;
          const s = PLANETS[i].r / ISO;
          rot[i] += dt * SPIN;
          const { meridians, sites } = globes[i];
          meridians.forEach((el, m) => el.setAttribute("d", meridianD(s, rot[i] + (m * Math.PI) / meridians.length)));
          sites.forEach((el, k) => {
            const at = sitePos(s, SITES[i][k], rot[i]);
            el.setAttribute("opacity", at ? "1" : "0");
            if (at) {
              el.setAttribute("cx", at[0].toFixed(1));
              el.setAttribute("cy", at[1].toFixed(1));
            }
          });
        });

        const render = (progress: number) => {
          last = progress;
          // Dwell at each stop: hold for the first and last 15% of every leg.
          const t = progress * (N - 1);
          const leg = Math.min(N - 2, Math.floor(t));
          const eased = smooth((t - leg - 0.15) / 0.7);
          const p = leg + eased;
          const now = Math.round(p);
          active = now;

          const { x, y, angle } = along(leg, eased);
          // Parked, the ship sits in its iso pose (nose 30° down-right); in flight it turns to follow the curve.
          const tilt = (angle - 30) * Math.sin(Math.PI * eased);
          ship.current?.setAttribute("transform", `translate(${x} ${y}) rotate(${tilt}) scale(1.3)`);
          ship.current?.toggleAttribute("data-burn", eased > 0.02 && eased < 0.98);
          trails.forEach((path) => {
            const i = Number(path.dataset.leg);
            path.setAttribute("stroke-dasharray", `${i < leg ? 1 : i === leg ? eased : 0} 1`);
          });

          // Camera: follow the ship. Desktop keeps the planet right of the card; phones keep it above.
          const box = stage.current;
          if (box) {
            const narrow = box.clientWidth < 768;
            const k = box.clientWidth / (narrow ? 720 : 1500); // px per world unit
            if (k !== scale) {
              scale = k;
              scene.forEach((el) => {
                el.style.width = `${CAM.w * k}px`;
                el.style.height = `${CAM.h * k}px`;
              });
            }
            const x0 = x - (box.clientWidth / k) * (narrow ? 0.5 : 0.62);
            const y0 = y - (box.clientHeight / k) * (narrow ? 0.4 : 0.58);
            const move = (el: SVGSVGElement, dx: number) => {
              el.style.transform = `translate3d(${((CAM.x - x0 + dx) * k).toFixed(1)}px, ${((CAM.y - y0) * k).toFixed(1)}px, 0)`;
            };
            if (svg.current) move(svg.current, 0);
            // Parallax: farther star layers ride along with the camera by their depth.
            layers.forEach((el) => move(el, x0 * Number(el.dataset.depth)));
          }

          planets.forEach((g) => {
            const i = Number(g.dataset.i);
            g.toggleAttribute("data-active", now === i);
            g.toggleAttribute("data-docked", now === i && (eased < 0.03 || eased > 0.97));
            g.toggleAttribute("data-passed", p > i + 0.02);
          });
          cards.forEach((card, i) => {
            const v = Math.max(0, Math.min(1, (0.45 - Math.abs(p - i)) / 0.2));
            card.style.opacity = String(v);
            card.style.setProperty("--card-y", `${(p - i) * -80}px`);
            card.style.visibility = v < 0.01 ? "hidden" : "visible";
            card.style.pointerEvents = v > 0.6 ? "auto" : "none";
          });
          navItems.forEach((n, i) => n.toggleAttribute("data-active", i === now));
          if (date.current) date.current.textContent = fmtMonth(stopMonths[leg] + (stopMonths[leg + 1] - stopMonths[leg]) * eased);
          if (counter.current) counter.current.textContent = String(now + 1).padStart(2, "0");
        };

        trigger.current = ScrollTrigger.create({
          trigger: stage.current,
          pin: true,
          start: "top top",
          end: () => `+=${window.innerHeight * (N - 1) * SCROLL_PER_STOP}`,
          scrub: true,
          onUpdate: (self) => render(self.progress),
          onRefresh: (self) => render(self.progress),
        });
        render(0);
        const onResize = () => render(last);
        window.addEventListener("resize", onResize);
        return () => {
          cancelAnimationFrame(raf);
          window.removeEventListener("resize", onResize);
          scene.forEach((el) => {
            el.setAttribute("viewBox", WORLD_VIEW);
            el.style.removeProperty("width");
            el.style.removeProperty("height");
            el.style.removeProperty("transform");
          });
          trigger.current = null;
        };
      });
    },
    { scope: root }
  );

  const jumpTo = (i: number) => {
    const st = trigger.current;
    if (st) scrollToY(st.start + (i / (N - 1)) * (st.end - st.start));
  };

  return (
    <section ref={root} id="experience" data-shape="3" data-field="off" className="relative">
      <div className="px-[max(1rem,4vw)] pt-[16vh]">
        <div className="label flex items-center justify-between border-t border-line pt-4 text-ink-3">
          <span>
            <span className="text-accent">(03)</span> Experience
          </span>
          <span>{N} stops · Mumbai → New Brunswick → ?</span>
        </div>
        <RevealText as="h2" text="Experience" className="display mt-[4vh] block text-[11vw] md:text-[10vw]" />
      </div>

      <div ref={stage} className="space-stage">
        <div className="space-view">
          {STAR_LAYERS.map((layer) => (
            <svg key={layer.depth} viewBox={WORLD_VIEW} className="space-layer space-sky" data-depth={layer.depth} aria-hidden="true">
              <path className="space-dots" d={layer.dots} strokeWidth={layer.r * 2} />
              {layer.lit.map((st, k) => (
                <circle
                  key={k}
                  className="space-star"
                  cx={st.x.toFixed(0)}
                  cy={st.y.toFixed(0)}
                  r={layer.r * 1.2}
                  style={{ animationDelay: `${st.delay.toFixed(2)}s` }}
                />
              ))}
            </svg>
          ))}
          <svg ref={svg} viewBox={WORLD_VIEW} className="space-layer space-world iso" aria-hidden="true">
            <defs>
              {/* Glow without blur filters: huge filter regions tile and clip under a zoomed viewBox */}
              <radialGradient id="space-halo-grad">
                <stop offset="0.3" stopColor="var(--accent)" stopOpacity="0.45" />
                <stop offset="0.6" stopColor="var(--accent)" stopOpacity="0.15" />
                <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Trajectory: dashed course ahead, lit where the ship has flown */}
            {legs.map((leg, i) => (
              <g key={i}>
                <path className="space-trail" d={legD(leg)} />
                <path className="space-trail-glow" data-leg={i} d={legD(leg)} pathLength={1} strokeDasharray="1 1" />
                <path className="space-trail-lit" data-leg={i} d={legD(leg)} pathLength={1} strokeDasharray="1 1" />
              </g>
            ))}

            {STOPS.map((s, i) => (
              <Planet key={s.title} i={i} />
            ))}

            {STOPS.map((s, i) => (
              <g key={s.title} className="space-label" data-i={i}>
                <text x={centers[i][0]} y={centers[i][1] - reach(i) - 44} textAnchor="middle" className="space-name">
                  {String(i + 1).padStart(2, "0")} · {s.title.toUpperCase()}
                </text>
                <text x={centers[i][0]} y={centers[i][1] - reach(i) - 24} textAnchor="middle" className="space-date">
                  {short(s.start)}
                </text>
              </g>
            ))}

            <g ref={ship} className="space-ship" transform={`translate(${parks[0][0]} ${parks[0][1]}) scale(1.3)`}>
              <Ship />
            </g>
          </svg>
        </div>

        <div className="space-hud label pointer-events-none absolute inset-x-[max(1rem,4vw)] top-[11vh] items-start justify-between text-ink-3 md:top-auto md:bottom-[5vh] md:items-end">
          <div>
            <p className="wide text-3xl font-bold text-ink md:text-4xl">
              <span ref={counter}>01</span>
              <span className="text-ink-3">/{String(N).padStart(2, "0")}</span>
            </p>
            <span ref={date} className="mt-1 block">
              {short(STOPS[0].start)}
            </span>
          </div>
          <ol className="pointer-events-auto hidden flex-col items-end gap-1.5 md:flex">
            {STOPS.map((s, i) => (
              <li key={s.title}>
                <button
                  type="button"
                  onClick={() => jumpTo(i)}
                  className="space-nav-item group flex items-center gap-2 transition-colors hover:text-ink data-[active]:text-accent"
                >
                  {s.title}
                  <span className="inline-block h-px w-4 bg-current transition-all group-data-[active]:w-8" />
                </button>
              </li>
            ))}
          </ol>
        </div>

        {STOPS.map((s, i) => (
          <Card key={s.title} stop={s} index={i} />
        ))}
      </div>
    </section>
  );
}

function Card({ stop: s, index }: { stop: Stop; index: number }) {
  return (
    <article className="space-card border border-line bg-bg/90 p-[clamp(1.25rem,2vw,2rem)]">
      <p className="label text-ink-3">
        <span className="text-accent">Stop {String(index + 1).padStart(2, "0")}</span> ·{" "}
        {s.next ? `from ${short(s.start)}` : `${short(s.start)} — ${short(s.end)}`}
        {s.place && ` · ${s.place}`}
      </p>
      <h3 className="wide mt-4 text-[clamp(1.5rem,2.4vw,2.6rem)] leading-[1] font-bold tracking-tight">{s.title}</h3>
      <p className="mt-2 text-accent">{s.role}</p>
      {s.highlights.length > 0 && (
        <dl className="mt-5 flex gap-x-10 border-t border-line pt-4">
          {s.highlights.map((h) => (
            <div key={h.label} className="flex flex-col-reverse justify-end">
              <dt className="label mt-2 text-ink-3">{h.label}</dt>
              <dd className="wide text-[clamp(1.3rem,2vw,2.1rem)] leading-none font-bold tracking-tight">{h.value}</dd>
            </div>
          ))}
        </dl>
      )}
      <p className="mt-4 text-[15px] leading-relaxed text-ink-2 md:hidden">{s.summary}</p>
      <ul className="mt-5 hidden space-y-2 text-[14px] leading-relaxed text-ink-2 md:block">
        {s.bullets.map((b) => (
          <li key={b} className="relative pl-5 before:absolute before:top-[0.7em] before:left-0 before:h-px before:w-2.5 before:bg-accent">
            {b}
          </li>
        ))}
      </ul>
      {s.tech && <p className="label mt-4 text-ink-3">{s.tech.join(" · ")}</p>}
      {s.next && (
        <a href="#contact" className="group mt-5 inline-flex items-center gap-2 text-accent">
          Get in touch <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
        </a>
      )}
    </article>
  );
}
