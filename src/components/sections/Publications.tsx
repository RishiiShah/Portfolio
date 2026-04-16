"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiExternalLink, FiFileText } from "react-icons/fi";
import { publications, type PublicationLink } from "@/data";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { fadeInUp, staggerContainer, viewportConfig } from "@/lib/animations";

const pubLinkIcon = (type: PublicationLink["type"]) => {
  switch (type) {
    case "paper":
    case "journal":
      return <FiFileText size={13} />;
    default:
      return <FiExternalLink size={13} />;
  }
};

const pubLinkLabel = (type: PublicationLink["type"]) => {
  switch (type) {
    case "paper":
      return "Paper";
    case "journal":
      return "Journal";
    case "source":
      return "Code";
    case "demo":
      return "Demo";
    default:
      return "Link";
  }
};

export function Publications() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <SectionWrapper id="publications">
      <SectionHeading
        label="05 / Publications"
        title="Publications"
        subtitle="Peer-reviewed research at international conferences."
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        className="flex flex-col gap-4"
      >
        {publications.map((pub, i) => (
          <motion.div
            key={i}
            variants={fadeInUp}
            className="bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden hover:border-neutral-700 transition-all duration-200"
          >
            {/* Clickable header */}
            <button
              className="w-full text-left p-5 sm:p-6"
              onClick={() => setExpanded(expanded === i ? null : i)}
              aria-expanded={expanded === i}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Badges row */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {pub.featured && <Badge variant="accent">Featured</Badge>}
                    <Badge variant="outline">{pub.year}</Badge>
                    {pub.publishedAt && (
                      <span className="text-xs text-neutral-600">{pub.publishedAt}</span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-white text-sm leading-snug mb-2">
                    {pub.title}
                  </h3>

                  {/* Venue */}
                  <p className="text-sky-400 text-xs font-mono mb-1.5">{pub.venue}</p>

                  {/* Authors */}
                  <p className="text-neutral-500 text-xs">
                    {pub.authors.join(", ")}
                  </p>
                </div>

                {/* Expand icon */}
                <motion.div
                  animate={{ rotate: expanded === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0 mt-1"
                >
                  <FiChevronDown size={16} className="text-neutral-500" />
                </motion.div>
              </div>
            </button>

            {/* Expandable abstract */}
            <AnimatePresence initial={false}>
              {expanded === i && (
                <motion.div
                  key="abstract"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-neutral-800 px-5 sm:px-6 py-5">
                    {pub.abstract && (
                      <p className="text-neutral-400 text-sm leading-relaxed mb-4">
                        {pub.abstract}
                      </p>
                    )}

                    {pub.links && pub.links.length > 0 && (
                      <div className="flex flex-wrap gap-3">
                        {pub.links.map((link, j) => (
                          <a
                            key={j}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs text-neutral-400 transition-colors hover:text-sky-400"
                          >
                            {pubLinkIcon(link.type)}
                            {pubLinkLabel(link.type)}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}
