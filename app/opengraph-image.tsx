import { ImageResponse } from "next/og";

export const alt = "ACID — Creative Developer & Motion Designer";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          color: "#f4f4f5",
          background:
            "radial-gradient(ellipse at 82% 22%, rgba(0,217,255,0.2), transparent 35%), linear-gradient(135deg, #050505 0%, #0b1217 100%)",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            color: "#00d9ff",
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "0.24em",
          }}
        >
          <span>ACID</span>
          <span style={{ width: 48, height: 2, background: "#00d9ff", opacity: 0.7 }} />
          <span style={{ color: "#a1a1aa", fontSize: 14, fontWeight: 400 }}>
            CREATIVE PORTFOLIO
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 900 }}>
          <div style={{ color: "#a1a1aa", fontSize: 22, letterSpacing: "0.16em" }}>
            MOTION DESIGNER &amp; CREATIVE DEVELOPER
          </div>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.04em" }}>
            Crafting cinematic visuals and interactive experiences.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.16)",
            paddingTop: 22,
            color: "#71717a",
            fontSize: 16,
            letterSpacing: "0.16em",
          }}
        >
          <span>LOXITIS STUDIO</span>
          <span>DESIGN · MOTION · DIGITAL</span>
        </div>
      </div>
    ),
    size
  );
}
