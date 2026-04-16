// ─── Bio ─────────────────────────────────────────────────────────────────────

export const bio = {
  name: "Rishabh Shah",
  title: "Software Engineer & ML Researcher",
  tagline: "Building at the intersection of engineering and intelligence.",
  description:
    "CS student at Rutgers University. I build scalable backend systems, ML pipelines, and research-grade computer vision — and publish what I find.",
  email: "rishabh.shah@djsce.edu.in",
  github: "https://github.com/RishiiShah",
  linkedin: "https://www.linkedin.com/in/rishabh-shah1/",
  resume: "/resume.pdf",
  location: "New Brunswick, NJ",
} as const;

// ─── Education ───────────────────────────────────────────────────────────────

export const education = [
  {
    degree: "M.S. Computer Science (Software and Systems)",
    institution: "Rutgers University",
    location: "New Brunswick, NJ",
    start: "2025",
    end: "2027",
  },
  {
    degree: "B.Tech. Artificial Intelligence & Data Science",
    institution: "Dwarkadas J. Sanghvi College of Engineering",
    location: "Mumbai, India",
    start: "2021",
    end: "2025",
  },
] as const;

// ─── Skills ──────────────────────────────────────────────────────────────────

export const skills = [
  {
    category: "Languages",
    items: ["Python", "C++", "Java", "TypeScript", "JavaScript", "SQL", "C"],
  },
  {
    category: "Frameworks & Tools",
    items: [
      "Django",
      "Flask",
      "Next.js",
      "Node.js",
      "React",
      "FastAPI",
      "Docker",
      "Git",
      "GitHub Actions",
      "Linux",
    ],
  },
  {
    category: "Databases & Cloud",
    items: ["PostgreSQL", "MySQL", "MongoDB", "AWS", "Azure", "GCP"],
  },
  {
    category: "AI / ML & Computer Vision",
    items: [
      "PyTorch",
      "TensorFlow",
      "Scikit-learn",
      "Keras",
      "Pandas",
      "NumPy",
      "OpenCV",
      "YOLO",
      "Librosa",
    ],
  },
] as const;

// ─── Experience ──────────────────────────────────────────────────────────────

export interface ExperienceItem {
  role: string;
  organization: string;
  location?: string;
  start: string;
  end: string;
  summary?: string;
  bullets: string[];
  tech?: string[];
}

export const experience: ExperienceItem[] = [
  {
    role: "Software Engineering Intern",
    organization: "Aaditya Technologies",
    location: "Mumbai, India",
    start: "January 2025",
    end: "July 2025",
    summary:
      "Python/Next.js backend services, JWT-secured APIs, microservices, Docker, AWS, and CI/CD.",
    bullets: [
      "Developed backend services in Python and Next.js API routes integrated with MySQL, optimizing relational database schemas and SQL queries, reducing average response time by 22%.",
      "Built secure REST APIs with JWT authentication and role-based access control, improving inter-module communication and application security through structured logging.",
      "Containerized 4 services using Docker and deployed to AWS, managing build and deployment workflows with Git and GitHub to maintain environment consistency.",
      "Shipped 10 production-ready features across backend APIs, web application and dashboard modules, writing tests and supporting cloud releases on AWS.",
    ],
    tech: ["Python", "Next.js", "MySQL", "Docker", "AWS", "JWT", "GitHub Actions"],
  },
  {
    role: "Web Development Intern",
    organization: "Creative Line",
    location: "Mumbai, India",
    start: "June 2024",
    end: "September 2024",
    summary:
      "Next.js performance optimization, API route automation, and reliability-focused delivery.",
    bullets: [
      "Refactored 7 reusable components across 3 features, reducing per-file code by nearly 70% and eliminating component coupling.",
      "Developed and tested Next.js API routes with error handling and caching optimizations, improving integration reliability between frontend and backend services.",
      "Integrated MySQL database with Next.js API routes, improving data retrieval speed by 23%, and wrote unit tests to validate critical data flows.",
      "Implemented API integrations following clean architecture and modular design principles, improving long-term maintainability.",
    ],
    tech: ["Next.js", "MySQL", "TypeScript", "REST APIs"],
  },
];

