"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import type { MouseEvent } from "react";
import { flushSync } from "react-dom";

const subscribe = () => () => {};

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const isDark = mounted && resolvedTheme === "dark";

  // The new theme grows out of the button as a circle. Browsers without view transitions,
  // and reduced motion, switch instantly.
  const toggle = (e: MouseEvent<HTMLButtonElement>) => {
    const next = isDark ? "light" : "dark";
    const root = document.documentElement;
    if (!document.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTheme(next);
      return;
    }
    const box = e.currentTarget.getBoundingClientRect();
    const x = e.clientX || box.left + box.width / 2;
    const y = e.clientY || box.top + box.height / 2;
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const t = document.startViewTransition(() => {
      root.dataset.theme = next; // canvases repaint from this attribute before the new snapshot
      root.style.colorScheme = next;
      flushSync(() => setTheme(next));
    });
    t.ready.then(() =>
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 750, easing: "cubic-bezier(0.65, 0, 0.35, 1)", pseudoElement: "::view-transition-new(root)" }
      )
    );
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="grid size-9 place-items-center border border-line text-ink-2 transition-colors hover:border-ink hover:text-ink"
    >
      {mounted ? isDark ? <Sun size={15} /> : <Moon size={15} /> : <span className="size-[15px]" />}
    </button>
  );
}
