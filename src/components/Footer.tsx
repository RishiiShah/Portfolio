import { bio, education } from "@/data";

const index = [
  { href: "#work", label: "Work" },
  { href: "#lab", label: "AI/ML lab" },
  { href: "#experience", label: "Experience" },
  { href: "#research", label: "Research" },
  { href: "#toolkit", label: "Toolkit" },
  { href: "#contact", label: "Contact" },
];

const elsewhere = [
  { href: bio.linkedin, label: "LinkedIn" },
  { href: bio.github, label: "GitHub" },
  { href: bio.resume, label: "Résumé" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-bg-2">
      <div className="shell grid gap-12 pb-12 pt-20 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-5">
          <p className="display text-5xl md:text-6xl">
            Rishabh Shah<span className="text-accent">.</span>
          </p>
          <p className="flourish mt-4 text-2xl text-ink-2">Thanks for scrolling all the way down.</p>
          <p className="mt-8 inline-flex items-center gap-2.5 rounded-xl border border-line-2 bg-bg px-3.5 py-2 text-sm">
            <span className="relative flex size-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-mint" />
              <span className="relative size-2 rounded-full bg-mint" />
            </span>
            Open to SWE &amp; ML roles from {education[0].end}
          </p>
        </div>

        <nav aria-label="Footer" className="md:col-span-2">
          <p className="label">Index</p>
          <ul className="mt-5 space-y-2.5">
            {index.map((l, i) => (
              <li key={l.href}>
                <a href={l.href} className="group inline-flex items-baseline gap-3 text-ink-2 transition-colors hover:text-ink">
                  <span className="font-mono text-xs text-ink-3 transition-colors group-hover:text-accent">0{i + 1}</span>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-2">
          <p className="label">Elsewhere</p>
          <ul className="mt-5 space-y-2.5">
            {elsewhere.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 text-ink-2 transition-colors hover:text-ink"
                >
                  {l.label}
                  <span className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent">
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <p className="label">Colophon</p>
          <p className="mt-5 text-sm leading-relaxed text-ink-2">
            Designed and built from scratch in {bio.location}. Set in Bricolage Grotesque, Geist and Instrument Serif. Made
            with Next.js and Tailwind, every pixel on purpose.
          </p>
        </div>
      </div>

      <div className="shell flex flex-wrap items-center justify-between gap-4 border-t border-line py-6 text-sm text-ink-3">
        <p>
          © {new Date().getFullYear()} {bio.name}
        </p>
        <a
          href="#top"
          data-cursor="up we go"
          className="group inline-flex h-10 items-center gap-2 rounded-xl border border-line-2 px-4 text-ink-2 transition-colors hover:border-ink hover:text-ink"
        >
          Back to top
          <span className="transition-transform duration-300 group-hover:-translate-y-1">↑</span>
        </a>
      </div>

      <p aria-hidden className="display select-none whitespace-nowrap text-center text-[22vw] leading-[0.75] text-bg-3">
        {"Rishabh".split("").map((ch, i) => (
          <span
            key={i}
            className="inline-block transition-[transform,color] duration-500 ease-[cubic-bezier(0.34,1.6,0.5,1)] hover:-translate-y-[0.08em] hover:text-accent"
          >
            {ch}
          </span>
        ))}
      </p>
    </footer>
  );
}
