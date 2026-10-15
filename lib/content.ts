import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const dir = path.join(process.cwd(), "content");
const json = <T,>(f: string): T => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));

export type Profile = {
  name: string;
  title: string;
  tagline: string;
  roles: string[];
  siteUrl: string;
  email: string;
  links: { linkedin: string; github: string; resume: string };
  metrics: { value: string; label: string; detail: string }[];
  about: string[];
};
export type Experience = {
  id: string; org: string; role: string; location: string; start: string; end: string;
  featured: boolean; bullets: string[]; tags: string[];
};
export type Education = {
  degrees: { school: string; degree: string; majors: string[]; start: string; end: string; coursework: string[] }[];
  awards: { title: string }[];
};
export type Skills = Record<string, string[]>;
export type Media = { type: "image" | "video"; src: string; alt: string; caption?: string; poster?: string };
export type Project = {
  title: string; slug: string; summary: string; tags: string[];
  metrics: { value: string; label: string }[];
  links: { label: string; href: string }[];
  embed?: { kind: "iframe" | "light2d"; src?: string; title: string; badge: string; hint: string };
  media: Media[]; featured: boolean; order: number; body: string;
};

export const getProfile = () => json<Profile>("profile.json");
export const getExperience = () => json<Experience[]>("experience.json");
export const getEducation = () => json<Education>("education.json");
export const getSkills = () => json<Skills>("skills.json");

export function getProjects(): Project[] {
  const pdir = path.join(dir, "projects");
  return fs
    .readdirSync(pdir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => {
      const { data, content } = matter(fs.readFileSync(path.join(pdir, f), "utf8"));
      return {
        ...data,
        tags: data.tags ?? [],
        metrics: data.metrics ?? [],
        links: data.links ?? [],
        media: data.media ?? [],
        body: content,
      } as Project;
    })
    .sort((a, b) => a.order - b.order);
}

export const getProject = (slug: string) => getProjects().find((p) => p.slug === slug);
