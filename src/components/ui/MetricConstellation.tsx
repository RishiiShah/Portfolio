"use client";

import { useMemo } from "react";
import { m } from "framer-motion";
import type { ProjectMetric } from "@/data";

interface MetricConstellationProps {
  metrics: readonly ProjectMetric[];
  size?: number;
}

/**
 * Renders a radial "constellation" of project metrics: each metric is plotted
 * on a polar axis with value-driven radius and a connecting polygon.
 * Reads as a research figure rather than a dashboard KPI block.
 */
export function MetricConstellation({ metrics, size = 340 }: MetricConstellationProps) {
  const slice = metrics.slice(0, 6);
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.36;

  // Normalize values to radius. Heuristic: extract first number from value string.
  const parsed = useMemo(
    () =>
      slice.map((m, i) => {
        const match = m.value.match(/(-?\d+(\.\d+)?)/);
        const num = match ? parseFloat(match[0]) : 50;
        // Heuristic normalization: if > 100, treat as percentage-ish and clamp; if < 1 treat as ratio.
        let normalized: number;
        if (num >= 0 && num <= 100) normalized = num / 100;
        else if (num < 0) normalized = Math.min(Math.abs(num) / 100, 1);
        else normalized = 0.75; // fallback for arbitrary units
        // Keep at least 0.35 so all dots are visible
        normalized = Math.max(0.35, Math.min(1, normalized));
        const angle = (i / slice.length) * Math.PI * 2 - Math.PI / 2;
        const r = normalized * maxR;
        return {
          ...m,
          angle,
          r,
          x: cx + Math.cos(angle) * r,
          y: cy + Math.sin(angle) * r,
          labelX: cx + Math.cos(angle) * (maxR + 30),
          labelY: cy + Math.sin(angle) * (maxR + 30),
          normalized,
        };
      }),
    [slice, cx, cy, maxR]
  );

  const polygon = parsed.map((p) => `${p.x},${p.y}`).join(" ");

  // Background rings
  const rings = [0.25, 0.5, 0.75, 1].map((t) => t * maxR);

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="w-full h-auto"
      role="img"
      aria-label="Project metric constellation"
    >
      {/* Rings */}
      {rings.map((r, i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="var(--line)"
          strokeWidth="0.6"
          strokeDasharray={i === rings.length - 1 ? "none" : "2 4"}
        />
      ))}

      {/* Spokes */}
      {parsed.map((p, i) => (
        <line
          key={`spoke-${i}`}
          x1={cx}
          y1={cy}
          x2={cx + Math.cos(p.angle) * maxR}
          y2={cy + Math.sin(p.angle) * maxR}
          stroke="var(--line)"
          strokeWidth="0.4"
        />
      ))}

      {/* Connecting polygon */}
      <m.polygon
        points={polygon}
        fill="rgba(122,162,255,0.12)"
        stroke="var(--accent)"
        strokeWidth="1.2"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Dots + labels */}
      {parsed.map((p, i) => (
        <m.g
          key={`pt-${i}`}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.4, delay: 0.6 + i * 0.08 }}
        >
          <circle
            cx={p.x}
            cy={p.y}
            r="4"
            fill="var(--accent-warm)"
            stroke="var(--bg-elev-1)"
            strokeWidth="2"
          />
          <circle cx={p.x} cy={p.y} r="9" fill="rgba(230,185,128,0.18)" />
          {/* Label */}
          <text
            x={p.labelX}
            y={p.labelY}
            fontSize="10"
            fontFamily="var(--font-mono)"
            fill="var(--ink-mute)"
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ textTransform: "uppercase", letterSpacing: "0.08em" }}
          >
            {p.label}
          </text>
          <text
            x={p.labelX}
            y={p.labelY + 14}
            fontSize="12"
            fontFamily="var(--font-sans)"
            fill="var(--ink)"
            fontWeight="600"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {p.value}
          </text>
        </m.g>
      ))}

      {/* Center crosshair */}
      <circle cx={cx} cy={cy} r="2" fill="var(--accent)" />
    </svg>
  );
}
