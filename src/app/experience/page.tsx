"use client";
import { useState } from "react";
import { experiences } from "@/data/experience";
import { Modal } from "@/components/ui/Modal";
import { FiBriefcase, FiCalendar, FiMapPin, FiArrowRight } from "react-icons/fi";

export default function ExperiencePage() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const selectedExperience = selectedIndex !== null ? experiences[selectedIndex] : null;

  return (
    <main className="py-8 sm:py-12">
      <h1 className="text-xl sm:text-2xl font-semibold animate-fade-in-up">Experience</h1>
      {experiences.length === 0 ? (
        <p className="mt-4 text-xs sm:text-sm text-foreground/70 animate-fade-in-up delay-200">No experience added yet.</p>
      ) : (
        <div className="mt-8 sm:mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {experiences.map((exp, index) => (
            <button
              key={`${exp.organization}-${exp.start}`}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className="card p-5 sm:p-6 flex flex-col gap-4 group animate-fade-in-up text-left border-l-[3px] border-l-accent/45"
              style={{ animationDelay: `${0.2 + index * 0.1}s` }}
            >
              <div className="flex items-start justify-between gap-4 pb-3 border-b border-foreground/10">
                <div className="flex-1 min-w-0 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-xs text-foreground/65 uppercase tracking-wide">
                    <FiBriefcase className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Role</span>
                  </div>
                  <div className="font-semibold text-base sm:text-lg leading-tight group-hover:text-accent transition-colors duration-300">
                    {exp.role}
                  </div>
                  <div className="text-sm sm:text-base text-foreground/80 font-medium">{exp.organization}</div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-foreground/60 font-medium">
                    {exp.location && (
                      <span className="inline-flex items-center gap-1.5">
                        <FiMapPin className="h-3.5 w-3.5" aria-hidden="true" />
                        {exp.location}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5">
                      <FiCalendar className="h-3.5 w-3.5" aria-hidden="true" />
                      {exp.start} – {exp.end}
                    </span>
                  </div>
                </div>
                <div className="pt-0.5 text-xs sm:text-sm font-medium text-accent inline-flex items-center gap-1.5 shrink-0">
                  View details
                  <FiArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
                </div>
              </div>

              {exp.summary && (
                <p className="text-xs sm:text-sm text-foreground/70 group-hover:text-foreground/80 transition-colors duration-300 leading-relaxed">
                  {exp.summary}
                </p>
              )}

            </button>
          ))}
        </div>
      )}

      <Modal
        isOpen={selectedExperience !== null}
        onClose={() => setSelectedIndex(null)}
        title={selectedExperience ? selectedExperience.role : "Experience details"}
      >
        {selectedExperience && (
          <div className="space-y-5 sm:space-y-6">
            <div className="rounded-xl border border-foreground/10 bg-foreground/3 p-4 sm:p-5">
              <div className="flex items-center gap-2 text-xs text-foreground/65 uppercase tracking-wide">
                <FiBriefcase className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Organization</span>
              </div>
              <div className="mt-1.5 text-sm sm:text-base font-semibold text-foreground/90">{selectedExperience.organization}</div>
              <div className="mt-3 flex flex-wrap items-center gap-2.5 text-xs sm:text-sm text-foreground/70">
                {selectedExperience.location && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-foreground/15 px-2.5 py-1">
                    <FiMapPin className="h-3.5 w-3.5" aria-hidden="true" />
                    {selectedExperience.location}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 rounded-full border border-foreground/15 px-2.5 py-1">
                  <FiCalendar className="h-3.5 w-3.5" aria-hidden="true" />
                  {selectedExperience.start} – {selectedExperience.end}
                </span>
              </div>
            </div>

            {selectedExperience.summary && (
              <div>
                <h4 className="text-xs sm:text-sm uppercase tracking-wide text-foreground/60">Summary</h4>
                <p className="mt-2 text-sm text-foreground/85 leading-relaxed">{selectedExperience.summary}</p>
              </div>
            )}

            <div>
              <h4 className="text-xs sm:text-sm uppercase tracking-wide text-foreground/60">Highlights</h4>
              <ul className="mt-2.5 space-y-2.5">
              {selectedExperience.bullets.map((bullet, bulletIndex) => (
                <li key={bulletIndex} className="text-sm text-foreground/85 leading-relaxed flex gap-2.5">
                  <FiArrowRight className="h-3.5 w-3.5 text-accent mt-0.5 shrink-0" aria-hidden="true" />
                  <span>{bullet}</span>
                </li>
              ))}
              </ul>
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
}
