"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export const INTRO_DONE = "intro:done";

/** Short intro, once per browser session: a counter runs to 100, then the panel wipes upward. */
export function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const done = () => {
        document.documentElement.dataset.intro = "done";
        window.dispatchEvent(new Event(INTRO_DONE));
      };
      // Reduced motion, or already played this session (the head script marks it): no intro.
      if (
        document.documentElement.classList.contains("intro-seen") ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        gsap.set(root.current, { display: "none" });
        done();
        return;
      }
      const n = { v: 0 };
      gsap
        .timeline()
        .from(".loader-line", { yPercent: 110, duration: 0.6, ease: "power3.out", stagger: 0.08 })
        .to(
          n,
          {
            v: 100,
            duration: 1.1,
            ease: "power2.inOut",
            onUpdate: () => {
              if (count.current) count.current.textContent = String(Math.round(n.v)).padStart(3, "0");
            },
          },
          0
        )
        .to(".loader-bar", { scaleX: 1, duration: 1.1, ease: "power2.inOut" }, 0)
        .to(".loader-line", { yPercent: -110, duration: 0.45, ease: "power3.in", stagger: 0.05 }, "+=0.1")
        .to(root.current, { yPercent: -100, duration: 0.8, ease: "expo.inOut" }, "-=0.15")
        .add(done, "-=0.45")
        .set(root.current, { display: "none" });
    },
    { scope: root }
  );

  return (
    <div ref={root} className="loader fixed inset-0 z-[100] flex flex-col justify-between bg-[#0e0f11] p-[4vw] text-[#ecebe6] [--accent:#7d87ff]" aria-hidden="true">
      <div className="label flex justify-between opacity-60">
        <span className="block overflow-hidden"><span className="loader-line block">Rishabh Shah</span></span>
        <span className="block overflow-hidden"><span className="loader-line block">Portfolio</span></span>
      </div>
      <div className="flex items-end justify-between gap-6">
        <p className="display text-[9vw] leading-[0.9]">
          <span className="block overflow-hidden"><span className="loader-line block">Loading</span></span>
          <span className="block overflow-hidden"><span className="loader-line block text-accent">signal</span></span>
        </p>
        <span className="block overflow-hidden">
          <span ref={count} className="loader-line wide block font-mono text-[6vw] leading-none">000</span>
        </span>
      </div>
      <div className="loader-bar absolute bottom-0 left-0 h-1 w-full origin-left scale-x-0 bg-accent" />
    </div>
  );
}
