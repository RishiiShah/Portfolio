import { notFound } from "next/navigation";
import { Suspense } from "react";
import { projects } from "@/data/projects";
import { ProjectDetailClient } from "./ProjectDetailClient";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) return notFound();

  return (
    <Suspense fallback={<div className="font-mono text-xs uppercase tracking-widest text-foreground/50 animate-pulse">Loading project...</div>}>
      <ProjectDetailClient project={project} />
    </Suspense>
  );
}
