"use client";

import { useSyncExternalStore, type MouseEvent } from "react";
type Theme = "light" | "dark";

function subscribe(onChange: () => void) {
  const mo = new MutationObserver(onChange);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}

const getTheme = (): Theme => (document.documentElement.dataset.theme === "dark" ? "dark" : "light");

export function ThemeToggle() {
  const theme = useSyncExternalStore<Theme | null>(subscribe, getTheme, () => null);
  const dark = theme === "dark";

  const toggle = (e: MouseEvent<HTMLButtonElement>) => {
    const next: Theme = dark ? "light" : "dark";
    const apply = () => {
      document.documentElement.dataset.theme = next;
      try {
        localStorage.setItem("theme", next);
      } catch {}
    };

    if (!document.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      apply();
      return;
    }

    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

    document.startViewTransition(apply).ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 550, easing: "cubic-bezier(0.65, 0, 0.35, 1)", pseudoElement: "::view-transition-new(root)" },
      );
    });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      className="group relative grid size-9 place-items-center overflow-hidden rounded-full border border-line-2 transition-colors hover:border-ink"
    >
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className={`absolute size-[1.15rem] text-ink transition-all duration-500 ease-[cubic-bezier(0.34,1.6,0.5,1)] ${
          dark ? "translate-y-6 scale-50 opacity-0" : "group-hover:rotate-45"
        }`}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      >
        <circle cx="12" cy="12" r="4" className="fill-sun stroke-ink" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className={`absolute size-[1.15rem] text-ink transition-all duration-500 ease-[cubic-bezier(0.34,1.6,0.5,1)] ${
          dark ? "group-hover:-rotate-12" : "-translate-y-6 scale-50 opacity-0"
        }`}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinejoin="round"
      >
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" className="fill-sun" />
      </svg>
    </button>
  );
}
