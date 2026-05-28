import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number;
  color?: string;
};

/** Groq brand mark (not in Simple Icons). */
export function GroqIcon({
  size = 24,
  color = "currentColor",
  ...rest
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 209.6 304.7"
      fill={color}
      aria-hidden="true"
      {...rest}
    >
      <path d="M105.3.004C47.7-.5.5 45.8 0 103.4c-.5 57.6 45.8 104.8 103.4 105.3h36.2v-39.1h-34.3c-36.4-65.6-28.4-66-64.5-.4-36.1 28.4-65.6 64.5-66h1.5c36 0 65.2 29.2 65.4 65.2v96.1c0 35.7-29.1 64.8-64.7 65.2-17.1-.1-33.4-7-45.4-19.1l-27.7 27.7c19.2 19.3 45.2 30.3 72.4 30.5h1.4c56.9-.8 102.6-47 102.9-103.9v-99.1c-1.4-56.5-47.7-101.6-104.3-101.7z" />
    </svg>
  );
}

/** Generic fallback for tech without a brand icon. */
export function TechDot({
  size = 24,
  color = "currentColor",
  ...rest
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      <circle cx="12" cy="12" r="3" />
      <circle cx="12" cy="12" r="8" opacity="0.4" />
    </svg>
  );
}
