import { ArrowUpRight } from "lucide-react";
import { bio, projects, publications } from "@/data";
import { Section } from "../Section";
import { RevealText, Stagger } from "../anim";

const LINK_LABEL = { demo: "Live", video: "Video", source: "Source", paper: "Paper", blog: "Writeup" } as const;
const more = projects.filter((p) => !p.featured).sort((a, b) => (b.year ?? "").localeCompare(a.year ?? ""));

/** Everything not in Selected work, as small cards. */
export function Archive() {
  return (
    <section data-shape="2" className="relative px-[max(1rem,4vw)] pb-[12vh]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <RevealText
          as="h3"
          text="More work"
          className="wide block text-[clamp(1.75rem,3vw,3.25rem)] leading-[1] font-bold tracking-tight"
        />
        <p className="label text-ink-3">{more.length} projects · {more.at(-1)?.year} → {more[0]?.year}</p>
      </div>
      <Stagger className="mt-[4vh] grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {more.map((p) => (
          <article key={p.slug} className="tile flex flex-col p-5">
            <p className="label flex justify-between text-ink-3">
              <span>{p.tags[0]}</span>
              <span>{p.year}</span>
            </p>
            <h4 className="wide mt-4 text-[clamp(1.05rem,1.3vw,1.35rem)] leading-tight font-semibold tracking-tight">{p.title}</h4>
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-2">{p.tagline}</p>
            <div className="mt-auto flex items-end justify-between gap-4 pt-5">
              <span className="label truncate text-ink-3">{p.tech.slice(0, 3).join(" · ")}</span>
              <span className="flex shrink-0 gap-3">
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
            </div>
          </article>
        ))}
        <a
          href={bio.github}
          target="_blank"
          rel="noopener noreferrer"
          className="tile group flex flex-col justify-between p-5 text-ink-2 hover:text-accent"
        >
          <span className="label text-ink-3">GitHub</span>
          <span className="wide mt-6 inline-flex items-center gap-2 text-[clamp(1.05rem,1.3vw,1.35rem)] font-semibold tracking-tight">
            Everything else, with source <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </span>
        </a>
      </Stagger>
    </section>
  );
}

export function Research() {
  const sorted = [...publications].sort((a, b) => b.year - a.year);
  return (
    <Section id="research" index="02" title="Research" meta={`${publications.length} papers`} shape={3}>
      <Stagger className="grid gap-3 md:grid-cols-3">
        {sorted.map((pub) => {
          const link = pub.links?.[0];
          const Card = link ? "a" : "div";
          return (
            <Card
              key={pub.title}
              {...(link && { href: link.url, target: "_blank", rel: "noopener noreferrer" })}
              className="tile group flex min-h-[22rem] flex-col p-6"
            >
              <p className="label flex items-center justify-between">
                <span className="text-accent">{pub.publisher ?? "Conference paper"}</span>
                <span className="text-ink-3">{pub.year}</span>
              </p>
              <h3 className="wide mt-8 text-[clamp(1.2rem,1.55vw,1.65rem)] leading-[1.12] font-semibold tracking-tight transition-colors group-hover:text-accent">
                {pub.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-ink-3">{pub.venue}</p>
              <p className="label mt-auto flex items-center justify-between border-t border-line pt-4 text-ink-3">
                <span>{pub.authors[0] === bio.name ? "First author" : `${pub.authors.length} authors`}</span>
                {link && (
                  <span className="inline-flex items-center gap-1 text-ink-2 group-hover:text-accent">
                    Read <ArrowUpRight size={12} />
                  </span>
                )}
              </p>
            </Card>
          );
        })}
      </Stagger>
    </Section>
  );
}
