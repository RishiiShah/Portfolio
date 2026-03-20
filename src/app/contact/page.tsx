"use client";
import { useState } from "react";
import { FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";

const contactChannels = [
  {
    label: "Email",
    value: "rishabh.shah033@djsce.edu.in",
    href: "mailto:rishabh.shah033@djsce.edu.in",
    icon: FaEnvelope,
  },
  {
    label: "LinkedIn",
    value: "rishabh-shah1",
    href: "https://www.linkedin.com/in/rishabh-shah1/",
    icon: FaLinkedin,
  },
  {
    label: "GitHub",
    value: "RishiiShah",
    href: "https://github.com/RishiiShah",
    icon: FaGithub,
  },
];

export default function ContactPage() {
  const [status, setStatus] = useState<string | null>(null);
  const [sendState, setSendState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errors, setErrors] = useState<{ email?: string; message?: string }>({});
  const [nameValue, setNameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [roleValue, setRoleValue] = useState("");
  const [messageValue, setMessageValue] = useState("");

  const validateEmail = (email: string): string | undefined => {
    if (!email) return undefined;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return undefined;
  };

  const validateMessage = (message: string): string | undefined => {
    if (!message) return undefined;
    if (message.trim().length < 10) {
      return "Message must be at least 10 characters";
    }
    return undefined;
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Validate
    const emailError = validateEmail(emailValue);
    const messageError = validateMessage(messageValue);

    if (emailError || messageError) {
      setErrors({ email: emailError, message: messageError });
      return;
    }

    setSendState("submitting");
    setErrors({});
    setStatus(null);

    const payload = {
      name: nameValue.trim(),
      email: emailValue.trim(),
      role: roleValue.trim(),
      message: messageValue.trim(),
      _subject: "New portfolio contact form message",
    };

    try {
      const res = await fetch("https://formspree.io/f/movyqpkr", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      let responseData: {
        ok?: boolean;
        next?: string;
        errors?: Array<{ message?: string }>;
      } | null = null;

      try {
        responseData = await res.json();
      } catch {
        responseData = null;
      }

      const isSuccess = res.ok && (responseData?.ok === true || Boolean(responseData?.next));

      if (isSuccess) {
        setSendState("success");
        setStatus("Thanks — I'll get back to you.");
        setNameValue("");
        setEmailValue("");
        setRoleValue("");
        setMessageValue("");
        setTimeout(() => setSendState("idle"), 2200);
        return;
      }

      const apiError = responseData?.errors?.[0]?.message;
      setSendState("error");
      setStatus(apiError || "Something went wrong. Please email me.");
      setTimeout(() => setSendState("idle"), 2200);
    } catch (error) {
      console.error("Form submission error:", error);
      setSendState("error");
      setStatus("Network error. Please email me.");
      setTimeout(() => setSendState("idle"), 2200);
    }
  }

  return (
    <main className="pb-12 sm:pb-16 lg:pb-20">
      <section className="relative isolate overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(130deg,rgba(7,23,31,0.92),rgba(9,13,20,0.92)_50%,rgba(11,41,53,0.9))] p-5 sm:p-8">
        <div className="pointer-events-none absolute -left-24 top-0 h-64 w-64 rounded-full bg-cyan-300/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-blue-300/10 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 opacity-25">
          <div className="animate-surface-drift absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:44px_44px]" />
          <div className="animate-surface-drift absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.12)_0.55px,transparent_0.55px)] bg-[size:5px_5px] opacity-[0.08]" />
        </div>

        <div className="relative grid gap-7 lg:grid-cols-[0.92fr_1.08fr]">
          <aside className="animate-fade-in-up rounded-2xl border border-white/10 bg-black/20 p-5 backdrop-blur-sm sm:p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent/85">Contact / Signal Desk</p>
            <h1 className="mt-3 text-3xl font-black leading-[0.92] text-foreground sm:text-5xl">
              Let&apos;s build
              <span className="block text-accent">the hard thing.</span>
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-foreground/70 sm:text-base">
              Send your idea, challenge, or collaboration brief. I read every serious message and reply with concrete next steps.
            </p>

            <div className="mt-6 space-y-3">
              {contactChannels.map((channel, index) => {
                const Icon = channel.icon;
                return (
                  <a
                    key={channel.label}
                    href={channel.href}
                    target={channel.href.startsWith("http") ? "_blank" : undefined}
                    rel={channel.href.startsWith("http") ? "noreferrer noopener" : undefined}
                    className="group flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 transition-all duration-300 hover:border-accent/45 hover:bg-accent/[0.07]"
                    style={{ animationDelay: `${0.25 + index * 0.08}s` }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-black/30 text-accent">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/50">{channel.label}</p>
                        <p className="text-sm text-foreground/85">{channel.value}</p>
                      </div>
                    </div>
                    <span className="font-mono text-xs text-accent transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </a>
                );
              })}
            </div>

            <div className="mt-6 rounded-xl border border-white/10 bg-black/25 p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-foreground/50">Preferred Brief</p>
              <ul className="mt-3 space-y-2 text-sm text-foreground/70">
                <li>Project goal and scope</li>
                <li>Timeline or urgency</li>
                <li>Team and tech context</li>
              </ul>
            </div>
          </aside>

          <div className="animate-fade-in-up rounded-2xl border border-white/10 bg-black/30 p-5 backdrop-blur-sm sm:p-6 delay-200">
            <div className="mb-5 flex items-end justify-between border-b border-white/10 pb-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-foreground/50">Collaboration Form</p>
                <p className="mt-2 text-sm text-foreground/70">Name, role, and message. Clear and direct works best.</p>
              </div>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent/85">Live</span>
            </div>

            <form onSubmit={onSubmit} className="space-y-3 sm:space-y-4">
              <div className="animate-fade-in-up delay-300">
                <input
                  className="w-full rounded-xl border border-white/15 bg-black/25 px-3 py-2.5 text-sm text-foreground placeholder:text-foreground/45 transition-all duration-300 hover:border-accent/40 focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/30"
                  name="name"
                  placeholder="Your Name"
                  required
                  value={nameValue}
                  onChange={(e) => setNameValue(e.target.value)}
                />
              </div>

              <div className="animate-fade-in-up delay-400">
                <input
                  className={`w-full rounded-xl border bg-black/25 px-3 py-2.5 text-sm text-foreground placeholder:text-foreground/45 transition-all duration-300 hover:border-accent/40 focus:outline-none focus:ring-2 ${errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500/40" : "border-white/15 focus:border-accent/60 focus:ring-accent/30"}`}
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  value={emailValue}
                  onChange={(e) => {
                    setEmailValue(e.target.value);
                    if (errors.email) {
                      setErrors({ ...errors, email: undefined });
                    }
                  }}
                  onBlur={(e) => {
                    const error = validateEmail(e.target.value);
                    if (error) setErrors({ ...errors, email: error });
                  }}
                />
                {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
              </div>

              <div className="animate-fade-in-up delay-500">
                <input
                  className="w-full rounded-xl border border-white/15 bg-black/25 px-3 py-2.5 text-sm text-foreground placeholder:text-foreground/45 transition-all duration-300 hover:border-accent/40 focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/30"
                  name="role"
                  placeholder="Role (Recruiter, Engineer, Founder, etc.)"
                  value={roleValue}
                  onChange={(e) => setRoleValue(e.target.value)}
                />
              </div>

              <div className="animate-fade-in-up delay-600">
                <textarea
                  className={`w-full resize-none rounded-xl border bg-black/25 px-3 py-2.5 text-sm text-foreground placeholder:text-foreground/45 transition-all duration-300 hover:border-accent/40 focus:outline-none focus:ring-2 ${errors.message ? "border-red-500 focus:border-red-500 focus:ring-red-500/40" : "border-white/15 focus:border-accent/60 focus:ring-accent/30"}`}
                  name="message"
                  placeholder="What are you building and where can I help?"
                  rows={6}
                  required
                  value={messageValue}
                  onChange={(e) => {
                    setMessageValue(e.target.value);
                    if (errors.message) {
                      setErrors({ ...errors, message: undefined });
                    }
                  }}
                  onBlur={(e) => {
                    const error = validateMessage(e.target.value);
                    if (error) setErrors({ ...errors, message: error });
                  }}
                />
                <div className="mt-1 flex items-center justify-between">
                  {errors.message ? <p className="text-xs text-red-400">{errors.message}</p> : <span className="text-xs text-foreground/45">Minimum 10 characters</span>}
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/45">{messageValue.trim().length} chars</span>
                </div>
              </div>

              <div className="animate-fade-in-up delay-700">
                <button
                  type="submit"
                  disabled={sendState === "submitting"}
                  className={`rounded-xl border px-6 py-2.5 font-mono text-[11px] uppercase tracking-[0.24em] transition-all duration-300 ${
                    sendState === "submitting"
                      ? "cursor-not-allowed border-accent/80 bg-accent/35 text-cyan-50 shadow-[0_0_24px_var(--accent-glow)]"
                      : sendState === "success"
                        ? "cursor-pointer border-emerald-400/75 bg-emerald-400/20 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.35)]"
                        : sendState === "error"
                          ? "cursor-pointer border-red-400/75 bg-red-400/15 text-red-100 shadow-[0_0_18px_rgba(248,113,113,0.28)]"
                          : "cursor-pointer border-accent/55 bg-accent/15 text-accent hover:border-accent/80 hover:bg-accent/25 hover:shadow-[0_0_24px_var(--accent-glow)] active:scale-95"
                  }`}
                >
                  <span className="inline-flex min-w-[132px] items-center justify-center gap-2">
                    {sendState === "submitting" && (
                      <span className="inline-flex items-center gap-1" aria-hidden="true">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-100 animate-pulse" />
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-100 animate-pulse" style={{ animationDelay: "0.15s" }} />
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-100 animate-pulse" style={{ animationDelay: "0.3s" }} />
                      </span>
                    )}
                    {sendState === "idle" && "Send Signal"}
                    {sendState === "submitting" && "Sending"}
                    {sendState === "success" && "Sent"}
                    {sendState === "error" && "Retry Send"}
                  </span>
                </button>
              </div>

              {status && (
                <div className={`rounded-lg border px-3 py-2 text-xs sm:text-sm animate-fade-in delay-800 ${status.includes("Thanks") ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200" : "border-red-400/30 bg-red-400/10 text-red-200"}`}>
                  {status}
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}


