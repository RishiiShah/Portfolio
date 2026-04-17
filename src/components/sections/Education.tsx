"use client";

import { m } from "framer-motion";
import { education } from "@/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { toIsoDate } from "@/lib/dates";

export function Education() {
  return (
    <section id="education" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
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
                  {" – "}
                  <time dateTime={toIsoDate(edu.end)}>{edu.end}</time>
                </span>
              </div>
              <p className="text-sm text-[var(--ink)] font-medium mb-1.5">
                {edu.degree}
              </p>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--ink-mute)]">
                {edu.location}
              </p>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}
