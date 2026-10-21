import { getEducation, getExperience, getProfile, getProjects } from "@/lib/content";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";

export default function Home() {
  return (
    <>
      <Hero profile={getProfile()} education={getEducation()} experience={getExperience()} />
      <Projects projects={getProjects()} />
    </>
  );
}
