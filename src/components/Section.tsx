import type { ReactNode } from "react";
import { RevealText } from "./anim";

interface SectionProps {
  id: string;
  index: string;
  title: string;
  meta?: string;
  shape?: number;
  className?: string;
  children: ReactNode;
}

/** Full-bleed section with an oversized, left-anchored title. */
export function Section({ id, index, title, meta, shape, className, children }: SectionProps) {
  return (
    <section id={id} data-shape={shape} className={`relative px-[max(1rem,4vw)] py-[16vh] ${className ?? ""}`}>
      <div className="label flex items-center justify-between border-t border-line pt-4 text-ink-3">
        <span>
          <span className="text-accent">({index})</span> {title}
        </span>
        {meta && <span>{meta}</span>}
      </div>
      <RevealText as="h2" text={title} className="display mt-[4vh] block text-[11vw] md:text-[10vw]" />
      <div className="mt-[8vh]">{children}</div>
    </section>
  );
}
