"use client";

import { useCallback, useEffect, useState } from "react";
import { FiGithub, FiMenu, FiX } from "react-icons/fi";
import { bio } from "@/data";

const navLinks = [
  { label: "About", id: "about" },
  { label: "Skills", id: "skills" },
  { label: "Experience", id: "experience" },
  { label: "Projects", id: "projects" },
  { label: "Publications", id: "publications" },
  { label: "Contact", id: "contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    setMobileOpen(false);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "-80px 0px -40% 0px",
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0a0a0a]/90 backdrop-blur-md border-b border-neutral-800/50"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <button
          onClick={() => scrollToSection("hero")}
          className="text-lg font-bold text-white transition-opacity hover:opacity-80"
          aria-label="Go to top"
        >
          <span className="text-sky-400">R</span>S
        </button>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150 ${
                activeSection === link.id
                  ? "text-sky-400"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {link.label}
            </button>
          ))}

          <a
            href={bio.github}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 rounded-md p-2 text-neutral-400 transition-colors hover:text-white"
            aria-label="GitHub"
          >
            <FiGithub size={18} />
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="rounded-md p-2 text-neutral-400 transition-colors hover:text-white md:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="border-t border-neutral-800/50 bg-[#0a0a0a]/95 backdrop-blur-md md:hidden">
          <div className="mx-auto max-w-6xl px-6 py-4">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className={`rounded-md px-3 py-2.5 text-left text-sm font-medium transition-colors duration-150 ${
                    activeSection === link.id
                      ? "text-sky-400"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  {link.label}
                </button>
              ))}
              <a
                href={bio.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm text-neutral-400 transition-colors hover:text-white"
              >
                <FiGithub size={16} />
                GitHub
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
