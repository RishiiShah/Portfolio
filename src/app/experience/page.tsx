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
        <ul className="mt-6 space-y-4 sm:space-y-6">
          {experiences.map((exp, index) => (
            <li key={`${exp.organization}-${exp.start}`} className="rounded-lg border p-4 sm:p-5 transition-all duration-300 hover:border-foreground/30 hover:bg-foreground/5 hover:scale-[1.02] hover:shadow-lg group animate-fade-in-up" style={{animationDelay: `${0.3 + index * 0.1}s`}}>
              <div className="font-medium text-sm sm:text-base leading-tight group-hover:text-foreground transition-colors duration-300">{exp.role}</div>
              <div className="text-xs sm:text-sm text-foreground/70 mt-1 group-hover:text-foreground/80 transition-colors duration-300">
                {exp.organization}{exp.location ? `, ${exp.location}` : ""} • {exp.start} – {exp.end}
              </div>
              <ul className="text-foreground/80 mt-2 space-y-1 list-disc pl-4">
                {exp.bullets.map((bullet, bulletIndex) => (
                  <li key={bulletIndex} className="text-xs sm:text-sm group-hover:text-foreground/90 transition-colors duration-300">{bullet}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

