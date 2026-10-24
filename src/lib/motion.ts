import type Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** Shared, mutable motion state read by the WebGL scene and other animated pieces. */
export const motion = {
  /** Flythrough progress, 0 … number of legs (see lib/flight.ts). */
  flight: 0,
  lenis: null as Lenis | null,
  /** True while an in-page link is scrolling the page; pinned sections stop paging until it lands. */
  travelling: false,
};

/** Phones and upright tablets: the scroll scenes stack the drawing above the card. Mirrors the `stack` CSS variant. */
const STACKED = "(max-width: 767px), (max-width: 1100px) and (orientation: portrait)";
export const isStacked = () => window.matchMedia(STACKED).matches;

// From a resize until ScrollTrigger has re-measured, offsets shift without anyone
// scrolling; paged scenes must not read that as a gesture.
let refreshing = false;
if (typeof window !== "undefined") {
  let fallback = 0;
  const hold = () => {
    refreshing = true;
    clearTimeout(fallback);
    fallback = window.setTimeout(() => (refreshing = false), 1000); // in case no refresh follows
  };
  window.addEventListener("resize", hold);
  ScrollTrigger.addEventListener("refreshInit", hold);
  ScrollTrigger.addEventListener("refresh", () => {
    clearTimeout(fallback);
    requestAnimationFrame(() => requestAnimationFrame(() => (refreshing = false)));
  });
}

/**
 * A pinned, scrubbed scene that pages between evenly spaced stations 0 … last: one scroll
 * gesture glides to the next (or previous) station with input locked until it lands, so it
 * never rests between two. Scrolling past `first` or `last` leaves the section.
 */
export function pagedScene(o: {
  trigger: Element;
  last: number;
  /** Lowest station a gesture can glide to (Selected work starts on 1, its title screen is 0). */
  first: number;
  vhPerStation: number;
  seconds: number;
  render: (progress: number) => void;
}) {
  let home = 0;
  let gliding = false;
  const stationY = (st: ScrollTrigger, station: number) => st.start + (station / o.last) * (st.end - st.start);
  // Takes the trigger as an argument: ScrollTrigger can fire onUpdate while it is still being
  // created (a page that loads already scrolled past the scene), before `st` is assigned.
  const glide = (st: ScrollTrigger, station: number) => {
    gliding = true;
    home = station;
    const y = stationY(st, station);
    const land = () => (gliding = false);
    if (motion.lenis) motion.lenis.scrollTo(y, { duration: o.seconds, easing: (t) => t, lock: true, onComplete: land });
    else {
      window.scrollTo({ top: y, behavior: "smooth" });
      window.setTimeout(land, o.seconds * 1000);
    }
  };
  const steer = (st: ScrollTrigger) => {
    if (gliding || motion.travelling || refreshing) return;
    const at = st.progress * o.last;
    if (Math.abs(at - home) < 0.03) return;
    const target = st.direction > 0 ? Math.floor(at) + 1 : Math.ceil(at) - 1;
    if (target >= o.first && target <= o.last) glide(st, target);
  };
  const st = ScrollTrigger.create({
    trigger: o.trigger,
    pin: true,
    start: "top top",
    end: () => `+=${window.innerHeight * o.last * o.vhPerStation}`,
    scrub: true,
    onUpdate: (self) => {
      o.render(self.progress);
      steer(self);
    },
    // Only a real entry resets where we're parked: not a glide passing the edge, not a re-measure.
    onEnter: () => !gliding && !refreshing && (home = 0),
    onEnterBack: () => !gliding && !refreshing && (home = o.last),
    onRefresh: (self) => {
      // A resize changes the scene's length, so the same scroll offset now sits between
      // stations; settle back on the one we were parked at instead of paging onward.
      if (self.isActive && !gliding) {
        const y = stationY(self, home);
        requestAnimationFrame(() => {
          if (motion.lenis) motion.lenis.scrollTo(y, { immediate: true, force: true });
          else window.scrollTo(0, y);
        });
      }
      o.render(self.progress);
    },
  });
  o.render(0);
  return { trigger: st, glide: (station: number) => glide(st, station) };
}
