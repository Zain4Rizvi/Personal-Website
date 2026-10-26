import { availableProjectMedia } from "@/content/projects.generated";
import type { Project } from "@/lib/content";
import WorkCard from "./WorkCard";

export default function Projects({ projects }: { projects: Project[] }) {
  const featured = projects.filter((p) => p.featured);
  return (
    <section id="projects" aria-label="Work" className="px-5 pb-16 pt-10 md:px-10">
      <h2 className="enter text-[11px] uppercase tracking-[0.16em] text-muted" style={{ "--i": 6 } as React.CSSProperties}>Work</h2>
      <ul className="work-list mt-4 grid gap-3 sm:grid-cols-2 sm:gap-4">
        {featured.map((p, i) => {
          const media = p.media[0];
          const ok = !!media && availableProjectMedia.has(media.poster ?? media.src);
          const contained = !!media && /assembly-platformer|light2d/.test(media.src);
          return (
            <li key={p.slug} className="enter" style={{ "--i": 7 + i } as React.CSSProperties}>
              <WorkCard
                slug={p.slug}
                title={p.title}
                summary={p.summary}
                poster={ok ? (media.poster ?? media.src) : undefined}
                gif={ok && media.src.endsWith(".gif") ? media.src : undefined}
                alt={media?.alt ?? p.title}
                fit={contained ? "contain" : "cover"}
                pixelated={!!media && media.src.includes("assembly")}
                bg={contained && media.src.includes("light2d") ? "bg-[#656864]" : "bg-black"}
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
