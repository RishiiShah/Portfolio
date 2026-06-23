"use client";

import { useEffect, useState } from "react";
import { m } from "framer-motion";
import dynamic from "next/dynamic";
import { publications, type Publication } from "@/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PublicationCard } from "@/components/ui/PublicationCard";

const PublicationModal = dynamic(
  () => import("@/components/PublicationModal").then((m) => m.PublicationModal),
  { ssr: false }
);

function publicationSlug(publication: Publication) {
  return publication.title
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function Publications() {
  const [active, setActive] = useState<Publication | null>(null);
  const featured = publications.find((p) => p.featured);
  const others = publications.filter((p) => !p.featured);

  useEffect(() => {
    const sync = () => {
      const hash = window.location.hash;
      if (!hash.startsWith("#publication/")) {
        setActive(null);
        return;
      }

      const slug = hash.slice("#publication/".length);
      const publication = publications.find((p) => publicationSlug(p) === slug);
      setActive(publication ?? null);
    };

    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const open = (publication: Publication) => {
    setActive(publication);
    if (typeof window !== "undefined") {
      history.replaceState(null, "", `#publication/${publicationSlug(publication)}`);
    }
  };

  const close = () => {
    setActive(null);
    if (
      typeof window !== "undefined" &&
      window.location.hash.startsWith("#publication/")
    ) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  };

  return (
    <section id="publications" className="relative overflow-hidden py-16 md:py-20">
      <div className="relative z-[1] mx-auto max-w-6xl px-6">
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
              onOpen={() => open(featured)}
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
              onOpen={() => open(p)}
            />
          ))}
        </div>
      </div>

      <PublicationModal publication={active} onClose={close} />
    </section>
  );
}
