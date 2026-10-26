"use client";

import { useState } from "react";
import { projects, type Project, type ProjectLink } from "@/data";
import { SectionHead } from "@/components/SectionHead";
import { Reveal } from "@/components/Reveal";

const LINK_LABEL: Record<ProjectLink["type"], string> = {
  demo: "Live site",
  video: "Watch demo",
  source: "Source",
  paper: "Paper",
  blog: "Write-up",
};

const caseStudies = projects.filter((p): p is Project & Required<Pick<Project, "caseStudy">> => !!p.caseStudy);
const others = projects.filter((p) => !p.caseStudy);

function Row({ project, index, open, onToggle }: { project: Project; index: number; open: boolean; onToggle: () => void }) {
  const cs = project.caseStudy!;
  const panelId = `case-${project.slug}`;
  return (
    <li className="border-b border-line">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        className="group grid w-full grid-cols-[3rem_1fr_auto] items-baseline gap-4 py-7 text-left md:grid-cols-[5rem_1fr_16rem_5rem_2rem] md:py-9"
      >
        <span className="font-mono text-sm text-ink-3 transition-colors group-hover:text-accent">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span>
          <span className="block font-display text-[clamp(2rem,5vw,4.25rem)] font-semibold leading-none tracking-tight transition-transform duration-500 ease-out-expo group-hover:translate-x-3">
            {project.title.split(/:| & | via /)[0]}
          </span>
          {project.award ? (
            <span className="mt-3 inline-flex items-center gap-2 rounded-full border border-accent/40 px-3 py-1 text-xs text-accent">
              ✦ {project.award}
            </span>
          ) : null}
        </span>
        <span className="hidden text-sm text-ink-2 md:block">{project.tags.join(" / ")}</span>
        <span className="hidden font-mono text-sm text-ink-3 md:block">{project.year}</span>
        <span
          aria-hidden
          className={`grid size-8 place-items-center rounded-full border border-line-2 text-lg transition-all duration-500 ${
            open ? "rotate-45 border-accent bg-accent text-accent-ink" : "group-hover:border-ink"
          }`}
        >
          +
        </span>
      </button>

      <div
        id={panelId}
        className={`grid transition-[grid-template-rows] duration-700 ease-out-expo ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden" inert={!open}>
          <div className="grid gap-10 pb-12 md:grid-cols-[5rem_1fr]">
            <span />
            <div>
              <p className="max-w-3xl text-xl leading-snug text-ink-2">{project.tagline}</p>
              <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
                {(
                  [
                    ["The problem", cs.problem],
                    ["What I built", cs.built],
                    ["What came of it", cs.result],
                  ] as const
                ).map(([k, v], i) => (
                  <div key={k} className={`p-6 md:p-8 ${i === 2 ? "bg-accent text-accent-ink" : "bg-bg-2"}`}>
                    <p className={`label ${i === 2 ? "!text-accent-ink/70" : ""}`}>{k}</p>
                    <p className="mt-4 text-lg leading-snug">{v}</p>
                  </div>
                ))}
              </div>

              {project.metrics?.length ? (
                <dl className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
                  {project.metrics.slice(0, 4).map((m) => (
                    <div key={m.label}>
                      <dt className="label">{m.label}</dt>
                      <dd className="mt-2 font-display text-2xl font-medium tracking-tight">{m.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}

              <div className="mt-10 flex flex-wrap items-center justify-between gap-6">
                <ul className="flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <li key={t} className="rounded-full bg-bg-3 px-3 py-1 font-mono text-xs text-ink-2">
                      {t}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-3">
                  {project.links?.map((l) => (
                    <a
                      key={l.url}
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-10 items-center rounded-full border border-line-2 px-4 text-sm transition-colors hover:border-accent hover:text-accent"
                    >
                      {LINK_LABEL[l.type]} ↗
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

export function Work() {
  const [open, setOpen] = useState<string | null>(caseStudies[0]?.slug ?? null);

  return (
    <section id="work" className="shell scroll-mt-16 py-28 md:py-40">
      <SectionHead
        index="01"
        title="Selected work"
        note="Two hackathon wins, three published papers, and the projects that taught me the most. Open any row."
      />
      <Reveal>
        <ul>
          {caseStudies.map((p, i) => (
            <Row
              key={p.slug}
              project={p}
              index={i}
              open={open === p.slug}
              onToggle={() => setOpen(open === p.slug ? null : p.slug)}
            />
          ))}
        </ul>
      </Reveal>

      <Reveal className="mt-20">
        <p className="label mb-6">Also built</p>
        <ul className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {others.map((p) => {
            const href = p.links?.[0]?.url;
            const body = (
              <>
                <span className="font-mono text-xs text-ink-3">{p.year}</span>
                <span className="mt-3 block font-display text-xl font-medium tracking-tight">{p.title}</span>
                <span className="mt-2 block text-sm text-ink-2">{p.tagline}</span>
              </>
            );
            return (
              <li key={p.slug} className="bg-bg-2">
                {href ? (
                  <a href={href} target="_blank" rel="noopener noreferrer" className="block h-full p-6 transition-colors hover:bg-bg-3">
                    {body}
                  </a>
                ) : (
                  <div className="h-full p-6">{body}</div>
                )}
              </li>
            );
          })}
        </ul>
      </Reveal>
    </section>
  );
}
