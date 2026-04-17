"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import dynamic from "next/dynamic";
import { projects, type Project } from "@/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FilterPills } from "@/components/ui/FilterPills";
import { ProjectCardFeatured } from "@/components/ui/ProjectCardFeatured";
import { ProjectCardCompact } from "@/components/ui/ProjectCardCompact";

const ProjectModal = dynamic(
  () => import("@/components/ProjectModal").then((m) => m.ProjectModal),
  { ssr: false }
);

export function Projects() {
  const [active, setActive] = useState<Project | null>(null);
  const [filter, setFilter] = useState<string>("All");

  const tags = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return ["All", "Featured", ...Array.from(set)];
  }, []);

  const featured = useMemo(() => projects.find((p) => p.featured) ?? null, []);

  const compactList = useMemo(() => {
    let list = featured ? projects.filter((p) => p.slug !== featured.slug) : [...projects];
    if (filter === "Featured") {
      list = projects.filter((p) => p.featured || p.latest);
    } else if (filter !== "All") {
      list = projects.filter((p) => p.tags.includes(filter));
    }
    return list;
  }, [filter, featured]);

  // Hide featured card when filtering to a tag that doesn't include it
  const showFeaturedCard =
    featured &&
    (filter === "All" ||
      filter === "Featured" ||
      featured.tags.includes(filter));

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

        {/* Featured card */}
        <AnimatePresence mode="wait">
          {showFeaturedCard && featured && (
            <m.div
              key={`featured-${filter}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              className="mb-10"
            >
              <ProjectCardFeatured project={featured} onOpen={() => open(featured)} />
            </m.div>
          )}
        </AnimatePresence>

        {/* Grid */}
        <m.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          <AnimatePresence mode="popLayout">
            {compactList.map((p) => (
              <ProjectCardCompact key={p.slug} project={p} onOpen={() => open(p)} />
            ))}
          </AnimatePresence>
        </m.div>

        {compactList.length === 0 && (
          <p className="text-center py-12 text-sm text-[var(--ink-mute)]">
            No projects match this filter.
          </p>
        )}
      </div>

      <ProjectModal project={active} onClose={close} />
    </section>
  );
}
