"use client";

import { useEffect, useRef, useState } from "react";

type Mode = { kind: "idle" } | { kind: "hover"; label?: string };

const INTERACTIVE = "a, button, [data-sticker], [data-cursor], [role='tab']";

function modeFor(target: EventTarget | null): Mode {
  const el = (target as Element | null)?.closest?.(INTERACTIVE);
  if (!el) return { kind: "idle" };
  const label =
    el.getAttribute("data-cursor") ??
    (el.hasAttribute("data-sticker") ? "drag" : el.getAttribute("target") === "_blank" ? "visit ↗" : undefined);
  return { kind: "hover", label };
}

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
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
    let labelKey = "";
    let labeled = false;

    const tick = () => {
      const ease = still ? 1 : 0.2;
      const dx = target.x - pos.x;
      const dy = target.y - pos.y;
      pos.x += dx * ease;
      pos.y += dy * ease;
      // Labels stay legible, so the ring barely stretches while one is showing.
      const stretch = labeled ? 0.08 : 0.35;
      const speed = Math.min(Math.hypot(dx, dy) / 120, stretch);
      const angle = Math.atan2(dy, dx);
      if (ring.current) {
        ring.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) rotate(${angle}rad) scale(${1 + speed}, ${1 - speed * 0.6})`;
        ring.current.style.setProperty("--counter", `${-angle}rad`);
      }
      raf = Math.abs(dx) + Math.abs(dy) > 0.1 ? requestAnimationFrame(tick) : 0;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      target.x = e.clientX;
      target.y = e.clientY;
      if (dot.current) dot.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      setVisible(true);
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onOver = (e: PointerEvent) => {
      const next = modeFor(e.target);
      const key = next.kind === "hover" ? `h:${next.label ?? ""}` : "idle";
      if (key !== labelKey) {
        labelKey = key;
        labeled = next.kind === "hover" && !!next.label;
        setMode(next);
      }
    };
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    const onLeave = () => setVisible(false);
    // Labels can change under a still pointer, e.g. a row flipping from "open" to "close" after a click.
    const onClick = (e: MouseEvent) => requestAnimationFrame(() => onOver(e as PointerEvent));

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("click", onClick, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      root.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("click", onClick);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  const hover = mode.kind === "hover";
  const label = hover ? mode.label : undefined;
  const size = label ? 76 : hover ? 52 : 34;

  return (
    <div aria-hidden className={`pointer-events-none fixed inset-0 z-[70] transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}>
      <div ref={ring} className="absolute left-0 top-0 will-change-transform">
        <div
          className={`grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-[1.5px] transition-[width,height,background-color,border-color,scale] duration-500 ease-[cubic-bezier(0.34,1.6,0.5,1)] ${
            label ? "border-accent bg-accent" : hover ? "border-accent bg-accent/15" : "border-ink/60"
          }`}
          style={{ width: size, height: size, scale: pressed ? 0.8 : 1 }}
        >
          <span
            className={`whitespace-nowrap font-mono text-[0.62rem] uppercase tracking-wider text-accent-ink transition-opacity duration-200 ${label ? "opacity-100" : "opacity-0"}`}
            style={{ rotate: "var(--counter)" }}
          >
            {label}
          </span>
        </div>
      </div>
      <div ref={dot} className="absolute left-0 top-0 will-change-transform">
        <div
          className={`size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink transition-[scale,opacity] duration-300 ${
            hover ? "scale-0 opacity-0" : pressed ? "scale-150" : ""
          }`}
        />
      </div>
    </div>
  );
}
