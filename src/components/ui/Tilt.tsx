"use client";

import { useRef, type ReactNode } from "react";
import {
  m,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";

interface TiltProps {
  children: ReactNode;
  className?: string;
  /** Max tilt in degrees */
  max?: number;
  /** Invert tilt direction */
  invert?: boolean;
  /** Show glare highlight on hover */
  glare?: boolean;
  /** perspective in px */
  perspective?: number;
}

export function Tilt({
  children,
  className = "",
  max = 8,
  invert = false,
  glare = false,
  perspective = 1200,
}: TiltProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const sx = useSpring(mx, { stiffness: 260, damping: 22, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 260, damping: 22, mass: 0.6 });

  const rx = useTransform(sy, [-0.5, 0.5], [invert ? -max : max, invert ? max : -max]);
  const ry = useTransform(sx, [-0.5, 0.5], [invert ? max : -max, invert ? -max : max]);

  const glareX = useTransform(sx, [-0.5, 0.5], ["-20%", "120%"]);
  const glareOpacity = useMotionValue(0);
  const glareSpring = useSpring(glareOpacity, { stiffness: 180, damping: 20 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    mx.set(nx);
    my.set(ny);
  };

  const onEnter = () => {
    if (reduce) return;
    glareOpacity.set(1);
  };

  const onLeave = () => {
    mx.set(0);
    my.set(0);
    glareOpacity.set(0);
  };

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <m.div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      data-motion="tilt"
      className={`relative ${className}`}
      style={{
        perspective,
        transformStyle: "preserve-3d",
        rotateX: rx,
        rotateY: ry,
      }}
    >
      {children}
      {glare && (
        <m.div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
          style={{ opacity: glareSpring }}
        >
          <m.div
            className="absolute inset-y-0 w-1/3"
            style={{
              left: glareX,
              background:
                "linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)",
              transform: "skewX(-18deg)",
            }}
          />
        </m.div>
      )}
    </m.div>
  );
}
