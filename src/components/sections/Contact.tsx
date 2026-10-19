"use client";

import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { bio } from "@/data";
import { Magnetic, RevealText, Stagger } from "../anim";

const FORM_ENDPOINT = "https://formspree.io/f/movyqpkr";

const links = [
  { label: "GitHub", href: bio.github },
  { label: "LinkedIn", href: bio.linkedin },
  { label: "Résumé", href: bio.resume },
];

const field =
  "w-full border-b border-line bg-bg/40 py-3 text-lg backdrop-blur-sm text-ink placeholder:text-ink-3 transition-colors focus:border-accent focus:outline-none";

export function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" data-shape="5" className="relative px-[max(1rem,4vw)] pt-[18vh] pb-[10vh]">
      <div className="label flex items-center justify-between border-t border-line pt-4 text-ink-3">
        <span>
          <span className="text-accent">(06)</span> Contact
        </span>
        <span>Replies within ~2 days</span>
      </div>
      <h2 className="display mt-[5vh] text-[11vw] leading-[0.82] md:text-[10vw]">
        <RevealText text="Let's build" className="block" />
        <RevealText text="something." className="block md:pl-[4vw]" delay={0.15} />
      </h2>

      <div className="mt-[12vh] grid gap-[8vh] md:grid-cols-12 md:gap-x-[min(8vh,5vw)]">
        <Stagger className="md:col-span-4">
          <p className="max-w-[34ch] text-lg leading-snug text-ink-2">
            Hiring for a software, systems, or ML role? Want to talk about a project or paper? Send a note.
          </p>
          <ul className="mt-10 border-t border-line">
            {links.map((l) => (
              <li key={l.label} className="border-b border-line">
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between py-4 text-xl transition-colors hover:text-accent"
                >
                  <span className="transition-transform duration-500 group-hover:translate-x-3">{l.label}</span>
                  <ArrowUpRight size={20} className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                </a>
              </li>
            ))}
          </ul>
        </Stagger>

        <form onSubmit={onSubmit} className="space-y-8 md:col-span-7 md:col-start-6">
          <div className="grid gap-8 sm:grid-cols-2">
            <label className="block">
              <span className="label text-ink-3">Name</span>
              <input name="name" required autoComplete="name" placeholder="Your name" className={field} />
            </label>
            <label className="block">
              <span className="label text-ink-3">Email</span>
              <input name="email" type="email" required autoComplete="email" placeholder="you@company.com" className={field} />
            </label>
          </div>
          <label className="block">
            <span className="label text-ink-3">Message</span>
            <textarea name="message" required rows={4} placeholder="What are you working on?" className={`${field} resize-none`} />
          </label>
          <div className="flex flex-wrap items-center gap-5">
            <Magnetic>
              <button
                type="submit"
                disabled={status === "sending"}
                className="flex h-14 items-center gap-2 bg-accent px-8 text-sm font-semibold text-accent-ink transition-transform hover:scale-[1.03] disabled:opacity-50"
              >
                {status === "sending" ? "Sending…" : "Send message"} <ArrowUpRight size={16} />
              </button>
            </Magnetic>
            <p aria-live="polite" className="text-sm text-ink-2">
              {status === "sent" && "Thanks, message received."}
              {status === "error" && "That didn't go through. Try LinkedIn instead."}
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
