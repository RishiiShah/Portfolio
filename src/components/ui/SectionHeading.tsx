"use client";

import { useRef } from "react";
import { m, useScroll, useTransform } from "framer-motion";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  index?: string;
  backgroundText?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  index,
  backgroundText,
}: SectionHeadingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLElement | null>(
    typeof document !== "undefined" ? document.body : null
  );
  const { scrollYProgress } = useScroll({
    container: containerRef,
    target: ref,
    offset: ["start end", "end start"],
  });
  const x = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);

  return (
    <div ref={ref} className="relative mb-12 md:mb-14">
      {backgroundText && (
        <m.div
          aria-hidden
          style={{ x }}
          className="pointer-events-none absolute -top-12 -left-1 select-none font-serif font-normal leading-none md:-left-6"
        >
          <span
            className="block"
            style={{
              fontSize: "clamp(6rem, 14vw, 11rem)",
              color: "var(--ink-mute)",
              opacity: 0.06,
              letterSpacing: "-0.04em",
            }}
          >
            {backgroundText}
          </span>
        </m.div>
      )}
      <div className="relative z-10">
        <div className="flex items-center gap-2.5 mb-4">
          <span className="h-px w-8 bg-[var(--accent)]/60" />
          <p className="font-mono text-[11px] text-[var(--accent)] tracking-[0.18em] uppercase">
            {index ? `${index} · ` : ""}
            {eyebrow}
          </p>
        </div>
        <h2
          className="font-serif text-[var(--ink)] leading-[1.08] tracking-tight"
          style={{ fontSize: "clamp(2rem, 4.5vw, 3rem)" }}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="mt-3 text-[0.9375rem] text-[var(--ink-dim)] max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
