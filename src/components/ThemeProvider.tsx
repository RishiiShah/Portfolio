"use client";
import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? (localStorage.getItem("theme") as Theme | null) : null;
    if (stored) {
      setTheme(stored);
      document.documentElement.setAttribute("data-theme", stored);
      return;
    }
    const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
    const next = prefersLight ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("theme", theme); } catch {}
  }, [theme]);

  return (
    <div data-theme={theme}>
      {children}
    </div>
  );
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [current, setCurrent] = useState<Theme>("dark");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? (localStorage.getItem("theme") as Theme | null) : null;
    const initial = stored ?? (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    setCurrent(initial);
  }, []);

  const toggle = () => {
    const next = current === "dark" ? "light" : "dark";
    setCurrent(next);
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch {}
  };

  return (
    <button onClick={toggle} className={`text-xs sm:text-sm px-2 py-1 rounded-md border transition-all duration-300 hover:scale-105 ${className}`} aria-label="Toggle theme">
      {current === "dark" ? "Light" : "Dark"}
    </button>
  );
}


