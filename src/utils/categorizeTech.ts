const languageTech = new Set([
  "Python",
  "TypeScript",
  "JavaScript",
  "Java",
  "C",
  "C++",
  "SQL",
]);

const mlAiTech = new Set([
  "YOLO11s",
  "YOLO",
  "Computer Vision",
  "OpenCV",
  "OCR",
  "ANPR",
  "TensorFlow",
  "Keras",
  "PyTorch",
  "Scikit-learn",
  "Librosa",
  "NLP",
  "LLM",
  "Bi-LSTM",
]);

const frameworkToolTech = new Set([
  "Next.js",
  "NextJS",
  "Django",
  "FastAPI",
  "Flask",
  "Node.js",
  "discord.js",
  "Streamlit",
  "Bootstrap",
  "MySQL",
  "PostgreSQL",
  "MongoDB",
  "SQLite",
  "Docker",
  "AWS",
  "AWS S3",
  "EC2",
  "ECS",
  "Twilio",
  "Azure IoT Hub",
  "Microsoft IoT Hub",
  "Raspberry Pi",
  "Groq API",
  "GitHub Actions",
  "NumPy",
  "Pandas",
  "Speech Recognition",
  "Google PaLM 2",
  "Google Model Renderer",
]);

type TechGroupName = "Languages" | "ML / AI" | "Frameworks & Tools" | "Other";

export function categorizeTech(techList: string[]) {
  const groups: Record<TechGroupName, string[]> = {
    Languages: [],
    "ML / AI": [],
    "Frameworks & Tools": [],
    Other: [],
  };

  for (const tech of techList) {
    if (languageTech.has(tech)) {
      groups.Languages.push(tech);
      continue;
    }

    if (mlAiTech.has(tech)) {
      groups["ML / AI"].push(tech);
      continue;
    }

    if (frameworkToolTech.has(tech)) {
      groups["Frameworks & Tools"].push(tech);
      continue;
    }

    groups.Other.push(tech);
  }

  return (Object.entries(groups) as Array<[TechGroupName, string[]]>).filter(([, items]) => items.length > 0);
}
