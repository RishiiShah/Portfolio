import type { ComponentType } from "react";
import {
  SiPython,
  SiCplusplus,
  SiTypescript,
  SiJavascript,
  SiC,
  SiDjango,
  SiFlask,
  SiNextdotjs,
  SiNodedotjs,
  SiReact,
  SiDocker,
  SiGit,
  SiGithubactions,
  SiLinux,
  SiPostgresql,
  SiMysql,
  SiMongodb,
  SiGooglecloud,
  SiPytorch,
  SiTensorflow,
  SiScikitlearn,
  SiKeras,
  SiPandas,
  SiNumpy,
  SiOpencv,
  SiRedis,
  SiDiscord,
  SiStreamlit,
  SiYolo,
  SiJsonwebtokens,
} from "@icons-pack/react-simple-icons";
import { JavaIcon, SqlIcon, OpenAiIcon, TechDot } from "./TechIcons";

export type IconComp = ComponentType<{ size?: number; color?: string }>;

/**
 * Centralized registry for tech names. Covers every technology that appears
 * in src/data/index.ts across skills, projects, and experience.
 * Missing entries fall back to TechDot (a subtle two-ring dot mark).
 */
export const TECH_ICON: Record<string, IconComp> = {
  // Languages
  "Python": SiPython,
  "C++": SiCplusplus,
  "Java": JavaIcon,
  "TypeScript": SiTypescript,
  "JavaScript": SiJavascript,
  "SQL": SqlIcon,
  "C": SiC,

  // Frameworks & Tools
  "Django": SiDjango,
  "Flask": SiFlask,
  "Next.js": SiNextdotjs,
  "Node.js": SiNodedotjs,
  "React": SiReact,
  "Docker": SiDocker,
  "Git": SiGit,
  "GitHub Actions": SiGithubactions,
  "Linux": SiLinux,

  // Databases & Cloud
  "PostgreSQL": SiPostgresql,
  "MySQL": SiMysql,
  "MongoDB": SiMongodb,
  "AWS": TechDot,
  "Azure": TechDot,
  "GCP": SiGooglecloud,

  // AI / ML & CV
  "PyTorch": SiPytorch,
  "TensorFlow": SiTensorflow,
  "Scikit-learn": SiScikitlearn,
  "Keras": SiKeras,
  "Pandas": SiPandas,
  "NumPy": SiNumpy,
  "OpenCV": SiOpencv,
  "YOLO": SiYolo,
  "YOLOv12x": SiYolo,
  "Librosa": TechDot,

  // Project-specific extras
  "OpenAI API": OpenAiIcon,
  "Redis": SiRedis,
  "Twilio": TechDot,
  "AWS S3": TechDot,
  "discord.js": SiDiscord,
  "Streamlit": SiStreamlit,
  "Groq API": TechDot,
  "Groq Llama-4": TechDot,
  "REST APIs": TechDot,
  "JWT": SiJsonwebtokens,
  "JSON": SiJsonwebtokens,
  "Speech Recognition": TechDot,
  "Azure IoT Hub": TechDot,
  "SQLite": TechDot,
  "Raspberry Pi": TechDot,
  "BlueJ": TechDot,
  "OCR": TechDot,
  "Bi-LSTM": TechDot,
  "LSTM": TechDot,
  "GRU": TechDot,
  "TCN": TechDot,
  "WGAN-GP": TechDot,
  "Google PaLM 2": TechDot,
  "Google Model Renderer": TechDot,
  "Bootstrap": TechDot,
};

/** Official brand colors for hover accent. Defaults to ink-dim. */
export const BRAND_COLOR: Record<string, string> = {
  "Python": "#3776AB",
  "C++": "#00599C",
  "Java": "#f89820",
  "TypeScript": "#3178C6",
  "JavaScript": "#F7DF1E",
  "SQL": "#dce05a",
  "C": "#A8B9CC",
  "Django": "#44B78B",
  "Flask": "#ffffff",
  "Next.js": "#ffffff",
  "Node.js": "#5FA04E",
  "React": "#61DAFB",
  "Docker": "#2496ED",
  "Git": "#F05032",
  "GitHub Actions": "#2088FF",
  "Linux": "#FCC624",
  "PostgreSQL": "#4169E1",
  "MySQL": "#4479A1",
  "MongoDB": "#47A248",
  "AWS": "#FF9900",
  "AWS S3": "#FF9900",
  "Azure": "#0078D4",
  "GCP": "#4285F4",
  "PyTorch": "#EE4C2C",
  "TensorFlow": "#FF6F00",
  "Scikit-learn": "#F7931E",
  "Keras": "#D00000",
  "Pandas": "#150458",
  "NumPy": "#4d77cf",
  "OpenCV": "#5C3EE8",
  "YOLO": "#00FFFF",
  "YOLOv12x": "#00FFFF",
  "OpenAI API": "#5fa88a",
  "Redis": "#FF4438",
  "Twilio": "#F22F46",
  "discord.js": "#5865F2",
  "Streamlit": "#FF4B4B",
};

export function getTechIcon(name: string): IconComp {
  return TECH_ICON[name] ?? TechDot;
}

export function getBrandColor(name: string): string {
  return BRAND_COLOR[name] ?? "#a6adbe";
}
