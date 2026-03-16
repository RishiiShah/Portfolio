"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { FiArrowLeft } from "react-icons/fi";

interface SmartBackButtonProps {
  fallbackUrl?: string;
  className?: string;
}

export function SmartBackButton({ fallbackUrl = "/projects", className = "" }: SmartBackButtonProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [hasHistory] = useState(() => (typeof window !== "undefined" ? window.history.length > 1 : false));

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
      className={`inline-flex items-center gap-2 rounded-md border border-foreground/20 px-3 py-2 text-xs sm:text-sm font-medium transition-[transform,color,background-color,border-color] duration-300 ease-out hover:bg-foreground/5 hover:border-foreground/30 hover:text-foreground/80 hover:scale-[1.02] active:scale-95 animate-fade-in-up delay-100 ${className}`}
      aria-label="Go back to projects"
    >
      <FiArrowLeft className="w-4 h-4" aria-hidden="true" />
      Back to Projects
    </button>
  );
}
