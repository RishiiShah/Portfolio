"use client";

import { m, useReducedMotion } from "framer-motion";
import dynamic from "next/dynamic";
import { bio } from "@/data";
import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Tilt } from "@/components/ui/Tilt";
import { HeroSignalPanel } from "@/components/ui/HeroSignalPanel";

const HeroShader = dynamic(
  () =>
    new Promise<typeof import("@/components/shaders/HeroShader")>((resolve) => {
      // Defer loading the heavy shader chunk to prioritize LCP
      setTimeout(() => resolve(import("@/components/shaders/HeroShader")), 250);
    }).then((m) => ({ default: m.HeroShader })),
  {
    ssr: false,
    loading: () => (
      <div
        aria-hidden
        className="absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(122,162,255,0.06) 0%, rgba(7,9,15,0) 60%, rgba(230,185,128,0.04) 100%)",
        }}
      />
    ),
  }
);

const heroEase = [0.16, 1, 0.3, 1] as const;

const fadeUp = (delay = 0, duration = 0.78) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration, delay, ease: heroEase },
});

export function Hero() {
  const reduce = useReducedMotion();
  const nameLetters = bio.name.split("");
  const handleContactClick = () => {
    document.getElementById("contact-form")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

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
            {/* Name: 3D tilted, serif, amber period */}
            <div className="mb-7">
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
                        initial={{ opacity: 0, y: 18, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                          duration: 0.72,
                          delay: i * 0.03,
                          ease: heroEase,
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
                      duration: 0.9,
                      delay: nameLetters.length * 0.03,
                      ease: heroEase,
                    }}
                  >
                    .
                  </m.span>
                </h1>
              </Tilt>
            </div>

            {/* Title subtitle */}
            <m.p
              {...fadeUp(0.25)}
              className="max-w-xl text-base leading-relaxed text-[var(--ink-dim)] sm:text-lg md:text-xl"
            >
              <span className="text-[var(--ink)]">{bio.title}</span>
              {". I build scalable "}
              <span className="text-[var(--ink)]">backend systems</span>,{" "}
              <span className="text-[var(--ink)]">ML pipelines</span>, and
              research-grade{" "}
              <span className="text-[var(--ink)]">computer vision</span>.
            </m.p>

            {/* CTAs */}
            <m.div
              {...fadeUp(0.35)}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <a
                href="#work"
                className="hero-shader-button px-7 py-3 text-sm font-medium flex items-center gap-2 group"
              >
                Explore the work
                <ArrowDown className="w-4 h-4 transition-transform duration-500 ease-out group-hover:translate-y-1" />
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
              {...fadeUp(0.55)}
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
              <button
                type="button"
                onClick={handleContactClick}
                className="text-[var(--ink-mute)] hover:text-[var(--ink)] transition-colors"
                aria-label="Contact form"
              >
                <FiMail size={18} />
              </button>
            </m.div>
          </div>

          {/* Right: signal panel */}
          <m.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.2, ease: heroEase }}
            className="w-full md:w-[420px] lg:w-[460px] shrink-0"
          >
            <HeroSignalPanel />
          </m.div>
        </div>

        {/* Scroll hint */}
        <m.div
          {...fadeUp(0.7)}
          className="mt-20 hidden md:flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ink-mute)]"
        >
          <span>scroll to begin</span>
          <span className="h-px w-12 bg-[var(--line-strong)]" />
        </m.div>
      </div>
    </section>
  );
}
