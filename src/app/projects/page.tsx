"use client";
import { useMemo, useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { projects } from "@/data/projects";
import type { Tag } from "@/types";
import { Loading } from "@/components/Loading";

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
  const [isLoading, setIsLoading] = useState(true);
  const [active, setActive] = useState<Tag | "All">("All");

  // Initialize active filter from URL on mount
  useEffect(() => {
    try {
      const tag = searchParams?.get("tag");
    if (tag && (tag === "All" || (allTags as string[]).includes(tag))) {
      setActive(tag as Tag | "All");
      }
    } catch (e) {
      // If searchParams is not ready, keep default "All"
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const filtered = useMemo(
    () => (active === "All" ? projects : projects.filter((p) => p.tags.includes(active))),
    [active]
  );

  // Keep URL in sync when active changes
  useEffect(() => {
    if (isLoading) return; // avoid navigating during loader
    const params = new URLSearchParams();
    // Safely copy existing search params
    try {
      searchParams.forEach((value, key) => {
        params.set(key, value);
      });
    } catch (e) {
      // If searchParams is not ready, just continue with empty params
    }
    if (active === "All") params.delete("tag"); else params.set("tag", active);
    const newUrl = `/projects${params.toString() ? `?${params.toString()}` : ""}`;
    router.replace(newUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, isLoading]);

  if (isLoading) {
    return <Loading onComplete={() => setIsLoading(false)} />;
  }

  return (
    <main className="py-8 sm:py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-semibold animate-fade-in-up">Projects</h1>
        <div className="flex flex-wrap gap-2 text-xs animate-fade-in-up delay-200">
          <button
            onClick={() => setActive("All")}
            className={`px-2 py-1 rounded-xl border transition-all duration-300 hover:scale-105 active:scale-95 ${active === "All" ? "bg-foreground text-background" : "hover:bg-foreground/5 hover:border-foreground/30"}`}
          >
            All
          </button>
          {allTags.map((t, index) => (
            <button
              key={t}
              onClick={() => setActive(t)}
              className={`px-2 py-1 rounded-xl border transition-all duration-300 hover:scale-105 active:scale-95 animate-fade-in-up ${active === t ? "bg-foreground text-background" : "hover:bg-foreground/5 hover:border-foreground/30"}`}
              style={{animationDelay: `${0.3 + index * 0.1}s`}}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {filtered.map((p, index) => (
          <div key={p.slug} className="rounded-lg border p-4 sm:p-5 flex flex-col gap-3 transition-all duration-300 hover:border-foreground/30 hover:bg-foreground/5 hover:scale-[1.02] hover:shadow-lg group animate-fade-in-up" style={{animationDelay: `${0.5 + index * 0.1}s`}}>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="flex-1">
                <h2 className="font-semibold text-sm sm:text-base leading-tight group-hover:text-foreground transition-colors duration-300">{p.title}</h2>
                <p className="text-xs sm:text-sm text-foreground/80 mt-1 group-hover:text-foreground/90 transition-colors duration-300">{p.tagline}</p>
              </div>
              <Link href={`/projects/${p.slug}${active !== "All" ? `?tag=${active}` : ""}`} className="relative group/link text-xs sm:text-sm font-medium shrink-0 transition-all duration-300 hover:scale-105 inline-block">
                Details →
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-foreground transition-all duration-300 group-hover/link:w-full"></span>
              </Link>
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {p.tags.map((t) => (
                <span key={t} className="text-xs px-2 py-1 rounded-md border cursor-pointer transition-all duration-300 hover:bg-foreground/10 hover:border-foreground/30 hover:scale-105">{t}</span>
              ))}
            </div>
            {p.impact && <div className="text-xs sm:text-sm text-foreground/70 group-hover:text-foreground/80 transition-colors duration-300">{p.impact}</div>}
            <div className="flex flex-wrap gap-2 sm:gap-3 text-xs">
              {p.links?.map((l) => (
                <a key={l.url} href={l.url} className="underline underline-offset-4 hover:text-foreground/80 transition-all duration-300 hover:scale-105" target="_blank" rel="noreferrer">
                  {l.type}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<Loading onComplete={() => {}} />}>
      <ProjectsContent />
    </Suspense>
  );
}


