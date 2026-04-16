"use client";

import { motion } from "framer-motion";
import { skills } from "@/data";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { fadeInUp, staggerContainer, viewportConfig } from "@/lib/animations";

export function Skills() {
  return (
    <SectionWrapper id="skills">
      <SectionHeading label="02 / Skills" title="Technical Skills" />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2"
      >
        {skills.map((skillGroup) => (
          <motion.div
            key={skillGroup.category}
            variants={fadeInUp}
            className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 hover:border-neutral-700 transition-all duration-200"
          >
            <p className="text-sm font-mono text-sky-400 uppercase tracking-widest mb-4">
              {skillGroup.category}
            </p>
            <div className="flex flex-wrap gap-2">
              {skillGroup.items.map((item) => (
                <Badge key={item} variant="default">
                  {item}
                </Badge>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}
