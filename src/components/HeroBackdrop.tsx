"use client";

import { useEffect, useRef } from "react";

const GAP = 30;
const REACH = 240;
const WAVE_SPEED = 0.7;
const WAVE_WIDTH = 60;

type Needle = { x: number; y: number; a: number };
type Ripple = { x: number; y: number; t: number };

const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

export function HeroBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const host = canvas?.parentElement;
    if (!canvas || !ctx || !host) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let needles: Needle[] = [];
    let ripples: Ripple[] = [];
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;
    let colors = { ink: "#8a8377", accent: "#ff5a1f" };
    const pointer = { x: 0, y: 0, active: false };

    const readColors = () => {
      const s = getComputedStyle(document.documentElement);
      colors = {
        ink: s.getPropertyValue("--color-ink-3").trim() || colors.ink,
        accent: s.getPropertyValue("--color-accent").trim() || colors.accent,
      };
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      needles = [];
      const ox = (w % GAP) / 2 + GAP / 2;
      const oy = (h % GAP) / 2 + GAP / 2;
      for (let y = oy; y < h; y += GAP) {
        for (let x = ox; x < w; x += GAP) needles.push({ x, y, a: -Math.PI / 4 });
      }
      if (reduced) frame(performance.now());
    };

    const target = (now: number) => {
      if (pointer.active) return pointer;
      const t = now / 6000;
      return { x: w * (0.5 + 0.35 * Math.cos(t)), y: h * (0.5 + 0.3 * Math.sin(t * 1.3)) };
    };

    const frame = (now: number) => {
      const tgt = target(now);
      ripples = ripples.filter((r) => (now - r.t) * WAVE_SPEED < Math.hypot(w, h) + WAVE_WIDTH);
      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = "round";

      for (const n of needles) {
        const dx = tgt.x - n.x;
        const dy = tgt.y - n.y;
        const d = Math.hypot(dx, dy);
        let goal = Math.atan2(dy, dx);
        let wave = 0;
        for (const r of ripples) {
          const off = Math.abs(Math.hypot(n.x - r.x, n.y - r.y) - (now - r.t) * WAVE_SPEED);
          if (off < WAVE_WIDTH) wave = Math.max(wave, 1 - off / WAVE_WIDTH);
        }
        goal += wave * Math.PI;
        n.a += reduced ? wrap(goal - n.a) : wrap(goal - n.a) * 0.12;

        const near = pointer.active ? Math.max(0, 1 - d / REACH) : 0;
        const glow = Math.max(near, wave);
        const len = 4 + glow * 9;
        const cx = Math.cos(n.a) * len;
        const cy = Math.sin(n.a) * len;

        ctx.globalAlpha = 0.35 + glow * 0.65;
        ctx.strokeStyle = glow > 0.15 ? colors.accent : colors.ink;
        ctx.lineWidth = 1.4 + glow * 0.8;
        ctx.beginPath();
        ctx.moveTo(n.x - cx, n.y - cy);
        ctx.lineTo(n.x + cx, n.y + cy);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };

    const loop = (now: number) => {
      if (visible) frame(now);
      raf = requestAnimationFrame(loop);
    };

    const local = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      Object.assign(pointer, local(e), { active: true });
    };
    const onLeave = () => {
      pointer.active = false;
    };
    const onDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest("a, button, [data-sticker]")) return;
      ripples.push({ ...local(e), t: performance.now() });
    };

    readColors();
    const mo = new MutationObserver(() => {
      readColors();
      if (reduced) frame(performance.now());
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(canvas);
    resize();

    if (!reduced) {
      host.addEventListener("pointermove", onMove, { passive: true });
      host.addEventListener("pointerleave", onLeave);
      host.addEventListener("pointerdown", onDown);
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      mo.disconnect();
      ro.disconnect();
      io.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 size-full" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent" />
    </>
  );
}
