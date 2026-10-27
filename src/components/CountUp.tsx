"use client";

import { useEffect, useRef } from "react";

export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const match = value.match(/^([^\d]*)([\d.]+)(.*)$/);
    if (!el || !match) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const [, prefix, digits, suffix] = match;
    const target = Number(digits);
    const decimals = digits.split(".")[1]?.length ?? 0;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / 900);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = `${prefix}${(target * eased).toFixed(decimals)}${suffix}`;
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      el.textContent = value;
    };
  }, [value]);

  return <span ref={ref}>{value}</span>;
}
