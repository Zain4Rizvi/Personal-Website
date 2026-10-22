import { getExperience, getProfile, getProjects } from "@/lib/content";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";

export default function Home() {
  return (
    <>
      <Hero profile={getProfile()} experience={getExperience()} />
      <Projects projects={getProjects()} />
    </>
  );
}
