import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  label?: string;
  title: string;
  subtitle?: string;
  className?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  label,
  title,
  subtitle,
  className,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-12 sm:mb-16",
        align === "center" && "text-center",
        className
      )}
    >
      {label && (
        <p className="text-xs font-mono text-sky-400 uppercase tracking-widest mb-3">
          {label}
        </p>
      )}
      <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{title}</h2>
      {subtitle && (
        <p className="text-neutral-400 text-lg max-w-2xl">{subtitle}</p>
      )}
    </div>
  );
}
