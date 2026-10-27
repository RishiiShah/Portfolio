"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { experience, teaching } from "@/data";
import { SectionHead } from "@/components/SectionHead";
import { Reveal } from "@/components/Reveal";
import { TechChip } from "@/components/TechIcon";

const MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
const toMonth = (s: string) => {
  const [m, y] = s.toLowerCase().split(" ");
  return Number(y) * 12 + MONTHS.indexOf(m);
};
const short = (d: string) => d.replace(/^(\w{3})\w*\s/, "$1 ");

const COLORS = ["bg-mint", "bg-sun", "bg-accent"];

type Entry = {
  id: string;
  role: string;
  organization: string;
  location?: string;
  when: string;
  start: number;
  end: number | null;
  summary: string;
  bullets: string[];
  highlights: { value: string; label: string }[];
  tech: string[];
  color: string;
};

const entries: Entry[] = [
  {
    id: "rutgers-ta",
    role: teaching.role,
    organization: teaching.organization,
    location: teaching.location,
    when: `${short(teaching.start)} – Now`,
    start: toMonth(teaching.start),
    end: null,
    summary: teaching.course,
    bullets: [...teaching.bullets],
    highlights: [{ value: "50+", label: "Students each week" }],
    tech: [],
    color: COLORS[0],
  },
  ...experience.map((e, i) => ({
    id: e.organization.toLowerCase().replace(/\W+/g, "-"),
    role: e.role,
    organization: e.organization,
    location: e.location,
    when: `${short(e.start)} – ${short(e.end)}`,
    start: toMonth(e.start),
    end: toMonth(e.end),
    summary: e.summary ?? "",
    bullets: e.bullets,
    highlights: e.highlights ?? [],
    tech: e.tech ?? [],
    color: COLORS[(i + 1) % COLORS.length],
  })),
];

const axisStart = Math.min(...entries.map((e) => e.start)) - 2;
const ongoingEnd = Math.max(...entries.map((e) => e.end ?? e.start)) + 3;
const lastStart = Math.max(...entries.map((e) => e.start));
const axisEnd = Math.max(ongoingEnd, lastStart + 6);
const pct = (m: number) => ((m - axisStart) / (axisEnd - axisStart)) * 100;
const years = Array.from(
  { length: Math.floor(axisEnd / 12) - Math.ceil(axisStart / 12) + 1 },
  (_, i) => Math.ceil(axisStart / 12) + i,
);

function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const match = value.match(/^([^\d]*)(\d+)(.*)$/);
    if (!el || !match) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const [, prefix, digits, suffix] = match;
    const target = Number(digits);
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / 900);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = `${prefix}${Math.round(target * eased)}${suffix}`;
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

