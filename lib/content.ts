import education from "@/content/education.json";
import experience from "@/content/experience.json";
import profile from "@/content/profile.json";
import skills from "@/content/skills.json";
import { projectBodyHtml, projects } from "@/content/projects.generated";

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

export const getProfile = (): Profile => profile;
export const getExperience = (): Experience[] => experience;
export const getEducation = (): Education => education;
export const getSkills = (): Skills => skills;
export const getProjects = (): Project[] => [...projects];
export const getProjectBodyHtml = (slug: string): string => projectBodyHtml[slug];

export const getProject = (slug: string) => getProjects().find((p) => p.slug === slug);
