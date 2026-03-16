"use client";
import Link from "next/link";
import { useState } from "react";
import { projects } from "@/data/projects";
import { experiences } from "@/data/experience";
import { Loading } from "@/components/Loading";
import { TechPills } from "@/components/TechPills";
import { downloadResume } from "@/utils/downloadResume";
import { DepthButton } from "@/components/ui/DepthButton";
import { FiArrowRight, FiDownload, FiGithub, FiExternalLink } from "react-icons/fi";
import { FaLinkedin } from "react-icons/fa";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingFinish = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <Loading onComplete={handleLoadingFinish} />;
  }

  const trafficProject = projects.find((p) => p.slug === "traffic-violation-detection");
  const jarvisProject = projects.find((p) => p.slug === "jarvis-voice-assistant");

  return (
    <main className="py-8 sm:py-12 lg:py-16">
      {/* Hero Section */}
      <section className="mb-12 sm:mb-16 lg:mb-20">
        <div className="animate-fade-in-up">
          <p className="text-xs sm:text-sm uppercase tracking-widest text-foreground/60 mb-3">MS Computer Science &ndash; Rutgers • Software & Systems</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-4">
            Systems engineer building <span className="text-accent">production-scale</span> ML and backend applications.
          </h1>
          <p className="text-base sm:text-lg text-foreground/80 max-w-3xl mb-6 leading-relaxed">
            I design and ship distributed systems, computer vision pipelines, and real-time applications that work at scale. Proven track record: 93.76% vision accuracy, sub-300ms latency, 90% reduction in manual effort.
          </p>
        </div>

        {/* Primary & Secondary CTAs */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 animate-fade-in-up delay-200">
          <DepthButton
            href="/resume.pdf"
            onClick={downloadResume}
            iconLeft={<FiDownload className="h-4 w-4" aria-hidden="true" />}
            className="group cursor-pointer"
            aria-label="Download résumé"
          >
            Download résumé
          </DepthButton>
          <DepthButton
            href="/projects"
            iconRight={<FiArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />}
            variant="secondary"
            className="group"
            aria-label="View case studies"
          >
            View case studies
          </DepthButton>
          <DepthButton
            href="/contact"
            variant="secondary"
            className="group"
            aria-label="Get in touch"
          >
            Get in touch
          </DepthButton>
        </div>

        {/* Trust Strip */}
        <div className="mt-8 flex flex-wrap items-center gap-4 sm:gap-6 animate-fade-in-up delay-300 text-xs sm:text-sm text-foreground/70">
          <a
            href="https://github.com/RishiiShah"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 hover:text-accent transition-colors duration-300"
            aria-label="GitHub"
          >
            <FiGithub className="w-4 h-4" />
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/rishabh-shah1/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 hover:text-accent transition-colors duration-300"
            aria-label="LinkedIn"
          >
            <FaLinkedin className="w-4 h-4" />
            LinkedIn
          </a>
          <Link
            href="/publications"
            className="inline-flex items-center gap-2 hover:text-accent transition-colors duration-300"
          >
            <FiExternalLink className="w-4 h-4" />
            Publications
          </Link>
        </div>
      </section>

      {/* Experience Highlights */}
      <section className="mb-12 sm:mb-16">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 animate-fade-in-up">Current Role</h2>
        <div className="space-y-3 animate-fade-in-up delay-200">
          {experiences.slice(0, 1).map((exp) => (
            <div key={`${exp.organization}-${exp.start}`} className="card p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                <h3 className="font-semibold text-sm sm:text-base">{exp.role}</h3>
                <span className="text-xs text-foreground/60">{exp.start} – {exp.end}</span>
              </div>
              <p className="text-xs sm:text-sm text-foreground/80">{exp.organization}{exp.location ? `, ${exp.location}` : ""}</p>
              {exp.summary && <p className="text-xs sm:text-sm text-foreground/70 mt-2">{exp.summary}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* Featured Project 1: Traffic Violation */}
      {trafficProject && (
        <section className="mb-12 sm:mb-16">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 animate-fade-in-up">Featured: Computer Vision at Scale</h2>
          <div className="card p-4 sm:p-6 group animate-fade-in-up delay-200">
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-semibold group-hover:text-accent transition-colors duration-300 leading-tight">{trafficProject.title}</h3>
                <p className="text-sm text-foreground/80 mt-2">{trafficProject.tagline}</p>
                
                {trafficProject.impact && (
                  <p className="text-xs sm:text-sm text-accent/80 mt-3 font-medium">▲ {trafficProject.impact}</p>
                )}

                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {trafficProject.metrics?.slice(0, 3).map((m) => (
                    <div key={m.label} className="bg-foreground/5 rounded-md p-2 sm:p-3">
                      <div className="text-xs text-foreground/60">{m.label}</div>
                      <div className="text-sm sm:text-base font-semibold text-accent mt-1">{m.value}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/projects/${trafficProject.slug}`}
                    className="text-xs sm:text-sm font-medium text-accent hover:underline inline-flex items-center gap-1"
                  >
                    Read case study <FiArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              <div className="hidden lg:block lg:w-48">
                <div className="space-y-2">
                  <div className="text-xs uppercase tracking-wide text-foreground/60 font-medium">Stack</div>
                  <div className="flex flex-wrap gap-1">
                    <TechPills techs={["Python", "YOLO11s", "Django", "AWS"]} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Project 2: JARVIS */}
      {jarvisProject && (
        <section className="mb-12 sm:mb-16">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 animate-fade-in-up">Featured: Real-time Systems</h2>
          <div className="card p-4 sm:p-6 group animate-fade-in-up delay-200">
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-semibold group-hover:text-accent transition-colors duration-300 leading-tight">{jarvisProject.title}</h3>
                <p className="text-sm text-foreground/80 mt-2">{jarvisProject.tagline}</p>

                {jarvisProject.impact && (
                  <p className="text-xs sm:text-sm text-accent/80 mt-3 font-medium">▲ {jarvisProject.impact}</p>
                )}

                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {jarvisProject.metrics?.slice(0, 3).map((m) => (
                    <div key={m.label} className="bg-foreground/5 rounded-md p-2 sm:p-3">
                      <div className="text-xs text-foreground/60">{m.label}</div>
                      <div className="text-sm sm:text-base font-semibold text-accent mt-1">{m.value}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/projects/${jarvisProject.slug}`}
                    className="text-xs sm:text-sm font-medium text-accent hover:underline inline-flex items-center gap-1"
                  >
                    Read case study <FiArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              <div className="hidden lg:block lg:w-48">
                <div className="space-y-2">
                  <div className="text-xs uppercase tracking-wide text-foreground/60 font-medium">Stack</div>
                  <div className="flex flex-wrap gap-1">
                    <TechPills techs={["Django", "Llama-3", "Azure IoT", "Raspberry Pi"]} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="mt-16 py-8 sm:py-12 border-t border-foreground/10 animate-fade-in-up delay-400">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-lg sm:text-2xl font-semibold mb-3">Looking to collaborate?</h2>
          <p className="text-sm sm:text-base text-foreground/80 mb-6">I'm interested in internships, full-time roles, and research opportunities. Let's talk about your next scaling challenge.</p>
          <DepthButton
            href="/contact"
            aria-label="Start a conversation"
          >
            Start a conversation
          </DepthButton>
        </div>
      </section>
    </main>
  );
}
