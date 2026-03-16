"use client";
import { useMemo, useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { projects } from "@/data/projects";
import type { Tag } from "@/types";
import { DepthButton } from "@/components/ui/DepthButton";
import { IconLinkButton } from "@/components/ui/IconLinkButton";
import { formatLinkLabel, getKnownLinkIcon } from "@/utils/linkIcons";
import { FiArrowRight } from "react-icons/fi";

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
    <main className="py-8 sm:py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-semibold animate-fade-in-up">Projects</h1>
        <div className="flex flex-wrap gap-2 text-xs animate-fade-in-up delay-200">
          <button
            type="button"
            onClick={() => setActive("All")}
            className={`px-2 py-1 rounded-full border transition-all duration-300 hover:scale-105 active:scale-95 ${active === "All" ? "bg-foreground text-background" : "hover:bg-foreground/5 hover:border-foreground/30"}`}
          >
            All
          </button>
          {allTags.map((t, index) => (
            <button
              key={t}
              type="button"
              onClick={() => setActive(t)}
              className={`px-2 py-1 rounded-full border transition-all duration-300 hover:scale-105 active:scale-95 animate-fade-in-up ${active === t ? "bg-foreground text-background" : "hover:bg-foreground/5 hover:border-foreground/30"}`}
              style={{ animationDelay: `${0.3 + index * 0.1}s` }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {filtered.map((p, index) => (
          <div key={p.slug} className="card p-4 sm:p-5 flex flex-col gap-3 group animate-fade-in-up" style={{ animationDelay: `${0.5 + index * 0.1}s` }}>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="flex-1">
                <h2 className="font-semibold text-sm sm:text-base leading-tight group-hover:text-accent transition-colors duration-300">{p.title}</h2>
                <p className="text-xs sm:text-sm text-foreground/80 mt-1 group-hover:text-foreground/90 transition-colors duration-300">{p.tagline}</p>
              </div>
              <DepthButton
                href={`/projects/${p.slug}${active !== "All" ? `?tag=${active}` : ""}`}
                variant="secondary"
                className="group px-2.5 py-1.5 text-[11px] sm:text-xs shrink-0"
                iconRight={<FiArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />}
                aria-label={`View details for ${p.title}`}
              >
                Details
              </DepthButton>
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {p.tags.map((t) => (
                <span key={t} className="text-xs px-2 py-1 rounded-md border cursor-pointer transition-all duration-300 hover:bg-foreground/10 hover:border-accent/30 hover:scale-105">{t}</span>
              ))}
            </div>
            {p.impact && <div className="text-xs sm:text-sm text-foreground/70 group-hover:text-foreground/80 transition-colors duration-300">{p.impact}</div>}
            <div className="flex flex-wrap gap-2 sm:gap-3 text-xs">
              {p.links?.map((l) => {
                const Icon = getKnownLinkIcon(l.type);

                if (Icon) {
                  return (
                    <IconLinkButton
                      key={l.url}
                      href={l.url}
                      label={formatLinkLabel(l.type)}
                      icon={Icon}
                      className="px-2.5 py-1 text-[11px]"
                    />
                  );
                }

                return (
                  <a
                    key={l.url}
                    href={l.url}
                    className="underline underline-offset-4 hover:text-foreground/80 transition-colors duration-300"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {formatLinkLabel(l.type)}
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProjectsContent />
    </Suspense>
  );
}


