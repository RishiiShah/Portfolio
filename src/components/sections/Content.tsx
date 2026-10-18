import { ArrowUpRight } from "lucide-react";
import { bio, publications } from "@/data";
import { Section } from "../Section";
import { DrawLine, RevealText, Stagger } from "../anim";
import { WorkIndex } from "./WorkIndex";



export function Archive() {
  return (
    <section data-shape="2" className="relative px-[max(1rem,4vw)] pb-[16vh]">
      <div className="grid gap-[4vh] xl:grid-cols-12 xl:gap-x-[min(4vh,2.5vw)]">
        <div className="xl:col-span-4">
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
        <div className="xl:col-span-8">
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
