import { ImageResponse } from "next/og";
import { getProfile } from "@/lib/content";

export const alt = "Zain Rizvi, ML engineer and builder";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Uses the default font bundled with next/og; no network fetch.
export default function Image() {
  const p = getProfile();
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: "#0a0d0c", color: "#e6ece9", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, border: "1px solid #1f2927" }}>
        <div style={{ fontSize: 28, color: "#8a9a95" }}>{p.name}</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: -2 }}>{p.title}</div>
          <div style={{ fontSize: 34, color: "#8a9a95", marginTop: 16 }}>{p.tagline}</div>
        </div>
        <div style={{ display: "flex", gap: 56 }}>
          {p.metrics.map((m) => (
            <div key={m.label} style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 52, color: "#3ddc97" }}>{m.value}</div>
              <div style={{ fontSize: 20, color: "#8a9a95" }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
