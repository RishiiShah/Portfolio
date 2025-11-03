"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface SmartBackButtonProps {
  fallbackUrl?: string;
  className?: string;
}

export function SmartBackButton({ fallbackUrl = "/projects", className = "" }: SmartBackButtonProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [hasHistory, setHasHistory] = useState(false);

  useEffect(() => {
    // Check if there's browser history
    setHasHistory(window.history.length > 1);
  }, []);

  const handleBack = () => {
    // If we have search params (filters), preserve them in the back navigation
    if (searchParams.toString()) {
      // Create URL with preserved search params
      const backUrl = `${fallbackUrl}?${searchParams.toString()}`;
      router.push(backUrl);
    } else if (hasHistory) {
      // Use browser back if no search params but we have history
      router.back();
    } else {
      // Fallback to the provided URL
      router.push(fallbackUrl);
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`inline-flex items-center gap-2 text-xs sm:text-sm font-medium transition-all duration-300 hover:scale-105 hover:text-foreground/80 active:scale-95 animate-fade-in-up delay-100 ${className}`}
      aria-label="Go back to projects"
    >
      <svg 
        className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      Back to Projects
    </button>
  );
}
