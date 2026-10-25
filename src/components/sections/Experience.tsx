"use client";

import { useState } from "react";
import { ArrowRight, Plus } from "lucide-react";
import { education, experience, teaching } from "@/data";
import { toIsoDate } from "@/lib/dates";
import { cn } from "@/lib/utils";
import { Section } from "../Section";

/*
 * Experience as a ledger: one row per role, newest first, with its headline
 * result in view. Opening a row shows the detail.
 */

interface Role {
  start: string;
  end?: string;
  title: string;
  org: string;
  place: string;
  bullets: readonly string[];
  tech?: string[];
  headline?: { value: string; label: string };
}

const ROLES: Role[] = [
  {
    start: teaching.start,
    title: teaching.role,
    org: `${teaching.organization} · ${teaching.courseShort}`,
    place: teaching.location,
    bullets: teaching.bullets,
    headline: { value: "50+", label: "Students each week" },
  },
  ...experience.map(
    (j): Role => ({
      start: j.start,
      end: j.end,
      title: j.role,
      org: j.organization,
      place: j.location ?? "",
      bullets: j.bullets,
      tech: j.tech,
      headline: j.highlights?.[0],
    })
  ),
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const short = (d: string) => {
  const [y, m] = toIsoDate(d).split("-").map(Number);
  return m ? `${MONTHS[m - 1]} ${y}` : String(y);
};

export function Experience() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <Section id="experience" index="03" title="Experience" meta={`${ROLES.length} roles`} shape={3} field="off">
      <ol className="border-b border-line">
        {ROLES.map((r, i) => (
          <Row key={r.title + r.org} role={r} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
        ))}
      </ol>
      <p className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-ink-2">
        <span className="label text-ink-3">Next</span>
        Graduating {short(education[0].end)} · open to SWE, systems &amp; AI/ML roles
        <a href="#contact" className="group inline-flex items-center gap-2 text-accent">
          Get in touch <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
        </a>
      </p>
    </Section>
  );
}

function Row({ role: r, open, onToggle }: { role: Role; open: boolean; onToggle: () => void }) {
  const id = `role-${r.org.split(" ")[0].toLowerCase()}`;
  return (
    <li className={cn("border-t border-line transition-colors", open && "bg-bg-2/60")}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={id}
        className="group grid w-full grid-cols-[1fr_auto] items-center gap-x-6 gap-y-2 py-6 text-left md:grid-cols-[11rem_1fr_14rem_2rem] md:px-3"
      >
        <span className="label col-span-2 text-ink-3 md:col-span-1">
          {short(r.start)} → {r.end ? short(r.end) : "Present"}
        </span>
        <span className="min-w-0">
          <span className="wide block text-[clamp(1.25rem,2vw,2rem)] leading-tight font-bold tracking-tight transition-colors group-hover:text-accent">
            {r.title}
          </span>
          <span className="mt-1 block text-ink-2">
            {r.org} <span className="text-ink-3">· {r.place}</span>
          </span>
        </span>
        {r.headline && (
          <span className="hidden md:block">
            <span className="wide block text-[clamp(1.25rem,1.8vw,1.75rem)] leading-none font-bold tracking-tight">{r.headline.value}</span>
            <span className="label mt-1.5 block text-ink-3">{r.headline.label}</span>
          </span>
        )}
        <Plus size={18} aria-hidden className={cn("justify-self-end transition-transform duration-500", open && "rotate-45 text-accent")} />
      </button>

      <div id={id} className="expander" data-open={open}>
        <div inert={!open}>
          <div className="pb-8 md:grid md:grid-cols-[11rem_1fr] md:gap-x-6 md:px-3">
            <div className="hidden md:block" />
            <div>
              <ul className="max-w-[72ch] space-y-2.5 text-[clamp(15px,1vw,17px)] leading-relaxed text-ink-2">
                {r.bullets.map((b) => (
                  <li key={b} className="relative pl-5 before:absolute before:top-[0.75em] before:left-0 before:h-px before:w-2.5 before:bg-accent">
                    {b}
                  </li>
                ))}
              </ul>
              {r.tech && <p className="label mt-5 text-ink-3">{r.tech.join(" · ")}</p>}
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}
