"use client";

import { useEffect, useRef, useState } from "react";
import type { PipelineStage } from "@/data";

const STEP_MS = 1100;

export function Pipeline({ stages }: { stages: PipelineStage[] }) {
  const [step, setStep] = useState(0);
  const [held, setHeld] = useState<number | null>(null);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLOListElement>(null);
  const current = held ?? step;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || held !== null) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setStep((s) => (s + 1) % stages.length), STEP_MS);
    return () => clearInterval(id);
  }, [inView, held, stages.length]);

  return (
    <ol ref={ref} className="flex flex-col md:flex-row" onPointerLeave={() => setHeld(null)} aria-label="How data flows through it">
      {stages.map((s, i) => {
        const on = i === current;
        const passed = i < current;
        return (
          <li key={s.label} className="flex flex-col md:flex-1 md:flex-row">
            <div
              onPointerEnter={() => setHeld(i)}
              className={`flex-1 rounded-2xl border-2 bg-bg p-4 transition-all duration-500 ease-[cubic-bezier(0.34,1.6,0.5,1)] ${
                on ? "-translate-y-1 border-accent shadow-[3px_3px_0_var(--color-accent)]" : passed ? "border-ink/40" : "border-line-2"
              }`}
            >
              <span className={`font-mono text-xs ${on ? "text-accent" : "text-ink-3"}`}>0{i + 1}</span>
              <p className="mt-2 font-display text-lg font-semibold leading-tight tracking-tight">{s.label}</p>
              <p className="mt-1.5 text-sm leading-snug text-ink-2">{s.detail}</p>
            </div>
            {i < stages.length - 1 ? (
              <span
                aria-hidden
                className={`flow-line mx-auto h-5 w-0.5 shrink-0 md:my-auto md:h-0.5 md:w-5 ${i === current - 1 ? "is-hot" : ""}`}
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
