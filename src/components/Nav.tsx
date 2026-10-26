"use client";

import { useEffect, useState } from "react";
import { bio } from "@/data";
import { ThemeToggle } from "@/components/ThemeToggle";

const links = [
  { href: "#work", label: "Work" },
  { href: "#experience", label: "Experience" },
  { href: "#research", label: "Research" },
  { href: "#contact", label: "Contact" },
];

function useNewJerseyTime() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "America/New_York",
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export function Nav() {
  const time = useNewJerseyTime();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
        scrolled ? "border-b border-line bg-bg/70 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <nav className="shell flex h-16 items-center justify-between gap-6">
        <a href="#top" className="group flex items-center gap-3" aria-label={`${bio.name}, back to top`}>
          <span className="grid size-8 place-items-center rounded-full bg-ink font-display text-sm font-bold text-bg transition-colors group-hover:bg-accent">
            RS
          </span>
          <span className="label hidden !text-ink-2 sm:inline">
            New Brunswick{time ? ` · ${time} ET` : ""}
          </span>
        </a>
        <ul className="flex items-center gap-1 text-sm">
          <li className="mr-1">
            <ThemeToggle />
          </li>
          {links.map((l) => (
            <li key={l.href} className={l.href === "#contact" ? "" : "hidden md:block"}>
              <a
                href={l.href}
                className={
                  l.href === "#contact"
                    ? "ml-2 inline-flex h-9 items-center rounded-full bg-accent px-4 font-medium text-accent-ink transition-transform hover:-translate-y-0.5"
                    : "rounded-full px-3 py-2 text-ink-2 transition-colors hover:text-ink"
                }
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
