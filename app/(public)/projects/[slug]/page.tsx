import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCachedProjectBySlug } from "@/lib/projects";
import ProjectHeader from "@/features/projects/sections/project-header";
import ProjectDetails from "@/features/projects/sections/project-details";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getCachedProjectBySlug(slug);
  if (!project) return { title: "Project Not Found" };

  return {
    title: `${project.name} — Gablura`,
    description: project.tagline,
  };
}

export const revalidate = 60;

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getCachedProjectBySlug(slug);
  if (!project) notFound();

  return (
    <>
      <ProjectHeader project={project} />
      <ProjectDetails project={project} />
    </>
  );
}
