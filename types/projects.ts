export type ProjectStatus = "active" | "archived" | "in-development";

export interface Project {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  techStack: string[];
  frontendUrl: string;
  backendUrl: string;
  repositoryUrl: string;
  imageUrl: string;
  featured: boolean;
  status: ProjectStatus;
  authorId: string;
  authorName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectFormData {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  techStack: string;
  frontendUrl: string;
  backendUrl: string;
  repositoryUrl: string;
  imageUrl: string;
  featured: boolean;
  status: ProjectStatus;
}

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  active: "Active",
  archived: "Archived",
  "in-development": "In Development",
};
