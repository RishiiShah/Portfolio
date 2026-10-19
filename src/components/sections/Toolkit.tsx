"use client";

import { useEffect, useRef, useState } from "react";
import { skills } from "@/data";
import { D, isoFrame } from "@/lib/iso";
import { Section } from "../Section";

/*
 * Toolkit as an exploded isometric stack (iso-glow style): one slab per skill
 * category, one LED on its front edge per tool. Selecting a layer, from the
 * figure or the list, pulls that slab out and lights it; a signal pulse runs
 * down the riser into it.
 */

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

const { P, TOP, FRONT, SIDE, path, Box, viewBox, filterRegion } = isoFrame([
  [-30, -30, 0],
  [W + 60, -20, 0],
  [-30, DEPTH + PULL + 30, 0],
  [W + 60, DEPTH + 20, 0],
  [0, 0, TOP_Z + 20],
  [RISER, BUS_Y, TOP_Z + 20],
]);

const short = (c: string) => c.replace(" & ", " + ").replace("Frameworks + Tools", "Frameworks");

export function Skills() {
  const [active, setActive] = useState(0);
  const [pulse, setPulse] = useState(0);
  const [peak, setPeak] = useState(-1); // the tool hovered in the panel, lit on the slab
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
    setPeak(-1);
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
            viewBox={viewBox}
            role="img"
            aria-label={`Isometric stack of ${skills.length} toolkit layers. Click a layer or use the arrow keys to light it.`}
            tabIndex={0}
            onKeyDown={onKey}
            className="iso w-full max-w-[560px] outline-none focus-visible:ring-1 focus-visible:ring-accent"
          >
            <defs>
              <filter id="iso-glow" {...filterRegion}>
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
                      <rect
                        key={item}
                        className={`iso-led ${on && k === peak ? "is-peak" : ""}`}
                        x={32 + k * step}
                        y={H / 2 - 2.5}
                        width={6}
                        height={5}
                        rx={1}
                      />
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
              <span className="text-accent">Fig. 04</span> · {String(active + 1).padStart(2, "0")} {group.category} ·{" "}
              {group.items.length} tools
            </span>
          </figcaption>
        </figure>

        {/* Spec sheet: a tab per layer, and the active layer's tools as modules. Every
            layer stays in the markup (inactive ones hidden) so all tools are indexed. */}
        <div className="md:col-span-7 md:self-center">
          <div role="tablist" aria-label="Toolkit layers" className="flex flex-wrap gap-2">
            {skills.map((g, i) => {
              const on = i === active;
              return (
                <button
                  key={g.category}
                  type="button"
                  role="tab"
                  id={`tool-tab-${i}`}
                  aria-selected={on}
                  aria-controls={`tool-panel-${i}`}
                  onClick={() => select(i)}
                  className={`label flex items-center gap-2 border px-3 py-2 transition-colors ${
                    on ? "border-accent bg-accent text-accent-ink" : "border-line text-ink-2 hover:border-ink hover:text-ink"
                  }`}
                >
                  <span className={on ? "" : "text-accent"}>{String(i + 1).padStart(2, "0")}</span>
                  {short(g.category)}
                  <span className="opacity-60">{g.items.length}</span>
                </button>
              );
            })}
          </div>

          {/* All panels share one grid cell, so the block is always as tall as the
              longest layer and nothing shifts when switching. */}
          <div className="mt-8 grid">
            {skills.map((g, i) => (
              <div
                key={g.category}
                role="tabpanel"
                id={`tool-panel-${i}`}
                aria-labelledby={`tool-tab-${i}`}
                aria-hidden={i !== active}
                inert={i !== active}
                className={`[grid-area:1/1] border-t border-line pt-6 ${i === active ? "" : "invisible"}`}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="wide text-[clamp(1.6rem,2.6vw,2.8rem)] leading-none font-bold tracking-tight">{g.category}</h3>
                  <span className="label shrink-0 whitespace-nowrap text-ink-3">
                    Layer {String(i + 1).padStart(2, "0")} / {String(skills.length).padStart(2, "0")}
                  </span>
                </div>
                <ul key={i === active ? "on" : "off"} className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {g.items.map((item, k) => (
                    <li
                      key={item}
                      onPointerEnter={() => setPeak(k)}
                      onPointerLeave={() => setPeak(-1)}
                      style={{ animationDelay: `${k * 35}ms` }}
                      className="tool-module group flex items-center gap-3 border border-line px-3 py-3 transition-colors hover:border-accent"
                    >
                      <span className="tool-led size-1.5 shrink-0" />
                      <span className="min-w-0 truncate text-[15px] leading-tight text-ink">{item}</span>
                      <span className="label ml-auto text-ink-3 group-hover:text-accent">{String(k + 1).padStart(2, "0")}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

function pt(x: number, y: number, z: number) {
  const [cx, cy] = P(x, y, z);
  return { cx, cy };
}
