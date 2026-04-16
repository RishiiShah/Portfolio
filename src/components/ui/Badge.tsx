import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "accent" | "outline";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium",
        variant === "default" && "bg-neutral-800 text-neutral-300 border border-neutral-700/50",
        variant === "accent" && "bg-sky-500/10 text-sky-400 border border-sky-500/20",
        variant === "outline" && "border border-neutral-700 text-neutral-400",
        className
      )}
    >
      {children}
    </span>
  );
}
