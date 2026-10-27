import { education } from "@/data";
import { SectionHead } from "@/components/SectionHead";
import { Reveal } from "@/components/Reveal";
import { StackExplorer } from "@/components/StackExplorer";

export function Toolkit() {
  return (
    <section id="toolkit" className="shell scroll-mt-16 py-28 md:py-40">
      <SectionHead index="05" title="My" flourish="stack" note="Pick an area: the tools light up, and the receipt shows where I used them and what came of it." />

      <Reveal>
        <StackExplorer />
      </Reveal>

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
