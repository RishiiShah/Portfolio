"use client";

import { ArrowUpRight, Plus } from "lucide-react";
import { useState } from "react";
import { projects, type Project } from "@/data";
import { cn } from "@/lib/utils";

const LINK_LABEL = { demo: "Live", source: "Source", paper: "Paper", blog: "Writeup" } as const;
const FILTERS = ["All", ...Array.from(new Set(projects.flatMap((p) => p.tags)))];

export function WorkIndex() {
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState<string | null>(null);
  const shown = filter === "All" ? projects : projects.filter((p) => p.tags.includes(filter));

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
            className={cn(
              "label h-8 border px-3 transition-colors",
              filter === f
                ? "border-ink bg-ink text-bg"
                : "border-line text-ink-2 hover:border-ink hover:text-ink"
            )}
          >
            {f}
            <span className="ml-1.5 opacity-50">
              {f === "All" ? projects.length : projects.filter((p) => p.tags.includes(f)).length}
            </span>
          </button>
        ))}
      </div>

      <ol className="mt-8 border-b border-line">
        {shown.map((p) => (
          <ProjectRow
            key={p.slug}
            project={p}
            index={projects.indexOf(p) + 1}
            open={open === p.slug}
            onToggle={() => setOpen(open === p.slug ? null : p.slug)}
          />
        ))}
      </ol>
    </div>
  );
}

function ProjectRow({
  project: p,
  index,
  open,
  onToggle,
}: {
  project: Project;
  index: number;
  open: boolean;
  onToggle: () => void;
}) {
  const panelId = `project-${p.slug}`;
  const badge = p.latest ? "Latest" : p.links?.some((l) => l.type === "paper") ? "Published" : null;

  return (
    <li className={cn("border-t border-line transition-colors", open && "bg-bg-2/60")}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        className="group grid w-full grid-cols-[2.5rem_1fr_auto] items-center gap-x-4 py-5 text-left md:grid-cols-[3rem_1fr_14rem_4rem_2rem] md:px-3"
      >
        <span className="font-mono text-xs text-ink-3">{String(index).padStart(2, "0")}</span>
        <span className="min-w-0">
          <span className="wide block text-lg font-semibold tracking-tight transition-colors group-hover:text-accent md:text-2xl">
            {p.title}
            {badge && (
              <span className="label ml-3 inline-block translate-y-[-3px] border border-accent px-1.5 py-0.5 align-middle text-[9px] text-accent">
                {badge}
              </span>
            )}
          </span>
          <span className="mt-1 block truncate text-sm text-ink-3 md:hidden">{p.tags.join(" · ")}</span>
        </span>
        <span className="label hidden truncate text-ink-3 md:block">{p.tags.join(" · ")}</span>
        <span className="hidden font-mono text-xs text-ink-2 md:block">{p.year}</span>
        <Plus
          size={18}
          aria-hidden
          className={cn("justify-self-end transition-transform duration-500", open && "rotate-45 text-accent")}
        />
      </button>

      <div id={panelId} className="expander" data-open={open}>
        <div inert={!open}>
          <div className="grid gap-8 pb-10 md:grid-cols-[3rem_1fr] md:px-3">
            <div className="hidden md:block" />
            <div className="space-y-8">
              <p className="max-w-3xl text-lg leading-snug md:text-xl">{p.tagline}</p>

              {p.metrics && (
                <dl className="grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-3 lg:grid-cols-4">
                  {p.metrics.map((m) => (
                    <div key={m.label} className="flex flex-col-reverse bg-bg p-4">
                      <dt className="label mt-1 text-ink-3">{m.label}</dt>
                      <dd className="wide text-lg font-bold tracking-tight">{m.value}</dd>
                    </div>
                  ))}
                </dl>
              )}

              <div className="grid gap-8 text-[15px] leading-relaxed text-ink-2 lg:grid-cols-2">
                {p.problem && <Block title="Problem">{p.problem}</Block>}
                {p.role ? <Block title="My role">{p.role}</Block> : p.impact && <Block title="Impact">{p.impact}</Block>}
                {p.architectureNotes && <List title="How it works" items={p.architectureNotes} />}
                {p.challenges && <List title="Hard parts" items={p.challenges} />}
                {p.lessons && <List title="What I learned" items={p.lessons} />}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <ul className="flex flex-wrap gap-1.5">
                  {p.tech.map((t) => (
                    <li key={t} className="label border border-line px-2 py-1 text-ink-2">
                      {t}
                    </li>
                  ))}
                </ul>
                {p.links && p.links.length > 0 && (
                  <div className="flex gap-2">
                    {p.links.map((l) => (
                      <a
                        key={l.url}
                        href={l.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-9 items-center gap-1.5 bg-ink px-4 text-sm font-medium text-bg transition-colors hover:bg-accent hover:text-accent-ink"
                      >
                        {LINK_LABEL[l.type]} <ArrowUpRight size={14} />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="label mb-2 text-ink">{title}</h4>
      <p>{children}</p>
    </div>
  );
}

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="label mb-2 text-ink">{title}</h4>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="relative pl-4 before:absolute before:left-0 before:top-[0.7em] before:h-px before:w-2 before:bg-accent">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
