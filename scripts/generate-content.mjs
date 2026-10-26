import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { marked } from "marked";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const projectsDirectory = path.join(root, "content", "projects");
const projectFiles = fs.readdirSync(projectsDirectory).filter((file) => file.endsWith(".mdx"));
const projects = projectFiles.map((file) => {
  const { data, content } = matter(fs.readFileSync(path.join(projectsDirectory, file), "utf8"));
  return {
    ...data,
    tags: data.tags ?? [],
    metrics: data.metrics ?? [],
    links: data.links ?? [],
    media: data.media ?? [],
    body: content,
  };
}).sort((a, b) => a.order - b.order);

const mediaPath = (src) => path.join(root, "public", src.replace(/^\/+/, "").replaceAll("/", path.sep));
const availableProjectMedia = projects.flatMap((project) =>
  project.media.flatMap((media) => [media.src, media.poster].filter((src) => src && fs.existsSync(mediaPath(src)))),
);
const projectBodyHtml = Object.fromEntries(projects.map((project) => [
  project.slug,
  marked.parse(project.body.replace(/\{\/\*[\s\S]*?\*\/\}/g, ""), { async: false }),
]));

const generated = `export const projects: import("@/lib/content").Project[] = ${JSON.stringify(projects, null, 2)};\n\nexport const projectBodyHtml: Record<string, string> = ${JSON.stringify(projectBodyHtml, null, 2)};\n\nexport const availableProjectMedia = new Set<string>(${JSON.stringify(availableProjectMedia, null, 2)});\n`;
fs.writeFileSync(path.join(root, "content", "projects.generated.ts"), generated);
