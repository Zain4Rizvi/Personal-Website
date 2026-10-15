import { getProfile, getExperience, getEducation, getSkills, getProjects } from "@/lib/content";
import Hero from "@/components/Hero";
import ImpactMetrics from "@/components/ImpactMetrics";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Education from "@/components/Education";
import Skills from "@/components/Skills";
import About from "@/components/About";
import Contact from "@/components/Contact";

export default function Home() {
  const profile = getProfile();
  return (
    <>
      <Hero profile={profile} />
      <ImpactMetrics metrics={profile.metrics} />
      <Experience items={getExperience()} />
      <Projects projects={getProjects()} />
      <Education data={getEducation()} />
      <Skills skills={getSkills()} />
      <About profile={profile} />
      <Contact profile={profile} />
    </>
  );
}
