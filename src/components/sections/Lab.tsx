"use client";

import { useEffect, useRef, useState } from "react";
import { labModels, projects } from "@/data";
import { SectionHead } from "@/components/SectionHead";
import { Reveal } from "@/components/Reveal";
import { CountUp } from "@/components/CountUp";

const LINK_LABEL = { demo: "Live site", video: "Watch demo", source: "Source", paper: "Paper", blog: "Write-up", package: "PyPI" } as const;
const STEP_MS = 1100;

export function Lab() {
  const [active, setActive] = useState(0);
  const [step, setStep] = useState(0);
  const [held, setHeld] = useState<number | null>(null);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const model = labModels[active];
  const project = projects.find((p) => p.slug === model.slug);
  const lesson = project?.lessons?.[model.lesson];
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
    const id = setInterval(() => setStep((s) => (s + 1) % model.stages.length), STEP_MS);
    return () => clearInterval(id);
  }, [inView, held, model.stages.length]);

  const pick = (i: number) => {
    setActive(i);
    setStep(0);
    setHeld(null);
  };

  return (
    <section id="lab" className="shell scroll-mt-16 py-28 md:py-40">
      <SectionHead
        index="02"
        title="In the"
        flourish="lab"
        note="Models I've trained, tuned and shipped. Pick one and watch the data flow through it."
      />

      <Reveal>
        <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Choose a model">
          {labModels.map((m, i) => {
            const on = i === active;
            return (
              <button
                key={m.slug}
                type="button"
                aria-pressed={on}
                onClick={() => pick(i)}
                className={`flex flex-col items-start rounded-2xl border px-4 py-2.5 text-left transition-all duration-300 ${
                  on
                    ? "-rotate-1 border-ink bg-ink text-bg shadow-[3px_3px_0_var(--color-accent)]"
                    : "border-line-2 text-ink-2 hover:-translate-y-0.5 hover:border-ink hover:text-ink"
                }`}
              >
                <span className={`font-mono text-[0.62rem] uppercase tracking-wider ${on ? "text-accent" : "text-ink-3"}`}>{m.kind}</span>
                <span className="font-display text-base font-semibold tracking-tight">{m.name}</span>
              </button>
            );
          })}
        </div>

        <div ref={ref}>
        <div
          key={model.slug}
          className="rounded-3xl border-2 border-ink bg-bg-2 p-6 shadow-[6px_6px_0_var(--color-ink)] [animation:pop-in_0.5s_var(--ease-out-expo)_backwards] md:p-10"
        >
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="label !text-accent">{model.kind}</p>
              <h3 className="mt-2 font-display text-4xl font-semibold tracking-tight md:text-5xl">{model.name}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {project?.links?.map((l) => (
                <a
                  key={l.url}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 items-center rounded-xl border border-line-2 px-4 text-sm transition-colors hover:border-accent hover:text-accent"
                >
                  {LINK_LABEL[l.type]} ↗
                </a>
              ))}
            </div>
          </div>

          <ol className="mt-10 flex flex-col md:flex-row" onPointerLeave={() => setHeld(null)}>
            {model.stages.map((s, i) => {
              const on = i === current;
              const passed = i < current;
              return (
                <li key={s.label} className="flex flex-col md:flex-1 md:flex-row">
                  <div
                    onPointerEnter={() => setHeld(i)}
                    className={`flex-1 rounded-2xl border-2 bg-bg p-4 transition-all duration-500 ease-[cubic-bezier(0.34,1.6,0.5,1)] [animation:pop-in_0.5s_var(--ease-out-expo)_backwards] ${
                      on
                        ? "-translate-y-1 border-accent shadow-[3px_3px_0_var(--color-accent)]"
                        : passed
                          ? "border-ink/40"
                          : "border-line-2"
                    }`}
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <span className={`font-mono text-xs ${on ? "text-accent" : "text-ink-3"}`}>0{i + 1}</span>
                    <p className="mt-2 font-display text-lg font-semibold leading-tight tracking-tight">{s.label}</p>
                    <p className="mt-1.5 text-sm leading-snug text-ink-2">{s.detail}</p>
                  </div>
                  {i < model.stages.length - 1 ? (
                    <span
                      aria-hidden
                      className={`flow-line mx-auto h-5 w-0.5 shrink-0 md:my-auto md:h-0.5 md:w-5 ${i === current - 1 ? "is-hot" : ""}`}
                    />
                  ) : null}
                </li>
              );
            })}
          </ol>

          <div className="mt-10 grid gap-8 border-t border-line pt-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
            <dl className="grid grid-cols-3 gap-4">
              {model.stats.map((st) => (
                <div key={st.label}>
                  <dd className="font-display text-2xl font-semibold tracking-tight sm:text-3xl xl:text-4xl">
                    <CountUp value={st.value} />
                  </dd>
                  <dt className="mt-1 text-xs leading-snug text-ink-3">{st.label}</dt>
                </div>
              ))}
            </dl>
            {lesson ? (
              <blockquote>
                <p className="label">What it taught me</p>
                <p className="flourish mt-3 text-xl leading-snug text-ink">“{lesson}”</p>
              </blockquote>
            ) : null}
          </div>
        </div>
        </div>
      </Reveal>
    </section>
  );
}
