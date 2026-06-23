"use client";

import { m } from "framer-motion";
import { education } from "@/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { toIsoDate } from "@/lib/dates";

export function Education() {
  const currentProgram = education[0];
  const undergraduateProgram = education[1];
  const academicArc = [
    {
      label: "Current program",
      value: currentProgram.degree,
      detail: `${currentProgram.institution} · GPA ${currentProgram.gpa}`,
    },
    {
      label: "Undergraduate foundation",
      value: undergraduateProgram.degree,
      detail: `${undergraduateProgram.institution} · GPA ${undergraduateProgram.gpa}`,
    },
    {
      label: "Academic path",
      value: "AI & Data Science to Computer Science",
      detail: `${undergraduateProgram.location} to ${currentProgram.location}`,
    },
  ] as const;

  return (
    <section id="education" className="relative min-h-[68svh] overflow-hidden py-16 md:min-h-[72svh] md:py-20">
      <div className="relative z-[1] mx-auto max-w-6xl px-6">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeading
            index="06"
            backgroundText="SCHOOL"
            eyebrow="Education"
            title="Academic history"
          />
        </m.div>

        <div className="grid md:grid-cols-2 gap-5">
          {education.map((edu, i) => (
            <m.div
              key={edu.institution}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-panel-interactive rounded-2xl p-7 flex flex-col"
            >
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                <h3
                  className="font-serif text-[var(--ink)] leading-[1.15]"
                  style={{ fontSize: "clamp(1.25rem, 2vw, 1.5rem)" }}
                >
                  {edu.institution}
                </h3>
                <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--accent)] sm:mt-2 sm:shrink-0">
                  <time dateTime={toIsoDate(edu.start)}>{edu.start}</time>
                  {" - "}
                  <time dateTime={toIsoDate(edu.end)}>{edu.end}</time>
                </span>
              </div>
              <p className="text-sm text-[var(--ink)] font-medium mb-1.5">
                {edu.degree}
              </p>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--ink-mute)]">
                {edu.location}
              </p>
              {"gpa" in edu && (
                <p className="mt-2 font-mono text-[11px] tracking-[0.08em] text-[var(--accent)]">
                  GPA {edu.gpa}
                </p>
              )}
            </m.div>
          ))}
        </div>

        <m.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-8 rounded-2xl border border-[var(--line)] bg-[var(--bg-elev-1)]/30 p-5"
        >
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ink-mute)]">
            Academic arc
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {academicArc.map((item) => (
              <div key={item.label}>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--accent)]">
                  {item.label}
                </p>
                <p className="mt-2 text-sm font-medium leading-snug text-[var(--ink)]">
                  {item.value}
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-[var(--ink-dim)]">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </m.div>
      </div>
    </section>
  );
}
