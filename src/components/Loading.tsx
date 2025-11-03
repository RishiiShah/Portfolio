"use client";
import { useEffect, useRef, useState } from "react";

interface LoadingProps {
  onComplete: () => void;
  minDurationMs?: number;
}

export function Loading({ onComplete, minDurationMs }: LoadingProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const startRef = useRef<number | null>(null); 

  // Minimum duration to keep the loader visible for a pleasant experience
  const MIN_DURATION_MS = typeof minDurationMs === "number" ? minDurationMs : 1200; // 0.9s default
  const FADE_OUT_MS = 100;

  useEffect(() => {
    startRef.current = Date.now();
    // Simulate loading progress - faster increments for quicker completion
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          const elapsed = startRef.current ? Date.now() - startRef.current : 0;
          const remaining = Math.max(0, MIN_DURATION_MS - elapsed);
          // Ensure loader stays up for at least MIN_DURATION_MS, then fade out
          setTimeout(() => {
            setIsVisible(false);
            setTimeout(onComplete, FADE_OUT_MS);
          }, remaining);
          return 100;
        }
        // Faster increment: 8–15% per tick to finish quicker
        const next = prev + (Math.random() * 7 + 8);
        return next > 100 ? 100 : next;
      });
    }, 80);

    return () => clearInterval(interval);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center">
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
            className="h-full bg-foreground rounded-full transition-all duration-300 ease-out"
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
