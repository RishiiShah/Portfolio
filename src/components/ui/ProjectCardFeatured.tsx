"use client";

import { m } from "framer-motion";
import type { Project } from "@/data";
import { MetricConstellation } from "@/components/ui/MetricConstellation";
import { TechChip } from "@/components/ui/TechChip";
import { FiGithub, FiExternalLink, FiBookOpen } from "react-icons/fi";
import { ArrowRight } from "lucide-react";

interface Props {
  project: Project;
  onOpen: () => void;
}

const linkIcon = {
  source: FiGithub,
  paper: FiBookOpen,
  demo: FiExternalLink,
  blog: FiExternalLink,
};
const linkLabel = {
  source: "Source",
  paper: "Paper",
  demo: "Live demo",
  blog: "Blog",
};

export function ProjectCardFeatured({ project, onOpen }: Props) {
  const topMetrics = project.metrics?.slice(0, 3) ?? [];
  const mobileExtraMetrics = project.metrics?.slice(3, 6) ?? [];

  return (
    <m.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative glass-panel rounded-3xl overflow-hidden"
    >
      {/* Warm top accent line */}
      <div
        className="h-px w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(230,185,128,0.75), transparent)",
        }}
      />

      <div className="grid lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-10 p-7 md:p-10">
        {/* Left: prose */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-5">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] px-2.5 py-1 rounded-full bg-[var(--accent-warm)]/10 border border-[var(--accent-warm)]/30 text-[var(--accent-warm)]">
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

          <h3
            className="font-serif text-[var(--ink)] leading-[1.08] mb-4"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)" }}
          >
            {project.title}
          </h3>

          <p className="text-[var(--ink-dim)] leading-relaxed mb-5 text-[0.9375rem]">
            {project.tagline}
          </p>

          {project.problem && (
            <div className="mb-6 border-l-2 border-[var(--accent-warm)]/40 pl-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--ink-mute)] mb-1">
                Problem
              </p>
              <p className="text-sm text-[var(--ink-dim)] leading-relaxed">
                {project.problem}
              </p>
            </div>
          )}

          {topMetrics.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mb-6">
              {topMetrics.map((m) => (
                <div key={m.label}>
                  <p className="font-serif text-2xl text-[var(--accent-warm)] leading-none">
                    {m.value}
                  </p>
                  <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--ink-mute)]">
                    {m.label}
                  </p>
                </div>
              ))}
            </div>
          )}

          {mobileExtraMetrics.length > 0 && (
            <div className="mb-6 grid grid-cols-2 gap-2.5 md:hidden">
              {mobileExtraMetrics.map((m) => (
                <div
                  key={m.label}
                  className="rounded-lg border border-[var(--line)] bg-[var(--bg-elev-2)]/35 p-2.5"
                >
                  <p className="font-serif text-base leading-none text-[var(--accent-warm)]">
                    {m.value}
                  </p>
                  <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--ink-mute)]">
                    {m.label}
                  </p>
                </div>
              ))}
            </div>
          )}

          {project.role && (
            <p className="italic text-sm text-[var(--ink-dim)] leading-relaxed mb-6">
              <span className="not-italic font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--ink-mute)] mr-2">
                Role
              </span>
              {project.role}
            </p>
          )}

          {/* Tech chips */}
          <div className="flex flex-wrap gap-1.5 mb-6">
            {project.tech.slice(0, 8).map((t) => (
              <TechChip key={t} name={t} size="xs" />
            ))}
            {project.tech.length > 8 && (
              <span className="font-mono text-[10px] text-[var(--ink-mute)] self-center">
                +{project.tech.length - 8}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="mt-auto flex flex-wrap items-center gap-3">
            <button
              onClick={onOpen}
              className="warm-button px-5 py-2.5 text-sm flex items-center gap-2 group"
            >
              Read case study
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            {project.links?.map((link) => {
              const Icon = linkIcon[link.type] ?? FiExternalLink;
              const label = linkLabel[link.type] ?? "Link";
              return (
                <a
                  key={link.type}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ghost-button px-5 py-2.5 text-sm flex items-center gap-2"
                >
                  <Icon size={13} />
                  {label}
                </a>
              );
            })}
          </div>
        </div>

        {/* Right: metric constellation */}
        <div className="hidden min-h-[280px] items-center justify-center md:flex">
          {project.metrics && project.metrics.length > 0 ? (
            <MetricConstellation metrics={project.metrics} />
          ) : (
            <p className="text-sm text-[var(--ink-mute)]">No metrics yet</p>
          )}
        </div>
      </div>
    </m.article>
  );
}
