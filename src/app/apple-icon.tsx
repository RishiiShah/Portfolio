import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const corner = (pos: Record<string, number>, borders: Record<string, string>) => (
  <div style={{ position: "absolute", width: 26, height: 26, ...pos, ...borders }} />
);

export default function AppleIcon() {
  const b = "7px solid #7d87ff";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#141414",
          position: "relative",
        }}
      >
        {corner({ top: 34, left: 34 }, { borderTop: b, borderLeft: b })}
        {corner({ top: 34, right: 34 }, { borderTop: b, borderRight: b })}
        {corner({ bottom: 34, left: 34 }, { borderBottom: b, borderLeft: b })}
        {corner({ bottom: 34, right: 34 }, { borderBottom: b, borderRight: b })}
        <div
          style={{
            fontSize: 58,
            fontWeight: 800,
            color: "#ecebe6",
            letterSpacing: "-0.04em",
            display: "flex",
          }}
        >
          RS
        </div>
      </div>
    ),
    size
  );
}
