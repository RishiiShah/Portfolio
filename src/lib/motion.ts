import type Lenis from "lenis";

/** Shared, mutable motion state read by the WebGL scene and other animated pieces. */
export const motion = {
  /** Selected work's camera position, 1 … number of projects (see lib/flight.ts). */
  flight: 1,
  lenis: null as Lenis | null,
};
