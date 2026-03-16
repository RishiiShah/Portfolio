import type { IconType } from "react-icons";
import { DepthButton } from "@/components/ui/DepthButton";

interface IconLinkButtonProps {
  href: string;
  label: string;
  icon: IconType;
  className?: string;
  variant?: "primary" | "secondary";
}

export function IconLinkButton({
  href,
  label,
  icon: Icon,
  className,
  variant = "secondary",
}: IconLinkButtonProps) {
  return (
    <DepthButton
      href={href}
      external
      target="_blank"
      rel="noreferrer noopener"
      variant={variant}
      className={className}
      iconLeft={<Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
      aria-label={label}
    >
      {label}
    </DepthButton>
  );
}
