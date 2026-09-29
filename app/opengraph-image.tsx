import { ImageResponse } from "next/og";

export const alt = "Signs & Designs by Eric — Custom Signage in Windsor, Tecumseh & Essex County";
export const size = { width: 1200, height: 630 };
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
          background: "#080808",
          color: "#ffffff",
          padding: "72px",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 12, background: "#F20D16", display: "flex" }} />
        <div style={{ position: "absolute", right: -120, top: -40, width: 420, height: 720, background: "#F20D16", display: "flex", transform: "skewX(-14deg)" }} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 26, letterSpacing: 8, color: "#F20D16", fontWeight: 700, textTransform: "uppercase" }}>Windsor • Tecumseh • Essex County</div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: 36, fontSize: 84, fontWeight: 900, lineHeight: 1, textTransform: "uppercase", maxWidth: 760 }}>
            <span>Custom Signage That Gets Your</span>
            <span style={{ color: "#F20D16" }}>Business Noticed.</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", fontSize: 30, fontWeight: 700 }}>
          <span style={{ textTransform: "uppercase" }}>Signs &amp; Designs by Eric</span>
          <span style={{ marginLeft: 28, color: "rgba(255,255,255,0.6)" }}>519-739-1107</span>
        </div>
      </div>
    ),
    size,
  );
}
