"use client";

import { useEffect } from "react";
import { m, useMotionValue, useSpring, useTransform } from "framer-motion";

export function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const hovered = useMotionValue(0);
  const over = useMotionValue(1); // 1 = visible, 0 = hidden over text inputs

  const cursorX = useSpring(x, { stiffness: 420, damping: 30, mass: 0.4 });
  const cursorY = useSpring(y, { stiffness: 420, damping: 30, mass: 0.4 });

  const hoveredSpring = useSpring(hovered, { stiffness: 260, damping: 22 });
  const size = useTransform(hoveredSpring, [0, 1], [12, 36]);
  const borderWidth = useTransform(hoveredSpring, [0, 1], [0, 1]);
  const overSpring = useSpring(over, { stiffness: 260, damping: 24 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    // Hide browser cursor globally, but restore native text caret on form fields.
    const style = document.createElement("style");
    style.setAttribute("data-custom-cursor", "");
    style.textContent = `
      *, *::before, *::after { cursor: none !important; }
      input:not([type='checkbox']):not([type='radio']):not([type='button']):not([type='submit']),
      textarea,
      [contenteditable='true'] {
        cursor: text !important;
      }
    `;
    document.head.appendChild(style);

    let rafId = 0;
    let nextX = 0;
    let nextY = 0;
    let pendingMove = false;

    const applyMove = () => {
      x.set(nextX);
      y.set(nextY);
      pendingMove = false;
      rafId = 0;
    };

    const onMove = (e: MouseEvent) => {
      nextX = e.clientX;
      nextY = e.clientY;
      if (!pendingMove) {
        pendingMove = true;
        rafId = requestAnimationFrame(applyMove);
      }
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (!target) return;

      // Hide custom cursor entirely over text-entry fields so the native
      // caret can take over. This also sidesteps repaint storms caused by
      // mix-blend-mode over backdrop-filter panels while typing.
      const isTextField = !!target.closest(
        "input:not([type='checkbox']):not([type='radio']):not([type='button']):not([type='submit']),textarea,[contenteditable='true']"
      );
      over.set(isTextField ? 0 : 1);

      if (isTextField) {
        hovered.set(0);
        return;
      }

      const isInteractive = !!target.closest(
        "a, button, [role='button'], select, label, [data-cursor-hover]"
      );
      hovered.set(isInteractive ? 1 : 0);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.querySelector("[data-custom-cursor]")?.remove();
    };
  }, [x, y, hovered, over]);

  return (
    <m.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full"
      style={{
        x: cursorX,
        y: cursorY,
        width: size,
        height: size,
        translateX: "-50%",
        translateY: "-50%",
        mixBlendMode: "difference",
        backgroundColor: "#ffffff",
        borderStyle: "solid",
        borderColor: "#ffffff",
        borderWidth,
        opacity: overSpring,
        willChange: "transform, width, height, opacity",
      }}
    />
  );
}
