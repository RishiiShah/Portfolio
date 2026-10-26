import { bio, education, teaching } from "@/data";
import { HeroBackdrop } from "@/components/HeroBackdrop";
import { SplitText } from "@/components/SplitText";

export function Hero() {
  const ms = education[0];
  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden pt-16">
      <HeroBackdrop />

      <div className="shell relative flex flex-1 flex-col justify-between gap-10 py-8 md:py-12">
        <p className="label flex items-start gap-2 !text-ink-2">
          <span className="mt-[0.3em] size-2 shrink-0 rounded-full bg-accent [animation:blink_1.6s_steps(2)_infinite]" />
          <span>
            {teaching.role}, {teaching.organization} · {teaching.courseShort}
          </span>
        </p>

        <h1 className="display text-[clamp(4rem,min(17vw,30svh),17rem)]">
          <span className="block">
            <SplitText text="Rishabh" />
          </span>
          <span className="block">
            <SplitText text="Shah" offset={7} />
            <span className="rise inline-block overflow-hidden align-bottom text-accent">
              <span style={{ "--i": 12 } as React.CSSProperties}>.</span>
            </span>
          </span>
        </h1>

        <div className="grid gap-8 border-t border-line pt-8 md:grid-cols-12">
          <p className="text-balance text-xl leading-snug text-ink md:col-span-6 md:text-2xl">
            Software engineer who makes slow backends fast and gets models out of notebooks and into production.
          </p>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm md:col-span-4">
            <div>
              <dt className="label">Now</dt>
              <dd className="mt-1 text-ink-2">{ms.degree}, Rutgers</dd>
            </div>
            <div>
              <dt className="label">Graduating</dt>
              <dd className="mt-1 text-ink-2">{ms.end}</dd>
            </div>
            <div>
              <dt className="label">Based in</dt>
              <dd className="mt-1 text-ink-2">{bio.location}</dd>
            </div>
            <div>
              <dt className="label">Open to</dt>
              <dd className="mt-1 text-ink-2">SWE &amp; ML roles</dd>
            </div>
          </dl>
          <div className="flex items-end gap-3 md:col-span-2 md:flex-col md:items-end md:justify-end">
            <a
              href="#work"
              className="inline-flex h-11 items-center rounded-full bg-ink px-5 text-sm font-medium text-bg transition-colors hover:bg-accent"
            >
              See the work ↓
            </a>
            <a
              href={bio.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center rounded-full border border-line-2 px-5 text-sm text-ink transition-colors hover:border-ink"
            >
              Résumé
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
