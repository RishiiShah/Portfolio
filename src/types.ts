export type Tag =
  | "Systems"
  | "Backend"
  | "MLOps"
  | "Research"
  | "Full-stack"
  | "Open Source";

export interface ProjectLink {
  type: "demo" | "source" | "paper" | "blog";
  url: string;
}

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  tech: string[];
  tags: Tag[];
  impact?: string;
  links?: ProjectLink[];
  featured?: boolean;
  heroImage?: string;
  problem?: string;
  role?: string;
  architectureNotes?: string[];
  challenges?: string[];
  metrics?: { label: string; value: string }[];
  lessons?: string[];
}

export interface ExperienceItem {
  role: string;
  organization: string;
  start: string;
  end: string;
  location?: string;
  bullets: string[];
  links?: { label: string; url: string }[];
}

export interface PublicationItem {
  title: string;
  venue: string;
  year: number;
  authors: string[];
  links?: { label: string; url: string }[];
  abstract?: string;
  featured?: boolean;
}


