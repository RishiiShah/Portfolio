"use client";

import { useEffect, useRef, useState } from "react";

type Mode = { kind: "idle" } | { kind: "hover"; label?: string };

const INTERACTIVE = "a, button, [data-sticker], [data-cursor], [role='tab']";
const ARROW = "M2 2L21 12.5L10 15.5L5 22Z";
// Pixel offset from the SVG's top-left corner to the arrow's tip.
const HOTSPOT = 3;

function modeFor(target: EventTarget | null): Mode {
  const el = (target as Element | null)?.closest?.(INTERACTIVE);
  if (!el) return { kind: "idle" };
  const label =
    el.getAttribute("data-cursor") ??
    (el.hasAttribute("data-sticker") ? "drag" : el.getAttribute("target") === "_blank" ? "visit ↗" : undefined);
  return { kind: "hover", label };
}

export function Cursor() {
  const arrow = useRef<HTMLDivElement>(null);
  const tag = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<Mode>({ kind: "idle" });
  const [pressed, setPressed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setEnabled(fine.matches);
    sync();
    fine.addEventListener("change", sync);
    return () => fine.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.classList.add("has-cursor");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const target = { x: -100, y: -100 };
    const pos = { x: -100, y: -100 };
    let raf = 0;
    let modeKey = "";

    const tick = () => {
      const ease = still ? 1 : 0.22;
      const dx = target.x - pos.x;
      const dy = target.y - pos.y;
      pos.x += dx * ease;
      pos.y += dy * ease;
      if (tag.current) tag.current.style.transform = `translate3d(${pos.x + 18}px, ${pos.y + 22}px, 0)`;
      raf = Math.abs(dx) + Math.abs(dy) > 0.1 ? requestAnimationFrame(tick) : 0;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      target.x = e.clientX;
      target.y = e.clientY;
      if (arrow.current) {
        arrow.current.style.transform = `translate3d(${e.clientX - HOTSPOT}px, ${e.clientY - HOTSPOT}px, 0)`;
      }
      setVisible(true);
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onOver = (e: Event) => {
      const next = modeFor(e.target);
      const key = next.kind === "hover" ? `h:${next.label ?? ""}` : "idle";
      if (key !== modeKey) {
        modeKey = key;
        setMode(next);
      }
    };
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    const onLeave = () => setVisible(false);
    // Labels can change under a still pointer, e.g. a row flipping from "read" to "close" after a click.
    const onClick = (e: MouseEvent) => requestAnimationFrame(() => onOver(e));

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("click", onClick, { passive: true });
    root.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      root.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("click", onClick);
      root.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  const hover = mode.kind === "hover";
  const label = hover ? mode.label : undefined;

  return (
    <div aria-hidden className={`pointer-events-none fixed inset-0 z-[70] transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}>
      <div ref={tag} className="absolute left-0 top-0 will-change-transform">
        <span
          className={`block origin-top-left whitespace-nowrap rounded-full rounded-tl-sm bg-accent px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-wider text-accent-ink shadow-[2px_2px_0_var(--color-ink)] transition-[scale,opacity] duration-300 ease-[cubic-bezier(0.34,1.6,0.5,1)] ${
            label ? "scale-100 opacity-100" : "scale-50 opacity-0"
          }`}
        >
          {label}
        </span>
      </div>
      <div ref={arrow} className="absolute left-0 top-0 will-change-transform">
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          className="origin-[3px_3px] drop-shadow-[2px_3px_2px_rgb(0_0_0/0.28)] transition-[scale,rotate] duration-300 ease-[cubic-bezier(0.34,1.6,0.5,1)]"
          style={{ scale: pressed ? 0.85 : hover ? 1.12 : 1, rotate: hover ? "-8deg" : "0deg" }}
        >
          <path d={ARROW} fill="var(--color-bg)" stroke="var(--color-bg)" strokeWidth="5" strokeLinejoin="round" />
          <path
            d={ARROW}
            strokeWidth="2.5"
            strokeLinejoin="round"
            className={`transition-[fill,stroke] duration-300 ${hover ? "fill-accent stroke-accent" : "fill-ink stroke-ink"}`}
          />
        </svg>
      </div>
    </div>
  );
}
