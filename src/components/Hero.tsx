import { ArrowDown, ArrowRight } from "lucide-react";
import { bio, education } from "@/data";
import { LocalTime } from "./LocalTime";

const grad = education[0].end.split(" ").slice(-2).join(" ");

/** One line, revealed by rising out of its own mask (see .reveal in globals.css). */
function Line({ children, d }: { children: React.ReactNode; d: number }) {
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <span className="reveal block" style={{ "--d": `${d}s` } as React.CSSProperties}>
        {children}
      </span>
    </span>
  );
}

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-svh flex-col px-[max(1.25rem,4vw)] pt-28 pb-8">
      <div className="mx-auto flex w-full max-w-[90rem] flex-1 flex-col">
        <p className="fade eyebrow text-ink-3" style={{ "--d": "0.1s" } as React.CSSProperties}>
          {bio.title}
        </p>

        <h1 className="display mt-6 text-[clamp(3.5rem,16vw,10.5rem)]">
          <Line d={0}>Software that</Line>
          <Line d={0.08}>holds up after</Line>
          <Line d={0.16}>
            <em className="text-accent">the demo.</em>
          </Line>
        </h1>

        <div className="mt-auto grid gap-8 pt-14 md:grid-cols-12 md:items-end">
          <p className="fade max-w-[40ch] text-[clamp(1.05rem,1.35vw,1.3rem)] leading-relaxed text-ink-2 md:col-span-6" style={{ "--d": "0.35s" } as React.CSSProperties}>
            I&apos;m {bio.name.split(" ")[0]}, an M.S. Computer Science student at Rutgers building scalable backends, AI
            products, and computer-vision research.
          </p>
          <div className="fade flex flex-wrap gap-3 md:col-span-6 md:justify-end" style={{ "--d": "0.45s" } as React.CSSProperties}>
            <a
              href="#work"
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-bg transition-colors hover:bg-accent hover:text-accent-ink"
            >
              Selected work <ArrowDown size={16} className="transition-transform group-hover:translate-y-0.5" />
            </a>
            <a
              href="#contact"
              className="group inline-flex h-12 items-center gap-2 rounded-full border border-line px-6 transition-colors hover:border-ink"
            >
              Get in touch <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>

        <div
          className="fade mt-10 flex flex-wrap items-center justify-between gap-x-8 gap-y-2 border-t border-line pt-5 text-sm text-ink-3"
          style={{ "--d": "0.6s" } as React.CSSProperties}
        >
          <span className="flex items-center gap-2.5">
            <span className="relative flex size-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-60 motion-reduce:hidden" />
              <span className="relative size-2 rounded-full bg-accent" />
            </span>
            Open to SWE and AI/ML roles from {grad}
          </span>
          <span>
            {bio.location} · <LocalTime />
          </span>
        </div>
      </div>
    </section>
  );
}
