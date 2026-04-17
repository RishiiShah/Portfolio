import { ImageResponse } from "next/og";

export const runtime = "edge";
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
          background:
            "linear-gradient(135deg, #0e1220 0%, #07090f 100%)",
          fontFamily: "Georgia, serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 30% 20%, rgba(122,162,255,0.25), transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(230,185,128,0.22), transparent 60%)",
          }}
        />
        <div
          style={{
            fontSize: 96,
            fontWeight: 400,
            background:
              "linear-gradient(135deg, #7aa2ff 0%, #e6b980 100%)",
            backgroundClip: "text",
            color: "transparent",
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
