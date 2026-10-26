"use client";

import { useSyncExternalStore } from "react";

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

  const toggle = () => {
    const next: Theme = dark ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      className="group relative grid size-9 place-items-center overflow-hidden rounded-full border border-line-2 transition-colors hover:border-ink"
    >
      <span
        aria-hidden
        className={`absolute size-4 rounded-full bg-sun transition-all duration-500 ease-[cubic-bezier(0.34,1.6,0.5,1)] ${
          dark ? "translate-y-6 scale-50 opacity-0" : "group-hover:rotate-90"
        }`}
      >
        <span className="absolute inset-[-5px] rounded-full border-2 border-dotted border-sun" />
      </span>
      <span
        aria-hidden
        className={`absolute size-4 rounded-full shadow-[inset_-5px_-2px_0_0_var(--color-ink)] transition-all duration-500 ease-[cubic-bezier(0.34,1.6,0.5,1)] ${
          dark ? "group-hover:-rotate-12" : "-translate-y-6 scale-50 opacity-0"
        }`}
      />
    </button>
  );
}
