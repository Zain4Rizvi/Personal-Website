import { getProfile, getExperience, getEducation, getSkills, getProjects } from "@/lib/content";

export const dynamic = "force-static";

export function GET() {
  const projects = getProjects().map(({ body, ...p }) => ({ ...p, url: `/projects/${p.slug}`, body }));
  return Response.json(
    { profile: getProfile(), experience: getExperience(), education: getEducation(), skills: getSkills(), projects },
    { headers: { "Cache-Control": "public, max-age=3600" } },
  );
}
