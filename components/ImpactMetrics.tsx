import type { Profile } from "@/lib/content";
import Reveal from "./Reveal";

export default function ImpactMetrics({ metrics }: { metrics: Profile["metrics"] }) {
  return (
    <section aria-label="Impact" className="border-t border-line">
      <Reveal>
        <dl className="mx-auto grid max-w-6xl grid-cols-2 lg:grid-cols-4">
          {metrics.map((m, i) => (
            <div
              key={m.label}
              className={`flex flex-col-reverse justify-end border-line px-5 py-8 md:px-8 md:py-12 ${i % 2 === 0 ? "" : "border-l"} ${i > 1 ? "border-t lg:border-t-0" : ""} lg:border-l ${i === 0 ? "lg:border-l-0" : ""}`}
            >
              <dt className="mt-3 text-base text-text">
                {m.label}
                <span className="mt-1 block font-mono text-xs text-muted">{m.detail}</span>
              </dt>
              <dd className="font-mono text-4xl font-medium tracking-tight text-accent sm:text-5xl lg:text-6xl">{m.value}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}
