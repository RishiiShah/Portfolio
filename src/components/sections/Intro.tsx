"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { bio, education, experience, projects, publications } from "@/data";
import { toIsoDate } from "@/lib/dates";
import { CountUp, ScrubText } from "../anim";

const KEYWORDS = ["Backend systems", "Computer vision", "Generative models", "Developer tools", "Applied AI"];

// Projects per year, oldest first.
const years = Array.from(new Set(projects.map((p) => p.year ?? ""))).filter(Boolean).sort();
const perYear = years.map((y) => ({ year: y, count: projects.filter((p) => p.year === y).length }));
const maxPerYear = Math.max(...perYear.map((y) => y.count));

// Internships on a month axis spanning the calendar years they cover.
const monthIndex = (d: string) => {
  const [y, m] = toIsoDate(d).split("-").map(Number);
  return y * 12 + (m ?? 1) - 1;
};
const jobs = [...experience].reverse();
const axisStart = Math.floor(monthIndex(jobs[0].start) / 12) * 12;
const axisEnd = (Math.floor(monthIndex(jobs[jobs.length - 1].end) / 12) + 1) * 12;
const axisYears = Array.from({ length: (axisEnd - axisStart) / 12 }, (_, i) => axisStart / 12 + i);

const gpa = Number(education[0].gpa.split(" ")[0]);
const pubs = [...publications].sort((a, b) => a.year - b.year);

