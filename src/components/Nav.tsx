"use client";

import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { bio } from "@/data";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { href: "#work", label: "Work" },
  { href: "#experience", label: "Experience" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
] as const;

/**
 * Fixed bar that gains a rule once the page scrolls; on phones the links open as a full-screen
 * menu, rendered outside the header because its backdrop blur would contain a fixed child.
 */
export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fade fixed inset-x-0 top-0 z-50 border-b transition-colors duration-500",
          scrolled ? "border-line bg-bg/80 backdrop-blur-md" : "border-transparent",
        )}
        style={{ "--d": "0.5s" } as React.CSSProperties}
      >
        <div className="px-[max(1.25rem,4vw)]">
          <div className="mx-auto flex h-16 max-w-[90rem] items-center justify-between gap-6">
            <a href="#top" className="display text-[1.6rem] leading-none">
              {bio.name}
            </a>

            <nav aria-label="Sections" className="hidden md:block">
              <ul className="flex items-center gap-8 text-sm text-ink-2">
                {links.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} className="link-line pb-0.5 transition-colors hover:text-ink">
                      {l.label}
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
                className="hidden h-9 items-center gap-1.5 rounded-full bg-ink px-4 text-sm text-bg transition-colors hover:bg-accent hover:text-accent-ink sm:flex"
              >
                Résumé <ArrowUpRight size={14} />
              </a>
              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-expanded={open}
                aria-controls="menu"
                className="h-9 rounded-full border border-line px-4 text-sm md:hidden"
              >
                Menu
              </button>
            </div>
          </div>
        </div>
      </header>

      {open && (
        <div id="menu" className="fixed inset-0 z-50 flex flex-col bg-bg px-[max(1.25rem,4vw)] md:hidden">
          <div className="flex h-16 items-center justify-between">
            <span className="display text-[1.6rem] leading-none">{bio.name}</span>
            <button type="button" onClick={() => setOpen(false)} className="h-9 rounded-full border border-line px-4 text-sm">
              Close
            </button>
          </div>
          <ul className="mt-[8vh] space-y-2">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setOpen(false)} className="display block text-[clamp(3rem,14vw,5rem)]">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={bio.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto mb-10 inline-flex items-center gap-1.5 text-ink-2"
          >
            Résumé <ArrowUpRight size={14} />
          </a>
        </div>
      )}
    </>
  );
}
