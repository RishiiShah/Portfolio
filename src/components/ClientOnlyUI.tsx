"use client";

import dynamic from "next/dynamic";

const CustomCursor = dynamic(
  () => import("@/components/CustomCursor").then((m) => ({ default: m.CustomCursor })),
  { ssr: false }
);
const PortfolioDock = dynamic(
  () => import("@/components/PortfolioDock").then((m) => ({ default: m.PortfolioDock })),
  { ssr: false }
);
const Assistant = dynamic(
  () => import("@/components/assistant/Assistant").then((m) => ({ default: m.Assistant })),
  { ssr: false }
);

export function ClientOnlyUI() {
  return (
    <>
      <CustomCursor />
      <PortfolioDock />
      <Assistant />
    </>
  );
}
