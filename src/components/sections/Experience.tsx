"use client";

import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { education, experience, publications, teaching } from "@/data";
import { toIsoDate } from "@/lib/dates";
import { RevealText } from "../anim";
import { STOP_FIGURES } from "./StopFigures";

gsap.registerPlugin(ScrollTrigger);

/*
 * Experience as a deck: each stop is a card that sticks under the header while
 * the next one slides up over it. Covered cards shrink a little and dim, and
 * their top edges stay in view, so the stack reads as the path so far.
 * Native scrolling throughout: nothing to miss, nothing hijacked.
 */

type Kind = "Education" | "Internship" | "Teaching" | "Next";

interface Stop {
  kind: Kind;
  start: string;
  end: string;
  place: string;
  title: string;
  role: string;
  /** Full detail on tall screens; `summary` stands in on short ones. */
  bullets: string[];
  summary: string;
  highlights: { value: string; label: string }[];
  tech?: string[];
  next?: boolean;
  /** Ongoing: shown as "… → Present". */
  current?: boolean;
}

const [rutgers, mumbai] = education;
const jobs = [...experience].reverse();

const STOPS: Stop[] = [
  {
    kind: "Education",
    start: mumbai.start,
    end: mumbai.end,
    place: mumbai.location,
    title: "B.Tech. AI & Data Science",
    role: mumbai.institution.replace(" - ", ", "),
    bullets: [`Studied AI & Data Science, published ${publications.length} papers, and took two engineering internships along the way.`],
    summary: `AI & Data Science, ${publications.length} papers, two internships.`,
    highlights: [{ value: mumbai.gpa.split(" ")[0], label: "GPA, of 10" }],
  },
  ...jobs.map(
    (j): Stop => ({
      kind: "Internship",
      start: j.start,
      end: j.end,
      place: j.location ?? "",
      title: j.organization,
      role: j.role,
      bullets: j.bullets,
      summary: j.summary ?? "",
      highlights: j.highlights ?? [],
      tech: j.tech,
    })
  ),
  {
    kind: "Education",
    start: rutgers.start,
    end: rutgers.end,
    place: rutgers.location,
    title: "M.S. Computer Science",
    role: rutgers.institution.replace(" - ", ", "),
    bullets: ["Master's in Computer Science, and building developer tooling for coding agents on the side."],
    summary: "M.S. in Computer Science; building developer tooling for coding agents.",
    highlights: [{ value: rutgers.gpa.split(" ")[0], label: "GPA, of 4.0" }],
  },
  {
    kind: "Teaching",
    start: teaching.start,
    end: "",
    place: teaching.location,
    title: teaching.role,
    role: `${teaching.organization} · ${teaching.courseShort}`,
    bullets: [...teaching.bullets],
    summary: `${teaching.course.split(":")[0]} recitations for 50+ undergraduates.`,
    highlights: [{ value: "50+", label: "Students each week" }],
    current: true,
  },
  {
    kind: "Next",
    start: rutgers.end,
    end: "",
    place: "",
    title: "Next stop",
    role: "Open to SWE, systems & AI/ML roles",
    bullets: ["Graduating in May 2027. Looking for full-time roles and internships where the work has to hold up in production."],
    summary: "Graduating May 2027. Full-time roles and internships.",
    highlights: [],
    next: true,
  },
];

const N = STOPS.length;
const pad = (n: number) => String(n).padStart(2, "0");

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const short = (d: string) => {
  if (!d) return "";
  const [y, m] = toIsoDate(d).split("-").map(Number);
  return m ? `${MONTHS[m - 1]} ${y}` : String(y);
};
const span = (s: Stop) => (s.next ? `From ${short(s.start)}` : `${short(s.start)} → ${s.current ? "Present" : short(s.end)}`);

// Where each card sticks: under the header, each a little lower so the stack's edges show.
const STICK = "calc(4.5rem + 2vh)";
const STEP = 14; // px between stacked edges
const stickAt = (i: number) => `calc(${STICK} + ${i * STEP}px)`;

