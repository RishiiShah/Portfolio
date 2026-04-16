"use client";

import { motion } from "framer-motion";
import { FiCalendar, FiMapPin } from "react-icons/fi";
import { bio, education } from "@/data";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { fadeInLeft, fadeInRight, staggerContainer, viewportConfig } from "@/lib/animations";

export function About() {
  return (
    <SectionWrapper id="about">
      <SectionHeading label="01 / About" title="About Me" />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        className="grid grid-cols-1 gap-12 md:grid-cols-2"
      >
        {/* Left column */}
        <motion.div variants={fadeInLeft} className="flex flex-col gap-5">
          <p className="text-neutral-400 leading-relaxed">
            I&apos;m a Computer Science graduate student at Northeastern University, focused on
            building systems at the intersection of machine learning and software engineering. My
            work spans scalable backend architectures, computer vision pipelines, and generative AI
            models — with an emphasis on production-grade reliability.
          </p>
          <p className="text-neutral-400 leading-relaxed">
            I&apos;ve shipped ML systems that achieve 93.76% accuracy in real-time traffic
            violation detection, designed synthetic financial time series generators with WGAN-GP,
            and built backend microservices deployed on AWS. I care about research that translates
            into working software.
          </p>
          <p className="text-neutral-400 leading-relaxed">
            I have three peer-reviewed publications at international conferences, covering computer
            vision, generative models, and IoT systems. I&apos;m actively seeking roles where I can
            bridge rigorous ML research with scalable engineering.
          </p>

          {/* Info row */}
          <div className="flex flex-wrap gap-4 pt-1">
            <div className="flex items-center gap-2 text-sm text-neutral-500">
              <FiMapPin size={14} className="text-sky-400 shrink-0" />
              {bio.location}
            </div>
            <a
              href={`mailto:${bio.email}`}
              className="flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-sky-400"
            >
              <span className="text-sky-400">✉</span>
              {bio.email}
            </a>
          </div>
        </motion.div>

        {/* Right column — Education */}
        <motion.div variants={fadeInRight}>
          <h3 className="text-sm font-mono text-sky-400 uppercase tracking-widest mb-6">
            Education
          </h3>
          <div className="flex flex-col gap-4">
            {education.map((edu, i) => (
              <div
                key={i}
                className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5 hover:border-neutral-700 transition-all duration-200"
              >
                <p className="font-semibold text-white text-sm mb-1">{edu.degree}</p>
                <p className="text-sky-400 text-sm mb-1">{edu.institution}</p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                  <span className="flex items-center gap-1.5 text-neutral-500 text-xs">
                    <FiMapPin size={11} />
                    {edu.location}
                  </span>
                  <span className="flex items-center gap-1.5 text-neutral-500 text-xs">
                    <FiCalendar size={11} />
                    {edu.start} – {edu.end}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </SectionWrapper>
  );
}
