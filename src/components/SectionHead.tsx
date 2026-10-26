import { Reveal } from "@/components/Reveal";

export function SectionHead({
  index,
  title,
  flourish,
  note,
  tone = "light",
}: {
  index: string;
  title: string;
  flourish?: string;
  note?: string;
  tone?: "light" | "dark";
}) {
  return (
    <Reveal
      className={`mb-14 flex flex-wrap items-end justify-between gap-6 border-b pb-6 md:mb-20 ${
        tone === "dark" ? "border-bg/15" : "border-line"
      }`}
    >
      <h2 className="display text-[clamp(3rem,9vw,8rem)]">
        <span className="mr-4 align-top font-mono text-sm font-normal tracking-normal text-accent">{index}</span>
        {title}
        {flourish ? <span className="flourish text-accent"> {flourish}</span> : null}
      </h2>
      {note ? <p className={`max-w-sm ${tone === "dark" ? "text-bg/60" : "text-ink-2"}`}>{note}</p> : null}
    </Reveal>
  );
}
