"use client";

import { m } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Parallax } from "@/components/ui/ParallaxSection";
import { bio, projects, publications } from "@/data";
import { sanitizeForMeta } from "@/lib/site";

export function About() {
  const latest = projects.find((p) => p.latest);
  const featuredPublication = publications.find((p) => p.featured) ?? publications[0];

  const facts: { label: string; value: string }[] = [
    { label: "Based in", value: bio.location },
    { label: "Current", value: "M.S. Computer Science @ Rutgers" },
    {
      label: "Now building",
      value: latest ? latest.title : "Active projects",
    },
    {
      label: "Open to",
      value: "SWE · Systems · AI/ML · FT + internships",
    },
  ];
  const aboutHighlights = [
    {
      label: "Latest build",
      value: latest ? latest.title : "Active projects",
      detail: latest ? latest.tagline : "Current portfolio work in progress.",
    },
    {
      label: "Research record",
      value: `${publications.length} peer-reviewed papers`,
      detail: `Featured: ${featuredPublication.title}`,
    },
    {
      label: "Current base",
      value: bio.location,
      detail: "Open to SWE, systems, AI/ML, full-time, and internship roles.",
    },
  ] as const;

  return (
    <section id="about" className="relative min-h-[68svh] overflow-hidden py-16 md:min-h-[72svh] md:py-20">
      <div className="relative z-[1] mx-auto max-w-6xl px-6">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeading
            index="05"
            backgroundText="ABOUT"
            eyebrow="About"
            title="A longer read"
          />
        </m.div>

        <div className="grid md:grid-cols-[1.3fr_1fr] gap-10 md:gap-16">
          {/* Left: prose */}
          <Parallax offset={16}>
            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <p
                className="font-serif text-[var(--ink)] leading-[1.15] mb-8"
                style={{ fontSize: "clamp(1.4rem, 2.6vw, 1.8rem)" }}
              >
                &ldquo;{bio.tagline}&rdquo;
              </p>

              <p className="text-[var(--ink-dim)] leading-[1.75] mb-6 text-base">
                {sanitizeForMeta(bio.description)}
              </p>

              <p className="text-[var(--ink-dim)] leading-[1.75] text-base">
                My work spans{" "}
                <span className="text-[var(--ink)]">backend services</span>{" "}
                (Python, Django, Next.js),{" "}
                <span className="text-[var(--ink)]">ML research</span>{" "}
                (generative models and computer vision), and{" "}
                <span className="text-[var(--ink)]">MLOps pipelines</span> that
                take experiments to reliable production systems. Three
                peer-reviewed papers so far, covering synthetic financial data,
                intelligent traffic surveillance, and IoT voice assistants.
              </p>
            </m.div>
          </Parallax>

          {/* Right: facts column */}
          <Parallax offset={-16}>
            <m.aside
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass-panel rounded-2xl p-7"
            >
              <div className="divide-y divide-[var(--line)]">
                {facts.map((f) => (
                  <div key={f.label} className="py-3.5 first:pt-0 last:pb-0">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ink-mute)] mb-1">
                      {f.label}
                    </p>
                    <p className="text-sm text-[var(--ink)]">{f.value}</p>
                  </div>
                ))}
              </div>
            </m.aside>
          </Parallax>
        </div>

        <m.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-8 grid gap-3 md:grid-cols-3"
        >
          {aboutHighlights.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-[var(--line)] bg-[var(--bg-elev-1)]/35 px-4 py-4"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--accent-warm)]">
                {item.label}
              </p>
              <p className="mt-2 text-sm font-medium leading-snug text-[var(--ink)]">
                {item.value}
              </p>
              <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-[var(--ink-dim)]">
                {item.detail}
              </p>
            </div>
          ))}
        </m.div>
      </div>
    </section>
  );
}
