import { bio } from "@/data";

export function Footer() {
  return (
    <footer className="border-t border-[var(--line)] pt-10 pb-[calc(6.5rem+env(safe-area-inset-bottom))] md:py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-xs text-[var(--ink-mute)] sm:flex-row sm:px-6">
        <p className="font-mono">
          rishabh<span className="text-[var(--accent-warm)]">.</span>
        </p>
        <p className="text-center leading-relaxed">
          © {new Date().getFullYear()} {bio.name}
          <span className="mx-2 text-[var(--line-strong)]">·</span>
          Next.js 16
          <span className="mx-2 text-[var(--line-strong)]">·</span>
          GLSL shaders
          <span className="mx-2 text-[var(--line-strong)]">·</span>
          Framer Motion
        </p>
        <div className="flex items-center gap-4">
          <a
            href={bio.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--ink-dim)] transition-colors"
          >
            GitHub
          </a>
          <a
            href={bio.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--ink-dim)] transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
