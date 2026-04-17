"use client";

import { useState } from "react";
import { m } from "framer-motion";
import dynamic from "next/dynamic";
import { publications, type Publication } from "@/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PublicationCard } from "@/components/ui/PublicationCard";

const PublicationModal = dynamic(
  () => import("@/components/PublicationModal").then((m) => m.PublicationModal),
  { ssr: false }
);

export function Publications() {
  const [active, setActive] = useState<Publication | null>(null);
  const featured = publications.find((p) => p.featured);
  const others = publications.filter((p) => !p.featured);

  return (
    <section id="publications" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeading
            index="02"
            backgroundText="PAPERS"
            eyebrow="Published Research"
            title="Publications"
            subtitle={`${publications.length} peer-reviewed papers across computer vision, generative modeling, and IoT systems. Click any paper to read the full abstract.`}
          />
        </m.div>

        {featured && (
          <div className="mb-10">
            <PublicationCard
              publication={featured}
              variant="featured"
              onOpen={() => setActive(featured)}
            />
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-5">
          {others.map((p, i) => (
            <PublicationCard
              key={p.title}
              publication={p}
              variant="compact"
              index={i}
              onOpen={() => setActive(p)}
            />
          ))}
        </div>
      </div>

      <PublicationModal publication={active} onClose={() => setActive(null)} />
    </section>
  );
}
