"use client";

import { useMemo, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { Project } from "@/data";
import { stationVisibility } from "@/lib/flight";
import { motion, scrollToY } from "@/lib/motion";
import { RevealText } from "../anim";
import { Flight } from "../flight/Flight";

gsap.registerPlugin(ScrollTrigger);

const LINK_LABEL = { demo: "Live", source: "Source", paper: "Paper", blog: "Writeup" } as const;
const SCROLL_PER_STATION = 1.5; // viewport heights of scrolling per project

const shortTitle = (t: string) => t.split(/:| via | & /)[0];

/**
 * Project flythrough: the stage pins and scrolling flies a camera along a
 * spline past one 3D visual per project (see flight/). Each project's panel
 * fades in while the camera is parked at its station.
 * Without JS or with reduced motion, CSS falls back to a plain list of panels.
 */
export function FeaturedWork({ items }: { items: Project[] }) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const distance = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const slugs = useMemo(() => items.map((p) => p.slug), [items]);
  const legs = items.length;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const panels = gsap.utils.toArray<HTMLElement>(".fly-card");
        const navItems = gsap.utils.toArray<HTMLElement>(".fly-nav-item");

        const render = (progress: number) => {
          const f = progress * legs;
          motion.flight = f;
          panels.forEach((panel, i) => {
            const v = stationVisibility(f, i);
            panel.style.opacity = String(v);
            panel.style.setProperty("--fly-y", `${(f - (i + 1)) * -120}px`);
            panel.style.visibility = v < 0.01 ? "hidden" : "visible";
            panel.style.pointerEvents = v > 0.6 ? "auto" : "none";
          });
          const active = Math.max(0, Math.min(legs - 1, Math.round(f - 1)));
          navItems.forEach((el, i) => el.toggleAttribute("data-active", i === active));
          if (counter.current) counter.current.textContent = String(active + 1).padStart(2, "0");
          if (distance.current) distance.current.textContent = `${(f * 0.42).toFixed(2)} km flown`;
          if (bar.current) bar.current.style.transform = `scaleY(${progress})`;
        };

        // Once scrolling settles, glide to the nearest station so the camera never rests mid-flight.
        let settle = 0;
        const snap = () => {
          const st = trigger.current;
          if (!st?.isActive) return;
          const f = st.progress * legs;
          const station = Math.round(f);
          if (station < 1 || Math.abs(f - station) < 0.01) return;
          scrollToY(st.start + (station / legs) * (st.end - st.start), 0.9);
        };

        trigger.current = ScrollTrigger.create({
          trigger: stage.current,
          pin: true,
          start: "top top",
          end: () => `+=${window.innerHeight * legs * SCROLL_PER_STATION}`,
          scrub: true,
          onUpdate: (self) => {
            render(self.progress);
            window.clearTimeout(settle);
            settle = window.setTimeout(snap, 180);
          },
          onRefresh: (self) => render(self.progress),
        });
        render(0);
        return () => {
          window.clearTimeout(settle);
          trigger.current = null;
        };
      });
    },
    { scope: root }
  );

  // Park on station i: the middle of its dwell, at f = i + 1.
  const jumpTo = (i: number) => {
    const st = trigger.current;
    if (st) scrollToY(st.start + ((i + 1) / legs) * (st.end - st.start));
  };

  return (
    <section ref={root} id="work" data-shape="1" className="relative">
      <div className="px-[max(1rem,4vw)] pt-[12vh]">
        <div className="label flex items-center justify-between border-t border-line pt-4 text-ink-3">
          <span>
            <span className="text-accent">(01)</span> Selected work
          </span>
          <span>{items.length} case studies · scroll to fly</span>
        </div>
        <RevealText as="h2" text="Selected work" className="display mt-[4vh] block text-[11vw] md:text-[10vw]" />
      </div>

      <div ref={stage} className="fly-stage">
        <Flight slugs={slugs} className="fly-canvas absolute inset-0" />

        {items.map((p, i) => (
          <Panel key={p.slug} project={p} index={i + 1} side={i % 2 ? "right" : "left"} />
        ))}

        <div className="fly-hud label pointer-events-none absolute inset-x-[max(1rem,4vw)] top-[11vh] items-start justify-between text-ink-3 split:top-auto split:bottom-[5vh] split:items-end">
          <div className="flex items-end gap-4">
            <span className="relative block h-14 w-px bg-line">
              <span ref={bar} className="absolute inset-0 origin-top scale-y-0 bg-accent" />
            </span>
            <div>
              <p className="wide text-3xl font-bold text-ink split:text-4xl">
                <span ref={counter}>01</span>
                <span className="text-ink-3">/{String(items.length).padStart(2, "0")}</span>
              </p>
              <span ref={distance} className="mt-1 block">0.00 km flown</span>
            </div>
          </div>
          <ol className="pointer-events-auto hidden flex-col items-end gap-1.5 split:flex">
            {items.map((p, i) => (
              <li key={p.slug}>
                <button
                  type="button"
                  onClick={() => jumpTo(i)}
                  className="fly-nav-item group flex items-center gap-2 transition-colors hover:text-ink data-[active]:text-accent"
                >
                  {shortTitle(p.title)}
                  <span className="inline-block h-px w-4 bg-current transition-all group-data-[active]:w-8" />
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Panel({ project: p, index, side }: { project: Project; index: number; side: "left" | "right" }) {
  const badge = p.award ? "Winner" : p.latest ? "Latest" : p.links?.some((l) => l.type === "paper") ? "Published" : null;
  return (
    <article
      data-side={side}
      className="fly-card group relative flex flex-col border border-line bg-bg/90 p-[clamp(1.25rem,2vw,2.25rem)]"
    >
      <div className="label flex items-center justify-between gap-4 text-ink-3">
        <span>
          <span className="text-accent">No. {String(index).padStart(2, "0")}</span> · {p.year} · {p.tags.slice(0, 2).join(" / ")}
        </span>
        {badge && <span className="border border-accent px-1.5 py-0.5 text-accent">{badge}</span>}
      </div>

      <h3 className="wide mt-5 text-[clamp(1.6rem,2.6vw,3rem)] leading-[0.95] font-bold tracking-tight">{shortTitle(p.title)}</h3>
      {p.award && <p className="label mt-2 text-accent">{p.award}</p>}
      <p className="mt-3 text-[clamp(0.9rem,1vw,1.05rem)] leading-snug text-ink-2">{p.tagline}</p>

      {p.metrics && (
        <dl className="mt-6 grid grid-cols-2 gap-x-5 gap-y-3 [@media(max-height:700px)]:hidden">
          {p.metrics.slice(0, 4).map((m, i) => (
            <div key={m.label} className={`flex flex-col-reverse border-t border-line pt-2 ${i > 1 ? "hidden split:flex" : ""}`}>
              <dt className="label mt-1 text-ink-3">{m.label}</dt>
              <dd className="wide text-[clamp(1rem,1.3vw,1.4rem)] font-bold tracking-tight">{m.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
        <ul className="hidden max-w-[62%] flex-wrap gap-1.5 split:flex">
          {p.tech.slice(0, 4).map((t) => (
            <li key={t} className="label border border-line px-2 py-1 text-ink-2">
              {t}
            </li>
          ))}
        </ul>
        {p.links && (
          <div className="flex gap-2">
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
      </div>
    </article>
  );
}
