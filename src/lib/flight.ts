/**
 * Shared timing for the project flythrough. Progress `f` runs from 0 to `legs`;
 * leg 0 is the approach to the first station, leg k flies from station k-1 to k.
 * Inside each leg the camera holds for the first and last 20%, so it dwells at
 * every station before easing on to the next.
 */
export function legAt(f: number, legs: number) {
  const leg = Math.max(0, Math.min(legs - 1, Math.floor(f)));
  const t = Math.max(0, Math.min(1, (f - leg - 0.2) / 0.6));
  return { leg, eased: t * t * (3 - 2 * t) };
}

/** How visible station i's panel is at progress f: fully shown while the camera is parked there (|d| ≤ 0.2), gone soon after it leaves. */
export function stationVisibility(f: number, i: number) {
  const d = Math.abs(f - (i + 1));
  return Math.max(0, Math.min(1, (0.34 - d) / 0.14));
}
