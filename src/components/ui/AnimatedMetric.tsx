"use client";

import { useEffect, useMemo, useRef } from "react";

interface AnimatedMetricProps {
  value: string;
  duration?: number;
  delay?: number;
}

/**
 * Parse a metric value string into animatable parts.
 * Only matches values with a single numeric portion.
 * Examples:
 *   "93.76%" → { prefix: "", target: 93.76, suffix: "%", decimals: 2 }
 *   "<300ms" → { prefix: "<", target: 300, suffix: "ms", decimals: 0 }
 *   "Graph-driven" → null (no single number)
 *   "97.93% to 98.83%" → null (multiple numbers)
 */
function parseMetricValue(value: string) {
  const match = value.match(/^([^0-9]*?)(\d+(?:\.\d+)?)([^0-9]*)$/);
  if (!match) return null;
  const target = parseFloat(match[2]);
  if (target === 0) return null;
  const decimals = match[2].includes(".") ? match[2].split(".")[1].length : 0;
  return { prefix: match[1], target, suffix: match[3], decimals };
}

function easeOut(t: number): number {
  return t * (2 - t);
}

export function AnimatedMetric({ value, duration = 800, delay = 0 }: AnimatedMetricProps) {
  const parsed = useMemo(() => parseMetricValue(value), [value]);
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;

    if (!parsed) {
      el.textContent = value;
      return;
    }

    el.textContent = `${parsed.prefix}0${parsed.suffix}`;
    let raf = 0;

    const timeout = setTimeout(() => {
      let start: number | null = null;

      const step = (ts: number) => {
        if (!start) start = ts;
        const progress = Math.min((ts - start) / duration, 1);
        const current = easeOut(progress) * parsed.target;
        el.textContent = `${parsed.prefix}${current.toFixed(parsed.decimals)}${parsed.suffix}`;

        if (progress < 1) {
          raf = requestAnimationFrame(step);
        } else {
          el.textContent = value; // Ensure exact final value
        }
      };

      raf = requestAnimationFrame(step);
    }, delay);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, [value, parsed, duration, delay]);

  const initial = parsed ? `${parsed.prefix}0${parsed.suffix}` : value;

  return <span ref={spanRef}>{initial}</span>;
}
