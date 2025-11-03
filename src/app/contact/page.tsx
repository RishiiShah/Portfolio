"use client";
import { useState, useEffect } from "react";
import { Loading } from "@/components/Loading";

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState<string | null>(null);
  const [errors, setErrors] = useState<{email?: string; message?: string}>({});
  const [emailValue, setEmailValue] = useState("");
  const [messageValue, setMessageValue] = useState("");

  if (isLoading) {
    return <Loading onComplete={() => setIsLoading(false)} />;
  }

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
    
    const data = new FormData(e.currentTarget);
    try {
      const res = await fetch("https://formspree.io/f/mayvlwzz", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      if (res.ok) {
        setStatus("Thanks — I'll get back to you.");
        // Reset form
        setEmailValue("");
        setMessageValue("");
        e.currentTarget.reset();
      } else setStatus("Something went wrong. Please email me.");
    } catch {
      setStatus("Network error. Please email me.");
    }
  }

  return (
    <main className="py-[clamp(1rem,4vh,3rem)]">
      <h1 className="text-xl sm:text-2xl font-semibold animate-fade-in-up">Contact</h1>
      <p className="mt-2 text-xs sm:text-sm text-foreground/80 animate-fade-in-up delay-200">Tell me what you're working on — name, role, and a 1–2 sentence note about collaboration.</p>
      <form onSubmit={onSubmit} className="mt-6 max-w-md space-y-3 sm:space-y-4">
        <div className="animate-fade-in-up delay-300">
          <input 
            className="w-full border rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all duration-300 hover:border-foreground/30" 
            name="name" 
            placeholder="Name" 
            required 
          />
        </div>
        <div className="animate-fade-in-up delay-400">
          <input 
            className={`w-full border rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all duration-300 hover:border-foreground/30 ${errors.email ? 'border-red-500 focus:ring-red-500/50' : ''}`}
            type="email" 
            name="email" 
            placeholder="Email" 
            required
            value={emailValue}
            onChange={(e) => {
              setEmailValue(e.target.value);
              if (errors.email) {
                setErrors({...errors, email: undefined});
              }
            }}
            onBlur={(e) => {
              const error = validateEmail(e.target.value);
              if (error) setErrors({...errors, email: error});
            }}
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>
        <div className="animate-fade-in-up delay-500">
          <input 
            className="w-full border rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all duration-300 hover:border-foreground/30" 
            name="role" 
            placeholder="Role (e.g., Recruiter, Researcher)" 
          />
        </div>
        <div className="animate-fade-in-up delay-600">
          <textarea 
            className={`w-full border rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all duration-300 hover:border-foreground/30 resize-none ${errors.message ? 'border-red-500 focus:ring-red-500/50' : ''}`}
            name="message" 
            placeholder="Your message" 
            rows={5} 
            required
            value={messageValue}
            onChange={(e) => {
              setMessageValue(e.target.value);
              if (errors.message) {
                setErrors({...errors, message: undefined});
              }
            }}
            onBlur={(e) => {
              const error = validateMessage(e.target.value);
              if (error) setErrors({...errors, message: error});
            }}
          />
          {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
        </div>
        <button className="px-4 py-2.5 rounded-md bg-foreground text-background text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_25px_rgba(237,237,237,0.3)] hover:-translate-y-1 active:scale-95 animate-fade-in-up delay-700">Send</button>
        {status && <div className="text-xs sm:text-sm text-foreground/80 animate-fade-in delay-800">{status}</div>}
      </form>
      <div className="mt-6 text-xs sm:text-sm animate-fade-in-up delay-900">
        <a className="underline underline-offset-4 hover:text-foreground/80 transition-all duration-300 hover:scale-105 break-all" href="mailto:rishabhshah203@gmail.com">rishabhshah203@gmail.com</a>
      </div>
    </main>
  );
}


