// Regenerates src/data/tech-icons.ts with only the icons the site uses.
// Run: npm run icons
import { createRequire } from "node:module";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";

const require = createRequire(import.meta.url);
const sets = {
  logos: require("@iconify-json/logos/icons.json"),
  si: require("@iconify-json/simple-icons/icons.json"),
};

// "logos:<name>" is full colour. "si:<name>#hex" is a Simple Icons glyph tinted with its brand colour.
// Icons with near-black parts also get a `-dark.svg` twin for the dark theme.
const MAP = {
  Python: "logos:python",
  Java: "logos:java",
  "C++": "logos:c-plusplus",
  C: "logos:c",
  TypeScript: "logos:typescript-icon",
  JavaScript: "logos:javascript",
  Django: "logos:django-icon",
  "Django ORM": "logos:django-icon",
  "Express.js": "si:express",
  "Next.js": "logos:nextjs-icon",
  React: "logos:react",
  "React Testing Library": "logos:testing-library",
  "REST APIs": "logos:rest",
  JWT: "si:jsonwebtokens#D63AFF",
  "JWT Auth": "si:jsonwebtokens#D63AFF",
  OAuth2: "logos:oauth",
  Zod: "logos:zod",
  "Tailwind CSS": "logos:tailwindcss-icon",
  HTML: "logos:html-5",
  CSS: "logos:css-3",
  Docker: "logos:docker-icon",
  Git: "logos:git-icon",
  GitHub: "logos:github-icon",
  "GitHub Actions": "logos:github-actions",
  "CI/CD": "logos:github-actions",
  Linux: "logos:linux-tux",
  PostgreSQL: "logos:postgresql",
  MySQL: "si:mysql#4479A1",
  MongoDB: "logos:mongodb-icon",
  SQLite: "si:sqlite#0F80CC",
  FTS5: "si:sqlite#0F80CC",
  Redis: "logos:redis",
  Prisma: "logos:prisma",
  AWS: "logos:aws",
  "AWS EC2": "logos:aws-ec2",
  "AWS S3": "logos:aws-s3",
  Azure: "logos:microsoft-azure",
  "Azure IoT Hub": "logos:microsoft-azure",
  GCP: "logos:google-cloud",
  "Google Cloud Run": "logos:google-cloud-run",
  Vercel: "logos:vercel-icon",
  Pytest: "si:pytest#0A9EDC",
  unittest: "logos:python",
  Vitest: "logos:vitest",
  Playwright: "logos:playwright",
  Postman: "logos:postman-icon",
  TensorFlow: "logos:tensorflow",
  PyTorch: "logos:pytorch-icon",
  "Scikit-learn": "si:scikitlearn#F7931E",
  OpenCV: "logos:opencv",
  YOLO: "si:ultralytics#0B23A9",
  YOLOv12x: "si:ultralytics#0B23A9",
  FastAPI: "logos:fastapi-icon",
  Flutter: "logos:flutter-icon",
  ECharts: "si:apacheecharts#AA344D",
  "Google Maps Platform": "logos:google-maps",
  OpenStreetMap: "si:openstreetmap#7EBC6F",
  "MTA open data": "si:mta#0039A6",
  MCP: "logos:model-context-protocol-icon",
  "VS Code Extension": "logos:visual-studio-code",
  "Groq API": "logos:groq",
  "Groq Llama-4": "logos:groq",
  ElevenLabs: "logos:elevenlabs-icon",
  BetterAuth: "si:betterauth",
  Twilio: "logos:twilio-icon",
  NumPy: "logos:numpy",
  Pandas: "logos:pandas-icon",
  "Raspberry Pi": "logos:raspberry-pi",
  "Node.js": "logos:nodejs-icon",
  "discord.js": "logos:discord-icon",
  Streamlit: "logos:streamlit",
  Bootstrap: "logos:bootstrap",
  "Google PaLM 2": "logos:google-palm",
  "Google Model Renderer": "logos:google-icon",
  "Claude Code": "logos:claude-icon",
  Claude: "logos:claude-icon",
  Codex: "logos:openai-icon",
  ChatGPT: "logos:openai-icon",
  Cursor: "logos:cursor-icon",
  "GitHub Copilot": "logos:github-copilot",
  Gemini: "logos:google-gemini-icon",
  Kiro: "logos:kiro",
  Matplotlib: "logos:matplotlib-icon",
  SciPy: "si:scipy#8CAAE6",
};

