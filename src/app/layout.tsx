import type { Metadata, Viewport } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "next-themes";
import { bio } from "@/data";
import { getSiteUrl, sanitizeForMeta } from "@/lib/site";
import { buildStructuredData } from "@/lib/structured-data";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
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
    { media: "(prefers-color-scheme: light)", color: "#f2efe8" },
    { media: "(prefers-color-scheme: dark)", color: "#0e0f11" },
  ],
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Before first paint: mark JS, and skip the intro after the first load of a browser session. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              'var d=document.documentElement;d.classList.add("js");try{if(sessionStorage.getItem("intro"))d.classList.add("intro-seen");else sessionStorage.setItem("intro","1")}catch(e){}',
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: buildStructuredData() }}
        />
      </head>
      <body className="antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-bg-2 focus:px-4 focus:py-2 focus:text-sm focus:text-ink focus:border focus:border-line"
        >
          Skip to content
        </a>
        <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
