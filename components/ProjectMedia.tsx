import fs from "node:fs";
import path from "node:path";
import type { Media } from "@/lib/content";
import Figure from "./Figure";

const exists = (src: string) => fs.existsSync(path.join(process.cwd(), "public", src));

// Image/video slot. Screenshots and videos only, no iframes. Missing files render a labelled empty slot.
export default function ProjectMedia({
  media, n, label, fit = "contain",
}: { media: Media; n: number; label: string; fit?: "cover" | "contain" }) {
  const ok = exists(media.src);
  return (
    <Figure n={n} caption={media.caption ?? label}>
      <div className="aspect-[4/3] w-full overflow-hidden bg-surface">
        {!ok ? (
          <div className="flex h-full items-center justify-center p-6 text-center font-mono text-xs text-muted">
            media slot: {media.src}
          </div>
        ) : media.type === "video" ? (
          <video
            src={media.src}
            poster={media.poster}
            controls
            playsInline
            preload="none"
            className={`h-full w-full ${fit === "cover" ? "object-cover" : "object-contain"}`}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={media.src}
            alt={media.alt}
            loading={n === 1 ? "eager" : "lazy"}
            {...(n === 1 ? { fetchPriority: "high" as const } : {})}
            className={`h-full w-full ${fit === "cover" ? "object-cover" : "object-contain"}`}
            style={media.src.includes("assembly") ? { imageRendering: "pixelated" } : undefined}
          />
        )}
      </div>
    </Figure>
  );
}
