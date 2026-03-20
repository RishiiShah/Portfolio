"use client";
import { useState } from "react";
import { experiences } from "@/data/experience";
import { FiBriefcase, FiCalendar, FiMapPin, FiArrowRight, FiActivity, FiCode, FiZap } from "react-icons/fi";
import { RevealOnScroll } from "@/components/RevealOnScroll";

const monthIndex: Record<string, number> = {
  january: 0,
  february: 1,
  march: 2,
  april: 3,
  may: 4,
  june: 5,
  july: 6,
  august: 7,
  september: 8,
  october: 9,
  november: 10,
  december: 11,
};

function parseMonthYear(value: string) {
  const [monthRaw, yearRaw] = value.split(" ");
  const month = monthIndex[monthRaw.toLowerCase()] ?? 0;
  const year = Number(yearRaw);
  return { month, year };
}

function durationInMonths(start: string, end: string) {
  const s = parseMonthYear(start);
  const e = parseMonthYear(end);
  return Math.max(0, (e.year - s.year) * 12 + (e.month - s.month) + 1);
}

function compactDuration(months: number) {
  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  if (years > 0 && remMonths > 0) return `${years}y ${remMonths}m`;
  if (years > 0) return `${years}y`;
  return `${remMonths}m`;
}

export default function ExperiencePage() {
  const totalMonths = experiences.reduce((sum, exp) => sum + durationInMonths(exp.start, exp.end), 0);
  const totalHighlights = experiences.reduce((sum, exp) => sum + exp.bullets.length, 0);
  const [openStory, setOpenStory] = useState<number | null>(0);

  const chapterTags = [
    ["APIs", "Reliability", "Deployment"],
    ["Performance", "Integration", "Refactor"],
  ];

  return (
    <main className="pb-12 sm:pb-16 lg:pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-12">
        <h1 className="text-xl sm:text-2xl font-semibold animate-fade-in-up md:w-[28%]">Professional Experience</h1>
        <div className="hidden md:block flex-1 border-b border-foreground/10 animate-fade-in-up" />
      </div>

      <section className="mb-8 sm:mb-12 animate-fade-in-up delay-200">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-4 sm:gap-5">
          <div className="card relative overflow-hidden border border-accent/20 p-5 sm:p-6 bg-[radial-gradient(circle_at_15%_15%,rgba(29,174,197,0.2),transparent_45%),linear-gradient(140deg,rgba(29,174,197,0.09),rgba(29,174,197,0.01)_55%,transparent)]">
            <p className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.22em] text-accent/90">Build Stories</p>
            <h2 className="mt-3 text-2xl sm:text-3xl lg:text-[2.3rem] leading-tight font-semibold tracking-tight max-w-xl text-foreground">
              Not a timeline. A set of shipped chapters.
            </h2>
            <p className="mt-4 text-sm sm:text-base text-foreground/75 leading-relaxed max-w-2xl">
              I work where product clarity meets backend execution: APIs, performance, reliability, and delivery under constraints.
            </p>

            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-[10px] font-mono uppercase tracking-widest">
              <div className="rounded-md border border-foreground/10 bg-foreground/[0.02] px-3 py-2.5 text-foreground/70">
                <span className="text-foreground/40">Roles</span>
                <div className="mt-1 text-sm tracking-normal font-semibold text-foreground">{experiences.length}</div>
              </div>
              <div className="rounded-md border border-foreground/10 bg-foreground/[0.02] px-3 py-2.5 text-foreground/70">
                <span className="text-foreground/40">Delivery Time</span>
                <div className="mt-1 text-sm tracking-normal font-semibold text-foreground">{compactDuration(totalMonths)}</div>
              </div>
              <div className="rounded-md border border-foreground/10 bg-foreground/[0.02] px-3 py-2.5 text-foreground/70">
                <span className="text-foreground/40">Highlights</span>
                <div className="mt-1 text-sm tracking-normal font-semibold text-foreground">{totalHighlights}</div>
              </div>
              <div className="rounded-md border border-foreground/10 bg-foreground/[0.02] px-3 py-2.5 text-foreground/70">
                <span className="text-foreground/40">Focus</span>
                <div className="mt-1 text-sm tracking-normal font-semibold text-foreground">Backend + Systems</div>
              </div>
            </div>
          </div>

          <div className="card border border-foreground/10 bg-foreground/[0.015] p-4 sm:p-5">
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-foreground/45">Working Signature</p>
            <div className="mt-3 rounded-md border border-foreground/10 bg-background/70 p-3.5 font-mono text-xs leading-relaxed text-foreground/70">
              <p><span className="text-accent">type</span> DeliveryPlan = &#123;</p>
              <p className="pl-4">goal: string;</p>
              <p className="pl-4">constraints: string[];</p>
              <p className="pl-4">rollout: &quot;canary&quot; | &quot;full&quot;;</p>
              <p className="pl-4">observability: &#123; metrics: boolean; logs: boolean; alerts: boolean &#125;;</p>
              <p>&#125;;</p>
              <br />
              <p><span className="text-accent">const</span> execute = <span className="text-accent">async</span> (plan: DeliveryPlan) =&gt; &#123;</p>
              <p className="pl-4"><span className="text-accent">const</span> baseline = <span className="text-accent">await</span> profile(plan.goal);</p>
              <p className="pl-4"><span className="text-accent">const</span> candidate = <span className="text-accent">await</span> ship(plan, &#123; testCoverage: <span className="text-accent/90">true</span> &#125;);</p>
              <p className="pl-4"><span className="text-accent">const</span> delta = compare(baseline, candidate);</p>
              <p className="pl-4"><span className="text-accent">if</span> (delta.regression) <span className="text-accent">return</span> rollback(candidate.id);</p>
              <p className="pl-4"><span className="text-accent">return</span> promote(candidate.id);</p>
              <p>&#125;;</p>
            </div>
          </div>
        </div>
      </section>
      
      {experiences.length === 0 ? (
        <p className="mt-4 text-xs sm:text-sm text-foreground/70 animate-fade-in-up delay-200">No experience added yet.</p>
      ) : (
        <section className="mt-8 sm:mt-10 animate-fade-in-up delay-300">
          <div className="space-y-4 sm:space-y-5">
            {experiences.map((exp, index) => (
              <RevealOnScroll
                key={`${exp.organization}-${exp.start}`}
                direction={index % 2 === 0 ? "left" : "right"}
                delay={120 + index * 120}
              >
                <article className="group">
                <div className="card relative border border-foreground/10 hover:border-accent/45 transition-all duration-500 overflow-hidden hover:shadow-[0_18px_40px_-20px_var(--accent-glow)]">
                  <div className="pointer-events-none absolute -top-24 right-[-10%] h-56 w-56 rounded-full bg-accent/15 blur-3xl opacity-35 transition-opacity duration-300 group-hover:opacity-60" />
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(29,174,197,0.1),transparent_38%,rgba(29,174,197,0.06))] opacity-75" />
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-accent via-accent/25 to-transparent" />
                    <div className="pl-4 sm:pl-5 pr-4 sm:pr-6 py-4 sm:py-5">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="mb-2 flex flex-wrap items-center gap-2 text-[10px] font-mono uppercase tracking-widest">
                            <span className="inline-flex items-center rounded-md border border-accent/30 bg-accent/10 px-2 py-1 text-accent">
                              CHAPTER {String(index + 1).padStart(2, "0")}
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-foreground/55">
                              <FiBriefcase className="h-3.5 w-3.5" aria-hidden="true" />
                              {exp.organization}
                            </span>
                          </div>

                          <h2 className="font-bold text-lg sm:text-xl leading-tight text-foreground group-hover:text-accent transition-colors duration-300">
                            {exp.role}
                          </h2>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs text-foreground/70 font-mono">
                          <span className="inline-flex items-center gap-1.5 rounded-md border border-foreground/10 bg-foreground/[0.02] px-2.5 py-1.5">
                            <FiCalendar className="h-3.5 w-3.5 text-foreground/40" aria-hidden="true" />
                            {exp.start} &ndash; {exp.end}
                          </span>
                          {exp.location && (
                            <span className="inline-flex items-center gap-1.5 rounded-md border border-foreground/10 bg-foreground/[0.02] px-2.5 py-1.5">
                              <FiMapPin className="h-3.5 w-3.5 text-foreground/40" aria-hidden="true" />
                              {exp.location}
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="mt-3 text-sm sm:text-[15px] text-foreground/75 leading-relaxed max-w-3xl">
                        {exp.summary}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {(chapterTags[index] ?? chapterTags[chapterTags.length - 1]).map((tag) => (
                          <span key={`${exp.organization}-${tag}`} className="inline-flex items-center rounded-full border border-accent/20 bg-accent/10 px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-accent/90">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-foreground/10 pt-3">
                        <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-widest text-foreground/45">
                          <span className="inline-flex items-center gap-1.5">
                            <FiCode className="h-3.5 w-3.5" aria-hidden="true" />
                            {compactDuration(durationInMonths(exp.start, exp.end))}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <FiActivity className="h-3.5 w-3.5" aria-hidden="true" />
                            {exp.bullets.length} highlights
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => setOpenStory((prev) => (prev === index ? null : index))}
                          className="inline-flex items-center gap-2 rounded-md border border-accent/30 bg-accent/10 px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-accent transition-all duration-200 hover:bg-accent/20 hover:border-accent/50"
                          aria-expanded={openStory === index}
                        >
                          <FiZap className="h-3.5 w-3.5" aria-hidden="true" />
                          {openStory === index ? "Hide Highlights" : "Read Highlights"}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`grid transition-all duration-500 ease-out ${openStory === index ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                  >
                    <div className="overflow-hidden">
                      <div className="border-t border-foreground/10 bg-foreground/[0.015] px-4 sm:px-6 py-4 sm:py-5">
                        <div>
                          <div className="mb-3 flex items-center gap-2 text-[10px] sm:text-[11px] uppercase tracking-widest text-foreground/45 font-mono">
                            <FiActivity className="h-3.5 w-3.5" aria-hidden="true" /> Execution Highlights
                          </div>
                          <ul className="space-y-2.5">
                            {exp.bullets.map((bullet, bulletIndex) => (
                              <li key={bulletIndex} className="text-sm text-foreground/70 leading-relaxed flex gap-2.5 group/bullet items-start">
                                <FiArrowRight className="h-3.5 w-3.5 text-accent mt-0.5 shrink-0 opacity-70 group-hover/bullet:translate-x-0.5 transition-transform duration-200" aria-hidden="true" />
                                <span className="group-hover/bullet:text-foreground/90 transition-colors duration-200">{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  </div>
                </article>
              </RevealOnScroll>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
