// "use client";
// import { getTechIcon } from "@/data/techstack";

// interface TechPillsProps {
//   techs: string[];
//   className?: string;
//   animationDelay?: number;
//   showIcons?: boolean;
// }

// export function TechPills({ techs, className = "", animationDelay = 0, showIcons = true }: TechPillsProps) {
//   return (
//     <>
//       {techs.map((tech, index) => {
//         const Icon = showIcons ? getTechIcon(tech) : null;
        
//         return (
//           <span
//             key={tech}
//             className={`inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-md border cursor-pointer transition-all duration-300 hover:bg-foreground/5 hover:scale-105 hover:shadow-[0_2px_8px_rgba(237,237,237,0.1)] animate-fade-in-up ${className}`}
//             style={{ animationDelay: `${animationDelay + index * 0.1}s` }}
//           >
//             {/* {Icon && (
//               <span className="inline-flex items-center shrink-0">
//                 <Icon className="w-2.5 h-2.5" />
//               </span>
//             )} */}
//             {Icon && (
//                 <span className="inline-flex items-center shrink-0">
//                     <Icon
//                     className={
//                         tech === "Java"
//                         ? "w-3.5 h-3.5"     // slightly bigger for Java
//                         : "w-3 h-3" // default for others
//                     }
//                     />
//                 </span>
//                 )}
//             <span>{tech}</span>
//           </span>
//         );
//       })}
//     </>
//   );
// }

"use client";
import { getTechIcon } from "@/data/techstack";

interface TechPillsProps {
  techs: string[];
  className?: string;
  animationDelay?: number;
  showIcons?: boolean;
}

export function TechPills({
  techs,
  className = "",
  animationDelay = 0,
  showIcons = true,
}: TechPillsProps) {
  return (
    <>
      {techs.map((tech, index) => {
        const Icon = showIcons ? getTechIcon(tech) : null;

        return (
          <span
            key={tech}
            className={`inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-md border cursor-pointer transition-all duration-300 hover:bg-foreground/5 hover:scale-105 hover:shadow-[0_2px_8px_rgba(237,237,237,0.1)] animate-fade-in-up ${className}`}
            style={{ animationDelay: `${animationDelay + index * 0.1}s` }}
          >
            {Icon && (
              <span className="inline-flex items-center shrink-0">
                <Icon
                  className={
                    tech === "Java"
                      ? "w-3 h-3 relative"
                      : "w-2.5 h-2.5 relative"
                  }
                />
              </span>
            )}
            <span className="leading-none">{tech}</span>
          </span>
        );
      })}
    </>
  );
}
