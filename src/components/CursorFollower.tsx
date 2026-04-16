"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CursorFollower() {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const ringSpringConfig = { damping: 20, stiffness: 150, mass: 0.8 };

  const dotX = useSpring(cursorX, springConfig);
  const dotY = useSpring(cursorY, springConfig);

  const ringX = useSpring(cursorX, ringSpringConfig);
  const ringY = useSpring(cursorY, ringSpringConfig);

  useEffect(() => {
    // Hide on touch devices
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as Element;
      const interactive = target.closest("a, button, [role='button'], input, textarea, select, label");
      setIsHovering(!!interactive);
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [cursorX, cursorY]);

  if (!isVisible) return null;

  const dotSize = isHovering ? 8 : 6;
  const ringSize = isHovering ? 44 : 32;

  return (
    <>
      {/* Small dot */}
      <motion.div
        style={{
          x: dotX,
          y: dotY,
        }}
        animate={{
          width: dotSize,
          height: dotSize,
        }}
        transition={{ duration: 0.15 }}
        className="pointer-events-none fixed left-0 top-0 z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
      />

      {/* Ring */}
      <motion.div
        style={{
          x: ringX,
          y: ringY,
        }}
        animate={{
          width: ringSize,
          height: ringSize,
          borderColor: isHovering ? "rgba(56, 189, 248, 0.8)" : "rgba(56, 189, 248, 0.5)",
        }}
        transition={{ duration: 0.2 }}
        className="pointer-events-none fixed left-0 top-0 z-[9998] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-sky-400/50"
      />
    </>
  );
}
