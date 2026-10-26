import { ViewTransition } from "react";
import { getEducation, getExperience, getProfile, getProjects } from "@/lib/content";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";

export default function Home() {
  return (
    <ViewTransition enter={{ "to-project": "rise", default: "fade" }} exit={{ "to-project": "lift", default: "fade" }} default="none">
      <div>
        <Hero profile={getProfile()} experience={getExperience()} education={getEducation()} />
        <Projects projects={getProjects()} />
      </div>
    </ViewTransition>
  );
}
