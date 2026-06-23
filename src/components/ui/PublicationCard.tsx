"use client";

import { m } from "framer-motion";
import type { Publication } from "@/data";
import { FiBookOpen, FiExternalLink } from "react-icons/fi";
import { bio } from "@/data";
import { ArrowUpRight } from "lucide-react";

interface Props {
  publication: Publication;
  variant: "featured" | "compact";
  index?: number;
  onOpen?: () => void;
}

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

export function PublicationCard({
  publication,
  variant,
  index = 0,
  onOpen,
}: Props) {
  const authors = publication.authors.map((a, i) => (
    <span key={a}>
      <span
        className={
          a === bio.name
            ? "text-[var(--ink)] font-medium"
            : "text-[var(--ink-dim)]"
        }
      >
        {a}
      </span>
      {i < publication.authors.length - 1 && (
        <span className="text-[var(--ink-mute)]">, </span>
      )}
    </span>
  ));

  if (variant === "featured") {
    return (
      <m.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative glass-panel rounded-3xl overflow-hidden"
      >
        <div
          className="h-px w-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(230,185,128,0.75), transparent)",
          }}
        />
        <div className="p-8 md:p-12">
          <button
            type="button"
            onClick={onOpen}
            aria-haspopup="dialog"
            aria-label={`Read full abstract of ${publication.title}`}
            className="group block w-full cursor-pointer text-left"
          >
            <div className="mb-4 flex items-center gap-2">
              <span className="rounded-full border border-[var(--accent-warm)]/30 bg-[var(--accent-warm)]/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent-warm)]">
                Featured paper
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--ink-mute)]">
                · {publication.venue}
              </span>
            </div>

            <h3
              className="mb-4 font-serif leading-[1.1] text-[var(--ink)] transition-colors group-hover:text-[var(--accent-warm)]"
              style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}
            >
              {publication.title}
            </h3>

            <div className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--ink-mute)]">
                {publication.publishedAt ?? publication.year}
              </span>
              <span className="text-[var(--line-strong)]">·</span>
              <span>{authors}</span>
            </div>

            {publication.abstract && (
              <p
                className="drop-cap mb-7 text-lg leading-[1.65] text-[var(--ink-dim)]"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 5,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {publication.abstract}
              </p>
            )}
          </button>

          <div className="flex flex-wrap items-center gap-3 pt-5 border-t border-[var(--line)]">
            {onOpen && (
              <button
                type="button"
                onClick={onOpen}
                className="warm-button px-5 py-2 text-sm flex items-center gap-2 group"
              >
                Read full abstract
                <ArrowUpRight className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}
            {publication.links?.map((l) => {
              const Icon = linkIcon[l.type] ?? FiExternalLink;
              const label = linkLabel[l.type] ?? "Link";
              return (
                <a
                  key={l.type}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ghost-button px-5 py-2 text-sm flex items-center gap-2"
                >
                  <Icon size={13} />
                  {label}
                </a>
              );
            })}
          </div>
        </div>
      </m.article>
    );
  }

  // Compact
  const superscripts = ["¹", "²", "³", "⁴", "⁵"];
  return (
    <m.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="relative"
    >
      <button
        onClick={onOpen}
        aria-haspopup="dialog"
        aria-label={`Read full abstract of ${publication.title}`}
        className="group glass-panel-interactive rounded-2xl p-7 flex flex-col text-left w-full h-full cursor-pointer"
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <span className="font-mono text-[var(--accent-warm)] text-lg leading-none mt-1 shrink-0">
              {superscripts[index] ?? "·"}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--ink-mute)] mb-2">
                {publication.venue} · {publication.publishedAt ?? publication.year}
              </p>
              <h3 className="font-serif text-[var(--ink)] leading-[1.15] text-xl">
                {publication.title}
              </h3>
            </div>
          </div>
          <ArrowUpRight
            size={16}
            className="shrink-0 text-[var(--ink-mute)] group-hover:text-[var(--ink)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all"
          />
        </div>

        <p className="text-xs text-[var(--ink-mute)] mb-3 leading-relaxed">
          {authors}
        </p>

        {publication.abstract && (
          <p
            className="text-sm text-[var(--ink-dim)] leading-relaxed mb-4"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {publication.abstract}
          </p>
        )}

        <div className="mt-auto pt-4 border-t border-[var(--line)] flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--accent)]/80 group-hover:text-[var(--accent)] transition-colors">
            Read abstract →
          </span>
          {publication.links && publication.links.length > 0 && (
            <div className="flex items-center gap-3">
              {publication.links.map((l) => {
                const Icon = linkIcon[l.type] ?? FiExternalLink;
                const label = linkLabel[l.type] ?? "Link";
                return (
                  <a
                    key={l.type}
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1.5 font-mono text-[11px] text-[var(--ink-mute)] hover:text-[var(--ink)] transition-colors"
                  >
                    <Icon size={12} />
                    {label}
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </button>
    </m.article>
  );
}
