"use client";

import { useEffect, useRef, useState } from "react";
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

const FILTERS = [
  { label: "Everything", tags: [] },
  { label: "Full-stack", tags: ["Full-stack"] },
  { label: "Backend & systems", tags: ["Backend", "Systems", "Developer Tools"] },
  { label: "AI / ML", tags: ["AI/ML", "MLOps"] },
  { label: "Research", tags: ["Research"] },
] as const;

const PREVIEW_COLORS = ["bg-sun", "bg-mint", "bg-accent", "bg-cobalt !text-white"];

function Row({
  project,
  index,
  open,
  onToggle,
  onHover,
}: {
  project: Project;
  index: number;
  open: boolean;
  onToggle: () => void;
  onHover: (slug: string | null) => void;
}) {
  const cs = project.caseStudy!;
  const panelId = `case-${project.slug}`;
  return (
    <li
      className="border-b border-line [animation:pop-in_0.6s_var(--ease-out-expo)_backwards]"
      style={{ animationDelay: `${index * 60}ms` }}
      onPointerEnter={(e) => e.pointerType === "mouse" && onHover(project.slug)}
      onPointerLeave={() => onHover(null)}
    >
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

function CursorPreview({ project, visible, color }: { project: Project | null; visible: boolean; color: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let x = -999;
    let y = -999;
    let tx = x;
    let ty = y;
    const tick = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      const tilt = Math.max(-10, Math.min(10, (tx - x) * 0.15));
      el.style.transform = `translate(${x}px, ${y}px) rotate(${tilt}deg)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.3 ? requestAnimationFrame(tick) : 0;
    };
    const onMove = (e: PointerEvent) => {
      tx = e.clientX + 24;
      ty = e.clientY + 24;
      if (x < -900) {
        x = tx;
        y = ty;
      }
      if (!raf) raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  const metrics = project?.metrics?.slice(0, 2) ?? [];
  return (
    <div ref={ref} aria-hidden className="pointer-events-none fixed left-0 top-0 z-40 hidden md:block">
      <div
        className={`w-72 origin-top-left rounded-2xl border-2 border-ink p-5 text-[#16130f] shadow-[6px_6px_0_var(--color-ink)] transition-[opacity,scale] duration-300 ease-[cubic-bezier(0.34,1.6,0.5,1)] ${color} ${
          project && visible ? "scale-100 opacity-100" : "scale-75 opacity-0"
        }`}
      >
        {project ? (
          <>
            <p className="font-mono text-[0.65rem] uppercase tracking-wider opacity-70">What came of it</p>
            <p className="mt-2 font-display text-lg font-semibold leading-snug tracking-tight">{project.caseStudy?.result}</p>
            {metrics.length ? (
              <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-current/20 pt-3">
                {metrics.map((m) => (
                  <div key={m.label}>
                    <dt className="text-[0.65rem] uppercase tracking-wider opacity-70">{m.label}</dt>
                    <dd className="font-display font-semibold">{m.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
            <p className="flourish mt-4 text-base opacity-80">click to open the story →</p>
          </>
        ) : null}
      </div>
    </div>
  );
}

export function Work() {
  const [open, setOpen] = useState<string | null>(caseStudies[0]?.slug ?? null);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["label"]>("Everything");
  const [hover, setHover] = useState<{ slug: string | null; on: boolean }>({ slug: null, on: false });
  const onHover = (slug: string | null) => setHover((h) => (slug ? { slug, on: true } : { ...h, on: false }));

  const active = FILTERS.find((f) => f.label === filter)!;
  const shown = caseStudies.filter(
    (p) => active.tags.length === 0 || p.tags.some((t) => (active.tags as readonly string[]).includes(t)),
  );
  const hoveredIndex = shown.findIndex((p) => p.slug === hover.slug);
  const previewProject = shown[hoveredIndex] ?? null;
  const previewOn = hover.on && hover.slug !== open;

  return (
    <section id="work" className="shell scroll-mt-16 py-28 md:py-40">
      <SectionHead
        index="01"
        title="Things I've"
        flourish="built"
        note="Problems I couldn't leave alone, including two hackathon wins. Hover for the punchline, click for the story."
      />
      <Reveal>
        <div className="mb-8 flex flex-wrap items-center gap-2" role="group" aria-label="Filter projects">
          {FILTERS.map((f) => {
            const count = caseStudies.filter(
              (p) => f.tags.length === 0 || p.tags.some((t) => (f.tags as readonly string[]).includes(t)),
            ).length;
            const on = f.label === filter;
            return (
              <button
                key={f.label}
                type="button"
                aria-pressed={on}
                onClick={() => setFilter(f.label)}
                className={`inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm transition-all duration-300 ${
                  on
                    ? "-rotate-2 border-ink bg-ink text-bg shadow-[3px_3px_0_var(--color-accent)]"
                    : "border-line-2 text-ink-2 hover:-translate-y-0.5 hover:border-ink hover:text-ink"
                }`}
              >
                {f.label}
                <span className={`font-mono text-xs ${on ? "text-accent" : "text-ink-3"}`}>{count}</span>
              </button>
            );
          })}
        </div>
        <ul key={filter}>
          {shown.map((p, i) => (
            <Row
              key={p.slug}
              project={p}
              index={i}
              open={open === p.slug}
              onToggle={() => setOpen(open === p.slug ? null : p.slug)}
              onHover={onHover}
            />
          ))}
        </ul>
      </Reveal>
      <CursorPreview
        project={previewProject}
        visible={previewOn}
        color={PREVIEW_COLORS[Math.max(0, hoveredIndex) % PREVIEW_COLORS.length]}
      />

      <Reveal className="mt-20">
        <p className="flourish mb-6 text-3xl text-ink-2">Plus a few earlier experiments</p>
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
