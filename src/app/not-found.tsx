import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[100svh] flex-col justify-center px-[max(1.25rem,4vw)]">
      <p className="eyebrow text-accent">Error 404</p>
      <h1 className="display mt-4 text-[clamp(4rem,16vw,12rem)]">
        Nothing <em className="text-accent">here.</em>
      </h1>
      <p className="mt-6 max-w-md text-lg text-ink-2">The page may have moved, or it never existed.</p>
      <Link
        href="/"
        className="mt-10 inline-flex h-12 w-fit items-center rounded-full bg-ink px-6 text-bg transition-colors hover:bg-accent hover:text-accent-ink"
      >
        Back to the portfolio
      </Link>
    </main>
  );
}
