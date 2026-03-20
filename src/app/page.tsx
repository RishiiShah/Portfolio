"use client";
import Link from "next/link";
import { useState } from "react";
import { projects } from "@/data/projects";
import { publications } from "@/data/publications";
import { Loading } from "@/components/Loading";
import { TechPills } from "@/components/TechPills";
import { downloadResume } from "@/utils/downloadResume";
import { DepthButton } from "@/components/ui/DepthButton";
import { FiArrowRight } from "react-icons/fi";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  const featured = projects.find((p) => p.featured);
  const featuredPublication = publications.find((p) => p.featured);

  const handleLoadingFinish = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <Loading onComplete={handleLoadingFinish} />;
  }

  return (
    <main className="pb-12 sm:pb-20">
      <section className="mb-12 sm:mb-20">
        <div className="flex items-center gap-3 mb-6 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_10px_var(--accent-glow)]"></span>
          <div className="overflow-hidden">
            <p className="text-[9px] sm:text-xs font-mono uppercase tracking-widest sm:tracking-[0.3em] text-foreground/50 sm:animate-term-reveal whitespace-nowrap hidden sm:block">System :: MSCS | Rutgers University | Software & Systems</p>
            <p className="text-[9px] font-mono uppercase tracking-widest text-foreground/50 animate-term-reveal whitespace-nowrap sm:hidden">System :: MSCS | Rutgers | S&S</p>
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-tighter animate-fade-in-up leading-[1.1] max-w-4xl">
          Building products where <span className="text-accent underline decoration-accent/20 underline-offset-8">architecture</span>, <span className="text-accent/80">speed</span>, and user trust all ship together.
        </h1>
        <p className="mt-8 text-foreground/60 max-w-2xl text-base sm:text-lg animate-fade-in-up delay-200 font-medium">
          This is a project journal, not a checklist. Each build here includes the problem, constraints, trade-offs, and measurable outcomes.
        </p>
        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-2 sm:gap-3 animate-fade-in-up delay-300">
          <DepthButton
            href="/projects"
            variant="primary"
            iconRight={
              <div className="relative h-4 w-4 overflow-hidden">
                <FiArrowRight className="absolute inset-0 h-4 w-4 transition-all duration-500 ease-in-out group-hover:translate-x-full group-hover:opacity-0" />
                <FiArrowRight className="absolute inset-0 h-4 w-4 -translate-x-full opacity-0 transition-all duration-500 ease-in-out group-hover:translate-x-0 group-hover:opacity-100" />
              </div>
            }
            className="group min-w-48 justify-between rounded-[6px]! border-accent/65! bg-accent/85! px-6! py-3! tracking-[0.18em]! text-black! backdrop-blur-md ring-1 ring-white/10 shadow-[0_0_24px_var(--accent-glow),inset_0_1px_0_rgba(255,255,255,0.18)] hover:bg-accent! hover:shadow-[0_0_34px_var(--accent-glow),inset_0_1px_0_rgba(255,255,255,0.24)]"
            aria-label="View projects"
          >
            View Projects
          </DepthButton>
          <DepthButton
            href="/resume.pdf"
            onClick={downloadResume}
            variant="secondary"
            iconLeft={
              <div className="relative h-4 w-4 overflow-hidden">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <title>Download icon</title>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />

                  <g className="transition-all duration-500 ease-in-out group-hover:translate-y-full group-hover:opacity-0">
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </g>
                  <g className="translate-y-[-100%] opacity-0 transition-all duration-500 ease-in-out group-hover:translate-y-0 group-hover:opacity-100">
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </g>
                </svg>
              </div>
            }
            className="group min-w-48 justify-between rounded-[6px]! bg-transparent! px-6! py-3! tracking-[0.18em]! ring-1 border-foreground/35! text-foreground! ring-white/10 hover:border-accent/55! hover:text-accent! hover:ring-accent/30 !translate-y-0"
            aria-label="Download résumé"
          >
            <span>Download Résumé</span>
          </DepthButton>
        </div>
        <div className="mt-16 sm:mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border border-foreground/5 animate-fade-in-up delay-400">
          <div className="p-6 sm:p-8 border-b sm:border-b-0 sm:border-r border-foreground/5 border-l-2 border-l-transparent hover:border-l-accent transition-all duration-300 hover:-translate-y-0.5 group cursor-default">
            <div className="font-mono text-[10px] uppercase tracking-widest text-accent mb-2">01 // Problem First</div>
            <div className="font-bold text-lg sm:text-xl group-hover:text-accent transition-colors duration-200">I start from bottlenecks</div>
            <p className="text-sm text-foreground/60 mt-3 leading-relaxed">Every project begins with a concrete failure mode: latency spikes, fragile workflows, or poor UX under load.</p>
          </div>
          <div className="p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-foreground/5 border-l-2 border-l-transparent hover:border-l-accent transition-all duration-300 hover:-translate-y-0.5 group cursor-default">
            <div className="font-mono text-[10px] uppercase tracking-widest text-accent mb-2">02 // Delivery Style</div>
            <div className="font-bold text-lg sm:text-xl group-hover:text-accent transition-colors duration-200">Prototype fast, harden deliberately</div>
            <p className="text-sm text-foreground/60 mt-3 leading-relaxed">I move from proof-of-concept to production with instrumentation, reliability checks, and clear rollback paths.</p>
          </div>
          <div className="p-6 sm:p-8 border-l-2 border-l-transparent hover:border-l-accent transition-all duration-300 hover:-translate-y-0.5 group cursor-default sm:col-span-2 lg:col-span-1">
            <div className="font-mono text-[10px] uppercase tracking-widest text-accent mb-2">03 // What You&apos;ll See</div>
            <div className="font-bold text-lg sm:text-xl group-hover:text-accent transition-colors duration-200">Case-study depth, not bullet points</div>
            <p className="text-sm text-foreground/60 mt-3 leading-relaxed">Expect architecture decisions, trade-offs, and outcome metrics instead of generic tech-name lists.</p>
          </div>
        </div>
      </section>

      {/* Featured Project */}
      {featured && (
        <section className="mt-12 sm:mt-16 animate-fade-in-up delay-500">
          <div className="card p-5 sm:p-6 group relative overflow-hidden transition-colors hover:border-accent/30">
            <div className="absolute top-0 left-0 w-1 h-full bg-accent/20 group-hover:bg-accent/50 transition-colors" />
            <div className="pl-2">
              
              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-accent">Featured Project</span>
                <span className="font-mono text-[9px] text-foreground/30 uppercase tracking-widest hidden sm:inline-block">SYS_V1.0</span>
              </div>
              
              <div className="flex justify-between items-start gap-4 mb-2">
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight group-hover:text-accent transition-colors">{featured.title}</h3>
                <Link href={`/projects/${featured.slug}`} className="shrink-0 mt-1 text-xs font-mono uppercase tracking-widest text-foreground/50 hover:text-accent flex items-center gap-2 group/btn transition-colors">
                  View Specs <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
              
              <p className="text-sm text-foreground/60 mb-4">{featured.tagline}</p>
              
              {featured.impact && (
                <div className="mb-4 py-2 px-3 border-l-2 border-accent/20 bg-accent/5 font-mono text-xs text-foreground/50 italic">
                  &gt; {featured.impact}
                </div>
              )}
              
              <div className="flex flex-wrap gap-2 mt-4">
                <TechPills techs={featured.tech} />
              </div>

            </div>
          </div>
        </section>
      )}

      {/* Featured Publication */}
      {featuredPublication && (
        <section className="mt-6 sm:mt-8 animate-fade-in-up delay-600">
          <div className="card p-5 sm:p-6 group relative overflow-hidden transition-colors hover:border-accent/30">
            <div className="absolute top-0 left-0 w-1 h-full bg-accent/20 group-hover:bg-accent/50 transition-colors" />
            <div className="pl-2">
              
              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-accent group-hover:text-accent transition-colors">Featured Publication</span>
                <span className="font-mono text-[9px] text-foreground/30 uppercase tracking-widest hidden sm:inline-block">DOC_REF</span>
              </div>
              
              <div className="flex justify-between items-start gap-4 mb-1">
                <h3 className="text-lg sm:text-xl font-bold tracking-tight group-hover:text-accent transition-colors leading-tight">{featuredPublication.title}</h3>
                <Link href="/publications" className="shrink-0 mt-1 text-xs font-mono uppercase tracking-widest text-foreground/50 hover:text-accent flex items-center gap-2 group/btn transition-colors">
                  View Archive <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                </Link>
              </div>

              <p className="text-xs font-mono text-foreground/50 mb-3">
                {featuredPublication.venue} {" // "} {featuredPublication.publishedAt ?? featuredPublication.year}
              </p>
              
              {featuredPublication.abstract && (
                <p className="text-sm text-foreground/60 mb-3 line-clamp-2 md:line-clamp-3 leading-relaxed">
                  {featuredPublication.abstract}
                </p>
              )}
              
              <p className="text-[11px] text-foreground/40 font-mono">
                Authors: {featuredPublication.authors.join(", ")}
              </p>

            </div>
          </div>
        </section>
      )}
    </main>
  );
}
