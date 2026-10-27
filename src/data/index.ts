// ─── Bio ─────────────────────────────────────────────────────────────────────

export const bio = {
  name: "Rishabh Shah",
  title: "Software Engineer & ML Researcher",
  tagline: "Building at the intersection of engineering and intelligence.",
  description:
    "Rutgers M.S. Computer Science student and two-time hackathon winner building scalable backends, AI-enabled full-stack products, and computer vision research.",
  github: "https://github.com/RishiiShah",
  linkedin: "https://www.linkedin.com/in/rishabh-shah1/",
  resume: "/resume.pdf",
  location: "New Brunswick, NJ",
} as const;

// ─── Education ───────────────────────────────────────────────────────────────

export const education = [
  {
    degree: "M.S. in Computer Science",
    institution: "Rutgers University - New Brunswick",
    location: "New Brunswick, NJ",
    start: "September 2025",
    end: "May 2027",
    gpa: "3.83 / 4.0",
  },
  {
    degree: "B.Tech. in Artificial Intelligence & Data Science",
    institution: "University of Mumbai",
    location: "Mumbai, India",
    start: "December 2021",
    end: "June 2025",
    gpa: "7.76 / 10.0",
  },
] as const;

// ─── Skills ──────────────────────────────────────────────────────────────────

export interface StackGroup {
  name: string;
  blurb: string;
  items: string[];
  /** System design patterns applied at this layer, shown without logos. */
  patterns?: { name: string; detail: string }[];
}

export const stack: {
  tooling: StackGroup;
  layers: StackGroup[];
  pillars: StackGroup[];
  foundation: StackGroup;
} = {
  tooling: {
    name: "AI tooling",
    blurb: "Agents in the loop, me on the review.",
    items: ["Claude Code", "Codex", "Cursor", "Kiro", "Claude", "ChatGPT", "GitHub Copilot", "Gemini", "MCP"],
  },
  layers: [
    {
      name: "Frontend",
      blurb: "Interfaces people enjoy using.",
      items: ["Next.js", "React", "Tailwind CSS", "HTML", "CSS"],
    },
    {
      name: "Backend",
      blurb: "APIs that stay fast and stay secure.",
      items: ["Django", "Django ORM", "FastAPI", "Express.js", "Node.js", "REST APIs", "JWT Auth", "OAuth2", "RBAC", "Zod"],
      patterns: [
        { name: "API contracts", detail: "Consistent schemas, errors and status codes across endpoints" },
        { name: "Latency profiling", detail: "Finding the slow path before guessing at fixes" },
        { name: "Payload shaping", detail: "Trimming responses so the wire is not the bottleneck" },
        { name: "Event replay", detail: "Server-side state rebuilt from an event stream with an injected clock" },
        { name: "Role-based access", detail: "JWT sessions and permissions per admin, staff and client" },
      ],
    },
    {
      name: "AI / ML",
      blurb: "Training, tuning and shipping models.",
      items: ["PyTorch", "TensorFlow", "Scikit-learn", "OpenCV", "YOLO", "NumPy", "Pandas", "SciPy", "Matplotlib", "Groq API"],
      patterns: [
        { name: "Retrieval for agents", detail: "Full-text indexes and ranking to cut context tokens" },
        { name: "Multi-stage validation", detail: "Model output checked by regex and structural rules before use" },
      ],
    },
    {
      name: "Databases",
      blurb: "Where the data lives, indexed properly.",
      items: ["PostgreSQL", "MySQL", "MongoDB", "SQLite", "Redis", "Prisma"],
      patterns: [
        { name: "Indexing & query tuning", detail: "Targeted indexes and fewer ORM round trips" },
        { name: "Connection pooling", detail: "Sizing pools so the database is never the queue" },
        { name: "Append-only audit logs", detail: "Every privileged action traceable and reversible" },
      ],
    },
    {
      name: "Cloud",
      blurb: "Where it all runs.",
      items: ["AWS", "AWS EC2", "AWS S3", "Azure", "GCP", "Google Cloud Run", "Vercel"],
    },
  ],
  pillars: [
    {
      name: "DevOps & MLOps",
      blurb: "Getting it shipped, and keeping it shipped.",
      items: ["Docker", "GitHub Actions", "CI/CD", "Git", "GitHub", "Linux", "Streamlit"],
      patterns: [
        { name: "Containerized deploys", detail: "Docker images with reproducible environments" },
        { name: "Eval gates", detail: "Synthetic data and models validated on unseen data before use" },
      ],
    },
    {
      name: "Testing",
      blurb: "So deploys are boring.",
      items: ["Pytest", "unittest", "Vitest", "Playwright", "React Testing Library", "Postman"],
      patterns: [{ name: "Regression gates", detail: "55+ tests, zero rollbacks across 9 releases" }],
    },
  ],
  foundation: {
    name: "Languages",
    blurb: "What everything above is written in.",
    items: ["Python", "TypeScript", "JavaScript", "Java", "C++", "C", "SQL"],
  },
};

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
  /** Headline results, each taken from a bullet. */
  highlights?: { value: string; label: string }[];
}

