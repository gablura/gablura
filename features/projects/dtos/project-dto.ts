import type { Project } from "@/types/projects";

export type ProjectListItem = Pick<
  Project,
  "id" | "name" | "slug" | "tagline" | "status" | "featured" | "authorId" | "techStack" | "updatedAt"
>;

export type ProjectDetail = Project;

export function toListItem(project: Project): ProjectListItem {
  return {
    id: project.id,
    name: project.name,
    slug: project.slug,
    tagline: project.tagline,
    status: project.status,
    featured: project.featured,
    authorId: project.authorId,
    techStack: project.techStack,
    updatedAt: project.updatedAt,
  };
}

export function toDetail(project: Project): ProjectDetail {
  return { ...project };
}
