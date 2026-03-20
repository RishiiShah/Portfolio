"use client";
import { publications } from "@/data/publications";
import { formatLinkLabel, getKnownLinkIcon } from "@/utils/linkIcons";

export default function PublicationsPage() {
  return (
    <main className="pb-12 sm:pb-16 lg:pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-12">
        <h1 className="text-xl sm:text-2xl font-semibold animate-fade-in-up md:w-1/4">Publications</h1>
        <div className="hidden md:block flex-1 border-b border-foreground/10 animate-fade-in-up" />
      </div>

      {publications.length === 0 ? (
        <p className="mt-4 text-xs sm:text-sm text-foreground/70 animate-fade-in-up delay-200">No publications added yet.</p>
      ) : (
        <div className="flex flex-col gap-2 animate-fade-in-up delay-200">
          {publications.map((p, index) => (
            <div 
              key={p.title} 
              className="group relative flex flex-col md:flex-row gap-4 md:gap-8 pb-6 sm:pb-8 pt-4 sm:pt-6 border-b border-foreground/10 last:border-0 hover:bg-foreground/[0.02] px-4 -mx-4 rounded-xl transition-all duration-300"
              style={{ animationDelay: `${0.3 + index * 0.15}s` }}
            >
              
              {/* Year / Venue left column */}
              <div className="md:w-1/4 shrink-0 flex flex-col items-start pt-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-accent/90 bg-accent/10 border border-accent/20 px-2.5 py-1 rounded shadow-[0_0_10px_var(--accent-glow)]">
                  {p.publishedAt ?? p.year}
                </span>
                <span className="mt-3 text-xs sm:text-sm font-medium text-foreground/80 leading-snug group-hover:text-foreground transition-colors">
                  {p.venue}
                </span>
              </div>

              {/* Main content right column */}
              <div className="flex-1 min-w-0">
                <h2 className="text-base sm:text-lg lg:text-xl font-bold leading-tight group-hover:text-accent transition-colors duration-300">
                  {p.title}
                </h2>
                
                {p.authors && (
                  <div className="mt-2 text-xs sm:text-sm text-foreground/60 font-medium">
                    {p.authors.join(", ")}
                  </div>
                )}

                {p.abstract && (
                  <details className="mt-4 group/details">
                  <summary className="text-[10px] font-mono uppercase tracking-widest text-accent/80 cursor-pointer list-none flex items-center gap-2 hover:text-accent transition-colors w-max select-none">
                    <span className="group-open/details:hidden border border-accent/20 bg-accent/5 px-2 py-1 rounded shadow-sm hover:border-accent/40">[+] Read Abstract</span>
                    <span className="hidden group-open/details:inline border border-accent/20 bg-accent/5 px-2 py-1 rounded shadow-sm hover:border-accent/40">[-] Hide Abstract</span>
                  </summary>
                  <p className="mt-4 pl-4 border-l-2 border-foreground/10 text-xs sm:text-sm text-foreground/70 leading-relaxed font-mono origin-top animate-fade-in-up">
                    {p.abstract}
                  </p>
                </details>
                )}

                {p.links && p.links.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-3">
                    {p.links.map(l => {
                      const Icon = getKnownLinkIcon(l.type);
                      return (
                        <a 
                          key={l.url}
                          href={l.url} 
                          className="text-[10px] uppercase font-mono tracking-widest text-foreground/60 hover:text-accent border border-foreground/10 hover:border-accent/40 bg-foreground/5 hover:bg-accent/5 rounded px-3 py-2 transition-all duration-300 shadow-sm flex items-center gap-2"
                          target="_blank"
                          rel="noreferrer"
                        >
                          {Icon && <Icon className="w-3.5 h-3.5" />}
                          {formatLinkLabel(l.type)}
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      )}
    </main>
  );
}


