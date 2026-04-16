"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FiGithub, FiLinkedin, FiMail, FiSend } from "react-icons/fi";
import { bio } from "@/data";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { fadeInLeft, fadeInRight, staggerContainer, viewportConfig } from "@/lib/animations";

type Status = "idle" | "sending" | "sent" | "error";

const inputClass =
  "w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-sky-400/50 transition-colors";

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({ email: "", message: "" });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    try {
      const res = await fetch("https://formspree.io/f/movyqpkr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email: form.email, message: form.message }),
      });

      if (res.ok) {
        setStatus("sent");
        setForm({ email: "", message: "" });
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMessage(
          (data as { error?: string }).error ?? "Something went wrong. Please try again."
        );
        setStatus("error");
      }
    } catch {
      setErrorMessage("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  };

  const socialLinks = [
    {
      icon: <FiMail size={18} />,
      label: "Email",
      value: bio.email,
      href: `mailto:${bio.email}`,
    },
    {
      icon: <FiGithub size={18} />,
      label: "GitHub",
      value: "RishiiShah",
      href: bio.github,
    },
    {
      icon: <FiLinkedin size={18} />,
      label: "LinkedIn",
      value: "rishabh-shah1",
      href: bio.linkedin,
    },
  ];

  return (
    <SectionWrapper id="contact">
      <SectionHeading
        label="06 / Contact"
        title="Get in Touch"
        subtitle="Open to projects, research collaborations, and full-time opportunities."
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        className="grid grid-cols-1 gap-12 md:grid-cols-2"
      >
        {/* Left — Contact form */}
        <motion.div variants={fadeInLeft}>
          {status === "sent" ? (
            <div className="flex flex-col items-center justify-center rounded-xl bg-sky-400/10 border border-sky-400/20 p-10 text-center h-full min-h-[240px]">
              <p className="text-sky-400 font-semibold text-lg mb-2">Message sent!</p>
              <p className="text-neutral-400 text-sm">
                Thanks for reaching out. I&apos;ll get back to you soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label htmlFor="email" className="block text-xs text-neutral-500 mb-1.5">
                  Your email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-xs text-neutral-500 mb-1.5">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  placeholder="Hi Rishabh, I'd like to..."
                  value={form.message}
                  onChange={handleChange}
                  className={`${inputClass} resize-none`}
                />
              </div>

              {status === "error" && errorMessage && (
                <p className="text-red-400 text-xs">{errorMessage}</p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="flex items-center justify-center gap-2 rounded-lg bg-sky-400 px-5 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <FiSend size={14} />
                {status === "sending" ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </motion.div>

        {/* Right — Social links */}
        <motion.div variants={fadeInRight} className="flex flex-col gap-6">
          <p className="text-neutral-400 leading-relaxed">
            I&apos;m open to full-time software engineering roles, ML research positions, and
            interesting open-source or research collaborations. If you have an interesting problem
            or just want to say hello, feel free to reach out.
          </p>

          <div className="flex flex-col gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target={social.label !== "Email" ? "_blank" : undefined}
                rel={social.label !== "Email" ? "noopener noreferrer" : undefined}
                className="flex items-center gap-4 group"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 group-hover:border-sky-400/40 group-hover:text-sky-400 transition-all duration-200">
                  {social.icon}
                </div>
                <div>
                  <p className="text-xs text-neutral-500 mb-0.5">{social.label}</p>
                  <p className="text-sm text-neutral-300 group-hover:text-sky-400 transition-colors duration-200">
                    {social.value}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </SectionWrapper>
  );
}
