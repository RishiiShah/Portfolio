"use client";

import { createElement } from "react";
import { m } from "framer-motion";
import { skills } from "@/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Marquee } from "@/components/ui/Marquee";
import { getTechIcon, getBrandColor } from "@/components/ui/techRegistry";
import { Terminal, Layers, Cloud, Brain } from "lucide-react";
import type { ComponentType } from "react";

type CategoryMeta = {
  glyph: ComponentType<{ size?: number; className?: string }>;
  tint: string;
  duration: number;
  direction: "left" | "right";
};

const CATEGORY_META: Record<string, CategoryMeta> = {
  Languages: {
    glyph: Terminal,
    tint: "#7aa2ff",
    duration: 38,
    direction: "left",
  },
  "Frameworks & Tools": {
    glyph: Layers,
    tint: "#c6d4ff",
    duration: 52,
    direction: "right",
  },
  "Databases & Cloud": {
    glyph: Cloud,
    tint: "#5be3c4",
    duration: 44,
    direction: "left",
  },
  "AI / ML & Computer Vision": {
    glyph: Brain,
    tint: "#e6b980",
    duration: 58,
    direction: "right",
  },
};

function SkillTile({ name }: { name: string }) {
  const Icon = getTechIcon(name);
  const brand = getBrandColor(name);
  return (
    <span
      className="group/tile relative inline-flex items-center gap-2.5 rounded-xl border border-[var(--line)] bg-[var(--bg-elev-1)]/60 px-4 py-2.5 font-mono text-[0.75rem] uppercase tracking-[0.14em] text-[var(--ink-dim)] transition-all hover:border-[var(--line-strong)] hover:-translate-y-0.5"
      style={
        {
          "--brand": brand,
        } as React.CSSProperties
      }
    >
      {createElement(Icon, { size: 18, color: "currentColor" })}
      <span className="group-hover/tile:text-[var(--ink)] transition-colors">
        {name}
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity group-hover/tile:opacity-100"
        style={{
          boxShadow: `inset 0 0 16px color-mix(in srgb, ${brand} 28%, transparent)`,
          border: `1px solid color-mix(in srgb, ${brand} 40%, transparent)`,
          borderRadius: "0.75rem",
        }}
      />
    </span>
  );
}

export function Skills() {
  const totalItems = skills.reduce((acc, g) => acc + g.items.length, 0);

  return (
    <section id="skills" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeading
            index="04"
            backgroundText="STACK"
            eyebrow="Skills & Stack"
            title="Tooling I reach for"
            subtitle={`${totalItems} technologies across ${skills.length} disciplines. Each row drifts continuously. Hover to freeze, hover a tile for its brand glow.`}
          />
        </m.div>

        <div className="space-y-5">
          {skills.map((group, i) => {
            const meta = CATEGORY_META[group.category];
            const Glyph = meta?.glyph ?? Terminal;
            const repeatMultiplier = Math.max(2, Math.ceil(14 / group.items.length));
            const loopItems = Array.from({ length: repeatMultiplier }, () => group.items).flat();
            return (
              <m.div
                key={group.category}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="relative rounded-2xl border border-[var(--line)] bg-[var(--bg-elev-1)]/30 overflow-hidden"
              >
                {/* Accent glow */}
                <div
                  aria-hidden
                  className="absolute inset-y-0 left-0 w-40 opacity-30 blur-2xl pointer-events-none"
                  style={{
                    background: `radial-gradient(closest-side, ${meta?.tint}, transparent 70%)`,
                  }}
                />

                <div className="relative flex flex-col items-stretch gap-4 py-5 md:flex-row md:items-center md:gap-6 md:py-6">
                  {/* Category label rail */}
                  <div
                    className="w-full shrink-0 px-5 md:w-auto md:min-w-[180px] md:pl-6 md:pr-4"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="flex items-center justify-center w-6 h-6 rounded-md border"
                        style={{
                          borderColor: `color-mix(in srgb, ${meta?.tint} 35%, transparent)`,
                          color: meta?.tint,
                          background: `color-mix(in srgb, ${meta?.tint} 10%, transparent)`,
                        }}
                      >
                        <Glyph size={13} />
                      </span>
                      <span
                        className="font-mono text-[9px] uppercase tracking-[0.2em]"
                        style={{ color: meta?.tint }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <p className="font-serif text-[var(--ink)] leading-tight text-[1rem] md:text-[1.15rem]">
                      {group.category}
                    </p>
                    <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--ink-mute)] mt-1">
                      {group.items.length} tools
                    </p>
                  </div>

                  {/* Divider */}
                  <div
                    className="hidden md:block w-px self-stretch my-2"
                    style={{
                      background: `linear-gradient(180deg, transparent, color-mix(in srgb, ${meta?.tint} 25%, transparent), transparent)`,
                    }}
                  />

                  {/* Marquee stream */}
                  <Marquee
                    direction={meta?.direction ?? "left"}
                    duration={meta?.duration ?? 40}
                    className="w-full md:min-w-0 md:flex-1"
                    gap={12}
                  >
                    {loopItems.map((item, loopIndex) => (
                      <SkillTile key={`${group.category}-${item}-${loopIndex}`} name={item} />
                    ))}
                  </Marquee>
                </div>
              </m.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
