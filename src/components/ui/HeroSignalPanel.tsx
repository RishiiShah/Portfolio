"use client";

import { m, useScroll, useTransform } from "framer-motion";
import { Tilt } from "@/components/ui/Tilt";
import { projects, publications } from "@/data";

export function HeroSignalPanel() {
  const { scrollYProgress } = useScroll();
  const fill = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const latest = projects.find((p) => p.latest);

  return (
    <Tilt
      invert
      glare
      max={6}
      className="w-full rounded-2xl glass-panel overflow-hidden"
    >
      {/* Warm top accent */}
      <div
        className="h-px w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(230,185,128,0.6), transparent)",
        }}
      />
      <div className="p-6 md:p-7 space-y-5">
        <Row
          eyebrow="Latest"
          title={latest?.title ?? "In Development"}
          badge="Active"
          badgeTone="signal"
        />
        <Divider />
        <Row
          eyebrow="Published"
          title={`${publications.length} papers`}
          badge="Research"
          badgeTone="warm"
        />
        <Divider />
        <Row
          eyebrow="Focus"
          title="Backend · Computer Vision · MLOps"
        />
        <Divider />

        {/* Scroll progress sparkline */}
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ink-mute)]">
            Scroll depth
          </p>
          <div className="mt-2 h-1 w-full rounded-full bg-[var(--line)] overflow-hidden">
            <m.div
              style={{ width: fill }}
              className="h-full rounded-full"
            >
              <div
                className="h-full w-full"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(122,162,255,0.6), rgba(230,185,128,0.9))",
                }}
              />
            </m.div>
          </div>
          <div className="mt-2 flex justify-between font-mono text-[10px] text-[var(--ink-mute)]">
            <span>hero</span>
            <span>contact</span>
          </div>
        </div>
      </div>
    </Tilt>
  );
}

function Row({
  eyebrow,
  title,
  badge,
  badgeTone,
}: {
  eyebrow: string;
  title: string;
  badge?: string;
  badgeTone?: "signal" | "warm";
}) {
  const tone =
    badgeTone === "warm"
      ? "text-[var(--accent-warm)] border-[var(--accent-warm)]/40 bg-[var(--accent-warm)]/10"
      : "text-[var(--accent-signal)] border-[var(--accent-signal)]/40 bg-[var(--accent-signal)]/10";
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ink-mute)]">
          {eyebrow}
        </p>
        <p className="mt-1 text-sm text-[var(--ink)] truncate">{title}</p>
      </div>
      {badge && (
        <span
          className={`shrink-0 font-mono text-[10px] px-2 py-0.5 rounded border ${tone}`}
        >
          {badge}
        </span>
      )}
    </div>
  );
}

function Divider() {
  return <div className="h-px w-full bg-[var(--line)]" />;
}
