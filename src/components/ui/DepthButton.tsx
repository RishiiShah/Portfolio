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
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

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
  "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium text-center transform-gpu will-change-transform transition-[transform,box-shadow,background-color,border-color,color,filter] duration-300 ease-out hover:scale-[1.03] active:scale-95";

const variantClasses: Record<NonNullable<BaseProps["variant"]>, string> = {
  primary: "bg-foreground text-background hover:brightness-110",
  secondary: "border border-foreground/20 bg-transparent text-foreground hover:bg-foreground/5 hover:border-foreground/30",
};

function getClassName(variant: NonNullable<BaseProps["variant"]>, className?: string) {
  return [baseClasses, variantClasses[variant], className].filter(Boolean).join(" ");
}

export function DepthButton(props: DepthButtonProps) {
  const variant = props.variant ?? "primary";

  if (isAnchorProps(props)) {
    const {
      children,
      className,
      iconLeft,
      iconRight,
      href,
      external,
      variant: anchorVariant,
      ...anchorProps
    } = props;
    const resolvedVariant = anchorVariant ?? variant;

    if (external || href.startsWith("http") || anchorProps.target === "_blank") {
      return (
        <a href={href} className={getClassName(resolvedVariant, className)} {...anchorProps}>
          {iconLeft}
          <span>{children}</span>
          {iconRight}
        </a>
      );
    }

    return (
      <Link href={href} className={getClassName(resolvedVariant, className)} {...anchorProps}>
        {iconLeft}
        <span>{children}</span>
        {iconRight}
      </Link>
    );
  }

  const { children, className, iconLeft, iconRight, variant: buttonVariant, ...buttonProps } = props;
  const resolvedVariant = buttonVariant ?? variant;

  return (
    <button className={getClassName(resolvedVariant, className)} {...buttonProps}>
      {iconLeft}
      <span>{children}</span>
      {iconRight}
    </button>
  );
}
