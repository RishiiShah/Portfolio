"use client";
import { experiences } from "@/data/experience";
import { downloadResume } from "@/utils/downloadResume";
import { TechPills } from "@/components/TechPills";
import { techCategories } from "@/data/techstack";
import { FiMail, FiGithub, FiLinkedin, FiDownload, FiTerminal, FiBriefcase, FiBookOpen, FiAward, FiActivity } from "react-icons/fi";

export default function AboutPage() {
  return (
    <main className="pb-12 sm:pb-16 lg:pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-12">
        <h1 className="text-xl sm:text-2xl font-semibold animate-fade-in-up md:w-[28%]">How I Work</h1>
        <div className="hidden md:block flex-1 border-b border-foreground/10 animate-fade-in-up" />
      </div>

      <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start relative">
        
        {/* Left Sidebar (Sticky Terminal Pane) */}
        <aside className="w-full lg:w-[28%] lg:sticky lg:top-32 space-y-8 animate-fade-in-up delay-200">
          
            {/* Identity Block */}
            <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Rishabh Shah</h2>
            <div className="text-[10px] font-mono tracking-widest text-accent uppercase flex items-center gap-2 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shadow-[0_0_5px_var(--accent-glow)]" />
              Runtime Active
            </div>
            </div>

          {/* Network Connection Block */}
          <div className="space-y-4">
            <div className="text-[10px] uppercase tracking-widest text-foreground/40 font-mono border-b border-foreground/10 pb-2 flex items-center gap-2">
              <FiTerminal className="w-3 h-3" />
              Network Links
            </div>
            <div className="space-y-3 text-xs sm:text-sm text-foreground/70 font-mono">
              <a href="mailto:rishabh.shah033@djsce.edu.in" className="flex items-center gap-3 hover:text-accent transition-colors group">
                <FiMail className="w-4 h-4 text-foreground/30 group-hover:text-accent transition-colors shrink-0" /> 
                <span className="truncate">rishabh.shah033@...</span>
              </a>
              <a href="https://github.com/RishiiShah" target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-accent transition-colors group">
                <FiGithub className="w-4 h-4 text-foreground/30 group-hover:text-accent transition-colors shrink-0" /> 
                <span className="truncate">github.com/RishiiShah</span>
              </a>
              <a href="https://www.linkedin.com/in/rishabh-shah1/" target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-accent transition-colors group">
                <FiLinkedin className="w-4 h-4 text-foreground/30 group-hover:text-accent transition-colors shrink-0" /> 
                <span className="truncate">linkedin.com/in/rishabh</span>
              </a>
            </div>
          </div>

          {/* Resume Protocol */}
          <div className="pt-2">
            <a href="/resume.pdf" onClick={downloadResume} className="w-full flex items-center justify-between card px-4 py-3.5 border-l-[3px] border-l-accent/40 hover:border-l-accent transition-all duration-300 text-[11px] font-mono uppercase tracking-widest text-foreground/80 hover:text-accent group cursor-pointer shadow-sm hover:shadow-md">
              <span>Fetch Resume.pdf</span>
              <FiDownload className="w-4 h-4 text-foreground/40 group-hover:text-accent group-hover:-translate-y-0.5 transition-all" />
            </a>
          </div>
        </aside>

        {/* Right Main Content (Data Stream) */}
        <section className="flex-1 w-full space-y-12 animate-fade-in-up delay-300">
          
          {/* Initialization Prose */}
          <div className="text-sm sm:text-base text-foreground/80 leading-relaxed text-left border-l-2 border-foreground/10 pl-4 lg:pl-6 max-w-3xl">
            I optimize for end-to-end ownership: define the problem clearly, ship quickly, instrument early, then iterate until the system is stable and genuinely useful. The projects in this portfolio are selected to show decision quality and outcomes, not just responsibilities.
          </div>

          {/* Technical Scope (Skills) */}
          <div>
            <div className="flex items-center gap-3 text-sm uppercase tracking-widest text-foreground/60 font-mono border-b border-foreground/10 pb-3 mb-6">
              <FiActivity className="w-4 h-4" /> Technical Scope
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {techCategories.map((category, categoryIndex) => (
                <div key={category.name} className="space-y-3">
                  <div className="text-xs font-mono uppercase tracking-widest text-foreground/50">{category.name}</div>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    <TechPills
                      techs={category.techs}
                      animationDelay={0.4 + categoryIndex * 0.1}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Core Architecture (Education) */}
          <div>
            <div className="flex items-center gap-3 text-sm uppercase tracking-widest text-foreground/60 font-mono border-b border-foreground/10 pb-3 mb-6">
              <FiBookOpen className="w-4 h-4" /> Core Architecture
            </div>
            <ul className="space-y-6">
              <li className="group flex flex-col md:flex-row gap-2 md:gap-6 justify-between items-start">
                <div className="flex-1">
                  <div className="font-semibold text-base text-foreground/90 group-hover:text-accent transition-colors">Master of Science (MS) in Computer Science</div>
                  <div className="text-foreground/70 text-sm mt-1">Rutgers University &ndash; New Brunswick</div>
                </div>
                <div className="flex flex-col items-start md:items-end shrink-0">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-accent/90 border border-accent/20 bg-accent/10 px-2.5 py-1 rounded shadow-[0_0_10px_var(--accent-glow)]">Sep 2025 &ndash; May 2027</div>
                  <div className="text-foreground/50 text-xs font-mono mt-2">GPA: 3.83 / 4.0</div>
                </div>
              </li>
              <li className="group flex flex-col md:flex-row gap-2 md:gap-6 justify-between items-start">
                <div className="flex-1">
                  <div className="font-semibold text-base text-foreground/90 group-hover:text-accent transition-colors">B.Tech in AI &amp; Data Science, Honors in Computational Biology</div>
                  <div className="text-foreground/70 text-sm mt-1">University of Mumbai</div>
                </div>
                <div className="flex flex-col items-start md:items-end shrink-0">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-accent/90 border border-accent/20 bg-accent/10 px-2.5 py-1 rounded shadow-[0_0_10px_var(--accent-glow)]">Dec 2021 &ndash; May 2025</div>
                  <div className="text-foreground/50 text-xs font-mono mt-2">CGPA: 7.76 / 10.0</div>
                </div>
              </li>
            </ul>
          </div>

          {/* Operational Logs (Experience Preview) */}
          <div>
            <div className="flex items-center gap-3 text-sm uppercase tracking-widest text-foreground/60 font-mono border-b border-foreground/10 pb-3 mb-6">
              <FiBriefcase className="w-4 h-4" /> Operational Logs
            </div>
            <ul className="space-y-6">
              {experiences.map((exp) => (
                <li key={`${exp.organization}-${exp.start}`} className="group relative pl-4 border-l-2 border-foreground/10 hover:border-accent/40 transition-colors">
                  <div className="font-semibold text-base text-foreground/90 group-hover:text-accent transition-colors">{exp.role}</div>
                  <div className="text-foreground/70 text-sm mt-0.5 mb-2">
                    {exp.organization}{exp.location ? `, ${exp.location}` : ""}
                  </div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-accent/90 bg-accent/10 border border-accent/20 px-2.5 py-1 rounded shadow-[0_0_10px_var(--accent-glow)] shadow-accent/5 mb-3 inline-block">
                    {exp.start} – {exp.end}
                  </div>
                  {exp.summary && (
                    <div className="text-foreground/60 text-sm leading-relaxed max-w-2xl">
                      {exp.summary}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Output Modules (Extracurricular & Certs) */}
          <div>
            <div className="flex items-center gap-3 text-sm uppercase tracking-widest text-foreground/60 font-mono border-b border-foreground/10 pb-3 mb-6">
              <FiAward className="w-4 h-4" /> Output Modules
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              <div>
                <h3 className="text-xs font-mono uppercase tracking-widest text-foreground/50 mb-4">Certifications</h3>
                <ul className="space-y-3 text-sm text-foreground/80">
                  <li className="flex items-start gap-2 group"><span className="text-foreground/35 group-hover:text-accent transition-colors">▸</span> Stanford Code in Place — Python course</li>
                  <li className="flex items-start gap-2 group"><span className="text-foreground/35 group-hover:text-accent transition-colors">▸</span> Google AI-ML Virtual Internship</li>
                  <li className="flex items-start gap-2 group"><span className="text-foreground/35 group-hover:text-accent transition-colors">▸</span> Google Gen AI Virtual Internship</li>
                  <li className="flex items-start gap-2 group"><span className="text-foreground/35 group-hover:text-accent transition-colors">▸</span> Govt. Certification in Digital Marketing</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-mono uppercase tracking-widest text-foreground/50 mb-4">Extracurriculars</h3>
                <ul className="space-y-3 text-sm text-foreground/80">
                  <li className="flex items-start gap-2 group"><span className="text-foreground/35 group-hover:text-accent transition-colors">▸</span> Synergy Hackathon (InterActiQ)</li>
                  <li className="flex items-start gap-2 group"><span className="text-foreground/35 group-hover:text-accent transition-colors">▸</span> Peer Mentorship & Code Debugging</li>
                  <li className="flex items-start gap-2 group"><span className="text-foreground/35 group-hover:text-accent transition-colors">▸</span> Competitive Algorithmic Challenges</li>
                  <li className="flex items-start gap-2 group"><span className="text-foreground/35 group-hover:text-accent transition-colors">▸</span> Open Source UI Engineering (Portfolio)</li>
                </ul>
              </div>
            </div>
          </div>

        </section>
      </div>
    </main>
  );
}


