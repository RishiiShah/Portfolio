import type React from "react";
import { JavaIcon } from "@/components/icons/JavaIcon";
import {
  SiPython,
//   SiOpenjdk,
  SiCplusplus,
  SiC,
  SiMysql,
  SiPostgresql,
  SiMongodb,
  SiNextdotjs,
  SiFlask,
  SiDjango,
  SiFastapi,
  SiAmazonwebservices,
  SiDocker,
  SiGithubactions,
  SiGit,
  SiLinux,
  SiTensorflow,
  SiPytorch,
  SiOpencv,
  SiNodedotjs,
  SiDiscord,
  SiStreamlit,
  SiBootstrap,
  SiGooglecloud,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiDatabricks,
} from "react-icons/si";

// Tech icon mapping - maps tech names to their Simple Icons
export const techIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  // Programming Languages
  Python: SiPython,
  Java: JavaIcon,
  "C++": SiCplusplus,
  C: SiC,
  SQL: SiDatabricks, // Using MySQL icon as generic SQL icon
  JavaScript: SiJavascript,
  TypeScript: SiTypescript,
  
  // Databases
  MySQL: SiMysql,
  PostgreSQL: SiPostgresql,
  MongoDB: SiMongodb,
  
  // Frameworks & Libraries
  "Next.js": SiNextdotjs,
  NextJS: SiNextdotjs,
  Flask: SiFlask,
  Django: SiDjango,
  FastAPI: SiFastapi,
  "Node.js": SiNodedotjs,
  NodeJS: SiNodedotjs,
  React: SiReact,
  Streamlit: SiStreamlit,
  Bootstrap: SiBootstrap,
  
  // Cloud & DevOps
  AWS: SiAmazonwebservices,
  "AWS (EC2, S3, Lambda)": SiAmazonwebservices,
  Docker: SiDocker,
  "CI/CD • GitHub Actions": SiGithubactions,
  Git: SiGit,
  "Linux/Unix": SiLinux,
  
  // ML/AI
  TensorFlow: SiTensorflow,
  PyTorch: SiPytorch,
  OpenCV: SiOpencv,
  
  // Other
  "discord.js": SiDiscord,
  Discord: SiDiscord,
};

// Tech stack categories for the about page
export interface TechCategory {
  name: string;
  techs: string[];
}

export const techCategories: TechCategory[] = [
  {
    name: "Programming & Scripting",
    techs: ["Python", "Java", "C++", "C", "SQL"],
  },
  {
    name: "Full-Stack Development",
    techs: ["Next.js", "Flask", "Django", "FastAPI", "REST APIs", "Microservices", "JWT Authentication"],
  },
  {
    name: "Databases & Data Handling",
    techs: ["MySQL", "PostgreSQL", "MongoDB", "Schema Design", "Query Optimization", "Data Modeling"],
  },
  {
    name: "Cloud & DevOps",
    techs: ["AWS (EC2, S3, Lambda)", "Docker", "CI/CD • GitHub Actions", "Git", "Linux/Unix", "System Monitoring"],
  },
  {
    name: "Additional Technologies",
    techs: ["TensorFlow", "PyTorch", "YOLOv12", "OpenCV", "OCR & ANPR"],
  },
];

// Helper function to get icon for a tech name
export function getTechIcon(techName: string): React.ComponentType<{ className?: string }> | null {
  return techIcons[techName] || null;
}

