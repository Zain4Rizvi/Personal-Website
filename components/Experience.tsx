import type { Experience as Exp } from "@/lib/content";
import Section from "./SectionLabel";
import Figure from "./Figure";
import ForecastChart from "./ForecastChart";
import PcaDiagram from "./PcaDiagram";
import Reveal from "./Reveal";

const Tags = ({ tags }: { tags: string[] }) => (
  <ul className="mt-5 flex flex-wrap gap-2 font-mono text-xs text-muted">
    {tags.map((t) => (
      <li key={t} className="border border-line px-2 py-1">{t}</li>
    ))}
  </ul>
);

const Head = ({ e, big }: { e: Exp; big?: boolean }) => (
  <header className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
    <div>
      <h3 className={big ? "text-3xl font-semibold tracking-tight md:text-4xl" : "text-xl font-semibold"}>{e.org}</h3>
      <p className="mt-1 text-muted">{e.role}, {e.location}</p>
    </div>
    <p className="font-mono text-sm text-muted">{e.start} to {e.end}</p>
  </header>
);

export default function Experience({ items }: { items: Exp[] }) {
  const hero = items.find((e) => e.featured)!;
  const rest = items.filter((e) => !e.featured);
  return (
    <Section n="01" title="Experience" id="experience">
      <Reveal>
        <article>
          <Head e={hero} big />
          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <Figure n={2} caption="Weekly volume: actual vs. forecasts." note="Illustrative, synthetic data">
              <ForecastChart />
            </Figure>
            <Figure n={3} caption="Route compression, 50+ to 5 components." note="Illustrative, synthetic data">
              <PcaDiagram />
            </Figure>
          </div>
          <ul className="mt-10 grid gap-x-12 gap-y-5 md:grid-cols-2">
            {hero.bullets.map((b) => (
              <li key={b} className="max-w-[65ch] border-l border-line pl-4">{b}</li>
            ))}
          </ul>
          <Tags tags={hero.tags} />
        </article>
      </Reveal>
      {rest.map((e) => (
        <Reveal key={e.id} className="mt-16 border-t border-line pt-10">
          <article>
            <Head e={e} />
            <ul className="mt-5 space-y-3">
              {e.bullets.map((b) => (
                <li key={b} className="max-w-[65ch] border-l border-line pl-4 text-muted">{b}</li>
              ))}
            </ul>
            <Tags tags={e.tags} />
          </article>
        </Reveal>
      ))}
    </Section>
  );
}