export function Intro() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const st = { trigger: ".intro-table", start: "top 80%" };
      gsap.from(".intro-sheet", {
        y: 80,
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 95%" },
      });
      gsap.from(".intro-cell", { y: 30, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.08, scrollTrigger: st });
      gsap.from(".intro-bar-y", { scaleY: 0, duration: 1, ease: "expo.out", stagger: 0.05, delay: 0.3, scrollTrigger: st });
      gsap.from(".intro-bar-x", { scaleX: 0, duration: 1.2, ease: "expo.out", stagger: 0.1, delay: 0.3, scrollTrigger: st });
      gsap.from(".intro-dot", { scale: 0, duration: 0.6, ease: "back.out(2)", stagger: 0.1, delay: 0.4, scrollTrigger: st });
      gsap.from(".intro-kw", { y: 16, opacity: 0, duration: 0.6, ease: "power3.out", stagger: 0.05, scrollTrigger: { trigger: ".intro-kws", start: "top 90%" } });
    },
    { scope: root }
  );

  return (
    <section ref={root} data-shape="0" className="relative z-10">
      <div className="intro-sheet graph-paper border-t border-line bg-bg px-[max(1rem,4vw)] pt-[6vh] pb-[10vh] shadow-[0_-40px_80px_-20px_rgba(0,0,0,0.35)]">
        <div className="label flex flex-wrap items-center justify-between gap-4 text-ink-3">
          <span>
            <span className="text-accent">(00)</span> Abstract
          </span>
          <span className="hidden sm:inline">{bio.name} · Portfolio, {new Date().getFullYear()}</span>
          <span>p. 01</span>
        </div>

        <div className="mt-[10vh] grid gap-[6vh] md:grid-cols-12 md:gap-x-[min(6vh,3.75vw)]">
          <div className="md:col-span-3">
            <p className="label text-ink-3">Summary</p>
            <p className="mt-3 max-w-[30ch] text-[15px] leading-relaxed text-ink-2">
              M.S. Computer Science, Rutgers. Previously AI &amp; Data Science, University of Mumbai. Two
              engineering internships, {publications.length} papers.
            </p>
          </div>
          <ScrubText
            className="wide text-[clamp(1.9rem,4.4vw,5.25rem)] leading-[1.02] font-semibold tracking-tight md:col-span-9"
            text="I turn research-grade models into software people rely on: YOLO pipelines that issue tickets, and code graphs that feed coding agents."
          />
        </div>

        <div className="intro-kws mt-[8vh] flex flex-wrap items-baseline gap-x-6 gap-y-3 border-y border-line py-4 md:ml-[25%]">
          <span className="label text-ink-3">Keywords:</span>
          {KEYWORDS.map((k, i) => (
            <span key={k} className="intro-kw text-[clamp(1rem,1.3vw,1.3rem)]">
              {k}
              {i < KEYWORDS.length - 1 && <span className="ml-6 text-accent">/</span>}
            </span>
          ))}
        </div>

        <figure className="intro-table mt-[12vh]">
          <div className="grid border-t border-l border-line sm:grid-cols-2 lg:grid-cols-4">
            <Cell value={String(publications.length).padStart(2, "0")} label="Publications" note={pubs.map((p) => p.publisher ?? "Conf.").join(" · ")}>
              <div className="flex items-end gap-3">
                {pubs.map((p, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <span className={`intro-dot block size-5 ${p.authors[0] === bio.name ? "bg-accent" : "border border-ink"}`} />
                    <span className="label text-ink-3">’{String(p.year).slice(2)}</span>
                  </div>
                ))}
                <span className="label ml-auto self-start text-ink-3">
                  <span className="mr-1.5 inline-block size-2 bg-accent" />1st author
                </span>
              </div>
            </Cell>

            <Cell value={String(experience.length).padStart(2, "0")} label="Engineering internships" note={jobs.map((j) => j.organization).join(" · ")}>
              <div>
                <div className="relative h-10 border-b border-line">
                  {jobs.map((j, i) => {
                    const left = ((monthIndex(j.start) - axisStart) / (axisEnd - axisStart)) * 100;
                    const width = ((monthIndex(j.end) - monthIndex(j.start) + 1) / (axisEnd - axisStart)) * 100;
                    return (
                      <span
                        key={j.organization}
                        title={`${j.organization}: ${j.start} to ${j.end}`}
                        className={`intro-bar-x absolute h-3 origin-left ${i === jobs.length - 1 ? "bg-accent" : "bg-ink"}`}
                        style={{ left: `${left}%`, width: `${width}%`, top: i % 2 ? "0.25rem" : "1.5rem" }}
                      />
                    );
                  })}
                </div>
                <div className="label mt-2 flex justify-between text-ink-3">
                  {axisYears.map((y) => (
                    <span key={y}>{y}</span>
                  ))}
                  <span>{axisYears[axisYears.length - 1] + 1}</span>
                </div>
              </div>
            </Cell>

            <Cell value={String(projects.length).padStart(2, "0")} label="Projects shipped" note={`${years[0]} → ${years[years.length - 1]}`}>
              <div className="flex h-14 items-end gap-2">
                {perYear.map((y, i) => (
                  <div key={y.year} className="flex flex-1 flex-col items-center gap-2">
                    <span
                      className={`intro-bar-y block w-full origin-bottom ${i === perYear.length - 1 ? "bg-accent" : "bg-ink"}`}
                      style={{ height: `${(y.count / maxPerYear) * 2.5}rem` }}
                    />
                    <span className="label text-ink-3">’{y.year.slice(2)}</span>
                  </div>
                ))}
              </div>
            </Cell>

            <Cell value={education[0].gpa.split(" ")[0]} label="M.S. GPA" note={`of 4.0 · ${education[0].institution.split(" - ")[0]}`}>
              <div>
                <div className="relative h-3 bg-line">
                  <span className="intro-bar-x absolute inset-y-0 left-0 origin-left bg-accent" style={{ width: `${(gpa / 4) * 100}%` }} />
                </div>
                <div className="label mt-2 flex justify-between text-ink-3">
                  <span>0.0</span>
                  <span>4.0</span>
                </div>
              </div>
            </Cell>
          </div>
          <figcaption className="label mt-4 text-ink-3">
            <span className="text-accent">Table 1.</span> Selected figures, drawn from the record below.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

function Cell({ value, label, note, children }: { value: string; label: string; note: string; children: React.ReactNode }) {
  return (
    <div className="intro-cell flex flex-col gap-6 border-r border-b border-line bg-bg/60 p-[clamp(1.25rem,2vw,2rem)]">
      <div>
        <p className="wide text-[clamp(2.75rem,4.6vw,5rem)] leading-none font-bold tracking-tight">
          <CountUp value={value} />
        </p>
        <p className="label mt-3 text-ink">{label}</p>
        <p className="mt-1 text-sm text-ink-3">{note}</p>
      </div>
      <div className="mt-auto">{children}</div>
    </div>
  );
}
