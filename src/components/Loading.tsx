"use client";
import { useEffect, useRef, useState, useMemo } from "react";

interface LoadingProps {
  onComplete: () => void;
  minDurationMs?: number;
}

export function Loading({ onComplete, minDurationMs }: LoadingProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const startRef = useRef<number | null>(null);

  // Minimum duration to keep the loader visible for a pleasant experience
  const MIN_DURATION_MS = useMemo(() => typeof minDurationMs === "number" ? minDurationMs : 2200, [minDurationMs]);
  const FADE_OUT_MS = 320;

  useEffect(() => {
    startRef.current = Date.now();

    // Progress-based staged increments: fast enough to feel alive, slow enough to feel intentional.
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          const elapsed = startRef.current ? Date.now() - startRef.current : 0;
          const remaining = Math.max(0, MIN_DURATION_MS - elapsed);

          setTimeout(() => {
            setIsFadingOut(true);
            setTimeout(() => {
              setIsVisible(false);
              onComplete();
            }, FADE_OUT_MS);
          }, remaining);

          return 100;
        }

        let step = 0.4;
        if (prev < 70) step = 4.0;
        else if (prev < 90) step = 2.0;
        else if (prev < 98) step = 0.8;

        const next = prev + step;
        return next > 100 ? 100 : next;
      });
    }, 80);

    return () => clearInterval(interval);
  }, [onComplete, MIN_DURATION_MS]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-background flex flex-col items-center justify-center transition-opacity duration-300 ${isFadingOut ? "opacity-0" : "opacity-100"}`}
    >
      <div className="text-center">
        {/* Logo/Name Animation */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight animate-pulse">
            Rishabh
          </h1>
          <p className="text-sm text-foreground/60 mt-2 animate-fade-in delay-300">
            Building scalable systems & ML applications
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-64 sm:w-80 h-1 bg-foreground/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-foreground rounded-full transition-[width] duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Progress Text */}
        <p className="text-xs text-foreground/60 mt-4 animate-fade-in delay-500">
          {Math.round(progress)}%
        </p>
      </div>
    </div>
  );
}
