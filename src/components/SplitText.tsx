import type { CSSProperties } from "react";

export function SplitText({ text, offset = 0 }: { text: string; offset?: number }) {
  return (
    <span className="rise inline-block overflow-hidden pb-[0.08em] align-bottom">
      <span className="sr-only">{text}</span>
      {[...text].map((ch, i) => (
        <span key={i} aria-hidden style={{ "--i": i + offset } as CSSProperties}>
          {ch === " " ? "\u00a0" : ch}
        </span>
      ))}
    </span>
  );
}
