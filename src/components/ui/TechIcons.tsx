import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number;
  color?: string;
};

/** Java: steaming coffee cup with a lowercase "j" hint. Monoline, brand-agnostic. */
export function JavaIcon({
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
      {/* Steam */}
      <path d="M8.5 2.5c0 1 1 1.5 1 2.5s-1 1.5-1 2.5" opacity="0.85" />
      <path d="M12 2c0 1 1 1.5 1 2.5s-1 1.5-1 2.5" opacity="0.85" />
      <path d="M15.5 2.5c0 1 1 1.5 1 2.5s-1 1.5-1 2.5" opacity="0.85" />
      {/* Cup */}
      <path d="M4 10h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-5z" />
      {/* Handle */}
      <path d="M17 11h2a2 2 0 0 1 0 4h-1.2" />
      {/* Saucer */}
      <path d="M3 22h15" opacity="0.7" />
    </svg>
  );
}

/** SQL: database cylinder with a query bracket underline. */
export function SqlIcon({
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
      {/* Cylinder top */}
      <ellipse cx="12" cy="5" rx="7.5" ry="2.5" />
      {/* Left side */}
      <path d="M4.5 5v11c0 1.4 3.4 2.5 7.5 2.5s7.5-1.1 7.5-2.5V5" />
      {/* Middle band */}
      <path d="M4.5 10.5c0 1.4 3.4 2.5 7.5 2.5s7.5-1.1 7.5-2.5" opacity="0.6" />
      {/* Query caret */}
      <path
        d="M8.5 21l-1.5-1.5L8.5 18"
        opacity="0.9"
      />
      <path
        d="M15.5 21l1.5-1.5L15.5 18"
        opacity="0.9"
      />
    </svg>
  );
}

/** OpenAI API: simple monogram of the rosette. */
export function OpenAiIcon({
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
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      <path d="M12 3a4 4 0 0 1 4 4v5a4 4 0 0 1-4 4 4 4 0 0 1-4-4V7a4 4 0 0 1 4-4z" />
      <path d="M8.5 7.5L12 9.5l3.5-2" />
      <path d="M12 9.5V15" />
      <path d="M8.5 12.5l3.5 2 3.5-2" />
    </svg>
  );
}

/** Generic chip fallback for any tech without a dedicated icon. */
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
