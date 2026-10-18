import type Lenis from "lenis";

/** Shared, mutable motion state read by the WebGL scene and other animated pieces. */
export const motion = {
  /** Flythrough progress, 0 … number of legs (see lib/flight.ts). */
  flight: 0,
  lenis: null as Lenis | null,
};

/** Smooth-scroll to a page offset, using Lenis when it's running. */
export function scrollToY(y: number) {
  if (motion.lenis) motion.lenis.scrollTo(y, { duration: 1.4 });
  else window.scrollTo({ top: y });
}
