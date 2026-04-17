"use client";

import { useRef, type ReactNode } from "react";
import { m, useScroll, useTransform, useReducedMotion } from "framer-motion";

interface ParallaxProps {
  children: ReactNode;
  /** Pixels of offset across the section's scroll range. Positive = down on scroll. */
  offset?: number;
  className?: string;
}

/**
 * Applies a subtle scroll-linked y-translate across the section's viewport range.
 * Use inside a section to parallax columns against each other.
 */
export function Parallax({ children, offset = 20, className = "" }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);

  if (reduce) {
    return (
      <div ref={ref} className={`relative ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <m.div
      ref={ref}
      style={{ y }}
      data-motion="parallax"
      className={`relative ${className}`}
    >
      {children}
    </m.div>
  );
}
