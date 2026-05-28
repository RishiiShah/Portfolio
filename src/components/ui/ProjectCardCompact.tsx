"use client";

import { forwardRef } from "react";
import { m, type Transition } from "framer-motion";
import type { Project } from "@/data";
import { Tilt } from "@/components/ui/Tilt";
import { ArrowUpRight } from "lucide-react";

interface Props {
  project: Project;
  onOpen: () => void;
  index?: number;
}

const cardTransition = {
  opacity: { duration: 0.24 },
  y: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
  layout: { type: "spring", stiffness: 170, damping: 30, mass: 0.9 },
} satisfies Transition;

export const ProjectCardCompact = forwardRef<HTMLDivElement, Props>(
  function ProjectCardCompact({ project, onOpen, index = 0 }, ref) {
    const hasCaseStudy = !!(
      project.architectureNotes ||
      project.challenges ||
      project.lessons ||
      project.role
    );
    const topMetrics = project.metrics?.slice(0, 2) ?? [];

    return (
      <m.div
        ref={ref}
        layout="position"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ ...cardTransition, delay: index * 0.06 }}
      >
        <Tilt max={6} glare className="h-full rounded-2xl">
          <button
            onClick={onOpen}
            aria-haspopup="dialog"
            aria-label={`View ${project.title} details`}
            className="group block text-left w-full h-full min-h-[260px] rounded-2xl glass-panel-interactive p-6 cursor-pointer"
          >
            {/* Top row: badges */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {project.latest && (
                  <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--accent-signal)]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-signal)] animate-pulse" />
                    Latest
                  </span>
                )}
                {project.featured && !project.latest && (
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--accent-warm)]">
                    Featured
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {project.year && (
                  <span className="font-mono text-[10px] text-[var(--ink-mute)] tracking-wider">
                    {project.year}
                  </span>
                )}
                <ArrowUpRight
                  size={16}
                  className="text-[var(--ink-mute)] group-hover:text-[var(--ink)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all"
                />
              </div>
            </div>

            {/* Title */}
            <h3
              className="font-serif text-[var(--ink)] leading-[1.2] mb-2"
              style={{ fontSize: "clamp(1.1rem, 1.8vw, 1.35rem)" }}
            >
              {project.title}
            </h3>

            {/* Tagline */}
            <p
              className="text-sm text-[var(--ink-dim)] leading-relaxed mb-4"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {project.tagline}
            </p>

            {/* Metrics */}
            {topMetrics.length > 0 && (
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-4">
                {topMetrics.map((m) => (
                  <div key={m.label} className="flex items-baseline gap-1.5">
                    <span className="font-serif text-[var(--accent-warm)] text-base">
                      {m.value}
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--ink-mute)]">
                      {m.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Tech chips */}
            <div className="flex flex-wrap gap-1 mb-3">
              {project.tech.slice(0, 4).map((t) => (
                <span
                  key={t}
                  className="font-mono text-[9px] px-1.5 py-0.5 rounded border border-[var(--line)] text-[var(--ink-mute)]"
                >
                  {t}
                </span>
              ))}
              {project.tech.length > 4 && (
                <span className="font-mono text-[9px] px-1.5 py-0.5 text-[var(--ink-mute)]">
                  +{project.tech.length - 4}
                </span>
              )}
            </div>

            {/* Case study caption */}
            {hasCaseStudy && (
              <div className="absolute bottom-5 right-5 font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--accent)]/80 opacity-0 group-hover:opacity-100 transition-opacity">
                Case study →
              </div>
            )}
          </button>
        </Tilt>
      </m.div>
    );
  }
);
