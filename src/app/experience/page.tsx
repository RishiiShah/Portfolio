"use client";
import { useState } from "react";
import { experiences } from "@/data/experience";
import { Loading } from "@/components/Loading";

export default function ExperiencePage() {
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    return <Loading onComplete={() => setIsLoading(false)} />;
  }

  return (
    <main className="py-8 sm:py-12">
      <h1 className="text-xl sm:text-2xl font-semibold animate-fade-in-up">Experience</h1>
      {experiences.length === 0 ? (
        <p className="mt-4 text-xs sm:text-sm text-foreground/70 animate-fade-in-up delay-200">No experience added yet.</p>
      ) : (
        <div className="mt-8 sm:mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {experiences.map((exp, index) => (
            <div
              key={`${exp.organization}-${exp.start}`}
              className="rounded-lg border p-5 sm:p-6 flex flex-col gap-4 transition-all duration-300 hover:border-foreground/30 hover:bg-foreground/5 hover:shadow-[0_4px_12px_rgba(237,237,237,0.1)] hover:scale-[1.01] group animate-fade-in-up"
              style={{ animationDelay: `${0.2 + index * 0.1}s` }}
            >
              {/* Header Section */}
              <div className="flex flex-col gap-2 pb-3 border-b border-foreground/10">
                <div className="font-semibold text-base sm:text-lg leading-tight group-hover:text-foreground transition-colors duration-300">
                  {exp.role}
                </div>
                <div className="text-sm sm:text-base text-foreground/80 font-medium">
                  {exp.organization}
                  {exp.location && <span className="text-foreground/60 font-normal"> • {exp.location}</span>}
                </div>
                <div className="text-xs sm:text-sm text-foreground/60 font-medium">
                  {exp.start} – {exp.end}
                </div>
              </div>

              {/* Summary */}
              {exp.summary && (
                <p className="text-xs sm:text-sm text-foreground/70 group-hover:text-foreground/80 transition-colors duration-300 leading-relaxed">
                  {exp.summary}
                </p>
              )}

              {/* Bullets */}
              {exp.bullets && exp.bullets.length > 0 && (
                <div className="space-y-2.5 sm:space-y-3 pt-2">
                  {exp.bullets.map((bullet, bulletIndex) => (
                    <div
                      key={bulletIndex}
                      className="text-xs sm:text-sm text-foreground/80 group-hover:text-foreground/90 transition-colors duration-300 leading-relaxed flex gap-2.5"
                    >
                      <span className="text-foreground/40 group-hover:text-foreground/60 transition-colors duration-300 shrink-0 mt-1">•</span>
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
