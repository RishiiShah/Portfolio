import type { CSSProperties } from "react";

/** Per-character rise animation. Decorative only; keep real copy in a sibling `.sr-only`. */
export function SplitText({ text, offset = 0 }: { text: string; offset?: number }) {
  return (
    <span
      aria-hidden
      className="rise -mb-[0.1em] -mt-[0.12em] inline-block overflow-x-visible overflow-y-clip pb-[0.18em] pt-[0.12em] align-bottom"
    >
      {[...text].map((ch, i) => (
        <span key={i} style={{ "--i": i + offset } as CSSProperties}>
          <span className="char">{ch === " " ? "\u00a0" : ch}</span>
        </span>
      ))}
    </span>
  );
}
