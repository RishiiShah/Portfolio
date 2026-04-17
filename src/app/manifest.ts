import type { MetadataRoute } from "next";
import { bio } from "@/data";
import { sanitizeForMeta } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: sanitizeForMeta(`${bio.name} | ${bio.title}`),
    short_name: bio.name,
    description: sanitizeForMeta(bio.description),
    start_url: "/",
    display: "standalone",
    background_color: "#07090f",
    theme_color: "#07090f",
    categories: ["portfolio", "technology", "education"],
    lang: "en-US",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
