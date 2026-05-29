export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.startsWith("http")
      ? process.env.NEXT_PUBLIC_SITE_URL
      : `https://${process.env.NEXT_PUBLIC_SITE_URL}`;
  }
  return "https://rishabhshah.me";
}

/**
 * Normalize a string for SEO/metadata output. Replaces em-dashes and en-dashes
 * with plain ASCII punctuation to keep titles and descriptions clean across
 * search engines, social previews, and manifests.
 */
export function sanitizeForMeta(input: string): string {
  return input
    .replace(/\s—\s/g, ", ")
    .replace(/—/g, ", ")
    .replace(/\s–\s/g, ", ")
    .replace(/–/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}
