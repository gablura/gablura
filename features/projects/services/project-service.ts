import type { ProjectFormData } from "@/types/projects";
import type { SessionUser } from "@/lib/auth-helpers";
import * as projectRepo from "@/features/projects/repositories/project-repository";
import { logAudit } from "@/lib/audit-log";
import { generateSlug } from "@/lib/slug";
import { toListItem, type ProjectListItem } from "@/features/projects/dtos/project-dto";

export async function listByRole(caller: SessionUser): Promise<ProjectListItem[]> {
  const query =
    caller.role === "owner"
      ? {}
      : caller.role === "admin"
        ? { $or: [{ authorId: caller.id }, { authorId: "system" }] }
        : { authorId: caller.id };
  const projects = await projectRepo.findByQuery(query);
  return projects.map(toListItem);
}

export function getById(id: string) {
  return projectRepo.findById(id);
}

export function getRawById(id: string) {
  return projectRepo.findRawById(id);
}

export function getBySlug(slug: string) {
  return projectRepo.findBySlug(slug);
}

export async function create(data: ProjectFormData, caller: SessionUser) {
  const slug = data.slug || generateSlug(data.name);
  const techStack = data.techStack
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const now = new Date();

  const id = await projectRepo.insert({
    name: data.name,
    slug,
    tagline: data.tagline,
    description: data.description,
    techStack,
    frontendUrl: data.frontendUrl,
    backendUrl: data.backendUrl,
    repositoryUrl: data.repositoryUrl,
    imageUrl: data.imageUrl,
    featured: data.featured,
    status: data.status,
    authorId: caller.id,
    authorName: caller.name,
    createdAt: now,
    updatedAt: now,
  });

  logAudit({
    actor: caller.id,
    action: "PROJECT_CREATED",
    resource: "project",
    resourceId: id,
  });

  return id;
}

export async function update(
  id: string,
  data: ProjectFormData,
  caller: SessionUser
) {
  const techStack = data.techStack
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  await projectRepo.updateById(id, {
    name: data.name,
    tagline: data.tagline,
    description: data.description,
    techStack,
    frontendUrl: data.frontendUrl,
    backendUrl: data.backendUrl,
    repositoryUrl: data.repositoryUrl,
    imageUrl: data.imageUrl,
    featured: data.featured,
    status: data.status,
    updatedAt: new Date(),
  });

  logAudit({
    actor: caller.id,
    action: "PROJECT_UPDATED",
    resource: "project",
    resourceId: id,
  });
}

export async function remove(id: string, caller: SessionUser) {
  await projectRepo.deleteById(id);

  logAudit({
    actor: caller.id,
    action: "PROJECT_DELETED",
    resource: "project",
    resourceId: id,
  });
}
