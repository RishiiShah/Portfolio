import { FaLinkedin, FaGithub } from 'react-icons/fa';

export function Footer() {
  return (
    <footer className="shrink-0 mt-[clamp(1rem,3vh,4rem)] border-t border-foreground/10">
      {/* <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-[clamp(0.75rem,3vh,2rem)] text-sm text-foreground/70"> */}
      <div className="mx-auto w-full max-w-5xl xl:max-w-6xl 2xl:max-w-7xl px-4 sm:px-6 lg:px-8 py-[clamp(0.75rem,3vh,2rem)] text-sm text-foreground/70">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
          <div className="text-center sm:text-left text-xs sm:text-sm">
            Built with <span className="text-red-500">❤</span> and coffee by Rishabh Shah.
          </div>
          <div className="flex space-x-4">
            <a
              href="https://www.linkedin.com/in/rishabh-shah1/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md text-foreground/70 hover:text-accent transition-[transform,color] duration-300 p-2 hover:scale-105"
              aria-label="LinkedIn"
            >
              <FaLinkedin size={18} className="sm:w-5 sm:h-5" />
            </a>
            <a
              href="https://github.com/RishiiShah"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md text-foreground/70 hover:text-accent transition-[transform,color] duration-300 p-2 hover:scale-105"
              aria-label="GitHub"
            >
              <FaGithub size={18} className="sm:w-5 sm:h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}


