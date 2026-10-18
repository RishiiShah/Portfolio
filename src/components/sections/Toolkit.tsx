"use client";

import { useEffect, useRef, useState } from "react";
import { skills } from "@/data";
import { Section } from "../Section";
import { Stagger } from "../anim";

/*
 * Toolkit as an exploded isometric stack (iso-glow style): one slab per skill
 * category, one LED on its front edge per tool. Selecting a layer, from the
 * figure or the list, pulls that slab out and lights it; a signal pulse runs
 * down the riser into it.
 */

// Isometric kernel (from iso-figure / iso-glow): +x down-right, +y down-left, +z up.
const C = Math.cos(Math.PI / 6);
const S = Math.sin(Math.PI / 6);
const D = (x: number, y: number, z: number) => [(x - y) * C, (x + y) * S - z];

const W = 220; // slab width (x)
const DEPTH = 150; // slab depth (y)
const H = 22; // slab thickness
const GAP = 26; // vertical gap between slabs
const BASE = 14; // base plate height
const RISER = W + 40; // the vertical bus stands just right of the stack…
const BUS_Y = 24; // …near the back corner, so it never crosses a slab
const PULL = 18; // how far the active slab slides out (+y)
// Category 01 is the top slab, matching the list read top to bottom.
const slabZ = (i: number) => BASE + 16 + (skills.length - 1 - i) * (H + GAP);
const TOP_Z = slabZ(0) + H;

// Frame the extreme corners into a padded viewBox.
const corners = [
  [-30, -30, 0],
  [W + 60, -20, 0],
  [-30, DEPTH + PULL + 30, 0],
  [W + 60, DEPTH + 20, 0],
  [0, 0, TOP_Z + 20],
  [RISER, BUS_Y, TOP_Z + 20],
].map(([x, y, z]) => D(x, y, z));
const pad = 16;
const minX = Math.min(...corners.map((p) => p[0])) - pad;
const minY = Math.min(...corners.map((p) => p[1])) - pad;
const VB_W = Math.max(...corners.map((p) => p[0])) + pad - minX;
const VB_H = Math.max(...corners.map((p) => p[1])) + pad - minY;
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
const FRONT = (x: number, y: number, z: number) => plane([x, y, z], [1, 0, 0], [0, 0, -1]);
const SIDE = (x: number, y: number, z: number) => plane([x, y, z], [0, -1, 0], [0, 0, -1]);
const path = (pts: number[][]) => "M" + pts.map((p) => P(p[0], p[1], p[2]).map((n) => n.toFixed(2)).join(" ")).join("L");

function Box({ x, y, z, w, d, h }: { x: number; y: number; z: number; w: number; d: number; h: number }) {
  return (
    <>
      <rect className="iso-face" transform={SIDE(x + w, y + d, z + h)} width={d} height={h} />
      <rect className="iso-face" transform={FRONT(x, y + d, z + h)} width={w} height={h} />
      <rect className="iso-face iso-top" transform={TOP(x, y, z + h)} width={w} height={d} />
    </>
  );
}

const short = (c: string) => c.replace(" & ", " + ").replace("Frameworks + Tools", "Frameworks");

