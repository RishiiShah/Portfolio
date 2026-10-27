import { education, stack, type StackGroup } from "@/data";
import { SectionHead } from "@/components/SectionHead";
import { Reveal } from "@/components/Reveal";
import { TechIcon } from "@/components/TechIcon";

function Tools({ group, dense = false }: { group: StackGroup; dense?: boolean }) {
  return (
    <ul className="flex flex-wrap content-start gap-1.5">
      {group.items.map((item) => (
        <li
          key={item}
          className={`inline-flex items-center gap-1.5 rounded-lg border border-line bg-bg-2 font-medium text-ink-2 transition-all duration-300 ease-[cubic-bezier(0.34,1.6,0.5,1)] hover:-translate-y-0.5 hover:border-ink hover:text-ink ${
            dense ? "px-2 py-1 text-xs" : "px-2.5 py-1.5 text-sm"
          }`}
        >
          <TechIcon name={item} size={dense ? 14 : 16} />
          {item}
        </li>
      ))}
      {group.patterns?.map((p) => (
        <li
          key={p.name}
          title={p.detail}
          className={`inline-flex items-center gap-1.5 rounded-lg border border-dashed border-accent/70 font-mono text-accent ${
            dense ? "px-2 py-1 text-[0.65rem]" : "px-2.5 py-1.5 text-xs"
          }`}
        >
          <span aria-hidden>◇</span>
          {p.name}
        </li>
      ))}
    </ul>
  );
}

function Label({ tag, group }: { tag: string; group: StackGroup }) {
  return (
    <div>
      <span className="font-mono text-[0.65rem] uppercase tracking-wider text-accent">{tag}</span>
      <h3 className="mt-1 font-display text-xl font-semibold tracking-tight">{group.name}</h3>
      <p className="mt-0.5 text-xs leading-snug text-ink-3">{group.blurb}</p>
    </div>
  );
}

function Wire() {
  return <span aria-hidden className="wire mx-auto block h-4 w-0.5" />;
}

const slab =
  "slab rounded-2xl border-2 border-ink bg-bg p-4 transition-all duration-300 ease-[cubic-bezier(0.34,1.6,0.5,1)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0_var(--color-accent)] md:p-5";

export function Toolkit() {
  const { tooling, layers, pillars, foundation } = stack;
  const bachelors = education.find((e) => "curriculum" in e);

  return (
    <section id="toolkit" className="shell scroll-mt-16 py-28 md:py-40">
      <SectionHead index="05" title="My" flourish="stack" note="Drawn the way I'd draw any system: layers, the things that cut across them, and the patterns at each level." />

      <Reveal>
        <figure className="stack relative rounded-3xl border-2 border-ink bg-bg-2 bg-[linear-gradient(var(--color-line)_1px,transparent_1px),linear-gradient(90deg,var(--color-line)_1px,transparent_1px)] bg-[size:28px_28px] p-3 shadow-[6px_6px_0_var(--color-ink)] md:p-6">
          <figcaption className="mb-4 flex flex-wrap items-center justify-between gap-3 px-1 font-mono text-[0.65rem] uppercase tracking-wider text-ink-3">
            <span>fig. 05 · rishabh.stack</span>
            <span className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="size-3 rounded border border-line bg-bg-2" /> tool
              </span>
              <span className="flex items-center gap-1.5 text-accent">
                <span className="size-3 rounded border border-dashed border-accent" /> pattern or method
              </span>
            </span>
          </figcaption>

          <div className={`${slab} border-dashed bg-bg/80`}>
            <div className="grid gap-4 md:grid-cols-[11rem_1fr] md:items-center">
              <Label tag="L0 · the dev loop" group={tooling} />
              <Tools group={tooling} />
            </div>
          </div>
          <Wire />

          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_13rem_13rem]">
            <div className="flex flex-col">
              {layers.map((layer, i) => (
                <div key={layer.name} className="flex flex-col">
                  {i > 0 ? <Wire /> : null}
                  <div className={slab}>
                    <div className="grid gap-4 md:grid-cols-[11rem_1fr] md:items-center">
                      <Label tag={`L${i + 1}`} group={layer} />
                      <Tools group={layer} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {pillars.map((pillar, i) => (
              <div key={pillar.name} className={`${slab} flex flex-col gap-4 bg-bg-3/60`}>
                <div className="flex items-start justify-between gap-2">
                  <Label tag={`P${i + 1} · cuts across`} group={pillar} />
                  <span aria-hidden className="hidden font-mono text-lg text-ink-3 lg:block">
                    ↕
                  </span>
                </div>
                <Tools group={pillar} dense />
                <div aria-hidden className="mt-auto hidden min-h-16 flex-1 flex-col items-center gap-2 pt-2 lg:flex">
                  <span className="wire w-0.5 flex-1" />
                  <span className="font-mono text-[0.6rem] uppercase tracking-wider text-ink-3">
                    spans L1 → L{layers.length}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <Wire />
          <div className={`${slab} !border-ink bg-ink text-bg`}>
            <div className="grid gap-4 md:grid-cols-[11rem_1fr] md:items-center">
              <div>
                <span className="font-mono text-[0.65rem] uppercase tracking-wider text-accent">Foundation</span>
                <h3 className="mt-1 font-display text-xl font-semibold tracking-tight">{foundation.name}</h3>
                <p className="mt-0.5 text-xs leading-snug text-bg/60">{foundation.blurb}</p>
              </div>
              <ul className="flex flex-wrap gap-1.5">
                {foundation.items.map((item) => (
                  <li
                    key={item}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-bg px-2.5 py-1.5 text-sm font-medium text-ink transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    <TechIcon name={item} size={16} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </figure>
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

        {bachelors ? (
          <details className="group mt-4 rounded-2xl border border-line">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 md:px-7 [&::-webkit-details-marker]:hidden">
              <span>
                <span className="font-display text-lg font-semibold tracking-tight">The full B.Tech curriculum</span>
                <span className="ml-3 hidden font-mono text-xs text-ink-3 sm:inline">6 semesters · honors track</span>
              </span>
              <span className="grid size-8 shrink-0 place-items-center rounded-full border border-line-2 text-lg transition-transform duration-500 group-open:rotate-45">
                +
              </span>
            </summary>
            <div className="border-t border-line p-5 md:p-7">
              <ol className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                {bachelors.curriculum.map((sem, i) => (
                  <li key={sem.term}>
                    <p className="flex items-baseline gap-2 font-mono text-xs">
                      <span className="text-accent">{sem.term}</span>
                      <span className="text-ink-3">· Year {Math.floor(i / 2) + 2}</span>
                    </p>
                    <ul className="mt-3 space-y-1.5 border-l border-line pl-4 text-sm text-ink-2">
                      {sem.courses.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>

              <div className="mt-10 rounded-xl bg-bg-2 p-5">
                <p className="label !text-accent">{bachelors.honors}</p>
                <ol className="mt-4 grid gap-4 sm:grid-cols-4">
                  {bachelors.honorsTrack.map((h, i) => (
                    <li key={h.term} className="relative">
                      <span className="flex items-center gap-2">
                        <span className="grid size-6 place-items-center rounded-full bg-accent font-mono text-[0.65rem] text-accent-ink">
                          {i + 1}
                        </span>
                        <span className="hidden h-px flex-1 bg-line-2 sm:block" />
                      </span>
                      <p className="mt-2 font-mono text-[0.65rem] text-ink-3">{h.term}</p>
                      <p className="mt-0.5 text-sm font-medium leading-snug">{h.course}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </details>
        ) : null}
      </Reveal>
    </section>
  );
}
