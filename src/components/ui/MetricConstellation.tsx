"use client";

import { useMemo } from "react";
import { m } from "framer-motion";
import type { ProjectMetric } from "@/data";

interface MetricConstellationProps {
  metrics: readonly ProjectMetric[];
  size?: number;
}

function estimateMonoLabelWidth(label: string): number {
  // Deterministic server/client width estimate for 10px mono labels.
  // Includes a 0.08em letter spacing used by the label style.
  const LETTER_SPACING = 0.8;
  let width = 0;

  for (const char of label.toUpperCase()) {
    if (char === " ") {
      width += 3.6;
      continue;
    }
    if (char === "-") {
      width += 4.2;
      continue;
    }
    if (char === ".") {
      width += 2.8;
      continue;
    }
    width += 6;
  }

  return width + Math.max(0, label.length - 1) * LETTER_SPACING;
}

/**
 * Renders a radial "constellation" of project metrics: each metric is plotted
 * on a polar axis with value-driven radius and a connecting polygon.
 * Reads as a research figure rather than a dashboard KPI block.
 */
export function MetricConstellation({ metrics, size = 340 }: MetricConstellationProps) {
  const slice = metrics.slice(0, 6);
  const framePadding = Math.round(size * 0.16);
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.4;
  const labelR = maxR + size * 0.04;

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
          labelX: cx + Math.cos(angle) * labelR,
          labelY: cy + Math.sin(angle) * labelR,
          normalized,
        };
      }),
    [slice, cx, cy, maxR, labelR]
  );

  const polygon = parsed.map((p) => `${p.x},${p.y}`).join(" ");

  // Background rings
  const rings = [0.25, 0.5, 0.75, 1].map((t) => t * maxR);

  return (
    <svg
      viewBox={`${-framePadding} ${-framePadding} ${size + framePadding * 2} ${size + framePadding * 2}`}
      className="h-auto w-full overflow-visible"
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
      {parsed.map((p, i) => {
        const cos = Math.cos(p.angle);
        const sin = Math.sin(p.angle);
        const anchor = cos > 0.32 ? "start" : cos < -0.32 ? "end" : "middle";
        const dx = cos > 0.32 ? 7 : cos < -0.32 ? -7 : 0;
        const labelYOffset = sin > 0.4 ? 2 : sin < -0.4 ? -2 : 0;
        const isTopOrBottom = Math.abs(cos) < 0.18;
        const labelHalfWidth = estimateMonoLabelWidth(p.label) / 2;
        const valueDx = isTopOrBottom ? labelHalfWidth + 8 : 0;
        const valueY = isTopOrBottom
          ? p.labelY + labelYOffset
          : p.labelY + 14 + labelYOffset;
        const valueAnchor = isTopOrBottom ? "start" : anchor;
        return (
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
            <text
              x={p.labelX + dx}
              y={p.labelY + labelYOffset}
              fontSize="10"
              fontFamily="var(--font-mono)"
              fill="var(--ink-mute)"
              textAnchor={anchor}
              dominantBaseline="middle"
              style={{ textTransform: "uppercase", letterSpacing: "0.08em" }}
            >
              {p.label}
            </text>
            <text
              x={p.labelX + dx + valueDx}
              y={valueY}
              fontSize="12"
              fontFamily="var(--font-sans)"
              fill="var(--ink)"
              fontWeight="600"
              textAnchor={valueAnchor}
              dominantBaseline="middle"
            >
              {p.value}
            </text>
          </m.g>
        );
      })}

      {/* Center crosshair */}
      <circle cx={cx} cy={cy} r="2" fill="var(--accent)" />
    </svg>
  );
}