export function Skills() {
  const [active, setActive] = useState(0);
  const [pulse, setPulse] = useState(0);
  const touched = useRef(false);
  const total = skills.reduce((n, g) => n + g.items.length, 0);

  // Re-fire the pulse on every selection, and cycle layers until the visitor picks one.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      if (touched.current) setPulse((n) => n + 1);
      else setActive((a) => (a + 1) % skills.length);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  const select = (i: number) => {
    touched.current = true;
    setActive(i);
    setPulse((n) => n + 1);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp" || e.key === "ArrowRight") select((active + 1) % skills.length);
    else if (e.key === "ArrowDown" || e.key === "ArrowLeft") select((active - 1 + skills.length) % skills.length);
    else return;
    e.preventDefault();
  };

  const group = skills[active];
  const stubZ = slabZ(active) + H / 2;
  const signal = [
    [RISER, BUS_Y, TOP_Z + 16],
    [RISER, BUS_Y, stubZ],
    [W, BUS_Y, stubZ],
  ];

  return (
    <Section id="skills" index="04" title="Toolkit" meta={`${total} tools · ${skills.length} layers`} shape={4}>
      <div className="grid gap-[6vh] md:grid-cols-12 md:gap-[4vw]">
        <figure className="md:col-span-5 md:self-start md:sticky md:top-[14vh]">
          <svg
            viewBox={`0 0 ${VB_W.toFixed(1)} ${VB_H.toFixed(1)}`}
            role="img"
            aria-label={`Isometric stack of ${skills.length} toolkit layers. Click a layer or use the arrow keys to light it.`}
            tabIndex={0}
            onKeyDown={onKey}
            className="iso w-full max-w-[560px] outline-none focus-visible:ring-1 focus-visible:ring-accent"
          >
            <defs>
              <filter id="iso-glow" filterUnits="userSpaceOnUse" x="-2000" y="-2000" width="6000" height="6000">
                <feGaussianBlur stdDeviation="3" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Base plate with screws */}
            <Box x={-20} y={-20} z={0} w={W + 80} d={DEPTH + 40} h={BASE} />
            <g transform={TOP(-20, -20, BASE)}>
              <rect className="iso-detail" x={8} y={8} width={W + 64} height={DEPTH + 24} rx={6} />
              {[[14, 14], [W + 66, 14], [14, DEPTH + 26], [W + 66, DEPTH + 26]].map(([cx, cy]) => (
                <circle key={`${cx}-${cy}`} className="iso-detail" cx={cx} cy={cy} r={3} />
              ))}
            </g>
            <g transform={FRONT(-20, DEPTH + 20, BASE)}>
              <text className="iso-print" x={10} y={9.5} fontSize={6.5}>
                RS-STACK · {total} TOOLS
              </text>
            </g>

            {/* Layers, painted bottom to top so upper slabs cover lower ones */}
            {[...skills.entries()].reverse().map(([i, g]) => {
              const z = slabZ(i);
              const on = i === active;
              const [dx, dy] = D(0, on ? PULL : 0, 0);
              const step = Math.min(11, (W - 40) / g.items.length);
              return (
                <g
                  key={g.category}
                  className={`iso-slab ${on ? "is-on" : ""}`}
                  style={{ transform: `translate(${dx}px, ${dy}px)` }}
                  onClick={() => select(i)}
                >
                  <title>{g.category}</title>
                  <Box x={0} y={0} z={z} w={W} d={DEPTH} h={H} />
                  {/* Front edge: one LED per tool */}
                  <g transform={FRONT(0, DEPTH, z + H)}>
                    <text className="iso-print" x={10} y={H / 2 + 3} fontSize={8}>
                      {String(i + 1).padStart(2, "0")}
                    </text>
                    {g.items.map((item, k) => (
                      <rect key={item} className="iso-led" x={32 + k * step} y={H / 2 - 2.5} width={6} height={5} rx={1} />
                    ))}
                  </g>
                  {/* Side: the category name */}
                  <g transform={SIDE(W, DEPTH, z + H)}>
                    <text className="iso-print iso-name" x={10} y={H / 2 + 3} fontSize={8.5}>
                      {short(g.category).toUpperCase()}
                    </text>
                  </g>
                  {/* Top: a vent grille as texture */}
                  <g transform={TOP(0, 0, z + H)}>
                    <rect className="iso-detail" x={10} y={10} width={W - 20} height={DEPTH - 20} rx={4} />
                    {Array.from({ length: 9 }, (_, k) => (
                      <line key={k} className="iso-detail" x1={W - 70 + k * 6} y1={22} x2={W - 70 + k * 6} y2={DEPTH - 22} />
                    ))}
                  </g>
                </g>
              );
            })}

            {/* Bus riser and the stubs into each layer, drawn last: they sit in front of the side faces */}
            <path className="iso-wire" d={path([[RISER, BUS_Y, BASE], [RISER, BUS_Y, TOP_Z + 16]])} />
            {skills.map((g, i) => (
              <path
                key={g.category}
                className={`iso-wire ${i === active ? "is-hot" : ""}`}
                d={path([[W, BUS_Y, slabZ(i) + H / 2], [RISER, BUS_Y, slabZ(i) + H / 2]])}
              />
            ))}
            <path className="iso-wire is-hot" d={path(signal.slice(0, 2))} />
            <path key={pulse} className="iso-pulse" pathLength={1000} d={path(signal)} />
            <circle className="iso-led is-on-dot" {...pt(RISER, BUS_Y, TOP_Z + 16)} r={3} />
          </svg>

          <figcaption className="label mt-4 text-ink-3">
            <span>
              <span className="text-accent">Fig. 04</span> — {String(active + 1).padStart(2, "0")} {group.category} ·{" "}
              {group.items.length} tools
            </span>
          </figcaption>
        </figure>

        <div className="md:col-span-7">
          {skills.map((g, i) => {
            const on = i === active;
            return (
              <div
                key={g.category}
                onPointerEnter={(e) => e.pointerType === "mouse" && select(i)}
                className="grid gap-4 border-t border-line py-[3.5vh] lg:grid-cols-[14vw_1fr]"
              >
                <button
                  type="button"
                  onClick={() => select(i)}
                  aria-pressed={on}
                  className="flex items-baseline gap-3 text-left"
                >
                  <span className={`label transition-colors ${on ? "text-accent" : "text-ink-3"}`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`wide text-[clamp(1.25rem,1.8vw,1.9rem)] font-bold tracking-tight transition-colors ${on ? "text-accent" : ""}`}
                  >
                    {g.category}
                  </span>
                </button>
                <Stagger as="ul" className="flex flex-wrap gap-2">
                  {g.items.map((item) => (
                    <li
                      key={item}
                      className={`border px-3 py-1.5 text-[15px] backdrop-blur-sm transition-colors ${
                        on ? "border-accent/60 bg-bg/80 text-ink" : "border-line bg-bg/60 text-ink-2"
                      }`}
                    >
                      {item}
                    </li>
                  ))}
                </Stagger>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

function pt(x: number, y: number, z: number) {
  const [cx, cy] = P(x, y, z);
  return { cx, cy };
}
