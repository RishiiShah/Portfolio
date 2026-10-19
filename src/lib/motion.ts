import type Lenis from "lenis";

/** Shared, mutable motion state read by the WebGL scene and other animated pieces. */
export const motion = {
  /** Flythrough progress, 0 … number of legs (see lib/flight.ts). */
  flight: 0,
  lenis: null as Lenis | null,
};

/** Phones and upright tablets: the scroll scenes stack the drawing above the card. Mirrors the `stack` CSS variant. */
export const STACKED = "(max-width: 767px), (max-width: 1100px) and (orientation: portrait)";
export const isStacked = () => window.matchMedia(STACKED).matches;

interface GlideOptions {
  easing?: (t: number) => number;
  /** Ignore user scrolling until the glide lands. */
  lock?: boolean;
  onComplete?: () => void;
}

/** Smooth-scroll to a page offset, using Lenis when it's running. */
export function scrollToY(y: number, duration = 1.4, { easing, lock, onComplete }: GlideOptions = {}) {
  if (motion.lenis) {
    motion.lenis.scrollTo(y, { duration, easing, lock, onComplete: () => onComplete?.() });
    return;
  }
  window.scrollTo({ top: y, behavior: "smooth" });
  if (onComplete) window.setTimeout(onComplete, duration * 1000);
}
