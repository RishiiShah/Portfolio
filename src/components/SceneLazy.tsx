"use client";

import dynamic from "next/dynamic";

/** The particle field, loaded after hydration so three.js stays out of the first-load bundle. */
export const Scene = dynamic(() => import("./Scene").then((m) => m.Scene), { ssr: false });
