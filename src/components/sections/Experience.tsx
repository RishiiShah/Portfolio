import { experience, teaching } from "@/data";
import { SectionHead } from "@/components/SectionHead";
import { Reveal } from "@/components/Reveal";

const short = (d: string) => d.replace(/^(\w{3})\w*\s/, "$1 ");

export function Experience() {
  const entries = [
    {
      role: teaching.role,
      organization: teaching.organization,
      when: `${short(teaching.start)} – Now`,
      summary: teaching.course,
      bullets: [...teaching.bullets],
      highlights: [{ value: "50+", label: "Students each week" }],
      tech: [] as string[],
    },
    ...experience.map((e) => ({
      role: e.role,
      organization: e.organization,
      when: `${short(e.start)} – ${short(e.end)}`,
      summary: e.summary ?? "",
      bullets: e.bullets,
      highlights: e.highlights ?? [],
      tech: e.tech ?? [],
    })),
  ];

  return (
    <section id="experience" className="shell scroll-mt-16 py-28 md:py-40">
      <SectionHead index="02" title="Experience" note="Two engineering internships, then back to school to teach the fundamentals." />
      <ol>
        {entries.map((e, i) => (
          <Reveal as="li" key={e.organization + e.role} delay={i * 60} className="grid gap-8 border-b border-line py-12 md:grid-cols-12">
              <div className="md:col-span-3">
                <p className="font-mono text-sm text-accent">{e.when}</p>
                <p className="mt-2 text-ink-2">{e.organization}</p>
              </div>
              <div className="md:col-span-6">
                <h3 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">{e.role}</h3>
                <p className="mt-3 text-lg text-ink-2">{e.summary}</p>
                <ul className="mt-6 space-y-3 text-ink-2">
                  {e.bullets.map((b) => (
                    <li key={b} className="relative pl-5 leading-relaxed before:absolute before:left-0 before:top-[0.7em] before:h-px before:w-2.5 before:bg-ink-3">
                      {b}
                    </li>
                  ))}
                </ul>
                {e.tech.length ? (
                  <p className="mt-6 font-mono text-xs text-ink-3">{e.tech.join("  ·  ")}</p>
                ) : null}
              </div>
              <dl className="flex gap-8 md:col-span-3 md:flex-col md:items-end md:text-right">
                {e.highlights.map((h) => (
                  <div key={h.label}>
                    <dt className="sr-only">{h.label}</dt>
                    <dd className="font-display text-5xl font-semibold tracking-tight md:text-6xl">{h.value}</dd>
                    <dd className="mt-1 text-sm text-ink-3">{h.label}</dd>
                  </div>
                ))}
              </dl>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
