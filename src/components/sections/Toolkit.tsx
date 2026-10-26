import { education, skills } from "@/data";
import { SectionHead } from "@/components/SectionHead";
import { Reveal } from "@/components/Reveal";

export function Toolkit() {
  return (
    <section id="toolkit" className="shell scroll-mt-16 py-28 md:py-40">
      <SectionHead index="04" title="Toolkit" note="What I reach for, grouped the way I think about it." />

      <div className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-2 lg:grid-cols-3">
        {skills.map((group, i) => (
          <Reveal key={group.category} delay={i * 60} className="bg-bg p-8">
            <h3 className="label !text-accent">{group.category}</h3>
            <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2 font-display text-xl tracking-tight text-ink-2">
              {group.items.map((item) => (
                <li key={item} className="transition-colors hover:text-ink">
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
