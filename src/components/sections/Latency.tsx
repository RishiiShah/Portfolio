"use client";

import { useEffect, useRef, useState } from "react";

const FROM = 3100;
const TO = 420;

const STEPS = [
  "Profiled every Django request path",
  "Rewrote ORM-generated MySQL queries",
  "Added targeted indexes",
  "Tuned connection pooling",
  "Trimmed response payloads",
];

const ease = (t: number) => 1 - Math.pow(1 - t, 3);

export function Latency() {
  const ref = useRef<HTMLElement>(null);
  const [p, setP] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      setP(Math.min(1, Math.max(0, -rect.top / total)));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const t = ease(Math.min(1, p / 0.85));
  const ms = Math.round(FROM - (FROM - TO) * t);
  const done = t >= 0.999;
  const activeStep = Math.min(STEPS.length - 1, Math.floor((p / 0.85) * STEPS.length));

  return (
    <section ref={ref} className="relative h-[300vh]" aria-labelledby="latency-title">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
        <div className="shell grid gap-12 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <p id="latency-title" className="label">
              A problem I loved solving · Aaditya Technologies · P95 API latency
            </p>
            <p
              className={`display mt-6 tabular-nums text-[clamp(5rem,19vw,19rem)] transition-colors duration-700 ${
                done ? "text-accent" : "text-ink"
              }`}
              aria-label={`P95 latency reduced from ${FROM.toLocaleString()} to ${TO} milliseconds`}
            >
              {ms.toLocaleString()}
              <span className="ml-3 align-top font-mono text-[0.16em] font-normal tracking-normal text-ink-3">ms</span>
            </p>
            <div className="mt-8 h-2 w-full overflow-hidden rounded-full bg-bg-3">
              <div
                className="h-full rounded-full bg-accent"
                style={{ width: `${(ms / FROM) * 100}%` }}
              />
            </div>
            <div className="mt-3 flex justify-between font-mono text-xs text-ink-3">
              <span>0 ms</span>
              <span>{FROM.toLocaleString()} ms before</span>
            </div>
          </div>

          <div className="md:col-span-4">
            <ol className="space-y-3">
              {STEPS.map((s, i) => (
                <li
                  key={s}
                  className={`flex gap-4 text-lg transition-all duration-500 ${
                    i < activeStep || done
                      ? "text-ink-3"
                      : i === activeStep
                        ? "translate-x-2 text-ink"
                        : "text-ink-3/40"
                  }`}
                >
                  <span className="pt-1 font-mono text-xs text-accent">0{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
            <p
              className={`mt-10 border-t border-line pt-6 text-ink-2 transition-opacity duration-700 ${
                done ? "opacity-100" : "opacity-0"
              }`}
            >
              <strong className="font-display text-4xl font-semibold tracking-tight text-ink">−86%</strong>
              <br />
              From over three seconds to under half of one, on the same Django API.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
