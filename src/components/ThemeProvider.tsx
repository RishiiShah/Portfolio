"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  // Initialize theme immediately on mount
  useEffect(() => {
    const stored = typeof window !== "undefined" ? (localStorage.getItem("theme") as Theme | null) : null;
    let initialTheme: Theme;
    
    if (stored) {
      initialTheme = stored;
    } else {
      const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
      initialTheme = prefersLight ? "light" : "dark";
    }
    
    // Apply theme to HTML element immediately
    document.documentElement.setAttribute("data-theme", initialTheme);
    setTheme(initialTheme);
    setMounted(true);
  }, []);

  // Update theme when it changes
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute("data-theme", theme);
    try { 
      localStorage.setItem("theme", theme); 
    } catch {}
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      // Apply immediately for instant feedback
      document.documentElement.setAttribute("data-theme", next);
      try { 
        localStorage.setItem("theme", next); 
      } catch {}
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const context = useContext(ThemeContext);
  
  if (!context) {
    // Fallback if used outside provider
    return (
      <button className={`relative group transition-all duration-300 hover:scale-105 ${className}`} aria-label="Toggle theme">
        Light
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-foreground transition-all duration-300 group-hover:w-full"></span>
      </button>
    );
  }

  const { theme, toggleTheme } = context;

  return (
    <button 
      onClick={toggleTheme} 
      className={`relative group transition-all duration-300 hover:scale-105 ${className}`} 
      aria-label="Toggle theme"
    >
      {theme === "dark" ? "Light" : "Dark"}
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-foreground transition-all duration-300 group-hover:w-full"></span>
    </button>
  );
}


