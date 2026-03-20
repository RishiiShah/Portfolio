"use client";
import { getTechIcon } from "@/data/techstack";

interface TechPillsProps {
  techs: string[];
  className?: string;
  animationDelay?: number;
  showIcons?: boolean;
}

export function TechPills({
  techs,
  className = "",
  animationDelay = 0,
  showIcons = true,
}: TechPillsProps) {
  return (
    <>
      {techs.map((tech, index) => {
        const Icon = showIcons ? getTechIcon(tech) : null;

        return (
          // span instead of div so pills wrap naturally in flex-wrap parents
          <span key={tech} className="group/pill relative inline-flex">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-[4px] bg-gradient-to-r from-transparent via-accent/20 to-transparent opacity-0 -translate-x-[130%] transition-all duration-500 ease-out group-hover/pill:opacity-100 group-hover/pill:translate-x-[130%]"
            />
            <span
              className={`relative inline-flex items-center gap-2 text-[10px] uppercase tracking-wider font-mono px-2.5 py-1 rounded-[4px] border border-foreground/8 bg-white/[0.025] cursor-pointer overflow-hidden transition-[transform,background-color,border-color,box-shadow] duration-300 ease-out group-hover/pill:-translate-y-0.5 group-hover/pill:scale-[1.02] group-hover/pill:bg-accent/8 group-hover/pill:border-accent/45 group-hover/pill:shadow-[0_8px_18px_var(--accent-glow)] animate-fade-in-up ${className}`}
              style={{ animationDelay: `${animationDelay + index * 0.05}s` }}
            >
              {Icon && (
                <span className="inline-flex items-center shrink-0 opacity-60 transition-[opacity,transform] duration-300 group-hover/pill:opacity-100 group-hover/pill:-translate-y-0.5 group-hover/pill:rotate-3">
                  <Icon className={tech === "Java" ? "w-3 h-3" : "w-2.5 h-2.5"} />
                </span>
              )}

              <span className="leading-none transition-[letter-spacing,color] duration-300 group-hover/pill:tracking-[0.08em] group-hover/pill:text-foreground/95">{tech}</span>
            </span>
          </span>
        );
      })}
    </>
  );
}
