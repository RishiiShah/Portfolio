import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { CursorFollower } from "@/components/CursorFollower";
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

const getSiteUrl = (): string => {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.startsWith("http")
      ? process.env.NEXT_PUBLIC_SITE_URL
      : `https://${process.env.NEXT_PUBLIC_SITE_URL}`;
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "https://rishabhshah.vercel.app";
};

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Rishabh Shah — Software Engineer & ML Researcher",
  description:
    "Portfolio of Rishabh Shah — CS student at Northeastern University specializing in machine learning, computer vision, and backend systems.",
  keywords: [
    "Rishabh Shah",
    "Software Engineer",
    "ML Engineer",
    "Machine Learning",
    "Computer Vision",
    "Northeastern University",
    "Next.js",
    "Python",
    "TypeScript",
    "Backend",
    "Full Stack",
  ],
  authors: [{ name: "Rishabh Shah" }],
  creator: "Rishabh Shah",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Rishabh Shah",
    title: "Rishabh Shah — Software Engineer & ML Researcher",
    description:
      "CS student at Northeastern University. Building at the intersection of engineering and intelligence.",
    images: [{ url: `${siteUrl}/og-image.png`, width: 1200, height: 630, alt: "Rishabh Shah" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rishabh Shah — Software Engineer & ML Researcher",
    description: "ML, backend systems, open source.",
    creator: "@RishiiShah",
    images: [`${siteUrl}/og-image.png`],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Rishabh Shah",
    url: siteUrl,
    email: "shah.joy@northeastern.edu",
    image: `${siteUrl}/og-image.png`,
    jobTitle: "Software Engineer & ML Researcher",
    sameAs: [
      "https://github.com/RishiiShah",
      "https://www.linkedin.com/in/rishabh-shah1/",
    ],
    alumniOf: [
      { "@type": "CollegeOrUniversity", name: "Northeastern University" },
      { "@type": "CollegeOrUniversity", name: "Dwarkadas J. Sanghvi College of Engineering" },
    ],
  };

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="antialiased">
        <CursorFollower />
        <Navbar />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
