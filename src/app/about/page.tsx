"use client";
import { useState, useEffect } from "react";
import { Loading } from "@/components/Loading";

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
          <div className="rounded-lg border p-3 sm:p-4 transition-all duration-300 hover:border-foreground/30 hover:shadow-[0_4px_12px_rgba(237,237,237,0.1)]">
            <div className="text-sm font-medium">Contact</div>
            <div className="text-xs sm:text-sm text-foreground/80 mt-1 break-all">rishabhshah2193@gmail.com</div>
            <div className="text-xs text-foreground/60 mt-1 flex flex-wrap gap-1">
              <a href="https://github.com/RishiiShah" target="_blank" rel="noreferrer" className="underline hover:text-foreground/80 transition-all duration-300 hover:scale-105">GitHub</a> • 
              <a href="https://www.linkedin.com/in/rishabh-shah1/" target="_blank" rel="noreferrer" className="underline hover:text-foreground/80 transition-all duration-300 hover:scale-105">LinkedIn</a>
            </div>
          </div>
          <div className="rounded-lg border p-3 sm:p-4 transition-all duration-300 hover:border-foreground/30 hover:shadow-[0_4px_12px_rgba(237,237,237,0.1)]">
            <div className="text-sm font-medium">Key facts</div>
            <ul className="text-xs sm:text-sm text-foreground/80 mt-1 space-y-1 list-disc pl-4">
              <li>MSCS — Rutgers University (current)</li>
              <li>B.Tech &ndash; Dwarkadas J. Sanghvi College of Engineering — <br className="hidden sm:block"></br> AI & Data Science (7.76/10 CGPA)</li>
              <li>Honors in Computational Biology</li>
              <li>Focus: Software, Systems, AI/ML, Full-stack, AR/VR</li>
            </ul>
          </div>
          <a href="/resume.pdf" download = "rishabh-shah-resume.pdf" target = "_blank" rel = "noopener noreferrer" className="block text-center text-xs sm:text-sm font-medium px-3 py-2 rounded-md bg-foreground text-background transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_25px_rgba(237,237,237,0.3)] hover:-translate-y-1 active:scale-95">Download résumé</a>
        </aside>
        <section className="space-y-6 sm:space-y-8 animate-fade-in-up delay-300">
          <p className="text-sm sm:text-base text-foreground/90 max-w-2xl">Passionate about computer science and software development, aiming to build efficient and scalable solutions to real-world challenges through innovation. I'm a Master's student at Rutgers University focused on building scalable systems and ML enabled applications.</p>

          <div>
            <h2 className="font-semibold text-sm sm:text-base">Education</h2>
            <ul className="mt-2 space-y-2 text-xs sm:text-sm">
              <li>
                <div className="font-medium text-xs sm:text-sm">Master of Computer Science — Software/Systems Track</div>
                <div className="text-foreground/70 text-xs sm:text-sm">Rutgers University &ndash; New Brunswick • Sep 2025 &ndash; May 2027</div>
              </li>
              <li>
                <div className="font-medium text-xs sm:text-sm">B.Tech in Artificial Intelligence and Data Science with Honors in Computational Biology</div>
                <div className="text-foreground/70 text-xs sm:text-sm">Dwarkadas J. Sanghvi College of Engineering, University of Mumbai • Dec 2021 &ndash;  May 2025</div>
                <div className="text-foreground/60 text-xs sm:text-sm">CGPA: 7.76/10 (&asymp;3.25/4.0 GPA)</div>
              </li>
              <li>
                <div className="font-medium text-xs sm:text-sm">Higher Secondary Certificate (Class 12)</div>
                <div className="text-foreground/70 text-xs sm:text-sm">Maharashtra State Board • 87.67%</div>
              </li>
              <li>
                <div className="font-medium text-xs sm:text-sm">Secondary School Certificate (Class 10)</div>
                <div className="text-foreground/70 text-xs sm:text-sm">ICSE Board • 83%</div>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-sm sm:text-base">Technical Skills</h2>
            <div className="mt-2 space-y-3 sm:space-y-4">
              <div>
                <div className="text-xs sm:text-sm font-medium">Languages</div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-1">
                  {["Python", "Java", "C", "HTML", "CSS", "JavaScript"].map((lang, index) => (
                    <span key={lang} className="text-xs px-2 py-1 rounded-full border cursor-pointer transition-all duration-300 hover:bg-foreground/5 hover:scale-105 hover:shadow-[0_2px_8px_rgba(237,237,237,0.1)] animate-fade-in-up" style={{animationDelay: `${0.4 + index * 0.1}s`}}>{lang}</span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs sm:text-sm font-medium">Frameworks & Databases</div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-1">
                  {["Django", "NextJS", "Streamlit", "MySQL", "SQLite"].map((tool, index) => (
                    <span key={tool} className="text-xs px-2 py-1 rounded-full border cursor-pointer transition-all duration-300 hover:bg-foreground/5 hover:scale-105 hover:shadow-[0_2px_8px_rgba(237,237,237,0.1)] animate-fade-in-up" style={{animationDelay: `${0.5 + index * 0.1}s`}}>{tool}</span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs sm:text-sm font-medium">Tools & Platforms</div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-1">
                  {["Git", "GitHub", "Docker", "Azure", "VS Code", "MS Office"].map((tool, index) => (
                    <span key={tool} className="text-xs px-2 py-1 rounded-full border cursor-pointer transition-all duration-300 hover:bg-foreground/5 hover:scale-105 hover:shadow-[0_2px_8px_rgba(237,237,237,0.1)] animate-fade-in-up" style={{animationDelay: `${0.6 + index * 0.1}s`}}>{tool}</span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs sm:text-sm font-medium">AI/ML Technologies</div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-1">
                  {["TensorFlow", "YOLO11s", "NLP", "LLM", "Computer Vision", "Librosa", "Scikit-learn", "Google PaLM 2"].map((tech, index) => (
                    <span key={tech} className="text-xs px-2 py-1 rounded-full border cursor-pointer transition-all duration-300 hover:bg-foreground/5 hover:scale-105 hover:shadow-[0_2px_8px_rgba(237,237,237,0.1)] animate-fade-in-up" style={{animationDelay: `${0.7 + index * 0.1}s`}}>{tech}</span>
                  ))}
                </div>
              </div>
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