/** Current campus role; kept apart from `experience`, which lists engineering internships. */
export const teaching = {
  role: "Teaching Assistant",
  organization: "Rutgers University",
  location: "New Brunswick, NJ",
  start: "September 2026",
  course: "CS205: Introduction to Discrete Structures I",
  courseShort: "CS205 Discrete Structures I",
  bullets: [
    "Lead weekly recitations for 50+ undergraduates on set notation, propositional logic, truth tables, and Boolean circuits.",
    "Teach first-order logic, predicates, quantifiers, and induction proofs for program correctness, trees, and grammars.",
    "Cover relations and closures, orders, equivalence relations, functions, and finite-state machines with CS applications.",
  ],
} as const;

export const experience: ExperienceItem[] = [
  {
    role: "Software Engineering Intern",
    organization: "Aaditya Technologies",
    location: "Mumbai, India",
    start: "January 2025",
    end: "July 2025",
    summary:
      "Django backend performance, API contracts, JWT/RBAC security, and Dockerized AWS deployments.",
    bullets: [
      "Reduced P95 API latency by 86% (3,100 ms to 420 ms) by profiling Django request paths, optimizing ORM-generated MySQL queries, adding targeted indexes, tuning connection pooling, and trimming response payloads.",
      "Reduced recurring API integration defects by 30% across 12+ REST endpoints by standardizing Django serializer validation, request and response schemas, error handling, and HTTP status codes.",
      "Secured 4 Django backend components by implementing JWT authentication and RBAC for admin, staff, and client roles.",
      "Reduced deployment setup effort by 65% for a 4-person team by containerizing Django services with Docker and standardizing AWS EC2, S3, and environment configuration.",
    ],
    tech: ["Django", "Django ORM", "MySQL", "REST APIs", "JWT", "RBAC", "Docker", "AWS"],
    highlights: [
      { value: "−86%", label: "P95 latency, 3,100 → 420 ms" },
      { value: "−30%", label: "API integration defects" },
    ],
  },
  {
    role: "Web Developer Intern",
    organization: "Creative Line",
    location: "Mumbai, India",
    start: "June 2024",
    end: "September 2024",
    summary: "Next.js features on Express.js services, MySQL performance work, and test-gated releases.",
    bullets: [
      "Reduced P95 API latency by 50% (620 ms to 310 ms) across 8 endpoints by optimizing Express.js handlers, indexing MySQL queries, and eliminating redundant database calls.",
      "Shipped 4 customer-facing features across 10+ REST API endpoints by building Next.js interfaces, Express.js services, and validated MySQL CRUD workflows.",
      "Achieved zero rollbacks across 9 production deployments by writing 55+ automated tests and enforcing regression testing, defect fixes, and pre-release validation.",
    ],
    tech: ["Next.js", "Express.js", "MySQL", "REST APIs"],
    highlights: [
      { value: "−50%", label: "P95 latency, 620 → 310 ms" },
      { value: "0", label: "Rollbacks in 9 deploys" },
    ],
  },
];

// ─── Projects ────────────────────────────────────────────────────────────────

export interface ProjectLink {
  type: "demo" | "video" | "source" | "paper" | "blog";
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
  award?: string;
  metrics?: ProjectMetric[];
  problem?: string;
  /** One line each for the Selected work card: the problem, what was built, what came of it. */
  caseStudy?: { problem: string; built: string; result: string };
  role?: string;
  architectureNotes?: string[];
  challenges?: string[];
  lessons?: string[];
  year?: string;
}

