import { Project } from "@/types";

export const projects: Project[] = [
  {
    slug: "traffic-violation-detection",
    title: "Traffic Violation Detection & Automated Ticketing System",
    tagline:
      "YOLO-based vision system for five-rule enforcement with OCR/ANPR and automated challan workflows.",
    tech: ["Python", "YOLO11s", "Computer Vision", "OpenCV", "OCR", "ANPR", "Django", "Twilio", "AWS S3"],
    tags: ["MLOps", "Systems", "Research"],
    impact: "Automated end-to-end traffic enforcement with 93.76% test accuracy, five violation classes, and 90% lower manual effort.",
    links: [
      { type: "source", url: "https://github.com/RishiiShah/Traffic-Violation-Detection-Automated-Ticketing-System" },
      { type: "paper", url: "https://ieeexplore.ieee.org/document/11371065/" },
    ],
    featured: true,
    problem:
      "Detect and validate multiple traffic violations from live feeds, then automatically generate and deliver evidence-backed challans at scale.",
    role: "Developed the YOLO vision pipeline and engineered end-to-end challan generation with AWS S3 storage and Twilio-based notification delivery.",
    architectureNotes: [
      "Developed a YOLO-based computer vision pipeline detecting five traffic violations with vehicle tracking, speed estimation, and rule-based logic",
      "Integrated OCR-based ANPR for license-plate recognition with frame selection and regex-based validation for Indian number plate formats",
      "Engineered backend automation for challan generation and delivery using AWS S3 for evidence-backed PDF reports and Twilio API for SMS notifications",
      "Implemented latency-aware preprocessing (tripwire logic and frame handling) to reduce inference time",
    ],
    challenges: [
      "Reducing false positives in noisy traffic scenes and inconsistent camera angles",
      "Maintaining low-latency inference with tripwire and frame-handling constraints",
      "Making automated notices reliable with verifiable image/video evidence",
    ],
    metrics: [
      { label: "Accuracy", value: "93.76%" },
      { label: "Violation Types", value: "5" },
      { label: "Inference Speed", value: "+30%" },
      { label: "Manual Effort", value: "-90%" },
    ],
    lessons: [
      "Production ANPR systems need strong validation beyond raw OCR output",
      "Notification and evidence pipelines are as critical as detection quality",
      "Latency-aware preprocessing improves reliability in real-world traffic feeds",
    ],
  },
  {
    slug: "jarvis-voice-assistant",
    title: "JARVIS: Voice Assistant with Smart Home Automation",
    tagline:
      "Full-stack smart home automation with Django, Azure IoT Hub, Raspberry Pi, and sub-300ms LLM responses.",
    tech: ["Python", "Django", "NLP", "LLM", "Groq API", "SQLite", "Raspberry Pi", "Speech Recognition", "Azure IoT Hub"],
    tags: ["Full-stack", "Systems", "Research"],
    impact: "Real-time voice-controlled home automation with sub-300ms latency and high-throughput concurrent handling.",
    links: [
      { type: "source", url: "https://github.com/RishiiShah/Jarvis-Voice-Assistant" },
      { type: "paper", url: "https://www.researchgate.net/profile/Vijay-Shelake/publication/393335295_Next-Gen_Predictive_Maintenancepage310_320/links/686616a5e4632b045dc9754a/Next-Gen-Predictive-Maintenancepage310-320.pdf#page=141" },
    ],
    problem: "Create a voice-controlled smart home platform with secure cloud-to-device control and natural language command understanding.",
    role: "Developed voice and web control flows, integrated Llama-3 70B via Groq API, and implemented secure real-time cloud-to-device synchronization.",
    architectureNotes: [
      "Developed a full-stack smart home automation system with voice and web control using Django, Azure IoT Hub, and Raspberry Pi",
      "Integrated Llama-3 (70B) via Groq API with asynchronous request handling, prompt filtering, and multi-threading",
      "Designed REST APIs for secure device communication and state management",
      "Implemented cloud-to-device messaging with GPIO-based hardware actuation for reliable appliance control",
    ],
    challenges: [
      "Balancing low-latency LLM responses with reliable command execution",
      "Synchronizing cloud and edge device states under intermittent network conditions",
      "Securing device control paths while preserving responsive voice UX",
    ],
    metrics: [
      { label: "Latency", value: "<300 ms" },
      { label: "LLM", value: "Llama-3 70B" },
      { label: "IoT", value: "Azure IoT Hub" },
      { label: "State Consistency", value: "99.9%" },
    ],
    lessons: [
      "Asynchronous orchestration is key for conversational IoT systems",
      "Cloud-edge state synchronization needs explicit fault-tolerance design",
      "LLM guardrails improve both safety and action reliability",
    ],
  },
  {
    slug: "discord-admin-bot",
    title: "Discord Bot with Admin Privileges",
    tagline:
      "Moderation-first Discord bot handling monitoring, info, bans/kicks, and quick unbans.",
    tech: ["Node.js", "discord.js"],
    tags: ["Systems", "Backend", "Open Source"],
    impact:
      "Streamlined moderator workflows and improved user experience with clear admin commands.",
    links: [
      { type: "source", url: "https://github.com/RishiiShah/Discord-Bot" },
    ],
    problem:
      "Provide reliable server administration and user interaction tooling for moderators.",
    role:
      "Designed and implemented command handlers, permissions, and moderation workflows.",
    architectureNotes: [
      "Command router with role/permission checks",
      "Content monitoring hooks for basic moderation signals",
      "Admin actions: ban, kick, quick-unban with audit messages",
    ],
    challenges: [
      "Balancing strict moderation with a friendly user experience",
      "Designing safe defaults to prevent accidental admin actions",
    ],
    lessons: [
      "Clear feedback and confirmations reduce moderator mistakes",
      "Permission scoping is critical for safe admin tooling",
    ],
  },
  {
    slug: "music-genre-detection",
    title: "Music Genre Detection System",
    tagline:
      "Bi-LSTM ML pipeline using Librosa features with 98.73% accuracy and lightweight inference deployment.",
    tech: ["Python", "TensorFlow", "Bi-LSTM", "Librosa", "NumPy", "Pandas", "Scikit-learn", "Streamlit"],
    tags: ["MLOps"],
    impact: "High-accuracy genre classification with efficient real-time tagging in low-compute environments.",
    links: [
      { type: "source", url: "https://github.com/RishiiShah/Music-Genre-Detection" },
      // { type: "demo", url: "#" },
    ],
    problem: "Build an accurate yet efficient music genre classifier for real-time audio tagging workflows.",
    role: "Implemented feature engineering, Bi-LSTM model training, and lightweight inference-serving pipeline.",
    architectureNotes: [
      "Implemented a Bi-LSTM based audio classification model using Librosa for MFCC, Chroma, and Mel features",
      "Streamlined data preprocessing and training pipelines in Python",
      "Deployed a quantized model as a lightweight inference API for real-time genre tagging",
      "Built supporting evaluation workflows for high-accuracy low-overhead predictions",
      "Trained and validated on GTZAN dataset",
    ],
    challenges: [
      "Balancing sequence-model quality with inference efficiency",
      "Generalizing across genre overlap and noisy clips",
      "Serving low-latency predictions with constrained compute",
    ],
    metrics: [
      { label: "Accuracy", value: "98.73%" },
      { label: "Training Efficiency", value: "+22%" },
      { label: "Memory Usage", value: "-15%" },
      { label: "Features", value: "MFCC + Chroma" },
      { label: "Model", value: "Bi-LSTM" },
      { label: "Dataset", value: "GTZAN" },
    ],
    lessons: [
      "Sequence models capture temporal audio patterns better than shallow baselines",
      "Model quantization can preserve quality while reducing inference cost",
      "Feature quality and data normalization strongly drive classification robustness",
    ],
  },
  {
    slug: "movie-recommendation-system",
    title: "Movie Recommendation System",
    tagline:
      "TMDB-based recommendation engine using cosine similarity for accurate movie suggestions.",
    tech: ["Python", "Streamlit", "NumPy", "Pandas", "Scikit-learn"],
    tags: ["MLOps"],
    impact:
      "User-friendly movie discovery platform with accurate recommendations based on content similarity.",
    links: [
      { type: "source", url: "https://github.com/RishiiShah/Movie-Recommendation-System" },
    ],
    problem:
      "Create an intelligent movie recommendation system that helps users discover new films based on their preferences.",
    role:
      "Full-stack development: data processing, similarity algorithms, and interactive web interface.",
    architectureNotes: [
      "TMDB dataset processing with ~5000 movies",
      "Cosine similarity for comparing movie plots, cast, and attributes",
      "Streamlit interface for seamless user exploration",
      "Content-based filtering for personalized recommendations",
    ],
    challenges: [
      "Processing and cleaning large movie datasets",
      "Implementing effective similarity algorithms",
      "Creating intuitive user interface for recommendations",
    ],
    metrics: [
      { label: "Dataset", value: "~5000 movies" },
      { label: "Algorithm", value: "Cosine Similarity" },
      { label: "Interface", value: "Streamlit" },
    ],
    lessons: [
      "Content-based filtering provides reliable recommendations",
      "User-friendly interfaces enhance recommendation discovery",
      "Data preprocessing is crucial for recommendation accuracy",
    ],
  },
  {
    slug: "ar-interaction-platform",
    title: "AR Interaction Platform for Product Visualization",
    tagline:
      "Augmented reality platform with chatbot integration for enhanced product visualization and support.",
    tech: ["Python", "Streamlit", "Bootstrap", "Google PaLM 2", "Google Model Renderer"],
    tags: ["Full-stack", "Systems"],
    impact: "Enhanced product visualization with AI-powered instant support through chatbot integration.",
    links: [
      { type: "source", url: "https://github.com/RishiiShah/InteractiQ" },
    ],
    problem: "Create an augmented reality platform for product visualization with intelligent support capabilities.",
    role: "Full-stack development: AR visualization, chatbot integration, UI/UX design.",
    architectureNotes: [
      "Augmented reality visualization using Google Model Renderer",
      "Chatbot integration with Google PaLM 2 for instant support",
      "Streamlit + Bootstrap UI for responsive design",
      "Product visualization and interaction capabilities",
    ],
    challenges: [
      "Integrating AR visualization with chatbot functionality",
      "Creating responsive and intuitive user interface",
      "Ensuring smooth interaction between AR and AI components",
    ],
    metrics: [
      { label: "AI Model", value: "Google PaLM 2" },
      { label: "UI Framework", value: "Streamlit + Bootstrap" },
      { label: "AR Engine", value: "Google Model Renderer" },
    ],
    lessons: [
      "AR and AI integration creates powerful user experiences",
      "Responsive design is crucial for AR applications",
      "Chatbot integration enhances user engagement and support",
    ],
  },
  {
    slug: "banking-system-bluej",
    title: "Banking System (Early Project)",
    tagline:
      "First major project built in BlueJ: runtime-only accounts, auth, and core banking ops.",
    tech: ["Java", "BlueJ"],
    tags: ["Systems", "Backend"],
    impact:
      "User-friendly experience for creating/managing accounts entirely in-memory with safe defaults for minors.",
    problem:
      "Design a simple banking application without a database that supports account creation, authentication, and management.",
    role:
      "Sole developer: implemented runtime data model, auth flow, and account operations.",
    architectureNotes: [
      "In-memory store for users and accounts (no database)",
      "Input validation and confirmation prompts for password setup",
      "Age-aware logic restricting users under 18 to savings accounts",
      "Menu-driven CLI for balance checks and listing existing accounts",
    ],
    challenges: [
      "Ensuring safe authentication without persistent storage",
      "Designing intuitive runtime-only account management flows",
    ],
    lessons: [
      "Strong validation and confirmations improve UX in CLI apps",
      "Explicit business rules (age-based account types) reduce user error",
    ],
  },
];


