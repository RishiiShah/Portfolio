"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const RETICLE = 22; // px, the idle reticle's box
const PAD = 6; // px of breathing room when the brackets frame a target
const HOT = "a, button, summary, label, [role='button'], .iso-press, .iso-slab";

const rgb = (c: string) => c.match(/[\d.]+/g)?.map(Number) ?? [];
/** Accent as [r, g, b], read from the theme (hex or rgb). */
function accentRgb() {
  const v = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
  if (v.startsWith("#")) return [1, 3, 5].map((i) => parseInt(v.slice(i, i + 2), 16));
  return rgb(v);
}
const near = (c: string, a: number[]) => {
  const v = rgb(c);
  if (v.length < 3 || (v.length > 3 && v[3] < 0.5)) return false;
  return Math.abs(v[0] - a[0]) + Math.abs(v[1] - a[1]) + Math.abs(v[2] - a[2]) < 60;
};
/** Is the pointer over something painted in the accent: a fill, a background, or accent text? */
function onAccent(el: Element | null, accent: number[]) {
  for (let k = 0; el && k < 4; k++, el = el.parentElement) {
    const cs = getComputedStyle(el);
    if (near(cs.backgroundColor, accent)) return true;
    if (el instanceof SVGElement && near(cs.fill, accent)) return true;
    const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent?.trim());
    if (hasText && near(cs.color, accent)) return true;
    if (cs.backgroundColor !== "rgba(0, 0, 0, 0)" && !(el instanceof SVGElement)) return false; // an opaque box that isn't accent
  }
  return false;
}

/**
 * A dot inside four corner ticks. Idle, the ticks form a small diamond around the
 * pointer; over a link or button they fly out and frame it like targeting brackets,
 * and a click pinches them in. Fine pointers only; text fields keep the native caret.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const d = dot.current!;
    const f = frame.current!;
    gsap.set(d, { xPercent: -50, yPercent: -50, opacity: 0 });
    gsap.set(f, { opacity: 0, width: RETICLE, height: RETICLE, rotate: 45 });
    const dx = gsap.quickTo(d, "x", { duration: 0.08 });
    const dy = gsap.quickTo(d, "y", { duration: 0.08 });

    let target: Element | null = null;
    let accent = accentRgb();
    const theme = new MutationObserver(() => (accent = accentRgb()));
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    let px = 0;
    let py = 0;
    const place = () => {
      if (target) {
        const r = target.getBoundingClientRect();
        gsap.to(f, {
          x: r.left - PAD,
          y: r.top - PAD,
          width: r.width + PAD * 2,
          height: r.height + PAD * 2,
          rotate: 0,
          duration: 0.35,
          ease: "power3.out",
          overwrite: "auto",
        });
      } else {
        gsap.to(f, {
          x: px - RETICLE / 2,
          y: py - RETICLE / 2,
          width: RETICLE,
          height: RETICLE,
          rotate: 45,
          duration: 0.4,
          ease: "power3.out",
          overwrite: "auto",
        });
      }
    };

    const move = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      const typing = (e.target as Element).closest("input, textarea, select, [contenteditable]");
      gsap.to([d, f], { opacity: typing ? 0 : 1, duration: 0.25, overwrite: "auto" });
      dx(px);
      dy(py);
      // Over accent-coloured things the cursor switches to the page colour so it stays visible.
      const contrast = onAccent(e.target as Element, accent);
      const hot = (e.target as Element).closest(HOT);
      d.toggleAttribute("data-contrast", contrast);
      // Brackets framing a target sit outside it, on the page, so they keep the accent.
      f.toggleAttribute("data-contrast", contrast && !hot);
      // Over a target the brackets only move when the target changes; idle, they trail the pointer.
      if (hot === target && hot) return;
      target = hot;
      f.toggleAttribute("data-hot", !!hot);
      place();
    };
    // Targets move under a still pointer while the page scrolls; keep the brackets on them.
    const scroll = () => target && place();
    const down = () => gsap.to(f, { scale: 0.86, duration: 0.12, overwrite: "auto" });
    const up = () => gsap.to(f, { scale: 1, duration: 0.3, ease: "back.out(3)", overwrite: "auto" });
    const leave = () => gsap.to([d, f], { opacity: 0, duration: 0.3 });
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    document.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.removeEventListener("pointerleave", leave);
      theme.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={dot} className="cursor-dot pointer-events-none fixed top-0 left-0 z-[90] opacity-0" aria-hidden="true" />
      <div ref={frame} className="cursor-frame pointer-events-none fixed top-0 left-0 z-[90] opacity-0" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </div>
    </>
  );
}
