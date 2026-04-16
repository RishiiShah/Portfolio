"use client";

import { motion } from "framer-motion";
import { FiCalendar, FiMapPin } from "react-icons/fi";
import { experience } from "@/data";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { fadeInUp, staggerContainer, viewportConfig } from "@/lib/animations";

export function Experience() {
  return (
    <SectionWrapper id="experience">
      <SectionHeading label="03 / Experience" title="Work Experience" />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        className="flex flex-col gap-5"
      >
        {experience.map((exp, i) => (
          <motion.div
            key={i}
            variants={fadeInUp}
            className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 sm:p-8 hover:border-neutral-700 transition-all duration-200"
          >
            {/* Header */}
            <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between mb-5">
              <div>
                <p className="font-semibold text-white text-lg">{exp.role}</p>
                <p className="text-sky-400 text-sm mt-0.5">{exp.organization}</p>
              </div>
              <div className="flex flex-col gap-1 sm:items-end mt-1 sm:mt-0 shrink-0">
                <span className="flex items-center gap-1.5 text-neutral-500 text-xs">
                  <FiCalendar size={11} />
                  {exp.start} – {exp.end}
                </span>
                {exp.location && (
                  <span className="flex items-center gap-1.5 text-neutral-500 text-xs">
                    <FiMapPin size={11} />
                    {exp.location}
                  </span>
                )}
              </div>
            </div>

            {/* Bullets */}
            <ul className="flex flex-col gap-2.5 mb-5">
              {exp.bullets.map((bullet, j) => (
                <li key={j} className="flex items-start gap-2.5">
                  <span className="text-sky-400 shrink-0 mt-1 text-xs">›</span>
                  <span className="text-neutral-400 text-sm leading-relaxed">{bullet}</span>
                </li>
              ))}
            </ul>

            {/* Tech badges */}
            {exp.tech && exp.tech.length > 0 && (
              <>
                <div className="border-t border-neutral-800 mb-4" />
                <div className="flex flex-wrap gap-2">
                  {exp.tech.map((t) => (
                    <Badge key={t} variant="accent">
                      {t}
                    </Badge>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}
