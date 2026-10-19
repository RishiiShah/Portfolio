"use client";

import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { bio } from "@/data";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

const sections = [
  { id: "work", index: "01", label: "Work" },
  { id: "research", index: "02", label: "Research" },
  { id: "experience", index: "03", label: "Experience" },
  { id: "skills", index: "04", label: "Toolkit" },
  { id: "about", index: "05", label: "About" },
  { id: "contact", index: "06", label: "Contact" },
] as const;

/** Fixed nav: hides while scrolling down, returns on scroll up, tracks the current section. */
export function Nav() {
  const [active, setActive] = useState<string | null>(null);
  const [hidden, setHidden] = useState(false);
  const progress = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progress.current) progress.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
      if (Math.abs(y - lastY) > 6) {
        setHidden(y > lastY && y > window.innerHeight * 0.8);
        lastY = y;
      }
      const line = window.innerHeight * 0.4;
      const current = sections.find((s) => {
        const r = document.getElementById(s.id)?.getBoundingClientRect();
        return r && r.top <= line && r.bottom > line;
      });
      setActive(current?.id ?? null);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b border-line bg-bg/60 backdrop-blur-md transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        hidden && "-translate-y-full"
      )}
      onFocusCapture={() => setHidden(false)}
    >
      <div className="flex h-14 items-center justify-between gap-6 px-[max(1rem,4vw)]">
        <a href="#top" className="flex items-center gap-3 font-semibold tracking-tight">
          <span className="wide grid size-7 place-items-center bg-ink text-[11px] font-extrabold text-bg">RS</span>
          <span className="hidden sm:inline">{bio.name}</span>
        </a>

        <nav aria-label="Sections" className="hidden md:block">
          <ul className="flex items-center gap-[clamp(1rem,2vw,2rem)]">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  aria-current={active === s.id ? "location" : undefined}
                  className="group relative flex items-baseline gap-1.5 py-1 text-sm text-ink-2 transition-colors hover:text-ink aria-[current]:text-ink"
                >
                  <span className="font-mono text-[10px] text-ink-3 group-hover:text-accent group-aria-[current]:text-accent">
                    {s.index}
                  </span>
                  {s.label}
                  <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-accent transition-transform duration-500 group-hover:scale-x-100 group-aria-[current]:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href={bio.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 items-center gap-1.5 bg-ink px-4 text-sm font-medium text-bg transition-colors hover:bg-accent hover:text-accent-ink"
          >
            Résumé <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
      <span ref={progress} aria-hidden="true" className="absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-accent" />
    </header>
  );
}
