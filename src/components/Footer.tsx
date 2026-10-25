import { ArrowUp, ArrowUpRight } from "lucide-react";
import { bio } from "@/data";

const elsewhere = [
  { href: bio.github, label: "GitHub" },
  { href: bio.linkedin, label: "LinkedIn" },
  { href: bio.resume, label: "Résumé" },
];

export function Footer() {
  return (
    <footer className="px-[max(1.25rem,4vw)] pt-[12vh] pb-8">
      <div className="mx-auto max-w-[90rem] border-t border-line pt-10">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-8">
            <p className="display text-[clamp(2.5rem,6vw,5.5rem)]">
              {bio.name.split(" ")[0]} <em className="text-ink-3">{bio.name.split(" ").slice(1).join(" ")}</em>
            </p>
            <p className="mt-4 max-w-[38ch] text-ink-2">{bio.tagline}</p>
          </div>
          <ul className="space-y-2 md:col-span-4 md:justify-self-end">
            {elsewhere.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 text-lg text-ink-2 transition-colors hover:text-ink"
                >
                  <span className="link-line">{l.label}</span>
                  <ArrowUpRight size={15} className="text-ink-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-[8vh] flex flex-wrap items-center justify-between gap-4 text-sm text-ink-3">
          <span>
            © {new Date().getFullYear()} {bio.name}
          </span>
          <a href="#top" className="group inline-flex items-center gap-1.5 transition-colors hover:text-ink">
            Back to top <ArrowUp size={14} className="transition-transform group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
