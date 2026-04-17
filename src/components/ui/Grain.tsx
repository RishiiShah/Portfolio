"use client";

// Lightweight SVG noise overlay for "printed" editorial texture.
// Rendered as a fixed, pointer-events-none layer above ambient beams.
export function Grain() {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.93 0 0 0 0 0.95 0 0 0 0 1 0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>`;
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-[1]"
      style={{
        backgroundImage: `url("data:image/svg+xml;utf8,${svg}")`,
        backgroundSize: "180px 180px",
        opacity: 0.035,
        mixBlendMode: "overlay",
      }}
    />
  );
}
