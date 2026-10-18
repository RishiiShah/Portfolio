import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[100svh] flex-col justify-center px-4 md:px-10">
      <p className="label text-accent">Error 404 · no detections</p>
      <h1 className="display mt-4 text-[clamp(4rem,18vw,14rem)]">
        Lost<span className="text-accent">.</span>
      </h1>
      <p className="mt-6 max-w-md text-lg text-ink-2">
        Nothing matched this URL. The page may have moved, or it never existed.
      </p>
      <Link
        href="/"
        className="mt-10 flex h-12 w-fit items-center bg-ink px-6 text-sm font-medium text-bg transition-colors hover:bg-accent hover:text-accent-ink"
      >
        Back to the portfolio
      </Link>
    </main>
  );
}
