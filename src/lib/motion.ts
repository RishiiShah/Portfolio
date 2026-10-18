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

/** Smooth-scroll to a page offset, using Lenis when it's running. */
export function scrollToY(y: number, duration = 1.4) {
  if (motion.lenis) motion.lenis.scrollTo(y, { duration });
  else window.scrollTo({ top: y });
}
