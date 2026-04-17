"use client";

import { m, useReducedMotion } from "framer-motion";
import { bio, projects } from "@/data";
import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { HeroShader } from "@/components/shaders/HeroShader";
import { Tilt } from "@/components/ui/Tilt";
import { HeroSignalPanel } from "@/components/ui/HeroSignalPanel";

const fadeUp = (delay = 0, duration = 0.55) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export function Hero() {
  const reduce = useReducedMotion();
  const latest = projects.find((p) => p.latest);

  const nameLetters = bio.name.split("");

  return (
    <section
      id="top"
      className="relative flex min-h-screen min-h-[100svh] items-start md:items-center"
    >
      {/* WebGL shader background */}
      <HeroShader className="z-0" />

      {/* Veil to ensure legibility */}
      <div
        aria-hidden
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(7,9,15,0.25) 0%, rgba(7,9,15,0.55) 100%)",
        }}
      />

      <div className="relative z-[2] mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24 md:py-28">
        <div className="flex flex-col-reverse items-center justify-between gap-10 md:flex-row lg:gap-16">
          {/* Left: content */}
          <div className="w-full max-w-2xl flex-1">
            {/* Status pill */}
            <m.div {...fadeUp(0, 0.35)}>
              <span className="inline-flex max-w-full flex-wrap items-center gap-x-2 gap-y-1 rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ink-dim)] glass-panel">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-signal)] animate-pulse" />
                Open to roles · Spring 2026 · {bio.location}
              </span>
            </m.div>

            {/* Name: 3D tilted, serif, amber period */}
            <div className="mt-6 mb-7">
              <Tilt max={7} perspective={1600} className="inline-block">
                <h1
                  className="font-serif leading-[1.02] tracking-tight text-[var(--ink)]"
                  style={{
                    fontSize: "clamp(3rem, 9vw, 5.5rem)",
                    textShadow: "0 2px 40px rgba(122,162,255,0.15)",
                  }}
                >
                  {nameLetters.map((char, i) => {
                    if (char === " ") return <span key={i}>&nbsp;</span>;
                    return (
                      <m.span
                        key={i}
                        className="inline-block"
                        initial={{ opacity: 0, y: 24, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                          duration: 0.55,
                          delay: 0.12 + i * 0.035,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      >
                        {char}
                      </m.span>
                    );
                  })}
                  <m.span
                    className="inline-block"
                    style={{ color: "var(--accent-warm)" }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={
                      reduce
                        ? { opacity: 1, scale: 1 }
                        : { opacity: 1, scale: [0.5, 1.25, 1] }
                    }
                    transition={{
                      duration: 0.7,
                      delay: 0.12 + nameLetters.length * 0.035,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    .
                  </m.span>
                </h1>
              </Tilt>
            </div>

            {/* Title subtitle */}
            <m.p
              {...fadeUp(0.55)}
              className="max-w-xl text-base leading-relaxed text-[var(--ink-dim)] sm:text-lg md:text-xl"
            >
              <span className="text-[var(--ink)]">{bio.title}</span>
              {". I build scalable "}
              <span className="text-[var(--ink)]">backend systems</span>,{" "}
              <span className="text-[var(--ink)]">ML pipelines</span>, and
              research-grade{" "}
              <span className="text-[var(--ink)]">computer vision</span>.
            </m.p>

            {/* Currently building */}
            {latest && (
              <m.div
                {...fadeUp(0.65)}
                className="mt-6 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-sm text-[var(--ink-mute)]"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent-signal)]">
                  Now building
                </span>
                <span className="text-[var(--ink-dim)]">
                  <span className="text-[var(--ink)]">{latest.title}</span>
                  {latest.metrics?.[0] && (
                    <>
                      {" · "}
                      <span className="text-[var(--accent-warm)]">
                        {latest.metrics[0].value}
                      </span>{" "}
                      {latest.metrics[0].label.toLowerCase()}
                    </>
                  )}
                </span>
              </m.div>
            )}

            {/* CTAs */}
            <m.div
              {...fadeUp(0.75)}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <a
                href="#work"
                className="glass-button px-7 py-3 text-sm font-medium flex items-center gap-2 group"
              >
                Explore the work
                <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
              </a>
              <a
                href={bio.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="ghost-button px-7 py-3 text-sm font-medium flex items-center gap-2"
              >
                Resume <ArrowUpRight className="w-4 h-4" />
              </a>
            </m.div>

            {/* Socials row */}
            <m.div
              {...fadeUp(0.85)}
              className="mt-7 flex items-center gap-5"
            >
              <a
                href={bio.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--ink-mute)] hover:text-[var(--ink)] transition-colors"
                aria-label="GitHub"
              >
                <FiGithub size={18} />
              </a>
              <a
                href={bio.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--ink-mute)] hover:text-[var(--ink)] transition-colors"
                aria-label="LinkedIn"
              >
                <FiLinkedin size={18} />
              </a>
              <a
                href={`mailto:${bio.email}`}
                className="text-[var(--ink-mute)] hover:text-[var(--ink)] transition-colors"
                aria-label="Email"
              >
                <FiMail size={18} />
              </a>
            </m.div>
          </div>

          {/* Right: signal panel */}
          <m.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.78, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="w-full md:w-[420px] lg:w-[460px] shrink-0"
          >
            <HeroSignalPanel />
          </m.div>
        </div>

        {/* Scroll hint */}
        <m.div
          {...fadeUp(1.1)}
          className="mt-20 hidden md:flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ink-mute)]"
        >
          <span>scroll to begin</span>
          <span className="h-px w-12 bg-[var(--line-strong)]" />
        </m.div>
      </div>
    </section>
  );
}
