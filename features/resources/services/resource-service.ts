import type { ResourceType, ResourceFormData } from "@/types/resources";
import type { SessionUser } from "@/lib/auth-helpers";
import * as resourceRepo from "@/features/resources/repositories/resource-repository";
import { logAudit } from "@/lib/audit-log";
import { generateSlug } from "@/lib/slug";
import { toListItem, type ResourceListItem } from "@/features/resources/dtos/resource-dto";

export async function listByRole(
  type: ResourceType,
  caller: SessionUser
): Promise<ResourceListItem[]> {
  const query =
    caller.role === "owner"
      ? {}
      : caller.role === "admin"
        ? { $or: [{ authorId: caller.id }, { authorId: "system" }] }
        : { authorId: caller.id };
  const resources = await resourceRepo.findByTypeAndQuery(type, query);
  return resources.map(toListItem);
}

export function getById(type: ResourceType, id: string) {
  return resourceRepo.findById(type, id);
}

export function getRawById(type: ResourceType, id: string) {
  return resourceRepo.findRawById(type, id);
}

export function getBySlug(type: ResourceType, slug: string) {
  return resourceRepo.findBySlug(type, slug);
}

export async function create(
  type: ResourceType,
  data: ResourceFormData,
  caller: SessionUser
) {
  const slug = data.slug || generateSlug(data.name);
  const now = new Date();

  const id = await resourceRepo.insert(type, {
    type,
    name: data.name,
    slug,
    description: data.description,
    version: data.version || "0.1.0",
    repositoryUrl: data.repositoryUrl,
    documentation: data.documentation,
    authorId: caller.id,
    authorName: caller.name,
    status: data.status,
    featured: data.featured,
    createdAt: now,
    updatedAt: now,
  });

  logAudit({
    actor: caller.id,
    action: "RESOURCE_CREATED",
    resource: type,
    resourceId: id,
  });

  return id;
}

export async function update(
  type: ResourceType,
  id: string,
  data: ResourceFormData,
  caller: SessionUser
) {
  await resourceRepo.updateById(type, id, {
    name: data.name,
    description: data.description,
    version: data.version || "0.1.0",
    repositoryUrl: data.repositoryUrl,
    documentation: data.documentation,
    status: data.status,
    featured: data.featured,
    updatedAt: new Date(),
  });

  logAudit({
    actor: caller.id,
    action: "RESOURCE_UPDATED",
    resource: type,
    resourceId: id,
  });
}

export async function remove(
  type: ResourceType,
  id: string,
  caller: SessionUser
) {
  await resourceRepo.deleteById(type, id);

  logAudit({
    actor: caller.id,
    action: "RESOURCE_DELETED",
    resource: type,
    resourceId: id,
  });
}
