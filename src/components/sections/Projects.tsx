"use client";

import { motion } from "framer-motion";
import {
  FiExternalLink,
  FiFileText,
  FiGithub,
  FiStar,
} from "react-icons/fi";
import { projects, type ProjectLink } from "@/data";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { fadeInUp, scaleIn, staggerContainer, viewportConfig } from "@/lib/animations";

const linkIcon = (type: ProjectLink["type"]) => {
  switch (type) {
    case "source":
      return <FiGithub size={14} />;
    case "paper":
      return <FiFileText size={14} />;
    default:
      return <FiExternalLink size={14} />;
  }
};

const linkLabel = (type: ProjectLink["type"]) => {
  switch (type) {
    case "source":
      return "Code";
    case "paper":
      return "Paper";
    case "demo":
      return "Demo";
    case "blog":
      return "Blog";
    default:
      return "Link";
  }
};

export function Projects() {
  const featured = projects.filter((p) => p.featured === true);
  const others = projects.filter((p) => !p.featured);

  return (
    <SectionWrapper id="projects">
      <SectionHeading
        label="04 / Projects"
        title="Projects"
        subtitle="From production systems to research prototypes."
      />

      {/* Featured projects */}
      {featured.length > 0 && (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="flex flex-col gap-5 mb-10"
        >
          {featured.map((project) => (
            <motion.div
              key={project.slug}
              variants={fadeInUp}
              className="group bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 sm:p-8 hover:border-neutral-700 transition-all duration-200"
            >
              {/* Featured badge */}
              <div className="flex items-center gap-2 mb-4">
                <FiStar size={12} className="text-sky-400" />
                <span className="text-xs font-mono text-sky-400 uppercase tracking-widest">
                  Featured
                </span>
              </div>

              {/* Title */}
              <h3 className="font-bold text-white text-xl mb-2 group-hover:text-sky-400 transition-colors duration-200">
                {project.title}
              </h3>

              {/* Tagline */}
              <p className="text-neutral-400 text-sm mb-4">{project.tagline}</p>

              {/* Impact */}
              {project.impact && (
                <p className="text-neutral-500 text-sm border-l-2 border-sky-400/30 pl-4 mb-5 leading-relaxed">
                  {project.impact}
                </p>
              )}

              {/* Metrics */}
              {project.metrics && project.metrics.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mb-5">
                  {project.metrics.slice(0, 3).map((metric) => (
                    <div key={metric.label} className="text-center">
                      <p className="text-sky-400 font-bold text-lg">{metric.value}</p>
                      <p className="text-neutral-500 text-xs mt-0.5">{metric.label}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Tech badges */}
              {project.tech.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {project.tech.slice(0, 6).map((t) => (
                    <Badge key={t} variant="accent">
                      {t}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Links */}
              {project.links && project.links.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {project.links.map((link) => (
                    <a
                      key={link.type}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-neutral-400 transition-colors hover:text-sky-400"
                    >
                      {linkIcon(link.type)}
                      {linkLabel(link.type)}
                    </a>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Other projects grid */}
      {others.length > 0 && (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {others.map((project) => (
            <motion.div
              key={project.slug}
              variants={scaleIn}
              className="group bg-neutral-900/50 border border-neutral-800 rounded-xl p-5 hover:border-neutral-700 transition-all duration-200 flex flex-col"
            >
              {/* Title + link icons */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold text-white text-sm leading-snug group-hover:text-sky-400 transition-colors duration-200">
                  {project.title}
                </h3>
                {project.links && project.links.length > 0 && (
                  <div className="flex items-center gap-2 shrink-0">
                    {project.links.map((link) => (
                      <a
                        key={link.type}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-500 transition-colors hover:text-sky-400"
                        aria-label={linkLabel(link.type)}
                      >
                        {linkIcon(link.type)}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Tagline */}
              <p className="text-neutral-500 text-xs leading-relaxed mb-4 flex-1">
                {project.tagline}
              </p>

              {/* Tech badges */}
              {project.tech.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {project.tech.slice(0, 4).map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-neutral-800 text-neutral-400 border border-neutral-700/50"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </SectionWrapper>
  );
}
