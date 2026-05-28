"use client";

import { forwardRef } from "react";
import { m, type Transition } from "framer-motion";
import type { Project } from "@/data";
import { Tilt } from "@/components/ui/Tilt";
import { TechChip } from "@/components/ui/TechChip";
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

const innerEase = [0.22, 1, 0.36, 1] as const;

export const ProjectCardFeatured = forwardRef<HTMLDivElement, Props>(
  function ProjectCardFeatured({ project, onOpen, index = 0 }, ref) {
    const topMetrics = project.metrics?.slice(0, 3) ?? [];
    const baseDelay = index * 0.06;

    return (
      <m.div
        ref={ref}
        layout="position"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ ...cardTransition, delay: baseDelay }}
        className="col-span-1 md:col-span-2"
      >
        <Tilt max={4} glare className="h-full rounded-2xl">
          <button
            onClick={onOpen}
            aria-haspopup="dialog"
            aria-label={`View ${project.title} details`}
            className="group flex flex-col text-left w-full h-full min-h-[260px] rounded-2xl glass-panel-interactive p-7 md:p-8 cursor-pointer relative overflow-hidden"
            style={{
              boxShadow:
                "0 0 40px rgba(230,185,128,0.06), 0 0 80px rgba(230,185,128,0.03), 0 28px 60px 0 rgba(0,0,0,0.35)",
            }}
          >
            {/* Warm top accent line */}
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(230,185,128,0.6), transparent)",
              }}
            />

            {/* Badge row */}
            <m.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, ease: innerEase, delay: baseDelay + 0.06 }}
              className="flex items-center justify-between mb-4"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] px-2.5 py-1 rounded-full bg-[var(--accent-warm)]/10 border border-[var(--accent-warm)]/30 text-[var(--accent-warm)]">
                  Featured · IEEE
                </span>
                {project.tags.slice(0, 2).map((t) => (
                  <span
                    key={t}
                    className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--ink-mute)]"
                  >
                    · {t}
                  </span>
                ))}
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
            </m.div>

            {/* Title */}
            <m.h3
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, ease: innerEase, delay: baseDelay + 0.12 }}
              className="font-serif text-[var(--ink)] leading-[1.1] mb-3"
              style={{ fontSize: "clamp(1.3rem, 2.2vw, 1.7rem)" }}
            >
              {project.title}
            </m.h3>

            {/* Tagline */}
            <m.p
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, ease: innerEase, delay: baseDelay + 0.16 }}
              className="text-sm text-[var(--ink-dim)] leading-relaxed mb-5 max-w-2xl"
            >
              {project.tagline}
            </m.p>

            {/* Metrics */}
            {topMetrics.length > 0 && (
              <m.div
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, ease: innerEase, delay: baseDelay + 0.2 }}
                className="flex flex-wrap gap-x-6 gap-y-2 mb-5"
              >
                {topMetrics.map((metric) => (
                  <div key={metric.label} className="flex items-baseline gap-1.5">
                    <span className="font-serif text-lg text-[var(--accent-warm)] leading-none">
                      {metric.value}
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--ink-mute)]">
                      {metric.label}
                    </span>
                  </div>
                ))}
              </m.div>
            )}

            {/* Bottom: tech chips + case study CTA */}
            <m.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, ease: innerEase, delay: baseDelay + 0.24 }}
              className="flex flex-wrap items-center justify-between gap-4 mt-auto"
            >
              <div className="flex flex-wrap gap-1.5">
                {project.tech.slice(0, 6).map((t) => (
                  <TechChip key={t} name={t} size="xs" />
                ))}
                {project.tech.length > 6 && (
                  <span className="font-mono text-[10px] text-[var(--ink-mute)] self-center">
                    +{project.tech.length - 6}
                  </span>
                )}
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--accent-warm)]/60 group-hover:text-[var(--accent-warm)] transition-colors">
                Read case study →
              </span>
            </m.div>
          </button>
        </Tilt>
      </m.div>
    );
  }
);
