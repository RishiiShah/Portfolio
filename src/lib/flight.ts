/**
 * Shared timing for the project flythrough. Progress `f` runs from 0 to `legs`;
 * leg 0 is the approach to the first station, leg k flies from station k-1 to k.
 * Inside each leg the camera holds for the first and last 20%, so it dwells at
 * every station before easing on to the next.
 */
export function legAt(f: number, legs: number) {
  const leg = Math.max(0, Math.min(legs - 1, Math.floor(f)));
  const t = Math.max(0, Math.min(1, (f - leg - 0.08) / 0.84));
  return { leg, eased: t * t * (3 - 2 * t) };
}
