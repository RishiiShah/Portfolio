"use client";

import { motion } from "framer-motion";
import { FiDownload, FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import { bio } from "@/data";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export function Hero() {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center px-6 pt-16">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto w-full"
      >
        {/* Label */}
        <motion.p
          variants={fadeInUp}
          className="text-sm font-mono text-sky-400 uppercase tracking-widest mb-4"
        >
          Hello, I&apos;m
        </motion.p>

        {/* Name */}
        <motion.h1
          variants={fadeInUp}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-4"
        >
          {bio.name}
        </motion.h1>

        {/* Title */}
        <motion.p
          variants={fadeInUp}
          className="text-2xl sm:text-3xl text-neutral-400 font-light mb-5"
        >
          {bio.title}
        </motion.p>

        {/* Description */}
        <motion.p
          variants={fadeInUp}
          className="text-neutral-500 text-lg max-w-xl leading-relaxed mb-8"
        >
          {bio.description}
        </motion.p>

        {/* Buttons */}
        <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-3 mb-8">
          <button
            onClick={() => scrollToSection("projects")}
            className="rounded-lg bg-sky-400 px-5 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
          >
            View Projects
          </button>
          <a
            href={bio.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg border border-neutral-700 px-5 py-2.5 text-sm font-medium text-neutral-300 transition-colors hover:border-sky-400/50 hover:text-sky-400"
          >
            <FiDownload size={15} />
            Resume
          </a>
        </motion.div>

        {/* Social icons */}
        <motion.div variants={fadeInUp} className="flex items-center gap-4">
          <a
            href={bio.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-500 transition-colors hover:text-sky-400"
            aria-label="GitHub"
          >
            <FiGithub size={20} />
          </a>
          <a
            href={bio.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-500 transition-colors hover:text-sky-400"
            aria-label="LinkedIn"
          >
            <FiLinkedin size={20} />
          </a>
          <a
            href={`mailto:${bio.email}`}
            className="text-neutral-500 transition-colors hover:text-sky-400"
            aria-label="Email"
          >
            <FiMail size={20} />
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <p className="text-xs font-mono text-neutral-600 uppercase tracking-widest">scroll</p>
        <div className="h-8 w-px overflow-hidden bg-neutral-800">
          <motion.div
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
            className="h-full w-full bg-sky-400/60"
          />
        </div>
      </div>
    </section>
  );
}
