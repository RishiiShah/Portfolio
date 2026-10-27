import { education, skills, systemDesign } from "@/data";
import { SectionHead } from "@/components/SectionHead";
import { Reveal } from "@/components/Reveal";
import { TechIcon } from "@/components/TechIcon";

const WIDE = "Cloud & DevOps";

export function Toolkit() {
  return (
    <section id="toolkit" className="shell scroll-mt-16 py-28 md:py-40">
      <SectionHead index="05" title="My" flourish="toolbox" note="What I reach for when a new problem shows up, sorted by where it sits in the stack." />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {skills.map((group, i) => (
          <Reveal
            key={group.category}
            delay={(i % 3) * 60}
            className={`rounded-2xl border border-line bg-bg-2 p-6 md:p-7 ${group.category === WIDE ? "md:col-span-2" : ""}`}
          >
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-xs text-accent">0{i + 1}</span>
              <h3 className="font-display text-2xl font-semibold tracking-tight">{group.category}</h3>
            </div>
            <p className="mt-1 text-sm text-ink-3">{group.blurb}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="inline-flex items-center gap-2 rounded-xl border border-line bg-bg px-3 py-2 text-sm font-medium text-ink-2 transition-all duration-300 ease-[cubic-bezier(0.34,1.6,0.5,1)] hover:-translate-y-1 hover:border-ink hover:text-ink hover:shadow-[3px_3px_0_var(--color-ink)]"
                >
                  <TechIcon name={item} size={18} />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}

        <Reveal delay={60} className="rounded-2xl border border-dashed border-line-2 p-6 md:col-span-2 md:p-7 lg:col-span-1">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-xs text-accent">0{skills.length + 1}</span>
            <h3 className="font-display text-2xl font-semibold tracking-tight">Education</h3>
          </div>
          <ul className="mt-6 space-y-5">
            {education.map((e) => (
              <li key={e.degree}>
                <p className="font-display text-lg font-medium leading-snug tracking-tight">{e.degree}</p>
                <p className="mt-1 text-sm text-ink-2">{e.institution}</p>
                <p className="mt-1 font-mono text-xs text-ink-3">
                  {e.end.split(" ")[1]} · GPA {e.gpa}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <Reveal className="mt-4 rounded-3xl border-2 border-ink bg-ink p-6 text-bg shadow-[6px_6px_0_var(--color-accent)] md:p-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="label !text-accent">System design</p>
            <h3 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">
              The parts you don&apos;t <span className="flourish font-normal text-accent">see</span>
            </h3>
          </div>
          <p className="max-w-sm text-sm text-bg/60">Patterns I&apos;ve put into production, from the internships and the builds above.</p>
        </div>
        <ul className="mt-8 grid gap-px overflow-hidden rounded-2xl bg-bg/15 sm:grid-cols-2 lg:grid-cols-5">
          {systemDesign.map((s, i) => (
            <li key={s.name} className="group bg-ink p-5 transition-colors duration-300 hover:bg-bg/5">
              <span className="font-mono text-xs text-bg/40 transition-colors group-hover:text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-3 font-display text-lg font-semibold leading-tight tracking-tight">{s.name}</p>
              <p className="mt-2 text-sm leading-snug text-bg/60">{s.detail}</p>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
