"use client";

import { useEffect, useRef } from "react";
import { m, AnimatePresence } from "framer-motion";
import type { Publication } from "@/data";
import { bio } from "@/data";
import { FiX, FiBookOpen, FiExternalLink } from "react-icons/fi";

const linkIcon = {
  paper: FiBookOpen,
  journal: FiBookOpen,
  source: FiExternalLink,
  demo: FiExternalLink,
};
const linkLabel = {
  paper: "View paper",
  journal: "Journal",
  source: "Source",
  demo: "Demo",
};

interface Props {
  publication: Publication | null;
  onClose: () => void;
}

export function PublicationModal({ publication, onClose }: Props) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!publication) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [publication, onClose]);

  useEffect(() => {
    if (publication) {
      document.body.style.overflow = "hidden";
      closeBtnRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [publication]);

  return (
    <AnimatePresence>
      {publication && (
        <>
          <m.div
            key="pub-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[70] bg-black/75 backdrop-blur-sm"
            onClick={onClose}
          />

          <div className="fixed inset-0 z-[71] flex items-center justify-center p-4 pointer-events-none">
            <m.div
              key="pub-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="publication-modal-title"
              initial={{ opacity: 0, scale: 0.96, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 12 }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto relative w-full max-w-3xl rounded-2xl overflow-hidden flex flex-col"
              style={{
                background: "var(--bg-elev-1)",
                border: "1px solid var(--line-strong)",
                maxHeight: "85vh",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Warm accent bar */}
              <div
                className="h-px w-full flex-shrink-0"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(230,185,128,0.7), transparent)",
                }}
              />

              {/* Scrollable content */}
              <div
                className="flex-1 min-h-0 overflow-y-auto p-6 md:p-10"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "rgba(122,162,255,0.3) transparent",
                }}
              >
                <button
                  ref={closeBtnRef}
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 rounded-md p-1.5 text-[var(--ink-mute)] hover:text-[var(--ink)] hover:bg-[var(--line)] transition-colors"
                  aria-label="Close"
                >
                  <FiX size={16} />
                </button>

                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] px-2.5 py-1 rounded-full bg-[var(--accent-warm)]/10 border border-[var(--accent-warm)]/30 text-[var(--accent-warm)]">
                    {publication.featured ? "Featured paper" : "Publication"}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--ink-mute)]">
                    {publication.publishedAt ?? publication.year}
                  </span>
                </div>

                <h2
                  id="publication-modal-title"
                  className="font-serif text-[var(--ink)] leading-[1.15] pr-10 mb-3"
                  style={{ fontSize: "clamp(1.5rem, 2.8vw, 2.1rem)" }}
                >
                  {publication.title}
                </h2>

                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--ink-mute)] mb-6">
                  {publication.venue}
                </p>

                {/* Authors */}
                <div className="mb-7">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ink-mute)] mb-2">
                    Authors
                  </p>
                  <p className="text-sm text-[var(--ink-dim)] leading-relaxed">
                    {publication.authors.map((a, i) => (
                      <span key={a}>
                        <span
                          className={
                            a === bio.name
                              ? "text-[var(--ink)] font-medium"
                              : ""
                          }
                        >
                          {a}
                        </span>
                        {i < publication.authors.length - 1 && (
                          <span className="text-[var(--ink-mute)]">, </span>
                        )}
                      </span>
                    ))}
                  </p>
                </div>

                {publication.abstract && (
                  <div className="mb-8">
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ink-mute)] mb-3">
                      Abstract
                    </p>
                    <p className="drop-cap text-[1.0625rem] text-[var(--ink-dim)] leading-[1.75]">
                      {publication.abstract}
                    </p>
                  </div>
                )}

                {publication.links && publication.links.length > 0 && (
                  <div className="flex flex-wrap gap-3 pt-5 border-t border-[var(--line)]">
                    {publication.links.map((l) => {
                      const Icon = linkIcon[l.type] ?? FiExternalLink;
                      const label = linkLabel[l.type] ?? "Link";
                      return (
                        <a
                          key={l.type}
                          href={l.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="warm-button px-5 py-2.5 text-sm flex items-center gap-2"
                        >
                          <Icon size={13} />
                          {label}
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            </m.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
