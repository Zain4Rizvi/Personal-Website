import type { Profile } from "@/lib/content";
import HeroMount from "./HeroMount";

const btn = "inline-flex min-h-11 items-center border px-5 font-mono text-sm transition-colors";

export default function Hero({ profile: p }: { profile: Profile }) {
  return (
    <section aria-label="Introduction" className="mx-auto grid max-w-6xl gap-12 px-5 pb-16 pt-14 md:px-8 md:pb-24 md:pt-20 lg:grid-cols-12 lg:items-center">
      <div className="lg:col-span-7">
        <p className="mb-6 font-mono text-xs uppercase tracking-widest text-muted">{p.name}</p>
        <h1 className="text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">{p.title}</h1>
        <p className="mt-6 max-w-[40ch] text-xl text-muted">{p.tagline}</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <a href="#projects" className={`${btn} border-accent bg-accent text-bg hover:bg-text hover:border-text`}>
            View work
          </a>
          <a href={p.links.resume} className={`${btn} border-line text-text hover:border-accent hover:text-accent`}>
            Resume
          </a>
          <a href="#contact" className={`${btn} border-line text-text hover:border-accent hover:text-accent`}>
            Contact
          </a>
        </div>
      </div>
      <div className="lg:col-span-5">
        <HeroMount />
      </div>
    </section>
  );
}
