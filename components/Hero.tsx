import type { Education, Experience, Profile } from "@/lib/content";

const role = (r: string) => r.replace(/\s*\([^)]*\)$/, "");
const logos: Record<string, string> = {
  purolator: "/logos/purolator.png",
  mto: "/logos/mto.png",
};

function Row({ src, children }: { src: string; children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-3">
      <img src={src} alt="" className="h-6 w-6 shrink-0 object-contain" />
      <span>{children}</span>
    </p>
  );
}

function oxford(items: string[]) {
  if (items.length < 2) return items[0] ?? "";
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items.at(-1)}`;
}

export default function Hero({
  profile: p,
  experience,
  education,
}: {
  profile: Profile;
  experience: Experience[];
  education: Education;
}) {
  const degree = education.degrees[0];
  return (
    <section aria-label="Introduction" className="px-5 pb-4 pt-16 md:px-10 md:pt-24">
      <h1 className="hero-title enter max-w-[42rem] text-4xl font-normal leading-[1.15] sm:text-[3.5rem] sm:leading-[1.2]" style={{ "--i": 1 } as React.CSSProperties}>
        ML Engineer and builder
      </h1>
      <p className="enter mt-4 text-lg italic" style={{ "--i": 2 } as React.CSSProperties}>{p.tagline}</p>
      <div className="mt-16 grid gap-10 sm:grid-cols-2 sm:gap-16">
        <div className="enter" style={{ "--i": 3 } as React.CSSProperties}>
          <h2 className="text-[11px] uppercase tracking-[0.16em] text-muted">Education</h2>
          {degree && (
            <div className="mt-4">
              <Row src="/logos/uoft.png">{degree.majors.join(" and ")} at UofT</Row>
            </div>
          )}
        </div>
        <div className="enter" style={{ "--i": 4 } as React.CSSProperties}>
          <h2 className="text-[11px] uppercase tracking-[0.16em] text-muted">Experience</h2>
          <ul className="mt-4 space-y-3">
            {experience.map((e) => (
              <li key={e.id}>
                <Row src={logos[e.id]}>{role(e.role)} @ {e.org}</Row>
              </li>
            ))}
          </ul>
        </div>
        <div className="enter sm:col-span-2" style={{ "--i": 5 } as React.CSSProperties}>
          <h2 className="text-[11px] uppercase tracking-[0.16em] text-muted">Awards</h2>
          <ul className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-10">
            {education.awards.map((a) => (
              <li key={a.title}>{a.title}</li>
            ))}
          </ul>
          {education.competed.length > 0 && (
            <p className="mt-4 text-sm text-muted">Also competed in {oxford(education.competed)}.</p>
          )}
        </div>
      </div>
    </section>
  );
}
