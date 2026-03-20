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
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-12">
        <h1 className="text-xl sm:text-2xl font-semibold animate-fade-in-up md:w-[28%]">Projects</h1>
        <div className="hidden md:block flex-1 border-b border-foreground/10 animate-fade-in-up" />
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-2 text-[10px] animate-fade-in-up delay-200 mb-8 sm:mb-10">
        <button
          type="button"
          onClick={() => setActive("All")}
          className={`px-2.5 py-1 rounded-[4px] border font-mono uppercase tracking-widest transition-all duration-300 hover:scale-105 active:scale-95 ${active === "All" ? "bg-accent/15 border-accent/50 text-accent shadow-[0_0_10px_var(--accent-glow)]" : "border-foreground/10 text-foreground/50 hover:border-accent/30 hover:text-accent/80"}`}
        >
          All
        </button>
        {allTags.map((t, index) => (
          <button
            key={t}
            type="button"
            onClick={() => setActive(t)}
            className={`px-2.5 py-1 rounded-[4px] border font-mono uppercase tracking-widest transition-all duration-300 hover:scale-105 active:scale-95 animate-fade-in-up ${active === t ? "bg-accent/15 border-accent/50 text-accent shadow-[0_0_10px_var(--accent-glow)]" : "border-foreground/10 text-foreground/50 hover:border-accent/30 hover:text-accent/80"}`}
            style={{ animationDelay: `${0.3 + index * 0.1}s` }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Project Cards */}
      <div className="space-y-6 sm:space-y-8">
        {filtered.map((p, index) => (
          <div
            key={p.slug}
            className="group relative card border-l-[3px] border-l-accent/30 hover:border-l-accent transition-all duration-500 animate-fade-in-up overflow-hidden"
            style={{ animationDelay: `${0.2 + index * 0.1}s` }}
          >
            <div className="p-6 sm:p-8">
              {/* Header: Index + Title + Tags */}
              <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-5 mb-4">
                {/* Project Index */}
                <span className="font-mono text-[10px] text-accent/50 tracking-widest uppercase shrink-0 pt-1.5">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="flex-1 min-w-0">
                  {/* Title */}
                  <h2 className="font-bold text-lg sm:text-xl leading-tight text-foreground group-hover:text-accent transition-colors duration-300 mb-2">
                    {p.title}
                  </h2>

                  {/* Tags inline */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {p.tags.map((t) => (
                      <span key={t} className="text-[9px] uppercase tracking-widest font-mono text-accent/80 bg-accent/5 border border-accent/20 px-2 py-0.5 rounded transition-colors group-hover:border-accent/40">
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Tagline */}
                  <p className="text-sm text-foreground/60 group-hover:text-foreground/80 transition-colors duration-300 leading-relaxed max-w-3xl">
                    {p.tagline}
                  </p>
                </div>
              </div>

              {/* Impact */}
              {p.impact && (
                <div className="ml-0 sm:ml-[calc(2ch+1.25rem)] mt-4 text-xs font-mono text-foreground/50">
                  <span className="text-[10px] uppercase tracking-widest text-accent/60 flex items-center gap-2 mb-2">
                    <div className="w-1 h-1 bg-accent/60 rounded-full" /> System Impact
                  </span>
                  <div className="flex items-start gap-3 bg-foreground/[0.02] p-3 rounded-lg border border-foreground/5 group-hover:border-accent/20 transition-colors">
                    <span className="text-accent/50 mt-0.5">&gt;</span>
                    <span className="leading-snug text-foreground/70">{p.impact}</span>
                  </div>
                </div>
              )}

              {/* Tech Stack */}
              <div className="ml-0 sm:ml-[calc(2ch+1.25rem)] mt-5">
                <div className="flex flex-wrap gap-1.5">
                  <TechPills techs={p.tech.slice(0, 6)} animationDelay={0.3 + index * 0.1} />
                  {p.tech.length > 6 && (
                    <span className="inline-flex items-center text-[10px] font-mono text-foreground/40 px-2 py-1">
                      +{p.tech.length - 6} more
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between gap-4 border-t border-foreground/5 bg-foreground/[0.02] px-6 py-4 sm:px-8">
              <DepthButton
                href={`/projects/${p.slug}${active !== "All" ? `?tag=${active}` : ""}`}
                variant="secondary"
                className="group/btn px-4 md:px-6 py-2.5 text-[10px] sm:text-[11px] tracking-widest font-mono uppercase bg-background shadow-sm hover:shadow border-foreground/10 hover:border-accent/50"
              >
                View Specs <span className="text-accent group-hover/btn:translate-x-1.5 transition-transform inline-block ml-1">→</span>
              </DepthButton>

              <div className="flex items-center gap-1.5 shrink-0">
                {p.links?.map((l) => {
                  const Icon = getKnownLinkIcon(l.type);
                  if (Icon) {
                    return (
                      <IconLinkButton
                        key={l.url}
                        href={l.url}
                        label={formatLinkLabel(l.type)}
                        icon={Icon}
                        className="p-2.5 text-foreground/50 hover:text-accent border border-transparent hover:border-accent/20 hover:bg-accent/5 rounded-md transition-all shadow-sm"
                      />
                    );
                  }
                  return (
                    <a
                      key={l.url}
                      href={l.url}
                      className="text-[10px] uppercase font-mono tracking-widest text-foreground/50 hover:text-accent border border-transparent hover:border-accent/20 hover:bg-accent/5 rounded-md transition-all duration-300 px-3 py-2 shadow-sm"
                      target="_blank"
                      rel="noreferrer"
                    >
                      [{formatLinkLabel(l.type)}]
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
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
