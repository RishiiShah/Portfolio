import type React from "react";
import { JavaIcon } from "@/components/icons/JavaIcon";
import { FaMicrosoft } from "react-icons/fa";
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
  SiAmazons3,
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
  SiJavascript,
  SiTypescript,
  SiReact,
  SiDatabricks,
  SiGooglecloud,
  SiKeras,
  SiNumpy,
  SiPandas,
  SiScikitlearn,
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
  Typescript: SiTypescript,
  
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
  "AWS S3": SiAmazons3,
  "Amazon S3": SiAmazons3,
  "AWS (EC2, S3, Lambda)": SiAmazonwebservices,
  "Azure IoT Hub": FaMicrosoft,
  "Microsoft IoT Hub": FaMicrosoft,
  Azure: FaMicrosoft,
  GCP: SiGooglecloud,
  Docker: SiDocker,
  "CI/CD • GitHub Actions": SiGithubactions,
  "GitHub Actions": SiGithubactions,
  Git: SiGit,
  "Linux & Unix": SiLinux,
  "Linux/Unix": SiLinux,
  
  // ML/AI
  TensorFlow: SiTensorflow,
  Keras: SiKeras,
  NumPy: SiNumpy,
  Numpy: SiNumpy,
  Pandas: SiPandas,
  "Scikit-learn": SiScikitlearn,
  PyTorch: SiPytorch,
  YOLO: SiDatabricks,
  OpenCV: SiOpencv,
  OCR: SiOpencv,
  ANPR: SiDatabricks,
  
  // Other
  "discord.js": SiDiscord,
  Discord: SiDiscord,
  GitHub: SiGithubactions,
  "REST APIs": SiFastapi,
  "JWT Authentication": SiNextdotjs,
  Linux: SiLinux,
};

// Tech stack categories for the about page
export interface TechCategory {
  name: string;
  techs: string[];
}

export const techCategories: TechCategory[] = [
  {
    name: "Programming Languages",
    techs: ["Python", "C++", "Java", "TypeScript", "SQL", "C"],
  },
  {
    name: "Frameworks & Tools",
    techs: ["Django", "Flask", "Next.js", "REST APIs", "JWT Authentication", "Docker", "Git", "GitHub", "GitHub Actions", "Linux"],
  },
  {
    name: "Databases & Cloud Platforms",
    techs: ["PostgreSQL", "MySQL", "MongoDB", "AWS", "Azure", "GCP"],
  },
  {
    name: "AI/ML & Computer Vision",
    techs: ["TensorFlow", "PyTorch", "Scikit-learn", "Keras", "Pandas", "NumPy", "OpenCV", "YOLO", "OCR", "ANPR"],
  },
];

// Helper function to get icon for a tech name
export function getTechIcon(techName: string): React.ComponentType<{ className?: string }> | null {
  return techIcons[techName] || null;
}

