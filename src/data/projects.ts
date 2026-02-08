import { Project } from "@/types";

export const projects: Project[] = [
  
  {
    slug: "jarvis-voice-assistant",
    title: "JARVIS — Virtual Voice Assistant with Smart Home Automation",
    tagline:
      "Python-based voice assistant with home automation capabilities and Microsoft IoT Hub integration.",
    tech: ["Python", "Django", "NLP", "LLM", "SQLite", "Raspberry Pi", "Speech Recognition", "Microsoft IoT Hub"],
    tags: ["Full-stack", "Systems", "Research"],
    impact: "Voice-controlled home automation with remote management capabilities.",
    links: [
      { type: "source", url: "https://github.com/RishiiShah/Jarvis-Voice-Assistant" },
      { type: "paper", url: "https://www.researchgate.net/profile/Vijay-Shelake/publication/393335295_Next-Gen_Predictive_Maintenancepage310_320/links/686616a5e4632b045dc9754a/Next-Gen-Predictive-Maintenancepage310-320.pdf#page=141" },
    ],
    problem: "Create a voice-controlled home automation system with remote management capabilities.",
    role: "Full-stack development: voice recognition, NLP processing, web interface, IoT integration.",
    architectureNotes: [
      "Voice recognition and NLP processing pipeline",
      "Django web interface for home automation control",
      "Microsoft IoT Hub integration for remote management",
      "Raspberry Pi deployment for edge computing",
    ],
    challenges: [
      "Integrating multiple technologies (voice, NLP, IoT, web)",
      "Ensuring reliable voice recognition in different environments",
      "Remote device management through IoT Hub",
    ],
    metrics: [
      { label: "Platform", value: "Raspberry Pi" },
      { label: "Integration", value: "Microsoft IoT Hub" },
      { label: "Control", value: "Voice + Web" },
    ],
    lessons: [
      "Multi-technology integration requires careful system design",
      "Edge computing with Raspberry Pi enables local processing",
      "IoT integration enables scalable remote management",
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
    slug: "traffic-violation-detection",
    title: "Traffic Violation Detection & Automated Ticket Generation",
    tagline:
      "YOLO11s-based system for real-time traffic violation detection with automated ticket generation.",
    tech: ["Python", "YOLO11s", "Computer Vision", "OpenCV", "Django"],
    tags: ["MLOps", "Systems", "Research"],
    impact: "Automated violation detection for speeding and red-light running with optimized accuracy and reduced false positives.",
    links: [
      { type: "source", url: "https://github.com/RishiiShah/Traffic-Violation-Detection-Automated-Ticketing-System" },
    ],
    featured: true,
    problem:
      "Detect traffic violations (speeding, red-light running) from live camera feeds and automatically generate tickets to improve traffic law enforcement efficiency.",
    role: "Trained YOLO11s model, integrated with automated ticketing system, optimized for accuracy and false positive reduction.",
    architectureNotes: [
      "Real-time video processing pipeline with YOLO11s",
      "Automated ticket generation system integration",
      "False positive reduction through model optimization",
      "Live camera feed processing for real-time detection",
    ],
    challenges: [
      "Optimizing model accuracy while reducing false positives",
      "Real-time processing of live camera feeds",
      "Integration with existing ticketing infrastructure",
    ],
    metrics: [
      { label: "Model", value: "YOLO11s" },
      { label: "Processing", value: "Real-time" },
      { label: "Violations", value: "Speeding, Red-light" },
    ],
    lessons: [
      "Computer vision models require careful optimization for production use",
      "Integration with existing systems is crucial for real-world deployment",
      "Real-time processing demands efficient pipeline design",
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
  {
    slug: "music-genre-detection",
    title: "Music Genre Detection System",
    tagline:
      "Achieved 98.73% accuracy in music genre classification using MFCC and Chroma features.",
    tech: ["Python", "TensorFlow", "Librosa", "NumPy", "Pandas", "Scikit-learn", "Streamlit"],
    tags: ["MLOps"],
    impact: "High-accuracy music genre classification with interactive visualization.",
    links: [
      { type: "source", url: "https://github.com/RishiiShah/Music-Genre-Detection" },
      { type: "demo", url: "#" },
    ],
    problem: "Classify music genres from audio files with high accuracy using machine learning.",
    role: "Feature engineering, model development, and interactive web application creation.",
    architectureNotes: [
      "MFCC and Chroma feature extraction from audio",
      "TensorFlow-based classification model",
      "Streamlit web app for interactive visualization",
      "GTZAN dataset for training and validation",
    ],
    challenges: [
      "Feature engineering for audio classification",
      "Achieving high accuracy across multiple genres",
      "Creating intuitive user interface for visualization",
    ],
    metrics: [
      { label: "Accuracy", value: "98.73%" },
      { label: "Features", value: "MFCC + Chroma" },
      { label: "Dataset", value: "GTZAN" },
    ],
    lessons: [
      "Feature engineering is crucial for audio classification success",
      "Interactive visualization enhances user understanding",
      "High accuracy requires careful model tuning and feature selection",
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
];


