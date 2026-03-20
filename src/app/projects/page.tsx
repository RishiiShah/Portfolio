"use client";
import { useMemo, useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { projects } from "@/data/projects";
import { TechPills } from "@/components/TechPills";
import type { Tag } from "@/types";
import { DepthButton } from "@/components/ui/DepthButton";
import { IconLinkButton } from "@/components/ui/IconLinkButton";
import { formatLinkLabel, getKnownLinkIcon } from "@/utils/linkIcons";

const allTags: Tag[] = [
  "Systems",
  "Backend",
  "MLOps",
  "Research",
  "Full-stack",
  "Open Source",
];

const tagTone: Record<Tag, string> = {
  Systems: "border-cyan-300/30 bg-cyan-400/[0.08] text-cyan-200",
  Backend: "border-sky-300/30 bg-sky-400/[0.08] text-sky-200",
  MLOps: "border-teal-300/30 bg-teal-400/[0.08] text-teal-200",
  Research: "border-blue-300/30 bg-blue-400/[0.08] text-blue-200",
  "Full-stack": "border-indigo-300/30 bg-indigo-400/[0.08] text-indigo-200",
  "Open Source": "border-emerald-300/30 bg-emerald-400/[0.08] text-emerald-200",
};

function ProjectsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [active, setActive] = useState<Tag | "All">("All");

  // Initialize active filter from URL on mount
  useEffect(() => {
    const tag = searchParams.get("tag");
    if (tag && (tag === "All" || (allTags as string[]).includes(tag))) {
      setActive(tag as Tag | "All");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(
    () => (active === "All" ? projects : projects.filter((p) => p.tags.includes(active))),
    [active]
  );

  // Keep URL in sync when active changes
  useEffect(() => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (active === "All") params.delete("tag"); else params.set("tag", active);
    router.replace(`/projects${params.toString() ? `?${params.toString()}` : ""}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return (
    <main className="pb-12 sm:pb-16 lg:pb-20">
      <section className="relative mb-10 overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(120deg,rgba(20,56,74,0.5),rgba(8,11,15,0.8)_48%,rgba(23,94,111,0.45))] px-4 py-8 sm:px-8 sm:py-10">
        <div className="absolute -left-16 top-12 h-52 w-52 rounded-full bg-cyan-300/10 blur-3xl" />
        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-blue-300/10 blur-3xl" />
        <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="animate-fade-in-up">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.36em] text-accent/80">Projects / Studio Wall</p>
            <h1 className="max-w-3xl text-3xl font-black leading-[0.94] text-foreground sm:text-5xl lg:text-6xl">
              Built to ship hard problems, not list bullet points.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-foreground/70 sm:text-base">
              Each card is a build log: constraints, architecture pressure, impact, and how the system survived production reality.
            </p>
          </div>
          <div className="animate-fade-in-up rounded-2xl border border-white/10 bg-black/20 p-4 backdrop-blur-sm delay-200">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-foreground/60">Curated Signal</p>
            <div className="mt-3 flex items-end justify-between border-b border-white/10 pb-4">
              <span className="font-mono text-5xl font-semibold text-accent">{filtered.length}</span>
              <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-foreground/45">Visible Projects</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-foreground/65">
              Filter by discipline and open any project as a deep technical case file.
            </p>
          </div>
        </div>
      </section>

      <div className="mb-10 flex flex-wrap gap-2 text-[10px] animate-fade-in-up delay-300">
        <button
          type="button"
          onClick={() => setActive("All")}
          aria-pressed={active === "All"}
          className={`cursor-pointer rounded-full border px-3 py-1.5 font-mono uppercase tracking-[0.2em] transition-all duration-300 ${
            active === "All"
              ? "border-accent/60 bg-accent/15 text-accent shadow-[0_0_22px_var(--accent-glow)]"
              : "border-foreground/20 text-foreground/60 hover:border-accent/50 hover:text-foreground"
          }`}
        >
          All
        </button>
        {allTags.map((t, index) => (
          <button
            key={t}
            type="button"
            onClick={() => setActive(t)}
            aria-pressed={active === t}
            className={`cursor-pointer rounded-full border px-3 py-1.5 font-mono uppercase tracking-[0.2em] transition-all duration-300 animate-fade-in-up ${
              active === t
                ? "border-accent/60 bg-accent/15 text-accent shadow-[0_0_22px_var(--accent-glow)]"
                : "border-foreground/20 text-foreground/60 hover:border-accent/50 hover:text-foreground"
            }`}
            style={{ animationDelay: `${0.3 + index * 0.08}s` }}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-8 sm:space-y-10">
        {filtered.map((p, index) => {
          const isReverse = index % 2 === 1;
          return (
            <article
              key={p.slug}
              className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(125deg,rgba(14,20,28,0.94),rgba(8,11,15,0.96)_52%,rgba(14,52,67,0.8))] p-5 shadow-[0_24px_60px_-36px_rgba(0,0,0,0.9)] transition-all duration-500 hover:-translate-y-1 hover:border-accent/45 sm:p-7 animate-fade-in-up ${isReverse ? "lg:ml-8" : "lg:mr-8"}`}
              style={{ animationDelay: `${0.2 + index * 0.08}s` }}
            >
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <div className="absolute -left-12 top-4 h-40 w-40 rounded-full bg-cyan-300/10 blur-2xl" />
                <div className="absolute -right-6 bottom-0 h-36 w-36 rounded-full bg-blue-300/10 blur-2xl" />
              </div>

              <div className={`relative grid gap-6 lg:grid-cols-12 ${isReverse ? "" : ""}`}>
                <div className={`rounded-2xl border border-white/10 bg-black/20 p-4 backdrop-blur-sm lg:col-span-4 ${isReverse ? "lg:order-2" : ""}`}>
                  <div className="mb-3 flex items-center justify-between">
                    <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-accent/80">Case {String(index + 1).padStart(2, "0")}</p>
                    {p.featured && (
                      <span className="rounded-full border border-accent/40 bg-accent/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-accent">
                        Featured
                      </span>
                    )}
                  </div>

                  <p
                    className="font-mono text-6xl font-bold leading-none text-transparent sm:text-7xl"
                    style={{ WebkitTextStroke: "1px rgba(120, 206, 222, 0.55)" }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </p>

                  <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/50">Tech Signature</p>
                    <div className="flex flex-wrap gap-1.5">
                      <TechPills techs={p.tech.slice(0, 5)} animationDelay={0.2 + index * 0.08} />
                      {p.tech.length > 5 && (
                        <span className="inline-flex items-center rounded-full border border-white/15 px-2 py-1 font-mono text-[10px] text-foreground/50">
                          +{p.tech.length - 5}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className={`lg:col-span-8 ${isReverse ? "lg:order-1" : ""}`}>
                  <h2 className="max-w-4xl text-2xl font-black leading-tight text-foreground transition-colors duration-300 group-hover:text-cyan-100 sm:text-3xl">
                    {p.title}
                  </h2>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className={`rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em] ${tagTone[t]}`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <p className="mt-4 max-w-3xl text-sm leading-relaxed text-foreground/70 sm:text-base">{p.tagline}</p>

                  {p.impact && (
                    <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent/80">Impact Window</p>
                      <p className="mt-2 text-sm leading-relaxed text-foreground/75">{p.impact}</p>
                    </div>
                  )}

                  {p.metrics && p.metrics.length > 0 && (
                    <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {p.metrics.slice(0, 4).map((m) => (
                        <div key={m.label} className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-foreground/45">{m.label}</p>
                          <p className="mt-1 text-sm font-semibold text-foreground/85">{m.value}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                    <DepthButton
                      href={`/projects/${p.slug}${active !== "All" ? `?tag=${active}` : ""}`}
                      variant="secondary"
                      className="group/btn px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] border-white/20 bg-black/25 hover:border-accent/55"
                    >
                      Open Case <span className="ml-1 inline-block text-accent transition-transform group-hover/btn:translate-x-1">→</span>
                    </DepthButton>

                    <div className="flex items-center gap-1.5">
                      {p.links?.map((l) => {
                        const Icon = getKnownLinkIcon(l.type);
                        if (Icon) {
                          return (
                            <IconLinkButton
                              key={l.url}
                              href={l.url}
                              label={formatLinkLabel(l.type)}
                              icon={Icon}
                              className="rounded-full border border-white/15 bg-black/25 p-2.5 text-foreground/65 transition-all hover:border-accent/45 hover:text-accent"
                            />
                          );
                        }

                        return (
                          <a
                            key={l.url}
                            href={l.url}
                            className="rounded-full border border-white/15 bg-black/25 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/60 transition-all hover:border-accent/45 hover:text-accent"
                            target="_blank"
                            rel="noreferrer"
                          >
                            {formatLinkLabel(l.type)}
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          );
        })}

        {filtered.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-black/25 p-8 text-center animate-fade-in-up">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-foreground/50">No Matching Cases</p>
            <p className="mt-3 text-sm text-foreground/70">Try another category to explore more project case files.</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div className="font-mono text-xs uppercase tracking-widest text-foreground/50 animate-pulse">Initializing Data Stream...</div>}>
      <ProjectsContent />
    </Suspense>
  );
}
