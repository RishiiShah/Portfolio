"use client";
import { useState } from "react";
import { Loading } from "@/components/Loading";
import { SmartBackButton } from "@/components/SmartBackButton";
import type { Project } from "@/types";

interface ProjectDetailClientProps {
  project: Project;
}

export function ProjectDetailClient({ project }: ProjectDetailClientProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const isFromProjects = typeof document !== "undefined" && document.referrer.includes("/projects");

  const handleLoadingComplete = () => {
    setIsLoading(false);
    // Small delay to ensure smooth transition
    setTimeout(() => setShowContent(true), 100);
  };

  const handleLoadingFinish = () => {
    handleLoadingComplete();
  };

  if (isLoading) {
    return <Loading onComplete={handleLoadingFinish} minDurationMs={isFromProjects ? 1300 : 2200} />;
  }

  return (
    <main className={`py-8 sm:py-12 transition-opacity duration-500 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
      <SmartBackButton className="mb-6" />
      <h1 className="text-xl sm:text-2xl font-semibold leading-tight animate-fade-in-up">{project.title}</h1>
      <p className="mt-2 text-sm sm:text-base text-foreground/80 animate-fade-in-up delay-200">{project.tagline}</p>
      {project.impact && (
        <p className="mt-2 text-xs sm:text-sm text-foreground/70 animate-fade-in-up delay-300">
          Impact: {project.impact}
        </p>
      )}

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 lg:gap-8">
        <section className="space-y-6 animate-fade-in-up delay-400">
          {project.problem && (
            <div>
              <h2 className="font-semibold">Problem</h2>
              <p className="text-sm mt-1 text-foreground/80">
                {project.problem}
              </p>
            </div>
          )}
          {project.role && (
            <div>
              <h2 className="font-semibold">Role</h2>
              <p className="text-sm mt-1 text-foreground/80">{project.role}</p>
            </div>
          )}
          {project.architectureNotes?.length ? (
            <div>
              <h2 className="font-semibold">Architecture</h2>
              <ul className="mt-1 text-sm text-foreground/80 list-disc pl-5 space-y-1">
                {project.architectureNotes.map((n, index) => (
                  <li key={n} className="animate-fade-in-up" style={{animationDelay: `${0.5 + index * 0.1}s`}}>{n}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {project.challenges?.length ? (
            <div>
              <h2 className="font-semibold">Challenges & solutions</h2>
              <ul className="mt-1 text-sm text-foreground/80 list-disc pl-5 space-y-1">
                {project.challenges.map((n, index) => (
                  <li key={n} className="animate-fade-in-up" style={{animationDelay: `${0.6 + index * 0.1}s`}}>{n}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {project.lessons?.length ? (
            <div>
              <h2 className="font-semibold">Lessons / next steps</h2>
              <ul className="mt-1 text-sm text-foreground/80 list-disc pl-5 space-y-1">
                {project.lessons.map((n, index) => (
                  <li key={n} className="animate-fade-in-up" style={{animationDelay: `${0.7 + index * 0.1}s`}}>{n}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
        <aside className="space-y-4 lg:space-y-6 animate-fade-in-up delay-500">
          <div className="rounded-lg border p-3 sm:p-4 transition-all duration-300 hover:border-foreground/30 hover:shadow-[0_4px_12px_rgba(237,237,237,0.1)]">
            <div className="text-sm font-medium">Tech</div>
            <div className="mt-2 flex flex-wrap gap-1.5 sm:gap-2">
              {project.tech.map((t, index) => (
                <span
                  key={t}
                  className="text-xs px-2 py-1 rounded-full border cursor-pointer transition-all duration-300 hover:bg-foreground/5 hover:scale-105 hover:shadow-[0_2px_8px_rgba(237,237,237,0.1)] animate-fade-in-up"
                  style={{animationDelay: `${0.6 + index * 0.1}s`}}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          {project.metrics?.length ? (
            <div className="rounded-lg border p-3 sm:p-4 transition-all duration-300 hover:border-foreground/30 hover:shadow-[0_4px_12px_rgba(237,237,237,0.1)]">
              <div className="text-sm font-medium">Metrics</div>
              <ul className="mt-2 text-xs sm:text-sm text-foreground/80 space-y-1">
                {project.metrics.map((m, index) => (
                  <li
                    key={m.label}
                    className="flex justify-between animate-fade-in-up"
                    style={{animationDelay: `${0.7 + index * 0.1}s`}}
                  >
                    <span>{m.label}</span>
                    <span>{m.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {project.links?.length ? (
            <div className="rounded-lg border p-3 sm:p-4 transition-all duration-300 hover:border-foreground/30 hover:shadow-[0_4px_12px_rgba(237,237,237,0.1)]">
              <div className="text-sm font-medium">Links</div>
              <ul className="mt-2 text-xs sm:text-sm space-y-1">
                {project.links.map((l, index) => (
                  <li key={l.url} className="animate-fade-in-up" style={{animationDelay: `${0.8 + index * 0.1}s`}}>
                    <a
                      className="underline underline-offset-4 hover:text-foreground/80 transition-all duration-300 hover:scale-105"
                      href={l.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {l.type}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>
      </div>
    </main>
  );
}
