import { Metadata } from "next";
import { getCachedPublishedProjects } from "@/lib/projects";
import ProjectsHero from "@/features/projects/sections/projects-hero";
import ProjectsGrid from "@/features/projects/sections/projects-grid";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Products and applications built by Gablura. Real software solving real problems.",
  openGraph: {
    title: "Projects — Gablura",
    description:
      "Products and applications built by Gablura. Real software solving real problems.",
  },
  twitter: {
    title: "Projects — Gablura",
    description:
      "Products and applications built by Gablura. Real software solving real problems.",
  },
};

export const revalidate = 60;

export default async function ProjectsPage() {
  const projects = await getCachedPublishedProjects();

  return (
    <>
      <ProjectsHero count={projects.length} />
      <ProjectsGrid projects={projects} />
    </>
  );
}
