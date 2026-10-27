import { bio, education, sections } from "@/data";

const index = sections.map((s) => ({ href: `#${s.id}`, label: s.label }));

const elsewhere = [
  { href: `mailto:${bio.email}`, label: "Email" },
  { href: bio.linkedin, label: "LinkedIn" },
  { href: bio.github, label: "GitHub" },
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
          <p className="mt-8 inline-flex items-center rounded-xl border border-line-2 bg-bg px-3.5 py-2 text-sm">
            Open to full-time SWE &amp; ML roles from {education[0].end}
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
                  {...(l.href.startsWith("mailto:") ? {} : { target: "_blank", rel: "noopener noreferrer" })}
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
            Designed and built from scratch. Set in Bricolage Grotesque, Geist and Instrument Serif. Made
            with Next.js and Tailwind, every pixel on purpose.
          </p>
        </div>
      </div>

      <div className="shell flex flex-wrap items-center justify-between gap-4 border-t border-line py-6 text-sm text-ink-3">
        <p>
          © {new Date().getFullYear()} {bio.name} · Made with <span className="text-accent">♥</span>
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
    </footer>
  );
}
