"use client";

import { m, useScroll, useTransform } from "framer-motion";

export function AmbientBeams() {
  const { scrollYProgress } = useScroll();
  const cool = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const warm = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-[2] overflow-hidden"
    >
      {/* Cool periwinkle beam: top left */}
      <m.div
        style={{ x: cool, y: cool }}
        className="absolute -top-[30%] -left-[20%] h-[70vh] w-[70vh] rounded-full"
      >
        <div
          className="h-full w-full"
          style={{
            background:
              "radial-gradient(closest-side, rgba(122,162,255,0.18), transparent 70%)",
            filter: "blur(90px)",
          }}
        />
      </m.div>

      {/* Warm sand beam: bottom right */}
      <m.div
        style={{ x: warm, y: warm }}
        className="absolute -bottom-[25%] -right-[20%] h-[80vh] w-[80vh] rounded-full"
      >
        <div
          className="h-full w-full"
          style={{
            background:
              "radial-gradient(closest-side, rgba(230,185,128,0.12), transparent 70%)",
            filter: "blur(110px)",
          }}
        />
      </m.div>

      {/* Mint hint: center-right */}
      <div
        className="absolute top-1/3 right-1/4 h-[40vh] w-[40vh] rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(91,227,196,0.07), transparent 70%)",
          filter: "blur(100px)",
        }}
      />
    </div>
  );
}
