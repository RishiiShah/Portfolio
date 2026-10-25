"use client";

import { useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { Project } from "@/data";
import { motion } from "@/lib/motion";
import { RevealText } from "../anim";

gsap.registerPlugin(ScrollTrigger);

// three.js loads after hydration, off the critical path.
const Flight = dynamic(() => import("../flight/Flight").then((m) => m.Flight), { ssr: false });

const LINK_LABEL = { demo: "Live", video: "Video", source: "Source", paper: "Paper", blog: "Writeup" } as const;
const shortTitle = (t: string) => t.split(/:| via | & /)[0];
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Selected work as a sticky split: the case studies scroll normally on one side,
 * and a sticky 3D panel on the other flies to each project's figure as its case
 * study reaches the middle of the screen. Nothing is pinned.
 */
export function FeaturedWork({ items }: { items: Project[] }) {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const slugs = useMemo(() => items.map((p) => p.slug), [items]);

  useGSAP(
    () => {
      motion.flight = 1;
      const fly = (i: number) => {
        setActive(i);
        gsap.to(motion, { flight: i + 1, duration: 1.6, ease: "power2.inOut", overwrite: true });
      };
      gsap.utils.toArray<HTMLElement>(".case").forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => self.isActive && fly(i),
        });
      });
    },
    { scope: root }
  );

  const current = items[active];
  return (
    <section ref={root} id="work" data-shape="1" data-field="off" className="relative px-[max(1rem,4vw)] pt-[12vh] pb-[8vh]">
      <div className="label flex items-center justify-between border-t border-line pt-4 text-ink-3">
        <span>
          <span className="text-accent">(01)</span> Selected work
        </span>
        <span>{items.length} case studies</span>
      </div>
      <RevealText as="h2" text="Selected work" className="display mt-[3vh] block text-[11vw] md:text-[7vw]" />

      <div className="mt-[6vh] md:grid md:grid-cols-12 md:gap-x-[3vw]">
        {/* The figure: on top on phones, beside the case studies from md up */}
        <figure className="sticky top-0 z-10 -mx-[max(1rem,4vw)] h-[38svh] border-b border-line bg-bg motion-reduce:hidden md:top-[12vh] md:self-start md:order-2 md:col-span-7 md:mx-0 md:h-[76svh] md:border md:bg-bg">
          <Flight slugs={slugs} className="absolute inset-0" />
          <figcaption className="label pointer-events-none absolute inset-x-4 bottom-3 flex justify-between text-ink-3 md:inset-x-5 md:bottom-4">
            <span>
              <span className="text-accent">Fig. {pad(active + 1)}</span> · {shortTitle(current.title)}
            </span>
            <span>
              {pad(active + 1)}/{pad(items.length)}
            </span>
          </figcaption>
        </figure>

        <ol className="md:order-1 md:col-span-5">
          {items.map((p, i) => (
            <li key={p.slug} className="case flex min-h-[70svh] items-center py-[6vh] md:min-h-[80svh]">
              <Case project={p} index={i + 1} dim={i !== active} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Case({ project: p, index, dim }: { project: Project; index: number; dim: boolean }) {
  const badge = p.award ? "Winner" : p.latest ? "Latest" : p.links?.some((l) => l.type === "paper") ? "Published" : null;
  return (
    <article className={`w-full transition-opacity duration-500 ${dim ? "opacity-35" : ""}`}>
      <p className="label flex items-center justify-between gap-4 text-ink-3">
        <span>
          <span className="text-accent">No. {pad(index)}</span> · {p.year} · {p.tags.slice(0, 2).join(" / ")}
        </span>
        {badge && <span className="border border-accent px-1.5 py-0.5 text-accent">{badge}</span>}
      </p>

      <h3 className="wide mt-5 text-[clamp(2rem,3.4vw,3.75rem)] leading-[0.95] font-bold tracking-tight">{shortTitle(p.title)}</h3>
      {p.award && <p className="label mt-3 text-accent">{p.award}</p>}

      {p.caseStudy && (
        <dl className="mt-6 grid grid-cols-[4.75rem_1fr] gap-x-4 gap-y-3 border-t border-line pt-5 text-[clamp(0.95rem,1vw,1.05rem)] leading-snug">
          {(
            [
              ["Problem", p.caseStudy.problem],
              ["Built", p.caseStudy.built],
              ["Result", p.caseStudy.result],
            ] as const
          ).map(([label, text]) => (
            <div key={label} className="contents">
              <dt className={`label pt-[0.2em] ${label === "Result" ? "text-accent" : "text-ink-3"}`}>{label}</dt>
              <dd className={label === "Result" ? "text-ink" : "text-ink-2"}>{text}</dd>
            </div>
          ))}
        </dl>
      )}

      {p.metrics && (
        <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-5">
          {p.metrics.slice(0, 3).map((m) => (
            <div key={m.label} className="flex flex-col-reverse">
              <dt className="label mt-1 text-ink-3">{m.label}</dt>
              <dd className="wide text-[clamp(1.1rem,1.4vw,1.5rem)] font-bold tracking-tight whitespace-nowrap">{m.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <p className="label mt-6 text-ink-3">{p.tech.slice(0, 6).join(" · ")}</p>
      {p.links && (
        <div className="mt-5 flex gap-2">
          {p.links.map((l) => (
            <a
              key={l.url}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 items-center gap-1.5 bg-ink px-4 text-sm font-medium text-bg transition-colors hover:bg-accent hover:text-accent-ink"
            >
              {LINK_LABEL[l.type]} <ArrowUpRight size={14} />
            </a>
          ))}
        </div>
      )}
    </article>
  );
}
