"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, m, type Transition } from "framer-motion";
import dynamic from "next/dynamic";
import { projects, type Project } from "@/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FilterPills } from "@/components/ui/FilterPills";
import { ProjectCardFeatured } from "@/components/ui/ProjectCardFeatured";
import { ProjectCardCompact } from "@/components/ui/ProjectCardCompact";
import { Search, X } from "lucide-react";

const ProjectModal = dynamic(
  () => import("@/components/ProjectModal").then((m) => m.ProjectModal),
  { ssr: false }
);

const layoutTransition = {
  layout: { type: "spring", stiffness: 150, damping: 28, mass: 0.9 },
} satisfies Transition;

function matchesSearch(p: Project, q: string): boolean {
  return (
    p.title.toLowerCase().includes(q) ||
    p.tagline.toLowerCase().includes(q) ||
    p.tags.some((t) => t.toLowerCase().includes(q)) ||
    p.tech.some((t) => t.toLowerCase().includes(q))
  );
}

export function Projects() {
  const [active, setActive] = useState<Project | null>(null);
  const [filter, setFilter] = useState<string>("All");
  const [search, setSearch] = useState("");

  const tags = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return ["All", "Featured", ...Array.from(set)];
  }, []);

  const featured = useMemo(() => projects.find((p) => p.featured) ?? null, []);

  const compactList = useMemo(() => {
    let list = featured ? projects.filter((p) => p.slug !== featured.slug) : [...projects];
    if (filter === "Featured") {
      list = [
        ...projects.filter((p) => p.latest),
        ...projects.filter((p) => p.featured && !p.latest),
      ];
    } else if (filter !== "All") {
      list = projects.filter((p) => p.tags.includes(filter));
    }
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((p) => matchesSearch(p, q));
    }
    return list;
  }, [filter, featured, search]);

  const searchQuery = search.trim().toLowerCase();
  const showFeaturedCard = featured && filter === "All" &&
    (!searchQuery || matchesSearch(featured, searchQuery));

  // URL hash sync: open modal from hash on mount; update hash when modal opens/closes
  useEffect(() => {
    const sync = () => {
      const hash = window.location.hash;
      if (hash.startsWith("#project/")) {
        const slug = hash.slice("#project/".length);
        const p = projects.find((p) => p.slug === slug);
        if (p) setActive(p);
      }
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const open = (p: Project) => {
    setActive(p);
    if (typeof window !== "undefined") {
      history.replaceState(null, "", `#project/${p.slug}`);
    }
  };

  const close = () => {
    setActive(null);
    if (typeof window !== "undefined" && window.location.hash.startsWith("#project/")) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  };

  return (
    <section id="work" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeading
            index="01"
            backgroundText="WORK"
            eyebrow="Selected Work"
            title="Projects"
            subtitle="Research-grade systems and production platforms. Click any card for the full case study."
          />
        </m.div>

        {/* Search */}
        <m.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="mb-5"
        >
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--ink-mute)] pointer-events-none"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="w-full md:w-80 pl-9 pr-9 py-2.5 rounded-xl bg-[var(--bg-elev-1)] border border-[var(--line)] text-sm text-[var(--ink)] placeholder:text-[var(--ink-mute)] font-mono tracking-wide focus:outline-none focus:border-[var(--accent)]/50 focus:ring-1 focus:ring-[var(--accent)]/20 transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink-mute)] hover:text-[var(--ink)] transition-colors"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </m.div>

        {/* Filter pills */}
        <m.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="mb-10"
        >
          <FilterPills options={tags} value={filter} onChange={setFilter} />
        </m.div>

        <LayoutGroup id="projects-filter-layout">
          {/* Unified grid: featured card (2-col span) + compact cards */}
          <m.div
            layout
            transition={layoutTransition}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            <AnimatePresence mode="popLayout">
              {showFeaturedCard && featured && (
                <ProjectCardFeatured
                  key={featured.slug}
                  project={featured}
                  onOpen={() => open(featured)}
                  index={0}
                />
              )}
              {compactList.map((p, i) => (
                <ProjectCardCompact
                  key={p.slug}
                  project={p}
                  onOpen={() => open(p)}
                  index={showFeaturedCard ? i + 1 : i}
                />
              ))}
            </AnimatePresence>
          </m.div>
        </LayoutGroup>

        {!showFeaturedCard && compactList.length === 0 && (
          <p className="text-center py-12 text-sm text-[var(--ink-mute)]">
            {search.trim() ? "No projects match your search." : "No projects match this filter."}
          </p>
        )}
      </div>

      <ProjectModal key={active?.slug ?? "none"} project={active} onClose={close} />
    </section>
  );
}
