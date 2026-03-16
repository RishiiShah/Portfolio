"use client";
import { useState } from "react";
import { experiences } from "@/data/experience";
import { Loading } from "@/components/Loading";
import { downloadResume } from "@/utils/downloadResume";
import { TechPills } from "@/components/TechPills";
import { techCategories } from "@/data/techstack";

export default function AboutPage() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingFinish = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <Loading onComplete={handleLoadingFinish} />;
  }

  return (
    <main className="py-8 sm:py-12">
      <h1 className="text-xl sm:text-2xl font-semibold animate-fade-in-up">About / CV</h1>
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 lg:gap-8 items-start">
        <aside className="space-y-3 lg:space-y-4 animate-fade-in-up delay-200">
          <div className="card p-3 sm:p-4">
            <div className="text-sm font-medium">Contact</div>
            <div className="text-xs sm:text-sm text-foreground/80 mt-1 break-all">rishabh.shah033@djsce.edu.in</div>
            <div className="text-xs text-foreground/60 mt-1 flex flex-wrap gap-1">
              <a href="https://github.com/RishiiShah" target="_blank" rel="noreferrer" className="underline hover:text-foreground/80 transition-all duration-300 hover:scale-105">GitHub</a> •
              <a href="https://www.linkedin.com/in/rishabh-shah1/" target="_blank" rel="noreferrer" className="underline hover:text-foreground/80 transition-all duration-300 hover:scale-105">LinkedIn</a>
            </div>
          </div>
          <div className="card p-3 sm:p-4">
            <div className="text-sm font-medium">Key facts</div>
            <ul className="text-xs sm:text-sm text-foreground/80 mt-1 space-y-1 list-disc pl-4">
              <li>MS in Computer Science &ndash; Rutgers University &ndash; New Brunswick (GPA: 3.83/4.0)</li>
              <li>B.Tech in AI &amp; Data Science with Honors in Computational Biology &ndash; University of Mumbai (GPA: 3.25/4.0)</li>
              <li>Focus: Software Engineering, Systems, AI/ML, and Full-stack Development</li>
            </ul>
          </div>
          <a href="/resume.pdf" onClick={downloadResume} className="block text-center text-xs sm:text-sm font-medium px-3 py-2 rounded-md border transition-all duration-300 hover:bg-foreground/5 hover:border-accent/40 hover:scale-[1.02] hover:shadow-lg active:scale-95 cursor-pointer">Download résumé</a>
        </aside>
        <section className="space-y-6 sm:space-y-8 animate-fade-in-up delay-300">
          <p className="text-sm sm:text-base text-foreground/90 max-w-2xl">Passionate about computer science and software development, aiming to build efficient and scalable solutions to real-world challenges through innovation. I&apos;m a Master&apos;s student at Rutgers University focused on building scalable systems and ML enabled applications.</p>

          <div>
            <h2 className="font-semibold text-sm sm:text-base">Education</h2>
            <ul className="mt-2 space-y-2 text-xs sm:text-sm">
              <li>
                <div className="font-medium text-xs sm:text-sm">Master of Science (MS) in Computer Science</div>
                <div className="text-foreground/70 text-xs sm:text-sm">Rutgers University &ndash; New Brunswick • Sep. 2025 &ndash; May. 2027</div>
                <div className="text-foreground/60 text-xs sm:text-sm">GPA: 3.83 / 4.0</div>
              </li>
              <li>
                <div className="font-medium text-xs sm:text-sm">Bachelor of Technology in Artificial Intelligence &amp; Data Science, Honors in Computational Biology</div>
                <div className="text-foreground/70 text-xs sm:text-sm">University of Mumbai • Dec. 2021 &ndash; May. 2025</div>
                <div className="text-foreground/60 text-xs sm:text-sm">GPA: 3.25 / 4.0</div>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-sm sm:text-base">Experience</h2>
            <ul className="mt-2 space-y-2 text-xs sm:text-sm">
              {experiences.map((exp) => (
                <li key={`${exp.organization}-${exp.start}`}>
                  <div className="font-medium text-xs sm:text-sm">{exp.role}</div>
                  <div className="text-foreground/70 text-xs sm:text-sm">
                    {exp.organization}{exp.location ? `, ${exp.location}` : ""} • {exp.start} – {exp.end}
                  </div>
                  {exp.summary && (
                    <div className="text-foreground/60 text-xs sm:text-sm">
                      {exp.summary}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-sm sm:text-base">Technical Skills</h2>
            <div className="mt-2 space-y-3 sm:space-y-4">
              {techCategories.map((category, categoryIndex) => (
                <div key={category.name}>
                  <div className="text-xs sm:text-sm font-medium">{category.name}</div>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-1">
                    <TechPills
                      techs={category.techs}
                      animationDelay={0.4 + categoryIndex * 0.1}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-semibold text-sm sm:text-base">Certifications & Programs</h2>
            <ul className="mt-2 space-y-1 text-xs sm:text-sm text-foreground/80">
              <li className="animate-fade-in-up delay-400">• Stanford Code in Place — Introductory programming course in Python</li>
              <li className="animate-fade-in-up delay-500">• Google AI-ML Virtual Internship — AI & ML applications</li>
              <li className="animate-fade-in-up delay-600">• Google Cloud Generative AI Virtual Internship — Generative AI with Google Cloud</li>
              <li className="animate-fade-in-up delay-700">• Govt. Certificate Course in Digital Marketing — IDEMI</li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-sm sm:text-base">Extra-Curricular Activities</h2>
            <ul className="mt-2 space-y-1 text-xs sm:text-sm text-foreground/80">
              <li className="animate-fade-in-up delay-800">• Participated in Synergy Hackathon, developed InterActiQ</li>
              <li className="animate-fade-in-up delay-900">• Designed and developed portfolio website using NextJS</li>
              <li className="animate-fade-in-up delay-1000">• Helped peers debug coding issues to improve their skills</li>
              <li className="animate-fade-in-up delay-1100">• Strengthened problem-solving by practicing LeetCode challenges</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}


