"use client";

import { createElement } from "react";
import { getTechIcon, getBrandColor } from "./techRegistry";

interface TechChipProps {
  name: string;
  size?: "xs" | "sm" | "md";
  interactive?: boolean;
}

const SIZE_CLASSES: Record<NonNullable<TechChipProps["size"]>, string> = {
  xs: "text-[10px] px-2 py-0.5 gap-1",
  sm: "text-[11px] px-2.5 py-1 gap-1.5",
  md: "text-[12px] px-3 py-1.5 gap-2",
};

const ICON_SIZE: Record<NonNullable<TechChipProps["size"]>, number> = {
  xs: 11,
  sm: 13,
  md: 15,
};

export function TechChip({
  name,
  size = "sm",
  interactive = true,
}: TechChipProps) {
  const Icon = getTechIcon(name);
  const brand = getBrandColor(name);

  return (
    <span
      className={`group/chip relative inline-flex items-center rounded-md border border-[var(--line)] bg-[var(--bg-elev-1)]/50 font-mono text-[var(--ink-dim)] ${
        SIZE_CLASSES[size]
      } ${
        interactive
          ? "transition-all hover:border-[var(--line-strong)] hover:text-[var(--ink)] hover:-translate-y-[1px]"
          : ""
      }`}
      style={
        {
          "--brand": brand,
        } as React.CSSProperties
      }
    >
      {createElement(Icon, { size: ICON_SIZE[size], color: "currentColor" })}
      <span>{name}</span>
      {interactive && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-md opacity-0 transition-opacity group-hover/chip:opacity-100"
          style={{
            boxShadow: `inset 0 0 12px color-mix(in srgb, ${brand} 30%, transparent)`,
          }}
        />
      )}
    </span>
  );
}
