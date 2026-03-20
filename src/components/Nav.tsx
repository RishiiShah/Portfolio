"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeProvider";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/experience", label: "Experience" },
  { href: "/projects", label: "Projects" },
  { href: "/publications", label: "Publications" },
  { href: "/contact", label: "Contact" },
];

export function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    router.prefetch("/");
    router.prefetch("/experience");
    router.prefetch("/projects");
    router.prefetch("/contact");
  }, [router]);

  return (
    <div className="fixed top-0 left-0 w-full z-50 px-[2vw] sm:px-[3vw] lg:px-[4vw] py-[1.5vh] sm:py-[3vh] pointer-events-none flex justify-center">
      <nav className="pointer-events-auto w-full md:w-fit rounded-xl md:rounded-2xl backdrop-blur-md bg-background/40 border border-white/10 shadow-lg shadow-black/20 transition-all duration-300 overflow-hidden">
        <div className="px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 flex items-center justify-between md:justify-center md:gap-[2vw] lg:gap-[3vw]">

          {/* Logo: <Rishi /> */}
          <Link href="/" className="group flex items-center gap-0.5 font-mono font-bold text-sm uppercase tracking-tighter transition-all duration-300">
            <span className="text-accent/60 group-hover:text-accent transition-colors duration-200">&lt;</span>
            <span className="text-foreground group-hover:text-accent transition-colors duration-200">Rishi</span>
            <span className="text-accent/60 group-hover:text-accent transition-colors duration-200">/&gt;</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-8 text-[10px] font-mono uppercase tracking-[0.25em] items-center">
            {links.map((l) => {
              const isActive = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`relative py-1 group transition-colors duration-200 ${isActive ? "text-accent" : "text-foreground/40 hover:text-foreground"}`}
                >
                  {l.label}
                  {/* Animated underline */}
                  <span
                    className={`absolute bottom-0 left-0 h-[1px] bg-accent transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
                  />
                </Link>
              );
            })}
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md transition-colors duration-300 hover:bg-foreground/5 mr-1"
            aria-label="Toggle menu"
          >
            <div className="w-5 h-5 flex flex-col justify-center items-center gap-1">
              <span className={`block w-4 h-0.5 bg-foreground transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
              <span className={`block w-4 h-0.5 bg-foreground transition-all duration-300 ${isMenuOpen ? "opacity-0" : ""}`} />
              <span className={`block w-4 h-0.5 bg-foreground transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
          <div className="px-5 sm:px-6 py-4 border-t border-white/5 bg-background/50 backdrop-blur-none">
            <div className="flex flex-col space-y-1">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`text-xs font-mono uppercase tracking-widest py-2.5 transition-colors duration-200 border-b border-foreground/5 last:border-0 ${pathname === l.href ? "text-accent" : "text-foreground/60 hover:text-accent"}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
              <div className="flex items-center justify-end pt-2">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
