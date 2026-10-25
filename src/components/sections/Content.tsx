import { ArrowUpRight } from "lucide-react";
import { bio, projects, publications } from "@/data";
import { Section } from "../Section";
import { DrawLine, RevealText } from "../anim";

const LINK_LABEL = { demo: "Live", video: "Video", source: "Source", paper: "Paper", blog: "Writeup" } as const;
const more = projects.filter((p) => !p.featured).sort((a, b) => (b.year ?? "").localeCompare(a.year ?? ""));

/** Everything not in Selected work, one line each. */
export function Archive() {
  return (
    <section data-shape="2" className="relative px-[max(1rem,4vw)] pb-[16vh]">
      <div className="grid gap-[4vh] xl:grid-cols-12 xl:gap-x-[min(4vh,2.5vw)]">
        <div className="xl:col-span-4">
          <p className="label text-ink-3">More work</p>
          <RevealText
            as="h3"
            text="Everything else, filed."
            className="wide mt-3 block text-[clamp(1.75rem,3.4vw,3.75rem)] leading-[1] font-bold tracking-tight"
          />
        </div>
        <ol className="border-b border-line xl:col-span-8">
          {more.map((p) => (
            <li
              key={p.slug}
              className="grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1 border-t border-line py-4 md:grid-cols-[3.5rem_1fr_16rem_auto] md:px-3"
            >
              <span className="hidden font-mono text-xs text-ink-3 md:block">{p.year}</span>
              <span className="min-w-0">
                <span className="wide block text-lg leading-tight font-semibold tracking-tight">{p.title}</span>
                <span className="label mt-1 block truncate text-ink-3 md:hidden">
                  {p.year} · {p.tech.slice(0, 3).join(" · ")}
                </span>
              </span>
              <span className="label hidden truncate text-ink-3 md:block">{p.tech.slice(0, 3).join(" · ")}</span>
              <span className="flex gap-4">
                {p.links?.map((l) => (
                  <a
                    key={l.url}
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="label group inline-flex items-center gap-1 text-ink-2 transition-colors hover:text-accent"
                  >
                    {LINK_LABEL[l.type]}
                    <ArrowUpRight size={12} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                ))}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Research() {
  const sorted = [...publications].sort((a, b) => b.year - a.year);
  return (
    <Section id="research" index="02" title="Research" meta={`${publications.length} papers`} shape={3}>
      <ol className="border-b border-line">
        {sorted.map((pub) => {
          const link = pub.links?.[0];
          return (
            <li key={pub.title} className="relative grid gap-x-6 gap-y-2 border-t border-line py-6 md:grid-cols-[3.5rem_1fr_auto] md:px-3">
              <DrawLine className="absolute top-[-1px] left-0 h-px w-full" />
              <span className="font-mono text-xs text-ink-3 md:pt-1.5">{pub.year}</span>
              <div>
                <h3 className="wide text-[clamp(1.15rem,1.7vw,1.75rem)] leading-[1.1] font-semibold tracking-tight">
                  {link ? (
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="group transition-colors hover:text-accent">
                      {pub.title}
                      <ArrowUpRight className="ml-2 inline size-[0.8em] align-baseline transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </a>
                  ) : (
                    pub.title
                  )}
                </h3>
                <p className="mt-2 text-sm text-ink-3">{pub.venue}</p>
              </div>
              <p className="label text-accent md:pt-1.5 md:text-right">
                {pub.publisher ?? "Conference paper"}
                {pub.authors[0] === bio.name && <span className="block text-ink-3">First author</span>}
              </p>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
