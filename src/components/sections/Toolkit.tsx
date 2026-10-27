import type { CSSProperties } from "react";
import { education, stack } from "@/data";
import { SectionHead } from "@/components/SectionHead";
import { Reveal } from "@/components/Reveal";
import { TechIcon } from "@/components/TechIcon";
import { techIcons } from "@/data/tech-icons";

export function Toolkit() {
  return (
    <section id="toolkit" className="shell scroll-mt-16 py-28 md:py-40">
      <SectionHead index="05" title="My" flourish="stack" note="What I reach for when a new problem shows up. Hover a logo for its name." />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {stack.map((group, i) => (
          <Reveal
            key={group.name}
            delay={(i % 2) * 80}
            className="group/tile rounded-3xl border border-line bg-bg-2 p-6 transition-colors duration-300 hover:border-ink md:p-7"
          >
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-display text-xl font-semibold tracking-tight">{group.name}</h3>
              <span className="font-mono text-xs text-ink-3 transition-colors group-hover/tile:text-accent">
                {String(group.items.length).padStart(2, "0")}
              </span>
            </div>
            <p className="mt-1 text-sm text-ink-3">{group.blurb}</p>

            <ul className="mt-6 flex flex-wrap gap-2.5">
              {group.items.map((item, j) => (
                <li key={item} className="logo-pop" style={{ "--d": `${j * 45 + (i % 2) * 80}ms` } as CSSProperties}>
                  <div className="group/logo relative grid size-14 place-items-center rounded-2xl border border-line bg-bg transition-all duration-300 ease-[cubic-bezier(0.34,1.6,0.5,1)] hover:z-10 hover:-translate-y-1.5 hover:-rotate-6 hover:border-ink hover:shadow-[3px_3px_0_var(--color-ink)] md:size-16">
                    {techIcons[item] ? (
                      <>
                        <TechIcon name={item} size={30} square />
                        <span className="sr-only">{item}</span>
                      </>
                    ) : (
                      <span className="px-1 text-center font-mono text-[0.62rem] font-medium leading-tight text-ink-2">{item}</span>
                    )}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -top-2 left-1/2 hidden -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg bg-ink px-2.5 py-1 font-mono text-[0.65rem] text-bg opacity-0 transition-all duration-200 group-hover/logo:-translate-y-[115%] group-hover/logo:opacity-100 md:block"
                    >
                      {item}
                    </span>
                  </div>
                  <span aria-hidden className="mt-1.5 block max-w-14 truncate text-center text-[0.6rem] text-ink-3 md:hidden">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>

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
