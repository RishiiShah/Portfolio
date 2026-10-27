import { education } from "@/data";
import { HeroBackdrop } from "@/components/HeroBackdrop";
import { SplitText } from "@/components/SplitText";
import { Sticker } from "@/components/Sticker";

function Redline() {
  return (
    <div aria-hidden className="pointer-events-none absolute -inset-x-3 -inset-y-4 hidden md:block">
      {["left-0 top-0 border-l border-t", "right-0 top-0 border-r border-t", "bottom-0 left-0 border-b border-l", "bottom-0 right-0 border-b border-r"].map(
        (c) => (
          <span key={c} className={`absolute size-4 border-accent ${c}`} />
        ),
      )}
      <span className="absolute -top-7 left-0 right-0 flex items-center gap-2 font-mono text-[0.65rem] text-accent">
        <span className="h-px flex-1 bg-accent/60" />
        1 problem solver, drawn to scale
        <span className="h-px flex-1 bg-accent/60" />
      </span>
    </div>
  );
}

export function Hero() {
  const ms = education[0];
  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden pt-16">
      <HeroBackdrop />

      <div className="shell relative flex flex-1 flex-col justify-center gap-10 py-10 md:py-14">
        <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="flourish text-[clamp(1.75rem,3.5vw,3rem)] text-ink-2">
              Hey there, I&apos;m
            </p>
            <h1 className="relative mt-12 w-fit">
              <Redline />
              <span className="display block text-[clamp(4rem,min(15vw,26svh),15rem)]">
                <SplitText text="Rishabh" />
                <br />
                <SplitText text="Shah" offset={7} />
                <span className="text-accent">
                  <SplitText text="." offset={11} />
                </span>
              </span>
            </h1>
          </div>

          <div className="flex flex-wrap gap-4 lg:w-72 lg:flex-col lg:items-start" aria-label="Highlights, drag them around">
            <Sticker rotate={-6} className="bg-sun text-xl">✦ 2× hackathon winner</Sticker>
            <Sticker rotate={4} className="bg-cobalt text-xl !text-white lg:ml-14">3 papers published</Sticker>
            <Sticker rotate={-3} className="bg-accent text-2xl lg:ml-4">−86% P95 latency</Sticker>
            <Sticker rotate={7} className="bg-mint text-lg lg:ml-20">TA · Rutgers CS205</Sticker>
            <p className="flourish hidden pl-6 text-xl text-ink-3 lg:block">↖ go on, drag them. Or click the background.</p>
          </div>
        </div>

        <div className="grid gap-8 border-t border-line pt-8 md:grid-cols-12">
          <p className="text-balance text-xl leading-snug md:col-span-7 md:text-2xl">
            I solve problems end to end, from a <span className="flourish text-[1.15em] text-accent">three-second</span> API
            to a stroke-consult scheduler, and I sweat the details nobody asked about.
          </p>
          <p className="text-ink-2 md:col-span-3">
            {ms.degree} at Rutgers, graduating {ms.end}. Open to SWE &amp; ML roles.
          </p>
          <div className="flex items-end gap-3 md:col-span-2 md:flex-col md:items-end md:justify-end">
            <a
              href="#work"
              className="inline-flex h-11 items-center whitespace-nowrap rounded-xl bg-ink px-5 text-sm font-medium text-bg transition-all hover:-translate-y-0.5 hover:bg-accent hover:text-accent-ink"
            >
              See the work ↓
            </a>
            <a
              href="#contact"
              className="inline-flex h-11 items-center whitespace-nowrap rounded-xl border border-line-2 px-5 text-sm transition-colors hover:border-ink"
            >
              Say hi
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
