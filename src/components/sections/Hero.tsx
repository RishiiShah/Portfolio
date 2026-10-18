"use client";

import { useRef } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { bio, education, projects } from "@/data";
import { INTRO_DONE } from "../Loader";
import { LocalTime } from "../LocalTime";
import { Decode, Magnetic } from "../anim";

const latest = projects.find((p) => p.latest) ?? projects[0];
const gradYear = education[0].end.split(" ")[1]?.slice(2);

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const intro = gsap
        .timeline({ paused: true })
        .from(".hero-char", { yPercent: 120, duration: 1.3, ease: "expo.out", stagger: 0.035 })
        .from(".hero-fade", { y: 24, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.06 }, 0.35)
        .from(".hero-rule", { scaleX: 0, duration: 1.2, ease: "expo.inOut", stagger: 0.1 }, 0.1)
        .from(".hero-leader", { scaleX: 0, duration: 0.9, ease: "expo.out" }, 0.9);

      if (document.documentElement.dataset.intro === "done") intro.play();
      else window.addEventListener(INTRO_DONE, () => intro.play(), { once: true });

      // Scrolling away pulls the name lines apart and lifts the upper block.
      const scrub = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
      gsap.to(".hero-l1", { xPercent: -18, ease: "none", scrollTrigger: scrub });
      gsap.to(".hero-l2", { xPercent: 14, ease: "none", scrollTrigger: scrub });
      gsap.to(".hero-name", { opacity: 0.15, ease: "none", scrollTrigger: scrub });
      gsap.to(".hero-upper", { yPercent: -40, opacity: 0, ease: "none", scrollTrigger: scrub });
    },
    { scope: root }
  );

  const chars = (word: string) =>
    word.split("").map((c, i) => (
      <span key={i} className="hero-char inline-block transition-colors duration-300 hover:text-accent">
        {c}
      </span>
    ));

  return (
    <section
      ref={root}
      id="top"
      data-shape="0"
      className="relative flex h-[100svh] min-h-[600px] flex-col overflow-hidden px-[max(1rem,4vw)] pt-14"
    >
      <div className="hero-fade label flex justify-between gap-6 pt-4 text-ink-3">
        <span>Portfolio / {new Date().getFullYear()}</span>
        <span className="hidden sm:inline">{bio.location} · 40.50° N, 74.45° W</span>
        <LocalTime />
      </div>
      <div className="hero-rule mt-3 h-px origin-left bg-line" />

      {/* Upper block: status on the left, the knot's caption on the right */}
      <div className="hero-upper grid flex-1 content-start gap-8 pt-[6vh] md:grid-cols-12">
        <div className="hero-fade md:col-span-5 lg:col-span-4 xl:col-span-3">
          <p className="label text-ink-3">Status</p>
          <p className="mt-3 flex items-start gap-2.5 text-[15px] leading-snug">
            <span className="relative mt-1.5 flex size-2 shrink-0">
              <span className="absolute inset-0 animate-ping bg-accent opacity-60" />
              <span className="relative size-2 bg-accent" />
            </span>
            <span>
              Open to SWE, systems &amp; AI/ML roles.
              <span className="block text-ink-3">Full-time &amp; internships · M.S. ’{gradYear}</span>
            </span>
          </p>
          <a
            href="#work"
            className="group mt-5 flex items-center justify-between gap-4 border-y border-line py-3 text-[15px] transition-colors hover:text-accent"
          >
            <span>
              <span className="label block text-ink-3">Now building</span>
              {latest.title}
            </span>
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        <figure className="hero-fade hidden self-start text-right whitespace-nowrap md:col-span-4 md:col-start-9 md:block">
          <figcaption className="label inline-block bg-bg/75 px-2.5 py-2 text-ink-2 backdrop-blur-md">
            <span className="text-accent">Fig. 01</span> — (2,3) torus knot
            <span className="mt-1 block">18,000 particles · move through it</span>
          </figcaption>
          <span className="hero-leader mt-3 ml-auto block h-px w-[8vw] origin-right bg-ink-3" />
        </figure>
      </div>

      <div>
        <p className="hero-fade label flex items-center gap-2 text-ink-2">
          <span className="text-accent">(R—S)</span>
          <Decode text={bio.title} delay={0.3} />
        </p>
        <h1 className="hero-name display mt-[2vh] text-[15.5vw] leading-[0.82] md:text-[13.5vw]" aria-label={bio.name}>
          <span className="hero-l1 block overflow-hidden pb-[0.04em]" aria-hidden="true">
            {chars("Rishabh")}
          </span>
          <span className="hero-l2 flex items-start overflow-hidden pb-[0.04em] md:pl-[12vw]" aria-hidden="true">
            <span>
              {chars("Shah")}
              <span className="hero-char inline-block text-accent">.</span>
            </span>
            <span className="hero-fade label mt-[1.2vw] ml-[2vw] hidden border-l border-accent bg-bg/75 py-1.5 pr-3 pl-3 leading-relaxed tracking-[0.08em] text-ink-2 normal-case backdrop-blur-md lg:block">
              Mumbai → New Brunswick
              <br />
              AI &amp; DS ’25 · CS ’{gradYear}
              <br />
              Backend · Vision · ML
            </span>
          </span>
        </h1>
      </div>

      <div className="hero-rule mt-[3vh] h-px origin-left bg-line" />
      <div className="grid gap-6 py-[3vh] md:grid-cols-12 md:items-center">
        <p className="hero-fade text-[clamp(1rem,1.35vw,1.4rem)] leading-snug text-ink-2 md:col-span-5">
          I build the parts underneath the interface: <span className="text-ink">APIs, auth, data,</span> and the{" "}
          <span className="text-ink">pipelines that turn models into products.</span>
        </p>
        <div className="flex flex-wrap items-center gap-3 md:col-span-7 md:justify-end">
          <Magnetic>
            <a
              href="#work"
              className="hero-fade group flex h-12 items-center gap-2 bg-ink px-6 text-sm font-medium text-bg transition-colors hover:bg-accent hover:text-accent-ink"
            >
              Selected work <ArrowDown size={15} className="transition-transform group-hover:translate-y-0.5" />
            </a>
          </Magnetic>
          <Magnetic>
            <a
              href={bio.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-fade flex h-12 items-center gap-2 border border-ink/70 px-6 text-sm font-medium backdrop-blur-sm transition-colors hover:border-accent hover:text-accent"
            >
              Résumé <ArrowUpRight size={15} />
            </a>
          </Magnetic>
          <span className="hero-fade label ml-4 hidden items-center gap-2 text-ink-3 lg:flex">
            <span className="relative block h-8 w-px overflow-hidden bg-line">
              <span className="scroll-tick absolute inset-x-0 top-0 h-1/2 bg-ink" />
            </span>
            Scroll
          </span>
        </div>
      </div>
    </section>
  );
}
