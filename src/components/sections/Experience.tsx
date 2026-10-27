"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import { education, experience, teaching } from "@/data";
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

const study = education.map((ed) => ({
  id: ed.degree,
  label: ed.degree.startsWith("M.S.") ? "M.S. Computer Science" : "B.Tech AI & Data Sci.",
  place: ed.institution.split(" - ")[0],
  start: toMonth(ed.start),
  end: toMonth(ed.end),
}));
const [masters, bachelors] = study;

const axisStart = Math.min(...entries.map((e) => e.start)) - 3;
const axisEnd = Math.max(...study.map((s) => s.end), ...entries.map((e) => e.end ?? 0)) + 2;
const clamp = (n: number) => Math.min(100, Math.max(0, n));
const pct = (m: number) => clamp(((m - axisStart) / (axisEnd - axisStart)) * 100);
const months = Array.from({ length: axisEnd - axisStart + 1 }, (_, i) => axisStart + i);
const duration = (start: number, end: number) => {
  const n = end - start + 1;
  return n < 12 ? `${n} mo` : `${Math.floor(n / 12)} yr${n % 12 ? ` ${n % 12} mo` : ""}`;
};

const noop = () => () => {};
const useNowMonth = () =>
  useSyncExternalStore(
    noop,
    () => {
      const d = new Date();
      return d.getFullYear() * 12 + d.getMonth();
    },
    () => null,
  );

function Timeline({ active, onPick }: { active: number; onPick: (i: number) => void }) {
  const now = useNowMonth();
  const movePct = (pct(bachelors.end) + pct(masters.start)) / 2;

  return (
    <div className="mb-16 hidden grid-cols-[4.5rem_1fr] md:grid" aria-hidden>
      <div className="label relative">
        <span className="absolute top-[3.6rem]">Work</span>
        <span className="absolute top-[9.1rem]">Study</span>
      </div>

      <div className="relative h-[11.5rem]">
        {months.map((m) => {
          const year = m % 12 === 0;
          return (
            <div key={m} className="absolute top-6 h-full" style={{ left: `${pct(m)}%` }}>
              {year ? (
                <>
                  <div className="absolute top-0 h-[calc(100%-1.5rem)] w-px bg-line" />
                  <span className="absolute -top-6 left-2 font-mono text-xs text-ink-3">{m / 12}</span>
                </>
              ) : (
                <div className="absolute top-0 size-[3px] -translate-x-1/2 rounded-full bg-line-2" />
              )}
            </div>
          );
        })}

        {now !== null && now >= axisStart && now <= axisEnd ? (
          <div className="absolute top-3 h-[calc(100%-0.75rem)]" style={{ left: `${pct(now)}%` }}>
            <div className="absolute inset-y-0 w-px -translate-x-1/2 bg-accent/60" />
            <span className="absolute -top-1 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-accent px-2 py-0.5 font-mono text-[0.62rem] uppercase tracking-wider text-accent-ink">
              <span className="relative flex size-1.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-accent-ink/60" />
                <span className="relative size-1.5 rounded-full bg-accent-ink" />
              </span>
              now
            </span>
          </div>
        ) : null}

        {entries.map((x, i) => {
          const left = pct(x.start);
          const end = x.end ?? axisEnd;
          const right = pct(end);
          const on = i === active;
          const ongoing = x.end === null;
          // An ongoing role stays solid up to today, then fades towards the end of the axis.
          const solid = ongoing ? clamp((((now ?? x.start + 2) - x.start) / (end - x.start)) * 100) : 100;
          return (
            <button
              key={x.id}
              type="button"
              tabIndex={-1}
              onClick={() => onPick(i)}
              data-cursor={on ? undefined : "view"}
              className={`group absolute top-[3.25rem] h-8 transition-transform duration-500 ease-[cubic-bezier(0.34,1.6,0.5,1)] ${
                on ? "-translate-y-1.5" : "hover:-translate-y-1"
              }`}
              style={{ left: `${left}%`, width: `${Math.max(right - left, 2)}%` }}
            >
              <span className="grow-x block h-full" style={{ ["--d" as string]: `${300 + (entries.length - i) * 120}ms` }}>
                <span
                  className={`block h-full rounded-full border-2 border-ink transition-[box-shadow,opacity] duration-500 ${x.color} ${
                    on ? "shadow-[4px_4px_0_var(--color-ink)]" : "opacity-55 group-hover:opacity-100"
                  } ${ongoing ? "rounded-r-none border-r-0" : ""}`}
                  style={{ maskImage: ongoing ? `linear-gradient(to right, black ${solid}%, transparent)` : undefined }}
                />
              </span>
              <span className="pointer-events-none absolute bottom-full left-0 mb-2 whitespace-nowrap rounded-lg bg-ink px-2.5 py-1 text-xs text-bg opacity-0 transition-[opacity,translate] duration-300 group-hover:-translate-y-0.5 group-hover:opacity-100">
                {x.role}
              </span>
              <span className="absolute left-0 top-10 flex flex-col items-start whitespace-nowrap font-mono text-xs leading-relaxed">
                <span className={`transition-colors ${on ? "font-semibold text-ink" : "text-ink-3"}`}>{x.organization}</span>
                <span className="text-[0.65rem] text-ink-3">
                  {ongoing ? `${duration(x.start, now ?? x.start)} so far` : duration(x.start, x.end!)}
                </span>
              </span>
            </button>
          );
        })}

        {study.map((s, i) => {
          const left = pct(s.start);
          const right = pct(s.end);
          const clipped = s.start < axisStart;
          return (
            <div
              key={s.id}
              className="absolute top-[8.75rem] h-7"
              style={{ left: `${left}%`, width: `${right - left}%` }}
            >
              <div
                className={`grow-x flex h-full items-center gap-2 overflow-hidden whitespace-nowrap rounded-full border-[1.5px] border-dashed border-ink-3 px-3 text-xs ${
                  clipped ? "rounded-l-none border-l-0 justify-end" : ""
                }`}
                style={{
                  ["--d" as string]: `${150 + i * 120}ms`,
                  maskImage: clipped ? "linear-gradient(to right, transparent, black 10%)" : undefined,
                }}
              >
                <span className="font-medium text-ink-2">{s.label}</span>
                <span className="font-mono text-ink-3">{s.place}</span>
              </div>
            </div>
          );
        })}

        <span
          className="flourish absolute top-[10.9rem] -translate-x-1/2 whitespace-nowrap text-sm text-ink-2"
          style={{ left: `${movePct}%` }}
        >
          ✈ Mumbai → NJ
        </span>
      </div>
    </div>
  );
}

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
        <Timeline active={active} onPick={setActive} />

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
