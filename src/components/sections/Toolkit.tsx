import { education, experience, projects, skills } from "@/data";
import { SectionHead } from "@/components/SectionHead";
import { Reveal } from "@/components/Reveal";
import { TechIcon } from "@/components/TechIcon";

const ALIAS: Record<string, string[]> = {
  "JWT Auth": ["JWT"],
  YOLO: ["YOLOv12x"],
  "Groq API": ["Groq Llama-4"],
  SQLite: ["FTS5"],
};

const places = [
  ...experience.map((e) => ({ name: e.organization, tech: e.tech ?? [] })),
  ...projects.map((p) => ({ name: p.title.split(/:| & | via /)[0].trim(), tech: p.tech })),
];

function matches(skill: string, tech: string) {
  const s = skill.toLowerCase();
  const t = tech.toLowerCase();
  return t === s || t.startsWith(`${s} `) || !!ALIAS[skill]?.includes(tech);
}

const usedIn = (skill: string) => places.filter((p) => p.tech.some((t) => matches(skill, t))).map((p) => p.name);

const drivers = skills
  .flatMap((g) => g.items.map((name) => ({ name, uses: usedIn(name) })))
  .sort((a, b) => b.uses.length - a.uses.length)
  .slice(0, 6);
const most = drivers[0]?.uses.length ?? 1;

export function Toolkit() {
  return (
    <section id="toolkit" className="shell scroll-mt-16 py-28 md:py-40">
      <SectionHead index="05" title="My" flourish="toolbox" note="What I reach for when a new problem shows up, and where I've actually used it." />

      <Reveal>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="label !text-accent">Daily drivers</h3>
          <p className="flourish text-lg text-ink-3">ranked by how many of my builds lean on them</p>
        </div>
        <ol className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {drivers.map((d, i) => (
            <li
              key={d.name}
              className="group flex flex-col rounded-2xl border-2 border-ink bg-bg-2 p-5 shadow-[4px_4px_0_var(--color-ink)] transition-all duration-300 ease-[cubic-bezier(0.34,1.6,0.5,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--color-accent)]"
            >
              <div className="flex items-start justify-between">
                <TechIcon name={d.name} size={32} />
                <span className="font-mono text-xs text-ink-3">#{i + 1}</span>
              </div>
              <p className="mt-6 font-display text-xl font-semibold tracking-tight">{d.name}</p>
              <p className="mt-1 font-mono text-xs text-ink-3">{d.uses.length} builds</p>
              <span className="mt-3 flex gap-1" aria-hidden>
                {Array.from({ length: most }, (_, j) => (
                  <span key={j} className={`h-1.5 flex-1 rounded-full ${j < d.uses.length ? "bg-accent" : "bg-line"}`} />
                ))}
              </span>
            </li>
          ))}
        </ol>
      </Reveal>

      <div className="mt-20">
        {skills.map((group, i) => (
          <Reveal key={group.category} delay={i * 60} className="grid gap-5 border-t border-line py-8 md:grid-cols-12">
            <div className="md:col-span-3">
              <h3 className="font-display text-2xl font-semibold tracking-tight">{group.category}</h3>
              <p className="mt-1 font-mono text-xs text-ink-3">{String(group.items.length).padStart(2, "0")} tools</p>
            </div>
            <ul className="flex flex-wrap content-start gap-2 md:col-span-9">
              {group.items.map((item) => {
                const uses = usedIn(item);
                return (
                  <li
                    key={item}
                    tabIndex={uses.length ? 0 : undefined}
                    className="group relative inline-flex items-center gap-2 rounded-xl border border-line bg-bg-2 px-3 py-2 text-sm font-medium text-ink-2 outline-none transition-all duration-300 ease-[cubic-bezier(0.34,1.6,0.5,1)] hover:-translate-y-1 hover:border-ink hover:text-ink hover:shadow-[3px_3px_0_var(--color-ink)] focus-visible:border-ink focus-visible:text-ink"
                  >
                    <TechIcon name={item} size={18} />
                    {item}
                    {uses.length ? (
                      <>
                        <span className="rounded-md bg-bg-3 px-1.5 font-mono text-[0.65rem] text-ink-3 group-hover:bg-accent group-hover:text-accent-ink">
                          {uses.length}
                        </span>
                        <span
                          role="tooltip"
                          className="pointer-events-none absolute bottom-full left-0 z-20 mb-2 w-max max-w-64 translate-y-1 rounded-xl bg-ink px-3 py-2 text-xs leading-relaxed text-bg opacity-0 shadow-[3px_3px_0_var(--color-accent)] transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
                        >
                          <span className="block font-mono text-[0.6rem] uppercase tracking-wider text-accent">Used in</span>
                          {uses.join(" · ")}
                        </span>
                      </>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </Reveal>
        ))}

        <Reveal className="grid gap-5 border-y border-line py-8 md:grid-cols-12">
          <div className="md:col-span-3">
            <h3 className="font-display text-2xl font-semibold tracking-tight">Formally trained</h3>
            <p className="mt-1 font-mono text-xs text-ink-3">{String(education.length).padStart(2, "0")} degrees</p>
          </div>
          <ul className="grid gap-6 sm:grid-cols-2 md:col-span-9">
            {education.map((e) => (
              <li key={e.degree}>
                <p className="font-display text-lg font-medium tracking-tight">{e.degree}</p>
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
