import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AmbientBeams } from "@/components/ui/AmbientBeams";
import { Grain } from "@/components/ui/Grain";
import { MotionRoot } from "@/components/MotionRoot";
import { bio } from "@/data";
import { getSiteUrl, sanitizeForMeta } from "@/lib/site";
import { buildStructuredData } from "@/lib/structured-data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: true,
});

const siteUrl = getSiteUrl();
const description = sanitizeForMeta(bio.description);
const metaTitleValue = sanitizeForMeta(bio.name + " | " + bio.title);

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: metaTitleValue,
    template: `%s | ${bio.name}`,
  },
  description,
  applicationName: `${bio.name} Portfolio`,
  keywords: [
    bio.name,
    "Software Engineer",
    "ML Engineer",
    "Machine Learning Engineer",
    "Computer Vision",
    "MLOps",
    "Backend Engineer",
    "Full Stack Developer",
    "Rutgers University",
    "Next.js Portfolio",
    "Python",
    "TypeScript",
    "PyTorch",
    "YOLO",
    "WGAN-GP",
    "Research",
    "IEEE Publication",
    "Software Engineering Intern",
  ],
  authors: [{ name: bio.name, url: siteUrl }],
  creator: bio.name,
  publisher: bio.name,
  alternates: {
    canonical: "/",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "profile",
    locale: "en_US",
    url: siteUrl,
    siteName: `${bio.name} Portfolio`,
    title: metaTitleValue,
    description,
    firstName: "Rishabh",
    lastName: "Shah",
    username: "RishiiShah",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${bio.name}, ${bio.title}`,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: metaTitleValue,
    description,
    creator: "@RishiiShah",
    site: "@RishiiShah",
    images: [
      {
        url: "/og-image.png",
        alt: `${bio.name}, ${bio.title}`,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  category: "technology",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#07090f" },
    { media: "(prefers-color-scheme: dark)", color: "#07090f" },
  ],
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              'if ("scrollRestoration" in history) history.scrollRestoration = "manual"; window.addEventListener("pageshow", function () { window.scrollTo(0, 0); });',
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: buildStructuredData() }}
        />
      </head>
      <body className="antialiased">
        <a
          href="#top"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-[var(--bg-elev-2)] focus:px-4 focus:py-2 focus:text-sm focus:text-[var(--ink)] focus:border focus:border-[var(--line-strong)]"
        >
          Skip to content
        </a>
        <AmbientBeams />
        <Grain />
        <MotionRoot>{children}</MotionRoot>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
