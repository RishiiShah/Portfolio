"use client";

import { m } from "framer-motion";
import { experience } from "@/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TechChip } from "@/components/ui/TechChip";
import { toIsoDate } from "@/lib/dates";

function TimelineDot({ active }: { active: boolean }) {
  return (
    <div className="relative z-10 mt-[6px] shrink-0 flex items-center justify-center w-5 h-5">
      <div
        className="w-2.5 h-2.5 rounded-full ring-4 ring-[var(--bg)]"
        style={{
          background: active ? "var(--accent-signal)" : "var(--accent)",
          boxShadow: active
            ? "0 0 12px rgba(91,227,196,0.75)"
            : "0 0 10px rgba(122,162,255,0.5)",
        }}
      />
      {active && (
        <span className="absolute inset-0 rounded-full bg-[var(--accent-signal)]/30 animate-ping" />
      )}
    </div>
  );
}

export function Experience() {
  return (
    <section id="experience" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeading
            index="03"
            backgroundText="WORK"
            eyebrow="Experience"
            title="Where I've worked"
            subtitle="Recent internships, shipped features, and measurable impact."
          />
        </m.div>

        <div>
          {experience.map((item, i) => (
            <m.div
              key={`${item.organization}-${item.start}`}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="grid grid-cols-[20px_1fr] gap-x-5"
            >
              {/* Timeline column */}
              <div className="flex flex-col items-center">
                <TimelineDot active={i === 0} />
                {i < experience.length - 1 && (
                  <div className="w-px flex-1 my-1 bg-gradient-to-b from-[var(--accent)]/40 to-transparent" />
                )}
              </div>

              {/* Content */}
              <div className="pb-12 last:pb-0">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-1">
                  <h3 className="text-lg font-semibold text-[var(--ink)]">
                    {item.role}
                  </h3>
                  <span className="font-mono text-[11px] text-[var(--ink-mute)] shrink-0 uppercase tracking-[0.12em]">
                    <time dateTime={toIsoDate(item.start)}>{item.start}</time>
                    {" – "}
                    <time dateTime={toIsoDate(item.end)}>{item.end}</time>
                  </span>
                </div>
                <p className="text-sm text-[var(--ink-dim)] mb-5">
                  {item.organization}
                  {item.location && (
                    <span className="text-[var(--ink-mute)]">
                      {" "}
                      · {item.location}
                    </span>
                  )}
                </p>

                <ul className="space-y-2.5 mb-5">
                  {item.bullets.map((bullet, bi) => (
                    <li
                      key={bi}
                      className="flex gap-3 text-[0.9375rem] text-[var(--ink-dim)] leading-relaxed"
                    >
                      <span className="text-[var(--accent)] shrink-0 mt-1 text-[10px]">
                        ▸
                      </span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                {item.tech && item.tech.length > 0 && (
                  <div className="mt-2">
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ink-mute)] mb-2.5">
                      Stack
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {item.tech.map((t) => (
                        <TechChip key={t} name={t} size="sm" />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}
