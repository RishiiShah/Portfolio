"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useTheme } from "next-themes";
import { FiSun, FiMoon } from "react-icons/fi";
import { useSyncExternalStore } from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="dark"
      forcedTheme="dark"
      themes={["dark"]}
      enableSystem={false}
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemesProvider>
  );
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!mounted) {
    return (
      <button
        className={`relative flex items-center justify-center w-9 h-9 rounded-md
                    transition-all duration-300 hover:bg-foreground/5 ${className}`}
        aria-label="Toggle theme"
      >
        <FiMoon className="w-5 h-5" />
      </button>
    );
  }

  const currentTheme = resolvedTheme || theme;

  return (
    <button
      onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      className={`inline-flex items-center justify-center transition-all duration-300 ${className}`}
    >
      {currentTheme === "dark" ? (
        <FiSun className="w-4 h-4 transition-transform duration-300 hover:rotate-12" />
      ) : (
        <FiMoon className="w-4 h-4 transition-transform duration-300 hover:-rotate-12" />
      )}
    </button>
  );
}
