import Link from "next/link";
import { availableProjectMedia } from "@/content/projects.generated";
import type { Project } from "@/lib/content";

export default function Projects({ projects }: { projects: Project[] }) {
  const featured = projects.filter((p) => p.featured);
  return (
    <section id="projects" aria-label="Work" className="px-5 pb-16 pt-10 md:px-10">
      <h2 className="text-[11px] uppercase tracking-[0.16em] text-muted">Work</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 sm:gap-4">
        {featured.map((p) => {
          const media = p.media[0];
          const ok = !!media && availableProjectMedia.has(media.src);
          // Square artwork can't fill 16:9 without cropping. Same frame, whole image.
          const contained = !!media && /assembly-platformer|light2d/.test(media.src);
          return (
            <li key={p.slug}>
              <Link href={`/projects/${p.slug}`} className="group block">
                <div className={`aspect-[16/9] overflow-hidden rounded-2xl ${contained && media.src.includes("light2d") ? "bg-[#656864]" : "bg-black"}`}>
                  {ok && media.type === "image" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={media.src}
                      alt={media.alt}
                      className={`h-full w-full ${contained ? "object-contain" : "object-cover"}`}
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
