import { Reveal } from "@/components/Reveal";

export function SectionHead({ index, title, note }: { index: string; title: string; note?: string }) {
  return (
    <Reveal className="mb-14 flex flex-wrap items-end justify-between gap-6 border-b border-line pb-6 md:mb-20">
      <h2 className="display text-[clamp(3rem,9vw,8rem)]">
        <span className="mr-4 align-top font-mono text-sm font-normal tracking-normal text-accent">{index}</span>
        {title}
      </h2>
      {note ? <p className="max-w-sm text-ink-2">{note}</p> : null}
    </Reveal>
  );
}
