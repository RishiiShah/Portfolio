"use client";

import React, { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import type { MotionValue } from "framer-motion";

const DEFAULT_SIZE = 40;
const DEFAULT_MAGNIFICATION = 60;
const DEFAULT_DISTANCE = 140;

// ─── Dock ─────────────────────────────────────────────────────────────────────

export interface DockProps {
  children: React.ReactNode;
  className?: string;
  iconSize?: number;
  iconMagnification?: number;
  iconDistance?: number;
}

export function Dock({
  children,
  className = "",
  iconSize = DEFAULT_SIZE,
  iconMagnification = DEFAULT_MAGNIFICATION,
  iconDistance = DEFAULT_DISTANCE,
}: DockProps) {
  const mouseX = useMotionValue(Infinity);

  const enhanced = React.Children.map(children, (child) => {
    if (
      React.isValidElement<DockIconProps>(child) &&
      child.type === DockIcon
    ) {
      return React.cloneElement(child, {
        ...child.props,
        mouseX,
        size: iconSize,
        magnification: iconMagnification,
        distance: iconDistance,
      });
    }
    return child;
  });

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={`flex items-center gap-1 rounded-2xl glass-panel px-3 ${className}`}
    >
      {enhanced}
    </motion.div>
  );
}

// ─── DockIcon ─────────────────────────────────────────────────────────────────

export interface DockIconProps {
  size?: number;
  magnification?: number;
  distance?: number;
  mouseX?: MotionValue<number>;
  children?: React.ReactNode;
  className?: string;
}

export function DockIcon({
  size = DEFAULT_SIZE,
  magnification = DEFAULT_MAGNIFICATION,
  distance = DEFAULT_DISTANCE,
  mouseX,
  children,
  className = "",
}: DockIconProps) {
  const ref = useRef<HTMLDivElement>(null);
  const fallbackX = useMotionValue(Infinity);
  const mx = mouseX ?? fallbackX;

  const distFromCenter = useTransform(mx, (val: number) => {
    const b = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - b.x - b.width / 2;
  });

  const rawSize = useTransform(
    distFromCenter,
    [-distance, 0, distance],
    [size, magnification, size]
  );

  const animatedSize = useSpring(rawSize, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  return (
    <motion.div
      ref={ref}
      style={{ width: animatedSize, height: animatedSize }}
      className={`flex cursor-pointer items-center justify-center rounded-full ${className}`}
    >
      {children}
    </motion.div>
  );
}
