import type { Profile } from "@/lib/content";
import Section from "./SectionLabel";

export default function Contact({ profile: p }: { profile: Profile }) {
  const row = "flex items-baseline justify-between gap-4 py-4 hover:text-accent";
  return (
    <Section n="06" title="Contact" id="contact">
      <a
        href={`mailto:${p.email}`}
        className="break-all text-3xl font-semibold tracking-tight hover:text-accent sm:text-5xl"
      >
        {p.email}
      </a>
      <ul className="mt-12 max-w-xl divide-y divide-line border-y border-line font-mono text-sm">
        <li><a className={row} href={p.links.linkedin} target="_blank" rel="noopener noreferrer"><span className="text-muted">LinkedIn</span>{p.links.linkedin.replace("https://", "")}</a></li>
        <li><a className={row} href={p.links.github} target="_blank" rel="noopener noreferrer"><span className="text-muted">GitHub</span>{p.links.github.replace("https://", "")}</a></li>
        <li><a className={row} href={p.links.resume}><span className="text-muted">Resume</span>resume.pdf</a></li>
      </ul>
    </Section>
  );
}
