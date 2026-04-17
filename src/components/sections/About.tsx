"use client";

import { m } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Parallax } from "@/components/ui/ParallaxSection";
import { bio, projects } from "@/data";
import { sanitizeForMeta } from "@/lib/site";

export function About() {
  const latest = projects.find((p) => p.latest);

  const facts: { label: string; value: string }[] = [
    { label: "Based in", value: bio.location },
    { label: "Current", value: "M.S. CS @ Rutgers (2025–2027)" },
    {
      label: "Now building",
      value: latest ? latest.title : "Active projects",
    },
    {
      label: "Open to",
      value: "SWE · Systems · ML-AI · FT + internships",
    },
  ];

  return (
    <section id="about" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
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
                (Django, Flask, Node),{" "}
                <span className="text-[var(--ink)]">ML research</span>{" "}
                (generative models, computer vision, audio), and{" "}
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
      </div>
    </section>
  );
}
