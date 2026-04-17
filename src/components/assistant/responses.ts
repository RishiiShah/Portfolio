import {
  bio,
  education,
  skills,
  experience,
  projects,
  publications,
} from "@/data";
import { sanitizeForMeta } from "@/lib/site";

export interface Rule {
  id: string;
  keywords: string[];
  build: () => string;
}

const fmt = {
  nl: "\n",
  bullet: "  • ",
  heading: (text: string) => `${text}\n${"─".repeat(Math.min(text.length, 40))}`,
};

const projectSummary = (slug: string) => {
  const p = projects.find((pr) => pr.slug === slug);
  if (!p) return "";
  const metrics = p.metrics ? p.metrics.map((m) => `${m.value} ${m.label.toLowerCase()}`).join(" · ") : "";
  return [
    fmt.heading(p.title),
    p.tagline,
    p.impact ? `\nImpact: ${p.impact}` : "",
    metrics ? `\nMetrics: ${metrics}` : "",
    p.tech?.length ? `Stack: ${p.tech.join(", ")}` : "",
    p.links?.length
      ? `Links: ${p.links.map((l) => `${l.type} → ${l.url}`).join("  ")}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");
};

export const rules: Rule[] = [
  {
    id: "greeting",
    keywords: ["hi", "hello", "hey", "yo", "sup", "start"],
    build: () =>
      [
        `Hi, I'm Jarvis, ${bio.name}'s portfolio assistant.`,
        "",
        "Ask me about projects, publications, experience, skills, education, or contact.",
        "Try one of the chips below, or type something like 'show me the WGAN paper'.",
      ].join("\n"),
  },
  {
    id: "about",
    keywords: ["about", "who", "whoami", "yourself", "intro", "bio"],
    build: () =>
      [
        fmt.heading(`About ${bio.name}`),
        sanitizeForMeta(bio.description),
        "",
        `Role: ${bio.title}`,
        `Location: ${bio.location}`,
        `Status: Open to SWE / systems / ML-AI roles.`,
      ].join("\n"),
  },
  {
    id: "projects",
    keywords: ["project", "projects", "work", "portfolio", "build", "built"],
    build: () => {
      const featured = projects.filter((p) => p.featured);
      const latest = projects.filter((p) => p.latest);
      const lines = [
        fmt.heading(`${projects.length} projects total`),
        "",
        latest.length
          ? `★ Latest → ${latest.map((p) => p.title).join(", ")}`
          : "",
        featured.length
          ? `⚑ Featured → ${featured.map((p) => p.title).join(", ")}`
          : "",
        "",
        "Top picks:",
        ...projects
          .slice(0, 5)
          .map((p) => `${fmt.bullet}${p.title}: ${p.tagline.slice(0, 80)}${p.tagline.length > 80 ? "…" : ""}`),
        "",
        "Type a project name (e.g. 'traffic violation', 'snap', 'wgan', 'jarvis') for detail.",
      ];
      return lines.filter(Boolean).join("\n");
    },
  },
  {
    id: "traffic",
    keywords: ["traffic", "violation", "yolo", "anpr", "ocr", "ieee"],
    build: () => projectSummary("traffic-violation-detection"),
  },
  {
    id: "snap",
    keywords: ["snap", "interview", "mock interview"],
    build: () => projectSummary("snap-interview"),
  },
  {
    id: "wgan",
    keywords: ["wgan", "gan", "synthetic", "financial", "time series", "stock"],
    build: () => projectSummary("wgan-gp-financial-timeseries"),
  },
  {
    id: "jarvis",
    keywords: ["jarvis", "voice", "iot", "raspberry", "smart home"],
    build: () => projectSummary("jarvis-voice-assistant"),
  },
  {
    id: "music",
    keywords: ["music", "genre", "librosa", "audio"],
    build: () => projectSummary("music-genre-detection"),
  },
  {
    id: "movie",
    keywords: ["movie", "recommendation", "tmdb"],
    build: () => projectSummary("movie-recommendation-system"),
  },
  {
    id: "ar",
    keywords: ["ar", "augmented reality", "palm"],
    build: () => projectSummary("ar-interaction-platform"),
  },
  {
    id: "discord",
    keywords: ["discord", "bot", "moderation"],
    build: () => projectSummary("discord-admin-bot"),
  },
  {
    id: "banking",
    keywords: ["bank", "banking", "java", "bluej"],
    build: () => projectSummary("banking-system-bluej"),
  },
  {
    id: "publications",
    keywords: ["paper", "publication", "publications", "research", "ieee", "published"],
    build: () =>
      [
        fmt.heading(`${publications.length} publications`),
        ...publications.map(
          (p) =>
            `${fmt.bullet}${p.title}\n    ${p.venue} · ${p.publishedAt ?? p.year} · ${p.authors.length} authors${p.featured ? " · ★ featured" : ""}`
        ),
      ].join("\n"),
  },
  {
    id: "experience",
    keywords: [
      "experience",
      "intern",
      "internship",
      "job",
      "work history",
      "career",
    ],
    build: () =>
      [
        fmt.heading(`${experience.length} internships`),
        ...experience.flatMap((e) => [
          "",
          `${e.role} @ ${e.organization}`,
          `${e.start} – ${e.end}${e.location ? ` · ${e.location}` : ""}`,
          e.summary ? e.summary : "",
          ...e.bullets.slice(0, 2).map((b) => `  › ${b}`),
        ]),
      ]
        .filter(Boolean)
        .join("\n"),
  },
  {
    id: "skills",
    keywords: [
      "skill",
      "skills",
      "stack",
      "tech",
      "technology",
      "language",
      "languages",
      "tools",
    ],
    build: () =>
      [
        fmt.heading("Stack"),
        ...skills.map((s) => `${s.category}: ${s.items.join(", ")}`),
      ].join("\n"),
  },
  {
    id: "education",
    keywords: [
      "education",
      "school",
      "university",
      "college",
      "rutgers",
      "djsce",
      "degree",
      "graduate",
    ],
    build: () =>
      [
        fmt.heading("Education"),
        ...education.map(
          (e) =>
            `${fmt.bullet}${e.degree}\n    ${e.institution} · ${e.location} · ${e.start}–${e.end}`
        ),
      ].join("\n"),
  },
  {
    id: "contact",
    keywords: ["contact", "reach", "email", "message", "hire", "collab"],
    build: () =>
      [
        fmt.heading("Contact"),
        `${fmt.bullet}Email: ${bio.email}`,
        `${fmt.bullet}GitHub: ${bio.github}`,
        `${fmt.bullet}LinkedIn: ${bio.linkedin}`,
        `${fmt.bullet}Location: ${bio.location}`,
        "",
        "Or scroll to the Contact section and use the form.",
      ].join("\n"),
  },
  {
    id: "resume",
    keywords: ["resume", "cv", "download"],
    build: () =>
      `Resume is a click away: ${bio.resume}\n\nFor the short version, ask about 'projects', 'publications', or 'experience'.`,
  },
  {
    id: "location",
    keywords: ["where", "location", "based", "live", "nj", "new jersey"],
    build: () =>
      `Based in ${bio.location}. Originally from Mumbai, India. Open to roles in NY/NJ/Boston/Bay Area and remote.`,
  },
  {
    id: "help",
    keywords: ["help", "menu", "options", "commands", "what can you do"],
    build: () =>
      [
        "Try asking about:",
        "",
        `${fmt.bullet}projects        → ${projects.length} shipped projects`,
        `${fmt.bullet}publications    → ${publications.length} peer-reviewed papers`,
        `${fmt.bullet}experience      → internships + impact`,
        `${fmt.bullet}skills          → stack & tools`,
        `${fmt.bullet}education       → Rutgers, DJSCE`,
        `${fmt.bullet}contact         → email, socials`,
        `${fmt.bullet}resume          → download link`,
        "",
        "Or a project name like 'traffic', 'snap', 'wgan', 'jarvis'.",
      ].join("\n"),
  },
];

export function respond(input: string): string {
  const q = input.trim().toLowerCase();
  if (!q) return rules.find((r) => r.id === "help")!.build();

  // Greeting special-case
  if (/^(hi|hello|hey|yo|sup)\b/.test(q)) {
    return rules.find((r) => r.id === "greeting")!.build();
  }

  // Score rules by keyword matches
  let best: { rule: Rule; score: number } | null = null;
  for (const rule of rules) {
    let score = 0;
    for (const kw of rule.keywords) {
      if (q.includes(kw)) score += kw.length;
    }
    if (score > 0 && (!best || score > best.score)) best = { rule, score };
  }

  if (best) return best.rule.build();

  return [
    "Hmm, I don't have a canned answer for that.",
    "",
    "I can answer about projects, publications, experience, skills, education, or contact.",
    "",
    "Try one of the chips below. Or type 'help' for the full menu.",
  ].join("\n");
}

export const suggestedPrompts = [
  "show me featured projects",
  "tell me about the WGAN paper",
  "what's your stack?",
  "how do I contact you?",
] as const;
