"use client";
import { useState } from "react";

export default function ContactPage() {
  const [status, setStatus] = useState<string | null>(null);
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

    setErrors({});
    setStatus(null);

    const data = new FormData(e.currentTarget);
    try {
      const res = await fetch("https://formspree.io/f/movyqpkr", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });

      // Formspree returns 200 OK on success, even if there are validation errors
      // Check for both status and response data
      if (res.ok) {
        try {
          const responseData = await res.json();
          // Formspree success responses typically have a 'next' field or are just 200 OK
          if (responseData.next || responseData.ok !== false) {
            setStatus("Thanks — I'll get back to you.");
            // Reset form and all state values
            setNameValue("");
            setEmailValue("");
            setRoleValue("");
            setMessageValue("");
            e.currentTarget.reset();
          } else {
            setStatus("Something went wrong. Please email me.");
          }
        } catch {
          // If response is not JSON but status is OK, assume success
          if (res.status === 200 || res.status === 302) {
            setStatus("Thanks — I'll get back to you.");
            // Reset form and all state values
            setNameValue("");
            setEmailValue("");
            setRoleValue("");
            setMessageValue("");
            e.currentTarget.reset();
          } else {
            setStatus("Something went wrong. Please email me.");
          }
        }
      } else {
        setStatus("Something went wrong. Please email me.");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setStatus("Network error. Please email me.");
    }
  }

  return (
    <main className="py-[clamp(1rem,4vh,3rem)]">
      <h1 className="text-xl sm:text-2xl font-semibold animate-fade-in-up">Contact</h1>
      <p className="mt-2 text-xs sm:text-sm text-foreground/80 animate-fade-in-up delay-200">Tell me what you&apos;re working on — name, role, and a 1–2 sentence note about collaboration.</p>
      <form onSubmit={onSubmit} className="mt-6 max-w-md space-y-3 sm:space-y-4">
        <div className="animate-fade-in-up delay-300">
          <input
            className="w-full border border-foreground/20 rounded-md px-3 py-2.5 text-sm bg-background text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all duration-300 hover:border-foreground/30"
            name="name"
            placeholder="Name"
            required
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
          />
        </div>
        <div className="animate-fade-in-up delay-400">
          <input
            className={`w-full border rounded-md px-3 py-2.5 text-sm bg-background text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all duration-300 hover:border-foreground/30 ${errors.email ? 'border-red-500 focus:ring-red-500/50' : 'border-foreground/20 focus:border-accent/50'}`}
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
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>
        <div className="animate-fade-in-up delay-500">
          <input
            className="w-full border border-foreground/20 rounded-md px-3 py-2.5 text-sm bg-background text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all duration-300 hover:border-foreground/30"
            name="role"
            placeholder="Role (e.g., Recruiter, Researcher)"
            value={roleValue}
            onChange={(e) => setRoleValue(e.target.value)}
          />
        </div>
        <div className="animate-fade-in-up delay-600">
          <textarea
            className={`w-full border rounded-md px-3 py-2.5 text-sm bg-background text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all duration-300 hover:border-foreground/30 resize-none ${errors.message ? 'border-red-500 focus:ring-red-500/50' : 'border-foreground/20 focus:border-accent/50'}`}
            name="message"
            placeholder="Your message"
            rows={5}
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
          {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
        </div>
        <button className="px-4 py-2.5 rounded-md bg-foreground text-background text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_25px_rgba(237,237,237,0.3)] hover:-translate-y-1 active:scale-95 animate-fade-in-up delay-700">Send</button>
        {status && <div className="text-xs sm:text-sm text-foreground/80 animate-fade-in delay-800">{status}</div>}
      </form>
      <div className="mt-6 text-xs sm:text-sm animate-fade-in-up delay-900">
        <a className="underline underline-offset-4 hover:text-foreground/80 transition-all duration-300 hover:scale-105 break-all" href="mailto:rishabh.shah033@djsce.edu.in">rishabh.shah033@djsce.edu.in</a>
      </div>
    </main>
  );
}


