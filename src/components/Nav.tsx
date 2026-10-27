"use client";

import { useEffect, useState } from "react";
import { bio, sections } from "@/data";
import { ThemeToggle } from "@/components/ThemeToggle";

const links = sections.filter((s) => s.id !== "contact");

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

function useActiveSection() {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter((el): el is HTMLElement => !!el);
    // A section counts as current while it crosses the band just below the header.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-30% 0px -65% 0px" },
    );
    els.forEach((el) => io.observe(el));
    const onScroll = () => {
      if (els[0] && window.scrollY < els[0].offsetTop - window.innerHeight * 0.3) setActive(null);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  return active;
}

export function Nav() {
  const time = useNewJerseyTime();
  const active = useActiveSection();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onResize = () => window.innerWidth >= 768 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
        solid ? "border-b border-line bg-bg/80 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <nav className="shell flex h-16 items-center justify-between gap-6" aria-label="Main">
        <a href="#top" onClick={() => setOpen(false)} className="group flex items-center gap-3" aria-label={`${bio.name}, back to top`}>
          <span className="grid size-8 place-items-center rounded-full bg-ink font-display text-sm font-bold text-bg transition-colors group-hover:bg-accent">
            RS
          </span>
          <span className="label hidden !text-ink-2 sm:inline">
            New Brunswick{time ? ` · ${time} ET` : ""}
          </span>
        </a>

        <div className="flex items-center gap-1 text-sm">
          <ul className="mr-2 hidden items-center gap-1 md:flex">
            {links.map((l) => {
              const on = active === l.id;
              return (
                <li key={l.id}>
                  <a
                    href={`#${l.id}`}
                    aria-current={on ? "location" : undefined}
                    className={`relative rounded-lg px-3 py-2 transition-colors ${on ? "text-ink" : "text-ink-2 hover:text-ink"}`}
                  >
                    {l.label}
                    <span
                      aria-hidden
                      className={`absolute inset-x-3 -bottom-0.5 h-0.5 origin-left rounded-full bg-accent transition-transform duration-500 ease-out-expo ${
                        on ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </a>
                </li>
              );
            })}
          </ul>
          <ThemeToggle />
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="ml-2 inline-flex h-9 items-center rounded-lg bg-accent px-4 font-medium text-accent-ink transition-transform hover:-translate-y-0.5"
          >
            Contact
          </a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="ml-1 grid size-9 place-items-center rounded-lg border border-line-2 md:hidden"
          >
            <span aria-hidden className="relative block h-3 w-4">
              <span className={`absolute left-0 h-0.5 w-4 rounded-full bg-ink transition-all duration-300 ${open ? "top-[5px] rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 top-[5px] h-0.5 w-4 rounded-full bg-ink transition-opacity duration-200 ${open ? "opacity-0" : ""}`} />
              <span className={`absolute left-0 h-0.5 w-4 rounded-full bg-ink transition-all duration-300 ${open ? "top-[5px] -rotate-45" : "top-[10px]"}`} />
            </span>
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        className={`grid transition-[grid-template-rows] duration-500 ease-out-expo md:hidden ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden" inert={!open}>
          <ul className="shell pb-6 pt-2">
            {links.map((l, i) => (
              <li key={l.id} className="border-t border-line">
                <a
                  href={`#${l.id}`}
                  onClick={() => setOpen(false)}
                  aria-current={active === l.id ? "location" : undefined}
                  className="flex items-baseline justify-between py-4"
                >
                  <span className={`font-display text-3xl font-semibold tracking-tight ${active === l.id ? "text-accent" : ""}`}>{l.label}</span>
                  <span className="font-mono text-xs text-ink-3">0{i + 1}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
