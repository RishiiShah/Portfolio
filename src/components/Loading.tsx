"use client";
import { useEffect, useRef, useState, useMemo } from "react";

interface LoadingProps {
  onComplete: () => void;
  minDurationMs?: number;
}

const BOOT_LINES = [
  "Initializing runtime environment...",
  "Loading core modules...",
  "Mounting React components...",
  "Fetching project data...",
  "Compiling UI...",
  "System ready.",
];

export function Loading({ onComplete, minDurationMs }: LoadingProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const startRef = useRef<number | null>(null);

  const MIN_DURATION_MS = useMemo(
    () => (typeof minDurationMs === "number" ? minDurationMs : 2400),
    [minDurationMs]
  );
  const FADE_OUT_MS = 450;

  useEffect(() => {
    startRef.current = Date.now();
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          const elapsed = startRef.current ? Date.now() - startRef.current : 0;
          const remaining = Math.max(0, MIN_DURATION_MS - elapsed);
          setTimeout(() => {
            setIsFadingOut(true);
            setTimeout(() => { setIsVisible(false); onComplete(); }, FADE_OUT_MS);
          }, remaining);
          return 100;
        }
        let step = 0.4;
        if (prev < 70) step = 3.5;
        else if (prev < 90) step = 1.8;
        else if (prev < 98) step = 0.7;
        return Math.min(prev + step, 100);
      });
    }, 80);
    return () => clearInterval(interval);
  }, [onComplete, MIN_DURATION_MS]);

  if (!isVisible) return null;

  const pct = Math.round(progress);
  const lineCount = Math.min(
    Math.floor((progress / 100) * BOOT_LINES.length) + 1,
    BOOT_LINES.length
  );

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-opacity duration-500 ${
        isFadingOut ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Full background — matches site bg so there is no flash */}
      <div className="absolute inset-0 bg-[#050505]" />

      {/* Faint grid texture */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Ambient accent glow from top */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% -10%, rgba(29,174,197,0.2), transparent 70%)",
        }}
      />

      {/* Card */}
      <div className="relative z-10 w-[min(90vw,460px)]">
        {/* Outer glow ring */}
        <div
          className="absolute -inset-px rounded-2xl opacity-40"
          style={{
            background: "linear-gradient(135deg, rgba(29,174,197,0.45), transparent 60%)",
          }}
        />

        {/* Glass card */}
        <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-2xl p-8 shadow-[0_24px_60px_rgba(0,0,0,0.6),0_1px_0_rgba(255,255,255,0.08)_inset]">
          
          {/* Top bar */}
          <div className="mb-7 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-white/30">
                Boot Sequence
              </span>
            </div>
            <span className="font-mono text-[9px] text-white/20 tracking-widest">
              v1.0.0
            </span>
          </div>

          {/* Logo */}
          <div className="mb-7 border-b border-white/5 pb-7">
            <h1 className="font-mono font-bold text-4xl tracking-tighter text-white">
              <span className="text-accent/50">&lt;</span>
              Rishi
              <span className="text-accent/50">/&gt;</span>
            </h1>
            <p className="mt-2 text-xs text-white/35 font-mono tracking-wide">
              Software Developer · Systems Architect
            </p>
          </div>

          {/* Terminal log */}
          <div className="mb-7 space-y-2 min-h-[108px]">
            {BOOT_LINES.slice(0, lineCount).map((line, i) => {
              const isLast = i === lineCount - 1;
              return (
                <div
                  key={i}
                  className="flex items-center gap-2.5 font-mono text-[11px]"
                >
                  <span className={`shrink-0 ${isLast ? "text-accent" : "text-white/20"}`}>›</span>
                  <span className={isLast ? "text-white/75" : "text-white/25"}>
                    {line}
                  </span>
                  {isLast && pct < 100 && (
                    <span
                      className="inline-block w-1.5 h-[11px] bg-accent animate-pulse shrink-0"
                      style={{ animationDuration: "0.8s" }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Progress */}
          <div className="space-y-2.5">
            <div className="h-[2px] w-full rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full transition-[width] duration-200 ease-out"
                style={{
                  width: `${pct}%`,
                  background: "linear-gradient(90deg, #077893, #1daec5)",
                  boxShadow: "0 0 12px rgba(29,174,197,0.55)",
                }}
              />
            </div>
            <div className="flex justify-between font-mono text-[9px] text-white/20 uppercase tracking-widest">
              <span>Loading</span>
              <span>{pct}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer label */}
      <p
        className="relative z-10 mt-5 font-mono text-[9px] uppercase tracking-[0.35em] text-white/30"
      >
        Rutgers University · MSCS 2026
      </p>
    </div>
  );
}
