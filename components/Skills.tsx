import type { Skills as S } from "@/lib/content";
import Section from "./SectionLabel";

export default function Skills({ skills }: { skills: S }) {
  return (
    <Section n="04" title="Skills" id="skills">
      <dl className="divide-y divide-line border-y border-line">
        {Object.entries(skills).map(([group, items]) => (
          <div key={group} className="grid gap-2 py-5 md:grid-cols-12">
            <dt className="font-mono text-xs uppercase tracking-widest text-muted md:col-span-2">{group}</dt>
            <dd className="font-mono text-sm md:col-span-10">{items.join("  /  ")}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