// ─── Projects ────────────────────────────────────────────────────────────────

export interface ProjectLink {
  type: "demo" | "source" | "paper" | "blog";
  url: string;
}

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  tech: string[];
  tags: string[];
  impact?: string;
  links?: ProjectLink[];
  featured?: boolean;
  metrics?: ProjectMetric[];
  problem?: string;
  role?: string;
  architectureNotes?: string[];
  challenges?: string[];
  lessons?: string[];
}

export const projects: Project[] = [
  {
    slug: "traffic-violation-detection",
    title: "Traffic Violation Detection & Automated Ticketing",
    tagline:
      "YOLO-based vision system for five-rule enforcement with OCR/ANPR and automated challan workflows.",
    tech: [
      "Python",
      "YOLOv12x",
      "OpenCV",
      "Groq Llama-4",
      "OCR",
      "Django",
      "Twilio",
      "AWS S3",
    ],
    tags: ["MLOps", "Systems", "Research"],
    impact:
      "Production-grade end-to-end traffic enforcement achieving 93.76% accuracy across five violation classes with automated evidence collection and immediate offender notification.",
    links: [
      {
        type: "source",
        url: "https://github.com/RishiiShah/Traffic-Violation-Detection-Automated-Ticketing-System",
      },
      { type: "paper", url: "https://ieeexplore.ieee.org/document/11371065/" },
    ],
    featured: true,
    metrics: [
      { label: "End-to-End Accuracy", value: "93.76%" },
      { label: "Vehicle Detection", value: "97.56%" },
      { label: "OCR Accuracy", value: "92.7%" },
      { label: "Localization", value: "98%" },
      { label: "Violation Types", value: "5" },
      { label: "Manual Overhead", value: "−90%" },
    ],
    problem:
      "Automate traffic violation detection and evidence-backed ticketing at scale by detecting multiple violation types from live video feeds and delivering verifiable digital challans.",
    role: "Led the full computer vision pipeline: YOLOv12x model development, license plate OCR via Groq Llama-4, challan metadata automation, and end-to-end cloud storage + SMS notification.",
    architectureNotes: [
      "YOLOv12x selected after comparative testing against YOLOv11x on a custom traffic dataset. Detects five violation classes in real time with 93.76% end-to-end accuracy.",
      "Two-stage license plate recognition: Groq Llama-4 Scout vision model extracts characters with 92.7% accuracy, followed by Indian number plate regex validation (98% localization accuracy).",
      "Challan system captures violation metadata to AWS S3 with secure pre-signed URLs, delivering SMS notifications via Twilio with evidence links and fine amounts.",
    ],
    challenges: [
      "Real-time detection under uncontrolled lighting, weather variations, and diverse camera angles.",
      "Stream processing with tripwire detection requires robust handling of dropped frames without losing evidence.",
      "Forensic-grade metadata capture (timestamps, geolocation, image integrity) for legal scrutiny.",
    ],
    lessons: [
      "ANPR must validate through multiple stages — OCR, regex, and structural checks — because raw model predictions frequently contain errors.",
      "Evidence collection and notification are as important as detection accuracy; a perfect detector creates no value if frames are lost or SMS delivery is unreliable.",
      "Preprocessing (lighting normalization, motion blur handling) dramatically improves real-world robustness.",
    ],
  },
  {
    slug: "wgan-gp-financial-timeseries",
    title: "Synthetic Financial Time Series via WGAN-GP",
    tagline:
      "Generative adversarial network for realistic stock market data synthesis with 98.83% downstream accuracy.",
    tech: ["Python", "PyTorch", "WGAN-GP", "LSTM", "GRU", "TCN", "NumPy", "Pandas"],
    tags: ["MLOps", "Research"],
    impact:
      "Generative model producing statistically valid synthetic market data that augments training sets, improving downstream prediction from 97.93% to 98.83% accuracy.",
    links: [{ type: "paper", url: "https://www.scrivener.com/published/" }],
    featured: false,
    metrics: [
      { label: "Accuracy Gain", value: "97.93% → 98.83%" },
      { label: "Pearson Correlation", value: ">0.80" },
      { label: "R-squared", value: ">0.63" },
      { label: "Training Epochs", value: "3000" },
    ],
  },
  {
    slug: "jarvis-voice-assistant",
    title: "JARVIS: Voice Assistant & Smart Home Automation",
    tagline:
      "Full-stack smart home automation with Django, Azure IoT Hub, Raspberry Pi, and sub-300ms LLM responses.",
    tech: [
      "Python",
      "Django",
      "Groq API",
      "SQLite",
      "Raspberry Pi",
      "Speech Recognition",
      "Azure IoT Hub",
    ],
    tags: ["Full-stack", "Systems", "Research"],
    impact:
      "End-to-end voice-controlled home automation achieving sub-300ms latency with secure cloud-edge synchronization and multi-module intent routing.",
    links: [
      { type: "source", url: "https://github.com/RishiiShah/Jarvis-Voice-Assistant" },
      {
        type: "paper",
        url: "https://www.researchgate.net/profile/Vijay-Shelake/publication/393335295_Next-Gen_Predictive_Maintenancepage310_320/links/686616a5e4632b045dc9754a/Next-Gen-Predictive-Maintenancepage310-320.pdf#page=141",
      },
    ],
    featured: false,
    metrics: [
      { label: "Latency", value: "<300ms" },
      { label: "LLM", value: "Llama 3.1 8B" },
      { label: "IoT Platform", value: "Azure IoT Hub" },
      { label: "Modules", value: "4" },
    ],
  },
  {
    slug: "discord-admin-bot",
    title: "Discord Bot with Admin Privileges",
    tagline:
      "Moderation-first Discord bot with role-scoped commands, audit trails, and reversible actions.",
    tech: ["Node.js", "discord.js"],
    tags: ["Systems", "Backend", "Open Source"],
    impact:
      "Reduces moderator workload by 70% through automated moderation signals, reversible actions with audit trails, and permission-scoped command routing.",
    links: [{ type: "source", url: "https://github.com/RishiiShah/Discord-Bot" }],
    featured: false,
  },
  {
    slug: "music-genre-detection",
    title: "Music Genre Detection System",
    tagline:
      "Bi-LSTM ML pipeline using Librosa features achieving 98.73% accuracy with lightweight inference.",
    tech: ["Python", "TensorFlow", "Bi-LSTM", "Librosa", "NumPy", "Pandas", "Scikit-learn", "Streamlit"],
    tags: ["MLOps"],
    impact:
      "Production-grade audio genre classifier achieving 98.73% accuracy while reducing model size by 15% and improving inference speed by 22%.",
    links: [{ type: "source", url: "https://github.com/RishiiShah/Music-Genre-Detection" }],
    featured: false,
    metrics: [
      { label: "Accuracy", value: "98.73%" },
      { label: "Model Size", value: "−15%" },
      { label: "Inference Speed", value: "+22%" },
      { label: "Genres", value: "10" },
    ],
  },
  {
    slug: "movie-recommendation-system",
    title: "Movie Recommendation System",
    tagline:
      "TMDB-based recommendation engine using cosine similarity across 5000+ films.",
    tech: ["Python", "Streamlit", "NumPy", "Pandas", "Scikit-learn"],
    tags: ["MLOps"],
    impact:
      "Content-based recommendation system enabling discovery from 5000+ films with zero cold-start and interpretable similarity reasoning.",
    links: [
      { type: "source", url: "https://github.com/RishiiShah/Movie-Recommendation-System" },
    ],
    featured: false,
  },
  {
    slug: "ar-interaction-platform",
    title: "AR Product Visualization Platform",
    tagline:
      "Augmented reality platform with Google PaLM 2 chatbot for product visualization and support.",
    tech: ["Python", "Streamlit", "Bootstrap", "Google PaLM 2", "Google Model Renderer"],
    tags: ["Full-stack", "Systems"],
    impact:
      "Unified product discovery platform enabling customers to visualize 3D products in AR while receiving real-time AI-driven support.",
    links: [{ type: "source", url: "https://github.com/RishiiShah/InteractiQ" }],
    featured: false,
  },
  {
    slug: "banking-system-bluej",
    title: "Banking System (Early Project)",
    tagline:
      "Java OOP banking simulator with runtime accounts, auth, and core banking operations.",
    tech: ["Java", "BlueJ"],
    tags: ["Systems", "Backend"],
    impact:
      "Learner-focused banking simulator supporting account lifecycle in-memory with age-based restrictions and validation-first UX.",
    featured: false,
  },
];

