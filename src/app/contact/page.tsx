"use client";
import { useState, useEffect } from "react";
import { Loading } from "@/components/Loading";

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    // Small delay to ensure smooth transition
    setTimeout(() => setShowContent(true), 100);
  };

  const handleLoadingFinish = () => {
    handleLoadingComplete();
  };

  if (isLoading) {
    return <Loading onComplete={handleLoadingFinish} />;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    try {
      const res = await fetch("https://formspree.io/f/mayvlwzz", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      if (res.ok) setStatus("Thanks — I'll get back to you.");
      else setStatus("Something went wrong. Please email me.");
    } catch {
      setStatus("Network error. Please email me.");
    }
  }

  return (
    <main className={`py-[clamp(1rem,4vh,3rem)] transition-opacity duration-500 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
      <h1 className="text-xl sm:text-2xl font-semibold animate-fade-in-up">Contact</h1>
      <p className="mt-2 text-xs sm:text-sm text-foreground/80 animate-fade-in-up delay-200">Tell me what you're working on — name, role, and a 1–2 sentence note about collaboration.</p>
      <form onSubmit={onSubmit} className="mt-6 max-w-md space-y-3 sm:space-y-4">
        <input className="w-full border rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all duration-300 hover:border-foreground/30 animate-fade-in-up delay-300" name="name" placeholder="Name" required />
        <input className="w-full border rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all duration-300 hover:border-foreground/30 animate-fade-in-up delay-400" type="email" name="email" placeholder="Email" required />
        <input className="w-full border rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all duration-300 hover:border-foreground/30 animate-fade-in-up delay-500" name="role" placeholder="Role (e.g., Recruiter, Researcher)" />
        <textarea className="w-full border rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all duration-300 hover:border-foreground/30 resize-none animate-fade-in-up delay-600" name="message" placeholder="Your message" rows={5} required />
        <button className="px-4 py-2.5 rounded-md bg-foreground text-background text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_25px_rgba(237,237,237,0.3)] hover:-translate-y-1 active:scale-95 animate-fade-in-up delay-700">Send</button>
        {status && <div className="text-xs sm:text-sm text-foreground/80 animate-fade-in delay-800">{status}</div>}
      </form>
      <div className="mt-6 text-xs sm:text-sm animate-fade-in-up delay-900">
        <a className="underline underline-offset-4 hover:text-foreground/80 transition-all duration-300 hover:scale-105 break-all" href="mailto:rishabhshah203@gmail.com">rishabhshah203@gmail.com</a>
      </div>
    </main>
  );
}