export const projects: Project[] = [
  {
    slug: "cerevia",
    caseStudy: {
      problem: "Late stroke consults and uncovered shifts get noticed only once they are already late.",
      built: "An event-replay engine that spots coverage gaps 90 minutes ahead and proposes the cheapest safe fix.",
      result: "Won the Sevaro × Rutgers Health Hack. Every action is approved and audit-logged.",
    },
    year: "2026",
    title: "Cerevia",
    tagline:
      "Tele-neurology operations command center that replays a live event stream, spots coverage gaps before they happen, and staffs them through an approval loop.",
    tech: ["Python", "FastAPI", "PostgreSQL", "React", "TypeScript", "Flutter", "ECharts", "Docker"],
    tags: ["Full-stack", "Backend", "Systems"],
    latest: true,
    featured: true,
    award: "Winner, Sevaro × Rutgers Health Hack",
    impact:
      "Won the Sevaro / Rutgers Health Hack: detects breaching consults, demand surges, and coverage gaps up to 90 minutes ahead, then proposes the cheapest safe fix and runs it end to end with an append-only audit log.",
    links: [
      { type: "video", url: "https://youtu.be/FweJcTVSq0c" },
      { type: "source", url: "https://github.com/RishiiShah/Health-Hack" },
    ],
    metrics: [
      { label: "Lookahead", value: "90 min" },
      { label: "Roles", value: "3" },
      { label: "Engine", value: "Deterministic" },
      { label: "Pipeline", value: "Detect · Decide · Act" },
    ],
    problem:
      "Tele-neurology coordinators route consults across a network of hospitals in real time. A stroke consult left waiting or a shift that ends without credentialed cover is usually noticed only once it is already late.",
    architectureNotes: [
      "Rebuilds physician and consult state by replaying an event stream server-side, with an injected clock, so every decision is deterministic and explainable.",
      "Detect, decide, act: flags breaching time standards, demand surges, and coverage gaps; picks the cheapest safe fix (reassign, escalate, wait, or a short split shift) and names the approver.",
      "Act loop runs propose → clinical-lead approval → send → accept, decline, or 10-minute timeout → recompute coverage, with every step in an append-only PostgreSQL audit log.",
      "FastAPI backend with an OpenAPI contract that generates the React dashboard's types; a Flutter app gives the clinical lead and physicians their own role-based views.",
    ],
    challenges: [
      "The split-shift trap: a called-in physician can absorb every new call instead of relieving the gap, so a simulation guard checks each offer before it is sent.",
      "Explaining why each off-shift physician was or wasn't offered a shift, rule by rule, without any ML to hide behind.",
    ],
  },
  {
    slug: "planyt",
    caseStudy: {
      problem: "Days out in New York fall apart on logistics: zig-zag routes, peak crowds, closed doors.",
      built: "One sentence in, an ordered itinerary timed to travel, opening hours and subway crowds.",
      result: "Best Use of Backboard (MLH) at DivHacks 2026.",
    },
    year: "2026",
    title: "PlaNYt",
    tagline:
      "Plans a day in New York from one sentence, ordering the stops around travel time, opening hours, and how crowded each neighborhood is.",
    tech: ["Next.js", "Google Maps Platform", "OpenStreetMap", "MTA open data", "Open-Meteo", "Vercel"],
    tags: ["Full-stack"],
    award: "Best Use of Backboard (MLH), DivHacks 2026",
    impact:
      "Won Best Use of Backboard (MLH) at DivHacks 2026, built for the Move Smarter track: one sentence in, a whole day out, with each stop timed for its quiet hour and crowd levels drawn from MTA subway ridership.",
    links: [{ type: "demo", url: "https://planyt.tech" }],
    metrics: [
      { label: "Input", value: "1 sentence" },
      { label: "Data sources", value: "6" },
      { label: "Crowd signal", value: "MTA ridership" },
      { label: "Hackathon", value: "DivHacks '26" },
    ],
    problem:
      "A day out in New York usually falls apart on logistics: zig-zagging between boroughs, reaching a landmark at its busiest hour, or arriving after it has closed.",
    architectureNotes: [
      "Turns a free-text description of the day into an ordered itinerary, timed around travel between stops and each place's opening hours.",
      "Estimates crowds from MTA subway ridership near each stop, and schedules every stop for its quiet hour.",
      "Shows the plan on a 3D city from Google Maps Platform, with places and streets from OpenStreetMap, weather from Open-Meteo, and photos from Wikimedia Commons.",
    ],
  },
  {
    slug: "csegraph",
    caseStudy: {
      problem: "Coding agents burn tokens and tool calls hunting through a repository for context.",
      built: "A Tree-sitter symbol graph in SQLite, queried with BM25 and graph walks under a token budget.",
      result: "82% less context per task (1,540 → 273 tokens), served over a CLI and 6 MCP tools.",
    },
    year: "2026",
    title: "CseGraph",
    tagline:
      "Local-first code context engine and developer tooling: CLI, MCP server, SDK, SQLite graph index, and VS Code wrapper for coding agents.",
    tech: ["Python", "SQLite", "Tree-sitter", "FTS5", "MCP", "VS Code Extension"],
    tags: ["Systems", "Backend", "Developer Tools"],
    impact:
      "Adaptive FTS/BM25 and graph-proximity retrieval with token budgets and strict schemas, serving task-scoped context across 9 CLI commands and 6 MCP tools.",
    links: [{ type: "source", url: "https://github.com/RishiiShah/Csegraph" }],
    featured: true,
    metrics: [
      { label: "CLI Commands", value: "9" },
      { label: "MCP Tools", value: "6" },
      { label: "Languages Indexed", value: "Python, JS, TS" },
      { label: "Index Store", value: "SQLite" },
    ],
    problem:
      "Coding agents waste tool calls and prompt tokens searching repositories for context. Brute-force file reads miss dependencies, and embedding-only approaches lose structural relationships between symbols.",
    role: "Sole developer. Engineered a local-first Python developer tool spanning a CLI, MCP stdio server, SDK facade, SQLite graph index, and VS Code wrapper to generate compact repository context for coding agents.",
    architectureNotes: [
      "Tree-sitter indexing pipeline for Python, JavaScript, and TypeScript extracts files, symbols, imports, calls, inheritance, tests, and source references into a transactional SQLite graph.",
      "Adaptive retrieval combines FTS/BM25, graph proximity, token budgets, and strict schemas to return task-scoped context.",
      "Surfaces compact context through 9 CLI commands and 6 MCP tools for agent workflows.",
    ],
    challenges: [
      "Keeping a single retrieval pipeline accurate across Python, JavaScript, and TypeScript while preserving structural fidelity in the graph.",
      "Returning budget-safe context: too little misses critical dependencies, too much wastes agent tokens.",
      "Exposing the same index consistently through CLI, MCP, SDK, and a VS Code wrapper without drifting schemas.",
    ],
    lessons: [
      "Graph structure captures relationships that pure text search cannot. Even shallow graph proximity surfaces context keyword matching misses.",
      "Strict response schemas make agent tooling reliable; free-form dumps create brittle consumers.",
      "Local-first indexing keeps agent context fast and private without shipping whole repositories to a model.",
    ],
  },
  {
    slug: "snap-interview",
    caseStudy: {
      problem: "Interview practice tools grade answers but miss communication and per-skill signal.",
      built: "A layered Next.js and Prisma platform: resume parsing, streamed Groq interviews, S3 recordings.",
      result: "Scores from 0 to 100 per skill across 28 role prompts, with shareable results.",
    },
    year: "2026",
    title: "SnapInterview",
    tagline:
      "Backend-heavy full-stack AI interview platform with layered APIs, Prisma/PostgreSQL persistence, and secure account lifecycle features.",
    tech: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Groq API", "AWS S3", "ElevenLabs", "BetterAuth"],
    tags: ["Full-stack", "AI/ML"],
    impact:
      "End-to-end interview pipeline for resume PDF parsing, streaming LLM responses via Groq, transcript and evaluation persistence, shareable results, and S3 multipart recording uploads.",
    links: [
      { type: "demo", url: "https://snapinterview.app" },
    ],
    featured: true,
    metrics: [
      { label: "Eval Scale", value: "0 to 100" },
      { label: "Role Prompts", value: "28" },
      { label: "Rate-Limited Endpoint Types", value: "4" },
    ],
    problem:
      "Early-career engineers practicing for interviews get either generic AI feedback or nothing at all. Existing tools grade correctness but miss communication, structure, and per-skill signal.",
    role: "Architected a full-stack Next.js and TypeScript platform using layered API routes, service logic, repository modules, Prisma models, and PostgreSQL persistence for interview sessions, transcripts, feedback, users, and admin operations.",
    architectureNotes: [
      "Secure account lifecycle with Better Auth, Google OAuth, OTP email verification, password reset, account lockout, protected route gating, and admin-only access controls.",
      "Interview pipeline covers resume PDF parsing, streaming LLM responses via Groq, transcript and evaluation persistence, shareable results, and S3 multipart recording uploads for reviewable mock interviews.",
      "Hardened upload and auth surface: presigned S3 keys scoped to per-user prefixes, origin-based CSRF protection and Postgres-backed rate limits across 4 endpoint types.",
    ],
    challenges: [
      "Coordinating resume parsing, LLM streaming, evaluation persistence, and multipart S3 uploads without race conditions.",
      "Open-ended answers drift between sessions; calibration with role-specific prompts and schema enforcement was essential for consistency.",
      "Security surface spans login, OTP, eval, and upload endpoints, and each required independent rate limiting and CSRF hardening.",
    ],
    lessons: [
      "Layered API, service, and repository boundaries keep a backend-heavy Next.js app maintainable as auth and interview flows grow.",
      "Schema-enforced AI outputs are dramatically more reliable than parsing free-text prose.",
      "Account lockout, OTP, and admin gating belong in the core auth design, not as afterthought middleware.",
    ],
  },
  {
    slug: "traffic-violation-detection",
    caseStudy: {
      problem: "Ticketing traffic violations by hand does not scale and leaves weak evidence.",
      built: "A YOLOv12x and ByteTrack pipeline for red-light, helmet and speeding, with OCR on plates.",
      result: "93.76% end to end, with PDF challans sent by SMS. Published at IEEE ICICIS 2025.",
    },
    year: "2025",
    title: "Traffic Violation Detection & Automated Ticketing",
    tagline:
      "Computer vision backend pipeline for red-light, helmet, and speeding detection with OCR, PDF challans, cloud storage, and SMS delivery.",
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
      "Modular Python pipeline coordinating detection workflows through OCR, validation, PDF generation, AWS S3 storage, and Twilio SMS into an automated ticketing workflow.",
    links: [
      {
        type: "source",
        url: "https://github.com/RishiiShah/Traffic",
      },
      { type: "paper", url: "https://ieeexplore.ieee.org/document/11371065/" },
    ],
    featured: false,
    metrics: [
      { label: "End-to-End Accuracy", value: "93.76%" },
      { label: "Vehicle Detection", value: "97.56%" },
      { label: "Helmet Detection", value: "93.26%" },
      { label: "Plate Extraction", value: "92.7%" },
      { label: "ANPR Localization", value: "98%" },
      { label: "Indexing", value: "Scopus" },
    ],
    problem:
      "Automate traffic violation detection and evidence-backed ticketing at scale by detecting multiple violation types from live video feeds and delivering verifiable digital challans.",
    role: "Orchestrated a modular Python processing pipeline coordinating red-light, helmet, and speeding detection before routing violation data through OCR, validation, PDF generation, cloud storage, and SMS delivery.",
    architectureNotes: [
      "Integrated Llama 4 Scout via Groq for license plate OCR, regex-based plate validation, vehicle registration verification, Jinja2/pdfkit document generation, AWS S3 storage, and Twilio messaging.",
      "Stateful video-processing with ByteTrack object tracking, per-vehicle state management, duplicate-ticket suppression, and frame-skipping for automated speeding enforcement.",
      "YOLOv12x fine-tuned on a custom traffic dataset covering red light jumping, speeding, helmet-less riding, missing insurance, and pollution non-compliance.",
    ],
    challenges: [
      "Real-time detection under uncontrolled lighting, weather variations, and diverse camera angles.",
      "Speed estimation from video alone required pixel-to-distance calibration across successive frames to convert tracked movement into real-world km/h.",
      "Vision-model plate reads are not deterministic; when Llama-4 Scout cannot return a definitive answer, the pipeline retries with the sharpest successive frame after the violation.",
    ],
    lessons: [
      "ANPR must validate through multiple stages (vision extraction, regex, and structural checks) because raw model predictions frequently contain errors.",
      "Evidence collection and notification are as important as detection accuracy; a perfect detector creates no value if frames are lost or SMS delivery is unreliable.",
      "Duplicate-ticket suppression and per-vehicle state are required for trustworthy automated enforcement over long video streams.",
    ],
  },
  {
    slug: "wgan-gp-financial-timeseries",
    caseStudy: {
      problem: "Financial series are scarce and noisy, so forecasters overfit and miss rare events.",
      built: "A WGAN-GP with attention, temporal convolutions and LSTMs that generates realistic market series.",
      result: "Synthetic data lifted downstream accuracy from 97.93% to 98.83%.",
    },
    year: "2025",
    title: "Synthetic Financial Time Series via WGAN-GP",
    tagline:
      "Generative adversarial network for realistic stock market data synthesis with 98.83% downstream accuracy.",
    tech: ["Python", "PyTorch", "NumPy", "Pandas"],
    tags: ["MLOps", "Research"],
    links: [{ type: "paper", url: "https://onlinelibrary.wiley.com/doi/10.1002/9781394357789.ch34" }],
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
    caseStudy: {
      problem: "Smart speakers fumble complex requests and are opaque about voice data.",
      built: "A wake-word pipeline, guarded Llama 3.1 8B on Groq, and Pi GPIO control over Azure IoT Hub.",
      result: "A four-module assistant that runs a home end to end, privacy-first. Published at ISTE 2025.",
    },
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
    featured: true,
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
    caseStudy: {
      problem: "Accurate genre models are usually too heavy to serve cheaply in real time.",
      built: "Librosa MFCC features into a 2-layer Bi-LSTM, then post-training quantization.",
      result: "98.73% accuracy, with a model 15% smaller and 22% faster at inference.",
    },
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

// ─── AI/ML lab ────────────────────────────────────────────────────────────────

export interface LabModel {
  slug: Project["slug"];
  name: string;
  kind: string;
  stages: { label: string; detail: string }[];
  stats: { value: string; label: string }[];
  /** Index into the project's `lessons` for the pull quote. */
  lesson: number;
}

export const labModels: LabModel[] = [
  {
    slug: "traffic-violation-detection",
    name: "Traffic surveillance",
    kind: "Computer vision",
    stages: [
      { label: "Live video", detail: "Roadside camera feeds, frame-skipped for speed" },
      { label: "YOLOv12x", detail: "Fine-tuned on red lights, helmets and speeding" },
      { label: "ByteTrack", detail: "Per-vehicle state and duplicate-ticket suppression" },
      { label: "Llama 4 Scout", detail: "Plate OCR, then regex and registry checks" },
      { label: "Challan", detail: "PDF evidence to S3, delivered by Twilio SMS" },
    ],
    stats: [
      { value: "93.76%", label: "End-to-end accuracy" },
      { value: "97.56%", label: "Vehicle detection" },
      { value: "92.7%", label: "Plate extraction" },
    ],
    lesson: 0,
  },
  {
    slug: "wgan-gp-financial-timeseries",
    name: "Synthetic markets",
    kind: "Generative model",
    stages: [
      { label: "Market windows", detail: "AAPL daily OHLCV as log returns, plus noise" },
      { label: "Attention", detail: "Multi-head attention over the past window" },
      { label: "TCN · LSTM · GRU", detail: "Temporal convolutions into recurrent layers" },
      { label: "WGAN-GP critic", detail: "Conv1D critic, 5 steps per generator step" },
      { label: "Filter & mix", detail: "Pearson, Spearman and R² gate what joins training" },
    ],
    stats: [
      { value: "98.83%", label: "Downstream accuracy, from 97.93%" },
      { value: ">0.80", label: "Pearson correlation" },
      { value: "3000", label: "Training epochs" },
    ],
    lesson: 0,
  },
  {
    slug: "music-genre-detection",
    name: "Genre classifier",
    kind: "Audio",
    stages: [
      { label: "Audio clip", detail: "Uploaded track, features extracted on the fly" },
      { label: "Librosa", detail: "MFCCs plus spectral centroid and rolloff" },
      { label: "Bi-LSTM", detail: "Two bidirectional layers with dropout" },
      { label: "Quantize", detail: "Post-training quantization for cheap serving" },
      { label: "Streamlit", detail: "Per-genre probabilities and confidence" },
    ],
    stats: [
      { value: "98.73%", label: "Accuracy across 10 genres" },
      { value: "−15%", label: "Model size" },
      { value: "+22%", label: "Inference speed" },
    ],
    lesson: 0,
  },
  {
    slug: "jarvis-voice-assistant",
    name: "JARVIS",
    kind: "Voice + LLM",
    stages: [
      { label: "Wake word", detail: "“JARVIS”, after noise filtering" },
      { label: "Speech to text", detail: "Spectral filtering for accents and noisy rooms" },
      { label: "Fast path", detail: "Math, reminders and apps skip the LLM entirely" },
      { label: "Llama 3.1 8B", detail: "On Groq, behind guard prompts for privacy" },
      { label: "Home", detail: "Azure IoT Hub to Raspberry Pi GPIO" },
    ],
    stats: [
      { value: "4", label: "Modules" },
      { value: "0", label: "Voice commands stored" },
      { value: "ISTE", label: "Published 2025" },
    ],
    lesson: 0,
  },
  {
    slug: "csegraph",
    name: "CseGraph",
    kind: "Retrieval for agents",
    stages: [
      { label: "Repository", detail: "Python, JavaScript and TypeScript sources" },
      { label: "Tree-sitter", detail: "Symbols, imports, calls and tests into a SQLite graph" },
      { label: "FTS5 · BM25", detail: "Keyword search fused with graph proximity" },
      { label: "Token budget", detail: "Only the context the task actually needs" },
      { label: "MCP tools", detail: "Served to coding agents over 6 tools and a CLI" },
    ],
    stats: [
      { value: "−82%", label: "Context per task, 1,540 → 273 tokens" },
      { value: "177K+", label: "Symbols indexed" },
      { value: "379", label: "Tests passing" },
    ],
    lesson: 0,
  },
  {
    slug: "snap-interview",
    name: "SnapInterview",
    kind: "LLM evaluation",
    stages: [
      { label: "Résumé PDF", detail: "Parsed into skills and experience" },
      { label: "Role prompt", detail: "One of 28 role-specific interview scripts" },
      { label: "Groq stream", detail: "Questions streamed live, answers recorded to S3" },
      { label: "Schema scoring", detail: "Structured output, scored 0 to 100 per skill" },
      { label: "Shareable report", detail: "Transcript and feedback, saved in Postgres" },
    ],
    stats: [
      { value: "28", label: "Role prompts" },
      { value: "0–100", label: "Per-skill scoring" },
      { value: "4", label: "Rate-limited endpoint types" },
    ],
    lesson: 1,
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
  projectSlug?: Project["slug"];
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
    projectSlug: "traffic-violation-detection",
    featured: false,
    links: [{ type: "paper", url: "https://ieeexplore.ieee.org/document/11371065/" }],
  },
  {
    title:
      "Bridging Financial Data Gaps with WGAN-GP: Generating Synthetic Time Series for Robust Models",
    venue:
      "Explainable Artificial Intelligence, Volume 2: Bridging Concepts, Applications, and Future Challenges (Ch. 34, pp. 739-754)",
    publisher: "Wiley · Scrivener Publishing",
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
    projectSlug: "wgan-gp-financial-timeseries",
    featured: true,
    links: [{ type: "paper", url: "https://onlinelibrary.wiley.com/doi/10.1002/9781394357789.ch34" }],
  },
  {
    title: "JARVIS: Voice Assistant with Smart Home Automation",
    venue: "International Conference on STEM for Sustainable Development 2025",
    year: 2025,
    publishedAt: "June 2025",
    authors: ["Rishabh Shah", "Alan George", "Yukta Saraf", "Rujuta Jariwala"],
    abstract:
      "This paper explores the integration of virtual assistant technology with home automation systems. JARVIS leverages NLP to understand user requests and perform tasks such as information retrieval, media control, and mathematical calculations. We utilize AI and NLP libraries for improving speech recognition, utilizing Raspberry Pi 3B+ for IoT device control. The system prioritizes user security by ensuring data privacy and is deployed over the Internet for home automation.",
    projectSlug: "jarvis-voice-assistant",
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
