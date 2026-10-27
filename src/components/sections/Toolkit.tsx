import { education, stack } from "@/data";
import { SectionHead } from "@/components/SectionHead";
import { Reveal } from "@/components/Reveal";
import { TechIcon } from "@/components/TechIcon";
import { techIcons } from "@/data/tech-icons";

export function Toolkit() {
  return (
    <section id="toolkit" className="shell scroll-mt-16 py-28 md:py-40">
      <SectionHead index="05" title="My" flourish="stack" note="The tools I work with, grouped the way job posts list them." />

      <dl className="border-b border-line">
        {stack.map((g) => (
          <Reveal key={g.name} className="grid gap-4 border-t border-line py-6 md:grid-cols-[15rem_1fr] md:gap-10 md:py-7">
            <dt>
              <p className="font-display text-xl font-semibold tracking-tight">{g.name}</p>
              <p className="mt-1 text-sm text-ink-3">{g.blurb}</p>
            </dt>
            <dd>
              <ul className="flex flex-wrap gap-2">
                {g.items.map((tool) => (
                  <li
                    key={tool}
                    className="inline-flex h-10 items-center gap-2.5 rounded-lg border border-line bg-bg-2 pl-2.5 pr-3.5 text-[0.95rem] transition-colors hover:border-ink"
                  >
                    {techIcons[tool] ? (
                      <TechIcon name={tool} size={20} square />
                    ) : (
                      <span aria-hidden className="grid size-5 place-items-center rounded bg-bg-3 font-mono text-[0.6rem] font-semibold text-ink-2">
                        {tool.slice(0, 2)}
                      </span>
                    )}
                    {tool}
                  </li>
                ))}
              </ul>
            </dd>
          </Reveal>
        ))}
      </dl>

      <Reveal className="mt-16">
        <h3 className="label">Formally trained</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {education.map((e) => (
            <article key={e.degree} className="rounded-2xl border border-line p-6 md:p-7">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-mono text-xs text-ink-3">
                  {e.start.split(" ")[1]} → {e.end.split(" ")[1]}
                </p>
                <p className="font-mono text-xs text-accent">GPA {e.gpa}</p>
              </div>
              <p className="mt-3 font-display text-xl font-semibold leading-snug tracking-tight">{e.degree}</p>
              <p className="mt-1 text-sm text-ink-2">
                {"college" in e ? `${e.college}, ` : ""}
                {e.institution}
              </p>
              {"honors" in e ? <p className="flourish mt-2 text-lg text-accent">{e.honors}</p> : null}
              <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Relevant coursework">
                {e.coursework.map((c) => (
                  <li key={c} className="rounded-md bg-bg-3 px-2 py-1 text-xs text-ink-2">
                    {c}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
