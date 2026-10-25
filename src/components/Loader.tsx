import { bio } from "@/data";

/** First visit of a session only: the name rises, a rule draws under it, and the panel lifts (see globals.css). */
export function Loader() {
  return (
    <div aria-hidden="true" className="loader fixed inset-0 z-[90] flex-col items-center justify-center bg-bg">
      <div className="overflow-hidden">
        <p className="loader-word display text-[clamp(2.5rem,7vw,5.5rem)] italic">{bio.name}</p>
      </div>
      <span className="loader-bar mt-5 block h-px w-[min(18rem,60vw)] bg-accent" />
    </div>
  );
}
