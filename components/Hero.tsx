import type { Education, Experience, Profile } from "@/lib/content";

const role = (r: string) => r.replace(/\s*\([^)]*\)$/, "");

export default function Hero({
  profile: p,
  education,
  experience,
}: {
  profile: Profile;
  education: Education;
  experience: Experience[];
}) {
  const degree = education.degrees[0];
  return (
    <section aria-label="Introduction" className="mx-auto max-w-6xl px-5 pb-4 pt-16 md:px-8 md:pt-24">
      <h1 className="max-w-[42rem] text-4xl font-normal leading-[1.15] tracking-[-1px] sm:text-[3.5rem] sm:leading-[1.2]">
        {p.name} is an {p.title.replace(/\.$/, "")}.
      </h1>
      <p className="mt-4 text-lg italic">{p.tagline}</p>
      <div className="mt-16 grid gap-10 sm:grid-cols-2 sm:gap-16">
        <div>
          <h2 className="text-[11px] uppercase tracking-[0.16em] text-muted">Currently</h2>
          {degree && (
            <p className="mt-4">
              {degree.degree}, {degree.majors.join(" & ")} @ {degree.school}
            </p>
          )}
        </div>
        <div>
          <h2 className="text-[11px] uppercase tracking-[0.16em] text-muted">Previously</h2>
          <ul className="mt-4 space-y-2">
            {experience.map((e) => (
              <li key={e.id}>{role(e.role)} @ {e.org}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
