import { ArrowUpRight } from "lucide-react";
import { bio, education, experience, publications } from "@/data";
import { Section } from "../Section";
import { DrawLine, RevealText, Stagger } from "../anim";
import { WorkIndex } from "./WorkIndex";

const shortDate = (d: string) => {
  const [month, year] = d.split(" ");
  return year ? `${month.slice(0, 3)} ${year}` : d;
};

const bullet =
  "relative pl-5 before:absolute before:left-0 before:top-[0.7em] before:h-px before:w-2.5 before:bg-accent";

export function Archive() {
  return (
    <section data-shape="2" className="relative px-[max(1rem,4vw)] pb-[16vh]">
      <div className="grid gap-[4vh] md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="label text-ink-3">Full index</p>
          <RevealText
            as="h3"
            text="Every project, filed."
            className="wide mt-3 block text-[clamp(1.75rem,3.4vw,3.75rem)] leading-[1] font-bold tracking-tight"
          />
          <p className="mt-4 max-w-[34ch] text-ink-2">
            Open any row for the problem, my role, the architecture, and what I learned building it.
          </p>
        </div>
        <div className="md:col-span-8">
          <WorkIndex />
        </div>
      </div>
    </section>
  );
}

export function Research() {
  const sorted = [...publications].sort((a, b) => b.year - a.year);
  return (
    <Section id="research" index="02" title="Research" meta={`${publications.length} papers`} shape={3}>
      <ol className="md:w-[62vw]">
        {sorted.map((pub, i) => {
          const link = pub.links?.[0];
          return (
            <li key={pub.title} className="relative border-t border-line py-[5vh]">
              <DrawLine className="absolute top-[-1px] left-0 h-px w-full" />
              <Stagger className="grid gap-4 md:grid-cols-[8vw_1fr]">
                <span className="label text-ink-3">
                  {String(i + 1).padStart(2, "0")} — {pub.year}
                </span>
                <div>
                  <p className="label text-accent">
                    {pub.publisher ?? "Conference paper"}
                    {pub.authors[0] === bio.name && <span className="text-ink-3"> · First author</span>}
                  </p>
                  <h3 className="wide mt-3 text-[clamp(1.35rem,2.3vw,2.5rem)] leading-[1.05] font-semibold tracking-tight">
                    {link ? (
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="group transition-colors hover:text-accent">
                        {pub.title}
                        <ArrowUpRight className="ml-2 inline size-[0.8em] align-baseline transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </a>
                    ) : (
                      pub.title
                    )}
                  </h3>
                  <p className="mt-3 text-sm text-ink-2">{pub.venue}</p>
                  <p className="mt-1 text-sm text-ink-3">
                    {pub.authors.map((a, j) => (
                      <span key={a}>
                        {j > 0 && ", "}
                        <span className={a === bio.name ? "font-semibold text-ink" : undefined}>{a}</span>
                      </span>
                    ))}
                  </p>
                  {pub.abstract && (
                    <details className="group mt-4 max-w-[70ch]">
                      <summary className="label w-fit list-none text-ink-2 hover:text-accent">
                        <span className="group-open:hidden">+ Read abstract</span>
                        <span className="hidden group-open:inline">− Hide abstract</span>
                      </summary>
                      <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{pub.abstract}</p>
                    </details>
                  )}
                </div>
              </Stagger>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}

export function Experience() {
  return (
    <Section id="experience" index="03" title="Experience" meta="2024 — now" shape={3}>
      <div className="relative md:ml-[16vw] md:w-[46vw]">
        <div className="absolute top-0 bottom-0 left-0 w-px bg-line" />
        <DrawLine vertical className="absolute top-0 bottom-0 left-0 w-px" />
        <ol>
          {experience.map((job) => (
            <li key={job.organization} className="relative pb-[10vh] pl-[max(1.5rem,4vw)] last:pb-0">
              <span className="absolute top-2 left-[-4px] size-[9px] border border-accent bg-bg" />
              <Stagger>
                <p className="label text-ink-3">
                  {shortDate(job.start)} — {shortDate(job.end)} · {job.location}
                </p>
                <h3 className="wide mt-3 text-[clamp(1.6rem,3.2vw,3.5rem)] leading-[1] font-bold tracking-tight">
                  {job.organization}
                </h3>
                <p className="mt-2 text-lg text-accent">{job.role}</p>
                <ul className="mt-6 max-w-[75ch] space-y-3 text-[15px] leading-relaxed text-ink-2">
                  {job.bullets.map((b) => (
                    <li key={b} className={bullet}>
                      {b}
                    </li>
                  ))}
                </ul>
                {job.tech && (
                  <ul className="mt-6 flex flex-wrap gap-1.5">
                    {job.tech.map((t) => (
                      <li key={t} className="label border border-line px-2 py-1 text-ink-2">
                        {t}
                      </li>
                    ))}
                  </ul>
                )}
              </Stagger>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-[14vh] md:ml-[16vw] md:w-[50vw]">
        <p className="label text-ink-3">Education</p>
        <Stagger as="ol" className="mt-4 grid gap-px border border-line bg-line md:grid-cols-2">
          {education.map((ed) => (
            <li key={ed.degree} className="flex flex-col bg-bg p-[clamp(1.25rem,2vw,2.25rem)]">
              <p className="label text-ink-3">
                {shortDate(ed.start)} — {shortDate(ed.end)}
              </p>
              <p className="wide mt-4 text-[clamp(1.25rem,1.9vw,2rem)] leading-tight font-bold tracking-tight">{ed.degree}</p>
              <p className="mt-1 text-ink-2">{ed.institution}</p>
              <p className="label mt-8 text-accent">GPA {ed.gpa}</p>
            </li>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}
