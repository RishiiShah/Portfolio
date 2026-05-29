import Link from "next/link";
import { Tilt } from "@/components/ui/Tilt";

export default function NotFound() {
  return (
    <div className="flex min-h-[100svh] flex-col items-center justify-center p-4">
      <Tilt max={7} perspective={1600} className="inline-block">
        <h1
          className="font-serif leading-[1.02] tracking-tight text-[var(--ink)] mb-4 text-center"
          style={{
            fontSize: "clamp(3rem, 9vw, 5.5rem)",
            textShadow: "0 2px 40px rgba(122,162,255,0.15)",
          }}
        >
          404.
        </h1>
      </Tilt>
      <p className="max-w-xl text-center text-base leading-relaxed text-[var(--ink-dim)] sm:text-lg mb-8">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="hero-shader-button px-7 py-3 text-sm font-medium flex items-center"
      >
        Return Home
      </Link>
    </div>
  );
}
