"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { INTRO_DONE } from "./Loader";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Splits text into masked words that slide up when scrolled into view. */
export function RevealText({
  text,
  as: Tag = "span",
  className,
  delay = 0,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (reduced()) return;
      gsap.from(".rw", {
        yPercent: 115,
        rotate: 4,
        duration: 1,
        ease: "expo.out",
        stagger: 0.06,
        delay,
        scrollTrigger: { trigger: ref.current, start: "top 88%" },
      });
    },
    { scope: ref }
  );
  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {text.split(" ").map((w, i) => (
        <span key={i} aria-hidden="true" className="inline-block overflow-hidden pb-[0.06em] align-bottom">
          <span className="rw inline-block origin-bottom-left">{w}&nbsp;</span>
        </span>
      ))}
    </Tag>
  );
}

/** Words brighten one by one as the block scrolls through the viewport. */
export function ScrubText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useGSAP(
    () => {
      if (reduced()) return;
      gsap.fromTo(
        ".sw",
        { opacity: 0.12 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.1,
          scrollTrigger: { trigger: ref.current, start: "top 80%", end: "bottom 45%", scrub: true },
        }
      );
    },
    { scope: ref }
  );
  return (
    <p ref={ref} className={className} aria-label={text}>
      {text.split(" ").map((w, i) => (
        <span key={i} aria-hidden="true" className="sw">
          {w}{" "}
        </span>
      ))}
    </p>
  );
}

/** Fades + lifts direct children in sequence when the group enters the viewport. */
export function Stagger({ children, className, as: Tag = "div" }: { children: ReactNode; className?: string; as?: ElementType }) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (reduced() || !ref.current) return;
      gsap.from(ref.current.children, {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: ref.current, start: "top 85%" },
      });
    },
    { scope: ref }
  );
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/** Counts a number up from zero when it scrolls into view. Keeps any suffix/prefix text. */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useGSAP(() => {
    const el = ref.current;
    const m = value.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
    if (!el || !m || reduced()) return;
    const decimals = m[2].split(".")[1]?.length ?? 0;
    const pad = m[2].startsWith("0") && !m[2].includes(".") ? m[2].length : 0;
    const n = { v: 0 };
    gsap.to(n, {
      v: Number(m[2]),
      duration: 1.6,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 92%" },
      onUpdate: () => {
        const s = n.v.toFixed(decimals);
        el.textContent = m[1] + (pad ? s.padStart(pad, "0") : s) + m[3];
      },
    });
  });
  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}

/** A rule that draws itself (vertical or horizontal) as its parent scrolls past. */
export function DrawLine({ vertical, className }: { vertical?: boolean; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (reduced()) return;
    gsap.fromTo(
      ref.current,
      vertical ? { scaleY: 0 } : { scaleX: 0 },
      {
        ...(vertical ? { scaleY: 1 } : { scaleX: 1 }),
        ease: "none",
        scrollTrigger: { trigger: ref.current!.parentElement, start: "top 70%", end: "bottom 60%", scrub: true },
      }
    );
  });
  return <div ref={ref} aria-hidden="true" className={`${vertical ? "origin-top" : "origin-left"} bg-accent ${className ?? ""}`} />;
}

/** Pulls its child toward the cursor while hovered, then springs back. Fine pointers only. */
export function Magnetic({ children, strength = 0.35 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useGSAP(() => {
    const el = ref.current;
    if (!el || reduced() || !window.matchMedia("(pointer: fine)").matches) return;
    const x = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
    const y = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      x((e.clientX - (r.left + r.width / 2)) * strength);
      y((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => {
      x(0);
      y(0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  });
  return (
    <span ref={ref} className="inline-block">
      {children}
    </span>
  );
}

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>_-+*";

/**
 * Text that "decodes" from random glyphs into place once the intro finishes.
 * The real text is server-rendered, so it's readable without JS.
 */
export function Decode({ text, delay = 0, className }: { text: string; delay?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useGSAP(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    const state = { p: 0 };
    const draw = () => {
      const shown = Math.floor(state.p * text.length);
      el.textContent = text
        .split("")
        .map((c, i) => (i < shown || c === " " ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
        .join("");
    };
    const tween = gsap.to(state, { p: 1, duration: 0.05 * text.length + 0.4, ease: "none", delay, paused: true, onUpdate: draw, onStart: draw });
    const start = () => tween.play();
    if (document.documentElement.dataset.intro === "done") start();
    else window.addEventListener(INTRO_DONE, start, { once: true });
    return () => window.removeEventListener(INTRO_DONE, start);
  });
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span ref={ref} aria-hidden="true">
        {text}
      </span>
    </span>
  );
}
