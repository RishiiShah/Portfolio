"use client";

import { useEffect, useRef } from "react";

const BLOBS = [
  { color: "var(--color-accent)", size: "26rem", top: "-10%", left: "66%", depth: 40, delay: "0s" },
  { color: "var(--color-sun)", size: "24rem", top: "42%", left: "78%", depth: -30, delay: "-6s" },
  { color: "var(--color-mint)", size: "26rem", top: "58%", left: "-8%", depth: 25, delay: "-12s" },
  { color: "var(--color-cobalt)", size: "16rem", top: "6%", left: "22%", depth: -45, delay: "-3s" },
];

export function HeroBackdrop() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const host = el?.parentElement;
    if (!el || !host) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;

    const tick = () => {
      x += (tx - x) * 0.05;
      y += (ty - y) * 0.05;
      el.style.setProperty("--px", x.toFixed(4));
      el.style.setProperty("--py", y.toFixed(4));
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.001 ? requestAnimationFrame(tick) : 0;
    };
    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width - 0.5;
      ty = (e.clientY - r.top) / r.height - 0.5;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    host.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      host.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden [--px:0] [--py:0]">
      {BLOBS.map((b) => (
        <div
          key={b.color}
          className="absolute"
          style={{
            top: b.top,
            left: b.left,
            width: b.size,
            height: b.size,
            transform: `translate(calc(var(--px) * ${b.depth}px), calc(var(--py) * ${b.depth}px))`,
          }}
        >
          <div
            className={`blob inset-0 ${b.color.includes("cobalt") ? "!opacity-15" : ""}`}
            style={{ background: b.color, animationDelay: b.delay }}
          />
        </div>
      ))}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent" />
    </div>
  );
}
