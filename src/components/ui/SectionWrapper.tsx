"use client";

import { motion } from "framer-motion";
import { fadeInUp, viewportConfig } from "@/lib/animations";
import { cn } from "@/lib/utils";

interface SectionWrapperProps {
  id: string;
  className?: string;
  children: React.ReactNode;
}

export function SectionWrapper({ id, className, children }: SectionWrapperProps) {
  return (
    <motion.section
      id={id}
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportConfig}
      className={cn("py-24 px-6", className)}
    >
      <div className="max-w-6xl mx-auto">{children}</div>
    </motion.section>
  );
}