function resolve(set, name) {
  let icon = set.icons[name];
  const alias = set.aliases?.[name];
  if (!icon && alias) icon = set.icons[alias.parent];
  if (!icon) throw new Error(`Missing icon: ${name}`);
  return {
    body: icon.body,
    width: icon.width ?? set.width ?? 16,
    height: icon.height ?? set.height ?? 16,
  };
}

const INK = "#16130f";
const PAPER = "#f5f1e8";
// Logos whose black is a backdrop for light artwork, so recolouring it would hide the mark.
const KEEP_DARK = new Set(["logos:nextjs-icon", "logos:linux-tux", "logos:javascript", "logos:oauth"]);

// Near-black colours vanish on the dark theme, so the dark variant repaints them in PAPER.
function isInk(color) {
  if (color === "currentColor") return true;
  let h = color.slice(1);
  if (h.length === 3) h = [...h].map((c) => c + c).join("");
  if (h.length !== 6) return false;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance < 0.07 || (luminance < 0.2 && Math.max(r, g, b) - Math.min(r, g, b) < 0.1);
}

function paint(body, ink) {
  return body.replace(/(fill|stroke|stop-color)="([^"]+)"/g, (m, attr, color) =>
    isInk(color) ? `${attr}="${ink}"` : m,
  );
}

const dir = new URL("../public/tech/", import.meta.url);
rmSync(dir, { recursive: true, force: true });
mkdirSync(dir, { recursive: true });

const svg = (data, body, ink) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${data.width} ${data.height}"><g fill="${ink}">${body}</g></svg>`;

const out = {};
const written = new Set();
for (const [label, icon] of Object.entries(MAP)) {
  const [prefix, rest] = icon.split(":");
  const [name, tint] = rest.split("#");
  const data = resolve(sets[prefix], name);
  const body = tint ? data.body.replaceAll("currentColor", `#${tint}`) : data.body;
  const slug = `${prefix}-${name}`;

  // Shapes with no fill inherit the wrapper's ink, so they count as near-black too.
  const unfilled = /<(path|circle|rect|polygon|ellipse)(?![^>]*\bfill=)[^>]*>/.test(body);
  const hasInk = unfilled || paint(body, INK) !== paint(body, PAPER);
  const light = svg(data, paint(body, INK), INK);
  const dark = hasInk && !KEEP_DARK.has(`${prefix}:${name}`) ? svg(data, paint(body, PAPER), PAPER) : light;

  if (!written.has(slug)) {
    writeFileSync(new URL(`${slug}.svg`, dir), light);
    if (dark !== light) writeFileSync(new URL(`${slug}-dark.svg`, dir), dark);
    written.add(slug);
  }
  out[label] = {
    src: `/tech/${slug}.svg`,
    ...(dark !== light && { dark: `/tech/${slug}-dark.svg` }),
    ratio: +(data.width / data.height).toFixed(3),
  };
}

const file = `// Generated by scripts/build-tech-icons.mjs. Do not edit by hand.
export const techIcons: Record<string, { src: string; dark?: string; ratio: number }> = ${JSON.stringify(out, null, 2)};
`;
writeFileSync(new URL("../src/data/tech-icons.ts", import.meta.url), file);
console.log(`Wrote ${written.size} icons for ${Object.keys(out).length} labels`);
console.log("Dark variants:", Object.entries(out).filter(([, v]) => v.dark).map(([k]) => k).join(", "));
console.log("Wide:", Object.entries(out).filter(([, v]) => v.ratio > 1.3).map(([k, v]) => `${k} ${v.ratio}`).join(", "));
