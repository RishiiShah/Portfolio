"use client";

import { m } from "framer-motion";

interface FilterPillsProps {
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
  className?: string;
}

export function FilterPills({ options, value, onChange, className = "" }: FilterPillsProps) {
  return (
    <div
      role="tablist"
      aria-label="Filter projects"
      className={`flex flex-wrap gap-2 ${className}`}
    >
      {options.map((opt) => {
        const active = opt === value;
        return (
          <button
            key={opt}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt)}
            className={`relative font-mono text-[11px] uppercase tracking-[0.12em] px-3 py-1.5 rounded-full border transition-colors ${
              active
                ? "border-[var(--accent-warm)]/50 text-[var(--accent-warm)]"
                : "border-[var(--line)] text-[var(--ink-mute)] hover:text-[var(--ink-dim)] hover:border-[var(--line-strong)]"
            }`}
          >
            {active && (
              <m.span
                layoutId="filter-pill-bg"
                className="absolute inset-0 rounded-full"
                style={{ background: "rgba(230,185,128,0.08)" }}
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative">{opt}</span>
          </button>
        );
      })}
    </div>
  );
}
