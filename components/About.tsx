import type { Profile } from "@/lib/content";
import Section from "./SectionLabel";
import Figure from "./Figure";

export default function About({ profile: p }: { profile: Profile }) {
  return (
    <Section n="05" title="About" id="about">
      <div className="grid gap-12 md:grid-cols-12 md:items-start">
        <div className="space-y-5 md:col-span-7">
          {p.about.map((t) => (
            <p key={t} className="max-w-[65ch]">{t}</p>
          ))}
        </div>
        <div className="md:col-span-4 md:col-start-9">
          {/* TODO: replace /public/zain.jpg with a real photo; the grade below keeps it on-theme */}
          <Figure n="A" caption={p.name}>
            <div className="relative aspect-[4/5] overflow-hidden bg-surface">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/zain.jpg"
                alt={`Portrait of ${p.name}`}
                width={800}
                height={1000}
                loading="lazy"
                className="h-full w-full object-cover object-top grayscale contrast-110 brightness-90"
              />
              {/* flat teal-green tint over the grayscale image: duotone-style grade, no gradient */}
              <div className="pointer-events-none absolute inset-0 bg-accent mix-blend-multiply opacity-35" aria-hidden />
            </div>
          </Figure>
        </div>
      </div>
    </Section>
  );
}
