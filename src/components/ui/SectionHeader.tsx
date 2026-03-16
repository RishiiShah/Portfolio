import type { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  action?: ReactNode;
  className?: string;
}

export function SectionHeader({ title, action, className = "" }: SectionHeaderProps) {
  return (
    <div className={`mb-3 flex items-center justify-between gap-3 border-b-[1.5px] border-foreground/10 pb-2 ${className}`}>
      <h2 className="text-sm font-semibold tracking-wide text-foreground/90">{title}</h2>
      {action}
    </div>
  );
}
