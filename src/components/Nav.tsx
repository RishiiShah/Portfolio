"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeProvider";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/publications", label: "Publications" },
  { href: "/contact", label: "Contact" },
];

export function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  // Prefetch key routes for faster navigation
  useEffect(() => {
    router.prefetch("/");
    router.prefetch("/projects");
    router.prefetch("/contact");
  }, [router]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur bg-background/70 border-b border-black/10 dark:border-white/10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight transition-all duration-300 hover:scale-105 text-lg sm:text-base">Rishabh</Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-4 text-sm items-center">
          {links.map((l) => (
            <Link 
              key={l.href} 
              href={l.href} 
              className="relative group transition-all duration-300 hover:scale-105"
            >
              {l.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-foreground transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
          <ThemeToggle />
          <a 
            href="/resume.pdf" 
            className="px-3 py-1 rounded-md bg-foreground text-background text-xs font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
          >
            Résumé
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 rounded-md hover:bg-foreground/5 transition-colors duration-200"
          aria-label="Toggle menu"
        >
          <div className="w-5 h-5 flex flex-col justify-center items-center">
            <span className={`block w-4 h-0.5 bg-foreground transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1' : ''}`}></span>
            <span className={`block w-4 h-0.5 bg-foreground transition-all duration-300 mt-1 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-4 h-0.5 bg-foreground transition-all duration-300 mt-1 ${isMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}></span>
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="px-4 sm:px-6 lg:px-8 py-4 border-t border-black/10 dark:border-white/10 bg-background/95 backdrop-blur">
          <div className="flex flex-col space-y-3">
            {links.map((l) => (
              <Link 
                key={l.href} 
                href={l.href} 
                className="text-sm font-medium transition-all duration-300 hover:text-foreground/80 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <a 
              href="/resume.pdf" 
              className="px-4 py-2 rounded-md bg-foreground text-background text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 text-center mt-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Download Résumé
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}


