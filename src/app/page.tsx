import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Publications } from "@/components/sections/Publications";
import { Contact } from "@/components/sections/Contact";

export default function Page() {
  return (
    <main>
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Publications />
      <Contact />
      <footer className="py-8 px-6 border-t border-neutral-800/50">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-neutral-600 text-sm font-mono">
            © {new Date().getFullYear()} Rishabh Shah
          </p>
          <p className="text-neutral-700 text-xs">
            Built with Next.js & Framer Motion
          </p>
        </div>
      </footer>
    </main>
  );
}
