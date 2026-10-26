import Link from "next/link";

export default function NotFound() {
  return (
    <main className="shell flex min-h-[100svh] flex-col justify-center">
      <p className="label !text-accent">404 · No route matched</p>
      <h1 className="display mt-6 text-[clamp(4rem,16vw,14rem)]">
        Lost the <span className="text-accent">signal.</span>
      </h1>
      <p className="mt-8 max-w-md text-lg text-ink-2">This page moved, or it never existed.</p>
      <Link
        href="/"
        className="mt-10 inline-flex h-12 w-fit items-center rounded-full bg-ink px-6 font-medium text-bg transition-colors hover:bg-accent"
      >
        Back to the portfolio
      </Link>
    </main>
  );
}
