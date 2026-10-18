import { bio } from "@/data";

export function Footer() {
  return (
    <footer data-shape="5" className="relative overflow-hidden px-[max(1rem,4vw)] pt-[6vh]">
      <div className="label flex flex-wrap justify-between gap-4 border-t border-line pt-4 text-ink-3">
        <span>© {new Date().getFullYear()} {bio.name}</span>
        <span>Next.js · three.js · GSAP</span>
        <a href="#top" className="transition-colors hover:text-accent">Back to top ↑</a>
      </div>
      <p
        aria-hidden="true"
        className="display mt-[4vh] pb-[3vh] text-[9.6vw] leading-[0.8] whitespace-nowrap text-transparent [-webkit-text-stroke:1px_var(--ink-3)]"
      >
        Rishabh Shah
      </p>
    </footer>
  );
}
