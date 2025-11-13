// import { notFound } from "next/navigation";
// import { projects } from "@/data/projects";

// export function generateStaticParams() {
//   return projects.map((p) => ({ slug: p.slug }));
// }

// export default function ProjectDetail({ params }: { params: { slug: string } }) {
//   const project = projects.find((p) => p.slug === params.slug);
//   if (!project) return notFound();

//   return (
//     <main className="py-12">
//       <h1 className="text-2xl font-semibold">{project.title}</h1>
//       <p className="mt-2 text-foreground/80">{project.tagline}</p>
//       {project.impact && <p className="mt-2 text-sm text-foreground/70">Impact: {project.impact}</p>}

//       <div className="mt-6 grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
//         <section className="space-y-6">
//           {project.problem && (
//             <div>
//               <h2 className="font-semibold">Problem</h2>
//               <p className="text-sm mt-1 text-foreground/80">{project.problem}</p>
//             </div>
//           )}
//           {project.role && (
//             <div>
//               <h2 className="font-semibold">Role</h2>
//               <p className="text-sm mt-1 text-foreground/80">{project.role}</p>
//             </div>
//           )}
//           {project.architectureNotes && project.architectureNotes.length > 0 && (
//             <div>
//               <h2 className="font-semibold">Architecture</h2>
//               <ul className="mt-1 text-sm text-foreground/80 list-disc pl-5 space-y-1">
//                 {project.architectureNotes.map((n) => (
//                   <li key={n}>{n}</li>
//                 ))}
//               </ul>
//             </div>
//           )}
//           {project.challenges && project.challenges.length > 0 && (
//             <div>
//               <h2 className="font-semibold">Challenges & solutions</h2>
//               <ul className="mt-1 text-sm text-foreground/80 list-disc pl-5 space-y-1">
//                 {project.challenges.map((n) => (
//                   <li key={n}>{n}</li>
//                 ))}
//               </ul>
//             </div>
//           )}
//           {project.lessons && project.lessons.length > 0 && (
//             <div>
//               <h2 className="font-semibold">Lessons / next steps</h2>
//               <ul className="mt-1 text-sm text-foreground/80 list-disc pl-5 space-y-1">
//                 {project.lessons.map((n) => (
//                   <li key={n}>{n}</li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </section>
//         <aside className="space-y-4">
//           <div className="rounded-lg border p-4">
//             <div className="text-sm font-medium">Tech</div>
//             <div className="mt-2 flex flex-wrap gap-2">
//               {project.tech.map((t) => (
//                 <span key={t} className="text-xs px-2 py-1 rounded-full border">{t}</span>
//               ))}
//             </div>
//           </div>
//           {project.metrics && project.metrics.length > 0 && (
//             <div className="rounded-lg border p-4">
//               <div className="text-sm font-medium">Metrics</div>
//               <ul className="mt-2 text-sm text-foreground/80 space-y-1">
//                 {project.metrics.map((m) => (
//                   <li key={m.label} className="flex justify-between"><span>{m.label}</span><span>{m.value}</span></li>
//                 ))}
//               </ul>
//             </div>
//           )}
//           {project.links && project.links.length > 0 && (
//             <div className="rounded-lg border p-4">
//               <div className="text-sm font-medium">Links</div>
//               <ul className="mt-2 text-sm space-y-1">
//                 {project.links.map((l) => (
//                   <li key={l.url}><a className="underline underline-offset-4" href={l.url} target="_blank" rel="noreferrer">{l.type}</a></li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </aside>
//       </div>
//     </main>
//   );
// }


// src/apps/projects/[slug]/page.tsx
// import { notFound } from "next/navigation";
// import { projects } from "@/data/projects";

// export function generateStaticParams() {
//   return projects.map((p) => ({ slug: p.slug }));
// }

// export default async function ProjectDetail({
//   params,
// }: {
//   params: Promise<{ slug: string }>; // 👈 mark params as Promise
// }) {
//   const { slug } = await params; // 👈 await it
//   const project = projects.find((p) => p.slug === slug);

//   if (!project) return notFound();

//   return (
//     <main className="py-12">
//       <h1 className="text-2xl font-semibold">{project.title}</h1>
//       <p className="mt-2 text-foreground/80">{project.tagline}</p>
//       {project.impact && (
//         <p className="mt-2 text-sm text-foreground/70">
//           Impact: {project.impact}
//         </p>
//       )}

//       <div className="mt-6 grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
//         <section className="space-y-6">
//           {project.problem && (
//             <div>
//               <h2 className="font-semibold">Problem</h2>
//               <p className="text-sm mt-1 text-foreground/80">
//                 {project.problem}
//               </p>
//             </div>
//           )}
//           {project.role && (
//             <div>
//               <h2 className="font-semibold">Role</h2>
//               <p className="text-sm mt-1 text-foreground/80">{project.role}</p>
//             </div>
//           )}
//           {project.architectureNotes?.length > 0 && (
//             <div>
//               <h2 className="font-semibold">Architecture</h2>
//               <ul className="mt-1 text-sm text-foreground/80 list-disc pl-5 space-y-1">
//                 {project.architectureNotes.map((n) => (
//                   <li key={n}>{n}</li>
//                 ))}
//               </ul>
//             </div>
//           )}
//           {project.challenges?.length > 0 && (
//             <div>
//               <h2 className="font-semibold">Challenges & solutions</h2>
//               <ul className="mt-1 text-sm text-foreground/80 list-disc pl-5 space-y-1">
//                 {project.challenges.map((n) => (
//                   <li key={n}>{n}</li>
//                 ))}
//               </ul>
//             </div>
//           )}
//           {project.lessons?.length > 0 && (
//             <div>
//               <h2 className="font-semibold">Lessons / next steps</h2>
//               <ul className="mt-1 text-sm text-foreground/80 list-disc pl-5 space-y-1">
//                 {project.lessons.map((n) => (
//                   <li key={n}>{n}</li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </section>
//         <aside className="space-y-4">
//           <div className="rounded-lg border p-4">
//             <div className="text-sm font-medium">Tech</div>
//             <div className="mt-2 flex flex-wrap gap-2">
//               {project.tech.map((t) => (
//                 <span
//                   key={t}
//                   className="text-xs px-2 py-1 rounded-full border"
//                 >
//                   {t}
//                 </span>
//               ))}
//             </div>
//           </div>
//           {project.metrics?.length > 0 && (
//             <div className="rounded-lg border p-4">
//               <div className="text-sm font-medium">Metrics</div>
//               <ul className="mt-2 text-sm text-foreground/80 space-y-1">
//                 {project.metrics.map((m) => (
//                   <li
//                     key={m.label}
//                     className="flex justify-between"
//                   >
//                     <span>{m.label}</span>
//                     <span>{m.value}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//           {project.links?.length > 0 && (
//             <div className="rounded-lg border p-4">
//               <div className="text-sm font-medium">Links</div>
//               <ul className="mt-2 text-sm space-y-1">
//                 {project.links.map((l) => (
//                   <li key={l.url}>
//                     <a
//                       className="underline underline-offset-4"
//                       href={l.url}
//                       target="_blank"
//                       rel="noreferrer"
//                     >
//                       {l.type}
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </aside>
//       </div>
//     </main>
//   );
// }


import { notFound } from "next/navigation";
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

  return <ProjectDetailClient project={project} />;
}
