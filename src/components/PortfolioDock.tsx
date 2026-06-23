"use client";

import { useState, useEffect } from "react";
import { m, useScroll, useSpring } from "framer-motion";
import { Dock, DockIcon } from "@/components/ui/Dock";
import { bio } from "@/data";
import {
  House,
  Code2,
  ScrollText,
  Briefcase,
  Layers,
  GraduationCap,
  User,
  Mail,
  FileDown,
} from "lucide-react";
import { FiGithub, FiLinkedin } from "react-icons/fi";

const NAV_ITEMS = [
  { label: "Home", href: "#top", icon: House, id: "top" },
  { label: "Projects", href: "#work", icon: Code2, id: "work" },
  { label: "Publications", href: "#publications", icon: ScrollText, id: "publications" },
  { label: "Experience", href: "#experience", icon: Briefcase, id: "experience" },
  { label: "Stack", href: "#skills", icon: Layers, id: "skills" },
  { label: "Education", href: "#education", icon: GraduationCap, id: "education" },
  { label: "About", href: "#about", icon: User, id: "about" },
  { label: "Contact", href: "#contact", icon: Mail, id: "contact" },
] as const;

const SOCIAL_ITEMS = [
  { label: "GitHub", href: bio.github, icon: FiGithub },
  { label: "LinkedIn", href: bio.linkedin, icon: FiLinkedin },
  { label: "Resume", href: bio.resume, icon: FileDown },
] as const;

export function PortfolioDock() {
  const [activeSection, setActiveSection] = useState<string>("top");
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40 });

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <nav
        aria-label="Primary mobile"
        className="fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom))] left-1/2 z-40 w-fit max-w-[calc(100vw-1.5rem)] -translate-x-1/2 md:hidden"
      >
        <div className="absolute inset-0 rounded-2xl bg-[var(--accent)]/5 blur-xl" />
        <div className="relative overflow-hidden rounded-2xl border border-[var(--line-strong)] bg-[var(--bg-elev-1)]/90 px-2 py-2 shadow-[0_18px_48px_rgba(0,0,0,0.48)] backdrop-blur-xl">
          <div className="absolute left-3 right-3 top-0 h-[2px] overflow-hidden rounded-full">
            <m.div
              className="h-full origin-left rounded-full"
              style={{
                scaleX: progress,
                background:
                  "linear-gradient(90deg, var(--accent), var(--accent-warm))",
              }}
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              const Icon = item.icon;

              return (
                <a
                  key={item.label}
                  href={item.href}
                  aria-label={item.label}
                  title={item.label}
                  className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors duration-200 ${
                    isActive
                      ? "text-[var(--accent)]"
                      : "text-[var(--ink-mute)] hover:text-[var(--ink)]"
                  }`}
                  style={
                    isActive
                      ? { filter: "drop-shadow(0 0 6px rgba(122,162,255,0.7))" }
                      : undefined
                  }
                >
                  {isActive && (
                    <m.span
                      layoutId="activeMobileNavLink"
                      className="absolute inset-1 rounded-full bg-[var(--accent)]/10 ring-1 ring-[var(--accent)]/25"
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    />
                  )}
                  <Icon size={15} className="relative z-10" />
                </a>
              );
            })}
          </div>
        </div>
      </nav>

      <nav
        aria-label="Primary"
        className="fixed bottom-5 left-1/2 z-40 hidden -translate-x-1/2 md:flex"
      >
      {/* Outer glow */}
      <div className="absolute inset-0 rounded-2xl bg-[var(--accent)]/5 blur-xl" />

      <div className="relative">
        {/* Scroll progress hairline */}
        <div className="absolute -top-[2px] left-3 right-3 h-[2px] overflow-hidden rounded-full">
          <m.div
            className="h-full origin-left rounded-full"
            style={{
              scaleX: progress,
              background:
                "linear-gradient(90deg, var(--accent), var(--accent-warm))",
            }}
          />
        </div>

        <Dock iconSize={36} iconMagnification={56} iconDistance={130}>
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            const Icon = item.icon;

            return (
              <DockIcon key={item.label}>
                <div className="group/tip relative flex h-full w-full items-center justify-center">
                  <span className="pointer-events-none absolute bottom-full left-1/2 mb-2.5 -translate-x-1/2 whitespace-nowrap rounded-md border border-[var(--line-strong)] bg-[var(--bg-elev-2)] px-2 py-0.5 font-mono text-[11px] text-[var(--ink)] opacity-0 shadow-lg transition-opacity duration-150 group-hover/tip:opacity-100">
                    {item.label}
                  </span>
                  <a
                    href={item.href}
                    aria-label={item.label}
                    className={`relative flex h-full w-full items-center justify-center rounded-full transition-colors duration-200 ${
                      isActive
                        ? "text-[var(--accent)]"
                        : "text-[var(--ink-mute)] hover:text-[var(--ink)]"
                    }`}
                    style={
                      isActive
                        ? { filter: "drop-shadow(0 0 6px rgba(122,162,255,0.8))" }
                        : undefined
                    }
                  >
                    {isActive && (
                      <m.span
                        layoutId="activeDockLink"
                        className="absolute bottom-1 left-1/2 h-[2px] w-4 -translate-x-1/2 rounded-full bg-[var(--accent)]"
                        style={{
                          boxShadow: "0 0 8px 1px rgba(122,162,255,0.8)",
                        }}
                      />
                    )}
                    <Icon size={16} />
                  </a>
                </div>
              </DockIcon>
            );
          })}

          <div className="mx-1 h-6 w-px self-center rounded-full bg-[var(--line-strong)]" />

          {SOCIAL_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <DockIcon key={item.label}>
                <div className="group/tip relative flex h-full w-full items-center justify-center">
                  <span className="pointer-events-none absolute bottom-full left-1/2 mb-2.5 -translate-x-1/2 whitespace-nowrap rounded-md border border-[var(--line-strong)] bg-[var(--bg-elev-2)] px-2 py-0.5 font-mono text-[11px] text-[var(--ink)] opacity-0 shadow-lg transition-opacity duration-150 group-hover/tip:opacity-100">
                    {item.label}
                  </span>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    className="flex h-full w-full items-center justify-center rounded-full text-[var(--ink-mute)] transition-colors duration-150 hover:text-[var(--ink)]"
                  >
                    <Icon size={16} />
                  </a>
                </div>
              </DockIcon>
            );
          })}
        </Dock>
      </div>
      </nav>
    </>
  );
}
