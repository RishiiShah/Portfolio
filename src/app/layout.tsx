import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Footer } from "@/components/Footer";
import { ThreeBackground } from "@/components/ThreeBackground";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { JetBrains_Mono } from "next/font/google";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

// Get site URL from environment variable or use default
// Vercel automatically provides VERCEL_URL for deployments
// Set NEXT_PUBLIC_SITE_URL in Vercel environment variables if you want to override with your custom domain
const getSiteUrl = (): string => {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.startsWith('http') 
      ? process.env.NEXT_PUBLIC_SITE_URL 
      : `https://${process.env.NEXT_PUBLIC_SITE_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  // Default fallback for local development
  return "https://rishabhshah.vercel.app";
};

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Rishabh Shah — MS CS (Software & Systems) | Scalable systems & ML-enabled apps",
    template: "%s — Rishabh Shah",
  },
  description: "I build scalable backend systems and ML-enabled applications. MS CS (Software & Systems) at Rutgers University; B.Tech in AI & Data Science at Dwarkadas J. Sanghvi College of Engineering, University of Mumbai.",
  keywords: [
    "Rishabh Shah",
    "Software Engineer",
    "Backend Developer",
    "ML Engineer",
    "Rutgers University",
    "Computer Science",
    "Full-stack Developer",
    "Python",
    "Next.js",
    "Django",
    "Machine Learning",
    "AI",
    "Systems Engineer",
    "Microservices",
    "Docker",
    "AWS",
  ],
  authors: [{ name: "Rishabh Shah" }],
  creator: "Rishabh Shah",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Rishabh Shah — Portfolio",
    title: "Rishabh Shah — MS CS (Software & Systems)",
    description: "I build scalable backend systems and ML-enabled applications. MS CS (Software & Systems) at Rutgers University; B.Tech in AI & Data Science at Dwarkadas J. Sanghvi College of Engineering, University of Mumbai.",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Rishabh Shah — Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rishabh Shah — MS CS (Software & Systems)",
    description: "I build scalable backend systems and ML-enabled applications.",
    images: [`${siteUrl}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Rishabh Shah",
    description: "Master's student in Computer Science (Software & Systems) at Rutgers University focused on scalable backend systems and ML-enabled applications",
    url: siteUrl,
    email: "rishabh.shah033@djsce.edu.in",
    jobTitle: "Graduate Student",
    sameAs: [
      "https://github.com/RishiiShah",
      "https://www.linkedin.com/in/rishabh-shah1/",
    ],
    alumniOf: [
      {
        "@type": "CollegeOrUniversity",
        name: "Rutgers University",
      },
      {
        "@type": "CollegeOrUniversity",
        name: "Dwarkadas J. Sanghvi College of Engineering",
      },
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${jetbrainsMono.variable} antialiased min-h-screen flex flex-col relative`}>
        <ThemeProvider>
          <ThreeBackground />
          <Nav />
          {/* <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 flex-1 w-full relative z-10">{children}</div> */}
          <div className="mx-auto w-full flex-1 relative z-10 px-[4vw] sm:px-[5vw] lg:px-[6vw] pt-20 sm:pt-24 lg:pt-28">{children}</div>
          <Footer />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
