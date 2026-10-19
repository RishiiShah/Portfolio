"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

/** Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays in sync. */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.1 });
    motion.lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // In-page links glide to their section. A trip that would pass through a pinned scene
    // (Selected work, Experience) would scrub its whole animation on the way, so those
    // trips fade the page out, jump, and fade back in instead. The flag keeps the paged
    // sections from steering the scroll while it happens.
    const veil = document.createElement("div");
    veil.setAttribute("aria-hidden", "true");
    veil.style.cssText = "position:fixed;inset:0;z-index:85;background:var(--bg);opacity:0;pointer-events:none";
    document.body.appendChild(veil);

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
      const hash = link?.getAttribute("href");
      if (!hash) return;
      const target = hash === "#" || hash === "#top" ? 0 : document.querySelector<HTMLElement>(hash);
      if (target === null) return;
      e.preventDefault();
      motion.travelling = true;
      const offset = target === 0 ? 0 : -56;
      const arrive = () => {
        motion.travelling = false;
        if (target !== 0) target.focus({ preventScroll: true });
      };

      const from = window.scrollY;
      const to = target === 0 ? 0 : target.getBoundingClientRect().top + from + offset;
      const [lo, hi] = from < to ? [from, to] : [to, from];
      const crossesPin = ScrollTrigger.getAll().some((t) => t.pin && t.end > lo + 1 && t.start < hi - 1);
      if (!crossesPin) {
        lenis.scrollTo(target, {
          offset,
          duration: 1.6,
          easing: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
          lock: true,
          onComplete: arrive,
        });
        return;
      }
      gsap.to(veil, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.in",
        overwrite: true,
        onComplete: () => {
          lenis.scrollTo(target, { offset, immediate: true, force: true });
          ScrollTrigger.update();
          gsap.to(veil, { opacity: 0, duration: 0.45, delay: 0.1, ease: "power2.out", onComplete: arrive });
        },
      });
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      veil.remove();
      gsap.ticker.remove(raf);
      motion.lenis = null;
      lenis.destroy();
    };
  }, []);

  return null;
}
