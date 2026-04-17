"use client";

import { useState } from "react";
import { m } from "framer-motion";
import { bio } from "@/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DottedMap } from "@/components/ui/DottedMap";
import { Mail, MapPin } from "lucide-react";
import { FiGithub, FiLinkedin } from "react-icons/fi";

type Status = "idle" | "loading" | "success" | "error";
type FormFields = { name: string; email: string; message: string };
type FormErrors = { name: string; email: string; message: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MAP_MARKERS = [
  { lat: 40.7128, lng: -74.006, size: 0.9, pulse: true, label: "NYC" },
  { lat: 19.076, lng: 72.8777, size: 0.9, pulse: true, label: "MUMBAI" },
];

function validate(values: FormFields): FormErrors {
  const errors: FormErrors = { name: "", email: "", message: "" };
  if (values.name.trim().length < 2)
    errors.name = "Name must be at least 2 characters.";
  if (!EMAIL_RE.test(values.email.trim()))
    errors.email = "Enter a valid email address.";
  if (values.message.trim().length < 10)
    errors.message = "Message must be at least 10 characters.";
  return errors;
}

function hasErrors(errors: FormErrors) {
  return Object.values(errors).some(Boolean);
}

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState<FormFields>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<FormErrors>({ name: "", email: "", message: "" });
  const [touched, setTouched] = useState({ name: false, email: false, message: false });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const next = { ...form, [name]: value };
    setForm(next);
    if (touched[name as keyof typeof touched]) {
      setErrors(validate(next));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const field = e.target.name as keyof typeof touched;
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate(form));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const allTouched = { name: true, email: true, message: true };
    setTouched(allTouched);
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (hasErrors(validationErrors)) return;

    setStatus("loading");
    try {
      const res = await fetch("https://formspree.io/f/movyqpkr", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
        setTouched({ name: false, email: false, message: false });
        setErrors({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  function inputClass(field: keyof FormErrors) {
    const isError = touched[field] && errors[field];
    return `w-full rounded-lg px-4 py-2.5 text-sm text-[var(--ink)] placeholder:text-[var(--ink-mute)]
      transition-all focus:outline-none border bg-transparent ${isError
        ? "border-[var(--danger)]/55 focus:border-[var(--danger)]/80"
        : "border-[var(--line)] focus:border-[var(--accent)]/60"
      }`;
  }

  return (
    <section id="contact" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeading
            index="07"
            backgroundText="HELLO"
            eyebrow="Contact"
            title="Get in touch"
            subtitle="Open to SWE, systems, and ML/AI opportunities. Feel free to reach out."
          />
        </m.div>

        <div className="grid md:grid-cols-5 gap-10">
          {/* Info */}
          <m.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-2 space-y-6"
          >
            <p className="text-[0.9375rem] text-[var(--ink-dim)] leading-relaxed">
              I&apos;m currently looking for full-time roles and internships in
              software engineering, systems, and AI/ML. Whether it&apos;s a
              project collaboration, job opportunity, or just to say hi, my
              inbox is open.
            </p>

            <div className="space-y-3">
              <a
                href={`mailto:${bio.email}`}
                className="flex items-center gap-3 text-sm text-[var(--ink-dim)] hover:text-[var(--ink)] transition-colors"
              >
                <Mail size={13} className="text-[var(--accent)] shrink-0" />
                {bio.email}
              </a>
              <div className="flex items-center gap-3 text-sm text-[var(--ink-mute)]">
                <MapPin size={13} className="text-[var(--accent)] shrink-0" />
                {bio.location}
              </div>
            </div>

            <div className="glass-panel overflow-hidden p-4 rounded-2xl">
              <DottedMap
                markers={MAP_MARKERS}
                dotColor="rgba(238,242,252,0.34)"
                markerColor="#e6b980"
                dotRadius={0.32}
                pulse
                mapSamples={6400}
                className="h-56 md:h-64"
                renderMarkerOverlay={({ marker, x, y }) => {
                  const isNYC = marker.label === "NYC";
                  const offset = 1.6;
                  return (
                    <g pointerEvents="none">
                      <text
                        x={isNYC ? x + offset : x - offset}
                        y={y + 0.6}
                        fontSize={2.1}
                        fontFamily="var(--font-mono)"
                        fontWeight="700"
                        fill="#e6b980"
                        textAnchor={isNYC ? "start" : "end"}
                        style={{ letterSpacing: "0.1em" }}
                      >
                        {marker.label}
                      </text>
                    </g>
                  );
                }}
              />
            </div>

            <div className="flex items-center gap-5">
              <a
                href={bio.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-[var(--ink-mute)] hover:text-[var(--ink)] transition-colors"
              >
                <FiGithub size={13} /> GitHub
              </a>
              <a
                href={bio.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-[var(--ink-mute)] hover:text-[var(--ink)] transition-colors"
              >
                <FiLinkedin size={13} /> LinkedIn
              </a>
            </div>
          </m.div>

          {/* Form */}
          <m.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-3"
          >
            {status === "success" ? (
              <div className="flex h-full min-h-[280px] items-center justify-center rounded-2xl glass-panel p-8 text-center">
                <div>
                  <div className="mb-3 text-2xl text-[var(--accent-signal)]">✓</div>
                  <p className="font-medium text-[var(--ink)]">Message sent!</p>
                  <p className="mt-1 text-sm text-[var(--ink-mute)]">
                    I&apos;ll get back to you shortly.
                  </p>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-4 glass-panel rounded-2xl p-6 md:p-7"
                noValidate
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ink-mute)]"
                    >
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Your name"
                      className={inputClass("name")}
                    />
                    {touched.name && errors.name && (
                      <p className="mt-1 text-xs text-[var(--danger)]">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ink-mute)]"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="your@email.com"
                      className={inputClass("email")}
                    />
                    {touched.email && errors.email && (
                      <p className="mt-1 text-xs text-[var(--danger)]">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ink-mute)]"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="What's on your mind?"
                    className={`resize-none ${inputClass("message")}`}
                  />
                  <div className="flex items-start justify-between mt-1 gap-4">
                    {touched.message && errors.message ? (
                      <p className="text-xs text-[var(--danger)]">{errors.message}</p>
                    ) : (
                      <span />
                    )}
                    <span
                      className={`text-[10px] font-mono shrink-0 ${
                        form.message.trim().length < 10
                          ? "text-[var(--ink-mute)]"
                          : "text-[var(--ink-dim)]"
                      }`}
                    >
                      {form.message.trim().length}/10 min
                    </span>
                  </div>
                </div>

                {status === "error" && (
                  <p className="text-xs text-[var(--danger)]">
                    Something went wrong. Please try again or email directly.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="glass-button px-6 py-2.5 text-sm font-medium disabled:opacity-50"
                >
                  {status === "loading" ? "Sending…" : "Send message"}
                </button>
              </form>
            )}
          </m.div>
        </div>
      </div>
    </section>
  );
}
