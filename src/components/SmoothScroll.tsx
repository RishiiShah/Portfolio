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

    // In-page links glide to their section.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
      const hash = link?.getAttribute("href");
      if (!hash) return;
      const target = hash === "#" || hash === "#top" ? 0 : document.querySelector<HTMLElement>(hash);
      if (target === null) return;
      e.preventDefault();
      const offset = target === 0 ? 0 : -56;
      const arrive = () => {
        if (target === 0) return;
        // Move focus with the view, so the next Tab continues from the section.
        if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      };
      // Keep the address shareable.
      history.replaceState(null, "", target === 0 ? location.pathname + location.search : hash);

      lenis.scrollTo(target, {
        offset,
        duration: 1.6,
        easing: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
        lock: true,
        onComplete: arrive,
      });
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(raf);
      motion.lenis = null;
      lenis.destroy();
    };
  }, []);

  return null;
}
