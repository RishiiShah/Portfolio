"use client";

import { useEffect, useRef, useState } from "react";
import { isoFrame } from "@/lib/iso";
import { Section } from "../Section";
import { ScrubText, Stagger } from "../anim";

/*
 * An iso-glow desk: a laptop that types (a short intro on its own, then whatever
 * the visitor types while it has focus) and a lamp that switches on and off.
 */

const SCRIPT = ["$ whoami", "rishabh shah · swe + ml", "$ cat now.txt", "coding-agent tooling"];
const MAX_LINES = 5;
const MAX_CHARS = 22;
const KEY_COLS = 12;
const KEY_ROWS = 5;

// Laptop base and screen as (x, y, z, w, d, h); the lamp stands to its right.
const LAP = { x: 40, y: 100, z: 10, w: 130, d: 80, h: 6 };
const SCREEN = { x: 40, y: 94, z: 16, w: 130, d: 6, h: 86 };
const LAMP = { x: 236, y: 92 }; // pole
const SHADE = { x: 192, y: 92, top: 112, bottom: 92, r0: 6, r1: 17 };

const { P, TOP, FRONT, viewBox, Box, RoundBox, filterRegion } = isoFrame([
  [0, 0, 0],
  [280, 0, 0],
  [0, 200, 0],
  [280, 200, 0],
  [SCREEN.x, SCREEN.y, SCREEN.z + SCREEN.h],
  [LAMP.x, LAMP.y, SHADE.top + 8],
]);

const ring = (cx: number, cy: number, z: number, r: number, n = 48) =>
  Array.from({ length: n }, (_, i) => P(cx + r * Math.cos((i / n) * Math.PI * 2), cy + r * Math.sin((i / n) * Math.PI * 2), z));
/** Silhouette of a cone frustum: the convex hull of its two rims. */
function frustum(cx: number, cy: number, z0: number, r0: number, z1: number, r1: number) {
  const pts = [...ring(cx, cy, z0, r0), ...ring(cx, cy, z1, r1)].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o: number[], a: number[], b: number[]) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const half = (list: number[][]) => {
    const h: number[][] = [];
    for (const p of list) {
      while (h.length >= 2 && cross(h[h.length - 2], h[h.length - 1], p) <= 0) h.pop();
      h.push(p);
    }
    return h.slice(0, -1);
  };
  const hull = [...half(pts), ...half([...pts].reverse())];
  return "M" + hull.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join("L") + "Z";
}
const loop = (pts: number[][]) => "M" + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join("L") + "Z";
const SHADE_PATH = frustum(SHADE.x, SHADE.y, SHADE.bottom, SHADE.r1, SHADE.top, SHADE.r0);
const SHADE_RIM = loop(ring(SHADE.x, SHADE.y, SHADE.bottom, SHADE.r1));
const SHADE_CAP = loop(ring(SHADE.x, SHADE.y, SHADE.top, SHADE.r0));

