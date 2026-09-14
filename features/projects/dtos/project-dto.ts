import type { Project } from "@/types/projects";

export type ProjectListItem = Pick<
  Project,
  "id" | "name" | "slug" | "tagline" | "description" | "status" | "featured" | "authorId" | "techStack" | "frontendUrl" | "backendUrl" | "repositoryUrl" | "imageUrl" | "updatedAt"
>;

export type ProjectDetail = Project;

export function toListItem(project: Project): ProjectListItem {
  return {
    id: project.id,
    name: project.name,
    slug: project.slug,
    tagline: project.tagline,
    description: project.description,
    status: project.status,
    featured: project.featured,
    authorId: project.authorId,
    techStack: project.techStack,
    frontendUrl: project.frontendUrl,
    backendUrl: project.backendUrl,
    repositoryUrl: project.repositoryUrl,
    imageUrl: project.imageUrl,
    updatedAt: project.updatedAt,
  };
}

export function toDetail(project: Project): ProjectDetail {
  return { ...project };
}