// ─── Publications ─────────────────────────────────────────────────────────────

export interface PublicationLink {
  type: "paper" | "journal" | "source" | "demo";
  url: string;
}

export interface Publication {
  title: string;
  venue: string;
  year: number;
  publishedAt?: string;
  authors: string[];
  links?: PublicationLink[];
  abstract?: string;
  featured?: boolean;
}

export const publications: Publication[] = [
  {
    title:
      "Intelligent Traffic Surveillance: A Vision-Based System for Detecting Traffic Rule Violations",
    venue: "2nd International Conference on Integration of Computational Intelligent Systems",
    year: 2025,
    publishedAt: "September 2025",
    authors: [
      "Harsh Samant",
      "Kush Doshi",
      "Rishabh Shah",
      "Shreevardhan Bhosale",
      "Dashrath Kale",
    ],
    abstract:
      "This paper proposes an intelligent, vision-based traffic surveillance system designed to automatically detect, classify and report violations like red light jumping, speeding, helmet-less riding, lack of valid insurance, and non-compliance of pollution control. The system utilizes a custom-trained YOLOv12 object detection algorithm, integrating real-time object tracking with license plate extraction via vision-based models and OCR. Experimental evaluation achieves 93.76% overall accuracy across multiple test cases.",
    featured: false,
    links: [{ type: "paper", url: "https://ieeexplore.ieee.org/document/11371065/" }],
  },
  {
    title:
      "Bridging Financial Data Gaps with WGAN-GP: Generating Synthetic Time Series for Robust Models",
    venue: "1st International Conference on Next-Generation AI & ML",
    year: 2025,
    publishedAt: "August 2025",
    authors: [
      "Rishabh Shah",
      "Fayed Hakim",
      "Armaan Attar",
      "Harsh Samant",
      "Nilesh Patil",
      "Chinmay Raut",
    ],
    abstract:
      "We propose a methodology to synthesize financial time series data using a Wasserstein Generative Adversarial Network with Gradient Penalty (WGAN-GP), demonstrating the ability to recreate real-world data and augment available datasets. The framework enhances predictive model capabilities by 0.9% in accuracy, leading to more reliable forecasting and improved event classification, including identification of rare events such as recessions or pandemics.",
    featured: true,
    links: [],
  },
  {
    title: "JARVIS: Voice Assistant with Smart Home Automation",
    venue: "International Conference on STEM for Sustainable Development 2025",
    year: 2025,
    publishedAt: "June 2025",
    authors: ["Rishabh Shah", "Alan George", "Yukta Saraf", "Rujuta Jariwala"],
    abstract:
      "This paper explores the integration of virtual assistant technology with home automation systems. JARVIS leverages NLP to understand user requests and perform tasks such as information retrieval, media control, and mathematical calculations. We utilize AI and NLP libraries for improving speech recognition, utilizing Raspberry Pi 3B+ for IoT device control. The system prioritizes user security by ensuring data privacy and is deployed over the Internet for home automation.",
    featured: false,
    links: [
      {
        type: "paper",
        url: "https://www.researchgate.net/profile/Vijay-Shelake/publication/393335295_Next-Gen_Predictive_Maintenancepage310_320/links/686616a5e4632b045dc9754a/Next-Gen-Predictive-Maintenancepage310-320.pdf#page=141",
      },
      {
        type: "journal",
        url: "https://www.researchgate.net/profile/Vijay-Shelake/publication/393335295_Next-Gen_Predictive_Maintenancepage310_320/links/686616a5e4632b045dc9754a/Next-Gen-Predictive-Maintenancepage310-320.pdf",
      },
    ],
  },
];