export function About() {
  const svg = useRef<SVGSVGElement>(null);
  const [lines, setLines] = useState<string[]>([]);
  const [current, setCurrent] = useState("");
  const [lampOn, setLampOn] = useState(true);
  const [hotKey, setHotKey] = useState(-1);
  const demoDone = useRef(false);

  const pressKey = (seed: number) => {
    setHotKey(seed % (KEY_COLS * KEY_ROWS));
    window.setTimeout(() => setHotKey(-1), 120);
  };

  // Type the intro once the figure scrolls into view.
  useEffect(() => {
    const el = svg.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let timer = 0;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || timer) return;
      io.disconnect();
      if (reduced) {
        demoDone.current = true;
        setLines(SCRIPT);
        return;
      }
      let line = 0;
      let char = 0;
      timer = window.setInterval(() => {
        if (demoDone.current) return window.clearInterval(timer);
        const text = SCRIPT[line];
        if (char < text.length) {
          char++;
          setCurrent(text.slice(0, char));
          pressKey(text.charCodeAt(char - 1));
          return;
        }
        setLines((l) => [...l, text]);
        setCurrent("");
        line++;
        char = 0;
        if (line === SCRIPT.length) {
          demoDone.current = true;
          window.clearInterval(timer);
        }
      }, 70);
    }, { threshold: 0.5 });
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearInterval(timer);
    };
  }, []);

  // Visitor typing takes over from the intro.
  const takeOver = () => {
    if (demoDone.current) return;
    demoDone.current = true;
    setLines(SCRIPT);
    setCurrent("");
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key.length === 1 || e.key === "Enter" || e.key === "Backspace") {
      e.preventDefault();
      takeOver();
      pressKey(e.key.charCodeAt(0) + e.key.length);
    }
    if (e.key === "Enter") {
      setLines((l) => [...l, current]);
      setCurrent("");
    } else if (e.key === "Backspace") setCurrent((c) => c.slice(0, -1));
    else if (e.key.length === 1) setCurrent((c) => (c + e.key).slice(0, MAX_CHARS));
  };

  const shown = [...lines, `${current}▌`].slice(-MAX_LINES);

  return (
    <Section id="about" index="05" title="About" shape={5}>
      <div className="grid gap-[8vh] md:grid-cols-12 md:gap-x-[min(8vh,5vw)]">
        <div className="md:col-span-6">
          <ScrubText
            className="wide text-[clamp(1.6rem,2.8vw,3rem)] leading-[1.08] font-semibold tracking-tight"
            text="I like software that holds up after the demo: clear boundaries, honest error paths, and numbers that prove it got faster."
          />
          <Stagger className="mt-[6vh] max-w-[58ch] space-y-5 text-lg leading-relaxed text-ink-2">
            <p>
              I&apos;m a Computer Science master&apos;s student at Rutgers. Before that I studied Artificial
              Intelligence &amp; Data Science at the University of Mumbai, where I spent two internships building
              backend modules, auth, and dashboards that real teams used every day.
            </p>
            <p>
              On the research side I&apos;ve published work on computer vision for traffic enforcement, WGAN-GP for
              synthetic financial data, and a privacy-first voice assistant. These days I&apos;m most interested in
              developer tooling for coding agents and the infrastructure that makes AI products reliable.
            </p>
          </Stagger>
        </div>

        <figure className="md:col-span-5 md:col-start-8 md:self-start md:sticky md:top-[14vh]">
          <svg
            ref={svg}
            viewBox={viewBox}
            role="img"
            aria-label="Isometric desk with a laptop and a lamp. Focus it and type to write on the laptop screen; click the lamp to switch it."
            tabIndex={0}
            onKeyDown={onKey}
            className="iso w-full outline-none focus-visible:ring-1 focus-visible:ring-accent"
          >
            <defs>
              <filter id="iso-soft" {...filterRegion}>
                <feGaussianBlur stdDeviation="2" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="iso-bloom" {...filterRegion}>
                <feGaussianBlur stdDeviation="14" />
              </filter>
              <clipPath id="about-screen-clip">
                <rect x={6} y={6} width={118} height={66} />
              </clipPath>
            </defs>

            {/* Desk */}
            <RoundBox x={0} y={0} z={0} w={280} d={200} h={10} r={10} />
            <g transform={TOP(0, 0, 10)}>
              <rect className="iso-detail" x={10} y={10} width={260} height={180} rx={6} />
            </g>
            {/* Light pool under the lamp */}
            <g transform={TOP(0, 0, 10)}>
              <ellipse className={`iso-halo ${lampOn ? "is-hot" : ""}`} filter="url(#iso-bloom)" cx={SHADE.x - 6} cy={SHADE.y + 14} rx={62} ry={52} />
            </g>

            {/* Laptop: screen first, then the base in front of it */}
            <g className="iso-press" onClick={() => svg.current?.focus()}>
              <title>Laptop</title>
              <Box {...SCREEN} />
              <g transform={FRONT(SCREEN.x, SCREEN.y + SCREEN.d, SCREEN.z + SCREEN.h)}>
                <rect className="iso-glass is-hot" x={6} y={6} width={118} height={66} rx={2} />
                <g clipPath="url(#about-screen-clip)">
                  {shown.map((l, i) => (
                    <text key={i} className={`iso-scr ${l.startsWith("$") ? "" : "iso-scr-dim"}`} x={10} y={18 + i * 12} fontSize={8}>
                      {l}
                    </text>
                  ))}
                </g>
                <circle className="iso-led is-on-dot" cx={65} cy={79} r={1.6} />
              </g>
              <Box {...LAP} />
              <g transform={TOP(LAP.x, LAP.y, LAP.z + LAP.h)}>
                {Array.from({ length: KEY_COLS * KEY_ROWS }, (_, k) => (
                  <rect
                    key={k}
                    className={`iso-key ${k === hotKey ? "is-hot" : ""}`}
                    x={10 + (k % KEY_COLS) * 9.4}
                    y={8 + Math.floor(k / KEY_COLS) * 8}
                    width={7.4}
                    height={6}
                    rx={1}
                  />
                ))}
                <rect className="iso-detail" x={45} y={54} width={40} height={20} rx={2} />
              </g>
            </g>

            {/* Lamp, beside the laptop: weighted base, pole, an arm reaching over, and a cone shade */}
            <g className="iso-press" onClick={() => setLampOn((on) => !on)}>
              <title>Lamp</title>
              <RoundBox x={LAMP.x - 16} y={LAMP.y - 16} z={10} w={32} d={32} h={7} r={16} />
              <Box x={LAMP.x - 2} y={LAMP.y - 2} z={17} w={4} d={4} h={SHADE.top - 17} />
              <Box x={SHADE.x} y={LAMP.y - 2} z={SHADE.top} w={LAMP.x + 2 - SHADE.x} d={4} h={4} />
              <path className={`iso-face ${lampOn ? "iso-lit" : ""}`} d={SHADE_PATH} />
              <path className="iso-detail" d={SHADE_RIM} />
              <path className="iso-face iso-top" d={SHADE_CAP} />
            </g>

            {/* Mug, with its handle on the side and a little steam */}
            <RoundBox x={212} y={128} z={10} w={28} d={28} h={26} r={14} />
            <g transform={TOP(212, 128, 36)}>
              <circle className="iso-detail" cx={14} cy={14} r={10} />
            </g>
            <g transform={FRONT(238, 142, 32)}>
              <path className="iso-face" d="M0 2 H6 Q11 2 11 8 V12 Q11 18 6 18 H0 V14 H5 Q7 14 7 12 V8 Q7 6 5 6 H0 Z" />
            </g>
            <path className="iso-detail" d={`M${P(224, 140, 40).join(" ")} q -3 -6 0 -11 t 0 -11`} />
            <path className="iso-detail" d={`M${P(230, 144, 40).join(" ")} q -3 -6 0 -10 t 0 -10`} />

            {/* Papers at the front of the desk, the published one on top */}
            <Box x={178} y={164} z={10} w={62} d={30} h={2} />
            <Box x={182} y={160} z={12} w={62} d={30} h={2} />
            <g transform={TOP(182, 160, 14)}>
              <text className="iso-print" x={5} y={9} fontSize={5}>
                IEEE ICICIS &apos;25
              </text>
              <text className="iso-print iso-name" x={5} y={16} fontSize={4.6}>
                traffic CV
              </text>
              {[22, 25, 28].map((y) => (
                <line key={y} className="iso-detail" x1={6} y1={y} x2={y === 28 ? 38 : 54} y2={y} />
              ))}
            </g>
          </svg>
          <figcaption className="label mt-4 text-ink-3">
            <span className="text-accent">Fig. 05</span> · Desk, lamp {lampOn ? "on" : "off"} · click the lamp, type on
            the laptop
          </figcaption>
        </figure>
      </div>
    </Section>
  );
}
