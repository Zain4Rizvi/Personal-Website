import type { Education as Edu } from "@/lib/content";
import Section from "./SectionLabel";

export default function Education({ data }: { data: Edu }) {
  return (
    <Section n="03" title="Education & awards" id="education">
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-7">
          {data.degrees.map((d) => (
            <div key={d.degree}>
              <p className="font-mono text-sm text-muted">{d.start} to {d.end}</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight">{d.degree}, {d.majors.join(" & ")}</h3>
              <p className="mt-1 text-muted">{d.school}</p>
              <h4 className="mb-3 mt-8 font-mono text-xs uppercase tracking-widest text-muted">Coursework</h4>
              <ul className="flex flex-wrap gap-2 font-mono text-xs">
                {d.coursework.map((c) => (
                  <li key={c} className="border border-line px-2 py-1 text-muted">{c}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="md:col-span-5">
          <h4 className="mb-3 font-mono text-xs uppercase tracking-widest text-muted">Awards</h4>
          <ul className="divide-y divide-line border-y border-line">
            {data.awards.map((a) => (
              <li key={a.title} className="py-3">{a.title}</li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
