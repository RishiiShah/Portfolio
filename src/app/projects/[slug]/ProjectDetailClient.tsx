"use client";
import { useState } from "react";
import { Loading } from "@/components/Loading";
import { SmartBackButton } from "@/components/SmartBackButton";
import { TechPills } from "@/components/TechPills";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { IconLinkButton } from "@/components/ui/IconLinkButton";
import type { Project } from "@/types";
import { categorizeTech } from "@/utils/categorizeTech";
import { formatLinkLabel, getKnownLinkIcon } from "@/utils/linkIcons";
import { FiArrowRight } from "react-icons/fi";

interface ProjectDetailClientProps {
  project: Project;
}

export function ProjectDetailClient({ project }: ProjectDetailClientProps) {
  const [isLoading, setIsLoading] = useState(true);
  const isFromProjects = typeof document !== "undefined" && document.referrer.includes("/projects");
  const groupedTech = categorizeTech(project.tech);

  if (isLoading) {
    return <Loading onComplete={() => setIsLoading(false)} minDurationMs={isFromProjects ? 800 : 1300} />;
  }

  return (
    <main className="py-8 sm:py-12">
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
              <ul className="mt-2 space-y-2">
                {project.architectureNotes.map((n, index) => (
                  <li key={n} className="text-sm text-foreground/80 leading-relaxed flex items-start gap-2.5 animate-fade-in-up" style={{ animationDelay: `${0.5 + index * 0.1}s` }}>
                    <FiArrowRight className="h-3.5 w-3.5 text-accent mt-0.5 shrink-0" aria-hidden="true" />
                    <span>{n}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {project.challenges?.length ? (
            <div>
              <h2 className="font-semibold">Challenges & solutions</h2>
              <ul className="mt-2 space-y-2">
                {project.challenges.map((n, index) => (
                  <li key={n} className="text-sm text-foreground/80 leading-relaxed flex items-start gap-2.5 animate-fade-in-up" style={{ animationDelay: `${0.6 + index * 0.1}s` }}>
                    <FiArrowRight className="h-3.5 w-3.5 text-accent mt-0.5 shrink-0" aria-hidden="true" />
                    <span>{n}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {project.lessons?.length ? (
            <div>
              <h2 className="font-semibold">Lessons / next steps</h2>
              <ul className="mt-2 space-y-2">
                {project.lessons.map((n, index) => (
                  <li key={n} className="text-sm text-foreground/80 leading-relaxed flex items-start gap-2.5 animate-fade-in-up" style={{ animationDelay: `${0.7 + index * 0.1}s` }}>
                    <FiArrowRight className="h-3.5 w-3.5 text-accent mt-0.5 shrink-0" aria-hidden="true" />
                    <span>{n}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
        <aside className="space-y-4 lg:space-y-6 animate-fade-in-up delay-500">
          <div className="px-1">
            <SectionHeader title="Tech" />
            <div className="space-y-4">
              {groupedTech.map(([groupName, techItems], index) => (
                <div key={groupName} className="animate-fade-in-up" style={{ animationDelay: `${0.6 + index * 0.1}s` }}>
                  <div className="mb-2 text-xs uppercase tracking-wide text-foreground/60">{groupName}</div>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    <TechPills techs={techItems} animationDelay={0.6 + index * 0.1} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          {project.metrics?.length ? (
            <div className="px-1">
              <SectionHeader title="Metrics" />
              <ul className="mt-2 text-xs sm:text-sm text-foreground/80 space-y-1">
                {project.metrics.map((m, index) => (
                  <li
                    key={m.label}
                    className="flex justify-between animate-fade-in-up"
                    style={{ animationDelay: `${0.7 + index * 0.1}s` }}
                  >
                    <span>{m.label}</span>
                    <span>{m.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {project.links?.length ? (
            <div className="px-1">
              <SectionHeader title="Links" />
              <div className="mt-2 flex flex-wrap gap-2">
                {project.links.map((l, index) => {
                  const Icon = getKnownLinkIcon(l.type);

                  if (Icon) {
                    return (
                      <div key={l.url} className="animate-fade-in-up" style={{ animationDelay: `${0.8 + index * 0.1}s` }}>
                        <IconLinkButton href={l.url} label={formatLinkLabel(l.type)} icon={Icon} className="px-2.5 py-1 text-[11px]" />
                      </div>
                    );
                  }

                  return (
                    <a
                      key={l.url}
                      className="text-xs sm:text-sm underline underline-offset-4 hover:text-foreground/80 transition-colors duration-300"
                      href={l.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {formatLinkLabel(l.type)}
                    </a>
                  );
                })}
              </div>
            </div>
          ) : null}
        </aside>
      </div>
    </main>
  );
}
