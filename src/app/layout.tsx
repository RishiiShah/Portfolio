import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Rishabh — MSc CS (Software & Systems) | Scalable systems & ML-enabled apps",
    template: "%s — Rishabh",
  },
  description: "I build scalable backend systems and ML-enabled applications. MSc CS (Software & Systems); BSc AI & Data Science.",
  metadataBase: new URL("https://example.dev"),
  openGraph: {
    title: "Rishabh — MSc CS (Software & Systems)",
    description: "Scalable backend systems, distributed pipelines, and ML-powered tools.",
    url: "https://example.dev",
    siteName: "Rishabh Portfolio",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
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
    description: "Master's student in Computer Science (Software & Systems) focused on scalable backend systems and ML-enabled applications",
    url: "https://example.dev",
    email: "rishabhshah203@gmail.com",
    jobTitle: "Graduate Student",
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Rutgers University"
    }
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-svh flex flex-col`}>
        <ThemeProvider>
          <Nav />
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 flex-1 w-full">{children}</div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
