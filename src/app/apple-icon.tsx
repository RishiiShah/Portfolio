import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0b",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-end", fontSize: 72, fontWeight: 800, letterSpacing: "-0.05em", color: "#edeae2" }}>
          RS
          <div style={{ width: 16, height: 16, borderRadius: 8, background: "#ff5a1f", marginLeft: 4, marginBottom: 18 }} />
        </div>
      </div>
    ),
    size,
  );
}
