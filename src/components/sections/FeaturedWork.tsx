"use client";

import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { Project } from "@/data";
import { motion, scrollToY } from "@/lib/motion";
import { RevealText } from "../anim";

gsap.registerPlugin(ScrollTrigger);

const LINK_LABEL = { demo: "Live", source: "Source", paper: "Paper", blog: "Writeup" } as const;
const GAP = 1500; // px of depth between consecutive cards
const START = -700; // where the camera starts relative to the first card
const TRAVEL_PER_CARD = 9; // scene units the particle tunnel moves per card

/**
 * Flythrough: the stage pins, and scrolling moves a virtual camera forward
 * through depth. Each card sits at its own z; cards ahead are small and faint,
 * the current one is full size, and passed cards rush by and fade.
 * Without JS or with reduced motion, the CSS falls back to a plain list.
 */
export function FeaturedWork({ items }: { items: Project[] }) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const depth = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const last = items.length - 1;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(".fly-card");
        const navItems = gsap.utils.toArray<HTMLElement>(".fly-nav-item");
        // Camera stops: just before the first card, then exactly at each card.
        // Within each leg the camera eases in and out, so it dwells on every card.
        const stops = [START, ...items.map((_, i) => i * GAP)];
        const legs = stops.length - 1;
        const camAt = (progress: number) => {
          const f = Math.min(legs - 1e-6, progress * legs);
          const leg = Math.floor(f);
          const t = gsap.utils.clamp(0, 1, (f - leg - 0.2) / 0.6);
          const eased = t * t * (3 - 2 * t);
          return stops[leg] + (stops[leg + 1] - stops[leg]) * eased;
        };

        const render = (progress: number) => {
          const narrow = window.innerWidth < 768;
          const cam = camAt(progress);
          cards.forEach((card, i) => {
            const z = cam - i * GAP;
            const side = i % 2 ? 1 : -1;
            const x = narrow ? 0 : side * window.innerWidth * 0.2;
            const y = narrow ? 0 : side * -window.innerHeight * 0.03;
            const opacity = z > 0 ? 1 - z / 260 : gsap.utils.clamp(0, 1, 1 + z / (GAP * 2.2));
            const tilt = side * -6 * Math.min(1, Math.max(0, -z) / GAP);
            card.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${z}px) rotateY(${tilt}deg)`;
            card.style.opacity = String(Math.max(0, opacity));
            // Siblings paint in DOM order, so stack by depth: nearer cards on top.
            card.style.zIndex = String(items.length - i);
            card.style.visibility = opacity <= 0.01 ? "hidden" : "visible";
            card.style.pointerEvents = opacity > 0.6 ? "auto" : "none";
          });
          const active = Math.min(last, Math.max(0, Math.round((cam + 200) / GAP)));
          navItems.forEach((el, i) => el.toggleAttribute("data-active", i === active));
          if (counter.current) counter.current.textContent = String(active + 1).padStart(2, "0");
          if (depth.current) depth.current.textContent = `Depth ${Math.round(Math.max(0, cam - START)).toLocaleString("en-US")} px`;
          if (bar.current) bar.current.style.transform = `scaleY(${progress})`;
          motion.fly = ((cam - START) / GAP) * TRAVEL_PER_CARD;
        };

        trigger.current = ScrollTrigger.create({
          trigger: stage.current,
          pin: true,
          start: "top top",
          end: () => `+=${window.innerHeight * (items.length + 0.5)}`,
          scrub: true,
          onUpdate: (self) => render(self.progress),
          onRefresh: (self) => render(self.progress),
        });
        render(0);
        return () => {
          trigger.current = null;
        };
      });
    },
    { scope: root }
  );

  const jumpTo = (i: number) => {
    const st = trigger.current;
    if (!st) return;
    // Land in the middle of the dwell for card i (its leg is i + 1 of items.length).
    const progress = (i + 0.9) / items.length;
    scrollToY(st.start + progress * (st.end - st.start));
  };

  return (
    <section ref={root} id="work" data-shape="1" className="relative">
      <div className="px-[max(1rem,4vw)] pt-[16vh]">
        <div className="label flex items-center justify-between border-t border-line pt-4 text-ink-3">
          <span>
            <span className="text-accent">(01)</span> Selected work
          </span>
          <span>{items.length} case studies · scroll to fly through</span>
        </div>
        <RevealText as="h2" text="Selected work" className="display mt-[4vh] block text-[11vw] md:text-[10vw]" />
      </div>

      <div ref={stage} className="fly-stage">
        {items.map((p, i) => (
          <Card key={p.slug} project={p} index={i + 1} />
        ))}

        <div className="fly-hud label pointer-events-none absolute inset-x-[max(1rem,4vw)] bottom-[5vh] items-end justify-between text-ink-3">
          <div className="flex items-end gap-4">
            <span className="relative block h-16 w-px bg-line">
              <span ref={bar} className="absolute inset-0 origin-top scale-y-0 bg-accent" />
            </span>
            <div>
              <p className="wide text-4xl font-bold text-ink">
                <span ref={counter}>01</span>
                <span className="text-ink-3">/{String(items.length).padStart(2, "0")}</span>
              </p>
              <span ref={depth} className="mt-1 block">Depth 0 px</span>
            </div>
          </div>
          <ol className="pointer-events-auto hidden flex-col items-end gap-1.5 md:flex">
            {items.map((p, i) => (
              <li key={p.slug}>
                <button
                  type="button"
                  onClick={() => jumpTo(i)}
                  className="fly-nav-item flex items-center gap-2 transition-colors hover:text-ink data-[active]:text-accent"
                >
                  {shortTitle(p.title)}
                  <span className="inline-block h-px w-4 bg-current" />
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

const shortTitle = (t: string) => t.split(/:| via | & /)[0];

function Card({ project: p, index }: { project: Project; index: number }) {
  const badge = p.latest ? "Latest" : p.links?.some((l) => l.type === "paper") ? "Published" : null;
  return (
    <article className="fly-card group relative flex flex-col overflow-hidden border border-line bg-bg p-[clamp(1.25rem,2.2vw,2.5rem)] shadow-[0_40px_120px_-40px_rgba(0,0,0,0.5)] transition-[border-color] duration-500 hover:border-accent">
      <span
        aria-hidden="true"
        className="display pointer-events-none absolute -right-[1vw] -bottom-[2vh] text-[9rem] leading-none text-transparent [-webkit-text-stroke:1px_var(--line)] group-hover:[-webkit-text-stroke:1px_var(--accent)] md:text-[12rem]"
      >
        {String(index).padStart(2, "0")}
      </span>

      <div className="label relative flex items-center justify-between gap-4 text-ink-3">
        <span>
          No. {String(index).padStart(2, "0")} · {p.year} · {p.tags.slice(0, 2).join(" / ")}
        </span>
        {badge && <span className="border border-accent px-1.5 py-0.5 text-accent">{badge}</span>}
      </div>

      <h3 className="wide relative mt-6 text-[clamp(1.75rem,3vw,3.25rem)] leading-[0.95] font-bold tracking-tight transition-colors group-hover:text-accent">
        {p.title.split(":")[0]}
      </h3>
      <p className="relative mt-4 max-w-[46ch] text-[clamp(0.95rem,1.05vw,1.1rem)] leading-snug text-ink-2">{p.tagline}</p>

      {p.metrics && (
        <dl className="relative mt-8 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
          {p.metrics.slice(0, 4).map((m) => (
            <div key={m.label} className="flex flex-col-reverse border-t border-line pt-2">
              <dt className="label mt-1 text-ink-3">{m.label}</dt>
              <dd className="wide text-[clamp(1rem,1.3vw,1.4rem)] font-bold tracking-tight">{m.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <div className="relative mt-8 flex flex-wrap items-end justify-between gap-4">
        <ul className="flex max-w-[65%] flex-wrap gap-1.5">
          {p.tech.slice(0, 5).map((t) => (
            <li key={t} className="label border border-line bg-bg/60 px-2 py-1 text-ink-2">
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
