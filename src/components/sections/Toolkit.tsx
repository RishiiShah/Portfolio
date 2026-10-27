import { education, skills } from "@/data";
import { SectionHead } from "@/components/SectionHead";
import { Reveal } from "@/components/Reveal";
import { TechIcon } from "@/components/TechIcon";

export function Toolkit() {
  return (
    <section id="toolkit" className="shell scroll-mt-16 py-28 md:py-40">
      <SectionHead index="04" title="My" flourish="toolbox" note="What I reach for when a new problem shows up." />

      <div className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-2 lg:grid-cols-3">
        {skills.map((group, i) => (
          <Reveal key={group.category} delay={i * 60} className="bg-bg p-8">
            <h3 className="label !text-accent">{group.category}</h3>
            <ul className="mt-6 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="inline-flex items-center gap-2 rounded-xl border border-line bg-bg-2 px-3 py-2 text-sm font-medium text-ink-2 transition-all duration-300 ease-[cubic-bezier(0.34,1.6,0.5,1)] hover:-translate-y-1 hover:border-ink hover:text-ink hover:shadow-[3px_3px_0_var(--color-ink)]"
                >
                  <TechIcon name={item} size={18} />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
        <Reveal delay={skills.length * 60} className="bg-bg-2 p-8">
          <h3 className="label">Education</h3>
          <ul className="mt-6 space-y-6">
            {education.map((e) => (
              <li key={e.degree}>
                <p className="font-display text-xl font-medium tracking-tight">{e.degree}</p>
                <p className="mt-1 text-sm text-ink-2">{e.institution}</p>
                <p className="mt-1 font-mono text-xs text-ink-3">
                  {e.end.split(" ")[1]} · GPA {e.gpa}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
