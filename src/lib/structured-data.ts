import { bio, education, publications, projects, teaching } from "@/data";
import { getSiteUrl, sanitizeForMeta } from "@/lib/site";

type JsonLd = Record<string, unknown>;

/**
 * Person + WebSite only. ProfilePage rich results are aimed at social/creator
 * profiles with interaction stats; stuffing a full resume into ProfilePage was
 * what GSC flagged as "Invalid object type" (11x) on rishabhshah.me.
 */
function personSchema(site: string): JsonLd {
  return {
    "@type": "Person",
    "@id": `${site}/#person`,
    name: bio.name,
    givenName: bio.givenName,
    familyName: bio.familyName,
    additionalName: bio.additionalName,
    alternateName: [...bio.alternateNames],
    url: site,
    image: `${site}/og-image.png`,
    jobTitle: bio.title,
    description: sanitizeForMeta(bio.seoDescription),
    email: bio.email,
    sameAs: [bio.github, bio.linkedin, ...bio.profiles].filter(Boolean),
    homeLocation: {
      "@type": "Place",
      name: bio.location,
      address: {
        "@type": "PostalAddress",
        addressLocality: "New Brunswick",
        addressRegion: "NJ",
        addressCountry: "US",
      },
    },
    alumniOf: education.map((edu) => ({
      "@type": "CollegeOrUniversity",
      name: edu.institution,
    })),
    worksFor: {
      "@type": "Organization",
      name: teaching.organization,
    },
  };
}

function websiteSchema(site: string): JsonLd {
  return {
    "@type": "WebSite",
    "@id": `${site}/#website`,
    url: site,
    name: `${bio.name} Portfolio`,
    alternateName: bio.name,
    description: sanitizeForMeta(bio.seoDescription),
    inLanguage: "en-US",
    author: { "@id": `${site}/#person` },
    publisher: { "@id": `${site}/#person` },
    about: { "@id": `${site}/#person` },
  };
}

function publicationSchemas(site: string): JsonLd[] {
  return publications.map((pub, i) => {
    const datePublished = pub.publishedAt
      ? parseMonthYear(pub.publishedAt)
      : `${pub.year}`;
    const primaryLink = pub.links?.find((l) => l.type === "paper" || l.type === "journal")?.url;
    const authors = pub.authors.map((name) =>
      name === bio.name
        ? { "@id": `${site}/#person` }
        : { "@type": "Person", name },
    );
    return {
      "@type": "ScholarlyArticle",
      "@id": `${site}/#publication-${i}`,
      headline: pub.title,
      name: pub.title,
      ...(pub.abstract ? { abstract: sanitizeForMeta(pub.abstract) } : {}),
      datePublished,
      author: authors,
      inLanguage: "en-US",
      ...(primaryLink ? { url: primaryLink, sameAs: [primaryLink] } : {}),
      about: { "@id": `${site}/#person` },
    };
  });
}

function projectSchemas(site: string): JsonLd[] {
  return projects
    .filter((p) => p.links && p.links.length > 0)
    .map((project) => {
      const source = project.links?.find((l) => l.type === "source")?.url;
      const demo = project.links?.find((l) => l.type === "demo")?.url;
      const video = project.links?.find((l) => l.type === "video")?.url;
      const paper = project.links?.find((l) => l.type === "paper")?.url;
      return {
        "@type": "SoftwareSourceCode",
        "@id": `${site}/#project-${project.slug}`,
        name: project.title,
        description: sanitizeForMeta(project.tagline),
        ...(source ? { codeRepository: source } : {}),
        ...(project.award ? { award: project.award } : {}),
        programmingLanguage: project.tech,
        author: { "@id": `${site}/#person` },
        url: `${site}/#work`,
        sameAs: [source, demo, video, paper].filter(Boolean),
      };
    });
}

function parseMonthYear(s: string): string {
  const months: Record<string, string> = {
    january: "01",
    february: "02",
    march: "03",
    april: "04",
    may: "05",
    june: "06",
    july: "07",
    august: "08",
    september: "09",
    october: "10",
    november: "11",
    december: "12",
  };
  const match = s.match(/(\w+)\s+(\d{4})/);
  if (!match) return s;
  const month = months[match[1].toLowerCase()] ?? "01";
  return `${match[2]}-${month}`;
}

export function buildStructuredData(): string {
  const site = getSiteUrl();
  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      personSchema(site),
      websiteSchema(site),
      ...publicationSchemas(site),
      ...projectSchemas(site),
    ],
  });
}
