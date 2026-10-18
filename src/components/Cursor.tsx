"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/** Dot + trailing ring; the ring grows over links and buttons. Fine pointers only. */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const d = dot.current!;
    const r = ring.current!;
    gsap.set([d, r], { xPercent: -50, yPercent: -50, opacity: 0 });
    const dx = gsap.quickTo(d, "x", { duration: 0.08 });
    const dy = gsap.quickTo(d, "y", { duration: 0.08 });
    const rx = gsap.quickTo(r, "x", { duration: 0.45, ease: "power3.out" });
    const ry = gsap.quickTo(r, "y", { duration: 0.45, ease: "power3.out" });

    const move = (e: PointerEvent) => {
      gsap.to([d, r], { opacity: 1, duration: 0.3, overwrite: "auto" });
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
      const hot = (e.target as Element).closest("a, button, summary, label");
      gsap.to(r, { scale: hot ? 1.8 : 1, duration: 0.3, overwrite: "auto" });
    };
    const leave = () => gsap.to([d, r], { opacity: 0, duration: 0.3 });
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <>
      <div ref={dot} className="pointer-events-none fixed top-0 left-0 z-[90] size-1.5 rounded-full bg-accent opacity-0" aria-hidden="true" />
      <div ref={ring} className="pointer-events-none fixed top-0 left-0 z-[90] size-9 rounded-full border border-accent opacity-0" aria-hidden="true" />
    </>
  );
}
