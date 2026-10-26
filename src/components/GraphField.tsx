"use client";

import { useEffect, useRef } from "react";

const TERMS = [
  "Python", "Django", "FastAPI", "PostgreSQL", "SQLite", "Redis", "Tree-sitter", "BM25",
  "MCP", "YOLOv12x", "ByteTrack", "PyTorch", "WGAN-GP", "Bi-LSTM", "OpenCV", "Next.js",
  "TypeScript", "Prisma", "Docker", "AWS S3", "EC2", "JWT", "RBAC", "Groq", "Llama",
  "Azure IoT", "Raspberry Pi", "Flutter", "React", "Express", "MySQL", "Twilio",
];

type Node = { x: number; y: number; vx: number; vy: number; r: number; label?: string; glow: number };

const ACCENT = "255, 90, 31";
const INK = "237, 234, 226";

export function GraphField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const monoFamily =
      getComputedStyle(document.documentElement).getPropertyValue("--font-jetbrains").trim() || "monospace";
    const pointer = { x: -9999, y: -9999, active: false };
    let nodes: Node[] = [];
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;

    const seed = () => {
      const count = Math.round(Math.min(110, Math.max(40, (w * h) / 14000)));
      nodes = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: i < TERMS.length ? 2.2 : 1.2 + Math.random(),
        label: i < TERMS.length ? TERMS[i] : undefined,
        glow: 0,
      }));
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      if (reduced) draw();
    };

    const link = Math.max(110, Math.min(170, window.innerWidth / 9));
    const reach = 190;

    const step = () => {
      for (const n of nodes) {
        const dx = n.x - pointer.x;
        const dy = n.y - pointer.y;
        const d = Math.hypot(dx, dy);
        const near = pointer.active && d < reach;
        n.glow += ((near ? 1 - d / reach : 0) - n.glow) * 0.08;
        if (near && d > 1) {
          const push = (1 - d / reach) * 0.04;
          n.vx += (dx / d) * push;
          n.vy += (dy / d) * push;
        }
        n.vx *= 0.985;
        n.vy *= 0.985;
        const speed = Math.hypot(n.vx, n.vy);
        if (speed < 0.08) {
          n.vx += (Math.random() - 0.5) * 0.02;
          n.vy += (Math.random() - 0.5) * 0.02;
        }
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -20) n.x = w + 20;
        if (n.x > w + 20) n.x = -20;
        if (n.y < -20) n.y = h + 20;
        if (n.y > h + 20) n.y = -20;
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d > link) continue;
          const t = 1 - d / link;
          const g = Math.max(a.glow, b.glow);
          ctx.strokeStyle = g > 0.05 ? `rgba(${ACCENT}, ${t * (0.15 + g * 0.6)})` : `rgba(${INK}, ${t * 0.12})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      ctx.font = `500 11px ${monoFamily}`;
      for (const n of nodes) {
        ctx.fillStyle = n.glow > 0.05 ? `rgba(${ACCENT}, ${0.5 + n.glow * 0.5})` : `rgba(${INK}, 0.45)`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + n.glow * 2, 0, Math.PI * 2);
        ctx.fill();
        if (n.label) {
          ctx.fillStyle = `rgba(${n.glow > 0.05 ? ACCENT : INK}, ${0.18 + n.glow * 0.8})`;
          ctx.fillText(n.label, n.x + 7, n.y + 4);
        }
      }
    };

    const loop = () => {
      if (visible) {
        step();
        draw();
      }
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = pointer.y >= 0 && pointer.y <= rect.height;
    };
    const onLeave = () => {
      pointer.active = false;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(canvas);
    resize();

    if (!reduced) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerleave", onLeave);
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className="absolute inset-0 size-full" />;
}
