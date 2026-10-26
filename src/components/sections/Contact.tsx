import { bio } from "@/data";
import { Reveal } from "@/components/Reveal";

const links = [
  { label: "LinkedIn", href: bio.linkedin, note: "Fastest way to reach me" },
  { label: "GitHub", href: bio.github, note: "@RishiiShah" },
  { label: "Résumé", href: bio.resume, note: "One page, PDF" },
];

export function Contact() {
  return (
    <section id="contact" className="relative scroll-mt-16 overflow-hidden border-t border-line">
      <div className="shell pb-10 pt-28 md:pt-40">
        <Reveal>
          <p className="label">05 · Say hi</p>
          <h2 className="display mt-8 text-[clamp(3.5rem,11vw,11rem)]">
            Got a problem
            <br />
            worth <span className="flourish text-accent">solving?</span>
          </h2>
          <p className="mt-8 max-w-xl text-xl text-ink-2">
            I&apos;m happiest on the messy ones. Send it over and I&apos;ll bring curiosity, a plan, and a very sharp eye for detail.
          </p>
        </Reveal>

        <ul className="mt-20 border-t border-line">
          {links.map((l, i) => (
            <Reveal as="li" key={l.label} delay={i * 80} className="border-b border-line">
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-6 py-8"
                >
                  <span className="font-display text-[clamp(2rem,5vw,4rem)] font-semibold tracking-tight transition-transform duration-500 ease-out-expo group-hover:translate-x-4 group-hover:text-accent">
                    {l.label}
                  </span>
                  <span className="flex items-center gap-6">
                    <span className="hidden text-ink-3 sm:inline">{l.note}</span>
                    <span className="grid size-14 place-items-center rounded-full border border-line-2 text-2xl transition-all duration-500 group-hover:rotate-45 group-hover:border-accent group-hover:bg-accent group-hover:text-accent-ink">
                      ↗
                    </span>
                  </span>
                </a>
            </Reveal>
          ))}
        </ul>

        <footer className="mt-28 flex flex-wrap items-end justify-between gap-6 text-sm text-ink-3">
          <p>
            © {new Date().getFullYear()} {bio.name}. Designed and built from scratch, every pixel on purpose.
          </p>
          <a href="#top" className="link-sweep text-ink-2">
            Back to top ↑
          </a>
        </footer>
      </div>
      <p
        aria-hidden
        className="display pointer-events-none select-none whitespace-nowrap text-center text-[22vw] leading-[0.75] text-bg-3"
      >
        Rishabh
      </p>
    </section>
  );
}
