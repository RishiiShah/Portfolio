import { bio, education, publications, projects, experience } from "@/data";
import { getSiteUrl, sanitizeForMeta } from "@/lib/site";

type JsonLd = Record<string, unknown>;

const UNIVERSITY_SAMEAS: Record<string, string[]> = {
  "Rutgers University": [
    "https://en.wikipedia.org/wiki/Rutgers_University",
    "https://www.rutgers.edu/",
  ],
  "Dwarkadas J. Sanghvi College of Engineering": [
    "https://en.wikipedia.org/wiki/Dwarkadas_J._Sanghvi_College_of_Engineering",
    "https://djsce.ac.in/",
  ],
};

function personSchema(site: string): JsonLd {
  return {
    "@type": "Person",
    "@id": `${site}/#person`,
    name: bio.name,
    url: site,
    email: bio.email,
    image: `${site}/og-image.png`,
    jobTitle: bio.title,
    description: sanitizeForMeta(bio.description),
    address: {
      "@type": "PostalAddress",
      addressLocality: "New Brunswick",
      addressRegion: "NJ",
      addressCountry: "US",
    },
    sameAs: [bio.github, bio.linkedin].filter(Boolean),
    knowsAbout: [
      "Software Engineering",
      "Machine Learning",
      "Computer Vision",
      "Backend Systems",
      "MLOps",
      "Generative Adversarial Networks",
      "Natural Language Processing",
    ],
    alumniOf: education.map((edu) => ({
      "@type": "CollegeOrUniversity",
      name: edu.institution,
      ...(UNIVERSITY_SAMEAS[edu.institution]
        ? { sameAs: UNIVERSITY_SAMEAS[edu.institution] }
        : {}),
    })),
    worksFor: experience.slice(0, 1).map((e) => ({
      "@type": "Organization",
      name: e.organization,
      ...(e.location ? { address: e.location } : {}),
    })),
  };
}

function websiteSchema(site: string): JsonLd {
  return {
    "@type": "WebSite",
    "@id": `${site}/#website`,
    url: site,
    name: `${bio.name} Portfolio`,
    description: sanitizeForMeta(bio.description),
    inLanguage: "en-US",
    author: { "@id": `${site}/#person` },
    publisher: { "@id": `${site}/#person` },
  };
}

function profilePageSchema(site: string): JsonLd {
  return {
    "@type": "ProfilePage",
    "@id": `${site}/#profile`,
    url: site,
    name: sanitizeForMeta(`${bio.name} | ${bio.title}`),
    description: sanitizeForMeta(bio.description),
    mainEntity: { "@id": `${site}/#person` },
    about: { "@id": `${site}/#person` },
    inLanguage: "en-US",
    isPartOf: { "@id": `${site}/#website` },
  };
}

function publicationSchemas(site: string): JsonLd[] {
  return publications.map((pub, i) => {
    const datePublished = pub.publishedAt
      ? parseMonthYear(pub.publishedAt)
      : `${pub.year}`;
    const primaryLink = pub.links?.find((l) => l.type === "paper" || l.type === "journal")?.url;
    const authors = pub.authors.map((name) => ({
      "@type": "Person",
      name,
      ...(name === bio.name ? { "@id": `${site}/#person` } : {}),
    }));
    return {
      "@type": "ScholarlyArticle",
      "@id": `${site}/#publication-${i}`,
      headline: pub.title,
      name: pub.title,
      ...(pub.abstract ? { abstract: sanitizeForMeta(pub.abstract) } : {}),
      datePublished,
      isPartOf: {
        "@type": "PublicationIssue",
        isPartOf: {
          "@type": "Periodical",
          name: pub.venue,
        },
      },
      author: authors,
      inLanguage: "en-US",
      ...(primaryLink ? { url: primaryLink, sameAs: [primaryLink] } : {}),
      mainEntityOfPage: { "@id": `${site}/#profile` },
      publisher: { "@id": `${site}/#person` },
    };
  });
}

function projectSchemas(site: string): JsonLd[] {
  return projects
    .filter((p) => p.links && p.links.length > 0)
    .map((project) => {
      const source = project.links?.find((l) => l.type === "source")?.url;
      const demo = project.links?.find((l) => l.type === "demo")?.url;
      const paper = project.links?.find((l) => l.type === "paper")?.url;
      return {
        "@type": "SoftwareSourceCode",
        "@id": `${site}/#project-${project.slug}`,
        name: project.title,
        headline: project.title,
        description: sanitizeForMeta(project.tagline),
        ...(source ? { codeRepository: source } : {}),
        programmingLanguage: project.tech,
        keywords: [...project.tags, ...project.tech].join(", "),
        author: { "@id": `${site}/#person` },
        creator: { "@id": `${site}/#person` },
        url: `${site}/#work`,
        sameAs: [source, demo, paper].filter(Boolean),
        mainEntityOfPage: { "@id": `${site}/#profile` },
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
  const graph: JsonLd[] = [
    personSchema(site),
    websiteSchema(site),
    profilePageSchema(site),
    ...publicationSchemas(site),
    ...projectSchemas(site),
  ];
  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": graph,
  });
}
