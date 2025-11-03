"use client";
import { useState, useEffect } from "react";
import { publications } from "@/data/publications";
import { Loading } from "@/components/Loading";

export default function PublicationsPage() {
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    return <Loading onComplete={() => setIsLoading(false)} />;
  }
  return (
    <main className="py-[clamp(1rem,4vh,3rem)]">
      <h1 className="text-xl sm:text-2xl font-semibold animate-fade-in-up">Publications / Research</h1>
      {publications.length === 0 ? (
        <p className="mt-4 text-xs sm:text-sm text-foreground/70 animate-fade-in-up delay-200">No publications added yet.</p>
      ) : (
        <ul className="mt-6 space-y-4 sm:space-y-6">
          {publications.map((p, index) => (
            <li key={p.title} className="rounded-lg border p-4 sm:p-5 transition-all duration-300 hover:border-foreground/30 hover:shadow-[0_8px_25px_rgba(237,237,237,0.1)] hover:-translate-y-1 animate-fade-in-up" style={{animationDelay: `${0.3 + index * 0.1}s`}}>
              <div className="font-medium text-sm sm:text-base leading-tight">{p.title}</div>
              <div className="text-xs sm:text-sm text-foreground/70 mt-1">{p.venue} • {p.year}</div>
              {p.authors && (
                <div className="text-xs text-foreground/60 mt-1">{p.authors.join(", ")}</div>
              )}
              {p.abstract && <p className="text-xs sm:text-sm text-foreground/80 mt-2">{p.abstract}</p>}
              {p.links && p.links.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2 sm:gap-3 text-xs">
                  {p.links.map((l) => (
                    <a key={l.url} href={l.url} className="underline underline-offset-4 hover:text-foreground/80 transition-all duration-300 hover:scale-105" target="_blank" rel="noreferrer">{l.label}</a>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}


