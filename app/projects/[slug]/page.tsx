import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, getProjectBodyHtml, getProjects } from "@/lib/content";
import ProjectMedia from "@/components/ProjectMedia";
import LinkButton from "@/components/LinkButton";
import Light2DApp from "@/components/Light2DApp";

type Props = { params: Promise<{ slug: string }> };

export const generateStaticParams = () => getProjects().filter((p) => p.featured).map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProject((await params).slug);
  return p ? { title: p.title, description: p.summary, alternates: { canonical: `/projects/${p.slug}` } } : {};
}

export default async function ProjectPage({ params }: Props) {
  const p = getProject((await params).slug);
  if (!p || !p.featured) notFound();
  const all = getProjects().filter((x) => x.featured);
  const i = all.findIndex((x) => x.slug === p.slug);
  const next = all[(i + 1) % all.length];

  return (
    <article className="mx-auto max-w-6xl px-5 pb-24 pt-10 md:px-8 md:pt-16">
      <Link href="/" className="font-mono text-xs text-muted hover:text-accent">&larr; Home</Link>
      <header className="mt-8 grid gap-8 md:grid-cols-12">
        <div className="md:col-span-8">
          <p className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")} / Description</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight md:text-6xl">{p.title}</h1>
          <p className="mt-5 max-w-[65ch] text-xl text-muted">{p.summary}</p>
          <ul className="mt-6 flex flex-wrap gap-2 font-mono text-xs text-muted">
            {p.tags.map((t) => <li key={t} className="border border-line px-2 py-1">{t}</li>)}
          </ul>
          {p.links.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-3 font-mono text-sm">
              {p.links.map((l, k) => <LinkButton key={l.href} href={l.href} primary={k === 0}>{l.label}</LinkButton>)}
            </div>
          )}
        </div>
        {p.metrics.length > 0 && (
          <dl className="grid grid-cols-2 gap-px border border-line bg-line md:col-span-4 md:self-end">
            {p.metrics.map((m) => (
              <div key={m.label} className="flex flex-col-reverse justify-end bg-bg p-4">
                <dt className="mt-1 font-mono text-xs text-muted">{m.label}</dt>
                <dd className="font-mono text-3xl text-accent">{m.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </header>

      {p.embed && (
        <section aria-label={p.embed.title} className="mt-12">
          <p className="mb-3 inline-flex items-center gap-2 border border-accent px-2 py-1 font-mono text-xs uppercase tracking-widest text-accent">
            <span aria-hidden className="h-2 w-2 animate-pulse bg-accent" />{p.embed.badge}
          </p>
          <p className="mb-3 font-mono text-sm text-muted">{p.embed.hint}</p>
          {p.embed.kind === "light2d" ? <Light2DApp /> : (
            <iframe src={p.embed.src} title={p.embed.title} className="h-[780px] w-full border border-accent bg-bg" />
          )}
        </section>
      )}

      {p.media.length > 0 && (
        <div className={`mt-12 grid gap-6 ${({ 1: "max-w-3xl", 2: "sm:grid-cols-2" } as Record<number, string>)[p.media.length] ?? "sm:grid-cols-2 lg:grid-cols-4"}`}>
          {p.media.map((m, k) => (
            <ProjectMedia key={m.src} media={m} n={k + 1} label={p.title} />
          ))}
        </div>
      )}

      <div className="prose-case mt-4 max-w-[65ch]">
        <div dangerouslySetInnerHTML={{ __html: getProjectBodyHtml(p.slug) }} />
      </div>

      <nav aria-label="Next project" className="mt-20 border-t border-line pt-6 font-mono text-sm">
        <Link href={`/projects/${next.slug}`} className="text-muted hover:text-accent">
          Next: <span className="text-text">{next.title}</span> &rarr;
        </Link>
      </nav>
    </article>
  );
}
