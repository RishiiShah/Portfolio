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

// Laptop base and screen, lamp parts and mug, as (x, y, z, w, d, h).
const LAP = { x: 40, y: 100, z: 10, w: 130, d: 80, h: 6 };
const SCREEN = { x: 40, y: 94, z: 16, w: 130, d: 6, h: 86 };
const SHADE = { x: 168, y: 34, z: 84, w: 30, d: 22, h: 16 };

const { TOP, FRONT, viewBox, Box, RoundBox, filterRegion } = isoFrame([
  [0, 0, 0],
  [280, 0, 0],
  [0, 200, 0],
  [280, 200, 0],
  [SCREEN.x, SCREEN.y, SCREEN.z + SCREEN.h],
  [215, 45, 106],
]);

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
      <div className="grid gap-[8vh] md:grid-cols-12">
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
              <ellipse className={`iso-halo ${lampOn ? "is-hot" : ""}`} filter="url(#iso-bloom)" cx={170} cy={92} rx={70} ry={58} />
            </g>

            {/* Lamp: shade, arm, then the pole in front of the arm's end */}
            <g className="iso-press" onClick={() => setLampOn((on) => !on)}>
              <title>Lamp</title>
              <RoundBox x={200} y={30} z={10} w={30} d={30} h={6} r={15} />
              <RoundBox {...SHADE} r={9} className={lampOn ? "iso-lit" : ""} />
              <Box x={183} y={43} z={100} w={32} d={4} h={4} />
              <Box x={213} y={43} z={16} w={4} d={4} h={88} />
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

            {/* Mug */}
            <RoundBox x={212} y={128} z={10} w={28} d={28} h={26} r={14} />
            <g transform={TOP(212, 128, 36)}>
              <circle className="iso-detail" cx={14} cy={14} r={10} />
            </g>
          </svg>
          <figcaption className="label mt-4 text-ink-3">
            <span className="text-accent">Fig. 05</span> — Desk, lamp {lampOn ? "on" : "off"} · click the lamp, type on
            the laptop
          </figcaption>
        </figure>
      </div>
    </Section>
  );
}
