import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type BaseProps = {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
};

type ButtonProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type AnchorProps = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
    external?: boolean;
  };

export type DepthButtonProps = ButtonProps | AnchorProps;

function isAnchorProps(props: DepthButtonProps): props is AnchorProps {
  return typeof (props as AnchorProps).href === "string";
}

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-[5px] px-4 py-2 text-sm font-medium font-mono uppercase tracking-wider text-center transform-gpu will-change-transform transition-all duration-200 ease-out active:scale-[0.98] active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none";

const variantClasses: Record<NonNullable<BaseProps["variant"]>, string> = {
  primary:
    "bg-accent/90 backdrop-blur-md text-white border border-accent/60 shadow-[0_0_18px_var(--accent-glow),inset_0_1px_0_rgba(255,255,255,0.15)] hover:bg-accent hover:shadow-[0_0_32px_var(--accent-glow)]",
  secondary:
    "border border-foreground/15 bg-white/5 backdrop-blur-md text-foreground hover:bg-white/10 hover:border-foreground/30 hover:shadow-[0_4px_20px_rgba(0,0,0,0.2)]",
};

function getClassName(variant: NonNullable<BaseProps["variant"]>, className?: string) {
  return [baseClasses, variantClasses[variant], className].filter(Boolean).join(" ");
}

export function DepthButton(props: DepthButtonProps) {
  const variant = props.variant ?? "primary";

  if (isAnchorProps(props)) {
    const { children, className, iconLeft, iconRight, href, external, variant: v, ...rest } = props;
    const resolvedVariant = v ?? variant;

    if (external || href.startsWith("http") || rest.target === "_blank") {
      return (
        <a href={href} className={getClassName(resolvedVariant, className)} {...rest}>
          {iconLeft}
          <span>{children}</span>
          {iconRight}
        </a>
      );
    }

    return (
      <Link href={href} className={getClassName(resolvedVariant, className)} {...rest}>
        {iconLeft}
        <span>{children}</span>
        {iconRight}
      </Link>
    );
  }

  const { children, className, iconLeft, iconRight, variant: v, ...rest } = props;
  const resolvedVariant = v ?? variant;

  return (
    <button className={getClassName(resolvedVariant, className)} {...rest}>
      {iconLeft}
      <span>{children}</span>
      {iconRight}
    </button>
  );
}
