import Link from "next/link";
import { availableProjectMedia } from "@/content/projects.generated";
import type { Project } from "@/lib/content";

export default function Projects({ projects }: { projects: Project[] }) {
  const featured = projects.filter((p) => p.featured);
  return (
    <section id="projects" aria-label="Work" className="mx-auto max-w-6xl px-5 pb-24 pt-16 md:px-8">
      <h2 className="text-[11px] uppercase tracking-[0.16em] text-muted">Work</h2>
      <ul className="mt-6 grid gap-x-8 gap-y-12 sm:grid-cols-2">
        {featured.map((p) => {
          const media = p.media[0];
          const ok = !!media && availableProjectMedia.has(media.src);
          return (
            <li key={p.slug}>
              <Link href={`/projects/${p.slug}`} className="group block">
                <div className="aspect-[16/10] overflow-hidden rounded-xl bg-surface">
                  {ok && media.type === "image" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={media.src}
                      alt={media.alt}
                      className={`h-full w-full ${media.src.includes("assembly") ? "object-contain" : "object-cover"}`}
                      style={media.src.includes("assembly") ? { imageRendering: "pixelated" } : undefined}
                    />
                  ) : ok && media.type === "video" ? (
                    <video src={media.src} poster={media.poster} muted playsInline preload="metadata" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center p-6 text-center text-sm text-muted">{p.title}</div>
                  )}
                </div>
                <p className="mt-3 text-[15px] leading-snug group-hover:opacity-70">
                  <span className="font-medium">{p.title}</span>
                  {" — "}
                  {p.summary}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