export function Experience() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const slots = gsap.utils.toArray<HTMLElement>(".deck-slot");
        slots.slice(0, -1).forEach((slot, i) => {
          const card = slot.querySelector<HTMLElement>(".deck-card")!;
          const shade = slot.querySelector<HTMLElement>(".deck-shade")!;
          // As the next card slides up to its place, this one recedes.
          gsap
            .timeline({
              scrollTrigger: {
                trigger: slots[i + 1],
                start: "top bottom",
                // Ends where the next card sticks (its resolved sticky top).
                end: () => `top ${parseFloat(getComputedStyle(slots[i + 1]).top)}px`,
                scrub: true,
                invalidateOnRefresh: true,
              },
            })
            .to(card, { scale: 0.94, ease: "none" }, 0)
            .to(shade, { opacity: 0.85, ease: "none" }, 0);
        });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="experience" data-shape="3" className="relative">
      <div className="px-[max(1rem,4vw)] pt-[16vh]">
        <div className="label flex items-center justify-between border-t border-line pt-4 text-ink-3">
          <span>
            <span className="text-accent">(03)</span> Experience
          </span>
          <span>{N} stops · Mumbai → New Brunswick → ?</span>
        </div>
        <RevealText as="h2" text="Experience" className="display mt-[4vh] block text-[11vw] md:text-[10vw]" />
      </div>

      <ol className="mt-[8vh] px-[max(1rem,4vw)] pb-[16vh]">
        {STOPS.map((s, i) => (
          <li
            key={s.title}
            className="deck-slot sticky mb-[40vh] last:mb-0"
            style={{ top: stickAt(i), zIndex: i + 1 }}
          >
            <Card stop={s} index={i} />
          </li>
        ))}
      </ol>
    </section>
  );
}

function Card({ stop: s, index }: { stop: Stop; index: number }) {
  const Figure = STOP_FIGURES[index];
  return (
    <article className="deck-card relative min-h-[min(64svh,40rem)] origin-top overflow-hidden border border-line bg-bg">
      <div className="grid gap-y-6 p-[clamp(1.25rem,2.4vw,2.75rem)] md:grid-cols-12 md:gap-x-[3vw]">
        {/* Where and when */}
        <div className="flex flex-col justify-between gap-6 md:col-span-3 md:border-r md:border-line md:pr-[2vw]">
          <div>
            <div className="flex items-start justify-between gap-4">
              <p className="wide text-[clamp(2.2rem,3.6vw,4.2rem)] leading-[0.85] font-bold tracking-tight">
                {pad(index + 1)}
                <span className="text-ink-3">/{pad(N)}</span>
              </p>
              <span className={`label shrink-0 border px-2 py-1 ${s.current || s.next ? "border-accent text-accent" : "border-line text-ink-3"}`}>
                {s.kind}
              </span>
            </div>
            <p className="label mt-5 text-ink-2">{span(s)}</p>
            {s.place && <p className="label mt-1 text-ink-3">{s.place}</p>}
          </div>
          {/* The path so far: one tick per stop, this one lit */}
          <ol className="flex gap-1.5" aria-hidden="true">
            {STOPS.map((t, k) => (
              <li key={t.title} className={`h-1 flex-1 ${k < index ? "bg-ink-3" : k === index ? "bg-accent" : "bg-line"}`} />
            ))}
          </ol>
        </div>

        {/* What happened there */}
        <div className="md:col-span-9 lg:col-span-5">
          <h3 className="wide text-[clamp(1.6rem,2.8vw,3.2rem)] leading-[1] font-bold tracking-tight">{s.title}</h3>
          <p className="mt-2 text-[clamp(1rem,1.15vw,1.2rem)] text-accent">{s.role}</p>
          {s.highlights.length > 0 && (
            <dl className="mt-6 flex flex-wrap gap-x-12 gap-y-4 border-t border-line pt-5">
              {s.highlights.map((h) => (
                <div key={h.label} className="flex flex-col-reverse justify-end">
                  <dt className="label mt-2 text-ink-3">{h.label}</dt>
                  <dd className="wide text-[clamp(1.5rem,2.3vw,2.6rem)] leading-none font-bold tracking-tight">{h.value}</dd>
                </div>
              ))}
            </dl>
          )}
          <p className="mt-5 text-[16px] leading-relaxed text-ink-2 roomy:hidden">{s.summary}</p>
          <ul className="mt-6 hidden max-w-[70ch] space-y-2.5 text-[clamp(15px,1vw,17px)] leading-relaxed text-ink-2 roomy:block">
            {s.bullets.map((b) => (
              <li key={b} className="relative pl-5 before:absolute before:top-[0.75em] before:left-0 before:h-px before:w-2.5 before:bg-accent">
                {b}
              </li>
            ))}
          </ul>
          {s.tech && <p className="label mt-5 text-ink-3">{s.tech.join(" · ")}</p>}
          {s.next && (
            <a href="#contact" className="group mt-6 inline-flex items-center gap-2 text-accent">
              Get in touch <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </a>
          )}
        </div>

        {/* What it looked like: a figure per stop, beside the text where there is room for it */}
        <div className="hidden self-center lg:col-span-4 lg:block">
          <Figure />
        </div>
      </div>
      {/* Dims the card once the next one covers it */}
      <div className="deck-shade pointer-events-none absolute inset-0 bg-bg opacity-0" />
    </article>
  );
}
