import type { Resource } from "@/types/resources";

export type ResourceListItem = Pick<
  Resource,
  "id" | "type" | "name" | "slug" | "version" | "status" | "featured" | "authorId" | "updatedAt"
>;

export type ResourceDetail = Omit<Resource, "documentation"> & {
  documentation: Resource["documentation"];
};

export function toListItem(resource: Resource): ResourceListItem {
  return {
    id: resource.id,
    type: resource.type,
    name: resource.name,
    slug: resource.slug,
    version: resource.version,
    status: resource.status,
    featured: resource.featured,
    authorId: resource.authorId,
    updatedAt: resource.updatedAt,
  };
}

export function toDetail(resource: Resource): ResourceDetail {
  return {
    id: resource.id,
    type: resource.type,
    name: resource.name,
    slug: resource.slug,
    description: resource.description,
    version: resource.version,
    repositoryUrl: resource.repositoryUrl,
    documentation: resource.documentation,
    authorId: resource.authorId,
    authorName: resource.authorName,
    status: resource.status,
    featured: resource.featured,
    createdAt: resource.createdAt,
    updatedAt: resource.updatedAt,
  };
}