export function Experience() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const e = entries[active];

  const onKey = (ev: KeyboardEvent) => {
    const dir = ev.key === "ArrowDown" || ev.key === "ArrowRight" ? 1 : ev.key === "ArrowUp" || ev.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    ev.preventDefault();
    const next = (active + dir + entries.length) % entries.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <section id="experience" className="shell scroll-mt-16 py-28 md:py-40">
      <SectionHead
        index="02"
        title="Where I've"
        flourish="worked"
        note="Two internships shipping to production, and now teaching the fundamentals at Rutgers. Pick a stop on the timeline."
      />

      <Reveal>
        <div className="relative mb-14 hidden h-24 md:block" aria-hidden>
          <div className="absolute inset-x-0 top-10 h-px bg-line-2" />
          {years.map((y) => (
            <div key={y} className="absolute top-0 h-full" style={{ left: `${pct(y * 12)}%` }}>
              <div className="h-full w-px bg-line" />
              <span className="absolute -top-1 left-2 font-mono text-xs text-ink-3">{y}</span>
            </div>
          ))}
          {entries.map((x, i) => {
            const left = pct(x.start);
            const right = pct(x.end ?? axisEnd);
            const on = i === active;
            return (
              <button
                key={x.id}
                type="button"
                tabIndex={-1}
                onClick={() => setActive(i)}
                className={`group absolute top-7 h-7 rounded-full border-2 border-ink transition-all duration-500 ease-[cubic-bezier(0.34,1.6,0.5,1)] ${x.color} ${
                  on ? "-translate-y-1.5 shadow-[4px_4px_0_var(--color-ink)]" : "opacity-60 hover:-translate-y-1 hover:opacity-100"
                } ${x.end === null ? "rounded-r-none border-r-0 [mask-image:linear-gradient(to_right,black_70%,transparent)]" : ""}`}
                style={{ left: `${left}%`, width: `${Math.max(right - left, 2)}%` }}
              >
                <span
                  className={`absolute left-0 top-9 whitespace-nowrap font-mono text-xs transition-colors ${
                    on ? "text-ink" : "text-ink-3"
                  }`}
                >
                  {x.organization}
                </span>
              </button>
            );
          })}
        </div>

        <div className="grid gap-10 md:grid-cols-12">
          <div role="tablist" aria-label="Roles" aria-orientation="vertical" className="flex gap-2 overflow-x-auto md:col-span-4 md:flex-col" onKeyDown={onKey}>
            {entries.map((x, i) => {
              const on = i === active;
              return (
                <button
                  key={x.id}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  role="tab"
                  id={`tab-${x.id}`}
                  aria-selected={on}
                  aria-controls={`panel-${x.id}`}
                  tabIndex={on ? 0 : -1}
                  onClick={() => setActive(i)}
                  className={`group relative shrink-0 rounded-2xl border-2 p-5 text-left transition-all duration-300 ${
                    on ? "border-ink bg-bg-2 shadow-[4px_4px_0_var(--color-ink)]" : "border-transparent hover:border-line-2 hover:bg-bg-2/60"
                  }`}
                >
                  <span className={`absolute left-5 top-5 size-2.5 rounded-full ${x.color} ${on ? "" : "opacity-50"}`} />
                  <span className="block pl-5 font-mono text-xs text-ink-3">{x.when}</span>
                  <span className="mt-2 block font-display text-xl font-semibold tracking-tight">{x.role}</span>
                  <span className="mt-1 block text-sm text-ink-2">{x.organization}</span>
                </button>
              );
            })}
          </div>

          <div
            key={e.id}
            role="tabpanel"
            id={`panel-${e.id}`}
            aria-labelledby={`tab-${e.id}`}
            className="md:col-span-8 [animation:pop-in_0.5s_var(--ease-out-expo)_backwards]"
          >
            <div className="flex flex-wrap items-start justify-between gap-8">
              <div>
                <p className="font-mono text-sm text-accent">
                  {e.when}
                  {e.location ? ` · ${e.location}` : ""}
                </p>
                <h3 className="mt-3 font-display text-4xl font-semibold tracking-tight md:text-5xl">
                  {e.role} <span className="flourish font-normal text-ink-2">at</span> {e.organization}
                </h3>
                <p className="mt-3 text-lg text-ink-2">{e.summary}</p>
              </div>
              <dl className="flex gap-4">
                {e.highlights.map((h, i) => (
                  <div
                    key={h.label}
                    className={`w-40 rounded-2xl border-2 border-ink p-4 text-[#16130f] shadow-[4px_4px_0_var(--color-ink)] ${COLORS[(i + 1) % COLORS.length]} ${
                      i % 2 ? "rotate-2" : "-rotate-2"
                    }`}
                  >
                    <dd className="font-display text-4xl font-semibold tracking-tight">
                      <CountUp value={h.value} />
                    </dd>
                    <dt className="mt-1 text-xs leading-snug opacity-80">{h.label}</dt>
                  </div>
                ))}
              </dl>
            </div>

            <ul className="mt-10 space-y-4">
              {e.bullets.map((b, i) => (
                <li
                  key={b}
                  className="flex gap-4 rounded-2xl border border-line p-5 leading-relaxed text-ink-2 transition-colors [animation:pop-in_0.5s_var(--ease-out-expo)_backwards] hover:border-ink hover:text-ink"
                  style={{ animationDelay: `${120 + i * 70}ms` }}
                >
                  <span className="font-mono text-xs text-accent">0{i + 1}</span>
                  {b}
                </li>
              ))}
            </ul>

            {e.tech.length ? (
              <ul className="mt-8 flex flex-wrap gap-2">
                {e.tech.map((t) => (
                  <TechChip key={t} name={t} />
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
