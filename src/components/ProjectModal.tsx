"use client";

import { useEffect, useRef, useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import type { Project } from "@/data";
import { FiX, FiGithub, FiExternalLink, FiBookOpen } from "react-icons/fi";
import { TechChip } from "@/components/ui/TechChip";

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

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

type TabId = "architecture" | "challenges" | "lessons";

const TAB_LABELS: Record<TabId, string> = {
  architecture: "Architecture",
  challenges: "Challenges",
  lessons: "Lessons",
};

const TAB_COLORS: Record<TabId, string> = {
  architecture: "var(--accent)",
  challenges: "var(--accent-warm)",
  lessons: "var(--accent-signal)",
};

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const [tab, setTab] = useState<TabId>("architecture");

  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [project, onClose]);

  useEffect(() => {
    if (project) {
      document.body.style.overflow = "hidden";
      closeBtnRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [project]);

  if (!project) {
    return (
      <AnimatePresence>{null}</AnimatePresence>
    );
  }

  const availableTabs: TabId[] = (
    ["architecture", "challenges", "lessons"] as TabId[]
  ).filter((id) => {
    if (id === "architecture") return !!project.architectureNotes?.length;
    if (id === "challenges") return !!project.challenges?.length;
    if (id === "lessons") return !!project.lessons?.length;
    return false;
  });

  const tabContent: Record<TabId, string[] | undefined> = {
    architecture: project.architectureNotes as string[] | undefined,
    challenges: project.challenges as string[] | undefined,
    lessons: project.lessons as string[] | undefined,
  };
  const activeTab = availableTabs.includes(tab) ? tab : availableTabs[0];

  const metrics = project.metrics ?? [];

  return (
    <AnimatePresence>
      {project && (
        <>
          <m.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[70] bg-black/75 backdrop-blur-sm"
            onClick={onClose}
          />

          <div className="fixed inset-0 z-[71] flex items-center justify-center p-4 pointer-events-none">
            <m.div
              key="modal-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-modal-title"
              initial={{ opacity: 0, scale: 0.96, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 12 }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto relative w-full max-w-5xl rounded-2xl overflow-hidden flex flex-col"
              style={{
                background: "var(--bg-elev-1)",
                border: "1px solid var(--line-strong)",
                maxHeight: "90vh",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Accent bar */}
              <div
                className="h-px w-full flex-shrink-0"
                style={{
                  background: project.featured
                    ? "linear-gradient(90deg, transparent, rgba(230,185,128,0.7), transparent)"
                    : project.latest
                    ? "linear-gradient(90deg, transparent, rgba(91,227,196,0.7), transparent)"
                    : "linear-gradient(90deg, transparent, rgba(122,162,255,0.6), transparent)",
                }}
              />

              {/* Header (fixed, non-scrolling) */}
              <header className="flex-shrink-0 px-6 md:px-8 pt-6 md:pt-7 pb-5 border-b border-[var(--line)]">
                <button
                  ref={closeBtnRef}
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 rounded-md p-1.5 text-[var(--ink-mute)] hover:text-[var(--ink)] hover:bg-[var(--line)] transition-colors"
                  aria-label="Close"
                >
                  <FiX size={16} />
                </button>

                {/* Badges */}
                <div className="flex flex-wrap items-center gap-1.5 mb-3 pr-10">
                  {project.latest && (
                    <span className="flex items-center gap-1.5 font-mono text-[10px] px-2 py-0.5 rounded border border-[var(--accent-signal)]/40 bg-[var(--accent-signal)]/10 text-[var(--accent-signal)] tracking-wider uppercase">
                      <span className="h-1 w-1 rounded-full bg-[var(--accent-signal)] animate-pulse" />
                      Latest
                    </span>
                  )}
                  {project.featured && !project.latest && (
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded border border-[var(--accent-warm)]/40 bg-[var(--accent-warm)]/10 text-[var(--accent-warm)] tracking-wider uppercase">
                      Featured IEEE
                    </span>
                  )}
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[10px] px-2 py-0.5 rounded border border-[var(--line)] text-[var(--ink-mute)] tracking-wider uppercase"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h2
                  id="project-modal-title"
                  className="font-serif text-[var(--ink)] leading-[1.1] mb-2 pr-10"
                  style={{ fontSize: "clamp(1.35rem, 2.4vw, 1.9rem)" }}
                >
                  {project.title}
                </h2>
                <p className="text-sm text-[var(--ink-dim)] leading-relaxed max-w-3xl">
                  {project.tagline}
                </p>
              </header>

              {/* Scrollable body */}
              <div
                className="flex-1 min-h-0 overflow-y-auto"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "rgba(122,162,255,0.3) transparent",
                }}
              >
                <div className="p-6 md:p-8">
                  {/* Metrics strip */}
                  {metrics.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 mb-6">
                      {metrics.slice(0, 6).map((metric) => (
                        <div
                          key={metric.label}
                          className="rounded-lg border border-[var(--line)] bg-[var(--bg-elev-2)]/40 p-3"
                        >
                          <div className="font-serif text-[var(--accent-warm)] leading-none text-lg md:text-xl">
                            {metric.value}
                          </div>
                          <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--ink-mute)] mt-1.5 leading-tight">
                            {metric.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Two-col main body */}
                  <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                    {/* Left: narrative */}
                    <div className="space-y-5">
                      {project.problem && (
                        <InfoBlock
                          label="Problem"
                          accent="var(--accent-warm)"
                          body={project.problem}
                        />
                      )}
                      {project.impact && (
                        <InfoBlock
                          label="Impact"
                          accent="var(--accent)"
                          body={project.impact}
                        />
                      )}
                      {project.role && (
                        <InfoBlock
                          label="My role"
                          accent="var(--accent-signal)"
                          body={project.role}
                          italic
                        />
                      )}
                    </div>

                    {/* Right: tabbed deep content */}
                    <div>
                      {availableTabs.length > 0 ? (
                        <>
                          <div
                            role="tablist"
                            aria-label="Project deep content"
                            className="flex flex-wrap gap-1 mb-4 border-b border-[var(--line)]"
                          >
                            {availableTabs.map((id) => {
                              const active = activeTab === id;
                              return (
                                <button
                                  key={id}
                                  role="tab"
                                  aria-selected={active}
                                  onClick={() => setTab(id)}
                                  className="relative font-mono text-[11px] uppercase tracking-[0.14em] px-3 py-2 transition-colors"
                                  style={{
                                    color: active
                                      ? TAB_COLORS[id]
                                      : "var(--ink-mute)",
                                  }}
                                >
                                  {TAB_LABELS[id]}
                                  {active && (
                                    <m.span
                                      layoutId="project-tab-bar"
                                      className="absolute left-0 right-0 bottom-[-1px] h-[2px]"
                                      style={{
                                        background: TAB_COLORS[id],
                                      }}
                                      transition={{
                                        type: "spring",
                                        stiffness: 500,
                                        damping: 35,
                                      }}
                                    />
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          <AnimatePresence mode="wait">
                            <m.ul
                              key={activeTab}
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -4 }}
                              transition={{ duration: 0.22 }}
                              className="space-y-2.5"
                            >
                              {(tabContent[activeTab] ?? []).map((item, i) => (
                                <li
                                  key={i}
                                  className="flex gap-2.5 text-sm text-[var(--ink-dim)] leading-relaxed"
                                >
                                  <span
                                    className="shrink-0 mt-[3px] font-mono text-[10px]"
                                    style={{ color: TAB_COLORS[activeTab] }}
                                  >
                                    ›
                                  </span>
                                  {item}
                                </li>
                              ))}
                            </m.ul>
                          </AnimatePresence>
                        </>
                      ) : (
                        <div className="flex items-center justify-center h-full min-h-[140px] rounded-lg border border-dashed border-[var(--line)] p-6">
                          <p className="font-mono text-[11px] text-[var(--ink-mute)] uppercase tracking-[0.14em] text-center">
                            No case study yet for this project.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer (fixed) */}
              <footer className="flex-shrink-0 border-t border-[var(--line)] px-6 md:px-8 py-4 bg-[var(--bg-elev-2)]/30">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  {/* Tech stack */}
                  <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--ink-mute)] mr-1 self-center">
                      Stack
                    </span>
                    {project.tech.map((t) => (
                      <TechChip key={t} name={t} size="xs" />
                    ))}
                  </div>

                  {/* Links */}
                  {project.links && project.links.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {project.links.map((link) => {
                        const Icon = linkIcon[link.type] ?? FiExternalLink;
                        const label = linkLabel[link.type] ?? "Link";
                        return (
                          <a
                            key={link.type}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ghost-button px-3.5 py-1.5 text-xs flex items-center gap-1.5"
                          >
                            <Icon size={12} />
                            {label}
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              </footer>
            </m.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

function InfoBlock({
  label,
  accent,
  body,
  italic,
}: {
  label: string;
  accent: string;
  body: string;
  italic?: boolean;
}) {
  return (
    <div className="border-l-2 pl-4" style={{ borderColor: `${accent}66` }}>
      <p
        className="font-mono text-[10px] uppercase tracking-[0.14em] mb-1.5"
        style={{ color: accent }}
      >
        {label}
      </p>
      <p
        className={`text-sm text-[var(--ink-dim)] leading-relaxed ${
          italic ? "italic" : ""
        }`}
      >
        {body}
      </p>
    </div>
  );
}
