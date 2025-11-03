"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { projects } from "@/data/projects";
import { publications } from "@/data/publications";
import { Loading } from "@/components/Loading";

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
    <main className="py-8 sm:py-12 lg:py-16">
      <section className="mb-8 sm:mb-10">
        <p className="text-xs sm:text-sm uppercase tracking-widest text-foreground/60 animate-fade-in">MSCS &ndash; Rutgers University &ndash; New Brunswick &ndash; Software/Systems track</p>
        <h1 className="mt-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight animate-fade-in-up leading-tight">Hi — I'm Rishabh. I build scalable systems and ML &ndash; Enabled applications.</h1>
        <p className="mt-3 sm:mt-4 text-foreground/80 max-w-2xl text-sm sm:text-base animate-fade-in-up delay-200">Systems engineer with a B.Tech in Artificial Intelligence & Data Science — I design backend systems, distributed pipelines, and ML &ndash; Powered tools that scale to real users.</p>
        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-2 sm:gap-3 animate-fade-in-up delay-300">
          <Link 
            href="/projects" 
            className="px-4 py-2.5 rounded-md bg-foreground text-background text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_25px_rgba(237,237,237,0.3)] hover:-translate-y-1 active:scale-95 text-center"
          >
            View projects
          </Link>
          <a 
            href="/resume.pdf" 
            className="px-4 py-2.5 rounded-md border text-sm font-medium transition-all duration-300 hover:bg-foreground/5 hover:border-foreground/30 hover:scale-105 active:scale-95 text-center"
          >
            Download résumé
          </a>
        </div>
        <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 animate-fade-in-up delay-400">
          <div className="rounded-lg border p-3 sm:p-4 transition-all duration-300 hover:border-foreground/30 hover:bg-foreground/5 hover:scale-[1.02] hover:shadow-lg group cursor-pointer">
            <div className="font-medium text-sm sm:text-base group-hover:text-foreground transition-colors duration-300">AI/ML</div>
            <p className="text-xs sm:text-sm text-foreground/70 mt-1 group-hover:text-foreground/80 transition-colors duration-300">Computer vision, NLP, deep learning, 98.73% accuracy in music genre detection, YOLO11s for traffic violation detection.</p>
          </div>
          <div className="rounded-lg border p-3 sm:p-4 transition-all duration-300 hover:border-foreground/30 hover:bg-foreground/5 hover:scale-[1.02] hover:shadow-lg group cursor-pointer">
            <div className="font-medium text-sm sm:text-base group-hover:text-foreground transition-colors duration-300">Full-stack & AR/VR</div>
            <p className="text-xs sm:text-sm text-foreground/70 mt-1 group-hover:text-foreground/80 transition-colors duration-300">Django, NextJS, Streamlit, AR interaction platforms, voice assistants, IoT integration with Raspberry Pi.</p>
          </div>
          <div className="rounded-lg border p-3 sm:p-4 transition-all duration-300 hover:border-foreground/30 hover:bg-foreground/5 hover:scale-[1.02] hover:shadow-lg group cursor-pointer sm:col-span-2 lg:col-span-1">
            <div className="font-medium text-sm sm:text-base group-hover:text-foreground transition-colors duration-300">Systems & Tools</div>
            <p className="text-xs sm:text-sm text-foreground/70 mt-1 group-hover:text-foreground/80 transition-colors duration-300">Real-time processing, automated systems, Docker, Azure cloud, Git workflow, VS Code development.</p>
          </div>
        </div>
      </section>

      {featured && (
        <section className="mt-6 sm:mt-8 animate-fade-in-up delay-500">
          <h2 className="text-lg sm:text-xl font-semibold mb-3">Featured Project</h2>
          <div className="rounded-lg border p-4 sm:p-5 transition-all duration-300 hover:border-foreground/30 hover:bg-foreground/5 hover:shadow-lg group">
            <div className="flex items-start justify-between gap-3 sm:gap-4 flex-col lg:flex-row">
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-semibold group-hover:text-foreground transition-colors duration-300 leading-tight">{featured.title}</h3>
                <p className="text-sm text-foreground/80 mt-1 group-hover:text-foreground/90 transition-colors duration-300">{featured.tagline}</p>
                {featured.impact && (
                  <p className="text-xs sm:text-sm text-foreground/70 mt-2 group-hover:text-foreground/80 transition-colors duration-300">{featured.impact}</p>
                )}
                <div className="mt-3 flex flex-wrap gap-1.5 sm:gap-2 cursor-default">
                  {featured.tech.map((t) => (
                    <span 
                      key={t} 
                      className="text-xs px-2 py-1 rounded-full border transition-all duration-300 hover:bg-foreground/10 hover:border-foreground/30 hover:scale-105 cursor-pointer"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex-shrink-0 mt-3 lg:mt-0">
                <Link 
                  href={`/projects/${featured.slug}`} 
                  className="relative group/link text-sm font-medium transition-all duration-300 hover:scale-105 inline-block"
                >
                  Details →
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-foreground transition-all duration-300 group-hover/link:w-full"></span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {featuredPublication && (
        <section className="mt-6 sm:mt-8 animate-fade-in-up delay-600">
          <h2 className="text-lg sm:text-xl font-semibold mb-3">Featured Publication</h2>
          <div className="rounded-lg border p-4 sm:p-5 transition-all duration-300 hover:border-foreground/30 hover:bg-foreground/5 hover:shadow-lg group">
            <div className="flex items-start justify-between gap-3 sm:gap-4 flex-col lg:flex-row">
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-semibold group-hover:text-foreground transition-colors duration-300 leading-tight">{featuredPublication.title}</h3>
                <p className="text-sm text-foreground/80 mt-1 group-hover:text-foreground/90 transition-colors duration-300">{featuredPublication.venue} ({featuredPublication.year})</p>
                <p className="text-xs sm:text-sm text-foreground/70 mt-1 group-hover:text-foreground/80 transition-colors duration-300">Authors: {featuredPublication.authors.join(", ")}</p>
                {featuredPublication.abstract && (
                  <p className="text-xs sm:text-sm text-foreground/70 mt-2 group-hover:text-foreground/80 transition-colors duration-300">{featuredPublication.abstract}</p>
                )}
              </div>
              <div className="flex-shrink-0 mt-3 lg:mt-0">
                <Link 
                  href="/publications" 
                  className="relative group/link text-sm font-medium transition-all duration-300 hover:scale-105 inline-block"
                >
                  View all publications →
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-foreground transition-all duration-300 group-hover/link:w-full"></span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
