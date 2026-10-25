import { ArrowRight } from "lucide-react";
import { education, experience, teaching } from "@/data";
import { toIsoDate } from "@/lib/dates";
import { Section } from "../Section";
import { Stagger } from "../anim";

/*
 * Experience as a bento: one card per role, each led by its headline number.
 * The latest internship gets the large card with the full detail.
 */

interface Role {
  span: string;
  title: string;
  org: string;
  place: string;
  metrics: { value: string; label: string }[];
  /** Full bullets on the large card; one line on the small ones. */
  bullets?: string[];
  summary?: string;
  tech?: string[];
  current?: boolean;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const short = (d: string) => {
  const [y, m] = toIsoDate(d).split("-").map(Number);
  return m ? `${MONTHS[m - 1]} ${y}` : String(y);
};

const [latest, earlier] = experience;
const job = (j: typeof latest) => ({
  span: `${short(j.start)} → ${short(j.end)}`,
  title: j.role,
  org: j.organization,
  place: j.location ?? "",
  metrics: j.highlights ?? [],
  tech: j.tech,
});

const LEAD: Role = { ...job(latest), bullets: latest.bullets };
const SIDE: Role[] = [
  {
    span: `${short(teaching.start)} → Present`,
    title: teaching.role,
    org: `${teaching.organization} · ${teaching.courseShort}`,
    place: teaching.location,
    metrics: [{ value: "50+", label: "Students each week" }],
    summary: teaching.bullets[0],
    current: true,
  },
  { ...job(earlier), summary: earlier.summary },
];

export function Experience() {
  return (
    <Section id="experience" index="03" title="Experience" meta={`${SIDE.length + 1} roles`} shape={3}>
      <Stagger className="grid gap-3 lg:grid-cols-12">
        <Card role={LEAD} className="lg:col-span-7 lg:row-span-2" large />
        {SIDE.map((r) => (
          <Card key={r.org} role={r} className="lg:col-span-5" />
        ))}
        <a
          href="#contact"
          className="tile group flex flex-wrap items-center justify-between gap-4 border-accent/50 p-6 lg:col-span-12"
        >
          <span className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
            <span className="label text-accent">Next</span>
            <span className="wide text-[clamp(1.1rem,1.5vw,1.5rem)] font-semibold tracking-tight">
              Graduating {short(education[0].end)}, open to SWE, systems &amp; AI/ML roles
            </span>
          </span>
          <span className="inline-flex items-center gap-2 text-accent">
            Get in touch <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </span>
        </a>
      </Stagger>
    </Section>
  );
}

function Card({ role: r, className, large }: { role: Role; className?: string; large?: boolean }) {
  const [lead, ...rest] = r.metrics;
  return (
    <article className={`tile flex flex-col p-[clamp(1.25rem,2vw,2.25rem)] ${className ?? ""}`}>
      <p className="label flex items-center justify-between gap-4 text-ink-3">
        <span>{r.span}</span>
        {r.current && <span className="border border-accent px-1.5 py-0.5 text-accent">Now</span>}
      </p>

      <div className="mt-6 flex flex-wrap items-end gap-x-10 gap-y-4">
        {lead && (
          <div>
            <p className={`wide leading-[0.85] font-bold tracking-tight text-accent ${large ? "text-[clamp(4rem,8vw,8.5rem)]" : "text-[clamp(3rem,4.6vw,5rem)]"}`}>
              {lead.value}
            </p>
            <p className="label mt-3 text-ink-3">{lead.label}</p>
          </div>
        )}
        {rest.map((m) => (
          <div key={m.label}>
            <p className="wide text-[clamp(1.5rem,2.2vw,2.4rem)] leading-none font-bold tracking-tight">{m.value}</p>
            <p className="label mt-2 text-ink-3">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 border-t border-line pt-5">
        <h3 className="wide text-[clamp(1.25rem,1.7vw,1.8rem)] leading-tight font-bold tracking-tight">{r.title}</h3>
        <p className="mt-1 text-ink-2">
          {r.org} <span className="text-ink-3">· {r.place}</span>
        </p>
      </div>

      {r.bullets && (
        <ul className="mt-5 space-y-2.5 text-[clamp(15px,0.95vw,16px)] leading-relaxed text-ink-2">
          {r.bullets.map((b) => (
            <li key={b} className="relative pl-5 before:absolute before:top-[0.75em] before:left-0 before:h-px before:w-2.5 before:bg-accent">
              {b}
            </li>
          ))}
        </ul>
      )}
      {r.summary && <p className="mt-4 text-[15px] leading-relaxed text-ink-2">{r.summary}</p>}

      {r.tech && (
        <ul className="mt-auto flex flex-wrap gap-1.5 pt-6">
          {r.tech.map((t) => (
            <li key={t} className="chip label text-ink-3">
              {t}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
