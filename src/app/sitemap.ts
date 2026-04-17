import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const site = getSiteUrl();
  const now = new Date();
  return [
    {
      url: `${site}/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
