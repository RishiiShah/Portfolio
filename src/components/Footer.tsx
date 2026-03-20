import { FaLinkedin, FaGithub } from 'react-icons/fa';

export function Footer() {
  return (
    <footer className="shrink-0 mt-[clamp(2rem,5vh,6rem)] border-t border-foreground/5 bg-white/[0.01]">
      <div className="mx-auto w-full px-[4vw] sm:px-[5vw] lg:px-[6vw] py-10 flex flex-col md:flex-row justify-between items-center gap-8 text-[11px] font-mono uppercase tracking-[0.2em] text-foreground/40">
        <div className="text-center md:text-left">
          Rishabh Shah // Software & Systems
        </div>
        <div className="flex gap-10">
          <a
            href="https://www.linkedin.com/in/rishabh-shah1/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent transition-colors duration-300 flex items-center gap-2"
          >
            LinkedIn :: <FaLinkedin size={14} />
          </a>
          <a
            href="https://github.com/RishiiShah"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent transition-colors duration-300 flex items-center gap-2"
          >
            GitHub :: <FaGithub size={14} />
          </a>
        </div>
        <div className="hidden md:block">
          Rutgers University &copy; 2026
        </div>
      </div>
    </footer>
  );
}


