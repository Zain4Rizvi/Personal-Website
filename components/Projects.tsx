import Link from "next/link";
import type { Project } from "@/lib/content";
import Section from "./SectionLabel";
import ProjectMedia from "./ProjectMedia";
import Reveal from "./Reveal";

const ext = (h: string) => /^https?:/.test(h) || h.endsWith(".html");

export default function Projects({ projects }: { projects: Project[] }) {
  const featured = projects.filter((p) => p.featured);
  const compact = projects.filter((p) => !p.featured);
  return (
    <Section n="02" title="Projects" id="projects">
      <ol className="divide-y divide-line border-y border-line">
        {featured.map((p, i) => (
          <li key={p.slug}>
            <Reveal className="grid gap-8 py-10 md:grid-cols-12 md:py-14">
              <div className={`md:col-span-5 ${i % 2 ? "md:order-2" : ""}`}>
                {p.media[0] && <ProjectMedia media={p.media[0]} n={4 + i} label={p.title} />}
              </div>
              <div className={`md:col-span-7 ${i % 2 ? "md:order-1" : ""} flex flex-col`}>
                <p className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 text-3xl font-semibold tracking-tight">
                  <Link href={`/projects/${p.slug}`} className="hover:text-accent">{p.title}</Link>
                </h3>
                <p className="mt-3 max-w-[65ch] text-muted">{p.summary}</p>
                {p.metrics.length > 0 && (
                  <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
                    {p.metrics.map((m) => (
                      <div key={m.label} className="flex flex-col-reverse">
                        <dt className="font-mono text-xs text-muted">{m.label}</dt>
                        <dd className="font-mono text-2xl text-accent">{m.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                <ul className="mt-6 flex flex-wrap gap-2 font-mono text-xs text-muted">
                  {p.tags.map((t) => (
                    <li key={t} className="border border-line px-2 py-1">{t}</li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-mono text-sm">
                  <Link href={`/projects/${p.slug}`} className="text-accent hover:text-text">Case study &rarr;</Link>
                  {p.links.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      {...(ext(l.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="text-muted hover:text-accent"
                    >
                      {l.label} &#8599;
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
      {compact.length > 0 && (
        <div className="mt-12">
          <h3 className="mb-4 font-mono text-xs uppercase tracking-widest text-muted">Also</h3>
          <ul className="divide-y divide-line border-y border-line">
            {compact.map((p) => (
              <li key={p.slug} className="grid gap-2 py-5 md:grid-cols-12 md:items-baseline">
                <span className="font-semibold md:col-span-3">{p.title}</span>
                <span className="max-w-[65ch] text-muted md:col-span-7">{p.summary}</span>
                <span className="font-mono text-sm text-accent md:col-span-2 md:text-right">
                  {p.metrics[0] ? `${p.metrics[0].value} ${p.metrics[0].label}` : ""}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Section>
  );
}
