"use client";
import { publications } from "@/data/publications";
import { formatLinkLabel, getKnownLinkIcon } from "@/utils/linkIcons";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";

const publicationType = (venue: string) => {
  if (venue.toLowerCase().includes("conference")) return "Conference";
  if (venue.toLowerCase().includes("journal")) return "Journal";
  if (venue.toLowerCase().includes("preprint")) return "Preprint";
  return "Publication";
};

export default function PublicationsPage() {
  return (
    <main className="pb-12 sm:pb-16 lg:pb-20">
      <section className="relative isolate overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(135deg,rgba(8,18,28,0.92),rgba(9,13,20,0.92)_50%,rgba(15,35,48,0.88))] p-5 sm:p-8 mb-12">
        <div className="pointer-events-none absolute -left-20 top-6 h-72 w-72 rounded-full bg-cyan-300/8 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 -bottom-12 h-80 w-80 rounded-full bg-blue-300/8 blur-3xl" />
        <div className="relative">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.36em] text-accent/80 animate-fade-in-up">Publications / Research Index</p>
          <h1 className="max-w-3xl text-4xl font-black leading-[0.92] text-foreground sm:text-6xl animate-fade-in-up">
            Peer-Reviewed
            <span className="block text-accent">Research</span>
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-foreground/70 sm:text-base animate-fade-in-up delay-200">
            Featured publications across AI, systems, and applied research at the intersection of deep learning and infrastructure.
          </p>
        </div>
      </section>

      {publications.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-black/25 p-8 text-center animate-fade-in-up">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-foreground/50">No Research Published</p>
        </div>
      ) : (
        <div className="space-y-6 sm:space-y-8">
          {publications.map((p, index) => (
            <article
              key={p.title}
              className={`group relative overflow-hidden rounded-2xl border transition-all duration-500 animate-fade-in-up ${
                p.featured
                  ? "border-accent/40 bg-[linear-gradient(130deg,rgba(20,56,74,0.5),rgba(9,13,20,0.88)_50%,rgba(14,52,67,0.5))] p-6 sm:p-8 shadow-[0_24px_60px_-36px_rgba(0,0,0,0.9)] hover:border-accent/60 hover:shadow-[0_0_32px_var(--accent-glow)] hover:-translate-y-1"
                  : "border-white/10 bg-black/30 p-5 sm:p-6 hover:border-white/20 hover:bg-black/40"
              }`}
              style={{ animationDelay: `${0.25 + index * 0.08}s` }}
            >
              <div className="relative">
                {/* Quote frame */}
                <div className="absolute -top-2 -left-2 text-accent/20 text-2xl pointer-events-none">
                  <FaQuoteLeft />
                </div>
                <div className="absolute -bottom-2 -right-2 text-accent/20 text-2xl pointer-events-none">
                  <FaQuoteRight />
                </div>

                <div className="grid gap-6 sm:gap-8">
                  {/* Left column: Year, Type, Venue */}
                  <div className="flex flex-wrap sm:flex-col gap-3 sm:gap-4">
                    <div className="flex flex-col gap-2">
                      <span className={`rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em] w-max ${
                        p.featured
                          ? "border-accent/50 bg-accent/15 text-accent shadow-[0_0_14px_var(--accent-glow)]"
                          : "border-white/15 bg-white/5 text-foreground/60"
                      }`}>
                        {p.featured ? "Featured" : publicationType(p.venue)}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/50">Year</p>
                      <p className="text-sm font-semibold text-foreground/80">{p.publishedAt ?? p.year}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/50">Venue</p>
                      <p className="text-xs text-foreground/70 leading-snug">{p.venue}</p>
                    </div>
                  </div>

                  {/* Right column: Title, Authors, Abstract, Links */}
                  <div className="flex flex-col gap-4">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black leading-tight text-foreground group-hover:text-cyan-100 transition-colors duration-300 mb-3">
                        {p.title}
                      </h2>

                      {p.authors && (
                        <p className="text-xs sm:text-sm text-foreground/65 leading-relaxed">
                          {p.authors.map((author, i) => (
                            <span key={author}>
                              {i > 0 && ", "}
                              <span className={author.includes("Rishabh") ? "text-accent/90 font-semibold" : "text-foreground/65"}>
                                {author}
                              </span>
                            </span>
                          ))}
                        </p>
                      )}
                    </div>

                    {p.abstract && (
                      <details className="group/details">
                        <summary className="text-[10px] font-mono uppercase tracking-[0.22em] text-accent/80 cursor-pointer list-none flex items-center gap-2 hover:text-accent transition-colors w-max select-none">
                          <span className="group-open/details:hidden px-2.5 py-1 rounded border border-accent/20 bg-accent/5">[+] Abstract</span>
                          <span className="hidden group-open/details:inline px-2.5 py-1 rounded border border-accent/20 bg-accent/5">[-] Hide</span>
                        </summary>
                        <p className="mt-4 pl-4 border-l-2 border-accent/20 text-xs sm:text-sm text-foreground/70 leading-relaxed">
                          {p.abstract}
                        </p>
                      </details>
                    )}

                    {p.links && p.links.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {p.links.map((l) => {
                          const Icon = getKnownLinkIcon(l.type);
                          return (
                            <a
                              key={l.url}
                              href={l.url}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-full border border-white/15 bg-black/25 px-3 py-2 text-[10px] font-mono uppercase tracking-[0.18em] text-foreground/65 transition-all duration-300 hover:border-accent/45 hover:text-accent hover:bg-accent/[0.08] flex items-center gap-2 cursor-pointer"
                            >
                              {Icon && <Icon className="h-3.5 w-3.5" />}
                              {formatLinkLabel(l.type)}
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}


