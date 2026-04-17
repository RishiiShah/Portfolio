"use client";

import { type ReactNode, useId } from "react";

interface MarqueeProps {
  children: ReactNode;
  /** Duration in seconds for one full loop. Smaller = faster. */
  duration?: number;
  /** Scroll direction. */
  direction?: "left" | "right";
  /** Pause animation when hovered. */
  pauseOnHover?: boolean;
  className?: string;
  gap?: number;
}

/**
 * Seamless infinite horizontal marquee using a duplicated child stream and
 * a CSS keyframe translate. GPU-composited transform only; no JS per frame.
 */
export function Marquee({
  children,
  duration = 40,
  direction = "left",
  pauseOnHover = true,
  className = "",
  gap = 16,
}: MarqueeProps) {
  const id = useId().replace(/:/g, "");
  const animName = `marquee-${id}`;

  return (
    <div
      className={`group/marquee relative overflow-hidden ${className}`}
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
      }}
    >
      <style>{`
        @keyframes ${animName} {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
      <div
        className="flex w-max items-center"
        style={{
          gap: `${gap}px`,
          animation: `${animName} ${duration}s linear infinite`,
          animationDirection: direction === "right" ? "reverse" : "normal",
          animationPlayState: "running",
          willChange: "transform",
        }}
        {...(pauseOnHover
          ? {
              onMouseEnter: (e) => {
                (e.currentTarget.style as CSSStyleDeclaration).animationPlayState =
                  "paused";
              },
              onMouseLeave: (e) => {
                (e.currentTarget.style as CSSStyleDeclaration).animationPlayState =
                  "running";
              },
            }
          : {})}
      >
        {/* Stream A */}
        <div className="flex shrink-0 items-center" style={{ gap: `${gap}px` }}>
          {children}
        </div>
        {/* Stream B (duplicate for seamless loop) */}
        <div
          className="flex shrink-0 items-center"
          style={{ gap: `${gap}px` }}
          aria-hidden
        >
          {children}
        </div>
      </div>
    </div>
  );
}
