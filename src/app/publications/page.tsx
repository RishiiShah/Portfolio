"use client";
import { publications } from "@/data/publications";
import { IconLinkButton } from "@/components/ui/IconLinkButton";
import { formatLinkLabel, getKnownLinkIcon } from "@/utils/linkIcons";

export default function PublicationsPage() {
  return (
    <main className="py-[clamp(1rem,4vh,3rem)]">
      <h1 className="text-xl sm:text-2xl font-semibold animate-fade-in-up">Publications / Research</h1>
      {publications.length === 0 ? (
        <p className="mt-4 text-xs sm:text-sm text-foreground/70 animate-fade-in-up delay-200">No publications added yet.</p>
      ) : (
        <ul className="mt-6 space-y-4 sm:space-y-6">
          {publications.map((p, index) => (
            <li key={p.title} className="card rounded-xl p-4 sm:p-5 group animate-fade-in-up hover:shadow-[0_12px_28px_rgba(0,0,0,0.28)]" style={{ animationDelay: `${0.3 + index * 0.1}s` }}>
              <div className="font-medium text-sm sm:text-base leading-tight group-hover:text-accent transition-colors duration-300">{p.title}</div>
              <div className="text-xs sm:text-sm text-foreground/70 mt-1 group-hover:text-foreground/80 transition-colors duration-300">{p.venue} • {p.publishedAt ?? p.year}</div>
              {p.authors && (
                <div className="text-xs text-foreground/60 mt-1 group-hover:text-foreground/70 transition-colors duration-300">{p.authors.join(", ")}</div>
              )}
              {p.abstract && <p className="text-xs sm:text-sm text-foreground/80 mt-2 group-hover:text-foreground/80 transition-colors duration-300">{p.abstract}</p>}
              {p.links && p.links.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2 sm:gap-3 text-xs">
                  {p.links.map((l) => {
                    const Icon = getKnownLinkIcon(l.type);

                    if (Icon) {
                      return (
                        <IconLinkButton
                          key={l.url}
                          href={l.url}
                          label={formatLinkLabel(l.type)}
                          icon={Icon}
                          className="px-2.5 py-1 text-[11px]"
                        />
                      );
                    }

                    return (
                      <a
                        key={l.url}
                        href={l.url}
                        className="underline underline-offset-4 hover:text-foreground/80 transition-colors duration-300"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {formatLinkLabel(l.type)}
                      </a>
                    );
                  })}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}


