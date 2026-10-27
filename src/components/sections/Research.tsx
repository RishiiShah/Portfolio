import { bio, publications } from "@/data";
import { Reveal } from "@/components/Reveal";
import { SectionHead } from "@/components/SectionHead";

export function Research() {
  const sorted = [...publications].sort((a, b) => b.year - a.year);
  return (
    <section id="research" className="scroll-mt-16 bg-ink py-28 text-bg md:py-40">
      <div className="shell">
        <SectionHead
          index="04"
          title="Ideas, in"
          flourish="print"
          tone="dark"
          note="Computer vision, generative models, and voice interfaces, written up properly."
        />

        <ul className="grid gap-6 lg:grid-cols-3">
          {sorted.map((pub, i) => {
            const link = pub.links?.find((l) => l.type === "paper") ?? pub.links?.[0];
            return (
              <Reveal
                as="li"
                key={pub.title}
                delay={i * 80}
                className="flex h-full flex-col rounded-3xl border border-bg/15 p-8 transition-colors hover:border-bg/40"
              >
                  <div className="flex items-center justify-between font-mono text-xs uppercase tracking-wider text-bg/50">
                    <span>{pub.publisher ?? "Conference"}</span>
                    <span>{pub.publishedAt ?? pub.year}</span>
                  </div>
                  <h3 className="mt-8 font-display text-2xl font-semibold leading-tight tracking-tight">{pub.title}</h3>
                  <p className="mt-4 text-sm text-bg/60">{pub.venue}</p>
                  <p className="mt-6 text-sm text-bg/60">
                    {pub.authors.map((a, j) => (
                      <span key={a}>
                        {a === bio.name ? <strong className="font-semibold text-bg">{a}</strong> : a}
                        {j < pub.authors.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </p>
                  <div className="mt-auto pt-8">
                    {link ? (
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-10 items-center rounded-xl bg-bg px-4 text-sm text-ink transition-colors hover:bg-accent hover:text-accent-ink"
                      >
                        Read the paper ↗
                      </a>
                    ) : (
                      <span className="font-mono text-xs uppercase tracking-wider text-bg/50">In print</span>
                    )}
                  </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
