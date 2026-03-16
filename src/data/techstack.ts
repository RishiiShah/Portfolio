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
    techs: ["Python", "C++", "Java", "C", "SQL", "TypeScript"],
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
    techs: ["AWS (EC2, S3, Lambda)", "Docker", "Azure", "GCP", "GitHub Actions", "Git", "Linux & Unix", "System Monitoring"],
  },
  {
    name: "Additional Technologies",
    techs: ["NumPy", "Pandas", "Scikit-learn", "TensorFlow", "Keras", "PyTorch", "YOLO", "OpenCV", "OCR & ANPR"],
  },
];

// Helper function to get icon for a tech name
export function getTechIcon(techName: string): React.ComponentType<{ className?: string }> | null {
  return techIcons[techName] || null;
}

