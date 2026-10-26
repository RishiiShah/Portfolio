"use client";

import { useRef, useState, type ReactNode } from "react";

let topZ = 10;

export function Sticker({
  children,
  rotate = 0,
  className = "",
}: {
  children: ReactNode;
  rotate?: number;
  className?: string;
}) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [z, setZ] = useState(1);
  const start = useRef({ px: 0, py: 0, x: 0, y: 0 });

  return (
    <div
      data-sticker
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        start.current = { px: e.clientX, py: e.clientY, x: pos.x, y: pos.y };
        setDragging(true);
        setZ(++topZ);
      }}
      onPointerMove={(e) => {
        if (!dragging) return;
        setPos({
          x: start.current.x + e.clientX - start.current.px,
          y: start.current.y + e.clientY - start.current.py,
        });
      }}
      onPointerUp={() => setDragging(false)}
      onPointerCancel={() => setDragging(false)}
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px) rotate(${dragging ? 0 : rotate}deg) scale(${dragging ? 1.08 : 1})`,
        zIndex: z,
      }}
      className={`touch-none select-none rounded-2xl text-[#16130f] border-2 border-ink px-4 py-3 font-display font-semibold leading-tight tracking-tight shadow-[4px_4px_0_var(--color-ink)] transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.34,1.6,0.5,1)] ${
        dragging ? "cursor-grabbing shadow-[10px_10px_0_var(--color-ink)] !duration-0" : "cursor-grab hover:shadow-[6px_6px_0_var(--color-ink)]"
      } ${className}`}
    >
      {children}
    </div>
  );
}
