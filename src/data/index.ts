// ─── Bio ─────────────────────────────────────────────────────────────────────

export const bio = {
  name: "Rishabh Shah",
  title: "Software Engineer & ML Researcher",
  tagline: "Building at the intersection of engineering and intelligence.",
  description:
    "CS student at Rutgers University. I specialize in building scalable backend systems in Python, machine learning pipelines, and research-grade computer vision. View my work on GitHub.",
  email: "rish.shah@rutgers.edu",
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
    start: "August 2025",
    end: "May 2027",
    gpa: "3.83 / 4.0",
  },
  {
    degree: "B.Tech. Artificial Intelligence & Data Science",
    // institution: "Dwarkadas J. Sanghvi College of Engineering",
    institution: "University of Mumbai",
    location: "Mumbai, India",
    start: "December 2021",
    end: "June 2025",
    gpa: "7.76 / 10.0",
  },
] as const;

// ─── Skills ──────────────────────────────────────────────────────────────────

export const skills = [
  {
    category: "Languages",
    items: ["Python", "C++", "Java", "TypeScript", "SQL", "C"],
  },
  {
    category: "Frameworks & Tools",
    items: [
      "Django",
      "Next.js",
      "REST APIs",
      "JWT Auth",
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
    category: "Testing",
    items: ["Pytest", "Vitest", "Playwright"],
  },
  {
    category: "AI / ML & Computer Vision",
    items: ["TensorFlow", "PyTorch", "Scikit-learn", "OpenCV", "YOLO"],
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
      "Python/Next.js backend services, JWT-secured APIs, Docker, AWS, and CI/CD automation.",
    bullets: [
      "Reduced API response times exceeding 400ms by restructuring MySQL schemas and rewriting critical SQL paths in Python and Next.js, cutting average latency by 22%.",
      "Eliminated unauthorized cross-service requests across 4 backend services by building JWT-authenticated REST APIs with role-based access control, enforcing identity verification on every internal call.",
      "Containerized 4 backend services with Docker and automated AWS release workflows, reducing manual per-release deployment setup by 65% for a 4-person backend team.",
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
      "Next.js performance optimization, security hardening, and reliability-focused delivery.",
    bullets: [
      "Resolved a coupling bottleneck across 3 features by refactoring 7 shared-logic components into isolated responsibilities, cutting per-file size by 70% and reducing review complexity.",
      "Traced P95 response times above 3100ms to missing indexes and absent connection pooling by rebuilding 3 Next.js routes with both fixes, dropping load time to 420ms.",
      "Closed SQL injection exposure in user-facing forms by switching to parameterized queries and adding input validation across authentication and CRUD endpoints, eliminating direct raw-input-to-database paths.",
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
  latest?: boolean;
  metrics?: ProjectMetric[];
  problem?: string;
  role?: string;
  architectureNotes?: string[];
  challenges?: string[];
  lessons?: string[];
  year?: string;
}

export const projects: Project[] = [
  {
    slug: "csegraph",
    year: "2025",
    title: "CseGraph",
    tagline:
      "Repository context engine for coding agents that indexes 22 languages into a SQLite dependency graph and returns the smallest useful context bundle for any task.",
    tech: ["Python", "SQLite", "Tree-sitter", "MCP", "FTS5"],
    tags: ["Systems", "Backend", "Developer Tools"],
    latest: true,
    impact:
      "Reduced agent token consumption by 96% on the engine's own codebase (144 files, 1,509 symbols, 6,570 edges) by replacing brute-force repo search with graph-driven retrieval.",
    links: [{ type: "source", url: "https://github.com/RishiiShah/CseGraph" }],
    featured: false,
    metrics: [
      { label: "Token Reduction", value: "96%" },
      { label: "Languages", value: "22" },
      { label: "MCP Tools", value: "6" },
      { label: "Symbols Indexed", value: "1,509" },
    ],
    problem:
      "Coding agents waste tool calls and prompt tokens searching repositories for context. Brute-force file reads miss dependencies, and embedding-only approaches lose structural relationships between symbols.",
    role: "Sole developer. Designed and built the full system: multi-language Tree-sitter parsing, WAL-mode SQLite graph storage, FTS5 retrieval pipeline, 6-tool MCP stdio server, CLI, SDK, and a VS Code extension.",
    architectureNotes: [
      "Indexing pipeline parses 22 languages with Tree-sitter into a WAL-mode SQLite dependency graph, with incremental SHA256-based refresh and a lexical index over symbols, signatures, and docstrings.",
      "Retrieval combines FTS5 BM25 ranking with exact-name boosting, hub-aware BFS traversal that refuses to expand through high-degree utility nodes, and deterministic byte-capped context selection.",
      "A 6-tool MCP stdio server (index, refresh, minimal, context, graph, path) provides session-aware suggestion filtering and confidence tiers that distinguish AST-proven edges from inferred ones.",
    ],
    challenges: [
      "Supporting 22 languages with a single retrieval pipeline required a language-neutral representation that preserves structural fidelity.",
      "Keeping responses budget-safe for agents: a hard byte cap with a deterministic drop order (source text, then explanations, then trailing nodes and edges) guarantees the response never blows the context window.",
      "Balancing context precision against recall: returning too little misses critical dependencies, returning too much wastes agent tokens.",
    ],
    lessons: [
      "Graph structure captures relationships that pure text search cannot. Even a shallow BFS over a dependency graph surfaces context that keyword matching misses entirely.",
      "Hub-aware traversal matters: without suppressing expansion through high-degree utility nodes, every query drags in logging and config helpers.",
      "Edge trust should be explicit. Tagging edges as AST-proven versus inferred lets agents gate decisions on confidence instead of treating all relationships as equally reliable.",
    ],
  },
  {
    slug: "snap-interview",
    year: "2025",
    title: "Snap-Interview",
    tagline:
      "AI interview practice platform where users run voice-based mock interviews with an AI interviewer, get recorded, and receive schema-enforced structured evaluations.",
    tech: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Groq API", "AWS S3", "ElevenLabs", "BetterAuth"],
    tags: ["Full-stack", "AI/ML"],
    impact:
      "Live at snapinterview.app: an async interview pipeline coordinating microphone capture, LLM streaming, TTS synthesis, and S3 uploads, eliminating audio lag and race conditions.",
    links: [
      { type: "demo", url: "https://snapinterview.app" },
      { type: "source", url: "https://github.com/RishiiShah/SnapInterview" },
    ],
    featured: false,
    metrics: [
      { label: "Eval Scale", value: "0 to 100" },
      { label: "Role Prompts", value: "28" },
      { label: "API Route Groups", value: "19" },
    ],
    problem:
      "Early-career engineers practicing for interviews get either generic AI feedback or nothing at all. Existing tools grade correctness but miss communication, structure, and per-skill signal.",
    role: "Full-stack build: Next.js 16 App Router with a layered backend (API routes, services, repositories, Prisma), Groq Llama 3.3 70B for interview chat and evaluation, Web Speech API recognition, ElevenLabs TTS, presigned AWS S3 uploads, Better Auth sessions, and a CI pipeline covering lint, typecheck, unit, and e2e tests.",
    architectureNotes: [
      "Async interview pipeline coordinates microphone capture, LLM streaming, TTS synthesis, and S3 uploads; frontend state is composed from specialized hooks chained by a single page controller, eliminating audio lag and race conditions.",
      "Schema-enforced evaluation engine scores responses from 0 to 100 with structured feedback across communication, technical depth, and clarity, eliminating malformed AI output.",
      "Hardened upload and auth surface: presigned S3 keys scoped to per-user prefixes, origin-based CSRF protection and Postgres-backed rate limits across 4 endpoint types, and a nonce-based CSP served through the Next.js 16 proxy.",
    ],
    challenges: [
      "Chaining speech recognition, LLM streaming, and TTS without race conditions required an explicitly async pipeline instead of ad-hoc event handlers.",
      "Open-ended answers drift between sessions; calibration with role-specific prompts and schema enforcement was essential for consistency.",
      "Security surface spans login, OTP, eval, and upload endpoints, and each required independent rate limiting and CSRF hardening.",
    ],
    lessons: [
      "Schema-enforced AI outputs are dramatically more reliable than parsing free-text prose. Never parse prose when you can enforce a schema.",
      "Users value per-skill breakdowns more than a single overall score. That was the biggest retention lever in user testing.",
      "A CI pipeline covering lint, typecheck, unit, and e2e tests catches regressions earlier than any manual review cadence.",
    ],
  },
  {
    slug: "traffic-violation-detection",
    year: "2025",
    title: "Traffic Violation Detection & Automated Ticketing",
    tagline:
      "YOLO-based vision system for five-rule enforcement with OCR/ANPR and automated challan workflows.",
    tech: [
      "Python",
      "YOLOv12x",
      "OpenCV",
      "Groq Llama-4",
      "Django",
      "Twilio",
      "AWS S3",
    ],
    tags: ["MLOps", "Systems", "Research"],
    impact:
      "End-to-end traffic enforcement achieving 93.76% accuracy across five violation classes, completing the violation-to-notification pipeline within source-video duration plus 10 seconds.",
    links: [
      {
        type: "source",
        url: "https://github.com/RishiiShah/Traffic",
      },
      { type: "paper", url: "https://ieeexplore.ieee.org/document/11371065/" },
    ],
    featured: true,
    metrics: [
      { label: "End-to-End Accuracy", value: "93.76%" },
      { label: "Vehicle Detection", value: "97.56%" },
      { label: "Helmet Detection", value: "93.26%" },
      { label: "Plate Extraction", value: "92.7%" },
      { label: "ANPR Localization", value: "98%" },
      { label: "Violation Types", value: "5" },
    ],
    problem:
      "Automate traffic violation detection and evidence-backed ticketing at scale by detecting multiple violation types from live video feeds and delivering verifiable digital challans.",
    role: "Led the full computer vision pipeline: YOLO model evaluation and selection, vision-based license plate extraction via Groq Llama-4 Scout, challan metadata automation, and end-to-end cloud storage plus SMS notification.",
    architectureNotes: [
      "YOLOv12x selected through an automated evaluation harness across YOLOv11x/v12x nano-to-XL variants, fine-tuned on a custom traffic dataset covering red light jumping, speeding, helmet-less riding, missing insurance, and pollution non-compliance.",
      "Replaced traditional OCR that failed on angled low-light plates with the Groq Llama-4 Scout vision model as a fallback, followed by regex post-validation against Indian BH and state plate formats, reaching 92.7% plate extraction with 98% localization.",
      "Violation-to-notification pipeline runs frame-by-frame detection with trigger-point violation logic, stores evidence frames in AWS S3 with presigned URLs, and delivers Twilio SMS challans with fine amounts and evidence links.",
    ],
    challenges: [
      "Real-time detection under uncontrolled lighting, weather variations, and diverse camera angles.",
      "Speed estimation from video alone required pixel-to-distance calibration across successive frames to convert tracked movement into real-world km/h.",
      "Vision-model plate reads are not deterministic; when Llama-4 Scout cannot return a definitive answer, the pipeline retries with the sharpest successive frame after the violation.",
    ],
    lessons: [
      "ANPR must validate through multiple stages (vision extraction, regex, and structural checks) because raw model predictions frequently contain errors.",
      "Evidence collection and notification are as important as detection accuracy; a perfect detector creates no value if frames are lost or SMS delivery is unreliable.",
      "Model selection is a trade-off curve, not a single answer: extra-large variants earned their cost only on plate detection, while medium variants matched them on vehicle detection at a fraction of the memory.",
    ],
  },
  {
    slug: "wgan-gp-financial-timeseries",
    year: "2025",
    title: "Synthetic Financial Time Series via WGAN-GP",
    tagline:
      "Generative adversarial network for realistic stock market data synthesis with 98.83% downstream accuracy.",
    tech: ["Python", "PyTorch", "NumPy", "Pandas"],
    tags: ["MLOps", "Research"],
    impact:
      "Generative model producing statistically valid synthetic market data that augments training sets, improving downstream prediction from 97.93% to 98.83% accuracy.",
    featured: false,
    metrics: [
      { label: "Accuracy Gain", value: "97.93% to 98.83%" },
      { label: "Pearson Correlation", value: ">0.80" },
      { label: "R-squared", value: ">0.63" },
      { label: "Training Epochs", value: "3000" },
    ],
    problem:
      "Financial time-series datasets are scarce, noisy, and often proprietary. Training robust forecasters on limited historical data produces overfit models that miss regime changes and rare events.",
    role: "First author. Designed and implemented the full pipeline: WGAN-GP architecture, 3000-epoch training, synthetic-data filtering, and downstream prediction evaluation on unseen data.",
    architectureNotes: [
      "Wasserstein GAN with gradient penalty, not vanilla GAN. WGAN-GP stabilizes training on high-variance time-series data where vanilla GANs collapse.",
      "Generator concatenates past market windows with noise, then runs multi-head attention, temporal convolution blocks, two LSTM layers, and a GRU before a dense head. The critic is a Conv1D plus LeakyReLU stack trained 5 times per generator step with AdamW.",
      "Trained on AAPL daily data (Open, High, Low, Close, Adjusted Close, Volume) preprocessed with log returns and a hybrid standard plus min-max scaling scheme. Synthetic sequences are validated with Pearson, Spearman, and R-squared before being mixed into training sets.",
    ],
    challenges: [
      "Vanilla GAN training collapses on long financial time series. Wasserstein loss with gradient penalty was required for stable training over 3000 epochs.",
      "Validating synthetic quality needs multiple statistical measures. Visual plausibility alone is not sufficient; Pearson, Spearman, and R-squared were the real signal.",
      "Volume barely correlates with price features, making it the hardest series to synthesize; it had to be scaled and processed separately from the price columns.",
    ],
    lessons: [
      "Synthetic data augmentation is real and measurable: downstream accuracy moved from 97.93% to 98.83% with no change to the classifier architecture.",
      "GANs are temperamental. Training the critic 5 times per generator step with AdamW and Wasserstein loss made training dramatically more stable than the defaults.",
      "Spearman correlation exceeding Pearson was the tell that the generator produced varied scales while preserving trend, which is exactly what augmentation needs.",
    ],
  },
  {
    slug: "jarvis-voice-assistant",
    year: "2025",
    title: "JARVIS: Voice Assistant & Smart Home Automation",
    tagline:
      "Voice assistant with smart home automation: wake-word speech pipeline, Groq-hosted Llama 3.1 8B query processing, and Azure IoT Hub device control through Raspberry Pi GPIO.",
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
      "End-to-end voice-controlled home automation across four modules with secure cloud-edge device messaging and privacy-first handling of voice commands.",
    links: [
      { type: "source", url: "https://github.com/RishiiShah/Jarvis" },
      {
        type: "paper",
        url: "https://www.researchgate.net/profile/Vijay-Shelake/publication/393335295_Next-Gen_Predictive_Maintenancepage310_320/links/686616a5e4632b045dc9754a/Next-Gen-Predictive-Maintenancepage310-320.pdf#page=141",
      },
    ],
    featured: false,
    metrics: [
      { label: "Modules", value: "4" },
      { label: "LLM", value: "Llama 3.1 8B" },
      { label: "IoT Platform", value: "Azure IoT Hub" },
      { label: "Edge Device", value: "Pi 3B+" },
    ],
    problem:
      "Commercial smart-home assistants handle simple commands well but their limited natural language understanding fails on complex requests, and they are opaque about how voice data is stored and handled.",
    role: "End-to-end build: Django backend with authentication via django-allauth, Groq API integration for LLM inference, Raspberry Pi 3B+ device control, Azure IoT Hub messaging, and the wake-word speech pipeline.",
    architectureNotes: [
      "Four modules: deterministic keyword tasks, multi-threaded math and reminder handling, LLM query processing, and home automation. The wake word JARVIS triggers the speech pipeline after noise filtering.",
      "LLM queries are forwarded with guard prompts to Llama 3.1 8B hosted on Groq; prompt engineering filters harmful context and prevents exposure of private data before responses reach the user.",
      "Home automation commands flow through Azure IoT Hub to a Raspberry Pi 3B+ that toggles appliances via GPIO pins, with device state mirrored in a database and voice commands never cached on device.",
    ],
    challenges: [
      "Latency between question and response directly affects how natural the interaction feels; preloading common tasks and keeping deterministic commands out of the LLM path were the key mitigations.",
      "Speech recognition degrades in noisy environments and with diverse accents; spectral filtering and noise gating before wake-word detection materially improved recognition.",
      "Securing the device control path required per-device Azure IoT Hub configuration and account-gated access so only trusted users can drive appliances.",
    ],
    lessons: [
      "Deterministic fast paths for common commands (calculations, reminders, app launches) keep the assistant responsive without paying LLM cost on every query.",
      "Privacy is a design constraint, not a feature. Deciding never to persist voice commands shaped the entire pipeline.",
      "A managed IoT message bus beats ad-hoc sockets for device control reliability, especially across flaky home networks.",
    ],
  },
  {
    slug: "discord-admin-bot",
    year: "2023",
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
    year: "2024",
    title: "Music Genre Detection System",
    tagline:
      "Bi-LSTM ML pipeline using Librosa features achieving 98.73% accuracy with lightweight inference.",
    tech: ["Python", "TensorFlow", "Librosa", "NumPy", "Pandas", "Scikit-learn", "Streamlit"],
    tags: ["MLOps"],
    impact:
      "Production-grade audio genre classifier achieving 98.73% accuracy while reducing model size by 15% and improving inference speed by 22%.",
    links: [{ type: "source", url: "https://github.com/RishiiShah/Music" }],
    featured: false,
    metrics: [
      { label: "Accuracy", value: "98.73%" },
      { label: "Model Size", value: "-15%" },
      { label: "Inference Speed", value: "+22%" },
      { label: "Genres", value: "10" },
    ],
    problem:
      "Music genre classification needs fast inference for streaming apps, but most published research models are too large to deploy cheaply. The goal was a high-accuracy Bi-LSTM that could run in near-real-time on commodity hardware.",
    role: "Built the full pipeline: feature extraction (MFCC plus spectral features via Librosa), Bi-LSTM architecture in TensorFlow, training loop, post-training quantization, and a Streamlit demo app.",
    architectureNotes: [
      "Librosa extracts MFCC coefficients plus spectral centroid and rolloff. Features are normalized and fed into a 2-layer Bi-LSTM with dropout between layers.",
      "Post-training quantization shrinks the model by 15% and speeds inference by 22% at negligible accuracy cost. Deploy-time is materially better.",
      "Streamlit demo app uploads audio, extracts features on the fly, runs inference, and shows per-genre probability plus a confidence spark chart.",
    ],
    challenges: [
      "Audio lengths vary widely across the dataset. Fixed-window feature extraction drops information, but variable-length sequences were too slow for real-time use.",
      "Overlapping genres (pop versus rock, reggae versus ska) share spectral signatures. Rebalanced sampling and confusion-matrix-driven class reweighting were needed to classify reliably.",
      "Streamlit with a large Keras model has ugly cold-start UX. Post-training quantization plus lazy loading fixed it.",
    ],
    lessons: [
      "MFCC plus handcrafted spectral features beat raw spectrograms for this task and trained in a fraction of the time.",
      "Post-training quantization is almost free accuracy-wise and materially improves deployment UX. It should be the default, not an optimization.",
      "Data balance matters more than model capacity for overlapping-class classification. Spend time on sampling before spending it on architecture.",
    ],
  },
  {
    slug: "movie-recommendation-system",
    year: "2023",
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
    year: "2023",
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
    year: "2022",
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
  publisher?: string;
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
    venue: "2nd International Conference on Integration of Computational Intelligent System (ICICIS)",
    publisher: "IEEE",
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
    venue:
      "Explainable Artificial Intelligence, Volume 2: Bridging Concepts, Applications, and Future Challenges (Ch. 34, pp. 739-754)",
    publisher: "Scrivener Publishing",
    year: 2026,
    publishedAt: "2026",
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
